import { z } from "zod";

const mobilePrefix = /^(43|44|45|48|49)/;

export function normalizeKosovoPhone(value: string): string | null {
  let compact = value.trim().replace(/[\s().-]/g, "");
  if (compact.startsWith("00")) compact = `+${compact.slice(2)}`;
  if (compact.startsWith("0")) compact = `+383${compact.slice(1)}`;
  if (!compact.startsWith("+383")) return null;
  const national = compact.slice(4);
  if (!/^\d{8}$/.test(national) || !mobilePrefix.test(national)) return null;
  return `+383${national}`;
}

export const phoneSchema = z.string().transform((value, context) => {
  const normalized = normalizeKosovoPhone(value);
  if (!normalized) {
    context.addIssue({ code: "custom", message: "Shkruani një numër mobil të vlefshëm të Kosovës" });
    return z.NEVER;
  }
  return normalized;
});
