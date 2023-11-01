import { defineRule } from 'vee-validate';

export function defineMiscRules() {
  // https://vee-validate.logaretm.com/v4/guide/global-validators#defining-global-validators
  defineRule('boolean', (value: any, ctx: any) => {
    return value === true || value === false;
  });

  defineRule('passwordMatch', (value: any, ctx: any) => {
    if (!ctx.verify) {
      return true;
    }
    return value === ctx.verify;
  });

  defineRule('accountNumberMatch', (value: any, ctx: any) => {
    if (!ctx.verify) {
      return true;
    }
    if (+value === +ctx.verify)
      return true;
    else
      return 'Account Number did not match';
  });

  defineRule('dropdownRequired', (value: any, ctx: any) => {
    const message: string = 'Field is required.'
    if (!ctx.required) {
      return true;
    }
    if (!value) { // need to specify this, or validator will throw an error
      return message;
    }
    if (!isNaN(value)) {
      return !!value ? true : message;
    }
    if (!!value[ctx.trackByValue] && !!value[ctx.displayProperty]) {
      return true;
    }
    return message;
  });

  defineRule('no_duplicate_newitem', (value: any, ctx: any) => {
    if (!value) {
      return true
    }
    if ((ctx.originalValue && value?.trim().toLowerCase() === ctx.originalValue?.trim().toLowerCase()) ||
      ctx.arrayOfObjects?.filter((obj: any) => obj[ctx.fieldInObjectToCheck]?.trim().toLowerCase() === value?.trim().toLowerCase()).length === 0) {
      return true;
    }
    return ctx.message;
  });

  defineRule('no_duplicate_existingitem', (value: any, ctx: any) => {
    if (!value) {
      return true
    }
    if (ctx.arrayOfObjects.filter((obj: any) => obj[ctx.fieldInObjectToCheck].trim().toLowerCase() === value.trim().toLowerCase()).length === 1) {
      return true;
    }
    return ctx.message;
  });

  defineRule('no_duplicate_strings', (value: any, ctx: any) => {
    if (!value) {
      return true
    }
    if (!(ctx.list as string[])?.some((item: string): boolean => item?.trim().toLowerCase() === value?.trim().toLowerCase())) {
      return true
    }
    return `${ctx.duplicateType ? ctx.duplicateType : 'Value'} already exists`
  });

  defineRule('no_duplicate_existingstring', (value: any, ctx: any) => {
    if (!value) {
      return true
    }
    if (ctx.arrayOfStrings.filter((s: string) => s.trim().toLowerCase() === value.trim().toLowerCase()).length == 0) {
      return true;
    }
    return ctx.message;
  });

  defineRule('no_duplicate_changeorders', (value: any, ctx: any) => {
    if (!value) {
      return true
    }
    const valid: boolean = !(ctx.list?.some((item: any) => {
      return item.itemNumber?.trim()?.toLowerCase() === ctx.line.itemNumber?.trim()?.toLowerCase()
        && item.changeDate === ctx.line.changeDate
        && item.aiaApplicationLineGuid !== ctx.line.aiaApplicationLineGuid
    }));
    return valid ? valid : 'Duplicate Change Order line';
  });

  defineRule('no_duplicate_number', (value: any, ctx: any) => {
    if (!value) {
      return true
    }
    if (ctx.arrayOfObjects.filter((obj: any) => obj[ctx.fieldInObjectToCheck] === value).length == 0) {
      return true;
    }
    return ctx.message;
  });

  defineRule('allow_decimal', (value: any, ctx: any) => {
    if (!value) {
      return true
    }
    if (ctx.arrayOfObjects.filter((obj: any) => obj[ctx.fieldInObjectToCheck] === value).length == 0) {
      return true;
    }
    return ctx.message;
  });

}
