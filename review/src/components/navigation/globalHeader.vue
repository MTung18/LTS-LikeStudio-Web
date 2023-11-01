<template>
  <div>
    <fs-navbar type="light" fixed="top" variant="grey--100" class="globalheader">
      <fs-nav-text class="globalheader__toggle d-xl-none p-0" v-if="!globalSidenavOnly">
        <fs-button variant="link" tag="a" class="text-white" block @click="toggleInnerSidenav">
          <font-awesome-icon :icon="showInnerSidenav ? ['fal', 'times'] : ['fal', 'bars']" class="toggle-icon" />
        </fs-button>
      </fs-nav-text>

      <fs-container fluid class="p-0">
        <fs-navbar-brand class="contain" :to="{ name: 'home' }">
          <fs-img v-if="responsive.mobile" :src="wfhqIcon" :height=32 />
          <fs-img v-else :src="wfhqLogo" :height=32 />
        </fs-navbar-brand>

        <fs-navbar-brand class="globalheader__company-name">
          <fs-dropdown v-if="azureB2CAuthStore.activeUserClientList" size="lg" variant="link"
            :text="azureB2CAuthStore.activeUserClient?.clientName" toggle-tag="a"
            toggle-class="text-grey--500 text-decoration-none">
            <fs-dropdown-item href="#" v-for="client in azureB2CAuthStore.activeUserClientList" :key="client.clientGuid"
              class="globalheader__dropdown-item" @click="onClientSelected(client)">
              {{ client.clientName }}
            </fs-dropdown-item>
          </fs-dropdown>
        </fs-navbar-brand>

        <fs-navbar-nav v-if="responsive.mobileMd" class="globalheader__nav contain">
          <fs-popper>
            <fs-nav-item-dropdown class="globalheader__item" right>
              <template v-slot:button-content>
                <font-awesome-icon :icon="['fal', 'user-circle']" class="globalheader__icon" />
              </template>

              <fs-dropdown-item :href="getWHQESSProductUrl" class="globalheader__dropdown-item">
                <font-awesome-icon :icon="['fal', 'user']" class="globalheader__icon me-2" />
                Employee Self Service
              </fs-dropdown-item>

              <fs-dropdown-item @click="showHelpCenter = true" class="globalheader__dropdown-item">
                <font-awesome-icon :icon="['fal', 'question-circle']" class="globalheader__icon me-2" />
                Help
              </fs-dropdown-item>

              <fs-dropdown-item @click="showHqSuiteSidebar = true" class="globalheader__dropdown-item">
                <span class="fsi-glyph fs-4 me-1" style="line-height: 18px;">H</span>
                HQ Suite
              </fs-dropdown-item>

              <fs-dropdown-item @click="showNotifications = true" class="globalheader__dropdown-item" link-class="d-flex">
                <div class="position-relative me-2">
                  <font-awesome-icon :icon="['fal', 'bell']" class="globalheader__icon me-2" />
                  <font-awesome-icon v-if="store.hasUnreadNotifications" :icon="['fas', 'circle']"
                    class="globalheader__notification-indicator" />                  
                </div>
                Notifications
              </fs-dropdown-item>


              <fs-dropdown-item @click="onSignOutClick" class="globalheader__dropdown-item">
                  <font-awesome-icon :icon="['fal', 'sign-out']" class="globalheader__icon me-2" />          
                Sign Out
              </fs-dropdown-item>


            </fs-nav-item-dropdown>
          </fs-popper>
        </fs-navbar-nav>

        <fs-navbar-nav v-else class="globalheader__nav contain">
          <fs-popover target="hrm-ess-toggle" placement="bottom" triggers="hover">
            Switch between <b>WorkforceHQ</b> and <b>Employee Self-Service</b>.
          </fs-popover>
          <fs-nav-item link-classes="d-flex align-items-center cursor-pointer-default" id="hrm-ess-toggle">
            VIEW
            <font-awesome-icon :icon="['fas', 'circle-info']" style="font-size: 0.8em;" color="#6E7C8F" class="ms-1" />
          </fs-nav-item>

          <div class="d-flex toggle-button-wrapper me-2">
            <fs-popper hover tooltip content="WorkforceHQ" placement="bottom">
              <div class="toggle-button active">
                <font-awesome-icon :icon="['fal', 'user-tie']" size="lg" color="#FFFFFF" />
              </div>
            </fs-popper>
            <fs-popper hover tooltip content="Employee Self-Service" placement="bottom">
              <a :href="getWHQESSProductUrl" class="toggle-button">
                <font-awesome-icon :icon="['fal', 'user']" size="lg" color="#6E7C8F" />
              </a>
            </fs-popper>
          </div>

          <fs-popper hover tooltip content="Help Center" placement="bottom">
            <fs-nav-item :link-classes="(showHelpCenter ? 'text-workforce-blue' : '') + ' d-flex'"
              @click="showHelpCenter = true">
              <font-awesome-icon :icon="['fal', 'question-circle']" class="globalheader__icon" />
            </fs-nav-item>
          </fs-popper>

          <fs-popper hover tooltip content="HQ Suite Apps" placement="bottom">
            <fs-nav-item :link-classes="(showHqSuiteSidebar ? 'text-workforce-blue' : '') + ' d-flex'"
            @click="showHqSuiteSidebar = true">
            <span class="fsi-glyph fs-4" style="line-height: 18px;">H</span>
            </fs-nav-item>
          </fs-popper>

          <fs-popper hover tooltip content="Notifications" placement="bottom">
            <fs-nav-item @click="showNotifications = true" :link-classes="showNotifications ? 'text-workforce-blue' : ''"
              right>
              <div class="globalheader__icon-container d-flex">
                <font-awesome-icon :icon="['fal', 'bell']" class="globalheader__icon" />
                <font-awesome-icon v-if="store.hasUnreadNotifications" :icon="['fas', 'circle']"
                  class="globalheader__notification-indicator" />
              </div>
            </fs-nav-item>
          </fs-popper>

          <fs-popper >
            <fs-nav-item-dropdown class="globalheader__item" right>
              <template v-slot:button-content>
                <font-awesome-icon :icon="['fal', 'user-circle']" class="globalheader__icon" />
              </template>
              <!-- <fs-dropdown-item class="globalheader__dropdown-item">
                <font-awesome-icon :icon="['fal', 'user-shield']" class="globalheader__icon mr-2" />
                My Account
              </fs-dropdown-item> -->
              <fs-dropdown-item @click="onSignOutClick" class="globalheader__dropdown-item">
                <font-awesome-icon :icon="['fal', 'sign-out']" class="globalheader__icon mr-2" />
                Sign Out
              </fs-dropdown-item>
            </fs-nav-item-dropdown>
          </fs-popper>
        </fs-navbar-nav>

      </fs-container>
    </fs-navbar>

    <help-center v-model:showHelpCenter="showHelpCenter" />
    <notifications v-model:showNotifications="showNotifications" />
    <fs-sidebar 
      v-model="showHqSuiteSidebar"
      sidebar-class="fsi-sidebar help-center" 
      body-class="help-center__body" 
      right 
      backdrop
      backdrop-variant="transparent"
      bg-variant="white" 
      width="425px" 
      shadow="sm"
      header-class="border-bottom bg-grey--000 details_panel_header"
      footer-class="border-top" 
      aria-label="hq suite apps" 
      title="HQ Suite Apps">
      <div class="contain">
        <div class=" my-3 fw-bold">My HQ Suite</div>
          <fs-button variant="outline-light" block class="border text-center mb-3 m-0 py-2"  v-for="product in getUserProducts" :key="product.productGuid" @click="productNewTab(product.productUrl)">
            <div v-if="product.productCode != 'WorkforceHQ'">
              <span v-if="product.productImage === hqSuiteIcon" class="hqsuite-icon">{{
                product.productName
              }}</span>
              <fs-img :src="product.productImage" :height=28 />
            </div>
            <div v-else>
              <span v-if="product.productImage === hqSuiteIcon" class="hqsuite-icon">{{
                product.productName
              }}</span>
              <fs-img :src="product.productImage" :height=28 />
            </div>
          </fs-button>
          <div class=" my-3 fw-bold">Other HQ Suite Apps</div>
          <fs-button variant="outline-light" block class="border text-center mb-3 m-0 py-2" v-for="product in getUserNonProducts" :key="product.productGuid">
            <div @click="productNewTab(product.productUrl)" class="globalheader__dropdown-item">
              <span v-if="product.productImage === hqSuiteIcon" class="hqsuite-icon">{{
                product.productName
              }}</span>
              <fs-img :src="product.productImage" :height=28 />
            </div>
          </fs-button>        
      </div>

      </fs-sidebar>
  </div>
