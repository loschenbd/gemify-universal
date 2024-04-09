# Prerequisite
First install the dependencies running `yarn install`, then make sure to build the package using `yarn build` and add the package as a dependency to the package/app you want to consume it from (could be the `app` or `ui` package) like so:
```
"dependencies": {
  "@tamagui-google-fonts/urbanist": "*"
}
```
## Usage
### Expo
  
Add this to the root of your file:
    
```ts
import { useFonts } from 'expo-font'

export default function App() {
  const [loaded] = useFonts({
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
// ...
```

## Web

Get the font's script (`<link>` or `@import`) and add it to `<head>` from [here](https://fonts.google.com/specimen/Urbanist)


## Next.js Font (next/font/google)

Import the font from `next/font/google` and give it a variable name in your `_app.tsx` like so:

```ts
import { Urbanist } from 'next/font/google' // the casing might differ

const font = Urbanist({
  variable: '--my-font',
})
```

Add the variable style in `_app.tsx`:

```tsx
<div className={font.variable}>
  {*/ ...rest of your _app.tsx tree */}
</div>
```

Then go to the generated font package and update `family` with the variable.

So, change it from:
```ts
return createFont({
    family: isWeb
      ? '"Urbanist", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'Urbanist',
```

To:
```ts
return createFont({
    family: isWeb
      ? 'var(--my-font), -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'Urbanist',
```


## Usage in config

```ts
import { createUrbanistFont } from '@tamagui-google-fonts/urbanist' 

export const myFont = createUrbanistFont(
  {
    face: {
    "100": {
        "normal": "UrbanistThin",
        "italic": "UrbanistThinItalic"
    },
    "200": {
        "normal": "UrbanistExtraLight",
        "italic": "UrbanistExtraLightItalic"
    },
    "300": {
        "normal": "UrbanistLight",
        "italic": "UrbanistLightItalic"
    },
    "400": {
        "normal": "Urbanist",
        "italic": "UrbanistItalic"
    },
    "500": {
        "normal": "UrbanistMedium",
        "italic": "UrbanistMediumItalic"
    },
    "600": {
        "normal": "UrbanistSemiBold",
        "italic": "UrbanistSemiBoldItalic"
    },
    "700": {
        "normal": "UrbanistBold",
        "italic": "UrbanistBoldItalic"
    },
    "800": {
        "normal": "UrbanistExtraBold",
        "italic": "UrbanistExtraBoldItalic"
    },
    "900": {
        "normal": "UrbanistBlack",
        "italic": "UrbanistBlackItalic"
    }
}
        },
  {
    // customize the size and line height scaling to your own needs
    // sizeSize: (size) => Math.round(size * 1.1),
    // sizeLineHeight: (size) => size + 5,
  }
)
```

NOTE: these instructions are auto-generated and might not be accurate with some fonts since not all fonts share the same conventions. you may need to edit them out to get them to work.
