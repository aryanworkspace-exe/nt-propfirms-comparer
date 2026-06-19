import { Selection } from '../types';
import {
  parsePercent,
  parseSplitMax,
  parseLeverage,
  parseSize,
  getPrice,
  getSizeLabel,
  countRestrictions,
  hasRefund,
  isInstant,
  isUnlimitedTime,
} from './parse';

export interface ScoreBreakdown {
  total: number;
  price: number;
  drawdown: number;
  split: number;
  target: number;
  payout: number;
  restrictions: number;
  leverage: number;
  time: number;
  scaling: number;
  bonus: number;
  confidence: 'High' | 'Medium' | 'Low';
}

// Weights from spec:
// Price 15, Drawdown 20, Split 15, Target 15, Payout 10,
// Restrictions 10, Leverage 5, Time 5, Scaling 5
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// Returns drawdown as a percent of account size, handling $ values
const getDrawdownPct = (s: Selection): number => {
  const raw = s.account.rules.maxDrawdown;
  if (raw.includes('$')) {
    const size = parseSize(getSizeLabel(s));
    const dollar = parsePercent(raw) * (raw.includes(',') ? 1 : 1); // parsePercent grabs first number
    if (size > 0) return (dollar / size) * 100;
    return 6;
  }
  return parsePercent(raw);
};

const getTargetPct = (s: Selection): number => {
  const raw = s.account.rules.phase1Target;
  if (raw.toLowerCase() === 'none') return 0;
  if (raw.includes('$')) {
    const size = parseSize(getSizeLabel(s));
    const dollar = parsePercent(raw);
    if (size > 0) return (dollar / size) * 100;
    return 8;
  }
  // 2-step: add phase 2
  let target = parsePercent(raw);
  const p2 = s.account.rules.phase2Target;
  if (p2 && !p2.toLowerCase().includes('n/a') && !p2.includes('$')) {
    target += parsePercent(p2);
  }
  return target;
};

export const calculateBreakdown = (s: Selection): ScoreBreakdown => {
  const size = parseSize(getSizeLabel(s));
  const price = getPrice(s);

  // PRICE (15): price as % of account size; lower is better.
  // Typical good = ~0.5% of size, bad = ~2%+
  const priceRatio = size > 0 ? (price / size) * 100 : 1;
  const priceScore = clamp(15 - (priceRatio - 0.4) * 8, 0, 15);

  // DRAWDOWN (20): higher max drawdown = more room = better
  const dd = getDrawdownPct(s);
  const drawdownScore = clamp((dd / 12) * 20, 0, 20);

  // SPLIT (15): higher is better
  const split = parseSplitMax(s.account.rules.profitSplit);
  const splitScore = clamp((split / 100) * 15, 0, 15);

  // TARGET (15): lower combined target = better
  const target = getTargetPct(s);
  // 0% (instant) => full, ~15% combined => ~half, 20%+ => low
  const targetScore = clamp(15 - target * 0.7, 0, 15);

  // PAYOUT (10)
  const pf = s.account.rules.payoutFrequency.toLowerCase();
  let payoutScore = 4;
  if (pf.includes('on-demand') || pf.includes('daily') || pf.includes('48')) payoutScore = 10;
  else if (pf.includes('weekly') || pf.includes('5')) payoutScore = 8;
  else if (pf.includes('bi-weekly') || pf.includes('14')) payoutScore = 6;
  else if (pf.includes('30') || pf.includes('monthly')) payoutScore = 3;

  // RESTRICTIONS (10): fewer = better
  const restrictions = countRestrictions(s);
  const restrictionsScore = clamp(10 - restrictions * 3.3, 0, 10);

  // LEVERAGE (5)
  const lev = parseLeverage(s.account.rules.leverage);
  let leverageScore = 2.5;
  if (lev >= 100) leverageScore = 5;
  else if (lev >= 50) leverageScore = 3.5;
  else if (lev >= 30) leverageScore = 2.5;
  else if (s.account.rules.leverage.toLowerCase() === 'futures') leverageScore = 4;
  else leverageScore = 1.5;

  // TIME (5)
  const timeScore = isUnlimitedTime(s) ? 5 : 2;

  // SCALING (5): higher cap = better
  const scaling = s.account.rules.scaling;
  let scalingScore = 3;
  if (scaling.includes('3M')) scalingScore = 5;
  else if (scaling.includes('2M')) scalingScore = 4.5;
  else if (scaling.includes('1M')) scalingScore = 4;
  else if (scaling.includes('500K')) scalingScore = 3;
  else if (scaling.includes('150K') || scaling.includes('100K') || scaling.includes('50K')) scalingScore = 2;

  // BONUSES (added but total capped at 100)
  let bonus = 0;
  if (hasRefund(s)) bonus += 3;
  if (isInstant(s)) bonus += 2;

  let total =
    priceScore +
    drawdownScore +
    splitScore +
    targetScore +
    payoutScore +
    restrictionsScore +
    leverageScore +
    timeScore +
    scalingScore +
    bonus;

  total = clamp(Math.round(total), 0, 100);

  return {
    total,
    price: Math.round(priceScore),
    drawdown: Math.round(drawdownScore),
    split: Math.round(splitScore),
    target: Math.round(targetScore),
    payout: Math.round(payoutScore),
    restrictions: Math.round(restrictionsScore),
    leverage: Math.round(leverageScore),
    time: Math.round(timeScore),
    scaling: Math.round(scalingScore),
    bonus,
    confidence: 'Medium',
  };
};

export const calculateScore = (s: Selection): number => calculateBreakdown(s).total;

export const getConfidence = (diff: number): 'High' | 'Medium' | 'Low' => {
  if (diff >= 12) return 'High';
  if (diff >= 5) return 'Medium';
  return 'Low';
};
