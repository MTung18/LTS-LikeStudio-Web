<template>
  <div class="article">
    <h2 class="article__title">Button</h2>
    <div class="article__group">
      <div class="article__button-item">
        <p class="article__button-desc">filled, big, standard, enabled</p>
        <Button component="button" color-type="standard" size="big" isIcon>
          버튼명
          <Icons
            icon-name="arrow_next_bold"
            icon-color="var(--color-neutrals-white-100)"
          />
        </Button>
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, large, standard, enabled</p>
        <Button component="button" color-type="standard" size="large"
          >버튼명</Button
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, medium, standard, enabled</p>
        <Button component="button" color-type="standard" size="medium"
          >버튼명</Button
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, small, standard, enabled</p>
        <Button component="button" color-type="standard" size="small"
          >버튼명</Button
        >
      </div>
    </div>

    <div class="article__group">
      <div class="article__button-item">
        <p class="article__button-desc">filled, big, standard, disabled</p>
        <Button
          component="button"
          color-type="standard"
          size="big"
          isIcon
          disabled
        >
          버튼명
          <Icons
            icon-name="arrow_next_bold"
            icon-color="var(--color-neutrals-white-100)"
          />
        </Button>
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, large, standard, disabled</p>
        <Button component="button" color-type="standard" size="large" disabled
          >버튼명</Button
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, medium, standard, disabled</p>
        <Button component="button" color-type="standard" size="medium" disabled
          >버튼명</Button
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, small, standard, disabled</p>
        <Button component="button" color-type="standard" size="small" disabled
          >버튼명</Button
        >
      </div>
    </div>

    <div class="article__group">
      <div class="article__button-item"></div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, large, outlined, enabled</p>
        <Button component="button" color-type="outlined" size="large"
          >버튼명</Button
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, medium, outlined, enabled</p>
        <Button component="button" color-type="outlined" size="medium"
          >버튼명</Button
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, small, outlined, enabled</p>
        <Button component="button" color-type="outlined" size="small"
          >버튼명</Button
        >
      </div>
    </div>

    <div class="article__group">
      <div class="article__button-item"></div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, large, outlined, disabled</p>
        <Button component="button" color-type="outlined" size="large" disabled
          >버튼명</Button
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, medium, outlined, disabled</p>
        <Button component="button" color-type="outlined" size="medium" disabled
          >버튼명</Button
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, small, outlined, disabled</p>
        <Button component="button" color-type="outlined" size="small" disabled
          >버튼명</Button
        >
      </div>
    </div>

    <div class="article__group">
      <div class="article__button-item"></div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, large, primary, enabled</p>
        <Button component="button" color-type="primary" size="large"
          >버튼명</Button
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, medium, primary, enabled</p>
        <Button component="button" color-type="primary" size="medium"
          >버튼명</Button
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, small, primary, enabled</p>
        <Button component="button" color-type="primary" size="small"
          >버튼명</Button
        >
      </div>
    </div>

    <div class="article__group">
      <div class="article__button-item"></div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, large, primary, disabled</p>
        <Button component="button" color-type="primary" size="large" disabled
          >버튼명</Button
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, medium, primary, disabled</p>
        <Button component="button" color-type="primary" size="medium" disabled
          >버튼명</Button
        >
      </div>

      <div class="article__button-item">
        <p class="article__button-desc">filled, small, primary, disabled</p>
        <Button component="button" color-type="primary" size="small" disabled
          >버튼명</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '@/components/Button/Button.vue';
import Icons from '@/components/Icons/Icons.vue';
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
