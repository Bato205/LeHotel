"use client"

import { useState, useEffect, useRef } from "react"
import { UserIcon } from "@heroicons/react/24/outline"
import { motion, AnimatePresence } from "framer-motion"
import Cookies from "js-cookie"
import Footer from "@/components/Footer"
import { SparklesIcon, KeyIcon, GiftIcon, StarIcon, HeartIcon, CalendarIcon } from "@heroicons/react/24/outline"
import Logo from "@/components/Logo"
import { AbortController } from "node-abort-controller"
import Link from "next/link"
import IntroVideo from "@/components/IntroVideo"
import AudioPlayer from "@/components/AudioPlayer"
import BackgroundManager from "@/components/BackgroundManager"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { AudioProvider, useAudio } from "../contexts/AudioContext"
import PrivacyNotice from "@/components/PrivacyNotice"
import MobileMenu from "@/components/MobileMenu"
import Header from "@/components/Header"

type MessageType = "user" | "Marcel"

interface Message {
  id: number
  type: MessageType
  content: string
  date: Date
  audioData?: string // Base64 encoded audio data
}

const prompts = [
  {
    text: "Hidden deals?",
    fullPrompt: "Do you have any hidden deals for me?",
    icon: SparklesIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
  },
  {
    text: "Unlock discount?",
    fullPrompt: "What's the trick to unlocking a discount?",
    icon: KeyIcon,
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
  },
  {
    text: "Bonus chance?",
    fullPrompt: "Any chance of a little bonus for my next booking?",
    icon: GiftIcon,
    iconForeground: "text-sky-700",
    iconBackground: "bg-sky-50",
  },
  {
    text: "Impress for reward?",
    fullPrompt: "How do I impress you enough for a reward?",
    icon: StarIcon,
    iconForeground: "text-rose-700",
    iconBackground: "bg-rose-50",
  },
  {
    text: "Share a deal?",
    fullPrompt: "Can I charm you into sharing a deal?",
    icon: HeartIcon,
    iconForeground: "text-indigo-700",
    iconBackground: "bg-indigo-50",
  },
]

