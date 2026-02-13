export interface ChangelogEntry {
  version: string
  date: string
  changes: { type: "added" | "changed" | "fixed" | "removed"; description: string }[]
}

export const changelog: ChangelogEntry[] = [
  {
    version: "1.2.0",
    date: "2026-02-13",
    changes: [
      { type: "added", description: "Mr Blobby mode: injects bad data into exports to test password manager import error handling" },
      { type: "added", description: "Format-aware corruption: CSV delimiter breaks, XML entity injection, oversized fields, unicode edge cases, malformed URLs, and injection payloads" },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-02-12",
    changes: [
      { type: "added", description: "API documentation page at /docs with endpoint reference, parameter tables, format capabilities, examples, and error handling" },
      { type: "added", description: "Help icon in header linking to documentation" },
      { type: "added", description: "Docs link in footer navigation" },
    ],
  },
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
