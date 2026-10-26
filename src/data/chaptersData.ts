export type ChapterAudioProfile = {
  baseFrequency: number;
  detuneCents: number;
  textureAmount: number;
  brightness: number;
};

export type StoryChapterData = {
  id: string;
  roman: string;
  era: string;
  title: string;
  scriptureRef: string;
  narrative: string;
  theologicalSummary: string;
  crossReferences: string[];
  layers: {
    background: string;
    midground: string;
    foreground: string;
  };
  layerAssetRefs: {
    background: string;
    midground: string;
    foreground: string;
  };
  colorGrade: string;
  focalHighlight: string;
  cameraMood: {
    bgTravel: number;
    midTravel: number;
    fgTravel: number;
    ease: string;
    breatheScale: number;
  };
  transitionMotif:
    | 'none'
    | 'embers'
    | 'star-glint'
    | 'spray'
    | 'shekinah'
    | 'lamp-glow'
    | 'calm-ring'
    | 'veil-flash'
    | 'new-dawn';
  motifTiming: {
    entryStart: number;
    entryEnd: number;
    holdUntil: number;
    exitEnd: number;
    maxOpacity: number;
    durationMs: number;
  };
  audio: ChapterAudioProfile;
};

export const chaptersData: StoryChapterData[] = [
  {
    id: 'chapter-i',
    roman: 'I',
    era: 'Eden & Fracture',
    title: 'The Garden and the Fracture',
    scriptureRef: 'Genesis 2–3',
    narrative:
      'In Eden, humanity receives breath, vocation, and communion. Yet the forbidden tree becomes the site of rupture: distrust of God, exile from the garden, and mortality’s long shadow. Still, amid judgment, a promise emerges that the serpent will not have the last word.',
    theologicalSummary:
      'Creation begins in ordered goodness, but sin fractures trust, vocation, and relationship. Genesis 3 announces the Protoevangelium: a coming offspring who will crush evil through suffering. Redemptive history opens not with human ascent, but with divine initiative after the fall.',
    crossReferences: ['Genesis 3:15', 'Romans 5:12–21', 'Revelation 22:1–3'],
    layers: {
      background:
        'radial-gradient(circle at 30% 25%, #79966e 0%, #4e5f4b 35%, #2f3b32 70%, #222320 100%)',
      midground:
        'linear-gradient(165deg, rgba(176,127,72,0.65) 0%, rgba(85,70,56,0.85) 46%, rgba(49,41,34,0.92) 100%)',
      foreground:
        'linear-gradient(90deg, rgba(54,42,35,0.84) 0%, rgba(95,66,44,0.18) 35%, rgba(54,42,35,0.84) 100%)'
    },
    layerAssetRefs: { background: 'chapter-i-bg', midground: 'chapter-i-mid', foreground: 'chapter-i-fg' },
    colorGrade: 'radial-gradient(circle at 52% 18%, rgba(235,198,122,0.16), rgba(63,36,24,0.28) 58%, rgba(13,11,10,0.42) 100%)',
    focalHighlight: 'radial-gradient(circle at 52% 42%, rgba(222,198,132,0.20), rgba(222,198,132,0.0) 45%)',
    cameraMood: { bgTravel: -11, midTravel: -39, fgTravel: -70, ease: 'sine.inOut', breatheScale: 1.008 },
    transitionMotif: 'embers',
    motifTiming: { entryStart: 0.06, entryEnd: 0.22, holdUntil: 0.74, exitEnd: 0.95, maxOpacity: 0.68, durationMs: 5600 },
    audio: { baseFrequency: 145, detuneCents: -8, textureAmount: 0.22, brightness: 0.45 }
  },
  {
    id: 'chapter-ii',
    roman: 'II',
    era: 'Stars & Covenant',
    title: 'The Covenant of the Stars',
    scriptureRef: 'Genesis 15',
    narrative:
      'Abram stands beneath an impossible sky while God names descendants as countless as the stars. At nightfall, a smoking firepot and blazing torch pass between severed offerings, signaling that God alone bears covenant fidelity and judgment.',
    theologicalSummary:
      'Genesis 15 grounds salvation in promise received by faith. The covenant ceremony reveals unilateral grace: God binds Himself to fulfill what humanity cannot secure. The seed promise narrows toward a people through whom blessing reaches all nations.',
    crossReferences: ['Genesis 12:1–3', 'Romans 4:1–8', 'Galatians 3:6–16'],
    layers: {
      background:
        'radial-gradient(circle at 50% 8%, #3c4966 0%, #1f2940 30%, #161a26 65%, #0f0f14 100%)',
      midground:
        'linear-gradient(180deg, rgba(76,56,34,0.45) 0%, rgba(49,37,27,0.82) 50%, rgba(30,23,18,0.95) 100%)',
      foreground:
        'linear-gradient(100deg, rgba(17,14,12,0.8) 0%, rgba(111,83,45,0.22) 50%, rgba(17,14,12,0.8) 100%)'
    },
    layerAssetRefs: { background: 'chapter-ii-bg', midground: 'chapter-ii-mid', foreground: 'chapter-ii-fg' },
    colorGrade: 'radial-gradient(circle at 50% 12%, rgba(130,146,194,0.16), rgba(31,28,36,0.35) 60%, rgba(10,9,13,0.52) 100%)',
    focalHighlight: 'radial-gradient(circle at 56% 52%, rgba(255,188,108,0.18), rgba(255,188,108,0) 40%)',
    cameraMood: { bgTravel: -13, midTravel: -36, fgTravel: -66, ease: 'power1.inOut', breatheScale: 1.006 },
    transitionMotif: 'star-glint',
    motifTiming: { entryStart: 0.1, entryEnd: 0.27, holdUntil: 0.8, exitEnd: 0.96, maxOpacity: 0.63, durationMs: 6400 },
    audio: { baseFrequency: 121, detuneCents: -2, textureAmount: 0.35, brightness: 0.4 }
  },
  {
    id: 'chapter-iii',
    roman: 'III',
    era: 'Sea & Deliverance',
    title: 'The Waters and the Staff',
    scriptureRef: 'Exodus 14',
    narrative:
      'Hemmed in by Pharaoh and sea, Israel faces impossible odds. At the command of God, Moses lifts his staff, waters rise like walls, and families cross on dry ground while the pursuing chariots are overwhelmed.',
    theologicalSummary:
      'The exodus becomes Scripture’s archetype of salvation: liberation by divine power, not human strategy. Passing through the waters marks judgment on oppressors and covenant freedom for God’s people, anticipating baptismal imagery and final deliverance.',
    crossReferences: ['Exodus 14:13–14', '1 Corinthians 10:1–4', 'Hebrews 11:29'],
    layers: {
      background:
        'radial-gradient(circle at 50% 0%, #7ea8c5 0%, #3e6080 28%, #20384f 62%, #111a24 100%)',
      midground:
        'linear-gradient(180deg, rgba(58,108,139,0.82) 0%, rgba(24,53,74,0.9) 52%, rgba(11,28,40,0.96) 100%)',
      foreground:
        'linear-gradient(90deg, rgba(164,196,215,0.26) 0%, rgba(22,59,84,0.85) 28%, rgba(164,196,215,0.26) 100%)'
    },
    layerAssetRefs: { background: 'chapter-iii-bg', midground: 'chapter-iii-mid', foreground: 'chapter-iii-fg' },
    colorGrade: 'radial-gradient(circle at 50% 14%, rgba(246,210,138,0.2), rgba(34,67,92,0.36) 56%, rgba(8,17,25,0.48) 100%)',
    focalHighlight: 'radial-gradient(circle at 50% 40%, rgba(255,214,141,0.22), rgba(255,214,141,0) 48%)',
    cameraMood: { bgTravel: -14, midTravel: -43, fgTravel: -80, ease: 'power1.out', breatheScale: 1.01 },
    transitionMotif: 'spray',
    motifTiming: { entryStart: 0.04, entryEnd: 0.16, holdUntil: 0.58, exitEnd: 0.83, maxOpacity: 0.8, durationMs: 2400 },
    audio: { baseFrequency: 98, detuneCents: 4, textureAmount: 0.52, brightness: 0.5 }
  },
  {
    id: 'chapter-iv',
    roman: 'IV',
    era: 'Tabernacle Glory',
    title: 'The Glory in the Wilderness',
    scriptureRef: 'Exodus 40',
    narrative:
      'In the wilderness camp, every tribe orients around the tabernacle. As priestly ministry begins, the cloud of glory descends, filling the tent so completely that even Moses stands outside in awe.',
    theologicalSummary:
      'God’s redeemed people are gathered into ordered worship where holiness, mediation, and sacrifice structure access. The dwelling presence among Israel foreshadows Emmanuel and the eventual indwelling of God with humanity in the new creation.',
    crossReferences: ['Exodus 40:34–38', 'Leviticus 16', 'John 1:14'],
    layers: {
      background:
        'radial-gradient(circle at 68% 16%, #a18e68 0%, #6d5d43 32%, #453a2e 62%, #2b2520 100%)',
      midground:
        'linear-gradient(170deg, rgba(158,119,61,0.52) 0%, rgba(72,55,37,0.86) 46%, rgba(33,27,23,0.95) 100%)',
      foreground:
        'linear-gradient(90deg, rgba(92,69,42,0.83) 0%, rgba(212,175,55,0.16) 50%, rgba(92,69,42,0.83) 100%)'
    },
    layerAssetRefs: { background: 'chapter-iv-bg', midground: 'chapter-iv-mid', foreground: 'chapter-iv-fg' },
    colorGrade: 'radial-gradient(circle at 50% 20%, rgba(244,220,168,0.2), rgba(73,53,36,0.34) 56%, rgba(12,10,9,0.44) 100%)',
    focalHighlight: 'radial-gradient(circle at 50% 34%, rgba(249,236,189,0.22), rgba(249,236,189,0) 42%)',
    cameraMood: { bgTravel: -10, midTravel: -34, fgTravel: -60, ease: 'sine.inOut', breatheScale: 1.006 },
    transitionMotif: 'shekinah',
    motifTiming: { entryStart: 0.12, entryEnd: 0.28, holdUntil: 0.82, exitEnd: 0.97, maxOpacity: 0.68, durationMs: 5000 },
    audio: { baseFrequency: 110, detuneCents: -5, textureAmount: 0.48, brightness: 0.36 }
  },
  {
    id: 'chapter-v',
    roman: 'V',
    era: 'Incarnation',
    title: 'The Word Made Flesh',
    scriptureRef: 'Luke 2; John 1',
    narrative:
      'In a modest shelter, divine majesty arrives in swaddling cloths. Shepherds hear good news for all people, and the eternal Word takes on flesh, entering history not by spectacle, but humility.',
    theologicalSummary:
      'The incarnation unites true divinity and true humanity in one person. God does not merely send a message; He comes Himself. The promised seed and covenant hope converge in Jesus, light entering darkness to begin new creation.',
    crossReferences: ['Isaiah 9:2–7', 'John 1:1–14', 'Philippians 2:5–11'],
    layers: {
      background:
        'radial-gradient(circle at 50% 18%, #b98e54 0%, #7a5c3c 34%, #4f3a28 64%, #2f2319 100%)',
      midground:
        'linear-gradient(180deg, rgba(161,119,72,0.58) 0%, rgba(88,62,42,0.84) 55%, rgba(43,31,23,0.95) 100%)',
      foreground:
        'linear-gradient(100deg, rgba(36,28,22,0.85) 0%, rgba(209,161,95,0.26) 50%, rgba(36,28,22,0.85) 100%)'
    },
    layerAssetRefs: { background: 'chapter-v-bg', midground: 'chapter-v-mid', foreground: 'chapter-v-fg' },
    colorGrade: 'radial-gradient(circle at 50% 30%, rgba(255,213,154,0.28), rgba(88,57,33,0.34) 52%, rgba(15,11,9,0.42) 100%)',
    focalHighlight: 'radial-gradient(circle at 50% 48%, rgba(255,218,156,0.25), rgba(255,218,156,0) 42%)',
    cameraMood: { bgTravel: -9, midTravel: -31, fgTravel: -56, ease: 'sine.inOut', breatheScale: 1.005 },
    transitionMotif: 'lamp-glow',
    motifTiming: { entryStart: 0.18, entryEnd: 0.34, holdUntil: 0.88, exitEnd: 0.98, maxOpacity: 0.62, durationMs: 4100 },
    audio: { baseFrequency: 196, detuneCents: 2, textureAmount: 0.2, brightness: 0.63 }
  },
  {
    id: 'chapter-vi',
    roman: 'VI',
    era: 'Authority Over Chaos',
    title: 'The Master of the Deep',
    scriptureRef: 'Mark 4',
    narrative:
      'Wind whips across Galilee and fear grips seasoned sailors. Jesus rises, rebukes the storm, and a great calm falls over the waters. The disciples ask who this is, that even sea and wind obey.',
    theologicalSummary:
      'The stilling of the storm reveals Christ’s divine authority over creation’s chaos. The sign points beyond weather to salvation itself: fear is displaced by faith because the Lord of covenant and cosmos stands in the boat with His people.',
    crossReferences: ['Psalm 107:23–30', 'Mark 4:35–41', 'Colossians 1:15–20'],
    layers: {
      background:
        'radial-gradient(circle at 50% 0%, #6a7b93 0%, #34465e 36%, #1c2d42 62%, #101722 100%)',
      midground:
        'linear-gradient(182deg, rgba(84,121,151,0.75) 0%, rgba(33,65,94,0.9) 52%, rgba(18,38,56,0.98) 100%)',
      foreground:
        'linear-gradient(90deg, rgba(19,35,49,0.86) 0%, rgba(121,158,186,0.22) 50%, rgba(19,35,49,0.86) 100%)'
    },
    layerAssetRefs: { background: 'chapter-vi-bg', midground: 'chapter-vi-mid', foreground: 'chapter-vi-fg' },
    colorGrade: 'radial-gradient(circle at 50% 20%, rgba(126,148,173,0.16), rgba(25,50,73,0.38) 60%, rgba(8,15,24,0.52) 100%)',
    focalHighlight: 'radial-gradient(circle at 49% 44%, rgba(198,225,240,0.14), rgba(198,225,240,0) 40%)',
    cameraMood: { bgTravel: -15, midTravel: -45, fgTravel: -82, ease: 'power1.out', breatheScale: 1.012 },
    transitionMotif: 'calm-ring',
    motifTiming: { entryStart: 0.05, entryEnd: 0.17, holdUntil: 0.44, exitEnd: 0.78, maxOpacity: 0.78, durationMs: 3200 },
    audio: { baseFrequency: 87, detuneCents: 7, textureAmount: 0.62, brightness: 0.42 }
  },
  {
    id: 'chapter-vii',
    roman: 'VII',
    era: 'Cross & Resurrection',
    title: 'The Veil Torn and the Empty Garden',
    scriptureRef: 'Luke 23–24',
    narrative:
      'Darkness covers midday as the crucified Messiah breathes His last and the temple veil tears. At dawn, women find the stone rolled away and hear the announcement: He is not here, but risen.',
    theologicalSummary:
      'At the cross, sin is judged and reconciliation secured; at the empty tomb, death is conquered. The torn veil signifies open access to God through Christ’s priestly sacrifice, and resurrection inaugurates the age of new creation.',
    crossReferences: ['Isaiah 53', 'Luke 23:44–46', '1 Corinthians 15:20–28'],
    layers: {
      background:
        'radial-gradient(circle at 50% 20%, #826b63 0%, #463733 45%, #2f2522 72%, #1b1614 100%)',
      midground:
        'linear-gradient(170deg, rgba(98,57,57,0.56) 0%, rgba(63,45,44,0.86) 44%, rgba(31,25,24,0.95) 100%)',
      foreground:
        'linear-gradient(90deg, rgba(31,24,22,0.86) 0%, rgba(196,164,118,0.2) 48%, rgba(31,24,22,0.86) 100%)'
    },
    layerAssetRefs: {
      background: 'chapter-vii-bg',
      midground: 'chapter-vii-mid',
      foreground: 'chapter-vii-fg'
    },
    colorGrade: 'radial-gradient(circle at 72% 18%, rgba(247,220,160,0.2), rgba(84,52,44,0.34) 52%, rgba(11,9,9,0.5) 100%)',
    focalHighlight: 'radial-gradient(circle at 57% 45%, rgba(253,233,182,0.20), rgba(253,233,182,0) 40%)',
    cameraMood: { bgTravel: -12, midTravel: -37, fgTravel: -68, ease: 'sine.inOut', breatheScale: 1.009 },
    transitionMotif: 'veil-flash',
    motifTiming: { entryStart: 0.03, entryEnd: 0.09, holdUntil: 0.24, exitEnd: 0.42, maxOpacity: 0.9, durationMs: 1500 },
    audio: { baseFrequency: 164, detuneCents: -10, textureAmount: 0.38, brightness: 0.58 }
  },
  {
    id: 'chapter-viii',
    roman: 'VIII',
    era: 'New Creation',
    title: 'The City and the Restored Tree',
    scriptureRef: 'Revelation 21–22',
    narrative:
      'The holy city descends in radiant splendor. The river of life runs clear from God’s throne, the tree yields healing fruit, and nations walk in light where curse and night are no more.',
    theologicalSummary:
      'Scripture’s final vision resolves every covenant trajectory: God dwells with His people, tears are ended, and creation is restored. The story that began in a garden reaches consummation in a city-garden where communion is eternal.',
    crossReferences: ['Ezekiel 47:1–12', 'Revelation 21:1–5', 'Revelation 22:1–5'],
    layers: {
      background:
        'radial-gradient(circle at 50% 8%, #9fb9c5 0%, #6b8d9f 30%, #3a5666 62%, #212f37 100%)',
      midground:
        'linear-gradient(180deg, rgba(122,170,192,0.56) 0%, rgba(63,102,126,0.84) 50%, rgba(33,55,68,0.95) 100%)',
      foreground:
        'linear-gradient(95deg, rgba(35,58,67,0.84) 0%, rgba(212,175,55,0.28) 50%, rgba(35,58,67,0.84) 100%)'
    },
    layerAssetRefs: {
      background: 'chapter-viii-bg',
      midground: 'chapter-viii-mid',
      foreground: 'chapter-viii-fg'
    },
    colorGrade: 'radial-gradient(circle at 50% 18%, rgba(228,248,255,0.18), rgba(61,103,126,0.3) 54%, rgba(11,19,24,0.4) 100%)',
    focalHighlight: 'radial-gradient(circle at 50% 39%, rgba(228,247,255,0.22), rgba(228,247,255,0) 42%)',
    cameraMood: { bgTravel: -10, midTravel: -33, fgTravel: -58, ease: 'sine.inOut', breatheScale: 1.007 },
    transitionMotif: 'new-dawn',
    motifTiming: { entryStart: 0.2, entryEnd: 0.42, holdUntil: 0.95, exitEnd: 1, maxOpacity: 0.64, durationMs: 7200 },
    audio: { baseFrequency: 220, detuneCents: 0, textureAmount: 0.18, brightness: 0.74 }
  }
];
