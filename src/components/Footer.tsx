import React from 'react';
import { ArchiveLogo } from './ArchiveLogo';
import { Icon } from './Icon';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#f9f2ed] border-t border-[#ede7e2] text-[#1d1b18]">
      <div className="w-full px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Col 1 & 2: Brand & Certification */}
          <div className="lg:col-span-2 space-y-4">
            <ArchiveLogo size="md" />
            <p className="font-sans text-sm text-[#554242] pr-6 leading-relaxed">
              A centralized, permanent digital repository safeguarding endangered cultural heritage,
              rare manuscripts, epigraphy, and oral traditions through open institutional scholarship.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest px-2.5 py-1 rounded bg-[#bceecb] text-[#224f35] font-semibold">
                Preservation Grade III
              </span>
              <span className="font-mono text-xs uppercase tracking-widest px-2.5 py-1 rounded bg-[#ede7e2] text-[#554242]">
                ISO 16363 Certified
              </span>
            </div>
          </div>

          {/* Col 3: Curatorial Collections */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#540414] mb-3">
              Curatorial Collections
            </h4>
            <ul className="space-y-2 text-sm text-[#554242]">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#540414] transition-colors cursor-pointer text-left"
                >
                  Rare Manuscripts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#540414] transition-colors cursor-pointer text-left"
                >
                  Epigraphy &amp; Folios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#540414] transition-colors cursor-pointer text-left"
                >
                  Oral History Audios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('timeline')}
                  className="hover:text-[#540414] transition-colors cursor-pointer text-left"
                >
                  Chronological Folios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('heritage-map')}
                  className="hover:text-[#540414] transition-colors cursor-pointer text-left"
                >
                  Cartographic Surveys
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Research & AI */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#540414] mb-3">
              Research &amp; AI
            </h4>
            <ul className="space-y-2 text-sm text-[#554242]">
              <li>
                <button
                  onClick={() => onNavigate('ask-the-archive')}
                  className="hover:text-[#540414] transition-colors cursor-pointer text-left font-medium text-[#721d28]"
                >
                  Ask the Archive AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ask-the-archive')}
                  className="hover:text-[#540414] transition-colors cursor-pointer text-left"
                >
                  Graph Ontology
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reader')}
                  className="hover:text-[#540414] transition-colors cursor-pointer text-left"
                >
                  Provenance Chains
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reader')}
                  className="hover:text-[#540414] transition-colors cursor-pointer text-left"
                >
                  Paleographic OCR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#540414] transition-colors cursor-pointer text-left"
                >
                  Academic Fellowships
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Access & Policy */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#540414] mb-3">
              Access &amp; Policy
            </h4>
            <ul className="space-y-2 text-sm text-[#554242]">
              <li>
                <span className="hover:text-[#540414] cursor-pointer">Accessibility Standards</span>
              </li>
              <li>
                <span className="hover:text-[#540414] cursor-pointer">Multilingual Policy</span>
              </li>
              <li>
                <span className="hover:text-[#540414] cursor-pointer">Source Attribution</span>
              </li>
              <li>
                <span className="hover:text-[#540414] cursor-pointer">Curatorial APIs</span>
              </li>
              <li>
                <span className="hover:text-[#540414] cursor-pointer">Rights &amp; Licensing</span>
              </li>
            </ul>
          </div>

          {/* Col 6: Institutional Portal */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#540414] mb-3">
              Institutional Portal
            </h4>
            <p className="font-sans text-xs text-[#554242] mb-3 leading-relaxed">
              Direct access to federated museum repositories, raw high-resolution scan matrices, and
              research grants.
            </p>
            <div className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-wider text-[#805610] hover:text-[#540414] transition-colors cursor-pointer font-semibold">
              <Icon name="verified_user" size={16} />
              <span>Researcher Authentication</span>
            </div>
          </div>
        </div>

        {/* Legal & Treaty Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#ede7e2] flex flex-col md:flex-row items-center justify-between gap-4 text-[#554242] font-mono text-xs">
          <p>© 2025 Digital Heritage Archive Consortium. Preserved under International Archival Treaties.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#540414] cursor-pointer">Privacy Framework</span>
            <span className="hover:text-[#540414] cursor-pointer">Terms of Access</span>
            <span className="hover:text-[#540414] cursor-pointer">Preservation Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
