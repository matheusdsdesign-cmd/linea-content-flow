import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ContentItem, statusClassMap } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalendarViewProps {
  items: ContentItem[];
}

export function CalendarView({ items }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { locale: ptBR });
    const calEnd = endOfWeek(monthEnd, { locale: ptBR });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const itemsByDate = useMemo(() => {
    const map = new Map<string, ContentItem[]>();
    items.forEach((item) => {
      if (!item.dataPublicacao) return;
      const key = format(new Date(item.dataPublicacao), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
    return map;
  }, [items]);

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-primary/5">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-semibold capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 border-b">
        {weekDays.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const key = format(day, "yyyy-MM-dd");
          const dayItems = itemsByDate.get(key) || [];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={i}
              className={cn(
                "min-h-[100px] border-b border-r p-1.5 transition-colors",
                !isCurrentMonth && "bg-muted/30",
                isToday && "bg-accent/5"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isToday && "bg-accent text-accent-foreground font-bold",
                  !isCurrentMonth && "text-muted-foreground/50"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {dayItems.slice(0, 3).map((item) => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "truncate rounded px-1.5 py-0.5 text-[11px] leading-tight cursor-default",
                          statusClassMap[item.status]
                        )}
                      >
                        {item.tema || "Sem tema"}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px]">
                      <p className="font-medium text-xs">{item.tema || "Sem tema"}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.formato} · {item.plataformas.join(", ")}
                      </p>
                      <Badge className={cn("text-[10px] mt-1", statusClassMap[item.status])}>{item.status}</Badge>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {dayItems.length > 3 && (
                  <span className="text-[10px] text-muted-foreground pl-1">
                    +{dayItems.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
