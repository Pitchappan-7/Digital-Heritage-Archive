import React, { useState } from 'react';
import { MAP_LOCATIONS } from '../data/mockData';
import { Icon } from './Icon';

interface HeritageMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRecord?: (recId: string) => void;
}

export const HeritageMapModal: React.FC<HeritageMapModalProps> = ({ isOpen, onClose }) => {
  const [selectedSite, setSelectedSite] = useState(MAP_LOCATIONS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-5xl h-[85vh] bg-[#fff8f3] rounded-2xl shadow-2xl border border-[#dbc0c0] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f3ede7] border-b border-[#ede7e2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#540414] text-white flex items-center justify-center shadow-sm">
              <Icon name="map" size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#540414]">
                Interactive Geographic Heritage Map
              </h3>
              <p className="font-sans text-xs text-[#554242]">
                Geocoded cartographic archive linking Dr. Ambedkar's historical journeys and institutional centers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#554242] hover:bg-[#ede7e2] hover:text-[#1d1b18] transition-colors cursor-pointer"
          >
            <Icon name="close" size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Map Visual (Left 8 cols) */}
          <div className="lg:col-span-8 bg-[#ece1cc] relative overflow-hidden flex flex-col justify-between p-6">
            <div
              className="absolute inset-0 bg-cover bg-center filter contrast-105 opacity-90"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_TkurmzzyHGvuQXTLoN_cjom4p1uywZbBPpgyU7opjvUvIJgczoW2DJYUMRDf42_JPP94C5_ribLg5Ml-75eQPE1uicLLJczO1n6694loLC0VKW3t87jRYARWbZo7WUwfOZjNYQGZ965Y7Hjo36L9F9rnu6zlFhLaELqpUyx6iPYj-moh1L3dfk_wjsq6bgo74nrETPRkAnVFL302qMS5SnVQkBXdUY9g3FzrMHOTSjislbW4nEM')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none"></div>

            {/* Floating Top Chip */}
            <div className="relative z-10 self-start bg-white/95 px-3 py-1.5 rounded-full shadow-md text-xs font-mono flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
              <span className="font-semibold text-[#1d1b18]">42 Active Geocoded Heritage Sites</span>
            </div>

            {/* Selected Location Card (Bottom) */}
            <div className="relative z-10 self-start max-w-md bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#ede7e2]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-[#805610] uppercase tracking-wider font-bold">
                  {selectedSite.coords}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#bceecb] text-[#002e18] font-mono text-[10px] font-semibold">
                  {selectedSite.recordsCount} Records
                </span>
              </div>
              <h4 className="font-serif text-base font-semibold text-[#540414] mb-1">
                {selectedSite.name} ({selectedSite.city})
              </h4>
              <p className="font-sans text-xs text-[#554242] leading-relaxed">
                {selectedSite.desc}
              </p>
            </div>
          </div>

          {/* Locations List (Right 4 cols) */}
          <div className="lg:col-span-4 bg-[#fff8f3] border-l border-[#ede7e2] p-4 overflow-y-auto space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#805610] font-semibold">
              Key Historical Centers:
            </h4>
            <div className="space-y-2">
              {MAP_LOCATIONS.map((loc) => {
                const isSelected = selectedSite.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedSite(loc)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#721d28] text-white border-[#540414] shadow-md'
                        : 'bg-white hover:bg-[#f3ede7] text-[#1d1b18] border-[#ede7e2]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-serif text-sm font-semibold ${isSelected ? 'text-white' : 'text-[#540414]'}`}>
                        {loc.name}
                      </span>
                      <Icon name="location_on" size={18} />
                    </div>
                    <div className={`font-mono text-[11px] mb-1 ${isSelected ? 'text-[#ffddb3]' : 'text-[#805610]'}`}>
                      {loc.city} • {loc.coords}
                    </div>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isSelected ? 'text-white/80' : 'text-[#554242]'}`}>
                      {loc.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
