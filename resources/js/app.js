import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';

const pages = import.meta.glob('./pages/*.vue', { eager: true });

createInertiaApp({
  resolve: (name) => {
    console.log('Resolving:', name);
    const page = pages[`./pages/${name}.vue`];
    if (!page) {
      throw new Error(`Page not found: ${name}`);
    }
    return page;
  },
  setup({ el, App, props, plugin }) {
    console.log('Setup:', { el, props });
    console.log('Data page:', el.dataset.page);
    
    try {
      const app = createApp({
        render: () => h(App, props),
      });
      app.use(plugin);
      app.mount(el);
      console.log('Mounted successfully');
    } catch (error) {
      console.error('Mount error:', error);
    }
  },
});