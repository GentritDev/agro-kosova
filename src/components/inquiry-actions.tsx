"use client";

import { useRouter } from "next/navigation";
import { updateInquiryStatusAction } from "@/app/actions/inquiries";

export function InquiryActions({ id }: { id: string }) {
  const router = useRouter();
  async function update(status: "ACCEPTED" | "DECLINED") { const result = await updateInquiryStatusAction(id, status); if (!result.ok) window.alert(result.message); else router.refresh(); }
  return <div className="flex gap-2"><button className="button-primary !min-h-9 !px-3 !py-1 text-sm" onClick={() => update("ACCEPTED")}>Prano</button><button className="button !min-h-9 !px-3 !py-1 text-sm text-red-700 hover:bg-red-50" onClick={() => update("DECLINED")}>Refuzo</button></div>;
}
