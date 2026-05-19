# 🎯 RegexLab - Aprende y Practica Expresiones Regulares

Una plataforma interactiva moderna para aprender, practicar y dominar expresiones regulares (Regex). Construida con Laravel + Vue 3 + Inertia + TailwindCSS.

![RegexLab](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel)
![Vue](https://img.shields.io/badge/Vue-3.x-42B883?style=for-the-badge&logo=vue.js)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=for-the-badge&logo=tailwind-css)
![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?style=for-the-badge&logo=php)

## ✨ Características

### 🏠 Inicio
- Dashboard moderno con funcionalidades destacadas
- Demo interactiva de regex en tiempo real
- Enlaces rápidos a todas las secciones

### 🎮 Playground
- Editor de regex en tiempo real
- Resaltado de coincidencias
- Explicación automática de cada patrón
- Historial de búsquedas
- Compartir URLs con patrones guardados
- Flags interactivos (g, i, m, s, u)

### 📚 Learn (Tutorial Interactivo)
- 10 secciones completas de aprendizaje:
  - Introducción a Regex
  - Metacaracteres
  - Cuantificadores
  - Clases de Caracteres
  - Secuencias Especiales
  - Grupos
  - Anclas
  - Flags
  - Aplicaciones Reales
  - Errores Comunes
- Playground embebido en cada ejemplo
- Más de 60+ preguntas interactivas
- Diseño moderno tipo documentación premium

### 🧪 Quiz Interactivo
4 modos de juego:

1. **🌱 Progresivo**
   - 3 niveles: Básico, Intermedio, Avanzado
   - Preguntas aleatorias
   - Opciones mezcladas en cada pregunta
   - Sistema de puntos y rachas
   - Explicaciones detalladas después de cada respuesta

2. **🧱 Constructor**
   - Construye regex arrastrando componentes
   - Componentes organizados por categorías:
     - Anclas (^, $, \b)
     - Metacaracteres (., \d, \w, \s)
     - Cuantificadores (+, *, ?, {n}, {n,m})
     - Clases ([abc], [a-z], [^abc])
     - Grupos ((abc), |)

3. **⚡ Speed Challenge**
   - 60 segundos para responder cuántas puedas
   - Mezcla aleatoria de preguntas y opciones
   - Bonus por racha de respuestas correctas

4. **🔧 Corrige la Regex**
   - Encuentra y repara errores en regex
   - Casos de prueba visuales
   - Pistas interactivas

### 🎨 Diseño
- Dark mode integrado
- Atomic Design (átomos, moléculas, organismos)
- UI moderna tipo Vercel/Linear/Stripe
- Animaciones suaves
- Responsive design

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/CesarCarpio1125/expresionesRegulares.git
cd expresiones

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Start development servers
# Terminal 1 - Laravel
php artisan serve

# Terminal 2 - Vite
npm run dev
```

Then visit: `http://localhost:8000`

## 📁 Estructura del Proyecto

```
expresiones/
├── app/                    # Laravel application
├── resources/
│   └── js/
│       ├── components/    # Vue components (Atomic Design)
│       │   ├── atoms/     # BaseButton, BaseCard, BaseInput, etc.
│       │   ├── molecules/ # RegexExample, RegexTable, etc.
│       │   └── organisms/ # RegexPlayground, QuizMenu, etc.
│       ├── composables/   # Vue composables (useRegex, useQuiz, etc.)
│       ├── layouts/       # AppLayout
│       └── pages/         # Home, Playground, Quiz, Learn, etc.
├── routes/                # Laravel routes
├── public/               # Public assets
└── vite.config.js        # Vite configuration
```

## 🛠️ Technologies

- **Backend:** Laravel 10+
- **Frontend:** Vue 3 + Composition API
- **Routing:** Inertia.js
- **Styling:** TailwindCSS 3+
- **State:** Vue Composables
- **Build:** Vite

## 📝 License

MIT License - feel free to use this project for learning and teaching!

## 👨‍💻 Author

**César Carpio**
- GitHub: [@CesarCarpio1125](https://github.com/CesarCarpio1125)

---

⭐️ If you find this project useful, please give it a star!