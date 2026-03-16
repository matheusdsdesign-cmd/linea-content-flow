import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CounterCards } from "@/components/CounterCards";
import { FilterBar } from "@/components/FilterBar";
import { ContentTable } from "@/components/ContentTable";
import { useContentData } from "@/hooks/useContentData";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { items, addItem, updateItem, deleteItem } = useContentData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [responsavelFilter, setResponsavelFilter] = useState("all");

  const responsaveis = useMemo(() => {
    const set = new Set(items.map((i) => i.responsavel).filter(Boolean));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (search && !item.tema.toLowerCase().includes(search.toLowerCase()) && !item.observacoes.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (formatFilter !== "all" && item.formato !== formatFilter) return false;
      if (responsavelFilter !== "all" && item.responsavel !== responsavelFilter) return false;
      return true;
    });
  }, [items, search, statusFilter, formatFilter, responsavelFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6 space-y-6">
        <CounterCards items={items} />
        <div className="flex flex-wrap items-center justify-between gap-4">
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
          />
          <Button onClick={addItem} className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium gap-2">
            <Plus className="h-4 w-4" />
            Novo conteúdo
          </Button>
        </div>
        <ContentTable items={filtered} onUpdate={updateItem} onDelete={deleteItem} />
      </main>
    </div>
  );
};

export default Index;
