import{J as a,K as c,L as n,N as i,O as r}from"./index.611fe570.js";const s="documentMetadata";class u extends n{constructor(e){const t=i().ClientSide.WorkforceManagement+"/v1";super(e,t,"DocumentMetadata")}async addDocument(e){try{return await this.PerformPost(`${s}`,e)}catch(t){console.error(this.errormessage(r.Create),t)}return!1}async fetchDocumentList(e=null){let t=[];try{const o=`${s}?IsDeleted=false${e?`&employeeId=${e}`:""}`;t=await this.PerformFetch(o)}catch(o){console.error(this.errormessage(r.Fetch),o)}return t}async fetchDocumentCategoryList(){let e=[];try{e=await this.PerformFetch(`${s}/categories`)}catch(t){console.error(this.errormessage(r.Fetch),t)}return e}async deleteDocument(e){try{return await this.PerformDelete(`${s}/${e}`)}catch(t){console.error(this.errormessage(r.Delete),t)}return!1}}const h=new u([a,c]);export{h as W};