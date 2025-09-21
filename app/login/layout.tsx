import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign In - ExcelToQuiz",
  description: "Sign in to your ExcelToQuiz account to create and manage multilingual quizzes from Excel files.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
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
            "name": "Sign In - ExcelToQuiz",
            "description": "User authentication page for accessing ExcelToQuiz dashboard",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/login`,
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
                  "name": "Sign In",
                  "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/login`
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