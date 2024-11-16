'use client'

import { useState } from 'react'
import { faker } from '@faker-js/faker'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Lock } from 'lucide-react'

// Bitwarden interfaces
interface BaseItem {
  id: string;
  organizationId: string | null;
  folderId: string;
  type: number;
  name: string;
  notes: string;
  favorite: boolean;
  fields: { name: string; value: string; type: number; }[];
  collectionIds: string[];
  revisionDate: string;
  creationDate: string;
  deletedDate: null;
  reprompt: number;
}

interface LoginItem extends BaseItem {
  type: 1;
  login: {
    uris: { match: null; uri: string; }[];
    username: string;
    password: string;
    totp: string;
  };
  passwordHistory: {
    lastUsedDate: string;
    password: string;
  }[];
}

interface SecureNoteItem extends BaseItem {
  type: 2;
  secureNote: { type: number };
}

interface CreditCardItem extends BaseItem {
  type: 3;
  card: {
    cardholderName: string;
    brand: string;
    number: string;
    expMonth: string;
    expYear: string;
    code: string;
  };
}

interface IdentityItem extends BaseItem {
  type: 4;
  identity: {
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    address1: string;
    address2: string;
    address3: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    company: string;
    email: string;
    phone: string;
    ssn: string;
    username: string;
    passportNumber: string;
    licenseNumber: string;
  };
}

type BitwardenVaultItem = LoginItem | SecureNoteItem | CreditCardItem | IdentityItem;

interface BitwardenVault {
  folders: { id: string; name: string }[];
  items: BitwardenVaultItem[];
}

interface BitwardenOrgVault {
  collections: { id: string; organizationId: string; name: string; externalId: null }[];
  items: BitwardenVaultItem[];
}

// LastPass interface
interface LastPassItem {
  url: string;
  username: string;
  password: string;
  extra: string;
  name: string;
  grouping: string;
  totp: string;
}

// Helper function to generate random TOTP secret key
const generateTOTPSecret = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let secret = ''
  for (let i = 0; i < 32; i++) {
    secret += chars[Math.floor(Math.random() * chars.length)]
  }
  return secret
}

// List of popular websites for generating real URLs
const popularWebsites = [
  'google.com', 'youtube.com', 'facebook.com', 'amazon.com', 'twitter.com',
  'instagram.com', 'linkedin.com', 'netflix.com', 'microsoft.com', 'apple.com',
  'github.com', 'stackoverflow.com', 'reddit.com', 'twitch.tv', 'spotify.com',
  'dropbox.com', 'slack.com', 'zoom.us', 'airbnb.com', 'uber.com'
]

// List of business departments for collections
const businessDepartments = [
  'IT', 'Finance', 'HR', 'Marketing', 'Sales', 'Operations', 'Legal', 'Customer Support'
]

