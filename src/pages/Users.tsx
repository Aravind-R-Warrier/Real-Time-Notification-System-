// src/pages/Users.tsx
import React, { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { Card } from "../components/cards/Card";
import Button from "../components/ui/Button";
import UserTable from "../components/users/UserTable";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { 
  Download, UserPlus, RefreshCw, Trash2, 
  UserCheck, UserX, Users as UsersIcon, 
  AlertCircle, Check, X, ChevronDown, ChevronUp,
  BarChart3, Shield, Zap, Crown, Sparkles
} from "lucide-react";

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

const PlanIcon = ({ plan }: { plan: string }) => {
  const icons: Record<string, JSX.Element> = {
    enterprise: <Crown className="w-4 h-4" />,
    business: <Zap className="w-4 h-4" />,
    pro: <Sparkles className="w-4 h-4" />,
    free: <Shield className="w-4 h-4" />,
  };
  return icons[plan.toLowerCase()] || <Shield className="w-4 h-4" />;
};

export default function UsersPage() {
  const [users, setUsers] = useLocalStorage<User[]>("saas.users.v1", []);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [expandedStats, setExpandedStats] = useState(false);

  // derived metrics
  const totals = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.active).length;
    const inactive = total - active;
    const planCounts = users.reduce((acc, user) => {
      acc[user.plan] = (acc[user.plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { total, active, inactive, planCounts };
  }, [users]);

  const planDistribution = [
    { name: "Free", count: totals.planCounts.Free || 0, color: "from-gray-400 to-slate-500" },
    { name: "Pro", count: totals.planCounts.Pro || 0, color: "from-green-400 to-emerald-500" },
    { name: "Business", count: totals.planCounts.Business || 0, color: "from-blue-400 to-cyan-500" },
    { name: "Enterprise", count: totals.planCounts.Enterprise || 0, color: "from-purple-400 to-pink-500" },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
              Manage workspace users, subscriptions and access controls
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setInviteOpen(true)}
              className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
            <Button
              variant="primary"
              onClick={handleExportCSV}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Overview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">User Analytics</h2>
            </div>
            <button
              onClick={() => setExpandedStats(!expandedStats)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {expandedStats ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">Total Users</p>
              <p className="text-2xl font-bold mt-2">{totals.total}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-xl p-4">
              <p className="text-sm text-green-600 dark:text-green-400">Active</p>
              <p className="text-2xl font-bold mt-2">{totals.active}</p>
              <p className="text-xs text-gray-500 mt-1">{Math.round((totals.active / totals.total) * 100) || 0}% active</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-xl p-4">
              <p className="text-sm text-red-600 dark:text-red-400">Inactive</p>
              <p className="text-2xl font-bold mt-2">{totals.inactive}</p>
              <p className="text-xs text-gray-500 mt-1">{Math.round((totals.inactive / totals.total) * 100) || 0}% inactive</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400">Paid Plans</p>
              <p className="text-2xl font-bold mt-2">{users.filter(u => u.plan !== 'Free').length}</p>
              <p className="text-xs text-gray-500 mt-1">Premium users</p>
            </div>
          </div>

          {/* Expanded Stats - Hidden on mobile unless toggled */}
          <div className={`${expandedStats ? 'block' : 'hidden lg:block'}`}>
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Plan Distribution</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {planDistribution.map((plan) => (
                  <div key={plan.name} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PlanIcon plan={plan.name} />
                        <span className="font-medium">{plan.name}</span>
                      </div>
                      <span className="text-2xl font-bold">{plan.count}</span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${plan.color}`}
                          style={{ width: `${(plan.count / totals.total) * 100 || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bulk Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 shadow-lg border">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Bulk Actions</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Apply actions to all users at once
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => bulkToggleActive(true)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg"
              >
                <Check className="w-4 h-4 mr-2" />
                Activate All
              </Button>
              <Button
                variant="outline"
                onClick={() => bulkToggleActive(false)}
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <UserX className="w-4 h-4 mr-2" />
                Deactivate All
              </Button>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 shadow-lg border">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold">Data Management</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Seed demo data or reset user database
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSeedDemo}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Seed Demo Data
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm("Clear all users?")) setUsers([]);
                }}
                className="flex-1"
              >
                Clear Users
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Danger Zone</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Permanent actions - cannot be undone
            </p>
            <Button
              variant="danger"
              onClick={handleClearAll}
              className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:shadow-lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>

        {/* User Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden">
     
          <div className="p-2 sm:p-4">
            <UserTable users={users} setUsers={setUsers} />
          </div>
        </div>

      </div>

      {/* Invite Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm" 
            onClick={() => setInviteOpen(false)} 
          />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 mx-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Invite User</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Send invitation to join your workspace
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInviteOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleInviteSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  placeholder="user@example.com"
                  autoFocus
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Demo: This creates a local user entry. In production, this would send an actual email invitation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button
                  variant="ghost"
                  onClick={() => setInviteOpen(false)}
                  type="button"
                  className="w-full sm:w-auto px-4 py-3 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}