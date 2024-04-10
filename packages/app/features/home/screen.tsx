import {
  AchievementCard,
  Banner,
  Button,
  EventCard,
  FeedCard,
  GemCard,
  H2,
  H4,
  Switch,
  Label,
  OverviewCard,
  Paragraph,
  ScrollView,
  Separator,
  Theme,
  TodoCard,
  XStack,
  YStack,
  isWeb,
  useMedia,
  validToken,
} from '@my/ui'
import { ArrowRight, DollarSign, Pencil, User, Users } from '@tamagui/lucide-icons'
import { api } from 'app/utils/api'
import React from 'react'
import { Platform } from 'react-native'
import { useLink, Link } from 'solito/link'

const defaultAuthors = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=67/32/32?ca=1',
  },
  {
    id: 2,
    name: 'Jane Doe',
    avatar: 'https://i.pravatar.cc/150?img=30/32/32?ca=1',
  },
]

export function HomeScreen() {
  return (
    <XStack>
      <ScrollView f={3} fb={0}>
        <YStack gap="$3" pt="$5" pb="$8">
          {/* <Greetings /> */}
          {/* <XStack justifyContent="end">
            <Label paddingRight="$2" size="$2">
              Fulfilled
            </Label>
            <Switch size="$2">
              <Switch.Thumb animation="quicker" />
            </Switch>
          </XStack> */}
          <GemCards />
          {/* <YStack gap="$6">
            <AchievementsSection />
            <OverviewSection />
            <PostsSection />
          </YStack> */}
        </YStack>
      </ScrollView>

      {/* <Separator vertical /> */}

      {/* {isWeb && <EventCards />} */}
    </XStack>
  )
}

export const linkMockup = [
  {
    id: 1,
    title: 'Title',
    author: 'Author 1',
    duration: '00:00',
    date: '04/08/2024',
    main_points: ['Point 1', 'Point 2', 'Point 3'],
    summary: 'This is a summary of the main points.',
    summary_1: 'This is an additional summary.',
    stories_examples_citations: ['Story 1', 'Example 1', 'Citation 1'],
    follow_up_questions: ['Question 1', 'Question 2', 'Question 3'],
    supporting_scriptures: ['Scripture 1', 'Scripture 2', 'Scripture 3'],
    related_topics: ['Topic 1', 'Topic 2', 'Topic 3'],
    transcript: 'This is a transcript of the main points.',
  },
  {
    id: 2,
    title: 'Title 2',
    summary: 'Summary 2',
    duration: '00:00',
    author: 'Author 2',
    date: '04/08/2024',
  },
  {
    id: 3,
    title: 'Title 3',
    summary: 'Summary 3',
    duration: '00:00',
    author: 'Author 3',
    date: '04/08/2024',
  },
  {
    id: 4,
    title: 'Title 4',
    summary: 'Summary 4',
    duration: '00:00',
    author: 'Author 4',
    date: '04/08/2024',
  },
  {
    id: 5,
    title: 'Title 5',
    summary: 'Summary 5',
    duration: '00:00',
    author: 'Author 5',
    date: '04/08/2024',
  },
  {
    id: 6,
    title: 'Title 6',
    summary: 'Summary 6',
    duration: '00:00',
    author: 'Author 6',
    date: '04/08/2024',
  },
  {
    id: 7,
    title: 'Title 7',
    summary: 'Summary 7',
    duration: '00:00',
    author: 'Author 7',
    date: '04/08/2024',
  },
  {
    id: 8,
    title: 'Title 8',
    summary: 'Summary 8',
    duration: '00:00',
    author: 'Author 8',
    date: '04/08/2024',
  },
  {
    id: 9,
    title: 'Title 9',
    summary: 'Summary 9',
    duration: '00:00',
    author: 'Author 9',
    date: '04/08/2024',
  },
  {
    id: 10,
    title: 'Title 10',
    summary: 'Summary 10',
    duration: '00:00',
    author: 'Author 10',
    date: '04/08/2024',
  },
]

