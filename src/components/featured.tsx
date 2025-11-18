import { featured } from '@/data/featured'
import { Button } from '@/components/ui/button'

export function Featured() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <p className="text-sm tracking-widest text-primary uppercase">Featured Collection</p>
            <h2 className="text-4xl md:text-5xl font-serif">
              {featured.productName}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Product Image */}
            <div className="flex justify-center">
              <img
                src={featured.imageURL || "/placeholder.svg"}
                alt={featured.productName}
                className="h-96 object-cover"
              />
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{featured.detail.producer}</p>
                <h3 className="text-3xl font-serif">{featured.detail.varietal}</h3>
                <p className="text-2xl text-primary font-light">${featured.price}</p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {featured.detail.descriptionContents}
              </p>

              <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Alcohol</p>
                  <p className="text-lg font-medium">{featured.detail.abv}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Region</p>
                  <p className="text-lg font-medium">{featured.detail.origin}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-lg font-medium">{featured.detail.size}</p>
                </div>
              </div>

              <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
