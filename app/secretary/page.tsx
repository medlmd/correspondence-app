'use client';

import { useState } from 'react';
import { Upload, CheckCircle, XCircle, FileText } from 'lucide-react';
import DocumentUploadModal from '@/components/DocumentUploadModal';
import Toast from '@/components/Toast';
import { useDocuments } from '@/context/DocumentsContext';
import { useLanguage } from '@/context/LanguageContext';
import { Document } from '@/types';
import CorrespondenceCard from '@/components/CorrespondenceCard';

const COMPANIES = ['SEPCO', 'TCN', 'MURILOG', 'OUMRANA'];

export default function SecretaryPage() {
  const { documents, addDocument, updateDocument } = useDocuments();
  const { t } = useLanguage();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'forwarded' | 'rejected'>('all');

  // Get port company documents
  const portCompanyDocs = documents.filter(doc => doc.type === 'port_company');

  const getFileType = (fileName: string): 'pdf' | 'word' | 'excel' | 'other' => {
    const ext = fileName.toLowerCase().split('.').pop();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc' || ext === 'docx') return 'word';
    if (ext === 'xls' || ext === 'xlsx') return 'excel';
    return 'other';
  };

  const handleUpload = (data: { department: string; topic: string; files: File[]; role?: string; category?: string; uploadedFiles?: Array<{ file: File; filePath: string; fileName: string; fileSize: number; fileType: string }>; company?: string }) => {
    const filesToProcess = data.uploadedFiles || data.files.map((file, index) => ({
      file,
      filePath: '',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }));

    filesToProcess.forEach((fileData, index) => {
      const newDoc: Document = {
        id: `port-company-${Date.now()}-${index}`,
        type: 'port_company',
        title: data.topic,
        topic: data.topic,
        description: `رسالة من ${data.company || 'شركة'} إلى المدير العام`,
        fileName: fileData.fileName,
        fileType: getFileType(fileData.fileName),
        fileSize: fileData.fileSize,
        department: 'Commercial', // Default to Commercial department
        priority: 'high',
        status: 'pending_secretary',
        workflowStatus: 'pending_secretary',
        date: new Date(),
        documentNumber: `PC-${new Date().getFullYear()}-${String(portCompanyDocs.length + index + 1).padStart(3, '0')}`,
        attachments: fileData.filePath ? [fileData.filePath] : [fileData.fileName],
        createdBy: 'secretary',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: data.company || '',
      };
      addDocument(newDoc);
    });
    setToast({ message: t.toast.uploadFilesSuccess(filesToProcess.length), type: 'success' });
  };

  const handleForward = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      updateDocument(docId, {
        workflowStatus: 'forwarded_to_dg',
        status: 'forwarded_to_dg',
        forwardedBy: 'secretary',
        forwardedTo: 'dg',
        updatedAt: new Date(),
      });
      setToast({ message: 'تم توجيه الرسالة إلى المدير العام', type: 'success' });
    }
  };

  const handleReject = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      updateDocument(docId, {
        workflowStatus: 'rejected_by_dg',
        status: 'rejected_by_dg',
        updatedAt: new Date(),
      });
      setToast({ message: 'تم رفض الرسالة', type: 'success' });
    }
  };

  const handleDelete = (document: Document) => {
    // Delete handled by context
    setToast({ message: t.toast.deleteSuccess, type: 'success' });
  };

  const filteredDocs = portCompanyDocs.filter(doc => {
    if (filter === 'all') return true;
    if (filter === 'pending') return doc.workflowStatus === 'pending_secretary';
    if (filter === 'forwarded') return doc.workflowStatus === 'forwarded_to_dg';
    if (filter === 'rejected') return doc.workflowStatus === 'rejected_by_dg';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {t.pages.secretary.title}
          </h1>
          <p className="text-sm text-gray-500">{t.pages.secretary.description}</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
        >
          <Upload className="h-4 w-4" />
          رفع رسالة
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {[
          { key: 'all', label: 'الكل' },
          { key: 'pending', label: t.pages.secretary.pending },
          { key: 'forwarded', label: t.pages.secretary.forwarded },
          { key: 'rejected', label: t.pages.secretary.rejected },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div key={doc.id} className={`relative ${doc.workflowStatus === 'pending_secretary' ? 'pb-20' : ''}`}>
              <CorrespondenceCard
                correspondence={doc as any}
                onClick={() => {}}
                onDelete={handleDelete}
              />
              {doc.workflowStatus === 'pending_secretary' && (
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleForward(doc.id)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {t.pages.secretary.forward}
                  </button>
                  <button
                    onClick={() => handleReject(doc.id)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    {t.pages.secretary.reject}
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

      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        title="رفع رسالة من شركة"
        description="رفع رسالة PDF من شركة عاملة في الميناء"
        color="blue"
        showCompanySelect={true}
        companies={COMPANIES}
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
