<script setup lang="ts">
import EmptyLayout from "@/components/layouts/emptyLayout.vue";
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import Loading from "@/components/navigation/loadingComponent.vue";

const route = useRoute();
const layout = computed(() => route.meta.layout ?? EmptyLayout);
</script>

<template>
  <Loading ref="loading" />
  <component :is="layout">
    <router-view v-slot="{ Component }">
        <component :is="Component" />
    </router-view>
  </component>
</template>
