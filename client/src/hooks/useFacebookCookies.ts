import { useEffect, useState, useCallback } from 'react';

export interface FacebookCookies {
  fbp?: string;
  fbc?: string;
}

/**
 * Hook para capturar e manter FBP/FBC atualizados
 * FBP e FBC mudam frequentemente e devem ser atualizados regularmente
 * Atualiza a cada 5 minutos conforme recomendação do Facebook
 */
export function useFacebookCookies() {
  const [cookies, setCookies] = useState<FacebookCookies>({});
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  const getCookieValue = useCallback((cookieName: string): string | undefined => {
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${cookieName}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
      }
    } catch (error) {
      console.warn(`[Facebook Cookies] Error reading ${cookieName}:`, error);
    }
    return undefined;
  }, []);

  const updateCookies = useCallback(() => {
    try {
      const fbp = getCookieValue('_fbp');
      const fbc = getCookieValue('_fbc');

      const newCookies: FacebookCookies = {};
      if (fbp) newCookies.fbp = fbp;
      if (fbc) newCookies.fbc = fbc;

      setCookies(newCookies);
      setLastUpdate(Date.now());

      // Armazenar no localStorage para uso posterior
      if (Object.keys(newCookies).length > 0) {
        localStorage.setItem('facebook_cookies', JSON.stringify(newCookies));
        localStorage.setItem('facebook_cookies_updated', new Date().toISOString());
      }

      return newCookies;
    } catch (error) {
      console.error('[Facebook Cookies] Error updating cookies:', error);
      return {};
    }
  }, [getCookieValue]);

  // Atualizar cookies no mount
  useEffect(() => {
    updateCookies();
  }, [updateCookies]);

  // Atualizar cookies a cada 5 minutos (conforme recomendação do Facebook)
  useEffect(() => {
    const interval = setInterval(() => {
      updateCookies();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [updateCookies]);

  // Função para obter cookies armazenados
  const getStoredCookies = useCallback((): FacebookCookies => {
    try {
      const stored = localStorage.getItem('facebook_cookies');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('[Facebook Cookies] Error reading stored cookies:', error);
      return {};
    }
  }, []);

  // Função para forçar atualização
  const refresh = useCallback(() => {
    return updateCookies();
  }, [updateCookies]);

  return {
    cookies,
    fbp: cookies.fbp,
    fbc: cookies.fbc,
    lastUpdate,
    getStoredCookies,
    refresh,
  };
}
