<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import { faCity, faDatabase, faServer, faFileImport, faUsers, faCog } from '@fortawesome/pro-light-svg-icons';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons';
import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { IntegrationFunction, IntegrationFunctionMap } from '@/enums/IntegrationFunction';
import { WorkforceHQEntityType } from '@/enums/WorkforceHQEntityType';
import { pluralize } from '@/functions/FilterFunctions';
import { FoundationCompanyCasConnection } from "@/models/foundationIntegration/FoundationCompanyCasConnection";
import { useFoundationCompanyCasConnectionStore } from '@/stores/integration/foundation/foundationCompanyCasConnectionStore';
import { useIntegrationLogStore } from '@/stores/integration/integrationLogStore';
import { IntegrationProvider } from "@/enums/IntegrationProvider";
import { IntegrationLog } from '@/models/foundationIntegration/IntegrationLog';
import { formatUTCToLocalDateTime } from '@/functions/DateUtilityFunctions';

library.add(faCity, faDatabase, faServer, faFileImport, faSyncAlt, faInfoCircle, faUsers, faCog);

interface FoundationSyncEntity {
    foundationItem: string;
    phqFeature: string;
    lastSync?: string;
    lastImport?: string;
    integrationEntityName: string; // The name that comes back from the API in the IntegrationAggregate
    importRoute?: { name: string, params: { importType: number } };
    syncRoute?: { name: string, params: { importType: number }, query: { isSync: boolean } };
    projectHQEntity?: string;
    foundationIntegrationFunction: IntegrationFunction;
    importDisabled?: boolean;
    importDisabledText?: string;
    hasSync: boolean;
}
interface FoundationSyncSection {
    sectionName: string;
    entities: FoundationSyncEntity[];
    faIcon: string;
}

const isLoading: Ref<boolean> = ref(true);
const syncSections: Ref<FoundationSyncSection[]> = ref([]);
const emptySyncText: Ref<string> = ref('Has not been synced yet.');
const emptyImportText: Ref<string> = ref('Has not been imported yet.');
const companyCasConnection: Ref<FoundationCompanyCasConnection | null> = ref(null);

onMounted(async () => {
    isLoading.value = true;
    buildSyncSections();
    setCompanyCasConnection();
    setLastImportSyncTimes();
    isLoading.value = false;
});

function createEntity(integrationFunction: number, workforceHQEntityType: string) {
    const importRoute = { name: "settingsFoundationImport", params: { importType: integrationFunction } };

    return {
        foundationItem: pluralize(IntegrationFunctionMap.displayName(integrationFunction)),
        phqFeature: pluralize(workforceHQEntityType),
        integrationEntityName: workforceHQEntityType,
        projectHQEntity: workforceHQEntityType,
        foundationIntegrationFunction: integrationFunction,
        importRoute,
        syncRoute: { ...importRoute, query: { isSync: true } },
        hasSync: true,
    }
}

