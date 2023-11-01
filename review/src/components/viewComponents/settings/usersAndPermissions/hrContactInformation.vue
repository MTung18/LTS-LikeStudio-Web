<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { faPenToSquare } from "@fortawesome/pro-light-svg-icons";
import {
  faAsterisk,
  faCircleXmark,
  faCircleExclamation,
} from "@fortawesome/pro-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { storeToRefs } from "pinia";
import { useSetupStore } from "@/stores/setupStore"
import { HrContactInformation } from "@/models/settings/HrContactInformation";
import { whqSetupApi } from "@/axios/instances/whqSetupApi";
import { useAlerts } from "@/composables/useAlerts";
import FsInput from "@/components/global/fsInput/fsInput.vue";

library.add(faPenToSquare, faAsterisk, faCircleXmark, faCircleExclamation);

const { notifySuccess, notifyError } = useAlerts();
const { fetchHrContactInformation } = useSetupStore();
const store = storeToRefs(useSetupStore());

const hrContactInformation = ref<HrContactInformation>(new HrContactInformation());

const hrContactInformationOld = ref<HrContactInformation>(new HrContactInformation());

const isEditMode = ref(false);

const form = ref(null);

const refresh = () => {
  hrContactInformation.value = { ...hrContactInformationOld.value };
  editForm();
}

const saveEditForm = async () => {
  const { errors } = await form.value.validate();
  if (Object.keys(errors).length === 0) {
    const response = await whqSetupApi.saveHrContactInformation(hrContactInformation.value);
    if (response.success) {
      notifySuccess("HR Contact updated.");
      hrContactInformationOld.value = { ...hrContactInformation.value };
      editForm();
    }
    else {
      notifyError(response.errorMessage, null, "Error");
    }
  }
};

const editForm = async () => {
  isEditMode.value = !isEditMode.value;
};

onMounted(async () => {
  await fetchHrContactInformation();
  hrContactInformation.value = store.hrContactInformation.value;
  hrContactInformationOld.value = { ...hrContactInformation.value };
});

</script>
<template>
  <div class="tab-container">
    <div class="form-section">
      <div class="header">
        <fs-container fluid>
          <fs-row align-v="center">
            <fs-col cols="auto">
              <div class="title">HR Contact Information</div>
            </fs-col>
            <fs-col cols="auto" class="action-buttons">
              <fs-button v-if="!isEditMode" variant="outline-primary" @click="editForm" style="gap: 8px">
                <font-awesome-icon icon="fa-light fa-pen-to-square" />
                Edit</fs-button>

              <div v-if="isEditMode" class="button-groups">
                <fs-button @click="refresh" variant="outline-secondary">Cancel</fs-button>
                <fs-button @click="saveEditForm" variant="primary">Save</fs-button>
              </div>
            </fs-col>
          </fs-row>
        </fs-container>
      </div>

      <div v-if="!isEditMode" class="details">
        <div class="detail-group">
          <div class="label">Email</div>
          <span>
            {{ hrContactInformation.hrContactEmail }}
          </span>
        </div>
        <div>
          <div class="label">Phone Number</div>
          <div>
            {{ hrContactInformation.hrContactPhoneNumber }}
          </div>
        </div>
      </div>

      <div v-if="isEditMode" class="form">
        <VeeForm ref="form">
          <fs-row class="align-items-center pt-2">
            <fs-input type="fsTextInput" v-model="hrContactInformation.hrContactEmail" name="Email" label="Email"
              rules="required|email|max:255" maxlength="255" :required="true" />
          </fs-row>
          <fs-row class="align-items-center pt-2">
            <fs-input v-model="hrContactInformation.hrContactPhoneNumber" type="fsTextInput" maskFormat="(###) ###-####"
              name="Phone Number" label="Phone Number" rules="phoneNumber|required" :required="true"></fs-input>
          </fs-row>
        </VeeForm>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tab-container {
  display: flex;
  min-height: calc(100vh - 44px - 70px);
}

.action-buttons {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.form-section {
  flex: 1;

  .header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e1e4e8;
    align-items: center;
    height: 68px;

    .title {
      font-size: 18px;
      font-weight: 700;
      line-height: 21px;
      padding-left: 14px;
    }
  }
}

.details {
  padding: 24px;

  .detail-group {
    margin-bottom: 24px;
  }

  .label {
    font-weight: 700;
    font-size: 14px;
    line-height: 150%;
  }
}

:deep(.form) {
  padding: 24px 33px;
  width: 40%;
  min-width: 300px;

  .form-label {
    display: flex;
    gap: 2px;

    .required-asterisk {
      color: #f5222d;
      font-weight: 700;
      font-size: 14px;
    }
  }

  label {
    font-weight: 700;
    font-size: 14px;
    line-height: 150%;
  }
}

.message-error {
  color: #ff2a2a;
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
}

:deep(.fs-input__form-group, .b-field-inner) {
  padding: 25px 0;
  margin: 0;
}
</style>