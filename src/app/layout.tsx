import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";

export const metadata: Metadata = { title: { default: "AgroKosova", template: "%s | AgroKosova" }, description: "Tregu B2B për prodhuesit dhe bizneset e Kosovës." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sq"><body><header className="border-b border-slate-200 bg-white"><div className="shell flex min-h-16 items-center justify-between gap-4"><Link href="/" className="text-xl font-extrabold tracking-tight text-forest">AgroKosova</Link><nav aria-label="Navigimi kryesor" className="flex items-center gap-4 text-sm font-semibold"><Link href="/produkte" className="hover:text-leaf">Produktet</Link><Link href="/hyr" className="hover:text-leaf">Hyr</Link><Link href="/regjistrohu" className="button-primary">Regjistrohu</Link></nav></div></header><main>{children}</main><footer className="mt-16 border-t border-slate-200 bg-white py-8"><div className="shell text-sm text-slate-600">AgroKosova — lidh prodhuesit e Kosovës me bizneset lokale.</div></footer></body></html>;
}
