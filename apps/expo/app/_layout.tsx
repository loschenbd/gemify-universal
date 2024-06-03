import { Session } from '@supabase/supabase-js'
import { Provider, loadThemePromise } from 'app/provider'
import { supabase } from 'app/utils/supabase/client.native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { LogBox, View } from 'react-native'

// SplashScreen.preventAutoHideAsync()

LogBox.ignoreLogs(['Cannot update a component', 'You are setting the style'])

export default function HomeLayout() {
  const [fontLoaded, fontError] = useFonts({
    UrbanistThin: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-Thin.ttf'),
    UrbanistExtraLight: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-ExtraLight.ttf'),
    UrbanistLight: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-Light.ttf'),
    Urbanist: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-Regular.ttf'),
    UrbanistMedium: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-Medium.ttf'),
    UrbanistSemiBold: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-SemiBold.ttf'),
    UrbanistBold: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-Bold.ttf'),
    UrbanistExtraBold: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-ExtraBold.ttf'),
    UrbanistBlack: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-Black.ttf'),
    UrbanistThinItalic: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-ThinItalic.ttf'),
    UrbanistExtraLightItalic: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-ExtraLightItalic.ttf'),
    UrbanistLightItalic: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-LightItalic.ttf'),
    UrbanistItalic: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-Italic.ttf'),
    UrbanistMediumItalic: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-MediumItalic.ttf'),
    UrbanistSemiBoldItalic: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-SemiBoldItalic.ttf'),
    UrbanistBoldItalic: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-BoldItalic.ttf'),
    UrbanistExtraBoldItalic: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-ExtraBoldItalic.ttf'),
    UrbanistBlackItalic: require('@tamagui-google-fonts/urbanist/fonts/static/Urbanist-BlackItalic.ttf'),
  })

  useEffect(() => {
    if (fontError) {
      console.error('Error loading fonts:', fontError)
    } else {
      console.log('Fonts loaded successfully')
    }
  }, [fontError])

  const [themeLoaded, setThemeLoaded] = useState(false)
  const [sessionLoadAttempted, setSessionLoadAttempted] = useState(false)
  const [initialSession, setInitialSession] = useState<Session | null>(null)
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data) {
          setInitialSession(data.session)
        }
      })
      .finally(() => {
        setSessionLoadAttempted(true)
      })
  }, [])

  useEffect(() => {
    loadThemePromise.then(() => {
      setThemeLoaded(true)
    })
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded && sessionLoadAttempted) {
      await SplashScreen.hideAsync()
    }
  }, [fontLoaded, sessionLoadAttempted])

  if (!themeLoaded || !fontLoaded || !sessionLoadAttempted) {
    return null
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Provider initialSession={initialSession}>
        <Stack />
      </Provider>
    </View>
  )
}
