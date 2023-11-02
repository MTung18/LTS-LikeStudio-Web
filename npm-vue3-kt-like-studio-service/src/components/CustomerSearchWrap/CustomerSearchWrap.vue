<template>
  <div class="search-wrap">
    <slot />
  </div>
</template>

<script setup></script>

<style scoped>
.search-wrap {
  display: flex;
  gap: 0 1.4rem;
  align-items: center;
  justify-content: end;
  margin-top: 4rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-neutrals-black);
}
</style>
