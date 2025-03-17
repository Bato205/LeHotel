"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PrivacyNoticeProps {
  onClose: () => void
}

export default function PrivacyNotice({ onClose }: PrivacyNoticeProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 10000) // Hide after 10 seconds

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 px-6 pb-6 z-50"
        >
          <div className="pointer-events-auto mx-auto max-w-[calc(36rem+200px)] rounded-xl bg-white/80 backdrop-blur-sm p-6 shadow-lg ring-1 ring-gray-900/10">
            <p className="text-sm/6 text-gray-900 mb-4">
              LeHotel uses cookies to complement a balanced diet and provide a much deserved reward to the senses after
              consuming bland meals from other establishments. Accepting our cookies is optional but recommended, as
              they are delicious. See our{" "}
              <a
                href="/cookies-policy"
                className="font-semibold text-[#a86774] hover:text-[#b87884]"
                target="_blank"
                rel="noopener noreferrer"
              >
                cookie policy
              </a>
              .
            </p>
            <div className="flex items-center gap-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsVisible(false)
                  onClose()
                }}
                className="rounded-md bg-[#a86774] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#b87884] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86774]"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsVisible(false)
                  onClose()
                }}
                className="text-sm font-semibold text-gray-900 hover:text-gray-700"
              >
                Reject all
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

