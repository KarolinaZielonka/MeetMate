import { create } from "zustand";
import { MonthEntities } from "../types";

type Store = {
  entities: MonthEntities;
  setEntities: (newMode: MonthEntities) => void;
};

export const useEntitiesStore = create<Store>()((set) => ({
  entities: [],
  setEntities: (newEntities) => set(() => ({ entities: newEntities })),
}));
