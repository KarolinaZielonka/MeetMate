'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDateRange, parseDate } from '@/lib/utils/dates';
import { getSession, isAdmin, isParticipant } from '@/lib/utils/session';

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-red-600 mb-4">
                {error === 'Event not found' ? 'Event Not Found' : 'Error'}
              </h1>
              <p className="text-gray-600 mb-6">
                {error || 'Unable to load event'}
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format date range for display
  const startDate = parseDate(event.start_date);
  const endDate = parseDate(event.end_date);
  const dateRangeText = formatDateRange(startDate, endDate);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {event.name}
              </h1>
              <p className="text-lg text-gray-600">
                {dateRangeText}
              </p>
              {event.creator_name && (
                <p className="text-sm text-gray-500 mt-2">
                  Created by {event.creator_name}
                </p>
              )}
            </div>

            {/* Role Badge */}
            {userRole === 'admin' && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                Admin
              </span>
            )}
            {userRole === 'participant' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Participant
              </span>
            )}
          </div>

          {/* Locked Event Badge */}
          {event.is_locked && event.calculated_date && (
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-indigo-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-indigo-900">Event Locked</p>
                  <p className="text-sm text-indigo-700">
                    Chosen date: {formatDateRange(parseDate(event.calculated_date), parseDate(event.calculated_date))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Share URL Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Share this event:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm">
                {typeof window !== 'undefined' ? window.location.href : ''}
              </code>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Join Event Section - Placeholder for Phase 2 */}
        {!isParticipant(event.id) && !event.is_locked && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Join This Event
            </h2>
            <p className="text-gray-600 mb-4">
              Enter your name to participate and share your availability.
            </p>
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-center">
                Join functionality coming in Phase 2
              </p>
            </div>
          </div>
        )}

        {/* Participant Info - Placeholder */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What's Next?
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Join the event by entering your name (Phase 2)</li>
            <li>Select your available dates on the calendar (Phase 3)</li>
            <li>See other participants' responses in real-time (Phase 4)</li>
            <li>Find the optimal meeting date (Phase 5)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
