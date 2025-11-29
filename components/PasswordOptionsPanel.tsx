"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { EnterpriseUrlsTooltip } from "@/components/EnterpriseUrlsTooltip"
import { EnterpriseUrlsModal } from "@/components/EnterpriseUrlsModal"
import { UrlEntry } from "@/hooks/useEnterpriseUrls"

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
  enterpriseUrlsByCategory?: Record<string, UrlEntry[]>
  enterpriseUrlsEnabledCount?: number
  enterpriseUrlsTotalCount?: number
  onAddEnterpriseUrl?: (url: string, category?: string) => boolean
  onRemoveEnterpriseUrl?: (url: string) => void
  onToggleEnterpriseUrl?: (url: string, enabled: boolean) => void
  onToggleAllEnterpriseUrls?: (enabled: boolean) => void
  onImportEnterpriseUrlsCsv?: (file: File) => Promise<number>
  onResetEnterpriseUrls?: () => void
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
  enterpriseUrlsByCategory,
  enterpriseUrlsEnabledCount,
  enterpriseUrlsTotalCount,
  onAddEnterpriseUrl,
  onRemoveEnterpriseUrl,
  onToggleEnterpriseUrl,
  onToggleAllEnterpriseUrls,
  onImportEnterpriseUrlsCsv,
  onResetEnterpriseUrls,
}) => {
  const hasEnterpriseUrlsProps =
    enterpriseUrlsByCategory &&
    enterpriseUrlsEnabledCount !== undefined &&
    enterpriseUrlsTotalCount !== undefined &&
    onAddEnterpriseUrl &&
    onRemoveEnterpriseUrl &&
    onToggleEnterpriseUrl &&
    onToggleAllEnterpriseUrls &&
    onImportEnterpriseUrlsCsv &&
    onResetEnterpriseUrls
  return (
    <div className="rounded-md border border-border bg-card p-3 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Password Options
      </h3>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useWeakPasswords"
            checked={useWeakPasswords}
            onCheckedChange={(checked) => onUseWeakPasswordsChange(checked as boolean)}
          />
          <Label htmlFor="useWeakPasswords" className="text-xs cursor-pointer">
            Include weak passwords (for security testing)
          </Label>
        </div>

        {useWeakPasswords && (
          <div className="pl-5 space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-2xs text-muted-foreground">Weak password percentage</Label>
              <span className="text-xs font-mono text-primary">{weakPasswordPercentage}%</span>
            </div>
            <Slider
              id="weakPasswordPercentage"
              min={0}
              max={100}
              step={5}
              value={[weakPasswordPercentage]}
              onValueChange={(value) => onWeakPasswordPercentageChange(value[0])}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="reusePasswords"
            checked={reusePasswords}
            onCheckedChange={(checked) => onReusePasswordsChange(checked as boolean)}
          />
          <Label htmlFor="reusePasswords" className="text-xs cursor-pointer">
            Reuse passwords across multiple sites
          </Label>
        </div>

        {reusePasswords && (
          <div className="pl-5 space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-2xs text-muted-foreground">Password reuse percentage</Label>
              <span className="text-xs font-mono text-primary">{passwordReusePercentage}%</span>
            </div>
            <Slider
              id="passwordReusePercentage"
              min={0}
              max={100}
              step={5}
              value={[passwordReusePercentage]}
              onValueChange={(value) => onPasswordReusePercentageChange(value[0])}
            />
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useRealUrls"
            checked={useRealUrls}
            onCheckedChange={(checked) => onUseRealUrlsChange(checked as boolean)}
          />
          <Label htmlFor="useRealUrls" className="text-xs cursor-pointer">
            Use real website URLs for logins
          </Label>
        </div>

        {useRealUrls && (
          <div className="pl-5 flex items-center space-x-2">
            <Checkbox
              id="useEnterpriseUrls"
              checked={useEnterpriseUrls}
              onCheckedChange={(checked) => {
                onUseEnterpriseUrlsChange(checked as boolean)
                // When enabling enterprise URLs, select all by default
                if (checked && onToggleAllEnterpriseUrls) {
                  onToggleAllEnterpriseUrls(true)
                }
              }}
            />
            <Label htmlFor="useEnterpriseUrls" className="text-xs cursor-pointer">
              Enterprise URLs only
            </Label>
            <div className="flex items-center gap-1.5">
              <EnterpriseUrlsTooltip />
              {hasEnterpriseUrlsProps && (
                <EnterpriseUrlsModal
                  urlsByCategory={enterpriseUrlsByCategory}
                  enabledCount={enterpriseUrlsEnabledCount}
                  totalCount={enterpriseUrlsTotalCount}
                  onAddUrl={onAddEnterpriseUrl}
                  onRemoveUrl={onRemoveEnterpriseUrl}
                  onToggleUrl={onToggleEnterpriseUrl}
                  onToggleAll={onToggleAllEnterpriseUrls}
                  onImportCsv={onImportEnterpriseUrlsCsv}
                  onReset={onResetEnterpriseUrls}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
