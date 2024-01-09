import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/fontawesome-free-solid";

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapsible = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div onClick={toggleCollapsible}>
      <div className="flex items-center">
        <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} />
        <div className="text-lg font-bold ml-2">{title}</div>
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default Collapsible;
