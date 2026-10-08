export interface Quote {
  rate: string;
  amount: number;
  createdAt: string;
}

export interface QuoteRequest {
  from: string;
  to: string;
  amount: number;
}
