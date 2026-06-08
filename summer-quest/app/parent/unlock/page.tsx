import { redirect } from "next/navigation";

import { ParentUnlockForm } from "@/components/ParentUnlockForm";
import { getParentPinHash, hasParentAccess } from "@/lib/parent-access";

export const dynamic = "force-dynamic";

export default async function ParentUnlockPage() {
  const pinHash = await getParentPinHash();

  if (!pinHash) {
    redirect("/parent");
  }

  if (await hasParentAccess(pinHash)) {
    redirect("/parent");
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 py-12"
      style={{ background: "linear-gradient(160deg, #f1f5f9 0%, #e8edf5 100%)" }}
    >
      <div className="w-full max-w-sm">
        <div
          className="rounded-3xl p-8 shadow-xl"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="text-center">
            <div className="text-5xl">🔐</div>
            <h1 className="mt-4 text-3xl font-black text-slate-950">Bảng phụ huynh</h1>
            <p className="mt-2 font-semibold text-slate-500">Nhập mã để tiếp tục</p>
          </div>
          <ParentUnlockForm />
        </div>
      </div>
    </main>
  );
}
