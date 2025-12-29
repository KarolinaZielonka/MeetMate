export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 pt-20 pb-24 bg-gradient-to-br from-blue-50 to-indigo-100">
 
      {/* How It Works Section */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to coordinate any group
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transition-smooth group-hover:scale-110 group-hover:shadow-xl">
                1
              </div>
              <div className="flex-1 transition-smooth group-hover:translate-x-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Event</h3>
                <p className="text-gray-600">
                  Set your event name and date range. Get a shareable link instantly.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transition-smooth group-hover:scale-110 group-hover:shadow-xl">
                2
              </div>
              <div className="flex-1 transition-smooth group-hover:translate-x-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Share With Your Group</h3>
                <p className="text-gray-600">
                  Send the link to participants. They mark their availability with a tap.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transition-smooth group-hover:scale-110 group-hover:shadow-xl">
                3
              </div>
              <div className="flex-1 transition-smooth group-hover:translate-x-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Find the Perfect Time</h3>
                <p className="text-gray-600">
                  See optimal dates ranked automatically. Lock in your meeting when ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
