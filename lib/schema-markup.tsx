export function PersonSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Merajul Haque',
          url: 'https://www.merajulhaque.com',
          email: 'haquedot@gmail.com',
          telephone: '+91-75024-61630',
          jobTitle: 'Full Stack Developer',
          worksFor: {
            '@type': 'Organization',
            name: 'Freelance',
          },
          location: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Hyderabad',
              addressRegion: 'Telangana',
              addressCountry: 'India',
            },
          },
          image: 'https://www.merajulhaque.com/haquedot.svg',
          sameAs: [
            'https://github.com/haquedot',
            'https://www.linkedin.com/in/haquedot/',
            'https://twitter.com/haquedot',
          ],
          knowsAbout: [
            'Full Stack Web Development',
            'React',
            'Next.js',
            'JavaScript',
            'TypeScript',
            'Node.js',
            'MongoDB',
            'Tailwind CSS',
            'Web Application Development',
            'UI/UX Design',
            'Express.js',
            'REST APIs',
          ],
        }),
      }}
    />
  )
}

export function WebSiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          url: 'https://www.merajulhaque.com',
          name: 'Merajul Haque Portfolio',
          description:
            'Full Stack Developer Portfolio - React, Next.js, Node.js, and Modern Web Technologies',
          author: {
            '@type': 'Person',
            name: 'Merajul Haque',
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate:
                'https://www.merajulhaque.com/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        }),
      }}
    />
  )
}

export function BreadcrumbSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://www.merajulhaque.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Projects',
              item: 'https://www.merajulhaque.com#projects',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Skills',
              item: 'https://www.merajulhaque.com#skills',
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: 'Contact',
              item: 'https://www.merajulhaque.com#contact',
            },
          ],
        }),
      }}
    />
  )
}
