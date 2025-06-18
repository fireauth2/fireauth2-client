# FireAuth JavaScript SDK

JavaScript SDK and framework integrations for [FireAuth](https://github.com/fireauth2/fireauth2) servers.

> 🧪 **Experimental Software**
>
> This project is in an experimental state and **not production-ready** yet. It may lack features, contain bugs, and is subject to **breaking changes without notice**.
>
> You are welcome to fork and adapt this implementation to suit your specific needs, provided you comply with the terms of the [**license**](./LICENSE) included in this project.

All [FireAuth packages](#-packages) are published to the GitHub Packages Registry for now, though I may transition to the npm Registry at a later stage.

**You may be looking for**:

- [Packages](#-packages)
- [Usage](#-usage)
- [Examples](#-examples)
- [License](#️-license)

## 📦 Packages

- [`@fireauth2/core`](./packages/core/)

  Core, framework-agnostic logic used by all integrations.

- [`@fireauth2/angular`](./packages/angular/)

  Angular v20+ integration.

## 🚀 Usage

A running instance of the [FireAuth Server](https://github.com/fireauth2/fireauth2) is required to use this project. For demonstration purposes, the included [docker-compose.yaml](./docker-compose.yaml) spins up a service using the latest FireAuth Server Docker image... more on that in the [📌 Examples](#-examples) section.

**FireAuth**'s [`core library`](./packages/core/) is your go-to package if an integration for your preferred web framework isn’t available. It’s designed to be minimal and extensible, providing core contracts and utilities to manage Google OAuth 2.0 authorization requests, revoke tokens, retrieve token information, and more.

To build a custom integration, implement the [**`Auth`** interface](./packages/core/src/lib/contracts/Auth.ts), which defines the required contract for all FireAuth clients. For a concrete example, check out the [Angular implementation](./packages/angular/src/lib/fireauth.service.ts).

## 📌 Examples

All examples can be run using Docker. The [docker-compose.yaml](./docker-compose.yaml) file in the root of this project makes it easy to spin up each example application alongside the latest version of a FireAuth Server.

### [`Angular`](./examples/angular/)

Angular v20+ application with Google OAuth 2.0 as the primary source for signing in users. Refresh tokens are persisted in Cloud Firestore.

#### Run

This example uses environment variables to pass Firebase-specific client configuration to the Angular application.

In addition to [configuring the FireAuth Server](https://github.com/fireauth2/fireauth2?tab=readme-ov-file#2-run), you’ll need to provide all required [Firebase config](https://firebase.google.com/docs/web/learn-more#config-object) fields as environment variables.

To get started, copy the values from the [`.env.example`](./examples/angular/.env.example) file and replace them with your own:

```bash
docker compose up fireauth2 fireauth2-angular
```

## ⚖️ License

This project is licensed under the GNU Affero General Public License v3.0.

> © 2025 Nelson Dominguez
