import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function Background() {
  const t = useTranslations("Background");
  const languages = t.raw("languages") as { name: string; level: string }[];

  return (
    <Section id="background" index={t("index")} label={t("label")} tone="sunk">
      <div className="grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 md:col-span-6 lg:col-span-5">
          <Reveal>
            <h3 className="t-meta text-ink">{t("languagesTitle")}</h3>
          </Reveal>
          <RevealGroup as="dl" stagger={0.05} className="mt-6">
            {languages.map((language) => (
              <RevealItem
                key={language.name}
                className="flex items-baseline justify-between gap-6 border-t border-rule py-3.5 last:border-b"
              >
                <dt className="text-[0.9375rem] tracking-[-0.01em] text-ink">
                  {language.name}
                </dt>
                <dd className="t-meta text-ink-muted">{language.level}</dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <Reveal>
            <h3 className="t-meta text-ink">{t("educationTitle")}</h3>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="t-body mt-6 max-w-[42ch] border-t border-rule pt-6">
              {t("educationBody")}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
