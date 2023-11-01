import { defineRule } from 'vee-validate';

export function defineNumericRules() {
  // https://vee-validate.logaretm.com/v4/guide/global-validators#defining-global-validators
  defineRule('precisionAndScale', (value: any, ctx: any) => {
    if (value === null
      || value === undefined
      || value === '') {
      return true;
    }

    let decimalRegex: string;
    if (ctx.scale === 0) {
      decimalRegex = `^-?[\\d]\{0,${ctx.precision}\}$`;
    } else {
      decimalRegex = `^-?[\\d]\{0,${ctx.precision - ctx.scale}\}([.][\\d]\{0,${ctx.scale}\})?$`;
    }
    const decimalExpressionTester: RegExp = new RegExp(decimalRegex);
    if (decimalExpressionTester.test(value.toString())) {
      return true;
    }
    if (value && ctx.precisionMesage?.length > 0) {
      const splitValue = value.toString().split(".");
      if (splitValue && splitValue.length > 0) {
        const precisionValue = splitValue[0];
        if (precisionValue && precisionValue.length > (ctx.precision - ctx.scale)) {
          return ctx.precisionMesage;
        }
      }
    }
    return ctx.message ?? `Invalid Format.`;
  });

  // The consumption pattern of this rule should be updated to only include this rule when needed
  defineRule('NumberNonZero', (value: any, ctx: any) => {
    if (ctx.required === false || (value && value !== 0)) {
      return true;
    }

    return 'Field is required.'
  });

  // This could be replaced with the "not_one_of" rule from VeeValidate
  defineRule('uniqueNumber', (value: any, ctx: any) => {
    return ctx.numberIsDuplicate
      ? `${value} already exists.`
      : true;
  });

  // This could be replaced with the "is" rule from VeeValidate
  // The consumption pattern of this rule should be updated to only include this rule when needed
  defineRule('number_is_equal', (value: any, ctx: any) => {
    if (value === null
      || value === ''
      || value === undefined
      || ctx.runEqualityCheck === false
    ) {
      return true;
    }

    return value === ctx ? true : ctx.message ?? false;
  });

  // This could be replaced with the "max_value" rule from VeeValidate
  // The consumption pattern of this rule should be updated to only include this rule when needed
  defineRule('number_is_less_than', (value: any, ctx: any) => {
    if (value === null
      || value === ''
      || value === undefined
      || ctx.enforce === false) {
      return true;
    }

    return value < ctx.number ? true : ctx.message ?? false;
  });
}
