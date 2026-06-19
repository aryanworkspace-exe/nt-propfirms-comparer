const Footer = () => (
  <footer id="about" className="border-t border-white/5 py-12 px-6 mt-10">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#A855F7] flex items-center justify-center font-bold text-sm">
              NT
            </div>
            <span className="text-lg font-bold">NT Propfirms</span>
          </div>
          <p className="text-sm text-[#8E9BB5]">
            Find the best prop firm account — not just the best prop firm. We compare real,
            verified account models side-by-side using a transparent 9-factor scoring engine.
          </p>
        </div>
        <div className="text-sm text-[#8E9BB5]">
          <h4 className="text-white font-semibold mb-3">Disclaimer</h4>
          <p className="max-w-xs">
            Data is researched from official firm sources and may change. Always verify rules
            and pricing on the firm's official website before purchasing. Not financial advice.
          </p>
        </div>
      </div>
      <div className="border-t border-white/5 pt-6 text-xs text-[#8E9BB5] text-center">
        © {new Date().getFullYear()} NT Propfirms Comparer. All data for informational purposes only.
      </div>
    </div>
  </footer>
);

export default Footer;
