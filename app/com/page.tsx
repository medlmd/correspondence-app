'use client';

import { useState } from 'react';
import { CheckCircle, FileText } from 'lucide-react';
import Toast from '@/components/Toast';
import { useDocuments } from '@/context/DocumentsContext';
import { useLanguage } from '@/context/LanguageContext';
import { Document } from '@/types';
import CorrespondenceCard from '@/components/CorrespondenceCard';
import CorrespondenceDetailModal from '@/components/CorrespondenceDetailModal';

export default function COMPage() {
  const { documents } = useDocuments();
  const { t } = useLanguage();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get approved documents
  const approvedDocs = documents.filter(
    doc => doc.type === 'port_company' && doc.workflowStatus === 'approved_by_dg'
  );

  const handleCardClick = (doc: Document) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const handleDelete = (document: Document) => {
    // Delete handled by context
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {t.pages.com.title}
        </h1>
        <p className="text-sm text-gray-500">{t.pages.com.description}</p>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {approvedDocs.length > 0 ? (
          approvedDocs.map((doc) => (
            <div key={doc.id} className="relative">
              <CorrespondenceCard
                correspondence={doc as any}
                onClick={() => handleCardClick(doc)}
                onDelete={handleDelete}
              />
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-1">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">{t.pages.com.approved}</span>
                </div>
              </div>
              {doc.company && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-lg bg-blue-50 px-3 py-2">
                    <p className="text-xs text-gray-600">
                      <strong>{t.pages.com.fromCompany}:</strong> {doc.company}
                    </p>
                  </div>
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
    </div>
  );
}
