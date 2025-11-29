import { faker } from "@faker-js/faker"
import { PasswordDepotItem } from "../types/password-depot"
import { generatePassword } from "../utils/password-generators"
import { popularWebsites, enterpriseWebsites } from "../utils/constants"

const passwordDepotCategories = [
  "Internet",
  "Email",
  "Banking",
  "Shopping",
  "Social Media",
  "Work",
  "Entertainment",
  "Education",
  "Health",
  "Finance",
  "Travel",
  "Gaming",
  "Software",
  "Business",
  "Personal",
]

const importanceLevels = [
  "Low",
  "Normal", 
  "High",
  "Critical",
]

export const createPasswordDepotItems = (
  count: number,
  useRealUrls: boolean,
  useEnterpriseUrls: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[],
  customEnterpriseUrls?: string[]
): PasswordDepotItem[] => {
  const items: PasswordDepotItem[] = []

  for (let i = 0; i < count; i++) {
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

    // Generate dates
    const lastModified = faker.date.recent({ days: 90 })
    const expiryDate = faker.date.future({ years: 1 })

    const item: PasswordDepotItem = {
      description: `${website} Login`,
      importance: faker.helpers.arrayElement(importanceLevels),
      password: password,
      lastModified: lastModified.toISOString().split('T')[0], // YYYY-MM-DD format
      expiryDate: expiryDate.toISOString().split('T')[0], // YYYY-MM-DD format
      userName: faker.internet.username(),
      url: `https://www.${website}`,
      comments: faker.lorem.sentence(),
      category: faker.helpers.arrayElement(passwordDepotCategories),
    }

    items.push(item)
  }

  return items
}

export const convertPasswordDepotToCSV = (items: PasswordDepotItem[]): string => {
  // Password Depot CSV format: Description;Importance;Password;Last modified;Expiry Date;User Name;URL;Comments;Category
  const csvRows = items.map(item => {
    return [
      item.description,
      item.importance,
      item.password,
      item.lastModified,
      item.expiryDate,
      item.userName,
      item.url,
      item.comments,
      item.category
    ].join(';')
  })

  return csvRows.join('\n')
}