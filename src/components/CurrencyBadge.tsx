import { getCurrencyBadgeStyle } from '../lib/currency';

interface CurrencyBadgeProps {
  type: 'local' | 'USD' | 'mixed';
}

export function CurrencyBadge({ type }: CurrencyBadgeProps) {
  const style = getCurrencyBadgeStyle(type);
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {type === 'local' && '₦ Local'}
      {type === 'USD' && '$ USD'}
      {type === 'mixed' && '~ Mixed'}
    </span>
  );
}
