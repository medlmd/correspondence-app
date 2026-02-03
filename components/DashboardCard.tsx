'use client';

import { Correspondence } from '@/types';
import DocumentCard from '@/components/DocumentCard';
import { convertToDocument } from '@/lib/documentUtils';

interface DashboardCardProps {
  correspondence: Correspondence;
  onClick?: () => void;
}

export default function DashboardCard({ correspondence, onClick }: DashboardCardProps) {
  const document = convertToDocument(correspondence);
  return <DocumentCard document={document} onClick={onClick} />;
}
