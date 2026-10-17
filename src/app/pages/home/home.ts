import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImageKey } from '../../data/image-manifest';
import { PRODUCT, SITE, formatRand } from '../../core/site';
import { OrderForm } from '../../shared/order-form/order-form';
import { Picture } from '../../shared/picture/picture';

interface Reminder {
  readonly image: ImageKey;
  readonly alt: string;
  readonly title?: string;
  readonly paragraphs: readonly string[];
}

@Component({
  selector: 'app-home',
  imports: [Picture, OrderForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly site = SITE;
  protected readonly product = PRODUCT;
  protected readonly price = formatRand(PRODUCT.price);
  protected readonly year = new Date().getFullYear();

  protected readonly reminders: readonly Reminder[] = [
    {
      image: 'cards/gift',
      alt: 'A smiling woman holding a Miamora perfume bottle to her cheek',
      paragraphs: ['Planning a gift, celebration, or treat-yourself moment?'],
    },
    {
      image: 'cards/books',
      alt: 'A Miamora bottle standing on a stack of old books by a sunny window',
      paragraphs: [
        'Each bottle is crafted in small batches using quality French oils. For same-day confidence, give us a quick call!',
      ],
    },
    {
      image: 'cards/pricing',
      alt: 'A Miamora bottle lying on white lace',
      title: 'Sizes and Pricing',
      paragraphs: [
        `Each bottle contains ${PRODUCT.sizeMl}ml Eau de Parfum and is priced at ${formatRand(PRODUCT.price)}.`,
        'We courier nation-wide and your perfume is available for collection in Durbanville.',
      ],
    },
    {
      image: 'cards/hands',
      alt: 'Hands holding a Miamora bottle against soft pink fabric',
      paragraphs: [
        'Place your order 24–48 hours ahead to make sure it arrives fresh, elegant, and on time.',
      ],
    },
  ];
}
