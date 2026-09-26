import React, { useState } from 'react';
import { CatalogRecord } from '../types';
import { Icon } from './Icon';

interface ReaderViewProps {
  record: CatalogRecord;
  onNavigateToCatalog: () => void;
  onOpenChat: () => void;
  onOpenImageGen: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  record,
  onNavigateToCatalog,
  onOpenChat,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [ocrVisible, setOcrVisible] = useState(true);
  const [isInverted, setIsInverted] = useState(false);
  const [activeTab, setActiveTab] = useState<'ocr' | 'trans' | 'prov' | 'cite'>('ocr');
  const [selectedTermLang, setSelectedTermLang] = useState('English');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(23);
  const totalPages = 74;

  const handleZoomIn = () => {
    if (zoomLevel < 200) setZoomLevel((z) => Math.min(200, z + 15));
  };

  const handleZoomOut = () => {
    if (zoomLevel > 60) setZoomLevel((z) => Math.max(60, z - 15));
  };

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const handleCopyVerbatim = () => {
    const text = `PART III — FUNDAMENTAL RIGHTS
Article 14. Equality before law. — The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.
Article 15. Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth. —
(1) The State shall not discriminate against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them.
(2) No citizen shall, on grounds only of religion, race, caste, sex, place of birth or any of them, be subject to any disability, liability, restriction or condition with regard to—
(a) access to shops, public restaurants, hotels and places of public entertainment; or
(b) the use of wells, tanks, bathing ghats, roads and places of public resort maintained wholly or partly out of State funds or dedicated to the use of the general public.

Marginal Autograph Annotation:
“Approved with amendment to include non-discrimination on grounds of birth or place.” — B. R. Ambedkar, Ch.`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col w-full animate-fade-in bg-[#fff8f3]">
      {/* Scholarly Control Appbar */}
      <div className="w-full bg-[#f3ede7] px-6 lg:px-12 py-3 border-b border-[#ede7e2] shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 max-w-7xl mx-auto w-full">
          {/* Breadcrumb & Accession Record Tag */}
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <button
              onClick={onNavigateToCatalog}
              className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-wider text-[#540414] hover:text-[#721d28] font-semibold transition-colors cursor-pointer"
            >
              <Icon name="arrow_back" size={16} />
              <span>Return to Catalog Search</span>
            </button>
            <span className="text-[#554242]/30 select-none">|</span>
            <div className="inline-flex items-center gap-2 bg-[#ede7e2] px-2.5 py-1 rounded-md border border-[#dbc0c0]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#805610]"></span>
              <span className="font-mono text-xs text-[#1d1b18] uppercase tracking-wider font-semibold">
                RECORD #{record.accessionId || 'DHA-1948-CONST-0042'}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#721d28] bg-[#ffdada] px-1.5 py-0.5 rounded font-bold">
                RESTRICTED HIGH RES SCHOLARLY ACCESS
              </span>
            </div>
          </div>

          {/* Action Cluster */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#1d1b18] hover:bg-[#ede7e2] transition-colors font-sans text-xs border border-[#ede7e2] cursor-pointer"
            >
              <Icon name="museum" size={16} className="text-[#805610]" />
              <span>Source Archive</span>
            </button>
            <a
              href={record.imageUrl}
              download={`${record.accessionId}.png`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#1d1b18] hover:bg-[#ede7e2] transition-colors font-sans text-xs border border-[#ede7e2] cursor-pointer"
            >
              <Icon name="download" size={16} className="text-[#805610]" />
              <span>Download PDF (600 DPI)</span>
            </a>
            <button
              type="button"
              onClick={handleCopyVerbatim}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#1d1b18] hover:bg-[#ede7e2] transition-colors font-sans text-xs border border-[#ede7e2] cursor-pointer"
            >
              <Icon name="format_quote" size={16} className="text-[#805610]" />
              <span>{copied ? 'Citation Copied!' : 'Export Citation'}</span>
            </button>
            <button
              type="button"
              onClick={onOpenChat}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#540414] text-white font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#721d28] transition-all shadow-xs cursor-pointer"
            >
              <Icon name="psychology" size={16} />
              <span>AI Analyze</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Scholarly Split-View Workspace (58% / 42%) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-10rem)] border-b border-[#ede7e2]">
        {/* LEFT PANEL: Scan Canvas & Micro-Viewport (Col 7) */}
        <div className="lg:col-span-7 flex flex-col bg-white border-r border-[#ede7e2] relative">
          {/* Document Viewer Master Toolbar */}
          <div className="w-full bg-[#f9f2ed] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs select-none border-b border-[#ede7e2]">
            {/* Optical Zoom & Transform Suite */}
            <div className="flex items-center bg-white rounded-lg p-0.5 gap-0.5 border border-[#ede7e2]">
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out"
                className="p-1.5 text-[#554242] hover:text-[#1d1b18] hover:bg-[#f3ede7] rounded transition-colors cursor-pointer"
              >
                <Icon name="zoom_out" size={18} />
              </button>
              <span className="font-mono text-xs px-2 text-[#1d1b18] font-semibold min-w-[3.5rem] text-center">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In"
                className="p-1.5 text-[#554242] hover:text-[#1d1b18] hover:bg-[#f3ede7] rounded transition-colors cursor-pointer"
              >
                <Icon name="zoom_in" size={18} />
              </button>
              <div className="w-px h-4 bg-[#ede7e2] mx-0.5"></div>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                title="Fit to Page"
                className="p-1.5 text-[#554242] hover:text-[#1d1b18] hover:bg-[#f3ede7] rounded transition-colors cursor-pointer"
              >
                <Icon name="aspect_ratio" size={18} />
              </button>
              <button
                type="button"
                onClick={handleRotate}
                title="Rotate 90°"
                className="p-1.5 text-[#554242] hover:text-[#1d1b18] hover:bg-[#f3ede7] rounded transition-colors cursor-pointer"
              >
                <Icon name="rotate_right" size={18} />
              </button>
            </div>

            {/* Archival Folio Navigator */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                title="Previous Page"
                className="p-1 text-[#554242] hover:text-[#540414] rounded transition-colors cursor-pointer"
              >
                <Icon name="chevron_left" size={20} />
              </button>
              <span className="font-mono text-xs text-[#1d1b18] font-medium">
                Page <span className="text-[#540414] font-bold">{currentPage}</span> of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                title="Next Page"
                className="p-1 text-[#554242] hover:text-[#540414] rounded transition-colors cursor-pointer"
              >
                <Icon name="chevron_right" size={20} />
              </button>
            </div>

            {/* Forensic Layer Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setOcrVisible(!ocrVisible)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-all cursor-pointer border ${
                  ocrVisible
                    ? 'bg-[#ffddb3] text-[#291800] border-[#805610]/40'
                    : 'bg-white text-[#554242] border-[#ede7e2]'
                }`}
              >
                <Icon name="view_in_ar" size={14} />
                <span>OCR Bounding Boxes: {ocrVisible ? 'ON' : 'OFF'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsInverted(!isInverted)}
                title="Invert Contrast (Archival Negative Scan)"
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors cursor-pointer border ${
                  isInverted
                    ? 'bg-[#540414] text-white border-[#540414]'
                    : 'bg-white text-[#554242] border-[#ede7e2] hover:bg-[#ede7e2]'
                }`}
              >
                <Icon name="tonality" size={14} />
                <span>Negative</span>
              </button>
            </div>
          </div>

          {/* Scanned Folio Surface & Specimen Canvas */}
          <div className="flex-1 w-full bg-[#dfd9d4]/40 overflow-auto p-4 md:p-8 flex items-center justify-center relative select-none">
            {/* Physical Parchment Simulation Container */}
            <div
              className={`relative w-full max-w-[620px] shadow-2xl bg-[#f5ecdc] text-[#2c221a] p-6 sm:p-10 transition-all duration-300 ease-out origin-center border border-[#c8b496] rounded-xs ${
                isInverted ? 'filter invert hue-rotate-180 contrast-125' : ''
              }`}
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              }}
            >
              {/* Archival Paper Aging Vignette Texture Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#b89569]/15 via-transparent to-[#8a6840]/25 mix-blend-multiply rounded-xs"></div>

              {/* Physical Folio Header Plate */}
              <div className="flex justify-between items-start border-b border-[#c8b496] pb-3 mb-5">
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] tracking-widest text-[#7a5b3a] uppercase font-bold">
                    CONSTITUENT ASSEMBLY OF INDIA
                  </span>
                  <span className="font-mono text-[9px] text-[#8e7456] tracking-wider">
                    DRAFTING COMMITTEE REPORT — CONFIDENTIAL FOLIO
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] font-bold text-[#55361d]">
                    CA/DRAFT/NOV-48
                  </span>
                  <div className="font-mono text-[9px] text-[#8e7456]">LEAF NO. XXIII</div>
                </div>
              </div>

              {/* Document High-Res Scan Asset */}
              <div className="relative mb-5 rounded overflow-hidden shadow-inner bg-[#ece1cc] border border-[#c8b496]/50">
                <img
                  src={record.imageUrl}
                  alt={record.title}
                  className="w-full h-44 object-cover filter contrast-105 opacity-90"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-white/90 font-mono text-[9px] uppercase tracking-widest text-[#540414] font-semibold">
                  600 DPI Master Plate Reference
                </div>
              </div>

              {/* Typeset Mechanical Text Specimen with OCR Overlay Boxes */}
              <div className="space-y-4 relative font-mono text-[12px] sm:text-[13px] leading-relaxed text-[#271d15]">
                {/* Section 14 */}
                <div className="relative">
                  <p className="uppercase font-bold tracking-wider text-[#3d2a1a] mb-1">
                    PART III — FUNDAMENTAL RIGHTS
                  </p>
                  <div className="relative inline-block w-full">
                    {/* Word OCR Bounding Box Layer */}
                    {ocrVisible && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[0px] left-[0px] w-64 h-5 border border-[#540414]/50 bg-[#540414]/10 rounded-[1px]"></div>
                        <div className="absolute top-[20px] left-[0px] w-[95%] h-10 border border-[#805610]/60 bg-[#805610]/15 rounded-[1px]"></div>
                      </div>
                    )}
                    <p className="leading-[1.6rem]">
                      <strong className="text-[#1a120c] font-bold">
                        Article 14. Equality before law.
                      </strong>{' '}
                      — The State shall not deny to any person equality before the law or the equal
                      protection of the laws within the territory of India.
                    </p>
                  </div>
                </div>

                {/* Section 15 */}
                <div className="relative pt-1">
                  <div className="relative inline-block w-full">
                    {ocrVisible && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[0px] left-[0px] w-full h-6 border border-[#805610]/50 bg-[#805610]/10 rounded-[1px]"></div>
                        <div className="absolute top-[24px] left-[15px] w-[90%] h-12 border border-[#540414]/50 bg-[#540414]/10 rounded-[1px]"></div>
                      </div>
                    )}
                    <p className="leading-[1.6rem]">
                      <strong className="text-[#1a120c] font-bold">
                        Article 15. Prohibition of discrimination on grounds of religion, race,
                        caste, sex or place of birth.
                      </strong>{' '}
                      —
                      <br />
                      (1) The State shall not discriminate against any citizen on grounds only of
                      religion, race, caste, sex, place of birth or any of them.
                    </p>
                  </div>
                </div>

                {/* Historical Marginalia by Dr. B. R. Ambedkar */}
                <div className="relative mt-6 pt-4 border-t border-dashed border-[#bfa583] flex items-start gap-3">
                  <Icon name="edit_note" size={22} className="text-[#721d28] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#721d28]">
                        Marginal Autograph Annotation
                      </span>
                      <span className="font-mono text-[9px] text-[#7a6550]">
                        • Blue Fountain Pen (Waterman Ink)
                      </span>
                    </div>
                    {/* Cursive Handwriting Representation */}
                    <div className="font-serif italic text-base sm:text-lg text-[#1b2b46] leading-snug tracking-wide bg-[#f1e6d4] p-3 rounded-lg shadow-inner border border-[#c8b496]/50">
                      “Approved with amendment to include non-discrimination on grounds of birth or place.”
                    </div>
                    <div className="text-right mt-1">
                      <span className="font-mono text-[11px] font-bold text-[#1b2b46] tracking-wider">
                        — B. R. Ambedkar, Ch.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Embossed Wax Archival Seal Replica */}
              <div className="mt-8 pt-4 flex items-center justify-between border-t border-[#c8b496]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#721d28] shadow-md flex items-center justify-center text-[#ffddb3] border-2 border-[#ffddb3]/50 p-1">
                    <div className="w-full h-full rounded-full border border-dashed border-[#ffddb3]/60 flex flex-col items-center justify-center text-center">
                      <Icon name="assured_workload" size={15} className="leading-none" />
                      <span className="font-mono text-[5px] uppercase tracking-tighter mt-0.5">
                        SEAL
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#473322]">
                      AUTHENTICATED ARCHIVAL SPECIMEN
                    </span>
                    <span className="font-mono text-[8px] text-[#7c6550]">
                      Repository: National Archives of India • Vol. 1948-D
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#224f35] font-semibold bg-[#bceecb] px-2 py-0.5 rounded">
                    OCR CONF: 99.8%
                  </span>
                  <span className="font-mono text-[8px] text-[#8e7456] mt-0.5">
                    Tesseract 5.3 + Vision Fine-tuned
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Footer Mini-Metadata Status Bar */}
          <div className="w-full bg-[#f3ede7] px-4 py-2 flex flex-wrap items-center justify-between font-mono text-[11px] text-[#554242] border-t border-[#ede7e2]">
            <div className="flex items-center gap-4">
              <span>
                Dimensions: <strong className="text-[#1d1b18]">3600 x 5120 px</strong>
              </span>
              <span>
                Color Space: <strong className="text-[#1d1b18]">ProPhoto RGB 16-bit</strong>
              </span>
              <span>
                Scanner: <strong className="text-[#1d1b18]">Zeutschel OS Q0</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#002e18] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#002e18]"></span>
              <span>Preservation Master Verified</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Scholarly Transcription, Multi-Lingual Engine & Citations (Col 5) */}
        <div className="lg:col-span-5 flex flex-col bg-[#fff8f3] overflow-y-auto">
          {/* Document Archival Header Card */}
          <div className="p-5 md:p-6 bg-[#f9f2ed] border-b border-[#ede7e2]">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#805610] font-semibold">
                {record.accessionId || 'CA-DOC-CONST-1948-11-04'}
              </span>
              <span className="text-[#554242]/30">•</span>
              <span className="font-mono text-xs text-[#002e18] font-medium">De-acidified Box #12</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#540414] leading-tight mb-3">
              {record.title}
            </h1>

            {/* Bibliographic Specimen Matrix Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-3 border-t border-[#ede7e2] font-sans text-xs">
              <div>
                <span className="block font-mono text-[10px] text-[#554242] uppercase tracking-wider">
                  Date of Promulgation
                </span>
                <span className="text-[#1d1b18] font-semibold">{record.dateStr}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-[#554242] uppercase tracking-wider">
                  Primary Draftsman
                </span>
                <span className="text-[#1d1b18] font-semibold">Dr. B. R. Ambedkar</span>
              </div>
              <div className="col-span-2">
                <span className="block font-mono text-[10px] text-[#554242] uppercase tracking-wider">
                  Curatorial Provenance
                </span>
                <span className="text-[#1d1b18]">{record.repository}</span>
              </div>
            </div>
          </div>

          {/* AI Synthesis Quick-Citation Alert Strip */}
          <div className="mx-5 my-4 p-3.5 bg-[#ffddb3]/60 rounded-xl flex items-start gap-3 border border-[#805610]/20">
            <Icon name="auto_awesome" size={20} className="text-[#805610] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-sans text-xs text-[#291800] font-medium leading-snug">
                This folio is indexed in <strong>48 scholarly AI research synthesis queries</strong>{' '}
                concerning Equal Protection doctrine and Constitutional Morality.
              </p>
              <button
                type="button"
                onClick={onOpenChat}
                className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-wider text-[#540414] font-semibold hover:underline mt-1.5 cursor-pointer"
              >
                <span>Explore in ‘Ask the Archive’</span>
                <Icon name="arrow_forward" size={14} />
              </button>
            </div>
          </div>

          {/* Tabbed Scholarly Subsystem Navigation */}
          <div className="px-5 border-b border-[#ede7e2] flex gap-2 overflow-x-auto select-none">
            {[
              { id: 'ocr', label: 'Extracted Text (OCR)' },
              { id: 'trans', label: 'Translation (Bilingual)' },
              { id: 'prov', label: 'Source Provenance' },
              { id: 'cite', label: 'AI Citations (14)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2.5 font-sans text-xs uppercase tracking-wider transition-all cursor-pointer border-b-2 ${
                  activeTab === tab.id
                    ? 'text-[#540414] border-[#540414] font-semibold'
                    : 'text-[#554242] border-transparent hover:text-[#1d1b18]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="p-5 flex flex-col gap-4 flex-1">
            {activeTab === 'ocr' && (
              <>
                {/* Utility Controls for Transcript */}
                <div className="flex items-center justify-between gap-2 pb-2">
                  <div className="flex items-center gap-1.5 text-[#554242] font-mono text-xs">
                    <Icon name="check_circle" size={16} className="text-[#002e18]" />
                    <span>Verbatim Transcription • ISO-Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyVerbatim}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-[#ede7e2] font-mono text-[11px] text-[#1d1b18] transition-colors border border-[#ede7e2] cursor-pointer"
                    >
                      <Icon name="content_copy" size={14} />
                      <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert('Transcription error report submitted to curatorial board.')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-[#ede7e2] font-mono text-[11px] text-[#1d1b18] transition-colors border border-[#ede7e2] cursor-pointer"
                    >
                      <Icon name="flag" size={14} />
                      <span>Report</span>
                    </button>
                  </div>
                </div>

                {/* Audio Synthesizer Bar */}
                <div className="w-full bg-[#f9f2ed] p-3 rounded-xl flex items-center justify-between gap-3 border border-[#ede7e2]">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                      className="w-8 h-8 rounded-full bg-[#540414] text-white flex items-center justify-center hover:bg-[#721d28] transition-colors cursor-pointer"
                    >
                      <Icon name={isAudioPlaying ? 'pause' : 'play_arrow'} size={18} />
                    </button>
                    <div className="flex flex-col">
                      <span className="font-sans text-xs text-[#1d1b18] font-semibold">
                        Synthesized Archival Audio Readout
                      </span>
                      <span className="font-mono text-[10px] text-[#554242]">
                        Neutral Scholarly Pronunciation • 1.0x Speed
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#805610] font-semibold">
                    {isAudioPlaying ? '01:42 / 03:15' : '03:15 Total'}
                  </span>
                </div>

                {/* Line-Numbered Transcription Reader */}
                <div className="w-full bg-white p-4 rounded-xl shadow-xs border border-[#ede7e2] font-sans text-xs sm:text-sm leading-relaxed">
                  <div className="flex items-start rounded px-1 py-0.5">
                    <span className="w-8 shrink-0 font-mono text-xs text-[#554242]/50 text-right pr-3 select-none">
                      L.1
                    </span>
                    <p className="font-serif font-bold text-[#540414]">PART III</p>
                  </div>
                  <div className="flex items-start rounded px-1 py-0.5">
                    <span className="w-8 shrink-0 font-mono text-xs text-[#554242]/50 text-right pr-3 select-none">
                      L.2
                    </span>
                    <p className="font-serif font-bold text-[#1d1b18]">FUNDAMENTAL RIGHTS</p>
                  </div>
                  <div className="flex items-start rounded px-1 my-1">
                    <span className="w-8 shrink-0 font-mono text-xs text-[#554242]/50 text-right pr-3 select-none">
                      L.3
                    </span>
                    <div className="w-full h-px bg-[#ede7e2] my-auto"></div>
                  </div>

                  <div className="flex items-start bg-[#ffddb3]/20 rounded px-1 py-1">
                    <span className="w-8 shrink-0 font-mono text-xs text-[#540414] font-bold text-right pr-3 select-none">
                      L.4
                    </span>
                    <p className="text-[#1d1b18]">
                      <strong className="font-semibold text-[#540414]">
                        Article 14. Equality before law.
                      </strong>{' '}
                      — The State shall not deny to any person equality before the law or the equal
                      protection of the laws within the territory of India.
                    </p>
                  </div>

                  <div className="flex items-start rounded px-1 my-1">
                    <span className="w-8 shrink-0 font-mono text-xs text-[#554242]/50 text-right pr-3 select-none">
                      L.5
                    </span>
                    <div className="w-full h-px bg-[#ede7e2] my-auto"></div>
                  </div>

                  <div className="flex items-start rounded px-1 py-1">
                    <span className="w-8 shrink-0 font-mono text-xs text-[#554242]/50 text-right pr-3 select-none">
                      L.6
                    </span>
                    <p className="text-[#1d1b18]">
                      <strong className="font-semibold text-[#540414]">
                        Article 15. Prohibition of discrimination on grounds of religion, race,
                        caste, sex or place of birth.
                      </strong>{' '}
                      —
                    </p>
                  </div>

                  <div className="flex items-start rounded px-1 py-0.5">
                    <span className="w-8 shrink-0 font-mono text-xs text-[#554242]/50 text-right pr-3 select-none">
                      L.7
                    </span>
                    <p className="text-[#1d1b18] pl-4">
                      (1) The State shall not discriminate against any citizen on grounds only of
                      religion, race, caste, sex, place of birth or any of them.
                    </p>
                  </div>

                  <div className="flex items-start rounded px-1 py-0.5">
                    <span className="w-8 shrink-0 font-mono text-xs text-[#554242]/50 text-right pr-3 select-none">
                      L.8
                    </span>
                    <p className="text-[#1d1b18] pl-4">
                      (2) No citizen shall, on grounds only of religion, race, caste, sex, place of
                      birth or any of them, be subject to any disability, liability, restriction or
                      condition with regard to—
                    </p>
                  </div>

                  <div className="flex items-start rounded px-1 py-0.5">
                    <span className="w-8 shrink-0 font-mono text-xs text-[#554242]/50 text-right pr-3 select-none">
                      L.9
                    </span>
                    <p className="text-[#1d1b18] pl-8">
                      (a) access to shops, public restaurants, hotels and places of public
                      entertainment; or
                    </p>
                  </div>

                  <div className="flex items-start rounded px-1 py-0.5">
                    <span className="w-8 shrink-0 font-mono text-xs text-[#554242]/50 text-right pr-3 select-none">
                      L.10
                    </span>
                    <p className="text-[#1d1b18] pl-8">
                      (b) the use of wells, tanks, bathing ghats, roads and places of public resort
                      maintained wholly or partly out of State funds or dedicated to the use of the
                      general public.
                    </p>
                  </div>

                  {/* Marginal Ink Transcript Note */}
                  <div className="mt-4 p-3 bg-[#f3ede7] rounded-lg border-l-4 border-[#540414] space-y-1">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#540414] uppercase font-bold tracking-wider">
                      <Icon name="draw" size={16} />
                      <span>Transcription of Hand-written Inscription</span>
                    </div>
                    <p className="font-serif italic text-base text-[#1d1b18]">
                      “Approved with amendment to include non-discrimination on grounds of birth or place.”
                    </p>
                    <span className="block font-mono text-[10px] text-[#554242]">
                      Marginal note scribed along left margin of folio leaf XXIII; verified as Dr. B.
                      R. Ambedkar’s personal hand by Government Examiner of Questioned Documents
                      (GEQD Report #1988-ARC).
                    </span>
                  </div>
                </div>

                {/* Multilingual Translation Matrix */}
                <div className="mt-2 pt-4 border-t border-[#ede7e2] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-sm font-bold text-[#1d1b18] flex items-center gap-1.5">
                      <Icon name="translate" size={20} className="text-[#805610]" />
                      <span>Constitutional Terminology Equivalents</span>
                    </h3>
                    <span className="font-mono text-[11px] text-[#554242]">Scholarly Lexicon 2.1</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {['English (Original)', 'हिन्दी (Hindi)', 'मराठी (Marathi)', 'தமிழ் (Tamil)'].map(
                      (l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setSelectedTermLang(l.split(' ')[0])}
                          className={`px-3 py-1 rounded-md text-xs font-sans transition-all cursor-pointer ${
                            selectedTermLang === l.split(' ')[0]
                              ? 'bg-[#540414] text-white font-semibold'
                              : 'bg-white hover:bg-[#ede7e2] text-[#1d1b18] border border-[#ede7e2]'
                          }`}
                        >
                          {l}
                        </button>
                      )
                    )}
                  </div>

                  <div className="bg-[#f9f2ed] p-3.5 rounded-xl space-y-2.5 font-sans text-xs border border-[#ede7e2]">
                    <div className="pb-2 border-b border-[#ede7e2]">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#805610] font-bold">
                        Standardized Hindi Translation (विधि के समक्ष समता)
                      </span>
                      <p className="text-[#1d1b18] mt-1 leading-relaxed">
                        <strong>अनुच्छेद 14. विधि के समक्ष समता.</strong> — राज्य, भारत के राज्यक्षेत्र
                        में किसी व्यक्ति को विधि के समक्ष समता से या विधियों के समान संरक्षण से वंचित
                        नहीं करेगा।
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#805610] font-bold">
                        Marathi Translation (कायद्यासमोर समानता)
                      </span>
                      <p className="text-[#1d1b18] mt-1 leading-relaxed">
                        <strong>अनुच्छेद १४. कायद्यापुढे समानता.</strong> — राज्य भारताच्या राज्यक्षेत्रात
                        कोणत्याही व्यक्तीस कायद्यापुढील समानता किंवा कायद्यांचे समान संरक्षण नाकारणार
                        नाही.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'trans' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#540414]">
                  Multilingual Archival Concordance
                </h3>
                <p className="font-sans text-xs text-[#554242] leading-relaxed">
                  Comparative parallel corpus cross-referencing official Gazette publications of 1950
                  alongside the multilingual translations recognized in the Eighth Schedule.
                </p>
                <div className="p-4 bg-[#f9f2ed] rounded-xl space-y-3 border border-[#ede7e2]">
                  <div className="p-3 bg-white rounded-lg border border-[#ede7e2]">
                    <h4 className="font-serif text-sm font-semibold text-[#540414]">
                      Lexical Fidelity Analysis
                    </h4>
                    <p className="font-sans text-xs text-[#1d1b18] mt-1 leading-relaxed">
                      “Equal Protection of the Laws” translates into constitutional jurisprudence with
                      varying syntactic weight across Indo-Aryan and Dravidian language registers,
                      retaining identical substantive legal force.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prov' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#540414]">
                  Provenance Chain &amp; Physical Custody
                </h3>
                <div className="space-y-3 font-sans text-xs">
                  <div className="p-3.5 bg-[#f9f2ed] rounded-xl flex items-start gap-3 border border-[#ede7e2]">
                    <Icon name="history_edu" size={20} className="text-[#540414] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-xs text-[#540414] font-bold">
                        1948 — CONSTITUENT ASSEMBLY ARCHIVE
                      </span>
                      <p className="text-[#1d1b18] mt-0.5">
                        Transferred under the direct custody of Dr. Sachchidananda Sinha and the
                        Secretariat of the Constituent Assembly.
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-[#f9f2ed] rounded-xl flex items-start gap-3 border border-[#ede7e2]">
                    <Icon name="verified" size={20} className="text-[#540414] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-xs text-[#540414] font-bold">
                        1952 — NATIONAL ARCHIVES OF INDIA ACQUISITION
                      </span>
                      <p className="text-[#1d1b18] mt-0.5">
                        Accession registered under permanent treaty cataloging NAI-CA-IV-48.
                        Microfilmed in 1968.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cite' && (
              <div className="space-y-4 font-sans text-xs">
                <h3 className="font-serif text-lg font-bold text-[#540414]">
                  Scholarly AI Corpus Citations (14 Selected)
                </h3>
                <ul className="space-y-2.5">
                  <li className="p-3 bg-[#f9f2ed] rounded-xl border border-[#ede7e2]">
                    <span className="font-mono text-xs text-[#805610] font-bold">
                      QUERY-AI-7729
                    </span>
                    <p className="text-[#1d1b18] mt-1 font-medium">
                      “Evolution of non-discrimination grounds between the Initial Draft and Final Nov
                      1948 Article 15 draft.”
                    </p>
                    <span className="font-mono text-[10px] text-[#554242]">
                      Direct Folio Reference: Leaves 23 &amp; 24
                    </span>
                  </li>
                  <li className="p-3 bg-[#f9f2ed] rounded-xl border border-[#ede7e2]">
                    <span className="font-mono text-xs text-[#805610] font-bold">
                      QUERY-AI-9014
                    </span>
                    <p className="text-[#1d1b18] mt-1 font-medium">
                      “Dr. Ambedkar's handwritten amendments regarding place of birth inclusion.”
                    </p>
                    <span className="font-mono text-[10px] text-[#554242]">
                      Direct Folio Reference: Marginalia Annotation Leaf 23
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
