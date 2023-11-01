
import { computed, ref } from 'vue';

export function useBryntumSelector<T>() {

    const currentSelectedRows = ref<Partial<T>[]>([]);
    const selectedRowCount = computed(() => currentSelectedRows.value.length);
    const isRowSelected = computed(() => selectedRowCount.value > 0);

    function bryntumSelectedRowHandler(currentSelectedRows: any, data: any): void {
        if (Array.isArray(data.selection) && data.selection.length > 0) {
            currentSelectedRows.value = data.selection.map((item: any) => item.data);
        } else {
            currentSelectedRows.value = [];
        }
    }

    return {
        currentSelectedRows,
        selectedRowCount,
        isRowSelected,
        bryntumSelectedRowHandler
    }

}