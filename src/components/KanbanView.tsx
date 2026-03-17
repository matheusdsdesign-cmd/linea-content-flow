import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  ContentItem, ContentStage, STAGE_ORDER, STATUS_GROUPS,
  statusClassMap, getStageForStatus, STAGE_COLORS,
} from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";

interface KanbanViewProps {
  items: ContentItem[];
  onUpdate: (id: string, field: keyof ContentItem, value: any) => void;
}

export function KanbanView({ items, onUpdate }: KanbanViewProps) {
  const columns = useMemo(() => {
    const map = new Map<ContentStage, ContentItem[]>();
    STAGE_ORDER.forEach((stage) => map.set(stage, []));
    items.forEach((item) => {
      const stage = getStageForStatus(item.status);
      map.get(stage)!.push(item);
    });
    return map;
  }, [items]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("text/plain", itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStage: ContentStage) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    const group = STATUS_GROUPS.find((g) => g.stage === targetStage);
    if (group) {
      // Move to first status of target stage
      onUpdate(itemId, "status", group.statuses[0]);
    }
  };

  const stageColorClasses: Record<string, string> = {
    info: "border-t-[hsl(var(--info))] bg-[hsl(var(--info)/0.05)]",
    accent: "border-t-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.05)]",
    warning: "border-t-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.05)]",
    success: "border-t-[hsl(var(--success))] bg-[hsl(var(--success)/0.05)]",
    delayed: "border-t-[hsl(var(--delayed))] bg-[hsl(var(--delayed)/0.05)]",
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGE_ORDER.map((stage) => {
        const stageItems = columns.get(stage) || [];
        const color = STAGE_COLORS[stage];

        return (
          <div
            key={stage}
            className={cn(
              "flex-shrink-0 w-[280px] rounded-lg border border-t-4 flex flex-col max-h-[calc(100vh-280px)]",
              stageColorClasses[color]
            )}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div className="px-3 py-2.5 border-b flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
              <span className="text-xs font-medium text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                {stageItems.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {stageItems.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Arraste itens aqui
                </p>
              )}
              {stageItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  className="rounded-md border bg-card p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {item.tema || "Sem tema"}
                    </p>
                    <span className="text-[10px] text-muted-foreground font-mono">#{item.number}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge className={cn("text-[10px]", statusClassMap[item.status])}>
                      {item.status}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {item.formato}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.plataformas.map((p) => (
                      <span key={p} className="text-[10px] bg-secondary text-secondary-foreground rounded px-1.5 py-0.5">
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    {item.responsavel && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.responsavel}
                      </span>
                    )}
                    {item.dataPublicacao && (
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {format(new Date(item.dataPublicacao), "dd/MM")}
                      </span>
                    )}
                  </div>
                  {(item.anexos?.length || 0) > 0 && (
                    <div className="text-[10px] text-muted-foreground">
                      📎 {item.anexos.length} anexo{item.anexos.length > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
