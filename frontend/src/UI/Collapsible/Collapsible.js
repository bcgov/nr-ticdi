import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/fontawesome-free-solid";

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapsible = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div onClick={toggleCollapsible}>
      <div className="pb-2 pt-2 pl-3 d-flex align-items-center">
        <FontAwesomeIcon
          icon={isOpen ? faMinus : faPlus}
          className="inlineDiv"
        />
        <div className="ml-2 inlineDiv collapsibleTitle">{title}</div>
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default Collapsible;
