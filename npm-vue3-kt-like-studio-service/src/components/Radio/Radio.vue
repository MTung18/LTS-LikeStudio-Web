<template>
  <div
    class="input-radio"
    :class="[props.shapeType === 'round' ? 'round' : 'arrow']"
  >
    <label :for="props.id">
      <input
        type="radio"
        :id="props.id"
        :name="props.name"
        :checked="modelValue"
        @change="handleCheckboxChange"
        v-bind="$attrs"
      />
      <span>
        <Icons
          v-if="props.shapeType === 'arrow'"
          icon-name="check"
          :width="2.4"
          :height="2.4"
          class="input-radio__icon"
        />
        {{ props.checkList }}
      </span>
    </label>
  </div>
</template>

<script setup>
import Icons from '@/components/Icons/Icons.vue';

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
    default: 'round',
    validator(value) {
      return ['round', 'arrow'].includes(value);
    },
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
.input-radio label {
  cursor: pointer;
}

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
  display: inline-block;
  font-size: 1.4rem;
  color: #444444;
  padding-left: 2.6rem;
  position: relative;
  line-height: 1.6rem;
}

.input-radio.arrow input + span {
  padding-left: 3rem;
}

.input-radio input:checked + span {
  font-size: 1.4rem;
  color: var(--color-neutrals-black);
  font-weight: 500;
}
.input-radio.round input + span:after {
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
.input-radio.round input + span:before {
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
.input-radio.round input:checked + span:after {
  background: var(--color-primary);
  border: 0;
}

.input-radio__icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.input-radio.arrow input:checked + span :deep(.input-radio__icon) svg {
  stroke: var(--color-primary);
}

.input-radio.arrow input:checked + span {
  color: var(--color-primary);
}
</style>
