// Reusable animation variants for framer-motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const scaleInLarge = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
}

export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
}

export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
}

// Container and item variants for staggered animations
export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const containerVariantsNoDelay = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export const itemVariantsSlideLeft = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
}

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.05, transition: { type: "spring", stiffness: 300 } },
}

export const hoverScaleSmall = {
  whileHover: { scale: 1.02, transition: { type: "spring", stiffness: 400 } },
}

export const hoverLift = {
  whileHover: { y: -5, transition: { type: "spring", stiffness: 300 } },
}

export const hoverGlow = {
  whileHover: { 
    boxShadow: "0 0 20px rgba(var(--primary), 0.3)",
    transition: { duration: 0.3 }
  },
}

// Tap/Click animations
export const tapScale = {
  whileTap: { scale: 0.95 },
}

export const tapLift = {
  whileTap: { y: -2 },
}

// Rotation animations
export const rotateOnHover = {
  whileHover: { rotate: 5, transition: { type: "spring", stiffness: 300 } },
}

export const continuousRotate = {
  animate: { rotate: 360 },
  transition: { duration: 20, repeat: Infinity, ease: "linear" },
}

// Pulse animation
export const pulse = {
  animate: { opacity: [1, 0.7, 1] },
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
}

// Bounce animation
export const bounce = {
  animate: { y: [0, -10, 0] },
  transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
}

// Float animation
export const float = {
  animate: { y: [0, -8, 0] },
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
}

export const floatSmall = {
  animate: { y: [0, -4, 0] },
  transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
}

// Shimmer animation
export const shimmer = {
  animate: { 
    backgroundPosition: ["0% 0%", "100% 0%"],
  },
  transition: { 
    duration: 2, 
    repeat: Infinity,
    ease: "linear"
  },
}

// Success animation
export const successPulse = {
  animate: { scale: [1, 1.1, 1] },
  transition: { duration: 0.6, ease: "easeOut" },
}

// Shake animation
export const shake = {
  animate: { x: [-5, 5, -5, 5, 0] },
  transition: { duration: 0.4, ease: "easeInOut" },
}

// Page transition variants
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

// Card hover effect
export const cardHoverVariants = {
  rest: { 
    y: 0,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
  },
  hover: { 
    y: -8,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
}

// Badge entrance animation
export const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
}

// Text blur entrance
export const textBlurVariants = {
  hidden: { filter: "blur(10px)", opacity: 0 },
  visible: { filter: "blur(0px)", opacity: 1 },
}

// Transition configurations
export const easeTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5,
}

export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
}

export const smoothTransition = {
  type: "spring",
  stiffness: 100,
  damping: 25,
}

export const quickTransition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
}
