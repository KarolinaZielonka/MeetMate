export type DayModes = "" | "allow" | "disallow" | "maybe";
export type MonthEntities = Array<{
  date: Date;
  mode: DayModes;
}>;
