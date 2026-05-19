import { createApp } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import './app.css';

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./pages/**/*.vue', { eager: true });
    return pages[`./pages/${name}.vue`];
  },
  setup({ el, App, props }) {
    const app = createApp(App, props);

    const theme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    app.mount(el);
  },
});