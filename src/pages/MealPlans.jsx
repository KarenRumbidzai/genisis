import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Utensils, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Check,
  Heart,
  Calendar,
  ArrowLeft
} from 'lucide-react'
import { getAllMealPlans, getMealPlanForConcern } from '../data/mealPlans'

const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function MealPlans() {
  const location = useLocation()
  const recommendedPlan = location.state?.recommendedPlan
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [expandedDays, setExpandedDays] = useState({})
  const [savedPlans, setSavedPlans] = useState([])

  useEffect(() => {
    if (recommendedPlan) {
      setSelectedPlan(recommendedPlan)
    }
  }, [recommendedPlan])

  const allPlans = getAllMealPlans()

  const toggleDay = (day) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }))
  }

  const savePlan = (planId) => {
    if (!savedPlans.includes(planId)) {
      setSavedPlans(prev => [...prev, planId])
    }
  }

  const getDayLabel = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <div className="min-h-screen bg-gradient-warm py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta-100 rounded-2xl mb-6">
            <Utensils className="w-8 h-8 text-terracotta-600" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-4">
            Fertility Meal Plans
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Nourish your body with balanced meal plans designed to support your fertility journey. 
            Each plan features Zimbabwean foods and is tailored to specific needs.
          </p>
        </div>

        {/* Recommended Plan Banner */}
        {recommendedPlan && (
          <div className="mb-10 p-6 bg-gradient-to-r from-terracotta-500 to-plum-500 rounded-3xl text-white">
            <div className="flex items-center space-x-3 mb-3">
              <Heart className="w-6 h-6" />
              <span className="font-medium">Recommended for You</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">{recommendedPlan.name}</h2>
            <p className="text-white/80">{recommendedPlan.description}</p>
          </div>
        )}

        {/* Plan Selector */}
        {!recommendedPlan && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose a Meal Plan</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    selectedPlan?.id === plan.id
                      ? 'border-terracotta-400 bg-terracotta-50'
                      : 'border-gray-100 bg-white hover:border-terracotta-200'
                  }`}
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{plan.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Plan Display */}
        {selectedPlan && (
          <div className="card p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{selectedPlan.name}</h2>
                <p className="text-gray-500">{selectedPlan.description}</p>
              </div>
              <button
                onClick={() => savePlan(selectedPlan.id)}
                disabled={savedPlans.includes(selectedPlan.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  savedPlans.includes(selectedPlan.id)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-terracotta-100 text-terracotta-700 hover:bg-terracotta-200'
                }`}
              >
                {savedPlans.includes(selectedPlan.id) ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    <span>Save Plan</span>
                  </>
                )}
              </button>
            </div>

            {/* Weekly Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-terracotta-500" />
                Weekly Schedule
              </h3>

              {daysOfWeek.map((day) => {
                const meals = selectedPlan.meals[day]
                const isExpanded = expandedDays[day]

                return (
                  <div 
                    key={day} 
                    className="border border-gray-100 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleDay(day)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-semibold text-gray-800">{getDayLabel(day)}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 space-y-4">
                        {/* Breakfast */}
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-amber-600 font-semibold text-sm">B</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Breakfast</p>
                            <p className="text-gray-800">{meals.breakfast}</p>
                          </div>
                        </div>

                        {/* Morning Snack */}
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 font-semibold text-sm">S</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Snack</p>
                            <p className="text-gray-800">{meals.snack}</p>
                          </div>
                        </div>

                        {/* Lunch */}
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-terracotta-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-terracotta-600 font-semibold text-sm">L</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Lunch</p>
                            <p className="text-gray-800">{meals.lunch}</p>
                          </div>
                        </div>

                        {/* Afternoon Snack */}
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 font-semibold text-sm">S</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Snack</p>
                            <p className="text-gray-800">{meals.snack}</p>
                          </div>
                        </div>

                        {/* Dinner */}
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-plum-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-plum-600 font-semibold text-sm">D</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Dinner</p>
                            <p className="text-gray-800">{meals.dinner}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Nutrition Tips */}
        <div className="mt-10 card p-8 bg-gradient-to-br from-forest-50 to-terracotta-50 border-forest-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">General Nutrition Tips</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
              <span>Drink at least 8 glasses of water daily</span>
            </li>
            <li className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
              <span>Limit caffeine to 1-2 cups of coffee per day</span>
            </li>
            <li className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
              <span>Avoid processed foods and excess sugar</span>
            </li>
            <li className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
              <span>Include a variety of colorful vegetables in every meal</span>
            </li>
            <li className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
              <span>Choose whole grains over refined carbohydrates</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MealPlans
