import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../utils/supabase'
import { 
  Calendar, 
  Heart, 
  Droplets, 
  Thermometer, 
  ChevronLeft, 
  ChevronRight,
  Info,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Save,
  Bell,
  X
} from 'lucide-react'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subMonths, addMonths } from 'date-fns'

// egg white and watery = fertile, the rest are not
const mucusTypes = [
  { value: 'none', label: 'None/Dry', fertile: false, desc: 'Little to no discharge' },
  { value: 'sticky', label: 'Sticky', fertile: false, desc: 'Thick, tacky, cloudy' },
  { value: 'creamy', label: 'Creamy', fertile: false, desc: 'Lotion-like, white' },
  { value: 'eggwhite', label: 'Egg White', fertile: true, desc: 'Clear, stretchy, slippery - FERTILE!' },
  { value: 'watery', label: 'Watery', fertile: true, desc: 'Wet, clear, water-like - FERTILE!' }
]

function OvulationTracker() {
  const { user, profile } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [cycleData, setCycleData] = useState({})
  const [predictions, setPredictions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  // what we track for each individual day
  const [formData, setFormData] = useState({
    period: false,
    flow: 'none',
    mucus: 'none',
    temperature: '',
    ovulationTest: false,
    hadSex: false,
    notes: ''
  })

  const cycleLength = profile?.cycle_length || 28

  useEffect(() => {
    fetchCycleData()
  }, [currentDate])

  useEffect(() => {
    calculatePredictions()
  }, [cycleData])

  useEffect(() => {
    fetchDayData()
  }, [selectedDate])

  async function fetchCycleData() {
    if (!user) return

    try {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)

      const { data, error } = await supabase
        .from('ovulation_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('log_date', format(start, 'yyyy-MM-dd'))
        .lte('log_date', format(end, 'yyyy-MM-dd'))

      if (error) throw error

      const dataMap = {}
      data?.forEach(entry => {
        dataMap[entry.log_date] = entry
      })
      setCycleData(dataMap)
    } catch (error) {
      console.error('Error fetching cycle data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchDayData() {
    const dateKey = format(selectedDate, 'yyyy-MM-dd')
    const existingData = cycleData[dateKey]

    if (existingData) {
      setFormData({
        period: existingData.period || false,
        flow: existingData.flow || 'none',
        mucus: existingData.mucus || 'none',
        temperature: existingData.temperature || '',
        ovulationTest: existingData.ovulation_test || false,
        hadSex: existingData.had_sex || false,
        notes: existingData.notes || ''
      })
    } else {
      setFormData({
        period: false,
        flow: 'none',
        mucus: 'none',
        temperature: '',
        ovulationTest: false,
        hadSex: false,
        notes: ''
      })
    }
  }

  function calculatePredictions() {
    // work backwards from the last logged period to predict the next one and ovulation
    const periodDates = Object.entries(cycleData)
      .filter(([_, data]) => data.period)
      .map(([date, _]) => new Date(date))
      .sort((a, b) => b - a)

    if (periodDates.length === 0) {
      setPredictions(null)
      return
    }

    const lastPeriod = periodDates[0]
    const nextPeriod = addDays(lastPeriod, cycleLength)
    // subtract from lastPeriod not nextPeriod - was off by a day the other way
    // const ovulationDate = addDays(nextPeriod, -14)
    const ovulationDate = addDays(lastPeriod, cycleLength - 14)
    const fertileWindowStart = addDays(ovulationDate, -5)
    const fertileWindowEnd = addDays(ovulationDate, 1)

    setPredictions({
      lastPeriod,
      nextPeriod,
      ovulationDate,
      fertileWindowStart,
      fertileWindowEnd
    })
  }

  async function saveDayData() {
    if (!user) return

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const dateKey = format(selectedDate, 'yyyy-MM-dd')
      const existingData = cycleData[dateKey]

      const dataToSave = {
        user_id: user.id,
        log_date: dateKey,
        period: formData.period,
        flow: formData.flow,
        mucus: formData.mucus,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        ovulation_test: formData.ovulationTest,
        had_sex: formData.hadSex,
        notes: formData.notes
      }

      let error
      if (existingData) {
        const { error: updateError } = await supabase
          .from('ovulation_logs')
          .update(dataToSave)
          .eq('id', existingData.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('ovulation_logs')
          .insert(dataToSave)
        error = insertError
      }

      if (error) throw error

      await fetchCycleData()
      setMessage({ type: 'success', text: 'Saved successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      console.error('Error saving data:', error)
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getDayStatus = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    const data = cycleData[dateKey]
    
    if (!data && !predictions) return null

    const status = []

    // actual logged entries take priority over predictions
    if (data?.period) status.push('period')
    if (data?.mucus === 'eggwhite' || data?.mucus === 'watery') status.push('fertile')
    if (data?.ovulation_test) status.push('ovulation')

    if (predictions) {
      if (isSameDay(date, predictions.ovulationDate)) status.push('predicted-ovulation')
      if (date >= predictions.fertileWindowStart && date <= predictions.fertileWindowEnd) {
        if (!status.includes('fertile')) status.push('fertile-window')
      }
      if (isSameDay(date, predictions.nextPeriod)) status.push('predicted-period')
    }

    return status
  }

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="min-h-screen bg-gradient-warm py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta-100 rounded-2xl mb-6">
            <Calendar className="w-8 h-8 text-terracotta-600" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-4">
            Ovulation Tracker
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Track your cycle, predict ovulation, and identify your fertile window.
          </p>
        </div>

        {/* Predictions Panel */}
        {predictions && (
          <div className="card p-6 mb-8 bg-gradient-to-r from-terracotta-50 to-plum-50 border-terracotta-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-terracotta-500" />
                Your Cycle Predictions
              </h3>
              <button
                onClick={() => setShowNotificationModal(true)}
                className="flex items-center space-x-2 text-terracotta-600 hover:text-terracotta-700"
              >
                <Bell className="w-4 h-4" />
                <span className="text-sm">Set Reminders</span>
              </button>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white/70 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Last Period</p>
                <p className="font-semibold text-gray-800">{format(predictions.lastPeriod, 'MMM d')}</p>
              </div>
              <div className="bg-white/70 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Next Period</p>
                <p className="font-semibold text-gray-800">{format(predictions.nextPeriod, 'MMM d')}</p>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border-2 border-pink-200">
                <p className="text-sm text-pink-600 mb-1">Predicted Ovulation</p>
                <p className="font-semibold text-pink-700">{format(predictions.ovulationDate, 'MMM d')}</p>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border-2 border-green-200">
                <p className="text-sm text-green-600 mb-1">Fertile Window</p>
                <p className="font-semibold text-green-700">
                  {format(predictions.fertileWindowStart, 'MMM d')} - {format(predictions.fertileWindowEnd, 'MMM d')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Calendar and Form Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="font-semibold text-lg text-gray-800">
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* TODO: offset first column to match actual weekday of the 1st — currently starts at Sunday always */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((date) => {
                const status = getDayStatus(date)
                const isSelected = isSameDay(date, selectedDate)
                const isToday = isSameDay(date, new Date())

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all
                      ${isSelected ? 'ring-2 ring-terracotta-500 bg-terracotta-50' : 'hover:bg-gray-50'}
                      ${isToday ? 'font-bold' : ''}
                    `}
                  >
                    <span className={isToday ? 'text-terracotta-600' : 'text-gray-700'}>
                      {format(date, 'd')}
                    </span>
                    <div className="flex space-x-0.5 mt-1">
                      {status?.includes('period') && (
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                      )}
                      {status?.includes('fertile') && (
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                      )}
                      {status?.includes('ovulation') && (
                        <div className="w-2 h-2 rounded-full bg-pink-400" />
                      )}
                      {status?.includes('predicted-ovulation') && (
                        <div className="w-2 h-2 rounded-full bg-pink-300 border border-pink-400" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-gray-600">Period</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-gray-600">Fertile Mucus</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-pink-400" />
                <span className="text-gray-600">Ovulation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-pink-300 border border-pink-400" />
                <span className="text-gray-600">Predicted</span>
              </div>
            </div>
          </div>

          {/* Day Form */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-gray-800">
                {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              {isSameDay(selectedDate, new Date()) && (
                <span className="text-xs font-medium px-3 py-1 bg-terracotta-100 text-terracotta-700 rounded-full">
                  Today
                </span>
              )}
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-xl flex items-center space-x-2 ${
                message.type === 'error' 
                  ? 'bg-red-50 text-red-700' 
                  : 'bg-green-50 text-green-700'
              }`}>
                {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* Period */}
              <div>
                <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.period}
                    onChange={(e) => handleChange('period', e.target.checked)}
                    className="w-5 h-5 text-red-500 rounded border-gray-300 focus:ring-red-500"
                  />
                  <div className="flex items-center space-x-3">
                    <Droplets className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">Period today</span>
                  </div>
                </label>
              </div>

              {/* Flow Level (only if period) */}
              {formData.period && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flow Level</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['none', 'light', 'medium', 'heavy'].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleChange('flow', level)}
                        className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                          formData.flow === level
                            ? 'border-red-300 bg-red-50 text-red-700'
                            : 'border-gray-100 hover:border-red-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cervical Mucus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cervical Mucus
                </label>
                <div className="space-y-2">
                  {mucusTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleChange('mucus', type.value)}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                        formData.mucus === type.value
                          ? type.fertile 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-300 bg-gray-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${type.fertile && formData.mucus === type.value ? 'text-green-700' : 'text-gray-700'}`}>
                          {type.label}
                        </span>
                        {type.fertile && <Sparkles className="w-4 h-4 text-green-500" />}
                      </div>
                      <span className="text-xs text-gray-400">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Basal Body Temperature (°C)
                </label>
                <div className="relative">
                  <Thermometer className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.temperature}
                    onChange={(e) => handleChange('temperature', e.target.value)}
                    placeholder="e.g., 36.50"
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-terracotta-300 transition-colors"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Take your temperature first thing in the morning, before getting out of bed.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.ovulationTest}
                    onChange={(e) => handleChange('ovulationTest', e.target.checked)}
                    className="w-5 h-5 text-pink-500 rounded border-gray-300 focus:ring-pink-500"
                  />
                  <span className="text-gray-700 text-sm">Positive OPK</span>
                </label>

                <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hadSex}
                    onChange={(e) => handleChange('hadSex', e.target.checked)}
                    className="w-5 h-5 text-terracotta-500 rounded border-gray-300 focus:ring-terracotta-500"
                  />
                  <span className="text-gray-700 text-sm">Intimate</span>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Any observations or symptoms..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-terracotta-300 transition-colors resize-none"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={saveDayData}
                disabled={saving}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Entry</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-10 card p-6 bg-blue-50 border-blue-100">
          <div className="flex items-start space-x-4">
            <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Tracking Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Log daily for the most accurate predictions</li>
                <li>• Take your temperature at the same time every morning</li>
                <li>• Egg white or watery mucus indicates your fertile window</li>
                <li>• A temperature rise after ovulation confirms it happened</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notification Modal */}
        {showNotificationModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Set Reminders</h3>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <p className="text-gray-500 mb-6">
                We'll remind you to log your data and alert you when your fertile window approaches.
                (Note: Push notifications require browser permission)
              </p>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-terracotta-600 rounded" defaultChecked />
                  <span className="text-gray-700">Daily tracking reminder (9 AM)</span>
                </label>
                <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-terracotta-600 rounded" defaultChecked />
                  <span className="text-gray-700">Fertile window alert</span>
                </label>
                <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-terracotta-600 rounded" defaultChecked />
                  <span className="text-gray-700">Period due reminder</span>
                </label>
              </div>

              <button
                onClick={() => setShowNotificationModal(false)}
                className="w-full btn-primary mt-6"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OvulationTracker
