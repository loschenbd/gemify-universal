import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import * as Sentry from '@sentry/react-native'

export const clearAllStorage = async () => {
  try {
    // Clear AsyncStorage
    const asyncKeys = await AsyncStorage.getAllKeys()
    await AsyncStorage.multiRemove(asyncKeys)

    // Clear SecureStore
    const secureKeys = ['supabase-auth-token', 'supabase-auth-refresh-token'] // Add any other keys you're using
    for (const key of secureKeys) {
      await SecureStore.deleteItemAsync(key)
    }

    Sentry.addBreadcrumb({
      category: 'storage',
      message: 'Cleared all storage on logout',
      level: 'info',
    })

    console.log('All storage cleared successfully')
  } catch (error) {
    console.error('Error clearing storage:', error)
    Sentry.captureException(error)
  }
}
