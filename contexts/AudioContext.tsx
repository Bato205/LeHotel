import type React from "react"
import { createContext, useState, useContext } from "react"

interface AudioContextType {
  isMuted: boolean
  toggleMute: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false)

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  return <AudioContext.Provider value={{ isMuted, toggleMute }}>{children}</AudioContext.Provider>
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

