"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import { projectsData } from "@/constants/projects"
import { containerVariants, itemVariants, hoverScale, tapScale } from "@/lib/animations"

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.3 }
  })
}

export default function Projects() {
  return (
    <section id="projects" className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-10"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Projects
        </motion.h2>

        <div className="grid gap-10">
          {projectsData.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="grid md:grid-cols-2 gap-6 border rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-shadow"
            >
              <motion.div 
                className="overflow-hidden relative h-[300px] md:h-full border-b md:border-b-0 md:border-r"
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={800}
                    height={1200}
                    className="w-full object-contain transition-transform duration-300"
                  />
                </div>
              </motion.div>

              <motion.div 
                className="p-6 space-y-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
              >
                <motion.h3 
                  className="text-xl font-bold"
                  whileHover={{ x: 5 }}
                >
                  {project.title}
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {project.description}
                </motion.p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                    >
                      <Badge variant="secondary" className="hover:scale-110 transition-transform cursor-default">
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-2">
                  <motion.h4 
                    className="font-semibold"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    Key Features:
                  </motion.h4>
                  <motion.ul 
                    className="list-disc pl-5 space-y-1"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                  >
                    {project.features.map((feature, idx) => (
                      <motion.li 
                        key={idx} 
                        className="text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                      >
                        {feature}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                <motion.div 
                  className="flex gap-3 pt-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <motion.div {...hoverScale} {...tapScale}>
                    <Button size="sm">
                      <Link
                        href={project.demoUrl}
                        className="flex items-center"
                        target="_blank"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" /> Live
                      </Link>
                    </Button>
                  </motion.div>
                  {
                    project.githubUrl && (
                      <motion.div {...hoverScale} {...tapScale}>
                        <Button size="sm" variant="outline">
                          <Link
                            href={project.githubUrl}
                            className="flex items-center"
                            target="_blank"
                          >
                            <Github className="mr-2 h-4 w-4" /> Code
                          </Link>
                        </Button>
                      </motion.div>
                    )
                  }
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}