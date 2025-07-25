import { getFakerForLocale } from "./locale-faker"

// Locale-specific content with accented characters
const localeSpecificContent = {
  fr: {
    companies: [
      'Société Générale', 'Crédit Agricole', 'Peugeot Citroën', 'Alcôve & Associés',
      'Boulangerie Française', 'Café de la Gare', 'Hôtel Première Étoile',
      'Pharmacie Saint-Barthélemy', 'École Française', 'Théâtre National'
    ],
    notes: [
      'Informations personnelles très importantes à retenir',
      'Numéro de téléphone: +33 1 23 45 67 89',
      'Adresse électronique: exemple@société.fr',
      'Rendez-vous prévu pour demain à 14h30',
      'Réunion avec l\'équipe de développement',
      'Code d\'accès: 123456 (à changer régulièrement)'
    ],
    passwords: [
      'MonMot2Passe!', 'Sécurité123', 'Français2024!', 'Château789',
      'Liberté456!', 'Égalité321', 'Fraternité!23'
    ]
  },
  de: {
    companies: [
      'Müller & Söhne GmbH', 'Bäckerei Königreich', 'Café Gemütlich',
      'Büroservice Zürich', 'Möbelhaus Schönheit', 'Apotheke Grün',
      'Universität München', 'Fußball-Verein 1860', 'Straßenbau AG'
    ],
    notes: [
      'Wichtige Informationen für späteren Gebrauch',
      'Telefonnummer: +49 30 12345678',
      'E-Mail: beispiel@größe.de',
      'Termin für nächste Woche geplant',
      'Besprechung mit dem Führungsteam',
      'Zugangscode: 654321 (regelmäßig ändern)'
    ],
    passwords: [
      'MeinPasswort!1', 'Sicherheit789', 'Deutsch2024!', 'Schloß456',
      'Größe123!', 'Fähigkeit321', 'Stärke!789'
    ]
  },
  es: {
    companies: [
      'Comunicación y Más S.L.', 'Panadería Española', 'Café José María',
      'Oficina Técnica Ibérica', 'Muebles & Diseño', 'Farmacia San José',
      'Universidad Complutense', 'Fútbol Club Español', 'Construcción S.A.'
    ],
    notes: [
      'Información muy importante para recordar más tarde',
      'Número de teléfono: +34 91 123 45 67',
      'Correo electrónico: ejemplo@español.es',
      'Cita programada para mañana a las 15:30',
      'Reunión con el equipo de gestión',
      'Código de acceso: 789123 (cambiar periódicamente)'
    ],
    passwords: [
      'MiContraseña!1', 'Seguridad456', 'España2024!', 'Niño789',
      'Corazón123!', 'Montaña654', 'Océano!321'
    ]
  },
  it: {
    companies: [
      'Società Italiana S.r.l.', 'Panetteria Città', 'Caffè Università',
      'Ufficio Tecnico Europeo', 'Mobili & Arredamenti', 'Farmacia Sant\'Andrea',
      'Università Statale', 'Società Calcistica', 'Costruzioni S.p.A.'
    ],
    notes: [
      'Informazioni molto importanti da ricordare più tardi',
      'Numero di telefono: +39 06 12345678',
      'Email: esempio@società.it',
      'Appuntamento fissato per domani alle 16:00',
      'Riunione con il team dirigenziale',
      'Codice di accesso: 456789 (da cambiare regolarmente)'
    ],
    passwords: [
      'MiaPassword!1', 'Sicurezza789', 'Italia2024!', 'Città456',
      'Università123!', 'Società654', 'Qualità!321'
    ]
  },
  pt: {
    companies: [
      'Comunicação Ibérica Lda.', 'Padaria Portuguesa', 'Café São João',
      'Escritório Técnico Nacional', 'Móveis & Decoração', 'Farmácia Central',
      'Universidade do Porto', 'Clube de Futebol', 'Construção Civil S.A.'
    ],
    notes: [
      'Informações muito importantes para lembrar mais tarde',
      'Número de telefone: +351 21 123 4567',
      'Email: exemplo@português.pt',
      'Consulta marcada para amanhã às 14:30',
      'Reunião com a equipa de gestão',
      'Código de acesso: 321654 (alterar regularmente)'
    ],
    passwords: [
      'MinhaPassword!1', 'Segurança456', 'Portugal2024!', 'Coração789',
      'Nação123!', 'Tradição654', 'Paixão!321'
    ]
  }
}

export function getLocaleSpecificCompany(locale: string): string {
  const localeFaker = getFakerForLocale(locale)
  const content = localeSpecificContent[locale as keyof typeof localeSpecificContent]
  
  if (content && content.companies) {
    // 50% chance to use locale-specific company, 50% chance to use faker
    if (Math.random() < 0.5) {
      return localeFaker.helpers.arrayElement(content.companies)
    }
  }
  
  return localeFaker.company.name()
}

export function getLocaleSpecificNote(locale: string): string {
  const localeFaker = getFakerForLocale(locale)
  const content = localeSpecificContent[locale as keyof typeof localeSpecificContent]
  
  if (content && content.notes) {
    // 70% chance to use locale-specific note for more accented characters
    if (Math.random() < 0.7) {
      return localeFaker.helpers.arrayElement(content.notes)
    }
  }
  
  return localeFaker.lorem.paragraph()
}

export function getLocaleSpecificWeakPassword(locale: string): string {
  const localeFaker = getFakerForLocale(locale)
  const content = localeSpecificContent[locale as keyof typeof localeSpecificContent]
  
  if (content && content.passwords) {
    // 60% chance to use locale-specific weak password
    if (Math.random() < 0.6) {
      return localeFaker.helpers.arrayElement(content.passwords)
    }
  }
  
  // Fallback to regular weak password generation
  return localeFaker.internet.password({ length: localeFaker.number.int({ min: 6, max: 10 }) })
}


export function getSupportedContentLocales(): string[] {
  return Object.keys(localeSpecificContent)
}