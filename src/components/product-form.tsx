"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/result";
import { categories, categoryLabels, kosovoCities, units, unitLabels } from "@/lib/constants";

type FormAction = (state: ActionResult<{ id: string }> | null, formData: FormData) => Promise<ActionResult<{ id: string }>>;
type FormProduct = Pick<Product, "name" | "description" | "category" | "unit" | "quantityAvailable" | "pricePerUnit" | "minOrderQuantity" | "city" | "harvestDate" | "imageUrls">;

export function ProductForm({ action, product }: { action: FormAction; product?: FormProduct }) {
  const router = useRouter();
  const [state, submit, pending] = useActionState(action, null);
  const [uploadError, setUploadError] = useState<string>();
  async function submitWithUpload(formData: FormData) {
    setUploadError(undefined);
    const files = formData.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
    if (files.length) {
      const upload = new FormData(); files.forEach((file) => upload.append("photos", file));
      const response = await fetch("/api/uploads", { method: "POST", body: upload });
      const result = await response.json() as { ok: boolean; message?: string; data?: { urls: string[] } };
      if (!result.ok || !result.data) { setUploadError(result.message ?? "Ngarkimi i fotove dështoi."); return; }
      formData.set("imageUrls", JSON.stringify(result.data.urls));
    }
    if (!files.length && !product?.imageUrls.length) { setUploadError("Ngarkoni së paku një foto."); return; }
    await submit(formData);
  }
  if (state?.ok) router.push("/fermeri");
  return <form action={submitWithUpload} className="space-y-5"><input type="hidden" name="imageUrls" value={JSON.stringify(product?.imageUrls ?? [])} /><div><label className="field-label" htmlFor="name">Emri i produktit</label><input id="name" name="name" defaultValue={product?.name} required /></div><div><label className="field-label" htmlFor="description">Përshkrimi</label><textarea id="description" name="description" defaultValue={product?.description} rows={5} required /></div><div className="grid gap-4 sm:grid-cols-2"><div><label className="field-label" htmlFor="category">Kategoria</label><select id="category" name="category" defaultValue={product?.category ?? ""} required><option value="" disabled>Zgjidhni</option>{categories.map((value) => <option key={value} value={value}>{categoryLabels[value]}</option>)}</select></div><div><label className="field-label" htmlFor="unit">Njësia</label><select id="unit" name="unit" defaultValue={product?.unit ?? ""} required><option value="" disabled>Zgjidhni</option>{units.map((value) => <option key={value}>{unitLabels[value]}</option>)}</select></div></div><div className="grid gap-4 sm:grid-cols-3"><div><label className="field-label" htmlFor="quantityAvailable">Sasia në dispozicion</label><input id="quantityAvailable" name="quantityAvailable" inputMode="decimal" defaultValue={product?.quantityAvailable.toString()} required /></div><div><label className="field-label" htmlFor="pricePerUnit">Çmimi për njësi (€)</label><input id="pricePerUnit" name="pricePerUnit" inputMode="decimal" defaultValue={product?.pricePerUnit.toString()} required /></div><div><label className="field-label" htmlFor="minOrderQuantity">Porosia minimale</label><input id="minOrderQuantity" name="minOrderQuantity" inputMode="decimal" defaultValue={product?.minOrderQuantity?.toString()} /></div></div><div className="grid gap-4 sm:grid-cols-2"><div><label className="field-label" htmlFor="city">Qyteti</label><select id="city" name="city" defaultValue={product?.city ?? ""} required><option value="" disabled>Zgjidhni</option>{kosovoCities.map((city) => <option key={city}>{city}</option>)}</select></div><div><label className="field-label" htmlFor="harvestDate">Data e vjeljes</label><input id="harvestDate" name="harvestDate" type="date" defaultValue={product?.harvestDate.toISOString().slice(0, 10)} required /></div></div><div><label className="field-label" htmlFor="photos">Fotot (JPEG, PNG ose WebP, deri 5 MB secila)</label><input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple={!product} required={!product} />{product?.imageUrls.length ? <p className="mt-2 text-sm text-slate-600">Lërini bosh për t’i ruajtur fotot ekzistuese.</p> : null}</div>{(uploadError || (state && !state.ok ? state.message : undefined)) && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{uploadError ?? (state && !state.ok ? state.message : "")}</p>}<button className="button-primary w-full" disabled={pending}>{pending ? "Duke ruajtur…" : product ? "Ruaj ndryshimet" : "Publiko produktin"}</button></form>;
}
