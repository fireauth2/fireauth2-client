import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  coerceCssPixelValue,
  coerceNumberProperty,
} from '@angular/cdk/coercion';

@Component({
  standalone: true,
  imports: [],
  selector: 'fa-github-logo',
  template: `<div class="fa-logo__image"></div>`,
  styleUrl: 'github-mark-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'fa-logo fa-github-logo',
    '[style.--fa-logo-size.px]': 'size()',
  },
})
export class GitHubLogoComponent {
  /** Rendered logo size in px */
  readonly size = input(24, { transform: coerceNumberProperty });
}
