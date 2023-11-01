export class FoundationImportSyncPropertyKey {
  id: string;
  name: string;
  endpointName: string;
  overRideEachEndpointName: ExtensiveImportSyncEndpoint = new ExtensiveImportSyncEndpoint(); // Initialize with a default instance
  toEncodeProperties: string[];
  public constructor(init?: Partial<FoundationImportSyncPropertyKey>) {
    Object.assign(this, init);
  }
}

export class ExtensiveImportSyncEndpoint {
  fetch?: string;
  import?: string;
  sync?: string;
  isSyncUseHttpPost: boolean = false;
  public constructor(init?: Partial<ExtensiveImportSyncEndpoint>) {
    Object.assign(this, init);
  }

}