import React from "react";
import "./Calendar.css";

import Calendar from "react-calendar";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CustomCalendar() {
  const [value, setValue] = React.useState<Value>(new Date());

  const onChange = (
    nextValue: Value,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log(nextValue, event);
    setValue(nextValue);
  };

  return (
    <Calendar
      onChange={onChange}
      value={value}
      selectRange
      // minDate should be today's date
      minDate={new Date()}
    />
  );
}