//IMPORTS
import React from 'react';
import './OptionFlyout.scss';

type OptionFlyoutProps = {
    flyout_name: string;
    flyout_value: string | number;
    flyout_display: string;
    handleDropdownClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const OptionFlyout = ({ flyout_name, flyout_value, flyout_display, handleDropdownClick }: OptionFlyoutProps) => {
    //Data of this one industry

    //RENDER
    return (
        <div className="OptionButton">
            <button
                className="button"
                name={flyout_name}
                onClick={handleDropdownClick}
                value={flyout_display}
                data-value={flyout_value}
            >
                {flyout_display}
            </button>
        </div>
    );
};
