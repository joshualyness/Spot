import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../api/src/trpc/router'
import { Platform } from 'react-native'
import { getAccessToken } from './auth'

export const trpc = createTRPCReact<AppRouter>()

/**
 * Android emulator reaches the host machine via 10.0.2.2.
 * iOS simulator can use localhost. Physical devices need EXPO_PUBLIC_API_URL.
 */
function getApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/trpc'
  }

  return 'http://localhost:4000/trpc'
}

export function createTrpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: getApiUrl(),
        async headers() {
          const token = await getAccessToken()
          return token ? { Authorization: `Bearer ${token}` } : {}
        }
      })
    ]
  })
}
