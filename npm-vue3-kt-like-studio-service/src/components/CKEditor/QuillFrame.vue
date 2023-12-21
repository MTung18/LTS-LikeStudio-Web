<template>
 <QuillEditor v-model:content="props.content" contentType="html" :options="options"/>
</template>
<script setup>
import { QuillEditor } from '@vueup/vue-quill';

const props = defineProps(['content'])

const options = {
    modules: {
        toolbar: false,
    },
    readOnly: true

};
</script>