'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, TrendingUp, Target, Zap } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  confidence?: number;
  suggestions?: string[];
  insights?: any;
}

interface UserProfile {
  expertise: 'beginner' | 'intermediate' | 'expert';
  interests: string[];
  goals: string[];
  painPoints: string[];
  interactionHistory: any[];
  learningProgress: any;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI assistant. I can help you optimize your vacation rental business. Ask me anything about pricing, guest management, or property optimization!",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        "How can I increase my property's occupancy rate?",
        "What's the best pricing strategy for my market?",
        "How do I improve my guest reviews?",
        "What amenities should I add to my property?"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize user profile and AI learning
  useEffect(() => {
    initializeUserProfile();
    loadUserLearningData();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize user profile based on stored data
  const initializeUserProfile = () => {
    const storedProfile = localStorage.getItem('hostit_user_profile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      const defaultProfile: UserProfile = {
        expertise: 'beginner',
        interests: ['pricing', 'guest-management', 'property-optimization'],
        goals: ['increase-revenue', 'improve-ratings', 'reduce-operations'],
        painPoints: [],
        interactionHistory: [],
        learningProgress: {
          topicsCovered: [],
          skillLevel: 'beginner',
          recommendationsViewed: 0,
          actionsTaken: 0
        }
      };
      setUserProfile(defaultProfile);
      localStorage.setItem('hostit_user_profile', JSON.stringify(defaultProfile));
    }
  };

  // Load user learning data for AI insights
  const loadUserLearningData = async () => {
    try {
      const aiData = localStorage.getItem('hostit_ai_data') || '[]';
      const parsedData = JSON.parse(aiData);
      
      if (parsedData.length > 0) {
        const insights = analyzeUserBehavior(parsedData);
        setAiInsights(insights);
      }
    } catch (error) {
      console.log('Error loading AI data:', error);
    }
  };

  // Analyze user behavior patterns
  const analyzeUserBehavior = (data: any[]) => {
    const insights = {
      mostCommonTopics: getMostCommonTopics(data),
      interactionPatterns: analyzeInteractionPatterns(data),
      learningProgress: calculateLearningProgress(data),
      personalizedRecommendations: generatePersonalizedRecommendations(data)
    };
    return insights;
  };

  const getMostCommonTopics = (data: any[]) => {
    const topics: { [key: string]: number } = {};
    data.forEach(item => {
      if (item.data?.topic) {
        topics[item.data.topic] = (topics[item.data.topic] || 0) + 1;
      }
    });
    return Object.entries(topics)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);
  };

  const analyzeInteractionPatterns = (data: any[]) => {
    const patterns = {
      averageSessionLength: calculateAverageSessionLength(data),
      preferredTimeOfDay: getPreferredTimeOfDay(data),
      engagementLevel: calculateEngagementLevel(data),
      responseTime: calculateAverageResponseTime(data)
    };
    return patterns;
  };

  const calculateLearningProgress = (data: any[]) => {
    const topicsCovered = [...new Set(data.map(item => item.data?.topic).filter(Boolean))];
    const actionsTaken = data.filter(item => item.action === 'action_taken').length;
    const recommendationsViewed = data.filter(item => item.action === 'recommendation_viewed').length;
    
    return {
      topicsCovered: topicsCovered.length,
      actionsTaken,
      recommendationsViewed,
      progressScore: Math.min(100, (topicsCovered.length * 10) + (actionsTaken * 5) + (recommendationsViewed * 2))
    };
  };

  const generatePersonalizedRecommendations = (data: any[]) => {
    const recommendations = [];
    const topics = getMostCommonTopics(data);
    const progress = calculateLearningProgress(data);

    if (topics.includes('pricing') && progress.progressScore < 50) {
      recommendations.push('Consider exploring advanced pricing strategies');
    }
    if (topics.includes('guest-management') && progress.actionsTaken < 5) {
      recommendations.push('Try implementing some guest management best practices');
    }
    if (progress.recommendationsViewed > 10) {
      recommendations.push('You\'re doing great! Consider sharing your success stories');
    }

    return recommendations;
  };

  // Helper functions for behavior analysis
  const calculateAverageSessionLength = (data: any[]) => {
    const sessions: { [key: string]: any[] } = {};
    data.forEach(item => {
      const sessionId = item.sessionId;
      if (!sessions[sessionId]) sessions[sessionId] = [];
      sessions[sessionId].push(item);
    });

    const sessionLengths = Object.values(sessions).map(session => session.length);
    return sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length;
  };

  const getPreferredTimeOfDay = (data: any[]) => {
    const hours: { [key: number]: number } = {};
    data.forEach(item => {
      const hour = new Date(item.timestamp).getHours();
      hours[hour] = (hours[hour] || 0) + 1;
    });
    
    const preferredHour = Object.entries(hours).reduce((a, b) => hours[Number(a[0])] > hours[Number(b[0])] ? a : b)[0];
    return parseInt(preferredHour);
  };

