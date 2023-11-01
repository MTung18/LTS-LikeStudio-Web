<script lang="ts" setup>
import { Event } from '@/models/timeoff/Event';
import { useTimeoffStore } from "@/stores/timeoffStore";
import { BryntumCalendar } from '@bryntum/calendar-vue-3';
import { DateHelper, MessageDialog } from '@bryntum/grid';
import { onMounted, reactive, ref } from 'vue';
import { useCalendarConfig } from './useCalendarConfig';
import {
  CalendarEventType,
  CalendarRecurrenceCombo,
} from '@/enums/timeoff/Calendar';
import { useCalendarStore } from '@/stores/calendarStore';
import { useAlerts } from '@/composables/useAlerts';

const notify = useAlerts();
const filterByEmployee = async (employeeId: number[]) => {
  const response = await calendarsStore.getCalendar(employeeId);
  events.value = response.events.rows;
  resources.value = response.resources.rows;
};

const events = ref(null)
const resources = ref(null)
const calendar = ref(null);
const calendarStore = ref(null);
const calendarConfig = reactive(useCalendarConfig(filterByEmployee));
const timeOffStore = useTimeoffStore();
const openRequestRejectModal = ref(false);
const rejectRequest = ref<{ id: string; eventId: string }>({
  id: null,
  eventId: null,
});
const rejectReason = ref<string>('');
const calendarsStore = useCalendarStore();

const getAllEmployee = async () => {
  const response = await calendarsStore.getCalendar(null);
  events.value = response.events.rows;
  resources.value = response.resources.rows;
}

onMounted(async () => {
  const calendarRef = calendar?.value?.instance?.value;
  calendarStore.value = calendarRef?.eventStore;
  await getAllEmployee();
})

const checkTimeOffRequestOverlap = (checkingEvent: Event): boolean => {
  let startDate = checkingEvent.startDate;
  let endDate = checkingEvent.endDate;

  if (checkingEvent.allDay) {
    startDate = DateHelper.startOf(startDate);

    endDate = DateHelper.add(
      DateHelper.endOf(endDate) as unknown as Date, // This method is defined as void, but it actually returns a Date
      -1,
      'seconds'
    );
  }

  const events = calendarStore.value.toJSON();

  // Check if checking event overlaps with a pending time off request
  for (const event of events) {
    if (event.resourceId !== CalendarEventType.PendingTimeOff) {
      continue;
    }

    if (
      (DateHelper.isAfter(endDate, new Date(event.startDate)) ||
        DateHelper.isEqual(endDate, new Date(event.startDate))) &&
      (DateHelper.isBefore(startDate, new Date(event.endDate)) ||
        DateHelper.isEqual(startDate, new Date(event.endDate)))
    ) {
      return true;
    }
  }

  return false;
};

