<template>
  <fs-navbar class="inner-sidenav">
    <fs-navbar-nav class="w-100">
      <fs-nav-item v-if="props.showBackLink" class="inner-sidenav__item sticky--top"
        link-classes="inner-sidenav__link inner-sidenav__backlink" :to="navigationData?.backTo">
        <div class="inner-sidenav__icon-wrapper">
          <font-awesome-icon :icon="['fal', 'circle-arrow-left']" size="2x" class="inner-sidenav__icon text-primary" />
        </div>
        <span>Back</span>
      </fs-nav-item>

      <template v-for="(item, index) in navigationData?.data" :key="item.id">
        <fs-nav-item v-if="permissions[item.uiFieldTag]" exact class="inner-sidenav__item" ref="target"
          :link-classes="`inner-sidenav__link inner-sidenav__link bg-index-color-${index}`"

          :active-class="`inner-sidenav__link--active bg-index-color-${index} bg-opacity-10 border-index-color-${index}`"
          :to="item.to">
          <div class="inner-sidenav__icon-wrapper">
            <div :class="`inner-sidenav__icon-circle bg-index-color-${index} bg-opacity-10`">
              <FontAwesomeIcon :icon="item.icon?.length > 0 ? item.icon : 'fa-light fa-house'" size="lg"
                :class="`text-index-color-${index}`" />
            </div>
          </div>
          {{ item.label }}
        </fs-nav-item>
      </template>
    </fs-navbar-nav>
  </fs-navbar>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, onMounted, ref, inject } from "vue";
import { useRoute } from "vue-router";
import { useNavigationStore } from "@/stores/NavigationStore";
import { faArrowLeft, faCircleArrowLeft, faUser, faFileContract, faFileCertificate, faStar, faStickyNote, faInfoCircle, faUserPlus, faBiohazard, faPiggyBank, faLockKeyhole, faCalendarAlt, faFolderHeart, faChalkboard, faExchange } from '@fortawesome/pro-light-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";

const permissions = inject('$providePermissions');

library.add(
  faArrowLeft, faCircleArrowLeft, faUser, faFileContract, faFileCertificate, faStar, faStickyNote, faInfoCircle, faUserPlus, faBiohazard, faPiggyBank, faLockKeyhole, faCalendarAlt, faFolderHeart, faChalkboard, faExchange
);
const props = defineProps(['showBackLink'])

const navigationStore = useNavigationStore();
const navigationData = computed(() => {
  return navigationStore.getNavigationItemsForPage(useRoute().name);
});

onMounted(() => {
  for (let i = 0; i < navigationData?.value?.data?.length; i++) {

    const item = navigationData?.value?.data[i];

    if (library['definitions'][item.icon[0]][item.icon[1]] === undefined) {
      console.warn(`Icon ${item.icon[0]} ${item.icon[1]} was added in the navigation store but not imported in the 'innerSidenav' library`);
    }
  }
});
</script>
