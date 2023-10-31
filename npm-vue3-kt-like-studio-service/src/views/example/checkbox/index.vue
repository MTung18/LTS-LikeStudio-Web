<template>
  <article class="article">
    <h2 class="article__title">Dropdown Select</h2>
    <div class="article__group">
      <div class="article__inner">
        <CheckBox :check-list="'미선택'" :id="'noChoice'"></CheckBox>
        <CheckBox :check-list="'선택'" :id="'choice'"></CheckBox>
      </div>
      <p class="article__select-desc">check-box</p>
      <div class="article__inner"></div>
      <p class="article__select-desc">large, unselected+completed</p>
    </div>
  </article>
</template>

<script setup>
import CheckBox from '@/components/CheckBox/CheckBox.vue';
</script>

<style scoped>
.article {
  padding: 4rem;
}

.article + .article {
  margin-top: 2rem;
}

.article__group {
  display: flex;
  flex-flow: column;
  border: 1px dashed #9747ff;
  border-radius: 2rem;
  padding: 50px;
  min-height: 800px;
}

.article__title {
  margin-bottom: 2rem;
  font-size: var(--ttl-l);
}

.article__select-desc {
  margin-top: 1.5rem;
  font-size: var(--fz-m);
}
.article__select-desc + .article__inner {
  margin-top: 30px;
}
</style>
