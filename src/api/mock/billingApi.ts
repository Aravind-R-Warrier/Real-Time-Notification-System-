import billingData from  './data/billing.json'


export type BillingData = typeof billingData;

const API_DELAY = 500;

export function fetchBillingData(): Promise<BillingData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(billingData);
    }, API_DELAY);
  });
}

export function upgradeSubscription(planId: string): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    console.log("Mock upgrade to plan:", planId);
    setTimeout(() => {
      resolve({ success: true });
    }, API_DELAY);
  });
}

export function downloadInvoice(invoiceId: string): Promise<void> {
  return new Promise((resolve) => {
    console.log("Downloading invoice:", invoiceId);
    setTimeout(() => resolve(), 300);
  });
}
