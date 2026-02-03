import { Document, Correspondence } from '@/types';

export function convertToDocument(correspondence: Correspondence): Document {
  const getFileType = (fileName?: string): 'pdf' | 'word' | 'excel' | 'other' => {
    if (!fileName) return 'other';
    const ext = fileName.toLowerCase().split('.').pop();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc' || ext === 'docx') return 'word';
    if (ext === 'xls' || ext === 'xlsx') return 'excel';
    return 'other';
  };

  const fileName = correspondence.attachments?.[0] || correspondence.title;
  
  return {
    ...correspondence,
    topic: (correspondence as any).topic || correspondence.title,
    description: correspondence.content || (correspondence as any).description || '',
    fileName: fileName,
    fileType: getFileType(fileName),
    fileSize: (correspondence as any).fileSize || 0,
    documentNumber: (correspondence as any).documentNumber || correspondence.serialNumber,
  } as Document;
}
