import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create Account - ExcelToQuiz",
  description: "Create your free ExcelToQuiz account to start making multilingual quizzes from Excel files. No credit card required.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupLayout({
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
            "name": "Create Account - ExcelToQuiz",
            "description": "User registration page for creating free ExcelToQuiz account",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/signup`,
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
                  "name": "Create Account",
                  "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/signup`
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