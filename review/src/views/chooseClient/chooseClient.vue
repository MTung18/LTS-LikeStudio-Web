<template>
  <fs-overlay class="login__overlay">
    <div class="login">
      <fs-container fluid class="login__container">
        <fs-card class="login__card shadow" body-class="login__card-body" header-class="login__card-header"
          footer-class="login__card-footer">
          <template #header>
            <img class="login__logo" :src="wfhqLogo" />
            <h4 class="login__title">Please choose which client to login as:</h4>
          </template>

          <fs-overlay class="login__overlay"
            :show="!azureB2CAuthStore.activeUserClientList || azureB2CAuthStore.setActiveUserClientInProgress || isLoading"
            spinner-variant="secondary">
            <fs-row align-h="center">
              <fs-col md="6" :key="client.clientGuid" v-for="client in azureB2CAuthStore.activeUserClientList"
                class="d-flex p-2">
                <fs-button variant="outline-light" block class="mfs-3 login__client-btn" size="lg"
                  @click="setClientForActiveUser(client)">
                  <font-awesome-icon :icon="['fal', 'city']" class="login__client-icon mr-2" />
                  <span>{{ client.clientName }}</span>
                </fs-button>
              </fs-col>
            </fs-row>
          </fs-overlay>

          <template #footer>
            <div class="p3"></div>
          </template>
        </fs-card>
      </fs-container>
    </div>
  </fs-overlay>
</template>

<script setup lang="ts">
import wfhqLogo from '@/assets/images/hqLogos/WorkforceHQ_Logo.svg'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCity } from '@fortawesome/pro-light-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import router from '@/router';
import { usePermissionItemStore } from "@/stores/settings/permissionItemStore";
import { inject, Ref, ref } from 'vue';
library.add(faCity);

const azureB2CAuthStore = useAzureB2CAuthStore();
const { fetchPermissions } = usePermissionItemStore();
const isLoading = ref(false);
const permissions: Ref<Record<string, boolean>> = inject('$providePermissions');

async function setClientForActiveUser(client: { fsiClientId: number; clientGuid: string; }): Promise<void> {
  isLoading.value = true;

  await azureB2CAuthStore.setActiveUserClient(client.fsiClientId, client.clientGuid);
  await fetchPermissions();

  if (permissions.value["WHQ_248_3117"]) {
    router.push('home');
  }
  else if (permissions.value["WHQ_248_3121"]) {
    //Supervisors have access only to Time Off Requests & Calendar Dashboard
    router.push('timeOff');
  }
  else {
    router.push('noAccess');
  }

  isLoading.value = false;
}
</script>