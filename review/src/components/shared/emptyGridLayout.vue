<script setup lang="ts">

import { library } from "@fortawesome/fontawesome-svg-core";
import { faRepeat } from "@fortawesome/pro-light-svg-icons";

library.add(faRepeat);

interface Props {
    emptyMessage?: string;
    icon?: string;
    iconClass? : string;
}

const props = withDefaults(defineProps<Props>(), {
    emptyMessage: '',
    icon: 'repeat',
    iconClass: '',
});

</script>

<template>
    <div class="empty-grid" ref="noItemsMessage">
        <div class="empty-grid__backsplash text-center"> 
            <slot v-if="emptyMessage.length > 0">
                <font-awesome-icon :icon="['fal', icon]" size="6x" class="empty-grid__icon" :class="iconClass"></font-awesome-icon>
                <p class="empty-grid__message text-secondary" >
                    <slot name="emptyGridMessage">{{emptyMessage}}</slot>
                </p>
            </slot>
            <slot v-else name="custom"></slot>
        </div>
    </div>
</template>