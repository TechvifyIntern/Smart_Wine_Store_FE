"use client";

import { useState, useEffect, useRef } from "react";
import { stats } from "@/data/statistics";
import { useLocale } from "@/contexts/LocaleContext";

export function Statistics() {
  const { t } = useLocale();
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const timers = stats.map((stat, i) => {
      const target = parseInt(stat.number);
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 50); // update every 50ms
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounts((prev) =>
          prev.map((c, j) => (j === i ? Math.floor(current) : c))
        );
      }, 50);
      return timer;
    });

    return () => timers.forEach((timer) => clearInterval(timer));
  }, [hasStarted]);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-2">
              <p className="text-4xl sm:text-5xl md:text-6xl font-serif text-primary">
                {counts[idx]}
              </p>
              <p className="text-base sm:text-lg text-muted-foreground">{t(`statistics.${stat.key}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
