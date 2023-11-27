import { createRouter, createWebHistory } from 'vue-router';

import Error403 from '@/components/403/403.vue';
import Error404 from '@/components/404/404.vue';
import Error503 from '@/components/503/503.vue';
import Error503Inspection from '@/components/503Inspection/503Inspection.vue';
import CIBI from '@/views/ci-bl/index.vue';
import CustomerAnnouncementsDetail from '@/views/customer-service/announcements/detail/index.vue';
import CustomerAnnouncementsList from '@/views/customer-service/announcements/index.vue';
import CustomerAnnouncementsNoData from '@/views/customer-service/announcements/nodata.vue';
import CustomerFaqList from '@/views/customer-service/faq/index.vue';
import CustomerFaqNodata from '@/views/customer-service/faq/nodata.vue';
import CustomerInquiriesCreate from '@/views/customer-service/inquiries/create/index.vue';
import CustomerInquiriesDetail from '@/views/customer-service/inquiries/detail/index.vue';
import CustomerInquiriesFirst from '@/views/customer-service/inquiries/first.vue';
import CustomerInquiriesList from '@/views/customer-service/inquiries/index.vue';
import CustomerInquiriesNodata from '@/views/customer-service/inquiries/nodata.vue';
import ExampleButton from '@/views/example/button/index.vue';
import ExampleCheckbox from '@/views/example/checkbox/index.vue';
import ExampleDropdownSelect from '@/views/example/dropdown-select/index.vue';
import ExampleIcon from '@/views/example/icon/index.vue';
import ExampleIconButton from '@/views/example/icon-button/index.vue';
import Example from '@/views/example/index.vue';
import ExampleRoundButton from '@/views/example/round-button/index.vue';
import ExampleSwitch from '@/views/example/switch/index.vue';
import ExampleTabs from '@/views/example/tabs/index.vue';
import Gallery from '@/views/gallery/index.vue';
import GalleryNodata from '@/views/gallery/nodata.vue';
import Home from '@/views/home.vue';
import MyStudio from '@/views/my-studio/index.vue';
import Policy from '@/views/policy/index.vue';
import ManagementAdminList from '@/views/site-management/admin/index.vue';
import ManagementAdminNodata from '@/views/site-management/admin/nodata.vue';
import ManagementAnnouncementsCreate from '@/views/site-management/announcements/create/index.vue';
import ManagementAnnouncementsEdit from '@/views/site-management/announcements/edit/index.vue';
import ManagementAnnouncementsList from '@/views/site-management/announcements/index.vue';
import ManagementAnnouncementsNodata from '@/views/site-management/announcements/nodata.vue';
import ManagementAssetDetail from '@/views/site-management/asset/detail/index.vue';
import ManagementAsset from '@/views/site-management/asset/index.vue';
import ManagementAssetNodata from '@/views/site-management/asset/nodata.vue';
import ManagementFaqCreate from '@/views/site-management/faq/create/index.vue';
import ManagementFaqEdit from '@/views/site-management/faq/edit/index.vue';
import ManagementFaqList from '@/views/site-management/faq/index.vue';
import ManagementFaqNodata from '@/views/site-management/faq/nodata.vue';
import ManagementGalleryDetail from '@/views/site-management/gallery/detail/index.vue';
import ManagementGallery from '@/views/site-management/gallery/index.vue';
import ManagementGalleryNodata from '@/views/site-management/gallery/nodata.vue';
import ManagementInquiriesDetail from '@/views/site-management/inquiries/detail/index.vue';
import ManagementInquiriesList from '@/views/site-management/inquiries/index.vue';
import ManagementInquiriesNodata from '@/views/site-management/inquiries/nodata.vue';
import ManagementMainCreate from '@/views/site-management/main/create/index.vue';
import ManagementMainEdit from '@/views/site-management/main/edit/index.vue';
import ManagementMainList from '@/views/site-management/main/index.vue';
import ManagementMainNodata from '@/views/site-management/main/nodata.vue';
import ManagementStatisticsList from '@/views/site-management/statistics/index.vue';
import ManagementTemplateDetail from '@/views/site-management/template/detail/index.vue';
import ManagementTemplate from '@/views/site-management/template/index.vue';
import ManagementTemplateNodata from '@/views/site-management/template/nodata.vue';
import ManagementVmdCreate from '@/views/site-management/vmd/create/index.vue';
import ManagementVmdEdit from '@/views/site-management/vmd/edit/index.vue';
import ManagementVmdList from '@/views/site-management/vmd/index.vue';
import ManagementVmdNodata from '@/views/site-management/vmd/nodata.vue';
import Template from '@/views/template/index.vue';
import TemplateNodata from '@/views/template/nodata.vue';
import Terms from '@/views/terms/index.vue';
import Vmd from '@/views/vmd/index.vue';
import VmdNodata from '@/views/vmd/nodata.vue';

