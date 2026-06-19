export interface AccountSize {
  size: string;
  price: number;
}

export interface AccountRules {
  phase1Target: string;
  phase2Target: string;
  dailyLoss: string;
  maxDrawdown: string;
  drawdownType: string;
  minTradingDays: number;
  timeLimit: string;
  leverage: string;
  profitSplit: string;
  payoutFrequency: string;
  refund: string;
  newsTrading: string;
  weekendHolding: string;
  consistencyRule: string;
  scaling: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  sizes: AccountSize[];
  rules: AccountRules;
}

export interface Firm {
  id: string;
  name: string;
  logo: string;
  description: string;
  founded: string;
  trustpilot: string;
  platforms: string[];
  accounts: Account[];
}

export interface FirmsData {
  firms: Firm[];
}

// A fully resolved selection: a specific firm + account + size
export interface Selection {
  firm: Firm;
  account: Account;
  sizeIndex: number;
}
