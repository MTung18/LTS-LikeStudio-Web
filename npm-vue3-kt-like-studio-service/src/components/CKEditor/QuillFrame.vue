<template>
    <div class="show-quill">
        <QuillEditor v-model:content="props.content" contentType="html" :options="options" />
    </div>
</template>
<script setup>
import { QuillEditor } from '@vueup/vue-quill';
import './quill.css'

const props = defineProps(['content'])

const options = {
    modules: {
        toolbar: false,
    },
    readOnly: true

};
</script>