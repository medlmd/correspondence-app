'use client';

import { useState } from 'react';
import { X, FileText, FolderOpen, Upload as UploadIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: { 
    department: string; 
    topic: string; 
    files: File[];
    role?: string;
    category?: string;
    uploadedFiles?: Array<{ file: File; filePath: string; fileName: string; fileSize: number; fileType: string }>;
  }) => void;
  title: string;
  description: string;
  color?: 'blue' | 'emerald' | 'purple' | 'slate';
}

// Departments will be generated from translations

const colorClasses = {
  blue: {
    button: 'bg-blue-600 hover:bg-blue-700',
    focus: 'focus:border-blue-500 focus:ring-blue-100',
    icon: 'bg-blue-50 text-blue-600',
  },
  emerald: {
    button: 'bg-emerald-600 hover:bg-emerald-700',
    focus: 'focus:border-emerald-500 focus:ring-emerald-100',
    icon: 'bg-emerald-50 text-emerald-600',
  },
  purple: {
    button: 'bg-purple-600 hover:bg-purple-700',
    focus: 'focus:border-purple-500 focus:ring-purple-100',
    icon: 'bg-purple-50 text-purple-600',
  },
  slate: {
    button: 'bg-slate-600 hover:bg-slate-700',
    focus: 'focus:border-slate-500 focus:ring-slate-100',
    icon: 'bg-slate-50 text-slate-600',
  },
};

// Categories and roles will be generated from translations

export default function DocumentUploadModal({
  isOpen,
  onClose,
  onUpload,
  title,
  description,
  color = 'blue',
}: DocumentUploadModalProps) {
  const { t } = useLanguage();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const colors = colorClasses[color];

  const departments = [
    { value: 'IT', label: t.departments.it },
    { value: 'HR', label: t.departments.hr },
    { value: 'Management', label: t.departments.management },
    { value: 'Admin', label: t.departments.admin },
    { value: 'Finance', label: t.departments.finance },
  ];

  const categories = [
    { value: '', label: t.upload.selectCategory },
    { value: 'المشتريات', label: t.categories.procurement },
    { value: 'العقود', label: t.categories.contracts },
    { value: 'الشؤون القانونية', label: t.categories.legal },
    { value: 'الفواتير', label: t.categories.invoices },
  ];

  const roles = [
    { value: '', label: t.upload.selectRole },
    { value: 'All', label: t.roles.all },
    { value: 'Dir', label: t.roles.director },
    { value: 'SimpleUsers', label: t.roles.employee },
  ];

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Filter for Word, Excel, PDF only
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      const validFiles = files.filter(file => allowedTypes.includes(file.type));
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedDepartment || !topic || selectedFiles.length === 0) {
      alert('يرجى ملء جميع الحقول واختيار ملف واحد على الأقل');
      return;
    }

    // Determine document type from color prop
    const documentType = color === 'blue' ? 'incoming' : 
                        color === 'emerald' ? 'outgoing' : 
                        color === 'purple' ? 'internal' : 'archive';

    try {
      // Upload files one by one
      const uploadedFiles: Array<{ file: File; filePath: string; fileName: string; fileSize: number; fileType: string }> = [];
      
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);
        formData.append('department', selectedDepartment);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const result = await response.json();
        uploadedFiles.push({
          file,
          filePath: result.filePath,
          fileName: result.fileName,
          fileSize: result.fileSize,
          fileType: result.fileType,
        });
      }

      // Call onUpload with file paths
      onUpload({
        department: selectedDepartment,
        topic,
        files: selectedFiles,
        role: selectedRole,
        category: selectedCategory,
        uploadedFiles: uploadedFiles,
      });

      // Reset form
      setSelectedFiles([]);
      setSelectedDepartment('');
      setTopic('');
      setSelectedRole('');
      setSelectedCategory('');
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      alert('حدث خطأ أثناء رفع الملفات. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setSelectedDepartment('');
    setTopic('');
    setSelectedRole('');
    setSelectedCategory('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${colors.icon} rounded-lg`}>
              <UploadIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Department Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.common.department} <span className="text-red-500">{t.upload.required}</span>
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className={`w-full rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-2.5 text-sm text-black shadow-sm transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            >
              <option value="">{t.upload.selectDepartment}</option>
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.common.topic} <span className="text-red-500">{t.upload.required}</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t.upload.enterTopic}
              className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black shadow-sm transition-all ${colors.focus} focus:outline-none focus:ring-2 placeholder:text-black`}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.common.category}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-2.5 text-sm text-black shadow-sm transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.common.role}
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-2.5 text-sm text-black shadow-sm transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.upload.files} <span className="text-red-500">{t.upload.required}</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <div className={`p-3 ${colors.icon} rounded-lg`}>
                  <FolderOpen className="h-8 w-8" />
                </div>
                <div>
                  <span className={`${colors.icon.replace('bg-', 'text-').replace('-50', '-600')} font-semibold`}>{t.upload.clickToSelect}</span>
                  <span className="text-gray-500"> {t.upload.dragFiles}</span>
                </div>
                <p className="text-xs text-gray-400">{t.upload.fileTypes}</p>
              </label>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleUpload}
            className={`px-4 py-2 ${colors.button} text-white rounded-lg transition-colors font-medium`}
          >
            {t.upload.uploadFiles}
          </button>
        </div>
      </div>
    </div>
  );
}
