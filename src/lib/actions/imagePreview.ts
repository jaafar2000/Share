import { create } from "zustand";

interface ImageStore {
  image: string | null;
  setImage: (file: string) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  image: null,
  setImage: (file) => set({ image: file }),
}));