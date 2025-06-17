export interface Scope {
  id: string;
  description: string;
}

export abstract class DiscoveryDocument {
  constructor() {
    if (new.target === DiscoveryDocument) {
      throw new Error('Cannot instantiate abstract class DiscoveryDocument');
    }
  }
}

export type DiscoveryDocumentClass<
  T extends DiscoveryDocument = DiscoveryDocument,
> = {
  new (): T;
  readonly canonicalName: string;
  readonly description: string;
  readonly shortDescription: string;
  readonly logoUrl: string;
  readonly scopes: Scope[];
  get lightweightScopes(): Scope[];
};
