//IMPORTS

import React, { useState } from 'react';
import './EntryDropdown.scss';
import OptionFlyout from './OptionFlyout/OptionFlyout';

type DropdownProps = {
    options: string[];
    selected: string;
    objectKey: string;
    setSelected: (optionName: string, optionValue: string) => void;
};

function EntryDropdown({ options, selected, objectKey, setSelected }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log(e);
        setSelected(e.currentTarget.name, e.currentTarget.value);
        setIsOpen(false);
    };

    // STATES
    return (
        <div className="EntryDropdown">
            <label>Industries</label>
            <div className="EntryBox" onClick={() => toggleDropdown()}>
                <div className="left" placeholder="test">
                    {selected}
                </div>
                <div className="right">
                    <span className="material-symbols-outlined">expand_more</span>
                </div>
            </div>
            <div className="slightpadding">
                <div className="OptionDropdown" style={{ display: isOpen ? 'block' : 'none' }}>
                    {options.map((name, index) => (
                        <OptionFlyout
                            key={index}
                            flyout_name={objectKey}
                            flyout_value={name}
                            handleDropdownClick={handleOptionClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EntryDropdown;
/*
props.data.map(industry => (
  <li key={industry._id}>
  <button type="button" className="hds-OptionFlyoutItem" value={industry.IndustryName} key={industry._id}>
      <span>{industry.IndustryName}</span>
  </button>
</li>
*/
