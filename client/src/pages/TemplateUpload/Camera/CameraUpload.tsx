import { useState, useRef, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { EntryText } from '../../../components/Entry/EntryText/EntryText'
import './CameraUpload.scss'

export type MemeTemplate = {
  id?: string
  file: File
  src: string
  alt: string
  ImagePreviewUrl?: string
  templateName?: string
}


export const CameraTemplateUpload = () => {
  const [templates, setTemplates] = useState<MemeTemplate[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Request camera access
    const constraints = { video: true }
    const delay = 500;
    const timeoutId = setTimeout(() => {
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          const video = videoRef.current
          if (video) {
            video.srcObject = stream
            video.play()
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }, delay);

    // Clear the timeout on unmount to prevent memory leaks
    return () => clearTimeout(timeoutId);
  }, [])

  const handleCameraActivation = () => {
    setCameraActive(true)

    // Wait for a brief delay before attempting to activate the camera again
    setTimeout(() => {
      const constraints = { video: true }
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          const video = videoRef.current
          if (video) {
            video.srcObject = stream
            video.play()
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }, 500) // Change this delay to a value that works well for your use case
  }


  const handleCameraDeactivation = () => {
    setCameraActive(false)
    const video = videoRef.current
    if (video) {
      const stream = video.srcObject as MediaStream
      if (stream) {
        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())
      }
      video.srcObject = null
    }
  }

  const handleCaptureImage = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (video && canvas) {
      // Set canvas size to match the video feed size
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current frame from the video feed onto the canvas
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert the canvas image to a File object and add it to the templates array
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'template.png')
            const newTemplate: MemeTemplate = {
              file,
              src: URL.createObjectURL(file),
              alt: 'Template Preview',
              ImagePreviewUrl: URL.createObjectURL(file),
              templateName: '',
            }
            setTemplates([...templates, newTemplate])
          }
        }, 'image/png')
      }
    }
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
    <>
      <h1>Camera Template Upload</h1>
      <p>Take a photo to create a new template.</p>
      {cameraActive ? (
        <>
          <div>
            <video ref={videoRef} />
            <button onClick={handleCaptureImage}>Capture</button>
            <button onClick={handleCameraDeactivation}>Close Camera</button>
          </div>
          <div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </>
      ) : (
        <button onClick={handleCameraActivation}>Activate Camera</button>
      )}
      {templates.length > 0 && (
        <form onSubmit={handleSubmit}>
          {templates.map((template, index) => (
            <div key={index}>
              <img src={template.src} alt={template.alt} />
              <label>
                Template Name:
                <input
                  type="text"
                  value={template.templateName}
                  onChange={(e) => handleTemplateNameChange(e, index)}
                />
              </label>
            </div>
          ))}
          <button type="submit">Submit Templates</button>
        </form>
      )}
    </>
  )
}