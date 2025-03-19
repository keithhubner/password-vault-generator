"use client"

import { useState } from "react"
import { faker } from "@faker-js/faker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Lock } from "lucide-react"

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
]

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
            password: faker.internet.password(),
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
const createLastPassItem = (number: number, useRealUrls: boolean): LastPassItem[] => {
  const items: LastPassItem[] = []
  for (let i = 0; i < number; i++) {
    const website = useRealUrls
      ? popularWebsites[Math.floor(Math.random() * popularWebsites.length)]
      : faker.internet.domainName()
    const item: LastPassItem = {
      url: `https://www.${website}`,
      username: faker.internet.email(),
      password: faker.internet.password(),
      extra: faker.lorem.paragraph(),
      name: website + " Login",
      grouping: "",
      totp: generateTOTPSecret(),
    }
    items.push(item)
  }
  return items
}

// Find the generateFolderStructure function and replace it with this improved version
// that properly implements deep nesting

const generateFolderStructure = (maxDepth = 3, maxChildren = 3): KeeperFolder[] => {
  // Base categories for top level
  const folderCategories = [
    "Personal",
    "Work",
    "Finance",
    "Social",
    "Shopping",
    "Travel",
    "Entertainment",
    "Health",
    "Education",
    "Family",
  ]

  // Categories for second level
  const subCategories: Record<string, string[]> = {
    Personal: ["Documents", "Photos", "Contacts", "Notes"],
    Work: ["Projects", "Clients", "Meetings", "Resources"],
    Finance: ["Banking", "Investments", "Insurance", "Taxes"],
    Social: ["Facebook", "Twitter", "Instagram", "LinkedIn"],
    Shopping: ["Amazon", "eBay", "Etsy", "Walmart"],
    Travel: ["Airlines", "Hotels", "Rentals", "Bookings"],
    Entertainment: ["Streaming", "Gaming", "Music", "Movies"],
    Health: ["Medical", "Fitness", "Insurance", "Prescriptions"],
    Education: ["Courses", "Certificates", "Resources", "Schools"],
    Family: ["Children", "Spouse", "Parents", "Relatives"],
  }

  // Categories for third level
  const subSubCategories: Record<string, string[]> = {
    Banking: ["Checking", "Savings", "Credit Cards", "Loans"],
    Investments: ["Stocks", "Bonds", "Crypto", "Retirement"],
    Projects: ["Active", "Completed", "Planning", "Archive"],
    Streaming: ["Netflix", "Hulu", "Disney+", "HBO Max"],
    Airlines: ["Domestic", "International", "Rewards", "Bookings"],
  }

  // Categories for deeper levels (4+)
  const deepCategories = [
    "Primary",
    "Secondary",
    "Archived",
    "Important",
    "Confidential",
    "Shared",
    "Private",
    "Legacy",
    "Current",
    "Draft",
    "Final",
    "2023",
    "2024",
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "East",
    "West",
    "North",
    "South",
  ]

  // Recursive function to generate nested folders at any depth
  const generateNestedFolders = (depth: number, parentPath = ""): KeeperFolder[] => {
    if (depth <= 0) return []

    // For deeper levels, use the deep categories
    const categoriesToUse = depth <= 3 ? deepCategories : deepCategories
    const numFolders = faker.number.int({ min: 1, max: Math.min(4, categoriesToUse.length) })

    // Select random categories for this level
    const selectedCategories = [...categoriesToUse].sort(() => 0.5 - Math.random()).slice(0, numFolders)

    return selectedCategories.map((category) => {
      const currentPath = parentPath ? `${parentPath}\\${category}` : category

      const folder: KeeperFolder = {
        name: category,
        path: currentPath,
      }

      // Decide whether to add children (higher chance at lower depths)
      const chanceOfChildren = Math.max(0.1, 0.8 - depth * 0.1)
      if (depth > 1 && faker.datatype.boolean(chanceOfChildren)) {
        folder.children = generateNestedFolders(depth - 1, currentPath)
      }

      return folder
    })
  }

  // Start with top-level folders
  const numTopFolders = faker.number.int({ min: 2, max: 5 })
  const selectedTopCategories = [...folderCategories].sort(() => 0.5 - Math.random()).slice(0, numTopFolders)

  return selectedTopCategories.map((category) => {
    const folder: KeeperFolder = {
      name: category,
      path: category,
    }

    // For top-level folders, use the predefined subcategories
    if (maxDepth > 1 && subCategories[category]) {
      const subCats = subCategories[category]
      const numChildren = faker.number.int({ min: 1, max: Math.min(3, subCats.length) })
      const selectedSubCats = [...subCats].sort(() => 0.5 - Math.random()).slice(0, numChildren)

      folder.children = selectedSubCats.map((subCat) => {
        const subFolder: KeeperFolder = {
          name: subCat,
          path: `${category}\\${subCat}`,
        }

        // For second-level folders, use predefined sub-subcategories if available
        if (maxDepth > 2 && subSubCategories[subCat]) {
          const subSubCats = subSubCategories[subCat]
          const numSubChildren = faker.number.int({ min: 1, max: Math.min(3, subSubCats.length) })
          const selectedSubSubCats = [...subSubCats].sort(() => 0.5 - Math.random()).slice(0, numSubChildren)

          subFolder.children = selectedSubSubCats.map((subSubCat) => {
            const subSubFolder: KeeperFolder = {
              name: subSubCat,
              path: `${category}\\${subCat}\\${subSubCat}`,
            }

            // For deeper nesting (beyond level 3), use the recursive function
            if (maxDepth > 3) {
              subSubFolder.children = generateNestedFolders(maxDepth - 3, subSubFolder.path)
            }

            return subSubFolder
          })
        }

        return subFolder
      })
    }

    return folder
  })
}

