import Link from "next/link";

import { ParentPinSetup } from "@/components/ParentPinSetup";
import { StudentAccessSettings } from "@/components/StudentAccessSettings";
import { getParentPinHash, requireParentAccess } from "@/lib/parent-access";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ParentSettingsPage() {
  await requireParentAccess();

  const [students, pinHash] = await Promise.all([
    prisma.student.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        displayName: true,
        accessCodeHash: true,
      },
    }),
    getParentPinHash(),
  ]);

  return (
    <main className="min-h-screen px-6 py-8" style={{ background: "linear-gradient(160deg, #f1f5f9 0%, #e8edf5 100%)" }}>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <Link href="/parent" className="font-black text-indigo-700">
            ← Bảng phụ huynh
          </Link>
          <div className="mt-4">
            <div className="text-sm font-black uppercase text-indigo-700">Cài đặt gia đình</div>
            <h1 className="mt-2 text-4xl font-black text-slate-950">Cài đặt bảo mật</h1>
            <p className="mt-2 max-w-3xl font-semibold leading-7 text-slate-600">
              Đặt mã vào bảng phụ huynh và mã riêng cho hồ sơ của từng bé.
            </p>
          </div>
        </div>

        <ParentPinSetup hasPin={Boolean(pinHash)} />

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-2xl font-black text-slate-950">Mã vào hồ sơ của từng bé</h2>
          <p className="mt-2 max-w-3xl font-semibold leading-7 text-slate-600">
            Dùng mã riêng để Yumi và Johnny không vào nhầm hồ sơ của nhau khi học chung trên một máy.
            Mã chỉ lưu trên máy gia đình, không cần tài khoản cloud.
          </p>
          <div className="mt-4">
            <StudentAccessSettings
              students={students.map((student) => ({
                id: student.id,
                displayName: student.displayName,
                hasAccessCode: Boolean(student.accessCodeHash),
              }))}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
