import { faker } from "@faker-js/faker"
import { BitwardenVault, BitwardenOrgVault, BitwardenVaultItem, BaseItem, LoginItem, SecureNoteItem, CreditCardItem, IdentityItem } from "../types"
import { generatePassword, generateTOTPSecret } from "../utils/password-generators"
import { popularWebsites } from "../utils/constants"

export const createBitwardenItem = (
  objType: string,
  count: number,
  vaultType: "individual" | "org",
  useRealUrls: boolean,
  collections: { id: string; name: string }[],
  distributeItems: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[]
): BitwardenVaultItem[] => {
  const items: BitwardenVaultItem[] = []

  for (let i = 0; i < count; i++) {
    const baseItem: BaseItem = {
      id: faker.string.uuid(),
      organizationId: vaultType === "org" ? faker.string.uuid() : null,
      folderId: vaultType === "individual" ? faker.string.uuid() : "",
      type: 1,
      name: "",
      notes: "",
      favorite: faker.datatype.boolean(),
      fields: [],
      collectionIds: [],
      revisionDate: faker.date.recent().toISOString(),
      creationDate: faker.date.past().toISOString(),
      deletedDate: null,
      reprompt: 0,
    }

    if (vaultType === "org" && distributeItems && collections.length > 0) {
      const numCollections = faker.number.int({ min: 1, max: 3 })
      const shuffledCollections = [...collections].sort(() => 0.5 - Math.random())
      baseItem.collectionIds = shuffledCollections.slice(0, numCollections).map((c) => c.id)
    }

    let item: BitwardenVaultItem

    switch (objType) {
      case "objType1":
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

        item = {
          ...baseItem,
          type: 1,
          name: website + " Login",
          notes: faker.lorem.paragraph(),
          login: {
            uris: [
              {
                match: null,
                uri: `https://www.${website}`,
              },
            ],
            username: faker.internet.userName(),
            password: password,
            totp: generateTOTPSecret(),
          },
          passwordHistory: [
            {
              lastUsedDate: faker.date.past().toISOString(),
              password: faker.internet.password(),
            },
          ],
        }
        break
      case "objType2":
        item = {
          ...baseItem,
          type: 2,
          name: "My Secure Note",
          notes: faker.lorem.paragraph(),
          secureNote: { type: 0 },
        }
        break
      case "objType3":
        item = {
          ...baseItem,
          type: 3,
          name: faker.finance.accountName(),
          notes: faker.lorem.paragraph(),
          card: {
            cardholderName: faker.person.fullName(),
            brand: "Visa",
            number: faker.finance.creditCardNumber(),
            expMonth: faker.number.int({ min: 1, max: 12 }).toString(),
            expYear: faker.date.future().getFullYear().toString(),
            code: faker.finance.creditCardCVV(),
          },
        }
        break
      case "objType4":
        item = {
          ...baseItem,
          type: 4,
          name: faker.person.fullName(),
          notes: faker.lorem.paragraph(),
          identity: {
            title: faker.person.prefix(),
            firstName: faker.person.firstName(),
            middleName: faker.person.middleName(),
            lastName: faker.person.lastName(),
            address1: faker.location.streetAddress(),
            address2: faker.location.secondaryAddress(),
            address3: null,
            city: faker.location.city(),
            state: faker.location.state(),
            postalCode: faker.location.zipCode(),
            country: faker.location.country(),
            company: faker.company.name(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            ssn: faker.string.numeric(9),
            username: faker.internet.userName(),
            passportNumber: faker.string.alphanumeric(9),
            licenseNumber: faker.string.alphanumeric(8),
          },
        }
        break
      default:
        throw new Error(`Unknown object type: ${objType}`)
    }

    items.push(item)
  }

  return items
}

export const generateBitwardenVault = (
  loginCount: number,
  secureNoteCount: number,
  creditCardCount: number,
  identityCount: number,
  vaultType: "individual" | "org",
  useRealUrls: boolean,
  collections: { id: string; organizationId: string; name: string; externalId: null }[],
  distributeItems: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[]
): BitwardenVault | BitwardenOrgVault => {
  const collectionRefs = collections.map(c => ({ id: c.id, name: c.name }))

  if (vaultType === "individual") {
    const vault: BitwardenVault = { folders: [], items: [] }
    vault.items = [
      ...createBitwardenItem("objType1", loginCount, vaultType, useRealUrls, collectionRefs, false, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool),
      ...createBitwardenItem("objType2", secureNoteCount, vaultType, useRealUrls, collectionRefs, false, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool),
      ...createBitwardenItem("objType3", creditCardCount, vaultType, useRealUrls, collectionRefs, false, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool),
      ...createBitwardenItem("objType4", identityCount, vaultType, useRealUrls, collectionRefs, false, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool),
    ]
    return vault
  } else {
    const orgVault: BitwardenOrgVault = { collections, items: [] }
    orgVault.items = [
      ...createBitwardenItem("objType1", loginCount, vaultType, useRealUrls, collectionRefs, distributeItems, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool),
      ...createBitwardenItem("objType2", secureNoteCount, vaultType, useRealUrls, collectionRefs, distributeItems, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool),
      ...createBitwardenItem("objType3", creditCardCount, vaultType, useRealUrls, collectionRefs, distributeItems, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool),
      ...createBitwardenItem("objType4", identityCount, vaultType, useRealUrls, collectionRefs, distributeItems, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool),
    ]
    return orgVault
  }
}