import { useTranslations } from "next-intl";
import { otherProjects } from "@/lib/data/projects";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowUpRight } from "@/components/ui/Action";

/**
 * The remaining production work as an index rather than a grid of cards. A
 * table is the honest format here: these are entries, not case studies.
 */
export function ProjectIndex() {
  const t = useTranslations("Work");
  const m = useTranslations("Work.more");

  return (
    <section aria-labelledby="more-work" className="border-t border-ink pt-10 md:pt-14">
      <div className="grid grid-cols-12 gap-x-6 gap-y-4">
        <div className="col-span-12 md:col-span-3">
          <Reveal>
            <h3 id="more-work" className="t-meta text-ink">
              {t("moreLabel")}
            </h3>
          </Reveal>
        </div>
        <div className="col-span-12 md:col-span-8 md:col-start-4 lg:col-span-6">
          <Reveal>
            <p className="t-body">{t("moreIntro")}</p>
          </Reveal>
        </div>
      </div>

      <RevealGroup as="ul" stagger={0.06} className="mt-12 md:mt-16">
        {otherProjects.map((project) => {
          /* Some entries have no verified write-up. Rather than pad them out,
             the row simply carries the name, the type and the stack. */
          const description = m.has(`${project.slug}.description`)
            ? m(`${project.slug}.description`)
            : null;

          const Row = (
            <div className="grid grid-cols-12 items-baseline gap-x-6 gap-y-2 py-6">
              <div className="col-span-12 flex items-baseline gap-2 sm:col-span-4 md:col-span-3">
                <span className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-accent">
                  {project.name}
                </span>
                {project.href ? <ArrowUpRight className="text-ink-faint" /> : null}
              </div>
              <div className="col-span-12 sm:col-span-8 md:col-span-3">
                <p className="t-meta text-ink-muted">
                  {m(`${project.slug}.type`)}
                </p>
              </div>
              <div className="col-span-12 md:col-span-6 md:col-start-7">
                {description ? (
                  <p className="text-[0.9375rem] leading-[1.5] tracking-[-0.008em] text-ink-soft">
                    {description}
                  </p>
                ) : null}
                <p className={`t-meta text-ink-faint ${description ? "mt-3" : ""}`}>
                  {project.tech.join(" · ")}
                </p>
              </div>
            </div>
          );

          return (
            <RevealItem
              as="li"
              key={project.slug}
              className="group border-t border-rule last:border-b"
            >
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block transition-colors duration-500 hover:bg-paper-sunk"
                >
                  {Row}
                </a>
              ) : (
                Row
              )}
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
