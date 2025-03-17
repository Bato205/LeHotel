import { useRef, useEffect, useState } from "react"
import { useAudio } from "../contexts/AudioContext"
import type React from "react"

interface AudioPlayerProps {
  url: string
  initiallyPlaying?: boolean
  "data-background-music"?: string
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  url,
  initiallyPlaying = true,
  "data-background-music": isBackgroundMusic,
}) => {
  const { isMuted, toggleMute } = useAudio()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [autoplayPrevented, setAutoplayPrevented] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
    // Mute or unmute all video elements
    document.querySelectorAll("video").forEach((video) => {
      video.muted = isMuted
    })
  }, [isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
      toggleMute()
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      if (initiallyPlaying && !isMuted) {
        audio.play().catch((error) => {
          console.warn("Audio autoplay was prevented. User interaction may be required.", error)
          setAutoplayPrevented(true)
        })
      }
      audio.volume = 0.2 // Set a default volume
      audio.loop = true // Ensure the audio loops
    }
  }, [initiallyPlaying, isMuted])

  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current
      if (audio) {
        if (document.hidden || isMuted) {
          audio.pause()
        } else {
          audio.play().catch(console.error)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isMuted])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      if (isMuted) {
        audio.pause()
      } else {
        audio.play().catch(console.error)
      }
    }
  }, [isMuted])

  const handleManualPlay = () => {
    const audio = audioRef.current
    if (audio) {
      audio
        .play()
        .then(() => {
          setAutoplayPrevented(false)
        })
        .catch(console.error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {autoplayPrevented ? (
        <button
          onClick={handleManualPlay}
          className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="Play background music"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
            />
          </svg>
        </button>
      ) : (
        <button
          onClick={togglePlay}
          className="p-2 text-white focus:outline-none cursor-pointer"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {!isMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          )}
        </button>
      )}
      <audio ref={audioRef} src={url} loop data-background-music={isBackgroundMusic} />
    </div>
  )
}

export default AudioPlayer

