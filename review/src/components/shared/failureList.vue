<script setup lang="ts">
import { FailureItem } from "@/models/error/failureItem";
import { computed } from "vue";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faExclamationTriangle);

interface Props {
    showModal: boolean,
    title: string,
    warning: string,
    descriptionName: string,
    failures: FailureItem[],
    pageTitle?: string,
    showPrintView?: boolean,
    failureClass?: string,
    iconClass?: string
}

const props = withDefaults(defineProps<Props>(), {
    showModal: false,
    title: '',
    pageTitle: '',
    warning: '',
    descriptionName: '',
    showPrintView: false,
    failureClass: '',
    iconClass: ''
});

const enum EmitNames {
    OK = "OK",
    CANCEL = "CANCEL",
    MODEL = "update:showModal"
}

const emits = defineEmits<{
    (e: EmitNames.OK): void;
    (e: EmitNames.CANCEL): void;
    (e: EmitNames.MODEL, value: boolean): void;
}>();


const showModal = computed({
    get() {
        return (props.showModal);
    },
    set(value) {
        emits(EmitNames.MODEL, value);
    },
});

function onOKButtonClick() {
    emits(EmitNames.OK);
}

function loadPrint(): void {
    const printTable: any = document.getElementById('failure_table');
    const newWin: any = window.open('');
    newWin.document.write('<style>table{font-family:arial,sans-serif;border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;text-align:left;padding:8px}th{background-color:#ddd}tr:nth-child(odd){background-color:#e7e7e782}</style>');
    newWin.document.write(printTable.outerHTML);
    newWin.print();
    newWin.close();
}

const tableFields: any[] = [
    {
        key: 'failureTitle',
        label: props.descriptionName,
        thClass: `list__th`,
        tdClass: `list__td list__td--50`,
    },
    {
        key: 'failureReason',
        label: 'Failed Reason',
        thClass: `list__th`,
        tdClass: `list__td list__td--50`,
    }];

</script>
<template>
    <fs-modal v-model="showModal" centered content-class="phq-modal" header-class="phq-modal__header"
        title-class="phq-modal__title" body-class="phq-modal__body" footer-class="phq-modal__footer"
        header-text-variant="light" header-bg-variant="blue--dk" :lazy="true" hide-header-close no-close-on-backdrop
        no-close-on-esc @ok="onOKButtonClick()" :title="title">
        <slot v-if="failures.length > 0">
            <div id="error_list" class="popup_fl">
                <div :class="failureClass">
                    <div v-if="showPrintView">
                        <span @click="loadPrint" class="text--14"><span
                                class="fal fa-print pad-right--10 pop_up_print"></span></span>
                    </div>
                    <fs-row class="popup_warning mb-2" v-if="warning.length > 0">
                        <fs-col cols="1" class="icon">
                            <font-awesome-icon class="text-warning me-2"
                                :icon="['fa', 'exclamation-triangle']"></font-awesome-icon>
                        </fs-col>
                        <fs-col class="text">
                            <span v-html="warning"></span>
                        </fs-col>
                    </fs-row>
                    <fs-table responsive id="failure_table" ref="failureTable" show-empty small
                        thead-tr-class="list__tr list__tr--thead" tbody-tr-class="list__tr list__tr--tbody"
                        :items="failures" :fields="tableFields">
                        <template #cell(failureTitle)="data">
                            <i :title="pageTitle" :class="iconClass"></i>
                            {{ data.value }}
                        </template>
                        <template #cell(failureReason)="data">
                            {{ data.value }}
                        </template>
                    </fs-table>
                </div>
            </div>
        </slot>
        <slot v-else name="custom"></slot>
        <template v-slot:modal-footer="slotProps">
            <fs-button variant="primary" @click="slotProps.ok">Close</fs-button>
        </template>
    </fs-modal>
</template>
<style lang="scss" scoped>
.popup_fl {
    table {
        width: 100%;
        border-spacing: 0;
        border-collapse: separate;
    }

    table tr:last-child td:last-child {
        border-bottom-right-radius: 10px;
    }

    table tr:last-child td:first-child {
        border-bottom-left-radius: 10px;
    }

    table tr:first-child th:first-child,
    table tr:first-child td:first-child {
        border-top-left-radius: 10px
    }

    table tr:first-child th:last-child,
    table tr:first-child td:last-child {
        border-top-right-radius: 10px
    }

    tbody tr {
        td:first-child {
            border-left: 1px solid #dee2e6;
        }

        td:last-child {
            border-right: 1px solid #dee2e6;
        }
    }

    tbody tr:last-child {
        td {
            border-bottom: 1px solid #dee2e6;
        }
    }

    .table th,
    .table td {
        padding: 1rem !important;
    }

    .text-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .popup-title-icon {
        color: #1ABC9C;
    }

    .pop_up_print {
        position: absolute;
        right: 20px;
        padding: 0.2rem;
        position: absolute !important;
        cursor: pointer;
    }

    .popup_warning {
        vertical-align: middle;
        align-items: center;
        display: flex;
        font-size: 13px;

        .icon {
            display: flex;
            justify-content: center;
            font-size: 20px;
            align-items: center;
        }

        .text {
            font-size: 15px;
        }
    }

}
</style>