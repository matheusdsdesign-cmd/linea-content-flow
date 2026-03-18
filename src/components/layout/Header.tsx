import { useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const BREADCRUMBS: Record<string, string> = {
  "/": "Planejamento",
  "/mail-marketing": "Mail Marketing",
  "/relatorios": "Relatórios",
};

interface HeaderProps {
  onMenuClick: () => void;
  search: string;
  onSearchChange: (v: string) => void;
}

export function Header({ onMenuClick, search, onSearchChange }: HeaderProps) {
  const location = useLocation();
  const crumb = BREADCRUMBS[location.pathname] || "Página";

  return (
    <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-6 bg-card border-b">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden text-muted-foreground hover:text-foreground">
          <Menu className="h-5 w-5" />
        </button>
        <nav className="text-sm text-muted-foreground">
          <span className="text-foreground font-medium">Content Planner</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">{crumb}</span>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-[200px] lg:w-[260px] bg-background h-9 text-sm"
          />
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-accent text-accent-foreground text-xs font-bold">LC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
