import { createInterFont } from '@tamagui/font-inter'
import { createUrbanistFont } from '@tamagui-google-fonts/urbanist'

export const myFont = createUrbanistFont(
  {
    face: {
      '100': {
        normal: 'UrbanistThin',
        italic: 'UrbanistThinItalic',
      },
      '200': {
        normal: 'UrbanistExtraLight',
        italic: 'UrbanistExtraLightItalic',
      },
      '300': {
        normal: 'UrbanistLight',
        italic: 'UrbanistLightItalic',
      },
      '400': {
        normal: 'Urbanist',
        italic: 'UrbanistItalic',
      },
      '500': {
        normal: 'UrbanistMedium',
        italic: 'UrbanistMediumItalic',
      },
      '600': {
        normal: 'UrbanistSemiBold',
        italic: 'UrbanistSemiBoldItalic',
      },
      '700': {
        normal: 'UrbanistBold',
        italic: 'UrbanistBoldItalic',
      },
      '800': {
        normal: 'UrbanistExtraBold',
        italic: 'UrbanistExtraBoldItalic',
      },
      '900': {
        normal: 'UrbanistBlack',
        italic: 'UrbanistBlackItalic',
      },
    },
  },
  {
    // customize the size and line height scaling to your own needs
    // sizeSize: (size) => Math.round(size * 1.1),
    // sizeLineHeight: (size) => size + 5,
  }
)

export const headingFont = createUrbanistFont(
  {
    size: {
      6: 15,
    },
    transform: {
      6: 'uppercase',
      7: 'none',
    },
    weight: {
      3: '500',
      4: '700',
    },
    face: {
      700: { normal: 'Urbanist' },
    },
  },
  {
    sizeSize: (size) => size,
    sizeLineHeight: (fontSize) => fontSize + 4,
  }
)

export const bodyFont = createUrbanistFont(
  {
    face: {
      700: { normal: 'Urbanist' },
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => size + 5,
  }
)
