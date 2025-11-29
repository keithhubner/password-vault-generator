import { faker } from "@faker-js/faker"
import { LastPassItem } from "../types"
import { generatePassword, generateTOTPSecret } from "../utils/password-generators"
import { popularWebsites, enterpriseWebsites } from "../utils/constants"

export const createLastPassItem = (
  number: number,
  useRealUrls: boolean,
  useEnterpriseUrls: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[],
  customEnterpriseUrls?: string[]
): LastPassItem[] => {
  const items: LastPassItem[] = []

  for (let i = 0; i < number; i++) {
    let website: string
    if (useRealUrls) {
      if (useEnterpriseUrls) {
        const urlList = customEnterpriseUrls && customEnterpriseUrls.length > 0
          ? customEnterpriseUrls
          : enterpriseWebsites
        website = faker.helpers.arrayElement(urlList)
      } else {
        website = faker.helpers.arrayElement(popularWebsites)
      }
    } else {
      website = faker.internet.domainName()
    }

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