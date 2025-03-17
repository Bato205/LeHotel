import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"

interface MobileMenuProps {
  onReset: () => void
}

export default function MobileMenu({ onReset }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="md:hidden text-white/70 hover:text-white transition-colors duration-200">
          <Menu className="h-6 w-6" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <AnimatePresence>
          <Dialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
            />
          </Dialog.Overlay>
        </AnimatePresence>
        <AnimatePresence>
          <Dialog.Content asChild>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed right-0 top-0 h-full w-64 bg-white/10 backdrop-blur-md border-l border-white/20 z-[9999] md:hidden"
            >
              <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
              <div className="flex flex-col h-full">
                <div className="flex justify-end p-4">
                  <Dialog.Close asChild>
                    <button className="text-white/70 hover:text-white transition-colors duration-200">
                      <X className="h-6 w-6" />
                    </button>
                  </Dialog.Close>
                </div>
                <nav className="flex-1 px-4">
                  <ul className="space-y-6">
                    <li>
                      <button
                        onClick={() => {
                          onReset()
                          setIsOpen(false)
                        }}
                        className="w-full text-left text-white/70 hover:text-white transition-colors duration-200 text-lg font-medium"
                      >
                        Home
                      </button>
                    </li>
                    <li>
                      <Link
                        href="https://dreamresorts.co.za/hotels-resorts/?_gl=1*zg5h2q*_gcl_au*MjUxNDUzMzUzLjE3Mzg0MzU2NzA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-left text-white/70 hover:text-white transition-colors duration-200 text-lg font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Hotels & Resorts
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://dreamresorts.co.za/hotels-resorts/?_gl=1*55xuph*_gcl_au*MjUxNDUzMzUzLjE7Mzg0MzU2NzA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-left text-white/70 hover:text-white transition-colors duration-200 text-lg font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Make a Booking
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </motion.div>
          </Dialog.Content>
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
} 