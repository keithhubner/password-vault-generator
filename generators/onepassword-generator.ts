import { faker } from "@faker-js/faker"
import { OnePasswordItem } from "../types"
import { generatePassword, generateTOTPSecret } from "../utils/password-generators"
import { popularWebsites } from "../utils/constants"
import { generateUniqueTags, distributeItemsToTags } from "../utils/collection-generators"

export const createOnePasswordItem = (
  number: number,
  useRealUrls: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[],
  useTags: boolean = false,
  tagCount: number = 10,
  taggedItemPercentage: number = 60
): OnePasswordItem[] => {
  const items: OnePasswordItem[] = []
  
  // Generate tags if enabled
  let availableTags: string[] = []
  let distributedTags: string[] = []
  
  if (useTags && tagCount > 0) {
    availableTags = generateUniqueTags(tagCount)
    distributedTags = distributeItemsToTags(number, availableTags, taggedItemPercentage)
  } else {
    // Fill with empty strings for no tags
    distributedTags = new Array(number).fill('')
  }
  
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

    const item: OnePasswordItem = {
      title: website + " Login",
      website: `https://www.${website}`,
      username: faker.internet.email(),
      password: password,
      oneTimePassword: generateTOTPSecret(),
      favoriteStatus: faker.datatype.boolean({ probability: 0.1 }), // 10% favorites
      archivedStatus: faker.datatype.boolean({ probability: 0.05 }), // 5% archived
      tags: distributedTags[i], // Use distributed tags
      notes: faker.datatype.boolean({ probability: 0.3 }) ? faker.lorem.sentence() : '', // 30% have notes
    }
    items.push(item)
  }
  
  return items
}