// IMPORTS
import React from 'react';
import './Tab.scss';

type TabProps = {
    title: string;
    children: React.ReactNode;
};

function Tab({ children }: TabProps) {
    return <div className="Tab">{children}</div>;
}

export default Tab;
