import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CounterCards } from "@/components/CounterCards";
import { FilterBar } from "@/components/FilterBar";
import { ContentTable } from "@/components/ContentTable";
import { CalendarView } from "@/components/CalendarView";
import { KanbanView } from "@/components/KanbanView";
import { useContentData } from "@/hooks/useContentData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Index = () => {
  const { items, addItem, updateItem, deleteItem, uploadAttachment, deleteAttachment } = useContentData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [formatFilter, setFormatFilter] = useState("all");
  const [responsavelFilter, setResponsavelFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");

  const responsaveis = useMemo(() => {
    const set = new Set(items.map((i) => i.responsavel).filter(Boolean));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (search && !item.tema.toLowerCase().includes(search.toLowerCase()) && !item.observacoes.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter.length > 0 && !statusFilter.includes(item.status)) return false;
      if (formatFilter !== "all" && item.formato !== formatFilter) return false;
      if (responsavelFilter !== "all" && item.responsavel !== responsavelFilter) return false;
      if (platformFilter !== "all" && !item.plataformas.includes(platformFilter as any)) return false;
      return true;
    });
  }, [items, search, statusFilter, formatFilter, responsavelFilter, platformFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6 space-y-6">
        <CounterCards items={items} />
        <Tabs defaultValue="tabela" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TabsList>
                <TabsTrigger value="tabela">Planejamento</TabsTrigger>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="calendario">Calendário</TabsTrigger>
              </TabsList>
              <FilterBar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                formatFilter={formatFilter}
                onFormatFilterChange={setFormatFilter}
                responsavelFilter={responsavelFilter}
                onResponsavelFilterChange={setResponsavelFilter}
                responsaveis={responsaveis}
                platformFilter={platformFilter}
                onPlatformFilterChange={setPlatformFilter}
              />
            </div>
            <Button onClick={addItem} className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium gap-2">
              <Plus className="h-4 w-4" />
              Novo conteúdo
            </Button>
          </div>
          <TabsContent value="tabela">
            <ContentTable
              items={filtered}
              onUpdate={updateItem}
              onDelete={deleteItem}
              onUpload={uploadAttachment}
              onDeleteAttachment={deleteAttachment}
            />
          </TabsContent>
          <TabsContent value="kanban">
            <KanbanView items={filtered} onUpdate={updateItem} />
          </TabsContent>
          <TabsContent value="calendario">
            <CalendarView items={filtered} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
