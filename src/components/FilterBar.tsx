import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { STATUS_GROUPS, FORMAT_OPTIONS, PLATFORM_OPTIONS, statusClassMap } from "@/types/content";
import type { ContentStatus } from "@/types/content";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (v: string[]) => void;
  formatFilter: string;
  onFormatFilterChange: (v: string) => void;
  responsavelFilter: string;
  onResponsavelFilterChange: (v: string) => void;
  responsaveis: string[];
  platformFilter: string;
  onPlatformFilterChange: (v: string) => void;
}

export function FilterBar({
  search, onSearchChange,
  statusFilter, onStatusFilterChange,
  formatFilter, onFormatFilterChange,
  responsavelFilter, onResponsavelFilterChange,
  responsaveis,
  platformFilter, onPlatformFilterChange,
}: FilterBarProps) {
  const toggleStatus = (status: string) => {
    if (statusFilter.includes(status)) {
      onStatusFilterChange(statusFilter.filter((s) => s !== status));
    } else {
      onStatusFilterChange([...statusFilter, status]);
    }
  };

  const statusLabel = statusFilter.length === 0
    ? "Todos os status"
    : statusFilter.length === 1
    ? statusFilter[0]
    : `${statusFilter.length} status`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por tema ou palavra-chave..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-card"
        />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between bg-card text-sm font-normal">
            <span className="truncate">{statusLabel}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-2 max-h-[360px] overflow-y-auto" align="start">
          <div className="space-y-1">
            {statusFilter.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-muted-foreground"
                onClick={() => onStatusFilterChange([])}
              >
                Limpar filtros
              </Button>
            )}
            {STATUS_GROUPS.map((group) => (
              <div key={group.stage}>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 pt-2 pb-1">
                  {group.stage}
                </p>
                {group.statuses.map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary/50 cursor-pointer text-sm"
                  >
                    <Checkbox
                      checked={statusFilter.includes(s)}
                      onCheckedChange={() => toggleStatus(s)}
                    />
                    <Badge className={cn("text-[10px]", statusClassMap[s as ContentStatus])}>{s}</Badge>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Select value={formatFilter} onValueChange={onFormatFilterChange}>
        <SelectTrigger className="w-[160px] bg-card">
          <SelectValue placeholder="Formato" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os formatos</SelectItem>
          {FORMAT_OPTIONS.map((f) => (
            <SelectItem key={f} value={f}>{f}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={platformFilter} onValueChange={onPlatformFilterChange}>
        <SelectTrigger className="w-[160px] bg-card">
          <SelectValue placeholder="Plataforma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas plataformas</SelectItem>
          {PLATFORM_OPTIONS.map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={responsavelFilter} onValueChange={onResponsavelFilterChange}>
        <SelectTrigger className="w-[170px] bg-card">
          <SelectValue placeholder="Responsável" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {responsaveis.map((r) => (
            <SelectItem key={r} value={r}>{r}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
