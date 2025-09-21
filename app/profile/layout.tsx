import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Profile Settings - ExcelToQuiz",
  description: "Manage your ExcelToQuiz profile settings, account preferences, and security options.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({
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
            "name": "Profile Settings - ExcelToQuiz",
            "description": "User profile management page for ExcelToQuiz account settings",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/profile`,
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
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Profile",
                  "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/profile`
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