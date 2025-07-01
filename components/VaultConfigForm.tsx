"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VaultFormat, VaultType } from "../types"

interface VaultConfigFormProps {
  vaultFormat: VaultFormat
  onVaultFormatChange: (format: VaultFormat) => void
  vaultType: VaultType
  onVaultTypeChange: (type: VaultType) => void
  loginCount: number
  onLoginCountChange: (count: number) => void
  secureNoteCount: number
  onSecureNoteCountChange: (count: number) => void
  creditCardCount: number
  onCreditCardCountChange: (count: number) => void
  identityCount: number
  onIdentityCountChange: (count: number) => void
}

export const VaultConfigForm: React.FC<VaultConfigFormProps> = ({
  vaultFormat,
  onVaultFormatChange,
  vaultType,
  onVaultTypeChange,
  loginCount,
  onLoginCountChange,
  secureNoteCount,
  onSecureNoteCountChange,
  creditCardCount,
  onCreditCardCountChange,
  identityCount,
  onIdentityCountChange,
}) => {
  const showAdditionalItems = !["lastpass", "edge", "keepassx", "keepass2", "password-depot"].includes(vaultFormat)

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="vaultFormat">Vault Format</Label>
        <Select onValueChange={onVaultFormatChange} defaultValue={vaultFormat}>
          <SelectTrigger id="vaultFormat">
            <SelectValue placeholder="Select vault format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bitwarden">Bitwarden</SelectItem>
            <SelectItem value="lastpass">LastPass</SelectItem>
            <SelectItem value="keeper">Keeper</SelectItem>
            <SelectItem value="edge">Microsoft Edge</SelectItem>
            <SelectItem value="keepassx">KeePassX</SelectItem>
            <SelectItem value="keepass2">KeePass2</SelectItem>
            <SelectItem value="password-depot">Password Depot</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {vaultFormat === "bitwarden" && (
        <div>
          <Label htmlFor="vaultType">Vault Type</Label>
          <Select onValueChange={onVaultTypeChange} defaultValue={vaultType}>
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
          onChange={(e) => onLoginCountChange(Number.parseInt(e.target.value))}
          min="0"
          max="10000"
          aria-describedby="loginCount-description"
        />
        <p id="loginCount-description" className="text-sm text-muted-foreground">
          Enter the number of login items to generate (includes random TOTP keys)
        </p>
      </div>

      {(vaultFormat === "keepass2" || vaultFormat === "password-depot") && (
        <p className="text-sm text-muted-foreground">
          {vaultFormat === "keepass2" ? "KeePass2" : "Password Depot"} only supports login items.
        </p>
      )}

      {showAdditionalItems && (
        <>
          <div>
            <Label htmlFor="secureNoteCount">Number of Secure Notes</Label>
            <Input
              id="secureNoteCount"
              type="number"
              value={secureNoteCount}
              onChange={(e) => onSecureNoteCountChange(Number.parseInt(e.target.value))}
              min="0"
              max="10000"
              aria-describedby="secureNoteCount-description"
            />
            <p id="secureNoteCount-description" className="text-sm text-muted-foreground">
              Enter the number of secure note items to generate
            </p>
          </div>
          
          <div>
            <Label htmlFor="creditCardCount">Number of Credit Cards</Label>
            <Input
              id="creditCardCount"
              type="number"
              value={creditCardCount}
              onChange={(e) => onCreditCardCountChange(Number.parseInt(e.target.value))}
              min="0"
              max="10000"
              aria-describedby="creditCardCount-description"
            />
            <p id="creditCardCount-description" className="text-sm text-muted-foreground">
              Enter the number of credit card items to generate
            </p>
          </div>
          
          <div>
            <Label htmlFor="identityCount">Number of Identities</Label>
            <Input
              id="identityCount"
              type="number"
              value={identityCount}
              onChange={(e) => onIdentityCountChange(Number.parseInt(e.target.value))}
              min="0"
              max="10000"
              aria-describedby="identityCount-description"
            />
            <p id="identityCount-description" className="text-sm text-muted-foreground">
              Enter the number of identity items to generate
            </p>
          </div>
        </>
      )}
    </div>
  )
}