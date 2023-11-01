import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { faAsterisk, faCheckSquare, faTimesCircle, faCheck, faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import _ from 'lodash';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { defineComponent, PropType } from 'vue';
import Multiselect from 'vue-multiselect';

library.add(
    faAsterisk as IconDefinition,
    faTimesCircle as IconDefinition,
    faCheck as IconDefinition,
    faCheckSquare as IconDefinition,
    faInfoCircle as IconDefinition,
    faTimes as IconDefinition,
);

export default defineComponent({
    name: 'FsMultiselectList',
    components: {
        Multiselect
    },
    props:
    {
        id: String,
        placeholder: String,
        type: {
            type: String,
            default: 'list'
        },
        typeaheaddata: {
            type: [Array],
        },
        typeaheadkey: String,
        typeaheadvalueattribute: String,
        showCheck: {
            type: Boolean,
            default: true
        },
        selectedValue: null,
        customLabel: {
            type: Function
        },
        sublabel: String,
        disabled: Boolean,
        showClear: Boolean,
        defaultEmptyValue: {
            default: null
        },
        multiple: Boolean,
        taggable: Boolean,
        tagPlaceholder: {
            type: String,
            default: 'Press enter to create'
        },
        closeOnSelect: {
            type: Boolean,
            default: true
        },
        isTagError: {
            type: Function,
            default: (_value: any): boolean => false
        },
        isTagErrorAlt: {
            type: Function,
            default: (_value: any): boolean => false
        },
        tagErrorOnlyOnSelected: {
            type: Boolean,
            default: false
        },
        modelValue: {
            type: [Array, Object],
        },
        errorBag: {
            type: Array as PropType<string[]>,
            default: (): string[] => []
        }
    },
    data() {
        return {
            myValue: [] as any
        }
    },
    computed: {
        showClearButton(): boolean {
            const isEmpty: boolean = this.myValue === undefined || this.myValue === null || this.myValue?.length === 0;
            let isEmptyListItem: boolean = false;
            if (this.typeaheaddata && this.typeaheadkey) {
                const emptyOption: object = _.find(this.typeaheaddata, (option: any) => {
                    return (option && option[this.typeaheadkey] && option[this.typeaheadkey].trim && option[this.typeaheadkey].trim() === '');
                });
                isEmptyListItem = (this.myValue && emptyOption) ? (this.myValue[this.typeaheadvalueattribute] === emptyOption[this.typeaheadvalueattribute]) : false;
            }
            return (!isEmpty && !isEmptyListItem) && this.showClear === true && !this.disabled;
        }
    },
    emits: ['update:modelValue', 'select', 'blur', 'createNew','remove'],
    watch: {
        modelValue: {
            async handler(newValue, oldValue) {
                this.myValue = newValue;
            },
            immediate: true, deep: true
        },
        myValue: {
            async handler(newValue, oldValue) {
                this.$emit('update:modelValue', newValue);
            }, deep: true
        }
    },
    mounted(): void {
        if (this.typeaheadvalueattribute && this.selectedValue && this.typeaheadvalueattribute !== '') {
            this.myValue = this.typeaheaddata.find(o => o[this.typeaheadvalueattribute] === this.selectedValue);
        }
    },
    methods: {
        async createNew(newValue: string): Promise<void> {
            this.$emit('createNew', newValue);
        },
        async onSelect(value): Promise<void> {
            this.$emit('select', value);
        },
        async onRemove(value): Promise<void> {
            this.$emit('remove', value);
        },
        multiselectOptionIsSelected(option: any): boolean {
            if (!this.myValue) {
                return false;
            } else if (this.typeaheadvalueattribute && this.typeaheadvalueattribute !== '') {
                return this.myValue[this.typeaheadvalueattribute] === option[this.typeaheadvalueattribute];
            } else if (this.typeaheadkey && this.typeaheadkey !== '') {
                return this.myValue[this.typeaheadkey] === option[this.typeaheadkey] &&
                    this.myValue[this.typeaheadvalueattribute] === option[this.typeaheadvalueattribute];
            } else {
                return this.myValue === option;
            }
        },
        getOptionLabel(option: any, label: string): string {
            if (!option) {
                return '';
            }
            if (!label) {
                return option;
            }
            if (this.customLabel) {
                return this.customLabel ? this.customLabel(option) : '';
            }
            return label ? option[label] : '';
        },
        isInactive(option: object): boolean {
            return option.hasOwnProperty('active') && !option['active'];
        },
        async clearValue(): Promise<void> {
            if (this.type === 'list-multiselect' || this.type === 'pill-multiselect') {
                const selectedDisabled: any[] = (this.myValue as any[]).filter((x: any): boolean => x.$isDisabled && this.multiselectOptionIsSelected(x));
                this.myValue = selectedDisabled || this.defaultEmptyValue;
            } else {
                if (this.type === 'list' || this.type === 'select') {
                    this.$emit('select', this.defaultEmptyValue);
                }
                this.myValue = this.defaultEmptyValue;
            }
            this.$emit('blur');
            // Emit from fsInput level
            if (this.$parent &&
                this.$parent.$parent &&
                this.$parent.$parent.$parent
            ) {
                this.$parent.$parent.$parent.$emit('clearValuePressed');
            }
            event.stopPropagation();
        },
        async onMultiSelectOpen(): Promise<void> {
            // A hack to fix this bug: https://github.com/shentao/vue-multiselect/issues/1201
            const select = this.$refs[('multiselect' + this.id)];
            this.$nextTick(() => {
                if (select.pointer < 0) select.pointerSet(0);
            });
            await this.setMultiselectPointerToSelected();
        },
        async setMultiselectPointerToSelected(): Promise<void> {
            const vueDropdown: any = this.$refs[('multiselect' + this.id)];
            let selectedIndex: number = -1;
            if (this.myValue) {
                selectedIndex = _.findIndex(vueDropdown?.filteredOptions, (option: any) => { return option[this.typeaheadvalueattribute] === this.myValue[this.typeaheadvalueattribute] })
            }
            vueDropdown.pointer = selectedIndex;
        }
    }
})
