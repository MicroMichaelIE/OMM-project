import { useEffect, useState } from 'react'
import { Meme } from '../../types/types'

export const Editor = () => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

    const [templates, setTemplates] = useState<[]>([])

    useEffect(() => {
        const context = canvas?.getContext('2d')
        if (context) {
            templates.forEach((template: File) => {
                const image = new Image()
                image.src = URL.createObjectURL(template)
                image.onload = () => {
                    context.drawImage(image, 0, 0)
                }
            })
        }
    }, [canvas])

    return (
        <div className="Editor">
            <h1>Editor</h1>
            <div className="Canvas Area">
                <div className="Canvas">
                    <canvas ref={setCanvas} />
                </div>
            </div>
            <div className="Template Area">
                <div className="Templates">TEMPLATE GOES HERE</div>
            </div>
        </div>
    )
}
