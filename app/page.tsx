
'use client';

import Hero from '../components/Hero';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://excelltoquiz.pages.dev';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "ExcelToQuiz - Create Multilingual Quizzes from Excel Files",
            "description": "Transform your Excel files into engaging multilingual quizzes instantly. Support for Bangla, Hindi, English & 50+ languages. Create unlimited quizzes for free.",
            "url": siteUrl,
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "ExcelToQuiz",
              "applicationCategory": "EducationalApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": siteUrl
                }
              ]
            }
          })
        }}
      />
      <div className="min-h-screen">
        <Hero />
        <CTA />
        <Footer />
      </div>
    </>
  );
}
