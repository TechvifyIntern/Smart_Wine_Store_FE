"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6 text-center">
          <div>
            <p className="text-sm tracking-widest text-primary uppercase mb-2">
              Stay Updated
            </p>
            <h2 className="text-4xl md:text-5xl font-serif">
              Join Our Newsletter
            </h2>
          </div>

          <p className="text-muted-foreground text-lg">
            Subscribe to receive exclusive updates about new releases, tastings,
            and special events.
          </p>

          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="bg-primary hover:bg-primary/90">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
