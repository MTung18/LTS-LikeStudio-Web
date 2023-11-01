
export class AppSettings {
  public FeatureToggles: FeatureTogglesConfig = new FeatureTogglesConfig();
  public ApplicationInsights: ApplicationInsightsConfig = new ApplicationInsightsConfig();
  public ClientSide: ClientSideConfig = new ClientSideConfig();
  public AzureB2C: AzureB2CConfig = new AzureB2CConfig();

  public constructor(init?: Partial<AppSettings>) {
    if (init) {
      Object.assign(this, init);

      this.ApplicationInsights = new ApplicationInsightsConfig(init.ApplicationInsights);
      this.FeatureToggles = new FeatureTogglesConfig(init.FeatureToggles);
      this.ClientSide = new ClientSideConfig(init.ClientSide);
      this.AzureB2C = new AzureB2CConfig(init.AzureB2C);
    }
  }
}

export class FeatureTogglesConfig {
  public BetaEnabled: string;

  constructor(init?: Partial<FeatureTogglesConfig>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class ApplicationInsightsConfig {
  public InstrumentationKey: string;

  constructor(init?: Partial<ApplicationInsightsConfig>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class ClientSideConfig {
  public WorkforceManagement: string;
  public WorkforceEmployeeManagement: string;
  public DocumentStorageApiRootUrl: string;
  public SystemNotificationsApiRootUrl: string;
  public SecretsApiRootUrl: string;
  public StimulsoftApiUrl: string;
  public B2CFunctionAppUrl: string;

  constructor(init?: Partial<ClientSideConfig>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class AzureB2CConfig {

  public ClientId: string;
  public Authority: string;
  public PasswordResetAuthority: string;
  public ChangePasswordAuthority: string;
  public KnownAuthorities: string;
  public LoginScopes: string;
  public LoginExtraScopesToConsent: string;
  public DefaultAccessTokenScopes: string;
  public ACRTokenClaim: string;
  public RedirectUri: string;
  public RedirectStartPage: string;
  public LogoutRoute: string;

  constructor(init?: Partial<AzureB2CConfig>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
