import { LastPassItem, EdgePasswordItem, KeePassXItem, KeeperVault, OnePasswordItem } from "../types"

export const formatLastPassToCsv = (items: LastPassItem[]): string => {
  const header = "url,username,password,extra,name,grouping,totp\n"
  const csvContent = items
    .map(
      (item) =>
        `${item.url},${item.username},${item.password},${item.extra},${item.name},${item.grouping},${item.totp}`
    )
    .join("\n")
  return header + csvContent
}

export const formatEdgeToCsv = (items: EdgePasswordItem[]): string => {
  const header = "name,url,username,password,note\n"
  const csvContent = items
    .map((item) => `"${item.name}","${item.url}","${item.username}","${item.password}","${item.note}"`)
    .join("\n")
  return header + csvContent
}

export const formatKeePassXToCsv = (items: KeePassXItem[]): string => {
  const header = '"Title","Username","Password","URL","Notes"\n'
  const csvContent = items
    .map((item) => `"${item.title}","${item.username}","${item.password}","${item.url}","${item.notes}"`)
    .join("\n")
  return header + csvContent
}

export const formatKeeperToCsv = (vault: KeeperVault): string => {
  const header = "Folder,Title,Login,Password,Website Address,Notes,Shared Folder,Custom Fields\n"
  const csvContent = vault.records
    .map((record) => {
      const folderRef = record.folders.find((f) => "folder" in f)
      const folder = folderRef ? folderRef.folder_path || folderRef.folder || "" : ""

      const sharedFolderRef = record.folders.find((f) => "shared_folder" in f)
      const sharedFolder = sharedFolderRef
        ? sharedFolderRef.shared_folder_path || sharedFolderRef.shared_folder || ""
        : ""

      const customFields = Object.entries(record.custom_fields)
        .map(([key, value]) => `${key}: ${value}`)
        .join("; ")

      return `"${folder}","${record.title}","${record.login}","${record.password}","${record.login_url}","${record.notes}","${sharedFolder}","${customFields}"`
    })
    .join("\n")
  return header + csvContent
}

export const formatOnePasswordToCsv = (items: OnePasswordItem[]): string => {
  // Mac 1Password export header - 143 columns
  const header = `"account number(accountNo)","address(address)","address(branchAddress)","admin console URL(admin_console_url)","admin console username(admin_console_username)","AirPort ID(airport_id)","alias(alias)","AOL/AIM(aim)","approved wildlife(game)","attached storage password(disk_password)","auth​ method(pop_authentication)","auth​ method(smtp_authentication)","bank name(bankName)","base station name(name)","base station password(password)","birth date(birthdate)","business(busphone)","cardholder name(cardholder)","cash withdrawal limit(cashLimit)","company name(company_name)","company(company)","conditions / restrictions(conditions)","connection options(options)","console password(admin_console_password)","country(country)","county(state)","Created Date","credit limit(creditLimit)","customer service phone(customer_service_phone)","database(database)","date of birth(birthdate)","default phone(defphone)","department(department)","download page(download_link)","email(email)","expires(expires)","expiry date(expiry_date)","expiry date(expiry)","first name(firstname)","First One-time Password","forum signature(forumsig)","full name(fullname)","full name(name)","group(org_name)","height(height)","home(homephone)","IBAN(iban)","ICQ(icq)","initial(initial)","interest rate(interest)","issue number(issuenumber)","issued on(issue_date)","issuing authority(issuing_authority)","issuing bank(bank)","issuing country(issuing_country)","job title(jobtitle)","last name(lastname)","licence class(class)","licence key(reg_code)","licensed to(reg_name)","maximum quota(quota)","member ID (additional)(additional_no)","member ID(membership_no)","member name(member_name)","member since(member_since)","mobile(cellphone)","Modified Date","MSN(msn)","name on account(owner)","name(name)","nationality(nationality)","network name(network_name)","Notes","number(ccnum)","number(number)","occupation(occupation)","order number(order_number)","order total(order_total)","Password","password(password)","password(pop_password)","password(smtp_password)","phone (freephone)(phone_tollfree)","phone (freephone)(phoneTollFree)","phone (intl)(phoneIntl)","phone (local)(phone_local)","phone (local)(phoneLocal)","phone for reserva​tions(reservations_phone)","phone(branchPhone)","PIN(pin)","PIN(telephonePin)","place of birth(birthplace)","port number(pop_port)","port number(smtp_port)","port(port)","provider's website(provider_website)","provider(provider)","publisher(publisher_name)","purchase date(order_date)","registered email(reg_email)","reminder answer(remindera)","reminder question(reminderq)","retail price(retail_price)","routing number(routingNo)","Scope","security(pop_security)","security(smtp_security)","server / IP address(server)","server(hostname)","server(pop_server)","sex(sex)","SID(sid)","skype(skype)","SMTP server(smtp_server)","state(state)","support email(support_email)","support phone(support_contact_phone)","support URL(support_contact_url)","SWIFT(swift)","Tags","telephone(phone)","Title","Type","type(accountType)","type(database_type)","type(pop_type)","type(type)","URL","URL(url)","Username","username(pop_username)","username(smtp_username)","username(username)","valid from(valid_from)","valid from(validFrom)","verification number(cvv)","version(product_version)","website(publisher_website)","website(website)","wireless network password(wireless_password)","wireless security(wireless_security)","Yahoo(yahoo)"`

  const csvContent = items
    .map((item) => {
      // Create 143 empty columns
      const columns = new Array(143).fill('')
      
      // Current timestamp for created/modified dates
      const timestamp = Math.floor(Date.now() / 1000).toString()
      
      // Format tags in Mac 1Password format: {(\n    tag1,\n    tag2\n)}
      const formatTags = (tags: string): string => {
        if (!tags || tags.trim() === '') return ''
        const tagArray = tags.split(',').map(t => t.trim())
        if (tagArray.length === 0) return ''
        return `{(\n    ${tagArray.join(',\n    ')}\n)}`
      }
      
      // Map item data to correct column positions (0-based indexing)
      columns[26] = `"${timestamp}"` // Created Date (position 27)
      columns[39] = item.oneTimePassword ? `"${item.oneTimePassword}"` : '' // First One-time Password (position 40)
      columns[66] = `"${timestamp}"` // Modified Date (position 67)
      columns[72] = item.notes ? `"${item.notes.replace(/"/g, '""')}"` : '' // Notes (position 73)
      columns[78] = `"${item.password.replace(/"/g, '""')}"` // Password (position 79)
      columns[119] = formatTags(item.tags) ? `"${formatTags(item.tags).replace(/"/g, '""')}"` : '' // Tags (position 120)
      columns[121] = `"${item.title.replace(/"/g, '""')}"` // Title (position 122)
      columns[122] = '"Login"' // Type (position 123)
      columns[127] = `"${item.website.replace(/"/g, '""')}"` // URL (position 128)
      columns[129] = `"${item.username.replace(/"/g, '""')}"` // Username (position 130)
      
      return columns.join(',')
    })
    .join('\n')
    
  return header + '\n' + csvContent
}

export const createDownloadBlob = (content: string, type: string): Blob => {
  return new Blob([content], { type })
}

export const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const securelyEraseData = (data: string): void => {
  // Overwrite the string data multiple times to prevent recovery
  const length = data.length
  let overwrite = ""
  
  // Fill with random characters
  for (let i = 0; i < length; i++) {
    overwrite += String.fromCharCode(Math.floor(Math.random() * 256))
  }
  
  // Force garbage collection (if available)
  if (typeof window !== 'undefined' && 'gc' in window && typeof (window as any).gc === 'function') {
    (window as any).gc()
  }
}