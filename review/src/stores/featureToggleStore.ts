import { defineStore } from 'pinia';
import { getLocalAppsettings } from '@/helper/hqSuite/appSettingsHelper';

export const useFeatureToggleStore = defineStore({
  id: 'featureToggle',
  state: () => ({
    betaEnabled: getLocalAppsettings().FeatureToggles.BetaEnabled
  }),
  getters: {
    isBetaEnabled: (state) => state.betaEnabled === 'true'
  }
})
