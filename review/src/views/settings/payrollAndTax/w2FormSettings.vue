<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { faPenToSquare } from "@fortawesome/pro-light-svg-icons";
import {
  faAsterisk,
  faCircleXmark,
  faCircleExclamation,
} from "@fortawesome/pro-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useW2FormStore } from "@/stores/w2FormStore";
import { storeToRefs } from "pinia";
import { formatDateInputTime, formatTime } from "@/utilities/formatUtils";
import moment from "moment";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { useAlerts } from "@/composables/useAlerts";
import { filterBlank } from '@/utilities/filterBlankValue';


const notify = useAlerts();

const { responsive } = useBreakpoints();
library.add(faPenToSquare, faAsterisk, faCircleXmark, faCircleExclamation);

const CURRENT_YEAR = new Date().getFullYear();

const getListOfYears = () => {
  const totalYears = 7;
  // 23/02/2023: BA confirmed to render +- 3 years from now.
  const listOfYear = Array(totalYears)
    .fill(CURRENT_YEAR - 3)
    .map((n, i) => n + i);

  return listOfYear
    .map((year) => {
      return {
        text: year,
        value: year,
      };
    })
    .reverse();
};

const { w2FormSetting } = storeToRefs(useW2FormStore());
const { getW2SettingsByYear, updateW2Settings } = useW2FormStore();

const currentSelectedYear = ref(CURRENT_YEAR);
const isEditMode = ref(false);

const availableDate = ref("");
const notificationDate = ref("");

const isDisabledAvailableDate = ref(false);
const isDisabledNotificationDate = ref(false);

const availableDateErrorMsg = ref("");
const notificationDateErrorMsg = ref("");

const isFormSavable = ref(false);

const refreshW2Settings = async (year: number) => {
  availableDateErrorMsg.value = "";
  notificationDateErrorMsg.value = "";
  isFormSavable.value = false;

  await getW2SettingsByYear(year).then(() => {
    availableDate.value = formatDateInputTime(
      w2FormSetting?.value?.availableToEmployeeOn
    );

    notificationDate.value = formatDateInputTime(
      w2FormSetting?.value?.notificationDate
    );

    // Disable input field if available date or notification date is in the past
    if (moment(availableDate.value).isBefore(moment(), 'day')) {
      isDisabledAvailableDate.value = true;
      availableDateErrorMsg.value =
        "The available date has already passed, cannot update available date!";
    } else {
      isDisabledAvailableDate.value = false;
      availableDateErrorMsg.value = "";
    }

    if (moment(notificationDate.value).isBefore(moment(), 'day')) {
      isDisabledNotificationDate.value = true;
      notificationDateErrorMsg.value =
        "The notification date has already passed, cannot update notification date!";
    } else {
      isDisabledNotificationDate.value = false;
      notificationDateErrorMsg.value = "";
    }
  });
};

const handleSaveEditForm = async () => {
  const data = {
    ...w2FormSetting.value,
    notificationDate: notificationDate.value,
    availableToEmployeeOn: availableDate.value,
  }
  try {
    const result = await updateW2Settings(data);
    if (result.success) {
      isEditMode.value = false;
      isFormSavable.value = false;
      await refreshW2Settings(currentSelectedYear.value);
      await getW2SettingsByYear(currentSelectedYear.value);
      notify.notifySuccess(result.errorMessage);
      return;
    }

    notify.notifyError(result.errorMessage);
  } catch (error) {
    notify.notifyError('There is something wrong...')
  }
};

const handleChangeNotificationDate = (event) => {
  const value = event.target.value;
  if (moment(value).isSameOrBefore(moment(), 'day')) {
    notificationDateErrorMsg.value =
      "The notification date has already passed, cannot choose this date!";
    isFormSavable.value = false;
  } else if (!value) {
    notificationDateErrorMsg.value =
      "Notification date cannot be empty!";
    isFormSavable.value = false;
  } else {
    notificationDateErrorMsg.value = "";
    isFormSavable.value = true;
  }
};

const handleChangeAvailableDate = (event) => {
  const value = event.target.value;
  if (moment(value).isSameOrBefore(moment(), 'day')) {
    availableDateErrorMsg.value =
      "The available date has already passed, cannot choose this date!";
    isFormSavable.value = false;
  } else if (!value) {
    availableDateErrorMsg.value =
      "Available to employee date cannot be empty!";
    isFormSavable.value = false;
  } else {
    availableDateErrorMsg.value = "";
    isFormSavable.value = true;
  }
};

const handleEditForm = async () => {
  isEditMode.value = true;
  await refreshW2Settings(currentSelectedYear.value);
};

