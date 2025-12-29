# Group Scheduling App - Project Specification & Implementation Plan

## Executive Summary

A mobile-first web application for coordinating group availability without requiring user accounts. The app fills the gap between outdated tools (When2Meet) and over-engineered solutions (Doodle) by providing a clean, modern interface optimized for friends coordinating social events.

## Core Value Proposition

- **Zero friction**: No account creation required to participate
- **Mobile-first**: Touch-optimized interface that works seamlessly on phones
- **Smart calculation**: AI-powered optimal date finding
- **Password protection**: Optional security for private events
- **Clean UX**: Modern design without ads or clutter

---

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + Zustand (for complex state)
- **Calendar UI**: Custom date picker component
- **Responsive Design**: Mobile-first approach with breakpoints for tablet/desktop

### Backend Stack
- **Option A - Minimal Backend**: Next.js API Routes
- **Option B - Full Backend**: Node.js/Express OR Python/FastAPI
- **Recommendation**: Start with Next.js API Routes (Option A)

### Database
- **Primary**: Supabase (PostgreSQL)
- **Why Supabase**:
  - Built-in real-time subscriptions (see live updates when others vote)
  - Row-level security (RLS) for password-protected events
  - Easy setup with good Next.js integration
  - Generous free tier

### AI Integration
- **Purpose**: Calculate optimal meeting dates from availability patterns
- **Options**:
  1. **Claude API** (via Anthropic) - for natural language processing of complex constraints
  2. **Custom algorithm** - for simple overlap calculation (start here)
  3. **Hybrid approach** - algorithm for basic cases, AI for edge cases

### Hosting
- **Recommended**: Vercel (seamless Next.js deployment)
- **Alternative**: Railway, Render, or traditional hosting
- **Not recommended initially**: GoDaddy (better alternatives exist for modern apps)

---

## Database Schema

### Table: `events`
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  password_hash VARCHAR(255), -- bcrypt hash if password set
  creator_name VARCHAR(100),
  is_locked BOOLEAN DEFAULT FALSE, -- true when admin calculates result
  calculated_date DATE, -- the chosen optimal date
  share_url VARCHAR(50) UNIQUE NOT NULL -- short code for sharing
);
```

### Table: `participants`
```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  has_submitted BOOLEAN DEFAULT FALSE,
  session_token UUID UNIQUE DEFAULT gen_random_uuid() -- to prevent duplicate entries
);
```

### Table: `availability`
```sql
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'unavailable', 'maybe')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(participant_id, date)
);
```

### Indexes
```sql
CREATE INDEX idx_events_share_url ON events(share_url);
CREATE INDEX idx_participants_event ON participants(event_id);
CREATE INDEX idx_availability_participant ON availability(participant_id);
CREATE INDEX idx_availability_date ON availability(participant_id, date);
```

---

## User Flow & Features

### Phase 1: MVP (Weeks 1-4)

#### 1. Event Creation Flow
```
User lands on homepage
  ↓
Clicks "Create Event"
  ↓
Enters event details:
  - Event name (required)
  - Date range (start - end)
  - Creator name (optional)
  - Password (optional)
  ↓
System generates unique URL
  ↓
User sees event page with:
  - Shareable link (copy button)
  - Calendar for date selection
  - Empty participants list
```

**Technical Details**:
- Generate short, memorable URLs (e.g., `/e/sunny-dolphin-42` or `/e/xK9mP2`)
- Store creator session token in localStorage/cookie to identify admin
- Password: hash with bcrypt before storing, don't show in plaintext

#### 2. Participant Response Flow
```
User clicks shared link
  ↓
If password protected → Enter password
  ↓
Enters their name
  ↓
Sees calendar with date range
  ↓
Selects dates:
  - Tap once = Available (green)
  - Tap twice = Maybe (orange)
  - Tap three times = Unavailable (red)
  - Tap four times = Clear selection (default)
  ↓
Clicks "Confirm Selection"
  ↓
