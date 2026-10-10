import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { ProductManageActions } from "@/components/product-manage-actions";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { unitLabels } from "@/lib/constants";

export const dynamic = "force-dynamic";
export default async function FarmerDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/hyr");
  if (user.role !== "FARMER") redirect("/kerkesat");
  const products = await prisma.product.findMany({ where: { farmerId: user.id }, orderBy: { updatedAt: "desc" } });
  return <section className="shell py-10"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-leaf">Mirë se erdhe, {user.name}</p><h1 className="text-3xl font-extrabold">Produktet e mia</h1></div><div className="flex gap-2"><form action={logoutAction}><button className="button-secondary">Dil</button></form><Link className="button-primary" href="/fermeri/produkte/i-ri">+ Shto produkt</Link></div></div>{products.length === 0 ? <div className="card mt-8 p-8 text-center"><h2 className="text-xl font-bold">Nuk keni produkte ende</h2><p className="mt-2 text-slate-600">Shtoni prodhimin tuaj të parë me foto dhe datën e vjeljes.</p><Link className="button-primary mt-5" href="/fermeri/produkte/i-ri">Shto produkt</Link></div> : <div className="mt-8 space-y-4">{products.map((product) => <article key={product.id} className="card flex flex-col gap-4 p-4 sm:flex-row"><div className="relative h-32 w-full overflow-hidden rounded-xl bg-green-50 sm:w-44"><Image src={product.imageUrls[0] || "/placeholders/perime.svg"} alt="" fill className="object-cover" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="text-xl font-bold">{product.name}</h2><p className="mt-1 text-sm text-slate-600">{product.quantityAvailable.toString()} {unitLabels[product.unit]} · €{product.pricePerUnit.toString()} / {unitLabels[product.unit]}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{product.status === "ACTIVE" ? "Aktiv" : product.status === "HIDDEN" ? "I fshehur" : "I shitur"}</span></div><div className="mt-4 flex flex-wrap items-center gap-3"><Link className="font-semibold text-forest hover:text-leaf" href={`/fermeri/produkte/${product.id}`}>Ndrysho</Link><ProductManageActions id={product.id} status={product.status} /></div></div></article>)}</div>}</section>;
}
