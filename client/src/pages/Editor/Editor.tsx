// import { useEffect, useState, useMemo, useRef } from 'react'
// import { useLocation } from 'react-router-dom'
// import { Meme } from '../../types/types'
// //import React, { useState } from "react";
// //import Template from '../Templates/Templates'
// import { Buffer } from 'buffer'
// import { useNavigate } from 'react-router-dom'
// import './Editor.scss'
// import { Template } from '../../types/types'
// import { getTemplatesBackend } from '../../services/templateService'
// import { templateURL } from '../../services/urlService'
// import { Icon } from '../../components/Icon/Icon'
// import { EntryText } from '../../components/Entry/EntryText/EntryText'
// import EntryDropdown from '../../components/Entry/EntryDropdown/EntryDropdown'

// export const Editor = () => {
//     const [allTemplates, setAllTemplates] = useState<Template[]>([])
//     const [sideBarClosed, setSideBarClosed] = useState<boolean>(true)
//     const canvasRef = useRef<HTMLCanvasElement>(null)
//     const [template, setTemplate] = useState<Template | null>(null)
//     const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
//     const [dropdownValue, setDropdownValue] = useState<string>('')

//     const fontOptions = [
//         { display: "Arial", value: "arial" },
//         { display: "Impact", value: "impact" },
//     ]

//     const location = useLocation()
//     const selectedTemplate = location.state

//     useEffect(() => {
//         if (selectedTemplate && selectedTemplate.template) {
//             console.log(selectedTemplate.template)
//             setTemplate(selectedTemplate.template)
//         } else {
//             console.log('No template selected')
//         }
//     }, [location])

//     const templatesToState = async () => {
//         const { ok, message, templates } = await getTemplatesBackend()
//         if (ok && templates) {
//             setAllTemplates(templates)
//         } else {
//             console.log(message)
//         }
//     }

//     useMemo(() => {
//         templatesToState()
//     }, [])



//     useEffect(() => {
//         if (canvasRef.current) {
//             const canvas = canvasRef.current;
//             const context = canvas.getContext('2d');
//             canvas.width = 500;
//             canvas.height = 400;
//             if (context) {
//                 ctxRef.current = context;
//                 if (template && template.imageLocation) {
//                     const img = new Image();
//                     img.src = `${templateURL}/${template.imageLocation}`;
//                     console.log(img.src)
//                     img.onload = () => {
//                         console.log(img)
//                         context.drawImage(img, 0, 0, canvas.width, canvas.height)
//                     }
//                 }
//             }
//         }
//     }, [template, canvasRef]);

//     return (
//         <div className="Editor">
//             <div className="Canvas-Area">
//                 <div className="Canvas"><canvas ref={canvasRef} /></div>
//                 <div className="Canvas-Controls">
//                     <div className="Labels">
//                         <EntryText id='text' label='Text' type='text' name='text' />
//                         <EntryText id='xvalue' label='X Position' type='number' name='xvalue' />
//                         <EntryText id='yvalue' label='Y position' type='number' name='yvalue' />
//                     </div>
//                     <div className="Font">
//                         <EntryDropdown id="font_picker" label="Font" objectKey='fontName' options={fontOptions} selected={dropdownValue} setSelected={setDropdownValue} />
//                         <EntryText id='fontsize' label='Font Size' type='number' name='fontsize' />
//                         <EntryText id='color' label='Font Color' type='text' name='color' />
//                     </div>
//                 </div>
//             </div>
//             {sideBarClosed ? (
//                 <button className="icon" type='button' onClick={() => setSideBarClosed(!sideBarClosed)}>
//                     <Icon name="chevron_left" />
//                     Open Templates
//                 </button>
//             ) : (
//                 <button className="icon" type='button' onClick={() => setSideBarClosed(!sideBarClosed)}>
//                     <Icon name="chevron_right" />
//                 </button>
//             )}
//             <div className="templatesSideBar" style={{ display: sideBarClosed ? "none" : 'block' }}>
//                 <div className="sideBarScroll">
//                     {allTemplates.map((t) => (
//                         <div
//                             key={t._id}
//                             className="templates"
//                             onClick={() => {
//                                 setTemplate(t)
//                                 console.log(t)
//                             }}
//                         >
//                             <h3>{t.name}</h3>
//                             <div className="controlImage">
//                                 <img
//                                     src={`${templateURL}/${t.imageLocation}`}
//                                     alt={t.name}
//                                 />
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }

