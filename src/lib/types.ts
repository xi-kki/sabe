export interface Supplier {
  id: string;
  name: string;
  location: string;
  region: string;
  contact?: string;
  categoryFit: string;
  priceRange: string;
  priceTier: 'low' | 'medium' | 'high';
  importDependency: 'local' | 'imported' | 'mixed';
  currencyExposure: 'local' | 'USD' | 'mixed';
  riskNotes: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface SourcingRequest {
  item: string;
  quantity: string;
  region: string;
  rawQuery: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  suppliers?: Supplier[];
  timestamp: Date;
}
