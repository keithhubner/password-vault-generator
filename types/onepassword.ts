export interface OnePasswordItem {
  title: string
  website: string
  username: string
  password: string
  oneTimePassword: string
  favoriteStatus: boolean
  archivedStatus: boolean
  tags: string
  notes: string
}

export interface OnePasswordExport {
  items: OnePasswordItem[]
}