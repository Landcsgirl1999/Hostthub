'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Hide header on dashboard pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="relative bg-white/80 backdrop-blur-md border-b border-white/20 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">HostItHub.com</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
              Pricing
            </Link>
            <Link href="/demo" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
              Demo
            </Link>
            <Link href="/consultation" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
              Consultation
            </Link>
            <Link href="/help" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
              Help Center
            </Link>
          </nav>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/sign-in"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/pricing" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/demo" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Demo
              </Link>
              <Link 
                href="/consultation" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Consultation
              </Link>
              <Link 
                href="/help" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Help Center
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link
                  href="/sign-in"
                  className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function Footer() {
  const pathname = usePathname();
  
  // Hide footer on dashboard pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900">HostItHub</span>
            </div>
            <p className="text-gray-600 text-sm">
              The complete AI platform for vacation rental success.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/pricing" className="hover:text-blue-600">Pricing</Link></li>
              <li><Link href="/demo" className="hover:text-blue-600">Demo</Link></li>
              <li><Link href="/help" className="hover:text-blue-600">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/consultation" className="hover:text-blue-600">Consultation</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600">Contact Us</Link></li>
              <li><Link href="/help" className="hover:text-blue-600">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
              <li><Link href="/careers" className="hover:text-blue-600">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © 2025 HostItHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      
      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {children}
      </main>

      <Footer />
    </>
  );
} 