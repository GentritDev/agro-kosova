"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction, registerAction } from "@/app/actions/auth";
import { kosovoCities } from "@/lib/constants";

function ErrorMessage({ message }: { message?: string }) { return message ? <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</p> : null; }

export function LoginForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(loginAction, null);
  useEffect(() => { if (state?.ok) router.push(state.data.redirectTo); }, [router, state]);
  return <form action={action} className="space-y-4"><div><label className="field-label" htmlFor="phone">Numri i telefonit</label><input id="phone" name="phone" inputMode="tel" autoComplete="tel" placeholder="044 123 456" required /></div><div><label className="field-label" htmlFor="pin">PIN-i 6-shifror</label><input id="pin" name="pin" inputMode="numeric" pattern="[0-9]{6}" autoComplete="current-password" placeholder="••••••" required /></div><ErrorMessage message={state && !state.ok ? state.message : undefined} /><button className="button-primary w-full" disabled={pending}>{pending ? "Duke hyrë…" : "Hyr"}</button></form>;
}

export function RegisterForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(registerAction, null);
  useEffect(() => { if (state?.ok) router.push(state.data.redirectTo); }, [router, state]);
  return <form action={action} className="space-y-4"><div><label className="field-label" htmlFor="name">Emri dhe mbiemri</label><input id="name" name="name" autoComplete="name" required /></div><div><label className="field-label" htmlFor="phone">Numri i telefonit</label><input id="phone" name="phone" inputMode="tel" autoComplete="tel" placeholder="044 123 456" required /></div><div><label className="field-label" htmlFor="pin">Zgjidhni PIN-in 6-shifror</label><input id="pin" name="pin" inputMode="numeric" pattern="[0-9]{6}" autoComplete="new-password" required /></div><fieldset><legend className="field-label">Unë jam</legend><div className="grid grid-cols-2 gap-3"><label className="rounded-xl border border-slate-300 p-3 has-[:checked]:border-leaf has-[:checked]:bg-green-50"><input className="mr-2 w-auto" type="radio" name="role" value="FARMER" defaultChecked />Fermer</label><label className="rounded-xl border border-slate-300 p-3 has-[:checked]:border-leaf has-[:checked]:bg-green-50"><input className="mr-2 w-auto" type="radio" name="role" value="BUSINESS" />Biznes</label></div></fieldset><div><label className="field-label" htmlFor="businessName">Emri i biznesit <span className="font-normal">(i nevojshëm për biznese)</span></label><input id="businessName" name="businessName" maxLength={120} /></div><div><label className="field-label" htmlFor="city">Qyteti</label><select id="city" name="city" defaultValue="" required><option value="" disabled>Zgjidhni qytetin</option>{kosovoCities.map((city) => <option key={city}>{city}</option>)}</select></div><ErrorMessage message={state && !state.ok ? state.message : undefined} /><button className="button-primary w-full" disabled={pending}>{pending ? "Duke krijuar llogarinë…" : "Krijo llogarinë"}</button></form>;
}
