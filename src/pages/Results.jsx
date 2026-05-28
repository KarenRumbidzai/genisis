import { useLocation, Link } from 'react-router-dom'
import { 
  Heart, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Calendar,
  Utensils,
  Stethoscope,
  Download,
  Share2,
  RefreshCw,
  User,
  Clock,
  ChevronRight
} from 'lucide-react'

function Results() {
  const location = useLocation()
  const results = location.state?.results

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="font-serif text-2xl text-gray-800 mb-4">No Results Found</h2>
          <p className="text-gray-500 mb-8">Please complete the fertility assessment first.</p>
          <Link to="/fertility-check" className="btn-primary inline-flex items-center space-x-2">
            <span>Start Assessment</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  const { 
    primary, 
    secondary, 
    confidence, 
    urgency, 
    recommendations, 
    personalizedAdvice,
    recommendedMealPlan,
    formData 
  } = results

  const urgencyConfig = {
    high: {
      color: 'bg-red-50 border-red-200 text-red-700',
      icon: AlertTriangle,
      title: 'High Priority',
      message: 'We strongly recommend seeing a specialist soon. Your symptoms and history suggest it\'s time for professional guidance.'
    },
    medium: {
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: Info,
      title: 'Medium Priority',
      message: 'Monitor your symptoms and consider scheduling a consultation with a gynaecologist.'
    },
    low: {
      color: 'bg-green-50 border-green-200 text-green-700',
      icon: CheckCircle,
      title: 'Low Priority',
      message: 'Focus on lifestyle improvements for now. Keep tracking and maintain healthy habits.'
    }
  }

  const UrgencyIcon = urgencyConfig[urgency].icon

  return (
    <div className="min-h-screen bg-gradient-warm py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta-100 rounded-2xl mb-6">
            <Heart className="w-8 h-8 text-terracotta-600" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-4">
            Your Fertility Insights
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Based on your responses, here are some areas that may need attention. 
            Remember, knowledge is the first step toward action.
          </p>
        </div>

        {/* Empathy Message */}
        <div className="card p-8 mb-8 text-center">
          <p className="font-serif text-xl md:text-2xl text-gray-700 italic leading-relaxed">
            "Based on what you've shared, your body may be showing signs that need attention. 
            You're not alone in this. Many women walk this path and find their way to motherhood."
          </p>
        </div>

        {/* Urgency Alert */}
        <div className={`p-6 rounded-3xl border-2 mb-8 ${urgencyConfig[urgency].color}`}>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center flex-shrink-0">
              <UrgencyIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{urgencyConfig[urgency].title}</h3>
              <p className="opacity-90">{urgencyConfig[urgency].message}</p>
            </div>
          </div>
        </div>

        {/* Primary & Secondary Insights */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-8 border-l-4 border-l-terracotta-500">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-terracotta-100 rounded-xl flex items-center justify-center">
                <span className="text-terracotta-600 font-bold">1</span>
              </div>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Primary Focus</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{primary}</h3>
            <p className="text-gray-500 text-sm">
              Your symptoms most strongly suggest this area may need attention.
            </p>
          </div>

          <div className="card p-8 border-l-4 border-l-plum-500">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-plum-100 rounded-xl flex items-center justify-center">
                <span className="text-plum-600 font-bold">2</span>
              </div>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Secondary Focus</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{secondary}</h3>
            <p className="text-gray-500 text-sm">
              There are also signs that could be linked to this area.
            </p>
          </div>
        </div>

        {/* Personalized Advice */}
        {personalizedAdvice && personalizedAdvice.length > 0 && (
          <div className="card p-8 mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <User className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">Personalized for You</h3>
            </div>
            <div className="space-y-4">
              {personalizedAdvice.map((advice, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{advice}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Level */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Assessment Confidence</p>
              <p className="font-semibold text-gray-800 capitalize">{confidence} Confidence</p>
            </div>
            <div className="flex space-x-1">
              {['low', 'moderate', 'high'].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-full ${
                    level === confidence || 
                    (confidence === 'high' && ['low', 'moderate', 'high'].includes(level)) ||
                    (confidence === 'moderate' && ['low', 'moderate'].includes(level))
                      ? 'bg-terracotta-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-forest-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">What You Can Do Now</h3>
          </div>
          
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-8 h-8 bg-terracotta-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-terracotta-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Meal Plan */}
        {recommendedMealPlan && (
          <div className="card p-8 mb-8 bg-gradient-to-br from-terracotta-50 to-plum-50 border-terracotta-100">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Utensils className="w-6 h-6 text-terracotta-600" />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Recommended Meal Plan</h3>
                <p className="text-terracotta-600 font-medium mb-2">{recommendedMealPlan.name}</p>
                <p className="text-gray-600 mb-4">{recommendedMealPlan.description}</p>
                <Link 
                  to="/meal-plans" 
                  state={{ recommendedPlan: recommendedMealPlan }}
                  className="inline-flex items-center text-terracotta-600 font-medium hover:text-terracotta-700"
                >
                  <span>View Full Meal Plan</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/fertility-log" className="card card-hover p-6 text-center">
            <div className="w-12 h-12 bg-terracotta-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-terracotta-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Track Your Cycle</h4>
            <p className="text-gray-500 text-sm">Start logging your symptoms daily</p>
          </Link>

          <Link to="/education" className="card card-hover p-6 text-center">
            <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-6 h-6 text-forest-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Fertility Foods</h4>
            <p className="text-gray-500 text-sm">Learn about Zimbabwean nutrition</p>
          </Link>

          <Link to="/meal-plans" className="card card-hover p-6 text-center">
            <div className="w-12 h-12 bg-plum-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-6 h-6 text-plum-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Meal Plans</h4>
            <p className="text-gray-500 text-sm">Get your personalized nutrition plan</p>
          </Link>
        </div>

        {/* Medical Guidance */}
        <div className="card p-8 mb-8 bg-gradient-to-br from-plum-50 to-terracotta-50 border-plum-100">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Stethoscope className="w-6 h-6 text-plum-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Medical Guidance</h3>
              <p className="text-gray-600 mb-4">
                Because of your symptoms and how long you've been trying, it would be wise to 
                consult a gynaecologist. They can provide proper testing and a personalized treatment plan.
              </p>
              <div className="bg-white/70 rounded-xl p-4">
                <p className="text-sm text-gray-600 font-medium mb-2">Questions to ask your doctor:</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• What tests do I need to understand my fertility?</li>
                  <li>• What is my AMH level and how many follicles do I have?</li>
                  <li>• Are there lifestyle changes that could help?</li>
                  <li>• What are my treatment options?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* TODO: wire up Save Results — generate a PDF or save to profile */}
        {/* TODO: Share with Partner — maybe a shareable link or email? */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Save Results</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Share with Partner</span>
          </button>
          <Link to="/fertility-check" className="btn-primary flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5" />
            <span>Retake Assessment</span>
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400 max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> This assessment is for educational purposes only and does not 
            constitute medical advice, diagnosis, or treatment. Always seek the advice of your physician 
            or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Results