Sees summary:
  - Their selections
  - List of all participants
  - Who has/hasn't submitted
```

**Technical Details**:
- Mobile-first: large tap targets (min 44x44px)
- Visual feedback on each tap
- Prevent accidental submissions with confirmation step
- Store session token to allow editing later
- Real-time updates using Supabase subscriptions

#### 3. Results Calculation
```
Admin clicks "Calculate Best Date"
  ↓
System analyzes all availability:
  - Prioritizes "available" (weight: 1.0)
  - Includes "maybe" (weight: 0.5)
  - Excludes "unavailable" (weight: 0.0)
  ↓
Returns ranked list of dates:
  1. Most available dates
  2. Number of confirmed attendees
  3. Number of maybes
  ↓
Admin selects final date
  ↓
Event locks (no more edits)
  ↓
All participants see chosen date
```

**AI Integration** (optional for MVP):
```javascript
// Simple algorithm for MVP
function calculateOptimalDates(availabilityData) {
  const scores = {};
  
  availabilityData.forEach(({ date, status }) => {
    if (!scores[date]) scores[date] = { available: 0, maybe: 0, total: 0 };
    
    if (status === 'available') {
      scores[date].available++;
      scores[date].total += 1.0;
    } else if (status === 'maybe') {
      scores[date].maybe++;
      scores[date].total += 0.5;
    }
  });
  
  return Object.entries(scores)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([date, counts]) => ({
      date,
      score: counts.total,
      available: counts.available,
      maybe: counts.maybe
    }));
}
```

**Future AI Enhancement**:
- Send availability data to Claude API with prompt:
  > "Given this group availability, suggest the optimal meeting date considering: 1) Maximum attendance, 2) Avoiding outliers (if 1 person blocks all dates), 3) Proximity to weekend if applicable. Return JSON with ranked dates and reasoning."

---

### Phase 2: Enhanced Features (Weeks 5-8)

#### 4. Participant Management
- Edit your own availability after initial submission
- See visual heat map of overall availability
- Admin can remove troll/duplicate entries
- Export participant list

#### 5. Event Management
- Reopen locked events (admin only)
- Delete events (admin only)
- Set event description/notes
- Add event location (for future integration)

#### 6. Notifications (Without User Accounts)
**Challenge**: How to notify without accounts?

**Solution Options**:
1. **Email-based** (Recommended for Phase 2):
   - Participants optionally provide email when joining
   - Admin can send "nudge" to non-responders
   - Email when final date is chosen
   
2. **SMS via Twilio** (Phase 3):
   - Optional phone number collection
   - SMS notifications for event updates

3. **Push Notifications** (Phase 3):
   - Ask for notification permission
   - Browser push API for web notifications
   - PWA (Progressive Web App) capabilities

**Implementation**:
```javascript
// Add to participants table
email VARCHAR(255) OPTIONAL,
notify_on_changes BOOLEAN DEFAULT TRUE

// Email service (using Resend or SendGrid)
async function notifyParticipants(eventId, message) {
  const participants = await getParticipantsWithEmail(eventId);
  
  for (const p of participants) {
    if (p.email && p.notify_on_changes) {
      await sendEmail({
        to: p.email,
        subject: `Event Update: ${eventName}`,
        body: message
      });
    }
  }
}
```

---

## UI/UX Specifications

### Design System (shadcn/ui)

**Components Needed**:
- `Button` - Primary actions (Create Event, Confirm, Calculate)
- `Input` - Text fields (Event name, Your name, Password)
- `Card` - Event details, participant cards
- `Calendar` (Custom) - Date selection interface
- `Badge` - Status indicators (Submitted, Pending)
- `Dialog` - Modals (Password entry, Confirmations)
- `Toast` - Success/error notifications
- `Skeleton` - Loading states
- `Tabs` - Switch between views (Calendar, Participants, Results)

### Custom Components to Build

#### 1. DateRangePicker
```typescript
interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  selectedDates: Map<string, AvailabilityStatus>;
  onDateToggle: (date: Date) => void;
  readOnly?: boolean;
}

