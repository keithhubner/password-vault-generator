import { faker } from "@faker-js/faker"
import { KeePass2File, KeePass2Times, KeePass2Entry, KeePass2Group, KeePass2String } from "../types"
import { generatePassword } from "../utils/password-generators"
import { popularWebsites, enterpriseWebsites } from "../utils/constants"

const generateKeePass2UUID = (): string => {
  const bytes = new Uint8Array(16)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(Math.random() * 256)
  }
  return btoa(String.fromCharCode.apply(null, Array.from(bytes)))
}

const generateKeePass2Timestamp = (date?: Date): string => {
  const d = date || new Date()
  return d.toISOString().replace(/\.\d+Z$/, "Z")
}

const generateKeePass2Times = (): KeePass2Times => {
  const now = new Date()
  const creationTime = now
  const lastAccessTime = now
  const expiryTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  return {
    LastModificationTime: generateKeePass2Timestamp(now),
    CreationTime: generateKeePass2Timestamp(creationTime),
    LastAccessTime: generateKeePass2Timestamp(lastAccessTime),
    ExpiryTime: generateKeePass2Timestamp(expiryTime),
    Expires: false,
    UsageCount: 0,
    LocationChanged: generateKeePass2Timestamp(now),
  }
}

const createKeePass2Entry = (
  useRealUrls: boolean,
  useEnterpriseUrls: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[],
  customEnterpriseUrls?: string[]
): KeePass2Entry => {
  let website: string
  if (useRealUrls) {
    if (useEnterpriseUrls) {
      const urlList = customEnterpriseUrls && customEnterpriseUrls.length > 0
        ? customEnterpriseUrls
        : enterpriseWebsites
      website = faker.helpers.arrayElement(urlList)
    } else {
      website = faker.helpers.arrayElement(popularWebsites)
    }
  } else {
    website = faker.internet.domainName()
  }

  const password = generatePassword(
    useWeakPasswords,
    weakPasswordPercentage,
    reusePasswords,
    passwordReusePercentage,
    passwordPool
  )

  const strings: KeePass2String[] = [
    { Key: "Notes", Value: faker.lorem.sentence() },
    { Key: "Password", Value: password, ProtectInMemory: true },
    { Key: "Title", Value: website + " Login" },
    { Key: "URL", Value: `https://www.${website}` },
    { Key: "UserName", Value: faker.internet.username() },
  ]

  return {
    UUID: generateKeePass2UUID(),
    IconID: 0,
    ForegroundColor: "",
    BackgroundColor: "",
    OverrideURL: "",
    Tags: "",
    Times: generateKeePass2Times(),
    Strings: strings,
    AutoType: {
      Enabled: true,
      DataTransferObfuscation: 0,
      Association: [
        {
          Window: "Target Window",
          KeystrokeSequence: "{USERNAME}{TAB}{PASSWORD}{TAB}{ENTER}",
        },
      ],
    },
  }
}

const createKeePass2Groups = (
  loginCount: number,
  useRealUrls: boolean,
  useEnterpriseUrls: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[],
  customEnterpriseUrls?: string[]
): KeePass2Group => {
  const mainGroup: KeePass2Group = {
    UUID: generateKeePass2UUID(),
    Name: "Database",
    Notes: "",
    IconID: 49,
    Times: generateKeePass2Times(),
    IsExpanded: true,
    DefaultAutoTypeSequence: "",
    EnableAutoType: "Null",
    EnableSearching: "Null",
    LastTopVisibleEntry: "AAAAAAAAAAAAAAAAAAAAAA==",
    Entries: [],
    Groups: [],
  }

  const subgroups = [
    { name: "General", notes: "", iconId: 48 },
    { name: "Windows", notes: "", iconId: 38 },
    { name: "Network", notes: "", iconId: 3 },
    { name: "Internet", notes: "", iconId: 1 },
    { name: "eMail", notes: "", iconId: 19 },
    { name: "Homebanking", notes: "", iconId: 37 },
  ]

  mainGroup.Groups = subgroups.map((group) => ({
    UUID: generateKeePass2UUID(),
    Name: group.name,
    Notes: group.notes,
    IconID: group.iconId,
    Times: generateKeePass2Times(),
    IsExpanded: true,
    DefaultAutoTypeSequence: "",
    EnableAutoType: "Null",
    EnableSearching: "Null",
    LastTopVisibleEntry: "AAAAAAAAAAAAAAAAAAAAAA==",
    Entries: [],
    Groups: [],
  }))

  let remainingEntries = loginCount
  const rootEntries = Math.min(remainingEntries, Math.max(8, Math.floor(loginCount * 0.3)))

  for (let i = 0; i < rootEntries; i++) {
    mainGroup.Entries.push(
      createKeePass2Entry(useRealUrls, useEnterpriseUrls, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool, customEnterpriseUrls)
    )
  }
  remainingEntries -= rootEntries

  const entriesPerGroup = Math.max(1, Math.floor(remainingEntries / mainGroup.Groups.length))
  for (const group of mainGroup.Groups) {
    const groupEntries = Math.min(remainingEntries, entriesPerGroup)
    for (let i = 0; i < groupEntries; i++) {
      group.Entries.push(
        createKeePass2Entry(useRealUrls, useEnterpriseUrls, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool, customEnterpriseUrls)
      )
    }
    remainingEntries -= groupEntries
  }

  while (remainingEntries > 0) {
    const targetGroup = faker.helpers.arrayElement([...mainGroup.Groups])
    targetGroup.Entries.push(
      createKeePass2Entry(useRealUrls, useEnterpriseUrls, useWeakPasswords, weakPasswordPercentage, reusePasswords, passwordReusePercentage, passwordPool, customEnterpriseUrls)
    )
    remainingEntries--
  }

  return mainGroup
}

