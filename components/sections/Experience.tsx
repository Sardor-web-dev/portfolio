import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { roles } from "@/lib/data/experience";
import { ArrowUpRight } from "@/components/ui/Action";

export function Experience() {
  const t = useTranslations("Experience");

  return (
    <Section id="experience" index={t("index")} label={t("label")} tone="sunk">
      <Reveal>
        <h3 className="t-h2 max-w-[14ch]">{t("title")}</h3>
      </Reveal>

      <ol className="mt-16 md:mt-20">
        {roles.map((role, i) => {
          const key = `roles.${role.id}` as const;
          /* Not every role carries a location or a list of duties. One that
             doesn't renders as company, title and summary rather than being
             padded out to match the others. */
          const bullets = t.has(`${key}.bullets`)
            ? (t.raw(`${key}.bullets`) as string[])
            : [];
          const location = t.has(`${key}.location`) ? t(`${key}.location`) : null;
          const note = t.has(`${key}.note`) ? t(`${key}.note`) : null;

          return (
            <li
              key={role.id}
              className="relative border-t border-rule-strong pt-8 pb-14 last:pb-0 md:pt-10 md:pb-20"
            >
              <RevealGroup className="grid grid-cols-12 gap-x-6 gap-y-6" stagger={0.06}>
                {/* rail */}
                <RevealItem className="col-span-12 md:col-span-4 lg:col-span-3">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={`mt-2 h-[7px] w-[7px] shrink-0 ${
                        i === 0 ? "bg-accent" : "bg-ink-faint"
                      }`}
                    />
                    <div>
                      <h4 className="t-h3">
                        {role.href ? (
                          <a
                            href={role.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="group inline-flex items-start gap-1.5 link-underline"
                          >
                            {role.company}
                            <ArrowUpRight className="mt-2" />
                          </a>
                        ) : (
                          role.company
                        )}
                      </h4>
                      {location ? (
                        <p className="t-meta mt-3 text-ink-muted">{location}</p>
                      ) : null}
                      {role.period ? (
                        <p className="t-meta mt-1.5 text-ink-faint tabular-nums">
                          {role.period}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </RevealItem>

                <RevealItem className="col-span-12 md:col-span-8 lg:col-span-9">
                  <p className="text-[1.0625rem] font-medium leading-[1.4] tracking-[-0.018em] text-ink">
                    {t(`${key}.role`)}
                  </p>
                  {note ? (
                    <p className="t-meta mt-2 text-accent">{note}</p>
                  ) : null}
                  <p className="t-body mt-4 max-w-[58ch]">{t(`${key}.summary`)}</p>

                  {bullets.length > 0 ? (
                    <>
                      <p className="t-meta mt-9 text-ink-faint">
                        {t("responsibilities")}
                      </p>
                      <ul className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                        {bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex gap-3 border-b border-rule py-2.5 text-[0.9375rem] leading-[1.45] tracking-[-0.008em] text-ink-soft last:border-b-0 sm:last:border-b sm:[&:nth-last-child(-n+1)]:border-b-0"
                          >
                            <span
                              aria-hidden
                              className="mt-[0.7em] h-px w-2.5 shrink-0 bg-ink-faint"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </RevealItem>
              </RevealGroup>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
