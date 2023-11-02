import{d as le,j as _,at as ie,y as de,a0 as ue,l as ce,br as _e,bs as pe,bt as fe,bu as he,bv as ge,s as me,a1 as ye,e as xe,bc as be,r as y,o as v,c as ve,g as t,w as a,a as s,u as p,C as S,D as f,I as D,ai as E,aj as k,f as G,a3 as L,ba as o,ax as Se,ay as De,_ as Te}from"./index.611fe570.js";import{f as T}from"./gridConfigDefaults.8c72c19b.js";import{g as Ce,a as we}from"./statefulSortFeature.3df4a43a.js";import{u as z}from"./payrollStore.c3ec353b.js";import{S as q,h as $e,a as I}from"./grid.module.3b00878a.js";import{B as R}from"./BryntumGrid.2c4be387.js";const c=C=>(Se("data-v-0c63d545"),C=C(),De(),C),We={class:"hq-pg"},He={class:"hq-pg__title custom-hq-pg__title"},Ee=c(()=>s("span",{class:"d-none d-lg-inline"},"Print",-1)),ke=c(()=>s("hr",{class:"my-0"},null,-1)),Ge={id:"wrapper"},Le={class:"dashboard-card__header"},qe=c(()=>s("span",null,[s("div",{class:"hq-pg__title custom-hq-pg__title ml-8"},"Preview Company")],-1)),Ie={class:"ps-font-12"},Re={class:"ps-font-12"},Pe={class:"ps-font-12"},Ye={class:"ps-font-12"},Ve={class:"dashboard-card__header"},Ae=c(()=>s("div",{class:"hq-pg__title custom-hq-pg__title ml-8"},"Earnings Statement",-1)),Fe=c(()=>s("strong",{class:"ps-font-16"},"Check number",-1)),Be=c(()=>s("strong",{class:"ps-font-16"},"Pay date",-1)),Me=c(()=>s("strong",{class:"ps-font-16"},"Pay period",-1)),Ne={class:"dashboard-card__header"},Oe={class:"hq-pg__title custom-hq-pg__title ml-8"},je=c(()=>s("strong",{class:"ps-font-16"},"Employee ID ",-1)),Ke=c(()=>s("strong",{class:"ps-font-16"},"Address",-1)),ze={fluid:"",class:"contain hq-pg__container",id:"listGrid"},Je=c(()=>s("h2",{class:"hq-pg__title custom-hq-pg__title"},"Current Hours & Earnings",-1)),Qe={class:"action-grid list__table--onpage list__b-grid--hover"},Ue=c(()=>s("h2",{class:"hq-pg__title custom-hq-pg__title"},"Year To Date Hours & Earnings",-1)),Xe={class:"action-grid list__table--onpage list__b-grid--hover"},Ze=c(()=>s("h2",{class:"hq-pg__title custom-hq-pg__title"},"Taxes & Deductions",-1)),et={class:"action-grid list__table--onpage list__b-grid--hover"},tt=c(()=>s("h2",{class:"hq-pg__title custom-hq-pg__title"},"Fringes",-1)),at={class:"action-grid list__table--onpage list__b-grid--hover"},st={id:"net-pay"},rt={class:"dashboard__row mt-4 p-3 bg-gray rounded","align-v":"center"},nt=c(()=>s("h2",{class:"hq-pg__title custom-hq-pg__title"},"Net Pay",-1)),ot={class:"ps-text-end fw-bold"},lt=le({__name:"payrollDetails",setup(C){const x=_(0),J=ie(),Q=de(),{responsive:g}=ue();ce.add(_e,pe,fe,he,ge);const{fetchPayrollDetails:U}=z(),{fsPaystubDetail:w}=me(z()),P=_(""),$=_(null),l=_(null),Y=_(!1),V=_(!1),A=_(!1),F=_(!1),B=_(""),{id:X,payrollId:it,year:dt}=J.params;function Z(h){const u=document.getElementById(h).outerHTML,r=document.body.outerHTML;document.body.outerHTML=u,window.print(),document.body.outerHTML=r,location.reload()}const b={field:"description",ascending:!0},M=_(new q({...T.gridStoreConfig,sorters:[b]})),N=_(new q({...T.gridStoreConfig,sorters:[b]}));class ee extends $e{static get fields(){return[{name:"currentVal",type:"number"},{name:"ytdVal",type:"number"}]}}const O=_(new q({...T.gridStoreConfig,sorters:[b],modelClass:ee})),j=_(new q({...T.gridStoreConfig,sorters:[b]}));async function te(){l.value.paycheckCurrentEarningsList&&(M.value.data=l.value.paycheckCurrentEarningsList,Y.value=!0)}async function ae(){l.value.paycheckYTDEarningsList&&(N.value.data=l.value.paycheckYTDEarningsList,V.value=!0)}async function se(){const h=Array.of(l.value.fedTaxList,l.value.stateTaxList,l.value.localTaxList,l.value.miscDeductionsList,l.value.unionDeductionsList);if(h.length>0){const u=[];h.forEach(r=>{if(r.length>0){const e=Object.create({description:r[0].shortDesc,expanded:!0,children:r});u.push(e)}}),O.value.data=u,A.value=!0}}async function re(){l.value.fringesList&&(j.value.data=l.value.fringesList,F.value=!0)}const m={HoursEarning:"HoursEarning",YearToDate:"YearToDate",TaxDeduction:"TaxDeduction",Fringes:"Fringes"},K="payrollDetailsGrid",W=h=>{let u;return h===m.HoursEarning?u=[{minWidth:"120px",autoHeight:!0,autoWidth:!0,flex:2,text:"Description",id:"description",field:"earnTypeDescription",groupable:!1,htmlEncode:!1,sum:"add",summaryRenderer:()=>"TOTAL"},{minWidth:"120px",maxWidth:"400px",autoHeight:!0,autoWidth:g.mobile,flex:1,text:"Hours",id:"hours",field:"hours",cls:"text-align-right",groupable:!1,htmlEncode:!1,sum:"sum",renderer:({value:e})=>`${o(e)=="$0.00"?"":o(e)}`,summaryRenderer:({sum:e})=>`${o(e)}`},{minWidth:"120px",maxWidth:"400px",autoHeight:!0,autoWidth:g.mobile,flex:1,text:"Pay Rate",id:"payRate",field:"payRate",cls:"text-align-right",groupable:!1,htmlEncode:!1,sum:"sum",renderer:({value:e})=>`${o(e)=="$0.00"?"":o(e)}`,summaryRenderer:({sum:e})=>`${o(e)}`},{minWidth:"120px",maxWidth:"400px",autoHeight:!0,autoWidth:g.mobile,flex:1,text:"Earnings",id:"amount",field:"amount",cls:"text-align-right",groupable:!1,htmlEncode:!1,sum:"sum",renderer:({value:e})=>`${o(e)=="$0.00"?"":o(e)}`,summaryRenderer:({sum:e})=>`${o(e)}`}]:h===m.YearToDate?u=[{minWidth:"120px",autoHeight:!0,autoWidth:!0,flex:2,text:"Description",id:"earnType",field:"earnType",groupable:!1,htmlEncode:!1,sum:"add",summaryRenderer:()=>"TOTAL"},{minWidth:"120px",maxWidth:"400px",autoHeight:!0,autoWidth:g.mobile,flex:1,text:"Hours",id:"hours",field:"ytdHours",cls:"text-align-right",groupable:!1,htmlEncode:!1,sum:"sum",renderer:({value:e})=>`${o(e)=="$0.00"?"":o(e)}`,summaryRenderer:({sum:e})=>`${o(e)}`},{minWidth:"120px",maxWidth:"400px",autoHeight:!0,autoWidth:g.mobile,flex:1,text:"Earnings",id:"amount",field:"ytdAmount",cls:"text-align-right",groupable:!1,htmlEncode:!1,sum:"sum",renderer:({value:e})=>`${o(e)=="$0.00"?"":o(e)}`,summaryRenderer:({sum:e})=>`${o(e)}`}]:h===m.TaxDeduction?u=[{minWidth:"120px",autoHeight:!0,autoWidth:!0,text:"Description",field:"description",flex:3,type:"tree",touchConfig:{editor:!1},htmlEncode:!1,renderer({value:e,record:n,row:d}){return n.data.parentId===null?(d.addCls("highlight"),`${I.encodeHtml(e)}`):I.encodeHtml(e)},sum:"sum",summaryRenderer:()=>"TOTAL"},{minWidth:"120px",maxWidth:"400px",autoHeight:!0,autoWidth:g.mobile,type:"aggregate",text:"Current",id:"currentVal",field:"currentVal",cls:"text-align-right",flex:1,sum:(e,n)=>{const{parentId:d,currentVal:i}=n.data;return(d===null||!("parentId"in n.data))&&(e+=i??0),e},renderer:({value:e})=>`${o(e)=="$0.00"?"":o(e)}`,summaryRenderer:({sum:e})=>`${o(e)}`},{minWidth:"120px",maxWidth:"400px",autoHeight:!0,autoWidth:g.mobile,type:"aggregate",text:"YTD",id:"ytdVal",field:"ytdVal",cls:"text-align-right",flex:1,sum:(e,n)=>{const{parentId:d,ytdVal:i}=n.data;return(d===null||!("parentId"in n.data))&&(e+=i??0),e},renderer:({value:e})=>`${o(e)=="$0.00"?"":o(e)}`,summaryRenderer:({sum:e})=>`${o(e)}`}]:h===m.Fringes&&(u=[{minWidth:"120px",autoHeight:!0,autoWidth:!0,text:"Description",id:"description",field:"description",flex:3,type:"tree",touchConfig:{editor:!1},htmlEncode:!1,renderer({value:e,record:n,row:d}){return n.data.parentId===null?(d.addCls("highlight"),`${I.encodeHtml(e)}`):I.encodeHtml(e)},sum:"sum",summaryRenderer:()=>"TOTAL"},{minWidth:"120px",maxWidth:"400px",autoHeight:!0,autoWidth:g.mobile,type:"aggregate",text:"Current",field:"currentVal",cls:"text-align-right",flex:1,sum:(e,n)=>{const{parentId:d,currentVal:i}=n.data;return(d===null||!("parentId"in n.data))&&(e+=i??0),e},renderer:({value:e})=>`${o(e)=="$0.00"?"":o(e)}`,summaryRenderer:({sum:e})=>`${o(e)}`},{minWidth:"120px",maxWidth:"400px",autoHeight:!0,autoWidth:g.mobile,type:"aggregate",text:"YTD",field:"ytdVal",cls:"text-align-right",flex:1,sum:(e,n)=>{const{parentId:d,ytdVal:i}=n.data;return(d===null||!("parentId"in n.data))&&(e+=i??0),e},renderer:({value:e})=>`${o(e)=="$0.00"?"":o(e)}`,summaryRenderer:({sum:e})=>`${o(e)}`}]),{...ne(),columns:[...u]}},ne=()=>({...T.gridConfig,...Ce(K),...we(K,b),autoHeight:!0,rowHeight:25,features:{summary:!0},emptyText:""});return ye(()=>g.breakpoint,()=>{x.value++}),xe(async()=>{await U(X),l.value=w.value,await te(),await ae(),await se(),await re(),B.value=be(l.value?.payStubGeneral?.checkDate).format("MM/DD/YYYY"),l.value.payStubGeneral.periodStartsString&&l.value.payStubGeneral.periodEndsString&&(P.value=`${l.value.payStubGeneral.periodStartsString} - ${l.value.payStubGeneral.periodEndsString}`)}),(h,u)=>{const r=y("fs-col"),e=y("fs-button"),n=y("fs-row"),d=y("fs-container"),i=y("fs-card"),H=y("fs-card-header");return v(),ve("div",We,[t(d,{fluid:"",class:"hq-pg__header hq-pg__header--sub contain"},{default:a(()=>[t(n,{"align-v":"center my-2"},{default:a(()=>[t(r,{class:"payroll-header"},{default:a(()=>[s("span",{onClick:u[0]||(u[0]=oe=>p(Q).go(-1))},[t(p(S),{icon:["fal","circle-arrow-left"],class:"back-icon"})]),s("span",null,[s("h2",He,f("PayStub "+B.value),1)])]),_:1}),t(r,{cols:"auto"},{default:a(()=>[t(e,{variant:"outline-primary",onClick:u[1]||(u[1]=oe=>Z("wrapper"))},{default:a(()=>[t(p(S),{icon:["fal","print"]}),Ee]),_:1})]),_:1})]),_:1})]),_:1}),ke,s("div",Ge,[t(d,{fluid:"",class:"contain hq-pg__container",id:"card-header"},{default:a(()=>[t(n,{class:"mt-4"},{default:a(()=>[t(r,{lg:"6",xl:"4",class:"mb-3 print-responsive"},{default:a(()=>[t(i,{class:"rounded","no-body":""},{default:a(()=>[s("div",Le,[t(p(S),{class:"me-2",icon:["fas","map-location"]}),qe]),s("div",null,[t(d,{fluid:""},{default:a(()=>[t(n,{class:"py-0"},{default:a(()=>[t(r,{class:"px-3 pb-3"},{default:a(()=>[s("p",Ie,f(l.value?.payStubGeneral?.companyName),1),s("p",Re,f(l.value?.payStubGeneral?.companyAddress),1),s("p",Pe,f(l.value?.payStubGeneral?.companyAddressLocation),1),s("p",Ye,f(l.value?.payStubGeneral?.companyPhone),1)]),_:1})]),_:1})]),_:1})])]),_:1})]),_:1}),t(r,{lg:"6",xl:"4",class:"mb-3 print-responsive"},{default:a(()=>[t(i,{class:"rounded","no-body":""},{default:a(()=>[s("div",Ve,[t(p(S),{class:"me-2",icon:["fas","calendar-days"]}),Ae]),s("div",null,[t(d,{fluid:""},{default:a(()=>[t(n,null,{default:a(()=>[t(r,{cols:"6"},{default:a(()=>[Fe]),_:1}),t(r,{class:"ps-text-end ps-font-16"},{default:a(()=>[D(f(l.value?.payStubGeneral?.checkNo),1)]),_:1})]),_:1}),t(n,null,{default:a(()=>[t(r,{cols:"6"},{default:a(()=>[Be]),_:1}),t(r,{class:"ps-text-end ps-font-16"},{default:a(()=>[D(f(l.value?.payStubGeneral?.checkDateString),1)]),_:1})]),_:1}),t(n,null,{default:a(()=>[t(r,{cols:"6"},{default:a(()=>[Me]),_:1}),t(r,{class:"ps-text-end ps-font-16"},{default:a(()=>[D(f(P.value),1)]),_:1})]),_:1})]),_:1})])]),_:1})]),_:1}),t(r,{lg:"6",xl:"4",class:"mb-3 print-responsive"},{default:a(()=>[t(i,{class:"rounded","no-body":""},{default:a(()=>[s("div",Ne,[t(p(S),{icon:["fas","address-card"]}),s("span",null,[s("h2",Oe,f(p(w)?.payStubGeneral?.fullName),1)])]),s("div",null,[t(d,{fluid:""},{default:a(()=>[t(n,null,{default:a(()=>[t(r,{cols:"6"},{default:a(()=>[je]),_:1}),t(r,{class:"ps-text-end ps-font-16"},{default:a(()=>[D(f(p(w)?.payStubGeneral?.empNo),1)]),_:1})]),_:1}),t(n,null,{default:a(()=>[t(r,{cols:"6"},{default:a(()=>[Ke]),_:1}),t(r,{class:"ps-text-end ps-font-16"},{default:a(()=>[D(f(p(w)?.payStubGeneral?.address),1)]),_:1})]),_:1})]),_:1})])]),_:1})]),_:1})]),_:1})]),_:1}),s("div",ze,[t(n,{class:"dashboard__row mt-4"},{default:a(()=>[E(t(r,null,{default:a(()=>[t(i,{class:"rounded","no-body":""},{default:a(()=>[t(H,null,{default:a(()=>[Je]),_:1}),s("div",Qe,[(v(),G(p(R),L(W(m.HoursEarning),{store:M.value,ref_key:"grid",ref:$,key:x.value}),null,16,["store"]))])]),_:1})]),_:1},512),[[k,Y.value]])]),_:1}),t(n,{class:"dashboard__row mt-4"},{default:a(()=>[E(t(r,null,{default:a(()=>[t(i,{class:"rounded","no-body":""},{default:a(()=>[t(H,null,{default:a(()=>[Ue]),_:1}),s("div",Xe,[(v(),G(p(R),L(W(m.YearToDate),{store:N.value,ref_key:"grid",ref:$,key:x.value}),null,16,["store"]))])]),_:1})]),_:1},512),[[k,V.value]])]),_:1}),t(n,{class:"dashboard__row mt-4"},{default:a(()=>[E(t(r,null,{default:a(()=>[t(i,{class:"rounded","no-body":""},{default:a(()=>[t(H,null,{default:a(()=>[Ze]),_:1}),s("div",et,[(v(),G(p(R),L(W(m.TaxDeduction),{ref_key:"grid",ref:$,store:O.value,key:x.value}),null,16,["store"]))])]),_:1})]),_:1},512),[[k,A.value]]),E(t(r,null,{default:a(()=>[t(i,{class:"rounded","no-body":""},{default:a(()=>[t(H,null,{default:a(()=>[tt]),_:1}),s("div",at,[(v(),G(p(R),L(W(m.Fringes),{store:j.value,ref_key:"grid",ref:$,key:x.value}),null,16,["store"]))])]),_:1})]),_:1},512),[[k,F.value]]),s("div",st,[s("div",rt,[t(n,{"align-v":"center"},{default:a(()=>[t(r,null,{default:a(()=>[nt]),_:1}),t(r,{cols:"auto"},{default:a(()=>[s("div",ot,f(l.value?.payStubGeneral?.checkAmount?`$${l.value?.payStubGeneral?.checkAmount}`:""),1)]),_:1})]),_:1})])])]),_:1})])])])}}});const gt=Te(lt,[["__scopeId","data-v-0c63d545"]]);export{gt as default};