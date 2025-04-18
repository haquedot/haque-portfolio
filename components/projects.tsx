"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"

const projects = [
  {
    title: "English Expressway",
    description:
      "An online platform to join courses and buy ebooks to learn English, featuring role-based authentication and payment integration.",
    image: "/englishexpressway.webp",
    tags: ["Next.js", "NextAuth.js", "Tailwind CSS", "MongoDB", "Razorpay"],
    demoUrl: "https://www.englishexpressway.com/",
    githubUrl: "#",
    features: [
      "Role-based authentication using NextAuth.js and JWT",
      "Integrated Razorpay for payment transactions",
      "Responsive landing page with course listings",
      "User dashboard for enrolled courses",
      "Admin dashboard for content management",
    ],
  },
  {
    title: "ThankQuiz",
    description:
      "A fully responsive quiz web application with OTP-based authentication and AI-generated questions.",
    image: "/thankquiz.webp",
    tags: ["ReactJS", "Redux", "Bootstrap", "Figma", "OpenAI API"],
    demoUrl: "#",
    githubUrl: "https://sandbox-frontend.thankquiz.com/",
    features: [
      "OTP-based mobile authentication via API",
      "Profile completion workflows with user data storage",
      "Dynamic question banks from OpenAI-powered backend",
      "Quiz history tracking for personalized experience",
      "Redux for state management of authentication and quiz progress",
    ],
  },
  {
    title: "Exceed Robotics",
    description:
      "Program enrollment camps and blog pages for Exceed Robotics, focusing on intuitive user experience.",
    image: "/exceedrobotics.webp",
    tags: ["HTML", "CSS", "JavaScript", "Bootstrap", "jQuery"],
    demoUrl: "#",
    githubUrl: "https://exceedrobotics.com/",
    features: [
      "Responsive program enrollment pages",
      "Interactive blog section",
      "Optimized for speed and accessibility",
      "Cross-browser compatible design",
      "Collaborative development with team members",
    ],
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-10">Projects</h2>

        <div className="grid gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="grid md:grid-cols-2 gap-6 border rounded-xl overflow-hidden group"
            >
              <div className="overflow-hidden relative h-[300px] md:h-full border-b md:border-b-0 md:border-r">
                <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={800}
                    height={1200}
                    className="w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-muted-foreground">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Key Features:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="text-sm">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" /> Demo
                  </Button>
                  <Button size="sm" variant="outline">
                    <Github className="mr-2 h-4 w-4" /> GitHub
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}