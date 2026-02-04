'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import CorrespondenceCard from '@/components/CorrespondenceCard';
import CorrespondenceDetailModal from '@/components/CorrespondenceDetailModal';
import DocumentUploadModal from '@/components/DocumentUploadModal';
import Toast from '@/components/Toast';
import { useDocuments } from '@/context/DocumentsContext';
import { useLanguage } from '@/context/LanguageContext';
import { mockCorrespondence } from '@/lib/data';
import { convertToDocument } from '@/lib/documentUtils';
import { Correspondence, Document } from '@/types';

export default function OutgoingPage() {
  const { documents, addDocument, getDocumentsByType, deleteDocument } = useDocuments();
  const { t } = useLanguage();
  const mockOutgoing = mockCorrespondence.filter(c => c.type === 'outgoing');
  const uploadedOutgoing = getDocumentsByType('outgoing');
  const allOutgoing = [...mockOutgoing, ...uploadedOutgoing];
  
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<Correspondence | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDocumentNumber, setSelectedDocumentNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const departments = [
    { value: '', label: t.departments.all },
    { value: 'Technical', label: t.departments.technical },
    { value: 'Commercial', label: t.departments.commercial },
    { value: 'Security', label: t.departments.security },
    { value: 'Captaincy', label: t.departments.captaincy },
  ];

  const categories = [
    { value: '', label: t.categories.all },
    { value: 'المشتريات', label: t.categories.procurement },
    { value: 'العقود', label: t.categories.contracts },
    { value: 'الشؤون القانونية', label: t.categories.legal },
    { value: 'الفواتير', label: t.categories.invoices },
  ];

  const handleCardClick = (correspondence: Correspondence) => {
    setSelectedCorrespondence(correspondence);
    setIsModalOpen(true);
  };

  const handleDelete = (document: Document) => {
    deleteDocument(document.id);
    setToast({ message: 'تم حذف الوثيقة بنجاح!', type: 'success' });
  };

  const getFileType = (fileName: string): 'pdf' | 'word' | 'excel' | 'other' => {
    const ext = fileName.toLowerCase().split('.').pop();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc' || ext === 'docx') return 'word';
    if (ext === 'xls' || ext === 'xlsx') return 'excel';
    return 'other';
  };

  const handleUpload = (data: { department: string; topic: string; files: File[]; role?: string; category?: string; uploadedFiles?: Array<{ file: File; filePath: string; fileName: string; fileSize: number; fileType: string }> }) => {
    const filesToProcess = data.uploadedFiles || data.files.map((file, index) => ({
      file,
      filePath: '',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }));

    filesToProcess.forEach((fileData, index) => {
      const newDoc: Document = {
        id: `outgoing-${Date.now()}-${index}`,
        type: 'outgoing',
        title: data.topic,
        topic: data.topic,
        description: `${t.pages.outgoing.title}: ${data.topic}`,
        fileName: fileData.fileName,
        fileType: getFileType(fileData.fileName),
        fileSize: fileData.fileSize,
        department: data.department,
        priority: 'medium',
        status: 'pending',
        date: new Date(),
        documentNumber: `OUT-${new Date().getFullYear()}-${String(allOutgoing.length + index + 1).padStart(3, '0')}`,
        attachments: fileData.filePath ? [fileData.filePath] : [fileData.fileName],
        createdBy: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: (data.role as any) || undefined,
        category: (data.category as any) || undefined,
      };
      addDocument(newDoc);
    });
    setToast({ message: t.toast.uploadFilesSuccess(filesToProcess.length), type: 'success' });
  };

  // Filter by department, topic, document number, and category
  const filteredOutgoing = allOutgoing.filter(item => {
    const doc = convertToDocument(item);
    const matchesDepartment = !selectedDepartment || doc.department === selectedDepartment;
    const matchesTopic = !selectedTopic || doc.title.toLowerCase().includes(selectedTopic.toLowerCase()) || doc.topic.toLowerCase().includes(selectedTopic.toLowerCase()) || (doc.description && doc.description.toLowerCase().includes(selectedTopic.toLowerCase()));
    const matchesDocumentNumber = !selectedDocumentNumber || 
      (doc.documentNumber && doc.documentNumber.toLowerCase().includes(selectedDocumentNumber.toLowerCase())) ||
      ((doc as any).serialNumber && (doc as any).serialNumber.toLowerCase().includes(selectedDocumentNumber.toLowerCase()));
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    return matchesDepartment && matchesTopic && matchesDocumentNumber && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {t.pages.outgoing.title}
          </h1>
          <p className="text-sm text-gray-500">{t.pages.outgoing.description}</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
        >
          <Upload className="h-4 w-4" />
          {t.pages.outgoing.upload}
        </button>
      </div>

      <div className="mb-6 flex gap-3 flex-wrap">
        <input
          type="text"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          placeholder={t.pages.outgoing.searchTopic}
          className="flex-1 min-w-[200px] rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 placeholder:text-black"
        />
        <input
          type="text"
          value={selectedDocumentNumber}
          onChange={(e) => setSelectedDocumentNumber(e.target.value)}
          placeholder={t.pages.outgoing.searchDocNumber}
          className="flex-1 min-w-[200px] rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 placeholder:text-black"
        />
        <select 
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-2.5 text-sm text-black shadow-sm transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {departments.map((dept) => (
            <option key={dept.value} value={dept.value}>{dept.label}</option>
          ))}
        </select>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-2.5 text-sm text-black shadow-sm transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOutgoing.length > 0 ? (
          filteredOutgoing.map((correspondence) => {
            const doc = convertToDocument(correspondence);
            return (
              <CorrespondenceCard 
                key={correspondence.id} 
                correspondence={correspondence}
                onClick={() => handleCardClick(correspondence)}
                onDelete={handleDelete}
              />
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
        title={t.pages.outgoing.upload}
        description={t.pages.outgoing.description}
        color="emerald"
      />

      <CorrespondenceDetailModal
        correspondence={selectedCorrespondence}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCorrespondence(null);
        }}
        onAction={(action, id) => {
          console.log(`Action: ${action} on correspondence: ${id}`);
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
