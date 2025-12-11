"use client"

import { motion } from "framer-motion"
import { skillsData } from "@/constants/skills"
import { FaBootstrap, FaCss3, FaGitAlt, FaGithub, FaHtml5, FaJs, FaReact } from "react-icons/fa"
import { SiMongodb, SiMysql } from "react-icons/si"
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri"
import { VscVscode } from "react-icons/vsc"
import { IoLogoFigma, IoLogoVercel } from "react-icons/io5"
import { containerVariants, itemVariants, hoverLift, float } from "@/lib/animations"

const iconMap: Record<string, React.ReactNode> = {
  FaJs: <FaJs />,
  FaReact: <FaReact />,
  RiNextjsFill: <RiNextjsFill />,
  FaHtml5: <FaHtml5 />,
  FaCss3: <FaCss3 />,
  FaBootstrap: <FaBootstrap />,
  RiTailwindCssFill: <RiTailwindCssFill />,
  SiMongodb: <SiMongodb />,
  SiMysql: <SiMysql />,
  FaGitAlt: <FaGitAlt />,
  FaGithub: <FaGithub />,
  VscVscode: <VscVscode />,
  IoLogoFigma: <IoLogoFigma />,
  IoLogoVercel: <IoLogoVercel />,
}

const skillItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function Skills() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="skills" className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          My Skills
        </motion.h2>
        <motion.p 
          className="text-muted-foreground mb-10"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Technologies and tools I've worked with throughout my projects and experience
        </motion.p>

        <motion.div 
          className="grid gap-10"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {skillsData.map((category, index) => (
            <motion.div
              key={index}
              variants={item}
            >
              <motion.h3 
                className="text-xl font-semibold mb-4"
                whileHover={{ 
                  x: 5,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                {category.title}
              </motion.h3>
              <div className="flex flex-wrap gap-4">
                {category.skills.map((skill, idx) => (
                  <motion.div 
                    key={idx} 
                    className="flex flex-col items-center gap-2 group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * idx }}
                  >
                    <motion.div 
                      className={`
                        w-14 h-14 rounded-full bg-muted flex items-center justify-center text-xl
                        group-hover:bg-muted/50 transition-colors duration-300
                        border border-transparent group-hover:border-primary/20
                        cursor-pointer
                        ${skill.color}
                      `}
                      whileHover={{
                        y: -8,
                        scale: 1.1,
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                        transition: { type: "spring", stiffness: 300, damping: 20 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        y: [0, -3, 0],
                      }}
                      transition={{
                        duration: 3 + idx * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.1
                      }}
                    >
                      {iconMap[skill.iconName]}
                    </motion.div>
                    <motion.span 
                      className="text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                      initial={{ opacity: 1 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {skill.name}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}