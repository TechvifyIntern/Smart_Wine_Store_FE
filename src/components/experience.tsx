export function Experience() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div>
              <p className="text-sm tracking-widest text-primary uppercase mb-2">Tasting & Tours</p>
              <h2 className="text-4xl md:text-5xl font-serif">
                Experience Wine Like Never Before
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Join us for exclusive wine tastings and vineyard tours at our estate. Our expert sommeliers will guide you through our collection, sharing stories and insights about each vintage. Perfect for wine enthusiasts and beginners alike.
            </p>

            <ul className="space-y-3">
              {['Expert Guidance', 'Small Group Tours', 'Premium Tastings', 'Exclusive Events'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium">
              <span>Book Your Experience</span>
              <span>→</span>
            </button>
          </div>

          {/* Image */}
          <div>
            <img
              src="/wine-tasting-event-elegant-luxury.jpg"
              alt="Wine tasting experience"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
