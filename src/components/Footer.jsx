import { Link } from 'react-router-dom'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'
import logo from '../assets/logo.png'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-terracotta-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} alt="Genesi" className="h-10 w-auto" />
              <span className="font-serif text-xl font-semibold text-gray-800">
                Genesi
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Empowering Zimbabwean women on their fertility journey through 
              knowledge, nutrition, and the courage to seek help.
            </p>
            <div className="flex items-center space-x-2 text-terracotta-500">
              <Heart className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">Made with love by KarenRumbie</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-500 hover:text-terracotta-600 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/fertility-check" className="text-gray-500 hover:text-terracotta-600 transition-colors text-sm">
                  Fertility Check
                </Link>
              </li>
              <li>
                <Link to="/fertility-log" className="text-gray-500 hover:text-terracotta-600 transition-colors text-sm">
                  My Fertility Log
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-gray-500 hover:text-terracotta-600 transition-colors text-sm">
                  Educational Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-500 text-sm">Zimbabwean Fertility Foods</span>
              </li>
              <li>
                <span className="text-gray-500 text-sm">African Herbs Guide</span>
              </li>
              <li>
                <span className="text-gray-500 text-sm">Meal Plans</span>
              </li>
              <li>
                <span className="text-gray-500 text-sm">Medical Interventions</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-500 text-sm">
                <Mail className="w-4 h-4 text-terracotta-500" />
                <span>hello@karenrumbie.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-500 text-sm">
                <Phone className="w-4 h-4 text-terracotta-500" />
                <span>+263 77 123 4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-500 text-sm">
                <MapPin className="w-4 h-4 text-terracotta-500" />
                <span>Harare, Zimbabwe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Genesi. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs text-center md:text-right max-w-md">
              Disclaimer: Genesi provides educational information only. Always consult 
              a qualified healthcare professional before making medical decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
