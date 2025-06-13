import type { PluginBuild } from 'esbuild';
import envVarPlugin from './env-var.plugin';

function mockBuild(): { options: any; pluginBuild: PluginBuild } {
  const options: any = {};
  return {
    options,
    pluginBuild: {
      initialOptions: options,
      onResolve: () => {},
      onLoad: () => {},
    } as unknown as PluginBuild,
  };
}

describe('envVarPlugin', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      FIREAUTH_SERVER_URL: 'https://example.com',
      FIREAUTH_MESSAGING_SENDER_ID: '123456',
      FIREAUTH_FIREBASE_PROJECT_ID: 'my-firebase-id',
      FIREAUTH_FIREBASE_API_KEY: 'abc123',
      NODE_ENV: 'development', // Should be ignored
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('injects only FIREAUTH_* variables', () => {
    const { pluginBuild, options } = mockBuild();
    envVarPlugin.setup(pluginBuild);

    expect(options.define).toBeDefined();
    const result = JSON.parse(options.define['process.env']);

    expect(result.fireauth).toEqual({
      serverUrl: 'https://example.com',
      messagingSenderId: '123456',
    });

    expect(result.firebase).toEqual({
      projectId: 'my-firebase-id',
      apiKey: 'abc123',
    });

    expect(result.NODE_ENV).toBeUndefined();
  });

  it('handles missing namespaces gracefully', () => {
    process.env = {
      FIREAUTH_FOO_BAR: 'baz',
    };

    const { pluginBuild, options } = mockBuild();
    envVarPlugin.setup(pluginBuild);

    const result = JSON.parse(options.define['process.env']);
    expect(result.fireauth.fooBar).toBe('baz');
  });

  it('skips undefined values', () => {
    process.env = {
      FIREAUTH_TEST_KEY: undefined,
    };

    const { pluginBuild, options } = mockBuild();
    envVarPlugin.setup(pluginBuild);

    const result = JSON.parse(options.define['process.env']);
    expect(result.fireauth.testKey).toBeUndefined();
  });

  it('is idempotent with existing define', () => {
    const { pluginBuild, options } = mockBuild();
    options.define = { 'process.env.NODE_ENV': '"development"' };

    envVarPlugin.setup(pluginBuild);

    expect(options.define['process.env']).toBeDefined();
    expect(options.define['process.env.NODE_ENV']).toBe('"development"');
  });
});
