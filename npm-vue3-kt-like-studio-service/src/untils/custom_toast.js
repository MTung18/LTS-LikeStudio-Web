// eslint-disable-next-line import/no-extraneous-dependencies
import { toast } from 'vue3-toastify';

import IconCirCleCheck from '@/components/Icons/Icon/IconCirCleCheck.vue';
import IconError from '@/components/Icons/Icon/IconError.vue';

const customToast = {
  success: (message) => {
    toast.success(message, {
      icon: IconCirCleCheck,
    });
  },
  error: (message) => {
    toast.error(message, {
      icon: IconError,
    });
  },
};

export default customToast;
