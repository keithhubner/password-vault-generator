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

  return (
    <div className="space-y-4">
      {showBitwardenCollections && (
        <>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useCollections"
              checked={useCollections}
              onCheckedChange={(checked) => onUseCollectionsChange(checked as boolean)}
            />
            <Label htmlFor="useCollections">Create collections for business departments</Label>
          </div>

          {useCollections && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useNestedCollections"
                  checked={useNestedCollections}
                  onCheckedChange={(checked) => onUseNestedCollectionsChange(checked as boolean)}
                />
                <Label htmlFor="useNestedCollections">Use nested collections</Label>
              </div>

              {useNestedCollections ? (
                <>
                  <div>
                    <Label htmlFor="totalCollectionCount">Total Number of Collections</Label>
                    <Input
                      id="totalCollectionCount"
                      type="number"
                      value={totalCollectionCount}
                      onChange={(e) => onTotalCollectionCountChange(Number.parseInt(e.target.value))}
                      min="1"
                      max="100"
                      aria-describedby="totalCollectionCount-description"
                    />
                    <p id="totalCollectionCount-description" className="text-sm text-muted-foreground">
                      Enter the total number of collections to generate across all levels
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="topLevelCollectionCount">Number of Top-Level Collections</Label>
                    <Input
                      id="topLevelCollectionCount"
                      type="number"
                      value={topLevelCollectionCount}
                      onChange={(e) => onTopLevelCollectionCountChange(Number.parseInt(e.target.value))}
                      min="1"
                      max="20"
                      aria-describedby="topLevelCollectionCount-description"
                    />
                    <p id="topLevelCollectionCount-description" className="text-sm text-muted-foreground">
                      Enter the number of top-level collections to generate
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="collectionNestingDepth">Maximum Nesting Depth</Label>
                    <Input
                      id="collectionNestingDepth"
                      type="number"
                      value={collectionNestingDepth}
                      onChange={(e) => onCollectionNestingDepthChange(Number.parseInt(e.target.value))}
                      min="1"
                      max="5"
                      aria-describedby="collectionNestingDepth-description"
                    />
                    <p id="collectionNestingDepth-description" className="text-sm text-muted-foreground">
                      Enter the maximum depth of nested collections (e.g., 3 = Parent/Child/Grandchild)
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <Label htmlFor="collectionCount">Number of Collections</Label>
                  <Input
                    id="collectionCount"
                    type="number"
                    value={collectionCount}
                    onChange={(e) => onCollectionCountChange(Number.parseInt(e.target.value))}
                    min="1"
                    max="100"
                    aria-describedby="collectionCount-description"
                  />
                  <p id="collectionCount-description" className="text-sm text-muted-foreground">
                    Enter the number of collections to generate
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="distributeItems"
                  checked={distributeItems}
                  onCheckedChange={(checked) => onDistributeItemsChange(checked as boolean)}
                />
                <Label htmlFor="distributeItems">Assign items to collections</Label>
              </div>
            </>
          )}
        </>
      )}

      {showKeeperFolders && (
        <>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useNestedFolders"
              checked={useNestedFolders}
              onCheckedChange={(checked) => onUseNestedFoldersChange(checked as boolean)}
            />
            <Label htmlFor="useNestedFolders">Use nested folder structure</Label>
          </div>

          {useNestedFolders && (
            <div className="flex items-center space-x-2 ml-6">
              <Checkbox
                id="useRandomDepthNesting"
                checked={useRandomDepthNesting}
                onCheckedChange={(checked) => onUseRandomDepthNestingChange(checked as boolean)}
              />
              <Label htmlFor="useRandomDepthNesting">Enable deeper random nesting (up to 8 levels)</Label>
            </div>
          )}
        </>
      )}
    </div>
  )
}