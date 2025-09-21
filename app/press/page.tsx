
'use client';

import Link from 'next/link';

export default function PressPage() {
  const pressReleases = [
    {
      date: '2024-03-15',
      title: 'ExcelToQuiz Reaches 10,000 Active Users Milestone',
      excerpt: 'Platform continues rapid growth as educators worldwide embrace Excel-to-quiz conversion technology.',
      category: 'Company News'
    },
    {
      date: '2024-02-28',
      title: 'New Multilingual Support Launches for Hindi and Bengali',
      excerpt: 'ExcelToQuiz expands accessibility with native support for Indian languages, enabling broader educational reach.',
      category: 'Product Update'
    },
    {
      date: '2024-01-20',
      title: 'ExcelToQuiz Announces Partnership with Educational Institutions',
      excerpt: 'Strategic partnerships with universities and schools to streamline quiz creation and assessment processes.',
      category: 'Partnership'
    }
  ];

  const mediaKit = [
    {
      type: 'Logo Pack',
      description: 'High-resolution logos in various formats (PNG, SVG, EPS)',
      icon: 'ri-image-line',
      downloadUrl: '#'
    },
    {
      type: 'Brand Guidelines',
      description: 'Complete brand guidelines including colors, typography, and usage rules',
      icon: 'ri-palette-line',
      downloadUrl: '#'
    },
    {
      type: 'Screenshots',
      description: 'High-quality product screenshots and interface images',
      icon: 'ri-screenshot-line',
      downloadUrl: '#'
    },
    {
      type: 'Fact Sheet',
      description: 'Key company information, statistics, and product details',
      icon: 'ri-file-text-line',
      downloadUrl: '#'
    }
  ];

  const awards = [
    {
      year: '2024',
      title: 'Best EdTech Innovation',
      organization: 'Education Technology Awards',
      description: 'Recognized for innovative approach to quiz creation and multilingual support'
    },
    {
      year: '2023',
      title: 'Startup of the Year - Education',
      organization: 'Tech Innovation Summit',
      description: 'Awarded for outstanding contribution to educational technology sector'
    },
    {
      year: '2023',
      title: 'User Choice Award',
      organization: 'Educational Software Review',
      description: 'Top-rated platform by educators for ease of use and functionality'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-['Pacifico'] text-2xl text-blue-600">
              ExcelToQuiz
            </Link>
            <Link 
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <i className="ri-home-line mr-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 sm:py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Press & Media
          </h1>
          <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            Latest news, press releases, and media resources from ExcelToQuiz. 
            Transforming education through innovative quiz creation technology.
          </p>
          <Link
            href="/contact"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
          >
            <i className="ri-contacts-book-line mr-2"></i>
            Media Inquiries
          </Link>
        </div>
      </div>

      {/* Company Overview */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                About ExcelToQuiz
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  ExcelToQuiz is a revolutionary platform that transforms Excel spreadsheets into interactive, 
                  multilingual quizzes in minutes. Founded in 2023, we're democratizing quiz creation for 
                  educators, trainers, and organizations worldwide.
                </p>
                <p>
                  Our mission is to make learning more engaging and accessible by providing powerful, 
                  yet simple tools that anyone can use. With support for multiple languages including 
                  English, Hindi, and Bengali, we're breaking down barriers in global education.
                </p>
                <p>
                  Today, ExcelToQuiz serves over 10,000 active users across 50+ countries, processing 
                  thousands of quizzes monthly and facilitating interactive learning experiences for 
                  millions of participants.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=Modern%20educational%20technology%20platform%20interface%20showing%20quiz%20creation%20process%2C%20Excel%20spreadsheet%20transformation%20into%20interactive%20quiz%20format%2C%20clean%20professional%20design%20with%20educational%20elements%20and%20multilingual%20text%20examples&width=600&height=400&seq=press-about&orientation=landscape"
                alt="ExcelToQuiz Platform"
                className="rounded-2xl shadow-lg object-cover w-full h-80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              ExcelToQuiz by the Numbers
            </h2>
            <p className="text-lg text-gray-600">
              Key metrics that showcase our impact in educational technology
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">50,000+</div>
              <div className="text-gray-600">Quizzes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">3</div>
              <div className="text-gray-600">Languages Supported</div>
            </div>
          </div>
        </div>
      </div>

      {/* Press Releases */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
            Latest Press Releases
          </h2>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {release.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(release.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{release.title}</h3>
                    <p className="text-gray-600">{release.excerpt}</p>
                  </div>
                  <Link
                    href="/contact"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
                  >
                    <i className="ri-article-line mr-2"></i>
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Awards & Recognition */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Awards & Recognition
            </h2>
            <p className="text-lg text-gray-600">
              Industry recognition for our innovation in educational technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-trophy-line text-2xl text-yellow-600"></i>
                </div>
                <div className="text-lg font-bold text-gray-800 mb-1">{award.title}</div>
                <div className="text-blue-600 font-semibold mb-2">{award.organization}</div>
                <div className="text-sm text-gray-500 mb-3">{award.year}</div>
                <p className="text-gray-600 text-sm">{award.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Media Kit */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Media Kit & Resources
            </h2>
            <p className="text-lg text-gray-600">
              Download logos, images, and brand materials for media coverage
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaKit.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className={`${item.icon} text-xl text-blue-600`}></i>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.type}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <a
                  href={item.downloadUrl}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
                >
                  <i className="ri-download-line mr-2"></i>
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Media Inquiries
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            For interviews, product demos, or additional information, please contact our press team
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-700 rounded-xl p-6">
              <i className="ri-mail-line text-2xl text-white mb-3"></i>
              <div className="text-white font-semibold mb-1">Press Contact</div>
              <a href="mailto:press@excelquiz.com" className="text-blue-100 hover:text-white transition-colors cursor-pointer">
                press@excelquiz.com
              </a>
            </div>
            <div className="bg-purple-700 rounded-xl p-6">
              <i className="ri-phone-line text-2xl text-white mb-3"></i>
              <div className="text-white font-semibold mb-1">Phone</div>
              <span className="text-purple-100">Available upon request</span>
            </div>
          </div>

          <Link
            href="/contact"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
          >
            <i className="ri-chat-3-line mr-2"></i>
            Contact Press Team
          </Link>
        </div>
      </div>
    </div>
  );
}
