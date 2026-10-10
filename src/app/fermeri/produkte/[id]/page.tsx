import { notFound, redirect } from "next/navigation";
import { updateProductAction } from "@/app/actions/products";
import { ProductForm } from "@/components/product-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) { const user = await getCurrentUser(); if (!user || user.role !== "FARMER") redirect("/hyr"); const product = await prisma.product.findFirst({ where: { id: (await params).id, farmerId: user.id } }); if (!product) notFound(); return <section className="shell max-w-3xl py-10"><h1 className="text-3xl font-extrabold">Ndrysho produktin</h1><div className="card mt-7 p-5 sm:p-7"><ProductForm action={updateProductAction.bind(null, product.id)} product={product} /></div></section>; }
