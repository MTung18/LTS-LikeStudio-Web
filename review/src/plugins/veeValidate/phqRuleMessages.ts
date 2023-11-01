import { localize } from '@vee-validate/i18n';
import { configure } from 'vee-validate';

export function configurePhqRuleMessages() {
  // https://vee-validate.logaretm.com/v4/guide/i18n#using-vee-validatei18n
  configure({
    generateMessage: localize({
      en: {
        messages: {
          required: 'Field is required.',
          between: (ctx: any): string => {
            const min = ctx.rule.params?.min;
            const max = ctx.rule.params?.max;
            const maxMessage = ctx.rule.params?.maxMessage;
            const minMessage = ctx.rule.params?.minMessage;
            const value = ctx.value;
            if (maxMessage?.toString() != '' || minMessage?.toString() != '' ) {
              if (value < min) {
                return minMessage;
              }
              if (value > max) {
                return maxMessage;
              }
            }
            if ((min || min === 0) && (max || max === 0)) {
              return `The value must be between ${min} and ${max}`;
            }
            return `The value is out of valid range`;
          },
          numeric: ctx => `${ctx.field} Please specify a number`,
          integer: ctx => `${ctx.field} must be an integer`,
          is: 'Fields must match.',
          confirmed: ctx => `${ctx.field} does not match`,
          min: ctx => `${ctx.field} should be at least ${ctx.rule.params[0]} characters`,
          min_value: ctx => `${ctx.field} must not be less than ${ctx.rule.params[0]}`,
          email: `e.g. name@example.com`,
          max: ctx => `Max character limit is ${ctx.rule.params[0]}`,
          length: (ctx) => `Please keep it to be only ${ctx.rule.params[0]} character${ctx.rule.params[0] > 1 ? 's' : ''}`,
          date: `Invalid Date`,
          onOrAfterToday: `Date must be on or after today`,
          beforeToday: `Date must be before today`,
          afterToday: `Date must be after today`,
          ssn: `e.g. 000-00-0000`,
          phoneNumber: `e.g. (000)-000-0000`,
          regex: ctx => `The ${ctx.field} field format is invalid`,
        },
        fields: {
          // Delay Logs
          startTime: {
            timeBeforeTarget: 'Start Time must be before End Time',
          },
          endTime: {
            timeAfterTarget: 'End Time must be after Start Time',
          },
          // Material Logs
          quantity: {
            min_value: 'Quantity must be between 0 and 100,000,000.00',
            decimal: 'Quantity must be a number with no more than two decimals',
            max_value: 'Quantity must be between 0 and 100,000,000.00',
          },
          // Labor Logs
          hours: {
            min_value: 'Hours must be between 0 and 24',
            decimal: 'Hours must be a number with no more than two decimals',
            max_value: 'Hours must be between 0 and 24',
          },
          // Equipment Logs
          operatingHours: {
            min_value: 'Operating Hours must be between 0 and 24',
            decimal: 'Operating Hours must be a number with no more than two decimals',
            max_value: 'Operating Hours must be between 0 and 24',
          },
          meter: {
            min_value: 'Meter/Mileage must be between 0 and 10,000,000',
            decimal: 'Meter/Mileage must be a number with no more than three decimals',
            max_value: 'Meter/Mileage must be between 0 and 10,000,000',
          },
          // Weather Logs
          humidity: {
            min_value: 'Humidity must be between 0 and 100',
            decimal: 'Humidity must be a whole number',
            max_value: 'Humidity must be between 0 and 100',
          },
          temperature: {
            min_value: 'Temperature must be between -80 and 160',
            decimal: 'Temperature must be a whole number',
            max_value: 'Temperature must be between -80 and 160',
          },
          windSpeed: {
            min_value: 'Wind Speed must be between 0 and 200',
            decimal: 'Wind Speed must be a whole number',
            max_value: 'Wind Speed must be between 0 and 200',
          },
          // Manpower Logs
          totalhours: {
            min_value: 'Hours must be between 0 and 999.99',
            decimal: 'Hours must be a number with no more than two decimals',
            max_value: 'Hours must be between 0 and 999.99',
          },
          // Manage Accounts
          distributionAmount: {
            min_value: 'Number is too low and must be re-entered',
            decimal: 'Number should be limited to two decimal places',
            max_value: 'Number is too high and must be re-entered',
          },
          // Manage Accounts
          distributionPercent: {
            min_value: 'Number must be greater than or equal to 0.00%',
            decimal: 'Number should be limited to two decimal places',
            max_value: 'Number must be less than or equal to 100.00%',
          },
          // Visitor Logs
          contact: {
            required: 'Either Contact or Other Name must have a value',
          },
          otherName: {
            required: 'Either Contact or Other Name must have a value',
          },
          arrivalTime: {
            timeBeforeTarget: 'Arrival Time must be before Departure Time',
          },
          departureTime: {
            timeAfterTarget: 'Departure Time must be after Arrival Time',
          },
          // General
          email: {
            regex: 'e.g. name@example.com',
            boolean: 'Email already exists or is pending confirmation. Please enter a unique email.',
            uniqueEmail: 'Email already exists or is pending confirmation. Please enter a unique email.',
          },
          phoneNumber: {
            regex: 'e.g. (000) 000-0000',
            required: 'Enter Phone Number.',
          },
          // Project
          startDate: {
            dateBeforeTarget: 'Start Date must be before Finish Date',
          },
          finishDate: {
            dateAfterTarget: 'Finish Date must be after Start Date',
          },
          // Submittal
          dateSentReceived: {
            dateBeforeTarget: 'Sent/Received Date must be before Respond By Date',
          },
          respondByDate: {
            dateAfterTarget: 'Respond By Date must be after Sent/Received Date',
          },
          // Person
          firstName: {
            regex: 'First Name must not contain any of the following characters: \\ / : ? * " | < >',
          },
          lastName: {
            regex: 'Last Name must not contain any of the following characters: \\ / : ? * " | < >',
          },
          suffix: {
            regex: 'Suffix must not contain any of the following characters: \\ / : ? * " | < >',
          },
          // Custom Fields
          customFieldLabel: {
            excluded: 'This name was already used for a custom field label. If you deleted this field you must permanently delete it in the recycle bin to use its name.',
            no_duplicate_strings: 'Field Name already exists',
          },
          customFieldDropdownValue: {
            no_duplicate_strings: 'This dropdown value already exists.',
          },
          customFieldDropdownValueName: {
            no_duplicate_strings: 'This dropdown value already exists.',
          },
          lookupOptions: {
            required: 'Dropdown must have at least one value.',
            no_duplicate_strings: 'Value already exists',
          },
          activeOptions: {
            required: 'Dropdowns must have at least one active value.',
          },
          maxValue: {
            maxTarget: 'Maximum Value must be greater than Minimum Value',
          },
          minValue: {
            minTarget: 'Minimum Value must be less than Maximum Value',
          },
          // Email
          to: {
            badToAddress: 'Deactivated email address.',
          },
          cc: {
            badCcAddress: 'Deactivated email address',
          },
          // RFI / Submittal
          rfiNumber: {
            no_duplicate_strings: 'RFI Number already exists',
          },
          title: {
            regex: 'Title must not contain any of the following characters: \\ / : ? * " | < >',
          },
          // Company
          name: {
            regex: 'Name must not contain any of the following characters: \\ / : ? * " | < >',
          },
          // Report
          toDate: {
            dateAfterTarget: 'To Date must be after From Date.',
          },
          fromDate: {
            dateBeforeTarget: 'From Date must be before To Date.',
          },
          toDueDate: {
            dateAfterTarget: 'To Due Date must be after From Due Date.',
          },
          fromDueDate: {
            dateBeforeTarget: 'From Due Date must be before To Due Date.',
          },
          sentReceivedToDate: {
            dateAfterTarget: 'To Date must be after From Date.',
          },
          sentReceivedFromDate: {
            dateBeforeTarget: 'From Date must be before To Date.',
          },
          replyByToDate: {
            dateAfterTarget: 'To Date must be after From Date.',
          },
          replyByFromDate: {
            dateBeforeTarget: 'From Date must be before To Date.',
          },
          respondByToDate: {
            dateAfterTarget: 'Respond By To Date must be after From Date.',
          },
          respondByFromDate: {
            dateBeforeTarget: 'Respond By From Date must be before To Date.',
          },
          // Lookup
          lookupName: {
            no_duplicate_strings: 'Value already exists',
          },
          lookupNumber: {
            no_duplicate_strings: 'Value already exists',
            regex: 'Quotation marks, tildes, backticks, and pipes are not allowed.',
          },
          // Password
          password: {
            passwordMatch: 'Passwords must match.',
          },
          // RFC
          'RFC Number': {
            no_duplicate_strings: 'RFC Number already exists',
          },
          scheduleImpact: {
            max_value: 'The value must be between 0 and 2,147,483,647',
          },
          extendedCost: {
            is: 'Must match Budget distribution totals',
          },
          extendedPrice: {
            is: 'Must match Budget bid totals',
          },
          'Change Order Number': {
            no_duplicate_strings: 'Change Order Number already exists',
          },
          // Action Items
          'Item Number': {
            no_duplicate_strings: 'Item Number already exists',
          },
          // Aia Application Line
          aiaItemNumber: {
            no_duplicate_strings: 'Item No already exists',
          },
          ssn: {
            regex: 'e.g. 000-00-0000'
          },
          zipCode: {
            regex: 'e.g. 12345 or 12345-6789'
          }
        },
      },
    }),
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true,
  });
}
