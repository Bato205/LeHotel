import Image from "next/image"
import { motion } from "framer-motion"

const Logo = () => (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] pt-10">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
      className="w-full"
    >
      <div className="relative w-full">
        <Image
          src="https://8qmlf3ahivlltjw6.public.blob.vercel-storage.com/logo_1-80PQUw9gQqROl9BIV8y8eUTwoEg8O6.svg"
          alt="LeHotel - it's concierge with a weakness for charm"
          width={400}
          height={228}
          priority
          className="w-full h-auto"
        />
      </div>
    </motion.div>
  </div>
)

export default Logo

