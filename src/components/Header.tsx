import React, { useState, useRef, useEffect } from 'react';
import { ArchiveLogo } from './ArchiveLogo';
import { Icon } from './Icon';
import { useLanguage, Language } from '../i18n';

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
  const { setLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const navItems = [
    { id: 'home', label: t('home') },
    { id: 'explore', label: t('explore') },
    { id: 'ask-the-archive', label: t('askArchive') },
    { id: 'reader', label: t('folioReader') },
    { id: 'collections', label: t('collections') },
    { id: 'timeline', label: t('timeline') },
    { id: 'heritage-map', label: t('heritageMap') },
  ];

  const languagesList: { code: Language; label: string }[] = [
    { code: 'en', label: 'English (EN)' },
    { code: 'hi', label: 'हिन्दी (HI)' },
    { code: 'mr', label: 'मराठी (MR)' },
    { code: 'ta', label: 'தமிழ் (TA)' },
  ];

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setLangOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#fff8f3]/95 backdrop-blur-md border-b border-[#ede7e2] shadow-[0_1px_8px_rgba(29,27,24,0.06)] box-border max-w-full">
      <div className="h-20 w-full max-w-full px-3 sm:px-4 md:px-6 xl:px-8 2xl:px-10 flex items-center justify-between gap-2 lg:gap-4 box-border min-w-0">
        {/* Brand Logo & National Repository Tag */}
        <div
          className="flex items-center gap-2 sm:gap-4 shrink-0 cursor-pointer min-w-0"
          onClick={() => onNavigate('home')}
        >
          <ArchiveLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 shrink min-w-0 overflow-hidden">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-2 2xl:px-3 py-1.5 rounded-lg font-sans text-[11px] 2xl:text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch || (() => onNavigate('explore'))}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#f3ede7] text-[#554242] hover:bg-[#ede7e2] hover:text-[#1d1b18] transition-colors cursor-pointer"
          >
            <Icon name="search" size={18} />
            <span className="text-xs font-sans font-medium hidden md:inline">{t('search')}</span>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#e7e1dc] text-[#805610] hidden sm:inline-block">
              ⌘K
            </kbd>
          </button>

          {/* Multilingual Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              aria-expanded={langOpen}
              aria-haspopup="true"
              aria-label="Select Language"
              className="flex items-center gap-1 px-1.5 sm:px-2 py-1.5 text-[#554242] hover:text-[#1d1b18] text-xs font-sans cursor-pointer rounded hover:bg-[#f3ede7]"
            >
              <Icon name="translate" size={18} />
              <span className="uppercase font-semibold text-xs">{t('selectedLangCode')}</span>
              <Icon name="arrow_drop_down" size={16} />
            </button>
            {langOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-1 w-36 bg-[#ffffff] rounded-lg shadow-xl border border-[#ede7e2] py-1 z-50"
              >
                {languagesList.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelectLanguage(l.code)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectLanguage(l.code);
                      }
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#f3ede7] text-[#1d1b18] transition-colors cursor-pointer font-sans"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate Image Studio Modal Trigger */}
          <button
            type="button"
            onClick={onOpenImageGen}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-[#fdc576]/30 text-[#805610] hover:bg-[#fdc576]/50 border border-[#805610]/30 transition-all font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-xs"
            title="Generate high-resolution archival folio images using gemini-3-pro-image-preview"
          >
            <Icon name="image" size={18} className="text-[#805610]" />
            <span className="hidden xl:inline">{t('imageStudio')}</span>
            <span className="text-[9px] bg-[#805610] text-white px-1.5 py-0.2 rounded font-mono">
              4K
            </span>
          </button>

          {/* Gemini AI Multi-turn Chatbot Launcher */}
          <button
            type="button"
            onClick={onOpenChat}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-[#bceecb] text-[#002e18] hover:bg-[#a1d2af] transition-all font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-xs"
            title="Open Gemini Multi-Turn Archival Chatbot"
          >
            <Icon name="smart_toy" size={18} />
            <span className="hidden sm:inline">{t('aiChatbot')}</span>
          </button>

          {/* Explore Archive Primary CTA */}
          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className="hidden 2xl:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#721d28] text-white font-sans text-xs uppercase tracking-wider hover:bg-[#540414] transition-all shadow-[0_2px_8px_rgba(114,29,40,0.25)] cursor-pointer"
          >
            <Icon name="auto_stories" size={18} />
            <span>{t('exploreArchive')}</span>
          </button>

          {/* Researcher Profile Avatar */}
          <div
            className="w-8 h-8 rounded-full bg-[#540414] text-white flex items-center justify-center cursor-pointer shadow-xs hover:opacity-90 shrink-0"
            title="Authenticated Researcher Account"
          >
            <Icon name="person" size={18} />
          </div>

          {/* Mobile / Tablet Navigation Toggle (< xl screens) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden flex items-center justify-center p-2 rounded-lg text-[#554242] hover:text-[#1d1b18] hover:bg-[#f3ede7] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Dropdown Navigation Menu (< xl screens) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#fff8f3] border-t border-[#ede7e2] px-4 py-3 shadow-lg flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#721d28] text-white font-semibold'
                    : 'text-[#554242] hover:bg-[#ede7e2] hover:text-[#1d1b18]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
