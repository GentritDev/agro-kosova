export type ActionError = { ok: false; code: "VALIDATION" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "RATE_LIMITED" | "INTERNAL"; message: string; fields?: Record<string, string[]> };
export type ActionResult<T = undefined> = { ok: true; data: T } | ActionError;

export function validationResult<T = never>(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }): ActionResult<T> {
  const raw = error.flatten().fieldErrors;
  const fields = Object.fromEntries(Object.entries(raw).filter(([, value]) => value?.length)) as Record<string, string[]>;
  return { ok: false, code: "VALIDATION", message: "Kontrolloni të dhënat e formularit.", fields };
}
