"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";

export function Newsletter() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4 sm:space-y-6 text-center">
          <div>
            <p className="text-xs sm:text-sm tracking-widest text-primary uppercase mb-2">
              {t("newsletter.stayUpdated")}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif">
              {t("newsletter.title")}
            </h2>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
            {t("newsletter.description")}
          </p>

          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto px-2">
            <input
              type="email"
              placeholder={t("newsletter.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="bg-primary hover:bg-primary/90 text-sm sm:text-base py-2.5 sm:py-3">
              {t("newsletter.subscribeButton")}
            </Button>
          </form>

          <p className="text-[10px] sm:text-xs text-muted-foreground px-2">
            {t("newsletter.privacyNote")}
          </p>
        </div>
      </div>
    </section>
  );
}
