import { businessDepartments, businessFunctions, businessRegions } from "./constants"

export const generateUniqueCollectionNames = (count: number): string[] => {
  let collections = [...businessDepartments]

  if (count > collections.length) {
    collections = collections.concat(businessFunctions)
  }

  if (count > collections.length) {
    const regionDeptCombos = []
    for (const region of businessRegions) {
      for (const dept of businessDepartments.slice(0, 5)) {
        regionDeptCombos.push(`${region} ${dept}`)
      }
    }
    collections = collections.concat(regionDeptCombos)
  }

  if (count > collections.length) {
    const neededMore = count - collections.length
    for (let i = 1; i <= neededMore; i++) {
      collections.push(`Department ${i}`)
    }
  }

  return collections.sort(() => 0.5 - Math.random()).slice(0, count)
}

export const generateHierarchicalCollections = (
  topLevelCount: number,
  maxDepth: number,
  totalCount: number
): string[] => {
  topLevelCount = Math.min(topLevelCount, totalCount)
  
  const topLevelNames = generateUniqueCollectionNames(topLevelCount)
  const allCollections = new Set<string>(topLevelNames)

  if (allCollections.size >= totalCount || maxDepth <= 1) {
    return Array.from(allCollections).slice(0, totalCount)
  }

  let currentLevel = [...topLevelNames]
  let remainingCount = totalCount - topLevelCount

  for (let depth = 1; depth < maxDepth && remainingCount > 0 && currentLevel.length > 0; depth++) {
    const nextLevel: string[] = []
    const childrenPerParent = Math.max(1, Math.floor(remainingCount / currentLevel.length))

    for (let i = 0; i < currentLevel.length && remainingCount > 0; i++) {
      const parentPath = currentLevel[i]
      const parentBaseName = parentPath.split("/").pop() || parentPath
      const actualChildrenForThisParent = Math.min(childrenPerParent, remainingCount)

      if (actualChildrenForThisParent <= 0) continue

      let childNames: string[] = []

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
          childNames = ["Team A", "Team B", "Projects"].slice(0, actualChildrenForThisParent)
        }
      } else if (businessRegions.includes(parentBaseName)) {
        childNames = ["Sales", "Operations", "Support"].slice(0, actualChildrenForThisParent)
      } else {
        childNames = Array.from({ length: actualChildrenForThisParent }, (_, i) => `Subgroup ${i + 1}`)
      }

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

    currentLevel = nextLevel
  }

  return Array.from(allCollections)
}

export const ensureParentPaths = (collections: string[]): string[] => {
  const result = new Set<string>()

  collections.forEach((collection) => result.add(collection))

  collections.forEach((collection) => {
    const parts = collection.split("/")

    for (let i = 1; i < parts.length; i++) {
      const parentPath = parts.slice(0, i).join("/")
      result.add(parentPath)
    }
  })

  return Array.from(result)
}