<template>
  <div class="section__title-wrap">
    <div class="section__title-inner">
      <slot />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.section__title-wrap {
  display: flex;
  justify-content: center;
}

.section__title-inner {
  position: relative;
}
</style>
