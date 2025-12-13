// src/routes/AppRouter.tsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Spinner from "../components/common/Spinner";
import { SettingsProvider } from "../hooks/useSettings";
import Billing from "../pages/Billing";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Settings = lazy(() => import("../pages/Settings"));
const HelpCenter = lazy(() => import("../pages/HelpCenter"));
const Users = lazy(() => import("../pages/Users"));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppShell>
          <Suspense fallback={<Spinner />}>
            <Routes>
              
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/billing" element={<Billing />} />
            </Routes>
          </Suspense>
        </AppShell>
      </SettingsProvider>
    </BrowserRouter>
  );
}