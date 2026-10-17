import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageKey } from '../../data/image-manifest';
import {
  DELIVERY,
  PRODUCT,
  SAMPLE,
  SITE,
  bottlesTotal,
  formatRand,
  specialLabel,
} from '../../core/site';
import { OrderForm } from '../../shared/order-form/order-form';
import { Picture } from '../../shared/picture/picture';
import { Reviews } from '../../shared/reviews/reviews';

interface Reminder {
  readonly image: ImageKey;
  readonly alt: string;
  readonly title?: string;
  readonly paragraphs: readonly string[];
}

const special = specialLabel();
const price = formatRand(PRODUCT.price);

@Component({
  selector: 'app-home',
  imports: [RouterLink, Picture, OrderForm, Reviews],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly site = SITE;
  protected readonly product = PRODUCT;
  protected readonly price = price;
  protected readonly special = special;
  protected readonly sampleMl = SAMPLE.sizeMl;
  protected readonly courierCost = formatRand(DELIVERY.courierCost);
  protected readonly courierTime = DELIVERY.courierTime;
  /** How much the special saves on one set, for the banner. */
  protected readonly saving = formatRand(2 * PRODUCT.price - bottlesTotal(2));
  protected readonly year = new Date().getFullYear();

  protected readonly reminders: readonly Reminder[] = [
    {
      image: 'cards/gift',
      alt: 'A smiling woman holding a Miamora perfume bottle to her cheek',
      paragraphs: [
        'Planning a gift, celebration, or treat-yourself moment?',
        'A designer-inspired scent, beautifully bottled, without the designer price.',
      ],
    },
    {
      image: 'cards/books',
      alt: 'A Miamora bottle standing on a stack of old books by a sunny window',
      paragraphs: [
        'Each bottle is handcrafted in South Africa in small batches, using quality oils imported from France.',
        'For same-day confidence, give us a quick call!',
      ],
    },
    {
      image: 'cards/pricing',
      alt: 'A Miamora bottle lying on white lace',
      title: 'Sizes and Pricing',
      paragraphs: [
        `Each bottle contains ${PRODUCT.sizeMl}ml Eau de Parfum and is priced at ${price}` +
          (special ? `, or ${special} on our current special.` : '.'),
        `We courier nation-wide (about ${formatRand(DELIVERY.courierCost)}, ${DELIVERY.courierTime}) and your perfume is available for collection in Durbanville.`,
      ],
    },
    {
      image: 'cards/hands',
      alt: 'Hands holding a Miamora bottle against soft pink fabric',
      paragraphs: [
        'Place your order 24–48 hours ahead to make sure it arrives fresh, elegant, and on time.',
        `Not sure yet? Ask for a free ${SAMPLE.sizeMl}ml sample first.`,
      ],
    },
  ];
}
