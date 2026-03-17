import { useState, useCallback } from "react";
import { ContentItem, ContentAttachment } from "@/types/content";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "linea-content-planner";

function loadFromStorage(): ContentItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    // Migrate old items: plataforma -> plataformas, add anexos
    const items = JSON.parse(data) as any[];
    return items.map((item) => ({
      ...item,
      plataformas: item.plataformas || (item.plataforma ? [item.plataforma] : ["Instagram"]),
      anexos: item.anexos || [],
    }));
  } catch {
    return [];
  }
}

function saveToStorage(items: ContentItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useContentData() {
  const [items, setItems] = useState<ContentItem[]>(loadFromStorage);

  const persist = useCallback((updated: ContentItem[]) => {
    setItems(updated);
    saveToStorage(updated);
  }, []);

  const addItem = useCallback(() => {
    const newItem: ContentItem = {
      id: crypto.randomUUID(),
      number: items.length + 1,
      tema: "",
      formato: "Post estático",
      responsavel: "",
      plataformas: ["Instagram"],
      dataCaptacao: "",
      dataPublicacao: "",
      status: "Pauta definida",
      observacoes: "",
      anexos: [],
    };
    persist([...items, newItem]);
  }, [items, persist]);

  const updateItem = useCallback((id: string, field: keyof ContentItem, value: any) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    persist(updated);
  }, [items, persist]);

  const deleteItem = useCallback((id: string) => {
    const updated = items
      .filter((item) => item.id !== id)
      .map((item, i) => ({ ...item, number: i + 1 }));
    persist(updated);
  }, [items, persist]);

  const uploadAttachment = useCallback(async (itemId: string, file: File) => {
    const path = `${itemId}/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from("roteiros").upload(path, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("roteiros").getPublicUrl(path);
    const attachment: ContentAttachment = {
      name: file.name,
      url: urlData.publicUrl,
      path,
    };
    const item = items.find((i) => i.id === itemId);
    if (item) {
      const updated = items.map((i) =>
        i.id === itemId ? { ...i, anexos: [...i.anexos, attachment] } : i
      );
      persist(updated);
    }
    return attachment;
  }, [items, persist]);

  const deleteAttachment = useCallback(async (itemId: string, path: string) => {
    await supabase.storage.from("roteiros").remove([path]);
    const updated = items.map((i) =>
      i.id === itemId ? { ...i, anexos: i.anexos.filter((a) => a.path !== path) } : i
    );
    persist(updated);
  }, [items, persist]);

  return { items, addItem, updateItem, deleteItem, uploadAttachment, deleteAttachment };
}
