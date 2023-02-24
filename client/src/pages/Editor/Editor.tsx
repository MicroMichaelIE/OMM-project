import { useEffect, useState, useMemo, useRef, SetStateAction, createRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Meme } from '../../types/types'
//import React, { useState } from "react";
//import Template from '../Templates/Templates'
import { Buffer } from 'buffer'
import { useNavigate } from 'react-router-dom'
import './Editor.scss'
import { Template } from '../../types/types'
import { getTemplatesBackend } from '../../services/templateService'
import { templateURL } from '../../services/urlService'
import { Icon } from '../../components/Icon/Icon'
import { EntryText } from '../../components/Entry/EntryText/EntryText'
import EntryDropdown from '../../components/Entry/EntryDropdown/EntryDropdown'
import EditorText from './EditorComponents/EditorText'
import { Button } from '../../components/Button/Button'
import Draggable from 'react-draggable'
import { fontOptions } from './EditorComponents/Fonts'
import { exportComponentAsJPEG, exportComponentAsPNG, exportComponentAsPDF } from 'react-component-export-image'
import { position } from 'html2canvas/dist/types/css/property-descriptors/position'

export const Editor = () => {
    const [allTemplates, setAllTemplates] = useState<Template[]>([])
    const [sideBarClosed, setSideBarClosed] = useState<boolean>(true)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [canvasRefs, setcanvasRefs] = useState<typeof canvasRef[]>()
    const [template, setTemplate] = useState<Template | null>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    const [dropdownValue, setDropdownValue] = useState<string>('')
    const [textNumber, setTextNumber] = useState<number>(0)

    const location = useLocation()
    const selectedTemplate = location.state

    const [font, setFont] = useState('Arial');
    const [size, setSize] = useState(16);
    const [color, setColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('');
    const [canvasWidth, setCanvasWidth] = useState(500);
    const [canvasHeight, setCanvasHeight] = useState(400);
    const [tempWidth, setTempWidth] = useState(500);
    const [tempHeight, setTempHeight] = useState(400);
    const [FrameWidth, setFrameWidth] = useState(70);
    const [Frameeight, setFrameHeight] = useState(42);
    const [imageSrc, setImageSrc] = useState('');
    const [imageLoaded, setImageLoaded] = useState(false);

    const generatedMemeRef = useRef<HTMLDivElement>(null);

    const handleFontChange = (e: { target: { value: SetStateAction<string> } }) => {
        setFont(e.target.value);
    };

    const handleSizeChange = (e: { target: { value: string } }) => {
        setSize(parseInt(e.target.value));
    };

    const handleColorChange = (e: { target: { value: SetStateAction<string> } }) => {
        setColor(e.target.value);
    };

    const handleBackgroundcolorChange = (e: { target: { value: SetStateAction<string> } }) => {
        setBackgroundColor(e.target.value);
    };

    const handleCanvasWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCanvasWidth(parseInt(e.target.value));
    };

    const handleCanvasHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCanvasHeight(parseInt(e.target.value));
    };


    useEffect(() => {
        if (selectedTemplate && selectedTemplate.template) {
            console.log(selectedTemplate.template)
            setTemplate(selectedTemplate.template)
        } else {
            console.log('No template selected')
        }
    }, [location])

    const templatesToState = async () => {
        const { ok, message, templates } = await getTemplatesBackend()
        if (ok && templates) {
            setAllTemplates(templates)
        } else {
            console.log(message)
        }
    }

    useMemo(() => {
        templatesToState()
    }, [])



    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            if (context) {
                ctxRef.current = context;
                if (template && template.imageLocation) {
                    const img = new Image();
                    img.src = `${templateURL}/${template.imageLocation}`;
                    setImageSrc(img.src);
                    img.onload = () => {
                        setImageLoaded(true);
                        const aspectRatio = img.width / img.height;
                        const targetAspectRatio = tempWidth / tempHeight;
                        let drawWidth, drawHeight, x, y;
                        if (aspectRatio > targetAspectRatio) {
                            drawWidth = tempWidth;
                            drawHeight = drawWidth / aspectRatio;
                            x = 0;
                            y = (tempHeight - drawHeight) / 2;
                        } else {
                            drawHeight = tempHeight;
                            drawWidth = drawHeight * aspectRatio;
                            x = (tempWidth - drawWidth) / 2;
                            y = 0;
                        }
                        context.drawImage(img, x, y, drawWidth, drawHeight);
                    }
                    img.onerror = () => {
                        setImageLoaded(true);
                    };
                }
            }
            console.log("am i here " + canvasRef.current)

        }
    }, [template, canvasRef, canvasWidth, canvasHeight, tempWidth, tempHeight]);

    const handleExportAsJPEG = () => {
        if (!imageLoaded) {
            console.log('Image not loaded yet');
            return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const imageDataURL = canvas.toDataURL('image/jpeg');
            const link = document.createElement('a');
            link.download = 'image.jpg';
            link.href = imageDataURL;
            link.click();
        }
    };

    const addNewText = () => {
        setTextNumber(textNumber + 1)
    }

    return (
        <div className="Editor">
            <div className="Canvas-Area">
                <div ref={generatedMemeRef} className="Canvas" style={{ width: `70rem`, height: '42rem', backgroundColor: 'white', margin: ' 0 auto' }}>

                    {
                        canvasRefs ?
                            canvasRefs.map((canvasRef, index) => (
                                <Draggable>
                                    <canvas key={index} ref={canvasRef} width={200} height={200}></canvas>
                                </Draggable>
                            ))
                            :
                            <Draggable>
                                <canvas ref={canvasRef} style={{ height: '100%' }} />
                            </Draggable>
                    }

                    {Array(textNumber)
                        .fill(0)
                        .map((e) => (
                            <div className="container" style={{ position: 'relative' }}>
                                <EditorText
                                    font={font}
                                    size={size}
                                    color={color}
                                    backgroundColor={backgroundColor} />
                            </div>
                        ))
                    }
                </div>
                <div className="Canvas-Controls">
                    <div className="Labels">
                        <button onClick={addNewText}>Add a New Text</button>
                        <button onClick={() => setTextNumber(0)}>Clear</button>
                        <button onClick={handleExportAsJPEG}>Export as JPEG</button>

                        {/* <EntryText id='text' label='Text' type='text' name='text' />
                        <EntryText id='xvalue' label='X Position' type='number' name='xvalue' />
                        <EntryText id='yvalue' label='Y position' type='number' name='yvalue' /> */}
                    </div>
                    <div className="Font">
                        <EntryDropdown
                            options={fontOptions}
                            label="Font"
                            selected={font}
                            objectKey="fontFamily"
                            setSelected={(optionName, optionValue) =>
                                handleFontChange({ target: { value: optionValue } })
                            }
                            id=""
                        />
                        <EntryText id="fontsize" name="fontsize" label="Font Size" value={size} onChange={handleSizeChange} type="number" />
                        <EntryText id="color" name="color" label="Color" value={color} onChange={handleColorChange} type="color" />
                        <EntryText id="backgroundcolor" name="backgroundcolor" label="BackgroundColor" value={backgroundColor} onChange={handleBackgroundcolorChange} type="color" />
                        <EntryText id="canvasWidth" name="canvasWidth" label="Canvas Width" value={canvasWidth} onChange={(e) => setCanvasWidth(parseInt(e.target.value))} type="number" />
                        <EntryText id="canvasHeight" name="canvasHeight" label="Canvas Height" value={canvasHeight} onChange={(e) => setCanvasHeight(parseInt(e.target.value))} type="number" />
                        <EntryText id="tempWidth" name="tempWidth" label="Template Width" value={tempWidth} onChange={(e) => setTempWidth(parseInt(e.target.value))} type="number" />
                        <EntryText id="tempHeight" name="tempHeight" label="Template Height" value={tempHeight} onChange={(e) => setTempHeight(parseInt(e.target.value))} type="number" />
                    </div>
                </div>
            </div>
            {sideBarClosed ? (
                <button className="icon" type='button' style={{ justifyContent: 'flex-end' }} onClick={() => setSideBarClosed(!sideBarClosed)}>
                    <Icon name="chevron_left" />
                    Open Templates
                </button>
            ) : (
                <button className="icon" type='button' onClick={() => setSideBarClosed(!sideBarClosed)}>
                    <Icon name="chevron_right" />
                </button>
            )}
            <div className="templatesSideBar" style={{ display: sideBarClosed ? "none" : 'block' }}>
                <div className="sideBarScroll">
                    {allTemplates.map((t) => (
                        <div
                            key={t._id}
                            className="templates"
                            onClick={() => {
                                setTemplate(t)
                                console.log(t)
                                if (canvasRefs) {
                                    console.log("yo yoy oyoyoyoyo   " + canvasRefs)
                                    setcanvasRefs([...canvasRefs, canvasRef]);
                                }
                                else
                                    setcanvasRefs([canvasRef]);
                            }
                            }
                        >
                            <h3>{t.name}</h3>
                            <div className="controlImage">
                                <img
                                    src={`${templateURL}/${t.imageLocation}`}
                                    alt={t.name}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}