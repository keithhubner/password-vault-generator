import { faker } from "@faker-js/faker"
import { commonWeakPasswords } from "./constants"

export const generateWeakPassword = (): string => {
  const weakPasswordType = faker.helpers.arrayElement([
    "common",
    "short",
    "simple",
    "sequential",
    "repeated",
  ])

  switch (weakPasswordType) {
    case "common":
      return faker.helpers.arrayElement(commonWeakPasswords)
    case "short":
      return faker.internet.password({ length: faker.number.int({ min: 3, max: 6 }) })
    case "simple":
      return faker.internet.password({
        length: faker.number.int({ min: 6, max: 8 }),
        memorable: true,
        pattern: /[a-z]/,
      })
    case "sequential":
      const seqLength = faker.number.int({ min: 5, max: 8 })
      const seqStart = faker.number.int({ min: 0, max: 9 })
      if (faker.datatype.boolean()) {
        return Array.from({ length: seqLength }, (_, i) => (seqStart + i) % 10).join("")
      } else {
        const startChar = "a".charCodeAt(0) + faker.number.int({ min: 0, max: 20 })
        return Array.from({ length: seqLength }, (_, i) => String.fromCharCode(startChar + i)).join("")
      }
    case "repeated":
      const repChar = faker.helpers.arrayElement(["a", "1", "x", "0", "q", "z"])
      const repLength = faker.number.int({ min: 4, max: 8 })
      return repChar.repeat(repLength)
    default:
      return faker.helpers.arrayElement(commonWeakPasswords)
  }
}

export const generateTOTPSecret = (): string => {
  return faker.string.alphanumeric(32).toUpperCase()
}

export const generatePassword = (
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[]
): string => {
  // First check if we should reuse a password
  if (passwordPool.length > 0 && faker.number.int({ min: 1, max: 100 }) <= passwordReusePercentage) {
    return faker.helpers.arrayElement(passwordPool)
  }

  // Generate a new password (weak or strong)
  let password: string
  if (useWeakPasswords && faker.number.int({ min: 1, max: 100 }) <= weakPasswordPercentage) {
    password = generateWeakPassword()
  } else {
    password = faker.internet.password()
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
  weakPasswordPercentage: number
): string[] => {
  const passwordPool: string[] = []

  if (reusePasswords) {
    const poolSize = Math.max(5, Math.floor(loginCount * 0.3))

    for (let i = 0; i < poolSize; i++) {
      if (useWeakPasswords && faker.number.int({ min: 1, max: 100 }) <= weakPasswordPercentage) {
        passwordPool.push(generateWeakPassword())
      } else {
        passwordPool.push(faker.internet.password())
      }
    }
  }

  return passwordPool
}