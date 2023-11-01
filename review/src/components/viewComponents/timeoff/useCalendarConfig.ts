import { CalendarEventType } from "@/enums/timeoff/Calendar";
import { Combo } from "@bryntum/calendar";
import { Ref, ref } from "vue";
import { useCalendarStore } from "@/stores/calendarStore";

const calendarStore = useCalendarStore();

const listOfSupervisor = ref(null);
const listOfEmployee = ref(null);
// Create employee filter
const supervisorResponse = await calendarStore.getListOfSupervisor();
const hiddenTeamFilter = ref(false);
if (supervisorResponse) {
  listOfSupervisor.value = supervisorResponse.map(item => {
    return { value: item.id, text: item.name }
  });
  hiddenTeamFilter.value = false;
}
else {
  hiddenTeamFilter.value = true;
}

const response = await calendarStore.getListOfEmployee();

if (response) {
  listOfEmployee.value = response.map(item => {
    return { value: item.id, text: item.name }
  });
}

// Setup the calendar
const useCalendarConfig = (filterByEmployee: (employeeId: number[]) => void) => {
  const comboCustom: Ref<any> = ref<any>(new Combo({
    items: listOfEmployee.value,
    weight: 10,
    cls: "select-item",
    label: "Choose Employee",
    name: "employee",
    clearable: true,
    multiSelect: true
  }));
  
  const updateEmployeeFilter = async (supervisorId) => {
    const result = await calendarStore.getListOfEmployee(supervisorId);
    if (result) {
      listOfEmployee.value = result.map(item => {
        return { value: item.id, text: item.name }
      });
  
      if (comboCustom.value.value.length > 0) {
        comboCustom.value.value = null;
      }
  
      comboCustom.value.items = listOfEmployee.value;
    }
  }

  const supervisorBaseCombo: Ref<any> = ref<any>(new Combo({
    items: listOfSupervisor.value,
    weight: 10,
    cls: "select-item",
    label: "Choose Team",
    name: "team",
    clearable: true,
    hidden: hiddenTeamFilter.value,
  }));
  const filterWithEmployeeIds = async (hasValue) => {
    if (hasValue) {
      const listOfIntegers: number[] = listOfEmployee.value.map(employee => employee.value);
      await filterByEmployee(listOfIntegers);
    }
    else {
      await filterByEmployee(null);
    }
  }

  comboCustom.value.onChange = async props => {
    if (props.source.value.length > 0) {
      await filterByEmployee([props.source.value]);
    }
    else {
      await filterWithEmployeeIds(supervisorBaseCombo.value.value);
    }
  };

  supervisorBaseCombo.value.onChange = async props => {
    await updateEmployeeFilter(props.source.value);
    await filterWithEmployeeIds(props.source.value);
  }

  return {
    // Current view is current date
    date: new Date(),

    crudManager: {
    },

    // Default mode
    mode: "month",

    // Hide some modes
    modes: {
      day: null,
      year: null,
      agenda: null,
    },

    // Custom left sidebar
    sidebar: {
      cls: 'custom-sidebar',

      items: {
        datePicker: null,
        customText: {
          weight: 0,
          label: 'Filters',
          type: 'displayfield',
          cls: 'custom-sidebar-header',
        },
        employeeFilter: comboCustom.value,
        teamFilter: supervisorBaseCombo.value,
        resourceFilter: {
          store: {
            sorters: [],
          },
        },
        eventFilter: null,
      },
    },

    // Disable tooltip
    eventTooltipFeature: false,

    // Disable drag event
    dragFeature: false,

    // Disable popup menu
    eventMenuFeature: null,

    // Customize edit form
    eventEditFeature: {
      items: {
        resourceField: false,
        resourceFieldRadio: {
          weight: 0,
          label: " ",
          type: "radiogroup",
          name: "resourceId",
          options: {
            [CalendarEventType.Event]: " Event",
            [CalendarEventType.Holiday]: " Holiday",
          },
          onChange: ({ value, source }) => {
            if (value === CalendarEventType.Event) {
              source.parent.title = source.parent.title.replace('Holiday', 'Event');
              source.parent.items[2].value = false;
              source.parent.items[2].style = 'display: inline-flex';
            } else if (value === CalendarEventType.Holiday) {
              source.parent.title = source.parent.title.replace('Event', 'Holiday');
              source.parent.items[2].value = true;
              source.parent.items[2].style = 'display: none';
            }
          }
        },
        startDateField: {
          cls: "calendar-start-date-field",
        },
        startTimeField: {
          cls: "calendar-start-time-field",
        },
        endDateField: {
          cls: "calendar-end-date-field",
        },
        endTimeField: {
          cls: "calendar-end-time-field",
        },
        planType: {
          weight: 850,
          readOnly: true,
          label: "Plan Type",
          type: "text",
          name: "planType",
        },
        note: {
          weight: 900,
          cls: "calendar-request-note-field",
          readOnly: true,
          label: "Note",
          type: "textarea",
          name: "note",
        },
        sendNotification: {
          weight: 950,
          label: "Notify",
          type: "checkbox",
          name: "sendNotification",
          onChange: ({ value, source }) => {
            // Enable/disable notification date depend on send notification checkbox
            if (value) {
              source.parent.items[12].disabled = false;
              source.parent.items[12].required = true;
            } else {
              source.parent.items[12].disabled = true;
              source.parent.items[12].required = false;
            }
          }
        },
        notificationDate: {
          weight: 1000,
          cls: "calendar-notification-date-field",
          label: "Date",
          type: "date",
          name: "notificationDate",
        },
      },

      editorConfig: {
        bbar: {
          items: {
            // Add custom cancel button
            cancelButton: null,
            cancelRequestButton: {
              text: 'Cancel',
            }
          }
        }
      },
    },
  };
};

export {
  useCalendarConfig
}
