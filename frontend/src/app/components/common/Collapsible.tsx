import React, { useState, FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faMinus } from '@fortawesome/fontawesome-free-solid';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

const Collapsible: FC<CollapsibleProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapsible = () => {
    setIsOpen(!isOpen);
  };

  const icon = isOpen ? faMinus : (faPlus as IconProp);

  const contentStyle = {
    display: isOpen ? 'block' : 'none',
  };

  return (
    <div className="form-group">
      <div className="mb-2 d-flex align-items-center" onClick={toggleCollapsible}>
        <FontAwesomeIcon icon={icon as IconProp} className="inlineDiv" />
        <div className="ml-2 inlineDiv collapsibleTitle">{title}</div>
      </div>
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

export default Collapsible;
