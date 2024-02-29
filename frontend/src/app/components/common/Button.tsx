import { FC } from 'react';

interface ButtonProps {
  onClick(): any;
  text: string;
  type?: string;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ onClick, text, type = 'btn-primary', disabled = false }) => {
  return (
    <div className="col-md-2 mt-2 mb-2 p-0">
      <button type="button" className={`btn ${type}`} onClick={onClick} disabled={disabled}>
        {text}
      </button>
    </div>
  );
};

export default Button;
