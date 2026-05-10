// src/components/layout/Sidebar.tsx
import Link from 'next/link';

export function Sidebar({ userRole }: { userRole: string }) {
  return (
    <aside className="w-64 bg-slate-900 text-white p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">EvoEdge HRMS</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="hover:bg-slate-800 p-2 rounded">Home</Link>
        <Link href="/leaves" className="hover:bg-slate-800 p-2 rounded">Leaves</Link>
        <Link href="/salery" className="hover:bg-slate-800 p-2 rounded">Salery</Link>
      </nav>
    </aside>
  );
}