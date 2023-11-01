import { localize } from '@vee-validate/i18n';
import en from '@vee-validate/i18n/dist/locale/en.json';
import AllRules from '@vee-validate/rules';
import { configure, defineRule, ErrorMessage, Field as VeeField, Form as VeeForm } from 'vee-validate';
import { App } from 'vue';
import { defineAddressRules } from './addressRules';
import { defineDateTimeRules } from './dateTimeRules';
import { defineMiscRules } from './miscRules';
import { defineNumericRules } from './numericRules';
import { configurePhqRuleMessages } from './phqRuleMessages';

export const veeValidatePlugin = {
	install: (app: App) => {
		// Add global components
		app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

		// Installing all global rules from VeeValidate for now
		// https://vee-validate.logaretm.com/v4/guide/global-validators#vee-validaterules

		// Available rules in the package
		// https://vee-validate.logaretm.com/v4/guide/global-validators#available-rules
		Object.keys(AllRules).forEach((rule) => {
			defineRule(rule, AllRules[rule]);
		});

		// Configure default messages for all global rules
		// https://vee-validate.logaretm.com/v4/guide/i18n#using-vee-validatei18n
		configure({
			generateMessage: localize({
				en,
			}),
		});

		configurePhqRuleMessages();

		// Custom Rules
		// https://vee-validate.logaretm.com/v4/guide/global-validators#defining-global-validators
		defineAddressRules();
		defineDateTimeRules();
		defineMiscRules();
		defineNumericRules();
	}
}
