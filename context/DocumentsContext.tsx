'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Document, DocumentType } from '@/types';

interface DocumentsContextType {
  documents: Document[];
  addDocument: (doc: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  getDocumentsByType: (type: DocumentType) => Document[];
  getStats: () => {
    incoming: number;
    outgoing: number;
    internal: number;
    archived: number;
    urgent: number;
    pending: number;
  };
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);

  const addDocument = (doc: Document) => {
    setDocuments(prev => [...prev, doc]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getDocumentsByType = (type: DocumentType) => {
    return documents.filter(doc => doc.type === type);
  };

  const getStats = () => {
    return {
      incoming: documents.filter(d => d.type === 'incoming').length,
      outgoing: documents.filter(d => d.type === 'outgoing').length,
      internal: documents.filter(d => d.type === 'internal').length,
      archived: documents.filter(d => d.status === 'archived').length,
      urgent: documents.filter(d => d.priority === 'urgent').length,
      pending: documents.filter(d => d.status === 'pending').length,
    };
  };

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        getDocumentsByType,
        getStats,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }
  return context;
}
