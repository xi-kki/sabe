import { Supplier } from '../lib/types';
import { SupplierCard } from './SupplierCard';

interface SupplierListProps {
  suppliers: Supplier[];
}

export function SupplierList({ suppliers }: SupplierListProps) {
  if (suppliers.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Supplier Shortlist ({suppliers.length})
        </h2>
        <span className="text-xs text-gray-500">
          Sorted by confidence
        </span>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
}
