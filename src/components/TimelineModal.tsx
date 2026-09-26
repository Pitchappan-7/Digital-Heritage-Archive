import React, { useState } from 'react';
import { HISTORICAL_MILESTONES } from '../data/mockData';
import { Icon } from './Icon';

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToExplore: () => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({ isOpen, onClose, onNavigateToExplore }) => {
  const [selectedMilestone, setSelectedMilestone] = useState(HISTORICAL_MILESTONES[2]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl max-h-[88vh] bg-[#fff8f3] rounded-2xl shadow-2xl border border-[#dbc0c0] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f3ede7] border-b border-[#ede7e2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#540414] text-white flex items-center justify-center shadow-sm">
              <Icon name="timeline" size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#540414]">
                Chronological Milestone Archive (1891–1956)
              </h3>
              <p className="font-sans text-xs text-[#554242]">
                Key historical events, speeches, and legislative milestones verified by peer-reviewed scholarship.
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Timeline Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {HISTORICAL_MILESTONES.map((m) => {
              const isSelected = selectedMilestone.year === m.year;
              return (
                <button
                  key={m.year}
                  type="button"
                  onClick={() => setSelectedMilestone(m)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                    isSelected
                      ? 'bg-[#721d28] text-white border-[#540414] shadow-md scale-102'
                      : 'bg-white hover:bg-[#f3ede7] text-[#1d1b18] border-[#ede7e2]'
                  }`}
                >
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-mono mb-2 shadow-sm ${
                      isSelected
                        ? 'bg-white text-[#721d28]'
                        : 'bg-[#f3ede7] text-[#540414]'
                    }`}
                  >
                    {m.year}
                  </span>
                  <span className="font-serif text-xs font-semibold line-clamp-1">{m.title}</span>
                  <span
                    className={`font-mono text-[10px] mt-1 ${
                      isSelected ? 'text-[#ffddb3]' : 'text-[#805610]'
                    }`}
                  >
                    {m.documentsCount} Docs
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Milestone Card */}
          <div className="p-6 bg-white rounded-xl border border-[#ede7e2] shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ede7e2] pb-3">
              <div>
                <span className="font-mono text-xs text-[#805610] uppercase tracking-wider font-semibold">
                  Milestone Focus • Year {selectedMilestone.year}
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#540414] mt-0.5">
                  {selectedMilestone.title}
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#bceecb] text-[#002e18] font-mono text-xs font-semibold">
                {selectedMilestone.documentsCount} Digitized Records Linked
              </span>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs text-[#554242] uppercase tracking-wider">
                Historical Summary:
              </span>
              <p className="font-sans text-sm text-[#1d1b18] leading-relaxed">
                {selectedMilestone.desc}
              </p>
            </div>

            <div className="space-y-2 bg-[#f9f2ed] p-4 rounded-lg">
              <span className="font-mono text-xs text-[#805610] uppercase tracking-wider font-semibold">
                Scholarly Significance:
              </span>
              <p className="font-sans text-sm text-[#554242] leading-relaxed">
                {selectedMilestone.significance}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToExplore();
                }}
                className="px-4 py-2 rounded-lg bg-[#540414] hover:bg-[#721d28] text-white font-sans text-xs uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Icon name="menu_book" size={16} />
                <span>View {selectedMilestone.year} Records in Catalog</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
