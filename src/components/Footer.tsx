
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-800 via-purple-800 to-blue-800 text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="font-['Pacifico'] text-2xl sm:text-3xl text-white mb-3 sm:mb-4">
              ExcelToQuiz
            </h3>
            <p className="text-sm sm:text-base text-blue-100 mb-4 sm:mb-6 leading-relaxed">
              Transform Excel files into interactive multilingual quizzes instantly. 
              Simple, powerful, and free forever.
            </p>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/signup" className="text-sm sm:text-base text-blue-200 hover:text-white transition-colors cursor-pointer">Get Started</Link></li>
              <li><Link href="/login" className="text-sm sm:text-base text-blue-200 hover:text-white transition-colors cursor-pointer">Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm sm:text-base text-blue-200 hover:text-white transition-colors cursor-pointer">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/careers" className="text-sm sm:text-base text-blue-200 hover:text-white transition-colors cursor-pointer">Careers</Link></li>
              <li><Link href="/press" className="text-sm sm:text-base text-blue-200 hover:text-white transition-colors cursor-pointer">Press</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-700/50 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-blue-200">
              <p>&copy; 2024 ExcelToQuiz. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-200">
              <span>Made with</span>
              <i className="ri-heart-fill text-red-400"></i>
              <a href="https://readdy.ai/?origin=logo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">
                Readdy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
