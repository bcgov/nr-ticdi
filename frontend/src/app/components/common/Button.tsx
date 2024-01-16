import React, { FC } from "react";

interface ButtonProps {
  onClick(): any;
  text: string;
}

const Button: FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <div className="col-md-4 mt-2 mb-2 p-0">
      <button type="button" className="btn btn-primary" onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default Button;