onMounted(async () => {
  await refreshW2Settings(currentSelectedYear.value);
});

watch(currentSelectedYear, async (newValue) => {
  await refreshW2Settings(newValue);
});
</script>
<template>
  <div class="tab-container">
    <div class="form-section">
      <div class="header">
        <fs-container fluid>
          <fs-row align-v="center" class="py-3">
            <fs-col :cols="isEditMode && responsive.breakpoint === 'sm' ? 12 : 'auto'">
              <div class="title"
                :class="isEditMode && responsive.breakpoint === 'sm' || responsive.breakpoint === 'sm' ? 'pb-3' : 'ps-3'">
                {{
                  currentSelectedYear }} W-2
                Settings</div>
            </fs-col>
            <fs-col cols="auto">
              <fs-form-select v-if="!isEditMode" class="form-select" v-model="currentSelectedYear"
                :options="getListOfYears()"></fs-form-select>
            </fs-col>
            <fs-col :cols="responsive.breakpoint === 'sm' && 'auto'" class="d-flex justify-content-end">
              <fs-button v-if="!isEditMode &&
                !(isDisabledAvailableDate && isDisabledNotificationDate)
                " variant="outline-primary" @click="handleEditForm" style="gap: 8px">
                <font-awesome-icon icon="fa-light fa-pen-to-square" />
                <div v-if="responsive.breakpoint !== 'sm'">Edit</div>
              </fs-button>
            </fs-col>
            <fs-col :cols="responsive.breakpoint === 'sm' ? 12 : 'auto'">

              <div v-if="isEditMode" class="w-100 px-4"
                :class="responsive.breakpoint === 'sm' ? 'd-flex justify-content-between border-top pt-3' : 'justify-content-end'">
                <fs-button @click="isEditMode = false" variant="outline-secondary">Cancel</fs-button>
                <fs-button @click="handleSaveEditForm" variant="primary" :disabled="!isFormSavable">Save</fs-button>
              </div>
            </fs-col>
          </fs-row>
        </fs-container>
      </div>

      <fs-alert v-if="isDisabledAvailableDate && isDisabledNotificationDate" variant="danger" show class="mx-2 mt-2 mb-0">
        <font-awesome-icon icon="fa-solid fa-circle-exclamation" />
        Available Date and Notification Date have already passed. Cannot update these settings.
      </fs-alert>
      <div v-if="!isEditMode" class="details">
        <div class="detail-group">
          <div class="label">Available To Employee On</div>
          <div>
            {{
              filterBlank(moment(moment.utc(w2FormSetting?.availableToEmployeeOn).toDate()).local().format('MM/DD/YYYY'))
            }}
          </div>
        </div>

        <div>
          <div class="label">Notification Date</div>
          <span>
            {{ filterBlank(moment(moment.utc(w2FormSetting?.notificationDate).toDate()).local().format('MM/DD/YYYY')) }}
          </span>
        </div>
      </div>

      <div v-if="isEditMode" class="form">
        <fs-form>
          <fs-input label="Available To Employee On" rules="required" :required="true" type="fsDateInput"
            v-model="availableDate" :disabled="isDisabledAvailableDate"
            @Change="(event) => handleChangeAvailableDate(event)">
          </fs-input>
          <p v-if="isDisabledAvailableDate || availableDateErrorMsg" class="error-message">
            {{ availableDateErrorMsg }}
          </p>
          <fs-input label="Notification Date" rules="required" :required="true" type="fsDateInput"
            v-model="notificationDate" :disabled="isDisabledNotificationDate"
            @Change="(event) => handleChangeNotificationDate(event)">
          </fs-input>
          <p v-if="isDisabledNotificationDate || notificationDateErrorMsg" class="error-message">
            {{ notificationDateErrorMsg }}
          </p>
        </fs-form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tab-container {
  display: flex;
  min-height: calc(100vh - 44px - 70px);
}

.year-container {
  display: flex;
}

.action-buttons {
  flex: 1;
  display: flex;
  // justify-content: flex-end;
}

.form-section {
  flex: 1;

  .header {
    display: flex;
    justify-content: space-between;
    // padding: 24px;
    border-bottom: 1px solid #e1e4e8;
    align-items: center;
    // height: 68px;

    .title {
      font-size: 18px;
      font-weight: 700;
      line-height: 21px;
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
  padding: 24px;
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

.error-message {
  color: #ff2a2a;
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
}

:deep(.fs-input__form-group) {
  padding-top: 25px;
  margin-bottom: 0;
}
</style>
