import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Take Quiz - ExcelToQuiz",
  description: "Take an interactive multilingual quiz created from Excel files. Test your knowledge and compete on the leaderboard.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function QuizLayout({
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
            "@type": "Quiz",
            "name": "Interactive Multilingual Quiz",
            "description": "Take an interactive quiz created from Excel files with multilingual support",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/quiz`,
            "educationalLevel": "All Levels",
            "inLanguage": ["en", "bn", "hi"],
            "learningResourceType": "Quiz",
            "isPartOf": {
              "@type": "WebSite",
              "name": "ExcelToQuiz",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
            },
            "provider": {
              "@type": "Organization",
              "name": "ExcelToQuiz"
            }
          })
        }}
      />
      {children}
    </>
  );
}