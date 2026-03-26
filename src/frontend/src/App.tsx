import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { MembersPage } from "./pages/MembersPage";
import { RecordDonationPage } from "./pages/RecordDonationPage";
import { ReportsPage } from "./pages/ReportsPage";

const AUTH_KEY = "ibg_admin_logged_in";

export type Page = "dashboard" | "members" | "record" | "reports";

const PAGE_TITLES: Record<Page, string> = {
  dashboard: "Panel Principal",
  members: "Miembros",
  record: "Registrar Ofrenda",
  reports: "Reportes",
};

function AppContent() {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_KEY) === "true";
  });
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  useEffect(() => {
    const handler = () => {
      setLoggedIn(localStorage.getItem(AUTH_KEY) === "true");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleLogin = () => {
    localStorage.setItem(AUTH_KEY, "true");
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setLoggedIn(false);
    setCurrentPage("dashboard");
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "members":
        return <MembersPage />;
      case "record":
        return <RecordDonationPage />;
      case "reports":
        return <ReportsPage />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      pageTitle={PAGE_TITLES[currentPage]}
    >
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <>
      <AppContent />
      <Toaster richColors position="top-right" />
    </>
  );
}
