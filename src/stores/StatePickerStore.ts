import { create } from "zustand";
import { DayModes } from "../types";

type Store = {
  mode: DayModes;
  setMode: (newMode: DayModes) => void;
  calendarRange: {
    start: string;
    end: string;
  };
  setCalendarRange: (newValue: string, type: string) => void;
};

export const useModeStore = create<Store>()((set) => ({
  mode: "",
  setMode: (newMode) => set(() => ({ mode: newMode })),
  calendarRange: {
    start: "",
    end: "",
  },
  // depending on the type, set the start or end date
  setCalendarRange: (newValue, type) => set((prev) => ({
    ...prev,
    calendarRange: {
      ...prev.calendarRange,
      [type]: newValue,
    },
  })),
}));
