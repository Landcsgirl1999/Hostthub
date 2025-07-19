'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Calendar,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';
import { getCopyrightText } from '../../../lib/utils';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  fullContent: string;
  category: string;
  tags: string[];
  readTime: number;
  lastUpdated: string;
  author: string;
  helpful: number;
  notHelpful: number;
}

const helpArticles: HelpArticle[] = [
  {
    id: '1',
    title: 'Complete Setup Guide: From Zero to First Booking',
    content: 'Step-by-step guide to setting up your HostIt account, adding properties, configuring pricing, and getting your first booking.',
    fullContent: `
# Complete Setup Guide: From Zero to First Booking

Welcome to Hostithub! This comprehensive guide will walk you through setting up your account and getting your first booking in just a few simple steps.

## Step 1: Account Setup

### 1.1 Create Your Account
- Visit hostithub.com and click "Get Started"
- Enter your email address and create a secure password
- Verify your email address through the confirmation link

### 1.2 Complete Your Profile
- Add your business information
- Upload a profile photo
- Set your timezone and preferred currency
- Configure notification preferences

## Step 2: Add Your First Property

### 2.1 Property Information
- Property name and description
- Address and location details
- Property type (house, apartment, villa, etc.)
- Number of bedrooms, bathrooms, and guests
- Amenities and features

### 2.2 Photos and Media
- Upload high-quality photos (minimum 10 recommended)
- Add virtual tour links if available
- Include floor plans and property maps
- Highlight unique features and amenities

### 2.3 Property Settings
- Set base pricing for your property
- Configure minimum and maximum stay requirements
- Set up house rules and policies
- Configure check-in/check-out times

## Step 3: Configure Pricing Strategy

### 3.1 Base Pricing
- Set your base nightly rate
- Configure seasonal pricing adjustments
- Set up special rates for longer stays
- Define minimum stay requirements

### 3.2 AI Dynamic Pricing
- Enable AI-powered dynamic pricing
- Set minimum and maximum rate limits
- Configure pricing factors (demand, events, weather)
- Review and adjust pricing recommendations

### 3.3 Additional Fees
- Cleaning fees
- Service fees
- Security deposits
- Pet fees (if applicable)

## Step 4: Calendar and Availability

### 4.1 Calendar Setup
- Set your availability calendar
- Block dates for maintenance or personal use
- Configure instant booking settings
- Set up advance booking limits

### 4.2 Channel Integration
- Connect your Airbnb account
- Sync with VRBO/HomeAway
- Integrate with Booking.com
- Set up direct booking capabilities

## Step 5: Guest Communication

### 5.1 Automated Messages
- Welcome message template
- Check-in instructions
- House rules and guidelines
- Check-out instructions
- Follow-up messages

### 5.2 Response Settings
- Set auto-response times
- Configure message templates
- Set up emergency contact information
- Enable instant booking confirmations

## Step 6: Task Management

### 6.1 Cleaning Schedule
- Set up automated cleaning tasks
- Assign cleaning team members
- Configure cleaning checklists
- Set up quality control processes

### 6.2 Maintenance Tasks
- Schedule regular maintenance
- Set up repair request workflows
- Configure emergency contact procedures
- Track maintenance history

## Step 7: Financial Setup

### 7.1 Payment Processing
- Connect your bank account
- Set up payment methods
- Configure payout schedules
- Set up tax collection

### 7.2 Financial Tracking
- Configure expense categories
- Set up income tracking
- Enable financial reporting
- Set up homeowner statements

## Step 8: Launch and Marketing

### 8.1 Property Optimization
- Optimize your listing title and description
- Use high-quality photos and virtual tours
- Set competitive pricing
- Enable instant booking

### 8.2 Marketing Channels
- Share on social media
- Create direct booking links
- Set up email marketing campaigns
- Use paid advertising (optional)

## Step 9: Monitor and Optimize

### 9.1 Performance Tracking
- Monitor booking rates
- Track revenue performance
- Analyze guest reviews
- Monitor competitor pricing

### 9.2 Continuous Improvement
- Update photos and descriptions
- Adjust pricing based on performance
- Optimize based on guest feedback
- Expand to additional properties

## Getting Your First Booking

### Tips for Success
1. **Competitive Pricing**: Start with competitive rates to attract initial bookings
2. **Professional Photos**: Invest in high-quality photography
3. **Quick Responses**: Respond to inquiries within 1 hour
4. **Flexible Policies**: Offer flexible cancellation policies initially
5. **Guest Reviews**: Encourage and respond to guest reviews

### Common Mistakes to Avoid
- Setting prices too high initially
- Poor quality photos
- Slow response times
- Inflexible booking policies
- Incomplete property information

## Need Help?

If you encounter any issues during setup, our support team is here to help:
- **Email**: support@hostithub.com
- **Phone**: 1-800-HOSTITHUB
- **Live Chat**: Available 24/7 in your dashboard
- **Help Center**: Comprehensive guides and FAQs

Congratulations on taking the first step toward vacation rental success! With Hostithub's AI-powered platform, you're well-equipped to maximize your property's potential and provide exceptional guest experiences.
    `,
    category: 'getting-started',
    tags: ['setup', 'onboarding', 'first-booking'],
    readTime: 8,
    lastUpdated: '2024-01-15',
    author: 'HostIt Team',
    helpful: 127,
    notHelpful: 3
  },
  {
    id: '2',
    title: 'AI Dynamic Pricing: Advanced Configuration',
    content: 'Learn how to fine-tune your AI pricing strategy, set minimum and maximum rates, and understand the factors that influence pricing decisions.',
    fullContent: `
# AI Dynamic Pricing: Advanced Configuration

Master the art of AI-powered dynamic pricing to maximize your revenue while staying competitive in your market.

## Understanding AI Dynamic Pricing

### How It Works
Our AI analyzes thousands of data points to optimize your pricing:
- **Market Demand**: Real-time booking patterns and demand fluctuations
- **Competitor Pricing**: Analysis of similar properties in your area
- **Seasonal Trends**: Historical data on seasonal price variations
- **Local Events**: Concerts, festivals, conferences, and sporting events
- **Weather Patterns**: Impact of weather on booking behavior
- **Economic Factors**: Local economic conditions and travel trends

### AI Learning Process
The AI continuously learns from:
- Your booking patterns and success rates
- Guest behavior and preferences
- Market response to price changes
- Seasonal and event-driven demand

## Advanced Configuration Settings

### 1. Base Pricing Strategy

#### Setting Your Base Rate
- **Market Analysis**: Review comparable properties in your area
- **Cost Calculation**: Factor in mortgage, utilities, maintenance, and management fees
- **Profit Margin**: Determine your desired profit margin
- **Seasonal Adjustments**: Set baseline rates for different seasons

#### Minimum and Maximum Rates
- **Floor Price**: Set absolute minimum to cover costs
- **Ceiling Price**: Set maximum based on property value and market conditions
- **Dynamic Range**: Allow AI to adjust within your defined range

### 2. Demand-Based Pricing

#### High Demand Periods
- **Event Pricing**: Automatically increase rates during local events
- **Holiday Pricing**: Set premium rates for major holidays
- **Peak Season**: Configure seasonal maximum rates
- **Last-Minute Pricing**: Adjust rates for short-notice bookings

#### Low Demand Periods
- **Off-Season Discounts**: Reduce rates during slow periods
- **Midweek Specials**: Offer discounts for midweek stays
- **Extended Stay Discounts**: Incentivize longer bookings
- **Flash Sales**: Create limited-time promotional rates

### 3. Competitive Intelligence

#### Market Positioning
- **Competitor Analysis**: Monitor similar properties in your area
- **Price Positioning**: Position yourself competitively in the market
- **Value Proposition**: Highlight unique features that justify premium pricing
- **Market Share**: Track your market share and adjust accordingly

#### Automated Adjustments
- **Price Matching**: Automatically match competitor prices
- **Premium Positioning**: Maintain premium pricing for superior properties
- **Market Leadership**: Set prices that influence market trends
- **Responsive Pricing**: Adjust quickly to market changes

### 4. Guest Behavior Analysis

#### Booking Patterns
- **Advance Booking**: Analyze how far in advance guests book
- **Length of Stay**: Optimize pricing for different stay durations
- **Guest Preferences**: Understand what guests value most
- **Repeat Bookings**: Reward returning guests with special rates

#### Price Sensitivity
- **Elasticity Testing**: Test different price points to find optimal rates
- **Guest Segmentation**: Price differently for different guest types
- **Value Perception**: Understand what guests are willing to pay for
- **Conversion Optimization**: Balance price and booking conversion rates

## Advanced Features

### 1. Custom Pricing Rules

#### Event-Based Pricing
- **Local Events**: Automatically adjust rates for concerts, festivals, etc.
- **Sports Events**: Increase rates during major sporting events
- **Conferences**: Premium pricing during business conferences
- **Holiday Periods**: Special rates for major holidays

#### Weather-Based Pricing
- **Weather Forecasts**: Adjust rates based on weather predictions
- **Seasonal Weather**: Account for seasonal weather patterns
- **Weather Events**: Special pricing during extreme weather
- **Climate Preferences**: Price based on climate preferences

### 2. Revenue Optimization

#### Yield Management
- **Occupancy Optimization**: Balance occupancy and rate optimization
- **Revenue per Available Room**: Maximize RevPAR metrics
- **Profit Optimization**: Focus on profit rather than just revenue
- **Long-term Value**: Consider guest lifetime value

#### Dynamic Adjustments
- **Real-time Updates**: Adjust prices based on real-time demand
- **Predictive Analytics**: Use AI predictions to set future rates
- **A/B Testing**: Test different pricing strategies
- **Performance Tracking**: Monitor the impact of price changes

### 3. Guest Experience Pricing

#### Value-Added Services
- **Premium Amenities**: Price premium for luxury amenities
- **Concierge Services**: Additional charges for concierge services
- **Special Requests**: Pricing for special arrangements
- **Exclusive Access**: Premium pricing for exclusive features

#### Guest Satisfaction
- **Quality Pricing**: Price based on guest satisfaction scores
- **Review-Based Pricing**: Adjust rates based on review performance
- **Guest Feedback**: Incorporate guest feedback into pricing
- **Service Quality**: Price based on service quality levels

## Monitoring and Analytics

### 1. Performance Metrics

#### Key Performance Indicators
- **Revenue Growth**: Track revenue increases over time
- **Occupancy Rates**: Monitor booking success rates
- **Average Daily Rate**: Track average nightly rates
- **RevPAR**: Revenue per available room metrics

#### Competitive Analysis
- **Market Position**: Compare your performance to competitors
- **Price Positioning**: Analyze your price position in the market
- **Market Share**: Track your share of the local market
- **Competitive Advantages**: Identify and leverage your advantages

### 2. Reporting and Insights

#### Daily Reports
- **Booking Activity**: Daily booking and revenue reports
- **Price Changes**: Track all price adjustments
- **Market Trends**: Monitor market trends and changes
- **Performance Alerts**: Get notified of significant changes

#### Weekly Analysis
- **Performance Review**: Weekly performance analysis
- **Market Comparison**: Compare your performance to the market
- **Trend Analysis**: Identify emerging trends
- **Strategy Adjustments**: Plan adjustments based on data

### 3. Optimization Recommendations

#### AI Suggestions
- **Price Recommendations**: AI-generated pricing suggestions
- **Market Opportunities**: Identify untapped market opportunities
- **Risk Alerts**: Get notified of potential risks
- **Optimization Tips**: Receive optimization recommendations

#### Manual Overrides
- **Custom Adjustments**: Make manual price adjustments
- **Special Circumstances**: Handle special pricing situations
- **Market Conditions**: Respond to changing market conditions
- **Strategic Decisions**: Implement strategic pricing decisions

## Best Practices

### 1. Regular Monitoring
- Check pricing performance daily
- Review market conditions weekly
- Analyze competitor pricing monthly
- Adjust strategies quarterly

### 2. Data-Driven Decisions
- Base decisions on data, not emotions
- Test different pricing strategies
- Monitor the impact of changes
- Learn from successful strategies

### 3. Guest-Centric Approach
- Consider guest value and satisfaction
- Balance revenue with guest experience
- Respond to guest feedback
- Maintain competitive value proposition

### 4. Continuous Learning
- Stay updated on market trends
- Learn from competitor strategies
- Adapt to changing market conditions
- Optimize based on performance data

## Troubleshooting

### Common Issues
- **Pricing Too High**: Reduce rates and monitor demand
- **Pricing Too Low**: Increase rates gradually
- **Market Changes**: Adjust to changing market conditions
- **Competition**: Respond to competitive pricing changes

### Getting Help
- **Support Team**: Contact our support team for assistance
- **Documentation**: Review our comprehensive documentation
- **Community**: Join our host community for tips and advice
- **Training**: Attend our pricing optimization webinars

Mastering AI dynamic pricing takes time and practice, but with the right configuration and monitoring, you can significantly increase your revenue while providing excellent value to your guests.
    `,
    category: 'ai',
    tags: ['ai-pricing', 'configuration', 'advanced'],
    readTime: 12,
    lastUpdated: '2024-01-10',
    author: 'AI Pricing Team',
    helpful: 89,
    notHelpful: 2
  },
  {
    id: '3',
    title: 'Multi-Platform Calendar Sync: Best Practices',
    content: 'How to effectively manage your calendar across multiple booking platforms, prevent conflicts, and maintain consistency.',
    fullContent: `
# Multi-Platform Calendar Sync: Best Practices

Master the art of managing your vacation rental calendar across multiple booking platforms to maximize bookings and prevent double-bookings.

## Understanding Multi-Platform Calendar Sync

### Why Multi-Platform Sync Matters
Managing multiple booking platforms can significantly increase your revenue, but it also introduces complexity:
- **Increased Exposure**: Reach more potential guests across different platforms
- **Revenue Maximization**: Capture bookings from different guest segments
- **Risk Management**: Prevent double-bookings and calendar conflicts
- **Operational Efficiency**: Streamline your booking management process

### How HostIt Sync Works
Our intelligent sync system:
- **Real-time Updates**: Instantly syncs changes across all platforms
- **Conflict Prevention**: Automatically prevents double-bookings
- **Smart Prioritization**: Handles booking conflicts intelligently
- **Platform Optimization**: Optimizes for each platform's unique features

## Platform Integration Setup

### 1. Airbnb Integration

#### Initial Setup
- **API Connection**: Connect your Airbnb account via API
- **Calendar Permissions**: Grant calendar access permissions
- **Sync Settings**: Configure sync frequency and settings
- **Property Mapping**: Map your HostIt properties to Airbnb listings

#### Best Practices
- **Instant Booking**: Enable instant booking for faster conversions
- **Smart Pricing**: Use Airbnb's smart pricing alongside HostIt's AI pricing
- **Response Time**: Maintain quick response times for inquiries
- **Review Management**: Actively manage your Airbnb reviews

### 2. VRBO/HomeAway Integration

#### Setup Process
- **Account Connection**: Connect your VRBO/HomeAway account
- **Calendar Sync**: Enable two-way calendar synchronization
- **Property Configuration**: Configure property settings and amenities
- **Pricing Strategy**: Set up competitive pricing for the VRBO market

#### Optimization Tips
- **Professional Photos**: Use high-quality, professional photos
- **Detailed Descriptions**: Provide comprehensive property descriptions
- **Guest Communication**: Maintain excellent guest communication
- **Review Responses**: Respond to all reviews promptly

### 3. Booking.com Integration

#### Integration Steps
- **Partner Account**: Set up your Booking.com partner account
- **API Connection**: Connect via Booking.com's API
- **Calendar Management**: Configure calendar sync settings
- **Property Optimization**: Optimize your Booking.com listings

#### Platform-Specific Strategies
- **Commission Structure**: Understand Booking.com's commission model
- **Guest Expectations**: Adapt to Booking.com's guest expectations
- **Competitive Pricing**: Price competitively for the Booking.com market
- **Quality Standards**: Maintain Booking.com's quality standards

### 4. Direct Booking Platform

#### Website Integration
- **Website Calendar**: Integrate calendar with your direct booking website
- **Payment Processing**: Set up secure payment processing
- **Guest Portal**: Create a guest portal for direct bookings
- **Marketing Integration**: Integrate with your marketing campaigns

#### Direct Booking Advantages
- **No Commission**: Avoid platform commission fees
- **Brand Control**: Maintain full control over your brand
- **Guest Relationships**: Build direct relationships with guests
- **Customization**: Customize the booking experience

## Calendar Management Strategies

### 1. Centralized Calendar Management

#### Single Source of Truth
- **HostIt Dashboard**: Use HostIt as your primary calendar
- **Automatic Sync**: Let HostIt handle all platform synchronization
- **Conflict Resolution**: Trust HostIt's conflict resolution system
- **Backup Systems**: Maintain backup calendar systems

#### Calendar Hierarchy
- **Primary Platform**: Designate your primary booking platform
- **Secondary Platforms**: Configure secondary platforms
- **Sync Priority**: Set sync priorities for different platforms
- **Manual Overrides**: Reserve manual override capabilities

### 2. Booking Conflict Resolution

#### Automatic Resolution
- **First-Come-First-Served**: Process bookings in order received
- **Platform Priority**: Give priority to higher-value platforms
- **Guest Value**: Consider guest lifetime value in conflicts
- **Revenue Optimization**: Optimize for maximum revenue

#### Manual Intervention
- **Conflict Alerts**: Get notified of booking conflicts
- **Manual Resolution**: Manually resolve complex conflicts
- **Guest Communication**: Communicate with affected guests
- **Compensation Strategies**: Offer compensation for conflicts

### 3. Calendar Optimization

#### Availability Management
- **Blocked Dates**: Block dates for maintenance or personal use
- **Minimum Stays**: Set minimum stay requirements
- **Advance Booking**: Configure advance booking limits
- **Instant Booking**: Enable instant booking where appropriate

#### Pricing Synchronization
- **Base Pricing**: Maintain consistent base pricing across platforms
- **Dynamic Adjustments**: Allow platform-specific pricing adjustments
- **Seasonal Pricing**: Synchronize seasonal pricing changes
- **Special Rates**: Coordinate special rates across platforms

## Advanced Sync Features

### 1. Smart Calendar Rules

#### Automated Rules
- **Minimum Notice**: Set minimum notice requirements
- **Maximum Advance**: Limit how far in advance guests can book
- **Blocked Periods**: Automatically block maintenance periods
- **Seasonal Blocks**: Block dates for seasonal closures

#### Custom Rules
- **Platform-Specific Rules**: Set different rules for different platforms
- **Guest Type Rules**: Apply different rules for different guest types
- **Event-Based Rules**: Adjust rules based on local events
- **Weather-Based Rules**: Modify rules based on weather conditions

### 2. Revenue Optimization

#### Yield Management
- **Occupancy Optimization**: Balance occupancy and rate optimization
- **Platform Mix**: Optimize the mix of bookings across platforms
- **Revenue per Platform**: Track revenue performance by platform
- **Commission Optimization**: Minimize commission costs

#### Dynamic Pricing
- **Platform-Specific Pricing**: Adjust pricing for different platforms
- **Demand-Based Pricing**: Use demand data to optimize pricing
- **Competitive Pricing**: Stay competitive across all platforms
- **Revenue Maximization**: Maximize total revenue across platforms

### 3. Guest Experience Management

#### Consistent Experience
- **Standardized Communication**: Maintain consistent communication across platforms
- **Quality Standards**: Maintain consistent quality standards
- **Guest Expectations**: Manage guest expectations across platforms
- **Service Delivery**: Deliver consistent service regardless of platform

#### Platform-Specific Optimization
- **Guest Preferences**: Adapt to platform-specific guest preferences
- **Communication Styles**: Adjust communication for different platforms
- **Service Levels**: Provide appropriate service levels for each platform
- **Guest Satisfaction**: Optimize for platform-specific satisfaction metrics

## Monitoring and Analytics

### 1. Performance Tracking

#### Key Metrics
- **Booking Distribution**: Track bookings across different platforms
- **Revenue by Platform**: Monitor revenue performance by platform
- **Occupancy Rates**: Track overall and platform-specific occupancy
- **Guest Satisfaction**: Monitor satisfaction scores by platform

#### Platform Comparison
- **Performance Analysis**: Compare performance across platforms
- **Guest Demographics**: Analyze guest demographics by platform
- **Booking Patterns**: Understand booking patterns by platform
- **Revenue Optimization**: Identify optimization opportunities

### 2. Conflict Management

#### Conflict Tracking
- **Conflict Frequency**: Monitor the frequency of booking conflicts
- **Resolution Time**: Track how quickly conflicts are resolved
- **Guest Impact**: Assess the impact of conflicts on guests
- **Revenue Impact**: Measure the revenue impact of conflicts

#### Prevention Strategies
- **Predictive Analytics**: Use data to predict potential conflicts
- **Proactive Management**: Implement proactive conflict prevention
- **Communication Strategies**: Develop effective communication strategies
- **Compensation Policies**: Establish fair compensation policies

### 3. Optimization Insights

#### Data Analysis
- **Trend Analysis**: Analyze trends in booking patterns
- **Seasonal Patterns**: Understand seasonal booking patterns
- **Platform Performance**: Track platform performance over time
- **Optimization Opportunities**: Identify optimization opportunities

#### Continuous Improvement
- **Strategy Refinement**: Continuously refine your sync strategy
- **Platform Evaluation**: Regularly evaluate platform performance
- **Technology Updates**: Stay updated on sync technology
- **Best Practice Adoption**: Adopt industry best practices

## Troubleshooting Common Issues

### 1. Sync Problems

#### Technical Issues
- **API Connection**: Troubleshoot API connection issues
- **Sync Delays**: Address sync delay problems
- **Data Conflicts**: Resolve data conflict issues
- **Platform Changes**: Adapt to platform API changes

#### Operational Issues
- **Manual Overrides**: Handle manual override conflicts
- **Calendar Conflicts**: Resolve calendar conflict issues
- **Guest Communication**: Manage guest communication during issues
- **Emergency Procedures**: Implement emergency procedures

### 2. Platform-Specific Issues

#### Airbnb Issues
- **Instant Booking Conflicts**: Handle instant booking conflicts
- **Calendar Sync Delays**: Address Airbnb sync delays
- **Pricing Conflicts**: Resolve pricing conflict issues
- **Guest Communication**: Manage Airbnb-specific communication

#### VRBO Issues
- **Calendar Sync Problems**: Troubleshoot VRBO sync issues
- **Pricing Synchronization**: Address pricing sync problems
- **Guest Management**: Handle VRBO-specific guest issues
- **Platform Policies**: Navigate VRBO platform policies

### 3. Guest Experience Issues

#### Communication Problems
- **Platform Confusion**: Help guests navigate multiple platforms
- **Booking Confirmation**: Ensure clear booking confirmations
- **Check-in Instructions**: Provide consistent check-in instructions
- **Support Coordination**: Coordinate support across platforms

#### Service Delivery
- **Quality Consistency**: Maintain consistent service quality
- **Expectation Management**: Manage guest expectations
- **Problem Resolution**: Resolve platform-specific problems
- **Guest Satisfaction**: Ensure guest satisfaction across platforms

## Best Practices Summary

### 1. Setup and Configuration
- Use HostIt as your central calendar management system
- Configure all platforms with consistent settings
- Test sync functionality thoroughly before going live
- Maintain backup systems for critical periods

### 2. Daily Operations
- Monitor calendar sync status daily
- Respond to booking conflicts promptly
- Maintain consistent communication across platforms
- Track performance metrics regularly

### 3. Optimization
- Regularly review platform performance
- Adjust pricing strategies based on data
- Optimize for platform-specific opportunities
- Continuously improve guest experience

### 4. Risk Management
- Implement conflict prevention strategies
- Maintain emergency procedures
- Monitor for technical issues
- Plan for platform changes and updates

By following these best practices, you can effectively manage your vacation rental across multiple platforms while maximizing revenue and providing excellent guest experiences.
    `,
    category: 'calendar',
    tags: ['calendar-sync', 'multi-platform', 'best-practices'],
    readTime: 10,
    lastUpdated: '2024-01-08',
    author: 'Calendar Team',
    helpful: 156,
    notHelpful: 4
  }
];

