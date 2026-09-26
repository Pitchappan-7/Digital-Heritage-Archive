export type Language = 'en' | 'hi' | 'mr' | 'ta';

export interface TranslationSchema {
  // Navigation
  home: string;
  explore: string;
  askArchive: string;
  folioReader: string;
  collections: string;
  timeline: string;
  heritageMap: string;
  search: string;
  imageStudio: string;
  aiChatbot: string;
  exploreArchive: string;

  // Header & Language Labels
  selectedLangCode: string;
  englishLang: string;
  hindiLang: string;
  marathiLang: string;
  tamilLang: string;

  // Notice Strip & Badges
  archiveVerified: string;
  recordsCount: string;
  collectionsCount: string;
  updatedDate: string;
  preservationStandards: string;
  nationalRepository: string;

  // Hero Section
  heroTitlePreserve: string;
  heroTitleDiscover: string;
  heroTitleStories: string;
  heroTitleUncover: string;
  heroSubtitle: string;

  // Search Console & Categories
  searchPlaceholder: string;
  searchArchiveBtn: string;
  allRecords: string;
  manuscriptsCat: string;
  speechesCat: string;
  photographsCat: string;
  audioCat: string;
  scholarlyDirectives: string;

  // Explore & Catalog Views
  exploreTitle: string;
  exploreSubtitle: string;
  filterCategory: string;
  filterFormat: string;
  filterPeriod: string;
  filterVerification: string;

  // Ask Archive & Reader Views
  askArchiveTitle: string;
  askArchiveSubtitle: string;
  folioReaderTitle: string;
  backToCatalog: string;
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    home: 'Home',
    explore: 'Explore',
    askArchive: 'Ask the Archive',
    folioReader: 'Folio Reader',
    collections: 'Collections',
    timeline: 'Timeline',
    heritageMap: 'Heritage Map',
    search: 'Search',
    imageStudio: 'Image Studio',
    aiChatbot: 'AI Chatbot',
    exploreArchive: 'Explore Archive',

    selectedLangCode: 'EN',
    englishLang: 'English (EN)',
    hindiLang: 'हिन्दी (HI)',
    marathiLang: 'मराठी (MR)',
    tamilLang: 'தமிழ் (TA)',

    archiveVerified: 'Archive Verified',
    recordsCount: '12,450+ Records',
    collectionsCount: '24 Collections',
    updatedDate: 'Updated Sep 2026',
    preservationStandards: 'Preservation Standards & Provenance',
    nationalRepository: 'Digital Heritage Archive • National Cultural Repository',

    heroTitlePreserve: 'Preserve the Past.',
    heroTitleDiscover: 'Discover',
    heroTitleStories: 'the Stories.',
    heroTitleUncover: 'Uncover the Legacy.',
    heroSubtitle:
      'Explore digitized manuscripts, rare historical records, speeches, photographs, correspondence, and audio archives through an intelligent source-verified knowledge system.',

    searchPlaceholder:
      "Search documents, people, places, events, keywords (e.g., 'Poona Pact 1932' or 'Columbia Thesis')...",
    searchArchiveBtn: 'Search Archive',
    allRecords: 'All Records',
    manuscriptsCat: 'Manuscripts (4.1k)',
    speechesCat: 'Speeches & Debates',
    photographsCat: 'Photographs (3.2k)',
    audioCat: 'Audio Folios',
    scholarlyDirectives: 'Scholarly Directives:',

    exploreTitle: 'Archival Catalog & Primary Sources',
    exploreSubtitle:
      'Browse digitized rare folios, historical speeches, official gazettes, and annotated manuscripts.',
    filterCategory: 'Category',
    filterFormat: 'Format',
    filterPeriod: 'Historical Era',
    filterVerification: 'Verification Status',

