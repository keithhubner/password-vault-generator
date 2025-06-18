import { faker } from "@faker-js/faker"
import { EdgePasswordItem } from "../types"
import { generatePassword } from "../utils/password-generators"
import { popularWebsites } from "../utils/constants"

export const createEdgePasswordItem = (
  number: number,
  useRealUrls: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[]
): EdgePasswordItem[] => {
  const items: EdgePasswordItem[] = []
  
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