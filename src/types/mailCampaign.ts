export type CampaignStatus = "Rascunho" | "Agendada" | "Enviada" | "Pausada" | "Cancelada";

export const CAMPAIGN_STATUS_OPTIONS: CampaignStatus[] = [
  "Rascunho",
  "Agendada",
  "Enviada",
  "Pausada",
  "Cancelada",
];

export const CAMPAIGN_SEGMENTS = [
  "Clientes Ativos",
  "Leads",
  "Base Completa",
  "Reengajamento",
] as const;

export type CampaignSegment = (typeof CAMPAIGN_SEGMENTS)[number];

export const campaignStatusClass: Record<CampaignStatus, string> = {
  Rascunho: "bg-delayed text-delayed-foreground",
  Agendada: "bg-accent text-accent-foreground",
  Enviada: "bg-success text-success-foreground",
  Pausada: "bg-[hsl(45,90%,50%)] text-foreground",
  Cancelada: "bg-cancelled text-cancelled-foreground",
};

export interface MailCampaign {
  id: string;
  number: number;
  nome: string;
  assunto: string;
  preheader: string;
  segmento: CampaignSegment | "";
  responsavel: string;
  dataEnvio: string; // ISO datetime
  status: CampaignStatus;
  taxaAbertura: number | null;
  taxaClique: number | null;
  descadastros: number | null;
  observacoes: string;
}
