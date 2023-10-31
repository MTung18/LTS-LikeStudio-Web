class FeatureTogglesConfig {
  constructor(init) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

class ApplicationInsightsConfig {
  constructor(init) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

class ClientSideConfig {
  constructor(init) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

class AzureB2CConfig {
  constructor(init) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

class AppSettings {
  constructor(init) {
    this.FeatureToggles = new FeatureTogglesConfig();
    this.ApplicationInsights = new ApplicationInsightsConfig();
    this.ClientSide = new ClientSideConfig();
    this.AzureB2C = new AzureB2CConfig();

    if (init) {
      Object.assign(this, init);

      this.ApplicationInsights = new ApplicationInsightsConfig(init.ApplicationInsights);
      this.FeatureToggles = new FeatureTogglesConfig(init.FeatureToggles);
      this.ClientSide = new ClientSideConfig(init.ClientSide);
      this.AzureB2C = new AzureB2CConfig(init.AzureB2C);
    }
  }
}