function HomeContent() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isFirstMessage, setIsFirstMessage] = useState(true)
  const [isInitialView, setIsInitialView] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isFeedVisible, setIsFeedVisible] = useState(false)
  const [showIntroVideo, setShowIntroVideo] = useState(true)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)
  const [isChatVisible, setIsChatVisible] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [autoPlayAudio, setAutoPlayAudio] = useState(true)
  const [isLandingPage, setIsLandingPage] = useState(true)
  const [feedBottomMargin, setFeedBottomMargin] = useState(120)
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(true)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isMuted } = useAudio()

  useEffect(() => {
    const storedUserId = Cookies.get("user_id")
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`
      Cookies.set("user_id", newUserId, { expires: 1 })
      setUserId(newUserId)
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0 && isFirstMessage) {
      setIsFirstMessage(false)
    }
  }, [messages, isFirstMessage])

  useEffect(() => {
    if (!isInitialView && messages.length > 0) {
      scrollToBottom()
      setIsFeedVisible(true)
    }
  }, [messages, isInitialView])

  useEffect(() => {
    if (!showIntroVideo) {
      // Start showing the audio player after the intro video is done
      setShowAudioPlayer(true)
      setIsVideoPlaying(false) // Added: Set isVideoPlaying to false
    }
  }, [showIntroVideo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() === "") return
    setIsChatVisible(true)
    setIsLandingPage(false) // Update landing page state

    if (isInitialView) {
      setIsInitialView(false)
    }

    if (isFirstMessage) {
      setIsFirstMessage(false)
    }

    const newUserMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: query,
      date: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setQuery("")
    setIsLoading(true)

    const webhookUrl = inputRef.current?.dataset.webhook
    if (webhookUrl) {
      const payload = { input: query, user_id: userId }
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 30000) // 30 seconds timeout

      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const responseText = await response.text()

          // Generate speech for Marcel's response
          const speechResponse = await fetch("/api/text-to-speech", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: responseText }),
          })

          let audioData
          if (speechResponse.ok) {
            const { success, audioData: responseAudioData } = await speechResponse.json()
            console.log("Speech response success:", success)
            console.log("Audio data received:", !!responseAudioData)
            if (success) {
              audioData = responseAudioData
            }
          }

          const webhookResponse: Message = {
            id: Date.now(),
            type: "Marcel",
            content: responseText,
            date: new Date(),
            audioData,
          }
          setMessages((prev) => [
            ...prev.filter((msg) => msg.content !== "Processing your request..."),
            webhookResponse,
          ])
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (error) {
        let errorMessage: Message
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            errorMessage = {
              id: messages.length + 2,
              type: "Marcel",
              content: "The request timed out. Please try again.",
              date: new Date(),
            }
          } else {
            errorMessage = {
              id: messages.length + 2,
              type: "Marcel",
              content: `An error occurred: ${error.message}`,
              date: new Date(),
            }
          }
        } else {
          errorMessage = {
            id: messages.length + 2,
            type: "Marcel",
            content: "An unexpected error occurred. Please try again later.",
            date: new Date(),
          }
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const feedContainer = document.querySelector(".feed-container")
    if (feedContainer) {
      feedContainer.scrollTop = feedContainer.scrollHeight
    }
  }, []) // Updated dependency

  useEffect(() => {
    const feedContainer = document.querySelector(".feed-container")
    const searchContainer = document.querySelector(".search-container")
    if (feedContainer && searchContainer && messages.length > 0) {
      const lastMessage = feedContainer.lastElementChild
      if (lastMessage) {
        const feedRect = feedContainer.getBoundingClientRect()
        const searchRect = searchContainer.getBoundingClientRect()
        const lastMessageRect = lastMessage.getBoundingClientRect()

        if (lastMessageRect.bottom > searchRect.top) {
          const scrollAmount = lastMessageRect.bottom - searchRect.top + 20 // 20px extra space
          feedContainer.scrollTop += scrollAmount
        }
      }
    }
  }, [messages])

  const formatMessageDate = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"

    const distance = formatDistanceToNow(date, { addSuffix: false })
    const [value, unit] = distance.split(" ")

    if (unit.startsWith("minute")) return `${value}m`
    if (unit.startsWith("hour")) return `${value}h`
    if (unit.startsWith("day")) return `${value}d`

    return distance
  }

  useEffect(() => {
    const searchContainer = searchContainerRef.current
    if (searchContainer) {
      const handleAnimationEnd = () => {
        searchContainer.classList.remove("animate-search")
      }
      searchContainer.addEventListener("animationend", handleAnimationEnd)
      return () => {
        searchContainer.removeEventListener("animationend", handleAnimationEnd)
      }
    }
  }, []) // Updated dependency

  const playAudio = (audioData: string) => {
    const audio = new Audio(`data:audio/mpeg;base64,${audioData}`)
    audio.play().catch((error) => {
      console.error("Error playing audio:", error)
    })
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause all audio and video when the window is minimized
        document.querySelectorAll("audio, video").forEach((media: HTMLMediaElement) => {
          media.pause()
        })
      } else {
        // When the window is visible again, resume video playback
        document.querySelectorAll("video").forEach((video: HTMLVideoElement) => {
          video.play().catch((error) => console.error("Error resuming video:", error))
        })

        // Resume background music if it was playing before
        const backgroundMusic = document.querySelector('audio[data-background-music="true"]') as HTMLAudioElement
        if (backgroundMusic && !backgroundMusic.paused) {
          backgroundMusic.play().catch((error) => console.error("Error resuming background music:", error))
        }

        // For message audio elements, only play those that are new and haven't been played before
        document.querySelectorAll('audio:not([data-background-music="true"])').forEach((audio: HTMLAudioElement) => {
          if (audio.getAttribute("data-new-message") === "true" && audio.getAttribute("data-played") !== "true") {
            audio.play().catch((error) => console.error("Error playing new message audio:", error))
            audio.removeAttribute("data-new-message")
          }
        })
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    const hasSeenPrivacyNotice = sessionStorage.getItem("hasSeenPrivacyNotice")
    if (hasSeenPrivacyNotice) {
      setShowPrivacyNotice(false)
    } else {
      sessionStorage.setItem("hasSeenPrivacyNotice", "true")
    }
  }, [])

  return (
    <AnimatePresence mode="popLayout">
      {showIntroVideo ? (
        <IntroVideo
          key="intro-video"
          onComplete={() => {
            setShowIntroVideo(false)
            setIsVideoPlaying(false)
          }}
        />
      ) : (
        <motion.div
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="flex flex-col min-h-screen relative"
          style={{
            maxHeight: "calc(100vh - 20px)",
          }}
        >
          {isFeedVisible && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[1] cursor-pointer"
              onClick={() => {
                setIsChatVisible(false)
                setIsInitialView(true)
                setMessages([])
                setQuery("")
                setIsFeedVisible(false)
                setIsFirstMessage(true)
                setIsLandingPage(true)
                if (searchContainerRef.current) {
                  searchContainerRef.current.classList.remove("animate-search")
                  void searchContainerRef.current.offsetWidth
                  searchContainerRef.current.classList.add("animate-search")
                }
              }}
            />
          )}
          <BackgroundManager isFeedVisible={isFeedVisible} isLandingPage={isLandingPage} className="z-0" />
          <Header 
            onReset={() => {
              setIsChatVisible(false)
              setIsInitialView(true)
              setMessages([])
              setQuery("")
              setIsFeedVisible(false)
              setIsFirstMessage(true)
              setIsLandingPage(true)
              if (searchContainerRef.current) {
                searchContainerRef.current.classList.remove("animate-search")
                void searchContainerRef.current.offsetWidth
                searchContainerRef.current.classList.add("animate-search")
              }
            }}
            showAudioPlayer={showAudioPlayer}
          />
          <motion.div
            className="flex-grow p-4 flex flex-col items-center overflow-y-auto relative z-[20] mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <AnimatePresence>
              {!isInitialView && isChatVisible && (
                <motion.div
                  key="chat-feed"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full max-w-3xl mb-8 feed-container overflow-y-auto relative z-[20]"
                  style={{
                    maxHeight: "calc(100vh - 400px)",
                    paddingTop: "100px",
                    paddingBottom: `${feedBottomMargin}px`,
                    marginTop: "180px",
                    marginBottom: "120px", // Added this line
                    maskImage:
                      "linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent)",
                  }}
                >
                  {messages.length === 0 ? (
                    <div className="text-center text-white mt-8">
                      <p className="text-2xl font-semibold mb-2">Welcome to AI Chat!</p>
                      <p>Start a conversation by typing a message below.</p>
                    </div>
                  ) : (
                    <div className="flow-root">
                      <ul role="list" className="-mb-8">
                        {messages.map((message, messageIdx) => (
                          <motion.li
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="relative pb-8">
                              {messageIdx !== messages.length - 1 ? (
                                <span
                                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 opacity-10"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex items-start space-x-3">
                                <div className="relative">
                                  {message.type === "user" ? (
                                    <div className="h-10 w-10 rounded-full bg-emerald-400 flex items-center justify-center">
                                      <UserIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-[#a86774] flex items-center justify-center">
                                      <SparklesIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div>
                                    <div className="text-sm">
                                      <span className="font-medium text-white">
                                        {message.type === "user" ? "You" : "Marcel"}
                                      </span>
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-300">{formatMessageDate(message.date)}</p>
                                  </div>
                                  <div className="mt-2 text-xl text-white">
                                    {isLoading && message.id === messages.length ? (
                                      <div className="flex space-x-2 justify-center items-center">
                                        <div className="w-2 h-2 bg-[#a86774] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-[#a86774] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-[#a86774] rounded-full animate-bounce"></div>
                                      </div>
                                    ) : (
                                      <p className="relative">
                                        {message.content.split(/(\*\*DHR-\d{5}\*\*)/).map((part, index) => {
                                          if (part.match(/^\*\*DHR-\d{5}\*\*$/)) {
                                            const code = part.replace(/\*/g, "")
                                            return (
                                              <button
                                                key={index}
                                                onClick={() => {
                                                  navigator.clipboard.writeText(code)
                                                  // Optional: Add toast notification here
                                                }}
                                                className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 transition-colors cursor-pointer"
                                                title="Click to copy code"
                                              >
                                                {code}
                                              </button>
                                            )
                                          }
                                          return part
                                        })}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {message.type === "Marcel" && (
                                <div className="mt-2 flex space-x-4 ml-[58px]">
                                  <Link
                                    href="https://dreamresorts.co.za/hotels-resorts/?_gl=1*55xuph*_gcl_au*MjUxNDUzMzUzLjE3Mzg0MzU2NzA"
                                    className="text-white hover:bg-white/10 rounded-lg p-2 group relative"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <CalendarIcon className="h-4 w-4" aria-hidden="true" />
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out delay-500 scale-95 group-hover:scale-100 whitespace-nowrap">
                                      Make a Booking
                                    </span>
                                  </Link>
                                  <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                      `There's a new concierge in town & he's giving away discounts!\n\nMarcel: ${message.content}\n\n#DreamHotels #Lehotel #MarcelTheConcierge #CharmForDiscounts`,
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:bg-white/10 rounded-lg p-2 group relative"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out delay-500 scale-95 group-hover:scale-100 whitespace-nowrap">
                                      Tweet
                                    </span>
                                  </a>
                                </div>
                              )}
                            </div>
                            {message.type === "Marcel" && message.audioData && (
                              <audio
                                key={message.id}
                                src={`data:audio/mpeg;base64,${message.audioData}`}
                                autoPlay={autoPlayAudio && !isMuted}
                                data-new-message="true"
                                onEnded={() => {
                                  const audioElement = document.querySelector(
                                    `audio[data-message-id="${message.id}"]`,
                                  )
                                  if (audioElement) {
                                    audioElement.setAttribute("data-played", "true")
                                  }
                                }}
                                data-message-id={message.id}
                                onError={(e) => console.error("Audio playback error:", e)}
                              />
                            )}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div
            ref={searchContainerRef}
            className={`fixed left-0 right-0 z-[40] ${isInitialView ? "top-1/2 -translate-y-1/2" : "bottom-20"} search-container`}
            style={{
              background: isInitialView
                ? "transparent"
                : "linear-gradient(to top, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0) 100%)",
              transform: isInitialView ? "none" : `translateY(-${isInitialView ? 0 : "var(--footer-height)"})`,
              paddingBottom: "20px",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="w-full max-w-3xl mx-auto p-4 pb-16 px-12">
              <form onSubmit={handleSubmit} className="w-full relative">
                <div className="relative w-full flex items-center">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/decoration@4x-8-gHw0aCrbaXlTb4ZPkvjAcg968RtQuw.png"
                    alt=""
                    className="absolute left-[-80px] h-8 w-auto pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isFirstMessage ? "Go on, charm me." : "Reply to Marcel"}
                    className="w-full rounded-full bg-white px-5 py-4 pb-4 pr-28 text-lg outline-none focus:ring-2 focus:ring-slate-500 text-left"
                    data-webhook="https://hook.eu2.make.com/h5gqsvxqhkal361aglfpslwd241yp459"
                    disabled={isLoading}
                    maxLength={150}
                  />
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/decoration@4x-8-gHw0aCrbaXlTb4ZPkvjAcg968RtQuw.png"
                    alt=""
                    className="absolute right-[-80px] h-8 w-auto transform scale-x-[-1] pointer-events-none"
                    aria-hidden="true"
                  />
                  <div
                    className={`absolute ${isInitialView ? "right-14" : "right-24"} top-1/2 -translate-y-1/2 text-sm text-gray-400 pr-2`}
                  >
                    {query.length}/150
                  </div>
                  <button
                    type="submit"
                    className={`absolute ${isInitialView ? "right-1" : "right-12"} top-1/2 -translate-y-1/2 rounded-full bg-slate-500 p-2 text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 mr-2`}
                    disabled={isLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                  </button>
                  {!isInitialView && (
                    <button
                      onClick={() => setAutoPlayAudio((prev) => !prev)}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 ml-4 ${
                        autoPlayAudio ? "bg-slate-500 text-white" : "bg-white text-slate-500"
                      } hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 group`}
                      title={autoPlayAudio ? "Silence is golden" : "Speak up please"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                        />
                      </svg>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out delay-500 scale-95 group-hover:scale-100 whitespace-nowrap">
                        {autoPlayAudio ? "Silence is golden" : "Speak up please"}
                      </span>
                    </button>
                  )}
                </div>
              </form>
              <AnimatePresence>
                {false && isFeedVisible && !isInitialView && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap gap-2 mt-2 justify-center"
                  >
                    {prompts.map((prompt, index) => (
                      <motion.button
                        key={prompt.text}
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } },
                        }}
                        onClick={() => setQuery(prompt.fullPrompt)}
                        className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-black ${prompt.iconBackground.replace(
                          "bg-",
                          "bg-",
                        )} hover:shadow-sm transition-all duration-200 ease-in-out`}
                      >
                        <span className={`${prompt.iconBackground} ${prompt.iconForeground} p-1 rounded-md`}>
                          <prompt.icon className="h-3 w-3" aria-hidden="true" />
                        </span>
                        {prompt.text}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <motion.footer
            className="fixed bottom-0 left-0 right-0 z-[30]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className="w-full"></div>
            <Footer />
          </motion.footer>
          {isLandingPage && showPrivacyNotice && <PrivacyNotice onClose={() => setShowPrivacyNotice(false)} />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Home() {
  return (
    <AudioProvider>
      <>
        <HomeContent />
        <style jsx global>{`
          .feed-container::-webkit-scrollbar {
            display: none !important;
          }
          .feed-container {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .feed-container::-webkit-scrollbar {
            display: none;
          }
          @keyframes searchAnimation {
            0% {
              transform: translateY(20px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-search {
            animation: searchAnimation 0.5s ease-out;
          }
        `}</style>
      </>
    </AudioProvider>
  )
}

export default Home

