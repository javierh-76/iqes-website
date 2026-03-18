// Application constants

export const COMPANY = {
  name: 'IQES Low Voltage Solutions',
  legalName: 'IQES LLC',
  tagline: 'Innovation & Quality Engineering Services',
  email: 'info@iqeslowvoltage.com',
  emailProjects: 'projects1@iqeslowvoltage.com',
  phone: '386-603-9541', // Main public number
  // Internal transfer numbers (not public - used by virtual agent only)
  _internal: {
    transferEnglish: '305-926-6419',
    transferSpanish: '954-643-2668',
  },
  address: 'South Florida', // Update when defined
  logo: '/logo-dark-bg.jpg',
  logoLight: '/logo-light-bg.png',
};

export const COLORS = {
  primary: '#003366', // Navy blue (matches logo)
  white: '#FFFFFF',
  accent: '#00A651', // Green from logo
  orange: '#FF6B00', // Orange accent (for S in logo)
  cta: '#D32F2F', // Red for CTAs/alerts
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF',
  },
  background: {
    light: '#F9FAFB',
    dark: '#111827',
  },
};

export const SERVICE_TYPES = [
  { value: 'fiber-optic', label: 'Fiber Optic Installation & Splicing', labelEs: 'Instalación y Empalme de Fibra Óptica' },
  { value: 'cctv', label: 'CCTV Systems', labelEs: 'Sistemas CCTV' },
  { value: 'structured-cabling', label: 'Structured Cabling', labelEs: 'Cableado Estructurado' },
  { value: 'access-control', label: 'Access Control', labelEs: 'Control de Acceso' },
  { value: 'networking', label: 'Networking Solutions', labelEs: 'Soluciones de Redes' },
];

export const SERVICE_AREAS = [
  { city: 'Jacksonville', lat: 30.3322, lng: -81.6557 },
  { city: 'Orlando', lat: 28.5383, lng: -81.3792 },
  { city: 'Tampa', lat: 27.9506, lng: -82.4572 },
  { city: 'Tallahassee', lat: 30.4383, lng: -84.2807 },
  { city: 'Miami', lat: 25.7617, lng: -80.1918 },
  { city: 'West Palm Beach', lat: 26.7153, lng: -80.0534 },
];

export const COVERAGE_RADIUS = 150; // miles

export const BUDGET_RANGES = [
  { value: 'under-5k', label: 'Under $5,000', labelEs: 'Menos de $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000', labelEs: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000', labelEs: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000', labelEs: '$25,000 - $50,000' },
  { value: '50k-plus', label: '$50,000+', labelEs: '$50,000+' },
];

export const CONTACT_METHODS = [
  { value: 'email', label: 'Email', labelEs: 'Correo Electrónico' },
  { value: 'phone', label: 'Phone', labelEs: 'Teléfono' },
  { value: 'both', label: 'Both', labelEs: 'Ambos' },
];

export const BLOG_CATEGORIES = [
  { value: 'tips', label: 'Tips & Tricks', labelEs: 'Consejos y Trucos' },
  { value: 'news', label: 'Industry News', labelEs: 'Noticias de la Industria' },
  { value: 'case-studies', label: 'Case Studies', labelEs: 'Estudios de Caso' },
  { value: 'how-to', label: 'How-To Guides', labelEs: 'Guías Prácticas' },
];

export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'application/vnd.google-earth.kmz',
  'application/acad',
  'application/x-autocad',
  'application/dxf',
];

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB for single-part upload
