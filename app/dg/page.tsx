'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare, FileText, Inbox, Clock, XCircle as XCircleIcon } from 'lucide-react';
import Toast from '@/components/Toast';
import { useDocuments } from '@/context/DocumentsContext';
import { useLanguage } from '@/context/LanguageContext';
import { Document } from '@/types';
import CorrespondenceCard from '@/components/CorrespondenceCard';
import CorrespondenceDetailModal from '@/components/CorrespondenceDetailModal';

export default function DGPage() {
  const { documents, updateDocument } = useDocuments();
  const { t } = useLanguage();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyFilter, setCompanyFilter] = useState<'all' | 'pending' | 'forwarded' | 'rejected'>('all');

  // Get all company documents (including forwarded ones)
  const allCompanyDocs = documents.filter(
    doc => doc.type === 'port_company' && 
           doc.workflowStatus !== 'approved_by_dg' && 
           doc.workflowStatus !== 'commented_by_dg'
  );

  // Get documents forwarded to DG (for statistics)
  const forwardedDocs = documents.filter(
    doc => doc.type === 'port_company' && doc.workflowStatus === 'forwarded_to_dg'
  );

  // Filter company documents based on selected filter
  const filteredCompanyDocs = allCompanyDocs.filter(doc => {
    if (companyFilter === 'all') return true; // Show all including forwarded
    if (companyFilter === 'pending') return doc.workflowStatus === 'pending_secretary';
    if (companyFilter === 'forwarded') return doc.workflowStatus === 'forwarded_to_dg';
    if (companyFilter === 'rejected') return doc.workflowStatus === 'rejected_by_dg';
    return true;
  });

  const handleApprove = (docId: string) => {
    updateDocument(docId, {
      workflowStatus: 'approved_by_dg',
      status: 'approved_by_dg',
      gmResponse: 'approved',
      forwardedBy: 'dg',
      forwardedTo: 'com',
      updatedAt: new Date(),
    });
    setToast({ message: 'تم الموافقة على الرسالة', type: 'success' });
  };

  const handleReject = (docId: string) => {
    updateDocument(docId, {
      workflowStatus: 'rejected_by_dg',
      status: 'rejected_by_dg',
      gmResponse: 'rejected',
      updatedAt: new Date(),
    });
    setToast({ message: 'تم رفض الرسالة', type: 'success' });
  };

  const handleOnHold = (docId: string) => {
    updateDocument(docId, {
      workflowStatus: 'commented_by_dg',
      status: 'commented_by_dg',
      gmResponse: 'commented',
      updatedAt: new Date(),
    });
    setToast({ message: 'تم وضع الرسالة قيد الانتظار', type: 'success' });
  };

  const handleCardClick = (doc: Document) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const handleDelete = (document: Document) => {
    setToast({ message: t.toast.deleteSuccess, type: 'success' });
  };

  // Calculate statistics
  const stats = {
    forwarded: forwardedDocs.length,
    pending: allCompanyDocs.filter(d => d.workflowStatus === 'pending_secretary').length,
    rejected: allCompanyDocs.filter(d => d.workflowStatus === 'rejected_by_dg').length,
    total: allCompanyDocs.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {t.pages.dg.title}
        </h1>
        <p className="text-sm text-gray-500">{t.pages.dg.description}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">الموجهة</p>
              <p className="text-2xl font-bold text-gray-900">{stats.forwarded}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Inbox className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">في انتظار التوجيه</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">مرفوضة</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircleIcon className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">إجمالي الرسائل</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total + stats.forwarded}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Company Messages Section */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {t.pages.secretary.title}
          </h2>
          <p className="text-sm text-gray-500">الرسائل التي تم توجيهها إليك من السكرتيريا</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          {[
            { key: 'all', label: 'الكل' },
            { key: 'pending', label: t.pages.secretary.pending },
            { key: 'forwarded', label: 'رسائل تم توجيهها' },
            { key: 'rejected', label: t.pages.secretary.rejected },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setCompanyFilter(tab.key as any)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                companyFilter === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Company Documents Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanyDocs.length > 0 ? (
            filteredCompanyDocs.map((doc) => (
              <div key={doc.id} className={`relative ${doc.workflowStatus === 'forwarded_to_dg' ? 'pb-20' : ''}`}>
                <CorrespondenceCard
                  correspondence={doc as any}
                  onClick={() => handleCardClick(doc)}
                  onDelete={handleDelete}
                />
                {/* Show action buttons for forwarded messages */}
                {doc.workflowStatus === 'forwarded_to_dg' && (
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleApprove(doc.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t.pages.dg.approve}
                    </button>
                    <button
                      onClick={() => handleReject(doc.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      {t.pages.dg.reject}
                    </button>
                    <button
                      onClick={() => handleOnHold(doc.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      {t.pages.dg.comment}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
              {t.common.noDocuments}
            </div>
          )}
        </div>
      </div>

      <CorrespondenceDetailModal
        correspondence={selectedDoc as any}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDoc(null);
        }}
        onAction={(action, id) => {
          console.log(`Action: ${action} on document: ${id}`);
        }}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
