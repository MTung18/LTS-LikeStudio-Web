<script setup lang="ts">
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faCheck, faCalendarStar, faBullhorn, faUser, faPiggyBank, faFolderHeart, faCalendarXmark, faMoneyCheckDollarPen, faFileLines, faFileCircleCheck, faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed } from "vue";
import { ref, onMounted } from "vue";
import { FormatDate } from "@/utilities/formatUtils";
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/stores/notificationStore";
import EmployeeCurrentLogin from "@/models/employees/EmployeeCurrentLogin";
import { useEmployeeStore } from "@/stores/employeeStore";
import { storeToRefs } from 'pinia';
import caughtupImg from '@/assets/images/Notifications.svg';
import {
  AlertEvent,
  AlertResourceType,
  AlertApplicationId
} from "@/enums/notifications/NotificationEnum";
import Notification from "@/models/notifications/Notification";

library.add(faTimes, faCheck, faCalendarStar, faBullhorn, faUser, faPiggyBank, faFolderHeart, faCalendarXmark, faMoneyCheckDollarPen, faFileLines, faFileCircleCheck, faInfoCircle);

interface NotificationsProps {
  showNotifications?: boolean;
}

const storeNotification = useNotificationStore();
const { fetchEmployeeCurrentLogin } = useEmployeeStore();
const { employeeCurrentLogin } = storeToRefs(useEmployeeStore());
const router = useRouter();
let userLogin = ref({} as EmployeeCurrentLogin);

const getNIcon = (resId: number, EventId: number) => {
  const resIcon = {
    [AlertResourceType.TimeOffRequest]: "calendar-star",
    [AlertResourceType.BulletinBoardMessage]: "bullhorn",
    [AlertResourceType.PersonalInformation]: "user",
    [AlertResourceType.DirectDeposit]: "piggy-bank",
    [AlertResourceType.ConsentHistory]: "file-circle-check",
    [AlertResourceType.Deduction]: "folder-heart",
    [AlertResourceType.Holiday]: "calendar-star",
    [AlertResourceType.Event]: "calendar-star",
    [AlertResourceType.PayStub]: "money-check-dollar-pen",
    [AlertResourceType.W2]: "piggy-bank",
    [AlertResourceType.W4]: "piggy-bank",
    [AlertResourceType.WHQApproval]: "piggy-bank",
  };
  const rejectedIds = [AlertEvent.Canceled, AlertEvent.Rejected, AlertEvent.CancelledToSupervisor]
  if (resId === 14 && rejectedIds.includes(EventId)) {
    return 'calendar-xmark';
  } else if (resIcon.hasOwnProperty(resId)) {
    return resIcon[resId]
  } else {
    return 'user';
  };
}

const getNColor = (resId: number) => {
  const resColor = {
    [AlertResourceType.TimeOffRequest]: "index-color-6",
    [AlertResourceType.BulletinBoardMessage]: "index-color-3",
    [AlertResourceType.PersonalInformation]: "index-color-0",
    [AlertResourceType.DirectDeposit]: "index-color-1",
    [AlertResourceType.ConsentHistory]: "index-color-2",
    [AlertResourceType.Deduction]: "index-color-2",
    [AlertResourceType.Holiday]: "index-color-4",
    [AlertResourceType.Event]: "index-color-2",
    [AlertResourceType.PayStub]: "index-color-0",
    [AlertResourceType.W2]: "index-color-1",
    [AlertResourceType.W4]: "index-color-1",
    [AlertResourceType.WHQApproval]: "foundation-yellow",

  }
  if (resColor.hasOwnProperty(resId)) {
    return resColor[resId]
  } else {
    return 'index-color-0'
  }
}
onMounted(async () => {
  await storeNotification.fetchNotifications();
  await fetchEmployeeCurrentLogin();
  userLogin = employeeCurrentLogin;
});

const props = withDefaults(defineProps<NotificationsProps>(), {
  showNotifications: false,
});

const emit = defineEmits(["update:showNotifications"]);

const localShowNotifications = computed({
  get() {
    return props.showNotifications;
  },
  set(value) {
    emit("update:showNotifications", value);
  },
});

