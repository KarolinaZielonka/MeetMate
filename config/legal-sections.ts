export interface LegalSectionConfig {
  key: string
  bulletListItemKeys?: string[]
  highlightKey?: string
  highlightVariant?: "primary" | "muted"
  hasServiceCards?: boolean
}

export const privacySections: LegalSectionConfig[] = [
  {
    key: "dataCollection",
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
    bulletListItemKeys: ["service", "realtime", "optimal", "security", "improvement"],
    highlightKey: "noSelling",
    highlightVariant: "primary",
  },
  {
    key: "dataStorage",
    bulletListItemKeys: ["encryption", "database", "location", "access", "passwords"],
  },
  {
    key: "dataRetention",
    bulletListItemKeys: ["automatic", "manual", "immediate"],
  },
  {
    key: "localStorage",
    bulletListItemKeys: ["purpose", "format", "control", "noTracking"],
  },
  {
    key: "yourRights",
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
    key: "changes",
  },
]

export const termsSections: LegalSectionConfig[] = [
  {
    key: "acceptance",
  },
  {
    key: "description",
    bulletListItemKeys: ["create", "share", "coordinate", "calculate"],
  },
  {
    key: "userResponsibilities",
    bulletListItemKeys: ["accurate", "lawful", "respectful", "noSpam", "security", "noAutomation"],
  },
  {
    key: "prohibited",
    bulletListItemKeys: ["violate", "infringe", "malicious", "interfere", "impersonate", "collect"],
  },
  {
    key: "intellectualProperty",
  },
  {
    key: "disclaimer",
    bulletListItemKeys: ["uninterrupted", "secure", "accurate", "bugs"],
  },
  {
    key: "dataLoss",
    bulletListItemKeys: ["technical", "deletion", "userAction", "localStorage"],
    highlightKey: "backup",
    highlightVariant: "muted",
  },
  {
    key: "changes",
  },
]
