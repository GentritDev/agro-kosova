"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { createSession, destroySession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ActionResult } from "@/lib/result";
import { validationResult } from "@/lib/result";
import { hashIp, hashPin, verifyPin } from "@/lib/security";
import { loginSchema, registerSchema } from "@/lib/validation";

const LOCK_AFTER_FAILURES = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

const values = (formData: FormData) => ({ name: String(formData.get("name") ?? ""), phone: String(formData.get("phone") ?? ""), pin: String(formData.get("pin") ?? ""), role: String(formData.get("role") ?? ""), city: String(formData.get("city") ?? ""), businessName: String(formData.get("businessName") ?? "") || undefined });

export async function registerAction(_: ActionResult<{ redirectTo: string }> | null, formData: FormData): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = registerSchema.safeParse(values(formData));
  if (!parsed.success) return validationResult(parsed.error);
  const { name, phone, pin, role, city, businessName } = parsed.data;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        role,
        city,
        pinHash: await hashPin(pin),
        businessName: role === "BUSINESS" ? (businessName ?? null) : null,
      },
    });
    await createSession(user.id);
    return { ok: true, data: { redirectTo: user.role === "FARMER" ? "/fermeri" : "/kerkesat" } };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, code: "CONFLICT", message: "Ky numër telefoni është tashmë i regjistruar." };
    }
    console.error("registerAction failed", {
      name: error instanceof Error ? error.name : "unknown",
      code: error instanceof Prisma.PrismaClientKnownRequestError ? error.code : undefined,
    });
    return { ok: false, code: "INTERNAL", message: "Regjistrimi nuk u krye. Provoni përsëri." };
  }
}


export async function loginAction(_: ActionResult<{ redirectTo: string }> | null, formData: FormData): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = loginSchema.safeParse({ phone: formData.get("phone"), pin: formData.get("pin") });
  if (!parsed.success) return validationResult(parsed.error);
  const forwarded = (await headers()).get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const ipHash = hashIp(ip);
  const attempt = await prisma.loginAttempt.findUnique({ where: { phone_ipHash: { phone: parsed.data.phone, ipHash } } });
  if (attempt?.lockedUntil && attempt.lockedUntil > new Date()) return { ok: false, code: "RATE_LIMITED", message: "Shumë përpjekje. Provoni përsëri pas 15 minutash." };
  const user = await prisma.user.findUnique({ where: { phone: parsed.data.phone } });
  const valid = user ? await verifyPin(parsed.data.pin, user.pinHash) : false;
  if (!user || !valid) {
    const failures = (attempt?.failures ?? 0) + 1;
    await prisma.loginAttempt.upsert({ where: { phone_ipHash: { phone: parsed.data.phone, ipHash } }, create: { phone: parsed.data.phone, ipHash, failures, lockedUntil: failures >= LOCK_AFTER_FAILURES ? new Date(Date.now() + LOCK_DURATION_MS) : null, userId: user?.id }, update: { failures, lockedUntil: failures >= LOCK_AFTER_FAILURES ? new Date(Date.now() + LOCK_DURATION_MS) : null, userId: user?.id } });
    return { ok: false, code: failures >= LOCK_AFTER_FAILURES ? "RATE_LIMITED" : "UNAUTHORIZED", message: failures >= LOCK_AFTER_FAILURES ? "Llogaria u bllokua për 15 minuta." : "Numri ose PIN-i nuk është i saktë." };
  }
  await prisma.loginAttempt.upsert({ where: { phone_ipHash: { phone: parsed.data.phone, ipHash } }, create: { phone: parsed.data.phone, ipHash, userId: user.id }, update: { failures: 0, lockedUntil: null, userId: user.id } });
  await createSession(user.id);
  return { ok: true, data: { redirectTo: user.role === "FARMER" ? "/fermeri" : "/kerkesat" } };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
