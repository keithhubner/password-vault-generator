import { faker } from "@faker-js/faker"
import { KeePassXItem } from "../types"
import { generatePassword } from "../utils/password-generators"
import { popularWebsites, enterpriseWebsites } from "../utils/constants"

export const createKeePassXItem = (
  number: number,
  useRealUrls: boolean,
  useEnterpriseUrls: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[],
  customEnterpriseUrls?: string[]
): KeePassXItem[] => {
  const items: KeePassXItem[] = []

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

    const hasUrl = faker.datatype.boolean(0.9)
    const hasUsername = faker.datatype.boolean(0.95)
    const hasNotes = faker.datatype.boolean(0.7)

    const item: KeePassXItem = {
      title: website + " Login",
      username: hasUsername ? faker.internet.username() : "",
      password: password,
      url: hasUrl ? `https://www.${website}` : "",
      notes: hasNotes ? faker.lorem.sentence() : "",
    }
    items.push(item)
  }
  
  return items
}