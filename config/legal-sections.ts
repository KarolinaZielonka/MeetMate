export interface LegalSectionConfig {
  key: string
  hasBulletList?: boolean
  bulletListItemKeys?: string[]
  bulletVariant?: "primary" | "destructive"
  hasHighlight?: boolean
  highlightKey?: string
  highlightVariant?: "primary" | "muted"
  hasServiceCards?: boolean
}

export const privacySections: LegalSectionConfig[] = [
  {
    key: "dataCollection",
    hasBulletList: true,
    bulletListItemKeys: [
      "eventData",
      "participantNames",
      "availability",
      "sessionTokens",
      "ipAddresses",
      "technicalData",
    ],
  },
  {
    key: "howWeUse",
    hasBulletList: true,
    bulletListItemKeys: ["service", "realtime", "optimal", "security", "improvement"],
    hasHighlight: true,
    highlightKey: "noSelling",
    highlightVariant: "primary",
  },
  {
    key: "dataStorage",
    hasBulletList: true,
    bulletListItemKeys: ["encryption", "database", "location", "access", "passwords"],
  },
  {
    key: "dataRetention",
    hasBulletList: true,
    bulletListItemKeys: ["automatic", "manual", "immediate"],
  },
  {
    key: "localStorage",
    hasBulletList: true,
    bulletListItemKeys: ["purpose", "format", "control", "noTracking"],
  },
  {
    key: "yourRights",
    hasBulletList: true,
    bulletListItemKeys: [
      "access",
      "rectification",
      "erasure",
      "portability",
      "object",
      "restrict",
      "withdraw",
    ],
  },
  {
    key: "thirdParty",
    hasServiceCards: true,
  },
  {
    key: "noAccounts",
  },
  {
    key: "children",
  },
  {
    key: "changes",
  },
]

/**
 * Terms of Service sections configuration
 */
export const termsSections: LegalSectionConfig[] = [
  {
    key: "acceptance",
  },
  {
    key: "description",
    hasBulletList: true,
    bulletListItemKeys: ["create", "share", "coordinate", "calculate"],
  },
  {
    key: "userResponsibilities",
    hasBulletList: true,
    bulletListItemKeys: ["accurate", "lawful", "respectful", "noSpam", "security", "noAutomation"],
  },
  {
    key: "prohibited",
    hasBulletList: true,
    bulletListItemKeys: ["violate", "infringe", "malicious", "interfere", "impersonate", "collect"],
    bulletVariant: "destructive",
  },
  {
    key: "intellectualProperty",
  },
  {
    key: "disclaimer",
    hasBulletList: true,
    bulletListItemKeys: ["uninterrupted", "secure", "accurate", "bugs"],
  },
  {
    key: "limitation",
  },
  {
    key: "dataLoss",
    hasBulletList: true,
    bulletListItemKeys: ["technical", "deletion", "userAction", "localStorage"],
    hasHighlight: true,
    highlightKey: "backup",
    highlightVariant: "muted",
  },
  {
    key: "termination",
  },
  {
    key: "changes",
  },
  {
    key: "governing",
  },
]
