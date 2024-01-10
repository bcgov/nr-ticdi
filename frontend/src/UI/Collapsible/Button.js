import React from "react";

const Button = ({ onClick, text }) => {
  return (
    <div className="col-md-4">
      <button type="button" className="btn btn-primary" onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default Button;
