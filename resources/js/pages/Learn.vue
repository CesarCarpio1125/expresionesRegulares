<script setup>
import { ref, computed, onMounted } from 'vue';

const shareUrl = ref('');
const showShareToast = ref(false);

const handleShare = async () => {
  const url = window.location.origin + '/learn';
  try {
    await navigator.clipboard.writeText(url);
    shareUrl.value = url;
    showShareToast.value = true;
    setTimeout(() => (showShareToast.value = false), 3000);
  } catch {}
};
import { useTheme } from '@/composables/useTheme';
import BaseCard from '@/components/atoms/BaseCard.vue';
import BaseCode from '@/components/atoms/BaseCode.vue';
import BaseTabs from '@/components/atoms/BaseTabs.vue';
import BaseProgress from '@/components/atoms/BaseProgress.vue';
import RegexExample from '@/components/molecules/RegexExample.vue';
import RegexExplanationItem from '@/components/molecules/RegexExplanationItem.vue';
import RegexTable from '@/components/molecules/RegexTable.vue';
import RegexVisualizer from '@/components/molecules/RegexVisualizer.vue';
import RegexConceptSection from '@/components/organisms/RegexConceptSection.vue';
import RegexApplications from '@/components/organisms/RegexApplications.vue';
import RegexMistakesPanel from '@/components/organisms/RegexMistakesPanel.vue';

const { isDark } = useTheme();

const searchQuery = ref('');
const activeSection = ref('intro');
const progress = ref(0);

