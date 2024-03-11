import React from "react";

type ButtonProps = {
  text: string;
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`m-8 p-2 bg-yellow-600 rounded-md text-slate-100`}
    >
      {text}
    </button>
  );
};

export default Button;
