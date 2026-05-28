import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../utils/supabase'
import { 
  Calendar, 
  Heart, 
  Frown, 
  Meh, 
  Smile, 
  Sparkles,
  Thermometer,
  Droplets,
  Activity,
  Pill,
  Moon,
  Sun,
  CloudRain,
  Save,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Lock,
  AlertCircle
} from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'

// five mood states - might add a sixth (anxious?) once we get user feedback
const moods = [
  { value: 'great', label: 'Great', icon: Sparkles, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { value: 'good', label: 'Good', icon: Smile, color: 'text-green-500 bg-green-50 border-green-200' },
  { value: 'okay', label: 'Okay', icon: Meh, color: 'text-blue-500 bg-blue-50 border-blue-200' },
  { value: 'low', label: 'Low', icon: Frown, color: 'text-purple-500 bg-purple-50 border-purple-200' },
  { value: 'terrible', label: 'Terrible', icon: CloudRain, color: 'text-gray-500 bg-gray-50 border-gray-200' }
]

const symptomsList = [
  { id: 'cramps', label: 'Cramps', icon: Activity },
  { id: 'headache', label: 'Headache', icon: Activity },
  { id: 'bloating', label: 'Bloating', icon: Activity },
  { id: 'breastTenderness', label: 'Breast Tenderness', icon: Heart },
  { id: 'acne', label: 'Acne', icon: Activity },
  { id: 'fatigue', label: 'Fatigue', icon: Moon },
  { id: 'moodSwings', label: 'Mood Swings', icon: Activity },
  { id: 'spotting', label: 'Spotting', icon: Droplets },
  { id: 'cravings', label: 'Cravings', icon: Heart },
  { id: 'insomnia', label: 'Insomnia', icon: Moon }
]

const flowLevels = [
  { value: 'none', label: 'No Flow', color: 'bg-gray-100 text-gray-500' },
  { value: 'light', label: 'Light', color: 'bg-pink-100 text-pink-600' },
  { value: 'medium', label: 'Medium', color: 'bg-rose-100 text-rose-600' },
  { value: 'heavy', label: 'Heavy', color: 'bg-red-100 text-red-600' }
]

const mucusTypes = [
  { value: 'none', label: 'None/Dry', desc: 'Little to no discharge' },
  { value: 'sticky', label: 'Sticky', desc: 'Thick, tacky, cloudy' },
  { value: 'creamy', label: 'Creamy', desc: 'Lotion-like, white' },
  { value: 'eggwhite', label: 'Egg White', desc: 'Clear, stretchy, slippery' },
  { value: 'watery', label: 'Watery', desc: 'Wet, clear, water-like' }
]

function FertilityLog() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('log')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [savedLogs, setSavedLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // all the fields for a single day's log entry
  const [selectedMood, setSelectedMood] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [flow, setFlow] = useState('')
  const [mucus, setMucus] = useState('')
  const [temperature, setTemperature] = useState('')
  const [notes, setNotes] = useState('')
  const [hadSex, setHadSex] = useState(false)
  const [tookMeds, setTookMeds] = useState(false)

  // pull all logs once we know who the user is
  useEffect(() => {
    if (user) {
      fetchLogs()
    }
  }, [user])

  // whenever the date changes, fill the form with that day's data (or reset it)
  useEffect(() => {
    if (user) {
      loadDayData()
    }
  }, [selectedDate, savedLogs])

  async function fetchLogs() {
    try {
      // descending so newest entries are first in the summary table
      // had this as ascending: true at first but the table looked backwards
      const { data, error } = await supabase
        .from('fertility_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('log_date', { ascending: false })

      if (error) throw error
      setSavedLogs(data || [])
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  function loadDayData() {
    const dateKey = format(selectedDate, 'yyyy-MM-dd')
    const existingLog = savedLogs.find(log => log.log_date === dateKey)

    if (existingLog) {
      setSelectedMood(existingLog.mood || '')
      setSelectedSymptoms(existingLog.symptoms || [])
      setFlow(existingLog.flow_level || '')
      setMucus(existingLog.mucus_type || '')
      setTemperature(existingLog.temperature || '')
      setNotes(existingLog.notes || '')
      setHadSex(existingLog.had_sex || false)
      setTookMeds(existingLog.took_meds || false)
    } else {
      // nothing logged yet for this day - start with a blank form
      setSelectedMood('')
      setSelectedSymptoms([])
      setFlow('')
      setMucus('')
      setTemperature('')
      setNotes('')
      setHadSex(false)
      setTookMeds(false)
    }
  }

  async function handleSave() {
    if (!user) return

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const dateKey = format(selectedDate, 'yyyy-MM-dd')
      const existingLog = savedLogs.find(log => log.log_date === dateKey)

      const logData = {
        user_id: user.id,
        log_date: dateKey,
        mood: selectedMood,
        symptoms: selectedSymptoms,
        flow_level: flow,
        mucus_type: mucus,
        temperature: temperature ? parseFloat(temperature) : null,
        notes,
        had_sex: hadSex,
        took_meds: tookMeds
      }

      let error
      if (existingLog) {
        const { error: updateError } = await supabase
          .from('fertility_logs')
          .update(logData)
          .eq('id', existingLog.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('fertility_logs')
          .insert(logData)
        error = insertError
      }

      if (error) throw error

      await fetchLogs()
      setSaved(true)
      setMessage({ type: 'success', text: 'Log saved successfully!' })
      setTimeout(() => {
        setSaved(false)
        setMessage({ type: '', text: '' })
      }, 3000)
    } catch (error) {
      console.error('Error saving log:', error)
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    )
  }

  const changeDate = (days) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  // crunch all the logs into the four stat cards on the summary tab
  const getSummaryStats = () => {
    if (savedLogs.length === 0) return null

    const totalLogs = savedLogs.length
    const moodCounts = {}
    const symptomCounts = {}
    let periodDays = 0
    let highFertilityDays = 0

    savedLogs.forEach(log => {
      if (log.mood) {
        moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1
      }

      log.symptoms?.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
      })

      if (log.flow_level && log.flow_level !== 'none') {
        periodDays++
      }

      if (log.mucus_type === 'eggwhite' || log.mucus_type === 'watery') {
        highFertilityDays++
      }
    })

    const mostCommonMood = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0]

    // top 3 symptoms for the bar chart
    const topSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    return {
      totalLogs,
      mostCommonMood: mostCommonMood ? { mood: mostCommonMood[0], count: mostCommonMood[1] } : null,
      topSymptoms,
      periodDays,
      highFertilityDays
    }
  }

  // last 7 days for the mini weekly overview strip
  // TODO: make this a proper chart with a library once we have more space on the page
  const getRecentWeekData = () => {
    const end = new Date()
    const start = subDays(end, 6)
    const days = eachDayOfInterval({ start, end })

    return days.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd')
      const log = savedLogs.find(l => l.log_date === dateKey)
      return {
        date: day,
        dayName: format(day, 'EEE'),
        hasLog: !!log,
        mood: log?.mood,
        hasPeriod: log?.flow_level && log.flow_level !== 'none',
        isFertile: log?.mucus_type === 'eggwhite' || log?.mucus_type === 'watery'
      }
    })
  }

  const stats = getSummaryStats()
  const weekData = getRecentWeekData()

  // ProtectedRoute should handle this, but keeping it as a fallback just in case
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-terracotta-600" />
          </div>
          <h2 className="font-serif text-2xl text-gray-800 mb-4">Sign In Required</h2>
          <p className="text-gray-500 mb-8">
            Please sign in to track your fertility journey and view your personal logs.
          </p>
          <a href="/login" className="btn-primary inline-block">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-warm py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta-100 rounded-2xl mb-6">
            <Calendar className="w-8 h-8 text-terracotta-600" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-4">
            My Fertility Log
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Track your cycle, mood, and symptoms daily. Understanding your body 
            is the first step toward your fertility goals.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-soft">
            <button
              onClick={() => setActiveTab('log')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'log'
                  ? 'bg-terracotta-500 text-white shadow-soft'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Daily Log
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'summary'
                  ? 'bg-terracotta-500 text-white shadow-soft'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Summary & Trends
            </button>
          </div>
        </div>

        {/* Daily Log Tab */}
        {activeTab === 'log' && (
          <>
            {/* Date Navigator */}
            <div className="card p-6 mb-8">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => changeDate(-1)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Logging for</p>
                  <p className="text-xl font-semibold text-gray-800">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                </div>
                <button 
                  onClick={() => changeDate(1)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                message.type === 'error' 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                <p>{message.text}</p>
              </div>
            )}

            {/* Log Form */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Mood Section */}
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Sun className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">How are you feeling today?</h3>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {moods.map((mood) => {
                      const Icon = mood.icon
                      return (
                        <button
                          key={mood.value}
                          onClick={() => setSelectedMood(mood.value)}
                          className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                            selectedMood === mood.value 
                              ? mood.color 
                              : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mb-1 ${selectedMood === mood.value ? '' : 'text-gray-400'}`} />
                          <span className={`text-xs ${selectedMood === mood.value ? '' : 'text-gray-500'}`}>
                            {mood.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Flow & Mucus */}
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-rose-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Flow Level</h3>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {flowLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setFlow(level.value)}
                        className={`p-3 rounded-xl border-2 text-sm font-medium text-center transition-all ${
                          flow === level.value 
                            ? `${level.color} border-current` 
                            : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cervical Mucus */}
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Cervical Mucus</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {mucusTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setMucus(type.value)}
                        className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                          mucus === type.value 
                            ? 'bg-blue-50 border-blue-300' 
                            : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <span className={`font-medium block ${mucus === type.value ? 'text-blue-700' : 'text-gray-700'}`}>
                          {type.label}
                        </span>
                        <span className={`text-xs ${mucus === type.value ? 'text-blue-500' : 'text-gray-400'}`}>
                          {type.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Symptoms */}
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Any symptoms today?</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {symptomsList.map((symptom) => {
                      const Icon = symptom.icon
                      const isSelected = selectedSymptoms.includes(symptom.id)
                      return (
                        <button
                          key={symptom.id}
                          onClick={() => toggleSymptom(symptom.id)}
                          className={`flex items-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                            isSelected 
                              ? 'bg-purple-50 border-purple-300' 
                              : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                          <span className={`text-sm ${isSelected ? 'text-purple-700 font-medium' : 'text-gray-600'}`}>
                            {symptom.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Temperature */}
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Thermometer className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Basal Temperature</h3>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      step="0.01"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      placeholder="36.50"
                      className="input-field flex-1"
                    />
                    <span className="text-gray-500 font-medium">°C</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Take your temperature first thing in the morning, before getting out of bed.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={hadSex}
                        onChange={(e) => setHadSex(e.target.checked)}
                        className="w-5 h-5 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
                      />
                      <div className="flex items-center space-x-3">
                        <Heart className="w-5 h-5 text-pink-500" />
                        <span className="text-gray-700">Intimate today</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={tookMeds}
                        onChange={(e) => setTookMeds(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-3">
                        <Pill className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-700">Took medication/supplements</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How are you feeling emotionally? Any observations about your body today?"
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center space-x-3 px-10 py-4 rounded-2xl font-semibold transition-all ${
                  saved 
                    ? 'bg-green-500 text-white' 
                    : 'bg-terracotta-500 text-white hover:bg-terracotta-600 shadow-soft hover:shadow-soft-lg'
                }`}
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Saved Successfully!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    <span>Save Today's Log</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-terracotta-200 border-t-terracotta-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading your data...</p>
              </div>
            ) : savedLogs.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Yet</h3>
                <p className="text-gray-500 mb-6">Start logging daily to see your trends and patterns.</p>
                <button 
                  onClick={() => setActiveTab('log')}
                  className="btn-primary"
                >
                  Start Logging
                </button>
              </div>
            ) : (
              <>
                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="card p-6 text-center">
                    <div className="w-12 h-12 bg-terracotta-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-terracotta-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats?.totalLogs}</p>
                    <p className="text-sm text-gray-500">Total Logs</p>
                  </div>

                  <div className="card p-6 text-center">
                    <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Droplets className="w-6 h-6 text-rose-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats?.periodDays}</p>
                    <p className="text-sm text-gray-500">Period Days Logged</p>
                  </div>

                  <div className="card p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats?.highFertilityDays}</p>
                    <p className="text-sm text-gray-500">High Fertility Days</p>
                  </div>

                  <div className="card p-6 text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-xl font-bold text-gray-800 capitalize">{stats?.mostCommonMood?.mood || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Most Common Mood</p>
                  </div>
                </div>

                {/* Weekly Overview */}
                <div className="card p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Last 7 Days</h3>
                  <div className="flex justify-between">
                    {weekData.map((day, index) => {
                      const moodColor = {
                        great: 'bg-amber-400',
                        good: 'bg-green-400',
                        okay: 'bg-blue-400',
                        low: 'bg-purple-400',
                        terrible: 'bg-gray-400'
                      }[day.mood]

                      return (
                        <div key={index} className="flex flex-col items-center">
                          <span className="text-xs text-gray-400 mb-2">{day.dayName}</span>
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              day.hasLog ? moodColor || 'bg-gray-200' : 'bg-gray-100'
                            }`}>
                              {day.hasPeriod && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                              )}
                              {day.isFertile && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{format(day.date, 'd')}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-gray-500">Period</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-gray-500">Fertile</span>
                    </div>
                  </div>
                </div>

                {/* Top Symptoms */}
                {stats?.topSymptoms.length > 0 && (
                  <div className="card p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Common Symptoms</h3>
                    <div className="space-y-3">
                      {stats.topSymptoms.map(([symptom, count], index) => (
                        <div key={symptom} className="flex items-center">
                          <span className="w-8 text-sm text-gray-400">#{index + 1}</span>
                          <div className="flex-grow mx-4">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-terracotta-400 rounded-full"
                                style={{ width: `${(count / stats.totalLogs) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-gray-600 capitalize w-32 text-right">
                            {symptom.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-sm text-gray-400 ml-2 w-12 text-right">
                            {count}x
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Logs Table */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Logs</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Mood</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Flow</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Symptoms</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Temp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savedLogs.slice(0, 10).map((log) => (
                          <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">
                              {format(new Date(log.log_date), 'MMM d, yyyy')}
                            </td>
                            <td className="py-3 px-4">
                              {log.mood && (
                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium capitalize bg-gray-100 text-gray-600">
                                  {log.mood}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {log.flow_level && log.flow_level !== 'none' && (
                                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium capitalize ${
                                  log.flow_level === 'light' ? 'bg-pink-100 text-pink-700' :
                                  log.flow_level === 'medium' ? 'bg-rose-100 text-rose-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {log.flow_level}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {log.symptoms?.slice(0, 2).map(s => 
                                s.replace(/([A-Z])/g, ' $1').trim()
                              ).join(', ')}
                              {log.symptoms?.length > 2 && ` +${log.symptoms.length - 2} more`}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {log.temperature ? `${log.temperature}°C` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default FertilityLog
