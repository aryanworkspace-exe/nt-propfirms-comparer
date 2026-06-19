import { Selection } from '../types';

// Extract first numeric/percentage value from a string like "10%", "80-90%", "1:100"
export const parsePercent = (val: string): number => {
  if (!val) return 0;
  const match = val.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

// Highest split if a range "60-100%" => 100
export const parseSplitMax = (val: string): number => {
  if (!val) return 0;
  const matches = val.match(/\d+(\.\d+)?/g);
  if (!matches) return 0;
  return Math.max(...matches.map((m) => parseFloat(m)));
};

export const parseLeverage = (val: string): number => {
  if (!val) return 0;
  const match = val.match(/1:(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

// Convert size label "50K" / "1.25K" => number in dollars
export const parseSize = (val: string): number => {
  if (!val) return 0;
  const match = val.match(/(\d+(\.\d+)?)/);
  if (!match) return 0;
  return parseFloat(match[1]) * 1000;
};

export const getPrice = (s: Selection): number =>
  s.account.sizes[s.sizeIndex]?.price ?? 0;

export const getSizeLabel = (s: Selection): string =>
  s.account.sizes[s.sizeIndex]?.size ?? '';

// Is the rule "good" for the trader regarding restrictions?
export const countRestrictions = (s: Selection): number => {
  const r = s.account.rules;
  let count = 0;
  if (r.weekendHolding.toLowerCase().includes('no')) count++;
  if (r.newsTrading.toLowerCase().includes('not allowed') || r.newsTrading.toLowerCase().includes('restricted') || r.newsTrading.toLowerCase() === 'no') count++;
  const cons = r.consistencyRule.toLowerCase();
  if (cons !== 'none' && cons !== '') count++;
  return count;
};

export const hasRefund = (s: Selection): boolean => {
  const r = s.account.rules.refund.toLowerCase();
  return r !== 'no' && !r.includes('no ') && r !== '';
};

export const isInstant = (s: Selection): boolean =>
  s.account.type.toLowerCase() === 'instant';

export const isUnlimitedTime = (s: Selection): boolean =>
  s.account.rules.timeLimit.toLowerCase().includes('unlimited') ||
  s.account.rules.timeLimit.toLowerCase() === 'n/a';
