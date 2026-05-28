import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  Calendar, 
  Activity, 
  User, 
  Clock,
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import { getMealPlanForConcern } from '../data/mealPlans'

// Enhanced Analysis Logic with Personalization
function analyzeFertility(formData) {
  const conditions = {
    ovulationIssues: 0,
    fibroids: 0,
    endometriosis: 0,
    hormonalImbalance: 0,
    tubalIssues: 0,
  }

  // Ovulation Issues
  if (formData.cycle === 'irregular') {
    conditions.ovulationIssues += 2
    conditions.hormonalImbalance += 2
  }
  if (formData.missedPeriods) {
    conditions.ovulationIssues += 3
  }
  if (formData.cycleLength && (formData.cycleLength < 21 || formData.cycleLength > 35)) {
    conditions.ovulationIssues += 2
  }

  // Fibroids
  if (formData.pain === 'severe') {
    conditions.fibroids += 2
  }
  if (formData.heavyBleeding) {
    conditions.fibroids += 3
  }
  if (formData.knownFibroids) {
    conditions.fibroids += 5
  }

  // Endometriosis
  if (formData.pain === 'severe') {
    conditions.endometriosis += 3
  }
  if (formData.painDuringCycle) {
    conditions.endometriosis += 2
  }

  // Hormonal Imbalance / PCOS
  if (formData.acne) {
    conditions.hormonalImbalance += 2
  }
  if (formData.excessHair) {
    conditions.hormonalImbalance += 2
  }
  if (formData.weightIssue) {
    conditions.hormonalImbalance += 2
  }

  // Tubal Issues
  if (formData.tryingTime === '1+ year') {
    conditions.tubalIssues += 2
  }
  if (formData.pastInfection) {
    conditions.tubalIssues += 3
  }

  const sorted = Object.entries(conditions).sort((a, b) => b[1] - a[1])
  const labels = {
    ovulationIssues: 'Ovulation Challenges',
    fibroids: 'Fibroids',
    endometriosis: 'Endometriosis',
    hormonalImbalance: 'Hormonal Imbalance',
    tubalIssues: 'Tubal Factors',
  }

  const primary = labels[sorted[0][0]]
  const secondary = labels[sorted[1][0]]

  // Determine urgency
  let urgency = 'low'
  if (formData.tryingTime === '1+ year' || formData.age > 35 || formData.pain === 'severe') {
    urgency = 'high'
  } else if (formData.age > 30 || formData.missedPeriods || formData.tryingTime === '6-12 months') {
    urgency = 'medium'
  }

  // Generate personalized recommendations
  const recommendations = []
  const personalizedAdvice = []

  // Age-based personalization
  if (formData.age > 38) {
    personalizedAdvice.push('At your age, egg quality may be a factor. Consider speaking with a fertility specialist about your options.')
  } else if (formData.age > 35) {
    personalizedAdvice.push('Age may be affecting egg quality. Consider seeking help sooner rather than later.')
  } else if (formData.age > 30 && formData.tryingTime === '6-12 months') {
    personalizedAdvice.push('While you\'re still young, 6-12 months of trying is a good time to consult a gynaecologist.')
  }

  // Trying time personalization
  if (formData.tryingTime === '1+ year') {
    personalizedAdvice.push('You\'ve been trying for over a year—medical support could help identify and address any issues.')
  } else if (formData.tryingTime === '6-12 months') {
    personalizedAdvice.push('Six months of trying is a good milestone to start tracking more closely and consider a check-up.')
  }

  // Weight-based advice
  if (formData.weight) {
    const heightInM = formData.height ? formData.height / 100 : 1.65
    const bmi = formData.weight / (heightInM * heightInM)
    
    if (bmi < 18.5) {
      personalizedAdvice.push('Being underweight can affect ovulation. Focus on nutrient-dense foods to reach a healthy weight.')
    } else if (bmi > 30) {
      personalizedAdvice.push('Weight can impact fertility. Even a 5-10% weight loss can improve ovulation and hormone balance.')
    }
  }

  // Condition-specific recommendations
  if (conditions.ovulationIssues > 0) {
    recommendations.push('Track your cycle daily to identify ovulation patterns')
    recommendations.push('Consider foods that support ovulation like pumpkin seeds (hwakwe) and leafy greens')
    recommendations.push('Maintain a healthy weight - both underweight and overweight can affect ovulation')
  }
  
  if (conditions.fibroids > 0) {
    recommendations.push('Focus on anti-inflammatory foods like leafy greens (muriwo) and fatty fish')
    recommendations.push('Reduce processed foods, caffeine, and alcohol')
    recommendations.push('Consider speaking with your doctor about fibroid monitoring')
  }
  
  if (conditions.hormonalImbalance > 0) {
    recommendations.push('Include hormone-balancing foods like sweet potatoes (mbambaira) and flaxseeds')
    recommendations.push('Manage stress through prayer, meditation, or gentle exercise')
    recommendations.push('Prioritize sleep - aim for 7-9 hours per night')
  }
  
  if (conditions.endometriosis > 0) {
    recommendations.push('Explore anti-inflammatory herbs like ginger and turmeric')
    recommendations.push('Apply heat during painful periods')
    recommendations.push('Consider an anti-inflammatory diet rich in omega-3s')
  }

  if (conditions.tubalIssues > 0) {
    recommendations.push('If you\'ve had pelvic infections in the past, discuss this with your gynaecologist')
    recommendations.push('IVF may be an option if tubes are blocked - it bypasses the tubes entirely')
  }
  
  // Always add these
  recommendations.push('Eat a balanced diet rich in Zimbabwean fertility foods')
  recommendations.push('Stay hydrated and get adequate sleep')
  recommendations.push('Take a prenatal vitamin with folic acid daily')

  // Get recommended meal plan
  const recommendedMealPlan = getMealPlanForConcern(primary, secondary)

  return {
    primary,
    secondary,
    confidence: sorted[0][1] > 5 ? 'high' : sorted[0][1] > 2 ? 'moderate' : 'low',
    urgency,
    recommendations: recommendations.slice(0, 6),
    personalizedAdvice,
    recommendedMealPlan,
    formData
  }
}

