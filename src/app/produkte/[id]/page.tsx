import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { categoryLabels, unitLabels } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const product = await prisma.product.findFirst({ where: { id: (await params).id, status: "ACTIVE" }, include: { farmer: { select: { name: true } } } });
  if (!product) notFound();
  const user = await getCurrentUser();
  return <section className="shell py-10"><Link href="/produkte" className="text-sm font-bold text-forest hover:text-leaf">← Të gjitha produktet</Link><div className="mt-5 grid gap-8 lg:grid-cols-[1.25fr_.75fr]"><div><div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-green-50"><Image src={product.imageUrls[0] || "/placeholders/perime.svg"} alt={`Foto e ${product.name}`} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 65vw" /></div>{product.imageUrls.length > 1 && <div className="mt-3 grid grid-cols-3 gap-3">{product.imageUrls.slice(1).map((url) => <div key={url} className="relative aspect-square overflow-hidden rounded-xl"><Image src={url} alt="" fill className="object-cover" sizes="200px" /></div>)}</div>}</div><aside className="card p-5 sm:p-7"><p className="text-sm font-bold uppercase tracking-wide text-leaf">{categoryLabels[product.category]}</p><h1 className="mt-2 text-3xl font-extrabold">{product.name}</h1><p className="mt-4 whitespace-pre-line leading-7 text-slate-700">{product.description}</p><dl className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-200 py-5 text-sm"><div><dt className="text-slate-500">Çmimi</dt><dd className="mt-1 text-xl font-extrabold text-forest">€{product.pricePerUnit.toString()} / {unitLabels[product.unit]}</dd></div><div><dt className="text-slate-500">Në dispozicion</dt><dd className="mt-1 font-bold">{product.quantityAvailable.toString()} {unitLabels[product.unit]}</dd></div><div><dt className="text-slate-500">Qyteti i fermerit</dt><dd className="mt-1 font-bold">{product.city}</dd></div><div><dt className="text-slate-500">Data e vjeljes</dt><dd className="mt-1 font-bold">{new Intl.DateTimeFormat("sq", { dateStyle: "long" }).format(product.harvestDate)}</dd></div>{product.minOrderQuantity && <div><dt className="text-slate-500">Porosia minimale</dt><dd className="mt-1 font-bold">{product.minOrderQuantity.toString()} {unitLabels[product.unit]}</dd></div>}<div><dt className="text-slate-500">Fermeri</dt><dd className="mt-1 font-bold">{product.farmer.name}</dd></div></dl><div className="mt-6"><ContactForm productId={product.id} unit={product.unit} minOrderQuantity={product.minOrderQuantity?.toString() ?? null} signedIn={user?.role === "BUSINESS"} /></div></aside></div></section>;
}
