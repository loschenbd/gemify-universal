import { DailyUpdateScreen } from 'app/features/daily-update/daily-update-screen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Daily Update',
          headerShown: false,
        }}
      />
      <DailyUpdateScreen />
    </SafeAreaView>
  )
}
