/**
 * Validador de eventos da Conversions API do Facebook
 * Garante que os eventos estejam em conformidade com as melhores práticas
 */

export interface ConversionEvent {
  eventName: string;
  eventTime: number;
  actionSource: string;
  eventId: string;
  userData: {
    em?: string[];
    ph?: string[];
    fn?: string[];
    ln?: string[];
    ct?: string[];
    st?: string[];
    zp?: string[];
    country?: string[];
    ge?: string[];
    db?: string[];
    client_ip_address?: string;
    client_user_agent?: string;
    click_id?: string;
    fbc?: string;
    fbp?: string;
    external_id?: string;
  };
  customData?: {
    value?: number;
    currency?: string;
    [key: string]: unknown;
  };
}

/**
 * Validar se um evento tem parâmetros válidos
 * Combinações inválidas (conforme Facebook):
 * - ct + country + st + zp + ge + client_user_agent (apenas)
 * - db + client_user_agent (apenas)
 * - fn + ge (apenas)
 * - ln + ge (apenas)
 */
export function validateEventParameters(event: ConversionEvent): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const userData = event.userData || {};

  // Verificar parâmetros obrigatórios
  if (!event.eventName) errors.push("event_name é obrigatório");
  if (!event.eventTime) errors.push("event_time é obrigatório");
  if (!event.actionSource) errors.push("action_source é obrigatório");
  if (!event.eventId) errors.push("event_id é obrigatório para deduplicação");

  // Verificar se há pelo menos um parâmetro de cliente
  const hasClientParam = Boolean(
    userData.em ||
    userData.ph ||
    userData.fn ||
    userData.ln ||
    userData.ct ||
    userData.st ||
    userData.zp ||
    userData.country ||
    userData.ge ||
    userData.db ||
    userData.client_ip_address ||
    userData.client_user_agent ||
    userData.click_id ||
    userData.fbc ||
    userData.fbp ||
    userData.external_id
  );

  if (!hasClientParam) {
    errors.push("Pelo menos um parâmetro de cliente é obrigatório (email, telefone, IP, etc)");
  }

  // Validar combinações inválidas
  const hasOnlyGeoData = Boolean(
    (userData.ct || userData.country || userData.st || userData.zp || userData.ge || userData.client_user_agent) &&
    !userData.em &&
    !userData.ph &&
    !userData.fn &&
    !userData.ln &&
    !userData.db &&
    !userData.click_id &&
    !userData.fbc &&
    !userData.fbp &&
    !userData.external_id
  );

  if (hasOnlyGeoData) {
    errors.push("Combinação inválida: não envie apenas dados geográficos. Inclua email ou telefone.");
  }

  const hasOnlyDbAndUA = Boolean(
    userData.db &&
    userData.client_user_agent &&
    !userData.em &&
    !userData.ph &&
    !userData.fn &&
    !userData.ln &&
    !userData.ct &&
    !userData.st &&
    !userData.zp &&
    !userData.country &&
    !userData.ge
  );

  if (hasOnlyDbAndUA) {
    errors.push("Combinação inválida: não envie apenas db + user_agent. Inclua email ou telefone.");
  }

  const hasOnlyFnGe = Boolean(
    userData.fn &&
    userData.ge &&
    !userData.em &&
    !userData.ph &&
    !userData.ln &&
    !userData.ct &&
    !userData.st &&
    !userData.zp &&
    !userData.country &&
    !userData.db
  );

  if (hasOnlyFnGe) {
    errors.push("Combinação inválida: não envie apenas fn + ge. Inclua email ou telefone.");
  }

  const hasOnlyLnGe = Boolean(
    userData.ln &&
    userData.ge &&
    !userData.em &&
    !userData.ph &&
    !userData.fn &&
    !userData.ct &&
    !userData.st &&
    !userData.zp &&
    !userData.country &&
    !userData.db
  );

  if (hasOnlyLnGe) {
    errors.push("Combinação inválida: não envie apenas ln + ge. Inclua email ou telefone.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Preparar evento para envio à Conversions API
 * Valida e formata o evento corretamente
 */
export function prepareEventForAPI(event: ConversionEvent): {
  success: boolean;
  payload?: Record<string, unknown>;
  errors?: string[];
} {
  const validation = validateEventParameters(event);

  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime,
        action_source: event.actionSource,
        event_id: event.eventId,
        user_data: event.userData,
        ...(event.customData && Object.keys(event.customData).length > 0 && { custom_data: event.customData }),
      },
    ],
  };

  return {
    success: true,
    payload,
  };
}

/**
 * Calcular Event Match Quality Score (EMQ)
 * Baseado na quantidade e qualidade dos parâmetros de cliente
 */
export function calculateEventMatchQualityScore(userData: ConversionEvent["userData"]): number {
  let score = 0;
  const maxScore = 100;

  // Email = +30 pontos
  if (userData.em) score += 30;

  // Telefone = +25 pontos
  if (userData.ph) score += 25;

  // IP Address = +15 pontos
  if (userData.client_ip_address) score += 15;

  // User Agent = +10 pontos
  if (userData.client_user_agent) score += 10;

  // FBP = +20 pontos
  if (userData.fbp) score += 20;

  // FBC = +15 pontos
  if (userData.fbc) score += 15;

  // Click ID = +10 pontos
  if (userData.click_id) score += 10;

  // Nome = +10 pontos
  if (userData.fn && userData.ln) score += 10;

  // External ID = +5 pontos
  if (userData.external_id) score += 5;

  return Math.min(score, maxScore);
}

/**
 * Gerar recomendações para melhorar Event Match Quality
 */
export function getEMQRecommendations(userData: ConversionEvent["userData"]): string[] {
  const recommendations: string[] = [];

  if (!userData.em) {
    recommendations.push("Adicione email (em) para aumentar match rate em +30%");
  }

  if (!userData.ph) {
    recommendations.push("Adicione telefone (ph) para aumentar match rate em +25%");
  }

  if (!userData.client_ip_address) {
    recommendations.push("Adicione IP address para aumentar match rate em +15%");
  }

  if (!userData.client_user_agent) {
    recommendations.push("Adicione user agent para aumentar match rate em +10%");
  }

  if (!userData.fbp) {
    recommendations.push("Mantenha FBP atualizado para aumentar match rate em +20%");
  }

  if (!userData.fbc) {
    recommendations.push("Mantenha FBC atualizado para aumentar match rate em +15%");
  }

  if (!userData.fn || !userData.ln) {
    recommendations.push("Adicione nome completo para aumentar match rate em +10%");
  }

  return recommendations;
}
