# MeetMate - Group Scheduling Made Simple

> Find time together, without the hassle. No sign-up required.

A modern, mobile-first web application for coordinating group availability without requiring user accounts. Built for friends organizing social events who are tired of outdated scheduling tools.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🎯 Problem Statement

Existing group scheduling tools suffer from:
- **Dated interfaces** that don't work well on mobile (When2Meet)
- **Over-engineered features** with aggressive monetization (Doodle)
- **High friction** requiring accounts and logins
- **Poor user experience** with no real-time updates

MeetMate solves these problems with a clean, modern interface that works seamlessly on any device.

## ✨ Key Features

### Core Functionality
- 🔗 **Zero friction sharing** - Create event, get a link, share it
- 📱 **Mobile-first design** - Touch-optimized calendar interface
- 🚫 **No accounts required** - Participants just enter their name
- 🔒 **Optional password protection** - Secure private events
- 🎨 **Three-state availability** - Available (green), Maybe (orange), Unavailable (red)
- ⚡ **Real-time updates** - See participants join and respond live
- 🤖 **Smart date calculation** - AI-powered optimal date finding
- 🔐 **Session management** - Edit your availability by returning to the link

### For Organizers
- 📊 **Visual heat maps** - See everyone's availability at a glance
- 🎯 **Ranked date suggestions** - Algorithm finds best dates automatically
- 👥 **Participant tracking** - Monitor who has/hasn't responded
- 🔒 **Event locking** - Finalize dates when ready

### Coming Soon
- 📧 Email notifications
- 📅 Calendar integration (Google, Apple, Outlook)
- 🔄 Recurring events
- 💬 Event comments and chat

## 🏗️ Tech Stack

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: Zustand
- **Animations**: Framer Motion

### Backend
- **API**: Next.js API Routes
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Real-time**: Supabase Realtime subscriptions
- **Authentication**: Session tokens (no user accounts initially)

### AI Integration
- **Phase 1**: Custom algorithm for availability calculation
- **Phase 2**: Claude API (Anthropic) for complex scheduling scenarios

### Hosting & Deployment
- **Platform**: [Vercel](https://vercel.com/)
- **Database**: Supabase Cloud
- **Domain**: TBD

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Supabase account (free tier works)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/meetmate.git
cd meetmate
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

**Required Variables:**
```env
# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Optional Variables:**
```env
# Rate Limiting (Upstash Redis)
# If not set, rate limiting will be disabled (development only)
# For production, you MUST configure Upstash Redis for security
# Get these from: https://console.upstash.com/redis
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token-here

# Cloudflare Turnstile (CAPTCHA)
# If not set, CAPTCHA will be disabled (not recommended for production)
# Get these from: https://dash.cloudflare.com/?to=/:account/turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key-here
TURNSTILE_SECRET_KEY=your-turnstile-secret-key-here

# AI Integration (Phase 2 - Future Feature)
# Get this from: https://console.anthropic.com/
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

**Setting up Upstash Redis for Rate Limiting:**
1. Create a free account at [Upstash](https://console.upstash.com/)
2. Create a new Redis database (choose a region close to your deployment)
3. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the database details
4. Add them to your `.env.local` file

**Rate Limits (when Redis is configured):**
- Event creation: 5 events per hour per IP
- Participant joins: 10 joins per hour per IP
- Availability submissions: 20 submissions per hour per IP
- Password verification: 5 attempts per 15 minutes per IP (strict to prevent brute force)

**Setting up Cloudflare Turnstile (CAPTCHA):**
1. Create a free account at [Cloudflare](https://dash.cloudflare.com/)
2. Navigate to **Turnstile** in the dashboard
3. Click "Add Site"
4. Configure your site:
   - **Widget Mode**: Managed (recommended) or Non-Interactive
   - **Domains**: Add `localhost` for development and your production domain
5. Copy the **Site Key** and **Secret Key**
6. Add them to your `.env.local` file:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = Site Key
   - `TURNSTILE_SECRET_KEY` = Secret Key

**Why Turnstile?**
- ✅ **Free and privacy-friendly** - Better than reCAPTCHA
- ✅ **No tracking** - Respects user privacy
- ✅ **Lightweight** - Minimal impact on page load
- ✅ **Prevents bot spam** - Stops automated event creation abuse

4. **Set up the database**
```bash
# Run Supabase migrations
npm run db:migrate

# Or manually run the SQL from /supabase/migrations/001_initial_schema.sql
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🗄️ Database Schema

### Tables

**events**
- Stores event metadata (name, date range, password)
- Generates unique shareable URLs
- Tracks locked/unlocked status

**participants**
- Links people to events
- Stores names and session tokens
- Tracks submission status

**availability**
- Stores each participant's date selections
- Three states: available, unavailable, maybe
- Enables real-time availability aggregation

See full schema in [`/supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by When2Meet and Doodle
- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Hosted on [Vercel](https://vercel.com/)
- Database by [Supabase](https://supabase.com/)

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Guides](https://supabase.com/docs/guides)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

**Made with ❤️**

*Bringing friends together, one date at a time.*