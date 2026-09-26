export interface TranslationPanelProps {
  sourceText?: string | null;
  translatedText?: string | null;
  sourceLanguage?: string | null;
  targetLanguage?: string | null;
  statusMessage?: string;
}

/**
 * Foundation translation panel.
 * Translation service is a boundary — this UI never fabricates translations.
 */
export function TranslationPanel({
  sourceText,
  translatedText,
  sourceLanguage,
  targetLanguage,
  statusMessage = 'Translation service is not configured yet.',
}: TranslationPanelProps) {
  return (
    <section className="border border-[#ede7e2] bg-[#fff8f3] p-4">
      <h3 className="font-mono text-xs uppercase tracking-wider text-[#554242]">Translation</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs text-[#554242]">{sourceLanguage || 'Source'}</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-[#1d1b18]">
            {sourceText || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#554242]">{targetLanguage || 'Target'}</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-[#1d1b18]">
            {translatedText || statusMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
