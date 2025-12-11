import type { Metadata } from 'next/types'

export const baseMetadata: Metadata = {
  title: 'Merajul Haque | Full Stack Developer & Software Engineer | Portfolio',
  description:
    'Full-stack developer portfolio showcasing expertise in React, Next.js, Node.js, and MongoDB. View my projects, experience, and technical skills.',
  keywords: [
    'full stack developer',
    'react developer',
    'next.js developer',
    'software engineer',
    'web developer',
    'javascript developer',
    'portfolio',
    'hyderabad',
  ],
  authors: [{ name: 'Merajul Haque', url: 'https://www.merajulhaque.com' }],
  creator: 'Merajul Haque',
  publisher: 'Merajul Haque',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  openGraph: {
    type: 'profile',
    url: 'https://www.merajulhaque.com',
    title: 'Merajul Haque | Full Stack Developer',
    description: 'Explore my portfolio of innovative web applications and development projects',
    images: [
      {
        url: 'https://www.merajulhaque.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Merajul Haque - Full Stack Developer Portfolio',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    siteName: 'Merajul Haque Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merajul Haque | Full Stack Developer',
    description: 'Check out my portfolio of innovative web applications',
    images: ['https://www.merajulhaque.com/og-image.png'],
    creator: '@haquedot',
    site: '@haquedot',
  },
  alternates: {
    canonical: 'https://www.merajulhaque.com',
  },
  verification: {
    // INSTRUCTIONS FOR GOOGLE SEARCH CONSOLE VERIFICATION:
    // 1. Go to: https://search.google.com/search-console
    // 2. Click "Add property" and enter: https://www.merajulhaque.com
    // 3. Choose "URL prefix" option
    // 4. Select "Meta tag" verification method
    // 5. Copy the content value from the meta tag below
    // 6. Replace 'YOUR_GOOGLE_VERIFICATION_CODE' with your actual code
    google: 'BgDrV9voTYqHHg-xobRTihhj-uUjmh-Fj_a_VN-XM9Y',
    // Add other verification codes as needed:
    // yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
    // other: { 'msvalidate.01': ['YOUR_BING_CODE'] },
  },
}

export const pageMetadata = {
  home: {
    title: 'Merajul Haque | Full Stack Developer & Software Engineer | Portfolio',
    description:
      'Full-stack developer portfolio showcasing expertise in React, Next.js, Node.js, and MongoDB. View my projects, experience, and technical skills.',
  },
  experience: {
    title: 'Professional Experience | Merajul Haque - Full Stack Developer',
    description:
      'My professional experience as a full stack developer, including frontend and backend development projects using React, Next.js, and Node.js.',
  },
  projects: {
    title: 'Web Development Projects | Merajul Haque - Full Stack Developer',
    description:
      'View my portfolio of web development projects built with React, Next.js, Node.js, MongoDB, and modern web technologies.',
  },
  skills: {
    title: 'Technical Skills | Merajul Haque - Full Stack Developer',
    description:
      'My technical expertise includes React, Next.js, JavaScript, Node.js, MongoDB, Tailwind CSS, and more web development technologies.',
  },
  contact: {
    title: 'Contact Me | Merajul Haque - Full Stack Developer',
    description:
      'Get in touch with me for freelance projects, full-time opportunities, or just to say hello. Available for web development projects.',
  },
}
