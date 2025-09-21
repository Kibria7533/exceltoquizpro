
'use client';

import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Abstract%20digital%20pattern%20with%20multilingual%20text%20elements%2C%20quiz%20icons%2C%20educational%20symbols%2C%20modern%20geometric%20design%20with%20flowing%20lines%20and%20vibrant%20colors%20representing%20global%20learning&width=1920&height=800&seq=cta-bg&orientation=landscape')`
        }}
      ></div>
      
      {/* Top gradient blend with hero */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-600 to-transparent"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8">
            Ready to Create Your First Quiz?
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of educators who trust ExcelToQuiz for their multilingual quiz creation needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-2xl">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">∞</div>
            <div className="text-base sm:text-lg text-blue-200 font-semibold mb-2">Unlimited Quizzes</div>
            <div className="text-sm text-blue-300">Create as many as you need</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-2xl">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">50+</div>
            <div className="text-base sm:text-lg text-blue-200 font-semibold mb-2">Languages</div>
            <div className="text-sm text-blue-300">Including Bangla & Hindi</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-2xl">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">$0</div>
            <div className="text-base sm:text-lg text-blue-200 font-semibold mb-2">Forever</div>
            <div className="text-sm text-blue-300">No hidden costs ever</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-2xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-flashlight-line text-2xl sm:text-3xl text-yellow-900"></i>
            </div>
            <div className="text-base sm:text-lg text-blue-200 font-semibold mb-2">Instant Setup</div>
            <div className="text-sm text-blue-300">Upload Excel, get quiz</div>
          </div>
        </div>
      </div>
    </section>
  );
}
