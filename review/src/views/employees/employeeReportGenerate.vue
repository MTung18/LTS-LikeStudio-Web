eslint-disable no-prototype-builtins
<script setup lang="ts">
import { library } from "@fortawesome/fontawesome-svg-core";
import { useRoute, useRouter } from 'vue-router'
import {
    faTimes,
    faCheck,
} from "@fortawesome/pro-light-svg-icons";
import { faAsterisk } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, computed, onMounted } from "vue";
import { getLocalAppsettings } from '@/helper/hqSuite/appSettingsHelper'
import { useAlerts } from '@/composables/useAlerts';
import { ReportTypeGuid } from '@/enums/ReportType';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';

library.add(faTimes, faAsterisk, faCheck);

const route = useRoute();
const azureB2CAuthStore = useAzureB2CAuthStore();

const router = useRouter();
const { notifySuccess } = useAlerts();

const reportName = {
    [ReportTypeGuid.EqualEmploymentOpportunity]: 'Equal Employment Opportunity Report',
    [ReportTypeGuid.WOTC8850]: 'WOTC 8850 Report',
    [ReportTypeGuid.WOTC9061]: 'WOTC 9061 Report',
    [ReportTypeGuid.I9]: 'I9 Report',
    [ReportTypeGuid.VEVRAA]: 'VEVRAA Report',
    [ReportTypeGuid.FederalW4]: 'Federal W4 Report',
}

const stimulsoftApiUrl = computed(() => getLocalAppsettings().ClientSide.StimulsoftApiUrl + '/viewer')

function includeStimulsoftLib(): void {
    if (!window.hasOwnProperty('Stimulsoft')) {
        const stiScript: HTMLScriptElement = document.createElement('script');
        stiScript.setAttribute('src', stimulsoftApiUrl.value);
        stiScript.setAttribute('type', 'text/javascript');
        document.body.appendChild(stiScript);
    }
}

includeStimulsoftLib()

async function startStimulsoftLibraryStatus() {
    if (window.hasOwnProperty('Stimulsoft')) {
        await loadPage()
    } else {
        window.setTimeout(startStimulsoftLibraryStatus, 250);
    }
}

onMounted(async () => {
    await startStimulsoftLibraryStatus()
})

async function loadPage(): Promise<void> {
    await loadReport()
    setTimeout(() => {
        notifySuccess('Report Generated.')
    }, 2000)
}

const reportCriteria = computed(() => {
    const data = JSON.parse(localStorage.getItem("report") || "[]");
    return data
})

const options = ref();
const viewer = ref()
async function loadReport(): Promise<void> {
    const Stimulsoft: any = (window as any).Stimulsoft;

    // Setting the required options on the client side
    options.value = new Stimulsoft.Viewer.StiViewerOptions();

    // Save off json template and criteria selections and the auth token in the custom user values
    options.value.userValues = {
        ReportID: route.params.guid,
        Criteria: JSON.stringify(reportCriteria.value),
    }

    options.value.requestToken = 'Bearer ' + await azureB2CAuthStore.fetchAccessToken();

    Stimulsoft.Viewer.parameters.requestUrl = stimulsoftApiUrl.value;
    Stimulsoft.Viewer.parameters.requestAbsoluteUrl = stimulsoftApiUrl.value;
    // Start up the viewer, close the spinner and render the report
    viewer.value = new Stimulsoft.Viewer.StiViewer(options.value, 'StiViewer', false);

    viewer.value.renderHtml('viewerContent');
}

const cancelPage = () => {
    router.go(-1);
}
</script>
<template>
    <div>
        <div class="p-4 d-flex align-items-center">
            <fs-button variant="outline-secondary" class="btn btn-outline-info me-2"
                @click="cancelPage()"><font-awesome-icon :icon="['fal', 'arrow-left']"
                    size="lg"></font-awesome-icon></fs-button>
            <h3 class="mb-0 d-inline-block fw-bold">
                {{ reportName[route.params.guid as string] }}
            </h3>
        </div>
        <hr class="m-0" />
        <div class="stimulsoft">
            <div id="viewerContent">
            </div>
        </div>
    </div>
</template>

<style scoped >
.btn {
    border-radius: 50%;
    padding: 5px 10px;
}

.stimulsoft {
    overflow: auto;
    height: calc(100vh - 132px);
}

:deep(h3) {
    font-size: 18px;
}
</style>
