"use client"

import { useState } from "react"
import { faker } from "@faker-js/faker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Lock } from "lucide-react"
import { Slider } from "@/components/ui/slider"

// Bitwarden interfaces
interface BaseItem {
  id: string
  organizationId: string | null
  folderId: string
  type: number
  name: string
  notes: string
  favorite: boolean
  fields: { name: string; value: string; type: number }[]
  collectionIds: string[]
  revisionDate: string
  creationDate: string
  deletedDate: null
  reprompt: number
}

interface LoginItem extends BaseItem {
  type: 1
  login: {
    uris: { match: null; uri: string }[]
    username: string
    password: string
    totp: string
  }
  passwordHistory: {
    lastUsedDate: string
    password: string
  }[]
}

interface SecureNoteItem extends BaseItem {
  type: 2
  secureNote: { type: number }
}

interface CreditCardItem extends BaseItem {
  type: 3
  card: {
    cardholderName: string
    brand: string
    number: string
    expMonth: string
    expYear: string
    code: string
  }
}

interface IdentityItem extends BaseItem {
  type: 4
  identity: {
    title: string
    firstName: string
    middleName: string
    lastName: string
    address1: string
    address2: string
    address3: string | null
    city: string
    state: string
    postalCode: string
    country: string
    company: string
    email: string
    phone: string
    ssn: string
    username: string
    passportNumber: string
    licenseNumber: string
  }
}

type BitwardenVaultItem = LoginItem | SecureNoteItem | CreditCardItem | IdentityItem

interface BitwardenVault {
  folders: { id: string; name: string }[]
  items: BitwardenVaultItem[]
}

interface BitwardenOrgVault {
  collections: { id: string; organizationId: string; name: string; externalId: null }[]
  items: BitwardenVaultItem[]
}

// LastPass interface
interface LastPassItem {
  url: string
  username: string
  password: string
  extra: string
  name: string
  grouping: string
  totp: string
}

// Edge interface
interface EdgePasswordItem {
  name: string
  url: string
  username: string
  password: string
  note: string
}

// KeePassX interface
interface KeePassXItem {
  title: string
  username: string
  password: string
  url: string
  notes: string
}

// Add these interfaces after the KeePassXItem interface
interface KeePass2String {
  Key: string
  Value: string
  ProtectInMemory?: boolean
}

interface KeePass2Times {
  LastModificationTime: string
  CreationTime: string
  LastAccessTime: string
  ExpiryTime: string
  Expires: boolean
  UsageCount: number
  LocationChanged: string
}

// Update the KeePass2 interfaces to match the actual format

// Replace the KeePass2Meta interface with this more complete version:
interface KeePass2Meta {
  Generator: string
  SettingsChanged: string
  DatabaseName: string
  DatabaseNameChanged: string
  DatabaseDescription: string
  DatabaseDescriptionChanged: string
  DefaultUserName: string
  DefaultUserNameChanged: string
  MaintenanceHistoryDays: number
  Color: string
  MasterKeyChanged: string
  MasterKeyChangeRec: number
  MasterKeyChangeForce: number
  MemoryProtection: {
    ProtectTitle: boolean
    ProtectTitle: boolean
    ProtectUserName: boolean
    ProtectPassword: boolean
    ProtectURL: boolean
    ProtectNotes: boolean
  }
  RecycleBinEnabled: boolean
  RecycleBinUUID: string
  RecycleBinChanged: string
  EntryTemplatesGroup: string
  EntryTemplatesGroupChanged: string
  HistoryMaxItems: number
  HistoryMaxSize: number
  LastSelectedGroup: string
  LastTopVisibleGroup: string
}

// Update the KeePass2Group interface to include additional fields
interface KeePass2Group {
  UUID: string
  Name: string
  Notes: string
  IconID: number
  Times: KeePass2Times
  IsExpanded: boolean
  DefaultAutoTypeSequence: string
  EnableAutoType: string
  EnableSearching: string
  LastTopVisibleEntry: string
  Entries?: KeePass2Entry[]
  Groups?: KeePass2Group[] // For nested groups
}

// Update the KeePass2Entry interface to include additional fields
interface KeePass2Entry {
  UUID: string
  IconID: number
  ForegroundColor: string
  BackgroundColor: string
  OverrideURL: string
  Tags: string
  Times: KeePass2Times
  Strings: KeePass2String[]
  AutoType?: {
    Enabled: boolean
    DataTransferObfuscation: number
    Association?: {
      Window: string
      KeystrokeSequence: string
    }[]
  }
}

// Update the KeePass2File interface to include DeletedObjects
interface KeePass2File {
  Meta: KeePass2Meta
  Root: {
    Group: KeePass2Group
    DeletedObjects: any
  }
}

// Keeper interface with updated folder structure
interface KeeperFolder {
  name: string
  path?: string // Full path for nested folders (e.g., "Personal/Finance/Banking")
  children?: KeeperFolder[] // For nested folders
}

interface KeeperSharedFolder {
  name: string
  can_edit: boolean
  can_share: boolean
  path?: string // Full path for nested folders
  children?: KeeperSharedFolder[] // For nested folders
}

// Updated to support nested folders
interface KeeperFolderReference {
  folder?: string
  folder_path?: string // Full path for nested folders
  shared_folder?: string
  shared_folder_path?: string // Full path for nested folders
  can_edit?: boolean
  can_share?: boolean
}

interface KeeperRecord {
  title: string
  login: string
  password: string
  login_url: string
  notes: string
  custom_fields: { [key: string]: string }
  folders: KeeperFolderReference[]
}

interface KeeperVault {
  records: KeeperRecord[]
  folders?: KeeperFolder[] // Add folder structure to vault
  shared_folders?: KeeperSharedFolder[] // Add shared folder structure to vault
}

// Common weak passwords for generating test data
const commonWeakPasswords = [
  "password",
  "123456",
  "qwerty",
  "abc123",
  "letmein",
  "monkey",
  "welcome",
  "admin",
  "dragon",
  "sunshine",
  "princess",
  "football",
  "baseball",
  "master",
  "shadow",
  "superman",
  "trustno1",
  "iloveyou",
  "passw0rd",
  "p@ssw0rd",
  "welcome1",
  "Password1",
  "qwerty123",
  "123qwe",
  "1q2w3e",
  "asdf1234",
  "zxcvbn",
  "password123",
  "12345678",
  "111111",
  "1234567890",
]

// Function to generate a weak password
const generateWeakPassword = (): string => {
  const weakPasswordType = faker.helpers.arrayElement([
    "common", // Use a common weak password
    "short", // Generate a short password
    "simple", // Generate a simple pattern
    "sequential", // Generate sequential characters
    "repeated", // Generate repeated characters
  ])

  switch (weakPasswordType) {
    case "common":
      return faker.helpers.arrayElement(commonWeakPasswords)
    case "short":
      return faker.internet.password({ length: faker.number.int({ min: 3, max: 6 }) })
    case "simple":
      // Simple lowercase letters only
      return faker.internet.password({
        length: faker.number.int({ min: 6, max: 8 }),
        memorable: true,
        pattern: /[a-z]/,
      })
    case "sequential":
      // Sequential characters like "abcdef" or "123456"
      const seqLength = faker.number.int({ min: 5, max: 8 })
      const seqStart = faker.number.int({ min: 0, max: 9 })
      if (faker.datatype.boolean()) {
        // Numeric sequence
        return Array.from({ length: seqLength }, (_, i) => (seqStart + i) % 10).join("")
      } else {
        // Alphabetic sequence
        const startChar = "a".charCodeAt(0) + faker.number.int({ min: 0, max: 20 })
        return Array.from({ length: seqLength }, (_, i) => String.fromCharCode(startChar + i)).join("")
      }
    case "repeated":
      // Repeated characters like "aaaaa" or "11111"
      const repChar = faker.helpers.arrayElement(["a", "1", "x", "0", "q", "z"])
      const repLength = faker.number.int({ min: 4, max: 8 })
      return repChar.repeat(repLength)
    default:
      return faker.helpers.arrayElement(commonWeakPasswords)
  }
}