// import { useEffect, useState, useMemo, useRef } from 'react'
// import { useLocation } from 'react-router-dom'
// import { Meme } from '../../types/types'
// import { Buffer } from 'buffer'
// import { useNavigate } from 'react-router-dom'
// import './Editor.scss'
// import { Template } from '../../types/types'
// import { getTemplatesBackend } from '../../services/templateService'
// import { templateURL } from '../../services/urlService'
// import { Icon } from '../../components/Icon/Icon'
// import { EntryText } from '../../components/Entry/EntryText/EntryText'
// import EntryDropdown from '../../components/Entry/EntryDropdown/EntryDropdown'

// export const Editor = () => {
//     const [allTemplates, setAllTemplates] = useState<Template[]>([])
//     const [sideBarClosed, setSideBarClosed] = useState<boolean>(true)
//     const canvasRef = useRef<HTMLCanvasElement>(null)
//     const [template, setTemplate] = useState<Template | null>(null)
//     const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
//     const [dropdownValue, setDropdownValue] = useState<string>('')
//     const [inputValues, setInputValues] = useState<{ [key: string]: string }>({
//         text: '',
//         xvalue: '',
//         yvalue: '',
//         fontsize: '',
//         color: '',
//     })

//     const fontOptions = [
//         { display: "Arial", value: "arial" },
//         { display: "Impact", value: "impact" },
//     ]

//     const location = useLocation()
//     const selectedTemplate = location.state

//     useEffect(() => {
//         if (selectedTemplate && selectedTemplate.template) {
//             console.log(selectedTemplate.template)
//             setTemplate(selectedTemplate.template)
//         } else {
//             console.log('No template selected')
//         }
//     }, [location])

//     const templatesToState = async () => {
//         const { ok, message, templates } = await getTemplatesBackend()
//         if (ok && templates) {
//             setAllTemplates(templates)
//         } else {
//             console.log(message)
//         }
//     }

//     useMemo(() => {
//         templatesToState()
//     }, [])

//     const addTextToCanvas = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, size: number, color: string) => {
//         ctx.font = `${size}px ${font}`
//         ctx.fillStyle = color
//         ctx.fillText(text, x, y)
//     }

//     useEffect(() => {
//         if (canvasRef.current) {
//             const canvas = canvasRef.current;
//             const context = canvas.getContext('2d');
//             canvas.width = 500;
//             canvas.height = 400;
//             if (context) {
//                 ctxRef.current = context;
//                 if (template && template.imageLocation) {
//                     const img = new Image();
//                     img.src = `${templateURL}/${template.imageLocation}`;
//                     console.log(img.src)
//                     img.onload = () => {
//                         console.log(img)
//                         context.drawImage(img, 0, 0, canvas.width, canvas.height)
//                         if (inputValues.text) {
//                             addTextToCanvas(context, inputValues.text, Number(inputValues.xvalue), Number(inputValues.yvalue), dropdownValue, Number(inputValues.fontsize), inputValues.color)
//                         }
//                     }
//                 }
//             }
//         }
//     }, [template, canvasRef, dropdownValue, inputValues]);

//     return (
//         <div className="Editor">
//             <div className={`sidebar ${sideBarClosed ? 'closed' : ''}`}>
//                 <div className="sidebar__content">
//                     <div className="sidebar__header">
//                         <h3>Editor Tools</h3>
//                         <button onClick={() => setSideBarClosed(!sideBarClosed)}>{sideBarClosed ? <Icon name="menu" /> : <Icon name="close" />}</button>
//                     </div>
//                     <div className="sidebar__body">
//                         <EntryText
//                             label="Enter Text"
//                             name="text"
//                             value={inputValues.text}
//                             onChange={(e) => setInputValues({ ...inputValues, text: e.target.value })} id={''} type={''} />
//                         <EntryText
//                             label="Enter X Value"
//                             name="xvalue"
//                             value={inputValues.xvalue}
//                             onChange={(e) => setInputValues({ ...inputValues, xvalue: e.target.value })} id={''} type={''} />
//                         <EntryText
//                             label="Enter Y Value"
//                             name="yvalue"
//                             value={inputValues.yvalue}
//                             onChange={(e) => setInputValues({ ...inputValues, yvalue: e.target.value })} id={''} type={''} />
//                         <EntryText
//                             label="Enter Font Size"
//                             name="fontsize"
//                             value={inputValues.fontsize}
//                             onChange={(e) => setInputValues({ ...inputValues, fontsize: e.target.value })} id={''} type={''} />
//                         <EntryText
//                             label="Enter Color"
//                             name="color"
//                             value={inputValues.color}
//                             onChange={(e) => setInputValues({ ...inputValues, color: e.target.value })} id={''} type={''} />
//                         <EntryDropdown
//                             label="Select Font"
//                             id="font"
//                             options={fontOptions}
//                             selected={dropdownValue}
//                             objectKey="font"
//                             setSelected={(optionName, optionValue) => setDropdownValue(optionValue)}
//                         />

