import { DATE_REGEX } from '@/constants/regex';
import { attemptFormatDate, dateCreatedIsValid } from '@/functions/DateUtilityFunctions';
import { checkDateSequence } from '@/functions/ValidationUtilityFunctions';
import { defineRule } from 'vee-validate';
import moment from 'moment';

function formatDisplayDate(date: string | Date): string {
  return date instanceof Date
    ? date.toLocaleDateString("en-US")
    : date;
}

export function defineDateTimeRules() {
  // https://vee-validate.logaretm.com/v4/guide/global-validators#defining-global-validators
  defineRule('date', function (value: string): any {
    if (!value || !value.length) {
      return true;
    }
    return DATE_REGEX.test(value);
  });

  defineRule('onOrAfterToday', function (value: string): any {
    const date = new Date();
    date.setDate(date.getDate());
    const formattedDate = date.toISOString().slice(0, 10);

    if (value >= formattedDate) {
      return true;
    } else {
      return false;
    }
  });

  defineRule('beforeToday', function (value: string): any {
    const date = new Date();
    date.setDate(date.getDate());
    const formattedDate = date.toISOString().slice(0, 10);

    if (value < formattedDate) {
      return true;
    } else {
      return false;
    }
  });

  defineRule('afterToday', function (value: string): any {
    const date = new Date();
    date.setDate(date.getDate());
    const formattedDate = date.toISOString().slice(0, 10);

    if (value > formattedDate) {
      return true;
    } else {
      return false;
    }
  });

  defineRule('date_valid', (value: string | Date) => {
    if (!value) {
      return true;
    }
    let dateString = "";
    if (value instanceof Date) {
      dateString = value.toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: 'numeric' });
    } else {
      dateString = attemptFormatDate(value);
    }
    if (dateCreatedIsValid(dateString)) {
      return true;
    }
    return `This is an invalid date. Please re-enter the date in a valid format.`;
  });

  defineRule('dateBeforeTarget', (value: any, [targetValue, targetLabel]: any, ctx: any) => {
    if (!value || !ctx.form[targetValue]) {
      return true;
    }
    if (checkDateSequence(value, ctx.form[targetValue])) {
      return true;
    }
    return targetLabel
      ? `${ctx.field} must be before ${targetLabel}`
      : `${ctx.field} must be ${formatDisplayDate(ctx.form[targetValue])} or earlier`;
  });

  defineRule('dateAfterTarget', (value: any, [targetValue, targetLabel]: any, ctx: any) => {
    if (!value || !ctx.form[targetValue]) {
      return true;
    }
    if (checkDateSequence(ctx.form[targetValue], value)) {
      return true;
    }
    return targetLabel
      ? `${ctx.field} must be after ${targetLabel}`
      : `${ctx.field} must be ${formatDisplayDate(ctx.form[targetValue])} or later`;
  });

  defineRule('dateBeforeOrEqualTarget', (value: any, [targetValue, targetLabel]: any, ctx: any) => {
    if (!value || !ctx.form[targetValue]) {
      return true;
    }

    if (new Date(value) <= new Date(ctx.form[targetValue])) {
      return true
    }
    return targetLabel
      ? `${ctx.field} must be before or equal ${targetLabel}`
      : `${ctx.field} must be ${formatDisplayDate(ctx.form[targetValue])} or earlier`;
  });

  defineRule('dateAfterOrEqualTarget', (value: any, [targetValue, targetLabel]: any, ctx: any) => {
    if (!value || !ctx.form[targetValue]) {
      return true;
    }
    if (new Date(value) >= new Date(ctx.form[targetValue])) {
      return true
    }
    return targetLabel
      ? `${ctx.field} must be after or equal ${targetLabel}`
      : `${ctx.field} must be ${formatDisplayDate(ctx.form[targetValue])} or later`;
  });

  defineRule('dateIsAfter', (value: any, [targetValue]: any, ctx: any) => {
    const minValue: any = targetValue || ctx.minimumDate;
    if (!value || !minValue) {
      return true;
    }
    if (new Date(value) >= new Date(minValue)) {
      return true;
    }
    return `The date must be greater than ${formatDisplayDate(minValue)}`;
  });

  defineRule('date_is_less_than_or_equal', (value: any, ctx: any) => {
    if (ctx.endDateRequired && !ctx.endDate) {
      return ctx.message ?? false;
    }
    if (!value || !ctx.endDate) {
      return true;
    }
    if (moment(value).isSameOrBefore(moment(ctx.endDate))) {
      return true;
    }
    return ctx.message
  });

  defineRule('timeBeforeTarget', (value: any, [targetValue, targetLabel]: any, ctx: any) => {
    if (!value
      || !ctx.form[targetValue]
      || !(value instanceof Date)
      || !(ctx.form[targetValue] instanceof Date)
    ) {
      return true;
    }
    if ((value as Date).getTime() <= (ctx.form[targetValue] as Date).getTime()) {
      return true;
    }
    return targetLabel
      ? `${ctx.field} must be before ${targetLabel}`
      : `${ctx.field} must be ${ctx.form[targetValue].getTime()} or earlier`;
  });

  defineRule('timeAfterTarget', (value: any, [targetValue, targetLabel]: any, ctx: any) => {
    if (!value
      || !ctx.form[targetValue]
      || !(value instanceof Date)
      || !(ctx.form[targetValue] instanceof Date)
    ) {
      return true;
    }
    if ((value as Date).getTime() >= (ctx.form[targetValue] as Date).getTime()) {
      return true;
    }
    return targetLabel
      ? `${ctx.field} must be before ${targetLabel}`
      : `${ctx.field} must be ${ctx.form[targetValue].getTime()} or later`;
  });

  defineRule('validTime', (value: any, ctx: any) => {
    if (!value) {
      return true;
    }
    // Usage of this rule is unclear from the current state of the app
    // the element that references it is commented out and the original rule took in a simple boolean of "valid"
    // it should be updated with some sort of validation here or removed
    return 'Please enter a valid time.';
  });
}
