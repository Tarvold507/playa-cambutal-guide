
import { en } from './en';
import { es } from './es';

export const translations = {
  en: en,
  es: es,
};

export type TranslationKey = keyof typeof en;
