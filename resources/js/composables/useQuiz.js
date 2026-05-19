import { ref, computed } from 'vue'

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const userProgress = ref(JSON.parse(localStorage.getItem('quizProgress')) || {
  xp: 0,
  level: 'Novato',
  streak: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  history: []
})

const levels = [
  { name: 'Novato', minXP: 0, maxXP: 100, icon: '🌱' },
  { name: 'Aprendiz', minXP: 100, maxXP: 300, icon: '📚' },
  { name: 'Practicion', minXP: 300, maxXP: 600, icon: '⚡' },
  { name: 'Experto', minXP: 600, maxXP: 1000, icon: '🎯' },
  { name: 'Regex Master', minXP: 1000, maxXP: Infinity, icon: '👑' }
]

const triviaData = [
  { text: 'El primer uso de regex fue en Unix en los años 70. Unix fue creado en un laboratorio de AT&T, donde también inventaron el teléfono y el transistor.', category: 'history' },
  { text: 'El 73% de los desarrolladoresconfiesa no entender regex. El otro 27% miente.', category: 'stats' },
  { text: 'La primera expresión regular严格来说 no era "regular" - usaba más poder que las expresiones regulares verdaderas.', category: 'history' },
  { text: 'Hay un lenguaje de programación llamado "rebol" que literalmente significa "Relative Expression Based Object Language". Parece un acrónimo forzado.', category: 'languages' },
  { text: 'El caracter . puede matching más de 14,000 posibles caracteres Unicode diferentes, no solo letras.', category: 'trivia' },
  { text: 'La persona que más contribuyó a regex moderno es POSIX. No, no es una persona, es un estándar. Pero suena a nombre de persona.', category: 'history' },
  { text: 'Puedes hacer un compilador regex completo en menos de 400 líneas de código. Perl demostró esto en los 90s.', category: 'trivia' },
  { text: 'El modo "lazy" de regex (*?, +?, ??) fue agregado después porque los desarrolladores cansaron de esperar a que sus patrones terminaran.', category: 'trivia' },
  { text: 'El término "regex" es más viejo que internet público. Existía desde 1968 en papers académicos.', category: 'history' },
  { text: 'Existe una expresión regular que valida si otra expresión regular es válida. Meta.', category: 'trivia' },
  { text: 'En 2020, alguien resolvió un Sudoku usando solo regex. No preguntes cómo.', category: 'trivia' },
  { text: 'El emoji más usado en ejemplos de regex es 🦄 porque nadie sabe qué hace el modificador /u.', category: 'funny' },
  { text: 'Stephen Kleene inventó los operadores +, *, ? en los 50s. Era mathematician, no desarrollador. O sea, todos los desarrolladores usan su trabajo sin saberlo.', category: 'history' },
  { text: 'Hay una librería regex que pesa solo 2KB. Se llama "tiny-regex". La versión completa pesa 500KB.', category: 'trivia' },
  { text: 'El libro "Mastering Regular Expressions" tiene más de 500 páginas. Hay personas que lo han leído completo.', category: 'funny' }
]

