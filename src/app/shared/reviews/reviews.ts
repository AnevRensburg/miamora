import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GOOGLE_REVIEWS_URL, REVIEWS } from '../../data/reviews';
import { Picture } from '../picture/picture';

@Component({
  selector: 'app-reviews',
  imports: [Picture],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews {
  protected readonly reviews = REVIEWS;
  protected readonly googleUrl = GOOGLE_REVIEWS_URL;
  protected readonly stars = [1, 2, 3, 4, 5];
}
