"use client"

import { useInView } from "framer-motion"
import { useRef } from "react"

/**
 * Hook to trigger animations when element comes into view
 */
export const useScrollAnimation = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return { ref, isInView }
}

/**
 * Hook for stagger animation delays
 */
export const useStaggerDelay = (index: number, baseDelay = 0.1) => {
  return index * baseDelay
}

/**
 * Hook for responsive animation timings
 */
export const useResponsiveAnimation = () => {
  const isReducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
    : false

  return {
    isReducedMotion,
    duration: isReducedMotion ? 0 : 0.5,
    durationLong: isReducedMotion ? 0 : 0.8,
    durationShort: isReducedMotion ? 0 : 0.3,
  }
}

/**
 * Hook for sequential animations
 */
export const useSequentialAnimation = (itemCount: number) => {
  const getDelay = (index: number) => index * 0.08

  return { getDelay }
}

/**
 * Hook for smooth scroll animations
 */
export const useSmoothScroll = () => {
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return { scrollToElement }
}
