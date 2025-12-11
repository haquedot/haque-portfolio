"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import type { HTMLAttributes } from "react"

interface AnimatedBadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
  delay?: number
}

const AnimatedBadge = React.forwardRef<HTMLDivElement, AnimatedBadgeProps>(
  ({ children, variant = "default", delay = 0, className, ...props }, ref) => {
    const { onDrag, onDragStart, onDragEnd, onDragCapture, ...motionProps } = props
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ 
          y: -3,
          scale: 1.05,
          transition: { type: "spring", stiffness: 300 }
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay, duration: 0.3 }}
      >
        <Badge variant={variant} className={className} {...motionProps}>
          {children}
        </Badge>
      </motion.div>
    )
  }
)

AnimatedBadge.displayName = "AnimatedBadge"

export { AnimatedBadge }
