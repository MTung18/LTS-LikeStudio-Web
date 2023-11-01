import { appSecretsApi } from '@/axios/instances/settings/appSecretsApi';
import { AppSecrets } from '@/models/settings/AppSecrets';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';
import { useAlerts } from '@/composables/useAlerts';

const SecretDependentServices = [
    { name: 'demoSecretService', startupFunction: startupFunction },
]

export interface ISecretDependentServices {
    name: string;
    started: boolean;
    error: unknown;
}

const { notifySuccess, notifyError } = useAlerts();

export const useAppSecretsStore = defineStore('appSecrets', () => {

    // #region State
    const appSecrets = ref(new AppSecrets());
    const appSecretsLoaded = ref(false);
    const secretDependentServices = ref(new Array<ISecretDependentServices>());

    const secretDependentServicesStarted = computed(() => {
        const dependents = secretDependentServices.value;

        return dependents.length > 0
            && dependents.every(sds => sds.started)
            && dependents.every(sds => sds.error === null);
    })
    // #endregion

    // #region Actions
    async function fetchAppSecretsAsync(): Promise<void> {
        appSecretsLoaded.value = false;
        try {
            appSecrets.value = await appSecretsApi.getAppSecrets();
            appSecretsLoaded.value = true;
        } catch (err) {
            notifyError(err);
        }
    }

    async function startSecretDependentServicesAsync(): Promise<void> {
        if (!appSecretsLoaded.value) {
            notifyError('Cannot start secret dependent services, app secrets not loaded');
        }

        const app = await getVueApplicationById('app');
        if (!app) {
            notifyError('Error in secret dependent services, app is not initialized');
        }

        SecretDependentServices.forEach(sds => {
            const match = secretDependentServices.value.find(s => s.name === sds.name);
            if (!match || !match.started) {
                const service = {
                    name: sds.name,
                    started: false,
                    error: null,
                };
                try {
                    sds.startupFunction(appSecrets.value, app);
                    service.started = true;
                } catch (error) {
                    service.error = error;
                }

                const i = secretDependentServices.value.findIndex(sds => sds.name === service.name);
                if (i === -1) {
                    secretDependentServices.value.push(service)
                } else {
                    secretDependentServices.value.splice(i, 1, service);
                }
            }
        });
    }
    // #endregion

    return {
        appSecrets,
        appSecretsLoaded,
        secretDependentServices,
        secretDependentServicesStarted,
        fetchAppSecretsAsync,
        startSecretDependentServicesAsync
    }
});

// TODO: move elsewhere
function getVueApplicationById(id: string): any {
    const appElement: any = document.getElementById(id);
    return appElement?.__vue_app__;
}

// TODO: Implement as needed; this functionality is currently unused
async function startupFunction(appSecrets: AppSecrets, app: any): Promise<void> {   
    return;
}

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAppSecretsStore, import.meta.hot));
}