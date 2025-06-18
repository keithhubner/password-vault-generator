export interface KeePass2String {
  Key: string
  Value: string
  ProtectInMemory?: boolean
}

export interface KeePass2Times {
  LastModificationTime: string
  CreationTime: string
  LastAccessTime: string
  ExpiryTime: string
  Expires: boolean
  UsageCount: number
  LocationChanged: string
}

export interface KeePass2Meta {
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

export interface KeePass2Group {
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
  Entries: KeePass2Entry[]
  Groups: KeePass2Group[]
}

export interface KeePass2Entry {
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

export interface DeletedObjectsType {
  DeletedObject: Array<{
    UUID: string
    DeletionTime: string
  }>
}

export interface KeePass2File {
  Meta: KeePass2Meta
  Root: {
    Group: KeePass2Group
    DeletedObjects: DeletedObjectsType
  }
}