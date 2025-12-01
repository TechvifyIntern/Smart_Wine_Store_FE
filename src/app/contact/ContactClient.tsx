"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/contexts/LocaleContext";

export default function ContactClient() {
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert("Thank you for contacting us! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/farm.avif')" }}
        />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif mb-6">
            {t("contact.hero.title")}
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-90">
            {t("contact.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {t("contact.info.visit.title")}
              </h3>
              <p
                className="text-sm text-muted-foreground"
                style={{ whiteSpace: "pre-line" }}
              >
                {t("contact.info.visit.address")}
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {t("contact.info.call.title")}
              </h3>
              <p
                className="text-sm text-muted-foreground"
                style={{ whiteSpace: "pre-line" }}
              >
                {t("contact.info.call.phones")}
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {t("contact.info.email.title")}
              </h3>
              <p
                className="text-sm text-muted-foreground"
                style={{ whiteSpace: "pre-line" }}
              >
                {t("contact.info.email.addresses")}
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {t("contact.info.hours.title")}
              </h3>
              <p
                className="text-sm text-muted-foreground"
                style={{ whiteSpace: "pre-line" }}
              >
                {t("contact.info.hours.schedule")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-serif mb-4">
                  {t("contact.form.title")}
                </h2>
                <p className="text-muted-foreground">
                  {t("contact.form.description")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {t("contact.form.fullName")} {t("contact.form.required")}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={t("contact.form.fullNamePlaceholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {t("contact.form.email")} {t("contact.form.required")}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={t("contact.form.emailPlaceholder")}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("contact.form.phone")}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t("contact.form.phonePlaceholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      {t("contact.form.subject")} {t("contact.form.required")}
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t("contact.form.subjectPlaceholder")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    {t("contact.form.message")} {t("contact.form.required")}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder={t("contact.form.messagePlaceholder")}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    t("contact.form.sending")
                  ) : (
                    <>
                      {t("contact.form.sendButton")}{" "}
                      <Send className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Google Map Placeholder */}
              <div className="bg-muted rounded-xl overflow-hidden shadow-lg h-[400px]">
                <iframe
                  src="https://www.google.com/maps?q=363%20Nguy%E1%BB%85n%20H%E1%BB%AFu%20Th%E1%BB%8D%2C%20Khu%C3%AA%20Trung%2C%20C%E1%BA%A9m%20L%E1%BB%87%2C%20%C4%90%C3%A0%20N%E1%BA%B5ng%20550000%2C%20Vi%E1%BB%87t%20Nam&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Additional Info Card */}
              <div className="bg-card p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-serif mb-6">
                  {t("contact.whyVisit.title")}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        {t("contact.whyVisit.items.consultation.title")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("contact.whyVisit.items.consultation.description")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        {t("contact.whyVisit.items.tastingRoom.title")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("contact.whyVisit.items.tastingRoom.description")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        {t("contact.whyVisit.items.privateEvents.title")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("contact.whyVisit.items.privateEvents.description")}
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-semibold mb-4">
                    {t("contact.followUs")}
                  </h4>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              {t("contact.faq.title")}
            </h2>
            <p className="text-muted-foreground">{t("contact.faq.subtitle")}</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: t("contact.faq.items.shipping.q"),
                a: t("contact.faq.items.shipping.a"),
              },
              {
                q: t("contact.faq.items.tastings.q"),
                a: t("contact.faq.items.tastings.a"),
              },
              {
                q: t("contact.faq.items.returns.q"),
                a: t("contact.faq.items.returns.a"),
              },
              {
                q: t("contact.faq.items.states.q"),
                a: t("contact.faq.items.states.a"),
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-background p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
