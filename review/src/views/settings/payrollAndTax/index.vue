<script setup lang="ts">
import { ref } from "vue";
import Paystub from "./paystub.vue"
import W2FormSettings from "./w2FormSettings.vue"
import PaymentMethod from "./paymentMethod.vue"

const tabIndex = ref(0);

</script>

<template>
  <div class="hq-pg d-flex flex-column">
    <fs-tabs pills
      active-nav-item-class="bg-index-color-2 hq-pg__tab--active"
      v-model="tabIndex"
      nav-wrapper-class="hq-pg__header hq-pg__header--sticky justify-content-center contain px-3"
      content-class="flex-fill">
      <fs-tab title="Pay Stub" active title-link-class="hq-pg__tab">
        <paystub />
      </fs-tab>
      <fs-tab title="W-2" title-item-class="mx-1" title-link-class="hq-pg__tab">
        <W2FormSettings />
      </fs-tab>
      <fs-tab title="Payment Method" title-item-class="mx-1" title-link-class="hq-pg__tab" lazy>
        <PaymentMethod />
      </fs-tab>
    </fs-tabs>
  </div>
</template>