  const calculateEngagementLevel = (data: any[]) => {
    const interactions = data.length;
    const uniqueSessions = new Set(data.map(item => item.sessionId)).size;
    return Math.min(100, (interactions / uniqueSessions) * 10);
  };

  const calculateAverageResponseTime = (data: any[]) => {
    // This would need more sophisticated analysis
    return 24; // Default 24 hours
  };

  // Function to track user behavior for AI learning
  const trackUserBehavior = async (action: string, data: any) => {
    try {
      // Store in localStorage for now (in production, this would go to your analytics service)
      const existingData = localStorage.getItem('hostit_ai_data') || '[]';
      const aiData = JSON.parse(existingData);
      
      aiData.push({
        action,
        data,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId()
      });
      
      localStorage.setItem('hostit_ai_data', JSON.stringify(aiData));
      
      // Send to analytics endpoint
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action, 
          data: {
            ...data,
            sessionId: getSessionId(),
            component: 'ai_chat'
          }
        })
      });
    } catch (error) {
      console.log('Analytics tracking error:', error);
    }
  };

  // Generate or get session ID
  const getSessionId = () => {
    let sessionId = localStorage.getItem('hostit_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('hostit_session_id', sessionId);
    }
    return sessionId;
  };

  // Enhanced AI response generation with learning
  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Track user interaction
    await trackUserBehavior('user_message', {
      message: userMessage,
      topic: extractTopic(userMessage),
      userProfile: userProfile,
      timestamp: new Date().toISOString()
    });

    // Analyze message for intent and context
    const intent = analyzeIntent(userMessage);
    const context = getConversationContext();
    
    // Generate personalized response based on user profile and learning data
    const response = await generatePersonalizedResponse(userMessage, intent, context);
    
    // Track AI response
    await trackUserBehavior('ai_response', {
      userMessage,
      aiResponse: response.text,
      intent,
      confidence: response.confidence,
      suggestions: response.suggestions
    });

    return response;
  };

  // Extract topic from user message
  const extractTopic = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      return 'pricing';
    }
    if (lowerMessage.includes('guest') || lowerMessage.includes('customer') || lowerMessage.includes('review')) {
      return 'guest-management';
    }
    if (lowerMessage.includes('property') || lowerMessage.includes('amenity') || lowerMessage.includes('upgrade')) {
      return 'property-optimization';
    }
    if (lowerMessage.includes('booking') || lowerMessage.includes('reservation') || lowerMessage.includes('calendar')) {
      return 'booking-management';
    }
    if (lowerMessage.includes('revenue') || lowerMessage.includes('profit') || lowerMessage.includes('income')) {
      return 'financial-optimization';
    }
    return 'general';
  };

  // Analyze user intent
  const analyzeIntent = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('why')) {
      return 'question';
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
      return 'help_request';
    }
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('advice')) {
      return 'recommendation_request';
    }
    if (lowerMessage.includes('thank') || lowerMessage.includes('great') || lowerMessage.includes('good')) {
      return 'positive_feedback';
    }
    return 'general_inquiry';
  };

  // Get conversation context
  const getConversationContext = () => {
    const recentMessages = messages.slice(-5); // Last 5 messages
    return {
      recentTopics: recentMessages.map(m => extractTopic(m.text)),
      userExpertise: userProfile?.expertise,
      userInterests: userProfile?.interests,
      aiInsights
    };
  };

  // Generate personalized response
  const generatePersonalizedResponse = async (userMessage: string, intent: string, context: any): Promise<Message> => {
    // This would integrate with your AI service
    // For now, we'll create a smart response based on context
    
    let responseText = '';
    let confidence = 0.8;
    let suggestions: string[] = [];

    // Base response based on intent
    switch (intent) {
      case 'question':
        responseText = generateAnswerResponse(userMessage, context);
        break;
      case 'help_request':
        responseText = generateHelpResponse(userMessage, context);
        break;
      case 'recommendation_request':
        responseText = generateRecommendationResponse(userMessage, context);
        break;
      case 'positive_feedback':
        responseText = generatePositiveFeedbackResponse(context);
        break;
      default:
        responseText = generateGeneralResponse(userMessage, context);
    }

    // Add personalized suggestions based on user profile and AI insights
    suggestions = generatePersonalizedSuggestions(context);

    return {
      id: Date.now().toString(),
      text: responseText,
      isUser: false,
      timestamp: new Date(),
      confidence,
      suggestions,
      insights: context.aiInsights
    };
  };

  // Generate answer response
  const generateAnswerResponse = (message: string, context: any): string => {
    const topic = extractTopic(message);
    
    if (topic === 'pricing') {
      return `Based on your ${context.userExpertise} level, here's what you should know about pricing: ${getPricingAdvice(context)}`;
    }
    if (topic === 'guest-management') {
      return `For guest management, I recommend: ${getGuestManagementAdvice(context)}`;
    }
    if (topic === 'property-optimization') {
      return `To optimize your property: ${getPropertyOptimizationAdvice(context)}`;
    }
    
    return "I'd be happy to help you with that! Could you provide more specific details about what you'd like to know?";
  };

  // Generate help response
  const generateHelpResponse = (message: string, context: any): string => {
    return `I understand you're having an issue. Let me help you troubleshoot this step by step. ${getTroubleshootingAdvice(context)}`;
  };

  // Generate recommendation response
  const generateRecommendationResponse = (message: string, context: any): string => {
    return `Based on your profile and current market conditions, I recommend: ${getPersonalizedRecommendations(context)}`;
  };

  // Generate positive feedback response
  const generatePositiveFeedbackResponse = (context: any): string => {
    return `Thank you! I'm glad I could help. Based on your progress, you might also be interested in: ${getNextSteps(context)}`;
  };

  // Generate general response
  const generateGeneralResponse = (message: string, context: any): string => {
    return `I understand you're asking about ${extractTopic(message)}. Let me provide some insights based on your experience level and interests.`;
  };

  // Helper functions for generating advice
  const getPricingAdvice = (context: any): string => {
    if (context.userExpertise === 'beginner') {
      return "Start with competitive pricing and gradually adjust based on demand. Monitor your occupancy rates and guest feedback.";
    } else if (context.userExpertise === 'intermediate') {
      return "Consider implementing dynamic pricing strategies. Analyze market trends and competitor pricing to optimize your rates.";
    } else {
      return "You're ready for advanced pricing strategies. Consider AI-powered dynamic pricing, yield management, and market positioning.";
    }
  };

  const getGuestManagementAdvice = (context: any): string => {
    return "Focus on clear communication, quick response times, and personalized experiences. Consider automated messaging for efficiency.";
  };

  const getPropertyOptimizationAdvice = (context: any): string => {
    return "Start with high-impact, low-cost improvements like better photos and descriptions. Then consider strategic amenity additions.";
  };

  const getTroubleshootingAdvice = (context: any): string => {
    return "Let's identify the root cause. Can you tell me more about the specific issue you're experiencing?";
  };

  const getPersonalizedRecommendations = (context: any): string => {
    const recommendations = [];
    if (context.userExpertise === 'beginner') {
      recommendations.push("Focus on the basics: great photos, clear descriptions, and competitive pricing");
    }
    if (context.aiInsights?.mostCommonTopics?.includes('pricing')) {
      recommendations.push("Consider implementing dynamic pricing to maximize revenue");
    }
    return recommendations.join('. ') + ".";
  };

  const getNextSteps = (context: any): string => {
    return "Advanced analytics, automated systems, or expanding to multiple properties.";
  };

  // Generate personalized suggestions
  const generatePersonalizedSuggestions = (context: any): string[] => {
    const suggestions = [];
    
    if (context.userExpertise === 'beginner') {
      suggestions.push("How to set up your first property listing");
      suggestions.push("Basic pricing strategies for beginners");
    } else if (context.userExpertise === 'intermediate') {
      suggestions.push("Advanced pricing optimization techniques");
      suggestions.push("Guest experience enhancement strategies");
    } else {
      suggestions.push("Portfolio expansion strategies");
      suggestions.push("Advanced automation and AI integration");
    }

    // Add suggestions based on AI insights
    if (context.aiInsights?.personalizedRecommendations?.length > 0) {
      suggestions.push(...context.aiInsights.personalizedRecommendations.slice(0, 2));
    }

    return suggestions.slice(0, 4);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-sm text-gray-600">Powered by machine learning</p>
          </div>
        </div>
        {aiInsights && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Sparkles className="h-4 w-4" />
            <span>Learning enabled</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {!message.isUser && (
                  <Bot className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  {message.confidence && (
                    <div className="mt-2 text-xs opacity-75">
                      Confidence: {Math.round(message.confidence * 100)}%
                    </div>
                  )}
                </div>
                {message.isUser && (
                  <User className="h-4 w-4 text-white mt-1 flex-shrink-0" />
                )}
              </div>
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-gray-600">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Insights */}
              {message.insights && (
                <div className="mt-3 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <div className="flex items-center space-x-2 text-xs text-yellow-800">
                    <TrendingUp className="h-3 w-3" />
                    <span className="font-medium">AI Insights:</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    Based on your usage patterns, I've personalized this response for you.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about your vacation rental business..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        {/* User Profile Summary */}
        {userProfile && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <Target className="h-3 w-3" />
                <span>Expertise: {userProfile.expertise}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-3 w-3" />
                <span>Learning Progress: {userProfile.learningProgress?.progressScore || 0}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 