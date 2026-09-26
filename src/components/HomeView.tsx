import React, { useState } from 'react';
import { CatalogRecord } from '../types';
import { Icon } from './Icon';
import { useLanguage } from '../i18n';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onSelectRecord: (record: CatalogRecord) => void;
  onOpenImageGen: () => void;
  onOpenChat: () => void;
  onSearch: (query: string, category: string) => void;
  records: CatalogRecord[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectRecord,
  onOpenImageGen,
  onOpenChat,
  onSearch,
  records,
}) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [aiAssistantInput, setAiAssistantInput] = useState('');
  const [aiAssistantResponse, setAiAssistantResponse] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: t('allRecords'), icon: 'menu_book' },
    { id: 'manuscripts', label: t('manuscriptsCat') },
    { id: 'speeches', label: t('speechesCat') },
    { id: 'photographs', label: t('photographsCat') },
    { id: 'audio', label: t('audioCat') },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, activeCategory);
    onNavigate('explore');
  };

  const handleQuickDirective = (text: string) => {
    setSearchQuery(text);
    onSearch(text, activeCategory);
    onNavigate('explore');
  };

  const handleAiAssistantSubmit = () => {
    if (!aiAssistantInput.trim()) return;
    setAiAssistantResponse(
      `Synthesized archival response for: "${aiAssistantInput}"\n\nBased on multiple scanned accession records in the National Repository (including CAD Vol. VII & the 1936 monograph), the primary sources corroborate your inquiry with authenticated shelfmarks registered under the National Archives of India catalog (Accession #DHA-1948-CONST-0042).`
    );
  };

  // Find records for artifacts
  const annihilationRecord = records.find((r) => r.id === 'annihilation-of-caste') || records[0];
  const constitutionRecord = records.find((r) => r.id === 'draft-constitution-annotations') || records[1];

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* Top Archival Notice Strip */}
      <aside
        aria-label="Archive Information Bar"
        className="w-full bg-[#f9f2ed] border-b border-[#ede7e2] text-[#554242] px-6 lg:px-12 py-2 flex items-center justify-between text-xs font-sans"
      >
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#002e18]"></span>
          <span className="font-semibold text-[#1d1b18] text-xs">{t('archiveVerified')}</span>
          <span className="text-[#554242]/40">·</span>
          <span className="text-[#554242] text-xs">{t('recordsCount')}</span>
          <span className="text-[#554242]/40">·</span>
          <span className="text-[#554242] text-xs">{t('collectionsCount')}</span>
          <span className="text-[#554242]/40">·</span>
          <span className="text-[#805610] text-xs font-medium">{t('updatedDate')}</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => onNavigate('timeline')}
            className="text-[#805610] hover:text-[#540414] transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>{t('preservationStandards')}</span>
            <Icon name="arrow_forward" size={14} />
          </button>
        </div>
      </aside>

      {/* Hero Section */}
      <section className="relative w-full px-6 lg:px-12 py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-[#fff8f3] via-white to-[#fff8f3]">
        {/* Subtle Parchment Texture Simulation via radial gradients */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#805610_0.75px,transparent_0.75px)] [background-size:24px_24px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f3ede7] text-[#540414] font-mono text-xs uppercase tracking-widest mb-6 shadow-xs border border-[#ede7e2]">
            <Icon name="verified" size={16} className="text-[#805610]" />
            <span>{t('nationalRepository')}</span>
          </div>

          {/* Grand Editorial Headline */}
          <h1
            className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#540414] max-w-5xl leading-tight mb-4 tracking-tight font-semibold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {t('heroTitlePreserve')}{' '}
            <span className="italic font-normal text-[#805610]">{t('heroTitleDiscover')}</span>{' '}
            {t('heroTitleStories')} {t('heroTitleUncover')}
          </h1>

          {/* Supporting Editorial Subtitle */}
          <p className="font-sans text-base sm:text-lg text-[#554242] max-w-3xl mb-8 leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Omni-Search Master Console */}
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-[#ede7e2] p-4 sm:p-5 text-left mb-6">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 pb-3 overflow-x-auto text-xs font-sans">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg tracking-wide font-medium flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#721d28] text-white shadow-xs'
                      : 'bg-[#f3ede7] text-[#554242] hover:bg-[#ede7e2] hover:text-[#1d1b18]'
                  }`}
                >
                  {cat.icon && (
                    <Icon name={cat.icon} size={16} />
                  )}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <div className="relative flex-1 flex items-center bg-[#f3ede7] rounded-xl px-3 py-3 border border-[#ede7e2]">
                <Icon name="travel_explore" size={18} className="text-[#805610] mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-transparent font-sans text-sm text-[#1d1b18] placeholder:text-[#554242]/70 focus:outline-none"
                />
                <div className="hidden md:flex items-center gap-1 font-mono text-[11px] text-[#554242] bg-[#e7e1dc] px-2 py-0.5 rounded ml-2">
                  <span className="text-[#805610] font-bold">EXACT:</span> “”
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#540414] text-white font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#721d28] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>{t('searchArchiveBtn')}</span>
                <Icon name="arrow_forward" size={18} />
              </button>
            </form>

            {/* Quick Syntax Suggestions */}
            <div className="flex items-center gap-2 pt-3 px-1 font-mono text-xs text-[#554242]/80 flex-wrap">
              <span className="text-[#805610] uppercase font-semibold">{t('scholarlyDirectives')}</span>
              <button
                type="button"
                onClick={() => handleQuickDirective('Ambedkar Columbia University 1916')}
                className="hover:text-[#540414] hover:underline cursor-pointer"
              >
                Ambedkar Columbia 1916
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleQuickDirective('Constituent Assembly Draft Committee Nov 1948')}
                className="hover:text-[#540414] hover:underline cursor-pointer"
              >
                Constituent Assembly Draft Nov 1948
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleQuickDirective('Mahad Chavdar Tale Water Satyagraha')}
                className="hover:text-[#540414] hover:underline cursor-pointer"
              >
                Mahad Water Declaration
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-4 flex-wrap justify-center mb-12">
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-3 rounded-xl bg-[#721d28] text-white font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#540414] transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Icon name="local_library" size={18} />
              <span>Explore All Collections</span>
            </button>
            <button
              onClick={() => onNavigate('ask-the-archive')}
              className="px-6 py-3 rounded-xl bg-[#ffddb3] text-[#291800] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#fdc576] transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Icon name="auto_awesome" size={18} className="text-[#805610]" />
              <span>Ask the Archive AI</span>
            </button>
            <button
              onClick={onOpenImageGen}
              className="px-5 py-3 rounded-xl bg-white text-[#805610] border border-[#805610]/40 font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#f3ede7] transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Icon name="palette" size={18} />
              <span>Generate Archival Image</span>
            </button>
          </div>

          {/* Editorial Archival Artifact Showcase (Masonry / Mosaic Grid) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch text-left">
            {/* Artifact 1: Scanned Manuscript Folio */}
            <article
              onClick={() => {
                onSelectRecord(annihilationRecord);
                onNavigate('reader');
              }}
              className="md:col-span-4 bg-[#f3ede7] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer border border-[#ede7e2]"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-[#554242] mb-3">
                  <span className="bg-[#e7e1dc] px-2 py-0.5 rounded text-[#805610] font-bold">
                    MS-1936-AC
                  </span>
                  <span>RESTORED FOLIO</span>
                </div>
                <div className="relative overflow-hidden rounded-lg bg-[#f9f2ed] mb-3 h-48">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPDJpxeQJzbo_ysAkR7xlpbEQMbMjJmbAvJ884Z-HVdQDAIzAOsBSBVlQbGhN7_WbqWg_B3YtWD2tBZb_Z54HqVFhuKbBaQtg3CRByfgfgD91AZKGFLCOJp8tZ7RMbgDtSQX_cX9Tae2ikzFnR36-0c6_yyS1lTkz1ZrdNGM8yO9konrWyowE64kzDRx8Ump4hhtFPl2s_EH5lVwAAXJkWnXrRcHOG6i9_-6pACQjc2EXmAZ6M_Sc"
                    alt="Annihilation of Caste 1936 Folio"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-white/90 text-[#1d1b18] font-mono text-[10px] flex items-center gap-1 shadow-xs">
                    <Icon name="verified_user" size={14} className="text-[#002e18]" /> 1200 DPI Master
                  </div>
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#540414] mb-1">
                  Annihilation of Caste (1936)
                </h3>
                <p className="font-sans text-xs text-[#554242] line-clamp-2 leading-relaxed">
                  First edition printed monograph with authorial pen corrections and handwritten
                  preface notes for the Lahore conference.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#ede7e2] flex items-center justify-between text-xs font-sans text-[#805610] font-semibold">
                <span>Archive: Special Collections Bombay</span>
                <Icon name="arrow_forward" size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </article>

            {/* Artifact 2: Centerpiece Dr. B. R. Ambedkar Archival Portrait */}
            <article
              onClick={() => onNavigate('collections')}
              className="md:col-span-4 bg-[#e7e1dc] rounded-xl p-5 shadow-md flex flex-col justify-between group relative overflow-hidden cursor-pointer border border-[#dbc0c0]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#540414]/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-3">
                  <span className="bg-[#540414] text-white px-2.5 py-0.5 rounded font-semibold">
                    HISTORIC ICON
                  </span>
                  <span className="text-[#554242]">ACCESSION #ARC-4801</span>
                </div>
                <div className="relative overflow-hidden rounded-lg bg-[#f3ede7] h-56 mb-3">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQi2qEHHv0g6ZrkiPtF1ob3g3e-qVs9CGa0A0_YaqzGOTkrUJJ54qt3VbazkD1GF7JIVjkcKl0rcx-nmRGQzD8SQ4OKYiYr8EKVdH6LCmEbxU3h1Uawzx8r7rCFiYcaZLeYh1bNniVASCr8nm7YgOP41nz5oLC78gHsRup9qG5rQDfksTELN6bcdcyJnARWjxu2muQUb64wkJUDMFlzePJM6xT0QsitUNodWjyVTw1qPN_RAzJK80"
                    alt="Dr. B. R. Ambedkar Archival Portrait"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 text-[#540414] font-mono text-[10px] shadow-xs">
                    Circa 1946 • Delhi
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#540414] mb-1">
                  Dr. B. R. Ambedkar (1891–1956)
                </h3>
                <p className="font-sans text-xs text-[#554242] leading-relaxed">
                  Chief Architect of the Constitution of India, jurist, economist, social reformer,
                  and scholar. Featuring 1,480 digitized primary sources.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#dbc0c0]/50 flex items-center justify-between">
                <span className="font-mono text-xs text-[#002e18] font-semibold flex items-center gap-1">
                  <Icon name="check_circle" size={16} /> 18
                  Volumes Digitized
                </span>
                <span className="font-sans text-xs uppercase tracking-wider text-[#540414] font-semibold flex items-center gap-1 group-hover:underline">
                  View Dossier <Icon name="north_east" size={16} />
                </span>
              </div>
            </article>

            {/* Artifact 3: Constitution Assembly Folio + Audio Gramophone Reel Split */}
            <div className="md:col-span-4 flex flex-col gap-5">
              {/* Sub-item: Assembly Draft */}
              <article
                onClick={() => {
                  onSelectRecord(constitutionRecord);
                  onNavigate('reader');
                }}
                className="bg-[#f3ede7] rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex-1 group cursor-pointer border border-[#ede7e2]"
              >
                <div className="flex items-center justify-between font-mono text-xs text-[#554242] mb-1.5">
                  <span className="bg-[#e7e1dc] px-2 py-0.5 rounded text-[#805610] font-bold">
                    LEG-DRAFT-1948
                  </span>
                  <span>CONSTITUENT ASSEMBLY</span>
                </div>
                <h4 className="font-serif text-base font-semibold text-[#540414] mb-1">
                  Drafting Committee Folio with Marginalia
                </h4>
                <p className="font-sans text-xs text-[#554242] line-clamp-2 mb-2 leading-relaxed">
                  Original legal working papers containing Dr. Ambedkar's handwritten amendments
                  regarding Article 14, 15, and 32.
                </p>
                <div className="flex items-center justify-between font-mono text-xs text-[#554242]">
                  <span>National Archives of India</span>
                  <span className="text-[#540414] font-bold">14 Folios</span>
                </div>
              </article>

              {/* Sub-item: Vintage Microphone Audio Card */}
              <article className="bg-[#f3ede7] rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex-1 group border border-[#ede7e2]">
                <div className="flex items-center justify-between font-mono text-xs text-[#554242] mb-2">
                  <span className="bg-[#ffddb3] text-[#291800] px-2 py-0.5 rounded font-bold">
                    AUDIO-REC-1954
                  </span>
                  <span>VOICE ARCHIVE</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAudioPlaying(!audioPlaying)}
                    aria-label="Play sample recording"
                    className="w-12 h-12 rounded-full bg-[#721d28] text-white flex items-center justify-center shrink-0 hover:bg-[#540414] transition-colors shadow-sm cursor-pointer"
                  >
                    <Icon name={audioPlaying ? 'pause' : 'play_arrow'} size={24} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-sm font-semibold text-[#540414] truncate">
                      BBC Interview: Democracy in India
                    </h5>
                    <p className="font-mono text-[11px] text-[#554242]">
                      London Broadcast • 24:18 Duration
                    </p>
                    {/* SVG Audio Waveform Preview */}
                    <div className="w-full h-4 mt-1.5 flex items-center gap-0.5 text-[#805610]">
                      <span className={`w-1 bg-current rounded-full ${audioPlaying ? 'h-3 animate-pulse' : 'h-2'}`}></span>
                      <span className={`w-1 bg-current rounded-full ${audioPlaying ? 'h-4 animate-pulse' : 'h-3'}`}></span>
                      <span className={`w-1 bg-current rounded-full ${audioPlaying ? 'h-4 animate-bounce' : 'h-4'}`}></span>
                      <span className="w-1 bg-current h-1 rounded-full"></span>
                      <span className="w-1 bg-current h-3.5 rounded-full"></span>
                      <span className="w-1 bg-current h-2 rounded-full"></span>
                      <span className="w-1 bg-current h-4 rounded-full"></span>
                      <span className="w-1 bg-current h-3 rounded-full"></span>
                      <span className="w-1 bg-current h-1.5 rounded-full"></span>
                      <span className="w-1 bg-current h-3 rounded-full"></span>
                      <span className="w-1 bg-current h-4 rounded-full"></span>
                      <span className="w-1 bg-current h-2 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarly Metrics / Archival Stats Strip */}
      <section
        aria-label="Archival Holdings Summary"
        className="w-full bg-[#ede7e2] py-8 px-6 lg:px-12 border-y border-[#dbc0c0]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-4 text-center">
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl lg:text-4xl font-bold text-[#540414]">
                12,450+
              </span>
              <span className="font-sans text-xs uppercase tracking-wider text-[#554242] mt-1 font-semibold">
                Primary Documents
              </span>
              <span className="font-mono text-[11px] text-[#805610] mt-0.5">High-Res Scanned</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl lg:text-4xl font-bold text-[#540414]">
                3,200+
              </span>
              <span className="font-sans text-xs uppercase tracking-wider text-[#554242] mt-1 font-semibold">
                Historic Photographs
              </span>
              <span className="font-mono text-[11px] text-[#805610] mt-0.5">1880–1956 Archive</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl lg:text-4xl font-bold text-[#540414]">850+</span>
              <span className="font-sans text-xs uppercase tracking-wider text-[#554242] mt-1 font-semibold">
                Audio &amp; Speeches
              </span>
              <span className="font-mono text-[11px] text-[#805610] mt-0.5">Phonograph &amp; Reel</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl lg:text-4xl font-bold text-[#540414]">120+</span>
              <span className="font-sans text-xs uppercase tracking-wider text-[#554242] mt-1 font-semibold">
                Milestones &amp; Timelines
              </span>
              <span className="font-mono text-[11px] text-[#805610] mt-0.5">Peer-Reviewed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl lg:text-4xl font-bold text-[#540414]">24+</span>
              <span className="font-sans text-xs uppercase tracking-wider text-[#554242] mt-1 font-semibold">
                Scholarly Collections
              </span>
              <span className="font-mono text-[11px] text-[#805610] mt-0.5">Museum Consortia</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl lg:text-4xl font-bold text-[#540414]">4</span>
              <span className="font-sans text-xs uppercase tracking-wider text-[#554242] mt-1 font-semibold">
                Standard Languages
              </span>
              <span className="font-mono text-[11px] text-[#805610] mt-0.5">EN • HI • MR • TA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Archive By Medium (Category Grid) */}
      <section className="w-full py-16 px-6 lg:px-12 bg-[#fff8f3]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#805610] mb-1 font-semibold">
                Cataloged Preservations
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#540414]">
                Explore by Archival Medium
              </h2>
            </div>
            <p className="font-sans text-sm text-[#554242] max-w-md">
              Organized by physical medium, digitization format, and conservation category according
              to international archival classification standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: 'edit_note',
                count: '4,120 Items',
                title: 'Manuscripts & Drafts',
                desc: 'Handwritten folios, academic theses, marginal annotations, and legal outlines.',
              },
              {
                icon: 'menu_book',
                count: '1,840 Items',
                title: 'Rare Books & Treatises',
                desc: 'First-edition monographs, economic tracts, sociopolitical dissertations, and polemics.',
              },
              {
                icon: 'mail',
                count: '2,910 Items',
                title: 'Letters & Correspondence',
                desc: 'Epistolary exchanges with global scholars, statesmen, activists, and legal figures.',
              },
              {
                icon: 'record_voice_over',
                count: '640 Items',
                title: 'Historic Speeches',
                desc: 'Parliamentary debates, public addresses, convocation orations, and conference transcripts.',
              },
              {
                icon: 'photo_camera',
                count: '3,200 Items',
                title: 'Archival Photographs',
                desc: 'Original glass plates, silver gelatin prints, rally captures, and rare portraits.',
              },
              {
                icon: 'newspaper',
                count: '1,580 Items',
                title: 'Gazetteers & Newspapers',
                desc: 'Mooknayak, Bahishkrit Bharat, Janata, Prabuddha Bharat, and historical press clippings.',
              },
              {
                icon: 'graphic_eq',
                count: '850 Items',
                title: 'Audio Recordings',
                desc: 'Restored magnetic tape spools, vinyl recordings, voice transmissions, and oral recollections.',
              },
              {
                icon: 'video_library',
                count: '210 Items',
                title: 'Archival Film & Video',
                desc: 'Newsreel reels, 16mm celluloid footage of public rallies, and international ceremonial visits.',
              },
            ].map((cat, i) => (
              <div
                key={i}
                onClick={() => onNavigate('explore')}
                className="p-5 bg-[#f3ede7] rounded-xl hover:bg-[#ede7e2] transition-all shadow-xs hover:shadow-md flex flex-col justify-between group cursor-pointer border border-[#ede7e2]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg bg-[#e7e1dc] flex items-center justify-center text-[#540414] group-hover:bg-[#540414] group-hover:text-white transition-colors">
                    <Icon name={cat.icon} size={24} />
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#e7e1dc] text-[#805610] font-semibold">
                    {cat.count}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-[#540414] mb-1">
                    {cat.title}
                  </h3>
                  <p className="font-sans text-xs text-[#554242] leading-relaxed">{cat.desc}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#ede7e2] flex items-center text-xs font-mono text-[#805610] font-semibold">
                  <span>Explore Collection</span>
                  <Icon name="arrow_forward" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Major Collection Spotlight */}
      <section className="w-full py-16 px-6 lg:px-12 bg-[#f9f2ed]" id="featured-collection">
        <div className="max-w-7xl mx-auto bg-[#f3ede7] rounded-2xl p-6 lg:p-10 shadow-lg border border-[#dbc0c0] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Visual Column */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="relative rounded-xl overflow-hidden shadow-md bg-[#e7e1dc] h-80 sm:h-96">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVoN2Cw7D6Uj-B0V1sYxyep1op35rqu0AJpq4Lq7eqqS_RDTDEv7dEV6ISfdiW1lps-9oBstsaeTD9w3WteHi4gonXZWNqSpC2-ULObzsm0BiLVQwlGsfyOr7mHR9x116Hy0BSIBgI5calSZEyArJuvgiR7NeHS7Hd4jd6mo880PNTIqY6rkX9tL4umaRt3fyxNjJqgz9rQ_ycSm-2gBOrdHgHzpPF0gJCKr5c-OEw02GuCYf-58k"
                  alt="Dr. Ambedkar Personal Library and Study Desk"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#540414]/85 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#ffddb3]">
                    Master Curatorial Dossier
                  </span>
                  <p className="font-serif text-lg font-semibold">The Personal Library &amp; State Papers</p>
                </div>
              </div>
              <div className="bg-[#ede7e2] p-3 rounded-lg flex items-center gap-3 border border-[#dbc0c0]/50">
                <Icon name="account_balance" size={22} className="text-[#805610]" />
                <div className="font-mono text-xs text-[#554242]">
                  <div>CUSTODIAL REPOSITORY:</div>
                  <strong className="text-[#1d1b18] font-sans text-xs">
                    National Archives of India &amp; Siddhartha College Memorial Library
                  </strong>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-[#540414] text-white font-mono text-[11px] tracking-wider uppercase font-semibold">
                  Collection Spotlight #01
                </span>
                <span className="font-mono text-xs text-[#805610]">CHRONOLOGY: 1891–1956</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#540414] mb-3">
                Dr. B. R. Ambedkar Digital Heritage Archive
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#554242] mb-6 leading-relaxed">
                The definitive digital repository preserving the comprehensive intellectual,
                constitutional, and social rights oeuvre of Dr. Bhimrao Ramji Ambedkar. This curated
                repository unites primary writings, handwritten marginalia, constituent assembly
                working drafts, private letters, and verified audio broadcasts.
              </p>

              {/* Core Dossier Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl mb-6 text-left shadow-xs border border-[#ede7e2]">
                <div>
                  <div className="font-mono text-[10px] text-[#554242] uppercase">Cataloged Sources</div>
                  <div className="font-serif text-base text-[#540414] font-bold">1,480 Folios</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#554242] uppercase">Collected Volumes</div>
                  <div className="font-serif text-base text-[#540414] font-bold">18 Volumes</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#554242] uppercase">Transcription</div>
                  <div className="font-serif text-base text-[#540414] font-bold">Bilingual OCR</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#554242] uppercase">Audio Folios</div>
                  <div className="font-serif text-base text-[#540414] font-bold">34 Verified Cuts</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#554242] uppercase">Resolution</div>
                  <div className="font-serif text-base text-[#540414] font-bold">600+ DPI Raw TIFF</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#554242] uppercase">Licensing</div>
                  <div className="font-serif text-base text-[#540414] font-bold">CC-BY-NC 4.0</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => onNavigate('explore')}
                  className="px-5 py-2.5 rounded-lg bg-[#721d28] text-white font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#540414] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Ambedkar Collection</span>
                  <Icon name="arrow_forward" size={16} />
                </button>
                <button
                  onClick={onOpenChat}
                  className="px-4 py-2.5 rounded-lg bg-white text-[#1d1b18] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#ede7e2] transition-all flex items-center gap-1.5 border border-[#ede7e2] cursor-pointer"
                >
                  <Icon name="psychology" size={16} className="text-[#805610]" />
                  <span>Query Writings via AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ask the Archive AI Spotlight */}
      <section className="w-full py-16 px-6 lg:px-12 bg-[#ede7e2]" id="ask-assistant">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl p-6 lg:p-8 shadow-xl border-l-4 border-[#540414]">
          <div className="flex items-center gap-2 text-[#805610] mb-2 font-mono text-xs uppercase tracking-widest font-semibold">
            <Icon name="psychology" size={20} />
            <span>Source-Grounded Archival Intelligence</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#540414] mb-2">
            Ask the Archive AI Assistant
          </h2>
          <p className="font-sans text-sm text-[#554242] mb-6 leading-relaxed">
            Ground your scholarly research in authenticated primary sources. Our AI assistant cites
            exact document page numbers, archival shelfmark accession IDs, and verbatim historical quotes.
          </p>

          {/* Curated Suggestion Chips */}
          <div className="mb-4">
            <div className="font-mono text-xs text-[#554242] uppercase mb-2 font-semibold">
              Suggested Curatorial Questions:
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "What were Ambedkar's core arguments on universal adult franchise?",
                'Show primary documents related to the Drafting Committee of the Constitution.',
                'Which historical records document the Mahad Satyagraha of 1927?',
                'Find speeches delivered at Columbia University and London School of Economics.',
              ].map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAiAssistantInput(q)}
                  className="text-left px-3 py-1.5 rounded-lg bg-[#f3ede7] text-[#1d1b18] hover:bg-[#ede7e2] transition-colors font-sans text-xs flex items-center gap-1.5 shadow-2xs border border-[#ede7e2] cursor-pointer"
                >
                  <Icon name="chat_bubble_outline" size={16} className="text-[#805610]" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Query Box */}
          <div className="relative bg-[#f3ede7] rounded-xl p-3 shadow-inner border border-[#ede7e2]">
            <textarea
              value={aiAssistantInput}
              onChange={(e) => setAiAssistantInput(e.target.value)}
              placeholder="Ask a historical question with full archival citation request (e.g. 'Synthesize Dr. Ambedkar\'s critique of caste, citing Section 14...')"
              rows={3}
              className="w-full bg-transparent font-sans text-sm text-[#1d1b18] placeholder:text-[#554242]/70 focus:outline-none p-1 resize-none"
            />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-[#ede7e2]">
              <div className="flex items-center gap-3 font-mono text-xs text-[#554242]">
                <span className="flex items-center gap-1 text-[#002e18] font-semibold">
                  <Icon name="verified" size={16} /> Hallucination-Shield Enabled
                </span>
                <span className="hidden md:inline">• Direct Page Referencing</span>
              </div>
              <button
                type="button"
                onClick={handleAiAssistantSubmit}
                className="px-5 py-2 rounded-lg bg-[#721d28] text-white font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#540414] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Icon name="auto_awesome" size={18} />
                <span>Query Archive AI</span>
              </button>
            </div>
          </div>

          {/* Response Slot */}
          {aiAssistantResponse && (
            <div className="mt-4 p-4 rounded-xl bg-[#f9f2ed] border border-[#ede7e2] space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#805610] uppercase font-bold">
                  Synthesized Archival Response:
                </span>
                <span className="font-mono text-[11px] bg-[#bceecb] text-[#224f35] px-2 py-0.5 rounded font-bold">
                  3 Primary Citations Found
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#1d1b18] whitespace-pre-wrap leading-relaxed">
                {aiAssistantResponse}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#ede7e2] font-mono text-xs text-[#540414]">
                <button
                  onClick={() => onNavigate('ask-the-archive')}
                  className="hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Icon name="open_in_new" size={14} />
                  <span>Deep Scholarly Synthesis in 'Ask the Archive'</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Curatorial Preservation Charter Banner */}
      <section className="w-full py-8 px-6 lg:px-12 bg-[#e7e1dc] text-[#1d1b18] border-t border-[#dbc0c0]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Icon name="policy" size={36} className="text-[#540414]" />
            <div>
              <h4 className="font-serif text-lg font-bold text-[#540414]">
                Commitment to Archival Integrity &amp; Open Scholarship
              </h4>
              <p className="font-sans text-xs sm:text-sm text-[#554242]">
                All artifacts are preserved using non-destructive multispectral scanning with cryptographic provenance checksums.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('timeline')}
              className="px-4 py-2 rounded-lg bg-white text-[#540414] hover:bg-[#fff8f3] font-sans text-xs uppercase tracking-wider font-semibold transition-colors shadow-xs cursor-pointer border border-[#ede7e2]"
            >
              Read Preservation Charter
            </button>
            <button
              onClick={onOpenImageGen}
              className="px-4 py-2 rounded-lg bg-[#540414] text-white hover:bg-[#721d28] font-sans text-xs uppercase tracking-wider font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Generate Records
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
