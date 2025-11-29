import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

import viMessages from '@/locales/vi.json';
import enMessages from '@/locales/en.json';

export const locales = ['vi', 'en'] as const;
export type Locale = typeof locales[number];

const messages = {
    vi: viMessages,
    en: enMessages,
};

export default getRequestConfig(async ({ locale }) => {
    if (!locales.includes(locale as Locale)) notFound();

    return {
        locale: locale as string,
        messages: messages[locale as Locale]
    };
});
