import { useState } from 'react';
import { motion } from 'framer-motion';
import { Selection } from '../types';
import { calculateBreakdown, getConfidence } from '../utils/scoring';
import {
  getPrice,
  getSizeLabel,
  parseSize,
  parsePercent,
  parseSplitMax,
  hasRefund,
  isInstant,
  isUnlimitedTime,
} from '../utils/parse';

interface Props {
  left: Selection;
  right: Selection;
}

const ScoreBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-[#8E9BB5]">{label}</span>
      <span className="text-white">{value}/{max}</span>
    </div>
    <div className="h-2 bg-[#05081A] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.8 }}
      />
    </div>
  </div>
);

const VerdictCard = ({ left, right }: Props) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const lb = calculateBreakdown(left);
  const rb = calculateBreakdown(right);

  const leftWins = lb.total >= rb.total;
  const winner = leftWins ? left : right;
  const loser = leftWins ? right : left;
  const winScore = leftWins ? lb.total : rb.total;
  const winBreakdown = leftWins ? lb : rb;
  const diff = Math.abs(lb.total - rb.total);
  const confidence = getConfidence(diff);

  // Insights
  const wSize = parseSize(getSizeLabel(winner));
  const lSize = parseSize(getSizeLabel(loser));
  const wPriceRatio = wSize ? getPrice(winner) / wSize : 1;
  const lPriceRatio = lSize ? getPrice(loser) / lSize : 1;
  const cheaperPct = lPriceRatio > 0 ? Math.round(((lPriceRatio - wPriceRatio) / lPriceRatio) * 100) : 0;

  const reasons: string[] = [];
  if (cheaperPct > 0) reasons.push(`~${cheaperPct}% cheaper per dollar funded`);
  if (parsePercent(winner.account.rules.maxDrawdown) > parsePercent(loser.account.rules.maxDrawdown) && !winner.account.rules.maxDrawdown.includes('$')) reasons.push('More drawdown room');
  if (parseSplitMax(winner.account.rules.profitSplit) > parseSplitMax(loser.account.rules.profitSplit)) reasons.push(`Higher profit split (${winner.account.rules.profitSplit})`);
  if (winBreakdown.payout >= 8) reasons.push('Faster payout cycle');
  if (winner.account.rules.consistencyRule === 'None' && loser.account.rules.consistencyRule !== 'None') reasons.push('No consistency rule');
  if (isUnlimitedTime(winner) && !isUnlimitedTime(loser)) reasons.push('No time limit');
  if (reasons.length === 0) reasons.push('Stronger overall balance of rules');

  // Pros / Cons
  const pros: string[] = [];
  const cons: string[] = [];
  if (hasRefund(winner)) pros.push('Fee refund available');
  if (isInstant(winner)) pros.push('Instant funding — no evaluation');
  if (winBreakdown.split >= 13) pros.push('Excellent profit split');
  if (winBreakdown.drawdown >= 16) pros.push('Generous drawdown allowance');
  if (winBreakdown.payout >= 8) pros.push('Fast / flexible payouts');
  if (winBreakdown.price >= 11) pros.push('Strong pricing value');
  if (winner.account.rules.consistencyRule !== 'None') cons.push(`Consistency rule: ${winner.account.rules.consistencyRule}`);
  if (winner.account.rules.weekendHolding.toLowerCase().includes('no')) cons.push('No weekend holding');
  if (winner.account.rules.maxDrawdown.includes('Trailing') || winner.account.rules.drawdownType.includes('Trailing')) cons.push('Trailing drawdown');
  if (winner.account.rules.newsTrading.toLowerCase().includes('not allowed') || winner.account.rules.newsTrading.toLowerCase() === 'no') cons.push('News trading restricted');
  if (pros.length === 0) pros.push('Balanced overall package');
  if (cons.length === 0) cons.push('No major drawbacks detected');

  // Best for
  const bestFor: string[] = [];
  if (isInstant(winner)) bestFor.push('No-Eval Traders');
  if (isUnlimitedTime(winner)) bestFor.push('Swing Traders');
  if (winBreakdown.payout >= 8) bestFor.push('Fast Payout');
  if (winBreakdown.price >= 11) bestFor.push('Beginners / Budget');
  if (winBreakdown.scaling >= 4) bestFor.push('Scaling');
  if (bestFor.length === 0) bestFor.push('All-Round Traders');

  const accent = leftWins ? '#6C63FF' : '#00D5FF';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mt-10 rounded-3xl p-8 md:p-12 overflow-hidden border border-white/10"
      style={{ background: 'linear-gradient(160deg, #0B1026 0%, #05081A 100%)' }}
    >
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: accent }}
      />
      <div className="relative">
        <div className="text-center mb-8">
          <span className="text-sm uppercase tracking-[0.3em] text-[#8E9BB5]">🏆 Final Verdict</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-1" style={{ color: accent }}>
            {winner.firm.name}
          </h2>
          <p className="text-[#8E9BB5]">
            {winner.account.name} · {getSizeLabel(winner)} · {winner.account.type}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/5 rounded-2xl p-5 text-center">
            <div className="text-3xl font-bold text-white">{winScore}</div>
            <div className="text-xs text-[#8E9BB5] mt-1">Overall / 100</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 text-center">
            <div className="text-3xl font-bold" style={{ color: '#00E7A7' }}>+{diff}</div>
            <div className="text-xs text-[#8E9BB5] mt-1">Margin</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 text-center">
            <div className="text-3xl font-bold text-white">{confidence}</div>
            <div className="text-xs text-[#8E9BB5] mt-1">Confidence</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 text-center">
            <div className="text-3xl font-bold text-white">${getPrice(winner)}</div>
            <div className="text-xs text-[#8E9BB5] mt-1">Entry Fee</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Why it wins */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Why It Wins</h4>
            <ul className="space-y-2">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-[#8E9BB5]">
                  <span className="text-[#00E7A7] mt-0.5">▸</span> {r}
                </li>
              ))}
            </ul>
            <h4 className="text-lg font-semibold mt-6 mb-3">Best For</h4>
            <div className="flex flex-wrap gap-2">
              {bestFor.map((b) => (
                <span key={b} className="text-xs px-3 py-1 rounded-full bg-[#6C63FF]/15 text-[#A855F7] border border-[#A855F7]/20">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Pros / Cons */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Pros</h4>
            <ul className="space-y-2 mb-6">
              {pros.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-white">
                  <span className="text-[#00E7A7]">✓</span> {p}
                </li>
              ))}
            </ul>
            <h4 className="text-lg font-semibold mb-4">Cons</h4>
            <ul className="space-y-2">
              {cons.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-[#8E9BB5]">
                  <span className="text-[#FF5C7C]">✕</span> {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Score breakdown */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Score Breakdown</h4>
            </div>
            {showBreakdown ? (
              <div>
                <ScoreBar label="Price" value={winBreakdown.price} max={15} color="#6C63FF" />
                <ScoreBar label="Drawdown" value={winBreakdown.drawdown} max={20} color="#00D5FF" />
                <ScoreBar label="Profit Split" value={winBreakdown.split} max={15} color="#A855F7" />
                <ScoreBar label="Profit Target" value={winBreakdown.target} max={15} color="#00E7A7" />
                <ScoreBar label="Payout" value={winBreakdown.payout} max={10} color="#6C63FF" />
                <ScoreBar label="Restrictions" value={winBreakdown.restrictions} max={10} color="#00D5FF" />
                <ScoreBar label="Leverage" value={winBreakdown.leverage} max={5} color="#A855F7" />
                <ScoreBar label="Time" value={winBreakdown.time} max={5} color="#00E7A7" />
                <ScoreBar label="Scaling" value={winBreakdown.scaling} max={5} color="#6C63FF" />
              </div>
            ) : (
              <p className="text-sm text-[#8E9BB5] mb-4">
                See exactly how the {winScore}/100 score was calculated across all 9 weighted factors.
              </p>
            )}
            <button
              onClick={() => setShowBreakdown((v) => !v)}
              className="mt-2 w-full py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition"
            >
              {showBreakdown ? 'Hide Full Breakdown' : 'Show Full Breakdown'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VerdictCard;
