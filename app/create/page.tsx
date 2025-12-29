export default function CreateEventPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Event
        </h1>
        <p className="text-gray-600 mb-8">
          Set up your group scheduling event in seconds
        </p>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="event-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Event Name
            </label>
            <input
              type="text"
              id="event-name"
              placeholder="e.g., Weekend Brunch Planning"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start-date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="end-date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="creator-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="creator-name"
              placeholder="e.g., John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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
              placeholder="Leave blank for public event"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Protect your event with a password
            </p>
          </div>

          <button
            type="button"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Create Event
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Your event will be created instantly with a unique shareable link
        </p>
      </div>
    </div>
  );
}