export const createKeePass2File = (
  loginCount: number,
  useRealUrls: boolean,
  useEnterpriseUrls: boolean,
  useWeakPasswords: boolean,
  weakPasswordPercentage: number,
  reusePasswords: boolean,
  passwordReusePercentage: number,
  passwordPool: string[],
  customEnterpriseUrls?: string[]
): KeePass2File => {
  const now = generateKeePass2Timestamp()

  return {
    Meta: {
      Generator: "KeePass",
      SettingsChanged: now,
      DatabaseName: "Generated Password Vault",
      DatabaseNameChanged: now,
      DatabaseDescription: "",
      DatabaseDescriptionChanged: now,
      DefaultUserName: "",
      DefaultUserNameChanged: now,
      MaintenanceHistoryDays: 365,
      Color: "",
      MasterKeyChanged: now,
      MasterKeyChangeRec: -1,
      MasterKeyChangeForce: -1,
      MemoryProtection: {
        ProtectTitle: false,
        ProtectUserName: false,
        ProtectPassword: true,
        ProtectURL: false,
        ProtectNotes: false,
      },
      RecycleBinEnabled: true,
      RecycleBinUUID: "AAAAAAAAAAAAAAAAAAAAAA==",
      RecycleBinChanged: now,
      EntryTemplatesGroup: "AAAAAAAAAAAAAAAAAAAAAA==",
      EntryTemplatesGroupChanged: now,
      HistoryMaxItems: 10,
      HistoryMaxSize: 6291456,
      LastSelectedGroup: "AAAAAAAAAAAAAAAAAAAAAA==",
      LastTopVisibleGroup: "AAAAAAAAAAAAAAAAAAAAAA==",
    },
    Root: {
      Group: createKeePass2Groups(
        loginCount,
        useRealUrls,
        useEnterpriseUrls,
        useWeakPasswords,
        weakPasswordPercentage,
        reusePasswords,
        passwordReusePercentage,
        passwordPool,
        customEnterpriseUrls
      ),
      DeletedObjects: { DeletedObject: [] },
    },
  }
}

