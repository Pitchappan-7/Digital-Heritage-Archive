import React from 'react';
import {
  Search,
  Languages,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Image as ImageIcon,
  Bot,
  BookOpen,
  User,
  BadgeCheck,
  CheckCircle2,
  CheckCircle,
  PenTool,
  FileText,
  Landmark,
  Library,
  Map,
  MapPin,
  Clock,
  FolderPlus,
  MessageSquare,
  Send,
  Brain,
  Maximize2,
  Sparkles,
  Download,
  Share2,
  FileEdit,
  Quote,
  Copy,
  CheckCheck,
  ZoomIn,
  ZoomOut,
  Link as LinkIcon,
  Network,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  RotateCw,
  Box,
  Contrast,
  Flag,
  Edit3,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  LayoutGrid,
  List,
  Filter,
  X,
  SlidersHorizontal,
  Palette,
  Eye,
  Camera,
  Images,
  Mic,
  Volume2,
  Tv,
  Globe,
  Compass,
  Play,
  Pause,
  Video,
  FileCheck,
  Calendar,
  PlayCircle,
  Headphones,
  ChevronsUpDown,
  Terminal,
  Bookmark,
  FileDown,
  Gavel,
  LucideProps,
} from 'lucide-react';

export interface IconProps extends Omit<LucideProps, 'ref'> {
  name?: string;
  children?: React.ReactNode;
  className?: string;
  size?: number | string;
}

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  // Navigation & Actions
  search: Search,
  manage_search: Search,
  travel_explore: Compass,
  translate: Languages,
  arrow_drop_down: ChevronDown,
  unfold_more: ChevronsUpDown,
  arrow_forward: ArrowRight,
  arrow_back: ArrowLeft,
  first_page: ChevronsLeft,
  last_page: ChevronsRight,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  close: X,
  open_in_new: ExternalLink,
  north_east: ArrowUpRight,
  link: LinkIcon,

  // Media & Archival Assets
  image: ImageIcon,
  IMAGE: ImageIcon,
  photo_camera: Camera,
  photo_library: Images,
  video_library: Video,
  play_arrow: Play,
  play_circle: PlayCircle,
  pause: Pause,
  headphones: Headphones,
  calendar_today: Calendar,
  calendar: Calendar,
  palette: Palette,
  aspect_ratio: Maximize2,
  hd: Tv,
  visibility: Eye,
  zoom_in: ZoomIn,
  zoom_out: ZoomOut,
  rotate_right: RotateCw,
  view_in_ar: Box,
  tonality: Contrast,

  // Knowledge, Books & Philosophy
  menu_book: BookOpen,
  auto_stories: BookOpen,
  library_add: FolderPlus,
  local_library: Library,
  history_edu: PenTool,
  policy: FileText,
  gavel: Gavel,
  account_balance: Landmark,
  museum: Landmark,
  draw: Edit3,
  edit_note: FileEdit,
  format_quote: Quote,
  bookmark: Bookmark,
  terminal: Terminal,
  picture_as_pdf: FileDown,
  source_notes: FileText,
  autorenew: RotateCw,
  auto_read_pause: Sparkles,

  // AI & Technology
  smart_toy: Bot,
  auto_awesome: Sparkles,
  psychology: Brain,
  hub: Network,

  // Controls & Filters
  filter_alt: Filter,
  tune: SlidersHorizontal,
  grid_view: LayoutGrid,
  view_headline: List,
  download: Download,
  share: Share2,
  content_copy: Copy,
  flag: Flag,
  restart_alt: RotateCcw,
  timeline: Clock,
  map: Map,
  location_on: MapPin,

  // Communication & Status
  chat_bubble_outline: MessageSquare,
  send: Send,
  verified: BadgeCheck,
  verified_user: ShieldCheck,
  assured_workload: ShieldCheck,
  check_circle: CheckCircle2,
  check: CheckCircle,
  done_all: CheckCheck,
  person: User,
  error: AlertCircle,
  audio: Volume2,
  mic: Mic,
  volume_up: Volume2,
  globe: Globe,
};

export const Icon: React.FC<IconProps> = ({
  name,
  children,
  className = '',
  size,
  ...props
}) => {
  // Determine icon name from prop or text children
  let key = name;
  if (!key && typeof children === 'string') {
    key = children.trim();
  }
  const cleanKey = (key || '').toLowerCase().trim();

  // Try exact or fallback match
  const Component = iconMap[key || ''] || iconMap[cleanKey] || Sparkles;

  // Derive size if passed in or in className
  let derivedSize: number | string = size || 18;
  if (!size) {
    if (className.includes('text-[14px]')) derivedSize = 14;
    else if (className.includes('text-[15px]')) derivedSize = 15;
    else if (className.includes('text-[16px]')) derivedSize = 16;
    else if (className.includes('text-[18px]')) derivedSize = 18;
    else if (className.includes('text-[20px]')) derivedSize = 20;
    else if (className.includes('text-[22px]')) derivedSize = 22;
    else if (className.includes('text-[24px]')) derivedSize = 24;
    else if (className.includes('text-[36px]')) derivedSize = 36;
  }

  return (
    <Component
      size={derivedSize}
      className={`inline-block shrink-0 align-middle ${className}`}
      {...props}
    />
  );
};

export default Icon;
