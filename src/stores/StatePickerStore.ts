import { create } from "zustand";
import { DayModes } from "../types";

type Store = {
  mode: DayModes;
  setMode: (newMode: DayModes) => void;
};

export const useModeStore = create<Store>()((set) => ({
  mode: "",
  setMode: (newMode) => set(() => ({ mode: newMode })),
}));
