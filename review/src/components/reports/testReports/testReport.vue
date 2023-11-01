<template>
    <VeeForm ref="form" as="span" v-slot="{ meta }">
  <fs-overlay :show="!criteriaDoneLoading" spinner-variant="primary" class="fsi-pg__overlay" no-wrap/>
        <div class="reports-criteria__grid">
            <fs-container fluid class="contain bg-grey--000">
                <div v-if="criteriaDoneLoading" class="">
                    <div class="d-flex align-items-center py-3">
                        <fs-button size="lg" 
                                    variant="link" 
                                    @click="backToReportList">
                            <font-awesome-icon :icon="['fal', 'arrow-circle-left']"  
                                                class="text-primary" />
                        </fs-button>
                        <div class="fsi-pg__title">{{ report_template.ReportName }} Criteria</div>
                    </div>
                </div>
                <div v-if="criteriaDoneLoading">
                    <fs-col md="12">
                    <fs-input type="fsMultiselectList"
                          key="id"
                          :name="projectDescription"
                          :label="projectDescription"
                          classname="form-control"
                          v-model="selectedProject"
                          :typeaheaddata="getDropdownList(projectCriteriaName)"
                          typeaheadkey="name"
                          typeaheadvalueattribute="id"
                          :defaultEmptyValue="null"
                          :rules="{required: true }"
                          :required="true"
                          />
                    </fs-col>
                    <div class="d-flex px-3 py-2">
                        <div class="d-flex ms-auto">
                            <fs-button variant="primary" @click="generateCriteriaAndRunReport">Run Report</fs-button>
                        </div>
                    </div>
                </div>
        </fs-container>
            <div class="reports-criteria__report-contain">
                <div id="viewerContent" class="reports-criteria__report-viewer">
                    <div class="reports-criteria__run-report-message">Select criteria and "Run Report".</div>
                </div>
                <fs-overlay :show="isLoading" spinner-variant="primary" class="fsi-pg__overlay" no-wrap>
                </fs-overlay>
                <div id="customDocumentTemplateViewerOuterContainer"></div>
            </div>
        </div>
    </VeeForm>      
  </template>
  
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useReport } from '@/composables/useReport';
import { ReportCriteria } from '@/models/ReportCriteria';
import FsInput from '@/components/global/fsInput/fsInput.vue';

export default defineComponent({
  name: 'TestReport',
  components: {
    FsInput,
  },
  setup() {
    const {
      criteria,
      hasCriteria,
      hasDropdownCriteria,
      reportName,
      reportGuid,
      isLoading,
      criteriaDoneLoading,
      report_template,
      form,
      backToReportList,
      runReport,
      setCriteria,
      getDropdownList,
    } = useReport();

    const projectCriteriaName = 'criteria_project';
    const projectDescription = 'Project';
    const selectedProject = ref(new ReportCriteria());

    onMounted(() => {
      hasCriteria.value = true;
      hasDropdownCriteria.value = true;
      reportName.value = 'test';
      reportGuid.value = '6b50955f-29d9-49ba-aa84-c414f0532b5f';
    });

    const generateReportCriteria = async () => {
      setCriteria(projectCriteriaName, selectedProject.value);
    };
    
    const generateCriteriaAndRunReport = async () => {
        criteria.value = [];
        generateReportCriteria();
        runReport();
    };

    return {
      projectCriteriaName,
      projectDescription,
      selectedProject,
      isLoading,
      criteriaDoneLoading,
      report_template,
      form,
      backToReportList,
      runReport,
      getDropdownList,
      generateReportCriteria,
      generateCriteriaAndRunReport
    };
  },
});
</script>
  