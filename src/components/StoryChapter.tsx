import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StoryChapterData } from '../data/chaptersData';
import { sceneLayerAssets } from '../data/chapterLayerAssets';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  chapter: StoryChapterData;
  isMobile: boolean;
  isActive: boolean;
  onOpenScripture: (chapter: StoryChapterData) => void;
};

type Accent = {
  className: string;
  style: CSSProperties;
};

const chapterAccents: Record<string, Accent[]> = {
  'chapter-ii': [
    { className: 'ambient-flicker', style: { left: '56%', top: '53%', width: 120, height: 120, background: 'radial-gradient(circle, rgba(244,173,94,0.35), rgba(244,173,94,0))' } }
  ],
  'chapter-iii': [
    { className: 'ambient-flicker-slow', style: { left: '49%', top: '34%', width: 150, height: 210, background: 'radial-gradient(ellipse, rgba(255,213,145,0.24), rgba(255,213,145,0))' } }
  ],
  'chapter-iv': [
    { className: 'ambient-flicker', style: { left: '45%', top: '36%', width: 220, height: 140, background: 'radial-gradient(ellipse, rgba(247,227,188,0.22), rgba(247,227,188,0))' } }
  ],
  'chapter-v': [
    { className: 'ambient-flicker', style: { left: '48%', top: '46%', width: 180, height: 120, background: 'radial-gradient(ellipse, rgba(255,203,132,0.26), rgba(255,203,132,0))' } }
  ],
  'chapter-vi': [
    { className: 'ambient-shimmer', style: { left: '41%', top: '56%', width: 300, height: 80, background: 'linear-gradient(90deg, rgba(188,221,239,0), rgba(188,221,239,0.14), rgba(188,221,239,0))' } }
  ],
  'chapter-vii': [
    { className: 'ambient-flicker-slow', style: { left: '70%', top: '22%', width: 180, height: 180, background: 'radial-gradient(circle, rgba(251,233,184,0.24), rgba(251,233,184,0))' } }
  ],
  'chapter-viii': [
    { className: 'ambient-shimmer', style: { left: '33%', top: '20%', width: 560, height: 260, background: 'radial-gradient(ellipse, rgba(211,238,252,0.20), rgba(211,238,252,0))' } }
  ]
};

type PlanePhotos = {
  background: string | null;
  midground: string | null;
  foreground: string | null;
};

type PlaneVisualConfig = {
  opacity: number;
  mixBlendMode?: CSSProperties['mixBlendMode'];
  photoPosition?: string;
  photoSize?: string;
  photoFilter?: string;
};

const planeExtensions = ['jpg', 'jpeg', 'webp', 'png', 'svg'];

const chapterVignette: Record<string, string> = {
  'chapter-i': 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.72) 100%)',
  'chapter-ii': 'radial-gradient(ellipse at 52% 44%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.48) 76%, rgba(0,0,0,0.72) 100%)',
  'chapter-iii': 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.54) 78%, rgba(0,0,0,0.76) 100%)',
  'chapter-iv': 'radial-gradient(ellipse at 50% 44%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.5) 76%, rgba(0,0,0,0.74) 100%)',
  'chapter-v': 'radial-gradient(ellipse at 50% 52%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.42) 74%, rgba(0,0,0,0.66) 100%)',
  'chapter-vi': 'radial-gradient(ellipse at 50% 54%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.56) 78%, rgba(0,0,0,0.78) 100%)',
  'chapter-vii': 'radial-gradient(ellipse at 58% 48%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.56) 78%, rgba(0,0,0,0.8) 100%)',
  'chapter-viii': 'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.42) 74%, rgba(0,0,0,0.68) 100%)'
};

const defaultPlaneConfig: Record<keyof PlanePhotos, PlaneVisualConfig> = {
  background: { opacity: 0.98, mixBlendMode: 'normal', photoPosition: 'center 44%', photoSize: 'cover' },
  midground: { opacity: 0.86, mixBlendMode: 'soft-light', photoPosition: 'center 58%', photoSize: 'cover' },
  foreground: {
    opacity: 0.72,
    mixBlendMode: 'multiply',
    photoPosition: 'center 72%',
    photoSize: '116% auto',
    photoFilter: 'contrast(1.04) saturate(0.9)'
  }
};

const chapterPlaneOverrides: Record<string, Partial<Record<keyof PlanePhotos, Partial<PlaneVisualConfig>>>> = {
  'chapter-v': {
    background: { opacity: 0.92 },
    midground: { opacity: 0.82, mixBlendMode: 'overlay' },
    foreground: { opacity: 0.62, photoSize: '122% auto' }
  },
  'chapter-vi': {
    background: { opacity: 1, photoFilter: 'saturate(0.94) contrast(1.05)' },
    foreground: { opacity: 0.76, photoSize: '120% auto' }
  },
  'chapter-viii': {
    midground: { opacity: 0.8, mixBlendMode: 'screen' },
    foreground: { opacity: 0.58, photoSize: '122% auto', photoFilter: 'saturate(0.86) contrast(1.02)' }
  }
};

