import { ref, watch } from 'vue';

const STORAGE_KEY = 'theme';

const isDark = ref(false);
const isInitialized = ref(false);

function setTheme(dark) {
  isDark.value = dark;

  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
}

function initTheme() {
  if (isInitialized.value) return;
  isInitialized.value = true;

  const stored = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const shouldBeDark = stored ? stored === 'dark' : prefersDark;
  setTheme(shouldBeDark);
}

function toggleTheme() {
  initTheme();
  setTheme(!isDark.value);
}

if (typeof window !== 'undefined') {
  initTheme();
  
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(e.matches);
    }
  });
}

export function useTheme() {
  return {
    isDark,
    setTheme,
    toggleTheme,
    initTheme
  };
}