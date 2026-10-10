import Link from "next/link";
import { LoginForm } from "@/components/auth-form";

export const metadata = { title: "Hyr" };
export default function LoginPage() { return <section className="shell py-12"><div className="card mx-auto max-w-md p-6 sm:p-8"><h1 className="text-3xl font-bold">Mirë se erdhët</h1><p className="mt-2 text-slate-600">Hyni me numrin e telefonit dhe PIN-in tuaj.</p><div className="mt-7"><LoginForm /></div><p className="mt-5 text-center text-sm text-slate-600">Nuk keni llogari? <Link className="font-bold text-forest" href="/regjistrohu">Regjistrohuni</Link></p></div></section>; }