// Helper function to generate random TOTP secret key
const generateTOTPSecret = () => {
  return faker.string.alphanumeric(32).toUpperCase()
}

// Sample business departments for collections
const businessDepartments = [
  "Executive",
  "Finance",
  "Human Resources",
  "Information Technology",
  "Marketing",
  "Operations",
  "Research & Development",
  "Sales",
  "Customer Support",
  "Legal",
  "Procurement",
  "Quality Assurance",
  "Product Management",
  "Business Development",
  "Public Relations",
  "Customer Success",
  "Administration",
  "Facilities",
  "Security",
  "Engineering",
]

// Additional business functions for generating more unique collection names
const businessFunctions = [
  "Strategy",
  "Analytics",
  "Compliance",
  "Risk Management",
  "Training",
  "Innovation",
  "Digital Transformation",
  "Corporate Communications",
  "Investor Relations",
  "Supply Chain",
  "Logistics",
  "Manufacturing",
  "Design",
  "User Experience",
  "Data Science",
  "Artificial Intelligence",
  "Cloud Infrastructure",
  "Mobile Development",
  "Web Development",
  "DevOps",
  "Customer Experience",
  "Brand Management",
  "Social Media",
  "Content Creation",
  "Events",
  "Partnerships",
  "Mergers & Acquisitions",
  "Accounting",
  "Payroll",
  "Benefits",
  "Recruitment",
  "Talent Development",
  "Internal Communications",
  "Corporate Social Responsibility",
  "Sustainability",
]

// Business regions for even more collection name variations
const businessRegions = [
  "North America",
  "South America",
  "Europe",
  "Asia Pacific",
  "Middle East",
  "Africa",
  "Global",
  "Eastern",
  "Western",
  "Northern",
  "Southern",
  "Central",
]

// Generate unique collection names based on count
const generateUniqueCollectionNames = (count: number): string[] => {
  // Start with the base business departments
  let collections = [...businessDepartments]

  // If we need more, add business functions
  if (count > collections.length) {
    collections = collections.concat(businessFunctions)
  }

  // If we still need more, create combinations
  if (count > collections.length) {
    // Create region-department combinations
    const regionDeptCombos = []
    for (const region of businessRegions) {
      for (const dept of businessDepartments.slice(0, 5)) {
        // Take just a few departments to avoid too many combinations
        regionDeptCombos.push(`${region} ${dept}`)
      }
    }
    collections = collections.concat(regionDeptCombos)
  }

  // If we STILL need more, add numbered departments
  if (count > collections.length) {
    const neededMore = count - collections.length
    for (let i = 1; i <= neededMore; i++) {
      collections.push(`Department ${i}`)
    }
  }

  // Shuffle and take the requested count
  return collections.sort(() => 0.5 - Math.random()).slice(0, count)
}

// Sample popular websites for realistic URLs
const popularWebsites = [
  "google.com",
  "facebook.com",
  "amazon.com",
  "twitter.com",
  "instagram.com",
  "linkedin.com",
  "netflix.com",
  "microsoft.com",
  "apple.com",
  "github.com",
  "youtube.com",
  "reddit.com",
  "wikipedia.org",
  "yahoo.com",
  "twitch.tv",
]