// Customize Event edit form
const onBeforeEventEditShow = ({ eventRecord, editor }) => {
  const data = eventRecord.data || {};
  const resourceFieldRadio = editor.widgetMap.resourceFieldRadio || {};
  const sendNotificationCheckbox = editor.widgetMap.sendNotification || {};
  const sendNotificationDate = editor.widgetMap.notificationDate || {};

  // Handle click on the Cancel button
  editor.bbar.items[2].onClick = async () => {
    const confirm = await MessageDialog.confirm({
      title: 'Cancel time off request',
      message: `Do you really want to cancel this request? </br> This process cannot be undone.`,
    });

    if (confirm === MessageDialog.okButton) {
      const result = await timeOffStore.cancelRequest(data.eventId);

      if (result.success) {
        if (Array.isArray(result.data)) {
          for (const dateId of result.data) {
            calendarStore.value.getById(`${dateId}-${data.resourceId}`).remove();
          }
        }

        notify.notifySuccess("Request cancelled.");
      }
      else {
        notify.notifyError("Unsuccessful cancel request.");
      }
    }
  }

  // Display time off request detail (read only)
  if (
    data.name !== 'New event' &&
    data.resourceId != CalendarEventType.Event &&
    data.resourceId != CalendarEventType.Holiday
  ) {
    editor.items[0].style = 'display: none';
    editor.items[1].readOnly = true;
    editor.items[2].style = 'display: none';
    editor.items[3].readOnly = true;
    editor.items[4].readOnly = true;
    editor.items[5].readOnly = true;
    editor.items[6].readOnly = true;
    editor.items[7].readOnly = true;
    editor.items[8].style = 'display: none';
    editor.items[9].style = 'display: inline-flex';
    editor.items[9].value = data.planType || '';
    editor.items[10].style = 'display: inline-flex';
    editor.items[10].value = data.note || '';
    editor.items[11].style = 'display: none';
    editor.items[12].style = 'display: none';

    // Enable Cancel button
    editor.bbar.items[2].style = 'display: inline-flex';

    if (data.resourceId == CalendarEventType.ApprovedTimeOff) {
      editor.title = 'Approved Time Off';
      editor.bbar.items[0].style = 'display: none';
      editor.bbar.items[1].style = 'display: none';
    } else {
      editor.title = 'Pending Time Off';
      editor.bbar.items[0].style = 'display: inline-flex';
      editor.bbar.items[0].text = 'Approve';
      editor.bbar.items[0].color = 'b-green';
      editor.bbar.items[1].style = 'display: inline-flex';
      editor.bbar.items[1].text = 'Reject';
      editor.bbar.items[1].color = 'b-red';
    }

    return;
  }

  // Add Event/Holiday
  if (data.name === 'New event') {
    editor.title = 'Add Event';
    resourceFieldRadio.value = CalendarEventType.Event + '';
    sendNotificationCheckbox.value = false;
  }
  // Edit Event/Holiday
  else {
    resourceFieldRadio.value = data.resourceId + '';

    // Show option All Time
    if (data.resourceId === CalendarEventType.Event) {
      editor.title = 'Edit Event';
      editor.items[2].value = data.allDay;
      editor.items[2].style = 'display: inline-flex';
    }
    // Hide option All Time
    else if (data.resourceId === CalendarEventType.Holiday) {
      editor.title = 'Edit Holiday';
      editor.items[2].value = true;
      editor.items[2].style = 'display: none';
    }

    // Update value of checkbox send notification
    sendNotificationCheckbox.value = data.sendNotification;
  }

  editor.items[0].style = 'display: inline-flex';
  editor.items[1].readOnly = false;
  editor.items[3].readOnly = false;
  editor.items[4].readOnly = false;
  editor.items[5].readOnly = false;
  editor.items[6].readOnly = false;
  editor.items[7].readOnly = false;
  editor.items[8].style = 'display: inline-flex';
  editor.items[9].style = 'display: none';
  editor.items[10].style = 'display: none';
  editor.items[11].style = 'display: inline-flex';
  editor.items[12].style = 'display: inline-flex';

  // Show the notification date depending on the send notification checkbox
  if (data.sendNotification) {
    sendNotificationDate.disabled = false;
  } else {
    sendNotificationDate.disabled = true;
  }

  // Save button
  editor.bbar.items[0].style = 'display: inline-flex';
  editor.bbar.items[0].text = 'Save';
  editor.bbar.items[0].color = '';

  // Delete button
  editor.bbar.items[1].cls = 'b-button-cancel'; // Add a class to apply the same style as the Cancel button
  editor.bbar.items[1].style = 'display: inline-flex';
  editor.bbar.items[1].text = 'Delete';
  editor.bbar.items[1].color = '';

  // Hide Cancel button
  editor.bbar.items[2].style = 'display: none';
};