const tableOfContents = [
  { id: 'intro', label: 'Introducción', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'metachar', label: 'Metacaracteres', icon: 'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z' },
  { id: 'quantifiers', label: 'Cuantificadores', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { id: 'classes', label: 'Clases de Caracteres', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { id: 'sequences', label: 'Secuencias Especiales', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'groups', label: 'Grupos', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'anchors', label: 'Anclas', icon: 'M3 21v-7a2 2 0 012-2h14a2 2 0 012 2v7M3 10v11a2 2 0 002 2h14a2 2 0 002-2v-11M3 10h18' },
  { id: 'flags', label: 'Flags', icon: 'M3 21v-7a2 2 0 012-2h14a2 2 0 012 2v7M3 10v11a2 2 0 002 2h14a2 2 0 002-2v-11M3 10h18' },
  { id: 'applications', label: 'Aplicaciones', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'mistakes', label: 'Errores Comunes', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
];

const scrollToSection = (id) => {
  activeSection.value = id;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const metacharactersData = [
  { symbol: '.', name: 'Punto', description: 'Coincide con cualquier carácter excepto nueva línea', example: 'a.c', result: 'abc, adc, a1c', type: 'metacharacter' },
  { symbol: '^', name: 'Circunflejo', description: 'Coincide con el inicio de una línea o cadena', example: '^Hola', result: 'Hola mundo', type: 'anchor' },
  { symbol: '$', name: 'Dólar', description: 'Coincide con el final de una línea o cadena', example: 'mundo$', result: 'Hola mundo', type: 'anchor' },
  { symbol: '*', name: 'Asterisco', description: 'Coincide con 0 o más del carácter anterior', example: 'ab*c', result: 'ac, abc, abbc', type: 'quantifier' },
  { symbol: '+', name: 'Más', description: 'Coincide con 1 o más del carácter anterior', example: 'ab+c', result: 'abc, abbc, abbbc', type: 'quantifier' },
  { symbol: '?', name: 'Interrogación', description: 'Coincide con 0 o 1 del carácter anterior', example: 'colou?r', result: 'color, colour', type: 'quantifier' },
  { symbol: '{n}', name: 'Cantidad exacta', description: 'Coincide exactamente n veces', example: 'a{3}', result: 'aaa', type: 'quantifier' },
  { symbol: '{n,m}', name: 'Rango', description: 'Coincide entre n y m veces', example: 'a{2,4}', result: 'aa, aaa, aaaa', type: 'quantifier' },
  { symbol: '[...]', name: 'Clase', description: 'Coincide con cualquier carácter en los brackets', example: '[aeiou]', result: 'a, e, i, o, u', type: 'class' },
  { symbol: '[^...]', name: 'Negación', description: 'Coincide con cualquier carácter NO en los brackets', example: '[^aeiou]', result: 'b, c, d, f', type: 'class' },
  { symbol: '\\', name: 'Escape', description: 'Escapa un carácter especial', example: '\\.', result: 'Un punto literal', type: 'sequence' },
  { symbol: '|', name: 'Alternación', description: 'Coincide con una u otra expresión', example: 'cat|dog', result: 'cat o dog', type: 'group' },
  { symbol: '(...)', name: 'Grupo', description: 'Agrupa expresiones y captura', example: '(ab)+', result: 'ab, abab, ababab', type: 'group' },
  { symbol: '(?:...)', name: 'Grupo no capturante', description: 'Agrupa sin capturar', example: '(?:ab)+', result: 'ab, abab', type: 'group' },
];

const quantifiersData = [
  { symbol: '*', name: 'Cero o más', description: 'Coincide 0 o más veces', example: 'a*', result: 'a, aa, aaa' },
  { symbol: '+', name: 'Uno o más', description: 'Coincide 1 o más veces', example: 'a+', result: 'a, aa, aaa' },
  { symbol: '?', name: 'Opcional', description: 'Coincide 0 o 1 vez', example: 'colou?r', result: 'color, colour' },
  { symbol: '{n}', name: 'Exacto', description: 'Coincide exactamente n veces', example: '\\d{4}', result: '1234' },
  { symbol: '{n,}', name: 'Al menos', description: 'Coincide n o más veces', example: '\\d{2,}', result: '12, 123, 1234' },
  { symbol: '{n,m}', name: 'Entre', description: 'Coincide entre n y m veces', example: '\\d{2,4}', result: '12, 123, 1234' },
  { symbol: '?', name: 'No greedy', description: 'Hace el cuantificador no greedy', example: '.*?', result: 'Minimo posible' },
];

const classData = [
  { symbol: '[abc]', name: 'Caracteres específicos', description: 'Coincide con a, b o c', example: '[aeiou]', result: 'vocales' },
  { symbol: '[a-z]', name: 'Rango', description: 'Cualquier letra minúscula', example: '[a-z]', result: 'a hasta z' },
  { symbol: '[A-Z]', name: 'Mayúsculas', description: 'Cualquier letra mayúscula', example: '[A-Z]', result: 'A hasta Z' },
  { symbol: '[0-9]', name: 'Dígitos', description: 'Cualquier dígito', example: '[0-9]', result: '0 hasta 9' },
  { symbol: '[a-zA-Z]', name: 'Letras', description: 'Cualquier letra', example: '[a-zA-Z]', result: 'a-z, A-Z' },
  { symbol: '[a-zA-Z0-9]', name: 'Alfanumérico', description: 'Letras y números', example: '[a-zA-Z0-9]', result: 'caracteres alfanuméricos' },
  { symbol: '[^abc]', name: 'Negación', description: 'Cualquiera excepto a, b, c', example: '[^aeiou]', result: 'consonantes' },
  { symbol: '[a-z-]', name: 'Rango con guión', description: 'Rango incluyendo guión', example: '[a-z-]', result: 'a-z y guión' },
];

const sequenceData = [
  { symbol: '\\d', name: 'Dígito', description: 'Cualquier dígito [0-9]', example: '\\d+', result: '123, 456' },
  { symbol: '\\D', name: 'No dígito', description: 'Cualquier no dígito', example: '\\D+', result: 'abc, !@#' },
  { symbol: '\\w', name: 'Palabra', description: 'Letras, números y guión bajo [a-zA-Z0-9_]', example: '\\w+', result: 'palabra_123' },
  { symbol: '\\W', name: 'No palabra', description: 'Cualquier no palabra', example: '\\W+', result: '!, @, #' },
  { symbol: '\\s', name: 'Espacio', description: 'Espacio, tab, nueva línea', example: '\\s+', result: 'espacios' },
  { symbol: '\\S', name: 'No espacio', description: 'Cualquier no espacio', example: '\\S+', result: 'texto sin espacios' },
  { symbol: '\\b', name: 'Límite de palabra', description: 'Límite entre palabra y no palabra', example: '\\bword\\b', result: 'palabra completa' },
  { symbol: '\\B', name: 'No límite', description: 'No límite de palabra', example: '\\Bword', result: 'withinword' },
  { symbol: '\\n', name: 'Nueva línea', description: 'Carácter de nueva línea', example: 'line1\\nline2', result: 'Dos líneas' },
  { symbol: '\\t', name: 'Tabulación', description: 'Carácter de tabulación', example: 'col1\\tcol2', result: 'Dos columnas' },
];

const groupData = [
  { symbol: '(abc)', name: 'Grupo capturante', description: 'Captura el texto encontrado', example: '(\\d+)', result: 'Captura números' },
  { symbol: '(?:abc)', name: 'Grupo no capturante', description: 'Agrupa sin capturar', example: '(?:ab)+', result: 'Agrupa sin guardar' },
  { symbol: '(?<name>abc)', name: 'Grupo nombrado', description: 'Captura con nombre', example: '(?<year>\\d{4})', result: 'Captura como year' },
  { symbol: 'a|b', name: 'Alternación', description: 'Coincide con a o b', example: 'cat|dog', result: 'cat o dog' },
  { symbol: '(?=abc)', name: 'Lookahead positivo', description: 'Lo que sigue es abc', example: '\\d(?=px)', result: 'd antes de px' },
  { symbol: '(?!abc)', name: 'Lookahead negativo', description: 'Lo que sigue NO es abc', example: '\\d(?!px)', result: 'd no antes de px' },
  { symbol: '(?<=abc)', name: 'Lookbehind positivo', description: 'Lo que precede es abc', example: '(?<=\\$)\\d+', result: 'dígitos después de $' },
  { symbol: '(?<!abc)', name: 'Lookbehind negativo', description: 'Lo que precede NO es abc', example: '(?<!\\$)\\d+', result: 'dígitos sin $ antes' },
];

const anchorData = [
  { symbol: '^', name: 'Inicio de cadena', description: 'Coincide al inicio del texto', example: '^Hello', result: 'Hello world' },
  { symbol: '$', name: 'Fin de cadena', description: 'Coincide al final del texto', example: 'world$', result: 'Hello world' },
  { symbol: '\\b', name: 'Límite de palabra', description: 'Límite entre palabra y no palabra', example: '\\bword\\b', result: 'word pero no sword' },
  { symbol: '\\B', name: 'No límite de palabra', description: 'No es límite de palabra', example: '\\Bword', result: 'sword pero no word' },
  { symbol: '^$', name: 'Línea vacía', description: 'Coincide con línea vacía', example: '^$', result: 'Línea en blanco' },
];

const flagsData = [
  { flag: 'g', label: 'Global', description: 'Encuentra todas las coincidencias, no solo la primera', example: '/a/g', testString: 'abracadabra' },
  { flag: 'i', label: 'Insensible', description: 'Ignora mayúsculas/minúsculas', example: '/hello/i', testString: 'Hello HELLO hello' },
  { flag: 'm', label: 'Multilínea', description: '^ y $ coinciden con inicio/fin de cada línea', example: '/^line/m', testString: 'line1\nline2\nline3' },
  { flag: 's', name: 'Dotall', description: '. coincide con nuevas líneas también', example: '/a.b/s', testString: 'a\nb' },
  { flag: 'u', label: 'Unicode', description: 'Habilita soporte unicode completo', example: '/\\p{L}/u', testString: 'añol 日本語' },
];

const applicationsData = [
  {
    name: 'Validar Email',
    description: 'Verifica que un email tenga formato válido',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    testString: 'usuario@ejemplo.com',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    explanation: 'Esta expresión valida emails comunes verificando: nombre@dominio.extensión',
  },
  {
    name: 'Validar Teléfono',
    description: 'Coincide con formatos de teléfono comunes',
    pattern: '\\+?[1-9]\\d{1,14}',
    testString: '+34612345678',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-500',
    explanation: 'Formato internacional E.164: + seguido de 1-15 dígitos',
  },
  {
    name: 'URL HTTP/HTTPS',
    description: 'Detecta URLs web completas',
    pattern: 'https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$',
    testString: 'https://www.ejemplo.com/ruta?param=valor',
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
    explanation: 'Coincide con protocolos http o https seguido de dominio y ruta opcional',
  },
  {
    name: 'Dirección IPv4',
    description: 'Valida direcciones IP versión 4',
    pattern: '(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)',
    testString: '192.168.1.1',
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    explanation: 'Valida cada octeto entre 0-255',
  },
  {
    name: 'Fecha (DD/MM/AAAA)',
    description: 'Coincide con fechas en formato europeo',
    pattern: '(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/([12]\\d{3})',
    testString: '25/12/2024',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    explanation: 'Día 01-31 / Mes 01-12 / Año con 4 dígitos',
  },
  {
    name: 'Contraseña Segura',
    description: 'Valida contraseña con requisitos de seguridad',
    pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}',
    testString: 'Password1!',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-500',
    explanation: 'Mínimo 8 chars: mayúscula, minúscula, número y símbolo',
  },
  {
    name: 'HTML Tags',
    description: 'Extrae etiquetas HTML',
    pattern: '<([a-z][a-z0-9]*)\\b[^>]*>(.*?)<\\/\\1>',
    testString: '<div class="test">Contenido</div>',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    iconBg: 'bg-yellow-500/10',
    iconColor: 'text-yellow-500',
    explanation: 'Captura etiquetas apertura, contenido y cierre',
  },
  {
    name: 'Número de Tarjeta',
    description: 'Detecta números de tarjeta (sin validar)',
    pattern: '\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}',
    testString: '1234-5678-9012-3456',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-500',
    explanation: '16 dígitos con guiones o espacios opcionales',
  },
  {
    name: 'Usuario GitHub',
    description: 'Valida nombres de usuario GitHub',
    pattern: '[a-zA-Z][a-zA-Z0-9_-]{0,38}',
    testString: 'mi-usuario123',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    iconBg: 'bg-surface-500/10',
    iconColor: 'text-surface-500',
    explanation: 'Comienza con letra, puede contener letras, números, guiones y guiones bajos',
  },
];

const mistakesData = [
  {
    title: 'Greedy Matching (Codicia)',
    description: 'Los cuantificadores * y + coinciden con todo lo posible, no solo lo necesario',
    incorrect: '".*"',
    incorrectWhy: 'Coincidirá con todo el texto entre comillas y más',
    correct: '".*?"',
    correctWhy: 'El ? hace que sea no-greedy y coincida solo con lo mínimo',
    testString: '"texto" más texto',
  },
  {
    title: 'Olvidar escapar caracteres especiales',
    description: 'Algunos caracteres tienen significado especial y deben escaparse',
    incorrect: '[a.b]',
    incorrectWhy: 'El punto dentro de corchetes es literal, pero fuera necesita escape',
    correct: 'a\\.b|a\\.c',
    correctWhy: 'Escape del punto para que sea literal',
    testString: 'a.b a.c',
  },
  {
    title: 'Anclas fuera de lugar',
    description: '^ y $ son posiciones, no caracteres',
    incorrect: '^$',
    incorrectWhy: 'Coincide solo con cadena vacía, no con líneas vacías en texto',
    correct: '^$',
    correctWhy: 'Con flag m coincide con líneas vacías',
    testString: 'línea 1\n\nlínea 3',
  },
  {
    title: 'Rangos en clases de caracteres',
    description: 'El orden de los caracteres en rangos importa',
    incorrect: '[z-a]',
    incorrectWhy: 'Rango inválido - z es mayor que a',
    correct: '[a-z]',
    correctWhy: 'Rango correcto de menor a mayor',
    testString: 'abcdefghijklmnopqrstuvwxyz',
  },
  {
    title: 'Olvidar el flag global',
    description: 'Sin g solo coincide la primera vez',
    incorrect: '/a/',
    incorrectWhy: 'Solo encuentra la primera a',
    correct: '/a/g',
    correctWhy: 'Encuentra todas las a',
    testString: 'aaaa',
  },
  {
    title: 'Grupos sin capturar correctamente',
    description: 'Usar paréntesis sin entender la diferencia entre capturar y no',
    incorrect: '(?:\\d+)',
    incorrectWhy: 'Este grupo NO se captura (no accesible con $1)',
    correct: '(\\d+)',
    correctWhy: 'Este grupo SÍ se captura (accesible con $1)',
    testString: 'abc123def',
  },
];

const sections = [
  {
    id: 'intro',
    title: 'Introducción a las Expresiones Regulares',
    icon: 'rocket',
    description: 'Aprende qué son y por qué son fundamentales en programación',
    content: `Las expresiones regulares (regex o regexp) son patrones de búsqueda utilizados para encontrar y manipular texto. Son una herramienta increíblemente poderosa que todo desarrollador debería dominar.`,
    examples: [
      { pattern: '\\d+', testString: 'Pedido 123 confirmado', title: 'Buscar dígitos', description: 'Encuentra uno o más dígitos en el texto' },
      { pattern: '\\w+@\\w+\\.\\w+', testString: 'Contáctanos: info@ejemplo.com', title: 'Buscar email', description: 'Encuentra direcciones de email simples' },
      { pattern: '^Hola', testString: 'Hola mundo', title: 'Buscar al inicio', description: 'Verifica si el texto comienza con "Hola"' },
      { pattern: '[A-Z]{3}', testString: 'Código: ABC123', title: 'Buscar mayúsculas', description: 'Encuentra 3 letras mayúsculas consecutivas' },
    ],
  },
  {
    id: 'metachar',
    title: 'Metacaracteres',
    icon: 'cursor',
    description: 'Los símbolos especiales que dan poder a tus regex',
    items: metacharactersData.slice(0, 14),
  },
  {
    id: 'quantifiers',
    title: 'Cuantificadores',
    icon: 'magnifying',
    description: 'Controla cuántas veces debe coincidir un patrón',
    tableData: {
      rows: quantifiersData.map(q => ({
        symbol: q.symbol,
        name: q.name,
        description: q.description,
        example: q.example,
      })),
    },
    examples: [
      { pattern: 'a*', testString: 'aaa bbb aaaa', title: 'Asterisco - Cero o más', description: 'Coincide con a cero o más veces' },
      { pattern: 'a+', testString: 'bbb aaa bbb', title: 'Más - Uno o más', description: 'Coincide con a una o más veces' },
      { pattern: 'a{3}', testString: 'a aaa aaaa', title: 'Cantidad exacta', description: 'Coincide exactamente con 3 a' },
      { pattern: 'a{2,4}', testString: 'a aa aaa aaaa aaaaa', title: 'Rango', description: 'Coincide entre 2 y 4 a' },
    ],
  },
  {
    id: 'classes',
    title: 'Clases de Caracteres',
    icon: 'puzzle',
    description: 'Define qué caracteres pueden coincidir',
    tableData: {
      rows: classData.map(c => ({
        symbol: c.symbol,
        name: c.name,
        description: c.description,
        example: c.example,
      })),
    },
    examples: [
      { pattern: '[aeiou]', testString: 'hola mundo', title: 'Vocales', description: 'Encuentra cualquier vocal' },
      { pattern: '[0-9]', testString: 'a1b2c3', title: 'Dígitos', description: 'Encuentra cualquier dígito' },
      { pattern: '[^aeiou]', testString: 'aeiou bcd', title: 'Negación', description: 'Encuentra todo excepto vocales' },
      { pattern: '[a-zA-Z]', testString: 'Hola123', title: 'Solo letras', description: 'Encuentra letras mayúsculas y minúsculas' },
    ],
  },
  {
    id: 'sequences',
    title: 'Secuencias Especiales',
    icon: 'check',
    description: 'Atajos para patrones comunes',
    tableData: {
      rows: sequenceData.map(s => ({
        symbol: s.symbol,
        name: s.name,
        description: s.description,
        example: s.example,
      })),
    },
    examples: [
      { pattern: '\\d+', testString: 'Tel: 123-456-7890', title: 'Dígitos', description: 'Encuentra secuencias de dígitos' },
      { pattern: '\\w+', testString: 'Hola_mundo 123!', title: 'Palabras', description: 'Encuentra palabras (letras, números, _)' },
      { pattern: '\\s+', testString: 'Hola    mundo', title: 'Espacios', description: 'Encuentra uno o más espacios' },
      { pattern: '\\bword\\b', testString: 'word sword words', title: 'Límite de palabra', description: 'Encuentra "word" como palabra completa' },
    ],
  },
  {
    id: 'groups',
    title: 'Grupos y Capturas',
    icon: 'link',
    description: 'Agrupa patrones y extrae información específica',
    items: groupData,
  },
  {
    id: 'anchors',
    title: 'Anclas y Límites',
    icon: 'bookmark',
    description: 'Define posiciones específicas en el texto',
    tableData: {
      rows: anchorData.map(a => ({
        symbol: a.symbol,
        name: a.name,
        description: a.description,
        example: a.example,
      })),
    },
    examples: [
      { pattern: '^Hola', testString: 'Hola mundo\\nHola другая строка', title: 'Inicio de cadena/línea', description: 'Busca Hola al inicio' },
      { pattern: 'mundo$', testString: 'Hola mundo\\nOtro mundo', title: 'Fin de cadena/línea', description: 'Busca mundo al final' },
      { pattern: '\\bword\\b', testString: 'word sword word', title: 'Límite de palabra', description: 'word como palabra completa' },
    ],
  },
  {
    id: 'flags',
    title: 'Flags (Banderas)',
    icon: 'flag',
    description: 'Modifica el comportamiento de la búsqueda',
    content: 'Los flags son opciones que modifican cómo se interpreta y busca el patrón. Se añaden después del cierre de la expresión regular.',
    examples: flagsData.map(f => ({
      pattern: f.example,
      testString: f.testString,
      title: `Flag ${f.flag} - ${f.label}`,
      description: f.description,
      flags: f.flag,
    })),
  },
  {
    id: 'applications',
    title: 'Aplicaciones Reales',
    icon: 'lightbulb',
    description: 'Ejemplos prácticos de regex en el mundo real',
  },
  {
    id: 'mistakes',
    title: 'Errores Comunes',
    icon: 'warning',
    description: 'Aprende de los errores típicos al trabajar con regex',
  },
];

const filteredSections = computed(() => {
  if (!searchQuery.value) return sections;
  const query = searchQuery.value.toLowerCase();
  return sections.filter(s =>
    s.title.toLowerCase().includes(query) ||
    s.description.toLowerCase().includes(query) ||
    (s.items && s.items.some(i => i.name.toLowerCase().includes(query) || i.symbol.includes(query)))
  );
});

onMounted(() => {
  progress.value = 15;
});
</script>

<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950">
    <header class="sticky top-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <a href="/" class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <svg class="w-5 h-5 text-surface-600 dark:text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </a>
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-bold text-surface-900 dark:text-surface-100">Aprende Regex</h1>
              <p class="text-xs text-surface-500">Tutorial interactivo</p>
            </div>
          </div>

          <div class="flex-1 max-w-md mx-8">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar conceptos..."
                class="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 border-0 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:ring-2 focus:ring-primary-500/20"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors text-surface-700 dark:text-surface-300"
              @click="handleShare"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span class="text-sm font-medium">Compartir</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-8">
        <aside class="hidden lg:block w-64 flex-shrink-0">
          <div class="sticky top-24 space-y-2">
            <h3 class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Contenido</h3>
            <nav class="space-y-1">
              <button
                v-for="toc in tableOfContents"
                :key="toc.id"
                :class="[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                  activeSection === toc.id
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800',
                ]"
                @click="scrollToSection(toc.id)"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="toc.icon" />
                </svg>
                {{ toc.label }}
              </button>
            </nav>
          </div>
        </aside>

        <main class="flex-1 min-w-0 space-y-8">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-4">
              Aprende Expresiones Regulares
            </h1>
            <p class="text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
              Domina el arte de buscar y manipular texto con patrones poderosos
            </p>
          </div>

          <RegexConceptSection
            v-for="(section, idx) in filteredSections"
            :key="section.id"
            :id="section.id"
            :title="section.title"
            :description="section.description"
            :icon="section.icon"
            :items="section.items || []"
            :examples="section.examples || []"
            :table-data="section.tableData"
            :content="section.content"
            :order="idx + 1"
          />

          <div v-if="filteredSections.some(s => s.id === 'applications')" class="space-y-8">
            <RegexApplications :applications="applicationsData" />
          </div>

          <div v-if="filteredSections.some(s => s.id === 'mistakes')" class="space-y-8">
            <RegexMistakesPanel :mistakes="mistakesData" />
          </div>

          <div class="bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-2xl p-8 text-center">
            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-3">
              ¡Practica en el Playground!
            </h2>
            <p class="text-surface-600 dark:text-surface-400 mb-6 max-w-lg mx-auto">
              Ahora que has aprendido los conceptos, ponlos en práctica en nuestro playground interactivo
            </p>
            <a
              href="/playground"
              class="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
            >
              Ir al Playground
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </main>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="showShareToast"
        class="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-xl shadow-lg"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="font-medium">¡Enlace copiado!</span>
      </div>
    </Transition>
  </div>
</template>