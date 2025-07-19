"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Users, 
  Building2, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  BarChart3,
  FileText,
  Bell,
  TrendingUp,
  Activity,
  Target,
  PieChart
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

interface PricingSettings {
  aiPricingModel: boolean;
  machineLearning: boolean;
  customPricingRules: boolean;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  highlight?: boolean;
  adminOnly?: boolean;
  children?: NavigationItem[];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/sign-in');
        return;
      }

      // Verify token with backend
      const response = await fetch('/api/v1/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const user = JSON.parse(userData);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication error:', error);
      localStorage.removeItem('authToken'); // Changed from 'token' to 'authToken'
      localStorage.removeItem('user');
      router.push('/sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
      
      if (token) {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken'); // Changed from 'token' to 'authToken'
      localStorage.removeItem('user');
      router.push('/sign-in');
    }
  };

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { 
      name: 'Accounts', 
      href: '/admin/accounts', 
      icon: Building2, 
      highlight: true,
      children: [
        { name: 'Users', href: '/admin/users', icon: Users, adminOnly: true }
      ]
    },
    { 
      name: 'Calendars', 
      href: '/admin/task-calendar', 
      icon: Calendar,
      children: [
        { name: 'Admin Schedule', href: '/admin/admin-schedule', icon: Users }
      ]
    },
    { name: 'Multi Calendar', href: '/admin/multi-calendar', icon: Calendar },
    { name: 'Properties', href: '/admin/properties', icon: Building2 },
    { name: 'Reservations', href: '/admin/reservations', icon: Calendar },
    { 
      name: 'Dynamic Pricing', 
      href: '/admin/dynamic-pricing', 
      icon: TrendingUp, 
      highlight: true,
      children: [
        { name: 'Overview', href: '/admin/dynamic-pricing', icon: BarChart3 },
        { name: 'Pricing Rules', href: '/admin/dynamic-pricing/rules', icon: Settings },
        { name: 'Market Analysis', href: '/admin/dynamic-pricing/market', icon: Activity },
        { name: 'Portfolio Analytics', href: '/admin/dynamic-pricing/portfolio', icon: PieChart },
        { name: 'Pricing Strategies', href: '/admin/dynamic-pricing/strategies', icon: Target }
      ]
    },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { 
      name: 'Tasks', 
      href: '/admin/tasks', 
      icon: FileText,
      children: [
        { name: 'Property Tasks Calendar', href: '/admin/property-tasks-calendar', icon: Calendar },
        { name: 'Account Task Calendar', href: '/admin/account-task-calendar', icon: Calendar }
      ]
    },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const filteredNavigation = navigation.filter(item => {
    if (item.adminOnly) {
      return user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-sm border-r border-white/20 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HostIt</span>
            </Link>
            
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    } ${item.highlight ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200' : ''}`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                  
                  {/* Render children if they exist and parent is active */}
                  {item.children && isActive && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = pathname === child.href;
                        
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                              isChildActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <ChildIcon className="w-4 h-4 mr-2" />
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 