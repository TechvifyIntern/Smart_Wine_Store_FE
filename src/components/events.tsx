import { events } from '@/data/events'

export function Events() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <p className="text-sm tracking-widest text-primary uppercase">Events & Experiences</p>
          <h2 className="text-4xl md:text-5xl font-serif">
            Celebrate With Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <div key={event.discountEventID} className="space-y-4">
              <div className="h-64 rounded-xl overflow-hidden">
                <img
                  src={event.imageURL || "/placeholder.svg"}
                  alt={event.eventName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-serif">{event.eventName}</h3>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
