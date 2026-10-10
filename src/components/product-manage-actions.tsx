"use client";

import { useRouter } from "next/navigation";
import { deleteProductAction, setProductStatusAction } from "@/app/actions/products";

export function ProductManageActions({ id, status }: { id: string; status: "ACTIVE" | "HIDDEN" | "SOLD_OUT" }) {
  const router = useRouter();
  async function setStatus(next: "ACTIVE" | "HIDDEN" | "SOLD_OUT") { const result = await setProductStatusAction(id, next); if (!result.ok) window.alert(result.message); else router.refresh(); }
  async function remove() { if (!window.confirm("A dëshironi ta fshini këtë produkt?")) return; const result = await deleteProductAction(id); if (!result.ok) window.alert(result.message); else router.refresh(); }
  return <div className="flex flex-wrap gap-2"><button className="button-secondary !min-h-9 !px-3 !py-1 text-sm" onClick={() => setStatus(status === "HIDDEN" ? "ACTIVE" : "HIDDEN")}>{status === "HIDDEN" ? "Publiko" : "Fsheh"}</button><button className="button-secondary !min-h-9 !px-3 !py-1 text-sm" onClick={() => setStatus("SOLD_OUT")}>Shitur</button><button className="button !min-h-9 !px-3 !py-1 text-sm text-red-700 hover:bg-red-50" onClick={remove}>Fshij</button></div>;
}
