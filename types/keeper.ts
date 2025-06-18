export interface KeeperFolder {
  name: string
  path?: string
  children?: KeeperFolder[]
}

export interface KeeperSharedFolder {
  name: string
  can_edit: boolean
  can_share: boolean
  path?: string
  children?: KeeperSharedFolder[]
}

export interface KeeperFolderReference {
  folder?: string
  folder_path?: string
  shared_folder?: string
  shared_folder_path?: string
  can_edit?: boolean
  can_share?: boolean
}

export interface KeeperRecord {
  title: string
  login: string
  password: string
  login_url: string
  notes: string
  custom_fields: { [key: string]: string }
  folders: KeeperFolderReference[]
}

export interface KeeperVault {
  records: KeeperRecord[]
  folders?: KeeperFolder[]
  shared_folders?: KeeperSharedFolder[]
}