const questions = [
  {
    id: 1,
    type: 'matching',
    level: 'basico',
    category: 'emails',
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    question: '¿Cuál de estos emails es válido según la regex?',
    options: [
      { text: 'user@domain.com', isCorrect: true },
      { text: 'user@domain', isCorrect: false },
      { text: '@domain.com', isCorrect: false },
      { text: 'user@.com', isCorrect: false }
    ],
    regexDisplay: '^[\\s@]+@[\\s@]+\\.[\\s@]+$',
    explanation: 'Un email válido debe tener: usuario@dominio.extensión. El . necesita algo antes y después.',
    trivia: 'El primer email de la historia se envió en 1971. Era "QWERTYUIOP". Menos glamoroso de lo que pensabas.'
  },
  {
    id: 2,
    type: 'matching',
    level: 'basico',
    category: 'numeros',
    regex: /^\d{3}-\d{3}-\d{4}$/,
    question: '¿Cuál es el formato correcto para el patrón?',
    options: [
      { text: '123-456-7890', isCorrect: true },
      { text: '1234567890', isCorrect: false },
      { text: '123-45-6789', isCorrect: false },
      { text: '12-345-6789', isCorrect: false }
    ],
    regexDisplay: '^\\d{3}-\\d{3}-\\d{4}$',
    explanation: '\\d{n} significa exactamente n dígitos. Então 3-3-4 = teléfono estadounidense.',
    trivia: 'El formato de teléfono más común en el mundo es diferente en cada país. En Alemania ni siquiera usan guiones.'
  },
  {
    id: 3,
    type: 'matching',
    level: 'basico',
    category: 'fechas',
    regex: /^\d{2}\/\d{2}\/\d{4}$/,
    question: '¿Qué fecha coincide con el patrón?',
    options: [
      { text: '25/12/2024', isCorrect: true },
      { text: '2024-12-25', isCorrect: false },
      { text: '1/1/24', isCorrect: false },
      { text: '25-12-2024', isCorrect: false }
    ],
    regexDisplay: '^\\d{2}/\\d{2}/\\d{4}$',
    explanation: 'Formato DD/MM/YYYY con exactamente 2 dígitos para día y mes, 4 para año.',
    trivia: 'Los franceses ponen el día primero (25/12/2024), los americanos el mes (12/25/2024). Regex no resuelve guerras.'
  },
  {
    id: 4,
    type: 'matching',
    level: 'basico',
    category: 'palabras',
    regex: /^\w+$/,
    question: '¿Cuál palabra coincide?',
    options: [
      { text: 'hola_mundo', isCorrect: true },
      { text: 'hola-mundo', isCorrect: false },
      { text: 'hola mundo', isCorrect: false },
      { text: 'hola!', isCorrect: false }
    ],
    regexDisplay: '^\\w+$',
    explanation: '\\w匹配字母、数字 y underscore. No espacios, no guiones, no símbolos.',
    trivia: '\\w es shorthand para [a-zA-Z0-9_]. También matching emojis en modo Unicode. Sorpresa.'
  },
  {
    id: 5,
    type: 'matching',
    level: 'intermedio',
    category: 'ips',
    regex: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    question: '¿Cuál es una IP válida?',
    options: [
      { text: '192.168.1.1', isCorrect: true },
      { text: '256.1.1.1', isCorrect: false },
      { text: '192.168.1', isCorrect: false },
      { text: '192.168.1.256', isCorrect: false }
    ],
    regexDisplay: '^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$',
    explanation: 'IP válida tiene 4 octetos, cada uno entre 0-255. El patrón valida eso exactamente.',
    trivia: 'La IP 0.0.0.0 significa "todas las direcciones" en contexto de servidor. En cliente significa "ninguna". Confuso, lo sé.'
  },
  {
    id: 6,
    type: 'matching',
    level: 'intermedio',
    category: 'urls',
    regex: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
    question: '¿Cuál URL coincide?',
    options: [
      { text: 'https://example.com/path', isCorrect: true },
      { text: 'ftp://example.com', isCorrect: false },
      { text: 'http://example', isCorrect: false },
      { text: 'https://.com', isCorrect: false }
    ],
    regexDisplay: '^https?://[\\w-]+(\\.[\\w-]+)+[/#?]?.*$',
    explanation: 'http:// o https://, dominio con al menos un punto, opcional path/query.',
    trivia: 'Las URLs más largas del mundo tienen más de 2000 caracteres. Google truncó las suyas a partir de ese límite.'
  },
  {
    id: 7,
    type: 'matching',
    level: 'intermedio',
    category: 'contraseñas',
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    question: '¿Cuál contraseña es VÁLIDA?',
    options: [
      { text: 'Password1', isCorrect: true },
      { text: 'password', isCorrect: false },
      { text: 'PASSWORD1', isCorrect: false },
      { text: 'Pass1', isCorrect: false }
    ],
    regexDisplay: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$',
    explanation: 'Al menos: 1 minúscula, 1 mayúscula, 1 número, mínimo 8 caracteres.',
    trivia: 'La contraseña más común del mundo es "123456". El segundo lugar: "password". Innovación.'
  },
  {
    id: 8,
    type: 'matching',
    level: 'intermedio',
    category: 'hex',
    regex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    question: '¿Cuál código hex de color es válido?',
    options: [
      { text: '#FF5733', isCorrect: true },
      { text: '#GGGGGG', isCorrect: false },
      { text: '#12345', isCorrect: false },
      { text: '#GGG', isCorrect: false }
    ],
    regexDisplay: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
    explanation: 'Empieza con #, seguido de 6 o 3 dígitos hexadecimales (A-F, 0-9).',
    trivia: '#000000 es negro, #FFFFFF es blanco. El color más popular en web es #3498db (azul).'
  },
  {
    id: 9,
    type: 'matching',
    level: 'avanzado',
    category: 'html',
    regex: /<([a-z]+)[^>]*>(.*?)<\/\1>/i,
    question: '¿Cuál tag HTML coincide?',
    options: [
      { text: '<div>contenido</div>', isCorrect: true },
      { text: '<div>sin cierre', isCorrect: false },
      { text: '<div></div>', isCorrect: false },
      { text: '</div>', isCorrect: false }
    ],
    regexDisplay: '<([a-z]+)[^>]*>(.*?)<\\/\\1>',
    explanation: 'Captura el tag name, luego cualquier contenido, luego cierra con el mismo tag. Backreference!',
    trivia: 'El primer sitio web todavía existe: info.cern.ch. Era una página sobre World Wide Web. Meta.'
  },
  {
    id: 10,
    type: 'matching',
    level: 'avanzado',
    category: 'credito',
    regex: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/,
    question: '¿Cuál número de tarjeta Visa es válido?',
    options: [
      { text: '4111111111111111', isCorrect: true },
      { text: '5500000000000004', isCorrect: false },
      { text: '370000000000000', isCorrect: false },
      { text: '1234567890123456', isCorrect: false }
    ],
    regexDisplay: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$',
    explanation: 'Visa: 4 + 12 o 16 dígitos. Mastercard: 51-55 + 14 dígitos.',
    trivia: 'El algoritmo de Luhn valida tarjetas. Si tu número pasa, no significa que sea real. Pero si no pasa, definitivamente es falso.'
  },
  {
    id: 11,
    type: 'matching',
    level: 'basico',
    category: 'espacios',
    regex: /^\s+|\s+$/,
    question: '¿Qué hace este patrón en una cadena?',
    options: [
      { text: 'Encuentra espacios al inicio o final', isCorrect: true },
      { text: 'Encuentra todos los espacios', isCorrect: false },
      { text: 'Elimina todos los espacios', isCorrect: false },
      { text: 'Encuentra espacios entre palabras', isCorrect: false }
    ],
    regexDisplay: '^\\s+|\\s+$',
    explanation: '^\\s+ = espacios al inicio, \\s+$ = espacios al final (trim).',
    trivia: 'El 90% de los errores de trim en producción vienen de usuarios que pegan texto de Word.'
  },
  {
    id: 12,
    type: 'matching',
    level: 'intermedio',
    category: 'telefonos',
    regex: /^\+?(\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
    question: '¿Cuál teléfono coincide?',
    options: [
      { text: '+1 (555) 123-4567', isCorrect: true },
      { text: '555-123-4567', isCorrect: false },
      { text: '1234567890', isCorrect: false },
      { text: '+52 55 1234 5678', isCorrect: false }
    ],
    regexDisplay: '^\\+?(\\d{1,3})?[-. ]?\\(?\\d{3}\\)?[-. ]?\\d{3}[-. ]?\\d{4}$',
    explanation: 'Código país opcional, luego 3 dígitos, luego 3, luego 4. Con o sin guiones/paréntesis.',
    trivia: 'En Japón el número de teléfono más largo es 14 dígitos. En USA el más corto es 7. Internacionalización.'
  },
  {
    id: 13,
    type: 'matching',
    level: 'basico',
    category: 'logs',
    regex: /^\[(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\]\s+(INFO|WARN|ERROR)$/,
    question: '¿Cuál línea de log coincide?',
    options: [
      { text: '[2024-12-25 14:30:00] INFO', isCorrect: true },
      { text: '2024-12-25 14:30:00 INFO', isCorrect: false },
      { text: '[25-12-2024 14:30:00] ERROR', isCorrect: false },
      { text: '[2024/12/25 14:30:00] WARN', isCorrect: false }
    ],
    regexDisplay: '^\\[(\\d{4}-\\d{2}-\\d{2})\\s+(\\d{2}:\\d{2}:\\d{2})\\]\\s+(INFO|WARN|ERROR)$',
    explanation: 'Formato estándar de log: [fecha hora] nivel. Captura fecha, hora, y nivel.',
    trivia: 'Los primeros logs de computadora eran en papel. Literalmente impresoras constantemente.'
  },
  {
    id: 14,
    type: 'matching',
    level: 'intermedio',
    category: 'semantico',
    regex: /(?<=@)\w+/,
    question: '¿Qué captura este lookahead (lookbehind)?',
    options: [
      { text: 'La palabra después de @', isCorrect: true },
      { text: 'El @ junto con la palabra', isCorrect: false },
      { text: 'Todo antes del @', isCorrect: false },
      { text: 'El @', isCorrect: false }
    ],
    regexDisplay: '(?<=@)\\w+',
    explanation: '(?<=...) es lookbehind positivo: busca lo que está DESPUÉS de lo especificado. Aquí: palabra después de @.',
    trivia: 'Los lookbehind (?<=) fueron agregados a JavaScript en 2018. Antes no existían. Tardaron 20 años.'
  },
  {
    id: 15,
    type: 'matching',
    level: 'avanzado',
    category: 'ipv6',
    regex: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
    question: '¿Cuál es una IPv6 válida completa?',
    options: [
      { text: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', isCorrect: true },
      { text: '192.168.1.1', isCorrect: false },
      { text: '2001:db8::1', isCorrect: false },
      { text: 'localhost', isCorrect: false }
    ],
    regexDisplay: '^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$',
    explanation: 'IPv6 tiene 8 grupos de 4 dígitos hex. Separados por :. No es el formato comprimido (::).',
    trivia: 'IPv6 tiene 340 sextillones de direcciones. Es como si cada átomo de la Tierra tuviera su propia IP. Y aun así hay gente sin WiFi.'
  },
  {
    id: 16,
    type: 'matching',
    level: 'basico',
    category: 'metacaracteres',
    regex: /a.b/,
    question: '¿Qué significa el punto (.) en una regex?',
    options: [
      { text: 'Cualquier carácter excepto salto de línea', isCorrect: true },
      { text: 'Un punto literal', isCorrect: false },
      { text: 'Cero o más caracteres', isCorrect: false },
      { text: 'Fin de línea', isCorrect: false }
    ],
    regexDisplay: 'a.b',
    explanation: 'El punto es un comodín que coincide con CUALQUIER carácter individual, incluyendo números y símbolos, pero NO con saltos de línea.',
    trivia: 'El punto Matching más de 14,000 caracteres Unicode. No solo letras y números.'
  },
  {
    id: 17,
    type: 'matching',
    level: 'basico',
    category: 'cuantificadores',
    regex: /a+/,
    question: '¿Qué significa el + en una regex?',
    options: [
      { text: 'Uno o más del carácter anterior', isCorrect: true },
      { text: 'El carácter anterior es obligatorio', isCorrect: false },
      { text: 'Exactamente uno', isCorrect: false },
      { text: 'Cero o más', isCorrect: false }
    ],
    regexDisplay: 'a+',
    explanation: '+ significa "uno o más" del carácter o grupo que lo precede. 최소 1번, 최대 무제한.',
    trivia: 'El + fue inventado por Stephen Kleene en los 1950s. Lleva su nombre: "Kleene plus".'
  },
  {
    id: 18,
    type: 'matching',
    level: 'basico',
    category: 'cuantificadores',
    regex: /a*/,
    question: '¿Qué diferencia hay entre * y +?',
    options: [
      { text: '* permite cero ocurrencias, + requiere al menos una', isCorrect: true },
      { text: '* es más rápido que +', isCorrect: false },
      { text: '* coincide con mayúsculas, + con minúsculas', isCorrect: false },
      { text: 'Son iguales', isCorrect: false }
    ],
    regexDisplay: 'a* vs a+',
    explanation: '* = "cero o más" (puede no existir), + = "uno o más" (al menos uno debe existir).',
    trivia: 'Sin * o +, tendrías que escribir cada variación manualmente. Thank Stephen Kleene.'
  },
  {
    id: 19,
    type: 'matching',
    level: 'basico',
    category: 'clases',
    regex: /[aeiou]/,
    question: '¿Qué significa una clase de caracteres [aeiou]?',
    options: [
      { text: 'Cualquiera de las vocales: a, e, i, o, u', isCorrect: true },
      { text: 'La palabra "aeiou" completa', isCorrect: false },
      { text: 'Desde "a" hasta "iou"', isCorrect: false },
      { text: 'La letra a seguida de eiou', isCorrect: false }
    ],
    regexDisplay: '[aeiou]',
    explanation: 'Los corchetes definen un "conjunto" de caracteres posibles. Coincide con CUALQUIERA de los caracteres dentro.',
    trivia: 'Las clases de caracteres nacieron en los 60s en Bell Labs. Eran tan útiles que siguen igual hoy.'
  },
  {
    id: 20,
    type: 'matching',
    level: 'basico',
    category: 'clases',
    regex: /[^aeiou]/,
    question: '¿Qué significa ^ dentro de corchetes [^aeiou]?',
    options: [
      { text: 'NEGACIÓN - cualquier carácter EXCEPTO vocales', isCorrect: true },
      { text: 'Inicio de cadena', isCorrect: false },
      { text: 'La letra caret ^', isCorrect: false },
      { text: 'Uno o más', isCorrect: false }
    ],
    regexDisplay: '[^aeiou]',
    explanation: 'Cuando ^ está al INICIO de los corchetes, niega la clase. Coincide con cualquier cosa que NO sea vocal.',
    trivia: 'El ^ dentro de corchetes significa "no". Fuera de corchetes significa "inicio". Context matters!'
  },
  {
    id: 21,
    type: 'matching',
    level: 'basico',
    category: 'clases',
    regex: /[0-9]/,
    question: '¿Cuál es otra forma de escribir [0-9]?',
    options: [
      { text: '\\d', isCorrect: true },
      { text: '\\w', isCorrect: false },
      { text: '\\s', isCorrect: false },
      { text: '.', isCorrect: false }
    ],
    regexDisplay: '[0-9] o \\d',
    explanation: '\\d es un atajo (shorthand) para cualquier dígito 0-9. Funciona en几乎 todos los lenguajes.',
    trivia: '\\d existe desde los 70s. En modo Unicode (/u) también coincide con dígitos de otros sistemas.'
  },
  {
    id: 22,
    type: 'matching',
    level: 'basico',
    category: 'anchors',
    regex: /^hola/,
    question: '¿Para qué sirve el ^ al inicio de una regex?',
    options: [
      { text: 'Coincide solo si la cadena EMPIEZA con "hola"', isCorrect: true },
      { text: 'Hace la búsqueda case insensitive', isCorrect: false },
      { text: 'Busca todas las ocurrencias', isCorrect: false },
      { text: 'Escapa el siguiente carácter', isCorrect: false }
    ],
    regexDisplay: '^hola',
    explanation: '^ es un "ancla" que marca el INICIO de la cadena. La regex solo coincide si "hola" está al principio.',
    trivia: '^ viene de "caret". En matemáticas significa "no", pero en regex significa "inicio". Confuso, lo sé.'
  },
  {
    id: 23,
    type: 'matching',
    level: 'basico',
    category: 'anchors',
    regex: /mundo$/,
    question: '¿Para qué sirve el $ al final de una regex?',
    options: [
      { text: 'Coincide solo si la cadena TERMINA con "mundo"', isCorrect: true },
      { text: 'Hace match de todas las líneas', isCorrect: false },
      { text: 'Buscar en mayúsculas', isCorrect: false },
      { text: 'Escapar caracteres especiales', isCorrect: false }
    ],
    regexDisplay: 'mundo$',
    explanation: '$ es un ancla de FINAL. Solo coincide si "mundo" está al最后 de la cadena.',
    trivia: 'Puedes combinar ^ y $ para validar cadenas completas: ^\\d+$ solo acepta puramente dígitos.'
  },
  {
    id: 24,
    type: 'matching',
    level: 'basico',
    category: 'secuencias',
    regex: /\\w+/,
    question: '¿Qué coincide \\w+?',
    options: [
      { text: 'Una o más letras, números o guiones bajos', isCorrect: true },
      { text: 'Solo letras', isCorrect: false },
      { text: 'Solo números', isCorrect: false },
      { text: 'Espacios en blanco', isCorrect: false }
    ],
    regexDisplay: '\\w+',
    explanation: '\\w = [a-zA-Z0-9_]. Coincide con cualquier carácter de palabra (word character).',
    trivia: '\\w también coincide con algunos emojis en modo Unicode. Surprise! 😄 también cuenta como word.'
  },
  {
    id: 25,
    type: 'matching',
    level: 'basico',
    category: 'secuencias',
    regex: /\\s+/,
    question: '¿Qué significa \\s+?',
    options: [
      { text: 'Uno o más espacios en blanco (espacio, tab, salto)', isCorrect: true },
      { text: 'Solo espacios', isCorrect: false },
      { text: 'Letras s repetidas', isCorrect: false },
      { text: 'Una palabra que empieza con s', isCorrect: false }
    ],
    regexDisplay: '\\s+',
    explanation: '\\s coincide con cualquier espacio en blanco: espacio, tab \\t, newline \\n, carriage return \\r.',
    trivia: 'Trim() en muchos lenguajes usa \\s+ al inicio y final para eliminar espacios invisibles.'
  },
  {
    id: 26,
    type: 'matching',
    level: 'basico',
    category: 'grupos',
    regex: /(abc)+/,
    question: '¿Qué hacen los paréntesis () en una regex?',
    options: [
      { text: 'Agrupan caracteres para tratarlos como una unidad', isCorrect: true },
      { text: 'Hacen opcional el contenido', isCorrect: false },
      { text: 'Crean una clase de caracteres', isCorrect: false },
      { text: 'Escapan el contenido', isCorrect: false }
    ],
    regexDisplay: '(abc)+',
    explanation: 'Los paréntesis crean un "grupo". Permite aplicar cuantificadores a múltiples caracteres juntos.',
    trivia: 'Los paréntesis también "capturan" el texto. Puedes acceder con $1, $2 en reemplazos.'
  },
  {
    id: 27,
    type: 'matching',
    level: 'basico',
    category: 'alternacion',
    regex: /cat|dog/,
    question: '¿Qué significa la barra vertical |?',
    options: [
      { text: 'O - coincide con "cat" O con "dog"', isCorrect: true },
      { text: "Y - coincide con 'cat' Y 'dog'", isCorrect: false },
      { text: 'Escape de caracteres', isCorrect: false },
      { text: 'Fin de grupo', isCorrect: false }
    ],
    regexDisplay: 'cat|dog',
    explanation: '| significa "OR" o альтернатива. Coincide con cualquiera de las opciones separadas por |.',
    trivia: 'Llamado "pipe" o "alternation". En Unix también significa "pipe" - pasar output como input.'
  },
  {
    id: 28,
    type: 'matching',
    level: 'intermedio',
    category: 'cuantificadores',
    regex: /a{3}/,
    question: '¿Qué significa {3}?',
    options: [
      { text: 'Exactamente 3 veces el carácter anterior', isCorrect: true },
      { text: 'Hasta 3 veces', isCorrect: false },
      { text: 'Al menos 3 veces', isCorrect: false },
      { text: 'Entre 0 y 3 veces', isCorrect: false }
    ],
    regexDisplay: 'a{3}',
    explanation: '{n} es un cuantificador exacto. Coincide exactamente n veces con el carácter precedente.',
    trivia: '{3} significa "exactamente 3". Pero {3,} significa "al menos 3" y {3,5} significa "entre 3 y 5".'
  },
  {
    id: 29,
    type: 'matching',
    level: 'intermedio',
    category: 'cuantificadores',
    regex: /a{2,4}/,
    question: '¿Qué significa {2,4}?',
    options: [
      { text: 'Entre 2 y 4 veces (mínimo 2, máximo 4)', isCorrect: true },
      { text: 'Exactamente 2 o 4 veces', isCorrect: false },
      { text: '2 a 4 caracteres', isCorrect: false },
      { text: 'Mas de 4 veces', isCorrect: false }
    ],
    regexDisplay: 'a{2,4}',
    explanation: '{n,m} es un rango. Coincide entre n (mínimo) y m (máximo) veces.',
    trivia: '{2,4} es práctico para passwords: ^\\S{8,20}$ exige entre 8 y 20 caracteres.'
  },
  {
    id: 30,
    type: 'matching',
    level: 'intermedio',
    category: 'grupos',
    regex: /(?:abc)/,
    question: '¿Qué diferencia hay entre (abc) y (?:abc)?',
    options: [
      { text: '(?:) no captura el grupo, solo agrupa', isCorrect: true },
      { text: '(?:) hace la búsqueda más rápida', isCorrect: false },
      { text: 'Son idénticos', isCorrect: false },
      { text: '(?:) es obligatorio', isCorrect: false }
    ],
    regexDisplay: '(abc) vs (?:abc)',
    explanation: 'Los paréntesis normales () capturan el match. (?:) agrupa SIN capturar - útil para rendimiento.',
    trivia: 'Los grupos no capturantes son 15-20% más rápidos en búsquedas grandes. Performance matter!'
  },
  {
    id: 31,
    type: 'matching',
    level: 'intermedio',
    category: 'flags',
    regex: /hello/i,
    question: '¿Qué hace el flag i?',
    options: [
      { text: 'Case insensitive - acepta HOLA, hola, Hola...', isCorrect: true },
      { text: 'Busca en todo el texto (global)', isCorrect: false },
      { text: 'Coincide con multilíneas', isCorrect: false },
      { text: 'Escapa caracteres', isCorrect: false }
    ],
    regexDisplay: '/hello/i',
    explanation: 'i = case insensitive. Ignora diferencia entre mayúsculas y minúsculas.',
    trivia: 'Sin /i, "Hola" y "HOLA" son diferentes. /i existe desde los 70s. Thank POSIX.'
  },
  {
    id: 32,
    type: 'matching',
    level: 'intermedio',
    category: 'flags',
    regex: /./s,
    question: '¿Qué hace el flag s (dotall)?',
    options: [
      { text: 'El punto . también coincide con saltos de línea', isCorrect: true },
      { text: 'Hace la búsqueda más rápida', isCorrect: false },
      { text: 'Solo busca en una línea', isCorrect: false },
      { text: 'Escapa caracteres especiales', isCorrect: false }
    ],
    regexDisplay: '/./s',
    explanation: 'Por defecto . no coincide con \\n (newline). Con /s, . matches CUALQUIER carácter.',
    trivia: 'Originalmente . no matching newlines por eficiencia. /s se agregó después para HTML parsing.'
  },
  {
    id: 33,
    type: 'matching',
    level: 'intermedio',
    category: 'flags',
    regex: /^linea1\\nlinea2/m,
    question: '¿Para qué sirve el flag m (multiline)?',
    options: [
      { text: '^ y $ coinciden con inicio/fin de CADA línea', isCorrect: true },
      { text: 'Busca en múltiples archivos', isCorrect: false },
      { text: 'Hace match global', isCorrect: false },
      { text: 'Escapa caracteres especiales', isCorrect: false }
    ],
    regexDisplay: '/^linea/m',
    explanation: 'Sin /m, ^ es solo inicio de string. Con /m, ^ es inicio de cada línea (después de \\n).',
    trivia: '/m es ESSENTIAL para procesar logs o archivos de texto multi-línea. Todos lo necesitan.'
  },
  {
    id: 34,
    type: 'matching',
    level: 'intermedio',
    category: 'escapes',
    regex: /\\./,
    question: '¿Cómo buscas un punto literal (.) en una regex?',
    options: [
      { text: 'Escapándolo con \\ (\\.)', isCorrect: true },
      { text: 'Poniendo [.]', isCorrect: false },
      { text: 'Con el flag /s', isCorrect: false },
      { text: 'No se puede', isCorrect: false }
    ],
    regexDisplay: '\\.',
    explanation: 'Los caracteres especiales (. ^ $ * + ? { } [ ] \\ | ( ) ) necesitan \\ para ser literales.',
    trivia: 'A esto se le llama "escapar". El \\ dice "trátalo como carácter normal, no especial".'
  },
  {
    id: 35,
    type: 'matching',
    level: 'intermedio',
    category: 'escapes',
    regex: /\\\\/,
    question: '¿Cómo buscas una barra invertida literal (\\)?',
    options: [
      { text: 'Con doble escape: \\\\', isCorrect: true },
      { text: 'Con un solo \\', isCorrect: false },
      { text: 'Con []', isCorrect: false },
      { text: 'No se puede', isCorrect: false }
    ],
    regexDisplay: '\\\\',
    explanation: 'Para buscar \\ necesitas escribir \\\\ (escapar el escape).',
    trivia: 'Windows paths: C:\\\\Users\\\\name. Regex sees \\\\ as escaped \\ = literal backslash.'
  },
  {
    id: 36,
    type: 'matching',
    level: 'intermedio',
    category: 'wordboundaries',
    regex: /\\bpalabra\\b/,
    question: '¿Qué significa \\b (word boundary)?',
    options: [
      { text: 'Límite entre palabra y no-palabra', isCorrect: true },
      { text: 'Espacio en blanco', isCorrect: false },
      { text: 'Inicio de cadena', isCorrect: false },
      { text: 'Final de cadena', isCorrect: false }
    ],
    regexDisplay: '\\bpalabra\\b',
    explanation: '\\b marca el límite entre \\w (letra/número/_) y no-\\w. Útil para encontrar palabras completas.',
    trivia: '\\b es ESSENTIAL para evitar partial matches. "pre\\b" no match "preparar". Smart!'
  },
  {
    id: 37,
    type: 'matching',
    level: 'intermedio',
    category: 'wordboundaries',
    regex: /\\Bpalabra\\B/,
    question: '¿Qué hace \\B (non-word boundary)?',
    options: [
      { text: 'Coincide DENTRO de palabras, no al inicio/fin', isCorrect: true },
      { text: 'Es igual a \\b', isCorrect: false },
      { text: 'Coincide con espacios', isCorrect: false },
      { text: 'No funciona', isCorrect: false }
    ],
    regexDisplay: '\\Bpalabra\\B',
    explanation: '\\B es lo opuesto a \\b. Coincide donde NO hay límite de palabra - dentro de palabras.',
    trivia: '\\Bword\\B encuentra "word" dentro de "swordfish" pero no como palabra independiente.'
  },
  {
    id: 38,
    type: 'matching',
    level: 'intermedio',
    category: 'lookahead',
    regex: /\\d+(?=px)/,
    question: '¿Qué es un lookahead (?=)?',
    options: [
      { text: 'Busca lo que SIGUE sin incluirlo en el match', isCorrect: true },
      { text: 'Busca lo que precede', isCorrect: false },
      { text: 'Hace la regex más rápida', isCorrect: false },
      { text: 'Escapa caracteres', isCorrect: false }
    ],
    regexDisplay: '\\d+(?=px)',
    explanation: 'Lookahead es una assertion que verifica qué viene después SIN consumir caracteres.',
    trivia: 'Lookahead exists since Perl 5.6 (2000). JavaScript los soporta desde 2018. Took 18 years!'
  },
  {
    id: 39,
    type: 'matching',
    level: 'intermedio',
    category: 'lookahead',
    regex: /\\d+(?!px)/,
    question: '¿Qué significa (?!...) (negative lookahead)?',
    options: [
      { text: 'Busca lo que NO va seguido de ...', isCorrect: true },
      { text: 'Busca lo que va seguido de ...', isCorrect: false },
      { text: 'Hace match obligatorio', isCorrect: false },
      { text: 'Es igual a (?=...)', isCorrect: false }
    ],
    regexDisplay: '\\d+(?!px)',
    explanation: 'Negative lookahead verifica que lo siguiente NO sea lo especificado.',
    trivia: 'Útil para validaciones: \\d+(?!px) encuentra números que NO terminan en px.'
  },
  {
    id: 40,
    type: 'matching',
    level: 'intermedio',
    category: 'lookbehind',
    regex: /(?<=\\$)\\d+/,
    question: '¿Qué es un lookbehind (?<=)?',
    options: [
      { text: 'Busca lo que precede SIN incluirlo', isCorrect: true },
      { text: 'Busca lo que sigue', isCorrect: false },
      { text: 'Es lo mismo que lookahead', isCorrect: false },
      { text: 'No existe en JavaScript', isCorrect: false }
    ],
    regexDisplay: '(?<=\\$)\\d+',
    explanation: 'Lookbehind busca hacia atrás. (?<=$) busca después de $. Similar a (?=) pero hacia atrás.',
    trivia: 'JavaScript soportó lookbehind desde 2018. Antes era imposible. 20 años esperando!'
  },
  {
    id: 41,
    type: 'matching',
    level: 'intermedio',
    category: 'negacion',
    regex: /^(?!.*@).+$/,
    question: '¿Qué hace (?!...) al inicio?',
    options: [
      { text: 'Negative lookahead - rechaza si contiene @', isCorrect: true },
      { text: 'Hace obligatorio tener @', isCorrect: false },
      { text: 'Escapa el @', isCorrect: false },
      { text: 'No funciona', isCorrect: false }
    ],
    regexDisplay: '^(?!.*@).+$',
    explanation: '^(?!.*@) significa "al inicio, asegura que NO haya @ en algún lugar".',
    trivia: 'This pattern validates "no @ anywhere". Perfect for usernames without email.'
  },
  {
    id: 42,
    type: 'matching',
    level: 'intermedio',
    category: 'greedylazy',
    regex: /".*?"/,
    question: '¿Qué significa el ? después de * (.*?)?',
    options: [
      { text: 'Hace el cuantificador "lazy" - mínimo match posible', isCorrect: true },
      { text: 'El ? es obligatorio', isCorrect: false },
      { text: 'Hace el match más rápido', isCorrect: false },
      { text: 'Es igual a .*', isCorrect: false }
    ],
    regexDisplay: '".*?"',
    explanation: 'Por defecto * es "greedy" (maximal). Agregar ? lo hace "lazy" (minimal).',
    trivia: 'Greedy matching fue el default por eficiencia. Lazy se agregó después porque los devs se cansaron de esperar.'
  },
  {
    id: 43,
    type: 'matching',
    level: 'intermedio',
    category: 'greedylazy',
    regex: /<.+>/,
    question: 'Sin el ?, .* es greedy. ¿Qué problema causa?',
    options: [
      { text: 'Matchea hasta el ÚLTIMO >, no el primero', isCorrect: true },
      { text: 'No funciona en absoluto', isCorrect: false },
      { text: 'Solo matchea un carácter', isCorrect: false },
      { text: 'Es más rápido', isCorrect: false }
    ],
    regexDisplay: '<.+> vs <.+?>',
    explanation: 'Greedy: "<div><span>hola</span></div>" → matchea TODO. Lazy: "<div>" → primer tag.',
    trivia: 'Este problema causa bugs en HTML parsing desde los 90s. Siempre usa .*? para HTML tags.'
  },
  {
    id: 44,
    type: 'matching',
    level: 'intermedio',
    category: 'rangos',
    regex: /[a-z]/,
    question: '¿Qué significa [a-z]?',
    options: [
      { text: 'Cualquier letra minúscula de la a a la z', isCorrect: true },
      { text: 'Solo la letra a y la letra z', isCorrect: false },
      { text: 'Todas las letras', isCorrect: false },
      { text: 'Los caracteres a, guión, z', isCorrect: false }
    ],
    regexDisplay: '[a-z]',
    explanation: 'El guión dentro de corchetes significa "rango". a-z = todas las letras minúsculas.',
    trivia: '[a-zA-Z] = todas las letras. [0-9] = dígitos. Funciona con cualquier carácter Unicode.'
  },
  {
    id: 45,
    type: 'matching',
    level: 'intermedio',
    category: 'rangos',
    regex: /[A-Z]/,
    question: '¿Cómo coincided con MAYÚSCULAS?',
    options: [
      { text: '[A-Z] - letras mayúsculas A a Z', isCorrect: true },
      { text: '[a-z]', isCorrect: false },
      { text: '\\U', isCorrect: false },
      { text: 'Con flag /i', isCorrect: false }
    ],
    regexDisplay: '[A-Z]',
    explanation: '[A-Z] con mayúsculas. Para ambos casos: [A-Za-z] o simplemente /[A-Z]/i',
    trivia: 'Regex es case-SENSITIVE. [a-z] ≠ [A-Z]. Want both? Use /[a-z]/i or [A-Za-z].'
  },
  {
    id: 46,
    type: 'matching',
    level: 'intermedio',
    category: 'numeros',
    regex: /^\\d{5}$/,
    question: '¿Qué valida /^\\d{5}$/?',
    options: [
      { text: 'Exactamente 5 dígitos (código postal)', isCorrect: true },
      { text: '5 o más dígitos', isCorrect: false },
      { text: 'Máximo 5 dígitos', isCorrect: false },
      { text: 'Cualquier número', isCorrect: false }
    ],
    regexDisplay: '^\\d{5}$',
    explanation: '^ y $ anclan inicio y fin. \\d{5} = exactamente 5 dígitos. Perfecto para ZIP codes.',
    trivia: 'US ZIP = 5 digits. UK = alfanumérico. Spain = 5 digits. Each country tiene su format.'
  },
  {
    id: 47,
    type: 'matching',
    level: 'intermedio',
    category: 'passwords',
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$/,
    question: '¿Qué valida esta regex de password?',
    options: [
      { text: 'Mínimo 8 chars: 1 mayúscula, 1 minúscula, 1 número', isCorrect: true },
      { text: 'Solo 8 caracteres exactamente', isCorrect: false },
      { text: 'Cualquier password', isCorrect: false },
      { text: 'Solo números', isCorrect: false }
    ],
    regexDisplay: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)...',
    explanation: 'Los (?=.*[a-z]) son lookaheads. Verifican condiciones SIN consumir caracteres.',
    trivia: 'Esta es la regex más COMMON para password validation. La usan la mayoría de webs.'
  },
  {
    id: 48,
    type: 'matching',
    level: 'avanzado',
    category: 'backreferences',
    regex: /(\\w+)\\s+\\1/,
    question: '¿Qué es \\1 en una regex?',
    options: [
      { text: 'Backreference - repeat del primer grupo capturado', isCorrect: true },
      { text: 'El carácter 1', isCorrect: false },
      { text: 'Escapa el 1', isCorrect: false },
      { text: 'No existe', isCorrect: false }
    ],
    regexDisplay: '(\\w+)\\s+\\1',
    explanation: '\\1 referencia lo que capturó el primer (). Si (\\w+) capturó "hola", \\1 = "hola".',
    trivia: 'Backreferences son ESSENTIAL para validar texto repetido. "palabra palabra" sin duplicar.'
  },
  {
    id: 49,
    type: 'matching',
    level: 'avanzado',
    category: 'namedgroups',
    regex: /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/,
    question: '¿Qué son los grupos nombrados (?<name>...)?',
    options: [
      { text: 'Capturan con nombre - accesibles como result.groups.year', isCorrect: true },
      { text: 'Grupos que no se capturan', isCorrect: false },
      { text: 'Comentarios', isCorrect: false },
      { text: 'No existen en JS', isCorrect: false }
    ],
    regexDisplay: '(?<year>\\d{4})',
    explanation: 'Los grupos nombraros permiten acceder al match por nombre en lugar de índice.',
    trivia: 'Soportado en JS desde ES2018. Antes solo indexes: $1, $2. Named is way better!'
  },
  {
    id: 50,
    type: 'matching',
    level: 'avanzado',
    category: 'html',
    regex: /<img[^>]+src="([^"]+)"/,
    question: '¿Cómo extraes la src de una imagen HTML?',
    options: [
      { text: 'Con grupo capturante captura el URL dentro de las comillas', isCorrect: true },
      { text: 'No se puede con regex', isCorrect: false },
      { text: 'Solo con herramientas externas', isCorrect: false },
      { text: 'Con ^', isCorrect: false }
    ],
    regexDisplay: '<img[^>]+src="([^"]+)"',
    explanation: '[^"]+ = cualquier carácter EXCEPTO ". El () captura el URL dentro de las comillas.',
    trivia: 'Esta regex es la base de todo web scraping. Image crawlers usan variations de esto.'
  },
  {
    id: 51,
    type: 'matching',
    level: 'basico',
    category: 'practica',
    regex: /^https?:\/\//,
    question: '¿Cómo validas que una URL empieza con http:// o https://?',
    options: [
      { text: '^https?:\\/\\/', isCorrect: true },
      { text: 'http://$', isCorrect: false },
      { text: '*http://', isCorrect: false },
      { text: '?', isCorrect: false }
    ],
    regexDisplay: '^https?:\\/\\/',
    explanation: '^ = inicio, https? = "http" o "https", \\/\\ = slash escapado.',
    trivia: 'El ? después de "s" hace la "s" opcional. genious! http OR https.'
  },
  {
    id: 52,
    type: 'matching',
    level: 'basico',
    category: 'practica',
    regex: /^\\+?[1-9]\\d{1,14}$/,
    question: '¿Qué formato valida este regex de teléfono?',
    options: [
      { text: 'Número internacional tipo E.164', isCorrect: true },
      { text: 'Solo números estadounidenses', isCorrect: false },
      { text: 'Cualquier número', isCorrect: false },
      { text: 'Números con letras', isCorrect: false }
    ],
    regexDisplay: '^\\+?[1-9]\\d{1,14}$',
    explanation: '+ = plus opcional, [1-9] = primer dígito no es 0, \\d{1,14} = hasta 14 dígitos.',
    trivia: 'E.164 es el estándar internacional. Max 15 dígitos. +34612345678 = Spain mobile.'
  },
  {
    id: 53,
    type: 'matching',
    level: 'basico',
    category: 'practica',
    regex: /^\\d{4}-\\d{2}-\\d{2}$/,
    question: '¿Qué formato de fecha valida esta regex?',
    options: [
      { text: 'YYYY-MM-DD (ISO 8601)', isCorrect: true },
      { text: 'DD-MM-YYYY', isCorrect: false },
      { text: 'MM-DD-YYYY', isCorrect: false },
      { text: 'Cualquiera', isCorrect: false }
    ],
    regexDisplay: '^\\d{4}-\\d{2}-\\d{2}$',
    explanation: 'Año(4)-Mes(2)-Día(2). El formato ISO 8601 usado worldwide para fechas.',
    trivia: 'ISO 8601 existe desde 1988. YYYY-MM-DD es el único formato que sort() correctly.'
  },
  {
    id: 54,
    type: 'matching',
    level: 'basico',
    category: 'practica',
    regex: /^[a-z][a-z0-9_]{2,15}$/,
    question: '¿Qué valida este regex de username?',
    options: [
      { text: '3-16 chars: starts letter, luego letras/números/_', isCorrect: true },
      { text: 'Solo números', isCorrect: false },
      { text: 'Cualquier cosa', isCorrect: false },
      { text: 'Más de 16 caracteres', isCorrect: false }
    ],
    regexDisplay: '^[a-z][a-z0-9_]{2,15}$',
    explanation: 'Starts con [a-z], luego 2-15 de [a-z0-9_]. Total: 3-16 chars. Common rule.',
    trivia: 'Twitter, Instagram username rules follow similar patterns. Standard internet rule.'
  },
  {
    id: 55,
    type: 'matching',
    level: 'intermedio',
    category: 'practica',
    regex: /^(?:[0-1]\\d|2[0-3]):[0-5]\\d$/,
    question: '¿Qué formato de hora valida?',
    options: [
      { text: 'Formato 24h: 00:00 a 23:59', isCorrect: true },
      { text: 'Solo AM/PM', isCorrect: false },
      { text: 'Cualquier hora', isCorrect: false },
      { text: 'Formato 12h', isCorrect: false }
    ],
    regexDisplay: '^(?:[0-1]\\d|2[0-3]):[0-5]\\d$',
    explanation: '[0-1]\\d = 00-19, 2[0-3] = 20-23. Minutos = [0-5]\\d = 00-59.',
    trivia: '24-hour format es estándar ISO. US prefiere 12h con AM/PM. Europe uses 24h everywhere.'
  },
  {
    id: 56,
    type: 'matching',
    level: 'intermedio',
    category: 'practica',
    regex: /^[+]?[(]?\\d{3}[)]?[-\\s.]?\\d{3}[-\\s.]?\\d{4}$/,
    question: 'Este regex acepta cuántos formatos de teléfono?',
    options: [
      { text: 'Múltiples: (555) 123-4567, 555-123-4567, 5551234567', isCorrect: true },
      { text: 'Solo uno', isCorrect: false },
      { text: 'Ninguno', isCorrect: false },
      { text: 'Solo internacionales', isCorrect: false }
    ],
    regexDisplay: '[+]?[(]?\\d{3}[)]?[-\\s.]?\\d{3}...',
    explanation: '[(]? = parenthesis opcional, [-\\s.]? = separador opcional. Very flexible.',
    trivia: 'Phone regex son los MORE COMPLEX de todos. Cada país tiene format diferente.'
  },
  {
    id: 57,
    type: 'matching',
    level: 'intermedio',
    category: 'practica',
    regex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    question: '¿Qué color hexadecimal es válido?',
    options: [
      { text: '#FFFFFF, #fff, #AABBCC', isCorrect: true },
      { text: 'Solo 6 dígitos', isCorrect: false },
      { text: 'Solo 3 dígitos', isCorrect: false },
      { text: 'Ninguno', isCorrect: false }
    ],
    regexDisplay: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})',
    explanation: '6 dígitos hex O 3 dígitos hex. RGB corto (#fff) = RGB completo (#ffffff).',
    trivia: '#000000 = black, #FFFFFF = white. #3498db = "Bootstrap blue" - most common web color.'
  },
  {
    id: 58,
    type: 'matching',
    level: 'intermedio',
    category: 'practica',
    regex: /^\\d{1,3}(\\.\\d{1,3}){3}$/,
    question: '¿Cómo validas una IPv4 simple?',
    options: [
      { text: '4 octetos de 1-3 dígitos separados por punto', isCorrect: true },
      { text: 'Cualquier número', isCorrect: false },
      { text: 'Solo 4 números', isCorrect: false },
      { text: 'No funciona', isCorrect: false }
    ],
    regexDisplay: '^\\d{1,3}(\\.\\d{1,3}){3}$',
    explanation: '\\d{1,3} = 0-999, (\\.\\d{1,3}){3} = .XXX repetido 3 veces. Simple but not perfect.',
    trivia: 'Esta regex acepta 999.999.999.999 (invalid). Para validar 0-255 necesitas más complex.'
  },
  {
    id: 59,
    type: 'matching',
    level: 'intermedio',
    category: 'logs',
    regex: /^\[(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\]\s+(INFO|WARN|ERROR)$/,
    question: '¿Qué captura este regex de log?',
    options: [
      { text: 'Fecha, hora y nivel (INFO/WARN/ERROR)', isCorrect: true },
      { text: 'Solo la fecha', isCorrect: false },
      { text: 'Solo el nivel', isCorrect: false },
      { text: 'Nada', isCorrect: false }
    ],
    regexDisplay: '^\\[...\\]\\s+(INFO|WARN|ERROR)$',
    explanation: '3 grupos capturados: fecha, hora, nivel. Útil para parsing de logs.',
    trivia: 'Log parsing es uno de los principales use cases de regex. Logs are everywhere.'
  },
  {
    id: 60,
    type: 'matching',
    level: 'avanzado',
    category: 'practica',
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$/,
    question: '¿Cuántas condiciones verifica este password regex?',
    options: [
      { text: '5: minúscula, mayúscula, número, símbolo, 8-16 chars', isCorrect: true },
      { text: '2 condiciones', isCorrect: false },
      { text: '1 condición', isCorrect: false },
      { text: 'No verifica nada', isCorrect: false }
    ],
    regexDisplay: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)...',
    explanation: '4 lookaheads independientes + longitud 8-16. Muy strict password policy.',
    trivia: 'NIST 2023 now says: no arbitrary rules! Just check against breaches. But empresas still use these.'
  }
]

