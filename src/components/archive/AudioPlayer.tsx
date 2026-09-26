export interface AudioPlayerProps {
  src?: string | null;
  title?: string;
  emptyMessage?: string;
}

/**
 * Foundation audio player shell for oral-history / speech assets.
 */
export function AudioPlayer({
  src,
  title = 'Archival audio',
  emptyMessage = 'No audio source available.',
}: AudioPlayerProps) {
  if (!src) {
    return <p className="text-sm text-[#554242]">{emptyMessage}</p>;
  }

  return (
    <div className="border border-[#ede7e2] bg-[#fff8f3] p-4">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#554242]">{title}</p>
      <audio controls preload="none" src={src} className="w-full">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