// Helper function to create Bitwarden items
const createBitwardenItem = (
  objType: string,
  count: number,
  vaultType: "individual" | "org",
  useRealUrls: boolean,
  collections: { id: string; name: string }[],
  distributeItems: boolean,
  weakPasswordPercentage: number,
  passwordReusePercentage: number,
  passwordPool: string[],
): BitwardenVaultItem[] => {
  const items: BitwardenVaultItem[] = []

  for (let i = 0; i < count; i++) {
    const baseItem: BaseItem = {
      id: faker.string.uuid(),
      organizationId: vaultType === "org" ? faker.string.uuid() : null,
      folderId: vaultType === "individual" ? faker.string.uuid() : "",
      type: 1, // Will be overridden
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

    // If org vault and distribute items is enabled, assign to random collections
    if (vaultType === "org" && distributeItems && collections.length > 0) {
      // Assign to 1-3 random collections
      const numCollections = faker.number.int({ min: 1, max: 3 })
      const shuffledCollections = [...collections].sort(() => 0.5 - Math.random())
      baseItem.collectionIds = shuffledCollections.slice(0, numCollections).map((c) => c.id)
    }

    let item: BitwardenVaultItem

    switch (objType) {
      case "objType1":
        const website = useRealUrls
          ? popularWebsites[Math.floor(Math.random() * popularWebsites.length)]
          : faker.internet.domainName()

        // Determine password strategy
        let password: string

        // First check if we should reuse a password
        if (passwordPool.length > 0 && faker.number.int({ min: 1, max: 100 }) <= passwordReusePercentage) {
          // Reuse a password from the pool
          password = faker.helpers.arrayElement(passwordPool)
        } else {
          // Generate a new password (weak or strong)
          if (faker.number.int({ min: 1, max: 100 }) <= weakPasswordPercentage) {
            password = generateWeakPassword()
          } else {
            password = faker.internet.password()
          }

          // Add new password to the pool if it's not already there
          if (passwordReusePercentage > 0 && !passwordPool.includes(password)) {
            passwordPool.push(password)
          }
        }

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

// Helper function to create LastPass items
const createLastPassItem = (
  number: number,
  useRealUrls: boolean,
  weakPasswordPercentage: number,
  passwordReusePercentage: number,
  passwordPool: string[],
): LastPassItem[] => {
  const items: LastPassItem[] = []
  for (let i = 0; i < number; i++) {
    const website = useRealUrls
      ? popularWebsites[Math.floor(Math.random() * popularWebsites.length)]
      : faker.internet.domainName()

    // Determine password strategy
    let password: string

    // First check if we should reuse a password
    if (passwordPool.length > 0 && faker.number.int({ min: 1, max: 100 }) <= passwordReusePercentage) {
      // Reuse a password from the pool
      password = faker.helpers.arrayElement(passwordPool)
    } else {
      // Generate a new password (weak or strong)
      if (faker.number.int({ min: 1, max: 100 }) <= weakPasswordPercentage) {
        password = generateWeakPassword()
      } else {
        password = faker.internet.password()
      }

      // Add new password to the pool if it's not already there
      if (passwordReusePercentage > 0 && !passwordPool.includes(password)) {
        passwordPool.push(password)
      }
    }

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

// Helper function to create Edge password items
const createEdgePasswordItem = (
  number: number,
  useRealUrls: boolean,
  weakPasswordPercentage: number,
  passwordReusePercentage: number,
  passwordPool: string[],
): EdgePasswordItem[] => {
  const items: EdgePasswordItem[] = []
  for (let i = 0; i < number; i++) {
    const website = useRealUrls
      ? popularWebsites[Math.floor(Math.random() * popularWebsites.length)]
      : faker.internet.domainName()

    // Determine password strategy
    let password: string

    // First check if we should reuse a password
    if (passwordPool.length > 0 && faker.number.int({ min: 1, max: 100 }) <= passwordReusePercentage) {
      // Reuse a password from the pool
      password = faker.helpers.arrayElement(passwordPool)
    } else {
      // Generate a new password (weak or strong)
      if (faker.number.int({ min: 1, max: 100 }) <= weakPasswordPercentage) {
        password = generateWeakPassword()
      } else {
        password = faker.internet.password()
      }

      // Add new password to the pool if it's not already there
      if (passwordReusePercentage > 0 && !passwordPool.includes(password)) {
        passwordPool.push(password)
      }
    }

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

// Helper function to create KeePassX items
const createKeePassXItem = (
  number: number,
  useRealUrls: boolean,
  weakPasswordPercentage: number,
  passwordReusePercentage: number,
  passwordPool: string[],
): KeePassXItem[] => {
  const items: KeePassXItem[] = []
  for (let i = 0; i < number; i++) {
    const website = useRealUrls
      ? popularWebsites[Math.floor(Math.random() * popularWebsites.length)]
      : faker.internet.domainName()

    // Determine password strategy
    let password: string

    // First check if we should reuse a password
    if (passwordPool.length > 0 && faker.number.int({ min: 1, max: 100 }) <= passwordReusePercentage) {
      // Reuse a password from the pool
      password = faker.helpers.arrayElement(passwordPool)
    } else {
      // Generate a new password (weak or strong)
      if (faker.number.int({ min: 1, max: 100 }) <= weakPasswordPercentage) {
        password = generateWeakPassword()
      } else {
        password = faker.internet.password()
      }

      // Add new password to the pool if it's not already there
      if (passwordReusePercentage > 0 && !passwordPool.includes(password)) {
        passwordPool.push(password)
      }
    }

    // Occasionally generate entries with empty fields (like in the example)
    const hasUrl = faker.datatype.boolean(0.9) // 90% chance to have URL
    const hasUsername = faker.datatype.boolean(0.95) // 95% chance to have username
    const hasNotes = faker.datatype.boolean(0.7) // 70% chance to have notes

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

// Add these helper functions after the flattenSharedFolderStructure function

// Helper function to generate a base64 UUID for KeePass2
const generateKeePass2UUID = (): string => {
  const bytes = new Uint8Array(16)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(Math.random() * 256)
  }
  return btoa(String.fromCharCode.apply(null, Array.from(bytes)))
}

// Helper function to generate ISO timestamp for KeePass2
const generateKeePass2Timestamp = (date?: Date): string => {
  const d = date || new Date()
  return d.toISOString().replace(/\.\d+Z$/, "Z")
}

// Helper function to generate KeePass2 times object
const generateKeePass2Times = (): KeePass2Times => {
  const now = new Date()
  const creationTime = now
  const lastAccessTime = now
  const expiryTime = new Date(now.getTime() - 24 * 60 * 60 * 1000) // One day in the past

  return {
    LastModificationTime: generateKeePass2Timestamp(now),
    CreationTime: generateKeePass2Timestamp(creationTime),
    LastAccessTime: generateKeePass2Timestamp(lastAccessTime),
    ExpiryTime: generateKeePass2Timestamp(expiryTime),
    Expires: false, // Always false as in the example
    UsageCount: 0, // Always 0 as in the example
    LocationChanged: generateKeePass2Timestamp(now),
  }
}

// Helper function to create KeePass2 entries
const createKeePass2Entry = (
  useRealUrls: boolean,
  weakPasswordPercentage: number,
  passwordReusePercentage: number,
  passwordPool: string[],
): KeePass2Entry => {
  const website = useRealUrls
    ? popularWebsites[Math.floor(Math.random() * popularWebsites.length)]
    : faker.internet.domainName()

  // Determine password strategy
  let password: string

  // First check if we should reuse a password
  if (passwordPool.length > 0 && faker.number.int({ min: 1, max: 100 }) <= passwordReusePercentage) {
    // Reuse a password from the pool
    password = faker.helpers.arrayElement(passwordPool)
  } else {
    // Generate a new password (weak or strong)
    if (faker.number.int({ min: 1, max: 100 }) <= weakPasswordPercentage) {
      password = generateWeakPassword()
    } else {
      password = faker.internet.password()
    }

    // Add new password to the pool if it's not already there
    if (passwordReusePercentage > 0 && !passwordPool.includes(password)) {
      passwordPool.push(password)
    }
  }

  // Create strings array with standard fields - order matters in KeePass2
  // The order in the example is: Notes, Password, Title, URL, UserName
  const strings: KeePass2String[] = [
    { Key: "Notes", Value: faker.lorem.sentence() },
    { Key: "Password", Value: password, ProtectInMemory: true },
    { Key: "Title", Value: website + " Login" },
    { Key: "URL", Value: `https://www.${website}` },
    { Key: "UserName", Value: faker.internet.userName() },
  ]

  return {
    UUID: generateKeePass2UUID(),
    IconID: 0, // Set to 0 to match example
    ForegroundColor: "",
    BackgroundColor: "",
    OverrideURL: "",
    Tags: "",
    Times: generateKeePass2Times(),
    Strings: strings,
    AutoType: {
      Enabled: true,
      DataTransferObfuscation: 0,
      Association: [
        {
          Window: "Target Window",
          KeystrokeSequence: "{USERNAME}{TAB}{PASSWORD}{TAB}{ENTER}",
        },
      ],
    },
  }
}

// Helper function to create KeePass2 groups with entries
const createKeePass2Groups = (
  loginCount: number,
  useRealUrls: boolean,
  weakPasswordPercentage: number,
  passwordReusePercentage: number,
  passwordPool: string[],
): KeePass2Group => {
  // Create main group
  const mainGroup: KeePass2Group = {
    UUID: generateKeePass2UUID(),
    Name: "Database",
    Notes: "",
    IconID: 49,
    Times: generateKeePass2Times(),
    IsExpanded: true,
    DefaultAutoTypeSequence: "",
    EnableAutoType: "Null",
    EnableSearching: "Null",
    LastTopVisibleEntry: "AAAAAAAAAAAAAAAAAAAAAA==",
    Entries: [],
    Groups: [],
  }

  // Create some common subgroups
  const subgroups = [
    { name: "General", notes: "", iconId: 48 },
    { name: "Windows", notes: "", iconId: 38 },
    { name: "Network", notes: "", iconId: 3 },
    { name: "Internet", notes: "", iconId: 1 },
    { name: "eMail", notes: "", iconId: 19 },
    { name: "Homebanking", notes: "", iconId: 37 },
  ]

  // Create subgroups
  mainGroup.Groups = subgroups.map((group) => {
    return {
      UUID: generateKeePass2UUID(),
      Name: group.name,
      Notes: group.notes,
      IconID: group.iconId,
      Times: generateKeePass2Times(),
      IsExpanded: true,
      DefaultAutoTypeSequence: "",
      EnableAutoType: "Null",
      EnableSearching: "Null",
      LastTopVisibleEntry: "AAAAAAAAAAAAAAAAAAAAAA==",
      Entries: [],
    }
  })

  // Distribute entries among groups
  let remainingEntries = loginCount

  // Important change: Add a significant number of entries directly to the root group
  // In the working example, about 9 entries are in the root group
  const rootEntries = Math.min(remainingEntries, Math.max(8, Math.floor(loginCount * 0.3)))
  for (let i = 0; i < rootEntries; i++) {
    mainGroup.Entries.push(
      createKeePass2Entry(useRealUrls, weakPasswordPercentage, passwordReusePercentage, passwordPool),
    )
  }
  remainingEntries -= rootEntries

  // Distribute remaining entries among subgroups
  const entriesPerGroup = Math.max(1, Math.floor(remainingEntries / mainGroup.Groups.length))
  for (const group of mainGroup.Groups) {
    const groupEntries = Math.min(remainingEntries, entriesPerGroup)
    for (let i = 0; i < groupEntries; i++) {
      group.Entries.push(
        createKeePass2Entry(useRealUrls, weakPasswordPercentage, passwordReusePercentage, passwordPool),
      )
    }
    remainingEntries -= groupEntries
  }

  // If there are still entries left, add them to random groups
  while (remainingEntries > 0) {
    const targetGroup = faker.helpers.arrayElement([...mainGroup.Groups])
    targetGroup.Entries.push(
      createKeePass2Entry(useRealUrls, weakPasswordPercentage, passwordReusePercentage, passwordPool),
    )
    remainingEntries--
  }

  return mainGroup
}

// Helper function to generate a complete KeePass2 file
const createKeePass2File = (
  loginCount: number,
  useRealUrls: boolean,
  weakPasswordPercentage: number,
  passwordReusePercentage: number,
  passwordPool: string[],
): KeePass2File => {
  const now = generateKeePass2Timestamp()

  return {
    Meta: {
      Generator: "KeePass",
      SettingsChanged: now,
      DatabaseName: "Generated Password Vault",
      DatabaseNameChanged: now,
      DatabaseDescription: "Automatically generated test database",
      DatabaseDescriptionChanged: now,
      DefaultUserName: "",
      DefaultUserNameChanged: now,
      MaintenanceHistoryDays: 365,
      Color: "",
      MasterKeyChanged: now,
      MasterKeyChangeRec: -1,
      MasterKeyChangeForce: -1,
      MemoryProtection: {
        ProtectTitle: false,
        ProtectUserName: false,
        ProtectPassword: true,
        ProtectURL: false,
        ProtectNotes: false,
      },
      RecycleBinEnabled: true,
      RecycleBinUUID: "AAAAAAAAAAAAAAAAAAAAAA==",
      RecycleBinChanged: now,
      EntryTemplatesGroup: "AAAAAAAAAAAAAAAAAAAAAA==",
      EntryTemplatesGroupChanged: now,
      RecycleBinEnabled: true,
      RecycleBinUUID: "AAAAAAAAAAAAAAAAAAAAAA==",
      RecycleBinChanged: now,
      EntryTemplatesGroup: "AAAAAAAAAAAAAAAAAAAAAA==",
      EntryTemplatesGroupChanged: now,
      HistoryMaxItems: 10,
      HistoryMaxSize: 6291456,
      LastSelectedGroup: "AAAAAAAAAAAAAAAAAAAAAA==",
      LastTopVisibleGroup: "AAAAAAAAAAAAAAAAAAAAAA==",
    },
    Root: {
      Group: createKeePass2Groups(
        loginCount,
        useRealUrls,
        weakPasswordPercentage,
        passwordReusePercentage,
        passwordPool,
      ),
      DeletedObjects: {},
    },
  }
}

// Now replace the convertKeePass2ToXML function with this updated version:
const convertKeePass2ToXML = (keepass: KeePass2File): string => {
  // Helper function to create XML for KeePass2Times
  const timesToXML = (times: KeePass2Times, indent: string): string => {
    return `${indent}<Times>
${indent}\t<CreationTime>${times.CreationTime}</CreationTime>
${indent}\t<LastModificationTime>${times.LastModificationTime}</LastModificationTime>
${indent}\t<LastAccessTime>${times.LastAccessTime}</LastAccessTime>
${indent}\t<ExpiryTime>${times.ExpiryTime}</ExpiryTime>
${indent}\t<Expires>False</Expires>
${indent}\t<UsageCount>0</UsageCount>
${indent}\t<LocationChanged>${times.LocationChanged}</LocationChanged>
${indent}</Times>`
  }

  // Helper function to create XML for KeePass2String
  const stringToXML = (str: KeePass2String, indent: string): string => {
    if (str.ProtectInMemory) {
      return `${indent}<String>
${indent}\t<Key>${str.Key}</Key>
${indent}\t<Value ProtectInMemory="True">${str.Value}</Value>
${indent}</String>`
    } else {
      return `${indent}<String>
${indent}\t<Key>${str.Key}</Key>
${indent}\t<Value>${str.Value}</Value>
${indent}</String>`
    }
  }

  // Helper function to create XML for AutoType
  const autoTypeToXML = (entry: KeePass2Entry, indent: string): string => {
    return `${indent}<AutoType>
${indent}\t<Enabled>True</Enabled>
${indent}\t<DataTransferObfuscation>0</DataTransferObfuscation>
${indent}\t<Association>
${indent}\t\t<Window>Target Window</Window>
${indent}\t\t<KeystrokeSequence>${entry.AutoType?.Association?.[0]?.KeystrokeSequence || "{USERNAME}{TAB}{PASSWORD}{TAB}{ENTER}"}</KeystrokeSequence>
${indent}\t</Association>
${indent}</AutoType>
${indent}<History />`
  }

  // Helper function to create XML for KeePass2Entry
  const entryToXML = (entry: KeePass2Entry, indent: string): string => {
    return `${indent}<Entry>
${indent}\t<UUID>${entry.UUID}</UUID>
${indent}\t<IconID>${entry.IconID}</IconID>
${indent}\t<ForegroundColor></ForegroundColor>
${indent}\t<BackgroundColor></BackgroundColor>
${indent}\t<OverrideURL></OverrideURL>
${indent}\t<Tags></Tags>
${timesToXML(entry.Times, indent + "\t")}
${entry.Strings.map((str) => stringToXML(str, indent + "\t")).join("\n")}
${autoTypeToXML(entry, indent + "\t")}
${indent}</Entry>`
  }

  // Helper function to create XML for KeePass2Group (recursive for nested groups)
  const groupToXML = (group: KeePass2Group, indent: string): string => {
    let result = `${indent}<Group>
${indent}\t<UUID>${group.UUID}</UUID>
${indent}\t<Name>${group.Name}</Name>
${indent}\t<Notes></Notes>
${indent}\t<IconID>${group.IconID}</IconID>
${timesToXML(group.Times, indent + "\t")}
${indent}\t<IsExpanded>True</IsExpanded>
${indent}\t<DefaultAutoTypeSequence></DefaultAutoTypeSequence>
${indent}\t<EnableAutoType>Null</EnableAutoType>
${indent}\t<EnableSearching>Null</EnableSearching>
${indent}\t<LastTopVisibleEntry>AAAAAAAAAAAAAAAAAAAAAA==</LastTopVisibleEntry>`

    // Add entries if they exist
    if (group.Entries && group.Entries.length > 0) {
      for (const entry of group.Entries) {
        result += "\n" + entryToXML(entry, indent + "\t")
      }
    }

    // Add subgroups if they exist
    if (group.Groups && group.Groups.length > 0) {
      for (const subgroup of group.Groups) {
        result += "\n" + groupToXML(subgroup, indent + "\t")
      }
    }

    // Close the group tag
    result += `\n${indent}</Group>`

    return result
  }

  // Create the full XML document - exactly matching the example format
  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<KeePassFile>
\t<Meta>
\t\t<Generator>KeePass</Generator>
\t\t<SettingsChanged>${generateKeePass2Timestamp()}</SettingsChanged>
\t\t<DatabaseName>${keepass.Meta.DatabaseName}</DatabaseName>
\t\t<DatabaseNameChanged>${keepass.Meta.DatabaseNameChanged}</DatabaseNameChanged>
\t\t<DatabaseDescription></DatabaseDescription>
\t\t<DatabaseDescriptionChanged>${generateKeePass2Timestamp()}</DatabaseDescriptionChanged>
\t\t<DefaultUserName></DefaultUserName>
\t\t<DefaultUserNameChanged>${generateKeePass2Timestamp()}</DefaultUserNameChanged>
\t\t<MaintenanceHistoryDays>365</MaintenanceHistoryDays>
\t\t<Color></Color>
\t\t<MasterKeyChanged>${generateKeePass2Timestamp()}</MasterKeyChanged>
\t\t<MasterKeyChangeRec>-1</MasterKeyChangeRec>
\t\t<MasterKeyChangeForce>-1</MasterKeyChangeForce>
\t\t<MemoryProtection>
\t\t\t<ProtectTitle>False</ProtectTitle>
\t\t\t<ProtectUserName>False</ProtectUserName>
\t\t\t<ProtectPassword>True</ProtectPassword>
\t\t\t<ProtectURL>False</ProtectURL>
\t\t\t<ProtectNotes>False</ProtectNotes>
\t\t</MemoryProtection>
\t\t<RecycleBinEnabled>True</RecycleBinEnabled>
\t\t<RecycleBinUUID>AAAAAAAAAAAAAAAAAAAAAA==</RecycleBinUUID>
\t\t<RecycleBinChanged>${generateKeePass2Timestamp()}</RecycleBinChanged>
\t\t<EntryTemplatesGroup>AAAAAAAAAAAAAAAAAAAAAA==</EntryTemplatesGroup>
\t\t<EntryTemplatesGroupChanged>${generateKeePass2Timestamp()}</EntryTemplatesGroupChanged>
\t\t<HistoryMaxItems>10</HistoryMaxItems>
\t\t<HistoryMaxSize>6291456</HistoryMaxSize>
\t\t<LastSelectedGroup>AAAAAAAAAAAAAAAAAAAAAA==</LastSelectedGroup>
\t\t<LastTopVisibleGroup>AAAAAAAAAAAAAAAAAAAAAA==</LastTopVisibleGroup>
\t\t<Binaries />
\t\t<CustomData />
\t</Meta>
\t<Root>
${groupToXML(keepass.Root.Group, "\t\t")}
\t\t<DeletedObjects />
\t</Root>
</KeePassFile>`
}

// Flatten folder structure for easier assignment to records
const flattenFolderStructure = (folders: KeeperFolder[]): { name: string; path: string }[] => {
  const result: { name: string; path: string }[] = []

  const traverse = (folder: KeeperFolder, parentPath = "") => {
    const currentPath = parentPath ? `${parentPath}\\${folder.name}` : folder.name
    result.push({ name: folder.name, path: currentPath })

    if (folder.children && folder.children.length > 0) {
      folder.children.forEach((child) => traverse(child, currentPath))
    }
  }

  folders.forEach((folder) => traverse(folder))
  return result
}

const flattenSharedFolderStructure = (
  folders: KeeperSharedFolder[],
): { name: string; path: string; can_edit: boolean; can_share: boolean }[] => {
  const result: { name: string; path: string; can_edit: boolean; can_share: boolean }[] = []

  const traverse = (folder: KeeperSharedFolder, parentPath = "") => {
    const currentPath = parentPath ? `${parentPath}\\${folder.name}` : folder.name
    result.push({
      name: folder.name,
      path: currentPath,
      can_edit: folder.can_edit,
      can_share: folder.can_share,
    })

    if (folder.children && folder.children.length > 0) {
      folder.children.forEach((child) => traverse(child, currentPath))
    }
  }

  folders.forEach((folder) => traverse(folder))
  return result
}

// Helper function to create Keeper items with nested folders
const createKeeperItem = (
  number: number,
  useRealUrls: boolean,
  useNestedFolders: boolean,
  weakPasswordPercentage: number,
  passwordReusePercentage: number,
  passwordPool: string[],
): KeeperRecord[] => {
  // Generate folder structure if using nested folders
  const folderStructure = useNestedFolders ? generateFolderStructure() : []
  const sharedFolderStructure = useNestedFolders ? generateSharedFolderStructure() : []

  // Flatten folder structures for easier assignment
  const flatFolders = useNestedFolders ? flattenFolderStructure(folderStructure) : []
  const flatSharedFolders = useNestedFolders ? flattenSharedFolderStructure(sharedFolderStructure) : []

  // Simple folders for non-nested case
  const simpleFolders = ["Private Folder", "My Websites", "Social Media"]

  const items: KeeperRecord[] = []
  for (let i = 0; i < number; i++) {
    const website = useRealUrls
      ? popularWebsites[Math.floor(Math.random() * popularWebsites.length)]
      : faker.internet.domainName()

    // Determine password strategy
    let password: string

    // First check if we should reuse a password
    if (passwordPool.length > 0 && faker.number.int({ min: 1, max: 100 }) <= passwordReusePercentage) {
      // Reuse a password from the pool
      password = faker.helpers.arrayElement(passwordPool)
    } else {
      // Generate a new password (weak or strong)
      if (faker.number.int({ min: 1, max: 100 }) <= weakPasswordPercentage) {
        password = generateWeakPassword()
      } else {
        password = faker.internet.password()
      }

      // Add new password to the pool if it's not already there
      if (passwordReusePercentage > 0 && !passwordPool.includes(password)) {
        passwordPool.push(password)
      }
    }

    let folderReferences: KeeperFolderReference[] = []

    if (useNestedFolders) {
      // Decide if this item goes in a regular folder, shared folder, or both
      const folderType = faker.helpers.arrayElement(["regular", "shared", "both"])

      if (folderType === "regular" || folderType === "both") {
        // Pick a random folder from the flattened structure
        if (flatFolders.length > 0) {
          const randomFolder = faker.helpers.arrayElement(flatFolders)
          folderReferences.push({
            folder: randomFolder.name,
            folder_path: randomFolder.path,
          })
        }
      }

      if (folderType === "shared" || folderType === "both") {
        // Pick a random shared folder
        if (flatSharedFolders.length > 0) {
          const randomSharedFolder = faker.helpers.arrayElement(flatSharedFolders)
          folderReferences.push({
            shared_folder: randomSharedFolder.name,
            shared_folder_path: randomSharedFolder.path,
            can_edit: randomSharedFolder.can_edit,
            can_share: randomSharedFolder.can_share,
          })
        }
      }

      // If no folders were assigned (empty structures), assign a default
      if (folderReferences.length === 0) {
        folderReferences.push({ folder: "Default" })
      }
    } else {
      // Use simple folder structure
      folderReferences = [
        { folder: faker.helpers.arrayElement(simpleFolders) },
        ...(Math.random() > 0.5
          ? [
              {
                shared_folder: "Shared Folder",
                can_edit: faker.datatype.boolean(),
                can_share: faker.datatype.boolean(),
              },
            ]
          : []),
      ]
    }

    const item: KeeperRecord = {
      title: website + " Login",
      login: faker.internet.userName(),
      password: password,
      login_url: `https://www.${website}`,
      notes: faker.lorem.paragraph(),
      custom_fields: {
        "Security Group": faker.helpers.arrayElement(["Private", "Public"]),
        "IP Address": faker.internet.ip(),
        "Favorite Food": faker.word.noun(),
        $oneTimeCode: `otpauth://totp/Example:${faker.internet.email()}?secret=${generateTOTPSecret()}&issuer=Example&algorithm=SHA1&digits=6&period=30`,
      },
      folders: folderReferences,
    }
    items.push(item)
  }
  return items
}

// Update the generateHierarchicalCollections function to use forward slashes for Bitwarden
const generateHierarchicalCollections = (topLevelCount: number, maxDepth: number, totalCount: number): string[] => {
  // Ensure top level count doesn't exceed total
  topLevelCount = Math.min(topLevelCount, totalCount)

  // Start with top-level departments
  const topLevelNames = generateUniqueCollectionNames(topLevelCount)

  // Set to track all collection paths to avoid duplicates
  const allCollections = new Set<string>(topLevelNames)

  // If we've already hit our total or max depth is 1, return early
  if (allCollections.size >= totalCount || maxDepth <= 1) {
    return Array.from(allCollections).slice(0, totalCount)
  }

  // For each level of nesting, distribute the remaining collections
  let currentLevel = [...topLevelNames]
  let remainingCount = totalCount - topLevelCount

  // For each depth level beyond the top level
  for (let depth = 1; depth < maxDepth && remainingCount > 0 && currentLevel.length > 0; depth++) {
    const nextLevel: string[] = []

    // Calculate how many children to create at this level
    const childrenPerParent = Math.max(1, Math.floor(remainingCount / currentLevel.length))

    // For each parent at the current level
    for (let i = 0; i < currentLevel.length && remainingCount > 0; i++) {
      const parentPath = currentLevel[i]
      const parentBaseName = parentPath.split("/").pop() || parentPath

      // Determine how many children for this specific parent
      const actualChildrenForThisParent = Math.min(childrenPerParent, remainingCount)

      if (actualChildrenForThisParent <= 0) continue

      // Get appropriate child names based on the parent
      let childNames: string[] = []

      // Try to get contextual child names if possible
      if (businessFunctions.includes(parentBaseName)) {
        childNames = ["Team", "Projects", "Resources"].slice(0, actualChildrenForThisParent)
      } else if (businessDepartments.includes(parentBaseName)) {
        if (parentBaseName === "Finance") {
          childNames = ["Accounting", "Budgeting", "Investments"].slice(0, actualChildrenForThisParent)
        } else if (parentBaseName === "Marketing") {
          childNames = ["Digital", "Content", "Events"].slice(0, actualChildrenForThisParent)
        } else if (parentBaseName === "Human Resources") {
          childNames = ["Recruiting", "Benefits", "Training"].slice(0, actualChildrenForThisParent)
        } else if (parentBaseName === "Information Technology") {
          childNames = ["Infrastructure", "Development", "Support"].slice(0, actualChildrenForThisParent)
        } else {
          // Generic child names
          childNames = ["Team A", "Team B", "Projects"].slice(0, actualChildrenForThisParent)
        }
      } else if (businessRegions.includes(parentBaseName)) {
        childNames = ["Sales", "Operations", "Support"].slice(0, actualChildrenForThisParent)
      } else {
        // Generic child names with numbers to ensure uniqueness
        childNames = Array.from({ length: actualChildrenForThisParent }, (_, i) => `Subgroup ${i + 1}`)
      }

      // Create full paths for children and add to result
      for (let j = 0; j < childNames.length && remainingCount > 0; j++) {
        const childName = childNames[j]
        const fullPath = `${parentPath}/${childName}`

        if (!allCollections.has(fullPath)) {
          allCollections.add(fullPath)
          nextLevel.push(fullPath)
          remainingCount--
        }
      }
    }

    // Update current level for next iteration
    currentLevel = nextLevel
  }

  return Array.from(allCollections)
}

// Update the ensureParentPaths function to use forward slashes for Bitwarden
const ensureParentPaths = (collections: string[]): string[] => {
  const result = new Set<string>()

  // Add all collections first
  collections.forEach((collection) => result.add(collection))

  // Then ensure all parent paths exist
  collections.forEach((collection) => {
    const parts = collection.split("/")

    // For each level of nesting, ensure the parent path exists
    for (let i = 1; i < parts.length; i++) {
      const parentPath = parts.slice(0, i).join("/")
      result.add(parentPath)
    }
  })

  return Array.from(result)
}

// Generate a random folder structure
const generateFolderStructure = (maxDepth = 3): KeeperFolder[] => {
  const numFolders = faker.number.int({ min: 2, max: 5 })
  const folders: KeeperFolder[] = []

  for (let i = 0; i < numFolders; i++) {
    const folder: KeeperFolder = {
      name: faker.word.noun(),
    }

    if (maxDepth > 1 && faker.datatype.boolean(0.6)) {
      // 60% chance to have children
      folder.children = generateFolderStructure(maxDepth - 1)
    }

    folders.push(folder)
  }

  return folders
}

// Generate a random shared folder structure
const generateSharedFolderStructure = (maxDepth = 3): KeeperSharedFolder[] => {
  const numFolders = faker.number.int({ min: 1, max: 3 })
  const folders: KeeperSharedFolder[] = []

  for (let i = 0; i < numFolders; i++) {
    const folder: KeeperSharedFolder = {
      name: faker.word.noun(),
      can_edit: faker.datatype.boolean(),
      can_share: faker.datatype.boolean(),
    }

    if (maxDepth > 1 && faker.datatype.boolean(0.5)) {
      // 50% chance to have children
      folder.children = generateSharedFolderStructure(maxDepth - 1)
    }

    folders.push(folder)
  }

  return folders
}

export default function Component() {
  const [loginCount, setLoginCount] = useState(10)
  const [secureNoteCount, setSecureNoteCount] = useState(10)
  const [creditCardCount, setCreditCardCount] = useState(10)
  const [identityCount, setIdentityCount] = useState(10)
  const [vaultType, setVaultType] = useState<"individual" | "org">("individual")
  const [vaultFormat, setVaultFormat] = useState("bitwarden")
  const [useRealUrls, setUseRealUrls] = useState(false)
  const [useCollections, setUseCollections] = useState(false)
  const [collectionCount, setCollectionCount] = useState(10)
  const [distributeItems, setDistributeItems] = useState(false)
  const [useNestedFolders, setUseNestedFolders] = useState(false)
  const [useRandomDepthNesting, setUseRandomDepthNesting] = useState(false)
  const [generatedData, setGeneratedData] = useState("")
  const [useNestedCollections, setUseNestedCollections] = useState(false)
  const [topLevelCollectionCount, setTopLevelCollectionCount] = useState(5)
  const [collectionNestingDepth, setCollectionNestingDepth] = useState(2)
  const [totalCollectionCount, setTotalCollectionCount] = useState(20)
  const [useWeakPasswords, setUseWeakPasswords] = useState(false)
  const [weakPasswordPercentage, setWeakPasswordPercentage] = useState(20)
  const [reusePasswords, setReusePasswords] = useState(false)
  const [passwordReusePercentage, setPasswordReusePercentage] = useState(30)

  const generateVault = () => {
    // Create a pool of passwords for reuse if enabled
    const passwordPool: string[] = []

    if (reusePasswords) {
      // Generate a pool of passwords (both strong and weak if enabled)
      const poolSize = Math.max(5, Math.floor(loginCount * 0.3)) // Create a reasonable pool size

      for (let i = 0; i < poolSize; i++) {
        if (useWeakPasswords && faker.number.int({ min: 1, max: 100 }) <= weakPasswordPercentage) {
          passwordPool.push(generateWeakPassword())
        } else {
          passwordPool.push(faker.internet.password())
        }
      }
    }

    if (vaultFormat === "bitwarden") {
      if (vaultType === "individual") {
        const vault: BitwardenVault = { folders: [], items: [] }
        vault.items = [
          ...createBitwardenItem(
            "objType1",
            loginCount,
            vaultType,
            useRealUrls,
            [],
            false,
            useWeakPasswords ? weakPasswordPercentage : 0,
            reusePasswords ? passwordReusePercentage : 0,
            passwordPool,
          ),
          ...createBitwardenItem(
            "objType2",
            secureNoteCount,
            vaultType,
            useRealUrls,
            [],
            false,
            useWeakPasswords ? weakPasswordPercentage : 0,
            reusePasswords ? passwordReusePercentage : 0,
            passwordPool,
          ),
          ...createBitwardenItem(
            "objType3",
            creditCardCount,
            vaultType,
            useRealUrls,
            [],
            false,
            useWeakPasswords ? weakPasswordPercentage : 0,
            reusePasswords ? passwordReusePercentage : 0,
            passwordPool,
          ),
          ...createBitwardenItem(
            "objType4",
            identityCount,
            vaultType,
            useRealUrls,
            [],
            false,
            useWeakPasswords ? weakPasswordPercentage : 0,
            reusePasswords ? passwordReusePercentage : 0,
            passwordPool,
          ),
        ]
        setGeneratedData(JSON.stringify(vault, null, 2))
      } else {
        const orgVault: BitwardenOrgVault = { collections: [], items: [] }
        const orgId = faker.string.uuid()

        if (useCollections) {
          if (useNestedCollections) {
            // Generate hierarchical collections
            let collectionNames = generateHierarchicalCollections(
              topLevelCollectionCount,
              collectionNestingDepth,
              totalCollectionCount,
            )

            // Ensure all parent paths exist
            collectionNames = ensureParentPaths(collectionNames)

            // Sort collections to ensure parents come before children
            collectionNames.sort((a, b) => {
              const aDepth = a.split("/").length
              const bDepth = b.split("/").length
              return aDepth - bDepth
            })

            orgVault.collections = collectionNames.map((name) => ({
              id: faker.string.uuid(),
              organizationId: orgId,
              name: name,
              externalId: null,
            }))
          } else {
            // Generate flat collections (existing code)
            const collectionNames = generateUniqueCollectionNames(collectionCount)

            orgVault.collections = collectionNames.map((name) => ({
              id: faker.string.uuid(),
              organizationId: orgId,
              name: name,
              externalId: null,
            }))
          }
        }

        orgVault.items = [
          ...createBitwardenItem(
            "objType1",
            loginCount,
            vaultType,
            useRealUrls,
            orgVault.collections,
            distributeItems,
            useWeakPasswords ? weakPasswordPercentage : 0,
            reusePasswords ? passwordReusePercentage : 0,
            passwordPool,
          ),
          ...createBitwardenItem(
            "objType2",
            secureNoteCount,
            vaultType,
            useRealUrls,
            orgVault.collections,
            distributeItems,
            useWeakPasswords ? weakPasswordPercentage : 0,
            reusePasswords ? passwordReusePercentage : 0,
            passwordPool,
          ),
          ...createBitwardenItem(
            "objType3",
            creditCardCount,
            vaultType,
            useRealUrls,
            orgVault.collections,
            distributeItems,
            useWeakPasswords ? weakPasswordPercentage : 0,
            reusePasswords ? passwordReusePercentage : 0,
            passwordPool,
          ),
          ...createBitwardenItem(
            "objType4",
            identityCount,
            vaultType,
            useRealUrls,
            orgVault.collections,
            distributeItems,
            useWeakPasswords ? weakPasswordPercentage : 0,
            reusePasswords ? passwordReusePercentage : 0,
            passwordPool,
          ),
        ]
        setGeneratedData(JSON.stringify(orgVault, null, 2))
      }
    } else if (vaultFormat === "lastpass") {
      const items = createLastPassItem(
        loginCount,
        useRealUrls,
        useWeakPasswords ? weakPasswordPercentage : 0,
        reusePasswords ? passwordReusePercentage : 0,
        passwordPool,
      )
      setGeneratedData(JSON.stringify(items, null, 2))
    } else if (vaultFormat === "edge") {
      const items = createEdgePasswordItem(
        loginCount,
        useRealUrls,
        useWeakPasswords ? weakPasswordPercentage : 0,
        reusePasswords ? passwordReusePercentage : 0,
        passwordPool,
      )
      setGeneratedData(JSON.stringify(items, null, 2))
    } else if (vaultFormat === "keepassx") {
      const items = createKeePassXItem(
        loginCount,
        useRealUrls,
        useWeakPasswords ? weakPasswordPercentage : 0,
        reusePasswords ? passwordReusePercentage : 0,
        passwordPool,
      )
      setGeneratedData(JSON.stringify(items, null, 2))
    } else if (vaultFormat === "keeper") {
      // Create folder structure if using nested folders
      const maxDepth = useNestedFolders ? (useRandomDepthNesting ? faker.number.int({ min: 4, max: 10 }) : 3) : 1

      const folderStructure = useNestedFolders ? generateFolderStructure(maxDepth) : []
      const sharedFolderStructure = useNestedFolders ? generateSharedFolderStructure(Math.min(maxDepth, 6)) : []

      const vault: KeeperVault = {
        records: createKeeperItem(
          loginCount,
          useRealUrls,
          useNestedFolders,
          useWeakPasswords ? weakPasswordPercentage : 0,
          reusePasswords ? passwordReusePercentage : 0,
          passwordPool,
        ),
      }

      // Add folder structure to vault if using nested folders
      if (useNestedFolders) {
        vault.folders = folderStructure
        vault.shared_folders = sharedFolderStructure
      }

      setGeneratedData(JSON.stringify(vault, null, 2))
    } else if (vaultFormat === "keepass2") {
      const keepassFile = createKeePass2File(
        loginCount,
        useRealUrls,
        useWeakPasswords ? weakPasswordPercentage : 0,
        reusePasswords ? passwordReusePercentage : 0,
        passwordPool,
      )

      // Convert to XML and store
      const xmlData = convertKeePass2ToXML(keepassFile)
      setGeneratedData(xmlData)
    }
  }

  const downloadData = (format = "json") => {
    let content: string
    let filename: string
    let type: string

    if (vaultFormat === "bitwarden") {
      content = generatedData
      filename = `${vaultType}_${vaultFormat}_vault.json`
      type = "application/json"
    } else if (vaultFormat === "lastpass") {
      // Convert JSON to CSV
      const items: LastPassItem[] = JSON.parse(generatedData)
      const header = "url,username,password,extra,name,grouping,totp\n"
      const csvContent = items
        .map(
          (item) =>
            `${item.url},${item.username},${item.password},${item.extra},${item.name},${item.grouping},${item.totp}`,
        )
        .join("\n")
      content = header + csvContent
      filename = "lastpass_vault_export.csv"
      type = "text/csv"
    } else if (vaultFormat === "edge") {
      // Convert JSON to CSV
      const items: EdgePasswordItem[] = JSON.parse(generatedData)
      const header = "name,url,username,password,note\n"
      const csvContent = items
        .map((item) => `"${item.name}","${item.url}","${item.username}","${item.password}","${item.note}"`)
        .join("\n")
      content = header + csvContent
      filename = "edge_passwords_export.csv"
      type = "text/csv"
    } else if (vaultFormat === "keepassx") {
      // Convert JSON to CSV
      const items: KeePassXItem[] = JSON.parse(generatedData)
      const header = '"Title","Username","Password","URL","Notes"\n'
      const csvContent = items
        .map((item) => `"${item.title}","${item.username}","${item.password}","${item.url}","${item.notes}"`)
        .join("\n")
      content = header + csvContent
      filename = "keepassx_export.csv"
      type = "text/csv"
    } else if (vaultFormat === "keeper") {
      if (format === "json") {
        content = generatedData
        filename = "keeper_vault_export.json"
        type = "application/json"
      } else {
        // Convert JSON to CSV with support for nested folders
        const vault: KeeperVault = JSON.parse(generatedData)
        const header = "Folder,Title,Login,Password,Website Address,Notes,Shared Folder,Custom Fields\n"
        const csvContent = vault.records
          .map((record) => {
            // Get folder information, preferring path if available
            const folderRef = record.folders.find((f) => "folder" in f)
            const folder = folderRef ? folderRef.folder_path || folderRef.folder || "" : ""

            // Get shared folder information, preferring path if available
            const sharedFolderRef = record.folders.find((f) => "shared_folder" in f)
            const sharedFolder = sharedFolderRef
              ? sharedFolderRef.shared_folder_path || sharedFolderRef.shared_folder || ""
              : ""

            const customFields = Object.entries(record.custom_fields)
              .map(([key, value]) => `${key}: ${value}`)
              .join("; ")

            return `"${folder}","${record.title}","${record.login}","${record.password}","${record.login_url}","${record.notes}","${sharedFolder}","${customFields}"`
          })
          .join("\n")
        content = header + csvContent
        filename = "keeper_vault_export.csv"
        type = "text/csv"
      }
    } else if (vaultFormat === "keepass2") {
      content = generatedData
      filename = "keepass2_export.xml"
      type = "application/xml"
    } else {
      // Handle unexpected vault format
      console.error("Unexpected vault format")
      return
    }

    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Lock className="h-8 w-8 mr-2" aria-hidden="true" />
        <h1 className="text-2xl font-bold">Password Vault Generator</h1>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="vaultFormat">Vault Format</Label>
          <Select onValueChange={setVaultFormat} defaultValue={vaultFormat}>
            <SelectTrigger id="vaultFormat">
              <SelectValue placeholder="Select vault format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bitwarden">Bitwarden</SelectItem>
              <SelectItem value="lastpass">LastPass</SelectItem>
              <SelectItem value="keeper">Keeper</SelectItem>
              <SelectItem value="edge">Microsoft Edge</SelectItem>
              <SelectItem value="keepassx">KeePassX</SelectItem>
              <SelectItem value="keepass2">KeePass2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {vaultFormat === "bitwarden" && (
          <div>
            <Label htmlFor="vaultType">Vault Type</Label>
            <Select onValueChange={(value: "individual" | "org") => setVaultType(value)} defaultValue={vaultType}>
              <SelectTrigger id="vaultType">
                <SelectValue placeholder="Select vault type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="org">Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label htmlFor="loginCount">Number of Logins</Label>
          <Input
            id="loginCount"
            type="number"
            value={loginCount}
            onChange={(e) => setLoginCount(Number.parseInt(e.target.value))}
            min="0"
            aria-describedby="loginCount-description"
          />
          <p id="loginCount-description" className="text-sm text-muted-foreground">
            Enter the number of login items to generate (includes random TOTP keys)
          </p>
        </div>
        {vaultFormat === "keepass2" && (
          <p className="text-sm text-muted-foreground mt-1">KeePass2 only supports login items.</p>
        )}
        {/* Update the condition to exclude all CSV-only formats and KeePass2 */}
        {vaultFormat !== "lastpass" &&
          vaultFormat !== "edge" &&
          vaultFormat !== "keepassx" &&
          vaultFormat !== "keepass2" && (
            <>
              <div>
                <Label htmlFor="secureNoteCount">Number of Secure Notes</Label>
                <Input
                  id="secureNoteCount"
                  type="number"
                  value={secureNoteCount}
                  onChange={(e) => setSecureNoteCount(Number.parseInt(e.target.value))}
                  min="0"
                  aria-describedby="secureNoteCount-description"
                />
                <p id="secureNoteCount-description" className="text-sm text-muted-foreground">
                  Enter the number of secure note items to generate
                </p>
              </div>
              <div>
                <Label htmlFor="creditCardCount">Number of Credit Cards</Label>
                <Input
                  id="creditCardCount"
                  type="number"
                  value={creditCardCount}
                  onChange={(e) => setCreditCardCount(Number.parseInt(e.target.value))}
                  min="0"
                  aria-describedby="creditCardCount-description"
                />
                <p id="creditCardCount-description" className="text-sm text-muted-foreground">
                  Enter the number of credit card items to generate
                </p>
              </div>
              <div>
                <Label htmlFor="identityCount">Number of Identities</Label>
                <Input
                  id="identityCount"
                  type="number"
                  value={identityCount}
                  onChange={(e) => setIdentityCount(Number.parseInt(e.target.value))}
                  min="0"
                  aria-describedby="identityCount-description"
                />
                <p id="identityCount-description" className="text-sm text-muted-foreground">
                  Enter the number of identity items to generate
                </p>
              </div>
            </>
          )}
        <div className="space-y-4 border p-4 rounded-md">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useWeakPasswords"
              checked={useWeakPasswords}
              onCheckedChange={(checked) => setUseWeakPasswords(checked as boolean)}
            />
            <Label htmlFor="useWeakPasswords">Include weak passwords</Label>
          </div>

          {useWeakPasswords && (
            <div>
              <Label htmlFor="weakPasswordPercentage">Weak Password Percentage</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="weakPasswordPercentage"
                  min={0}
                  max={100}
                  step={5}
                  value={[weakPasswordPercentage]}
                  onValueChange={(value) => setWeakPasswordPercentage(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center">{weakPasswordPercentage}%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Percentage of passwords that will be generated as weak/common passwords for testing password strength
                reports
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4 border p-4 rounded-md">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reusePasswords"
              checked={reusePasswords}
              onCheckedChange={(checked) => setReusePasswords(checked as boolean)}
            />
            <Label htmlFor="reusePasswords">Reuse passwords across multiple sites</Label>
          </div>

          {reusePasswords && (
            <div>
              <Label htmlFor="passwordReusePercentage">Password Reuse Percentage</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="passwordReusePercentage"
                  min={0}
                  max={100}
                  step={5}
                  value={[passwordReusePercentage]}
                  onValueChange={(value) => setPasswordReusePercentage(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center">{passwordReusePercentage}%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Percentage of logins that will reuse passwords from other sites for testing password reuse reports
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useRealUrls"
            checked={useRealUrls}
            onCheckedChange={(checked) => setUseRealUrls(checked as boolean)}
          />
          <Label htmlFor="useRealUrls">Use real website URLs for logins</Label>
        </div>
        {vaultFormat === "bitwarden" && vaultType === "org" && (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useCollections"
                checked={useCollections}
                onCheckedChange={(checked) => setUseCollections(checked as boolean)}
              />
              <Label htmlFor="useCollections">Create collections for business departments</Label>
            </div>

            {useCollections && (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useNestedCollections"
                    checked={useNestedCollections}
                    onCheckedChange={(checked) => setUseNestedCollections(checked as boolean)}
                  />
                  <Label htmlFor="useNestedCollections">Use nested collections</Label>
                </div>

                {useNestedCollections ? (
                  <>
                    <div>
                      <Label htmlFor="totalCollectionCount">Total Number of Collections</Label>
                      <Input
                        id="totalCollectionCount"
                        type="number"
                        value={totalCollectionCount}
                        onChange={(e) => setTotalCollectionCount(Number.parseInt(e.target.value))}
                        min="1"
                        max="100"
                        aria-describedby="totalCollectionCount-description"
                      />
                      <p id="totalCollectionCount-description" className="text-sm text-muted-foreground">
                        Enter the total number of collections to generate across all levels
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="topLevelCollectionCount">Number of Top-Level Collections</Label>
                      <Input
                        id="topLevelCollectionCount"
                        type="number"
                        value={topLevelCollectionCount}
                        onChange={(e) => setTopLevelCollectionCount(Number.parseInt(e.target.value))}
                        min="1"
                        max="20"
                        aria-describedby="topLevelCollectionCount-description"
                      />
                      <p id="topLevelCollectionCount-description" className="text-sm text-muted-foreground">
                        Enter the number of top-level collections to generate
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="collectionNestingDepth">Maximum Nesting Depth</Label>
                      <Input
                        id="collectionNestingDepth"
                        type="number"
                        value={collectionNestingDepth}
                        onChange={(e) => setCollectionNestingDepth(Number.parseInt(e.target.value))}
                        min="1"
                        max="5"
                        aria-describedby="collectionNestingDepth-description"
                      />
                      <p id="collectionNestingDepth-description" className="text-sm text-muted-foreground">
                        Enter the maximum depth of nested collections (e.g., 3 = Parent/Child/Grandchild)
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <Label htmlFor="collectionCount">Number of Collections</Label>
                    <Input
                      id="collectionCount"
                      type="number"
                      value={collectionCount}
                      onChange={(e) => setCollectionCount(Number.parseInt(e.target.value))}
                      min="1"
                      max="100"
                      aria-describedby="collectionCount-description"
                    />
                    <p id="collectionCount-description" className="text-sm text-muted-foreground">
                      Enter the number of collections to generate
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="distributeItems"
                    checked={distributeItems}
                    onCheckedChange={(checked) => setDistributeItems(checked as boolean)}
                  />
                  <Label htmlFor="distributeItems">Assign items to collections</Label>
                </div>
              </>
            )}
          </>
        )}
        {vaultFormat === "keeper" && (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useNestedFolders"
                checked={useNestedFolders}
                onCheckedChange={(checked) => setUseNestedFolders(checked as boolean)}
              />
              <Label htmlFor="useNestedFolders">Use nested folder structure</Label>
            </div>

            {useNestedFolders && (
              <div className="flex items-center space-x-2 ml-6">
                <Checkbox
                  id="useRandomDepthNesting"
                  checked={useRandomDepthNesting}
                  onCheckedChange={(checked) => setUseRandomDepthNesting(checked as boolean)}
                />
                <Label htmlFor="useRandomDepthNesting">Enable deeper random nesting (up to 8 levels)</Label>
              </div>
            )}
          </>
        )}
        <Button onClick={generateVault}>Generate Vault</Button>
      </div>
      {generatedData && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Generated Vault Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">{generatedData}</pre>
          <div className="mt-4 space-x-4">
            {vaultFormat === "keeper" ? (
              <>
                <Button onClick={() => downloadData("json")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download JSON
                </Button>
                <Button onClick={() => downloadData("csv")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
              </>
            ) : (
              <Button onClick={() => downloadData()}>
                <Download className="mr-2 h-4 w-4" />
                Download{" "}
                {vaultFormat === "lastpass" || vaultFormat === "edge" || vaultFormat === "keepassx"
                  ? "CSV"
                  : vaultFormat === "keepass2"
                    ? "XML"
                    : "JSON"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
