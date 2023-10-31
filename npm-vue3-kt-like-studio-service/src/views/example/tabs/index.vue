<template>
  <div class="article">
    <h2 class="article__title">IconButton</h2>
    <div class="article__group">
      <div class="article__button-item">
        <p class="article__button-desc">block, selected</p>
        <Tabs type="block" :selected="true">선택</Tabs>
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">block, unselected</p>
        <Tabs type="block">미선택</Tabs>
      </div>
    </div>

    <div class="article__group">
      <div class="article__button-item">
        <p class="article__button-desc">underbar, selected</p>
        <Tabs type="underbar" :selected="true">선택</Tabs>
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">underbar, unselected</p>
        <Tabs type="underbar">미선택</Tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import Tabs from '@/components/Tabs/Tabs.vue';
</script>

<style scoped>
.article {
  padding: 4rem;
}

.article__title {
  margin-bottom: 2rem;
  font-size: var(--ttl-l);
}

.article__group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, auto));
  align-items: baseline;
  gap: 2rem;
}

.article__group + .article__group {
  margin-top: 2rem;
}

.article__button-item + .article__button-item {
  margin-top: 2rem;
}

.article__button-desc {
  margin-bottom: 1rem;
  font-size: var(--fz-l);
}
</style>
