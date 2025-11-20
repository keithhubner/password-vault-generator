import { faker } from "@faker-js/faker"
import { BitwardenVault, BitwardenOrgVault, BitwardenVaultItem, BaseItem, LoginItem, SecureNoteItem, CreditCardItem, IdentityItem } from "../types"
import { generatePassword, generateTOTPSecret } from "../utils/password-generators"
import { popularWebsites, enterpriseWebsites } from "../utils/constants"
import { getFakerForLocale } from "../utils/locale-faker"
import { getLocaleSpecificCompany, getLocaleSpecificNote } from "../utils/locale-content"

export const createBitwardenItem = (
  objType: string,
  count: number,
  vaultType: "individual" | "org",
  useRealUrls: boolean,
  useEnterpriseUrls: boolean,
  collections: { id: string; name: string }[],
  distributeItems: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[],
  locale: string = "en"
): BitwardenVaultItem[] => {
  const items: BitwardenVaultItem[] = []
  const localeFaker = getFakerForLocale(locale)

  for (let i = 0; i < count; i++) {
    const baseItem: BaseItem = {
      id: localeFaker.string.uuid(),
      organizationId: vaultType === "org" ? localeFaker.string.uuid() : null,
      folderId: vaultType === "individual" ? localeFaker.string.uuid() : "",
      type: 1,
      name: "",
      notes: "",
      favorite: localeFaker.datatype.boolean(),
      fields: [],
      collectionIds: [],
      revisionDate: localeFaker.date.recent().toISOString(),
      creationDate: localeFaker.date.past().toISOString(),
      deletedDate: null,
      reprompt: 0,
    }

    if (vaultType === "org" && distributeItems && collections.length > 0) {
      const numCollections = localeFaker.number.int({ min: 1, max: 3 })
      const shuffledCollections = [...collections].sort(() => 0.5 - Math.random())
      baseItem.collectionIds = shuffledCollections.slice(0, numCollections).map((c) => c.id)
    }

    let item: BitwardenVaultItem

    switch (objType) {
      case "objType1":
        let website: string
        if (useRealUrls) {
          website = useEnterpriseUrls
            ? localeFaker.helpers.arrayElement(enterpriseWebsites)
            : localeFaker.helpers.arrayElement(popularWebsites)
        } else {
          website = localeFaker.internet.domainName()
        }

        const password = generatePassword(
          useWeakPasswords,
          weakPasswordPercentage,
          reusePasswords,
          passwordReusePercentage,
          passwordPool,
          locale
        )

        item = {
          ...baseItem,
          type: 1,
          name: website + " Login",
          notes: getLocaleSpecificNote(locale),
          login: {
            uris: [
              {
                match: null,
                uri: `https://www.${website}`,
              },
            ],
            username: localeFaker.internet.username(),
            password: password,
            totp: generateTOTPSecret(),
          },
          passwordHistory: [
            {
              lastUsedDate: localeFaker.date.past().toISOString(),
              password: localeFaker.internet.password(),
            },
          ],
        }
        break
      case "objType2":
        item = {
          ...baseItem,
          type: 2,
          name: "My Secure Note",
          notes: getLocaleSpecificNote(locale),
          secureNote: { type: 0 },
        }
        break
      case "objType3":
        item = {
          ...baseItem,
          type: 3,
          name: localeFaker.finance.accountName(),
          notes: getLocaleSpecificNote(locale),
          card: {
            cardholderName: localeFaker.person.fullName(),
            brand: "Visa",
            number: localeFaker.finance.creditCardNumber(),
            expMonth: localeFaker.number.int({ min: 1, max: 12 }).toString(),
            expYear: localeFaker.date.future().getFullYear().toString(),
            code: localeFaker.finance.creditCardCVV(),
          },
        }
        break
      case "objType4":
        item = {
          ...baseItem,
          type: 4,
          name: localeFaker.person.fullName(),
          notes: getLocaleSpecificNote(locale),
          identity: {
            title: localeFaker.person.prefix(),
            firstName: localeFaker.person.firstName(),
            middleName: localeFaker.person.middleName(),
            lastName: localeFaker.person.lastName(),
            address1: localeFaker.location.streetAddress(),
            address2: localeFaker.location.secondaryAddress(),
            address3: null,
            city: localeFaker.location.city(),
            state: localeFaker.location.state(),
            postalCode: localeFaker.location.zipCode(),
            country: localeFaker.location.country(),
            company: getLocaleSpecificCompany(locale),
            email: localeFaker.internet.email(),
            phone: localeFaker.phone.number(),
            ssn: localeFaker.string.numeric(9),
            username: localeFaker.internet.username(),
            passportNumber: localeFaker.string.alphanumeric(9),
            licenseNumber: localeFaker.string.alphanumeric(8),
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
  useEnterpriseUrls: boolean,
  collections: { id: string; organizationId: string; name: string; externalId: null }[],
  distributeItems: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[],
  locale: string = "en"
): BitwardenVault | BitwardenOrgVault => {
  const collectionRefs = collections.map(c => ({ id: c.id, name: c.name }))

  if (vaultType === "individual") {
    const vault: BitwardenVault = { folders: [], items: [] }
    vault.items = [
      ...createBitwardenItem("objType1", loginCount, vaultType, useRealUrls, useEnterpriseUrls, collectionRefs, false, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool, locale),
      ...createBitwardenItem("objType2", secureNoteCount, vaultType, useRealUrls, useEnterpriseUrls, collectionRefs, false, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool, locale),
      ...createBitwardenItem("objType3", creditCardCount, vaultType, useRealUrls, useEnterpriseUrls, collectionRefs, false, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool, locale),
      ...createBitwardenItem("objType4", identityCount, vaultType, useRealUrls, useEnterpriseUrls, collectionRefs, false, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool, locale),
    ]
    return vault
  } else {
    const orgVault: BitwardenOrgVault = { collections, items: [] }
    orgVault.items = [
      ...createBitwardenItem("objType1", loginCount, vaultType, useRealUrls, useEnterpriseUrls, collectionRefs, distributeItems, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool, locale),
      ...createBitwardenItem("objType2", secureNoteCount, vaultType, useRealUrls, useEnterpriseUrls, collectionRefs, distributeItems, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool, locale),
      ...createBitwardenItem("objType3", creditCardCount, vaultType, useRealUrls, useEnterpriseUrls, collectionRefs, distributeItems, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool, locale),
      ...createBitwardenItem("objType4", identityCount, vaultType, useRealUrls, useEnterpriseUrls, collectionRefs, distributeItems, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool, locale),
    ]
    return orgVault
  }
}