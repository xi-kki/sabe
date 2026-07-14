import { SourcingRequest, Supplier, ChatMessage } from './types';
import { searchSuppliers } from './search';
import { assessSupplierRisk } from './risk';
import { analyzeCurrencyExposure } from './currency';

const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY || '';

/** Sanitize user input — strip potential XSS and trim */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>"'`]/g, '') // Strip HTML/script chars
    .replace(/javascript:/gi, '') // Strip JS protocol
    .replace(/on\w+=/gi, '') // Strip event handlers
    .trim()
    .slice(0, 500); // Cap at 500 chars
}

export function parseSourcingRequest(query: string): SourcingRequest {
  const sanitized = sanitizeInput(query);
  const lower = sanitized.toLowerCase();
  
  // Extract item
  let item = '';
  const itemPatterns = [
    /(?:need|want|looking for|searching for|find)\s+(.+?)(?:\s+in|\s+from|\s+around|$)/i,
    /(.+?)(?:\s+supplier|\s+vendor|\s+manufacturer|\s+producer)/i,
  ];
  
  for (const pattern of itemPatterns) {
    const match = query.match(pattern);
    if (match) {
      item = match[1].trim();
      break;
    }
  }
  
  if (!item) {
    item = sanitized.split(' ').slice(0, 3).join(' ');
  }

  // Extract quantity
  let quantity = '';
  const qtyMatch = query.match(/(\d+[\d,]*\s*(?:kg|ton|pack|bag|carton|pallet|unit|piece|liter|gallon))/i);
  if (qtyMatch) {
    quantity = qtyMatch[1];
  }

  // Extract region
  let region = 'Nigeria'; // Default
  const regions: Record<string, string> = {
    'lagos': 'Lagos, Nigeria',
    'nigeria': 'Nigeria',
    'kenya': 'Kenya',
    'ghana': 'Ghana',
    'south africa': 'South Africa',
    'ethiopia': 'Ethiopia',
    'tanzania': 'Tanzania',
    'uganda': 'Uganda',
    'rwanda': 'Rwanda',
    'west africa': 'West Africa',
    'east africa': 'East Africa',
  };
  
  for (const [key, value] of Object.entries(regions)) {
    if (lower.includes(key)) {
      region = value;
      break;
    }
  }

  return {
    item: sanitizeInput(item),
    quantity: sanitizeInput(quantity),
    region,
    rawQuery: sanitized,
  };
}

export async function processSourcingRequest(
  query: string,
  _history: ChatMessage[]
): Promise<{ message: string; suppliers: Supplier[] }> {
  const sanitized = sanitizeInput(query);
  const request = parseSourcingRequest(sanitized);
  
  // Search for suppliers
  let suppliers = await searchSuppliers(request, SERPER_API_KEY);
  
  // Enrich with risk and currency analysis
  suppliers = suppliers.map(supplier => {
    const risk = assessSupplierRisk(supplier);
    const currency = analyzeCurrencyExposure(supplier);
    
    return {
      ...supplier,
      riskScore: risk.score,
      riskLevel: risk.level,
      currencyRisk: currency.riskLevel,
    };
  });
  
  // Sort by confidence and risk
  suppliers.sort((a, b) => {
    const confOrder = { high: 0, medium: 1, low: 2 };
    return confOrder[a.confidence] - confOrder[b.confidence];
  });
  
  // Take top 5
  suppliers = suppliers.slice(0, 5);
  
  // Generate response message
  const message = generateResponseMessage(request, suppliers);
  
  return { message, suppliers };
}

function generateResponseMessage(request: SourcingRequest, suppliers: Supplier[]): string {
  const region = request.region;
  const item = request.item;
  
  let response = `I found **${suppliers.length} suppliers** for ${item} in ${region}.\n\n`;
  
  const highConf = suppliers.filter(s => s.confidence === 'high').length;
  const medConf = suppliers.filter(s => s.confidence === 'medium').length;
  
  if (highConf > 0) {
    response += `✅ **${highConf} high-confidence** matches\n`;
  }
  if (medConf > 0) {
    response += `⚠️ **${medConf} medium-confidence** matches\n`;
  }
  
  response += `\nReview the supplier cards below. You can ask me to:\n`;
  response += `- Compare specific suppliers\n`;
  response += `- Get more details on any supplier\n`;
  response += `- Find alternatives with different criteria\n`;
  response += `- Escalate to a human sourcing expert`;
  
  return response;
}

export function generateFollowUpResponse(
  query: string,
  suppliers: Supplier[]
): string {
  const lower = query.toLowerCase();
  
  if (lower.includes('compare') || lower.includes('difference')) {
    return generateComparison(suppliers);
  }
  
  if (lower.includes('cheapest') || lower.includes('lowest price')) {
    return 'Filtering by lowest price... The suppliers are already sorted by confidence. Check the price ranges on each card.';
  }
  
  if (lower.includes('local') || lower.includes('nigerian')) {
    return 'Filtering for local suppliers... Check the "Import Dependency" badge on each card — green means local.';
  }
  
  if (lower.includes('human') || lower.includes('expert') || lower.includes('talk')) {
    return ' escalating to a human sourcing expert. Please provide your contact details and a brief description of your needs, and our team will reach out within 24 hours.';
  }
  
  return `I can help you with that. Try asking me to:\n- Compare suppliers\n- Find local-only options\n- Get risk details\n- Talk to a human expert`;
}

function generateComparison(suppliers: Supplier[]): string {
  if (suppliers.length < 2) {
    return 'Need at least 2 suppliers to compare. Let me search for more options.';
  }
  
  let comparison = '**Supplier Comparison:**\n\n';
  comparison += '| Factor | ' + suppliers.slice(0, 3).map(s => s.name.slice(0, 15)).join(' | ') + '|\n';
  comparison += '|--------|' + suppliers.slice(0, 3).map(() => '--------').join('|') + '|\n';
  comparison += '| Price | ' + suppliers.slice(0, 3).map(s => s.priceRange.slice(0, 15)).join(' | ') + '|\n';
  comparison += '| Risk | ' + suppliers.slice(0, 3).map(s => s.confidence).join(' | ') + '|\n';
  comparison += '| Currency | ' + suppliers.slice(0, 3).map(s => s.currencyExposure).join(' | ') + '|\n';
  
  return comparison;
}