const GemCards = () => {
  return (
    <YStack p="$2" gap="$2">
      {linkMockup.map((link) => (
        <Link key={link.id} href={`/gem/${link.id}`}>
          <GemCard
            title={link.title}
            author={link.author}
            duration={link.duration}
            date={link.date}
          />
        </Link>
      ))}
    </YStack>
  )
}
// const EventCards = () => {
//   return (
//     <ScrollView f={1} fb={0} $md={{ dsp: 'none' }}>
//       <YStack separator={<Separator />}>
//         <YStack>
//           <EventCard
//             title="Event #1"
//             description="Lorem ipsum dolor sit, amet."
//             action={{
//               text: 'Show Event',
//               props: useLink({ href: '/' }),
//             }}
//             tags={[
//               { text: 'New', theme: 'green_alt2' },
//               { text: 'Hot', theme: 'orange_alt2' },
//             ]}
//           />
//           <EventCard
//             title="Event #2"
//             description="Lorem ipsum dolor sit, amet."
//             action={{
//               text: 'Show Event',
//               props: useLink({ href: '/' }),
//             }}
//             tags={[{ text: '1 Day Remaining', theme: 'blue_alt2' }]}
//           />
//           <EventCard
//             title="Event #3"
//             description="Lorem ipsum dolor sit, amet."
//             action={{
//               text: 'Show Event',
//               props: useLink({ href: '/' }),
//             }}
//             tags={[{ text: 'Ongoing', theme: 'alt1' }]}
//           />
//           <EventCard
//             title="Event #4"
//             description="Lorem ipsum dolor sit, amet."
//             action={{
//               text: 'Show Event',
//               props: useLink({ href: '/' }),
//             }}
//             tags={[{ text: 'Finished', theme: 'alt2' }]}
//           />
//         </YStack>
//         <YStack p="$3">
//           <Theme name="blue_alt1">
//             <Banner {...useLink({ href: '/' })} cur="pointer">
//               <H4>Upgrade Now!</H4>
//               <Paragraph size="$2" mt="$1">
//                 Upgrade to access exclusive features and more!
//               </Paragraph>
//             </Banner>
//           </Theme>
//         </YStack>
//         <YStack>
//           <TodoCard label="Contribute to OSS" checked={false} />
//           <TodoCard label="Learn about Tamagui's latest features" checked />
//           <TodoCard label="Upgrade to the new Expo version" checked={false} />
//           <TodoCard label="Do the dishes" checked={false} />
//         </YStack>
//       </YStack>
//     </ScrollView>
//   )
// }

// const halfMinusSpace = validToken(
//   Platform.select({
//     web: 'calc(50% - 12px)',
//     native: '53%',
//   })
// )

// const quarterMinusSpace = validToken(
//   Platform.select({
//     web: 'calc(25% - 12px)',
//     native: '21%',
//   })
// )

// const AchievementsSection = () => {
//   return (
//     <YStack gap="$4">
//       <XStack px="$4.5" ai="center" gap="$2" jc="space-between" mb="$4">
//         <H4 theme="alt1" fow="400">
//           Getting Started
//         </H4>
//         <Theme name="alt2">
//           <Button size="$2" chromeless {...useLink({ href: '/' })} iconAfter={ArrowRight}>
//             All Achievements
//           </Button>
//         </Theme>
//       </XStack>

//       <ScrollAdapt>
//         <XStack px="$4" fw="wrap" f={1} gap="$3">
//           <Theme name="green">
//             <AchievementCard
//               w={300}
//               $gtMd={{
//                 w: halfMinusSpace,
//               }}
//               $gtLg={{
//                 w: quarterMinusSpace,
//               }}
//               icon={DollarSign}
//               title="Make your first 100K"
//               progress={{ current: 81_500, full: 100_000, label: 'dollars made' }}
//               action={{
//                 text: 'Boost your sales',
//                 props: useLink({ href: '#' }),
//               }}
//             />
//           </Theme>
//           <Theme name="blue">
//             <AchievementCard
//               w={300}
//               $gtMd={{
//                 w: halfMinusSpace,
//               }}
//               $gtLg={{
//                 w: quarterMinusSpace,
//               }}
//               icon={User}
//               title="Build your community"
//               progress={{ current: 280, full: 500, label: 'members' }}
//               action={{
//                 text: 'Boost your community',
//                 props: useLink({ href: '#' }),
//               }}
//             />
//           </Theme>
//           <Theme name="orange">
//             <AchievementCard
//               w={300}
//               $gtMd={{
//                 w: halfMinusSpace,
//               }}
//               $gtLg={{
//                 w: quarterMinusSpace,
//               }}
//               icon={Pencil}
//               title="Set up your profile"
//               progress={{ current: 2, full: 3, label: 'steps completed' }}
//               action={{
//                 text: 'Continue profile setup',
//                 props: useLink({ href: '#' }),
//               }}
//             />
//           </Theme>
//           <Theme name="pink">
//             <AchievementCard
//               w={300}
//               $gtMd={{
//                 w: halfMinusSpace,
//               }}
//               $gtLg={{
//                 w: quarterMinusSpace,
//               }}
//               icon={Users}
//               title="Refer 5 friends"
//               progress={{ current: 4, full: 5, label: 'friends referred' }}
//               action={{
//                 text: 'Refer friends',
//                 props: useLink({ href: '#' }),
//               }}
//             />
//           </Theme>
//         </XStack>
//       </ScrollAdapt>
//     </YStack>
//   )
// }

