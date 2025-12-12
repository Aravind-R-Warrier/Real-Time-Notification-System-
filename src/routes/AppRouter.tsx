import React, { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Spinner from "../components/common/Spinner";
import HelpCenter from "../pages/HelpCenter";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Settings = lazy(() => import("../pages/Settings"));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<HelpCenter />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  )
}
