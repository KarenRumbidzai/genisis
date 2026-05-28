import { useState } from 'react'
import { 
  BookOpen, 
  Search, 
  Clock, 
  ArrowRight,
  Leaf,
  Stethoscope,
  Heart,
  Utensils,
  Sparkles,
  Info
} from 'lucide-react'

// filter tabs for the articles section
const categories = [
  { id: 'all', label: 'All Topics', icon: BookOpen },
  { id: 'causes', label: 'Causes of Infertility', icon: Info },
  { id: 'nutrition', label: 'Nutrition & Diet', icon: Utensils },
  { id: 'herbs', label: 'African Herbs', icon: Leaf },
  { id: 'medical', label: 'Medical Interventions', icon: Stethoscope },
  { id: 'wellness', label: 'Wellness & Lifestyle', icon: Sparkles },
  { id: 'stories', label: 'Real Stories', icon: Heart }
]

// article stubs — full content still needs to be written, these are placeholders for now
// TODO: hook these up to actual article pages (or a CMS) when content is ready
const articles = [
  {
    slug: 'fibroids-and-fertility',
    tag: 'Causes of Infertility',
    category: 'causes',
    title: 'Why fibroid location matters more than size',
    readTime: '4 min read',
    excerpt: 'At 26, a doctor handed me surrogacy and adoption papers. I left that office and cried. I felt like a broken machine...',
    featured: true
  },
  {
    slug: 'moringa-fertility',
    tag: 'Nutrition',
    category: 'nutrition',
    title: 'Moringa: the Zimbabwean superfood that supports egg quality',
    readTime: '5 min read',
    excerpt: 'Moringa has been growing quietly in Zimbabwean backyards for generations. Science is now catching up...',
    featured: false
  },
  {
    slug: 'ivf-zimbabwe',
    tag: 'Medical Interventions',
    category: 'medical',
    title: 'IVF in Zimbabwe: what to expect, costs, and where to go',
    readTime: '7 min read',
    excerpt: 'IVF is available in Zimbabwe, and for many women it is not the last resort — it is the right next step.',
    featured: false
  },
  {
    slug: 'herbs',
    tag: 'Herbs',
    category: 'herbs',
    title: 'African herbs for fertility: what is available in Zimbabwe',
    readTime: '5 min read',
    excerpt: 'Traditional knowledge and modern herbalism meet in these fertility-supporting plants...',
    featured: false
  },
  {
    slug: 'causes',
    tag: 'Education',
    category: 'causes',
    title: 'Understanding the causes of female infertility',
    readTime: '5 min read',
    excerpt: 'Infertility is not a punishment. It is a medical condition — and many causes are diagnosable...',
    featured: false
  },
  {
    slug: 'vitex-hormone-balance',
    tag: 'Hormone Balance',
    category: 'herbs',
    title: 'Finding My Rhythm: How Vitex Helped My Cycle Find Its Way',
    readTime: '5 min read',
    excerpt: 'After years of my period arriving whenever it felt like it, I felt out of sync with my own body...',
    featured: false
  },
  {
    slug: 'maca-ashwagandha',
    tag: 'Vitality & Stress',
    category: 'wellness',
    title: 'Reclaiming "Us": Using Maca and Ashwagandha to Fight Fertility Burnout',
    readTime: '4 min read',
    excerpt: 'Fertility tracking can turn intimacy into a chore. We used Maca to bring back the spark...',
    featured: false
  },
  {
    slug: 'uterine-tonics',
    tag: 'Uterine Health',
    category: 'herbs',
    title: 'Preparing the Soil: Tending to the Uterus with Red Clover',
    readTime: '6 min read',
    excerpt: 'I realized I was so focused on the "seed" that I forgot to prepare the "soil."',
    featured: false
  },
  {
    slug: 'foods-to-avoid-ttc',
    tag: 'Nutrition',
    category: 'nutrition',
    title: 'The "Not Now" List: Foods and Herbs to Avoid When TTC',
    readTime: '5 min read',
    excerpt: 'Sometimes progress is not about what you add — but what you remove.',
    featured: true
  }
]

// will add cooking instructions and traditional recipes to each of these later
const zimbabweFoods = [
  {
    name: 'Muboora',
    shonaName: 'Muboora (Pumpkin Leaves)',
    nutrients: ['Folate', 'Iron', 'Calcium'],
    description: 'Tender young pumpkin leaves cooked with tomatoes, onion, and peanut butter.',
    color: 'bg-green-100 text-green-700'
  },
  {
    name: 'Nhopi',
    shonaName: 'Nhopi (Pumpkin Porridge)',
    nutrients: ['Beta-carotene', 'Vitamin E', 'Protein'],
    description: 'Creamy porridge made from mashed butternut or pumpkin with peanut butter.',
    color: 'bg-orange-100 text-orange-700'
  },
  {
    name: 'Nyimo',
    shonaName: 'Nyimo (Roundnuts)',
    nutrients: ['Protein', 'Zinc', 'Iron'],
    description: 'Small, protein-dense legumes - a complete protein source.',
    color: 'bg-amber-100 text-amber-700'
  },
  {
    name: 'Matemba',
    shonaName: 'Matemba / Kapenta',
    nutrients: ['Omega-3', 'Calcium', 'Vitamin D'],
    description: 'Tiny dried fish from Lake Kariba - affordable protein source.',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    name: 'Hwakwe',
    shonaName: 'Hwakwe (Pumpkin Seeds)',
    nutrients: ['Zinc', 'Magnesium', 'Omega-3'],
    description: 'Nutritional powerhouses - a handful provides daily zinc needs.',
    color: 'bg-yellow-100 text-yellow-700'
  },
  {
    name: 'Muriwo',
    shonaName: 'Muriwo (Collard Greens)',
    nutrients: ['Folate', 'Iron', 'Calcium'],
    description: 'Dark leafy greens that accompany almost every Zimbabwean meal.',
    color: 'bg-emerald-100 text-emerald-700'
  }
]

