import { z } from 'zod'
import { publicProcedure, protectedProcedure, router } from '../trpc'

const DEMO_USER_ID = 'demo-user'

export const userRouter = router({
  /**
   * Public demo profile for local Expo wiring before Cognito auth is connected.
   * Seeds a demo user when the DynamoDB table is available.
   */
  demo: publicProcedure.query(async ({ ctx }) => {
    if (!process.env.DYNAMODB_TABLE_NAME) {
      return {
        userId: DEMO_USER_ID,
        firstName: 'Alex',
        lastName: 'Spot',
        email: 'alex@spot.local'
      }
    }

    const user = await ctx.userService.ensureUser({
      userId: DEMO_USER_ID,
      email: 'alex@spot.local',
      firstName: 'Alex',
      lastName: 'Spot'
    })

    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.userService.getById(ctx.userId)
    if (!user) {
      return null
    }

    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  }),

  updateNames: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.userService.updateNames(ctx.userId, input.firstName, input.lastName)
      return {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    })
})
