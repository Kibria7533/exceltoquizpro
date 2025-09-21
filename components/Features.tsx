
'use client';

export default function Features() {
  const features = [
    {
      icon: 'ri-upload-cloud-2-line',
      title: 'Drag & Drop Upload',
      description: 'Simply drag your Excel file and watch it transform into an interactive quiz within seconds.',
      image: 'Modern file upload interface with drag and drop functionality, showing Excel file being uploaded with progress indicator, clean minimal design with upload icons and success animations'
    },
    {
      icon: 'ri-global-line',
      title: 'Multilingual Support',
      description: 'Full Unicode support for Bangla, Hindi, English, and 50+ languages with proper character encoding.',
      image: 'Multilingual quiz interface displaying questions in Bengali, Hindi and English scripts side by side, colorful language flags, diverse typography showing proper Unicode rendering'
    },
    {
      icon: 'ri-settings-4-line',
      title: 'Smart Configuration',
      description: 'Automatic language detection and intelligent quiz settings based on your content and preferences.',
      image: 'Quiz configuration dashboard with smart settings panel, automatic language detection interface, toggle switches for time limits and question randomization, modern UI controls'
    },
    {
      icon: 'ri-trophy-line',
      title: 'Live Leaderboards',
      description: 'Real-time ranking system with detailed analytics and performance tracking for all participants.',
      image: 'Live leaderboard interface showing participant rankings with scores, progress bars, real-time updates, competitive gaming style design with medals and achievement badges'
    },
    {
      icon: 'ri-share-forward-line',
      title: 'Instant Sharing',
      description: 'Generate shareable quiz links instantly and track participant engagement in real-time.',
      image: 'Quiz sharing interface with generated link, QR code, social media sharing buttons, participant tracking dashboard with engagement metrics and analytics'
    },
    {
      icon: 'ri-gift-line',
      title: 'Completely Free',
      description: 'No subscriptions, no hidden fees, no limits. Create unlimited quizzes forever at zero cost.',
      image: 'Free forever badge with unlimited symbols, no credit card required message, open source friendly design with gift boxes and celebration elements'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
            Why Choose ExcelToQuiz?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Focus on one thing and do it perfectly. Upload Excel, get quiz. 
            Simple, powerful, and completely free forever.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="mb-6">
                <img 
                  src={`https://readdy.ai/api/search-image?query=$%7Bfeature.image%7D&width=400&height=300&seq=feature-${index + 1}&orientation=landscape`}
                  alt={feature.title}
                  className="w-full h-48 sm:h-56 object-cover rounded-xl sm:rounded-2xl"
                />
              </div>
              
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className={`${feature.icon} text-xl sm:text-2xl text-white`}></i>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                {feature.title}
              </h3>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
