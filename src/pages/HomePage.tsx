import receivepayment from "../assets/Certificate of Occupancy.jpg"
import fastprocessing from "../assets/Fast document processing.jpg"
import security from "../assets/Document security protection.jpg"
import easyapplication from "../assets/Online form submission1.jpg"
import makepayment from "../assets/A secure online payment illustration.jpg"
import happy from '../assets/Happy business professional portrait.jpg';
import hero from "../assets/professional real estate signing.jpg"
import account from "../assets/A person signing up online.jpg"
import payment from "../assets/Online form submission.jpg"
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaClock, FaLock, FaMobileAlt, FaArrowRight } from 'react-icons/fa';

export default function HomePage() {
  const navigate = useNavigate();
 

  return (
    <div className="bg-gov-light min-h-screen">
      {/* Government Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white sticky top-0 z-50 shadow-gov-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
              GO
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold truncate">Government Land Portal</h1>
              <p className="text-xs opacity-90 hidden sm:block">Certificate of Occupancy System</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <a href="#features" className="hover:text-accent transition-colors">Features</a>
            <a href="#process" className="hover:text-accent transition-colors">Process</a>
            <a href="#testimonials" className="hover:text-accent transition-colors">Testimonials</a>
          </nav>
          <button 
            onClick={() => navigate('/auth')}
            className="gov-button bg-accent hover:bg-red-600 px-3 sm:px-6 py-2 text-xs sm:text-sm whitespace-nowrap"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary text-white relative overflow-hidden py-12 sm:py-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 sm:opacity-100"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 sm:opacity-100"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-3 sm:mb-4 inline-block bg-accent/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                <span className="text-accent font-semibold text-xs sm:text-sm">Official Government Service</span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Get Your Certificate Online
              </h2>
              <p className="text-base sm:text-xl opacity-90 mb-6 sm:mb-8">
                Fast, Secure, and Transparent Land Registration
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={() => navigate('/auth')}
                  className="gov-button bg-accent hover:bg-red-600 inline-flex items-center justify-center space-x-2 text-sm sm:text-lg"
                >
                  <span>Apply Now</span>
                  <FaArrowRight />
                </button>
                <button className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-white text-white rounded-gov hover:bg-white/10 transition-colors font-semibold text-sm sm:text-base">
                  Learn More
                </button>
              </div>
              <p className="text-xs sm:text-sm opacity-75 mt-6 sm:mt-8">✓ 100% Secure • ✓ Government Verified • ✓ 24/7 Support</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden md:block"
            >
              <img 
                src={hero}
                alt="Hero Image" 
                className="rounded-gov shadow-gov-lg w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gov-text mb-2 sm:mb-4">Why Choose Our Platform?</h2>
            <p className="text-sm sm:text-lg text-gov-text-light max-w-2xl mx-auto">
              Trusted by thousands of Nigerians for secure and efficient registration
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <FeatureCard 
              icon={<FaClock className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Fast Processing" 
              description="Get your C of O approved in record time." 
              image={fastprocessing}
              delay={0}
            />
            <FeatureCard 
              icon={<FaLock className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Secure Platform" 
              description="Documents protected with encryption." 
              image={security}
              delay={0.1}
            />
            <FeatureCard 
              icon={<FaMobileAlt className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Easy Application" 
              description="Apply online from anywhere." 
              image={easyapplication}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gov-text mb-2 sm:mb-4">How It Works</h2>
            <p className="text-sm sm:text-lg text-gov-text-light">
              Follow these simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StepCard number="1" title="Create Account" image={account} delay={0} />
            <StepCard number="2" title="Upload Documents" image={payment} delay={0.1} />
            <StepCard number="3" title="Make Payment" image={makepayment} delay={0.2} />
            <StepCard number="4" title="Receive C of O" image={receivepayment} delay={0.3} />
          </div>

          <div className="mt-8 sm:mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary rounded-gov p-4 sm:p-6">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <h3 className="font-bold text-gov-text mb-1 sm:mb-2 text-sm sm:text-base">Government Verified Process</h3>
                <p className="text-xs sm:text-sm text-gov-text-light">
                  Every application goes through rigorous verification by officials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-20 px-4 sm:px-6 bg-gov-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gov-text mb-2 sm:mb-4">What Users Say</h2>
            <p className="text-sm sm:text-lg text-gov-text-light">
              Thousands of satisfied citizens
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <TestimonialCard 
              name="Jane Doe" 
              title="Business Owner"
              feedback="This platform made it incredibly easy to get my C of O!" 
              image={happy}
              rating={5}
            />
            <TestimonialCard 
              name="John Smith" 
              title="Real Estate Agent"
              feedback="Got my certificate faster than expected. Excellent!" 
              image={happy}
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Ready to Get Your Certificate?</h2>
          <p className="text-base sm:text-xl opacity-90 mb-6 sm:mb-8">
            Start the application process today
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="gov-button bg-accent hover:bg-red-600 inline-flex items-center justify-center space-x-2 text-sm sm:text-lg"
          >
            <span>Apply Now</span>
            <FaArrowRight />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 sm:py-12 px-4 sm:px-6 border-t-4 border-accent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">About Us</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Our Mission</a></li>
                <li><a href="#" className="hover:opacity-100">Contact Us</a></li>
                <li><a href="#" className="hover:opacity-100">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Services</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Apply for C of O</a></li>
                <li><a href="#" className="hover:opacity-100">Track Status</a></li>
                <li><a href="#" className="hover:opacity-100">Renewal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Privacy Policy</a></li>
                <li><a href="#" className="hover:opacity-100">Terms of Service</a></li>
                <li><a href="#" className="hover:opacity-100">Disclaimer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Help Center</a></li>
                <li><a href="#" className="hover:opacity-100">Live Chat</a></li>
                <li><a href="#" className="hover:opacity-100">Email Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm opacity-80 mb-2 sm:mb-4">
              © 2025 Government of Nigeria - Land Registration Authority. All Rights Reserved.
            </p>
            <p className="text-xs opacity-60">
              This is an official government service.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, image, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="gov-card p-4 sm:p-6 hover:shadow-gov-lg transition-all duration-300 group cursor-pointer"
    >
      <div className="bg-primary/10 w-12 h-12 sm:w-14 sm:h-14 rounded-gov flex items-center justify-center text-primary mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <img src={image} alt={title} className="w-full h-32 sm:h-40 object-cover rounded-gov mb-3 sm:mb-4" />
      <h3 className="text-lg sm:text-xl font-semibold text-gov-text mb-2">{title}</h3>
      <p className="text-xs sm:text-base text-gov-text-light">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, image, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="gov-card p-4 sm:p-6 text-center group hover:shadow-gov-lg transition-all"
    >
      <div className="mb-3 sm:mb-4 relative inline-block">
        <img src={image} alt={title} className="w-full h-24 sm:h-32 object-cover rounded-gov" />
        <div className="absolute -bottom-3 -right-3 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-gov-lg">
          {number}
        </div>
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gov-text mt-4">{title}</h3>
    </motion.div>
  );
}

function TestimonialCard({ name, title, feedback, image, rating }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="gov-card p-4 sm:p-8 hover:shadow-gov-lg transition-all"
    >
      <div className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
        <img src={image} alt={name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0" />
        <div className="min-w-0">
          <h4 className="font-semibold text-gov-text text-sm sm:text-base truncate">{name}</h4>
          <p className="text-xs sm:text-sm text-gov-text-light truncate">{title}</p>
        </div>
      </div>
      <div className="flex space-x-1 mb-3 sm:mb-4">
        {Array(rating).fill(0).map((_, i) => (
          <span key={i} className="text-accent text-lg">★</span>
        ))}
      </div>
      <p className="text-xs sm:text-base text-gov-text-light italic">{feedback}</p>
    </motion.div>
  );
}

// function TestimonialCard({ name, feedback, image }:any) {
//   return (
//     <div className="p-6 bg-white shadow-lg rounded-lg text-center">
//       <img src={image} alt={name} className="w-20 h-20 rounded-full mx-auto mb-4" />
//       <p className="text-gray-600 italic">"{feedback}"</p>
//       <h4 className="mt-4 font-semibold text-blue-600">- {name}</h4>
//     </div>
//   );
// }
