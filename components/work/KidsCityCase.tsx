import { useTranslations } from "next-intl";
import { kidscity } from "@/lib/data/projects";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowUpRight } from "@/components/ui/Action";
import { Shot } from "./Shot";

export function KidsCityCase() {
  const t = useTranslations("Work");
  const p = useTranslations("Work.kidscity");
  const features = p.raw("features") as string[];

  return (
    <article
      aria-labelledby="kidscity-title"
      className="border-t border-ink pt-10 md:pt-14"
    >
      <header className="grid grid-cols-12 gap-x-6 gap-y-8">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <p className="t-meta flex items-center gap-3 text-accent">
              <span aria-hidden className="h-px w-6 bg-accent" />
              {p("eyebrow")} — 02
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h3
              id="kidscity-title"
              className="mt-6 text-[clamp(2.125rem,5vw,3.75rem)] font-medium leading-[0.98] tracking-[-0.038em]"
            >
              {kidscity.name}
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-[clamp(1rem,1.4vw,1.25rem)] tracking-[-0.018em] text-ink-muted">
              {p("subtitle")}
            </p>
          </Reveal>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:pt-2">
          <Reveal delay={0.14}>
            <p className="t-body max-w-[44ch]">{p("description")}</p>
          </Reveal>
          {kidscity.href ? (
            <Reveal delay={0.18}>
              <a
                href={kidscity.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group mt-6 inline-flex items-center gap-2 text-[0.9375rem] tracking-[-0.01em] text-ink link-underline"
              >
                {t("visitSite")}
                <ArrowUpRight />
              </a>
            </Reveal>
          ) : null}
        </div>
      </header>

      <div className="mt-12 md:mt-16">
        <Shot
          src={kidscity.shots[0].src}
          width={kidscity.shots[0].width}
          height={kidscity.shots[0].height}
          alt={p(`alt.${kidscity.shots[0].alt}`)}
          caption={p(`captions.${kidscity.shots[0].caption}`)}
          domain={kidscity.domain}
          sizes="(min-width: 1280px) 76rem, 100vw"
        />
      </div>

      <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-10 border-t border-rule pt-8 md:mt-20">
        <div className="col-span-12 md:col-span-3">
          <Reveal>
            <p className="t-meta text-ink-faint">{t("overview")}</p>
          </Reveal>
        </div>
        <div className="col-span-12 md:col-span-8 md:col-start-4 lg:col-span-6">
          <Reveal>
            <p className="t-lead">{p("overview")}</p>
          </Reveal>
        </div>

        <div className="col-span-12 md:col-span-3">
          <Reveal>
            <p className="t-meta text-ink-faint">{t("features")}</p>
          </Reveal>
        </div>
        <div className="col-span-12 md:col-span-9 md:col-start-4">
          <RevealGroup
            as="ul"
            stagger={0.04}
            className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <RevealItem
                as="li"
                key={feature}
                className="flex gap-3 border-b border-rule py-2.5 text-[0.9375rem] leading-[1.45] tracking-[-0.008em] text-ink-soft"
              >
                <span aria-hidden className="mt-[0.7em] h-px w-2.5 shrink-0 bg-ink-faint" />
                <span>{feature}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="col-span-12 md:col-span-3">
          <Reveal>
            <p className="t-meta text-ink-faint">{t("stackLabel")}</p>
          </Reveal>
        </div>
        <div className="col-span-12 md:col-span-9 md:col-start-4">
          <Reveal>
            <ul className="flex flex-wrap gap-x-2.5 gap-y-1.5">
              {kidscity.tech.map((tech, i) => (
                <li
                  key={tech}
                  className="t-mono text-ink-soft after:ml-2.5 after:text-ink-faint after:content-['·'] last:after:content-none"
                >
                  <span className={i === 0 ? "text-ink" : undefined}>{tech}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
