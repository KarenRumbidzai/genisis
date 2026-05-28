import { Link } from 'react-router-dom'
import { ArrowRight, Heart, BookOpen, Utensils, Sparkles, ChevronRight } from 'lucide-react'
import lotus from '../assets/lotus.png'
import logo from '../assets/logo.png'

// fertility foods - adding more once the research is done
const zimbabweFoods = [
  {
    name: 'Matemba',
    shonaName: 'Matemba / Kapenta',
    description: 'Tiny dried sardine-like fish from Lake Kariba - one of Zimbabwe\'s most affordable protein sources.',
    benefits: ['Omega-3', 'Calcium', 'Vitamin D'],
    color: 'bg-terracotta-100 text-terracotta-700'
  },
  {
    name: 'Hwakwe',
    shonaName: 'Hwakwe (Pumpkin Seeds)',
    description: 'Nutritional powerhouses - a handful provides significant zinc, magnesium, and essential fatty acids.',
    benefits: ['Zinc', 'Magnesium', 'Omega-3'],
    color: 'bg-forest-100 text-forest-700'
  },
  {
    name: 'Muboora',
    shonaName: 'Muboora (Pumpkin Leaves)',
    description: 'Tender young pumpkin leaves packed with iron, calcium, and vitamins essential for reproductive health.',
    benefits: ['Folate', 'Iron', 'Calcium'],
    color: 'bg-plum-100 text-plum-700'
  },
  {
    name: 'Muriwo',
    shonaName: 'Muriwo (Collard Greens)',
    description: 'Dark leafy greens that accompany almost every Zimbabwean meal - the foundation of fertility-friendly diet.',
    benefits: ['Folate', 'Iron', 'Calcium'],
    color: 'bg-rust-100 text-rust-700'
  }
]

// the four feature cards on the homepage
const features = [
  {
    icon: BookOpen,
    title: 'Fertility Knowledge Hub',
    description: 'In-depth articles on causes of infertility, treatment options, and what to expect - written for real women, not textbooks.',
    color: 'bg-terracotta-500'
  },
  {
    icon: Utensils,
    title: 'Zimbabwean Fertility Foods',
    description: 'Discover local foods that boost fertility - from muboora and nyevhe to pumpkin seeds and madora. All available at your nearest market.',
    color: 'bg-forest-500'
  },
  {
    icon: Sparkles,
    title: 'African Herbs & Remedies',
    description: 'Traditional herbs available in Zimbabwe and South Africa that have supported women\'s reproductive health for generations.',
    color: 'bg-plum-500'
  },
  {
    icon: Heart,
    title: 'Personal Assessment',
    description: 'Enter your age, weight, cycle details, and health history to receive tailored guidance - because one size does not fit all.',
    color: 'bg-rust-500'
  }
]

// still digging into some of these - descriptions need more work
const causes = [
  { name: 'Uterine Fibroids', tag: 'Treatable', description: 'Growths in or on the uterus that can block implantation. Very common in African women.' },
  { name: 'Ovulation Problems', tag: 'Treatable', description: 'Irregular or absent ovulation due to PCOS, thyroid issues, or stress.' },
  { name: 'Blocked Fallopian Tubes', tag: 'Treatable', description: 'Infections or endometriosis can block tubes, preventing egg and sperm from meeting.' },
  { name: 'Endometriosis', tag: 'Treatable', description: 'Tissue grows outside the uterus, causing pain and potentially affecting fertility.' },
  { name: 'Hormonal Imbalance', tag: 'Treatable', description: 'Imbalances in hormones can disrupt the menstrual cycle and ovulation.' },
  { name: 'Unexplained Infertility', tag: 'Unknown', description: 'Sometimes no clear cause is found. This doesn\'t mean there\'s no hope.' },
]

// three steps - might add links or resources to each one later
const steps = [
  {
    number: '01',
    title: 'Change What You Eat',
    description: 'Start with fertility-boosting Zimbabwean foods. Small dietary changes can make a real difference in your hormone balance and egg health.',
    color: 'from-terracotta-400 to-terracotta-600'
  },
  {
    number: '02',
    title: 'Nurture Your Body',
    description: 'Explore traditional African herbs and wellness practices. Manage stress, move your body, and give yourself grace during this journey.',
    color: 'from-forest-400 to-forest-600'
  },
  {
    number: '03',
    title: 'See a Gynaecologist',
    description: 'If natural methods aren\'t enough, medical interventions like fibroid removal, IUI, or IVF can be your saving grace.',
    color: 'from-plum-400 to-plum-600'
  }
]

