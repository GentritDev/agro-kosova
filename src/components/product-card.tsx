import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/generated/prisma/client";
import { categoryLabels, unitLabels } from "@/lib/constants";

export function ProductCard({ product }: { product: Pick<Product, "id" | "name" | "category" | "city" | "pricePerUnit" | "quantityAvailable" | "unit" | "harvestDate" | "imageUrls"> }) {
  return <article className="card overflow-hidden"><Link href={`/produkte/${product.id}`} className="block"><div className="relative aspect-[4/3] bg-green-50"><Image src={product.imageUrls[0] || "/placeholders/perime.svg"} alt={`Foto e ${product.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div><div className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-leaf">{categoryLabels[product.category]}</p><h2 className="mt-1 text-lg font-bold text-ink">{product.name}</h2><p className="mt-2 text-sm text-slate-600">{product.city} · Vjelë më {new Intl.DateTimeFormat("sq", { dateStyle: "medium" }).format(product.harvestDate)}</p><div className="mt-4 flex items-end justify-between gap-3"><p className="text-lg font-extrabold text-forest">€{product.pricePerUnit.toString()} <span className="text-sm font-medium">/ {unitLabels[product.unit]}</span></p><p className="text-right text-sm text-slate-600">{product.quantityAvailable.toString()} {unitLabels[product.unit]}</p></div></div></Link></article>;
}
