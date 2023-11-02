import{J as i,K as l,L as m,N as p,O as n,R as c,j as y}from"./index.611fe570.js";class f extends m{constructor(o){const e=p().ClientSide.WorkforceManagement+"/v1/Employee";super(o,e)}async getEmployeeTaxInformation(o){try{return await this.PerformFetch(`${o}/taxInformation`)}catch(e){throw console.error(this.errormessage(n.Update),e),e}}async editEmployeeTaxInformation(o){try{return await this.PerformPost(`${o.employeeId}/taxInformation`,o)}catch(e){throw console.error(this.errormessage(n.Update),e),new Error("Failed to update Tax Info.")}}}const s=new f([i,l]);class x{employeeId;employeePayrollFederalTaxDetail;employeePayrollStateTaxCodeDetails;employeePayrollLocalTaxCodeDetails;isResidenceTax;payrollLocalTaxGroup}const u=c("employeeTaxInformationStore",()=>{const a=y(new x);async function o(r){a.value=await s.getEmployeeTaxInformation(r)}async function e(r){const t=await s.editEmployeeTaxInformation(r);return t&&(a.value=r),t}return{fetchEmployeeTaxInformation:o,editEmployeeTaxInformation:e,employeeTaxInformation:a}});export{u};