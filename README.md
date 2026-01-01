# MeetMate - Group Scheduling Made Simple

> Find time together, without the hassle. No sign-up required.

A modern, mobile-first web application for coordinating group availability without requiring user accounts. Built for friends organizing social events who are tired of outdated scheduling tools.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

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
- 🌙 Dark mode

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
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: AI Integration (Phase 2)
ANTHROPIC_API_KEY=your_anthropic_key
```

4. **Set up the database**
```bash
# Run Supabase migrations
pnpm run db:migrate

# Or manually run the SQL from /supabase/migrations/001_initial_schema.sql
```

5. **Run the development server**
```bash
pnpm run dev
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

## 🎨 Design System

### Colors
```
Primary (Blue):   #3B82F6
Success (Green):  #10B981
Warning (Orange): #F59E0B
Error (Red):      #EF4444
Neutral (Gray):   Tailwind Gray scale
```

### Typography
- **Font Family**: Inter (system fallback)
- **Heading Scale**: 2xl → xl → lg → base
- **Body**: base (16px)
- **Small**: sm (14px)

### Spacing
Follows Tailwind's spacing scale (4px increments)

### Components
All UI components built with shadcn/ui for consistency and accessibility

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