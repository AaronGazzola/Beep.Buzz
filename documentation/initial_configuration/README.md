<!-- component-READMEComponent -->

# Beep.Buzz

## Overview

Beep.Buzz is a playful and creative social media platform where users can express themselves through personalized, interactive web pages. Each user gets their own custom subdomain (username.beep.buzz) where they can create a unique vertical canvas filled with text, shapes, patterns, illustrations, and YouTube videos.

What makes Beep.Buzz special is its unique interaction model - visitors can place decorative "beep" and "buzz" stickers on each other's pages. These stickers serve as colorful breadcrumbs, linking back to the visitor's own page and creating an interconnected web of creative expression. Users design their own custom stickers, which automatically update across all pages where they've been placed.

To ensure a safe and welcoming environment, all content is analyzed by AI before publishing, and users can flag inappropriate content for admin review. The platform combines creative freedom with strong community standards to create a unique social space for digital self-expression.

## Layouts

### Main Layout
The primary layout provides a consistent, clean interface across most of the platform. It features a header with the Beep.Buzz logo and an authentication avatar button/menu for quick access to profile settings and sign out options. A minimal footer contains essential links. This layout is used for the Home, Sign In, Welcome Setup, User Page, and Page Editor pages, providing familiar navigation while letting page content take center stage.

### Admin Layout
Designed for content moderation and platform management, the Admin layout includes the standard header elements plus a specialized sidebar. The sidebar provides quick access to the content flagging queue, user management tools, and sticker approval system. This layout is exclusively used for the Content Moderation page, helping admins efficiently manage platform safety and community standards.

## Pages

### Home (/) (Anon, Auth, Admin)
The discovery hub of Beep.Buzz showcases the community's creativity through various browsing options. Users can search by title or username, explore featured sections like Popular Pages and Recently Active, or discover random pages. Each page preview card displays the title, username, visual preview, sticker counts, and category. New users are encouraged to join with a prominent "Create Your Page" call-to-action.

### Sign In (/sign-in) (Anon)
A streamlined authentication page featuring playful Beep.Buzz branding and animated stickers. Users simply enter their email address to receive a magic link for secure, passwordless access to their account.

### Welcome Setup (/welcome) (Auth, Admin)
First-time users begin their journey here after authentication. Choose a unique username (3-20 URL-friendly characters) and design personal beep and buzz stickers by selecting icons, colors, and shapes. After this quick setup, users can immediately start exploring and interacting with the community.

### User Page (/[username]) (Anon, Auth, Admin)
Each user's creative canvas, accessible at their custom subdomain. Features a static header with page title and creator information, plus a sticky navigation bar with sticker visibility controls. Visitors can view the creator's content and placed stickers, with each sticker revealing its creator and linking to their page.

### Page Editor (/editor) (Auth, Admin)
A powerful but intuitive builder interface for creating personal pages. Add and customize text blocks, shapes, dividers, and YouTube embeds with drag-and-drop simplicity. Preview your page across desktop, tablet, and mobile views to ensure it looks great everywhere.

### Content Moderation (/admin) (Admin)
Administrative dashboard for maintaining community standards. Review flagged content, manage user reports, and approve new sticker designs. Includes AI analysis results and a complete audit log of moderation actions.

### Settings (/settings) (Auth, Admin)
Manage your Beep.Buzz identity by customizing sticker designs and reviewing activity. Changes to your stickers automatically update across all pages where they've been placed. View analytics about your sticker interactions and manage your placed stickers.

## Authentication & Access Control

Beep.Buzz uses a simple, secure magic link authentication system. When signing in, users enter their email address and receive a special link that automatically logs them in - no passwords needed. This approach provides strong security while keeping the experience simple and friendly.

### Access Levels

**Anonymous Access** (no authentication required):
- Home (/)
- Sign In (/sign-in)
- User Page (/[username])

**Authenticated Users**:
- Welcome Setup (/welcome)
- Page Editor (/editor)
- Settings (/settings)

**Admin Only**:
- Content Moderation (/admin)

## User Experience

New visitors typically discover Beep.Buzz through shared user pages, where they can explore content and see how others interact through stickers. Creating an account is as simple as entering an email address and clicking a magic link. After setting up their username and custom stickers in the Welcome flow, users can immediately start creating their own page or placing stickers on others' pages.

Regular users often start their sessions by checking who has placed new stickers on their page, then exploring those users' pages in return. The Page Editor makes it easy to keep content fresh, while the Settings page helps users track their community interactions.

## Getting Started

1. Visit any username.beep.buzz page to explore what others have created
2. Click "Create Your Page" to start your journey
3. Enter your email and click the magic link when it arrives
4. Choose your username and design your personal stickers
5. Start creating your page or explore the community!

Your stickers are your identity on Beep.Buzz - use them to show appreciation for others' creativity and invite them to visit your page in return.
