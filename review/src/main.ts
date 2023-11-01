import { createApp, DefineComponent } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "animate.css";
import "bootstrap";
import "./sass/site.scss";
import { msalPlugin } from "./plugins/msal/msalPlugin";
import { signalRPlugin } from "./plugins/signalR/signalRPlugin";
import { layoutPlugin } from "./plugins/vue/layout/layoutPlugin";
import { veeValidatePlugin } from './plugins/veeValidate/veeValidatePlugin';
import { RefreshPermissionsPlugin } from "./plugins/vue/refreshPermissionsPlugin";
import { FsBootstrap } from "@fsllc/fs-bootstrap";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/vue-fontawesome";
import Notifications from '@kyvg/vue3-notification';
import onboardingStatus from "@/components/viewComponents/onboarding/onboardingStatus.vue";
import hrOnboardingTasks from "@/components/viewComponents/onboarding/hrOnboardingTasks.vue";
import onboardingProgress from "@/components/viewComponents/onboarding/onboardingProgress.vue";
import sensitiveText from "@/components/global/sensitiveText.vue";
import fsInput from "./components/global/fsInput/fsInput.vue";
import granularSecurity from "./components/global/granularSecurity.vue";
import infoSidebar from '@/components/global/infoSidebar.vue';
import { fetchAndTransferAppsettings } from "./helper/hqSuite/appSettingsHelper";
import Vue3Lottie from "vue3-lottie";
import 'vue3-lottie/dist/style.css'

declare module "vue" {
  export interface GlobalComponents {
    FontAwesomeIcon: DefineComponent<Partial<FontAwesomeIconProps>>;
  }
}

export { };

await fetchAndTransferAppsettings();

const app = createApp(App);

app.use(createPinia());
app.use(layoutPlugin);
app.use(msalPlugin);
app.use(veeValidatePlugin);
app.use(FsBootstrap);
app.use(Notifications);
app.use(Vue3Lottie, { name: 'LottieAnimation' })

// These plugins must be initialized after the msalPlugin is ready to ensure that the authentication token is available
msalPlugin.isReady().then(() => {
  app.use(signalRPlugin);
  app.use(RefreshPermissionsPlugin);

  RefreshPermissionsPlugin.isReady().then(() => {
    app.use(router);

    router.isReady().then(() => {
      // Waiting for the router to be ready prevents race conditions when returning from a loginRedirect or acquireTokenRedirect
      app.mount("#app");
    });
  });
});

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("onboarding-progress", onboardingProgress);
app.component("hr-onboarding-tasks", hrOnboardingTasks);
app.component("sensitive-text", sensitiveText);
app.component("onboarding-button-status", onboardingStatus);
app.component("fsInput", fsInput);
app.component("granular-security", granularSecurity);
app.component("info-sidebar", infoSidebar);
