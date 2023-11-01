<script lang="ts" setup>

import { library } from "@fortawesome/fontawesome-svg-core";
import { faBug } from "@fortawesome/pro-solid-svg-icons";
import Error from '@/assets/lottieFiles/Error.json';

library.add(faBug);

</script>

<template>
    <div class="hq-pg">
        <fs-container fluid class="h-100 d-flex flex-column justify-content-center align-items-center">
            <!-- <font-awesome-icon :icon="['fas', 'bug']" size="6x" class="mb-2"/> -->
            <h5 class="fw-bold mb-3">Hmm.. Something went wrong.</h5>
            <LottieAnimation
                :animationData="Error"
                :height="200"
                :loop="false" />
            <div class="text-center text-secondary mb-1">An error has occurred while loading user information for this client.</div>
            <div class="text-center text-secondary">Please try again later or contact support.</div>
        </fs-container>
    </div>
</template>