// Handle confirm save button of Event edit form
const onBeforeEventSave = ({ eventRecord, values }) => {
  const { data } = eventRecord;
  // Check Holiday overlap with Pending Timeoff Request
  if (
    values.resourceId === CalendarEventType.Holiday &&
    checkTimeOffRequestOverlap(values)
  ) {
    MessageDialog.alert({
      title: 'Warning',
      message:
        "There's pending time-off request overlapping with this holiday!",
    });
    return false;
  }

  // Check repeat event
  if (
    (values.resourceId === CalendarEventType.Event ||
      values.resourceId === CalendarEventType.Holiday) &&
    (values.recurrenceCombo !== 'none' || data.recurrenceCombo !== 'none')
  ) {
    // Check that the date range does not exceed the repeat interval
    let dateDiff = 0;
    switch (values.recurrenceCombo) {
      case CalendarRecurrenceCombo.Daily:
        dateDiff = DateHelper.diff(values.startDate, values.endDate, 'days');
        break;
      case CalendarRecurrenceCombo.Weekly:
        dateDiff = DateHelper.diff(values.startDate, values.endDate, 'weeks');
        break;
      case CalendarRecurrenceCombo.Monthly: {
        // Check the difference in days instead of months, as the month difference is rounded
        const nextMonth = DateHelper.add(values.startDate, 1, 'months');
        dateDiff = 1 + DateHelper.diff(nextMonth, values.endDate, 'days');
        break;
      }
      case CalendarRecurrenceCombo.Yearly: {
        // Check the difference in days instead of years, as the year difference is not accurate
        const nextYear = DateHelper.add(values.startDate, 1, 'years');
        dateDiff = 1 + DateHelper.diff(nextYear, values.endDate, 'days');
        break;
      }
    }

    if (dateDiff > 1) {
      const recurrenceCombo = values.recurrenceCombo.toLowerCase();
      MessageDialog.alert({
        title: 'Warning',
        message: `Cannot select more than 1 ${recurrenceCombo
          .replace('ily', 'y')
          .replace(
            'ly',
            ''
          )} for event/holiday that repeats ${recurrenceCombo}!`,
      });
      return false;
    }

    // Update event
    if (!data?.id?.toString()?.includes('_generated')) {
      MessageDialog.confirm({
        title: 'Update confirmation',
        message: `Are you sure you want to update this repeating ${data.resourceId === CalendarEventType.Event ? 'event' : 'holiday'
          }?`,
      }).then(async (confirm) => {
        if (confirm === MessageDialog.okButton) {
          let itemId = data.id;

          if (data.id.startsWith('_generated')) {
            itemId = data.id.split(':')[1]; // Repeated events have id with structure: "_generated:[id]:[current_time]"
          }

          await timeOffStore.updateEvent({ ...data, ...values });

          // Update calendar
          const event = calendarStore.value.getById(itemId);
          event.resourceId = values.resourceId;
          event.name = values.name;
          event.allDay = values.allDay;
          event.startDate = values.startDate;
          event.endDate = values.endDate;
          event.recurrenceCombo = values.recurrenceCombo;
          event.recurrenceRule = values.recurrenceRule;
          notify.notifySuccess(data.resourceId === CalendarEventType.Event ? "Event updated." : "Holiday updated.");
        }
      });

      return false;
    }
  }
};

// Handle save button of Event edit form
const onAfterEventSave = async ({ eventRecord }) => {
  const { data } = eventRecord;
  const event = calendarStore.value.getById(eventRecord.id);
  if (data?.id?.toString()?.includes('_generated')) {
    // Add event
    const createdEvent = await timeOffStore.addEvent({ ...data });
    event.id = createdEvent.id;
    event.eventId = createdEvent.eventId;
    notify.notifySuccess(data.resourceId === CalendarEventType.Event ? "Event added." : "Holiday added.");
  } else {
    if (data.resourceId === null) {
      // Approve request
      try {
        const confirm = await MessageDialog.confirm({
          title: 'Approve time off request',
          message: `Are you sure you want to approve this Time Off Request of ${eventRecord.name}`,
        });

        if (confirm === MessageDialog.okButton) {
          const result = await timeOffStore.approveRequest({ id: data.eventId });

          if (result.success) {
            if (Array.isArray(result.data)) {
              for (const dateId of result.data) {
                calendarStore.value.getById(`${dateId}-${CalendarEventType.PendingTimeOff}`).resourceId = CalendarEventType.ApprovedTimeOff;
                calendarStore.value.getById(`${dateId}-${CalendarEventType.PendingTimeOff}`).id = `${dateId}-${CalendarEventType.ApprovedTimeOff}`;
              }
            }
            notify.notifySuccess("Request approved.");
          }
          else {
            notify.notifySuccess("Unsuccessful approve request.");
          }
        } else {
          event.resourceId = CalendarEventType.PendingTimeOff;
        }

      } catch (err) {
        alert('Error when approve request. Please try again later.');
      }
    } else {
      // Update event
      timeOffStore.updateEvent({ ...data });
      notify.notifySuccess(data.resourceId === CalendarEventType.Event ? "Event updated." : "Holiday updated.");
    }
  }
};

