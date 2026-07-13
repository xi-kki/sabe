import { Supplier } from './types';

export interface RiskAssessment {
  score: number;
  level: 'low' | 'medium' | 'high';
  flags: string[];
  recommendation: string;
}

export function assessSupplierRisk(supplier: Supplier): RiskAssessment {
  const flags: string[] = [];
  let score = 50; // Base score

  // Confidence adjustment
  if (supplier.confidence === 'high') score += 20;
  else if (supplier.confidence === 'low') score -= 20;

  // Import dependency risk
  if (supplier.importDependency === 'imported') {
    score -= 15;
    flags.push('Import dependency - supply chain risk');
  }

  // Currency exposure risk
  if (supplier.currencyExposure === 'USD') {
    score -= 10;
    flags.push('USD pricing - FX volatility exposure');
  }

  // Price tier signals
  if (supplier.priceTier === 'low') {
    flags.push('Below-average pricing - verify quality');
  }

  // Add existing risk notes
  flags.push(...supplier.riskNotes.filter(r => r.includes('risk') || r.includes('verify')));

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine level
  let level: 'low' | 'medium' | 'high';
  if (score >= 70) level = 'low';
  else if (score >= 40) level = 'medium';
  else level = 'high';

  // Generate recommendation
  const recommendation = generateRecommendation(level, flags);

  return { score, level, flags, recommendation };
}

function generateRecommendation(level: 'low' | 'medium' | 'high', flags: string[]): string {
  if (level === 'low') {
    return 'Good candidate. Proceed with standard due diligence.';
  }
  if (level === 'high') {
    return 'High risk. Recommend thorough verification before commitment.';
  }
  // Medium
  if (flags.some(f => f.includes('FX'))) {
    return 'Moderate risk. Consider negotiating local currency pricing.';
  }
  return 'Moderate risk. Request samples and references before ordering.';
}

export function getRiskColor(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low': return 'text-green-600 bg-green-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'high': return 'text-red-600 bg-red-50';
  }
}
