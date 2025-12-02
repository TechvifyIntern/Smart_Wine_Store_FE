"use client";

import { useEffect, useState } from "react";
import { getEvents } from "../../services/event/api";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import Image from "next/image";
import { Event } from "@/types/events";
import { Spinner } from "@/components/ui/spinner";

export default function EventsClient() {
  const { t } = useLocale();
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await getEvents(0, 12);
        if (!response.success) {
          setError(response.message);
        } else {
          setEventsData(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Banner */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-primary/80 to-primary/60 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/farm.avif')" }}
        />
        <div className="relative z-20 text-center text-white px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">
            {t("events.hero.title")}
          </h1>
          <p className="text-lg md:text-xl opacity-90 font-light">
            {t("events.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="py-16 flex justify-center items-center">
          <Spinner size="lg" className="text-primary" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="py-16 text-center text-red-500">
          <p className="text-xl">
            {t("common.error")}: {error}
          </p>
        </div>
      )}

      {/* Events */}
      {!isLoading && !error && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {eventsData.map((event) => (
                <div
                  key={event.EventID}
                  className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-border/40"
                >
                  {/* Image */}
                  <div className="relative h-60 overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
                    <img
                      src={event.ImageURL ?? "/placeholder.jpg"}
                      alt={event.EventName}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {event.EventName}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.Description}
                    </p>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(event.TimeStart).toLocaleDateString()} -{" "}
                          {new Date(event.TimeEnd).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(event.TimeStart).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          →{" "}
                          {new Date(event.TimeEnd).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                      <Button
                        variant="outline"
                        className="group-hover:bg-primary group-hover:text-white transition-colors"
                      >
                        View Detail
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {eventsData.length === 0 && (
              <p className="text-center text-lg text-muted-foreground mt-10">
                {t("events.empty")}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