// Handle delete button of Event edit form
const onBeforeEventDelete = ({ eventRecords }) => {
  const { data } = eventRecords[0];

  if (
    data.resourceId != CalendarEventType.Event &&
    data.resourceId != CalendarEventType.Holiday
  ) {
    // Open reject time off request modal
    openRequestRejectModal.value = true;
    rejectRequest.value = {
      id: data.id,
      eventId: data.eventId,
    };
    return false;
  } else {
    // Delete event
    MessageDialog.confirm({
      title: 'Delete confirmation',
      message: `Are you sure you want to delete this ${data.resourceId === CalendarEventType.Event ? 'event' : 'holiday'
        }?`,
    }).then(async (confirm) => {
      if (confirm === MessageDialog.okButton) {
        let itemId = data.id;
        if (data.id.startsWith('_generated')) {
          itemId = data.id.split(':')[1]; // Repeated events have id with structure: "_generated:[id]:[current_time]"
        }
        await timeOffStore.deleteEvent({ ...data });

        // Update calendar
        calendarStore.value.getById(itemId).remove();
        notify.notifySuccess(data.resourceId === CalendarEventType.Event ? "Event deleted." : "Holiday deleted.");
      }
    });

    return false;
  }
};

const handleCloseRejectRequestModal = () => {
  rejectReason.value = '';
};

const handleRejectRequest = async () => {
  try {
    const result = await timeOffStore.rejectRequest({
      id: +rejectRequest.value.eventId,
      rejectReason: rejectReason.value,
    });

    // Update calendar
    if (result.success) {
      if (Array.isArray(result.data)) {
        for (const dateId of result.data) {
          calendarStore.value.getById(`${dateId}-${CalendarEventType.PendingTimeOff}`).remove();
        }
      }
      notify.notifySuccess("Request rejected.");
    }
    else {
      notify.notifyError("Unsuccessful reject request.");
    }
  } catch (error) {
    console.log(error);
    alert('Error when reject request. Please try again later.');
  }
};
</script>

<template>
  <div class="calendar h-100 " id="fs-calendar-view" style="display: flex">
    <bryntum-calendar ref="calendar" v-bind="calendarConfig" @beforeEventEditShow="onBeforeEventEditShow"
      @beforeEventSave="onBeforeEventSave" @afterEventSave="onAfterEventSave" @beforeEventDelete="onBeforeEventDelete"
      :events="events" :resources="resources" />
  </div>

  <fs-modal id="reject-request-modal" ref="modal" title="Reject Reason" content-class="content-fsModal"
    body-class="body-fsModal" header-bg-variant="blue" header-text-variant="white" v-model="openRequestRejectModal"
    @hidden="handleCloseRejectRequestModal" @ok="handleRejectRequest">
    <form ref="form" @submit.stop.prevent="handleRejectRequest">
      <textarea class="textarea" v-model="rejectReason" required rows="4"></textarea>
    </form>

    <template #modal-footer="{ ok, cancel }">
      <fs-button-group>
        <fs-button @click="cancel" variant="light" class="m-2 text-uppercase">cancel
        </fs-button>
        <fs-button @click="ok" variant="danger" class="m-2 text-uppercase"
          :disabled="rejectReason == ''">Reject</fs-button>
      </fs-button-group>
    </template>
  </fs-modal>