const notificationDetailScreen = {
  [AlertResourceType.TimeOffRequest]: "request",
  [AlertResourceType.BulletinBoardMessage]: "bulletinBoard",
  [AlertResourceType.PersonalInformation]: "employeeInformation",
  [AlertResourceType.DirectDeposit]: "payrollAndTaxes",
  [AlertResourceType.ConsentHistory]: "payrollAndTaxes",
  [AlertResourceType.W4]: "payrollAndTaxes",
  [AlertResourceType.Deduction]: "benefitsDeductions",
};
const formatter = (str) => {
  const regex = /\[(.*?)\]/g;
  const subst = `<span class="fw-normal">$1</span>`;
  return str.replace(regex, subst)
}


const date = FormatDate(new Date());
const daysDiffs = (value: string, compareValue: string) => {
  const valueDate = new Date(value);
  const compareValueDate = new Date(compareValue);
  const difference = compareValueDate.getTime() - valueDate.getTime();
  const daysDiff = Math.floor(difference / (1000 * 60 * 60 * 24) + 1);
  let overdue = daysDiff.toString();
  if (daysDiff > 1) {
    overdue += " days ago";
  } else if (daysDiff === 1) {
    overdue += " day ago";
  } else {
    overdue = "Today";
  }
  return overdue;
};
const message = ref();
const viewNotification = async (data: Notification) => {
  message.value = await storeNotification.readNotification(data.id);
  router.push({
    name: `${notificationDetailScreen[data.alertResourceTypeId]}`,
    params: { id: data.userId },
  });
};

const deleteNoti = async (id: number) => {
  await storeNotification.deleteNotification(id);
  const indexFound = storeNotification.notifications.findIndex((el) => el.id === id);
  if (indexFound > -1) {
    storeNotification.notifications.splice(indexFound, 1);
  }
};

</script>

<template>
  <fs-sidebar sidebar-class="fsi-sidebar" right no-close-on-esc backdrop backdrop-variant="transparent" bg-variant="white"
    width="425px" shadow="sm" header-class="border-bottom bg-grey--000 details_panel_header" footer-class="border-top"
    aria-label="notifications" v-model="localShowNotifications" title="Notifications">
    <fs-list-group class="notificationPanel" flush v-if="storeNotification.notifications.length > 0">
      <fs-list-group-item href="#" v-for="data in storeNotification.notifications" :key="data.id"
        @click="viewNotification(data)">

        <div class="d-flex align-items-center">
          <div style="min-height: 36px; min-width: 36px"
            class="d-flex align-items-center justify-content-center border me-4 p-2 rounded-circle"
            :class="data.state === 0 ? `border-${getNColor(data.alertResourceTypeId)} text-${getNColor(data.alertResourceTypeId)}` : 'border-secondary text-secondary'">
            <font-awesome-icon v-if="data.alertResourceTypeId !== 25"
              :icon="['fal', getNIcon(data.alertResourceTypeId, data.alertEventId)]" size="lg" />
            <span v-else class="fsi-glyph fs-4 " style="line-height: 18px;">F</span>
          </div>


          <div class="me-3">
            <div :class="{ 'fw-bold': data.state === 0 }">
              <span v-html="formatter(data.payload)" />
              <fs-popper placement="bottom" hover class=" ms-2 d-inline-block" v-if="data.alertResourceTypeId === 25">
                <font-awesome-icon :icon="['fal', 'info-circle']" class="text-secondary"></font-awesome-icon>
                <template #content>
                  Changes are ready to be synced into <b>WorkforceHQ</b>. If you feel this change was made in error or
                  have questions, please contact the system administrator.
                </template>
              </fs-popper>
            </div>
            <div class="small text-secondary" v-html="daysDiffs(data.date, date)"></div>
          </div>
          <fs-button @click="deleteNoti(data.id)" class="ms-auto text-secondary" variant="link">
            <font-awesome-icon :icon="['fal', 'times']"></font-awesome-icon>
          </fs-button>

        </div>


      </fs-list-group-item>
    </fs-list-group>
    <div v-else class="h-100 d-flex align-items-center justify-content-center">
      <div class="text-center">
        <h4 class="text-success fw-bold mb-4">You're All Caught Up!</h4>
        <fs-img :src="caughtupImg" alt="Image" height="200" />
      </div>
    </div>
  </fs-sidebar>
</template>

