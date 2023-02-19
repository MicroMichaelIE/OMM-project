import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { EntryText } from '../../components/Entry/EntryText/EntryText'
import { uploadTemplateBackend } from '../../services/templateService'
import useAuth from '../../hooks/useAuth'

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
    const { userToken } = useAuth()

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
            console.log(template)
            formData.append('files', template.file, template.alt)
        })

        for (let [key, value] of formData.entries()) {
            console.log(key, value)
        }
        console.log('here')
        const { ok, message } = await uploadTemplateBackend(
            formData,
            userToken!
        )
        if (ok) {
            console.log(ok)
        } else {
            console.log(message)
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
