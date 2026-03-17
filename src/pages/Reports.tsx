import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { useContentData } from "@/hooks/useContentData";
import { PLATFORM_OPTIONS, FORMAT_OPTIONS, STATUS_OPTIONS, ContentItem } from "@/types/content";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Calendar, Hash, Layers } from "lucide-react";

type Period = "daily" | "weekly" | "monthly" | "yearly";

function getWeekNumber(d: Date): string {
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime();
  const week = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
  return `${d.getFullYear()}-S${String(week).padStart(2, "0")}`;
}

function getPeriodKey(dateStr: string, period: Period): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  switch (period) {
    case "daily": return d.toISOString().slice(0, 10);
    case "weekly": return getWeekNumber(d);
    case "monthly": return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    case "yearly": return `${d.getFullYear()}`;
  }
}

function countBy<T extends string>(items: ContentItem[], extractor: (i: ContentItem) => T | T[]): Record<string, number> {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const val = extractor(item);
    const arr = Array.isArray(val) ? val : [val];
    arr.forEach((v) => {
      if (v) counts[v] = (counts[v] || 0) + 1;
    });
  });
  return counts;
}

function SimpleBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground w-[140px] truncate" title={label}>{label}</span>
      <div className="flex-1 h-7 bg-secondary rounded-md overflow-hidden relative">
        <div
          className={`h-full rounded-md transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
        <span className="absolute inset-0 flex items-center px-2 text-xs font-semibold text-foreground">
          {value}
        </span>
      </div>
    </div>
  );
}

function RankingSection({ title, icon, data, color }: { title: string; icon: React.ReactNode; data: Record<string, number>; color: string }) {
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = sorted.length > 0 ? sorted[0][1] : 0;

  return (
    <Card className="p-5 space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem dados disponíveis.</p>
      ) : (
        <div className="space-y-2">
          {sorted.map(([label, value]) => (
            <SimpleBar key={label} label={label} value={value} max={max} color={color} />
          ))}
        </div>
      )}
    </Card>
  );
}

function TimelineSection({ title, items, period }: { title: string; items: ContentItem[]; period: Period }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      const key = getPeriodKey(item.dataPublicacao, period);
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items, period]);

  const max = data.length > 0 ? Math.max(...data.map((d) => d[1])) : 0;

  return (
    <Card className="p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-info" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem dados com datas de publicação.</p>
      ) : (
        <div className="space-y-2">
          {data.map(([label, value]) => (
            <SimpleBar key={label} label={label} value={value} max={max} color="bg-info" />
          ))}
        </div>
      )}
    </Card>
  );
}

const Reports = () => {
  const { items } = useContentData();
  const [period, setPeriod] = useState<Period>("monthly");

  const platformCounts = useMemo(() => countBy(items, (i) => i.plataformas), [items]);
  const formatCounts = useMemo(() => countBy(items, (i) => i.formato), [items]);
  const statusCounts = useMemo(() => countBy(items, (i) => i.status), [items]);
  const themeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      const tema = item.tema?.trim();
      if (tema) counts[tema] = (counts[tema] || 0) + 1;
    });
    return counts;
  }, [items]);
  const responsavelCounts = useMemo(() => countBy(items, (i) => i.responsavel), [items]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Relatórios</h2>
            <p className="text-sm text-muted-foreground">Visão geral da produção de conteúdo</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Período:</span>
            <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <TabsList>
                <TabsTrigger value="daily">Diário</TabsTrigger>
                <TabsTrigger value="weekly">Semanal</TabsTrigger>
                <TabsTrigger value="monthly">Mensal</TabsTrigger>
                <TabsTrigger value="yearly">Anual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Hash className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{items.length}</p>
              <p className="text-sm text-muted-foreground">Total de conteúdos</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Layers className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{Object.keys(platformCounts).length}</p>
              <p className="text-sm text-muted-foreground">Plataformas ativas</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: "hsl(var(--success) / 0.1)" }}>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {items.filter((i) => i.status === "Publicado").length}
              </p>
              <p className="text-sm text-muted-foreground">Publicados</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <BarChart3 className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{Object.keys(themeCounts).length}</p>
              <p className="text-sm text-muted-foreground">Temas distintos</p>
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <TimelineSection title={`Posts por período (${period === "daily" ? "Diário" : period === "weekly" ? "Semanal" : period === "monthly" ? "Mensal" : "Anual"})`} items={items} period={period} />

        {/* Rankings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RankingSection
            title="Posts por plataforma"
            icon={<Layers className="h-4 w-4 text-accent" />}
            data={platformCounts}
            color="bg-accent"
          />
          <RankingSection
            title="Formatos mais utilizados"
            icon={<BarChart3 className="h-4 w-4 text-primary" />}
            data={formatCounts}
            color="bg-primary"
          />
          <RankingSection
            title="Temas mais utilizados"
            icon={<TrendingUp className="h-4 w-4 text-info" />}
            data={themeCounts}
            color="bg-info"
          />
          <RankingSection
            title="Status dos conteúdos"
            icon={<Hash className="h-4 w-4 text-success" />}
            data={statusCounts}
            color="bg-success"
          />
          <RankingSection
            title="Posts por responsável"
            icon={<BarChart3 className="h-4 w-4 text-accent" />}
            data={responsavelCounts}
            color="bg-accent"
          />
        </div>
      </main>
    </div>
  );
};

export default Reports;
