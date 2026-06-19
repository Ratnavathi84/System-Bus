import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BusMap from './components/BusMap';
import AIAssistant from './components/AIAssistant';
import JourneyPlanner from './components/JourneyPlanner';
import EmergencySOS from './components/EmergencySOS';
import { Bus } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Cloud, ChevronDown, BusFront, Map as MapIcon, Search } from 'lucide-react';

const CITIES = ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Rajahmundry', 'Kakinada'];

export default function App() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(CITIES[0]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch(`/api/buses?city=${city}`);
        const data = await response.json();
        setBuses(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    };

    fetchBuses();
    const interval = setInterval(fetchBuses, 5000); // Update every 5s
    return () => clearInterval(interval);
  }, [city]);

  if (!hasEntered) {
    return (
      <div className="relative h-screen w-screen bg-navy text-white font-sans overflow-hidden flex flex-col items-center justify-center">
        {/* Full-screen live bus tracking map background */}
        <div className="absolute inset-0 z-0 opacity-40 grayscale-[0.5]">
          <BusMap buses={buses} selectedBusId={null} onBusSelect={() => {}} />
        </div>
        
        {/* Futuristic Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-navy/60 via-transparent to-navy/80" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 text-center max-w-3xl px-6"
        >
          <div className="flex justify-center mb-8">
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: ['0 0 20px rgba(0,191,255,0.4)', '0 0 40px rgba(0,191,255,0.6)', '0 0 20px rgba(0,191,255,0.4)']
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 bg-neon-blue rounded-[2.5rem] flex items-center justify-center shadow-2xl"
            >
              <BusFront size={56} className="text-navy" />
            </motion.div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-display font-bold mb-12 tracking-tight">
            Welcome to <span className="text-neon-blue">Smart Bus</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => setHasEntered(true)}
              className="group relative bg-neon-blue hover:bg-electric-cyan text-navy px-10 py-5 rounded-2xl font-black font-display text-lg flex items-center gap-3 transition-all shadow-[0_0_50px_rgba(0,191,255,0.3)] hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <MapIcon size={24} /> Enter Live Dashboard
            </button>
            
            <div className="flex gap-4">
              <button
                onClick={() => setHasEntered(true)}
                className="glass px-8 py-5 rounded-2xl font-black font-display text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-white/20 transition-all border border-white/10"
              >
                <Search size={18} className="text-neon-blue" /> Search Bus
              </button>
              <button
                onClick={() => setHasEntered(true)}
                className="glass px-8 py-5 rounded-2xl font-black font-display text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-white/20 transition-all border border-white/10"
              >
                <MapIcon size={18} className="text-electric-cyan" /> View Live Map
              </button>
            </div>
          </div>
        </motion.div>

        <footer className="absolute bottom-10 left-0 right-0 text-center text-silver/30 text-[10px] uppercase tracking-[0.5em] font-bold">
          Universal Transit Authority &copy; 2026 | Smart City Infrastructure
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-navy text-white font-sans overflow-hidden">
      <Sidebar 
        buses={buses} 
        onBusSelect={(id) => {
          setSelectedBusId(id);
          setShowJourney(true);
        }} 
        selectedBusId={selectedBusId}
      />

      <main className="flex-1 relative">
        <BusMap 
          buses={buses} 
          selectedBusId={selectedBusId} 
          onBusSelect={(id) => {
            setSelectedBusId(id);
            if (id) setShowJourney(true);
          }}
        />

        {/* Global Toolbar Overlay */}
        <div className="absolute top-6 left-6 right-6 pointer-events-none flex justify-between items-start">
          <div className="flex items-start gap-4 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass px-4 py-2 rounded-2xl flex items-center gap-4 shadow-2xl border border-white/10"
            >
              <div className="relative">
                <button 
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="flex items-center gap-2 hover:text-neon-blue transition-colors text-sm font-bold font-display uppercase tracking-widest"
                >
                  <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
                  {city}
                  <ChevronDown size={14} className={`transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showCityDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 glass rounded-2xl overflow-hidden z-[100]"
                    >
                      {CITIES.map(c => (
                        <button
                          key={c}
                          onClick={() => {
                            setCity(c);
                            setShowCityDropdown(false);
                            setLoading(true);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-white/10 transition-colors ${city === c ? 'text-neon-blue' : 'text-white'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                 <Cloud size={16} className="text-neon-blue" />
                 <span className="text-xs font-bold font-display">28°C</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                 <Wind size={16} className="text-electric-cyan" />
                 <span className="text-xs font-bold font-display">12 km/h</span>
              </div>
            </motion.div>
          </div>

          <div className="pointer-events-auto flex items-center gap-3">
            <button 
              onClick={() => setHasEntered(false)}
              className="glass px-6 py-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
            >
               Return Home
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showJourney && selectedBusId && (
            <JourneyPlanner 
              busId={selectedBusId} 
              onClose={() => setShowJourney(false)} 
            />
          )}
        </AnimatePresence>
      </main>

      <AIAssistant />
      <EmergencySOS />

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy flex flex-col items-center justify-center"
          >
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
              <div className="absolute inset-0 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <BusFront size={32} className="text-neon-blue animate-pulse" />
              </div>
            </div>
            <h2 className="font-display font-bold text-2xl tracking-widest text-white mb-2">SMART TRANSIT SYSTEM</h2>
            <p className="text-xs text-silver uppercase tracking-[0.3em] font-medium">Synchronizing City Fleets</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
