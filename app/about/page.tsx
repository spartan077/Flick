export default function About() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-light-blue mb-8">
          About Flick
        </h1>
        
        <div className="space-y-8 text-light-blue/90">
          <section>
            <h2 className="text-2xl font-semibold text-bright-orange mb-4">
              Our Mission
            </h2>
            <p className="text-lg">
              Flick was created to make screen recording and sharing as simple as possible. 
              Whether you're creating tutorials, documenting bugs, or recording presentations, 
              we provide the tools you need to communicate effectively through video.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bright-orange mb-4">
              Technology
            </h2>
            <p className="text-lg">
              Built with cutting-edge technologies including Next.js, Supabase, and the 
              MediaStream API, Flick offers a seamless and reliable recording experience 
              right in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-bright-orange mb-4">
              Security
            </h2>
            <p className="text-lg">
              Your privacy and data security are our top priorities. All recordings are 
              stored securely and are only accessible to you unless you choose to share them.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
} 