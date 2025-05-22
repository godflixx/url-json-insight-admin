
export interface AITool {
  id?: string;
  title: string;
  description: string;
  website: string;
  image: string;
  thumbnail: string;
  categories: string[];
  pricing_type: PricingType;
  pricing_details?: PricingDetails;
  features: Feature[];
  use_cases: string[];
  compatible_platforms: string[];
  integrations: string[];
  api_available: boolean;
  api_documentation?: string;
  creator?: string;
  creator_website?: string;
  model_details?: ModelDetails;
  version?: string;
  tags: string[];
}

export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Subscription';

export interface PricingDetails {
  tiers?: PricingTier[];
  starting_price?: number;
  has_free_trial?: boolean;
  trial_days?: number;
}

export interface PricingTier {
  name: string;
  price: number;
  billing: 'monthly' | 'yearly' | 'one-time';
  features: string[];
}

export interface Feature {
  name: string;
  description: string;
}

export interface ModelDetails {
  name?: string;
  provider?: string;
  type?: string;
  parameters?: number;
  training_data?: string;
  last_updated?: string;
}

export interface ApiResponse {
  success: boolean;
  data?: AITool[];
  message?: string;
  error?: string;
}
