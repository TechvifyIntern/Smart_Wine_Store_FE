"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Locale = "vi" | "en";

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("vi");
    const [messages, setMessages] = useState<any>({});

    useEffect(() => {
        // Load locale from localStorage
        const savedLocale = localStorage.getItem("locale") as Locale;
        if (savedLocale && (savedLocale === "vi" || savedLocale === "en")) {
            setLocaleState(savedLocale);
        }
    }, []);

    useEffect(() => {
        // Load messages for current locale
        import(`@/locales/${locale}.json`).then((module) => {
            setMessages(module.default);
        });
    }, [locale]);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("locale", newLocale);
    };

    const t = (key: string): string => {
        const keys = key.split(".");
        let value: any = messages;
        for (const k of keys) {
            value = value?.[k];
        }
        return value || key;
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error("useLocale must be used within a LocaleProvider");
    }
    return context;
}
