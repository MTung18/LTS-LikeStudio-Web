// eslint-disable-next-line import/no-extraneous-dependencies
import { toast } from 'vue3-toastify';

import IconCirCleCheck from '@/components/Icons/Icon/IconCirCleCheck.vue';
import IconError from '@/components/Icons/Icon/IconError.vue';

const customToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      icon: IconCirCleCheck,
      ...options,
    });
  },
  error: (message, options = {}) => {
    toast.error(message, {
      icon: IconError,
      ...options,
    });
  },
};

export default customToast;
