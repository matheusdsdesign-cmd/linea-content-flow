import { ContentItem } from "@/types/content";
import { FileText, Clock, CheckCircle2 } from "lucide-react";

interface CounterCardsProps {
  items: ContentItem[];
}

export function CounterCards({ items }: CounterCardsProps) {
  const total = items.length;
  const emAndamento = items.filter((i) => i.status === "Em andamento").length;
  const publicados = items.filter((i) => i.status === "Publicado").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <p className="text-2xl font-bold text-foreground">{emAndamento}</p>
          <p className="text-sm text-muted-foreground">Em andamento</p>
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
