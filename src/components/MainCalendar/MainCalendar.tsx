import { useModeStore } from "../../stores/StatePickerStore";
import "../../styles.css";
import { useState } from "react";
import { days, getDaysInMonth, getFirstDayOfWeek, getMode } from "../../utils";
import { useEntitiesStore } from "../../stores/EntitiesStore";

export default function MainPage() {
  const { mode, calendarRange } = useModeStore();
  const { entities, setEntities } = useEntitiesStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState(false);

  const daysInMonth = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const firstDayOfWeek = getFirstDayOfWeek(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const daysArray = Array.from({ length: daysInMonth }, (_, index) => {
    const dayNumber = index;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dayNumber + 1
    );
    const mode =
      date > new Date(calendarRange.start) && date < new Date(calendarRange.end)
        ? ""
        : "disabled";
    return {
      date,
      mode,
    };
  });
  const emptyDaysArray = [...Array(firstDayOfWeek).keys()];

  const updateDayMode = (date: Date): void => {
    if (mode === "") {
      setError(true);
      setTimeout(() => setError(false), 1000);
      return;
    }
    const indexOfOldItem = entities.findIndex(
      ({ date: entityDate }) =>
        entityDate.toDateString() === date.toDateString()
    );
    if (indexOfOldItem !== -1) {
      const newArr = [
        ...entities.slice(0, indexOfOldItem),
        { ...entities[indexOfOldItem], mode: mode },
        ...entities.slice(indexOfOldItem + 1),
      ];
      setEntities(newArr);
    } else {
      setEntities([
        ...entities,
        {
          mode,
          date,
        },
      ]);
    }
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white i react-calendar inline m-4 p-2 rounded-lg">
      {error && (
        <div
          className="max-w-xs bg-red text-sm text-white rounded-xl shadow-lg absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          role="alert"
        >
          <div className="flex p-4">Earlier choose mode!</div>
        </div>
      )}
      <div className="flex justify-between">
        <button
          className="p-1 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-md bg-gradient-to-br from-green-600 to-lime-600 hover:text-white dark:text-white"
          disabled={currentDate.getMonth() === 0}
          onClick={() => changeMonth(-1)}
        >
          Previous Month
        </button>
        <h1 className="uppercase font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h1>
        <button
          className="p-1 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-md bg-gradient-to-br from-green-600 to-lime-600 hover:text-white dark:text-white"
          disabled={currentDate.getMonth() === 11}
          onClick={() => changeMonth(1)}
        >
          Next Month
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mt-10">
        {days.map((d) => (
          <p key={`day-${d}`}>{d}</p>
        ))}
        {emptyDaysArray.map((_, index) => (
          <div key={`empty-${index}`} className="empty-day"></div>
        ))}
        {daysArray.map((day, index) => (
          <div
            key={`day-${index}`}
            className={`${getMode(entities, day.date)} ${
              day.mode === "disabled" ? "disabled" : ""
            } day
            ${day.mode !== "disabled" && "hover:bg-gray"}
            `}
            onClick={() => day.mode !== "disabled" && updateDayMode(day.date)}
          >
            {day.date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}
