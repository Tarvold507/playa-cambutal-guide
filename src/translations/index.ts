
import { enTranslations } from './en';
import { esTranslations } from './es';

export const translations = {
  en: enTranslations,
  es: esTranslations,
};

export type TranslationKey = keyof typeof enTranslations;
