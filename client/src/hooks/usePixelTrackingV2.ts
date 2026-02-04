import { useCallback, useRef } from 'react';
import { useFacebookCookies } from './useFacebookCookies';
import { useUtmParams } from './useUtmParams';
import crypto from 'crypto';

export interface PixelEventData {
  eventName: string;
  email?: string;
  phone?: string;
  value?: number;
  currency?: string;
  customData?: Record<string, unknown>;
  eventId?: string;
  externalId?: string;
}

/**
 * Hook melhorado para rastreamento com Redundant Setup
 * Envia eventos via Pixel + Conversions API com deduplicação
 */
export function usePixelTrackingV2() {
  const { fbp, fbc, refresh: refreshCookies } = useFacebookCookies();
  const { fbclid, getStoredParams } = useUtmParams();
  const eventIdMapRef = useRef<Map<string, string>>(new Map());

  // Gerar hash SHA256 (client-side)
  const hashValue = useCallback((value: string): string => {
    try {
      // No navegador, usar SubtleCrypto API
      if (typeof window !== 'undefined' && window.crypto?.subtle) {
        // Usar TextEncoder para converter string em bytes
        const encoder = new TextEncoder();
        const data = encoder.encode(value.toLowerCase().trim());
        
        // Retornar promise que resolve com hash
        return new Promise((resolve) => {
          window.crypto.subtle.digest('SHA-256', data).then((hashBuffer) => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            resolve(hashHex);
          });
        }) as any;
      }
    } catch (error) {
      console.warn('[Pixel Tracking] Error hashing value:', error);
    }
    return value; // Fallback se não conseguir hasher
  }, []);

  // Gerar event_id único para deduplicação
  const generateEventId = useCallback((eventName: string, timestamp: number): string => {
    const id = `${eventName}-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
    eventIdMapRef.current.set(eventName, id);
    return id;
  }, []);

  // Rastrear evento via Pixel (redundant setup)
  const trackViaPixel = useCallback((eventName: string, data: Record<string, unknown>, eventId: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        const fbq = (window as any).fbq;
        
        // Enviar evento base
        const pixelData: Record<string, unknown> = {
          content_name: data.content_name || eventName,
          content_category: data.content_category || 'Quiz',
          event_id: eventId,
        };

        if (data.value) pixelData.value = data.value;
        if (data.currency) pixelData.currency = data.currency;
        
        fbq('track', eventName, pixelData);
      }
    } catch (error) {
      console.error('[Pixel Tracking] Error tracking via Pixel:', error);
    }
  }, []);

  // Rastrear evento via Conversions API (redundant setup)
  const trackViaAPI = useCallback(async (eventData: PixelEventData) => {
    try {
      // Gerar event_id se não fornecido
      const eventId = eventData.eventId || generateEventId(eventData.eventName, Math.floor(Date.now() / 1000));

      // Preparar user_data com hash
      const userData: Record<string, unknown> = {};
      
      if (eventData.email) {
        userData.em = [await hashValue(eventData.email)];
      }
      
      if (eventData.phone) {
        userData.ph = [await hashValue(eventData.phone.replace(/\D/g, ''))];
      }

      // Adicionar parâmetros do navegador (NÃO hasheados)
      if (typeof window !== 'undefined') {
        userData.client_user_agent = navigator.userAgent;
      }

      // Adicionar cookies do Facebook
      if (fbp) userData.fbp = fbp;
      if (fbc) userData.fbc = fbc;
      if (fbclid) userData.click_id = fbclid;

      // Adicionar external_id se disponível
      if (eventData.externalId) {
        userData.external_id = eventData.externalId;
      }

      const customDataObj = eventData.customData || {};

      // Preparar payload
      const payloadData: Record<string, unknown> = {
        event_name: eventData.eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_id: eventId,
        user_data: userData,
      };

      if (Object.keys(customDataObj).length > 0) {
        payloadData.custom_data = customDataObj;
      }

      const payload = { data: [payloadData] };

      // Enviar para API (será processado pelo servidor)
      const response = await fetch('/api/trpc/facebook.trackEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: eventData.eventName,
          email: eventData.email,
          phone: eventData.phone,
          fbclid: fbclid,
          value: eventData.value,
          currency: eventData.currency,
          eventId: eventId,
          fbp: fbp,
          fbc: fbc,
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        }),
      });

      if (!response.ok) {
        console.warn('[Pixel Tracking] API response not ok:', response.status);
      }

      return { success: response.ok, eventId };
    } catch (error) {
      console.error('[Pixel Tracking] Error tracking via API:', error);
      return { success: false, error: String(error) };
    }
  }, [fbp, fbc, fbclid, hashValue, generateEventId]);

  // Rastrear evento (redundant setup - Pixel + API)
  const trackEvent = useCallback(async (eventData: PixelEventData) => {
    try {
      // Atualizar cookies antes de rastrear
      await refreshCookies();

      // Gerar event_id único
      const eventId = eventData.eventId || generateEventId(eventData.eventName, Math.floor(Date.now() / 1000));

      // Enviar via Pixel
      trackViaPixel(eventData.eventName, {
        content_name: eventData.eventName,
        content_category: 'Quiz',
        value: eventData.value,
        currency: eventData.currency,
      }, eventId);

      // Enviar via API (com deduplicação)
      const apiResult = await trackViaAPI({
        ...eventData,
        eventId: eventId,
      });

      return apiResult;
    } catch (error) {
      console.error('[Pixel Tracking] Error in trackEvent:', error);
      return { success: false, error: String(error) };
    }
  }, [trackViaPixel, trackViaAPI, refreshCookies, generateEventId]);

  // Rastrear ViewContent
  const trackViewContent = useCallback(async () => {
    return trackEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Quiz Sono Infantil',
        content_category: 'Quiz',
      },
    });
  }, [trackEvent]);

  // Rastrear CompleteRegistration
  const trackCompleteRegistration = useCallback(async () => {
    return trackEvent({
      eventName: 'CompleteRegistration',
      customData: {
        content_name: 'Quiz Sono Infantil',
        status: 'completed',
      },
    });
  }, [trackEvent]);

  // Rastrear Purchase
  const trackPurchase = useCallback(async (value: number, currency: string = 'BRL') => {
    return trackEvent({
      eventName: 'Purchase',
      value: value,
      currency: currency,
      customData: {
        content_name: 'Protocolo Sono Infantil',
        content_category: 'Produto',
      },
    });
  }, [trackEvent]);

  // Rastrear Lead
  const trackLead = useCallback(async (email?: string, phone?: string) => {
    return trackEvent({
      eventName: 'Lead',
      email: email,
      phone: phone,
      customData: {
        content_name: 'Quiz Sono Infantil',
      },
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackViewContent,
    trackCompleteRegistration,
    trackPurchase,
    trackLead,
    fbp,
    fbc,
    fbclid,
  };
}
