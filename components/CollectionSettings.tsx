"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { VaultFormat, VaultType } from "../types"

interface CollectionSettingsProps {
  vaultFormat: VaultFormat
  vaultType: VaultType
  useCollections: boolean
  onUseCollectionsChange: (value: boolean) => void
  useNestedCollections: boolean
  onUseNestedCollectionsChange: (value: boolean) => void
  collectionCount: number
  onCollectionCountChange: (count: number) => void
  topLevelCollectionCount: number
  onTopLevelCollectionCountChange: (count: number) => void
  collectionNestingDepth: number
  onCollectionNestingDepthChange: (depth: number) => void
  totalCollectionCount: number
  onTotalCollectionCountChange: (count: number) => void
  distributeItems: boolean
  onDistributeItemsChange: (value: boolean) => void
  useNestedFolders: boolean
  onUseNestedFoldersChange: (value: boolean) => void
  useRandomDepthNesting: boolean
  onUseRandomDepthNestingChange: (value: boolean) => void
}

export const CollectionSettings: React.FC<CollectionSettingsProps> = ({
  vaultFormat,
  vaultType,
  useCollections,
  onUseCollectionsChange,
  useNestedCollections,
  onUseNestedCollectionsChange,
  collectionCount,
  onCollectionCountChange,
  topLevelCollectionCount,
  onTopLevelCollectionCountChange,
  collectionNestingDepth,
  onCollectionNestingDepthChange,
  totalCollectionCount,
  onTotalCollectionCountChange,
  distributeItems,
  onDistributeItemsChange,
  useNestedFolders,
  onUseNestedFoldersChange,
  useRandomDepthNesting,
  onUseRandomDepthNestingChange,
}) => {
  const showBitwardenCollections = vaultFormat === "bitwarden" && vaultType === "org"
  const showKeeperFolders = vaultFormat === "keeper"

  if (!showBitwardenCollections && !showKeeperFolders) {
    return null
  }

  return (
    <div className="rounded-md border border-border bg-card p-3 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {showBitwardenCollections ? "Collection Settings" : "Folder Settings"}
      </h3>

      {showBitwardenCollections && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useCollections"
              checked={useCollections}
              onCheckedChange={(checked) => onUseCollectionsChange(checked as boolean)}
            />
            <Label htmlFor="useCollections" className="text-xs cursor-pointer">
              Create collections for business departments
            </Label>
          </div>

          {useCollections && (
            <div className="pl-5 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useNestedCollections"
                  checked={useNestedCollections}
                  onCheckedChange={(checked) => onUseNestedCollectionsChange(checked as boolean)}
                />
                <Label htmlFor="useNestedCollections" className="text-xs cursor-pointer">
                  Use nested collections
                </Label>
              </div>

              {useNestedCollections ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="totalCollectionCount" className="text-xs">Total Collections</Label>
                    <Input
                      id="totalCollectionCount"
                      type="number"
                      value={totalCollectionCount}
                      onChange={(e) => onTotalCollectionCountChange(Number.parseInt(e.target.value))}
                      min="1"
                      max="100"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="topLevelCollectionCount" className="text-xs">Top-Level</Label>
                    <Input
                      id="topLevelCollectionCount"
                      type="number"
                      value={topLevelCollectionCount}
                      onChange={(e) => onTopLevelCollectionCountChange(Number.parseInt(e.target.value))}
                      min="1"
                      max="20"
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="collectionNestingDepth" className="text-xs">Max Nesting Depth</Label>
                    <Input
                      id="collectionNestingDepth"
                      type="number"
                      value={collectionNestingDepth}
                      onChange={(e) => onCollectionNestingDepthChange(Number.parseInt(e.target.value))}
                      min="1"
                      max="5"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Label htmlFor="collectionCount" className="text-xs">Number of Collections</Label>
                  <Input
                    id="collectionCount"
                    type="number"
                    value={collectionCount}
                    onChange={(e) => onCollectionCountChange(Number.parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="distributeItems"
                  checked={distributeItems}
                  onCheckedChange={(checked) => onDistributeItemsChange(checked as boolean)}
                />
                <Label htmlFor="distributeItems" className="text-xs cursor-pointer">
                  Assign items to collections
                </Label>
              </div>
            </div>
          )}
        </div>
      )}

      {showKeeperFolders && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useNestedFolders"
              checked={useNestedFolders}
              onCheckedChange={(checked) => onUseNestedFoldersChange(checked as boolean)}
            />
            <Label htmlFor="useNestedFolders" className="text-xs cursor-pointer">
              Use nested folder structure
            </Label>
          </div>

          {useNestedFolders && (
            <div className="pl-5 flex items-center space-x-2">
              <Checkbox
                id="useRandomDepthNesting"
                checked={useRandomDepthNesting}
                onCheckedChange={(checked) => onUseRandomDepthNestingChange(checked as boolean)}
              />
              <Label htmlFor="useRandomDepthNesting" className="text-xs cursor-pointer">
                Enable deeper random nesting (up to 8 levels)
              </Label>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
