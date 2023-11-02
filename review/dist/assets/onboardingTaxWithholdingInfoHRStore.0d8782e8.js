import{J as u,K as f,L as H,N as x,R as h,j as s,cQ as S,d6 as R,d7 as _,d8 as N,d9 as m,da as A}from"./index.611fe570.js";import{p as W}from"./payrollStateTaxCodeApi.0eef4220.js";class y extends H{constructor(t){const o=`${x().ClientSide.WorkforceEmployeeManagement}/api/v1/`;super(t,o)}async getOnboardingTaxWithHoldingInfoHR(t,o){let n;try{const a=await this.axiosInstance.get(`employees/${t}/formFieldValue?formId=${o}`);a.data&&a.status===200&&(n=a.data)}catch(a){throw console.error("An unexpected error occurred attempting to retrieve the Onboarding Tax With Holding Info HR",a),a}return n}async updateOnboardingTaxWithHoldingInfoHR(t,o){try{await this.axiosInstance.post(`employees/${t}/formFieldValue`,o)}catch(n){throw console.error("An unexpected error occurred attempting to update the Onboarding Tax With Holding Info HR",n),n}}}const d=new y([u,f]),v=h("onboardingTaxWithholdingInfoHRStore",()=>{const i=s(void 0),t=s([]),o=s([]),n=S,a=R,l=_,c=N,g=m,O=A;async function T(e,r){i.value=await d.getOnboardingTaxWithHoldingInfoHR(e,r)}async function p(){t.value=await W.getPayrollStateTaxCodes(),o.value=t.value.map(e=>({value:e.id,text:e.payrollStateTaxCodeFsNo,name:e.payrollStateTaxCodeName}))}async function I(e,r){await d.updateOnboardingTaxWithHoldingInfoHR(e,r)}return{federalFilingStatusOptions:n,federalOverrideOptions:a,federalAuthorityOptions:l,stateFilingStatus:c,formattedStateOptions:o,addOnOptions:g,yesNoOptions:O,onboardingTaxWithholdingInfoHR:i,stateOptions:t,getStateTaxCodes:p,getOnboardingTaxWithHoldingInfoHR:T,updateOnboardingTaxWithHoldingInfoHR:I}});export{v as u};