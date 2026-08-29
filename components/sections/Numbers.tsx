import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Metric } from "@/components/ui/Metric";

export function Numbers() {
  const t = useTranslations("Numbers");
  const items = t.raw("items") as { value: string; label: string }[];

  return (
    <Section id="numbers" index={t("index")} label={t("label")} bare>
      <RevealGroup
        as="dl"
        stagger={0.08}
        className="grid grid-cols-1 border-t border-ink sm:grid-cols-2 lg:grid-cols-4"
      >
        {items.map((item) => (
          <RevealItem
            key={item.label}
            className="border-b border-rule py-8 pr-8 last:border-b-0 sm:py-10 lg:border-b-0"
          >
            <dt className="sr-only">{item.label}</dt>
            <dd>
              <Metric value={item.value} label={item.label} />
            </dd>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
