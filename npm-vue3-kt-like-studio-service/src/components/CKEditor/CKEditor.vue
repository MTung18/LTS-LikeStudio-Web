<template>
    <div class="">
        <QuillEditor v-model:content="content" contentType="html" :options="options" ref="myEditor" />
    </div>
    <div class="text-blue-500 mb-12" @click="log">check content </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
// import ImageUploader from 'quill-image-uploader';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const myEditor = ref(null);
const content = ref('');

function log() {
    console.log('content: ', content.value);
}

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

const options = {
    // debug: 'info',
    modules: {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ color: [] }],
            [{ 'background': [] }],
            ['link', 'image'],
            ['clean'],
        ],
    },

    placeholder: '...',
    theme: 'snow',
};

const CustomButton = document.querySelector('.ql-custom');
CustomButton.innerHTML = 'Custom';
CustomButton.addEventListener('click', function () {
  // Implement the custom action here
  alert('Custom button clicked!');
});
</script>