import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { defaultLocale, locales, type Locale } from "./config";
import en from "../../messages/en.json";
import es from "../../messages/es.json";

const messages: Record<Locale, typeof en> = { en, es };

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // 1. Check cookie
  const cookieLocale = cookieStore.get("locale")?.value as Locale | undefined;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return {
      locale: cookieLocale,
      messages: messages[cookieLocale],
    };
  }

  // 2. Check Accept-Language header
  const acceptLang = headerStore.get("accept-language") ?? "";
  const preferred = acceptLang
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase())
    .find((lang) => locales.includes(lang as Locale)) as Locale | undefined;

  const locale = preferred ?? defaultLocale;

  return {
    locale,
    messages: messages[locale],
  };
});
