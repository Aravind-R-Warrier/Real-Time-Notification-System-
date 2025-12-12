import React, { useState } from 'react';
import { 
  Search, MessageCircle, FileText, Video, Mail, ChevronRight, 
  ExternalLink, HelpCircle, BookOpen, Shield, Users, Clock,
  Zap, Star, TrendingUp, Globe, Phone, Calendar, Send,
  ThumbsUp, ThumbsDown, Download, Settings, BarChart,
  Bell, CreditCard, Grid, AlertCircle
} from 'lucide-react';

// FAQ Data
const faqCategories = [
  {
    title: 'Getting Started',
    icon: '🚀',
    iconColor: 'text-purple-600 bg-purple-100',
    questions: [
      { 
        id: 1, 
        question: 'How do I set up my dashboard?', 
        answer: 'Navigate to Settings > Dashboard Setup and follow the step-by-step guide. You can customize widgets, arrange layouts, and connect data sources.' 
      },
      { 
        id: 2, 
        question: 'What permissions do I need?', 
        answer: 'Admin users have full access. Editors can modify content but not settings. Viewers have read-only access. Contact your workspace admin for permission changes.' 
      },
      { 
        id: 3, 
        question: 'How to invite team members?', 
        answer: 'Go to Team Management > Invite Members. Enter email addresses and assign roles. They\'ll receive an email invitation.' 
      },
    ],
  },
  {
    title: 'Analytics',
    icon: '📊',
    iconColor: 'text-blue-600 bg-blue-100',
    questions: [
      { 
        id: 4, 
        question: 'How to create custom reports?', 
        answer: 'Use the Report Builder in Analytics section. Drag-and-drop metrics, apply filters, and schedule automatic generation.' 
      },
      { 
        id: 5, 
        question: 'Data refresh frequency?', 
        answer: 'Real-time data updates every 15 minutes. Historical data refreshes daily at 2 AM UTC. You can manually refresh anytime.' 
      },
      { 
        id: 6, 
        question: 'Exporting data to CSV/Excel', 
        answer: 'Click the export button on any report. Choose format and date range. For large exports, use scheduled exports.' 
      },
    ],
  },
  {
    title: 'Notifications',
    icon: '🔔',
    iconColor: 'text-green-600 bg-green-100',
    questions: [
      { 
        id: 7, 
        question: 'Setting up alert thresholds', 
        answer: 'Go to Notifications > Alert Rules. Define conditions, thresholds, and notification channels (email, Slack, in-app).' 
      },
      { 
        id: 8, 
        question: 'Managing notification preferences', 
        answer: 'Each user can customize preferences in Profile > Notifications. Team-wide defaults are set by admins.' 
      },
    ],
  },
  {
    title: 'Importants',
    icon: '❗',
    iconColor: 'text-green-600 bg-green-100',
    questions: [
      { 
        id: 7, 
        question: 'Setting up alert thresholds', 
        answer: 'Go to Notifications > Alert Rules. Define conditions, thresholds, and notification channels (email, Slack, in-app).' 
      },
      { 
        id: 8, 
        question: 'Managing notification preferences', 
        answer: 'Each user can customize preferences in Profile > Notifications. Team-wide defaults are set by admins.' 
      },
      { 
        id: 4, 
        question: 'How to create custom reports?', 
        answer: 'Use the Report Builder in Analytics section. Drag-and-drop metrics, apply filters, and schedule automatic generation.' 
      },
      { 
        id: 5, 
        question: 'Data refresh frequency?', 
        answer: 'Real-time data updates every 15 minutes. Historical data refreshes daily at 2 AM UTC. You can manually refresh anytime.' 
      },
    ],
  },
 
];

// Feature Cards
const featureCards = [
  {
    icon: <Video className="w-6 h-6" />,
    title: 'Video Tutorials',
    description: 'Step-by-step video guides',
    count: '45+ videos',
    color: 'bg-purple-500',
    link: '/tutorials'
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Documentation',
    description: 'Comprehensive guides',
    count: '200+ articles',
    color: 'bg-blue-500',
    link: '/docs'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Community',
    description: 'Connect with users',
    count: '5k+ members',
    color: 'bg-green-500',
    link: '/community'
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: 'Resources',
    description: 'Templates & tools',
    count: '25+ resources',
    color: 'bg-orange-500',
    link: '/resources'
  },
];

// Contact Methods
const contactMethods = [
  {
    title: 'Email Support',
    description: '24-hour response time',
    icon: <Mail className="w-5 h-5" />,
    action: 'support@nexusdash.com',
    color: 'from-blue-500 to-blue-600',
    time: '24/7',
    badge: 'Recommended'
  },
  {
    title: 'Live Chat',
    description: 'Instant responses',
    icon: <MessageCircle className="w-5 h-5" />,
    action: 'Start Chat',
    color: 'from-green-500 to-green-600',
    time: '9 AM - 6 PM EST'
  },
  {
    title: 'Phone Support',
    description: 'Direct conversation',
    icon: <Phone className="w-5 h-5" />,
    action: '+1 (555) 123-4567',
    color: 'from-purple-500 to-purple-600',
    time: 'Mon-Fri, 9 AM - 5 PM'
  },
  {
    title: 'Schedule Call',
    description: 'Book a demo session',
    icon: <Calendar className="w-5 h-5" />,
    action: 'Book Now',
    color: 'from-orange-500 to-orange-600',
    time: '24/7 booking'
  },
];



