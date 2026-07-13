import { getRiskColor } from '../lib/risk';

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
  score?: number;
}

export function RiskBadge({ level, score }: RiskBadgeProps) {
  const colorClass = getRiskColor(level);
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {level === 'low' && '✓'}
      {level === 'medium' && '⚠'}
      {level === 'high' && '✕'}
      <span className="ml-1 capitalize">{level} Risk</span>
      {score !== undefined && (
        <span className="ml-1 opacity-75">({score})</span>
      )}
    </span>
  );
}
