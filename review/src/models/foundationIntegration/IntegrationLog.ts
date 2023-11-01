import { IntegrationFunction } from "@/enums/IntegrationFunction";
import { IntegrationProvider } from "@/enums/IntegrationProvider";

export class IntegrationLog {
  id: number;
  integrationProviderId: IntegrationProvider;
  integrationFunctionId: IntegrationFunction;
  lastSyncTimeUTC: Date;
  lastImportTimeUTC: Date

  public constructor(init?: Partial<IntegrationLog>) {
    Object.assign(this, init);
  }
}