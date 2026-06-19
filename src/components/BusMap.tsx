import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bus, BusStatus, LatLng } from '../types';
import { VIZAG_STOPS } from '../lib/mockData';
import { BusFront, User, Gauge, Users, Clock, Zap } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface BusMapProps {
  buses: Bus[];
  selectedBusId?: string | null;
  onBusSelect: (busId: string | null) => void;
}

const STATUS_COLORS: Record<BusStatus, string> = {
  'on-time': '#4ade80', // Green
  'approaching': '#facc15', // Yellow
  'delayed': '#fb923c', // Orange
  'heavy-delay': '#f87171', // Red
};

// Component to handle map centering and selection
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function BusMap({ buses, selectedBusId, onBusSelect }: BusMapProps) {
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  useEffect(() => {
    if (selectedBusId) {
      const bus = buses.find(b => b.id === selectedBusId);
      if (bus) setSelectedBus(bus);
    } else {
      setSelectedBus(null);
    }
  }, [selectedBusId, buses]);

  const mapCenter: [number, number] = selectedBus 
    ? [selectedBus.lat, selectedBus.lng] 
    : [17.72, 83.30];

  const createBusIcon = (bus: Bus, isSelected: boolean) => {
    const markerColor = bus.type === 'Electric' ? '#00FFFF' : STATUS_COLORS[bus.status];
    
    // Create HTML for custom marker
    const html = renderToStaticMarkup(
      <div className={`relative flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-125' : ''}`}>
        {/* Persistent Bus Number Label */}
        <div 
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-black text-white shadow-lg whitespace-nowrap"
          style={{ backgroundColor: markerColor }}
        >
          {bus.busNumber}
        </div>

        <div 
          className="p-1.5 rounded-full shadow-lg transition-colors border-2 border-white/20 flex items-center justify-center"
          style={{ 
            backgroundColor: isSelected ? '#ffffff' : markerColor,
            boxShadow: isSelected ? `0 0 20px ${markerColor}` : 'none'
          }}
        >
          {bus.type === 'Electric' ? (
            <Zap size={14} className={isSelected ? 'text-navy' : 'text-navy'} />
          ) : (
            <BusFront size={14} className={isSelected ? 'text-navy' : 'text-navy'} />
          )}
        </div>
        
        {/* Status indicator ring */}
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ backgroundColor: markerColor }}
        />
      </div>
    );

    return L.divIcon({
      html: html,
      className: 'custom-bus-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  const stopIcon = L.divIcon({
    html: renderToStaticMarkup(
      <div className="w-3 h-3 bg-white rounded-full border-2 border-neon-blue shadow-lg hover:scale-125 transition-transform" />
    ),
    className: 'custom-stop-icon',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

  return (
    <div className="w-full h-full relative bg-navy">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        {/* Dark Themed Tiles (CartoDB Dark Matter) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapController center={mapCenter} />

        {/* Render Bus Stops */}
        {VIZAG_STOPS.map(stop => (
          <Marker 
            key={stop.id} 
            position={[stop.lat, stop.lng]} 
            icon={stopIcon}
          >
            <Popup className="bus-popup">
              <div className="text-xs font-bold text-navy flex items-center gap-1">
                 <div className="w-2 h-2 bg-neon-blue rounded-full" />
                 {stop.name}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Selected Bus Route Visualization */}
        {selectedBus?.routePath && (
          <Polyline 
            positions={selectedBus.routePath.map(p => [p.lat, p.lng] as [number, number])}
            pathOptions={{
              color: selectedBus.type === 'Electric' ? '#00FFFF' : '#00BFFF',
              weight: 4,
              opacity: 0.8
            }}
          />
        )}

        {/* Render Buses */}
        {buses.map(bus => (
          <Marker 
            key={bus.id} 
            position={[bus.lat, bus.lng]} 
            icon={createBusIcon(bus, selectedBusId === bus.id)}
            eventHandlers={{
              click: () => onBusSelect(bus.id),
            }}
          >
            <Tooltip 
              direction="top" 
              offset={[0, -20]} 
              opacity={1} 
              className="custom-tooltip border-none bg-transparent shadow-none"
            >
              <div className="bg-navy border border-white/20 p-3 rounded-xl shadow-2xl text-white min-w-[160px] backdrop-blur-md">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <BusFront size={14} className="text-neon-blue" />
                    <span className="font-bold text-xs">{bus.busNumber}</span>
                  </div>
                  <StatusBadge status={bus.status} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                     <span className="flex items-center gap-1 text-silver"><Clock size={10}/> ETA</span>
                     <span className="font-bold text-neon-blue">{bus.eta} mins</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                     <span className="flex items-center gap-1 text-silver"><Users size={10}/> Occupancy</span>
                     <span className={`font-bold ${bus.occupancy === 'High' ? 'text-red-400' : bus.occupancy === 'Medium' ? 'text-orange-400' : 'text-green-400'}`}>
                       {bus.occupancy}
                     </span>
                  </div>
                </div>
              </div>
            </Tooltip>
            <Popup className="bus-popup" onClose={() => onBusSelect(null)}>
              <div className="p-2 text-navy min-w-[240px]">
                <div className="flex items-center justify-between mb-3 border-b border-navy/10 pb-2">
                  <div className="flex items-center gap-2">
                    <BusFront size={20} className="text-neon-blue" />
                    <div>
                      <h3 className="font-bold text-sm leading-none">{bus.busNumber}</h3>
                      <p className="text-[10px] text-navy/60 font-bold uppercase tracking-wider">{bus.type} BUS</p>
                    </div>
                  </div>
                  <StatusBadge status={bus.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <InfoItem icon={<User size={12} />} label="Driver" value={bus.driverName} />
                  <InfoItem icon={<Gauge size={12} />} label="Speed" value={`${bus.speed} km/h`} />
                  <InfoItem icon={<Users size={12} />} label="Occupancy" value={bus.occupancy} />
                  <InfoItem icon={<Clock size={12} />} label="Next Stop" value={bus.nextStopId} />
                </div>

                <div className="bg-navy/5 p-2 rounded-lg">
                   <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-navy/40 uppercase">ETA Prediction</span>
                      <span className="text-navy font-bold text-xs">{bus.eta} mins</span>
                   </div>
                   <div className="h-1 w-full bg-navy/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-neon-blue transition-all duration-1000" 
                        style={{ width: `${Math.max(100 - bus.eta * 10, 5)}%` }} 
                      />
                   </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Control Custom UI */}
      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
         <button 
           onClick={() => onBusSelect(null)}
           className="glass p-3 rounded-2xl text-white hover:text-neon-blue transition-colors shadow-2xl"
           title="Reset View"
         >
            <Zap size={20} />
         </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container {
          background: #081C3A !important;
        }
        .bus-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 1rem;
          padding: 0;
          overflow: hidden;
        }
        .bus-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .leaflet-popup-tip {
          background: white;
        }
        .custom-bus-icon {
          background: transparent !important;
          border: none !important;
        }
        .custom-stop-icon {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-tooltip.custom-tooltip {
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
        }
        .leaflet-tooltip-top.custom-tooltip::before {
          display: none;
        }
      `}} />
    </div>
  );
}

function StatusBadge({ status }: { status: BusStatus }) {
  const labels: Record<BusStatus, string> = {
    'on-time': 'On Time',
    'approaching': 'Arriving',
    'delayed': 'Delayed',
    'heavy-delay': 'Heavy Delay',
  };
  return (
    <span 
      className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase text-white" 
      style={{ backgroundColor: STATUS_COLORS[status] }}
    >
      {labels[status]}
    </span>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5 text-navy/50">
        {icon}
        <span className="text-[8px] font-bold uppercase tracking-tighter leading-none">{label}</span>
      </div>
      <p className="text-[10px] font-bold text-navy truncate leading-none">{value}</p>
    </div>
  );
}
