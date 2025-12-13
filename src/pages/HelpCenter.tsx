// src/pages/HelpCenter.tsx
import React, { useState } from 'react';
import { 
  Search, MessageCircle, FileText, Video, Mail, ChevronRight, 
  ExternalLink, BookOpen, Shield, Users, Clock,
  Zap, Globe, Phone, Calendar, Send,
  ThumbsUp, ThumbsDown, Download, LifeBuoy,
  ChevronDown, ChevronUp, X
} from 'lucide-react';

// FAQ Data - SaaS specific
const faqCategories = [
  {
    title: 'Getting Started',
    icon: '🚀',
    iconColor: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
    questions: [
      { 
        id: 1, 
        question: 'How do I set up my SaaS dashboard?', 
        answer: 'Navigate to Settings > Dashboard Setup and follow the step-by-step guide. You can customize widgets, arrange layouts, and connect data sources like Stripe, Google Analytics, and more.' 
      },
      { 
        id: 2, 
        question: 'What user roles and permissions are available?', 
        answer: 'We offer three roles: Admin (full access), Editor (can modify content but not settings), and Viewer (read-only access). Contact your workspace admin for permission changes.' 
      },
      { 
        id: 3, 
        question: 'How to invite team members to the dashboard?', 
        answer: 'Go to Team Management > Invite Members. Enter email addresses and assign roles. They\'ll receive an email invitation with setup instructions.' 
      },
    ],
  },
  {
    title: 'Analytics & Reports',
    icon: '📊',
    iconColor: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
    questions: [
      { 
        id: 4, 
        question: 'How to create custom reports?', 
        answer: 'Use the Report Builder in Analytics section. Drag-and-drop metrics, apply filters, and schedule automatic generation. Reports can be exported as CSV, PDF, or scheduled for email delivery.' 
      },
      { 
        id: 5, 
        question: 'What\'s the data refresh frequency?', 
        answer: 'Real-time data updates every 5 minutes for critical metrics. Historical data refreshes daily at 2 AM UTC. You can manually refresh anytime using the refresh button.' 
      },
      { 
        id: 6, 
        question: 'How to export data to CSV/Excel?', 
        answer: 'Click the export button on any report. Choose format and date range. For large exports exceeding 10k rows, use our scheduled export feature available in Business plans.' 
      },
    ],
  },
  {
    title: 'Billing & Subscriptions',
    icon: '💰',
    iconColor: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    questions: [
      { 
        id: 7, 
        question: 'How do I upgrade my subscription plan?', 
        answer: 'Navigate to Settings > Billing > Plans. Select your desired plan and follow the upgrade flow. Pro-rated charges will be applied automatically.' 
      },
      { 
        id: 8, 
        question: 'Can I get an invoice for my payment?', 
        answer: 'Yes, all invoices are available in Settings > Billing > Invoices. You can download PDF invoices or have them automatically emailed each billing cycle.' 
      },
      { 
        id: 9, 
        question: 'What payment methods do you accept?', 
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual Enterprise plans.' 
      },
    ],
  },
  {
    title: 'API & Integrations',
    icon: '🔌',
    iconColor: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20',
    questions: [
      { 
        id: 10, 
        question: 'How do I generate API keys?', 
        answer: 'Go to Settings > API Keys. Click "Generate New Key", name it, and select permissions. Keep your keys secure and never commit them to version control.' 
      },
      { 
        id: 11, 
        question: 'What integrations are available?', 
        answer: 'We integrate with Stripe, PayPal, Google Analytics, Slack, Salesforce, HubSpot, Mailchimp, Zapier, and more.' 
      },
      { 
        id: 12, 
        question: 'How to set up webhooks?', 
        answer: 'Navigate to Settings > Webhooks. Add your endpoint URL, select events to subscribe to, and test the configuration.' 
      },
    ],
  },
];

// Feature Cards
const featureCards = [
  {
    icon: <Video className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: 'Video Tutorials',
    description: 'Step-by-step guides',
    count: '45+',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
    link: '/tutorials'
  },
  {
    icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: 'Documentation',
    description: 'Comprehensive guides',
    count: '200+',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
    link: '/docs'
  },
  {
    icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: 'Community',
    description: 'Connect with users',
    count: '5k+',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    link: '/community'
  },
  {
    icon: <Download className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: 'Resources',
    description: 'Templates & tools',
    count: '25+',
    color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20',
    link: '/resources'
  },
];