function Home() {
  return (
    <div className="overflow-hidden">
      {/* hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-hero" />

        {/* soft blobs for depth */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-terracotta-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-plum-200/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-terracotta-100 rounded-full">
                <Heart className="w-4 h-4 text-terracotta-600" />
                <span className="text-sm font-medium text-terracotta-700">Your fertility journey starts here</span>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-800 leading-tight">
                Knowledge is the first step toward{' '}
                <span className="gradient-text italic">motherhood.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-500 max-w-xl leading-relaxed">
                From traditional Zimbabwean wisdom to modern medical science - 
                everything you need on your fertility journey, in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/fertility-check" className="btn-primary flex items-center justify-center space-x-2">
                  <span>Take Fertility Check</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/education" className="btn-secondary flex items-center justify-center space-x-2">
                  <span>Explore Resources</span>
                  <BookOpen className="w-5 h-5" />
                </Link>
              </div>
              
              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-terracotta-600">80%</p>
                  <p className="text-sm text-gray-500">of causes are treatable</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <p className="text-3xl font-bold text-forest-600">100%</p>
                  <p className="text-sm text-gray-500">worth fighting for</p>
                </div>
              </div>
            </div>
            
            {/* lotus on the right */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-terracotta-200/50 to-plum-200/50 rounded-full blur-2xl transform scale-110" />
                <img 
                  src={lotus} 
                  alt="Nurturing growth" 
                  className="relative w-80 h-80 md:w-96 md:h-96 object-contain animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">What Genesi Offers</h2>
            <p className="section-subtitle mx-auto">
              From traditional Zimbabwean wisdom to modern medical science - 
              everything you need on your fertility journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card card-hover p-8">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* quote */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-8xl text-terracotta-200 font-serif">"</div>
            <blockquote className="relative z-10">
              <p className="font-serif text-2xl md:text-3xl text-gray-700 italic leading-relaxed">
                Being told you can't have children doesn't mean it's over. 
                It means your path is different - and different paths still lead to beautiful destinations.
              </p>
            </blockquote>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-3">
            <img src={logo} alt="Genesi" className="h-8 w-auto" />
            <span className="font-semibold text-gray-600">Genesi</span>
          </div>
        </div>
      </section>

      {/* infertility causes */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="tag mb-4 inline-block">Understanding Infertility</span>
            <h2 className="section-title mt-4">
              Most causes of infertility are <span className="gradient-text">treatable.</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Knowledge removes fear. Understanding what's happening in your body is the first step toward taking action.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {causes.map((cause, index) => (
              <div key={index} className="card card-hover">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">{cause.name}</h3>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    cause.tag === 'Treatable' 
                      ? 'bg-forest-100 text-forest-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {cause.tag}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{cause.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">
              Faith moves mountains, but <span className="gradient-text">action moves you forward.</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Prayer is the foundation - but God also gives us doctors, food, and the wisdom to take care of our bodies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <span className="text-white font-bold text-xl">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* foods */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="tag mb-4 inline-block">Nourish Your Fertility</span>
            <h2 className="section-title mt-4">
              Foods from the <span className="gradient-text">heart of Zimbabwe.</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Discover traditional Zimbabwean foods packed with fertility-boosting nutrients, 
              available at your nearest market.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {zimbabweFoods.map((food, index) => (
              <div key={index} className="card card-hover flex flex-col sm:flex-row gap-6">
                <div className={`w-full sm:w-24 h-24 ${food.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Utensils className="w-10 h-10 opacity-60" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{food.shonaName}</p>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{food.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{food.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {food.benefits.map((benefit, i) => (
                      <span key={i} className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/education" className="btn-secondary inline-flex items-center space-x-2">
              <span>View All Fertility Foods</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* bottom cta */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-terracotta-500 via-terracotta-600 to-plum-600 p-12 md:p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
                Ready to start your journey?
              </h2>
              <p className="text-terracotta-100 text-lg max-w-2xl mx-auto mb-8">
                Take our fertility assessment to get personalized insights and recommendations 
                tailored to your unique situation.
              </p>
              <Link 
                to="/fertility-check" 
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-terracotta-600 rounded-2xl font-semibold 
                         transition-all duration-300 hover:bg-terracotta-50 hover:shadow-lg"
              >
                <span>Start Fertility Check</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
