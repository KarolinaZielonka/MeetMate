import React from "react";

const Button: React.FC<{
  text: string;
  onClick: () => void;
}> = ({ text, onClick }) => {
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