export const convertKeePass2ToXML = (keepass: KeePass2File): string => {
  const timesToXML = (times: KeePass2Times, indent: string): string => {
    return `${indent}<Times>
${indent}\t<CreationTime>${times.CreationTime}</CreationTime>
${indent}\t<LastModificationTime>${times.LastModificationTime}</LastModificationTime>
${indent}\t<LastAccessTime>${times.LastAccessTime}</LastAccessTime>
${indent}\t<ExpiryTime>${times.ExpiryTime}</ExpiryTime>
${indent}\t<Expires>False</Expires>
${indent}\t<UsageCount>0</UsageCount>
${indent}\t<LocationChanged>${times.LocationChanged}</LocationChanged>
${indent}</Times>`
  }

  const stringToXML = (str: KeePass2String, indent: string): string => {
    if (str.ProtectInMemory) {
      return `${indent}<String>
${indent}\t<Key>${str.Key}</Key>
${indent}\t<Value ProtectInMemory="True">${str.Value}</Value>
${indent}</String>`
    } else {
      return `${indent}<String>
${indent}\t<Key>${str.Key}</Key>
${indent}\t<Value>${str.Value}</Value>
${indent}</String>`
    }
  }

  const autoTypeToXML = (entry: KeePass2Entry, indent: string): string => {
    return `${indent}<AutoType>
${indent}\t<Enabled>True</Enabled>
${indent}\t<DataTransferObfuscation>0</DataTransferObfuscation>
${indent}\t<Association>
${indent}\t\t<Window>Target Window</Window>
${indent}\t\t<KeystrokeSequence>${entry.AutoType?.Association?.[0]?.KeystrokeSequence || "{USERNAME}{TAB}{PASSWORD}{TAB}{ENTER}"}</KeystrokeSequence>
${indent}\t</Association>
${indent}</AutoType>
${indent}<History />`
  }

  const entryToXML = (entry: KeePass2Entry, indent: string): string => {
    return `${indent}<Entry>
${indent}\t<UUID>${entry.UUID}</UUID>
${indent}\t<IconID>${entry.IconID}</IconID>
${indent}\t<ForegroundColor></ForegroundColor>
${indent}\t<BackgroundColor></BackgroundColor>
${indent}\t<OverrideURL></OverrideURL>
${indent}\t<Tags></Tags>
${timesToXML(entry.Times, indent + "\t")}
${entry.Strings.map((str) => stringToXML(str, indent + "\t")).join("\n")}
${autoTypeToXML(entry, indent + "\t")}
${indent}</Entry>`
  }

  const groupToXML = (group: KeePass2Group, indent: string): string => {
    let result = `${indent}<Group>
${indent}\t<UUID>${group.UUID}</UUID>
${indent}\t<Name>${group.Name}</Name>
${indent}\t<Notes></Notes>
${indent}\t<IconID>${group.IconID}</IconID>
${timesToXML(group.Times, indent + "\t")}
${indent}\t<IsExpanded>True</IsExpanded>
${indent}\t<DefaultAutoTypeSequence></DefaultAutoTypeSequence>
${indent}\t<EnableAutoType>Null</EnableAutoType>
${indent}\t<EnableSearching>Null</EnableSearching>
${indent}\t<LastTopVisibleEntry>AAAAAAAAAAAAAAAAAAAAAA==</LastTopVisibleEntry>`

    if (group.Entries && group.Entries.length > 0) {
      for (const entry of group.Entries) {
        result += "\n" + entryToXML(entry, indent + "\t")
      }
    }

    if (group.Groups && group.Groups.length > 0) {
      for (const subgroup of group.Groups) {
        result += "\n" + groupToXML(subgroup, indent + "\t")
      }
    }

    result += `\n${indent}</Group>`
    return result
  }

  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<KeePassFile>
\t<Meta>
\t\t<Generator>KeePass</Generator>
\t\t<SettingsChanged>${generateKeePass2Timestamp()}</SettingsChanged>
\t\t<DatabaseName>${keepass.Meta.DatabaseName}</DatabaseName>
\t\t<DatabaseNameChanged>${keepass.Meta.DatabaseNameChanged}</DatabaseNameChanged>
\t\t<DatabaseDescription></DatabaseDescription>
\t\t<DatabaseDescriptionChanged>${generateKeePass2Timestamp()}</DatabaseDescriptionChanged>
\t\t<DefaultUserName></DefaultUserName>
\t\t<DefaultUserNameChanged>${generateKeePass2Timestamp()}</DefaultUserNameChanged>
\t\t<MaintenanceHistoryDays>365</MaintenanceHistoryDays>
\t\t<Color></Color>
\t\t<MasterKeyChanged>${generateKeePass2Timestamp()}</MasterKeyChanged>
\t\t<MasterKeyChangeRec>-1</MasterKeyChangeRec>
\t\t<MasterKeyChangeForce>-1</MasterKeyChangeForce>
\t\t<MemoryProtection>
\t\t\t<ProtectTitle>False</ProtectTitle>
\t\t\t<ProtectUserName>False</ProtectUserName>
\t\t\t<ProtectPassword>True</ProtectPassword>
\t\t\t<ProtectURL>False</ProtectURL>
\t\t\t<ProtectNotes>False</ProtectNotes>
\t\t</MemoryProtection>
\t\t<RecycleBinEnabled>True</RecycleBinEnabled>
\t\t<RecycleBinUUID>AAAAAAAAAAAAAAAAAAAAAA==</RecycleBinUUID>
\t\t<RecycleBinChanged>${generateKeePass2Timestamp()}</RecycleBinChanged>
\t\t<EntryTemplatesGroup>AAAAAAAAAAAAAAAAAAAAAA==</EntryTemplatesGroup>
\t\t<EntryTemplatesGroupChanged>${generateKeePass2Timestamp()}</EntryTemplatesGroupChanged>
\t\t<HistoryMaxItems>10</HistoryMaxItems>
\t\t<HistoryMaxSize>6291456</HistoryMaxSize>
\t\t<LastSelectedGroup>AAAAAAAAAAAAAAAAAAAAAA==</LastSelectedGroup>
\t\t<LastTopVisibleGroup>AAAAAAAAAAAAAAAAAAAAAA==</LastTopVisibleGroup>
\t\t<Binaries />
\t\t<CustomData />
\t</Meta>
\t<Root>
${groupToXML(keepass.Root.Group, "\t\t")}
\t\t<DeletedObjects></DeletedObjects>
\t</Root>
</KeePassFile>`
}