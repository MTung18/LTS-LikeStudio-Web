import { AppSettings } from "@/models/AppSettings";

const STORAGE_APP_SETTINGS_KEY = "appSettings";

function setLocalAppsettings(response) {
  const _appSettings = new AppSettings(response);
  localStorage.setItem(STORAGE_APP_SETTINGS_KEY, JSON.stringify(_appSettings));
  return _appSettings;
}

function fetchAndTransferAppsettings() {
  const appsettingsUrl = "/appsettings.json";

  if (process.env.NODE_ENV === "development") {
    return fetch(appsettingsUrl)
      .then(res => {
        if (res.status == 404) {
          console.warn(`If you want to override the default app settings, please make a copy of "appsettings.json" named "appsettings.local.json" and modify the configurations there.`);
          return fetch(appsettingsUrl);
        } else {
          return res;
        }
      })
      .then((res) => res.json())
      .then((res) => {
        return setLocalAppsettings(res);
      });
  } else {
    return fetch(appsettingsUrl)
      .then(res => res.json())
      .then((res) => {
        return setLocalAppsettings(res);
      });
  }
}

function getLocalAppsettings() {
  const localSettings = localStorage.getItem(STORAGE_APP_SETTINGS_KEY);
  return new AppSettings(JSON.parse(localSettings));
}