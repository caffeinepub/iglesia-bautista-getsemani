import {
  ChurchIcon,
  FileText,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { Page } from "../App";

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  children: ReactNode;
  pageTitle: string;
}

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Panel Principal", icon: LayoutDashboard },
  { id: "members", label: "Miembros", icon: Users },
  { id: "record", label: "Registrar Ofrenda", icon: PlusCircle },
  { id: "reports", label: "Reportes", icon: FileText },
];

export function Layout({
  currentPage,
  onNavigate,
  onLogout,
  children,
  pageTitle,
}: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className="no-print w-64 flex-shrink-0 flex flex-col bg-sidebar text-sidebar-foreground"
        style={{ boxShadow: "2px 0 12px rgba(15,46,79,0.15)" }}
      >
        {/* Brand */}
        <div className="px-5 py-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
              <ChurchIcon className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <p className="text-[11px] text-sidebar-foreground/60 uppercase tracking-widest font-medium leading-none mb-1">
                Iglesia Bautista
              </p>
              <p className="text-[13px] font-bold text-sidebar-foreground leading-tight">
                Getsemani
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              data-ocid={`nav.${id}.link`}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                currentPage === id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 border-t border-sidebar-border pt-4">
          <button
            type="button"
            data-ocid="nav.logout.button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="no-print h-14 border-b border-border bg-card flex items-center px-6 gap-4 flex-shrink-0">
          <h1 className="text-base font-semibold text-foreground">
            {pageTitle}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Administrador</span>
            <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
