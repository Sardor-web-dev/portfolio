import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TypeLine } from "@/components/motion/TypeLine";
import { stackGroups } from "@/lib/data/stack";

export function Stack() {
  const t = useTranslations("Stack");

  return (
    <Section id="stack" index={t("index")} label={t("label")}>
      <div className="grid grid-cols-12 gap-x-6 gap-y-6">
        <div className="col-span-12 lg:col-span-6">
          <h3 className="t-h2 max-w-[12ch]">
            <TypeLine text={t("title")} />
          </h3>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-3">
          <p className="t-body max-w-[46ch]">
            <TypeLine text={t("note")} delay={0.15} silent />
          </p>
        </div>
      </div>

      <RevealGroup as="dl" stagger={0.07} className="mt-16 md:mt-24">
        {stackGroups.map((group) => (
          <RevealItem
            key={group.id}
            className="grid grid-cols-12 gap-x-6 gap-y-3 border-t border-rule py-6 last:border-b md:py-7"
          >
            <dt className="col-span-12 md:col-span-3">
              <span className="t-meta text-ink">{t(`groups.${group.id}`)}</span>
            </dt>
            <dd className="col-span-12 md:col-span-9">
              <ul className="flex flex-wrap gap-x-2.5 gap-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-[0.9375rem] leading-none tracking-[-0.01em] text-ink-soft after:ml-2.5 after:text-ink-faint after:content-['·'] last:after:content-none"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
