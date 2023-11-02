import{J as h,K as f,L as O,N as n,R as w,j as a}from"./index.611fe570.js";class C extends O{constructor(e){const t=`${n().ClientSide.WorkforceEmployeeManagement}/api/v1`;super(e,t)}async getEmploymentInformation(e,t){let s={};try{const r=await this.axiosInstance.get(`employees/${e}/formFieldValue?formId=${t}`);if(r&&r.data&&r.status===200)s=r.data;else throw new Error("Failed to parse employment information data")}catch(r){console.error("An unexpected error occurred attempting to retrieve the employment information data.",r)}return s}async updateEmploymentInformation(e,t){try{await this.axiosInstance.post(`employees/${e}/formFieldValue`,t)}catch(s){console.error("An unexpected error occurred attempting to update the employment information.",s)}}async getJobTitleOptions(){let e=[];try{const t=await this.axiosInstance.get(`${n().ClientSide.WorkforceManagement}/v1/JobTitles`);if(t&&t.data&&t.status===200)e=t.data;else throw new Error("Failed to parse job title list")}catch(t){console.error("An unexpected error occurred attempting to retrieve the job title list.",t)}return e}async getDepartmentOptions(){let e=[];try{const t=await this.axiosInstance.get(`${n().ClientSide.WorkforceManagement}/v1/FoundationIntegration/departments`);if(t&&t.data&&t.status===200)e=t.data;else throw new Error("Failed to parse department list")}catch(t){console.error("An unexpected error occurred attempting to retrieve the department list.",t)}return e}async getCostCodeOptions(){let e=[];try{const t=await this.axiosInstance.get(`${n().ClientSide.WorkforceManagement}/v1/FoundationIntegration/costCodes`);if(t&&t.data&&t.status===200)e=t.data;else throw new Error("Failed to parse cost code list")}catch(t){console.error("An unexpected error occurred attempting to retrieve the cost code list.",t)}return e}async getTradeOptions(){let e=[];try{const t=await this.axiosInstance.get(`${n().ClientSide.WorkforceManagement}/v1/FoundationIntegration/trades`);if(t&&t.data&&t.status===200)e=t.data;else throw new Error("Failed to parse trade list")}catch(t){console.error("An unexpected error occurred attempting to retrieve the trade list.",t)}return e}async getUnionOptions(){let e=[];try{const t=await this.axiosInstance.get(`${n().ClientSide.WorkforceManagement}/v1/FoundationIntegration/unions`);if(t&&t.data&&t.status===200)e=t.data;else throw new Error("Failed to parse union list")}catch(t){console.error("An unexpected error occurred attempting to retrieve the union list.",t)}return e}async getGeneralLiabilityClassOptions(){let e=[];try{const t=await this.axiosInstance.get(`${n().ClientSide.WorkforceManagement}/v1/FoundationIntegration/generalliabilityclasses`);if(t&&t.data&&t.status===200)e=t.data;else throw new Error("Failed to parse general liability class list")}catch(t){console.error("An unexpected error occurred attempting to retrieve the general liability class list.",t)}return e}async getGeneralLiabilityStateOptions(){let e=[];try{const t=await this.axiosInstance.get(`${n().ClientSide.WorkforceManagement}/v1/FoundationIntegration/generalliabilitystates`);if(t&&t.data&&t.status===200)e=t.data;else throw new Error("Failed to parse general liability state list")}catch(t){console.error("An unexpected error occurred attempting to retrieve the general liability state list.",t)}return e}async getWorkersCompClassesOptions(){let e=[];try{const t=await this.axiosInstance.get(`${n().ClientSide.WorkforceManagement}/v1/FoundationIntegration/workerscompclasses`);if(t&&t.data&&t.status===200)e=t.data;else throw new Error("Failed to parse general worker company class")}catch(t){console.error("An unexpected error occurred attempting to retrieve the general worker company class.",t)}return e}async getWorkersCompStatesOptions(){let e=[];try{const t=await this.axiosInstance.get(`${n().ClientSide.WorkforceManagement}/v1/FoundationIntegration/workerscompstates`);if(t&&t.data&&t.status===200)e=t.data;else throw new Error("Failed to parse general company state list")}catch(t){console.error("An unexpected error occurred attempting to retrieve the general company state list.",t)}return e}async updateJobTitleOptions(e){try{await this.axiosInstance.post(`${n().ClientSide.WorkforceManagement}/v1/JobTitles`,{jobTitleName:e})}catch(t){console.error("An unexpected error occurred attempting to update the job title list.",t)}}async getManagers(){let e=[];try{const t=await this.axiosInstance.get(`${n().ClientSide.WorkforceManagement}/v1/Employee`);if(t&&t.data&&t.status===200)e=t.data;else throw new Error("Failed to parse manager list")}catch(t){console.error("An unexpected error occurred attempting to retrieve the manager list.",t)}return e}}const o=new C([h,f]),J=w("onboardingEmploymentInformation",()=>{const c=a(),e=a([]),t=a([]),s=a([]),r=a([]),p=a([]),d=a([]),m=a([]),g=a([]),u=a([]),y=a([]);return{formEmploymentInformation:c,fetchFormEmploymentInformationData:async(i,l)=>{c.value=await o.getEmploymentInformation(i,l)},fetchJobTitleOptions:async()=>{e.value=await o.getJobTitleOptions()},fetchDepartmentOptions:async()=>{t.value=await o.getDepartmentOptions()},fetchCostCodeOptions:async()=>{s.value=await o.getCostCodeOptions()},fetchTradeOptions:async()=>{r.value=await o.getTradeOptions()},fetchUnionOptions:async()=>{p.value=await o.getUnionOptions()},fetchGeneralLiabilityClassOptions:async()=>{d.value=await o.getGeneralLiabilityClassOptions()},fetchGeneralLiabilityStateOptions:async()=>{m.value=await o.getGeneralLiabilityStateOptions()},fetchWorkersCompStatesOptions:async()=>{g.value=await o.getWorkersCompStatesOptions()},fetchWorkersCompClassesOptions:async()=>{u.value=await o.getWorkersCompClassesOptions()},fetchManagerOptions:async()=>{y.value=await o.getManagers()},jobTitleOptions:e,updateFormEmploymentInformationData:async({employeeId:i,formData:l})=>{await o.updateEmploymentInformation(i,l)},updateJobTitleOptions:async i=>{await o.updateJobTitleOptions(i)},departmentOptions:t,costCodeOptions:s,tradeOptions:r,unionOptions:p,generalLiabilityClassOptions:d,generalLiabilityStateOptions:m,workersCompStatesOptions:g,workersCompClassesOptions:u,managerOptions:y}});export{J as u};