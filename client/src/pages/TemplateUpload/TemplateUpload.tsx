import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { EntryText } from '../../components/Entry/EntryText/EntryText'

import './templateUpload.scss'

export type MemeTemplate = {
    id?: string
    file: File
    src: string
    alt: string
    ImagePreviewUrl?: string
    templateName?: string
}

export const TemplateUpload = () => {
    const [templates, setTemplates] = useState<MemeTemplate[]>([])

    const navigate = useNavigate()

    const MemeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (!e.target.files) return
        const files = e.target.files
        Array.from(files).forEach((file) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setTemplates((prev) => [
                    ...prev,
                    {
                        file: file,
                        src: reader.result as string,
                        alt: file.name,
                        ImagePreviewUrl: reader.result as string,
                    },
                ])
            }
            reader.readAsDataURL(file)
        })
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
            formData.append('file', template.file)
        })

        const response = await fetch('/api/templates/upload', {
            method: 'POST',
            body: formData,
        })
        if (response.ok) {
            navigate('/templates')
        }
    }

    return (
        <div className="TemplateUpload">
            <h1>Upload Template</h1>
            <Form onSubmit={handleSubmit}>
                <div className="previewZone">
                    {templates.map((template, index) => (
                        <div className="memePreview" key={template.src}>
                            <img
                                src={template.src}
                                alt={template.alt}
                                style={{ width: '100px', height: '100px' }}
                            />
                            <EntryText
                                id="templateName"
                                name="templateName"
                                type="text"
                                label={'Template Name'}
                                value={template.templateName}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => handleTemplateNameChange(e, index)}
                            />
                        </div>
                    ))}
                </div>

                <Form.Group>
                    <Form.Label>Template</Form.Label>
                    <Form.Control type="file" onChange={MemeUpload} multiple />
                </Form.Group>
                <Button type="submit" variant="primary">
                    Upload
                </Button>
            </Form>
        </div>
    )
}
