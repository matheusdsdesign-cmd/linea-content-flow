export type ContentStatus = "Em andamento" | "Publicado" | "Adiado" | "Cancelado";

export type ContentFormat = "Reels" | "Carrossel" | "Post estático" | "Story" | "Artigo" | "E-mail" | "Vídeo";

export interface ContentItem {
  id: string;
  number: number;
  tema: string;
  formato: ContentFormat;
  responsavel: string;
  dataCaptacao: string;
  dataPublicacao: string;
  status: ContentStatus;
  observacoes: string;
}

export const STATUS_OPTIONS: ContentStatus[] = ["Em andamento", "Publicado", "Adiado", "Cancelado"];
export const FORMAT_OPTIONS: ContentFormat[] = ["Reels", "Carrossel", "Post estático", "Story", "Artigo", "E-mail", "Vídeo"];

export const statusClassMap: Record<ContentStatus, string> = {
  "Em andamento": "status-badge-em-andamento",
  "Publicado": "status-badge-publicado",
  "Adiado": "status-badge-adiado",
  "Cancelado": "status-badge-cancelado",
};

export const rowIndicatorMap: Record<ContentStatus, string> = {
  "Em andamento": "row-indicator-em-andamento",
  "Publicado": "row-indicator-publicado",
  "Adiado": "row-indicator-adiado",
  "Cancelado": "row-indicator-cancelado",
};
