<script setup lang="ts">
import { Ref, computed, nextTick, ref } from 'vue';

interface Props {
    showPanel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showPanel: false,
});

const tabOptions: Ref<Array<{ text: string, value: string, disabled?: boolean }>> = ref(
  [
    { text: 'Amount', value: 'amount' },
    { text: 'Percentage', value: 'percentage' }
  ]);
const selectedTab: Ref<string> = ref('amount');

const emit = defineEmits(['update:showPanel']);

const deductionValidation = computed(() => {
    if (selectedTab.value === 'amount') {
        return {
            required: false,
            precisionAndScale: { pecision: 11, scale: 7 }
        }
    } else {
        return {
            required: false,
            between: { min: 0, max: 100 },
            precisionAndScale: { precision: 5, scale: 2 }
        }
    }
});

const localShowPanel = computed({
    get() {
        return props.showPanel;
    },
    set(value) {
        nextTick();
        emit("update:showPanel", value);
    },
});

</script>

<template>
    <fs-sidebar sidebar-class="fsi-sidebar" right no-close-on-esc no-close-on-backdrop
        bg-variant="white" width="425px" shadow="sm" header-class="border-bottom bg-grey--000 details_panel_header"
        footer-class="border-top" aria-label="edit401kDeduction" v-model="localShowPanel" title="Edit 401(k) Deduction Amount">
        <!-- footer -->
        <template #footer="{ hide }">
            <div class="d-flex contain py-3">
                <fs-button variant="outline-secondary" class="btn btn-outline-gray" @click="hide">Cancel</fs-button>
                <fs-button variant="btn-primary" class="btn btn-primary ms-auto">SAVE</fs-button>
            </div>
        </template>
        <div class="d-flex flex-column h-100 w-100 pt-3">
            <fs-container fluid class="contain">
                <VeeForm ref="observer" id="observer" v-slot="{ meta }">
                    <fs-form-group class="mb-3 px-1">
                        <fs-form-radio-group
                        class="d-flex p-2"
                        id="btn-radios-deductions"
                        v-model="selectedTab"
                        :options="tabOptions"
                        name="radio-btn-outline"
                        ></fs-form-radio-group>
                    </fs-form-group>

                    <fs-input v-if="selectedTab === 'amount'" type="fsTextInput" label="Deduction Amount" name="Deduction Amount"
                        inputType="number"
                        :formMeta="{ ...meta, }" 
                        :rules="deductionValidation"
                        precision="11"
                        scale="2">
                    </fs-input>

                    <fs-input v-else type="fsTextInput" label="Deduction Percent" name="Deduction Percent"
                        inputType="number"
                        :formMeta="{ ...meta, }" 
                        :rules="deductionValidation"
                        :minvalue="deductionValidation.between.min"
                        :maxvalue="deductionValidation.between.max"
                        :precision="deductionValidation.precisionAndScale.precision"
                        :scale="deductionValidation.precisionAndScale.scale">
                    </fs-input>      
 
                </VeeForm>
            </fs-container>
        </div>
    </fs-sidebar>
</template>