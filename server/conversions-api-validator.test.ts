import { describe, it, expect } from 'vitest';
import {
  validateEventParameters,
  prepareEventForAPI,
  calculateEventMatchQualityScore,
  getEMQRecommendations,
  type ConversionEvent,
} from './conversions-api-validator';

describe('Conversions API Validator', () => {
  describe('validateEventParameters', () => {
    it('should validate a complete valid event', () => {
      const event: ConversionEvent = {
        eventName: 'Purchase',
        eventTime: Math.floor(Date.now() / 1000),
        actionSource: 'website',
        eventId: 'order-123',
        userData: {
          em: ['hash_email'],
          ph: ['hash_phone'],
          client_user_agent: 'Mozilla/5.0...',
          fbp: 'fb.1.1234567890',
          fbc: 'fb.1.1234567890',
        },
      };

      const result = validateEventParameters(event);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject event without required parameters', () => {
      const event: ConversionEvent = {
        eventName: '',
        eventTime: 0,
        actionSource: '',
        eventId: '',
        userData: {},
      };

      const result = validateEventParameters(event);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject event without client parameters', () => {
      const event: ConversionEvent = {
        eventName: 'Purchase',
        eventTime: Math.floor(Date.now() / 1000),
        actionSource: 'website',
        eventId: 'order-123',
        userData: {},
      };

      const result = validateEventParameters(event);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Pelo menos um parâmetro de cliente é obrigatório (email, telefone, IP, etc)'
      );
    });

    it('should reject invalid combination: only geo data', () => {
      const event: ConversionEvent = {
        eventName: 'Purchase',
        eventTime: Math.floor(Date.now() / 1000),
        actionSource: 'website',
        eventId: 'order-123',
        userData: {
          ct: ['New York'],
          country: ['US'],
          st: ['NY'],
          zp: ['10001'],
          ge: ['m'],
          client_user_agent: 'Mozilla/5.0...',
        },
      };

      const result = validateEventParameters(event);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('dados geográficos'))).toBe(true);
    });

    it('should reject invalid combination: only db + user_agent', () => {
      const event: ConversionEvent = {
        eventName: 'Purchase',
        eventTime: Math.floor(Date.now() / 1000),
        actionSource: 'website',
        eventId: 'order-123',
        userData: {
          db: ['1990-01-15'],
          client_user_agent: 'Mozilla/5.0...',
        },
      };

      const result = validateEventParameters(event);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('db + user_agent'))).toBe(true);
    });

    it('should reject invalid combination: only fn + ge', () => {
      const event: ConversionEvent = {
        eventName: 'Purchase',
        eventTime: Math.floor(Date.now() / 1000),
        actionSource: 'website',
        eventId: 'order-123',
        userData: {
          fn: ['John'],
          ge: ['m'],
        },
      };

      const result = validateEventParameters(event);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('fn + ge'))).toBe(true);
    });

    it('should reject invalid combination: only ln + ge', () => {
      const event: ConversionEvent = {
        eventName: 'Purchase',
        eventTime: Math.floor(Date.now() / 1000),
        actionSource: 'website',
        eventId: 'order-123',
        userData: {
          ln: ['Doe'],
          ge: ['m'],
        },
      };

      const result = validateEventParameters(event);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('ln + ge'))).toBe(true);
    });

    it('should accept valid combination with email', () => {
      const event: ConversionEvent = {
        eventName: 'Purchase',
        eventTime: Math.floor(Date.now() / 1000),
        actionSource: 'website',
        eventId: 'order-123',
        userData: {
          em: ['hash_email'],
          fn: ['John'],
          ge: ['m'],
        },
      };

      const result = validateEventParameters(event);
      expect(result.isValid).toBe(true);
    });
  });

  describe('prepareEventForAPI', () => {
    it('should prepare a valid event for API', () => {
      const event: ConversionEvent = {
        eventName: 'Purchase',
        eventTime: Math.floor(Date.now() / 1000),
        actionSource: 'website',
        eventId: 'order-123',
        userData: {
          em: ['hash_email'],
        },
        customData: {
          value: 47.90,
          currency: 'BRL',
        },
      };

      const result = prepareEventForAPI(event);
      expect(result.success).toBe(true);
      expect(result.payload).toBeDefined();
      expect(result.payload?.data).toHaveLength(1);
      expect(result.payload?.data[0].event_name).toBe('Purchase');
    });

    it('should reject invalid event', () => {
      const event: ConversionEvent = {
        eventName: '',
        eventTime: 0,
        actionSource: '',
        eventId: '',
        userData: {},
      };

      const result = prepareEventForAPI(event);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });
  });

  describe('calculateEventMatchQualityScore', () => {
    it('should calculate 0 for empty user data', () => {
      const userData = {};
      const score = calculateEventMatchQualityScore(userData);
      expect(score).toBe(0);
    });

    it('should calculate 30 for email only', () => {
      const userData = { em: ['hash_email'] };
      const score = calculateEventMatchQualityScore(userData);
      expect(score).toBe(30);
    });

    it('should calculate 55 for email + phone', () => {
      const userData = {
        em: ['hash_email'],
        ph: ['hash_phone'],
      };
      const score = calculateEventMatchQualityScore(userData);
      expect(score).toBe(55);
    });

    it('should calculate max 100 for all parameters', () => {
      const userData = {
        em: ['hash_email'],
        ph: ['hash_phone'],
        fn: ['John'],
        ln: ['Doe'],
        client_ip_address: '192.168.1.1',
        client_user_agent: 'Mozilla/5.0...',
        fbp: 'fb.1.1234567890',
        fbc: 'fb.1.1234567890',
        click_id: 'IwAR0...',
        external_id: 'user-123',
      };
      const score = calculateEventMatchQualityScore(userData);
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBeGreaterThan(90);
    });
  });

  describe('getEMQRecommendations', () => {
    it('should recommend all parameters for empty user data', () => {
      const userData = {};
      const recommendations = getEMQRecommendations(userData);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.some(r => r.includes('email'))).toBe(true);
      expect(recommendations.some(r => r.includes('telefone'))).toBe(true);
    });

    it('should recommend missing parameters', () => {
      const userData = {
        em: ['hash_email'],
      };
      const recommendations = getEMQRecommendations(userData);
      expect(recommendations.some(r => r.includes('telefone'))).toBe(true);
      expect(recommendations.some(r => r.includes('IP'))).toBe(true);
    });

    it('should have no recommendations for complete user data', () => {
      const userData = {
        em: ['hash_email'],
        ph: ['hash_phone'],
        fn: ['John'],
        ln: ['Doe'],
        client_ip_address: '192.168.1.1',
        client_user_agent: 'Mozilla/5.0...',
        fbp: 'fb.1.1234567890',
        fbc: 'fb.1.1234567890',
      };
      const recommendations = getEMQRecommendations(userData);
      expect(recommendations.length).toBe(0);
    });
  });
});
