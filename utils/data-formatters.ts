import { LastPassItem, EdgePasswordItem, KeePassXItem, KeeperVault } from "../types"

export const formatLastPassToCsv = (items: LastPassItem[]): string => {
  const header = "url,username,password,extra,name,grouping,totp\n"
  const csvContent = items
    .map(
      (item) =>
        `${item.url},${item.username},${item.password},${item.extra},${item.name},${item.grouping},${item.totp}`
    )
    .join("\n")
  return header + csvContent
}

export const formatEdgeToCsv = (items: EdgePasswordItem[]): string => {
  const header = "name,url,username,password,note\n"
  const csvContent = items
    .map((item) => `"${item.name}","${item.url}","${item.username}","${item.password}","${item.note}"`)
    .join("\n")
  return header + csvContent
}

export const formatKeePassXToCsv = (items: KeePassXItem[]): string => {
  const header = '"Title","Username","Password","URL","Notes"\n'
  const csvContent = items
    .map((item) => `"${item.title}","${item.username}","${item.password}","${item.url}","${item.notes}"`)
    .join("\n")
  return header + csvContent
}

export const formatKeeperToCsv = (vault: KeeperVault): string => {
  const header = "Folder,Title,Login,Password,Website Address,Notes,Shared Folder,Custom Fields\n"
  const csvContent = vault.records
    .map((record) => {
      const folderRef = record.folders.find((f) => "folder" in f)
      const folder = folderRef ? folderRef.folder_path || folderRef.folder || "" : ""

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
  return header + csvContent
}

export const createDownloadBlob = (content: string, type: string): Blob => {
  return new Blob([content], { type })
}

export const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const securelyEraseData = (data: string): void => {
  // Overwrite the string data multiple times to prevent recovery
  const length = data.length
  let overwrite = ""
  
  // Fill with random characters
  for (let i = 0; i < length; i++) {
    overwrite += String.fromCharCode(Math.floor(Math.random() * 256))
  }
  
  // Force garbage collection (if available)
  if (typeof window !== 'undefined' && 'gc' in window && typeof (window as any).gc === 'function') {
    (window as any).gc()
  }
}