const fingerprint = (url: string | null) => {
  if (!url) return '';
  const withoutQuery = url.split('?')[0];
  return withoutQuery.split('/').pop() ?? withoutQuery;
};

const resolvePlanePhoto = (chapterId: string, plane: keyof PlanePhotos): Promise<string | null> => {
  const tryLoad = (src: string) =>
    new Promise<boolean>((resolve) => {
      const image = new Image();
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = src;
    });

  return (async () => {
    for (const ext of planeExtensions) {
      const src = `/assets/chapters/${chapterId}/${plane}.${ext}`;
      const ok = await tryLoad(src);
      if (ok) return src;
    }

    return null;
  })();
};

const layerStyle = (
  gradient: string,
  assetRef: string,
  photo: string | null,
  plane: keyof PlanePhotos,
  chapterId: string,
  blur = false,
  duplicatePhoto = false
) => {
  const asset = sceneLayerAssets[assetRef];
  const photoLayer = photo ? `url("${photo}")` : null;
  const parts = [photoLayer, asset, gradient].filter(Boolean);
  const chapterOverride = chapterPlaneOverrides[chapterId]?.[plane] ?? {};
  const config = { ...defaultPlaneConfig[plane], ...chapterOverride };
  const hasPhoto = Boolean(photoLayer);

  const adjustedPhotoSize = duplicatePhoto && plane !== 'background' ? '132% auto' : config.photoSize;
  const adjustedPhotoFilter =
    duplicatePhoto && plane !== 'background'
      ? `${config.photoFilter ?? ''} brightness(0.82) saturate(0.74)`.trim()
      : config.photoFilter;

  const blurPart = blur ? (hasPhoto ? 'blur(0.2px)' : 'blur(1.5px)') : '';
  const finalMixBlendMode = hasPhoto && plane !== 'background' ? 'normal' : config.mixBlendMode;

  const sizeParts = [
    photo ? adjustedPhotoSize ?? 'cover' : null,
    asset ? 'cover' : null,
    gradient ? 'cover' : null
  ].filter(Boolean);

  const positionParts = [
    photo ? config.photoPosition ?? 'center center' : null,
    asset ? 'center center' : null,
    gradient ? 'center center' : null
  ].filter(Boolean);

  const repeatParts = parts.map(() => 'no-repeat');

  return {
    backgroundImage: parts.join(', '),
    backgroundSize: sizeParts.join(', '),
    backgroundPosition: positionParts.join(', '),
    backgroundRepeat: repeatParts.join(', '),
    filter: `${adjustedPhotoFilter ?? ''} ${blurPart}`.trim() || 'none',
    opacity: config.opacity,
    mixBlendMode: finalMixBlendMode
  } as const;
};

