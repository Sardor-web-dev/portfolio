import Image from "next/image";

/**
 * A phone screenshot in a plain device outline — no gloss, no notch drawing, no
 * marketing render. Only used when a real capture exists; nothing is mocked up.
 */
export function PhoneShot({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="w-full max-w-[15rem]">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-rule-strong bg-paper-deep p-1.5">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.4rem]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="15rem"
            className="object-cover object-top"
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-[0.8125rem] leading-[1.5] text-ink-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
