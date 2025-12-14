import React, { useEffect, useState } from "react";
import {
  Check,
  CreditCard,
  Download,
  Sparkles,
  Zap,
  Crown,
  Shield,
  Menu,
  X,
} from "lucide-react";
import {
  fetchBillingData,
  upgradeSubscription,
  downloadInvoice,
} from "../api/mock/billingApi";
import PageHeader from "../components/layout/PageHeader";

const PlanIcon = ({ planId }: { planId: string }) => {
  const icons: Record<string, React.ReactNode> = {
    starter: <Sparkles className="w-5 h-5" />,
    professional: <Zap className="w-5 h-5" />,
    enterprise: <Crown className="w-5 h-5" />,
  };
  return icons[planId] || <Shield className="w-5 h-5" />;
};

export default function ModernBilling() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchBillingData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading billing details...</p>
        </div>
      </div>
    );
  }

  const { plans, subscription, invoices } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center px-2">
          <PageHeader
            title="Billing & Subscription"
            description="Manage your plan, payment method and invoices."
          />
        </div>

        {/* Current Subscription */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-semibold">
              Current Subscription
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-fit">
                  <PlanIcon planId={subscription.planId} />
                  <span className="text-white font-semibold capitalize text-sm sm:text-base">
                    {subscription.planId} Plan
                  </span>
                </div>
                <p className="text-gray-500 text-sm sm:text-base">
                  Next billing on{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {subscription.nextBillingDate}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-xl">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium text-sm sm:text-base">
                  {subscription.paymentMethod.brand} ••••{" "}
                  {subscription.paymentMethod.last4}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan: any) => {
            const isActive = plan.id === subscription.planId;

            return (
              <div
                key={plan.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border relative h-full flex flex-col"
              >
                {plan.popular && (
                  <span
                    className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 
                               bg-gradient-to-r from-blue-600 to-purple-600
                               text-white px-3 sm:px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                  >
                    Most Popular
                  </span>
                )}

                {/* Top Content */}
                <div className="flex-1">
                  <div className="mb-4">
                    <PlanIcon planId={plan.id} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>

                  <div className="text-3xl sm:text-4xl font-bold mt-2 text-gray-900 dark:text-white">
                    ${plan.priceMonthly}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      /month
                    </span>
                  </div>

                  <ul className="mt-6 space-y-2 sm:space-y-3">
                    {plan.features.map((f: string) => (
                      <li
                        key={f}
                        className="flex gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button pinned to bottom */}
                <button
                  disabled={isActive || upgrading === plan.id}
                  onClick={() => {
                    setUpgrading(plan.id);
                    upgradeSubscription(plan.id).then(() => {
                      alert(`Upgraded to ${plan.name}`);
                      setUpgrading(null);
                    });
                  }}
                  className={`mt-6 sm:mt-8 w-full py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  {isActive
                    ? "Current Plan"
                    : upgrading === plan.id
                    ? "Upgrading..."
                    : "Upgrade Now"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Invoices - Mobile Responsive Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b">
            <h3 className="text-lg sm:text-xl font-semibold">
              Invoice History
            </h3>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold whitespace-nowrap">
                    Invoice
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="border-t">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {inv.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{inv.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${inv.amount}
                    </td>
                    <td className="px-6 py-4 text-green-600 whitespace-nowrap">
                      {inv.status}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => downloadInvoice(inv.id)}
                        className="inline-flex items-center gap-2 text-sm hover:text-blue-600 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Invoice Cards */}
          <div className="sm:hidden divide-y">
            {invoices.map((inv: any) => (
              <div key={inv.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {inv.id}
                    </h4>
                    <p className="text-sm text-gray-500">{inv.date}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium">
                    {inv.status}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${inv.amount}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadInvoice(inv.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
