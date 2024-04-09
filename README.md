⚠️️ **Please note**: Takeout is closed source for now. We've had a number of people create public repos on accident. Please be careful to keep the source private as per the license.

# Tamagui's Takeout Starter

A good but long tutorial showing building a real app using Tamagui Takeout can be seen on the [notjust.dev YouTube stream](https://www.youtube.com/watch?v=XbKkKXH-dfc).

For a more edited, paid (but cheap) course covering all the basics of Tamagui, a few Tamagui users have said they found [this course by Simon very helpful](https://galaxies.dev/course/react-native-tamagui/1-1).

## Getting Started

If you want to clone this starter, you can run

```bash
yarn create tamagui --template takeout-starter
```

the `yarn create tamagui --template takeout-starter` command has a requirement on `gh`

`gh` setup:

1. [gh install](https://cli.github.com/)
1. `gh auth login`
1. select ` https` from the menu
1. authenticate

Otherwise, ignore this section. If you're getting authentication issues with `yarn create tamagui`, clone the template (using `gh` or just `git`), cd into the project and run `yarn install`, and then `yarn setup`.

To rename the project you can search the workspace for the word `myapp` and replace with your name.
If you prefer, you may also run [react-native-rename](https://github.com/junedomingo/react-native-rename) from `/apps/expo` to rename the react-native references.

If you're getting issues with the /android or /ios directories when setting up the starter, you can safely remove them and re-generate them using `yarn ios` and `yarn android`.

## Environment

Note that Cocoapods 1.15 has a [breaking bug](https://github.com/CocoaPods/CocoaPods/issues/12226). We recommend using version 1.14.3.

## Included packages

- [Tamagui](https://tamagui.dev)
- [solito](https://solito.dev)
- [Expo SDK](https://expo.dev)
- [Next.js](https://nextjs.org)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Supabase](https://supabase.com)

## First-time Configuration

Note that you don't need to do this if you've already cloned this using `create tamagui`.

To configure the project, `cd` into the root of the project and run `yarn setup`.

[Docker](https://www.docker.com) based workflow is recommended if your takeout project is using Supabase as a dependency.

Please reference [Supabase's documentation](https://supabase.com/docs/guides/self-hosting/docker) for docker configuration instructions.

## Development

### Development scripts

- Web: `yarn web`
- iOS: `yarn ios`
- Android: `yarn android`

NOTE: When using tRPC, even if you just want to develop on native, you need to have the web server running to be able to make tRPC requests.

### EAS dev builds

> [!IMPORTANT]  
> You need to update your `owner` inside `apps/expo/app.json` to your own username

In the apps/expo folder you can use EAS and a few helpful scripts:

- `yarn eas:build:dev:simulator:android` for android
- `yarn eas:build:dev:simulator:ios` for ios

Add `--local` to build locally.

### Storybook scripts

- Storybook Web: `yarn storybook:web`
- Storybook iOS: `yarn storybook:ios`
- Storybook Android: `yarn storybook:android`
- Publish to Chromatic: `yarn chromatic` (Need to set your token first in `apps/storybook/package.json -> scripts -> chromatic`)

### Code generation script

- Component: `yarn gen component`
- Screen: `yarn gen screen`
- tRPC Router: `yarn gen router`

### Signup Flow

Supabase PKCE flow requires email confirmation on sign up. You accept an email locally:

- `http://localhost:54324`
- Find the email account you signed up with
- Click the confirm link

## Folder layout

The main apps are:

- `apps`
  - `expo` (Native)
  - `next` (Web)
  - `storybook` (Web Storybook)
  - `storybook-rn` (Native Storybook)
- `packages` Shared packages across apps
  - `ui` Includes your custom UI kit that will be optimized by Tamagui
  - `app` You'll be importing most files from `app/`
    - `features` Where most of your code lives.
    - `provider` All providers that wrap the app, sometimes forked by platform.
- `supabase` Supabase files, migrations, types, etc. + [scripts](/supabase/README.md)

Note that the main entry point for the Expo app is at `apps/expo/app/(tabs)/index.tsx`. This is because folders in parenthesis are flattened and Expo Router finds the first index.tsx file. For more on how Expo Router works, [check out their docs](https://docs.expo.dev/router/create-pages/).

## Layouts

### Web

We've decided not to move to app dir just yet, but since layouts are crucial to most apps, we use [per-page layouts](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#per-page-layouts).

You can define these layouts anywhere but we've been keeping them in `layout.web.tsx` files in the `features` directory as needed. You can then use them like so:

```tsx
import { CreateScreen } from 'app/features/myfeat/screen'
import { MyLayout } from 'app/features/myfeat/layout.web'
import Head from 'next/head'
import { NextPageWithLayout } from './_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>My Page</title>
      </Head>
      <MyPageScreen />
    </>
  )
}

// add the layout
Page.getLayout = (page) => <MyLayout>{page}</MyLayout>

export default Page
```

### Native

#### React Native Setup Expo

The simplest way to run a native project. A iOS or Android physical device is needed

- [Expo CLI Setup](https://docs.expo.dev/get-started/installation/)

#### Emulator Setup Expo

- [Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS](https://docs.expo.dev/workflow/ios-simulator/)

#### First-time Takeout Setup

- run a build for either native platform `yarn ios` or `yarn android`

To run an expo app on your machine locally:

- `yarn native` from the root of the project
- select `development` from the cli menu

## Native Builds

Native builds are needed if you're using custom native code in your project. More documentation can be found here in Expo's docs: [Adding Custom Native Code](https://docs.expo.dev/workflow/customizing/#adding-custom-native-code-with-development-builds)

To run a [native build](https://docs.expo.dev/develop/development-builds/introduction):

- `npx expo install expo-dev-client`
- in `apps/expo/package.json` update script `"start": "TAMAGUI_ENV=dev expo start --dev-client"`
- `yarn ios` or `yarn android`

## Expo EAS Update

[EAS update](https://docs.expo.dev/eas-update/getting-started) makes updating and publishing your app's runtime js easy.

We use `expo-router` for the native side, so simply create `_layout.tsx` files inside `apps/expo` like you would normally do with an `expo-router` project.

- create an expo account and create an expo project.

- add your project id to `apps/expo/app.json` where it says `your-project-id`

- ensure that the `projectId`, `slug`, and `owner` values in `apps/expo/app.json` all have the same value as the name of your project, ie the name in `apps/expo/package.json`

![expo project id](https://github.com/tamagui/unistack/assets/2502947/8a4d3663-9eb2-4cb1-926f-0476a00ab078)

## Icon Pack (Additional Purchase)

Icons are populated from [icones](https://icones.js.org)

## How Authentication is Handled

Authentication is handled by Supabase Auth. Email and password auth is included in the starter but you can get OAuth to work too.

Check emails that are sent to you locally like the auth confirmation using InBucket at http://localhost:54324 once your Supabase is running.

Getting OAuth to work on web is as easy as it gets but on native, you will need to manually get the OAuth credentials, and then feed them to the Supabase session. See [this article](https://dev.to/fedorish/google-sign-in-using-supabase-and-react-native-expo-14jf) for more info on how to handle native OAuth with Supabase.

### Protecting Pages on Web

We use middlewares to protect routes on the web. See `apps/next/middleware.ts`.

### Protecting Screens on Native

We use a hook to check for auth and then redirect the user to auth pages, and also not let the authenticated users see auth pages. See `apps/expo/app/provider/auth/AuthProvider.native.ts`.

### Apple Sign In

You can use Sign in with Apple on native for iOS. Configuration on the Supabase side is straightforward as long as you have an Apple Developer account and an app ID. See this [article](https://supabase.com/docs/guides/auth/social-login/auth-apple#configuration-native-app) for more info. If you plan to use Sign in with Apple on the web, there are a few more steps which are explained in the article.

### Google Sign In

Sign in with Google is supported on iOS via in app web browser, and on Android native with via Google One Tap. To use Google One Tap on Android, you'll need to do a few more steps (see comments in the code). See [this article](https://supabase.com/docs/guides/auth/social-login/auth-google#configuration-native-app) for more info, as well as [this issue](https://github.com/react-native-google-signin/google-signin/issues/1176#issuecomment-1674385846).

## How Authorization is Handled

You can use Supabase's [Row-Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security) to handle authorization of users.

## Environment Convention

Follows [how Next.js handles env variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables) - In general only a `.env.local` file is needed.

- `.env.local` is where secrets can be safely stored since this file isn't committed to git
- Do NOT put your sensitive environment variables inside `.env` as it will get committed to git

[Next Environment Defaults](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#default-environment-variables)

> Good to know: .env, .env.development, and .env.production files should be included in your repository as they define defaults. .env\*.local should be added to .gitignore, as those files are intended to be ignored. .env.local is where secrets can be stored.

## Installing icons and fonts

If you have access to font and icon packages, simply run:

```sh
yarn tamagui add font
yarn tamagui add icon
```

and choose the package you want.

The package will be cloned into `packages/package-name`. After that's done, run `yarn install` and `yarn build` and follow the instructions in the package's `README.md`

## Sync With The Starter

We actively maintain the starter and add new features and updates to it.

### Takeout's Update Bot

We have created a bot to push updates to your repo if you have an active subscription for the starter. To install the bot, head over to [Subscriptions Page](https://tamagui.dev/account/subscriptions), find the starter subscription item and press the "Install GitHub App" button. Then simply give access to your repository and done. You can customize the bot's options from the `takeout.config.json` file.

Note that you will stop receiving updates if you remove the `takeout.config.json` file.

### Rolling Your Syncing Workflow

While Tamagui's bot is the easiest way you can receive updates, you may also use the `actions-template-sync` GitHub action if you prefer. It will run on a custom interval and check for changes from the template so you don't miss out on the new updates.

To set up this action, read the [Private template repository](https://github.com/marketplace/actions/actions-template-sync#private-template-repository) section.

## UI Kit

Note we're following the [design systems guide](https://tamagui.dev/docs/guides/design-systems) and creating our own package for components.

See `packages/ui` named `@my/ui` for how this works.

## Adding new dependencies

### Pure JS dependencies

If you're installing a JavaScript-only dependency that will be used across platforms, install it in `packages/app`:

```sh
cd packages/app
yarn add date-fns
cd ../..
yarn
```

### Native dependencies

If you're installing a library with any native code, you must install it in `expo`:

```sh
cd apps/expo
yarn add react-native-reanimated
cd ..
yarn
```

You can also install the native library inside of `packages/app` if you want to get autoimport for that package inside of the `app` folder. However, you need to be careful and install the _exact_ same version in both packages. If the versions mismatch at all, you'll potentially get terrible bugs. This is a classic monorepo issue. I use `lerna-update-wizard` to help with this (you don't need to use Lerna to use that lib).

You may potentially want to have the native module transpiled for the next app. If you get error messages with `Cannot use import statement outside a module`, you may need to use `transpilePackages` in your `next.config.js` and add the module to the array there.

## Deploying to Vercel

- Root: `apps/next`
- Build command: leave default setting
- Output dir: leave default setting

## Using With Expo Application Services (EAS)

EAS has already been configured for you, but you still need to do the following:

- `npm install --global eas-cli`
- `cd apps/expo`
- `eas build` - This will also add your EAS project ID to app.json

### Initial EAS Setup

1. edit `apps/expo/app.json` and update:
   1. `owner`
   1. `projectId`

## FAQ

- I get the error `network request failed` when trying to signin or signup for the app

This error is likely caused my not having Supabase setup correctly and running in docker.

- Where is the initial page that gets rendered on the Expo app?

We recommend you familiarize yourself with how Expo Router handles routing on [their docs](https://docs.expo.dev/router/introduction/). In a fresh Takeout project, the initial page would be on `apps/expo/app/(tabs)/index.tsx`.
