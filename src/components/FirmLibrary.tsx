import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import firmsData from '../data/propfirms.json';
import { FirmsData } from '../types';

const data = firmsData as FirmsData;

const ACCENTS = ['#6C63FF', '#00D5FF', '#A855F7', '#00E7A7'];

interface Props {
  onCompare: () => void;
}

const allTypes = ['All', '1-Step', '2-Step', 'Instant'];

const FirmLibrary = ({ onCompare }: Props) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');

  const filtered = useMemo(() => {
    return data.firms
      .map((firm) => {
        const accounts = firm.accounts.filter(
          (a) => type === 'All' || a.type === type
        );
        return { ...firm, accounts };
      })
      .filter((firm) => {
        if (firm.accounts.length === 0) return false;
        if (!query) return true;
        return (
          firm.name.toLowerCase().includes(query.toLowerCase()) ||
          firm.description.toLowerCase().includes(query.toLowerCase())
        );
      });
  }, [query, type]);

  return (
    <section className="py-16 md:py-24 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-3">Prop Firm Library</h2>
          <p className="text-[#8E9BB5]">Every firm, every account model, real verified rules.</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E9BB5]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search firms..."
              className="w-full bg-[#0B1026] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#6C63FF] transition"
            />
          </div>
          <div className="flex gap-2">
            {allTypes.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-3 rounded-xl text-sm whitespace-nowrap transition ${
                  type === t
                    ? 'bg-[#6C63FF] text-white'
                    : 'bg-[#0B1026] text-[#8E9BB5] border border-white/10 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((firm, idx) => {
            const accent = ACCENTS[idx % ACCENTS.length];
            const minPrice = Math.min(
              ...firm.accounts.flatMap((a) => a.sizes.map((s) => s.price))
            );
            return (
              <motion.div
                key={firm.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 3) * 0.05 }}
                className="bg-[#0B1026] rounded-3xl border border-white/5 p-6 hover:border-white/20 transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}
                  >
                    {firm.logo}
                  </div>
                  <span className="text-xs text-[#8E9BB5] bg-white/5 px-2 py-1 rounded-md">
                    ⭐ {firm.trustpilot}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-1">{firm.name}</h3>
                <p className="text-sm text-[#8E9BB5] mb-4 line-clamp-2">{firm.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {firm.accounts.map((a) => (
                    <span
                      key={a.id}
                      className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-[#8E9BB5]"
                    >
                      {a.name}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm border-t border-white/5 pt-4">
                  <div>
                    <div className="text-xs text-[#8E9BB5]">From</div>
                    <div className="font-semibold" style={{ color: accent }}>${minPrice}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#8E9BB5]">Founded</div>
                    <div className="font-semibold text-white">{firm.founded}</div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-[#8E9BB5]">
                  {firm.platforms.slice(0, 3).join(' · ')}
                </div>

                <button
                  onClick={onCompare}
                  className="mt-5 w-full py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white hover:bg-white/5 transition"
                >
                  Open Comparison →
                </button>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-[#8E9BB5] py-20">No firms match your search.</div>
        )}
      </div>
    </section>
  );
};

export default FirmLibrary;
