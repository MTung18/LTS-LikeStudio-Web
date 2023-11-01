<template>
    <fs-overlay :z-index="1002" no-wrap>
      <template #overlay>
        <div class="text-center">
          <img :src="loadingWave" />
        </div>
      </template>
    </fs-overlay>
</template>

<script setup lang="ts">

import loadingWave from '@/assets/images/Loading_Wave.svg'

</script>
