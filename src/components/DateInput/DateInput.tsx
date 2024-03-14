import React, { ChangeEvent } from "react";

interface DateInputProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col space-y-1 items-center my-2">
      <label htmlFor="date" className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="date"
        id="date"
        name="date"
        value={value}
        onChange={onChange}
        className="w-1/2 px-3 py-2 text-sm leading-tight text-gray-700 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
      />
    </div>
  );
};

export default DateInput;
