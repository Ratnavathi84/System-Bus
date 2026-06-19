import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TriangleAlert, Phone, ShieldAlert, X, HeartPulse, BusFront, Shield, Baby, AlertOctagon, MoreHorizontal, CheckCircle2 } from 'lucide-react';

const EMERGENCY_TYPES = [
  { id: 'medical', label: 'Medical Emergency', icon: HeartPulse, color: 'text-rose-500' },
  { id: 'accident', label: 'Accident / Collision', icon: TriangleAlert, color: 'text-orange-500' },
  { id: 'security', label: 'Security Threat', icon: ShieldAlert, color: 'text-red-500' },
  { id: 'unsafe', label: 'Feeling Unsafe', icon: Shield, color: 'text-purple-500' },
  { id: 'child', label: 'Lost Child', icon: Baby, color: 'text-blue-400' },
  { id: 'technical', label: 'Technical Issue', icon: AlertOctagon, color: 'text-yellow-500' },
  { id: 'other', label: 'Other', icon: MoreHorizontal, color: 'text-silver' }
];

export default function EmergencySOS() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'type' | 'tracking'>('type');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleActivate = (typeId: string) => {
    setSelectedType(typeId);
    setStep('tracking');
    // Simulate sending SOS to backend/drivers/control center
    console.log(`EMERGENCY TRIGGERED: ${typeId} at coordinates...`);
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel the emergency alert?")) {
      setIsOpen(false);
      setTimeout(() => {
        setStep('type');
        setSelectedType(null);
      }, 500);
    }
  };

  return (
    <>
      {/* Floating SOS Button */}
      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[150]">
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] group hover:scale-105 active:scale-95 transition-all overflow-hidden"
        >
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border border-white/40 animate-ping" />
          <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse" />
          
          <div className="relative flex flex-col items-center justify-center -mt-1">
            <TriangleAlert size={28} className="text-white mb-0.5 group-hover:-translate-y-1 transition-transform" />
            <span className="text-[10px] sm:text-xs font-black text-white leading-none uppercase tracking-widest">SOS</span>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-950/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-navy rounded-3xl shadow-2xl overflow-hidden border border-red-500/30 flex flex-col max-h-[90vh]"
            >
              {/* Emergency Header */}
              <div className="bg-red-600/20 px-6 py-4 border-b border-red-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse">
                     <ShieldAlert size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">Emergency SOS</h2>
                    <p className="text-xs text-red-300 font-medium">Immediate Response System</p>
                  </div>
                </div>
                {step === 'type' && (
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={24} className="text-red-200 hover:text-white" />
                  </button>
                )}
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                {step === 'type' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-center text-sm font-medium text-silver/80 mb-6">Select the type of emergency. Help will be dispatched immediately.</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {EMERGENCY_TYPES.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => handleActivate(type.id)}
                            className="flex flex-col items-center justify-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-500/30 rounded-2xl transition-all group"
                          >
                            <Icon size={32} className={`${type.color} group-hover:scale-110 transition-transform`} />
                            <span className="text-xs font-bold text-white text-center">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 'tracking' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
                    <div className="relative w-32 h-32 mb-8 mt-4">
                      <div className="absolute inset-0 border-4 border-red-500/30 rounded-full animate-ping" />
                      <div className="absolute inset-2 border-4 border-red-500/50 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                      <div className="absolute inset-4 bg-red-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.8)] neon-glow">
                        <TriangleAlert size={40} className="text-white mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Active</span>
                      </div>
                    </div>

                    <h3 className="font-display font-black text-2xl text-white mb-2 uppercase tracking-wide">Help Is On The Way</h3>
                    <p className="text-red-300 text-sm mb-8 font-medium">Your location and bus details have been shared with the Central Transit Authority and Emergency Services.</p>

                    <div className="w-full bg-black/40 rounded-2xl p-4 border border-white/10 mb-8 flex flex-col gap-3">
                       <div className="flex justify-between items-center bg-white/5 py-2 px-3 rounded-lg">
                          <span className="text-xs text-silver font-bold uppercase tracking-widest">Bus Number</span>
                          <span className="text-sm font-black text-neon-blue font-display">Tracking Active</span>
                       </div>
                       <div className="flex justify-between items-center bg-white/5 py-2 px-3 rounded-lg">
                          <span className="text-xs text-silver font-bold uppercase tracking-widest">Coordinates</span>
                          <span className="text-xs font-mono text-green-400 font-bold">17.6868° N, 83.2185° E</span>
                       </div>
                       <div className="flex justify-between items-center bg-white/5 py-2 px-3 rounded-lg border border-red-500/30">
                          <span className="text-xs text-silver font-bold uppercase tracking-widest">Status</span>
                          <span className="text-xs font-black text-red-500 uppercase flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Dispatching unit
                          </span>
                       </div>
                    </div>

                    <div className="flex gap-4 w-full">
                      <button className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors">
                        <Phone size={16} /> Call Driver
                      </button>
                      <button className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors">
                        <Shield size={16} /> Police (100)
                      </button>
                    </div>

                    <button 
                      onClick={handleCancel}
                      className="mt-6 text-xs text-silver hover:text-white uppercase tracking-widest font-bold underline underline-offset-4 opacity-50 hover:opacity-100 transition-opacity"
                    >
                      Cancel SOS Alert
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
