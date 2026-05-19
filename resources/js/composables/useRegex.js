import { ref, computed, watch } from 'vue';

export function useRegex(initialPattern = '', initialFlags = 'g', initialTestString = '') {
  const pattern = ref(initialPattern);
  const flags = ref(initialFlags);
  const testString = ref(initialTestString);
  const replaceWith = ref('');
  const error = ref(null);

  const hasFlag = (flag) => flags.value.includes(flag);

  const toggleFlag = (flag) => {
    if (hasFlag(flag)) {
      flags.value = flags.value.replace(flag, '');
    } else {
      flags.value += flag;
    }
  };

  const regex = computed(() => {
    if (!pattern.value) return null;

    try {
      error.value = null;
      return new RegExp(pattern.value, flags.value);
    } catch (e) {
      error.value = e.message;
      return null;
    }
  });

  const matches = computed(() => {
    if (!regex.value || !testString.value) return [];

    const results = [];
    let match;

    if (hasFlag('g')) {
      while ((match = regex.value.exec(testString.value)) !== null) {
        results.push({
          fullMatch: match[0],
          index: match.index,
          groups: match.slice(1),
          namedGroups: match.groups || {},
          input: match.input,
        });

        if (match[0].length === 0) {
          regex.value.lastIndex++;
        }
      }
    } else {
      match = regex.value.exec(testString.value);
      if (match) {
        results.push({
          fullMatch: match[0],
          index: match.index,
          groups: match.slice(1),
          namedGroups: match.groups || {},
          input: match.input,
        });
      }
    }

    return results;
  });

  const matchCount = computed(() => matches.value.length);

  const replacedString = computed(() => {
    if (!regex.value || !testString.value || !replaceWith.value) return testString.value;

    try {
      return testString.value.replace(regex.value, replaceWith.value);
    } catch {
      return testString.value;
    }
  });

  const highlightedText = computed(() => {
    if (!matches.value.length || !testString.value) return testString.value;

    const parts = [];
    let lastIndex = 0;

    for (const match of matches.value) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: testString.value.slice(lastIndex, match.index),
        });
      }

      parts.push({
        type: 'match',
        content: match.fullMatch,
        groups: match.groups,
        index: match.index,
      });

      lastIndex = match.index + match.fullMatch.length;
    }

    if (lastIndex < testString.value.length) {
      parts.push({
        type: 'text',
        content: testString.value.slice(lastIndex),
      });
    }

    return parts;
  });

  const isValid = computed(() => {
    if (!pattern.value) return true;
    return regex.value !== null;
  });

  return {
    pattern,
    flags,
    testString,
    replaceWith,
    error,
    regex,
    matches,
    matchCount,
    replacedString,
    highlightedText,
    isValid,
    hasFlag,
    toggleFlag,
  };
}