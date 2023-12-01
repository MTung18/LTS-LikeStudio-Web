<template>
 <div>
  <ckeditor :editor="editor" v-model="props.modelValue" :config="editorConfig" @input="onInput"></ckeditor>
 </div>
</template>

<script setup>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const editor = ClassicEditor;

const props = defineProps({
  modelValue: {
    type: String,
  }
});

const emit = defineEmits(['update:modelValue']);

const onInput = (event) => {
  emit('update:modelValue', event);
};

const editorConfig = {
 contentFilter: {
  elements: {
   script: false,
   iframe: false
  }
 }
};
</script>