//                     </div>
//                     <div className="sidebar__footer">
//                         <button className="button" onClick={() => { }}>Save Meme</button>
//                     </div>
//                 </div>
//             </div>
//             <div className="canvas-container">
//                 <canvas ref={canvasRef}></canvas>
//             </div>
//         </div>
//     )
// }
// export default Editor
// import { useEffect, useState, useMemo, useRef } from 'react'
// import { useLocation } from 'react-router-dom'
// import { Meme } from '../../types/types'
// import { Buffer } from 'buffer'
// import { useNavigate } from 'react-router-dom'
// import './Editor.scss'
// import { Template } from '../../types/types'
// import { getTemplatesBackend } from '../../services/templateService'
// import { templateURL } from '../../services/urlService'
// import { Icon } from '../../components/Icon/Icon'
// import { EntryText } from '../../components/Entry/EntryText/EntryText'
// import EntryDropdown from '../../components/Entry/EntryDropdown/EntryDropdown'
// import debounce from 'lodash.debounce';

// type Textbox = {
//     text: string;
//     xvalue: string;
//     yvalue: string;
//     fontsize: string;
//     color: string;
//     width: string;
//     height: string;
// };


// export const Editor = () => {
//     const [allTemplates, setAllTemplates] = useState<Template[]>([])
//     const [sideBarClosed, setSideBarClosed] = useState<boolean>(true)
//     const canvasRef = useRef<HTMLCanvasElement>(null)
//     const [template, setTemplate] = useState<Template | null>(null)
//     const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
//     const [dropdownValue, setDropdownValue] = useState<string>('')
//     const [inputValues, setInputValues] = useState<{ [key: string]: string }>({
//         text: '',
//         xvalue: '',
//         yvalue: '',
//         fontsize: '',
//         color: '',
//         width: '100',
//         height: '50',
//     })
//     const [isDragging, setIsDragging] = useState(false);
//     const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

//     const fontOptions = [
//         { display: "Arial", value: "arial" },
//         { display: "Impact", value: "impact" },
//     ]
//     const [textboxes, setTextboxes] = useState<Textbox[]>([{
//         text: '',
//         xvalue: '',
//         yvalue: '',
//         fontsize: '',
//         color: '',
//         width: '100',
//         height: '50',
//     }])


//     const location = useLocation()
//     const selectedTemplate = location.state

//     const defaultComment = {
//         id: '',
//         owner: {
//             id: '',
//             username: ''
//         },
//         postedDate: '',
//         text: ''
//     };
//     useEffect(() => {
//         if (selectedTemplate && selectedTemplate.template) {
//             console.log(selectedTemplate.template)
//             setTemplate(selectedTemplate.template)
//         } else {
//             console.log('No template selected')
//         }
//     }, [location])

//     const templatesToState = async () => {
//         const { ok, message, templates } = await getTemplatesBackend()
//         if (ok && templates) {
//             setAllTemplates(templates)
//         } else {
//             console.log(message)
//         }
//     }

//     useMemo(() => {
//         templatesToState()
//     }, [])

//     const addTextToCanvas = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, size: number, color: string, dragPosition = { x: 0, y: 0 }) => {
//         ctx.font = `${size}px ${font}`
//         ctx.fillStyle = color
//         ctx.fillText(text, x, y)
//     }

//     const [textboxPosition, setTextboxPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const context = canvas.getContext('2d');
//             canvas.width = 500;
//             canvas.height = 400;
//             if (context) {
//                 ctxRef.current = context;
//                 if (template && template.imageLocation) {
//                     const img = new Image();
//                     img.src = `${templateURL}/${template.imageLocation}`;
//                     img.onload = () => {
//                         context.drawImage(img, 0, 0, canvas.width, canvas.height);
//                         if (inputValues.text) {
//                             addTextToCanvas(context, inputValues.text, parseInt(inputValues.xvalue), parseInt(inputValues.yvalue), dropdownValue, parseInt(inputValues.fontsize), inputValues.color);
//                         }
//                     };
//                 }
//             }

