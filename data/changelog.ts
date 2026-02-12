export interface ChangelogEntry {
  version: string
  date: string
  changes: { type: "added" | "changed" | "fixed" | "removed"; description: string }[]
}

export const changelog: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "2026-02-12",
    changes: [
      { type: "added", description: "Password vault generation for 7 formats: Bitwarden, LastPass, Keeper, Microsoft Edge, KeePassX, KeePass2, and Password Depot" },
      { type: "added", description: "REST API with rate limiting and security middleware" },
      { type: "added", description: "Multi-language support with locale-specific data generation" },
      { type: "added", description: "Bitwarden advanced types: secure notes, credit cards, identities, and collections" },
      { type: "added", description: "Dark mode with system theme detection" },
      { type: "added", description: "CI pipeline with build and API integration tests" },
      { type: "added", description: "Daily automated dependency updates via GitHub Actions" },
    ],
  },
]
