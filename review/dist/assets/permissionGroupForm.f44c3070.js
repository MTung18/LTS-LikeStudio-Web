import{d as ie,s as re,l as _e,e2 as he,e3 as ye,dk as ge,j as d,e as be,a1 as ne,b as ue,r as i,o as b,f as N,w as e,g as s,I as n,u as C,c as H,z as we,F as Pe,B as Ge,D as K,Q as ke,at as Ce,y as Ve,h as qe,aM as xe,a as w,ao as Se,ai as ee,aj as Me,a2 as oe}from"./index.611fe570.js";import{b as De,u as W,a as z}from"./permissionGroupStore.a1288023.js";import{_ as Ie}from"./permissionItemEditor.vue_vue_type_script_setup_true_lang.df02ab22.js";import"./index.0faf2598.js";class Re extends De{isSelected=!1;constructor(a){super(),Object.assign(this,a)}}const Fe=ie({__name:"copyPermissionsModal",props:{currentPermissionGroupId:null,showModal:{type:Boolean}},emits:["update:showModal","onPermissionGroupSelected"],setup(V,{emit:a}){const P=V,{fetchPermissionGroupList:f}=W(),{permissionGroupList:G}=re(W());_e.add(he,ye,ge);const k=d(!1),y=d(null),l=d(new Array),p=d(!1);be(async()=>{p.value=!1,await f(),P.currentPermissionGroupId>0&&(G.value=G.value.filter(r=>r.id!==P.currentPermissionGroupId)),X(G.value),p.value=!0}),ne(()=>P.showModal,(r,u)=>{k.value=P.showModal},{immediate:!0,deep:!0}),ne(()=>k,()=>{a("update:showModal",k.value)},{immediate:!0});const m=ue(()=>l.value.findIndex(r=>r.isSelected===!0)!==-1);function S(r){for(let u of l.value){if(u.id!=r){u.isSelected=!1;continue}u.isSelected==!1?y.value=null:y.value=r}}function X(r){for(let u of r){let M=new Re(u);l.value.push(M)}}function I(){let r=l.value.find(u=>u.isSelected==!0);r.isSelected=!1,y.value=null}const c=async()=>{a("update:showModal",!1),y.value!=null&&I()},g=async()=>{a("update:showModal",!1),a("onPermissionGroupSelected",y.value),y.value!=null&&I()};return(r,u)=>{const M=i("fs-container"),v=i("fs-overlay"),O=i("fs-th"),D=i("fs-tr"),R=i("fs-thead"),Y=i("fs-form-checkbox"),F=i("fs-td"),U=i("fs-tbody"),E=i("fs-table-simple"),q=i("fs-button"),Q=i("fs-modal");return b(),N(Q,{modelValue:k.value,"onUpdate:modelValue":u[0]||(u[0]=_=>k.value=_),centered:"","content-class":"phq-modal min-h-220 max-vh-80","header-class":"phq-modal__header","title-class":"phq-modal__title","body-class":"phq-modal__body d-flex flex-column overflow-hidden p-0","footer-class":"phq-modal__footer","header-text-variant":"light","header-bg-variant":"blue--dk",lazy:!0,"hide-header-close":"","no-close-on-backdrop":"","no-close-on-esc":"",size:"xl",title:"Copy Permissions From Existing Group"},{"modal-footer":e(()=>[s(q,{variant:"outline-secondary",onClick:c},{default:e(()=>[n("Cancel")]),_:1}),s(q,{variant:"primary",onClick:g,disabled:!C(m)},{default:e(()=>[n("Select")]),_:1},8,["disabled"])]),default:e(()=>[s(M,{fluid:"",class:"contain fw-bold py-3"},{default:e(()=>[n("Select which Permission Group you would like to copy permissions from:")]),_:1}),s(v,{show:!p.value,"spinner-variant":"primary",class:"fsi-pg__overlay","no-wrap":""},null,8,["show"]),s(E,{responsive:"",class:"mb-0"},{default:e(()=>[s(R,null,{default:e(()=>[s(D,{class:"bg-grey--000"},{default:e(()=>[s(O,null,{default:e(()=>[n(" Name ")]),_:1}),s(O,null,{default:e(()=>[n(" Description ")]),_:1})]),_:1})]),_:1}),s(U,null,{default:e(()=>[(b(!0),H(Pe,null,we(l.value,(_,J)=>(b(),N(D,{key:J,style:Ge({color:_.isSelected?"#03A9F4":""})},{default:e(()=>[s(F,null,{default:e(()=>[s(Y,{modelValue:_.isSelected,"onUpdate:modelValue":$=>_.isSelected=$,onChange:$=>S(_.id)},{default:e(()=>[n(K(_.name),1)]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])]),_:2},1024),s(F,null,{default:e(()=>[n(K(_.description),1)]),_:2},1024)]),_:2},1032,["style"]))),128))]),_:1})]),_:1})]),_:1},8,["modelValue"])}}});class j{formValidationResult={valid:!1};hasValidated=!1}const L="observer";function Ue(V=L){const a=d({});typeof V=="string"?a.value[V]=new j:[...V].forEach(l=>{a.value[l]=new j});async function P(l,p=L){a.value[p]||(a.value[p]=new j),a.value[p].hasValidated=!0;const m=await l[p]?.validate();return a.value[p].formValidationResult=m,m}function f(l,p=null,m=L){a.value[m]||(a.value[m]=new j),a.value[m].hasValidated=!1,p?l[m]?.resetForm({values:p}):l[m]?.resetForm(),a.value[m].formValidationResult={valid:!1}}function G(l=L){a.value[l]||(a.value[l]=new j),a.value[l].hasValidated=!1,a.value[l].formValidationResult={valid:!1}}function k(l=L){return a.value[l]?.hasValidated}function y(l=L){return a.value[l]?.formValidationResult}return{form:a,formHasValidated:k,formValidationResult:y,resetForm:f,resetHasValidated:G,validateForm:P}}const Ee={class:"hq-pg"},Ae={class:"col-md-12 text-end"},Be=w("h3",{class:"hq-pg__section-head"},"General",-1),Le={key:0},Oe=w("span",{class:"me-2 text-secondary"},"Copied From: ",-1),$e={class:"p-2 border rounded background-color--cerulean"},Te={class:"text-white"},ze={key:1},je=w("h3",{class:"hq-pg__section-head"},"Permissions",-1),He={class:"position-relative flex-fill overflow-hidden"},Ne={class:"h-100 list"},Qe={class:"list__table overflow-auto"},Je={id:"delete-permission-group",class:"d-inline-block"},Ze=ie({__name:"permissionGroupForm",setup(V){const a=d(),{formHasValidated:P}=Ue("observer"),{notifyError:f,notifySuccess:G}=ke(),{createPermissionGroup:k,editPermissionGroup:y,fetchPermissionGroupDetails:l,fetchPermissionGroupList:p,deletePermissionGroup:m}=W(),{permissionGroupDetails:S,permissionGroupList:X}=re(W()),I=d(new z),c=d(new z),g=d(null),r=Ce(),u=Ve(),M=d(!1),v=d(!1),O=d(null),D=r.query.id?Number(r.query.id):0,R=D&&D!==0,Y=!D,F=d(!1),U=d(!1),E=d(!1),q=d(!1),Q=d(),_=d(!1),J=ue(()=>I.value.name!=c.value.name||I.value.description!=c.value.description||_.value||g.value!==null),$=d([]),de=async()=>{c.value.permissionGroupPermissionItems=O.value.updatedPermissionItems,v.value=!0;const h=await a.value.validate();if(h.valid)if(Y)try{let o=await k(c.value);o.id!==0?(G("Permission group was created."),q.value=!0,u.push({name:"permissionGroupDetails",params:{permissionGroupId:o.id}})):f("Permission group could not be created.")}catch{f("Permission group could not be created.")}else R&&(await y(Number(r.query.id),c.value)?(G("Permission group was editted."),q.value=!0,u.go(-1)):f("Permission group could not be editted."));else{let o=Object.values(h.errors)[0],A=o.includes("Field is required")?"Please fill the required fields":o;f(A)}v.value=!1},ce=async()=>{v.value=!0,await m(D)?(G("Permission group deleted."),q.value=!0,u.push({name:"userAndPermissions",hash:"#pg"})):f("Permission group could not be deleted."),v.value=!1},pe=()=>{q.value=!0,u.push(Q.value)},me=async h=>{h!=null&&(v.value=!0,await l(h),g.value=new z(S.value),v.value=!1,(!g.value?.permissionGroupPermissionItems?.length||g.value?.permissionGroupPermissionItems?.length===0)&&f("Unable to copy permissions from Permission group."))};return u.beforeEach((h,o,A)=>{J.value===!0&&q.value===!1?(Q.value=h,E.value=!0,A(!1)):A()}),qe(async()=>{M.value=!1,v.value=!0;let h=0;if(r.query.id){h=Number(r.query.id);try{if(await l(Number(r.query.id)),S.value?.id!==0&&S.value?.isDefaultPermissionGroup!==!0)I.value=new z(S.value),c.value=new z(S.value);else throw"Permission group not found or is not editable"}catch(o){f(o),u.push({name:"userAndPermissions",hash:"#pg"})}}try{await p(),$.value=X.value.filter(o=>o.id!=h).map(o=>o.name)}catch(o){f(o)}v.value=!1,M.value=!0}),(h,o)=>{const A=i("fs-overlay"),B=i("fs-col"),x=i("fs-button"),fe=i("fs-form-group"),T=i("fs-row"),se=i("fs-container"),ae=i("fsInput"),ve=i("fs-tooltip"),le=i("fs-modal"),te=xe("fs-tooltip");return b(),H("div",Ee,[s(A,{show:v.value,"spinner-variant":"primary",class:"fsi-pg__overlay","no-wrap":""},null,8,["show"]),s(se,{fluid:"",class:"hq-pg__header hq-pg__header--sticky contain hq-pg__header--edit"},{default:e(()=>[s(T,{"align-v":"center"},{default:e(()=>[s(B,{cols:"auto",class:"hq-pg__title"},{default:e(()=>[n(K(C(R)?"Edit Permission Group":"Create Permission Group"),1)]),_:1}),s(B,null,{default:e(()=>[s(fe,{class:"fancy__form-group fancy__form-group--search"},{default:e(()=>[w("div",Ae,[s(x,{variant:"outline-secondary",onClick:o[0]||(o[0]=t=>C(u).go(-1))},{default:e(()=>[n("Cancel")]),_:1}),s(x,{variant:"primary",onClick:de,disabled:C(R)&&!C(J)},{default:e(()=>[n("Save")]),_:1},8,["disabled"])])]),_:1})]),_:1})]),_:1})]),_:1}),s(se,{fluid:"",class:"contain hq-pg__container"},{default:e(()=>[s(T,{"align-v":"end",class:"mt-4"},{default:e(()=>[s(B,{lg:"8"},{default:e(()=>[Be,s(C(Se),{ref_key:"observer",ref:a},{default:e(({meta:t})=>[s(ae,{type:"fsTextInput","data-vv-name":"name",rules:{max:64,required:!0,no_duplicate_existingstring:{arrayOfStrings:$.value,message:"Name must be unique"}},required:!0,label:"Name",formMeta:{...t,validated:C(P)()},modelValue:c.value.name,"onUpdate:modelValue":o[1]||(o[1]=Z=>c.value.name=Z)},null,8,["rules","formMeta","modelValue"]),s(ae,{type:"fsTextInput","data-vv-name":"description",rules:{max:255},label:"Description",formMeta:{...t,validated:C(P)()},modelValue:c.value.description,"onUpdate:modelValue":o[2]||(o[2]=Z=>c.value.description=Z)},null,8,["formMeta","modelValue"])]),_:1},512)]),_:1})]),_:1}),s(T,null,{default:e(()=>[s(B,{lg:"8",class:"text-end"},{default:e(()=>[g.value?(b(),H("div",Le,[Oe,w("span",$e,[w("span",Te,K(g.value.name),1),ee((b(),H("button",{title:"Clear Permissions",type:"button",class:"ms-2 close","aria-label":"Close",onClick:o[3]||(o[3]=t=>{g.value=null})},[n(" \xD7 ")])),[[te,void 0,void 0,{hover:!0}]])])])):(b(),H("div",ze,[s(x,{variant:"link",class:"text-decoration-none",onClick:o[4]||(o[4]=t=>{F.value=!0})},{default:e(()=>[n("Copy Permissions")]),_:1})]))]),_:1})]),_:1}),M.value?ee((b(),N(T,{key:0},{default:e(()=>[s(B,{lg:"8"},{default:e(()=>[je,w("div",He,[w("div",Ne,[w("div",Qe,[s(Ie,{currentPermissionGroup:c.value,isReadOnly:!1,copiedFromPermissionGroup:g.value,permissionsUpdated:_.value,"onUpdate:permissionsUpdated":o[5]||(o[5]=t=>_.value=t),ref_key:"permissionItemEditorRef",ref:O},null,8,["currentPermissionGroup","copiedFromPermissionGroup","permissionsUpdated"])])])])]),_:1})]),_:1},512)),[[Me,!v.value]]):oe("",!0),C(R)?(b(),N(T,{key:1,"align-v":"center"},{default:e(()=>[s(B,{lg:"8"},{default:e(()=>[w("div",Je,[s(x,{variant:"danger",onClick:o[6]||(o[6]=t=>U.value=!0),disabled:c.value.users.length>0},{default:e(()=>[n("Delete Permission Group ")]),_:1},8,["disabled"]),c.value.users.length>0?ee((b(),N(ve,{key:0,target:"delete-permission-group"},{default:e(()=>[n(" Permission Group cannot be deleted because it has active users associated with it. ")]),_:1})),[[te,void 0,void 0,{hover:!0,right:!0}]]):oe("",!0)])]),_:1})]),_:1})):oe("",!0)]),_:1}),s(Fe,{showModal:F.value,"onUpdate:showModal":o[7]||(o[7]=t=>F.value=t),currentPermissionGroupId:c.value?c.value.id:null,onOnPermissionGroupSelected:me},null,8,["showModal","currentPermissionGroupId"]),s(le,{modelValue:U.value,"onUpdate:modelValue":o[8]||(o[8]=t=>U.value=t),centered:"","content-class":"phq-modal","header-class":"phq-modal__header","title-class":"phq-modal__title","body-class":"phq-modal__body","footer-class":"phq-modal__footer","header-text-variant":"light","header-bg-variant":"blue--dk",lazy:!0,"hide-header-close":"","no-close-on-backdrop":"","no-close-on-esc":"",onOk:ce,onCancel:o[9]||(o[9]=t=>U.value=!1),title:"Delete Permission Group "+c.value.name},{"modal-footer":e(t=>[s(x,{variant:"outline-secondary",onClick:t.cancel},{default:e(()=>[n("Cancel")]),_:2},1032,["onClick"]),s(x,{variant:"danger",onClick:t.ok},{default:e(()=>[n("Delete")]),_:2},1032,["onClick"])]),default:e(()=>[n(" Are you sure you want to delete this permission group? ")]),_:1},8,["modelValue","title"]),s(le,{modelValue:E.value,"onUpdate:modelValue":o[10]||(o[10]=t=>E.value=t),centered:"","content-class":"phq-modal","header-class":"phq-modal__header","title-class":"phq-modal__title","body-class":"phq-modal__body","footer-class":"phq-modal__footer","header-text-variant":"light","header-bg-variant":"blue--dk",lazy:!0,"hide-header-close":"","no-close-on-backdrop":"","no-close-on-esc":"",onOk:pe,onCancel:o[11]||(o[11]=t=>E.value=!1),title:"Close Create Permission Group"},{"modal-footer":e(t=>[s(x,{variant:"outline-secondary",onClick:t.cancel},{default:e(()=>[n("Cancel")]),_:2},1032,["onClick"]),s(x,{variant:"primary",onClick:t.ok},{default:e(()=>[n("Close")]),_:2},1032,["onClick"])]),default:e(()=>[n(" Are you sure you want to close this page? Any unsaved changes will be lost. ")]),_:1},8,["modelValue"])])}}});export{Ze as default};