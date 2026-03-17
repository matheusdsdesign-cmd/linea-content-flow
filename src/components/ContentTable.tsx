import { useState, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Trash2, ChevronUp, ChevronDown, Paperclip, X, Upload, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ContentItem, ContentStatus, ContentFormat, ContentPlatform,
  STATUS_GROUPS, FORMAT_OPTIONS, PLATFORM_OPTIONS, statusClassMap, rowIndicatorMap,
} from "@/types/content";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type SortField = "dataPublicacao" | "status" | null;
type SortDir = "asc" | "desc";

interface ContentTableProps {
  items: ContentItem[];
  onUpdate: (id: string, field: keyof ContentItem, value: any) => void;
  onDelete: (id: string) => void;
  onUpload: (itemId: string, file: File) => Promise<any>;
  onDeleteAttachment: (itemId: string, path: string) => Promise<void>;
}

export function ContentTable({ items, onUpdate, onDelete, onUpload, onDeleteAttachment }: ContentTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = [...items].sort((a, b) => {
    if (!sortField) return 0;
    const mod = sortDir === "asc" ? 1 : -1;
    if (sortField === "dataPublicacao") {
      return (a.dataPublicacao.localeCompare(b.dataPublicacao)) * mod;
    }
    return a.status.localeCompare(b.status) * mod;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5 hover:bg-primary/5">
            <TableHead className="w-[50px] text-center font-semibold">#</TableHead>
            <TableHead className="min-w-[180px] font-semibold">Tema</TableHead>
            <TableHead className="w-[140px] font-semibold">Formato</TableHead>
            <TableHead className="w-[160px] font-semibold">Plataformas</TableHead>
            <TableHead className="w-[140px] font-semibold">Responsável</TableHead>
            <TableHead className="w-[140px] font-semibold">Data Captação</TableHead>
            <TableHead
              className="w-[140px] font-semibold cursor-pointer select-none"
              onClick={() => toggleSort("dataPublicacao")}
            >
              <span className="flex items-center gap-1">Data Publicação <SortIcon field="dataPublicacao" /></span>
            </TableHead>
            <TableHead
              className="w-[180px] font-semibold cursor-pointer select-none"
              onClick={() => toggleSort("status")}
            >
              <span className="flex items-center gap-1">Status <SortIcon field="status" /></span>
            </TableHead>
            <TableHead className="w-[80px] font-semibold">Anexos</TableHead>
            <TableHead className="min-w-[160px] font-semibold">Observações</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                Nenhum conteúdo encontrado. Clique em "+ Novo conteúdo" para começar.
              </TableCell>
            </TableRow>
          )}
          {sorted.map((item) => (
            <TableRow key={item.id} className={cn("group", rowIndicatorMap[item.status])}>
              <TableCell className="text-center text-muted-foreground font-mono text-sm">
                {item.number}
              </TableCell>
              <TableCell>
                <Input
                  value={item.tema}
                  onChange={(e) => onUpdate(item.id, "tema", e.target.value)}
                  placeholder="Digite o tema..."
                  className="border-transparent bg-transparent hover:bg-secondary/50 focus:bg-card h-8 text-sm"
                />
              </TableCell>
              <TableCell>
                <Select value={item.formato} onValueChange={(v) => onUpdate(item.id, "formato", v)}>
                  <SelectTrigger className="border-transparent bg-transparent hover:bg-secondary/50 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMAT_OPTIONS.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <PlatformMultiSelect
                  value={item.plataformas}
                  onChange={(v) => onUpdate(item.id, "plataformas", v)}
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.responsavel}
                  onChange={(e) => onUpdate(item.id, "responsavel", e.target.value)}
                  placeholder="Responsável..."
                  className="border-transparent bg-transparent hover:bg-secondary/50 focus:bg-card h-8 text-sm"
                />
              </TableCell>
              <DatePickerCell
                value={item.dataCaptacao}
                onChange={(v) => onUpdate(item.id, "dataCaptacao", v)}
              />
              <DatePickerCell
                value={item.dataPublicacao}
                onChange={(v) => onUpdate(item.id, "dataPublicacao", v)}
              />
              <TableCell>
                <StatusSelect value={item.status} onChange={(v) => onUpdate(item.id, "status", v)} />
              </TableCell>
              <TableCell>
                <AttachmentCell
                  item={item}
                  onUpload={onUpload}
                  onDeleteAttachment={onDeleteAttachment}
                />
              </TableCell>
              <TableCell>
                <Textarea
                  value={item.observacoes}
                  onChange={(e) => onUpdate(item.id, "observacoes", e.target.value)}
                  placeholder="Notas..."
                  className="border-transparent bg-transparent hover:bg-secondary/50 focus:bg-card min-h-[32px] h-8 text-sm resize-none"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// --- Sub-components ---

function PlatformMultiSelect({ value, onChange }: { value: ContentPlatform[]; onChange: (v: ContentPlatform[]) => void }) {
  const toggle = (platform: ContentPlatform) => {
    if (value.includes(platform)) {
      if (value.length === 1) return; // keep at least one
      onChange(value.filter((p) => p !== platform));
    } else {
      onChange([...value, platform]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-full justify-start text-sm font-normal px-2 border-transparent hover:bg-secondary/50"
        >
          <span className="truncate">
            {value.length === 1 ? value[0] : `${value.length} plataformas`}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2" align="start">
        <div className="space-y-1">
          {PLATFORM_OPTIONS.map((p) => (
            <label
              key={p}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary/50 cursor-pointer text-sm"
            >
              <Checkbox
                checked={value.includes(p)}
                onCheckedChange={() => toggle(p)}
              />
              {p}
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function AttachmentCell({
  item,
  onUpload,
  onDeleteAttachment,
}: {
  item: ContentItem;
  onUpload: (itemId: string, file: File) => Promise<any>;
  onDeleteAttachment: (itemId: string, path: string) => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(item.id, file);
      toast.success("Arquivo anexado!");
    } catch {
      toast.error("Erro ao enviar arquivo.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 relative">
          <Paperclip className="h-3.5 w-3.5" />
          {item.anexos.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {item.anexos.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-3" align="start">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground">Roteiros / Anexos</p>
          {item.anexos.length === 0 && (
            <p className="text-xs text-muted-foreground">Nenhum anexo.</p>
          )}
          {item.anexos.map((a) => (
            <div key={a.path} className="flex items-center gap-2 text-xs">
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                {a.name}
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-muted-foreground hover:text-destructive"
                onClick={() => onDeleteAttachment(item.id, a.path)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs gap-1"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-3 w-3" />
            {uploading ? "Enviando..." : "Anexar arquivo"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function StatusSelect({ value, onChange }: { value: ContentStatus; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="border-transparent bg-transparent h-8 p-0">
        <Badge className={cn("text-xs font-medium px-2.5 py-0.5", statusClassMap[value])}>
          {value}
        </Badge>
      </SelectTrigger>
      <SelectContent className="max-h-[320px]">
        {STATUS_GROUPS.map((group) => (
          <SelectGroup key={group.stage}>
            <SelectLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {group.stage}
            </SelectLabel>
            {group.statuses.map((s) => (
              <SelectItem key={s} value={s}>
                <Badge className={cn("text-[10px]", statusClassMap[s])}>{s}</Badge>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

function DatePickerCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const date = value ? new Date(value) : undefined;

  return (
    <TableCell>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-8 w-full justify-start text-sm font-normal px-2",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-1 h-3.5 w-3.5" />
            {date ? format(date, "dd/MM/yyyy") : "Selecionar"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onChange(d.toISOString())}
            locale={ptBR}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </TableCell>
  );
}