const builderComponents = [
  { id: 'start', symbol: '^', name: 'Inicio', description: 'Coincide con el inicio de la cadena' },
  { id: 'end', symbol: '$', name: 'Fin', description: 'Coincide con el final de la cadena' },
  { id: 'dot', symbol: '.', name: 'Cualquiera', description: 'Cualquier caracter (excepto newline)' },
  { id: 'digit', symbol: '\\d', name: 'Dígito', description: 'Cualquier número (0-9)' },
  { id: 'word', symbol: '\\w', name: 'Palabra', description: 'Letra, número o underscore' },
  { id: 'space', symbol: '\\s', name: 'Espacio', description: 'Espacio, tab o newline' },
  { id: 'plus', symbol: '+', name: 'Uno o más', description: 'Una o más ocurrencias' },
  { id: 'star', symbol: '*', name: 'Cero o más', description: 'Cero o más ocurrencias' },
  { id: 'optional', symbol: '?', name: 'Opcional', description: 'Cero o una ocurrencia' },
  { id: 'charClass', symbol: '[abc]', name: 'Clase', description: 'Coincide con a, b o c' },
  { id: 'range', symbol: '[a-z]', name: 'Rango', description: 'Rango de letras' },
  { id: 'group', symbol: '(abc)', name: 'Grupo', description: 'Agrupa patrones' },
  { id: 'quantifier', symbol: '{3}', name: 'Repeticiones', description: 'Exactamente n veces' },
  { id: 'or', symbol: '|', name: 'O', description: 'Alternativa (esto o aquello)' },
  { id: 'negate', symbol: '[^abc]', name: 'Negar', description: 'Cualquiera excepto estos' }
]

