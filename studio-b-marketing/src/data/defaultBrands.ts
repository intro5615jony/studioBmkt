export interface BrandItem {
  id?: string;
  name: string;
  logoUrl: string;
  url?: string;
  status: 'Ativa' | 'Oculta';
  order: number;
}

const createSvgDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

export const DEFAULT_BRANDS: BrandItem[] = [
  {
    name: 'FIBRA TELECOM',
    logoUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 36" fill="#43210D">
        <path d="M12 6L2 22h12l-2 10 16-18H18l4-8z" fill="#E17541"/>
        <text x="36" y="24" font-family="sans-serif" font-weight="900" font-size="18" fill="#43210D">FIBRA</text>
        <text x="100" y="24" font-family="sans-serif" font-weight="700" font-size="12" fill="#CE892C">TELECOM</text>
      </svg>
    `),
    url: '',
    status: 'Ativa',
    order: 0,
  },
  {
    name: 'CONNECT NETWORK',
    logoUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 36" fill="#43210D">
        <circle cx="12" cy="18" r="8" stroke="#E17541" stroke-width="3" fill="none" />
        <circle cx="24" cy="18" r="5" stroke="#CE892C" stroke-width="2.5" fill="none" />
        <path d="M12 18h12" stroke="#43210D" stroke-width="2" />
        <text x="36" y="24" font-family="sans-serif" font-weight="800" font-size="18" fill="#43210D">CONNECT</text>
        <text x="126" y="24" font-family="monospace" font-weight="500" font-size="10" fill="#E17541">NET</text>
      </svg>
    `),
    url: '',
    status: 'Ativa',
    order: 1,
  },
  {
    name: 'NETMAIS FIBRA',
    logoUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 36" fill="#43210D">
        <path d="M6 26V10l10 16V10M20 18h6" stroke="#E17541" stroke-width="3" stroke-linecap="round" fill="none" />
        <text x="34" y="24" font-family="sans-serif" font-weight="900" font-size="18" fill="#43210D">NETMAIS</text>
        <text x="122" y="24" font-family="sans-serif" font-weight="700" font-size="12" fill="#CE892C">FIBRA</text>
      </svg>
    `),
    url: '',
    status: 'Ativa',
    order: 2,
  },
  {
    name: 'LINK TELECOM',
    logoUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 36" fill="#43210D">
        <path d="M8 12a6 6 0 016 6v0a6 6 0 01-6 6M20 12a6 6 0 016 6v0a6 6 0 01-6 6M10 18h12" stroke="#E17541" stroke-width="3" stroke-linecap="round" fill="none" />
        <text x="32" y="24" font-family="sans-serif" font-weight="900" font-size="18" fill="#43210D">LINK</text>
        <text x="82" y="24" font-family="sans-serif" font-weight="500" font-size="12" fill="#CE892C">TELECOM</text>
      </svg>
    `),
    url: '',
    status: 'Ativa',
    order: 3,
  },
  {
    name: 'GIGA FIBRA',
    logoUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 36" fill="#43210D">
        <polygon points="14,4 26,11 26,25 14,32 2,25 2,11" stroke="#E17541" stroke-width="2.5" fill="none" />
        <circle cx="14" cy="18" r="4" fill="#E17541" />
        <text x="34" y="24" font-family="sans-serif" font-weight="900" font-size="18" fill="#43210D">GIGA</text>
        <text x="86" y="24" font-family="sans-serif" font-weight="700" font-size="12" fill="#CE892C">FIBRA</text>
      </svg>
    `),
    url: '',
    status: 'Ativa',
    order: 4,
  },
  {
    name: 'ALFA TELECOM',
    logoUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 36" fill="#43210D">
        <path d="M12 6L2 28h20L12 6zm0 10l5 10H7l5-10z" fill="#E17541" />
        <text x="28" y="24" font-family="sans-serif" font-weight="900" font-size="18" fill="#43210D">ALFA</text>
        <text x="80" y="24" font-family="sans-serif" font-weight="500" font-size="12" fill="#CE892C">TELECOM</text>
      </svg>
    `),
    url: '',
    status: 'Ativa',
    order: 5,
  },
  {
    name: 'COLMEIA TECH',
    logoUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 36" fill="#43210D">
        <path d="M10 6l8 4.6v9.2L10 24.4 2 19.8V10.6L10 6z" fill="none" stroke="#E17541" stroke-width="2.5" />
        <path d="M22 12l6 3.5v7L22 26l-6-3.5v-7l6-3.5z" fill="none" stroke="#CE892C" stroke-width="2" />
        <text x="34" y="24" font-family="sans-serif" font-weight="900" font-size="18" fill="#43210D">COLMEIA</text>
        <text x="120" y="24" font-family="monospace" font-weight="700" font-size="12" fill="#E17541">TECH</text>
      </svg>
    `),
    url: '',
    status: 'Ativa',
    order: 6,
  },
  {
    name: 'APEX CONNECT',
    logoUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 165 36" fill="#43210D">
        <path d="M4 28L16 6l12 22H4zm12-14l-5 9h10l-5-9z" fill="#E17541" />
        <text x="32" y="24" font-family="sans-serif" font-weight="900" font-size="18" fill="#43210D">APEX</text>
        <text x="88" y="24" font-family="sans-serif" font-weight="700" font-size="12" fill="#CE892C">CONNECT</text>
      </svg>
    `),
    url: '',
    status: 'Ativa',
    order: 7,
  },
];
