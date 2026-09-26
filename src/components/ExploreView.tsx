import React, { useState } from 'react';
import { CatalogRecord } from '../types';
import { Icon } from './Icon';
import { useLanguage } from '../i18n';

interface ExploreViewProps {
  records: CatalogRecord[];
  onSelectRecord: (record: CatalogRecord) => void;
  onNavigate: (tab: string) => void;
  onOpenChat: () => void;
  onOpenImageGen: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  records,
  onSelectRecord,
  onNavigate,
  onOpenChat,
  onOpenImageGen,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState(
    "Ambedkar AND (Constitution OR 'Labour Rights') NOT provisional"
  );
  const [selectedSort, setSelectedSort] = useState('Relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'dense'>('grid');
  const [docTypeFilter, setDocTypeFilter] = useState<string[]>([
    'Manuscript',
    'Speech',
    'Legal Draft',
  ]);
  const [activeAudioPlaying, setActiveAudioPlaying] = useState<string | null>(null);

  // Facet toggles
  const [activeFacets, setActiveFacets] = useState<string[]>([
    'Collection: Dr. B. R. Ambedkar',
    'Language: English & Marathi',
    'Digitization: Verified 100% OCR',
  ]);

  const removeFacet = (facet: string) => {
    setActiveFacets(activeFacets.filter((f) => f !== facet));
  };

  const resetAllFacets = () => {
    setActiveFacets([]);
  };

  const handleOpenReader = (record: CatalogRecord) => {
    onSelectRecord(record);
    onNavigate('reader');
  };

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* Top Editorial Breadcrumb Bar */}
      <div className="w-full bg-[#f9f2ed] py-2.5 px-6 lg:px-12 border-b border-[#ede7e2]">
        <div className="flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-[#554242]">
            <button onClick={() => onNavigate('home')} className="hover:text-[#540414] cursor-pointer">
              {t('home')}
            </button>
            <span className="text-[#805610] opacity-70">/</span>
            <span className="text-[#540414] font-semibold">{t('explore')}</span>
            <span className="text-[#805610] opacity-70">/</span>
            <span className="text-[#1d1b18]">Catalog Discovery</span>
          </div>
          <div className="flex items-center gap-3 text-[#554242] font-mono text-xs">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#002e18]"></span>
              <span>Index: Realtime Federated Sync</span>
            </span>
            <span className="hidden sm:inline-block opacity-40">|</span>
            <span className="hidden sm:inline-block">Updated: 04:12 UTC</span>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <section className="w-full bg-[#f3ede7] py-8 sm:py-12 px-6 lg:px-12 border-b border-[#dbc0c0]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ffddb3] text-[#291800] font-mono text-xs uppercase tracking-widest font-semibold">
                <Icon name="account_balance" size={15} />
                <span>Curatorial Scholarly Repository</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#540414] font-semibold tracking-tight">
                {t('exploreTitle')}
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#554242] max-w-3xl leading-relaxed">
                {t('exploreSubtitle')}
              </p>
            </div>

