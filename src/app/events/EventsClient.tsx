"use client";

import { useState } from "react";
import { events } from "@/data/events";
import { Calendar, Clock, MapPin, Users, Wine, Utensils, BookOpen, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import Image from "next/image";

const categoryIcons = {
    tasting: Wine,
    workshop: BookOpen,
    dinner: Utensils,
    festival: Music,
};

const categoryColors = {
    tasting: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    workshop: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    dinner: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    festival: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
};

export default function EventsClient() {
    const { t } = useLocale();
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const categories = ["all", "tasting", "workshop", "dinner", "festival"];

    const filteredEvents = selectedCategory === "all"
        ? events
        : events.filter(event => event.category === selectedCategory);

    const featuredEvent = events.find(e => e.featured);

    return (
        <div className="pt-16">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/farm.avif')" }}
                />
                <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-serif mb-6">{t("events.hero.title")}</h1>
                    <p className="text-xl md:text-2xl font-light opacity-90">
                        {t("events.hero.subtitle")}
                    </p>
                </div>
            </section>

            {/* Featured Event */}
            {featuredEvent && (
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="text-primary text-sm font-semibold uppercase tracking-wider">{t("events.featured")}</span>
                            <h2 className="text-3xl md:text-4xl font-serif mt-2">Don't Miss Out</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-center bg-background rounded-2xl overflow-hidden shadow-lg">
                            <div className="relative h-[400px]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${featuredEvent.image})` }}
                                />
                            </div>
                            <div className="p-8 md:p-12">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${categoryColors[featuredEvent.category]}`}>
                                    {(() => {
                                        const Icon = categoryIcons[featuredEvent.category];
                                        return <Icon className="w-4 h-4" />;
                                    })()}
                                    {featuredEvent.category.charAt(0).toUpperCase() + featuredEvent.category.slice(1)}
                                </div>
                                <h3 className="text-3xl font-serif mb-4">{featuredEvent.title}</h3>
                                <p className="text-muted-foreground mb-6">{featuredEvent.description}</p>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        <span>{new Date(featuredEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <span>{featuredEvent.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <span>{featuredEvent.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Users className="w-5 h-5 text-primary" />
                                        <span>{featuredEvent.availableSeats} {t("events.details.availableSeats").toLowerCase()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-3xl font-bold text-primary">${featuredEvent.price}</span>
                                        <span className="text-muted-foreground ml-2">per person</span>
                                    </div>
                                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                                        {t("events.bookNow")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Filter Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === cat
                                    ? "bg-primary text-white shadow-lg"
                                    : "bg-card hover:bg-muted text-foreground"
                                    }`}
                            >
                                {t(`events.filters.${cat}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event) => (
                            <div key={event.id} className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <div
                                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                                        style={{ backgroundImage: `url(${event.image})` }}
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[event.category]}`}>
                                            {event.category}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {event.description}
                                    </p>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4" />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-primary">${event.price}</span>
                                        </div>
                                        <Button variant="outline" className="group-hover:bg-primary group-hover:text-white transition-colors">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
