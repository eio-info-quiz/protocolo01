import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook para rastreamento de eventos do Facebook Pixel
 * Rastreia automaticamente PageView e permite rastreamento de eventos customizados
 */
export function usePixelTracking() {
  const [location] = useLocation();

  // Rastrear PageView quando a rota muda
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [location]);

  // Função para rastrear eventos customizados
  const trackEvent = (eventName: string, data?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', eventName, data || {});
    }
  };

  // Função para rastrear ViewContent (quando usuário vê o quiz)
  const trackViewContent = () => {
    trackEvent('ViewContent', {
      content_name: 'Quiz Sono Infantil',
      content_category: 'Quiz',
      value: 0,
      currency: 'BRL',
    });
  };

  // Função para rastrear AddToCart (quando usuário completa o quiz)
  const trackAddToCart = (quizData?: Record<string, any>) => {
    trackEvent('AddToCart', {
      content_name: 'Quiz Sono Infantil Completo',
      content_category: 'Quiz',
      value: 0,
      currency: 'BRL',
      ...quizData,
    });
  };

  // Função para rastrear CompleteRegistration (quando usuário submete email)
  const trackCompleteRegistration = (email?: string) => {
    trackEvent('CompleteRegistration', {
      content_name: 'Quiz Sono Infantil',
      status: 'completed',
      email: email || '',
    });
  };

  // Função para rastrear Purchase (quando usuário compra via Hotmart)
  const trackPurchase = (value: number, orderId?: string) => {
    trackEvent('Purchase', {
      content_name: 'Protocolo Sono Infantil',
      content_category: 'Produto',
      value: value,
      currency: 'BRL',
      content_id: orderId || '',
    });
  };

  // Função para rastrear Lead (quando usuário se interessa)
  const trackLead = (email?: string) => {
    trackEvent('Lead', {
      content_name: 'Quiz Sono Infantil',
      content_category: 'Quiz',
      email: email || '',
    });
  };

  return {
    trackEvent,
    trackViewContent,
    trackAddToCart,
    trackCompleteRegistration,
    trackPurchase,
    trackLead,
  };
}
