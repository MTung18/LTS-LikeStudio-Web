import { ref, onMounted } from 'vue';
import { ReportCriteria } from '@/models/ReportCriteria';
import { ReportCriteriaParameters } from '@/models/ReportCriteriaParameters';
import { storeToRefs } from "pinia";
import { useReportCriteriaStore } from "@/stores/ReportCriteriaStore";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { useAlerts } from '@/composables/useAlerts';


export function useReport() {
  const criteria = ref<ReportCriteriaParameters[]>([]);
  const reportName = ref('');
  const reportGuid = ref('');
  const hasCriteria = ref(false);
  const hasDropdownCriteria = ref(false);
  const isPhaseActive = ref(false);
  const hasFoundationIntegration = ref(false);
  const hasQuickBooksIntegration = ref(false);
  const hasFoundationData = ref(false);
  const userHasCriteriaDefaults = ref(false);
  const uIFunction = ref(null);
  const dataIsModified = ref(false);
  const customTemplatePageHeight = ref('100vh');
  const isLoading = ref(false);
  const report_template = ref('') as any;
  const splitApiPath = ref('');
  const criteria_dropdownLists = ref({});
  const criteriaDoneLoading = ref(false);
  const showCriteriaScreen = ref(true);
  const viewer = ref(null);
  const stimulsoftApiUrl = ref(getLocalAppsettings().ClientSide.StimulsoftApiUrl);
  const workforceHQApi = ref(getLocalAppsettings().ClientSide.WorkforceManagement);
  const options = ref(null);
  const formHasValidated = ref(false);
  const form = ref(null);
  const { notifyError } = useAlerts();


  const { fetchReportCriteriaStore } = useReportCriteriaStore();
  const { reportsStore } = storeToRefs(useReportCriteriaStore());

  const azureB2CAuthStore = useAzureB2CAuthStore();

  onMounted(async () => {
    if (!window.hasOwnProperty('Stimulsoft')) {
      const stiScript: HTMLScriptElement = document.createElement('script');
      stiScript.setAttribute('src', stimulsoftApiUrl.value);
      stiScript.setAttribute('type', 'text/javascript');
      document.body.appendChild(stiScript);
    }
    await startStimulsoftLibraryStatus();
  });
  
  const postpageloadactions = () => {
    // called after loading report template, before page finishes loading
    // implement on report-specific component
  };

  const loadSavedDefaultCriteria = () => {
    // implement on report-specific component
  };

  const setCriteriaToSystemDefaults = () => {
    // implement on report-specific component
  };

  const setCriteria = (criteriaName: string, value: ReportCriteria | ReportCriteria[]): void => {
    if (!Array.isArray(value)) {
      value = [value];
    }
    for (const singleCriteria of criteria.value) {
      if (singleCriteria.name === criteriaName) {
        singleCriteria.value = value;
        return;
      }
    }
    criteria.value.push({ name: criteriaName, value });
  };

  const unsetCriteria = (criteriaName: string): void => {
    const index = criteria.value.findIndex((criteria: ReportCriteriaParameters) => criteria.name === criteriaName);
    if (index !== -1) {
      criteria.value.splice(index, 1);
    }
  };

  const setDateCriteria = (criteriaName: string, value: Date | string): void => {
    const dateCriteria: ReportCriteria = new ReportCriteria();
    dateCriteria.name = value as string;
    setCriteria(criteriaName, dateCriteria);
  };

  const setBooleanCriteria = (criteriaName: string, value: boolean | string): void => {
    const booleanCriteria: ReportCriteria = new ReportCriteria();
    booleanCriteria.name = value as string;
    setCriteria(criteriaName, booleanCriteria);
  };

  const setStringCriteria = (criteriaName: string, value: string): void => {
    const stringCriteria: ReportCriteria = new ReportCriteria();
    stringCriteria.name = value as string;
    setCriteria(criteriaName, stringCriteria);
  };

  const runReport = async (): Promise<void> => {
    formHasValidated.value = true;
    const { errors } = await form.value.validate();
    if (Object.keys(errors).length === 0) {
        await generateReport();
    } else {
      notifyError("Error with report criteria.");
    }
  };

  const generateCriteria = async (): Promise<void> => {
    // called after clicking to show report, before loading the report
    // implement on report-specific component
  };

  const getDropdownList = (criteriaName: string): ReportCriteria[] => {
    return criteria_dropdownLists.value[criteriaName] || [];
  };

  const getCriteriaDefault = (reportCriteriaList: ReportCriteria[]): ReportCriteria => {
    return reportCriteriaList.find((criteria: ReportCriteria) => criteria.default);
  };

  const allGroupDescription = (criteriaDescription: string): string => {
    //return `All ${pluralize(criteriaDescription)}`;
    return `All ${criteriaDescription}`;
  };

  const dataModified = (): void => {
    dataIsModified.value = true;
  };
  // Run Report is clicked: load the report
  const generateReport = async (): Promise<void> => {
    //criteria.value = [];
    //await generateCriteria();
    await loadReport();
  };

  const backToReportList = (): void => {
    // Replace with your router implementation
    // this.$router.push({ name: 'reports' });
  };

  const startStimulsoftLibraryStatus = async (): Promise<void> => {
    if (window.hasOwnProperty('Stimulsoft')) {
      await loadPage();
      return;
    } else {
      window.setTimeout(startStimulsoftLibraryStatus, 250);
    }
  };

  const loadPage = async (): Promise<void> => {
    if (hasDropdownCriteria.value) {
      await fetchReportCriteriaStore(reportGuid.value);
      const criteria = reportsStore.value;
      criteria_dropdownLists.value = criteria;
    }

    if (hasCriteria.value) {
      await handleCriteriaPage();
      dataIsModified.value = false;
    } else {
      showCriteriaScreen.value = false;
      criteriaDoneLoading.value = true;
      await loadReport();
    }
  };

  const handleCriteriaPage = async (): Promise<void> => {
    //setCriteriaToSystemDefaults();
    await postpageloadactions();
    criteriaDoneLoading.value = true;
  };

  const loadReport = async (): Promise<void> => {
    const Stimulsoft: any = (window as any).Stimulsoft;

    if (Stimulsoft != null) {
      options.value = new Stimulsoft.Viewer.StiViewerOptions();

      options.value.userValues = {
        ReportID: reportGuid.value,
        Criteria: JSON.stringify(criteria.value)
      };

      options.value.requestToken = 'Bearer ' + await azureB2CAuthStore.fetchAccessToken();

      Stimulsoft.Viewer.parameters.requestUrl = stimulsoftApiUrl.value;
      Stimulsoft.Viewer.parameters.requestAbsoluteUrl = stimulsoftApiUrl.value;

      viewer.value = new Stimulsoft.Viewer.StiViewer(options.value, 'StiViewer', false);
      viewer.value.renderHtml('viewerContent');
    }
  };

  const getReportDataResourcePath = (): string => {
    // This is an OPTIONAL user value
    // Use this to override the path of where data endpoint is located in external API
    // e.g. '/api/myreports/data' (vs the default api/reporting/data)
    return null;
  };

  const getReportTemplateResourcePath = (): string => {
    // This is an OPTIONAL user value
    // Use this to override the path of where template endpoint is located in external API
    // e.g. '/api/myreports/templates' (vs the default api/reporting/template)
    return null;
  };

  return {
    criteria,
    reportName,
    reportGuid,
    hasCriteria,
    hasDropdownCriteria,
    isPhaseActive,
    hasFoundationIntegration,
    hasQuickBooksIntegration,
    hasFoundationData,
    userHasCriteriaDefaults,
    uIFunction,
    dataIsModified,
    customTemplatePageHeight,
    isLoading,
    report_template,
    splitApiPath,
    criteria_dropdownLists,
    criteriaDoneLoading,
    showCriteriaScreen,
    viewer,
    stimulsoftApiUrl,
    workforceHQApi,
    options,
    formHasValidated,
    form,
    loadSavedDefaultCriteria,
    setCriteria,
    unsetCriteria,
    setDateCriteria,
    setBooleanCriteria,
    setStringCriteria,
    runReport,
    generateCriteria,
    getDropdownList,
    getCriteriaDefault,
    allGroupDescription,
    dataModified,
    backToReportList,
    getReportDataResourcePath,
    getReportTemplateResourcePath
  };
}