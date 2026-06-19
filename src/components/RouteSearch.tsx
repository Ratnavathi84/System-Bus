import React, { useState } from 'react';
import { Search, MapPin, Map, Clock, ArrowRight, BusFront, Zap, ShieldCheck } from 'lucide-react';
import { Bus, BusRoute } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import TicketBookingModal from './TicketBookingModal';

interface RouteSearchProps {
  buses: Bus[];
  onBusSelect: (id: string | null) => void;
  selectedBusId: string | null;
}

const COMMON_STOPS = [
  'RTC Complex', 'Gajuwaka', 'NAD Kotha Road', 'Siripuram', 'Rushikonda', 'Bheemili', 'Kancharapalem'
];

export default function RouteSearch({ buses, onBusSelect, selectedBusId }: RouteSearchProps) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Bus[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleSearch = () => {
    if (!source || !destination) return;
    setIsSearching(true);
    // Simulate route calculation and finding matching buses
    setTimeout(() => {
      // For demo, just return some random buses
      setResults(buses.slice(0, 4));
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="space-y-4 p-4 bg-black/20 rounded-2xl border border-white/5 mx-2">
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-blue" size={16} />
          <input 
            type="text" 
            placeholder="From (e.g. RTC Complex)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-neon-blue transition-all"
            list="stops"
          />
        </div>
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={16} />
          <input 
            type="text" 
            placeholder="To (e.g. Gajuwaka)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-orange-400 transition-all"
            list="stops"
          />
        </div>
        <datalist id="stops">
          {COMMON_STOPS.map(s => <option key={s} value={s} />)}
        </datalist>

        <button 
          onClick={handleSearch}
          disabled={!source || !destination}
          className="w-full bg-neon-blue text-navy py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-electric-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? 'Finding Routes...' : 'Search Buses'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 mt-4 space-y-4 pb-10">
        <AnimatePresence>
          {results.length > 0 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h3 className="text-[10px] font-bold text-silver uppercase tracking-widest mb-4 px-2 flex justify-between">
                 <span>Available Buses ({results.length})</span>
                 <span className="text-neon-blue">AI Sorted</span>
               </h3>

               <div className="space-y-6 flex flex-col items-center">
                 {results.map((bus, idx) => {
                   const isSelected = selectedBusId === bus.id;
                   const fare = idx === 0 ? 'Low' : idx === 1 ? 'Medium' : idx === 2 ? 'Discounted' : 'High Comfort';
                   const badge = idx === 0 ? 'Fastest ETA' : idx === 1 ? 'Eco-Friendly' : idx === 2 ? 'Cheapest Fare' : '';
                   const stopsCount = Math.floor(Math.random() * 8) + 2;

                   return (
                     <motion.div
                       key={bus.id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.1 }}
                       onClick={() => onBusSelect(bus.id)}
                       className={`w-full p-5 rounded-2xl cursor-pointer transition-all border ${
                         isSelected 
                           ? 'bg-gradient-to-br from-neon-blue/10 to-electric-cyan/5 border-neon-blue shadow-[0_0_30px_rgba(0,191,255,0.15)] scale-[1.02]' 
                           : 'bg-white/5 border-white/10 hover:bg-white/10'
                       }`}
                     >
                       {badge && (
                         <div className="mb-3">
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                             idx === 0 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                             idx === 1 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                             'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                           }`}>
                             ✨ {badge}
                           </span>
                         </div>
                       )}

                       <div className="flex items-start justify-between mb-4">
                         <div className="flex items-center gap-3">
                           <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-display font-black text-lg text-white shadow-inner">
                             {bus.busNumber.slice(0, 3)}
                           </div>
                           <div>
                             <h4 className="text-sm font-bold text-white tracking-widest">{bus.busNumber}</h4>
                             <p className="text-[10px] text-silver uppercase tracking-widest flex items-center gap-1 mt-0.5">
                               <BusFront size={10} /> {bus.type}
                             </p>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className={`text-2xl font-display font-black leading-none ${bus.status === 'on-time' ? 'text-neon-blue' : 'text-orange-400'}`}>
                             {bus.eta}
                             <span className="text-xs text-silver ml-1 font-sans">min</span>
                           </p>
                           <p className="text-[9px] text-silver uppercase tracking-widest mt-1">{bus.status.replace('-', ' ')}</p>
                         </div>
                       </div>

                       <div className="grid grid-cols-3 gap-2 mb-4">
                         <div className="bg-black/30 p-2 rounded-lg text-center">
                           <p className="text-[8px] text-silver uppercase tracking-widest mb-1">Stops</p>
                           <p className="text-xs font-bold text-white">{stopsCount}</p>
                         </div>
                         <div className="bg-black/30 p-2 rounded-lg text-center">
                           <p className="text-[8px] text-silver uppercase tracking-widest mb-1">Speed</p>
                           <p className="text-xs font-bold text-white">{bus.speed} km/h</p>
                         </div>
                         <div className="bg-black/30 p-2 rounded-lg text-center">
                           <p className="text-[8px] text-silver uppercase tracking-widest mb-1">Fare</p>
                           <p className="text-xs font-bold text-white">{fare}</p>
                         </div>
                       </div>

                       <div className="flex items-center gap-2">
                         <button 
                           onClick={(e) => { e.stopPropagation(); onBusSelect(bus.id); }}
                           className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                         >
                           View Route
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); setShowBookingModal(true); }}
                           className="flex-1 bg-neon-blue hover:bg-electric-cyan text-navy py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                         >
                           Book Ticket
                         </button>
                       </div>
                     </motion.div>
                   );
                 })}
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TicketBookingModal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)}
        source={source}
        destination={destination}
      />
    </div>
  );
}
