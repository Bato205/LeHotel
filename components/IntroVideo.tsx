import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface IntroVideoProps {
  onComplete: () => void
}

const IntroVideo: React.FC<IntroVideoProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isVideoEnded, setIsVideoEnded] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      console.log("Video element created")

      const playVideo = () => {
        console.log("Attempting to play video")
        video
          .play()
          .then(() => {
            console.log("Video started playing successfully")
            console.log("Video muted:", video.muted)
            console.log("Video volume:", video.volume)
            setIsPlaying(true)
          })
          .catch((error) => {
            console.error("Error playing video:", error)
            console.log("Autoplay prevented. Error name:", error.name)
            console.log("Autoplay prevented. Error message:", error.message)
            setIsVideoError(true)
          })
      }

      video.addEventListener("loadedmetadata", () => {
        console.log("Video metadata loaded")
        console.log("Video duration:", video.duration)
        console.log("Video size:", video.videoWidth, "x", video.videoHeight)
      })

      video.addEventListener("canplay", () => {
        console.log("Video can start playing")
      })

      video.addEventListener("playing", () => {
        console.log("Video is now playing")
      })

      video.addEventListener("pause", () => {
        console.log("Video paused")
      })

      video.addEventListener("ended", () => {
        console.log("Video playback ended")
        setIsVideoEnded(true)
      })

      video.addEventListener("error", (e) => {
        console.error("Video error event:", e)
        if (video.error) {
          console.error("Video error code:", video.error.code)
          console.error("Video error message:", video.error.message)
        }
        setIsVideoError(true)
      })

      return () => {
        video.removeEventListener("ended", () => setIsVideoEnded(true))
        video.removeEventListener("error", (e) => {
          console.error("Video error:", e)
          setIsVideoError(true)
        })
      }
    }
  }, [])

  useEffect(() => {
    if (isVideoEnded || isVideoError) {
      onComplete()
    }
  }, [isVideoEnded, isVideoError, onComplete])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.currentTime = 0.001
    }
  }, [])

  const handlePlayClick = () => {
    if (videoRef.current && audioRef.current) {
      Promise.all([videoRef.current.play(), audioRef.current.play()])
        .then(() => {
          setIsPlaying(true)
        })
        .catch((error) => {
          console.error("Error playing video or audio:", error)
          setIsVideoError(true)
        })
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {!isVideoError ? (
            <>
              <video
                ref={videoRef}
                src="https://8qmlf3ahivlltjw6.public.blob.vercel-storage.com/MAIN%20INTRO%20VIDEO-uktZhhQTs2Ch4RZTJ2MIE4C9Vs54Mn.mp4"
                className="w-full h-full object-cover bg-black"
                playsInline
                preload="auto"
                poster="https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/NV3-Qp9pjHg1aIarkcYiRhyMqOeNNI3ViN.mp4#t=0.001"
                onLoadStart={() => console.log("Video load started")}
                onLoadedData={() => console.log("Video data loaded")}
              />
              {!isPlaying && (
                <motion.button
                  onClick={handlePlayClick}
                  className="absolute bottom-1/3 x-1/2 transform -translate-x-1/2 -translate-y-[100px] bg-white/20 hover:bg-white/30 text-white p-4 rounded-full text-lg font-semibold transition-colors duration-200 flex items-center justify-center size-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    boxShadow: ["0 0 0 0 rgba(255, 255, 255, 0.7)", "0 0 0 10px rgba(255, 255, 255, 0)"],
                  }}
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: [-5, 5, -5, 5, 0] }}
                    transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2.5 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                      />
                    </svg>
                  </motion.div>
                </motion.button>
              )}
              <audio
                ref={audioRef}
                src="https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/BellDesk%206044_64_1-WmEtKKUZB2xnB4uv2oMB9DPhvuIP2N.wav"
              />
            </>
          ) : (
            <div className="text-white text-center">
              <p>Sorry, there was an error playing the video.</p>
              <p>Please try refreshing the page.</p>
            </div>
          )}
          <motion.p
            className="absolute top-8 x-1/2 transform -translate-x-1/2 text-white text-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Made for desktop, enjoyed with headphones.
          </motion.p>
          <motion.img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/presented%20by@4x-8-ZAAk7au7BLRpqPdHzS9OL4KUc464d4.png"
            alt="Presented by Dream Hotels & Resorts"
            className="absolute bottom-8 x-1/2 w-auto h-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{
              transform: "translateX(-50%)",
              margin: "0 auto",
            }}
          />
          <motion.button
            onClick={onComplete}
            className="absolute top-4 right-4 text-white px-4 py-2 rounded-md transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip
          </motion.button>
        </motion.div>
      </AnimatePresence>
      <style jsx global>{`
        body {
          background-color: black;
        }
      `}</style>
    </>
  )
}

export default IntroVideo

