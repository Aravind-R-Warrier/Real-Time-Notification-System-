import React from "react";
import AppRouter from "./routes/AppRouter";
import './index.css'
/**
 * App
 * - Minimal root component that mounts the router.
 * - Keep business logic out of this file; use providers inside AppRouter / AppShell.
 */
const App: React.FC = () => {
  return <AppRouter />;
};

export default App;