//             const handleMouseMove = (event: { clientX: number; clientY: number }) => {
//                 if (isDragging && inputValues.text && ctxRef.current && canvas) {
//                     const rect = canvas.getBoundingClientRect();
//                     const x = event.clientX - rect.left;
//                     const y = event.clientY - rect.top;
//                     const dx = x - dragPosition.x;
//                     const dy = y - dragPosition.y;
//                     let newX = parseInt(inputValues.xvalue) + dx;
//                     let newY = parseInt(inputValues.yvalue) + dy;
//                     // Adjust newX and newY to keep the textbox within the bounds of the canvas
//                     if (newX < 0) newX = 0;
//                     if (newY < 0) newY = 0;
//                     if (newX + parseInt(inputValues.width) > canvas.width) newX = canvas.width - parseInt(inputValues.width);
//                     if (newY + parseInt(inputValues.height) > canvas.height) newY = canvas.height - parseInt(inputValues.height);
//                     setInputValues({
//                         ...inputValues,
//                         xvalue: newX.toString(),
//                         yvalue: newY.toString(),
//                     });
//                     setDragPosition({ x, y });
//                 }
//             };

//             const handleMouseUp = () => {
//                 setIsDragging(false);
//             };

//             canvas.addEventListener('mousedown', (event) => {
//                 setIsDragging(true);
//                 setDragPosition({
//                     x: event.clientX - canvas.offsetLeft,
//                     y: event.clientY - canvas.offsetTop,
//                 });
//             });

//             window.addEventListener('mousemove', handleMouseMove);
//             window.addEventListener('mouseup', handleMouseUp);

//             return () => {
//                 window.removeEventListener('mousemove', handleMouseMove);
//                 window.removeEventListener('mouseup', handleMouseUp);
//             };
//         }
//     }, [template, inputValues, dropdownValue, isDragging, dragPosition]);


//     ``



//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target
//         setInputValues({ ...inputValues, [name]: value })
//     }

//     const handleDropdownChange = (value: string) => {
//         setDropdownValue(value)
//     }

//     const handleSaveClick = () => {
//         if (canvasRef.current) {
//             const canvas = canvasRef.current
//             const dataURL = canvas.toDataURL()
//             const meme: Meme = {
//                 templateId: template?._id || '',
//                 image: Buffer.from(dataURL, 'base64'),
//                 _id: '',
//                 givenName: '',
//                 description: '',
//                 owner: {
//                     id: '',
//                     username: ''
//                 },
//                 imageLocation: '',
//                 uploadDate: '',
//                 private: false,
//                 draft: false,
//                 likes: [],
//                 comments: [defaultComment]
//             };
//             const memeData = JSON.stringify(meme)
//             const buffer = Buffer.from(memeData, 'utf-8')

//             const navigate = useNavigate()
//             navigate('/save', { state: { buffer } })
//         }
//     }

//     return (
//         <div className="editor-container">
//             <div className={sideBarClosed ? "sidebar-closed" : "sidebar-open"}>
//                 <button onClick={() => setSideBarClosed(!sideBarClosed)}>
//                     <Icon name={sideBarClosed ? "chevron-right" : "chevron-left"} />
//                 </button>

//                 <h2>Add Text</h2>
//                 <EntryText id="text" type="text" name="text" label="Text" value={inputValues.text} onChange={handleInputChange} />
//                 <EntryText id="xvalue" name="xvalue" label="X Value" value={inputValues.xvalue} onChange={handleInputChange} type="number" />
//                 <EntryText id="yvalue" name="yvalue" label="Y Value" value={inputValues.yvalue} onChange={handleInputChange} type="number" />
//                 <EntryText id="fontsize" name="fontsize" label="Font Size" value={inputValues.fontsize} onChange={handleInputChange} type="number" />
//                 <EntryText id="color" name="color" label="Color" value={inputValues.color} onChange={handleInputChange} type="color" />
//                 <EntryDropdown
//                     options={fontOptions}
//                     label="Font"
//                     selected={dropdownValue}
//                     objectKey="fontFamily"
//                     setSelected={(optionName, optionValue) => handleDropdownChange(optionValue)} id={''} />

//                 <button className="save-button" onClick={handleSaveClick}>Save Meme</button>
//             </div>
//             <div className="canvas-container">
//                 <canvas ref={canvasRef} />
//             </div>
//         </div>
//     )

// }

// export default Editor;

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

export const Editor = () => {
    const [allTemplates, setAllTemplates] = useState<Template[]>([])
    const [sideBarClosed, setSideBarClosed] = useState<boolean>(true)
    const canvasRef = useRef<HTMLCanvasElement>(null)
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
                <div ref={generatedMemeRef} className="Canvas" style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}>
                    <Draggable>
                        <canvas ref={canvasRef} />
                    </Draggable>
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
                <button className="icon" type='button' onClick={() => setSideBarClosed(!sideBarClosed)}>
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
                            }}
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