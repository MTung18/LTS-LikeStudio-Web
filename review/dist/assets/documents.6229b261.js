import{S as ye}from"./grid.module.3b00878a.js";import{B as _e}from"./BryntumGrid.2c4be387.js";import{B as he}from"./bryntumSearchBar.3bdd630f.js";import{u as O,a as r}from"./documentMetadataStore.ea29648e.js";import{f as N}from"./gridConfigDefaults.8c72c19b.js";import{f as Se}from"./filterStoreDataBySearchText.3eea2082.js";import{g as Ce,a as we}from"./statefulSortFeature.3df4a43a.js";import{d as V,l as De,dL as xe,bw as Fe,by as Pe,dM as Ie,W as ke,j as o,Q as Ae,bb as Be,T as $e,s as Te,b as G,a1 as y,e as Re,r as b,o as I,c as k,a as s,g as l,w as c,I as L,u as f,a3 as Ee,be as H,D as F,M as Me,a2 as Oe,F as Ne,bd as Ge,ax as Le,ay as He,_ as Ve}from"./index.611fe570.js";import{u as Ue,_ as We,a as je}from"./useBryntumSelector.93a74318.js";import{s as P}from"./SorterFunctions.d9cfdebe.js";import{_ as Qe}from"./deleteConfirmationModal.vue_vue_type_script_setup_true_lang.7d561088.js";import"./foundationCompanyCasConnectionStore.b3301598.js";import"./debounce.cf77a06e.js";import"./isObject.c4ad145e.js";import"./whqDocumentsApi.6aaa1d96.js";const qe=m=>(Le("data-v-af68baa8"),m=m(),He(),m),ze={id:"bulletin-board"},Je={class:"action-grid list__table list__table--onpage list__b-grid--hover"},Ke={id:"documentDeleteModalTable",class:"w-75"},Ye=qe(()=>s("tr",null,[s("th",null,"Name"),s("th",null,"Description")],-1)),Ze={key:0,class:"b-fa b-fa-download"},Xe={class:"ps-2"},et=V({__name:"documentList",setup(m){De.add(xe,Fe,Pe,Ie);const A=ke("$providePermissions"),u=o(!1),_=o(!1),B=o(""),p=o(!1),v=o(null),{notifySuccess:U,notifyError:W}=Ae(),$=Be();o(new Array);const j=$e(),{fetchDocumentList:Q,deleteDocument:q}=O(),{documentList:z,isDocumentDeleted:J}=Te(O()),K=["General","Administration","Company Policy","Employee Resource","Other"],i="documentListGrid",T={field:"name",ascending:!0},{currentSelectedRows:h,selectedRowCount:Y,isRowSelected:Z,bryntumSelectedRowHandler:X}=Ue(),ee=G(()=>j?.activeUserClient?.clientGuid??"Shared"),S=o(null),R=G(()=>S.value?.instance.value.features),E={type:"combo",valueField:"value",displayField:"label",cls:"is-restricted-combo",listItemTpl:({label:e})=>`${e}`,picker:{cls:"is-restricted-list"},store:{data:[{value:!0,label:"Yes"},{value:!1,label:"No"}]}},te=o({...N.gridConfig,...Ce(i),...we(i,T),minHeight:"40em",emptyText:"",selectionMode:{cell:!1,row:!1,autoWidth:!0,toggleable:!0,checkboxOnly:!0,showCheckAll:!0},columns:[{flex:2,text:"Name",id:"name",field:"name",groupable:!1,sortable:(e,t)=>P(e.data.name,t.data.name)},{flex:2,text:"Description",id:"description",field:"description",sortable:(e,t)=>P(e.data.description,t.data.description),groupable:!1},{flex:1,text:"Contains Restricted Info",id:"isRestricted",field:"isRestricted",align:"center",sortable:!0,groupable:!1,htmlEncode:!1,renderer:({record:e})=>e.isRestricted?'<span><i class="b-fa b-fa-exclamation-circle text-warning no-underline"></i></span>':"",editor:E,filterable:{filterField:Object.assign(E,{multiSelect:!0})}},{flex:1,text:"Category",id:"documentCategoryId",field:"documentCategoryId",sortable:(e,t)=>P(C(e.data.documentCategoryId),C(t.data.documentCategoryId)),groupable:!1,htmlEncode:!1,renderer:({record:e})=>`${ae(e.documentCategoryId)}`,filterable:{filterField:{type:"combo",multiSelect:!0,items:K.sort((e,t)=>e.localeCompare(t))},filterFn:({record:e,value:t})=>!t.length||t.map(x=>x.trim()).includes(C(e.documentCategoryId))}},{flex:1,type:"action",id:"action",text:"Actions",minWidth:200,columnDragToolbar:!1,enableHeaderContextMenu:!1,enableCellContextMenu:!1,cellCls:"b-action-cell--hover",actions:[{visible:!0,renderer:()=>'<i class="b-action-item b-fa b-fa-download btn btn-link text-success no-underline"><span>Download</span></i>',onClick:le},{visible:!0,renderer:()=>'<i class="b-action-item b-fa b-fa-trash-alt btn btn-link text-red no-underline"><span>Delete</span></i>',onClick:se}]}],listeners:{selectionChange:e=>X(h,e)}}),ae=e=>{switch(e){case r.General:return'<span class="btn rounded-pill px-2" style="background-color: #A03AFF; color:#fff;">General</span>';case r.Administration:return'<span class="btn rounded-pill px-2" style="background-color: #FF5094; color:#fff;">Administration</span>';case r.CompanyPolicy:return'<span class="btn rounded-pill px-2" style="background-color: #0376F2; color:#fff;">Company Policy</span>';case r.EmployeeResource:return'<span class="btn rounded-pill px-2" style="background-color: #12CBC4; color:#fff;">Employee Resource</span>';case r.Other:return'<span class="btn rounded-pill px-2" style="background-color: #FF6600; color:#fff;">Other</span>'}},C=e=>{switch(e){case r.General:return"General";case r.Administration:return"Administration";case r.CompanyPolicy:return"Company Policy";case r.EmployeeResource:return"Employee Resource";case r.Other:return"Other"}},n=o(new ye({...N.gridStoreConfig,sorters:[T],onFilter:()=>{d.value&&n.value.filters.count<M.value&&g(),M.value=n.value.filters.count}}));async function oe(){n.value.data=w.value;const e=localStorage.getItem(`${i}State`);e&&(n.value.state=JSON.parse(e))}const M=o(0),ne=["id","filePath","isRestricted","employeeId"],w=o(new Array);function g(){const e=Se(w.value,ne,d.value,n.value);n.value.data=e}const d=o(localStorage.getItem(`${i}SearchText`)??"");y(d,()=>{g()},{deep:!0}),y(Z,(e,t)=>{u.value=e}),y(u,(e,t)=>{e||(h.value=[],S.value?.instance.value.deselectAll())});async function le(e){await $.downloadFile(e.record.data.filePath)}function se(e){v.value=e.record.data,p.value=!0}function re(){const e=h.value.map(t=>t.filePath);u.value=!1,$.downloadFilesAsZip(e)}const ie=async()=>{try{p.value=!1,await q(v.value.id),J.value&&(U("Document has been deleted."),await D())}catch{W("Error occurred while deleting file.")}},ce=o(-1);y(ce,()=>{g()});function ue(){localStorage.setItem(`${i}State`,JSON.stringify(n.value.state)),localStorage.setItem(`${i}SearchText`,d.value)}function de(){n.value.clearFilters(),n.value.clearSorters(),localStorage.removeItem(`${i}State`),localStorage.removeItem(`${i}SearchText`)}function fe(){n.value.clearFilters(),R.value.filterBar.hideFilterBar()}async function D(){await Q(),w.value=z.value,await oe(),d.value!==""&&g()}async function me(){B.value=await Ge(H.ClientDocument,ee.value)}return Re(async()=>{await D(),await me()}),(e,t)=>{const x=b("fs-button"),pe=b("fs-col"),be=b("fs-row"),ve=b("fs-list-group-item"),ge=b("fs-list-group");return I(),k(Ne,null,[s("div",ze,[l(he,{title:"Documents","local-storage-key":i,"show-settings-button":!0,"show-search-button":!0,"show-filter-button":!0,"show-refresh-button":!1,"show-footer-search":!1,onSaveSettings:t[1]||(t[1]=a=>ue()),onClearSettings:t[2]||(t[2]=a=>de()),onHideFilterBar:t[3]||(t[3]=a=>fe()),onShowFilterBar:t[4]||(t[4]=a=>f(R).filterBar.showFilterBar()),onSearchTextInput:t[5]||(t[5]=a=>d.value=a)},{buttons:c(()=>[l(x,{variant:"btn-primary",class:"btn btn-primary ms-3",onClick:t[0]||(t[0]=a=>_.value=!0)},{default:c(()=>[L("Add Document")]),_:1})]),_:1}),s("div",Je,[l(f(_e),Ee({readOnly:!0},te.value,{store:n.value,ref_key:"grid",ref:S}),null,16,["store"])])]),l(We,{showPanel:_.value,"onUpdate:showPanel":t[6]||(t[6]=a=>_.value=a),docType:f(H).ClientDocument,folderPath:B.value,onDocumentUploaded:D},null,8,["showPanel","docType","folderPath"]),l(Qe,{showDeleteModal:p.value,"onUpdate:showDeleteModal":t[7]||(t[7]=a=>p.value=a),onOK:t[8]||(t[8]=a=>ie()),onCANCEL:t[9]||(t[9]=a=>p.value=!1)},{default:c(()=>[L(" Once a document is deleted, it cannot be retrieved. Are you sure you want to delete this document? "),l(be,null,{default:c(()=>[l(pe,{cols:"12"},{default:c(()=>[s("table",Ke,[Ye,s("tr",null,[s("td",null,F(v.value.name),1),s("td",null,F(v.value.description),1)])])]),_:1})]),_:1})]),_:1},8,["showDeleteModal"]),l(je,{"number-of-items-selected":f(Y),showPanel:u.value,"onUpdate:showPanel":t[10]||(t[10]=a=>u.value=a)},{default:c(()=>[l(ge,null,{default:c(()=>[l(ve,{button:"",onClick:re},{default:c(()=>[f(A).WHQ_254_3155?(I(),k("i",Ze,[s("span",Xe,F(f(Me).COMMON.DOWNLOAD),1)])):Oe("",!0)]),_:1})]),_:1})]),_:1},8,["number-of-items-selected","showPanel"])],64)}}});const tt=Ve(et,[["__scopeId","data-v-af68baa8"]]),at={class:"hq-pg list"},ot={class:"list__table"},_t=V({__name:"documents",setup(m){return(A,u)=>(I(),k("div",at,[s("div",ot,[l(tt,{ref:"documentTable"},null,512)])]))}});export{_t as default};