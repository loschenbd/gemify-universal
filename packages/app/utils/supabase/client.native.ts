import { Database } from '@my/supabase/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Sentry from '@sentry/react-native'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import 'react-native-url-polyfill/auto'

import { replaceLocalhost } from '../getLocalhost.native'

if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  throw new Error(
    `EXPO_PUBLIC_SUPABASE_URL is not set. Please update the root .env.local and restart the server.`
  )
}

if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error(
    `EXPO_PUBLIC_SUPABASE_ANON_KEY is not set. Please update the root .env.local and restart the server.`
  )
}

const supabaseUrl = replaceLocalhost(process.env.EXPO_PUBLIC_SUPABASE_URL)

const defaultOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
}

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      const value = await SecureStore.getItemAsync(key, defaultOptions)
      Sentry.addBreadcrumb({
        category: 'secureStore',
        message: 'Retrieved item from SecureStore',
        data: { key, value },
      })
      return value
    } catch (error) {
      console.error('Error retrieving from SecureStore:', key, error)
      Sentry.captureException(error)
      throw error
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value, defaultOptions)
      Sentry.addBreadcrumb({
        category: 'secureStore',
        message: 'Stored item in SecureStore',
        data: { key },
      })
    } catch (error) {
      Sentry.captureException(error)
      throw error
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key, defaultOptions)
      Sentry.addBreadcrumb({
        category: 'secureStore',
        message: 'Removed item from SecureStore',
        data: { key },
      })
    } catch (error) {
      Sentry.captureException(error)
      throw error
    }
  },
}

export const supabase = createClient<Database>(
  supabaseUrl,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
