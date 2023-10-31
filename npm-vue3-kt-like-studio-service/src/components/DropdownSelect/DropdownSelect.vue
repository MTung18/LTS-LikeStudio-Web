<template>
  <div
    class="select_area"
    :class="{
      disable: props.disabled,
      large: props.size === 'large',
      medium: props.size === 'medium',
    }"
  >
    <button type="button" class="select_btn" @click="selectOpen">
      선택
      <Icons icon-name="chevron_b_bold" />
    </button>
    <div class="select_list_wrap">
      <ul>
        <li class="select_list_node select">
          <button type="button">선택</button>
        </li>
        <li
          class="select_list_node"
          v-for="item in props.selectList"
          :key="item.id"
        >
          <button type="button">{{ item.listName }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import Icons from '@/components/Icons/Icons.vue';

const props = defineProps({
  selectList: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: '',
  },
});

function selectOpen(e) {
  if (!e.target.parentNode.classList.contains('disable')) {
    const findParent = e.target.parentNode.querySelector('.select_list_wrap');
    const btnIcon = e.target.querySelector('.icon-wrap');
    const listH =
      findParent.querySelector('.select_list_wrap > ul').clientHeight + 14;
    findParent.style.height = `${listH}px`;
    console.log(findParent, listH);
    if (findParent.clientHeight <= 15) {
      findParent.style.height = `${listH}px`;
      btnIcon.style.transform = 'rotate(180deg) translateY(50%)';
    } else {
      findParent.style.height = `0px`;
      btnIcon.style.transform = 'translateY(-50%)';
    }
  }
}
</script>

<style scoped>
.select_area {
  max-width: 54rem;
  position: relative;
  border-radius: 0.6rem;
}

.select_btn {
  position: relative;
  display: flex;
  border: 1px solid #dddddd;
  border-radius: 0.6rem;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  font-size: 1.6rem;
  overflow: hidden;
}
.select_area.large .select_btn {
  max-height: 5.4rem;
  padding: 1.6rem 2.4rem;
}
.select_area.medium .select_btn {
  max-height: 4.8rem;
  padding: 1.4rem 1.6rem;
  font-size: 1.4rem;
}

.select_btn .icon-wrap {
  position: absolute;
  right: 2.4rem;
  top: 50%;
  transform: translateY(-50%);
}

.select_list_wrap {
  position: absolute;
  width: 100%;
  height: 0;
  top: 5.4rem;
  left: 0;
  overflow: hidden;
  padding-top: 1.2rem;
  transition: 0.3s;
  z-index: 10;
}

.select_list_wrap > ul {
  display: flex;
  flex-flow: column;
  font-size: 1.6rem;
  color: #777777;
  border-radius: 0.6rem;
  border: 1px solid #dddddd;
  overflow: hidden;
  background: #fff;
}
.medium .select_list_wrap > ul {
  font-size: 1.4rem;
}

.select_list_node.select {
  color: #111111;
  background: #f6f6f6;
}

.select_list_node {
  padding: 1.2rem 2.4rem;
}

.select_list_node:hover {
  color: #111111;
  background: #f6f6f6;
}

::v-deep .icon-wrap {
  pointer-events: none;
}

.select_area.disable {
  background: #f6f6f6;
  color: #777777;
}
::v-deep .select_wrap.disable .icon-wrap {
  --icon-color: #777777 !important;
}
</style>
