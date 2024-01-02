<template>
  <div>
    <jodit-editor v-model="content" ref="myEditor" :config="editorConfig" />
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue';
import 'jodit/build/jodit.min.css'
import { JoditEditor } from 'jodit-vue'

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const myEditor = ref(null);
const content = ref('');

const editorConfig = {
  buttons: 'source,|,bold,italic,underline,strikethrough,eraser,|,align,|,ul,ol,|,font,fontsize,brush,|,paragraph,|,outdent,indent,|,table,|,image,|,undo,redo',
  uploader: {
    filesVariableName: 'file',
    insertImageAsBase64URI: true,
  },
};

watch(
  () => props.modelValue,
  (newVal) => {
    content.value = newVal;
  },
  {
    immediate: true,
  }
);

watch(
  () => content.value,
  (newVal) => {
    emit('update:modelValue', newVal);
  }
);

</script>