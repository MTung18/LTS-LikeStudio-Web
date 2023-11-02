import{W as z,a as K,F as B,b as j,R as $,c as W,B as X,P as Y,C as J,M as H,d as Q,e as Z,L as ee,S as ne,f as A,g as te,G as oe}from"./grid.module.3b00878a.js";import{a4 as de,_ as R,j as O,e as x,a5 as T,o as C,c as M,a6 as I,a7 as L,a1 as _,a as ae,F as le,z as ue,f as P,a8 as ie,a3 as re,a9 as fe}from"./index.611fe570.js";function G(){function i(d,e){window.bryntum&&window.bryntum.isTestEnv&&console.warn(`Bryntum${d}Component development warning!
${e}
Please check Vue integration guide: https://bryntum.com/products/grid/docs/guide/Grid/integration/vue/guide`)}function p(d,e){i(d,`Using "${e}" parameter for configuration is not recommended.
Widget is placed automatically inside it's container element.
Solution: remove "${e}" parameter from configuration.`)}function l(d,e){i(d,`Using "${e}" parameter for configuration is not recommended.
Solution: Use separate parameter for each "${e}" value to enable reactive updates of the API instance`)}function r(d,e){i(d,`"${e}" is a static config option for component constructor only. No runtime changes are supported!`)}function y({me:d,props:e,listeners:n,data:t,emit:o,element:a,processCellContent:u,hasFrameworkRenderer:S}){const{instanceClass:b,instanceName:w}=t,F=s=>s.filter(E=>e[E]!==void 0),v=F(t.configNames||[]),N=F(t.propertyConfigNames||[]),U=F(t.propertyNames||[]),D=F(t.featureNames||[]),V=t.eventNames.filter(s=>n[s]!==void 0||n[s.toLowerCase()]!==void 0),h={vueComponent:b.isModel?void 0:d,listeners:{},features:{},processCellContent:u,hasFrameworkRenderer:S};V.forEach(s=>{const E=`on${K.capitalize(s)}`;e[E]||(h.listeners[s]=q=>o(s.toLowerCase(),q))}),v.concat(N).concat(D).forEach(s=>{m(h,s,e[s]),["features","config"].includes(s)&&l(b.$name,s)}),h.cls=(h.cls||"")+` b-vue-${b.$name.toLowerCase()}-container`,t.configNames=v,t.propertyNames=v.concat(U).concat(N).concat(D),t.eventNames&&delete t.eventNames,t.propertyConfigNames&&delete t.propertyConfigNames,t.featureNames&&delete t.featureNames;const k=["adopt","appendTo","insertAfter","insertBefore"].find(s=>h[s]);return k?p(b.$name,k):w==="Button"?h.appendTo=a:h.adopt=a,h}function g(d,e){const{dataStores:n,projectStores:t}=d;n&&(Object.keys(n).forEach(o=>{const a=t?e.project[o]:e[o];a&&(a.syncDataOnLoad=a.syncDataOnLoad==null?!0:a.syncDataOnLoad,e&&e.relayStoreEvents&&a.relayAll(e,n[o]))}),delete d.dataStores)}function c(d){const{instanceClass:e}=d.data,n=y(d);return e.$name==="Widget"?z.createWidget(n):new e(n)}function m(d,e,n,t=!0){if(e==="project")n&&typeof n=="object"&&(d[e]=n.instance?n.instance.value||n.instance:n);else if(e==="features"&&typeof n=="object")Object.keys(n).forEach(o=>m(d,`${o}Feature`,n[o],t));else if(e==="config"&&typeof n=="object")Object.keys(n).forEach(o=>m(d,o,n[o],t));else if(e==="columns"&&!t)d.columns.data=n;else if(e.endsWith("Feature")){const o=d.features,a=e.replace("Feature","");if(t)o[a]=n;else{const u=o[a];u&&u.setConfig(n)}}else d[e]=n}function f(d,e,n,t,o){const{configNames:a,propertyNames:u,instanceClass:S}=t;u.forEach(b=>o(b,w=>{const F=Array.isArray(w)?w.slice():w;m(e,b,F,!1),a.includes(b)&&r(S.$name,b)})),delete t.configNames,delete t.propertyNames}return{createWidget:c,relayStores:g,watchProps:f}}function se(){function i({rendererData:l,rendererData:{record:r},rendererData:{cellElement:y},rendererData:{column:g},rendererHtml:c}){const{vueComponent:m}=this,{refs:f,refs:{teleportsHolder:d}}=m,{teleports:{value:e}}=m.provides,n=`${g.id}-${r.id}`,t=g.tree?y.querySelector(".b-tree-cell-value"):y;if(g.data.vue){const o=t.querySelector("[data-vue]");o&&d.appendChild(o);let a=f[n];a=Array.isArray(a)?a[0]:a,a&&a.$el.dataset.generation!==String(r.generation)&&(e.delete(n),a=null),a?t.appendChild(a.$el):de(()=>{const u={...c},{is:S}=u;delete u.is,e.set(n,{bind:u,key:n,is:S,to:t,generation:r.generation})})}}function p({cellContent:l,column:r}){return l&&typeof l=="object"&&r.data.vue}return{processCellContent:i,hasFrameworkRenderer:p}}const ce={name:"BryntumFullscreenButton",setup(){const i=O(null),p=O(null);return x(()=>{const l=i.value=B.enabled?z.createWidget({type:"button",appendTo:p.value,icon:"b-icon b-icon-fullscreen",tooltip:"Fullscreen",toggleable:!0,onToggle:({pressed:r})=>{r?B.request(document.documentElement):B.exit()}}):null;l&&B.onFullscreenChange(()=>{l.pressed=B.isFullscreen})}),T(()=>{i.value&&(B.onFullscreenChange(null),i.value.destroy())}),{refElement:p,instance:i}}},pe={ref:"refElement"};function ye(i,p,l,r,y,g){return C(),M("div",pe,null,512)}const ge=R(ce,[["render",ye]]),me={name:"BryntumButton",props:{adopt:{type:[HTMLElement,String],default:void 0},align:{type:[Object,String],default:void 0},anchor:{type:Boolean,default:void 0},ariaDescription:{type:String,default:void 0},ariaLabel:{type:String,default:void 0},bubbleEvents:{type:Object,default:void 0},callOnFunctions:{type:Boolean,default:void 0},centered:{type:Boolean,default:void 0},config:{type:Object,default:void 0},constrainTo:{type:[HTMLElement,j,$],default:void 0},contentElementCls:{type:[String,Object],default:void 0},defaultBindProperty:{type:String,default:void 0},dock:{type:[String,Object],default:void 0},draggable:{type:[Boolean,Object],default:void 0},floating:{type:Boolean,default:void 0},hideAnimation:{type:[Boolean,Object],default:void 0},htmlCls:{type:[String,Object],default:void 0},ignoreParentReadOnly:{type:Boolean,default:void 0},listeners:{type:Object,default:void 0},localeClass:{type:Function,default:void 0},localizable:{type:Boolean,default:void 0},localizableProperties:{type:Array,default:void 0},maskDefaults:{type:Object,default:void 0},masked:{type:[Boolean,String,Object],default:void 0},monitorResize:{type:Boolean,default:void 0},owner:{type:j,default:void 0},positioned:{type:Boolean,default:void 0},preventTooltipOnTouch:{type:Boolean,default:void 0},relayStoreEvents:{type:Boolean,default:void 0},ripple:{type:[Boolean,Object],default:void 0},rootElement:{type:ShadowRoot,default:void 0},scrollAction:{type:[String,null],default:void 0},showAnimation:{type:[Boolean,Object],default:void 0},showTooltipWhenDisabled:{type:Boolean,default:void 0},tab:{type:[Boolean,Object],default:void 0},tag:{type:String,default:void 0},textAlign:{type:String,default:void 0},title:{type:String,default:void 0},ui:{type:[String,Object],default:void 0},weight:{type:Number,default:void 0},alignSelf:{type:String,default:void 0},appendTo:{type:[HTMLElement,String],default:void 0},badge:{type:String,default:void 0},cls:{type:[String,Object],default:void 0},color:{type:String,default:void 0},content:{type:String,default:void 0},dataset:{type:Object,default:void 0},disabled:{type:Boolean,default:void 0},extraData:{type:[String,Number,Boolean,Object],default:void 0},flex:{type:[Number,String],default:void 0},height:{type:[Number,String],default:void 0},hidden:{type:Boolean,default:void 0},href:{type:String,default:void 0},html:{type:[String,Function],default:void 0},icon:{type:String,default:void 0},iconAlign:{type:String,default:void 0},id:{type:String,default:void 0},insertBefore:{type:[HTMLElement,String],default:void 0},insertFirst:{type:[HTMLElement,String],default:void 0},margin:{type:[Number,String],default:void 0},maxHeight:{type:[String,Number],default:void 0},maxWidth:{type:[String,Number],default:void 0},menu:{type:[j,Object],default:void 0},menuIcon:{type:String,default:void 0},minHeight:{type:[String,Number],default:void 0},minWidth:{type:[String,Number],default:void 0},pressed:{type:Boolean,default:void 0},pressedIcon:{type:String,default:void 0},readOnly:{type:Boolean,default:void 0},scrollable:{type:[W,Boolean,Object],default:void 0},target:{type:String,default:void 0},text:{type:String,default:void 0},toggleable:{type:Boolean,default:void 0},toggleGroup:{type:String,default:void 0},tooltip:{type:[String,Object],default:void 0},width:{type:[Number,String],default:void 0},x:{type:Number,default:void 0},y:{type:Number,default:void 0},anchorSize:{type:Array,default:void 0},type:{type:String,default:void 0},onAction:{type:Function,default:void 0},onBeforeDestroy:{type:Function,default:void 0},onBeforeHide:{type:Function,default:void 0},onBeforeShow:{type:Function,default:void 0},onBeforeShowMenu:{type:Function,default:void 0},onBeforeToggle:{type:Function,default:void 0},onCatchAll:{type:Function,default:void 0},onClick:{type:Function,default:void 0},onDestroy:{type:Function,default:void 0},onFocusIn:{type:Function,default:void 0},onFocusOut:{type:Function,default:void 0},onHide:{type:Function,default:void 0},onPaint:{type:Function,default:void 0},onReadOnly:{type:Function,default:void 0},onRecompose:{type:Function,default:void 0},onResize:{type:Function,default:void 0},onShow:{type:Function,default:void 0},onToggle:{type:Function,default:void 0}},emits:["action","beforedestroy","beforehide","beforeshow","beforeshowmenu","beforetoggle","catchall","click","destroy","focusin","focusout","hide","paint","recompose","resize","show","toggle"],data:()=>({instanceClass:X,instanceName:"Button",configNames:["adopt","align","anchor","ariaDescription","ariaLabel","bubbleEvents","callOnFunctions","centered","config","constrainTo","contentElementCls","defaultBindProperty","dock","draggable","floating","hideAnimation","htmlCls","ignoreParentReadOnly","listeners","localeClass","localizable","localizableProperties","maskDefaults","masked","monitorResize","owner","positioned","preventTooltipOnTouch","relayStoreEvents","ripple","rootElement","scrollAction","showAnimation","showTooltipWhenDisabled","tab","tag","textAlign","title","ui","weight"],propertyConfigNames:["alignSelf","appendTo","badge","cls","color","content","dataset","disabled","extraData","flex","height","hidden","href","html","icon","iconAlign","id","insertBefore","insertFirst","margin","maxHeight","maxWidth","menu","menuIcon","minHeight","minWidth","onAction","onBeforeDestroy","onBeforeHide","onBeforeShow","onBeforeShowMenu","onBeforeToggle","onCatchAll","onClick","onDestroy","onFocusIn","onFocusOut","onHide","onPaint","onReadOnly","onRecompose","onResize","onShow","onToggle","pressed","pressedIcon","readOnly","scrollable","target","text","toggleable","toggleGroup","tooltip","width","x","y"],propertyNames:["anchorSize","type"],eventNames:["action","beforeDestroy","beforeHide","beforeShow","beforeShowMenu","beforeToggle","catchAll","click","destroy","focusIn","focusOut","hide","paint","recompose","resize","show","toggle"]}),setup(i,{emit:p}){const l={},r=O(null),y=O(new Map),{createWidget:g,relayStores:c,watchProps:m}=G();return I("teleports",y),x(()=>{const f=L(),d=o=>o.charAt(0).toLowerCase()+o.slice(1),e=o=>d(o.slice(2)),n=Object.keys(f.props).filter(o=>typeof f.props[o]=="function"&&o.startsWith("on")&&o.length>2).map(e);l.value=g({me:f,props:f.props,data:f.data,listeners:n,emit:p,element:r.value});const t=(o,a)=>_(()=>f.props[o],a);m(f,l.value,f.props,f.data,t)}),T(()=>{l.value&&l.value.destroy()}),{instance:l,refElement:r,teleports:y}}},be={ref:"refElement"};function he(i,p,l,r,y,g){return C(),M("div",be,null,512)}const Se=R(me,[["render",he]]);document.title.split(" - ")[1]||document.title;const Fe={name:"BryntumGrid",props:{adopt:{type:[HTMLElement,String],default:void 0},align:{type:[Object,String],default:void 0},allowOver:{type:Boolean,default:void 0},anchor:{type:Boolean,default:void 0},anchorToTarget:{type:Boolean,default:void 0},animateRemovingRows:{type:Boolean,default:void 0},ariaDescription:{type:String,default:void 0},ariaLabel:{type:String,default:void 0},autoClose:{type:Boolean,default:void 0},autoHeight:{type:Boolean,default:void 0},autoShow:{type:Boolean,default:void 0},autoUpdateRecord:{type:Boolean,default:void 0},bbar:{type:Object,default:void 0},bodyCls:{type:[String,Object],default:void 0},bubbleEvents:{type:Object,default:void 0},callOnFunctions:{type:Boolean,default:void 0},centered:{type:Boolean,default:void 0},closable:{type:Boolean,default:void 0},closeAction:{type:String,default:void 0},collapsed:{type:Boolean,default:void 0},collapsible:{type:[Boolean,Y],default:void 0},columns:{type:[J,Object],default:void 0},config:{type:Object,default:void 0},constrainTo:{type:[HTMLElement,j,$],default:void 0},contentElementCls:{type:[String,Object],default:void 0},contextMenuTriggerEvent:{type:String,default:void 0},defaultBindProperty:{type:String,default:void 0},defaultFocus:{type:Function,default:void 0},defaultRegion:{type:String,default:void 0},defaults:{type:Object,default:void 0},destroyStore:{type:Boolean,default:void 0},disableGridRowModelWarning:{type:Boolean,default:void 0},dismissDelay:{type:Number,default:void 0},dock:{type:[String,Object],default:void 0},draggable:{type:[Boolean,Object],default:void 0},enableSticky:{type:Boolean,default:void 0},enableTextSelection:{type:Boolean,default:void 0},features:{type:Object,default:void 0},fillLastColumn:{type:Boolean,default:void 0},fixedRowHeight:{type:Boolean,default:void 0},floating:{type:Boolean,default:void 0},focusOnToFront:{type:Boolean,default:void 0},footer:{type:[Object,String],default:void 0},forElement:{type:HTMLElement,default:void 0},forSelector:{type:String,default:void 0},fullRowRefresh:{type:Boolean,default:void 0},getHtml:{type:[Function,String],default:void 0},getRowHeight:{type:Function,default:void 0},header:{type:[String,Boolean,Object],default:void 0},hideAnimation:{type:[Boolean,Object],default:void 0},hideDelay:{type:Number,default:void 0},hideHeaders:{type:Boolean,default:void 0},hideOnDelegateChange:{type:Boolean,default:void 0},hideWhenEmpty:{type:Boolean,default:void 0},hoverDelay:{type:Number,default:void 0},htmlCls:{type:[String,Object],default:void 0},ignoreParentReadOnly:{type:Boolean,default:void 0},itemCls:{type:String,default:void 0},keyMap:{type:Object,default:void 0},lazyItems:{type:[Object,Array],default:void 0},listeners:{type:Object,default:void 0},loadingMsg:{type:String,default:void 0},loadMask:{type:[String,Object,null],default:void 0},loadMaskDefaults:{type:[Object,H],default:void 0},loadMaskError:{type:[Object,H,Boolean],default:void 0},localeClass:{type:Function,default:void 0},localizable:{type:Boolean,default:void 0},localizableProperties:{type:Array,default:void 0},maskDefaults:{type:Object,default:void 0},masked:{type:[Boolean,String,Object],default:void 0},maximizable:{type:Boolean,default:void 0},maximized:{type:Boolean,default:void 0},modal:{type:Boolean,default:void 0},monitorResize:{type:Boolean,default:void 0},mouseOffsetX:{type:Number,default:void 0},mouseOffsetY:{type:Number,default:void 0},namedItems:{type:Object,default:void 0},owner:{type:j,default:void 0},plugins:{type:Array,default:void 0},positioned:{type:Boolean,default:void 0},preserveFocusOnDatasetChange:{type:Boolean,default:void 0},preserveScrollOnDatasetChange:{type:Boolean,default:void 0},preventTooltipOnTouch:{type:Boolean,default:void 0},relayStoreEvents:{type:Boolean,default:void 0},resizeToFitIncludesHeader:{type:Boolean,default:void 0},responsiveLevels:{type:Object,default:void 0},ripple:{type:[Boolean,Object],default:void 0},rootElement:{type:ShadowRoot,default:void 0},scrollAction:{type:[String,null],default:void 0},scrollerClass:{type:Function,default:void 0},scrollManager:{type:[Object,Q],default:void 0},selectionMode:{type:Object,default:void 0},showAnimation:{type:[Boolean,Object],default:void 0},showDirty:{type:Boolean,default:void 0},showOnClick:{type:Boolean,default:void 0},showOnHover:{type:Boolean,default:void 0},showTooltipWhenDisabled:{type:Boolean,default:void 0},stateful:{type:[Boolean,Object,Array],default:void 0},statefulEvents:{type:[Object,Array],default:void 0},stateId:{type:String,default:void 0},stateProvider:{type:Z,default:void 0},strips:{type:Object,default:void 0},subGridConfigs:{type:Object,default:void 0},syncMask:{type:[String,Object,null],default:void 0},tab:{type:[Boolean,Object],default:void 0},tag:{type:String,default:void 0},tbar:{type:Object,default:void 0},textAlign:{type:String,default:void 0},textContent:{type:Boolean,default:void 0},trackMouse:{type:Boolean,default:void 0},trapFocus:{type:Boolean,default:void 0},ui:{type:[String,Object],default:void 0},weight:{type:Number,default:void 0},alignSelf:{type:String,default:void 0},appendTo:{type:[HTMLElement,String],default:void 0},cls:{type:[String,Object],default:void 0},columnLines:{type:Boolean,default:void 0},content:{type:String,default:void 0},data:{type:Array,default:void 0},dataset:{type:Object,default:void 0},disabled:{type:Boolean,default:void 0},emptyText:{type:String,default:void 0},enableUndoRedoKeys:{type:Boolean,default:void 0},extraData:{type:[String,Number,Boolean,Object],default:void 0},flex:{type:[Number,String],default:void 0},height:{type:[Number,String],default:void 0},hidden:{type:Boolean,default:void 0},html:{type:[String,Function],default:void 0},id:{type:String,default:void 0},insertBefore:{type:[HTMLElement,String],default:void 0},insertFirst:{type:[HTMLElement,String],default:void 0},items:{type:[Array,Object],default:void 0},layout:{type:[ee,String,Object],default:void 0},layoutStyle:{type:Object,default:void 0},longPressTime:{type:Number,default:void 0},margin:{type:[Number,String],default:void 0},maxHeight:{type:[String,Number],default:void 0},maxWidth:{type:[String,Number],default:void 0},minHeight:{type:[String,Number],default:void 0},minWidth:{type:[String,Number],default:void 0},readOnly:{type:Boolean,default:void 0},rowHeight:{type:Number,default:void 0},scrollable:{type:[W,Boolean,Object],default:void 0},store:{type:[ne,Object],default:void 0},title:{type:String,default:void 0},tools:{type:Object,default:void 0},tooltip:{type:[String,Object],default:void 0},transitionDuration:{type:Number,default:void 0},width:{type:[Number,String],default:void 0},x:{type:Number,default:void 0},y:{type:Number,default:void 0},anchorSize:{type:Array,default:void 0},isSettingValues:{type:Boolean,default:void 0},isValid:{type:Boolean,default:void 0},record:{type:A,default:void 0},selectedCell:{type:te,default:void 0},selectedCells:{type:Array,default:void 0},selectedRecord:{type:A,default:void 0},selectedRecords:{type:Array,default:void 0},state:{type:Object,default:void 0},type:{type:String,default:void 0},values:{type:Object,default:void 0},onBeforeCancelCellEdit:{type:Function,default:void 0},onBeforeCellEditStart:{type:Function,default:void 0},onBeforeClose:{type:Function,default:void 0},onBeforeColumnDragStart:{type:Function,default:void 0},onBeforeColumnDropFinalize:{type:Function,default:void 0},onBeforeCopy:{type:Function,default:void 0},onBeforeDestroy:{type:Function,default:void 0},onBeforeFinishCellEdit:{type:Function,default:void 0},onBeforeHide:{type:Function,default:void 0},onBeforePaste:{type:Function,default:void 0},onBeforePdfExport:{type:Function,default:void 0},onBeforeRenderRow:{type:Function,default:void 0},onBeforeRenderRows:{type:Function,default:void 0},onBeforeSelectionChange:{type:Function,default:void 0},onBeforeSetRecord:{type:Function,default:void 0},onBeforeShow:{type:Function,default:void 0},onBeforeToggleGroup:{type:Function,default:void 0},onBeforeToggleNode:{type:Function,default:void 0},onCancelCellEdit:{type:Function,default:void 0},onCatchAll:{type:Function,default:void 0},onCellClick:{type:Function,default:void 0},onCellContextMenu:{type:Function,default:void 0},onCellDblClick:{type:Function,default:void 0},onCellMenuBeforeShow:{type:Function,default:void 0},onCellMenuItem:{type:Function,default:void 0},onCellMenuShow:{type:Function,default:void 0},onCellMenuToggleItem:{type:Function,default:void 0},onCellMouseOut:{type:Function,default:void 0},onCellMouseOver:{type:Function,default:void 0},onCollapseNode:{type:Function,default:void 0},onColumnDragStart:{type:Function,default:void 0},onColumnDrop:{type:Function,default:void 0},onContextMenuItem:{type:Function,default:void 0},onContextMenuToggleItem:{type:Function,default:void 0},onCopy:{type:Function,default:void 0},onDataChange:{type:Function,default:void 0},onDestroy:{type:Function,default:void 0},onDragSelecting:{type:Function,default:void 0},onExpandNode:{type:Function,default:void 0},onFinishCellEdit:{type:Function,default:void 0},onFocusIn:{type:Function,default:void 0},onFocusOut:{type:Function,default:void 0},onHeaderMenuBeforeShow:{type:Function,default:void 0},onHeaderMenuItem:{type:Function,default:void 0},onHeaderMenuShow:{type:Function,default:void 0},onHeaderMenuToggleItem:{type:Function,default:void 0},onHide:{type:Function,default:void 0},onMouseOut:{type:Function,default:void 0},onMouseOver:{type:Function,default:void 0},onPaint:{type:Function,default:void 0},onPaste:{type:Function,default:void 0},onPdfExport:{type:Function,default:void 0},onPointerOver:{type:Function,default:void 0},onReadOnly:{type:Function,default:void 0},onRecompose:{type:Function,default:void 0},onRenderRow:{type:Function,default:void 0},onRenderRows:{type:Function,default:void 0},onResize:{type:Function,default:void 0},onResponsive:{type:Function,default:void 0},onScroll:{type:Function,default:void 0},onSelectionChange:{type:Function,default:void 0},onSelectionModeChange:{type:Function,default:void 0},onShow:{type:Function,default:void 0},onStartCellEdit:{type:Function,default:void 0},onSubGridCollapse:{type:Function,default:void 0},onSubGridExpand:{type:Function,default:void 0},onToggleGroup:{type:Function,default:void 0},onToggleNode:{type:Function,default:void 0},onToolClick:{type:Function,default:void 0},cellCopyPasteFeature:{type:[Object,Boolean,String],default:void 0},cellEditFeature:{type:[Object,Boolean,String],default:void 0},cellMenuFeature:{type:[Object,Boolean,String],default:void 0},cellTooltipFeature:{type:[Object,Boolean,String],default:void 0},columnAutoWidthFeature:{type:[Object,Boolean,String],default:void 0},columnDragToolbarFeature:{type:[Object,Boolean,String],default:void 0},columnPickerFeature:{type:[Object,Boolean,String],default:void 0},columnRenameFeature:{type:[Object,Boolean,String],default:void 0},columnReorderFeature:{type:[Object,Boolean,String],default:void 0},columnResizeFeature:{type:[Object,Boolean,String],default:void 0},excelExporterFeature:{type:[Object,Boolean,String],default:void 0},fillHandleFeature:{type:[Object,Boolean,String],default:void 0},filterFeature:{type:[Object,Boolean,String],default:void 0},filterBarFeature:{type:[Object,Boolean,String],default:void 0},groupFeature:{type:[Object,Boolean,String],default:void 0},groupSummaryFeature:{type:[Object,Boolean,String],default:void 0},headerMenuFeature:{type:[Object,Boolean,String],default:void 0},mergeCellsFeature:{type:[Object,Boolean,String],default:void 0},multipageFeature:{type:[Object,Boolean,String],default:void 0},multipageverticalFeature:{type:[Object,Boolean,String],default:void 0},pdfExportFeature:{type:[Object,Boolean,String],default:void 0},quickFindFeature:{type:[Object,Boolean,String],default:void 0},regionResizeFeature:{type:[Object,Boolean,String],default:void 0},rowCopyPasteFeature:{type:[Object,Boolean,String],default:void 0},rowExpanderFeature:{type:[Object,Boolean,String],default:void 0},rowReorderFeature:{type:[Object,Boolean,String],default:void 0},searchFeature:{type:[Object,Boolean,String],default:void 0},singlepageFeature:{type:[Object,Boolean,String],default:void 0},sortFeature:{type:[Object,Boolean,String],default:void 0},stickyCellsFeature:{type:[Object,Boolean,String],default:void 0},stripeFeature:{type:[Object,Boolean,String],default:void 0},summaryFeature:{type:[Object,Boolean,String],default:void 0},treeFeature:{type:[Object,Boolean,String],default:void 0},treeGroupFeature:{type:[Object,Boolean,String],default:void 0}},emits:["beforecancelcelledit","beforecelleditstart","beforeclose","beforecolumndragstart","beforecolumndropfinalize","beforecopy","beforedestroy","beforefinishcelledit","beforehide","beforepaste","beforepdfexport","beforerenderrow","beforerenderrows","beforeselectionchange","beforesetrecord","beforeshow","beforetogglegroup","beforetogglenode","cancelcelledit","catchall","cellclick","cellcontextmenu","celldblclick","cellmenubeforeshow","cellmenuitem","cellmenushow","cellmenutoggleitem","cellmouseout","cellmouseover","collapsenode","columndragstart","columndrop","contextmenuitem","contextmenutoggleitem","copy","datachange","destroy","dragselecting","expandnode","finishcelledit","focusin","focusout","headermenubeforeshow","headermenuitem","headermenushow","headermenutoggleitem","hide","mouseout","mouseover","paint","paste","pdfexport","pointerover","recompose","renderrow","renderrows","resize","responsive","scroll","selectionchange","selectionmodechange","show","startcelledit","subgridcollapse","subgridexpand","togglegroup","togglenode","toolclick"],data:()=>({instanceClass:oe,instanceName:"Grid",isView:!0,dataStores:{store:"data"},projectStores:!1,featureNames:["cellCopyPasteFeature","cellEditFeature","cellMenuFeature","cellTooltipFeature","columnAutoWidthFeature","columnDragToolbarFeature","columnPickerFeature","columnRenameFeature","columnReorderFeature","columnResizeFeature","excelExporterFeature","fillHandleFeature","filterFeature","filterBarFeature","groupFeature","groupSummaryFeature","headerMenuFeature","mergeCellsFeature","multipageFeature","multipageverticalFeature","pdfExportFeature","quickFindFeature","regionResizeFeature","rowCopyPasteFeature","rowExpanderFeature","rowReorderFeature","searchFeature","singlepageFeature","sortFeature","stickyCellsFeature","stripeFeature","summaryFeature","treeFeature","treeGroupFeature"],configNames:["adopt","align","allowOver","anchor","anchorToTarget","animateRemovingRows","ariaDescription","ariaLabel","autoClose","autoHeight","autoShow","autoUpdateRecord","bbar","bodyCls","bubbleEvents","callOnFunctions","centered","closable","closeAction","collapsed","collapsible","columns","config","constrainTo","contentElementCls","contextMenuTriggerEvent","defaultBindProperty","defaultFocus","defaultRegion","defaults","destroyStore","disableGridRowModelWarning","dismissDelay","dock","draggable","enableSticky","enableTextSelection","features","fillLastColumn","fixedRowHeight","floating","focusOnToFront","footer","forElement","forSelector","fullRowRefresh","getHtml","getRowHeight","header","hideAnimation","hideDelay","hideHeaders","hideOnDelegateChange","hideWhenEmpty","hoverDelay","htmlCls","ignoreParentReadOnly","itemCls","keyMap","lazyItems","listeners","loadingMsg","loadMask","loadMaskDefaults","loadMaskError","localeClass","localizable","localizableProperties","maskDefaults","masked","maximizable","maximized","modal","monitorResize","mouseOffsetX","mouseOffsetY","namedItems","owner","plugins","positioned","preserveFocusOnDatasetChange","preserveScrollOnDatasetChange","preventTooltipOnTouch","relayStoreEvents","resizeToFitIncludesHeader","responsiveLevels","ripple","rootElement","scrollAction","scrollerClass","scrollManager","selectionMode","showAnimation","showDirty","showOnClick","showOnHover","showTooltipWhenDisabled","stateful","statefulEvents","stateId","stateProvider","strips","subGridConfigs","syncMask","tab","tag","tbar","textAlign","textContent","trackMouse","trapFocus","ui","weight"],propertyConfigNames:["alignSelf","appendTo","cls","columnLines","content","data","dataset","disabled","emptyText","enableUndoRedoKeys","extraData","flex","height","hidden","html","id","insertBefore","insertFirst","items","layout","layoutStyle","longPressTime","margin","maxHeight","maxWidth","minHeight","minWidth","onBeforeCancelCellEdit","onBeforeCellEditStart","onBeforeClose","onBeforeColumnDragStart","onBeforeColumnDropFinalize","onBeforeCopy","onBeforeDestroy","onBeforeFinishCellEdit","onBeforeHide","onBeforePaste","onBeforePdfExport","onBeforeRenderRow","onBeforeRenderRows","onBeforeSelectionChange","onBeforeSetRecord","onBeforeShow","onBeforeToggleGroup","onBeforeToggleNode","onCancelCellEdit","onCatchAll","onCellClick","onCellContextMenu","onCellDblClick","onCellMenuBeforeShow","onCellMenuItem","onCellMenuShow","onCellMenuToggleItem","onCellMouseOut","onCellMouseOver","onCollapseNode","onColumnDragStart","onColumnDrop","onContextMenuItem","onContextMenuToggleItem","onCopy","onDataChange","onDestroy","onDragSelecting","onExpandNode","onFinishCellEdit","onFocusIn","onFocusOut","onHeaderMenuBeforeShow","onHeaderMenuItem","onHeaderMenuShow","onHeaderMenuToggleItem","onHide","onMouseOut","onMouseOver","onPaint","onPaste","onPdfExport","onPointerOver","onReadOnly","onRecompose","onRenderRow","onRenderRows","onResize","onResponsive","onScroll","onSelectionChange","onSelectionModeChange","onShow","onStartCellEdit","onSubGridCollapse","onSubGridExpand","onToggleGroup","onToggleNode","onToolClick","readOnly","rowHeight","scrollable","store","title","tools","tooltip","transitionDuration","width","x","y"],propertyNames:["anchorSize","isSettingValues","isValid","record","selectedCell","selectedCells","selectedRecord","selectedRecords","state","type","values"],eventNames:["beforeCancelCellEdit","beforeCellEditStart","beforeClose","beforeColumnDragStart","beforeColumnDropFinalize","beforeCopy","beforeDestroy","beforeFinishCellEdit","beforeHide","beforePaste","beforePdfExport","beforeRenderRow","beforeRenderRows","beforeSelectionChange","beforeSetRecord","beforeShow","beforeToggleGroup","beforeToggleNode","cancelCellEdit","catchAll","cellClick","cellContextMenu","cellDblClick","cellMenuBeforeShow","cellMenuItem","cellMenuShow","cellMenuToggleItem","cellMouseOut","cellMouseOver","collapseNode","columnDragStart","columnDrop","contextMenuItem","contextMenuToggleItem","copy","dataChange","destroy","dragSelecting","expandNode","finishCellEdit","focusIn","focusOut","headerMenuBeforeShow","headerMenuItem","headerMenuShow","headerMenuToggleItem","hide","mouseOut","mouseOver","paint","paste","pdfExport","pointerOver","recompose","renderRow","renderRows","resize","responsive","scroll","selectionChange","selectionModeChange","show","startCellEdit","subGridCollapse","subGridExpand","toggleGroup","toggleNode","toolClick"]}),setup(i,{emit:p}){const l={},r=O(null),y=O(new Map),{createWidget:g,relayStores:c,watchProps:m}=G(),{processCellContent:f,hasFrameworkRenderer:d}=se();return I("teleports",y),x(()=>{const e=L(),n=u=>u.charAt(0).toLowerCase()+u.slice(1),t=u=>n(u.slice(2)),o=Object.keys(e.props).filter(u=>typeof e.props[u]=="function"&&u.startsWith("on")&&u.length>2).map(t);l.value=g({me:e,props:e.props,data:e.data,listeners:o,emit:p,element:r.value,processCellContent:f,hasFrameworkRenderer:d}),c(e.data,l.value);const a=(u,S)=>_(()=>e.props[u],S);m(e,l.value,e.props,e.data,a)}),T(()=>{l.value&&l.value.destroy()}),{instance:l,refElement:r,teleports:y}}},Be={ref:"refElement"},Ce={ref:"teleportsHolder",style:{display:"none"}};function Oe(i,p,l,r,y,g){return C(),M("div",Be,[ae("div",Ce,[(C(!0),M(le,null,ue(r.teleports.values(),c=>(C(),P(fe,{key:c.key,to:c.to},[(C(),P(ie(c.is),re({ref_for:!0,ref:c.key,"data-key":c.key,"data-generation":c.generation},c.bind,{"data-vue":""}),null,16,["data-key","data-generation"]))],8,["to"]))),128))],512)],512)}const Me=R(Fe,[["render",Oe]]);export{Me as B};