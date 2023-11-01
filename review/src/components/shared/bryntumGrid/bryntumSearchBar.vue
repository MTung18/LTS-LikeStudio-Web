<!-- ES Lint doesn't like the typescript syntax for defining enums or event emission in Vue 3 -->
<!-- eslint-disable no-unused-vars -->
<script setup lang="ts">
import { debounce } from "lodash-es";
import { Ref, onMounted, ref, watch } from "vue";
import { RouteLocationRaw } from 'vue-router';
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowCircleLeft,
  faFilter,
  faRefresh,
  faSearch,
  faSlidersH,
  faTimes,
  faBadgeDollar,
  faFamilyPants,
} from "@fortawesome/pro-light-svg-icons";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { FoundationCompanyCasConnection } from "@/models/foundationIntegration/FoundationCompanyCasConnection";
import { useFoundationCompanyCasConnectionStore } from '@/stores/integration/foundation/foundationCompanyCasConnectionStore';
import { useRouter } from "vue-router";
library.add(
  faArrowCircleLeft,
  faFilter,
  faRefresh,
  faSearch,
  faSlidersH,
  faTimes,
  faBadgeDollar,
  faFamilyPants
);
interface Props {
  title: string;
  icon?: string;
  localStorageKey?: string;
  showSettingsButton?: boolean;
  showSearchButton?: boolean;
  showFilterButton?: boolean;
  showRefreshButton?: boolean;
  showFooterSearch?: boolean;
  showBackButton?: boolean;
  showIcon?: boolean;
  returnRoute?: RouteLocationRaw;
  showTitleHeader?: boolean;
  sticky?: boolean;
}
const router = useRouter();
const { responsive } = useBreakpoints();
const props = withDefaults(defineProps<Props>(), {
  title: "",
  localStorageKey: "",
  showSettingsButton: false,
  showSearchButton: false,
  showFilterButton: false,
  showRefreshButton: false,
  showFooterSearch: false,
  showBackButton: false,
  showTitleHeader: true,
  showIcon: false,
  icon: "",
  sticky: false,
});
const isLoading: Ref<boolean> = ref(true);
const companyCasConnection: Ref<FoundationCompanyCasConnection | null> = ref(null);
const enum EmitNames {
  SAVE_SETTINGS = "saveSettings",
  CLEAR_SETTINGS = "clearSettings",
  HIDE_FILTER_BAR = "hideFilterBar",
  SHOW_FILTER_BAR = "showFilterBar",
  SEARCH_TEXT_INPUT = "searchTextInput",
  REFRESH_GRID = "refreshGrid",
}
const emits = defineEmits<{
  (e: EmitNames.SAVE_SETTINGS): void;
  (e: EmitNames.CLEAR_SETTINGS): void;
  (e: EmitNames.HIDE_FILTER_BAR): void;
  (e: EmitNames.SHOW_FILTER_BAR): void;
  (e: EmitNames.SEARCH_TEXT_INPUT, value: string): void;
  (e: EmitNames.REFRESH_GRID): void;
}>();

function onSaveSettingsClick() {
  emits(EmitNames.SAVE_SETTINGS);
}

function onClearSettingsClick() {
  searchText.value = "";
  emits(EmitNames.CLEAR_SETTINGS);
  emits(EmitNames.REFRESH_GRID);
}

async function setCompanyCasConnection(): Promise<void> {
  const foundationCompanyCasConnectionStore = useFoundationCompanyCasConnectionStore();
  await foundationCompanyCasConnectionStore.fetchCompanyCasConnection();
  companyCasConnection.value = foundationCompanyCasConnectionStore.companyCasConnection;
}

const searchText = ref(
  localStorage.getItem(`${props.localStorageKey}SearchText`) ?? ""
);
const searchTextDebounce = debounce(() => {
  emits(EmitNames.SEARCH_TEXT_INPUT, searchText.value);
}, 500);
watch(searchText, searchTextDebounce);

const searchBarShown = ref(false);
function toggleSearchBar() {
  searchBarShown.value = !searchBarShown.value;
  if (!searchBarShown.value) {
    searchText.value = "";
  }
}