// Displays month view(s) covering the date range
// Each date shows status via color coding
// Mobile: swipe between months
// Desktop: show multiple months side-by-side
```

#### 2. AvailabilityCalendar
```typescript
interface AvailabilityCalendarProps {
  dateRange: { start: Date; end: Date };
  availabilityData: ParticipantAvailability[];
  mode: 'heatmap' | 'individual';
  onDateClick?: (date: Date) => void;
}

// Heatmap mode: Shows aggregate availability
// Individual mode: Shows your selections
// Color intensity = number of available participants
```

#### 3. ParticipantList
```typescript
interface ParticipantListProps {
  participants: Participant[];
  currentUserId?: string;
  showStatus: boolean;
  onRemove?: (id: string) => void; // admin only
}

// Shows all participants
// Visual indicator: checkmark (submitted) vs pending
// Highlight current user
// Admin: delete button for each participant
```

### Color Coding

```javascript
const AVAILABILITY_COLORS = {
  available: {
    bg: 'bg-green-100 dark:bg-green-900',
    border: 'border-green-500',
    text: 'text-green-700 dark:text-green-300'
  },
  maybe: {
    bg: 'bg-orange-100 dark:bg-orange-900',
    border: 'border-orange-500',
    text: 'text-orange-700 dark:text-orange-300'
  },
  unavailable: {
    bg: 'bg-red-100 dark:bg-red-900',
    border: 'border-red-500',
    text: 'text-red-700 dark:text-red-300'
  },
  unselected: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    text: 'text-gray-500'
  }
};
```

### Mobile Optimization

**Touch Interactions**:
- Minimum tap target: 44x44px (iOS guideline)
- Visual feedback: scale or brightness change on tap
- Long-press menu (future): bulk select dates
- Swipe gestures: navigate between months
- Pull-to-refresh: update participant list

**Responsive Breakpoints**:
```javascript
// tailwind.config.js
theme: {
  screens: {
    'sm': '640px',  // Mobile landscape, small tablets
    'md': '768px',  // Tablets
    'lg': '1024px', // Desktop
    'xl': '1280px', // Large desktop
  }
}

// Layout adjustments:
// Mobile: Single column, stack everything
// Tablet: 2-column layout (calendar + sidebar)
// Desktop: 3-column layout (sidebar, calendar, details)
```

---

## State Management Strategy

### Without User Accounts: Session Management

**Problem**: How to identify users without accounts?

**Solution**: Session tokens + localStorage

```typescript
// On first visit to event
interface Session {
  sessionToken: string; // UUID
  participantId: string | null; // After joining
  role: 'admin' | 'participant' | 'visitor';
  eventId: string;
}

// localStorage key: `session_${eventId}`
function initializeSession(eventId: string, isCreator: boolean): Session {
  const existing = localStorage.getItem(`session_${eventId}`);
  
  if (existing) {
    return JSON.parse(existing);
  }
  
  const session: Session = {
    sessionToken: crypto.randomUUID(),
    participantId: null,
    role: isCreator ? 'admin' : 'visitor',
    eventId
  };
  
  localStorage.setItem(`session_${eventId}`, JSON.stringify(session));
  return session;
}

// After participant joins
function updateSessionAsParticipant(eventId: string, participantId: string) {
  const session = getSession(eventId);
  session.participantId = participantId;
  session.role = 'participant';
  localStorage.setItem(`session_${eventId}`, JSON.stringify(session));
}
```

**Benefits**:
- Users can edit their responses by returning to the link
- Admin status persists (creator can manage event)
- No login required

**Limitations**:
- Clearing browser data = lose access
- Can't access from different device
- Potential for abuse (but password protection helps)

### Global State (Zustand)

```typescript
// store/eventStore.ts
interface EventState {
  event: Event | null;
  participants: Participant[];
  availability: AvailabilityMap;
  currentSession: Session | null;
  
