// src/components/users/UserTable.tsx
import React, { useMemo, useState } from "react";
import { Card } from "../cards/Card";
import Button from "../ui/Button";

/**
 * Uses localStorage key 'saas.users.v1' seeded by saasSeed.
 * Features:
 * - search
 * - simple pagination
 * - deactivate/reactivate action
 */

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  active: boolean;
  plan: string;
};

const PAGE_SIZE = 10;

export default function UserTable() {
  const raw = typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("saas.users.v1") || "[]") as User[]) : [];
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>(raw);

  // sync on mount for live updates (if seed changes)
  React.useEffect(() => {
    setUsers(raw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return users;
    return users.filter(u => `${u.name} ${u.email}`.toLowerCase().includes(q));
  }, [users, query]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  function toggleActive(id: string) {
    const next = users.map(u => u.id === id ? { ...u, active: !u.active } : u);
    setUsers(next);
    localStorage.setItem("saas.users.v1", JSON.stringify(next));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <input placeholder="Search users..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="border px-2 py-1 rounded" />
          <Button variant="ghost" onClick={() => { setUsers(raw); localStorage.setItem("saas.users.v1", JSON.stringify(raw)); }}>Reset</Button>
        </div>
        <div className="text-sm text-gray-500">Showing {filtered.length} users</div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Plan</th>
              <th className="py-2">Signup</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.plan}</td>
                <td className="py-2 text-xs text-gray-500">{new Date(u.createdAt).toLocaleString()}</td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${u.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {u.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => window.alert(`View ${u.name} (demo)`)}>View</Button>
                    <Button size="sm" variant={u.active ? "danger" : "primary"} onClick={() => toggleActive(u.id)}>
                      {u.active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-gray-500">Page {page}</div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
          <Button size="sm" onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
