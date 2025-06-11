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
import { MatToolbarModule } from '@angular/material/toolbar';

import { FireAuth } from '@fireauth2/angular';
import { AccessType, Prompt } from '@fireauth2/core';

@Component({
  selector: 'fa-login-page',
  imports: [CommonModule, MatButtonModule, MatToolbarModule],
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
  private readonly fireAuth2 = inject(FireAuth);
  private readonly document = inject(DOCUMENT);

  isServer = false;
  readonly isUser = signal(false);

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
    // can be parsed by FireAuth2, which is only the case when the
    // FireAuth server redirects the user to this page.
    await this.fireAuth2.tryFinishLogin();
  }

  async login() {
    await this.fireAuth2.startLogin({
      scope: [
        'email',
        'openid',
        'profile',
        'https://www.googleapis.com/auth/gmail.readonly',
      ],
      include_granted_scopes: true,
      access_type: AccessType.Offline,
      prompt: Prompt.Consent,
      redirect_uri: this.document.defaultView?.location.href,
    });
  }
}
