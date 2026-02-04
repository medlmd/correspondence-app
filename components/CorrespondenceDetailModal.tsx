'use client';

import { Document, Correspondence } from '@/types';
import { format } from 'date-fns';
import { X, Printer, Download, FileText, User, Calendar, Hash, File, FileSpreadsheet, Folder } from 'lucide-react';
import { convertToDocument } from '@/lib/documentUtils';

interface DocumentDetailModalProps {
  correspondence: Correspondence | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: string, documentId: string) => void;
}

const departmentNames: Record<string, string> = {
  'Technical': 'الإدارة الفنية',
  'Commercial': 'الإدارة التجارية',
  'Security': 'الإدارة الأمنية',
  'Captaincy': 'إدارة القبطانية',
};

const priorityLabels = {
  urgent: 'عاجل',
  high: 'عالي',
  medium: 'متوسط',
  low: 'منخفض',
};

const statusLabels = {
  pending: 'قيد الانتظار',
  in_review: 'قيد المراجعة',
  replied: 'تم الرد',
  archived: 'مؤرشف',
  completed: 'مكتمل',
};

const fileTypeIcons = {
  pdf: FileText,
  word: File,
  excel: FileSpreadsheet,
  other: FileText,
};

const fileTypeLabels = {
  pdf: 'PDF',
  word: 'Word',
  excel: 'Excel',
  other: 'ملف',
};

export default function CorrespondenceDetailModal({
  correspondence,
  isOpen,
  onClose,
  onAction,
}: DocumentDetailModalProps) {
  if (!isOpen || !correspondence) return null;

  const document = convertToDocument(correspondence);
  const department = document.department
    ? departmentNames[document.department] || document.department
    : 'غير محدد';

  const FileIcon = fileTypeIcons[document.fileType] || FileText;
  const fileTypeLabel = fileTypeLabels[document.fileType];

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return 'غير محدد';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, document.id);
    }
    if (action === 'approve' || action === 'reject') {
      onClose();
    }
  };

  const getPdfUrl = () => {
    // For port company documents, use the specified PDF link
    if (document.type === 'port_company' && document.fileType === 'pdf') {
      return 'http://www.port-nouakchott.com/sites/default/files/2020-11/taches%20officiers%20de%20port.pdf';
    }
    // For other documents, use the attachment path
    if (document.attachments && document.attachments.length > 0) {
      const filePath = document.attachments[0];
      return filePath.startsWith('/') ? filePath : `/uploads/${document.type}/${document.department || 'general'}/${filePath}`;
    }
    return null;
  };

  const handleView = () => {
    const pdfUrl = getPdfUrl();
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownload = () => {
    const pdfUrl = getPdfUrl();
    if (pdfUrl) {
      const link = window.document.createElement('a');
      link.href = pdfUrl;
      link.download = document.fileName || 'document.pdf';
      link.target = '_blank';
      link.click();
    }
  };

  const handlePrint = () => {
    const pdfUrl = getPdfUrl();
    if (pdfUrl && document.fileType === 'pdf') {
      window.open(pdfUrl, '_blank');
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{document.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{document.topic}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {document.documentNumber && (
                <span className="flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  {document.documentNumber}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(document.date, 'yyyy-MM-dd')}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                {fileTypeLabel}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status and Priority Badges */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              document.priority === 'urgent' ? 'bg-red-100 text-red-700' :
              document.priority === 'high' ? 'bg-orange-100 text-orange-700' :
              document.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {priorityLabels[document.priority]}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              document.status === 'pending' ? 'bg-gray-100 text-gray-700' :
              document.status === 'in_review' ? 'bg-blue-100 text-blue-700' :
              document.status === 'replied' ? 'bg-green-100 text-green-700' :
              document.status === 'archived' ? 'bg-purple-100 text-purple-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {statusLabels[document.status]}
            </span>
          </div>

          {/* Document File Info */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <FileIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">معلومات الملف</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">اسم الملف:</span>
                    <p className="text-gray-900 font-mono text-xs mt-1">{document.fileName}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">نوع الملف:</span>
                    <p className="text-gray-900 mt-1">{fileTypeLabel}</p>
                  </div>
                  {document.fileSize && (
                    <div>
                      <span className="font-semibold text-gray-700">حجم الملف:</span>
                      <p className="text-gray-900 mt-1">{formatFileSize(document.fileSize)}</p>
                    </div>
                  )}
                  {document.documentNumber && (
                    <div>
                      <span className="font-semibold text-gray-700">رقم الوثيقة:</span>
                      <p className="text-gray-900 font-mono text-xs mt-1">{document.documentNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
              <Folder className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-purple-900 mb-1">الإدارة</p>
                <p className="text-sm text-purple-700">{department}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-900 mb-1">الموضوع</p>
                <p className="text-sm text-blue-700">{document.topic}</p>
              </div>
            </div>
            {document.sender && (
              <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg">
                <User className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-emerald-900 mb-1">المرسل</p>
                  <p className="text-sm text-emerald-700">{document.sender}</p>
                </div>
              </div>
            )}
            {document.recipient && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <User className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-orange-900 mb-1">المستقبل</p>
                  <p className="text-sm text-orange-700">{document.recipient}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-900 mb-1">تاريخ الرفع</p>
                <p className="text-sm text-gray-700">
                  {format(document.date, 'yyyy-MM-dd')} - {format(document.date, 'HH:mm')}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {document.description && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">الوصف</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {document.description}
              </p>
            </div>
          )}

          {/* Related Files */}
          {document.attachments && document.attachments.length > 1 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">ملفات إضافية</h3>
              <div className="flex flex-wrap gap-2">
                {document.attachments.slice(1).map((file, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{file}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            {document.fileType === 'pdf' && (
              <>
                <button
                  onClick={handleView}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <FileText className="h-4 w-4" />
                  عرض
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <Download className="h-4 w-4" />
                  تحميل
                </button>
              </>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
