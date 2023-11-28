<template>
  <div class="dropdown-select w-full h-20 ">
    <select v-model="selectedValue" @change="handleChange" class="w-full h-20 border-solid border-2 border-black rounded-xl text-2xl cursor-pointer">
      <option :value="null" disabled selected hidden>{{ selected }}</option>
      <option v-for="option in selectList" :key="option.id" :value="option.id" class="text-2xl cursor-pointer">
        {{ option.value }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps(['selectList', 'defaultSelect', 'firstOption','selected']);
const emit = defineEmits();

const selectedValue = ref(null);

const handleChange = (event) => {
  const selectedOption = props.selectList.find(option => option.id === parseInt(event.target.value, 10));
  selectedValue.value = selectedOption.id;
  emit('select', selectedOption);
};

watch(() => props.firstOption, (newVal) => {
  if (newVal !== undefined && newVal !== null) {
    selectedValue.value = newVal;
    const selectedOption = props.selectList.find(option => option.id === newVal);
    if (selectedOption) {
      emit('select', selectedOption);
    }
  } else if (props.defaultSelect) {
    const defaultOption = props.selectList.find(option => option.id === props.defaultSelect);
    if (defaultOption) {
      selectedValue.value = defaultOption.id;
      emit('select', defaultOption);
    }
  }
})
</script>