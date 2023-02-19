// import { useEffect, useState } from 'react'
// import { Meme } from '../../types/types'

// export const Editor = () => {
//     const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

//     const [templates, setTemplates] = useState<[]>([])

//     useEffect(() => {
//         const context = canvas?.getContext('2d')
//         if (context) {
//             templates.forEach((template: File) => {
//                 const image = new Image()
//                 image.src = URL.createObjectURL(template)
//                 image.onload = () => {
//                     context.drawImage(image, 0, 0)
//                 }
//             })
//         }
//     }, [canvas])

//     return (
//         <div className="Editor">
//             <h1>Editor</h1>
//             <div className="Canvas Area">
//                 <div className="Canvas">
//                     <canvas ref={setCanvas} />
//                 </div>
//             </div>
//             <div className="Template Area">
//                 <div className="Templates">TEMPLATE GOES HERE</div>
//             </div>
//         </div>
//     )
// }

import { useEffect, useState } from 'react'
import { Meme } from '../../types/types'
//import React, { useState } from "react";
//import Template from '../Templates/Templates'
import { Buffer } from 'buffer';
import { useNavigate } from "react-router-dom";
import './Editor.scss'


interface Template {
  id: string;
  name: string;
  data: Buffer;
  type: string;
}



export const Editor = () => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const [template, setTemplate] = useState<Template | null>(null)

    useEffect(() => {
        // Retrieve selected template ID from local storage
        const selectedTemplateId = localStorage.getItem("selectedTemplateId");
        if (selectedTemplateId) {
            // Fetch the corresponding template data
            fetch(`http://localhost:3001/api/templates/${selectedTemplateId}`)
                .then((response) => response.json())
                .then((data) => {
                    setTemplate(data.template);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [])

    useEffect(() => {
        const context = canvas?.getContext('2d')
        if (context && template) {
            const image = new Image()
            image.src = `data:${template.type};base64,${Buffer.from(template.data).toString('base64')}`
            image.onload = () => {
                context.drawImage(image, 0, 0)
            }
        }
    }, [canvas, template])

    return (
        <div className="Editor">
            <h1>Editor</h1>
            <div className="Canvas-Area">
                <div className="Canvas">
                    {/* <canvas ref={setCanvas} /> */}
                </div>
            </div>
            <div className="Template-Area">
                {template && (
                    <div className="Templates">
                        <h2>{template.name} Template</h2>
                        <img src={`data:${template.type};base64,${Buffer.from(template.data).toString('base64')}`} alt={template.name} style={{ maxWidth: 300, maxHeight: 300 }} />
                    </div>
                )}
            </div>
        </div>
    )
}
