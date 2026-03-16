import { useState, useCallback } from "react";
import { ContentItem } from "@/types/content";

const STORAGE_KEY = "linea-content-planner";

function loadFromStorage(): ContentItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
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
      plataforma: "Instagram",
      dataCaptacao: "",
      dataPublicacao: "",
      status: "Pauta definida",
      observacoes: "",
    };
    persist([...items, newItem]);
  }, [items, persist]);

  const updateItem = useCallback((id: string, field: keyof ContentItem, value: string) => {
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

  return { items, addItem, updateItem, deleteItem };
}
