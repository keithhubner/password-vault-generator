import { faker } from "@faker-js/faker"
import { KeePassXItem } from "../types"
import { generatePassword } from "../utils/password-generators"
import { popularWebsites } from "../utils/constants"

export const createKeePassXItem = (
  number: number,
  useRealUrls: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[]
): KeePassXItem[] => {
  const items: KeePassXItem[] = []
  
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

    const hasUrl = faker.datatype.boolean(0.9)
    const hasUsername = faker.datatype.boolean(0.95)
    const hasNotes = faker.datatype.boolean(0.7)

    const item: KeePassXItem = {
      title: website + " Login",
      username: hasUsername ? faker.internet.userName() : "",
      password: password,
      url: hasUrl ? `https://www.${website}` : "",
      notes: hasNotes ? faker.lorem.sentence() : "",
    }
    items.push(item)
  }
  
  return items
}