import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { EntryText } from '../../../components/Entry/EntryText/EntryText'
import { uploadTemplateBackend } from '../../../services/templateService'
//import 'dom-mediacapture-record';
import { ErrorType } from '../Main/Main'

import './FileUpload.scss'


export type MemeTemplate = {
    id?: string
    file: File
    src: string
    alt: string
    ImagePreviewUrl?: string
    templateName?: string
}

export const FileTemplateUpload = ({
    setError
}: { setError: React.Dispatch<React.SetStateAction<ErrorType>> }) => {
    const [templates, setTemplates] = useState<MemeTemplate[]>([])

    const navigate = useNavigate()

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
                formData.append("givenName", template.templateName);
            }
        });

        try {
            const { ok, message } = await uploadTemplateBackend(formData);


            console.log(ok)

            if (ok) {
                navigate("/templates");
            } else {
                setError({
                    message: message,
                    show: true,
                });
            };
        } catch (error) {
            if (error instanceof Error) {
                setError({
                    message: error.message,
                    show: true,
                });
            } else {
                setError({
                    message: "Something went wrong",
                    show: true,
                });
            }
        }
    }

    return (
        <div className="FileTemplateUpload">
            <h1>Upload Template From File</h1>
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
