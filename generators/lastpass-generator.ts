import { faker } from "@faker-js/faker"
import { LastPassItem } from "../types"
import { generatePassword, generateTOTPSecret } from "../utils/password-generators"
import { popularWebsites } from "../utils/constants"

export const createLastPassItem = (
  number: number,
  useRealUrls: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[]
): LastPassItem[] => {
  const items: LastPassItem[] = []
  
  for (let i = 0; i < number; i++) {
    const website = useRealUrls
      ? faker.helpers.arrayElement(popularWebsites)
      : faker.internet.domainName()

    const password = generatePassword(
      useWeakPasswords,
      weakPasswordPercentage,
      reusePasswords,
      passwordReusePercentage,
      passwordPool
    )

    const item: LastPassItem = {
      url: `https://www.${website}`,
      username: faker.internet.email(),
      password: password,
      extra: faker.lorem.paragraph(),
      name: website + " Login",
      grouping: "",
      totp: generateTOTPSecret(),
    }
    items.push(item)
  }
  
  return items
}