export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [helpfulFeedback, setHelpfulFeedback] = useState<{[key: number]: boolean | null}>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const markHelpful = (id: number, helpful: boolean) => {
    setHelpfulFeedback(prev => ({...prev, [id]: helpful}));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
    

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">help</span> you today?
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Get instant answers, browse documentation, or connect with our support team
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="relative shadow-xl rounded-2xl overflow-hidden">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Describe your issue or search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-32 py-4 bg-white text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <span className="text-sm text-gray-500 font-medium">Popular:</span>
                {['Dashboard Setup', 'Data Export', 'Team Permissions', 'Billing', 'API Keys'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="text-sm px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all hover:scale-105 shadow-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Clock className="w-5 h-5" />, value: '98%', label: 'Satisfaction Rate', color: 'text-green-600' },
            { icon: <Zap className="w-5 h-5" />, value: '15 min', label: 'Avg Response', color: 'text-blue-600' },
            { icon: <Users className="w-5 h-5" />, value: '24/7', label: 'Support Available', color: 'text-purple-600' },
            { icon: <BookOpen className="w-5 h-5" />, value: '500+', label: 'Articles', color: 'text-orange-600' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                  {stat.icon}
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Feature Cards */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick Access</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View all resources <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featureCards.map((card, index) => (
                  <a
                    key={index}
                    href={card.link}
                    className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                        <div className={card.color.replace('bg-', 'text-')}>
                          {card.icon}
                        </div>
                      </div>
                      <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {card.count}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                <div className="text-sm text-gray-500">
                  {faqCategories.flatMap(c => c.questions).length} questions
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-medium transition-all ${
                    activeCategory === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  All Categories
                </button>
                {faqCategories.map((cat) => (
                  <button
                    key={cat.title}
                    onClick={() => setActiveCategory(cat.title)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                      activeCategory === cat.title
                        ? 'bg-white border-2 border-blue-500 text-blue-700 shadow-sm'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    {cat.title}
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
                        <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                      </div>
                      <div className="space-y-3">
                        {category.questions.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                          >
                            <button
                              onClick={() => setExpandedQuestion(expandedQuestion === item.id ? null : item.id)}
                              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-lg">{item.question}</h4>
                              </div>
                              <ChevronRight
                                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                  expandedQuestion === item.id ? 'rotate-90' : ''
                                }`}
                              />
                            </button>
                            {expandedQuestion === item.id && (
                              <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                                <p className="text-gray-600 mb-6">{item.answer}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">Was this helpful?</span>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => markHelpful(item.id, true)}
                                        className={`p-2 rounded-lg ${
                                          helpfulFeedback[item.id] === true
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                      >
                                        <ThumbsUp className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => markHelpful(item.id, false)}
                                        className={`p-2 rounded-lg ${
                                          helpfulFeedback[item.id] === false
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                      >
                                        <ThumbsDown className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Share article <ExternalLink className="w-3 h-3 inline ml-1" />
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
          <div className="space-y-8">
            {/* Contact Support */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-white/10">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Contact Support</h3>
                    <p className="text-gray-300 text-sm">We're here to help</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  {contactMethods.map((method, index) => (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer group border border-white/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color}`}>
                            {method.icon}
                          </div>
                          <div>
                            <div className="font-semibold">{method.title}</div>
                            <div className="text-sm text-gray-400">{method.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">{method.time}</span>
                            </div>
                          </div>
                        </div>
                        {method.badge && (
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium">
                            {method.badge}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="text-sm font-medium group-hover:text-blue-300 transition-colors">
                          {method.action}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Widget */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">System Status</h3>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">All Systems Operational</span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { service: 'API Gateway', status: 'operational', uptime: '99.9%' },
                  { service: 'Analytics Engine', status: 'operational', uptime: '99.8%' },
                  { service: 'Database Cluster', status: 'operational', uptime: '99.9%' },
                  { service: 'Notification Service', status: 'degraded', uptime: '95.2%' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{item.service}</div>
                      <div className="text-xs text-gray-500">{item.uptime} uptime</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'operational' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
              <a href="/status" className="block mt-6 text-center text-sm text-blue-600 hover:text-blue-700 font-medium border-t border-gray-100 pt-4">
                View detailed status report
              </a>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: <Send className="w-4 h-4" />, label: 'Submit Ticket', color: 'bg-blue-500' },
                  { icon: <Calendar className="w-4 h-4" />, label: 'Schedule Call', color: 'bg-purple-500' },
                  { icon: <FileText className="w-4 h-4" />, label: 'View Tickets', color: 'bg-green-500' },
                  { icon: <Download className="w-4 h-4" />, label: 'Download Guide', color: 'bg-orange-500' },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <div className="text-white">{action.icon}</div>
                    </div>
                    <span className="font-medium text-gray-900">{action.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-10 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">Still need help?</h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                Our dedicated support team is here to help you with any questions or issues you might have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold hover:shadow-2xl transition-all hover:scale-[1.02]">
                  Submit Support Ticket
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 transition-all">
                  Schedule a Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

  
    </div>
  );
}