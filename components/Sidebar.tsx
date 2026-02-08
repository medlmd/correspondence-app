'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Inbox, 
  Send, 
  Mail, 
  Archive, 
  Settings,
  FileText,
  RefreshCw,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { clsx } from 'clsx';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { FileCheck, UserCheck, Building2 } from 'lucide-react';

const baseNavigation = [
  { nameKey: 'sidebar.home' as const, href: '/', icon: LayoutDashboard },
  { nameKey: 'sidebar.incoming' as const, href: '/incoming', icon: Inbox },
  { nameKey: 'sidebar.outgoing' as const, href: '/outgoing', icon: Send },
  { nameKey: 'sidebar.internal' as const, href: '/internal', icon: Mail },
  { nameKey: 'sidebar.archive' as const, href: '/archive', icon: Archive },
];

const roleBasedNavigation: Record<string, Array<{ nameKey: string; href: string; icon: any }>> = {
  secretary: [
    { nameKey: 'sidebar.secretary' as const, href: '/secretary', icon: FileCheck },
  ],
  dg: [
    { nameKey: 'sidebar.dg' as const, href: '/dg', icon: UserCheck },
  ],
  com: [
    { nameKey: 'sidebar.com' as const, href: '/com', icon: Building2 },
  ],
  company: [
    { nameKey: 'sidebar.company' as const, href: '/company', icon: Building2 },
  ],
  admin: [], // Admin role has no specific navigation items
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Build navigation based on user role
  let navigation;
  if (user?.role === 'company') {
    // Companies only see their messages and settings
    navigation = [
      ...(roleBasedNavigation[user.role] || []),
      { nameKey: 'sidebar.settings' as const, href: '/settings', icon: Settings },
    ];
  } else {
    navigation = [
      ...baseNavigation,
      ...(user?.role && roleBasedNavigation[user.role] ? roleBasedNavigation[user.role] : []),
      { nameKey: 'sidebar.settings' as const, href: '/settings', icon: Settings },
    ];
  }

  const getTranslation = (key: string) => {
    const keys = key.split('.');
    let value: any = t;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-l border-gray-200 shadow-xl">
      <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-gray-900">نظام المراسلات</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/' && pathname === '/');
          return (
            <Link
              key={item.nameKey}
              href={item.href}
              className={clsx(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={clsx(
                'h-5 w-5 flex-shrink-0 transition-colors',
                isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
              )} />
              <span>{getTranslation(item.nameKey)}</span>
              {isActive && (
                <div className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-emerald-600"></div>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-100 p-4 space-y-2">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white text-sm">
            {user?.name.charAt(0) || 'أ'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-gray-900 truncate">{user?.name || 'مستخدم'}</div>
            <div className="text-xs text-gray-500">{user?.username || ''}</div>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-50 p-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <RefreshCw className="h-4 w-4" />
          <span className="text-sm">تحديث</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}
