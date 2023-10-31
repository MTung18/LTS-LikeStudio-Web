<template>
  <div class="input_check">
    <label :for="props.id">
      <input type="checkbox" :id="props.id" />
      <span>{{ props.checkList }}</span>
      <Icons icon-name="chevron_b_bold" />
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
  id: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.input_check input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
.input_check input + span {
  font-size: 1.4rem;
  color: #444444;
  padding-left: 2.8rem;
  position: relative;
}
.input_check input + span:after {
  content: '';
  display: block;
  width: 1.8rem;
  height: 1.8rem;
  border: 1px solid #dddddd;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0.3rem;
}
.input_check input:checked + span {
  font-size: 1.4rem;
  color: #111111;
}
.input_check input:checked + span:after {
  background: #ed1c24;
  border: 0;
}
</style>
