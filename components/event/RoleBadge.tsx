"use client"

import { Check, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { UserRole } from "@/types"

interface RoleBadgeProps {
  role: UserRole
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const t = useTranslations("eventPage")

  if (role === "visitor") {
    return null
  }

  if (role === "admin") {
    return (
      <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-none shadow-md hover-scale">
        <Zap className="w-3.5 h-3.5 mr-1" />
        {t("badges.admin")}
      </Badge>
    )
  }

  return (
    <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-none shadow-md hover-scale">
      <Check className="w-3.5 h-3.5 mr-1" />
      {t("badges.participant")}
    </Badge>
  )
}
