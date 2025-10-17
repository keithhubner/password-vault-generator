"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { VaultFormat } from "../types"

interface TagSettingsProps {
  vaultFormat: VaultFormat
  useTags: boolean
  onUseTagsChange: (checked: boolean) => void
  tagCount: number
  onTagCountChange: (count: number) => void
  taggedItemPercentage: number
  onTaggedItemPercentageChange: (percentage: number) => void
}

export const TagSettings: React.FC<TagSettingsProps> = ({
  vaultFormat,
  useTags,
  onUseTagsChange,
  tagCount,
  onTagCountChange,
  taggedItemPercentage,
  onTaggedItemPercentageChange,
}) => {
  // Only show tag settings for 1Password
  if (vaultFormat !== "1password") {
    return null
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
      <h3 className="text-lg font-semibold text-gray-800">Tag Configuration</h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="useTags"
          checked={useTags}
          onCheckedChange={(checked) => onUseTagsChange(checked === true)}
        />
        <Label htmlFor="useTags">Generate organizational tags</Label>
      </div>

      {useTags && (
        <>
          <div>
            <Label htmlFor="tagCount">Number of Different Tags</Label>
            <Input
              id="tagCount"
              type="number"
              min={1}
              max={50}
              value={tagCount}
              onChange={(e) => onTagCountChange(parseInt(e.target.value) || 1)}
              className="mt-1"
            />
            <p className="text-sm text-gray-600 mt-1">
              Creates {tagCount} unique department/organizational tags (Finance, HR, IT, etc.)
            </p>
          </div>

          <div>
            <Label htmlFor="taggedItemPercentage">
              Percentage of Items with Tags: {taggedItemPercentage}%
            </Label>
            <Slider
              id="taggedItemPercentage"
              min={10}
              max={100}
              step={5}
              value={[taggedItemPercentage]}
              onValueChange={(values) => onTaggedItemPercentageChange(values[0])}
              className="mt-2"
            />
            <p className="text-sm text-gray-600 mt-1">
              {taggedItemPercentage}% of login items will have 1-3 tags assigned
            </p>
          </div>
        </>
      )}

      {!useTags && (
        <p className="text-sm text-gray-600">
          When disabled, login items will have no tags (empty tag field)
        </p>
      )}
    </div>
  )
}