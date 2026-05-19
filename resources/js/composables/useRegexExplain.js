import { computed } from 'vue';

const tokenPatterns = [
  { pattern: /^\\d/, type: 'digit', label: 'Dígito', description: 'Coincide con cualquier dígito (0-9)' },
  { pattern: /^\\D/, type: 'non-digit', label: 'No dígito', description: 'Coincide con cualquier carácter que no sea dígito' },
  { pattern: /^\\w/, type: 'word', label: 'Palabra', description: 'Coincide con letras, dígitos y guión bajo' },
  { pattern: /^\\W/, type: 'non-word', label: 'No palabra', description: 'Coincide con cualquier carácter que no sea palabra' },
  { pattern: /^\\s/, type: 'whitespace', label: 'Espacio', description: 'Coincide con espacios, tabs y saltos de línea' },
  { pattern: /^\\S/, type: 'non-whitespace', label: 'No espacio', description: 'Coincide con cualquier carácter que no sea espacio' },
  { pattern: /^\\b/, type: 'boundary', label: 'Límite', description: 'Coincide con el inicio o fin de una palabra' },
  { pattern: /^\\B/, type: 'non-boundary', label: 'No límite', description: 'Coincide donde no hay límite de palabra' },
  { pattern: /^\\n/, type: 'newline', label: 'Salto de línea', description: 'Coincide con un salto de línea' },
  { pattern: /^\\t/, type: 'tab', label: 'Tabulación', description: 'Coincide con un tab' },
  { pattern: /^\\r/, type: 'return', label: 'Retorno', description: 'Coincide con un retorno de carro' },
  { pattern: /^\^/, type: 'start', label: 'Inicio', description: 'Coincide con el inicio de la cadena' },
  { pattern: /^\$/, type: 'end', label: 'Fin', description: 'Coincide con el fin de la cadena' },
  { pattern: /^\./, type: 'any', label: 'Cualquiera', description: 'Coincide con cualquier carácter excepto salto de línea' },
  { pattern: /^\*/, type: 'zero-plus', label: 'Cero o más', description: 'Coincide con el elemento anterior 0 o más veces' },
  { pattern: /^\+/, type: 'one-plus', label: 'Uno o más', description: 'Coincide con el elemento anterior 1 o más veces' },
  { pattern: /^\?/, type: 'optional', label: 'Opcional', description: 'Coincide con el elemento anterior 0 o 1 vez' },
  { pattern: /^\|/, type: 'or', label: 'O', description: 'Coincide con la expresión anterior O la siguiente' },
  { pattern: /^\{/, type: 'quantifier', label: 'Repeticiones', description: 'Especifica número exacto de repeticiones' },
  { pattern: /^\(/, type: 'group-start', label: 'Grupo', description: 'Inicia un grupo de captura' },
  { pattern: /^\)/, type: 'group-end', label: 'Fin grupo', description: 'Termina un grupo de captura' },
  { pattern: /^\[/, type: 'char-class-start', label: 'Clase', description: 'Inicia una clase de caracteres' },
  { pattern: /^\]/, type: 'char-class-end', label: 'Fin clase', description: 'Termina una clase de caracteres' },
  { pattern: /^\\/, type: 'escape', label: 'Escape', description: 'Escapa un carácter especial' },
];

const charClassDescriptions = {
  'a-z': 'letras minúsculas',
  'A-Z': 'letras mayúsculas',
  '0-9': 'dígitos',
  'a-zA-Z': 'todas las letras',
  'a-zA-Z0-9': 'letras y dígitos',
};

export function useRegexExplain(pattern) {
  const explanation = computed(() => {
    if (!pattern.value) return [];

    const tokens = [];
    let remaining = pattern.value;
    let pos = 0;

    while (remaining.length > 0) {
      let matched = false;

      for (const { pattern: p, type, label, description } of tokenPatterns) {
        const match = remaining.match(p);
        if (match) {
          tokens.push({
            token: match[0],
            type,
            label,
            description,
            position: pos,
          });

          remaining = remaining.slice(match[0].length);
          pos += match[0].length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        const char = remaining[0];
        tokens.push({
          token: char,
          type: 'literal',
          label: `Carácter "${char}"`,
          description: 'Coincide exactamente con este carácter',
          position: pos,
        });
        remaining = remaining.slice(1);
        pos++;
      }
    }

    return tokens.map((token, index) => {
      if (token.type === 'char-class-start') {
        const closeIndex = pattern.value.indexOf(']', token.position);
        if (closeIndex !== -1) {
          const classContent = pattern.value.slice(token.position + 1, closeIndex);
          let classDesc = 'Clase de caracteres';

          for (const [key, desc] of Object.entries(charClassDescriptions)) {
            if (classContent.includes(key)) {
              classDesc = desc;
              break;
            }
          }

          if (classContent.startsWith('^')) {
            token.description = `Negación - coincide con cualquier carácter EXCEPTO: ${classDesc}`;
            token.label = 'Negación';
          } else {
            token.description = `Coincide con: ${classDesc}`;
          }
        }
      }

      if (token.type === 'quantifier') {
        const match = token.token.match(/\{(\d+)(?:,(\d*))?\}/);
        if (match) {
          if (match[2] === undefined) {
            token.description = `Exactamente ${match[1]} veces`;
          } else if (match[2] === '') {
            token.description = `${match[1]} o más veces`;
          } else {
            token.description = `Entre ${match[1]} y ${match[2]} veces`;
          }
        }
      }

      if (token.type === 'group-start' && index + 1 < tokens.length) {
        const nextToken = tokens[index + 1];
        if (nextToken.token === '?') {
          if (index + 2 < tokens.length && tokens[index + 2].token === ':') {
            token.label = 'Grupo no capturador';
            token.description = 'Agrupa sin capturar';
          } else if (index + 2 < tokens.length && tokens[index + 2].token === '=') {
            token.label = 'Lookahead positivo';
            token.description = 'Busca adelante sin incluir';
          } else if (index + 2 < tokens.length && tokens[index + 2].token === '!') {
            token.label = 'Lookahead negativo';
            token.description = 'Busca adelante que NO coincida';
          }
        }
      }

      return token;
    });
  });

  const summary = computed(() => {
    if (!explanation.value.length) return '';

    const parts = [];
    const types = new Set();

    for (const token of explanation.value) {
      if (token.type !== 'literal') {
        types.add(token.label);
      }
    }

    if (types.has('Inicio') && types.has('Fin')) {
      parts.push('Coincidencia exacta');
    } else if (types.has('Inicio')) {
      parts.push('Busca al inicio');
    } else if (types.has('Fin')) {
      parts.push('Busca al final');
    }

    if (types.has('Grupo') || types.has('Fin grupo')) {
      parts.push('Usa grupos');
    }

    if (types.has('Clase') || types.has('Fin clase')) {
      parts.push('Usa clases de caracteres');
    }

    return parts.length > 0 ? parts.join(' | ') : 'Patrón básico';
  });

  return {
    explanation,
    summary,
  };
}