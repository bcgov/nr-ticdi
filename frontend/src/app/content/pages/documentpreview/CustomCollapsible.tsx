import React, { FC, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faMinus } from '@fortawesome/fontawesome-free-solid';
import './DocumentPreview.scss';


interface CustomCollapsibleProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    toggleCollapsible: () => void;
    isSpanRequired: boolean
}

const CustomCollapsible: FC<CustomCollapsibleProps> = ({ title, children, isOpen, toggleCollapsible, isSpanRequired }) => {
    const [isOpenonClick, setIsOpenOnClick] = useState(isOpen);
    const icon = isOpenonClick ? faMinus : (faPlus as IconProp);

    const contentStyle = {
        display: isOpenonClick ? 'block' : 'none',
    };


    const handleClick: React.MouseEventHandler<HTMLSelectElement> = () => {
        console.log('Select was clicked');
    };


    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        console.log('Selected value:', e.target.value);
    };
    const toggleCollapsibleOnClick = () => {
        //setIsInternalClick(true);
        setIsOpenOnClick(!isOpenonClick);
    };

    useEffect(() => {
        setIsOpenOnClick(isOpen);
    }, [isOpen]);


    return (
        <div className="form-group">
            <div className="mb-2 d-flex align-items-center" >
                <FontAwesomeIcon icon={icon as IconProp} className="inlineDiv collapsibleTitle" onClick={toggleCollapsibleOnClick} />
                <div className="ml-2 inlineDiv collapsibleTitle boldText" onClick={toggleCollapsibleOnClick}>{title}</div>
                {isSpanRequired ? <div className="group-select-container">
                    <label htmlFor="groupSelect" className="group-select-label">Select a Group:</label>
                    <select id="groupSelect" className="group-select"
                        onClick={handleClick}
                        onChange={handleChange} >
                        <option value="110">110</option>
                        {/* other options */}
                    </select>
                    <span className="max-group-text">Max for This Group is X</span>
                </div> : ""}
            </div>

            <hr />
            <div style={contentStyle}>{children}</div>
        </div>
    );
};

export default CustomCollapsible;
