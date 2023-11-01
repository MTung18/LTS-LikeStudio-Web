import { getStatefulFilterFeature } from '@/plugins/vue/bryntumGrid/utils/statefulFilterFeature';
import { fsBryntumGridConfig } from '@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults';
import { getStatefulSortFeature } from '@/plugins/vue/bryntumGrid/utils/statefulSortFeature';
import { Ref, computed, ref, watch } from "vue";
import { Grid, Store } from '@bryntum/grid';

export function useBryntumGridSearchFilter<T>(gridFeatures: any, gridLocalStorageKey: string, defaultSorter: any, filterBryntumStoreCallback: any) {

    const SEARCH_TEXT: string = 'SearchText';
    const STATE: string = 'State';

    const stateKey: string = `${gridLocalStorageKey}${STATE}`;
    const searchTextKey: string = `${gridLocalStorageKey}${SEARCH_TEXT}`;

    const defaultGridConfig = fsBryntumGridConfig.gridConfig;
    const statefulFilterFeature = getStatefulFilterFeature(gridLocalStorageKey);
    const statefulSortFeature = getStatefulSortFeature(gridLocalStorageKey, defaultSorter);
    const filteredData = ref(new Array<T>());
    const filterCount = ref(0);
    const searchText = ref(localStorage.getItem(`${gridLocalStorageKey}${SEARCH_TEXT}`) ?? '');
    const gridStore: Ref<Store> = ref(
        new Store({
            ...fsBryntumGridConfig.gridStoreConfig,
            sorters: [defaultSorter],
            onFilter: () => {
                // Ensures that store is always set correctly based on search text
                if (
                    searchText.value &&
                    gridStore.value.filters.count < filterCount.value
                ) {
                    filterBryntumStoreCallback();
                }
                filterCount.value = gridStore.value.filters.count;
            },
        })
    );

    watch(searchText, () => {
        filterBryntumStoreCallback();
    }, { deep: true });

    function saveGridSettings() {
        localStorage.setItem(stateKey, JSON.stringify((gridStore.value as any).state));
        localStorage.setItem(searchTextKey, searchText.value);
    }

    function clearGridSettings() {
        gridStore.value.clearFilters();
        gridStore.value.clearSorters();
        localStorage.removeItem(stateKey);
        localStorage.removeItem(searchTextKey);
    }

    function hideFilterBar() {
        gridStore.value.clearFilters();
        gridFeatures.value.filterBar.hideFilterBar();
    }

    async function populateBryntumStore() {
        gridStore.value.data = filteredData.value as Object[];
        const gridState = localStorage.getItem(stateKey);
        if (gridState) {
            try {
                const parsedState = JSON.parse(gridState);
                if ((typeof parsedState === 'object'))
                    (gridStore.value as any).state = parsedState;
            } catch (e) { }
        }
    }

    return {
        filteredData,
        defaultGridConfig,
        statefulFilterFeature,
        statefulSortFeature,
        filterCount,
        searchText,
        gridStore,
        saveGridSettings,
        clearGridSettings,
        hideFilterBar,
        populateBryntumStore
    }

}
