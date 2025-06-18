export interface BaseItem {
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

export interface LoginItem extends BaseItem {
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

export interface SecureNoteItem extends BaseItem {
  type: 2
  secureNote: { type: number }
}

export interface CreditCardItem extends BaseItem {
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

export interface IdentityItem extends BaseItem {
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

export type BitwardenVaultItem = LoginItem | SecureNoteItem | CreditCardItem | IdentityItem

export interface BitwardenVault {
  folders: { id: string; name: string }[]
  items: BitwardenVaultItem[]
}

export interface BitwardenOrgVault {
  collections: { id: string; organizationId: string; name: string; externalId: null }[]
  items: BitwardenVaultItem[]
}