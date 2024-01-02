<template>
  <div>
    <jodit-editor v-model="content" ref="myEditor" :config="editorConfig" />
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import 'jodit/build/jodit.min.css'
import { JoditEditor } from 'jodit-vue'
import './jodit.css'

const props = defineProps(['content'])
const content = ref('');

const editorConfig = {
  toolbar: false,
  readonly: true,
};

onMounted(() => {
  watch(
    () => props.content,
    (newVal) => {
      content.value = newVal;
    },
    {
      immediate: true,
    }
  );

});
</script>


