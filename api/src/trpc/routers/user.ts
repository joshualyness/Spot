import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

function toPublicUser(user: {
  userId: string
  firstName: string
  lastName: string
  email: string
}) {
  return {
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  }
}

/**
 * All procedures are protected and always operate on `ctx.userId`
 * (the signed-in Cognito user). Callers cannot pass another user's id.
 */
export const userRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.userService.getUser(ctx.userId)
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    return toPublicUser(user)
  }),

  update: protectedProcedure
    .input(
      z
        .object({
          firstName: z.string().min(1).optional(),
          lastName: z.string().min(1).optional()
        })
        .refine(value => value.firstName !== undefined || value.lastName !== undefined, {
          message: 'Provide firstName and/or lastName'
        })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.userService.updateUser(ctx.userId, input)
      return toPublicUser(user)
    }),

  delete: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.userService.deleteUser(ctx.userId)
    return { ok: true as const }
  })
})
