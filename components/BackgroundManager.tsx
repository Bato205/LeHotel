import type React from "react"
import { useState, useEffect, useCallback } from "react"
import BackgroundMedia from "./BackgroundMedia"

const videoUrls = [
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T10_00_13_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2_IMAGE-3%20(1)_2025-02-04-QHi8pJcyx3H3ggoK2J66tauK8SFdCy.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T10_01_03_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2_IMAGE-3%20(1)_2025-02-04-om5gIGUjuBMBcBYbqbp63xQSrPw60T.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T10_02_26_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2_IMAGE-3%20(1)_2025-02-04-brAUDic5qz0NKtvPG6l99bYz5bzePw.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T10_03_24_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2_IMAGE-3%20(1)_2025-02-04-9JY8K7ZBRZV3Aa8e1BKAdZVgTfz3Zg.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T10_03_46_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2_IMAGE-3%20(1)_2025-02-04-OlyPJTCVmPBvMLM9VrOBgNTQXsDQZS.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T10_04_07_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2_IMAGE-3%20(1)_2025-02-04-ZOGQd0q6QtNSPQlhmyxxnz32jsSY9j.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T13_50_12_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2_IMAGE-3%20(2)_2025-02-04-yhEzFdhrZFXA5vsVhPLF1AMShtiMQp.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T14_00_23_English%20with%20French%20Accent%20Narration_pvc_s11_sb93_se84_b_m2_IMAGE-3%20(2)_2025-02-04-KZE0xP9BV6VTn8d6VLs0E0JKy0sOIr.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T13_59_22_English%20with%20French%20Accent%20Narration_pvc_s11_sb93_se84_b_m2_IMAGE-3%20(2)_2025-02-04-AK4PiqSfgk0cGSjtSi3BtvAmYAg802.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T13_56_07_English%20with%20French%20Accent%20Narration_pvc_s11_sb93_se84_b_m2_IMAGE-3%20(2)_2025-02-04-pkxSZFWUouHOYl0I3fD9mjBfAmfqhK.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T13_55_42_English%20with%20French%20Accent%20Narration_pvc_s11_sb93_se84_b_m2_IMAGE-3%20(2)_2025-02-04-OnMXEvGgrnxHRhbsyld0nHE1x6V8uc.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T13_55_17_English%20with%20French%20Accent%20Narration_pvc_s11_sb93_se84_b_m2_IMAGE-3%20(2)_2025-02-04-TBSSXjwr8JA0XGX3ieGb1vAQ4CdNFZ.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T13_54_06_English%20with%20French%20Accent%20Narration_pvc_s11_sb93_se84_b_m2_IMAGE-3%20(2)_2025-02-04-PKEkHSdCcQt4Th8DxAUNWnrGt56lyD.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T13_50_12_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2_IMAGE-3%20(2)_2025-02-04-yhEzFdhrZFXA5vsVhPLF1AMShtiMQp.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T10_04_07_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2_IMAGE-3%20(1)_2025-02-04-ZOGQd0q6QtNSPQlhmyxxnz32jsSY9j.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T10_03_46_English%20with%20French%20Accent%20Narration_pvc_s33_sb75_se50_b_m2_IMAGE-3%20(1)_2025-02-04-OlyPJTCVmPBvMLM9VrOBgNTQXsDQZS.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-04T17_28_44_English%20with%20French%20Accent%20Narration_pvc_s11_sb93_se84_b_m2%20(1)_IMAGE-3%20(4)_2025-02-05-It483OgIAYa7mHmi41ZUnnSwjlTOk8.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-05T07_22_25_English%20with%20French%20Accent%20Narration_pvc_s11_sb93_se84_b_m2_IMAGE-3%20(4)_2025-02-05-c9XO0iFcL1zqoBGHWpx2xhdpuSVfYK.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-05T07_24_38_English%20with%20French%20Accent%20Narration_pvc_s11_sb93_se84_b_m2_IMAGE-3%20(4)_2025-02-05-tVnQ1xK5qpYRZKbYZVP5n8MZWvriS0.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-05T07_26_15_English%20with%20French%20Accent%20Narration_pvc_s11_sb93_se84_b_m2_IMAGE-3%20(4)_2025-02-05-LDF7h4DteWpdKTgNtuR6UgAC92gxNa.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-05T13_46_45_English%20with%20French%20Accent%20Narration_pvc_s11_sb93_se84_b_m2_IMAGE-3%20(6)_2025-02-05-RUYK6Dp0ecq7OnDtTzQc4dwYqdTwo3.mp4",
  "https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/Lip%20Sync_ElevenLabs_2025-02-05T13_59_20_English%20with%20French%20Accent%20Narration_pvc_s23_sb93_se60_b_m2_IMAGE-3%20(6)_2025-02-05-1ynV9MrzcKqxEIhqb2hcYcndWj8QUR.mp4",
]

const BackgroundManager: React.FC<{ isFeedVisible: boolean; isLandingPage: boolean }> = ({
  isFeedVisible,
  isLandingPage,
}) => {
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
  const imageUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMAGE-3-EVSZomfiaUdBB7JBV4bVgQEZBRWDFZ.png"

  const playRandomVideo = useCallback(() => {
    try {
      const randomIndex = Math.floor(Math.random() * videoUrls.length)
      const selectedVideo = videoUrls[randomIndex]
      console.log("Attempting to play video:", selectedVideo)
      setCurrentVideoUrl(selectedVideo)
    } catch (error) {
      console.error("Error in playRandomVideo:", error)
      setCurrentVideoUrl(null)
    }
  }, [])

  const handleVideoEnd = useCallback(() => {
    console.log("Video playback ended, resetting currentVideoUrl")
    setCurrentVideoUrl(null)
  }, [])

  useEffect(() => {
    const playVideo = () => {
      try {
        if (isLandingPage && Math.random() < 0.8) {
          // 80% chance to play a video only on the landing page
          playRandomVideo()
        } else {
          console.log("Skipping video playback")
          setCurrentVideoUrl(null)
        }
      } catch (error) {
        console.error("Error in playVideo:", error)
      }
    }

    playVideo() // Attempt to play a video immediately when the component mounts
    const intervalId = setInterval(playVideo, 20000) // Check every 20 seconds

    return () => clearInterval(intervalId)
  }, [playRandomVideo, isLandingPage])

  return (
    <BackgroundMedia
      imageUrl={imageUrl}
      videoUrl={currentVideoUrl}
      onVideoEnd={handleVideoEnd}
      isFeedVisible={isFeedVisible}
      isLandingPage={isLandingPage}
    />
  )
}

export default BackgroundManager

