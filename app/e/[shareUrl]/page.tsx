'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDateRange, parseDate } from '@/lib/utils/dates';
import { getSession, isParticipant } from '@/lib/utils/session';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

interface EventData {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  share_url: string;
  creator_name: string | null;
  is_locked: boolean;
  calculated_date: string | null;
  created_at: string;
  has_password: boolean;
}

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const shareUrl = params.shareUrl as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'participant' | 'visitor'>('visitor');
  const [copySuccess, setCopySuccess] = useState(false);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/events/${shareUrl}`);
        const result = await response.json();

        if (!response.ok || result.error) {
          if (response.status === 404) {
            setError('Event not found');
          } else {
            setError(result.error || 'Failed to load event');
          }
          setIsLoading(false);
          return;
        }

        setEvent(result.data);

        // Check session for this event
        const session = getSession(result.data.id);
        if (session) {
          setUserRole(session.role);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('An unexpected error occurred');
        setIsLoading(false);
      }
    };

    if (shareUrl) {
      fetchEvent();
    }
  }, [shareUrl]);

  // Handle copy to clipboard
  const handleCopyLink = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-soft pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="shadow-lg border-none">
            <CardHeader>
              <Skeleton className="h-10 w-3/4 mb-2 shimmer" />
              <Skeleton className="h-6 w-1/2 shimmer" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full shimmer" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-soft pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto fade-in">
          <Card className="shadow-lg border-none">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 bounce-subtle">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {error === 'Event not found' ? 'Event Not Found' : 'Oops!'}
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                {error || 'Unable to load event. Please check the link and try again.'}
              </p>
              <Button
                onClick={() => router.push('/')}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 hover-lift"
              >
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Format date range for display
  const startDate = parseDate(event.start_date);
  const endDate = parseDate(event.end_date);
  const dateRangeText = formatDateRange(startDate, endDate);

  return (
    <div className="min-h-screen bg-gradient-soft pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Event Header Card */}
        <Card className="shadow-xl border-none fade-in">
          <CardHeader>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{event.name}</h1>

                  {/* Role Badge */}
                  {userRole === 'admin' && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-none shadow-md hover-scale">
                      <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      Admin
                    </Badge>
                  )}
                  {userRole === 'participant' && (
                    <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-none shadow-md hover-scale">
                      <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Participant
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-lg text-gray-600 mb-2">
                  <svg className="w-5 h-5 text-[#0047AB] transition-smooth hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {dateRangeText}
                </div>

                {event.creator_name && (
                  <p className="text-sm text-gray-500">
                    Created by <span className="font-semibold">{event.creator_name}</span>
                  </p>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Locked Event Status */}
            {event.is_locked && event.calculated_date && (
              <>
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl fade-in">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-md hover-scale-icon">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-blue-900 text-lg mb-1">Event Locked</p>
                      <p className="text-blue-800">
                        Chosen date: <span className="font-semibold">{formatDateRange(parseDate(event.calculated_date), parseDate(event.calculated_date))}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Share Section */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Share this event with participants
              </Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg font-mono text-sm overflow-x-auto transition-smooth hover:border-blue-300">
                  {typeof window !== 'undefined' ? window.location.href : ''}
                </div>
                <Button
                  onClick={handleCopyLink}
                  className={`${copySuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-primary hover:opacity-90'} shadow-md transition-smooth hover-lift min-w-[120px]`}
                >
                  {copySuccess ? (
                    <>
                      <svg className="w-4 h-4 mr-2 bounce-subtle" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2 transition-smooth group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Join Event Section */}
        {!isParticipant(event.id) && !event.is_locked && (
          <Card className="shadow-lg border-none slide-up">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center shadow-md hover-scale-icon">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                Join This Event
              </CardTitle>
              <CardDescription className="text-base">
                Enter your name to participate and share your availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 transition-smooth hover:border-blue-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg pulse-soft">
                    <svg className="w-8 h-8 text-[#0047AB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-blue-900 font-semibold text-lg">
                    Join functionality coming in Phase 2
                  </p>
                  <p className="text-blue-700 text-sm mt-2">
                    Soon you&apos;ll be able to add your availability and see when everyone can meet
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* What's Next Section */}
        <Card className="shadow-lg border-none slide-up">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <svg className="w-7 h-7 text-[#0047AB] transition-smooth hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              What&apos;s Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { text: 'Join the event by entering your name', phase: 'Phase 2' },
                { text: 'Select your available dates on the calendar', phase: 'Phase 3' },
                { text: "See other participants' responses in real-time", phase: 'Phase 4' },
                { text: 'Find the optimal meeting date automatically', phase: 'Phase 5' }
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg transition-smooth hover:bg-gray-100 hover:shadow-md group">
                  <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5 transition-smooth group-hover:scale-110">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{item.text}</p>
                    <p className="text-sm text-gray-500">{item.phase}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
