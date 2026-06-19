import React, { useState } from 'react';
import { Search, Map as MapIcon, ShieldAlert, Navigation, Settings, Star, Ticket, Clock, Trash2, BusFront, LayoutGrid, Zap, BarChart3, AlertTriangle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Bus, BusRoute } from '../types';
import { VIZAG_ROUTES } from '../lib/mockData';
import TicketBookingModal from './TicketBookingModal';
import RouteSearch from './RouteSearch';

interface SidebarProps {
  buses: Bus[];
  onBusSelect: (id: string | null) => void;
  selectedBusId: string | null;
}

export default function Sidebar({ buses, onBusSelect, selectedBusId }: SidebarProps) {
  const [view, setView] = React.useState<'live' | 'admin'>('live');
  const [tab, setTab] = React.useState<'nearby' | 'route' | 'favs' | 'tickets'>('nearby');
  const [mode, setMode] = React.useState<'free' | 'standard' | 'advanced' | 'control'>('standard');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [history, setHistory] = React.useState<any[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const toggleFavorite = (bus: Bus) => {
    const existing = favorites.find(f => f.busId === bus.id);
    if (existing) {
      setFavorites(favorites.filter(f => f.busId !== bus.id));
    } else {
      const newFav = {
        id: Math.random().toString(36).substr(2, 9),
        busId: bus.id,
        busNumber: bus.busNumber,
        routeId: bus.routeId,
        createdAt: new Date()
      };
      setFavorites([...favorites, newFav]);
      setHistory([{ busNumber: bus.busNumber, type: 'Viewed Bus', createdAt: new Date() }, ...history]);
    }
  };

  const filteredBuses = buses.filter(bus => {
    const route = VIZAG_ROUTES.find(r => r.id === bus.routeId);
    const searchLower = searchQuery.toLowerCase();
    return (
      bus.busNumber.toLowerCase().includes(searchLower) ||
      route?.name.toLowerCase().includes(searchLower) ||
      route?.number.toLowerCase().includes(searchLower)
    );
  });

  const fleetStats = {
    total: buses.length,
    active: buses.filter(b => b.status === 'on-time' || b.status === 'approaching').length,
    delayed: buses.filter(b => b.status === 'delayed' || b.status === 'heavy-delay').length,
    electric: buses.filter(b => b.type === 'Electric').length,
  };

  return (
    <div className="w-[360px] h-full bg-navy border-r border-white/10 flex flex-col z-20 shadow-2xl relative">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-neon-blue rounded-xl flex items-center justify-center shadow-lg neon-glow">
            <BusFront size={24} className="text-navy" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-white tracking-tight">SmartTransit</h1>
            <p className="text-[10px] text-silver uppercase tracking-widest font-medium border border-neon-blue bg-neon-blue/10 px-2 py-0.5 mt-1 rounded inline-block text-neon-blue">
              Fleet Commander
            </p>
          </div>
        </div>

        <div className="flex bg-black/20 rounded-2xl p-1 mb-4 border border-white/5">
          <button 
            onClick={() => setView('live')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${view === 'live' ? 'bg-white/10 text-white shadow-lg' : 'text-silver hover:text-white'}`}
          >
            <MapIcon size={14} /> Journey
          </button>
          <button 
            onClick={() => setView('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${view === 'admin' ? 'bg-electric-cyan text-navy shadow-lg' : 'text-silver hover:text-white'}`}
          >
            <ShieldAlert size={14} /> Fleet Admin
          </button>
        </div>
      </div>

      {view === 'live' ? (
        <>
          <div className="px-6 mb-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-silver group-focus-within:text-neon-blue transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search bus or route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-neon-blue transition-all"
              />
            </div>
          </div>

          <div className="flex px-4 gap-1 mb-4 overflow-x-auto scrollbar-hide py-1">
            <NavTab icon={<MapIcon size={16} />} label="Nearby" active={tab === 'nearby'} onClick={() => setTab('nearby')} />
            <NavTab icon={<Navigation size={16} />} label="Route" active={tab === 'route'} onClick={() => setTab('route')} />
            <NavTab icon={<Star size={16} />} label="Favs" active={tab === 'favs'} onClick={() => setTab('favs')} />
            <NavTab icon={<Ticket size={16} />} label="Wallet" active={tab === 'tickets'} onClick={() => setTab('tickets')} />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide pb-2">
            {tab === 'nearby' && (
              <div className="px-4 space-y-4 pb-4">
                <div className="flex items-center justify-between px-2 mb-2">
                  <h3 className="text-[10px] font-bold text-silver uppercase tracking-widest">Available Fleet ({filteredBuses.length})</h3>
                  <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                </div>
                
                {filteredBuses.length > 0 ? filteredBuses.map(bus => {
                  const route = VIZAG_ROUTES.find(r => r.id === bus.routeId);
                  const isSelected = selectedBusId === bus.id;
                  const isFav = favorites.some(f => f.busId === bus.id);
                  
                  return (
                    <motion.div
                      key={bus.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => onBusSelect(bus.id)}
                      className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                        isSelected 
                          ? 'bg-gradient-to-br from-neon-blue/10 to-electric-cyan/5 border-neon-blue shadow-[0_0_20px_rgba(0,191,255,0.15)]' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl font-display font-black text-white">{bus.busNumber}</h4>
                          <p className="text-xs text-silver mt-1">{route?.name || 'In Transit'}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xl font-display font-black leading-none ${bus.status === 'on-time' ? 'text-neon-blue' : bus.status === 'delayed' ? 'text-orange-400' : 'text-red-400'}`}>
                            {bus.eta}
                          </span>
                          <span className="text-[10px] text-silver ml-1 font-bold">min</span>
                          <p className="text-[9px] text-silver uppercase tracking-widest mt-1">{bus.status.replace('-', ' ')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 p-2 bg-black/20 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-electric-cyan font-bold flex items-center gap-1">
                             <Zap size={10} /> {bus.speed} km/h
                          </span>
                          <span className="w-1 h-1 bg-white/20 rounded-full" />
                          <span className="text-[10px] text-white font-bold uppercase tracking-widest">{bus.type.split(' ')[0]}</span>
                        </div>
                        <button 
                           onClick={(e) => { e.stopPropagation(); toggleFavorite(bus); }}
                           className={`p-1.5 rounded-lg transition-all ${isFav ? 'text-yellow-400 bg-yellow-400/10' : 'text-silver hover:text-white bg-white/5 hover:bg-white/20'}`}
                         >
                           <Star size={14} fill={isFav ? 'currentColor' : 'none'} />
                         </button>
                      </div>
                    </motion.div>
                  );
                }) : (
                  <div className="text-center py-12">
                     <p className="text-xs text-silver font-bold uppercase tracking-widest">No buses found</p>
                  </div>
                )}
              </div>
            )}

            {tab === 'route' && (
              <RouteSearch buses={buses} onBusSelect={onBusSelect} selectedBusId={selectedBusId} />
            )}

            {tab === 'favs' && (
              <div className="px-4 space-y-4">
                 <h3 className="text-[10px] font-bold text-silver uppercase tracking-widest px-2">Saved Fleets</h3>
                 <AnimatePresence>
                   {favorites.length > 0 ? favorites.map(fav => (
                     <motion.div 
                       key={fav.id}
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       onClick={() => onBusSelect(fav.busId)} 
                       className="p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all flex items-center justify-between group"
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                              <Star size={18} fill="currentColor" />
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-white uppercase tracking-widest">{fav.busNumber}</h4>
                              <p className="text-[10px] text-silver mt-1">Route ID: {fav.routeId}</p>
                           </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFavorites(favorites.filter(f => f.id !== fav.id)); }}
                          className="text-red-400/50 hover:text-red-400 p-2 bg-red-400/5 hover:bg-red-400/20 rounded-xl transition-all"
                        >
                           <Trash2 size={16} />
                        </button>
                     </motion.div>
                   )) : (
                     <div className="text-center py-12 opacity-50">
                        <Star size={32} className="mx-auto mb-4" />
                        <p className="text-[10px] uppercase font-bold tracking-widest">Favorites list empty</p>
                     </div>
                   )}
                 </AnimatePresence>
              </div>
            )}

            {tab === 'tickets' && (
              <div className="px-4 space-y-6">
                 <div className="p-6 bg-gradient-to-br from-neon-blue to-electric-cyan rounded-3xl text-navy relative overflow-hidden shadow-xl shadow-neon-blue/10 border border-white/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-xl" />
                    <div className="relative z-10">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-70">Transit Wallet Balance</p>
                       <h2 className="text-4xl font-display font-black mb-1">₹742.50</h2>
                    </div>
                    <Ticket className="absolute bottom-4 right-4 text-navy/10" size={64} />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <button className="bg-white/5 border border-white/10 hover:bg-white/10 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest">Add Cash</button>
                    <button onClick={() => setShowBookingModal(true)} className="bg-neon-blue text-navy py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(0,191,255,0.4)] hover:bg-electric-cyan cursor-pointer">Book Trip</button>
                 </div>

                 <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-bold text-silver uppercase tracking-widest px-2">Recent Journeys</h4>
                    {history.length > 0 ? history.slice(0, 5).map((trip, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                         <div>
                            <p className="text-sm font-bold text-white tracking-widest">{trip.busNumber}</p>
                            <p className="text-[9px] text-silver uppercase tracking-widest mt-1">
                               {trip.createdAt instanceof Date ? trip.createdAt.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </p>
                         </div>
                         <span className="text-[10px] font-black text-neon-blue uppercase tracking-widest bg-neon-blue/10 px-2 py-1 rounded-md">{trip.type}</span>
                      </div>
                    )) : (
                      <div className="p-8 text-center opacity-40">
                         <Clock size={24} className="mx-auto mb-3 text-silver" />
                         <p className="text-[10px] uppercase font-bold tracking-widest text-silver">No recent activity</p>
                      </div>
                    )}
                 </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
           {/* Admin Modes Selector */}
           <div className="px-6 pb-4 border-b border-white/10">
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
                 <button onClick={() => setMode('free')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'free' ? 'bg-white/20 text-white shadow-lg' : 'text-silver hover:text-white'}`}>Free</button>
                 <button onClick={() => setMode('standard')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'standard' ? 'bg-neon-blue text-navy shadow-[0_0_10px_rgba(0,191,255,0.4)]' : 'text-silver hover:text-white'}`}>Std</button>
                 <button onClick={() => setMode('advanced')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'advanced' ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'text-silver hover:text-white'}`}>Adv</button>
                 <button onClick={() => setMode('control')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'control' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'text-silver hover:text-white'}`}>Ctrl</button>
              </div>
           </div>

           {/* Mode Headers */}
           <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                 {mode === 'free' && <LayoutGrid size={16} className="text-silver" />}
                 {mode === 'standard' && <Zap size={16} className="text-neon-blue" />}
                 {mode === 'advanced' && <BarChart3 size={16} className="text-purple-400" />}
                 {mode === 'control' && <ShieldAlert size={16} className="text-red-500" />}
                 <h2 className="text-xs font-bold uppercase tracking-widest text-white">
                    {mode} UI Mode
                 </h2>
              </div>
           </div>

           {/* Search in Admin (Fixed) */}
           <div className="px-6 py-4 border-b border-white/5">
             <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-silver" size={16} />
               <input 
                 type="text" 
                 placeholder="Search bus number or route..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-neon-blue transition-all"
               />
             </div>
           </div>

           {/* Admin List - Adapted per mode */}
           <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-20">
              {filteredBuses.map(bus => {
                const route = VIZAG_ROUTES.find(r => r.id === bus.routeId);
                const isSelected = selectedBusId === bus.id;
                
                // FREE MODE: Extremely Simple
                if (mode === 'free') {
                   return (
                     <motion.div key={bus.id} onClick={() => onBusSelect(bus.id)} className={`p-6 rounded-3xl cursor-pointer transition-all border ${isSelected ? 'bg-white/10 border-white/30' : 'bg-transparent border-white/10 hover:border-white/20'}`}>
                        <div className="flex items-center justify-between">
                           <div>
                              <h3 className="text-2xl font-bold font-display text-white">{bus.busNumber}</h3>
                              <p className="text-[10px] text-silver uppercase tracking-widest mt-1">{route?.name}</p>
                           </div>
                           <div className="text-right">
                              <p className={`text-xl font-bold font-display ${bus.status === 'on-time' ? 'text-green-400' : 'text-orange-400'}`}>{bus.eta} min</p>
                              <p className="text-[9px] uppercase tracking-widest text-silver mt-1">{bus.status.replace('-', ' ')}</p>
                           </div>
                        </div>
                     </motion.div>
                   );
                }

                // STANDARD MODE: Balanced
                if (mode === 'standard') {
                   return (
                     <div key={bus.id} onClick={() => onBusSelect(bus.id)} className={`p-5 rounded-2xl cursor-pointer transition-all border shadow-lg ${isSelected ? 'bg-neon-blue/10 border-neon-blue/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-xl font-bold font-display text-white">{bus.busNumber}</h3>
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${bus.status === 'on-time' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                             {bus.status.replace('-', ' ')}
                           </span>
                        </div>
                        <p className="text-[10px] text-silver uppercase tracking-widest mb-4 line-clamp-1 border-b border-white/10 pb-4">{route?.name}</p>
                        <div className="flex items-center justify-between">
                           <div className="flex gap-4">
                              <div>
                                 <p className="text-[8px] text-silver uppercase tracking-widest mb-1">Speed</p>
                                 <p className="text-xs font-bold text-white">{bus.speed} km/h</p>
                              </div>
                              <div>
                                 <p className="text-[8px] text-silver uppercase tracking-widest mb-1">Type</p>
                                 <p className="text-xs font-bold text-neon-blue">{bus.type.split(' ')[0]}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[8px] text-silver uppercase tracking-widest mb-1">ETA</p>
                              <p className="text-lg font-bold font-display text-white">{bus.eta} <span className="text-[10px] font-sans text-silver">min</span></p>
                           </div>
                        </div>
                     </div>
                   );
                }

                // ADVANCED MODE: Rich Data
                if (mode === 'advanced') {
                   return (
                     <div key={bus.id} onClick={() => onBusSelect(bus.id)} className={`p-5 rounded-2xl cursor-pointer transition-all border bg-[#0d1627] ${isSelected ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-white/10 hover:border-white/20'}`}>
                        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center font-bold border border-purple-500/30">
                                 {bus.busNumber.slice(0, 3)}
                              </div>
                              <div>
                                 <h3 className="text-base font-bold text-white tracking-widest">{bus.busNumber}</h3>
                                 <p className="text-[9px] text-silver uppercase tracking-widest">{route?.name}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] text-silver uppercase tracking-widest flex items-center gap-1"><MapPin size={10} className="text-purple-400"/> {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                           <div className="bg-black/30 p-2 rounded-lg text-center">
                              <p className="text-[8px] text-silver uppercase tracking-widest mb-1">Speed</p>
                              <p className="text-xs font-bold text-white">{bus.speed}</p>
                           </div>
                           <div className="bg-black/30 p-2 rounded-lg text-center">
                              <p className="text-[8px] text-silver uppercase tracking-widest mb-1">Passngrs</p>
                              <p className={`text-xs font-bold ${bus.occupancy === 'High' ? 'text-red-400' : 'text-white'}`}>{bus.occupancy}</p>
                           </div>
                           <div className="bg-black/30 p-2 rounded-lg text-center">
                              <p className="text-[8px] text-silver uppercase tracking-widest mb-1">Driver ID</p>
                              <p className="text-xs font-bold text-silver">DRV-{(bus.id.charCodeAt(0)*7).toString()}</p>
                           </div>
                           <div className="bg-black/30 p-2 rounded-lg text-center border border-purple-500/20">
                              <p className="text-[8px] text-purple-300 uppercase tracking-widest mb-1">ETA</p>
                              <p className="text-xs font-bold text-purple-400">{bus.eta}m</p>
                           </div>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                           <div className={`h-full ${bus.status === 'on-time' ? 'bg-purple-500' : 'bg-red-500'} w-2/3 rounded-full`} />
                        </div>
                     </div>
                   );
                }

                // CONTROL MODE: Red/Admin focus
                return (
                  <div key={bus.id} onClick={() => onBusSelect(bus.id)} className={`p-4 rounded-xl cursor-pointer transition-all border ${isSelected ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-black/40 border-white/10 hover:border-white/20'}`}>
                     <div className="flex items-start justify-between">
                        <div>
                           <div className="flex items-center gap-2 mb-2">
                              <ShieldAlert size={14} className={bus.status === 'delayed' ? 'text-red-500 animate-pulse' : 'text-green-500'} />
                              <h3 className="text-sm font-black font-mono text-white tracking-widest">{bus.busNumber}</h3>
                           </div>
                           <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold">
                              <span className={bus.status === 'on-time' ? 'text-green-400' : 'text-red-400'}>
                                 {bus.status === 'on-time' ? '✓ CLEAR' : '⚠ DELAY RIsk'}
                              </span>
                              <span className="text-silver border-l border-white/20 pl-2">UNIT: {bus.id.slice(0,4).toUpperCase()}</span>
                           </div>
                        </div>
                        <button className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                           Halt Unit
                        </button>
                     </div>
                  </div>
                );
              })}
           </div>
        </div>
      )}

      <TicketBookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </div>
  );
}

function NavTab({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`min-w-[70px] flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all font-bold uppercase tracking-widest text-[9px] border ${
        active ? 'bg-white text-navy border-white shadow-lg' : 'bg-white/5 text-silver border-transparent hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon} {label}
    </button>
  );
}

