import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { categories, categoryLabels, kosovoCities } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { buildProductWhere } from "@/lib/products";

const PAGE_SIZE = 12;
type Search = { city?: string; category?: string; q?: string; cursor?: string };

export const dynamic = "force-dynamic";
export default async function ProductsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const search = await searchParams;
  const where = buildProductWhere(search);
  const products = await prisma.product.findMany({ where, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: PAGE_SIZE + 1, ...(search.cursor ? { cursor: { id: search.cursor }, skip: 1 } : {}) });
  const hasMore = products.length > PAGE_SIZE;
  const visible = hasMore ? products.slice(0, PAGE_SIZE) : products;
  const next = visible.at(-1)?.id;
  const params = new URLSearchParams(); if (search.q) params.set("q", search.q); if (search.city) params.set("city", search.city); if (search.category) params.set("category", search.category); if (next) params.set("cursor", next);
  return <section className="shell py-10"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-wider text-leaf">Tregu me shumicë</p><h1 className="mt-1 text-4xl font-extrabold">Gjej prodhime lokale</h1><p className="mt-3 text-slate-600">Kërko sipas qytetit, kategorisë ose emrit të produktit.</p></div><form className="card mt-7 grid gap-3 p-4 md:grid-cols-[1fr_200px_200px_auto]"><div><label className="sr-only" htmlFor="q">Kërko</label><input id="q" name="q" defaultValue={search.q} placeholder="p.sh. domate, djathë…" /></div><select aria-label="Qyteti" name="city" defaultValue={search.city ?? ""}><option value="">Të gjitha qytetet</option>{kosovoCities.map((city) => <option key={city}>{city}</option>)}</select><select aria-label="Kategoria" name="category" defaultValue={search.category ?? ""}><option value="">Të gjitha kategoritë</option>{categories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}</select><button className="button-primary">Kërko</button></form>{visible.length === 0 ? <div className="card mt-8 p-9 text-center"><h2 className="text-xl font-bold">Nuk gjetëm produkte</h2><p className="mt-2 text-slate-600">Provoni një kërkim ose filtër tjetër.</p></div> : <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((product) => <ProductCard key={product.id} product={product} />)}</div>}{hasMore && next ? <div className="mt-8 text-center"><Link className="button-secondary" href={`/produkte?${params.toString()}`}>Shfaq më shumë produkte</Link></div> : null}</section>;
}
