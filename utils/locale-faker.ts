import { 
  faker,
  fakerAR,
  fakerDA,
  fakerDE,
  fakerEL,
  fakerES,
  fakerFI,
  fakerFR,
  fakerHE,
  fakerHR,
  fakerHU,
  fakerIT,
  fakerJA,
  fakerKO,
  fakerLV,
  fakerNL,
  fakerPL,
  fakerRO,
  fakerRU,
  fakerSK,
  fakerSV,
  fakerTH,
  fakerTR,
  fakerVI,
  fakerZH_CN,
  fakerZH_TW
} from "@faker-js/faker"

const localeMap: Record<string, typeof faker> = {
  en: faker,
  ar: fakerAR,
  da: fakerDA,
  de: fakerDE,
  el: fakerEL,
  es: fakerES,
  fi: fakerFI,
  fr: fakerFR,
  he: fakerHE,
  hr: fakerHR,
  hu: fakerHU,
  it: fakerIT,
  ja: fakerJA,
  ko: fakerKO,
  lv: fakerLV,
  nl: fakerNL,
  pl: fakerPL,
  ro: fakerRO,
  ru: fakerRU,
  sk: fakerSK,
  sv: fakerSV,
  th: fakerTH,
  tr: fakerTR,
  vi: fakerVI,
  zh_CN: fakerZH_CN,
  zh_TW: fakerZH_TW,
}

export function getFakerForLocale(locale: string): typeof faker {
  return localeMap[locale] || faker
}

export function getSupportedLocales(): string[] {
  return Object.keys(localeMap)
}