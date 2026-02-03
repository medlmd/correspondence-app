import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export default function StatCard({ title, value, icon: Icon, color, bgColor }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>
        <div className={`rounded-lg ${bgColor} p-2.5`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
      <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${bgColor.replace('bg-', 'bg-gradient-to-r from-').replace('-100', '-400')} rounded-full transition-all duration-500 group-hover:w-full`} style={{ width: '60%' }}></div>
      </div>
    </div>
  );
}
