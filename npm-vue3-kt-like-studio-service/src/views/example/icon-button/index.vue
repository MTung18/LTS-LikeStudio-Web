<template>
  <div class="article">
    <h2 class="article__title">IconButton</h2>
    <div class="article__group">
      <div class="article__button-item">
        <p class="article__button-desc">outlined, large, enabled</p>
        <IconButton
          component="button"
          type="outlined"
          icon-name="arrow_prev_bold"
          size="large"
        />
      </div>
    </div>

    <div class="article__group">
      <div class="article__button-item">
        <p class="article__button-desc">outlined, medium, enabled</p>
        <IconButton
          component="button"
          type="outlined"
          icon-name="arrow_prev_bold"
          size="medium"
        />
      </div>
    </div>

    <div class="article__group">
      <div class="article__button-item">
        <p class="article__button-desc">outlined, small, enabled</p>
        <IconButton
          component="button"
          type="outlined"
          icon-name="arrow_prev_bold"
          size="small"
        />
      </div>
    </div>

    <div class="article__group">
      <div class="article__button-item">
        <p class="article__button-desc">filed, medium, enabled</p>
        <IconButton
          component="button"
          type="filed"
          icon-name="arrow_prev_bold"
          size="medium"
        />
      </div>
    </div>

    <div class="article__group">
      <div class="article__button-item">
        <p class="article__button-desc">filed, small, enabled</p>
        <IconButton
          component="button"
          type="filed"
          icon-name="arrow_prev_bold"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import IconButton from '@/components/IconButton/IconButton.vue';
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
