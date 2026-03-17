import { Truck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-primary/80">
      <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
            <Truck className="h-4 w-4 text-accent-foreground" />
          </div>
          <h1 className="text-lg font-bold text-primary-foreground tracking-tight">
            Línea Content Planner
          </h1>
        </div>
        <nav className="hidden sm:flex items-center gap-1">
          <Link
            to="/"
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              location.pathname === "/"
                ? "text-primary-foreground/90 bg-primary-foreground/10"
                : "text-primary-foreground/50 hover:text-primary-foreground/70"
            )}
          >
            Planejamento
          </Link>
          <Link
            to="/relatorios"
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              location.pathname === "/relatorios"
                ? "text-primary-foreground/90 bg-primary-foreground/10"
                : "text-primary-foreground/50 hover:text-primary-foreground/70"
            )}
          >
            Relatórios
          </Link>
        </nav>
      </div>
    </header>
  );
}
