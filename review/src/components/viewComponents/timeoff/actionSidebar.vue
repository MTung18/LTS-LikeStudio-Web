<script setup lang="ts">
import { defineProps } from "vue";
import { Request } from "@/models/timeoff/Request";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faX, faCheck } from "@fortawesome/pro-light-svg-icons";
interface Props {
    isShowSidebar?: boolean;
    selectedRows?: Partial<Request>[];
}

library.add(faX, faCheck);

const props = defineProps<Props>();

const enum EmitNames {
    CLOSE = "closeSidebar",
    APPROVE_REQUEST = "approveRequest",
    REJECT_REQUEST = "rejectRequest",
}

const onClose = () => {
    emit(EmitNames.CLOSE);
};

const onApprove = () => {
    emit(EmitNames.APPROVE_REQUEST)
}

const onReject = () => {
    emit(EmitNames.REJECT_REQUEST)
}

const emit = defineEmits<{
    (e: EmitNames, param?: number): void;
}>();
</script>

<template>
    <fs-sidebar right :shadow="true" :visible="props.isShowSidebar" no-close-on-esc no-header-close no-close-on-backdrop>
        <template #title>
            <div class="mr-3 d-flex align-items-center">
                <div class="h5 pl-2 my-auto fw-bold">
                    Actions
                </div>
                <div class="ms-auto">
                    <fs-link class="text-secondary" tag="a" @click="onClose">
                        <font-awesome-icon :icon="['fal', 'times']" size="lg"></font-awesome-icon>
                    </fs-link>
                </div>
            </div>
        </template>

        <h5 class="px-3 text-secondary">
            {{
                `${props.selectedRows.length} item${props.selectedRows.length > 1 ? `s are` : ` is`
                } selected`
            }}
        </h5>

        <div class="px-3 mt-4">
            <div class="cursor-pointer d-flex align-items-center px-4 py-3 bg-white border" @click="onApprove">
                <font-awesome-icon :icon="['fal', 'check']" size="lg" class="me-2" />
                <h5 class="mb-0">Aprrove</h5>
            </div>
            <div class="cursor-pointer d-flex align-items-center px-4 py-3 bg-white border" @click="onReject">
                <font-awesome-icon :icon="['fal', 'x']" size="lg" class="me-2" />
                <h5 class="mb-0">Reject</h5>
            </div>
        </div>
        <div>
      </div>

    </fs-sidebar>
</template>

<style lang="scss" scoped>
:deep(.fs-sidebar) {
    top: 44px;
    height: calc(100vh - 44px);
    width: 300px;
    background-color: #fff;
}

:deep(.b-sidebar-header) {
    padding: 16px;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), #e1e4e8;
}

.label {
    font-weight: 700;
    font-size: 14px;
    line-height: 150%;
}

.content_text {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
}

.warning-zone {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), #ff2a2a;
    padding: 12px 10px;
    border: 1px dashed #ff2a2a;
    border-radius: 6px;

}
</style>
