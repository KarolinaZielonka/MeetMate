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
      className={`m-8 p-2 bg-yellow rounded-md text-light`}
    >
      {text}
    </button>
  );
};

export default Button;
