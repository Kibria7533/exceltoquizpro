import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard - ExcelToQuiz",
  description: "Manage your multilingual quizzes, upload Excel files, and track quiz performance. Create unlimited quizzes with advanced analytics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
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
            "name": "Dashboard - ExcelToQuiz",
            "description": "User dashboard for managing multilingual quizzes and Excel file uploads",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/dashboard`,
            "isPartOf": {
              "@type": "WebSite",
              "name": "ExcelToQuiz",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Dashboard",
                  "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/dashboard`
                }
              ]
            }
          })
        }}
      />
      {children}
    </>
  );
}