// Contact Methods
const contactMethods = [
  {
    title: 'Email Support',
    description: '24-hour response',
    icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" />,
    action: 'Email us',
    color: 'bg-blue-500',
    time: '24/7'
  },
  {
    title: 'Live Chat',
    description: 'Instant responses',
    icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
    action: 'Start Chat',
    color: 'bg-green-500',
    time: '9 AM - 6 PM EST'
  },
  {
    title: 'Schedule Call',
    description: 'Book a demo',
    icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />,
    action: 'Book Now',
    color: 'bg-purple-500',
    time: '24/7 booking'
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [helpfulFeedback, setHelpfulFeedback] = useState<{[key: number]: boolean | null}>({});
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality here
      console.log('Searching for:', searchQuery);
    }
  };

  const markHelpful = (id: number, helpful: boolean) => {
    setHelpfulFeedback(prev => ({...prev, [id]: helpful}));
  };

  const popularSearches = ['Dashboard Setup', 'Data Export', 'Team Permissions', 'Billing'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 lg:hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Search Help Center</h3>
              <button 
                onClick={() => setShowMobileSearch(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Describe your issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </form>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      setShowMobileSearch(false);
                    }}
                    className="text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 sm:pt-8 sm:pb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
              <LifeBuoy className="w-4 h-4" />
              Help Center
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
              How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">help</span> you?
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-4 max-w-2xl mx-auto">
              Get instant answers, browse documentation, or connect with our support team
            </p>
            
            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:block relative max-w-2xl mx-auto">
              <div className="relative shadow-lg rounded-2xl overflow-hidden">
                <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-32 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none border-0"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 sm:px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Mobile Search Button */}
            <div className="lg:hidden flex justify-center">
              <button
                onClick={() => setShowMobileSearch(true)}
                className="w-full max-w-sm flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <Search className="w-5 h-5" />
                  <span>Search for answers...</span>
                </div>
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-lg">
                  ⌘K
                </div>
              </button>
            </div>

            {/* Popular Searches */}
            <div className="hidden sm:flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Popular:</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="text-sm px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats - Responsive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />, value: '98%', label: 'Satisfaction', color: 'text-green-600' },
            { icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, value: '15 min', label: 'Avg Response', color: 'text-blue-600' },
            { icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />, value: '24/7', label: 'Support', color: 'text-purple-600' },
            { icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />, value: '500+', label: 'Articles', color: 'text-orange-600' },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className={`p-1.5 sm:p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                  {stat.icon}
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Access Cards */}
            <div className="mb-8 sm:mb-10">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Quick Access</h2>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {featureCards.map((card, index) => (
                  <a
                    key={index}
                    href={card.link}
                    className="group bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-md hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${card.color}`}>
                        {card.icon}
                      </div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                        {card.count}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1 group-hover:text-blue-600">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  {faqCategories.flatMap(c => c.questions).length} questions
                </div>
              </div>

              {/* Category Filter - Mobile Scrollable */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all ${
                    activeCategory === 'all'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                  }`}
                >
                  All
                </button>
                {faqCategories.map((cat) => (
                  <button
                    key={cat.title}
                    onClick={() => setActiveCategory(cat.title)}
                    className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all ${
                      activeCategory === cat.title
                        ? 'bg-white dark:bg-gray-800 border-2 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-base sm:text-lg">{cat.icon}</span>
                    <span className="hidden sm:inline">{cat.title}</span>
                    <span className="sm:hidden text-xs">{cat.title.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="space-y-3">
                {faqCategories
                  .filter(cat => activeCategory === 'all' || cat.title === activeCategory)
                  .map((category) => (
                    <div key={category.title} className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${category.iconColor}`}>
                          <span className="text-lg">{category.icon}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          {category.title}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {category.questions.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-sm transition-all"
                          >
                            <button
                              onClick={() => setExpandedQuestion(expandedQuestion === item.id ? null : item.id)}
                              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                            >
                              <div className="flex-1 pr-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                                  {item.question}
                                </h4>
                              </div>
                              {expandedQuestion === item.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              )}
                            </button>
                            {expandedQuestion === item.id && (
                              <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
                                  {item.answer}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Was this helpful?</span>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => markHelpful(item.id, true)}
                                        className={`p-2 rounded-lg ${
                                          helpfulFeedback[item.id] === true
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                        }`}
                                      >
                                        <ThumbsUp className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => markHelpful(item.id, false)}
                                        className={`p-2 rounded-lg ${
                                          helpfulFeedback[item.id] === false
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                        }`}
                                      >
                                        <ThumbsDown className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1">
                                    Share <ExternalLink className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:space-y-8">
            {/* Contact Support */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-white/10">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg sm:text-xl">Contact Support</h3>
                  <p className="text-blue-100 text-sm">We're here to help</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${method.color}`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm sm:text-base">{method.title}</div>
                        <div className="text-blue-200 text-xs sm:text-sm">{method.description}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{method.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="text-sm sm:text-base font-medium hover:text-blue-200 transition-colors">
                        {method.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">All Systems Operational</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Just now</div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { service: 'API Gateway', status: 'operational' },
                  { service: 'Analytics', status: 'operational' },
                  { service: 'Database', status: 'operational' },
                  { service: 'Payments', status: 'operational' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {item.service}
                    </div>
                    <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      item.status === 'operational' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
              <a href="/status" className="block mt-4 sm:mt-6 text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium border-t border-gray-100 dark:border-gray-700 pt-4">
                View status report
              </a>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Quick Actions</h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { icon: <Send className="w-4 h-4" />, label: 'Submit Ticket', color: 'bg-blue-500' },
                  { icon: <Calendar className="w-4 h-4" />, label: 'Schedule Call', color: 'bg-purple-500' },
                  { icon: <FileText className="w-4 h-4" />, label: 'View Tickets', color: 'bg-green-500' },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                    onClick={() => console.log(`Opening: ${action.label}`)}
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <div className="text-white w-4 h-4">{action.icon}</div>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{action.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 mb-8 sm:mt-16 sm:mb-12">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 lg:p-10 text-center">
            <div className="relative">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">Still need help?</h2>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
                Our dedicated support team is here to help you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button 
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-blue-700 rounded-lg sm:rounded-xl font-bold hover:shadow-lg transition-all text-sm sm:text-base"
                  onClick={() => console.log('Opening support ticket form...')}
                >
                  Submit Ticket
                </button>
                <button 
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 text-white border border-white/30 rounded-lg sm:rounded-xl font-bold hover:bg-white/20 transition-all text-sm sm:text-base"
                  onClick={() => console.log('Opening calendar...')}
                >
                  Schedule Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}