    askArchiveTitle: 'Ask the Archive',
    askArchiveSubtitle:
      'RAG-powered historical question answering with exact primary source citations.',
    folioReaderTitle: 'Folio Reader & Document Viewer',
    backToCatalog: 'Back to Catalog',
  },

  hi: {
    home: 'मुख्य पृष्ठ',
    explore: 'अन्वेषण',
    askArchive: 'पुरालेख से पूछें',
    folioReader: 'फोलियो रीडर',
    collections: 'संग्रह',
    timeline: 'कालक्रम',
    heritageMap: 'विरासत मानचित्र',
    search: 'खोजें',
    imageStudio: 'इमेज स्टूडियो',
    aiChatbot: 'एआई चैटबॉट',
    exploreArchive: 'पुरालेख खोजें',

    selectedLangCode: 'HI',
    englishLang: 'English (EN)',
    hindiLang: 'हिन्दी (HI)',
    marathiLang: 'मराठी (MR)',
    tamilLang: 'தமிழ் (TA)',

    archiveVerified: 'पुरालेख सत्यापित',
    recordsCount: '12,450+ रिकॉर्ड्स',
    collectionsCount: '24 संग्रह',
    updatedDate: 'अद्यतन सितंबर 2026',
    preservationStandards: 'संरक्षण मानक एवं मूल प्रमाणिकता',
    nationalRepository: 'डिजिटल विरासत पुरालेख • राष्ट्रीय सांस्कृतिक भंडार',

    heroTitlePreserve: 'अतीत को सहेजें।',
    heroTitleDiscover: 'खोजें',
    heroTitleStories: 'कहानियों को।',
    heroTitleUncover: 'विरासत को उजागर करें।',
    heroSubtitle:
      'बुद्धिमत्तापूर्ण स्रोत-सत्यापित ज्ञान प्रणाली के माध्यम से डिजिटलीकृत पांडुलिपियों, दुर्लभ ऐतिहासिक अभिलेखों, भाषणों, तस्वीरों, पत्राचार और ऑडियो अभिलेखागार का अन्वेषण करें।',

    searchPlaceholder:
      "दस्तावेज़, लोग, स्थान, घटनाएँ, कीवर्ड खोजें (जैसे 'पूना पैक्ट 1932' या 'कोलंबिया थीसिस')...",
    searchArchiveBtn: 'पुरालेख खोजें',
    allRecords: 'सभी रिकॉर्ड्स',
    manuscriptsCat: 'पांडुलिपियाँ (4.1k)',
    speechesCat: 'भाषण एवं बहस',
    photographsCat: 'तस्वीरें (3.2k)',
    audioCat: 'ऑडियो फोलियो',
    scholarlyDirectives: 'विद्वतापूर्ण निर्देश:',

    exploreTitle: 'पुरालेख सूची एवं प्राथमिक स्रोत',
    exploreSubtitle:
      'डिजिटलीकृत दुर्लभ फोलियो, ऐतिहासिक भाषणों, आधिकारिक राजपत्रों और टिप्पणीयुक्त पांडुलिपियों को ब्राउज़ करें।',
    filterCategory: 'श्रेणी',
    filterFormat: 'प्रारूप',
    filterPeriod: 'ऐतिहासिक काल',
    filterVerification: 'सत्यापन स्थिति',

    askArchiveTitle: 'पुरालेख से पूछें',
    askArchiveSubtitle:
      'सटीक प्राथमिक स्रोत उद्धरणों के साथ RAG-संचालित ऐतिहासिक प्रश्नों के उत्तर।',
    folioReaderTitle: 'फोलियो रीडर एवं दस्तावेज़ दर्शक',
    backToCatalog: 'सूची पर वापस जाएं',
  },

  mr: {
    home: 'मुख्य पृष्ठ',
    explore: 'शोध घ्या',
    askArchive: 'अभिलेखागारास विचारा',
    folioReader: 'फोलिओ रीडर',
    collections: 'संग्रह',
    timeline: 'कालरेषा',
    heritageMap: 'वारसा नकाशा',
    search: 'शोधा',
    imageStudio: 'इमेज स्टुडिओ',
    aiChatbot: 'एआय चॅटबॉट',
    exploreArchive: 'अभिलेखागार शोधा',

    selectedLangCode: 'MR',
    englishLang: 'English (EN)',
    hindiLang: 'हिन्दी (HI)',
    marathiLang: 'मराठी (MR)',
    tamilLang: 'தமிழ் (TA)',

    archiveVerified: 'अभिलेखागार सत्यापित',
    recordsCount: '12,450+ नोंदी',
    collectionsCount: '24 संग्रह',
    updatedDate: 'अद्यतन सप्टेंबर 2026',
    preservationStandards: 'जतन मानके आणि मूळ सिद्धता',
    nationalRepository: 'डिजिटल वारसा अभिलेखागार • राष्ट्रीय सांस्कृतिक भांडार',

    heroTitlePreserve: 'भूतकाळ जपा.',
    heroTitleDiscover: 'शोधा',
    heroTitleStories: 'कथा.',
    heroTitleUncover: 'वारसा उलगडा.',
    heroSubtitle:
      'बुद्धिमत्तापूर्ण स्त्रोत-सत्यापित ज्ञान प्रणालीद्वारे डिजिटलीकृत हस्तलिखिते, दुर्मिळ ऐतिहासिक नोंदी, भाषणे, छायाचित्रे, पत्रव्यवहार आणि श्राव्य अभिलेखागारांचा शोध घ्या.',

    searchPlaceholder:
      "दस्तऐवज, व्यक्ती, ठिकाणे, घटना, मुख्य शब्द शोधा (उदा. 'पुना करार 1932' किंवा 'कोलंबिया प्रबंध')...",
    searchArchiveBtn: 'अभिलेखागार शोधा',
    allRecords: 'सर्व नोंदी',
    manuscriptsCat: 'हस्तलिखिते (4.1k)',
    speechesCat: 'भाषणे आणि चर्चा',
    photographsCat: 'छायाचित्रे (3.2k)',
    audioCat: 'ऑडिओ फोलिओ',
    scholarlyDirectives: 'विद्वत्तापूर्ण निर्देश:',

    exploreTitle: 'अभिलेखागार सूची आणि प्राथमिक स्त्रोत',
    exploreSubtitle:
      'डिजिटलीकृत दुर्मिळ फोलिओ, ऐतिहासिक भाषणे, अधिकृत गझेट आणि टीपयुक्त हस्तलिखिते पहा.',
    filterCategory: 'वर्ग',
    filterFormat: 'स्वरूप',
    filterPeriod: 'ऐतिहासिक काळ',
    filterVerification: 'सत्यापन स्थिती',

    askArchiveTitle: 'अभिलेखागारास विचारा',
    askArchiveSubtitle:
      'अचूक प्राथमिक स्त्रोत उल्लेखांसह RAG-आधारित ऐतिहासिक प्रश्नांची उत्तरे.',
    folioReaderTitle: 'फोलिओ रीडर आणि दस्तऐवज दर्शक',
    backToCatalog: 'सूचीवर परत जा',
  },

  ta: {
    home: 'முகப்பு',
    explore: 'ஆராய்க',
    askArchive: 'ஆவணகத்திடம் கேட்க',
    folioReader: 'ஃபோலியோ வாசகர்',
    collections: 'சேகரிப்புகள்',
    timeline: 'காலவரிசை',
    heritageMap: 'பாரம்பரிய வரைபடம்',
    search: 'தேடுக',
    imageStudio: 'படக்கூடம்',
    aiChatbot: 'AI உரையாடி',
    exploreArchive: 'ஆவணகத்தை ஆராய்க',

    selectedLangCode: 'TA',
    englishLang: 'English (EN)',
    hindiLang: 'हिन्दी (HI)',
    marathiLang: 'मराठी (MR)',
    tamilLang: 'தமிழ் (TA)',

    archiveVerified: 'ஆவணகம் சரிபார்க்கப்பட்டது',
    recordsCount: '12,450+ பதிவுகள்',
    collectionsCount: '24 சேகரிப்புகள்',
    updatedDate: 'செப்டம்பர் 2026 புதுப்பிக்கப்பட்டது',
    preservationStandards: 'பாதுகாப்பு தரநிலைகள் & மூலம்',
    nationalRepository: 'டிஜிட்டல் பாரம்பரிய ஆவணகம் • தேசிய கலாச்சார களஞ்சியம்',

    heroTitlePreserve: 'கடந்த காலத்தை பாதுகாப்போம்.',
    heroTitleDiscover: 'கண்டறிவோம்',
    heroTitleStories: 'கதைகளை.',
    heroTitleUncover: 'பாரம்பரியத்தை வெளிக்கொணர்வோம்.',
    heroSubtitle:
      'புத்திசாலித்தனமான ஆதாரத்துடன் சரிபார்க்கப்பட்ட அறிவு அமைப்பின் மூலம் டிஜிட்டல் மயமாக்கப்பட்ட கையெழுத்துப் பிரதிகள், அரிதான வரலாற்றுப் பதிவுகள், உரைகள், புகைப்படங்கள் மற்றும் ஆடியோ ஆவணங்களை ஆராயுங்கள்.',

    searchPlaceholder:
      "ஆவணங்கள், நபர்கள், இடங்கள், நிகழ்வுகள், முக்கிய சொற்களைத் தேடுங்கள் (எ.கா., 'பூனா ஒப்பந்தம் 1932')...",
    searchArchiveBtn: 'ஆவணகத்தைத் தேடுக',
    allRecords: 'அனைத்துப் பதிவுகள்',
    manuscriptsCat: 'கையெழுத்துப் பிரதிகள் (4.1k)',
    speechesCat: 'உரைகள் & விவாதங்கள்',
    photographsCat: 'புகைப்படங்கள் (3.2k)',
    audioCat: 'ஆடியோ ஏடுகள்',
    scholarlyDirectives: 'ஆராய்ச்சி வழிமுறைகள்:',

    exploreTitle: 'ஆவணக் பட்டியல் மற்றும் முதன்மை ஆதாரங்கள்',
    exploreSubtitle:
      'டிஜிட்டல் மயமாக்கப்பட்ட அரிதான ஏடுகள், வரலாற்று உரைகள், அதிகாரப்பூர்வ இதழ்களைப் பார்வையிடவும்.',
    filterCategory: 'வகை',
    filterFormat: 'வடிவம்',
    filterPeriod: 'வரலாற்று காலம்',
    filterVerification: 'சரிபார்ப்பு நிலை',

    askArchiveTitle: 'ஆவணகத்திடம் கேட்க',
    askArchiveSubtitle:
      'துல்லியமான முதன்மை ஆதார மேற்கோள்களுடன் வரலாற்று கேள்விகளுக்கான பதில்கள்.',
    folioReaderTitle: 'ஃபோலியோ வாசகர் மற்றும் ஆவணப் பார்வையாளர்',
    backToCatalog: 'பட்டியலுக்குத் திரும்பு',
  },
};
