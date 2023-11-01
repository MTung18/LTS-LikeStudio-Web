<template>
    <div class="hq-pg">
        <fs-container fluid class="hq-pg__header hq-pg__header--sticky contain">
            <fs-row align-v="center">
                <fs-col cols="auto">
                    <h2 class="hq-pg__title">General</h2>
                </fs-col>
            </fs-row>
        </fs-container>
        <hrContactInformation></hrContactInformation>
    </div>
</template>
<script lang="ts" setup>
import hrContactInformation from '@/components/viewComponents/settings/usersAndPermissions/hrContactInformation.vue';
</script>
