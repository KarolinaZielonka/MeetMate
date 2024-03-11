import { DayModes, MonthEntities } from "./types";

export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfWeek = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export const getMode = (entities: MonthEntities, date: Date): DayModes =>
  entities.find((entity) => entity.date.toDateString() === date.toDateString())
    ?.mode || "";

export const groupEntitiesByType = (
  entities: MonthEntities
): Record<DayModes, string[]> => {
  const res: Record<DayModes, string[]> = {
    "": [],
    maybe: [],
    allow: [],
    disallow: [],
  };
  entities.forEach((i) => res[i.mode].push(i.date.toDateString()));
  return res;
};
