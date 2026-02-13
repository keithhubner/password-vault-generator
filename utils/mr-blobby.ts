import type { VaultFormat } from '../types'
import type { KeePass2File, KeePass2Group, KeePass2Entry } from '../types/keepass2'

// ─── Bad Data Payloads ───────────────────────────────────────────────

export const BAD_URLS = [
  '',
  'not-a-url',
  'ftp://old-protocol.test',
  'https://' + 'a'.repeat(2048) + '.com',
  'https://emoji-\uD83D\uDE00-domain.test',
  'https://xn--n3h.test/../../../etc/passwd',
  'javascript:alert(1)',
  'https://user:pass@host.test',
  'https://[::1]:8080/internal',
  'https://host.test/path?q=' + encodeURIComponent('<script>'),
]

export const UNICODE_PAYLOADS = [
  '\u0000secret',
  '\u200B\u200B\u200B',
  '\u202Eegnaro',
  '\uFEFF\uFEFFBOM BOM',
  '\u0001\u0002\u0003\u0004',
  'T\u00EBst\u0308 \u00DCn\u00EFc\u00F6d\u00EB',
  'a\u0300\u0301\u0302\u0303\u0304\u0305',
  '\u200F\u200E\u0645\u0631\u062D\u0628\u0627 RTL Mix',
  '\u8868\u30DD\u3042A\u946E\u0020\u0009\u30FC',
]

export const SPECIAL_PASSWORD_PAYLOADS = [
  "' OR '1'='1",
  '<script>alert(1)</script>',
  '"; DROP TABLE users; --',
  '${7*7}',
  '../../../etc/passwd',
  'pass\x00word',
  '{{constructor.constructor("return this")()}}',
  '<img src=x onerror=alert(1)>',
  'AAAA%08x.%08x.%08x.%08x',
  'pass\nword\nnewlines',
]

export const OVERSIZED_NOTES = 'A'.repeat(12000)
export const OVERSIZED_PASSWORD = 'P'.repeat(1200)
export const OVERSIZED_TITLE = 'T'.repeat(10000)
export const OVERSIZED_USERNAME = 'U'.repeat(10000)

const CSV_COMMA_PAYLOADS = [
  'field, with, commas',
  'value "with" quotes, and commas',
  'line1\nline2\nline3',
]

const SEMICOLON_PAYLOADS = [
  'field;with;semicolons',
  'note; important; data; more',
]

const XML_ENTITY_PAYLOADS = [
  'value with <angle> brackets',
  'AT&T & O\'Reilly',
  'CDATA break: ]]> more data',
  '<![CDATA[nested]]>CDATA',
  '<?xml version="1.0"?><fake>element</fake>',
]

// ─── Helpers ─────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function selectRandomIndices(length: number, count: number): Set<number> {
  const indices = new Set<number>()
  const target = Math.min(count, length)
  while (indices.size < target) {
    indices.add(Math.floor(Math.random() * length))
  }
  return indices
}

// ─── Data-Level Corruption (item objects) ────────────────────────────

type CorruptionFn = (item: Record<string, unknown>) => Record<string, unknown>

interface FieldMapping {
  url: string
  username: string
  password: string
  title: string
  notes: string
}

function getFieldMapping(format: VaultFormat): FieldMapping {
  switch (format) {
    case 'lastpass':
      return { url: 'url', username: 'username', password: 'password', title: 'name', notes: 'extra' }
    case 'edge':
      return { url: 'url', username: 'username', password: 'password', title: 'name', notes: 'note' }
    case 'keepassx':
      return { url: 'url', username: 'username', password: 'password', title: 'title', notes: 'notes' }
    case 'keeper':
      return { url: 'login_url', username: 'login', password: 'password', title: 'title', notes: 'notes' }
    case 'password-depot':
      return { url: 'url', username: 'userName', password: 'password', title: 'description', notes: 'comments' }
    default:
      return { url: 'url', username: 'username', password: 'password', title: 'name', notes: 'notes' }
  }
}

