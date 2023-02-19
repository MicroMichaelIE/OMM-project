import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { EntryText } from '../../../components/Entry/EntryText/EntryText'

import './URLUpload.scss'

export type MemeTemplate = {
  id?: string
  file?: File
  src: string
  alt: string
  ImagePreviewUrl?: string
  templateName?: string
}

export const URLUpload = () => {
  const [template, setTemplate] = useState<MemeTemplate>({
    src: '',
    alt: '',
    ImagePreviewUrl: '',
    templateName: '',
  })

  const navigate = useNavigate()

  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setTemplate((prev) => ({
      ...prev,
      src: url,
      alt: url,
      ImagePreviewUrl: url,
    }))
  }

  const handleTemplateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const value = target.value

    setTemplate((prev) => ({
      ...prev,
      templateName: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (template.src === '') {
      return
    }

    const formData = new FormData()
    const blob = await fetch(template.src).then((r) => r.blob())
    formData.append('template', blob)
    if (template.templateName !== undefined) {
      formData.append('name', template.templateName)
    }

    try {
      const response = await fetch('http://localhost:3001/api/templates', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        navigate('/templates')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="URLTemplateUpload">
      <h1>Upload Template From URL</h1>
      <Form onSubmit={handleSubmit}>
        <div className="previewZone">
          <div className="memePreview">
            <img
              src={template.ImagePreviewUrl}
              alt={template.alt}
              style={{ width: '100px', height: '100px' }}
            />
            <EntryText
              id="templateName"
              name="templateName"
              type="text"
              label={'Template Name'}
              value={template.templateName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleTemplateNameChange(e)
              }
            />
          </div>
        </div>

        <Form.Group>
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter image URL"
            onChange={handleURLChange}
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Upload
        </Button>
      </Form>
    </div>
  )
}
