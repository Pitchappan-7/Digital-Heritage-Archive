import React, { useState } from 'react';
import { ArchiveLogo } from './ArchiveLogo';
import { Icon } from './Icon';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenImageGen: () => void;
  onOpenChat: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenImageGen,
  onOpenChat,
  onOpenSearch,
}) => {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'ask-the-archive', label: 'Ask the Archive' },
    { id: 'reader', label: 'Folio Reader' },
    { id: 'collections', label: 'Collections' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'heritage-map', label: 'Heritage Map' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#fff8f3]/95 backdrop-blur-md border-b border-[#ede7e2] shadow-[0_1px_8px_rgba(29,27,24,0.06)]">
      <div className="h-20 w-full px-4 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand Logo & National Repository Tag */}
        <div
          className="flex items-center gap-4 shrink-0 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <ArchiveLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#721d28] text-white font-semibold shadow-sm'
                    : 'text-[#554242] hover:bg-[#ede7e2] hover:text-[#1d1b18]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Quick Tool Suite Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch || (() => onNavigate('explore'))}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#f3ede7] text-[#554242] hover:bg-[#ede7e2] hover:text-[#1d1b18] transition-colors cursor-pointer"
          >
            <Icon name="search" size={18} />
            <span className="text-xs font-sans font-medium hidden md:inline">Search</span>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#e7e1dc] text-[#805610]">
              ⌘K
            </kbd>
          </button>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2 py-1.5 text-[#554242] hover:text-[#1d1b18] text-xs font-sans cursor-pointer rounded hover:bg-[#f3ede7]"
            >
              <Icon name="translate" size={18} />
              <span className="uppercase font-semibold">{selectedLang}</span>
              <Icon name="arrow_drop_down" size={16} />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-[#ffffff] rounded-lg shadow-xl border border-[#ede7e2] py-1 z-50">
                {['English (EN)', 'हिन्दी (HI)', 'मराठी (MR)', 'தமிழ் (TA)'].map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setSelectedLang(l.slice(-3, -1));
                      setLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#f3ede7] text-[#1d1b18] transition-colors"
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate Image Studio Modal Trigger */}
          <button
            type="button"
            onClick={onOpenImageGen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fdc576]/30 text-[#805610] hover:bg-[#fdc576]/50 border border-[#805610]/30 transition-all font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-xs"
            title="Generate high-resolution archival folio images using gemini-3-pro-image-preview"
          >
            <Icon name="image" size={18} className="text-[#805610]" />
            <span className="hidden sm:inline">Image Studio</span>
            <span className="text-[9px] bg-[#805610] text-white px-1.5 py-0.2 rounded font-mono">
              4K
            </span>
          </button>

          {/* Gemini AI Multi-turn Chatbot Launcher */}
          <button
            type="button"
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#bceecb] text-[#002e18] hover:bg-[#a1d2af] transition-all font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-xs"
            title="Open Gemini Multi-Turn Archival Chatbot"
          >
            <Icon name="smart_toy" size={18} />
            <span className="hidden sm:inline">AI Chatbot</span>
          </button>

          {/* Explore Archive Primary CTA */}
          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#721d28] text-white font-sans text-xs uppercase tracking-wider hover:bg-[#540414] transition-all shadow-[0_2px_8px_rgba(114,29,40,0.25)] cursor-pointer"
          >
            <Icon name="auto_stories" size={18} />
            <span>Explore Archive</span>
          </button>

          {/* Researcher Profile Avatar */}
          <div
            className="w-8 h-8 rounded-full bg-[#540414] text-white flex items-center justify-center cursor-pointer shadow-xs hover:opacity-90"
            title="Authenticated Researcher Account"
          >
            <Icon name="person" size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};
