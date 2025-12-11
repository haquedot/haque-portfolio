"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@/components/ui/button"

interface AnimatedButtonProps extends Omit<ButtonProps, 'children'> {
  children: React.ReactNode
  animateOnHover?: boolean
  animateOnTap?: boolean
  glowEffect?: boolean
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    animateOnHover = true, 
    animateOnTap = true,
    glowEffect = false,
    className,
    ...props 
  }, ref) => {
    return (
      <motion.div
        whileHover={animateOnHover ? { scale: 1.02 } : undefined}
        whileTap={animateOnTap ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        style={{ display: "inline-block" }}
      >
        <Button
          ref={ref}
          className={className}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    )
  }
)

AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton }
