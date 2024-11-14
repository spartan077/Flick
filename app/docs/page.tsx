export default function Documentation() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-light-blue mb-8">
          Documentation
        </h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-bright-orange mb-4">
              Getting Started
            </h2>
            <div className="prose prose-invert max-w-none">
              <ol className="list-decimal list-inside space-y-4 text-light-blue">
                <li>Create an account or sign in to get started</li>
                <li>Navigate to the Record page</li>
                <li>Click "Start Recording" and choose what to share</li>
                <li>Stop the recording when finished</li>
                <li>Add a title and description</li>
                <li>Click upload to save your recording</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bright-orange mb-4">
              Features Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-navy-blue/20 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-goldenrod mb-3">
                  Screen Recording
                </h3>
                <p className="text-light-blue">
                  Record your entire screen, an application window, or a browser tab with audio support.
                </p>
              </div>
              <div className="bg-navy-blue/20 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-goldenrod mb-3">
                  Video Management
                </h3>
                <p className="text-light-blue">
                  View, download, and delete your recordings from the dashboard.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bright-orange mb-4">
              FAQ
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-goldenrod mb-2">
                  What browsers are supported?
                </h3>
                <p className="text-light-blue">
                  Flick works best on modern browsers like Chrome, Firefox, and Edge.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-goldenrod mb-2">
                  Is there a recording time limit?
                </h3>
                <p className="text-light-blue">
                  Currently, recordings are limited to 30 minutes per session.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
} 