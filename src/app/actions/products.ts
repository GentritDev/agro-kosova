"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ActionResult } from "@/lib/result";
import { validationResult } from "@/lib/result";
import { productSchema } from "@/lib/validation";

const productValues = (formData: FormData) => {
  let imageUrls: unknown = [];
  try { imageUrls = JSON.parse(String(formData.get("imageUrls") ?? "[]")); } catch { imageUrls = []; }
  return { name: String(formData.get("name") ?? ""), description: String(formData.get("description") ?? ""), category: String(formData.get("category") ?? ""), unit: String(formData.get("unit") ?? ""), quantityAvailable: String(formData.get("quantityAvailable") ?? ""), pricePerUnit: String(formData.get("pricePerUnit") ?? ""), minOrderQuantity: String(formData.get("minOrderQuantity") ?? ""), city: String(formData.get("city") ?? ""), harvestDate: String(formData.get("harvestDate") ?? ""), imageUrls };
};

async function farmer() {
  const user = await getCurrentUser();
  return user?.role === "FARMER" ? user : null;
}

export async function createProductAction(_: ActionResult<{ id: string }> | null, formData: FormData): Promise<ActionResult<{ id: string }>> {
  const user = await farmer();
  if (!user) return { ok: false, code: "FORBIDDEN", message: "Vetëm fermerët mund të shtojnë produkte." };
  const parsed = productSchema.safeParse(productValues(formData));
  if (!parsed.success) return validationResult(parsed.error);
  const product = await prisma.product.create({ data: { ...parsed.data, harvestDate: new Date(parsed.data.harvestDate), farmerId: user.id } });
  revalidatePath("/produkte");
  revalidatePath("/fermeri");
  return { ok: true, data: { id: product.id } };
}

export async function updateProductAction(id: string, _: ActionResult<{ id: string }> | null, formData: FormData): Promise<ActionResult<{ id: string }>> {
  const user = await farmer();
  if (!user) return { ok: false, code: "FORBIDDEN", message: "Nuk keni qasje." };
  const parsed = productSchema.safeParse(productValues(formData));
  if (!parsed.success) return validationResult(parsed.error);
  const existing = await prisma.product.findFirst({ where: { id, farmerId: user.id } });
  if (!existing) return { ok: false, code: "NOT_FOUND", message: "Produkti nuk u gjet." };
  await prisma.product.update({ where: { id }, data: { ...parsed.data, harvestDate: new Date(parsed.data.harvestDate) } });
  revalidatePath("/produkte"); revalidatePath(`/produkte/${id}`); revalidatePath("/fermeri");
  return { ok: true, data: { id } };
}

export async function setProductStatusAction(id: string, status: "ACTIVE" | "HIDDEN" | "SOLD_OUT"): Promise<ActionResult> {
  const user = await farmer();
  if (!user) return { ok: false, code: "FORBIDDEN", message: "Nuk keni qasje." };
  const product = await prisma.product.findFirst({ where: { id, farmerId: user.id } });
  if (!product) return { ok: false, code: "NOT_FOUND", message: "Produkti nuk u gjet." };
  await prisma.product.update({ where: { id }, data: { status } });
  revalidatePath("/produkte"); revalidatePath(`/produkte/${id}`); revalidatePath("/fermeri");
  return { ok: true, data: undefined };
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const user = await farmer();
  if (!user) return { ok: false, code: "FORBIDDEN", message: "Nuk keni qasje." };
  const product = await prisma.product.findFirst({ where: { id, farmerId: user.id } });
  if (!product) return { ok: false, code: "NOT_FOUND", message: "Produkti nuk u gjet." };
  await prisma.product.delete({ where: { id } });
  revalidatePath("/produkte"); revalidatePath("/fermeri");
  return { ok: true, data: undefined };
}
