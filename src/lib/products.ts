import { ProductCategory, type Prisma } from "@/generated/prisma/client";
import { categories, kosovoCities } from "@/lib/constants";

export type ProductFilters = { city?: string; category?: string; q?: string };

export function buildProductWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { status: "ACTIVE" };
  if (filters.city && (kosovoCities as readonly string[]).includes(filters.city)) where.city = filters.city;
  if (filters.category && (categories as readonly string[]).includes(filters.category)) where.category = filters.category as ProductCategory;
  const query = filters.q?.trim();
  if (query) where.OR = [{ name: { contains: query, mode: "insensitive" } }, { description: { contains: query, mode: "insensitive" } }];
  return where;
}
