import { ImageKey } from './image-manifest';

/** Link to Miamora's reviews on Google (also used for "Leave a review"). */
export const GOOGLE_REVIEWS_URL =
  'https://www.google.com/search?q=miamora#mpd=~15701372536868873231/customers/reviews';

export interface Review {
  /** Reviewer's first name and initial, as shown on the site. */
  readonly author: string;
  /** 1–5. */
  readonly rating: number;
  /** Month the review was left, e.g. "August 2026". */
  readonly date: string;
  /** One entry per paragraph. */
  readonly text: readonly string[];
  /** Optional photo from the review; add the original to images-src/ and run `npm run images`. */
  readonly photo?: { readonly src: ImageKey; readonly alt: string };
}

/** Copied from Google reviews. Newest first. */
export const REVIEWS: readonly Review[] = [
  {
    author: 'Anel Lubbe',
    rating: 5,
    date: 'October 2026',
    text: [
      'I absolutely love this perfume! It smells wonderful and lasts many hours. True value for money and the bottle looks pretty too! The service was great!',
    ],
  },
  {
    author: 'Nikitah J.',
    rating: 5,
    date: 'August 2026',
    text: [
      'Honestly, I’m OBSESSED 😭🤍',
      'The scent, the smell, the lasting power?! Ughhh. I barely have to use a lot and it lasts sooo long.',
      'I’ve been loving this perfume and I still have it on me even hours later! ✨',
    ],
  },
];
