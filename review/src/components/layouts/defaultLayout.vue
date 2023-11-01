<template>
  <div class="wrapper">
    <header class="wrapper__header">
      <global-header :responsive="responsive" :showInnerSidenav="showInnerSidenav" :globalSidenavOnly="globalSidenavOnly"
        @toggleInnerSidenav="toggleInnerSidenav">
      </global-header>
    </header>
    <global-overlay :show="!azureB2CAuthStore.activeUserClientList || azureB2CAuthStore.setActiveUserClientInProgress">
    </global-overlay>
    <div class="wrapper__nav">
      <global-sidenav></global-sidenav>
    </div>

    <div class="wrapper__main">
      <div class="content" :class="{
        'content--grid': showInnerSidenav && !globalSidenavOnly && responsive.breakpoint === 'xl',
        'background-form': formUpdateBackground,
      }">
        <transition name="inner-sidenav-transition"
          enter-active-class="animate__animated animate__slideInLeft animate__faster"
          leave-active-class="animate__animated animate__slideOutLeft animate__faster">
          <inner-sidenav-vue v-show="showInnerSidenav && !globalSidenavOnly" :innerSidenav="innerSidenav"
            :showBackLink="showInnerBackLink">
          </inner-sidenav-vue>
        </transition>
        <slot />
      </div>
      <notifications group="app" :width="responsive.mobile ? '100%' : '400px'" >
        <template #body="props">
          <div class="g-notifications shadow bg-white">
            <div class="g-notifications__icon" :class="props.item.type">
              <font-awesome-icon
                :icon="['fal', props.item.type === 'notification--error' ? 'times-circle' : 'check-circle']" size="2x" />
            </div>
            <div class="flex-fill d-flex flex-column justify-content-center mx-3">
              <div class="title">
                {{ props.item.title }}
              </div>
              <div class="fw-bold " v-html="props.item.text" />
            </div>

            <fs-link class="text-secondary d-flex p-2 align-self-start" @click="props.close">
              <font-awesome-icon :icon="['fal', 'times']"/>
            </fs-link>
          </div>
        </template>
      </notifications>
     <download-progress-bar></download-progress-bar>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import globalHeader from '@/components/navigation/globalHeader.vue';
import globalSidenav from '@/components/navigation/globalSidenav.vue';
import { useBreakpoints } from '@/composables/useBreakpoints';
import innerSidenavVue from '@/components/navigation/innerSidenav.vue';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import globalOverlay from '@/components/global/globalOverlay.vue';
import DownloadProgressBar from '../shared/downloadProgressBar.vue';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheckCircle, faTimes, faTimesCircle } from '@fortawesome/pro-light-svg-icons';

library.add(faCheckCircle, faTimesCircle, faTimes);

const azureB2CAuthStore = useAzureB2CAuthStore();

const { responsive } = useBreakpoints();

const innerSidenav = ref(false);
const globalSidenavOnly = ref(false);
const formUpdateBackground = ref(false);
const showInnerBackLink = ref(true);
const route = useRoute();

const showInnerSidenav = computed(() => {
  return responsive.mobile ? !innerSidenav.value : true
});

function toggleInnerSidenav(): void {
  innerSidenav.value = !innerSidenav.value;
}

watch(
  route,
  (to) => {
    globalSidenavOnly.value = !(to.meta?.showInnerSidenav);
    innerSidenav.value = !!to.meta?.showInnerSidenav;
    formUpdateBackground.value = !!to.meta?.formUpdateBackground;
    showInnerBackLink.value = !!to.meta?.showInnerBackLink
  },
  { flush: "pre", immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
@media print {
  header {
    display: none !important;
  }

  .wrapper__nav {
    display: none;
  }
}
</style>
