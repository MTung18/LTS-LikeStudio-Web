<template>
  <div class="input-radio">
    <label :for="props.id">
      <input
        type="radio"
        :id="props.id"
        :name="props.name"
        :checked="modelValue"
        @change="handleCheckboxChange"
        v-bind="$attrs"
      />
      <span> {{ props.checkList }}</span>
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  checkList: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: '',
  },
  shapeType: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const handleCheckboxChange = (event) => {
  emit('update:modelValue', event.target.checked);
};
</script>

<style scoped>
.input-radio input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
.input-radio input + span {
  font-size: 1.4rem;
  color: #444444;
  padding-left: 2.6rem;
  position: relative;
  line-height: 1.6rem;
}
.input-radio input:checked + span {
  font-size: 1.4rem;
  color: var(--color-neutrals-black);
  font-weight: 500;
}
.input-radio input + span:after {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 0;
  background: #e5e5e5;
  transform: translateY(-50%);
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
}
.input-radio input + span:before {
  content: '';
  display: block;
  width: 0.8rem;
  height: 0.8rem;
  background: var(--color-neutrals-white-100);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 0.4rem;
  z-index: 1;
  transform: translateY(-50%);
}
.input-radio input:checked + span:after {
  background: var(--color-primary);
  border: 0;
}
.input-radio + .input-radio {
}
</style>
