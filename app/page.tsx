import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen text-center p-8">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-light-blue mb-4">
            Welcome to <span className="text-bright-orange">Flick</span>
          </h1>
          <p className="text-xl text-goldenrod mb-8">
            Record, save, and share your screen recordings with ease. 
            Perfect for tutorials, presentations, and bug reports.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link 
              href="/about" 
              className="bg-navy-blue/30 text-light-blue hover:bg-navy-blue/50 text-lg px-8 py-3 rounded transition-colors duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-navy-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-light-blue text-center mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-navy-blue/30 rounded-lg">
              <h3 className="text-xl font-semibold text-bright-orange mb-4">
                Easy Recording
              </h3>
              <p className="text-light-blue">
                Start recording your screen with just one click. Capture audio and video seamlessly.
              </p>
            </div>
            <div className="p-6 bg-navy-blue/30 rounded-lg">
              <h3 className="text-xl font-semibold text-bright-orange mb-4">
                Secure Storage
              </h3>
              <p className="text-light-blue">
                All your recordings are securely stored and easily accessible from anywhere.
              </p>
            </div>
            <div className="p-6 bg-navy-blue/30 rounded-lg">
              <h3 className="text-xl font-semibold text-bright-orange mb-4">
                Quick Sharing
              </h3>
              <p className="text-light-blue">
                Share your recordings instantly with anyone, anywhere in the world.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 