// TODO: add dosage info and safety warnings once we've verified these with a herbalist
const herbs = [
  {
    name: 'Moringa (Mupanga)',
    availability: 'Available in Zimbabwe',
    benefits: 'Antioxidants for egg quality, widely available fresh or as powder',
    color: 'bg-green-100 text-green-700'
  },
  {
    name: 'Baobab (Mbuyu)',
    availability: 'Available in Zimbabwe',
    benefits: 'Vitamin C and calcium for hormone balance',
    color: 'bg-amber-100 text-amber-700'
  },
  {
    name: 'Garlic',
    availability: 'Available in Zimbabwe',
    benefits: 'Anti-inflammatory, hormone-regulating',
    color: 'bg-gray-100 text-gray-700'
  },
  {
    name: 'Vitex / Chasteberry',
    availability: 'Available in South Africa',
    benefits: 'Hormone balance and cycle regulation',
    color: 'bg-purple-100 text-purple-700'
  },
  {
    name: 'Maca Root',
    availability: 'Available in South Africa',
    benefits: 'Ovulation support and energy',
    color: 'bg-yellow-100 text-yellow-700'
  },
  {
    name: 'Red Clover',
    availability: 'Available in South Africa',
    benefits: 'Phytoestrogens to support uterine lining',
    color: 'bg-pink-100 text-pink-700'
  }
]

function Education() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('articles')

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredArticles = articles.filter(a => a.featured)

  return (
    <div className="min-h-screen bg-gradient-warm py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta-100 rounded-2xl mb-6">
            <BookOpen className="w-8 h-8 text-terracotta-600" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-4">
            Knowledge Hub
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Understanding your body is power. Explore articles on fertility causes, 
            Zimbabwean nutrition, traditional herbs, medical options, and wellness tips.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-soft">
            {[
              { id: 'articles', label: 'Articles' },
              { id: 'foods', label: 'Fertility Foods' },
              { id: 'herbs', label: 'African Herbs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-terracotta-500 text-white shadow-soft'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <>
            {/* Search */}
            <div className="max-w-xl mx-auto mb-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-terracotta-300 transition-colors"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      activeCategory === cat.id
                        ? 'bg-terracotta-500 text-white shadow-soft'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Featured Articles */}
            {activeCategory === 'all' && !searchQuery && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Featured Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.map((article) => (
                    <div key={article.slug} className="card card-hover p-8 border-l-4 border-l-terracotta-500">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="tag text-xs">{article.tag}</span>
                        <span className="flex items-center text-xs text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">{article.title}</h3>
                      <p className="text-gray-500 mb-4">{article.excerpt}</p>
                      <button className="flex items-center text-terracotta-600 font-medium hover:text-terracotta-700 transition-colors">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {searchQuery ? 'Search Results' : 'All Articles'}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <div key={article.slug} className="card card-hover">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-xs font-medium px-3 py-1 bg-terracotta-100 text-terracotta-700 rounded-full">
                        {article.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime}
                      </span>
                      <button className="text-terracotta-600 text-sm font-medium hover:text-terracotta-700 transition-colors">
                        Read →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Foods Tab */}
        {activeTab === 'foods' && (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-serif text-gray-800 mb-4">
                Zimbabwean Fertility Foods
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Traditional foods available at your local market that can support your fertility journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {zimbabweFoods.map((food, index) => (
                <div key={index} className="card card-hover">
                  <div className={`w-14 h-14 ${food.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <Utensils className="w-7 h-7" />
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{food.shonaName}</p>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{food.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{food.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {food.nutrients.map((nutrient, i) => (
                      <span key={i} className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {nutrient}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Nutrition Tips */}
            <div className="mt-12 card p-8 bg-gradient-to-br from-forest-50 to-terracotta-50 border-forest-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-6 h-6 text-forest-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Nutrition Tips for Fertility</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <span className="text-forest-500 mt-1">•</span>
                      <span>Eat a rainbow of vegetables daily - aim for 5 different colors</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-forest-500 mt-1">•</span>
                      <span>Include protein with every meal - matemba, nyimo, or eggs</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-forest-500 mt-1">•</span>
                      <span>Choose complex carbs like millet and sweet potatoes over refined grains</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-forest-500 mt-1">•</span>
                      <span>Stay hydrated - drink at least 8 glasses of water daily</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-forest-500 mt-1">•</span>
                      <span>Limit processed foods, sugar, and excessive caffeine</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Herbs Tab */}
        {activeTab === 'herbs' && (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-serif text-gray-800 mb-4">
                African Herbs for Fertility
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Traditional herbs available in Zimbabwe and South Africa that have supported 
                women's reproductive health for generations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {herbs.map((herb, index) => (
                <div key={index} className="card card-hover">
                  <div className={`w-14 h-14 ${herb.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <Leaf className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{herb.name}</h3>
                  <p className="text-xs text-forest-600 font-medium mb-3">{herb.availability}</p>
                  <p className="text-gray-500 text-sm">{herb.benefits}</p>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div className="mt-12 card p-8 bg-amber-50 border-amber-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Info className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Important Safety Note</h3>
                  <p className="text-gray-600 mb-4">
                    Herbs should complement medical care, not replace it. Always inform your 
                    gynaecologist about any herbs you are taking — especially during IUI or IVF 
                    cycles, where some herbs may interact with medication.
                  </p>
                  <p className="text-gray-600">
                    Start with one herb at a time and monitor how your body responds. 
                    Many herbs take 60-90 days to show effects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Education
