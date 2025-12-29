import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            MeetSync
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Group Scheduling Made Simple
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Find time together, without the hassle. No sign-up required.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/create"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Create Event
          </Link>
        </div>

        <div
          id="how-it-works"
          className="mt-16 grid md:grid-cols-3 gap-8 text-left"
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">1. Create Event</h3>
            <p className="text-gray-600">
              Set your event name, date range, and optional password protection
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">2. Share Link</h3>
            <p className="text-gray-600">
              Share the unique link with your group - no accounts needed
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">3. Find Best Date</h3>
            <p className="text-gray-600">
              See everyone's availability and find the optimal meeting time
            </p>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>
            Built with Next.js, TypeScript, and Supabase •{" "}
            <a
              href="https://github.com"
              className="text-blue-600 hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
