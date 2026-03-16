import { ContentItem } from "@/types/content";
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface CounterCardsProps {
  items: ContentItem[];
}

export function CounterCards({ items }: CounterCardsProps) {
  const total = items.length;
  const emProducao = items.filter((i) =>
    ["Gravação concluída", "Imagens captadas", "Arte produzida", "Roteiro criado", "Pauta definida"].includes(i.status)
  ).length;
  const aguardando = items.filter((i) =>
    ["Aguardando aprovação", "Em ajustes", "Aguardando feedback"].includes(i.status)
  ).length;
  const publicados = items.filter((i) => i.status === "Publicado").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="flex items-center gap-3 rounded-lg bg-card border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{total}</p>
          <p className="text-sm text-muted-foreground">Total de conteúdos</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-card border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
          <Clock className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{emProducao}</p>
          <p className="text-sm text-muted-foreground">Em produção</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-card border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: "hsl(var(--warning) / 0.1)" }}>
          <AlertCircle className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{aguardando}</p>
          <p className="text-sm text-muted-foreground">Aguardando</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-card border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{publicados}</p>
          <p className="text-sm text-muted-foreground">Publicados</p>
        </div>
      </div>
    </div>
  );
}
