<script setup lang="ts">
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min.js";
import { onMounted, defineEmits, defineProps, ref, watch } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["input"]);
const editor = ref(null);

watch(() => props.content, (newVal) => {
  editor.value.html.set(newVal);
})

onMounted(async () => {
  editor.value = await new FroalaEditor(`#${props.id}`, {
    key: "dKA5cC3A2A2H2F1C6A4D-17d1F1FOOLb2KOPQGe1CWCQVTDWXGcA5A4D4C2E4C2D2E3D1A1==",
    height: 200,
    dragInline: false,
    imagePaste: false,
    toolbarButtons: [
      "paragraphFormat",
      "bold",
      "italic",
      "formatOL",
      "formatUL",
      "outdent",
      "indent",
      "quote",
      "insertLink",
      // "insertImage",
      "insertTable",
    ],


    events: {
      initialized() {
        editor.value.html.set(props.content);
      },
      blur: function () {
        emit("input", editor.value.html.get());
      },
    },
    placeholderText: "Edit here",
  });
});

</script>
<template>
  <div :id="id"></div>
</template>

<style lang="scss"></style>