const filterBarShown = ref(false);
function toggleFilterBar() {
  filterBarShown.value = !filterBarShown.value;
}
watch(filterBarShown, () => {
  filterBarShown.value
    ? emits(EmitNames.SHOW_FILTER_BAR)
    : emits(EmitNames.HIDE_FILTER_BAR);
});



const onSyncClick = () => {
  if (companyCasConnection.value) {
    router.push({ name: 'settingsFoundation' })
  } else {
    openSyncIntegrationModal.value = true;

  }
};

onMounted(() => {
  const gridState = localStorage.getItem(`${props.localStorageKey}State`);
  if (gridState) {
    const parsedFilters = JSON.parse(gridState).filters ?? [];
    filterBarShown.value = parsedFilters.length > 0;
  }
  if (props.showRefreshButton) {
    isLoading.value = true;
    setCompanyCasConnection();
    isLoading.value = false;
  }

});

const openSyncIntegrationModal = ref(false);
function onOKButtonClick() {
  openSyncIntegrationModal.value = false
}
</script>

<template>
  <fs-container fluid class="contain hq-pg__header"
    :class="{ 'hq-pg__header--sticky hq-pg__header--mobile': sticky, 'hq-pg__header--no-height': responsive.mobile }"
    v-if="showTitleHeader">
    <fs-row align-v="center">
      <fs-col cols="auto" v-if="showBackButton" title="Back">
        <fs-link variant="link" :to="returnRoute">
          <font-awesome-icon :icon="['fal', 'arrow-circle-left']" size="2x" /> </fs-link></fs-col>
      <slot name="alerts"></slot>
      <fs-col cols="auto" v-if="title.length > 0">
        <h2 class="hq-pg__title py-3">
          <font-awesome-icon v-if="showIcon" :icon="['fal', icon]" class="icon-information" />
          {{ title }}
        </h2>
      </fs-col>
      <fs-col cols="auto">
        <slot name="headers"></slot>
      </fs-col>
      <fs-col v-show="searchBarShown && showSearchButton">
        <fs-row align-v="center">
          <fs-col lg="6">
            <fs-form-group class="fs-input__form-group fs-input__form-group--search">
              <fs-form-input type="text" class="fs-input__input mb-0" v-model="searchText"
                :placeholder="`Search ${title}...`">
              </fs-form-input>
              <fs-button variant="link" :disabled="searchText === ''"
                class="px-3 fs-input__button fs-input__button--right" @click="searchText = ''">
                <transition name="iconSwitch" enter-active-class="animate__animated animate__fadeInDown animate__faster"
                  leave-active-class="animate__animated animate__fadeOutDown animate__faster">
                  <font-awesome-icon v-if="searchText === ''" key="search" :icon="['fal', 'search']"
                    class="fs-input__button-icon fs-input__button-icon--right" />
                  <font-awesome-icon v-else key="times" :icon="['fal', 'times']"
                    class="fs-input__button-icon fs-input__button-icon--right" />
                </transition>
              </fs-button>
            </fs-form-group>
          </fs-col>
        </fs-row>
      </fs-col>
      <fs-col :cols="responsive.mobile ? '12' : 'auto'" class="d-flex ms-auto"
        :class="responsive.mobile ? 'border-top py-3' : ''" id="custom-button">
        <div class="d-flex ms-auto">
          <div class="d-flex">
            <fs-popper tooltip hover content="Settings" placement="bottom" :class="{ 'me-2': showSettingsButton }">
              <fs-dropdown v-if="showSettingsButton" no-caret variant="outline-cyan"
                toggle-class="btn--h-40 rounded-pill px-2">
                <template #button-content>
                  <font-awesome-icon :icon="['fal', 'sliders-h']" size="lg" />
                </template>
                <fs-dropdown-header>Options</fs-dropdown-header>
                <fs-dropdown-item><span @click="onSaveSettingsClick()">Save Settings</span></fs-dropdown-item>
                <fs-dropdown-item><span @click="onClearSettingsClick()">Clear Settings</span></fs-dropdown-item>
              </fs-dropdown>
            </fs-popper>
            <fs-popper v-if="showSearchButton && !showFooterSearch" tooltip hover content="Search" placement="bottom"
              :class="{ 'me-2': showSearchButton }">
              <fs-button variant="outline-cyan" class="px-2 btn--h-40 rounded-pill"
                :class="searchBarShown ? 'active' : ''" @click="toggleSearchBar()">
                <font-awesome-icon :icon="['fal', 'search']" size="lg" />
              </fs-button>
            </fs-popper>
            <fs-popper v-if="showFilterButton" tooltip hover content="Filter" placement="bottom"
              :class="{ 'me-2': showFilterButton }">
              <fs-button variant="outline-cyan" type="button" class="px-2 btn--h-40 rounded-pill"
                :class="filterBarShown ? 'active' : ''" @click="toggleFilterBar()">
                <font-awesome-icon :icon="['fal', 'filter']" size="lg" />
              </fs-button>
            </fs-popper>
            <fs-popper v-if="showRefreshButton" tooltip hover content="Sync With Foundation" placement="bottom"
              :class="{ 'me-2': showRefreshButton }">
              <fs-button variant="outline-primary" type="button" class="px-2 btn--h-40 rounded-pill"
                @click="onSyncClick()">
                <font-awesome-icon :icon="['fal', 'refresh']" size="lg" />
              </fs-button>
            </fs-popper>
          </div>
          <slot name="buttons"></slot>
        </div>
      </fs-col>
    </fs-row>
  </fs-container>
  <fs-container v-if="showFooterSearch || $slots.footer" fluid class="contain hq-pg__header hq-pg__header--no-height">
    <fs-row align-v="center">
      <fs-col lg="4" v-if="showFooterSearch">
        <fs-form-group class="fs-input__form-group fs-input__form-group--search">
          <fs-form-input type="text" class="fs-input__input mb-0" v-model="searchText"
            :placeholder="`Search ${title}...`">
          </fs-form-input>
          <fs-button variant="link" :disabled="searchText === ''" class="px-3 fs-input__button fs-input__button--right"
            @click="searchText = ''">
            <transition name="iconSwitch" enter-active-class="animate__animated animate__fadeInDown animate__faster"
              leave-active-class="animate__animated animate__fadeOutDown animate__faster">
              <font-awesome-icon v-if="searchText === ''" key="search" :icon="['fal', 'search']"
                class="fs-input__button-icon fs-input__button-icon--right" />
              <font-awesome-icon v-else key="times" :icon="['fal', 'times']"
                class="fs-input__button-icon fs-input__button-icon--right" />
            </transition>
          </fs-button>
        </fs-form-group>
      </fs-col>
      <fs-col>
        <slot name="footer"></slot>
      </fs-col>
    </fs-row>
  </fs-container>

  <!-- Modal -->
  <fs-modal centered content-class="phq-modal" header-class="phq-modal__header" title-class="phq-modal__title"
    body-class="phq-modal__body" footer-class="phq-modal__footer" header-text-variant="light" header-bg-variant="blue--dk"
    :lazy="true" title="Foundation Integration" hide-header-close no-close-on-backdrop3 no-close-on-esc
    v-model="openSyncIntegrationModal" @ok="onOKButtonClick">
    Please set up your Foundation Integration to sync.
    <template #modal-footer="slotProps">
      <fs-button variant="primary" @click="slotProps.ok">OK</fs-button>
    </template>
  </fs-modal>
</template>

<style scoped>
.alert {
  padding: 8px;
  border-radius: 5px;
}

.title {
  margin-top: 1rem;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 21px;
}

.search-title {
  display: flex;
  align-items: center;
}
</style>

<style>
.pill-dropdown {
  position: absolute;
  transform: translate3d(-103px, 40px, 0px);
  top: 0px;
  left: 0px;
  will-change: transform;
}

.btn-cyan:focus,
.btn-cyan:hover {
  color: #fff;
  background-color: #038fce;
  border-color: #0286c2;
  box-shadow: 0 0 0 0.2rem rgb(41 182 246 / 50%);
}
</style>