  // Actions
  fetchEvent: (shareUrl: string) => Promise<void>;
  addParticipant: (name: string) => Promise<string>;
  updateAvailability: (dates: AvailabilityData[]) => Promise<void>;
  calculateOptimalDate: () => Promise<DateScore[]>;
  lockEvent: (chosenDate: Date) => Promise<void>;
}

const useEventStore = create<EventState>((set, get) => ({
  event: null,
  participants: [],
  availability: new Map(),
  currentSession: null,
  
  fetchEvent: async (shareUrl) => {
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('share_url', shareUrl)
      .single();
    
    const { data: participants } = await supabase
      .from('participants')
      .select('*')
      .eq('event_id', event.id);
    
    // Set up real-time subscription
    const channel = supabase
      .channel(`event_${event.id}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'participants' },
        (payload) => {
          // Update participants in real-time
        }
      )
      .subscribe();
    
    set({ event, participants });
  },
  
  // ... other actions
}));
```

---

## Real-time Updates

### Supabase Realtime Setup

```typescript
// hooks/useRealtimeEvent.ts
export function useRealtimeEvent(eventId: string) {
  const { participants, setParticipants } = useEventStore();
  
  useEffect(() => {
    const channel = supabase
      .channel(`event_${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'participants',
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          setParticipants([...participants, payload.new as Participant]);
          toast.success(`${payload.new.name} joined the event!`);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'participants',
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          // Update specific participant
          setParticipants(
            participants.map(p => 
              p.id === payload.new.id ? payload.new as Participant : p
            )
          );
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);
}
```

**Features Enabled**:
- See new participants join live
- See when others submit availability
- Update participant count in real-time
- Show "X people have responded" counter

---

## Security Considerations

### Password Protection

```typescript
// utils/auth.ts
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// API route: /api/events/[shareUrl]/verify
export async function POST(req: Request) {
  const { password } = await req.json();
  const { shareUrl } = req.params;
  
  const event = await getEventByShareUrl(shareUrl);
  
  if (!event.password_hash) {
    return Response.json({ valid: true }); // No password set
  }
  
  const valid = await verifyPassword(password, event.password_hash);
  
  if (valid) {
    // Generate temporary access token
    const token = crypto.randomUUID();
    // Store in Redis or temporary DB table with expiry
    await setAccessToken(token, shareUrl, '24h');
    
    return Response.json({ valid: true, token });
  }
  
  return Response.json({ valid: false }, { status: 401 });
}
```

### Rate Limiting

```typescript
// middleware.ts (Next.js)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
  
  return NextResponse.next();
}
```

### Supabase Row-Level Security

```sql
-- Only allow reading events if you have the share URL or are authenticated
CREATE POLICY "Events are viewable by anyone with the link"
  ON events FOR SELECT
  USING (true); -- Share URL is the access control

-- Only creator can update/delete
CREATE POLICY "Only creator can modify events"
  ON events FOR UPDATE
  USING (creator_session_token = current_setting('app.session_token'));

-- Anyone can add participants (after password check if needed)
CREATE POLICY "Anyone can add participants"
  ON participants FOR INSERT
  WITH CHECK (true);

-- Can only update your own participant record
CREATE POLICY "Can only update own participant"
  ON participants FOR UPDATE
  USING (session_token = current_setting('app.session_token'));
```

---

## Implementation Roadmap

### Week 1: Setup & Foundation
- [ ] Initialize Next.js project with TypeScript
- [ ] Setup Tailwind CSS + shadcn/ui
- [ ] Configure Supabase project and tables
- [ ] Create basic routing structure
- [ ] Setup environment variables (.env.local)

### Week 2: Core Event Flow
- [ ] Build event creation page
- [ ] Implement URL generation logic
- [ ] Create event detail page (read-only view)
- [ ] Build password protection flow
- [ ] Setup session management

### Week 3: Participant & Availability
- [ ] Build participant join flow
- [ ] Create custom calendar date picker component
- [ ] Implement date selection logic (tap to cycle states)
- [ ] Build availability submission
- [ ] Add real-time participant updates

### Week 4: Results & Polish
- [ ] Implement optimal date calculation algorithm
- [ ] Build results display page
- [ ] Add event locking mechanism
- [ ] Polish mobile responsiveness
- [ ] Add loading states and error handling

### Week 5-6: Enhanced Features
- [ ] Add email notifications (optional)
- [ ] Build heat map visualization
- [ ] Allow participants to edit submissions
- [ ] Add admin panel (participant management)
- [ ] Implement event deletion

### Week 7-8: Testing & Launch Prep
- [ ] Comprehensive testing (unit, integration, E2E)
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG)
- [ ] SEO optimization
- [ ] Deploy to Vercel
- [ ] Monitor and fix issues

---

## Alternative: User Account Option (Future)

If you later decide to add accounts:

### Benefits
- Multi-device access
- Event history
- Email notifications easier
- Calendar integrations
- Recurring events

### Implementation
- Use Supabase Auth (built-in)
- Social logins (Google, Apple)
- Still allow anonymous participation
- "Claim" events after creating account

```typescript
// Hybrid approach
interface EventAccess {
  requiresAuth: boolean; // false by default
  creatorUserId?: string; // if creator has account
  allowAnonymous: boolean; // true by default
}
```

---

## Open Questions & Decisions Needed

### 1. URL Format
**Options**:
- Random characters: `/e/xK9mP2` (6-8 chars, hard to guess)
- Readable words: `/e/sunny-dolphin-42` (memorable, easy to share verbally)
- UUID: `/e/550e8400-e29b-41d4-a716-446655440000` (secure but ugly)

**Recommendation**: Readable words for user-friendliness

### 2. "Maybe" Behavior in Calculation
**Options**:
- Treat as 50% available (weight: 0.5)
- Ignore completely (weight: 0.0)
- Let admin decide (toggle in settings)

**Recommendation**: Weight 0.5 (middle ground)

### 3. Maximum Date Range
**Options**:
- No limit (could be months-long events)
- 60 days max (reasonable for social events)
- Let creator decide, warn if >30 days

**Recommendation**: 90 days max, warning at 30

### 4. AI Integration Timing
**Options**:
- MVP: Simple algorithm only
- Phase 2: Add AI as "Smart Suggestions" feature
- Optional: Let user choose (AI vs Algorithm)

**Recommendation**: Start without AI, add in Phase 2 as premium feature

---

## Success Metrics

### MVP Success Criteria
- [ ] Event created in <30 seconds
- [ ] Participant joins in <15 seconds
- [ ] Mobile interface usable (no zoom/scroll issues)
- [ ] Real-time updates work reliably
- [ ] Password protection secure
- [ ] Optimal date calculation accurate for 3-10 people

### Future Metrics to Track
- Events created per day
- Average participants per event
- Response rate (% who click link vs submit)
- Time from event creation to all responses
- Mobile vs desktop usage split
- Event reopen rate (indicates calculation quality)

---

## Resources & Learning

### Supabase Tutorials
- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Next.js + shadcn/ui
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Building a Date Picker](https://ui.shadcn.com/docs/components/calendar)

### State Management
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Why Zustand over Context](https://tkdodo.eu/blog/zustand-and-react-context)

---

## Next Steps

1. **Validate with friends**: Show this spec to 3-5 people who'd use it
2. **Design mockups**: Sketch or use Figma for key screens
3. **Setup dev environment**: Create Next.js project, connect Supabase
4. **Build one vertical slice**: Event creation → joining → date selection (no polish)
5. **Test with real event**: Use it for an actual friend hangout
6. **Iterate based on feedback**: Fix pain points before building more features

---

**Questions to answer before coding**:
1. What's your timeline? (Evenings/weekends vs full-time)
2. Do you want to build this to learn or to actually use/launch?
3. What's your comfort level with TypeScript and Next.js?
4. Should we start even simpler (no AI, no real-time)?

Let me know which sections you want to dive deeper into!