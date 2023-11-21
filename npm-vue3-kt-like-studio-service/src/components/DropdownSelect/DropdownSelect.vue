<template>
  <div
    ref="dropdownContainerRef"
    class="select-area"
    :class="[props.classBind, props.disabled && 'disable']"
  >
    <button
      type="button"
      class="select-btn"
      :data-id="dropdownId"
      @click="handleSelectToggle"
    >
      {{ props.defaultSelect }}
      <Icons
        icon-name="chevron_b_bold"
        icon-color="#111"
        v-if="!props.disabled"
      />
      <Icons
        icon-name="chevron_b_bold"
        icon-color="var(--color-gray-777)"
        v-if="props.disabled"
      />
    </button>
    <div ref="selectListWrapRef" class="select-list-wrap">
      <ul ref="selectListRef">
        <li class="select-list-node select">
          <button @click="handleOptionSelect(defaultSelect)" type="button">
            {{ props.defaultSelect }}
          </button>
        </li>
        <li
          class="select-list-node"
          v-for="item in props.selectList"
          :key="item.id"
        >
          <button @click="handleOptionSelect(item.id)" type="button">
            {{ item.listName }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { onMounted, onUnmounted, ref, watch } from 'vue';

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
  defaultSelect: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 54,
  },
  classBind: {
    type: String,
    default: '',
  },
});

const dropdownId = uuid();
const dropdownContainerRef = ref(null);
const selectListWrapRef = ref(null);
const selectListRef = ref(null);
const btnIcon = ref(null);
const selectListHeight = ref(null);
const betweenPadding = 14;
const optionIsOpen = ref(false);

watch(
  () => optionIsOpen.value,
  (newValue) => {
    if (newValue) {
      selectListWrapRef.value.style.height = `${selectListHeight.value}px`;
      btnIcon.value.style.transform = 'rotate(180deg) translateY(50%)';
    } else {
      selectListWrapRef.value.style.height = `0px`;
      btnIcon.value.style.transform = 'translateY(-50%)';
    }
  },
);

const handleSelectToggle = () => {
  optionIsOpen.value = !optionIsOpen.value;
};

const handleOptionSelect = (id) => {
  console.log('id', id);
  handleSelectToggle();
};

const handleDropdownClose = (e) => {
  const { target } = e;
  const targetId = target.getAttribute('data-id');
  if (!target || !targetId || targetId !== dropdownId) {
    optionIsOpen.value = false;
  }
};

onMounted(() => {
  btnIcon.value = dropdownContainerRef.value.querySelector('.icon-wrap');
  selectListHeight.value = selectListRef.value.offsetHeight + betweenPadding;
  document.addEventListener('click', handleDropdownClose);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDropdownClose);
});
</script>

<style scoped>
.select-area {
  position: relative;
  display: inline-block;
  min-width: 58rem;
}

.select-btn {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  padding: 1.1rem 4.8rem 1.1rem 1.2rem;
  border-radius: 0.6rem;
  border: 1px solid var(--color-gray-ddd);
  background: var(--color-neutrals-white-100);
  font-size: var(--fz-m);
  width: 100%;
  height: 4.6rem;
  max-width: 58rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  line-height: 1;
}

.select-area:hover .select-btn {
  border-color: var(--color-primary);
}

.select-btn .icon-wrap {
  position: absolute;
  right: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
}

.select-list-wrap {
  position: absolute;
  min-width: 100%;
  height: 0;
  top: 100%;
  left: 0;
  overflow: hidden;
  padding-top: 1.2rem;
  transition: 0.3s;
  z-index: 10;
  display: inline-block;
}
.drop-width-120 .select-list-wrap {
  width: 120%;
}
.select-list-wrap > ul {
  display: flex;
  flex-flow: column;
  color: var(--color-gray-777);
  border-radius: 0.6rem;
  border: 1px solid var(--color-gray-ddd);
  overflow: hidden;
  background: var(--color-neutrals-white-100);
  font-size: var(--fz-m);
}

.select-list-node.select {
  color: var(--color-neutrals-black);
  background: #f6f6f6;
}

.select-list-node:hover {
  color: var(--color-neutrals-black);
  background: #f6f6f6;
}

.select-list-node button {
  width: 100%;
  padding: 1.2rem 2.4rem;
  text-align: left;
}

:deep(.icon-wrap) {
  pointer-events: none;
}

.select-area.disable {
  color: var(--color-gray-777);
  pointer-events: none;
}

.select-area.disable .select-btn {
  background: #f6f6f6;
}

:deep(.select-wrap.disable .icon-wrap) {
  --icon-color: var(--color-gray-777) !important;
}
</style>
