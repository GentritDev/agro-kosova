import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { InquiryActions } from "@/components/inquiry-actions";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { unitLabels } from "@/lib/constants";

export const dynamic = "force-dynamic";
export default async function InquiriesPage() {
  const user = await getCurrentUser(); if (!user) redirect("/hyr");
  const isBusiness = user.role === "BUSINESS";
  const businessInquiries = isBusiness ? await prisma.inquiry.findMany({ where: { businessId: user.id }, include: { product: true }, orderBy: { createdAt: "desc" } }) : [];
  const farmerInquiries = !isBusiness ? await prisma.inquiry.findMany({ where: { product: { farmerId: user.id } }, include: { product: true, business: { select: { name: true, businessName: true, city: true } } }, orderBy: { createdAt: "desc" } }) : [];
  const none = businessInquiries.length === 0 && farmerInquiries.length === 0;
  return <section className="shell py-10"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-sm font-bold text-leaf">{isBusiness ? user.businessName : user.name}</p><h1 className="text-3xl font-extrabold">{isBusiness ? "Kërkesat e mia" : "Kërkesat e pranuara"}</h1></div><div className="flex gap-2"><Link className="button-secondary" href={isBusiness ? "/produkte" : "/fermeri"}>{isBusiness ? "Produktet" : "Paneli im"}</Link><form action={logoutAction}><button className="button-secondary">Dil</button></form></div></div>{none ? <div className="card mt-8 p-9 text-center"><h2 className="text-xl font-bold">Ende pa kërkesa</h2><p className="mt-2 text-slate-600">{isBusiness ? "Kur kontaktoni një fermer, kërkesa juaj shfaqet këtu." : "Kërkesat e bizneseve për produktet tuaja do të shfaqen këtu."}</p></div> : <div className="mt-8 space-y-4">{isBusiness ? businessInquiries.map((inquiry) => <article className="card p-5" key={inquiry.id}><h2 className="text-xl font-bold">{inquiry.product.name}</h2><p className="mt-1 text-slate-600">Sasia: <strong>{inquiry.quantity.toString()} {unitLabels[inquiry.product.unit]}</strong></p>{inquiry.message && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">{inquiry.message}</p>}<span className="mt-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{inquiry.status === "OPEN" ? "Në pritje" : inquiry.status === "ACCEPTED" ? "Pranuar" : "Refuzuar"}</span></article>) : farmerInquiries.map((inquiry) => <article className="card p-5" key={inquiry.id}><div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-bold">{inquiry.product.name}</h2><p className="mt-1 text-slate-600">Sasia: <strong>{inquiry.quantity.toString()} {unitLabels[inquiry.product.unit]}</strong></p><p className="mt-2 text-sm text-slate-600">Nga: {inquiry.business.businessName || inquiry.business.name} · {inquiry.business.city}</p>{inquiry.message && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">{inquiry.message}</p>}</div><div className="flex flex-col items-end gap-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{inquiry.status === "OPEN" ? "Në pritje" : inquiry.status === "ACCEPTED" ? "Pranuar" : "Refuzuar"}</span>{inquiry.status === "OPEN" && <InquiryActions id={inquiry.id} />}</div></div></article>)}</div>}</section>;
}
