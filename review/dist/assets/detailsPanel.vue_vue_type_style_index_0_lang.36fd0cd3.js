import{d as S,l as T,af as $,b as f,r,o,f as d,bp as z,w as t,a,g as s,I as E,c as g,z as h,u as l,F as p,D as _,C as v,a2 as I,aH as L,a4 as j,aY as M,A as O}from"./index.611fe570.js";import{A as P,_ as R}from"./panelConfig.9fc2559c.js";const U={class:"mr-3 d-flex align-items-center"},Y={class:"h5 pl-2 my-auto fw-bold"},q={class:"d-flex align-items-center"},G={class:"d-flex justify-content-between p-2"},J={class:"d-none d-lg-inline"},K={class:"d-flex flex-column h-100 w-100"},Q={class:"h5 fw-bold"},W={class:"d-none d-lg-inline"},ee=S({__name:"detailsPanel",props:{details:null,config:null,showPanel:{type:Boolean,default:!1}},emits:["update:showPanel","actionHandler","editHandler"],setup(i,{emit:V}){const u=i;T.add($);const m=f({get(){return u.showPanel},set(c){j(),V("update:showPanel",c)}}),w=f(()=>M.exports.sortBy(u.details,"order")),B=f(()=>u.config.actions.filter(c=>c.placement===P.Footer)),D=f(()=>u.config.actions.filter(c=>c.placement===P.Header));return(c,k)=>{const F=r("fs-link"),b=r("fs-button"),y=r("fs-col"),H=r("fs-row"),C=r("fs-container"),N=r("fs-sidebar");return o(),d(N,{"sidebar-class":"fsi-sidebar",right:"","no-close-on-esc":"","no-close-on-backdrop":"","bg-variant":"white",width:"425px",shadow:"sm","header-class":"border-bottom bg-grey--000 details_panel_header","footer-class":"border-top","aria-label":"addDocumentMetaData","no-header-close":"",modelValue:l(m),"onUpdate:modelValue":k[0]||(k[0]=e=>L(m)?m.value=e:null)},z({title:t(({hide:e})=>[a("div",U,[a("div",Y,_(i.config.title),1),a("strong",null,[a("div",q,[s(F,{class:"ms-auto text-secondary",tag:"a",onClick:e},{default:t(()=>[s(l(v),{icon:["fal","times"],size:"sm"})]),_:2},1032,["onClick"])])])])]),default:t(()=>[a("div",K,[i.config.showHeader?(o(),d(C,{key:0,fluid:""},{default:t(()=>[s(H,{class:"align-items-center py-2 border border-top-0 border-start-0 border-end-0 mt-2"},{default:t(()=>[s(y,null,{default:t(()=>[a("div",Q,_(i.config.subTitle),1)]),_:1}),s(y,{cols:"auto"},{default:t(()=>[(o(!0),g(p,null,h(l(D),(e,n)=>(o(),d(b,{key:n,class:O(e.class),title:e.tooltip,variant:e.variant,onClick:x=>e.handler(i.config.source)},{default:t(()=>[s(l(v),{icon:e.icon},null,8,["icon"]),a("span",W,_(e.name),1)]),_:2},1032,["class","title","variant","onClick"]))),128))]),_:1})]),_:1})]),_:1})):I("",!0),s(C,{fluid:""},{default:t(()=>[(o(!0),g(p,null,h(l(w),(e,n)=>(o(),d(R,{key:n,detail:e,"show-border":l(w)?.length-1!=n},null,8,["detail","show-border"]))),128))]),_:1})])]),_:2},[i.config.showFooter?{name:"footer",fn:t(({hide:e})=>[a("div",G,[s(b,{variant:"outline-secondary",class:"btn btn-outline-gray",onClick:e},{default:t(()=>[E("CLOSE")]),_:2},1032,["onClick"]),(o(!0),g(p,null,h(l(B),(n,x)=>(o(),d(b,{key:x,variant:n.variant,onClick:X=>n.handler(i.config.source)},{default:t(()=>[s(l(v),{icon:n.icon},null,8,["icon"]),a("span",J,_(n.name),1)]),_:2},1032,["variant","onClick"]))),128))])]),key:"0"}:void 0]),1032,["modelValue"])}}});export{ee as _};