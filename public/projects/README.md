# Project screenshots

One folder per project. Every image is rendered through `next/image`, so the
`width` / `height` recorded in `lib/data/projects.ts` must match the file.

    oson-uy/   storefront.webp, dashboard.webp   (2000 x 1091)
    kidscity/  storefront.webp                   (2000 x 1091)

## Adding mobile screenshots

`mobileShots` is empty on purpose — no phone captures were available and
nothing is mocked up. To add them: export the real screens, drop them in
`oson-uy/`, and add entries with `device: "phone"`. The phone frames, the
gallery and the captions all appear automatically.
