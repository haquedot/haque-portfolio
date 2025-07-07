"use client"

import { useState } from "react"
import Link from "next/link"
import { X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface AdHeaderProps {
  title: string
  description?: string
  buttonText: string
  href: string
  isExternal?: boolean
  onClose?: () => void
  dismissible?: boolean
}

export default function AdHeader({
  title,
  description,
  buttonText,
  href,
  isExternal = false,
  onClose,
  dismissible = true,
}: AdHeaderProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <h3 className="font-semibold text-sm sm:text-base truncate">
                      {title}
                    </h3>
                    {description && (
                      <p className="text-xs sm:text-sm text-white/90 truncate">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
                
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-white/90 shrink-0"
                >
                  {isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5"
                    >
                      {buttonText}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link href={href} className="flex items-center gap-1.5">
                      {buttonText}
                    </Link>
                  )}
                </Button>
              </div>

              {dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-white hover:bg-white/20 ml-2 shrink-0 h-8 w-8 p-0"
                  aria-label="Dismiss announcement"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
