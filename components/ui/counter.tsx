"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface CounterProps {
  from?: number
  to: number
  duration?: number
  delay?: number
  decimals?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function Counter({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  decimals = 0,
  suffix = "",
  prefix = "",
  className = "",
}: CounterProps) {
  const [count, setCount] = useState(from)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = (currentTime - startTime) / 1000

      if (elapsed < duration) {
        const progress = elapsed / duration
        const currentCount = from + (to - from) * progress
        setCount(currentCount)
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(to)
      }
    }

    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate)
    }, delay * 1000)

    return () => {
      clearTimeout(timeoutId)
      cancelAnimationFrame(animationFrame)
    }
  }, [from, to, duration, delay, decimals])

  return (
    <motion.span className={className}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </motion.span>
  )
}
