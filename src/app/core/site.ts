/** Business details shown across the site. Change them here and they update everywhere. */
export const SITE = {
  name: 'Miamora',
  url: 'https://miamora.co.za',
  ogImage: '/images/og-image.jpg',
  email: 'info@miamora.co.za',
  /** Shown to visitors. */
  phoneDisplay: '071 547 7921',
  /** International format without "+" or spaces, as wa.me expects. */
  whatsappNumber: '27715477921',
  address: ['14 Lindenberg Avenue', 'Valmary Park', 'Durbanville', 'Western Cape'],
  socialHandle: '@miamoraparfum',
  instagram: 'https://www.instagram.com/miamoraparfum',
  facebook: 'https://www.facebook.com/miamoraparfum',
} as const;

export const PRODUCT = {
  name: 'Miamora Eau de Parfum',
  inspiredBy: 'Jean Paul Gaultier Scandal',
  /** Price per bottle in rand. */
  price: 250,
  sizeMl: 50,
} as const;

/** "R250" style price, without cents. */
export const formatRand = (amount: number): string => `R${amount.toLocaleString('en-ZA')}`;
