"use client"

import { motion } from "framer-motion"
import { FaBootstrap, FaCss3, FaGitAlt, FaGithub, FaHtml5, FaJs, FaReact } from "react-icons/fa";
import { SiMongodb, SiMysql } from "react-icons/si";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { VscVscode } from "react-icons/vsc";
import { IoLogoFigma, IoLogoVercel } from "react-icons/io5";

const skillCategories = [
  {
    title: "Front End",
    skills: [
      { name: "JavaScript", icon: <FaJs /> },
      { name: "React.js", icon: <FaReact /> },
      { name: "Next.js", icon: <RiNextjsFill /> },
      { name: "HTML", icon: <FaHtml5 /> },
      { name: "CSS", icon: <FaCss3 /> },
      { name: "Bootstrap", icon: <FaBootstrap /> },
      { name: "Tailwind CSS", icon: <RiTailwindCssFill /> },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "MongoDB", icon: <SiMongodb /> },
      { name: "MySQL", icon: <SiMysql /> },
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      { name: "Git", icon: <FaGitAlt /> },
      { name: "GitHub", icon: <FaGithub /> },
      { name: "VS Code", icon: <VscVscode /> },
      { name: "Figma", icon: <IoLogoFigma /> },
      { name: "Vercel", icon: <IoLogoVercel /> },
    ],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6">My Skills</h2>
        <p className="text-muted-foreground mb-10">
          Technologies and tools I've worked with throughout my projects and experience
        </p>

        <div className="grid gap-10">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-4">
                {category.skills.map((skill, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      {skill.icon}
                    </div>
                    <span className="text-xs text-center">{skill.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}