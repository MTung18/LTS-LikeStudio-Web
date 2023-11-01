<script setup lang="ts">
import { useLoadingStore } from "@/stores/loadingStore";
import { storeToRefs } from "pinia";

const { loading } = storeToRefs(useLoadingStore());
const show = loading;
</script>
<template>
    <fs-overlay no-wrap :show="show" z-index="1010" spinner-variant="workforce-blue" />
</template>