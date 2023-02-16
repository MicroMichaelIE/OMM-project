// IMPORTS
import React, { useState, ReactElement } from 'react';
import { TabTitle } from '../TabTitle/TabTitle';
import './TabSwitcher.scss';

type TabSwitcherProps = {
    children: ReactElement[];
};

export const TabSwitcher = ({ children }: TabSwitcherProps) => {
    // STATES

    const [activeTab, setActiveTab] = useState(0);

    // FUNCTIONS

    // RENDER

    return (
        <div className="TabSwitcher">
            <ul className="TabHeader">
                {children.map((child, index) => {
                    const { title } = child.props;

                    return (
                        <TabTitle
                            key={index}
                            title={title}
                            index={index}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    );
                })}
            </ul>
            <div className="TabContent">{children[activeTab]}</div>
        </div>
    );
};
