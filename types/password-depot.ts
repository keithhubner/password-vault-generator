export interface PasswordDepotItem {
  description: string
  importance: string
  password: string
  lastModified: string
  expiryDate: string
  userName: string
  url: string
  comments: string
  category: string
}

export interface PasswordDepotExport {
  items: PasswordDepotItem[]
}