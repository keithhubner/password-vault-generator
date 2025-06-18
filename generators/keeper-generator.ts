import { faker } from "@faker-js/faker"
import { KeeperVault, KeeperRecord, KeeperFolderReference } from "../types"
import { generatePassword, generateTOTPSecret } from "../utils/password-generators"
import { popularWebsites } from "../utils/constants"
import { 
  generateFolderStructure, 
  generateSharedFolderStructure, 
  flattenFolderStructure, 
  flattenSharedFolderStructure 
} from "../utils/folder-generators"

export const createKeeperItem = (
  number: number,
  useRealUrls: boolean,
  useNestedFolders: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[]
): KeeperRecord[] => {
  const folderStructure = useNestedFolders ? generateFolderStructure() : []
  const sharedFolderStructure = useNestedFolders ? generateSharedFolderStructure() : []

  const flatFolders = useNestedFolders ? flattenFolderStructure(folderStructure) : []
  const flatSharedFolders = useNestedFolders ? flattenSharedFolderStructure(sharedFolderStructure) : []

  const simpleFolders = ["Private Folder", "My Websites", "Social Media"]

  const items: KeeperRecord[] = []
  
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

    let folderReferences: KeeperFolderReference[] = []

    if (useNestedFolders) {
      const folderType = faker.helpers.arrayElement(["regular", "shared", "both"])

      if (folderType === "regular" || folderType === "both") {
        if (flatFolders.length > 0) {
          const randomFolder = faker.helpers.arrayElement(flatFolders)
          folderReferences.push({
            folder: randomFolder.name,
            folder_path: randomFolder.path,
          })
        }
      }

      if (folderType === "shared" || folderType === "both") {
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

      if (folderReferences.length === 0) {
        folderReferences.push({ folder: "Default" })
      }
    } else {
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
      login: faker.internet.username(),
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

export const generateKeeperVault = (
  loginCount: number,
  useRealUrls: boolean,
  useNestedFolders: boolean,
  useRandomDepthNesting: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[]
): KeeperVault => {
  const maxDepth = useNestedFolders ? (useRandomDepthNesting ? faker.number.int({ min: 4, max: 10 }) : 3) : 1

  const folderStructure = useNestedFolders ? generateFolderStructure(maxDepth) : []
  const sharedFolderStructure = useNestedFolders ? generateSharedFolderStructure(Math.min(maxDepth, 6)) : []

  const vault: KeeperVault = {
    records: createKeeperItem(
      loginCount,
      useRealUrls,
      useNestedFolders,
      useWeakPasswords,
      weakPasswordPercentage,
      reusePasswords,
      passwordReusePercentage,
      passwordPool
    ),
  }

  if (useNestedFolders) {
    vault.folders = folderStructure
    vault.shared_folders = sharedFolderStructure
  }

  return vault
}