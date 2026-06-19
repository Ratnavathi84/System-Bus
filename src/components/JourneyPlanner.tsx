import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, ChevronRight, BusFront, MoreVertical } from 'lucide-react';
import { Journey } from '../types';
import TicketBookingModal from './TicketBookingModal';

interface JourneyPlannerProps {
  busId: string;
  onClose: () => void;
}

export default function JourneyPlanner({ busId, onClose }: JourneyPlannerProps) {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const response = await fetch(`/api/journey/${busId}`);
        const data = await response.json();
        setJourney(data);
      } catch (err) {
        console.error('Journey error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, [busId]);

  return (
    <motion.div
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      className="absolute top-0 right-0 w-80 h-full glass border-l border-white/10 flex flex-col z-40 bg-navy/95"
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BusFront className="text-neon-blue" size={20} />
          <div>
            <h3 className="font-display font-bold text-lg">Journey Details</h3>
            <p className="text-[10px] text-silver uppercase tracking-widest">{journey?.busNumber || 'Tracking'}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-silver hover:text-white">&times;</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-silver">Calculating ETAs...</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/10" />
            
            <div className="space-y-8">
              {journey?.stops.map((stop, index) => (
                <div key={stop.stopId} className="relative pl-8">
                  <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-navy ${
                    index === 0 ? 'border-neon-blue' : index === (journey.stops.length - 1) ? 'border-red-500' : 'border-white/20'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                       index === 0 ? 'bg-neon-blue animate-pulse' : index === (journey.stops.length - 1) ? 'bg-red-500' : 'bg-white/20'
                    }`} />
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`text-sm font-bold ${index === 0 ? 'text-neon-blue' : 'text-white'}`}>
                        {stop.name}
                      </h4>
                      <p className="text-[10px] text-silver">
                        {stop.distance > 0 ? `${stop.distance} km from start` : 'Origin'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-electric-cyan font-display font-bold text-xs">
                        <Clock size={10} />
                        {stop.eta} m
                      </div>
                      <p className="text-[8px] text-silver uppercase tracking-tighter">Predicted Arrival</p>
                    </div>
                  </div>

                  {index < journey.stops.length - 1 && (
                    <div className="mt-4 flex items-center gap-2 opacity-20">
                       <MoreVertical size={14} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-black/20 border-t border-white/10 flex flex-col gap-3">
        <button 
          onClick={() => setShowBookingModal(true)}
          className="w-full bg-neon-blue text-navy py-3 rounded-xl text-xs font-bold font-display uppercase tracking-widest hover:bg-electric-cyan transition-all shadow-[0_0_15px_rgba(0,191,255,0.4)]"
        >
          Book Smart Ticket
        </button>
        <button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
          <MapPin size={14} className="text-neon-blue" /> Share My Live Journey
        </button>
      </div>

      <TicketBookingModal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)}
        busNumber={journey?.busNumber}
        source={journey?.stops[0]?.name}
        destination={journey?.stops[journey.stops.length - 1]?.name}
      />
    </motion.div>
  );
}
