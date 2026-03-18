import { useState, useCallback } from "react";
import { MailCampaign } from "@/types/mailCampaign";

const STORAGE_KEY = "linea-mail-campaigns";

function load(): MailCampaign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items: MailCampaign[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useMailCampaigns() {
  const [campaigns, setCampaigns] = useState<MailCampaign[]>(load);

  const persist = useCallback((updated: MailCampaign[]) => {
    setCampaigns(updated);
    save(updated);
  }, []);

  const addCampaign = useCallback(() => {
    const item: MailCampaign = {
      id: crypto.randomUUID(),
      number: campaigns.length + 1,
      nome: "",
      assunto: "",
      preheader: "",
      segmento: "",
      responsavel: "",
      dataEnvio: "",
      status: "Rascunho",
      taxaAbertura: null,
      taxaClique: null,
      descadastros: null,
      observacoes: "",
    };
    persist([...campaigns, item]);
  }, [campaigns, persist]);

  const updateCampaign = useCallback(
    (id: string, field: keyof MailCampaign, value: any) => {
      persist(campaigns.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    },
    [campaigns, persist]
  );

  const deleteCampaign = useCallback(
    (id: string) => {
      persist(
        campaigns
          .filter((c) => c.id !== id)
          .map((c, i) => ({ ...c, number: i + 1 }))
      );
    },
    [campaigns, persist]
  );

  return { campaigns, addCampaign, updateCampaign, deleteCampaign };
}
