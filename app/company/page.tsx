'use client';

import { useState } from 'react';
import { Upload, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import DocumentUploadModal from '@/components/DocumentUploadModal';
import Toast from '@/components/Toast';
import { useDocuments } from '@/context/DocumentsContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Document } from '@/types';
import CorrespondenceCard from '@/components/CorrespondenceCard';
import { mockCompanies } from '@/context/AuthContext';

export default function CompanyPage() {
  const { documents, addDocument } = useDocuments();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Get company info
  const company = user?.companyId ? mockCompanies.find(c => c.id === user.companyId) : null;
  const companyName = company?.name || user?.name || '';

  // Get company's documents
  const companyDocs = documents.filter(
    doc => doc.type === 'port_company' && doc.company === companyName
  );

  const getFileType = (fileName: string): 'pdf' | 'word' | 'excel' | 'other' => {
    const ext = fileName.toLowerCase().split('.').pop();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc' || ext === 'docx') return 'word';
    if (ext === 'xls' || ext === 'xlsx') return 'excel';
    return 'other';
  };

  const handleUpload = (data: { department: string; topic: string; files: File[]; role?: string; category?: string; uploadedFiles?: Array<{ file: File; filePath: string; fileName: string; fileSize: number; fileType: string }>; company?: string }) => {
    // For prototype: if no files, create a dummy PDF entry
    let filesToProcess = data.uploadedFiles || data.files.map((file, index) => ({
      file,
      filePath: '',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }));

    // If no files, create a dummy PDF for prototype
    if (filesToProcess.length === 0) {
      filesToProcess = [{
        file: new File([''], 'document.pdf', { type: 'application/pdf' }),
        filePath: '',
        fileName: 'document.pdf',
        fileSize: 0,
        fileType: 'application/pdf',
      }];
    }

    filesToProcess.forEach((fileData, index) => {
      const newDoc: Document = {
        id: `port-company-${Date.now()}-${index}`,
        type: 'port_company',
        title: data.topic,
        topic: data.topic,
        description: `رسالة من ${companyName} إلى المدير العام`,
        fileName: fileData.fileName || 'document.pdf',
        fileType: getFileType(fileData.fileName || 'document.pdf'),
        fileSize: fileData.fileSize || 0,
        department: 'Commercial',
        priority: 'high',
        status: 'pending_secretary',
        workflowStatus: 'pending_secretary',
        date: new Date(),
        documentNumber: `PC-${new Date().getFullYear()}-${String(companyDocs.length + index + 1).padStart(3, '0')}`,
        attachments: fileData.filePath ? [fileData.filePath] : [fileData.fileName || 'document.pdf'],
        createdBy: user?.username || 'company',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: companyName,
      };
      addDocument(newDoc);
    });
    setToast({ message: t.toast.uploadFilesSuccess(filesToProcess.length), type: 'success' });
  };

  const handleDelete = (document: Document) => {
    setToast({ message: t.toast.deleteSuccess, type: 'success' });
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'pending_secretary':
        return { label: 'في انتظار المراجعة', icon: Clock, color: 'text-yellow-600 bg-yellow-50' };
      case 'forwarded_to_dg':
        return { label: 'موجهة للمدير العام', icon: Clock, color: 'text-blue-600 bg-blue-50' };
      case 'approved_by_dg':
        return { label: 'معتمدة', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' };
      case 'rejected_by_dg':
        return { label: 'مرفوضة', icon: XCircle, color: 'text-red-600 bg-red-50' };
      case 'commented_by_dg':
        return { label: 'معلق عليها', icon: FileText, color: 'text-purple-600 bg-purple-50' };
      default:
        return { label: 'غير محدد', icon: FileText, color: 'text-gray-600 bg-gray-50' };
    }
  };

  const filteredDocs = companyDocs.filter(doc => {
    if (filter === 'all') return true;
    if (filter === 'pending') return doc.workflowStatus === 'pending_secretary' || doc.workflowStatus === 'forwarded_to_dg';
    if (filter === 'approved') return doc.workflowStatus === 'approved_by_dg';
    if (filter === 'rejected') return doc.workflowStatus === 'rejected_by_dg';
    return true;
  });

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">لا توجد معلومات شركة متاحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            إدارة المراسلات - {company.name}
          </h1>
          <p className="text-sm text-gray-500">إرسال ومتابعة الرسائل الموجهة للميناء</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
        >
          <Upload className="h-4 w-4" />
          إرسال رسالة جديدة
        </button>
      </div>

      {/* Company Info Card */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">معلومات الشركة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">اسم الشركة</p>
            <p className="text-sm font-semibold text-gray-900">{company.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">NIF</p>
            <p className="text-sm font-semibold text-gray-900">{company.nif}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">البريد الإلكتروني</p>
            <p className="text-sm font-semibold text-gray-900">{company.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">رقم الهاتف</p>
            <p className="text-sm font-semibold text-gray-900">{company.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">المسؤول عن المراسلات</p>
            <p className="text-sm font-semibold text-gray-900">{company.contactPerson}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {[
          { key: 'all', label: 'الكل' },
          { key: 'pending', label: 'قيد المراجعة' },
          { key: 'approved', label: 'معتمدة' },
          { key: 'rejected', label: 'مرفوضة' },
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
          filteredDocs.map((doc) => {
            const statusInfo = getStatusLabel(doc.workflowStatus);
            const StatusIcon = statusInfo.icon;
            return (
              <div key={doc.id} className="relative">
                <CorrespondenceCard
                  correspondence={doc as any}
                  onClick={() => {}}
                  onDelete={handleDelete}
                />
                <div className="absolute top-4 left-4">
                  <div className={`flex items-center gap-2 rounded-lg px-3 py-1 ${statusInfo.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">{statusInfo.label}</span>
                  </div>
                </div>
                {doc.gmComment && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="rounded-lg bg-purple-50 border border-purple-200 px-3 py-2">
                      <p className="text-xs text-gray-600">
                        <strong>تعليق المدير العام:</strong> {doc.gmComment}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
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
        title="إرسال رسالة جديدة"
        description="إرسال رسالة PDF إلى المدير العام (للبروتوتايب: الملف اختياري)"
        color="blue"
        showCompanySelect={false}
        filesOptional={true}
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
