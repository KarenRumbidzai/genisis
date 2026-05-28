import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import FertilityCheck from './pages/FertilityCheck'
import FertilityLog from './pages/FertilityLog'
import Education from './pages/Education'
import Results from './pages/Results'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import MealPlans from './pages/MealPlans'
import OvulationTracker from './pages/OvulationTracker'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/fertility-check" element={<FertilityCheck />} />
            <Route path="/education" element={<Education />} />
            <Route path="/results" element={<Results />} />
            <Route path="/meal-plans" element={<MealPlans />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes - Require Authentication */}
            <Route 
              path="/fertility-log" 
              element={
                <ProtectedRoute>
                  <FertilityLog />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ovulation-tracker" 
              element={
                <ProtectedRoute>
                  <OvulationTracker />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
