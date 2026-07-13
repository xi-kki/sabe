import { Supplier } from '../lib/types';
import { assessSupplierRisk } from '../lib/risk';
import { analyzeCurrencyExposure } from '../lib/currency';
import { RiskBadge } from './RiskBadge';
import { CurrencyBadge } from './CurrencyBadge';

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const risk = assessSupplierRisk(supplier);
  const currency = analyzeCurrencyExposure(supplier);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
          <p className="text-sm text-gray-500">{supplier.location}</p>
        </div>
        <RiskBadge level={risk.level} score={risk.score} />
      </div>
      
      {/* Category Fit */}
      <div className="mb-3">
        <span className="text-xs text-gray-500 uppercase tracking-wide">Category</span>
        <p className="text-sm font-medium text-gray-700">{supplier.categoryFit}</p>
      </div>
      
      {/* Price Range */}
      <div className="mb-3">
        <span className="text-xs text-gray-500 uppercase tracking-wide">Price Signal</span>
        <p className="text-sm font-medium text-gray-700">{supplier.priceRange}</p>
      </div>
      
      {/* Badges Row */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Import Dependency */}
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          supplier.importDependency === 'local' 
            ? 'bg-green-100 text-green-800' 
            : supplier.importDependency === 'imported'
            ? 'bg-orange-100 text-orange-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {supplier.importDependency === 'local' && '📍 Local'}
          {supplier.importDependency === 'imported' && '✈️ Imported'}
          {supplier.importDependency === 'mixed' && '🔄 Mixed'}
        </span>
        
        <CurrencyBadge type={supplier.currencyExposure} />
      </div>
      
      {/* Risk Notes */}
      {supplier.riskNotes.length > 0 && (
        <div className="mb-3">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Risk Notes</span>
          <ul className="mt-1 space-y-1">
            {supplier.riskNotes.map((note, idx) => (
              <li key={idx} className="text-xs text-gray-600 flex items-start">
                <span className="mr-1">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Currency Risk Note */}
      {currency.hedgingSuggestion && (
        <div className="bg-blue-50 rounded p-2 mb-3">
          <p className="text-xs text-blue-700">
            💡 {currency.hedgingSuggestion}
          </p>
        </div>
      )}
      
      {/* Recommendation */}
      <div className="border-t pt-3">
        <p className="text-xs text-gray-600 italic">{risk.recommendation}</p>
      </div>
    </div>
  );
}
