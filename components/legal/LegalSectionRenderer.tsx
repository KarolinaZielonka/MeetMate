import type { LegalSectionConfig } from "@/config/legal-sections"
import { BulletList } from "./BulletList"
import { HighlightBox } from "./HighlightBox"
import { LegalSection } from "./LegalSection"
import { ServiceCard } from "./ServiceCard"

interface LegalSectionRendererProps {
  section: LegalSectionConfig
  namespace: "privacy" | "terms"
  t: (key: string) => string
}

export function LegalSectionRenderer({ section, namespace, t }: LegalSectionRendererProps) {
  const sectionKey = `sections.${section.key}`

  return (
    <LegalSection
      title={t(`${sectionKey}.title`)}
      description={t(`${sectionKey}.description`)}
    >
      {section.hasBulletList && section.bulletListItemKeys && (
        <BulletList
          variant={section.bulletVariant}
          items={section.bulletListItemKeys.map((key) => t(`${sectionKey}.items.${key}`))}
        />
      )}

      {section.hasHighlight && section.highlightKey && (
        <div className="mt-4">
          <HighlightBox variant={section.highlightVariant}>
            <p
              className={
                section.highlightVariant === "muted"
                  ? "text-sm text-muted-foreground"
                  : "text-sm text-card-foreground font-medium"
              }
            >
              {t(`${sectionKey}.${section.highlightKey}`)}
            </p>
          </HighlightBox>
        </div>
      )}

      {section.hasServiceCards && namespace === "privacy" && (
        <>
          <div className="space-y-3 mb-4">
            <ServiceCard
              name={t(`${sectionKey}.items.supabase.name`)}
              purpose={t(`${sectionKey}.items.supabase.purpose`)}
              privacyLink={t(`${sectionKey}.items.supabase.link`)}
            />
            <ServiceCard
              name={t(`${sectionKey}.items.vercel.name`)}
              purpose={t(`${sectionKey}.items.vercel.purpose`)}
              privacyLink={t(`${sectionKey}.items.vercel.link`)}
            />
          </div>
          <HighlightBox variant="muted">
            <p className="text-sm text-muted-foreground">{t(`${sectionKey}.note`)}</p>
          </HighlightBox>
        </>
      )}

      {section.key === "yourRights" && namespace === "privacy" && (
        <p className="text-sm text-muted-foreground mt-4">{t(`${sectionKey}.exercise`)}</p>
      )}
    </LegalSection>
  )
}