            {/* Catalog Coverage Card */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
              <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#ede7e2] w-full max-w-xs space-y-1.5">
                <div className="flex justify-between items-center text-[#554242] font-mono text-xs">
                  <span>Catalog Coverage</span>
                  <span className="text-[#540414] font-bold">98.4% Digitized</span>
                </div>
                <div className="w-full h-1.5 bg-[#ede7e2] rounded-full overflow-hidden">
                  <div className="h-full bg-[#721d28] rounded-full" style={{ width: '98.4%' }}></div>
                </div>
                <div className="flex justify-between font-sans text-xs text-[#554242] pt-0.5">
                  <span>12,450 Records</span>
                  <span>1890–1960 C.E.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Search Bar & Controls */}
          <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border border-[#ede7e2] space-y-3">
            <div className="flex flex-col lg:flex-row items-stretch gap-2.5">
              <div className="relative flex-grow">
                <Icon name="manage_search" size={22} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#805610]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search keywords, titles, subjects, people, accession ID... (Boolean operators AND, OR, NOT supported)"
                  className="w-full pl-11 pr-24 py-3 bg-[#f9f2ed] text-[#1d1b18] font-sans text-sm rounded-lg focus:outline-none focus:bg-white border border-[#ede7e2] focus:border-[#540414] transition-colors"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 font-mono text-xs text-[#805610]">
                  <span className="px-1.5 py-0.5 rounded bg-[#f3ede7] text-[#554242] text-[10px] font-semibold">
                    BOOLEAN
                  </span>
                </div>
              </div>

              {/* Sort Select */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative min-w-[200px]">
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="w-full appearance-none bg-[#f9f2ed] text-[#1d1b18] font-sans text-xs py-3 pl-3 pr-8 rounded-lg border border-[#ede7e2] focus:outline-none cursor-pointer"
                  >
                    <option value="Relevance">Sort: Relevance</option>
                    <option value="Oldest">Sort: Date (Oldest First)</option>
                    <option value="Newest">Sort: Date (Newest First)</option>
                    <option value="Recently Digitized">Sort: Recently Digitized</option>
                    <option value="Most Referenced">Sort: Most Referenced by AI</option>
                    <option value="Accession">Sort: Accession ID</option>
                  </select>
                  <Icon name="unfold_more" size={18} className="text-[#805610] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* View Switcher */}
                <div className="flex items-center bg-[#f9f2ed] p-1 rounded-lg border border-[#ede7e2]">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-[#540414] shadow-xs' : 'text-[#554242]'
                    }`}
                    title="Detailed Grid View"
                  >
                    <Icon name="grid_view" size={18} className="block" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('dense')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      viewMode === 'dense' ? 'bg-white text-[#540414] shadow-xs' : 'text-[#554242]'
                    }`}
                    title="Dense Scholarly List"
                  >
                    <Icon name="view_headline" size={18} className="block" />
                  </button>
                </div>

                {/* Execute Button */}
                <button
                  type="button"
                  className="px-5 py-3 rounded-lg bg-[#540414] text-white font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#721d28] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Icon name="filter_alt" size={18} />
                  <span>Execute</span>
                </button>
              </div>
            </div>

            {/* Active Search Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="font-mono text-xs text-[#554242] uppercase tracking-wider mr-1">
                Active Facets:
              </span>
              {activeFacets.map((facet, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffddb3] text-[#291800] font-mono text-xs"
                >
                  <span>{facet}</span>
                  <button
                    type="button"
                    onClick={() => removeFacet(facet)}
                    className="hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </span>
              ))}
              {activeFacets.length > 0 && (
                <button
                  type="button"
                  onClick={resetAllFacets}
                  className="text-[#540414] hover:underline font-mono text-xs uppercase tracking-wider ml-2 py-0.5 cursor-pointer font-semibold"
                >
                  Reset All ({activeFacets.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Scholarly Research Canvas: Sidebar + Main Stream */}
      <div className="w-full px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Facet Taxonomy Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6 bg-[#f9f2ed] p-5 rounded-2xl border border-[#ede7e2] shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#ede7e2]">
              <div className="flex items-center gap-2">
                <Icon name="tune" size={20} className="text-[#540414]" />
                <h2 className="font-serif text-base font-bold text-[#540414] tracking-wide">
                  Facet Taxonomy
                </h2>
              </div>
              <span className="font-mono text-xs text-[#805610] font-semibold">12,450 Hits</span>
            </div>

            {/* Facet Group 1: Document Type */}
            <div className="space-y-2">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#1d1b18]">
                Document Type
              </span>
              <div className="space-y-1.5 font-sans text-xs text-[#554242]">
                {[
                  { label: 'Rare Manuscripts', count: '4,120' },
                  { label: 'Speeches & Addresses', count: '640' },
                  { label: 'Official Letters & Corresp.', count: '2,910' },
                  { label: 'Periodicals & Newspapers', count: '1,580' },
                  { label: 'Legal Drafts & Bills', count: '890' },
                  { label: 'Archival Photographs', count: '3,200' },
                  { label: 'Sound & Gramophone Audio', count: '850' },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-[#ede7e2] cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={idx < 3}
                        className="accent-[#540414] rounded w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-[#1d1b18]">{item.label}</span>
                    </span>
                    <span className="font-mono text-[11px] text-[#805610]">{item.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Facet Group 2: Historical Era & Chronology Histogram */}
            <div className="space-y-2 pt-2 border-t border-[#ede7e2]">
              <div className="flex items-center justify-between font-sans text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#1d1b18]">
                  Era &amp; Chronology
                </span>
                <span className="font-mono text-[#540414] font-bold">1890–1960</span>
              </div>
              <div className="p-3 bg-[#f3ede7] rounded-xl space-y-2 border border-[#ede7e2]">
                <div className="flex items-end gap-1 h-10 w-full pt-1">
                  <div className="flex-1 bg-[#540414]/20 hover:bg-[#540414] h-[20%] rounded-t transition-all" title="1890-1900: 120 records"></div>
                  <div className="flex-1 bg-[#540414]/30 hover:bg-[#540414] h-[35%] rounded-t transition-all" title="1901-1910: 240 records"></div>
                  <div className="flex-1 bg-[#540414]/45 hover:bg-[#540414] h-[50%] rounded-t transition-all" title="1911-1920: 580 records"></div>
                  <div className="flex-1 bg-[#540414]/70 hover:bg-[#540414] h-[85%] rounded-t transition-all" title="1921-1930: 1,840 records"></div>
                  <div className="flex-1 bg-[#540414] h-[95%] rounded-t transition-all" title="1931-1940: 3,420 records"></div>
                  <div className="flex-1 bg-[#721d28] h-[100%] rounded-t transition-all" title="1941-1950: 4,680 records"></div>
                  <div className="flex-1 bg-[#540414]/60 hover:bg-[#540414] h-[70%] rounded-t transition-all" title="1951-1960: 1,570 records"></div>
                </div>
                <div className="flex justify-between font-mono text-[10px] text-[#554242]">
                  <span>1890</span>
                  <span>1925</span>
                  <span>1947</span>
                  <span>1960</span>
                </div>
              </div>
              <div className="space-y-1 text-xs font-sans text-[#554242]">
                {[
                  { label: 'Formative & Academic (1891–1923)', count: '712' },
                  { label: 'Social Movements & Mahad (1924–1935)', count: '2,140' },
                  { label: 'Round Table & Political (1930–1946)', count: '3,490' },
                  { label: 'Constitution Drafting (1947–1950)', count: '4,210' },
                  { label: 'Later Years & Legacy (1951–1956)', count: '1,898' },
                ].map((era, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-full text-left p-1.5 rounded hover:bg-[#ede7e2] transition-colors flex items-center justify-between text-[#1d1b18] cursor-pointer"
                  >
                    <span className="truncate">{era.label}</span>
                    <span className="font-mono text-[11px] text-[#805610]">{era.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Facet Group 3: Historical Figures */}
            <div className="space-y-2 pt-2 border-t border-[#ede7e2]">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#1d1b18]">
                Historical Figures
              </span>
              <div className="space-y-1.5 text-xs font-sans text-[#554242]">
                {[
                  { name: 'Dr. B. R. Ambedkar', count: '8,940', checked: true },
                  { name: 'Dr. Rajendra Prasad', count: '1,410', checked: false },
                  { name: 'Jawaharlal Nehru', count: '2,320', checked: false },
                  { name: 'Sardar Vallabhbhai Patel', count: '1,180', checked: false },
                  { name: 'Jyotirao Phule', count: '860', checked: false },
                ].map((fig, idx) => (
                  <label
                    key={idx}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-[#ede7e2] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={fig.checked}
                        className="accent-[#540414] rounded w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className={fig.checked ? 'text-[#540414] font-semibold' : 'text-[#1d1b18]'}>
                        {fig.name}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] text-[#805610]">{fig.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Facet Group 4: Geographic Provenance */}
            <div className="space-y-2 pt-2 border-t border-[#ede7e2]">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#1d1b18]">
                Geographic Provenance
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {[
                  'New Delhi (5,120)',
                  'Mumbai (4,890)',
                  'Mahad (920)',
                  'Pune (1,230)',
                  'London (740)',
                  'New York (460)',
                  'Nagpur (1,670)',
                ].map((g, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-[#f3ede7] font-mono text-[11px] text-[#1d1b18] hover:bg-[#540414] hover:text-white cursor-pointer transition-colors border border-[#ede7e2]"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Results Stream */}
          <section className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Stream Status & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#ede7e2] shadow-xs">
              <div className="flex items-center gap-2 text-sm font-sans">
                <span className="font-serif text-lg font-bold text-[#540414]">
                  {records.length} records shown
                </span>
                <span className="text-[#554242] font-mono text-xs">
                  (displaying matches 1–{records.length} in 32ms)
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={onOpenImageGen}
                  className="px-3 py-1.5 rounded bg-[#ffddb3] text-[#291800] hover:bg-[#fdc576] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Icon name="palette" size={16} />
                  <span>Synthesize Folio</span>
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1.5 rounded bg-[#f3ede7] hover:bg-[#ede7e2] text-[#1d1b18] transition-colors flex items-center gap-1 cursor-pointer border border-[#ede7e2]"
                >
                  <Icon name="download" size={16} />
                  <span>RIS / BibTeX</span>
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1.5 rounded bg-[#f3ede7] hover:bg-[#ede7e2] text-[#1d1b18] transition-colors flex items-center gap-1 cursor-pointer border border-[#ede7e2]"
                >
                  <Icon name="share" size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Document Cards List */}
            <div className="grid grid-cols-1 gap-6">
              {records.map((rec) => {
                const isAudioPlaying = activeAudioPlaying === rec.id;
                return (
                  <article
                    key={rec.id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden border border-[#ede7e2]"
                  >
                    {/* Left Accent Bar */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 group-hover:w-2 transition-all ${
                        rec.isUserGenerated
                          ? 'bg-[#fdc576]'
                          : rec.hasAudio
                          ? 'bg-[#805610]'
                          : 'bg-[#540414]'
                      }`}
                    ></div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Metadata Details (Col 9) */}
                      <div className="md:col-span-9 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {rec.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider font-semibold ${
                                tag.includes('VERIFIED')
                                  ? 'bg-[#bceecb] text-[#002e18]'
                                  : tag.includes('HIGH')
                                  ? 'bg-[#ffddb3] text-[#291800]'
                                  : tag.includes('RARE')
                                  ? 'bg-[#ffdada] text-[#40000c]'
                                  : 'bg-[#ede7e2] text-[#554242]'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="font-mono text-xs text-[#805610] ml-auto font-bold">
                            {rec.accessionId}
                          </span>
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#540414] tracking-tight group-hover:text-[#721d28] transition-colors">
                          <button
                            type="button"
                            onClick={() => handleOpenReader(rec)}
                            className="hover:underline text-left cursor-pointer"
                          >
                            {rec.title}
                          </button>
                        </h3>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[#554242]">
                          <span className="flex items-center gap-1">
                            <Icon name="calendar_today" size={15} className="text-[#805610]" />
                            {rec.dateStr}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="menu_book" size={15} className="text-[#805610]" />
                            {rec.documentType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="translate" size={15} className="text-[#805610]" />
                            {rec.languages.join(' & ')}
                          </span>
                          <span className="flex items-center gap-1 text-[#540414]">
                            <Icon name="account_balance" size={15} />
                            {rec.repository}
                          </span>
                        </div>

                        <p className="font-sans text-xs sm:text-sm text-[#554242] pt-1 leading-relaxed">
                          {rec.description}
                        </p>

                        {/* Audio Waveform preview if audio record */}
                        {rec.hasAudio && (
                          <div className="p-3 bg-[#f9f2ed] rounded-xl space-y-1.5 border border-[#ede7e2] my-2">
                            <div className="flex items-center justify-between font-mono text-[11px] text-[#554242]">
                              <span className="flex items-center gap-1 text-[#540414] font-semibold">
                                <Icon name="play_circle" size={16} />
                                Preview Sample ({rec.audioPreviewTime || '02:45 / 34:12'})
                              </span>
                              <span>Master Digitization Pitch: +0.02 Hz</span>
                            </div>
                            <div className="w-full h-7 flex items-center gap-0.5 overflow-hidden text-[#805610]">
                              {[
                                2, 3, 5, 7, 6, 4, 8, 5, 3, 2, 6, 7, 8, 4, 5, 2, 4, 7, 6, 3, 5, 7, 8,
                                5, 3, 2, 4, 6, 7, 2,
                              ].map((h, hIdx) => (
                                <span
                                  key={hIdx}
                                  className={`w-1 rounded-full transition-all ${
                                    isAudioPlaying
                                      ? 'bg-[#540414] animate-pulse'
                                      : 'bg-[#805610]/60'
                                  }`}
                                  style={{ height: `${h * 3.5}px` }}
                                ></span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions & Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleOpenReader(rec)}
                            className="px-4 py-2 rounded-lg bg-[#540414] text-white font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#721d28] transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Icon name="menu_book" size={16} />
                            <span>Open Reader</span>
                          </button>
                          <button
                            type="button"
                            onClick={onOpenChat}
                            className="px-3 py-2 rounded-lg bg-[#f3ede7] hover:bg-[#ede7e2] text-[#1d1b18] font-sans text-xs uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer border border-[#ede7e2]"
                          >
                            <Icon name="psychology" size={16} className="text-[#540414]" />
                            <span>AI Cite &amp; Extract</span>
                          </button>
                          {rec.hasAudio && (
                            <button
                              type="button"
                              onClick={() =>
                                setActiveAudioPlaying(isAudioPlaying ? null : rec.id)
                              }
                              className="px-3 py-2 rounded-lg bg-[#f3ede7] hover:bg-[#ede7e2] text-[#1d1b18] font-sans text-xs uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer border border-[#ede7e2]"
                            >
                              <Icon name={isAudioPlaying ? 'pause' : 'headphones'} size={16} className="text-[#805610]" />
                              <span>{isAudioPlaying ? 'Pause Audio' : 'Listen Recording'}</span>
                            </button>
                          )}
                          <span className="font-mono text-[11px] text-[#002e18] bg-[#bceecb] px-2 py-1 rounded ml-auto font-semibold">
                            OCR: {rec.ocrConfidence || '99.8%'}
                          </span>
                        </div>
                      </div>

                      {/* Archival Scan Thumbnail (Col 3) */}
                      <div className="md:col-span-3">
                        <div
                          onClick={() => handleOpenReader(rec)}
                          className="relative rounded-xl overflow-hidden shadow-xs bg-[#f3ede7] aspect-[3/4] flex items-center justify-center cursor-pointer border border-[#ede7e2]"
                        >
                          <img
                            src={rec.imageUrl}
                            alt={rec.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#540414]/85 via-transparent to-transparent flex items-end p-3">
                            <span className="font-mono text-xs text-white font-medium">
                              {rec.pagesCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="mt-8 p-4 bg-white rounded-xl shadow-xs border border-[#ede7e2] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="font-mono text-xs text-[#554242]">
                <span>
                  Displaying records <strong className="text-[#1d1b18]">1 – {records.length}</strong>{' '}
                  of <strong className="text-[#1d1b18]">12,450</strong>
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <button
                  type="button"
                  disabled
                  className="p-1.5 rounded text-[#554242] opacity-40 cursor-not-allowed"
                >
                  <Icon name="first_page" size={18} />
                </button>
                <button
                  type="button"
                  disabled
                  className="p-1.5 rounded text-[#554242] opacity-40 cursor-not-allowed"
                >
                  <Icon name="chevron_left" size={18} />
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded bg-[#540414] text-white font-bold flex items-center justify-center shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded hover:bg-[#f3ede7] text-[#1d1b18] flex items-center justify-center"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded hover:bg-[#f3ede7] text-[#1d1b18] flex items-center justify-center"
                >
                  3
                </button>
                <span className="px-1 text-[#554242]">…</span>
                <button
                  type="button"
                  className="w-8 h-8 rounded hover:bg-[#f3ede7] text-[#1d1b18] flex items-center justify-center"
                >
                  2075
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-[#f3ede7] text-[#1d1b18] cursor-pointer"
                >
                  <Icon name="chevron_right" size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#554242]">
                <span>Per page:</span>
                <select className="bg-[#f9f2ed] border border-[#ede7e2] text-[#1d1b18] rounded px-2 py-1 focus:outline-none">
                  <option>6 records</option>
                  <option>12 records</option>
                  <option>24 records</option>
                </select>
              </div>
            </div>

            {/* Institutional Research Notice Box */}
            <div className="p-6 bg-[#f3ede7] rounded-2xl border border-[#ede7e2] space-y-2">
              <div className="flex items-center gap-2 text-[#540414]">
                <Icon name="policy" size={22} />
                <h4 className="font-serif text-base font-semibold tracking-wide">
                  Scholarly Citation &amp; Public Access Mandate
                </h4>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#554242] leading-relaxed">
                All records cataloged within the Digital Heritage Archive are preserved under open
                access academic licenses for international scholarship. Direct API harvesting,
                High-Throughput Paleographic OCR batch processing, and federated SPARQL semantic
                endpoints are available via researcher credentials.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
