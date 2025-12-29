export default async function EventPage({
  params,
}: {
  params: Promise<{ shareUrl: string }>;
}) {
  const { shareUrl } = await params;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Event: {shareUrl}
          </h1>
          <p className="text-gray-600">
            Event detail page - Coming soon
          </p>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              What's Next?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-blue-800">
              <li>Join event by entering your name</li>
              <li>Select your available dates on the calendar</li>
              <li>See other participants' responses in real-time</li>
              <li>Find the optimal meeting date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
