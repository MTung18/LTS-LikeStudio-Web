<script setup lang="ts">
import { useAlerts } from "@/composables/useAlerts";
import { MESSAGE } from "@/data/message";
import { focusOnFirstError } from "@/functions/ValidationUtilityFunctions";
import Note from "@/models/employees/Note";
import { useAzureB2CAuthStore } from "@/stores/azureB2CAuthStore";
import { useEmployeeNotesStore } from "@/stores/EmployeeNotesStore";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { Form as VeeForm, FormValidationResult } from 'vee-validate';
import { ref, computed, Ref, ComputedRef } from 'vue';
import { useRoute } from "vue-router";
import _ from "lodash";
library.add(
  faTimes
);

interface Props {
  showCreateNotePanel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCreateNotePanel: false,
});
const route = useRoute();
const { notifySuccess } = useAlerts();
const employeeNotesStore = useEmployeeNotesStore();
const azureB2CAuthStore = useAzureB2CAuthStore();
const emit = defineEmits(['update:showCreateNotePanel', 'noteUpdated']);
const observer = ref();
const formHasValidated = ref(false);
const isSaveButtonDisabled = ref(true);
const newNote: Ref<Note> = ref(new Note());
const employeeId: ComputedRef<string> = computed(() => route.params?.id?.toString());
const defaultDate = ref();
const isSaveEnabled = computed(() => !!(newNote.value.date || newNote.value.title || newNote.value.note));
const resetForm = async () => {
  newNote.value = new Note({ title: '', note: '' });
  setTimeout(async () => {
    await observer.value?.setFieldTouched(false);
    await observer.value?.resetForm();
  }, 25);
}
const localShowSlideNote = computed({
  get() {
    return props.showCreateNotePanel;
  },
  set(value) {
    resetForm();
    emit("update:showCreateNotePanel", value);
  },
});

async function save(isOpen: boolean) {
  try {
    const result: FormValidationResult<any> = await observer.value.validate();
    formHasValidated.value = true;
    if (!result.valid) {
      focusOnFirstError('observer');
      return;
    }
    isSaveButtonDisabled.value = true;
    newNote.value.createdBy = azureB2CAuthStore.activeUserAccount.name;
    await employeeNotesStore.createEmployeeNote(+employeeId.value, _.cloneDeep(newNote.value));
    notifySuccess(MESSAGE.NOTES.SAVE_SUCCESS);
    await resetForm();
    localShowSlideNote.value = isOpen;
    // refresh grid
    emit('noteUpdated');
  }
  catch (error: any) {
    console.debug(error);
  } finally {
    isSaveButtonDisabled.value = false;
  }
}
</script>

<template>
  <fs-sidebar sidebar-class="fsi-sidebar help-center" body-class="help-center__body" right no-close-on-esc
    no-close-on-backdrop bg-variant="white" width="425px" shadow="sm" header-class="border-bottom"
    footer-class="border-top" aria-label="onboarding plan" v-model="localShowSlideNote" title="Add Note">

    <!-- footer -->
    <template #footer="{ hide }">
      <div class="d-flex py-3 contain">
        <fs-button variant="outline-secondary" class="btn btn-outline-gray" @click="hide">Cancel</fs-button>
        <fs-button variant="outline-green" :disabled="!isSaveEnabled" class="ms-auto" @click="save(false)">SAVE &
          DONE</fs-button>
        <fs-button variant="btn-primary" :disabled="!isSaveEnabled" class="btn btn-primary" @click="save(true)">SAVE &
          NEW</fs-button>
      </div>
    </template>
    <div class="d-flex flex-column h-100 w-100 pt-3">
      <fs-container fluid class="contain">
        <VeeForm ref="observer" id="observer" v-slot="{ meta }">
          <fs-input :required="true" type="fsDateInput" label="Date" :rules="{ required: true }" v-model="newNote.date"
            name="Date" :formMeta="{ ...meta, validated: formHasValidated }">
          </fs-input>
          <fs-input :required="true" type="fsTextInput" label="Title" :maxlength="100"
            :rules="{ required: true, max: 100 }" v-model="newNote.title" name="Title"
            :formMeta="{ ...meta, validated: formHasValidated }">
          </fs-input>
          <fs-input :required="true" type="fsTextArea" label="Notes" :maxlength="500"
            :rules="{ required: true, max: 500, }" v-model="newNote.note" name="Notes"
            :formMeta="{ ...meta, validated: formHasValidated }">
          </fs-input>
        </VeeForm>
      </fs-container>
    </div>
  </fs-sidebar>
</template>