</template>

<style lang="scss" scoped>
$red: #da5c5c;
$deep-red: #e03f3f;
$orange: #ff884b;
$green: #1abc9c;
$blue: #425afb;
$deep-blue: #193755;
$purple: #7b61ff;
$pink: #ff5094;
$gray: #949494;
$black: #15181c;
$light-blue: #03A9F4;
$white: #FFFFFF;

:deep() {
  .b-chipview.b-chips-closable .b-chip {
    width: -webkit-fill-available;
    margin-left: unset;
    justify-content: space-between;
    text-align: start;
  }

  .b-icon-next,
  .b-icon-previous {
    font-size: 33px;
    color: $light-blue;
  }

  .b-icon-menu-vertical {
    font-size: 33px;
  }

  .b-calendarrow .b-cal-cell-header.b-weekend {
    color: $deep-red;
  }

  .b-minimal.b-cal-color-red .b-cal-event,
  .b-solid-bar.b-cal-color-red .b-cal-event,
  .b-dayview .b-cal-event-wrap.b-cal-color-red .b-cal-event {
    background: $red;
  }

  .b-minimal.b-cal-color-purple .b-cal-event,
  .b-solid-bar.b-cal-color-purple .b-cal-event,
  .b-dayview .b-cal-event-wrap.b-cal-color-purple .b-cal-event {
    background: $purple;
  }

  .b-minimal.b-cal-color-orange .b-cal-event,
  .b-solid-bar.b-cal-color-orange .b-cal-event,
  .b-dayview .b-cal-event-wrap.b-cal-color-orange .b-cal-event {
    background: $orange;
  }

  .b-minimal.b-cal-color-green .b-cal-event,
  .b-solid-bar.b-cal-color-green .b-cal-event,
  .b-dayview .b-cal-event-wrap.b-cal-color-green .b-cal-event {
    background: $green;
  }

  .b-minimal.b-cal-color-pink .b-cal-event,
  .b-solid-bar.b-cal-color-pink .b-cal-event,
  .b-dayview .b-cal-event-wrap.b-cal-color-pink .b-cal-event {
    background: $pink;
  }

  .b-minimal.b-cal-color-blue .b-cal-event,
  .b-solid-bar.b-cal-color-blue .b-cal-event,
  .b-dayview .b-cal-event-wrap.b-cal-color-blue .b-cal-event {
    background: $blue;
  }

  .b-cal-event-bar-container .b-cal-event-wrap.b-solid-bar {
    opacity: 1;
  }

  .b-cal-event-bar-container .b-cal-event-wrap:not(.b-solid-bar).b-cal-color-orange .b-cal-event .b-cal-event-icon {
    color: $orange;
  }

  .b-cal-event-bar-container .b-cal-event-wrap:not(.b-solid-bar).b-cal-color-purple .b-cal-event .b-cal-event-icon {
    color: $purple;
  }

  .b-cal-event-bar-container .b-cal-event-wrap:not(.b-solid-bar).b-cal-color-red .b-cal-event .b-cal-event-icon {
    color: $red;
  }

  .b-cal-event-bar-container .b-cal-event-wrap:not(.b-solid-bar).b-cal-color-green .b-cal-event .b-cal-event-icon {
    color: $green;
  }

  .b-cal-event-bar-container .b-cal-event-wrap:not(.b-solid-bar).b-cal-color-pink .b-cal-event .b-cal-event-icon {
    color: $pink;
  }

  .b-cal-event-bar-container .b-cal-event-wrap:not(.b-solid-bar).b-cal-color-blue .b-cal-event .b-cal-event-icon {
    color: $blue;
  }

  .b-toolbar {
    background: white;
  }

  .b-toolbar.b-dock-top {
    border-bottom: 0;
    margin-bottom: 10px;
  }

  .b-calendar {
    .b-calendar-content {
      border-top: 1px solid rgba(110, 124, 143, 0.31);

      .b-sidebar-left {
        clip-path: inset(0px -200px 0px 0px) !important;

        .b-panel-collapse-size-locker {
          width: 190px !important;
        }
      }
    }

    .b-calendar-viewcontainer .b-monthview .b-panel-body-wrap .b-panel-content {
      padding-top: 0.7em;
    }

    .b-sidebar-content {
      background: white;
      display: flex;
      gap: 8px;
      flex-flow: unset !important;
      flex-wrap: wrap !important;
      padding-top: 0 !important;

      .b-field.select-item {
        width: 100%;
        margin-bottom: 4px;
        flex-wrap: wrap;

        label {
          text-transform: capitalize;
          font-weight: bold;
          margin-left: 0;
          margin-bottom: 5px;
        }
      }

      .b-list {
        margin-top: 6px;
      }

      .b-resourcefilter {
        padding-right: 1rem;
      }
    }

    .b-week-num {
      display: none;
    }
  }

  .b-list-item {
    color: $black;
  }

  .b-monthview .b-calendar-row.b-calendar-weekdays .b-calendar-day-header {
    padding-right: 16px;
    padding-bottom: 8px;
    font-size: 16px;
  }

  .b-calendarrow .b-cal-cell-header .b-day-name-day {
    font-size: 14px;
  }

  .b-calendarrow .b-cal-cell-header .b-day-name-date {
    font-size: 20px;
    line-height: 23px;
  }

  .b-button:not(.b-tab):hover:not(.b-disabled) {
    background: rgba($color: $gray, $alpha: 0.2);
  }

  .b-button:not(.b-tab) {
    border-radius: 5px;
  }

  .b-first-visible-child.b-button:not(.b-tab) {
    border-color: $light-blue;
    background: $white;
    border-radius: 5px 0px 0px 5px;

    label {
      color: $light-blue;
    }

    &.b-pressed {
      background: $light-blue;
      border-color: $light-blue;

      label {
        color: $white;
      }

      &:hover {
        background: $light-blue;
      }
    }
  }

  .b-last-visible-child.b-button:not(.b-tab) {
    border-color: $light-blue;
    background: $white;
    border-radius: 0 5px 5px 0;

    label {
      color: $light-blue;
    }

    &.b-pressed {
      background: $light-blue;
      border-color: $light-blue;

      label {
        color: $white;
      }

      &:hover {
        background: $light-blue;
      }
    }
  }

  .b-daycellcollecter .b-dayview-content {
    border: 1px solid rgba(0, 0, 0, 0.16);
    border-radius: 4px;
  }

  .b-numberfield .b-fieldtrigger,
  .b-textareafield .b-fieldtrigger,
  .b-textfield .b-fieldtrigger {
    color: #5f6368;
  }

  .b-numberfield input,
  .b-numberfield textarea,
  .b-textareafield input,
  .b-textareafield textarea,
  .b-textfield input,
  .b-textfield textarea {
    color: #5f6368;
  }

  .b-cal-event {
    color: #c1c1c1;
  }

  .b-cal-event-wrap.b-intraday:not(.b-solid-bar) .b-cal-event:hover {
    background: linear-gradient(rgba(255, 255, 255, 0.5),
        rgba(255, 255, 255, 0.5)) currentColor;
  }

  .custom-sidebar-header {
    font-size: 16px;
    font-weight: bold;
    margin-top: 0.7em;

    label {
      margin-left: 0;
    }
  }

  .custom-sidebar {
    min-height: calc(100vh - 350px);
  }

  @media screen and (max-width: 768px) {
    .custom-sidebar {
      min-height: calc(100vh - 500px);
    }
  }
}

.calendar {
  padding-top: 15px;
}

.textarea {
  width: 100%;
  padding: 5px;
}
</style>
