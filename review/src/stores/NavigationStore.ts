import { acceptHMRUpdate, defineStore } from "pinia";
import { InnerSidenav } from "@/models/nav/InnerSidenavItem";

export const useNavigationStore = defineStore({
  id: "navigationStore",
  state: () => ({
    InnerSidenavItem: [],
  }),
  getters: {
    getAllNavigationItems(): InnerSidenav[] {
      const allItems: InnerSidenav[] = [
        {
          page: [
            "employeeInformation",
            "employeeDocumentation",
            "notes",
            "employeeOnboarding",
            "employeeTimeOffPlans",
            "payroll",
            "payrollDetails",
            "payrollAndTaxes",
            "editPersonalInformation",
            "editPayrollInformation",
            "editEmployment",
            "editTaxInformation",
            "manageAccounts",
            "paymentMethod",
            "benefits",
            "createContact",
            "editContact",
          ],
          backTo: { name: "employees" },
          data: [
            {
              id: 11,
              label: "Employee Information",
              icon: ["fal", "user"],
              to: {name: "employeeInformation"},
              uiFieldTag: "WHQ_250_3132",
            },
            {
              id: 12,
              label: "Payroll & Taxes",
              icon: ["fal", "piggy-bank"],
              to: {name: "payrollAndTaxes"},
              uiFieldTag: "WHQ_250_3133",
            },
            {
              id: 13,
              label: "Benefits & Deductions",
              icon: ["fal", "folder-heart"],
              to: { name: "benefits" },
              uiFieldTag: "WHQ_250_3134",
            },
            // *** REVIEWS AND CERTIFICATES TEMPORARILY REMOVED FROM NAVIGATION ***
            // {
            //   id: 14,
            //   label: "Reviews",
            //   icon: ["fal", "star"],
            //   to: {name: "onboarding"},
            //   uiFieldTag: "NOT_GRANULAR",
            // },
            // {
            //   id: 15,
            //   label: "Certificates",
            //   icon: ["fal", "file-certificate"],
            //   to: {name: "employees"},
            //   uiFieldTag: "NOT_GRANULAR",
            // },
            {
              id: 16,
              label: "Documents",
              icon: ["fal", "file-contract"],
              to: {name: "employeeDocumentation"},
              uiFieldTag: "WHQ_250_3135",
            },
            {
              id: 17,
              label: "Time Off",
              icon: ["fal", "calendar-alt"],
              to: {name: "employeeTimeOffPlans"},
              uiFieldTag: "WHQ_250_3136",
            },
            {
              id: 18,
              label: "Notes",
              icon: ["fal", "sticky-note"],
              to: {name: "notes"},
              uiFieldTag: "NOT_GRANULAR",
            },
          ],
        },
        {
          page: ["request","calendar"],
          backTo: null,
          data: [
            {
              id: 20,
              label: "Time Off Requests",
              icon: ["fal", "home"],
              to: {name: "request"},
              uiFieldTag: "WHQ_248_3121",
            },
            {
              id: 21,
              label: "Calendar View",
              icon: ["fal", "home"],
              to: {name: "calendar"},
              uiFieldTag: "WHQ_248_3121",
            },
          ],
        },
        {
          page: ["settingsGeneralSettings", "settingsPayrollAndTaxes", "settingsListCategory",
            "userAndPermissions", "permissionGroupDetails", "permissionGroupForm",
            "settingsFoundation", "settingsFoundationImport", "settingsNotifications", "benefitsDeductions"],
          backTo: {name: "settings"},
          data: [
            {
              id: 26,
              label: "General",
              icon: ["fal", "info-circle"],
              to: {name: "settingsGeneralSettings"},
              uiFieldTag: "WHQ_249_3125",
            },
            {
              id: 27,
              label: "Users & Permissions",
              icon: ["fal", "lock-keyhole"],
              to: {name: "userAndPermissions"},
              uiFieldTag: "WHQ_249_3126",
            },
            {
              id: 28,
              label: "Payroll and Taxes",
              icon: ["fal", "piggy-bank"],
              to: {name: "settingsPayrollAndTaxes"},
              uiFieldTag: "WHQ_249_3127",
            },
            {
              id: 29,
              label: "Benefits & Deductions",
              icon: ["fal", "folder-heart"],
              to: { name: "benefitsDeductions" },
              uiFieldTag: "WHQ_249_3128",
            },
            {
              id: 30,
              label: "Bulletin Board",
              icon: ["fal", "chalkboard"],
              to: {name: "settingsListCategory"},
              uiFieldTag: "WHQ_249_3129",
            },
            {
              id: 31,
              label: "Notifications",
              icon: ["fal", "bell"],
              to: {name: "settingsNotifications"},
              uiFieldTag: "WHQ_249_3157",
            },
            {
              id: 31,
              label: "Foundation Integration",
              icon: ["fal", "exchange"],
              to: {name: "settingsFoundation"},
              uiFieldTag: "WHQ_249_3131",
            },
          ],
        }
      ];

      return allItems;
    },
    getNavigationItemsForPage() {
      return (pageName) =>
        this.getAllNavigationItems.find((arrayData) =>
          Array.isArray(arrayData.page)
            ? arrayData.page.indexOf(pageName) >= 0
            : arrayData.page === pageName
        );
    },
  },
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavigationStore, import.meta.hot));
}
