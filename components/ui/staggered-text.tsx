"use client"

import { motion } from "framer-motion"

interface StaggeredTextProps {
  text: string
  delay?: number
  className?: string
  containerClassName?: string
}

export function StaggeredText({
  text,
  delay = 0,
  className = "",
  containerClassName = ""
}: StaggeredTextProps) {
  const words = text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  }

  const child = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      className={`flex flex-wrap gap-1 ${containerClassName}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={child}
          className={className}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}
