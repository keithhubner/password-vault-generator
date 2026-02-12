import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { changelog } from "@/data/changelog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Changelog - Password Vault Generator",
  description: "Version history and changelog for Password Vault Generator",
}

const typeBadgeStyles: Record<string, string> = {
  added: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  changed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  fixed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  removed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export default function ChangelogPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center space-x-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        <span>Back to generator</span>
      </Link>

      <h1 className="text-2xl font-bold mb-8">Changelog</h1>

      <div className="space-y-10">
        {changelog.map((entry) => (
          <section key={entry.version}>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-lg font-semibold">v{entry.version}</h2>
              <time className="text-sm text-muted-foreground">{entry.date}</time>
            </div>
            <ul className="space-y-2">
              {entry.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span
                    className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-2xs font-medium capitalize ${typeBadgeStyles[change.type]}`}
                  >
                    {change.type}
                  </span>
                  <span>{change.description}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
