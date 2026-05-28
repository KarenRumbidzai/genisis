import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Menu, 
  X, 
  Heart, 
  BookOpen, 
  ClipboardList, 
  Home, 
  User, 
  LogIn,
  Utensils,
  Calendar,
  ChevronDown
} from 'lucide-react'
import logo from '../assets/logo.png'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const { user, profile, signOut } = useAuth()

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/fertility-check', label: 'Fertility Check', icon: Heart },
    { path: '/education', label: 'Learn', icon: BookOpen },
    { path: '/meal-plans', label: 'Meal Plans', icon: Utensils },
  ]

  // Protected links - only show if logged in
  const protectedLinks = [
    { path: '/fertility-log', label: 'My Log', icon: ClipboardList },
    { path: '/ovulation-tracker', label: 'Ovulation', icon: Calendar },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-terracotta-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={logo} 
              alt="Genesi" 
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-serif text-2xl font-semibold text-gray-800 hidden sm:block">
              Genesi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link flex items-center space-x-2 ${
                    isActive(link.path) ? 'nav-link-active' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}

            {/* Protected Links */}
            {user && protectedLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link flex items-center space-x-2 ${
                    isActive(link.path) ? 'nav-link-active' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-terracotta-600" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {profile?.name || 'My Account'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <LogIn className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-terracotta-600 font-medium transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-3 px-6">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-terracotta-50 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-terracotta-100">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive(link.path)
                      ? 'bg-terracotta-50 text-terracotta-600'
                      : 'text-gray-600 hover:bg-terracotta-50 hover:text-terracotta-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}

            {/* Protected Links */}
            {user && protectedLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive(link.path)
                      ? 'bg-terracotta-50 text-terracotta-600'
                      : 'text-gray-600 hover:bg-terracotta-50 hover:text-terracotta-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}

            {/* Auth Section */}
            {user ? (
              <>
                <div className="border-t border-gray-100 my-2" />
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors text-left"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-100 my-2" />
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full text-center mt-2 block"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
