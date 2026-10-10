import { redirect } from "next/navigation";
import { createProductAction } from "@/app/actions/products";
import { ProductForm } from "@/components/product-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export default async function NewProductPage() { const user = await getCurrentUser(); if (!user || user.role !== "FARMER") redirect("/hyr"); return <section className="shell max-w-3xl py-10"><h1 className="text-3xl font-extrabold">Shto produkt</h1><p className="mt-2 text-slate-600">Fotot e qarta dhe data e vjeljes ndihmojnë bizneset të vendosin më shpejt.</p><div className="card mt-7 p-5 sm:p-7"><ProductForm action={createProductAction} /></div></section>; }
