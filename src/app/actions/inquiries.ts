"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ActionResult } from "@/lib/result";
import { validationResult } from "@/lib/result";
import { inquirySchema } from "@/lib/validation";
import { buildViberLink, buildWhatsAppLink } from "@/lib/whatsapp";

export async function contactProductAction(_: ActionResult<{ whatsappUrl: string; viberUrl: string }> | null, formData: FormData): Promise<ActionResult<{ whatsappUrl: string; viberUrl: string }>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, code: "UNAUTHORIZED", message: "Regjistrohuni si biznes për të kontaktuar fermerin." };
  if (user.role !== "BUSINESS") return { ok: false, code: "FORBIDDEN", message: "Vetëm bizneset mund të dërgojnë kërkesa." };
  const parsed = inquirySchema.safeParse({ productId: formData.get("productId"), quantity: formData.get("quantity"), message: formData.get("message") || undefined });
  if (!parsed.success) return validationResult(parsed.error);
  const product = await prisma.product.findFirst({ where: { id: parsed.data.productId, status: "ACTIVE" }, include: { farmer: { select: { phone: true } } } });
  if (!product) return { ok: false, code: "NOT_FOUND", message: "Ky produkt nuk është më në dispozicion." };
  await prisma.inquiry.create({ data: { productId: product.id, businessId: user.id, quantity: parsed.data.quantity, message: parsed.data.message } });
  revalidatePath("/kerkesat");
  return { ok: true, data: { whatsappUrl: buildWhatsAppLink(product.farmer.phone, product.name, parsed.data.quantity, product.unit), viberUrl: buildViberLink(product.farmer.phone) } };
}

export async function updateInquiryStatusAction(inquiryId: string, status: "ACCEPTED" | "DECLINED"): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "FARMER") return { ok: false, code: "FORBIDDEN", message: "Nuk keni qasje." };
  const inquiry = await prisma.inquiry.findFirst({ where: { id: inquiryId, product: { farmerId: user.id } } });
  if (!inquiry) return { ok: false, code: "NOT_FOUND", message: "Kërkesa nuk u gjet." };
  await prisma.inquiry.update({ where: { id: inquiryId }, data: { status } });
  revalidatePath("/kerkesat");
  return { ok: true, data: undefined };
}
