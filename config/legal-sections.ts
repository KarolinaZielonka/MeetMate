/**
 * Legal page section configurations
 * Data-driven approach for Privacy Policy and Terms of Service pages
 */

import type { LucideIcon } from "lucide-react"
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  FileText,
  Lock,
  Scale,
  ShieldAlert,
  Users,
} from "lucide-react"

export interface LegalSectionConfig {
  key: string
  icon?: LucideIcon
  iconVariant?: "primary" | "destructive"
  hasBulletList?: boolean
  bulletListItemKeys?: string[]
  bulletVariant?: "default" | "destructive"
  hasHighlight?: boolean
  highlightKey?: string
  highlightVariant?: "default" | "muted"
  hasServiceCards?: boolean
}

export const privacySections: LegalSectionConfig[] = [
  {
    key: "dataCollection",
    icon: Database,
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
    icon: FileText,
    hasBulletList: true,
    bulletListItemKeys: ["service", "realtime", "optimal", "security", "improvement"],
    hasHighlight: true,
    highlightKey: "noSelling",
    highlightVariant: "default",
  },
  {
    key: "dataStorage",
    icon: Lock,
    hasBulletList: true,
    bulletListItemKeys: ["encryption", "database", "location", "access", "passwords"],
  },
  {
    key: "dataRetention",
    icon: Clock,
    hasBulletList: true,
    bulletListItemKeys: ["automatic", "manual", "immediate"],
  },
  {
    key: "localStorage",
    icon: Database,
    hasBulletList: true,
    bulletListItemKeys: ["purpose", "format", "control", "noTracking"],
  },
  {
    key: "yourRights",
    icon: Scale,
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
    icon: Users,
    hasServiceCards: true,
  },
  {
    key: "noAccounts",
  },
  {
    key: "children",
    icon: AlertCircle,
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
    icon: FileText,
    hasBulletList: true,
    bulletListItemKeys: ["create", "share", "coordinate", "calculate"],
  },
  {
    key: "userResponsibilities",
    icon: CheckCircle,
    hasBulletList: true,
    bulletListItemKeys: ["accurate", "lawful", "respectful", "noSpam", "security", "noAutomation"],
  },
  {
    key: "prohibited",
    icon: ShieldAlert,
    iconVariant: "destructive",
    hasBulletList: true,
    bulletListItemKeys: ["violate", "infringe", "malicious", "interfere", "impersonate", "collect"],
    bulletVariant: "destructive",
  },
  {
    key: "intellectualProperty",
  },
  {
    key: "disclaimer",
    icon: AlertTriangle,
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
