interface Props {
  page: 'home' | 'library';
  setPage: (p: 'home' | 'library') => void;
}

const Navbar = ({ page, setPage }: Props) => (
  <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#05081A]/70 border-b border-white/5">
    <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
      <button onClick={() => setPage('home')} className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#A855F7] flex items-center justify-center font-bold text-sm">
          NT
        </div>
        <span className="text-lg font-bold tracking-tight">NT Propfirms</span>
      </button>
      <div className="flex gap-1 md:gap-2 text-sm">
        <button
          onClick={() => setPage('home')}
          className={`px-4 py-2 rounded-lg transition ${page === 'home' ? 'text-white bg-white/5' : 'text-[#8E9BB5] hover:text-white'}`}
        >
          Compare
        </button>
        <button
          onClick={() => setPage('library')}
          className={`px-4 py-2 rounded-lg transition ${page === 'library' ? 'text-white bg-white/5' : 'text-[#8E9BB5] hover:text-white'}`}
        >
          Prop Firms
        </button>
        <a href="#about" className="px-4 py-2 rounded-lg text-[#8E9BB5] hover:text-white transition">
          About
        </a>
      </div>
    </div>
  </nav>
);

export default Navbar;
