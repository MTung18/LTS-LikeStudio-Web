<template>
  <article class="article">
    <h2 class="article__title">checkBox</h2>
    <div class="article__group">
      <div class="article__inner">
        <CheckBox
          :check-list="'미선택'"
          :id="'no'"
          :shape-type="'square'"
          :name="'choice'"
        ></CheckBox>
        <CheckBox
          :check-list="'선택'"
          :id="'yes'"
          :shape-type="'square'"
          :name="'choice'"
        ></CheckBox>
      </div>
      <p class="article__select-desc">check-box [suquare]</p>
      <div class="article__inner">
        <CheckBox
          :check-list="'미선택'"
          :id="'no1'"
          :shape-type="'round'"
          :name="'choice1'"
        ></CheckBox>
        <CheckBox
          :check-list="'선택'"
          :id="'yes1'"
          :shape-type="'round'"
          :name="'choice1'"
        ></CheckBox>
      </div>
      <p class="article__select-desc">check-box [round]</p>
    </div>
  </article>
  <article class="article">
    <h2 class="article__title">Radio</h2>
    <div class="article__group">
      <div class="article__inner">
        <Radio
          :check-list="'동의'"
          :id="'agree1'"
          :name="'agree'"
          checked="checked"
        />
        <Radio :check-list="'미동의'" :id="'agree2'" :name="'agree'" />
      </div>
      <p class="article__select-desc">radio</p>
    </div>
  </article>
</template>

<script setup>
import CheckBox from '@/components/CheckBox/CheckBox.vue';
import Radio from '@/components/Radio/Radio.vue';
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
  min-height: 300px;
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
