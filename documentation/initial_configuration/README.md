<!-- component-READMEComponent -->

# Beep.Buzz

Beep.Buzz is an innovative morse code learning platform that transforms the traditional learning experience into an engaging, competitive journey. Through real-time competitions and structured mini-games, users master morse code by using "beep" for dit and "buzz" for dah, making the learning process both intuitive and enjoyable.

At its core, Beep.Buzz combines structured learning with competitive gameplay to create a unique educational experience. Whether you're a complete beginner or an experienced operator, the platform adapts to your skill level, providing personalized challenges and matching you with similarly skilled opponents in real-time competitions.

What sets Beep.Buzz apart is its focus on practical application through asynchronous messaging and competitive mini-games. Users can practice their skills by sending actual morse code messages to other learners, track their progress through detailed statistics, and compete for positions on weekly and seasonal leaderboards that separately track encoding and decoding proficiency.

## Layouts

### Main Layout
The Main Layout serves as the primary wrapper for most pages within Beep.Buzz, providing a consistent and intuitive user interface across the platform. The header prominently displays the Beep.Buzz logo and authentication controls, while the game-focused sidebar keeps users informed of their current rank, progress, and active streaks.

This layout enhances the user experience by maintaining quick access to essential features like practice modes and competitive games through the sidebar. The footer includes a snapshot of current leaderboards, keeping users connected to the competitive aspect of the platform. This consistent structure helps users navigate efficiently while staying engaged with their learning progress.

## Pages

### Sign In (`/sign-in`) [Anon]
The Sign In page offers a streamlined, passwordless authentication experience. Users simply enter their email address to receive a secure magic link, eliminating the need to remember complex passwords while maintaining high security standards.

Upon entering their email, users receive clear instructions and visual feedback confirming their action. The page maintains a clean, focused design that guides users through the sign-in process without unnecessary distractions.

### Verify Email (`/verify`) [Anon]
The Verify Email page serves as a confirmation checkpoint in the sign-in process. Users are presented with a clear message explaining that a verification link has been sent to their email address.

The page includes helpful instructions for checking spam folders and requesting a new verification link if needed. Users receive real-time updates when their email is successfully verified, ensuring a smooth transition into their learning journey.

### Welcome (`/welcome`) [Auth, Admin]
The Welcome page guides new users through their initial profile setup, collecting essential information to personalize their learning experience. Users can set their experience level, preferred practice schedule, and learning goals.

This page ensures that each user's journey is tailored to their needs from the start, helping the platform provide relevant challenges and appropriate difficulty levels for optimal learning progression.

### Home (`/`) [Anon, Auth, Admin]
The Home page serves as the central hub of Beep.Buzz, featuring an interactive morse code demonstration that immediately engages visitors. Users can see real-time statistics of active participants and ongoing matches, creating a sense of community and activity.

The page showcases featured leaderboards and highlights current community challenges, encouraging both new and returning users to join competitive games. For authenticated users, personalized recommendations and quick-access buttons to their preferred activities are prominently displayed.

### Learning Dashboard (`/learn`) [Auth, Admin]
The Learning Dashboard provides users with a comprehensive overview of their morse code journey. Progress through structured lessons is clearly visualized, showing mastery levels for different character sets and common words.

Users can track their encoding and decoding statistics separately, view active streaks, and receive personalized recommendations for their next learning activities. The dashboard adapts its content based on user performance, ensuring challenges remain engaging and appropriate.

### Practice Arena (`/practice`) [Anon, Auth, Admin]
The Practice Arena offers a focused environment for users to hone their morse code skills without the pressure of competition. Users can customize their practice sessions by selecting specific character sets, difficulty levels, and practice modes.

Real-time feedback helps users identify areas for improvement, while progressive difficulty settings ensure practice remains challenging and effective. The arena includes both encoding and decoding exercises, with instant visual and audio feedback.

### Competitive Match (`/compete`) [Auth, Admin]
The Competitive Match page connects users for real-time morse code challenges. Players can see their opponent's progress during matches, adding excitement and motivation to the learning process.

The page features a built-in chat system for friendly communication and includes match statistics tracking both speed and accuracy. Users can choose from various competition modes, including speed challenges and accuracy-focused matches.

### Message Center (`/messages`) [Auth, Admin]
The Message Center enables users to practice morse code in a practical, social context. Users can send and receive actual morse code messages, providing authentic practice opportunities with real-world application.

The page includes a message composition area with encoding assistance for beginners, and a decoding interface for received messages. Users are matched with others of similar skill levels, ensuring meaningful and educational exchanges.

### Leaderboards (`/leaderboards`) [Anon, Auth, Admin]
The Leaderboards page showcases top performers across various categories, inspiring users to improve their skills. Weekly challenges and seasonal competitions provide fresh opportunities for users to compete and compare their progress.

The page displays separate rankings for encoding speed, decoding accuracy, and overall proficiency. Users can view detailed statistics and achievement badges for any ranked player, fostering a competitive yet supportive community.

### User Profile (`/profile/[id]`) [Anon, Auth, Admin]
The User Profile page displays a user's journey through Beep.Buzz, showcasing their achievements, rank progression, and match history. Visitors can view detailed statistics about the user's encoding and decoding capabilities.

The profile includes recently earned badges, activity highlights, and performance trends. Users can customize their public profile to highlight their preferred achievements and statistics.

### Settings (`/settings`) [Auth, Admin]
The Settings page allows users to customize their Beep.Buzz experience. Users can adjust sound effects, visual feedback settings, and notification preferences to match their learning style.

The page includes options for customizing practice mode defaults, managing account details, and setting personal goals. Users can also configure their competitive match preferences and privacy settings.

## Authentication & Access Control

Beep.Buzz employs a secure, user-friendly authentication system based on magic links. This passwordless approach eliminates the friction of traditional login methods while maintaining high security standards. When users sign in, they receive a secure link via email that automatically authenticates them on the platform.

The platform implements three distinct access levels to ensure appropriate feature availability:
- Anonymous access allows visitors to explore core features
- Authenticated users gain access to personalized learning tools and competitive features
- Administrators have full platform access for moderation and management

## User Experience

New users typically begin their Beep.Buzz journey on the Home page, where they can immediately experiment with morse code through the interactive demo. The intuitive progression from practice to competitive modes helps users build confidence naturally.

Regular users often start their sessions by checking their Learning Dashboard for recommended activities, then moving to either Practice Arena for skill development or Competitive Matches for challenges. The Message Center provides a practical application of their growing skills.

As users advance, they naturally engage more with the competitive aspects of the platform, participating in weekly challenges and working to improve their leaderboard positions.

## Getting Started

1. Visit Beep.Buzz and explore the interactive demo on the Home page
2. Click "Sign In" and enter your email to receive a magic link
3. Check your email and click the verification link
4. Complete your profile setup on the Welcome page
5. Begin with recommended lessons in the Learning Dashboard
6. Practice at your own pace in the Practice Arena
7. When ready, try your first Competitive Match
