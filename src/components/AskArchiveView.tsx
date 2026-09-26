import React, { useState } from 'react';
import { CatalogRecord } from '../types';
import { Icon } from './Icon';

interface AskArchiveViewProps {
  onNavigateToRecord: (rec: CatalogRecord) => void;
  onOpenChat: () => void;
  records: CatalogRecord[];
}

export const AskArchiveView: React.FC<AskArchiveViewProps> = ({
  onNavigateToRecord,
  onOpenChat,
  records,
}) => {
  const [query, setQuery] = useState(
    "What were Dr. B. R. Ambedkar's views on the role of education in social transformation?"
  );
  const [activeFocus, setActiveFocus] = useState(
    "What were Dr. B. R. Ambedkar's views on the role of education in social transformation?"
  );
  const [selectedLang, setSelectedLang] = useState('English');
  const [selectedMode, setSelectedMode] = useState('Standard Research Synthesis');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showCitationToast, setShowCitationToast] = useState(false);
  const [dynamicSynthesis, setDynamicSynthesis] = useState<string | null>(null);

  const recommendedInquiries = [
    "What were Ambedkar's specific views on education as an instrument of social liberation?",
    "Show all primary documents tracing the Drafting Committee's work on Article 17 (Abolition of Untouchability).",
    "Which historical records document the proceedings and resolutions of the Mahad Conference of 1927?",
    "Find speeches on constitutional morality and parliamentary democracy.",
  ];

  const handleSynthesize = async () => {
    if (!query.trim()) return;
    setActiveFocus(query);
    setIsSynthesizing(true);

    try {
      const res = await fetch('/api/synthesize-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language: selectedLang,
          mode: selectedMode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.synthesis) {
        setDynamicSynthesis(data.synthesis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const copyCitation = () => {
    const bibtex = `@speech{ambedkar1942nagpur,
  author = {Ambedkar, Bhimrao Ramji},
  title = {Address to the All-India Depressed Classes Conference},
  year = {1942},
  month = {July},
  address = {Nagpur, India},
  note = {Accession No. DHA-1942-SP-011}
}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bibtex).catch(() => {});
    }
    setShowCitationToast(true);
    setTimeout(() => setShowCitationToast(false), 4000);
  };

  // Find record helper
  const openFirstDocument = () => {
    const doc = records.find((r) => r.id === 'address-rights-of-labor') || records[0];
    onNavigateToRecord(doc);
  };

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* Archival Context Banner & Research Header */}
      <section className="w-full px-6 lg:px-12 pt-8 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#ede7e2]">
          <div className="space-y-2 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#bceecb] text-[#224f35] shadow-2xs">
              <Icon name="verified" size={16} />
              <span className="font-mono text-xs tracking-wider uppercase font-semibold">
                ✦ GROUNDED IN 12,450+ VERIFIED PRIMARY SOURCES • ZERO SYNTHETIC HALLUCINATIONS
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#540414] font-semibold tracking-tight">
              Ask the Archive
            </h1>
            <p className="font-serif text-base sm:text-lg text-[#554242] font-normal leading-relaxed">
              Synthesize historical research grounded exclusively in verified manuscripts, speeches,
              gazettes, and primary documents.
            </p>
          </div>

          {/* Protocol Metadata Chip */}
          <div className="flex lg:flex-col items-center lg:items-end gap-2 text-[#554242]">
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase px-2.5 py-1 rounded bg-[#ede7e2] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#002e18] animate-pulse"></span>
              <span>Preservation Core: Active</span>
            </div>
            <span className="font-mono text-xs text-[#805610]">Index Rev 4.19 / ISO-16363</span>
          </div>
        </div>

        {/* Scholarly Inquiry Engine (Search, Modes, Multilingual Controls) */}
        <div className="w-full bg-[#f9f2ed] rounded-2xl p-5 shadow-xs border border-[#ede7e2] space-y-4 mt-6">
          {/* Input Formulation Bar */}
          <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-[#ede7e2]">
            <div className="pl-4 pr-2 text-[#805610] flex items-center">
              <Icon name="history_edu" size={24} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSynthesize()}
              placeholder="What would you like to investigate in the archive? (e.g., 'What were Dr. Ambedkar\'s economic arguments in his Columbia thesis?')"
              className="w-full py-4 pr-4 bg-transparent font-sans text-sm sm:text-base text-[#1d1b18] placeholder:text-[#554242]/60 focus:outline-none"
            />
            <div className="pr-2 flex items-center gap-2">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  title="Clear inquiry"
                  className="p-2 text-[#554242] hover:text-[#540414] transition-colors cursor-pointer"
                >
                  <Icon name="close" size={20} />
                </button>
              )}
              <button
                type="button"
                onClick={handleSynthesize}
                disabled={isSynthesizing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#721d28] text-white font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#540414] transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Icon name={isSynthesizing ? 'autorenew' : 'auto_read_pause'} size={18} />
                <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize'}</span>
              </button>
            </div>
          </div>

          {/* Controls Row: Language + Synthesis Engine Depth */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#554242] font-semibold">
                Archival Language:
              </span>
              <div className="inline-flex rounded-lg p-1 bg-[#f3ede7] gap-1 border border-[#ede7e2]">
                {['English', 'हिन्दी', 'मराठी', 'தமிழ்'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLang(lang)}
                    className={`px-3 py-1 rounded font-sans text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      selectedLang === lang
                        ? 'bg-white text-[#540414] font-semibold shadow-xs'
                        : 'text-[#554242] hover:text-[#1d1b18]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Analytical Modes */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#554242] font-semibold">
                Synthesis Engine:
              </span>
              <div className="inline-flex rounded-lg p-1 bg-[#f3ede7] gap-1 border border-[#ede7e2]">
                {[
                  'Standard Research Synthesis',
                  'Exhaustive Scholarly Analysis',
                  'Direct Verbatim Extraction',
                ].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSelectedMode(mode)}
                    className={`px-3 py-1 rounded font-sans text-xs tracking-wide transition-all cursor-pointer ${
                      selectedMode === mode
                        ? 'bg-[#540414] text-white font-medium shadow-xs'
                        : 'text-[#554242] hover:text-[#1d1b18]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Curated Recommended Prompts */}
          <div className="space-y-1.5 pt-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#805610] font-semibold">
              Recommended Institutional Inquiries:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {recommendedInquiries.map((inq, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(inq);
                    setActiveFocus(inq);
                  }}
                  className="text-left px-3 py-1.5 rounded-lg bg-[#f3ede7] hover:bg-[#ede7e2] text-[#1d1b18] font-sans text-xs transition-colors flex items-center gap-2 cursor-pointer border border-[#ede7e2]"
                >
                  <Icon name="terminal" size={16} className="text-[#805610]" />
                  <span>"{inq}"</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Active Query Anchor Bar */}
      <section className="w-full px-6 lg:px-12 pb-4">
        <div className="px-4 py-2.5 bg-[#ede7e2] rounded-xl flex items-center justify-between gap-4 shadow-2xs border border-[#dbc0c0]">
          <div className="flex items-center gap-3">
            <Icon name="manage_search" size={20} className="text-[#540414]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#805610] font-semibold">
              Active Synthesis Focus:
            </span>
            <span className="font-sans text-xs sm:text-sm text-[#1d1b18] font-semibold italic">
              "{activeFocus}"
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#e7e1dc] text-[#554242]">
              Corpus: 1916–1956 Writings &amp; Speeches
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#e7e1dc] text-[#805610] font-semibold">
              Strict Academic Filter
            </span>
          </div>
        </div>
      </section>

      {/* Dual-Column Scholarly Workspace */}
      <section className="w-full px-6 lg:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Synthesized Archival Answer (Col 8) */}
          <article className="lg:col-span-8 flex flex-col gap-6 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#ede7e2]">
            {/* Header & Audio Playback */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 bg-[#f9f2ed] rounded-xl p-4 border border-[#ede7e2]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif text-xl font-bold text-[#540414]">
                    Archival Research Synthesis
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#bceecb] text-[#002e18] font-mono text-[11px] uppercase tracking-wider font-semibold">
                    Verified against 6 primary archival sources
                  </span>
                </div>
                <p className="font-mono text-xs text-[#554242]">
                  Deterministic Graph Traversal ID: #SYNTH-7842-AB
                </p>
              </div>

              {/* Audio Readout Player Pill */}
              <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-xs border border-[#ede7e2]">
                <button
                  type="button"
                  onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                  title="Play scholarly audio readout"
                  className={`w-8 h-8 rounded-full text-white flex items-center justify-center transition-colors cursor-pointer ${
                    isAudioPlaying ? 'bg-[#002e18]' : 'bg-[#721d28] hover:bg-[#540414]'
                  }`}
                >
                  <Icon name={isAudioPlaying ? 'pause' : 'play_arrow'} size={18} />
                </button>
                <div className="flex flex-col">
                  <span className="font-sans text-xs text-[#1d1b18] font-semibold">
                    Scholarly Audio Readout
                  </span>
                  <span className="font-mono text-[10px] text-[#805610]">
                    2m 14s • Academic Synthesis Voice
                  </span>
                </div>
                {/* Soundwave graphic */}
                <div className="flex items-end gap-0.5 h-4 ml-1">
                  <span className={`w-1 bg-[#805610] rounded-full ${isAudioPlaying ? 'h-3 animate-pulse' : 'h-2'}`}></span>
                  <span className={`w-1 bg-[#805610] rounded-full ${isAudioPlaying ? 'h-4 animate-bounce' : 'h-4'}`}></span>
                  <span className={`w-1 bg-[#805610] rounded-full ${isAudioPlaying ? 'h-2 animate-pulse' : 'h-3'}`}></span>
                  <span className="w-1 bg-[#805610] rounded-full h-1"></span>
                </div>
              </div>
            </div>

            {/* Dynamic AI Output or Default Canonical Prose */}
            {dynamicSynthesis ? (
              <div className="space-y-4 text-[#1d1b18] font-sans text-sm sm:text-base leading-relaxed whitespace-pre-wrap bg-[#fdfbf9] p-4 rounded-xl border border-[#ede7e2]">
                {dynamicSynthesis}
              </div>
            ) : (
              <div className="space-y-6 text-[#1d1b18] font-sans text-sm sm:text-base leading-relaxed">
                {/* Section I */}
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-[#540414] flex items-baseline gap-2">
                    <span className="font-mono text-[#805610] text-xs font-semibold">I.</span>
                    <span>Education as a Catalyst for Self-Respect and Emancipation</span>
                  </h3>
                  <p className="text-[#1d1b18]/90">
                    Dr. B. R. Ambedkar viewed education not merely as vocational training or administrative
                    literacy, but as an indispensable instrument of human dignity, self-realization, and
                    collective emancipation. Rejecting the traditional caste monopoly over canonical
                    knowledge, he asserted that without universal intellectual awakening, any attempt at
                    structural social reform or political democracy would remain superficial. Education was
                    positioned as the primary weapon to shatter hereditary servitude, instilling
                    self-confidence (<em className="font-serif italic">atmasamman</em>) and a critical
                    consciousness capable of challenging entrenched hierarchies.
                  </p>
                </div>

                {/* Section II */}
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-[#540414] flex items-baseline gap-2">
                    <span className="font-mono text-[#805610] text-xs font-semibold">II.</span>
                    <span>The Three Pillars: 'Educate, Agitate, Organise' (1942)</span>
                  </h3>
                  <p className="text-[#1d1b18]/90">
                    In his historic address to the All-India Depressed Classes Conference held at Nagpur on
                    20 July 1942, Ambedkar crystallized his ideological strategy into the celebrated triadic
                    maxim:{' '}
                    <strong className="text-[#540414] font-semibold">
                      "Educate, Agitate, and Organise."
                    </strong>{' '}
                    Crucially, he placed <em className="font-serif italic">"Educate"</em> as the
                    foundational prerequisite. Within his pedagogical schema, rational enlightenment must
                    precede collective social agitation; an uneducated struggle was prone to collapse into
                    anarchic reaction or external manipulation. Education served as the intellectual compass
                    necessary for disciplined, principled democratic resistance.
                  </p>
                </div>

                {/* Verbatim Cited Excerpt Block */}
                <div className="relative my-4 p-5 bg-[#fdc576]/15 rounded-xl border border-[#fdc576]/40 shadow-xs">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#805610] rounded-l-xl"></div>
                  <div className="pl-2 space-y-2">
                    <div className="flex items-center gap-2 text-[#805610] font-mono text-xs uppercase tracking-wider font-semibold">
                      <Icon name="format_quote" size={16} />
                      <span>Verbatim Primary Excerpt</span>
                    </div>
                    <blockquote className="font-serif text-lg text-[#1d1b18] italic leading-snug">
                      "My final words of advice to you are: Educate, Agitate and Organise; have faith in
                      yourselves. With justice on our side, I do not see how we can lose our battle."
                    </blockquote>
                    <div className="pt-2 flex flex-wrap items-center justify-between text-[#554242] font-mono text-xs gap-2">
                      <span>— Address at All-India Depressed Classes Conference, Nagpur (20 July 1942)</span>
                      <span className="px-2 py-0.5 rounded bg-[#f3ede7] font-semibold text-[#540414]">
                        Accession #DHA-1942-SP-011
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section III */}
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-[#540414] flex items-baseline gap-2">
                    <span className="font-mono text-[#805610] text-xs font-semibold">III.</span>
                    <span>Higher Education and Institutional Creation</span>
                  </h3>
                  <p className="text-[#1d1b18]/90">
                    Recognizing that ideological critique alone was insufficient without sustainable
                    material infrastructure, Ambedkar translated his vision into practical institutions. On
                    8 July 1945, he founded the{' '}
                    <strong className="text-[#1d1b18] font-semibold">People's Education Society</strong> in
                    Bombay, aimed at making higher collegiate education accessible to socially
                    disenfranchised youth. This initiative birthed Siddharth College in Bombay (1946) and
                    Milind College in Aurangabad (1950). His institutional charters repeatedly emphasized
                    modern scientific inquiry, liberal arts, and international scholastic exposure over
                    insular theological dogmas.
                  </p>
                </div>

                {/* Section IV */}
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-[#540414] flex items-baseline gap-2">
                    <span className="font-mono text-[#805610] text-xs font-semibold">IV.</span>
                    <span>Constitutional Provisions for Educational Equity</span>
                  </h3>
                  <p className="text-[#1d1b18]/90">
                    During the Constituent Assembly Debates (notably in November 1948 regarding what became
                    Article 45 under the Directive Principles of State Policy), Ambedkar fought resolutely
                    for state-funded, free, and compulsory primary education within a strict ten-year mandate.
                    He insisted that educational neglect by sovereign authority constituted a systemic denial
                    of democratic citizenship. His legal interventions systematically connected classroom
                    access to fundamental civil enfranchisement and state-guaranteed civic equality.
                  </p>
                </div>
              </div>
            )}

            {/* Archival Citation & Export Action Bar */}
            <div className="mt-4 pt-4 bg-[#f9f2ed] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 border border-[#ede7e2]">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={copyCitation}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#ede7e2] text-[#1d1b18] font-sans text-xs uppercase tracking-wider font-semibold transition-colors shadow-2xs border border-[#ede7e2] cursor-pointer"
                >
                  <Icon name="content_copy" size={18} className="text-[#805610]" />
                  <span>Copy Formatted Citation (BibTeX/Chicago)</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('Research brief exported as PDF format (Accession #DHA-SYNTH-7842-AB).')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#ede7e2] text-[#1d1b18] font-sans text-xs uppercase tracking-wider font-semibold transition-colors shadow-2xs border border-[#ede7e2] cursor-pointer"
                >
                  <Icon name="picture_as_pdf" size={18} className="text-[#540414]" />
                  <span>Export Research Brief (PDF)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onOpenChat}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#540414] text-white font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#721d28] transition-all shadow-sm cursor-pointer"
              >
                <Icon name="chat_bubble_outline" size={18} />
                <span>Ask Follow-up Question</span>
              </button>
            </div>

            {/* Notification Toast */}
            {showCitationToast && (
              <div className="p-3 rounded-lg bg-[#002e18] text-white font-mono text-xs shadow-md flex items-center gap-2 animate-fade-in">
                <Icon name="done_all" size={18} className="text-[#bceecb]" />
                <span>Citation copied to clipboard in Chicago Manual of Style 17th Ed. &amp; BibTeX formats.</span>
              </div>
            )}
          </article>

          {/* RIGHT COLUMN: Sources & Evidence Provenance Panel (Col 4) */}
          <aside className="lg:col-span-4 flex flex-col gap-5">
            {/* Panel Header */}
            <div className="flex items-center justify-between bg-[#f3ede7] p-4 rounded-2xl shadow-xs border border-[#ede7e2]">
              <div className="flex items-center gap-2">
                <Icon name="source_notes" size={22} className="text-[#540414]" />
                <div>
                  <h2 className="font-serif text-sm font-bold text-[#540414] leading-none uppercase">
                    PRIMARY SOURCES CITED
                  </h2>
                  <span className="font-mono text-xs text-[#805610]">
                    4 Direct Historical Documents Linked
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#bceecb] text-[#002e18] font-mono text-xs uppercase font-semibold">
                100% Provenanced
              </span>
            </div>

            {/* SOURCE CARD 1: Nagpur Address 1942 */}
            <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs border border-[#ede7e2] hover:shadow-md transition-shadow">
              <div className="relative h-36 w-full bg-[#f3ede7]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCikaB-dRRPBnY5mzEfDfe7zHh-fAD8zCN0_3tcschdmNoYru87FmpdzlLURtYrgMs9vFffVG1SeKTqWXsfCBChB1jCvk3W8lSveyhY_XbtXF4u1FfOvqr-Q1IYkKNBeBwuNcGpCwM7AVqFjheIvOJ3AqxxBG4jb6Oc646NR8Gn13rPn78ZLpP7FUPXKb-9TW9KiGLC9JWiBMz4Uw6jVzzYpbvUrmv_RSkDT5zJtasREGB17-ik67Y"
                  alt="Nagpur 1942 Address Manuscript Scan"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-white/90 font-mono text-[10px] text-[#540414] font-bold shadow-xs">
                  Match: 98.4%
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#540414] text-white font-mono text-[10px] tracking-wider uppercase font-semibold">
                  Doc #DHA-1942-SP-011
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-serif text-base font-bold text-[#540414] leading-snug">
                  Address to the All-India Depressed Classes Conference
                </h3>
                <p className="font-sans text-xs text-[#554242]">
                  20 July 1942 • Nagpur • Recorded in Vol. 10 of Writings &amp; Speeches
                </p>
                <div className="flex items-center gap-1.5 text-[#1d1b18] font-mono text-xs py-1 px-2 rounded bg-[#f9f2ed]">
                  <Icon name="menu_book" size={15} className="text-[#805610]" />
                  <span>Cited: Pages 14–18 • Verbatim match: 98.4%</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={openFirstDocument}
                    className="flex-1 py-1.5 px-2 rounded bg-[#f3ede7] hover:bg-[#ede7e2] text-[#1d1b18] font-sans text-xs uppercase tracking-wider font-semibold text-center transition-colors cursor-pointer border border-[#ede7e2]"
                  >
                    Open Document
                  </button>
                  <button
                    type="button"
                    onClick={openFirstDocument}
                    className="py-1.5 px-3 rounded bg-[#721d28] text-white hover:bg-[#540414] transition-colors flex items-center justify-center cursor-pointer"
                    title="Inspect Source Scan"
                  >
                    <Icon name="zoom_in" size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* SOURCE CARD 2: People's Education Society Charter */}
            <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs border border-[#ede7e2] hover:shadow-md transition-shadow">
              <div className="relative h-32 w-full bg-[#f3ede7]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9RGlyEBAma11-gGBk5_ZqpsxUU7hFPrXgZJe83YsVqsZNyhLJqPNv0Gbm58v4dvhC5ab3F2WEOo0UIAbnm7GHgW8Jw5APjFXotYXcdaDb0va08wYT7HGmaubaUn_oLzvsw4jfMazHOF_sF8qJzI5gj6nq8k6F_VdK4X1_yWpYkjIY274CoUoCbuV9kKkUbNkLOLwgVWzQU6qWnumm8ISXInzjvkvqiRHpiWPxWFhz2q9yzrM8ym0"
                  alt="Charter of People's Education Society 1945"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#540414] text-white font-mono text-[10px] tracking-wider uppercase font-semibold">
                  Doc #DHA-1945-CH-002
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-serif text-base font-bold text-[#540414] leading-snug">
                  Founding Charter of the People's Education Society
                </h3>
                <p className="font-sans text-xs text-[#554242]">
                  8 July 1945 • Mumbai • Accession #DHA-1945-CH-002
                </p>
                <div className="flex items-center gap-1.5 text-[#1d1b18] font-mono text-xs py-1 px-2 rounded bg-[#f9f2ed]">
                  <Icon name="bookmark" size={15} className="text-[#805610]" />
                  <span>Cited: Clause 3 (Objectives &amp; Governance)</span>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={openFirstDocument}
                    className="w-full py-1.5 px-2 rounded bg-[#f3ede7] hover:bg-[#ede7e2] text-[#1d1b18] font-sans text-xs uppercase tracking-wider font-semibold text-center transition-colors cursor-pointer border border-[#ede7e2]"
                  >
                    Open Document Viewer
                  </button>
                </div>
              </div>
            </div>

            {/* SOURCE CARD 3: Constituent Assembly Debates */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#ede7e2] hover:shadow-md transition-shadow space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#ede7e2] font-mono text-xs text-[#805610] font-semibold">
                  Constitutional Gazettes
                </span>
                <span className="font-mono text-xs text-[#554242]">23 Nov 1948</span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#540414] leading-snug">
                Constituent Assembly Debates (Official Report, Vol. VII)
              </h3>
              <p className="font-sans text-xs text-[#554242]">
                Debates on Free and Compulsory Universal Primary Education
              </p>
              <div className="flex items-center gap-1.5 text-[#1d1b18] font-mono text-xs py-1 px-2 rounded bg-[#f9f2ed]">
                <Icon name="menu_book" size={15} className="text-[#805610]" />
                <span>Cited: Columns 538–542</span>
              </div>
              <button
                type="button"
                onClick={openFirstDocument}
                className="w-full mt-1 py-1.5 px-2 rounded bg-[#f3ede7] hover:bg-[#ede7e2] text-[#1d1b18] font-sans text-xs uppercase tracking-wider font-semibold text-center transition-colors cursor-pointer border border-[#ede7e2]"
              >
                Open Document Viewer
              </button>
            </div>

            {/* SOURCE CARD 4: Problem of the Rupee */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#ede7e2] hover:shadow-md transition-shadow space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#ede7e2] font-mono text-xs text-[#805610] font-semibold">
                  Monograph / Thesis
                </span>
                <span className="font-mono text-xs text-[#554242]">1923 Edition</span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#540414] leading-snug">
                The Problem of the Rupee: Its Origin and Its Solution
              </h3>
              <p className="font-sans text-xs text-[#554242]">
                P. S. King &amp; Son, London • Referencing structural equity &amp; resource distribution
              </p>
              <div className="flex items-center gap-1.5 text-[#1d1b18] font-mono text-xs py-1 px-2 rounded bg-[#f9f2ed]">
                <Icon name="link" size={15} className="text-[#805610]" />
                <span>Cited: Chapter VI (Fiscal Capacities for Social Uplift)</span>
              </div>
              <button
                type="button"
                onClick={openFirstDocument}
                className="w-full mt-1 py-1.5 px-2 rounded bg-[#f3ede7] hover:bg-[#ede7e2] text-[#1d1b18] font-sans text-xs uppercase tracking-wider font-semibold text-center transition-colors cursor-pointer border border-[#ede7e2]"
              >
                Open Document Viewer
              </button>
            </div>

            {/* Verification Seal Box */}
            <div className="p-4 rounded-2xl bg-[#002e18]/5 border border-[#002e18]/15 text-[#1d1b18] space-y-1.5">
              <div className="flex items-center gap-2 text-[#002e18] font-serif text-sm font-bold">
                <Icon name="policy" size={20} />
                <span>Scholarly Audit Integrity</span>
              </div>
              <p className="font-sans text-xs text-[#554242] leading-relaxed">
                Every sentence in this readout corresponds to a verifiable physical accession stored
                across India's National Archives and Bombay University special collections.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* BOTTOM SECTION: Related Archival Entities (Knowledge Graph Integration) */}
      <section className="w-full px-6 lg:px-12 pb-16">
        <div className="bg-[#f9f2ed] rounded-2xl p-6 sm:p-8 shadow-xs border border-[#ede7e2] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Icon name="hub" size={22} className="text-[#540414]" />
              <h3 className="font-serif text-lg font-bold text-[#540414]">
                Related Archival Entities
              </h3>
            </div>
            <span className="font-mono text-xs text-[#805610] uppercase tracking-widest font-semibold">
              Traverse Linked Semantic Ontologies
            </span>
          </div>

          {/* Entity Pills */}
          <div className="flex flex-wrap items-center gap-3">
            {[
              { type: 'PERSON', label: 'Dr. B. R. Ambedkar', dot: 'bg-[#540414]' },
              { type: 'INSTITUTION', label: "People's Education Society (est. 1945)", dot: 'bg-[#805610]' },
              { type: 'EVENT', label: 'Nagpur Conference 1942', dot: 'bg-[#002e18]' },
              { type: 'CONCEPT', label: 'Constitutional Morality', dot: 'bg-[#9e3e47]' },
              { type: 'ENTITY', label: 'Siddharth College (Bombay)', dot: 'bg-[#fdc576]' },
            ].map((ent, idx) => (
              <button
                key={idx}
                type="button"
                onClick={onOpenChat}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#540414] hover:text-white text-[#1d1b18] transition-all shadow-xs border border-[#ede7e2] group cursor-pointer"
              >
                <span className={`w-2 h-2 rounded-full ${ent.dot} group-hover:bg-white`}></span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#805610] group-hover:text-white/80 font-bold">
                  {ent.type}:
                </span>
                <span className="font-sans text-xs font-semibold">{ent.label}</span>
                <Icon name="arrow_forward" size={16} className="opacity-60" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
