"use client";

import { Facebook, Instagram, Twitter } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-card border-t border-border py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <div className="text-xl sm:text-2xl font-serif text-primary">WINEICY</div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("footer.brandDescription")}
            </p>
          </div>

          {/* Links */}
          <div className="text-center sm:text-left">
            <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.collections.title")}</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.collections.redWines")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.collections.whiteWines")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.collections.roseWines")}
                </a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="text-center sm:text-left">
            <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.company.title")}</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.company.aboutUs")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.company.events")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.company.contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="text-center sm:text-left">
            <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.followUs")}</h4>
            <div className="flex gap-4 justify-center sm:justify-start">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-full"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61583397211015"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-full"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-full"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <p className="text-center sm:text-left">{t("footer.copyright")}</p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <a href="#" className="hover:text-foreground transition-colors text-center">
              {t("footer.privacyPolicy")}
            </a>
            <a href="#" className="hover:text-foreground transition-colors text-center">
              {t("footer.termsOfService")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
