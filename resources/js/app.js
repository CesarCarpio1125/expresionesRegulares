import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import './app.css';

createInertiaApp({
  resolve: (name) => {
    console.log('Resolving component:', name);
    return resolvePageComponent(`./pages/${name}.vue`, import.meta.glob('./pages/**/*.vue'));
  },
  setup({ el, App, props, plugin }) {
    console.log('Inertia setup:', { el, props });
    
    const app = createApp({ render: () => h(App, props) });
    app.use(plugin);

    const theme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    const mountEl = el || document.getElementById('app') || (() => {
      const d = document.createElement('div');
      d.id = 'app';
      document.body.appendChild(d);
      return d;
    })();

    console.log('Mounting to:', mountEl);
    app.mount(mountEl);
  },
  onError: (error) => {
    console.error('Inertia Error:', error);
  },
});