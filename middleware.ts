import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  /**
   * Everything except API routes, Next internals, and files with an extension.
   * `opengraph-image` is listed explicitly because it is a route with no dot in
   * it — without this the locale middleware would redirect the share card to
   * /en/opengraph-image and every preview would 404.
   */
  matcher: ["/((?!api|_next|_vercel|opengraph-image|.*\\..*).*)"],
};
