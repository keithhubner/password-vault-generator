import { faker } from "@faker-js/faker"
import { commonWeakPasswords } from "./constants"
import { getFakerForLocale } from "./locale-faker"
import { getLocaleSpecificWeakPassword } from "./locale-content"

export const generateWeakPassword = (locale: string = "en"): string => {
  const localeFaker = getFakerForLocale(locale)
  const weakPasswordType = localeFaker.helpers.arrayElement([
    "common",
    "short",
    "simple",
    "sequential",
    "repeated",
    "locale-specific",
  ])

  switch (weakPasswordType) {
    case "common":
      return localeFaker.helpers.arrayElement(commonWeakPasswords)
    case "short":
      return localeFaker.internet.password({ length: localeFaker.number.int({ min: 3, max: 6 }) })
    case "simple":
      return localeFaker.internet.password({
        length: localeFaker.number.int({ min: 6, max: 8 }),
        memorable: true,
        pattern: /[a-z]/,
      })
    case "sequential":
      const seqLength = localeFaker.number.int({ min: 5, max: 8 })
      const seqStart = localeFaker.number.int({ min: 0, max: 9 })
      if (localeFaker.datatype.boolean()) {
        return Array.from({ length: seqLength }, (_, i) => (seqStart + i) % 10).join("")
      } else {
        const startChar = "a".charCodeAt(0) + localeFaker.number.int({ min: 0, max: 20 })
        return Array.from({ length: seqLength }, (_, i) => String.fromCharCode(startChar + i)).join("")
      }
    case "repeated":
      const repChar = localeFaker.helpers.arrayElement(["a", "1", "x", "0", "q", "z"])
      const repLength = localeFaker.number.int({ min: 4, max: 8 })
      return repChar.repeat(repLength)
    case "locale-specific":
      return getLocaleSpecificWeakPassword(locale)
    default:
      return localeFaker.helpers.arrayElement(commonWeakPasswords)
  }
}

export const generateTOTPSecret = (locale: string = "en"): string => {
  const localeFaker = getFakerForLocale(locale)
  return localeFaker.string.alphanumeric(32).toUpperCase()
}

export const generatePassword = (
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[],
  locale: string = "en"
): string => {
  const localeFaker = getFakerForLocale(locale)
  
  // First check if we should reuse a password
  if (passwordPool.length > 0 && localeFaker.number.int({ min: 1, max: 100 }) <= passwordReusePercentage) {
    return localeFaker.helpers.arrayElement(passwordPool)
  }

  // Generate a new password (weak or strong)
  let password: string
  if (useWeakPasswords && localeFaker.number.int({ min: 1, max: 100 }) <= weakPasswordPercentage) {
    password = generateWeakPassword(locale)
  } else {
    password = localeFaker.internet.password()
  }

  // Add new password to the pool if it's not already there
  if (reusePasswords && !passwordPool.includes(password)) {
    passwordPool.push(password)
  }

  return password
}

export const initializePasswordPool = (
  reusePasswords: boolean,
  loginCount: number,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  locale: string = "en"
): string[] => {
  const passwordPool: string[] = []

  if (reusePasswords) {
    const localeFaker = getFakerForLocale(locale)
    const poolSize = Math.max(5, Math.floor(loginCount * 0.3))

    for (let i = 0; i < poolSize; i++) {
      if (useWeakPasswords && localeFaker.number.int({ min: 1, max: 100 }) <= weakPasswordPercentage) {
        passwordPool.push(generateWeakPassword(locale))
      } else {
        passwordPool.push(localeFaker.internet.password())
      }
    }
  }

  return passwordPool
}