// src/pages/HelpCenter.tsx
import React, { useState } from 'react';
import { Card } from '../components/cards/Card';
import { 
  Search, MessageCircle, FileText, Video, Mail, ChevronRight, 
  ExternalLink, HelpCircle, BookOpen, Shield, Users, Clock,
  Zap, Star, TrendingUp, Globe, Phone, Calendar, Send,
  ThumbsUp, ThumbsDown, Download, Settings, BarChart,
  Bell, CreditCard, Grid, AlertCircle, LifeBuoy
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
        answer: 'We integrate with Stripe, PayPal, Google Analytics, Slack, Salesforce, HubSpot, Mailchimp, Zapier, and more. See our Integrations directory for the complete list.' 
      },
      { 
        id: 12, 
        question: 'How to set up webhooks?', 
        answer: 'Navigate to Settings > Webhooks. Add your endpoint URL, select events to subscribe to, and test the configuration. We support retry logic for failed deliveries.' 
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
    description: 'Comprehensive guides & API docs',
    count: '200+ articles',
    color: 'bg-blue-500',
    link: '/docs'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Community',
    description: 'Connect with other SaaS founders',
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
    title: 'Priority Support',
    description: 'For Enterprise plans',
    icon: <Shield className="w-5 h-5" />,
    action: '+1 (555) 123-4567',
    color: 'from-purple-500 to-purple-600',
    time: '24/7 for Enterprise'
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
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const markHelpful = (id: number, helpful: boolean) => {
    setHelpfulFeedback(prev => ({...prev, [id]: helpful}));
    setTimeout(() => {
      alert('Thank you for your feedback!');
    }, 300);
  };

  const popularSearches = ['Dashboard Setup', 'Data Export', 'Team Permissions', 'Billing Issues', 'API Keys', 'User Management'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-500/10 dark:via-transparent dark:to-purple-500/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
              <LifeBuoy className="w-4 h-4" />
              Help Center
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">help</span> you today?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Get instant answers, browse documentation, or connect with our support team
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="relative shadow-xl rounded-2xl overflow-hidden dark:shadow-gray-900/50">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Describe your issue or search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-32 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-lg border-0"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white font-medium rounded-xl hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Popular:</span>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="text-sm px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-105 shadow-sm"
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
            { icon: <Clock className="w-5 h-5" />, value: '98%', label: 'Satisfaction Rate', color: 'text-green-600 dark:text-green-400' },
            { icon: <Zap className="w-5 h-5" />, value: '15 min', label: 'Avg Response Time', color: 'text-blue-600 dark:text-blue-400' },
            { icon: <Users className="w-5 h-5" />, value: '24/7', label: 'Support Available', color: 'text-purple-600 dark:text-purple-400' },
            { icon: <BookOpen className="w-5 h-5" />, value: '500+', label: 'Articles & Guides', color: 'text-orange-600 dark:text-orange-400' },
          ].map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10 dark:bg-opacity-20`}>
                  {stat.icon}
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </Card>
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Access</h2>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1">
                  View all resources <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featureCards.map((card, index) => (
                  <a
                    key={index}
                    href={card.link}
                    className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${card.color} bg-opacity-10 dark:bg-opacity-20`}>
                        <div className={card.color.replace('bg-', 'text-')}>
                          {card.icon}
                        </div>
                      </div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {card.count}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {faqCategories.flatMap(c => c.questions).length} questions
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-medium transition-all ${
                    activeCategory === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
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
                        ? 'bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
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
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h3>
                      </div>
                      <div className="space-y-3">
                        {category.questions.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
                          >
                            <button
                              onClick={() => setExpandedQuestion(expandedQuestion === item.id ? null : item.id)}
                              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                            >
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{item.question}</h4>
                              </div>
                              <ChevronRight
                                className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                                  expandedQuestion === item.id ? 'rotate-90' : ''
                                }`}
                              />
                            </button>
                            {expandedQuestion === item.id && (
                              <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-300 mb-6">{item.answer}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Was this helpful?</span>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => markHelpful(item.id, true)}
                                        className={`p-2 rounded-lg ${
                                          helpfulFeedback[item.id] === true
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                      >
                                        <ThumbsUp className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => markHelpful(item.id, false)}
                                        className={`p-2 rounded-lg ${
                                          helpfulFeedback[item.id] === false
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                      >
                                        <ThumbsDown className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
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
            <Card title="System Status">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">All Systems Operational</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Updated just now</div>
              </div>
              <div className="space-y-4">
                {[
                  { service: 'API Gateway', status: 'operational', uptime: '99.9%' },
                  { service: 'Analytics Engine', status: 'operational', uptime: '99.8%' },
                  { service: 'Database Cluster', status: 'operational', uptime: '99.9%' },
                  { service: 'Notification Service', status: 'operational', uptime: '99.7%' },
                  { service: 'Payment Processing', status: 'operational', uptime: '99.9%' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.service}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.uptime} uptime</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'operational' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
              <a href="/status" className="block mt-6 text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium border-t border-gray-100 dark:border-gray-700 pt-4">
                View detailed status report
              </a>
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <div className="space-y-3">
                {[
                  { icon: <Send className="w-4 h-4" />, label: 'Submit Ticket', color: 'bg-blue-500' },
                  { icon: <Calendar className="w-4 h-4" />, label: 'Schedule Call', color: 'bg-purple-500' },
                  { icon: <FileText className="w-4 h-4" />, label: 'View Tickets', color: 'bg-green-500' },
                  { icon: <Download className="w-4 h-4" />, label: 'Download Guide', color: 'bg-orange-500' },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:-translate-y-0.5"
                    onClick={() => alert(`Opening: ${action.label}`)}
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <div className="text-white">{action.icon}</div>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{action.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-700 dark:via-blue-600 dark:to-indigo-700 p-10 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">Still need help?</h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                Our dedicated support team is here to help you with any questions or issues you might have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold hover:shadow-2xl transition-all hover:scale-[1.02]"
                  onClick={() => alert('Opening support ticket form...')}
                >
                  Submit Support Ticket
                </button>
                <button 
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 transition-all"
                  onClick={() => alert('Opening calendar to schedule call...')}
                >
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