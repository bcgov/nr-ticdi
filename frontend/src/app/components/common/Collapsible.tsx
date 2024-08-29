import React, { FC, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faMinus } from '@fortawesome/fontawesome-free-solid';
import '../../css/DocumentPreview.scss';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  enabled?: boolean;
}

const Collapsible: FC<CollapsibleProps> = ({ title, children, isOpen, enabled = true }) => {
  const [isOpenonClick, setIsOpenOnClick] = useState(isOpen);
  const icon = isOpenonClick ? faMinus : (faPlus as IconProp);

  const contentStyle = {
    display: enabled ? (isOpenonClick ? 'block' : 'none') : 'none',
  };

  const toggleCollapsibleOnClick = () => {
    setIsOpenOnClick(!isOpenonClick);
  };

  useEffect(() => {
    setIsOpenOnClick(isOpen);
  }, [isOpen]);

  return (
    <div className="form-group">
      <div className="mb-2 d-flex align-items-center">
        <FontAwesomeIcon
          icon={icon as IconProp}
          className={`inlineDiv collapsibleTitle`}
          onClick={toggleCollapsibleOnClick}
        />
        <div className={`ml-2 inlineDiv collapsibleTitle boldText`} onClick={toggleCollapsibleOnClick}>
          {title}
        </div>
      </div>

      <div style={contentStyle}>{children}</div>
    </div>
  );
};

export default Collapsible;
