import { useEffect, useState, useMemo, useRef } from 'react'
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

export const Editor = () => {
    const [allTemplates, setAllTemplates] = useState<Template[]>([])
    const [sideBarClosed, setSideBarClosed] = useState<boolean>(true)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [template, setTemplate] = useState<Template | null>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    const [dropdownValue, setDropdownValue] = useState<string>('')

    const fontOptions = [
        { display: "Arial", value: "arial" },
        { display: "Impact", value: "impact" },
    ]

    const location = useLocation()
    const selectedTemplate = location.state

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
            canvas.width = 500;
            canvas.height = 400;
            if (context) {
                ctxRef.current = context;
                if (template && template.imageLocation) {
                    const img = new Image();
                    img.src = `${templateURL}/${template.imageLocation}`;
                    console.log(img.src)
                    img.onload = () => {
                        console.log(img)
                        context.drawImage(img, 0, 0, canvas.width, canvas.height)
                    }
                }
            }
        }
    }, [template, canvasRef]);

    return (
        <div className="Editor">
            <div className="Canvas-Area">
                <div className="Canvas"><canvas ref={canvasRef} /></div>
                <div className="Canvas-Controls">
                    <div className="Labels">
                        <EntryText id='text' label='Text' type='text' name='text' />
                        <EntryText id='xvalue' label='X Position' type='number' name='xvalue' />
                        <EntryText id='yvalue' label='Y position' type='number' name='yvalue' />
                    </div>
                    <div className="Font">
                        <EntryDropdown id="font_picker" label="Font" objectKey='fontName' options={fontOptions} selected={dropdownValue} setSelected={setDropdownValue} />
                        <EntryText id='fontsize' label='Font Size' type='number' name='fontsize' />
                        <EntryText id='color' label='Font Color' type='text' name='color' />
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
