// eslint-disable-next-line import/no-unresolved
import 'v-calendar/style.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'vue3-toastify/dist/index.css';
import '@/assets/toast.css';

// eslint-disable-next-line import/no-extraneous-dependencies
import VCalendar from 'v-calendar';
// eslint-disable-next-line import/no-extraneous-dependencies
import Vue3Toastify from 'vue3-toastify';

import router from '@/router';
import stores from '@/stores';

export default {
  install: (app) => {
    app.use(stores);
    app.use(router);
    app.use(VCalendar);
    app.use(Vue3Toastify, {
      autoClose: 3000,
      position: 'bottom-center',
      hideProgressBar: true,
      transition: 'slide',
      closeButton: false,
    });
  },
};
