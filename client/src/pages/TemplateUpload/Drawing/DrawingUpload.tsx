import { useState, useRef, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { EntryText } from '../../../components/Entry/EntryText/EntryText'
import { uploadTemplateBackend } from '../../../services/templateService'
import { ErrorType } from '../Main/Main'

import './DrawingUpload.scss'

export type DrawingTemplate = {
    id?: string
    file: File
    src: string
    alt: string
    ImagePreviewUrl?: string
    templateName?: string
}

export const DrawingTemplateUpload = ({
    setError
}: { setError: React.Dispatch<React.SetStateAction<ErrorType>> }) => {
    const [templates, setTemplates] = useState<DrawingTemplate[]>([])
    const [isDrawing, setIsDrawing] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                ctxRef.current = context;
            }
        }
    }, []);

    const startDrawing = (event?: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true)
        console.log("start Drawing")
    }

    const endDrawing = (event?: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(false)
        console.log("end Drawing")
    }


    const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
        console.log("drawing")
        if (!isDrawing || !ctxRef.current || !canvasRef.current) {
            return
        }
        const canvas = canvasRef.current
        const context = ctxRef.current
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        context.beginPath()
        context.strokeStyle = 'black'
        context.lineWidth = 5
        context.lineCap = 'round'
        context.lineTo(x, y)
        context.stroke()
    }

    const handleSaveTemplateClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()

        if (!canvasRef.current) {
            return
        }
        const canvas = canvasRef.current

        const dataURL = canvas.toDataURL('image/png')
        const blobBin = atob(dataURL.split(',')[1])
        const array = []
        for (let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i))
        }
        // const file = new Blob([new Uint8Array(array)], { type: 'image/png' })
        const file = new File([new Uint8Array(array)], 'user-drawing.png', { type: 'image/png', lastModified: Date.now() })
        setTemplates((prev) => [
            ...prev,
            {
                file,
                src: dataURL,
                alt: 'User Drawing',
                ImagePreviewUrl: dataURL,
                templateName: '',
            },
        ])
    }

    const handleTemplateNameChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const target = e.target
        const value = target.value

        const newTemplates = [...templates]
        newTemplates[index].templateName = value
        setTemplates(newTemplates)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData()
        templates.forEach((template) => {
            formData.append('template', template.file)
            if (template.templateName !== undefined) {
                formData.append('name', template.templateName)
            }
        })

        try {
            const { ok, message } = await uploadTemplateBackend(formData)

            if (ok) {
                navigate('/templates')
            } else {
                setError({ message, show: true })
            }
        } catch (error) {
            if (error instanceof Error) {
                setError({ message: error.message, show: true })
            } else {
                setError({ message: 'Something went wrong', show: true })
            }
        }

    }

    return (
        <div className="FileTemplateUpload">
            <h1>Draw a Template</h1>
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                onMouseDown={(e) => startDrawing(e)}
                onMouseUp={(e) => endDrawing(e)}
                onMouseMove={(e) => draw(e)}
            />
            <Form onSubmit={handleSubmit}>
                <div className="FileUpload__inputContainer">
                    <Button variant="secondary" className="FileUpload__btn" onClick={handleSaveTemplateClick}>
                        Save Template
                    </Button>
                </div>
                {templates.map((template, index) => (
                    <div key={index} className="FileUpload__template">
                        <EntryText
                            id='template-name'
                            label="Template Name"
                            name={`template-name-${index}`}
                            value={template.templateName ?? ''}
                            onChange={(e) => handleTemplateNameChange(e, index)}
                            placeholder="Enter template name"
                            type="text"
                        />
                        <img src={template.src} alt={template.alt} className="FileUpload__templateImg" />
                    </div>
                ))}
                <Button variant="primary" type="submit">
                    Upload
                </Button>
            </Form>
        </div>
    )
}

export default DrawingTemplateUpload;
