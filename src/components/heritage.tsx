export function Heritage() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 md:order-1">
            <img
              src="/wine-vineyard-landscape-winery-elegant.jpg"
              alt="Historic vineyard"
              className="w-full h-auto rounded-xl"
            />
          </div>

          {/* Content */}
          <div className="order-1 md:order-2 space-y-6">
            <div>
              <p className="text-sm tracking-widest text-primary uppercase mb-2">A New Generation</p>
              <h2 className="text-4xl md:text-5xl font-serif">
                Of Winemakers
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              For over two decades, we've been perfecting the art of winemaking. Our commitment to quality and tradition has positioned us as leaders in the industry. Each bottle represents our passion for excellence and our respect for the craft.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Our vineyards span the most prestigious regions, where our master winemakers work tirelessly to create extraordinary wines that tell the story of their terroir.
            </p>

            <button className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
              <span className="text-sm font-medium">Discover Our Story</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
