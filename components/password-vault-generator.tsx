'use client'

import { useState } from 'react'
import { faker } from '@faker-js/faker'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from 'lucide-react'

// Define interfaces for our vault items
interface BaseItem {
  id: string;
  organizationId: string | null;
  folderId: string;
  type: number;
  name: string;
  notes: string;
  favorite: boolean;
  fields: { name: string; value: string; type: number; }[];
  collectionIds: (string | null)[];
}

interface LoginItem extends BaseItem {
  type: 1;
  login: {
    uris: { match: null; uri: string; }[];
    username: string;
    password: string;
    totp: string;
  };
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

type VaultItem = LoginItem | SecureNoteItem | CreditCardItem | IdentityItem;

interface Vault {
  folders: { id: string; name: string }[];
  items: VaultItem[];
}

interface OrgVault {
  collections: { id: string; name: string }[];
  items: VaultItem[];
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

// Helper function to create items
const createItem = (itemType: string, number: number, vaultType: 'individual' | 'org'): VaultItem[] => {
  const items: VaultItem[] = []
  for (let i = 0; i < number; i++) {
    let item: VaultItem
    switch (itemType) {
      case "objType1":
        item = {
          id: faker.string.uuid(),
          organizationId: null,
          folderId: "",
          type: 1,
          name: faker.internet.domainName() + " Login",
          notes: faker.lorem.paragraph(),
          favorite: false,
          fields: [
            { name: "Text Field", value: "text-field-value", type: 0 },
            { name: "Hidden Field", value: "hidden-field-value", type: 1 },
            { name: "Boolean Field", value: "true", type: 2 }
          ],
          login: {
            uris: [{ match: null, uri: faker.internet.url() }],
            username: faker.internet.email(),
            password: faker.internet.password(),
            totp: `otpauth://totp/Example:${faker.internet.email()}?secret=${generateTOTPSecret()}&issuer=Example&algorithm=SHA1&digits=6&period=30`
          },
          collectionIds: [null]
        }
        break
      case "objType2":
        item = {
          id: faker.string.uuid(),
          organizationId: null,
          folderId: "",
          type: 2,
          name: "My Secure Note",
          notes: faker.lorem.paragraph(),
          favorite: false,
          fields: [
            { name: "Text Field", value: "text-field-value", type: 0 },
            { name: "Hidden Field", value: "hidden-field-value", type: 1 },
            { name: "Boolean Field", value: "false", type: 2 }
          ],
          secureNote: { type: 0 },
          collectionIds: [null]
        }
        break
      case "objType3":
        item = {
          id: faker.string.uuid(),
          organizationId: null,
          folderId: "",
          type: 3,
          name: faker.finance.accountName(),
          notes: faker.lorem.paragraph(),
          favorite: false,
          fields: [
            { name: "Text Field", value: "text-field-value", type: 0 },
            { name: "Hidden Field", value: "hidden-field-value", type: 1 },
            { name: "Boolean Field", value: "false", type: 2 }
          ],
          card: {
            cardholderName: "Jane Doe",
            brand: "Visa",
            number: faker.finance.creditCardNumber('visa'),
            expMonth: faker.number.int({ min: 1, max: 12 }).toString(),
            expYear: faker.number.int({ min: 2024, max: 2030 }).toString(),
            code: faker.finance.creditCardCVV()
          },
          collectionIds: [null]
        }
        break
      case "objType4":
        item = {
          id: faker.string.uuid(),
          organizationId: null,
          folderId: "",
          type: 4,
          name: faker.person.fullName(),
          notes: faker.lorem.paragraph(),
          favorite: false,
          fields: [
            { name: "Text Field", value: "text-field-value", type: 0 },
            { name: "Hidden Field", value: "hidden-field-value", type: 1 },
            { name: "Boolean Field", value: "true", type: 2 }
          ],
          identity: {
            title: "",
            firstName: faker.person.firstName(),
            middleName: faker.person.middleName(),
            lastName: faker.person.lastName(),
            address1: faker.location.streetAddress(),
            address2: faker.location.street(),
            address3: null,
            city: faker.location.city(),
            state: faker.location.state(),
            postalCode: faker.location.zipCode(),
            country: "United States",
            company: faker.company.name(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            ssn: "123-12-1234",
            username: faker.internet.userName(),
            passportNumber: faker.string.numeric({ length: 10, allowLeadingZeros: false }),
            licenseNumber: faker.string.numeric({ length: 10, allowLeadingZeros: false })
          },
          collectionIds: [null]
        }
        break
      default:
        // Handle unknown item types by creating a generic secure note
        item = {
          id: faker.string.uuid(),
          organizationId: null,
          folderId: "",
          type: 2,
          name: "Unknown Item Type",
          notes: "This item was created because an unknown item type was requested.",
          favorite: false,
          fields: [],
          secureNote: { type: 0 },
          collectionIds: [null]
        }
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
  const [generatedData, setGeneratedData] = useState("")

  const generateVault = () => {
    const vault: Vault | OrgVault = vaultType === 'individual' 
      ? { folders: [], items: [] }
      : { collections: [], items: [] }

    vault.items = [
      ...createItem("objType1", loginCount, vaultType),
      ...createItem("objType2", secureNoteCount, vaultType),
      ...createItem("objType3", creditCardCount, vaultType),
      ...createItem("objType4", identityCount, vaultType)
    ]

    setGeneratedData(JSON.stringify(vault, null, 2))
  }

  const downloadJSON = () => {
    const blob = new Blob([generatedData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${vaultType}_${vaultFormat}_vault.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Password Vault Generator</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="vaultFormat">Vault Format</Label>
          <Select onValueChange={setVaultFormat} defaultValue={vaultFormat}>
            <SelectTrigger id="vaultFormat">
              <SelectValue placeholder="Select vault format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bitwarden">Bitwarden</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
        <Button onClick={generateVault}>Generate Vault</Button>
      </div>
      {generatedData && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Generated Vault Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {generatedData}
          </pre>
          <Button onClick={downloadJSON} className="mt-4">
            <Download className="mr-2 h-4 w-4" />
            Download JSON
          </Button>
        </div>
      )}
    </div>
  )
}