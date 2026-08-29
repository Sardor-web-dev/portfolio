import { useTranslations } from "next-intl";
import { osonUy } from "@/lib/data/projects";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TypeLine } from "@/components/motion/TypeLine";
import { ArrowUpRight } from "@/components/ui/Action";
import { CaseBlock } from "./CaseBlock";
import { Shot } from "./Shot";
import { PhoneShot } from "./PhoneShot";
import { Architecture } from "./Architecture";
import { Metric } from "@/components/ui/Metric";

export function OsonUyCase() {
  const t = useTranslations("Work");
  const p = useTranslations("Work.oson-uy");

  const built = p.raw("built") as string[];
  const mobilePoints = p.raw("mobilePoints") as string[];
  const metrics = p.raw("metrics") as { value: string; label: string }[];
  const hasPhones = osonUy.mobileShots.length > 0;

  return (
    <article
      aria-labelledby="oson-uy-title"
      className="border-t border-ink pt-10 md:pt-14"
    >
      {/* Masthead */}
      <header className="grid grid-cols-12 gap-x-6 gap-y-8">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <p className="t-meta flex items-center gap-3 text-accent">
              <span aria-hidden className="h-px w-6 bg-accent" />
              {p("eyebrow")} — 01
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h3
              id="oson-uy-title"
              className="mt-6 text-[clamp(2.5rem,6.5vw,5rem)] font-medium leading-[0.95] tracking-[-0.04em]"
            >
              {osonUy.name}
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-[clamp(1.0625rem,1.6vw,1.375rem)] tracking-[-0.018em] text-ink-muted">
              {p("subtitle")}
            </p>
          </Reveal>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:pt-2">
          <p className="t-body max-w-[44ch]">
            <TypeLine text={p("description")} delay={0.2} />
          </p>
          {osonUy.href ? (
            <Reveal delay={0.18}>
              <a
                href={osonUy.href}
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

      {/* Facts */}
      <RevealGroup className="mt-12 grid grid-cols-12 gap-x-6 gap-y-8 border-t border-rule pt-8 md:mt-16">
        <RevealItem className="col-span-12 sm:col-span-5 md:col-span-4">
          <p className="t-meta text-ink-faint">{t("role")}</p>
          <p className="mt-3 text-[0.9375rem] leading-[1.5] tracking-[-0.008em] text-ink-soft">
            {t("roleValue")}
          </p>
        </RevealItem>
        <RevealItem className="col-span-12 sm:col-span-7 md:col-span-8">
          <p className="t-meta text-ink-faint">{t("stackLabel")}</p>
          <ul className="mt-3 flex flex-wrap gap-x-2.5 gap-y-1.5">
            {osonUy.tech.map((tech, i) => (
              <li
                key={tech}
                className="t-mono text-ink-soft after:ml-2.5 after:text-ink-faint after:content-['·'] last:after:content-none"
              >
                <span className={i === 0 ? "text-ink" : undefined}>{tech}</span>
              </li>
            ))}
          </ul>
        </RevealItem>
      </RevealGroup>

      {/* Lead image */}
      <div className="mt-14 md:mt-20">
        <Shot
          src={osonUy.shots[0].src}
          width={osonUy.shots[0].width}
          height={osonUy.shots[0].height}
          alt={p(`alt.${osonUy.shots[0].alt}`)}
          caption={p(`captions.${osonUy.shots[0].caption}`)}
          domain={osonUy.domain}
          sizes="(min-width: 1280px) 76rem, 100vw"
        />
      </div>

      <div className="mt-20 flex flex-col gap-16 md:mt-28 md:gap-20">
        <CaseBlock label={t("problem")}>
          <p className="t-lead">
            <TypeLine text={p("problem")} silent />
          </p>
        </CaseBlock>

        <CaseBlock label={t("solution")}>
          <p className="t-lead">
            <TypeLine text={p("solution")} silent />
          </p>
        </CaseBlock>

        <CaseBlock label={t("built")} wide>
          <RevealGroup
            as="ul"
            stagger={0.025}
            className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {built.map((item) => (
              <RevealItem
                as="li"
                key={item}
                className="flex gap-3 border-b border-rule py-2.5 text-[0.9375rem] leading-[1.45] tracking-[-0.008em] text-ink-soft"
              >
                <span aria-hidden className="mt-[0.7em] h-px w-2.5 shrink-0 bg-ink-faint" />
                <span>{item}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </CaseBlock>

        <CaseBlock label={t("architecture")} wide>
          <p className="t-body mb-10 max-w-[56ch]">
            <TypeLine text={p("architectureIntro")} />
          </p>
          <Architecture />
        </CaseBlock>

        <div>
          <Shot
            src={osonUy.shots[1].src}
            width={osonUy.shots[1].width}
            height={osonUy.shots[1].height}
            alt={p(`alt.${osonUy.shots[1].alt}`)}
            caption={p(`captions.${osonUy.shots[1].caption}`)}
            sizes="(min-width: 1280px) 76rem, 100vw"
          />
        </div>

        <CaseBlock label={t("mobile")} wide>
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div
              className={
                hasPhones ? "col-span-12 lg:col-span-6" : "col-span-12 md:col-span-5"
              }
            >
              <p className="t-body max-w-[48ch]">
                <TypeLine text={p("mobileIntro")} />
              </p>
            </div>

            <div
              className={
                hasPhones
                  ? "col-span-12 lg:col-span-6"
                  : "col-span-12 md:col-span-6 md:col-start-7"
              }
            >
              <RevealGroup as="ul" stagger={0.06}>
                {mobilePoints.map((point) => (
                  <RevealItem
                    as="li"
                    key={point}
                    className="flex gap-3 border-t border-rule py-3 text-[0.9375rem] leading-[1.45] text-ink-soft last:border-b"
                  >
                    <span aria-hidden className="mt-[0.7em] h-px w-2.5 shrink-0 bg-ink-faint" />
                    <span>{point}</span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            {hasPhones ? (
              <div className="col-span-12 flex flex-wrap gap-6 lg:col-span-6 lg:justify-end">
                {osonUy.mobileShots.map((shot) => (
                  <PhoneShot
                    key={shot.src}
                    src={shot.src}
                    alt={p(`alt.${shot.alt}`)}
                    caption={p(`captions.${shot.caption}`)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </CaseBlock>

        <CaseBlock label={t("result")} wide>
          <p className="t-h3 max-w-[24ch]">
            <TypeLine text={p("resultLead")} />
          </p>
          <p className="t-body mt-5 max-w-[52ch]">
            <TypeLine text={p("resultBody")} delay={0.3} silent />
          </p>

          <RevealGroup
            className="mt-12 grid grid-cols-1 border-t border-ink-faint sm:grid-cols-3"
            stagger={0.08}
          >
            {metrics.map((metric) => (
              <RevealItem
                key={metric.label}
                className="border-b border-rule py-6 pr-8 sm:border-b-0"
              >
                <Metric value={metric.value} label={metric.label} />
              </RevealItem>
            ))}
          </RevealGroup>
        </CaseBlock>
      </div>
    </article>
  );
}
