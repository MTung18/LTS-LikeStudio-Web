<script setup lang="ts">
import { ref } from "vue"
import { faArrowUp } from '@fortawesome/pro-light-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(
    faArrowUp,
);

const showButton = ref(false)

window.onscroll = function () {
    let showPoint = document.documentElement.scrollHeight - window.innerHeight - 50
    if (window.scrollY > showPoint) {
        showButton.value = true;
    }
    if (window.scrollY < 100) {
        showButton.value = false;
    }
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
    <div class="scrollToTop" v-show="showButton">
        <div class="d-flex justify-content-end">
            <fs-button variant="primary" @click="scrollToTop">
                <font-awesome-icon :icon="['fal', 'arrow-up']" size="lg"></font-awesome-icon>
            </fs-button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.scrollToTop {
    position: fixed;
    bottom: 20px;
    right: 20px;
}
</style>
