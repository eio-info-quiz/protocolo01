import { useEffect, useState } from 'react';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
}

/**
 * Hook para capturar e armazenar parâmetros UTM e FBCLID da URL
 * Armazena os parâmetros no localStorage para uso posterior
 */
export function useUtmParams() {
  const [params, setParams] = useState<UtmParams>({});

  useEffect(() => {
    // Capturar parâmetros da URL
    const searchParams = new URLSearchParams(window.location.search);
    
    const utmParams: UtmParams = {
      utm_source: searchParams.get('utm_source') || undefined,
      utm_medium: searchParams.get('utm_medium') || undefined,
      utm_campaign: searchParams.get('utm_campaign') || undefined,
      utm_content: searchParams.get('utm_content') || undefined,
      utm_term: searchParams.get('utm_term') || undefined,
      fbclid: searchParams.get('fbclid') || undefined,
      gclid: searchParams.get('gclid') || undefined,
    };

    // Remover propriedades undefined
    Object.keys(utmParams).forEach(
      key => utmParams[key as keyof UtmParams] === undefined && delete utmParams[key as keyof UtmParams]
    );

    // Armazenar no localStorage
    if (Object.keys(utmParams).length > 0) {
      localStorage.setItem('utm_params', JSON.stringify(utmParams));
      localStorage.setItem('utm_timestamp', new Date().toISOString());
    }

    setParams(utmParams);
  }, []);

  // Função para obter parâmetros armazenados
  const getStoredParams = (): UtmParams => {
    const stored = localStorage.getItem('utm_params');
    return stored ? JSON.parse(stored) : {};
  };

  // Função para limpar parâmetros
  const clearParams = () => {
    localStorage.removeItem('utm_params');
    localStorage.removeItem('utm_timestamp');
    setParams({});
  };

  return {
    params,
    getStoredParams,
    clearParams,
    fbclid: params.fbclid,
    utm_source: params.utm_source,
    utm_campaign: params.utm_campaign,
  };
}
