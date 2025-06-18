import React from 'react';
import { useNavigate } from 'react-router-dom';

const MarketingHomepage = () => {
  const navigate = useNavigate();

  const handleEnterApp = () => {
    navigate('/app');
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-axisBlue font-inter">AxisRecon</span>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-axisBlue transition-colors duration-200"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-axisBlue transition-colors duration-200"
              >
                Features
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleEnterApp}
                className="hidden sm:inline-block px-4 py-2 text-axisBlue border border-axisBlue rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Log In
              </button>
              <button
                onClick={handleEnterApp}
                className="px-4 py-2 bg-axisYellow text-axisBlue rounded-md hover:bg-yellow-400 transition-colors duration-200 font-bold"
              >
                Try Demo
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-axisBlue via-blue-700 to-blue-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-inter mb-6">
                AxisRecon
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 font-medium mb-6">
                Reconstruct with Confidence
              </p>
              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                Currently in development - Professional crash reconstruction software suite being built for legal and insurance professionals. 
                Our goal is to deliver accurate, reliable tools that empower professionals to analyze vehicle incidents with confidence and precision.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleEnterApp}
                  className="px-8 py-4 bg-axisYellow text-axisBlue font-bold rounded-lg hover:bg-yellow-400 transition-colors duration-200 text-lg"
                >
                  Try Demo
                </button>
                <button
                  disabled
                  className="px-8 py-4 bg-gray-100 text-gray-400 font-bold rounded-lg cursor-not-allowed text-lg border border-gray-300"
                >
                  Log In
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors duration-200 text-lg"
                >
                  See How It Works ↓
                </button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 shadow-2xl">
                {/* Professional diagram placeholder */}
                <svg className="w-full h-auto" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid background */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="400" height="300" fill="url(#grid)" />
                  
                  {/* Center point with crosshairs */}
                  <circle cx="200" cy="150" r="40" fill="rgba(251, 191, 36, 0.8)" />
                  <circle cx="200" cy="150" r="30" fill="rgba(30, 58, 138, 0.6)" />
                  <circle cx="200" cy="150" r="8" fill="white" />
                  
                  {/* Crosshair lines */}
                  <line x1="170" y1="150" x2="230" y2="150" stroke="white" strokeWidth="2" />
                  <line x1="200" y1="120" x2="200" y2="180" stroke="white" strokeWidth="2" />
                  
                  {/* Vector arrow */}
                  <path d="M200,150 L280,70" stroke="white" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  
                  {/* Arrow marker */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="white" />
                    </marker>
                  </defs>
                  
                  {/* Measurement annotations */}
                  <text x="300" y="60" fill="white" fontSize="12" fontFamily="Inter">v = 45.2 mph</text>
                  <text x="50" y="280" fill="white" fontSize="12" fontFamily="Inter">Δt = 2.1s</text>
                </svg>
              </div>
              
              {/* Floating calculation badge */}
              <div className="absolute -bottom-6 -right-6 bg-axisYellow p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-axisBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-axisBlue font-bold text-sm">Precise Calculations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom accent */}
        <div className="h-6 bg-axisYellow"></div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center font-inter text-axisBlue mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-axisBlue text-white text-2xl font-bold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold font-inter text-axisBlue mb-4 text-center">
                Choose Formula
              </h3>
              <p className="text-gray-700 text-center mb-6">
                Built-in reconstruction formulas, no more Excel templates or paper worksheets.
              </p>
              
              {/* Mini interface mockup */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="space-y-2">
                  <div className="h-8 bg-axisBlue/10 rounded flex items-center px-3 border border-axisBlue/20">
                    <span className="text-xs text-axisBlue font-medium">Speed & Velocity Formulas</span>
                  </div>
                  <div className="h-6 bg-gray-100 rounded flex items-center px-3">
                    <span className="text-xs text-gray-600">Time-Distance Analysis</span>
                  </div>
                  <div className="h-6 bg-gray-100 rounded flex items-center px-3">
                    <span className="text-xs text-gray-600">Drag Factor Calculations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-axisBlue text-white text-2xl font-bold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold font-inter text-axisBlue mb-4 text-center">
                Enter Data
              </h3>
              <p className="text-gray-700 text-center mb-6">
                Simple forms guide you through calculations while showing each step of the math.
              </p>
              
              {/* Mini calculation mockup */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Speed (mph)</span>
                    <span className="text-xs font-medium text-axisBlue bg-axisBlue/10 px-2 py-1 rounded">55</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="text-xs text-gray-600">
                    <div>Result: 55 mph = 80.63 fps</div>
                    <div className="text-gray-500 mt-1">Formula: mph × 1.466 = fps</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-axisBlue text-white text-2xl font-bold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold font-inter text-axisBlue mb-4 text-center">
                Export Report
              </h3>
              <p className="text-gray-700 text-center mb-6">
                Generate professional PDF with inputs, math steps, and case information.
              </p>
              
              {/* Mini report mockup */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative">
                  <div className="bg-gray-50 rounded p-3 border border-gray-200">
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-axisYellow/20 rounded mt-2 w-1/2"></div>
                  </div>
                  <div className="absolute top-0 right-0 bg-gray-200 w-3 h-full rounded-r transform rotate-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center font-inter text-axisBlue mb-12">
            Why Choose AxisRecon?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Built for Professionals */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-axisBlue mb-6 font-inter">
                Built for Professionals
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-axisBlue mt-0.5">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">Designed for crash reconstruction specialists</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-axisBlue mt-0.5">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">Industry-standard formulas and methodologies</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-axisBlue mt-0.5">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">Professional documentation standards</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-axisBlue mt-0.5">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">Transparent calculation steps</p>
                </div>
              </div>
            </div>

            {/* Efficient & Reliable */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-axisBlue mb-6 font-inter">
                Efficient & Reliable
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-axisBlue mt-0.5">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">Instant PDF report generation <span className="text-axisYellow font-semibold">(coming soon)</span></p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-axisBlue mt-0.5">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">Mobile and desktop support</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-axisBlue mt-0.5">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">Browser-based - no installs needed</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-axisBlue mt-0.5">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">EDR analysis and visualization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Preview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center font-inter text-axisBlue mb-12">
            Professional Reconstruction Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick Calculations */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-lg shadow-sm border border-gray-200 mx-auto mb-4">
                <svg className="w-8 h-8 text-axisBlue" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="7" y="8" width="3" height="3" fill="currentColor"/>
                  <rect x="7" y="13" width="3" height="3" fill="currentColor"/>
                  <rect x="14" y="8" width="3" height="3" fill="currentColor"/>
                  <rect x="14" y="13" width="3" height="3" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-inter">
                Quick Calculations
              </h3>
              <p className="text-gray-600 text-sm">
                Access individual crash reconstruction formulas for quick calculations
              </p>
            </div>

            {/* Reconstruction Report */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-lg shadow-sm border border-gray-200 mx-auto mb-4">
                <svg className="w-8 h-8 text-axisBlue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                  <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4"/>
                  <path d="M3 10h18"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-inter">
                Reconstruction Report
              </h3>
              <p className="text-gray-600 text-sm">
                Comprehensive crash analysis with detailed reporting and PDF export
              </p>
            </div>

            {/* EDR Analysis */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-lg shadow-sm border border-gray-200 mx-auto mb-4">
                <svg className="w-8 h-8 text-axisBlue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-inter">
                EDR Analysis
              </h3>
              <p className="text-gray-600 text-sm">
                Event Data Recorder speed and distance analysis for crash reconstruction
              </p>
            </div>

            {/* Preferred Formulas */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-lg shadow-sm border border-gray-200 mx-auto mb-4">
                <svg className="w-8 h-8 text-axisBlue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-inter">
                Preferred Formulas
              </h3>
              <p className="text-gray-600 text-sm">
                Quick access to your saved favorite formulas and common calculations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-axisBlue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-inter mb-6">
            Ready to Reconstruct with Confidence?
          </h2>
          <p className="text-xl mb-8 text-blue-100 leading-relaxed">
            Join crash reconstruction professionals who trust AxisRecon for accurate calculations and professional documentation.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <button
              onClick={handleEnterApp}
              className="px-8 py-4 bg-axisYellow text-axisBlue font-bold rounded-lg hover:bg-yellow-400 transition-colors duration-200 text-lg"
            >
              Get Started - Try Demo
            </button>
            <button
              onClick={handleEnterApp}
              className="px-8 py-4 bg-white text-axisBlue font-bold rounded-lg hover:bg-gray-50 transition-colors duration-200 text-lg"
            >
              Log In
            </button>
            <button
              onClick={handleEnterApp}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors duration-200 text-lg"
            >
              Request Access
            </button>
          </div>
          
          <p className="text-blue-200 text-sm">
            No credit card required • Professional-grade tools • Instant access
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 text-axisYellow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2v20"/>
                  <path d="M2 12h20"/>
                </svg>
                <span className="ml-2 text-xl font-bold text-white font-inter">AxisRecon</span>
              </div>
              <p className="text-gray-300 mb-4">Reconstruct with Confidence</p>
              <p className="text-gray-400 text-sm">
                Professional crash reconstruction software for legal and insurance professionals.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-lg font-bold mb-4 font-inter">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
                <li><button onClick={handleEnterApp} className="hover:text-white transition-colors">Documentation</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-bold mb-4 font-inter">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-bold mb-4 font-inter">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 AxisRecon. All rights reserved. | Built for crash reconstruction professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingHomepage;