"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { PropsWithChildren } from "react"

interface AnimatedCardProps extends PropsWithChildren {
  className?: string
  delay?: number
  hoverScale?: number
  whileHover?: boolean
}

const AnimatedCard = React.forwardRef<
  HTMLDivElement,
  AnimatedCardProps
>(({ 
  children, 
  className, 
  delay = 0,
  hoverScale = 1.02,
  whileHover = true
}, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={whileHover ? { 
        y: -8,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
      } : undefined}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 300, damping: 20 }}
      className="w-full"
    >
      <Card className={className}>
        {children}
      </Card>
    </motion.div>
  )
})

AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard }
