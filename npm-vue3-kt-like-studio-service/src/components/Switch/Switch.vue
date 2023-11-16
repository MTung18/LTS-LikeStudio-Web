<template>
  <div class="switch">
    <button
      type="button"
      class="switch-basic"
      :class="isActive ? 'on' : 'off'"
      @click="toggleActive"
    ></button>
    <span class="switch-state">{{ isActive ? 'Y' : 'N' }}</span>
  </div>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue';

const props = defineProps(['toggle']);
const isActive = ref(props.toggle);

function toggleActive() {
  isActive.value = !isActive.value;
}

watch(() => {
  isActive.value = props.toggle;
});
</script>

<style scoped>
.switch {
  display: flex;
  align-items: center;
  gap: 0 1.4rem;
  height: 100%;
}

.switch-basic {
  background: var(--color-gray-ddd);
  width: 3.8rem;
  height: 2rem;
  border-radius: 9.9rem;
  position: relative;
  transition: 0.3s;
}
.switch-basic:after {
  content: '';
  display: block;
  width: 1.6rem;
  height: 1.6rem;
  background: var(--color-neutrals-white-100);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 0.2rem;
  transform: translateY(-50%);
  transition: 0.3s;
}
.switch-basic.on {
  background: var(--color-primary);
}
.switch-basic.on:after {
  left: calc(100% - 1.8rem);
}

.switch-state {
  font-size: var(--fz-m);
}
</style>
