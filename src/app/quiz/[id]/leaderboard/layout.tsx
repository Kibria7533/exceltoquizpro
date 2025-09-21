import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Quiz Leaderboard - ExcelToQuiz",
  description: "View quiz leaderboard with top performers and scores. See how you rank against other participants.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function LeaderboardLayout({
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
            "name": "Quiz Leaderboard - ExcelToQuiz",
            "description": "Real-time leaderboard showing quiz performance and rankings",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/quiz/leaderboard`,
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