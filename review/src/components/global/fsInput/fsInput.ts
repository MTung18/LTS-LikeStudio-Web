import { Field } from 'vee-validate';
import FsDateInput from './fsDateInput/fsDateInput.vue';
import FsTimeInput from './fsTimeInput/fsTimeInput.vue';
import FsTextInput from './fsTextInput/fsTextInput.vue';
import FsPasswordInput from './fsPasswordInput/fsPasswordInput.vue';
import FsMultiselectList from './fsMultiselectList/fsMultiselectList.vue';
import FsSelect from './fsSelect/fsSelect.vue';
import FsCheckboxInput from './fsCheckboxInput/fsCheckboxInput.vue';
import FsTextArea from './fsTextArea/fsTextArea.vue';
import FsCurrencyInput from './fsCurrencyInput/fsCurrencyInput.vue';
import { PropType, computed, defineComponent, ref, nextTick, watch } from 'vue';
import FsNumber from './fsNumber/fsNumber.vue';
import { VueCurrencyConfig } from '@/models/VueCurrencyConfig';
import { CurrencyInputOptions } from 'vue-currency-input';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";

library.add(
  faEyeSlash,
  faEye
)

export default defineComponent({
    name: 'FsInput',
    components: {
        FsCheckboxInput,
        FsDateInput,
        FsMultiselectList,
        FsPasswordInput,
        FsSelect,
        FsTextArea,
        FsTextInput,
        FsTimeInput,
        FsNumber,
        FsCurrencyInput,
        VeeField: Field,
    },
    props: {
        appends: {
            type: Boolean,
            default: false,
        },
        rules: null,
        classname: String,
        modelValue: null, // For any type
        warning: String,
        type: String,
        label: String,
        labelClass: {
            type: String,
            default: 'fs-input__label d-flex align-items-center'
        },
        showClear: Boolean,
        showErrorTooltip: {
            type: Boolean,
            default: false
        },
        vueCurrencyConfig: {
            type: Object as PropType<Partial<VueCurrencyConfig>>,
            default: null
        },
        sensitiveContent: {
            type: Boolean,
            default: false,
        },
        sensitiveMask: null,
    },
    emits: ['tag', 'update:modelValue', 'clearValuePressed'],
    //Note:  clearValuePressed is emiited from fsMultiSelect via $parent
    setup(props, { attrs, emit }) {
        const vueCurrencyConfig: VueCurrencyConfig = new VueCurrencyConfig(props.vueCurrencyConfig);
        const config: CurrencyInputOptions = vueCurrencyConfig as CurrencyInputOptions;
        
        const showSensitiveContent = ref(false);
        
        const myValue = computed({
            // getter
            get() { 
                if(props.sensitiveContent)
                {
                    if(localShowSensitiveContent.value)
                    {   
                        return props.modelValue;
                    }
                    else
                    {
                        //In case the modelValue is empty, don't mask it, so it's properly validated
                        if(props.modelValue && props.modelValue !== "")
                        {                            
                            return props.sensitiveMask;
                        }
                        else
                        {                            
                            return props.modelValue;
                        }
                    }
                }
                else return props.modelValue;
            },
            // setter
            set(newValue) {
                //the value is set in the parent component only when the mask is revealed   
                if(props.sensitiveContent)
                {
                    if(showSensitiveContent.value) 
                    {
                        emit('update:modelValue', newValue);  
                    }
                }   
                else 
                {
                    emit('update:modelValue', newValue);  
                }   
            }
        });

        const localShowSensitiveContent = ref(false);

        watch(() => showSensitiveContent.value, (newValue) =>{
            //in case the component is fsDateInput and showSensitiveContent is false, it will change the input type from date to text 
            //using the 'nextTick' it assures the component now accepts strings instead of the date type
            nextTick( () => { localShowSensitiveContent.value = newValue });
        });

        const onTag = async ($event: any): Promise<void> => {
            emit('tag', $event);
        }

        const validateOnMount = ref(false); // vee-validate default : false
        const validateOnInput = ref(true); // vee-validate default : false
        const validateOnChange = ref(false); // vee-validate default : true
        const validateOnBlur = ref(true); // vee-validate default: true
        const validateOnModelUpdate = computed(() => {
            return props.type === 'fsMultiselectList' // vee-validate default: true
        });

        return {
            config,
            myValue,
            attrs,
            onTag,
            validateOnMount, validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate,
            localShowSensitiveContent,
            showSensitiveContent
        };
    }
})
