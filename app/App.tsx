import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { createTrpcClient, trpc } from './lib/trpc'

function UserName() {
  const { data, isLoading, error } = trpc.user.get.useQuery()

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return (
      <Text style={styles.error}>
        Could not load user: {error.message}
        {'\n'}
        Set EXPO_PUBLIC_LOCAL_USER_ID for local auth, or sign in with Cognito.
      </Text>
    )
  }

  return (
    <View style={styles.nameBlock}>
      <Text style={styles.label}>First name</Text>
      <Text style={styles.value}>{data?.firstName || '—'}</Text>
      <Text style={styles.label}>Last name</Text>
      <Text style={styles.value}>{data?.lastName || '—'}</Text>
    </View>
  )
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() => createTrpcClient())

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <View style={styles.container}>
          <Text style={styles.title}>Spot</Text>
          <UserName />
          <StatusBar style="auto" />
        </View>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 24,
    color: '#111'
  },
  nameBlock: {
    alignItems: 'center',
    gap: 4
  },
  label: {
    marginTop: 12,
    fontSize: 13,
    color: '#667'
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111'
  },
  error: {
    color: '#b00020',
    textAlign: 'center',
    lineHeight: 20
  }
})
