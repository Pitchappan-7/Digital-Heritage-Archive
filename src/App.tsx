import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { AskArchiveView } from './components/AskArchiveView';
import { ReaderView } from './components/ReaderView';
import { ImageGeneratorModal } from './components/ImageGeneratorModal';
import { ChatbotDrawer } from './components/ChatbotDrawer';
import { HeritageMapModal } from './components/HeritageMapModal';
import { TimelineModal } from './components/TimelineModal';
import { INITIAL_RECORDS } from './data/mockData';
import { CatalogRecord, GeneratedArchivalImage } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [records, setRecords] = useState<CatalogRecord[]>(INITIAL_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<CatalogRecord>(INITIAL_RECORDS[1]);
  const [isImageGenOpen, setIsImageGenOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [savedImages, setSavedImages] = useState<GeneratedArchivalImage[]>([]);

  const handleNavigate = (tab: string) => {
    if (tab === 'heritage-map') {
      setIsMapModalOpen(true);
      return;
    }
    if (tab === 'timeline') {
      setIsTimelineModalOpen(true);
      return;
    }
    if (tab === 'collections') {
      setCurrentTab('explore');
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddRecordToCatalog = (newRecord: CatalogRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  const handleOpenInReader = (record: CatalogRecord) => {
    setSelectedRecord(record);
    setCurrentTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string, _category: string) => {
    if (!query.trim()) return;
    // Simple filter simulation
    const filtered = INITIAL_RECORDS.filter(
      (r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase()) ||
        r.accessionId.toLowerCase().includes(query.toLowerCase())
    );
    if (filtered.length > 0) {
      setRecords(filtered);
    } else {
      setRecords(INITIAL_RECORDS);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f3] text-[#1d1b18] flex flex-col font-sans selection:bg-[#ffddb3] selection:text-[#291800]">
      {/* Primary Fixed Archival Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenImageGen={() => setIsImageGenOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenSearch={() => {
          setCurrentTab('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-1">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectRecord={handleOpenInReader}
            onOpenImageGen={() => setIsImageGenOpen(true)}
            onOpenChat={() => setIsChatOpen(true)}
            onSearch={handleSearch}
            records={records}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreView
            records={records}
            onSelectRecord={handleOpenInReader}
            onNavigate={handleNavigate}
            onOpenChat={() => setIsChatOpen(true)}
            onOpenImageGen={() => setIsImageGenOpen(true)}
          />
        )}

        {currentTab === 'ask-the-archive' && (
          <AskArchiveView
            onNavigateToRecord={handleOpenInReader}
            onOpenChat={() => setIsChatOpen(true)}
            records={records}
          />
        )}

        {currentTab === 'reader' && (
          <ReaderView
            record={selectedRecord}
            onNavigateToCatalog={() => setCurrentTab('explore')}
            onOpenChat={() => setIsChatOpen(true)}
            onOpenImageGen={() => setIsImageGenOpen(true)}
          />
        )}
      </main>

      {/* Primary Archival Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals & Slide-over Drawers */}
      <ImageGeneratorModal
        isOpen={isImageGenOpen}
        onClose={() => setIsImageGenOpen(false)}
        onAddRecordToCatalog={handleAddRecordToCatalog}
        onOpenInReader={handleOpenInReader}
        savedImages={savedImages}
        onSaveImage={(img) => setSavedImages((prev) => [img, ...prev])}
      />

      <ChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <HeritageMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onNavigateToRecord={(recId) => {
          const rec = records.find((r) => r.id === recId) || records[0];
          handleOpenInReader(rec);
          setIsMapModalOpen(false);
        }}
      />

      <TimelineModal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        onNavigateToExplore={() => {
          setCurrentTab('explore');
          setIsTimelineModalOpen(false);
        }}
      />
    </div>
  );
}
