import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * Anything outside a locale segment belongs on the English page.
 */
export default function NotFound() {
  redirect(`/${routing.defaultLocale}`);
}
