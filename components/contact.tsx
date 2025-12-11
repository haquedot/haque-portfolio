"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Linkedin, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { contactData } from "@/constants/contact"
import { containerVariants, itemVariants, hoverScale, tapScale, successPulse } from "@/lib/animations"

const contactItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  })
}

const inputVariants = {
  focus: {
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    transition: { duration: 0.2 }
  }
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast({
          title: "Success!",
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {"Your message has been sent successfully. I'll get back to you soon!"}
            </div>
          ),
        })
        setFormData({
          name: '',
          email: '',
          message: ''
        })
      } else {
        throw new Error(data.message || 'Failed to send message')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-10">
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
          Contact Me
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Get In Touch
            </motion.h3>

            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  href: `mailto:${contactData.email}`,
                  value: contactData.email,
                  external: false
                },
                {
                  icon: Phone,
                  label: "Phone",
                  href: `tel:7502461630`,
                  value: contactData.phone,
                  external: false
                },
                {
                  icon: MapPin,
                  label: "Location",
                  href: null,
                  value: contactData.location,
                  external: false
                },
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  href: contactData.linkedIn,
                  value: "linkedin.com/in/haquedot",
                  external: true
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-3 group"
                >
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: "hsl(var(--primary) / 0.1)"
                    }}
                  >
                    <item.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    {item.href ? (
                      <motion.div
                        whileHover={{ x: 3 }}
                      >
                        <Link
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.value}
                        </Link>
                      </motion.div>
                    ) : (
                      <p className="font-medium">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div>
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800"
              >
                <motion.div 
                  className="flex flex-col items-center text-center gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div
                    {...successPulse}
                  >
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-semibold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Message Sent Successfully!
                  </motion.h3>
                  <motion.p 
                    className="text-muted-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    {...hoverScale}
                    {...tapScale}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setIsSuccess(false)}
                      className="mt-4"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.h3 
                  className="text-xl font-semibold mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Send Me a Message
                </motion.h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <label htmlFor="name" className="text-sm">
                        Name
                      </label>
                      <motion.div
                        whileFocus="focus"
                        variants={inputVariants}
                      >
                        <Input 
                          id="name" 
                          placeholder="Your name" 
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="focus:ring-2 focus:ring-primary/30"
                        />
                      </motion.div>
                    </motion.div>
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                    >
                      <label htmlFor="email" className="text-sm">
                        Email
                      </label>
                      <motion.div
                        whileFocus="focus"
                        variants={inputVariants}
                      >
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Your email" 
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="focus:ring-2 focus:ring-primary/30"
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <label htmlFor="message" className="text-sm">
                      Message
                    </label>
                    <motion.div
                      whileFocus="focus"
                      variants={inputVariants}
                    >
                      <Textarea 
                        id="message" 
                        placeholder="Your message" 
                        rows={5} 
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="focus:ring-2 focus:ring-primary/30"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    {...hoverScale}
                    {...tapScale}
                  >
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <motion.svg 
                            className="h-4 w-4" 
                            viewBox="0 0 24 24"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </motion.svg>
                          Sending...
                        </span>
                      ) : (
                        'Submit Message'
                      )}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}