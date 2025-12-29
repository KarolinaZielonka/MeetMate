'use client';

import { getDateRangeLength, validateDateRange } from '@/lib/utils/dates';
import { initializeSession } from '@/lib/utils/session';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Event
        </h1>
        <p className="text-gray-600 mb-8">
          Set up your group scheduling event in seconds
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Weekend Brunch Planning"
              maxLength={255}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Date Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleDateChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleDateChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Date range info */}
          {formData.startDate && formData.endDate && !error && (
            <div className="text-sm text-gray-600">
              Date range: {getDateRangeLength(formData.startDate, formData.endDate)} days
            </div>
          )}

          {/* Creator Name */}
          <div>
            <label
              htmlFor="creatorName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="creatorName"
              name="creatorName"
              value={formData.creatorName}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Password Protection */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password Protection (Optional)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank for public event"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Protect your event with a password
            </p>
          </div>

          {/* Warning Message */}
          {warning && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">{warning}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !!error}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Your event will be created instantly with a unique shareable link
        </p>
      </div>
    </div>
  );
}
