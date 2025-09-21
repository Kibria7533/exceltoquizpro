
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const siteUrl = 'https://excelltoquiz.pages.dev';

export const metadata: Metadata = {
  title: "ExcelToQuiz - Create Multilingual Quizzes from Excel Files",
  description: "Transform your Excel files into engaging multilingual quizzes instantly. Support for Bangla, Hindi, English & 50+ languages. Create unlimited quizzes for free with real-time leaderboards and analytics.",
  keywords: [
    "Excel to quiz",
    "multilingual quiz",
    "Bangla quiz",
    "Hindi quiz",
    "online quiz maker",
    "Excel quiz converter",
    "free quiz creator",
    "educational quiz",
    "quiz generator",
    "interactive quiz",
  ],
  authors: [{ name: "ExcelToQuiz" }],
  creator: "ExcelToQuiz",
  publisher: "ExcelToQuiz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ExcelToQuiz - Create Multilingual Quizzes from Excel Files",
    description: "Transform your Excel files into engaging multilingual quizzes instantly. Support for Bangla, Hindi, English & 50+ languages.",
    url: '/',
    siteName: 'ExcelToQuiz',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ExcelToQuiz - Multilingual Quiz Creator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "ExcelToQuiz - Create Multilingual Quizzes from Excel Files",
    description: "Transform your Excel files into engaging multilingual quizzes instantly. Support for Bangla, Hindi, English & 50+ languages.",
    images: ['/og-image.jpg'],
    creator: '@ExcelToQuiz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ExcelToQuiz",
              "description":
                "Transform your Excel files into engaging multilingual quizzes instantly. Support for Bangla, Hindi, English & 50+ languages.",
              "url": siteUrl,
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
              "featureList": [
                "Multilingual quiz creation",
                "Excel file upload",
                "Real-time leaderboards",
                "50+ language support",
                "Free unlimited quizzes",
              ],
              "screenshot": `${siteUrl}/screenshot.jpg`,
              "softwareVersion": "1.0",
              "author": {
                "@type": "Organization",
                "name": "ExcelToQuiz",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ExcelToQuiz",
              "description":
                "Leading platform for creating multilingual quizzes from Excel files",
              "url": siteUrl,
              "logo": `${siteUrl}/logo.png`,
              "sameAs": [
                "https://twitter.com/ExcelToQuiz",
                "https://facebook.com/ExcelToQuiz",
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Bengali", "Hindi"],
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
