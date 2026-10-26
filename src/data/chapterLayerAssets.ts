const svgLayer = (content: string) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900' preserveAspectRatio='xMidYMid slice'>${content}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const linenNoise = `
  <filter id='linen' x='-20%' y='-20%' width='140%' height='140%'>
    <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' />
    <feColorMatrix type='saturate' values='0'/>
    <feComponentTransfer><feFuncA type='table' tableValues='0 0.12'/></feComponentTransfer>
  </filter>
`;

export const sceneLayerAssets: Record<string, string> = {
  'chapter-i-bg': svgLayer(`
    <defs>
      ${linenNoise}
      <linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='#88a982'/><stop offset='100%' stop-color='#2f3d31'/></linearGradient>
    </defs>
    <rect width='1600' height='900' fill='url(#sky)'/>
    <path d='M0 620 L220 410 L460 560 L700 340 L920 580 L1180 400 L1410 560 L1600 430 L1600 900 L0 900Z' fill='#374b39' opacity='0.72'/>
    <path d='M0 700 L210 560 L430 650 L670 520 L920 680 L1160 560 L1360 650 L1600 540 L1600 900 L0 900Z' fill='#263427' opacity='0.82'/>
    <rect width='1600' height='900' filter='url(#linen)'/>
  `),
  'chapter-i-mid': svgLayer(`
    <defs>
      <radialGradient id='fruit' cx='50%' cy='40%' r='60%'><stop offset='0%' stop-color='#c87b40'/><stop offset='100%' stop-color='#7a3d22'/></radialGradient>
    </defs>
    <path d='M780 740 C775 590 818 495 830 400 C844 495 886 590 882 740Z' fill='#513726'/>
    <ellipse cx='830' cy='386' rx='145' ry='105' fill='#5f7f49'/>
    <ellipse cx='830' cy='428' rx='165' ry='76' fill='#4c693c'/>
    <g opacity='0.95'>
      <circle cx='780' cy='640' r='17' fill='#3d2a20'/><rect x='765' y='655' width='30' height='130' rx='14' fill='#3d2a20'/>
      <circle cx='875' cy='638' r='17' fill='#463025'/><rect x='860' y='653' width='30' height='130' rx='14' fill='#463025'/>
      <path d='M780 705 Q825 680 875 705' stroke='#2f2119' stroke-width='8' fill='none'/>
    </g>
    <circle cx='770' cy='450' r='10' fill='url(#fruit)'/><circle cx='860' cy='470' r='10' fill='url(#fruit)'/><circle cx='900' cy='430' r='10' fill='url(#fruit)'/>
  `),
  'chapter-i-fg': svgLayer(`
    <path d='M0 900 L0 708 C140 680 250 780 365 720 C500 650 620 765 760 700 C900 632 1010 770 1180 700 C1330 640 1450 780 1600 718 L1600 900Z' fill='#2a1e17' opacity='0.95'/>
    <path d='M80 900 C120 760 180 748 250 760 C220 835 190 872 168 900Z' fill='#3d2c21'/>
    <path d='M1480 900 C1440 760 1380 748 1310 760 C1340 835 1370 872 1392 900Z' fill='#3d2c21'/>
  `),

  'chapter-ii-bg': svgLayer(`
    <rect width='1600' height='900' fill='#10131d'/>
    <g fill='#f8ecd0' opacity='0.9'>
      <circle cx='190' cy='110' r='2'/><circle cx='360' cy='160' r='1.7'/><circle cx='520' cy='90' r='1.8'/><circle cx='670' cy='140' r='1.9'/><circle cx='890' cy='80' r='2.2'/><circle cx='1090' cy='130' r='1.7'/><circle cx='1290' cy='95' r='2'/><circle cx='1460' cy='150' r='1.8'/>
      <circle cx='240' cy='210' r='1.6'/><circle cx='420' cy='240' r='1.4'/><circle cx='830' cy='220' r='1.6'/><circle cx='1180' cy='235' r='1.5'/>
    </g>
    <path d='M0 760 L190 700 L340 730 L530 670 L740 705 L900 655 L1120 710 L1360 680 L1600 730 L1600 900 L0 900Z' fill='#35281d'/>
  `),
  'chapter-ii-mid': svgLayer(`
    <path d='M640 800 L720 650 L820 622 L950 660 L1040 800Z' fill='#584029'/>
    <path d='M720 730 L820 650 L950 730 Z' fill='#6b4b31' opacity='0.5'/>
    <rect x='780' y='650' width='22' height='105' rx='10' fill='#2e231c'/>
    <circle cx='791' cy='634' r='12' fill='#2e231c'/>
    <ellipse cx='885' cy='665' rx='62' ry='42' fill='rgba(216,146,79,0.35)'/>
    <ellipse cx='885' cy='665' rx='34' ry='24' fill='rgba(242,191,100,0.58)'/>
    <path d='M874 625 L898 625 L904 660 L868 660Z' fill='rgba(255,184,98,0.65)'/>
  `),
  'chapter-ii-fg': svgLayer(`
    <path d='M0 900 L0 790 C140 760 320 830 470 770 C650 700 880 810 1070 750 C1280 680 1470 810 1600 770 L1600 900Z' fill='#251b14' opacity='0.96'/>
    <path d='M460 900 C480 815 515 790 570 780 C548 845 526 882 505 900Z' fill='#3c2a1f'/>
  `),

  'chapter-iii-bg': svgLayer(`
    <rect width='1600' height='900' fill='#132436'/>
    <path d='M0 900 L0 70 C120 122 220 215 310 325 C392 428 438 545 480 900Z' fill='rgba(106,181,219,0.64)'/>
    <path d='M1600 900 L1600 70 C1480 122 1380 215 1290 325 C1208 428 1162 545 1120 900Z' fill='rgba(106,181,219,0.64)'/>
    <rect x='756' y='60' width='88' height='760' fill='rgba(255,214,136,0.23)'/>
  `),
  'chapter-iii-mid': svgLayer(`
    <rect x='790' y='550' width='20' height='205' rx='10' fill='#2d231e'/>
    <rect x='712' y='556' width='128' height='16' rx='8' transform='rotate(-19 712 556)' fill='#3d3026'/>
    <g fill='#3f3127'>
      <rect x='585' y='695' width='26' height='92' rx='10'/><circle cx='598' cy='680' r='12'/>
      <rect x='640' y='705' width='20' height='82' rx='9'/><circle cx='650' cy='693' r='10'/>
      <rect x='930' y='700' width='24' height='88' rx='10'/><circle cx='942' cy='686' r='11'/>
      <rect x='1002' y='710' width='18' height='76' rx='9'/><circle cx='1011' cy='699' r='9'/>
    </g>
    <path d='M410 820 C520 756 660 792 760 756 C880 716 1010 804 1135 758 C1240 724 1320 780 1400 756 L1400 900 L410 900Z' fill='#8a6e49' opacity='0.9'/>
  `),
  'chapter-iii-fg': svgLayer(`
    <path d='M0 900 L0 760 C130 720 250 800 390 740 C510 690 670 790 820 730 C990 660 1140 800 1320 730 C1430 690 1510 740 1600 730 L1600 900Z' fill='#103048' opacity='0.95'/>
  `),

  'chapter-iv-bg': svgLayer(`
    <rect width='1600' height='900' fill='#2f2823'/>
    <path d='M0 720 L210 470 L430 590 L680 430 L900 600 L1110 500 L1320 620 L1600 480 L1600 900 L0 900Z' fill='#5a4b3a' opacity='0.82'/>
  `),
  'chapter-iv-mid': svgLayer(`
    <path d='M660 820 L728 468 L872 468 L940 820Z' fill='#7c5d38'/>
    <path d='M690 468 L800 406 L910 468Z' fill='#9f7b4d'/>
    <ellipse cx='800' cy='360' rx='160' ry='84' fill='rgba(229,220,185,0.36)'/>
    <path d='M625 820 L646 700 L694 700 L716 820Z' fill='#4f3928'/>
    <rect x='642' y='716' width='52' height='56' rx='8' fill='#2d5b79'/>
    <rect x='656' y='730' width='24' height='28' rx='5' fill='#d6af52'/>
    <path d='M895 820 L914 706 L962 706 L984 820Z' fill='#4f3928'/>
    <rect x='792' y='612' width='22' height='136' rx='10' fill='#3b2d22'/><circle cx='803' cy='595' r='13' fill='#3b2d22'/>
  `),
  'chapter-iv-fg': svgLayer(`
    <path d='M0 900 L0 760 C150 730 310 790 490 740 C660 690 830 780 980 730 C1130 680 1310 790 1600 740 L1600 900Z' fill='#2b2118' opacity='0.96'/>
  `),

  'chapter-v-bg': svgLayer(`
    <defs><radialGradient id='lamp' cx='50%' cy='43%'><stop offset='0%' stop-color='rgba(255,209,140,0.58)'/><stop offset='100%' stop-color='rgba(54,39,28,0.02)'/></radialGradient></defs>
    <rect width='1600' height='900' fill='#2a1f18'/>
    <ellipse cx='800' cy='380' rx='470' ry='280' fill='url(#lamp)'/>
  `),
  'chapter-v-mid': svgLayer(`
    <path d='M510 820 L620 420 L980 420 L1090 820Z' fill='#644a31'/>
    <rect x='736' y='700' width='130' height='50' rx='14' fill='#8b6a45'/>
    <ellipse cx='800' cy='716' rx='30' ry='15' fill='#d5bd95'/>
    <g fill='#403024'>
      <rect x='700' y='640' width='28' height='124' rx='12'/><circle cx='714' cy='625' r='12'/>
      <rect x='872' y='640' width='28' height='124' rx='12'/><circle cx='886' cy='625' r='12'/>
      <rect x='612' y='690' width='20' height='90' rx='10'/><circle cx='622' cy='678' r='10'/>
      <rect x='970' y='692' width='20' height='90' rx='10'/><circle cx='980' cy='680' r='10'/>
    </g>
    <path d='M785 470 L815 470 L808 520 L792 520Z' fill='rgba(255,206,123,0.65)'/>
  `),
  'chapter-v-fg': svgLayer(`
    <path d='M0 900 L0 780 C140 760 260 820 420 760 C600 700 760 810 950 760 C1120 720 1320 810 1600 770 L1600 900Z' fill='#261c16' opacity='0.96'/>
  `),

  'chapter-vi-bg': svgLayer(`
    <defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='#62788d'/><stop offset='100%' stop-color='#172a3d'/></linearGradient></defs>
    <rect width='1600' height='900' fill='url(#s)'/>
    <path d='M0 430 C170 360 350 490 520 430 C700 370 900 510 1080 440 C1240 380 1430 470 1600 430 L1600 530 L0 530Z' fill='rgba(71,97,124,0.5)'/>
  `),
  'chapter-vi-mid': svgLayer(`
    <path d='M450 725 C560 665 990 665 1110 725 C1072 785 988 815 780 815 C610 815 520 790 450 725Z' fill='#5f442f'/>
    <rect x='780' y='550' width='20' height='175' rx='10' fill='#3b2d23'/>
    <rect x='785' y='550' width='140' height='16' transform='rotate(-11 785 550)' rx='8' fill='#3b2d23'/>
    <g fill='#3f3025'>
      <rect x='640' y='672' width='16' height='74' rx='8'/><circle cx='648' cy='660' r='8'/>
      <rect x='690' y='666' width='18' height='80' rx='8'/><circle cx='699' cy='652' r='9'/>
      <rect x='915' y='670' width='16' height='74' rx='8'/><circle cx='923' cy='658' r='8'/>
      <rect x='970' y='675' width='16' height='70' rx='8'/><circle cx='978' cy='663' r='8'/>
    </g>
    <rect x='760' y='620' width='24' height='102' rx='10' fill='#3a2b22'/><circle cx='772' cy='604' r='11' fill='#3a2b22'/>
    <path d='M180 860 C330 760 490 840 640 760 C820 660 1000 840 1180 760 C1340 700 1460 790 1600 740 L1600 900 L0 900 L0 800Z' fill='rgba(37,92,124,0.84)'/>
  `),
  'chapter-vi-fg': svgLayer(`
    <path d='M0 900 L0 760 C180 700 360 820 560 730 C730 660 940 820 1140 730 C1330 650 1450 760 1600 710 L1600 900Z' fill='#14354d' opacity='0.96'/>
  `),

  'chapter-vii-bg': svgLayer(`
    <defs><linearGradient id='d' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='#66514f'/><stop offset='42%' stop-color='#3a2f2f'/><stop offset='100%' stop-color='#2c231f'/></linearGradient></defs>
    <rect width='1600' height='900' fill='url(#d)'/>
    <circle cx='1180' cy='190' r='90' fill='rgba(252,226,167,0.26)'/>
    <path d='M0 780 L240 640 L450 710 L700 620 L980 710 L1220 620 L1600 700 L1600 900 L0 900Z' fill='#3a2f2a'/>
  `),
  'chapter-vii-mid': svgLayer(`
    <ellipse cx='860' cy='720' rx='112' ry='70' fill='#6b5944'/>
    <rect x='710' y='700' width='170' height='68' rx='16' fill='#7e6a52'/>
    <circle cx='900' cy='690' r='34' fill='#bca57e'/>
    <rect x='520' y='530' width='16' height='180' rx='8' fill='#3d2f26'/><rect x='486' y='588' width='84' height='12' rx='6' fill='#3d2f26'/>
    <rect x='760' y='718' width='72' height='10' rx='5' fill='#e5dbc7'/><rect x='750' y='734' width='84' height='10' rx='5' fill='#dfd4be'/>
    <rect x='975' y='710' width='20' height='92' rx='10' fill='#3f3026'/><circle cx='985' cy='696' r='10' fill='#3f3026'/>
    <path d='M968 738 L1002 738 L996 790 L974 790Z' fill='#e7dfcb'/>
    <rect x='1028' y='718' width='18' height='84' rx='9' fill='#3f3026'/><circle cx='1037' cy='705' r='9' fill='#3f3026'/>
    <path d='M1022 744 L1052 744 L1048 790 L1026 790Z' fill='#e7dfcb'/>
  `),
  'chapter-vii-fg': svgLayer(`
    <path d='M0 900 L0 780 C180 740 290 810 470 760 C660 700 820 800 1010 760 C1220 710 1400 800 1600 760 L1600 900Z' fill='#271d19' opacity='0.96'/>
  `),

  'chapter-viii-bg': svgLayer(`
    <defs><linearGradient id='n' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='#8baec3'/><stop offset='100%' stop-color='#2a4350'/></linearGradient></defs>
    <rect width='1600' height='900' fill='url(#n)'/>
    <circle cx='800' cy='180' r='240' fill='rgba(213,236,255,0.26)'/>
  `),
  'chapter-viii-mid': svgLayer(`
    <path d='M520 730 L580 430 L640 680 L700 360 L760 680 L820 300 L880 680 L940 370 L1000 690 L1060 430 L1120 730Z' fill='rgba(156,204,231,0.84)'/>
    <rect x='760' y='620' width='36' height='172' rx='16' fill='#6b5339'/>
    <ellipse cx='778' cy='575' rx='92' ry='66' fill='#7ea678'/><ellipse cx='778' cy='592' rx='112' ry='42' fill='#6a8f62'/>
    <path d='M320 790 C480 720 620 790 780 730 C920 680 1080 800 1240 740 L1240 840 C1100 870 940 840 780 860 C620 880 460 850 320 830Z' fill='rgba(122,183,206,0.72)'/>
    <g fill='#d9d1b8' opacity='0.88'><circle cx='630' cy='760' r='8'/><circle cx='860' cy='770' r='8'/><circle cx='980' cy='750' r='8'/><circle cx='1040' cy='768' r='8'/></g>
  `),
  'chapter-viii-fg': svgLayer(`
    <path d='M0 900 L0 790 C170 760 340 820 520 770 C700 710 900 820 1080 760 C1260 700 1420 780 1600 740 L1600 900Z' fill='#1c382f' opacity='0.96'/>
  `)
};
