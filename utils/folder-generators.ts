import { faker } from "@faker-js/faker"
import { KeeperFolder, KeeperSharedFolder, KeeperFolderReference } from "../types"

export const generateFolderStructure = (maxDepth = 3): KeeperFolder[] => {
  const numFolders = faker.number.int({ min: 2, max: 5 })
  const folders: KeeperFolder[] = []

  for (let i = 0; i < numFolders; i++) {
    const folder: KeeperFolder = {
      name: faker.word.noun(),
    }

    if (maxDepth > 1 && faker.datatype.boolean(0.6)) {
      folder.children = generateFolderStructure(maxDepth - 1)
    }

    folders.push(folder)
  }

  return folders
}

export const generateSharedFolderStructure = (maxDepth = 3): KeeperSharedFolder[] => {
  const numFolders = faker.number.int({ min: 1, max: 3 })
  const folders: KeeperSharedFolder[] = []

  for (let i = 0; i < numFolders; i++) {
    const folder: KeeperSharedFolder = {
      name: faker.word.noun(),
      can_edit: faker.datatype.boolean(),
      can_share: faker.datatype.boolean(),
    }

    if (maxDepth > 1 && faker.datatype.boolean(0.5)) {
      folder.children = generateSharedFolderStructure(maxDepth - 1)
    }

    folders.push(folder)
  }

  return folders
}

export const flattenFolderStructure = (folders: KeeperFolder[]): { name: string; path: string }[] => {
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

export const flattenSharedFolderStructure = (
  folders: KeeperSharedFolder[]
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