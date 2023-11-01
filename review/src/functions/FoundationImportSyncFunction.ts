
import { ExtensiveImportSyncEndpoint, FoundationImportSyncPropertyKey } from "@/models/foundationIntegration/FoundationImportSyncPropertyKey";
import { IntegrationFunction } from "@/enums/IntegrationFunction";

export function getFoundationImportSyncPropertyKey(integrationFunction: IntegrationFunction) {
  switch (integrationFunction) {
    case (IntegrationFunction.AccrualCode):
      return new FoundationImportSyncPropertyKey({ id: "accrualCodeFsNo", name: "accrualCodeName", endpointName: 'accrualcodes', toEncodeProperties: ['accrualCodeName', 'accrualCodeShortName'] });
    case (IntegrationFunction.AccrualPlan):
      return new FoundationImportSyncPropertyKey({ id: "displayName", name: "displayName", endpointName: 'accrualplans', toEncodeProperties: ['accrualPlanName'] });
    case (IntegrationFunction.CostCode):
      return new FoundationImportSyncPropertyKey({ id: "costCodeFsNo", name: "costCodeName", endpointName: 'costcodes', toEncodeProperties: ['costCodeName'] });
    case (IntegrationFunction.Crew):
      return new FoundationImportSyncPropertyKey({ id: "crewFsNo", name: "crewName", endpointName: 'crews', toEncodeProperties: ['crewName'] });
    case (IntegrationFunction.Department):
      return new FoundationImportSyncPropertyKey({ id: "departmentFsNo", name: "departmentName", endpointName: 'departments', toEncodeProperties: ['departmentName'] });
    case (IntegrationFunction.EarnCode):
      return new FoundationImportSyncPropertyKey({ id: "earnCodeFsNo", name: "earnCodeName", endpointName: 'earncodes', toEncodeProperties: ['earnCodeName', 'earnCodeShortName'] });
    case (IntegrationFunction.Employee):
      return new FoundationImportSyncPropertyKey({
        id: "employeeFsNo",
        name: "fullName",
        endpointName: 'employees',
        overRideEachEndpointName: new ExtensiveImportSyncEndpoint({ fetch: 'employees', import: 'employee/importFSemployees', sync: 'employee/importFSemployees', isSyncUseHttpPost: true }),
        toEncodeProperties: []
      });
    case (IntegrationFunction.GeneralLiabilityClass):
      return new FoundationImportSyncPropertyKey({ id: "displayName", name: "displayName", endpointName: 'generalliabilityclasses', toEncodeProperties: ['generalLiabilityClassName'] });
    case (IntegrationFunction.GeneralLiabilityState):
      return new FoundationImportSyncPropertyKey({ id: "generalLiabilityStateFsNo", name: "generalLiabilityStateName", endpointName: 'generalliabilitystates', toEncodeProperties: ['generalLiabilityStateName'] });
    case (IntegrationFunction.LocalTaxAuthority):
      return new FoundationImportSyncPropertyKey({ id: "payrollLocalTaxCodeFsNo", name: "displayName", endpointName: 'payrollLocalTaxCodes', toEncodeProperties: ['payrollLocalTaxCodeName'] });
    case (IntegrationFunction.Minority):
      return new FoundationImportSyncPropertyKey({ id: "minorityCodeFsNo", name: "minorityCodeName", endpointName: 'minorityCodes', toEncodeProperties: ['minorityCodeName'] });
    case (IntegrationFunction.MiscDeduction):
      return new FoundationImportSyncPropertyKey({ id: "deductionFsNo", name: "deductionName", endpointName: 'deductions', toEncodeProperties: ['deductionName', 'customizedName'] });
    case (IntegrationFunction.MiscDeductionCycle):
      return new FoundationImportSyncPropertyKey({ id: "miscellaneousDeductionCycleFsNo", name: "miscellaneousDeductionCycleName", endpointName: 'miscellaneousDeductionCycles', toEncodeProperties: ['miscellaneousDeductionCycleName'] });
    case (IntegrationFunction.PayPeriod):
      return new FoundationImportSyncPropertyKey({ id: "payPeriodFsNo", name: "payPeriodName", endpointName: 'payperiods', toEncodeProperties: ['payPeriodName'] });
    case (IntegrationFunction.Shift):
      return new FoundationImportSyncPropertyKey({ id: "shiftFsNo", name: "shiftName", endpointName: 'shifts', toEncodeProperties: ['shiftName'] });
    case (IntegrationFunction.TaxGroup):
      return new FoundationImportSyncPropertyKey({ id: "payrollLocalTaxGroupFsNo", name: "payrollLocalTaxGroupName", endpointName: 'payrolllocaltaxgroups', toEncodeProperties: ['payrollLocalTaxGroupName'] });
    case (IntegrationFunction.TaxState):
      return new FoundationImportSyncPropertyKey({ id: "payrollStateTaxCodeFsNo", name: "payrollStateTaxCodeName", endpointName: 'payrollstatetaxcodes', toEncodeProperties: ['payrollStateTaxCodeName'] });
    case (IntegrationFunction.Trade):
      return new FoundationImportSyncPropertyKey({ id: "tradeFsNo", name: "tradeName", endpointName: 'trades', toEncodeProperties: ['tradeName'] });
    case (IntegrationFunction.Union):
      return new FoundationImportSyncPropertyKey({ id: "unionFsNo", name: "unionName", endpointName: 'unions', toEncodeProperties: ['unionName'] });
    case (IntegrationFunction.WorkersCompClass):
      return new FoundationImportSyncPropertyKey({ id: "workersCompClassFsNo", name: "displayName", endpointName: 'workersCompClasses', toEncodeProperties: ['workersCompClassName'] });
    case (IntegrationFunction.WorkersCompState):
      return new FoundationImportSyncPropertyKey({ id: "workersCompStateFsNo", name: "workersCompStateName", endpointName: 'workersCompStates', toEncodeProperties: ['workersCompStateName'] });
  }
}
