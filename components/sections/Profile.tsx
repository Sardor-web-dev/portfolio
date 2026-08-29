import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { StatementLines } from "@/components/ui/StatementLines";
import { Shot } from "@/components/work/Shot";
import { site } from "@/lib/data/site";

const ARC = ["idea", "architecture", "development", "deployment"] as const;

export function Profile() {
  const t = useTranslations("Profile");

  return (
    <Section id="profile" index={t("index")} label={t("label")}>
      <StatementLines
        lines={[t("statementLine1"), t("statementLine2")]}
        emphasiseLast
      />

      <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-20">
        <div className="col-span-12 sm:col-span-8 md:col-span-5 lg:col-span-4">
          <Shot
            src={site.portrait.src}
            width={site.portrait.width}
            height={site.portrait.height}
            alt={t("portraitAlt")}
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
          />
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
          <Reveal>
            <p className="t-lead max-w-[38ch]">{t("body1")}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="t-body mt-6 max-w-[46ch]">{t("body2")}</p>
          </Reveal>
        </div>
      </div>

      {/* Idea -> Architecture -> Development -> Deployment */}
      <div className="mt-20 md:mt-28">
        <Reveal>
          <p className="t-meta text-ink-faint">{t("arcLabel")}</p>
        </Reveal>

        <RevealGroup
          as="ol"
          stagger={0.09}
          className="mt-6 grid grid-cols-1 gap-px border-t border-rule sm:grid-cols-2 lg:grid-cols-4"
        >
          {ARC.map((step, i) => (
            <RevealItem
              as="li"
              key={step}
              className="relative border-b border-rule pb-8 pt-6 sm:border-b-0 sm:pr-8 lg:pr-10"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-full bg-ink"
                style={{ opacity: 1 - i * 0.22 }}
              />
              <div className="t-meta flex items-baseline gap-3">
                <span className="tabular-nums text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-ink">{t(`arc.${step}.title`)}</span>
              </div>
              <p className="t-body mt-3 text-[0.9375rem] leading-[1.6]">
                {t(`arc.${step}.body`)}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
