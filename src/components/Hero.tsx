import { motion } from 'framer-motion';

interface Props {
  onCompare: () => void;
}

const Hero = ({ onCompare }: Props) => (
  <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20 px-4">
    {/* Glows */}
    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6C63FF] rounded-full blur-[160px] opacity-20 -z-0" />
    <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[#00D5FF] rounded-full blur-[160px] opacity-10 -z-0" />

    <div className="relative max-w-4xl mx-auto text-center">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block text-xs uppercase tracking-[0.3em] text-[#A855F7] mb-6 px-4 py-2 rounded-full border border-[#A855F7]/20 bg-[#A855F7]/5"
      >
        Account vs Account · Not Firm vs Firm
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
      >
        Compare Prop Firm Accounts{' '}
        <span className="bg-gradient-to-r from-[#6C63FF] via-[#A855F7] to-[#00D5FF] bg-clip-text text-transparent">
          Head-to-Head
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-[#8E9BB5] mb-10 max-w-xl mx-auto"
      >
        Research real accounts. Compare rules. Choose smarter.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onCompare}
        className="bg-[#6C63FF] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#5a52d9] transition shadow-lg shadow-[#6C63FF]/30 hover:shadow-[#6C63FF]/50"
      >
        Start Comparing →
      </motion.button>

      <div className="flex justify-center gap-8 md:gap-12 mt-14 text-center">
        <div>
          <div className="text-2xl md:text-3xl font-bold text-white">11</div>
          <div className="text-xs text-[#8E9BB5] mt-1">Prop Firms</div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-white">40+</div>
          <div className="text-xs text-[#8E9BB5] mt-1">Account Models</div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-white">9</div>
          <div className="text-xs text-[#8E9BB5] mt-1">Scoring Factors</div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
