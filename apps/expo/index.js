import * as Sentry from '@sentry/react-native'
import { registerRootComponent } from 'expo'
import { ExpoRoot } from 'expo-router'
import 'react-native-url-polyfill/auto'

Sentry.init({
  dsn: 'https://756a1ac9dfaeeb223ec4e790309fb777@o4507188871495680.ingest.us.sentry.io/4507188872871936',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
})

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app')
  return <ExpoRoot context={ctx} />
}

registerRootComponent(App)
export default Sentry.wrap(App)
