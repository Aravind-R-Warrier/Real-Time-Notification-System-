// src/pages/Users.tsx
import React, { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { Card } from "../components/cards/Card";
import Button from "../components/ui/Button";
import UserTable from "../components/users/UserTable";
import { useLocalStorage } from "../hooks/useLocalStorage";



type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  active: boolean;
  plan: string;
};

function toCSV(rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const header = keys.join(",");
  const lines = rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","));
  return [header, ...lines].join("\n");
}

function downloadCSV(content: string, filename = "users.csv") {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generateDemoUsers(count = 50): User[] {
  const plans = ["Free", "Pro", "Business", "Enterprise"];
  const now = Date.now();
  return Array.from({ length: count }).map((_, i) => {
    const name = `Demo User ${i + 1}`;
    const email = `demo${i + 1}@example.com`;
    return {
      id: uuid(),
      name,
      email,
      createdAt: new Date(now - i * 1000 * 60 * 60 * 24).toISOString(),
      active: Math.random() > 0.15, // mostly active
      plan: plans[i % plans.length],
    };
  });
}

export default function UsersPage() {
  // Use the same localStorage key as UserTable
  const [users, setUsers] = useLocalStorage<User[]>("saas.users.v1", []);
  const [selectedAll, setSelectedAll] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  // derived metrics
  const totals = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.active).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [users]);

  function handleExportCSV() {
    const rows = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      plan: u.plan,
      active: u.active ? "yes" : "no",
      createdAt: u.createdAt,
    }));
    const csv = toCSV(rows);
    if (!csv) {
      alert("No users to export");
      return;
    }
    downloadCSV(csv, `saas-users-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  function handleSeedDemo() {
    const demo = generateDemoUsers(74);
    setUsers(demo);
    alert(`Seeded ${demo.length} demo users`);
  }

  function handleClearAll() {
    if (!confirm("Clear all users from localStorage? This cannot be undone.")) return;
    setUsers([]);
  }

  function bulkToggleActive(active: boolean) {
    const next = users.map((u) => ({ ...u, active }));
    setUsers(next);
  }

  function handleInviteSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!inviteEmail.trim()) {
      alert("Enter an email to invite");
      return;
    }
    const newUser: User = {
      id: uuid(),
      name: inviteEmail.split("@")[0] || "Invited User",
      email: inviteEmail,
      createdAt: new Date().toISOString(),
      active: true,
      plan: "Free",
    };
    setUsers([newUser, ...users]);
    setInviteEmail("");
    setInviteOpen(false);
    alert(`Invitation (demo) created for ${newUser.email}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Users</h2>
          <p className="text-sm text-gray-500">Manage workspace users - search, export, and perform bulk actions.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white rounded-md p-2 shadow-sm">
            <div className="text-xs text-gray-600 mr-2">Total</div>
            <div className="text-sm font-semibold">{totals.total}</div>
            <div className="text-xs px-2 text-gray-500">•</div>
            <div className="text-xs text-green-600 font-medium">{totals.active} active</div>
            <div className="text-xs px-2 text-gray-500">•</div>
            <div className="text-xs text-gray-500">{totals.inactive} inactive</div>
          </div>

          <Button variant="outline" onClick={() => setInviteOpen(true)}>
            Invite user
          </Button>

          <div className="hidden sm:block">
            <Button variant="primary" onClick={handleExportCSV}>
              Export CSV
            </Button>
          </div>

          <div className="sm:hidden">
            <Button variant="ghost" onClick={handleExportCSV}>
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Controls + quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Bulk actions</div>
              <div className="text-xs text-gray-400">Apply to all users</div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => bulkToggleActive(true)}>
                Activate all
              </Button>
              <Button size="sm" variant="danger" onClick={() => bulkToggleActive(false)}>
                Deactivate all
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Seed / Reset</div>
              <div className="text-xs text-gray-400">Quick demo data for interviews</div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={handleSeedDemo}>
                Seed demo
              </Button>
              <Button size="sm" variant="outline" onClick={() => setUsers([])}>
                Clear
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Danger</div>
              <div className="text-xs text-gray-400">Remove persisted users</div>
            </div>
            <div>
              <Button size="sm" variant="danger" onClick={handleClearAll}>
                Clear storage
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Primary table area */}
      <div>
        <Card title="User Directory">
          {/* Keep layout consistent with your UserTable expectations */}
          <div className="mb-3 text-sm text-gray-500">Tip: Use the search box to quickly find users.</div>
          <UserTable />
        </Card>
      </div>

      {/* Invite modal (very lightweight, client-only demo) */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setInviteOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6 z-10">
            <h3 className="text-lg font-semibold mb-2">Invite user (demo)</h3>
            <p className="text-sm text-gray-500 mb-4">This demo creates a local user entry. In production, send an email invite via your backend.</p>

            <form
              onSubmit={(e) => {
                handleInviteSubmit(e);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs text-gray-600">Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="user@example.com"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={() => setInviteOpen(false)} type="button">
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Send invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