const fixRegexQuestions = [
  {
    id: 1,
    level: 'basico',
    question: 'El usuario quiere validar emails pero el patrón no funciona bien. ¿Cuál es el error?',
    brokenRegex: '^[\\s@]+@[\\s@]+$',
    testCases: [
      { input: 'test@email.com', shouldMatch: true, actualMatch: true },
      { input: 'invalid', shouldMatch: false, actualMatch: false },
      { input: 'test@.com', shouldMatch: false, actualMatch: true, isError: true }
    ],
    hint: 'Mira el caso "test@.com" - debería fallar pero está pasando.',
    fix: '^[\\s@]+@[\\s@]+\\.[\\s@]+$',
    explanation: 'Falta el punto y dominio después. El patrón original acepta cualquier cosa después del @.',
    trivia: 'El email más largo del mundo tiene 254 caracteres. El más corto tiene 3 (a@b.c).'
  },
  {
    id: 2,
    level: 'basico',
    question: 'Este patrón debería validar números de teléfono美国的格式 (XXX-XXX-XXXX) pero no funciona.',
    brokenRegex: '^\\d{3}\\d{3}\\d{4}$',
    testCases: [
      { input: '123-456-7890', shouldMatch: true, actualMatch: false, isError: true }
    ],
    hint: 'El input tiene guiones, pero el patrón no los considera.',
    fix: '^\\d{3}-\\d{3}-\\d{4}$',
    explanation: 'El patrón no tiene guiones en las posiciones correctas. Debe incluir los separadores.',
    trivia: 'El primer código de área de USA fue 201 (Nueva Jersey). Ahora hay más de 300.'
  },
  {
    id: 3,
    level: 'intermedio',
    question: 'Este pattern debería aceptar fechas en formato YYYY-MM-DD, pero está aceptando cualquier cosa.',
    brokenRegex: '.*',
    testCases: [
      { input: '2024-12-25', shouldMatch: true, actualMatch: true },
      { input: 'hola', shouldMatch: false, actualMatch: true, isError: true },
      { input: 'random123', shouldMatch: false, actualMatch: true, isError: true }
    ],
    hint: 'El patrón es demasiado permisivo. .* acepta TODO.',
    fix: '^\\d{4}-\\d{2}-\\d{2}$',
    explanation: '.* significa "cualquier cosa", incluyendo strings vacíos. Necesitas especificar el formato exacto.',
    trivia: 'El problema Y2K existía porque muchos usaban 2 dígitos para el año. Ahora usamos 4. Problema resuelto... hasta el año 10000.'
  },
  {
    id: 4,
    level: 'intermedio',
    question: 'Este regex debería encontrar palabras que empiezan con "pre" pero solo encuentra una.',
    brokenRegex: '/pre\\w+/g',
    testCases: [
      { text: 'predecir preventivo prehistoria', matches: 1, shouldMatch: 3, isError: true }
    ],
    hint: 'El patrón está bien, pero puede haber un error en cómo se usa. Mira el flag.',
    fix: '/\\bpre\\w+/g',
    explanation: 'Falta el \\b (word boundary). Sin él, "pre" dentro de "recuperar" también hace match.',
    trivia: 'La palabra más larga en español con "pre" es "preternatural". 14 letras. En inglés: "preposterousness". 17 letras.'
  },
  {
    id: 5,
    level: 'avanzado',
    question: 'El patrón debería capturar el contenido dentro de tags HTML, pero captura demasiado.',
    brokenRegex: '/<.*>/g',
    testCases: [
      { text: '<div><span>hola</span></div>', match: '<div><span>hola</span></div>', shouldMatch: '<div>', isError: true }
    ],
    hint: 'El cuantificador * es greedy (codicioso) por defecto.',
    fix: '/<[^>]+>/g',
    explanation: '.* matching hasta el ÚLTIMO >, no el primero. Usa [^>]+ (cualquier cosa excepto >) para evitar esto.',
    trivia: 'El cuantificador lazy (*?) hace match del mínimo posible. Fue inventado porque los desarrolladores se frustraron esperando matches greedy.'
  },
  {
    id: 6,
    level: 'avanzado',
    question: 'Este patrón debería validar IPv4 pero acepta IPs inválidas.',
    brokenRegex: '/\\d+\\.\\d+\\.\\d+\\.\\d+/',
    testCases: [
      { input: '999.999.999.999', shouldMatch: false, actualMatch: true, isError: true },
      { input: '192.168.1.1', shouldMatch: true, actualMatch: true }
    ],
    hint: 'Cada octeto puede ser 0-255, no 0-999.',
    fix: '/^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$/',
    explanation: '\\d+ acepta cualquier número. Necesitas restringir cada octeto a 0-255 con alternación.',
    trivia: 'La IP 255.255.255.255 es la dirección de broadcast. Nadie la usa como IP normal. Es como gritar "¡hola a todos!" en una fiesta.'
  }
]

