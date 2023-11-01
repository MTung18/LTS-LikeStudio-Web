<script lang="ts" setup>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons';
library.add(faExclamationCircle);

interface Props {
    hasPendingFoundationApproval: boolean,
    isCustomMessage: boolean,
    customMessage: string
}
const props = withDefaults(defineProps<Props>(), {
    hasPendingFoundationApproval: null,
    isCustomMessage: false,
    customMessage: null
});
</script>

<template>
    <div class="banner mt-3" v-if="hasPendingFoundationApproval">
        <span v-if="isCustomMessage">
            <font-awesome-icon class="text-warning me-2" :icon="['fal', 'fa-circle-exclamation']" />
            {{ customMessage }}
        </span>
        <span v-else>
            <font-awesome-icon class="text-warning me-2" :icon="['fal', 'fa-circle-exclamation']" />
            Recent changes are pending approval within Foundation and no further changes can be made until final approval or rejection is processed.
        </span>
    </div>
</template>

<style lang="scss" scoped>
.banner {
    margin: 0 24px 16px 24px;
    padding: 8px;
    background: #fbf4df8a;
    border-radius: 4px;
    display: flex;
    align-items: baseline;
    border: 0.7rem dashed #fac880;
    border-width: initial;
    span {
        width: fit-content;
    }
}
</style>
