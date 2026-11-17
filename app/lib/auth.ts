/**
 * Returns the access token to send as `Authorization: Bearer …`.
 *
 * Local (pre-Cognito): EXPO_PUBLIC_LOCAL_USER_ID → `local:<id>`
 * Production: swap this for Cognito / Amplify `fetchAuthSession().tokens.accessToken`.
 */
export async function getAccessToken(): Promise<string | null> {
  const localUserId = process.env.EXPO_PUBLIC_LOCAL_USER_ID
  if (localUserId) {
    return `local:${localUserId}`
  }

  // TODO: Cognito access token once Amplify Auth is wired.
  return null
}
