import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { EntryText } from '../../../components/Entry/EntryText/EntryText'
import './ScreenshotUpload.scss'
import { ImageCapture } from 'image-capture'

export const ScreenshotUpload = () => {
  const [src, setSrc] = useState<string>('')
  const [templateName, setTemplateName] = useState<string>('')
  const navigate = useNavigate()

  const takeScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      })
      const track = stream.getVideoTracks()[0]
      const imageCapture = new ImageCapture(track)
      const bitmap = await imageCapture.grabFrame()
      const canvas = document.createElement('canvas')
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(bitmap, 0, 0)
      const dataUrl = canvas.toDataURL('image/png')
      setSrc(dataUrl)
      track.stop()
    } catch (error) {
      console.error(error)
    }
  }

  const handleTemplateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateName(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    const file = dataURLtoFile(src, 'screenshot.png')
    formData.append('template', file)
    if (templateName !== '') {
      formData.append('name', templateName)
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

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)![1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  return (
    <div className="ScreenshotUpload">
      <h1>Upload Template From Screenshot</h1>
      <Form onSubmit={handleSubmit}>
        <div className="previewZone">
          {src !== '' && (
            <div className="memePreview">
              <img src={src} alt="screenshot" style={{ width: '100px', height: '100px' }} />
              <EntryText
                id="templateName"
                name="templateName"
                type="text"
                label={'Template Name'}
                value={templateName}
                onChange={handleTemplateNameChange}
              />
            </div>
          )}
        </div>
        <Button variant="primary" onClick={takeScreenshot}>
          Take Screenshot
        </Button>
        <Button type="submit" variant="success" disabled={src === ''}>
          Upload Template
        </Button>
      </Form>
    </div>
  )
}

export default ScreenshotUpload
