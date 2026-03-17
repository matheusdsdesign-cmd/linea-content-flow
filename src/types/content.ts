// === Workflow Stages ===
export type ContentStage = "Ideação" | "Pré-produção" | "Produção" | "Aprovação" | "Publicação" | "Extras";

export type ContentStatus =
  // Ideação
  | "Pauta definida"
  // Pré-produção
  | "Roteiro criado"
  // Produção
  | "Gravação concluída"
  | "Imagens captadas"
  | "Arte produzida"
  // Aprovação
  | "Aguardando aprovação"
  | "Aprovado"
  | "Em ajustes"
  // Publicação
  | "Pronto para publicação"
  | "Agendado"
  | "Publicado"
  // Extras
  | "Pausado"
  | "Cancelado"
  | "Reprovado"
  | "Reagendado"
  | "Conteúdo reciclado"
  | "Aguardando feedback";

export type ContentFormat = "Reels" | "Carrossel" | "Post estático" | "Story" | "Artigo" | "E-mail" | "Vídeo";

export type ContentPlatform = "Instagram" | "Facebook" | "LinkedIn" | "Blog" | "E-mail";

export interface ContentAttachment {
  name: string;
  url: string;
  path: string; // storage path for deletion
}

export interface ContentItem {
  id: string;
  number: number;
  tema: string;
  formato: ContentFormat;
  responsavel: string;
  plataformas: ContentPlatform[]; // changed to array
  dataCaptacao: string;
  dataPublicacao: string;
  status: ContentStatus;
  observacoes: string;
  anexos: ContentAttachment[]; // new field
}

export interface StatusGroup {
  stage: ContentStage;
  statuses: ContentStatus[];
}

export const STATUS_GROUPS: StatusGroup[] = [
  { stage: "Ideação", statuses: ["Pauta definida"] },
  { stage: "Pré-produção", statuses: ["Roteiro criado"] },
  { stage: "Produção", statuses: ["Gravação concluída", "Imagens captadas", "Arte produzida"] },
  { stage: "Aprovação", statuses: ["Aguardando aprovação", "Aprovado", "Em ajustes"] },
  { stage: "Publicação", statuses: ["Pronto para publicação", "Agendado", "Publicado"] },
  { stage: "Extras", statuses: ["Pausado", "Cancelado", "Reprovado", "Reagendado", "Conteúdo reciclado", "Aguardando feedback"] },
];

export const STAGE_ORDER: ContentStage[] = ["Ideação", "Pré-produção", "Produção", "Aprovação", "Publicação", "Extras"];

export const STATUS_OPTIONS: ContentStatus[] = STATUS_GROUPS.flatMap((g) => g.statuses);

export const FORMAT_OPTIONS: ContentFormat[] = ["Reels", "Carrossel", "Post estático", "Story", "Artigo", "E-mail", "Vídeo"];

export const PLATFORM_OPTIONS: ContentPlatform[] = ["Instagram", "Facebook", "LinkedIn", "TikTok", "YouTube", "Blog", "E-mail", "WhatsApp"];

// Color mapping by semantic meaning
type StatusColor = "accent" | "success" | "delayed" | "cancelled" | "info" | "warning";

const statusColorMap: Record<ContentStatus, StatusColor> = {
  "Pauta definida": "info",
  "Roteiro criado": "info",
  "Gravação concluída": "accent",
  "Imagens captadas": "accent",
  "Arte produzida": "accent",
  "Aguardando aprovação": "warning",
  "Aprovado": "success",
  "Em ajustes": "warning",
  "Pronto para publicação": "success",
  "Agendado": "info",
  "Publicado": "success",
  "Pausado": "delayed",
  "Cancelado": "cancelled",
  "Reprovado": "cancelled",
  "Reagendado": "delayed",
  "Conteúdo reciclado": "delayed",
  "Aguardando feedback": "warning",
};

export const statusClassMap: Record<ContentStatus, string> = Object.fromEntries(
  STATUS_OPTIONS.map((s) => [s, `status-badge-${statusColorMap[s]}`])
) as Record<ContentStatus, string>;

export const rowIndicatorMap: Record<ContentStatus, string> = Object.fromEntries(
  STATUS_OPTIONS.map((s) => [s, `row-indicator-${statusColorMap[s]}`])
) as Record<ContentStatus, string>;

export function getStageForStatus(status: ContentStatus): ContentStage {
  for (const group of STATUS_GROUPS) {
    if (group.statuses.includes(status)) return group.stage;
  }
  return "Extras";
}

export const STAGE_COLORS: Record<ContentStage, string> = {
  "Ideação": "info",
  "Pré-produção": "info",
  "Produção": "accent",
  "Aprovação": "warning",
  "Publicação": "success",
  "Extras": "delayed",
};