function buildSyncSections(): void {
    const sections: FoundationSyncSection[] = [];
    sections.push(
        {
            sectionName: 'Employees',
            entities: [
                createEntity(IntegrationFunction.Employee, WorkforceHQEntityType.Employee)
            ],
            faIcon: 'users',
        }
    );
    sections.push(
        {
            sectionName: 'Setup',
            entities: [
                createEntity(IntegrationFunction.AccrualCode, WorkforceHQEntityType.AccrualCode),
                createEntity(IntegrationFunction.AccrualPlan, WorkforceHQEntityType.AccrualPlan),
                createEntity(IntegrationFunction.CostCode, WorkforceHQEntityType.CostCode),
                createEntity(IntegrationFunction.Crew, WorkforceHQEntityType.Crew),
                createEntity(IntegrationFunction.Department, WorkforceHQEntityType.Department),
                createEntity(IntegrationFunction.EarnCode, WorkforceHQEntityType.EarnCode),
                createEntity(IntegrationFunction.GeneralLiabilityState, WorkforceHQEntityType.GeneralLiabilityState),
                createEntity(IntegrationFunction.GeneralLiabilityClass, WorkforceHQEntityType.GeneralLiabilityClass),
                createEntity(IntegrationFunction.Minority, WorkforceHQEntityType.Minority),
                createEntity(IntegrationFunction.MiscDeductionCycle, WorkforceHQEntityType.MiscDeductionCycle),
                createEntity(IntegrationFunction.MiscDeduction, WorkforceHQEntityType.Deduction),
                createEntity(IntegrationFunction.PayPeriod, WorkforceHQEntityType.PayPeriod),
                createEntity(IntegrationFunction.Shift, WorkforceHQEntityType.Shift),
                createEntity(IntegrationFunction.TaxGroup, WorkforceHQEntityType.TaxGroup),
                createEntity(IntegrationFunction.TaxState, WorkforceHQEntityType.TaxState),
                createEntity(IntegrationFunction.LocalTaxAuthority, WorkforceHQEntityType.LocalTaxAuthority),
                createEntity(IntegrationFunction.Trade, WorkforceHQEntityType.Trade),
                createEntity(IntegrationFunction.Union, WorkforceHQEntityType.Union),
                createEntity(IntegrationFunction.WorkersCompState, WorkforceHQEntityType.WorkersCompState),
                createEntity(IntegrationFunction.WorkersCompClass, WorkforceHQEntityType.WorkersCompClass),
            ],
            faIcon: 'cog',
        });

    syncSections.value = sections;
}

async function setCompanyCasConnection(): Promise<void> {
    const foundationCompanyCasConnectionStore = useFoundationCompanyCasConnectionStore();
    await foundationCompanyCasConnectionStore.fetchCompanyCasConnection();
    companyCasConnection.value = foundationCompanyCasConnectionStore.companyCasConnection;
}

async function setLastImportSyncTimes(): Promise<void> {
    const integrationLogStore = useIntegrationLogStore();
    const integrationLogs = await integrationLogStore.getIntegrationLogs(IntegrationProvider.Foundation);
    setLastImportSyncTimesFromLogs(integrationLogs);
}

function setLastImportSyncTimesFromLogs(integrationLogs: IntegrationLog[]): void {
    integrationLogs.forEach((l: IntegrationLog) => {
        const entity: FoundationSyncEntity = findEntityByIntegrationFunction(l.integrationFunctionId);
        if (entity) {
            if (l.lastImportTimeUTC) {
                entity.lastImport = formatUTCToLocalDateTime(l.lastImportTimeUTC)
            }
            if (l.lastSyncTimeUTC) {
                entity.lastSync = formatUTCToLocalDateTime(l.lastSyncTimeUTC);
            }
        }
    });
}

function findEntityByIntegrationFunction(integrationFunction: IntegrationFunction): FoundationSyncEntity {
    for (const section of syncSections.value) {
        for (const entity of section.entities) {
            if (entity.foundationIntegrationFunction === integrationFunction) {
                return entity;
            }
        }
    }
    return null;
}

</script>

