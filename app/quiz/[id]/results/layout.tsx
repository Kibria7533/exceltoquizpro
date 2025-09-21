import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Quiz Results - ExcelToQuiz",
  description: "View your quiz results with detailed score breakdown and correct answers. See your performance analysis.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Quiz Results - ExcelToQuiz",
            "description": "Detailed quiz results and performance analysis page",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/quiz/results`,
            "isPartOf": {
              "@type": "WebSite",
              "name": "ExcelToQuiz",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
            },
            "about": {
              "@type": "Quiz",
              "name": "Interactive Multilingual Quiz",
              "provider": {
                "@type": "Organization",
                "name": "ExcelToQuiz"
              }
            }
          })
        }}
      />
      {children}
    </>
  );
}