<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAlerts } from "@/composables/useAlerts";
import { useNotificationStore } from "@/stores/notificationStore";
import { storeToRefs } from "pinia";
import { NotificationSettingType } from "@/enums/settings/NotificationSettingType";
import { NotificationSetting } from "@/models/settings/NotificationSetting";

const { fetchNotificationSettings, changeNotificationSetting } = useNotificationStore();
const notifyByEmail = ref<NotificationSetting>(new NotificationSetting());
const notifyInWorkforceHQ = ref<NotificationSetting>(new NotificationSetting());
const { notifySuccess, notifyError } = useAlerts();
const { notificationSettings } = storeToRefs(useNotificationStore());

async function toggleNotifyByEmail(): Promise<void>{
    notifyByEmail.value.isSelected = !notifyByEmail.value.isSelected;
    const response = await changeNotificationSetting({ notificationSetting: notifyByEmail.value });
    if (response.success) {
    notifySuccess("Notification Setting Updated.")
  } else {
    notifyError(`${response.errorMessage}`, null, "Error Updating Notification Setting")
  }
}

async function toggleNotifyInWorkforce(): Promise<void>{
    notifyInWorkforceHQ.value.isSelected = !notifyInWorkforceHQ.value.isSelected;
    const response = await changeNotificationSetting({ notificationSetting: notifyInWorkforceHQ.value });
    if (response.success) {
    notifySuccess("Notification Setting Updated");
  } else {
    notifyError(`${response.errorMessage}`, null, "Error Updating Notification Setting")
  }
}

onMounted(async () => {
  await fetchNotificationSettings();
  notifyByEmail.value = notificationSettings.value.find(n => n.notificationSettingTypeId == NotificationSettingType.email);
  notifyInWorkforceHQ.value = notificationSettings.value.find(n => n.notificationSettingTypeId == NotificationSettingType.inWorkforceHQ);
});
</script>

<template>
    <div class="hq-pg">
        <fs-container fluid class="hq-pg__header hq-pg__header--sticky contain">
            <fs-row align-v="center">
                <fs-col cols="auto">
                    <h2 class="hq-pg__title">Notification Settings</h2>
                </fs-col>
            </fs-row>
        </fs-container>
        <fs-container fluid>
            <div class="ellipsis-text mt-2">
                <div class="fw-bold ellipsis-text mt-2 ms-2">Which method(s) would you like to notify employees by?</div>
            </div>
            <fs-row class="mt-2 ms-2">
                <div>
                    <fs-form-checkbox class="mb-2"
                        v-model="notifyByEmail.isSelected"
                        variant="primary" switch
                        @click="toggleNotifyByEmail">Email</fs-form-checkbox>
                </div>                
                <div>
                    <fs-form-checkbox class="mb-2"
                        v-model="notifyInWorkforceHQ.isSelected"
                        variant="primary" switch
                        @click="toggleNotifyInWorkforce">In WorkforceHQ</fs-form-checkbox>
                </div>  
            </fs-row>
        </fs-container>
    </div>
</template>