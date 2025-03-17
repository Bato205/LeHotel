import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAudio } from "../contexts/AudioContext"

interface BackgroundMediaProps {
  imageUrl: string
  videoUrl: string | null
  onVideoEnd: () => void
  isFeedVisible: boolean
  isLandingPage: boolean
}

const BackgroundMedia: React.FC<BackgroundMediaProps> = ({ imageUrl, videoUrl, onVideoEnd, isLandingPage }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const { isMuted } = useAudio()

  useEffect(() => {
    if (videoUrl && videoRef.current && isLandingPage) {
      console.log("Setting up video:", videoUrl)
      videoRef.current.src = videoUrl
      videoRef.current.load()
      const playAttempt = videoRef.current
        .play()
        .then(() => {
          console.log("Video started playing successfully")
          setIsVideoPlaying(true)
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("Play attempt was aborted, trying again...")
            return videoRef.current.play()
          }
          console.error("Error playing video:", error.message)
          setIsVideoPlaying(false)
        })

      return () => {
        if (playAttempt && typeof playAttempt.abort === "function") {
          playAttempt.abort()
        }
      }
    } else if (!isLandingPage) {
      setIsVideoPlaying(false)
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [videoUrl, isLandingPage])

  const handleVideoEnd = () => {
    console.log("Video ended naturally")
    setIsVideoPlaying(false)
    onVideoEnd()
  }

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/increased%20exposure-8J6pPZNPl6yaftB4PeOSLWmH6LbJdE.png)`,
          zIndex: -1,
        }}
      />
      <AnimatePresence>
        {videoUrl && (
          <motion.video
            ref={videoRef}
            className="fixed top-0 left-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            onEnded={handleVideoEnd}
            onError={(e) => {
              console.error("Video error:", e)
              if (e.target instanceof HTMLVideoElement) {
                console.error("Error code:", e.target.error?.code)
                console.error("Error message:", e.target.error?.message)
              }
            }}
            autoPlay
            playsInline
            muted={isMuted}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>
        )}
      </AnimatePresence>
    </>
  )
}

export default BackgroundMedia

