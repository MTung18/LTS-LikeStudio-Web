<!-- <template>
  <div
    class="select-area"
    :class="[props.classBind, disabled && props.disabled]"
  >
    <button type="button" class="select-btn" @click="selectOpen">
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
    <div class="select-list-wrap">
      <ul>
        <li class="select-list-node select">
          <button type="button">{{ props.defaultSelect }}</button>
        </li>
        <li
          class="select-list-node"
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

function selectOpen(e) {
  if (!e.target.parentNode.classList.contains('disable')) {
    const findParent = e.target.parentNode.querySelector('.select-list-wrap');
    const btnIcon = e.target.querySelector('.icon-wrap');
    const listH =
      findParent.querySelector('.select-list-wrap > ul').clientHeight + 14;

    findParent.style.height = `${listH}px`;
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
.select-area {
  position: relative;
  display: inline-block;
  min-width: 58rem;
  width: 100%;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 0.6rem;
  background: var(--color-neutrals-white-100);
}

.select-area:hover {
  border-color: var(--color-primary);
}

.select-btn {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  padding: 1.1rem 4.8rem 1.1rem 1.2rem;
  font-size: var(--fz-m);
  width: 100%;
  max-width: 58rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
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

.select-list-node {
  padding: 1.2rem 2.4rem;
}

.select-list-node:hover {
  color: var(--color-neutrals-black);
  background: #f6f6f6;
}

.select-list-node button {
  width: 100%;
  text-align: left;
}

:deep(.icon-wrap) {
  pointer-events: none;
}

.select-area.disable {
  color: var(--color-gray-777);
}
.select-area.disable .select-btn {
  background: #f6f6f6;
}
:deep(.select-wrap.disable .icon-wrap) {
  --icon-color: var(--color-gray-777) !important;
}
</style> -->

<template>
  <div class="dropdown-select w-full h-20 ">
    <select v-model="selectedValue" @change="handleChange" class="w-full h-20 border-solid border-2 border-black rounded-xl text-2xl cursor-pointer">
      <option :value="null" disabled selected hidden>전체</option>
      <option v-for="option in selectList" :key="option.id" :value="option.id" class="text-2xl cursor-pointer">
        {{ option.listName }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';

const props = defineProps(['selectList', 'defaultSelect']);
const emit = defineEmits();

const selectedValue = ref(null);

const handleChange = (event) => {
  const selectedOption = props.selectList.find(option => option.id === parseInt(event.target.value, 10));
  selectedValue.value = selectedOption.id;
  emit('select', selectedOption);
};

onMounted(() => {
  // Set the default selected value when the component is mounted
  if (props.defaultSelect) {
    const defaultOption = props.selectList.find(option => option.listName === props.defaultSelect);
    if (defaultOption) {
      selectedValue.value = defaultOption.id;
    }
  }
});
</script>