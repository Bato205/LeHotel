import { motion } from "framer-motion"
import Logo from "./Logo"
import MobileMenu from "./MobileMenu"
import AudioPlayer from "./AudioPlayer"
import Link from "next/link"

interface HeaderProps {
  onReset: () => void
  showAudioPlayer: boolean
}

export default function Header({ onReset, showAudioPlayer }: HeaderProps) {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[30] bg-transparent"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="grid grid-cols-3 items-center px-4 pt-4">
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brand%20logo@4x-8-NJfFEtDOE5RZsXqb1xGXEm2hyYeFil.png"
              alt="Dream Hotels & Resorts"
              className="h-12 w-auto cursor-pointer"
              onClick={onReset}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="flex justify-end items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="https://dreamresorts.co.za/hotels-resorts/?_gl=1*zg5h2q*_gcl_au*MjUxNDUzMzUzLjE3Mzg0MzU2NzA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                type="button"
                className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
              >
                Hotels & Resorts
              </button>
            </Link>
            <Link
              href="https://dreamresorts.co.za/hotels-resorts/?_gl=1*55xuph*_gcl_au*MjUxNDUzMzUzLjE7Mzg0MzU2NzA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                type="button"
                className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
              >
                Make a Booking
              </button>
            </Link>
            {showAudioPlayer && (
              <div className="ml-2">
                <AudioPlayer
                  url="https://yzqspsfjsojhidxp.public.blob.vercel-storage.com/French%20Waltz-emlpCjIEZEtmTYdcp69jjl7avV7sAO.wav"
                  initiallyPlaying={true}
                  data-background-music="true"
                />
              </div>
            )}
          </div>
          <MobileMenu onReset={onReset} />
        </div>
      </div>
    </motion.header>
  )
} 