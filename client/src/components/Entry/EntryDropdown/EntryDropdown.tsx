//IMPORTS

import React, { useState } from 'react';
import './EntryDropdown.scss';
import { OptionFlyout } from './OptionFlyout/OptionFlyout';

type DropdownProps = {
    id: string;
    label: string;
    options: { display: string; value: string | number }[];
    selected: string;
    objectKey: string;
    setSelected: (optionName: string, optionValue: string, queryValue: string) => void;
};

function EntryDropdown({ options, selected, objectKey, label, setSelected }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setSelected(e.currentTarget.name, e.currentTarget.value, e.currentTarget.dataset.value as string);
        setIsOpen(false);
    };

    // STATES
    return (
        <div className="EntryDropdown">
            <label>{label}</label>
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
                    {options.map((option, index) => (
                        <OptionFlyout
                            key={index}
                            flyout_name={objectKey}
                            flyout_display={option.display}
                            flyout_value={option.value}
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
