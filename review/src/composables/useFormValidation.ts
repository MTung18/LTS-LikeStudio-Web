import { FormContext, FormValidationResult } from 'vee-validate';
import { Ref, ref } from 'vue';

export class CustomFormValidation {
    formValidationResult: FormValidationResult<any> = { valid: false } as FormValidationResult<any>;
    hasValidated: boolean = false;
}
export interface CustomFormValidationResult {
    [key: string]: CustomFormValidation;
}
export const DEFAULT_OBSERVER_NAME: string = 'observer';

// tslint:disable-next-line: typedef
export function useFormValidation(overrideForms: string | string[] = DEFAULT_OBSERVER_NAME) {

    const form: Ref<CustomFormValidationResult> = ref({});

    // Initially form value based on overrideForms
    if (typeof overrideForms === 'string') {
        form.value[overrideForms] = new CustomFormValidation();
    } else {
        [...overrideForms].forEach((formName: string) => {
            form.value[formName] = new CustomFormValidation();
        });
    }

    async function validateForm($refs: any, refName: string = DEFAULT_OBSERVER_NAME): Promise<FormValidationResult<any>> {
        if (!form.value[refName]) {
            form.value[refName] = new CustomFormValidation();
        }
        form.value[refName].hasValidated = true;
        const result: FormValidationResult<any> = await ($refs[refName] as FormContext)?.validate();
        form.value[refName].formValidationResult = result;
        return result;
    }

    function resetForm($refs: any, formValues: any = null, refName: string = DEFAULT_OBSERVER_NAME): void {
        if (!form.value[refName]) {
            form.value[refName] = new CustomFormValidation();
        }
        form.value[refName].hasValidated = false;
        if (formValues) {
            ($refs[refName] as FormContext)?.resetForm({ values: formValues });
        } else {
            ($refs[refName] as FormContext)?.resetForm();
        }
        form.value[refName].formValidationResult = { valid: false } as FormValidationResult<any>;
    }

    function resetHasValidated(refName: string = DEFAULT_OBSERVER_NAME): void {
        if (!form.value[refName]) {
            form.value[refName] = new CustomFormValidation();
        }
        form.value[refName].hasValidated = false;
        form.value[refName].formValidationResult = { valid: false } as FormValidationResult<any>;
    }

    function formHasValidated(refName: string = DEFAULT_OBSERVER_NAME): boolean {
        return form.value[refName]?.hasValidated;
    }

    function formValidationResult(refName: string = DEFAULT_OBSERVER_NAME): FormValidationResult<any> {
        return form.value[refName]?.formValidationResult;
    }

    return {
        form,
        formHasValidated,
        formValidationResult,
        resetForm,
        resetHasValidated,
        validateForm
    };

}