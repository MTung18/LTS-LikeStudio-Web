import '@/assets/fonts/font.css';
import '@/assets/base.css';

import { createApp } from 'vue';

import App from '@/App.vue';
import plugins from '@/plugins';

const app = createApp(App);

app.use(plugins);
app.mount('#app');
