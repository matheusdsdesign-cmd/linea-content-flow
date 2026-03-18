import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Mail, BarChart3, Settings, ChevronLeft, ChevronRight, Menu, X, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { to: "/", label: "Planejamento", icon: LayoutGrid },
  { to: "/mail-marketing", label: "Mail Marketing", icon: Mail },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-50 transition-all duration-200 border-r border-[rgba(255,255,255,0.08)]",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
      style={{ backgroundColor: "hsl(var(--primary))" }}
    >
      {/* Brand */}
      <div className={cn("flex items-center gap-3 px-4 h-14 border-b border-[rgba(255,255,255,0.08)]", collapsed && "justify-center px-0")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent">
          <Truck className="h-4 w-4 text-accent-foreground" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-primary-foreground tracking-tight truncate">
            Línea Content Planner
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.to;
          const linkContent = (
            <Link
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                active
                  ? "bg-[rgba(238,125,2,0.15)] text-primary-foreground border-l-[3px] border-accent"
                  : "text-primary-foreground/70 hover:bg-[rgba(255,255,255,0.06)] hover:text-primary-foreground/90 border-l-[3px] border-transparent",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.to}>{linkContent}</div>;
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-4 space-y-2">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center px-3 py-2 text-primary-foreground/40 cursor-default">
                <Settings className="h-5 w-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Configurações</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-3 px-3 py-2 text-primary-foreground/40 text-sm">
            <Settings className="h-5 w-5 shrink-0" />
            <span>Configurações</span>
          </div>
        )}
        {!collapsed && (
          <p className="text-[10px] text-primary-foreground/30 text-center">v1.0</p>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-card border shadow-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}

/* Mobile drawer */
export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      <aside
        className="fixed left-0 top-0 bottom-0 z-50 w-[260px] flex flex-col animate-slide-in-right border-r border-[rgba(255,255,255,0.08)]"
        style={{ backgroundColor: "hsl(var(--primary))", animationDirection: "normal", transform: "translateX(0)" }}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
              <Truck className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-sm font-semibold text-primary-foreground">Línea Content Planner</span>
          </div>
          <button onClick={onClose} className="text-primary-foreground/70 hover:text-primary-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[rgba(238,125,2,0.15)] text-primary-foreground border-l-[3px] border-accent"
                    : "text-primary-foreground/70 hover:bg-[rgba(255,255,255,0.06)] border-l-[3px] border-transparent"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-4">
          <div className="flex items-center gap-3 py-2 text-primary-foreground/40 text-sm">
            <Settings className="h-5 w-5" /> Configurações
          </div>
          <p className="text-[10px] text-primary-foreground/30 text-center mt-2">v1.0</p>
        </div>
      </aside>
    </>
  );
}

export { Menu };
