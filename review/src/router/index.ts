import { LayoutNames } from "@/plugins/vue/layout/layoutNames";
import { createRouter, createWebHistory } from "vue-router";
import { storeToRefs } from "pinia";
import { usePermissionItemStore } from "@/stores/settings/permissionItemStore";
import { useEmployeeStore } from "@/stores/employeeStore";
import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/home/home.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: false,
        uiFieldTag: "WHQ_248_3117",
      },
    },
    {
      path: '/chooseClient',
      name: 'chooseClient',
      component: () => import('../views/chooseClient/chooseClient.vue'),
      meta: {
        layout: LayoutNames.EMPTY,
        uiFieldTag: "NOT_GRANULAR",
      },
    },    
    {
      path: "/noAccess",
      name: "noAccess",
      component: () => import("../views/home/noAccess.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: false,
        uiFieldTag: "NOT_GRANULAR",
      },
    },
    {
      path: "/error",
      name: "error",
      component: () => import("../views/home/error.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: false,
        uiFieldTag: "NOT_GRANULAR",
      },
    },
    // #region Employees
    {
      path: "/employees",
      name: "employees",
      component: () => import("../views/employees/employees.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3118",
      },
    },
    {
      path: "/employees/createEmployee",
      name: "createEmployee",
      component: () => import("../components/viewComponents/employees/createEmployee.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_247_3114",
      },
    },
    {
      path: "/employees/:id/employeeinformation/:tab?",
      name: "employeeInformation",
      component: () => import("../views/employees/employeeInformation.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_250_3132",
      },
    },
    {
      path: "/employees/:id/editEmployment",
      name: "editEmployment",
      component: () => import("../components/viewComponents/employees/employeeInformation/editEmploymentTab.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_250_3132",
      },
    },
    {
      path: "/employees/:id/createContact",
      name: "createContact",
      component: () => import("@/views/employees/editContactForm.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_251_3146",
      }
    },
    {
      path: "/employees/:id/editContact/:contactId",
      name: "editContact",
      component: () => import("@/views/employees/editContactForm.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_251_3146",
      },
    },
    {
      path: "/employees/:id/payrollAndTaxes/:tab?",
      name: "payrollAndTaxes",
      component: () => import("../views/employees/payrollAndTaxes/payrollAndTaxes.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_250_3133",
      },
    },
    {
      path: "/employees/:id/payrollAndTaxes/paymentMethod",
      name: "paymentMethod",
      component: () => import("../components/viewComponents/employees/payrollAndTaxes/employeePaymentSwitcher.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_250_3133",
      },
    },
    {
      path: "/employees/:id/payrollAndTaxes/editPayrollInformation",
      name: "editPayrollInformation",
      component: () => import("../views/employees/payrollAndTaxes/editPayrollInformation.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_250_3133",
      },
    },
    {
      path: "/employees/:id/payrollAndTaxes/editTaxInformation",
      name: "editTaxInformation",
      component: () => import("../views/employees/payrollAndTaxes/editTaxInformation.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_250_3133",
      },
    },
    {
      path: "/employees/:id/payroll/:checkDate",
      name: "payrollDetails",
      props: true,
      component: () => import("../views/employees/payrollAndTaxes/payrollDetails.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_250_3133",
      },
    },
    {
      path: "/employees/:id/manage-accounts/:directDepositId?/:type?",
      name: "manageAccounts",
      component: () => import("../views/employees/payrollAndTaxes/manageAccounts.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_252_3149",
      },
    },
    {
      path: "/employees/:id/benefits",
      name: "benefits",
      component: () => import("../views/employees/benefits/benefits.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_250_3134",
      },
    },
    {
      path: "/employees/:id/reviews",
      name: "employeeReviews",
      component: () => import("../views/employees/reviews.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_248_3118",
      },
    },
    {
      path: "/employees/:id/certificates",
      name: "employeeCertificates",
      component: () => import("../views/employees/certificates.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_248_3118",
      },
    },
    {
      path: "/employees/:id/employeeDocumentation",
      name: "employeeDocumentation",
      component: () => import("../views/employees/employeeDocumentation.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_250_3135",
      },
    },
    {
      path: "/employees/:id/reports/:guid",
      name: "employeeReportGenerate",
      component: () => import("../views/employees/employeeReportGenerate.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_250_3135",
      },
    },
    {
      path: "/employees/:id/employeeTimeOffPlans",
      name: "employeeTimeOffPlans",
      component: () => import("../views/employees/timeOffPlan/timeOffPlans.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_250_3136",
      },
    },
    {
      path: "/employees/:id/employeeNotes",
      name: "employeeNotes",
      component: () => import("../views/employees/notes.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3118",
      },
      props: { readOnly: true },
    },
    {
      path: "/employees/:id/notes",
      name: "notes",
      component: () => import("../views/employees/notes.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_248_3118",
      },
    },
    {
      path: "/employees/:id/employeeOnboarding",
      name: "employeeOnboarding",
      component: () => import("../views/employees/employeeOnboarding.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        uiFieldTag: "WHQ_248_3118",
      },
    },
    {
      path: "/employees/:id/editPersonalInformation",
      name: "editPersonalInformation",
      component: () => import("../views/employees/editPersonalInformation.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: true,
        uiFieldTag: "WHQ_251_3137",
      },
    },
    // #endregion

    // #region Bulletin Board
    {
      path: "/bulletinBoard",
      name: "bulletinBoard",
      component: () => import("../views/bulletinBoard/bulletinBoard.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3122",
      },
    },
    {
      path: "/bulletinBoard/view/:id",
      name: "viewBulletinDetail",
      component: () => import("../views/bulletinBoard/viewBulletinDetail.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3122",
      },
    },
    {
      path: "/bulletinBoard/add-post",
      name: "addPost",
      component: () => import("../views/bulletinBoard/addOrEditPost.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3122",
      },
    },
    {
      path: "/bulletinBoard/edit-post/:id",
      name: "editPost",
      component: () => import("../views/bulletinBoard/addOrEditPost.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3122",
      },
    },
    {
      path: "/bulletinBoard/edit-draft-post/:id",
      name: "editDraftPost",
      component: () => import("../views/bulletinBoard/addOrEditPost.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3122",
      },
    },
    // #endregion  

    //#region Timeoff
    {
      path: "/timeoff",
      name: "timeoff",
      redirect: { name: "request" },
    },
    {
      path: "/timeoff/request",
      name: "request",
      component: () => import("../views/timeoff/timeoffRequest.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: false,
        uiFieldTag: "WHQ_248_3121",
      },
    },
    {
      path: "/timeoff/calendar",
      name: "calendar",
      component: () => import("../views/timeoff/calendarView.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: false,
        uiFieldTag: "WHQ_248_3121",
      },
    },
    // #endregion

    // #region Onboarding
    {
      path: "/onboarding",
      name: "onboarding",
      component: () => import("../views/onboarding/onboarding.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3119",
      },
    },
    {
      path: "/onboarding/plans",
      name: "onboardingPlans",
      component: () => import("../views/onboarding/onboardingPlans.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3119",
      },
    },
    {
      path: "/onboarding/:id/detail",
      name: "onboardingDetail",
      component: () => import("../views/onboarding/onboardingDetail.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3119",
      },
    },
    {
      path: "/onboarding/:id/detail/subtab",
      name: "onboardingSubTab",
      component: () => import("../views/onboarding/onboardingSubTab.vue"),
      redirect: { name: "onboardingPersonalInformation" },
      children: [
        {
          path: "reviewInfo",
          name: "onboardingReviewInfo",
          component: () => import("../views/onboarding/onboardingSubtabs/onboardingReviewInfo.vue"),
          props: true,
        },
        {
          path: "personal-information",
          name: "onboardingPersonalInformation",
          component: () => import("../views/onboarding/onboardingSubtabs/onboardingPersonalInformation.vue"),
          props: true,
        },
        {
          path: "contacts",
          name: "onboardingContacts",
          component: () => import("../views/onboarding/onboardingSubtabs/onboardingContactList.vue"),
          redirect: { name: "onboardingContactsList" },
          children: [
            {
              path: "list",
              name: "onboardingContactsList",
              component: () => import("../views/onboarding/onboardingSubtabs/onboardingContactForm/onboardingContacts.vue"),
              props: true,
            },
            {
              path: "add",
              name: "onboardingContactAdd",
              component: () => import("../views/onboarding/onboardingSubtabs/onboardingContactForm/addOnboardingContact.vue"),
              props: true,
            },
            {
              path: "update/:contactId",
              name: "onboardingContactUpdate",
              component: () => import("../views/onboarding/onboardingSubtabs/onboardingContactForm/editOnboardingContact.vue"),
              props: true,
            },
          ],
          props: true,
        },
        {
          path: "direct-deposit",
          props: true,
          children: [
            {
              path: "",
              name: "onboardingDirectDeposit",
              component: () => import("../views/onboarding/onboardingSubtabs/onboardingDirectDeposit/directDeposit.vue"),
              props: true,
            },
            {
              path: "account-management",
              name: "onboardingAccountManagement",
              component: () =>
                import(
                  "../views/onboarding/onboardingSubtabs/onboardingDirectDeposit/accountManagement.vue"
                ),
              props: true,
            },
          ]
        },
        {
          path: "onboarding-form-W4",
          name: "onboardingFormW4",
          component: () => import("../views/onboarding/onboardingSubtabs/onboardingTaxWithHoldingInfo.vue"),
          props: true,
          children: [
            {
              path: 'employee-with-holding-certificate',
              name: 'onboardingEmployeeWithHoldingCertificate',
              component: () => import("../views/onboarding/onboardingSubtabs/onboardingTaxWithHoldingInfo/onboardingEmployeeWithHoldingCertificate.vue"),
              props: true,
            },
            {
              path: 'employer-information',
              name: 'onboardingEmployerInformation',
              component: () => import("../views/onboarding/onboardingSubtabs/onboardingTaxWithHoldingInfo/onboardingEmployerInformation.vue"),
              props: true,
            },
          ]
        },
        {
          path: "form-I9",
          name: "onboardingFormI9",
          props: true,
          redirect: { name: "onboardingFormI9Process" },
          component: () => import("../views/onboarding/onboardingSubtabs/onboardingFormI9.vue"),
          children: [
            {
              path: "onboarding-process",
              name: "onboardingFormI9Process",
              component: () => import("../views/onboarding/onboardingSubtabs/onboardingI9Form/onboardingFormI9Process.vue"),
              props: true,
            },
            {
              path: "onboarding-employer",
              name: "onboardingI9Employer",
              component: () => import("../views/onboarding/onboardingSubtabs/onboardingI9Form/onboardingFormI9Employer.vue"),
              props: true,
            },
            {
              path: "onboarding-employee",
              name: "onboardingI9Employee",
              component: () => import("../views/onboarding/onboardingSubtabs/onboardingI9Form/onboardingI9Employee.vue"),
              props: true,
            },
          ]
        },
        {
          path: "EEO-self-identification",
          name: "onboardingEEOSelfIdentification",
          component: () => import("../views/onboarding/onboardingSubtabs/onboardingEEO.vue"),
          props: true,
        },
        {
          path: "vacation",
          name: "onboardingVacation",
          component: () => import("../views/onboarding/onboardingSubtabs/onboardingVacation.vue"),
          props: true,
        },
        {
          path: "VEVRAA-self-identification",
          name: "onboardingVEVRAASelfIdentification",
          component: () => import("../views/onboarding/onboardingSubtabs/onboardingVEVRAASelfIdentification.vue"),
          props: true,
        },
        {
          path: "WOTC",
          name: "onboardingWOTC",
          props: true,
          redirect: { name: "hrOnboardingWOTC" },
          component: () => import("../views/onboarding/onboardingSubtabs/onboardingWOTC.vue"),
          children: [
            {
              path: "",
              name: "hrOnboardingWOTC",
              component: () => import("../views/onboarding/onboardingSubtabs/hrOnboardingWOTC.vue"),
              props: true,
            },
            {
              path: "quickHire",
              name: "onboardingQuickHireWOTC",
              component: () => import("../views/onboarding/onboardingSubtabs/onboardingQuickHireWOTC.vue"),
              props: true,
            },
            {
              path: "8850-ess",
              name: "hrOnboardingWOTC8850Ess",
              component: () => import("../views/onboarding/onboardingSubtabs/hrOnboardingWOTC8850Ess.vue"),
              props: true,
            },
            {
              path: "9061-ess",
              name: "hrOnboardingWOTC9061Ess",
              component: () => import("../views/onboarding/onboardingSubtabs/hrOnboardingWOTC9061Ess.vue"),
              props: true,
            },
            {
              path: "8850-hr",
              name: "hrOnboardingWOTC8850Hr",
              component: () => import("../views/onboarding/onboardingSubtabs/hrOnboardingWOTC8850Hr.vue"),
              props: true,
            },
            {
              path: "9061-hr",
              name: "hrOnboardingWOTC9061Hr",
              component: () => import("../views/onboarding/onboardingSubtabs/hrOnboardingWOTC9061Hr.vue"),
              props: true,
            },
          ]
        },
        {
          path: "tax-with-holding-info-HR",
          name: "onboardingTaxWithHoldingInfoHR",
          component: () => import("../views/onboarding/onboardingSubtabs/onboardingTaxWithHoldingInfoHR.vue"),
          props: true,
        },
        {
          path: "payroll-information",
          name: "onboardingPayrollInformation",
          component: () => import("../views/onboarding/onboardingSubtabs/onboardingPayrollInformation.vue"),
          props: true,
        },
        {
          path: "employment-information",
          name: "onboardingEmploymentInformation",
          component: () => import("../views/onboarding/onboardingSubtabs/employmentInformation.vue"),
          props: true,
        },
      ],
      meta: {
        layout: LayoutNames.DEFAULT,
      },
      props: true,
    },
    // #endregion

    // #region Documents
    {
      path: "/documents",
      name: "documents",
      component: () => import("../views/documents/documents.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3120",
      },
    },
    // #endregion

    // #region Reviews
    {
      path: "/reviews",
      name: "reviews",
      component: () => import("../views/reviews/reviews.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
      },
    },
    // #endregion

    // #region Settings
    {
      path: "/settings",
      name: "settings",
      redirect: "/settings/general-settings",
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: false,
      },
    },
    {
      path: "/settings/general-settings",
      name: "settingsGeneralSettings",
      component: () => import("../views/settings/generalSettings/generalSettings.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        uiFieldTag: "WHQ_249_3125",
        redirectToSameSection: true,
      },
    },
    {
      path: "/settings/foundation",
      name: "settingsFoundation",
      component: () => import("../views/settings/foundationIntegration/foundationIntegration.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        uiFieldTag: "WHQ_249_3131",
      },
    },
    {
      path: "/settings/foundation/import/:importType",
      name: "settingsFoundationImport",
      component: () => import("../views/settings/foundationIntegration/foundationIntegrationImportSync.vue"),
      props: route => ({ importType: route.params.importType, isSync: route.query.isSync }),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        uiFieldTag: "WHQ_249_3131",
      },
    },
    {
      path: "/settings/payroll-taxes",
      name: "settingsPayrollAndTaxes",
      component: () => import("../views/settings/payrollAndTax/index.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        uiFieldTag: "WHQ_249_3127",       
      },
    },
    {
      path: "/settings/list-category",
      name: "settingsListCategory",
      component: () => import("../views/settings/bulletinBoard/index.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        uiFieldTag: "WHQ_249_3129",        
      },
    },
    {
      path: "/settings/userAndPermissions",
      name: "userAndPermissions",
      component: () => import("../views/settings/usersAndPermissions/usersAndPermissions.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: false,
        uiFieldTag: "WHQ_249_3126",
      },
    },
    {
      path: "/settings/userAndPermissions/permissionGroups/:permissionGroupId/details",
      name: "permissionGroupDetails",
      component: () => import("../views/settings/usersAndPermissions/permissionGroupDetails.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: false,
        uiFieldTag: "WHQ_249_3126",
      },
    },
    {
      path: "/settings/userAndPermissions/permissionGroupForm",
      name: "permissionGroupForm",
      component: () => import("../views/settings/usersAndPermissions/permissionGroupForm.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        showInnerBackLink: false,
        uiFieldTag: "WHQ_249_3126",
      },
    },
    {
      path: "/settings/benefits",
      name: "benefitsDeductions",
      component: () => import("../views/settings/benefitsCenter.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        uiFieldTag: "WHQ_249_3128",
      },
    },
    {
      path: "/settings/notifications",
      name: "settingsNotifications",
      component: () => import("../views/settings/notificationSettings/notificationSettings.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        showInnerSidenav: true,
        uiFieldTag: "WHQ_249_3157",
      },
    },
    // #endregion

    // #region Reports
    {
      path: "/reports",
      name: "reports",
      component: () => import("../views/reports/reports.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3123",
      },
    },

    {
      path: "/reports/:guid",
      name: "reportGenerate",
      component: () => import("../views/reports/reportGenerate.vue"),
      meta: {
        layout: LayoutNames.DEFAULT,
        uiFieldTag: "WHQ_248_3124",
      },
    },
    // #endregion
  ],
  linkActiveClass: "link-active",
});

