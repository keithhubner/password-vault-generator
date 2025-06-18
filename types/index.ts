export * from './bitwarden'
export * from './lastpass'
export * from './edge'
export * from './keepassx'
export * from './keepass2'
export * from './keeper'

export type VaultFormat = 'bitwarden' | 'lastpass' | 'keeper' | 'edge' | 'keepassx' | 'keepass2'
export type VaultType = 'individual' | 'org'

export interface VaultGenerationOptions {
  loginCount: number
  secureNoteCount: number
  creditCardCount: number
  identityCount: number
  vaultType: VaultType
  vaultFormat: VaultFormat
  useRealUrls: boolean
  useCollections: boolean
  collectionCount: number
  distributeItems: boolean
  useNestedFolders: boolean
  useRandomDepthNesting: boolean
  useNestedCollections: boolean
  topLevelCollectionCount: number
  collectionNestingDepth: number
  totalCollectionCount: number
  useWeakPasswords: boolean
  weakPasswordPercentage: number
  reusePasswords: boolean
  passwordReusePercentage: number
}

export interface GenerationProgress {
  current: number
  total: number
  status: string
}

export interface GenerationError {
  message: string
  stack?: string
}