import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import appConstants from './core/constants/app.constants';

@Component({
  imports: [RouterModule],
  selector: 'fa-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'fa-app',
  },
})
export class AppComponent {
  readonly title = appConstants.appName;

  constructor() {
    const matIconRegistry = inject(MatIconRegistry);
    matIconRegistry.setDefaultFontSetClass('material-symbols-rounded');
  }
}
