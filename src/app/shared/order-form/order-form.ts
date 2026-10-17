import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DELIVERY,
  PRODUCT,
  SAMPLE,
  SITE,
  SPECIAL,
  bottlesTotal,
  formatRand,
  specialLabel,
} from '../../core/site';

/** Bottles order, or a free sample on its own. */
type Kind = 'bottles' | 'sample';
/** courier/pickup for bottles; collect/drop-off (Durbanville only) for a sample on its own. */
type Delivery = 'courier' | 'pickup' | 'sample-collect' | 'sample-dropoff';

const MAX_QUANTITY = 20;
const ADDRESS_MAX = 400;

/**
 * Order form. There is no server: submitting builds the order as a WhatsApp message and opens
 * wa.me with it pre-filled, so the customer only has to press Send.
 */
@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss',
})
export class OrderForm {
  private readonly document = inject(DOCUMENT);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly maxQuantity = MAX_QUANTITY;
  protected readonly unitPrice = formatRand(PRODUCT.price);
  protected readonly special = specialLabel();
  protected readonly sampleMl = SAMPLE.sizeMl;
  protected readonly courierCost = formatRand(DELIVERY.courierCost);
  protected readonly courierTime = DELIVERY.courierTime;

  protected readonly form = this.fb.group({
    kind: this.fb.control<Kind>('bottles'),
    name: ['', [Validators.required, Validators.maxLength(80)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s()-]{9,20}$/)]],
    email: ['', [Validators.email, Validators.maxLength(120)]],
    quantity: [1, [Validators.required, Validators.min(1), Validators.max(MAX_QUANTITY)]],
    addSample: [false],
    delivery: this.fb.control<Delivery | null>(null, Validators.required),
    address: ['', Validators.maxLength(ADDRESS_MAX)],
    notes: ['', Validators.maxLength(500)],
  });

  private readonly value = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  protected readonly isSample = computed(() => this.value().kind === 'sample');
  protected readonly needsAddress = computed(() =>
    ['courier', 'sample-dropoff'].includes(this.value().delivery ?? ''),
  );
  protected readonly total = computed(() => {
    const qty = Number(this.value().quantity);
    return Number.isInteger(qty) && qty >= 1 && qty <= MAX_QUANTITY
      ? formatRand(bottlesTotal(qty))
      : null;
  });
  /** True when the special lowers the total (2+ bottles). */
  protected readonly specialApplied = computed(() => {
    const qty = Number(this.value().quantity);
    return !!SPECIAL && qty >= SPECIAL.quantity;
  });

  /** Set after a valid submit; the WhatsApp link stays available in case the pop-up was blocked. */
  protected readonly sentUrl = signal<string | null>(null);
  protected readonly emailUrl = signal<string | null>(null);
  protected readonly submitted = signal(false);

  constructor() {
    const { kind, quantity, delivery, address } = this.form.controls;

    // Switching between bottles and a sample changes which delivery options exist.
    kind.valueChanges.subscribe((k) => {
      delivery.reset(null);
      if (k === 'sample') quantity.disable();
      else quantity.enable();
    });

    // An address is needed for courier orders and sample drop-offs.
    delivery.valueChanges.subscribe((d) => {
      address.setValidators(
        d === 'courier' || d === 'sample-dropoff'
          ? [Validators.required, Validators.maxLength(ADDRESS_MAX)]
          : Validators.maxLength(ADDRESS_MAX),
      );
      address.updateValueAndValidity();
    });
  }

  /** Switches the form to a free sample (used by the "Try a sample" section). */
  requestSample(): void {
    if (this.sentUrl()) this.startOver();
    this.form.controls.kind.setValue('sample');
  }

  protected changeQuantity(step: number): void {
    const control = this.form.controls.quantity;
    const next = Math.min(MAX_QUANTITY, Math.max(1, (Number(control.value) || 0) + step));
    control.setValue(next);
    control.markAsDirty();
  }

  protected showError(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.document.querySelector<HTMLElement>('.order-form .ng-invalid:not(form)')?.focus();
      return;
    }

    const message = this.buildMessage();
    const subject = this.isSample() ? 'Miamora sample request' : 'Miamora order';
    const whatsapp = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
    const email =
      `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(message)}`;
    this.sentUrl.set(whatsapp);
    this.emailUrl.set(email);
    this.document.defaultView?.open(whatsapp, '_blank', 'noopener');
  }

  protected startOver(): void {
    this.form.reset();
    this.submitted.set(false);
    this.sentUrl.set(null);
    this.emailUrl.set(null);
  }

  private buildMessage(): string {
    const v = this.form.getRawValue();
    const sample = `${SAMPLE.sizeMl}ml sample`;
    const lines = [
      v.kind === 'sample'
        ? `Hi Miamora! I'd love to try a free ${sample}.`
        : `Hi Miamora! I'd like to place an order.`,
      ``,
      `Name: ${v.name.trim()}`,
      `Contact number: ${v.phone.trim()}`,
    ];
    if (v.email.trim()) lines.push(`Email: ${v.email.trim()}`);
    lines.push(``);

    if (v.kind === 'sample') {
      lines.push(
        `Sample: Free ${sample}`,
        v.delivery === 'sample-dropoff'
          ? `Delivery: Please drop it off in Durbanville`
          : `Delivery: I'll collect it in Durbanville`,
      );
      if (v.delivery === 'sample-dropoff') lines.push(`Address: ${v.address.trim()}`);
    } else {
      const total = formatRand(bottlesTotal(v.quantity));
      const courier = v.delivery === 'courier';
      lines.push(
        `Quantity: ${v.quantity} × ${PRODUCT.sizeMl}ml Eau de Parfum`,
        `Total: ${total}` +
          (this.specialApplied() ? ` (${this.special} special)` : '') +
          (courier ? ` + courier (about ${this.courierCost})` : ''),
      );
      if (v.addSample) lines.push(`Please add a free ${sample}`);
      lines.push(
        courier
          ? `Delivery: Courier to me (I'll pay in full by EFT)`
          : `Delivery: I'll collect in Durbanville (EFT or cash on collection)`,
      );
      if (courier) lines.push(`Delivery address: ${v.address.trim()}`);
    }

    if (v.notes.trim()) lines.push(``, `Special requests: ${v.notes.trim()}`);
    return lines.join('\n');
  }
}
