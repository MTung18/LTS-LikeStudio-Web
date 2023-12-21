<template>
  <div>
    <QuillEditor v-model:content="content" contentType="html" :options="options" ref="myEditor" />
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import Quill from "quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ImageUploader from "quill-image-uploader";

Quill.register("modules/imageUploader", ImageUploader);

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const myEditor = ref(null);
const content = ref('');

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
      ['image'],
      ['clean'],
    ],

    imageUploader: {
      upload: file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = event => {
            const base64Image = event.target.result;

            const image = new Image();
            image.src = base64Image;

            image.onload = () => {
              const canvas = document.createElement('canvas');
              const maxWidth = 800; 
              const maxHeight = 600; 

              let width = image.width;
              let height = image.height;

              if (width > height) {
                if (width > maxWidth) {
                  height *= maxWidth / width;
                  width = maxWidth;
                }
              } else {
                if (height > maxHeight) {
                  width *= maxHeight / height;
                  height = maxHeight;
                }
              }

              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');
              ctx.drawImage(image, 0, 0, width, height);

              canvas.toBlob(blob => {
                const compressedReader = new FileReader();
                compressedReader.onload = compressedEvent => {
                  const compressedBase64 = compressedEvent.target.result;
                  resolve(compressedBase64);
                };
                compressedReader.readAsDataURL(blob);
              }, file.type);
            };
          };
          reader.readAsDataURL(file);
        });
      }
    },
  },
  placeholder: '...',
  theme: 'snow',
};
</script>