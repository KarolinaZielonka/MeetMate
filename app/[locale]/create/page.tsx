'use client';

import { getDateRangeLength, validateDateRange } from '@/lib/utils/dates';
import { initializeSession } from '@/lib/utils/session';
import { useRouter } from '@/i18n/routing';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function CreateEventPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    creatorName: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (error) setError(null);
  };

  // Validate date range when dates change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);

    const { name, value } = e.target;
    const newStartDate = name === 'startDate' ? value : formData.startDate;
    const newEndDate = name === 'endDate' ? value : formData.endDate;

    // Only validate if both dates are set
    if (newStartDate && newEndDate) {
      try {
        const validation = validateDateRange(newStartDate, newEndDate);
        if (!validation.valid) {
          setError(validation.error || null);
          setWarning(null);
        } else if (validation.warning) {
          setWarning(validation.warning);
          setError(null);
        } else {
          setError(null);
          setWarning(null);
        }
      } catch (err) {
        setError('Invalid date format');
        setWarning(null);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setError(null);
    setWarning(null);

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Event name is required');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Both start and end dates are required');
      return;
    }

    // Validate date range
    const dateValidation = validateDateRange(formData.startDate, formData.endDate);
    if (!dateValidation.valid) {
      setError(dateValidation.error || 'Invalid date range');
      return;
    }

    setIsLoading(true);

    try {
      // Call API to create event
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          start_date: formData.startDate,
          end_date: formData.endDate,
          creator_name: formData.creatorName.trim() || undefined,
          password: formData.password || undefined
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || 'Failed to create event');
        setIsLoading(false);
        return;
      }

      // Success! Initialize admin session
      const eventId = result.data.id;
      const shareUrl = result.data.share_url;

      initializeSession(eventId, true); // true = isCreator/admin

      // Redirect to event page
      router.push(`/e/${shareUrl}`);
    } catch (err) {
      console.error('Error creating event:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Create New Event
          </h1>
          <p className="text-lg text-gray-600">
            Set up your group scheduling event in seconds
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-xl border-none slide-up">
          <CardContent className="pt-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Event Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold shadow-md transition-smooth hover:scale-110">
                    1
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Event Details</h2>
                </div>

                {/* Event Name */}
                <div className="space-y-2 group">
                  <Label htmlFor="name" className="text-base font-semibold">
                    Event Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Weekend Brunch Planning"
                    maxLength={255}
                    required
                    disabled={isLoading}
                    className="h-12 text-base transition-smooth focus:shadow-md"
                  />
                  <p className="text-sm text-muted-foreground">
                    Choose a clear, descriptive name for your event
                  </p>
                </div>

                {/* Date Range */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Date Range <span className="text-red-500">*</span>
                  </Label>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-sm text-muted-foreground">
                        Start Date
                      </Label>
                      <Input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleDateChange}
                        required
                        disabled={isLoading}
                        className="h-12 transition-smooth focus:shadow-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-sm text-muted-foreground">
                        End Date
                      </Label>
                      <Input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleDateChange}
                        required
                        disabled={isLoading}
                        className="h-12 transition-smooth focus:shadow-md"
                      />
                    </div>
                  </div>

                  {/* Date range info */}
                  {formData.startDate && formData.endDate && !error && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg fade-in">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-blue-900 font-medium">
                        Date range: {getDateRangeLength(formData.startDate, formData.endDate)} days
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Section 2: Optional Settings */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-700 font-bold transition-smooth hover:scale-110">
                    2
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Optional Settings</h2>
                </div>

                {/* Creator Name */}
                <div className="space-y-2">
                  <Label htmlFor="creatorName" className="text-base font-semibold">
                    Your Name
                  </Label>
                  <Input
                    type="text"
                    id="creatorName"
                    name="creatorName"
                    value={formData.creatorName}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                    maxLength={100}
                    disabled={isLoading}
                    className="h-12 text-base transition-smooth focus:shadow-md"
                  />
                  <p className="text-sm text-muted-foreground">
                    Let participants know who created this event
                  </p>
                </div>

                {/* Password Protection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="password" className="text-base font-semibold">
                      Password Protection
                    </Label>
                    <Badge variant="secondary" className="text-xs hover-scale">Optional</Badge>
                  </div>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank for public event"
                    disabled={isLoading}
                    className="h-12 text-base transition-smooth focus:shadow-md"
                  />
                  <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Add a password to restrict access to your event
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              {warning && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg fade-in">
                  <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-orange-800">{warning}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg fade-in">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !!error}
                className="w-full h-14 text-lg bg-gradient-primary hover:opacity-90 shadow-lg hover:shadow-xl transition-smooth hover-lift"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="spin-smooth h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Event...
                  </span>
                ) : (
                  'Create Event'
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-center text-sm text-gray-600">
                Your event will be created instantly with a unique shareable link
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