// Helper function to create Bitwarden items
const createBitwardenItem = (
  itemType: string, 
  number: number, 
  vaultType: 'individual' | 'org', 
  useRealUrls: boolean, 
  collections: { id: string; name: string }[], 
  distributeItems: boolean
): BitwardenVaultItem[] => {
  const items: BitwardenVaultItem[] = []
  const orgId = vaultType === 'org' ? faker.string.uuid() : null
  for (let i = 0; i < number; i++) {
    let item: BitwardenVaultItem
    const now = new Date().toISOString()
    const baseItem = {
      id: faker.string.uuid(),
      organizationId: orgId,
      folderId: faker.string.uuid(),
      favorite: false,
      fields: [
        { name: "Text Field", value: "text-field-value", type: 0 },
        { name: "Hidden Field", value: "hidden-field-value", type: 1 },
        { name: "Boolean Field", value: faker.datatype.boolean().toString(), type: 2 }
      ],
      collectionIds: distributeItems && collections.length > 0
        ? [collections[Math.floor(Math.random() * collections.length)].id]
        : [],
      revisionDate: now,
      creationDate: now,
      deletedDate: null,
      reprompt: 0
    }
    switch (itemType) {
      case "objType1":
        const website = useRealUrls 
          ? popularWebsites[Math.floor(Math.random() * popularWebsites.length)]
          : faker.internet.domainName()
        item = {
          ...baseItem,
          type: 1,
          name: website + " Login",
          notes: faker.lorem.paragraph(),
          login: {
            uris: [{ match: null, uri: `https://www.${website}` }],
            username: faker.internet.email(),
            password: faker.internet.password(),
            totp: `otpauth://totp/Example:${faker.internet.email()}?secret=${generateTOTPSecret()}&issuer=Example&algorithm=SHA1&digits=6&period=30`
          },
          passwordHistory: [
            {
              lastUsedDate: faker.date.past().toISOString(),
              password: faker.internet.password()
            }
          ]
        }
        break
      case "objType2":
        item = {
          ...baseItem,
          type: 2,
          name: "My Secure Note",
          notes: faker.lorem.paragraph(),
          secureNote: { type: 0 }
        }
        break
      case "objType3":
        item = {
          ...baseItem,
          type: 3,
          name: faker.finance.accountName(),
          notes: faker.lorem.paragraph(),
          card: {
            cardholderName: faker.person.fullName(),
            brand: "Visa",
            number: faker.finance.creditCardNumber(),
            expMonth: faker.number.int({ min: 1, max: 12 }).toString(),
            expYear: faker.date.future().getFullYear().toString(),
            code: faker.finance.creditCardCVV()
          }
        }
        break
      case "objType4":
        item = {
          ...baseItem,
          type: 4,
          name: faker.person.fullName(),
          notes: faker.lorem.paragraph(),
          identity: {
            title: faker.person.prefix(),
            firstName: faker.person.firstName(),
            middleName: faker.person.middleName(),
            lastName: faker.person.lastName(),
            address1: faker.location.streetAddress(),
            address2: faker.location.secondaryAddress(),
            address3: null,
            city: faker.location.city(),
            state: faker.location.state(),
            postalCode: faker.location.zipCode(),
            country: faker.location.country(),
            company: faker.company.name(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            ssn: faker.string.numeric(9),
            username: faker.internet.userName(),
            passportNumber: faker.string.alphanumeric(9),
            licenseNumber: faker.string.alphanumeric(8)
          }
        }
        break
      default:
        item = {
          ...baseItem,
          type: 2,
          name: "Unknown Item Type",
          notes: "This item was created because an unknown item type was requested.",
          secureNote: { type: 0 }
        }
    }
    items.push(item)
  }
  return items
}

// Helper function to create LastPass items
const createLastPassItem = (number: number, useRealUrls: boolean): LastPassItem[] => {
  const items: LastPassItem[] = []
  for (let i = 0; i < number; i++) {
    const website = useRealUrls 
      ? popularWebsites[Math.floor(Math.random() * popularWebsites.length)]
      : faker.internet.domainName()
    const item: LastPassItem = {
      url: `https://www.${website}`,
      username: faker.internet.email(),
      password: faker.internet.password(),
      extra: faker.lorem.paragraph(),
      name: website + " Login",
      grouping: "",
      totp: generateTOTPSecret()
    }
    items.push(item)
  }
  return items
}

export default function Component() {
  const [loginCount, setLoginCount] = useState(10)
  const [secureNoteCount, setSecureNoteCount] = useState(10)
  const [creditCardCount, setCreditCardCount] = useState(10)
  const [identityCount, setIdentityCount] = useState(10)
  const [vaultType, setVaultType] = useState<'individual' | 'org'>('individual')
  const [vaultFormat, setVaultFormat] = useState('bitwarden')
  const [useRealUrls, setUseRealUrls] = useState(false)
  const [useCollections, setUseCollections] = useState(false)
  const [distributeItems, setDistributeItems] = useState(false)
  const [generatedData, setGeneratedData] = useState("")

  const generateVault = () => {
    if (vaultFormat === 'bitwarden') {
      if (vaultType === 'individual') {
        const vault: BitwardenVault = { folders: [], items: [] }
        vault.items = [
          ...createBitwardenItem("objType1", loginCount, vaultType, useRealUrls, [], false),
          ...createBitwardenItem("objType2", secureNoteCount, vaultType, useRealUrls, [], false),
          ...createBitwardenItem("objType3", creditCardCount, vaultType, useRealUrls, [], false),
          ...createBitwardenItem("objType4", identityCount, vaultType, useRealUrls, [], false)
        ]
        setGeneratedData(JSON.stringify(vault, null, 2))
      } else {
        const orgVault: BitwardenOrgVault = { collections: [], items: [] }
        const orgId = faker.string.uuid()
        if (useCollections) {
          orgVault.collections = businessDepartments.map(dept => ({
            id: faker.string.uuid(),
            organizationId: orgId,
            name: dept,
            externalId: null
          }))
        }
        orgVault.items = [
          ...createBitwardenItem("objType1", loginCount, vaultType, useRealUrls, orgVault.collections, distributeItems),
          ...createBitwardenItem("objType2", secureNoteCount, vaultType, useRealUrls, orgVault.collections, distributeItems),
          ...createBitwardenItem("objType3", creditCardCount, vaultType, useRealUrls, orgVault.collections, distributeItems),
          ...createBitwardenItem("objType4", identityCount, vaultType, useRealUrls, orgVault.collections, distributeItems)
        ]
        setGeneratedData(JSON.stringify(orgVault, null, 2))
      }
    } else if (vaultFormat === 'lastpass') {
      const items = createLastPassItem(loginCount, useRealUrls)
      setGeneratedData(JSON.stringify(items, null, 2))
    }
  }

  const downloadData = () => {
    let content: string
    let filename: string
    let type: string

    if (vaultFormat === 'bitwarden') {
      content = generatedData
      filename = `${vaultType}_${vaultFormat}_vault.json`
      type = 'application/json'
    } else if (vaultFormat === 'lastpass') {
      // Convert JSON to CSV
      const items: LastPassItem[] = JSON.parse(generatedData)
      const header = 'url,username,password,extra,name,grouping,totp\n'
      const csvContent = items.map(item => 
        `${item.url},${item.username},${item.password},${item.extra},${item.name},${item.grouping},${item.totp}`
      ).join('\n')
      content = header + csvContent
      filename = 'lastpass_vault_export.csv'
      type = 'text/csv'
    } else {
      // Handle unexpected vault format
      console.error('Unexpected vault format')
      return
    }

    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Lock className="h-8 w-8 mr-2" aria-hidden="true" />
        <h1 className="text-2xl font-bold">Password Vault Generator</h1>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="vaultFormat">Vault Format</Label>
          <Select onValueChange={setVaultFormat} defaultValue={vaultFormat}>
            <SelectTrigger id="vaultFormat">
              <SelectValue placeholder="Select vault format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bitwarden">Bitwarden</SelectItem>
              <SelectItem value="lastpass">LastPass</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {vaultFormat === 'bitwarden' && (
          <div>
            <Label htmlFor="vaultType">Vault Type</Label>
            <Select onValueChange={(value: 'individual' | 'org') => setVaultType(value)} defaultValue={vaultType}>
              <SelectTrigger id="vaultType">
                <SelectValue placeholder="Select vault type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="org">Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label htmlFor="loginCount">Number of Logins</Label>
          <Input 
            id="loginCount" 
            type="number" 
            value={loginCount} 
            onChange={(e) => setLoginCount(parseInt(e.target.value))} 
            min="0"
            aria-describedby="loginCount-description"
          />
          <p id="loginCount-description" className="text-sm text-muted-foreground">Enter the number of login items to generate (includes random TOTP keys)</p>
        </div>
        {vaultFormat === 'bitwarden' && (
          <>
            <div>
              <Label htmlFor="secureNoteCount">Number of Secure Notes</Label>
              <Input 
                id="secureNoteCount" 
                type="number" 
                value={secureNoteCount} 
                onChange={(e) => setSecureNoteCount(parseInt(e.target.value))} 
                min="0"
                aria-describedby="secureNoteCount-description"
              />
              <p id="secureNoteCount-description" className="text-sm text-muted-foreground">Enter the number of secure note items to generate</p>
            </div>
            <div>
              <Label htmlFor="creditCardCount">Number of Credit Cards</Label>
              <Input 
                id="creditCardCount" 
                type="number" 
                value={creditCardCount} 
                onChange={(e) => setCreditCardCount(parseInt(e.target.value))} 
                min="0"
                aria-describedby="creditCardCount-description"
              />
              <p id="creditCardCount-description" className="text-sm text-muted-foreground">Enter the number of credit card items to generate</p>
            </div>
            <div>
              <Label htmlFor="identityCount">Number of Identities</Label>
              <Input 
                id="identityCount" 
                type="number" 
                value={identityCount} 
                onChange={(e) => setIdentityCount(parseInt(e.target.value))} 
                min="0"
                aria-describedby="identityCount-description"
              />
              <p id="identityCount-description" className="text-sm text-muted-foreground">Enter the number of identity items to generate</p>
            </div>
          </>
        )}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="useRealUrls" 
            checked={useRealUrls} 
            onCheckedChange={(checked) => setUseRealUrls(checked as boolean)}
          />
          <Label htmlFor="useRealUrls">Use real website URLs for logins</Label>
        </div>
        {vaultFormat === 'bitwarden' && vaultType === 'org' && (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="useCollections" 
                checked={useCollections} 
                onCheckedChange={(checked) => setUseCollections(checked as boolean)}
              />
              <Label htmlFor="useCollections">Create collections for business departments</Label>
            </div>
            {useCollections && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="distributeItems" 
                  checked={distributeItems} 
                  onCheckedChange={(checked) => setDistributeItems(checked as boolean)}
                />
                <Label htmlFor="distributeItems">Distribute items into collections</Label>
              </div>
            )}
          </>
        )}
        <Button onClick={generateVault}>Generate Vault</Button>
      </div>
      {generatedData && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Generated Vault Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {generatedData}
          </pre>
          <Button onClick={downloadData} className="mt-4">
            <Download className="mr-2 h-4 w-4" />
            Download {vaultFormat === 'bitwarden' ? 'JSON' : 'CSV'}
          </Button>
        </div>
      )}
    </div>
  )
}