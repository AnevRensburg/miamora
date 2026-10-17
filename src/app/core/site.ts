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
  /** Area only: the street address is shared on WhatsApp when an order is confirmed. */
  address: ['Valmary Park', 'Durbanville', 'Western Cape'],
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

/**
 * Multi-buy special shown in the top banner and applied to the order total.
 * Set to `null` to switch the special off everywhere.
 */
export const SPECIAL: { readonly quantity: number; readonly price: number } | null = {
  quantity: 2,
  price: 450,
};

export const SAMPLE = {
  sizeMl: 3,
} as const;

export const DELIVERY = {
  /** Approximate courier cost in rand. */
  courierCost: 70,
  courierTime: '1–2 working days',
} as const;

/** "R250" style price, without cents. */
export const formatRand = (amount: number): string => `R${amount.toLocaleString('en-ZA')}`;

/** Total for a number of bottles, applying the special to every full set (e.g. 3 = R450 + R250). */
export const bottlesTotal = (quantity: number): number =>
  SPECIAL
    ? Math.floor(quantity / SPECIAL.quantity) * SPECIAL.price +
      (quantity % SPECIAL.quantity) * PRODUCT.price
    : quantity * PRODUCT.price;

/** "2 for R450", or null when there is no special. */
export const specialLabel = (): string | null =>
  SPECIAL ? `${SPECIAL.quantity} for ${formatRand(SPECIAL.price)}` : null;
