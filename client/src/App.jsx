// client/src/App.jsx
import React, { useState } from 'react';
import WeatherModule from './components/WeatherModule';
import CurrencyConverter from './components/CurrencyConverter';
import QuoteGenerator from './components/QuoteGenerator';
import './index.css'; // make sure index.css is imported

export default function App() {
  const [tab, setTab] = useState('weather');

  // background images (Unsplash)
  const bg = {
    weather: "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=1600&auto=format&fit=crop')",
    currency: "url('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1600&auto=format&fit=crop')",
    quote: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600&auto=format&fit=crop')"
  };

  const containerStyle = {
    backgroundImage: `${bg[tab]}`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    // background container (full screen)
    <div style={containerStyle} className="min-h-screen flex items-center justify-center py-10 bg-fade">

      {/* overlay to dim image for readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none overlay-fade"></div>


      <div className="relative z-10 w-full max-w-xl p-6">
        <div className="bg-white/90 dark:bg-slate-900/80 rounded-2xl shadow-lg p-6">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-700">InfoHub — Abdul Basith Shaik</h1>
              <p className="text-sm text-gray-600">Weather • Currency • Quotes</p>
            </div>
          </header>
        <nav className="flex justify-center gap-4 mb-6">
  {[
    { id: 'weather', label: '☁️ Weather', color: 'from-sky-400 to-blue-600' },
    { id: 'currency', label: '💸 Currency', color: 'from-green-400 to-emerald-600' },
    { id: 'quote', label: '⚔️ Quote', color: 'from-rose-400 to-red-600' }
  ].map(({ id, label, color }) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      className={`
        px-4 py-2 rounded-lg text-white font-semibold
        bg-gradient-to-r ${color}
        shadow-md transition-all duration-300
        hover:scale-110 hover:shadow-lg hover:brightness-110
        focus:outline-none
        ${tab === id ? 'ring-2 ring-white scale-105' : 'opacity-90'}
      `}
    >
      {label}
    </button>
  ))}
</nav>

          

          <main className="p-4 bg-white/80 rounded-xl shadow-inner fade-content">
            {tab === 'weather' && <WeatherModule />}
            {tab === 'currency' && <CurrencyConverter />}
            {tab === 'quote' && <QuoteGenerator />}
          </main>
        </div>

        <footer className="text-center text-xs text-gray-600 mt-6">Built by Abdul Basith Shaik • {new Date().getFullYear()}</footer>
      </div>
    </div>
  );
}
