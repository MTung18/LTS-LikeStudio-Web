<script setup lang="ts">

import { defineProps, inject } from "vue";
const permissions = inject('$providePermissions');

const props = defineProps({
    hasPermission: {
        type: [String, Boolean]
    }
});

</script>

<template>
    <span>
        <slot v-if="typeof props.hasPermission === 'string' ?  permissions[props.hasPermission] : props.hasPermission"/>
    </span>
</template>