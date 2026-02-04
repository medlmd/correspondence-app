export type UserRole = 'admin' | 'general_manager' | 'department_manager' | 'writer' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export type DocumentType = 'incoming' | 'outgoing' | 'internal' | 'port_company';
export type DocumentFileType = 'pdf' | 'word' | 'excel' | 'other';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'pending' | 'in_review' | 'replied' | 'archived' | 'completed' | 'pending_secretary' | 'forwarded_to_dg' | 'approved_by_dg' | 'rejected_by_dg' | 'commented_by_dg' | 'forwarded_to_department';

export type DocumentRole = 'All' | 'Dir' | 'SimpleUsers';
export type DocumentCategory = 'المشتريات' | 'العقود' | 'الشؤون القانونية' | 'الفواتير';

export interface Document {
  id: string;
  type: DocumentType;
  title: string;
  topic: string;
  description?: string;
  fileName: string;
  fileType: DocumentFileType;
  fileSize?: number; // in bytes
  department?: string;
  sender?: string;
  recipient?: string;
  priority: Priority;
  status: Status;
  date: Date;
  documentNumber?: string;
  attachments?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  role?: DocumentRole;
  category?: DocumentCategory;
  company?: string; // For port company documents
  workflowStatus?: Status; // For port company workflow
  gmResponse?: 'approved' | 'rejected' | 'commented'; // GM's response
  gmComment?: string; // GM's comment if commented
  forwardedBy?: string; // Who forwarded the document
  forwardedTo?: string; // Who it was forwarded to
}

// Keep Correspondence for backward compatibility
export type CorrespondenceType = DocumentType;
export interface Correspondence extends Omit<Document, 'documentNumber' | 'topic' | 'fileName' | 'fileType' | 'fileSize' | 'description'> {
  serialNumber?: string; // Legacy field, maps to documentNumber
  content?: string; // Legacy field, maps to description
  documentNumber?: string; // Optional for new documents
  topic?: string; // Optional for new documents
  fileName?: string; // Optional for new documents
  fileType?: DocumentFileType; // Optional for new documents
  fileSize?: number; // Optional for new documents
  description?: string; // Optional for new documents
}

export interface DashboardStats {
  incoming: number;
  outgoing: number;
  internal: number;
  archived: number;
  urgent: number;
  pending: number;
}
