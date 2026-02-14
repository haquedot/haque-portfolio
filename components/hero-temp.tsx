"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Download, Mail, MapPin } from "lucide-react"
import { RiNextjsFill, RiReactjsFill, RiTailwindCssFill, RiTwitterXLine, RiJavascriptFill } from "react-icons/ri"
import { SiMongodb, SiTypescript, SiExpress } from "react-icons/si"
import { FaNodeJs } from "react-icons/fa"
import Link from "next/link"
import { profile } from "@/constants/profile"
import { fadeInUp, containerVariants } from "@/lib/animations"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const techStack = [
  // Inner Ring
  { icon: RiReactjsFill, color: "text-[#61DAFB]", name: "React", ring: 1 },
  { icon: RiNextjsFill, color: "text-foreground", name: "Next.js", ring: 1 },
  { icon: FaNodeJs, color: "text-[#339933]", name: "Node.js", ring: 1 },
  { icon: RiTailwindCssFill, color: "text-[#38B2AC]", name: "Tailwind", ring: 1 },
  // Outer Ring
  { icon: SiMongodb, color: "text-[#47A248]", name: "MongoDB", ring: 2 },
  { icon: SiTypescript, color: "text-[#3178C6]", name: "TypeScript", ring: 2 },
  { icon: SiExpress, color: "text-foreground", name: "Express", ring: 2 },
  { icon: Github, color: "text-foreground", name: "GitHub", ring: 2 },
]

const OrbitElement = ({ item, radius, duration, delay = 0 }: { item: any, radius: number, duration: number, delay?: number }) => {
  return (
    <motion.div
      className="absolute"
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
      style={{
        width: radius * 2,
        height: radius * 2,
      }}
    >
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ transformOrigin: `50% ${radius}px` }}
      >
        <motion.div
          animate={{
            rotate: [0, -360],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
            delay,
          }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.25, zIndex: 50 }}
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2,
                    },
                  }}
                  className="bg-background/40 backdrop-blur-md border border-white/10 p-2 sm:p-3 rounded-full shadow-lg cursor-pointer hover:border-primary/50 transition-colors group flex items-center justify-center"
                >
                  <item.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${item.color} group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]`} />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-popover/80 backdrop-blur-md">
                <p className="text-xs font-semibold">{item.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  const rotateX = useTransform(y, [-300, 300], [15, -15])
  const rotateY = useTransform(x, [-300, 300], [-15, 15])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-12 sm:py-20"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-7xl mx-auto">
          {/* Content Left side */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="text-center lg:text-left space-y-8 order-2 lg:order-1"
          >
            <div className="space-y-4">
              <motion.div variants={fadeInUp}>
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  Available for new opportunities
                </span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50"
              >
                {profile.name}
              </motion.h1>
              
              <motion.h2 
                variants={fadeInUp}
                className="text-xl sm:text-2xl lg:text-3xl font-medium text-muted-foreground"
              >
                {profile.title}
              </motion.h2>
            </div>

            <motion.p 
              variants={fadeInUp}
              className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {profile.bio}
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <Link href={profile.resumePath} target="_blank">
                <Button size="lg" className="rounded-full px-8 group">
                  <Download className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
                  Download CV
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Get in Touch
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="flex items-center justify-center lg:justify-start gap-5 pt-4"
            >
              {[
                { icon: Github, href: "https://github.com/haquedot", label: "GitHub" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/haquedot/", label: "LinkedIn" },
                { icon: RiTwitterXLine, href: "https://x.com/haquedot", label: "Twitter" },
                { icon: Mail, href: `mailto:${profile.email}`, label: "Email" }
              ].map((social) => (
                <Link 
                  key={social.label} 
                  href={social.href} 
                  target="_blank"
                  className="p-2 rounded-full hover:bg-muted transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
              <div className="h-px w-12 bg-border mx-2 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Stack Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex items-center justify-center order-1 lg:order-2 h-[400px] sm:h-[500px]"
            style={{ rotateX, rotateY, perspective: 1000 }}
          >
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />

            {/* Orbit Rings Visualization */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[160px] h-[160px] sm:w-[240px] sm:h-[240px] rounded-full border border-primary/10 border-dashed animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full border border-primary/5 border-dashed animate-[spin_35s_linear_infinite_reverse]" />
            </div>

            {/* Central JS Logo */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(247, 223, 30, 0.1)",
                  "0 0 40px rgba(247, 223, 30, 0.2)",
                  "0 0 20px rgba(247, 223, 30, 0.1)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative z-20 w-16 h-16 sm:w-24 sm:h-24 bg-[#F7DF1E] rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer overflow-hidden group"
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              <RiJavascriptFill className="w-12 h-12 sm:w-16 sm:h-16 text-black" />
            </motion.div>

            {/* Orbiting Icons - Ring 1 (Inner) */}
            {techStack.filter(p => p.ring === 1).map((item, idx, arr) => (
              <OrbitElement
                key={item.name}
                item={item}
                radius={120}
                duration={15}
                delay={(idx * (15 / arr.length))}
              />
            ))}

            {/* Orbiting Icons - Ring 2 (Outer) */}
            {techStack.filter(p => p.ring === 2).map((item, idx, arr) => (
              <OrbitElement
                key={item.name}
                item={item}
                radius={190}
                duration={25}
                delay={(idx * (25 / arr.length))}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
