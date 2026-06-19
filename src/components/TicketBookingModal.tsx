import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, BusFront, Calendar, Clock, ArrowRight, Tag, CheckCircle2, QrCode } from 'lucide-react';
import { BusRoute } from '../types';

interface TicketBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  busNumber?: string;
  source?: string;
  destination?: string;
}

const PASSENGER_TYPES = [
  { id: 'regular', name: 'Regular', discount: 0 },
  { id: 'student', name: 'Student', discount: 0.2 },
  { id: 'senior', name: 'Senior Citizen', discount: 0.3 },
  { id: 'frequent', name: 'Frequent Traveler', discount: 0.15 },
];

export default function TicketBookingModal({ isOpen, onClose, busNumber = '', source = '', destination = '' }: TicketBookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    source: source,
    destination: destination,
    busNumber: busNumber,
    date: new Date().toISOString().split('T')[0],
    passengerType: 'regular',
    name: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Pseudo-calculations
  const baseFare = 50; 
  const passengerType = PASSENGER_TYPES.find(p => p.id === formData.passengerType);
  
  // Smart pricing rules: Night travel (20:00 - 05:00) gets 10% discount, EV gets 10% discount
  const evDiscount = formData.busNumber.includes('EV') ? 0.1 : 0;
  
  const discountMultiplier = passengerType ? passengerType.discount : 0;
  const totalDiscountPercent = discountMultiplier + evDiscount;
  const discountAmount = Math.floor(baseFare * totalDiscountPercent);
  const finalFare = baseFare - discountAmount;

  if (!isOpen) return null;

  const handleBook = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3); // Success/QR step
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-navy glass border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <BusFront className="text-neon-blue" />
            Smart Booking
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-silver hover:text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-silver font-bold mb-2 flex items-center gap-2"><MapPin size={12}/> Passenger Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-neon-blue focus:outline-none text-sm"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs uppercase tracking-widest text-silver font-bold mb-2 flex items-center gap-2"><MapPin size={12}/> From</label>
                    <input 
                      type="text" 
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                      placeholder="Origin"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-neon-blue focus:outline-none text-sm"
                    />
                  </div>
                  <div className="flex items-end justify-center pb-3">
                    <ArrowRight size={20} className="text-white/20" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs uppercase tracking-widest text-silver font-bold mb-2 flex items-center gap-2"><MapPin size={12}/> To</label>
                    <input 
                      type="text" 
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      placeholder="Destination"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-neon-blue focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs uppercase tracking-widest text-silver font-bold mb-2 flex items-center gap-2"><BusFront size={12}/> Bus No.</label>
                    <input 
                      type="text" 
                      value={formData.busNumber}
                      onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
                      placeholder="e.g. 100K"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-neon-blue focus:outline-none text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs uppercase tracking-widest text-silver font-bold mb-2 flex items-center gap-2"><Calendar size={12}/> Date</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-[11px] focus:border-neon-blue focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-silver font-bold mb-2 flex items-center gap-2"><Tag size={12}/> Passenger Type</label>
                  <select 
                    value={formData.passengerType}
                    onChange={(e) => setFormData({...formData, passengerType: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:border-neon-blue focus:outline-none text-sm appearance-none"
                  >
                    {PASSENGER_TYPES.map(p => (
                      <option key={p.id} value={p.id} className="bg-navy">{p.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.source || !formData.destination || !formData.busNumber || !formData.name}
                  className="w-full py-4 mt-4 bg-neon-blue text-navy font-bold font-display rounded-xl hover:bg-electric-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                >
                  Continue to Fare Calculation
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-6">
                <h3 className="font-display font-medium text-lg mb-4 text-white">Smart Fare Breakdown</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center text-silver">
                    <span>Base Fare (Est. distance)</span>
                    <span className="font-mono">₹{baseFare.toFixed(2)}</span>
                  </div>
                  
                  {passengerType && passengerType.discount > 0 && (
                    <div className="flex justify-between items-center text-green-400">
                      <span>{passengerType.name} Discount ({(passengerType.discount * 100).toFixed(0)}%)</span>
                      <span className="font-mono">-₹{(baseFare * passengerType.discount).toFixed(2)}</span>
                    </div>
                  )}

                  {evDiscount > 0 && (
                    <div className="flex justify-between items-center text-green-400">
                      <span className="flex items-center gap-2">EV Green Routing (10%)</span>
                      <span className="font-mono">-₹{(baseFare * evDiscount).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="h-px bg-white/10 my-2" />
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Final Fare</span>
                    <span className="font-mono text-neon-blue">₹{finalFare.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-white/5 text-white font-bold font-display rounded-xl hover:bg-white/10 transition-colors uppercase tracking-widest text-xs"
                >
                  Back
                </button>
                <button 
                  onClick={handleBook}
                  disabled={isGenerating}
                  className="flex-[2] py-3 bg-neon-blue text-navy font-bold font-display rounded-xl hover:bg-electric-cyan transition-colors disabled:opacity-50 flex items-center justify-center uppercase tracking-widest text-xs"
                >
                  {isGenerating ? 'Processing...' : 'Pay & Book Ticket'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-green-400" />
              </div>
              <h3 className="font-display font-bold text-2xl text-white mb-1">Booking Confirmed</h3>
              <p className="text-silver text-sm mb-6 uppercase tracking-widest">Digital Ticket Generated</p>

              <div className="w-full bg-white text-navy rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-neon-blue" />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-navy/50">Passenger Name</span>
                    <p className="font-bold text-lg">{formData.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-navy/50">Bus No</span>
                    <p className="font-display font-black text-xl text-neon-blue">{formData.busNumber}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-navy/50">From</span>
                    <p className="font-bold">{formData.source}</p>
                  </div>
                  <ArrowRight size={16} className="text-navy/30" />
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-navy/50">To</span>
                    <p className="font-bold">{formData.destination}</p>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-navy/10 pt-4 mt-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-navy/50">Fare Paid</span>
                    <div className="flex items-baseline gap-2">
                      <p className="font-mono text-2xl font-black">₹{finalFare.toFixed(2)}</p>
                      {discountAmount > 0 && <span className="text-[10px] text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full">Save ₹{discountAmount.toFixed(2)}</span>}
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-black p-1 rounded-lg flex items-center justify-center">
                    <QrCode size={48} className="text-white" />
                  </div>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 mt-6 bg-white/10 text-white font-bold font-display rounded-xl hover:bg-white/20 transition-colors uppercase tracking-widest text-sm"
              >
                Close Dashboard
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
