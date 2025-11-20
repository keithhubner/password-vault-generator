"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface PasswordOptionsPanelProps {
  useWeakPasswords: boolean
  onUseWeakPasswordsChange: (value: boolean) => void
  weakPasswordPercentage: number
  onWeakPasswordPercentageChange: (value: number) => void
  reusePasswords: boolean
  onReusePasswordsChange: (value: boolean) => void
  passwordReusePercentage: number
  onPasswordReusePercentageChange: (value: number) => void
  useRealUrls: boolean
  onUseRealUrlsChange: (value: boolean) => void
  useEnterpriseUrls: boolean
  onUseEnterpriseUrlsChange: (value: boolean) => void
}

export const PasswordOptionsPanel: React.FC<PasswordOptionsPanelProps> = ({
  useWeakPasswords,
  onUseWeakPasswordsChange,
  weakPasswordPercentage,
  onWeakPasswordPercentageChange,
  reusePasswords,
  onReusePasswordsChange,
  passwordReusePercentage,
  onPasswordReusePercentageChange,
  useRealUrls,
  onUseRealUrlsChange,
  useEnterpriseUrls,
  onUseEnterpriseUrlsChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useWeakPasswords"
            checked={useWeakPasswords}
            onCheckedChange={(checked) => onUseWeakPasswordsChange(checked as boolean)}
          />
          <Label htmlFor="useWeakPasswords">Include weak passwords</Label>
        </div>

        {useWeakPasswords && (
          <div>
            <Label htmlFor="weakPasswordPercentage">Weak Password Percentage</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="weakPasswordPercentage"
                min={0}
                max={100}
                step={5}
                value={[weakPasswordPercentage]}
                onValueChange={(value) => onWeakPasswordPercentageChange(value[0])}
                className="flex-1"
              />
              <span className="w-12 text-center">{weakPasswordPercentage}%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Percentage of passwords that will be generated as weak/common passwords for testing password strength reports
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="reusePasswords"
            checked={reusePasswords}
            onCheckedChange={(checked) => onReusePasswordsChange(checked as boolean)}
          />
          <Label htmlFor="reusePasswords">Reuse passwords across multiple sites</Label>
        </div>

        {reusePasswords && (
          <div>
            <Label htmlFor="passwordReusePercentage">Password Reuse Percentage</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="passwordReusePercentage"
                min={0}
                max={100}
                step={5}
                value={[passwordReusePercentage]}
                onValueChange={(value) => onPasswordReusePercentageChange(value[0])}
                className="flex-1"
              />
              <span className="w-12 text-center">{passwordReusePercentage}%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Percentage of logins that will reuse passwords from other sites for testing password reuse reports
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useRealUrls"
            checked={useRealUrls}
            onCheckedChange={(checked) => onUseRealUrlsChange(checked as boolean)}
          />
          <Label htmlFor="useRealUrls">Use real website URLs for logins</Label>
        </div>

        {useRealUrls && (
          <div className="ml-6 flex items-center space-x-2">
            <Checkbox
              id="useEnterpriseUrls"
              checked={useEnterpriseUrls}
              onCheckedChange={(checked) => onUseEnterpriseUrlsChange(checked as boolean)}
            />
            <Label htmlFor="useEnterpriseUrls">Use enterprise URLs only (SIEM, Salesforce, Okta, etc.)</Label>
          </div>
        )}
      </div>
    </div>
  )
}