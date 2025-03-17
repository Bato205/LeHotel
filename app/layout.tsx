import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dream Hotels & Resorts",
  description: "Experience luxury and comfort at Dream Hotels & Resorts",
  icons: {
    icon: "https://8qmlf3ahivlltjw6.public.blob.vercel-storage.com/Favicon-dBdOyBbPEAQZrsl3iXgAmAcXRoJkpM.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'