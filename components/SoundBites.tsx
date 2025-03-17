import { useEffect } from "react"
import { useAudio } from "../contexts/AudioContext"

interface SoundBitesProps {
  isVideoPlaying: boolean
}

const soundBites = [
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/ElevenLabs_2025-02-04T10_04_07_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2-iubFCuGivSstc7WNQNBa9enZtlFPBe.mp3",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/ElevenLabs_2025-02-04T10_03_46_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2-qjKtKiYDIhq23vBURme0Haqyli9do1.mp3",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/ElevenLabs_2025-02-04T10_02_26_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2-muAI71W3txRwkkOg5yIArcEYoXkDK8.mp3",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/ElevenLabs_2025-02-04T10_01_59_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2-mO5RVH2sdPG5Nt42kaPHdL80AKznuw.mp3",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/ElevenLabs_2025-02-04T10_01_03_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2-ycV3S4etgVmeQ9pnbc32Yuxps0ilVg.mp3",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/ElevenLabs_2025-02-04T10_00_36_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2-77gXhkw50Pewh9POhz8xY7ucnpfNVE.mp3",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/ElevenLabs_2025-02-04T10_00_13_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2-YJevg8dxhgCI25h2JuqzrgTxiMgrO0.mp3",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/ElevenLabs_2025-02-04T09_59_51_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2-oBxX1kIRgPsx0gzJRXvQI1zs7Twm6z.mp3",
]

const SoundBites: React.FC<SoundBitesProps> = ({ isVideoPlaying }) => {
  const { isMuted } = useAudio()

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    let currentAudio: HTMLAudioElement | null = null

    const playRandomSoundBite = () => {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }
      if (!isVideoPlaying && !isMuted) {
        const randomIndex = Math.floor(Math.random() * soundBites.length)
        currentAudio = new Audio(soundBites[randomIndex])
        currentAudio.play()
      }
    }

    const startInterval = () => {
      if (intervalId) clearInterval(intervalId)
      intervalId = setInterval(playRandomSoundBite, 30000 + Math.random() * 30000)
    }

    startInterval()

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }
    }
  }, [isVideoPlaying, isMuted])

  return null // This component doesn't render anything visually
}

export default SoundBites

