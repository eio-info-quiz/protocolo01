import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('usePixelTracking', () => {
  beforeEach(() => {
    // Mock do Facebook Pixel
    (window as any).fbq = vi.fn();
  });

  it('should have fbq function available', () => {
    expect((window as any).fbq).toBeDefined();
  });

  it('should track ViewContent event', () => {
    const fbq = (window as any).fbq;
    fbq('track', 'ViewContent', {
      content_name: 'Quiz Sono Infantil',
      content_category: 'Quiz',
      value: 0,
      currency: 'BRL',
    });

    expect(fbq).toHaveBeenCalledWith('track', 'ViewContent', expect.objectContaining({
      content_name: 'Quiz Sono Infantil',
      content_category: 'Quiz',
    }));
  });

  it('should track Purchase event with value', () => {
    const fbq = (window as any).fbq;
    fbq('track', 'Purchase', {
      content_name: 'Protocolo Sono Infantil',
      content_category: 'Produto',
      value: 47.90,
      currency: 'BRL',
      content_id: 'order-123',
    });

    expect(fbq).toHaveBeenCalledWith('track', 'Purchase', expect.objectContaining({
      value: 47.90,
      currency: 'BRL',
    }));
  });

  it('should track CompleteRegistration event', () => {
    const fbq = (window as any).fbq;
    fbq('track', 'CompleteRegistration', {
      content_name: 'Quiz Sono Infantil',
      status: 'completed',
      email: 'test@example.com',
    });

    expect(fbq).toHaveBeenCalledWith('track', 'CompleteRegistration', expect.any(Object));
  });

  it('should track Lead event', () => {
    const fbq = (window as any).fbq;
    fbq('track', 'Lead', {
      content_name: 'Quiz Sono Infantil',
      content_category: 'Quiz',
      email: 'test@example.com',
    });

    expect(fbq).toHaveBeenCalledWith('track', 'Lead', expect.any(Object));
  });

  it('should initialize pixel with ID', () => {
    const fbq = (window as any).fbq;
    const pixelId = '1524547791957989';
    fbq('init', pixelId);

    expect(fbq).toHaveBeenCalledWith('init', pixelId);
  });
});