// Also replace the generateSharedFolderStructure function with this improved version

const generateSharedFolderStructure = (maxDepth = 2): KeeperSharedFolder[] => {
  const sharedCategories = [
    "Team Projects",
    "Department Resources",
    "Company Policies",
    "Client Information",
    "Vendor Access",
    "Shared Services",
  ]

  const sharedSubCategories: Record<string, string[]> = {
    "Team Projects": ["Active", "Archived", "Planning"],
    "Department Resources": ["HR", "IT", "Finance", "Marketing"],
    "Company Policies": ["Security", "HR", "IT", "General"],
    "Client Information": ["Active", "Prospective", "Former"],
    "Vendor Access": ["IT Services", "Office Supplies", "Consulting"],
    "Shared Services": ["Software", "Subscriptions", "Accounts"],
  }

  // Categories for deeper levels
  const deepSharedCategories = [
    "Priority",
    "Standard",
    "Legacy",
    "Restricted",
    "Public",
    "Internal",
    "External",
    "Temporary",
    "Permanent",
    "Regional",
    "Global",
    "Local",
    "Division",
    "Group",
    "Team",
  ]

  // Recursive function to generate nested shared folders
  const generateNestedSharedFolders = (depth: number, parentPath = ""): KeeperSharedFolder[] => {
    if (depth <= 0) return []

    const numFolders = faker.number.int({ min: 1, max: 3 })
    const selectedCategories = [...deepSharedCategories].sort(() => 0.5 - Math.random()).slice(0, numFolders)

    return selectedCategories.map((category) => {
      const currentPath = parentPath ? `${parentPath}\\${category}` : category

      const folder: KeeperSharedFolder = {
        name: category,
        path: currentPath,
        can_edit: faker.datatype.boolean(),
        can_share: faker.datatype.boolean(),
      }

      // Decide whether to add children (higher chance at lower depths)
      const chanceOfChildren = Math.max(0.1, 0.7 - depth * 0.1)
      if (depth > 1 && faker.datatype.boolean(chanceOfChildren)) {
        folder.children = generateNestedSharedFolders(depth - 1, currentPath)
      }

      return folder
    })
  }

  // Select a subset of top-level shared folders
  const numSharedFolders = faker.number.int({ min: 1, max: 3 })
  const selectedSharedCategories = [...sharedCategories].sort(() => 0.5 - Math.random()).slice(0, numSharedFolders)

  return selectedSharedCategories.map((category) => {
    const sharedFolder: KeeperSharedFolder = {
      name: category,
      path: category,
      can_edit: faker.datatype.boolean(),
      can_share: faker.datatype.boolean(),
    }

    // Add second level if applicable
    if (maxDepth > 1 && sharedSubCategories[category]) {
      const subCats = sharedSubCategories[category]
      const numChildren = faker.number.int({ min: 1, max: Math.min(3, subCats.length) })
      const selectedSubCats = [...subCats].sort(() => 0.5 - Math.random()).slice(0, numChildren)

      sharedFolder.children = selectedSubCats.map((subCat) => {
        const subFolder: KeeperSharedFolder = {
          name: subCat,
          path: `${category}\\${subCat}`,
          can_edit: faker.datatype.boolean(),
          can_share: faker.datatype.boolean(),
        }

        // For deeper nesting (beyond level 2), use the recursive function
        if (maxDepth > 2) {
          subFolder.children = generateNestedSharedFolders(maxDepth - 2, subFolder.path)
        }

        return subFolder
      })
    }

    return sharedFolder
  })
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
const createKeeperItem = (number: number, useRealUrls: boolean, useNestedFolders: boolean): KeeperRecord[] => {
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
      password: faker.internet.password(),
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

export default function Component() {
  const [loginCount, setLoginCount] = useState(10)
  const [secureNoteCount, setSecureNoteCount] = useState(10)
  const [creditCardCount, setCreditCardCount] = useState(10)
  const [identityCount, setIdentityCount] = useState(10)
  const [vaultType, setVaultType] = useState<"individual" | "org">("individual")
  const [vaultFormat, setVaultFormat] = useState("bitwarden")
  const [useRealUrls, setUseRealUrls] = useState(false)
  const [useCollections, setUseCollections] = useState(false)
  const [distributeItems, setDistributeItems] = useState(false)
  const [useNestedFolders, setUseNestedFolders] = useState(false)
  const [useRandomDepthNesting, setUseRandomDepthNesting] = useState(false)
  const [generatedData, setGeneratedData] = useState("")

  const generateVault = () => {
    if (vaultFormat === "bitwarden") {
      if (vaultType === "individual") {
        const vault: BitwardenVault = { folders: [], items: [] }
        vault.items = [
          ...createBitwardenItem("objType1", loginCount, vaultType, useRealUrls, [], false),
          ...createBitwardenItem("objType2", secureNoteCount, vaultType, useRealUrls, [], false),
          ...createBitwardenItem("objType3", creditCardCount, vaultType, useRealUrls, [], false),
          ...createBitwardenItem("objType4", identityCount, vaultType, useRealUrls, [], false),
        ]
        setGeneratedData(JSON.stringify(vault, null, 2))
      } else {
        const orgVault: BitwardenOrgVault = { collections: [], items: [] }
        const orgId = faker.string.uuid()
        if (useCollections) {
          orgVault.collections = businessDepartments.map((dept) => ({
            id: faker.string.uuid(),
            organizationId: orgId,
            name: dept,
            externalId: null,
          }))
        }
        orgVault.items = [
          ...createBitwardenItem("objType1", loginCount, vaultType, useRealUrls, orgVault.collections, distributeItems),
          ...createBitwardenItem(
            "objType2",
            secureNoteCount,
            vaultType,
            useRealUrls,
            orgVault.collections,
            distributeItems,
          ),
          ...createBitwardenItem(
            "objType3",
            creditCardCount,
            vaultType,
            useRealUrls,
            orgVault.collections,
            distributeItems,
          ),
          ...createBitwardenItem(
            "objType4",
            identityCount,
            vaultType,
            useRealUrls,
            orgVault.collections,
            distributeItems,
          ),
        ]
        setGeneratedData(JSON.stringify(orgVault, null, 2))
      }
    } else if (vaultFormat === "lastpass") {
      const items = createLastPassItem(loginCount, useRealUrls)
      setGeneratedData(JSON.stringify(items, null, 2))
    } else if (vaultFormat === "keeper") {
      // Update the generateVault function to use more extreme random depths when enabled
      // Find this section in the generateVault function:

      // Create folder structure if using nested folders
      const maxDepth = useNestedFolders ? (useRandomDepthNesting ? faker.number.int({ min: 4, max: 10 }) : 3) : 1

      const folderStructure = useNestedFolders ? generateFolderStructure(maxDepth) : []
      const sharedFolderStructure = useNestedFolders ? generateSharedFolderStructure(Math.min(maxDepth, 6)) : []

      const vault: KeeperVault = {
        records: createKeeperItem(loginCount, useRealUrls, useNestedFolders),
      }

      // Add folder structure to vault if using nested folders
      if (useNestedFolders) {
        vault.folders = folderStructure
        vault.shared_folders = sharedFolderStructure
      }

      setGeneratedData(JSON.stringify(vault, null, 2))
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
        {vaultFormat !== "lastpass" && (
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="distributeItems"
                  checked={distributeItems}
                  onCheckedChange={(checked) => setDistributeItems(checked as boolean)}
                />
                <Label htmlFor="distributeItems">Assign items to collections</Label>
              </div>
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
                Download {vaultFormat === "lastpass" ? "CSV" : "JSON"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

