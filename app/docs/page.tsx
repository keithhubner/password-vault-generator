import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Documentation - Password Vault Generator",
  description:
    "API reference for Password Vault Generator: endpoints, parameters, format capabilities, rate limits, and examples.",
}

const tocItems = [
  { id: "quick-start", label: "Quick Start" },
  { id: "endpoints", label: "Endpoints" },
  { id: "generation-parameters", label: "Generation Parameters" },
  { id: "format-capabilities", label: "Format Capabilities" },
  { id: "rate-limits", label: "Rate Limits & Constraints" },
  { id: "supported-languages", label: "Supported Languages" },
  { id: "examples", label: "Examples" },
  { id: "error-handling", label: "Error Handling" },
]

export default function DocsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center space-x-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        <span>Back to generator</span>
      </Link>

      <h1 className="text-2xl font-bold mb-6">API Documentation</h1>

      {/* Table of Contents */}
      <nav className="mb-10 p-4 rounded-md border border-border bg-muted/50">
        <h2 className="text-sm font-semibold mb-2">Contents</h2>
        <ul className="space-y-1">
          {tocItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Start */}
      <section id="quick-start" className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Quick Start</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Generate a Bitwarden vault with 50 login items:
        </p>
        <pre className="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto">
{`curl -X POST /api/vault/generate \\
  -H "Content-Type: application/json" \\
  -d '{"format": "bitwarden", "loginCount": 50}'`}
        </pre>
      </section>

      {/* Endpoints */}
      <section id="endpoints" className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Endpoints</h2>
        <div className="space-y-4">
          <div className="border border-border rounded-md p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-2xs font-mono font-medium rounded">
                GET
              </span>
              <code className="text-sm font-mono">/api/vault</code>
            </div>
            <p className="text-sm text-muted-foreground">
              API overview. Returns supported formats, endpoint info, and rate
              limit details.
            </p>
          </div>

          <div className="border border-border rounded-md p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-2xs font-mono font-medium rounded">
                GET
              </span>
              <code className="text-sm font-mono">/api/vault/formats</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Detailed format capabilities. Returns each format&apos;s supported
              vault types, item types, organizational features, and output
              format.
            </p>
          </div>

          <div className="border border-border rounded-md p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-2xs font-mono font-medium rounded">
                POST
              </span>
              <code className="text-sm font-mono">/api/vault/generate</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Generate vault data. Accepts JSON body with generation parameters.
              Returns the vault file as a download (JSON, CSV, or XML depending
              on format).
            </p>
          </div>

          <div className="border border-border rounded-md p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-2xs font-mono font-medium rounded">
                GET
              </span>
              <code className="text-sm font-mono">/api/config</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Application configuration. Returns hosting provider info.
            </p>
          </div>
        </div>
      </section>

      {/* Generation Parameters */}
      <section id="generation-parameters" className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Generation Parameters</h2>
        <p className="text-sm text-muted-foreground mb-4">
          All parameters for{" "}
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
            POST /api/vault/generate
          </code>
          . Only <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">format</code> is
          required.
        </p>

        {/* Core Parameters */}
        <h3 className="text-sm font-semibold mb-2">Core</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2 border-b border-border font-medium">
                  Parameter
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Type
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Default
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  format
                </td>
                <td className="p-2 border-b border-border text-xs">string</td>
                <td className="p-2 border-b border-border text-xs text-muted-foreground">
                  required
                </td>
                <td className="p-2 border-b border-border text-xs">
                  One of: bitwarden, lastpass, keeper, edge, keepassx, keepass2,
                  password-depot
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  vaultType
                </td>
                <td className="p-2 border-b border-border text-xs">string</td>
                <td className="p-2 border-b border-border text-xs">
                  &quot;individual&quot;
                </td>
                <td className="p-2 border-b border-border text-xs">
                  &quot;individual&quot; or &quot;org&quot; (org is Bitwarden
                  only)
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  loginCount
                </td>
                <td className="p-2 border-b border-border text-xs">number</td>
                <td className="p-2 border-b border-border text-xs">50</td>
                <td className="p-2 border-b border-border text-xs">
                  Number of login items (0 - 10,000)
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  secureNoteCount
                </td>
                <td className="p-2 border-b border-border text-xs">number</td>
                <td className="p-2 border-b border-border text-xs">0</td>
                <td className="p-2 border-b border-border text-xs">
                  Number of secure notes (Bitwarden only, 0 - 10,000)
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  creditCardCount
                </td>
                <td className="p-2 border-b border-border text-xs">number</td>
                <td className="p-2 border-b border-border text-xs">0</td>
                <td className="p-2 border-b border-border text-xs">
                  Number of credit cards (Bitwarden only, 0 - 10,000)
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  identityCount
                </td>
                <td className="p-2 border-b border-border text-xs">number</td>
                <td className="p-2 border-b border-border text-xs">0</td>
                <td className="p-2 border-b border-border text-xs">
                  Number of identity items (Bitwarden only, 0 - 10,000)
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  language
                </td>
                <td className="p-2 border-b border-border text-xs">string</td>
                <td className="p-2 border-b border-border text-xs">
                  &quot;en&quot;
                </td>
                <td className="p-2 border-b border-border text-xs">
                  Locale for generated data (see Supported Languages)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* URL Options */}
        <h3 className="text-sm font-semibold mb-2">URL Options</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2 border-b border-border font-medium">
                  Parameter
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Type
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Default
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  useRealUrls
                </td>
                <td className="p-2 border-b border-border text-xs">boolean</td>
                <td className="p-2 border-b border-border text-xs">false</td>
                <td className="p-2 border-b border-border text-xs">
                  Use real website URLs instead of generated ones
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  useEnterpriseUrls
                </td>
                <td className="p-2 border-b border-border text-xs">boolean</td>
                <td className="p-2 border-b border-border text-xs">false</td>
                <td className="p-2 border-b border-border text-xs">
                  Use enterprise/corporate URLs
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  enterpriseUrls
                </td>
                <td className="p-2 border-b border-border text-xs">
                  string[]
                </td>
                <td className="p-2 border-b border-border text-xs text-muted-foreground">
                  -
                </td>
                <td className="p-2 border-b border-border text-xs">
                  Custom list of enterprise URLs to use
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Password Options */}
        <h3 className="text-sm font-semibold mb-2">Password Options</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2 border-b border-border font-medium">
                  Parameter
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Type
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Default
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  useWeakPasswords
                </td>
                <td className="p-2 border-b border-border text-xs">boolean</td>
                <td className="p-2 border-b border-border text-xs">false</td>
                <td className="p-2 border-b border-border text-xs">
                  Include weak/common passwords in generated data
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  weakPasswordPercentage
                </td>
                <td className="p-2 border-b border-border text-xs">number</td>
                <td className="p-2 border-b border-border text-xs">20</td>
                <td className="p-2 border-b border-border text-xs">
                  Percentage of passwords that are weak (0 - 100)
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  reusePasswords
                </td>
                <td className="p-2 border-b border-border text-xs">boolean</td>
                <td className="p-2 border-b border-border text-xs">false</td>
                <td className="p-2 border-b border-border text-xs">
                  Simulate password reuse across entries
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  passwordReusePercentage
                </td>
                <td className="p-2 border-b border-border text-xs">number</td>
                <td className="p-2 border-b border-border text-xs">10</td>
                <td className="p-2 border-b border-border text-xs">
                  Percentage of passwords that are reused (0 - 100)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Data Quality Options */}
        <h3 className="text-sm font-semibold mb-2">Data Quality (Mr Blobby)</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2 border-b border-border font-medium">
                  Parameter
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Type
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Default
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  useMrBlobby
                </td>
                <td className="p-2 border-b border-border text-xs">boolean</td>
                <td className="p-2 border-b border-border text-xs">false</td>
                <td className="p-2 border-b border-border text-xs">
                  Inject deliberately bad data to test import error handling
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  mrBlobbyPercentage
                </td>
                <td className="p-2 border-b border-border text-xs">number</td>
                <td className="p-2 border-b border-border text-xs">20</td>
                <td className="p-2 border-b border-border text-xs">
                  Percentage of items to corrupt (5 - 100). Injects malformed URLs,
                  oversized fields, unicode edge cases, empty fields, SQL/XSS payloads,
                  unescaped CSV delimiters, broken XML entities, and duplicate entries.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Collection Options */}
        <h3 className="text-sm font-semibold mb-2">
          Collection Options{" "}
          <span className="text-xs font-normal text-muted-foreground">
            (Bitwarden org vaults only)
          </span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2 border-b border-border font-medium">
                  Parameter
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Type
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Default
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  useCollections
                </td>
                <td className="p-2 border-b border-border text-xs">boolean</td>
                <td className="p-2 border-b border-border text-xs">false</td>
                <td className="p-2 border-b border-border text-xs">
                  Enable collections in the vault
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  collectionCount
                </td>
                <td className="p-2 border-b border-border text-xs">number</td>
                <td className="p-2 border-b border-border text-xs">5</td>
                <td className="p-2 border-b border-border text-xs">
                  Number of flat collections (max 100)
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  distributeItems
                </td>
                <td className="p-2 border-b border-border text-xs">boolean</td>
                <td className="p-2 border-b border-border text-xs">true</td>
                <td className="p-2 border-b border-border text-xs">
                  Distribute items across collections
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  useNestedCollections
                </td>
                <td className="p-2 border-b border-border text-xs">boolean</td>
                <td className="p-2 border-b border-border text-xs">false</td>
                <td className="p-2 border-b border-border text-xs">
                  Enable hierarchical nested collections
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  topLevelCollectionCount
                </td>
                <td className="p-2 border-b border-border text-xs">number</td>
                <td className="p-2 border-b border-border text-xs">5</td>
                <td className="p-2 border-b border-border text-xs">
                  Number of top-level collections when nested
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  collectionNestingDepth
                </td>
                <td className="p-2 border-b border-border text-xs">number</td>
                <td className="p-2 border-b border-border text-xs">3</td>
                <td className="p-2 border-b border-border text-xs">
                  Maximum nesting depth (max 10)
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  totalCollectionCount
                </td>
                <td className="p-2 border-b border-border text-xs">number</td>
                <td className="p-2 border-b border-border text-xs">15</td>
                <td className="p-2 border-b border-border text-xs">
                  Total number of collections when nested (max 100)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Format Capabilities */}
      <section id="format-capabilities" className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Format Capabilities</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2 border-b border-border font-medium">
                  Format
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Output
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Vault Types
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Item Types
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Features
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  bitwarden
                </td>
                <td className="p-2 border-b border-border text-xs">JSON</td>
                <td className="p-2 border-b border-border text-xs">
                  individual, org
                </td>
                <td className="p-2 border-b border-border text-xs">
                  login, secureNote, creditCard, identity
                </td>
                <td className="p-2 border-b border-border text-xs">
                  Folders, collections, nested collections
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  lastpass
                </td>
                <td className="p-2 border-b border-border text-xs">CSV</td>
                <td className="p-2 border-b border-border text-xs">
                  individual
                </td>
                <td className="p-2 border-b border-border text-xs">login</td>
                <td className="p-2 border-b border-border text-xs">-</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  keeper
                </td>
                <td className="p-2 border-b border-border text-xs">CSV</td>
                <td className="p-2 border-b border-border text-xs">
                  individual
                </td>
                <td className="p-2 border-b border-border text-xs">login</td>
                <td className="p-2 border-b border-border text-xs">Folders</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  edge
                </td>
                <td className="p-2 border-b border-border text-xs">CSV</td>
                <td className="p-2 border-b border-border text-xs">
                  individual
                </td>
                <td className="p-2 border-b border-border text-xs">login</td>
                <td className="p-2 border-b border-border text-xs">-</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  keepassx
                </td>
                <td className="p-2 border-b border-border text-xs">CSV</td>
                <td className="p-2 border-b border-border text-xs">
                  individual
                </td>
                <td className="p-2 border-b border-border text-xs">login</td>
                <td className="p-2 border-b border-border text-xs">-</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  keepass2
                </td>
                <td className="p-2 border-b border-border text-xs">XML</td>
                <td className="p-2 border-b border-border text-xs">
                  individual
                </td>
                <td className="p-2 border-b border-border text-xs">login</td>
                <td className="p-2 border-b border-border text-xs">
                  Predefined groups
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  password-depot
                </td>
                <td className="p-2 border-b border-border text-xs">CSV</td>
                <td className="p-2 border-b border-border text-xs">
                  individual
                </td>
                <td className="p-2 border-b border-border text-xs">login</td>
                <td className="p-2 border-b border-border text-xs">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Rate Limits & Constraints */}
      <section id="rate-limits" className="mb-10">
        <h2 className="text-lg font-semibold mb-3">
          Rate Limits &amp; Constraints
        </h2>

        <h3 className="text-sm font-semibold mb-2">Rate Limits</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2 border-b border-border font-medium">
                  Endpoint
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Limit
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-border text-xs">
                  POST /api/vault/generate
                </td>
                <td className="p-2 border-b border-border text-xs">
                  10 requests per minute
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border text-xs">
                  All other endpoints (GET)
                </td>
                <td className="p-2 border-b border-border text-xs">
                  60 requests per minute
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-muted-foreground mb-2">
          Rate limit headers are included in all responses:
        </p>
        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mb-4">
          <li>
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
              X-RateLimit-Limit
            </code>{" "}
            &ndash; maximum requests allowed
          </li>
          <li>
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
              X-RateLimit-Remaining
            </code>{" "}
            &ndash; requests remaining in window
          </li>
          <li>
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
              X-RateLimit-Reset
            </code>{" "}
            &ndash; window reset time (Unix seconds)
          </li>
        </ul>

        <h3 className="text-sm font-semibold mb-2">Item Constraints</h3>
        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mb-4">
          <li>Maximum 10,000 items per type</li>
          <li>Maximum 15,000 total items across all types</li>
          <li>At least 1 item must be generated</li>
        </ul>

        <h3 className="text-sm font-semibold mb-2">Collection Constraints</h3>
        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mb-4">
          <li>Maximum 100 collections</li>
          <li>Maximum nesting depth of 10</li>
        </ul>

        <h3 className="text-sm font-semibold mb-2">Request Constraints</h3>
        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
          <li>Maximum request body size: 1 MB</li>
        </ul>
      </section>

      {/* Supported Languages */}
      <section id="supported-languages" className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Supported Languages</h2>
        <p className="text-sm text-muted-foreground mb-3">
          The{" "}
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
            language
          </code>{" "}
          parameter controls the locale used for generating names, addresses, and
          other fake data.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2 border-b border-border font-medium">
                  Code
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Language
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["en", "English"],
                ["es", "Spanish"],
                ["de", "German"],
                ["fr", "French"],
                ["it", "Italian"],
                ["pt", "Portuguese"],
                ["ru", "Russian"],
                ["ja", "Japanese"],
                ["zh", "Chinese"],
              ].map(([code, name]) => (
                <tr key={code}>
                  <td className="p-2 border-b border-border font-mono text-xs">
                    {code}
                  </td>
                  <td className="p-2 border-b border-border text-xs">{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Examples</h2>

        <h3 className="text-sm font-semibold mb-2">
          Basic Bitwarden vault
        </h3>
        <pre className="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto mb-4">
{`curl -X POST /api/vault/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "format": "bitwarden",
    "loginCount": 100,
    "secureNoteCount": 10,
    "creditCardCount": 5,
    "identityCount": 5
  }'`}
        </pre>

        <h3 className="text-sm font-semibold mb-2">
          LastPass CSV export
        </h3>
        <pre className="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto mb-4">
{`curl -X POST /api/vault/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "format": "lastpass",
    "loginCount": 200,
    "useRealUrls": true
  }' -o lastpass_export.csv`}
        </pre>

        <h3 className="text-sm font-semibold mb-2">
          KeePass2 export with bad data injection
        </h3>
        <pre className="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto mb-4">
{`curl -X POST /api/vault/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "format": "keepass2",
    "loginCount": 50,
    "useMrBlobby": true,
    "mrBlobbyPercentage": 30
  }' -o keepass2_export.xml`}
        </pre>

        <h3 className="text-sm font-semibold mb-2">
          Bitwarden org vault with nested collections
        </h3>
        <pre className="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto">
{`curl -X POST /api/vault/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "format": "bitwarden",
    "vaultType": "org",
    "loginCount": 500,
    "secureNoteCount": 50,
    "useCollections": true,
    "useNestedCollections": true,
    "topLevelCollectionCount": 5,
    "collectionNestingDepth": 3,
    "totalCollectionCount": 30,
    "distributeItems": true,
    "useWeakPasswords": true,
    "weakPasswordPercentage": 15,
    "reusePasswords": true,
    "passwordReusePercentage": 25,
    "language": "de"
  }'`}
        </pre>
      </section>

      {/* Error Handling */}
      <section id="error-handling" className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Error Handling</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Errors are returned as JSON with an{" "}
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
            error
          </code>{" "}
          field:
        </p>
        <pre className="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto mb-4">
{`{
  "error": "Description of what went wrong"
}`}
        </pre>

        <h3 className="text-sm font-semibold mb-2">HTTP Status Codes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2 border-b border-border font-medium">
                  Status
                </th>
                <th className="text-left p-2 border-b border-border font-medium">
                  Meaning
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  200
                </td>
                <td className="p-2 border-b border-border text-xs">
                  Success &ndash; vault data returned
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  400
                </td>
                <td className="p-2 border-b border-border text-xs">
                  Validation error &ndash; invalid parameters, unsupported
                  format, or constraint violation
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  429
                </td>
                <td className="p-2 border-b border-border text-xs">
                  Rate limit exceeded &ndash; wait and retry
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border font-mono text-xs">
                  500
                </td>
                <td className="p-2 border-b border-border text-xs">
                  Internal server error &ndash; unexpected failure during
                  generation
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