function buildDataCorruptions(fields: FieldMapping): CorruptionFn[] {
  return [
    // Bad URL
    (item) => ({ ...item, [fields.url]: pickRandom(BAD_URLS) }),
    // Unicode in title
    (item) => ({ ...item, [fields.title]: pickRandom(UNICODE_PAYLOADS) }),
    // Unicode in username
    (item) => ({ ...item, [fields.username]: pickRandom(UNICODE_PAYLOADS) }),
    // Empty required fields
    (item) => ({ ...item, [fields.username]: '', [fields.password]: '' }),
    // Oversized notes
    (item) => ({ ...item, [fields.notes]: OVERSIZED_NOTES }),
    // Oversized title
    (item) => ({ ...item, [fields.title]: OVERSIZED_TITLE }),
    // Oversized username
    (item) => ({ ...item, [fields.username]: OVERSIZED_USERNAME }),
    // Oversized password
    (item) => ({ ...item, [fields.password]: OVERSIZED_PASSWORD }),
    // Injection payload in password
    (item) => ({ ...item, [fields.password]: pickRandom(SPECIAL_PASSWORD_PAYLOADS) }),
    // Injection payload in notes
    (item) => ({ ...item, [fields.notes]: pickRandom(SPECIAL_PASSWORD_PAYLOADS) }),
  ]
}

/**
 * Apply data-level Mr Blobby corruption to a flat array of items.
 * Works for all formats except KeePass2 (use applyMrBlobbyToKeePass2 for that).
 */
export function applyMrBlobbyToItems<T>(
  items: T[],
  percentage: number,
  format: VaultFormat
): T[] {
  if (items.length === 0) return items

  const corruptCount = Math.max(1, Math.ceil(items.length * (percentage / 100)))
  const indices = selectRandomIndices(items.length, corruptCount)

  // Special handling for Bitwarden (union type items)
  if (format === 'bitwarden') {
    return items.map((item, index) => {
      if (!indices.has(index)) return item
      return corruptBitwardenItem(item as Record<string, unknown>) as T
    })
  }

  const fields = getFieldMapping(format)
  const corruptions = buildDataCorruptions(fields)

  // Add duplicate corruption (clone a random earlier item)
  const result = [...items]
  const indexArray = Array.from(indices)

  for (const idx of indexArray) {
    const item = result[idx] as Record<string, unknown>
    // 15% chance: duplicate an earlier item instead of corrupting
    if (idx > 0 && Math.random() < 0.15) {
      const sourceIdx = Math.floor(Math.random() * idx)
      result[idx] = { ...result[sourceIdx] } as T
    } else {
      const numCorruptions = Math.random() > 0.7 ? 2 : 1
      let corrupted = { ...item }
      for (let i = 0; i < numCorruptions; i++) {
        corrupted = pickRandom(corruptions)(corrupted)
      }
      result[idx] = corrupted as T
    }
  }

  return result
}

// Bitwarden items need special handling due to the union type structure
function corruptBitwardenItem(item: Record<string, unknown>): Record<string, unknown> {
  const corrupted = { ...item }
  const type = corrupted.type as number

  switch (type) {
    case 1: { // Login
      const login = { ...(corrupted.login as Record<string, unknown>) }
      const corruption = Math.floor(Math.random() * 5)
      switch (corruption) {
        case 0: // Bad URL
          login.uris = [{ match: null, uri: pickRandom(BAD_URLS) }]
          break
        case 1: // Injection in password
          login.password = pickRandom(SPECIAL_PASSWORD_PAYLOADS)
          break
        case 2: // Unicode in username
          login.username = pickRandom(UNICODE_PAYLOADS)
          break
        case 3: // Empty fields
          login.username = ''
          login.password = ''
          break
        case 4: // Oversized password
          login.password = OVERSIZED_PASSWORD
          break
      }
      corrupted.login = login
      // Also corrupt notes sometimes
      if (Math.random() > 0.5) {
        corrupted.notes = OVERSIZED_NOTES
      }
      break
    }
    case 2: // Secure Note
      corrupted.notes = OVERSIZED_NOTES
      corrupted.name = pickRandom(UNICODE_PAYLOADS)
      break
    case 3: { // Credit Card
      const card = { ...(corrupted.card as Record<string, unknown>) }
      const cardCorruption = Math.floor(Math.random() * 3)
      switch (cardCorruption) {
        case 0:
          card.number = pickRandom(SPECIAL_PASSWORD_PAYLOADS)
          break
        case 1:
          card.cardholderName = pickRandom(UNICODE_PAYLOADS)
          break
        case 2:
          card.expMonth = 'not-a-month'
          card.expYear = 'never'
          break
      }
      corrupted.card = card
      break
    }
    case 4: { // Identity
      const identity = { ...(corrupted.identity as Record<string, unknown>) }
      identity.firstName = pickRandom(UNICODE_PAYLOADS)
      identity.lastName = pickRandom(UNICODE_PAYLOADS)
      identity.ssn = pickRandom(SPECIAL_PASSWORD_PAYLOADS)
      identity.email = 'not-an-email'
      corrupted.identity = identity
      break
    }
  }

  return corrupted
}

