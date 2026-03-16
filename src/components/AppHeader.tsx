import { Truck } from "lucide-react";

export function AppHeader() {
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
          <span className="px-3 py-1.5 text-sm font-medium text-primary-foreground/90 bg-primary-foreground/10 rounded-md">
            Planejamento
          </span>
          <span className="px-3 py-1.5 text-sm text-primary-foreground/50 cursor-default">
            Calendário
          </span>
          <span className="px-3 py-1.5 text-sm text-primary-foreground/50 cursor-default">
            Relatórios
          </span>
        </nav>
      </div>
    </header>
  );
}
