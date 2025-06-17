const THEME_STORAGE_KEY = 'theme';

const Theme = {
  Light: 'light',
  Dark: 'dark',
};

const prefersColorScheme = (scheme) => {
  return window.matchMedia(`(prefers-color-scheme: ${scheme})`).matches;
};

const isThemeEnabled = (theme) => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const noThemeStored = storedTheme == null;
  const isStoredTheme = storedTheme === theme;
  return isStoredTheme || (noThemeStored && prefersColorScheme(theme));
};

(() => {
  document.documentElement.classList.toggle(
    Theme.Light,
    isThemeEnabled(Theme.Light),
  );

  document.documentElement.classList.toggle(
    Theme.Dark,
    isThemeEnabled(Theme.Dark),
  );
})();
