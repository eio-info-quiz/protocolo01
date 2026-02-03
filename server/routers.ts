import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  quiz: router({
    submitResponse: publicProcedure
      .input((data: unknown) => {
        if (typeof data !== 'object' || data === null) throw new Error('Invalid input');
        const obj = data as Record<string, unknown>;
        return {
          email: String(obj.email || ''),
          name: obj.name ? String(obj.name) : undefined,
          babyAge: String(obj.babyAge || ''),
          wakeUps: String(obj.wakeUps || ''),
          sleepMethod: String(obj.sleepMethod || ''),
          hasRoutine: String(obj.hasRoutine || ''),
          motherFeeling: String(obj.motherFeeling || ''),
          triedOtherMethods: String(obj.triedOtherMethods || ''),
          fbclid: obj.fbclid ? String(obj.fbclid) : undefined,
        };
      })
      .mutation(async ({ input }) => {
        const { saveQuizResponse } = await import('./db');
        const result = await saveQuizResponse(input);
        return { success: true, result };
      }),
  }),

  facebook: router({
    trackEvent: publicProcedure
      .input((data: unknown) => {
        if (typeof data !== 'object' || data === null) throw new Error('Invalid input');
        const obj = data as Record<string, unknown>;
        return {
          eventName: String(obj.eventName || ''),
          email: obj.email ? String(obj.email) : undefined,
          phone: obj.phone ? String(obj.phone) : undefined,
          fbclid: obj.fbclid ? String(obj.fbclid) : undefined,
          value: obj.value ? Number(obj.value) : undefined,
          currency: obj.currency ? String(obj.currency) : 'BRL',
        };
      })
      .mutation(async ({ input }) => {
        try {
          const pixelId = process.env.FACEBOOK_PIXEL_ID;
          const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
          
          if (!pixelId || !accessToken) {
            console.warn('[Facebook] Missing pixel ID or access token');
            return { success: false, error: 'Missing credentials' };
          }

          // Hash sensitive data for Facebook
          const hashData = (data: string): string => {
            const crypto = require('crypto');
            return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
          };

          const userData: Record<string, string> = {};
          if (input.email) userData.em = hashData(input.email);
          if (input.phone) userData.ph = hashData(input.phone.replace(/\D/g, ''));

          const payload = {
            data: [{
              event_name: input.eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: `${Date.now()}-${Math.random()}`,
              user_data: userData,
              ...(input.fbclid && { click_id: input.fbclid }),
              ...(input.value && { custom_data: { value: input.value, currency: input.currency } }),
            }],
          };

          const response = await fetch(
            `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            }
          );

          const result = await response.json();
          return { success: response.ok, result };
        } catch (error) {
          console.error('[Facebook] Error tracking event:', error);
          return { success: false, error: String(error) };
        }
      }),
  }),

  hotmart: router({
    webhook: publicProcedure
      .input((data: unknown) => {
        if (typeof data !== 'object' || data === null) throw new Error('Invalid input');
        const obj = data as Record<string, unknown>;
        return {
          email: String(obj.email || ''),
          phone: obj.phone ? String(obj.phone) : undefined,
          name: obj.name ? String(obj.name) : undefined,
          amount: Number(obj.amount || 0),
          orderId: String(obj.orderId || ''),
          status: String(obj.status || 'approved'),
        };
      })
      .mutation(async ({ input }) => {
        try {
          const { getQuizResponsesByEmail } = await import('./db');
          
          // Buscar FBCLID do usuário
          const responses = await getQuizResponsesByEmail(input.email);
          const fbclid = responses.length > 0 ? responses[0].fbclid : undefined;

          // Enviar para Facebook com dados enriquecidos
          const facebookResult = await fetch(
            `${process.env.BUILT_IN_FORGE_API_URL}/facebook/track-event`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
              },
              body: JSON.stringify({
                eventName: 'Purchase',
                email: input.email,
                phone: input.phone,
                fbclid: fbclid,
                value: input.amount,
                currency: 'BRL',
              }),
            }
          ).catch(() => ({ ok: false }));

          return { 
            success: true, 
            facebookTracked: facebookResult?.ok || false,
            fbclid: fbclid || null,
          };
        } catch (error) {
          console.error('[Hotmart] Error processing webhook:', error);
          return { success: false, error: String(error) };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
