import { initTRPC, TRPCError } from '@trpc/server'
import type { AppContext } from './context'

const t = initTRPC.context<AppContext>().create()

export const router = t.router
export const publicProcedure = t.procedure

/** Requires a valid Cognito (or local-dev) access token. Narrows `userId` to string. */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Sign in required' })
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId
    }
  })
})
