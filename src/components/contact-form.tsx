"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { contactProductAction } from "@/app/actions/inquiries";
import { unitLabels } from "@/lib/constants";

export function ContactForm({ productId, unit, minOrderQuantity, signedIn }: { productId: string; unit: "KG" | "TON" | "PIECE" | "LITER"; minOrderQuantity: string | null; signedIn: boolean }) {
  const [state, action, pending] = useActionState(contactProductAction, null);
  const [channel, setChannel] = useState<"whatsappUrl" | "viberUrl">("whatsappUrl");
  useEffect(() => { if (state?.ok) window.location.assign(state.data[channel]); }, [channel, state]);
  if (!signedIn) return <div className="rounded-xl bg-green-50 p-4 text-sm text-forest"><p className="font-bold">Kontakti është për biznese të regjistruara.</p><Link className="mt-2 inline-block underline" href={`/regjistrohu?continue=/produkte/${productId}`}>Regjistrohuni për të kontaktuar fermerin</Link></div>;
  return <form action={action} className="space-y-3"><input type="hidden" name="productId" value={productId} /><div><label className="field-label" htmlFor="quantity">Sasia që kërkoni ({unitLabels[unit]})</label><input id="quantity" name="quantity" inputMode="decimal" required min={minOrderQuantity ?? "0.01"} placeholder={minOrderQuantity ? `Minimumi: ${minOrderQuantity}` : "p.sh. 50"} /></div><div><label className="field-label" htmlFor="message">Mesazh <span className="font-normal">(opsionale)</span></label><textarea id="message" name="message" rows={3} maxLength={500} placeholder="Detaje për porosinë" /></div>{state && !state.ok && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.message}</p>}<div className="grid gap-2 sm:grid-cols-2"><button onClick={() => setChannel("whatsappUrl")} className="button-primary" disabled={pending}>{pending ? "Duke hapur…" : "WhatsApp"}</button><button onClick={() => setChannel("viberUrl")} className="button-secondary" disabled={pending}>Viber</button></div></form>;
}
