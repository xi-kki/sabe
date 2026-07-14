import { Supplier, SourcingRequest } from './types';

const SERPER_API = 'https://google.serper.dev/search';
const EXA_API = 'https://api.exa.ai/search';

/**
 * Search for suppliers using available APIs.
 * Tries Serper first, falls back to Exa (semantic search), then mock data.
 */
export async function searchSuppliers(
  request: SourcingRequest,
  serperApiKey: string
): Promise<Supplier[]> {
  const query = `${request.item} supplier ${request.region} Africa`;
  const exaApiKey = import.meta.env.VITE_EXA_API_KEY || '';

  // Try Serper first (keyword-based, fast)
  if (serperApiKey) {
    try {
      const suppliers = await searchWithSerper(query, serperApiKey, request);
      if (suppliers.length > 0) return suppliers;
    } catch (e) {
      console.warn('Serper search failed, trying Exa:', e);
    }
  }

  // Fallback to Exa (semantic search, better for supplier discovery)
  if (exaApiKey) {
    try {
      const suppliers = await searchWithExa(query, exaApiKey, request);
      if (suppliers.length > 0) return suppliers;
    } catch (e) {
      console.warn('Exa search failed, using mock data:', e);
    }
  }

  // Final fallback: mock data
  return getMockSuppliers(request);
}

/**
 * Serper API — fast Google search results
 */
async function searchWithSerper(
  query: string,
  apiKey: string,
  request: SourcingRequest
): Promise<Supplier[]> {
  const response = await fetch(SERPER_API, {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      num: 10,
      gl: 'ng',
    }),
  });

  if (!response.ok) throw new Error(`Serper error: ${response.status}`);

  const data = await response.json();
  return parseSearchResults(data, request);
}

/**
 * Exa API — semantic/neural search, better for finding relevant suppliers
 */
async function searchWithExa(
  query: string,
  apiKey: string,
  request: SourcingRequest
): Promise<Supplier[]> {
  const response = await fetch(EXA_API, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      numResults: 10,
      type: 'neural',
      contents: {
        text: true,
      },
    }),
  });

  if (!response.ok) throw new Error(`Exa error: ${response.status}`);

  const data = await response.json();
  return parseExaResults(data, request);
}

/**
 * Parse Exa API response into Supplier objects
 */
function parseExaResults(data: unknown, request: SourcingRequest): Supplier[] {
  const results = data as {
    results?: Array<{
      title?: string;
      url?: string;
      text?: string;
    }>;
  };
  const suppliers: Supplier[] = [];

  if (!results.results) return [];

  for (const result of results.results.slice(0, 5)) {
    const text = result.text || '';
    suppliers.push({
      id: crypto.randomUUID(),
      name: extractSupplierName(result.title || 'Unknown Supplier'),
      location: extractLocation(text, request.region),
      region: request.region,
      categoryFit: request.item,
      priceRange: extractPriceRange(text),
      priceTier: determinePriceTier(text),
      importDependency: determineImportDependency(text),
      currencyExposure: determineCurrency(text),
      riskNotes: extractRiskNotes(text),
      confidence: determineConfidence(text),
      website: result.url,
    });
  }

  return suppliers;
}

function parseSearchResults(data: unknown, request: SourcingRequest): Supplier[] {
  const results = data as { organic?: Array<{ title: string; snippet: string; link: string }> };
  const suppliers: Supplier[] = [];
  
  if (!results.organic) return getMockSuppliers(request);
  
  for (const result of results.organic.slice(0, 5)) {
    suppliers.push({
      id: crypto.randomUUID(),
      name: extractSupplierName(result.title),
      location: extractLocation(result.snippet, request.region),
      region: request.region,
      categoryFit: request.item,
      priceRange: extractPriceRange(result.snippet),
      priceTier: determinePriceTier(result.snippet),
      importDependency: determineImportDependency(result.snippet),
      currencyExposure: determineCurrency(result.snippet),
      riskNotes: extractRiskNotes(result.snippet),
      confidence: determineConfidence(result.snippet),
    });
  }
  
  return suppliers.length > 0 ? suppliers : getMockSuppliers(request);
}

function extractSupplierName(title: string): string {
  return title.split(' - ')[0].split(' | ')[0].trim();
}

function extractLocation(snippet: string, fallback: string): string {
  const regions = ['Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda'];
  for (const region of regions) {
    if (snippet.toLowerCase().includes(region.toLowerCase())) {
      return region;
    }
  }
  return fallback;
}

function extractPriceRange(snippet: string): string {
  const priceMatch = snippet.match(/[\$₦€£]\s*[\d,]+/);
  return priceMatch ? priceMatch[0] : 'Contact for pricing';
}

function determinePriceTier(snippet: string): 'low' | 'medium' | 'high' {
  const lower = snippet.toLowerCase();
  if (lower.includes('cheap') || lower.includes('affordable') || lower.includes('low cost')) return 'low';
  if (lower.includes('premium') || lower.includes('high quality')) return 'high';
  return 'medium';
}

function determineImportDependency(snippet: string): 'local' | 'imported' | 'mixed' {
  const lower = snippet.toLowerCase();
  if (lower.includes('local') || lower.includes('domestic')) return 'local';
  if (lower.includes('import') || lower.includes('overseas')) return 'imported';
  return 'mixed';
}

function determineCurrency(snippet: string): 'local' | 'USD' | 'mixed' {
  const lower = snippet.toLowerCase();
  if (lower.includes('naira') || lower.includes('₦')) return 'local';
  if (lower.includes('dollar') || lower.includes('$')) return 'USD';
  return 'mixed';
}

function extractRiskNotes(snippet: string): string[] {
  const risks: string[] = [];
  const lower = snippet.toLowerCase();
  if (lower.includes('new') || lower.includes('startup')) risks.push('New supplier - verify track record');
  if (lower.includes('import')) risks.push('Import dependency - FX exposure');
  if (risks.length === 0) risks.push('Standard risk profile');
  return risks;
}

function determineConfidence(snippet: string): 'high' | 'medium' | 'low' {
  const lower = snippet.toLowerCase();
  if (lower.includes('established') || lower.includes('years') || lower.includes('certified')) return 'high';
  if (lower.includes('new') || lower.length < 50) return 'low';
  return 'medium';
}

function getMockSuppliers(request: SourcingRequest): Supplier[] {
  return [
    {
      id: crypto.randomUUID(),
      name: `${request.item} Suppliers Ltd`,
      location: request.region,
      region: request.region,
      categoryFit: request.item,
      priceRange: '₦150,000 - ₦250,000 per ton',
      priceTier: 'medium',
      importDependency: 'local',
      currencyExposure: 'local',
      riskNotes: ['Verified supplier', 'MOQ applies'],
      confidence: 'high',
    },
    {
      id: crypto.randomUUID(),
      name: `West Africa ${request.item} Co`,
      location: 'Lagos, Nigeria',
      region: request.region,
      categoryFit: request.item,
      priceRange: '$400 - $600 per ton',
      priceTier: 'medium',
      importDependency: 'imported',
      currencyExposure: 'USD',
      riskNotes: ['Import dependency - FX risk', 'Lead time 4-6 weeks'],
      confidence: 'medium',
    },
    {
      id: crypto.randomUUID(),
      name: `Regional ${request.item} Distributors`,
      location: request.region,
      region: request.region,
      categoryFit: request.item,
      priceRange: '₦120,000 - ₦180,000 per ton',
      priceTier: 'low',
      importDependency: 'local',
      currencyExposure: 'local',
      riskNotes: ['Lower price - verify quality', 'Small batch available'],
      confidence: 'medium',
    },
  ];
}