const steps = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Let\'s start with some basic details about you.',
    icon: User
  },
  {
    id: 'cycle',
    title: 'Cycle Health',
    description: 'Tell us about your menstrual cycle.',
    icon: Calendar
  },
  {
    id: 'symptoms',
    title: 'Symptoms',
    description: 'Any symptoms you\'ve been experiencing?',
    icon: Activity
  },
  {
    id: 'history',
    title: 'History & Duration',
    description: 'A bit about your journey so far.',
    icon: Clock
  }
]

function FertilityCheck() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    cycle: '',
    cycleLength: '',
    missedPeriods: false,
    pain: '',
    heavyBleeding: false,
    acne: false,
    excessHair: false,
    fatigue: false,
    knownFibroids: false,
    previousPregnancy: false,
    miscarriages: false,
    pastInfection: false,
    weightIssue: false,
    painDuringCycle: false,
    tryingTime: ''
  })
  const [errors, setErrors] = useState({})

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = () => {
    const newErrors = {}

    switch (currentStep) {
      case 0:
        if (!formData.age) {
          newErrors.age = 'Please enter your age'
        } else if (formData.age < 18 || formData.age > 60) {
          newErrors.age = 'Age must be between 18 and 60'
        }
        if (formData.weight && (formData.weight < 30 || formData.weight > 200)) {
          newErrors.weight = 'Please enter a valid weight'
        }
        if (formData.height && (formData.height < 100 || formData.height > 250)) {
          newErrors.height = 'Please enter a valid height'
        }
        break
      case 1:
        if (!formData.cycle) {
          newErrors.cycle = 'Please select your cycle type'
        }
        if (!formData.cycleLength) {
          newErrors.cycleLength = 'Please enter your cycle length'
        } else if (formData.cycleLength < 15 || formData.cycleLength > 90) {
          newErrors.cycleLength = 'Cycle length should be between 15 and 90 days'
        }
        break
      case 2:
        if (!formData.pain) {
          newErrors.pain = 'Please select your pain level'
        }
        break
      case 3:
        if (!formData.tryingTime) {
          newErrors.tryingTime = 'Please select how long you\'ve been trying'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep()) return

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      const results = analyzeFertility(formData)
      navigate('/results', { state: { results } })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.age
      case 1:
        return formData.cycle && formData.cycleLength
      case 2:
        return formData.pain
      case 3:
        return formData.tryingTime
      default:
        return true
    }
  }

  const CurrentIcon = steps[currentStep].icon

  return (
    <div className="min-h-screen bg-gradient-warm py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta-100 rounded-2xl mb-6">
            <Heart className="w-8 h-8 text-terracotta-600" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-4">
            Fertility Assessment
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            This assessment helps identify potential areas to focus on. 
            Remember, this is guidance, not a diagnosis.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              return (
                <div 
                  key={step.id} 
                  className={`flex flex-col items-center ${
                    index <= currentStep ? 'text-terracotta-600' : 'text-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                    index <= currentStep 
                      ? 'bg-terracotta-100' 
                      : 'bg-gray-100'
                  }`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              )
            })}
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-terracotta-400 to-terracotta-600 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="card p-8 md:p-10">
          {/* Step Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-terracotta-100 rounded-xl flex items-center justify-center">
              <CurrentIcon className="w-6 h-6 text-terracotta-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{steps[currentStep].title}</h2>
              <p className="text-gray-500 text-sm">{steps[currentStep].description}</p>
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {currentStep === 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How old are you? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateField('age', e.target.value)}
                    placeholder="Enter your age"
                    className={`input-field ${errors.age ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                  />
                  {errors.age && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.age}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Age affects fertility. Women over 35 may want to seek help sooner.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What is your weight? (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => updateField('weight', e.target.value)}
                      placeholder="e.g., 65"
                      className={`input-field ${errors.weight ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                    />
                    {errors.weight && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.weight}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What is your height? (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => updateField('height', e.target.value)}
                      placeholder="e.g., 165"
                      className={`input-field ${errors.height ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                    />
                    {errors.height && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.height}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Is your cycle regular? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['regular', 'irregular'].map((option) => (
                      <button
                        key={option}
                        onClick={() => updateField('cycle', option)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          formData.cycle === option
                            ? 'border-terracotta-400 bg-terracotta-50'
                            : 'border-gray-100 hover:border-terracotta-200'
                        }`}
                      >
                        <span className="font-medium capitalize">{option}</span>
                      </button>
                    ))}
                  </div>
                  {errors.cycle && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.cycle}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How long is your cycle? (days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.cycleLength}
                    onChange={(e) => updateField('cycleLength', e.target.value)}
                    placeholder="e.g., 28"
                    className={`input-field ${errors.cycleLength ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                  />
                  {errors.cycleLength && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.cycleLength}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    A normal cycle is between 21-35 days.
                  </p>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                  <input
                    type="checkbox"
                    id="missedPeriods"
                    checked={formData.missedPeriods}
                    onChange={(e) => updateField('missedPeriods', e.target.checked)}
                    className="w-5 h-5 text-terracotta-600 rounded border-gray-300 focus:ring-terracotta-500"
                  />
                  <label htmlFor="missedPeriods" className="text-gray-700">
                    I have missed periods sometimes
                  </label>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How painful are your periods? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'none', label: 'No pain', desc: 'I barely notice my period' },
                      { value: 'mild', label: 'Mild discomfort', desc: 'Manageable with over-the-counter pain relief' },
                      { value: 'moderate', label: 'Moderate pain', desc: 'Affects my daily activities sometimes' },
                      { value: 'severe', label: 'Severe pain', desc: 'I often need to rest or miss work/school' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateField('pain', option.value)}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                          formData.pain === option.value
                            ? 'border-terracotta-400 bg-terracotta-50'
                            : 'border-gray-100 hover:border-terracotta-200'
                        }`}
                      >
                        <span className="font-medium block">{option.label}</span>
                        <span className="text-sm text-gray-500">{option.desc}</span>
                      </button>
                    ))}
                  </div>
                  {errors.pain && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.pain}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: 'heavyBleeding', label: 'Heavy bleeding' },
                    { field: 'acne', label: 'Acne or skin issues' },
                    { field: 'excessHair', label: 'Excess facial/body hair' },
                    { field: 'fatigue', label: 'Chronic fatigue' },
                    { field: 'painDuringCycle', label: 'Pain outside periods' },
                    { field: 'weightIssue', label: 'Sudden weight changes' }
                  ].map((item) => (
                    <div key={item.field} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                      <input
                        type="checkbox"
                        id={item.field}
                        checked={formData[item.field]}
                        onChange={(e) => updateField(item.field, e.target.checked)}
                        className="w-5 h-5 text-terracotta-600 rounded border-gray-300 focus:ring-terracotta-500"
                      />
                      <label htmlFor={item.field} className="text-gray-700 text-sm">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How long have you been trying to conceive? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: '< 6 months', label: 'Less than 6 months', desc: 'Just starting the journey' },
                      { value: '6-12 months', label: '6 to 12 months', desc: 'Getting concerned' },
                      { value: '1+ year', label: 'More than 1 year', desc: 'Ready to seek medical help' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateField('tryingTime', option.value)}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                          formData.tryingTime === option.value
                            ? 'border-terracotta-400 bg-terracotta-50'
                            : 'border-gray-100 hover:border-terracotta-200'
                        }`}
                      >
                        <span className="font-medium block">{option.label}</span>
                        <span className="text-sm text-gray-500">{option.desc}</span>
                      </button>
                    ))}
                  </div>
                  {errors.tryingTime && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.tryingTime}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: 'knownFibroids', label: 'I have known fibroids' },
                    { field: 'previousPregnancy', label: 'I have been pregnant before' },
                    { field: 'miscarriages', label: 'I have had miscarriages' },
                    { field: 'pastInfection', label: 'Past pelvic infection/STI' }
                  ].map((item) => (
                    <div key={item.field} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                      <input
                        type="checkbox"
                        id={item.field}
                        checked={formData[item.field]}
                        onChange={(e) => updateField(item.field, e.target.checked)}
                        className="w-5 h-5 text-terracotta-600 rounded border-gray-300 focus:ring-terracotta-500"
                      />
                      <label htmlFor={item.field} className="text-gray-700 text-sm">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                currentStep === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all ${
                canProceed()
                  ? 'bg-terracotta-500 text-white hover:bg-terracotta-600 shadow-soft'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === steps.length - 1 ? 'Get Results' : 'Continue'}</span>
              {currentStep === steps.length - 1 ? (
                <Sparkles className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 flex items-start space-x-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            <strong>Important:</strong> This assessment provides educational guidance only. 
            It is not a medical diagnosis. Always consult with a qualified healthcare professional 
            for proper evaluation and treatment.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FertilityCheck
