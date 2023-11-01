<!-- eslint-disable prettier/prettier -->
<template>
  <fs-navbar type="dark" variant="blue--dk" class="portfolionav" :class="{ 'overflow-auto': !responsive.mobile }">
    <fs-navbar-nav class="portfolionav__nav h-100 d-print-none">
      <template v-for="item in displayedNav" :key="item.id">
        <fs-nav-item v-if="permissions[item.uiFieldTag]" :to="item.to" :link-classes="$route.fullPath.includes(item.to.name)
          ? 'portfolionav__link portfolionav__link--active'
          : 'portfolionav__link'
          " :class="item.navItemClass" class="portfolionav__item">
          <font-awesome-icon :icon="item.icon" size="2x" />
          <span>{{ item.label }}</span>
        </fs-nav-item>
      </template>

      <fs-nav-item-dropdown no-caret variant="link" class="portfolionav__item portfolionav__item--dropdown"
        style="max-width: 50px"
        :toggle-class="hiddenNavActive ? 'portfolionav__link portfolionav__link--active' : 'portfolionav__link'"
        menu-class="me-2 mb-2" dropup right v-if="responsive.mobile && hiddenNav.length > 0">
        <fs-dropdown-item class="portfolionav__link" v-for="item in hiddenNav" :key="item.id" :to="item.to"
          :active="$route.fullPath.includes(item.to.name)" exact-active-class="portfolionav__link--active">
          <div><font-awesome-icon :icon="item.icon" size="2x" /></div>
          <span>{{ item.label }}</span>
        </fs-dropdown-item>

        <template #button-content>
          <font-awesome-icon :icon="['fal', 'ellipsis']" class="text-white" size="2x" />
        </template>
      </fs-nav-item-dropdown>
    </fs-navbar-nav>
  </fs-navbar>
</template>

<script setup lang="ts">
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faCog,
  faTrashAlt,
  faClipboardListCheck,
  faUser,
  faUsers,
  faUserPlus,
  faFileContract,
  faFileCertificate,
  faUserTie,
  faEllipsis,
  faChalkboard,
  faBullhorn,
  faCalendarAlt,
  faFileChartLine
} from "@fortawesome/pro-light-svg-icons";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import GlobalSidenavItem from "@/models/nav/GlobalSidenavItem";
import { computed, inject } from 'vue';
import { useRoute } from "vue-router";

const route = useRoute();
const permissions = inject('$providePermissions');

library.add(
  faHome,
  faClipboardListCheck,
  faUser,
  faUsers,
  faUserPlus,
  faFileContract,
  faFileCertificate,
  faUserTie,
  faCog,
  faTrashAlt,
  faEllipsis,
  faChalkboard,
  faBullhorn,
  faCalendarAlt,
  faFileChartLine
);

interface GlobalSidenavProps {
  navItems?: Array<GlobalSidenavItem>;
}

const props = withDefaults(defineProps<GlobalSidenavProps>(), {
  navItems: () => [
    {
      id: 1,
      label: "Home",
      icon: ["fal", "home"],
      to: { name: "home" },
      uiFieldTag: "WHQ_248_3117",
    },
    {
      id: 2,
      label: "Employees",
      icon: ["fal", "users"],
      to: { name: "employees" },
      uiFieldTag: "WHQ_248_3118",
    },
    {
      id: 3,
      label: "New Hires",
      icon: ["fal", "user-plus"],
      to: { name: "onboarding" },
      uiFieldTag: "WHQ_248_3119",
    },
    {
      id: 4,
      label: "Documents",
      icon: ["fal", "file-contract"],
      to: { name: "documents" },
      uiFieldTag: "WHQ_248_3120",
    },
    {
      id: 5,
      label: "Time Off",
      icon: ["fal", "calendar-alt"],
      to: { name: "timeoff" },
      uiFieldTag: "WHQ_248_3121",
    },
    {
      id: 6,
      label: "Bulletin Board",
      icon: ["fal", "bullhorn"],
      to: { name: "bulletinBoard" },
      uiFieldTag: "WHQ_248_3122",
    },
    {
      id: 7,
      label: "Reports",
      icon: ["fal", "file-chart-line"],
      to: { name: "reports" },
      uiFieldTag: "WHQ_248_3123",
    },
    {
      id: 8,
      label: "Settings",
      icon: ["fal", "cog"],
      to: { name: "settings" },
      uiFieldTag: "WHQ_248_3124",
    }
  ],
});

const { responsive } = useBreakpoints();

const getNumberOfItemsToDisplay = () => {
  switch (responsive.breakpoint) {
    case "lg":
      return 6;
    case "md":
      return 5;
    case "sm":
      return 4;
    default:
      props.navItems.length;
  }
};
const displayedNav = computed(() => {
  return props.navItems.slice(0, getNumberOfItemsToDisplay());
});

const hiddenNav = computed(() => {
  return props.navItems.slice(
    getNumberOfItemsToDisplay(),
    props.navItems.length
  );
});
const hiddenNavActive = computed(() => {
  return hiddenNav.value.some((item) => route.fullPath.includes(item.to.name));
});
</script>
