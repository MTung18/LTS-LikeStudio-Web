<template>
  <label
    :for="props.id"
    class="input-check"
    :class="[
      props.classBind,
      props.shapeType === 'square' && 'square',
      props.shapeType === 'round' && 'round',
      props.checkList && 'use-checkList',
    ]"
  >
    <span class="input-check__wrap">
      <input
        type="checkbox"
        :id="props.id"
        :checked="modelValue"
        @change="handleCheckboxChange"
        v-bind="$attrs"
        class="visually--hidden"
      />
      <span class="input-check__inner">
        <span class="input-check__box">
          <Icons
            icon-name="check_bold"
            iconColor="var(--color-neutrals-white-100)"
            :width="1.6"
            :height="1.6"
            v-if="props.shapeType === 'square'"
            class-bind="check_icon icon-square"
          />
          <Icons
            icon-name="check_box_round"
            :width="1.5"
            :height="1.5"
            v-if="props.shapeType === 'round'"
            class-bind="check_icon icon-round"
          />
        </span>
        <span v-if="props.checkList" class="input-check__name">{{
          props.checkList
        }}</span>
      </span>
    </span>
  </label>
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
    default: '',
  },
  classBind: {
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
.input-check {
  display: inline-block;
  line-height: 1;
  cursor: pointer;
}

.input-check__inner {
  display: flex;
  align-items: center;
  gap: 0 1rem;
  font-size: 1.4rem;
}

.round .input-check__box {
  position: relative;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 9999px;
  border: 1px solid var(--color-gray-ddd);
  background-color: var(--color-neutrals-white-100);
}

.square .input-check__box {
  position: relative;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 0.4rem;
  border: 1px solid var(--color-gray-ddd);
  background-color: var(--color-neutrals-white-100);
}

.input-check__box .check_icon {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.square .input-check__box .check_icon {
  top: calc(50% + 0.1rem);
}

input:checked + .input-check__inner .input-check__box {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

input:checked + .input-check__inner .input-check__box .check_icon {
  display: block;
}

.input-check__name {
  font-size: var(--fz-m);
  color: var(--color-gray-444);
}
</style>
