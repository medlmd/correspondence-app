import { Correspondence, Document } from '@/types';
import DocumentCard from '@/components/DocumentCard';
import { convertToDocument } from '@/lib/documentUtils';

interface CorrespondenceCardProps {
  correspondence: Correspondence;
  onClick?: () => void;
  onDelete?: (document: Document) => void;
}

export default function CorrespondenceCard({ correspondence, onClick, onDelete }: CorrespondenceCardProps) {
  const document = convertToDocument(correspondence);
  return <DocumentCard document={document} onClick={onClick} onDelete={onDelete} />;
}
