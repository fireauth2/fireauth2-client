import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FireAuth } from '@fireauth2/angular';

export const MAT_COMPONENTS = [
  MatIconModule,
  MatButtonModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTooltipModule,
];

@Component({
  imports: [MAT_COMPONENTS],
  selector: 'fa-admin-page',
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fa-page fa-admin-page',
  },
})
export default class AdminPage {
  private readonly router = inject(Router);
  private readonly fireAuth2 = inject(FireAuth);
  readonly auth = inject(Auth);

  readonly isSidenavEndOpened = signal(false);

  async logout() {
    await this.fireAuth2.logout();
    await this.router.navigate(['login']);
  }
}
