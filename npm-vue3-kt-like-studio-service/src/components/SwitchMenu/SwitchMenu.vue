<template>
  <div class="switch-menu">
    <div class="switch-list" v-for="item in props.switchData" :key="item.id">
      <div class="switch-head">
        <button type="button" class="category" @click="switchMenuOpen">
          {{ item.title }}
          <span
            ><Icons icon-name="chevron_b_bold" :width="1.8" :height="1.8"
          /></span>
        </button>
      </div>
      <div class="switch-body">
        <ul class="check-list">
          <li v-for="checkItem in item.checkList" :key="checkItem">
            <CheckBox
              :check-list="checkItem.cate"
              :id="checkItem.value"
              :shape-type="'square'"
            ></CheckBox>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import CheckBox from '@/components/CheckBox/CheckBox.vue';
import Icons from '@/components/Icons/Icons.vue';

const props = defineProps({
  switchData: {
    type: Array,
    default: () => [],
  },
  checkList: {
    type: Array,
    default: () => [],
  },
});
function switchMenuOpen(e) {
  const openTarget = e.target
    .closest('.switch-list')
    .querySelector('.switch-body');
  const openH = openTarget.querySelector('.check-list').clientHeight;
  if (e.target.classList.contains('is_active')) {
    e.target.classList.remove('is_active');
    openTarget.style.height = `0px`;
  } else {
    e.target.classList.add('is_active');
    openTarget.style.height = `${openH}px`;
  }
}
</script>

<style scoped>
.switch-menu {
  border: 1px solid var(--color-gray-ddd);
  border-radius: 2.4rem;
  padding: 2rem;
  display: inline-block;
  width: 24.7rem;
  max-width: 24.7rem;
}
.switch-head .category {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 1.8rem;
  line-height: 1.4;
  font-weight: bold;
}
.switch-head .category > span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  max-width: 2.4em;
  height: 2.4rem;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 50%;
  position: relative;
  pointer-events: none;
}

.switch-head .category.is_active > span :deep(.icon-wrap) {
  transform: rotate(-180deg);
}
.switch-list + .switch-list {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-gray-ddd);
}
.switch-body {
  height: 0;
  overflow: hidden;
  transition: 0.3s;
}
.check-list {
  padding-top: 1.6rem;
}
.check-list li + li {
  margin-top: 1.1rem;
}
</style>
