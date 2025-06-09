# @fireauth2/angular

`@fireauth2/angular` provides the official Angular integration for [FireAuth2](https://github.com/ekkolon/fireauth2), a modern, secure authentication system built on Firebase and Google OAuth 2.0.

This package builds on the shared contracts and utilities provided by [`@fireauth2/core`](../core), and delivers a fully idiomatic Angular experience with support for Angular Signals, Dependency Injection, and server-side rendering (SSR).

---

## Features

- 🔐 Seamless authentication with Google OAuth 2.0 provider via FireAuth2
- 🧩 Angular-first design with injectable services, interceptors, and guards
- ⚡ Reactive state management using Angular Signals
- 🛠️ Flexible DI-based configuration and extension points
- 🌍 SSR compatibility with Angular Universal
- 🔒 Token validation, session handling, and secure route protection

---

## Installation

```bash
pnpm add @fireauth2/angular
```

## Getting Started

```ts
import { provideFireAuth2 } from '@fireauth2/angular';

bootstrapApplication(AppComponent, {
  providers: [
    provideFireAuth2({
      serverUrl: 'https://your-fireauth2-server.com',
    }),
  ],
});

```
