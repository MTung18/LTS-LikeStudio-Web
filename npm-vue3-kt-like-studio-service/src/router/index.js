import { createRouter, createWebHistory } from 'vue-router';

import AnnouncementsDetail from '@/views/customer-service/announcements/detail/index.vue';
import AnnouncementsList from '@/views/customer-service/announcements/index.vue';
import FaqList from '@/views/customer-service/faq/index.vue';
import InquiriesDetail from '@/views/customer-service/inquiries/detail/index.vue';
import InquiriesEdit from '@/views/customer-service/inquiries/edit/index.vue';
import InquiriesList from '@/views/customer-service/inquiries/index.vue';
import ExampleButton from '@/views/example/button/index.vue';
import ExampleCheckbox from '@/views/example/checkbox/index.vue';
import ExampleDropdownSelect from '@/views/example/dropdown-select/index.vue';
import ExampleIcon from '@/views/example/icon/index.vue';
import ExampleIconButton from '@/views/example/icon-button/index.vue';
import Example from '@/views/example/index.vue';
import ExampleTabs from '@/views/example/tabs/index.vue';
import Home from '@/views/home.vue';

/** *
 *
 * meta: {
 *     layout: 'DefaultLayout' | 'AnotherLayout' // 레이아웃을 나눠야 할 때 사용
 * }
 *
 */
export const Routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/customer-service/announcements',
    name: 'announcementsList',
    component: AnnouncementsList,
  },
  {
    path: '/customer-service/announcements/:id',
    name: 'announcementsDetail',
    component: AnnouncementsDetail,
    props: true,
  },
  {
    path: '/customer-service/faq',
    name: 'faqList',
    component: FaqList,
  },
  {
    path: '/customer-service/inquiries',
    name: 'inquiriesList',
    component: InquiriesList,
  },
  {
    path: '/customer-service/inquiries/edit',
    name: 'inquiriesEdit',
    component: InquiriesEdit,
  },
  {
    path: '/customer-service/inquiries/:id',
    name: 'inquiriesDetail',
    component: InquiriesDetail,
  },
  {
    path: '/example',
    name: 'example',
    component: Example,
  },
  {
    path: '/example/button',
    name: 'exampleButton',
    component: ExampleButton,
  },
  {
    path: '/example/icon',
    name: 'exampleIcon',
    component: ExampleIcon,
  },
  {
    path: '/example/icon-button',
    name: 'exampleIconButton',
    component: ExampleIconButton,
  },
  {
    path: '/example/tabs',
    name: 'exampleTabs',
    component: ExampleTabs,
  },
  {
    path: '/example/dropdown-select',
    name: 'exampleDropdownSelect',
    component: ExampleDropdownSelect,
  },
  {
    path: '/example/checkbox',
    name: 'exampleCheckbox',
    component: ExampleCheckbox,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: Routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

export default router;
