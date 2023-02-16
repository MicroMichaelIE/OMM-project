import React from 'react';
import './Button.scss';

interface ButtonProps {
    onClick?: () => void;
    onHover?: () => void;
    text: string;
    type: 'button' | 'submit' | 'reset';
    className?: 'normal' | 'inverted';
    isDisabled?: boolean;
}

export const Button = (props: ButtonProps) => {
    return (
        <button
            className={`Button ${props.className}`}
            type={props.type}
            onClick={props.onClick}
            disabled={props.isDisabled}
        >
            {props.text}
        </button>
    );
};
