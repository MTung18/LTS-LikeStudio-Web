<template>
  <div class="article">
    <h2 class="article__title">UIButton</h2>
    <div class="article__group">
      <div class="article__button-item">
        <p class="article__button-desc">filled, medium, enabled</p>
        <RoundButton component="button" color-type="filed" size="medium"
          >버튼명</RoundButton
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">outlined, medium, enabled</p>
        <RoundButton component="button" color-type="outlined" size="medium"
          >버튼명</RoundButton
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, small, enabled</p>
        <RoundButton component="button" color-type="filed" size="small"
          >버튼명</RoundButton
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">lightOutlined, small, enabled</p>
        <RoundButton component="button" color-type="lightOutlined" size="small"
          >버튼명</RoundButton
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">outlined, small, enabled</p>
        <RoundButton
          component="button"
          color-type="outlined"
          size="small"
          isIcon
        >
          <Icons icon-name="download" :width="1.4" :height="1.4" />
          버튼명</RoundButton
        >
      </div>
    </div>

    <div class="article__group">
      <div class="article__button-item">
        <p class="article__button-desc">filled, medium, disabled</p>
        <RoundButton
          component="button"
          color-type="filed"
          size="medium"
          disabled
          >버튼명</RoundButton
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">outlined, medium, disabled</p>
        <RoundButton
          component="button"
          color-type="outlined"
          size="medium"
          disabled
          >버튼명</RoundButton
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, small, disabled</p>
        <RoundButton component="button" color-type="filed" size="small" disabled
          >버튼명</RoundButton
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">lightOutlined, small, disabled</p>
        <RoundButton
          component="button"
          color-type="lightOutlined"
          size="small"
          disabled
        >
          버튼명</RoundButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import Icons from '@/components/Icons/Icons.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
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
