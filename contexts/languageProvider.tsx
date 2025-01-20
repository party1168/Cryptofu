"use client";

import React, { createContext, useContext, useState} from "react";
import zhTW from "@/locales/zh";

//type Locale = 'zh-TW' | 'en';
type Locale = "zh-TW";
type Translations = typeof zhTW;

const translations: Record<Locale, Translations> = {
  "zh-TW": zhTW,
};

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: NestedKeyOf<Translations>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState<Locale>("zh-TW");

  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[locale];
    for (const k of keys) {
      value = value[k];
      if (value === undefined) return key;
    }
    return value as string;
  };
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
