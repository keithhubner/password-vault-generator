import { faker } from "@faker-js/faker"
import { EdgePasswordItem } from "../types"
import { generatePassword } from "../utils/password-generators"
import { popularWebsites, enterpriseWebsites } from "../utils/constants"

export const createEdgePasswordItem = (
  number: number,
  useRealUrls: boolean,
  useEnterpriseUrls: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[],
  customEnterpriseUrls?: string[]
): EdgePasswordItem[] => {
  const items: EdgePasswordItem[] = []

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

    const item: EdgePasswordItem = {
      name: website + " Login",
      url: `https://www.${website}`,
      username: faker.internet.email(),
      password: password,
      note: faker.lorem.sentence(),
    }
    items.push(item)
  }
  
  return items
}