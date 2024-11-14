export default function Contact() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-light-blue mb-8">
          Contact Us
        </h1>

        <div className="bg-navy-blue/20 p-8 rounded-lg backdrop-blur-sm">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-bright-orange mb-4">
                Get in Touch
              </h2>
              <p className="text-light-blue text-lg mb-4">
                Have questions or feedback? We'd love to hear from you!
              </p>
            </section>

            <section className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-goldenrod mb-2">
                  Email
                </h3>
                <a 
                  href="mailto:saatviktiwari@gmail.com"
                  className="text-light-blue hover:text-bright-orange transition-colors"
                >
                  saatviktiwari@gmail.com
                </a>
              </div>

              <div>
                <h3 className="text-xl font-medium text-goldenrod mb-2">
                  Phone
                </h3>
                <a 
                  href="tel:+917238032032"
                  className="text-light-blue hover:text-bright-orange transition-colors"
                >
                  +91 7238032032
                </a>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-bright-orange mb-4">
                Office Hours
              </h2>
              <p className="text-light-blue">
                Monday - Friday: 9:00 AM - 6:00 PM (IST)<br />
                Saturday - Sunday: Closed
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
} 