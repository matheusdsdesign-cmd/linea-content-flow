import { useState, useEffect } from "react";
import { Sidebar, MobileSidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  search: string;
  onSearchChange: (v: string) => void;
}

export function Layout({ children, search, onSearchChange }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-collapse on medium screens
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (max-width: 1279px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setCollapsed(true);
    };
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-200",
          "md:ml-[220px]",
          collapsed && "md:ml-[60px]"
        )}
      >
        <Header onMenuClick={() => setMobileOpen(true)} search={search} onSearchChange={onSearchChange} />
        <main className="flex-1 p-6 md:p-6 bg-background">
          <div className="animate-fade-in max-w-[1440px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