/** *
 *
 * meta: {
 *     layout: 'DefaultLayout' | 'AnotherLayout' // 레이아웃을 나눠야 할 때 사용
 * }
 *
 */
export const Routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'error404',
    component: Error404,
    meta: {
      layout: 'NoHeaderFooterLayout',
    },
  },
  {
    path: '/error/403',
    name: 'error403',
    component: Error403,
    meta: {
      layout: 'NoHeaderFooterLayout',
    },
  },
  {
    path: '/error/503',
    name: 'error503',
    component: Error503,
    meta: {
      layout: 'NoHeaderFooterLayout',
    },
  },
  {
    path: '/error/503-inspection',
    name: 'error503Inspection',
    component: Error503Inspection,
    meta: {
      layout: 'NoHeaderFooterLayout',
    },
  },
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/terms',
    name: 'terms',
    component: Terms,
  },
  {
    path: '/policy',
    name: 'policy',
    component: Policy,
  },
  {
    path: '/ci-bi',
    name: 'ciBi',
    component: CIBI,
  },
  {
    path: '/template',
    name: 'template',
    component: Template,
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: Gallery,
  },
  {
    path: '/vmd',
    name: 'vmd',
    component: Vmd,
  },
  {
    path: '/my-studio',
    name: 'myStudio',
    component: MyStudio,
  },
  {
    path: '/customer-service/announcements',
    name: 'customerAnnouncementsList',
    component: CustomerAnnouncementsList,
  },
  {
    path: '/customer-service/announcements/:id',
    name: 'customerAnnouncementsDetail',
    component: CustomerAnnouncementsDetail,
    props: true,
  },
  {
    path: '/customer-service/faq',
    name: 'faqList',
    component: CustomerFaqList,
  },
  {
    path: '/customer-service/inquiries',
    name: 'inquiriesList',
    component: CustomerInquiriesList,
  },
  {
    path: '/customer-service/inquiries/create',
    name: 'inquiriesCreate',
    component: CustomerInquiriesCreate,
  },
  {
    path: '/customer-service/inquiries/:id/:state',
    name: 'inquiriesDetail',
    component: CustomerInquiriesDetail,
    props: (route) => ({ id: route.params.id, state: route.params.state }),
    beforeEnter: (to, from, next) => {
      const validStates = ['unanswered', 'answered'];
      if (validStates.includes(to.params.state)) {
        next();
      } else {
        next('/'); // 예제로 오류 페이지로 리다이렉트하도록 설정
      }
    },
  },
  {
    path: '/site-management/template',
    name: 'managementTemplate',
    component: ManagementTemplate,
  },
  {
    path: '/site-management/template/detail',
    name: 'managementTemplateDetail',
    component: ManagementTemplateDetail,
  },
  {
    path: '/site-management/gallery/detail',
    name: 'managementGalleryDetail',
    component: ManagementGalleryDetail,
  },
  {
    path: '/site-management/gallery',
    name: 'managementGallery',
    component: ManagementGallery,
  },
  {
    path: '/site-management/asset/detail',
    name: 'managementAssetDetail',
    component: ManagementAssetDetail,
  },
  {
    path: '/site-management/asset',
    name: 'managementAsset',
    component: ManagementAsset,
  },
  {
    path: '/site-management/vmd',
    name: 'managementVmdList',
    component: ManagementVmdList,
  },
  {
    path: '/site-management/vmd/create',
    name: 'managementVmdCreate',
    component: ManagementVmdCreate,
  },
  {
    path: '/site-management/vmd/:id/edit',
    name: 'managementVmdEdit',
    component: ManagementVmdEdit,
    props: true,
  },
  {
    path: '/site-management/inquiries',
    name: 'managementInquiriesList',
    component: ManagementInquiriesList,
  },
  {
    path: '/site-management/inquiries/:id/:state',
    name: 'managementInquiriesDetail',
    component: ManagementInquiriesDetail,
    props: (route) => ({ id: route.params.id, state: route.params.state }),
    beforeEnter: (to, from, next) => {
      const validStates = ['unanswered', 'answered', 'edit'];
      if (validStates.includes(to.params.state)) {
        next();
      } else {
        next('/'); // 예제로 오류 페이지로 리다이렉트하도록 설정
      }
    },
  },
  {
    path: '/site-management/faq',
    name: 'managementFaqList',
    component: ManagementFaqList,
  },
  {
    path: '/site-management/faq/create',
    name: 'managementFaqCreate',
    component: ManagementFaqCreate,
  },
  {
    path: '/site-management/faq/:id/edit',
    name: 'managementFaqEdit',
    component: ManagementFaqEdit,
    props: true,
  },
  {
    path: '/site-management/announcements',
    name: 'managementAnnouncementsList',
    component: ManagementAnnouncementsList,
  },
  {
    path: '/site-management/announcements/create',
    name: 'managementAnnouncementsCreate',
    component: ManagementAnnouncementsCreate,
  },
  {
    path: '/site-management/announcements/:id/edit',
    name: 'managementAnnouncementsEdit',
    component: ManagementAnnouncementsEdit,
    props: true,
  },
  {
    path: '/site-management/main',
    name: 'managementMainList',
    component: ManagementMainList,
  },
  {
    path: '/site-management/main/create',
    name: 'managementMainCreate',
    component: ManagementMainCreate,
  },
  {
    path: '/site-management/main/:id/edit',
    name: 'managementMainEdit',
    component: ManagementMainEdit,
    props: true,
  },
  {
    path: '/site-management/admin',
    name: 'managementAdminList',
    component: ManagementAdminList,
  },
  {
    path: '/site-management/statistics',
    name: 'managementStatisticsList',
    component: ManagementStatisticsList,
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
    path: '/example/round-button',
    name: 'exampleRoundButton',
    component: ExampleRoundButton,
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
  {
    path: '/example/switch',
    name: 'exampleSwitch',
    component: ExampleSwitch,
  },
  /** *************** preview 확일 은 위한 라우팅 ******************** */
  {
    path: '/template-nodata',
    name: 'templateNodata',
    component: TemplateNodata,
  },
  {
    path: '/gallery-nodata',
    name: 'galleryNodata',
    component: GalleryNodata,
  },
  {
    path: '/vmd-nodata',
    name: 'vmdNodata',
    component: VmdNodata,
  },
  {
    path: '/customer-service/announcements/nodata',
    name: 'customerAnnouncementsNoData',
    component: CustomerAnnouncementsNoData,
  },
  {
    path: '/customer-service/faq/nodata',
    name: 'customerFaqNoData',
    component: CustomerFaqNodata,
  },
  {
    path: '/customer-service/inquiries/nodata',
    name: 'customerInquiriesNoData',
    component: CustomerInquiriesNodata,
  },
  {
    path: '/customer-service/inquiries/first',
    name: 'customerInquiriesFirst',
    component: CustomerInquiriesFirst,
  },
  {
    path: '/site-management/template/nodata',
    name: 'managementTemplateNodata',
    component: ManagementTemplateNodata,
  },
  {
    path: '/site-management/gallery/nodata',
    name: 'managementGalleryNodata',
    component: ManagementGalleryNodata,
  },
  {
    path: '/site-management/asset/nodata',
    name: 'managementAssetNodata',
    component: ManagementAssetNodata,
  },
  {
    path: '/site-management/vmd/nodata',
    name: 'managementVmdNodata',
    component: ManagementVmdNodata,
  },
  {
    path: '/site-management/inquiries/nodata',
    name: 'managementInquiriesNodata',
    component: ManagementInquiriesNodata,
  },
  {
    path: '/site-management/faq/nodata',
    name: 'managementFaqNodata',
    component: ManagementFaqNodata,
  },
  {
    path: '/site-management/announcements/nodata',
    name: 'managementAnnouncementsNodata',
    component: ManagementAnnouncementsNodata,
  },
  {
    path: '/site-management/main/nodata',
    name: 'managementMainNodata',
    component: ManagementMainNodata,
  },
  {
    path: '/site-management/admin/nodata',
    name: 'managementAdminNodata',
    component: ManagementAdminNodata,
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
