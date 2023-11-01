<script setup lang="ts">
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
import { ref, Ref } from "vue";

library.add(
  faEyeSlash,
  faEye
)

interface Props {
  modelValue?: boolean;
  text: string;
  mask: string;
}

const props = withDefaults(defineProps<Props>(), {
  data: null,
  text: null,
  modelValue: false,
});
const enum EmitNames {
  TOGGLE = "update:modelValue",
}
const emits = defineEmits<{
  (e: EmitNames.TOGGLE, value: boolean): void;
}>();

const isVisible: Ref<boolean> = ref(props.modelValue);

function onToggleButtonClick() {
  isVisible.value = !isVisible.value;
  emits(EmitNames.TOGGLE, !props.modelValue);
}
</script>
<template>
  <div>
    <span>{{ isVisible ? text : mask }} </span>
    <fs-button
      pill
      variant="outline-green"
      class="px-2 mx-2"
      style="height: 19px; width: 30px"
      @click="onToggleButtonClick"
    >
      <font-awesome-icon
        :icon="['fal', isVisible ? 'eye-slash' : 'eye']"
        size="sm"
      />
    </fs-button>
  </div>
</template>
