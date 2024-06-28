// packages/app/features/settings/logout.native.ts

import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Sentry from '@sentry/react-native'
import * as SecureStore from 'expo-secure-store'

export const logoutHelper = async () => {
  try {
    // Clear Supabase auth data from AsyncStorage
    const asyncKeys = await AsyncStorage.getAllKeys()
    const supabaseAuthKeys = asyncKeys.filter((key) => key.startsWith('supabase.auth.'))
    if (supabaseAuthKeys.length > 0) {
      await AsyncStorage.multiRemove(supabaseAuthKeys)
    }

    // Clear Supabase auth data from SecureStore
    const secureKeys = ['supabase-auth-token', 'supabase-auth-refresh-token']
    for (const key of secureKeys) {
      await SecureStore.deleteItemAsync(key)
    }

    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'Cleared Supabase auth data on logout',
      level: 'info',
    })

    console.log('Supabase auth data cleared successfully')
  } catch (error) {
    console.error('Error clearing Supabase auth data:', error)
    Sentry.captureException(error)
  }
}