router.beforeResolve(async (to, from, next) => {

  const skipCheck = ['chooseClient','noAccess','error'];
  if (skipCheck.includes(to.name.toString())) {
    next();
    return;
  }

  const { permissions } = storeToRefs(usePermissionItemStore());
  const { fetchEmployeeCurrentLogin } = useEmployeeStore();
  const { employeeCurrentLogin } = storeToRefs(useEmployeeStore());

  await fetchEmployeeCurrentLogin();

  const showErrorPage = !employeeCurrentLogin.value || !permissions.value;

  //If we are unable to get permission items or login info for the current employee we cannot proceed
  if(showErrorPage)
  {
    next('/error');
    return;
  }

  //If the employee is not in Active status, send them to the no-access page
  else if(employeeCurrentLogin.value.employeeStatusId !== EmployeeStatusEnum.Active)
  {
    next('/noAccess');
    return;
  }

  //Process permission groups
  if (to.meta.uiFieldTag) 
  {
    if (permissions.value[to.meta.uiFieldTag as string]) 
    {
      next();
    }
    else 
    {
      const redirectPage = Object.keys(permissions.value).length <= 1 ? { name: "chooseClient" } : { name: "noAccess" };
      if (to.meta.redirectToSameSection)
      {
        redirectToSameSection(to, redirectPage, next, permissions);
      }
      else
      {        
        next(redirectPage);
      }
    }
  }
  else 
  {
    next();
  }
});

function redirectToSameSection(to, from, next, permissions)
{
  const section: string = to.fullPath.split("/")[1];
  const sectionRegex = new RegExp(`\/${section}\/[A-Z-a-z]*$`);

  const routes = router.getRoutes();
  const routeWithAccess = routes.find(r => sectionRegex.test(r.path) && 
    (r.meta.uiFieldTag === undefined || permissions.value[r.meta.uiFieldTag as string]));

  if (routeWithAccess !== undefined)
  {
    next(routeWithAccess);
  }
  else
  {
    next(from);
  }
}

export default router;
