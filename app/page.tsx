'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { useDocuments } from '@/context/DocumentsContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getDashboardStats } from '@/lib/data';
import { mockCorrespondence } from '@/lib/data';
import StatCard from '@/components/StatCard';
import { Inbox, Send, Mail, Archive, AlertCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Document, Correspondence } from '@/types';

export default function Home() {
  const { getStats, documents } = useDocuments();
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Redirect companies to their messages page
    if (user?.role === 'company') {
      router.push('/company');
      return;
    }
  }, [user, router]);

  // Don't render dashboard for companies
  if (user?.role === 'company') {
    return null;
  }
  
  // Get stats from mock data
  const mockStats = getDashboardStats();
  
  // Get stats from uploaded documents
  const uploadedStats = getStats();
  
  // Combine both
  const stats = {
    incoming: mockStats.incoming + uploadedStats.incoming,
    outgoing: mockStats.outgoing + uploadedStats.outgoing,
    internal: mockStats.internal + uploadedStats.internal,
    archived: mockStats.archived + uploadedStats.archived,
    urgent: mockStats.urgent + uploadedStats.urgent,
    pending: mockStats.pending + uploadedStats.pending,
  };

  // Get total documents
  const totalDocuments = stats.incoming + stats.outgoing + stats.internal;

  // Get recent documents (last 5)
  let allDocuments: Array<Document | Correspondence> = [];
  try {
    allDocuments = [
      ...mockCorrespondence.map(c => ({
        ...c,
        date: c.date instanceof Date ? c.date : new Date(c.date),
      })),
      ...documents.map(d => ({
        ...d,
        date: d.date instanceof Date ? d.date : new Date(d.date),
      }))
    ];
  } catch (error) {
    console.error('Error processing documents:', error);
    allDocuments = [];
  }
  
  const recentDocuments = allDocuments
    .sort((a, b) => {
      try {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } catch {
        return 0;
      }
    })
    .slice(0, 5);

  const statCards = [
    {
      title: t.pages.incoming.title,
      value: stats.incoming,
      icon: Inbox,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/incoming',
      description: 'الوثائق المستلمة',
    },
    {
      title: t.pages.outgoing.title,
      value: stats.outgoing,
      icon: Send,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      href: '/outgoing',
      description: 'الوثائق المرسلة',
    },
    {
      title: t.pages.internal.title,
      value: stats.internal,
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/internal',
      description: 'الوثائق الداخلية',
    },
    {
      title: t.pages.archive.title,
      value: stats.archived,
      icon: Archive,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
      href: '/archive',
      description: 'الوثائق المؤرشفة',
    },
  ];

  const priorityStats = [
    {
      title: 'عاجل',
      value: stats.urgent,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.pages.home?.title || 'لوحة التحكم'}</h1>
        <p className="text-sm text-gray-500">{t.pages.home?.description || 'نظرة عامة على إحصائيات الوثائق والمراسلات'}</p>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.href} className="block group">
            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-gray-300 hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`rounded-xl ${stat.bgColor} p-3 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stat.bgColor.replace('bg-', 'bg-gradient-to-r from-').replace('-100', '-400')} rounded-full transition-all duration-500`} 
                  style={{ width: `${Math.min((stat.value / Math.max(totalDocuments, 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Priority Statistics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
        {priorityStats.map((stat, index) => (
          <div key={index} className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-2">{stat.title}</p>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`rounded-xl ${stat.bgColor} p-4`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">إجمالي الوثائق</h2>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-end gap-4">
            <div>
              <p className="text-4xl font-bold text-gray-900">{totalDocuments}</p>
              <p className="text-sm text-gray-500 mt-1">إجمالي الوثائق في النظام</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">واردة: {stats.incoming}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-600">صادرة: {stats.outgoing}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                <span className="text-xs text-gray-600">داخلية: {stats.internal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">الوثائق الأخيرة</h2>
          <Link 
            href="/incoming" 
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            عرض الكل →
          </Link>
        </div>
        <div className="space-y-3">
          {recentDocuments.length > 0 ? (
            recentDocuments.map((doc, index) => {
              const docDate = doc.date instanceof Date ? doc.date : new Date(doc.date);
              return (
                <Link
                  key={doc.id || `doc-${index}`}
                  href={`/${doc.type}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-700">
                        {(doc as any).title || (doc as any).topic || 'وثيقة بدون عنوان'}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">
                          {format(docDate, 'dd MMM yyyy')}
                        </span>
                        {(doc as any).department && (
                          <span className="text-xs text-gray-500">• {(doc as any).department}</span>
                        )}
                        {(doc as any).priority === 'urgent' && (
                          <span className="text-xs font-medium text-red-600">عاجل</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      doc.type === 'incoming' ? 'bg-blue-100 text-blue-700' :
                      doc.type === 'outgoing' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {doc.type === 'incoming' ? 'واردة' :
                       doc.type === 'outgoing' ? 'صادرة' : 'داخلية'}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد وثائق حديثة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
