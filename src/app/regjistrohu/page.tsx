import Link from "next/link";
import { RegisterForm } from "@/components/auth-form";

export const metadata = { title: "Regjistrohu" };
export default function RegisterPage() { return <section className="shell py-12"><div className="card mx-auto max-w-lg p-6 sm:p-8"><h1 className="text-3xl font-bold">Krijoni llogari</h1><p className="mt-2 text-slate-600">Mjafton numri i telefonit dhe një PIN që e mbani mend.</p><div className="mt-7"><RegisterForm /></div><p className="mt-5 text-center text-sm text-slate-600">Keni llogari? <Link className="font-bold text-forest" href="/hyr">Hyni</Link></p></div></section>; }