</template>

<script setup lang="ts">
import wfhqLogo from '../../assets/images/hqLogos/WorkforceHQ_Logo.svg';
import wfhqIcon from '../../assets/images/hqLogos/WorkforceHQ_Icon.svg';
import hqSuiteIcon from '../../assets/images/hqLogos/HQ_Suite_Icon.svg';
import { useBreakpoints } from '../../composables/useBreakpoints';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { useProductStore } from '@/stores/productStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTimes,
  faBars,
  faUserCircle,
  faSignOut,
  faTrashAlt,
  faTh,
  faUserShield,
  faUserTie,
  faUser,
  faQuestionCircle,
  faBell,
} from '@fortawesome/pro-light-svg-icons';
import { faCircle, faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import helpCenter from '@/components/viewComponents/home/helpCenter.vue';
import { B2CClient } from '@/models/B2CClient';
import notifications from '@/components/viewComponents/home/notificationsSidebar.vue';
import { useNotificationStore } from "@/stores/notificationStore";
library.add(
  faTimes,
  faBars,
  faUserCircle,
  faSignOut,
  faTrashAlt,
  faTh,
  faUserCircle,
  faUserShield,
  faUserTie,
  faUser,
  faQuestionCircle,
  faBell,
  faCircle,
  faInfoCircle
);

const emit = defineEmits(['toggleInnerSidenav']);

interface GlobalHeaderProps {
  showInnerSidenav: boolean;
  globalSidenavOnly: boolean;
}
const props = withDefaults(defineProps<GlobalHeaderProps>(), {
  showInnerSidenav: false,
  globalSidenavOnly: false,
});

const { responsive } = useBreakpoints();
const azureB2CAuthStore = useAzureB2CAuthStore();
const { getUserProducts, getUserNonProducts, getWHQESSProductUrl } = storeToRefs(useProductStore());
const store = useNotificationStore();

const showHelpCenter = ref(false);
const showNotifications = ref(false);
const showHqSuiteSidebar = ref(false);

async function onClientSelected(client: B2CClient) {
  await azureB2CAuthStore.setActiveUserClient(client.fsiClientId, client.clientGuid);
  window.location.reload();
}

async function onSignOutClick() {
  await azureB2CAuthStore.logoutActiveUser();
}

function productNewTab(url: string): void {
  window.open(url, '_blank');
}

function toggleInnerSidenav(): void {
  emit('toggleInnerSidenav');
}
</script>

<style lang="scss" scoped>
:deep(.cursor-pointer-default) {
  cursor: default;
}

.hqsuite-icon {
  font-weight: 100;
  font-size: 1.2rem;
  margin-right: 5px;
  margin-bottom: 0;
}

.toggle-button-wrapper {
  background: #FFFFFF;
  padding: 4px;
  border-radius: 20px;

  .toggle-button {
    display: block;
    padding: 4px 12px;
    border-radius: 20px;

    svg:hover {
      color: var(--bs-nav-link-hover-color);
    }

    &.active {
      background-color: #FF6600;

      svg:hover {
        color: #FFFFFF;
      }
    }
  }
}

@media (max-width: 1024.98px) {
  .toggle-button-wrapper {
    padding: 2px;

    .toggle-button {
      padding: 2px 10px;
    }
  }
}
</style>
