import { CommonModule, isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { FireAuth } from '@fireauth2/angular';
import { AccessType, Prompt } from '@fireauth2/core';

import {
  CalendarDiscoveryDocument,
  DiscoveryDocumentClass,
  GmailDiscoveryDocument,
  Scope,
} from '../../../core/auth';
import { AuthScopeSelectionComponent } from '../../components/auth-scopes-selection/auth-scopes-selection.component';
import { GitHubLogoComponent } from '../../components/github-mark-logo/github-mark-logo.component';
import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import appConstants from '../../../core/constants/app.constants';

const MATERIAL_COMPONENTS = [
  MatButtonModule,
  MatToolbarModule,
  MatProgressSpinner,
  MatCard,
  MatCardTitle,
  MatCardContent,
  MatCardHeader,
  MatTooltip,
  MatIcon,
];

@Component({
  selector: 'fa-login-page',
  imports: [
    CommonModule,
    AuthScopeSelectionComponent,
    GitHubLogoComponent,
    ThemeSwitcherComponent,
    ...MATERIAL_COMPONENTS,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fa-page fa-login-page',
  },
})
export default class LoginPage {
  private readonly auth = inject(Auth);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fireAuth = inject(FireAuth);
  private readonly document = inject(DOCUMENT);

  readonly appConstants = appConstants;

  isServer = false;
  readonly isUser = signal(false);
  readonly scopes = signal<Scope[]>([]);

  readonly discoveryDocuments: DiscoveryDocumentClass[] = [
    GmailDiscoveryDocument,
    CalendarDiscoveryDocument,
  ];

  constructor() {
    ssrLoginScreenGlitchFix: {
      // When using SSR, no user exists at the first render (server).
      // Consequently, the login page is briefly rendered even though the user is authenticated
      // after the next render (browser).
      // This behavior is far from ideal, in terms of user experience - to say the least.
      //
      // We can prevent the glitch by showing a splash screen on first render.
      // See the template of this page.
      this.isServer = isPlatformServer(this.platformId);
      if (this.auth.currentUser) {
        this.isUser.set(true);
      }
    }
  }

  async ngOnInit(): Promise<void> {
    // Try finishing the authorization process, if applicable.
    // This will only take effect if valid authorization response parameters
    // can be parsed by FireAuth, which is only the case when the
    // FireAuth server redirects the user to this page.
    await this.fireAuth.tryFinishLogin();
  }

  async login() {
    const defaultScopes = ['email', 'openid', 'profile'];
    const userDefinedScopes = this.scopes().map((scope) => scope.id);
    const scopes = [...defaultScopes, ...userDefinedScopes];

    await this.fireAuth.startLogin({
      scope: scopes,
      include_granted_scopes: true,
      access_type: AccessType.Offline,
      prompt: Prompt.Consent,
      redirect_uri: this.document.defaultView?.location.href,
    });
  }
}
