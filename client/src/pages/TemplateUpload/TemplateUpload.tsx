import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
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
        e.preventDefault();
        if (!e.target.files) return;

        const files = e.target.files;

        const promises = Array.from(files).map((file) => {
            return new Promise<MemeTemplate>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve({
                file,
                src: reader.result as string,
                alt: file.name,
                ImagePreviewUrl: reader.result as string,
                templateName: "",
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then((templates) => {
            setTemplates((prev) => [...prev, ...templates]);
        });
        };


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
        e.preventDefault();
        const formData = new FormData();
        templates.forEach((template) => {
            formData.append("template", template.file);
            if (template.templateName !== undefined) {
                formData.append("name", template.templateName);
            }
        });

        try {
            const response = await fetch("http://localhost:3001/api/templates", {
            method: "POST",
            body: formData,
            });

            if (response.ok) {
            navigate("/templates");
            }
        } catch (error) {
            console.error(error);
        }
        };

        //new
         const handleUrlUpload = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const url = (e.currentTarget.elements as HTMLFormControlsCollection & { url: { value: string } }).url.value
            try {
            const response = await fetch(url)
            const blob = await response.blob()
            const file = new File([blob], 'filename', { type: 'image/jpeg' })
            const reader = new FileReader()
            reader.onloadend = () => {
                const template: MemeTemplate = {
                file,
                src: reader.result as string,
                alt: 'template',
                ImagePreviewUrl: reader.result as string,
                templateName: '',
                }
                setTemplates([...templates, template])
            }
            reader.readAsDataURL(file)
            } catch (error) {
            console.error(error)
            }
        }

        const handleScreenshotUpload = async () => {
            try {
                const mediaDevices = navigator.mediaDevices as any
                const stream = await mediaDevices.getDisplayMedia({ video: true })
                const track = stream.getVideoTracks()[0]
                const imageCapture = new (window as any).ImageCapture(track);

                const blob = await imageCapture.takePhoto()
                const file = new File([blob], 'screenshot.png', { type: 'image/png' })
                const reader = new FileReader()

                reader.onload = () => {
                const newTemplate = {
                    file,
                    src: reader.result as string,
                    alt: file.name,
                    ImagePreviewUrl: reader.result as string,
                    templateName: '',
                }
                setTemplates((prev) => [...prev, newTemplate])
                }

                reader.readAsDataURL(blob)
            } catch (error) {
                console.error(error)
            }
            }

        const handleCameraUpload = async () => {
        try {
            const mediaDevices = navigator.mediaDevices as any
            const stream = await mediaDevices.getUserMedia({ video: true })
            const track = stream.getVideoTracks()[0]
            const imageCapture = new (window as any).ImageCapture(track);

            const blob = await imageCapture.takePhoto()
            const file = new File([blob], 'photo.png', { type: 'image/png' })
            const reader = new FileReader()

            reader.onload = () => {
            const newTemplate = {
                file,
                src: reader.result as string,
                alt: file.name,
                ImagePreviewUrl: reader.result as string,
                templateName: '',
            }
            setTemplates((prev) => [...prev, newTemplate])
            }

            reader.readAsDataURL(blob)
        } catch (error) {
            console.error(error)
        }
        }




    return (
        <div className="TemplateUpload">
            <h1>Upload Template</h1>
            <Container
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
