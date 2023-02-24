import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import './EditorText.scss';

interface EditorTextProps {
    font: string;
    size: number;
    color: string;
    backgroundColor: string;
    style?: React.CSSProperties;
}

const EditorText = ({ font, size, color, backgroundColor }: EditorTextProps) => {
    const [edit, setEdit] = useState(false);
    const [text, setText] = useState('Text');
    const [style, setStyle] = useState({});

    const handleClick = () => {
        setEdit(!edit);
    };

    const handleSingleClick = () => {
        setEdit(false);
    };

    const handleChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setText(e.target.value);
    };

    const handleBlur = () => {
        setEdit(false);
    };

    const handleFontChange = (e: { target: { value: any } }) => {
        setStyle((prevStyle) => ({ ...prevStyle, fontFamily: e.target.value }));
    };

    const handleSizeChange = (e: { target: { value: any } }) => {
        setStyle((prevStyle) => ({ ...prevStyle, fontSize: `${e.target.value}px` }));
    };

    const handleColorChange = (e: { target: { value: any } }) => {
        setStyle((prevStyle) => ({ ...prevStyle, color: e.target.value }));
    };

    return (
        <Draggable>
            {edit ? (
                <input
                    value={text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ ...style, fontFamily: font, fontSize: `${size}px`, color }}
                />
            ) : (
                <ResizableBox
                    width={200}
                    height={200}
                    handle={<div className="handle" />}
                    handleSize={[8, 8]}
                    minConstraints={[100, 100]}
                    maxConstraints={[600, 600]}
                >
                    <h1
                        onDoubleClick={handleClick}
                        style={{
                            ...style,
                            fontFamily: font,
                            fontSize: `${size}px`,
                            color,
                            backgroundColor,
                        }}
                    >
                        {text}
                    </h1>
                </ResizableBox>
            )
            }
        </Draggable >
    );
};

export default EditorText;
