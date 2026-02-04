import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
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
        };
      })
      .mutation(async ({ input }) => {
        const { saveQuizResponse } = await import('./db');
        const result = await saveQuizResponse(input);
        return { success: true, result };
      }),
  }),
});

export type AppRouter = typeof appRouter;
