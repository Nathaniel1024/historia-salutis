import { useEffect, useMemo, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AudioLines, Github, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import NavigationBar from './components/NavigationBar';
import StoryChapter from './components/StoryChapter';
import ScriptureDrawer from './components/ScriptureDrawer';
import { chaptersData, type StoryChapterData } from './data/chaptersData';
import { createAudioEngine, type HistoriaAudioEngine } from './utils/audioEngine';

gsap.registerPlugin(ScrollTrigger);

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
};

function App() {
  const [chapters, setChapters] = useState<StoryChapterData[]>(() =>
    chaptersData.map((chapter) => ({ ...chapter, motifTiming: { ...chapter.motifTiming } }))
  );
  const [activeChapterId, setActiveChapterId] = useState(chaptersData[0].id);
  const [drawerChapter, setDrawerChapter] = useState<StoryChapterData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.76);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array.from({ length: 16 }, () => 8));
  const [missingAudioTracks, setMissingAudioTracks] = useState<string[]>([]);

  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const audioRef = useRef<HistoriaAudioEngine | null>(null);
  const activeChapterRef = useRef(activeChapterId);
  const navTargetRef = useRef<string | null>(null);
  const navLockUntilRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollIdleTimerRef = useRef<number | null>(null);
  const pendingAudioChapterRef = useRef<string | null>(null);

  useEffect(() => {
    activeChapterRef.current = activeChapterId;
  }, [activeChapterId]);

  useEffect(() => {
    let cancelled = false;

    const checkAudioFiles = async () => {
      const checks = await Promise.all(
        chaptersData.map(async (_, index) => {
          const track = `Chapter${index + 1}.mp3`;
          try {
            const response = await fetch(`/audio/new-audio/${track}`, {
              method: 'HEAD',
              cache: 'no-store'
            });
            return response.ok ? null : track;
          } catch {
            return track;
          }
        })
      );

      if (cancelled) return;
      setMissingAudioTracks(checks.filter((item): item is string => Boolean(item)));
    };

    checkAudioFiles();

    return () => {
      cancelled = true;
    };
  }, []);

  const setActiveChapterStable = (nextId: string) => {
    const now = performance.now();

    if (navTargetRef.current && now < navLockUntilRef.current) {
      if (nextId !== navTargetRef.current) return;
    }

    if (activeChapterRef.current === nextId) return;
    activeChapterRef.current = nextId;
    setActiveChapterId(nextId);
  };

  const handleNavigate = (chapterId: string) => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const isFirstChapter = chapterId === chapters[0]?.id;
    const navOffset = 0;
    const targetEl = document.getElementById(chapterId);
    const pinTrigger = ScrollTrigger.getById(`pin-${chapterId}`);
    const pinStart = typeof pinTrigger?.start === 'number' ? pinTrigger.start : null;
    const targetTop = isFirstChapter
      ? 0
      : pinStart !== null
        ? pinStart
      : targetEl
        ? targetEl.getBoundingClientRect().top + window.scrollY + navOffset
        : window.scrollY;
    const currentY = window.scrollY;
    const distance = Math.abs(targetTop - currentY);
    const dynamicDuration = clamp(1.26 + distance / 3200, 1.26, 2.05);

    navTargetRef.current = chapterId;
    navLockUntilRef.current = performance.now() + dynamicDuration * 1000 + 220;
    activeChapterRef.current = chapterId;
    setActiveChapterId(chapterId);
    requestChapterAudio(chapterId, 0.5);

    lenis.scrollTo(targetTop, {
      offset: 0,
      duration: dynamicDuration,
      easing: (value: number) => 1 - Math.pow(1 - value, 2.2),
      force: true,
      lock: true,
      onComplete: () => {
        ScrollTrigger.update();

        navLockUntilRef.current = performance.now() + 120;
        if (navTargetRef.current === chapterId) {
          navTargetRef.current = null;
        }
      }
    });
  };

  const chapterIndexById = useMemo(() => {
    return new Map(chapters.map((chapter, index) => [chapter.id, index]));
  }, [chapters]);

  const applyChapterAudio = (chapterId: string, progress = 0.5) => {
    const idx = chapterIndexById.get(chapterId);
    if (typeof idx !== 'number') return;
    audioRef.current?.setSoundProfile(idx, progress);
  };

  const requestChapterAudio = (chapterId: string, progress = 0.5) => {
    pendingAudioChapterRef.current = chapterId;
    if (!isScrollingRef.current) {
      applyChapterAudio(chapterId, progress);
      pendingAudioChapterRef.current = null;
    }
  };

  const resolveSettledChapterId = () => {
    if (!chapters.length) return chaptersData[0].id;
    const y = window.scrollY;
    if (y <= 10) return chapters[0].id;

    const hasPinTriggers = chapters.some((chapter) => {
      const trigger = ScrollTrigger.getById(`pin-${chapter.id}`);
      return typeof trigger?.start === 'number';
    });

    if (!hasPinTriggers) {
      const anchorY = window.innerHeight * 0.38;
      let mobileCandidate = chapters[0].id;

      for (const chapter of chapters) {
        const section = document.getElementById(chapter.id);
        if (!section) continue;
        const top = section.getBoundingClientRect().top;
        if (top <= anchorY) {
          mobileCandidate = chapter.id;
        }
      }

      return mobileCandidate;
    }

    let candidate = chapters[0].id;

    for (const chapter of chapters) {
      const trigger = ScrollTrigger.getById(`pin-${chapter.id}`);
      const start = typeof trigger?.start === 'number' ? trigger.start : null;
      if (start !== null && y + 2 >= start) {
        candidate = chapter.id;
      }
    }

    return candidate;
  };

  useEffect(() => {
    if (chapterIndexById.has(activeChapterId)) {
      requestChapterAudio(activeChapterId, 0.5);
    }
  }, [activeChapterId, chapterIndexById]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.01 : 1.9,
      easing: (value: number) => 1 - Math.pow(1 - value, 2.6),
      smoothWheel: !prefersReducedMotion,
      syncTouch: true,
      wheelMultiplier: 0.55,
      touchMultiplier: 1.1
    });

    lenisRef.current = lenis;
    lastScrollYRef.current = window.scrollY;

    lenis.on('scroll', () => {
      const currentY = window.scrollY;
      lastScrollYRef.current = currentY;

      isScrollingRef.current = true;
      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }

      scrollIdleTimerRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        const settledChapterId = resolveSettledChapterId();
        activeChapterRef.current = settledChapterId;
        setActiveChapterId(settledChapterId);

        if (pendingAudioChapterRef.current || chapterIndexById.has(settledChapterId)) {
          applyChapterAudio(settledChapterId, 0.5);
          pendingAudioChapterRef.current = null;
        }
      }, 150);

      ScrollTrigger.update();
    });

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
        scrollIdleTimerRef.current = null;
      }
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion, chapters, chapterIndexById]);

  useEffect(() => {
    audioRef.current = createAudioEngine();
    setMasterVolume(audioRef.current.getMasterVolume());

    let frame = 0;
    const paintVisualizer = () => {
      const engine = audioRef.current;
      if (engine) {
        const data = engine.getVisualizerData();
        const bars = Array.from({ length: 16 }, (_, i) => {
          const raw = data[i] ?? 0;
          return 8 + Math.round((raw / 255) * 36);
        });
        setVisualizerBars(bars);
      }
      frame = requestAnimationFrame(paintVisualizer);
    };

    frame = requestAnimationFrame(paintVisualizer);

    return () => {
      cancelAnimationFrame(frame);
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const triggers: ScrollTrigger[] = chapters.map((chapter, index) => {
      const desktop = !isMobile;
      const previous = chapters[index - 1];
      const next = chapters[index + 1];

      const activateChapterAudio = (targetId: string) => {
        const targetIndex = chapterIndexById.get(targetId);
        if (typeof targetIndex !== 'number') return;
        activeChapterRef.current = targetId;
        setActiveChapterId(targetId);
        requestChapterAudio(targetId, 0.5);
      };

      return ScrollTrigger.create({
        trigger: `#${chapter.id}`,
        start: desktop ? 'top top' : 'top 70%',
        end: desktop ? '+=130%' : 'bottom 30%',
        onEnter: () => {
          setActiveChapterStable(chapter.id);
          requestChapterAudio(chapter.id, 0.5);
        },
        onEnterBack: () => {
          setActiveChapterStable(chapter.id);
          requestChapterAudio(chapter.id, 0.5);
        },
        onLeave: () => {
          if (next) activateChapterAudio(next.id);
        },
        onLeaveBack: () => {
          if (previous) {
            activateChapterAudio(previous.id);
          } else {
            activateChapterAudio(chapters[0].id);
          }
        },
        onUpdate: () => {
          // Audio switch happens after scroll settles on a chapter.
        }
      });
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [chapters, isMobile]);

  const openScripture = (chapter: StoryChapterData) => {
    setDrawerChapter(chapter);
    setDrawerOpen(true);
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (playing) {
      await audioRef.current.pause();
      setPlaying(false);
      return;
    }

    await audioRef.current.start();
    setPlaying(true);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const result = audioRef.current.toggleMute();
    setMuted(result);
  };

  const handleMasterVolumeChange = (nextValue: number) => {
    const clamped = clamp(nextValue, 0, 1);
    setMasterVolume(clamped);
    audioRef.current?.setMasterVolume(clamped);
  };

  return (
    <main className="relative bg-walnut pb-24 text-vellum 2xl:pb-0">
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 h-14 bg-gradient-to-b from-[#120f0d] via-[#120f0d]/92 to-transparent" />
      <div className="noise-overlay" aria-hidden="true" />

      <NavigationBar
        chapters={chapters}
        activeChapterId={activeChapterId}
        lenis={lenisRef.current}
        onNavigate={handleNavigate}
      />

      <div className="fixed right-3 top-3 z-50 md:right-6 md:top-6">
        <div className="manuscript-card flex items-center gap-2 rounded-full border border-amber-400/30 px-3 py-2 shadow-manuscript">
          <AudioLines size={16} className="text-amber-200" />

          <button
            type="button"
            className="rounded-full bg-amber-300/10 p-2 text-amber-100 hover:bg-amber-300/20"
            onClick={togglePlay}
            aria-label={playing ? 'Pause ambient score' : 'Play ambient score'}
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </button>

          <button
            type="button"
            className="rounded-full bg-amber-300/10 p-2 text-amber-100 hover:bg-amber-300/20"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute ambient score' : 'Mute ambient score'}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <label className="hidden items-center gap-2 pl-1 md:flex" aria-label="Master volume control">
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-amber-200/80">Vol</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={masterVolume}
              onChange={(event) => handleMasterVolumeChange(Number(event.target.value))}
              className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-amber-200/20 accent-amber-300"
            />
          </label>

          <div className="hidden items-end gap-[2px] pl-1 md:flex">
            {visualizerBars.map((height, idx) => (
              <span
                key={`bar-${idx}`}
                className="w-[3px] rounded-full bg-amber-200/90 transition-all duration-200"
                style={{ height }}
              />
            ))}
          </div>
        </div>
      </div>

      {missingAudioTracks.length > 0 ? (
        <div className="fixed right-3 top-16 z-50 max-w-[min(88vw,360px)] rounded-lg border border-amber-400/35 bg-stone-950/85 px-3 py-2 text-xs text-amber-100 shadow-manuscript md:right-6 md:top-20">
          Missing audio tracks: {missingAudioTracks.join(', ')}
        </div>
      ) : null}

      {chapters.map((chapter) => (
        <StoryChapter
          key={chapter.id}
          chapter={chapter}
          isMobile={isMobile || prefersReducedMotion}
          isActive={chapter.id === activeChapterId}
          onOpenScripture={openScripture}
        />
      ))}

      <footer className="relative z-20 border-t border-amber-500/20 bg-stone-950/80 px-6 py-8 text-center">
        <p className="font-display text-xl text-amber-100">Historia Salutis</p>
        <p className="mt-2 font-body text-sm text-stone-300">
          From garden exile to renewed creation — the one unfolding story of redemption.
        </p>
        <p className="mt-3 font-body text-sm text-amber-200/90">
          Crafted by{' '}
          <a
            href="https://github.com/Nathaniel1024"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 underline decoration-amber-400/60 underline-offset-4 transition-colors hover:text-amber-100"
          >
            <Github size={14} aria-hidden="true" />
            Nathaniel
          </a>
        </p>
      </footer>

      <ScriptureDrawer open={drawerOpen} chapter={drawerChapter} onClose={() => setDrawerOpen(false)} />
    </main>
  );
}

export default App;