<template>
    <div class="hq-pg bg-grey--000">
        <fs-container fluid class="hq-pg__header contain">
            <fs-row align-v="center">
                <fs-col cols="auto">
                    <h2 class="hq-pg__title">Foundation Integration</h2>
                </fs-col>
            </fs-row>
        </fs-container>

        <fs-overlay :show="isLoading" spinner-variant="primary" no-wrap />

        <fs-container fluid class="hq-pg__header hq-pg__header--sub contain">
            <fs-row align-v="center" class="mt-2">
                <fs-col class="justify-content-between ellipsis-text">
                    <fs-row align-h="around">
                        <fs-col cols="auto" class="d-flex align-items-center my-2">
                            <div class="me-2">
                                <font-awesome-icon size="2x" class="text-primary" :icon="['fal', 'city']" />
                            </div>
                            <div class="ellipsis-text">
                                <div class="fw-bold ellipsis-text">Client Name</div>
                                <div class="ellipsis-text">{{ companyCasConnection?.companyName }}</div>
                            </div>
                        </fs-col>

                        <fs-col cols="auto" class="d-flex align-items-center my-2">
                            <div class="me-2">
                                <font-awesome-icon size="2x" class="text-primary" :icon="['fal', 'database']" />
                            </div>
                            <div class="ellipsis-text">
                                <div class="fw-bold ellipsis-text">Database Name</div>
                                <div class="ellipsis-text">{{ companyCasConnection?.databaseName }}</div>
                            </div>
                        </fs-col>
                    </fs-row>
                </fs-col>
            </fs-row>
        </fs-container>

        <div class="contain hq-pg__container container-fluid ">
            <fs-card v-for="section in syncSections" :key="section.sectionName" class="dashboard-card mb-4" no-body>
                <fs-card-header class="dashboard-card__header">
                    <div class="me-2">
                        <font-awesome-icon class="text-cyan" size="lg" :icon="['fal', `${section.faIcon}`]" />
                    </div>
                    <h2 class="hq-pg__title ml-2">{{ section.sectionName }}</h2>
                </fs-card-header>

                <fs-card-body class="my-2">
                    <div class="list__integration list__table">
                        <fs-table-simple>
                            <fs-thead>
                                <fs-tr class="list__tr list__tr--thead">
                                    <fs-th class="ps-0">Foundation Name</fs-th>
                                    <fs-th class="ps-0">
                                        WHQ Feature
                                        <font-awesome-icon :id="section.sectionName + 'info'" class="text-secondary"
                                            :icon="['fas', 'info-circle']" />
                                        <fs-popover :target="section.sectionName + 'info'" placement="right"
                                            triggers="hover focus">
                                            This is where the corresponding FOUNDATION feature will be stored in
                                            WorkforceHQ.
                                        </fs-popover>
                                    </fs-th>
                                    <fs-th class="ps-0">Last Synced</fs-th>
                                    <fs-th class="ps-0">Last Imported</fs-th>
                                </fs-tr>
                            </fs-thead>

                            <fs-tbody>
                                <fs-tr v-for="entity in section.entities" :key="entity.foundationIntegrationFunction"
                                    class="list__tr list__tr--tbody">
                                    <fs-td class="list__td list__td--25 ps-0">{{ entity.foundationItem }}</fs-td>
                                    <fs-td class="list__td list__td--25 ps-0">{{ entity.phqFeature }}</fs-td>
                                    <fs-td class="list__td list__td--25 ps-0"
                                        v-bind:class="{ 'text-secondary': !entity.lastSync || !entity.hasSync }">
                                        <span class="pe-1">
                                            <fs-link v-if="entity.syncRoute" :to="entity.syncRoute">
                                                <font-awesome-icon :icon="['far', 'sync-alt']" class="text-primary" />
                                            </fs-link>
                                            <font-awesome-icon v-else :icon="['far', 'sync-alt']" class="text-primary" />
                                        </span>

                                        {{ entity.hasSync ? entity.lastSync ? entity.lastSync : emptySyncText : 'n/a' }}
                                    </fs-td>
                                    <fs-td class="list__td list__td--25 ps-0"
                                        v-bind:class="{ 'text-secondary': !entity.lastImport }">
                                        <span class="pe-1" :id="entity.integrationEntityName + 'import'">
                                            <fs-link v-if="entity.importRoute" :to="entity.importRoute"
                                                :disabled="entity.importDisabled">
                                                <font-awesome-icon :icon="['fal', 'file-import']" class="text-primary" />
                                            </fs-link>
                                            <font-awesome-icon v-else
                                                v-bind:class="entity.importDisabled ? 'opacity-50' : 'clickable'"
                                                :icon="['fal', 'file-import']" class="text-primary" />
                                        </span>

                                        {{ entity.lastImport ? entity.lastImport : emptyImportText }}
                                    </fs-td>
                                    <fs-popover v-if="entity.importDisabled"
                                        :target="entity.integrationEntityName + 'import'" placement="left"
                                        triggers="hover focus">
                                        {{ entity.importDisabledText }}
                                    </fs-popover>
                                </fs-tr>
                            </fs-tbody>
                        </fs-table-simple>
                    </div>
                </fs-card-body>
            </fs-card>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bg-gray {
    background-color: #eff1f3;
}
</style>