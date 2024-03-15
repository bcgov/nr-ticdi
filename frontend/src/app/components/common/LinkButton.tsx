import React from 'react';
import { Button } from 'react-bootstrap';

interface LinkButtonProps {
  onClick: () => void;
  text: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ onClick, text }) => {
  return (
    <Button variant="link" onClick={onClick} className="linkButton">
      {text}
    </Button>
  );
};

export default LinkButton;
