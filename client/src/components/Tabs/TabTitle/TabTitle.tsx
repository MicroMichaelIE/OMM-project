// IMPORTS
import React from 'react';
import './TabTitle.scss';

type TabTitleProps = {
    title: string;
    index: number;
    activeTab: number;
    setActiveTab: (index: number) => void;
};

export const TabTitle = ({ title, index, setActiveTab, activeTab }: TabTitleProps) => {
    const isActive = index === activeTab ? 'active' : '';

    return (
        <li className="TabTitle">
            <button onClick={() => setActiveTab(index)} className={`tabTitleButton ${isActive}`}>
                {title}
            </button>
        </li>
    );
};
