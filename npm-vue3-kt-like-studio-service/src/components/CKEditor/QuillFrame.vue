<template>
    <div class="show-quill">
        <!-- <QuillEditor v-model:content="props.content" contentType="html" :options="options" /> -->
        <div id="content"></div>
    </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import './quill.css'

const props = defineProps(['content'])
const content = ref('');

onMounted(()=>{
    watch(
  () => props.content,
  (newVal) => {
    content.value = newVal;
    document.getElementById('content').innerHTML = content.value;
  },
  {
    immediate: true,
  }
);

});


const options = {
    modules: {
        toolbar: false,
    },
    readOnly: true

};
</script>


