var Fh=Object.defineProperty;var Nh=(s,e,t)=>e in s?Fh(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var pa=(s,e,t)=>Nh(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Oh=1;function Bh(){return{type:"hello",protocol:Oh}}function ma(s){return JSON.stringify(s)}function kh(s){const e=JSON.parse(s);if(!e||typeof e!="object"||!e.type)throw new Error("Neplatná zpráva protokolu");return e}class zh{constructor(e,t,{WebSocketImpl:n=globalThis.WebSocket,schedule:i=(d,u)=>setTimeout(d,u),minBackoff:r=500,maxBackoff:o=1e4,onStatus:a=()=>{},onAction:l=()=>{},onLog:c=()=>{},resolveStore:h=null}={}){this.url=e,this.store=t,this.WebSocketImpl=n,this.schedule=i,this.minBackoff=r,this.maxBackoff=o,this.backoff=r,this.onStatus=a,this.onAction=l,this.onLog=c,this.resolveStore=h,this.stopped=!1,this.everConnected=!1,this.ws=null}_storeFor(e){if(this.resolveStore){const t=this.resolveStore(e);if(t)return t}return this.store}connect(){const e=new this.WebSocketImpl(this.url);this.ws=e,e.onopen=()=>{this.everConnected=!0,this.backoff=this.minBackoff,e.send(ma(Bh()))},e.onmessage=t=>this._onMessage(t.data),e.onclose=()=>{this.stopped||(this.onStatus(this.everConnected?"close":"connect_failed"),this.schedule(()=>this.connect(),this.backoff),this.backoff=Math.min(this.backoff*2,this.maxBackoff))}}_onMessage(e){let t;try{t=kh(e)}catch(n){console.warn("viewbase: vadná zpráva ze serveru",n);return}t.type==="init"?(this._storeFor(t.screen_id).applyInit(t),this.onStatus("init")):t.type==="patch"?this._storeFor(t.screen_id).applyPatch(t)||this.ws.close():t.type==="action"?this.onAction(t):t.type==="log"?this.onLog(t):t.type==="error"&&(console.error("viewbase server:",t.error),t.error==="protocol_mismatch"&&(this.stopped=!0,this.onStatus("protocol_mismatch")))}send(e){this.ws&&this.ws.readyState===1&&this.ws.send(ma(e))}}const ga={frontend_error:"81000004",connection_lost:"8100000B",backend_error:"81000003"};function Gh(s){let e=2166136261;for(let t=0;t<s.length;t+=1)e^=s.charCodeAt(t),e=Math.imul(e,16777619);return(e>>>0).toString(16).toUpperCase().padStart(8,"0")}function Hh(s,e){return`${ga[s]??ga.frontend_error}.${Gh(e??"")}`}const _a="vb-guru-style";function Vh(){if(document.getElementById(_a))return;const s=document.createElement("style");s.id=_a,s.textContent=`
    @keyframes vb-guru-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.15; } }
  `,document.head.appendChild(s)}class Wh{constructor(e=document.body){Vh(),this.reason=null,this.el=document.createElement("div"),this.el.dataset.role="vb-guru-meditation",this.el.style.cssText=["position:fixed","inset:0","z-index:9999","display:none","background:#000000","cursor:pointer",'font-family:"Courier New",monospace',"user-select:none"].join(";"),this.box=document.createElement("div"),this.box.dataset.role="vb-guru-box",this.box.style.cssText=["position:absolute","top:50%","left:50%","transform:translate(-50%,-50%)","border:3px solid #ff0000","padding:18px 28px","color:#ff0000","text-align:center","font-size:18px","font-weight:bold","letter-spacing:0.5px","white-space:nowrap","animation:vb-guru-blink 1s step-start infinite"].join(";"),this.bar=document.createElement("div"),this.bar.dataset.role="vb-guru-bar",this.bar.textContent="Software Failure.  Press mouse button or Esc to continue.",this.code=document.createElement("div"),this.code.dataset.role="vb-guru-code",this.code.style.cssText="margin-top:6px",this.box.append(this.bar,this.code),this.detail=document.createElement("div"),this.detail.dataset.role="vb-guru-detail",this.detail.style.cssText=["position:absolute","left:50%","bottom:12%","transform:translateX(-50%)","max-width:70%","color:#663333","text-align:center","font-size:13px","white-space:pre-wrap","word-break:break-word"].join(";"),this.el.append(this.box,this.detail),this.el.addEventListener("mousedown",()=>this.hide()),this._onKeydown=t=>{t.code==="Escape"&&this.visible&&(t.preventDefault(),this.hide())},window.addEventListener("keydown",this._onKeydown),e.appendChild(this.el)}show(e,t){this.reason=e,this.code.textContent=`Guru Meditation #${Hh(e,t)}`,this.detail.textContent=t??"",this.el.style.display="block"}hide(){this.el.style.display="none",this.reason=null}get visible(){return this.el.style.display!=="none"}dismissIfConnectionRecovered(){this.reason==="connection_lost"&&this.hide()}}class Xh{constructor(e=document.body){this.el=document.createElement("div"),this.el.dataset.role="status-overlay",this.el.style.cssText=["position:fixed","top:16px","left:50%","transform:translateX(-50%)","max-width:70%","padding:10px 18px","border-radius:6px","background:var(--vb-status-bg, rgba(20,23,28,0.85))","color:var(--vb-status-fg, #ffffff)","font:14px/1.4 system-ui,sans-serif","z-index:1000","display:none","pointer-events:none","text-align:center"].join(";"),e.appendChild(this.el)}show(e){this.el.textContent=e,this.el.style.display="block"}hide(){this.el.style.display="none"}}const Ac=["debug","info","warning","error"],Cc=["frontend","backend_api","backend_program","backend_user"];function Yh(){return{levels:Object.fromEntries(Ac.map(s=>[s,!0])),sources:Object.fromEntries(Cc.map(s=>[s,!0]))}}function jh(s,e){return!(e.levels[s.level]===!1||e.sources[s.source]===!1)}function qh(s){const e=s instanceof Date?s:new Date(s),t=n=>String(n).padStart(2,"0");return`${t(e.getHours())}:${t(e.getMinutes())}:${t(e.getSeconds())}`}function Rc(s){const e=s.component?`${s.source}/${s.component}`:s.source;return`${s.timestamp?`${qh(s.timestamp)} `:""}[${s.level}] ${e}: ${s.message}`}const Kh="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAQklEQVR4nGNgGOyAEY3/nwK9WAGxBuJUx8RAZcBEbQNZKAiC/9jClIVKgf+frl7+T21LKEpGTAxDPdmAAE3DlP4AAGatChUYxZWAAAAAAElFTkSuQmCC";class ur{constructor(){this.config={},this.nodeTypes={},this.flowTypes={},this.flows=[],this.windows=[],this.menu=null,this.nodes=new Map,this.edges=new Map,this.seq=-1,this.listeners=new Set}static edgeKey(e,t){return e<=t?`${e}\0${t}`:`${t}\0${e}`}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}_emit(e){for(const t of this.listeners)t(e)}applyInit(e){this.config=e.config,this.nodeTypes=e.node_types,this.flowTypes=e.flow_types??{},this.flows=e.flows??[],this.windows=e.windows??[],this.menu=e.menu??null,this.nodes.clear(),this.edges.clear();for(const t of e.nodes)this.nodes.set(t.id,t);for(const t of e.edges)this.edges.set(ur.edgeKey(t.source,t.target),t);this.seq=e.seq,this._emit({kind:"init"})}applyNodeType(e,t){this.nodeTypes[e]=t??{}}applyPatch(e){if(e.seq!==this.seq+1)return!1;for(const[t,n]of e.remove_edges)this.edges.delete(ur.edgeKey(t,n));for(const t of e.remove_nodes){this.nodes.delete(t);for(const[n,i]of this.edges)(i.source===t||i.target===t)&&this.edges.delete(n)}for(const t of e.add_nodes)this.nodes.set(t.id,t);for(const t of e.update_nodes)this.nodes.set(t.id,t);for(const t of e.add_edges){if(!this.nodes.has(t.source)||!this.nodes.has(t.target)){console.warn("viewbase: hrana s neznámým koncem přeskočena",t.source,t.target);continue}this.edges.set(ur.edgeKey(t.source,t.target),t)}return this.seq=e.seq,this._emit({kind:"patch",patch:e}),!0}}const Zh="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAYAAAC9+TVUAAAALklEQVR4nGNgGAU0AYx45P6TqJ4oQ/7jUshEqsnYwKghmICFAT/4T0B+FNASAAAy+AQNJ950wAAAAABJRU5ErkJggg==",Jh="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAARElEQVR4nGNgGAWUAkY0/n8K9GIFxBqIUx0TA5UBE7UNZKEgCP5jC1MWKgX+f7p6+T+1LaEoGTExDPVkQ/MwHQUMGAAAyPMKFTpfYu8AAAAASUVORK5CYII=",Qh="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAOklEQVR4nGNgGCyAEYn9n1z9LEQazIhFHdxSJgYqAKbhZQgLFrH/lBrCOLTDhIkahrCg8f9Tw9AhDgDcVQUfvazRGgAAAABJRU5ErkJggg==";function ks(s,e,t,n,i){const r=Math.max(0,i.width-t),o=Math.max(0,i.height-n);return{x:Math.min(Math.max(0,s),r),y:Math.min(Math.max(0,e),o)}}function $h(s,e,t,n,i){return{x:s*(e+t),y:n-i}}const va=160,eu=8,xa=28,tu="vb-pos:",ya=26,Pc=180,Uc=90,Sa=28,nu="0.35";function iu(s,e){const t=s??e;return t?tu+String(t):null}function ru(s,e,t,n,i,r){const o=Math.max(1,i==null?void 0:i.w),a=Math.max(1,i==null?void 0:i.h),l=Math.max(a,Math.min(s.h+n,r.height-s.y));if(e==="sw"){const h=s.x+s.w,d=Math.max(o,Math.min(s.w-t,h));return{x:h-d,y:s.y,w:d,h:l}}const c=Math.max(o,Math.min(s.w+t,r.width-s.x));return{x:s.x,y:s.y,w:c,h:l}}class mr{constructor({id:e,title:t,widthChars:n,container:i,manager:r,kind:o,closable:a=!0,optionsProvider:l=null}){this.id=e,this.title=t,this.widthChars=n,this.container=i,this.manager=r,this.kind=o,this.closable=a!==!1,this.optionsProvider=l,this.isMinimized=!1,this.saved=null,this.maximizedFrom=null,this.dragOffset=null,this.resizeState=null,this.size=null,this.grips=[],this.body=null,this.el=document.createElement("div"),this.el.dataset.role="vb-window",this.el.dataset.windowId=String(e),this.el.style.cssText=["position:absolute","left:0","top:0","box-sizing:border-box","background:var(--vb-window-body-bg, rgba(255,255,255,0.97))","color:var(--vb-window-body-fg, #1f2430)","box-shadow:var(--vb-window-shadow, 0 6px 20px rgba(0,0,0,0.22))","border:1px solid var(--vb-window-border, transparent)","border-radius:6px","overflow:hidden","user-select:none","font:13px/1.5 system-ui,sans-serif","z-index:900"].join(";"),this._buildHeader()}_buildBody(){}_renderBody(){}_mount(){this.container.appendChild(this.el),this._buildGrips();const e=this._loadPos();e&&Number.isFinite(e.w)&&Number.isFinite(e.h)&&this._applySize(e.w,e.h);const t=this._bounds(),n=this.manager.windows.size%8*24,i=ks(40+n,40+n,this._boxW(),this._boxH(),t),r=e?ks(e.x,e.y,this._boxW(),this._boxH(),t):i;this._place(r.x,r.y),this.el.addEventListener("pointerdown",()=>this.bringToFront())}_posKey(){return iu(this.id,this.title)}_loadPos(){const e=this._posKey();if(!e)return null;try{const t=localStorage.getItem(e);if(!t)return null;const n=JSON.parse(t);if(Number.isFinite(n==null?void 0:n.x)&&Number.isFinite(n==null?void 0:n.y))return n}catch{}return null}_savePos(){const e=this._posKey();if(!e)return;const t={x:this.x,y:this.y};this.size&&(t.w=this.size.w,t.h=this.size.h);try{localStorage.setItem(e,JSON.stringify(t))}catch{}}_width(){return this.widthChars*8+24}_boxW(){return this.size?this.size.w:this._width()}_boxH(){return this.size?this.size.h:200}_bounds(){return{width:this.container.clientWidth||800,height:this.container.clientHeight||600}}_buildHeader(){const e=document.createElement("div");e.dataset.role="vb-titlebar",e.style.cssText=["display:flex","align-items:center","gap:6px","padding:4px 6px","cursor:move","background:var(--vb-window-header-bg, #d8dde6)","background-image:var(--vb-window-header-pattern, none)","color:var(--vb-window-header-fg, #1f2430)"].join(";"),this.closeGadget=null,this.closable&&(this.closeGadget=this._gadget("close",Zh),this.closeGadget.addEventListener("click",t=>{t.stopPropagation(),this.close()})),this.titleEl=document.createElement("div"),this.titleEl.textContent=this.title,this.titleEl.style.cssText=["flex:1","text-align:center","font-weight:600","white-space:nowrap","overflow:hidden","text-overflow:ellipsis"].join(";"),this.minGadget=this._gadget("minimize",Qh),this.minGadget.addEventListener("click",t=>{t.stopPropagation(),this.minimize()}),this.restoreGadget=this._gadget("restore",Jh),this.restoreGadget.addEventListener("click",t=>{t.stopPropagation(),this.restore()}),this.restoreGadget.style.display="none",this.closeGadget&&e.append(this.closeGadget),e.append(this.titleEl,this.minGadget,this.restoreGadget),this._dragFromHeader(e),e.addEventListener("dblclick",t=>{t.target.dataset.gadget||this.toggleMaximize()}),this.bar=e,this.el.appendChild(e)}_gadget(e,t){const n=document.createElement("button");return n.dataset.gadget=e,n.style.cssText=["flex:0 0 auto","width:18px","height:18px","padding:0","border:none","cursor:pointer","background:var(--vb-window-gadget, #5a6573)",`-webkit-mask:url("${t}") center/100% 100% no-repeat`,`mask:url("${t}") center/100% 100% no-repeat`].join(";"),n}_dragFromHeader(e){e.addEventListener("pointerdown",n=>{if(n.target.dataset.gadget)return;this.bringToFront();const i=this.el.getBoundingClientRect(),r=this.container.getBoundingClientRect();this.dragOffset={x:n.clientX-i.left,y:n.clientY-i.top,contLeft:r.left,contTop:r.top},e.setPointerCapture(n.pointerId)}),e.addEventListener("pointermove",n=>{if(!this.dragOffset||this.isMinimized)return;const i=n.clientX-this.dragOffset.contLeft-this.dragOffset.x,r=n.clientY-this.dragOffset.contTop-this.dragOffset.y,o=ks(i,r,this._boxW(),this._headerH(),this._bounds());this._place(o.x,o.y)});const t=n=>{if(this.dragOffset){this.dragOffset=null;try{e.releasePointerCapture(n.pointerId)}catch{}this.isMinimized||this._savePos()}};e.addEventListener("pointerup",t),e.addEventListener("pointercancel",t)}_headerH(){return this.bar.offsetHeight||xa}_buildGrips(){this.grips=["se","sw"].map(e=>{const t=document.createElement("div");return t.dataset.role=`vb-resize-${e}`,t.style.cssText=["position:absolute","bottom:2px",e==="se"?"right:2px":"left:2px",`width:${Sa}px`,`height:${Sa}px`,"box-sizing:border-box","border-radius:3px","background:var(--vb-window-gadget, #8a93a3)","border:1px solid var(--vb-window-gadget, #8a93a3)","opacity:0","transition:opacity 0.12s","touch-action:none",`cursor:${e==="se"?"nwse":"nesw"}-resize`].join(";"),t.addEventListener("pointerenter",()=>this._showGrip(t,!0)),t.addEventListener("pointerleave",()=>this._showGrip(t,!1)),this._resizeFromGrip(t,e),this.el.appendChild(t),t})}_showGrip(e,t){!t&&this.resizeState||(e.style.opacity=t&&!this.isMinimized?nu:"0")}_resizeFromGrip(e,t){e.addEventListener("pointerdown",i=>{if(this.isMinimized)return;i.stopPropagation(),this.bringToFront();const r=this.el.getBoundingClientRect();this.resizeState={corner:t,pointerX:i.clientX,pointerY:i.clientY,start:{x:this.x,y:this.y,w:r.width||this._boxW(),h:r.height||this._boxH()}},this._showGrip(e,!0),e.setPointerCapture(i.pointerId)}),e.addEventListener("pointermove",i=>{if(!this.resizeState||this.isMinimized)return;const r=this.resizeState,o=ru(r.start,r.corner,i.clientX-r.pointerX,i.clientY-r.pointerY,{w:Pc,h:Uc},this._bounds());this._place(o.x,o.y),this._applySize(o.w,o.h)});const n=i=>{if(this.resizeState){this.resizeState=null;try{e.releasePointerCapture(i.pointerId)}catch{}this._showGrip(e,!1),this._savePos()}};e.addEventListener("pointerup",n),e.addEventListener("pointercancel",n)}_applySize(e,t){this.size={w:Math.round(e),h:Math.round(t)},this.el.style.width=`${this.size.w}px`,this.el.style.height=`${this.size.h}px`,this.body&&(this.body.style.boxSizing="border-box",this.body.style.width="100%",this.body.style.maxWidth="none",this.body.style.height=`${Math.max(0,this.size.h-this._headerH())}px`,this.body.style.overflow="auto")}_place(e,t){this.x=e,this.y=t,this.el.style.left=`${e}px`,this.el.style.top=`${t}px`}toggleMaximize(){if(this.isMinimized)return;const e=this._bounds();if(this.maximizedFrom){const t=this.maximizedFrom;this.maximizedFrom=null,this._applySize(t.w,t.h),this._place(t.x,t.y)}else{const t=this.el.getBoundingClientRect();this.maximizedFrom={x:this.x,y:this.y,w:t.width||this._boxW(),h:t.height||this._boxH()},this._place(0,ya),this._applySize(e.width,e.height-ya)}this._savePos()}minimize(){if(this.isMinimized)return;this.isMinimized=!0,this.saved={x:this.x,y:this.y},this.body.style.display="none",this.minGadget.style.display="none",this.restoreGadget.style.display="",this.el.dataset.role="vb-dock-strip",this.el.style.background="var(--vb-window-dock-bg, #c2c9d4)",this.el.style.width=`${va}px`,this.el.style.height="";for(const i of this.grips)i.style.display="none";this.titleEl.style.fontSize="11px";const e=this.manager._assignDockSlot(this),t=this._bounds(),n=$h(e,va,eu,t.height,xa);this._place(n.x,n.y)}restore(){if(!this.isMinimized)return;this.isMinimized=!1,this.manager._releaseDockSlot(this),this.el.dataset.role="vb-window",this.el.style.background="var(--vb-window-body-bg, rgba(255,255,255,0.97))",this.el.style.width="",this.titleEl.style.fontSize="",this.body.style.display="",this.minGadget.style.display="",this.restoreGadget.style.display="none";for(const t of this.grips)t.style.display="";this.size&&this._applySize(this.size.w,this.size.h),this._renderBody();const e=this.saved??{x:40,y:40};this._place(e.x,e.y),this.bringToFront()}getOptionsItems(){return this.optionsProvider?this.optionsProvider():null}bringToFront(){this.setZ(this.manager._nextZ()),this.manager._setActive(this)}setZ(e){this.el.style.zIndex=String(e)}applyTheme(){this.isMinimized||this._renderBody()}close(){this.isMinimized&&this.manager._releaseDockSlot(this),this.el.remove(),this.manager._forget(this.id)}}function wo(s,e,{now:t=()=>Date.now(),schedule:n=(i,r)=>setTimeout(i,r)}={}){let i=-1/0,r=null,o=!1;function a(l){i=t(),s(...l)}return(...l)=>{const c=t()-i;if(!o&&c>=e){a(l);return}r=l,o||(o=!0,n(()=>{o=!1;const h=r;r=null,a(h)},Math.max(0,e-c)))}}const su=150;function ou(s,e){if(s.type==="int"){const t=Math.round(Number(e));return Number.isFinite(t)?Math.max(s.min,Math.min(s.max,t)):s.value}if(s.type==="number"){const t=Number(e);return Number.isFinite(t)?Math.max(s.min,Math.min(s.max,t)):s.value}return s.type==="bool"?typeof e=="boolean"?e:s.value:s.type==="string"?String(e??"").slice(0,s.maxlength):s.type==="enum"&&s.options.some(t=>t.value===e)?e:s.value}function au(s,e){const t={};for(const n of s)n.key in e&&(t[n.key]=ou(n,e[n.key]));return t}class lu extends mr{constructor({id:e,title:t,fields:n,widthChars:i,onSubmit:r,container:o,manager:a,live:l=!1,closable:c}){super({id:e,title:t,widthChars:i,container:o,manager:a,kind:"control",closable:c}),this.fields=n,this.onSubmit=r,this.live=!!l,this.inputs=new Map,this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="control-body",e.style.cssText=["padding:8px 10px",`width:${this.widthChars}ch`,"max-width:90vw","font:13px/1.5 system-ui,sans-serif"].join(";"),this.body=e;const t=document.createElement("table");t.style.cssText="border-collapse:collapse;width:100%";for(const n of this.fields){const i=t.insertRow(),r=i.insertCell();r.textContent=n.label,r.style.cssText=["padding:3px 10px 3px 0","white-space:nowrap","color:var(--vb-window-key, #667788)"].join(";");const o=i.insertCell();o.style.cssText="padding:3px 0",this.inputs.set(n.key,this._buildWidget(n,o))}if(e.appendChild(t),this.live){const n=wo(()=>this._submit(),su);e.addEventListener("input",n),e.addEventListener("change",n)}else{const n=document.createElement("button");n.dataset.role="control-apply",n.textContent="Použít",n.style.cssText=["margin-top:8px","padding:3px 12px","cursor:pointer","border:1px solid var(--vb-window-gadget, #8a93a3)","border-radius:4px","background:transparent","color:inherit"].join(";"),n.addEventListener("click",i=>{i.stopPropagation(),this._submit()}),e.appendChild(n)}this.el.appendChild(e)}_buildWidget(e,t){if(e.type==="enum"){const i=document.createElement("select");for(const r of e.options){const o=document.createElement("option");o.value=String(r.value),o.textContent=r.label,String(r.value)===String(e.value)&&(o.selected=!0),i.appendChild(o)}return t.appendChild(i),()=>{var r;return((r=e.options.find(o=>String(o.value)===i.value))==null?void 0:r.value)??e.value}}if(e.type==="int"||e.type==="number"){const i=e.step??(e.type==="int"?1:"any"),r=document.createElement("input");r.type="range",r.min=e.min,r.max=e.max,r.step=i==="any"?(e.max-e.min)/100||"any":i,r.value=e.value;const o=document.createElement("input");return o.type="number",o.min=e.min,o.max=e.max,o.step=i,o.value=e.value,o.style.cssText="width:5em;margin-left:6px",r.addEventListener("input",()=>{o.value=r.value}),o.addEventListener("input",()=>{r.value=o.value}),t.append(r,o),()=>o.value}if(e.type==="bool"){const i=document.createElement("input");return i.type="checkbox",i.checked=!!e.value,t.appendChild(i),()=>i.checked}const n=document.createElement("input");return n.type="text",n.maxLength=e.maxlength,n.value=e.value,t.appendChild(n),()=>n.value}_submit(){const e={};for(const[n,i]of this.inputs)e[n]=i();const t=au(this.fields,e);this.onSubmit&&this.onSubmit({window_id:this.id,values:t})}_renderBody(){}}const Ma=24,ba=40,cu=24;class hu extends mr{constructor({screenId:e,container:t,manager:n,optionsProvider:i,onResize:r}){if(super({id:`__graph@${e??"default"}`,title:"Graf",widthChars:80,container:t,manager:n,kind:"graph",closable:!1,optionsProvider:i}),this.onResize=r,this._buildBody(),this._mount(),!this.size){const o=this._bounds();this._applySize(Math.max(Pc,o.width-2*Ma),Math.max(Uc,o.height-ba-cu)),this._place(Ma,ba)}}_buildBody(){const e=document.createElement("div");e.dataset.role="graph-body",e.style.cssText="position:relative;overflow:hidden",this.body=e,this.el.appendChild(e)}_applySize(e,t){var n;super._applySize(e,t),this.body.style.overflow="hidden",(n=this.onResize)==null||n.call(this)}setTitle(e){this.title=e,this.titleEl.textContent=e}_renderBody(){}}const uu=1e3,ys=class ys extends mr{constructor({container:e,manager:t}){super({id:ys.ID,title:"Log",widthChars:64,container:e,manager:t,kind:"log",closable:!1}),this.filters=Yh(),this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="log-body",e.style.cssText=["padding:6px 8px",`width:${this.widthChars}ch`,"max-width:92vw","height:240px","overflow-y:auto","font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace","white-space:pre-wrap","word-break:break-word"].join(";"),this.body=e,this.el.appendChild(e)}append(e){if(!jh(e,this.filters))return;const t=document.createElement("div");for(t.dataset.role="log-row",t.textContent=Rc(e),this.body.appendChild(t);this.body.childElementCount>uu;)this.body.firstElementChild.remove();this.body.scrollTop=this.body.scrollHeight}getOptionsItems(){const e=(t,n)=>i=>{this.filters[t][n]=i,this.manager.refreshOptions()};return[...Ac.map(t=>({key:`level-${t}`,label:t,checked:this.filters.levels[t]!==!1,onToggle:e("levels",t)})),...Cc.map(t=>({key:`source-${t}`,label:t,checked:this.filters.sources[t]!==!1,onToggle:e("sources",t)}))]}_renderBody(){}};pa(ys,"ID","__log");let Ai=ys;const du=8,fu=220;function pu(s){const e=Number(s);return!Number.isFinite(e)||e<=0?60:Math.max(20,Math.round(e/du))}class mu extends mr{constructor({id:e,title:t,prompt:n,width:i,onInput:r,container:o,manager:a,closable:l,input:c}){super({id:e,title:t,widthChars:pu(i),container:o,manager:a,kind:"terminal",closable:l}),this.prompt=n??"> ",this.hasInput=c!==!1,this.onInput=r,this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="terminal-body",e.style.cssText=["padding:6px 8px",`width:${this.widthChars}ch`,"max-width:92vw","font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace","display:flex","flex-direction:column","gap:6px"].join(";");const t=document.createElement("div");if(t.dataset.role="terminal-output",t.style.cssText=[`height:${fu}px`,"flex:1 1 auto","min-height:0","overflow-y:auto","white-space:pre-wrap","word-break:break-word","background:var(--vb-window-output-bg, rgba(0,0,0,0.06))","border-radius:4px","padding:6px 8px"].join(";"),this.output=t,e.append(t),this.hasInput){const n=document.createElement("div");n.style.cssText="display:flex;align-items:center;gap:4px";const i=document.createElement("span");i.textContent=this.prompt,i.style.cssText="color:var(--vb-window-key, #667788);flex:0 0 auto";const r=document.createElement("input");r.type="text",r.dataset.role="terminal-input",r.style.cssText="flex:1 1 auto;min-width:0;font:inherit",r.addEventListener("keydown",o=>{if(o.key!=="Enter")return;o.stopPropagation();const a=r.value.trim();r.value="",a&&this._submit(a)}),this.input=r,n.append(i,r),e.append(n)}this.body=e,this.el.appendChild(e)}_submit(e){this.onInput&&this.onInput({window_id:this.id,line:e})}append(e){const t=document.createElement("div");t.textContent=String(e??""),this.output.appendChild(t),this.output.scrollTop=this.output.scrollHeight}_renderBody(){}}const gu=30;function Ea(s,e){const t=(s==null?void 0:s.meta)??{};return e==null?Object.entries(t).map(([n,i])=>({label:n,value:String(i??"")})):e.map(([n,i])=>({label:n,value:String(t[i]??"")}))}function _u(s,e){const t=e instanceof Set?e:new Set(e),n=(s.remove_nodes??[]).filter(o=>t.has(o)),i=new Set(n);return{refresh:(s.update_nodes??[]).map(o=>o.id).filter(o=>t.has(o)&&!i.has(o)),close:n}}class vu extends mr{constructor({nodeId:e,title:t,rows:n,widthChars:i,container:r,manager:o}){super({id:e,title:t,widthChars:i,container:r,manager:o,kind:"detail"}),this.rows=n,this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="detail-body",e.style.cssText=["padding:6px 10px",`width:${this.widthChars}ch`,"max-width:90vw","font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace","overflow:auto"].join(";"),this.body=e,this._renderBody(),this.el.appendChild(e)}_renderBody(){this.body.replaceChildren();const e=document.createElement("table");e.style.cssText="border-collapse:collapse;width:100%";for(const{label:t,value:n}of this.rows){const i=e.insertRow(),r=i.insertCell();r.textContent=t,r.style.cssText=["padding:1px 12px 1px 0","vertical-align:top","white-space:nowrap","color:var(--vb-window-key, #667788)"].join(";");const o=i.insertCell();o.dataset.role="detail-value",o.textContent=n,o.style.cssText=["padding:1px 0","word-break:break-all","cursor:copy"].join(";"),o.addEventListener("click",a=>{a.stopPropagation(),this._copy(n,o)})}this.body.appendChild(e)}_copy(e,t){const n=()=>{t.style.transition="background 0.15s";const i=t.style.background;t.style.background="var(--vb-window-gadget, #8a93a3)",setTimeout(()=>{t.style.background=i},180)};navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(e).then(n).catch(()=>{this._execCopy(e),n()}):(this._execCopy(e),n())}_execCopy(e){try{const t=document.createElement("textarea");t.value=e,t.style.cssText="position:fixed;left:-9999px;top:0",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)}catch{console.warn("viewbase: kopírování do schránky selhalo")}}update({title:e,rows:t}){e!=null&&(this.title=e,this.titleEl.textContent=e),t!=null&&(this.rows=t,this.isMinimized||this._renderBody())}}class xu{constructor(e,t,n=()=>null,i=()=>{}){this.container=e,this.store=t,this.getTheme=n,this.onOptionsChange=i,this.windows=new Map,this.optionsSource=null,this.z=900,this.dockSlots=[]}_setActive(e){e.getOptionsItems()!=null&&(this.optionsSource=e),this.refreshOptions()}refreshOptions(){var e;this.onOptionsChange(((e=this.optionsSource)==null?void 0:e.getOptionsItems())??null)}_config(){var t;return((t=this.store.config)==null?void 0:t.detail_window)??{rows:null,width_chars:128,open_on_click:!0}}openFor(e){const t=this.windows.get(e);if(t)return t.isMinimized?t.restore():t.bringToFront(),t;const n=this.store.nodes.get(e);if(!n)return null;const i=this._config(),r=new vu({nodeId:e,title:n.label,rows:Ea(n,i.rows),widthChars:i.width_chars,container:this.container,manager:this});return this.windows.set(e,r),r.bringToFront(),r}openControl(e,t){const n=this.windows.get(e.window_id);n&&n.close();const i=new lu({id:e.window_id,title:e.title,fields:e.fields,live:e.live,closable:e.closable,widthChars:gu,onSubmit:t,container:this.container,manager:this});return this.windows.set(e.window_id,i),i.bringToFront(),i}closeControl(e){var t;(t=this.windows.get(e))==null||t.close()}openTerminal(e,t){const n=this.windows.get(e.window_id);n&&n.close();const i=new mu({id:e.window_id,title:e.title,prompt:e.prompt,width:e.width,closable:e.closable,input:e.input,onInput:t,container:this.container,manager:this});return this.windows.set(e.window_id,i),i.bringToFront(),i}terminalAppend(e,t){const n=this.windows.get(e);n&&n.kind==="terminal"&&n.append(t)}openGraph({screenId:e,optionsProvider:t,onResize:n}){const i=new hu({screenId:e,container:this.container,manager:this,optionsProvider:t,onResize:n});return this.windows.set(i.id,i),i}openLog(){const e=this.windows.get(Ai.ID);if(e)return e.isMinimized&&e.restore(),e;const t=new Ai({container:this.container,manager:this});return this.windows.set(Ai.ID,t),t}logWindow(){return this.windows.get(Ai.ID)??null}onPatch(e){var o;const t=new Set;for(const[a,l]of this.windows)l.kind==="detail"&&t.add(a);if(t.size===0)return;const{refresh:n,close:i}=_u(e,t);for(const a of i)(o=this.windows.get(a))==null||o.close();const r=this._config();for(const a of n){const l=this.windows.get(a),c=this.store.nodes.get(a);l&&c&&l.update({title:c.label,rows:Ea(c,r.rows)})}}applyTheme(){for(const e of this.windows.values())e.applyTheme()}close(e){var t;(t=this.windows.get(e))==null||t.close()}_nextZ(){return this.z+=1,this.z}_assignDockSlot(e){let t=this.dockSlots.indexOf(null);return t===-1?(t=this.dockSlots.length,this.dockSlots.push(e)):this.dockSlots[t]=e,e._dockSlot=t,t}_releaseDockSlot(e){const t=e._dockSlot;t!=null&&this.dockSlots[t]===e&&(this.dockSlots[t]=null),e._dockSlot=null}_forget(e){const t=this.windows.get(e);if(this.windows.delete(e),t!==this.optionsSource)return;let n=null;for(const i of this.windows.values())i.getOptionsItems()!=null&&(!n||Number(i.el.style.zIndex)>Number(n.el.style.zIndex))&&(n=i);this.optionsSource=n,this.refreshOptions()}}function yu(s,e,t){const n=new Set;if(!s.nodes.has(e)||(n.add(e),t<=0))return n;const i=new Map,r=(a,l)=>{i.has(a)||i.set(a,[]),i.get(a).push(l)};for(const a of s.edges.values())r(a.source,a.target),r(a.target,a.source);let o=[e];for(let a=0;a<t&&o.length>0;a+=1){const l=[];for(const c of o)for(const h of i.get(c)??[])n.has(h)||(n.add(h),l.push(h));o=l}return n}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Wo="165",_n={ROTATE:0,DOLLY:1,PAN:2},Un={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Su=0,Ta=1,Mu=2,Lc=1,bu=2,gn=3,Nn=0,Ft=1,sn=2,yn=0,Ri=1,hs=2,wa=3,Aa=4,Eu=5,Kn=100,Tu=101,wu=102,Au=103,Cu=104,Ru=200,Pu=201,Uu=202,Lu=203,Ao=204,Co=205,Du=206,Iu=207,Fu=208,Nu=209,Ou=210,Bu=211,ku=212,zu=213,Gu=214,Hu=0,Vu=1,Wu=2,us=3,Xu=4,Yu=5,ju=6,qu=7,Dc=0,Ku=1,Zu=2,In=0,Ju=1,Qu=2,$u=3,ed=4,td=5,nd=6,id=7,Ic=300,Di=301,Ii=302,Ro=303,Po=304,Ss=306,Uo=1e3,Qn=1001,Lo=1002,Dt=1003,rd=1004,Cr=1005,kt=1006,zs=1007,$n=1008,On=1009,sd=1010,od=1011,ds=1012,Fc=1013,Fi=1014,vn=1015,Fn=1016,Nc=1017,Oc=1018,Ni=1020,ad=35902,ld=1021,cd=1022,an=1023,hd=1024,ud=1025,Pi=1026,Oi=1027,Bc=1028,kc=1029,dd=1030,zc=1031,Gc=1033,Gs=33776,Hs=33777,Vs=33778,Ws=33779,Ca=35840,Ra=35841,Pa=35842,Ua=35843,La=36196,Da=37492,Ia=37496,Fa=37808,Na=37809,Oa=37810,Ba=37811,ka=37812,za=37813,Ga=37814,Ha=37815,Va=37816,Wa=37817,Xa=37818,Ya=37819,ja=37820,qa=37821,Xs=36492,Ka=36494,Za=36495,fd=36283,Ja=36284,Qa=36285,$a=36286,pd=3200,Hc=3201,Vc=0,md=1,Dn="",nn="srgb",Bn="srgb-linear",Xo="display-p3",Ms="display-p3-linear",fs="linear",ot="srgb",ps="rec709",ms="p3",ai=7680,el=519,gd=512,_d=513,vd=514,Wc=515,xd=516,yd=517,Sd=518,Md=519,tl=35044,nl="300 es",xn=2e3,gs=2001;class ni{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],os=Math.PI/180,Do=180/Math.PI;function gr(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(bt[s&255]+bt[s>>8&255]+bt[s>>16&255]+bt[s>>24&255]+"-"+bt[e&255]+bt[e>>8&255]+"-"+bt[e>>16&15|64]+bt[e>>24&255]+"-"+bt[t&63|128]+bt[t>>8&255]+"-"+bt[t>>16&255]+bt[t>>24&255]+bt[n&255]+bt[n>>8&255]+bt[n>>16&255]+bt[n>>24&255]).toLowerCase()}function Ct(s,e,t){return Math.max(e,Math.min(t,s))}function bd(s,e){return(s%e+e)%e}function Ys(s,e,t){return(1-t)*s+t*e}function $i(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Lt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Ed={DEG2RAD:os};class Oe{constructor(e=0,t=0){Oe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ke{constructor(e,t,n,i,r,o,a,l,c){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c)}set(e,t,n,i,r,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],_=i[0],p=i[3],m=i[6],S=i[1],v=i[4],b=i[7],R=i[2],w=i[5],T=i[8];return r[0]=o*_+a*S+l*R,r[3]=o*p+a*v+l*w,r[6]=o*m+a*b+l*T,r[1]=c*_+h*S+d*R,r[4]=c*p+h*v+d*w,r[7]=c*m+h*b+d*T,r[2]=u*_+f*S+g*R,r[5]=u*p+f*v+g*w,r[8]=u*m+f*b+g*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,g=t*d+n*u+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(i*c-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=u*_,e[4]=(h*t-i*l)*_,e[5]=(i*r-a*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(js.makeScale(e,t)),this}rotate(e){return this.premultiply(js.makeRotation(-e)),this}translate(e,t){return this.premultiply(js.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const js=new Ke;function Xc(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function _s(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Td(){const s=_s("canvas");return s.style.display="block",s}const il={};function Yc(s){s in il||(il[s]=!0,console.warn(s))}function wd(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const rl=new Ke().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),sl=new Ke().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Rr={[Bn]:{transfer:fs,primaries:ps,toReference:s=>s,fromReference:s=>s},[nn]:{transfer:ot,primaries:ps,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Ms]:{transfer:fs,primaries:ms,toReference:s=>s.applyMatrix3(sl),fromReference:s=>s.applyMatrix3(rl)},[Xo]:{transfer:ot,primaries:ms,toReference:s=>s.convertSRGBToLinear().applyMatrix3(sl),fromReference:s=>s.applyMatrix3(rl).convertLinearToSRGB()}},Ad=new Set([Bn,Ms]),nt={enabled:!0,_workingColorSpace:Bn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Ad.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const n=Rr[e].toReference,i=Rr[t].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return Rr[s].primaries},getTransfer:function(s){return s===Dn?fs:Rr[s].transfer}};function Ui(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function qs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let li;class Cd{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{li===void 0&&(li=_s("canvas")),li.width=e.width,li.height=e.height;const n=li.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=li}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=_s("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Ui(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ui(t[n]/255)*255):t[n]=Ui(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Rd=0;class jc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Rd++}),this.uuid=gr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Ks(i[o].image)):r.push(Ks(i[o]))}else r=Ks(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Ks(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Cd.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Pd=0;class Tt extends ni{constructor(e=Tt.DEFAULT_IMAGE,t=Tt.DEFAULT_MAPPING,n=Qn,i=Qn,r=kt,o=$n,a=an,l=On,c=Tt.DEFAULT_ANISOTROPY,h=Dn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Pd++}),this.uuid=gr(),this.name="",this.source=new jc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ic)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Uo:e.x=e.x-Math.floor(e.x);break;case Qn:e.x=e.x<0?0:1;break;case Lo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Uo:e.y=e.y-Math.floor(e.y);break;case Qn:e.y=e.y<0?0:1;break;case Lo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Tt.DEFAULT_IMAGE=null;Tt.DEFAULT_MAPPING=Ic;Tt.DEFAULT_ANISOTROPY=1;class ht{constructor(e=0,t=0,n=0,i=1){ht.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],_=l[2],p=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,b=(f+1)/2,R=(m+1)/2,w=(h+u)/4,T=(d+_)/4,U=(g+p)/4;return v>b&&v>R?v<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(v),i=w/n,r=T/n):b>R?b<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(b),n=w/i,r=U/i):R<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(R),n=T/r,i=U/r),this.set(n,i,r,t),this}let S=Math.sqrt((p-g)*(p-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(S)<.001&&(S=1),this.x=(p-g)/S,this.y=(d-_)/S,this.z=(u-h)/S,this.w=Math.acos((c+f+m-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ud extends ni{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:kt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Tt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new jc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class en extends Ud{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class qc extends Tt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ld extends Tt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ti{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3];const u=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(a===1){e[t+0]=u,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(d!==_||l!==u||c!==f||h!==g){let p=1-a;const m=l*u+c*f+h*g+d*_,S=m>=0?1:-1,v=1-m*m;if(v>Number.EPSILON){const R=Math.sqrt(v),w=Math.atan2(R,m*S);p=Math.sin(p*w)/R,a=Math.sin(a*w)/R}const b=a*S;if(l=l*p+u*b,c=c*p+f*b,h=h*p+g*b,d=d*p+_*b,p===1-a){const R=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=R,c*=R,h*=R,d*=R}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[o],u=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*d+l*f-c*u,e[t+1]=l*g+h*u+c*d-a*f,e[t+2]=c*g+h*f+a*u-l*d,e[t+3]=h*g-a*d-l*u-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),d=a(r/2),u=l(n/2),f=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+a+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>d){const f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>d){const f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ct(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-t)*h)/c,u=Math.sin(t*h)/c;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=i*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class W{constructor(e=0,t=0,n=0){W.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ol.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ol.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-r*i),d=2*(r*n-o*t);return this.x=t+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=i+l*d+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Zs.copy(this).projectOnVector(e),this.sub(Zs)}reflect(e){return this.sub(Zs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Zs=new W,ol=new ti;class Sn{constructor(e=new W(1/0,1/0,1/0),t=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Jt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Jt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Jt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Jt):Jt.fromBufferAttribute(r,o),Jt.applyMatrix4(e.matrixWorld),this.expandByPoint(Jt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Pr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Pr.copy(n.boundingBox)),Pr.applyMatrix4(e.matrixWorld),this.union(Pr)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Jt),Jt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(er),Ur.subVectors(this.max,er),ci.subVectors(e.a,er),hi.subVectors(e.b,er),ui.subVectors(e.c,er),Tn.subVectors(hi,ci),wn.subVectors(ui,hi),Gn.subVectors(ci,ui);let t=[0,-Tn.z,Tn.y,0,-wn.z,wn.y,0,-Gn.z,Gn.y,Tn.z,0,-Tn.x,wn.z,0,-wn.x,Gn.z,0,-Gn.x,-Tn.y,Tn.x,0,-wn.y,wn.x,0,-Gn.y,Gn.x,0];return!Js(t,ci,hi,ui,Ur)||(t=[1,0,0,0,1,0,0,0,1],!Js(t,ci,hi,ui,Ur))?!1:(Lr.crossVectors(Tn,wn),t=[Lr.x,Lr.y,Lr.z],Js(t,ci,hi,ui,Ur))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Jt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Jt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(un),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const un=[new W,new W,new W,new W,new W,new W,new W,new W],Jt=new W,Pr=new Sn,ci=new W,hi=new W,ui=new W,Tn=new W,wn=new W,Gn=new W,er=new W,Ur=new W,Lr=new W,Hn=new W;function Js(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Hn.fromArray(s,r);const a=i.x*Math.abs(Hn.x)+i.y*Math.abs(Hn.y)+i.z*Math.abs(Hn.z),l=e.dot(Hn),c=t.dot(Hn),h=n.dot(Hn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Dd=new Sn,tr=new W,Qs=new W;class ii{constructor(e=new W,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Dd.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;tr.subVectors(e,this.center);const t=tr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(tr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Qs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(tr.copy(e.center).add(Qs)),this.expandByPoint(tr.copy(e.center).sub(Qs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const dn=new W,$s=new W,Dr=new W,An=new W,eo=new W,Ir=new W,to=new W;class bs{constructor(e=new W,t=new W(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,dn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=dn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(dn.copy(this.origin).addScaledVector(this.direction,t),dn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){$s.copy(e).add(t).multiplyScalar(.5),Dr.copy(t).sub(e).normalize(),An.copy(this.origin).sub($s);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Dr),a=An.dot(this.direction),l=-An.dot(Dr),c=An.lengthSq(),h=Math.abs(1-o*o);let d,u,f,g;if(h>0)if(d=o*l-a,u=o*a-l,g=r*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy($s).addScaledVector(Dr,u),f}intersectSphere(e,t){dn.subVectors(e.center,this.origin);const n=dn.dot(this.direction),i=dn.dot(dn)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,i=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,i=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,o=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,o=(e.min.y-u.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),d>=0?(a=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(a=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,dn)!==null}intersectTriangle(e,t,n,i,r){eo.subVectors(t,e),Ir.subVectors(n,e),to.crossVectors(eo,Ir);let o=this.direction.dot(to),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;An.subVectors(this.origin,e);const l=a*this.direction.dot(Ir.crossVectors(An,Ir));if(l<0)return null;const c=a*this.direction.dot(eo.cross(An));if(c<0||l+c>o)return null;const h=-a*An.dot(to);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class it{constructor(e,t,n,i,r,o,a,l,c,h,d,u,f,g,_,p){it.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c,h,d,u,f,g,_,p)}set(e,t,n,i,r,o,a,l,c,h,d,u,f,g,_,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=f,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new it().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/di.setFromMatrixColumn(e,0).length(),r=1/di.setFromMatrixColumn(e,1).length(),o=1/di.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=o*h,f=o*d,g=a*h,_=a*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=u-_*c,t[9]=-a*l,t[2]=_-u*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){const u=l*h,f=l*d,g=c*h,_=c*d;t[0]=u+_*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=_+u*a,t[10]=o*l}else if(e.order==="ZXY"){const u=l*h,f=l*d,g=c*h,_=c*d;t[0]=u-_*a,t[4]=-o*d,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=_-u*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const u=o*h,f=o*d,g=a*h,_=a*d;t[0]=l*h,t[4]=g*c-f,t[8]=u*c+_,t[1]=l*d,t[5]=_*c+u,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const u=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=_-u*d,t[8]=g*d+f,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*d+g,t[10]=u-_*d}else if(e.order==="XZY"){const u=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+_,t[5]=o*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=a*h,t[10]=_*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Id,e,Fd)}lookAt(e,t,n){const i=this.elements;return Ot.subVectors(e,t),Ot.lengthSq()===0&&(Ot.z=1),Ot.normalize(),Cn.crossVectors(n,Ot),Cn.lengthSq()===0&&(Math.abs(n.z)===1?Ot.x+=1e-4:Ot.z+=1e-4,Ot.normalize(),Cn.crossVectors(n,Ot)),Cn.normalize(),Fr.crossVectors(Ot,Cn),i[0]=Cn.x,i[4]=Fr.x,i[8]=Ot.x,i[1]=Cn.y,i[5]=Fr.y,i[9]=Ot.y,i[2]=Cn.z,i[6]=Fr.z,i[10]=Ot.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],_=n[6],p=n[10],m=n[14],S=n[3],v=n[7],b=n[11],R=n[15],w=i[0],T=i[4],U=i[8],E=i[12],y=i[1],F=i[5],L=i[9],A=i[13],I=i[2],z=i[6],B=i[10],ie=i[14],j=i[3],K=i[7],q=i[11],N=i[15];return r[0]=o*w+a*y+l*I+c*j,r[4]=o*T+a*F+l*z+c*K,r[8]=o*U+a*L+l*B+c*q,r[12]=o*E+a*A+l*ie+c*N,r[1]=h*w+d*y+u*I+f*j,r[5]=h*T+d*F+u*z+f*K,r[9]=h*U+d*L+u*B+f*q,r[13]=h*E+d*A+u*ie+f*N,r[2]=g*w+_*y+p*I+m*j,r[6]=g*T+_*F+p*z+m*K,r[10]=g*U+_*L+p*B+m*q,r[14]=g*E+_*A+p*ie+m*N,r[3]=S*w+v*y+b*I+R*j,r[7]=S*T+v*F+b*z+R*K,r[11]=S*U+v*L+b*B+R*q,r[15]=S*E+v*A+b*ie+R*N,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],_=e[7],p=e[11],m=e[15];return g*(+r*l*d-i*c*d-r*a*u+n*c*u+i*a*f-n*l*f)+_*(+t*l*f-t*c*u+r*o*u-i*o*f+i*c*h-r*l*h)+p*(+t*c*d-t*a*f-r*o*d+n*o*f+r*a*h-n*c*h)+m*(-i*a*h-t*l*d+t*a*u+i*o*d-n*o*u+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],_=e[13],p=e[14],m=e[15],S=d*p*c-_*u*c+_*l*f-a*p*f-d*l*m+a*u*m,v=g*u*c-h*p*c-g*l*f+o*p*f+h*l*m-o*u*m,b=h*_*c-g*d*c+g*a*f-o*_*f-h*a*m+o*d*m,R=g*d*l-h*_*l-g*a*u+o*_*u+h*a*p-o*d*p,w=t*S+n*v+i*b+r*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/w;return e[0]=S*T,e[1]=(_*u*r-d*p*r-_*i*f+n*p*f+d*i*m-n*u*m)*T,e[2]=(a*p*r-_*l*r+_*i*c-n*p*c-a*i*m+n*l*m)*T,e[3]=(d*l*r-a*u*r-d*i*c+n*u*c+a*i*f-n*l*f)*T,e[4]=v*T,e[5]=(h*p*r-g*u*r+g*i*f-t*p*f-h*i*m+t*u*m)*T,e[6]=(g*l*r-o*p*r-g*i*c+t*p*c+o*i*m-t*l*m)*T,e[7]=(o*u*r-h*l*r+h*i*c-t*u*c-o*i*f+t*l*f)*T,e[8]=b*T,e[9]=(g*d*r-h*_*r-g*n*f+t*_*f+h*n*m-t*d*m)*T,e[10]=(o*_*r-g*a*r+g*n*c-t*_*c-o*n*m+t*a*m)*T,e[11]=(h*a*r-o*d*r-h*n*c+t*d*c+o*n*f-t*a*f)*T,e[12]=R*T,e[13]=(h*_*i-g*d*i+g*n*u-t*_*u-h*n*p+t*d*p)*T,e[14]=(g*a*i-o*_*i-g*n*l+t*_*l+o*n*p-t*a*p)*T,e[15]=(o*d*i-h*a*i+h*n*l-t*d*l-o*n*u+t*a*u)*T,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,g=r*d,_=o*h,p=o*d,m=a*d,S=l*c,v=l*h,b=l*d,R=n.x,w=n.y,T=n.z;return i[0]=(1-(_+m))*R,i[1]=(f+b)*R,i[2]=(g-v)*R,i[3]=0,i[4]=(f-b)*w,i[5]=(1-(u+m))*w,i[6]=(p+S)*w,i[7]=0,i[8]=(g+v)*T,i[9]=(p-S)*T,i[10]=(1-(u+_))*T,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=di.set(i[0],i[1],i[2]).length();const o=di.set(i[4],i[5],i[6]).length(),a=di.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Qt.copy(this);const c=1/r,h=1/o,d=1/a;return Qt.elements[0]*=c,Qt.elements[1]*=c,Qt.elements[2]*=c,Qt.elements[4]*=h,Qt.elements[5]*=h,Qt.elements[6]*=h,Qt.elements[8]*=d,Qt.elements[9]*=d,Qt.elements[10]*=d,t.setFromRotationMatrix(Qt),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=xn){const l=this.elements,c=2*r/(t-e),h=2*r/(n-i),d=(t+e)/(t-e),u=(n+i)/(n-i);let f,g;if(a===xn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===gs)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=xn){const l=this.elements,c=1/(t-e),h=1/(n-i),d=1/(o-r),u=(t+e)*c,f=(n+i)*h;let g,_;if(a===xn)g=(o+r)*d,_=-2*d;else if(a===gs)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const di=new W,Qt=new it,Id=new W(0,0,0),Fd=new W(1,1,1),Cn=new W,Fr=new W,Ot=new W,al=new it,ll=new ti;class ln{constructor(e=0,t=0,n=0,i=ln.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(Ct(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ct(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ct(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ct(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ct(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return al.makeRotationFromQuaternion(e),this.setFromRotationMatrix(al,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ll.setFromEuler(this),this.setFromQuaternion(ll,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ln.DEFAULT_ORDER="XYZ";class Yo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Nd=0;const cl=new W,fi=new ti,fn=new it,Nr=new W,nr=new W,Od=new W,Bd=new ti,hl=new W(1,0,0),ul=new W(0,1,0),dl=new W(0,0,1),fl={type:"added"},kd={type:"removed"},pi={type:"childadded",child:null},no={type:"childremoved",child:null};class xt extends ni{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Nd++}),this.uuid=gr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xt.DEFAULT_UP.clone();const e=new W,t=new ln,n=new ti,i=new W(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new it},normalMatrix:{value:new Ke}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return fi.setFromAxisAngle(e,t),this.quaternion.multiply(fi),this}rotateOnWorldAxis(e,t){return fi.setFromAxisAngle(e,t),this.quaternion.premultiply(fi),this}rotateX(e){return this.rotateOnAxis(hl,e)}rotateY(e){return this.rotateOnAxis(ul,e)}rotateZ(e){return this.rotateOnAxis(dl,e)}translateOnAxis(e,t){return cl.copy(e).applyQuaternion(this.quaternion),this.position.add(cl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(hl,e)}translateY(e){return this.translateOnAxis(ul,e)}translateZ(e){return this.translateOnAxis(dl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Nr.copy(e):Nr.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),nr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fn.lookAt(nr,Nr,this.up):fn.lookAt(Nr,nr,this.up),this.quaternion.setFromRotationMatrix(fn),i&&(fn.extractRotation(i.matrixWorld),fi.setFromRotationMatrix(fn),this.quaternion.premultiply(fi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(fl),pi.child=e,this.dispatchEvent(pi),pi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(kd),no.child=e,this.dispatchEvent(no),no.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(fn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(fl),pi.child=e,this.dispatchEvent(pi),pi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,e,Od),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,Bd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),d=o(e.shapes),u=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}xt.DEFAULT_UP=new W(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const $t=new W,pn=new W,io=new W,mn=new W,mi=new W,gi=new W,pl=new W,ro=new W,so=new W,oo=new W;class on{constructor(e=new W,t=new W,n=new W){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),$t.subVectors(e,t),i.cross($t);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){$t.subVectors(i,t),pn.subVectors(n,t),io.subVectors(e,t);const o=$t.dot($t),a=$t.dot(pn),l=$t.dot(io),c=pn.dot(pn),h=pn.dot(io),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,mn)===null?!1:mn.x>=0&&mn.y>=0&&mn.x+mn.y<=1}static getInterpolation(e,t,n,i,r,o,a,l){return this.getBarycoord(e,t,n,i,mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,mn.x),l.addScaledVector(o,mn.y),l.addScaledVector(a,mn.z),l)}static isFrontFacing(e,t,n,i){return $t.subVectors(n,t),pn.subVectors(e,t),$t.cross(pn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $t.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),$t.cross(pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return on.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return on.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return on.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return on.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return on.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;mi.subVectors(i,n),gi.subVectors(r,n),ro.subVectors(e,n);const l=mi.dot(ro),c=gi.dot(ro);if(l<=0&&c<=0)return t.copy(n);so.subVectors(e,i);const h=mi.dot(so),d=gi.dot(so);if(h>=0&&d<=h)return t.copy(i);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(mi,o);oo.subVectors(e,r);const f=mi.dot(oo),g=gi.dot(oo);if(g>=0&&f<=g)return t.copy(r);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(gi,a);const p=h*g-f*d;if(p<=0&&d-h>=0&&f-g>=0)return pl.subVectors(r,i),a=(d-h)/(d-h+(f-g)),t.copy(i).addScaledVector(pl,a);const m=1/(p+_+u);return o=_*m,a=u*m,t.copy(n).addScaledVector(mi,o).addScaledVector(gi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Kc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Rn={h:0,s:0,l:0},Or={h:0,s:0,l:0};function ao(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ve{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=nn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=nt.workingColorSpace){if(e=bd(e,1),t=Ct(t,0,1),n=Ct(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=ao(o,r,e+1/3),this.g=ao(o,r,e),this.b=ao(o,r,e-1/3)}return nt.toWorkingColorSpace(this,i),this}setStyle(e,t=nn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=nn){const n=Kc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ui(e.r),this.g=Ui(e.g),this.b=Ui(e.b),this}copyLinearToSRGB(e){return this.r=qs(e.r),this.g=qs(e.g),this.b=qs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nn){return nt.fromWorkingColorSpace(Et.copy(this),e),Math.round(Ct(Et.r*255,0,255))*65536+Math.round(Ct(Et.g*255,0,255))*256+Math.round(Ct(Et.b*255,0,255))}getHexString(e=nn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.fromWorkingColorSpace(Et.copy(this),t);const n=Et.r,i=Et.g,r=Et.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=nt.workingColorSpace){return nt.fromWorkingColorSpace(Et.copy(this),t),e.r=Et.r,e.g=Et.g,e.b=Et.b,e}getStyle(e=nn){nt.fromWorkingColorSpace(Et.copy(this),e);const t=Et.r,n=Et.g,i=Et.b;return e!==nn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Rn),this.setHSL(Rn.h+e,Rn.s+t,Rn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Rn),e.getHSL(Or);const n=Ys(Rn.h,Or.h,t),i=Ys(Rn.s,Or.s,t),r=Ys(Rn.l,Or.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Et=new Ve;Ve.NAMES=Kc;let zd=0;class zi extends ni{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zd++}),this.uuid=gr(),this.name="",this.type="Material",this.blending=Ri,this.side=Nn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ao,this.blendDst=Co,this.blendEquation=Kn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ve(0,0,0),this.blendAlpha=0,this.depthFunc=us,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=el,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ai,this.stencilZFail=ai,this.stencilZPass=ai,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ri&&(n.blending=this.blending),this.side!==Nn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ao&&(n.blendSrc=this.blendSrc),this.blendDst!==Co&&(n.blendDst=this.blendDst),this.blendEquation!==Kn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==us&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==el&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ai&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ai&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ai&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class _r extends zi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=Dc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ct=new W,Br=new Oe;class zt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=tl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=vn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Yc("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Br.fromBufferAttribute(this,t),Br.applyMatrix3(e),this.setXY(t,Br.x,Br.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix3(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix4(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.applyNormalMatrix(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.transformDirection(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=$i(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Lt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=$i(t,this.array)),t}setX(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=$i(t,this.array)),t}setY(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=$i(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=$i(t,this.array)),t}setW(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),i=Lt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),i=Lt(i,this.array),r=Lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==tl&&(e.usage=this.usage),e}}class Zc extends zt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Jc extends zt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class yt extends zt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Gd=0;const Yt=new it,lo=new xt,_i=new W,Bt=new Sn,ir=new Sn,mt=new W;class Gt extends ni{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Gd++}),this.uuid=gr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Xc(e)?Jc:Zc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Yt.makeRotationFromQuaternion(e),this.applyMatrix4(Yt),this}rotateX(e){return Yt.makeRotationX(e),this.applyMatrix4(Yt),this}rotateY(e){return Yt.makeRotationY(e),this.applyMatrix4(Yt),this}rotateZ(e){return Yt.makeRotationZ(e),this.applyMatrix4(Yt),this}translate(e,t,n){return Yt.makeTranslation(e,t,n),this.applyMatrix4(Yt),this}scale(e,t,n){return Yt.makeScale(e,t,n),this.applyMatrix4(Yt),this}lookAt(e){return lo.lookAt(e),lo.updateMatrix(),this.applyMatrix4(lo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_i).negate(),this.translate(_i.x,_i.y,_i.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new yt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Bt.setFromBufferAttribute(r),this.morphTargetsRelative?(mt.addVectors(this.boundingBox.min,Bt.min),this.boundingBox.expandByPoint(mt),mt.addVectors(this.boundingBox.max,Bt.max),this.boundingBox.expandByPoint(mt)):(this.boundingBox.expandByPoint(Bt.min),this.boundingBox.expandByPoint(Bt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ii);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new W,1/0);return}if(e){const n=this.boundingSphere.center;if(Bt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];ir.setFromBufferAttribute(a),this.morphTargetsRelative?(mt.addVectors(Bt.min,ir.min),Bt.expandByPoint(mt),mt.addVectors(Bt.max,ir.max),Bt.expandByPoint(mt)):(Bt.expandByPoint(ir.min),Bt.expandByPoint(ir.max))}Bt.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)mt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(mt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)mt.fromBufferAttribute(a,c),l&&(_i.fromBufferAttribute(e,c),mt.add(_i)),i=Math.max(i,n.distanceToSquared(mt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new zt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let U=0;U<n.count;U++)a[U]=new W,l[U]=new W;const c=new W,h=new W,d=new W,u=new Oe,f=new Oe,g=new Oe,_=new W,p=new W;function m(U,E,y){c.fromBufferAttribute(n,U),h.fromBufferAttribute(n,E),d.fromBufferAttribute(n,y),u.fromBufferAttribute(r,U),f.fromBufferAttribute(r,E),g.fromBufferAttribute(r,y),h.sub(c),d.sub(c),f.sub(u),g.sub(u);const F=1/(f.x*g.y-g.x*f.y);isFinite(F)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(F),p.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(F),a[U].add(_),a[E].add(_),a[y].add(_),l[U].add(p),l[E].add(p),l[y].add(p))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let U=0,E=S.length;U<E;++U){const y=S[U],F=y.start,L=y.count;for(let A=F,I=F+L;A<I;A+=3)m(e.getX(A+0),e.getX(A+1),e.getX(A+2))}const v=new W,b=new W,R=new W,w=new W;function T(U){R.fromBufferAttribute(i,U),w.copy(R);const E=a[U];v.copy(E),v.sub(R.multiplyScalar(R.dot(E))).normalize(),b.crossVectors(w,E);const F=b.dot(l[U])<0?-1:1;o.setXYZW(U,v.x,v.y,v.z,F)}for(let U=0,E=S.length;U<E;++U){const y=S[U],F=y.start,L=y.count;for(let A=F,I=F+L;A<I;A+=3)T(e.getX(A+0)),T(e.getX(A+1)),T(e.getX(A+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new zt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const i=new W,r=new W,o=new W,a=new W,l=new W,c=new W,h=new W,d=new W;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),_=e.getX(u+1),p=e.getX(u+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,f=t.count;u<f;u+=3)i.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)mt.fromBufferAttribute(e,t),mt.normalize(),e.setXYZ(t,mt.x,mt.y,mt.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,p=l.length;_<p;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let m=0;m<h;m++)u[g++]=c[f++]}return new zt(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Gt,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=e(u,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ml=new it,Vn=new bs,kr=new ii,gl=new W,vi=new W,xi=new W,yi=new W,co=new W,zr=new W,Gr=new Oe,Hr=new Oe,Vr=new Oe,_l=new W,vl=new W,xl=new W,Wr=new W,Xr=new W;class Rt extends xt{constructor(e=new Gt,t=new _r){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){zr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(co.fromBufferAttribute(d,e),o?zr.addScaledVector(co,h):zr.addScaledVector(co.sub(t),h))}t.add(zr)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),kr.copy(n.boundingSphere),kr.applyMatrix4(r),Vn.copy(e.ray).recast(e.near),!(kr.containsPoint(Vn.origin)===!1&&(Vn.intersectSphere(kr,gl)===null||Vn.origin.distanceToSquared(gl)>(e.far-e.near)**2))&&(ml.copy(r).invert(),Vn.copy(e.ray).applyMatrix4(ml),!(n.boundingBox!==null&&Vn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Vn)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const p=u[g],m=o[p.materialIndex],S=Math.max(p.start,f.start),v=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let b=S,R=v;b<R;b+=3){const w=a.getX(b),T=a.getX(b+1),U=a.getX(b+2);i=Yr(this,m,e,n,c,h,d,w,T,U),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let p=g,m=_;p<m;p+=3){const S=a.getX(p),v=a.getX(p+1),b=a.getX(p+2);i=Yr(this,o,e,n,c,h,d,S,v,b),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const p=u[g],m=o[p.materialIndex],S=Math.max(p.start,f.start),v=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let b=S,R=v;b<R;b+=3){const w=b,T=b+1,U=b+2;i=Yr(this,m,e,n,c,h,d,w,T,U),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let p=g,m=_;p<m;p+=3){const S=p,v=p+1,b=p+2;i=Yr(this,o,e,n,c,h,d,S,v,b),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function Hd(s,e,t,n,i,r,o,a){let l;if(e.side===Ft?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,e.side===Nn,a),l===null)return null;Xr.copy(a),Xr.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Xr);return c<t.near||c>t.far?null:{distance:c,point:Xr.clone(),object:s}}function Yr(s,e,t,n,i,r,o,a,l,c){s.getVertexPosition(a,vi),s.getVertexPosition(l,xi),s.getVertexPosition(c,yi);const h=Hd(s,e,t,n,vi,xi,yi,Wr);if(h){i&&(Gr.fromBufferAttribute(i,a),Hr.fromBufferAttribute(i,l),Vr.fromBufferAttribute(i,c),h.uv=on.getInterpolation(Wr,vi,xi,yi,Gr,Hr,Vr,new Oe)),r&&(Gr.fromBufferAttribute(r,a),Hr.fromBufferAttribute(r,l),Vr.fromBufferAttribute(r,c),h.uv1=on.getInterpolation(Wr,vi,xi,yi,Gr,Hr,Vr,new Oe)),o&&(_l.fromBufferAttribute(o,a),vl.fromBufferAttribute(o,l),xl.fromBufferAttribute(o,c),h.normal=on.getInterpolation(Wr,vi,xi,yi,_l,vl,xl,new W),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new W,materialIndex:0};on.getNormal(vi,xi,yi,d.normal),h.face=d}return h}class Gi extends Gt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new yt(c,3)),this.setAttribute("normal",new yt(h,3)),this.setAttribute("uv",new yt(d,2));function g(_,p,m,S,v,b,R,w,T,U,E){const y=b/T,F=R/U,L=b/2,A=R/2,I=w/2,z=T+1,B=U+1;let ie=0,j=0;const K=new W;for(let q=0;q<B;q++){const N=q*F-A;for(let V=0;V<z;V++){const ne=V*y-L;K[_]=ne*S,K[p]=N*v,K[m]=I,c.push(K.x,K.y,K.z),K[_]=0,K[p]=0,K[m]=w>0?1:-1,h.push(K.x,K.y,K.z),d.push(V/T),d.push(1-q/U),ie+=1}}for(let q=0;q<U;q++)for(let N=0;N<T;N++){const V=u+N+z*q,ne=u+N+z*(q+1),O=u+(N+1)+z*(q+1),k=u+(N+1)+z*q;l.push(V,ne,k),l.push(ne,O,k),j+=6}a.addGroup(f,j,E),f+=j,u+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Bi(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function At(s){const e={};for(let t=0;t<s.length;t++){const n=Bi(s[t]);for(const i in n)e[i]=n[i]}return e}function Vd(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Qc(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}const pr={clone:Bi,merge:At};var Wd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Xd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class It extends zi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wd,this.fragmentShader=Xd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Bi(e.uniforms),this.uniformsGroups=Vd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class $c extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=xn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Pn=new W,yl=new Oe,Sl=new Oe;class jt extends $c{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Do*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(os*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Do*2*Math.atan(Math.tan(os*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Pn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Pn.x,Pn.y).multiplyScalar(-e/Pn.z),Pn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Pn.x,Pn.y).multiplyScalar(-e/Pn.z)}getViewSize(e,t){return this.getViewBounds(e,yl,Sl),t.subVectors(Sl,yl)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(os*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Si=-90,Mi=1;class Yd extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new jt(Si,Mi,e,t);i.layers=this.layers,this.add(i);const r=new jt(Si,Mi,e,t);r.layers=this.layers,this.add(r);const o=new jt(Si,Mi,e,t);o.layers=this.layers,this.add(o);const a=new jt(Si,Mi,e,t);a.layers=this.layers,this.add(a);const l=new jt(Si,Mi,e,t);l.layers=this.layers,this.add(l);const c=new jt(Si,Mi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===xn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===gs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class eh extends Tt{constructor(e,t,n,i,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Di,super(e,t,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class jd extends en{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new eh(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:kt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Gi(5,5,5),r=new It({name:"CubemapFromEquirect",uniforms:Bi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ft,blending:yn});r.uniforms.tEquirect.value=t;const o=new Rt(i,r),a=t.minFilter;return t.minFilter===$n&&(t.minFilter=kt),new Yd(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}const ho=new W,qd=new W,Kd=new Ke;class Ln{constructor(e=new W(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=ho.subVectors(n,t).cross(qd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(ho),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Kd.getNormalMatrix(e),i=this.coplanarPoint(ho).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Wn=new ii,jr=new W;class jo{constructor(e=new Ln,t=new Ln,n=new Ln,i=new Ln,r=new Ln,o=new Ln){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=xn){const n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],d=i[6],u=i[7],f=i[8],g=i[9],_=i[10],p=i[11],m=i[12],S=i[13],v=i[14],b=i[15];if(n[0].setComponents(l-r,u-c,p-f,b-m).normalize(),n[1].setComponents(l+r,u+c,p+f,b+m).normalize(),n[2].setComponents(l+o,u+h,p+g,b+S).normalize(),n[3].setComponents(l-o,u-h,p-g,b-S).normalize(),n[4].setComponents(l-a,u-d,p-_,b-v).normalize(),t===xn)n[5].setComponents(l+a,u+d,p+_,b+v).normalize();else if(t===gs)n[5].setComponents(a,d,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Wn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Wn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Wn)}intersectsSprite(e){return Wn.center.set(0,0,0),Wn.radius=.7071067811865476,Wn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Wn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(jr.x=i.normal.x>0?e.max.x:e.min.x,jr.y=i.normal.y>0?e.max.y:e.min.y,jr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(jr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function th(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Zd(s){const e=new WeakMap;function t(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const h=l.array,d=l._updateRange,u=l.updateRanges;if(s.bindBuffer(c,a),d.count===-1&&u.length===0&&s.bufferSubData(c,0,h),u.length!==0){for(let f=0,g=u.length;f<g;f++){const _=u[f];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}d.count!==-1&&(s.bufferSubData(c,d.offset*h.BYTES_PER_ELEMENT,h,d.offset,d.count),d.count=-1),l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(s.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}class ri extends Gt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,d=e/a,u=t/l,f=[],g=[],_=[],p=[];for(let m=0;m<h;m++){const S=m*u-o;for(let v=0;v<c;v++){const b=v*d-r;g.push(b,-S,0),_.push(0,0,1),p.push(v/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let S=0;S<a;S++){const v=S+c*m,b=S+c*(m+1),R=S+1+c*(m+1),w=S+1+c*m;f.push(v,b,w),f.push(b,R,w)}this.setIndex(f),this.setAttribute("position",new yt(g,3)),this.setAttribute("normal",new yt(_,3)),this.setAttribute("uv",new yt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ri(e.width,e.height,e.widthSegments,e.heightSegments)}}var Jd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Qd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,$d=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ef=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,nf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,rf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,sf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,of=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,af=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,lf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,uf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,df=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ff=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,pf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_f=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,vf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,xf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,yf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( batchId );
	vColor.xyz *= batchingColor.xyz;
#endif`,Sf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Mf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,bf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Ef=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Tf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,wf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Af=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Cf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Rf=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Pf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Uf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Lf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Df=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,If=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ff=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Nf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Of=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Bf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,kf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,zf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Gf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Hf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Vf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Wf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Xf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Yf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,jf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,qf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Kf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Zf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Jf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Qf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,$f=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ep=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,tp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,np=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ip=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,rp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,sp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,op=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ap=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,cp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,hp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,up=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,pp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,gp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,_p=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,yp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Sp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Mp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,bp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ep=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Tp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,wp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ap=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Cp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Rp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Up=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Lp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Dp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`,Ip=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Fp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Np=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Op=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Bp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,kp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Gp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Hp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Vp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Wp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Xp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Yp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,jp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Kp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Zp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Jp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Qp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$p=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,em=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,im=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,rm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,sm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,om=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,am=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,lm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,um=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,dm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,gm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_m=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,vm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,xm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ym=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Mm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Em=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,wm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Am=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Cm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Rm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Pm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qe={alphahash_fragment:Jd,alphahash_pars_fragment:Qd,alphamap_fragment:$d,alphamap_pars_fragment:ef,alphatest_fragment:tf,alphatest_pars_fragment:nf,aomap_fragment:rf,aomap_pars_fragment:sf,batching_pars_vertex:of,batching_vertex:af,begin_vertex:lf,beginnormal_vertex:cf,bsdfs:hf,iridescence_fragment:uf,bumpmap_pars_fragment:df,clipping_planes_fragment:ff,clipping_planes_pars_fragment:pf,clipping_planes_pars_vertex:mf,clipping_planes_vertex:gf,color_fragment:_f,color_pars_fragment:vf,color_pars_vertex:xf,color_vertex:yf,common:Sf,cube_uv_reflection_fragment:Mf,defaultnormal_vertex:bf,displacementmap_pars_vertex:Ef,displacementmap_vertex:Tf,emissivemap_fragment:wf,emissivemap_pars_fragment:Af,colorspace_fragment:Cf,colorspace_pars_fragment:Rf,envmap_fragment:Pf,envmap_common_pars_fragment:Uf,envmap_pars_fragment:Lf,envmap_pars_vertex:Df,envmap_physical_pars_fragment:Wf,envmap_vertex:If,fog_vertex:Ff,fog_pars_vertex:Nf,fog_fragment:Of,fog_pars_fragment:Bf,gradientmap_pars_fragment:kf,lightmap_pars_fragment:zf,lights_lambert_fragment:Gf,lights_lambert_pars_fragment:Hf,lights_pars_begin:Vf,lights_toon_fragment:Xf,lights_toon_pars_fragment:Yf,lights_phong_fragment:jf,lights_phong_pars_fragment:qf,lights_physical_fragment:Kf,lights_physical_pars_fragment:Zf,lights_fragment_begin:Jf,lights_fragment_maps:Qf,lights_fragment_end:$f,logdepthbuf_fragment:ep,logdepthbuf_pars_fragment:tp,logdepthbuf_pars_vertex:np,logdepthbuf_vertex:ip,map_fragment:rp,map_pars_fragment:sp,map_particle_fragment:op,map_particle_pars_fragment:ap,metalnessmap_fragment:lp,metalnessmap_pars_fragment:cp,morphinstance_vertex:hp,morphcolor_vertex:up,morphnormal_vertex:dp,morphtarget_pars_vertex:fp,morphtarget_vertex:pp,normal_fragment_begin:mp,normal_fragment_maps:gp,normal_pars_fragment:_p,normal_pars_vertex:vp,normal_vertex:xp,normalmap_pars_fragment:yp,clearcoat_normal_fragment_begin:Sp,clearcoat_normal_fragment_maps:Mp,clearcoat_pars_fragment:bp,iridescence_pars_fragment:Ep,opaque_fragment:Tp,packing:wp,premultiplied_alpha_fragment:Ap,project_vertex:Cp,dithering_fragment:Rp,dithering_pars_fragment:Pp,roughnessmap_fragment:Up,roughnessmap_pars_fragment:Lp,shadowmap_pars_fragment:Dp,shadowmap_pars_vertex:Ip,shadowmap_vertex:Fp,shadowmask_pars_fragment:Np,skinbase_vertex:Op,skinning_pars_vertex:Bp,skinning_vertex:kp,skinnormal_vertex:zp,specularmap_fragment:Gp,specularmap_pars_fragment:Hp,tonemapping_fragment:Vp,tonemapping_pars_fragment:Wp,transmission_fragment:Xp,transmission_pars_fragment:Yp,uv_pars_fragment:jp,uv_pars_vertex:qp,uv_vertex:Kp,worldpos_vertex:Zp,background_vert:Jp,background_frag:Qp,backgroundCube_vert:$p,backgroundCube_frag:em,cube_vert:tm,cube_frag:nm,depth_vert:im,depth_frag:rm,distanceRGBA_vert:sm,distanceRGBA_frag:om,equirect_vert:am,equirect_frag:lm,linedashed_vert:cm,linedashed_frag:hm,meshbasic_vert:um,meshbasic_frag:dm,meshlambert_vert:fm,meshlambert_frag:pm,meshmatcap_vert:mm,meshmatcap_frag:gm,meshnormal_vert:_m,meshnormal_frag:vm,meshphong_vert:xm,meshphong_frag:ym,meshphysical_vert:Sm,meshphysical_frag:Mm,meshtoon_vert:bm,meshtoon_frag:Em,points_vert:Tm,points_frag:wm,shadow_vert:Am,shadow_frag:Cm,sprite_vert:Rm,sprite_frag:Pm},Le={common:{diffuse:{value:new Ve(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new Ve(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},rn={basic:{uniforms:At([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:At([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,Le.lights,{emissive:{value:new Ve(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:At([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,Le.lights,{emissive:{value:new Ve(0)},specular:{value:new Ve(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:At([Le.common,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.roughnessmap,Le.metalnessmap,Le.fog,Le.lights,{emissive:{value:new Ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:At([Le.common,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.gradientmap,Le.fog,Le.lights,{emissive:{value:new Ve(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:At([Le.common,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:At([Le.points,Le.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:At([Le.common,Le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:At([Le.common,Le.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:At([Le.common,Le.bumpmap,Le.normalmap,Le.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:At([Le.sprite,Le.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:At([Le.common,Le.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:At([Le.lights,Le.fog,{color:{value:new Ve(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};rn.physical={uniforms:At([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new Ve(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new Ve(0)},specularColor:{value:new Ve(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const qr={r:0,b:0,g:0},Xn=new ln,Um=new it;function Lm(s,e,t,n,i,r,o){const a=new Ve(0);let l=r===!0?0:1,c,h,d=null,u=0,f=null;function g(S){let v=S.isScene===!0?S.background:null;return v&&v.isTexture&&(v=(S.backgroundBlurriness>0?t:e).get(v)),v}function _(S){let v=!1;const b=g(S);b===null?m(a,l):b&&b.isColor&&(m(b,1),v=!0);const R=s.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function p(S,v){const b=g(v);b&&(b.isCubeTexture||b.mapping===Ss)?(h===void 0&&(h=new Rt(new Gi(1,1,1),new It({name:"BackgroundCubeMaterial",uniforms:Bi(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:Ft,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,w,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Xn.copy(v.backgroundRotation),Xn.x*=-1,Xn.y*=-1,Xn.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Xn.y*=-1,Xn.z*=-1),h.material.uniforms.envMap.value=b,h.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Um.makeRotationFromEuler(Xn)),h.material.toneMapped=nt.getTransfer(b.colorSpace)!==ot,(d!==b||u!==b.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,d=b,u=b.version,f=s.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new Rt(new ri(2,2),new It({name:"BackgroundMaterial",uniforms:Bi(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:Nn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=nt.getTransfer(b.colorSpace)!==ot,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(d!==b||u!==b.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,d=b,u=b.version,f=s.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function m(S,v){S.getRGB(qr,Qc(s)),n.buffers.color.setClear(qr.r,qr.g,qr.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(S,v=1){a.set(S),l=v,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,m(a,l)},render:_,addToRenderList:p}}function Dm(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null);let r=i,o=!1;function a(y,F,L,A,I){let z=!1;const B=d(A,L,F);r!==B&&(r=B,c(r.object)),z=f(y,A,L,I),z&&g(y,A,L,I),I!==null&&e.update(I,s.ELEMENT_ARRAY_BUFFER),(z||o)&&(o=!1,b(y,F,L,A),I!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(I).buffer))}function l(){return s.createVertexArray()}function c(y){return s.bindVertexArray(y)}function h(y){return s.deleteVertexArray(y)}function d(y,F,L){const A=L.wireframe===!0;let I=n[y.id];I===void 0&&(I={},n[y.id]=I);let z=I[F.id];z===void 0&&(z={},I[F.id]=z);let B=z[A];return B===void 0&&(B=u(l()),z[A]=B),B}function u(y){const F=[],L=[],A=[];for(let I=0;I<t;I++)F[I]=0,L[I]=0,A[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:L,attributeDivisors:A,object:y,attributes:{},index:null}}function f(y,F,L,A){const I=r.attributes,z=F.attributes;let B=0;const ie=L.getAttributes();for(const j in ie)if(ie[j].location>=0){const q=I[j];let N=z[j];if(N===void 0&&(j==="instanceMatrix"&&y.instanceMatrix&&(N=y.instanceMatrix),j==="instanceColor"&&y.instanceColor&&(N=y.instanceColor)),q===void 0||q.attribute!==N||N&&q.data!==N.data)return!0;B++}return r.attributesNum!==B||r.index!==A}function g(y,F,L,A){const I={},z=F.attributes;let B=0;const ie=L.getAttributes();for(const j in ie)if(ie[j].location>=0){let q=z[j];q===void 0&&(j==="instanceMatrix"&&y.instanceMatrix&&(q=y.instanceMatrix),j==="instanceColor"&&y.instanceColor&&(q=y.instanceColor));const N={};N.attribute=q,q&&q.data&&(N.data=q.data),I[j]=N,B++}r.attributes=I,r.attributesNum=B,r.index=A}function _(){const y=r.newAttributes;for(let F=0,L=y.length;F<L;F++)y[F]=0}function p(y){m(y,0)}function m(y,F){const L=r.newAttributes,A=r.enabledAttributes,I=r.attributeDivisors;L[y]=1,A[y]===0&&(s.enableVertexAttribArray(y),A[y]=1),I[y]!==F&&(s.vertexAttribDivisor(y,F),I[y]=F)}function S(){const y=r.newAttributes,F=r.enabledAttributes;for(let L=0,A=F.length;L<A;L++)F[L]!==y[L]&&(s.disableVertexAttribArray(L),F[L]=0)}function v(y,F,L,A,I,z,B){B===!0?s.vertexAttribIPointer(y,F,L,I,z):s.vertexAttribPointer(y,F,L,A,I,z)}function b(y,F,L,A){_();const I=A.attributes,z=L.getAttributes(),B=F.defaultAttributeValues;for(const ie in z){const j=z[ie];if(j.location>=0){let K=I[ie];if(K===void 0&&(ie==="instanceMatrix"&&y.instanceMatrix&&(K=y.instanceMatrix),ie==="instanceColor"&&y.instanceColor&&(K=y.instanceColor)),K!==void 0){const q=K.normalized,N=K.itemSize,V=e.get(K);if(V===void 0)continue;const ne=V.buffer,O=V.type,k=V.bytesPerElement,te=O===s.INT||O===s.UNSIGNED_INT||K.gpuType===Fc;if(K.isInterleavedBufferAttribute){const H=K.data,ae=H.stride,pe=K.offset;if(H.isInstancedInterleavedBuffer){for(let ve=0;ve<j.locationSize;ve++)m(j.location+ve,H.meshPerAttribute);y.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=H.meshPerAttribute*H.count)}else for(let ve=0;ve<j.locationSize;ve++)p(j.location+ve);s.bindBuffer(s.ARRAY_BUFFER,ne);for(let ve=0;ve<j.locationSize;ve++)v(j.location+ve,N/j.locationSize,O,q,ae*k,(pe+N/j.locationSize*ve)*k,te)}else{if(K.isInstancedBufferAttribute){for(let H=0;H<j.locationSize;H++)m(j.location+H,K.meshPerAttribute);y.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let H=0;H<j.locationSize;H++)p(j.location+H);s.bindBuffer(s.ARRAY_BUFFER,ne);for(let H=0;H<j.locationSize;H++)v(j.location+H,N/j.locationSize,O,q,N*k,N/j.locationSize*H*k,te)}}else if(B!==void 0){const q=B[ie];if(q!==void 0)switch(q.length){case 2:s.vertexAttrib2fv(j.location,q);break;case 3:s.vertexAttrib3fv(j.location,q);break;case 4:s.vertexAttrib4fv(j.location,q);break;default:s.vertexAttrib1fv(j.location,q)}}}}S()}function R(){U();for(const y in n){const F=n[y];for(const L in F){const A=F[L];for(const I in A)h(A[I].object),delete A[I];delete F[L]}delete n[y]}}function w(y){if(n[y.id]===void 0)return;const F=n[y.id];for(const L in F){const A=F[L];for(const I in A)h(A[I].object),delete A[I];delete F[L]}delete n[y.id]}function T(y){for(const F in n){const L=n[F];if(L[y.id]===void 0)continue;const A=L[y.id];for(const I in A)h(A[I].object),delete A[I];delete L[y.id]}}function U(){E(),o=!0,r!==i&&(r=i,c(r.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:U,resetDefaultState:E,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:p,disableUnusedAttributes:S}}function Im(s,e,t){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,d){d!==0&&(s.drawArraysInstanced(n,c,h,d),t.update(h,n,d))}function a(c,h,d){if(d===0)return;const u=e.get("WEBGL_multi_draw");if(u===null)for(let f=0;f<d;f++)this.render(c[f],h[f]);else{u.multiDrawArraysWEBGL(n,c,0,h,0,d);let f=0;for(let g=0;g<d;g++)f+=h[g];t.update(f,n,1)}}function l(c,h,d,u){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_];for(let _=0;_<u.length;_++)t.update(g,n,u[_])}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Fm(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(w){return!(w!==an&&n.convert(w)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const T=w===Fn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==On&&n.convert(w)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==vn&&!T)}function l(w){if(w==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),_=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),S=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=f>0,R=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,maxTextures:u,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:_,maxAttributes:p,maxVertexUniforms:m,maxVaryings:S,maxFragmentUniforms:v,vertexTextures:b,maxSamples:R}}function Nm(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new Ln,a=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,_=d.clipIntersection,p=d.clipShadows,m=s.get(d);if(!i||g===null||g.length===0||r&&!p)r?h(null):c();else{const S=r?0:n,v=S*4;let b=m.clippingState||null;l.value=b,b=h(g,u,v,f);for(let R=0;R!==v;++R)b[R]=t[R];m.clippingState=b,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,g){const _=d!==null?d.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const m=f+_*4,S=u.matrixWorldInverse;a.getNormalMatrix(S),(p===null||p.length<m)&&(p=new Float32Array(m));for(let v=0,b=f;v!==_;++v,b+=4)o.copy(d[v]).applyMatrix4(S,a),o.normal.toArray(p,b),p[b+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function Om(s){let e=new WeakMap;function t(o,a){return a===Ro?o.mapping=Di:a===Po&&(o.mapping=Ii),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Ro||a===Po)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new jd(l.height);return c.fromEquirectangularTexture(s,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Es extends $c{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ci=4,Ml=[.125,.215,.35,.446,.526,.582],Zn=20,uo=new Es,bl=new Ve;let fo=null,po=0,mo=0,go=!1;const qn=(1+Math.sqrt(5))/2,bi=1/qn,El=[new W(-qn,bi,0),new W(qn,bi,0),new W(-bi,0,qn),new W(bi,0,qn),new W(0,qn,-bi),new W(0,qn,bi),new W(-1,1,-1),new W(1,1,-1),new W(-1,1,1),new W(1,1,1)];class Tl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){fo=this._renderer.getRenderTarget(),po=this._renderer.getActiveCubeFace(),mo=this._renderer.getActiveMipmapLevel(),go=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Al(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(fo,po,mo),this._renderer.xr.enabled=go,e.scissorTest=!1,Kr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Di||e.mapping===Ii?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),fo=this._renderer.getRenderTarget(),po=this._renderer.getActiveCubeFace(),mo=this._renderer.getActiveMipmapLevel(),go=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:kt,minFilter:kt,generateMipmaps:!1,type:Fn,format:an,colorSpace:Bn,depthBuffer:!1},i=wl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Bm(r)),this._blurMaterial=km(r,e,t)}return i}_compileMaterial(e){const t=new Rt(this._lodPlanes[0],e);this._renderer.compile(t,uo)}_sceneToCubeUV(e,t,n,i){const a=new jt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(bl),h.toneMapping=In,h.autoClear=!1;const f=new _r({name:"PMREM.Background",side:Ft,depthWrite:!1,depthTest:!1}),g=new Rt(new Gi,f);let _=!1;const p=e.background;p?p.isColor&&(f.color.copy(p),e.background=null,_=!0):(f.color.copy(bl),_=!0);for(let m=0;m<6;m++){const S=m%3;S===0?(a.up.set(0,l[m],0),a.lookAt(c[m],0,0)):S===1?(a.up.set(0,0,l[m]),a.lookAt(0,c[m],0)):(a.up.set(0,l[m],0),a.lookAt(0,0,c[m]));const v=this._cubeSize;Kr(i,S*v,m>2?v:0,v,v),h.setRenderTarget(i),_&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Di||e.mapping===Ii;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Al());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new Rt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;Kr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,uo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=El[(i-r-1)%El.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Rt(this._lodPlanes[i],c),u=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Zn-1),_=r/g,p=isFinite(r)?1+Math.floor(h*_):Zn;p>Zn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Zn}`);const m=[];let S=0;for(let T=0;T<Zn;++T){const U=T/_,E=Math.exp(-U*U/2);m.push(E),T===0?S+=E:T<p&&(S+=2*E)}for(let T=0;T<m.length;T++)m[T]=m[T]/S;u.envMap.value=e.texture,u.samples.value=p,u.weights.value=m,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:v}=this;u.dTheta.value=g,u.mipInt.value=v-n;const b=this._sizeLods[i],R=3*b*(i>v-Ci?i-v+Ci:0),w=4*(this._cubeSize-b);Kr(t,R,w,3*b,2*b),l.setRenderTarget(t),l.render(d,uo)}}function Bm(s){const e=[],t=[],n=[];let i=s;const r=s-Ci+1+Ml.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>s-Ci?l=Ml[o-s+Ci-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,_=3,p=2,m=1,S=new Float32Array(_*g*f),v=new Float32Array(p*g*f),b=new Float32Array(m*g*f);for(let w=0;w<f;w++){const T=w%3*2/3-1,U=w>2?0:-1,E=[T,U,0,T+2/3,U,0,T+2/3,U+1,0,T,U,0,T+2/3,U+1,0,T,U+1,0];S.set(E,_*g*w),v.set(u,p*g*w);const y=[w,w,w,w,w,w];b.set(y,m*g*w)}const R=new Gt;R.setAttribute("position",new zt(S,_)),R.setAttribute("uv",new zt(v,p)),R.setAttribute("faceIndex",new zt(b,m)),e.push(R),i>Ci&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function wl(s,e,t){const n=new en(s,e,t);return n.texture.mapping=Ss,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Kr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function km(s,e,t){const n=new Float32Array(Zn),i=new W(0,1,0);return new It({name:"SphericalGaussianBlur",defines:{n:Zn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:qo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function Al(){return new It({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:qo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function Cl(){return new It({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function qo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function zm(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Ro||l===Po,h=l===Di||l===Ii;if(c||h){let d=e.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return t===null&&(t=new Tl(s)),d=c?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&i(f)?(t===null&&(t=new Tl(s)),d=c?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Gm(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Yc("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Hm(s,e,t,n){const i={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);for(const g in u.morphAttributes){const _=u.morphAttributes[g];for(let p=0,m=_.length;p<m;p++)e.remove(_[p])}u.removeEventListener("dispose",o),delete i[u.id];const f=r.get(u);f&&(e.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function a(d,u){return i[u.id]===!0||(u.addEventListener("dispose",o),i[u.id]=!0,t.memory.geometries++),u}function l(d){const u=d.attributes;for(const g in u)e.update(u[g],s.ARRAY_BUFFER);const f=d.morphAttributes;for(const g in f){const _=f[g];for(let p=0,m=_.length;p<m;p++)e.update(_[p],s.ARRAY_BUFFER)}}function c(d){const u=[],f=d.index,g=d.attributes.position;let _=0;if(f!==null){const S=f.array;_=f.version;for(let v=0,b=S.length;v<b;v+=3){const R=S[v+0],w=S[v+1],T=S[v+2];u.push(R,w,w,T,T,R)}}else if(g!==void 0){const S=g.array;_=g.version;for(let v=0,b=S.length/3-1;v<b;v+=3){const R=v+0,w=v+1,T=v+2;u.push(R,w,w,T,T,R)}}else return;const p=new(Xc(u)?Jc:Zc)(u,1);p.version=_;const m=r.get(d);m&&e.remove(m),r.set(d,p)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Vm(s,e,t){let n;function i(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,f){s.drawElements(n,f,r,u*o),t.update(f,n,1)}function c(u,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,u*o,g),t.update(f,n,g))}function h(u,f,g){if(g===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let p=0;p<g;p++)this.render(u[p]/o,f[p]);else{_.multiDrawElementsWEBGL(n,f,0,r,u,0,g);let p=0;for(let m=0;m<g;m++)p+=f[m];t.update(p,n,1)}}function d(u,f,g,_){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<u.length;m++)c(u[m]/o,f[m],_[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,r,u,0,_,0,g);let m=0;for(let S=0;S<g;S++)m+=f[S];for(let S=0;S<_.length;S++)t.update(m,n,_[S])}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Wm(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Xm(s,e,t){const n=new WeakMap,i=new ht;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let E=function(){T.dispose(),n.delete(a),a.removeEventListener("dispose",E)};u!==void 0&&u.texture.dispose();const f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],S=a.morphAttributes.color||[];let v=0;f===!0&&(v=1),g===!0&&(v=2),_===!0&&(v=3);let b=a.attributes.position.count*v,R=1;b>e.maxTextureSize&&(R=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const w=new Float32Array(b*R*4*d),T=new qc(w,b,R,d);T.type=vn,T.needsUpdate=!0;const U=v*4;for(let y=0;y<d;y++){const F=p[y],L=m[y],A=S[y],I=b*R*4*y;for(let z=0;z<F.count;z++){const B=z*U;f===!0&&(i.fromBufferAttribute(F,z),w[I+B+0]=i.x,w[I+B+1]=i.y,w[I+B+2]=i.z,w[I+B+3]=0),g===!0&&(i.fromBufferAttribute(L,z),w[I+B+4]=i.x,w[I+B+5]=i.y,w[I+B+6]=i.z,w[I+B+7]=0),_===!0&&(i.fromBufferAttribute(A,z),w[I+B+8]=i.x,w[I+B+9]=i.y,w[I+B+10]=i.z,w[I+B+11]=A.itemSize===4?i.w:1)}}u={count:d,texture:T,size:new Oe(b,R)},n.set(a,u),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];const g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function Ym(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=e.get(l,h);if(i.get(d)!==c&&(e.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;i.get(u)!==c&&(u.update(),i.set(u,c))}return d}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}class nh extends Tt{constructor(e,t,n,i,r,o,a,l,c,h=Pi){if(h!==Pi&&h!==Oi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Pi&&(n=Fi),n===void 0&&h===Oi&&(n=Ni),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Dt,this.minFilter=l!==void 0?l:Dt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const ih=new Tt,rh=new nh(1,1);rh.compareFunction=Wc;const sh=new qc,oh=new Ld,ah=new eh,Rl=[],Pl=[],Ul=new Float32Array(16),Ll=new Float32Array(9),Dl=new Float32Array(4);function Hi(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Rl[i];if(r===void 0&&(r=new Float32Array(i),Rl[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function ut(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function dt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Ts(s,e){let t=Pl[e];t===void 0&&(t=new Int32Array(e),Pl[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function jm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function qm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;s.uniform2fv(this.addr,e),dt(t,e)}}function Km(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ut(t,e))return;s.uniform3fv(this.addr,e),dt(t,e)}}function Zm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;s.uniform4fv(this.addr,e),dt(t,e)}}function Jm(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),dt(t,e)}else{if(ut(t,n))return;Dl.set(n),s.uniformMatrix2fv(this.addr,!1,Dl),dt(t,n)}}function Qm(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),dt(t,e)}else{if(ut(t,n))return;Ll.set(n),s.uniformMatrix3fv(this.addr,!1,Ll),dt(t,n)}}function $m(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),dt(t,e)}else{if(ut(t,n))return;Ul.set(n),s.uniformMatrix4fv(this.addr,!1,Ul),dt(t,n)}}function eg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function tg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;s.uniform2iv(this.addr,e),dt(t,e)}}function ng(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ut(t,e))return;s.uniform3iv(this.addr,e),dt(t,e)}}function ig(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;s.uniform4iv(this.addr,e),dt(t,e)}}function rg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function sg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;s.uniform2uiv(this.addr,e),dt(t,e)}}function og(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ut(t,e))return;s.uniform3uiv(this.addr,e),dt(t,e)}}function ag(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;s.uniform4uiv(this.addr,e),dt(t,e)}}function lg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?rh:ih;t.setTexture2D(e||r,i)}function cg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||oh,i)}function hg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||ah,i)}function ug(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||sh,i)}function dg(s){switch(s){case 5126:return jm;case 35664:return qm;case 35665:return Km;case 35666:return Zm;case 35674:return Jm;case 35675:return Qm;case 35676:return $m;case 5124:case 35670:return eg;case 35667:case 35671:return tg;case 35668:case 35672:return ng;case 35669:case 35673:return ig;case 5125:return rg;case 36294:return sg;case 36295:return og;case 36296:return ag;case 35678:case 36198:case 36298:case 36306:case 35682:return lg;case 35679:case 36299:case 36307:return cg;case 35680:case 36300:case 36308:case 36293:return hg;case 36289:case 36303:case 36311:case 36292:return ug}}function fg(s,e){s.uniform1fv(this.addr,e)}function pg(s,e){const t=Hi(e,this.size,2);s.uniform2fv(this.addr,t)}function mg(s,e){const t=Hi(e,this.size,3);s.uniform3fv(this.addr,t)}function gg(s,e){const t=Hi(e,this.size,4);s.uniform4fv(this.addr,t)}function _g(s,e){const t=Hi(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function vg(s,e){const t=Hi(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function xg(s,e){const t=Hi(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function yg(s,e){s.uniform1iv(this.addr,e)}function Sg(s,e){s.uniform2iv(this.addr,e)}function Mg(s,e){s.uniform3iv(this.addr,e)}function bg(s,e){s.uniform4iv(this.addr,e)}function Eg(s,e){s.uniform1uiv(this.addr,e)}function Tg(s,e){s.uniform2uiv(this.addr,e)}function wg(s,e){s.uniform3uiv(this.addr,e)}function Ag(s,e){s.uniform4uiv(this.addr,e)}function Cg(s,e,t){const n=this.cache,i=e.length,r=Ts(t,i);ut(n,r)||(s.uniform1iv(this.addr,r),dt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||ih,r[o])}function Rg(s,e,t){const n=this.cache,i=e.length,r=Ts(t,i);ut(n,r)||(s.uniform1iv(this.addr,r),dt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||oh,r[o])}function Pg(s,e,t){const n=this.cache,i=e.length,r=Ts(t,i);ut(n,r)||(s.uniform1iv(this.addr,r),dt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||ah,r[o])}function Ug(s,e,t){const n=this.cache,i=e.length,r=Ts(t,i);ut(n,r)||(s.uniform1iv(this.addr,r),dt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||sh,r[o])}function Lg(s){switch(s){case 5126:return fg;case 35664:return pg;case 35665:return mg;case 35666:return gg;case 35674:return _g;case 35675:return vg;case 35676:return xg;case 5124:case 35670:return yg;case 35667:case 35671:return Sg;case 35668:case 35672:return Mg;case 35669:case 35673:return bg;case 5125:return Eg;case 36294:return Tg;case 36295:return wg;case 36296:return Ag;case 35678:case 36198:case 36298:case 36306:case 35682:return Cg;case 35679:case 36299:case 36307:return Rg;case 35680:case 36300:case 36308:case 36293:return Pg;case 36289:case 36303:case 36311:case 36292:return Ug}}class Dg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=dg(t.type)}}class Ig{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Lg(t.type)}}class Fg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const _o=/(\w+)(\])?(\[|\.)?/g;function Il(s,e){s.seq.push(e),s.map[e.id]=e}function Ng(s,e,t){const n=s.name,i=n.length;for(_o.lastIndex=0;;){const r=_o.exec(n),o=_o.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Il(t,c===void 0?new Dg(a,s,e):new Ig(a,s,e));break}else{let d=t.map[a];d===void 0&&(d=new Fg(a),Il(t,d)),t=d}}}class as{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);Ng(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function Fl(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const Og=37297;let Bg=0;function kg(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function zg(s){const e=nt.getPrimaries(nt.workingColorSpace),t=nt.getPrimaries(s);let n;switch(e===t?n="":e===ms&&t===ps?n="LinearDisplayP3ToLinearSRGB":e===ps&&t===ms&&(n="LinearSRGBToLinearDisplayP3"),s){case Bn:case Ms:return[n,"LinearTransferOETF"];case nn:case Xo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Nl(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+kg(s.getShaderSource(e),o)}else return i}function Gg(s,e){const t=zg(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Hg(s,e){let t;switch(e){case Ju:t="Linear";break;case Qu:t="Reinhard";break;case $u:t="OptimizedCineon";break;case ed:t="ACESFilmic";break;case nd:t="AgX";break;case id:t="Neutral";break;case td:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Vg(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(cr).join(`
`)}function Wg(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Xg(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function cr(s){return s!==""}function Ol(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Bl(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Yg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Io(s){return s.replace(Yg,qg)}const jg=new Map;function qg(s,e){let t=qe[e];if(t===void 0){const n=jg.get(e);if(n!==void 0)t=qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Io(t)}const Kg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function kl(s){return s.replace(Kg,Zg)}function Zg(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function zl(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Jg(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Lc?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===bu?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===gn&&(e="SHADOWMAP_TYPE_VSM"),e}function Qg(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Di:case Ii:e="ENVMAP_TYPE_CUBE";break;case Ss:e="ENVMAP_TYPE_CUBE_UV";break}return e}function $g(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ii:e="ENVMAP_MODE_REFRACTION";break}return e}function e_(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Dc:e="ENVMAP_BLENDING_MULTIPLY";break;case Ku:e="ENVMAP_BLENDING_MIX";break;case Zu:e="ENVMAP_BLENDING_ADD";break}return e}function t_(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function n_(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Jg(t),c=Qg(t),h=$g(t),d=e_(t),u=t_(t),f=Vg(t),g=Wg(r),_=i.createProgram();let p,m,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(cr).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(cr).join(`
`),m.length>0&&(m+=`
`)):(p=[zl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(cr).join(`
`),m=[zl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==In?"#define TONE_MAPPING":"",t.toneMapping!==In?qe.tonemapping_pars_fragment:"",t.toneMapping!==In?Hg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,Gg("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(cr).join(`
`)),o=Io(o),o=Ol(o,t),o=Bl(o,t),a=Io(a),a=Ol(a,t),a=Bl(a,t),o=kl(o),a=kl(a),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===nl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===nl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const v=S+p+o,b=S+m+a,R=Fl(i,i.VERTEX_SHADER,v),w=Fl(i,i.FRAGMENT_SHADER,b);i.attachShader(_,R),i.attachShader(_,w),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function T(F){if(s.debug.checkShaderErrors){const L=i.getProgramInfoLog(_).trim(),A=i.getShaderInfoLog(R).trim(),I=i.getShaderInfoLog(w).trim();let z=!0,B=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(z=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,R,w);else{const ie=Nl(i,R,"vertex"),j=Nl(i,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+L+`
`+ie+`
`+j)}else L!==""?console.warn("THREE.WebGLProgram: Program Info Log:",L):(A===""||I==="")&&(B=!1);B&&(F.diagnostics={runnable:z,programLog:L,vertexShader:{log:A,prefix:p},fragmentShader:{log:I,prefix:m}})}i.deleteShader(R),i.deleteShader(w),U=new as(i,_),E=Xg(i,_)}let U;this.getUniforms=function(){return U===void 0&&T(this),U};let E;this.getAttributes=function(){return E===void 0&&T(this),E};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=i.getProgramParameter(_,Og)),y},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Bg++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=w,this}let i_=0;class r_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new s_(e),t.set(e,n)),n}}class s_{constructor(e){this.id=i_++,this.code=e,this.usedTimes=0}}function o_(s,e,t,n,i,r,o){const a=new Yo,l=new r_,c=new Set,h=[],d=i.logarithmicDepthBuffer,u=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return c.add(E),E===0?"uv":`uv${E}`}function p(E,y,F,L,A){const I=L.fog,z=A.geometry,B=E.isMeshStandardMaterial?L.environment:null,ie=(E.isMeshStandardMaterial?t:e).get(E.envMap||B),j=ie&&ie.mapping===Ss?ie.image.height:null,K=g[E.type];E.precision!==null&&(f=i.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));const q=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,N=q!==void 0?q.length:0;let V=0;z.morphAttributes.position!==void 0&&(V=1),z.morphAttributes.normal!==void 0&&(V=2),z.morphAttributes.color!==void 0&&(V=3);let ne,O,k,te;if(K){const De=rn[K];ne=De.vertexShader,O=De.fragmentShader}else ne=E.vertexShader,O=E.fragmentShader,l.update(E),k=l.getVertexShaderID(E),te=l.getFragmentShaderID(E);const H=s.getRenderTarget(),ae=A.isInstancedMesh===!0,pe=A.isBatchedMesh===!0,ve=!!E.map,D=!!E.matcap,he=!!ie,Pe=!!E.aoMap,Ue=!!E.lightMap,fe=!!E.bumpMap,ye=!!E.normalMap,Me=!!E.displacementMap,de=!!E.emissiveMap,Ce=!!E.metalnessMap,P=!!E.roughnessMap,x=E.anisotropy>0,X=E.clearcoat>0,Z=E.dispersion>0,re=E.iridescence>0,Q=E.sheen>0,Te=E.transmission>0,le=x&&!!E.anisotropyMap,ce=X&&!!E.clearcoatMap,Se=X&&!!E.clearcoatNormalMap,ue=X&&!!E.clearcoatRoughnessMap,be=re&&!!E.iridescenceMap,Be=re&&!!E.iridescenceThicknessMap,we=Q&&!!E.sheenColorMap,me=Q&&!!E.sheenRoughnessMap,xe=!!E.specularMap,Ne=!!E.specularColorMap,We=!!E.specularIntensityMap,M=Te&&!!E.transmissionMap,$=Te&&!!E.thicknessMap,G=!!E.gradientMap,ee=!!E.alphaMap,ge=E.alphaTest>0,Ae=!!E.alphaHash,Re=!!E.extensions;let je=In;E.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(je=s.toneMapping);const Xe={shaderID:K,shaderType:E.type,shaderName:E.name,vertexShader:ne,fragmentShader:O,defines:E.defines,customVertexShaderID:k,customFragmentShaderID:te,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:pe,batchingColor:pe&&A._colorsTexture!==null,instancing:ae,instancingColor:ae&&A.instanceColor!==null,instancingMorph:ae&&A.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:H===null?s.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:Bn,alphaToCoverage:!!E.alphaToCoverage,map:ve,matcap:D,envMap:he,envMapMode:he&&ie.mapping,envMapCubeUVHeight:j,aoMap:Pe,lightMap:Ue,bumpMap:fe,normalMap:ye,displacementMap:u&&Me,emissiveMap:de,normalMapObjectSpace:ye&&E.normalMapType===md,normalMapTangentSpace:ye&&E.normalMapType===Vc,metalnessMap:Ce,roughnessMap:P,anisotropy:x,anisotropyMap:le,clearcoat:X,clearcoatMap:ce,clearcoatNormalMap:Se,clearcoatRoughnessMap:ue,dispersion:Z,iridescence:re,iridescenceMap:be,iridescenceThicknessMap:Be,sheen:Q,sheenColorMap:we,sheenRoughnessMap:me,specularMap:xe,specularColorMap:Ne,specularIntensityMap:We,transmission:Te,transmissionMap:M,thicknessMap:$,gradientMap:G,opaque:E.transparent===!1&&E.blending===Ri&&E.alphaToCoverage===!1,alphaMap:ee,alphaTest:ge,alphaHash:Ae,combine:E.combine,mapUv:ve&&_(E.map.channel),aoMapUv:Pe&&_(E.aoMap.channel),lightMapUv:Ue&&_(E.lightMap.channel),bumpMapUv:fe&&_(E.bumpMap.channel),normalMapUv:ye&&_(E.normalMap.channel),displacementMapUv:Me&&_(E.displacementMap.channel),emissiveMapUv:de&&_(E.emissiveMap.channel),metalnessMapUv:Ce&&_(E.metalnessMap.channel),roughnessMapUv:P&&_(E.roughnessMap.channel),anisotropyMapUv:le&&_(E.anisotropyMap.channel),clearcoatMapUv:ce&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:Se&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:Be&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:we&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:me&&_(E.sheenRoughnessMap.channel),specularMapUv:xe&&_(E.specularMap.channel),specularColorMapUv:Ne&&_(E.specularColorMap.channel),specularIntensityMapUv:We&&_(E.specularIntensityMap.channel),transmissionMapUv:M&&_(E.transmissionMap.channel),thicknessMapUv:$&&_(E.thicknessMap.channel),alphaMapUv:ee&&_(E.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(ye||x),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:A.isPoints===!0&&!!z.attributes.uv&&(ve||ee),fog:!!I,useFog:E.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:A.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:N,morphTextureStride:V,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:s.shadowMap.enabled&&F.length>0,shadowMapType:s.shadowMap.type,toneMapping:je,decodeVideoTexture:ve&&E.map.isVideoTexture===!0&&nt.getTransfer(E.map.colorSpace)===ot,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===sn,flipSided:E.side===Ft,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Re&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:Re&&E.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return Xe.vertexUv1s=c.has(1),Xe.vertexUv2s=c.has(2),Xe.vertexUv3s=c.has(3),c.clear(),Xe}function m(E){const y=[];if(E.shaderID?y.push(E.shaderID):(y.push(E.customVertexShaderID),y.push(E.customFragmentShaderID)),E.defines!==void 0)for(const F in E.defines)y.push(F),y.push(E.defines[F]);return E.isRawShaderMaterial===!1&&(S(y,E),v(y,E),y.push(s.outputColorSpace)),y.push(E.customProgramCacheKey),y.join()}function S(E,y){E.push(y.precision),E.push(y.outputColorSpace),E.push(y.envMapMode),E.push(y.envMapCubeUVHeight),E.push(y.mapUv),E.push(y.alphaMapUv),E.push(y.lightMapUv),E.push(y.aoMapUv),E.push(y.bumpMapUv),E.push(y.normalMapUv),E.push(y.displacementMapUv),E.push(y.emissiveMapUv),E.push(y.metalnessMapUv),E.push(y.roughnessMapUv),E.push(y.anisotropyMapUv),E.push(y.clearcoatMapUv),E.push(y.clearcoatNormalMapUv),E.push(y.clearcoatRoughnessMapUv),E.push(y.iridescenceMapUv),E.push(y.iridescenceThicknessMapUv),E.push(y.sheenColorMapUv),E.push(y.sheenRoughnessMapUv),E.push(y.specularMapUv),E.push(y.specularColorMapUv),E.push(y.specularIntensityMapUv),E.push(y.transmissionMapUv),E.push(y.thicknessMapUv),E.push(y.combine),E.push(y.fogExp2),E.push(y.sizeAttenuation),E.push(y.morphTargetsCount),E.push(y.morphAttributeCount),E.push(y.numDirLights),E.push(y.numPointLights),E.push(y.numSpotLights),E.push(y.numSpotLightMaps),E.push(y.numHemiLights),E.push(y.numRectAreaLights),E.push(y.numDirLightShadows),E.push(y.numPointLightShadows),E.push(y.numSpotLightShadows),E.push(y.numSpotLightShadowsWithMaps),E.push(y.numLightProbes),E.push(y.shadowMapType),E.push(y.toneMapping),E.push(y.numClippingPlanes),E.push(y.numClipIntersection),E.push(y.depthPacking)}function v(E,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),E.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.skinning&&a.enable(4),y.morphTargets&&a.enable(5),y.morphNormals&&a.enable(6),y.morphColors&&a.enable(7),y.premultipliedAlpha&&a.enable(8),y.shadowMapEnabled&&a.enable(9),y.doubleSided&&a.enable(10),y.flipSided&&a.enable(11),y.useDepthPacking&&a.enable(12),y.dithering&&a.enable(13),y.transmission&&a.enable(14),y.sheen&&a.enable(15),y.opaque&&a.enable(16),y.pointsUvs&&a.enable(17),y.decodeVideoTexture&&a.enable(18),y.alphaToCoverage&&a.enable(19),E.push(a.mask)}function b(E){const y=g[E.type];let F;if(y){const L=rn[y];F=pr.clone(L.uniforms)}else F=E.uniforms;return F}function R(E,y){let F;for(let L=0,A=h.length;L<A;L++){const I=h[L];if(I.cacheKey===y){F=I,++F.usedTimes;break}}return F===void 0&&(F=new n_(s,y,E,r),h.push(F)),F}function w(E){if(--E.usedTimes===0){const y=h.indexOf(E);h[y]=h[h.length-1],h.pop(),E.destroy()}}function T(E){l.remove(E)}function U(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:b,acquireProgram:R,releaseProgram:w,releaseShaderCache:T,programs:h,dispose:U}}function a_(){let s=new WeakMap;function e(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function t(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function l_(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Gl(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Hl(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(d,u,f,g,_,p){let m=s[e];return m===void 0?(m={id:d.id,object:d,geometry:u,material:f,groupOrder:g,renderOrder:d.renderOrder,z:_,group:p},s[e]=m):(m.id=d.id,m.object=d,m.geometry=u,m.material=f,m.groupOrder=g,m.renderOrder=d.renderOrder,m.z=_,m.group=p),e++,m}function a(d,u,f,g,_,p){const m=o(d,u,f,g,_,p);f.transmission>0?n.push(m):f.transparent===!0?i.push(m):t.push(m)}function l(d,u,f,g,_,p){const m=o(d,u,f,g,_,p);f.transmission>0?n.unshift(m):f.transparent===!0?i.unshift(m):t.unshift(m)}function c(d,u){t.length>1&&t.sort(d||l_),n.length>1&&n.sort(u||Gl),i.length>1&&i.sort(u||Gl)}function h(){for(let d=e,u=s.length;d<u;d++){const f=s[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function c_(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new Hl,s.set(n,[o])):i>=r.length?(o=new Hl,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function h_(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new W,color:new Ve};break;case"SpotLight":t={position:new W,direction:new W,color:new Ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new W,color:new Ve,distance:0,decay:0};break;case"HemisphereLight":t={direction:new W,skyColor:new Ve,groundColor:new Ve};break;case"RectAreaLight":t={color:new Ve,position:new W,halfWidth:new W,halfHeight:new W};break}return s[e.id]=t,t}}}function u_(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let d_=0;function f_(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function p_(s){const e=new h_,t=u_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new W);const i=new W,r=new it,o=new it;function a(c){let h=0,d=0,u=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let f=0,g=0,_=0,p=0,m=0,S=0,v=0,b=0,R=0,w=0,T=0;c.sort(f_);for(let E=0,y=c.length;E<y;E++){const F=c[E],L=F.color,A=F.intensity,I=F.distance,z=F.shadow&&F.shadow.map?F.shadow.map.texture:null;if(F.isAmbientLight)h+=L.r*A,d+=L.g*A,u+=L.b*A;else if(F.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(F.sh.coefficients[B],A);T++}else if(F.isDirectionalLight){const B=e.get(F);if(B.color.copy(F.color).multiplyScalar(F.intensity),F.castShadow){const ie=F.shadow,j=t.get(F);j.shadowBias=ie.bias,j.shadowNormalBias=ie.normalBias,j.shadowRadius=ie.radius,j.shadowMapSize=ie.mapSize,n.directionalShadow[f]=j,n.directionalShadowMap[f]=z,n.directionalShadowMatrix[f]=F.shadow.matrix,S++}n.directional[f]=B,f++}else if(F.isSpotLight){const B=e.get(F);B.position.setFromMatrixPosition(F.matrixWorld),B.color.copy(L).multiplyScalar(A),B.distance=I,B.coneCos=Math.cos(F.angle),B.penumbraCos=Math.cos(F.angle*(1-F.penumbra)),B.decay=F.decay,n.spot[_]=B;const ie=F.shadow;if(F.map&&(n.spotLightMap[R]=F.map,R++,ie.updateMatrices(F),F.castShadow&&w++),n.spotLightMatrix[_]=ie.matrix,F.castShadow){const j=t.get(F);j.shadowBias=ie.bias,j.shadowNormalBias=ie.normalBias,j.shadowRadius=ie.radius,j.shadowMapSize=ie.mapSize,n.spotShadow[_]=j,n.spotShadowMap[_]=z,b++}_++}else if(F.isRectAreaLight){const B=e.get(F);B.color.copy(L).multiplyScalar(A),B.halfWidth.set(F.width*.5,0,0),B.halfHeight.set(0,F.height*.5,0),n.rectArea[p]=B,p++}else if(F.isPointLight){const B=e.get(F);if(B.color.copy(F.color).multiplyScalar(F.intensity),B.distance=F.distance,B.decay=F.decay,F.castShadow){const ie=F.shadow,j=t.get(F);j.shadowBias=ie.bias,j.shadowNormalBias=ie.normalBias,j.shadowRadius=ie.radius,j.shadowMapSize=ie.mapSize,j.shadowCameraNear=ie.camera.near,j.shadowCameraFar=ie.camera.far,n.pointShadow[g]=j,n.pointShadowMap[g]=z,n.pointShadowMatrix[g]=F.shadow.matrix,v++}n.point[g]=B,g++}else if(F.isHemisphereLight){const B=e.get(F);B.skyColor.copy(F.color).multiplyScalar(A),B.groundColor.copy(F.groundColor).multiplyScalar(A),n.hemi[m]=B,m++}}p>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Le.LTC_FLOAT_1,n.rectAreaLTC2=Le.LTC_FLOAT_2):(n.rectAreaLTC1=Le.LTC_HALF_1,n.rectAreaLTC2=Le.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const U=n.hash;(U.directionalLength!==f||U.pointLength!==g||U.spotLength!==_||U.rectAreaLength!==p||U.hemiLength!==m||U.numDirectionalShadows!==S||U.numPointShadows!==v||U.numSpotShadows!==b||U.numSpotMaps!==R||U.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=b+R-w,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=T,U.directionalLength=f,U.pointLength=g,U.spotLength=_,U.rectAreaLength=p,U.hemiLength=m,U.numDirectionalShadows=S,U.numPointShadows=v,U.numSpotShadows=b,U.numSpotMaps=R,U.numLightProbes=T,n.version=d_++)}function l(c,h){let d=0,u=0,f=0,g=0,_=0;const p=h.matrixWorldInverse;for(let m=0,S=c.length;m<S;m++){const v=c[m];if(v.isDirectionalLight){const b=n.directional[d];b.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(p),d++}else if(v.isSpotLight){const b=n.spot[f];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(p),f++}else if(v.isRectAreaLight){const b=n.rectArea[g];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(p),o.identity(),r.copy(v.matrixWorld),r.premultiply(p),o.extractRotation(r),b.halfWidth.set(v.width*.5,0,0),b.halfHeight.set(0,v.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){const b=n.point[u];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(p),u++}else if(v.isHemisphereLight){const b=n.hemi[_];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(p),_++}}}return{setup:a,setupView:l,state:n}}function Vl(s){const e=new p_(s),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function m_(s){let e=new WeakMap;function t(i,r=0){const o=e.get(i);let a;return o===void 0?(a=new Vl(s),e.set(i,[a])):r>=o.length?(a=new Vl(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class lh extends zi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=pd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ch extends zi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const g_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,__=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function v_(s,e,t){let n=new jo;const i=new Oe,r=new Oe,o=new ht,a=new lh({depthPacking:Hc}),l=new ch,c={},h=t.maxTextureSize,d={[Nn]:Ft,[Ft]:Nn,[sn]:sn},u=new It({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:g_,fragmentShader:__}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Gt;g.setAttribute("position",new zt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Rt(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lc;let m=this.type;this.render=function(w,T,U){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const E=s.getRenderTarget(),y=s.getActiveCubeFace(),F=s.getActiveMipmapLevel(),L=s.state;L.setBlending(yn),L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const A=m!==gn&&this.type===gn,I=m===gn&&this.type!==gn;for(let z=0,B=w.length;z<B;z++){const ie=w[z],j=ie.shadow;if(j===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;i.copy(j.mapSize);const K=j.getFrameExtents();if(i.multiply(K),r.copy(j.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/K.x),i.x=r.x*K.x,j.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/K.y),i.y=r.y*K.y,j.mapSize.y=r.y)),j.map===null||A===!0||I===!0){const N=this.type!==gn?{minFilter:Dt,magFilter:Dt}:{};j.map!==null&&j.map.dispose(),j.map=new en(i.x,i.y,N),j.map.texture.name=ie.name+".shadowMap",j.camera.updateProjectionMatrix()}s.setRenderTarget(j.map),s.clear();const q=j.getViewportCount();for(let N=0;N<q;N++){const V=j.getViewport(N);o.set(r.x*V.x,r.y*V.y,r.x*V.z,r.y*V.w),L.viewport(o),j.updateMatrices(ie,N),n=j.getFrustum(),b(T,U,j.camera,ie,this.type)}j.isPointLightShadow!==!0&&this.type===gn&&S(j,U),j.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(E,y,F)};function S(w,T){const U=e.update(_);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new en(i.x,i.y)),u.uniforms.shadow_pass.value=w.map.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(T,null,U,u,_,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(T,null,U,f,_,null)}function v(w,T,U,E){let y=null;const F=U.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(F!==void 0)y=F;else if(y=U.isPointLight===!0?l:a,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const L=y.uuid,A=T.uuid;let I=c[L];I===void 0&&(I={},c[L]=I);let z=I[A];z===void 0&&(z=y.clone(),I[A]=z,T.addEventListener("dispose",R)),y=z}if(y.visible=T.visible,y.wireframe=T.wireframe,E===gn?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:d[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,U.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const L=s.properties.get(y);L.light=U}return y}function b(w,T,U,E,y){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===gn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,w.matrixWorld);const A=e.update(w),I=w.material;if(Array.isArray(I)){const z=A.groups;for(let B=0,ie=z.length;B<ie;B++){const j=z[B],K=I[j.materialIndex];if(K&&K.visible){const q=v(w,K,E,y);w.onBeforeShadow(s,w,T,U,A,q,j),s.renderBufferDirect(U,null,A,q,w,j),w.onAfterShadow(s,w,T,U,A,q,j)}}}else if(I.visible){const z=v(w,I,E,y);w.onBeforeShadow(s,w,T,U,A,z,null),s.renderBufferDirect(U,null,A,z,w,null),w.onAfterShadow(s,w,T,U,A,z,null)}}const L=w.children;for(let A=0,I=L.length;A<I;A++)b(L[A],T,U,E,y)}function R(w){w.target.removeEventListener("dispose",R);for(const U in c){const E=c[U],y=w.target.uuid;y in E&&(E[y].dispose(),delete E[y])}}}function x_(s){function e(){let M=!1;const $=new ht;let G=null;const ee=new ht(0,0,0,0);return{setMask:function(ge){G!==ge&&!M&&(s.colorMask(ge,ge,ge,ge),G=ge)},setLocked:function(ge){M=ge},setClear:function(ge,Ae,Re,je,Xe){Xe===!0&&(ge*=je,Ae*=je,Re*=je),$.set(ge,Ae,Re,je),ee.equals($)===!1&&(s.clearColor(ge,Ae,Re,je),ee.copy($))},reset:function(){M=!1,G=null,ee.set(-1,0,0,0)}}}function t(){let M=!1,$=null,G=null,ee=null;return{setTest:function(ge){ge?te(s.DEPTH_TEST):H(s.DEPTH_TEST)},setMask:function(ge){$!==ge&&!M&&(s.depthMask(ge),$=ge)},setFunc:function(ge){if(G!==ge){switch(ge){case Hu:s.depthFunc(s.NEVER);break;case Vu:s.depthFunc(s.ALWAYS);break;case Wu:s.depthFunc(s.LESS);break;case us:s.depthFunc(s.LEQUAL);break;case Xu:s.depthFunc(s.EQUAL);break;case Yu:s.depthFunc(s.GEQUAL);break;case ju:s.depthFunc(s.GREATER);break;case qu:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}G=ge}},setLocked:function(ge){M=ge},setClear:function(ge){ee!==ge&&(s.clearDepth(ge),ee=ge)},reset:function(){M=!1,$=null,G=null,ee=null}}}function n(){let M=!1,$=null,G=null,ee=null,ge=null,Ae=null,Re=null,je=null,Xe=null;return{setTest:function(De){M||(De?te(s.STENCIL_TEST):H(s.STENCIL_TEST))},setMask:function(De){$!==De&&!M&&(s.stencilMask(De),$=De)},setFunc:function(De,Ye,Je){(G!==De||ee!==Ye||ge!==Je)&&(s.stencilFunc(De,Ye,Je),G=De,ee=Ye,ge=Je)},setOp:function(De,Ye,Je){(Ae!==De||Re!==Ye||je!==Je)&&(s.stencilOp(De,Ye,Je),Ae=De,Re=Ye,je=Je)},setLocked:function(De){M=De},setClear:function(De){Xe!==De&&(s.clearStencil(De),Xe=De)},reset:function(){M=!1,$=null,G=null,ee=null,ge=null,Ae=null,Re=null,je=null,Xe=null}}}const i=new e,r=new t,o=new n,a=new WeakMap,l=new WeakMap;let c={},h={},d=new WeakMap,u=[],f=null,g=!1,_=null,p=null,m=null,S=null,v=null,b=null,R=null,w=new Ve(0,0,0),T=0,U=!1,E=null,y=null,F=null,L=null,A=null;const I=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,B=0;const ie=s.getParameter(s.VERSION);ie.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(ie)[1]),z=B>=1):ie.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),z=B>=2);let j=null,K={};const q=s.getParameter(s.SCISSOR_BOX),N=s.getParameter(s.VIEWPORT),V=new ht().fromArray(q),ne=new ht().fromArray(N);function O(M,$,G,ee){const ge=new Uint8Array(4),Ae=s.createTexture();s.bindTexture(M,Ae),s.texParameteri(M,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(M,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Re=0;Re<G;Re++)M===s.TEXTURE_3D||M===s.TEXTURE_2D_ARRAY?s.texImage3D($,0,s.RGBA,1,1,ee,0,s.RGBA,s.UNSIGNED_BYTE,ge):s.texImage2D($+Re,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ge);return Ae}const k={};k[s.TEXTURE_2D]=O(s.TEXTURE_2D,s.TEXTURE_2D,1),k[s.TEXTURE_CUBE_MAP]=O(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),k[s.TEXTURE_2D_ARRAY]=O(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),k[s.TEXTURE_3D]=O(s.TEXTURE_3D,s.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),o.setClear(0),te(s.DEPTH_TEST),r.setFunc(us),fe(!1),ye(Ta),te(s.CULL_FACE),Pe(yn);function te(M){c[M]!==!0&&(s.enable(M),c[M]=!0)}function H(M){c[M]!==!1&&(s.disable(M),c[M]=!1)}function ae(M,$){return h[M]!==$?(s.bindFramebuffer(M,$),h[M]=$,M===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=$),M===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=$),!0):!1}function pe(M,$){let G=u,ee=!1;if(M){G=d.get($),G===void 0&&(G=[],d.set($,G));const ge=M.textures;if(G.length!==ge.length||G[0]!==s.COLOR_ATTACHMENT0){for(let Ae=0,Re=ge.length;Ae<Re;Ae++)G[Ae]=s.COLOR_ATTACHMENT0+Ae;G.length=ge.length,ee=!0}}else G[0]!==s.BACK&&(G[0]=s.BACK,ee=!0);ee&&s.drawBuffers(G)}function ve(M){return f!==M?(s.useProgram(M),f=M,!0):!1}const D={[Kn]:s.FUNC_ADD,[Tu]:s.FUNC_SUBTRACT,[wu]:s.FUNC_REVERSE_SUBTRACT};D[Au]=s.MIN,D[Cu]=s.MAX;const he={[Ru]:s.ZERO,[Pu]:s.ONE,[Uu]:s.SRC_COLOR,[Ao]:s.SRC_ALPHA,[Ou]:s.SRC_ALPHA_SATURATE,[Fu]:s.DST_COLOR,[Du]:s.DST_ALPHA,[Lu]:s.ONE_MINUS_SRC_COLOR,[Co]:s.ONE_MINUS_SRC_ALPHA,[Nu]:s.ONE_MINUS_DST_COLOR,[Iu]:s.ONE_MINUS_DST_ALPHA,[Bu]:s.CONSTANT_COLOR,[ku]:s.ONE_MINUS_CONSTANT_COLOR,[zu]:s.CONSTANT_ALPHA,[Gu]:s.ONE_MINUS_CONSTANT_ALPHA};function Pe(M,$,G,ee,ge,Ae,Re,je,Xe,De){if(M===yn){g===!0&&(H(s.BLEND),g=!1);return}if(g===!1&&(te(s.BLEND),g=!0),M!==Eu){if(M!==_||De!==U){if((p!==Kn||v!==Kn)&&(s.blendEquation(s.FUNC_ADD),p=Kn,v=Kn),De)switch(M){case Ri:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case hs:s.blendFunc(s.ONE,s.ONE);break;case wa:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Aa:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",M);break}else switch(M){case Ri:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case hs:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case wa:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Aa:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",M);break}m=null,S=null,b=null,R=null,w.set(0,0,0),T=0,_=M,U=De}return}ge=ge||$,Ae=Ae||G,Re=Re||ee,($!==p||ge!==v)&&(s.blendEquationSeparate(D[$],D[ge]),p=$,v=ge),(G!==m||ee!==S||Ae!==b||Re!==R)&&(s.blendFuncSeparate(he[G],he[ee],he[Ae],he[Re]),m=G,S=ee,b=Ae,R=Re),(je.equals(w)===!1||Xe!==T)&&(s.blendColor(je.r,je.g,je.b,Xe),w.copy(je),T=Xe),_=M,U=!1}function Ue(M,$){M.side===sn?H(s.CULL_FACE):te(s.CULL_FACE);let G=M.side===Ft;$&&(G=!G),fe(G),M.blending===Ri&&M.transparent===!1?Pe(yn):Pe(M.blending,M.blendEquation,M.blendSrc,M.blendDst,M.blendEquationAlpha,M.blendSrcAlpha,M.blendDstAlpha,M.blendColor,M.blendAlpha,M.premultipliedAlpha),r.setFunc(M.depthFunc),r.setTest(M.depthTest),r.setMask(M.depthWrite),i.setMask(M.colorWrite);const ee=M.stencilWrite;o.setTest(ee),ee&&(o.setMask(M.stencilWriteMask),o.setFunc(M.stencilFunc,M.stencilRef,M.stencilFuncMask),o.setOp(M.stencilFail,M.stencilZFail,M.stencilZPass)),de(M.polygonOffset,M.polygonOffsetFactor,M.polygonOffsetUnits),M.alphaToCoverage===!0?te(s.SAMPLE_ALPHA_TO_COVERAGE):H(s.SAMPLE_ALPHA_TO_COVERAGE)}function fe(M){E!==M&&(M?s.frontFace(s.CW):s.frontFace(s.CCW),E=M)}function ye(M){M!==Su?(te(s.CULL_FACE),M!==y&&(M===Ta?s.cullFace(s.BACK):M===Mu?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):H(s.CULL_FACE),y=M}function Me(M){M!==F&&(z&&s.lineWidth(M),F=M)}function de(M,$,G){M?(te(s.POLYGON_OFFSET_FILL),(L!==$||A!==G)&&(s.polygonOffset($,G),L=$,A=G)):H(s.POLYGON_OFFSET_FILL)}function Ce(M){M?te(s.SCISSOR_TEST):H(s.SCISSOR_TEST)}function P(M){M===void 0&&(M=s.TEXTURE0+I-1),j!==M&&(s.activeTexture(M),j=M)}function x(M,$,G){G===void 0&&(j===null?G=s.TEXTURE0+I-1:G=j);let ee=K[G];ee===void 0&&(ee={type:void 0,texture:void 0},K[G]=ee),(ee.type!==M||ee.texture!==$)&&(j!==G&&(s.activeTexture(G),j=G),s.bindTexture(M,$||k[M]),ee.type=M,ee.texture=$)}function X(){const M=K[j];M!==void 0&&M.type!==void 0&&(s.bindTexture(M.type,null),M.type=void 0,M.texture=void 0)}function Z(){try{s.compressedTexImage2D.apply(s,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function re(){try{s.compressedTexImage3D.apply(s,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function Q(){try{s.texSubImage2D.apply(s,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function Te(){try{s.texSubImage3D.apply(s,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function le(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function ce(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function Se(){try{s.texStorage2D.apply(s,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function ue(){try{s.texStorage3D.apply(s,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function be(){try{s.texImage2D.apply(s,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function Be(){try{s.texImage3D.apply(s,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function we(M){V.equals(M)===!1&&(s.scissor(M.x,M.y,M.z,M.w),V.copy(M))}function me(M){ne.equals(M)===!1&&(s.viewport(M.x,M.y,M.z,M.w),ne.copy(M))}function xe(M,$){let G=l.get($);G===void 0&&(G=new WeakMap,l.set($,G));let ee=G.get(M);ee===void 0&&(ee=s.getUniformBlockIndex($,M.name),G.set(M,ee))}function Ne(M,$){const ee=l.get($).get(M);a.get($)!==ee&&(s.uniformBlockBinding($,ee,M.__bindingPointIndex),a.set($,ee))}function We(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),c={},j=null,K={},h={},d=new WeakMap,u=[],f=null,g=!1,_=null,p=null,m=null,S=null,v=null,b=null,R=null,w=new Ve(0,0,0),T=0,U=!1,E=null,y=null,F=null,L=null,A=null,V.set(0,0,s.canvas.width,s.canvas.height),ne.set(0,0,s.canvas.width,s.canvas.height),i.reset(),r.reset(),o.reset()}return{buffers:{color:i,depth:r,stencil:o},enable:te,disable:H,bindFramebuffer:ae,drawBuffers:pe,useProgram:ve,setBlending:Pe,setMaterial:Ue,setFlipSided:fe,setCullFace:ye,setLineWidth:Me,setPolygonOffset:de,setScissorTest:Ce,activeTexture:P,bindTexture:x,unbindTexture:X,compressedTexImage2D:Z,compressedTexImage3D:re,texImage2D:be,texImage3D:Be,updateUBOMapping:xe,uniformBlockBinding:Ne,texStorage2D:Se,texStorage3D:ue,texSubImage2D:Q,texSubImage3D:Te,compressedTexSubImage2D:le,compressedTexSubImage3D:ce,scissor:we,viewport:me,reset:We}}function y_(s,e,t,n,i,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Oe,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,x){return f?new OffscreenCanvas(P,x):_s("canvas")}function _(P,x,X){let Z=1;const re=Ce(P);if((re.width>X||re.height>X)&&(Z=X/Math.max(re.width,re.height)),Z<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const Q=Math.floor(Z*re.width),Te=Math.floor(Z*re.height);d===void 0&&(d=g(Q,Te));const le=x?g(Q,Te):d;return le.width=Q,le.height=Te,le.getContext("2d").drawImage(P,0,0,Q,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+Q+"x"+Te+")."),le}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),P;return P}function p(P){return P.generateMipmaps&&P.minFilter!==Dt&&P.minFilter!==kt}function m(P){s.generateMipmap(P)}function S(P,x,X,Z,re=!1){if(P!==null){if(s[P]!==void 0)return s[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let Q=x;if(x===s.RED&&(X===s.FLOAT&&(Q=s.R32F),X===s.HALF_FLOAT&&(Q=s.R16F),X===s.UNSIGNED_BYTE&&(Q=s.R8)),x===s.RED_INTEGER&&(X===s.UNSIGNED_BYTE&&(Q=s.R8UI),X===s.UNSIGNED_SHORT&&(Q=s.R16UI),X===s.UNSIGNED_INT&&(Q=s.R32UI),X===s.BYTE&&(Q=s.R8I),X===s.SHORT&&(Q=s.R16I),X===s.INT&&(Q=s.R32I)),x===s.RG&&(X===s.FLOAT&&(Q=s.RG32F),X===s.HALF_FLOAT&&(Q=s.RG16F),X===s.UNSIGNED_BYTE&&(Q=s.RG8)),x===s.RG_INTEGER&&(X===s.UNSIGNED_BYTE&&(Q=s.RG8UI),X===s.UNSIGNED_SHORT&&(Q=s.RG16UI),X===s.UNSIGNED_INT&&(Q=s.RG32UI),X===s.BYTE&&(Q=s.RG8I),X===s.SHORT&&(Q=s.RG16I),X===s.INT&&(Q=s.RG32I)),x===s.RGB&&X===s.UNSIGNED_INT_5_9_9_9_REV&&(Q=s.RGB9_E5),x===s.RGBA){const Te=re?fs:nt.getTransfer(Z);X===s.FLOAT&&(Q=s.RGBA32F),X===s.HALF_FLOAT&&(Q=s.RGBA16F),X===s.UNSIGNED_BYTE&&(Q=Te===ot?s.SRGB8_ALPHA8:s.RGBA8),X===s.UNSIGNED_SHORT_4_4_4_4&&(Q=s.RGBA4),X===s.UNSIGNED_SHORT_5_5_5_1&&(Q=s.RGB5_A1)}return(Q===s.R16F||Q===s.R32F||Q===s.RG16F||Q===s.RG32F||Q===s.RGBA16F||Q===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function v(P,x){let X;return P?x===null||x===Fi||x===Ni?X=s.DEPTH24_STENCIL8:x===vn?X=s.DEPTH32F_STENCIL8:x===ds&&(X=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Fi||x===Ni?X=s.DEPTH_COMPONENT24:x===vn?X=s.DEPTH_COMPONENT32F:x===ds&&(X=s.DEPTH_COMPONENT16),X}function b(P,x){return p(P)===!0||P.isFramebufferTexture&&P.minFilter!==Dt&&P.minFilter!==kt?Math.log2(Math.max(x.width,x.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?x.mipmaps.length:1}function R(P){const x=P.target;x.removeEventListener("dispose",R),T(x),x.isVideoTexture&&h.delete(x)}function w(P){const x=P.target;x.removeEventListener("dispose",w),E(x)}function T(P){const x=n.get(P);if(x.__webglInit===void 0)return;const X=P.source,Z=u.get(X);if(Z){const re=Z[x.__cacheKey];re.usedTimes--,re.usedTimes===0&&U(P),Object.keys(Z).length===0&&u.delete(X)}n.remove(P)}function U(P){const x=n.get(P);s.deleteTexture(x.__webglTexture);const X=P.source,Z=u.get(X);delete Z[x.__cacheKey],o.memory.textures--}function E(P){const x=n.get(P);if(P.depthTexture&&P.depthTexture.dispose(),P.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(x.__webglFramebuffer[Z]))for(let re=0;re<x.__webglFramebuffer[Z].length;re++)s.deleteFramebuffer(x.__webglFramebuffer[Z][re]);else s.deleteFramebuffer(x.__webglFramebuffer[Z]);x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer[Z])}else{if(Array.isArray(x.__webglFramebuffer))for(let Z=0;Z<x.__webglFramebuffer.length;Z++)s.deleteFramebuffer(x.__webglFramebuffer[Z]);else s.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&s.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let Z=0;Z<x.__webglColorRenderbuffer.length;Z++)x.__webglColorRenderbuffer[Z]&&s.deleteRenderbuffer(x.__webglColorRenderbuffer[Z]);x.__webglDepthRenderbuffer&&s.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const X=P.textures;for(let Z=0,re=X.length;Z<re;Z++){const Q=n.get(X[Z]);Q.__webglTexture&&(s.deleteTexture(Q.__webglTexture),o.memory.textures--),n.remove(X[Z])}n.remove(P)}let y=0;function F(){y=0}function L(){const P=y;return P>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),y+=1,P}function A(P){const x=[];return x.push(P.wrapS),x.push(P.wrapT),x.push(P.wrapR||0),x.push(P.magFilter),x.push(P.minFilter),x.push(P.anisotropy),x.push(P.internalFormat),x.push(P.format),x.push(P.type),x.push(P.generateMipmaps),x.push(P.premultiplyAlpha),x.push(P.flipY),x.push(P.unpackAlignment),x.push(P.colorSpace),x.join()}function I(P,x){const X=n.get(P);if(P.isVideoTexture&&Me(P),P.isRenderTargetTexture===!1&&P.version>0&&X.__version!==P.version){const Z=P.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ne(X,P,x);return}}t.bindTexture(s.TEXTURE_2D,X.__webglTexture,s.TEXTURE0+x)}function z(P,x){const X=n.get(P);if(P.version>0&&X.__version!==P.version){ne(X,P,x);return}t.bindTexture(s.TEXTURE_2D_ARRAY,X.__webglTexture,s.TEXTURE0+x)}function B(P,x){const X=n.get(P);if(P.version>0&&X.__version!==P.version){ne(X,P,x);return}t.bindTexture(s.TEXTURE_3D,X.__webglTexture,s.TEXTURE0+x)}function ie(P,x){const X=n.get(P);if(P.version>0&&X.__version!==P.version){O(X,P,x);return}t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture,s.TEXTURE0+x)}const j={[Uo]:s.REPEAT,[Qn]:s.CLAMP_TO_EDGE,[Lo]:s.MIRRORED_REPEAT},K={[Dt]:s.NEAREST,[rd]:s.NEAREST_MIPMAP_NEAREST,[Cr]:s.NEAREST_MIPMAP_LINEAR,[kt]:s.LINEAR,[zs]:s.LINEAR_MIPMAP_NEAREST,[$n]:s.LINEAR_MIPMAP_LINEAR},q={[gd]:s.NEVER,[Md]:s.ALWAYS,[_d]:s.LESS,[Wc]:s.LEQUAL,[vd]:s.EQUAL,[Sd]:s.GEQUAL,[xd]:s.GREATER,[yd]:s.NOTEQUAL};function N(P,x){if(x.type===vn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===kt||x.magFilter===zs||x.magFilter===Cr||x.magFilter===$n||x.minFilter===kt||x.minFilter===zs||x.minFilter===Cr||x.minFilter===$n)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,j[x.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,j[x.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,j[x.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,K[x.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,K[x.minFilter]),x.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,q[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Dt||x.minFilter!==Cr&&x.minFilter!==$n||x.type===vn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const X=e.get("EXT_texture_filter_anisotropic");s.texParameterf(P,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function V(P,x){let X=!1;P.__webglInit===void 0&&(P.__webglInit=!0,x.addEventListener("dispose",R));const Z=x.source;let re=u.get(Z);re===void 0&&(re={},u.set(Z,re));const Q=A(x);if(Q!==P.__cacheKey){re[Q]===void 0&&(re[Q]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,X=!0),re[Q].usedTimes++;const Te=re[P.__cacheKey];Te!==void 0&&(re[P.__cacheKey].usedTimes--,Te.usedTimes===0&&U(x)),P.__cacheKey=Q,P.__webglTexture=re[Q].texture}return X}function ne(P,x,X){let Z=s.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(Z=s.TEXTURE_2D_ARRAY),x.isData3DTexture&&(Z=s.TEXTURE_3D);const re=V(P,x),Q=x.source;t.bindTexture(Z,P.__webglTexture,s.TEXTURE0+X);const Te=n.get(Q);if(Q.version!==Te.__version||re===!0){t.activeTexture(s.TEXTURE0+X);const le=nt.getPrimaries(nt.workingColorSpace),ce=x.colorSpace===Dn?null:nt.getPrimaries(x.colorSpace),Se=x.colorSpace===Dn||le===ce?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);let ue=_(x.image,!1,i.maxTextureSize);ue=de(x,ue);const be=r.convert(x.format,x.colorSpace),Be=r.convert(x.type);let we=S(x.internalFormat,be,Be,x.colorSpace,x.isVideoTexture);N(Z,x);let me;const xe=x.mipmaps,Ne=x.isVideoTexture!==!0,We=Te.__version===void 0||re===!0,M=Q.dataReady,$=b(x,ue);if(x.isDepthTexture)we=v(x.format===Oi,x.type),We&&(Ne?t.texStorage2D(s.TEXTURE_2D,1,we,ue.width,ue.height):t.texImage2D(s.TEXTURE_2D,0,we,ue.width,ue.height,0,be,Be,null));else if(x.isDataTexture)if(xe.length>0){Ne&&We&&t.texStorage2D(s.TEXTURE_2D,$,we,xe[0].width,xe[0].height);for(let G=0,ee=xe.length;G<ee;G++)me=xe[G],Ne?M&&t.texSubImage2D(s.TEXTURE_2D,G,0,0,me.width,me.height,be,Be,me.data):t.texImage2D(s.TEXTURE_2D,G,we,me.width,me.height,0,be,Be,me.data);x.generateMipmaps=!1}else Ne?(We&&t.texStorage2D(s.TEXTURE_2D,$,we,ue.width,ue.height),M&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ue.width,ue.height,be,Be,ue.data)):t.texImage2D(s.TEXTURE_2D,0,we,ue.width,ue.height,0,be,Be,ue.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Ne&&We&&t.texStorage3D(s.TEXTURE_2D_ARRAY,$,we,xe[0].width,xe[0].height,ue.depth);for(let G=0,ee=xe.length;G<ee;G++)if(me=xe[G],x.format!==an)if(be!==null)if(Ne){if(M)if(x.layerUpdates.size>0){for(const ge of x.layerUpdates){const Ae=me.width*me.height;t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,G,0,0,ge,me.width,me.height,1,be,me.data.slice(Ae*ge,Ae*(ge+1)),0,0)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,G,0,0,0,me.width,me.height,ue.depth,be,me.data,0,0)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,G,we,me.width,me.height,ue.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ne?M&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,G,0,0,0,me.width,me.height,ue.depth,be,Be,me.data):t.texImage3D(s.TEXTURE_2D_ARRAY,G,we,me.width,me.height,ue.depth,0,be,Be,me.data)}else{Ne&&We&&t.texStorage2D(s.TEXTURE_2D,$,we,xe[0].width,xe[0].height);for(let G=0,ee=xe.length;G<ee;G++)me=xe[G],x.format!==an?be!==null?Ne?M&&t.compressedTexSubImage2D(s.TEXTURE_2D,G,0,0,me.width,me.height,be,me.data):t.compressedTexImage2D(s.TEXTURE_2D,G,we,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ne?M&&t.texSubImage2D(s.TEXTURE_2D,G,0,0,me.width,me.height,be,Be,me.data):t.texImage2D(s.TEXTURE_2D,G,we,me.width,me.height,0,be,Be,me.data)}else if(x.isDataArrayTexture)if(Ne){if(We&&t.texStorage3D(s.TEXTURE_2D_ARRAY,$,we,ue.width,ue.height,ue.depth),M)if(x.layerUpdates.size>0){let G;switch(Be){case s.UNSIGNED_BYTE:switch(be){case s.ALPHA:G=1;break;case s.LUMINANCE:G=1;break;case s.LUMINANCE_ALPHA:G=2;break;case s.RGB:G=3;break;case s.RGBA:G=4;break;default:throw new Error(`Unknown texel size for format ${be}.`)}break;case s.UNSIGNED_SHORT_4_4_4_4:case s.UNSIGNED_SHORT_5_5_5_1:case s.UNSIGNED_SHORT_5_6_5:G=1;break;default:throw new Error(`Unknown texel size for type ${Be}.`)}const ee=ue.width*ue.height*G;for(const ge of x.layerUpdates)t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ge,ue.width,ue.height,1,be,Be,ue.data.slice(ee*ge,ee*(ge+1)));x.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,be,Be,ue.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,we,ue.width,ue.height,ue.depth,0,be,Be,ue.data);else if(x.isData3DTexture)Ne?(We&&t.texStorage3D(s.TEXTURE_3D,$,we,ue.width,ue.height,ue.depth),M&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,be,Be,ue.data)):t.texImage3D(s.TEXTURE_3D,0,we,ue.width,ue.height,ue.depth,0,be,Be,ue.data);else if(x.isFramebufferTexture){if(We)if(Ne)t.texStorage2D(s.TEXTURE_2D,$,we,ue.width,ue.height);else{let G=ue.width,ee=ue.height;for(let ge=0;ge<$;ge++)t.texImage2D(s.TEXTURE_2D,ge,we,G,ee,0,be,Be,null),G>>=1,ee>>=1}}else if(xe.length>0){if(Ne&&We){const G=Ce(xe[0]);t.texStorage2D(s.TEXTURE_2D,$,we,G.width,G.height)}for(let G=0,ee=xe.length;G<ee;G++)me=xe[G],Ne?M&&t.texSubImage2D(s.TEXTURE_2D,G,0,0,be,Be,me):t.texImage2D(s.TEXTURE_2D,G,we,be,Be,me);x.generateMipmaps=!1}else if(Ne){if(We){const G=Ce(ue);t.texStorage2D(s.TEXTURE_2D,$,we,G.width,G.height)}M&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,be,Be,ue)}else t.texImage2D(s.TEXTURE_2D,0,we,be,Be,ue);p(x)&&m(Z),Te.__version=Q.version,x.onUpdate&&x.onUpdate(x)}P.__version=x.version}function O(P,x,X){if(x.image.length!==6)return;const Z=V(P,x),re=x.source;t.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+X);const Q=n.get(re);if(re.version!==Q.__version||Z===!0){t.activeTexture(s.TEXTURE0+X);const Te=nt.getPrimaries(nt.workingColorSpace),le=x.colorSpace===Dn?null:nt.getPrimaries(x.colorSpace),ce=x.colorSpace===Dn||Te===le?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);const Se=x.isCompressedTexture||x.image[0].isCompressedTexture,ue=x.image[0]&&x.image[0].isDataTexture,be=[];for(let ee=0;ee<6;ee++)!Se&&!ue?be[ee]=_(x.image[ee],!0,i.maxCubemapSize):be[ee]=ue?x.image[ee].image:x.image[ee],be[ee]=de(x,be[ee]);const Be=be[0],we=r.convert(x.format,x.colorSpace),me=r.convert(x.type),xe=S(x.internalFormat,we,me,x.colorSpace),Ne=x.isVideoTexture!==!0,We=Q.__version===void 0||Z===!0,M=re.dataReady;let $=b(x,Be);N(s.TEXTURE_CUBE_MAP,x);let G;if(Se){Ne&&We&&t.texStorage2D(s.TEXTURE_CUBE_MAP,$,xe,Be.width,Be.height);for(let ee=0;ee<6;ee++){G=be[ee].mipmaps;for(let ge=0;ge<G.length;ge++){const Ae=G[ge];x.format!==an?we!==null?Ne?M&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,0,0,Ae.width,Ae.height,we,Ae.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,xe,Ae.width,Ae.height,0,Ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ne?M&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,0,0,Ae.width,Ae.height,we,me,Ae.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,xe,Ae.width,Ae.height,0,we,me,Ae.data)}}}else{if(G=x.mipmaps,Ne&&We){G.length>0&&$++;const ee=Ce(be[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,$,xe,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(ue){Ne?M&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,be[ee].width,be[ee].height,we,me,be[ee].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,xe,be[ee].width,be[ee].height,0,we,me,be[ee].data);for(let ge=0;ge<G.length;ge++){const Re=G[ge].image[ee].image;Ne?M&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,0,0,Re.width,Re.height,we,me,Re.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,xe,Re.width,Re.height,0,we,me,Re.data)}}else{Ne?M&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,we,me,be[ee]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,xe,we,me,be[ee]);for(let ge=0;ge<G.length;ge++){const Ae=G[ge];Ne?M&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,0,0,we,me,Ae.image[ee]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,xe,we,me,Ae.image[ee])}}}p(x)&&m(s.TEXTURE_CUBE_MAP),Q.__version=re.version,x.onUpdate&&x.onUpdate(x)}P.__version=x.version}function k(P,x,X,Z,re,Q){const Te=r.convert(X.format,X.colorSpace),le=r.convert(X.type),ce=S(X.internalFormat,Te,le,X.colorSpace);if(!n.get(x).__hasExternalTextures){const ue=Math.max(1,x.width>>Q),be=Math.max(1,x.height>>Q);re===s.TEXTURE_3D||re===s.TEXTURE_2D_ARRAY?t.texImage3D(re,Q,ce,ue,be,x.depth,0,Te,le,null):t.texImage2D(re,Q,ce,ue,be,0,Te,le,null)}t.bindFramebuffer(s.FRAMEBUFFER,P),ye(x)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Z,re,n.get(X).__webglTexture,0,fe(x)):(re===s.TEXTURE_2D||re>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Z,re,n.get(X).__webglTexture,Q),t.bindFramebuffer(s.FRAMEBUFFER,null)}function te(P,x,X){if(s.bindRenderbuffer(s.RENDERBUFFER,P),x.depthBuffer){const Z=x.depthTexture,re=Z&&Z.isDepthTexture?Z.type:null,Q=v(x.stencilBuffer,re),Te=x.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,le=fe(x);ye(x)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,le,Q,x.width,x.height):X?s.renderbufferStorageMultisample(s.RENDERBUFFER,le,Q,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,Q,x.width,x.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Te,s.RENDERBUFFER,P)}else{const Z=x.textures;for(let re=0;re<Z.length;re++){const Q=Z[re],Te=r.convert(Q.format,Q.colorSpace),le=r.convert(Q.type),ce=S(Q.internalFormat,Te,le,Q.colorSpace),Se=fe(x);X&&ye(x)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Se,ce,x.width,x.height):ye(x)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Se,ce,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,ce,x.width,x.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function H(P,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,P),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),I(x.depthTexture,0);const Z=n.get(x.depthTexture).__webglTexture,re=fe(x);if(x.depthTexture.format===Pi)ye(x)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Z,0,re):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Z,0);else if(x.depthTexture.format===Oi)ye(x)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Z,0,re):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function ae(P){const x=n.get(P),X=P.isWebGLCubeRenderTarget===!0;if(P.depthTexture&&!x.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");H(x.__webglFramebuffer,P)}else if(X){x.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)t.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[Z]),x.__webglDepthbuffer[Z]=s.createRenderbuffer(),te(x.__webglDepthbuffer[Z],P,!1)}else t.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer=s.createRenderbuffer(),te(x.__webglDepthbuffer,P,!1);t.bindFramebuffer(s.FRAMEBUFFER,null)}function pe(P,x,X){const Z=n.get(P);x!==void 0&&k(Z.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),X!==void 0&&ae(P)}function ve(P){const x=P.texture,X=n.get(P),Z=n.get(x);P.addEventListener("dispose",w);const re=P.textures,Q=P.isWebGLCubeRenderTarget===!0,Te=re.length>1;if(Te||(Z.__webglTexture===void 0&&(Z.__webglTexture=s.createTexture()),Z.__version=x.version,o.memory.textures++),Q){X.__webglFramebuffer=[];for(let le=0;le<6;le++)if(x.mipmaps&&x.mipmaps.length>0){X.__webglFramebuffer[le]=[];for(let ce=0;ce<x.mipmaps.length;ce++)X.__webglFramebuffer[le][ce]=s.createFramebuffer()}else X.__webglFramebuffer[le]=s.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){X.__webglFramebuffer=[];for(let le=0;le<x.mipmaps.length;le++)X.__webglFramebuffer[le]=s.createFramebuffer()}else X.__webglFramebuffer=s.createFramebuffer();if(Te)for(let le=0,ce=re.length;le<ce;le++){const Se=n.get(re[le]);Se.__webglTexture===void 0&&(Se.__webglTexture=s.createTexture(),o.memory.textures++)}if(P.samples>0&&ye(P)===!1){X.__webglMultisampledFramebuffer=s.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let le=0;le<re.length;le++){const ce=re[le];X.__webglColorRenderbuffer[le]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,X.__webglColorRenderbuffer[le]);const Se=r.convert(ce.format,ce.colorSpace),ue=r.convert(ce.type),be=S(ce.internalFormat,Se,ue,ce.colorSpace,P.isXRRenderTarget===!0),Be=fe(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,Be,be,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+le,s.RENDERBUFFER,X.__webglColorRenderbuffer[le])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(X.__webglDepthRenderbuffer=s.createRenderbuffer(),te(X.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Q){t.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture),N(s.TEXTURE_CUBE_MAP,x);for(let le=0;le<6;le++)if(x.mipmaps&&x.mipmaps.length>0)for(let ce=0;ce<x.mipmaps.length;ce++)k(X.__webglFramebuffer[le][ce],P,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+le,ce);else k(X.__webglFramebuffer[le],P,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);p(x)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let le=0,ce=re.length;le<ce;le++){const Se=re[le],ue=n.get(Se);t.bindTexture(s.TEXTURE_2D,ue.__webglTexture),N(s.TEXTURE_2D,Se),k(X.__webglFramebuffer,P,Se,s.COLOR_ATTACHMENT0+le,s.TEXTURE_2D,0),p(Se)&&m(s.TEXTURE_2D)}t.unbindTexture()}else{let le=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(le=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(le,Z.__webglTexture),N(le,x),x.mipmaps&&x.mipmaps.length>0)for(let ce=0;ce<x.mipmaps.length;ce++)k(X.__webglFramebuffer[ce],P,x,s.COLOR_ATTACHMENT0,le,ce);else k(X.__webglFramebuffer,P,x,s.COLOR_ATTACHMENT0,le,0);p(x)&&m(le),t.unbindTexture()}P.depthBuffer&&ae(P)}function D(P){const x=P.textures;for(let X=0,Z=x.length;X<Z;X++){const re=x[X];if(p(re)){const Q=P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,Te=n.get(re).__webglTexture;t.bindTexture(Q,Te),m(Q),t.unbindTexture()}}}const he=[],Pe=[];function Ue(P){if(P.samples>0){if(ye(P)===!1){const x=P.textures,X=P.width,Z=P.height;let re=s.COLOR_BUFFER_BIT;const Q=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Te=n.get(P),le=x.length>1;if(le)for(let ce=0;ce<x.length;ce++)t.bindFramebuffer(s.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Te.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let ce=0;ce<x.length;ce++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(re|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(re|=s.STENCIL_BUFFER_BIT)),le){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Te.__webglColorRenderbuffer[ce]);const Se=n.get(x[ce]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Se,0)}s.blitFramebuffer(0,0,X,Z,0,0,X,Z,re,s.NEAREST),l===!0&&(he.length=0,Pe.length=0,he.push(s.COLOR_ATTACHMENT0+ce),P.depthBuffer&&P.resolveDepthBuffer===!1&&(he.push(Q),Pe.push(Q),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Pe)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,he))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),le)for(let ce=0;ce<x.length;ce++){t.bindFramebuffer(s.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.RENDERBUFFER,Te.__webglColorRenderbuffer[ce]);const Se=n.get(x[ce]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Te.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.TEXTURE_2D,Se,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const x=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[x])}}}function fe(P){return Math.min(i.maxSamples,P.samples)}function ye(P){const x=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Me(P){const x=o.render.frame;h.get(P)!==x&&(h.set(P,x),P.update())}function de(P,x){const X=P.colorSpace,Z=P.format,re=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||X!==Bn&&X!==Dn&&(nt.getTransfer(X)===ot?(Z!==an||re!==On)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),x}function Ce(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=F,this.setTexture2D=I,this.setTexture2DArray=z,this.setTexture3D=B,this.setTextureCube=ie,this.rebindTextures=pe,this.setupRenderTarget=ve,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=Ue,this.setupDepthRenderbuffer=ae,this.setupFrameBufferTexture=k,this.useMultisampledRTT=ye}function S_(s,e){function t(n,i=Dn){let r;const o=nt.getTransfer(i);if(n===On)return s.UNSIGNED_BYTE;if(n===Nc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Oc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===ad)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===sd)return s.BYTE;if(n===od)return s.SHORT;if(n===ds)return s.UNSIGNED_SHORT;if(n===Fc)return s.INT;if(n===Fi)return s.UNSIGNED_INT;if(n===vn)return s.FLOAT;if(n===Fn)return s.HALF_FLOAT;if(n===ld)return s.ALPHA;if(n===cd)return s.RGB;if(n===an)return s.RGBA;if(n===hd)return s.LUMINANCE;if(n===ud)return s.LUMINANCE_ALPHA;if(n===Pi)return s.DEPTH_COMPONENT;if(n===Oi)return s.DEPTH_STENCIL;if(n===Bc)return s.RED;if(n===kc)return s.RED_INTEGER;if(n===dd)return s.RG;if(n===zc)return s.RG_INTEGER;if(n===Gc)return s.RGBA_INTEGER;if(n===Gs||n===Hs||n===Vs||n===Ws)if(o===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Gs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Hs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Vs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ws)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Gs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Hs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Vs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ws)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ca||n===Ra||n===Pa||n===Ua)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ca)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ra)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Pa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ua)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===La||n===Da||n===Ia)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===La||n===Da)return o===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ia)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Fa||n===Na||n===Oa||n===Ba||n===ka||n===za||n===Ga||n===Ha||n===Va||n===Wa||n===Xa||n===Ya||n===ja||n===qa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Fa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Na)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Oa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ba)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ka)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===za)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ga)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ha)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Va)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Wa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Xa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ya)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ja)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===qa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Xs||n===Ka||n===Za)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Xs)return o===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ka)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Za)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===fd||n===Ja||n===Qa||n===$a)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Xs)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ja)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Qa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===$a)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ni?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}class M_ extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Zr extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const b_={type:"move"};class vo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),m=this._getHandJoint(c,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(b_)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Zr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const E_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,T_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class w_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Tt,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new It({vertexShader:E_,fragmentShader:T_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Rt(new ri(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class A_ extends ni{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null;const _=new w_,p=t.getContextAttributes();let m=null,S=null;const v=[],b=[],R=new Oe;let w=null;const T=new jt;T.layers.enable(1),T.viewport=new ht;const U=new jt;U.layers.enable(2),U.viewport=new ht;const E=[T,U],y=new M_;y.layers.enable(1),y.layers.enable(2);let F=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let k=v[O];return k===void 0&&(k=new vo,v[O]=k),k.getTargetRaySpace()},this.getControllerGrip=function(O){let k=v[O];return k===void 0&&(k=new vo,v[O]=k),k.getGripSpace()},this.getHand=function(O){let k=v[O];return k===void 0&&(k=new vo,v[O]=k),k.getHandSpace()};function A(O){const k=b.indexOf(O.inputSource);if(k===-1)return;const te=v[k];te!==void 0&&(te.update(O.inputSource,O.frame,c||o),te.dispatchEvent({type:O.type,data:O.inputSource}))}function I(){i.removeEventListener("select",A),i.removeEventListener("selectstart",A),i.removeEventListener("selectend",A),i.removeEventListener("squeeze",A),i.removeEventListener("squeezestart",A),i.removeEventListener("squeezeend",A),i.removeEventListener("end",I),i.removeEventListener("inputsourceschange",z);for(let O=0;O<v.length;O++){const k=b[O];k!==null&&(b[O]=null,v[O].disconnect(k))}F=null,L=null,_.reset(),e.setRenderTarget(m),f=null,u=null,d=null,i=null,S=null,ne.stop(),n.isPresenting=!1,e.setPixelRatio(w),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){r=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){a=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(O){c=O},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(O){if(i=O,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",A),i.addEventListener("selectstart",A),i.addEventListener("selectend",A),i.addEventListener("squeeze",A),i.addEventListener("squeezestart",A),i.addEventListener("squeezeend",A),i.addEventListener("end",I),i.addEventListener("inputsourceschange",z),p.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(R),i.renderState.layers===void 0){const k={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,k),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new en(f.framebufferWidth,f.framebufferHeight,{format:an,type:On,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let k=null,te=null,H=null;p.depth&&(H=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,k=p.stencil?Oi:Pi,te=p.stencil?Ni:Fi);const ae={colorFormat:t.RGBA8,depthFormat:H,scaleFactor:r};d=new XRWebGLBinding(i,t),u=d.createProjectionLayer(ae),i.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),S=new en(u.textureWidth,u.textureHeight,{format:an,type:On,depthTexture:new nh(u.textureWidth,u.textureHeight,te,void 0,void 0,void 0,void 0,void 0,void 0,k),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),ne.setContext(i),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function z(O){for(let k=0;k<O.removed.length;k++){const te=O.removed[k],H=b.indexOf(te);H>=0&&(b[H]=null,v[H].disconnect(te))}for(let k=0;k<O.added.length;k++){const te=O.added[k];let H=b.indexOf(te);if(H===-1){for(let pe=0;pe<v.length;pe++)if(pe>=b.length){b.push(te),H=pe;break}else if(b[pe]===null){b[pe]=te,H=pe;break}if(H===-1)break}const ae=v[H];ae&&ae.connect(te)}}const B=new W,ie=new W;function j(O,k,te){B.setFromMatrixPosition(k.matrixWorld),ie.setFromMatrixPosition(te.matrixWorld);const H=B.distanceTo(ie),ae=k.projectionMatrix.elements,pe=te.projectionMatrix.elements,ve=ae[14]/(ae[10]-1),D=ae[14]/(ae[10]+1),he=(ae[9]+1)/ae[5],Pe=(ae[9]-1)/ae[5],Ue=(ae[8]-1)/ae[0],fe=(pe[8]+1)/pe[0],ye=ve*Ue,Me=ve*fe,de=H/(-Ue+fe),Ce=de*-Ue;k.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(Ce),O.translateZ(de),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert();const P=ve+de,x=D+de,X=ye-Ce,Z=Me+(H-Ce),re=he*D/x*P,Q=Pe*D/x*P;O.projectionMatrix.makePerspective(X,Z,re,Q,P,x),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}function K(O,k){k===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(k.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(i===null)return;_.texture!==null&&(O.near=_.depthNear,O.far=_.depthFar),y.near=U.near=T.near=O.near,y.far=U.far=T.far=O.far,(F!==y.near||L!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),F=y.near,L=y.far,T.near=F,T.far=L,U.near=F,U.far=L,T.updateProjectionMatrix(),U.updateProjectionMatrix(),O.updateProjectionMatrix());const k=O.parent,te=y.cameras;K(y,k);for(let H=0;H<te.length;H++)K(te[H],k);te.length===2?j(y,T,U):y.projectionMatrix.copy(T.projectionMatrix),q(O,y,k)};function q(O,k,te){te===null?O.matrix.copy(k.matrixWorld):(O.matrix.copy(te.matrixWorld),O.matrix.invert(),O.matrix.multiply(k.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy(k.projectionMatrix),O.projectionMatrixInverse.copy(k.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=Do*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(O){l=O,u!==null&&(u.fixedFoveation=O),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=O)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let N=null;function V(O,k){if(h=k.getViewerPose(c||o),g=k,h!==null){const te=h.views;f!==null&&(e.setRenderTargetFramebuffer(S,f.framebuffer),e.setRenderTarget(S));let H=!1;te.length!==y.cameras.length&&(y.cameras.length=0,H=!0);for(let pe=0;pe<te.length;pe++){const ve=te[pe];let D=null;if(f!==null)D=f.getViewport(ve);else{const Pe=d.getViewSubImage(u,ve);D=Pe.viewport,pe===0&&(e.setRenderTargetTextures(S,Pe.colorTexture,u.ignoreDepthValues?void 0:Pe.depthStencilTexture),e.setRenderTarget(S))}let he=E[pe];he===void 0&&(he=new jt,he.layers.enable(pe),he.viewport=new ht,E[pe]=he),he.matrix.fromArray(ve.transform.matrix),he.matrix.decompose(he.position,he.quaternion,he.scale),he.projectionMatrix.fromArray(ve.projectionMatrix),he.projectionMatrixInverse.copy(he.projectionMatrix).invert(),he.viewport.set(D.x,D.y,D.width,D.height),pe===0&&(y.matrix.copy(he.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),H===!0&&y.cameras.push(he)}const ae=i.enabledFeatures;if(ae&&ae.includes("depth-sensing")){const pe=d.getDepthInformation(te[0]);pe&&pe.isValid&&pe.texture&&_.init(e,pe,i.renderState)}}for(let te=0;te<v.length;te++){const H=b[te],ae=v[te];H!==null&&ae!==void 0&&ae.update(H,k,c||o)}N&&N(O,k),k.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:k}),g=null}const ne=new th;ne.setAnimationLoop(V),this.setAnimationLoop=function(O){N=O},this.dispose=function(){}}}const Yn=new ln,C_=new it;function R_(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Qc(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,S,v,b){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(p,m):m.isMeshToonMaterial?(r(p,m),d(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m)):m.isMeshStandardMaterial?(r(p,m),u(p,m),m.isMeshPhysicalMaterial&&f(p,m,b)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),_(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,S,v):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Ft&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Ft&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const S=e.get(m),v=S.envMap,b=S.envMapRotation;v&&(p.envMap.value=v,Yn.copy(b),Yn.x*=-1,Yn.y*=-1,Yn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Yn.y*=-1,Yn.z*=-1),p.envMapRotation.value.setFromMatrix4(C_.makeRotationFromEuler(Yn)),p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,S,v){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*S,p.scale.value=v*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,S){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Ft&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){const S=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function P_(s,e,t,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,v){const b=v.program;n.uniformBlockBinding(S,b)}function c(S,v){let b=i[S.id];b===void 0&&(g(S),b=h(S),i[S.id]=b,S.addEventListener("dispose",p));const R=v.program;n.updateUBOMapping(S,R);const w=e.render.frame;r[S.id]!==w&&(u(S),r[S.id]=w)}function h(S){const v=d();S.__bindingPointIndex=v;const b=s.createBuffer(),R=S.__size,w=S.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,R,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,b),b}function d(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(S){const v=i[S.id],b=S.uniforms,R=S.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let w=0,T=b.length;w<T;w++){const U=Array.isArray(b[w])?b[w]:[b[w]];for(let E=0,y=U.length;E<y;E++){const F=U[E];if(f(F,w,E,R)===!0){const L=F.__offset,A=Array.isArray(F.value)?F.value:[F.value];let I=0;for(let z=0;z<A.length;z++){const B=A[z],ie=_(B);typeof B=="number"||typeof B=="boolean"?(F.__data[0]=B,s.bufferSubData(s.UNIFORM_BUFFER,L+I,F.__data)):B.isMatrix3?(F.__data[0]=B.elements[0],F.__data[1]=B.elements[1],F.__data[2]=B.elements[2],F.__data[3]=0,F.__data[4]=B.elements[3],F.__data[5]=B.elements[4],F.__data[6]=B.elements[5],F.__data[7]=0,F.__data[8]=B.elements[6],F.__data[9]=B.elements[7],F.__data[10]=B.elements[8],F.__data[11]=0):(B.toArray(F.__data,I),I+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,L,F.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(S,v,b,R){const w=S.value,T=v+"_"+b;if(R[T]===void 0)return typeof w=="number"||typeof w=="boolean"?R[T]=w:R[T]=w.clone(),!0;{const U=R[T];if(typeof w=="number"||typeof w=="boolean"){if(U!==w)return R[T]=w,!0}else if(U.equals(w)===!1)return U.copy(w),!0}return!1}function g(S){const v=S.uniforms;let b=0;const R=16;for(let T=0,U=v.length;T<U;T++){const E=Array.isArray(v[T])?v[T]:[v[T]];for(let y=0,F=E.length;y<F;y++){const L=E[y],A=Array.isArray(L.value)?L.value:[L.value];for(let I=0,z=A.length;I<z;I++){const B=A[I],ie=_(B),j=b%R;j!==0&&R-j<ie.boundary&&(b+=R-j),L.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=b,b+=ie.storage}}}const w=b%R;return w>0&&(b+=R-w),S.__size=b,S.__cache={},this}function _(S){const v={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(v.boundary=4,v.storage=4):S.isVector2?(v.boundary=8,v.storage=8):S.isVector3||S.isColor?(v.boundary=16,v.storage=12):S.isVector4?(v.boundary=16,v.storage=16):S.isMatrix3?(v.boundary=48,v.storage=48):S.isMatrix4?(v.boundary=64,v.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),v}function p(S){const v=S.target;v.removeEventListener("dispose",p);const b=o.indexOf(v.__bindingPointIndex);o.splice(b,1),s.deleteBuffer(i[v.id]),delete i[v.id],delete r[v.id]}function m(){for(const S in i)s.deleteBuffer(i[S]);o=[],i={},r={}}return{bind:l,update:c,dispose:m}}class U_{constructor(e={}){const{canvas:t=Td(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=o;const f=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const m=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=nn,this.toneMapping=In,this.toneMappingExposure=1;const v=this;let b=!1,R=0,w=0,T=null,U=-1,E=null;const y=new ht,F=new ht;let L=null;const A=new Ve(0);let I=0,z=t.width,B=t.height,ie=1,j=null,K=null;const q=new ht(0,0,z,B),N=new ht(0,0,z,B);let V=!1;const ne=new jo;let O=!1,k=!1;const te=new it,H=new W,ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pe=!1;function ve(){return T===null?ie:1}let D=n;function he(C,Y){return t.getContext(C,Y)}try{const C={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Wo}`),t.addEventListener("webglcontextlost",$,!1),t.addEventListener("webglcontextrestored",G,!1),t.addEventListener("webglcontextcreationerror",ee,!1),D===null){const Y="webgl2";if(D=he(Y,C),D===null)throw he(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let Pe,Ue,fe,ye,Me,de,Ce,P,x,X,Z,re,Q,Te,le,ce,Se,ue,be,Be,we,me,xe,Ne;function We(){Pe=new Gm(D),Pe.init(),me=new S_(D,Pe),Ue=new Fm(D,Pe,e,me),fe=new x_(D),ye=new Wm(D),Me=new a_,de=new y_(D,Pe,fe,Me,Ue,me,ye),Ce=new Om(v),P=new zm(v),x=new Zd(D),xe=new Dm(D,x),X=new Hm(D,x,ye,xe),Z=new Ym(D,X,x,ye),be=new Xm(D,Ue,de),ce=new Nm(Me),re=new o_(v,Ce,P,Pe,Ue,xe,ce),Q=new R_(v,Me),Te=new c_,le=new m_(Pe),ue=new Lm(v,Ce,P,fe,Z,u,l),Se=new v_(v,Z,Ue),Ne=new P_(D,ye,Ue,fe),Be=new Im(D,Pe,ye),we=new Vm(D,Pe,ye),ye.programs=re.programs,v.capabilities=Ue,v.extensions=Pe,v.properties=Me,v.renderLists=Te,v.shadowMap=Se,v.state=fe,v.info=ye}We();const M=new A_(v,D);this.xr=M,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const C=Pe.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=Pe.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(C){C!==void 0&&(ie=C,this.setSize(z,B,!1))},this.getSize=function(C){return C.set(z,B)},this.setSize=function(C,Y,se=!0){if(M.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=C,B=Y,t.width=Math.floor(C*ie),t.height=Math.floor(Y*ie),se===!0&&(t.style.width=C+"px",t.style.height=Y+"px"),this.setViewport(0,0,C,Y)},this.getDrawingBufferSize=function(C){return C.set(z*ie,B*ie).floor()},this.setDrawingBufferSize=function(C,Y,se){z=C,B=Y,ie=se,t.width=Math.floor(C*se),t.height=Math.floor(Y*se),this.setViewport(0,0,C,Y)},this.getCurrentViewport=function(C){return C.copy(y)},this.getViewport=function(C){return C.copy(q)},this.setViewport=function(C,Y,se,oe){C.isVector4?q.set(C.x,C.y,C.z,C.w):q.set(C,Y,se,oe),fe.viewport(y.copy(q).multiplyScalar(ie).round())},this.getScissor=function(C){return C.copy(N)},this.setScissor=function(C,Y,se,oe){C.isVector4?N.set(C.x,C.y,C.z,C.w):N.set(C,Y,se,oe),fe.scissor(F.copy(N).multiplyScalar(ie).round())},this.getScissorTest=function(){return V},this.setScissorTest=function(C){fe.setScissorTest(V=C)},this.setOpaqueSort=function(C){j=C},this.setTransparentSort=function(C){K=C},this.getClearColor=function(C){return C.copy(ue.getClearColor())},this.setClearColor=function(){ue.setClearColor.apply(ue,arguments)},this.getClearAlpha=function(){return ue.getClearAlpha()},this.setClearAlpha=function(){ue.setClearAlpha.apply(ue,arguments)},this.clear=function(C=!0,Y=!0,se=!0){let oe=0;if(C){let J=!1;if(T!==null){const Ee=T.texture.format;J=Ee===Gc||Ee===zc||Ee===kc}if(J){const Ee=T.texture.type,Ie=Ee===On||Ee===Fi||Ee===ds||Ee===Ni||Ee===Nc||Ee===Oc,Fe=ue.getClearColor(),ke=ue.getClearAlpha(),_e=Fe.r,Ge=Fe.g,He=Fe.b;Ie?(f[0]=_e,f[1]=Ge,f[2]=He,f[3]=ke,D.clearBufferuiv(D.COLOR,0,f)):(g[0]=_e,g[1]=Ge,g[2]=He,g[3]=ke,D.clearBufferiv(D.COLOR,0,g))}else oe|=D.COLOR_BUFFER_BIT}Y&&(oe|=D.DEPTH_BUFFER_BIT),se&&(oe|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(oe)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",$,!1),t.removeEventListener("webglcontextrestored",G,!1),t.removeEventListener("webglcontextcreationerror",ee,!1),Te.dispose(),le.dispose(),Me.dispose(),Ce.dispose(),P.dispose(),Z.dispose(),xe.dispose(),Ne.dispose(),re.dispose(),M.dispose(),M.removeEventListener("sessionstart",Ye),M.removeEventListener("sessionend",Je),tt.stop()};function $(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function G(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const C=ye.autoReset,Y=Se.enabled,se=Se.autoUpdate,oe=Se.needsUpdate,J=Se.type;We(),ye.autoReset=C,Se.enabled=Y,Se.autoUpdate=se,Se.needsUpdate=oe,Se.type=J}function ee(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function ge(C){const Y=C.target;Y.removeEventListener("dispose",ge),Ae(Y)}function Ae(C){Re(C),Me.remove(C)}function Re(C){const Y=Me.get(C).programs;Y!==void 0&&(Y.forEach(function(se){re.releaseProgram(se)}),C.isShaderMaterial&&re.releaseShaderCache(C))}this.renderBufferDirect=function(C,Y,se,oe,J,Ee){Y===null&&(Y=ae);const Ie=J.isMesh&&J.matrixWorld.determinant()<0,Fe=cn(C,Y,se,oe,J);fe.setMaterial(oe,Ie);let ke=se.index,_e=1;if(oe.wireframe===!0){if(ke=X.getWireframeAttribute(se),ke===void 0)return;_e=2}const Ge=se.drawRange,He=se.attributes.position;let Ze=Ge.start*_e,rt=(Ge.start+Ge.count)*_e;Ee!==null&&(Ze=Math.max(Ze,Ee.start*_e),rt=Math.min(rt,(Ee.start+Ee.count)*_e)),ke!==null?(Ze=Math.max(Ze,0),rt=Math.min(rt,ke.count)):He!=null&&(Ze=Math.max(Ze,0),rt=Math.min(rt,He.count));const st=rt-Ze;if(st<0||st===1/0)return;xe.setup(J,oe,Fe,se,ke);let _t,Qe=Be;if(ke!==null&&(_t=x.get(ke),Qe=we,Qe.setIndex(_t)),J.isMesh)oe.wireframe===!0?(fe.setLineWidth(oe.wireframeLinewidth*ve()),Qe.setMode(D.LINES)):Qe.setMode(D.TRIANGLES);else if(J.isLine){let ze=oe.linewidth;ze===void 0&&(ze=1),fe.setLineWidth(ze*ve()),J.isLineSegments?Qe.setMode(D.LINES):J.isLineLoop?Qe.setMode(D.LINE_LOOP):Qe.setMode(D.LINE_STRIP)}else J.isPoints?Qe.setMode(D.POINTS):J.isSprite&&Qe.setMode(D.TRIANGLES);if(J.isBatchedMesh)J._multiDrawInstances!==null?Qe.renderMultiDrawInstances(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount,J._multiDrawInstances):Qe.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else if(J.isInstancedMesh)Qe.renderInstances(Ze,st,J.count);else if(se.isInstancedBufferGeometry){const ze=se._maxInstanceCount!==void 0?se._maxInstanceCount:1/0,pt=Math.min(se.instanceCount,ze);Qe.renderInstances(Ze,st,pt)}else Qe.render(Ze,st)};function je(C,Y,se){C.transparent===!0&&C.side===sn&&C.forceSinglePass===!1?(C.side=Ft,C.needsUpdate=!0,Ht(C,Y,se),C.side=Nn,C.needsUpdate=!0,Ht(C,Y,se),C.side=sn):Ht(C,Y,se)}this.compile=function(C,Y,se=null){se===null&&(se=C),p=le.get(se),p.init(Y),S.push(p),se.traverseVisible(function(J){J.isLight&&J.layers.test(Y.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),C!==se&&C.traverseVisible(function(J){J.isLight&&J.layers.test(Y.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),p.setupLights();const oe=new Set;return C.traverse(function(J){const Ee=J.material;if(Ee)if(Array.isArray(Ee))for(let Ie=0;Ie<Ee.length;Ie++){const Fe=Ee[Ie];je(Fe,se,J),oe.add(Fe)}else je(Ee,se,J),oe.add(Ee)}),S.pop(),p=null,oe},this.compileAsync=function(C,Y,se=null){const oe=this.compile(C,Y,se);return new Promise(J=>{function Ee(){if(oe.forEach(function(Ie){Me.get(Ie).currentProgram.isReady()&&oe.delete(Ie)}),oe.size===0){J(C);return}setTimeout(Ee,10)}Pe.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let Xe=null;function De(C){Xe&&Xe(C)}function Ye(){tt.stop()}function Je(){tt.start()}const tt=new th;tt.setAnimationLoop(De),typeof self<"u"&&tt.setContext(self),this.setAnimationLoop=function(C){Xe=C,M.setAnimationLoop(C),C===null?tt.stop():tt.start()},M.addEventListener("sessionstart",Ye),M.addEventListener("sessionend",Je),this.render=function(C,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),M.enabled===!0&&M.isPresenting===!0&&(M.cameraAutoUpdate===!0&&M.updateCamera(Y),Y=M.getCamera()),C.isScene===!0&&C.onBeforeRender(v,C,Y,T),p=le.get(C,S.length),p.init(Y),S.push(p),te.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),ne.setFromProjectionMatrix(te),k=this.localClippingEnabled,O=ce.init(this.clippingPlanes,k),_=Te.get(C,m.length),_.init(),m.push(_),M.enabled===!0&&M.isPresenting===!0){const Ee=v.xr.getDepthSensingMesh();Ee!==null&&$e(Ee,Y,-1/0,v.sortObjects)}$e(C,Y,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(j,K),pe=M.enabled===!1||M.isPresenting===!1||M.hasDepthSensing()===!1,pe&&ue.addToRenderList(_,C),this.info.render.frame++,O===!0&&ce.beginShadows();const se=p.state.shadowsArray;Se.render(se,C,Y),O===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const oe=_.opaque,J=_.transmissive;if(p.setupLights(),Y.isArrayCamera){const Ee=Y.cameras;if(J.length>0)for(let Ie=0,Fe=Ee.length;Ie<Fe;Ie++){const ke=Ee[Ie];St(oe,J,C,ke)}pe&&ue.render(C);for(let Ie=0,Fe=Ee.length;Ie<Fe;Ie++){const ke=Ee[Ie];lt(_,C,ke,ke.viewport)}}else J.length>0&&St(oe,J,C,Y),pe&&ue.render(C),lt(_,C,Y);T!==null&&(de.updateMultisampleRenderTarget(T),de.updateRenderTargetMipmap(T)),C.isScene===!0&&C.onAfterRender(v,C,Y),xe.resetDefaultState(),U=-1,E=null,S.pop(),S.length>0?(p=S[S.length-1],O===!0&&ce.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,m.pop(),m.length>0?_=m[m.length-1]:_=null};function $e(C,Y,se,oe){if(C.visible===!1)return;if(C.layers.test(Y.layers)){if(C.isGroup)se=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(Y);else if(C.isLight)p.pushLight(C),C.castShadow&&p.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||ne.intersectsSprite(C)){oe&&H.setFromMatrixPosition(C.matrixWorld).applyMatrix4(te);const Ie=Z.update(C),Fe=C.material;Fe.visible&&_.push(C,Ie,Fe,se,H.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||ne.intersectsObject(C))){const Ie=Z.update(C),Fe=C.material;if(oe&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),H.copy(C.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),H.copy(Ie.boundingSphere.center)),H.applyMatrix4(C.matrixWorld).applyMatrix4(te)),Array.isArray(Fe)){const ke=Ie.groups;for(let _e=0,Ge=ke.length;_e<Ge;_e++){const He=ke[_e],Ze=Fe[He.materialIndex];Ze&&Ze.visible&&_.push(C,Ie,Ze,se,H.z,He)}}else Fe.visible&&_.push(C,Ie,Fe,se,H.z,null)}}const Ee=C.children;for(let Ie=0,Fe=Ee.length;Ie<Fe;Ie++)$e(Ee[Ie],Y,se,oe)}function lt(C,Y,se,oe){const J=C.opaque,Ee=C.transmissive,Ie=C.transparent;p.setupLightsView(se),O===!0&&ce.setGlobalState(v.clippingPlanes,se),oe&&fe.viewport(y.copy(oe)),J.length>0&&gt(J,Y,se),Ee.length>0&&gt(Ee,Y,se),Ie.length>0&&gt(Ie,Y,se),fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1)}function St(C,Y,se,oe){if((se.isScene===!0?se.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[oe.id]===void 0&&(p.state.transmissionRenderTarget[oe.id]=new en(1,1,{generateMipmaps:!0,type:Pe.has("EXT_color_buffer_half_float")||Pe.has("EXT_color_buffer_float")?Fn:On,minFilter:$n,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace}));const Ee=p.state.transmissionRenderTarget[oe.id],Ie=oe.viewport||y;Ee.setSize(Ie.z,Ie.w);const Fe=v.getRenderTarget();v.setRenderTarget(Ee),v.getClearColor(A),I=v.getClearAlpha(),I<1&&v.setClearColor(16777215,.5),pe?ue.render(se):v.clear();const ke=v.toneMapping;v.toneMapping=In;const _e=oe.viewport;if(oe.viewport!==void 0&&(oe.viewport=void 0),p.setupLightsView(oe),O===!0&&ce.setGlobalState(v.clippingPlanes,oe),gt(C,se,oe),de.updateMultisampleRenderTarget(Ee),de.updateRenderTargetMipmap(Ee),Pe.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let He=0,Ze=Y.length;He<Ze;He++){const rt=Y[He],st=rt.object,_t=rt.geometry,Qe=rt.material,ze=rt.group;if(Qe.side===sn&&st.layers.test(oe.layers)){const pt=Qe.side;Qe.side=Ft,Qe.needsUpdate=!0,qt(st,se,oe,_t,Qe,ze),Qe.side=pt,Qe.needsUpdate=!0,Ge=!0}}Ge===!0&&(de.updateMultisampleRenderTarget(Ee),de.updateRenderTargetMipmap(Ee))}v.setRenderTarget(Fe),v.setClearColor(A,I),_e!==void 0&&(oe.viewport=_e),v.toneMapping=ke}function gt(C,Y,se){const oe=Y.isScene===!0?Y.overrideMaterial:null;for(let J=0,Ee=C.length;J<Ee;J++){const Ie=C[J],Fe=Ie.object,ke=Ie.geometry,_e=oe===null?Ie.material:oe,Ge=Ie.group;Fe.layers.test(se.layers)&&qt(Fe,Y,se,ke,_e,Ge)}}function qt(C,Y,se,oe,J,Ee){C.onBeforeRender(v,Y,se,oe,J,Ee),C.modelViewMatrix.multiplyMatrices(se.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),J.onBeforeRender(v,Y,se,oe,C,Ee),J.transparent===!0&&J.side===sn&&J.forceSinglePass===!1?(J.side=Ft,J.needsUpdate=!0,v.renderBufferDirect(se,Y,oe,J,C,Ee),J.side=Nn,J.needsUpdate=!0,v.renderBufferDirect(se,Y,oe,J,C,Ee),J.side=sn):v.renderBufferDirect(se,Y,oe,J,C,Ee),C.onAfterRender(v,Y,se,oe,J,Ee)}function Ht(C,Y,se){Y.isScene!==!0&&(Y=ae);const oe=Me.get(C),J=p.state.lights,Ee=p.state.shadowsArray,Ie=J.state.version,Fe=re.getParameters(C,J.state,Ee,Y,se),ke=re.getProgramCacheKey(Fe);let _e=oe.programs;oe.environment=C.isMeshStandardMaterial?Y.environment:null,oe.fog=Y.fog,oe.envMap=(C.isMeshStandardMaterial?P:Ce).get(C.envMap||oe.environment),oe.envMapRotation=oe.environment!==null&&C.envMap===null?Y.environmentRotation:C.envMapRotation,_e===void 0&&(C.addEventListener("dispose",ge),_e=new Map,oe.programs=_e);let Ge=_e.get(ke);if(Ge!==void 0){if(oe.currentProgram===Ge&&oe.lightsStateVersion===Ie)return ft(C,Fe),Ge}else Fe.uniforms=re.getUniforms(C),C.onBuild(se,Fe,v),C.onBeforeCompile(Fe,v),Ge=re.acquireProgram(Fe,ke),_e.set(ke,Ge),oe.uniforms=Fe.uniforms;const He=oe.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(He.clippingPlanes=ce.uniform),ft(C,Fe),oe.needsLights=Wi(C),oe.lightsStateVersion=Ie,oe.needsLights&&(He.ambientLightColor.value=J.state.ambient,He.lightProbe.value=J.state.probe,He.directionalLights.value=J.state.directional,He.directionalLightShadows.value=J.state.directionalShadow,He.spotLights.value=J.state.spot,He.spotLightShadows.value=J.state.spotShadow,He.rectAreaLights.value=J.state.rectArea,He.ltc_1.value=J.state.rectAreaLTC1,He.ltc_2.value=J.state.rectAreaLTC2,He.pointLights.value=J.state.point,He.pointLightShadows.value=J.state.pointShadow,He.hemisphereLights.value=J.state.hemi,He.directionalShadowMap.value=J.state.directionalShadowMap,He.directionalShadowMatrix.value=J.state.directionalShadowMatrix,He.spotShadowMap.value=J.state.spotShadowMap,He.spotLightMatrix.value=J.state.spotLightMatrix,He.spotLightMap.value=J.state.spotLightMap,He.pointShadowMap.value=J.state.pointShadowMap,He.pointShadowMatrix.value=J.state.pointShadowMatrix),oe.currentProgram=Ge,oe.uniformsList=null,Ge}function Vt(C){if(C.uniformsList===null){const Y=C.currentProgram.getUniforms();C.uniformsList=as.seqWithValue(Y.seq,C.uniforms)}return C.uniformsList}function ft(C,Y){const se=Me.get(C);se.outputColorSpace=Y.outputColorSpace,se.batching=Y.batching,se.batchingColor=Y.batchingColor,se.instancing=Y.instancing,se.instancingColor=Y.instancingColor,se.instancingMorph=Y.instancingMorph,se.skinning=Y.skinning,se.morphTargets=Y.morphTargets,se.morphNormals=Y.morphNormals,se.morphColors=Y.morphColors,se.morphTargetsCount=Y.morphTargetsCount,se.numClippingPlanes=Y.numClippingPlanes,se.numIntersection=Y.numClipIntersection,se.vertexAlphas=Y.vertexAlphas,se.vertexTangents=Y.vertexTangents,se.toneMapping=Y.toneMapping}function cn(C,Y,se,oe,J){Y.isScene!==!0&&(Y=ae),de.resetTextureUnits();const Ee=Y.fog,Ie=oe.isMeshStandardMaterial?Y.environment:null,Fe=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Bn,ke=(oe.isMeshStandardMaterial?P:Ce).get(oe.envMap||Ie),_e=oe.vertexColors===!0&&!!se.attributes.color&&se.attributes.color.itemSize===4,Ge=!!se.attributes.tangent&&(!!oe.normalMap||oe.anisotropy>0),He=!!se.morphAttributes.position,Ze=!!se.morphAttributes.normal,rt=!!se.morphAttributes.color;let st=In;oe.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(st=v.toneMapping);const _t=se.morphAttributes.position||se.morphAttributes.normal||se.morphAttributes.color,Qe=_t!==void 0?_t.length:0,ze=Me.get(oe),pt=p.state.lights;if(O===!0&&(k===!0||C!==E)){const Mt=C===E&&oe.id===U;ce.setState(oe,C,Mt)}let et=!1;oe.version===ze.__version?(ze.needsLights&&ze.lightsStateVersion!==pt.state.version||ze.outputColorSpace!==Fe||J.isBatchedMesh&&ze.batching===!1||!J.isBatchedMesh&&ze.batching===!0||J.isBatchedMesh&&ze.batchingColor===!0&&J.colorTexture===null||J.isBatchedMesh&&ze.batchingColor===!1&&J.colorTexture!==null||J.isInstancedMesh&&ze.instancing===!1||!J.isInstancedMesh&&ze.instancing===!0||J.isSkinnedMesh&&ze.skinning===!1||!J.isSkinnedMesh&&ze.skinning===!0||J.isInstancedMesh&&ze.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&ze.instancingColor===!1&&J.instanceColor!==null||J.isInstancedMesh&&ze.instancingMorph===!0&&J.morphTexture===null||J.isInstancedMesh&&ze.instancingMorph===!1&&J.morphTexture!==null||ze.envMap!==ke||oe.fog===!0&&ze.fog!==Ee||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==ce.numPlanes||ze.numIntersection!==ce.numIntersection)||ze.vertexAlphas!==_e||ze.vertexTangents!==Ge||ze.morphTargets!==He||ze.morphNormals!==Ze||ze.morphColors!==rt||ze.toneMapping!==st||ze.morphTargetsCount!==Qe)&&(et=!0):(et=!0,ze.__version=oe.version);let Wt=ze.currentProgram;et===!0&&(Wt=Ht(oe,Y,J));let Mn=!1,tn=!1,hn=!1;const at=Wt.getUniforms(),wt=ze.uniforms;if(fe.useProgram(Wt.program)&&(Mn=!0,tn=!0,hn=!0),oe.id!==U&&(U=oe.id,tn=!0),Mn||E!==C){at.setValue(D,"projectionMatrix",C.projectionMatrix),at.setValue(D,"viewMatrix",C.matrixWorldInverse);const Mt=at.map.cameraPosition;Mt!==void 0&&Mt.setValue(D,H.setFromMatrixPosition(C.matrixWorld)),Ue.logarithmicDepthBuffer&&at.setValue(D,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(oe.isMeshPhongMaterial||oe.isMeshToonMaterial||oe.isMeshLambertMaterial||oe.isMeshBasicMaterial||oe.isMeshStandardMaterial||oe.isShaderMaterial)&&at.setValue(D,"isOrthographic",C.isOrthographicCamera===!0),E!==C&&(E=C,tn=!0,hn=!0)}if(J.isSkinnedMesh){at.setOptional(D,J,"bindMatrix"),at.setOptional(D,J,"bindMatrixInverse");const Mt=J.skeleton;Mt&&(Mt.boneTexture===null&&Mt.computeBoneTexture(),at.setValue(D,"boneTexture",Mt.boneTexture,de))}J.isBatchedMesh&&(at.setOptional(D,J,"batchingTexture"),at.setValue(D,"batchingTexture",J._matricesTexture,de),at.setOptional(D,J,"batchingColorTexture"),J._colorsTexture!==null&&at.setValue(D,"batchingColorTexture",J._colorsTexture,de));const kn=se.morphAttributes;if((kn.position!==void 0||kn.normal!==void 0||kn.color!==void 0)&&be.update(J,se,Wt),(tn||ze.receiveShadow!==J.receiveShadow)&&(ze.receiveShadow=J.receiveShadow,at.setValue(D,"receiveShadow",J.receiveShadow)),oe.isMeshGouraudMaterial&&oe.envMap!==null&&(wt.envMap.value=ke,wt.flipEnvMap.value=ke.isCubeTexture&&ke.isRenderTargetTexture===!1?-1:1),oe.isMeshStandardMaterial&&oe.envMap===null&&Y.environment!==null&&(wt.envMapIntensity.value=Y.environmentIntensity),tn&&(at.setValue(D,"toneMappingExposure",v.toneMappingExposure),ze.needsLights&&xr(wt,hn),Ee&&oe.fog===!0&&Q.refreshFogUniforms(wt,Ee),Q.refreshMaterialUniforms(wt,oe,ie,B,p.state.transmissionRenderTarget[C.id]),as.upload(D,Vt(ze),wt,de)),oe.isShaderMaterial&&oe.uniformsNeedUpdate===!0&&(as.upload(D,Vt(ze),wt,de),oe.uniformsNeedUpdate=!1),oe.isSpriteMaterial&&at.setValue(D,"center",J.center),at.setValue(D,"modelViewMatrix",J.modelViewMatrix),at.setValue(D,"normalMatrix",J.normalMatrix),at.setValue(D,"modelMatrix",J.matrixWorld),oe.isShaderMaterial||oe.isRawShaderMaterial){const Mt=oe.uniformsGroups;for(let zn=0,Xt=Mt.length;zn<Xt;zn++){const yr=Mt[zn];Ne.update(yr,Wt),Ne.bind(yr,Wt)}}return Wt}function xr(C,Y){C.ambientLightColor.needsUpdate=Y,C.lightProbe.needsUpdate=Y,C.directionalLights.needsUpdate=Y,C.directionalLightShadows.needsUpdate=Y,C.pointLights.needsUpdate=Y,C.pointLightShadows.needsUpdate=Y,C.spotLights.needsUpdate=Y,C.spotLightShadows.needsUpdate=Y,C.rectAreaLights.needsUpdate=Y,C.hemisphereLights.needsUpdate=Y}function Wi(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(C,Y,se){Me.get(C.texture).__webglTexture=Y,Me.get(C.depthTexture).__webglTexture=se;const oe=Me.get(C);oe.__hasExternalTextures=!0,oe.__autoAllocateDepthBuffer=se===void 0,oe.__autoAllocateDepthBuffer||Pe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),oe.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(C,Y){const se=Me.get(C);se.__webglFramebuffer=Y,se.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(C,Y=0,se=0){T=C,R=Y,w=se;let oe=!0,J=null,Ee=!1,Ie=!1;if(C){const ke=Me.get(C);ke.__useDefaultFramebuffer!==void 0?(fe.bindFramebuffer(D.FRAMEBUFFER,null),oe=!1):ke.__webglFramebuffer===void 0?de.setupRenderTarget(C):ke.__hasExternalTextures&&de.rebindTextures(C,Me.get(C.texture).__webglTexture,Me.get(C.depthTexture).__webglTexture);const _e=C.texture;(_e.isData3DTexture||_e.isDataArrayTexture||_e.isCompressedArrayTexture)&&(Ie=!0);const Ge=Me.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Ge[Y])?J=Ge[Y][se]:J=Ge[Y],Ee=!0):C.samples>0&&de.useMultisampledRTT(C)===!1?J=Me.get(C).__webglMultisampledFramebuffer:Array.isArray(Ge)?J=Ge[se]:J=Ge,y.copy(C.viewport),F.copy(C.scissor),L=C.scissorTest}else y.copy(q).multiplyScalar(ie).floor(),F.copy(N).multiplyScalar(ie).floor(),L=V;if(fe.bindFramebuffer(D.FRAMEBUFFER,J)&&oe&&fe.drawBuffers(C,J),fe.viewport(y),fe.scissor(F),fe.setScissorTest(L),Ee){const ke=Me.get(C.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ke.__webglTexture,se)}else if(Ie){const ke=Me.get(C.texture),_e=Y||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,ke.__webglTexture,se||0,_e)}U=-1},this.readRenderTargetPixels=function(C,Y,se,oe,J,Ee,Ie){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Fe=Me.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ie!==void 0&&(Fe=Fe[Ie]),Fe){fe.bindFramebuffer(D.FRAMEBUFFER,Fe);try{const ke=C.texture,_e=ke.format,Ge=ke.type;if(!Ue.textureFormatReadable(_e)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ue.textureTypeReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=C.width-oe&&se>=0&&se<=C.height-J&&D.readPixels(Y,se,oe,J,me.convert(_e),me.convert(Ge),Ee)}finally{const ke=T!==null?Me.get(T).__webglFramebuffer:null;fe.bindFramebuffer(D.FRAMEBUFFER,ke)}}},this.readRenderTargetPixelsAsync=async function(C,Y,se,oe,J,Ee,Ie){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Fe=Me.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ie!==void 0&&(Fe=Fe[Ie]),Fe){fe.bindFramebuffer(D.FRAMEBUFFER,Fe);try{const ke=C.texture,_e=ke.format,Ge=ke.type;if(!Ue.textureFormatReadable(_e))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ue.textureTypeReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Y>=0&&Y<=C.width-oe&&se>=0&&se<=C.height-J){const He=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,He),D.bufferData(D.PIXEL_PACK_BUFFER,Ee.byteLength,D.STREAM_READ),D.readPixels(Y,se,oe,J,me.convert(_e),me.convert(Ge),0),D.flush();const Ze=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);await wd(D,Ze,4);try{D.bindBuffer(D.PIXEL_PACK_BUFFER,He),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,Ee)}finally{D.deleteBuffer(He),D.deleteSync(Ze)}return Ee}}finally{const ke=T!==null?Me.get(T).__webglFramebuffer:null;fe.bindFramebuffer(D.FRAMEBUFFER,ke)}}},this.copyFramebufferToTexture=function(C,Y=null,se=0){C.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Y=arguments[0]||null,C=arguments[1]);const oe=Math.pow(2,-se),J=Math.floor(C.image.width*oe),Ee=Math.floor(C.image.height*oe),Ie=Y!==null?Y.x:0,Fe=Y!==null?Y.y:0;de.setTexture2D(C,0),D.copyTexSubImage2D(D.TEXTURE_2D,se,0,0,Ie,Fe,J,Ee),fe.unbindTexture()},this.copyTextureToTexture=function(C,Y,se=null,oe=null,J=0){C.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),oe=arguments[0]||null,C=arguments[1],Y=arguments[2],J=arguments[3]||0,se=null);let Ee,Ie,Fe,ke,_e,Ge;se!==null?(Ee=se.max.x-se.min.x,Ie=se.max.y-se.min.y,Fe=se.min.x,ke=se.min.y):(Ee=C.image.width,Ie=C.image.height,Fe=0,ke=0),oe!==null?(_e=oe.x,Ge=oe.y):(_e=0,Ge=0);const He=me.convert(Y.format),Ze=me.convert(Y.type);de.setTexture2D(Y,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,Y.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,Y.unpackAlignment);const rt=D.getParameter(D.UNPACK_ROW_LENGTH),st=D.getParameter(D.UNPACK_IMAGE_HEIGHT),_t=D.getParameter(D.UNPACK_SKIP_PIXELS),Qe=D.getParameter(D.UNPACK_SKIP_ROWS),ze=D.getParameter(D.UNPACK_SKIP_IMAGES),pt=C.isCompressedTexture?C.mipmaps[J]:C.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,pt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,pt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Fe),D.pixelStorei(D.UNPACK_SKIP_ROWS,ke),C.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,J,_e,Ge,Ee,Ie,He,Ze,pt.data):C.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,J,_e,Ge,pt.width,pt.height,He,pt.data):D.texSubImage2D(D.TEXTURE_2D,J,_e,Ge,He,Ze,pt),D.pixelStorei(D.UNPACK_ROW_LENGTH,rt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,st),D.pixelStorei(D.UNPACK_SKIP_PIXELS,_t),D.pixelStorei(D.UNPACK_SKIP_ROWS,Qe),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ze),J===0&&Y.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),fe.unbindTexture()},this.copyTextureToTexture3D=function(C,Y,se=null,oe=null,J=0){C.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),se=arguments[0]||null,oe=arguments[1]||null,C=arguments[2],Y=arguments[3],J=arguments[4]||0);let Ee,Ie,Fe,ke,_e,Ge,He,Ze,rt;const st=C.isCompressedTexture?C.mipmaps[J]:C.image;se!==null?(Ee=se.max.x-se.min.x,Ie=se.max.y-se.min.y,Fe=se.max.z-se.min.z,ke=se.min.x,_e=se.min.y,Ge=se.min.z):(Ee=st.width,Ie=st.height,Fe=st.depth,ke=0,_e=0,Ge=0),oe!==null?(He=oe.x,Ze=oe.y,rt=oe.z):(He=0,Ze=0,rt=0);const _t=me.convert(Y.format),Qe=me.convert(Y.type);let ze;if(Y.isData3DTexture)de.setTexture3D(Y,0),ze=D.TEXTURE_3D;else if(Y.isDataArrayTexture||Y.isCompressedArrayTexture)de.setTexture2DArray(Y,0),ze=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,Y.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,Y.unpackAlignment);const pt=D.getParameter(D.UNPACK_ROW_LENGTH),et=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Wt=D.getParameter(D.UNPACK_SKIP_PIXELS),Mn=D.getParameter(D.UNPACK_SKIP_ROWS),tn=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,st.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,st.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,ke),D.pixelStorei(D.UNPACK_SKIP_ROWS,_e),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ge),C.isDataTexture||C.isData3DTexture?D.texSubImage3D(ze,J,He,Ze,rt,Ee,Ie,Fe,_t,Qe,st.data):Y.isCompressedArrayTexture?D.compressedTexSubImage3D(ze,J,He,Ze,rt,Ee,Ie,Fe,_t,st.data):D.texSubImage3D(ze,J,He,Ze,rt,Ee,Ie,Fe,_t,Qe,st),D.pixelStorei(D.UNPACK_ROW_LENGTH,pt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,et),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Wt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Mn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,tn),J===0&&Y.generateMipmaps&&D.generateMipmap(ze),fe.unbindTexture()},this.initRenderTarget=function(C){Me.get(C).__webglFramebuffer===void 0&&de.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?de.setTextureCube(C,0):C.isData3DTexture?de.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?de.setTexture2DArray(C,0):de.setTexture2D(C,0),fe.unbindTexture()},this.resetState=function(){R=0,w=0,T=null,fe.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Xo?"display-p3":"srgb",t.unpackColorSpace=nt.workingColorSpace===Ms?"display-p3":"srgb"}}class L_ extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class D_ extends Tt{constructor(e=null,t=1,n=1,i,r,o,a,l,c=Dt,h=Dt,d,u){super(null,o,a,l,c,h,i,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Fo extends zt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ei=new it,Wl=new it,Jr=[],Xl=new Sn,I_=new it,rr=new Rt,sr=new ii;class hh extends Rt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Fo(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,I_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Sn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ei),Xl.copy(e.boundingBox).applyMatrix4(Ei),this.boundingBox.union(Xl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ii),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ei),sr.copy(e.boundingSphere).applyMatrix4(Ei),this.boundingSphere.union(sr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(rr.geometry=this.geometry,rr.material=this.material,rr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),sr.copy(this.boundingSphere),sr.applyMatrix4(n),e.ray.intersectsSphere(sr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ei),Wl.multiplyMatrices(n,Ei),rr.matrixWorld=Wl,rr.raycast(e,Jr);for(let o=0,a=Jr.length;o<a;o++){const l=Jr[o];l.instanceId=r,l.object=this,t.push(l)}Jr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Fo(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new D_(new Float32Array(i*this.count),i,this.count,Bc,vn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class uh extends zi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ve(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const vs=new W,xs=new W,Yl=new it,or=new bs,Qr=new ii,xo=new W,jl=new W;class F_ extends xt{constructor(e=new Gt,t=new uh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)vs.fromBufferAttribute(t,i-1),xs.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=vs.distanceTo(xs);e.setAttribute("lineDistance",new yt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Qr.copy(n.boundingSphere),Qr.applyMatrix4(i),Qr.radius+=r,e.ray.intersectsSphere(Qr)===!1)return;Yl.copy(i).invert(),or.copy(e.ray).applyMatrix4(Yl);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,p=g-1;_<p;_+=c){const m=h.getX(_),S=h.getX(_+1),v=$r(this,e,or,l,m,S);v&&t.push(v)}if(this.isLineLoop){const _=h.getX(g-1),p=h.getX(f),m=$r(this,e,or,l,_,p);m&&t.push(m)}}else{const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,p=g-1;_<p;_+=c){const m=$r(this,e,or,l,_,_+1);m&&t.push(m)}if(this.isLineLoop){const _=$r(this,e,or,l,g-1,f);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function $r(s,e,t,n,i,r){const o=s.geometry.attributes.position;if(vs.fromBufferAttribute(o,i),xs.fromBufferAttribute(o,r),t.distanceSqToSegment(vs,xs,xo,jl)>n)return;xo.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(xo);if(!(l<e.near||l>e.far))return{distance:l,point:jl.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,object:s}}const ql=new W,Kl=new W;class N_ extends F_{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)ql.fromBufferAttribute(t,i),Kl.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+ql.distanceTo(Kl);e.setAttribute("lineDistance",new yt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ws extends Gt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new yt(r,3)),this.setAttribute("normal",new yt(r.slice(),3)),this.setAttribute("uv",new yt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(S){const v=new W,b=new W,R=new W;for(let w=0;w<t.length;w+=3)f(t[w+0],v),f(t[w+1],b),f(t[w+2],R),l(v,b,R,S)}function l(S,v,b,R){const w=R+1,T=[];for(let U=0;U<=w;U++){T[U]=[];const E=S.clone().lerp(b,U/w),y=v.clone().lerp(b,U/w),F=w-U;for(let L=0;L<=F;L++)L===0&&U===w?T[U][L]=E:T[U][L]=E.clone().lerp(y,L/F)}for(let U=0;U<w;U++)for(let E=0;E<2*(w-U)-1;E++){const y=Math.floor(E/2);E%2===0?(u(T[U][y+1]),u(T[U+1][y]),u(T[U][y])):(u(T[U][y+1]),u(T[U+1][y+1]),u(T[U+1][y]))}}function c(S){const v=new W;for(let b=0;b<r.length;b+=3)v.x=r[b+0],v.y=r[b+1],v.z=r[b+2],v.normalize().multiplyScalar(S),r[b+0]=v.x,r[b+1]=v.y,r[b+2]=v.z}function h(){const S=new W;for(let v=0;v<r.length;v+=3){S.x=r[v+0],S.y=r[v+1],S.z=r[v+2];const b=p(S)/2/Math.PI+.5,R=m(S)/Math.PI+.5;o.push(b,1-R)}g(),d()}function d(){for(let S=0;S<o.length;S+=6){const v=o[S+0],b=o[S+2],R=o[S+4],w=Math.max(v,b,R),T=Math.min(v,b,R);w>.9&&T<.1&&(v<.2&&(o[S+0]+=1),b<.2&&(o[S+2]+=1),R<.2&&(o[S+4]+=1))}}function u(S){r.push(S.x,S.y,S.z)}function f(S,v){const b=S*3;v.x=e[b+0],v.y=e[b+1],v.z=e[b+2]}function g(){const S=new W,v=new W,b=new W,R=new W,w=new Oe,T=new Oe,U=new Oe;for(let E=0,y=0;E<r.length;E+=9,y+=6){S.set(r[E+0],r[E+1],r[E+2]),v.set(r[E+3],r[E+4],r[E+5]),b.set(r[E+6],r[E+7],r[E+8]),w.set(o[y+0],o[y+1]),T.set(o[y+2],o[y+3]),U.set(o[y+4],o[y+5]),R.copy(S).add(v).add(b).divideScalar(3);const F=p(R);_(w,y+0,S,F),_(T,y+2,v,F),_(U,y+4,b,F)}}function _(S,v,b,R){R<0&&S.x===1&&(o[v]=S.x-1),b.x===0&&b.z===0&&(o[v]=R/2/Math.PI+.5)}function p(S){return Math.atan2(S.z,-S.x)}function m(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ws(e.vertices,e.indices,e.radius,e.details)}}class Ko extends ws{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ko(e.radius,e.detail)}}class As extends Gt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new W,u=new W,f=[],g=[],_=[],p=[];for(let m=0;m<=n;m++){const S=[],v=m/n;let b=0;m===0&&o===0?b=.5/t:m===n&&l===Math.PI&&(b=-.5/t);for(let R=0;R<=t;R++){const w=R/t;d.x=-e*Math.cos(i+w*r)*Math.sin(o+v*a),d.y=e*Math.cos(o+v*a),d.z=e*Math.sin(i+w*r)*Math.sin(o+v*a),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),p.push(w+b,1-v),S.push(c++)}h.push(S)}for(let m=0;m<n;m++)for(let S=0;S<t;S++){const v=h[m][S+1],b=h[m][S],R=h[m+1][S],w=h[m+1][S+1];(m!==0||o>0)&&f.push(v,b,w),(m!==n-1||l<Math.PI)&&f.push(b,R,w)}this.setIndex(f),this.setAttribute("position",new yt(g,3)),this.setAttribute("normal",new yt(_,3)),this.setAttribute("uv",new yt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new As(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Zo extends ws{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Zo(e.radius,e.detail)}}class O_ extends zi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ve(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vc,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class dh extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ve(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const yo=new it,Zl=new W,Jl=new W;class B_{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Oe(512,512),this.map=null,this.mapPass=null,this.matrix=new it,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new jo,this._frameExtents=new Oe(1,1),this._viewportCount=1,this._viewports=[new ht(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Zl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Zl),Jl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Jl),t.updateMatrixWorld(),yo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(yo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class k_ extends B_{constructor(){super(new Es(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class z_ extends dh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new k_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class G_ extends dh{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class H_ extends Gt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class fh{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Ql(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Ql();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Ql(){return(typeof performance>"u"?Date:performance).now()}const $l=new it;class V_{constructor(e,t,n=0,i=1/0){this.ray=new bs(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Yo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return $l.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4($l),this}intersectObject(e,t=!0,n=[]){return No(e,this,n,t),n.sort(ec),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)No(e[i],this,n,t);return n.sort(ec),n}}function ec(s,e){return s.distance-e.distance}function No(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let o=0,a=r.length;o<a;o++)No(r[o],e,t,!0)}}class Oo{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ct(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Wo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Wo);function W_(){const s=document.activeElement;if(!s)return!1;const e=s.tagName;return e==="INPUT"||e==="TEXTAREA"||e==="SELECT"||s.isContentEditable}const es=.06,ts=.92,ns=40,tc=.05;class X_{constructor(e,t,{is2d:n=!1,target:i=window}={}){this._spherical=new Oo,this._offset=new W,this.setCameraControls(e,t,n),i.addEventListener("keydown",r=>{W_()||this.handleKey(r.code)&&r.preventDefault()})}setCameraControls(e,t,n=!1){this.camera=e,this.controls=t,this.is2d=n,this.home={position:e.position.clone(),target:t.target.clone(),zoom:e.zoom}}handleKey(e){if(this.is2d)switch(e){case"KeyW":return this._pan(0,ns),!0;case"KeyS":return this._pan(0,-ns),!0;case"KeyA":return this._pan(-ns,0),!0;case"KeyD":return this._pan(ns,0),!0;case"KeyQ":return this._zoom(ts),!0;case"KeyE":return this._zoom(1/ts),!0;case"Space":case"KeyR":return this.reset(),!0;default:return!1}switch(e){case"KeyW":return this._orbit(0,-es),!0;case"KeyS":return this._orbit(0,es),!0;case"KeyA":return this._orbit(es,0),!0;case"KeyD":return this._orbit(-es,0),!0;case"KeyQ":return this._zoom(ts),!0;case"KeyE":return this._zoom(1/ts),!0;case"Space":case"KeyR":return this.reset(),!0;default:return!1}}_orbit(e,t){this._offset.copy(this.camera.position).sub(this.controls.target),this._spherical.setFromVector3(this._offset),this._spherical.theta+=e,this._spherical.phi=Math.min(Math.PI-tc,Math.max(tc,this._spherical.phi+t)),this._offset.setFromSpherical(this._spherical),this.camera.position.copy(this.controls.target).add(this._offset),this.camera.lookAt(this.controls.target),this._changed()}_zoom(e){this.is2d?(this.camera.zoom=Math.min(20,Math.max(.05,this.camera.zoom/e)),this.camera.updateProjectionMatrix()):(this._offset.copy(this.camera.position).sub(this.controls.target),this._offset.multiplyScalar(e),this.camera.position.copy(this.controls.target).add(this._offset)),this._changed()}_pan(e,t){this.camera.position.x+=e,this.camera.position.y+=t,this.controls.target.x+=e,this.controls.target.y+=t,this._changed()}reset(){this.camera.position.copy(this.home.position),this.controls.target.copy(this.home.target),this.camera.zoom=this.home.zoom,this.camera.updateProjectionMatrix(),this.camera.lookAt(this.controls.target),this._changed()}_changed(){this.controls.update(),this.controls.dispatchEvent({type:"change"})}}const Y_=5;function Li(s,e={}){return{type:"event",event:s,payload:e}}function j_(s,e,t,n,i=Y_){return Math.hypot(t-s,n-e)<i}class q_{constructor(e,t,n,{requestFrame:i=a=>requestAnimationFrame(a),onNodeClick:r=()=>{},onBackgroundClick:o=()=>{}}={}){this.pickFn=t,this.sendFn=n,this.requestFrame=i,this.onNodeClick=r,this.onBackgroundClick=o,this.hoverId=null,this.pointerDown=null,this.pendingMove=null,e.addEventListener("pointermove",a=>this._onMove(a)),e.addEventListener("pointerdown",a=>{this.pointerDown={x:a.clientX,y:a.clientY}}),e.addEventListener("pointerup",a=>this._onUp(a))}_onMove(e){const t=this.pendingMove===null;this.pendingMove={x:e.clientX,y:e.clientY},t&&this.requestFrame(()=>{const n=this.pendingMove;this.pendingMove=null,this._hover(n.x,n.y)})}_hover(e,t){const n=this.pickFn(e,t);n!==this.hoverId&&(this.hoverId=n,this.sendFn(Li("node_hover",{node_id:n})))}_onUp(e){if(!this.pointerDown)return;const{x:t,y:n}=this.pointerDown;if(this.pointerDown=null,!j_(t,n,e.clientX,e.clientY))return;const i=this.pickFn(e.clientX,e.clientY);i!==null?(this.sendFn(Li("node_click",{node_id:i})),this.onNodeClick(i)):(this.sendFn(Li("background_click")),this.onBackgroundClick())}}class K_{constructor(e){this.ids=[],this.positions=new Float32Array(0),this.worker=new Worker(new URL("/assets/worker-DTWVF9kS.js",import.meta.url),{type:"module"}),this.worker.onmessage=({data:t})=>{t.type==="index"?this.ids=t.ids:t.type==="tick"&&(this.positions=t.positions)},this._unsubscribe=e.subscribe(t=>this._onStoreEvent(e,t))}setPaused(e){this.worker.postMessage({type:e?"pause":"resume"})}setDimensions(e){this.worker.postMessage({type:"set_dimensions",dimensions:e})}terminate(){this._unsubscribe(),this.worker.terminate()}_onStoreEvent(e,t){if(t.kind==="init")this.worker.postMessage({type:"init",dimensions:e.config.dimensions,nodes:[...e.nodes.values()].map(n=>({id:n.id,mass:Number(n.meta&&n.meta.mass)})),links:[...e.edges.values()].map(n=>({source:n.source,target:n.target,weight:Number(n.meta&&n.meta.weight)}))});else if(t.kind==="patch"){const n=t.patch;this.worker.postMessage({type:"patch",addNodes:n.add_nodes.map(i=>({id:i.id,mass:Number(i.meta&&i.meta.mass)})),removeNodes:n.remove_nodes,addLinks:n.add_edges.map(i=>({source:i.source,target:i.target,weight:Number(i.meta&&i.meta.weight)})),removeLinks:n.remove_edges})}}}const Z_=2;class J_{constructor(e,{threshold:t=30,holdSeconds:n=3,smoothing:i=2}={}){this.onDegrade=e,this.threshold=t,this.holdSeconds=n,this.smoothing=i,this.avgFps=null,this.below=0,this.steps=0}frame(e){if(e<=0||this.steps>=Z_)return;const t=1/e;this.avgFps=this.avgFps===null?t:this.avgFps+(t-this.avgFps)*Math.min(1,e*this.smoothing),this.avgFps<this.threshold?(this.below+=e,this.below>=this.holdSeconds&&(this.below=0,this.steps+=1,this.onDegrade(this.steps))):this.below=0}}const nc={type:"change"},So={type:"start"},ic={type:"end"},is=new bs,rc=new Ln,Q_=Math.cos(70*Ed.DEG2RAD);class sc extends ni{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new W,this.cursor=new W,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:_n.ROTATE,MIDDLE:_n.DOLLY,RIGHT:_n.PAN},this.touches={ONE:Un.ROTATE,TWO:Un.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(M){M.addEventListener("keydown",ce),this._domElementKeyEvents=M},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ce),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(nc),n.update(),r=i.NONE},this.update=function(){const M=new W,$=new ti().setFromUnitVectors(e.up,new W(0,1,0)),G=$.clone().invert(),ee=new W,ge=new ti,Ae=new W,Re=2*Math.PI;return function(Xe=null){const De=n.object.position;M.copy(De).sub(n.target),M.applyQuaternion($),a.setFromVector3(M),n.autoRotate&&r===i.NONE&&L(y(Xe)),n.enableDamping?(a.theta+=l.theta*n.dampingFactor,a.phi+=l.phi*n.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let Ye=n.minAzimuthAngle,Je=n.maxAzimuthAngle;isFinite(Ye)&&isFinite(Je)&&(Ye<-Math.PI?Ye+=Re:Ye>Math.PI&&(Ye-=Re),Je<-Math.PI?Je+=Re:Je>Math.PI&&(Je-=Re),Ye<=Je?a.theta=Math.max(Ye,Math.min(Je,a.theta)):a.theta=a.theta>(Ye+Je)/2?Math.max(Ye,a.theta):Math.min(Je,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor);let tt=!1;if(n.zoomToCursor&&w||n.object.isOrthographicCamera)a.radius=q(a.radius);else{const $e=a.radius;a.radius=q(a.radius*c),tt=$e!=a.radius}if(M.setFromSpherical(a),M.applyQuaternion(G),De.copy(n.target).add(M),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),h.set(0,0,0)),n.zoomToCursor&&w){let $e=null;if(n.object.isPerspectiveCamera){const lt=M.length();$e=q(lt*c);const St=lt-$e;n.object.position.addScaledVector(b,St),n.object.updateMatrixWorld(),tt=!!St}else if(n.object.isOrthographicCamera){const lt=new W(R.x,R.y,0);lt.unproject(n.object);const St=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),tt=St!==n.object.zoom;const gt=new W(R.x,R.y,0);gt.unproject(n.object),n.object.position.sub(gt).add(lt),n.object.updateMatrixWorld(),$e=M.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;$e!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar($e).add(n.object.position):(is.origin.copy(n.object.position),is.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(is.direction))<Q_?e.lookAt(n.target):(rc.setFromNormalAndCoplanarPoint(n.object.up,n.target),is.intersectPlane(rc,n.target))))}else if(n.object.isOrthographicCamera){const $e=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),$e!==n.object.zoom&&(n.object.updateProjectionMatrix(),tt=!0)}return c=1,w=!1,tt||ee.distanceToSquared(n.object.position)>o||8*(1-ge.dot(n.object.quaternion))>o||Ae.distanceToSquared(n.target)>o?(n.dispatchEvent(nc),ee.copy(n.object.position),ge.copy(n.object.quaternion),Ae.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",be),n.domElement.removeEventListener("pointerdown",Ce),n.domElement.removeEventListener("pointercancel",x),n.domElement.removeEventListener("wheel",re),n.domElement.removeEventListener("pointermove",P),n.domElement.removeEventListener("pointerup",x),n.domElement.getRootNode().removeEventListener("keydown",Te,{capture:!0}),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ce),n._domElementKeyEvents=null)};const n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const o=1e-6,a=new Oo,l=new Oo;let c=1;const h=new W,d=new Oe,u=new Oe,f=new Oe,g=new Oe,_=new Oe,p=new Oe,m=new Oe,S=new Oe,v=new Oe,b=new W,R=new Oe;let w=!1;const T=[],U={};let E=!1;function y(M){return M!==null?2*Math.PI/60*n.autoRotateSpeed*M:2*Math.PI/60/60*n.autoRotateSpeed}function F(M){const $=Math.abs(M*.01);return Math.pow(.95,n.zoomSpeed*$)}function L(M){l.theta-=M}function A(M){l.phi-=M}const I=function(){const M=new W;return function(G,ee){M.setFromMatrixColumn(ee,0),M.multiplyScalar(-G),h.add(M)}}(),z=function(){const M=new W;return function(G,ee){n.screenSpacePanning===!0?M.setFromMatrixColumn(ee,1):(M.setFromMatrixColumn(ee,0),M.crossVectors(n.object.up,M)),M.multiplyScalar(G),h.add(M)}}(),B=function(){const M=new W;return function(G,ee){const ge=n.domElement;if(n.object.isPerspectiveCamera){const Ae=n.object.position;M.copy(Ae).sub(n.target);let Re=M.length();Re*=Math.tan(n.object.fov/2*Math.PI/180),I(2*G*Re/ge.clientHeight,n.object.matrix),z(2*ee*Re/ge.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(I(G*(n.object.right-n.object.left)/n.object.zoom/ge.clientWidth,n.object.matrix),z(ee*(n.object.top-n.object.bottom)/n.object.zoom/ge.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function ie(M){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=M:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function j(M){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=M:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function K(M,$){if(!n.zoomToCursor)return;w=!0;const G=n.domElement.getBoundingClientRect(),ee=M-G.left,ge=$-G.top,Ae=G.width,Re=G.height;R.x=ee/Ae*2-1,R.y=-(ge/Re)*2+1,b.set(R.x,R.y,1).unproject(n.object).sub(n.object.position).normalize()}function q(M){return Math.max(n.minDistance,Math.min(n.maxDistance,M))}function N(M){d.set(M.clientX,M.clientY)}function V(M){K(M.clientX,M.clientX),m.set(M.clientX,M.clientY)}function ne(M){g.set(M.clientX,M.clientY)}function O(M){u.set(M.clientX,M.clientY),f.subVectors(u,d).multiplyScalar(n.rotateSpeed);const $=n.domElement;L(2*Math.PI*f.x/$.clientHeight),A(2*Math.PI*f.y/$.clientHeight),d.copy(u),n.update()}function k(M){S.set(M.clientX,M.clientY),v.subVectors(S,m),v.y>0?ie(F(v.y)):v.y<0&&j(F(v.y)),m.copy(S),n.update()}function te(M){_.set(M.clientX,M.clientY),p.subVectors(_,g).multiplyScalar(n.panSpeed),B(p.x,p.y),g.copy(_),n.update()}function H(M){K(M.clientX,M.clientY),M.deltaY<0?j(F(M.deltaY)):M.deltaY>0&&ie(F(M.deltaY)),n.update()}function ae(M){let $=!1;switch(M.code){case n.keys.UP:M.ctrlKey||M.metaKey||M.shiftKey?A(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(0,n.keyPanSpeed),$=!0;break;case n.keys.BOTTOM:M.ctrlKey||M.metaKey||M.shiftKey?A(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(0,-n.keyPanSpeed),$=!0;break;case n.keys.LEFT:M.ctrlKey||M.metaKey||M.shiftKey?L(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(n.keyPanSpeed,0),$=!0;break;case n.keys.RIGHT:M.ctrlKey||M.metaKey||M.shiftKey?L(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(-n.keyPanSpeed,0),$=!0;break}$&&(M.preventDefault(),n.update())}function pe(M){if(T.length===1)d.set(M.pageX,M.pageY);else{const $=Ne(M),G=.5*(M.pageX+$.x),ee=.5*(M.pageY+$.y);d.set(G,ee)}}function ve(M){if(T.length===1)g.set(M.pageX,M.pageY);else{const $=Ne(M),G=.5*(M.pageX+$.x),ee=.5*(M.pageY+$.y);g.set(G,ee)}}function D(M){const $=Ne(M),G=M.pageX-$.x,ee=M.pageY-$.y,ge=Math.sqrt(G*G+ee*ee);m.set(0,ge)}function he(M){n.enableZoom&&D(M),n.enablePan&&ve(M)}function Pe(M){n.enableZoom&&D(M),n.enableRotate&&pe(M)}function Ue(M){if(T.length==1)u.set(M.pageX,M.pageY);else{const G=Ne(M),ee=.5*(M.pageX+G.x),ge=.5*(M.pageY+G.y);u.set(ee,ge)}f.subVectors(u,d).multiplyScalar(n.rotateSpeed);const $=n.domElement;L(2*Math.PI*f.x/$.clientHeight),A(2*Math.PI*f.y/$.clientHeight),d.copy(u)}function fe(M){if(T.length===1)_.set(M.pageX,M.pageY);else{const $=Ne(M),G=.5*(M.pageX+$.x),ee=.5*(M.pageY+$.y);_.set(G,ee)}p.subVectors(_,g).multiplyScalar(n.panSpeed),B(p.x,p.y),g.copy(_)}function ye(M){const $=Ne(M),G=M.pageX-$.x,ee=M.pageY-$.y,ge=Math.sqrt(G*G+ee*ee);S.set(0,ge),v.set(0,Math.pow(S.y/m.y,n.zoomSpeed)),ie(v.y),m.copy(S);const Ae=(M.pageX+$.x)*.5,Re=(M.pageY+$.y)*.5;K(Ae,Re)}function Me(M){n.enableZoom&&ye(M),n.enablePan&&fe(M)}function de(M){n.enableZoom&&ye(M),n.enableRotate&&Ue(M)}function Ce(M){n.enabled!==!1&&(T.length===0&&(n.domElement.setPointerCapture(M.pointerId),n.domElement.addEventListener("pointermove",P),n.domElement.addEventListener("pointerup",x)),!me(M)&&(Be(M),M.pointerType==="touch"?Se(M):X(M)))}function P(M){n.enabled!==!1&&(M.pointerType==="touch"?ue(M):Z(M))}function x(M){switch(we(M),T.length){case 0:n.domElement.releasePointerCapture(M.pointerId),n.domElement.removeEventListener("pointermove",P),n.domElement.removeEventListener("pointerup",x),n.dispatchEvent(ic),r=i.NONE;break;case 1:const $=T[0],G=U[$];Se({pointerId:$,pageX:G.x,pageY:G.y});break}}function X(M){let $;switch(M.button){case 0:$=n.mouseButtons.LEFT;break;case 1:$=n.mouseButtons.MIDDLE;break;case 2:$=n.mouseButtons.RIGHT;break;default:$=-1}switch($){case _n.DOLLY:if(n.enableZoom===!1)return;V(M),r=i.DOLLY;break;case _n.ROTATE:if(M.ctrlKey||M.metaKey||M.shiftKey){if(n.enablePan===!1)return;ne(M),r=i.PAN}else{if(n.enableRotate===!1)return;N(M),r=i.ROTATE}break;case _n.PAN:if(M.ctrlKey||M.metaKey||M.shiftKey){if(n.enableRotate===!1)return;N(M),r=i.ROTATE}else{if(n.enablePan===!1)return;ne(M),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(So)}function Z(M){switch(r){case i.ROTATE:if(n.enableRotate===!1)return;O(M);break;case i.DOLLY:if(n.enableZoom===!1)return;k(M);break;case i.PAN:if(n.enablePan===!1)return;te(M);break}}function re(M){n.enabled===!1||n.enableZoom===!1||r!==i.NONE||(M.preventDefault(),n.dispatchEvent(So),H(Q(M)),n.dispatchEvent(ic))}function Q(M){const $=M.deltaMode,G={clientX:M.clientX,clientY:M.clientY,deltaY:M.deltaY};switch($){case 1:G.deltaY*=16;break;case 2:G.deltaY*=100;break}return M.ctrlKey&&!E&&(G.deltaY*=10),G}function Te(M){M.key==="Control"&&(E=!0,n.domElement.getRootNode().addEventListener("keyup",le,{passive:!0,capture:!0}))}function le(M){M.key==="Control"&&(E=!1,n.domElement.getRootNode().removeEventListener("keyup",le,{passive:!0,capture:!0}))}function ce(M){n.enabled===!1||n.enablePan===!1||ae(M)}function Se(M){switch(xe(M),T.length){case 1:switch(n.touches.ONE){case Un.ROTATE:if(n.enableRotate===!1)return;pe(M),r=i.TOUCH_ROTATE;break;case Un.PAN:if(n.enablePan===!1)return;ve(M),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(n.touches.TWO){case Un.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;he(M),r=i.TOUCH_DOLLY_PAN;break;case Un.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Pe(M),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(So)}function ue(M){switch(xe(M),r){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;Ue(M),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;fe(M),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Me(M),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;de(M),n.update();break;default:r=i.NONE}}function be(M){n.enabled!==!1&&M.preventDefault()}function Be(M){T.push(M.pointerId)}function we(M){delete U[M.pointerId];for(let $=0;$<T.length;$++)if(T[$]==M.pointerId){T.splice($,1);return}}function me(M){for(let $=0;$<T.length;$++)if(T[$]==M.pointerId)return!0;return!1}function xe(M){let $=U[M.pointerId];$===void 0&&($=new Oe,U[M.pointerId]=$),$.set(M.pageX,M.pageY)}function Ne(M){const $=M.pointerId===T[0]?T[1]:T[0];return U[$]}n.domElement.addEventListener("contextmenu",be),n.domElement.addEventListener("pointerdown",Ce),n.domElement.addEventListener("pointercancel",x),n.domElement.addEventListener("wheel",re,{passive:!1}),n.domElement.getRootNode().addEventListener("keydown",Te,{passive:!0,capture:!0}),this.update()}}const ph={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class vr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const $_=new Es(-1,1,1,-1,0,1);class ev extends Gt{constructor(){super(),this.setAttribute("position",new yt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new yt([0,2,0,0,2,0],2))}}const tv=new ev;class mh{constructor(e){this._mesh=new Rt(tv,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,$_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class nv extends vr{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof It?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=pr.clone(e.uniforms),this.material=new It({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new mh(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class oc extends vr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class iv extends vr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class rv{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Oe);this._width=n.width,this._height=n.height,t=new en(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Fn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new nv(ph),this.copyPass.material.blending=yn,this.clock=new fh}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}oc!==void 0&&(o instanceof oc?n=!0:o instanceof iv&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Oe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class sv extends vr{constructor(e,t,n=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ve}render(e,t,n){const i=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=i}}const ov={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ve(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class ki extends vr{constructor(e,t,n,i){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new Oe(e.x,e.y):new Oe(256,256),this.clearColor=new Ve(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new en(r,o,{type:Fn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new en(r,o,{type:Fn});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new en(r,o,{type:Fn});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),o=Math.round(o/2)}const a=ov;this.highPassUniforms=pr.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new It({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Oe(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new W(1,1,1),new W(1,1,1),new W(1,1,1),new W(1,1,1),new W(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=ph;this.copyUniforms=pr.clone(h.uniforms),this.blendMaterial=new It({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:hs,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Ve,this.oldClearAlpha=1,this.basic=new _r,this.fsQuad=new mh(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new Oe(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=ki.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=ki.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new It({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Oe(.5,.5)},direction:{value:new Oe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new It({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}ki.BlurDirectionX=new Oe(1,0);ki.BlurDirectionY=new Oe(0,1);function Bo(s){return s!==null&&typeof s=="object"&&!Array.isArray(s)}function Jo(s,e){const t={...s};for(const[n,i]of Object.entries(e))t[n]=Bo(t[n])&&Bo(i)?Jo(t[n],i):i;return t}const av="#dadada",lv={bg:"#cfe1fb",fg:"#000000",menuAttach:!0},cv={headerBg:"#ffffff",headerBgActive:"#ffffff",headerFg:"#000000",headerFgActive:"#000000",headerStripe:!0,gadget:"#000000",border:"#000000",bevel:"hard",bodyBg:"#0055aa",bodyFg:"#ffffff",key:"#ff8800",dockBg:"#b8c6e8",shadow:"0 2px 0 rgba(0,0,0,0.35)",backdropPattern:"flat",iconSet:"workbench-classic",font:"topaz-8"},hv={background:av,screenBar:lv,window:cv},gh={background:"#f4f5f7",palette:["#2f7fe8","#e8553a","#2fa84f","#8a4fe8","#e8a02f","#1fb3c4","#d44f9e","#5b6472"],node:{color:"#2f7fe8",size:1,shape:"sphere",emissive:"#000000",emissiveIntensity:0},edge:{color:"#9aa3af",opacity:.5},lights:{ambient:{color:"#ffffff",intensity:.7},directional:{color:"#ffffff",intensity:1.2}},label:{color:"#1f2430",size:6,halo:"#f4f5f7",budget:200},detailBox:{"--vb-detail-bg":"rgba(255,255,255,0.95)","--vb-detail-fg":"#1f2430","--vb-detail-key":"#667788","--vb-detail-shadow":"0 4px 16px rgba(0,0,0,0.18)","--vb-status-bg":"rgba(20,23,28,0.85)","--vb-status-fg":"#ffffff"},bloom:{enabled:!1,strength:.8,radius:.6,threshold:.15},window:{headerBg:"#d8dde6",headerFg:"#1f2430",gadget:"#5a6573",bodyBg:"rgba(255,255,255,0.97)",bodyFg:"#1f2430",key:"#667788",dockBg:"#c2c9d4",shadow:"0 6px 20px rgba(0,0,0,0.22)"},flow:{size:2.4,baseSpeed:220,color:"#2f7fe8",opacity:.85}},uv={background:"#0a0e1a",palette:["#28d7fe","#ff2a6d","#05ffa1","#b967ff","#ffd166","#01c8ee","#ff6e27","#e8f8ff"],node:{color:"#28d7fe",size:1,shape:"sphere",emissive:"#1b3a5c",emissiveIntensity:1.2},edge:{color:"#1f4f6e",opacity:.65},lights:{ambient:{color:"#314466",intensity:.9},directional:{color:"#9fd8ff",intensity:1.4}},label:{color:"#d7f4ff",size:6,halo:"#0a0e1a",budget:200},detailBox:{"--vb-detail-bg":"rgba(10,16,28,0.92)","--vb-detail-fg":"#d7f4ff","--vb-detail-key":"#5a7d9e","--vb-detail-shadow":"0 0 18px rgba(40,215,254,0.35)","--vb-status-bg":"rgba(40,215,254,0.15)","--vb-status-fg":"#d7f4ff"},bloom:{enabled:!0,strength:.9,radius:.7,threshold:.15},window:{headerBg:"rgba(40,215,254,0.18)",headerFg:"#d7f4ff",gadget:"#28d7fe",bodyBg:"rgba(10,16,28,0.94)",bodyFg:"#d7f4ff",key:"#5a7d9e",dockBg:"rgba(40,215,254,0.12)",shadow:"0 0 22px rgba(40,215,254,0.45)"},flow:{size:3,baseSpeed:260,color:"#28d7fe",opacity:1}},dv=Jo(gh,hv),ar={modern:gh,cyber:uv,workbench:dv};function _h(s){return typeof s=="string"?ar[s]?ar[s]:(console.error(`viewbase: neznámé téma '${s}' – používám 'modern'`),ar.modern):Bo(s)?Jo(ar.modern,s):(s!=null&&console.error("viewbase: theme musí být string nebo objekt – používám modern"),ar.modern)}function fv(s,e=document.documentElement){for(const[n,i]of Object.entries(s.detailBox))e.style.setProperty(n,i);const t=s.window;if(t){const n={"--vb-window-header-bg":t.headerBg,"--vb-window-header-fg":t.headerFg,"--vb-window-gadget":t.gadget,"--vb-window-body-bg":t.bodyBg,"--vb-window-body-fg":t.bodyFg,"--vb-window-key":t.key,"--vb-window-dock-bg":t.dockBg,"--vb-window-shadow":t.shadow,"--vb-window-border":t.border};for(const[i,r]of Object.entries(n))r!=null&&e.style.setProperty(i,r);e.style.setProperty("--vb-window-header-pattern",t.headerStripe?`repeating-linear-gradient(0deg, ${t.headerFg}22 0px, ${t.headerFg}22 1px, transparent 1px, transparent 4px)`:"none")}}function vh(s,e,t){const n=s.type!=null&&e[s.type]||{};return{shape:n.shape??t.node.shape,color:s.meta.color??n.color??t.node.color,size:s.meta.size??n.size??t.node.size}}function pv(){var s=Object.create(null);function e(i,r){var o=i.id,a=i.name,l=i.dependencies;l===void 0&&(l=[]);var c=i.init;c===void 0&&(c=function(){});var h=i.getTransferables;if(h===void 0&&(h=null),!s[o])try{l=l.map(function(u){return u&&u.isWorkerModule&&(e(u,function(f){if(f instanceof Error)throw f}),u=s[u.id].value),u}),c=n("<"+a+">.init",c),h&&(h=n("<"+a+">.getTransferables",h));var d=null;typeof c=="function"?d=c.apply(void 0,l):console.error("worker module init function failed to rehydrate"),s[o]={id:o,value:d,getTransferables:h},r(d)}catch(u){u&&u.noLog||console.error(u),r(u)}}function t(i,r){var o,a=i.id,l=i.args;(!s[a]||typeof s[a].value!="function")&&r(new Error("Worker module "+a+": not found or its 'init' did not return a function"));try{var c=(o=s[a]).value.apply(o,l);c&&typeof c.then=="function"?c.then(h,function(d){return r(d instanceof Error?d:new Error(""+d))}):h(c)}catch(d){r(d)}function h(d){try{var u=s[a].getTransferables&&s[a].getTransferables(d);(!u||!Array.isArray(u)||!u.length)&&(u=void 0),r(d,u)}catch(f){console.error(f),r(f)}}}function n(i,r){var o=void 0;self.troikaDefine=function(l){return o=l};var a=URL.createObjectURL(new Blob(["/** "+i.replace(/\*/g,"")+` **/

troikaDefine(
`+r+`
)`],{type:"application/javascript"}));try{importScripts(a)}catch(l){console.error(l)}return URL.revokeObjectURL(a),delete self.troikaDefine,o}self.addEventListener("message",function(i){var r=i.data,o=r.messageId,a=r.action,l=r.data;try{a==="registerModule"&&e(l,function(c){c instanceof Error?postMessage({messageId:o,success:!1,error:c.message}):postMessage({messageId:o,success:!0,result:{isCallable:typeof c=="function"}})}),a==="callModule"&&t(l,function(c,h){c instanceof Error?postMessage({messageId:o,success:!1,error:c.message}):postMessage({messageId:o,success:!0,result:c},h||void 0)})}catch(c){postMessage({messageId:o,success:!1,error:c.stack})}})}function mv(s){var e=function(){for(var t=[],n=arguments.length;n--;)t[n]=arguments[n];return e._getInitResult().then(function(i){if(typeof i=="function")return i.apply(void 0,t);throw new Error("Worker module function was called but `init` did not return a callable function")})};return e._getInitResult=function(){var t=s.dependencies,n=s.init;t=Array.isArray(t)?t.map(function(r){return r&&(r=r.onMainThread||r,r._getInitResult&&(r=r._getInitResult())),r}):[];var i=Promise.all(t).then(function(r){return n.apply(null,r)});return e._getInitResult=function(){return i},i},e}var xh=function(){var s=!1;if(typeof window<"u"&&typeof window.document<"u")try{var e=new Worker(URL.createObjectURL(new Blob([""],{type:"application/javascript"})));e.terminate(),s=!0}catch(t){console.log("Troika createWorkerModule: web workers not allowed; falling back to main thread execution. Cause: ["+t.message+"]")}return xh=function(){return s},s},gv=0,_v=0,Mo=!1,dr=Object.create(null),fr=Object.create(null),ko=Object.create(null);function Vi(s){if((!s||typeof s.init!="function")&&!Mo)throw new Error("requires `options.init` function");var e=s.dependencies,t=s.init,n=s.getTransferables,i=s.workerId,r=mv(s);i==null&&(i="#default");var o="workerModule"+ ++gv,a=s.name||o,l=null;e=e&&e.map(function(h){return typeof h=="function"&&!h.workerModuleData&&(Mo=!0,h=Vi({workerId:i,name:"<"+a+"> function dependency: "+h.name,init:`function(){return (
`+ls(h)+`
)}`}),Mo=!1),h&&h.workerModuleData&&(h=h.workerModuleData),h});function c(){for(var h=[],d=arguments.length;d--;)h[d]=arguments[d];if(!xh())return r.apply(void 0,h);if(!l){l=ac(i,"registerModule",c.workerModuleData);var u=function(){l=null,fr[i].delete(u)};(fr[i]||(fr[i]=new Set)).add(u)}return l.then(function(f){var g=f.isCallable;if(g)return ac(i,"callModule",{id:o,args:h});throw new Error("Worker module function was called but `init` did not return a callable function")})}return c.workerModuleData={isWorkerModule:!0,id:o,name:a,dependencies:e,init:ls(t),getTransferables:n&&ls(n)},c.onMainThread=r,c}function vv(s){fr[s]&&fr[s].forEach(function(e){e()}),dr[s]&&(dr[s].terminate(),delete dr[s])}function ls(s){var e=s.toString();return!/^function/.test(e)&&/^\w+\s*\(/.test(e)&&(e="function "+e),e}function xv(s){var e=dr[s];if(!e){var t=ls(pv);e=dr[s]=new Worker(URL.createObjectURL(new Blob(["/** Worker Module Bootstrap: "+s.replace(/\*/g,"")+` **/

;(`+t+")()"],{type:"application/javascript"}))),e.onmessage=function(n){var i=n.data,r=i.messageId,o=ko[r];if(!o)throw new Error("WorkerModule response with empty or unknown messageId");delete ko[r],o(i)}}return e}function ac(s,e,t){return new Promise(function(n,i){var r=++_v;ko[r]=function(o){o.success?n(o.result):i(new Error("Error in worker "+e+" call: "+o.error))},xv(s).postMessage({messageId:r,action:e,data:t})})}function yh(){var s=function(e){function t(K,q,N,V,ne,O,k,te){var H=1-k;te.x=H*H*K+2*H*k*N+k*k*ne,te.y=H*H*q+2*H*k*V+k*k*O}function n(K,q,N,V,ne,O,k,te,H,ae){var pe=1-H;ae.x=pe*pe*pe*K+3*pe*pe*H*N+3*pe*H*H*ne+H*H*H*k,ae.y=pe*pe*pe*q+3*pe*pe*H*V+3*pe*H*H*O+H*H*H*te}function i(K,q){for(var N=/([MLQCZ])([^MLQCZ]*)/g,V,ne,O,k,te;V=N.exec(K);){var H=V[2].replace(/^\s*|\s*$/g,"").split(/[,\s]+/).map(function(ae){return parseFloat(ae)});switch(V[1]){case"M":k=ne=H[0],te=O=H[1];break;case"L":(H[0]!==k||H[1]!==te)&&q("L",k,te,k=H[0],te=H[1]);break;case"Q":{q("Q",k,te,k=H[2],te=H[3],H[0],H[1]);break}case"C":{q("C",k,te,k=H[4],te=H[5],H[0],H[1],H[2],H[3]);break}case"Z":(k!==ne||te!==O)&&q("L",k,te,ne,O);break}}}function r(K,q,N){N===void 0&&(N=16);var V={x:0,y:0};i(K,function(ne,O,k,te,H,ae,pe,ve,D){switch(ne){case"L":q(O,k,te,H);break;case"Q":{for(var he=O,Pe=k,Ue=1;Ue<N;Ue++)t(O,k,ae,pe,te,H,Ue/(N-1),V),q(he,Pe,V.x,V.y),he=V.x,Pe=V.y;break}case"C":{for(var fe=O,ye=k,Me=1;Me<N;Me++)n(O,k,ae,pe,ve,D,te,H,Me/(N-1),V),q(fe,ye,V.x,V.y),fe=V.x,ye=V.y;break}}})}var o="precision highp float;attribute vec2 aUV;varying vec2 vUV;void main(){vUV=aUV;gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}",a="precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){gl_FragColor=texture2D(tex,vUV);}",l=new WeakMap,c={premultipliedAlpha:!1,preserveDrawingBuffer:!0,antialias:!1,depth:!1};function h(K,q){var N=K.getContext?K.getContext("webgl",c):K,V=l.get(N);if(!V){let pe=function(fe){var ye=O[fe];if(!ye&&(ye=O[fe]=N.getExtension(fe),!ye))throw new Error(fe+" not supported");return ye},ve=function(fe,ye){var Me=N.createShader(ye);return N.shaderSource(Me,fe),N.compileShader(Me),Me},D=function(fe,ye,Me,de){if(!k[fe]){var Ce={},P={},x=N.createProgram();N.attachShader(x,ve(ye,N.VERTEX_SHADER)),N.attachShader(x,ve(Me,N.FRAGMENT_SHADER)),N.linkProgram(x),k[fe]={program:x,transaction:function(Z){N.useProgram(x),Z({setUniform:function(Q,Te){for(var le=[],ce=arguments.length-2;ce-- >0;)le[ce]=arguments[ce+2];var Se=P[Te]||(P[Te]=N.getUniformLocation(x,Te));N["uniform"+Q].apply(N,[Se].concat(le))},setAttribute:function(Q,Te,le,ce,Se){var ue=Ce[Q];ue||(ue=Ce[Q]={buf:N.createBuffer(),loc:N.getAttribLocation(x,Q),data:null}),N.bindBuffer(N.ARRAY_BUFFER,ue.buf),N.vertexAttribPointer(ue.loc,Te,N.FLOAT,!1,0,0),N.enableVertexAttribArray(ue.loc),ne?N.vertexAttribDivisor(ue.loc,ce):pe("ANGLE_instanced_arrays").vertexAttribDivisorANGLE(ue.loc,ce),Se!==ue.data&&(N.bufferData(N.ARRAY_BUFFER,Se,le),ue.data=Se)}})}}}k[fe].transaction(de)},he=function(fe,ye){H++;try{N.activeTexture(N.TEXTURE0+H);var Me=te[fe];Me||(Me=te[fe]=N.createTexture(),N.bindTexture(N.TEXTURE_2D,Me),N.texParameteri(N.TEXTURE_2D,N.TEXTURE_MIN_FILTER,N.NEAREST),N.texParameteri(N.TEXTURE_2D,N.TEXTURE_MAG_FILTER,N.NEAREST)),N.bindTexture(N.TEXTURE_2D,Me),ye(Me,H)}finally{H--}},Pe=function(fe,ye,Me){var de=N.createFramebuffer();ae.push(de),N.bindFramebuffer(N.FRAMEBUFFER,de),N.activeTexture(N.TEXTURE0+ye),N.bindTexture(N.TEXTURE_2D,fe),N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,fe,0);try{Me(de)}finally{N.deleteFramebuffer(de),N.bindFramebuffer(N.FRAMEBUFFER,ae[--ae.length-1]||null)}},Ue=function(){O={},k={},te={},H=-1,ae.length=0};var ne=typeof WebGL2RenderingContext<"u"&&N instanceof WebGL2RenderingContext,O={},k={},te={},H=-1,ae=[];N.canvas.addEventListener("webglcontextlost",function(fe){Ue(),fe.preventDefault()},!1),l.set(N,V={gl:N,isWebGL2:ne,getExtension:pe,withProgram:D,withTexture:he,withTextureFramebuffer:Pe,handleContextLoss:Ue})}q(V)}function d(K,q,N,V,ne,O,k,te){k===void 0&&(k=15),te===void 0&&(te=null),h(K,function(H){var ae=H.gl,pe=H.withProgram,ve=H.withTexture;ve("copy",function(D,he){ae.texImage2D(ae.TEXTURE_2D,0,ae.RGBA,ne,O,0,ae.RGBA,ae.UNSIGNED_BYTE,q),pe("copy",o,a,function(Pe){var Ue=Pe.setUniform,fe=Pe.setAttribute;fe("aUV",2,ae.STATIC_DRAW,0,new Float32Array([0,0,2,0,0,2])),Ue("1i","image",he),ae.bindFramebuffer(ae.FRAMEBUFFER,te||null),ae.disable(ae.BLEND),ae.colorMask(k&8,k&4,k&2,k&1),ae.viewport(N,V,ne,O),ae.scissor(N,V,ne,O),ae.drawArrays(ae.TRIANGLES,0,3)})})})}function u(K,q,N){var V=K.width,ne=K.height;h(K,function(O){var k=O.gl,te=new Uint8Array(V*ne*4);k.readPixels(0,0,V,ne,k.RGBA,k.UNSIGNED_BYTE,te),K.width=q,K.height=N,d(k,te,0,0,V,ne)})}var f=Object.freeze({__proto__:null,withWebGLContext:h,renderImageData:d,resizeWebGLCanvasWithoutClearing:u});function g(K,q,N,V,ne,O){O===void 0&&(O=1);var k=new Uint8Array(K*q),te=V[2]-V[0],H=V[3]-V[1],ae=[];r(N,function(fe,ye,Me,de){ae.push({x1:fe,y1:ye,x2:Me,y2:de,minX:Math.min(fe,Me),minY:Math.min(ye,de),maxX:Math.max(fe,Me),maxY:Math.max(ye,de)})}),ae.sort(function(fe,ye){return fe.maxX-ye.maxX});for(var pe=0;pe<K;pe++)for(var ve=0;ve<q;ve++){var D=Pe(V[0]+te*(pe+.5)/K,V[1]+H*(ve+.5)/q),he=Math.pow(1-Math.abs(D)/ne,O)/2;D<0&&(he=1-he),he=Math.max(0,Math.min(255,Math.round(he*255))),k[ve*K+pe]=he}return k;function Pe(fe,ye){for(var Me=1/0,de=1/0,Ce=ae.length;Ce--;){var P=ae[Ce];if(P.maxX+de<=fe)break;if(fe+de>P.minX&&ye-de<P.maxY&&ye+de>P.minY){var x=m(fe,ye,P.x1,P.y1,P.x2,P.y2);x<Me&&(Me=x,de=Math.sqrt(Me))}}return Ue(fe,ye)&&(de=-de),de}function Ue(fe,ye){for(var Me=0,de=ae.length;de--;){var Ce=ae[de];if(Ce.maxX<=fe)break;var P=Ce.y1>ye!=Ce.y2>ye&&fe<(Ce.x2-Ce.x1)*(ye-Ce.y1)/(Ce.y2-Ce.y1)+Ce.x1;P&&(Me+=Ce.y1<Ce.y2?1:-1)}return Me!==0}}function _(K,q,N,V,ne,O,k,te,H,ae){O===void 0&&(O=1),te===void 0&&(te=0),H===void 0&&(H=0),ae===void 0&&(ae=0),p(K,q,N,V,ne,O,k,null,te,H,ae)}function p(K,q,N,V,ne,O,k,te,H,ae,pe){O===void 0&&(O=1),H===void 0&&(H=0),ae===void 0&&(ae=0),pe===void 0&&(pe=0);for(var ve=g(K,q,N,V,ne,O),D=new Uint8Array(ve.length*4),he=0;he<ve.length;he++)D[he*4+pe]=ve[he];d(k,D,H,ae,K,q,1<<3-pe,te)}function m(K,q,N,V,ne,O){var k=ne-N,te=O-V,H=k*k+te*te,ae=H?Math.max(0,Math.min(1,((K-N)*k+(q-V)*te)/H)):0,pe=K-(N+ae*k),ve=q-(V+ae*te);return pe*pe+ve*ve}var S=Object.freeze({__proto__:null,generate:g,generateIntoCanvas:_,generateIntoFramebuffer:p}),v="precision highp float;uniform vec4 uGlyphBounds;attribute vec2 aUV;attribute vec4 aLineSegment;varying vec4 vLineSegment;varying vec2 vGlyphXY;void main(){vLineSegment=aLineSegment;vGlyphXY=mix(uGlyphBounds.xy,uGlyphBounds.zw,aUV);gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}",b="precision highp float;uniform vec4 uGlyphBounds;uniform float uMaxDistance;uniform float uExponent;varying vec4 vLineSegment;varying vec2 vGlyphXY;float absDistToSegment(vec2 point,vec2 lineA,vec2 lineB){vec2 lineDir=lineB-lineA;float lenSq=dot(lineDir,lineDir);float t=lenSq==0.0 ? 0.0 : clamp(dot(point-lineA,lineDir)/lenSq,0.0,1.0);vec2 linePt=lineA+t*lineDir;return distance(point,linePt);}void main(){vec4 seg=vLineSegment;vec2 p=vGlyphXY;float dist=absDistToSegment(p,seg.xy,seg.zw);float val=pow(1.0-clamp(dist/uMaxDistance,0.0,1.0),uExponent)*0.5;bool crossing=(seg.y>p.y!=seg.w>p.y)&&(p.x<(seg.z-seg.x)*(p.y-seg.y)/(seg.w-seg.y)+seg.x);bool crossingUp=crossing&&vLineSegment.y<vLineSegment.w;gl_FragColor=vec4(crossingUp ? 1.0/255.0 : 0.0,crossing&&!crossingUp ? 1.0/255.0 : 0.0,0.0,val);}",R="precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){vec4 color=texture2D(tex,vUV);bool inside=color.r!=color.g;float val=inside ? 1.0-color.a : color.a;gl_FragColor=vec4(val);}",w=new Float32Array([0,0,2,0,0,2]),T=null,U=!1,E={},y=new WeakMap;function F(K){if(!U&&!z(K))throw new Error("WebGL generation not supported")}function L(K,q,N,V,ne,O,k){if(O===void 0&&(O=1),k===void 0&&(k=null),!k&&(k=T,!k)){var te=typeof OffscreenCanvas=="function"?new OffscreenCanvas(1,1):typeof document<"u"?document.createElement("canvas"):null;if(!te)throw new Error("OffscreenCanvas or DOM canvas not supported");k=T=te.getContext("webgl",{depth:!1})}F(k);var H=new Uint8Array(K*q*4);h(k,function(D){var he=D.gl,Pe=D.withTexture,Ue=D.withTextureFramebuffer;Pe("readable",function(fe,ye){he.texImage2D(he.TEXTURE_2D,0,he.RGBA,K,q,0,he.RGBA,he.UNSIGNED_BYTE,null),Ue(fe,ye,function(Me){I(K,q,N,V,ne,O,he,Me,0,0,0),he.readPixels(0,0,K,q,he.RGBA,he.UNSIGNED_BYTE,H)})})});for(var ae=new Uint8Array(K*q),pe=0,ve=0;pe<H.length;pe+=4)ae[ve++]=H[pe];return ae}function A(K,q,N,V,ne,O,k,te,H,ae){O===void 0&&(O=1),te===void 0&&(te=0),H===void 0&&(H=0),ae===void 0&&(ae=0),I(K,q,N,V,ne,O,k,null,te,H,ae)}function I(K,q,N,V,ne,O,k,te,H,ae,pe){O===void 0&&(O=1),H===void 0&&(H=0),ae===void 0&&(ae=0),pe===void 0&&(pe=0),F(k);var ve=[];r(N,function(D,he,Pe,Ue){ve.push(D,he,Pe,Ue)}),ve=new Float32Array(ve),h(k,function(D){var he=D.gl,Pe=D.isWebGL2,Ue=D.getExtension,fe=D.withProgram,ye=D.withTexture,Me=D.withTextureFramebuffer,de=D.handleContextLoss;if(ye("rawDistances",function(Ce,P){(K!==Ce._lastWidth||q!==Ce._lastHeight)&&he.texImage2D(he.TEXTURE_2D,0,he.RGBA,Ce._lastWidth=K,Ce._lastHeight=q,0,he.RGBA,he.UNSIGNED_BYTE,null),fe("main",v,b,function(x){var X=x.setAttribute,Z=x.setUniform,re=!Pe&&Ue("ANGLE_instanced_arrays"),Q=!Pe&&Ue("EXT_blend_minmax");X("aUV",2,he.STATIC_DRAW,0,w),X("aLineSegment",4,he.DYNAMIC_DRAW,1,ve),Z.apply(void 0,["4f","uGlyphBounds"].concat(V)),Z("1f","uMaxDistance",ne),Z("1f","uExponent",O),Me(Ce,P,function(Te){he.enable(he.BLEND),he.colorMask(!0,!0,!0,!0),he.viewport(0,0,K,q),he.scissor(0,0,K,q),he.blendFunc(he.ONE,he.ONE),he.blendEquationSeparate(he.FUNC_ADD,Pe?he.MAX:Q.MAX_EXT),he.clear(he.COLOR_BUFFER_BIT),Pe?he.drawArraysInstanced(he.TRIANGLES,0,3,ve.length/4):re.drawArraysInstancedANGLE(he.TRIANGLES,0,3,ve.length/4)})}),fe("post",o,R,function(x){x.setAttribute("aUV",2,he.STATIC_DRAW,0,w),x.setUniform("1i","tex",P),he.bindFramebuffer(he.FRAMEBUFFER,te),he.disable(he.BLEND),he.colorMask(pe===0,pe===1,pe===2,pe===3),he.viewport(H,ae,K,q),he.scissor(H,ae,K,q),he.drawArrays(he.TRIANGLES,0,3)})}),he.isContextLost())throw de(),new Error("webgl context lost")})}function z(K){var q=!K||K===T?E:K.canvas||K,N=y.get(q);if(N===void 0){U=!0;var V=null;try{var ne=[97,106,97,61,99,137,118,80,80,118,137,99,61,97,106,97],O=L(4,4,"M8,8L16,8L24,24L16,24Z",[0,0,32,32],24,1,K);N=O&&ne.length===O.length&&O.every(function(k,te){return k===ne[te]}),N||(V="bad trial run results",console.info(ne,O))}catch(k){N=!1,V=k.message}V&&console.warn("WebGL SDF generation not supported:",V),U=!1,y.set(q,N)}return N}var B=Object.freeze({__proto__:null,generate:L,generateIntoCanvas:A,generateIntoFramebuffer:I,isSupported:z});function ie(K,q,N,V,ne,O){ne===void 0&&(ne=Math.max(V[2]-V[0],V[3]-V[1])/2),O===void 0&&(O=1);try{return L.apply(B,arguments)}catch(k){return console.info("WebGL SDF generation failed, falling back to JS",k),g.apply(S,arguments)}}function j(K,q,N,V,ne,O,k,te,H,ae){ne===void 0&&(ne=Math.max(V[2]-V[0],V[3]-V[1])/2),O===void 0&&(O=1),te===void 0&&(te=0),H===void 0&&(H=0),ae===void 0&&(ae=0);try{return A.apply(B,arguments)}catch(pe){return console.info("WebGL SDF generation failed, falling back to JS",pe),_.apply(S,arguments)}}return e.forEachPathCommand=i,e.generate=ie,e.generateIntoCanvas=j,e.javascript=S,e.pathToLineSegments=r,e.webgl=B,e.webglUtils=f,Object.defineProperty(e,"__esModule",{value:!0}),e}({});return s}function yv(){var s=function(e){var t={R:"13k,1a,2,3,3,2+1j,ch+16,a+1,5+2,2+n,5,a,4,6+16,4+3,h+1b,4mo,179q,2+9,2+11,2i9+7y,2+68,4,3+4,5+13,4+3,2+4k,3+29,8+cf,1t+7z,w+17,3+3m,1t+3z,16o1+5r,8+30,8+mc,29+1r,29+4v,75+73",EN:"1c+9,3d+1,6,187+9,513,4+5,7+9,sf+j,175h+9,qw+q,161f+1d,4xt+a,25i+9",ES:"17,2,6dp+1,f+1,av,16vr,mx+1,4o,2",ET:"z+2,3h+3,b+1,ym,3e+1,2o,p4+1,8,6u,7c,g6,1wc,1n9+4,30+1b,2n,6d,qhx+1,h0m,a+1,49+2,63+1,4+1,6bb+3,12jj",AN:"16o+5,2j+9,2+1,35,ed,1ff2+9,87+u",CS:"18,2+1,b,2u,12k,55v,l,17v0,2,3,53,2+1,b",B:"a,3,f+2,2v,690",S:"9,2,k",WS:"c,k,4f4,1vk+a,u,1j,335",ON:"x+1,4+4,h+5,r+5,r+3,z,5+3,2+1,2+1,5,2+2,3+4,o,w,ci+1,8+d,3+d,6+8,2+g,39+1,9,6+1,2,33,b8,3+1,3c+1,7+1,5r,b,7h+3,sa+5,2,3i+6,jg+3,ur+9,2v,ij+1,9g+9,7+a,8m,4+1,49+x,14u,2+2,c+2,e+2,e+2,e+1,i+n,e+e,2+p,u+2,e+2,36+1,2+3,2+1,b,2+2,6+5,2,2,2,h+1,5+4,6+3,3+f,16+2,5+3l,3+81,1y+p,2+40,q+a,m+13,2r+ch,2+9e,75+hf,3+v,2+2w,6e+5,f+6,75+2a,1a+p,2+2g,d+5x,r+b,6+3,4+o,g,6+1,6+2,2k+1,4,2j,5h+z,1m+1,1e+f,t+2,1f+e,d+3,4o+3,2s+1,w,535+1r,h3l+1i,93+2,2s,b+1,3l+x,2v,4g+3,21+3,kz+1,g5v+1,5a,j+9,n+v,2,3,2+8,2+1,3+2,2,3,46+1,4+4,h+5,r+5,r+a,3h+2,4+6,b+4,78,1r+24,4+c,4,1hb,ey+6,103+j,16j+c,1ux+7,5+g,fsh,jdq+1t,4,57+2e,p1,1m,1m,1m,1m,4kt+1,7j+17,5+2r,d+e,3+e,2+e,2+10,m+4,w,1n+5,1q,4z+5,4b+rb,9+c,4+c,4+37,d+2g,8+b,l+b,5+1j,9+9,7+13,9+t,3+1,27+3c,2+29,2+3q,d+d,3+4,4+2,6+6,a+o,8+6,a+2,e+6,16+42,2+1i",BN:"0+8,6+d,2s+5,2+p,e,4m9,1kt+2,2b+5,5+5,17q9+v,7k,6p+8,6+1,119d+3,440+7,96s+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+75,6p+2rz,1ben+1,1ekf+1,1ekf+1",NSM:"lc+33,7o+6,7c+18,2,2+1,2+1,2,21+a,1d+k,h,2u+6,3+5,3+1,2+3,10,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,g+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+g,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,k1+w,2db+2,3y,2p+v,ff+3,30+1,n9x+3,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,r2,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+5,3+1,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2d+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,f0c+4,1o+6,t5,1s+3,2a,f5l+1,43t+2,i+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,gzhy+6n",AL:"16w,3,2,e+1b,z+2,2+2s,g+1,8+1,b+m,2+t,s+2i,c+e,4h+f,1d+1e,1bwe+dp,3+3z,x+c,2+1,35+3y,2rm+z,5+7,b+5,dt+l,c+u,17nl+27,1t+27,4x+6n,3+d",LRO:"6ct",RLO:"6cu",LRE:"6cq",RLE:"6cr",PDF:"6cs",LRI:"6ee",RLI:"6ef",FSI:"6eg",PDI:"6eh"},n={},i={};n.L=1,i[1]="L",Object.keys(t).forEach(function(de,Ce){n[de]=1<<Ce+1,i[n[de]]=de}),Object.freeze(n);var r=n.LRI|n.RLI|n.FSI,o=n.L|n.R|n.AL,a=n.B|n.S|n.WS|n.ON|n.FSI|n.LRI|n.RLI|n.PDI,l=n.BN|n.RLE|n.LRE|n.RLO|n.LRO|n.PDF,c=n.S|n.WS|n.B|r|n.PDI|l,h=null;function d(){if(!h){h=new Map;var de=function(P){if(t.hasOwnProperty(P)){var x=0;t[P].split(",").forEach(function(X){var Z=X.split("+"),re=Z[0],Q=Z[1];re=parseInt(re,36),Q=Q?parseInt(Q,36):0,h.set(x+=re,n[P]);for(var Te=0;Te<Q;Te++)h.set(++x,n[P])})}};for(var Ce in t)de(Ce)}}function u(de){return d(),h.get(de.codePointAt(0))||n.L}function f(de){return i[u(de)]}var g={pairs:"14>1,1e>2,u>2,2wt>1,1>1,1ge>1,1wp>1,1j>1,f>1,hm>1,1>1,u>1,u6>1,1>1,+5,28>1,w>1,1>1,+3,b8>1,1>1,+3,1>3,-1>-1,3>1,1>1,+2,1s>1,1>1,x>1,th>1,1>1,+2,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,4q>1,1e>2,u>2,2>1,+1",canonical:"6f1>-6dx,6dy>-6dx,6ec>-6ed,6ee>-6ed,6ww>2jj,-2ji>2jj,14r4>-1e7l,1e7m>-1e7l,1e7m>-1e5c,1e5d>-1e5b,1e5c>-14qx,14qy>-14qx,14vn>-1ecg,1ech>-1ecg,1edu>-1ecg,1eci>-1ecg,1eda>-1ecg,1eci>-1ecg,1eci>-168q,168r>-168q,168s>-14ye,14yf>-14ye"};function _(de,Ce){var P=36,x=0,X=new Map,Z=Ce&&new Map,re;return de.split(",").forEach(function Q(Te){if(Te.indexOf("+")!==-1)for(var le=+Te;le--;)Q(re);else{re=Te;var ce=Te.split(">"),Se=ce[0],ue=ce[1];Se=String.fromCodePoint(x+=parseInt(Se,P)),ue=String.fromCodePoint(x+=parseInt(ue,P)),X.set(Se,ue),Ce&&Z.set(ue,Se)}}),{map:X,reverseMap:Z}}var p,m,S;function v(){if(!p){var de=_(g.pairs,!0),Ce=de.map,P=de.reverseMap;p=Ce,m=P,S=_(g.canonical,!1).map}}function b(de){return v(),p.get(de)||null}function R(de){return v(),m.get(de)||null}function w(de){return v(),S.get(de)||null}var T=n.L,U=n.R,E=n.EN,y=n.ES,F=n.ET,L=n.AN,A=n.CS,I=n.B,z=n.S,B=n.ON,ie=n.BN,j=n.NSM,K=n.AL,q=n.LRO,N=n.RLO,V=n.LRE,ne=n.RLE,O=n.PDF,k=n.LRI,te=n.RLI,H=n.FSI,ae=n.PDI;function pe(de,Ce){for(var P=125,x=new Uint32Array(de.length),X=0;X<de.length;X++)x[X]=u(de[X]);var Z=new Map;function re(Pt,Zt){var Ut=x[Pt];x[Pt]=Zt,Z.set(Ut,Z.get(Ut)-1),Ut&a&&Z.set(a,Z.get(a)-1),Z.set(Zt,(Z.get(Zt)||0)+1),Zt&a&&Z.set(a,(Z.get(a)||0)+1)}for(var Q=new Uint8Array(de.length),Te=new Map,le=[],ce=null,Se=0;Se<de.length;Se++)ce||le.push(ce={start:Se,end:de.length-1,level:Ce==="rtl"?1:Ce==="ltr"?0:da(Se,!1)}),x[Se]&I&&(ce.end=Se,ce=null);for(var ue=ne|V|N|q|r|ae|O|I,be=function(Pt){return Pt+(Pt&1?1:2)},Be=function(Pt){return Pt+(Pt&1?2:1)},we=0;we<le.length;we++){ce=le[we];var me=[{_level:ce.level,_override:0,_isolate:0}],xe=void 0,Ne=0,We=0,M=0;Z.clear();for(var $=ce.start;$<=ce.end;$++){var G=x[$];if(xe=me[me.length-1],Z.set(G,(Z.get(G)||0)+1),G&a&&Z.set(a,(Z.get(a)||0)+1),G&ue)if(G&(ne|V)){Q[$]=xe._level;var ee=(G===ne?Be:be)(xe._level);ee<=P&&!Ne&&!We?me.push({_level:ee,_override:0,_isolate:0}):Ne||We++}else if(G&(N|q)){Q[$]=xe._level;var ge=(G===N?Be:be)(xe._level);ge<=P&&!Ne&&!We?me.push({_level:ge,_override:G&N?U:T,_isolate:0}):Ne||We++}else if(G&r){G&H&&(G=da($+1,!0)===1?te:k),Q[$]=xe._level,xe._override&&re($,xe._override);var Ae=(G===te?Be:be)(xe._level);Ae<=P&&Ne===0&&We===0?(M++,me.push({_level:Ae,_override:0,_isolate:1,_isolInitIndex:$})):Ne++}else if(G&ae){if(Ne>0)Ne--;else if(M>0){for(We=0;!me[me.length-1]._isolate;)me.pop();var Re=me[me.length-1]._isolInitIndex;Re!=null&&(Te.set(Re,$),Te.set($,Re)),me.pop(),M--}xe=me[me.length-1],Q[$]=xe._level,xe._override&&re($,xe._override)}else G&O?(Ne===0&&(We>0?We--:!xe._isolate&&me.length>1&&(me.pop(),xe=me[me.length-1])),Q[$]=xe._level):G&I&&(Q[$]=ce.level);else Q[$]=xe._level,xe._override&&G!==ie&&re($,xe._override)}for(var je=[],Xe=null,De=ce.start;De<=ce.end;De++){var Ye=x[De];if(!(Ye&l)){var Je=Q[De],tt=Ye&r,$e=Ye===ae;Xe&&Je===Xe._level?(Xe._end=De,Xe._endsWithIsolInit=tt):je.push(Xe={_start:De,_end:De,_level:Je,_startsWithPDI:$e,_endsWithIsolInit:tt})}}for(var lt=[],St=0;St<je.length;St++){var gt=je[St];if(!gt._startsWithPDI||gt._startsWithPDI&&!Te.has(gt._start)){for(var qt=[Xe=gt],Ht=void 0;Xe&&Xe._endsWithIsolInit&&(Ht=Te.get(Xe._end))!=null;)for(var Vt=St+1;Vt<je.length;Vt++)if(je[Vt]._start===Ht){qt.push(Xe=je[Vt]);break}for(var ft=[],cn=0;cn<qt.length;cn++)for(var xr=qt[cn],Wi=xr._start;Wi<=xr._end;Wi++)ft.push(Wi);for(var C=Q[ft[0]],Y=ce.level,se=ft[0]-1;se>=0;se--)if(!(x[se]&l)){Y=Q[se];break}var oe=ft[ft.length-1],J=Q[oe],Ee=ce.level;if(!(x[oe]&r)){for(var Ie=oe+1;Ie<=ce.end;Ie++)if(!(x[Ie]&l)){Ee=Q[Ie];break}}lt.push({_seqIndices:ft,_sosType:Math.max(Y,C)%2?U:T,_eosType:Math.max(Ee,J)%2?U:T})}}for(var Fe=0;Fe<lt.length;Fe++){var ke=lt[Fe],_e=ke._seqIndices,Ge=ke._sosType,He=ke._eosType,Ze=Q[_e[0]]&1?U:T;if(Z.get(j))for(var rt=0;rt<_e.length;rt++){var st=_e[rt];if(x[st]&j){for(var _t=Ge,Qe=rt-1;Qe>=0;Qe--)if(!(x[_e[Qe]]&l)){_t=x[_e[Qe]];break}re(st,_t&(r|ae)?B:_t)}}if(Z.get(E))for(var ze=0;ze<_e.length;ze++){var pt=_e[ze];if(x[pt]&E)for(var et=ze-1;et>=-1;et--){var Wt=et===-1?Ge:x[_e[et]];if(Wt&o){Wt===K&&re(pt,L);break}}}if(Z.get(K))for(var Mn=0;Mn<_e.length;Mn++){var tn=_e[Mn];x[tn]&K&&re(tn,U)}if(Z.get(y)||Z.get(A))for(var hn=1;hn<_e.length-1;hn++){var at=_e[hn];if(x[at]&(y|A)){for(var wt=0,kn=0,Mt=hn-1;Mt>=0&&(wt=x[_e[Mt]],!!(wt&l));Mt--);for(var zn=hn+1;zn<_e.length&&(kn=x[_e[zn]],!!(kn&l));zn++);wt===kn&&(x[at]===y?wt===E:wt&(E|L))&&re(at,wt)}}if(Z.get(E))for(var Xt=0;Xt<_e.length;Xt++){var yr=_e[Xt];if(x[yr]&E){for(var Sr=Xt-1;Sr>=0&&x[_e[Sr]]&(F|l);Sr--)re(_e[Sr],E);for(Xt++;Xt<_e.length&&x[_e[Xt]]&(F|l|E);Xt++)x[_e[Xt]]!==E&&re(_e[Xt],E)}}if(Z.get(F)||Z.get(y)||Z.get(A))for(var Xi=0;Xi<_e.length;Xi++){var $o=_e[Xi];if(x[$o]&(F|y|A)){re($o,B);for(var Mr=Xi-1;Mr>=0&&x[_e[Mr]]&l;Mr--)re(_e[Mr],B);for(var br=Xi+1;br<_e.length&&x[_e[br]]&l;br++)re(_e[br],B)}}if(Z.get(E))for(var Rs=0,ea=Ge;Rs<_e.length;Rs++){var ta=_e[Rs],Ps=x[ta];Ps&E?ea===T&&re(ta,T):Ps&o&&(ea=Ps)}if(Z.get(a)){var Yi=U|E|L,na=Yi|T,Er=[];{for(var si=[],oi=0;oi<_e.length;oi++)if(x[_e[oi]]&a){var ji=de[_e[oi]],ia=void 0;if(b(ji)!==null)if(si.length<63)si.push({char:ji,seqIndex:oi});else break;else if((ia=R(ji))!==null)for(var qi=si.length-1;qi>=0;qi--){var Us=si[qi].char;if(Us===ia||Us===R(w(ji))||b(w(Us))===ji){Er.push([si[qi].seqIndex,oi]),si.length=qi;break}}}Er.sort(function(Pt,Zt){return Pt[0]-Zt[0]})}for(var Ls=0;Ls<Er.length;Ls++){for(var ra=Er[Ls],Tr=ra[0],Ds=ra[1],sa=!1,Kt=0,Is=Tr+1;Is<Ds;Is++){var oa=_e[Is];if(x[oa]&na){sa=!0;var aa=x[oa]&Yi?U:T;if(aa===Ze){Kt=aa;break}}}if(sa&&!Kt){Kt=Ge;for(var Fs=Tr-1;Fs>=0;Fs--){var la=_e[Fs];if(x[la]&na){var ca=x[la]&Yi?U:T;ca!==Ze?Kt=ca:Kt=Ze;break}}}if(Kt){if(x[_e[Tr]]=x[_e[Ds]]=Kt,Kt!==Ze){for(var Ki=Tr+1;Ki<_e.length;Ki++)if(!(x[_e[Ki]]&l)){u(de[_e[Ki]])&j&&(x[_e[Ki]]=Kt);break}}if(Kt!==Ze){for(var Zi=Ds+1;Zi<_e.length;Zi++)if(!(x[_e[Zi]]&l)){u(de[_e[Zi]])&j&&(x[_e[Zi]]=Kt);break}}}}for(var bn=0;bn<_e.length;bn++)if(x[_e[bn]]&a){for(var ha=bn,Ns=bn,Os=Ge,Ji=bn-1;Ji>=0;Ji--)if(x[_e[Ji]]&l)ha=Ji;else{Os=x[_e[Ji]]&Yi?U:T;break}for(var ua=He,Qi=bn+1;Qi<_e.length;Qi++)if(x[_e[Qi]]&(a|l))Ns=Qi;else{ua=x[_e[Qi]]&Yi?U:T;break}for(var Bs=ha;Bs<=Ns;Bs++)x[_e[Bs]]=Os===ua?Os:Ze;bn=Ns}}}for(var Nt=ce.start;Nt<=ce.end;Nt++){var Dh=Q[Nt],wr=x[Nt];if(Dh&1?wr&(T|E|L)&&Q[Nt]++:wr&U?Q[Nt]++:wr&(L|E)&&(Q[Nt]+=2),wr&l&&(Q[Nt]=Nt===0?ce.level:Q[Nt-1]),Nt===ce.end||u(de[Nt])&(z|I))for(var Ar=Nt;Ar>=0&&u(de[Ar])&c;Ar--)Q[Ar]=ce.level}}return{levels:Q,paragraphs:le};function da(Pt,Zt){for(var Ut=Pt;Ut<de.length;Ut++){var En=x[Ut];if(En&(U|K))return 1;if(En&(I|T)||Zt&&En===ae)return 0;if(En&r){var fa=Ih(Ut);Ut=fa===-1?de.length:fa}}return 0}function Ih(Pt){for(var Zt=1,Ut=Pt+1;Ut<de.length;Ut++){var En=x[Ut];if(En&I)break;if(En&ae){if(--Zt===0)return Ut}else En&r&&Zt++}return-1}}var ve="14>1,j>2,t>2,u>2,1a>g,2v3>1,1>1,1ge>1,1wd>1,b>1,1j>1,f>1,ai>3,-2>3,+1,8>1k0,-1jq>1y7,-1y6>1hf,-1he>1h6,-1h5>1ha,-1h8>1qi,-1pu>1,6>3u,-3s>7,6>1,1>1,f>1,1>1,+2,3>1,1>1,+13,4>1,1>1,6>1eo,-1ee>1,3>1mg,-1me>1mk,-1mj>1mi,-1mg>1mi,-1md>1,1>1,+2,1>10k,-103>1,1>1,4>1,5>1,1>1,+10,3>1,1>8,-7>8,+1,-6>7,+1,a>1,1>1,u>1,u6>1,1>1,+5,26>1,1>1,2>1,2>2,8>1,7>1,4>1,1>1,+5,b8>1,1>1,+3,1>3,-2>1,2>1,1>1,+2,c>1,3>1,1>1,+2,h>1,3>1,a>1,1>1,2>1,3>1,1>1,d>1,f>1,3>1,1a>1,1>1,6>1,7>1,13>1,k>1,1>1,+19,4>1,1>1,+2,2>1,1>1,+18,m>1,a>1,1>1,lk>1,1>1,4>1,2>1,f>1,3>1,1>1,+3,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,6>1,4j>1,j>2,t>2,u>2,2>1,+1",D;function he(){if(!D){var de=_(ve,!0),Ce=de.map,P=de.reverseMap;P.forEach(function(x,X){Ce.set(X,x)}),D=Ce}}function Pe(de){return he(),D.get(de)||null}function Ue(de,Ce,P,x){var X=de.length;P=Math.max(0,P==null?0:+P),x=Math.min(X-1,x==null?X-1:+x);for(var Z=new Map,re=P;re<=x;re++)if(Ce[re]&1){var Q=Pe(de[re]);Q!==null&&Z.set(re,Q)}return Z}function fe(de,Ce,P,x){var X=de.length;P=Math.max(0,P==null?0:+P),x=Math.min(X-1,x==null?X-1:+x);var Z=[];return Ce.paragraphs.forEach(function(re){var Q=Math.max(P,re.start),Te=Math.min(x,re.end);if(Q<Te){for(var le=Ce.levels.slice(Q,Te+1),ce=Te;ce>=Q&&u(de[ce])&c;ce--)le[ce]=re.level;for(var Se=re.level,ue=1/0,be=0;be<le.length;be++){var Be=le[be];Be>Se&&(Se=Be),Be<ue&&(ue=Be|1)}for(var we=Se;we>=ue;we--)for(var me=0;me<le.length;me++)if(le[me]>=we){for(var xe=me;me+1<le.length&&le[me+1]>=we;)me++;me>xe&&Z.push([xe+Q,me+Q])}}}),Z}function ye(de,Ce,P,x){var X=Me(de,Ce,P,x),Z=[].concat(de);return X.forEach(function(re,Q){Z[Q]=(Ce.levels[re]&1?Pe(de[re]):null)||de[re]}),Z.join("")}function Me(de,Ce,P,x){for(var X=fe(de,Ce,P,x),Z=[],re=0;re<de.length;re++)Z[re]=re;return X.forEach(function(Q){for(var Te=Q[0],le=Q[1],ce=Z.slice(Te,le+1),Se=ce.length;Se--;)Z[le-Se]=ce[Se]}),Z}return e.closingToOpeningBracket=R,e.getBidiCharType=u,e.getBidiCharTypeName=f,e.getCanonicalBracket=w,e.getEmbeddingLevels=pe,e.getMirroredCharacter=Pe,e.getMirroredCharactersMap=Ue,e.getReorderSegments=fe,e.getReorderedIndices=Me,e.getReorderedString=ye,e.openingToClosingBracket=b,Object.defineProperty(e,"__esModule",{value:!0}),e}({});return s}const Sh=/\bvoid\s+main\s*\(\s*\)\s*{/g;function zo(s){const e=/^[ \t]*#include +<([\w\d./]+)>/gm;function t(n,i){let r=qe[i];return r?zo(r):n}return s.replace(e,t)}const vt=[];for(let s=0;s<256;s++)vt[s]=(s<16?"0":"")+s.toString(16);function Sv(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(vt[s&255]+vt[s>>8&255]+vt[s>>16&255]+vt[s>>24&255]+"-"+vt[e&255]+vt[e>>8&255]+"-"+vt[e>>16&15|64]+vt[e>>24&255]+"-"+vt[t&63|128]+vt[t>>8&255]+"-"+vt[t>>16&255]+vt[t>>24&255]+vt[n&255]+vt[n>>8&255]+vt[n>>16&255]+vt[n>>24&255]).toUpperCase()}const jn=Object.assign||function(){let s=arguments[0];for(let e=1,t=arguments.length;e<t;e++){let n=arguments[e];if(n)for(let i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=n[i])}return s},Mv=Date.now(),lc=new WeakMap,cc=new Map;let bv=1e10;function Go(s,e){const t=Av(e);let n=lc.get(s);if(n||lc.set(s,n=Object.create(null)),n[t])return new n[t];const i=`_onBeforeCompile${t}`,r=function(c,h){s.onBeforeCompile.call(this,c,h);const d=this.customProgramCacheKey()+"|"+c.vertexShader+"|"+c.fragmentShader;let u=cc[d];if(!u){const f=Ev(this,c,e,t);u=cc[d]=f}c.vertexShader=u.vertexShader,c.fragmentShader=u.fragmentShader,jn(c.uniforms,this.uniforms),e.timeUniform&&(c.uniforms[e.timeUniform]={get value(){return Date.now()-Mv}}),this[i]&&this[i](c)},o=function(){return a(e.chained?s:s.clone())},a=function(c){const h=Object.create(c,l);return Object.defineProperty(h,"baseMaterial",{value:s}),Object.defineProperty(h,"id",{value:bv++}),h.uuid=Sv(),h.uniforms=jn({},c.uniforms,e.uniforms),h.defines=jn({},c.defines,e.defines),h.defines[`TROIKA_DERIVED_MATERIAL_${t}`]="",h.extensions=jn({},c.extensions,e.extensions),h._listeners=void 0,h},l={constructor:{value:o},isDerivedMaterial:{value:!0},type:{get:()=>s.type,set:c=>{s.type=c}},isDerivedFrom:{writable:!0,configurable:!0,value:function(c){const h=this.baseMaterial;return c===h||h.isDerivedMaterial&&h.isDerivedFrom(c)||!1}},customProgramCacheKey:{writable:!0,configurable:!0,value:function(){return s.customProgramCacheKey()+"|"+t}},onBeforeCompile:{get(){return r},set(c){this[i]=c}},copy:{writable:!0,configurable:!0,value:function(c){return s.copy.call(this,c),!s.isShaderMaterial&&!s.isDerivedMaterial&&(jn(this.extensions,c.extensions),jn(this.defines,c.defines),jn(this.uniforms,pr.clone(c.uniforms))),this}},clone:{writable:!0,configurable:!0,value:function(){const c=new s.constructor;return a(c).copy(this)}},getDepthMaterial:{writable:!0,configurable:!0,value:function(){let c=this._depthMaterial;return c||(c=this._depthMaterial=Go(s.isDerivedMaterial?s.getDepthMaterial():new lh({depthPacking:Hc}),e),c.defines.IS_DEPTH_MATERIAL="",c.uniforms=this.uniforms),c}},getDistanceMaterial:{writable:!0,configurable:!0,value:function(){let c=this._distanceMaterial;return c||(c=this._distanceMaterial=Go(s.isDerivedMaterial?s.getDistanceMaterial():new ch,e),c.defines.IS_DISTANCE_MATERIAL="",c.uniforms=this.uniforms),c}},dispose:{writable:!0,configurable:!0,value(){const{_depthMaterial:c,_distanceMaterial:h}=this;c&&c.dispose(),h&&h.dispose(),s.dispose.call(this)}}};return n[t]=o,new o}function Ev(s,{vertexShader:e,fragmentShader:t},n,i){let{vertexDefs:r,vertexMainIntro:o,vertexMainOutro:a,vertexTransform:l,fragmentDefs:c,fragmentMainIntro:h,fragmentMainOutro:d,fragmentColorTransform:u,customRewriter:f,timeUniform:g}=n;if(r=r||"",o=o||"",a=a||"",c=c||"",h=h||"",d=d||"",(l||f)&&(e=zo(e)),(u||f)&&(t=t.replace(/^[ \t]*#include <((?:tonemapping|encodings|colorspace|fog|premultiplied_alpha|dithering)_fragment)>/gm,`
//!BEGIN_POST_CHUNK $1
$&
//!END_POST_CHUNK
`),t=zo(t)),f){let _=f({vertexShader:e,fragmentShader:t});e=_.vertexShader,t=_.fragmentShader}if(u){let _=[];t=t.replace(/^\/\/!BEGIN_POST_CHUNK[^]+?^\/\/!END_POST_CHUNK/gm,p=>(_.push(p),"")),d=`${u}
${_.join(`
`)}
${d}`}if(g){const _=`
uniform float ${g};
`;r=_+r,c=_+c}return l&&(e=`vec3 troika_position_${i};
vec3 troika_normal_${i};
vec2 troika_uv_${i};
${e}
`,r=`${r}
void troikaVertexTransform${i}(inout vec3 position, inout vec3 normal, inout vec2 uv) {
  ${l}
}
`,o=`
troika_position_${i} = vec3(position);
troika_normal_${i} = vec3(normal);
troika_uv_${i} = vec2(uv);
troikaVertexTransform${i}(troika_position_${i}, troika_normal_${i}, troika_uv_${i});
${o}
`,e=e.replace(/\b(position|normal|uv)\b/g,(_,p,m,S)=>/\battribute\s+vec[23]\s+$/.test(S.substr(0,m))?p:`troika_${p}_${i}`),s.map&&s.map.channel>0||(e=e.replace(/\bMAP_UV\b/g,`troika_uv_${i}`))),e=hc(e,i,r,o,a),t=hc(t,i,c,h,d),{vertexShader:e,fragmentShader:t}}function hc(s,e,t,n,i){return(n||i||t)&&(s=s.replace(Sh,`
${t}
void troikaOrigMain${e}() {`),s+=`
void main() {
  ${n}
  troikaOrigMain${e}();
  ${i}
}`),s}function Tv(s,e){return s==="uniforms"?void 0:typeof e=="function"?e.toString():e}let wv=0;const uc=new Map;function Av(s){const e=JSON.stringify(s,Tv);let t=uc.get(e);return t==null&&uc.set(e,t=++wv),t}/*!
Custom build of Typr.ts (https://github.com/fredli74/Typr.ts) for use in Troika text rendering.
Original MIT license applies: https://github.com/fredli74/Typr.ts/blob/master/LICENSE
*/function Cv(){return typeof window>"u"&&(self.window=self),function(s){var e={parse:function(i){var r=e._bin,o=new Uint8Array(i);if(r.readASCII(o,0,4)=="ttcf"){var a=4;r.readUshort(o,a),a+=2,r.readUshort(o,a),a+=2;var l=r.readUint(o,a);a+=4;for(var c=[],h=0;h<l;h++){var d=r.readUint(o,a);a+=4,c.push(e._readFont(o,d))}return c}return[e._readFont(o,0)]},_readFont:function(i,r){var o=e._bin,a=r;o.readFixed(i,r),r+=4;var l=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2;for(var c=["cmap","head","hhea","maxp","hmtx","name","OS/2","post","loca","glyf","kern","CFF ","GDEF","GPOS","GSUB","SVG "],h={_data:i,_offset:a},d={},u=0;u<l;u++){var f=o.readASCII(i,r,4);r+=4,o.readUint(i,r),r+=4;var g=o.readUint(i,r);r+=4;var _=o.readUint(i,r);r+=4,d[f]={offset:g,length:_}}for(u=0;u<c.length;u++){var p=c[u];d[p]&&(h[p.trim()]=e[p.trim()].parse(i,d[p].offset,d[p].length,h))}return h},_tabOffset:function(i,r,o){for(var a=e._bin,l=a.readUshort(i,o+4),c=o+12,h=0;h<l;h++){var d=a.readASCII(i,c,4);c+=4,a.readUint(i,c),c+=4;var u=a.readUint(i,c);if(c+=4,a.readUint(i,c),c+=4,d==r)return u}return 0}};e._bin={readFixed:function(i,r){return(i[r]<<8|i[r+1])+(i[r+2]<<8|i[r+3])/65540},readF2dot14:function(i,r){return e._bin.readShort(i,r)/16384},readInt:function(i,r){return e._bin._view(i).getInt32(r)},readInt8:function(i,r){return e._bin._view(i).getInt8(r)},readShort:function(i,r){return e._bin._view(i).getInt16(r)},readUshort:function(i,r){return e._bin._view(i).getUint16(r)},readUshorts:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(e._bin.readUshort(i,r+2*l));return a},readUint:function(i,r){return e._bin._view(i).getUint32(r)},readUint64:function(i,r){return 4294967296*e._bin.readUint(i,r)+e._bin.readUint(i,r+4)},readASCII:function(i,r,o){for(var a="",l=0;l<o;l++)a+=String.fromCharCode(i[r+l]);return a},readUnicode:function(i,r,o){for(var a="",l=0;l<o;l++){var c=i[r++]<<8|i[r++];a+=String.fromCharCode(c)}return a},_tdec:typeof window<"u"&&window.TextDecoder?new window.TextDecoder:null,readUTF8:function(i,r,o){var a=e._bin._tdec;return a&&r==0&&o==i.length?a.decode(i):e._bin.readASCII(i,r,o)},readBytes:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(i[r+l]);return a},readASCIIArray:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(String.fromCharCode(i[r+l]));return a},_view:function(i){return i._dataView||(i._dataView=i.buffer?new DataView(i.buffer,i.byteOffset,i.byteLength):new DataView(new Uint8Array(i).buffer))}},e._lctf={},e._lctf.parse=function(i,r,o,a,l){var c=e._bin,h={},d=r;c.readFixed(i,r),r+=4;var u=c.readUshort(i,r);r+=2;var f=c.readUshort(i,r);r+=2;var g=c.readUshort(i,r);return r+=2,h.scriptList=e._lctf.readScriptList(i,d+u),h.featureList=e._lctf.readFeatureList(i,d+f),h.lookupList=e._lctf.readLookupList(i,d+g,l),h},e._lctf.readLookupList=function(i,r,o){var a=e._bin,l=r,c=[],h=a.readUshort(i,r);r+=2;for(var d=0;d<h;d++){var u=a.readUshort(i,r);r+=2;var f=e._lctf.readLookupTable(i,l+u,o);c.push(f)}return c},e._lctf.readLookupTable=function(i,r,o){var a=e._bin,l=r,c={tabs:[]};c.ltype=a.readUshort(i,r),r+=2,c.flag=a.readUshort(i,r),r+=2;var h=a.readUshort(i,r);r+=2;for(var d=c.ltype,u=0;u<h;u++){var f=a.readUshort(i,r);r+=2;var g=o(i,d,l+f,c);c.tabs.push(g)}return c},e._lctf.numOfOnes=function(i){for(var r=0,o=0;o<32;o++)i>>>o&1&&r++;return r},e._lctf.readClassDef=function(i,r){var o=e._bin,a=[],l=o.readUshort(i,r);if(r+=2,l==1){var c=o.readUshort(i,r);r+=2;var h=o.readUshort(i,r);r+=2;for(var d=0;d<h;d++)a.push(c+d),a.push(c+d),a.push(o.readUshort(i,r)),r+=2}if(l==2){var u=o.readUshort(i,r);for(r+=2,d=0;d<u;d++)a.push(o.readUshort(i,r)),r+=2,a.push(o.readUshort(i,r)),r+=2,a.push(o.readUshort(i,r)),r+=2}return a},e._lctf.getInterval=function(i,r){for(var o=0;o<i.length;o+=3){var a=i[o],l=i[o+1];if(i[o+2],a<=r&&r<=l)return o}return-1},e._lctf.readCoverage=function(i,r){var o=e._bin,a={};a.fmt=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);return r+=2,a.fmt==1&&(a.tab=o.readUshorts(i,r,l)),a.fmt==2&&(a.tab=o.readUshorts(i,r,3*l)),a},e._lctf.coverageIndex=function(i,r){var o=i.tab;if(i.fmt==1)return o.indexOf(r);if(i.fmt==2){var a=e._lctf.getInterval(o,r);if(a!=-1)return o[a+2]+(r-o[a])}return-1},e._lctf.readFeatureList=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=o.readASCII(i,r,4);r+=4;var u=o.readUshort(i,r);r+=2;var f=e._lctf.readFeatureTable(i,a+u);f.tag=d.trim(),l.push(f)}return l},e._lctf.readFeatureTable=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2,c>0&&(l.featureParams=a+c);var h=o.readUshort(i,r);r+=2,l.tab=[];for(var d=0;d<h;d++)l.tab.push(o.readUshort(i,r+2*d));return l},e._lctf.readScriptList=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=o.readASCII(i,r,4);r+=4;var u=o.readUshort(i,r);r+=2,l[d.trim()]=e._lctf.readScriptTable(i,a+u)}return l},e._lctf.readScriptTable=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2,c>0&&(l.default=e._lctf.readLangSysTable(i,a+c));var h=o.readUshort(i,r);r+=2;for(var d=0;d<h;d++){var u=o.readASCII(i,r,4);r+=4;var f=o.readUshort(i,r);r+=2,l[u.trim()]=e._lctf.readLangSysTable(i,a+f)}return l},e._lctf.readLangSysTable=function(i,r){var o=e._bin,a={};o.readUshort(i,r),r+=2,a.reqFeature=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);return r+=2,a.features=o.readUshorts(i,r,l),a},e.CFF={},e.CFF.parse=function(i,r,o){var a=e._bin;(i=new Uint8Array(i.buffer,r,o))[r=0],i[++r],i[++r],i[++r],r++;var l=[];r=e.CFF.readIndex(i,r,l);for(var c=[],h=0;h<l.length-1;h++)c.push(a.readASCII(i,r+l[h],l[h+1]-l[h]));r+=l[l.length-1];var d=[];r=e.CFF.readIndex(i,r,d);var u=[];for(h=0;h<d.length-1;h++)u.push(e.CFF.readDict(i,r+d[h],r+d[h+1]));r+=d[d.length-1];var f=u[0],g=[];r=e.CFF.readIndex(i,r,g);var _=[];for(h=0;h<g.length-1;h++)_.push(a.readASCII(i,r+g[h],g[h+1]-g[h]));if(r+=g[g.length-1],e.CFF.readSubrs(i,r,f),f.CharStrings){r=f.CharStrings,g=[],r=e.CFF.readIndex(i,r,g);var p=[];for(h=0;h<g.length-1;h++)p.push(a.readBytes(i,r+g[h],g[h+1]-g[h]));f.CharStrings=p}if(f.ROS){r=f.FDArray;var m=[];for(r=e.CFF.readIndex(i,r,m),f.FDArray=[],h=0;h<m.length-1;h++){var S=e.CFF.readDict(i,r+m[h],r+m[h+1]);e.CFF._readFDict(i,S,_),f.FDArray.push(S)}r+=m[m.length-1],r=f.FDSelect,f.FDSelect=[];var v=i[r];if(r++,v!=3)throw v;var b=a.readUshort(i,r);for(r+=2,h=0;h<b+1;h++)f.FDSelect.push(a.readUshort(i,r),i[r+2]),r+=3}return f.Encoding&&(f.Encoding=e.CFF.readEncoding(i,f.Encoding,f.CharStrings.length)),f.charset&&(f.charset=e.CFF.readCharset(i,f.charset,f.CharStrings.length)),e.CFF._readFDict(i,f,_),f},e.CFF._readFDict=function(i,r,o){var a;for(var l in r.Private&&(a=r.Private[1],r.Private=e.CFF.readDict(i,a,a+r.Private[0]),r.Private.Subrs&&e.CFF.readSubrs(i,a+r.Private.Subrs,r.Private)),r)["FamilyName","FontName","FullName","Notice","version","Copyright"].indexOf(l)!=-1&&(r[l]=o[r[l]-426+35])},e.CFF.readSubrs=function(i,r,o){var a=e._bin,l=[];r=e.CFF.readIndex(i,r,l);var c,h=l.length;c=h<1240?107:h<33900?1131:32768,o.Bias=c,o.Subrs=[];for(var d=0;d<l.length-1;d++)o.Subrs.push(a.readBytes(i,r+l[d],l[d+1]-l[d]))},e.CFF.tableSE=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,0,111,112,113,114,0,115,116,117,118,119,120,121,122,0,123,0,124,125,126,127,128,129,130,131,0,132,133,0,134,135,136,137,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,138,0,139,0,0,0,0,140,141,142,143,0,0,0,0,0,144,0,0,0,145,0,0,146,147,148,149,0,0,0,0],e.CFF.glyphByUnicode=function(i,r){for(var o=0;o<i.charset.length;o++)if(i.charset[o]==r)return o;return-1},e.CFF.glyphBySE=function(i,r){return r<0||r>255?-1:e.CFF.glyphByUnicode(i,e.CFF.tableSE[r])},e.CFF.readEncoding=function(i,r,o){e._bin;var a=[".notdef"],l=i[r];if(r++,l!=0)throw"error: unknown encoding format: "+l;var c=i[r];r++;for(var h=0;h<c;h++)a.push(i[r+h]);return a},e.CFF.readCharset=function(i,r,o){var a=e._bin,l=[".notdef"],c=i[r];if(r++,c==0)for(var h=0;h<o;h++){var d=a.readUshort(i,r);r+=2,l.push(d)}else{if(c!=1&&c!=2)throw"error: format: "+c;for(;l.length<o;){d=a.readUshort(i,r),r+=2;var u=0;for(c==1?(u=i[r],r++):(u=a.readUshort(i,r),r+=2),h=0;h<=u;h++)l.push(d),d++}}return l},e.CFF.readIndex=function(i,r,o){var a=e._bin,l=a.readUshort(i,r)+1,c=i[r+=2];if(r++,c==1)for(var h=0;h<l;h++)o.push(i[r+h]);else if(c==2)for(h=0;h<l;h++)o.push(a.readUshort(i,r+2*h));else if(c==3)for(h=0;h<l;h++)o.push(16777215&a.readUint(i,r+3*h-1));else if(l!=1)throw"unsupported offset size: "+c+", count: "+l;return(r+=l*c)-1},e.CFF.getCharString=function(i,r,o){var a=e._bin,l=i[r],c=i[r+1];i[r+2],i[r+3],i[r+4];var h=1,d=null,u=null;l<=20&&(d=l,h=1),l==12&&(d=100*l+c,h=2),21<=l&&l<=27&&(d=l,h=1),l==28&&(u=a.readShort(i,r+1),h=3),29<=l&&l<=31&&(d=l,h=1),32<=l&&l<=246&&(u=l-139,h=1),247<=l&&l<=250&&(u=256*(l-247)+c+108,h=2),251<=l&&l<=254&&(u=256*-(l-251)-c-108,h=2),l==255&&(u=a.readInt(i,r+1)/65535,h=5),o.val=u??"o"+d,o.size=h},e.CFF.readCharString=function(i,r,o){for(var a=r+o,l=e._bin,c=[];r<a;){var h=i[r],d=i[r+1];i[r+2],i[r+3],i[r+4];var u=1,f=null,g=null;h<=20&&(f=h,u=1),h==12&&(f=100*h+d,u=2),h!=19&&h!=20||(f=h,u=2),21<=h&&h<=27&&(f=h,u=1),h==28&&(g=l.readShort(i,r+1),u=3),29<=h&&h<=31&&(f=h,u=1),32<=h&&h<=246&&(g=h-139,u=1),247<=h&&h<=250&&(g=256*(h-247)+d+108,u=2),251<=h&&h<=254&&(g=256*-(h-251)-d-108,u=2),h==255&&(g=l.readInt(i,r+1)/65535,u=5),c.push(g??"o"+f),r+=u}return c},e.CFF.readDict=function(i,r,o){for(var a=e._bin,l={},c=[];r<o;){var h=i[r],d=i[r+1];i[r+2],i[r+3],i[r+4];var u=1,f=null,g=null;if(h==28&&(g=a.readShort(i,r+1),u=3),h==29&&(g=a.readInt(i,r+1),u=5),32<=h&&h<=246&&(g=h-139,u=1),247<=h&&h<=250&&(g=256*(h-247)+d+108,u=2),251<=h&&h<=254&&(g=256*-(h-251)-d-108,u=2),h==255)throw g=a.readInt(i,r+1)/65535,u=5,"unknown number";if(h==30){var _=[];for(u=1;;){var p=i[r+u];u++;var m=p>>4,S=15&p;if(m!=15&&_.push(m),S!=15&&_.push(S),S==15)break}for(var v="",b=[0,1,2,3,4,5,6,7,8,9,".","e","e-","reserved","-","endOfNumber"],R=0;R<_.length;R++)v+=b[_[R]];g=parseFloat(v)}h<=21&&(f=["version","Notice","FullName","FamilyName","Weight","FontBBox","BlueValues","OtherBlues","FamilyBlues","FamilyOtherBlues","StdHW","StdVW","escape","UniqueID","XUID","charset","Encoding","CharStrings","Private","Subrs","defaultWidthX","nominalWidthX"][h],u=1,h==12&&(f=["Copyright","isFixedPitch","ItalicAngle","UnderlinePosition","UnderlineThickness","PaintType","CharstringType","FontMatrix","StrokeWidth","BlueScale","BlueShift","BlueFuzz","StemSnapH","StemSnapV","ForceBold",0,0,"LanguageGroup","ExpansionFactor","initialRandomSeed","SyntheticBase","PostScript","BaseFontName","BaseFontBlend",0,0,0,0,0,0,"ROS","CIDFontVersion","CIDFontRevision","CIDFontType","CIDCount","UIDBase","FDArray","FDSelect","FontName"][d],u=2)),f!=null?(l[f]=c.length==1?c[0]:c,c=[]):c.push(g),r+=u}return l},e.cmap={},e.cmap.parse=function(i,r,o){i=new Uint8Array(i.buffer,r,o),r=0;var a=e._bin,l={};a.readUshort(i,r),r+=2;var c=a.readUshort(i,r);r+=2;var h=[];l.tables=[];for(var d=0;d<c;d++){var u=a.readUshort(i,r);r+=2;var f=a.readUshort(i,r);r+=2;var g=a.readUint(i,r);r+=4;var _="p"+u+"e"+f,p=h.indexOf(g);if(p==-1){var m;p=l.tables.length,h.push(g);var S=a.readUshort(i,g);S==0?m=e.cmap.parse0(i,g):S==4?m=e.cmap.parse4(i,g):S==6?m=e.cmap.parse6(i,g):S==12?m=e.cmap.parse12(i,g):console.debug("unknown format: "+S,u,f,g),l.tables.push(m)}if(l[_]!=null)throw"multiple tables for one platform+encoding";l[_]=p}return l},e.cmap.parse0=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2,a.map=[];for(var c=0;c<l-6;c++)a.map.push(i[r+c]);return a},e.cmap.parse4=function(i,r){var o=e._bin,a=r,l={};l.format=o.readUshort(i,r),r+=2;var c=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2;var h=o.readUshort(i,r);r+=2;var d=h/2;l.searchRange=o.readUshort(i,r),r+=2,l.entrySelector=o.readUshort(i,r),r+=2,l.rangeShift=o.readUshort(i,r),r+=2,l.endCount=o.readUshorts(i,r,d),r+=2*d,r+=2,l.startCount=o.readUshorts(i,r,d),r+=2*d,l.idDelta=[];for(var u=0;u<d;u++)l.idDelta.push(o.readShort(i,r)),r+=2;for(l.idRangeOffset=o.readUshorts(i,r,d),r+=2*d,l.glyphIdArray=[];r<a+c;)l.glyphIdArray.push(o.readUshort(i,r)),r+=2;return l},e.cmap.parse6=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,a.firstCode=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2,a.glyphIdArray=[];for(var c=0;c<l;c++)a.glyphIdArray.push(o.readUshort(i,r)),r+=2;return a},e.cmap.parse12=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2,r+=2,o.readUint(i,r),r+=4,o.readUint(i,r),r+=4;var l=o.readUint(i,r);r+=4,a.groups=[];for(var c=0;c<l;c++){var h=r+12*c,d=o.readUint(i,h+0),u=o.readUint(i,h+4),f=o.readUint(i,h+8);a.groups.push([d,u,f])}return a},e.glyf={},e.glyf.parse=function(i,r,o,a){for(var l=[],c=0;c<a.maxp.numGlyphs;c++)l.push(null);return l},e.glyf._parseGlyf=function(i,r){var o=e._bin,a=i._data,l=e._tabOffset(a,"glyf",i._offset)+i.loca[r];if(i.loca[r]==i.loca[r+1])return null;var c={};if(c.noc=o.readShort(a,l),l+=2,c.xMin=o.readShort(a,l),l+=2,c.yMin=o.readShort(a,l),l+=2,c.xMax=o.readShort(a,l),l+=2,c.yMax=o.readShort(a,l),l+=2,c.xMin>=c.xMax||c.yMin>=c.yMax)return null;if(c.noc>0){c.endPts=[];for(var h=0;h<c.noc;h++)c.endPts.push(o.readUshort(a,l)),l+=2;var d=o.readUshort(a,l);if(l+=2,a.length-l<d)return null;c.instructions=o.readBytes(a,l,d),l+=d;var u=c.endPts[c.noc-1]+1;for(c.flags=[],h=0;h<u;h++){var f=a[l];if(l++,c.flags.push(f),(8&f)!=0){var g=a[l];l++;for(var _=0;_<g;_++)c.flags.push(f),h++}}for(c.xs=[],h=0;h<u;h++){var p=(2&c.flags[h])!=0,m=(16&c.flags[h])!=0;p?(c.xs.push(m?a[l]:-a[l]),l++):m?c.xs.push(0):(c.xs.push(o.readShort(a,l)),l+=2)}for(c.ys=[],h=0;h<u;h++)p=(4&c.flags[h])!=0,m=(32&c.flags[h])!=0,p?(c.ys.push(m?a[l]:-a[l]),l++):m?c.ys.push(0):(c.ys.push(o.readShort(a,l)),l+=2);var S=0,v=0;for(h=0;h<u;h++)S+=c.xs[h],v+=c.ys[h],c.xs[h]=S,c.ys[h]=v}else{var b;c.parts=[];do{b=o.readUshort(a,l),l+=2;var R={m:{a:1,b:0,c:0,d:1,tx:0,ty:0},p1:-1,p2:-1};if(c.parts.push(R),R.glyphIndex=o.readUshort(a,l),l+=2,1&b){var w=o.readShort(a,l);l+=2;var T=o.readShort(a,l);l+=2}else w=o.readInt8(a,l),l++,T=o.readInt8(a,l),l++;2&b?(R.m.tx=w,R.m.ty=T):(R.p1=w,R.p2=T),8&b?(R.m.a=R.m.d=o.readF2dot14(a,l),l+=2):64&b?(R.m.a=o.readF2dot14(a,l),l+=2,R.m.d=o.readF2dot14(a,l),l+=2):128&b&&(R.m.a=o.readF2dot14(a,l),l+=2,R.m.b=o.readF2dot14(a,l),l+=2,R.m.c=o.readF2dot14(a,l),l+=2,R.m.d=o.readF2dot14(a,l),l+=2)}while(32&b);if(256&b){var U=o.readUshort(a,l);for(l+=2,c.instr=[],h=0;h<U;h++)c.instr.push(a[l]),l++}}return c},e.GDEF={},e.GDEF.parse=function(i,r,o,a){var l=r;r+=4;var c=e._bin.readUshort(i,r);return{glyphClassDef:c===0?null:e._lctf.readClassDef(i,l+c)}},e.GPOS={},e.GPOS.parse=function(i,r,o,a){return e._lctf.parse(i,r,o,a,e.GPOS.subt)},e.GPOS.subt=function(i,r,o,a){var l=e._bin,c=o,h={};if(h.fmt=l.readUshort(i,o),o+=2,r==1||r==2||r==3||r==7||r==8&&h.fmt<=2){var d=l.readUshort(i,o);o+=2,h.coverage=e._lctf.readCoverage(i,d+c)}if(r==1&&h.fmt==1){var u=l.readUshort(i,o);o+=2,u!=0&&(h.pos=e.GPOS.readValueRecord(i,o,u))}else if(r==2&&h.fmt>=1&&h.fmt<=2){u=l.readUshort(i,o),o+=2;var f=l.readUshort(i,o);o+=2;var g=e._lctf.numOfOnes(u),_=e._lctf.numOfOnes(f);if(h.fmt==1){h.pairsets=[];var p=l.readUshort(i,o);o+=2;for(var m=0;m<p;m++){var S=c+l.readUshort(i,o);o+=2;var v=l.readUshort(i,S);S+=2;for(var b=[],R=0;R<v;R++){var w=l.readUshort(i,S);S+=2,u!=0&&(L=e.GPOS.readValueRecord(i,S,u),S+=2*g),f!=0&&(A=e.GPOS.readValueRecord(i,S,f),S+=2*_),b.push({gid2:w,val1:L,val2:A})}h.pairsets.push(b)}}if(h.fmt==2){var T=l.readUshort(i,o);o+=2;var U=l.readUshort(i,o);o+=2;var E=l.readUshort(i,o);o+=2;var y=l.readUshort(i,o);for(o+=2,h.classDef1=e._lctf.readClassDef(i,c+T),h.classDef2=e._lctf.readClassDef(i,c+U),h.matrix=[],m=0;m<E;m++){var F=[];for(R=0;R<y;R++){var L=null,A=null;u!=0&&(L=e.GPOS.readValueRecord(i,o,u),o+=2*g),f!=0&&(A=e.GPOS.readValueRecord(i,o,f),o+=2*_),F.push({val1:L,val2:A})}h.matrix.push(F)}}}else if(r==4&&h.fmt==1)h.markCoverage=e._lctf.readCoverage(i,l.readUshort(i,o)+c),h.baseCoverage=e._lctf.readCoverage(i,l.readUshort(i,o+2)+c),h.markClassCount=l.readUshort(i,o+4),h.markArray=e.GPOS.readMarkArray(i,l.readUshort(i,o+6)+c),h.baseArray=e.GPOS.readBaseArray(i,l.readUshort(i,o+8)+c,h.markClassCount);else if(r==6&&h.fmt==1)h.mark1Coverage=e._lctf.readCoverage(i,l.readUshort(i,o)+c),h.mark2Coverage=e._lctf.readCoverage(i,l.readUshort(i,o+2)+c),h.markClassCount=l.readUshort(i,o+4),h.mark1Array=e.GPOS.readMarkArray(i,l.readUshort(i,o+6)+c),h.mark2Array=e.GPOS.readBaseArray(i,l.readUshort(i,o+8)+c,h.markClassCount);else{if(r==9&&h.fmt==1){var I=l.readUshort(i,o);o+=2;var z=l.readUint(i,o);if(o+=4,a.ltype==9)a.ltype=I;else if(a.ltype!=I)throw"invalid extension substitution";return e.GPOS.subt(i,a.ltype,c+z)}console.debug("unsupported GPOS table LookupType",r,"format",h.fmt)}return h},e.GPOS.readValueRecord=function(i,r,o){var a=e._bin,l=[];return l.push(1&o?a.readShort(i,r):0),r+=1&o?2:0,l.push(2&o?a.readShort(i,r):0),r+=2&o?2:0,l.push(4&o?a.readShort(i,r):0),r+=4&o?2:0,l.push(8&o?a.readShort(i,r):0),r+=8&o?2:0,l},e.GPOS.readBaseArray=function(i,r,o){var a=e._bin,l=[],c=r,h=a.readUshort(i,r);r+=2;for(var d=0;d<h;d++){for(var u=[],f=0;f<o;f++)u.push(e.GPOS.readAnchorRecord(i,c+a.readUshort(i,r))),r+=2;l.push(u)}return l},e.GPOS.readMarkArray=function(i,r){var o=e._bin,a=[],l=r,c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=e.GPOS.readAnchorRecord(i,o.readUshort(i,r+2)+l);d.markClass=o.readUshort(i,r),a.push(d),r+=4}return a},e.GPOS.readAnchorRecord=function(i,r){var o=e._bin,a={};return a.fmt=o.readUshort(i,r),a.x=o.readShort(i,r+2),a.y=o.readShort(i,r+4),a},e.GSUB={},e.GSUB.parse=function(i,r,o,a){return e._lctf.parse(i,r,o,a,e.GSUB.subt)},e.GSUB.subt=function(i,r,o,a){var l=e._bin,c=o,h={};if(h.fmt=l.readUshort(i,o),o+=2,r!=1&&r!=2&&r!=4&&r!=5&&r!=6)return null;if(r==1||r==2||r==4||r==5&&h.fmt<=2||r==6&&h.fmt<=2){var d=l.readUshort(i,o);o+=2,h.coverage=e._lctf.readCoverage(i,c+d)}if(r==1&&h.fmt>=1&&h.fmt<=2){if(h.fmt==1)h.delta=l.readShort(i,o),o+=2;else if(h.fmt==2){var u=l.readUshort(i,o);o+=2,h.newg=l.readUshorts(i,o,u),o+=2*h.newg.length}}else if(r==2&&h.fmt==1){u=l.readUshort(i,o),o+=2,h.seqs=[];for(var f=0;f<u;f++){var g=l.readUshort(i,o)+c;o+=2;var _=l.readUshort(i,g);h.seqs.push(l.readUshorts(i,g+2,_))}}else if(r==4)for(h.vals=[],u=l.readUshort(i,o),o+=2,f=0;f<u;f++){var p=l.readUshort(i,o);o+=2,h.vals.push(e.GSUB.readLigatureSet(i,c+p))}else if(r==5&&h.fmt==2){if(h.fmt==2){var m=l.readUshort(i,o);o+=2,h.cDef=e._lctf.readClassDef(i,c+m),h.scset=[];var S=l.readUshort(i,o);for(o+=2,f=0;f<S;f++){var v=l.readUshort(i,o);o+=2,h.scset.push(v==0?null:e.GSUB.readSubClassSet(i,c+v))}}}else if(r==6&&h.fmt==3){if(h.fmt==3){for(f=0;f<3;f++){u=l.readUshort(i,o),o+=2;for(var b=[],R=0;R<u;R++)b.push(e._lctf.readCoverage(i,c+l.readUshort(i,o+2*R)));o+=2*u,f==0&&(h.backCvg=b),f==1&&(h.inptCvg=b),f==2&&(h.ahedCvg=b)}u=l.readUshort(i,o),o+=2,h.lookupRec=e.GSUB.readSubstLookupRecords(i,o,u)}}else{if(r==7&&h.fmt==1){var w=l.readUshort(i,o);o+=2;var T=l.readUint(i,o);if(o+=4,a.ltype==9)a.ltype=w;else if(a.ltype!=w)throw"invalid extension substitution";return e.GSUB.subt(i,a.ltype,c+T)}console.debug("unsupported GSUB table LookupType",r,"format",h.fmt)}return h},e.GSUB.readSubClassSet=function(i,r){var o=e._bin.readUshort,a=r,l=[],c=o(i,r);r+=2;for(var h=0;h<c;h++){var d=o(i,r);r+=2,l.push(e.GSUB.readSubClassRule(i,a+d))}return l},e.GSUB.readSubClassRule=function(i,r){var o=e._bin.readUshort,a={},l=o(i,r),c=o(i,r+=2);r+=2,a.input=[];for(var h=0;h<l-1;h++)a.input.push(o(i,r)),r+=2;return a.substLookupRecords=e.GSUB.readSubstLookupRecords(i,r,c),a},e.GSUB.readSubstLookupRecords=function(i,r,o){for(var a=e._bin.readUshort,l=[],c=0;c<o;c++)l.push(a(i,r),a(i,r+2)),r+=4;return l},e.GSUB.readChainSubClassSet=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=o.readUshort(i,r);r+=2,l.push(e.GSUB.readChainSubClassRule(i,a+d))}return l},e.GSUB.readChainSubClassRule=function(i,r){for(var o=e._bin,a={},l=["backtrack","input","lookahead"],c=0;c<l.length;c++){var h=o.readUshort(i,r);r+=2,c==1&&h--,a[l[c]]=o.readUshorts(i,r,h),r+=2*a[l[c]].length}return h=o.readUshort(i,r),r+=2,a.subst=o.readUshorts(i,r,2*h),r+=2*a.subst.length,a},e.GSUB.readLigatureSet=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=o.readUshort(i,r);r+=2,l.push(e.GSUB.readLigature(i,a+d))}return l},e.GSUB.readLigature=function(i,r){var o=e._bin,a={chain:[]};a.nglyph=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2;for(var c=0;c<l-1;c++)a.chain.push(o.readUshort(i,r)),r+=2;return a},e.head={},e.head.parse=function(i,r,o){var a=e._bin,l={};return a.readFixed(i,r),r+=4,l.fontRevision=a.readFixed(i,r),r+=4,a.readUint(i,r),r+=4,a.readUint(i,r),r+=4,l.flags=a.readUshort(i,r),r+=2,l.unitsPerEm=a.readUshort(i,r),r+=2,l.created=a.readUint64(i,r),r+=8,l.modified=a.readUint64(i,r),r+=8,l.xMin=a.readShort(i,r),r+=2,l.yMin=a.readShort(i,r),r+=2,l.xMax=a.readShort(i,r),r+=2,l.yMax=a.readShort(i,r),r+=2,l.macStyle=a.readUshort(i,r),r+=2,l.lowestRecPPEM=a.readUshort(i,r),r+=2,l.fontDirectionHint=a.readShort(i,r),r+=2,l.indexToLocFormat=a.readShort(i,r),r+=2,l.glyphDataFormat=a.readShort(i,r),r+=2,l},e.hhea={},e.hhea.parse=function(i,r,o){var a=e._bin,l={};return a.readFixed(i,r),r+=4,l.ascender=a.readShort(i,r),r+=2,l.descender=a.readShort(i,r),r+=2,l.lineGap=a.readShort(i,r),r+=2,l.advanceWidthMax=a.readUshort(i,r),r+=2,l.minLeftSideBearing=a.readShort(i,r),r+=2,l.minRightSideBearing=a.readShort(i,r),r+=2,l.xMaxExtent=a.readShort(i,r),r+=2,l.caretSlopeRise=a.readShort(i,r),r+=2,l.caretSlopeRun=a.readShort(i,r),r+=2,l.caretOffset=a.readShort(i,r),r+=2,r+=8,l.metricDataFormat=a.readShort(i,r),r+=2,l.numberOfHMetrics=a.readUshort(i,r),r+=2,l},e.hmtx={},e.hmtx.parse=function(i,r,o,a){for(var l=e._bin,c={aWidth:[],lsBearing:[]},h=0,d=0,u=0;u<a.maxp.numGlyphs;u++)u<a.hhea.numberOfHMetrics&&(h=l.readUshort(i,r),r+=2,d=l.readShort(i,r),r+=2),c.aWidth.push(h),c.lsBearing.push(d);return c},e.kern={},e.kern.parse=function(i,r,o,a){var l=e._bin,c=l.readUshort(i,r);if(r+=2,c==1)return e.kern.parseV1(i,r-2,o,a);var h=l.readUshort(i,r);r+=2;for(var d={glyph1:[],rval:[]},u=0;u<h;u++){r+=2,o=l.readUshort(i,r),r+=2;var f=l.readUshort(i,r);r+=2;var g=f>>>8;if((g&=15)!=0)throw"unknown kern table format: "+g;r=e.kern.readFormat0(i,r,d)}return d},e.kern.parseV1=function(i,r,o,a){var l=e._bin;l.readFixed(i,r),r+=4;var c=l.readUint(i,r);r+=4;for(var h={glyph1:[],rval:[]},d=0;d<c;d++){l.readUint(i,r),r+=4;var u=l.readUshort(i,r);r+=2,l.readUshort(i,r),r+=2;var f=u>>>8;if((f&=15)!=0)throw"unknown kern table format: "+f;r=e.kern.readFormat0(i,r,h)}return h},e.kern.readFormat0=function(i,r,o){var a=e._bin,l=-1,c=a.readUshort(i,r);r+=2,a.readUshort(i,r),r+=2,a.readUshort(i,r),r+=2,a.readUshort(i,r),r+=2;for(var h=0;h<c;h++){var d=a.readUshort(i,r);r+=2;var u=a.readUshort(i,r);r+=2;var f=a.readShort(i,r);r+=2,d!=l&&(o.glyph1.push(d),o.rval.push({glyph2:[],vals:[]}));var g=o.rval[o.rval.length-1];g.glyph2.push(u),g.vals.push(f),l=d}return r},e.loca={},e.loca.parse=function(i,r,o,a){var l=e._bin,c=[],h=a.head.indexToLocFormat,d=a.maxp.numGlyphs+1;if(h==0)for(var u=0;u<d;u++)c.push(l.readUshort(i,r+(u<<1))<<1);if(h==1)for(u=0;u<d;u++)c.push(l.readUint(i,r+(u<<2)));return c},e.maxp={},e.maxp.parse=function(i,r,o){var a=e._bin,l={},c=a.readUint(i,r);return r+=4,l.numGlyphs=a.readUshort(i,r),r+=2,c==65536&&(l.maxPoints=a.readUshort(i,r),r+=2,l.maxContours=a.readUshort(i,r),r+=2,l.maxCompositePoints=a.readUshort(i,r),r+=2,l.maxCompositeContours=a.readUshort(i,r),r+=2,l.maxZones=a.readUshort(i,r),r+=2,l.maxTwilightPoints=a.readUshort(i,r),r+=2,l.maxStorage=a.readUshort(i,r),r+=2,l.maxFunctionDefs=a.readUshort(i,r),r+=2,l.maxInstructionDefs=a.readUshort(i,r),r+=2,l.maxStackElements=a.readUshort(i,r),r+=2,l.maxSizeOfInstructions=a.readUshort(i,r),r+=2,l.maxComponentElements=a.readUshort(i,r),r+=2,l.maxComponentDepth=a.readUshort(i,r),r+=2),l},e.name={},e.name.parse=function(i,r,o){var a=e._bin,l={};a.readUshort(i,r),r+=2;var c=a.readUshort(i,r);r+=2,a.readUshort(i,r);for(var h,d=["copyright","fontFamily","fontSubfamily","ID","fullName","version","postScriptName","trademark","manufacturer","designer","description","urlVendor","urlDesigner","licence","licenceURL","---","typoFamilyName","typoSubfamilyName","compatibleFull","sampleText","postScriptCID","wwsFamilyName","wwsSubfamilyName","lightPalette","darkPalette"],u=r+=2,f=0;f<c;f++){var g=a.readUshort(i,r);r+=2;var _=a.readUshort(i,r);r+=2;var p=a.readUshort(i,r);r+=2;var m=a.readUshort(i,r);r+=2;var S=a.readUshort(i,r);r+=2;var v=a.readUshort(i,r);r+=2;var b,R=d[m],w=u+12*c+v;if(g==0)b=a.readUnicode(i,w,S/2);else if(g==3&&_==0)b=a.readUnicode(i,w,S/2);else if(_==0)b=a.readASCII(i,w,S);else if(_==1)b=a.readUnicode(i,w,S/2);else if(_==3)b=a.readUnicode(i,w,S/2);else{if(g!=1)throw"unknown encoding "+_+", platformID: "+g;b=a.readASCII(i,w,S),console.debug("reading unknown MAC encoding "+_+" as ASCII")}var T="p"+g+","+p.toString(16);l[T]==null&&(l[T]={}),l[T][R!==void 0?R:m]=b,l[T]._lang=p}for(var U in l)if(l[U].postScriptName!=null&&l[U]._lang==1033)return l[U];for(var U in l)if(l[U].postScriptName!=null&&l[U]._lang==0)return l[U];for(var U in l)if(l[U].postScriptName!=null&&l[U]._lang==3084)return l[U];for(var U in l)if(l[U].postScriptName!=null)return l[U];for(var U in l){h=U;break}return console.debug("returning name table with languageID "+l[h]._lang),l[h]},e["OS/2"]={},e["OS/2"].parse=function(i,r,o){var a=e._bin.readUshort(i,r);r+=2;var l={};if(a==0)e["OS/2"].version0(i,r,l);else if(a==1)e["OS/2"].version1(i,r,l);else if(a==2||a==3||a==4)e["OS/2"].version2(i,r,l);else{if(a!=5)throw"unknown OS/2 table version: "+a;e["OS/2"].version5(i,r,l)}return l},e["OS/2"].version0=function(i,r,o){var a=e._bin;return o.xAvgCharWidth=a.readShort(i,r),r+=2,o.usWeightClass=a.readUshort(i,r),r+=2,o.usWidthClass=a.readUshort(i,r),r+=2,o.fsType=a.readUshort(i,r),r+=2,o.ySubscriptXSize=a.readShort(i,r),r+=2,o.ySubscriptYSize=a.readShort(i,r),r+=2,o.ySubscriptXOffset=a.readShort(i,r),r+=2,o.ySubscriptYOffset=a.readShort(i,r),r+=2,o.ySuperscriptXSize=a.readShort(i,r),r+=2,o.ySuperscriptYSize=a.readShort(i,r),r+=2,o.ySuperscriptXOffset=a.readShort(i,r),r+=2,o.ySuperscriptYOffset=a.readShort(i,r),r+=2,o.yStrikeoutSize=a.readShort(i,r),r+=2,o.yStrikeoutPosition=a.readShort(i,r),r+=2,o.sFamilyClass=a.readShort(i,r),r+=2,o.panose=a.readBytes(i,r,10),r+=10,o.ulUnicodeRange1=a.readUint(i,r),r+=4,o.ulUnicodeRange2=a.readUint(i,r),r+=4,o.ulUnicodeRange3=a.readUint(i,r),r+=4,o.ulUnicodeRange4=a.readUint(i,r),r+=4,o.achVendID=[a.readInt8(i,r),a.readInt8(i,r+1),a.readInt8(i,r+2),a.readInt8(i,r+3)],r+=4,o.fsSelection=a.readUshort(i,r),r+=2,o.usFirstCharIndex=a.readUshort(i,r),r+=2,o.usLastCharIndex=a.readUshort(i,r),r+=2,o.sTypoAscender=a.readShort(i,r),r+=2,o.sTypoDescender=a.readShort(i,r),r+=2,o.sTypoLineGap=a.readShort(i,r),r+=2,o.usWinAscent=a.readUshort(i,r),r+=2,o.usWinDescent=a.readUshort(i,r),r+=2},e["OS/2"].version1=function(i,r,o){var a=e._bin;return r=e["OS/2"].version0(i,r,o),o.ulCodePageRange1=a.readUint(i,r),r+=4,o.ulCodePageRange2=a.readUint(i,r),r+=4},e["OS/2"].version2=function(i,r,o){var a=e._bin;return r=e["OS/2"].version1(i,r,o),o.sxHeight=a.readShort(i,r),r+=2,o.sCapHeight=a.readShort(i,r),r+=2,o.usDefault=a.readUshort(i,r),r+=2,o.usBreak=a.readUshort(i,r),r+=2,o.usMaxContext=a.readUshort(i,r),r+=2},e["OS/2"].version5=function(i,r,o){var a=e._bin;return r=e["OS/2"].version2(i,r,o),o.usLowerOpticalPointSize=a.readUshort(i,r),r+=2,o.usUpperOpticalPointSize=a.readUshort(i,r),r+=2},e.post={},e.post.parse=function(i,r,o){var a=e._bin,l={};return l.version=a.readFixed(i,r),r+=4,l.italicAngle=a.readFixed(i,r),r+=4,l.underlinePosition=a.readShort(i,r),r+=2,l.underlineThickness=a.readShort(i,r),r+=2,l},e==null&&(e={}),e.U==null&&(e.U={}),e.U.codeToGlyph=function(i,r){var o=i.cmap,a=-1;if(o.p0e4!=null?a=o.p0e4:o.p3e1!=null?a=o.p3e1:o.p1e0!=null?a=o.p1e0:o.p0e3!=null&&(a=o.p0e3),a==-1)throw"no familiar platform and encoding!";var l=o.tables[a];if(l.format==0)return r>=l.map.length?0:l.map[r];if(l.format==4){for(var c=-1,h=0;h<l.endCount.length;h++)if(r<=l.endCount[h]){c=h;break}return c==-1||l.startCount[c]>r?0:65535&(l.idRangeOffset[c]!=0?l.glyphIdArray[r-l.startCount[c]+(l.idRangeOffset[c]>>1)-(l.idRangeOffset.length-c)]:r+l.idDelta[c])}if(l.format==12){if(r>l.groups[l.groups.length-1][1])return 0;for(h=0;h<l.groups.length;h++){var d=l.groups[h];if(d[0]<=r&&r<=d[1])return d[2]+(r-d[0])}return 0}throw"unknown cmap table format "+l.format},e.U.glyphToPath=function(i,r){var o={cmds:[],crds:[]};if(i.SVG&&i.SVG.entries[r]){var a=i.SVG.entries[r];return a==null?o:(typeof a=="string"&&(a=e.SVG.toPath(a),i.SVG.entries[r]=a),a)}if(i.CFF){var l={x:0,y:0,stack:[],nStems:0,haveWidth:!1,width:i.CFF.Private?i.CFF.Private.defaultWidthX:0,open:!1},c=i.CFF,h=i.CFF.Private;if(c.ROS){for(var d=0;c.FDSelect[d+2]<=r;)d+=2;h=c.FDArray[c.FDSelect[d+1]].Private}e.U._drawCFF(i.CFF.CharStrings[r],l,c,h,o)}else i.glyf&&e.U._drawGlyf(r,i,o);return o},e.U._drawGlyf=function(i,r,o){var a=r.glyf[i];a==null&&(a=r.glyf[i]=e.glyf._parseGlyf(r,i)),a!=null&&(a.noc>-1?e.U._simpleGlyph(a,o):e.U._compoGlyph(a,r,o))},e.U._simpleGlyph=function(i,r){for(var o=0;o<i.noc;o++){for(var a=o==0?0:i.endPts[o-1]+1,l=i.endPts[o],c=a;c<=l;c++){var h=c==a?l:c-1,d=c==l?a:c+1,u=1&i.flags[c],f=1&i.flags[h],g=1&i.flags[d],_=i.xs[c],p=i.ys[c];if(c==a)if(u){if(!f){e.U.P.moveTo(r,_,p);continue}e.U.P.moveTo(r,i.xs[h],i.ys[h])}else f?e.U.P.moveTo(r,i.xs[h],i.ys[h]):e.U.P.moveTo(r,(i.xs[h]+_)/2,(i.ys[h]+p)/2);u?f&&e.U.P.lineTo(r,_,p):g?e.U.P.qcurveTo(r,_,p,i.xs[d],i.ys[d]):e.U.P.qcurveTo(r,_,p,(_+i.xs[d])/2,(p+i.ys[d])/2)}e.U.P.closePath(r)}},e.U._compoGlyph=function(i,r,o){for(var a=0;a<i.parts.length;a++){var l={cmds:[],crds:[]},c=i.parts[a];e.U._drawGlyf(c.glyphIndex,r,l);for(var h=c.m,d=0;d<l.crds.length;d+=2){var u=l.crds[d],f=l.crds[d+1];o.crds.push(u*h.a+f*h.b+h.tx),o.crds.push(u*h.c+f*h.d+h.ty)}for(d=0;d<l.cmds.length;d++)o.cmds.push(l.cmds[d])}},e.U._getGlyphClass=function(i,r){var o=e._lctf.getInterval(r,i);return o==-1?0:r[o+2]},e.U._applySubs=function(i,r,o,a){for(var l=i.length-r-1,c=0;c<o.tabs.length;c++)if(o.tabs[c]!=null){var h,d=o.tabs[c];if(!d.coverage||(h=e._lctf.coverageIndex(d.coverage,i[r]))!=-1){if(o.ltype==1)i[r],d.fmt==1?i[r]=i[r]+d.delta:i[r]=d.newg[h];else if(o.ltype==4)for(var u=d.vals[h],f=0;f<u.length;f++){var g=u[f],_=g.chain.length;if(!(_>l)){for(var p=!0,m=0,S=0;S<_;S++){for(;i[r+m+(1+S)]==-1;)m++;g.chain[S]!=i[r+m+(1+S)]&&(p=!1)}if(p){for(i[r]=g.nglyph,S=0;S<_+m;S++)i[r+S+1]=-1;break}}}else if(o.ltype==5&&d.fmt==2)for(var v=e._lctf.getInterval(d.cDef,i[r]),b=d.cDef[v+2],R=d.scset[b],w=0;w<R.length;w++){var T=R[w],U=T.input;if(!(U.length>l)){for(p=!0,S=0;S<U.length;S++){var E=e._lctf.getInterval(d.cDef,i[r+1+S]);if(v==-1&&d.cDef[E+2]!=U[S]){p=!1;break}}if(p){var y=T.substLookupRecords;for(f=0;f<y.length;f+=2)y[f],y[f+1]}}}else if(o.ltype==6&&d.fmt==3){if(!e.U._glsCovered(i,d.backCvg,r-d.backCvg.length)||!e.U._glsCovered(i,d.inptCvg,r)||!e.U._glsCovered(i,d.ahedCvg,r+d.inptCvg.length))continue;var F=d.lookupRec;for(w=0;w<F.length;w+=2){v=F[w];var L=a[F[w+1]];e.U._applySubs(i,r+v,L,a)}}}}},e.U._glsCovered=function(i,r,o){for(var a=0;a<r.length;a++)if(e._lctf.coverageIndex(r[a],i[o+a])==-1)return!1;return!0},e.U.glyphsToPath=function(i,r,o){for(var a={cmds:[],crds:[]},l=0,c=0;c<r.length;c++){var h=r[c];if(h!=-1){for(var d=c<r.length-1&&r[c+1]!=-1?r[c+1]:0,u=e.U.glyphToPath(i,h),f=0;f<u.crds.length;f+=2)a.crds.push(u.crds[f]+l),a.crds.push(u.crds[f+1]);for(o&&a.cmds.push(o),f=0;f<u.cmds.length;f++)a.cmds.push(u.cmds[f]);o&&a.cmds.push("X"),l+=i.hmtx.aWidth[h],c<r.length-1&&(l+=e.U.getPairAdjustment(i,h,d))}}return a},e.U.P={},e.U.P.moveTo=function(i,r,o){i.cmds.push("M"),i.crds.push(r,o)},e.U.P.lineTo=function(i,r,o){i.cmds.push("L"),i.crds.push(r,o)},e.U.P.curveTo=function(i,r,o,a,l,c,h){i.cmds.push("C"),i.crds.push(r,o,a,l,c,h)},e.U.P.qcurveTo=function(i,r,o,a,l){i.cmds.push("Q"),i.crds.push(r,o,a,l)},e.U.P.closePath=function(i){i.cmds.push("Z")},e.U._drawCFF=function(i,r,o,a,l){for(var c=r.stack,h=r.nStems,d=r.haveWidth,u=r.width,f=r.open,g=0,_=r.x,p=r.y,m=0,S=0,v=0,b=0,R=0,w=0,T=0,U=0,E=0,y=0,F={val:0,size:0};g<i.length;){e.CFF.getCharString(i,g,F);var L=F.val;if(g+=F.size,L=="o1"||L=="o18")c.length%2!=0&&!d&&(u=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,d=!0;else if(L=="o3"||L=="o23")c.length%2!=0&&!d&&(u=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,d=!0;else if(L=="o4")c.length>1&&!d&&(u=c.shift()+a.nominalWidthX,d=!0),f&&e.U.P.closePath(l),p+=c.pop(),e.U.P.moveTo(l,_,p),f=!0;else if(L=="o5")for(;c.length>0;)_+=c.shift(),p+=c.shift(),e.U.P.lineTo(l,_,p);else if(L=="o6"||L=="o7")for(var A=c.length,I=L=="o6",z=0;z<A;z++){var B=c.shift();I?_+=B:p+=B,I=!I,e.U.P.lineTo(l,_,p)}else if(L=="o8"||L=="o24"){A=c.length;for(var ie=0;ie+6<=A;)m=_+c.shift(),S=p+c.shift(),v=m+c.shift(),b=S+c.shift(),_=v+c.shift(),p=b+c.shift(),e.U.P.curveTo(l,m,S,v,b,_,p),ie+=6;L=="o24"&&(_+=c.shift(),p+=c.shift(),e.U.P.lineTo(l,_,p))}else{if(L=="o11")break;if(L=="o1234"||L=="o1235"||L=="o1236"||L=="o1237")L=="o1234"&&(S=p,v=(m=_+c.shift())+c.shift(),y=b=S+c.shift(),w=b,U=p,_=(T=(R=(E=v+c.shift())+c.shift())+c.shift())+c.shift(),e.U.P.curveTo(l,m,S,v,b,E,y),e.U.P.curveTo(l,R,w,T,U,_,p)),L=="o1235"&&(m=_+c.shift(),S=p+c.shift(),v=m+c.shift(),b=S+c.shift(),E=v+c.shift(),y=b+c.shift(),R=E+c.shift(),w=y+c.shift(),T=R+c.shift(),U=w+c.shift(),_=T+c.shift(),p=U+c.shift(),c.shift(),e.U.P.curveTo(l,m,S,v,b,E,y),e.U.P.curveTo(l,R,w,T,U,_,p)),L=="o1236"&&(m=_+c.shift(),S=p+c.shift(),v=m+c.shift(),y=b=S+c.shift(),w=b,T=(R=(E=v+c.shift())+c.shift())+c.shift(),U=w+c.shift(),_=T+c.shift(),e.U.P.curveTo(l,m,S,v,b,E,y),e.U.P.curveTo(l,R,w,T,U,_,p)),L=="o1237"&&(m=_+c.shift(),S=p+c.shift(),v=m+c.shift(),b=S+c.shift(),E=v+c.shift(),y=b+c.shift(),R=E+c.shift(),w=y+c.shift(),T=R+c.shift(),U=w+c.shift(),Math.abs(T-_)>Math.abs(U-p)?_=T+c.shift():p=U+c.shift(),e.U.P.curveTo(l,m,S,v,b,E,y),e.U.P.curveTo(l,R,w,T,U,_,p));else if(L=="o14"){if(c.length>0&&!d&&(u=c.shift()+o.nominalWidthX,d=!0),c.length==4){var j=c.shift(),K=c.shift(),q=c.shift(),N=c.shift(),V=e.CFF.glyphBySE(o,q),ne=e.CFF.glyphBySE(o,N);e.U._drawCFF(o.CharStrings[V],r,o,a,l),r.x=j,r.y=K,e.U._drawCFF(o.CharStrings[ne],r,o,a,l)}f&&(e.U.P.closePath(l),f=!1)}else if(L=="o19"||L=="o20")c.length%2!=0&&!d&&(u=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,d=!0,g+=h+7>>3;else if(L=="o21")c.length>2&&!d&&(u=c.shift()+a.nominalWidthX,d=!0),p+=c.pop(),_+=c.pop(),f&&e.U.P.closePath(l),e.U.P.moveTo(l,_,p),f=!0;else if(L=="o22")c.length>1&&!d&&(u=c.shift()+a.nominalWidthX,d=!0),_+=c.pop(),f&&e.U.P.closePath(l),e.U.P.moveTo(l,_,p),f=!0;else if(L=="o25"){for(;c.length>6;)_+=c.shift(),p+=c.shift(),e.U.P.lineTo(l,_,p);m=_+c.shift(),S=p+c.shift(),v=m+c.shift(),b=S+c.shift(),_=v+c.shift(),p=b+c.shift(),e.U.P.curveTo(l,m,S,v,b,_,p)}else if(L=="o26")for(c.length%2&&(_+=c.shift());c.length>0;)m=_,S=p+c.shift(),_=v=m+c.shift(),p=(b=S+c.shift())+c.shift(),e.U.P.curveTo(l,m,S,v,b,_,p);else if(L=="o27")for(c.length%2&&(p+=c.shift());c.length>0;)S=p,v=(m=_+c.shift())+c.shift(),b=S+c.shift(),_=v+c.shift(),p=b,e.U.P.curveTo(l,m,S,v,b,_,p);else if(L=="o10"||L=="o29"){var O=L=="o10"?a:o;if(c.length==0)console.debug("error: empty stack");else{var k=c.pop(),te=O.Subrs[k+O.Bias];r.x=_,r.y=p,r.nStems=h,r.haveWidth=d,r.width=u,r.open=f,e.U._drawCFF(te,r,o,a,l),_=r.x,p=r.y,h=r.nStems,d=r.haveWidth,u=r.width,f=r.open}}else if(L=="o30"||L=="o31"){var H=c.length,ae=(ie=0,L=="o31");for(ie+=H-(A=-3&H);ie<A;)ae?(S=p,v=(m=_+c.shift())+c.shift(),p=(b=S+c.shift())+c.shift(),A-ie==5?(_=v+c.shift(),ie++):_=v,ae=!1):(m=_,S=p+c.shift(),v=m+c.shift(),b=S+c.shift(),_=v+c.shift(),A-ie==5?(p=b+c.shift(),ie++):p=b,ae=!0),e.U.P.curveTo(l,m,S,v,b,_,p),ie+=4}else{if((L+"").charAt(0)=="o")throw console.debug("Unknown operation: "+L,i),L;c.push(L)}}}r.x=_,r.y=p,r.nStems=h,r.haveWidth=d,r.width=u,r.open=f};var t=e,n={Typr:t};return s.Typr=t,s.default=n,Object.defineProperty(s,"__esModule",{value:!0}),s}({}).Typr}/*!
Custom bundle of woff2otf (https://github.com/arty-name/woff2otf) with fflate
(https://github.com/101arrowz/fflate) for use in Troika text rendering. 
Original licenses apply: 
- fflate: https://github.com/101arrowz/fflate/blob/master/LICENSE (MIT)
- woff2otf.js: https://github.com/arty-name/woff2otf/blob/master/woff2otf.js (Apache2)
*/function Rv(){return function(s){var e=Uint8Array,t=Uint16Array,n=Uint32Array,i=new e([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),r=new e([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),o=new e([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(L,A){for(var I=new t(31),z=0;z<31;++z)I[z]=A+=1<<L[z-1];var B=new n(I[30]);for(z=1;z<30;++z)for(var ie=I[z];ie<I[z+1];++ie)B[ie]=ie-I[z]<<5|z;return[I,B]},l=a(i,2),c=l[0],h=l[1];c[28]=258,h[258]=28;for(var d=a(r,0)[0],u=new t(32768),f=0;f<32768;++f){var g=(43690&f)>>>1|(21845&f)<<1;g=(61680&(g=(52428&g)>>>2|(13107&g)<<2))>>>4|(3855&g)<<4,u[f]=((65280&g)>>>8|(255&g)<<8)>>>1}var _=function(L,A,I){for(var z=L.length,B=0,ie=new t(A);B<z;++B)++ie[L[B]-1];var j,K=new t(A);for(B=0;B<A;++B)K[B]=K[B-1]+ie[B-1]<<1;{j=new t(1<<A);var q=15-A;for(B=0;B<z;++B)if(L[B])for(var N=B<<4|L[B],V=A-L[B],ne=K[L[B]-1]++<<V,O=ne|(1<<V)-1;ne<=O;++ne)j[u[ne]>>>q]=N}return j},p=new e(288);for(f=0;f<144;++f)p[f]=8;for(f=144;f<256;++f)p[f]=9;for(f=256;f<280;++f)p[f]=7;for(f=280;f<288;++f)p[f]=8;var m=new e(32);for(f=0;f<32;++f)m[f]=5;var S=_(p,9),v=_(m,5),b=function(L){for(var A=L[0],I=1;I<L.length;++I)L[I]>A&&(A=L[I]);return A},R=function(L,A,I){var z=A/8|0;return(L[z]|L[z+1]<<8)>>(7&A)&I},w=function(L,A){var I=A/8|0;return(L[I]|L[I+1]<<8|L[I+2]<<16)>>(7&A)},T=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],U=function(L,A,I){var z=new Error(A||T[L]);if(z.code=L,Error.captureStackTrace&&Error.captureStackTrace(z,U),!I)throw z;return z},E=function(L,A,I){var z=L.length;if(!z||I&&!I.l&&z<5)return A||new e(0);var B=!A||I,ie=!I||I.i;I||(I={}),A||(A=new e(3*z));var j,K=function(xe){var Ne=A.length;if(xe>Ne){var We=new e(Math.max(2*Ne,xe));We.set(A),A=We}},q=I.f||0,N=I.p||0,V=I.b||0,ne=I.l,O=I.d,k=I.m,te=I.n,H=8*z;do{if(!ne){I.f=q=R(L,N,1);var ae=R(L,N+1,3);if(N+=3,!ae){var pe=L[(P=((j=N)/8|0)+(7&j&&1)+4)-4]|L[P-3]<<8,ve=P+pe;if(ve>z){ie&&U(0);break}B&&K(V+pe),A.set(L.subarray(P,ve),V),I.b=V+=pe,I.p=N=8*ve;continue}if(ae==1)ne=S,O=v,k=9,te=5;else if(ae==2){var D=R(L,N,31)+257,he=R(L,N+10,15)+4,Pe=D+R(L,N+5,31)+1;N+=14;for(var Ue=new e(Pe),fe=new e(19),ye=0;ye<he;++ye)fe[o[ye]]=R(L,N+3*ye,7);N+=3*he;var Me=b(fe),de=(1<<Me)-1,Ce=_(fe,Me);for(ye=0;ye<Pe;){var P,x=Ce[R(L,N,de)];if(N+=15&x,(P=x>>>4)<16)Ue[ye++]=P;else{var X=0,Z=0;for(P==16?(Z=3+R(L,N,3),N+=2,X=Ue[ye-1]):P==17?(Z=3+R(L,N,7),N+=3):P==18&&(Z=11+R(L,N,127),N+=7);Z--;)Ue[ye++]=X}}var re=Ue.subarray(0,D),Q=Ue.subarray(D);k=b(re),te=b(Q),ne=_(re,k),O=_(Q,te)}else U(1);if(N>H){ie&&U(0);break}}B&&K(V+131072);for(var Te=(1<<k)-1,le=(1<<te)-1,ce=N;;ce=N){var Se=(X=ne[w(L,N)&Te])>>>4;if((N+=15&X)>H){ie&&U(0);break}if(X||U(2),Se<256)A[V++]=Se;else{if(Se==256){ce=N,ne=null;break}var ue=Se-254;if(Se>264){var be=i[ye=Se-257];ue=R(L,N,(1<<be)-1)+c[ye],N+=be}var Be=O[w(L,N)&le],we=Be>>>4;if(Be||U(3),N+=15&Be,Q=d[we],we>3&&(be=r[we],Q+=w(L,N)&(1<<be)-1,N+=be),N>H){ie&&U(0);break}B&&K(V+131072);for(var me=V+ue;V<me;V+=4)A[V]=A[V-Q],A[V+1]=A[V+1-Q],A[V+2]=A[V+2-Q],A[V+3]=A[V+3-Q];V=me}}I.l=ne,I.p=ce,I.b=V,ne&&(q=1,I.m=k,I.d=O,I.n=te)}while(!q);return V==A.length?A:function(xe,Ne,We){(We==null||We>xe.length)&&(We=xe.length);var M=new(xe instanceof t?t:xe instanceof n?n:e)(We-Ne);return M.set(xe.subarray(Ne,We)),M}(A,0,V)},y=new e(0),F=typeof TextDecoder<"u"&&new TextDecoder;try{F.decode(y,{stream:!0})}catch{}return s.convert_streams=function(L){var A=new DataView(L),I=0;function z(){var D=A.getUint16(I);return I+=2,D}function B(){var D=A.getUint32(I);return I+=4,D}function ie(D){pe.setUint16(ve,D),ve+=2}function j(D){pe.setUint32(ve,D),ve+=4}for(var K={signature:B(),flavor:B(),length:B(),numTables:z(),reserved:z(),totalSfntSize:B(),majorVersion:z(),minorVersion:z(),metaOffset:B(),metaLength:B(),metaOrigLength:B(),privOffset:B(),privLength:B()},q=0;Math.pow(2,q)<=K.numTables;)q++;q--;for(var N=16*Math.pow(2,q),V=16*K.numTables-N,ne=12,O=[],k=0;k<K.numTables;k++)O.push({tag:B(),offset:B(),compLength:B(),origLength:B(),origChecksum:B()}),ne+=16;var te,H=new Uint8Array(12+16*O.length+O.reduce(function(D,he){return D+he.origLength+4},0)),ae=H.buffer,pe=new DataView(ae),ve=0;return j(K.flavor),ie(K.numTables),ie(N),ie(q),ie(V),O.forEach(function(D){j(D.tag),j(D.origChecksum),j(ne),j(D.origLength),D.outOffset=ne,(ne+=D.origLength)%4!=0&&(ne+=4-ne%4)}),O.forEach(function(D){var he,Pe=L.slice(D.offset,D.offset+D.compLength);if(D.compLength!=D.origLength){var Ue=new Uint8Array(D.origLength);he=new Uint8Array(Pe,2),E(he,Ue)}else Ue=new Uint8Array(Pe);H.set(Ue,D.outOffset);var fe=0;(ne=D.outOffset+D.origLength)%4!=0&&(fe=4-ne%4),H.set(new Uint8Array(fe).buffer,D.outOffset+D.origLength),te=ne+fe}),ae.slice(0,te)},Object.defineProperty(s,"__esModule",{value:!0}),s}({}).convert_streams}function Pv(s,e){const t={M:2,L:2,Q:4,C:6,Z:0},n={C:"18g,ca,368,1kz",D:"17k,6,2,2+4,5+c,2+6,2+1,10+1,9+f,j+11,2+1,a,2,2+1,15+2,3,j+2,6+3,2+8,2,2,2+1,w+a,4+e,3+3,2,3+2,3+5,23+w,2f+4,3,2+9,2,b,2+3,3,1k+9,6+1,3+1,2+2,2+d,30g,p+y,1,1+1g,f+x,2,sd2+1d,jf3+4,f+3,2+4,2+2,b+3,42,2,4+2,2+1,2,3,t+1,9f+w,2,el+2,2+g,d+2,2l,2+1,5,3+1,2+1,2,3,6,16wm+1v",R:"17m+3,2,2,6+3,m,15+2,2+2,h+h,13,3+8,2,2,3+1,2,p+1,x,5+4,5,a,2,2,3,u,c+2,g+1,5,2+1,4+1,5j,6+1,2,b,2+2,f,2+1,1s+2,2,3+1,7,1ez0,2,2+1,4+4,b,4,3,b,42,2+2,4,3,2+1,2,o+3,ae,ep,x,2o+2,3+1,3,5+1,6",L:"x9u,jff,a,fd,jv",T:"4t,gj+33,7o+4,1+1,7c+18,2,2+1,2+1,2,21+a,2,1b+k,h,2u+6,3+5,3+1,2+3,y,2,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,3,7,6+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+d,1,1+1,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,ek,3+1,r+4,1e+4,6+5,2p+c,1+3,1,1+2,1+b,2db+2,3y,2p+v,ff+3,30+1,n9x,1+2,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,5s,6y+2,ea,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+9,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2,2b+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,470+8,at4+4,1o+6,t5,1s+3,2a,f5l+1,2+3,43o+2,a+7,1+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,1,gzau,v+2n,3l+6n"},i=1,r=2,o=4,a=8,l=16,c=32;let h;function d(T){if(!h){const U={R:r,L:i,D:o,C:l,U:c,T:a};h=new Map;for(let E in n){let y=0;n[E].split(",").forEach(F=>{let[L,A]=F.split("+");L=parseInt(L,36),A=A?parseInt(A,36):0,h.set(y+=L,U[E]);for(let I=A;I--;)h.set(++y,U[E])})}}return h.get(T)||c}const u=1,f=2,g=3,_=4,p=[null,"isol","init","fina","medi"];function m(T){const U=new Uint8Array(T.length);let E=c,y=u,F=-1;for(let L=0;L<T.length;L++){const A=T.codePointAt(L);let I=d(A)|0,z=u;I&a||(E&(i|o|l)?I&(r|o|l)?(z=g,(y===u||y===g)&&U[F]++):I&(i|c)&&(y===f||y===_)&&U[F]--:E&(r|c)&&(y===f||y===_)&&U[F]--,y=U[L]=z,E=I,F=L,A>65535&&L++)}return U}function S(T,U){const E=[];for(let F=0;F<U.length;F++){const L=U.codePointAt(F);L>65535&&F++,E.push(s.U.codeToGlyph(T,L))}const y=T.GSUB;if(y){const{lookupList:F,featureList:L}=y;let A;const I=/^(rlig|liga|mset|isol|init|fina|medi|half|pres|blws|ccmp)$/,z=[];L.forEach(B=>{if(I.test(B.tag))for(let ie=0;ie<B.tab.length;ie++){if(z[B.tab[ie]])continue;z[B.tab[ie]]=!0;const j=F[B.tab[ie]],K=/^(isol|init|fina|medi)$/.test(B.tag);K&&!A&&(A=m(U));for(let q=0;q<E.length;q++)(!A||!K||p[A[q]]===B.tag)&&s.U._applySubs(E,q,j,F)}})}return E}function v(T,U){const E=new Int16Array(U.length*3);let y=0;for(;y<U.length;y++){const I=U[y];if(I===-1)continue;E[y*3+2]=T.hmtx.aWidth[I];const z=T.GPOS;if(z){const B=z.lookupList;for(let ie=0;ie<B.length;ie++){const j=B[ie];for(let K=0;K<j.tabs.length;K++){const q=j.tabs[K];if(j.ltype===1){if(s._lctf.coverageIndex(q.coverage,I)!==-1&&q.pos){A(q.pos,y);break}}else if(j.ltype===2){let N=null,V=F();if(V!==-1){const ne=s._lctf.coverageIndex(q.coverage,U[V]);if(ne!==-1){if(q.fmt===1){const O=q.pairsets[ne];for(let k=0;k<O.length;k++)O[k].gid2===I&&(N=O[k])}else if(q.fmt===2){const O=s.U._getGlyphClass(U[V],q.classDef1),k=s.U._getGlyphClass(I,q.classDef2);N=q.matrix[O][k]}if(N){N.val1&&A(N.val1,V),N.val2&&A(N.val2,y);break}}}}else if(j.ltype===4){const N=s._lctf.coverageIndex(q.markCoverage,I);if(N!==-1){const V=F(L),ne=V===-1?-1:s._lctf.coverageIndex(q.baseCoverage,U[V]);if(ne!==-1){const O=q.markArray[N],k=q.baseArray[ne][O.markClass];E[y*3]=k.x-O.x+E[V*3]-E[V*3+2],E[y*3+1]=k.y-O.y+E[V*3+1];break}}}else if(j.ltype===6){const N=s._lctf.coverageIndex(q.mark1Coverage,I);if(N!==-1){const V=F();if(V!==-1){const ne=U[V];if(b(T,ne)===3){const O=s._lctf.coverageIndex(q.mark2Coverage,ne);if(O!==-1){const k=q.mark1Array[N],te=q.mark2Array[O][k.markClass];E[y*3]=te.x-k.x+E[V*3]-E[V*3+2],E[y*3+1]=te.y-k.y+E[V*3+1];break}}}}}}}}else if(T.kern&&!T.cff){const B=F();if(B!==-1){const ie=T.kern.glyph1.indexOf(U[B]);if(ie!==-1){const j=T.kern.rval[ie].glyph2.indexOf(I);j!==-1&&(E[B*3+2]+=T.kern.rval[ie].vals[j])}}}}return E;function F(I){for(let z=y-1;z>=0;z--)if(U[z]!==-1&&(!I||I(U[z])))return z;return-1}function L(I){return b(T,I)===1}function A(I,z){for(let B=0;B<3;B++)E[z*3+B]+=I[B]||0}}function b(T,U){const E=T.GDEF&&T.GDEF.glyphClassDef;return E?s.U._getGlyphClass(U,E):0}function R(...T){for(let U=0;U<T.length;U++)if(typeof T[U]=="number")return T[U]}function w(T){const U=Object.create(null),E=T["OS/2"],y=T.hhea,F=T.head.unitsPerEm,L=R(E&&E.sTypoAscender,y&&y.ascender,F),A={unitsPerEm:F,ascender:L,descender:R(E&&E.sTypoDescender,y&&y.descender,0),capHeight:R(E&&E.sCapHeight,L),xHeight:R(E&&E.sxHeight,L),lineGap:R(E&&E.sTypoLineGap,y&&y.lineGap),supportsCodePoint(I){return s.U.codeToGlyph(T,I)>0},forEachGlyph(I,z,B,ie){let j=0;const K=1/A.unitsPerEm*z,q=S(T,I);let N=0;const V=v(T,q);return q.forEach((ne,O)=>{if(ne!==-1){let k=U[ne];if(!k){const{cmds:te,crds:H}=s.U.glyphToPath(T,ne);let ae="",pe=0;for(let Ue=0,fe=te.length;Ue<fe;Ue++){const ye=t[te[Ue]];ae+=te[Ue];for(let Me=1;Me<=ye;Me++)ae+=(Me>1?",":"")+H[pe++]}let ve,D,he,Pe;if(H.length){ve=D=1/0,he=Pe=-1/0;for(let Ue=0,fe=H.length;Ue<fe;Ue+=2){let ye=H[Ue],Me=H[Ue+1];ye<ve&&(ve=ye),Me<D&&(D=Me),ye>he&&(he=ye),Me>Pe&&(Pe=Me)}}else ve=he=D=Pe=0;k=U[ne]={index:ne,advanceWidth:T.hmtx.aWidth[ne],xMin:ve,yMin:D,xMax:he,yMax:Pe,path:ae}}ie.call(null,k,j+V[O*3]*K,V[O*3+1]*K,N),j+=V[O*3+2]*K,B&&(j+=B*z)}N+=I.codePointAt(N)>65535?2:1}),j}};return A}return function(U){const E=new Uint8Array(U,0,4),y=s._bin.readASCII(E,0,4);if(y==="wOFF")U=e(U);else if(y==="wOF2")throw new Error("woff2 fonts not supported");return w(s.parse(U)[0])}}const Uv=Vi({name:"Typr Font Parser",dependencies:[Cv,Rv,Pv],init(s,e,t){const n=s(),i=e();return t(n,i)}});/*!
Custom bundle of @unicode-font-resolver/client v1.0.2 (https://github.com/lojjic/unicode-font-resolver)
for use in Troika text rendering. 
Original MIT license applies
*/function Lv(){return function(s){var e=function(){this.buckets=new Map};e.prototype.add=function(v){var b=v>>5;this.buckets.set(b,(this.buckets.get(b)||0)|1<<(31&v))},e.prototype.has=function(v){var b=this.buckets.get(v>>5);return b!==void 0&&(b&1<<(31&v))!=0},e.prototype.serialize=function(){var v=[];return this.buckets.forEach(function(b,R){v.push((+R).toString(36)+":"+b.toString(36))}),v.join(",")},e.prototype.deserialize=function(v){var b=this;this.buckets.clear(),v.split(",").forEach(function(R){var w=R.split(":");b.buckets.set(parseInt(w[0],36),parseInt(w[1],36))})};var t=Math.pow(2,8),n=t-1,i=~n;function r(v){var b=function(w){return w&i}(v).toString(16),R=function(w){return(w&i)+t-1}(v).toString(16);return"codepoint-index/plane"+(v>>16)+"/"+b+"-"+R+".json"}function o(v,b){var R=v&n,w=b.codePointAt(R/6|0);return((w=(w||48)-48)&1<<R%6)!=0}function a(v,b){var R;(R=v,R.replace(/U\+/gi,"").replace(/^,+|,+$/g,"").split(/,+/).map(function(w){return w.split("-").map(function(T){return parseInt(T.trim(),16)})})).forEach(function(w){var T=w[0],U=w[1];U===void 0&&(U=T),b(T,U)})}function l(v,b){a(v,function(R,w){for(var T=R;T<=w;T++)b(T)})}var c={},h={},d=new WeakMap,u="https://cdn.jsdelivr.net/gh/lojjic/unicode-font-resolver@v1.0.1/packages/data";function f(v){var b=d.get(v);return b||(b=new e,l(v.ranges,function(R){return b.add(R)}),d.set(v,b)),b}var g,_=new Map;function p(v,b,R){return v[b]?b:v[R]?R:function(w){for(var T in w)return T}(v)}function m(v,b){var R=b;if(!v.includes(R)){R=1/0;for(var w=0;w<v.length;w++)Math.abs(v[w]-b)<Math.abs(R-b)&&(R=v[w])}return R}function S(v){return g||(g=new Set,l("9-D,20,85,A0,1680,2000-200A,2028-202F,205F,3000",function(b){g.add(b)})),g.has(v)}return s.CodePointSet=e,s.clearCache=function(){c={},h={}},s.getFontsForString=function(v,b){b===void 0&&(b={});var R,w=b.lang;w===void 0&&(w=new RegExp("\\p{Script=Hangul}","u").test(R=v)?"ko":new RegExp("\\p{Script=Hiragana}|\\p{Script=Katakana}","u").test(R)?"ja":"en");var T=b.category;T===void 0&&(T="sans-serif");var U=b.style;U===void 0&&(U="normal");var E=b.weight;E===void 0&&(E=400);var y=(b.dataUrl||u).replace(/\/$/g,""),F=new Map,L=new Uint8Array(v.length),A={},I={},z=new Array(v.length),B=new Map,ie=!1;function j(N){var V=_.get(N);return V||(V=fetch(y+"/"+N).then(function(ne){if(!ne.ok)throw new Error(ne.statusText);return ne.json().then(function(O){if(!Array.isArray(O)||O[0]!==1)throw new Error("Incorrect schema version; need 1, got "+O[0]);return O[1]})}).catch(function(ne){if(y!==u)return ie||(console.error('unicode-font-resolver: Failed loading from dataUrl "'+y+'", trying default CDN. '+ne.message),ie=!0),y=u,_.delete(N),j(N);throw ne}),_.set(N,V)),V}for(var K=function(N){var V=v.codePointAt(N),ne=r(V);z[N]=ne,c[ne]||B.has(ne)||B.set(ne,j(ne).then(function(O){c[ne]=O})),V>65535&&(N++,q=N)},q=0;q<v.length;q++)K(q);return Promise.all(B.values()).then(function(){B.clear();for(var N=function(ne){var O=v.codePointAt(ne),k=null,te=c[z[ne]],H=void 0;for(var ae in te){var pe=I[ae];if(pe===void 0&&(pe=I[ae]=new RegExp(ae).test(w||"en")),pe){for(var ve in H=ae,te[ae])if(o(O,te[ae][ve])){k=ve;break}break}}if(!k){e:for(var D in te)if(D!==H){for(var he in te[D])if(o(O,te[D][he])){k=he;break e}}}k||(console.debug("No font coverage for U+"+O.toString(16)),k="latin"),z[ne]=k,h[k]||B.has(k)||B.set(k,j("font-meta/"+k+".json").then(function(Pe){h[k]=Pe})),O>65535&&(ne++,V=ne)},V=0;V<v.length;V++)N(V);return Promise.all(B.values())}).then(function(){for(var N,V=null,ne=0;ne<v.length;ne++){var O=v.codePointAt(ne);if(V&&(S(O)||f(V).has(O)))L[ne]=L[ne-1];else{V=h[z[ne]];var k=A[V.id];if(!k){var te=V.typeforms,H=p(te,T,"sans-serif"),ae=p(te[H],U,"normal"),pe=m((N=te[H])===null||N===void 0?void 0:N[ae],E);k=A[V.id]=y+"/font-files/"+V.id+"/"+H+"."+ae+"."+pe+".woff"}var ve=F.get(k);ve==null&&(ve=F.size,F.set(k,ve)),L[ne]=ve}O>65535&&(ne++,L[ne]=L[ne-1])}return{fontUrls:Array.from(F.keys()),chars:L}})},Object.defineProperty(s,"__esModule",{value:!0}),s}({})}function Dv(s,e){const t=Object.create(null),n=Object.create(null);function i(o,a){const l=c=>{console.error(`Failure loading font ${o}`,c)};try{const c=new XMLHttpRequest;c.open("get",o,!0),c.responseType="arraybuffer",c.onload=function(){if(c.status>=400)l(new Error(c.statusText));else if(c.status>0)try{const h=s(c.response);h.src=o,a(h)}catch(h){l(h)}},c.onerror=l,c.send()}catch(c){l(c)}}function r(o,a){let l=t[o];l?a(l):n[o]?n[o].push(a):(n[o]=[a],i(o,c=>{c.src=o,t[o]=c,n[o].forEach(h=>h(c)),delete n[o]}))}return function(o,a,{lang:l,fonts:c=[],style:h="normal",weight:d="normal",unicodeFontsURL:u}={}){const f=new Uint8Array(o.length),g=[];o.length||S();const _=new Map,p=[];if(h!=="italic"&&(h="normal"),typeof d!="number"&&(d=d==="bold"?700:400),c&&!Array.isArray(c)&&(c=[c]),c=c.slice().filter(b=>!b.lang||b.lang.test(l)).reverse(),c.length){let T=0;(function U(E=0){for(let y=E,F=o.length;y<F;y++){const L=o.codePointAt(y);if(T===1&&g[f[y-1]].supportsCodePoint(L)||y>0&&/\s/.test(o[y]))f[y]=f[y-1],T===2&&(p[p.length-1][1]=y);else for(let A=f[y],I=c.length;A<=I;A++)if(A===I){const z=T===2?p[p.length-1]:p[p.length]=[y,y];z[1]=y,T=2}else{f[y]=A;const{src:z,unicodeRange:B}=c[A];if(!B||v(L,B)){const ie=t[z];if(!ie){r(z,()=>{U(y)});return}if(ie.supportsCodePoint(L)){let j=_.get(ie);typeof j!="number"&&(j=g.length,g.push(ie),_.set(ie,j)),f[y]=j,T=1;break}}}L>65535&&y+1<F&&(f[y+1]=f[y],y++,T===2&&(p[p.length-1][1]=y))}m()})()}else p.push([0,o.length-1]),m();function m(){if(p.length){const b=p.map(R=>o.substring(R[0],R[1]+1)).join(`
`);e.getFontsForString(b,{lang:l||void 0,style:h,weight:d,dataUrl:u}).then(({fontUrls:R,chars:w})=>{const T=g.length;let U=0;p.forEach(y=>{for(let F=0,L=y[1]-y[0];F<=L;F++)f[y[0]+F]=w[U++]+T;U++});let E=0;R.forEach((y,F)=>{r(y,L=>{g[F+T]=L,++E===R.length&&S()})})})}else S()}function S(){a({chars:f,fonts:g})}function v(b,R){for(let w=0;w<R.length;w++){const[T,U=T]=R[w];if(T<=b&&b<=U)return!0}return!1}}}const Iv=Vi({name:"FontResolver",dependencies:[Dv,Uv,Lv],init(s,e,t){return s(e,t())}});function Fv(s,e){const n=/[\u00AD\u034F\u061C\u115F-\u1160\u17B4-\u17B5\u180B-\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFF8]/,i="[^\\S\\u00A0]",r=new RegExp(`${i}|[\\-\\u007C\\u00AD\\u2010\\u2012-\\u2014\\u2027\\u2056\\u2E17\\u2E40]`);function o({text:g,lang:_,fonts:p,style:m,weight:S,preResolvedFonts:v,unicodeFontsURL:b},R){const w=({chars:T,fonts:U})=>{let E,y;const F=[];for(let L=0;L<T.length;L++)T[L]!==y?(y=T[L],F.push(E={start:L,end:L,fontObj:U[T[L]]})):E.end=L;R(F)};v?w(v):s(g,w,{lang:_,fonts:p,style:m,weight:S,unicodeFontsURL:b})}function a({text:g="",font:_,lang:p,sdfGlyphSize:m=64,fontSize:S=400,fontWeight:v=1,fontStyle:b="normal",letterSpacing:R=0,lineHeight:w="normal",maxWidth:T=1/0,direction:U,textAlign:E="left",textIndent:y=0,whiteSpace:F="normal",overflowWrap:L="normal",anchorX:A=0,anchorY:I=0,metricsOnly:z=!1,unicodeFontsURL:B,preResolvedFonts:ie=null,includeCaretPositions:j=!1,chunkedBoundsSize:K=8192,colorRanges:q=null},N){const V=d(),ne={fontLoad:0,typesetting:0};g.indexOf("\r")>-1&&(console.info("Typesetter: got text with \\r chars; normalizing to \\n"),g=g.replace(/\r\n/g,`
`).replace(/\r/g,`
`)),S=+S,R=+R,T=+T,w=w||"normal",y=+y,o({text:g,lang:p,style:b,weight:v,fonts:typeof _=="string"?[{src:_}]:_,unicodeFontsURL:B,preResolvedFonts:ie},O=>{ne.fontLoad=d()-V;const k=isFinite(T);let te=null,H=null,ae=null,pe=null,ve=null,D=null,he=null,Pe=null,Ue=0,fe=0,ye=F!=="nowrap";const Me=new Map,de=d();let Ce=y,P=0,x=new u;const X=[x];O.forEach(le=>{const{fontObj:ce}=le,{ascender:Se,descender:ue,unitsPerEm:be,lineGap:Be,capHeight:we,xHeight:me}=ce;let xe=Me.get(ce);if(!xe){const G=S/be,ee=w==="normal"?(Se-ue+Be)*G:w*S,ge=(ee-(Se-ue)*G)/2,Ae=Math.min(ee,(Se-ue)*G),Re=(Se+ue)/2*G+Ae/2;xe={index:Me.size,src:ce.src,fontObj:ce,fontSizeMult:G,unitsPerEm:be,ascender:Se*G,descender:ue*G,capHeight:we*G,xHeight:me*G,lineHeight:ee,baseline:-ge-Se*G,caretTop:Re,caretBottom:Re-Ae},Me.set(ce,xe)}const{fontSizeMult:Ne}=xe,We=g.slice(le.start,le.end+1);let M,$;ce.forEachGlyph(We,S,R,(G,ee,ge,Ae)=>{ee+=P,Ae+=le.start,M=ee,$=G;const Re=g.charAt(Ae),je=G.advanceWidth*Ne,Xe=x.count;let De;if("isEmpty"in G||(G.isWhitespace=!!Re&&new RegExp(i).test(Re),G.canBreakAfter=!!Re&&r.test(Re),G.isEmpty=G.xMin===G.xMax||G.yMin===G.yMax||n.test(Re)),!G.isWhitespace&&!G.isEmpty&&fe++,ye&&k&&!G.isWhitespace&&ee+je+Ce>T&&Xe){if(x.glyphAt(Xe-1).glyphObj.canBreakAfter)De=new u,Ce=-ee;else for(let Je=Xe;Je--;)if(Je===0&&L==="break-word"){De=new u,Ce=-ee;break}else if(x.glyphAt(Je).glyphObj.canBreakAfter){De=x.splitAt(Je+1);const tt=De.glyphAt(0).x;Ce-=tt;for(let $e=De.count;$e--;)De.glyphAt($e).x-=tt;break}De&&(x.isSoftWrapped=!0,x=De,X.push(x),Ue=T)}let Ye=x.glyphAt(x.count);Ye.glyphObj=G,Ye.x=ee+Ce,Ye.y=ge,Ye.width=je,Ye.charIndex=Ae,Ye.fontData=xe,Re===`
`&&(x=new u,X.push(x),Ce=-(ee+je+R*S)+y)}),P=M+$.advanceWidth*Ne+R*S});let Z=0;X.forEach(le=>{let ce=!0;for(let Se=le.count;Se--;){const ue=le.glyphAt(Se);ce&&!ue.glyphObj.isWhitespace&&(le.width=ue.x+ue.width,le.width>Ue&&(Ue=le.width),ce=!1);let{lineHeight:be,capHeight:Be,xHeight:we,baseline:me}=ue.fontData;be>le.lineHeight&&(le.lineHeight=be);const xe=me-le.baseline;xe<0&&(le.baseline+=xe,le.cap+=xe,le.ex+=xe),le.cap=Math.max(le.cap,le.baseline+Be),le.ex=Math.max(le.ex,le.baseline+we)}le.baseline-=Z,le.cap-=Z,le.ex-=Z,Z+=le.lineHeight});let re=0,Q=0;if(A&&(typeof A=="number"?re=-A:typeof A=="string"&&(re=-Ue*(A==="left"?0:A==="center"?.5:A==="right"?1:c(A)))),I&&(typeof I=="number"?Q=-I:typeof I=="string"&&(Q=I==="top"?0:I==="top-baseline"?-X[0].baseline:I==="top-cap"?-X[0].cap:I==="top-ex"?-X[0].ex:I==="middle"?Z/2:I==="bottom"?Z:I==="bottom-baseline"?-X[X.length-1].baseline:c(I)*Z)),!z){const le=e.getEmbeddingLevels(g,U);te=new Uint16Array(fe),H=new Uint8Array(fe),ae=new Float32Array(fe*2),pe={},he=[1/0,1/0,-1/0,-1/0],Pe=[],j&&(D=new Float32Array(g.length*4)),q&&(ve=new Uint8Array(fe*3));let ce=0,Se=-1,ue=-1,be,Be;if(X.forEach((we,me)=>{let{count:xe,width:Ne}=we;if(xe>0){let We=0;for(let Ae=xe;Ae--&&we.glyphAt(Ae).glyphObj.isWhitespace;)We++;let M=0,$=0;if(E==="center")M=(Ue-Ne)/2;else if(E==="right")M=Ue-Ne;else if(E==="justify"&&we.isSoftWrapped){let Ae=0;for(let Re=xe-We;Re--;)we.glyphAt(Re).glyphObj.isWhitespace&&Ae++;$=(Ue-Ne)/Ae}if($||M){let Ae=0;for(let Re=0;Re<xe;Re++){let je=we.glyphAt(Re);const Xe=je.glyphObj;je.x+=M+Ae,$!==0&&Xe.isWhitespace&&Re<xe-We&&(Ae+=$,je.width+=$)}}const G=e.getReorderSegments(g,le,we.glyphAt(0).charIndex,we.glyphAt(we.count-1).charIndex);for(let Ae=0;Ae<G.length;Ae++){const[Re,je]=G[Ae];let Xe=1/0,De=-1/0;for(let Ye=0;Ye<xe;Ye++)if(we.glyphAt(Ye).charIndex>=Re){let Je=Ye,tt=Ye;for(;tt<xe;tt++){let $e=we.glyphAt(tt);if($e.charIndex>je)break;tt<xe-We&&(Xe=Math.min(Xe,$e.x),De=Math.max(De,$e.x+$e.width))}for(let $e=Je;$e<tt;$e++){const lt=we.glyphAt($e);lt.x=De-(lt.x+lt.width-Xe)}break}}let ee;const ge=Ae=>ee=Ae;for(let Ae=0;Ae<xe;Ae++){const Re=we.glyphAt(Ae);ee=Re.glyphObj;const je=ee.index,Xe=le.levels[Re.charIndex]&1;if(Xe){const De=e.getMirroredCharacter(g[Re.charIndex]);De&&Re.fontData.fontObj.forEachGlyph(De,0,0,ge)}if(j){const{charIndex:De,fontData:Ye}=Re,Je=Re.x+re,tt=Re.x+Re.width+re;D[De*4]=Xe?tt:Je,D[De*4+1]=Xe?Je:tt,D[De*4+2]=we.baseline+Ye.caretBottom+Q,D[De*4+3]=we.baseline+Ye.caretTop+Q;const $e=De-Se;$e>1&&h(D,Se,$e),Se=De}if(q){const{charIndex:De}=Re;for(;De>ue;)ue++,q.hasOwnProperty(ue)&&(Be=q[ue])}if(!ee.isWhitespace&&!ee.isEmpty){const De=ce++,{fontSizeMult:Ye,src:Je,index:tt}=Re.fontData,$e=pe[Je]||(pe[Je]={});$e[je]||($e[je]={path:ee.path,pathBounds:[ee.xMin,ee.yMin,ee.xMax,ee.yMax]});const lt=Re.x+re,St=Re.y+we.baseline+Q;ae[De*2]=lt,ae[De*2+1]=St;const gt=lt+ee.xMin*Ye,qt=St+ee.yMin*Ye,Ht=lt+ee.xMax*Ye,Vt=St+ee.yMax*Ye;gt<he[0]&&(he[0]=gt),qt<he[1]&&(he[1]=qt),Ht>he[2]&&(he[2]=Ht),Vt>he[3]&&(he[3]=Vt),De%K===0&&(be={start:De,end:De,rect:[1/0,1/0,-1/0,-1/0]},Pe.push(be)),be.end++;const ft=be.rect;if(gt<ft[0]&&(ft[0]=gt),qt<ft[1]&&(ft[1]=qt),Ht>ft[2]&&(ft[2]=Ht),Vt>ft[3]&&(ft[3]=Vt),te[De]=je,H[De]=tt,q){const cn=De*3;ve[cn]=Be>>16&255,ve[cn+1]=Be>>8&255,ve[cn+2]=Be&255}}}}}),D){const we=g.length-Se;we>1&&h(D,Se,we)}}const Te=[];Me.forEach(({index:le,src:ce,unitsPerEm:Se,ascender:ue,descender:be,lineHeight:Be,capHeight:we,xHeight:me})=>{Te[le]={src:ce,unitsPerEm:Se,ascender:ue,descender:be,lineHeight:Be,capHeight:we,xHeight:me}}),ne.typesetting=d()-de,N({glyphIds:te,glyphFontIndices:H,glyphPositions:ae,glyphData:pe,fontData:Te,caretPositions:D,glyphColors:ve,chunkedBounds:Pe,fontSize:S,topBaseline:Q+X[0].baseline,blockBounds:[re,Q-Z,re+Ue,Q],visibleBounds:he,timings:ne})})}function l(g,_){a({...g,metricsOnly:!0},p=>{const[m,S,v,b]=p.blockBounds;_({width:v-m,height:b-S})})}function c(g){let _=g.match(/^([\d.]+)%$/),p=_?parseFloat(_[1]):NaN;return isNaN(p)?0:p/100}function h(g,_,p){const m=g[_*4],S=g[_*4+1],v=g[_*4+2],b=g[_*4+3],R=(S-m)/p;for(let w=0;w<p;w++){const T=(_+w)*4;g[T]=m+R*w,g[T+1]=m+R*(w+1),g[T+2]=v,g[T+3]=b}}function d(){return(self.performance||Date).now()}function u(){this.data=[]}const f=["glyphObj","x","y","width","charIndex","fontData"];return u.prototype={width:0,lineHeight:0,baseline:0,cap:0,ex:0,isSoftWrapped:!1,get count(){return Math.ceil(this.data.length/f.length)},glyphAt(g){let _=u.flyweight;return _.data=this.data,_.index=g,_},splitAt(g){let _=new u;return _.data=this.data.splice(g*f.length),_}},u.flyweight=f.reduce((g,_,p,m)=>(Object.defineProperty(g,_,{get(){return this.data[this.index*f.length+p]},set(S){this.data[this.index*f.length+p]=S}}),g),{data:null,index:0}),{typeset:a,measure:l}}const ei=()=>(self.performance||Date).now(),Cs=yh();let dc;function Nv(s,e,t,n,i,r,o,a,l,c,h=!0){return h?Bv(s,e,t,n,i,r,o,a,l,c).then(null,d=>(dc||(console.warn("WebGL SDF generation failed, falling back to JS",d),dc=!0),pc(s,e,t,n,i,r,o,a,l,c))):pc(s,e,t,n,i,r,o,a,l,c)}const cs=[],Ov=5;let Ho=0;function Mh(){const s=ei();for(;cs.length&&ei()-s<Ov;)cs.shift()();Ho=cs.length?setTimeout(Mh,0):0}const Bv=(...s)=>new Promise((e,t)=>{cs.push(()=>{const n=ei();try{Cs.webgl.generateIntoCanvas(...s),e({timing:ei()-n})}catch(i){t(i)}}),Ho||(Ho=setTimeout(Mh,0))}),kv=4,zv=2e3,fc={};let Gv=0;function pc(s,e,t,n,i,r,o,a,l,c){const h="TroikaTextSDFGenerator_JS_"+Gv++%kv;let d=fc[h];return d||(d=fc[h]={workerModule:Vi({name:h,workerId:h,dependencies:[yh,ei],init(u,f){const g=u().javascript.generate;return function(..._){const p=f();return{textureData:g(..._),timing:f()-p}}},getTransferables(u){return[u.textureData.buffer]}}),requests:0,idleTimer:null}),d.requests++,clearTimeout(d.idleTimer),d.workerModule(s,e,t,n,i,r).then(({textureData:u,timing:f})=>{const g=ei(),_=new Uint8Array(u.length*4);for(let p=0;p<u.length;p++)_[p*4+c]=u[p];return Cs.webglUtils.renderImageData(o,_,a,l,s,e,1<<3-c),f+=ei()-g,--d.requests===0&&(d.idleTimer=setTimeout(()=>{vv(h)},zv)),{timing:f}})}function Hv(s){s._warm||(Cs.webgl.isSupported(s),s._warm=!0)}const Vv=Cs.webglUtils.resizeWebGLCanvasWithoutClearing,hr={unicodeFontsURL:null,sdfGlyphSize:64,sdfMargin:1/16,sdfExponent:9,textureWidth:2048},Wv=new Ve;function Ti(){return(self.performance||Date).now()}const mc=Object.create(null);function Xv(s,e){s=jv({},s);const t=Ti(),n=[];if(s.font&&n.push({label:"user",src:qv(s.font)}),s.font=n,s.text=""+s.text,s.sdfGlyphSize=s.sdfGlyphSize||hr.sdfGlyphSize,s.unicodeFontsURL=s.unicodeFontsURL||hr.unicodeFontsURL,s.colorRanges!=null){let u={};for(let f in s.colorRanges)if(s.colorRanges.hasOwnProperty(f)){let g=s.colorRanges[f];typeof g!="number"&&(g=Wv.set(g).getHex()),u[f]=g}s.colorRanges=u}Object.freeze(s);const{textureWidth:i,sdfExponent:r}=hr,{sdfGlyphSize:o}=s,a=i/o*4;let l=mc[o];if(!l){const u=document.createElement("canvas");u.width=i,u.height=o*256/a,l=mc[o]={glyphCount:0,sdfGlyphSize:o,sdfCanvas:u,sdfTexture:new Tt(u,void 0,void 0,void 0,kt,kt),contextLost:!1,glyphsByFont:new Map},l.sdfTexture.generateMipmaps=!1,Yv(l)}const{sdfTexture:c,sdfCanvas:h}=l;Th(s).then(u=>{const{glyphIds:f,glyphFontIndices:g,fontData:_,glyphPositions:p,fontSize:m,timings:S}=u,v=[],b=new Float32Array(f.length*4);let R=0,w=0;const T=Ti(),U=_.map(A=>{let I=l.glyphsByFont.get(A.src);return I||l.glyphsByFont.set(A.src,I=new Map),I});f.forEach((A,I)=>{const z=g[I],{src:B,unitsPerEm:ie}=_[z];let j=U[z].get(A);if(!j){const{path:ne,pathBounds:O}=u.glyphData[B][A],k=Math.max(O[2]-O[0],O[3]-O[1])/o*(hr.sdfMargin*o+.5),te=l.glyphCount++,H=[O[0]-k,O[1]-k,O[2]+k,O[3]+k];U[z].set(A,j={path:ne,atlasIndex:te,sdfViewBox:H}),v.push(j)}const{sdfViewBox:K}=j,q=p[w++],N=p[w++],V=m/ie;b[R++]=q+K[0]*V,b[R++]=N+K[1]*V,b[R++]=q+K[2]*V,b[R++]=N+K[3]*V,f[I]=j.atlasIndex}),S.quads=(S.quads||0)+(Ti()-T);const E=Ti();S.sdf={};const y=h.height,F=Math.ceil(l.glyphCount/a),L=Math.pow(2,Math.ceil(Math.log2(F*o)));L>y&&(console.info(`Increasing SDF texture size ${y}->${L}`),Vv(h,i,L),c.dispose()),Promise.all(v.map(A=>bh(A,l,s.gpuAccelerateSDF).then(({timing:I})=>{S.sdf[A.atlasIndex]=I}))).then(()=>{v.length&&!l.contextLost&&(Eh(l),c.needsUpdate=!0),S.sdfTotal=Ti()-E,S.total=Ti()-t,e(Object.freeze({parameters:s,sdfTexture:c,sdfGlyphSize:o,sdfExponent:r,glyphBounds:b,glyphAtlasIndices:f,glyphColors:u.glyphColors,caretPositions:u.caretPositions,chunkedBounds:u.chunkedBounds,ascender:u.ascender,descender:u.descender,lineHeight:u.lineHeight,capHeight:u.capHeight,xHeight:u.xHeight,topBaseline:u.topBaseline,blockBounds:u.blockBounds,visibleBounds:u.visibleBounds,timings:u.timings}))})}),Promise.resolve().then(()=>{l.contextLost||Hv(h)})}function bh({path:s,atlasIndex:e,sdfViewBox:t},{sdfGlyphSize:n,sdfCanvas:i,contextLost:r},o){if(r)return Promise.resolve({timing:-1});const{textureWidth:a,sdfExponent:l}=hr,c=Math.max(t[2]-t[0],t[3]-t[1]),h=Math.floor(e/4),d=h%(a/n)*n,u=Math.floor(h/(a/n))*n,f=e%4;return Nv(n,n,s,t,c,l,i,d,u,f,o)}function Yv(s){const e=s.sdfCanvas;e.addEventListener("webglcontextlost",t=>{console.log("Context Lost",t),t.preventDefault(),s.contextLost=!0}),e.addEventListener("webglcontextrestored",t=>{console.log("Context Restored",t),s.contextLost=!1;const n=[];s.glyphsByFont.forEach(i=>{i.forEach(r=>{n.push(bh(r,s,!0))})}),Promise.all(n).then(()=>{Eh(s),s.sdfTexture.needsUpdate=!0})})}function jv(s,e){for(let t in e)e.hasOwnProperty(t)&&(s[t]=e[t]);return s}let rs;function qv(s){return rs||(rs=typeof document>"u"?{}:document.createElement("a")),rs.href=s,rs.href}function Eh(s){if(typeof createImageBitmap!="function"){console.info("Safari<15: applying SDF canvas workaround");const{sdfCanvas:e,sdfTexture:t}=s,{width:n,height:i}=e,r=s.sdfCanvas.getContext("webgl");let o=t.image.data;(!o||o.length!==n*i*4)&&(o=new Uint8Array(n*i*4),t.image={width:n,height:i,data:o},t.flipY=!1,t.isDataTexture=!0),r.readPixels(0,0,n,i,r.RGBA,r.UNSIGNED_BYTE,o)}}const Kv=Vi({name:"Typesetter",dependencies:[Fv,Iv,yv],init(s,e,t){return s(e,t())}}),Th=Vi({name:"Typesetter",dependencies:[Kv],init(s){return function(e){return new Promise(t=>{s.typeset(e,t)})}},getTransferables(s){const e=[];for(let t in s)s[t]&&s[t].buffer&&e.push(s[t].buffer);return e}});Th.onMainThread;const gc={};function Zv(s){let e=gc[s];return e||(e=gc[s]=new ri(1,1,s,s).translate(.5,.5,0)),e}const Jv="aTroikaGlyphBounds",_c="aTroikaGlyphIndex",Qv="aTroikaGlyphColor";class $v extends H_{constructor(){super(),this.detail=1,this.curveRadius=0,this.groups=[{start:0,count:1/0,materialIndex:0},{start:0,count:1/0,materialIndex:1}],this.boundingSphere=new ii,this.boundingBox=new Sn}computeBoundingSphere(){}computeBoundingBox(){}set detail(e){if(e!==this._detail){this._detail=e,(typeof e!="number"||e<1)&&(e=1);let t=Zv(e);["position","normal","uv"].forEach(n=>{this.attributes[n]=t.attributes[n].clone()}),this.setIndex(t.getIndex().clone())}}get detail(){return this._detail}set curveRadius(e){e!==this._curveRadius&&(this._curveRadius=e,this._updateBounds())}get curveRadius(){return this._curveRadius}updateGlyphs(e,t,n,i,r){this.updateAttributeData(Jv,e,4),this.updateAttributeData(_c,t,1),this.updateAttributeData(Qv,r,3),this._blockBounds=n,this._chunkedBounds=i,this.instanceCount=t.length,this._updateBounds()}_updateBounds(){const e=this._blockBounds;if(e){const{curveRadius:t,boundingBox:n}=this;if(t){const{PI:i,floor:r,min:o,max:a,sin:l,cos:c}=Math,h=i/2,d=i*2,u=Math.abs(t),f=e[0]/u,g=e[2]/u,_=r((f+h)/d)!==r((g+h)/d)?-u:o(l(f)*u,l(g)*u),p=r((f-h)/d)!==r((g-h)/d)?u:a(l(f)*u,l(g)*u),m=r((f+i)/d)!==r((g+i)/d)?u*2:a(u-c(f)*u,u-c(g)*u);n.min.set(_,e[1],t<0?-m:0),n.max.set(p,e[3],t<0?0:m)}else n.min.set(e[0],e[1],0),n.max.set(e[2],e[3],0);n.getBoundingSphere(this.boundingSphere)}}applyClipRect(e){let t=this.getAttribute(_c).count,n=this._chunkedBounds;if(n)for(let i=n.length;i--;){t=n[i].end;let r=n[i].rect;if(r[1]<e.w&&r[3]>e.y&&r[0]<e.z&&r[2]>e.x)break}this.instanceCount=t}updateAttributeData(e,t,n){const i=this.getAttribute(e);t?i&&i.array.length===t.length?(i.array.set(t),i.needsUpdate=!0):(this.setAttribute(e,new Fo(t,n)),delete this._maxInstanceCount,this.dispose()):i&&this.deleteAttribute(e)}}const e0=`
uniform vec2 uTroikaSDFTextureSize;
uniform float uTroikaSDFGlyphSize;
uniform vec4 uTroikaTotalBounds;
uniform vec4 uTroikaClipRect;
uniform mat3 uTroikaOrient;
uniform bool uTroikaUseGlyphColors;
uniform float uTroikaEdgeOffset;
uniform float uTroikaBlurRadius;
uniform vec2 uTroikaPositionOffset;
uniform float uTroikaCurveRadius;
attribute vec4 aTroikaGlyphBounds;
attribute float aTroikaGlyphIndex;
attribute vec3 aTroikaGlyphColor;
varying vec2 vTroikaGlyphUV;
varying vec4 vTroikaTextureUVBounds;
varying float vTroikaTextureChannel;
varying vec3 vTroikaGlyphColor;
varying vec2 vTroikaGlyphDimensions;
`,t0=`
vec4 bounds = aTroikaGlyphBounds;
bounds.xz += uTroikaPositionOffset.x;
bounds.yw -= uTroikaPositionOffset.y;

vec4 outlineBounds = vec4(
  bounds.xy - uTroikaEdgeOffset - uTroikaBlurRadius,
  bounds.zw + uTroikaEdgeOffset + uTroikaBlurRadius
);
vec4 clippedBounds = vec4(
  clamp(outlineBounds.xy, uTroikaClipRect.xy, uTroikaClipRect.zw),
  clamp(outlineBounds.zw, uTroikaClipRect.xy, uTroikaClipRect.zw)
);

vec2 clippedXY = (mix(clippedBounds.xy, clippedBounds.zw, position.xy) - bounds.xy) / (bounds.zw - bounds.xy);

position.xy = mix(bounds.xy, bounds.zw, clippedXY);

uv = (position.xy - uTroikaTotalBounds.xy) / (uTroikaTotalBounds.zw - uTroikaTotalBounds.xy);

float rad = uTroikaCurveRadius;
if (rad != 0.0) {
  float angle = position.x / rad;
  position.xz = vec2(sin(angle) * rad, rad - cos(angle) * rad);
  normal.xz = vec2(sin(angle), cos(angle));
}
  
position = uTroikaOrient * position;
normal = uTroikaOrient * normal;

vTroikaGlyphUV = clippedXY.xy;
vTroikaGlyphDimensions = vec2(bounds[2] - bounds[0], bounds[3] - bounds[1]);


float txCols = uTroikaSDFTextureSize.x / uTroikaSDFGlyphSize;
vec2 txUvPerSquare = uTroikaSDFGlyphSize / uTroikaSDFTextureSize;
vec2 txStartUV = txUvPerSquare * vec2(
  mod(floor(aTroikaGlyphIndex / 4.0), txCols),
  floor(floor(aTroikaGlyphIndex / 4.0) / txCols)
);
vTroikaTextureUVBounds = vec4(txStartUV, vec2(txStartUV) + txUvPerSquare);
vTroikaTextureChannel = mod(aTroikaGlyphIndex, 4.0);
`,n0=`
uniform sampler2D uTroikaSDFTexture;
uniform vec2 uTroikaSDFTextureSize;
uniform float uTroikaSDFGlyphSize;
uniform float uTroikaSDFExponent;
uniform float uTroikaEdgeOffset;
uniform float uTroikaFillOpacity;
uniform float uTroikaBlurRadius;
uniform vec3 uTroikaStrokeColor;
uniform float uTroikaStrokeWidth;
uniform float uTroikaStrokeOpacity;
uniform bool uTroikaSDFDebug;
varying vec2 vTroikaGlyphUV;
varying vec4 vTroikaTextureUVBounds;
varying float vTroikaTextureChannel;
varying vec2 vTroikaGlyphDimensions;

float troikaSdfValueToSignedDistance(float alpha) {
  // Inverse of exponential encoding in webgl-sdf-generator
  
  float maxDimension = max(vTroikaGlyphDimensions.x, vTroikaGlyphDimensions.y);
  float absDist = (1.0 - pow(2.0 * (alpha > 0.5 ? 1.0 - alpha : alpha), 1.0 / uTroikaSDFExponent)) * maxDimension;
  float signedDist = absDist * (alpha > 0.5 ? -1.0 : 1.0);
  return signedDist;
}

float troikaGlyphUvToSdfValue(vec2 glyphUV) {
  vec2 textureUV = mix(vTroikaTextureUVBounds.xy, vTroikaTextureUVBounds.zw, glyphUV);
  vec4 rgba = texture2D(uTroikaSDFTexture, textureUV);
  float ch = floor(vTroikaTextureChannel + 0.5); //NOTE: can't use round() in WebGL1
  return ch == 0.0 ? rgba.r : ch == 1.0 ? rgba.g : ch == 2.0 ? rgba.b : rgba.a;
}

float troikaGlyphUvToDistance(vec2 uv) {
  return troikaSdfValueToSignedDistance(troikaGlyphUvToSdfValue(uv));
}

float troikaGetAADist() {
  
  #if defined(GL_OES_standard_derivatives) || __VERSION__ >= 300
  return length(fwidth(vTroikaGlyphUV * vTroikaGlyphDimensions)) * 0.5;
  #else
  return vTroikaGlyphDimensions.x / 64.0;
  #endif
}

float troikaGetFragDistValue() {
  vec2 clampedGlyphUV = clamp(vTroikaGlyphUV, 0.5 / uTroikaSDFGlyphSize, 1.0 - 0.5 / uTroikaSDFGlyphSize);
  float distance = troikaGlyphUvToDistance(clampedGlyphUV);
 
  // Extrapolate distance when outside bounds:
  distance += clampedGlyphUV == vTroikaGlyphUV ? 0.0 : 
    length((vTroikaGlyphUV - clampedGlyphUV) * vTroikaGlyphDimensions);

  

  return distance;
}

float troikaGetEdgeAlpha(float distance, float distanceOffset, float aaDist) {
  #if defined(IS_DEPTH_MATERIAL) || defined(IS_DISTANCE_MATERIAL)
  float alpha = step(-distanceOffset, -distance);
  #else

  float alpha = smoothstep(
    distanceOffset + aaDist,
    distanceOffset - aaDist,
    distance
  );
  #endif

  return alpha;
}
`,i0=`
float aaDist = troikaGetAADist();
float fragDistance = troikaGetFragDistValue();
float edgeAlpha = uTroikaSDFDebug ?
  troikaGlyphUvToSdfValue(vTroikaGlyphUV) :
  troikaGetEdgeAlpha(fragDistance, uTroikaEdgeOffset, max(aaDist, uTroikaBlurRadius));

#if !defined(IS_DEPTH_MATERIAL) && !defined(IS_DISTANCE_MATERIAL)
vec4 fillRGBA = gl_FragColor;
fillRGBA.a *= uTroikaFillOpacity;
vec4 strokeRGBA = uTroikaStrokeWidth == 0.0 ? fillRGBA : vec4(uTroikaStrokeColor, uTroikaStrokeOpacity);
if (fillRGBA.a == 0.0) fillRGBA.rgb = strokeRGBA.rgb;
gl_FragColor = mix(fillRGBA, strokeRGBA, smoothstep(
  -uTroikaStrokeWidth - aaDist,
  -uTroikaStrokeWidth + aaDist,
  fragDistance
));
gl_FragColor.a *= edgeAlpha;
#endif

if (edgeAlpha == 0.0) {
  discard;
}
`;function r0(s){const e=Go(s,{chained:!0,extensions:{derivatives:!0},uniforms:{uTroikaSDFTexture:{value:null},uTroikaSDFTextureSize:{value:new Oe},uTroikaSDFGlyphSize:{value:0},uTroikaSDFExponent:{value:0},uTroikaTotalBounds:{value:new ht(0,0,0,0)},uTroikaClipRect:{value:new ht(0,0,0,0)},uTroikaEdgeOffset:{value:0},uTroikaFillOpacity:{value:1},uTroikaPositionOffset:{value:new Oe},uTroikaCurveRadius:{value:0},uTroikaBlurRadius:{value:0},uTroikaStrokeWidth:{value:0},uTroikaStrokeColor:{value:new Ve},uTroikaStrokeOpacity:{value:1},uTroikaOrient:{value:new Ke},uTroikaUseGlyphColors:{value:!0},uTroikaSDFDebug:{value:!1}},vertexDefs:e0,vertexTransform:t0,fragmentDefs:n0,fragmentColorTransform:i0,customRewriter({vertexShader:t,fragmentShader:n}){let i=/\buniform\s+vec3\s+diffuse\b/;return i.test(n)&&(n=n.replace(i,"varying vec3 vTroikaGlyphColor").replace(/\bdiffuse\b/g,"vTroikaGlyphColor"),i.test(t)||(t=t.replace(Sh,`uniform vec3 diffuse;
$&
vTroikaGlyphColor = uTroikaUseGlyphColors ? aTroikaGlyphColor / 255.0 : diffuse;
`))),{vertexShader:t,fragmentShader:n}}});return e.transparent=!0,e.forceSinglePass=!0,Object.defineProperties(e,{isTroikaTextMaterial:{value:!0},shadowSide:{get(){return this.side},set(){}}}),e}const Qo=new _r({color:16777215,side:sn,transparent:!0}),vc=8421504,xc=new it,ss=new W,bo=new W,lr=[],s0=new W,Eo="+x+y";function yc(s){return Array.isArray(s)?s[0]:s}let wh=()=>{const s=new Rt(new ri(1,1),Qo);return wh=()=>s,s},Ah=()=>{const s=new Rt(new ri(1,1,32,1),Qo);return Ah=()=>s,s};const o0={type:"syncstart"},a0={type:"synccomplete"},Ch=["font","fontSize","fontStyle","fontWeight","lang","letterSpacing","lineHeight","maxWidth","overflowWrap","text","direction","textAlign","textIndent","whiteSpace","anchorX","anchorY","colorRanges","sdfGlyphSize"],l0=Ch.concat("material","color","depthOffset","clipRect","curveRadius","orientation","glyphGeometryDetail");class Rh extends Rt{constructor(){const e=new $v;super(e,null),this.text="",this.anchorX=0,this.anchorY=0,this.curveRadius=0,this.direction="auto",this.font=null,this.unicodeFontsURL=null,this.fontSize=.1,this.fontWeight="normal",this.fontStyle="normal",this.lang=null,this.letterSpacing=0,this.lineHeight="normal",this.maxWidth=1/0,this.overflowWrap="normal",this.textAlign="left",this.textIndent=0,this.whiteSpace="normal",this.material=null,this.color=null,this.colorRanges=null,this.outlineWidth=0,this.outlineColor=0,this.outlineOpacity=1,this.outlineBlur=0,this.outlineOffsetX=0,this.outlineOffsetY=0,this.strokeWidth=0,this.strokeColor=vc,this.strokeOpacity=1,this.fillOpacity=1,this.depthOffset=0,this.clipRect=null,this.orientation=Eo,this.glyphGeometryDetail=1,this.sdfGlyphSize=null,this.gpuAccelerateSDF=!0,this.debugSDF=!1}sync(e){this._needsSync&&(this._needsSync=!1,this._isSyncing?(this._queuedSyncs||(this._queuedSyncs=[])).push(e):(this._isSyncing=!0,this.dispatchEvent(o0),Xv({text:this.text,font:this.font,lang:this.lang,fontSize:this.fontSize||.1,fontWeight:this.fontWeight||"normal",fontStyle:this.fontStyle||"normal",letterSpacing:this.letterSpacing||0,lineHeight:this.lineHeight||"normal",maxWidth:this.maxWidth,direction:this.direction||"auto",textAlign:this.textAlign,textIndent:this.textIndent,whiteSpace:this.whiteSpace,overflowWrap:this.overflowWrap,anchorX:this.anchorX,anchorY:this.anchorY,colorRanges:this.colorRanges,includeCaretPositions:!0,sdfGlyphSize:this.sdfGlyphSize,gpuAccelerateSDF:this.gpuAccelerateSDF,unicodeFontsURL:this.unicodeFontsURL},t=>{this._isSyncing=!1,this._textRenderInfo=t,this.geometry.updateGlyphs(t.glyphBounds,t.glyphAtlasIndices,t.blockBounds,t.chunkedBounds,t.glyphColors);const n=this._queuedSyncs;n&&(this._queuedSyncs=null,this._needsSync=!0,this.sync(()=>{n.forEach(i=>i&&i())})),this.dispatchEvent(a0),e&&e()})))}onBeforeRender(e,t,n,i,r,o){this.sync(),r.isTroikaTextMaterial&&this._prepareForRender(r)}dispose(){this.geometry.dispose()}get textRenderInfo(){return this._textRenderInfo||null}createDerivedMaterial(e){return r0(e)}get material(){let e=this._derivedMaterial;const t=this._baseMaterial||this._defaultMaterial||(this._defaultMaterial=Qo.clone());if((!e||!e.isDerivedFrom(t))&&(e=this._derivedMaterial=this.createDerivedMaterial(t),t.addEventListener("dispose",function n(){t.removeEventListener("dispose",n),e.dispose()})),this.hasOutline()){let n=e._outlineMtl;return n||(n=e._outlineMtl=Object.create(e,{id:{value:e.id+.1}}),n.isTextOutlineMaterial=!0,n.depthWrite=!1,n.map=null,e.addEventListener("dispose",function i(){e.removeEventListener("dispose",i),n.dispose()})),[n,e]}else return e}set material(e){e&&e.isTroikaTextMaterial?(this._derivedMaterial=e,this._baseMaterial=e.baseMaterial):this._baseMaterial=e}hasOutline(){return!!(this.outlineWidth||this.outlineBlur||this.outlineOffsetX||this.outlineOffsetY)}get glyphGeometryDetail(){return this.geometry.detail}set glyphGeometryDetail(e){this.geometry.detail=e}get curveRadius(){return this.geometry.curveRadius}set curveRadius(e){this.geometry.curveRadius=e}get customDepthMaterial(){return yc(this.material).getDepthMaterial()}set customDepthMaterial(e){}get customDistanceMaterial(){return yc(this.material).getDistanceMaterial()}set customDistanceMaterial(e){}_prepareForRender(e){const t=e.isTextOutlineMaterial,n=e.uniforms,i=this.textRenderInfo;if(i){const{sdfTexture:a,blockBounds:l}=i;n.uTroikaSDFTexture.value=a,n.uTroikaSDFTextureSize.value.set(a.image.width,a.image.height),n.uTroikaSDFGlyphSize.value=i.sdfGlyphSize,n.uTroikaSDFExponent.value=i.sdfExponent,n.uTroikaTotalBounds.value.fromArray(l),n.uTroikaUseGlyphColors.value=!t&&!!i.glyphColors;let c=0,h=0,d=0,u,f,g,_=0,p=0;if(t){let{outlineWidth:S,outlineOffsetX:v,outlineOffsetY:b,outlineBlur:R,outlineOpacity:w}=this;c=this._parsePercent(S)||0,h=Math.max(0,this._parsePercent(R)||0),u=w,_=this._parsePercent(v)||0,p=this._parsePercent(b)||0}else d=Math.max(0,this._parsePercent(this.strokeWidth)||0),d&&(g=this.strokeColor,n.uTroikaStrokeColor.value.set(g??vc),f=this.strokeOpacity,f==null&&(f=1)),u=this.fillOpacity;n.uTroikaEdgeOffset.value=c,n.uTroikaPositionOffset.value.set(_,p),n.uTroikaBlurRadius.value=h,n.uTroikaStrokeWidth.value=d,n.uTroikaStrokeOpacity.value=f,n.uTroikaFillOpacity.value=u??1,n.uTroikaCurveRadius.value=this.curveRadius||0;let m=this.clipRect;if(m&&Array.isArray(m)&&m.length===4)n.uTroikaClipRect.value.fromArray(m);else{const S=(this.fontSize||.1)*100;n.uTroikaClipRect.value.set(l[0]-S,l[1]-S,l[2]+S,l[3]+S)}this.geometry.applyClipRect(n.uTroikaClipRect.value)}n.uTroikaSDFDebug.value=!!this.debugSDF,e.polygonOffset=!!this.depthOffset,e.polygonOffsetFactor=e.polygonOffsetUnits=this.depthOffset||0;const r=t?this.outlineColor||0:this.color;if(r==null)delete e.color;else{const a=e.hasOwnProperty("color")?e.color:e.color=new Ve;(r!==a._input||typeof r=="object")&&a.set(a._input=r)}let o=this.orientation||Eo;if(o!==e._orientation){let a=n.uTroikaOrient.value;o=o.replace(/[^-+xyz]/g,"");let l=o!==Eo&&o.match(/^([-+])([xyz])([-+])([xyz])$/);if(l){let[,c,h,d,u]=l;ss.set(0,0,0)[h]=c==="-"?1:-1,bo.set(0,0,0)[u]=d==="-"?-1:1,xc.lookAt(s0,ss.cross(bo),bo),a.setFromMatrix4(xc)}else a.identity();e._orientation=o}}_parsePercent(e){if(typeof e=="string"){let t=e.match(/^(-?[\d.]+)%$/),n=t?parseFloat(t[1]):NaN;e=(isNaN(n)?0:n/100)*this.fontSize}return e}localPositionToTextCoords(e,t=new Oe){t.copy(e);const n=this.curveRadius;return n&&(t.x=Math.atan2(e.x,Math.abs(n)-Math.abs(e.z))*Math.abs(n)),t}worldPositionToTextCoords(e,t=new Oe){return ss.copy(e),this.localPositionToTextCoords(this.worldToLocal(ss),t)}raycast(e,t){const{textRenderInfo:n,curveRadius:i}=this;if(n){const r=n.blockBounds,o=i?Ah():wh(),a=o.geometry,{position:l,uv:c}=a.attributes;for(let h=0;h<c.count;h++){let d=r[0]+c.getX(h)*(r[2]-r[0]);const u=r[1]+c.getY(h)*(r[3]-r[1]);let f=0;i&&(f=i-Math.cos(d/i)*i,d=Math.sin(d/i)*i),l.setXYZ(h,d,u,f)}a.boundingSphere=this.geometry.boundingSphere,a.boundingBox=this.geometry.boundingBox,o.matrixWorld=this.matrixWorld,o.material.side=this.material.side,lr.length=0,o.raycast(e,lr);for(let h=0;h<lr.length;h++)lr[h].object=this,t.push(lr[h])}}copy(e){const t=this.geometry;return super.copy(e),this.geometry=t,l0.forEach(n=>{this[n]=e[n]}),this}clone(){return new this.constructor().copy(this)}}Ch.forEach(s=>{const e="_private_"+s;Object.defineProperty(Rh.prototype,s,{get(){return this[e]},set(t){t!==this[e]&&(this[e]=t,this._needsSync=!0)}})});new Sn;new Ve;const c0=6,h0=5;function u0(s,e,t,n,i){const r=new Set,o=[],a=Math.min(s.length,e.length/3);for(let l=0;l<a;l+=1){const c=s[l];if(n!==null&&n.has(c)){r.size<i&&r.add(c);continue}const h=e[l*3]-t.x,d=e[l*3+1]-t.y,u=e[l*3+2]-t.z;o.push({id:c,d2:h*h+d*d+u*u})}o.sort((l,c)=>l.d2-c.d2);for(const l of o){if(r.size>=i)break;r.add(l.id)}return r}class d0{constructor(e,t,n){this.scene=e,this.store=t,this.engine=n,this.active=new Map,this.pool=[],this.theme=null,this.styleStamp=0}applyTheme(e){this.theme=e,this.styleStamp+=1}_styleText(e){const{label:t}=this.theme;e.fontSize=t.size,e.color=t.color,e.outlineColor=t.halo,e.outlineWidth=t.size*.12,e.anchorX="center",e.anchorY="bottom",e.userData.styleStamp=this.styleStamp}_acquire(e){const t=this.pool.pop()??new Rh;return t.parent||this.scene.add(t),t.visible=!0,t.userData.opacity=0,t.userData.text=null,this.active.set(e,t),t}_release(e,t){t.visible=!1,this.active.delete(e),this.pool.push(t)}update(e,t,n,i){if(!this.theme)return;const r=this.theme.label.budget??200,o=u0(this.engine.ids,this.engine.positions,t.position,n,r);for(const l of o)!this.active.has(l)&&this.store.nodes.has(l)&&this._acquire(l);const a=Math.min(1,e*c0);for(const[l,c]of this.active){const h=this.store.nodes.get(l),d=i.get(l);if(!h||!d){this._release(l,c);continue}const u=o.has(l)?1:0;if(c.userData.opacity+=(u-c.userData.opacity)*a,u===0&&c.userData.opacity<.02){this._release(l,c);continue}c.fillOpacity=c.userData.opacity,c.outlineOpacity=c.userData.opacity;const f=vh(h,this.store.nodeTypes,this.theme);c.position.set(d.x,d.y+h0*f.size,d.z),c.quaternion.copy(t.quaternion);const g=c.userData.styleStamp!==this.styleStamp;(c.userData.text!==h.label||g)&&(g&&this._styleText(c),c.text=h.label,c.userData.text=h.label,c.sync())}}}const Sc=8,f0=1;function p0(s,e,t){const n=[];for(const c of s){const h=t.get(c);if(!h)return null;n.push(h)}const i=[];let r=0;for(let c=0;c<n.length-1;c+=1){const h=n[c+1].x-n[c].x,d=n[c+1].y-n[c].y,u=n[c+1].z-n[c].z,f=Math.hypot(h,d,u);i.push(f),r+=f}if(r===0)return{x:n[0].x,y:n[0].y,z:n[0].z};let a=Math.max(0,Math.min(1,e))*r;for(let c=0;c<i.length;c+=1){if(a<=i[c]||c===i.length-1){const h=i[c]===0?0:a/i[c],d=n[c],u=n[c+1];return{x:d.x+(u.x-d.x)*h,y:d.y+(u.y-d.y)*h,z:d.z+(u.z-d.z)*h}}a-=i[c]}const l=n[n.length-1];return{x:l.x,y:l.y,z:l.z}}function Mc(s,e){let t=0;for(let n=0;n<s.length-1;n+=1){const i=e.get(s[n]),r=e.get(s[n+1]);if(!i||!r)return 0;t+=Math.hypot(r.x-i.x,r.y-i.y,r.z-i.z)}return t}function m0(s,e,t){if(s.color)return s.color;if(e&&e.color)return e.color;const n=t.palette??[];return s.type_index!=null&&n.length>0?n[s.type_index%n.length]:t.flow.color}class g0{constructor(e,t){this.path=e.path,this.flowType=e.flow_type??null,this.typeIndex=e.type_index??null,this.color=e.color??null,this.size=e.size??null,this.count=e.count,this.interval=Math.max(.001,e.interval??.2),this.speed=e.speed??1,this.flowId=e.flow_id??null,this.emitted=0,this.nextEmit=t,this.particles=[],this.done=!1}step(e,t){for(;this.nextEmit<=e&&(this.count===null||this.emitted<this.count);)this.particles.push({born:this.nextEmit}),this.emitted+=1,this.nextEmit+=this.interval;t>0&&(this.particles=this.particles.filter(n=>e-n.born<t)),this.count!==null&&this.emitted>=this.count&&this.particles.length===0&&(this.done=!0)}}class _0{constructor(e,{now:t=()=>performance.now()/1e3}={}){this.store=e,this.now=t,this.flows=[],this.persistent=new Map}applyFlow(e){const t=new g0(e,this.now());if(t.flowId!==null){const n=this.persistent.get(t.flowId);n&&(this.flows=this.flows.filter(i=>i!==n)),this.persistent.set(t.flowId,t)}this.flows.push(t)}stopFlow(e){const t=this.persistent.get(e);t&&(this.persistent.delete(e),this.flows=this.flows.filter(n=>n!==t))}replayInit(e){this.flows=this.flows.filter(t=>t.flowId===null),this.persistent.clear();for(const t of e)this.applyFlow(t)}activeCount(){return this.flows.length}_speedOf(e){var n;const t=((n=this.store.flowTypes)==null?void 0:n[e.flowType])??null;return e.speed*((t==null?void 0:t.speed)??1)}update(e,t){var a;const n=this.now(),i=((a=t==null?void 0:t.flow)==null?void 0:a.baseSpeed)??0,r=this._display;for(const l of this.flows){let c=0;if(i>0&&r){const h=Mc(l.path,r),d=i*this._speedOf(l);c=h>0&&d>0?h/d:0}l.step(n,c)}const o=this.store.nodes;this.flows=this.flows.filter(l=>l.flowId===null&&l.done?!1:o&&l.path.some(c=>!o.has(c))?(l.flowId!==null&&this.persistent.delete(l.flowId),!1):!0)}setDisplay(e){this._display=e}particles(){var r;const e=this._display,t=this._theme,n=[];if(!e||!t){for(const o of this.flows)for(const a of o.particles)n.push({x:0,y:0,z:0,color:"#ffffff"});return n}const i=this.now();for(const o of this.flows){const a=Mc(o.path,e),l=(t.flow.baseSpeed??0)*this._speedOf(o),c=a>0&&l>0?a/l:0,h=((r=this.store.flowTypes)==null?void 0:r[o.flowType])??null,d=m0(o,h,t),u=o.size??(h==null?void 0:h.size)??t.flow.size;for(const f of o.particles){const g=c>0?(i-f.born)/c:0,_=p0(o.path,g,e);_&&n.push({x:_.x,y:_.y,z:_.z,color:d,size:u})}}return n}prepare(e,t){this._display=e,this._theme=t}}class v0{constructor(e,t,n){this.scene=e,this.store=t,this.controller=n,this.theme=null,this.capacity=0,this.mesh=null,this._matrix=new it,this._color=new Ve,this._ensureCapacity(1024)}_ensureCapacity(e){var r;if(this.mesh&&e<=this.capacity)return;const t=Math.max(1024,2**Math.ceil(Math.log2(Math.max(1,e))));this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh.dispose());const n=new As(f0,Sc,Sc),i=new _r({color:16777215,transparent:!0,opacity:((r=this.theme)==null?void 0:r.flow.opacity)??.85,blending:hs,depthWrite:!1});this.mesh=new hh(n,i,t),this.mesh.count=0,this.mesh.frustumCulled=!1,this.scene.add(this.mesh),this.capacity=t}applyTheme(e){this.theme=e,this.mesh&&(this.mesh.material.opacity=e.flow.opacity)}update(e,t,n){this.theme=t,this.controller.prepare(n,t),this.controller.update(e,t);const i=this.controller.particles();this._ensureCapacity(i.length);const r=this.mesh;for(let o=0;o<i.length;o+=1){const a=i[o],l=a.size??t.flow.size;this._matrix.makeScale(l,l,l),this._matrix.setPosition(a.x,a.y,a.z),r.setMatrixAt(o,this._matrix),this._color.set(a.color),r.setColorAt(o,this._color)}r.count=i.length,r.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0)}particleCount(){return this.mesh?this.mesh.count:0}dispose(){this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh.dispose(),this.mesh=null)}}const Vo=12,x0=.5;function y0(s,e,t,n=Vo){const i=(s.x+e.x)/2,r=(s.y+e.y)/2,o=(s.z+e.z)/2;let a=i,l=r,c=o;const h=e.x-s.x,d=e.y-s.y,u=e.z-s.z,f=Math.hypot(h,d,u);if(t>0&&f>0){const _=h/f,p=d/f,m=u/f;let S=-m,v=0,b=_;Math.hypot(S,v,b)<1e-6&&(S=0,v=m,b=-p);const R=Math.hypot(S,v,b)||1,w=t*f*x0;a=i+S/R*w,l=r+v/R*w,c=o+b/R*w}const g=[];for(let _=0;_<=n;_+=1){const p=_/n,m=1-p,S=m*m,v=2*m*p,b=p*p;g.push({x:S*s.x+v*a+b*e.x,y:S*s.y+v*l+b*e.y,z:S*s.z+v*c+b*e.z})}return g}const S0=8,M0=.75,bc=.6,wi=600,Ec="__default",Tc={sphere:()=>new As(3,12,8),box:()=>new Gi(4.8,4.8,4.8),octahedron:()=>new Ko(3.6),tetrahedron:()=>new Zo(4.2)};class b0{constructor(e,t,n,{onCameraReady:i=()=>{}}={}){this.container=e,this.store=t,this.engine=n,this.onCameraReady=i,this.display=new Map,this.theme=_h("modern"),this.scene=new L_,this.camera=null,this.controls=null,this.webgl=new U_({antialias:!0}),this.webgl.setSize(e.clientWidth,e.clientHeight,!1),this.webgl.setPixelRatio(window.devicePixelRatio),this.webgl.domElement.style.cssText="display:block;width:100%;height:100%",e.appendChild(this.webgl.domElement),this.ambient=new G_,this.scene.add(this.ambient),this.sun=new z_,this.sun.position.set(1,2,3),this.scene.add(this.sun),this.meshes=new Map,this._counts=new Map,this.composer=null,this.bloomPass=null,this.bloomDisabled=!1,this.onFrame=null,this.edgeCapacity=0,this.edgeLines=null,this.edgeStyle="line",this.edgeElasticity=0,this._ensureEdgeCapacity(8192),this.clock=new fh,this._matrix=new it,this.raycaster=new V_,this._pointer=new Oe,this._tmpColor=new Ve,this._bgColor=new Ve,this._edgeColor=new Ve,this._edgeBase=new Ve("#666666"),this._edgeGlow=new Ve("#eaf2ff"),this.frameIndex=0,this._boundsStamp=-1,this.highlightSet=null,this.focusId=null,this.focusElapsed=0,this._focusFrom=new W,this.labels=new d0(this.scene,t,n),this.flowController=new _0(t,{}),this.flows=new v0(this.scene,t,this.flowController),this.applyTheme(this.theme),t.subscribe(r=>{r.kind==="init"&&!this.camera&&this._initCamera(t.config.dimensions)}),this._onResizeBound=()=>this._onResize(),window.addEventListener("resize",this._onResizeBound)}dispose(){var e,t,n;this.webgl.setAnimationLoop(null),window.removeEventListener("resize",this._onResizeBound);for(const i of this.meshes.values())i.geometry.dispose(),i.material.dispose();this.edgeLines&&(this.edgeLines.geometry.dispose(),this.edgeLines.material.dispose()),(e=this.flows)!=null&&e.mesh&&(this.flows.mesh.geometry.dispose(),this.flows.mesh.material.dispose());for(const i of[...this.labels.active.values(),...this.labels.pool])i.dispose();(t=this.bloomPass)==null||t.dispose(),(n=this.composer)==null||n.dispose(),this.webgl.dispose(),this.webgl.domElement.remove()}applyTheme(e){this.theme=e,this._bgColor.set(e.background),this.scene.background=new Ve(e.background),this.ambient.color.set(e.lights.ambient.color),this.ambient.intensity=e.lights.ambient.intensity,this.sun.color.set(e.lights.directional.color),this.sun.intensity=e.lights.directional.intensity,this._edgeBase.set(e.edge.color),this._edgeGlow.set(e.edge.glow??"#6fb8e8"),this.edgeLines.material.opacity=e.edge.opacity;for(const t of this.meshes.values())t.material.emissive.set(e.node.emissive),t.material.emissiveIntensity=e.node.emissiveIntensity;this.labels.applyTheme(e),this.flows.applyTheme(e),this._syncBloom()}setEdgeStyle({style:e,elasticity:t}={}){this.edgeStyle=e==="spline"?"spline":"line",this.edgeElasticity=Math.max(0,Math.min(1,t??0))}_syncBloom(){const e=!!(this.theme.bloom.enabled&&!this.bloomDisabled&&this.camera);if(e&&!this.composer){const t=new Oe;this.webgl.getSize(t),this.composer=new rv(this.webgl),this.composer.setPixelRatio(this.webgl.getPixelRatio()),this.composer.setSize(t.x,t.y),this.composer.addPass(new sv(this.scene,this.camera)),this.bloomPass=new ki(t.clone(),this.theme.bloom.strength,this.theme.bloom.radius,this.theme.bloom.threshold),this.composer.addPass(this.bloomPass)}else!e&&this.composer?(this.bloomPass.dispose(),this.composer.dispose(),this.composer=null,this.bloomPass=null):this.composer&&(this.bloomPass.strength=this.theme.bloom.strength,this.bloomPass.radius=this.theme.bloom.radius,this.bloomPass.threshold=this.theme.bloom.threshold)}disableBloom(){this.bloomDisabled=!0,this._syncBloom()}setPixelRatio(e){var t;this.webgl.setPixelRatio(e),(t=this.composer)==null||t.setPixelRatio(e)}_buildCamera(e){const t=this.container.clientWidth/this.container.clientHeight;e===2?(this.camera=new Es(-wi*t,wi*t,wi,-wi,-1e4,1e4),this.camera.position.set(0,0,1e3),this.controls=new sc(this.camera,this.webgl.domElement),this.controls.enableDamping=!0,this.controls.enableRotate=!1,this.controls.screenSpacePanning=!0,this.controls.mouseButtons={LEFT:_n.PAN,MIDDLE:_n.DOLLY,RIGHT:_n.PAN},this.controls.touches={ONE:Un.PAN,TWO:Un.DOLLY_PAN}):(this.camera=new jt(60,t,1,5e4),this.camera.position.set(0,0,900),this.controls=new sc(this.camera,this.webgl.domElement),this.controls.enableDamping=!0,this.controls.minDistance=20,this.controls.maxDistance=2e4)}_initCamera(e){this.camera||(this._buildCamera(e),this.onCameraReady())}setDimensions(e){var t,n;this.camera&&(this.camera.isOrthographicCamera?2:3)===e||((t=this.controls)==null||t.dispose(),this.composer&&((n=this.bloomPass)==null||n.dispose(),this.composer.dispose(),this.composer=null,this.bloomPass=null),this._buildCamera(e),this.onCameraReady())}resize(){this._onResize()}_onResize(){var t,n;if(this.webgl.setSize(this.container.clientWidth,this.container.clientHeight,!1),!this.camera)return;const e=this.container.clientWidth/this.container.clientHeight;this.camera.isOrthographicCamera?(this.camera.left=-wi*e,this.camera.right=wi*e):this.camera.aspect=e,this.camera.updateProjectionMatrix(),(t=this.composer)==null||t.setSize(this.container.clientWidth,this.container.clientHeight),(n=this.bloomPass)==null||n.setSize(this.container.clientWidth,this.container.clientHeight)}_ensureMesh(e,t,n){let i=this.meshes.get(e);if(i&&i.userData.shape===t&&n<=i.userData.capacity)return i;const r=Math.max(256,2**Math.ceil(Math.log2(Math.max(1,n))));i&&(this.scene.remove(i),i.geometry.dispose(),i.material.dispose(),i.dispose());const o=(Tc[t]??Tc.sphere)(),a=new O_({color:16777215,roughness:.4,emissive:new Ve(this.theme.node.emissive),emissiveIntensity:this.theme.node.emissiveIntensity});return i=new hh(o,a,r),i.count=0,i.userData={shape:t,capacity:r,ids:[],cursor:0},this.scene.add(i),this.meshes.set(e,i),i}_ensureEdgeCapacity(e){if(e<=this.edgeCapacity)return;const t=Math.max(8192,2**Math.ceil(Math.log2(e)));this.edgeLines&&(this.scene.remove(this.edgeLines),this.edgeLines.geometry.dispose(),this.edgeLines.material.dispose());const n=new Gt;n.setAttribute("position",new zt(new Float32Array(t*3),3)),n.setAttribute("color",new zt(new Float32Array(t*3),3)),n.setDrawRange(0,0),this.edgeLines=new N_(n,new uh({vertexColors:!0,transparent:!0,opacity:this.theme.edge.opacity})),this.edgeLines.frustumCulled=!1,this.scene.add(this.edgeLines),this.edgeCapacity=t}start(){this.webgl.setAnimationLoop(()=>this._frame())}_frame(){const e=this.clock.getDelta();this.camera&&(this.frameIndex+=1,this.onFrame&&this.onFrame(e),this._syncNodes(e),this._syncEdges(),this.labels.update(e,this.camera,this.highlightSet,this.display),this.flows.update(e,this.theme,this.display),this._stepFocus(e),this.controls.update(),this._syncBloom(),this.composer?this.composer.render():this.webgl.render(this.scene,this.camera))}_meshKey(e){return e&&e.type!=null&&this.store.nodeTypes[e.type]?e.type:Ec}_syncNodes(e){const{ids:t,positions:n}=this.engine,i=Math.min(t.length,n.length/3),r=Math.min(1,e*S0),o=new Set;for(let a=0;a<i;a+=1){const l=t[a];o.add(l);const c=n[a*3],h=n[a*3+1],d=n[a*3+2];let u=this.display.get(l);u||(u=new W(c,h,d),this.display.set(l,u)),u.x+=(c-u.x)*r,u.y+=(h-u.y)*r,u.z+=(d-u.z)*r}for(const a of this.display.keys())o.has(a)||this.display.delete(a);this._counts.clear();for(let a=0;a<i;a+=1){const l=this._meshKey(this.store.nodes.get(t[a]));this._counts.set(l,(this._counts.get(l)??0)+1)}for(const[a,l]of this._counts){const c=a===Ec?this.theme.node.shape:this.store.nodeTypes[a].shape??this.theme.node.shape,h=this._ensureMesh(a,c,l);h.userData.cursor=0,h.userData.ids.length=l}for(const[a,l]of this.meshes)this._counts.has(a)||(l.count=0,l.userData.ids.length=0);for(let a=0;a<i;a+=1){const l=t[a],c=this.store.nodes.get(l)??{id:l,type:null,meta:{}},h=this.meshes.get(this._meshKey(c)),d=h.userData.cursor;h.userData.cursor+=1,h.userData.ids[d]=l;const u=vh(c,this.store.nodeTypes,this.theme),f=this.display.get(l);this._matrix.makeScale(u.size,u.size,u.size),this._matrix.setPosition(f.x,f.y,f.z),h.setMatrixAt(d,this._matrix),this._tmpColor.set(u.color),this.highlightSet!==null&&!this.highlightSet.has(l)&&this._tmpColor.lerp(this._bgColor,M0),h.setColorAt(d,this._tmpColor)}for(const[a,l]of this.meshes)this._counts.has(a)&&(l.count=l.userData.cursor,l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0))}_syncEdges(){const{edges:e}=this.store,t=this.edgeStyle==="spline"&&this.edgeElasticity>0,n=t?Vo*2:2;this._ensureEdgeCapacity(e.size*n);const i=this.edgeLines.geometry.getAttribute("position"),r=this.edgeLines.geometry.getAttribute("color");let o=0;for(const a of e.values()){const l=this.display.get(a.source),c=this.display.get(a.target);if(!l||!c)continue;const h=this._edgeColor,d=a.meta?Number(a.meta.brightness):NaN;if(a.meta&&a.meta.color?h.set(a.meta.color):Number.isFinite(d)?h.copy(this._edgeBase).lerp(this._edgeGlow,Math.max(0,Math.min(1,d))):h.copy(this._edgeBase),t){const u=y0(l,c,this.edgeElasticity,Vo);for(let f=0;f<u.length-1;f+=1)i.setXYZ(o,u[f].x,u[f].y,u[f].z),r.setXYZ(o,h.r,h.g,h.b),o+=1,i.setXYZ(o,u[f+1].x,u[f+1].y,u[f+1].z),r.setXYZ(o,h.r,h.g,h.b),o+=1}else i.setXYZ(o,l.x,l.y,l.z),r.setXYZ(o,h.r,h.g,h.b),o+=1,i.setXYZ(o,c.x,c.y,c.z),r.setXYZ(o,h.r,h.g,h.b),o+=1}this.edgeLines.geometry.setDrawRange(0,o),i.needsUpdate=!0,r.needsUpdate=!0}nodeCount(){let e=0;for(const t of this.meshes.values())e+=t.count;return e}pick(e,t){if(!this.camera||this.meshes.size===0)return null;const n=this.webgl.domElement.getBoundingClientRect();if(this._pointer.x=(e-n.left)/n.width*2-1,this._pointer.y=-((t-n.top)/n.height)*2+1,this._boundsStamp!==this.frameIndex){for(const o of this.meshes.values())o.count>0&&o.computeBoundingSphere();this._boundsStamp=this.frameIndex}this.raycaster.setFromCamera(this._pointer,this.camera);const i=[...this.meshes.values()].filter(o=>o.count>0),r=this.raycaster.intersectObjects(i,!1)[0];return!r||r.instanceId===void 0?null:r.object.userData.ids[r.instanceId]??null}viewState(){if(!this.camera||!this.controls)return null;const e=this.camera.position,t=this.controls.target;return{position:{x:e.x,y:e.y,z:e.z},target:{x:t.x,y:t.y,z:t.z},zoom:this.camera.zoom}}setHighlight(e){this.highlightSet=e}focusOn(e){this.controls&&(this.focusId=e,this.focusElapsed=0,this._focusFrom.copy(this.controls.target))}_stepFocus(e){if(this.focusId===null)return;if(!this.store.nodes.has(this.focusId)){this.focusId=null;return}const t=this.display.get(this.focusId);if(!t)return;this.focusElapsed=Math.min(this.focusElapsed+e,bc);const n=this.focusElapsed/bc,i=1-(1-n)**3;this.controls.target.lerpVectors(this._focusFrom,t,i),n>=1&&(this.focusId=null)}}const E0=Object.freeze({physicsRunning:!0,edgeStyle:"line",edgeElasticity:.3,dimensions:3});function T0(s){return String(s??"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"viewbase"}function Ph(s){return`vb-options:${T0(s)}`}function w0(s,e=globalThis.localStorage,t=E0){if(!e)return{...t};try{const n=e.getItem(Ph(s));if(!n)return{...t};const i=JSON.parse(n);return{...t,...i}}catch{return{...t}}}function To(s,e,t=globalThis.localStorage){t&&t.setItem(Ph(s),JSON.stringify(e))}class A0{constructor({container:e,sendEvent:t}){this.container=e,this.sendEvent=t,this.remoteGroups=[],this.optionsGroup=null,this.openGroup=null,this.el=document.createElement("div"),this.el.dataset.role="vb-screen-menu",this.el.style.cssText=["position:absolute","top:0","left:0","right:0","z-index:1400","font:12px system-ui,sans-serif"].join(";"),this.bar=document.createElement("div"),this.bar.dataset.role="vb-screen-menu-bar",this.bar.style.cssText=["display:grid","grid-template-columns:1fr auto 1fr","align-items:center","height:26px","padding:0 6px","background:rgba(230,230,235,0.95)","border:1px solid rgba(0,0,0,0.4)","box-sizing:border-box","cursor:ns-resize","user-select:none"].join(";"),this.el.appendChild(this.bar),this.groupsEl=document.createElement("div"),this.groupsEl.style.cssText="display:flex;justify-self:start;min-width:0",this.bar.appendChild(this.groupsEl),this.centerEl=document.createElement("div"),this.centerEl.style.cssText=["display:flex","align-items:center","gap:8px","justify-self:center","min-width:0"].join(";"),this.titleEl=document.createElement("span"),this.titleEl.dataset.role="vb-screen-bar-title",this.titleEl.style.cssText=["overflow:hidden","text-overflow:ellipsis","white-space:nowrap","font-weight:600"].join(";"),this.metricsEl=document.createElement("span"),this.metricsEl.dataset.role="vb-screen-bar-metrics",this.metricsEl.style.cssText="color:#555;white-space:nowrap",this.centerEl.append(this.titleEl,this.metricsEl),this.bar.appendChild(this.centerEl),this.gadgetsEl=document.createElement("div"),this.gadgetsEl.style.cssText="display:flex;gap:3px;justify-self:end",this.bar.appendChild(this.gadgetsEl),this.dropdown=document.createElement("div"),this.dropdown.dataset.role="vb-screen-menu-dropdown",this.dropdown.style.cssText=["position:absolute","top:100%","left:0","display:none","background:#d4d4d4","border:1px solid #000","min-width:190px","box-shadow:0 4px 8px rgba(0,0,0,0.3)"].join(";"),this.el.appendChild(this.dropdown),e.appendChild(this.el),this._onOutsideClick=n=>{this.el.contains(n.target)||this._closeDropdown()},document.addEventListener("pointerdown",this._onOutsideClick)}setTitle(e){this.titleEl.textContent=e}setMetrics(e){this.metricsEl.textContent=e?`· ${e}`:""}addGadget(e,t,n,i){const r=document.createElement("button");return r.dataset.role=e,r.title=n,r.style.cssText=["width:20px","height:16px","padding:0","border:none","flex:none","cursor:pointer","background:#000",`-webkit-mask:url("${t}") center/100% 100% no-repeat`,`mask:url("${t}") center/100% 100% no-repeat`].join(";"),r.addEventListener("pointerdown",o=>o.stopPropagation()),r.addEventListener("click",o=>{o.stopPropagation(),i()}),this.gadgetsEl.appendChild(r),r}setSpec(e){this.remoteGroups=e&&Array.isArray(e.groups)?e.groups:[],this._render()}setOptionsGroup(e){this.optionsGroup=e?{name:"Options",items:e,local:!0}:null,this._render()}_allGroups(){return this.optionsGroup?[this.optionsGroup,...this.remoteGroups]:this.remoteGroups}_render(){this.groupsEl.replaceChildren();const e=this._allGroups();for(const t of e){const n=document.createElement("button");n.dataset.role="vb-menu-group",n.dataset.group=t.name,n.textContent=t.name;const i=t.name===this.openGroup;n.style.cssText=["padding:4px 12px","border:none","cursor:pointer","font:inherit",i?"background:#3b7bc4;color:#fff":"background:transparent;color:#000"].join(";"),n.addEventListener("pointerdown",r=>r.stopPropagation()),n.addEventListener("click",r=>{r.stopPropagation(),this._toggleGroup(t)}),this.groupsEl.appendChild(n)}if(this.openGroup){const t=e.find(n=>n.name===this.openGroup);t?this._renderDropdown(t):this._closeDropdown()}}_toggleGroup(e){if(this.openGroup===e.name){this._closeDropdown();return}this.openGroup=e.name,this._render(),this._renderDropdown(e)}_renderDropdown(e){this.dropdown.replaceChildren();for(const t of e.items){const n=document.createElement("div");n.dataset.role="vb-menu-item",n.style.cssText=["padding:5px 16px","cursor:pointer","white-space:nowrap","display:flex","align-items:center","justify-content:space-between","gap:16px","color:#000"].join(";");const i=document.createElement("span");if(i.textContent=t.label,n.appendChild(i),e.local){n.dataset.itemKey=t.key;const r=document.createElement("span");r.dataset.role="vb-menu-checkbox",r.textContent=t.checked?"✓":"",r.style.cssText="width:1em;display:inline-block;font-weight:700",n.appendChild(r),n.addEventListener("click",o=>{o.stopPropagation(),t.onToggle(!t.checked)})}else n.dataset.itemId=t.id,n.addEventListener("click",r=>{r.stopPropagation(),this.sendEvent({type:"event",event:"menu_select",payload:{item_id:t.id}}),this._closeDropdown()});n.addEventListener("pointerenter",()=>{n.style.background="#3b7bc4",n.style.color="#fff"}),n.addEventListener("pointerleave",()=>{n.style.background="",n.style.color="#000"}),this.dropdown.appendChild(n)}this.dropdown.style.display="block"}_closeDropdown(){this.openGroup!==null&&(this.openGroup=null,this.dropdown.style.display="none",this._render())}destroy(){document.removeEventListener("pointerdown",this._onOutsideClick),this.el.remove()}}function C0({container:s,screenId:e,connection:t}){const n=new ur,i=new K_(n);let r=null,o=null,a=null;const l=new xu(s,n,()=>r,A=>d.setOptionsGroup(A??o)),c=l.openGraph({screenId:e,optionsProvider:()=>o,onResize:()=>a==null?void 0:a.resize()}),h=A=>t.send({...A,screen_id:e}),d=new A0({container:s,sendEvent:h});let u=!0,f=!1;function g(){i.setPaused(f||!u)}function _(A){var B,ie;const I={physicsRunning:!0,edgeStyle:((B=n.config.edge_style)==null?void 0:B.style)??"line",edgeElasticity:((ie=n.config.edge_style)==null?void 0:ie.elasticity)??.3,dimensions:n.config.dimensions??3},z=w0(A,void 0,I);u=z.physicsRunning,g(),a.setEdgeStyle({style:z.edgeStyle,elasticity:z.edgeElasticity}),p(z.dimensions),m(A,z)}function p(A){a.setDimensions(A),i.setDimensions(A),n.config.dimensions=A}function m(A,I){o=[{key:"physics-running",label:"Fyzika běží",checked:I.physicsRunning,onToggle:z=>{I.physicsRunning=z,u=z,g(),To(A,I),m(A,I)}},{key:"edge-spline",label:"Křivkové hrany (splajn)",checked:I.edgeStyle==="spline",onToggle:z=>{I.edgeStyle=z?"spline":"line",a.setEdgeStyle({style:I.edgeStyle,elasticity:I.edgeElasticity}),To(A,I),m(A,I)}},{key:"dimensions-3d",label:"3D pohled",checked:I.dimensions===3,onToggle:z=>{I.dimensions=z?3:2,p(I.dimensions),To(A,I),m(A,I)}}],l.refreshOptions()}function S(A,I){const z=I??n.config.highlight_neighbors??1,B=yu(n,A,z);a.setHighlight(B.size>0?B:null)}let v=null;a=new b0(c.body,n,i,{onCameraReady:()=>{const A=a.camera.isOrthographicCamera;v?v.setCameraControls(a.camera,a.controls,A):(new q_(a.webgl.domElement,(z,B)=>a.pick(z,B),h,{onNodeClick:z=>{var ie;const B=n.config.highlight_neighbors??1;B>0&&S(z,B),a.focusOn(z),(ie=n.config.detail_window)!=null&&ie.open_on_click&&l.openFor(z)},onBackgroundClick:()=>{a.setHighlight(null)}}),v=new X_(a.camera,a.controls,{is2d:A}));const I=wo(()=>{const z=a.viewState();z&&h(Li("view_change",z))},100);a.controls.addEventListener("change",I)}});function b(A){const I=_h(A);r=I,a.applyTheme(I),fv(I,s),l.applyTheme(),s.style.background=I.background??"#000"}const R=A=>{A===1&&a.disableBloom(),A===2&&a.setPixelRatio(1)},w=new J_(R);let T=null;function U(A){A<=0||(T=T===null?1/A:T+(1/A-T)*Math.min(1,A*2))}const E=wo(()=>{const A=T===null?"–":Math.round(T);d.setMetrics(`${n.nodes.size} uzlů · ${A} fps`)},500);n.subscribe(A=>{A.kind==="patch"&&l.onPatch(A.patch)}),n.subscribe(A=>{if(A.kind!=="init")return;c.setTitle(n.config.title||"Graf"),a.flowController.replayInit(n.flows??[]),b(n.config.theme),a.setEdgeStyle(n.config.edge_style??{style:"line",elasticity:0}),_(n.config.title),d.setSpec(n.menu);for(const z of n.windows??[])z.kind==="terminal"?l.openTerminal(z,F):l.openControl(z,y);n.config.title&&(document.title=`${n.config.title} – viewbase`);const I=n.config.quality??"auto";I==="low"&&(R(1),R(2)),a.onFrame=z=>{U(z),E(),I==="auto"&&w.frame(z)}});function y(A){h(Li("window_submit",A))}function F(A){h(Li("terminal_input",A))}const L={show_detail:A=>l.openFor(A.node_id),focus:A=>a.focusOn(A.node_id),highlight:A=>S(A.node_id,A.depth),flow:A=>a.flowController.applyFlow(A),stop_flow:A=>a.flowController.stopFlow(A.flow_id),set_theme:A=>{n.config.theme=A.theme,b(A.theme)},open_window:A=>A.kind==="terminal"?l.openTerminal(A,F):l.openControl(A,y),close_window:A=>l.closeControl(A.window_id),terminal_append:A=>l.terminalAppend(A.window_id,A.text),set_edge_style:A=>a.setEdgeStyle(A),define_type:A=>n.applyNodeType(A.name,A.style),open_menu:A=>{n.menu={groups:A.groups},d.setSpec(n.menu)}};return a.start(),{screenId:e,store:n,engine:i,renderer:a,windowManager:l,menuBar:d,container:s,handleAction(A){const I=L[A.action];I?I(A):console.warn("viewbase: neznámá akce",A.action)},setActive(A){s.style.display=A?"block":"none",A?a.start():a.webgl.setAnimationLoop(null)},setFullyHidden(A){f=A,g()},destroy(){i.terminate(),a.dispose(),d.destroy(),s.remove()}}}function Uh(s){return Math.max(0,Math.min(1,s))}function R0(s,e,t){return!t||t<=0?s:Uh(s+e/t)}function wc(s,e){return s<=0?"":`translateY(${Math.round(Uh(s)*e)}px)`}function P0(s){if(s.length<2)return s.slice();const[e,t,...n]=s;return[t,e,...n]}const U0=200;class L0{constructor(e,t){this.rootContainer=e,this.connection=t,this.instances=new Map,this.order=[],this.zOrder=[],this.offsets=new Map,this.dragState=null,this.pendingLogs=[],this.logAutoOpened=!1,window.addEventListener("pointerup",()=>{this.dragState=null}),window.addEventListener("pointercancel",()=>{this.dragState=null})}get activeId(){return this.zOrder[0]}_createContainer(e){const t=document.createElement("div");return t.dataset.role="vb-screen",t.dataset.screenId=String(e),t.style.cssText="position:absolute;inset:0",this.rootContainer.appendChild(t),t}_register(e,t){if(this.instances.set(e,t),this.order.push(e),this.offsets.set(e,0),this.zOrder.push(e),this._wireScreenChrome(e,t),this._layout(),this.pendingLogs.length>0){const n=this.pendingLogs;this.pendingLogs=[];for(const i of n)this.appendLog(i)}}ensure(e){let t=this.instances.get(e);return t||(t=C0({container:this._createContainer(e),screenId:e,connection:this.connection}),t.store.subscribe(n=>{n.kind==="init"&&this._renderTitle(e)}),this._register(e,t),t)}resolveStore(e){return this.ensure(e).store}appendLog(e){const t=[...this.instances.values()].map(n=>{var i;return(i=n.windowManager)==null?void 0:i.logWindow()}).filter(Boolean);if(t.length===0){if(this.logAutoOpened)return;const n=this.instances.get(this.zOrder[0]);if(!(n!=null&&n.windowManager)){this.pendingLogs.length<U0&&this.pendingLogs.push(e);return}this.logAutoOpened=!0,t.push(n.windowManager.openLog())}for(const n of t)n.append(e)}routeAction(e){var t;(t=this.instances.get(e.screen_id??null))==null||t.handleAction(e)}cycleNext(){this.zOrder.length<2||(this.zOrder=P0(this.zOrder),this.offsets.set(this.zOrder[0],0),this.offsets.set(this.zOrder[1],0),this._layout())}_layout(){this.zOrder.forEach((e,t)=>{const n=this.instances.get(e),i=this.offsets.get(e)??0;t===0?(n.setActive(!0),n.container.style.zIndex="20",n.container.style.transform=wc(i,n.container.clientHeight||0)):t===1?(n.setActive(!0),n.container.style.zIndex="10",n.container.style.transform=wc(i,n.container.clientHeight||0)):(n.setActive(!1),n.container.style.zIndex="0",n.container.style.transform=""),n.setFullyHidden(t>=2)})}remove(e){var n;const t=this.instances.get(e);t&&((n=t.windowManager)!=null&&n.logWindow()&&(this.logAutoOpened=!1),t.destroy(),this.instances.delete(e),this.order=this.order.filter(i=>i!==e),this.zOrder=this.zOrder.filter(i=>i!==e),this.offsets.delete(e),this.zOrder.length>0&&this._layout())}_renderTitle(e){var n,i,r;const t=this.instances.get(e);t&&((r=t.menuBar)==null||r.setTitle(((i=(n=t.store)==null?void 0:n.config)==null?void 0:i.title)||`Screen ${e}`))}_wireScreenChrome(e,t){const n=t.menuBar;n&&(this._renderTitle(e),n.addGadget("vb-screen-switch",Kh,"Přepnout na další screen",()=>this.cycleNext()),this._wireDrag(e,n.bar))}_wireDrag(e,t){t.addEventListener("pointerdown",i=>{this.zOrder[0]===e&&(this.dragState={screenId:e,startY:i.clientY,startOffset:this.offsets.get(e)??0},t.setPointerCapture(i.pointerId))}),t.addEventListener("pointermove",i=>{if(!this.dragState||this.dragState.screenId!==e)return;const r=this.instances.get(e);if(!r)return;const o=i.clientY-this.dragState.startY,a=R0(this.dragState.startOffset,o,r.container.clientHeight||0);this.offsets.set(e,a),this._layout()});const n=i=>{if(!(!this.dragState||this.dragState.screenId!==e)){this.dragState=null;try{t.releasePointerCapture(i.pointerId)}catch{}}};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n),t.addEventListener("lostpointercapture",n)}}const Lh=new Xh,Jn=new Wh;window.addEventListener("error",s=>{Jn.show("frontend_error",`${s.message}
${s.filename}:${s.lineno}:${s.colno}`)});window.addEventListener("unhandledrejection",s=>{var e;Jn.show("frontend_error",String(((e=s.reason)==null?void 0:e.stack)??s.reason))});function D0(){try{const s=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(s.getContext("webgl2")||s.getContext("webgl")))}catch{return!1}}function I0(){const s=document.getElementById("app");let e;const t=location.protocol==="https:"?"wss":"ws",n=new zh(`${t}://${location.host}/ws`,null,{resolveStore:i=>e.resolveStore(i),onStatus:i=>{i==="init"?(Lh.hide(),Jn.dismissIfConnectionRecovered()):i==="close"?Jn.show("connection_lost","Spojení se serverem vypadlo – zkouším se znovu připojit…"):i==="connect_failed"?Jn.show("connection_lost","Spojení se serverem se nezdařilo – zkouším se znovu připojit…"):i==="protocol_mismatch"&&Jn.show("connection_lost","Server běží s jinou verzí protokolu – obnovte stránku (F5).")},onAction:i=>{i.action==="screen_remove"?e.remove(i.screen_id):e.routeAction(i)},onLog:i=>{i.timestamp=new Date,e.appendLog(i),i.level==="error"&&Jn.show("backend_error",Rc(i))}});e=new L0(s,n),n.connect(),window.__viewbase={screenManager:e,connection:n}}D0()?I0():Lh.show("Tento prohlížeč nemá dostupné WebGL – vizualizaci nelze spustit. Zkus jiný prohlížeč nebo zapni hardwarovou akceleraci.");
