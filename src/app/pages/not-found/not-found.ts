import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="container">
      <p class="logo">Miamora</p>
      <h1>This page doesn't exist.</h1>
      <p><a routerLink="/">Back to the home page</a></p>
    </main>
  `,
  styles: `
    main {
      min-block-size: 100svh;
      display: grid;
      place-content: center;
      text-align: center;
      gap: 1rem;
    }
    .logo {
      font-family: var(--font-logo);
      font-size: 3rem;
      margin: 0;
    }
    h1 {
      font-family: var(--font-display);
      font-weight: 500;
      margin: 0;
    }
  `,
})
export class NotFound {
  constructor() {
    // 404.html is served for every unknown URL: keep it out of Google, and drop the homepage
    // canonical inherited from index.html so the two signals don't conflict.
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });
    inject(DOCUMENT).querySelector('link[rel="canonical"]')?.remove();
  }
}
