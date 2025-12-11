"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
  once?: boolean
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  className = "",
  once = true,
}: ScrollRevealProps) {
  const directionVariants = {
    up: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
    },
    down: {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
    },
    left: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
    },
    right: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
  }

  const variant = directionVariants[direction]

  return (
    <motion.div
      initial={variant.initial}
      whileInView={variant.animate}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