/**
 * Apply data-level Mr Blobby corruption to a KeePass2 file (tree structure).
 */
export function applyMrBlobbyToKeePass2(file: KeePass2File, percentage: number): KeePass2File {
  const result: KeePass2File = {
    ...file,
    Root: {
      ...file.Root,
      Group: corruptKeePass2Group(file.Root.Group, percentage),
    },
  }
  return result
}

function corruptKeePass2Group(group: KeePass2Group, percentage: number): KeePass2Group {
  const result: KeePass2Group = { ...group }

  if (result.Entries && result.Entries.length > 0) {
    const corruptCount = Math.max(1, Math.ceil(result.Entries.length * (percentage / 100)))
    const indices = selectRandomIndices(result.Entries.length, corruptCount)
    result.Entries = result.Entries.map((entry, idx) =>
      indices.has(idx) ? corruptKeePass2Entry(entry) : entry
    )
  }

  if (result.Groups && result.Groups.length > 0) {
    result.Groups = result.Groups.map((g) => corruptKeePass2Group(g, percentage))
  }

  return result
}

function corruptKeePass2Entry(entry: KeePass2Entry): KeePass2Entry {
  const result: KeePass2Entry = {
    ...entry,
    Strings: entry.Strings.map((s) => ({ ...s })),
  }

  const corruption = Math.floor(Math.random() * 5)
  for (const str of result.Strings) {
    switch (corruption) {
      case 0: // Bad URL
        if (str.Key === 'URL') str.Value = pickRandom(BAD_URLS)
        break
      case 1: // Unicode in title
        if (str.Key === 'Title') str.Value = pickRandom(UNICODE_PAYLOADS)
        break
      case 2: // Oversized notes
        if (str.Key === 'Notes') str.Value = OVERSIZED_NOTES
        break
      case 3: // Injection in password
        if (str.Key === 'Password') str.Value = pickRandom(SPECIAL_PASSWORD_PAYLOADS)
        break
      case 4: // Empty fields
        if (str.Key === 'UserName') str.Value = ''
        if (str.Key === 'Password') str.Value = ''
        break
    }
  }

  return result
}

// ─── String-Level Corruption (formatted output) ─────────────────────

/**
 * Apply string-level corruption to the final formatted output.
 * Injects format-specific structural breaks (unescaped delimiters, broken XML, etc).
 */
export function applyMrBlobbyToOutput(
  output: string,
  percentage: number,
  format: VaultFormat
): string {
  switch (format) {
    case 'lastpass':
      return corruptBareCSV(output, percentage)
    case 'edge':
    case 'keepassx':
    case 'keeper':
      return corruptQuotedCSV(output, percentage)
    case 'password-depot':
      return corruptSemicolonCSV(output, percentage)
    case 'keepass2':
      return corruptXML(output, percentage)
    case 'bitwarden':
      // JSON corruption is handled at the data level (oversized fields)
      return output
    default:
      return output
  }
}

/**
 * Corrupt bare CSV (LastPass) — inject unescaped commas and newlines into field values.
 */
