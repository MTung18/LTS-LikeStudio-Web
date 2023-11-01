import { IconDefinition, library } from "@fortawesome/fontawesome-svg-core";
import {
  faAsterisk,
  faCheckSquare,
  faTimesCircle,
  faCheck,
  faInfoCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { defineComponent, PropType } from "vue";
import { useFsInput } from "@/composables/useFsInput";

library.add(
  faAsterisk as IconDefinition,
  faTimesCircle as IconDefinition,
  faCheck as IconDefinition,
  faCheckSquare as IconDefinition,
  faInfoCircle as IconDefinition
);

export default defineComponent({
  name: "FsCheckboxInput",
  props: {
    ariaLabel: String,
    ariaLabelledby: String,
    autofocus: Boolean,
    button: Boolean,
    buttonVariant: String,
    checked: String,
    disabled: Boolean,
    errorBag: {
      type: Array as PropType<string[]>,
      default: (): string[] => [],
    },
    form: String,
    id: String,
    indeterminate: Boolean,
    inline: Boolean,
    myChecked: null,
    name: String,
    plain: Boolean,
    required: Boolean,
    size: String,
    state: Boolean,
    switcher: Boolean,
    type: String,
    uncheckedValue: null,
    modelValue: null,
    value: null,
    validationErrors: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["blur", "input", "change", "click", "update:modelValue"],
  setup(props, { emit }) {
    const { onBlur, onInput, onChange, onClick, myValue } = useFsInput(
      emit,
      props
    );

    return {
      myValue,
      onBlur,
      onInput,
      onChange,
      onClick,
    };
  },
});
