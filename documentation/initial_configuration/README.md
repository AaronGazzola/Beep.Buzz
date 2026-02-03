<!-- component-READMEComponent -->

# Beep.Buzz

beep.buzz is a fun and interactive platform that helps you master Morse code through playful competition and practice. Learn alongside two charming characters - the friendly blob Beep and the spunky Buzz - as they communicate in Morse code signals (beeps for dots, buzzes for dashes).

Whether you're a complete beginner or looking to improve your skills, beep.buzz offers multiple ways to learn: guided training sessions, self-paced practice, and real-time competitions with other users. Progress through levels as you learn, earning points and matching with others at your skill level for friendly competitions.

Unlike traditional memorization methods, beep.buzz makes learning Morse code engaging and social. The interactive gameplay and real-time challenges keep you motivated while building practical translation skills at your own pace.

## Layouts

### Main Layout

**Components:** Header (app title, navigation, profile menu, sticky), Footer (app title, legal links)

**Pages using this layout:**
- Home (`/`)
- Training Mode (`/training`)
- Practice Mode (`/practice`)
- Competition Hub (`/compete`)
- Competition Arena (`/compete/[matchId]`)
- Leaderboard (`/leaderboard`)
- User Profile (`/profile/[userId]`)
- Settings (`/settings`)

## Pages

### Sign In (`/sign-in`)

**Access:** 🌐 Anon

A simple login page offering two options: sign in with email only (magic link) or with email and password. The page features the beep and buzz characters welcoming users back.

This is the primary entry point for returning users, directing them to their last active section after successful authentication.

### Sign Up (`/sign-up`)

**Access:** 🌐 Anon

New users can create their account by choosing between email-only signup (magic link) or traditional email and password. The page showcases the friendly beep and buzz characters introducing themselves.

First step in the user journey, leading to email verification and profile setup.

### Forgot Password (`/forgot-password`)

**Access:** 🌐 Anon

A straightforward page where users enter their email address to receive password reset instructions. Features reassuring messaging and the beep character offering help.

### Reset Password (`/reset-password`)

**Access:** 🌐 Anon

Users can enter and confirm their new password after clicking the reset link from their email. The buzz character provides encouraging feedback during the process.

### Verify Email (`/verify`)

**Access:** 🌐 Anon

A waiting screen showing animated beep and buzz characters encouraging users to check their email for the verification link. Includes clear instructions and the email address the verification was sent to.

### Welcome (`/welcome`)

**Access:** 🔐 Auth | 👑 Admin

A friendly onboarding experience where users set up their profile basics with guidance from beep and buzz. Users choose a display name and customize basic preferences for their learning journey.

Serves as the transition point between account creation and accessing the main learning features.

### Home (`/`)

**Access:** 🌐 Anon | 🔐 Auth
**Layouts:** Main Layout

An engaging landing page featuring animated beep and buzz characters demonstrating morse code translation. Visitors can try a quick demo and see the three main modes: training, practice, and competition.

Serves as both the main entry point for new users and the dashboard for returning users to choose their learning mode.

### Training Mode (`/training`)

**Access:** 🔐 Auth
**Layouts:** Main Layout

A structured learning environment where beep and buzz take turns presenting morse code patterns with visual and audio cues. Users see translations while learning and practice repeating the patterns using keyboard or mouse.

The primary starting point for beginners, progressively introducing more complex patterns as users improve.

### Practice Mode (`/practice`)

**Access:** 🔐 Auth
**Layouts:** Main Layout

A focused practice space where users translate between morse code and text without hints. Features the beep and buzz characters reacting to user performance and tracking progress.

Builds on skills learned in training mode, preparing users for competitive play.

### Competition Hub (`/compete`)

**Access:** 🔐 Auth
**Layouts:** Main Layout

A dynamic lobby where users can find and challenge opponents of similar skill levels. Shows current rankings, available competitors, and allows quick-matching or selecting specific opponents.

The culmination of training and practice, where users test their skills against others in real-time matches.

### Competition Arena (`/compete/[matchId]`)

**Access:** 🔐 Auth
**Layouts:** Main Layout

Users enter a live competition room where they face off against another player using Beep and Buzz characters. Players take turns sending morse code messages and translating their opponent's signals, with real-time scoring and animations showing their progress. A match timer and score counter keep track of the competition.

