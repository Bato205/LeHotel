import type React from "react"
import { useEffect, useRef } from "react"

interface VideoBackgroundProps {
  videoUrl: string
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
      })
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className="fixed top-0 left-0 min-w-full min-h-full w-auto h-auto z-[-1] object-cover"
      src={videoUrl}
      autoPlay
      loop
      muted
      playsInline
    />
  )
}

export default VideoBackground

