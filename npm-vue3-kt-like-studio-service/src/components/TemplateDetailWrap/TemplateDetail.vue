<template>
  <div class="detail-wrap container-1200">
    <div class="detail-wrap__body"><slot name="body" /></div>
    <div class="detail-wrap__foot"><slot name="foot" /></div>
  </div>
</template>

<script setup></script>

<style scoped>
.detail-wrap {
  padding-top: 7.2rem;
  padding-bottom: 12rem;
}

.detail-wrap__foot {
  padding-top: 6rem;
  border-top: 1px solid var(--color-neutrals-black);
}
</style>
