
'use client';

import Link from 'next/link';

export default function CareersPage() {
  const openPositions = [
    {
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'We are looking for a skilled Frontend Developer to join our team and help build the next generation of quiz creation tools.',
      requirements: [
        '5+ years of React/Next.js experience',
        'Strong TypeScript skills',
        'Experience with modern CSS frameworks',
        'Knowledge of responsive design principles'
      ]
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead product strategy and roadmap for ExcelToQuiz platform, working closely with engineering and design teams.',
      requirements: [
        '3+ years of product management experience',
        'Experience with B2B SaaS products',
        'Strong analytical and communication skills',
        'Understanding of educational technology'
      ]
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help our users get the most out of ExcelToQuiz by providing exceptional support and building lasting relationships.',
      requirements: [
        '2+ years in customer success or support',
        'Excellent communication skills',
        'Experience with educational tools',
        'Problem-solving mindset'
      ]
    }
  ];

  const benefits = [
    {
      icon: 'ri-home-office-line',
      title: 'Remote First',
      description: 'Work from anywhere in the world with flexible hours'
    },
    {
      icon: 'ri-heart-pulse-line',
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance and wellness programs'
    },
    {
      icon: 'ri-graduation-cap-line',
      title: 'Learning & Development',
      description: 'Annual learning budget and conference attendance'
    },
    {
      icon: 'ri-calendar-check-line',
      title: 'Unlimited PTO',
      description: 'Take time off when you need it with unlimited vacation'
    },
    {
      icon: 'ri-team-line',
      title: 'Amazing Team',
      description: 'Work with passionate people who care about education'
    },
    {
      icon: 'ri-rocket-line',
      title: 'Growth Opportunities',
      description: 'Fast-growing company with lots of room for advancement'
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
      <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 py-16 sm:py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Join Our Mission
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Help us transform how people create and share knowledge through interactive quizzes. 
            Build the future of education technology with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#open-positions"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
            >
              <i className="ri-briefcase-line mr-2"></i>
              View Open Positions
            </a>
            <Link
              href="/contact"
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
            >
              <i className="ri-question-answer-line mr-2"></i>
              Have Questions?
            </Link>
          </div>
        </div>
      </div>

      {/* Company Values */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Why Work at ExcelToQuiz?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're building something special - a platform that makes learning more engaging and accessible for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className={`${benefit.icon} text-xl text-blue-600`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div id="open-positions" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-gray-600">
              Join our growing team and help shape the future of quiz creation
            </p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        {position.department}
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        {position.location}
                      </span>
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
                  >
                    <i className="ri-mail-send-line mr-2"></i>
                    Apply Now
                  </Link>
                </div>

                <p className="text-gray-600 mb-6">{position.description}</p>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {position.requirements.map((requirement, reqIndex) => (
                      <li key={reqIndex} className="flex items-start">
                        <i className="ri-check-line text-green-600 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span className="text-gray-600">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* No Perfect Match */}
          <div className="mt-12 text-center bg-blue-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Don't see a perfect match?
            </h3>
            <p className="text-gray-600 mb-6">
              We're always looking for talented people to join our team. Send us your resume and tell us how you'd like to contribute.
            </p>
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
            >
              <i className="ri-user-star-line mr-2"></i>
              Send Your Resume
            </Link>
          </div>
        </div>
      </div>

      {/* Culture */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                Our Culture & Values
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-lightbulb-line text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Innovation First</h3>
                    <p className="text-gray-600">We encourage creative thinking and aren't afraid to try new approaches to solve problems.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-team-line text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Collaboration</h3>
                    <p className="text-gray-600">We believe the best ideas come from working together and building on each other's strengths.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-focus-3-line text-purple-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">User-Centric</h3>
                    <p className="text-gray-600">Every decision we make is guided by what's best for our users and their learning experience.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-arrow-up-line text-orange-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Continuous Growth</h3>
                    <p className="text-gray-600">We're committed to learning, improving, and helping each team member reach their potential.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=Diverse%20team%20of%20professionals%20working%20collaboratively%20in%20a%20modern%20office%20environment%2C%20smiling%20and%20engaged%20in%20productive%20discussions%20around%20computers%20and%20whiteboards%2C%20natural%20lighting%2C%20contemporary%20workspace%20design&width=600&height=400&seq=careers-culture&orientation=landscape"
                alt="Team collaboration"
                className="rounded-2xl shadow-lg object-cover w-full h-80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join us in revolutionizing how people create and share knowledge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#open-positions"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
            >
              <i className="ri-search-eye-line mr-2"></i>
              Browse Jobs
            </a>
            <Link
              href="/contact"
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
            >
              <i className="ri-chat-3-line mr-2"></i>
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
