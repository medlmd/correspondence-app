'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Document } from '@/types';
import { format } from 'date-fns';
import { FileText, Download, Eye, Printer, File, FileSpreadsheet, X, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DocumentCardProps {
  document: Document;
  onClick?: () => void;
  onView?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

const fileTypeIcons = {
  pdf: FileText,
  word: File,
  excel: FileSpreadsheet,
  other: FileText,
};

const cardColors = { bg: 'bg-gradient-to-br from-emerald-50 to-teal-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'bg-gradient-to-br from-emerald-100 to-teal-100' };

export default function DocumentCard({ document, onClick, onView, onDownload, onDelete }: DocumentCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { t } = useLanguage();
  
  // Safety check: return null if document is not provided
  if (!document) {
    return null;
  }
  
  const getDepartmentName = (dept?: string) => {
    if (!dept) return t.common.unspecified;
    const deptMap: Record<string, keyof typeof t.departments> = {
      'Technical': 'technical',
      'Commercial': 'commercial',
      'Security': 'security',
      'Captaincy': 'captaincy',
    };
    return t.departments[deptMap[dept]] || dept;
  };

  const department = getDepartmentName(document.department);

  const colors = cardColors;
  const FileIcon = fileTypeIcons[document.fileType] || FileText;
  
  const getFileTypeLabel = () => {
    const labels: Record<string, string> = {
      pdf: 'PDF',
      word: 'Word',
      excel: 'Excel',
      other: t.common.file,
    };
    return labels[document.fileType] || t.common.file;
  };
  
  const fileTypeLabel = getFileTypeLabel();

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'غير محدد';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (document.fileType === 'pdf') {
      // For port company documents, use the specified PDF link
      if (document.type === 'port_company') {
        const pdfUrl = 'http://www.port-nouakchott.com/sites/default/files/2020-11/taches%20officiers%20de%20port.pdf';
        window.open(pdfUrl, '_blank');
      } else if (document.attachments && document.attachments.length > 0) {
        const filePath = document.attachments[0];
        const pdfUrl = filePath.startsWith('/') ? filePath : `/uploads/${document.type}/${document.department || 'general'}/${filePath}`;
        window.open(pdfUrl, '_blank');
      } else if (document.fileName) {
        // Fallback for documents without file paths
        window.open(`#`, '_blank');
      }
    } else if (onView) {
      onView(document);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (document.fileType === 'pdf' && document.type === 'port_company') {
      // For port company documents, use the specified PDF link
      const pdfUrl = 'http://www.port-nouakchott.com/sites/default/files/2020-11/taches%20officiers%20de%20port.pdf';
      const link = window.document.createElement('a');
      link.href = pdfUrl;
      link.download = document.fileName || 'document.pdf';
      link.target = '_blank';
      link.click();
    } else if (document.attachments && document.attachments.length > 0) {
      const filePath = document.attachments[0];
      // Check if it's a full path (starts with /) or just a filename
      const downloadUrl = filePath.startsWith('/') ? filePath : `/uploads/${document.type}/${document.department || 'general'}/${filePath}`;
      
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.download = document.fileName || filePath.split('/').pop() || 'document';
      link.click();
    } else if (document.fileName) {
      const link = window.document.createElement('a');
      link.href = `#`;
      link.download = document.fileName;
      link.click();
    }
    if (onDownload) {
      onDownload(document);
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (document.fileType === 'pdf') {
      // For port company documents, use the specified PDF link
      if (document.type === 'port_company') {
        const pdfUrl = 'http://www.port-nouakchott.com/sites/default/files/2020-11/taches%20officiers%20de%20port.pdf';
        window.open(pdfUrl, '_blank');
      } else if (document.attachments && document.attachments.length > 0) {
        const filePath = document.attachments[0];
        const printUrl = filePath.startsWith('/') ? filePath : `/uploads/${document.type}/${document.department || 'general'}/${filePath}`;
        window.open(printUrl, '_blank');
      } else if (document.fileName) {
        window.open(`#`, '_blank');
      }
    } else {
      window.print();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(document);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border ${colors.border} ${colors.bg} p-5 shadow-sm transition-all duration-200 hover:shadow-xl hover:border-emerald-300 hover:scale-[1.01] cursor-pointer`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className={`flex-shrink-0 ${colors.icon} rounded-lg p-2.5`}>
          <FileIcon className={`h-5 w-5 ${colors.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-900 line-clamp-1">
              {document.title}
            </h3>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-700">
              {fileTypeLabel}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
            {document.topic}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-semibold">{department}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="font-medium">{t.common.fileName}:</span>
            <span className="font-mono text-xs truncate max-w-[200px]">{document.fileName}</span>
          </div>
          {document.fileSize && (
            <div className="flex items-center gap-1">
              <span className="font-medium">{t.common.fileSize}:</span>
              <span>{formatFileSize(document.fileSize)}</span>
            </div>
          )}
        </div>
        {document.documentNumber && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">رقم الوثيقة:</span>
            <span className="font-mono mr-2">{document.documentNumber}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="font-medium">{t.common.date}:</span>
            <span>{format(document.date, 'dd MMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{t.common.time}:</span>
            <span>{format(document.date, 'HH:mm')}</span>
          </div>
          {document.documentNumber && (
            <div className="flex items-center gap-1">
              <span className="font-medium">{t.common.documentNumber}:</span>
              <span className="font-mono">{document.documentNumber}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
              <button
                onClick={handleView}
                className={`flex items-center justify-center h-9 w-9 rounded-lg ${colors.icon} ${colors.text} transition-all hover:scale-110 hover:shadow-md`}
                title={t.common.view}
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:scale-110 hover:shadow-md"
                title={t.common.download}
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:scale-110 hover:shadow-md"
                title={t.common.print}
              >
                <Printer className="h-4 w-4" />
              </button>
              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-red-100 text-red-600 transition-all hover:bg-red-200 hover:scale-110 hover:shadow-md"
                  title={t.common.delete}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
        </div>
      </div>

    </div>
    
    {/* Delete Confirmation Modal - Rendered outside card using portal */}
    {showDeleteConfirm && typeof window !== 'undefined' && createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{t.common.deleteConfirm}</h2>
            </div>
            <button
              onClick={handleDeleteCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-6">
                    <p className="text-gray-700 mb-4 text-center">
                      {t.common.deleteConfirmMessage}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        <strong>{t.common.document}:</strong> {document.title}
                      </p>
                      {document.fileName && (
                        <p className="text-sm text-gray-600">
                          <strong>{t.common.file}:</strong> {document.fileName}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      {t.common.deleteWarning}
                    </p>
          </div>

          <div className="flex items-center gap-3">
                    <button
                      onClick={handleDeleteCancel}
                      className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      {t.common.cancel}
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      {t.common.delete}
                    </button>
          </div>
        </div>
      </div>,
      window.document.body
    )}
    </>
  );
}