// const OverviewSection = () => {
//   return (
//     <YStack gap="$4">
//       <XStack px="$4.5" ai="center" gap="$2" jc="space-between" mb="$4">
//         <H4 fow="400">Overview</H4>
//         <Theme name="alt2">
//           <Button size="$2" chromeless {...useLink({ href: '/' })} iconAfter={ArrowRight}>
//             View All Stats
//           </Button>
//         </Theme>
//       </XStack>

//       <ScrollAdapt>
//         <XStack fw="wrap" ai="flex-start" jc="flex-start" px="$4" gap="$8" mb="$4">
//           <OverviewCard title="MRR" value="$18,908" badgeText="+0.5%" badgeState="success" />

//           <OverviewCard title="ARR" value="$204,010" badgeText="+40.5%" badgeState="success" />

//           <OverviewCard
//             title="Today's new users"
//             value="4 Users"
//             badgeText="+25%"
//             badgeState="success"
//           />

//           <OverviewCard
//             title="Weekly Post Views"
//             value="30,104"
//             badgeText="-2%"
//             badgeState="failure"
//           />
//         </XStack>
//       </ScrollAdapt>
//     </YStack>
//   )
// }

// const feedCardWidthMd = validToken(
//   Platform.select({
//     web: 'calc(33.33% - 12px)',
//     native: '32%',
//   })
// )

// const PostsSection = () => {
//   return (
//     <YStack gap="$4">
//       <XStack px="$4.5" ai="center" gap="$2" jc="space-between" mb="$4">
//         <H4 fow="400">Latest Posts</H4>
//         <Theme name="alt2">
//           <Button size="$2" chromeless {...useLink({ href: '/' })} iconAfter={ArrowRight}>
//             View All Posts
//           </Button>
//         </Theme>
//       </XStack>
//       <ScrollAdapt>
//         <XStack px="$4" gap="$4" mb="$4" jc="flex-start" fw="wrap">
//           <FeedCard
//             withImages
//             w={300}
//             $gtMd={{ w: feedCardWidthMd }}
//             title="Why lorem ipsum look bad"
//             description="Maybe it's just me - I'll just write out some dummy text just ignore the text tyvm..."
//             tag="Design"
//             authors={defaultAuthors}
//           />

//           <FeedCard
//             withImages
//             w={300}
//             $gtMd={{ w: feedCardWidthMd }}
//             title="Why you should use Tamagui"
//             description="Tamagui is the best way to develop performant cross-platform apps with one codebase..."
//             tag="React"
//             authors={defaultAuthors}
//           />

//           <FeedCard
//             withImages
//             w={300}
//             $gtMd={{ w: feedCardWidthMd }}
//             title="Merits of functional programming"
//             description="What is FP anyways? let's talk about it and learn about it's pros and cons..."
//             tag="Programming"
//             authors={defaultAuthors}
//           />

//           <FeedCard
//             withImages
//             w={300}
//             $gtMd={{ w: feedCardWidthMd }}
//             title="Different React paradigms"
//             description="We're gonna talk about different react paradigm and jargons..."
//             tag="React"
//             authors={defaultAuthors}
//           />

//           <FeedCard
//             withImages
//             w={300}
//             $gtMd={{ w: feedCardWidthMd }}
//             title="Another Post"
//             description="Hey this is yet another post I'm putting here for demo purposes..."
//             tag="React"
//             authors={defaultAuthors}
//           />
//           <FeedCard
//             withImages
//             w={300}
//             $gtMd={{ w: feedCardWidthMd }}
//             title="And Another Post"
//             description="I'm out of ideas for dummy posts, Sint labore sit magna ea proident aute..."
//             tag="React"
//             authors={defaultAuthors}
//           />
//         </XStack>
//       </ScrollAdapt>
//     </YStack>
//   )
// }

// function ScrollAdapt({ children }: { children: React.ReactNode }) {
//   const { md } = useMedia()
//   return md ? (
//     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//       {children}
//     </ScrollView>
//   ) : (
//     <>{children}</>
//   )
// }

// const Greetings = () => {
//   const greetingQuery = api.greeting.greet.useQuery()
//   return (
//     <H2 px="$4" my="$2">
//       {greetingQuery.data || '-'}
//     </H2>
//   )
// }
