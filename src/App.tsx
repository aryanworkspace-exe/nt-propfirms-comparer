import { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ComparisonEngine from './components/ComparisonEngine';
import FirmLibrary from './components/FirmLibrary';
import Footer from './components/Footer';

function App() {
  const [page, setPage] = useState<'home' | 'library'>('home');
  const compareRef = useRef<HTMLDivElement>(null);

  const goCompare = () => {
    setPage('home');
    setTimeout(() => {
      compareRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#05081A] text-white">
      <Navbar page={page} setPage={setPage} />
      {page === 'home' ? (
        <>
          <Hero onCompare={goCompare} />
          <div ref={compareRef}>
            <ComparisonEngine />
          </div>
        </>
      ) : (
        <FirmLibrary onCompare={goCompare} />
      )}
      <Footer />
    </div>
  );
}

export default App;
