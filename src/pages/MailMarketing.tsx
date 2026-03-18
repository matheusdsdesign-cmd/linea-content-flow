import { useState, useMemo } from "react";
import { Plus, Mail, Send, Calendar, BarChart3, Trash2, Search } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useMailCampaigns } from "@/hooks/useMailCampaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CAMPAIGN_STATUS_OPTIONS,
  CAMPAIGN_SEGMENTS,
  campaignStatusClass,
  type CampaignStatus,
  type CampaignSegment,
  type MailCampaign,
} from "@/types/mailCampaign";
import { cn } from "@/lib/utils";
import { format, parse, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";

/* ───── KPI Cards ───── */
function KpiCards({ campaigns }: { campaigns: MailCampaign[] }) {
  const total = campaigns.length;
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const enviadasMes = campaigns.filter(
    (c) =>
      c.status === "Enviada" &&
      c.dataEnvio &&
      isWithinInterval(new Date(c.dataEnvio), { start: monthStart, end: monthEnd })
  ).length;

  const aberturas = campaigns.filter((c) => c.taxaAbertura != null);
  const mediaAbertura =
    aberturas.length > 0
      ? (aberturas.reduce((s, c) => s + (c.taxaAbertura ?? 0), 0) / aberturas.length).toFixed(1)
      : "—";

  const cliques = campaigns.filter((c) => c.taxaClique != null);
  const mediaClique =
    cliques.length > 0
      ? (cliques.reduce((s, c) => s + (c.taxaClique ?? 0), 0) / cliques.length).toFixed(1)
      : "—";

  const agendadas = campaigns.filter((c) => c.status === "Agendada").length;

  const cards = [
    { icon: Mail, label: "Total de campanhas", value: total, color: "bg-primary/10 text-primary" },
    { icon: Send, label: "Enviadas no mês", value: enviadasMes, color: "bg-success/10 text-success" },
    { icon: BarChart3, label: "Média de abertura", value: `${mediaAbertura}%`, color: "bg-accent/10 text-accent" },
    { icon: BarChart3, label: "Média de clique", value: `${mediaClique}%`, color: "bg-info/10 text-info" },
    { icon: Calendar, label: "Agendadas", value: agendadas, color: "bg-accent/10 text-accent" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="flex items-center gap-3 rounded-lg bg-card border p-4">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", c.color)}>
            <c.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───── Inline metric bar ───── */
function MetricCell({
  value,
  onChange,
  max = 100,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  max?: number;
}) {
  const display = value != null ? value : "";
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <Input
        type="number"
        min={0}
        max={max}
        value={display}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") return onChange(null);
          const n = Math.min(max, Math.max(0, Number(raw)));
          onChange(n);
        }}
        className="w-16 h-7 text-xs px-1 text-center bg-card"
      />
      {value != null && max === 100 && (
        <Progress value={value} className="h-2 flex-1 bg-muted [&>div]:bg-accent" />
      )}
    </div>
  );
}

/* ───── DateTime picker ───── */
function DateTimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const dateObj = value ? new Date(value) : undefined;
  const timeStr = dateObj ? format(dateObj, "HH:mm") : "";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[170px] h-7 justify-start text-left text-xs font-normal px-2 bg-card",
            !value && "text-muted-foreground"
          )}
        >
          <Calendar className="mr-1 h-3 w-3" />
          {dateObj ? format(dateObj, "dd/MM/yyyy HH:mm") : "Selecionar..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarPicker
          mode="single"
          selected={dateObj}
          onSelect={(d) => {
            if (!d) return;
            const existing = dateObj || new Date();
            d.setHours(existing.getHours(), existing.getMinutes());
            onChange(d.toISOString());
          }}
          locale={ptBR}
          className="p-3 pointer-events-auto"
        />
        <div className="border-t px-3 py-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Horário:</span>
          <Input
            type="time"
            value={timeStr}
            onChange={(e) => {
              const d = dateObj ? new Date(dateObj) : new Date();
              const [h, m] = e.target.value.split(":").map(Number);
              d.setHours(h, m);
              onChange(d.toISOString());
            }}
            className="w-24 h-7 text-xs bg-card"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ───── Main Page ───── */
export default function MailMarketing() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useMailCampaigns();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [responsavelFilter, setResponsavelFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"dataEnvio" | "taxaAbertura" | "status">("dataEnvio");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const responsaveis = useMemo(() => {
    const s = new Set(campaigns.map((c) => c.responsavel).filter(Boolean));
    return Array.from(s).sort();
  }, [campaigns]);

  const filtered = useMemo(() => {
    let list = campaigns.filter((c) => {
      if (
        search &&
        !c.nome.toLowerCase().includes(search.toLowerCase()) &&
        !c.assunto.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (statusFilter.length > 0 && !statusFilter.includes(c.status)) return false;
      if (segmentFilter !== "all" && c.segmento !== segmentFilter) return false;
      if (responsavelFilter !== "all" && c.responsavel !== responsavelFilter) return false;
      return true;
    });

    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "dataEnvio") {
        cmp = (a.dataEnvio || "").localeCompare(b.dataEnvio || "");
      } else if (sortBy === "taxaAbertura") {
        cmp = (a.taxaAbertura ?? -1) - (b.taxaAbertura ?? -1);
      } else {
        cmp = a.status.localeCompare(b.status);
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return list;
  }, [campaigns, search, statusFilter, segmentFilter, responsavelFilter, sortBy, sortDir]);

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const statusLabel =
    statusFilter.length === 0
      ? "Todos os status"
      : statusFilter.length === 1
      ? statusFilter[0]
      : `${statusFilter.length} status`;

  const toggleStatus = (s: string) => {
    setStatusFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  return (
    <Layout search={search} onSearchChange={setSearch}>
        <KpiCards campaigns={campaigns} />

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar campanha ou assunto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between bg-card text-sm font-normal">
                  <span className="truncate">{statusLabel}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-2" align="start">
                {statusFilter.length > 0 && (
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-muted-foreground" onClick={() => setStatusFilter([])}>
                    Limpar filtros
                  </Button>
                )}
                {CAMPAIGN_STATUS_OPTIONS.map((s) => (
                  <label key={s} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary/50 cursor-pointer text-sm">
                    <Checkbox checked={statusFilter.includes(s)} onCheckedChange={() => toggleStatus(s)} />
                    <Badge className={cn("text-[10px]", campaignStatusClass[s])}>{s}</Badge>
                  </label>
                ))}
              </PopoverContent>
            </Popover>

            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-[170px] bg-card"><SelectValue placeholder="Segmento" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos segmentos</SelectItem>
                {CAMPAIGN_SEGMENTS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={responsavelFilter} onValueChange={setResponsavelFilter}>
              <SelectTrigger className="w-[170px] bg-card"><SelectValue placeholder="Responsável" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {responsaveis.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={addCampaign} className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium gap-2">
            <Plus className="h-4 w-4" />
            Nova Campanha
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead className="w-10">#</TableHead>
                <TableHead className="min-w-[160px]">Campanha</TableHead>
                <TableHead className="min-w-[160px]">Assunto</TableHead>
                <TableHead className="min-w-[120px]">Preheader</TableHead>
                <TableHead className="w-[140px]">Segmento</TableHead>
                <TableHead className="w-[120px]">Responsável</TableHead>
                <TableHead className="w-[180px] cursor-pointer select-none" onClick={() => toggleSort("dataEnvio")}>
                  Data de Envio {sortBy === "dataEnvio" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </TableHead>
                <TableHead className="w-[120px] cursor-pointer select-none" onClick={() => toggleSort("status")}>
                  Status {sortBy === "status" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </TableHead>
                <TableHead className="w-[150px] cursor-pointer select-none" onClick={() => toggleSort("taxaAbertura")}>
                  Abertura % {sortBy === "taxaAbertura" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </TableHead>
                <TableHead className="w-[150px]">Clique %</TableHead>
                <TableHead className="w-[80px]">Unsubs</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-12 text-muted-foreground">
                    Nenhuma campanha encontrada. Clique em "Nova Campanha" para começar.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((c) => (
                <TableRow
                  key={c.id}
                  className={cn(c.status === "Enviada" && "opacity-70 bg-muted/20")}
                >
                  <TableCell className="text-xs text-muted-foreground font-mono">{c.number}</TableCell>
                  <TableCell>
                    <Input
                      value={c.nome}
                      onChange={(e) => updateCampaign(c.id, "nome", e.target.value)}
                      placeholder="Nome da campanha"
                      className="h-7 text-xs bg-transparent border-none shadow-none focus-visible:ring-1 px-1"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={c.assunto}
                      onChange={(e) => updateCampaign(c.id, "assunto", e.target.value)}
                      placeholder="Subject line"
                      className="h-7 text-xs bg-transparent border-none shadow-none focus-visible:ring-1 px-1"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={c.preheader}
                      onChange={(e) => updateCampaign(c.id, "preheader", e.target.value)}
                      placeholder="Preheader"
                      className="h-7 text-xs bg-transparent border-none shadow-none focus-visible:ring-1 px-1"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={c.segmento || "__empty__"}
                      onValueChange={(v) => updateCampaign(c.id, "segmento", v === "__empty__" ? "" : v)}
                    >
                      <SelectTrigger className="h-7 text-xs bg-transparent border-none shadow-none">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__empty__">Nenhum</SelectItem>
                        {CAMPAIGN_SEGMENTS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={c.responsavel}
                      onChange={(e) => updateCampaign(c.id, "responsavel", e.target.value)}
                      placeholder="Responsável"
                      className="h-7 text-xs bg-transparent border-none shadow-none focus-visible:ring-1 px-1"
                    />
                  </TableCell>
                  <TableCell>
                    <DateTimePicker
                      value={c.dataEnvio}
                      onChange={(v) => updateCampaign(c.id, "dataEnvio", v)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={c.status}
                      onValueChange={(v) => updateCampaign(c.id, "status", v)}
                    >
                      <SelectTrigger className="h-7 border-none shadow-none p-0 w-auto">
                        <Badge className={cn("text-[10px] uppercase", campaignStatusClass[c.status])}>
                          {c.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {CAMPAIGN_STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            <Badge className={cn("text-[10px]", campaignStatusClass[s])}>{s}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <MetricCell
                      value={c.taxaAbertura}
                      onChange={(v) => updateCampaign(c.id, "taxaAbertura", v)}
                    />
                  </TableCell>
                  <TableCell>
                    <MetricCell
                      value={c.taxaClique}
                      onChange={(v) => updateCampaign(c.id, "taxaClique", v)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      value={c.descadastros ?? ""}
                      onChange={(e) =>
                        updateCampaign(c.id, "descadastros", e.target.value === "" ? null : Number(e.target.value))
                      }
                      className="w-16 h-7 text-xs px-1 text-center bg-card"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-cancelled"
                          onClick={() => deleteCampaign(c.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Excluir campanha</TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
    </Layout>
  );
}