export default function HelpArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [article, setArticle] = useState<HelpArticle | null>(null);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);

  useEffect(() => {
    const foundArticle = helpArticles.find(a => a.id === resolvedParams.id);
    setArticle(foundArticle || null);
  }, [resolvedParams.id]);

  const handleHelpful = (helpful: boolean) => {
    setIsHelpful(helpful);
    // In a real app, this would send feedback to the backend
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link
            href="/help"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Help Center</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md border-b border-white/20 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Hostithub.com</h1>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Pricing
              </Link>
              <Link href="/demo" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Demo
              </Link>
              <Link href="/consultation" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Consultation
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link
                href="/help"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Help Center
              </Link>
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/help" className="hover:text-blue-600">Help Center</Link>
          <span>/</span>
          <span className="text-gray-900">{article.title}</span>
        </nav>

        {/* Article Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
              {article.category.replace('-', ' ').toUpperCase()}
            </span>
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{article.readTime} min read</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Updated {article.lastUpdated}</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{article.content}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">By {article.author}</span>
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.fullContent.replace(/\n/g, '<br>').replace(/#{1,6}\s+(.+)/g, '<h2>$1</h2>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') }} />
          </div>
        </div>

        {/* Article Tags */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Was this article helpful?</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleHelpful(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isHelpful === true
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Yes ({article.helpful})</span>
            </button>
            <button
              onClick={() => handleHelpful(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isHelpful === false
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>No ({article.notHelpful})</span>
            </button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Related Articles</h3>
          <div className="space-y-4">
            {helpArticles
              .filter(a => a.id !== article.id && a.category === article.category)
              .slice(0, 3)
              .map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/help/${relatedArticle.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900 mb-2">{relatedArticle.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{relatedArticle.content}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{relatedArticle.readTime} min read</span>
                    <span>Updated {relatedArticle.lastUpdated}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our support team is here to help you succeed. Get in touch and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consultation"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Book a Consultation</span>
            </Link>
            <Link
              href="mailto:support@hostit.com"
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-white text-white rounded-full font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Hostithub</span>
              </div>
              <p className="text-gray-600 text-sm">
                The complete AI platform for vacation rental success.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/pricing" className="hover:text-blue-600">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-blue-600">Demo</Link></li>
                <li><Link href="/help" className="hover:text-blue-600">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/consultation" className="hover:text-blue-600">Consultation</Link></li>
                <li><Link href="mailto:support@hostit.com" className="hover:text-blue-600">Email Support</Link></li>
                <li><Link href="/help" className="hover:text-blue-600">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-600">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-600">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>{getCopyrightText('Hostithub')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 