export function useQuiz() {
  const currentMode = ref(null)
  const currentQuestionIndex = ref(0)
  const score = ref(0)
  const streak = ref(0)
  const showExplanation = ref(false)
  const lastAnswerCorrect = ref(null)
  const showTrivia = ref(false)
  const currentTrivia = ref(null)
  const timeRemaining = ref(60)
  const isTimerRunning = ref(false)

  const userLevel = computed(() => {
    const xp = userProgress.value.xp
    return levels.find(l => xp >= l.minXP && xp < l.maxXP) || levels[levels.length - 1]
  })

  const progressToNextLevel = computed(() => {
    const current = levels.find(l => l.name === userLevel.value.name)
    const next = levels[levels.indexOf(current) + 1]
    if (!next) return 100
    const progress = ((userProgress.value.xp - current.minXP) / (next.minXP - current.minXP)) * 100
    return Math.min(100, Math.max(0, progress))
  })

  function selectMode(mode) {
    currentMode.value = mode
    resetQuiz()
  }

  function resetQuiz() {
    currentQuestionIndex.value = 0
    score.value = 0
    streak.value = 0
    showExplanation.value = false
    lastAnswerCorrect.value = null
    showTrivia.value = false
    timeRemaining.value = 60
    isTimerRunning.value = false
  }

  function answerQuestion(isCorrect) {
    lastAnswerCorrect.value = isCorrect
    showExplanation.value = true

    console.log('answerQuestion called with isCorrect:', isCorrect)

    if (isCorrect) {
      streak.value++
      const pointsEarned = streak.value * 10
      score.value = score.value + pointsEarned
      userProgress.value.xp += 10
      userProgress.value.totalCorrect++
      console.log('Score updated:', score.value, 'Streak:', streak.value)
    } else {
      streak.value = 0
    }

    userProgress.value.totalQuestions++
    userProgress.value.history.push({
      mode: currentMode.value,
      correct: isCorrect,
      timestamp: Date.now()
    })

    localStorage.setItem('quizProgress', JSON.stringify(userProgress.value))

    showRandomTrivia()
  }

  function showRandomTrivia() {
    const randomIndex = Math.floor(Math.random() * triviaData.length)
    currentTrivia.value = triviaData[randomIndex]
    showTrivia.value = true
  }

  function nextQuestion() {
    showExplanation.value = false
    showTrivia.value = false
    lastAnswerCorrect.value = null
    currentQuestionIndex.value++
  }

  function getQuestionsForMode(mode, level = null) {
    if (mode === 'progressive') {
      return level ? questions.filter(q => q.level === level) : questions
    }
    if (mode === 'builder') {
      return questions.slice(0, 5)
    }
    if (mode === 'speed') {
      return [...questions].sort(() => Math.random() - 0.5)
    }
    if (mode === 'fix') {
      return fixRegexQuestions
    }
    return questions
  }

  function startTimer() {
    isTimerRunning.value = true
    const interval = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
      } else {
        clearInterval(interval)
        isTimerRunning.value = false
      }
    }, 1000)
  }

  function stopTimer() {
    isTimerRunning.value = false
    timeRemaining.value = 60
  }

  function selectBuilderComponent(component) {
    return component.symbol
  }

  return {
    questions,
    builderComponents,
    fixRegexQuestions,
    currentMode,
    currentQuestionIndex,
    score,
    streak,
    showExplanation,
    lastAnswerCorrect,
    showTrivia,
    currentTrivia,
    timeRemaining,
    isTimerRunning,
    userProgress,
    userLevel,
    progressToNextLevel,
    selectMode,
    resetQuiz,
    answerQuestion,
    nextQuestion,
    getQuestionsForMode,
    startTimer,
    stopTimer,
    selectBuilderComponent
  }
}