import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import firmsData from '../data/propfirms.json';
import { FirmsData, Selection } from '../types';
import { calculateScore } from '../utils/scoring';
import { getPrice, getSizeLabel } from '../utils/parse';
import AccountSelector from './AccountSelector';
import ComparisonTable from './ComparisonTable';
import VerdictCard from './VerdictCard';

const data = firmsData as FirmsData;

const ComparisonEngine = () => {
  const [left, setLeft] = useState<Selection>({
    firm: data.firms[0],
    account: data.firms[0].accounts[3], // Instant Funding Zero
    sizeIndex: 3, // 50K
  });
  const [right, setRight] = useState<Selection>({
    firm: data.firms[2], // FTM
    account: data.firms[2].accounts[0], // 1-Step Nitro
    sizeIndex: 4, // 100K
  });

  const swap = () => {
    setLeft(right);
    setRight(left);
  };

  const leftScore = calculateScore(left);
  const rightScore = calculateScore(right);

  return (
    <section id="compare" className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Comparison Engine</h2>
          <p className="text-[#8E9BB5]">Pick two accounts. We grade them instantly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0B1026] p-6 rounded-3xl border border-[#6C63FF]/20 shadow-2xl shadow-[#6C63FF]/5"
          >
            <AccountSelector firms={data.firms} selection={left} onChange={setLeft} accent="#6C63FF" />
            <div className="mt-2 pt-4 border-t border-white/5 flex items-end justify-between">
              <div>
                <div className="text-xs text-[#8E9BB5]">Entry</div>
                <div className="text-lg font-semibold">${getPrice(left)} <span className="text-xs text-[#8E9BB5]">/ {getSizeLabel(left)}</span></div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-[#6C63FF]">{leftScore}</div>
                <div className="text-xs text-[#8E9BB5]">Score / 100</div>
              </div>
            </div>
          </motion.div>

          {/* Swap */}
          <div className="flex md:flex-col items-center justify-center gap-3">
            <button
              onClick={swap}
              className="w-14 h-14 rounded-full bg-[#0B1026] border border-white/10 flex items-center justify-center text-[#A855F7] hover:border-[#A855F7] hover:rotate-180 transition-all duration-500"
              aria-label="Swap accounts"
            >
              <ArrowLeftRight size={20} />
            </button>
            <span className="text-xs text-[#8E9BB5] font-medium tracking-widest">VS</span>
          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0B1026] p-6 rounded-3xl border border-[#00D5FF]/20 shadow-2xl shadow-[#00D5FF]/5"
          >
            <AccountSelector firms={data.firms} selection={right} onChange={setRight} accent="#00D5FF" />
            <div className="mt-2 pt-4 border-t border-white/5 flex items-end justify-between">
              <div>
                <div className="text-xs text-[#8E9BB5]">Entry</div>
                <div className="text-lg font-semibold">${getPrice(right)} <span className="text-xs text-[#8E9BB5]">/ {getSizeLabel(right)}</span></div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-[#00D5FF]">{rightScore}</div>
                <div className="text-xs text-[#8E9BB5]">Score / 100</div>
              </div>
            </div>
          </motion.div>
        </div>

        <ComparisonTable left={left} right={right} />
        <VerdictCard left={left} right={right} />
      </div>
    </section>
  );
};

export default ComparisonEngine;
