import { Supplier } from './types';

export interface CurrencyExposure {
  type: 'local' | 'USD' | 'mixed';
  riskLevel: 'low' | 'medium' | 'high';
  volatilityNote: string;
  hedgingSuggestion?: string;
}

export function analyzeCurrencyExposure(supplier: Supplier): CurrencyExposure {
  const type = supplier.currencyExposure;
  
  switch (type) {
    case 'local':
      return {
        type: 'local',
        riskLevel: 'low',
        volatilityNote: 'Pricing in local currency - no FX exposure',
      };
    case 'USD':
      return {
        type: 'USD',
        riskLevel: 'high',
        volatilityNote: 'USD-denominated - significant FX volatility risk',
        hedgingSuggestion: 'Consider forward contracts or negotiate Naira pricing',
      };
    case 'mixed':
      return {
        type: 'mixed',
        riskLevel: 'medium',
        volatilityNote: 'Mixed currency pricing - partial FX exposure',
        hedgingSuggestion: 'Clarify payment currency before commitment',
      };
  }
}

export function getCurrencyBadgeStyle(type: 'local' | 'USD' | 'mixed'): string {
  switch (type) {
    case 'local': return 'bg-green-100 text-green-800';
    case 'USD': return 'bg-orange-100 text-orange-800';
    case 'mixed': return 'bg-blue-100 text-blue-800';
  }
}

export function formatPriceWithCurrency(price: string, currency: 'local' | 'USD' | 'mixed'): string {
  if (currency === 'local') return `₦${price}`;
  if (currency === 'USD') return `$${price}`;
  return price;
}