export default function StoryChapter({ chapter, isMobile, isActive, onOpenScripture }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const midRef = useRef<HTMLDivElement | null>(null);
  const foreRef = useRef<HTMLDivElement | null>(null);
  const motifRef = useRef<HTMLSpanElement | null>(null);
  const [photos, setPhotos] = useState<PlanePhotos>({
    background: null,
    midground: null,
    foreground: null
  });

  const accents = chapterAccents[chapter.id] ?? [];
  const overscanForTravel = (travelPercent: number) => {
    if (isMobile) {
      return { top: '-10%', bottom: '-10%', left: '-4%', right: '-4%' };
    }

    const verticalOverscan = Math.min(98, Math.abs(travelPercent) + 10);
    return {
      top: `-${verticalOverscan}%`,
      bottom: `-${verticalOverscan}%`,
      left: '-7%',
      right: '-7%'
    };
  };

  const bgOverscan = overscanForTravel(chapter.cameraMood.bgTravel);
  const midOverscan = overscanForTravel(chapter.cameraMood.midTravel);
  const foreOverscan = overscanForTravel(chapter.cameraMood.fgTravel);
  const sharedBackgroundMid = Boolean(
    fingerprint(photos.background) && fingerprint(photos.background) === fingerprint(photos.midground)
  );
  const sharedBackgroundFore = Boolean(
    fingerprint(photos.background) && fingerprint(photos.background) === fingerprint(photos.foreground)
  );

  const getMotifEnvelope = (progress: number) => {
    const { entryStart, entryEnd, holdUntil, exitEnd } = chapter.motifTiming;
    if (progress <= entryStart) return 0;
    if (progress < entryEnd) return (progress - entryStart) / Math.max(0.0001, entryEnd - entryStart);
    if (progress <= holdUntil) return 1;
    if (progress < exitEnd) return 1 - (progress - holdUntil) / Math.max(0.0001, exitEnd - holdUntil);
    return 0;
  };

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      resolvePlanePhoto(chapter.id, 'background'),
      resolvePlanePhoto(chapter.id, 'midground'),
      resolvePlanePhoto(chapter.id, 'foreground')
    ]).then(([background, midground, foreground]) => {
      if (cancelled) return;
      setPhotos({ background, midground, foreground });
    });

    return () => {
      cancelled = true;
    };
  }, [chapter.id]);

  useLayoutEffect(() => {
    if (!sectionRef.current || !bgRef.current || !midRef.current || !foreRef.current) return;

    const context = gsap.context(() => {
      const mood = chapter.cameraMood;

      if (!isMobile) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: `pin-${chapter.id}`,
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=130%',
            scrub: 1,
            pin: true,
            anticipatePin: 1
          }
        });

        timeline
          .fromTo(bgRef.current, { yPercent: 0 }, { yPercent: mood.bgTravel, ease: mood.ease }, 0)
          .fromTo(midRef.current, { yPercent: 0 }, { yPercent: mood.midTravel, ease: mood.ease }, 0)
          .fromTo(foreRef.current, { yPercent: 0 }, { yPercent: mood.fgTravel, ease: mood.ease }, 0);
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: isMobile ? 'top bottom' : 'top top',
        end: isMobile ? 'bottom top' : '+=130%',
        onUpdate: (self) => {
          if (!motifRef.current) return;
          const envelope = getMotifEnvelope(self.progress);
          motifRef.current.style.opacity = `${(chapter.motifTiming.maxOpacity * envelope).toFixed(3)}`;
        }
      });
    }, sectionRef);

    return () => context.revert();
  }, [chapter, isMobile]);

  return (
    <section
      ref={sectionRef}
      id={chapter.id}
      className={`relative isolate overflow-hidden border-b border-amber-500/10 bg-[#120f0d] ${
        isMobile ? 'min-h-[76vh] py-16' : 'min-h-screen'
      }`}
    >
      <div
        className="parallax-layer absolute"
        ref={bgRef}
        style={{
          ...bgOverscan,
          ...layerStyle(chapter.layers.background, chapter.layerAssetRefs.background, photos.background, 'background', chapter.id)
        }}
      />

      <div
        className="parallax-layer absolute"
        ref={midRef}
        style={{
          ...midOverscan,
          ...layerStyle(
            chapter.layers.midground,
            chapter.layerAssetRefs.midground,
            photos.midground,
            'midground',
            chapter.id,
            false,
            sharedBackgroundMid
          )
        }}
      />

      <div
        className="parallax-layer absolute"
        ref={foreRef}
        style={{
          ...foreOverscan,
          ...layerStyle(
            chapter.layers.foreground,
            chapter.layerAssetRefs.foreground,
            photos.foreground,
            'foreground',
            chapter.id,
            !isMobile,
            sharedBackgroundFore
          )
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: chapter.colorGrade,
          mixBlendMode: 'soft-light',
          opacity: 0.88
        }}
      />

      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: chapter.focalHighlight,
            mixBlendMode: 'screen',
            opacity: 0.8
          }}
        />
        {accents.map((accent, idx) => (
          <span
            key={`${chapter.id}-accent-${idx}`}
            className={`pointer-events-none absolute rounded-full ${accent.className}`}
            style={accent.style}
            aria-hidden="true"
          />
        ))}
      </div>

      <span
        ref={motifRef}
        className={`pointer-events-none absolute inset-0 ${
          isActive ? 'opacity-100' : 'opacity-0'
        } motif-${chapter.transitionMotif}`}
        style={{ animationDuration: `${chapter.motifTiming.durationMs}ms` }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/70" />
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-[14] h-8 bg-gradient-to-b from-[#120f0d] to-transparent" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: chapterVignette[chapter.id] ?? 'radial-gradient(ellipse at center, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
          mixBlendMode: 'multiply',
          opacity: 0.76
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-[min(100%,1000px)] items-center px-4 py-28 md:px-10">
        <article
          className={`manuscript-card w-full rounded-xl p-6 shadow-manuscript transition-transform duration-500 md:p-8 ${
            isActive ? 'scale-[1.01]' : 'scale-100'
          } ${isMobile ? '' : 'max-w-3xl'} `}
        >
          <p className="font-display text-sm uppercase tracking-[0.22em] text-amber-300/90">Chapter {chapter.roman}</p>
          <h2 className="mt-2 font-display text-3xl leading-tight text-amber-100 md:text-5xl">{chapter.title}</h2>
          <p className="mt-2 font-body text-lg text-stone-100/90 md:text-xl">{chapter.era}</p>
          <p className="mt-4 font-body text-base leading-7 text-stone-100/95 md:text-lg">{chapter.narrative}</p>

          <button
            type="button"
            onClick={() => onOpenScripture(chapter)}
            className="mt-6 inline-flex items-center rounded-md border border-amber-400/35 bg-amber-400/10 px-4 py-2 font-body text-sm tracking-wide text-amber-100 transition-colors hover:bg-amber-400/20"
          >
            [{chapter.scriptureRef}] Open Illuminated Study Drawer
          </button>
        </article>
      </div>
    </section>
  );
}
