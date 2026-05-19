import { ref, watch, onMounted } from 'vue';

const STORAGE_KEY = 'regex_history';
const MAX_ITEMS = 50;

export function useHistory() {
  const history = ref([]);
  const isLoaded = ref(false);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        history.value = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load history:', e);
    }
    isLoaded.value = true;
  };

  const saveHistory = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value));
    } catch (e) {
      console.warn('Failed to save history:', e);
    }
  };

  const addEntry = (pattern, flags, testString) => {
    if (!pattern.trim()) return;

    const existingIndex = history.value.findIndex(
      (item) => item.pattern === pattern && item.flags === flags
    );

    if (existingIndex !== -1) {
      history.value[existingIndex].testString = testString;
      history.value[existingIndex].timestamp = Date.now();

      const [moved] = history.value.splice(existingIndex, 1);
      history.value.unshift(moved);
    } else {
      history.value.unshift({
        pattern,
        flags,
        testString,
        timestamp: Date.now(),
      });

      if (history.value.length > MAX_ITEMS) {
        history.value = history.value.slice(0, MAX_ITEMS);
      }
    }

    saveHistory();
  };

  const removeEntry = (index) => {
    history.value.splice(index, 1);
    saveHistory();
  };

  const clearHistory = () => {
    history.value = [];
    saveHistory();
  };

  const restoreEntry = (entry) => {
    return {
      pattern: entry.pattern,
      flags: entry.flags,
      testString: entry.testString,
    };
  };

  onMounted(() => {
    loadHistory();
  });

  return {
    history,
    isLoaded,
    addEntry,
    removeEntry,
    clearHistory,
    restoreEntry,
    loadHistory,
  };
}