function corruptBareCSV(csv: string, percentage: number): string {
  const lines = csv.split('\n')
  if (lines.length <= 1) return csv

  const header = lines[0]
  const dataLines = lines.slice(1).filter((l) => l.length > 0)
  const corruptCount = Math.max(1, Math.ceil(dataLines.length * (percentage / 100)))
  const indices = selectRandomIndices(dataLines.length, corruptCount)

  const corrupted = dataLines.map((line, idx) => {
    if (!indices.has(idx)) return line
    const payload = pickRandom(CSV_COMMA_PAYLOADS)
    // Replace a field value by inserting payload at a random comma boundary
    const commaPositions: number[] = []
    for (let i = 0; i < line.length; i++) {
      if (line[i] === ',') commaPositions.push(i)
    }
    if (commaPositions.length < 2) return line
    const insertAt = pickRandom(commaPositions)
    return line.slice(0, insertAt + 1) + payload + line.slice(insertAt + 1)
  })

  return [header, ...corrupted].join('\n')
}

/**
 * Corrupt quoted CSV (Edge, KeePassX, Keeper) — inject unescaped quotes and newlines.
 */
function corruptQuotedCSV(csv: string, percentage: number): string {
  const lines = csv.split('\n')
  if (lines.length <= 1) return csv

  const header = lines[0]
  const dataLines = lines.slice(1).filter((l) => l.length > 0)
  const corruptCount = Math.max(1, Math.ceil(dataLines.length * (percentage / 100)))
  const indices = selectRandomIndices(dataLines.length, corruptCount)

  const payloads = [
    'He said "hello"',
    'value\nwith\nnewlines',
    'quote"in"middle',
    'comma,and"quote',
  ]

  const corrupted = dataLines.map((line, idx) => {
    if (!indices.has(idx)) return line
    const payload = pickRandom(payloads)
    // Find a quoted field and replace its content
    return line.replace(/"[^"]*"/, `"${payload}"`)
  })

  return [header, ...corrupted].join('\n')
}

/**
 * Corrupt semicolon-delimited CSV (Password Depot) — inject semicolons into values.
 */
function corruptSemicolonCSV(csv: string, percentage: number): string {
  const lines = csv.split('\n')
  if (lines.length <= 1) return csv

  const header = lines[0]
  const dataLines = lines.slice(1).filter((l) => l.length > 0)
  const corruptCount = Math.max(1, Math.ceil(dataLines.length * (percentage / 100)))
  const indices = selectRandomIndices(dataLines.length, corruptCount)

  const corrupted = dataLines.map((line, idx) => {
    if (!indices.has(idx)) return line
    const payload = pickRandom(SEMICOLON_PAYLOADS)
    // Replace first field value by inserting payload
    const semicolonPos = line.indexOf(';')
    if (semicolonPos < 0) return line
    return payload + line.slice(semicolonPos)
  })

  return [header, ...corrupted].join('\n')
}

/**
 * Corrupt XML (KeePass2) — inject unescaped entities into Value elements.
 */
function corruptXML(xml: string, percentage: number): string {
  const valueRegex = /<Value(?:\s[^>]*)?>([^<]*)<\/Value>/g
  const matches: { index: number; length: number }[] = []

  let match: RegExpExecArray | null
  while ((match = valueRegex.exec(xml)) !== null) {
    matches.push({ index: match.index, length: match[0].length })
  }

  if (matches.length === 0) return xml

  const corruptCount = Math.max(1, Math.ceil(matches.length * (percentage / 100)))
  const indices = selectRandomIndices(matches.length, corruptCount)

  // Process from end to start to preserve indices
  let result = xml
  const matchArray = [...matches].reverse()
  const indexArray = Array.from(indices)

  for (let i = matchArray.length - 1; i >= 0; i--) {
    const originalIdx = matches.length - 1 - i
    if (!indexArray.includes(originalIdx)) continue
    const m = matchArray[i]
    const payload = pickRandom(XML_ENTITY_PAYLOADS)
    const original = result.slice(m.index, m.index + m.length)
    // Preserve the tag structure but replace content with unescaped payload
    const corrupted = original.replace(/>([^<]*)</, `>${payload}<`)
    result = result.slice(0, m.index) + corrupted + result.slice(m.index + m.length)
  }

  return result
}
