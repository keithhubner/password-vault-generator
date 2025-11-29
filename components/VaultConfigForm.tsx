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
  language: string
  onLanguageChange: (language: string) => void
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
  language,
  onLanguageChange,
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
    <div className="rounded-md border border-border bg-card p-3 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Vault Configuration
      </h3>

      <div className="space-y-2">
        <Label htmlFor="vaultFormat" className="text-xs">Vault Format</Label>
        <Select onValueChange={onVaultFormatChange} value={vaultFormat}>
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
        <div className="space-y-2">
          <Label htmlFor="vaultType" className="text-xs">Vault Type</Label>
          <Select onValueChange={onVaultTypeChange} value={vaultType}>
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

      <div className="space-y-2">
        <Label htmlFor="language" className="text-xs">Language / Locale</Label>
        <Select onValueChange={onLanguageChange} value={language}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English (en)</SelectItem>
            <SelectItem value="ar">Arabic (ar)</SelectItem>
            <SelectItem value="da">Danish (da)</SelectItem>
            <SelectItem value="de">German (de)</SelectItem>
            <SelectItem value="el">Greek (el)</SelectItem>
            <SelectItem value="es">Spanish (es)</SelectItem>
            <SelectItem value="fi">Finnish (fi)</SelectItem>
            <SelectItem value="fr">French (fr)</SelectItem>
            <SelectItem value="he">Hebrew (he)</SelectItem>
            <SelectItem value="hr">Croatian (hr)</SelectItem>
            <SelectItem value="hu">Hungarian (hu)</SelectItem>
            <SelectItem value="it">Italian (it)</SelectItem>
            <SelectItem value="ja">Japanese (ja)</SelectItem>
            <SelectItem value="ko">Korean (ko)</SelectItem>
            <SelectItem value="lv">Latvian (lv)</SelectItem>
            <SelectItem value="nl">Dutch (nl)</SelectItem>
            <SelectItem value="pl">Polish (pl)</SelectItem>
            <SelectItem value="ro">Romanian (ro)</SelectItem>
            <SelectItem value="ru">Russian (ru)</SelectItem>
            <SelectItem value="sk">Slovak (sk)</SelectItem>
            <SelectItem value="sv">Swedish (sv)</SelectItem>
            <SelectItem value="th">Thai (th)</SelectItem>
            <SelectItem value="tr">Turkish (tr)</SelectItem>
            <SelectItem value="vi">Vietnamese (vi)</SelectItem>
            <SelectItem value="zh_CN">Chinese Simplified (zh_CN)</SelectItem>
            <SelectItem value="zh_TW">Chinese Traditional (zh_TW)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-2xs text-muted-foreground">
          Select language for generating names, addresses, and text content
        </p>
      </div>

      <div className="pt-2 border-t border-border">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Item Counts
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="loginCount" className="text-xs">Logins</Label>
            <Input
              id="loginCount"
              type="number"
              value={loginCount}
              onChange={(e) => onLoginCountChange(Number.parseInt(e.target.value))}
              min="0"
              max="10000"
            />
          </div>

          {showAdditionalItems && (
            <>
              <div className="space-y-1">
                <Label htmlFor="secureNoteCount" className="text-xs">Secure Notes</Label>
                <Input
                  id="secureNoteCount"
                  type="number"
                  value={secureNoteCount}
                  onChange={(e) => onSecureNoteCountChange(Number.parseInt(e.target.value))}
                  min="0"
                  max="10000"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="creditCardCount" className="text-xs">Credit Cards</Label>
                <Input
                  id="creditCardCount"
                  type="number"
                  value={creditCardCount}
                  onChange={(e) => onCreditCardCountChange(Number.parseInt(e.target.value))}
                  min="0"
                  max="10000"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="identityCount" className="text-xs">Identities</Label>
                <Input
                  id="identityCount"
                  type="number"
                  value={identityCount}
                  onChange={(e) => onIdentityCountChange(Number.parseInt(e.target.value))}
                  min="0"
                  max="10000"
                />
              </div>
            </>
          )}
        </div>

        {(vaultFormat === "keepass2" || vaultFormat === "password-depot") && (
          <p className="text-2xs text-muted-foreground mt-2">
            {vaultFormat === "keepass2" ? "KeePass2" : "Password Depot"} only supports login items.
          </p>
        )}
      </div>
    </div>
  )
}
