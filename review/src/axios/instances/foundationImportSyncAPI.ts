import AxiosBase from "./axiosBase";
import { ActionType } from "@/enums/ActionType";
import { IImportSync } from "../../contracts/IImportSync";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { useAlerts } from '@/composables/useAlerts';
import { ExtensiveImportSyncEndpoint } from "@/models/foundationIntegration/FoundationImportSyncPropertyKey";

export default class FoundationImportSyncAPI<T> extends AxiosBase implements IImportSync {

    private _foundationIntegrationProvider = 1;
    private alerts = useAlerts();

    private _resourceName: string;
    public get resourceName(): string {
        return this._resourceName;
    }
    public set resourceName(v: string) {
        this._resourceName = v;
    }

    private _overRideEndpoints: ExtensiveImportSyncEndpoint;
    public get overRideEndpoints(): ExtensiveImportSyncEndpoint {
        return this._overRideEndpoints;
    }
    public set overRideEndpoints(v: ExtensiveImportSyncEndpoint) {
        this._overRideEndpoints = v;
    }

    constructor(interceptors: Array<any>, entityName: string, overRideEndpoints?: ExtensiveImportSyncEndpoint) {
        const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement;

        super(interceptors, baseUrl, entityName);
        this.resourceName = entityName;
        this.overRideEndpoints = overRideEndpoints;
    }

    public async fetch(isSynced: boolean): Promise<T[]> {
        let result: T[] = [];
        try {
            let url = `/v1/foundationIntegration/${this.resourceName}?IsSynced=${isSynced}`;
            if (this.overRideEndpoints && this.overRideEndpoints.fetch) {
                url = `/v1/foundationIntegration/${this.overRideEndpoints.fetch}?IsSynced=${isSynced}`;
            }
            const response = await this.PerformFetch<T[]>(url);
            result = response;
        } catch (error) {
            this.alerts.notifyError(`An error occurred attempting to fetch ${this.resourceName}`)
            console.error(this.errormessage(ActionType.Fetch), error);
        }
        return result;
    }

    public async import(data: T[]): Promise<boolean> {
        try {
            let url = `/v1/${this.resourceName}?integrationProvider=${this._foundationIntegrationProvider}`;
            if (this.overRideEndpoints && this.overRideEndpoints.import) {
                url = `/v1/${this.overRideEndpoints.import}?isSync=false&integrationProvider=${this._foundationIntegrationProvider}`;
            }
            return await this.PerformPost<boolean>(url, data, true);
        } catch (error) {
            console.error(this.errormessage(ActionType.Create), error);
        }
        return false;
    }

    public async sync(data: T[]): Promise<boolean> {
        try {
            let url = `/v1/${this.resourceName}?integrationProvider=${this._foundationIntegrationProvider}`;
            if (this.overRideEndpoints && this.overRideEndpoints.sync) {
                url = `/v1/${this.overRideEndpoints.sync}?isSync=true&integrationProvider=${this._foundationIntegrationProvider}`;
            }
            if (this.overRideEndpoints.isSyncUseHttpPost) {
                return await this.PerformPost<boolean>(url, data, true);
            }
            return await this.PerformPut<boolean>(url, data, true);
        } catch (error) {
            console.error(this.errormessage(ActionType.Create), error);
        }
        return false;
    }
}
