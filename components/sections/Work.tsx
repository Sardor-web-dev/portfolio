import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { TypeLine } from "@/components/motion/TypeLine";
import { OsonUyCase } from "@/components/work/OsonUyCase";
import { KidsCityCase } from "@/components/work/KidsCityCase";
import { ProjectIndex } from "@/components/work/ProjectIndex";

export function Work() {
  const t = useTranslations("Work");

  return (
    <Section id="work" index={t("index")} label={t("label")} bare>
      <div className="grid grid-cols-12 gap-x-6 gap-y-6 pb-16 md:pb-24">
        <div className="col-span-12 lg:col-span-7">
          <h3 className="t-h2 max-w-[13ch]">
            <TypeLine text={t("title")} />
          </h3>
        </div>
        <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:pt-3">
          <p className="t-body max-w-[44ch]">
            <TypeLine text={t("intro")} delay={0.15} />
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-28 md:gap-40">
        <OsonUyCase />
        <KidsCityCase />
        <ProjectIndex />
      </div>
    </Section>
  );
}
