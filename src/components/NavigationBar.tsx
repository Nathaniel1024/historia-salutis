import type Lenis from '@studio-freight/lenis';
import type { StoryChapterData } from '../data/chaptersData';

type Props = {
  chapters: StoryChapterData[];
  activeChapterId: string;
  lenis: Lenis | null;
  onNavigate?: (chapterId: string) => void;
};

export default function NavigationBar({ chapters, activeChapterId, lenis, onNavigate }: Props) {
  return (
    <nav
      aria-label="Chapter navigation"
      className="pointer-events-auto fixed bottom-3 left-1/2 z-[70] w-[min(96vw,980px)] -translate-x-1/2 translate-y-0 rounded-2xl border border-amber-400/40 bg-stone-950/78 px-2 py-2 backdrop-blur-md shadow-manuscript transition-transform duration-300 2xl:bottom-auto 2xl:left-6 2xl:top-1/2 2xl:w-60 2xl:-translate-x-0 2xl:-translate-y-1/2 2xl:px-3 2xl:py-3"
    >
      <ul className="flex gap-2 overflow-x-auto 2xl:flex-col 2xl:gap-1 2xl:overflow-visible">
        {chapters.map((chapter) => {
          const isActive = chapter.id === activeChapterId;
          return (
            <li key={chapter.id}>
              <button
                type="button"
                className={`pointer-events-auto group flex min-w-max items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors 2xl:w-full ${
                  isActive
                    ? 'bg-amber-300/10 text-amber-200 ring-1 ring-amber-400/45'
                    : 'text-stone-200/90 hover:bg-amber-900/20 hover:text-amber-100'
                }`}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate(chapter.id);
                    return;
                  }

                  lenis?.scrollTo(`#${chapter.id}`, { offset: -8 });
                }}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="font-display text-sm tracking-widest 2xl:text-base">{chapter.roman}</span>
                <span className="font-body text-[11px] leading-none opacity-90 2xl:text-xs">{chapter.era}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
