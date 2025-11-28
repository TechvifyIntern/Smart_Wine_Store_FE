"use client";

import { useLocale } from "@/contexts/LocaleContext";

export default function OurStory() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <h2
          className="text-[7vw] md:text-[5vw] lg:text-[4vw] tracking-wide dark:text-white/90 text-gray-900 mb-16"
        >
          {t("parallax.ourStory")}
        </h2>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 ">
          {/* Left - Image */}
          <div className="relative">
            <div className="sticky top-20">
              {/* Main Image */}
              <div className="relative overflow-hidden">
                <img
                  src="/ourstory.png"
                  alt="Our Story"
                  className="w-full  object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-amber-700/30 -z-10" />
            </div>
          </div>

          {/* Right - Text Content */}
          <div className="flex flex-col justify-center">
            {/* Decorative line */}
            <div className="w-16 h-px bg-primary mb-8" />

            {/* Story Text */}
            <div className="space-y-6 text-gray-700 leading-relaxed text-base lg:text-lg dark:text-white/90">
              <p>
                {t("parallax.story1")} <span className="text-gray-900 dark:text-white font-medium">{t("parallax.founderName")}</span> {t("parallax.story2")}
              </p>
              <p>
                {t("parallax.story3")} <span className="text-gray-900 dark:text-white font-medium">{t("parallax.viticulturistName")}</span>.
              </p>

              <p>
                {t("parallax.story4")} <span className="text-gray-900 dark:text-white font-medium">{t("parallax.chairmanName")}</span> {t("parallax.story5")}
              </p>
            </div>

            {/* Timeline highlights */}
            <div className="mt-12 pt-8 border-t text-primary border-gray-300">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { year: '1956', event: t("parallax.timeline.firstVines") },
                  { year: '1976', event: t("parallax.timeline.pinotNoir") },
                  { year: '2019', event: t("parallax.timeline.newEra") },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <p
                      className="text-2xl lg:text-3xl"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {item.year}
                    </p>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">
                      {item.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}