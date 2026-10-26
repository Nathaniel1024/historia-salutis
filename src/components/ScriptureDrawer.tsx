import { X } from 'lucide-react';
import { useEffect } from 'react';
import type { StoryChapterData } from '../data/chaptersData';

type Props = {
  open: boolean;
  chapter: StoryChapterData | null;
  onClose: () => void;
};

export default function ScriptureDrawer({ open, chapter, onClose }: Props) {
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Scripture study drawer"
        className={`fixed right-0 top-0 z-[80] h-screen w-[min(94vw,480px)] border-l border-amber-400/25 bg-[#201915]/95 p-6 text-vellum backdrop-blur-xl transition-transform duration-500 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-xl text-amber-100">Illuminated Scripture</h3>
          <button
            type="button"
            className="rounded-md border border-amber-500/25 p-2 text-amber-200 transition-colors hover:bg-amber-500/10"
            onClick={onClose}
            aria-label="Close scripture drawer"
          >
            <X size={18} />
          </button>
        </div>

        {!chapter ? (
          <p className="font-body text-sm text-stone-200">Select a chapter citation to open contextual study notes.</p>
        ) : (
          <div className="space-y-5">
            <header className="manuscript-card rounded-xl p-5">
              <p className="font-display text-sm uppercase tracking-[0.2em] text-amber-300/90">{chapter.roman}</p>
              <h4 className="mt-2 font-display text-2xl text-amber-100">{chapter.title}</h4>
              <p className="mt-3 font-body text-base text-stone-100">[{chapter.scriptureRef}]</p>
            </header>

            <section className="manuscript-card rounded-xl p-5">
              <h5 className="font-display text-base text-amber-200">Historical-Theological Summary</h5>
              <p className="mt-2 font-body leading-7 text-stone-100/95">{chapter.theologicalSummary}</p>
            </section>

            <section className="manuscript-card rounded-xl p-5">
              <h5 className="font-display text-base text-amber-200">Covenant Cross-References</h5>
              <div className="mt-3 flex flex-wrap gap-2">
                {chapter.crossReferences.map((reference) => (
                  <span
                    key={reference}
                    className="rounded-full border border-amber-400/30 bg-amber-300/10 px-3 py-1 font-body text-sm text-amber-50"
                  >
                    {reference}
                  </span>
                ))}
              </div>
            </section>
          </div>
        )}
      </aside>
    </>
  );
}
