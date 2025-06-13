import * as esbuild from 'esbuild';

const FIREAUTH_ENV_REGEX = /^FIREAUTH_/i;
const NAMESPACES = ['firebase'];

interface FilteredEnvVars {
  [key: string]: Record<string, string>;
}

function toCamelCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * An esbuild plugin that injects selected FIREAUTH_* environment variables
 * into the bundle under `process.env`, with camelCase keys and optional namespacing.
 *
 * Example:
 *   FIREAUTH_SERVER_URL => process.env.fireauth.serverUrl
 *   FIREAUTH_FIREBASE_PROJECT_ID => process.env.firebase.projectId
 */
const envVarPlugin: esbuild.Plugin = {
  name: 'env-var-plugin',
  setup(build) {
    const filtered: FilteredEnvVars = { fireauth: {} };

    for (const [key, value] of Object.entries(process.env)) {
      if (!FIREAUTH_ENV_REGEX.test(key) || value === undefined) continue;

      const stripped = key.replace(/^FIREAUTH_/, '');
      const [maybeNamespaceRaw, ...restRaw] = stripped.split('_');
      const maybeNamespace = maybeNamespaceRaw.toLowerCase();

      if (restRaw.length > 0 && NAMESPACES.includes(maybeNamespace)) {
        const namespace = toCamelCase(maybeNamespace);
        const field = toCamelCase(restRaw.join('_'));
        filtered[namespace] ??= {};
        filtered[namespace][field] = value;
      } else {
        const field = toCamelCase(stripped);
        filtered.fireauth[field] = value;
      }
    }

    build.initialOptions.define ??= {};
    build.initialOptions.define['process.env'] = JSON.stringify(filtered);
  },
};

export default envVarPlugin;