This is the core competitive gameplay that users unlock after completing training sessions and reaching the required skill level for ranked matches.

### Leaderboard (`/leaderboard`)

**Access:** 🌐 Anon | 🔐 Auth
**Layouts:** Main Layout

The leaderboard displays top players ranked by various metrics like accuracy, speed, and win rate, with their current level and badges prominently shown. Users can toggle between different time periods (daily, weekly, monthly) and categories to see different rankings.

This page motivates users to improve their skills and compete for top positions, while also helping them gauge their progress against the community.

### User Profile (`/profile/[userId]`)

**Access:** 🔐 Auth
**Layouts:** Main Layout

Users see their personal stats dashboard showing their morse code proficiency level, achievement badges, and recent competition history. The profile includes detailed performance metrics and a progress chart tracking improvement over time.

This serves as both a personal progress tracker and a public profile for other users to view their competition history and achievements.

### Settings (`/settings`)

**Access:** 🔐 Auth
**Layouts:** Main Layout

Users can customize their learning experience by adjusting sound effects, visual themes, and difficulty preferences. The page includes simple toggles and sliders for audio settings, practice mode options, and notification preferences.

### Terms and Conditions (`/terms`)

**Access:** 🌐 Anon | 🔐 Auth | 👑 Admin

A standard terms and conditions page with clear headings and sections explaining the rules and requirements for using beep.buzz. Users can easily scan through sections covering acceptable use, account responsibilities, and service limitations.

### Privacy Policy (`/privacy`)

**Access:** 🌐 Anon | 🔐 Auth | 👑 Admin

A clear, straightforward privacy policy explaining how beep.buzz handles user data and protects privacy. The page uses simple language to describe data collection, storage, and sharing practices.

### About (`/about`)

**Access:** 🌐 Anon | 🔐 Auth | 👑 Admin

Users find information about beep.buzz's mission to make morse code learning fun and accessible through competitive gameplay. The page includes engaging visuals of Beep and Buzz characters and highlights key features of the platform.

### Contact (`/contact`)

**Access:** 🌐 Anon | 🔐 Auth | 👑 Admin

A simple contact page with a message form for user inquiries and feedback. The page includes essential contact information and typical response times for different types of inquiries.

## Authentication & Access Control

**Authentication Methods:** Email & Password, Magic Link

**Access Level Summary:**

| Access Level | Page Count |
|-------------|-------|
| 🌐 Anonymous | 11 pages |
| 🔐 Authenticated | 13 pages |
| 👑 Admin | 5 pages |

**Page Access:**

- **Sign In** (`/sign-in`) - 🌐 Anon
- **Sign Up** (`/sign-up`) - 🌐 Anon
- **Forgot Password** (`/forgot-password`) - 🌐 Anon
- **Reset Password** (`/reset-password`) - 🌐 Anon
- **Verify Email** (`/verify`) - 🌐 Anon
- **Welcome** (`/welcome`) - 🔐 Auth, 👑 Admin
- **Home** (`/`) - 🌐 Anon, 🔐 Auth
- **Training Mode** (`/training`) - 🔐 Auth
- **Practice Mode** (`/practice`) - 🔐 Auth
- **Competition Hub** (`/compete`) - 🔐 Auth
- **Competition Arena** (`/compete/[matchId]`) - 🔐 Auth
- **Leaderboard** (`/leaderboard`) - 🌐 Anon, 🔐 Auth
- **User Profile** (`/profile/[userId]`) - 🔐 Auth
- **Settings** (`/settings`) - 🔐 Auth
- **Terms and Conditions** (`/terms`) - 🌐 Anon, 🔐 Auth, 👑 Admin
- **Privacy Policy** (`/privacy`) - 🌐 Anon, 🔐 Auth, 👑 Admin
- **About** (`/about`) - 🌐 Anon, 🔐 Auth, 👑 Admin
- **Contact** (`/contact`) - 🌐 Anon, 🔐 Auth, 👑 Admin

## Getting Started

Visit beep.buzz in your web browser to begin. Create an account using either your email address and password or opt for the convenient magic link sign-in option. Once logged in, you'll start with basic training sessions where Beep and Buzz will guide you through your first Morse code signals.

After completing the initial training, you can choose to continue with guided lessons, practice your skills in translation exercises, or challenge other learners to friendly competitions. Your progress is automatically tracked, and you'll unlock new levels and competition opportunities as you improve.
