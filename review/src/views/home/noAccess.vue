<script lang="ts" setup>

import { library } from "@fortawesome/fontawesome-svg-core";
import { faLockKeyhole } from "@fortawesome/pro-solid-svg-icons";

library.add(faLockKeyhole);

</script>

<template>
    <div class="hq-pg">
        <fs-container fluid class="h-100 d-flex flex-column justify-content-center align-items-center">
            <font-awesome-icon :icon="['fas', 'lock-keyhole']" size="6x" class="mb-2"/>
            <h3>You don't have permission to view this page</h3>
        </fs-container>
    </div>
</template>
