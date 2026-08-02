(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Dh=1;function Ih(){return{type:"hello",protocol:Dh}}function pa(s){return JSON.stringify(s)}function Fh(s){const e=JSON.parse(s);if(!e||typeof e!="object"||!e.type)throw new Error("Neplatná zpráva protokolu");return e}class Nh{constructor(e,t,{WebSocketImpl:n=globalThis.WebSocket,schedule:i=(d,u)=>setTimeout(d,u),minBackoff:r=500,maxBackoff:o=1e4,onStatus:a=()=>{},onAction:l=()=>{},onLog:c=()=>{},resolveStore:h=null}={}){this.url=e,this.store=t,this.WebSocketImpl=n,this.schedule=i,this.minBackoff=r,this.maxBackoff=o,this.backoff=r,this.onStatus=a,this.onAction=l,this.onLog=c,this.resolveStore=h,this.stopped=!1,this.everConnected=!1,this.ws=null}_storeFor(e){if(this.resolveStore){const t=this.resolveStore(e);if(t)return t}return this.store}connect(){const e=new this.WebSocketImpl(this.url);this.ws=e,e.onopen=()=>{this.everConnected=!0,this.backoff=this.minBackoff,e.send(pa(Ih()))},e.onmessage=t=>this._onMessage(t.data),e.onclose=()=>{this.stopped||(this.onStatus(this.everConnected?"close":"connect_failed"),this.schedule(()=>this.connect(),this.backoff),this.backoff=Math.min(this.backoff*2,this.maxBackoff))}}_onMessage(e){let t;try{t=Fh(e)}catch(n){console.warn("viewbase: vadná zpráva ze serveru",n);return}t.type==="init"?(this._storeFor(t.screen_id).applyInit(t),this.onStatus("init")):t.type==="patch"?this._storeFor(t.screen_id).applyPatch(t)||this.ws.close():t.type==="action"?this.onAction(t):t.type==="log"?this.onLog(t):t.type==="error"&&(console.error("viewbase server:",t.error),t.error==="protocol_mismatch"&&(this.stopped=!0,this.onStatus("protocol_mismatch")))}send(e){this.ws&&this.ws.readyState===1&&this.ws.send(pa(e))}}const ma="vb-guru-style";function Oh(){if(document.getElementById(ma))return;const s=document.createElement("style");s.id=ma,s.textContent=`
    @keyframes vb-guru-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.15; } }
  `,document.head.appendChild(s)}class Bh{constructor(e=document.body){Oh(),this.reason=null,this.el=document.createElement("div"),this.el.dataset.role="vb-guru-meditation",this.el.style.cssText=["position:fixed","inset:0","z-index:9999","display:none","background:#000000","cursor:pointer",'font-family:"Courier New",monospace',"user-select:none"].join(";"),this.box=document.createElement("div"),this.box.dataset.role="vb-guru-box",this.box.style.cssText=["position:absolute","top:50%","left:50%","transform:translate(-50%,-50%)","border:3px solid #ff0000","padding:18px 28px","color:#ff0000","text-align:center","font-size:18px","font-weight:bold","letter-spacing:0.5px","white-space:pre-wrap","word-break:break-word","width:max-content","max-width:80%","box-sizing:border-box","animation:vb-guru-blink 1s step-start infinite"].join(";"),this.bar=document.createElement("div"),this.bar.dataset.role="vb-guru-bar",this.bar.textContent="Software Failure.  Press mouse button or Esc to continue.",this.code=document.createElement("div"),this.code.dataset.role="vb-guru-code",this.code.style.cssText="margin-top:6px",this.box.append(this.bar,this.code),this.el.append(this.box),this.el.addEventListener("mousedown",()=>this.hide()),this._onKeydown=t=>{t.code==="Escape"&&this.visible&&(t.preventDefault(),this.hide())},window.addEventListener("keydown",this._onKeydown),e.appendChild(this.el)}show(e,t){this.reason=e,this.code.textContent=t??e,this.el.style.display="block"}hide(){this.el.style.display="none",this.reason=null}get visible(){return this.el.style.display!=="none"}dismissIfConnectionRecovered(){this.reason==="connection_lost"&&this.hide()}}class kh{constructor(e=document.body){this.el=document.createElement("div"),this.el.dataset.role="status-overlay",this.el.style.cssText=["position:fixed","top:16px","left:50%","transform:translateX(-50%)","max-width:70%","padding:10px 18px","border-radius:6px","background:var(--vb-status-bg, rgba(20,23,28,0.85))","color:var(--vb-status-fg, #ffffff)","font:14px/1.4 system-ui,sans-serif","z-index:1000","display:none","pointer-events:none","text-align:center"].join(";"),e.appendChild(this.el)}show(e){this.el.textContent=e,this.el.style.display="block"}hide(){this.el.style.display="none"}}const zh="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAYAAAC9+TVUAAAALklEQVR4nGNgGAU0AYx45P6TqJ4oQ/7jUshEqsnYwKghmICFAT/4T0B+FNASAAAy+AQNJ950wAAAAABJRU5ErkJggg==",Gh="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAARElEQVR4nGNgGAWUAkY0/n8K9GIFxBqIUx0TA5UBE7UNZKEgCP5jC1MWKgX+f7p6+T+1LaEoGTExDPVkQ/MwHQUMGAAAyPMKFTpfYu8AAAAASUVORK5CYII=",Hh="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAOklEQVR4nGNgGCyAEYn9n1z9LEQazIhFHdxSJgYqAKbhZQgLFrH/lBrCOLTDhIkahrCg8f9Tw9AhDgDcVQUfvazRGgAAAABJRU5ErkJggg==";function Eo(s,{onStart:e,onMove:t,onEnd:n=()=>{}}){let i=null;const r=o=>{if(i===null)return;const a=i;i=null;try{s.releasePointerCapture(o.pointerId)}catch{}n(o,a)};s.addEventListener("pointerdown",o=>{const a=e(o);a!=null&&(i=a,s.setPointerCapture(o.pointerId))}),s.addEventListener("pointermove",o=>{if(i!==null){if(o.buttons===0){r(o);return}t(o,i)}}),s.addEventListener("pointerup",r),s.addEventListener("pointercancel",r),s.addEventListener("lostpointercapture",r)}const ga=26;function Tc(s){return Math.max(0,Math.min(1,s))}function Vh(s,e,t){return!t||t<=0?s:Tc(s+e/t)}function _a(s,e){return s<=0?"":`translateY(${Math.round(Tc(s)*e)}px)`}function Wh(s){if(s.length<2)return s.slice();const[e,t,...n]=s;return[t,e,...n]}function Os(s,e,t,n,i){const r=Math.max(0,i.width-t),o=Math.max(0,i.height-n);return{x:Math.min(Math.max(0,s),r),y:Math.min(Math.max(0,e),o)}}function Xh(s,e,t,n,i){return{x:s*(e+t),y:n-i}}const va=160,Yh=8,xa=28,jh="vb-pos:",wc=180,Ac=90,ya=28,qh="0.35";function Kh(s,e){const t=s??e;return t?jh+String(t):null}function Zh(s,e,t,n,i,r){const o=Math.max(1,i==null?void 0:i.w),a=Math.max(1,i==null?void 0:i.h),l=Math.max(a,Math.min(s.h+n,r.height-s.y));if(e==="sw"){const h=s.x+s.w,d=Math.max(o,Math.min(s.w-t,h));return{x:h-d,y:s.y,w:d,h:l}}const c=Math.max(o,Math.min(s.w+t,r.width-s.x));return{x:s.x,y:s.y,w:c,h:l}}class fr{constructor({id:e,title:t,widthChars:n,container:i,manager:r,kind:o,closable:a=!0,optionsProvider:l=null}){this.id=e,this.title=t,this.widthChars=n,this.container=i,this.manager=r,this.kind=o,this.closable=a!==!1,this.optionsProvider=l,this.isMinimized=!1,this.saved=null,this.maximizedFrom=null,this.dragOffset=null,this.resizeState=null,this.size=null,this.grips=[],this.body=null,this.el=document.createElement("div"),this.el.dataset.role="vb-window",this.el.dataset.windowId=String(e),this.el.style.cssText=["position:absolute","left:0","top:0","box-sizing:border-box","background:var(--vb-window-body-bg, rgba(255,255,255,0.97))","color:var(--vb-window-body-fg, #1f2430)","box-shadow:var(--vb-window-shadow, 0 6px 20px rgba(0,0,0,0.22))","border:1px solid var(--vb-window-border, transparent)","border-radius:6px","overflow:hidden","user-select:none","font:13px/1.5 system-ui,sans-serif","z-index:900"].join(";"),this._buildHeader()}_buildBody(){}_renderBody(){}_mount(){this.container.appendChild(this.el),this._buildGrips();const e=this._loadPos();e&&Number.isFinite(e.w)&&Number.isFinite(e.h)&&this._applySize(e.w,e.h);const t=this._bounds(),n=this.manager.windows.size%8*24,i=Os(40+n,40+n,this._boxW(),this._boxH(),t),r=e?Os(e.x,e.y,this._boxW(),this._boxH(),t):i;this._place(r.x,r.y),this.el.addEventListener("pointerdown",()=>this.bringToFront())}_posKey(){return Kh(this.id,this.title)}_loadPos(){const e=this._posKey();if(!e)return null;try{const t=localStorage.getItem(e);if(!t)return null;const n=JSON.parse(t);if(Number.isFinite(n==null?void 0:n.x)&&Number.isFinite(n==null?void 0:n.y))return n}catch{}return null}_savePos(){const e=this._posKey();if(!e)return;const t={x:this.x,y:this.y};this.size&&(t.w=this.size.w,t.h=this.size.h);try{localStorage.setItem(e,JSON.stringify(t))}catch{}}_width(){return this.widthChars*8+24}_boxW(){return this.size?this.size.w:this._width()}_boxH(){return this.size?this.size.h:200}_bounds(){return{width:this.container.clientWidth||800,height:this.container.clientHeight||600}}_buildHeader(){const e=document.createElement("div");e.dataset.role="vb-titlebar",e.style.cssText=["display:flex","align-items:center","gap:6px","padding:4px 6px","cursor:move","background:var(--vb-window-header-bg, #d8dde6)","background-image:var(--vb-window-header-pattern, none)","color:var(--vb-window-header-fg, #1f2430)"].join(";"),this.closeGadget=null,this.closable&&(this.closeGadget=this._gadget("close",zh),this.closeGadget.addEventListener("click",t=>{t.stopPropagation(),this.close()})),this.titleEl=document.createElement("div"),this.titleEl.textContent=this.title,this.titleEl.style.cssText=["flex:1","text-align:left","font-weight:600","white-space:nowrap","overflow:hidden","text-overflow:ellipsis"].join(";"),this.minGadget=this._gadget("minimize",Hh),this.minGadget.addEventListener("click",t=>{t.stopPropagation(),this.minimize()}),this.restoreGadget=this._gadget("restore",Gh),this.restoreGadget.addEventListener("click",t=>{t.stopPropagation(),this.restore()}),this.restoreGadget.style.display="none",this.closeGadget&&e.append(this.closeGadget),e.append(this.titleEl,this.minGadget,this.restoreGadget),this._dragFromHeader(e),e.addEventListener("dblclick",t=>{t.target.dataset.gadget||this.toggleMaximize()}),this.bar=e,this.el.appendChild(e)}_gadget(e,t){const n=document.createElement("button");return n.dataset.gadget=e,n.style.cssText=["flex:0 0 auto","width:18px","height:18px","padding:0","border:none","cursor:pointer","background:var(--vb-window-gadget, #5a6573)",`-webkit-mask:url("${t}") center/100% 100% no-repeat`,`mask:url("${t}") center/100% 100% no-repeat`].join(";"),n}_dragFromHeader(e){Eo(e,{onStart:t=>{if(t.target.dataset.gadget)return null;this.bringToFront();const n=this.el.getBoundingClientRect(),i=this.container.getBoundingClientRect();return this.dragOffset={x:t.clientX-n.left,y:t.clientY-n.top,contLeft:i.left,contTop:i.top},this.dragOffset},onMove:(t,n)=>{if(this.isMinimized)return;const i=t.clientX-n.contLeft-n.x,r=t.clientY-n.contTop-n.y,o=Os(i,r,this._boxW(),this._headerH(),this._bounds());this._place(o.x,o.y)},onEnd:()=>{this.dragOffset=null,this.isMinimized||this._savePos()}})}_headerH(){return this.bar.offsetHeight||xa}_buildGrips(){this.grips=["se","sw"].map(e=>{const t=document.createElement("div");return t.dataset.role=`vb-resize-${e}`,t.style.cssText=["position:absolute","bottom:2px",e==="se"?"right:2px":"left:2px",`width:${ya}px`,`height:${ya}px`,"box-sizing:border-box","border-radius:3px","background:var(--vb-window-gadget, #8a93a3)","border:1px solid var(--vb-window-gadget, #8a93a3)","opacity:0","transition:opacity 0.12s","touch-action:none",`cursor:${e==="se"?"nwse":"nesw"}-resize`].join(";"),t.addEventListener("pointerenter",()=>this._showGrip(t,!0)),t.addEventListener("pointerleave",()=>this._showGrip(t,!1)),this._resizeFromGrip(t,e),this.el.appendChild(t),t})}_showGrip(e,t){!t&&this.resizeState||(e.style.opacity=t&&!this.isMinimized?qh:"0")}_resizeFromGrip(e,t){Eo(e,{onStart:n=>{if(this.isMinimized)return null;n.stopPropagation(),this.bringToFront();const i=this.el.getBoundingClientRect();return this.resizeState={corner:t,pointerX:n.clientX,pointerY:n.clientY,start:{x:this.x,y:this.y,w:i.width||this._boxW(),h:i.height||this._boxH()}},this._showGrip(e,!0),this.resizeState},onMove:(n,i)=>{if(this.isMinimized)return;const r=Zh(i.start,i.corner,n.clientX-i.pointerX,n.clientY-i.pointerY,{w:wc,h:Ac},this._bounds());this._place(r.x,r.y),this._applySize(r.w,r.h)},onEnd:()=>{this.resizeState=null,this._showGrip(e,!1),this._savePos()}})}_applySize(e,t){this.size={w:Math.round(e),h:Math.round(t)},this.el.style.width=`${this.size.w}px`,this.el.style.height=`${this.size.h}px`,this.body&&(this.body.style.boxSizing="border-box",this.body.style.width="100%",this.body.style.maxWidth="none",this.body.style.height=`${Math.max(0,this.size.h-this._headerH())}px`,this.body.style.overflow="auto")}_place(e,t){this.x=e,this.y=t,this.el.style.left=`${e}px`,this.el.style.top=`${t}px`}toggleMaximize(){if(this.isMinimized)return;const e=this._bounds();if(this.maximizedFrom){const t=this.maximizedFrom;this.maximizedFrom=null,this._applySize(t.w,t.h),this._place(t.x,t.y)}else{const t=this.el.getBoundingClientRect();this.maximizedFrom={x:this.x,y:this.y,w:t.width||this._boxW(),h:t.height||this._boxH()},this._place(0,ga),this._applySize(e.width,e.height-ga)}this._savePos()}minimize(){if(this.isMinimized)return;this.isMinimized=!0,this.saved={x:this.x,y:this.y},this.body.style.display="none",this.minGadget.style.display="none",this.restoreGadget.style.display="",this.el.dataset.role="vb-dock-strip",this.el.style.background="var(--vb-window-dock-bg, #c2c9d4)",this.el.style.width=`${va}px`,this.el.style.height="";for(const i of this.grips)i.style.display="none";this.titleEl.style.fontSize="11px";const e=this.manager._assignDockSlot(this),t=this._bounds(),n=Xh(e,va,Yh,t.height,xa);this._place(n.x,n.y)}restore(){if(!this.isMinimized)return;this.isMinimized=!1,this.manager._releaseDockSlot(this),this.el.dataset.role="vb-window",this.el.style.background="var(--vb-window-body-bg, rgba(255,255,255,0.97))",this.el.style.width="",this.titleEl.style.fontSize="",this.body.style.display="",this.minGadget.style.display="",this.restoreGadget.style.display="none";for(const t of this.grips)t.style.display="";this.size&&this._applySize(this.size.w,this.size.h),this._renderBody();const e=this.saved??{x:40,y:40};this._place(e.x,e.y),this.bringToFront()}getOptionsItems(){return this.optionsProvider?this.optionsProvider():null}bringToFront(){this.setZ(this.manager._nextZ()),this.manager._setActive(this)}setZ(e){this.el.style.zIndex=String(e)}applyTheme(){this.isMinimized||this._renderBody()}close(){this.isMinimized&&this.manager._releaseDockSlot(this),this.el.remove(),this.manager._forget(this.id)}}const Cc=["debug","info","warning","error"],Rc=["frontend","backend_api","backend_program","backend_user"];function Jh(){return{levels:Object.fromEntries(Cc.map(s=>[s,!0])),sources:Object.fromEntries(Rc.map(s=>[s,!0]))}}function Qh(s,e){return!(e.levels[s.level]===!1||e.sources[s.source]===!1)}function $h(s){const e=s instanceof Date?s:new Date(s),t=n=>String(n).padStart(2,"0");return`${t(e.getHours())}:${t(e.getMinutes())}:${t(e.getSeconds())}`}function Pc(s){const e=s.component?`${s.source}/${s.component}`:s.source;return`${s.timestamp?`${$h(s.timestamp)} `:""}[${s.level}] ${e}: ${s.message}`}const eu=1e3,Vo="__log";class tu extends fr{constructor({container:e,manager:t}){super({id:Vo,title:"Log",widthChars:64,container:e,manager:t,kind:"log",closable:!1}),this.filters=Jh(),this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="log-body",e.style.cssText=["padding:6px 8px",`width:${this.widthChars}ch`,"max-width:92vw","height:240px","overflow-y:auto","font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace","white-space:pre-wrap","word-break:break-word"].join(";"),this.body=e,this.el.appendChild(e)}append(e){if(!Qh(e,this.filters))return;const t=document.createElement("div");for(t.dataset.role="log-row",t.textContent=Pc(e),this.body.appendChild(t);this.body.childElementCount>eu;)this.body.firstElementChild.remove();this.body.scrollTop=this.body.scrollHeight}getOptionsItems(){const e=(t,n)=>i=>{this.filters[t][n]=i,this.manager.refreshOptions()};return[...Cc.map(t=>({key:`level-${t}`,label:t,checked:this.filters.levels[t]!==!1,onToggle:e("levels",t)})),...Rc.map(t=>({key:`source-${t}`,label:t,checked:this.filters.sources[t]!==!1,onToggle:e("sources",t)}))]}_renderBody(){}}function nu({container:s,windowManager:e}){return e.registerType("log",()=>{const t=e.get(Vo);return t?(t.isMinimized&&t.restore(),t):e.adopt(new tu({container:s,manager:e}))}),{name:"log"}}const iu="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAQklEQVR4nGNgGOyAEY3/nwK9WAGxBuJUx8RAZcBEbQNZKAiC/9jClIVKgf+frl7+T21LKEpGTAxDPdmAAE3DlP4AAGatChUYxZWAAAAAAElFTkSuQmCC";class cr{constructor(){this.config={},this.nodeTypes={},this.flowTypes={},this.flows=[],this.windows=[],this.menu=null,this.nodes=new Map,this.edges=new Map,this.seq=-1,this.listeners=new Set}static edgeKey(e,t){return e<=t?`${e}\0${t}`:`${t}\0${e}`}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}_emit(e){for(const t of this.listeners)t(e)}applyInit(e){this.config=e.config,this.nodeTypes=e.node_types,this.flowTypes=e.flow_types??{},this.flows=e.flows??[],this.windows=e.windows??[],this.menu=e.menu??null,this.nodes.clear(),this.edges.clear();for(const t of e.nodes)this.nodes.set(t.id,t);for(const t of e.edges)this.edges.set(cr.edgeKey(t.source,t.target),t);this.seq=e.seq,this._emit({kind:"init"})}applyNodeType(e,t){this.nodeTypes[e]=t??{}}applyPatch(e){if(e.seq!==this.seq+1)return!1;for(const[t,n]of e.remove_edges)this.edges.delete(cr.edgeKey(t,n));for(const t of e.remove_nodes){this.nodes.delete(t);for(const[n,i]of this.edges)(i.source===t||i.target===t)&&this.edges.delete(n)}for(const t of e.add_nodes)this.nodes.set(t.id,t);for(const t of e.update_nodes)this.nodes.set(t.id,t);for(const t of e.add_edges){if(!this.nodes.has(t.source)||!this.nodes.has(t.target)){console.warn("viewbase: hrana s neznámým koncem přeskočena",t.source,t.target);continue}this.edges.set(cr.edgeKey(t.source,t.target),t)}return this.seq=e.seq,this._emit({kind:"patch",patch:e}),!0}}function To(s,e,{now:t=()=>Date.now(),schedule:n=(i,r)=>setTimeout(i,r)}={}){let i=-1/0,r=null,o=!1;function a(l){i=t(),s(...l)}return(...l)=>{const c=t()-i;if(!o&&c>=e){a(l);return}r=l,o||(o=!0,n(()=>{o=!1;const h=r;r=null,a(h)},Math.max(0,e-c)))}}const ru=150;function su(s,e){if(s.type==="int"){const t=Math.round(Number(e));return Number.isFinite(t)?Math.max(s.min,Math.min(s.max,t)):s.value}if(s.type==="number"){const t=Number(e);return Number.isFinite(t)?Math.max(s.min,Math.min(s.max,t)):s.value}return s.type==="bool"?typeof e=="boolean"?e:s.value:s.type==="string"?String(e??"").slice(0,s.maxlength):s.type==="enum"&&s.options.some(t=>t.value===e)?e:s.value}function ou(s,e){const t={};for(const n of s)n.key in e&&(t[n.key]=su(n,e[n.key]));return t}class au extends fr{constructor({id:e,title:t,fields:n,widthChars:i,onSubmit:r,container:o,manager:a,live:l=!1,closable:c}){super({id:e,title:t,widthChars:i,container:o,manager:a,kind:"control",closable:c}),this.fields=n,this.onSubmit=r,this.live=!!l,this.inputs=new Map,this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="control-body",e.style.cssText=["padding:8px 10px",`width:${this.widthChars}ch`,"max-width:90vw","font:13px/1.5 system-ui,sans-serif"].join(";"),this.body=e;const t=document.createElement("table");t.style.cssText="border-collapse:collapse;width:100%";for(const n of this.fields){const i=t.insertRow(),r=i.insertCell();r.textContent=n.label,r.style.cssText=["padding:3px 10px 3px 0","white-space:nowrap","color:var(--vb-window-key, #667788)"].join(";");const o=i.insertCell();o.style.cssText="padding:3px 0",this.inputs.set(n.key,this._buildWidget(n,o))}if(e.appendChild(t),this.live){const n=To(()=>this._submit(),ru);e.addEventListener("input",n),e.addEventListener("change",n)}else{const n=document.createElement("button");n.dataset.role="control-apply",n.textContent="Použít",n.style.cssText=["margin-top:8px","padding:3px 12px","cursor:pointer","border:1px solid var(--vb-window-gadget, #8a93a3)","border-radius:4px","background:transparent","color:inherit"].join(";"),n.addEventListener("click",i=>{i.stopPropagation(),this._submit()}),e.appendChild(n)}this.el.appendChild(e)}_buildWidget(e,t){if(e.type==="enum"){const i=document.createElement("select");for(const r of e.options){const o=document.createElement("option");o.value=String(r.value),o.textContent=r.label,String(r.value)===String(e.value)&&(o.selected=!0),i.appendChild(o)}return t.appendChild(i),()=>{var r;return((r=e.options.find(o=>String(o.value)===i.value))==null?void 0:r.value)??e.value}}if(e.type==="int"||e.type==="number"){const i=e.step??(e.type==="int"?1:"any"),r=document.createElement("input");r.type="range",r.min=e.min,r.max=e.max,r.step=i==="any"?(e.max-e.min)/100||"any":i,r.value=e.value;const o=document.createElement("input");return o.type="number",o.min=e.min,o.max=e.max,o.step=i,o.value=e.value,o.style.cssText="width:5em;margin-left:6px",r.addEventListener("input",()=>{o.value=r.value}),o.addEventListener("input",()=>{r.value=o.value}),t.append(r,o),()=>o.value}if(e.type==="bool"){const i=document.createElement("input");return i.type="checkbox",i.checked=!!e.value,t.appendChild(i),()=>i.checked}const n=document.createElement("input");return n.type="text",n.maxLength=e.maxlength,n.value=e.value,t.appendChild(n),()=>n.value}_submit(){const e={};for(const[n,i]of this.inputs)e[n]=i();const t=ou(this.fields,e);this.onSubmit&&this.onSubmit({window_id:this.id,values:t})}_renderBody(){}}const lu=30;function cu({container:s,windowManager:e,sendEvent:t}){return e.registerType("control",n=>{var r;(r=e.get(n.window_id))==null||r.close();const i=e.adopt(new au({id:n.window_id,title:n.title,fields:n.fields,live:n.live,closable:n.closable,widthChars:lu,onSubmit:o=>t({type:"event",event:"window_submit",payload:o}),container:s,manager:e}));return i.bringToFront(),i}),{name:"control"}}function Sa(s,e){const t=(s==null?void 0:s.meta)??{};return e==null?Object.entries(t).map(([n,i])=>({label:n,value:String(i??"")})):e.map(([n,i])=>({label:n,value:String(t[i]??"")}))}function hu(s,e){const t=e instanceof Set?e:new Set(e),n=(s.remove_nodes??[]).filter(o=>t.has(o)),i=new Set(n);return{refresh:(s.update_nodes??[]).map(o=>o.id).filter(o=>t.has(o)&&!i.has(o)),close:n}}class uu extends fr{constructor({nodeId:e,title:t,rows:n,widthChars:i,container:r,manager:o}){super({id:e,title:t,widthChars:i,container:r,manager:o,kind:"detail"}),this.rows=n,this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="detail-body",e.style.cssText=["padding:6px 10px",`width:${this.widthChars}ch`,"max-width:90vw","font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace","overflow:auto"].join(";"),this.body=e,this._renderBody(),this.el.appendChild(e)}_renderBody(){this.body.replaceChildren();const e=document.createElement("table");e.style.cssText="border-collapse:collapse;width:100%";for(const{label:t,value:n}of this.rows){const i=e.insertRow(),r=i.insertCell();r.textContent=t,r.style.cssText=["padding:1px 12px 1px 0","vertical-align:top","white-space:nowrap","color:var(--vb-window-key, #667788)"].join(";");const o=i.insertCell();o.dataset.role="detail-value",o.textContent=n,o.style.cssText=["padding:1px 0","word-break:break-all","cursor:copy"].join(";"),o.addEventListener("click",a=>{a.stopPropagation(),this._copy(n,o)})}this.body.appendChild(e)}_copy(e,t){const n=()=>{t.style.transition="background 0.15s";const i=t.style.background;t.style.background="var(--vb-window-gadget, #8a93a3)",setTimeout(()=>{t.style.background=i},180)};navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(e).then(n).catch(()=>{this._execCopy(e),n()}):(this._execCopy(e),n())}_execCopy(e){try{const t=document.createElement("textarea");t.value=e,t.style.cssText="position:fixed;left:-9999px;top:0",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)}catch{console.warn("viewbase: kopírování do schránky selhalo")}}update({title:e,rows:t}){e!=null&&(this.title=e,this.titleEl.textContent=e),t!=null&&(this.rows=t,this.isMinimized||this._renderBody())}}function du({container:s,windowManager:e,store:t}){const n=()=>{var i;return((i=t.config)==null?void 0:i.detail_window)??{rows:null,width_chars:128,open_on_click:!0}};return e.registerType("detail",({nodeId:i})=>{const r=e.get(i);if(r)return r.isMinimized?r.restore():r.bringToFront(),r;const o=t.nodes.get(i);if(!o)return null;const a=n(),l=e.adopt(new uu({nodeId:i,title:o.label,rows:Sa(o,a.rows),widthChars:a.width_chars,container:s,manager:e}));return l.bringToFront(),l}),t.subscribe(i=>{if(i.kind!=="patch")return;const r=new Set;for(const[c,h]of e.windows)h.kind==="detail"&&r.add(c);if(r.size===0)return;const{refresh:o,close:a}=hu(i.patch,r);for(const c of a)e.close(c);const l=n();for(const c of o){const h=e.get(c),d=t.nodes.get(c);h&&d&&h.update({title:d.label,rows:Sa(d,l.rows)})}}),{name:"detail",actions:{show_detail:i=>e.open("detail",{nodeId:i.node_id})}}}function fu(s,e,t){const n=new Set;if(!s.nodes.has(e)||(n.add(e),t<=0))return n;const i=new Map,r=(a,l)=>{i.has(a)||i.set(a,[]),i.get(a).push(l)};for(const a of s.edges.values())r(a.source,a.target),r(a.target,a.source);let o=[e];for(let a=0;a<t&&o.length>0;a+=1){const l=[];for(const c of o)for(const h of i.get(c)??[])n.has(h)||(n.add(h),l.push(h));o=l}return n}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Wo="165",_n={ROTATE:0,DOLLY:1,PAN:2},Un={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},pu=0,Ma=1,mu=2,Uc=1,gu=2,gn=3,Nn=0,Ft=1,sn=2,yn=0,Ci=1,cs=2,ba=3,Ea=4,_u=5,Kn=100,vu=101,xu=102,yu=103,Su=104,Mu=200,bu=201,Eu=202,Tu=203,wo=204,Ao=205,wu=206,Au=207,Cu=208,Ru=209,Pu=210,Uu=211,Lu=212,Du=213,Iu=214,Fu=0,Nu=1,Ou=2,hs=3,Bu=4,ku=5,zu=6,Gu=7,Lc=0,Hu=1,Vu=2,In=0,Wu=1,Xu=2,Yu=3,ju=4,qu=5,Ku=6,Zu=7,Dc=300,Ui=301,Li=302,Co=303,Ro=304,xs=306,Po=1e3,Qn=1001,Uo=1002,Dt=1003,Ju=1004,wr=1005,kt=1006,Bs=1007,$n=1008,On=1009,Qu=1010,$u=1011,us=1012,Ic=1013,Di=1014,vn=1015,Fn=1016,Fc=1017,Nc=1018,Ii=1020,ed=35902,td=1021,nd=1022,an=1023,id=1024,rd=1025,Ri=1026,Fi=1027,Oc=1028,Bc=1029,sd=1030,kc=1031,zc=1033,ks=33776,zs=33777,Gs=33778,Hs=33779,Ta=35840,wa=35841,Aa=35842,Ca=35843,Ra=36196,Pa=37492,Ua=37496,La=37808,Da=37809,Ia=37810,Fa=37811,Na=37812,Oa=37813,Ba=37814,ka=37815,za=37816,Ga=37817,Ha=37818,Va=37819,Wa=37820,Xa=37821,Vs=36492,Ya=36494,ja=36495,od=36283,qa=36284,Ka=36285,Za=36286,ad=3200,Gc=3201,Hc=0,ld=1,Dn="",nn="srgb",Bn="srgb-linear",Xo="display-p3",ys="display-p3-linear",ds="linear",ot="srgb",fs="rec709",ps="p3",ai=7680,Ja=519,cd=512,hd=513,ud=514,Vc=515,dd=516,fd=517,pd=518,md=519,Qa=35044,$a="300 es",xn=2e3,ms=2001;class ni{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],rs=Math.PI/180,Lo=180/Math.PI;function pr(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(bt[s&255]+bt[s>>8&255]+bt[s>>16&255]+bt[s>>24&255]+"-"+bt[e&255]+bt[e>>8&255]+"-"+bt[e>>16&15|64]+bt[e>>24&255]+"-"+bt[t&63|128]+bt[t>>8&255]+"-"+bt[t>>16&255]+bt[t>>24&255]+bt[n&255]+bt[n>>8&255]+bt[n>>16&255]+bt[n>>24&255]).toLowerCase()}function Ct(s,e,t){return Math.max(e,Math.min(t,s))}function gd(s,e){return(s%e+e)%e}function Ws(s,e,t){return(1-t)*s+t*e}function Ji(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Lt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const _d={DEG2RAD:rs};class Oe{constructor(e=0,t=0){Oe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ke{constructor(e,t,n,i,r,o,a,l,c){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c)}set(e,t,n,i,r,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],_=i[0],p=i[3],m=i[6],M=i[1],x=i[4],E=i[7],R=i[2],w=i[5],T=i[8];return r[0]=o*_+a*M+l*R,r[3]=o*p+a*x+l*w,r[6]=o*m+a*E+l*T,r[1]=c*_+h*M+d*R,r[4]=c*p+h*x+d*w,r[7]=c*m+h*E+d*T,r[2]=u*_+f*M+g*R,r[5]=u*p+f*x+g*w,r[8]=u*m+f*E+g*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,g=t*d+n*u+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(i*c-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=u*_,e[4]=(h*t-i*l)*_,e[5]=(i*r-a*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Xs.makeScale(e,t)),this}rotate(e){return this.premultiply(Xs.makeRotation(-e)),this}translate(e,t){return this.premultiply(Xs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Xs=new Ke;function Wc(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function gs(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function vd(){const s=gs("canvas");return s.style.display="block",s}const el={};function Xc(s){s in el||(el[s]=!0,console.warn(s))}function xd(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const tl=new Ke().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),nl=new Ke().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ar={[Bn]:{transfer:ds,primaries:fs,toReference:s=>s,fromReference:s=>s},[nn]:{transfer:ot,primaries:fs,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[ys]:{transfer:ds,primaries:ps,toReference:s=>s.applyMatrix3(nl),fromReference:s=>s.applyMatrix3(tl)},[Xo]:{transfer:ot,primaries:ps,toReference:s=>s.convertSRGBToLinear().applyMatrix3(nl),fromReference:s=>s.applyMatrix3(tl).convertLinearToSRGB()}},yd=new Set([Bn,ys]),nt={enabled:!0,_workingColorSpace:Bn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!yd.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const n=Ar[e].toReference,i=Ar[t].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return Ar[s].primaries},getTransfer:function(s){return s===Dn?ds:Ar[s].transfer}};function Pi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ys(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let li;class Sd{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{li===void 0&&(li=gs("canvas")),li.width=e.width,li.height=e.height;const n=li.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=li}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=gs("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Pi(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Pi(t[n]/255)*255):t[n]=Pi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Md=0;class Yc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Md++}),this.uuid=pr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(js(i[o].image)):r.push(js(i[o]))}else r=js(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function js(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Sd.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let bd=0;class Tt extends ni{constructor(e=Tt.DEFAULT_IMAGE,t=Tt.DEFAULT_MAPPING,n=Qn,i=Qn,r=kt,o=$n,a=an,l=On,c=Tt.DEFAULT_ANISOTROPY,h=Dn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:bd++}),this.uuid=pr(),this.name="",this.source=new Yc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Dc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Po:e.x=e.x-Math.floor(e.x);break;case Qn:e.x=e.x<0?0:1;break;case Uo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Po:e.y=e.y-Math.floor(e.y);break;case Qn:e.y=e.y<0?0:1;break;case Uo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Tt.DEFAULT_IMAGE=null;Tt.DEFAULT_MAPPING=Dc;Tt.DEFAULT_ANISOTROPY=1;class ht{constructor(e=0,t=0,n=0,i=1){ht.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],_=l[2],p=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(c+1)/2,E=(f+1)/2,R=(m+1)/2,w=(h+u)/4,T=(d+_)/4,U=(g+p)/4;return x>E&&x>R?x<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(x),i=w/n,r=T/n):E>R?E<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(E),n=w/i,r=U/i):R<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(R),n=T/r,i=U/r),this.set(n,i,r,t),this}let M=Math.sqrt((p-g)*(p-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(p-g)/M,this.y=(d-_)/M,this.z=(u-h)/M,this.w=Math.acos((c+f+m-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ed extends ni{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:kt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Tt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Yc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class en extends Ed{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class jc extends Tt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Td extends Tt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ti{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3];const u=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(a===1){e[t+0]=u,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(d!==_||l!==u||c!==f||h!==g){let p=1-a;const m=l*u+c*f+h*g+d*_,M=m>=0?1:-1,x=1-m*m;if(x>Number.EPSILON){const R=Math.sqrt(x),w=Math.atan2(R,m*M);p=Math.sin(p*w)/R,a=Math.sin(a*w)/R}const E=a*M;if(l=l*p+u*E,c=c*p+f*E,h=h*p+g*E,d=d*p+_*E,p===1-a){const R=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=R,c*=R,h*=R,d*=R}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[o],u=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*d+l*f-c*u,e[t+1]=l*g+h*u+c*d-a*f,e[t+2]=c*g+h*f+a*u-l*d,e[t+3]=h*g-a*d-l*u-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),d=a(r/2),u=l(n/2),f=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+a+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>d){const f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>d){const f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ct(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-t)*h)/c,u=Math.sin(t*h)/c;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=i*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class V{constructor(e=0,t=0,n=0){V.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(il.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(il.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-r*i),d=2*(r*n-o*t);return this.x=t+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=i+l*d+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return qs.copy(this).projectOnVector(e),this.sub(qs)}reflect(e){return this.sub(qs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qs=new V,il=new ti;class Sn{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Jt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Jt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Jt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Jt):Jt.fromBufferAttribute(r,o),Jt.applyMatrix4(e.matrixWorld),this.expandByPoint(Jt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Cr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Cr.copy(n.boundingBox)),Cr.applyMatrix4(e.matrixWorld),this.union(Cr)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Jt),Jt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Qi),Rr.subVectors(this.max,Qi),ci.subVectors(e.a,Qi),hi.subVectors(e.b,Qi),ui.subVectors(e.c,Qi),Tn.subVectors(hi,ci),wn.subVectors(ui,hi),Gn.subVectors(ci,ui);let t=[0,-Tn.z,Tn.y,0,-wn.z,wn.y,0,-Gn.z,Gn.y,Tn.z,0,-Tn.x,wn.z,0,-wn.x,Gn.z,0,-Gn.x,-Tn.y,Tn.x,0,-wn.y,wn.x,0,-Gn.y,Gn.x,0];return!Ks(t,ci,hi,ui,Rr)||(t=[1,0,0,0,1,0,0,0,1],!Ks(t,ci,hi,ui,Rr))?!1:(Pr.crossVectors(Tn,wn),t=[Pr.x,Pr.y,Pr.z],Ks(t,ci,hi,ui,Rr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Jt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Jt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(un),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const un=[new V,new V,new V,new V,new V,new V,new V,new V],Jt=new V,Cr=new Sn,ci=new V,hi=new V,ui=new V,Tn=new V,wn=new V,Gn=new V,Qi=new V,Rr=new V,Pr=new V,Hn=new V;function Ks(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Hn.fromArray(s,r);const a=i.x*Math.abs(Hn.x)+i.y*Math.abs(Hn.y)+i.z*Math.abs(Hn.z),l=e.dot(Hn),c=t.dot(Hn),h=n.dot(Hn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const wd=new Sn,$i=new V,Zs=new V;class ii{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):wd.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;$i.subVectors(e,this.center);const t=$i.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector($i,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Zs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint($i.copy(e.center).add(Zs)),this.expandByPoint($i.copy(e.center).sub(Zs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const dn=new V,Js=new V,Ur=new V,An=new V,Qs=new V,Lr=new V,$s=new V;class Ss{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,dn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=dn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(dn.copy(this.origin).addScaledVector(this.direction,t),dn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Js.copy(e).add(t).multiplyScalar(.5),Ur.copy(t).sub(e).normalize(),An.copy(this.origin).sub(Js);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Ur),a=An.dot(this.direction),l=-An.dot(Ur),c=An.lengthSq(),h=Math.abs(1-o*o);let d,u,f,g;if(h>0)if(d=o*l-a,u=o*a-l,g=r*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(Js).addScaledVector(Ur,u),f}intersectSphere(e,t){dn.subVectors(e.center,this.origin);const n=dn.dot(this.direction),i=dn.dot(dn)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,i=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,i=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,o=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,o=(e.min.y-u.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),d>=0?(a=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(a=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,dn)!==null}intersectTriangle(e,t,n,i,r){Qs.subVectors(t,e),Lr.subVectors(n,e),$s.crossVectors(Qs,Lr);let o=this.direction.dot($s),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;An.subVectors(this.origin,e);const l=a*this.direction.dot(Lr.crossVectors(An,Lr));if(l<0)return null;const c=a*this.direction.dot(Qs.cross(An));if(c<0||l+c>o)return null;const h=-a*An.dot($s);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class it{constructor(e,t,n,i,r,o,a,l,c,h,d,u,f,g,_,p){it.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c,h,d,u,f,g,_,p)}set(e,t,n,i,r,o,a,l,c,h,d,u,f,g,_,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=f,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new it().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/di.setFromMatrixColumn(e,0).length(),r=1/di.setFromMatrixColumn(e,1).length(),o=1/di.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=o*h,f=o*d,g=a*h,_=a*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=u-_*c,t[9]=-a*l,t[2]=_-u*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){const u=l*h,f=l*d,g=c*h,_=c*d;t[0]=u+_*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=_+u*a,t[10]=o*l}else if(e.order==="ZXY"){const u=l*h,f=l*d,g=c*h,_=c*d;t[0]=u-_*a,t[4]=-o*d,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=_-u*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const u=o*h,f=o*d,g=a*h,_=a*d;t[0]=l*h,t[4]=g*c-f,t[8]=u*c+_,t[1]=l*d,t[5]=_*c+u,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const u=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=_-u*d,t[8]=g*d+f,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*d+g,t[10]=u-_*d}else if(e.order==="XZY"){const u=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+_,t[5]=o*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=a*h,t[10]=_*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ad,e,Cd)}lookAt(e,t,n){const i=this.elements;return Ot.subVectors(e,t),Ot.lengthSq()===0&&(Ot.z=1),Ot.normalize(),Cn.crossVectors(n,Ot),Cn.lengthSq()===0&&(Math.abs(n.z)===1?Ot.x+=1e-4:Ot.z+=1e-4,Ot.normalize(),Cn.crossVectors(n,Ot)),Cn.normalize(),Dr.crossVectors(Ot,Cn),i[0]=Cn.x,i[4]=Dr.x,i[8]=Ot.x,i[1]=Cn.y,i[5]=Dr.y,i[9]=Ot.y,i[2]=Cn.z,i[6]=Dr.z,i[10]=Ot.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],_=n[6],p=n[10],m=n[14],M=n[3],x=n[7],E=n[11],R=n[15],w=i[0],T=i[4],U=i[8],y=i[12],v=i[1],L=i[5],P=i[9],I=i[13],N=i[2],W=i[6],k=i[10],se=i[14],j=i[3],K=i[7],q=i[11],F=i[15];return r[0]=o*w+a*v+l*N+c*j,r[4]=o*T+a*L+l*W+c*K,r[8]=o*U+a*P+l*k+c*q,r[12]=o*y+a*I+l*se+c*F,r[1]=h*w+d*v+u*N+f*j,r[5]=h*T+d*L+u*W+f*K,r[9]=h*U+d*P+u*k+f*q,r[13]=h*y+d*I+u*se+f*F,r[2]=g*w+_*v+p*N+m*j,r[6]=g*T+_*L+p*W+m*K,r[10]=g*U+_*P+p*k+m*q,r[14]=g*y+_*I+p*se+m*F,r[3]=M*w+x*v+E*N+R*j,r[7]=M*T+x*L+E*W+R*K,r[11]=M*U+x*P+E*k+R*q,r[15]=M*y+x*I+E*se+R*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],_=e[7],p=e[11],m=e[15];return g*(+r*l*d-i*c*d-r*a*u+n*c*u+i*a*f-n*l*f)+_*(+t*l*f-t*c*u+r*o*u-i*o*f+i*c*h-r*l*h)+p*(+t*c*d-t*a*f-r*o*d+n*o*f+r*a*h-n*c*h)+m*(-i*a*h-t*l*d+t*a*u+i*o*d-n*o*u+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],_=e[13],p=e[14],m=e[15],M=d*p*c-_*u*c+_*l*f-a*p*f-d*l*m+a*u*m,x=g*u*c-h*p*c-g*l*f+o*p*f+h*l*m-o*u*m,E=h*_*c-g*d*c+g*a*f-o*_*f-h*a*m+o*d*m,R=g*d*l-h*_*l-g*a*u+o*_*u+h*a*p-o*d*p,w=t*M+n*x+i*E+r*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/w;return e[0]=M*T,e[1]=(_*u*r-d*p*r-_*i*f+n*p*f+d*i*m-n*u*m)*T,e[2]=(a*p*r-_*l*r+_*i*c-n*p*c-a*i*m+n*l*m)*T,e[3]=(d*l*r-a*u*r-d*i*c+n*u*c+a*i*f-n*l*f)*T,e[4]=x*T,e[5]=(h*p*r-g*u*r+g*i*f-t*p*f-h*i*m+t*u*m)*T,e[6]=(g*l*r-o*p*r-g*i*c+t*p*c+o*i*m-t*l*m)*T,e[7]=(o*u*r-h*l*r+h*i*c-t*u*c-o*i*f+t*l*f)*T,e[8]=E*T,e[9]=(g*d*r-h*_*r-g*n*f+t*_*f+h*n*m-t*d*m)*T,e[10]=(o*_*r-g*a*r+g*n*c-t*_*c-o*n*m+t*a*m)*T,e[11]=(h*a*r-o*d*r-h*n*c+t*d*c+o*n*f-t*a*f)*T,e[12]=R*T,e[13]=(h*_*i-g*d*i+g*n*u-t*_*u-h*n*p+t*d*p)*T,e[14]=(g*a*i-o*_*i-g*n*l+t*_*l+o*n*p-t*a*p)*T,e[15]=(o*d*i-h*a*i+h*n*l-t*d*l-o*n*u+t*a*u)*T,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,g=r*d,_=o*h,p=o*d,m=a*d,M=l*c,x=l*h,E=l*d,R=n.x,w=n.y,T=n.z;return i[0]=(1-(_+m))*R,i[1]=(f+E)*R,i[2]=(g-x)*R,i[3]=0,i[4]=(f-E)*w,i[5]=(1-(u+m))*w,i[6]=(p+M)*w,i[7]=0,i[8]=(g+x)*T,i[9]=(p-M)*T,i[10]=(1-(u+_))*T,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=di.set(i[0],i[1],i[2]).length();const o=di.set(i[4],i[5],i[6]).length(),a=di.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Qt.copy(this);const c=1/r,h=1/o,d=1/a;return Qt.elements[0]*=c,Qt.elements[1]*=c,Qt.elements[2]*=c,Qt.elements[4]*=h,Qt.elements[5]*=h,Qt.elements[6]*=h,Qt.elements[8]*=d,Qt.elements[9]*=d,Qt.elements[10]*=d,t.setFromRotationMatrix(Qt),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=xn){const l=this.elements,c=2*r/(t-e),h=2*r/(n-i),d=(t+e)/(t-e),u=(n+i)/(n-i);let f,g;if(a===xn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===ms)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=xn){const l=this.elements,c=1/(t-e),h=1/(n-i),d=1/(o-r),u=(t+e)*c,f=(n+i)*h;let g,_;if(a===xn)g=(o+r)*d,_=-2*d;else if(a===ms)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const di=new V,Qt=new it,Ad=new V(0,0,0),Cd=new V(1,1,1),Cn=new V,Dr=new V,Ot=new V,rl=new it,sl=new ti;class ln{constructor(e=0,t=0,n=0,i=ln.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(Ct(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ct(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ct(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ct(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ct(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return rl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return sl.setFromEuler(this),this.setFromQuaternion(sl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ln.DEFAULT_ORDER="XYZ";class Yo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Rd=0;const ol=new V,fi=new ti,fn=new it,Ir=new V,er=new V,Pd=new V,Ud=new ti,al=new V(1,0,0),ll=new V(0,1,0),cl=new V(0,0,1),hl={type:"added"},Ld={type:"removed"},pi={type:"childadded",child:null},eo={type:"childremoved",child:null};class xt extends ni{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Rd++}),this.uuid=pr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xt.DEFAULT_UP.clone();const e=new V,t=new ln,n=new ti,i=new V(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new it},normalMatrix:{value:new Ke}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return fi.setFromAxisAngle(e,t),this.quaternion.multiply(fi),this}rotateOnWorldAxis(e,t){return fi.setFromAxisAngle(e,t),this.quaternion.premultiply(fi),this}rotateX(e){return this.rotateOnAxis(al,e)}rotateY(e){return this.rotateOnAxis(ll,e)}rotateZ(e){return this.rotateOnAxis(cl,e)}translateOnAxis(e,t){return ol.copy(e).applyQuaternion(this.quaternion),this.position.add(ol.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(al,e)}translateY(e){return this.translateOnAxis(ll,e)}translateZ(e){return this.translateOnAxis(cl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ir.copy(e):Ir.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),er.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fn.lookAt(er,Ir,this.up):fn.lookAt(Ir,er,this.up),this.quaternion.setFromRotationMatrix(fn),i&&(fn.extractRotation(i.matrixWorld),fi.setFromRotationMatrix(fn),this.quaternion.premultiply(fi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(hl),pi.child=e,this.dispatchEvent(pi),pi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ld),eo.child=e,this.dispatchEvent(eo),eo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(fn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(hl),pi.child=e,this.dispatchEvent(pi),pi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,e,Pd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,Ud,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),d=o(e.shapes),u=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}xt.DEFAULT_UP=new V(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const $t=new V,pn=new V,to=new V,mn=new V,mi=new V,gi=new V,ul=new V,no=new V,io=new V,ro=new V;class on{constructor(e=new V,t=new V,n=new V){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),$t.subVectors(e,t),i.cross($t);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){$t.subVectors(i,t),pn.subVectors(n,t),to.subVectors(e,t);const o=$t.dot($t),a=$t.dot(pn),l=$t.dot(to),c=pn.dot(pn),h=pn.dot(to),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,mn)===null?!1:mn.x>=0&&mn.y>=0&&mn.x+mn.y<=1}static getInterpolation(e,t,n,i,r,o,a,l){return this.getBarycoord(e,t,n,i,mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,mn.x),l.addScaledVector(o,mn.y),l.addScaledVector(a,mn.z),l)}static isFrontFacing(e,t,n,i){return $t.subVectors(n,t),pn.subVectors(e,t),$t.cross(pn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $t.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),$t.cross(pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return on.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return on.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return on.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return on.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return on.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;mi.subVectors(i,n),gi.subVectors(r,n),no.subVectors(e,n);const l=mi.dot(no),c=gi.dot(no);if(l<=0&&c<=0)return t.copy(n);io.subVectors(e,i);const h=mi.dot(io),d=gi.dot(io);if(h>=0&&d<=h)return t.copy(i);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(mi,o);ro.subVectors(e,r);const f=mi.dot(ro),g=gi.dot(ro);if(g>=0&&f<=g)return t.copy(r);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(gi,a);const p=h*g-f*d;if(p<=0&&d-h>=0&&f-g>=0)return ul.subVectors(r,i),a=(d-h)/(d-h+(f-g)),t.copy(i).addScaledVector(ul,a);const m=1/(p+_+u);return o=_*m,a=u*m,t.copy(n).addScaledVector(mi,o).addScaledVector(gi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const qc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Rn={h:0,s:0,l:0},Fr={h:0,s:0,l:0};function so(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ve{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=nn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=nt.workingColorSpace){if(e=gd(e,1),t=Ct(t,0,1),n=Ct(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=so(o,r,e+1/3),this.g=so(o,r,e),this.b=so(o,r,e-1/3)}return nt.toWorkingColorSpace(this,i),this}setStyle(e,t=nn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=nn){const n=qc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Pi(e.r),this.g=Pi(e.g),this.b=Pi(e.b),this}copyLinearToSRGB(e){return this.r=Ys(e.r),this.g=Ys(e.g),this.b=Ys(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nn){return nt.fromWorkingColorSpace(Et.copy(this),e),Math.round(Ct(Et.r*255,0,255))*65536+Math.round(Ct(Et.g*255,0,255))*256+Math.round(Ct(Et.b*255,0,255))}getHexString(e=nn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.fromWorkingColorSpace(Et.copy(this),t);const n=Et.r,i=Et.g,r=Et.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=nt.workingColorSpace){return nt.fromWorkingColorSpace(Et.copy(this),t),e.r=Et.r,e.g=Et.g,e.b=Et.b,e}getStyle(e=nn){nt.fromWorkingColorSpace(Et.copy(this),e);const t=Et.r,n=Et.g,i=Et.b;return e!==nn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Rn),this.setHSL(Rn.h+e,Rn.s+t,Rn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Rn),e.getHSL(Fr);const n=Ws(Rn.h,Fr.h,t),i=Ws(Rn.s,Fr.s,t),r=Ws(Rn.l,Fr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Et=new Ve;Ve.NAMES=qc;let Dd=0;class Bi extends ni{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Dd++}),this.uuid=pr(),this.name="",this.type="Material",this.blending=Ci,this.side=Nn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wo,this.blendDst=Ao,this.blendEquation=Kn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ve(0,0,0),this.blendAlpha=0,this.depthFunc=hs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ja,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ai,this.stencilZFail=ai,this.stencilZPass=ai,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ci&&(n.blending=this.blending),this.side!==Nn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==wo&&(n.blendSrc=this.blendSrc),this.blendDst!==Ao&&(n.blendDst=this.blendDst),this.blendEquation!==Kn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==hs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ja&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ai&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ai&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ai&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class mr extends Bi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=Lc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ct=new V,Nr=new Oe;class zt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Qa,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=vn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Xc("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Nr.fromBufferAttribute(this,t),Nr.applyMatrix3(e),this.setXY(t,Nr.x,Nr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix3(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix4(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.applyNormalMatrix(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.transformDirection(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ji(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Lt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ji(t,this.array)),t}setX(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ji(t,this.array)),t}setY(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ji(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ji(t,this.array)),t}setW(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),i=Lt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),i=Lt(i,this.array),r=Lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Qa&&(e.usage=this.usage),e}}class Kc extends zt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Zc extends zt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class yt extends zt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Id=0;const Yt=new it,oo=new xt,_i=new V,Bt=new Sn,tr=new Sn,mt=new V;class Gt extends ni{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=pr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Wc(e)?Zc:Kc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Yt.makeRotationFromQuaternion(e),this.applyMatrix4(Yt),this}rotateX(e){return Yt.makeRotationX(e),this.applyMatrix4(Yt),this}rotateY(e){return Yt.makeRotationY(e),this.applyMatrix4(Yt),this}rotateZ(e){return Yt.makeRotationZ(e),this.applyMatrix4(Yt),this}translate(e,t,n){return Yt.makeTranslation(e,t,n),this.applyMatrix4(Yt),this}scale(e,t,n){return Yt.makeScale(e,t,n),this.applyMatrix4(Yt),this}lookAt(e){return oo.lookAt(e),oo.updateMatrix(),this.applyMatrix4(oo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_i).negate(),this.translate(_i.x,_i.y,_i.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new yt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Bt.setFromBufferAttribute(r),this.morphTargetsRelative?(mt.addVectors(this.boundingBox.min,Bt.min),this.boundingBox.expandByPoint(mt),mt.addVectors(this.boundingBox.max,Bt.max),this.boundingBox.expandByPoint(mt)):(this.boundingBox.expandByPoint(Bt.min),this.boundingBox.expandByPoint(Bt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ii);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){const n=this.boundingSphere.center;if(Bt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];tr.setFromBufferAttribute(a),this.morphTargetsRelative?(mt.addVectors(Bt.min,tr.min),Bt.expandByPoint(mt),mt.addVectors(Bt.max,tr.max),Bt.expandByPoint(mt)):(Bt.expandByPoint(tr.min),Bt.expandByPoint(tr.max))}Bt.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)mt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(mt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)mt.fromBufferAttribute(a,c),l&&(_i.fromBufferAttribute(e,c),mt.add(_i)),i=Math.max(i,n.distanceToSquared(mt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new zt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let U=0;U<n.count;U++)a[U]=new V,l[U]=new V;const c=new V,h=new V,d=new V,u=new Oe,f=new Oe,g=new Oe,_=new V,p=new V;function m(U,y,v){c.fromBufferAttribute(n,U),h.fromBufferAttribute(n,y),d.fromBufferAttribute(n,v),u.fromBufferAttribute(r,U),f.fromBufferAttribute(r,y),g.fromBufferAttribute(r,v),h.sub(c),d.sub(c),f.sub(u),g.sub(u);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(L),p.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(L),a[U].add(_),a[y].add(_),a[v].add(_),l[U].add(p),l[y].add(p),l[v].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let U=0,y=M.length;U<y;++U){const v=M[U],L=v.start,P=v.count;for(let I=L,N=L+P;I<N;I+=3)m(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const x=new V,E=new V,R=new V,w=new V;function T(U){R.fromBufferAttribute(i,U),w.copy(R);const y=a[U];x.copy(y),x.sub(R.multiplyScalar(R.dot(y))).normalize(),E.crossVectors(w,y);const L=E.dot(l[U])<0?-1:1;o.setXYZW(U,x.x,x.y,x.z,L)}for(let U=0,y=M.length;U<y;++U){const v=M[U],L=v.start,P=v.count;for(let I=L,N=L+P;I<N;I+=3)T(e.getX(I+0)),T(e.getX(I+1)),T(e.getX(I+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new zt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const i=new V,r=new V,o=new V,a=new V,l=new V,c=new V,h=new V,d=new V;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),_=e.getX(u+1),p=e.getX(u+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,f=t.count;u<f;u+=3)i.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)mt.fromBufferAttribute(e,t),mt.normalize(),e.setXYZ(t,mt.x,mt.y,mt.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,p=l.length;_<p;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let m=0;m<h;m++)u[g++]=c[f++]}return new zt(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Gt,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=e(u,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const dl=new it,Vn=new Ss,Or=new ii,fl=new V,vi=new V,xi=new V,yi=new V,ao=new V,Br=new V,kr=new Oe,zr=new Oe,Gr=new Oe,pl=new V,ml=new V,gl=new V,Hr=new V,Vr=new V;class Rt extends xt{constructor(e=new Gt,t=new mr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){Br.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(ao.fromBufferAttribute(d,e),o?Br.addScaledVector(ao,h):Br.addScaledVector(ao.sub(t),h))}t.add(Br)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere),Or.applyMatrix4(r),Vn.copy(e.ray).recast(e.near),!(Or.containsPoint(Vn.origin)===!1&&(Vn.intersectSphere(Or,fl)===null||Vn.origin.distanceToSquared(fl)>(e.far-e.near)**2))&&(dl.copy(r).invert(),Vn.copy(e.ray).applyMatrix4(dl),!(n.boundingBox!==null&&Vn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Vn)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const p=u[g],m=o[p.materialIndex],M=Math.max(p.start,f.start),x=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let E=M,R=x;E<R;E+=3){const w=a.getX(E),T=a.getX(E+1),U=a.getX(E+2);i=Wr(this,m,e,n,c,h,d,w,T,U),i&&(i.faceIndex=Math.floor(E/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let p=g,m=_;p<m;p+=3){const M=a.getX(p),x=a.getX(p+1),E=a.getX(p+2);i=Wr(this,o,e,n,c,h,d,M,x,E),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const p=u[g],m=o[p.materialIndex],M=Math.max(p.start,f.start),x=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let E=M,R=x;E<R;E+=3){const w=E,T=E+1,U=E+2;i=Wr(this,m,e,n,c,h,d,w,T,U),i&&(i.faceIndex=Math.floor(E/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let p=g,m=_;p<m;p+=3){const M=p,x=p+1,E=p+2;i=Wr(this,o,e,n,c,h,d,M,x,E),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function Fd(s,e,t,n,i,r,o,a){let l;if(e.side===Ft?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,e.side===Nn,a),l===null)return null;Vr.copy(a),Vr.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Vr);return c<t.near||c>t.far?null:{distance:c,point:Vr.clone(),object:s}}function Wr(s,e,t,n,i,r,o,a,l,c){s.getVertexPosition(a,vi),s.getVertexPosition(l,xi),s.getVertexPosition(c,yi);const h=Fd(s,e,t,n,vi,xi,yi,Hr);if(h){i&&(kr.fromBufferAttribute(i,a),zr.fromBufferAttribute(i,l),Gr.fromBufferAttribute(i,c),h.uv=on.getInterpolation(Hr,vi,xi,yi,kr,zr,Gr,new Oe)),r&&(kr.fromBufferAttribute(r,a),zr.fromBufferAttribute(r,l),Gr.fromBufferAttribute(r,c),h.uv1=on.getInterpolation(Hr,vi,xi,yi,kr,zr,Gr,new Oe)),o&&(pl.fromBufferAttribute(o,a),ml.fromBufferAttribute(o,l),gl.fromBufferAttribute(o,c),h.normal=on.getInterpolation(Hr,vi,xi,yi,pl,ml,gl,new V),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new V,materialIndex:0};on.getNormal(vi,xi,yi,d.normal),h.face=d}return h}class ki extends Gt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new yt(c,3)),this.setAttribute("normal",new yt(h,3)),this.setAttribute("uv",new yt(d,2));function g(_,p,m,M,x,E,R,w,T,U,y){const v=E/T,L=R/U,P=E/2,I=R/2,N=w/2,W=T+1,k=U+1;let se=0,j=0;const K=new V;for(let q=0;q<k;q++){const F=q*L-I;for(let H=0;H<W;H++){const ne=H*v-P;K[_]=ne*M,K[p]=F*x,K[m]=N,c.push(K.x,K.y,K.z),K[_]=0,K[p]=0,K[m]=w>0?1:-1,h.push(K.x,K.y,K.z),d.push(H/T),d.push(1-q/U),se+=1}}for(let q=0;q<U;q++)for(let F=0;F<T;F++){const H=u+F+W*q,ne=u+F+W*(q+1),O=u+(F+1)+W*(q+1),B=u+(F+1)+W*q;l.push(H,ne,B),l.push(ne,O,B),j+=6}a.addGroup(f,j,y),f+=j,u+=se}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ki(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ni(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function At(s){const e={};for(let t=0;t<s.length;t++){const n=Ni(s[t]);for(const i in n)e[i]=n[i]}return e}function Nd(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Jc(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}const dr={clone:Ni,merge:At};var Od=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Bd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class It extends Bi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Od,this.fragmentShader=Bd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ni(e.uniforms),this.uniformsGroups=Nd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Qc extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=xn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Pn=new V,_l=new Oe,vl=new Oe;class jt extends Qc{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Lo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(rs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Lo*2*Math.atan(Math.tan(rs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Pn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Pn.x,Pn.y).multiplyScalar(-e/Pn.z),Pn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Pn.x,Pn.y).multiplyScalar(-e/Pn.z)}getViewSize(e,t){return this.getViewBounds(e,_l,vl),t.subVectors(vl,_l)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(rs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Si=-90,Mi=1;class kd extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new jt(Si,Mi,e,t);i.layers=this.layers,this.add(i);const r=new jt(Si,Mi,e,t);r.layers=this.layers,this.add(r);const o=new jt(Si,Mi,e,t);o.layers=this.layers,this.add(o);const a=new jt(Si,Mi,e,t);a.layers=this.layers,this.add(a);const l=new jt(Si,Mi,e,t);l.layers=this.layers,this.add(l);const c=new jt(Si,Mi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===xn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ms)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class $c extends Tt{constructor(e,t,n,i,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Ui,super(e,t,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class zd extends en{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new $c(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:kt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ki(5,5,5),r=new It({name:"CubemapFromEquirect",uniforms:Ni(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ft,blending:yn});r.uniforms.tEquirect.value=t;const o=new Rt(i,r),a=t.minFilter;return t.minFilter===$n&&(t.minFilter=kt),new kd(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}const lo=new V,Gd=new V,Hd=new Ke;class Ln{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=lo.subVectors(n,t).cross(Gd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(lo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Hd.getNormalMatrix(e),i=this.coplanarPoint(lo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Wn=new ii,Xr=new V;class jo{constructor(e=new Ln,t=new Ln,n=new Ln,i=new Ln,r=new Ln,o=new Ln){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=xn){const n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],d=i[6],u=i[7],f=i[8],g=i[9],_=i[10],p=i[11],m=i[12],M=i[13],x=i[14],E=i[15];if(n[0].setComponents(l-r,u-c,p-f,E-m).normalize(),n[1].setComponents(l+r,u+c,p+f,E+m).normalize(),n[2].setComponents(l+o,u+h,p+g,E+M).normalize(),n[3].setComponents(l-o,u-h,p-g,E-M).normalize(),n[4].setComponents(l-a,u-d,p-_,E-x).normalize(),t===xn)n[5].setComponents(l+a,u+d,p+_,E+x).normalize();else if(t===ms)n[5].setComponents(a,d,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Wn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Wn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Wn)}intersectsSprite(e){return Wn.center.set(0,0,0),Wn.radius=.7071067811865476,Wn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Wn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Xr.x=i.normal.x>0?e.max.x:e.min.x,Xr.y=i.normal.y>0?e.max.y:e.min.y,Xr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Xr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function eh(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Vd(s){const e=new WeakMap;function t(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const h=l.array,d=l._updateRange,u=l.updateRanges;if(s.bindBuffer(c,a),d.count===-1&&u.length===0&&s.bufferSubData(c,0,h),u.length!==0){for(let f=0,g=u.length;f<g;f++){const _=u[f];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}d.count!==-1&&(s.bufferSubData(c,d.offset*h.BYTES_PER_ELEMENT,h,d.offset,d.count),d.count=-1),l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(s.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}class ri extends Gt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,d=e/a,u=t/l,f=[],g=[],_=[],p=[];for(let m=0;m<h;m++){const M=m*u-o;for(let x=0;x<c;x++){const E=x*d-r;g.push(E,-M,0),_.push(0,0,1),p.push(x/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let M=0;M<a;M++){const x=M+c*m,E=M+c*(m+1),R=M+1+c*(m+1),w=M+1+c*m;f.push(x,E,w),f.push(E,R,w)}this.setIndex(f),this.setAttribute("position",new yt(g,3)),this.setAttribute("normal",new yt(_,3)),this.setAttribute("uv",new yt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ri(e.width,e.height,e.widthSegments,e.heightSegments)}}var Wd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Xd=`#ifdef USE_ALPHAHASH
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
#endif`,Yd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,jd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Kd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Zd=`#ifdef USE_AOMAP
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
#endif`,Jd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Qd=`#ifdef USE_BATCHING
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
#endif`,$d=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,ef=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,tf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,rf=`#ifdef USE_IRIDESCENCE
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
#endif`,sf=`#ifdef USE_BUMPMAP
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
#endif`,of=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,af=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,uf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,df=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ff=`#if defined( USE_COLOR_ALPHA )
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
#endif`,pf=`#define PI 3.141592653589793
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
} // validated`,mf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,gf=`vec3 transformedNormal = objectNormal;
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
#endif`,_f=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Sf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Mf=`
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
}`,bf=`#ifdef USE_ENVMAP
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
#endif`,Ef=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Tf=`#ifdef USE_ENVMAP
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
#endif`,wf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Af=`#ifdef USE_ENVMAP
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
#endif`,Cf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Rf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Pf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Uf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Lf=`#ifdef USE_GRADIENTMAP
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
}`,Df=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,If=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ff=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Nf=`uniform bool receiveShadow;
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
#endif`,Of=`#ifdef USE_ENVMAP
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
#endif`,Bf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,kf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,zf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Hf=`PhysicalMaterial material;
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
#endif`,Vf=`struct PhysicalMaterial {
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
}`,Wf=`
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
#endif`,Xf=`#if defined( RE_IndirectDiffuse )
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
#endif`,Yf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,jf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,qf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Qf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$f=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ep=`#if defined( USE_POINTS_UV )
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
#endif`,tp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,np=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ip=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,op=`#ifdef USE_MORPHTARGETS
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
#endif`,ap=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,cp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,hp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,up=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,fp=`#ifdef USE_NORMALMAP
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
#endif`,pp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,gp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_p=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,yp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Sp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Mp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,bp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ep=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Tp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,wp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ap=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Cp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Rp=`float getShadowMask() {
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
}`,Pp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Up=`#ifdef USE_SKINNING
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
#endif`,Lp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Dp=`#ifdef USE_SKINNING
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
#endif`,Ip=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Np=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Op=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bp=`#ifdef USE_TRANSMISSION
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
#endif`,kp=`#ifdef USE_TRANSMISSION
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
#endif`,zp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Hp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Vp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Wp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Xp=`uniform sampler2D t2D;
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
}`,Yp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,qp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zp=`#include <common>
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
}`,Jp=`#if DEPTH_PACKING == 3200
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
}`,Qp=`#define DISTANCE
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
}`,$p=`#define DISTANCE
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
}`,em=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nm=`uniform float scale;
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
}`,im=`uniform vec3 diffuse;
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
}`,rm=`#include <common>
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
}`,sm=`uniform vec3 diffuse;
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
}`,om=`#define LAMBERT
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
}`,am=`#define LAMBERT
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
}`,lm=`#define MATCAP
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
}`,cm=`#define MATCAP
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
}`,hm=`#define NORMAL
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
}`,um=`#define NORMAL
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
}`,dm=`#define PHONG
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
}`,fm=`#define PHONG
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
}`,pm=`#define STANDARD
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
}`,mm=`#define STANDARD
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
}`,gm=`#define TOON
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
}`,_m=`#define TOON
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
}`,vm=`uniform float size;
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
}`,xm=`uniform vec3 diffuse;
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
}`,ym=`#include <common>
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
}`,Sm=`uniform vec3 color;
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
}`,Mm=`uniform float rotation;
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
}`,bm=`uniform vec3 diffuse;
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
}`,qe={alphahash_fragment:Wd,alphahash_pars_fragment:Xd,alphamap_fragment:Yd,alphamap_pars_fragment:jd,alphatest_fragment:qd,alphatest_pars_fragment:Kd,aomap_fragment:Zd,aomap_pars_fragment:Jd,batching_pars_vertex:Qd,batching_vertex:$d,begin_vertex:ef,beginnormal_vertex:tf,bsdfs:nf,iridescence_fragment:rf,bumpmap_pars_fragment:sf,clipping_planes_fragment:of,clipping_planes_pars_fragment:af,clipping_planes_pars_vertex:lf,clipping_planes_vertex:cf,color_fragment:hf,color_pars_fragment:uf,color_pars_vertex:df,color_vertex:ff,common:pf,cube_uv_reflection_fragment:mf,defaultnormal_vertex:gf,displacementmap_pars_vertex:_f,displacementmap_vertex:vf,emissivemap_fragment:xf,emissivemap_pars_fragment:yf,colorspace_fragment:Sf,colorspace_pars_fragment:Mf,envmap_fragment:bf,envmap_common_pars_fragment:Ef,envmap_pars_fragment:Tf,envmap_pars_vertex:wf,envmap_physical_pars_fragment:Of,envmap_vertex:Af,fog_vertex:Cf,fog_pars_vertex:Rf,fog_fragment:Pf,fog_pars_fragment:Uf,gradientmap_pars_fragment:Lf,lightmap_pars_fragment:Df,lights_lambert_fragment:If,lights_lambert_pars_fragment:Ff,lights_pars_begin:Nf,lights_toon_fragment:Bf,lights_toon_pars_fragment:kf,lights_phong_fragment:zf,lights_phong_pars_fragment:Gf,lights_physical_fragment:Hf,lights_physical_pars_fragment:Vf,lights_fragment_begin:Wf,lights_fragment_maps:Xf,lights_fragment_end:Yf,logdepthbuf_fragment:jf,logdepthbuf_pars_fragment:qf,logdepthbuf_pars_vertex:Kf,logdepthbuf_vertex:Zf,map_fragment:Jf,map_pars_fragment:Qf,map_particle_fragment:$f,map_particle_pars_fragment:ep,metalnessmap_fragment:tp,metalnessmap_pars_fragment:np,morphinstance_vertex:ip,morphcolor_vertex:rp,morphnormal_vertex:sp,morphtarget_pars_vertex:op,morphtarget_vertex:ap,normal_fragment_begin:lp,normal_fragment_maps:cp,normal_pars_fragment:hp,normal_pars_vertex:up,normal_vertex:dp,normalmap_pars_fragment:fp,clearcoat_normal_fragment_begin:pp,clearcoat_normal_fragment_maps:mp,clearcoat_pars_fragment:gp,iridescence_pars_fragment:_p,opaque_fragment:vp,packing:xp,premultiplied_alpha_fragment:yp,project_vertex:Sp,dithering_fragment:Mp,dithering_pars_fragment:bp,roughnessmap_fragment:Ep,roughnessmap_pars_fragment:Tp,shadowmap_pars_fragment:wp,shadowmap_pars_vertex:Ap,shadowmap_vertex:Cp,shadowmask_pars_fragment:Rp,skinbase_vertex:Pp,skinning_pars_vertex:Up,skinning_vertex:Lp,skinnormal_vertex:Dp,specularmap_fragment:Ip,specularmap_pars_fragment:Fp,tonemapping_fragment:Np,tonemapping_pars_fragment:Op,transmission_fragment:Bp,transmission_pars_fragment:kp,uv_pars_fragment:zp,uv_pars_vertex:Gp,uv_vertex:Hp,worldpos_vertex:Vp,background_vert:Wp,background_frag:Xp,backgroundCube_vert:Yp,backgroundCube_frag:jp,cube_vert:qp,cube_frag:Kp,depth_vert:Zp,depth_frag:Jp,distanceRGBA_vert:Qp,distanceRGBA_frag:$p,equirect_vert:em,equirect_frag:tm,linedashed_vert:nm,linedashed_frag:im,meshbasic_vert:rm,meshbasic_frag:sm,meshlambert_vert:om,meshlambert_frag:am,meshmatcap_vert:lm,meshmatcap_frag:cm,meshnormal_vert:hm,meshnormal_frag:um,meshphong_vert:dm,meshphong_frag:fm,meshphysical_vert:pm,meshphysical_frag:mm,meshtoon_vert:gm,meshtoon_frag:_m,points_vert:vm,points_frag:xm,shadow_vert:ym,shadow_frag:Sm,sprite_vert:Mm,sprite_frag:bm},Le={common:{diffuse:{value:new Ve(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new Ve(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},rn={basic:{uniforms:At([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:At([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,Le.lights,{emissive:{value:new Ve(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:At([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,Le.lights,{emissive:{value:new Ve(0)},specular:{value:new Ve(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:At([Le.common,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.roughnessmap,Le.metalnessmap,Le.fog,Le.lights,{emissive:{value:new Ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:At([Le.common,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.gradientmap,Le.fog,Le.lights,{emissive:{value:new Ve(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:At([Le.common,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:At([Le.points,Le.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:At([Le.common,Le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:At([Le.common,Le.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:At([Le.common,Le.bumpmap,Le.normalmap,Le.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:At([Le.sprite,Le.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:At([Le.common,Le.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:At([Le.lights,Le.fog,{color:{value:new Ve(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};rn.physical={uniforms:At([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new Ve(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new Ve(0)},specularColor:{value:new Ve(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const Yr={r:0,b:0,g:0},Xn=new ln,Em=new it;function Tm(s,e,t,n,i,r,o){const a=new Ve(0);let l=r===!0?0:1,c,h,d=null,u=0,f=null;function g(M){let x=M.isScene===!0?M.background:null;return x&&x.isTexture&&(x=(M.backgroundBlurriness>0?t:e).get(x)),x}function _(M){let x=!1;const E=g(M);E===null?m(a,l):E&&E.isColor&&(m(E,1),x=!0);const R=s.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function p(M,x){const E=g(x);E&&(E.isCubeTexture||E.mapping===xs)?(h===void 0&&(h=new Rt(new ki(1,1,1),new It({name:"BackgroundCubeMaterial",uniforms:Ni(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:Ft,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,w,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Xn.copy(x.backgroundRotation),Xn.x*=-1,Xn.y*=-1,Xn.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Xn.y*=-1,Xn.z*=-1),h.material.uniforms.envMap.value=E,h.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Em.makeRotationFromEuler(Xn)),h.material.toneMapped=nt.getTransfer(E.colorSpace)!==ot,(d!==E||u!==E.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,d=E,u=E.version,f=s.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new Rt(new ri(2,2),new It({name:"BackgroundMaterial",uniforms:Ni(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:Nn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=nt.getTransfer(E.colorSpace)!==ot,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(d!==E||u!==E.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,d=E,u=E.version,f=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function m(M,x){M.getRGB(Yr,Jc(s)),n.buffers.color.setClear(Yr.r,Yr.g,Yr.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(M,x=1){a.set(M),l=x,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,m(a,l)},render:_,addToRenderList:p}}function wm(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null);let r=i,o=!1;function a(v,L,P,I,N){let W=!1;const k=d(I,P,L);r!==k&&(r=k,c(r.object)),W=f(v,I,P,N),W&&g(v,I,P,N),N!==null&&e.update(N,s.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,E(v,L,P,I),N!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return s.createVertexArray()}function c(v){return s.bindVertexArray(v)}function h(v){return s.deleteVertexArray(v)}function d(v,L,P){const I=P.wireframe===!0;let N=n[v.id];N===void 0&&(N={},n[v.id]=N);let W=N[L.id];W===void 0&&(W={},N[L.id]=W);let k=W[I];return k===void 0&&(k=u(l()),W[I]=k),k}function u(v){const L=[],P=[],I=[];for(let N=0;N<t;N++)L[N]=0,P[N]=0,I[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:P,attributeDivisors:I,object:v,attributes:{},index:null}}function f(v,L,P,I){const N=r.attributes,W=L.attributes;let k=0;const se=P.getAttributes();for(const j in se)if(se[j].location>=0){const q=N[j];let F=W[j];if(F===void 0&&(j==="instanceMatrix"&&v.instanceMatrix&&(F=v.instanceMatrix),j==="instanceColor"&&v.instanceColor&&(F=v.instanceColor)),q===void 0||q.attribute!==F||F&&q.data!==F.data)return!0;k++}return r.attributesNum!==k||r.index!==I}function g(v,L,P,I){const N={},W=L.attributes;let k=0;const se=P.getAttributes();for(const j in se)if(se[j].location>=0){let q=W[j];q===void 0&&(j==="instanceMatrix"&&v.instanceMatrix&&(q=v.instanceMatrix),j==="instanceColor"&&v.instanceColor&&(q=v.instanceColor));const F={};F.attribute=q,q&&q.data&&(F.data=q.data),N[j]=F,k++}r.attributes=N,r.attributesNum=k,r.index=I}function _(){const v=r.newAttributes;for(let L=0,P=v.length;L<P;L++)v[L]=0}function p(v){m(v,0)}function m(v,L){const P=r.newAttributes,I=r.enabledAttributes,N=r.attributeDivisors;P[v]=1,I[v]===0&&(s.enableVertexAttribArray(v),I[v]=1),N[v]!==L&&(s.vertexAttribDivisor(v,L),N[v]=L)}function M(){const v=r.newAttributes,L=r.enabledAttributes;for(let P=0,I=L.length;P<I;P++)L[P]!==v[P]&&(s.disableVertexAttribArray(P),L[P]=0)}function x(v,L,P,I,N,W,k){k===!0?s.vertexAttribIPointer(v,L,P,N,W):s.vertexAttribPointer(v,L,P,I,N,W)}function E(v,L,P,I){_();const N=I.attributes,W=P.getAttributes(),k=L.defaultAttributeValues;for(const se in W){const j=W[se];if(j.location>=0){let K=N[se];if(K===void 0&&(se==="instanceMatrix"&&v.instanceMatrix&&(K=v.instanceMatrix),se==="instanceColor"&&v.instanceColor&&(K=v.instanceColor)),K!==void 0){const q=K.normalized,F=K.itemSize,H=e.get(K);if(H===void 0)continue;const ne=H.buffer,O=H.type,B=H.bytesPerElement,te=O===s.INT||O===s.UNSIGNED_INT||K.gpuType===Ic;if(K.isInterleavedBufferAttribute){const G=K.data,ae=G.stride,pe=K.offset;if(G.isInstancedInterleavedBuffer){for(let ve=0;ve<j.locationSize;ve++)m(j.location+ve,G.meshPerAttribute);v.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let ve=0;ve<j.locationSize;ve++)p(j.location+ve);s.bindBuffer(s.ARRAY_BUFFER,ne);for(let ve=0;ve<j.locationSize;ve++)x(j.location+ve,F/j.locationSize,O,q,ae*B,(pe+F/j.locationSize*ve)*B,te)}else{if(K.isInstancedBufferAttribute){for(let G=0;G<j.locationSize;G++)m(j.location+G,K.meshPerAttribute);v.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let G=0;G<j.locationSize;G++)p(j.location+G);s.bindBuffer(s.ARRAY_BUFFER,ne);for(let G=0;G<j.locationSize;G++)x(j.location+G,F/j.locationSize,O,q,F*B,F/j.locationSize*G*B,te)}}else if(k!==void 0){const q=k[se];if(q!==void 0)switch(q.length){case 2:s.vertexAttrib2fv(j.location,q);break;case 3:s.vertexAttrib3fv(j.location,q);break;case 4:s.vertexAttrib4fv(j.location,q);break;default:s.vertexAttrib1fv(j.location,q)}}}}M()}function R(){U();for(const v in n){const L=n[v];for(const P in L){const I=L[P];for(const N in I)h(I[N].object),delete I[N];delete L[P]}delete n[v]}}function w(v){if(n[v.id]===void 0)return;const L=n[v.id];for(const P in L){const I=L[P];for(const N in I)h(I[N].object),delete I[N];delete L[P]}delete n[v.id]}function T(v){for(const L in n){const P=n[L];if(P[v.id]===void 0)continue;const I=P[v.id];for(const N in I)h(I[N].object),delete I[N];delete P[v.id]}}function U(){y(),o=!0,r!==i&&(r=i,c(r.object))}function y(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:U,resetDefaultState:y,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:p,disableUnusedAttributes:M}}function Am(s,e,t){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,d){d!==0&&(s.drawArraysInstanced(n,c,h,d),t.update(h,n,d))}function a(c,h,d){if(d===0)return;const u=e.get("WEBGL_multi_draw");if(u===null)for(let f=0;f<d;f++)this.render(c[f],h[f]);else{u.multiDrawArraysWEBGL(n,c,0,h,0,d);let f=0;for(let g=0;g<d;g++)f+=h[g];t.update(f,n,1)}}function l(c,h,d,u){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_];for(let _=0;_<u.length;_++)t.update(g,n,u[_])}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Cm(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(w){return!(w!==an&&n.convert(w)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const T=w===Fn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==On&&n.convert(w)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==vn&&!T)}function l(w){if(w==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),_=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),M=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=f>0,R=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,maxTextures:u,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:_,maxAttributes:p,maxVertexUniforms:m,maxVaryings:M,maxFragmentUniforms:x,vertexTextures:E,maxSamples:R}}function Rm(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new Ln,a=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,_=d.clipIntersection,p=d.clipShadows,m=s.get(d);if(!i||g===null||g.length===0||r&&!p)r?h(null):c();else{const M=r?0:n,x=M*4;let E=m.clippingState||null;l.value=E,E=h(g,u,x,f);for(let R=0;R!==x;++R)E[R]=t[R];m.clippingState=E,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,g){const _=d!==null?d.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const m=f+_*4,M=u.matrixWorldInverse;a.getNormalMatrix(M),(p===null||p.length<m)&&(p=new Float32Array(m));for(let x=0,E=f;x!==_;++x,E+=4)o.copy(d[x]).applyMatrix4(M,a),o.normal.toArray(p,E),p[E+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function Pm(s){let e=new WeakMap;function t(o,a){return a===Co?o.mapping=Ui:a===Ro&&(o.mapping=Li),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Co||a===Ro)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new zd(l.height);return c.fromEquirectangularTexture(s,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Ms extends Qc{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ai=4,xl=[.125,.215,.35,.446,.526,.582],Zn=20,co=new Ms,yl=new Ve;let ho=null,uo=0,fo=0,po=!1;const qn=(1+Math.sqrt(5))/2,bi=1/qn,Sl=[new V(-qn,bi,0),new V(qn,bi,0),new V(-bi,0,qn),new V(bi,0,qn),new V(0,qn,-bi),new V(0,qn,bi),new V(-1,1,-1),new V(1,1,-1),new V(-1,1,1),new V(1,1,1)];class Ml{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){ho=this._renderer.getRenderTarget(),uo=this._renderer.getActiveCubeFace(),fo=this._renderer.getActiveMipmapLevel(),po=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=El(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ho,uo,fo),this._renderer.xr.enabled=po,e.scissorTest=!1,jr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ui||e.mapping===Li?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ho=this._renderer.getRenderTarget(),uo=this._renderer.getActiveCubeFace(),fo=this._renderer.getActiveMipmapLevel(),po=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:kt,minFilter:kt,generateMipmaps:!1,type:Fn,format:an,colorSpace:Bn,depthBuffer:!1},i=bl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Um(r)),this._blurMaterial=Lm(r,e,t)}return i}_compileMaterial(e){const t=new Rt(this._lodPlanes[0],e);this._renderer.compile(t,co)}_sceneToCubeUV(e,t,n,i){const a=new jt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(yl),h.toneMapping=In,h.autoClear=!1;const f=new mr({name:"PMREM.Background",side:Ft,depthWrite:!1,depthTest:!1}),g=new Rt(new ki,f);let _=!1;const p=e.background;p?p.isColor&&(f.color.copy(p),e.background=null,_=!0):(f.color.copy(yl),_=!0);for(let m=0;m<6;m++){const M=m%3;M===0?(a.up.set(0,l[m],0),a.lookAt(c[m],0,0)):M===1?(a.up.set(0,0,l[m]),a.lookAt(0,c[m],0)):(a.up.set(0,l[m],0),a.lookAt(0,0,c[m]));const x=this._cubeSize;jr(i,M*x,m>2?x:0,x,x),h.setRenderTarget(i),_&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Ui||e.mapping===Li;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=El());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new Rt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;jr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,co)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Sl[(i-r-1)%Sl.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Rt(this._lodPlanes[i],c),u=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Zn-1),_=r/g,p=isFinite(r)?1+Math.floor(h*_):Zn;p>Zn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Zn}`);const m=[];let M=0;for(let T=0;T<Zn;++T){const U=T/_,y=Math.exp(-U*U/2);m.push(y),T===0?M+=y:T<p&&(M+=2*y)}for(let T=0;T<m.length;T++)m[T]=m[T]/M;u.envMap.value=e.texture,u.samples.value=p,u.weights.value=m,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:x}=this;u.dTheta.value=g,u.mipInt.value=x-n;const E=this._sizeLods[i],R=3*E*(i>x-Ai?i-x+Ai:0),w=4*(this._cubeSize-E);jr(t,R,w,3*E,2*E),l.setRenderTarget(t),l.render(d,co)}}function Um(s){const e=[],t=[],n=[];let i=s;const r=s-Ai+1+xl.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>s-Ai?l=xl[o-s+Ai-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,_=3,p=2,m=1,M=new Float32Array(_*g*f),x=new Float32Array(p*g*f),E=new Float32Array(m*g*f);for(let w=0;w<f;w++){const T=w%3*2/3-1,U=w>2?0:-1,y=[T,U,0,T+2/3,U,0,T+2/3,U+1,0,T,U,0,T+2/3,U+1,0,T,U+1,0];M.set(y,_*g*w),x.set(u,p*g*w);const v=[w,w,w,w,w,w];E.set(v,m*g*w)}const R=new Gt;R.setAttribute("position",new zt(M,_)),R.setAttribute("uv",new zt(x,p)),R.setAttribute("faceIndex",new zt(E,m)),e.push(R),i>Ai&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function bl(s,e,t){const n=new en(s,e,t);return n.texture.mapping=xs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function jr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Lm(s,e,t){const n=new Float32Array(Zn),i=new V(0,1,0);return new It({name:"SphericalGaussianBlur",defines:{n:Zn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:qo(),fragmentShader:`

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
		`,blending:yn,depthTest:!1,depthWrite:!1})}function El(){return new It({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:qo(),fragmentShader:`

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
		`,blending:yn,depthTest:!1,depthWrite:!1})}function Tl(){return new It({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qo(),fragmentShader:`

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
	`}function Dm(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Co||l===Ro,h=l===Ui||l===Li;if(c||h){let d=e.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return t===null&&(t=new Ml(s)),d=c?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&i(f)?(t===null&&(t=new Ml(s)),d=c?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Im(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Xc("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Fm(s,e,t,n){const i={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);for(const g in u.morphAttributes){const _=u.morphAttributes[g];for(let p=0,m=_.length;p<m;p++)e.remove(_[p])}u.removeEventListener("dispose",o),delete i[u.id];const f=r.get(u);f&&(e.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function a(d,u){return i[u.id]===!0||(u.addEventListener("dispose",o),i[u.id]=!0,t.memory.geometries++),u}function l(d){const u=d.attributes;for(const g in u)e.update(u[g],s.ARRAY_BUFFER);const f=d.morphAttributes;for(const g in f){const _=f[g];for(let p=0,m=_.length;p<m;p++)e.update(_[p],s.ARRAY_BUFFER)}}function c(d){const u=[],f=d.index,g=d.attributes.position;let _=0;if(f!==null){const M=f.array;_=f.version;for(let x=0,E=M.length;x<E;x+=3){const R=M[x+0],w=M[x+1],T=M[x+2];u.push(R,w,w,T,T,R)}}else if(g!==void 0){const M=g.array;_=g.version;for(let x=0,E=M.length/3-1;x<E;x+=3){const R=x+0,w=x+1,T=x+2;u.push(R,w,w,T,T,R)}}else return;const p=new(Wc(u)?Zc:Kc)(u,1);p.version=_;const m=r.get(d);m&&e.remove(m),r.set(d,p)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Nm(s,e,t){let n;function i(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,f){s.drawElements(n,f,r,u*o),t.update(f,n,1)}function c(u,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,u*o,g),t.update(f,n,g))}function h(u,f,g){if(g===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let p=0;p<g;p++)this.render(u[p]/o,f[p]);else{_.multiDrawElementsWEBGL(n,f,0,r,u,0,g);let p=0;for(let m=0;m<g;m++)p+=f[m];t.update(p,n,1)}}function d(u,f,g,_){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<u.length;m++)c(u[m]/o,f[m],_[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,r,u,0,_,0,g);let m=0;for(let M=0;M<g;M++)m+=f[M];for(let M=0;M<_.length;M++)t.update(m,n,_[M])}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Om(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Bm(s,e,t){const n=new WeakMap,i=new ht;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let y=function(){T.dispose(),n.delete(a),a.removeEventListener("dispose",y)};u!==void 0&&u.texture.dispose();const f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],M=a.morphAttributes.color||[];let x=0;f===!0&&(x=1),g===!0&&(x=2),_===!0&&(x=3);let E=a.attributes.position.count*x,R=1;E>e.maxTextureSize&&(R=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const w=new Float32Array(E*R*4*d),T=new jc(w,E,R,d);T.type=vn,T.needsUpdate=!0;const U=x*4;for(let v=0;v<d;v++){const L=p[v],P=m[v],I=M[v],N=E*R*4*v;for(let W=0;W<L.count;W++){const k=W*U;f===!0&&(i.fromBufferAttribute(L,W),w[N+k+0]=i.x,w[N+k+1]=i.y,w[N+k+2]=i.z,w[N+k+3]=0),g===!0&&(i.fromBufferAttribute(P,W),w[N+k+4]=i.x,w[N+k+5]=i.y,w[N+k+6]=i.z,w[N+k+7]=0),_===!0&&(i.fromBufferAttribute(I,W),w[N+k+8]=i.x,w[N+k+9]=i.y,w[N+k+10]=i.z,w[N+k+11]=I.itemSize===4?i.w:1)}}u={count:d,texture:T,size:new Oe(E,R)},n.set(a,u),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];const g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function km(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=e.get(l,h);if(i.get(d)!==c&&(e.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;i.get(u)!==c&&(u.update(),i.set(u,c))}return d}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}class th extends Tt{constructor(e,t,n,i,r,o,a,l,c,h=Ri){if(h!==Ri&&h!==Fi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ri&&(n=Di),n===void 0&&h===Fi&&(n=Ii),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Dt,this.minFilter=l!==void 0?l:Dt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const nh=new Tt,ih=new th(1,1);ih.compareFunction=Vc;const rh=new jc,sh=new Td,oh=new $c,wl=[],Al=[],Cl=new Float32Array(16),Rl=new Float32Array(9),Pl=new Float32Array(4);function zi(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=wl[i];if(r===void 0&&(r=new Float32Array(i),wl[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function ut(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function dt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function bs(s,e){let t=Al[e];t===void 0&&(t=new Int32Array(e),Al[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function zm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Gm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;s.uniform2fv(this.addr,e),dt(t,e)}}function Hm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ut(t,e))return;s.uniform3fv(this.addr,e),dt(t,e)}}function Vm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;s.uniform4fv(this.addr,e),dt(t,e)}}function Wm(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),dt(t,e)}else{if(ut(t,n))return;Pl.set(n),s.uniformMatrix2fv(this.addr,!1,Pl),dt(t,n)}}function Xm(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),dt(t,e)}else{if(ut(t,n))return;Rl.set(n),s.uniformMatrix3fv(this.addr,!1,Rl),dt(t,n)}}function Ym(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),dt(t,e)}else{if(ut(t,n))return;Cl.set(n),s.uniformMatrix4fv(this.addr,!1,Cl),dt(t,n)}}function jm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function qm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;s.uniform2iv(this.addr,e),dt(t,e)}}function Km(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ut(t,e))return;s.uniform3iv(this.addr,e),dt(t,e)}}function Zm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;s.uniform4iv(this.addr,e),dt(t,e)}}function Jm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Qm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;s.uniform2uiv(this.addr,e),dt(t,e)}}function $m(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ut(t,e))return;s.uniform3uiv(this.addr,e),dt(t,e)}}function eg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;s.uniform4uiv(this.addr,e),dt(t,e)}}function tg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?ih:nh;t.setTexture2D(e||r,i)}function ng(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||sh,i)}function ig(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||oh,i)}function rg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||rh,i)}function sg(s){switch(s){case 5126:return zm;case 35664:return Gm;case 35665:return Hm;case 35666:return Vm;case 35674:return Wm;case 35675:return Xm;case 35676:return Ym;case 5124:case 35670:return jm;case 35667:case 35671:return qm;case 35668:case 35672:return Km;case 35669:case 35673:return Zm;case 5125:return Jm;case 36294:return Qm;case 36295:return $m;case 36296:return eg;case 35678:case 36198:case 36298:case 36306:case 35682:return tg;case 35679:case 36299:case 36307:return ng;case 35680:case 36300:case 36308:case 36293:return ig;case 36289:case 36303:case 36311:case 36292:return rg}}function og(s,e){s.uniform1fv(this.addr,e)}function ag(s,e){const t=zi(e,this.size,2);s.uniform2fv(this.addr,t)}function lg(s,e){const t=zi(e,this.size,3);s.uniform3fv(this.addr,t)}function cg(s,e){const t=zi(e,this.size,4);s.uniform4fv(this.addr,t)}function hg(s,e){const t=zi(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function ug(s,e){const t=zi(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function dg(s,e){const t=zi(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function fg(s,e){s.uniform1iv(this.addr,e)}function pg(s,e){s.uniform2iv(this.addr,e)}function mg(s,e){s.uniform3iv(this.addr,e)}function gg(s,e){s.uniform4iv(this.addr,e)}function _g(s,e){s.uniform1uiv(this.addr,e)}function vg(s,e){s.uniform2uiv(this.addr,e)}function xg(s,e){s.uniform3uiv(this.addr,e)}function yg(s,e){s.uniform4uiv(this.addr,e)}function Sg(s,e,t){const n=this.cache,i=e.length,r=bs(t,i);ut(n,r)||(s.uniform1iv(this.addr,r),dt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||nh,r[o])}function Mg(s,e,t){const n=this.cache,i=e.length,r=bs(t,i);ut(n,r)||(s.uniform1iv(this.addr,r),dt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||sh,r[o])}function bg(s,e,t){const n=this.cache,i=e.length,r=bs(t,i);ut(n,r)||(s.uniform1iv(this.addr,r),dt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||oh,r[o])}function Eg(s,e,t){const n=this.cache,i=e.length,r=bs(t,i);ut(n,r)||(s.uniform1iv(this.addr,r),dt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||rh,r[o])}function Tg(s){switch(s){case 5126:return og;case 35664:return ag;case 35665:return lg;case 35666:return cg;case 35674:return hg;case 35675:return ug;case 35676:return dg;case 5124:case 35670:return fg;case 35667:case 35671:return pg;case 35668:case 35672:return mg;case 35669:case 35673:return gg;case 5125:return _g;case 36294:return vg;case 36295:return xg;case 36296:return yg;case 35678:case 36198:case 36298:case 36306:case 35682:return Sg;case 35679:case 36299:case 36307:return Mg;case 35680:case 36300:case 36308:case 36293:return bg;case 36289:case 36303:case 36311:case 36292:return Eg}}class wg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=sg(t.type)}}class Ag{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Tg(t.type)}}class Cg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const mo=/(\w+)(\])?(\[|\.)?/g;function Ul(s,e){s.seq.push(e),s.map[e.id]=e}function Rg(s,e,t){const n=s.name,i=n.length;for(mo.lastIndex=0;;){const r=mo.exec(n),o=mo.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Ul(t,c===void 0?new wg(a,s,e):new Ag(a,s,e));break}else{let d=t.map[a];d===void 0&&(d=new Cg(a),Ul(t,d)),t=d}}}class ss{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);Rg(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function Ll(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const Pg=37297;let Ug=0;function Lg(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function Dg(s){const e=nt.getPrimaries(nt.workingColorSpace),t=nt.getPrimaries(s);let n;switch(e===t?n="":e===ps&&t===fs?n="LinearDisplayP3ToLinearSRGB":e===fs&&t===ps&&(n="LinearSRGBToLinearDisplayP3"),s){case Bn:case ys:return[n,"LinearTransferOETF"];case nn:case Xo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Dl(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+Lg(s.getShaderSource(e),o)}else return i}function Ig(s,e){const t=Dg(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Fg(s,e){let t;switch(e){case Wu:t="Linear";break;case Xu:t="Reinhard";break;case Yu:t="OptimizedCineon";break;case ju:t="ACESFilmic";break;case Ku:t="AgX";break;case Zu:t="Neutral";break;case qu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Ng(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ar).join(`
`)}function Og(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Bg(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function ar(s){return s!==""}function Il(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Fl(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const kg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Do(s){return s.replace(kg,Gg)}const zg=new Map;function Gg(s,e){let t=qe[e];if(t===void 0){const n=zg.get(e);if(n!==void 0)t=qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Do(t)}const Hg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Nl(s){return s.replace(Hg,Vg)}function Vg(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Ol(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function Wg(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Uc?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===gu?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===gn&&(e="SHADOWMAP_TYPE_VSM"),e}function Xg(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ui:case Li:e="ENVMAP_TYPE_CUBE";break;case xs:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Yg(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Li:e="ENVMAP_MODE_REFRACTION";break}return e}function jg(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Lc:e="ENVMAP_BLENDING_MULTIPLY";break;case Hu:e="ENVMAP_BLENDING_MIX";break;case Vu:e="ENVMAP_BLENDING_ADD";break}return e}function qg(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Kg(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Wg(t),c=Xg(t),h=Yg(t),d=jg(t),u=qg(t),f=Ng(t),g=Og(r),_=i.createProgram();let p,m,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ar).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ar).join(`
`),m.length>0&&(m+=`
`)):(p=[Ol(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ar).join(`
`),m=[Ol(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==In?"#define TONE_MAPPING":"",t.toneMapping!==In?qe.tonemapping_pars_fragment:"",t.toneMapping!==In?Fg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,Ig("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ar).join(`
`)),o=Do(o),o=Il(o,t),o=Fl(o,t),a=Do(a),a=Il(a,t),a=Fl(a,t),o=Nl(o),a=Nl(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===$a?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===$a?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const x=M+p+o,E=M+m+a,R=Ll(i,i.VERTEX_SHADER,x),w=Ll(i,i.FRAGMENT_SHADER,E);i.attachShader(_,R),i.attachShader(_,w),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function T(L){if(s.debug.checkShaderErrors){const P=i.getProgramInfoLog(_).trim(),I=i.getShaderInfoLog(R).trim(),N=i.getShaderInfoLog(w).trim();let W=!0,k=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(W=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,R,w);else{const se=Dl(i,R,"vertex"),j=Dl(i,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+P+`
`+se+`
`+j)}else P!==""?console.warn("THREE.WebGLProgram: Program Info Log:",P):(I===""||N==="")&&(k=!1);k&&(L.diagnostics={runnable:W,programLog:P,vertexShader:{log:I,prefix:p},fragmentShader:{log:N,prefix:m}})}i.deleteShader(R),i.deleteShader(w),U=new ss(i,_),y=Bg(i,_)}let U;this.getUniforms=function(){return U===void 0&&T(this),U};let y;this.getAttributes=function(){return y===void 0&&T(this),y};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=i.getProgramParameter(_,Pg)),v},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ug++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=w,this}let Zg=0;class Jg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Qg(e),t.set(e,n)),n}}class Qg{constructor(e){this.id=Zg++,this.code=e,this.usedTimes=0}}function $g(s,e,t,n,i,r,o){const a=new Yo,l=new Jg,c=new Set,h=[],d=i.logarithmicDepthBuffer,u=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return c.add(y),y===0?"uv":`uv${y}`}function p(y,v,L,P,I){const N=P.fog,W=I.geometry,k=y.isMeshStandardMaterial?P.environment:null,se=(y.isMeshStandardMaterial?t:e).get(y.envMap||k),j=se&&se.mapping===xs?se.image.height:null,K=g[y.type];y.precision!==null&&(f=i.getMaxPrecision(y.precision),f!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",f,"instead."));const q=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,F=q!==void 0?q.length:0;let H=0;W.morphAttributes.position!==void 0&&(H=1),W.morphAttributes.normal!==void 0&&(H=2),W.morphAttributes.color!==void 0&&(H=3);let ne,O,B,te;if(K){const De=rn[K];ne=De.vertexShader,O=De.fragmentShader}else ne=y.vertexShader,O=y.fragmentShader,l.update(y),B=l.getVertexShaderID(y),te=l.getFragmentShaderID(y);const G=s.getRenderTarget(),ae=I.isInstancedMesh===!0,pe=I.isBatchedMesh===!0,ve=!!y.map,D=!!y.matcap,he=!!se,Pe=!!y.aoMap,Ue=!!y.lightMap,fe=!!y.bumpMap,ye=!!y.normalMap,Me=!!y.displacementMap,de=!!y.emissiveMap,Ce=!!y.metalnessMap,C=!!y.roughnessMap,S=y.anisotropy>0,X=y.clearcoat>0,Z=y.dispersion>0,ie=y.iridescence>0,Q=y.sheen>0,Te=y.transmission>0,le=S&&!!y.anisotropyMap,ce=X&&!!y.clearcoatMap,Se=X&&!!y.clearcoatNormalMap,ue=X&&!!y.clearcoatRoughnessMap,be=ie&&!!y.iridescenceMap,Be=ie&&!!y.iridescenceThicknessMap,we=Q&&!!y.sheenColorMap,me=Q&&!!y.sheenRoughnessMap,xe=!!y.specularMap,Ne=!!y.specularColorMap,We=!!y.specularIntensityMap,b=Te&&!!y.transmissionMap,$=Te&&!!y.thicknessMap,z=!!y.gradientMap,ee=!!y.alphaMap,ge=y.alphaTest>0,Ae=!!y.alphaHash,Re=!!y.extensions;let je=In;y.toneMapped&&(G===null||G.isXRRenderTarget===!0)&&(je=s.toneMapping);const Xe={shaderID:K,shaderType:y.type,shaderName:y.name,vertexShader:ne,fragmentShader:O,defines:y.defines,customVertexShaderID:B,customFragmentShaderID:te,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:f,batching:pe,batchingColor:pe&&I._colorsTexture!==null,instancing:ae,instancingColor:ae&&I.instanceColor!==null,instancingMorph:ae&&I.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:G===null?s.outputColorSpace:G.isXRRenderTarget===!0?G.texture.colorSpace:Bn,alphaToCoverage:!!y.alphaToCoverage,map:ve,matcap:D,envMap:he,envMapMode:he&&se.mapping,envMapCubeUVHeight:j,aoMap:Pe,lightMap:Ue,bumpMap:fe,normalMap:ye,displacementMap:u&&Me,emissiveMap:de,normalMapObjectSpace:ye&&y.normalMapType===ld,normalMapTangentSpace:ye&&y.normalMapType===Hc,metalnessMap:Ce,roughnessMap:C,anisotropy:S,anisotropyMap:le,clearcoat:X,clearcoatMap:ce,clearcoatNormalMap:Se,clearcoatRoughnessMap:ue,dispersion:Z,iridescence:ie,iridescenceMap:be,iridescenceThicknessMap:Be,sheen:Q,sheenColorMap:we,sheenRoughnessMap:me,specularMap:xe,specularColorMap:Ne,specularIntensityMap:We,transmission:Te,transmissionMap:b,thicknessMap:$,gradientMap:z,opaque:y.transparent===!1&&y.blending===Ci&&y.alphaToCoverage===!1,alphaMap:ee,alphaTest:ge,alphaHash:Ae,combine:y.combine,mapUv:ve&&_(y.map.channel),aoMapUv:Pe&&_(y.aoMap.channel),lightMapUv:Ue&&_(y.lightMap.channel),bumpMapUv:fe&&_(y.bumpMap.channel),normalMapUv:ye&&_(y.normalMap.channel),displacementMapUv:Me&&_(y.displacementMap.channel),emissiveMapUv:de&&_(y.emissiveMap.channel),metalnessMapUv:Ce&&_(y.metalnessMap.channel),roughnessMapUv:C&&_(y.roughnessMap.channel),anisotropyMapUv:le&&_(y.anisotropyMap.channel),clearcoatMapUv:ce&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:Se&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:Be&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:we&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:me&&_(y.sheenRoughnessMap.channel),specularMapUv:xe&&_(y.specularMap.channel),specularColorMapUv:Ne&&_(y.specularColorMap.channel),specularIntensityMapUv:We&&_(y.specularIntensityMap.channel),transmissionMapUv:b&&_(y.transmissionMap.channel),thicknessMapUv:$&&_(y.thicknessMap.channel),alphaMapUv:ee&&_(y.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(ye||S),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!W.attributes.uv&&(ve||ee),fog:!!N,useFog:y.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:I.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:F,morphTextureStride:H,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:je,decodeVideoTexture:ve&&y.map.isVideoTexture===!0&&nt.getTransfer(y.map.colorSpace)===ot,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===sn,flipSided:y.side===Ft,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Re&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:Re&&y.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Xe.vertexUv1s=c.has(1),Xe.vertexUv2s=c.has(2),Xe.vertexUv3s=c.has(3),c.clear(),Xe}function m(y){const v=[];if(y.shaderID?v.push(y.shaderID):(v.push(y.customVertexShaderID),v.push(y.customFragmentShaderID)),y.defines!==void 0)for(const L in y.defines)v.push(L),v.push(y.defines[L]);return y.isRawShaderMaterial===!1&&(M(v,y),x(v,y),v.push(s.outputColorSpace)),v.push(y.customProgramCacheKey),v.join()}function M(y,v){y.push(v.precision),y.push(v.outputColorSpace),y.push(v.envMapMode),y.push(v.envMapCubeUVHeight),y.push(v.mapUv),y.push(v.alphaMapUv),y.push(v.lightMapUv),y.push(v.aoMapUv),y.push(v.bumpMapUv),y.push(v.normalMapUv),y.push(v.displacementMapUv),y.push(v.emissiveMapUv),y.push(v.metalnessMapUv),y.push(v.roughnessMapUv),y.push(v.anisotropyMapUv),y.push(v.clearcoatMapUv),y.push(v.clearcoatNormalMapUv),y.push(v.clearcoatRoughnessMapUv),y.push(v.iridescenceMapUv),y.push(v.iridescenceThicknessMapUv),y.push(v.sheenColorMapUv),y.push(v.sheenRoughnessMapUv),y.push(v.specularMapUv),y.push(v.specularColorMapUv),y.push(v.specularIntensityMapUv),y.push(v.transmissionMapUv),y.push(v.thicknessMapUv),y.push(v.combine),y.push(v.fogExp2),y.push(v.sizeAttenuation),y.push(v.morphTargetsCount),y.push(v.morphAttributeCount),y.push(v.numDirLights),y.push(v.numPointLights),y.push(v.numSpotLights),y.push(v.numSpotLightMaps),y.push(v.numHemiLights),y.push(v.numRectAreaLights),y.push(v.numDirLightShadows),y.push(v.numPointLightShadows),y.push(v.numSpotLightShadows),y.push(v.numSpotLightShadowsWithMaps),y.push(v.numLightProbes),y.push(v.shadowMapType),y.push(v.toneMapping),y.push(v.numClippingPlanes),y.push(v.numClipIntersection),y.push(v.depthPacking)}function x(y,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),y.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.skinning&&a.enable(4),v.morphTargets&&a.enable(5),v.morphNormals&&a.enable(6),v.morphColors&&a.enable(7),v.premultipliedAlpha&&a.enable(8),v.shadowMapEnabled&&a.enable(9),v.doubleSided&&a.enable(10),v.flipSided&&a.enable(11),v.useDepthPacking&&a.enable(12),v.dithering&&a.enable(13),v.transmission&&a.enable(14),v.sheen&&a.enable(15),v.opaque&&a.enable(16),v.pointsUvs&&a.enable(17),v.decodeVideoTexture&&a.enable(18),v.alphaToCoverage&&a.enable(19),y.push(a.mask)}function E(y){const v=g[y.type];let L;if(v){const P=rn[v];L=dr.clone(P.uniforms)}else L=y.uniforms;return L}function R(y,v){let L;for(let P=0,I=h.length;P<I;P++){const N=h[P];if(N.cacheKey===v){L=N,++L.usedTimes;break}}return L===void 0&&(L=new Kg(s,v,y,r),h.push(L)),L}function w(y){if(--y.usedTimes===0){const v=h.indexOf(y);h[v]=h[h.length-1],h.pop(),y.destroy()}}function T(y){l.remove(y)}function U(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:E,acquireProgram:R,releaseProgram:w,releaseShaderCache:T,programs:h,dispose:U}}function e_(){let s=new WeakMap;function e(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function t(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function t_(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Bl(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function kl(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(d,u,f,g,_,p){let m=s[e];return m===void 0?(m={id:d.id,object:d,geometry:u,material:f,groupOrder:g,renderOrder:d.renderOrder,z:_,group:p},s[e]=m):(m.id=d.id,m.object=d,m.geometry=u,m.material=f,m.groupOrder=g,m.renderOrder=d.renderOrder,m.z=_,m.group=p),e++,m}function a(d,u,f,g,_,p){const m=o(d,u,f,g,_,p);f.transmission>0?n.push(m):f.transparent===!0?i.push(m):t.push(m)}function l(d,u,f,g,_,p){const m=o(d,u,f,g,_,p);f.transmission>0?n.unshift(m):f.transparent===!0?i.unshift(m):t.unshift(m)}function c(d,u){t.length>1&&t.sort(d||t_),n.length>1&&n.sort(u||Bl),i.length>1&&i.sort(u||Bl)}function h(){for(let d=e,u=s.length;d<u;d++){const f=s[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function n_(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new kl,s.set(n,[o])):i>=r.length?(o=new kl,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function i_(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new V,color:new Ve};break;case"SpotLight":t={position:new V,direction:new V,color:new Ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new V,color:new Ve,distance:0,decay:0};break;case"HemisphereLight":t={direction:new V,skyColor:new Ve,groundColor:new Ve};break;case"RectAreaLight":t={color:new Ve,position:new V,halfWidth:new V,halfHeight:new V};break}return s[e.id]=t,t}}}function r_(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let s_=0;function o_(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function a_(s){const e=new i_,t=r_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new V);const i=new V,r=new it,o=new it;function a(c){let h=0,d=0,u=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let f=0,g=0,_=0,p=0,m=0,M=0,x=0,E=0,R=0,w=0,T=0;c.sort(o_);for(let y=0,v=c.length;y<v;y++){const L=c[y],P=L.color,I=L.intensity,N=L.distance,W=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=P.r*I,d+=P.g*I,u+=P.b*I;else if(L.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(L.sh.coefficients[k],I);T++}else if(L.isDirectionalLight){const k=e.get(L);if(k.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const se=L.shadow,j=t.get(L);j.shadowBias=se.bias,j.shadowNormalBias=se.normalBias,j.shadowRadius=se.radius,j.shadowMapSize=se.mapSize,n.directionalShadow[f]=j,n.directionalShadowMap[f]=W,n.directionalShadowMatrix[f]=L.shadow.matrix,M++}n.directional[f]=k,f++}else if(L.isSpotLight){const k=e.get(L);k.position.setFromMatrixPosition(L.matrixWorld),k.color.copy(P).multiplyScalar(I),k.distance=N,k.coneCos=Math.cos(L.angle),k.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),k.decay=L.decay,n.spot[_]=k;const se=L.shadow;if(L.map&&(n.spotLightMap[R]=L.map,R++,se.updateMatrices(L),L.castShadow&&w++),n.spotLightMatrix[_]=se.matrix,L.castShadow){const j=t.get(L);j.shadowBias=se.bias,j.shadowNormalBias=se.normalBias,j.shadowRadius=se.radius,j.shadowMapSize=se.mapSize,n.spotShadow[_]=j,n.spotShadowMap[_]=W,E++}_++}else if(L.isRectAreaLight){const k=e.get(L);k.color.copy(P).multiplyScalar(I),k.halfWidth.set(L.width*.5,0,0),k.halfHeight.set(0,L.height*.5,0),n.rectArea[p]=k,p++}else if(L.isPointLight){const k=e.get(L);if(k.color.copy(L.color).multiplyScalar(L.intensity),k.distance=L.distance,k.decay=L.decay,L.castShadow){const se=L.shadow,j=t.get(L);j.shadowBias=se.bias,j.shadowNormalBias=se.normalBias,j.shadowRadius=se.radius,j.shadowMapSize=se.mapSize,j.shadowCameraNear=se.camera.near,j.shadowCameraFar=se.camera.far,n.pointShadow[g]=j,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=L.shadow.matrix,x++}n.point[g]=k,g++}else if(L.isHemisphereLight){const k=e.get(L);k.skyColor.copy(L.color).multiplyScalar(I),k.groundColor.copy(L.groundColor).multiplyScalar(I),n.hemi[m]=k,m++}}p>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Le.LTC_FLOAT_1,n.rectAreaLTC2=Le.LTC_FLOAT_2):(n.rectAreaLTC1=Le.LTC_HALF_1,n.rectAreaLTC2=Le.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const U=n.hash;(U.directionalLength!==f||U.pointLength!==g||U.spotLength!==_||U.rectAreaLength!==p||U.hemiLength!==m||U.numDirectionalShadows!==M||U.numPointShadows!==x||U.numSpotShadows!==E||U.numSpotMaps!==R||U.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=E,n.spotShadowMap.length=E,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=E+R-w,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=T,U.directionalLength=f,U.pointLength=g,U.spotLength=_,U.rectAreaLength=p,U.hemiLength=m,U.numDirectionalShadows=M,U.numPointShadows=x,U.numSpotShadows=E,U.numSpotMaps=R,U.numLightProbes=T,n.version=s_++)}function l(c,h){let d=0,u=0,f=0,g=0,_=0;const p=h.matrixWorldInverse;for(let m=0,M=c.length;m<M;m++){const x=c[m];if(x.isDirectionalLight){const E=n.directional[d];E.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(p),d++}else if(x.isSpotLight){const E=n.spot[f];E.position.setFromMatrixPosition(x.matrixWorld),E.position.applyMatrix4(p),E.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(p),f++}else if(x.isRectAreaLight){const E=n.rectArea[g];E.position.setFromMatrixPosition(x.matrixWorld),E.position.applyMatrix4(p),o.identity(),r.copy(x.matrixWorld),r.premultiply(p),o.extractRotation(r),E.halfWidth.set(x.width*.5,0,0),E.halfHeight.set(0,x.height*.5,0),E.halfWidth.applyMatrix4(o),E.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const E=n.point[u];E.position.setFromMatrixPosition(x.matrixWorld),E.position.applyMatrix4(p),u++}else if(x.isHemisphereLight){const E=n.hemi[_];E.direction.setFromMatrixPosition(x.matrixWorld),E.direction.transformDirection(p),_++}}}return{setup:a,setupView:l,state:n}}function zl(s){const e=new a_(s),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function l_(s){let e=new WeakMap;function t(i,r=0){const o=e.get(i);let a;return o===void 0?(a=new zl(s),e.set(i,[a])):r>=o.length?(a=new zl(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class ah extends Bi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ad,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class lh extends Bi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const c_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,h_=`uniform sampler2D shadow_pass;
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
}`;function u_(s,e,t){let n=new jo;const i=new Oe,r=new Oe,o=new ht,a=new ah({depthPacking:Gc}),l=new lh,c={},h=t.maxTextureSize,d={[Nn]:Ft,[Ft]:Nn,[sn]:sn},u=new It({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:c_,fragmentShader:h_}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Gt;g.setAttribute("position",new zt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Rt(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Uc;let m=this.type;this.render=function(w,T,U){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const y=s.getRenderTarget(),v=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),P=s.state;P.setBlending(yn),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const I=m!==gn&&this.type===gn,N=m===gn&&this.type!==gn;for(let W=0,k=w.length;W<k;W++){const se=w[W],j=se.shadow;if(j===void 0){console.warn("THREE.WebGLShadowMap:",se,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;i.copy(j.mapSize);const K=j.getFrameExtents();if(i.multiply(K),r.copy(j.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/K.x),i.x=r.x*K.x,j.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/K.y),i.y=r.y*K.y,j.mapSize.y=r.y)),j.map===null||I===!0||N===!0){const F=this.type!==gn?{minFilter:Dt,magFilter:Dt}:{};j.map!==null&&j.map.dispose(),j.map=new en(i.x,i.y,F),j.map.texture.name=se.name+".shadowMap",j.camera.updateProjectionMatrix()}s.setRenderTarget(j.map),s.clear();const q=j.getViewportCount();for(let F=0;F<q;F++){const H=j.getViewport(F);o.set(r.x*H.x,r.y*H.y,r.x*H.z,r.y*H.w),P.viewport(o),j.updateMatrices(se,F),n=j.getFrustum(),E(T,U,j.camera,se,this.type)}j.isPointLightShadow!==!0&&this.type===gn&&M(j,U),j.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(y,v,L)};function M(w,T){const U=e.update(_);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new en(i.x,i.y)),u.uniforms.shadow_pass.value=w.map.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(T,null,U,u,_,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(T,null,U,f,_,null)}function x(w,T,U,y){let v=null;const L=U.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(L!==void 0)v=L;else if(v=U.isPointLight===!0?l:a,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const P=v.uuid,I=T.uuid;let N=c[P];N===void 0&&(N={},c[P]=N);let W=N[I];W===void 0&&(W=v.clone(),N[I]=W,T.addEventListener("dispose",R)),v=W}if(v.visible=T.visible,v.wireframe=T.wireframe,y===gn?v.side=T.shadowSide!==null?T.shadowSide:T.side:v.side=T.shadowSide!==null?T.shadowSide:d[T.side],v.alphaMap=T.alphaMap,v.alphaTest=T.alphaTest,v.map=T.map,v.clipShadows=T.clipShadows,v.clippingPlanes=T.clippingPlanes,v.clipIntersection=T.clipIntersection,v.displacementMap=T.displacementMap,v.displacementScale=T.displacementScale,v.displacementBias=T.displacementBias,v.wireframeLinewidth=T.wireframeLinewidth,v.linewidth=T.linewidth,U.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const P=s.properties.get(v);P.light=U}return v}function E(w,T,U,y,v){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&v===gn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,w.matrixWorld);const I=e.update(w),N=w.material;if(Array.isArray(N)){const W=I.groups;for(let k=0,se=W.length;k<se;k++){const j=W[k],K=N[j.materialIndex];if(K&&K.visible){const q=x(w,K,y,v);w.onBeforeShadow(s,w,T,U,I,q,j),s.renderBufferDirect(U,null,I,q,w,j),w.onAfterShadow(s,w,T,U,I,q,j)}}}else if(N.visible){const W=x(w,N,y,v);w.onBeforeShadow(s,w,T,U,I,W,null),s.renderBufferDirect(U,null,I,W,w,null),w.onAfterShadow(s,w,T,U,I,W,null)}}const P=w.children;for(let I=0,N=P.length;I<N;I++)E(P[I],T,U,y,v)}function R(w){w.target.removeEventListener("dispose",R);for(const U in c){const y=c[U],v=w.target.uuid;v in y&&(y[v].dispose(),delete y[v])}}}function d_(s){function e(){let b=!1;const $=new ht;let z=null;const ee=new ht(0,0,0,0);return{setMask:function(ge){z!==ge&&!b&&(s.colorMask(ge,ge,ge,ge),z=ge)},setLocked:function(ge){b=ge},setClear:function(ge,Ae,Re,je,Xe){Xe===!0&&(ge*=je,Ae*=je,Re*=je),$.set(ge,Ae,Re,je),ee.equals($)===!1&&(s.clearColor(ge,Ae,Re,je),ee.copy($))},reset:function(){b=!1,z=null,ee.set(-1,0,0,0)}}}function t(){let b=!1,$=null,z=null,ee=null;return{setTest:function(ge){ge?te(s.DEPTH_TEST):G(s.DEPTH_TEST)},setMask:function(ge){$!==ge&&!b&&(s.depthMask(ge),$=ge)},setFunc:function(ge){if(z!==ge){switch(ge){case Fu:s.depthFunc(s.NEVER);break;case Nu:s.depthFunc(s.ALWAYS);break;case Ou:s.depthFunc(s.LESS);break;case hs:s.depthFunc(s.LEQUAL);break;case Bu:s.depthFunc(s.EQUAL);break;case ku:s.depthFunc(s.GEQUAL);break;case zu:s.depthFunc(s.GREATER);break;case Gu:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}z=ge}},setLocked:function(ge){b=ge},setClear:function(ge){ee!==ge&&(s.clearDepth(ge),ee=ge)},reset:function(){b=!1,$=null,z=null,ee=null}}}function n(){let b=!1,$=null,z=null,ee=null,ge=null,Ae=null,Re=null,je=null,Xe=null;return{setTest:function(De){b||(De?te(s.STENCIL_TEST):G(s.STENCIL_TEST))},setMask:function(De){$!==De&&!b&&(s.stencilMask(De),$=De)},setFunc:function(De,Ye,Je){(z!==De||ee!==Ye||ge!==Je)&&(s.stencilFunc(De,Ye,Je),z=De,ee=Ye,ge=Je)},setOp:function(De,Ye,Je){(Ae!==De||Re!==Ye||je!==Je)&&(s.stencilOp(De,Ye,Je),Ae=De,Re=Ye,je=Je)},setLocked:function(De){b=De},setClear:function(De){Xe!==De&&(s.clearStencil(De),Xe=De)},reset:function(){b=!1,$=null,z=null,ee=null,ge=null,Ae=null,Re=null,je=null,Xe=null}}}const i=new e,r=new t,o=new n,a=new WeakMap,l=new WeakMap;let c={},h={},d=new WeakMap,u=[],f=null,g=!1,_=null,p=null,m=null,M=null,x=null,E=null,R=null,w=new Ve(0,0,0),T=0,U=!1,y=null,v=null,L=null,P=null,I=null;const N=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,k=0;const se=s.getParameter(s.VERSION);se.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(se)[1]),W=k>=1):se.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(se)[1]),W=k>=2);let j=null,K={};const q=s.getParameter(s.SCISSOR_BOX),F=s.getParameter(s.VIEWPORT),H=new ht().fromArray(q),ne=new ht().fromArray(F);function O(b,$,z,ee){const ge=new Uint8Array(4),Ae=s.createTexture();s.bindTexture(b,Ae),s.texParameteri(b,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(b,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Re=0;Re<z;Re++)b===s.TEXTURE_3D||b===s.TEXTURE_2D_ARRAY?s.texImage3D($,0,s.RGBA,1,1,ee,0,s.RGBA,s.UNSIGNED_BYTE,ge):s.texImage2D($+Re,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ge);return Ae}const B={};B[s.TEXTURE_2D]=O(s.TEXTURE_2D,s.TEXTURE_2D,1),B[s.TEXTURE_CUBE_MAP]=O(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),B[s.TEXTURE_2D_ARRAY]=O(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),B[s.TEXTURE_3D]=O(s.TEXTURE_3D,s.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),o.setClear(0),te(s.DEPTH_TEST),r.setFunc(hs),fe(!1),ye(Ma),te(s.CULL_FACE),Pe(yn);function te(b){c[b]!==!0&&(s.enable(b),c[b]=!0)}function G(b){c[b]!==!1&&(s.disable(b),c[b]=!1)}function ae(b,$){return h[b]!==$?(s.bindFramebuffer(b,$),h[b]=$,b===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=$),b===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=$),!0):!1}function pe(b,$){let z=u,ee=!1;if(b){z=d.get($),z===void 0&&(z=[],d.set($,z));const ge=b.textures;if(z.length!==ge.length||z[0]!==s.COLOR_ATTACHMENT0){for(let Ae=0,Re=ge.length;Ae<Re;Ae++)z[Ae]=s.COLOR_ATTACHMENT0+Ae;z.length=ge.length,ee=!0}}else z[0]!==s.BACK&&(z[0]=s.BACK,ee=!0);ee&&s.drawBuffers(z)}function ve(b){return f!==b?(s.useProgram(b),f=b,!0):!1}const D={[Kn]:s.FUNC_ADD,[vu]:s.FUNC_SUBTRACT,[xu]:s.FUNC_REVERSE_SUBTRACT};D[yu]=s.MIN,D[Su]=s.MAX;const he={[Mu]:s.ZERO,[bu]:s.ONE,[Eu]:s.SRC_COLOR,[wo]:s.SRC_ALPHA,[Pu]:s.SRC_ALPHA_SATURATE,[Cu]:s.DST_COLOR,[wu]:s.DST_ALPHA,[Tu]:s.ONE_MINUS_SRC_COLOR,[Ao]:s.ONE_MINUS_SRC_ALPHA,[Ru]:s.ONE_MINUS_DST_COLOR,[Au]:s.ONE_MINUS_DST_ALPHA,[Uu]:s.CONSTANT_COLOR,[Lu]:s.ONE_MINUS_CONSTANT_COLOR,[Du]:s.CONSTANT_ALPHA,[Iu]:s.ONE_MINUS_CONSTANT_ALPHA};function Pe(b,$,z,ee,ge,Ae,Re,je,Xe,De){if(b===yn){g===!0&&(G(s.BLEND),g=!1);return}if(g===!1&&(te(s.BLEND),g=!0),b!==_u){if(b!==_||De!==U){if((p!==Kn||x!==Kn)&&(s.blendEquation(s.FUNC_ADD),p=Kn,x=Kn),De)switch(b){case Ci:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case cs:s.blendFunc(s.ONE,s.ONE);break;case ba:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ea:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",b);break}else switch(b){case Ci:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case cs:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case ba:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ea:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",b);break}m=null,M=null,E=null,R=null,w.set(0,0,0),T=0,_=b,U=De}return}ge=ge||$,Ae=Ae||z,Re=Re||ee,($!==p||ge!==x)&&(s.blendEquationSeparate(D[$],D[ge]),p=$,x=ge),(z!==m||ee!==M||Ae!==E||Re!==R)&&(s.blendFuncSeparate(he[z],he[ee],he[Ae],he[Re]),m=z,M=ee,E=Ae,R=Re),(je.equals(w)===!1||Xe!==T)&&(s.blendColor(je.r,je.g,je.b,Xe),w.copy(je),T=Xe),_=b,U=!1}function Ue(b,$){b.side===sn?G(s.CULL_FACE):te(s.CULL_FACE);let z=b.side===Ft;$&&(z=!z),fe(z),b.blending===Ci&&b.transparent===!1?Pe(yn):Pe(b.blending,b.blendEquation,b.blendSrc,b.blendDst,b.blendEquationAlpha,b.blendSrcAlpha,b.blendDstAlpha,b.blendColor,b.blendAlpha,b.premultipliedAlpha),r.setFunc(b.depthFunc),r.setTest(b.depthTest),r.setMask(b.depthWrite),i.setMask(b.colorWrite);const ee=b.stencilWrite;o.setTest(ee),ee&&(o.setMask(b.stencilWriteMask),o.setFunc(b.stencilFunc,b.stencilRef,b.stencilFuncMask),o.setOp(b.stencilFail,b.stencilZFail,b.stencilZPass)),de(b.polygonOffset,b.polygonOffsetFactor,b.polygonOffsetUnits),b.alphaToCoverage===!0?te(s.SAMPLE_ALPHA_TO_COVERAGE):G(s.SAMPLE_ALPHA_TO_COVERAGE)}function fe(b){y!==b&&(b?s.frontFace(s.CW):s.frontFace(s.CCW),y=b)}function ye(b){b!==pu?(te(s.CULL_FACE),b!==v&&(b===Ma?s.cullFace(s.BACK):b===mu?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):G(s.CULL_FACE),v=b}function Me(b){b!==L&&(W&&s.lineWidth(b),L=b)}function de(b,$,z){b?(te(s.POLYGON_OFFSET_FILL),(P!==$||I!==z)&&(s.polygonOffset($,z),P=$,I=z)):G(s.POLYGON_OFFSET_FILL)}function Ce(b){b?te(s.SCISSOR_TEST):G(s.SCISSOR_TEST)}function C(b){b===void 0&&(b=s.TEXTURE0+N-1),j!==b&&(s.activeTexture(b),j=b)}function S(b,$,z){z===void 0&&(j===null?z=s.TEXTURE0+N-1:z=j);let ee=K[z];ee===void 0&&(ee={type:void 0,texture:void 0},K[z]=ee),(ee.type!==b||ee.texture!==$)&&(j!==z&&(s.activeTexture(z),j=z),s.bindTexture(b,$||B[b]),ee.type=b,ee.texture=$)}function X(){const b=K[j];b!==void 0&&b.type!==void 0&&(s.bindTexture(b.type,null),b.type=void 0,b.texture=void 0)}function Z(){try{s.compressedTexImage2D.apply(s,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function ie(){try{s.compressedTexImage3D.apply(s,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Q(){try{s.texSubImage2D.apply(s,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Te(){try{s.texSubImage3D.apply(s,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function le(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function ce(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Se(){try{s.texStorage2D.apply(s,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function ue(){try{s.texStorage3D.apply(s,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function be(){try{s.texImage2D.apply(s,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function Be(){try{s.texImage3D.apply(s,arguments)}catch(b){console.error("THREE.WebGLState:",b)}}function we(b){H.equals(b)===!1&&(s.scissor(b.x,b.y,b.z,b.w),H.copy(b))}function me(b){ne.equals(b)===!1&&(s.viewport(b.x,b.y,b.z,b.w),ne.copy(b))}function xe(b,$){let z=l.get($);z===void 0&&(z=new WeakMap,l.set($,z));let ee=z.get(b);ee===void 0&&(ee=s.getUniformBlockIndex($,b.name),z.set(b,ee))}function Ne(b,$){const ee=l.get($).get(b);a.get($)!==ee&&(s.uniformBlockBinding($,ee,b.__bindingPointIndex),a.set($,ee))}function We(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),c={},j=null,K={},h={},d=new WeakMap,u=[],f=null,g=!1,_=null,p=null,m=null,M=null,x=null,E=null,R=null,w=new Ve(0,0,0),T=0,U=!1,y=null,v=null,L=null,P=null,I=null,H.set(0,0,s.canvas.width,s.canvas.height),ne.set(0,0,s.canvas.width,s.canvas.height),i.reset(),r.reset(),o.reset()}return{buffers:{color:i,depth:r,stencil:o},enable:te,disable:G,bindFramebuffer:ae,drawBuffers:pe,useProgram:ve,setBlending:Pe,setMaterial:Ue,setFlipSided:fe,setCullFace:ye,setLineWidth:Me,setPolygonOffset:de,setScissorTest:Ce,activeTexture:C,bindTexture:S,unbindTexture:X,compressedTexImage2D:Z,compressedTexImage3D:ie,texImage2D:be,texImage3D:Be,updateUBOMapping:xe,uniformBlockBinding:Ne,texStorage2D:Se,texStorage3D:ue,texSubImage2D:Q,texSubImage3D:Te,compressedTexSubImage2D:le,compressedTexSubImage3D:ce,scissor:we,viewport:me,reset:We}}function f_(s,e,t,n,i,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Oe,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,S){return f?new OffscreenCanvas(C,S):gs("canvas")}function _(C,S,X){let Z=1;const ie=Ce(C);if((ie.width>X||ie.height>X)&&(Z=X/Math.max(ie.width,ie.height)),Z<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const Q=Math.floor(Z*ie.width),Te=Math.floor(Z*ie.height);d===void 0&&(d=g(Q,Te));const le=S?g(Q,Te):d;return le.width=Q,le.height=Te,le.getContext("2d").drawImage(C,0,0,Q,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+Q+"x"+Te+")."),le}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),C;return C}function p(C){return C.generateMipmaps&&C.minFilter!==Dt&&C.minFilter!==kt}function m(C){s.generateMipmap(C)}function M(C,S,X,Z,ie=!1){if(C!==null){if(s[C]!==void 0)return s[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Q=S;if(S===s.RED&&(X===s.FLOAT&&(Q=s.R32F),X===s.HALF_FLOAT&&(Q=s.R16F),X===s.UNSIGNED_BYTE&&(Q=s.R8)),S===s.RED_INTEGER&&(X===s.UNSIGNED_BYTE&&(Q=s.R8UI),X===s.UNSIGNED_SHORT&&(Q=s.R16UI),X===s.UNSIGNED_INT&&(Q=s.R32UI),X===s.BYTE&&(Q=s.R8I),X===s.SHORT&&(Q=s.R16I),X===s.INT&&(Q=s.R32I)),S===s.RG&&(X===s.FLOAT&&(Q=s.RG32F),X===s.HALF_FLOAT&&(Q=s.RG16F),X===s.UNSIGNED_BYTE&&(Q=s.RG8)),S===s.RG_INTEGER&&(X===s.UNSIGNED_BYTE&&(Q=s.RG8UI),X===s.UNSIGNED_SHORT&&(Q=s.RG16UI),X===s.UNSIGNED_INT&&(Q=s.RG32UI),X===s.BYTE&&(Q=s.RG8I),X===s.SHORT&&(Q=s.RG16I),X===s.INT&&(Q=s.RG32I)),S===s.RGB&&X===s.UNSIGNED_INT_5_9_9_9_REV&&(Q=s.RGB9_E5),S===s.RGBA){const Te=ie?ds:nt.getTransfer(Z);X===s.FLOAT&&(Q=s.RGBA32F),X===s.HALF_FLOAT&&(Q=s.RGBA16F),X===s.UNSIGNED_BYTE&&(Q=Te===ot?s.SRGB8_ALPHA8:s.RGBA8),X===s.UNSIGNED_SHORT_4_4_4_4&&(Q=s.RGBA4),X===s.UNSIGNED_SHORT_5_5_5_1&&(Q=s.RGB5_A1)}return(Q===s.R16F||Q===s.R32F||Q===s.RG16F||Q===s.RG32F||Q===s.RGBA16F||Q===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function x(C,S){let X;return C?S===null||S===Di||S===Ii?X=s.DEPTH24_STENCIL8:S===vn?X=s.DEPTH32F_STENCIL8:S===us&&(X=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Di||S===Ii?X=s.DEPTH_COMPONENT24:S===vn?X=s.DEPTH_COMPONENT32F:S===us&&(X=s.DEPTH_COMPONENT16),X}function E(C,S){return p(C)===!0||C.isFramebufferTexture&&C.minFilter!==Dt&&C.minFilter!==kt?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function R(C){const S=C.target;S.removeEventListener("dispose",R),T(S),S.isVideoTexture&&h.delete(S)}function w(C){const S=C.target;S.removeEventListener("dispose",w),y(S)}function T(C){const S=n.get(C);if(S.__webglInit===void 0)return;const X=C.source,Z=u.get(X);if(Z){const ie=Z[S.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&U(C),Object.keys(Z).length===0&&u.delete(X)}n.remove(C)}function U(C){const S=n.get(C);s.deleteTexture(S.__webglTexture);const X=C.source,Z=u.get(X);delete Z[S.__cacheKey],o.memory.textures--}function y(C){const S=n.get(C);if(C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(S.__webglFramebuffer[Z]))for(let ie=0;ie<S.__webglFramebuffer[Z].length;ie++)s.deleteFramebuffer(S.__webglFramebuffer[Z][ie]);else s.deleteFramebuffer(S.__webglFramebuffer[Z]);S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer[Z])}else{if(Array.isArray(S.__webglFramebuffer))for(let Z=0;Z<S.__webglFramebuffer.length;Z++)s.deleteFramebuffer(S.__webglFramebuffer[Z]);else s.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&s.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Z=0;Z<S.__webglColorRenderbuffer.length;Z++)S.__webglColorRenderbuffer[Z]&&s.deleteRenderbuffer(S.__webglColorRenderbuffer[Z]);S.__webglDepthRenderbuffer&&s.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const X=C.textures;for(let Z=0,ie=X.length;Z<ie;Z++){const Q=n.get(X[Z]);Q.__webglTexture&&(s.deleteTexture(Q.__webglTexture),o.memory.textures--),n.remove(X[Z])}n.remove(C)}let v=0;function L(){v=0}function P(){const C=v;return C>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),v+=1,C}function I(C){const S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function N(C,S){const X=n.get(C);if(C.isVideoTexture&&Me(C),C.isRenderTargetTexture===!1&&C.version>0&&X.__version!==C.version){const Z=C.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ne(X,C,S);return}}t.bindTexture(s.TEXTURE_2D,X.__webglTexture,s.TEXTURE0+S)}function W(C,S){const X=n.get(C);if(C.version>0&&X.__version!==C.version){ne(X,C,S);return}t.bindTexture(s.TEXTURE_2D_ARRAY,X.__webglTexture,s.TEXTURE0+S)}function k(C,S){const X=n.get(C);if(C.version>0&&X.__version!==C.version){ne(X,C,S);return}t.bindTexture(s.TEXTURE_3D,X.__webglTexture,s.TEXTURE0+S)}function se(C,S){const X=n.get(C);if(C.version>0&&X.__version!==C.version){O(X,C,S);return}t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture,s.TEXTURE0+S)}const j={[Po]:s.REPEAT,[Qn]:s.CLAMP_TO_EDGE,[Uo]:s.MIRRORED_REPEAT},K={[Dt]:s.NEAREST,[Ju]:s.NEAREST_MIPMAP_NEAREST,[wr]:s.NEAREST_MIPMAP_LINEAR,[kt]:s.LINEAR,[Bs]:s.LINEAR_MIPMAP_NEAREST,[$n]:s.LINEAR_MIPMAP_LINEAR},q={[cd]:s.NEVER,[md]:s.ALWAYS,[hd]:s.LESS,[Vc]:s.LEQUAL,[ud]:s.EQUAL,[pd]:s.GEQUAL,[dd]:s.GREATER,[fd]:s.NOTEQUAL};function F(C,S){if(S.type===vn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===kt||S.magFilter===Bs||S.magFilter===wr||S.magFilter===$n||S.minFilter===kt||S.minFilter===Bs||S.minFilter===wr||S.minFilter===$n)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,j[S.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,j[S.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,j[S.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,K[S.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,K[S.minFilter]),S.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,q[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Dt||S.minFilter!==wr&&S.minFilter!==$n||S.type===vn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const X=e.get("EXT_texture_filter_anisotropic");s.texParameterf(C,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function H(C,S){let X=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",R));const Z=S.source;let ie=u.get(Z);ie===void 0&&(ie={},u.set(Z,ie));const Q=I(S);if(Q!==C.__cacheKey){ie[Q]===void 0&&(ie[Q]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,X=!0),ie[Q].usedTimes++;const Te=ie[C.__cacheKey];Te!==void 0&&(ie[C.__cacheKey].usedTimes--,Te.usedTimes===0&&U(S)),C.__cacheKey=Q,C.__webglTexture=ie[Q].texture}return X}function ne(C,S,X){let Z=s.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Z=s.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Z=s.TEXTURE_3D);const ie=H(C,S),Q=S.source;t.bindTexture(Z,C.__webglTexture,s.TEXTURE0+X);const Te=n.get(Q);if(Q.version!==Te.__version||ie===!0){t.activeTexture(s.TEXTURE0+X);const le=nt.getPrimaries(nt.workingColorSpace),ce=S.colorSpace===Dn?null:nt.getPrimaries(S.colorSpace),Se=S.colorSpace===Dn||le===ce?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);let ue=_(S.image,!1,i.maxTextureSize);ue=de(S,ue);const be=r.convert(S.format,S.colorSpace),Be=r.convert(S.type);let we=M(S.internalFormat,be,Be,S.colorSpace,S.isVideoTexture);F(Z,S);let me;const xe=S.mipmaps,Ne=S.isVideoTexture!==!0,We=Te.__version===void 0||ie===!0,b=Q.dataReady,$=E(S,ue);if(S.isDepthTexture)we=x(S.format===Fi,S.type),We&&(Ne?t.texStorage2D(s.TEXTURE_2D,1,we,ue.width,ue.height):t.texImage2D(s.TEXTURE_2D,0,we,ue.width,ue.height,0,be,Be,null));else if(S.isDataTexture)if(xe.length>0){Ne&&We&&t.texStorage2D(s.TEXTURE_2D,$,we,xe[0].width,xe[0].height);for(let z=0,ee=xe.length;z<ee;z++)me=xe[z],Ne?b&&t.texSubImage2D(s.TEXTURE_2D,z,0,0,me.width,me.height,be,Be,me.data):t.texImage2D(s.TEXTURE_2D,z,we,me.width,me.height,0,be,Be,me.data);S.generateMipmaps=!1}else Ne?(We&&t.texStorage2D(s.TEXTURE_2D,$,we,ue.width,ue.height),b&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ue.width,ue.height,be,Be,ue.data)):t.texImage2D(s.TEXTURE_2D,0,we,ue.width,ue.height,0,be,Be,ue.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ne&&We&&t.texStorage3D(s.TEXTURE_2D_ARRAY,$,we,xe[0].width,xe[0].height,ue.depth);for(let z=0,ee=xe.length;z<ee;z++)if(me=xe[z],S.format!==an)if(be!==null)if(Ne){if(b)if(S.layerUpdates.size>0){for(const ge of S.layerUpdates){const Ae=me.width*me.height;t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,z,0,0,ge,me.width,me.height,1,be,me.data.slice(Ae*ge,Ae*(ge+1)),0,0)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,z,0,0,0,me.width,me.height,ue.depth,be,me.data,0,0)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,z,we,me.width,me.height,ue.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ne?b&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,z,0,0,0,me.width,me.height,ue.depth,be,Be,me.data):t.texImage3D(s.TEXTURE_2D_ARRAY,z,we,me.width,me.height,ue.depth,0,be,Be,me.data)}else{Ne&&We&&t.texStorage2D(s.TEXTURE_2D,$,we,xe[0].width,xe[0].height);for(let z=0,ee=xe.length;z<ee;z++)me=xe[z],S.format!==an?be!==null?Ne?b&&t.compressedTexSubImage2D(s.TEXTURE_2D,z,0,0,me.width,me.height,be,me.data):t.compressedTexImage2D(s.TEXTURE_2D,z,we,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ne?b&&t.texSubImage2D(s.TEXTURE_2D,z,0,0,me.width,me.height,be,Be,me.data):t.texImage2D(s.TEXTURE_2D,z,we,me.width,me.height,0,be,Be,me.data)}else if(S.isDataArrayTexture)if(Ne){if(We&&t.texStorage3D(s.TEXTURE_2D_ARRAY,$,we,ue.width,ue.height,ue.depth),b)if(S.layerUpdates.size>0){let z;switch(Be){case s.UNSIGNED_BYTE:switch(be){case s.ALPHA:z=1;break;case s.LUMINANCE:z=1;break;case s.LUMINANCE_ALPHA:z=2;break;case s.RGB:z=3;break;case s.RGBA:z=4;break;default:throw new Error(`Unknown texel size for format ${be}.`)}break;case s.UNSIGNED_SHORT_4_4_4_4:case s.UNSIGNED_SHORT_5_5_5_1:case s.UNSIGNED_SHORT_5_6_5:z=1;break;default:throw new Error(`Unknown texel size for type ${Be}.`)}const ee=ue.width*ue.height*z;for(const ge of S.layerUpdates)t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ge,ue.width,ue.height,1,be,Be,ue.data.slice(ee*ge,ee*(ge+1)));S.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,be,Be,ue.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,we,ue.width,ue.height,ue.depth,0,be,Be,ue.data);else if(S.isData3DTexture)Ne?(We&&t.texStorage3D(s.TEXTURE_3D,$,we,ue.width,ue.height,ue.depth),b&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,be,Be,ue.data)):t.texImage3D(s.TEXTURE_3D,0,we,ue.width,ue.height,ue.depth,0,be,Be,ue.data);else if(S.isFramebufferTexture){if(We)if(Ne)t.texStorage2D(s.TEXTURE_2D,$,we,ue.width,ue.height);else{let z=ue.width,ee=ue.height;for(let ge=0;ge<$;ge++)t.texImage2D(s.TEXTURE_2D,ge,we,z,ee,0,be,Be,null),z>>=1,ee>>=1}}else if(xe.length>0){if(Ne&&We){const z=Ce(xe[0]);t.texStorage2D(s.TEXTURE_2D,$,we,z.width,z.height)}for(let z=0,ee=xe.length;z<ee;z++)me=xe[z],Ne?b&&t.texSubImage2D(s.TEXTURE_2D,z,0,0,be,Be,me):t.texImage2D(s.TEXTURE_2D,z,we,be,Be,me);S.generateMipmaps=!1}else if(Ne){if(We){const z=Ce(ue);t.texStorage2D(s.TEXTURE_2D,$,we,z.width,z.height)}b&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,be,Be,ue)}else t.texImage2D(s.TEXTURE_2D,0,we,be,Be,ue);p(S)&&m(Z),Te.__version=Q.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function O(C,S,X){if(S.image.length!==6)return;const Z=H(C,S),ie=S.source;t.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+X);const Q=n.get(ie);if(ie.version!==Q.__version||Z===!0){t.activeTexture(s.TEXTURE0+X);const Te=nt.getPrimaries(nt.workingColorSpace),le=S.colorSpace===Dn?null:nt.getPrimaries(S.colorSpace),ce=S.colorSpace===Dn||Te===le?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);const Se=S.isCompressedTexture||S.image[0].isCompressedTexture,ue=S.image[0]&&S.image[0].isDataTexture,be=[];for(let ee=0;ee<6;ee++)!Se&&!ue?be[ee]=_(S.image[ee],!0,i.maxCubemapSize):be[ee]=ue?S.image[ee].image:S.image[ee],be[ee]=de(S,be[ee]);const Be=be[0],we=r.convert(S.format,S.colorSpace),me=r.convert(S.type),xe=M(S.internalFormat,we,me,S.colorSpace),Ne=S.isVideoTexture!==!0,We=Q.__version===void 0||Z===!0,b=ie.dataReady;let $=E(S,Be);F(s.TEXTURE_CUBE_MAP,S);let z;if(Se){Ne&&We&&t.texStorage2D(s.TEXTURE_CUBE_MAP,$,xe,Be.width,Be.height);for(let ee=0;ee<6;ee++){z=be[ee].mipmaps;for(let ge=0;ge<z.length;ge++){const Ae=z[ge];S.format!==an?we!==null?Ne?b&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,0,0,Ae.width,Ae.height,we,Ae.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,xe,Ae.width,Ae.height,0,Ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ne?b&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,0,0,Ae.width,Ae.height,we,me,Ae.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,xe,Ae.width,Ae.height,0,we,me,Ae.data)}}}else{if(z=S.mipmaps,Ne&&We){z.length>0&&$++;const ee=Ce(be[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,$,xe,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(ue){Ne?b&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,be[ee].width,be[ee].height,we,me,be[ee].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,xe,be[ee].width,be[ee].height,0,we,me,be[ee].data);for(let ge=0;ge<z.length;ge++){const Re=z[ge].image[ee].image;Ne?b&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,0,0,Re.width,Re.height,we,me,Re.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,xe,Re.width,Re.height,0,we,me,Re.data)}}else{Ne?b&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,we,me,be[ee]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,xe,we,me,be[ee]);for(let ge=0;ge<z.length;ge++){const Ae=z[ge];Ne?b&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,0,0,we,me,Ae.image[ee]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,xe,we,me,Ae.image[ee])}}}p(S)&&m(s.TEXTURE_CUBE_MAP),Q.__version=ie.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function B(C,S,X,Z,ie,Q){const Te=r.convert(X.format,X.colorSpace),le=r.convert(X.type),ce=M(X.internalFormat,Te,le,X.colorSpace);if(!n.get(S).__hasExternalTextures){const ue=Math.max(1,S.width>>Q),be=Math.max(1,S.height>>Q);ie===s.TEXTURE_3D||ie===s.TEXTURE_2D_ARRAY?t.texImage3D(ie,Q,ce,ue,be,S.depth,0,Te,le,null):t.texImage2D(ie,Q,ce,ue,be,0,Te,le,null)}t.bindFramebuffer(s.FRAMEBUFFER,C),ye(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Z,ie,n.get(X).__webglTexture,0,fe(S)):(ie===s.TEXTURE_2D||ie>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Z,ie,n.get(X).__webglTexture,Q),t.bindFramebuffer(s.FRAMEBUFFER,null)}function te(C,S,X){if(s.bindRenderbuffer(s.RENDERBUFFER,C),S.depthBuffer){const Z=S.depthTexture,ie=Z&&Z.isDepthTexture?Z.type:null,Q=x(S.stencilBuffer,ie),Te=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,le=fe(S);ye(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,le,Q,S.width,S.height):X?s.renderbufferStorageMultisample(s.RENDERBUFFER,le,Q,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,Q,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Te,s.RENDERBUFFER,C)}else{const Z=S.textures;for(let ie=0;ie<Z.length;ie++){const Q=Z[ie],Te=r.convert(Q.format,Q.colorSpace),le=r.convert(Q.type),ce=M(Q.internalFormat,Te,le,Q.colorSpace),Se=fe(S);X&&ye(S)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Se,ce,S.width,S.height):ye(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Se,ce,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,ce,S.width,S.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function G(C,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),N(S.depthTexture,0);const Z=n.get(S.depthTexture).__webglTexture,ie=fe(S);if(S.depthTexture.format===Ri)ye(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Z,0,ie):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Z,0);else if(S.depthTexture.format===Fi)ye(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Z,0,ie):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function ae(C){const S=n.get(C),X=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!S.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");G(S.__webglFramebuffer,C)}else if(X){S.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[Z]),S.__webglDepthbuffer[Z]=s.createRenderbuffer(),te(S.__webglDepthbuffer[Z],C,!1)}else t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=s.createRenderbuffer(),te(S.__webglDepthbuffer,C,!1);t.bindFramebuffer(s.FRAMEBUFFER,null)}function pe(C,S,X){const Z=n.get(C);S!==void 0&&B(Z.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),X!==void 0&&ae(C)}function ve(C){const S=C.texture,X=n.get(C),Z=n.get(S);C.addEventListener("dispose",w);const ie=C.textures,Q=C.isWebGLCubeRenderTarget===!0,Te=ie.length>1;if(Te||(Z.__webglTexture===void 0&&(Z.__webglTexture=s.createTexture()),Z.__version=S.version,o.memory.textures++),Q){X.__webglFramebuffer=[];for(let le=0;le<6;le++)if(S.mipmaps&&S.mipmaps.length>0){X.__webglFramebuffer[le]=[];for(let ce=0;ce<S.mipmaps.length;ce++)X.__webglFramebuffer[le][ce]=s.createFramebuffer()}else X.__webglFramebuffer[le]=s.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){X.__webglFramebuffer=[];for(let le=0;le<S.mipmaps.length;le++)X.__webglFramebuffer[le]=s.createFramebuffer()}else X.__webglFramebuffer=s.createFramebuffer();if(Te)for(let le=0,ce=ie.length;le<ce;le++){const Se=n.get(ie[le]);Se.__webglTexture===void 0&&(Se.__webglTexture=s.createTexture(),o.memory.textures++)}if(C.samples>0&&ye(C)===!1){X.__webglMultisampledFramebuffer=s.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let le=0;le<ie.length;le++){const ce=ie[le];X.__webglColorRenderbuffer[le]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,X.__webglColorRenderbuffer[le]);const Se=r.convert(ce.format,ce.colorSpace),ue=r.convert(ce.type),be=M(ce.internalFormat,Se,ue,ce.colorSpace,C.isXRRenderTarget===!0),Be=fe(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,Be,be,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+le,s.RENDERBUFFER,X.__webglColorRenderbuffer[le])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(X.__webglDepthRenderbuffer=s.createRenderbuffer(),te(X.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Q){t.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture),F(s.TEXTURE_CUBE_MAP,S);for(let le=0;le<6;le++)if(S.mipmaps&&S.mipmaps.length>0)for(let ce=0;ce<S.mipmaps.length;ce++)B(X.__webglFramebuffer[le][ce],C,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+le,ce);else B(X.__webglFramebuffer[le],C,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);p(S)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let le=0,ce=ie.length;le<ce;le++){const Se=ie[le],ue=n.get(Se);t.bindTexture(s.TEXTURE_2D,ue.__webglTexture),F(s.TEXTURE_2D,Se),B(X.__webglFramebuffer,C,Se,s.COLOR_ATTACHMENT0+le,s.TEXTURE_2D,0),p(Se)&&m(s.TEXTURE_2D)}t.unbindTexture()}else{let le=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(le=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(le,Z.__webglTexture),F(le,S),S.mipmaps&&S.mipmaps.length>0)for(let ce=0;ce<S.mipmaps.length;ce++)B(X.__webglFramebuffer[ce],C,S,s.COLOR_ATTACHMENT0,le,ce);else B(X.__webglFramebuffer,C,S,s.COLOR_ATTACHMENT0,le,0);p(S)&&m(le),t.unbindTexture()}C.depthBuffer&&ae(C)}function D(C){const S=C.textures;for(let X=0,Z=S.length;X<Z;X++){const ie=S[X];if(p(ie)){const Q=C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,Te=n.get(ie).__webglTexture;t.bindTexture(Q,Te),m(Q),t.unbindTexture()}}}const he=[],Pe=[];function Ue(C){if(C.samples>0){if(ye(C)===!1){const S=C.textures,X=C.width,Z=C.height;let ie=s.COLOR_BUFFER_BIT;const Q=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Te=n.get(C),le=S.length>1;if(le)for(let ce=0;ce<S.length;ce++)t.bindFramebuffer(s.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Te.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let ce=0;ce<S.length;ce++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ie|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ie|=s.STENCIL_BUFFER_BIT)),le){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Te.__webglColorRenderbuffer[ce]);const Se=n.get(S[ce]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Se,0)}s.blitFramebuffer(0,0,X,Z,0,0,X,Z,ie,s.NEAREST),l===!0&&(he.length=0,Pe.length=0,he.push(s.COLOR_ATTACHMENT0+ce),C.depthBuffer&&C.resolveDepthBuffer===!1&&(he.push(Q),Pe.push(Q),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Pe)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,he))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),le)for(let ce=0;ce<S.length;ce++){t.bindFramebuffer(s.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.RENDERBUFFER,Te.__webglColorRenderbuffer[ce]);const Se=n.get(S[ce]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Te.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.TEXTURE_2D,Se,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const S=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[S])}}}function fe(C){return Math.min(i.maxSamples,C.samples)}function ye(C){const S=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Me(C){const S=o.render.frame;h.get(C)!==S&&(h.set(C,S),C.update())}function de(C,S){const X=C.colorSpace,Z=C.format,ie=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||X!==Bn&&X!==Dn&&(nt.getTransfer(X)===ot?(Z!==an||ie!==On)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),S}function Ce(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=P,this.resetTextureUnits=L,this.setTexture2D=N,this.setTexture2DArray=W,this.setTexture3D=k,this.setTextureCube=se,this.rebindTextures=pe,this.setupRenderTarget=ve,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=Ue,this.setupDepthRenderbuffer=ae,this.setupFrameBufferTexture=B,this.useMultisampledRTT=ye}function p_(s,e){function t(n,i=Dn){let r;const o=nt.getTransfer(i);if(n===On)return s.UNSIGNED_BYTE;if(n===Fc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Nc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===ed)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Qu)return s.BYTE;if(n===$u)return s.SHORT;if(n===us)return s.UNSIGNED_SHORT;if(n===Ic)return s.INT;if(n===Di)return s.UNSIGNED_INT;if(n===vn)return s.FLOAT;if(n===Fn)return s.HALF_FLOAT;if(n===td)return s.ALPHA;if(n===nd)return s.RGB;if(n===an)return s.RGBA;if(n===id)return s.LUMINANCE;if(n===rd)return s.LUMINANCE_ALPHA;if(n===Ri)return s.DEPTH_COMPONENT;if(n===Fi)return s.DEPTH_STENCIL;if(n===Oc)return s.RED;if(n===Bc)return s.RED_INTEGER;if(n===sd)return s.RG;if(n===kc)return s.RG_INTEGER;if(n===zc)return s.RGBA_INTEGER;if(n===ks||n===zs||n===Gs||n===Hs)if(o===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ks)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===zs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Gs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Hs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ks)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===zs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Gs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Hs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ta||n===wa||n===Aa||n===Ca)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ta)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===wa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Aa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ca)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ra||n===Pa||n===Ua)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ra||n===Pa)return o===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ua)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===La||n===Da||n===Ia||n===Fa||n===Na||n===Oa||n===Ba||n===ka||n===za||n===Ga||n===Ha||n===Va||n===Wa||n===Xa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===La)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Da)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ia)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Fa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Na)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Oa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ba)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ka)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===za)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ga)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ha)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Va)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Wa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Xa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Vs||n===Ya||n===ja)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Vs)return o===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ya)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ja)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===od||n===qa||n===Ka||n===Za)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Vs)return r.COMPRESSED_RED_RGTC1_EXT;if(n===qa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ka)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Za)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ii?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}class m_ extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class qr extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const g_={type:"move"};class go{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),m=this._getHandJoint(c,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(g_)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new qr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const __=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,v_=`
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

}`;class x_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Tt,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new It({vertexShader:__,fragmentShader:v_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Rt(new ri(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class y_ extends ni{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null;const _=new x_,p=t.getContextAttributes();let m=null,M=null;const x=[],E=[],R=new Oe;let w=null;const T=new jt;T.layers.enable(1),T.viewport=new ht;const U=new jt;U.layers.enable(2),U.viewport=new ht;const y=[T,U],v=new m_;v.layers.enable(1),v.layers.enable(2);let L=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let B=x[O];return B===void 0&&(B=new go,x[O]=B),B.getTargetRaySpace()},this.getControllerGrip=function(O){let B=x[O];return B===void 0&&(B=new go,x[O]=B),B.getGripSpace()},this.getHand=function(O){let B=x[O];return B===void 0&&(B=new go,x[O]=B),B.getHandSpace()};function I(O){const B=E.indexOf(O.inputSource);if(B===-1)return;const te=x[B];te!==void 0&&(te.update(O.inputSource,O.frame,c||o),te.dispatchEvent({type:O.type,data:O.inputSource}))}function N(){i.removeEventListener("select",I),i.removeEventListener("selectstart",I),i.removeEventListener("selectend",I),i.removeEventListener("squeeze",I),i.removeEventListener("squeezestart",I),i.removeEventListener("squeezeend",I),i.removeEventListener("end",N),i.removeEventListener("inputsourceschange",W);for(let O=0;O<x.length;O++){const B=E[O];B!==null&&(E[O]=null,x[O].disconnect(B))}L=null,P=null,_.reset(),e.setRenderTarget(m),f=null,u=null,d=null,i=null,M=null,ne.stop(),n.isPresenting=!1,e.setPixelRatio(w),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){r=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){a=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(O){c=O},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(O){if(i=O,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",I),i.addEventListener("selectstart",I),i.addEventListener("selectend",I),i.addEventListener("squeeze",I),i.addEventListener("squeezestart",I),i.addEventListener("squeezeend",I),i.addEventListener("end",N),i.addEventListener("inputsourceschange",W),p.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(R),i.renderState.layers===void 0){const B={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,B),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new en(f.framebufferWidth,f.framebufferHeight,{format:an,type:On,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let B=null,te=null,G=null;p.depth&&(G=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,B=p.stencil?Fi:Ri,te=p.stencil?Ii:Di);const ae={colorFormat:t.RGBA8,depthFormat:G,scaleFactor:r};d=new XRWebGLBinding(i,t),u=d.createProjectionLayer(ae),i.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),M=new en(u.textureWidth,u.textureHeight,{format:an,type:On,depthTexture:new th(u.textureWidth,u.textureHeight,te,void 0,void 0,void 0,void 0,void 0,void 0,B),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),ne.setContext(i),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function W(O){for(let B=0;B<O.removed.length;B++){const te=O.removed[B],G=E.indexOf(te);G>=0&&(E[G]=null,x[G].disconnect(te))}for(let B=0;B<O.added.length;B++){const te=O.added[B];let G=E.indexOf(te);if(G===-1){for(let pe=0;pe<x.length;pe++)if(pe>=E.length){E.push(te),G=pe;break}else if(E[pe]===null){E[pe]=te,G=pe;break}if(G===-1)break}const ae=x[G];ae&&ae.connect(te)}}const k=new V,se=new V;function j(O,B,te){k.setFromMatrixPosition(B.matrixWorld),se.setFromMatrixPosition(te.matrixWorld);const G=k.distanceTo(se),ae=B.projectionMatrix.elements,pe=te.projectionMatrix.elements,ve=ae[14]/(ae[10]-1),D=ae[14]/(ae[10]+1),he=(ae[9]+1)/ae[5],Pe=(ae[9]-1)/ae[5],Ue=(ae[8]-1)/ae[0],fe=(pe[8]+1)/pe[0],ye=ve*Ue,Me=ve*fe,de=G/(-Ue+fe),Ce=de*-Ue;B.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(Ce),O.translateZ(de),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert();const C=ve+de,S=D+de,X=ye-Ce,Z=Me+(G-Ce),ie=he*D/S*C,Q=Pe*D/S*C;O.projectionMatrix.makePerspective(X,Z,ie,Q,C,S),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}function K(O,B){B===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(B.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(i===null)return;_.texture!==null&&(O.near=_.depthNear,O.far=_.depthFar),v.near=U.near=T.near=O.near,v.far=U.far=T.far=O.far,(L!==v.near||P!==v.far)&&(i.updateRenderState({depthNear:v.near,depthFar:v.far}),L=v.near,P=v.far,T.near=L,T.far=P,U.near=L,U.far=P,T.updateProjectionMatrix(),U.updateProjectionMatrix(),O.updateProjectionMatrix());const B=O.parent,te=v.cameras;K(v,B);for(let G=0;G<te.length;G++)K(te[G],B);te.length===2?j(v,T,U):v.projectionMatrix.copy(T.projectionMatrix),q(O,v,B)};function q(O,B,te){te===null?O.matrix.copy(B.matrixWorld):(O.matrix.copy(te.matrixWorld),O.matrix.invert(),O.matrix.multiply(B.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy(B.projectionMatrix),O.projectionMatrixInverse.copy(B.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=Lo*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(O){l=O,u!==null&&(u.fixedFoveation=O),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=O)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(v)};let F=null;function H(O,B){if(h=B.getViewerPose(c||o),g=B,h!==null){const te=h.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let G=!1;te.length!==v.cameras.length&&(v.cameras.length=0,G=!0);for(let pe=0;pe<te.length;pe++){const ve=te[pe];let D=null;if(f!==null)D=f.getViewport(ve);else{const Pe=d.getViewSubImage(u,ve);D=Pe.viewport,pe===0&&(e.setRenderTargetTextures(M,Pe.colorTexture,u.ignoreDepthValues?void 0:Pe.depthStencilTexture),e.setRenderTarget(M))}let he=y[pe];he===void 0&&(he=new jt,he.layers.enable(pe),he.viewport=new ht,y[pe]=he),he.matrix.fromArray(ve.transform.matrix),he.matrix.decompose(he.position,he.quaternion,he.scale),he.projectionMatrix.fromArray(ve.projectionMatrix),he.projectionMatrixInverse.copy(he.projectionMatrix).invert(),he.viewport.set(D.x,D.y,D.width,D.height),pe===0&&(v.matrix.copy(he.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),G===!0&&v.cameras.push(he)}const ae=i.enabledFeatures;if(ae&&ae.includes("depth-sensing")){const pe=d.getDepthInformation(te[0]);pe&&pe.isValid&&pe.texture&&_.init(e,pe,i.renderState)}}for(let te=0;te<x.length;te++){const G=E[te],ae=x[te];G!==null&&ae!==void 0&&ae.update(G,B,c||o)}F&&F(O,B),B.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:B}),g=null}const ne=new eh;ne.setAnimationLoop(H),this.setAnimationLoop=function(O){F=O},this.dispose=function(){}}}const Yn=new ln,S_=new it;function M_(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Jc(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,M,x,E){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(p,m):m.isMeshToonMaterial?(r(p,m),d(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m)):m.isMeshStandardMaterial?(r(p,m),u(p,m),m.isMeshPhysicalMaterial&&f(p,m,E)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),_(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,M,x):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Ft&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Ft&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const M=e.get(m),x=M.envMap,E=M.envMapRotation;x&&(p.envMap.value=x,Yn.copy(E),Yn.x*=-1,Yn.y*=-1,Yn.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Yn.y*=-1,Yn.z*=-1),p.envMapRotation.value.setFromMatrix4(S_.makeRotationFromEuler(Yn)),p.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,M,x){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*M,p.scale.value=x*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,M){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Ft&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){const M=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function b_(s,e,t,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,x){const E=x.program;n.uniformBlockBinding(M,E)}function c(M,x){let E=i[M.id];E===void 0&&(g(M),E=h(M),i[M.id]=E,M.addEventListener("dispose",p));const R=x.program;n.updateUBOMapping(M,R);const w=e.render.frame;r[M.id]!==w&&(u(M),r[M.id]=w)}function h(M){const x=d();M.__bindingPointIndex=x;const E=s.createBuffer(),R=M.__size,w=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,R,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,x,E),E}function d(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const x=i[M.id],E=M.uniforms,R=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,x);for(let w=0,T=E.length;w<T;w++){const U=Array.isArray(E[w])?E[w]:[E[w]];for(let y=0,v=U.length;y<v;y++){const L=U[y];if(f(L,w,y,R)===!0){const P=L.__offset,I=Array.isArray(L.value)?L.value:[L.value];let N=0;for(let W=0;W<I.length;W++){const k=I[W],se=_(k);typeof k=="number"||typeof k=="boolean"?(L.__data[0]=k,s.bufferSubData(s.UNIFORM_BUFFER,P+N,L.__data)):k.isMatrix3?(L.__data[0]=k.elements[0],L.__data[1]=k.elements[1],L.__data[2]=k.elements[2],L.__data[3]=0,L.__data[4]=k.elements[3],L.__data[5]=k.elements[4],L.__data[6]=k.elements[5],L.__data[7]=0,L.__data[8]=k.elements[6],L.__data[9]=k.elements[7],L.__data[10]=k.elements[8],L.__data[11]=0):(k.toArray(L.__data,N),N+=se.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,P,L.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,x,E,R){const w=M.value,T=x+"_"+E;if(R[T]===void 0)return typeof w=="number"||typeof w=="boolean"?R[T]=w:R[T]=w.clone(),!0;{const U=R[T];if(typeof w=="number"||typeof w=="boolean"){if(U!==w)return R[T]=w,!0}else if(U.equals(w)===!1)return U.copy(w),!0}return!1}function g(M){const x=M.uniforms;let E=0;const R=16;for(let T=0,U=x.length;T<U;T++){const y=Array.isArray(x[T])?x[T]:[x[T]];for(let v=0,L=y.length;v<L;v++){const P=y[v],I=Array.isArray(P.value)?P.value:[P.value];for(let N=0,W=I.length;N<W;N++){const k=I[N],se=_(k),j=E%R;j!==0&&R-j<se.boundary&&(E+=R-j),P.__data=new Float32Array(se.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=E,E+=se.storage}}}const w=E%R;return w>0&&(E+=R-w),M.__size=E,M.__cache={},this}function _(M){const x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function p(M){const x=M.target;x.removeEventListener("dispose",p);const E=o.indexOf(x.__bindingPointIndex);o.splice(E,1),s.deleteBuffer(i[x.id]),delete i[x.id],delete r[x.id]}function m(){for(const M in i)s.deleteBuffer(i[M]);o=[],i={},r={}}return{bind:l,update:c,dispose:m}}class E_{constructor(e={}){const{canvas:t=vd(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=o;const f=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const m=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=nn,this.toneMapping=In,this.toneMappingExposure=1;const x=this;let E=!1,R=0,w=0,T=null,U=-1,y=null;const v=new ht,L=new ht;let P=null;const I=new Ve(0);let N=0,W=t.width,k=t.height,se=1,j=null,K=null;const q=new ht(0,0,W,k),F=new ht(0,0,W,k);let H=!1;const ne=new jo;let O=!1,B=!1;const te=new it,G=new V,ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pe=!1;function ve(){return T===null?se:1}let D=n;function he(A,Y){return t.getContext(A,Y)}try{const A={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Wo}`),t.addEventListener("webglcontextlost",$,!1),t.addEventListener("webglcontextrestored",z,!1),t.addEventListener("webglcontextcreationerror",ee,!1),D===null){const Y="webgl2";if(D=he(Y,A),D===null)throw he(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Pe,Ue,fe,ye,Me,de,Ce,C,S,X,Z,ie,Q,Te,le,ce,Se,ue,be,Be,we,me,xe,Ne;function We(){Pe=new Im(D),Pe.init(),me=new p_(D,Pe),Ue=new Cm(D,Pe,e,me),fe=new d_(D),ye=new Om(D),Me=new e_,de=new f_(D,Pe,fe,Me,Ue,me,ye),Ce=new Pm(x),C=new Dm(x),S=new Vd(D),xe=new wm(D,S),X=new Fm(D,S,ye,xe),Z=new km(D,X,S,ye),be=new Bm(D,Ue,de),ce=new Rm(Me),ie=new $g(x,Ce,C,Pe,Ue,xe,ce),Q=new M_(x,Me),Te=new n_,le=new l_(Pe),ue=new Tm(x,Ce,C,fe,Z,u,l),Se=new u_(x,Z,Ue),Ne=new b_(D,ye,Ue,fe),Be=new Am(D,Pe,ye),we=new Nm(D,Pe,ye),ye.programs=ie.programs,x.capabilities=Ue,x.extensions=Pe,x.properties=Me,x.renderLists=Te,x.shadowMap=Se,x.state=fe,x.info=ye}We();const b=new y_(x,D);this.xr=b,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const A=Pe.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Pe.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(A){A!==void 0&&(se=A,this.setSize(W,k,!1))},this.getSize=function(A){return A.set(W,k)},this.setSize=function(A,Y,re=!0){if(b.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=A,k=Y,t.width=Math.floor(A*se),t.height=Math.floor(Y*se),re===!0&&(t.style.width=A+"px",t.style.height=Y+"px"),this.setViewport(0,0,A,Y)},this.getDrawingBufferSize=function(A){return A.set(W*se,k*se).floor()},this.setDrawingBufferSize=function(A,Y,re){W=A,k=Y,se=re,t.width=Math.floor(A*re),t.height=Math.floor(Y*re),this.setViewport(0,0,A,Y)},this.getCurrentViewport=function(A){return A.copy(v)},this.getViewport=function(A){return A.copy(q)},this.setViewport=function(A,Y,re,oe){A.isVector4?q.set(A.x,A.y,A.z,A.w):q.set(A,Y,re,oe),fe.viewport(v.copy(q).multiplyScalar(se).round())},this.getScissor=function(A){return A.copy(F)},this.setScissor=function(A,Y,re,oe){A.isVector4?F.set(A.x,A.y,A.z,A.w):F.set(A,Y,re,oe),fe.scissor(L.copy(F).multiplyScalar(se).round())},this.getScissorTest=function(){return H},this.setScissorTest=function(A){fe.setScissorTest(H=A)},this.setOpaqueSort=function(A){j=A},this.setTransparentSort=function(A){K=A},this.getClearColor=function(A){return A.copy(ue.getClearColor())},this.setClearColor=function(){ue.setClearColor.apply(ue,arguments)},this.getClearAlpha=function(){return ue.getClearAlpha()},this.setClearAlpha=function(){ue.setClearAlpha.apply(ue,arguments)},this.clear=function(A=!0,Y=!0,re=!0){let oe=0;if(A){let J=!1;if(T!==null){const Ee=T.texture.format;J=Ee===zc||Ee===kc||Ee===Bc}if(J){const Ee=T.texture.type,Ie=Ee===On||Ee===Di||Ee===us||Ee===Ii||Ee===Fc||Ee===Nc,Fe=ue.getClearColor(),ke=ue.getClearAlpha(),_e=Fe.r,Ge=Fe.g,He=Fe.b;Ie?(f[0]=_e,f[1]=Ge,f[2]=He,f[3]=ke,D.clearBufferuiv(D.COLOR,0,f)):(g[0]=_e,g[1]=Ge,g[2]=He,g[3]=ke,D.clearBufferiv(D.COLOR,0,g))}else oe|=D.COLOR_BUFFER_BIT}Y&&(oe|=D.DEPTH_BUFFER_BIT),re&&(oe|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(oe)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",$,!1),t.removeEventListener("webglcontextrestored",z,!1),t.removeEventListener("webglcontextcreationerror",ee,!1),Te.dispose(),le.dispose(),Me.dispose(),Ce.dispose(),C.dispose(),Z.dispose(),xe.dispose(),Ne.dispose(),ie.dispose(),b.dispose(),b.removeEventListener("sessionstart",Ye),b.removeEventListener("sessionend",Je),tt.stop()};function $(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function z(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const A=ye.autoReset,Y=Se.enabled,re=Se.autoUpdate,oe=Se.needsUpdate,J=Se.type;We(),ye.autoReset=A,Se.enabled=Y,Se.autoUpdate=re,Se.needsUpdate=oe,Se.type=J}function ee(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ge(A){const Y=A.target;Y.removeEventListener("dispose",ge),Ae(Y)}function Ae(A){Re(A),Me.remove(A)}function Re(A){const Y=Me.get(A).programs;Y!==void 0&&(Y.forEach(function(re){ie.releaseProgram(re)}),A.isShaderMaterial&&ie.releaseShaderCache(A))}this.renderBufferDirect=function(A,Y,re,oe,J,Ee){Y===null&&(Y=ae);const Ie=J.isMesh&&J.matrixWorld.determinant()<0,Fe=cn(A,Y,re,oe,J);fe.setMaterial(oe,Ie);let ke=re.index,_e=1;if(oe.wireframe===!0){if(ke=X.getWireframeAttribute(re),ke===void 0)return;_e=2}const Ge=re.drawRange,He=re.attributes.position;let Ze=Ge.start*_e,rt=(Ge.start+Ge.count)*_e;Ee!==null&&(Ze=Math.max(Ze,Ee.start*_e),rt=Math.min(rt,(Ee.start+Ee.count)*_e)),ke!==null?(Ze=Math.max(Ze,0),rt=Math.min(rt,ke.count)):He!=null&&(Ze=Math.max(Ze,0),rt=Math.min(rt,He.count));const st=rt-Ze;if(st<0||st===1/0)return;xe.setup(J,oe,Fe,re,ke);let _t,Qe=Be;if(ke!==null&&(_t=S.get(ke),Qe=we,Qe.setIndex(_t)),J.isMesh)oe.wireframe===!0?(fe.setLineWidth(oe.wireframeLinewidth*ve()),Qe.setMode(D.LINES)):Qe.setMode(D.TRIANGLES);else if(J.isLine){let ze=oe.linewidth;ze===void 0&&(ze=1),fe.setLineWidth(ze*ve()),J.isLineSegments?Qe.setMode(D.LINES):J.isLineLoop?Qe.setMode(D.LINE_LOOP):Qe.setMode(D.LINE_STRIP)}else J.isPoints?Qe.setMode(D.POINTS):J.isSprite&&Qe.setMode(D.TRIANGLES);if(J.isBatchedMesh)J._multiDrawInstances!==null?Qe.renderMultiDrawInstances(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount,J._multiDrawInstances):Qe.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else if(J.isInstancedMesh)Qe.renderInstances(Ze,st,J.count);else if(re.isInstancedBufferGeometry){const ze=re._maxInstanceCount!==void 0?re._maxInstanceCount:1/0,pt=Math.min(re.instanceCount,ze);Qe.renderInstances(Ze,st,pt)}else Qe.render(Ze,st)};function je(A,Y,re){A.transparent===!0&&A.side===sn&&A.forceSinglePass===!1?(A.side=Ft,A.needsUpdate=!0,Ht(A,Y,re),A.side=Nn,A.needsUpdate=!0,Ht(A,Y,re),A.side=sn):Ht(A,Y,re)}this.compile=function(A,Y,re=null){re===null&&(re=A),p=le.get(re),p.init(Y),M.push(p),re.traverseVisible(function(J){J.isLight&&J.layers.test(Y.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),A!==re&&A.traverseVisible(function(J){J.isLight&&J.layers.test(Y.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),p.setupLights();const oe=new Set;return A.traverse(function(J){const Ee=J.material;if(Ee)if(Array.isArray(Ee))for(let Ie=0;Ie<Ee.length;Ie++){const Fe=Ee[Ie];je(Fe,re,J),oe.add(Fe)}else je(Ee,re,J),oe.add(Ee)}),M.pop(),p=null,oe},this.compileAsync=function(A,Y,re=null){const oe=this.compile(A,Y,re);return new Promise(J=>{function Ee(){if(oe.forEach(function(Ie){Me.get(Ie).currentProgram.isReady()&&oe.delete(Ie)}),oe.size===0){J(A);return}setTimeout(Ee,10)}Pe.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let Xe=null;function De(A){Xe&&Xe(A)}function Ye(){tt.stop()}function Je(){tt.start()}const tt=new eh;tt.setAnimationLoop(De),typeof self<"u"&&tt.setContext(self),this.setAnimationLoop=function(A){Xe=A,b.setAnimationLoop(A),A===null?tt.stop():tt.start()},b.addEventListener("sessionstart",Ye),b.addEventListener("sessionend",Je),this.render=function(A,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),b.enabled===!0&&b.isPresenting===!0&&(b.cameraAutoUpdate===!0&&b.updateCamera(Y),Y=b.getCamera()),A.isScene===!0&&A.onBeforeRender(x,A,Y,T),p=le.get(A,M.length),p.init(Y),M.push(p),te.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),ne.setFromProjectionMatrix(te),B=this.localClippingEnabled,O=ce.init(this.clippingPlanes,B),_=Te.get(A,m.length),_.init(),m.push(_),b.enabled===!0&&b.isPresenting===!0){const Ee=x.xr.getDepthSensingMesh();Ee!==null&&$e(Ee,Y,-1/0,x.sortObjects)}$e(A,Y,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(j,K),pe=b.enabled===!1||b.isPresenting===!1||b.hasDepthSensing()===!1,pe&&ue.addToRenderList(_,A),this.info.render.frame++,O===!0&&ce.beginShadows();const re=p.state.shadowsArray;Se.render(re,A,Y),O===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const oe=_.opaque,J=_.transmissive;if(p.setupLights(),Y.isArrayCamera){const Ee=Y.cameras;if(J.length>0)for(let Ie=0,Fe=Ee.length;Ie<Fe;Ie++){const ke=Ee[Ie];St(oe,J,A,ke)}pe&&ue.render(A);for(let Ie=0,Fe=Ee.length;Ie<Fe;Ie++){const ke=Ee[Ie];lt(_,A,ke,ke.viewport)}}else J.length>0&&St(oe,J,A,Y),pe&&ue.render(A),lt(_,A,Y);T!==null&&(de.updateMultisampleRenderTarget(T),de.updateRenderTargetMipmap(T)),A.isScene===!0&&A.onAfterRender(x,A,Y),xe.resetDefaultState(),U=-1,y=null,M.pop(),M.length>0?(p=M[M.length-1],O===!0&&ce.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,m.pop(),m.length>0?_=m[m.length-1]:_=null};function $e(A,Y,re,oe){if(A.visible===!1)return;if(A.layers.test(Y.layers)){if(A.isGroup)re=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(Y);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||ne.intersectsSprite(A)){oe&&G.setFromMatrixPosition(A.matrixWorld).applyMatrix4(te);const Ie=Z.update(A),Fe=A.material;Fe.visible&&_.push(A,Ie,Fe,re,G.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||ne.intersectsObject(A))){const Ie=Z.update(A),Fe=A.material;if(oe&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),G.copy(A.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),G.copy(Ie.boundingSphere.center)),G.applyMatrix4(A.matrixWorld).applyMatrix4(te)),Array.isArray(Fe)){const ke=Ie.groups;for(let _e=0,Ge=ke.length;_e<Ge;_e++){const He=ke[_e],Ze=Fe[He.materialIndex];Ze&&Ze.visible&&_.push(A,Ie,Ze,re,G.z,He)}}else Fe.visible&&_.push(A,Ie,Fe,re,G.z,null)}}const Ee=A.children;for(let Ie=0,Fe=Ee.length;Ie<Fe;Ie++)$e(Ee[Ie],Y,re,oe)}function lt(A,Y,re,oe){const J=A.opaque,Ee=A.transmissive,Ie=A.transparent;p.setupLightsView(re),O===!0&&ce.setGlobalState(x.clippingPlanes,re),oe&&fe.viewport(v.copy(oe)),J.length>0&&gt(J,Y,re),Ee.length>0&&gt(Ee,Y,re),Ie.length>0&&gt(Ie,Y,re),fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1)}function St(A,Y,re,oe){if((re.isScene===!0?re.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[oe.id]===void 0&&(p.state.transmissionRenderTarget[oe.id]=new en(1,1,{generateMipmaps:!0,type:Pe.has("EXT_color_buffer_half_float")||Pe.has("EXT_color_buffer_float")?Fn:On,minFilter:$n,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace}));const Ee=p.state.transmissionRenderTarget[oe.id],Ie=oe.viewport||v;Ee.setSize(Ie.z,Ie.w);const Fe=x.getRenderTarget();x.setRenderTarget(Ee),x.getClearColor(I),N=x.getClearAlpha(),N<1&&x.setClearColor(16777215,.5),pe?ue.render(re):x.clear();const ke=x.toneMapping;x.toneMapping=In;const _e=oe.viewport;if(oe.viewport!==void 0&&(oe.viewport=void 0),p.setupLightsView(oe),O===!0&&ce.setGlobalState(x.clippingPlanes,oe),gt(A,re,oe),de.updateMultisampleRenderTarget(Ee),de.updateRenderTargetMipmap(Ee),Pe.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let He=0,Ze=Y.length;He<Ze;He++){const rt=Y[He],st=rt.object,_t=rt.geometry,Qe=rt.material,ze=rt.group;if(Qe.side===sn&&st.layers.test(oe.layers)){const pt=Qe.side;Qe.side=Ft,Qe.needsUpdate=!0,qt(st,re,oe,_t,Qe,ze),Qe.side=pt,Qe.needsUpdate=!0,Ge=!0}}Ge===!0&&(de.updateMultisampleRenderTarget(Ee),de.updateRenderTargetMipmap(Ee))}x.setRenderTarget(Fe),x.setClearColor(I,N),_e!==void 0&&(oe.viewport=_e),x.toneMapping=ke}function gt(A,Y,re){const oe=Y.isScene===!0?Y.overrideMaterial:null;for(let J=0,Ee=A.length;J<Ee;J++){const Ie=A[J],Fe=Ie.object,ke=Ie.geometry,_e=oe===null?Ie.material:oe,Ge=Ie.group;Fe.layers.test(re.layers)&&qt(Fe,Y,re,ke,_e,Ge)}}function qt(A,Y,re,oe,J,Ee){A.onBeforeRender(x,Y,re,oe,J,Ee),A.modelViewMatrix.multiplyMatrices(re.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),J.onBeforeRender(x,Y,re,oe,A,Ee),J.transparent===!0&&J.side===sn&&J.forceSinglePass===!1?(J.side=Ft,J.needsUpdate=!0,x.renderBufferDirect(re,Y,oe,J,A,Ee),J.side=Nn,J.needsUpdate=!0,x.renderBufferDirect(re,Y,oe,J,A,Ee),J.side=sn):x.renderBufferDirect(re,Y,oe,J,A,Ee),A.onAfterRender(x,Y,re,oe,J,Ee)}function Ht(A,Y,re){Y.isScene!==!0&&(Y=ae);const oe=Me.get(A),J=p.state.lights,Ee=p.state.shadowsArray,Ie=J.state.version,Fe=ie.getParameters(A,J.state,Ee,Y,re),ke=ie.getProgramCacheKey(Fe);let _e=oe.programs;oe.environment=A.isMeshStandardMaterial?Y.environment:null,oe.fog=Y.fog,oe.envMap=(A.isMeshStandardMaterial?C:Ce).get(A.envMap||oe.environment),oe.envMapRotation=oe.environment!==null&&A.envMap===null?Y.environmentRotation:A.envMapRotation,_e===void 0&&(A.addEventListener("dispose",ge),_e=new Map,oe.programs=_e);let Ge=_e.get(ke);if(Ge!==void 0){if(oe.currentProgram===Ge&&oe.lightsStateVersion===Ie)return ft(A,Fe),Ge}else Fe.uniforms=ie.getUniforms(A),A.onBuild(re,Fe,x),A.onBeforeCompile(Fe,x),Ge=ie.acquireProgram(Fe,ke),_e.set(ke,Ge),oe.uniforms=Fe.uniforms;const He=oe.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(He.clippingPlanes=ce.uniform),ft(A,Fe),oe.needsLights=Hi(A),oe.lightsStateVersion=Ie,oe.needsLights&&(He.ambientLightColor.value=J.state.ambient,He.lightProbe.value=J.state.probe,He.directionalLights.value=J.state.directional,He.directionalLightShadows.value=J.state.directionalShadow,He.spotLights.value=J.state.spot,He.spotLightShadows.value=J.state.spotShadow,He.rectAreaLights.value=J.state.rectArea,He.ltc_1.value=J.state.rectAreaLTC1,He.ltc_2.value=J.state.rectAreaLTC2,He.pointLights.value=J.state.point,He.pointLightShadows.value=J.state.pointShadow,He.hemisphereLights.value=J.state.hemi,He.directionalShadowMap.value=J.state.directionalShadowMap,He.directionalShadowMatrix.value=J.state.directionalShadowMatrix,He.spotShadowMap.value=J.state.spotShadowMap,He.spotLightMatrix.value=J.state.spotLightMatrix,He.spotLightMap.value=J.state.spotLightMap,He.pointShadowMap.value=J.state.pointShadowMap,He.pointShadowMatrix.value=J.state.pointShadowMatrix),oe.currentProgram=Ge,oe.uniformsList=null,Ge}function Vt(A){if(A.uniformsList===null){const Y=A.currentProgram.getUniforms();A.uniformsList=ss.seqWithValue(Y.seq,A.uniforms)}return A.uniformsList}function ft(A,Y){const re=Me.get(A);re.outputColorSpace=Y.outputColorSpace,re.batching=Y.batching,re.batchingColor=Y.batchingColor,re.instancing=Y.instancing,re.instancingColor=Y.instancingColor,re.instancingMorph=Y.instancingMorph,re.skinning=Y.skinning,re.morphTargets=Y.morphTargets,re.morphNormals=Y.morphNormals,re.morphColors=Y.morphColors,re.morphTargetsCount=Y.morphTargetsCount,re.numClippingPlanes=Y.numClippingPlanes,re.numIntersection=Y.numClipIntersection,re.vertexAlphas=Y.vertexAlphas,re.vertexTangents=Y.vertexTangents,re.toneMapping=Y.toneMapping}function cn(A,Y,re,oe,J){Y.isScene!==!0&&(Y=ae),de.resetTextureUnits();const Ee=Y.fog,Ie=oe.isMeshStandardMaterial?Y.environment:null,Fe=T===null?x.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Bn,ke=(oe.isMeshStandardMaterial?C:Ce).get(oe.envMap||Ie),_e=oe.vertexColors===!0&&!!re.attributes.color&&re.attributes.color.itemSize===4,Ge=!!re.attributes.tangent&&(!!oe.normalMap||oe.anisotropy>0),He=!!re.morphAttributes.position,Ze=!!re.morphAttributes.normal,rt=!!re.morphAttributes.color;let st=In;oe.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(st=x.toneMapping);const _t=re.morphAttributes.position||re.morphAttributes.normal||re.morphAttributes.color,Qe=_t!==void 0?_t.length:0,ze=Me.get(oe),pt=p.state.lights;if(O===!0&&(B===!0||A!==y)){const Mt=A===y&&oe.id===U;ce.setState(oe,A,Mt)}let et=!1;oe.version===ze.__version?(ze.needsLights&&ze.lightsStateVersion!==pt.state.version||ze.outputColorSpace!==Fe||J.isBatchedMesh&&ze.batching===!1||!J.isBatchedMesh&&ze.batching===!0||J.isBatchedMesh&&ze.batchingColor===!0&&J.colorTexture===null||J.isBatchedMesh&&ze.batchingColor===!1&&J.colorTexture!==null||J.isInstancedMesh&&ze.instancing===!1||!J.isInstancedMesh&&ze.instancing===!0||J.isSkinnedMesh&&ze.skinning===!1||!J.isSkinnedMesh&&ze.skinning===!0||J.isInstancedMesh&&ze.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&ze.instancingColor===!1&&J.instanceColor!==null||J.isInstancedMesh&&ze.instancingMorph===!0&&J.morphTexture===null||J.isInstancedMesh&&ze.instancingMorph===!1&&J.morphTexture!==null||ze.envMap!==ke||oe.fog===!0&&ze.fog!==Ee||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==ce.numPlanes||ze.numIntersection!==ce.numIntersection)||ze.vertexAlphas!==_e||ze.vertexTangents!==Ge||ze.morphTargets!==He||ze.morphNormals!==Ze||ze.morphColors!==rt||ze.toneMapping!==st||ze.morphTargetsCount!==Qe)&&(et=!0):(et=!0,ze.__version=oe.version);let Wt=ze.currentProgram;et===!0&&(Wt=Ht(oe,Y,J));let Mn=!1,tn=!1,hn=!1;const at=Wt.getUniforms(),wt=ze.uniforms;if(fe.useProgram(Wt.program)&&(Mn=!0,tn=!0,hn=!0),oe.id!==U&&(U=oe.id,tn=!0),Mn||y!==A){at.setValue(D,"projectionMatrix",A.projectionMatrix),at.setValue(D,"viewMatrix",A.matrixWorldInverse);const Mt=at.map.cameraPosition;Mt!==void 0&&Mt.setValue(D,G.setFromMatrixPosition(A.matrixWorld)),Ue.logarithmicDepthBuffer&&at.setValue(D,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(oe.isMeshPhongMaterial||oe.isMeshToonMaterial||oe.isMeshLambertMaterial||oe.isMeshBasicMaterial||oe.isMeshStandardMaterial||oe.isShaderMaterial)&&at.setValue(D,"isOrthographic",A.isOrthographicCamera===!0),y!==A&&(y=A,tn=!0,hn=!0)}if(J.isSkinnedMesh){at.setOptional(D,J,"bindMatrix"),at.setOptional(D,J,"bindMatrixInverse");const Mt=J.skeleton;Mt&&(Mt.boneTexture===null&&Mt.computeBoneTexture(),at.setValue(D,"boneTexture",Mt.boneTexture,de))}J.isBatchedMesh&&(at.setOptional(D,J,"batchingTexture"),at.setValue(D,"batchingTexture",J._matricesTexture,de),at.setOptional(D,J,"batchingColorTexture"),J._colorsTexture!==null&&at.setValue(D,"batchingColorTexture",J._colorsTexture,de));const kn=re.morphAttributes;if((kn.position!==void 0||kn.normal!==void 0||kn.color!==void 0)&&be.update(J,re,Wt),(tn||ze.receiveShadow!==J.receiveShadow)&&(ze.receiveShadow=J.receiveShadow,at.setValue(D,"receiveShadow",J.receiveShadow)),oe.isMeshGouraudMaterial&&oe.envMap!==null&&(wt.envMap.value=ke,wt.flipEnvMap.value=ke.isCubeTexture&&ke.isRenderTargetTexture===!1?-1:1),oe.isMeshStandardMaterial&&oe.envMap===null&&Y.environment!==null&&(wt.envMapIntensity.value=Y.environmentIntensity),tn&&(at.setValue(D,"toneMappingExposure",x.toneMappingExposure),ze.needsLights&&_r(wt,hn),Ee&&oe.fog===!0&&Q.refreshFogUniforms(wt,Ee),Q.refreshMaterialUniforms(wt,oe,se,k,p.state.transmissionRenderTarget[A.id]),ss.upload(D,Vt(ze),wt,de)),oe.isShaderMaterial&&oe.uniformsNeedUpdate===!0&&(ss.upload(D,Vt(ze),wt,de),oe.uniformsNeedUpdate=!1),oe.isSpriteMaterial&&at.setValue(D,"center",J.center),at.setValue(D,"modelViewMatrix",J.modelViewMatrix),at.setValue(D,"normalMatrix",J.normalMatrix),at.setValue(D,"modelMatrix",J.matrixWorld),oe.isShaderMaterial||oe.isRawShaderMaterial){const Mt=oe.uniformsGroups;for(let zn=0,Xt=Mt.length;zn<Xt;zn++){const vr=Mt[zn];Ne.update(vr,Wt),Ne.bind(vr,Wt)}}return Wt}function _r(A,Y){A.ambientLightColor.needsUpdate=Y,A.lightProbe.needsUpdate=Y,A.directionalLights.needsUpdate=Y,A.directionalLightShadows.needsUpdate=Y,A.pointLights.needsUpdate=Y,A.pointLightShadows.needsUpdate=Y,A.spotLights.needsUpdate=Y,A.spotLightShadows.needsUpdate=Y,A.rectAreaLights.needsUpdate=Y,A.hemisphereLights.needsUpdate=Y}function Hi(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(A,Y,re){Me.get(A.texture).__webglTexture=Y,Me.get(A.depthTexture).__webglTexture=re;const oe=Me.get(A);oe.__hasExternalTextures=!0,oe.__autoAllocateDepthBuffer=re===void 0,oe.__autoAllocateDepthBuffer||Pe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),oe.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,Y){const re=Me.get(A);re.__webglFramebuffer=Y,re.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(A,Y=0,re=0){T=A,R=Y,w=re;let oe=!0,J=null,Ee=!1,Ie=!1;if(A){const ke=Me.get(A);ke.__useDefaultFramebuffer!==void 0?(fe.bindFramebuffer(D.FRAMEBUFFER,null),oe=!1):ke.__webglFramebuffer===void 0?de.setupRenderTarget(A):ke.__hasExternalTextures&&de.rebindTextures(A,Me.get(A.texture).__webglTexture,Me.get(A.depthTexture).__webglTexture);const _e=A.texture;(_e.isData3DTexture||_e.isDataArrayTexture||_e.isCompressedArrayTexture)&&(Ie=!0);const Ge=Me.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Ge[Y])?J=Ge[Y][re]:J=Ge[Y],Ee=!0):A.samples>0&&de.useMultisampledRTT(A)===!1?J=Me.get(A).__webglMultisampledFramebuffer:Array.isArray(Ge)?J=Ge[re]:J=Ge,v.copy(A.viewport),L.copy(A.scissor),P=A.scissorTest}else v.copy(q).multiplyScalar(se).floor(),L.copy(F).multiplyScalar(se).floor(),P=H;if(fe.bindFramebuffer(D.FRAMEBUFFER,J)&&oe&&fe.drawBuffers(A,J),fe.viewport(v),fe.scissor(L),fe.setScissorTest(P),Ee){const ke=Me.get(A.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ke.__webglTexture,re)}else if(Ie){const ke=Me.get(A.texture),_e=Y||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,ke.__webglTexture,re||0,_e)}U=-1},this.readRenderTargetPixels=function(A,Y,re,oe,J,Ee,Ie){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Fe=Me.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ie!==void 0&&(Fe=Fe[Ie]),Fe){fe.bindFramebuffer(D.FRAMEBUFFER,Fe);try{const ke=A.texture,_e=ke.format,Ge=ke.type;if(!Ue.textureFormatReadable(_e)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ue.textureTypeReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=A.width-oe&&re>=0&&re<=A.height-J&&D.readPixels(Y,re,oe,J,me.convert(_e),me.convert(Ge),Ee)}finally{const ke=T!==null?Me.get(T).__webglFramebuffer:null;fe.bindFramebuffer(D.FRAMEBUFFER,ke)}}},this.readRenderTargetPixelsAsync=async function(A,Y,re,oe,J,Ee,Ie){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Fe=Me.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ie!==void 0&&(Fe=Fe[Ie]),Fe){fe.bindFramebuffer(D.FRAMEBUFFER,Fe);try{const ke=A.texture,_e=ke.format,Ge=ke.type;if(!Ue.textureFormatReadable(_e))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ue.textureTypeReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Y>=0&&Y<=A.width-oe&&re>=0&&re<=A.height-J){const He=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,He),D.bufferData(D.PIXEL_PACK_BUFFER,Ee.byteLength,D.STREAM_READ),D.readPixels(Y,re,oe,J,me.convert(_e),me.convert(Ge),0),D.flush();const Ze=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);await xd(D,Ze,4);try{D.bindBuffer(D.PIXEL_PACK_BUFFER,He),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,Ee)}finally{D.deleteBuffer(He),D.deleteSync(Ze)}return Ee}}finally{const ke=T!==null?Me.get(T).__webglFramebuffer:null;fe.bindFramebuffer(D.FRAMEBUFFER,ke)}}},this.copyFramebufferToTexture=function(A,Y=null,re=0){A.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Y=arguments[0]||null,A=arguments[1]);const oe=Math.pow(2,-re),J=Math.floor(A.image.width*oe),Ee=Math.floor(A.image.height*oe),Ie=Y!==null?Y.x:0,Fe=Y!==null?Y.y:0;de.setTexture2D(A,0),D.copyTexSubImage2D(D.TEXTURE_2D,re,0,0,Ie,Fe,J,Ee),fe.unbindTexture()},this.copyTextureToTexture=function(A,Y,re=null,oe=null,J=0){A.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),oe=arguments[0]||null,A=arguments[1],Y=arguments[2],J=arguments[3]||0,re=null);let Ee,Ie,Fe,ke,_e,Ge;re!==null?(Ee=re.max.x-re.min.x,Ie=re.max.y-re.min.y,Fe=re.min.x,ke=re.min.y):(Ee=A.image.width,Ie=A.image.height,Fe=0,ke=0),oe!==null?(_e=oe.x,Ge=oe.y):(_e=0,Ge=0);const He=me.convert(Y.format),Ze=me.convert(Y.type);de.setTexture2D(Y,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,Y.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,Y.unpackAlignment);const rt=D.getParameter(D.UNPACK_ROW_LENGTH),st=D.getParameter(D.UNPACK_IMAGE_HEIGHT),_t=D.getParameter(D.UNPACK_SKIP_PIXELS),Qe=D.getParameter(D.UNPACK_SKIP_ROWS),ze=D.getParameter(D.UNPACK_SKIP_IMAGES),pt=A.isCompressedTexture?A.mipmaps[J]:A.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,pt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,pt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Fe),D.pixelStorei(D.UNPACK_SKIP_ROWS,ke),A.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,J,_e,Ge,Ee,Ie,He,Ze,pt.data):A.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,J,_e,Ge,pt.width,pt.height,He,pt.data):D.texSubImage2D(D.TEXTURE_2D,J,_e,Ge,He,Ze,pt),D.pixelStorei(D.UNPACK_ROW_LENGTH,rt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,st),D.pixelStorei(D.UNPACK_SKIP_PIXELS,_t),D.pixelStorei(D.UNPACK_SKIP_ROWS,Qe),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ze),J===0&&Y.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),fe.unbindTexture()},this.copyTextureToTexture3D=function(A,Y,re=null,oe=null,J=0){A.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),re=arguments[0]||null,oe=arguments[1]||null,A=arguments[2],Y=arguments[3],J=arguments[4]||0);let Ee,Ie,Fe,ke,_e,Ge,He,Ze,rt;const st=A.isCompressedTexture?A.mipmaps[J]:A.image;re!==null?(Ee=re.max.x-re.min.x,Ie=re.max.y-re.min.y,Fe=re.max.z-re.min.z,ke=re.min.x,_e=re.min.y,Ge=re.min.z):(Ee=st.width,Ie=st.height,Fe=st.depth,ke=0,_e=0,Ge=0),oe!==null?(He=oe.x,Ze=oe.y,rt=oe.z):(He=0,Ze=0,rt=0);const _t=me.convert(Y.format),Qe=me.convert(Y.type);let ze;if(Y.isData3DTexture)de.setTexture3D(Y,0),ze=D.TEXTURE_3D;else if(Y.isDataArrayTexture||Y.isCompressedArrayTexture)de.setTexture2DArray(Y,0),ze=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,Y.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,Y.unpackAlignment);const pt=D.getParameter(D.UNPACK_ROW_LENGTH),et=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Wt=D.getParameter(D.UNPACK_SKIP_PIXELS),Mn=D.getParameter(D.UNPACK_SKIP_ROWS),tn=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,st.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,st.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,ke),D.pixelStorei(D.UNPACK_SKIP_ROWS,_e),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ge),A.isDataTexture||A.isData3DTexture?D.texSubImage3D(ze,J,He,Ze,rt,Ee,Ie,Fe,_t,Qe,st.data):Y.isCompressedArrayTexture?D.compressedTexSubImage3D(ze,J,He,Ze,rt,Ee,Ie,Fe,_t,st.data):D.texSubImage3D(ze,J,He,Ze,rt,Ee,Ie,Fe,_t,Qe,st),D.pixelStorei(D.UNPACK_ROW_LENGTH,pt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,et),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Wt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Mn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,tn),J===0&&Y.generateMipmaps&&D.generateMipmap(ze),fe.unbindTexture()},this.initRenderTarget=function(A){Me.get(A).__webglFramebuffer===void 0&&de.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?de.setTextureCube(A,0):A.isData3DTexture?de.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?de.setTexture2DArray(A,0):de.setTexture2D(A,0),fe.unbindTexture()},this.resetState=function(){R=0,w=0,T=null,fe.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Xo?"display-p3":"srgb",t.unpackColorSpace=nt.workingColorSpace===ys?"display-p3":"srgb"}}class T_ extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class w_ extends Tt{constructor(e=null,t=1,n=1,i,r,o,a,l,c=Dt,h=Dt,d,u){super(null,o,a,l,c,h,i,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Io extends zt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ei=new it,Gl=new it,Kr=[],Hl=new Sn,A_=new it,nr=new Rt,ir=new ii;class ch extends Rt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Io(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,A_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Sn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ei),Hl.copy(e.boundingBox).applyMatrix4(Ei),this.boundingBox.union(Hl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ii),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ei),ir.copy(e.boundingSphere).applyMatrix4(Ei),this.boundingSphere.union(ir)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(nr.geometry=this.geometry,nr.material=this.material,nr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ir.copy(this.boundingSphere),ir.applyMatrix4(n),e.ray.intersectsSphere(ir)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ei),Gl.multiplyMatrices(n,Ei),nr.matrixWorld=Gl,nr.raycast(e,Kr);for(let o=0,a=Kr.length;o<a;o++){const l=Kr[o];l.instanceId=r,l.object=this,t.push(l)}Kr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Io(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new w_(new Float32Array(i*this.count),i,this.count,Oc,vn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class hh extends Bi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ve(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const _s=new V,vs=new V,Vl=new it,rr=new Ss,Zr=new ii,_o=new V,Wl=new V;class C_ extends xt{constructor(e=new Gt,t=new hh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)_s.fromBufferAttribute(t,i-1),vs.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=_s.distanceTo(vs);e.setAttribute("lineDistance",new yt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Zr.copy(n.boundingSphere),Zr.applyMatrix4(i),Zr.radius+=r,e.ray.intersectsSphere(Zr)===!1)return;Vl.copy(i).invert(),rr.copy(e.ray).applyMatrix4(Vl);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,p=g-1;_<p;_+=c){const m=h.getX(_),M=h.getX(_+1),x=Jr(this,e,rr,l,m,M);x&&t.push(x)}if(this.isLineLoop){const _=h.getX(g-1),p=h.getX(f),m=Jr(this,e,rr,l,_,p);m&&t.push(m)}}else{const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,p=g-1;_<p;_+=c){const m=Jr(this,e,rr,l,_,_+1);m&&t.push(m)}if(this.isLineLoop){const _=Jr(this,e,rr,l,g-1,f);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Jr(s,e,t,n,i,r){const o=s.geometry.attributes.position;if(_s.fromBufferAttribute(o,i),vs.fromBufferAttribute(o,r),t.distanceSqToSegment(_s,vs,_o,Wl)>n)return;_o.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(_o);if(!(l<e.near||l>e.far))return{distance:l,point:Wl.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,object:s}}const Xl=new V,Yl=new V;class R_ extends C_{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Xl.fromBufferAttribute(t,i),Yl.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Xl.distanceTo(Yl);e.setAttribute("lineDistance",new yt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Es extends Gt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new yt(r,3)),this.setAttribute("normal",new yt(r.slice(),3)),this.setAttribute("uv",new yt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(M){const x=new V,E=new V,R=new V;for(let w=0;w<t.length;w+=3)f(t[w+0],x),f(t[w+1],E),f(t[w+2],R),l(x,E,R,M)}function l(M,x,E,R){const w=R+1,T=[];for(let U=0;U<=w;U++){T[U]=[];const y=M.clone().lerp(E,U/w),v=x.clone().lerp(E,U/w),L=w-U;for(let P=0;P<=L;P++)P===0&&U===w?T[U][P]=y:T[U][P]=y.clone().lerp(v,P/L)}for(let U=0;U<w;U++)for(let y=0;y<2*(w-U)-1;y++){const v=Math.floor(y/2);y%2===0?(u(T[U][v+1]),u(T[U+1][v]),u(T[U][v])):(u(T[U][v+1]),u(T[U+1][v+1]),u(T[U+1][v]))}}function c(M){const x=new V;for(let E=0;E<r.length;E+=3)x.x=r[E+0],x.y=r[E+1],x.z=r[E+2],x.normalize().multiplyScalar(M),r[E+0]=x.x,r[E+1]=x.y,r[E+2]=x.z}function h(){const M=new V;for(let x=0;x<r.length;x+=3){M.x=r[x+0],M.y=r[x+1],M.z=r[x+2];const E=p(M)/2/Math.PI+.5,R=m(M)/Math.PI+.5;o.push(E,1-R)}g(),d()}function d(){for(let M=0;M<o.length;M+=6){const x=o[M+0],E=o[M+2],R=o[M+4],w=Math.max(x,E,R),T=Math.min(x,E,R);w>.9&&T<.1&&(x<.2&&(o[M+0]+=1),E<.2&&(o[M+2]+=1),R<.2&&(o[M+4]+=1))}}function u(M){r.push(M.x,M.y,M.z)}function f(M,x){const E=M*3;x.x=e[E+0],x.y=e[E+1],x.z=e[E+2]}function g(){const M=new V,x=new V,E=new V,R=new V,w=new Oe,T=new Oe,U=new Oe;for(let y=0,v=0;y<r.length;y+=9,v+=6){M.set(r[y+0],r[y+1],r[y+2]),x.set(r[y+3],r[y+4],r[y+5]),E.set(r[y+6],r[y+7],r[y+8]),w.set(o[v+0],o[v+1]),T.set(o[v+2],o[v+3]),U.set(o[v+4],o[v+5]),R.copy(M).add(x).add(E).divideScalar(3);const L=p(R);_(w,v+0,M,L),_(T,v+2,x,L),_(U,v+4,E,L)}}function _(M,x,E,R){R<0&&M.x===1&&(o[x]=M.x-1),E.x===0&&E.z===0&&(o[x]=R/2/Math.PI+.5)}function p(M){return Math.atan2(M.z,-M.x)}function m(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Es(e.vertices,e.indices,e.radius,e.details)}}class Ko extends Es{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ko(e.radius,e.detail)}}class Ts extends Gt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new V,u=new V,f=[],g=[],_=[],p=[];for(let m=0;m<=n;m++){const M=[],x=m/n;let E=0;m===0&&o===0?E=.5/t:m===n&&l===Math.PI&&(E=-.5/t);for(let R=0;R<=t;R++){const w=R/t;d.x=-e*Math.cos(i+w*r)*Math.sin(o+x*a),d.y=e*Math.cos(o+x*a),d.z=e*Math.sin(i+w*r)*Math.sin(o+x*a),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),p.push(w+E,1-x),M.push(c++)}h.push(M)}for(let m=0;m<n;m++)for(let M=0;M<t;M++){const x=h[m][M+1],E=h[m][M],R=h[m+1][M],w=h[m+1][M+1];(m!==0||o>0)&&f.push(x,E,w),(m!==n-1||l<Math.PI)&&f.push(E,R,w)}this.setIndex(f),this.setAttribute("position",new yt(g,3)),this.setAttribute("normal",new yt(_,3)),this.setAttribute("uv",new yt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ts(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Zo extends Es{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Zo(e.radius,e.detail)}}class P_ extends Bi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ve(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hc,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class uh extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ve(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const vo=new it,jl=new V,ql=new V;class U_{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Oe(512,512),this.map=null,this.mapPass=null,this.matrix=new it,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new jo,this._frameExtents=new Oe(1,1),this._viewportCount=1,this._viewports=[new ht(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;jl.setFromMatrixPosition(e.matrixWorld),t.position.copy(jl),ql.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ql),t.updateMatrixWorld(),vo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(vo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class L_ extends U_{constructor(){super(new Ms(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class D_ extends uh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new L_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class I_ extends uh{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class F_ extends Gt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class dh{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Kl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Kl();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Kl(){return(typeof performance>"u"?Date:performance).now()}const Zl=new it;class N_{constructor(e,t,n=0,i=1/0){this.ray=new Ss(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Yo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Zl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Zl),this}intersectObject(e,t=!0,n=[]){return Fo(e,this,n,t),n.sort(Jl),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Fo(e[i],this,n,t);return n.sort(Jl),n}}function Jl(s,e){return s.distance-e.distance}function Fo(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let o=0,a=r.length;o<a;o++)Fo(r[o],e,t,!0)}}class No{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ct(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Wo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Wo);function O_(){const s=document.activeElement;if(!s)return!1;const e=s.tagName;return e==="INPUT"||e==="TEXTAREA"||e==="SELECT"||s.isContentEditable}const Qr=.06,$r=.92,es=40,Ql=.05;class B_{constructor(e,t,{is2d:n=!1,target:i=window}={}){this._spherical=new No,this._offset=new V,this.setCameraControls(e,t,n),i.addEventListener("keydown",r=>{O_()||this.handleKey(r.code)&&r.preventDefault()})}setCameraControls(e,t,n=!1){this.camera=e,this.controls=t,this.is2d=n,this.home={position:e.position.clone(),target:t.target.clone(),zoom:e.zoom}}handleKey(e){if(this.is2d)switch(e){case"KeyW":return this._pan(0,es),!0;case"KeyS":return this._pan(0,-es),!0;case"KeyA":return this._pan(-es,0),!0;case"KeyD":return this._pan(es,0),!0;case"KeyQ":return this._zoom($r),!0;case"KeyE":return this._zoom(1/$r),!0;case"Space":case"KeyR":return this.reset(),!0;default:return!1}switch(e){case"KeyW":return this._orbit(0,-Qr),!0;case"KeyS":return this._orbit(0,Qr),!0;case"KeyA":return this._orbit(Qr,0),!0;case"KeyD":return this._orbit(-Qr,0),!0;case"KeyQ":return this._zoom($r),!0;case"KeyE":return this._zoom(1/$r),!0;case"Space":case"KeyR":return this.reset(),!0;default:return!1}}_orbit(e,t){this._offset.copy(this.camera.position).sub(this.controls.target),this._spherical.setFromVector3(this._offset),this._spherical.theta+=e,this._spherical.phi=Math.min(Math.PI-Ql,Math.max(Ql,this._spherical.phi+t)),this._offset.setFromSpherical(this._spherical),this.camera.position.copy(this.controls.target).add(this._offset),this.camera.lookAt(this.controls.target),this._changed()}_zoom(e){this.is2d?(this.camera.zoom=Math.min(20,Math.max(.05,this.camera.zoom/e)),this.camera.updateProjectionMatrix()):(this._offset.copy(this.camera.position).sub(this.controls.target),this._offset.multiplyScalar(e),this.camera.position.copy(this.controls.target).add(this._offset)),this._changed()}_pan(e,t){this.camera.position.x+=e,this.camera.position.y+=t,this.controls.target.x+=e,this.controls.target.y+=t,this._changed()}reset(){this.camera.position.copy(this.home.position),this.controls.target.copy(this.home.target),this.camera.zoom=this.home.zoom,this.camera.updateProjectionMatrix(),this.camera.lookAt(this.controls.target),this._changed()}_changed(){this.controls.update(),this.controls.dispatchEvent({type:"change"})}}const k_=5;function os(s,e={}){return{type:"event",event:s,payload:e}}function z_(s,e,t,n,i=k_){return Math.hypot(t-s,n-e)<i}class G_{constructor(e,t,n,{requestFrame:i=a=>requestAnimationFrame(a),onNodeClick:r=()=>{},onBackgroundClick:o=()=>{}}={}){this.pickFn=t,this.sendFn=n,this.requestFrame=i,this.onNodeClick=r,this.onBackgroundClick=o,this.hoverId=null,this.pointerDown=null,this.pendingMove=null,e.addEventListener("pointermove",a=>this._onMove(a)),e.addEventListener("pointerdown",a=>{this.pointerDown={x:a.clientX,y:a.clientY}}),e.addEventListener("pointerup",a=>this._onUp(a))}_onMove(e){const t=this.pendingMove===null;this.pendingMove={x:e.clientX,y:e.clientY},t&&this.requestFrame(()=>{const n=this.pendingMove;this.pendingMove=null,this._hover(n.x,n.y)})}_hover(e,t){const n=this.pickFn(e,t);n!==this.hoverId&&(this.hoverId=n,this.sendFn(os("node_hover",{node_id:n})))}_onUp(e){if(!this.pointerDown)return;const{x:t,y:n}=this.pointerDown;if(this.pointerDown=null,!z_(t,n,e.clientX,e.clientY))return;const i=this.pickFn(e.clientX,e.clientY);i!==null?(this.sendFn(os("node_click",{node_id:i})),this.onNodeClick(i)):(this.sendFn(os("background_click")),this.onBackgroundClick())}}class H_{constructor(e){this.ids=[],this.positions=new Float32Array(0),this.worker=new Worker(new URL("/assets/worker-DTWVF9kS.js",import.meta.url),{type:"module"}),this.worker.onmessage=({data:t})=>{t.type==="index"?this.ids=t.ids:t.type==="tick"&&(this.positions=t.positions)},this._unsubscribe=e.subscribe(t=>this._onStoreEvent(e,t))}setPaused(e){this.worker.postMessage({type:e?"pause":"resume"})}setDimensions(e){this.worker.postMessage({type:"set_dimensions",dimensions:e})}terminate(){this._unsubscribe(),this.worker.terminate()}_onStoreEvent(e,t){if(t.kind==="init")this.worker.postMessage({type:"init",dimensions:e.config.dimensions,nodes:[...e.nodes.values()].map(n=>({id:n.id,mass:Number(n.meta&&n.meta.mass)})),links:[...e.edges.values()].map(n=>({source:n.source,target:n.target,weight:Number(n.meta&&n.meta.weight)}))});else if(t.kind==="patch"){const n=t.patch;this.worker.postMessage({type:"patch",addNodes:n.add_nodes.map(i=>({id:i.id,mass:Number(i.meta&&i.meta.mass)})),removeNodes:n.remove_nodes,addLinks:n.add_edges.map(i=>({source:i.source,target:i.target,weight:Number(i.meta&&i.meta.weight)})),removeLinks:n.remove_edges})}}}const V_=2;class W_{constructor(e,{threshold:t=30,holdSeconds:n=3,smoothing:i=2}={}){this.onDegrade=e,this.threshold=t,this.holdSeconds=n,this.smoothing=i,this.avgFps=null,this.below=0,this.steps=0}frame(e){if(e<=0||this.steps>=V_)return;const t=1/e;this.avgFps=this.avgFps===null?t:this.avgFps+(t-this.avgFps)*Math.min(1,e*this.smoothing),this.avgFps<this.threshold?(this.below+=e,this.below>=this.holdSeconds&&(this.below=0,this.steps+=1,this.onDegrade(this.steps))):this.below=0}}const $l={type:"change"},xo={type:"start"},ec={type:"end"},ts=new Ss,tc=new Ln,X_=Math.cos(70*_d.DEG2RAD);class nc extends ni{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new V,this.cursor=new V,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:_n.ROTATE,MIDDLE:_n.DOLLY,RIGHT:_n.PAN},this.touches={ONE:Un.ROTATE,TWO:Un.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(b){b.addEventListener("keydown",ce),this._domElementKeyEvents=b},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ce),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent($l),n.update(),r=i.NONE},this.update=function(){const b=new V,$=new ti().setFromUnitVectors(e.up,new V(0,1,0)),z=$.clone().invert(),ee=new V,ge=new ti,Ae=new V,Re=2*Math.PI;return function(Xe=null){const De=n.object.position;b.copy(De).sub(n.target),b.applyQuaternion($),a.setFromVector3(b),n.autoRotate&&r===i.NONE&&P(v(Xe)),n.enableDamping?(a.theta+=l.theta*n.dampingFactor,a.phi+=l.phi*n.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let Ye=n.minAzimuthAngle,Je=n.maxAzimuthAngle;isFinite(Ye)&&isFinite(Je)&&(Ye<-Math.PI?Ye+=Re:Ye>Math.PI&&(Ye-=Re),Je<-Math.PI?Je+=Re:Je>Math.PI&&(Je-=Re),Ye<=Je?a.theta=Math.max(Ye,Math.min(Je,a.theta)):a.theta=a.theta>(Ye+Je)/2?Math.max(Ye,a.theta):Math.min(Je,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor);let tt=!1;if(n.zoomToCursor&&w||n.object.isOrthographicCamera)a.radius=q(a.radius);else{const $e=a.radius;a.radius=q(a.radius*c),tt=$e!=a.radius}if(b.setFromSpherical(a),b.applyQuaternion(z),De.copy(n.target).add(b),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),h.set(0,0,0)),n.zoomToCursor&&w){let $e=null;if(n.object.isPerspectiveCamera){const lt=b.length();$e=q(lt*c);const St=lt-$e;n.object.position.addScaledVector(E,St),n.object.updateMatrixWorld(),tt=!!St}else if(n.object.isOrthographicCamera){const lt=new V(R.x,R.y,0);lt.unproject(n.object);const St=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),tt=St!==n.object.zoom;const gt=new V(R.x,R.y,0);gt.unproject(n.object),n.object.position.sub(gt).add(lt),n.object.updateMatrixWorld(),$e=b.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;$e!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar($e).add(n.object.position):(ts.origin.copy(n.object.position),ts.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(ts.direction))<X_?e.lookAt(n.target):(tc.setFromNormalAndCoplanarPoint(n.object.up,n.target),ts.intersectPlane(tc,n.target))))}else if(n.object.isOrthographicCamera){const $e=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),$e!==n.object.zoom&&(n.object.updateProjectionMatrix(),tt=!0)}return c=1,w=!1,tt||ee.distanceToSquared(n.object.position)>o||8*(1-ge.dot(n.object.quaternion))>o||Ae.distanceToSquared(n.target)>o?(n.dispatchEvent($l),ee.copy(n.object.position),ge.copy(n.object.quaternion),Ae.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",be),n.domElement.removeEventListener("pointerdown",Ce),n.domElement.removeEventListener("pointercancel",S),n.domElement.removeEventListener("wheel",ie),n.domElement.removeEventListener("pointermove",C),n.domElement.removeEventListener("pointerup",S),n.domElement.getRootNode().removeEventListener("keydown",Te,{capture:!0}),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ce),n._domElementKeyEvents=null)};const n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const o=1e-6,a=new No,l=new No;let c=1;const h=new V,d=new Oe,u=new Oe,f=new Oe,g=new Oe,_=new Oe,p=new Oe,m=new Oe,M=new Oe,x=new Oe,E=new V,R=new Oe;let w=!1;const T=[],U={};let y=!1;function v(b){return b!==null?2*Math.PI/60*n.autoRotateSpeed*b:2*Math.PI/60/60*n.autoRotateSpeed}function L(b){const $=Math.abs(b*.01);return Math.pow(.95,n.zoomSpeed*$)}function P(b){l.theta-=b}function I(b){l.phi-=b}const N=function(){const b=new V;return function(z,ee){b.setFromMatrixColumn(ee,0),b.multiplyScalar(-z),h.add(b)}}(),W=function(){const b=new V;return function(z,ee){n.screenSpacePanning===!0?b.setFromMatrixColumn(ee,1):(b.setFromMatrixColumn(ee,0),b.crossVectors(n.object.up,b)),b.multiplyScalar(z),h.add(b)}}(),k=function(){const b=new V;return function(z,ee){const ge=n.domElement;if(n.object.isPerspectiveCamera){const Ae=n.object.position;b.copy(Ae).sub(n.target);let Re=b.length();Re*=Math.tan(n.object.fov/2*Math.PI/180),N(2*z*Re/ge.clientHeight,n.object.matrix),W(2*ee*Re/ge.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(N(z*(n.object.right-n.object.left)/n.object.zoom/ge.clientWidth,n.object.matrix),W(ee*(n.object.top-n.object.bottom)/n.object.zoom/ge.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function se(b){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=b:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function j(b){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=b:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function K(b,$){if(!n.zoomToCursor)return;w=!0;const z=n.domElement.getBoundingClientRect(),ee=b-z.left,ge=$-z.top,Ae=z.width,Re=z.height;R.x=ee/Ae*2-1,R.y=-(ge/Re)*2+1,E.set(R.x,R.y,1).unproject(n.object).sub(n.object.position).normalize()}function q(b){return Math.max(n.minDistance,Math.min(n.maxDistance,b))}function F(b){d.set(b.clientX,b.clientY)}function H(b){K(b.clientX,b.clientX),m.set(b.clientX,b.clientY)}function ne(b){g.set(b.clientX,b.clientY)}function O(b){u.set(b.clientX,b.clientY),f.subVectors(u,d).multiplyScalar(n.rotateSpeed);const $=n.domElement;P(2*Math.PI*f.x/$.clientHeight),I(2*Math.PI*f.y/$.clientHeight),d.copy(u),n.update()}function B(b){M.set(b.clientX,b.clientY),x.subVectors(M,m),x.y>0?se(L(x.y)):x.y<0&&j(L(x.y)),m.copy(M),n.update()}function te(b){_.set(b.clientX,b.clientY),p.subVectors(_,g).multiplyScalar(n.panSpeed),k(p.x,p.y),g.copy(_),n.update()}function G(b){K(b.clientX,b.clientY),b.deltaY<0?j(L(b.deltaY)):b.deltaY>0&&se(L(b.deltaY)),n.update()}function ae(b){let $=!1;switch(b.code){case n.keys.UP:b.ctrlKey||b.metaKey||b.shiftKey?I(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):k(0,n.keyPanSpeed),$=!0;break;case n.keys.BOTTOM:b.ctrlKey||b.metaKey||b.shiftKey?I(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):k(0,-n.keyPanSpeed),$=!0;break;case n.keys.LEFT:b.ctrlKey||b.metaKey||b.shiftKey?P(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):k(n.keyPanSpeed,0),$=!0;break;case n.keys.RIGHT:b.ctrlKey||b.metaKey||b.shiftKey?P(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):k(-n.keyPanSpeed,0),$=!0;break}$&&(b.preventDefault(),n.update())}function pe(b){if(T.length===1)d.set(b.pageX,b.pageY);else{const $=Ne(b),z=.5*(b.pageX+$.x),ee=.5*(b.pageY+$.y);d.set(z,ee)}}function ve(b){if(T.length===1)g.set(b.pageX,b.pageY);else{const $=Ne(b),z=.5*(b.pageX+$.x),ee=.5*(b.pageY+$.y);g.set(z,ee)}}function D(b){const $=Ne(b),z=b.pageX-$.x,ee=b.pageY-$.y,ge=Math.sqrt(z*z+ee*ee);m.set(0,ge)}function he(b){n.enableZoom&&D(b),n.enablePan&&ve(b)}function Pe(b){n.enableZoom&&D(b),n.enableRotate&&pe(b)}function Ue(b){if(T.length==1)u.set(b.pageX,b.pageY);else{const z=Ne(b),ee=.5*(b.pageX+z.x),ge=.5*(b.pageY+z.y);u.set(ee,ge)}f.subVectors(u,d).multiplyScalar(n.rotateSpeed);const $=n.domElement;P(2*Math.PI*f.x/$.clientHeight),I(2*Math.PI*f.y/$.clientHeight),d.copy(u)}function fe(b){if(T.length===1)_.set(b.pageX,b.pageY);else{const $=Ne(b),z=.5*(b.pageX+$.x),ee=.5*(b.pageY+$.y);_.set(z,ee)}p.subVectors(_,g).multiplyScalar(n.panSpeed),k(p.x,p.y),g.copy(_)}function ye(b){const $=Ne(b),z=b.pageX-$.x,ee=b.pageY-$.y,ge=Math.sqrt(z*z+ee*ee);M.set(0,ge),x.set(0,Math.pow(M.y/m.y,n.zoomSpeed)),se(x.y),m.copy(M);const Ae=(b.pageX+$.x)*.5,Re=(b.pageY+$.y)*.5;K(Ae,Re)}function Me(b){n.enableZoom&&ye(b),n.enablePan&&fe(b)}function de(b){n.enableZoom&&ye(b),n.enableRotate&&Ue(b)}function Ce(b){n.enabled!==!1&&(T.length===0&&(n.domElement.setPointerCapture(b.pointerId),n.domElement.addEventListener("pointermove",C),n.domElement.addEventListener("pointerup",S)),!me(b)&&(Be(b),b.pointerType==="touch"?Se(b):X(b)))}function C(b){n.enabled!==!1&&(b.pointerType==="touch"?ue(b):Z(b))}function S(b){switch(we(b),T.length){case 0:n.domElement.releasePointerCapture(b.pointerId),n.domElement.removeEventListener("pointermove",C),n.domElement.removeEventListener("pointerup",S),n.dispatchEvent(ec),r=i.NONE;break;case 1:const $=T[0],z=U[$];Se({pointerId:$,pageX:z.x,pageY:z.y});break}}function X(b){let $;switch(b.button){case 0:$=n.mouseButtons.LEFT;break;case 1:$=n.mouseButtons.MIDDLE;break;case 2:$=n.mouseButtons.RIGHT;break;default:$=-1}switch($){case _n.DOLLY:if(n.enableZoom===!1)return;H(b),r=i.DOLLY;break;case _n.ROTATE:if(b.ctrlKey||b.metaKey||b.shiftKey){if(n.enablePan===!1)return;ne(b),r=i.PAN}else{if(n.enableRotate===!1)return;F(b),r=i.ROTATE}break;case _n.PAN:if(b.ctrlKey||b.metaKey||b.shiftKey){if(n.enableRotate===!1)return;F(b),r=i.ROTATE}else{if(n.enablePan===!1)return;ne(b),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(xo)}function Z(b){switch(r){case i.ROTATE:if(n.enableRotate===!1)return;O(b);break;case i.DOLLY:if(n.enableZoom===!1)return;B(b);break;case i.PAN:if(n.enablePan===!1)return;te(b);break}}function ie(b){n.enabled===!1||n.enableZoom===!1||r!==i.NONE||(b.preventDefault(),n.dispatchEvent(xo),G(Q(b)),n.dispatchEvent(ec))}function Q(b){const $=b.deltaMode,z={clientX:b.clientX,clientY:b.clientY,deltaY:b.deltaY};switch($){case 1:z.deltaY*=16;break;case 2:z.deltaY*=100;break}return b.ctrlKey&&!y&&(z.deltaY*=10),z}function Te(b){b.key==="Control"&&(y=!0,n.domElement.getRootNode().addEventListener("keyup",le,{passive:!0,capture:!0}))}function le(b){b.key==="Control"&&(y=!1,n.domElement.getRootNode().removeEventListener("keyup",le,{passive:!0,capture:!0}))}function ce(b){n.enabled===!1||n.enablePan===!1||ae(b)}function Se(b){switch(xe(b),T.length){case 1:switch(n.touches.ONE){case Un.ROTATE:if(n.enableRotate===!1)return;pe(b),r=i.TOUCH_ROTATE;break;case Un.PAN:if(n.enablePan===!1)return;ve(b),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(n.touches.TWO){case Un.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;he(b),r=i.TOUCH_DOLLY_PAN;break;case Un.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Pe(b),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(xo)}function ue(b){switch(xe(b),r){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;Ue(b),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;fe(b),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Me(b),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;de(b),n.update();break;default:r=i.NONE}}function be(b){n.enabled!==!1&&b.preventDefault()}function Be(b){T.push(b.pointerId)}function we(b){delete U[b.pointerId];for(let $=0;$<T.length;$++)if(T[$]==b.pointerId){T.splice($,1);return}}function me(b){for(let $=0;$<T.length;$++)if(T[$]==b.pointerId)return!0;return!1}function xe(b){let $=U[b.pointerId];$===void 0&&($=new Oe,U[b.pointerId]=$),$.set(b.pageX,b.pageY)}function Ne(b){const $=b.pointerId===T[0]?T[1]:T[0];return U[$]}n.domElement.addEventListener("contextmenu",be),n.domElement.addEventListener("pointerdown",Ce),n.domElement.addEventListener("pointercancel",S),n.domElement.addEventListener("wheel",ie,{passive:!1}),n.domElement.getRootNode().addEventListener("keydown",Te,{passive:!0,capture:!0}),this.update()}}const fh={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class gr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Y_=new Ms(-1,1,1,-1,0,1);class j_ extends Gt{constructor(){super(),this.setAttribute("position",new yt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new yt([0,2,0,0,2,0],2))}}const q_=new j_;class ph{constructor(e){this._mesh=new Rt(q_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Y_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class K_ extends gr{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof It?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=dr.clone(e.uniforms),this.material=new It({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new ph(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class ic extends gr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class Z_ extends gr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class J_{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Oe);this._width=n.width,this._height=n.height,t=new en(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Fn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new K_(fh),this.copyPass.material.blending=yn,this.clock=new dh}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}ic!==void 0&&(o instanceof ic?n=!0:o instanceof Z_&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Oe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Q_ extends gr{constructor(e,t,n=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ve}render(e,t,n){const i=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=i}}const $_={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ve(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Oi extends gr{constructor(e,t,n,i){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new Oe(e.x,e.y):new Oe(256,256),this.clearColor=new Ve(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new en(r,o,{type:Fn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new en(r,o,{type:Fn});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new en(r,o,{type:Fn});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),o=Math.round(o/2)}const a=$_;this.highPassUniforms=dr.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new It({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Oe(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new V(1,1,1),new V(1,1,1),new V(1,1,1),new V(1,1,1),new V(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=fh;this.copyUniforms=dr.clone(h.uniforms),this.blendMaterial=new It({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:cs,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Ve,this.oldClearAlpha=1,this.basic=new mr,this.fsQuad=new ph(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new Oe(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=Oi.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Oi.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new It({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Oe(.5,.5)},direction:{value:new Oe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}}Oi.BlurDirectionX=new Oe(1,0);Oi.BlurDirectionY=new Oe(0,1);function Oo(s){return s!==null&&typeof s=="object"&&!Array.isArray(s)}function Jo(s,e){const t={...s};for(const[n,i]of Object.entries(e))t[n]=Oo(t[n])&&Oo(i)?Jo(t[n],i):i;return t}const ev="#dadada",tv={bg:"#cfe1fb",fg:"#000000",menuAttach:!0},nv={headerBg:"#ffffff",headerBgActive:"#ffffff",headerFg:"#000000",headerFgActive:"#000000",headerStripe:!0,gadget:"#000000",border:"#000000",bevel:"hard",bodyBg:"#0055aa",bodyFg:"#ffffff",key:"#ff8800",dockBg:"#b8c6e8",shadow:"0 2px 0 rgba(0,0,0,0.35)",backdropPattern:"flat",iconSet:"workbench-classic",font:"topaz-8"},iv={background:ev,screenBar:tv,window:nv},mh={background:"#f4f5f7",palette:["#2f7fe8","#e8553a","#2fa84f","#8a4fe8","#e8a02f","#1fb3c4","#d44f9e","#5b6472"],node:{color:"#2f7fe8",size:1,shape:"sphere",emissive:"#000000",emissiveIntensity:0},edge:{color:"#9aa3af",opacity:.5},lights:{ambient:{color:"#ffffff",intensity:.7},directional:{color:"#ffffff",intensity:1.2}},label:{color:"#1f2430",size:6,halo:"#f4f5f7",budget:200},detailBox:{"--vb-detail-bg":"rgba(255,255,255,0.95)","--vb-detail-fg":"#1f2430","--vb-detail-key":"#667788","--vb-detail-shadow":"0 4px 16px rgba(0,0,0,0.18)","--vb-status-bg":"rgba(20,23,28,0.85)","--vb-status-fg":"#ffffff"},bloom:{enabled:!1,strength:.8,radius:.6,threshold:.15},window:{headerBg:"#d8dde6",headerFg:"#1f2430",gadget:"#5a6573",bodyBg:"rgba(255,255,255,0.97)",bodyFg:"#1f2430",key:"#667788",dockBg:"#c2c9d4",shadow:"0 6px 20px rgba(0,0,0,0.22)"},flow:{size:2.4,baseSpeed:220,color:"#2f7fe8",opacity:.85}},rv={background:"#0a0e1a",palette:["#28d7fe","#ff2a6d","#05ffa1","#b967ff","#ffd166","#01c8ee","#ff6e27","#e8f8ff"],node:{color:"#28d7fe",size:1,shape:"sphere",emissive:"#1b3a5c",emissiveIntensity:1.2},edge:{color:"#1f4f6e",opacity:.65},lights:{ambient:{color:"#314466",intensity:.9},directional:{color:"#9fd8ff",intensity:1.4}},label:{color:"#d7f4ff",size:6,halo:"#0a0e1a",budget:200},detailBox:{"--vb-detail-bg":"rgba(10,16,28,0.92)","--vb-detail-fg":"#d7f4ff","--vb-detail-key":"#5a7d9e","--vb-detail-shadow":"0 0 18px rgba(40,215,254,0.35)","--vb-status-bg":"rgba(40,215,254,0.15)","--vb-status-fg":"#d7f4ff"},bloom:{enabled:!0,strength:.9,radius:.7,threshold:.15},window:{headerBg:"rgba(40,215,254,0.18)",headerFg:"#d7f4ff",gadget:"#28d7fe",bodyBg:"rgba(10,16,28,0.94)",bodyFg:"#d7f4ff",key:"#5a7d9e",dockBg:"rgba(40,215,254,0.12)",shadow:"0 0 22px rgba(40,215,254,0.45)"},flow:{size:3,baseSpeed:260,color:"#28d7fe",opacity:1}},sv=Jo(mh,iv),sr={modern:mh,cyber:rv,workbench:sv};function gh(s){return typeof s=="string"?sr[s]?sr[s]:(console.error(`viewbase: neznámé téma '${s}' – používám 'modern'`),sr.modern):Oo(s)?Jo(sr.modern,s):(s!=null&&console.error("viewbase: theme musí být string nebo objekt – používám modern"),sr.modern)}function ov(s,e=document.documentElement){for(const[n,i]of Object.entries(s.detailBox))e.style.setProperty(n,i);const t=s.window;if(t){const n={"--vb-window-header-bg":t.headerBg,"--vb-window-header-fg":t.headerFg,"--vb-window-gadget":t.gadget,"--vb-window-body-bg":t.bodyBg,"--vb-window-body-fg":t.bodyFg,"--vb-window-key":t.key,"--vb-window-dock-bg":t.dockBg,"--vb-window-shadow":t.shadow,"--vb-window-border":t.border};for(const[i,r]of Object.entries(n))r!=null&&e.style.setProperty(i,r);e.style.setProperty("--vb-window-header-pattern",t.headerStripe?`repeating-linear-gradient(0deg, ${t.headerFg}22 0px, ${t.headerFg}22 1px, transparent 1px, transparent 4px)`:"none")}}function _h(s,e,t){const n=s.type!=null&&e[s.type]||{};return{shape:n.shape??t.node.shape,color:s.meta.color??n.color??t.node.color,size:s.meta.size??n.size??t.node.size}}function av(){var s=Object.create(null);function e(i,r){var o=i.id,a=i.name,l=i.dependencies;l===void 0&&(l=[]);var c=i.init;c===void 0&&(c=function(){});var h=i.getTransferables;if(h===void 0&&(h=null),!s[o])try{l=l.map(function(u){return u&&u.isWorkerModule&&(e(u,function(f){if(f instanceof Error)throw f}),u=s[u.id].value),u}),c=n("<"+a+">.init",c),h&&(h=n("<"+a+">.getTransferables",h));var d=null;typeof c=="function"?d=c.apply(void 0,l):console.error("worker module init function failed to rehydrate"),s[o]={id:o,value:d,getTransferables:h},r(d)}catch(u){u&&u.noLog||console.error(u),r(u)}}function t(i,r){var o,a=i.id,l=i.args;(!s[a]||typeof s[a].value!="function")&&r(new Error("Worker module "+a+": not found or its 'init' did not return a function"));try{var c=(o=s[a]).value.apply(o,l);c&&typeof c.then=="function"?c.then(h,function(d){return r(d instanceof Error?d:new Error(""+d))}):h(c)}catch(d){r(d)}function h(d){try{var u=s[a].getTransferables&&s[a].getTransferables(d);(!u||!Array.isArray(u)||!u.length)&&(u=void 0),r(d,u)}catch(f){console.error(f),r(f)}}}function n(i,r){var o=void 0;self.troikaDefine=function(l){return o=l};var a=URL.createObjectURL(new Blob(["/** "+i.replace(/\*/g,"")+` **/

troikaDefine(
`+r+`
)`],{type:"application/javascript"}));try{importScripts(a)}catch(l){console.error(l)}return URL.revokeObjectURL(a),delete self.troikaDefine,o}self.addEventListener("message",function(i){var r=i.data,o=r.messageId,a=r.action,l=r.data;try{a==="registerModule"&&e(l,function(c){c instanceof Error?postMessage({messageId:o,success:!1,error:c.message}):postMessage({messageId:o,success:!0,result:{isCallable:typeof c=="function"}})}),a==="callModule"&&t(l,function(c,h){c instanceof Error?postMessage({messageId:o,success:!1,error:c.message}):postMessage({messageId:o,success:!0,result:c},h||void 0)})}catch(c){postMessage({messageId:o,success:!1,error:c.stack})}})}function lv(s){var e=function(){for(var t=[],n=arguments.length;n--;)t[n]=arguments[n];return e._getInitResult().then(function(i){if(typeof i=="function")return i.apply(void 0,t);throw new Error("Worker module function was called but `init` did not return a callable function")})};return e._getInitResult=function(){var t=s.dependencies,n=s.init;t=Array.isArray(t)?t.map(function(r){return r&&(r=r.onMainThread||r,r._getInitResult&&(r=r._getInitResult())),r}):[];var i=Promise.all(t).then(function(r){return n.apply(null,r)});return e._getInitResult=function(){return i},i},e}var vh=function(){var s=!1;if(typeof window<"u"&&typeof window.document<"u")try{var e=new Worker(URL.createObjectURL(new Blob([""],{type:"application/javascript"})));e.terminate(),s=!0}catch(t){console.log("Troika createWorkerModule: web workers not allowed; falling back to main thread execution. Cause: ["+t.message+"]")}return vh=function(){return s},s},cv=0,hv=0,yo=!1,hr=Object.create(null),ur=Object.create(null),Bo=Object.create(null);function Gi(s){if((!s||typeof s.init!="function")&&!yo)throw new Error("requires `options.init` function");var e=s.dependencies,t=s.init,n=s.getTransferables,i=s.workerId,r=lv(s);i==null&&(i="#default");var o="workerModule"+ ++cv,a=s.name||o,l=null;e=e&&e.map(function(h){return typeof h=="function"&&!h.workerModuleData&&(yo=!0,h=Gi({workerId:i,name:"<"+a+"> function dependency: "+h.name,init:`function(){return (
`+as(h)+`
)}`}),yo=!1),h&&h.workerModuleData&&(h=h.workerModuleData),h});function c(){for(var h=[],d=arguments.length;d--;)h[d]=arguments[d];if(!vh())return r.apply(void 0,h);if(!l){l=rc(i,"registerModule",c.workerModuleData);var u=function(){l=null,ur[i].delete(u)};(ur[i]||(ur[i]=new Set)).add(u)}return l.then(function(f){var g=f.isCallable;if(g)return rc(i,"callModule",{id:o,args:h});throw new Error("Worker module function was called but `init` did not return a callable function")})}return c.workerModuleData={isWorkerModule:!0,id:o,name:a,dependencies:e,init:as(t),getTransferables:n&&as(n)},c.onMainThread=r,c}function uv(s){ur[s]&&ur[s].forEach(function(e){e()}),hr[s]&&(hr[s].terminate(),delete hr[s])}function as(s){var e=s.toString();return!/^function/.test(e)&&/^\w+\s*\(/.test(e)&&(e="function "+e),e}function dv(s){var e=hr[s];if(!e){var t=as(av);e=hr[s]=new Worker(URL.createObjectURL(new Blob(["/** Worker Module Bootstrap: "+s.replace(/\*/g,"")+` **/

;(`+t+")()"],{type:"application/javascript"}))),e.onmessage=function(n){var i=n.data,r=i.messageId,o=Bo[r];if(!o)throw new Error("WorkerModule response with empty or unknown messageId");delete Bo[r],o(i)}}return e}function rc(s,e,t){return new Promise(function(n,i){var r=++hv;Bo[r]=function(o){o.success?n(o.result):i(new Error("Error in worker "+e+" call: "+o.error))},dv(s).postMessage({messageId:r,action:e,data:t})})}function xh(){var s=function(e){function t(K,q,F,H,ne,O,B,te){var G=1-B;te.x=G*G*K+2*G*B*F+B*B*ne,te.y=G*G*q+2*G*B*H+B*B*O}function n(K,q,F,H,ne,O,B,te,G,ae){var pe=1-G;ae.x=pe*pe*pe*K+3*pe*pe*G*F+3*pe*G*G*ne+G*G*G*B,ae.y=pe*pe*pe*q+3*pe*pe*G*H+3*pe*G*G*O+G*G*G*te}function i(K,q){for(var F=/([MLQCZ])([^MLQCZ]*)/g,H,ne,O,B,te;H=F.exec(K);){var G=H[2].replace(/^\s*|\s*$/g,"").split(/[,\s]+/).map(function(ae){return parseFloat(ae)});switch(H[1]){case"M":B=ne=G[0],te=O=G[1];break;case"L":(G[0]!==B||G[1]!==te)&&q("L",B,te,B=G[0],te=G[1]);break;case"Q":{q("Q",B,te,B=G[2],te=G[3],G[0],G[1]);break}case"C":{q("C",B,te,B=G[4],te=G[5],G[0],G[1],G[2],G[3]);break}case"Z":(B!==ne||te!==O)&&q("L",B,te,ne,O);break}}}function r(K,q,F){F===void 0&&(F=16);var H={x:0,y:0};i(K,function(ne,O,B,te,G,ae,pe,ve,D){switch(ne){case"L":q(O,B,te,G);break;case"Q":{for(var he=O,Pe=B,Ue=1;Ue<F;Ue++)t(O,B,ae,pe,te,G,Ue/(F-1),H),q(he,Pe,H.x,H.y),he=H.x,Pe=H.y;break}case"C":{for(var fe=O,ye=B,Me=1;Me<F;Me++)n(O,B,ae,pe,ve,D,te,G,Me/(F-1),H),q(fe,ye,H.x,H.y),fe=H.x,ye=H.y;break}}})}var o="precision highp float;attribute vec2 aUV;varying vec2 vUV;void main(){vUV=aUV;gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}",a="precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){gl_FragColor=texture2D(tex,vUV);}",l=new WeakMap,c={premultipliedAlpha:!1,preserveDrawingBuffer:!0,antialias:!1,depth:!1};function h(K,q){var F=K.getContext?K.getContext("webgl",c):K,H=l.get(F);if(!H){let pe=function(fe){var ye=O[fe];if(!ye&&(ye=O[fe]=F.getExtension(fe),!ye))throw new Error(fe+" not supported");return ye},ve=function(fe,ye){var Me=F.createShader(ye);return F.shaderSource(Me,fe),F.compileShader(Me),Me},D=function(fe,ye,Me,de){if(!B[fe]){var Ce={},C={},S=F.createProgram();F.attachShader(S,ve(ye,F.VERTEX_SHADER)),F.attachShader(S,ve(Me,F.FRAGMENT_SHADER)),F.linkProgram(S),B[fe]={program:S,transaction:function(Z){F.useProgram(S),Z({setUniform:function(Q,Te){for(var le=[],ce=arguments.length-2;ce-- >0;)le[ce]=arguments[ce+2];var Se=C[Te]||(C[Te]=F.getUniformLocation(S,Te));F["uniform"+Q].apply(F,[Se].concat(le))},setAttribute:function(Q,Te,le,ce,Se){var ue=Ce[Q];ue||(ue=Ce[Q]={buf:F.createBuffer(),loc:F.getAttribLocation(S,Q),data:null}),F.bindBuffer(F.ARRAY_BUFFER,ue.buf),F.vertexAttribPointer(ue.loc,Te,F.FLOAT,!1,0,0),F.enableVertexAttribArray(ue.loc),ne?F.vertexAttribDivisor(ue.loc,ce):pe("ANGLE_instanced_arrays").vertexAttribDivisorANGLE(ue.loc,ce),Se!==ue.data&&(F.bufferData(F.ARRAY_BUFFER,Se,le),ue.data=Se)}})}}}B[fe].transaction(de)},he=function(fe,ye){G++;try{F.activeTexture(F.TEXTURE0+G);var Me=te[fe];Me||(Me=te[fe]=F.createTexture(),F.bindTexture(F.TEXTURE_2D,Me),F.texParameteri(F.TEXTURE_2D,F.TEXTURE_MIN_FILTER,F.NEAREST),F.texParameteri(F.TEXTURE_2D,F.TEXTURE_MAG_FILTER,F.NEAREST)),F.bindTexture(F.TEXTURE_2D,Me),ye(Me,G)}finally{G--}},Pe=function(fe,ye,Me){var de=F.createFramebuffer();ae.push(de),F.bindFramebuffer(F.FRAMEBUFFER,de),F.activeTexture(F.TEXTURE0+ye),F.bindTexture(F.TEXTURE_2D,fe),F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,fe,0);try{Me(de)}finally{F.deleteFramebuffer(de),F.bindFramebuffer(F.FRAMEBUFFER,ae[--ae.length-1]||null)}},Ue=function(){O={},B={},te={},G=-1,ae.length=0};var ne=typeof WebGL2RenderingContext<"u"&&F instanceof WebGL2RenderingContext,O={},B={},te={},G=-1,ae=[];F.canvas.addEventListener("webglcontextlost",function(fe){Ue(),fe.preventDefault()},!1),l.set(F,H={gl:F,isWebGL2:ne,getExtension:pe,withProgram:D,withTexture:he,withTextureFramebuffer:Pe,handleContextLoss:Ue})}q(H)}function d(K,q,F,H,ne,O,B,te){B===void 0&&(B=15),te===void 0&&(te=null),h(K,function(G){var ae=G.gl,pe=G.withProgram,ve=G.withTexture;ve("copy",function(D,he){ae.texImage2D(ae.TEXTURE_2D,0,ae.RGBA,ne,O,0,ae.RGBA,ae.UNSIGNED_BYTE,q),pe("copy",o,a,function(Pe){var Ue=Pe.setUniform,fe=Pe.setAttribute;fe("aUV",2,ae.STATIC_DRAW,0,new Float32Array([0,0,2,0,0,2])),Ue("1i","image",he),ae.bindFramebuffer(ae.FRAMEBUFFER,te||null),ae.disable(ae.BLEND),ae.colorMask(B&8,B&4,B&2,B&1),ae.viewport(F,H,ne,O),ae.scissor(F,H,ne,O),ae.drawArrays(ae.TRIANGLES,0,3)})})})}function u(K,q,F){var H=K.width,ne=K.height;h(K,function(O){var B=O.gl,te=new Uint8Array(H*ne*4);B.readPixels(0,0,H,ne,B.RGBA,B.UNSIGNED_BYTE,te),K.width=q,K.height=F,d(B,te,0,0,H,ne)})}var f=Object.freeze({__proto__:null,withWebGLContext:h,renderImageData:d,resizeWebGLCanvasWithoutClearing:u});function g(K,q,F,H,ne,O){O===void 0&&(O=1);var B=new Uint8Array(K*q),te=H[2]-H[0],G=H[3]-H[1],ae=[];r(F,function(fe,ye,Me,de){ae.push({x1:fe,y1:ye,x2:Me,y2:de,minX:Math.min(fe,Me),minY:Math.min(ye,de),maxX:Math.max(fe,Me),maxY:Math.max(ye,de)})}),ae.sort(function(fe,ye){return fe.maxX-ye.maxX});for(var pe=0;pe<K;pe++)for(var ve=0;ve<q;ve++){var D=Pe(H[0]+te*(pe+.5)/K,H[1]+G*(ve+.5)/q),he=Math.pow(1-Math.abs(D)/ne,O)/2;D<0&&(he=1-he),he=Math.max(0,Math.min(255,Math.round(he*255))),B[ve*K+pe]=he}return B;function Pe(fe,ye){for(var Me=1/0,de=1/0,Ce=ae.length;Ce--;){var C=ae[Ce];if(C.maxX+de<=fe)break;if(fe+de>C.minX&&ye-de<C.maxY&&ye+de>C.minY){var S=m(fe,ye,C.x1,C.y1,C.x2,C.y2);S<Me&&(Me=S,de=Math.sqrt(Me))}}return Ue(fe,ye)&&(de=-de),de}function Ue(fe,ye){for(var Me=0,de=ae.length;de--;){var Ce=ae[de];if(Ce.maxX<=fe)break;var C=Ce.y1>ye!=Ce.y2>ye&&fe<(Ce.x2-Ce.x1)*(ye-Ce.y1)/(Ce.y2-Ce.y1)+Ce.x1;C&&(Me+=Ce.y1<Ce.y2?1:-1)}return Me!==0}}function _(K,q,F,H,ne,O,B,te,G,ae){O===void 0&&(O=1),te===void 0&&(te=0),G===void 0&&(G=0),ae===void 0&&(ae=0),p(K,q,F,H,ne,O,B,null,te,G,ae)}function p(K,q,F,H,ne,O,B,te,G,ae,pe){O===void 0&&(O=1),G===void 0&&(G=0),ae===void 0&&(ae=0),pe===void 0&&(pe=0);for(var ve=g(K,q,F,H,ne,O),D=new Uint8Array(ve.length*4),he=0;he<ve.length;he++)D[he*4+pe]=ve[he];d(B,D,G,ae,K,q,1<<3-pe,te)}function m(K,q,F,H,ne,O){var B=ne-F,te=O-H,G=B*B+te*te,ae=G?Math.max(0,Math.min(1,((K-F)*B+(q-H)*te)/G)):0,pe=K-(F+ae*B),ve=q-(H+ae*te);return pe*pe+ve*ve}var M=Object.freeze({__proto__:null,generate:g,generateIntoCanvas:_,generateIntoFramebuffer:p}),x="precision highp float;uniform vec4 uGlyphBounds;attribute vec2 aUV;attribute vec4 aLineSegment;varying vec4 vLineSegment;varying vec2 vGlyphXY;void main(){vLineSegment=aLineSegment;vGlyphXY=mix(uGlyphBounds.xy,uGlyphBounds.zw,aUV);gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}",E="precision highp float;uniform vec4 uGlyphBounds;uniform float uMaxDistance;uniform float uExponent;varying vec4 vLineSegment;varying vec2 vGlyphXY;float absDistToSegment(vec2 point,vec2 lineA,vec2 lineB){vec2 lineDir=lineB-lineA;float lenSq=dot(lineDir,lineDir);float t=lenSq==0.0 ? 0.0 : clamp(dot(point-lineA,lineDir)/lenSq,0.0,1.0);vec2 linePt=lineA+t*lineDir;return distance(point,linePt);}void main(){vec4 seg=vLineSegment;vec2 p=vGlyphXY;float dist=absDistToSegment(p,seg.xy,seg.zw);float val=pow(1.0-clamp(dist/uMaxDistance,0.0,1.0),uExponent)*0.5;bool crossing=(seg.y>p.y!=seg.w>p.y)&&(p.x<(seg.z-seg.x)*(p.y-seg.y)/(seg.w-seg.y)+seg.x);bool crossingUp=crossing&&vLineSegment.y<vLineSegment.w;gl_FragColor=vec4(crossingUp ? 1.0/255.0 : 0.0,crossing&&!crossingUp ? 1.0/255.0 : 0.0,0.0,val);}",R="precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){vec4 color=texture2D(tex,vUV);bool inside=color.r!=color.g;float val=inside ? 1.0-color.a : color.a;gl_FragColor=vec4(val);}",w=new Float32Array([0,0,2,0,0,2]),T=null,U=!1,y={},v=new WeakMap;function L(K){if(!U&&!W(K))throw new Error("WebGL generation not supported")}function P(K,q,F,H,ne,O,B){if(O===void 0&&(O=1),B===void 0&&(B=null),!B&&(B=T,!B)){var te=typeof OffscreenCanvas=="function"?new OffscreenCanvas(1,1):typeof document<"u"?document.createElement("canvas"):null;if(!te)throw new Error("OffscreenCanvas or DOM canvas not supported");B=T=te.getContext("webgl",{depth:!1})}L(B);var G=new Uint8Array(K*q*4);h(B,function(D){var he=D.gl,Pe=D.withTexture,Ue=D.withTextureFramebuffer;Pe("readable",function(fe,ye){he.texImage2D(he.TEXTURE_2D,0,he.RGBA,K,q,0,he.RGBA,he.UNSIGNED_BYTE,null),Ue(fe,ye,function(Me){N(K,q,F,H,ne,O,he,Me,0,0,0),he.readPixels(0,0,K,q,he.RGBA,he.UNSIGNED_BYTE,G)})})});for(var ae=new Uint8Array(K*q),pe=0,ve=0;pe<G.length;pe+=4)ae[ve++]=G[pe];return ae}function I(K,q,F,H,ne,O,B,te,G,ae){O===void 0&&(O=1),te===void 0&&(te=0),G===void 0&&(G=0),ae===void 0&&(ae=0),N(K,q,F,H,ne,O,B,null,te,G,ae)}function N(K,q,F,H,ne,O,B,te,G,ae,pe){O===void 0&&(O=1),G===void 0&&(G=0),ae===void 0&&(ae=0),pe===void 0&&(pe=0),L(B);var ve=[];r(F,function(D,he,Pe,Ue){ve.push(D,he,Pe,Ue)}),ve=new Float32Array(ve),h(B,function(D){var he=D.gl,Pe=D.isWebGL2,Ue=D.getExtension,fe=D.withProgram,ye=D.withTexture,Me=D.withTextureFramebuffer,de=D.handleContextLoss;if(ye("rawDistances",function(Ce,C){(K!==Ce._lastWidth||q!==Ce._lastHeight)&&he.texImage2D(he.TEXTURE_2D,0,he.RGBA,Ce._lastWidth=K,Ce._lastHeight=q,0,he.RGBA,he.UNSIGNED_BYTE,null),fe("main",x,E,function(S){var X=S.setAttribute,Z=S.setUniform,ie=!Pe&&Ue("ANGLE_instanced_arrays"),Q=!Pe&&Ue("EXT_blend_minmax");X("aUV",2,he.STATIC_DRAW,0,w),X("aLineSegment",4,he.DYNAMIC_DRAW,1,ve),Z.apply(void 0,["4f","uGlyphBounds"].concat(H)),Z("1f","uMaxDistance",ne),Z("1f","uExponent",O),Me(Ce,C,function(Te){he.enable(he.BLEND),he.colorMask(!0,!0,!0,!0),he.viewport(0,0,K,q),he.scissor(0,0,K,q),he.blendFunc(he.ONE,he.ONE),he.blendEquationSeparate(he.FUNC_ADD,Pe?he.MAX:Q.MAX_EXT),he.clear(he.COLOR_BUFFER_BIT),Pe?he.drawArraysInstanced(he.TRIANGLES,0,3,ve.length/4):ie.drawArraysInstancedANGLE(he.TRIANGLES,0,3,ve.length/4)})}),fe("post",o,R,function(S){S.setAttribute("aUV",2,he.STATIC_DRAW,0,w),S.setUniform("1i","tex",C),he.bindFramebuffer(he.FRAMEBUFFER,te),he.disable(he.BLEND),he.colorMask(pe===0,pe===1,pe===2,pe===3),he.viewport(G,ae,K,q),he.scissor(G,ae,K,q),he.drawArrays(he.TRIANGLES,0,3)})}),he.isContextLost())throw de(),new Error("webgl context lost")})}function W(K){var q=!K||K===T?y:K.canvas||K,F=v.get(q);if(F===void 0){U=!0;var H=null;try{var ne=[97,106,97,61,99,137,118,80,80,118,137,99,61,97,106,97],O=P(4,4,"M8,8L16,8L24,24L16,24Z",[0,0,32,32],24,1,K);F=O&&ne.length===O.length&&O.every(function(B,te){return B===ne[te]}),F||(H="bad trial run results",console.info(ne,O))}catch(B){F=!1,H=B.message}H&&console.warn("WebGL SDF generation not supported:",H),U=!1,v.set(q,F)}return F}var k=Object.freeze({__proto__:null,generate:P,generateIntoCanvas:I,generateIntoFramebuffer:N,isSupported:W});function se(K,q,F,H,ne,O){ne===void 0&&(ne=Math.max(H[2]-H[0],H[3]-H[1])/2),O===void 0&&(O=1);try{return P.apply(k,arguments)}catch(B){return console.info("WebGL SDF generation failed, falling back to JS",B),g.apply(M,arguments)}}function j(K,q,F,H,ne,O,B,te,G,ae){ne===void 0&&(ne=Math.max(H[2]-H[0],H[3]-H[1])/2),O===void 0&&(O=1),te===void 0&&(te=0),G===void 0&&(G=0),ae===void 0&&(ae=0);try{return I.apply(k,arguments)}catch(pe){return console.info("WebGL SDF generation failed, falling back to JS",pe),_.apply(M,arguments)}}return e.forEachPathCommand=i,e.generate=se,e.generateIntoCanvas=j,e.javascript=M,e.pathToLineSegments=r,e.webgl=k,e.webglUtils=f,Object.defineProperty(e,"__esModule",{value:!0}),e}({});return s}function fv(){var s=function(e){var t={R:"13k,1a,2,3,3,2+1j,ch+16,a+1,5+2,2+n,5,a,4,6+16,4+3,h+1b,4mo,179q,2+9,2+11,2i9+7y,2+68,4,3+4,5+13,4+3,2+4k,3+29,8+cf,1t+7z,w+17,3+3m,1t+3z,16o1+5r,8+30,8+mc,29+1r,29+4v,75+73",EN:"1c+9,3d+1,6,187+9,513,4+5,7+9,sf+j,175h+9,qw+q,161f+1d,4xt+a,25i+9",ES:"17,2,6dp+1,f+1,av,16vr,mx+1,4o,2",ET:"z+2,3h+3,b+1,ym,3e+1,2o,p4+1,8,6u,7c,g6,1wc,1n9+4,30+1b,2n,6d,qhx+1,h0m,a+1,49+2,63+1,4+1,6bb+3,12jj",AN:"16o+5,2j+9,2+1,35,ed,1ff2+9,87+u",CS:"18,2+1,b,2u,12k,55v,l,17v0,2,3,53,2+1,b",B:"a,3,f+2,2v,690",S:"9,2,k",WS:"c,k,4f4,1vk+a,u,1j,335",ON:"x+1,4+4,h+5,r+5,r+3,z,5+3,2+1,2+1,5,2+2,3+4,o,w,ci+1,8+d,3+d,6+8,2+g,39+1,9,6+1,2,33,b8,3+1,3c+1,7+1,5r,b,7h+3,sa+5,2,3i+6,jg+3,ur+9,2v,ij+1,9g+9,7+a,8m,4+1,49+x,14u,2+2,c+2,e+2,e+2,e+1,i+n,e+e,2+p,u+2,e+2,36+1,2+3,2+1,b,2+2,6+5,2,2,2,h+1,5+4,6+3,3+f,16+2,5+3l,3+81,1y+p,2+40,q+a,m+13,2r+ch,2+9e,75+hf,3+v,2+2w,6e+5,f+6,75+2a,1a+p,2+2g,d+5x,r+b,6+3,4+o,g,6+1,6+2,2k+1,4,2j,5h+z,1m+1,1e+f,t+2,1f+e,d+3,4o+3,2s+1,w,535+1r,h3l+1i,93+2,2s,b+1,3l+x,2v,4g+3,21+3,kz+1,g5v+1,5a,j+9,n+v,2,3,2+8,2+1,3+2,2,3,46+1,4+4,h+5,r+5,r+a,3h+2,4+6,b+4,78,1r+24,4+c,4,1hb,ey+6,103+j,16j+c,1ux+7,5+g,fsh,jdq+1t,4,57+2e,p1,1m,1m,1m,1m,4kt+1,7j+17,5+2r,d+e,3+e,2+e,2+10,m+4,w,1n+5,1q,4z+5,4b+rb,9+c,4+c,4+37,d+2g,8+b,l+b,5+1j,9+9,7+13,9+t,3+1,27+3c,2+29,2+3q,d+d,3+4,4+2,6+6,a+o,8+6,a+2,e+6,16+42,2+1i",BN:"0+8,6+d,2s+5,2+p,e,4m9,1kt+2,2b+5,5+5,17q9+v,7k,6p+8,6+1,119d+3,440+7,96s+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+75,6p+2rz,1ben+1,1ekf+1,1ekf+1",NSM:"lc+33,7o+6,7c+18,2,2+1,2+1,2,21+a,1d+k,h,2u+6,3+5,3+1,2+3,10,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,g+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+g,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,k1+w,2db+2,3y,2p+v,ff+3,30+1,n9x+3,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,r2,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+5,3+1,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2d+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,f0c+4,1o+6,t5,1s+3,2a,f5l+1,43t+2,i+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,gzhy+6n",AL:"16w,3,2,e+1b,z+2,2+2s,g+1,8+1,b+m,2+t,s+2i,c+e,4h+f,1d+1e,1bwe+dp,3+3z,x+c,2+1,35+3y,2rm+z,5+7,b+5,dt+l,c+u,17nl+27,1t+27,4x+6n,3+d",LRO:"6ct",RLO:"6cu",LRE:"6cq",RLE:"6cr",PDF:"6cs",LRI:"6ee",RLI:"6ef",FSI:"6eg",PDI:"6eh"},n={},i={};n.L=1,i[1]="L",Object.keys(t).forEach(function(de,Ce){n[de]=1<<Ce+1,i[n[de]]=de}),Object.freeze(n);var r=n.LRI|n.RLI|n.FSI,o=n.L|n.R|n.AL,a=n.B|n.S|n.WS|n.ON|n.FSI|n.LRI|n.RLI|n.PDI,l=n.BN|n.RLE|n.LRE|n.RLO|n.LRO|n.PDF,c=n.S|n.WS|n.B|r|n.PDI|l,h=null;function d(){if(!h){h=new Map;var de=function(C){if(t.hasOwnProperty(C)){var S=0;t[C].split(",").forEach(function(X){var Z=X.split("+"),ie=Z[0],Q=Z[1];ie=parseInt(ie,36),Q=Q?parseInt(Q,36):0,h.set(S+=ie,n[C]);for(var Te=0;Te<Q;Te++)h.set(++S,n[C])})}};for(var Ce in t)de(Ce)}}function u(de){return d(),h.get(de.codePointAt(0))||n.L}function f(de){return i[u(de)]}var g={pairs:"14>1,1e>2,u>2,2wt>1,1>1,1ge>1,1wp>1,1j>1,f>1,hm>1,1>1,u>1,u6>1,1>1,+5,28>1,w>1,1>1,+3,b8>1,1>1,+3,1>3,-1>-1,3>1,1>1,+2,1s>1,1>1,x>1,th>1,1>1,+2,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,4q>1,1e>2,u>2,2>1,+1",canonical:"6f1>-6dx,6dy>-6dx,6ec>-6ed,6ee>-6ed,6ww>2jj,-2ji>2jj,14r4>-1e7l,1e7m>-1e7l,1e7m>-1e5c,1e5d>-1e5b,1e5c>-14qx,14qy>-14qx,14vn>-1ecg,1ech>-1ecg,1edu>-1ecg,1eci>-1ecg,1eda>-1ecg,1eci>-1ecg,1eci>-168q,168r>-168q,168s>-14ye,14yf>-14ye"};function _(de,Ce){var C=36,S=0,X=new Map,Z=Ce&&new Map,ie;return de.split(",").forEach(function Q(Te){if(Te.indexOf("+")!==-1)for(var le=+Te;le--;)Q(ie);else{ie=Te;var ce=Te.split(">"),Se=ce[0],ue=ce[1];Se=String.fromCodePoint(S+=parseInt(Se,C)),ue=String.fromCodePoint(S+=parseInt(ue,C)),X.set(Se,ue),Ce&&Z.set(ue,Se)}}),{map:X,reverseMap:Z}}var p,m,M;function x(){if(!p){var de=_(g.pairs,!0),Ce=de.map,C=de.reverseMap;p=Ce,m=C,M=_(g.canonical,!1).map}}function E(de){return x(),p.get(de)||null}function R(de){return x(),m.get(de)||null}function w(de){return x(),M.get(de)||null}var T=n.L,U=n.R,y=n.EN,v=n.ES,L=n.ET,P=n.AN,I=n.CS,N=n.B,W=n.S,k=n.ON,se=n.BN,j=n.NSM,K=n.AL,q=n.LRO,F=n.RLO,H=n.LRE,ne=n.RLE,O=n.PDF,B=n.LRI,te=n.RLI,G=n.FSI,ae=n.PDI;function pe(de,Ce){for(var C=125,S=new Uint32Array(de.length),X=0;X<de.length;X++)S[X]=u(de[X]);var Z=new Map;function ie(Pt,Zt){var Ut=S[Pt];S[Pt]=Zt,Z.set(Ut,Z.get(Ut)-1),Ut&a&&Z.set(a,Z.get(a)-1),Z.set(Zt,(Z.get(Zt)||0)+1),Zt&a&&Z.set(a,(Z.get(a)||0)+1)}for(var Q=new Uint8Array(de.length),Te=new Map,le=[],ce=null,Se=0;Se<de.length;Se++)ce||le.push(ce={start:Se,end:de.length-1,level:Ce==="rtl"?1:Ce==="ltr"?0:da(Se,!1)}),S[Se]&N&&(ce.end=Se,ce=null);for(var ue=ne|H|F|q|r|ae|O|N,be=function(Pt){return Pt+(Pt&1?1:2)},Be=function(Pt){return Pt+(Pt&1?2:1)},we=0;we<le.length;we++){ce=le[we];var me=[{_level:ce.level,_override:0,_isolate:0}],xe=void 0,Ne=0,We=0,b=0;Z.clear();for(var $=ce.start;$<=ce.end;$++){var z=S[$];if(xe=me[me.length-1],Z.set(z,(Z.get(z)||0)+1),z&a&&Z.set(a,(Z.get(a)||0)+1),z&ue)if(z&(ne|H)){Q[$]=xe._level;var ee=(z===ne?Be:be)(xe._level);ee<=C&&!Ne&&!We?me.push({_level:ee,_override:0,_isolate:0}):Ne||We++}else if(z&(F|q)){Q[$]=xe._level;var ge=(z===F?Be:be)(xe._level);ge<=C&&!Ne&&!We?me.push({_level:ge,_override:z&F?U:T,_isolate:0}):Ne||We++}else if(z&r){z&G&&(z=da($+1,!0)===1?te:B),Q[$]=xe._level,xe._override&&ie($,xe._override);var Ae=(z===te?Be:be)(xe._level);Ae<=C&&Ne===0&&We===0?(b++,me.push({_level:Ae,_override:0,_isolate:1,_isolInitIndex:$})):Ne++}else if(z&ae){if(Ne>0)Ne--;else if(b>0){for(We=0;!me[me.length-1]._isolate;)me.pop();var Re=me[me.length-1]._isolInitIndex;Re!=null&&(Te.set(Re,$),Te.set($,Re)),me.pop(),b--}xe=me[me.length-1],Q[$]=xe._level,xe._override&&ie($,xe._override)}else z&O?(Ne===0&&(We>0?We--:!xe._isolate&&me.length>1&&(me.pop(),xe=me[me.length-1])),Q[$]=xe._level):z&N&&(Q[$]=ce.level);else Q[$]=xe._level,xe._override&&z!==se&&ie($,xe._override)}for(var je=[],Xe=null,De=ce.start;De<=ce.end;De++){var Ye=S[De];if(!(Ye&l)){var Je=Q[De],tt=Ye&r,$e=Ye===ae;Xe&&Je===Xe._level?(Xe._end=De,Xe._endsWithIsolInit=tt):je.push(Xe={_start:De,_end:De,_level:Je,_startsWithPDI:$e,_endsWithIsolInit:tt})}}for(var lt=[],St=0;St<je.length;St++){var gt=je[St];if(!gt._startsWithPDI||gt._startsWithPDI&&!Te.has(gt._start)){for(var qt=[Xe=gt],Ht=void 0;Xe&&Xe._endsWithIsolInit&&(Ht=Te.get(Xe._end))!=null;)for(var Vt=St+1;Vt<je.length;Vt++)if(je[Vt]._start===Ht){qt.push(Xe=je[Vt]);break}for(var ft=[],cn=0;cn<qt.length;cn++)for(var _r=qt[cn],Hi=_r._start;Hi<=_r._end;Hi++)ft.push(Hi);for(var A=Q[ft[0]],Y=ce.level,re=ft[0]-1;re>=0;re--)if(!(S[re]&l)){Y=Q[re];break}var oe=ft[ft.length-1],J=Q[oe],Ee=ce.level;if(!(S[oe]&r)){for(var Ie=oe+1;Ie<=ce.end;Ie++)if(!(S[Ie]&l)){Ee=Q[Ie];break}}lt.push({_seqIndices:ft,_sosType:Math.max(Y,A)%2?U:T,_eosType:Math.max(Ee,J)%2?U:T})}}for(var Fe=0;Fe<lt.length;Fe++){var ke=lt[Fe],_e=ke._seqIndices,Ge=ke._sosType,He=ke._eosType,Ze=Q[_e[0]]&1?U:T;if(Z.get(j))for(var rt=0;rt<_e.length;rt++){var st=_e[rt];if(S[st]&j){for(var _t=Ge,Qe=rt-1;Qe>=0;Qe--)if(!(S[_e[Qe]]&l)){_t=S[_e[Qe]];break}ie(st,_t&(r|ae)?k:_t)}}if(Z.get(y))for(var ze=0;ze<_e.length;ze++){var pt=_e[ze];if(S[pt]&y)for(var et=ze-1;et>=-1;et--){var Wt=et===-1?Ge:S[_e[et]];if(Wt&o){Wt===K&&ie(pt,P);break}}}if(Z.get(K))for(var Mn=0;Mn<_e.length;Mn++){var tn=_e[Mn];S[tn]&K&&ie(tn,U)}if(Z.get(v)||Z.get(I))for(var hn=1;hn<_e.length-1;hn++){var at=_e[hn];if(S[at]&(v|I)){for(var wt=0,kn=0,Mt=hn-1;Mt>=0&&(wt=S[_e[Mt]],!!(wt&l));Mt--);for(var zn=hn+1;zn<_e.length&&(kn=S[_e[zn]],!!(kn&l));zn++);wt===kn&&(S[at]===v?wt===y:wt&(y|P))&&ie(at,wt)}}if(Z.get(y))for(var Xt=0;Xt<_e.length;Xt++){var vr=_e[Xt];if(S[vr]&y){for(var xr=Xt-1;xr>=0&&S[_e[xr]]&(L|l);xr--)ie(_e[xr],y);for(Xt++;Xt<_e.length&&S[_e[Xt]]&(L|l|y);Xt++)S[_e[Xt]]!==y&&ie(_e[Xt],y)}}if(Z.get(L)||Z.get(v)||Z.get(I))for(var Vi=0;Vi<_e.length;Vi++){var $o=_e[Vi];if(S[$o]&(L|v|I)){ie($o,k);for(var yr=Vi-1;yr>=0&&S[_e[yr]]&l;yr--)ie(_e[yr],k);for(var Sr=Vi+1;Sr<_e.length&&S[_e[Sr]]&l;Sr++)ie(_e[Sr],k)}}if(Z.get(y))for(var As=0,ea=Ge;As<_e.length;As++){var ta=_e[As],Cs=S[ta];Cs&y?ea===T&&ie(ta,T):Cs&o&&(ea=Cs)}if(Z.get(a)){var Wi=U|y|P,na=Wi|T,Mr=[];{for(var si=[],oi=0;oi<_e.length;oi++)if(S[_e[oi]]&a){var Xi=de[_e[oi]],ia=void 0;if(E(Xi)!==null)if(si.length<63)si.push({char:Xi,seqIndex:oi});else break;else if((ia=R(Xi))!==null)for(var Yi=si.length-1;Yi>=0;Yi--){var Rs=si[Yi].char;if(Rs===ia||Rs===R(w(Xi))||E(w(Rs))===Xi){Mr.push([si[Yi].seqIndex,oi]),si.length=Yi;break}}}Mr.sort(function(Pt,Zt){return Pt[0]-Zt[0]})}for(var Ps=0;Ps<Mr.length;Ps++){for(var ra=Mr[Ps],br=ra[0],Us=ra[1],sa=!1,Kt=0,Ls=br+1;Ls<Us;Ls++){var oa=_e[Ls];if(S[oa]&na){sa=!0;var aa=S[oa]&Wi?U:T;if(aa===Ze){Kt=aa;break}}}if(sa&&!Kt){Kt=Ge;for(var Ds=br-1;Ds>=0;Ds--){var la=_e[Ds];if(S[la]&na){var ca=S[la]&Wi?U:T;ca!==Ze?Kt=ca:Kt=Ze;break}}}if(Kt){if(S[_e[br]]=S[_e[Us]]=Kt,Kt!==Ze){for(var ji=br+1;ji<_e.length;ji++)if(!(S[_e[ji]]&l)){u(de[_e[ji]])&j&&(S[_e[ji]]=Kt);break}}if(Kt!==Ze){for(var qi=Us+1;qi<_e.length;qi++)if(!(S[_e[qi]]&l)){u(de[_e[qi]])&j&&(S[_e[qi]]=Kt);break}}}}for(var bn=0;bn<_e.length;bn++)if(S[_e[bn]]&a){for(var ha=bn,Is=bn,Fs=Ge,Ki=bn-1;Ki>=0;Ki--)if(S[_e[Ki]]&l)ha=Ki;else{Fs=S[_e[Ki]]&Wi?U:T;break}for(var ua=He,Zi=bn+1;Zi<_e.length;Zi++)if(S[_e[Zi]]&(a|l))Is=Zi;else{ua=S[_e[Zi]]&Wi?U:T;break}for(var Ns=ha;Ns<=Is;Ns++)S[_e[Ns]]=Fs===ua?Fs:Ze;bn=Is}}}for(var Nt=ce.start;Nt<=ce.end;Nt++){var Uh=Q[Nt],Er=S[Nt];if(Uh&1?Er&(T|y|P)&&Q[Nt]++:Er&U?Q[Nt]++:Er&(P|y)&&(Q[Nt]+=2),Er&l&&(Q[Nt]=Nt===0?ce.level:Q[Nt-1]),Nt===ce.end||u(de[Nt])&(W|N))for(var Tr=Nt;Tr>=0&&u(de[Tr])&c;Tr--)Q[Tr]=ce.level}}return{levels:Q,paragraphs:le};function da(Pt,Zt){for(var Ut=Pt;Ut<de.length;Ut++){var En=S[Ut];if(En&(U|K))return 1;if(En&(N|T)||Zt&&En===ae)return 0;if(En&r){var fa=Lh(Ut);Ut=fa===-1?de.length:fa}}return 0}function Lh(Pt){for(var Zt=1,Ut=Pt+1;Ut<de.length;Ut++){var En=S[Ut];if(En&N)break;if(En&ae){if(--Zt===0)return Ut}else En&r&&Zt++}return-1}}var ve="14>1,j>2,t>2,u>2,1a>g,2v3>1,1>1,1ge>1,1wd>1,b>1,1j>1,f>1,ai>3,-2>3,+1,8>1k0,-1jq>1y7,-1y6>1hf,-1he>1h6,-1h5>1ha,-1h8>1qi,-1pu>1,6>3u,-3s>7,6>1,1>1,f>1,1>1,+2,3>1,1>1,+13,4>1,1>1,6>1eo,-1ee>1,3>1mg,-1me>1mk,-1mj>1mi,-1mg>1mi,-1md>1,1>1,+2,1>10k,-103>1,1>1,4>1,5>1,1>1,+10,3>1,1>8,-7>8,+1,-6>7,+1,a>1,1>1,u>1,u6>1,1>1,+5,26>1,1>1,2>1,2>2,8>1,7>1,4>1,1>1,+5,b8>1,1>1,+3,1>3,-2>1,2>1,1>1,+2,c>1,3>1,1>1,+2,h>1,3>1,a>1,1>1,2>1,3>1,1>1,d>1,f>1,3>1,1a>1,1>1,6>1,7>1,13>1,k>1,1>1,+19,4>1,1>1,+2,2>1,1>1,+18,m>1,a>1,1>1,lk>1,1>1,4>1,2>1,f>1,3>1,1>1,+3,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,6>1,4j>1,j>2,t>2,u>2,2>1,+1",D;function he(){if(!D){var de=_(ve,!0),Ce=de.map,C=de.reverseMap;C.forEach(function(S,X){Ce.set(X,S)}),D=Ce}}function Pe(de){return he(),D.get(de)||null}function Ue(de,Ce,C,S){var X=de.length;C=Math.max(0,C==null?0:+C),S=Math.min(X-1,S==null?X-1:+S);for(var Z=new Map,ie=C;ie<=S;ie++)if(Ce[ie]&1){var Q=Pe(de[ie]);Q!==null&&Z.set(ie,Q)}return Z}function fe(de,Ce,C,S){var X=de.length;C=Math.max(0,C==null?0:+C),S=Math.min(X-1,S==null?X-1:+S);var Z=[];return Ce.paragraphs.forEach(function(ie){var Q=Math.max(C,ie.start),Te=Math.min(S,ie.end);if(Q<Te){for(var le=Ce.levels.slice(Q,Te+1),ce=Te;ce>=Q&&u(de[ce])&c;ce--)le[ce]=ie.level;for(var Se=ie.level,ue=1/0,be=0;be<le.length;be++){var Be=le[be];Be>Se&&(Se=Be),Be<ue&&(ue=Be|1)}for(var we=Se;we>=ue;we--)for(var me=0;me<le.length;me++)if(le[me]>=we){for(var xe=me;me+1<le.length&&le[me+1]>=we;)me++;me>xe&&Z.push([xe+Q,me+Q])}}}),Z}function ye(de,Ce,C,S){var X=Me(de,Ce,C,S),Z=[].concat(de);return X.forEach(function(ie,Q){Z[Q]=(Ce.levels[ie]&1?Pe(de[ie]):null)||de[ie]}),Z.join("")}function Me(de,Ce,C,S){for(var X=fe(de,Ce,C,S),Z=[],ie=0;ie<de.length;ie++)Z[ie]=ie;return X.forEach(function(Q){for(var Te=Q[0],le=Q[1],ce=Z.slice(Te,le+1),Se=ce.length;Se--;)Z[le-Se]=ce[Se]}),Z}return e.closingToOpeningBracket=R,e.getBidiCharType=u,e.getBidiCharTypeName=f,e.getCanonicalBracket=w,e.getEmbeddingLevels=pe,e.getMirroredCharacter=Pe,e.getMirroredCharactersMap=Ue,e.getReorderSegments=fe,e.getReorderedIndices=Me,e.getReorderedString=ye,e.openingToClosingBracket=E,Object.defineProperty(e,"__esModule",{value:!0}),e}({});return s}const yh=/\bvoid\s+main\s*\(\s*\)\s*{/g;function ko(s){const e=/^[ \t]*#include +<([\w\d./]+)>/gm;function t(n,i){let r=qe[i];return r?ko(r):n}return s.replace(e,t)}const vt=[];for(let s=0;s<256;s++)vt[s]=(s<16?"0":"")+s.toString(16);function pv(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(vt[s&255]+vt[s>>8&255]+vt[s>>16&255]+vt[s>>24&255]+"-"+vt[e&255]+vt[e>>8&255]+"-"+vt[e>>16&15|64]+vt[e>>24&255]+"-"+vt[t&63|128]+vt[t>>8&255]+"-"+vt[t>>16&255]+vt[t>>24&255]+vt[n&255]+vt[n>>8&255]+vt[n>>16&255]+vt[n>>24&255]).toUpperCase()}const jn=Object.assign||function(){let s=arguments[0];for(let e=1,t=arguments.length;e<t;e++){let n=arguments[e];if(n)for(let i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=n[i])}return s},mv=Date.now(),sc=new WeakMap,oc=new Map;let gv=1e10;function zo(s,e){const t=yv(e);let n=sc.get(s);if(n||sc.set(s,n=Object.create(null)),n[t])return new n[t];const i=`_onBeforeCompile${t}`,r=function(c,h){s.onBeforeCompile.call(this,c,h);const d=this.customProgramCacheKey()+"|"+c.vertexShader+"|"+c.fragmentShader;let u=oc[d];if(!u){const f=_v(this,c,e,t);u=oc[d]=f}c.vertexShader=u.vertexShader,c.fragmentShader=u.fragmentShader,jn(c.uniforms,this.uniforms),e.timeUniform&&(c.uniforms[e.timeUniform]={get value(){return Date.now()-mv}}),this[i]&&this[i](c)},o=function(){return a(e.chained?s:s.clone())},a=function(c){const h=Object.create(c,l);return Object.defineProperty(h,"baseMaterial",{value:s}),Object.defineProperty(h,"id",{value:gv++}),h.uuid=pv(),h.uniforms=jn({},c.uniforms,e.uniforms),h.defines=jn({},c.defines,e.defines),h.defines[`TROIKA_DERIVED_MATERIAL_${t}`]="",h.extensions=jn({},c.extensions,e.extensions),h._listeners=void 0,h},l={constructor:{value:o},isDerivedMaterial:{value:!0},type:{get:()=>s.type,set:c=>{s.type=c}},isDerivedFrom:{writable:!0,configurable:!0,value:function(c){const h=this.baseMaterial;return c===h||h.isDerivedMaterial&&h.isDerivedFrom(c)||!1}},customProgramCacheKey:{writable:!0,configurable:!0,value:function(){return s.customProgramCacheKey()+"|"+t}},onBeforeCompile:{get(){return r},set(c){this[i]=c}},copy:{writable:!0,configurable:!0,value:function(c){return s.copy.call(this,c),!s.isShaderMaterial&&!s.isDerivedMaterial&&(jn(this.extensions,c.extensions),jn(this.defines,c.defines),jn(this.uniforms,dr.clone(c.uniforms))),this}},clone:{writable:!0,configurable:!0,value:function(){const c=new s.constructor;return a(c).copy(this)}},getDepthMaterial:{writable:!0,configurable:!0,value:function(){let c=this._depthMaterial;return c||(c=this._depthMaterial=zo(s.isDerivedMaterial?s.getDepthMaterial():new ah({depthPacking:Gc}),e),c.defines.IS_DEPTH_MATERIAL="",c.uniforms=this.uniforms),c}},getDistanceMaterial:{writable:!0,configurable:!0,value:function(){let c=this._distanceMaterial;return c||(c=this._distanceMaterial=zo(s.isDerivedMaterial?s.getDistanceMaterial():new lh,e),c.defines.IS_DISTANCE_MATERIAL="",c.uniforms=this.uniforms),c}},dispose:{writable:!0,configurable:!0,value(){const{_depthMaterial:c,_distanceMaterial:h}=this;c&&c.dispose(),h&&h.dispose(),s.dispose.call(this)}}};return n[t]=o,new o}function _v(s,{vertexShader:e,fragmentShader:t},n,i){let{vertexDefs:r,vertexMainIntro:o,vertexMainOutro:a,vertexTransform:l,fragmentDefs:c,fragmentMainIntro:h,fragmentMainOutro:d,fragmentColorTransform:u,customRewriter:f,timeUniform:g}=n;if(r=r||"",o=o||"",a=a||"",c=c||"",h=h||"",d=d||"",(l||f)&&(e=ko(e)),(u||f)&&(t=t.replace(/^[ \t]*#include <((?:tonemapping|encodings|colorspace|fog|premultiplied_alpha|dithering)_fragment)>/gm,`
//!BEGIN_POST_CHUNK $1
$&
//!END_POST_CHUNK
`),t=ko(t)),f){let _=f({vertexShader:e,fragmentShader:t});e=_.vertexShader,t=_.fragmentShader}if(u){let _=[];t=t.replace(/^\/\/!BEGIN_POST_CHUNK[^]+?^\/\/!END_POST_CHUNK/gm,p=>(_.push(p),"")),d=`${u}
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
`,e=e.replace(/\b(position|normal|uv)\b/g,(_,p,m,M)=>/\battribute\s+vec[23]\s+$/.test(M.substr(0,m))?p:`troika_${p}_${i}`),s.map&&s.map.channel>0||(e=e.replace(/\bMAP_UV\b/g,`troika_uv_${i}`))),e=ac(e,i,r,o,a),t=ac(t,i,c,h,d),{vertexShader:e,fragmentShader:t}}function ac(s,e,t,n,i){return(n||i||t)&&(s=s.replace(yh,`
${t}
void troikaOrigMain${e}() {`),s+=`
void main() {
  ${n}
  troikaOrigMain${e}();
  ${i}
}`),s}function vv(s,e){return s==="uniforms"?void 0:typeof e=="function"?e.toString():e}let xv=0;const lc=new Map;function yv(s){const e=JSON.stringify(s,vv);let t=lc.get(e);return t==null&&lc.set(e,t=++xv),t}/*!
Custom build of Typr.ts (https://github.com/fredli74/Typr.ts) for use in Troika text rendering.
Original MIT license applies: https://github.com/fredli74/Typr.ts/blob/master/LICENSE
*/function Sv(){return typeof window>"u"&&(self.window=self),function(s){var e={parse:function(i){var r=e._bin,o=new Uint8Array(i);if(r.readASCII(o,0,4)=="ttcf"){var a=4;r.readUshort(o,a),a+=2,r.readUshort(o,a),a+=2;var l=r.readUint(o,a);a+=4;for(var c=[],h=0;h<l;h++){var d=r.readUint(o,a);a+=4,c.push(e._readFont(o,d))}return c}return[e._readFont(o,0)]},_readFont:function(i,r){var o=e._bin,a=r;o.readFixed(i,r),r+=4;var l=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2;for(var c=["cmap","head","hhea","maxp","hmtx","name","OS/2","post","loca","glyf","kern","CFF ","GDEF","GPOS","GSUB","SVG "],h={_data:i,_offset:a},d={},u=0;u<l;u++){var f=o.readASCII(i,r,4);r+=4,o.readUint(i,r),r+=4;var g=o.readUint(i,r);r+=4;var _=o.readUint(i,r);r+=4,d[f]={offset:g,length:_}}for(u=0;u<c.length;u++){var p=c[u];d[p]&&(h[p.trim()]=e[p.trim()].parse(i,d[p].offset,d[p].length,h))}return h},_tabOffset:function(i,r,o){for(var a=e._bin,l=a.readUshort(i,o+4),c=o+12,h=0;h<l;h++){var d=a.readASCII(i,c,4);c+=4,a.readUint(i,c),c+=4;var u=a.readUint(i,c);if(c+=4,a.readUint(i,c),c+=4,d==r)return u}return 0}};e._bin={readFixed:function(i,r){return(i[r]<<8|i[r+1])+(i[r+2]<<8|i[r+3])/65540},readF2dot14:function(i,r){return e._bin.readShort(i,r)/16384},readInt:function(i,r){return e._bin._view(i).getInt32(r)},readInt8:function(i,r){return e._bin._view(i).getInt8(r)},readShort:function(i,r){return e._bin._view(i).getInt16(r)},readUshort:function(i,r){return e._bin._view(i).getUint16(r)},readUshorts:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(e._bin.readUshort(i,r+2*l));return a},readUint:function(i,r){return e._bin._view(i).getUint32(r)},readUint64:function(i,r){return 4294967296*e._bin.readUint(i,r)+e._bin.readUint(i,r+4)},readASCII:function(i,r,o){for(var a="",l=0;l<o;l++)a+=String.fromCharCode(i[r+l]);return a},readUnicode:function(i,r,o){for(var a="",l=0;l<o;l++){var c=i[r++]<<8|i[r++];a+=String.fromCharCode(c)}return a},_tdec:typeof window<"u"&&window.TextDecoder?new window.TextDecoder:null,readUTF8:function(i,r,o){var a=e._bin._tdec;return a&&r==0&&o==i.length?a.decode(i):e._bin.readASCII(i,r,o)},readBytes:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(i[r+l]);return a},readASCIIArray:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(String.fromCharCode(i[r+l]));return a},_view:function(i){return i._dataView||(i._dataView=i.buffer?new DataView(i.buffer,i.byteOffset,i.byteLength):new DataView(new Uint8Array(i).buffer))}},e._lctf={},e._lctf.parse=function(i,r,o,a,l){var c=e._bin,h={},d=r;c.readFixed(i,r),r+=4;var u=c.readUshort(i,r);r+=2;var f=c.readUshort(i,r);r+=2;var g=c.readUshort(i,r);return r+=2,h.scriptList=e._lctf.readScriptList(i,d+u),h.featureList=e._lctf.readFeatureList(i,d+f),h.lookupList=e._lctf.readLookupList(i,d+g,l),h},e._lctf.readLookupList=function(i,r,o){var a=e._bin,l=r,c=[],h=a.readUshort(i,r);r+=2;for(var d=0;d<h;d++){var u=a.readUshort(i,r);r+=2;var f=e._lctf.readLookupTable(i,l+u,o);c.push(f)}return c},e._lctf.readLookupTable=function(i,r,o){var a=e._bin,l=r,c={tabs:[]};c.ltype=a.readUshort(i,r),r+=2,c.flag=a.readUshort(i,r),r+=2;var h=a.readUshort(i,r);r+=2;for(var d=c.ltype,u=0;u<h;u++){var f=a.readUshort(i,r);r+=2;var g=o(i,d,l+f,c);c.tabs.push(g)}return c},e._lctf.numOfOnes=function(i){for(var r=0,o=0;o<32;o++)i>>>o&1&&r++;return r},e._lctf.readClassDef=function(i,r){var o=e._bin,a=[],l=o.readUshort(i,r);if(r+=2,l==1){var c=o.readUshort(i,r);r+=2;var h=o.readUshort(i,r);r+=2;for(var d=0;d<h;d++)a.push(c+d),a.push(c+d),a.push(o.readUshort(i,r)),r+=2}if(l==2){var u=o.readUshort(i,r);for(r+=2,d=0;d<u;d++)a.push(o.readUshort(i,r)),r+=2,a.push(o.readUshort(i,r)),r+=2,a.push(o.readUshort(i,r)),r+=2}return a},e._lctf.getInterval=function(i,r){for(var o=0;o<i.length;o+=3){var a=i[o],l=i[o+1];if(i[o+2],a<=r&&r<=l)return o}return-1},e._lctf.readCoverage=function(i,r){var o=e._bin,a={};a.fmt=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);return r+=2,a.fmt==1&&(a.tab=o.readUshorts(i,r,l)),a.fmt==2&&(a.tab=o.readUshorts(i,r,3*l)),a},e._lctf.coverageIndex=function(i,r){var o=i.tab;if(i.fmt==1)return o.indexOf(r);if(i.fmt==2){var a=e._lctf.getInterval(o,r);if(a!=-1)return o[a+2]+(r-o[a])}return-1},e._lctf.readFeatureList=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=o.readASCII(i,r,4);r+=4;var u=o.readUshort(i,r);r+=2;var f=e._lctf.readFeatureTable(i,a+u);f.tag=d.trim(),l.push(f)}return l},e._lctf.readFeatureTable=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2,c>0&&(l.featureParams=a+c);var h=o.readUshort(i,r);r+=2,l.tab=[];for(var d=0;d<h;d++)l.tab.push(o.readUshort(i,r+2*d));return l},e._lctf.readScriptList=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=o.readASCII(i,r,4);r+=4;var u=o.readUshort(i,r);r+=2,l[d.trim()]=e._lctf.readScriptTable(i,a+u)}return l},e._lctf.readScriptTable=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2,c>0&&(l.default=e._lctf.readLangSysTable(i,a+c));var h=o.readUshort(i,r);r+=2;for(var d=0;d<h;d++){var u=o.readASCII(i,r,4);r+=4;var f=o.readUshort(i,r);r+=2,l[u.trim()]=e._lctf.readLangSysTable(i,a+f)}return l},e._lctf.readLangSysTable=function(i,r){var o=e._bin,a={};o.readUshort(i,r),r+=2,a.reqFeature=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);return r+=2,a.features=o.readUshorts(i,r,l),a},e.CFF={},e.CFF.parse=function(i,r,o){var a=e._bin;(i=new Uint8Array(i.buffer,r,o))[r=0],i[++r],i[++r],i[++r],r++;var l=[];r=e.CFF.readIndex(i,r,l);for(var c=[],h=0;h<l.length-1;h++)c.push(a.readASCII(i,r+l[h],l[h+1]-l[h]));r+=l[l.length-1];var d=[];r=e.CFF.readIndex(i,r,d);var u=[];for(h=0;h<d.length-1;h++)u.push(e.CFF.readDict(i,r+d[h],r+d[h+1]));r+=d[d.length-1];var f=u[0],g=[];r=e.CFF.readIndex(i,r,g);var _=[];for(h=0;h<g.length-1;h++)_.push(a.readASCII(i,r+g[h],g[h+1]-g[h]));if(r+=g[g.length-1],e.CFF.readSubrs(i,r,f),f.CharStrings){r=f.CharStrings,g=[],r=e.CFF.readIndex(i,r,g);var p=[];for(h=0;h<g.length-1;h++)p.push(a.readBytes(i,r+g[h],g[h+1]-g[h]));f.CharStrings=p}if(f.ROS){r=f.FDArray;var m=[];for(r=e.CFF.readIndex(i,r,m),f.FDArray=[],h=0;h<m.length-1;h++){var M=e.CFF.readDict(i,r+m[h],r+m[h+1]);e.CFF._readFDict(i,M,_),f.FDArray.push(M)}r+=m[m.length-1],r=f.FDSelect,f.FDSelect=[];var x=i[r];if(r++,x!=3)throw x;var E=a.readUshort(i,r);for(r+=2,h=0;h<E+1;h++)f.FDSelect.push(a.readUshort(i,r),i[r+2]),r+=3}return f.Encoding&&(f.Encoding=e.CFF.readEncoding(i,f.Encoding,f.CharStrings.length)),f.charset&&(f.charset=e.CFF.readCharset(i,f.charset,f.CharStrings.length)),e.CFF._readFDict(i,f,_),f},e.CFF._readFDict=function(i,r,o){var a;for(var l in r.Private&&(a=r.Private[1],r.Private=e.CFF.readDict(i,a,a+r.Private[0]),r.Private.Subrs&&e.CFF.readSubrs(i,a+r.Private.Subrs,r.Private)),r)["FamilyName","FontName","FullName","Notice","version","Copyright"].indexOf(l)!=-1&&(r[l]=o[r[l]-426+35])},e.CFF.readSubrs=function(i,r,o){var a=e._bin,l=[];r=e.CFF.readIndex(i,r,l);var c,h=l.length;c=h<1240?107:h<33900?1131:32768,o.Bias=c,o.Subrs=[];for(var d=0;d<l.length-1;d++)o.Subrs.push(a.readBytes(i,r+l[d],l[d+1]-l[d]))},e.CFF.tableSE=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,0,111,112,113,114,0,115,116,117,118,119,120,121,122,0,123,0,124,125,126,127,128,129,130,131,0,132,133,0,134,135,136,137,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,138,0,139,0,0,0,0,140,141,142,143,0,0,0,0,0,144,0,0,0,145,0,0,146,147,148,149,0,0,0,0],e.CFF.glyphByUnicode=function(i,r){for(var o=0;o<i.charset.length;o++)if(i.charset[o]==r)return o;return-1},e.CFF.glyphBySE=function(i,r){return r<0||r>255?-1:e.CFF.glyphByUnicode(i,e.CFF.tableSE[r])},e.CFF.readEncoding=function(i,r,o){e._bin;var a=[".notdef"],l=i[r];if(r++,l!=0)throw"error: unknown encoding format: "+l;var c=i[r];r++;for(var h=0;h<c;h++)a.push(i[r+h]);return a},e.CFF.readCharset=function(i,r,o){var a=e._bin,l=[".notdef"],c=i[r];if(r++,c==0)for(var h=0;h<o;h++){var d=a.readUshort(i,r);r+=2,l.push(d)}else{if(c!=1&&c!=2)throw"error: format: "+c;for(;l.length<o;){d=a.readUshort(i,r),r+=2;var u=0;for(c==1?(u=i[r],r++):(u=a.readUshort(i,r),r+=2),h=0;h<=u;h++)l.push(d),d++}}return l},e.CFF.readIndex=function(i,r,o){var a=e._bin,l=a.readUshort(i,r)+1,c=i[r+=2];if(r++,c==1)for(var h=0;h<l;h++)o.push(i[r+h]);else if(c==2)for(h=0;h<l;h++)o.push(a.readUshort(i,r+2*h));else if(c==3)for(h=0;h<l;h++)o.push(16777215&a.readUint(i,r+3*h-1));else if(l!=1)throw"unsupported offset size: "+c+", count: "+l;return(r+=l*c)-1},e.CFF.getCharString=function(i,r,o){var a=e._bin,l=i[r],c=i[r+1];i[r+2],i[r+3],i[r+4];var h=1,d=null,u=null;l<=20&&(d=l,h=1),l==12&&(d=100*l+c,h=2),21<=l&&l<=27&&(d=l,h=1),l==28&&(u=a.readShort(i,r+1),h=3),29<=l&&l<=31&&(d=l,h=1),32<=l&&l<=246&&(u=l-139,h=1),247<=l&&l<=250&&(u=256*(l-247)+c+108,h=2),251<=l&&l<=254&&(u=256*-(l-251)-c-108,h=2),l==255&&(u=a.readInt(i,r+1)/65535,h=5),o.val=u??"o"+d,o.size=h},e.CFF.readCharString=function(i,r,o){for(var a=r+o,l=e._bin,c=[];r<a;){var h=i[r],d=i[r+1];i[r+2],i[r+3],i[r+4];var u=1,f=null,g=null;h<=20&&(f=h,u=1),h==12&&(f=100*h+d,u=2),h!=19&&h!=20||(f=h,u=2),21<=h&&h<=27&&(f=h,u=1),h==28&&(g=l.readShort(i,r+1),u=3),29<=h&&h<=31&&(f=h,u=1),32<=h&&h<=246&&(g=h-139,u=1),247<=h&&h<=250&&(g=256*(h-247)+d+108,u=2),251<=h&&h<=254&&(g=256*-(h-251)-d-108,u=2),h==255&&(g=l.readInt(i,r+1)/65535,u=5),c.push(g??"o"+f),r+=u}return c},e.CFF.readDict=function(i,r,o){for(var a=e._bin,l={},c=[];r<o;){var h=i[r],d=i[r+1];i[r+2],i[r+3],i[r+4];var u=1,f=null,g=null;if(h==28&&(g=a.readShort(i,r+1),u=3),h==29&&(g=a.readInt(i,r+1),u=5),32<=h&&h<=246&&(g=h-139,u=1),247<=h&&h<=250&&(g=256*(h-247)+d+108,u=2),251<=h&&h<=254&&(g=256*-(h-251)-d-108,u=2),h==255)throw g=a.readInt(i,r+1)/65535,u=5,"unknown number";if(h==30){var _=[];for(u=1;;){var p=i[r+u];u++;var m=p>>4,M=15&p;if(m!=15&&_.push(m),M!=15&&_.push(M),M==15)break}for(var x="",E=[0,1,2,3,4,5,6,7,8,9,".","e","e-","reserved","-","endOfNumber"],R=0;R<_.length;R++)x+=E[_[R]];g=parseFloat(x)}h<=21&&(f=["version","Notice","FullName","FamilyName","Weight","FontBBox","BlueValues","OtherBlues","FamilyBlues","FamilyOtherBlues","StdHW","StdVW","escape","UniqueID","XUID","charset","Encoding","CharStrings","Private","Subrs","defaultWidthX","nominalWidthX"][h],u=1,h==12&&(f=["Copyright","isFixedPitch","ItalicAngle","UnderlinePosition","UnderlineThickness","PaintType","CharstringType","FontMatrix","StrokeWidth","BlueScale","BlueShift","BlueFuzz","StemSnapH","StemSnapV","ForceBold",0,0,"LanguageGroup","ExpansionFactor","initialRandomSeed","SyntheticBase","PostScript","BaseFontName","BaseFontBlend",0,0,0,0,0,0,"ROS","CIDFontVersion","CIDFontRevision","CIDFontType","CIDCount","UIDBase","FDArray","FDSelect","FontName"][d],u=2)),f!=null?(l[f]=c.length==1?c[0]:c,c=[]):c.push(g),r+=u}return l},e.cmap={},e.cmap.parse=function(i,r,o){i=new Uint8Array(i.buffer,r,o),r=0;var a=e._bin,l={};a.readUshort(i,r),r+=2;var c=a.readUshort(i,r);r+=2;var h=[];l.tables=[];for(var d=0;d<c;d++){var u=a.readUshort(i,r);r+=2;var f=a.readUshort(i,r);r+=2;var g=a.readUint(i,r);r+=4;var _="p"+u+"e"+f,p=h.indexOf(g);if(p==-1){var m;p=l.tables.length,h.push(g);var M=a.readUshort(i,g);M==0?m=e.cmap.parse0(i,g):M==4?m=e.cmap.parse4(i,g):M==6?m=e.cmap.parse6(i,g):M==12?m=e.cmap.parse12(i,g):console.debug("unknown format: "+M,u,f,g),l.tables.push(m)}if(l[_]!=null)throw"multiple tables for one platform+encoding";l[_]=p}return l},e.cmap.parse0=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2,a.map=[];for(var c=0;c<l-6;c++)a.map.push(i[r+c]);return a},e.cmap.parse4=function(i,r){var o=e._bin,a=r,l={};l.format=o.readUshort(i,r),r+=2;var c=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2;var h=o.readUshort(i,r);r+=2;var d=h/2;l.searchRange=o.readUshort(i,r),r+=2,l.entrySelector=o.readUshort(i,r),r+=2,l.rangeShift=o.readUshort(i,r),r+=2,l.endCount=o.readUshorts(i,r,d),r+=2*d,r+=2,l.startCount=o.readUshorts(i,r,d),r+=2*d,l.idDelta=[];for(var u=0;u<d;u++)l.idDelta.push(o.readShort(i,r)),r+=2;for(l.idRangeOffset=o.readUshorts(i,r,d),r+=2*d,l.glyphIdArray=[];r<a+c;)l.glyphIdArray.push(o.readUshort(i,r)),r+=2;return l},e.cmap.parse6=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,a.firstCode=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2,a.glyphIdArray=[];for(var c=0;c<l;c++)a.glyphIdArray.push(o.readUshort(i,r)),r+=2;return a},e.cmap.parse12=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2,r+=2,o.readUint(i,r),r+=4,o.readUint(i,r),r+=4;var l=o.readUint(i,r);r+=4,a.groups=[];for(var c=0;c<l;c++){var h=r+12*c,d=o.readUint(i,h+0),u=o.readUint(i,h+4),f=o.readUint(i,h+8);a.groups.push([d,u,f])}return a},e.glyf={},e.glyf.parse=function(i,r,o,a){for(var l=[],c=0;c<a.maxp.numGlyphs;c++)l.push(null);return l},e.glyf._parseGlyf=function(i,r){var o=e._bin,a=i._data,l=e._tabOffset(a,"glyf",i._offset)+i.loca[r];if(i.loca[r]==i.loca[r+1])return null;var c={};if(c.noc=o.readShort(a,l),l+=2,c.xMin=o.readShort(a,l),l+=2,c.yMin=o.readShort(a,l),l+=2,c.xMax=o.readShort(a,l),l+=2,c.yMax=o.readShort(a,l),l+=2,c.xMin>=c.xMax||c.yMin>=c.yMax)return null;if(c.noc>0){c.endPts=[];for(var h=0;h<c.noc;h++)c.endPts.push(o.readUshort(a,l)),l+=2;var d=o.readUshort(a,l);if(l+=2,a.length-l<d)return null;c.instructions=o.readBytes(a,l,d),l+=d;var u=c.endPts[c.noc-1]+1;for(c.flags=[],h=0;h<u;h++){var f=a[l];if(l++,c.flags.push(f),(8&f)!=0){var g=a[l];l++;for(var _=0;_<g;_++)c.flags.push(f),h++}}for(c.xs=[],h=0;h<u;h++){var p=(2&c.flags[h])!=0,m=(16&c.flags[h])!=0;p?(c.xs.push(m?a[l]:-a[l]),l++):m?c.xs.push(0):(c.xs.push(o.readShort(a,l)),l+=2)}for(c.ys=[],h=0;h<u;h++)p=(4&c.flags[h])!=0,m=(32&c.flags[h])!=0,p?(c.ys.push(m?a[l]:-a[l]),l++):m?c.ys.push(0):(c.ys.push(o.readShort(a,l)),l+=2);var M=0,x=0;for(h=0;h<u;h++)M+=c.xs[h],x+=c.ys[h],c.xs[h]=M,c.ys[h]=x}else{var E;c.parts=[];do{E=o.readUshort(a,l),l+=2;var R={m:{a:1,b:0,c:0,d:1,tx:0,ty:0},p1:-1,p2:-1};if(c.parts.push(R),R.glyphIndex=o.readUshort(a,l),l+=2,1&E){var w=o.readShort(a,l);l+=2;var T=o.readShort(a,l);l+=2}else w=o.readInt8(a,l),l++,T=o.readInt8(a,l),l++;2&E?(R.m.tx=w,R.m.ty=T):(R.p1=w,R.p2=T),8&E?(R.m.a=R.m.d=o.readF2dot14(a,l),l+=2):64&E?(R.m.a=o.readF2dot14(a,l),l+=2,R.m.d=o.readF2dot14(a,l),l+=2):128&E&&(R.m.a=o.readF2dot14(a,l),l+=2,R.m.b=o.readF2dot14(a,l),l+=2,R.m.c=o.readF2dot14(a,l),l+=2,R.m.d=o.readF2dot14(a,l),l+=2)}while(32&E);if(256&E){var U=o.readUshort(a,l);for(l+=2,c.instr=[],h=0;h<U;h++)c.instr.push(a[l]),l++}}return c},e.GDEF={},e.GDEF.parse=function(i,r,o,a){var l=r;r+=4;var c=e._bin.readUshort(i,r);return{glyphClassDef:c===0?null:e._lctf.readClassDef(i,l+c)}},e.GPOS={},e.GPOS.parse=function(i,r,o,a){return e._lctf.parse(i,r,o,a,e.GPOS.subt)},e.GPOS.subt=function(i,r,o,a){var l=e._bin,c=o,h={};if(h.fmt=l.readUshort(i,o),o+=2,r==1||r==2||r==3||r==7||r==8&&h.fmt<=2){var d=l.readUshort(i,o);o+=2,h.coverage=e._lctf.readCoverage(i,d+c)}if(r==1&&h.fmt==1){var u=l.readUshort(i,o);o+=2,u!=0&&(h.pos=e.GPOS.readValueRecord(i,o,u))}else if(r==2&&h.fmt>=1&&h.fmt<=2){u=l.readUshort(i,o),o+=2;var f=l.readUshort(i,o);o+=2;var g=e._lctf.numOfOnes(u),_=e._lctf.numOfOnes(f);if(h.fmt==1){h.pairsets=[];var p=l.readUshort(i,o);o+=2;for(var m=0;m<p;m++){var M=c+l.readUshort(i,o);o+=2;var x=l.readUshort(i,M);M+=2;for(var E=[],R=0;R<x;R++){var w=l.readUshort(i,M);M+=2,u!=0&&(P=e.GPOS.readValueRecord(i,M,u),M+=2*g),f!=0&&(I=e.GPOS.readValueRecord(i,M,f),M+=2*_),E.push({gid2:w,val1:P,val2:I})}h.pairsets.push(E)}}if(h.fmt==2){var T=l.readUshort(i,o);o+=2;var U=l.readUshort(i,o);o+=2;var y=l.readUshort(i,o);o+=2;var v=l.readUshort(i,o);for(o+=2,h.classDef1=e._lctf.readClassDef(i,c+T),h.classDef2=e._lctf.readClassDef(i,c+U),h.matrix=[],m=0;m<y;m++){var L=[];for(R=0;R<v;R++){var P=null,I=null;u!=0&&(P=e.GPOS.readValueRecord(i,o,u),o+=2*g),f!=0&&(I=e.GPOS.readValueRecord(i,o,f),o+=2*_),L.push({val1:P,val2:I})}h.matrix.push(L)}}}else if(r==4&&h.fmt==1)h.markCoverage=e._lctf.readCoverage(i,l.readUshort(i,o)+c),h.baseCoverage=e._lctf.readCoverage(i,l.readUshort(i,o+2)+c),h.markClassCount=l.readUshort(i,o+4),h.markArray=e.GPOS.readMarkArray(i,l.readUshort(i,o+6)+c),h.baseArray=e.GPOS.readBaseArray(i,l.readUshort(i,o+8)+c,h.markClassCount);else if(r==6&&h.fmt==1)h.mark1Coverage=e._lctf.readCoverage(i,l.readUshort(i,o)+c),h.mark2Coverage=e._lctf.readCoverage(i,l.readUshort(i,o+2)+c),h.markClassCount=l.readUshort(i,o+4),h.mark1Array=e.GPOS.readMarkArray(i,l.readUshort(i,o+6)+c),h.mark2Array=e.GPOS.readBaseArray(i,l.readUshort(i,o+8)+c,h.markClassCount);else{if(r==9&&h.fmt==1){var N=l.readUshort(i,o);o+=2;var W=l.readUint(i,o);if(o+=4,a.ltype==9)a.ltype=N;else if(a.ltype!=N)throw"invalid extension substitution";return e.GPOS.subt(i,a.ltype,c+W)}console.debug("unsupported GPOS table LookupType",r,"format",h.fmt)}return h},e.GPOS.readValueRecord=function(i,r,o){var a=e._bin,l=[];return l.push(1&o?a.readShort(i,r):0),r+=1&o?2:0,l.push(2&o?a.readShort(i,r):0),r+=2&o?2:0,l.push(4&o?a.readShort(i,r):0),r+=4&o?2:0,l.push(8&o?a.readShort(i,r):0),r+=8&o?2:0,l},e.GPOS.readBaseArray=function(i,r,o){var a=e._bin,l=[],c=r,h=a.readUshort(i,r);r+=2;for(var d=0;d<h;d++){for(var u=[],f=0;f<o;f++)u.push(e.GPOS.readAnchorRecord(i,c+a.readUshort(i,r))),r+=2;l.push(u)}return l},e.GPOS.readMarkArray=function(i,r){var o=e._bin,a=[],l=r,c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=e.GPOS.readAnchorRecord(i,o.readUshort(i,r+2)+l);d.markClass=o.readUshort(i,r),a.push(d),r+=4}return a},e.GPOS.readAnchorRecord=function(i,r){var o=e._bin,a={};return a.fmt=o.readUshort(i,r),a.x=o.readShort(i,r+2),a.y=o.readShort(i,r+4),a},e.GSUB={},e.GSUB.parse=function(i,r,o,a){return e._lctf.parse(i,r,o,a,e.GSUB.subt)},e.GSUB.subt=function(i,r,o,a){var l=e._bin,c=o,h={};if(h.fmt=l.readUshort(i,o),o+=2,r!=1&&r!=2&&r!=4&&r!=5&&r!=6)return null;if(r==1||r==2||r==4||r==5&&h.fmt<=2||r==6&&h.fmt<=2){var d=l.readUshort(i,o);o+=2,h.coverage=e._lctf.readCoverage(i,c+d)}if(r==1&&h.fmt>=1&&h.fmt<=2){if(h.fmt==1)h.delta=l.readShort(i,o),o+=2;else if(h.fmt==2){var u=l.readUshort(i,o);o+=2,h.newg=l.readUshorts(i,o,u),o+=2*h.newg.length}}else if(r==2&&h.fmt==1){u=l.readUshort(i,o),o+=2,h.seqs=[];for(var f=0;f<u;f++){var g=l.readUshort(i,o)+c;o+=2;var _=l.readUshort(i,g);h.seqs.push(l.readUshorts(i,g+2,_))}}else if(r==4)for(h.vals=[],u=l.readUshort(i,o),o+=2,f=0;f<u;f++){var p=l.readUshort(i,o);o+=2,h.vals.push(e.GSUB.readLigatureSet(i,c+p))}else if(r==5&&h.fmt==2){if(h.fmt==2){var m=l.readUshort(i,o);o+=2,h.cDef=e._lctf.readClassDef(i,c+m),h.scset=[];var M=l.readUshort(i,o);for(o+=2,f=0;f<M;f++){var x=l.readUshort(i,o);o+=2,h.scset.push(x==0?null:e.GSUB.readSubClassSet(i,c+x))}}}else if(r==6&&h.fmt==3){if(h.fmt==3){for(f=0;f<3;f++){u=l.readUshort(i,o),o+=2;for(var E=[],R=0;R<u;R++)E.push(e._lctf.readCoverage(i,c+l.readUshort(i,o+2*R)));o+=2*u,f==0&&(h.backCvg=E),f==1&&(h.inptCvg=E),f==2&&(h.ahedCvg=E)}u=l.readUshort(i,o),o+=2,h.lookupRec=e.GSUB.readSubstLookupRecords(i,o,u)}}else{if(r==7&&h.fmt==1){var w=l.readUshort(i,o);o+=2;var T=l.readUint(i,o);if(o+=4,a.ltype==9)a.ltype=w;else if(a.ltype!=w)throw"invalid extension substitution";return e.GSUB.subt(i,a.ltype,c+T)}console.debug("unsupported GSUB table LookupType",r,"format",h.fmt)}return h},e.GSUB.readSubClassSet=function(i,r){var o=e._bin.readUshort,a=r,l=[],c=o(i,r);r+=2;for(var h=0;h<c;h++){var d=o(i,r);r+=2,l.push(e.GSUB.readSubClassRule(i,a+d))}return l},e.GSUB.readSubClassRule=function(i,r){var o=e._bin.readUshort,a={},l=o(i,r),c=o(i,r+=2);r+=2,a.input=[];for(var h=0;h<l-1;h++)a.input.push(o(i,r)),r+=2;return a.substLookupRecords=e.GSUB.readSubstLookupRecords(i,r,c),a},e.GSUB.readSubstLookupRecords=function(i,r,o){for(var a=e._bin.readUshort,l=[],c=0;c<o;c++)l.push(a(i,r),a(i,r+2)),r+=4;return l},e.GSUB.readChainSubClassSet=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=o.readUshort(i,r);r+=2,l.push(e.GSUB.readChainSubClassRule(i,a+d))}return l},e.GSUB.readChainSubClassRule=function(i,r){for(var o=e._bin,a={},l=["backtrack","input","lookahead"],c=0;c<l.length;c++){var h=o.readUshort(i,r);r+=2,c==1&&h--,a[l[c]]=o.readUshorts(i,r,h),r+=2*a[l[c]].length}return h=o.readUshort(i,r),r+=2,a.subst=o.readUshorts(i,r,2*h),r+=2*a.subst.length,a},e.GSUB.readLigatureSet=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=o.readUshort(i,r);r+=2,l.push(e.GSUB.readLigature(i,a+d))}return l},e.GSUB.readLigature=function(i,r){var o=e._bin,a={chain:[]};a.nglyph=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2;for(var c=0;c<l-1;c++)a.chain.push(o.readUshort(i,r)),r+=2;return a},e.head={},e.head.parse=function(i,r,o){var a=e._bin,l={};return a.readFixed(i,r),r+=4,l.fontRevision=a.readFixed(i,r),r+=4,a.readUint(i,r),r+=4,a.readUint(i,r),r+=4,l.flags=a.readUshort(i,r),r+=2,l.unitsPerEm=a.readUshort(i,r),r+=2,l.created=a.readUint64(i,r),r+=8,l.modified=a.readUint64(i,r),r+=8,l.xMin=a.readShort(i,r),r+=2,l.yMin=a.readShort(i,r),r+=2,l.xMax=a.readShort(i,r),r+=2,l.yMax=a.readShort(i,r),r+=2,l.macStyle=a.readUshort(i,r),r+=2,l.lowestRecPPEM=a.readUshort(i,r),r+=2,l.fontDirectionHint=a.readShort(i,r),r+=2,l.indexToLocFormat=a.readShort(i,r),r+=2,l.glyphDataFormat=a.readShort(i,r),r+=2,l},e.hhea={},e.hhea.parse=function(i,r,o){var a=e._bin,l={};return a.readFixed(i,r),r+=4,l.ascender=a.readShort(i,r),r+=2,l.descender=a.readShort(i,r),r+=2,l.lineGap=a.readShort(i,r),r+=2,l.advanceWidthMax=a.readUshort(i,r),r+=2,l.minLeftSideBearing=a.readShort(i,r),r+=2,l.minRightSideBearing=a.readShort(i,r),r+=2,l.xMaxExtent=a.readShort(i,r),r+=2,l.caretSlopeRise=a.readShort(i,r),r+=2,l.caretSlopeRun=a.readShort(i,r),r+=2,l.caretOffset=a.readShort(i,r),r+=2,r+=8,l.metricDataFormat=a.readShort(i,r),r+=2,l.numberOfHMetrics=a.readUshort(i,r),r+=2,l},e.hmtx={},e.hmtx.parse=function(i,r,o,a){for(var l=e._bin,c={aWidth:[],lsBearing:[]},h=0,d=0,u=0;u<a.maxp.numGlyphs;u++)u<a.hhea.numberOfHMetrics&&(h=l.readUshort(i,r),r+=2,d=l.readShort(i,r),r+=2),c.aWidth.push(h),c.lsBearing.push(d);return c},e.kern={},e.kern.parse=function(i,r,o,a){var l=e._bin,c=l.readUshort(i,r);if(r+=2,c==1)return e.kern.parseV1(i,r-2,o,a);var h=l.readUshort(i,r);r+=2;for(var d={glyph1:[],rval:[]},u=0;u<h;u++){r+=2,o=l.readUshort(i,r),r+=2;var f=l.readUshort(i,r);r+=2;var g=f>>>8;if((g&=15)!=0)throw"unknown kern table format: "+g;r=e.kern.readFormat0(i,r,d)}return d},e.kern.parseV1=function(i,r,o,a){var l=e._bin;l.readFixed(i,r),r+=4;var c=l.readUint(i,r);r+=4;for(var h={glyph1:[],rval:[]},d=0;d<c;d++){l.readUint(i,r),r+=4;var u=l.readUshort(i,r);r+=2,l.readUshort(i,r),r+=2;var f=u>>>8;if((f&=15)!=0)throw"unknown kern table format: "+f;r=e.kern.readFormat0(i,r,h)}return h},e.kern.readFormat0=function(i,r,o){var a=e._bin,l=-1,c=a.readUshort(i,r);r+=2,a.readUshort(i,r),r+=2,a.readUshort(i,r),r+=2,a.readUshort(i,r),r+=2;for(var h=0;h<c;h++){var d=a.readUshort(i,r);r+=2;var u=a.readUshort(i,r);r+=2;var f=a.readShort(i,r);r+=2,d!=l&&(o.glyph1.push(d),o.rval.push({glyph2:[],vals:[]}));var g=o.rval[o.rval.length-1];g.glyph2.push(u),g.vals.push(f),l=d}return r},e.loca={},e.loca.parse=function(i,r,o,a){var l=e._bin,c=[],h=a.head.indexToLocFormat,d=a.maxp.numGlyphs+1;if(h==0)for(var u=0;u<d;u++)c.push(l.readUshort(i,r+(u<<1))<<1);if(h==1)for(u=0;u<d;u++)c.push(l.readUint(i,r+(u<<2)));return c},e.maxp={},e.maxp.parse=function(i,r,o){var a=e._bin,l={},c=a.readUint(i,r);return r+=4,l.numGlyphs=a.readUshort(i,r),r+=2,c==65536&&(l.maxPoints=a.readUshort(i,r),r+=2,l.maxContours=a.readUshort(i,r),r+=2,l.maxCompositePoints=a.readUshort(i,r),r+=2,l.maxCompositeContours=a.readUshort(i,r),r+=2,l.maxZones=a.readUshort(i,r),r+=2,l.maxTwilightPoints=a.readUshort(i,r),r+=2,l.maxStorage=a.readUshort(i,r),r+=2,l.maxFunctionDefs=a.readUshort(i,r),r+=2,l.maxInstructionDefs=a.readUshort(i,r),r+=2,l.maxStackElements=a.readUshort(i,r),r+=2,l.maxSizeOfInstructions=a.readUshort(i,r),r+=2,l.maxComponentElements=a.readUshort(i,r),r+=2,l.maxComponentDepth=a.readUshort(i,r),r+=2),l},e.name={},e.name.parse=function(i,r,o){var a=e._bin,l={};a.readUshort(i,r),r+=2;var c=a.readUshort(i,r);r+=2,a.readUshort(i,r);for(var h,d=["copyright","fontFamily","fontSubfamily","ID","fullName","version","postScriptName","trademark","manufacturer","designer","description","urlVendor","urlDesigner","licence","licenceURL","---","typoFamilyName","typoSubfamilyName","compatibleFull","sampleText","postScriptCID","wwsFamilyName","wwsSubfamilyName","lightPalette","darkPalette"],u=r+=2,f=0;f<c;f++){var g=a.readUshort(i,r);r+=2;var _=a.readUshort(i,r);r+=2;var p=a.readUshort(i,r);r+=2;var m=a.readUshort(i,r);r+=2;var M=a.readUshort(i,r);r+=2;var x=a.readUshort(i,r);r+=2;var E,R=d[m],w=u+12*c+x;if(g==0)E=a.readUnicode(i,w,M/2);else if(g==3&&_==0)E=a.readUnicode(i,w,M/2);else if(_==0)E=a.readASCII(i,w,M);else if(_==1)E=a.readUnicode(i,w,M/2);else if(_==3)E=a.readUnicode(i,w,M/2);else{if(g!=1)throw"unknown encoding "+_+", platformID: "+g;E=a.readASCII(i,w,M),console.debug("reading unknown MAC encoding "+_+" as ASCII")}var T="p"+g+","+p.toString(16);l[T]==null&&(l[T]={}),l[T][R!==void 0?R:m]=E,l[T]._lang=p}for(var U in l)if(l[U].postScriptName!=null&&l[U]._lang==1033)return l[U];for(var U in l)if(l[U].postScriptName!=null&&l[U]._lang==0)return l[U];for(var U in l)if(l[U].postScriptName!=null&&l[U]._lang==3084)return l[U];for(var U in l)if(l[U].postScriptName!=null)return l[U];for(var U in l){h=U;break}return console.debug("returning name table with languageID "+l[h]._lang),l[h]},e["OS/2"]={},e["OS/2"].parse=function(i,r,o){var a=e._bin.readUshort(i,r);r+=2;var l={};if(a==0)e["OS/2"].version0(i,r,l);else if(a==1)e["OS/2"].version1(i,r,l);else if(a==2||a==3||a==4)e["OS/2"].version2(i,r,l);else{if(a!=5)throw"unknown OS/2 table version: "+a;e["OS/2"].version5(i,r,l)}return l},e["OS/2"].version0=function(i,r,o){var a=e._bin;return o.xAvgCharWidth=a.readShort(i,r),r+=2,o.usWeightClass=a.readUshort(i,r),r+=2,o.usWidthClass=a.readUshort(i,r),r+=2,o.fsType=a.readUshort(i,r),r+=2,o.ySubscriptXSize=a.readShort(i,r),r+=2,o.ySubscriptYSize=a.readShort(i,r),r+=2,o.ySubscriptXOffset=a.readShort(i,r),r+=2,o.ySubscriptYOffset=a.readShort(i,r),r+=2,o.ySuperscriptXSize=a.readShort(i,r),r+=2,o.ySuperscriptYSize=a.readShort(i,r),r+=2,o.ySuperscriptXOffset=a.readShort(i,r),r+=2,o.ySuperscriptYOffset=a.readShort(i,r),r+=2,o.yStrikeoutSize=a.readShort(i,r),r+=2,o.yStrikeoutPosition=a.readShort(i,r),r+=2,o.sFamilyClass=a.readShort(i,r),r+=2,o.panose=a.readBytes(i,r,10),r+=10,o.ulUnicodeRange1=a.readUint(i,r),r+=4,o.ulUnicodeRange2=a.readUint(i,r),r+=4,o.ulUnicodeRange3=a.readUint(i,r),r+=4,o.ulUnicodeRange4=a.readUint(i,r),r+=4,o.achVendID=[a.readInt8(i,r),a.readInt8(i,r+1),a.readInt8(i,r+2),a.readInt8(i,r+3)],r+=4,o.fsSelection=a.readUshort(i,r),r+=2,o.usFirstCharIndex=a.readUshort(i,r),r+=2,o.usLastCharIndex=a.readUshort(i,r),r+=2,o.sTypoAscender=a.readShort(i,r),r+=2,o.sTypoDescender=a.readShort(i,r),r+=2,o.sTypoLineGap=a.readShort(i,r),r+=2,o.usWinAscent=a.readUshort(i,r),r+=2,o.usWinDescent=a.readUshort(i,r),r+=2},e["OS/2"].version1=function(i,r,o){var a=e._bin;return r=e["OS/2"].version0(i,r,o),o.ulCodePageRange1=a.readUint(i,r),r+=4,o.ulCodePageRange2=a.readUint(i,r),r+=4},e["OS/2"].version2=function(i,r,o){var a=e._bin;return r=e["OS/2"].version1(i,r,o),o.sxHeight=a.readShort(i,r),r+=2,o.sCapHeight=a.readShort(i,r),r+=2,o.usDefault=a.readUshort(i,r),r+=2,o.usBreak=a.readUshort(i,r),r+=2,o.usMaxContext=a.readUshort(i,r),r+=2},e["OS/2"].version5=function(i,r,o){var a=e._bin;return r=e["OS/2"].version2(i,r,o),o.usLowerOpticalPointSize=a.readUshort(i,r),r+=2,o.usUpperOpticalPointSize=a.readUshort(i,r),r+=2},e.post={},e.post.parse=function(i,r,o){var a=e._bin,l={};return l.version=a.readFixed(i,r),r+=4,l.italicAngle=a.readFixed(i,r),r+=4,l.underlinePosition=a.readShort(i,r),r+=2,l.underlineThickness=a.readShort(i,r),r+=2,l},e==null&&(e={}),e.U==null&&(e.U={}),e.U.codeToGlyph=function(i,r){var o=i.cmap,a=-1;if(o.p0e4!=null?a=o.p0e4:o.p3e1!=null?a=o.p3e1:o.p1e0!=null?a=o.p1e0:o.p0e3!=null&&(a=o.p0e3),a==-1)throw"no familiar platform and encoding!";var l=o.tables[a];if(l.format==0)return r>=l.map.length?0:l.map[r];if(l.format==4){for(var c=-1,h=0;h<l.endCount.length;h++)if(r<=l.endCount[h]){c=h;break}return c==-1||l.startCount[c]>r?0:65535&(l.idRangeOffset[c]!=0?l.glyphIdArray[r-l.startCount[c]+(l.idRangeOffset[c]>>1)-(l.idRangeOffset.length-c)]:r+l.idDelta[c])}if(l.format==12){if(r>l.groups[l.groups.length-1][1])return 0;for(h=0;h<l.groups.length;h++){var d=l.groups[h];if(d[0]<=r&&r<=d[1])return d[2]+(r-d[0])}return 0}throw"unknown cmap table format "+l.format},e.U.glyphToPath=function(i,r){var o={cmds:[],crds:[]};if(i.SVG&&i.SVG.entries[r]){var a=i.SVG.entries[r];return a==null?o:(typeof a=="string"&&(a=e.SVG.toPath(a),i.SVG.entries[r]=a),a)}if(i.CFF){var l={x:0,y:0,stack:[],nStems:0,haveWidth:!1,width:i.CFF.Private?i.CFF.Private.defaultWidthX:0,open:!1},c=i.CFF,h=i.CFF.Private;if(c.ROS){for(var d=0;c.FDSelect[d+2]<=r;)d+=2;h=c.FDArray[c.FDSelect[d+1]].Private}e.U._drawCFF(i.CFF.CharStrings[r],l,c,h,o)}else i.glyf&&e.U._drawGlyf(r,i,o);return o},e.U._drawGlyf=function(i,r,o){var a=r.glyf[i];a==null&&(a=r.glyf[i]=e.glyf._parseGlyf(r,i)),a!=null&&(a.noc>-1?e.U._simpleGlyph(a,o):e.U._compoGlyph(a,r,o))},e.U._simpleGlyph=function(i,r){for(var o=0;o<i.noc;o++){for(var a=o==0?0:i.endPts[o-1]+1,l=i.endPts[o],c=a;c<=l;c++){var h=c==a?l:c-1,d=c==l?a:c+1,u=1&i.flags[c],f=1&i.flags[h],g=1&i.flags[d],_=i.xs[c],p=i.ys[c];if(c==a)if(u){if(!f){e.U.P.moveTo(r,_,p);continue}e.U.P.moveTo(r,i.xs[h],i.ys[h])}else f?e.U.P.moveTo(r,i.xs[h],i.ys[h]):e.U.P.moveTo(r,(i.xs[h]+_)/2,(i.ys[h]+p)/2);u?f&&e.U.P.lineTo(r,_,p):g?e.U.P.qcurveTo(r,_,p,i.xs[d],i.ys[d]):e.U.P.qcurveTo(r,_,p,(_+i.xs[d])/2,(p+i.ys[d])/2)}e.U.P.closePath(r)}},e.U._compoGlyph=function(i,r,o){for(var a=0;a<i.parts.length;a++){var l={cmds:[],crds:[]},c=i.parts[a];e.U._drawGlyf(c.glyphIndex,r,l);for(var h=c.m,d=0;d<l.crds.length;d+=2){var u=l.crds[d],f=l.crds[d+1];o.crds.push(u*h.a+f*h.b+h.tx),o.crds.push(u*h.c+f*h.d+h.ty)}for(d=0;d<l.cmds.length;d++)o.cmds.push(l.cmds[d])}},e.U._getGlyphClass=function(i,r){var o=e._lctf.getInterval(r,i);return o==-1?0:r[o+2]},e.U._applySubs=function(i,r,o,a){for(var l=i.length-r-1,c=0;c<o.tabs.length;c++)if(o.tabs[c]!=null){var h,d=o.tabs[c];if(!d.coverage||(h=e._lctf.coverageIndex(d.coverage,i[r]))!=-1){if(o.ltype==1)i[r],d.fmt==1?i[r]=i[r]+d.delta:i[r]=d.newg[h];else if(o.ltype==4)for(var u=d.vals[h],f=0;f<u.length;f++){var g=u[f],_=g.chain.length;if(!(_>l)){for(var p=!0,m=0,M=0;M<_;M++){for(;i[r+m+(1+M)]==-1;)m++;g.chain[M]!=i[r+m+(1+M)]&&(p=!1)}if(p){for(i[r]=g.nglyph,M=0;M<_+m;M++)i[r+M+1]=-1;break}}}else if(o.ltype==5&&d.fmt==2)for(var x=e._lctf.getInterval(d.cDef,i[r]),E=d.cDef[x+2],R=d.scset[E],w=0;w<R.length;w++){var T=R[w],U=T.input;if(!(U.length>l)){for(p=!0,M=0;M<U.length;M++){var y=e._lctf.getInterval(d.cDef,i[r+1+M]);if(x==-1&&d.cDef[y+2]!=U[M]){p=!1;break}}if(p){var v=T.substLookupRecords;for(f=0;f<v.length;f+=2)v[f],v[f+1]}}}else if(o.ltype==6&&d.fmt==3){if(!e.U._glsCovered(i,d.backCvg,r-d.backCvg.length)||!e.U._glsCovered(i,d.inptCvg,r)||!e.U._glsCovered(i,d.ahedCvg,r+d.inptCvg.length))continue;var L=d.lookupRec;for(w=0;w<L.length;w+=2){x=L[w];var P=a[L[w+1]];e.U._applySubs(i,r+x,P,a)}}}}},e.U._glsCovered=function(i,r,o){for(var a=0;a<r.length;a++)if(e._lctf.coverageIndex(r[a],i[o+a])==-1)return!1;return!0},e.U.glyphsToPath=function(i,r,o){for(var a={cmds:[],crds:[]},l=0,c=0;c<r.length;c++){var h=r[c];if(h!=-1){for(var d=c<r.length-1&&r[c+1]!=-1?r[c+1]:0,u=e.U.glyphToPath(i,h),f=0;f<u.crds.length;f+=2)a.crds.push(u.crds[f]+l),a.crds.push(u.crds[f+1]);for(o&&a.cmds.push(o),f=0;f<u.cmds.length;f++)a.cmds.push(u.cmds[f]);o&&a.cmds.push("X"),l+=i.hmtx.aWidth[h],c<r.length-1&&(l+=e.U.getPairAdjustment(i,h,d))}}return a},e.U.P={},e.U.P.moveTo=function(i,r,o){i.cmds.push("M"),i.crds.push(r,o)},e.U.P.lineTo=function(i,r,o){i.cmds.push("L"),i.crds.push(r,o)},e.U.P.curveTo=function(i,r,o,a,l,c,h){i.cmds.push("C"),i.crds.push(r,o,a,l,c,h)},e.U.P.qcurveTo=function(i,r,o,a,l){i.cmds.push("Q"),i.crds.push(r,o,a,l)},e.U.P.closePath=function(i){i.cmds.push("Z")},e.U._drawCFF=function(i,r,o,a,l){for(var c=r.stack,h=r.nStems,d=r.haveWidth,u=r.width,f=r.open,g=0,_=r.x,p=r.y,m=0,M=0,x=0,E=0,R=0,w=0,T=0,U=0,y=0,v=0,L={val:0,size:0};g<i.length;){e.CFF.getCharString(i,g,L);var P=L.val;if(g+=L.size,P=="o1"||P=="o18")c.length%2!=0&&!d&&(u=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,d=!0;else if(P=="o3"||P=="o23")c.length%2!=0&&!d&&(u=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,d=!0;else if(P=="o4")c.length>1&&!d&&(u=c.shift()+a.nominalWidthX,d=!0),f&&e.U.P.closePath(l),p+=c.pop(),e.U.P.moveTo(l,_,p),f=!0;else if(P=="o5")for(;c.length>0;)_+=c.shift(),p+=c.shift(),e.U.P.lineTo(l,_,p);else if(P=="o6"||P=="o7")for(var I=c.length,N=P=="o6",W=0;W<I;W++){var k=c.shift();N?_+=k:p+=k,N=!N,e.U.P.lineTo(l,_,p)}else if(P=="o8"||P=="o24"){I=c.length;for(var se=0;se+6<=I;)m=_+c.shift(),M=p+c.shift(),x=m+c.shift(),E=M+c.shift(),_=x+c.shift(),p=E+c.shift(),e.U.P.curveTo(l,m,M,x,E,_,p),se+=6;P=="o24"&&(_+=c.shift(),p+=c.shift(),e.U.P.lineTo(l,_,p))}else{if(P=="o11")break;if(P=="o1234"||P=="o1235"||P=="o1236"||P=="o1237")P=="o1234"&&(M=p,x=(m=_+c.shift())+c.shift(),v=E=M+c.shift(),w=E,U=p,_=(T=(R=(y=x+c.shift())+c.shift())+c.shift())+c.shift(),e.U.P.curveTo(l,m,M,x,E,y,v),e.U.P.curveTo(l,R,w,T,U,_,p)),P=="o1235"&&(m=_+c.shift(),M=p+c.shift(),x=m+c.shift(),E=M+c.shift(),y=x+c.shift(),v=E+c.shift(),R=y+c.shift(),w=v+c.shift(),T=R+c.shift(),U=w+c.shift(),_=T+c.shift(),p=U+c.shift(),c.shift(),e.U.P.curveTo(l,m,M,x,E,y,v),e.U.P.curveTo(l,R,w,T,U,_,p)),P=="o1236"&&(m=_+c.shift(),M=p+c.shift(),x=m+c.shift(),v=E=M+c.shift(),w=E,T=(R=(y=x+c.shift())+c.shift())+c.shift(),U=w+c.shift(),_=T+c.shift(),e.U.P.curveTo(l,m,M,x,E,y,v),e.U.P.curveTo(l,R,w,T,U,_,p)),P=="o1237"&&(m=_+c.shift(),M=p+c.shift(),x=m+c.shift(),E=M+c.shift(),y=x+c.shift(),v=E+c.shift(),R=y+c.shift(),w=v+c.shift(),T=R+c.shift(),U=w+c.shift(),Math.abs(T-_)>Math.abs(U-p)?_=T+c.shift():p=U+c.shift(),e.U.P.curveTo(l,m,M,x,E,y,v),e.U.P.curveTo(l,R,w,T,U,_,p));else if(P=="o14"){if(c.length>0&&!d&&(u=c.shift()+o.nominalWidthX,d=!0),c.length==4){var j=c.shift(),K=c.shift(),q=c.shift(),F=c.shift(),H=e.CFF.glyphBySE(o,q),ne=e.CFF.glyphBySE(o,F);e.U._drawCFF(o.CharStrings[H],r,o,a,l),r.x=j,r.y=K,e.U._drawCFF(o.CharStrings[ne],r,o,a,l)}f&&(e.U.P.closePath(l),f=!1)}else if(P=="o19"||P=="o20")c.length%2!=0&&!d&&(u=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,d=!0,g+=h+7>>3;else if(P=="o21")c.length>2&&!d&&(u=c.shift()+a.nominalWidthX,d=!0),p+=c.pop(),_+=c.pop(),f&&e.U.P.closePath(l),e.U.P.moveTo(l,_,p),f=!0;else if(P=="o22")c.length>1&&!d&&(u=c.shift()+a.nominalWidthX,d=!0),_+=c.pop(),f&&e.U.P.closePath(l),e.U.P.moveTo(l,_,p),f=!0;else if(P=="o25"){for(;c.length>6;)_+=c.shift(),p+=c.shift(),e.U.P.lineTo(l,_,p);m=_+c.shift(),M=p+c.shift(),x=m+c.shift(),E=M+c.shift(),_=x+c.shift(),p=E+c.shift(),e.U.P.curveTo(l,m,M,x,E,_,p)}else if(P=="o26")for(c.length%2&&(_+=c.shift());c.length>0;)m=_,M=p+c.shift(),_=x=m+c.shift(),p=(E=M+c.shift())+c.shift(),e.U.P.curveTo(l,m,M,x,E,_,p);else if(P=="o27")for(c.length%2&&(p+=c.shift());c.length>0;)M=p,x=(m=_+c.shift())+c.shift(),E=M+c.shift(),_=x+c.shift(),p=E,e.U.P.curveTo(l,m,M,x,E,_,p);else if(P=="o10"||P=="o29"){var O=P=="o10"?a:o;if(c.length==0)console.debug("error: empty stack");else{var B=c.pop(),te=O.Subrs[B+O.Bias];r.x=_,r.y=p,r.nStems=h,r.haveWidth=d,r.width=u,r.open=f,e.U._drawCFF(te,r,o,a,l),_=r.x,p=r.y,h=r.nStems,d=r.haveWidth,u=r.width,f=r.open}}else if(P=="o30"||P=="o31"){var G=c.length,ae=(se=0,P=="o31");for(se+=G-(I=-3&G);se<I;)ae?(M=p,x=(m=_+c.shift())+c.shift(),p=(E=M+c.shift())+c.shift(),I-se==5?(_=x+c.shift(),se++):_=x,ae=!1):(m=_,M=p+c.shift(),x=m+c.shift(),E=M+c.shift(),_=x+c.shift(),I-se==5?(p=E+c.shift(),se++):p=E,ae=!0),e.U.P.curveTo(l,m,M,x,E,_,p),se+=4}else{if((P+"").charAt(0)=="o")throw console.debug("Unknown operation: "+P,i),P;c.push(P)}}}r.x=_,r.y=p,r.nStems=h,r.haveWidth=d,r.width=u,r.open=f};var t=e,n={Typr:t};return s.Typr=t,s.default=n,Object.defineProperty(s,"__esModule",{value:!0}),s}({}).Typr}/*!
Custom bundle of woff2otf (https://github.com/arty-name/woff2otf) with fflate
(https://github.com/101arrowz/fflate) for use in Troika text rendering. 
Original licenses apply: 
- fflate: https://github.com/101arrowz/fflate/blob/master/LICENSE (MIT)
- woff2otf.js: https://github.com/arty-name/woff2otf/blob/master/woff2otf.js (Apache2)
*/function Mv(){return function(s){var e=Uint8Array,t=Uint16Array,n=Uint32Array,i=new e([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),r=new e([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),o=new e([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(P,I){for(var N=new t(31),W=0;W<31;++W)N[W]=I+=1<<P[W-1];var k=new n(N[30]);for(W=1;W<30;++W)for(var se=N[W];se<N[W+1];++se)k[se]=se-N[W]<<5|W;return[N,k]},l=a(i,2),c=l[0],h=l[1];c[28]=258,h[258]=28;for(var d=a(r,0)[0],u=new t(32768),f=0;f<32768;++f){var g=(43690&f)>>>1|(21845&f)<<1;g=(61680&(g=(52428&g)>>>2|(13107&g)<<2))>>>4|(3855&g)<<4,u[f]=((65280&g)>>>8|(255&g)<<8)>>>1}var _=function(P,I,N){for(var W=P.length,k=0,se=new t(I);k<W;++k)++se[P[k]-1];var j,K=new t(I);for(k=0;k<I;++k)K[k]=K[k-1]+se[k-1]<<1;{j=new t(1<<I);var q=15-I;for(k=0;k<W;++k)if(P[k])for(var F=k<<4|P[k],H=I-P[k],ne=K[P[k]-1]++<<H,O=ne|(1<<H)-1;ne<=O;++ne)j[u[ne]>>>q]=F}return j},p=new e(288);for(f=0;f<144;++f)p[f]=8;for(f=144;f<256;++f)p[f]=9;for(f=256;f<280;++f)p[f]=7;for(f=280;f<288;++f)p[f]=8;var m=new e(32);for(f=0;f<32;++f)m[f]=5;var M=_(p,9),x=_(m,5),E=function(P){for(var I=P[0],N=1;N<P.length;++N)P[N]>I&&(I=P[N]);return I},R=function(P,I,N){var W=I/8|0;return(P[W]|P[W+1]<<8)>>(7&I)&N},w=function(P,I){var N=I/8|0;return(P[N]|P[N+1]<<8|P[N+2]<<16)>>(7&I)},T=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],U=function(P,I,N){var W=new Error(I||T[P]);if(W.code=P,Error.captureStackTrace&&Error.captureStackTrace(W,U),!N)throw W;return W},y=function(P,I,N){var W=P.length;if(!W||N&&!N.l&&W<5)return I||new e(0);var k=!I||N,se=!N||N.i;N||(N={}),I||(I=new e(3*W));var j,K=function(xe){var Ne=I.length;if(xe>Ne){var We=new e(Math.max(2*Ne,xe));We.set(I),I=We}},q=N.f||0,F=N.p||0,H=N.b||0,ne=N.l,O=N.d,B=N.m,te=N.n,G=8*W;do{if(!ne){N.f=q=R(P,F,1);var ae=R(P,F+1,3);if(F+=3,!ae){var pe=P[(C=((j=F)/8|0)+(7&j&&1)+4)-4]|P[C-3]<<8,ve=C+pe;if(ve>W){se&&U(0);break}k&&K(H+pe),I.set(P.subarray(C,ve),H),N.b=H+=pe,N.p=F=8*ve;continue}if(ae==1)ne=M,O=x,B=9,te=5;else if(ae==2){var D=R(P,F,31)+257,he=R(P,F+10,15)+4,Pe=D+R(P,F+5,31)+1;F+=14;for(var Ue=new e(Pe),fe=new e(19),ye=0;ye<he;++ye)fe[o[ye]]=R(P,F+3*ye,7);F+=3*he;var Me=E(fe),de=(1<<Me)-1,Ce=_(fe,Me);for(ye=0;ye<Pe;){var C,S=Ce[R(P,F,de)];if(F+=15&S,(C=S>>>4)<16)Ue[ye++]=C;else{var X=0,Z=0;for(C==16?(Z=3+R(P,F,3),F+=2,X=Ue[ye-1]):C==17?(Z=3+R(P,F,7),F+=3):C==18&&(Z=11+R(P,F,127),F+=7);Z--;)Ue[ye++]=X}}var ie=Ue.subarray(0,D),Q=Ue.subarray(D);B=E(ie),te=E(Q),ne=_(ie,B),O=_(Q,te)}else U(1);if(F>G){se&&U(0);break}}k&&K(H+131072);for(var Te=(1<<B)-1,le=(1<<te)-1,ce=F;;ce=F){var Se=(X=ne[w(P,F)&Te])>>>4;if((F+=15&X)>G){se&&U(0);break}if(X||U(2),Se<256)I[H++]=Se;else{if(Se==256){ce=F,ne=null;break}var ue=Se-254;if(Se>264){var be=i[ye=Se-257];ue=R(P,F,(1<<be)-1)+c[ye],F+=be}var Be=O[w(P,F)&le],we=Be>>>4;if(Be||U(3),F+=15&Be,Q=d[we],we>3&&(be=r[we],Q+=w(P,F)&(1<<be)-1,F+=be),F>G){se&&U(0);break}k&&K(H+131072);for(var me=H+ue;H<me;H+=4)I[H]=I[H-Q],I[H+1]=I[H+1-Q],I[H+2]=I[H+2-Q],I[H+3]=I[H+3-Q];H=me}}N.l=ne,N.p=ce,N.b=H,ne&&(q=1,N.m=B,N.d=O,N.n=te)}while(!q);return H==I.length?I:function(xe,Ne,We){(We==null||We>xe.length)&&(We=xe.length);var b=new(xe instanceof t?t:xe instanceof n?n:e)(We-Ne);return b.set(xe.subarray(Ne,We)),b}(I,0,H)},v=new e(0),L=typeof TextDecoder<"u"&&new TextDecoder;try{L.decode(v,{stream:!0})}catch{}return s.convert_streams=function(P){var I=new DataView(P),N=0;function W(){var D=I.getUint16(N);return N+=2,D}function k(){var D=I.getUint32(N);return N+=4,D}function se(D){pe.setUint16(ve,D),ve+=2}function j(D){pe.setUint32(ve,D),ve+=4}for(var K={signature:k(),flavor:k(),length:k(),numTables:W(),reserved:W(),totalSfntSize:k(),majorVersion:W(),minorVersion:W(),metaOffset:k(),metaLength:k(),metaOrigLength:k(),privOffset:k(),privLength:k()},q=0;Math.pow(2,q)<=K.numTables;)q++;q--;for(var F=16*Math.pow(2,q),H=16*K.numTables-F,ne=12,O=[],B=0;B<K.numTables;B++)O.push({tag:k(),offset:k(),compLength:k(),origLength:k(),origChecksum:k()}),ne+=16;var te,G=new Uint8Array(12+16*O.length+O.reduce(function(D,he){return D+he.origLength+4},0)),ae=G.buffer,pe=new DataView(ae),ve=0;return j(K.flavor),se(K.numTables),se(F),se(q),se(H),O.forEach(function(D){j(D.tag),j(D.origChecksum),j(ne),j(D.origLength),D.outOffset=ne,(ne+=D.origLength)%4!=0&&(ne+=4-ne%4)}),O.forEach(function(D){var he,Pe=P.slice(D.offset,D.offset+D.compLength);if(D.compLength!=D.origLength){var Ue=new Uint8Array(D.origLength);he=new Uint8Array(Pe,2),y(he,Ue)}else Ue=new Uint8Array(Pe);G.set(Ue,D.outOffset);var fe=0;(ne=D.outOffset+D.origLength)%4!=0&&(fe=4-ne%4),G.set(new Uint8Array(fe).buffer,D.outOffset+D.origLength),te=ne+fe}),ae.slice(0,te)},Object.defineProperty(s,"__esModule",{value:!0}),s}({}).convert_streams}function bv(s,e){const t={M:2,L:2,Q:4,C:6,Z:0},n={C:"18g,ca,368,1kz",D:"17k,6,2,2+4,5+c,2+6,2+1,10+1,9+f,j+11,2+1,a,2,2+1,15+2,3,j+2,6+3,2+8,2,2,2+1,w+a,4+e,3+3,2,3+2,3+5,23+w,2f+4,3,2+9,2,b,2+3,3,1k+9,6+1,3+1,2+2,2+d,30g,p+y,1,1+1g,f+x,2,sd2+1d,jf3+4,f+3,2+4,2+2,b+3,42,2,4+2,2+1,2,3,t+1,9f+w,2,el+2,2+g,d+2,2l,2+1,5,3+1,2+1,2,3,6,16wm+1v",R:"17m+3,2,2,6+3,m,15+2,2+2,h+h,13,3+8,2,2,3+1,2,p+1,x,5+4,5,a,2,2,3,u,c+2,g+1,5,2+1,4+1,5j,6+1,2,b,2+2,f,2+1,1s+2,2,3+1,7,1ez0,2,2+1,4+4,b,4,3,b,42,2+2,4,3,2+1,2,o+3,ae,ep,x,2o+2,3+1,3,5+1,6",L:"x9u,jff,a,fd,jv",T:"4t,gj+33,7o+4,1+1,7c+18,2,2+1,2+1,2,21+a,2,1b+k,h,2u+6,3+5,3+1,2+3,y,2,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,3,7,6+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+d,1,1+1,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,ek,3+1,r+4,1e+4,6+5,2p+c,1+3,1,1+2,1+b,2db+2,3y,2p+v,ff+3,30+1,n9x,1+2,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,5s,6y+2,ea,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+9,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2,2b+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,470+8,at4+4,1o+6,t5,1s+3,2a,f5l+1,2+3,43o+2,a+7,1+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,1,gzau,v+2n,3l+6n"},i=1,r=2,o=4,a=8,l=16,c=32;let h;function d(T){if(!h){const U={R:r,L:i,D:o,C:l,U:c,T:a};h=new Map;for(let y in n){let v=0;n[y].split(",").forEach(L=>{let[P,I]=L.split("+");P=parseInt(P,36),I=I?parseInt(I,36):0,h.set(v+=P,U[y]);for(let N=I;N--;)h.set(++v,U[y])})}}return h.get(T)||c}const u=1,f=2,g=3,_=4,p=[null,"isol","init","fina","medi"];function m(T){const U=new Uint8Array(T.length);let y=c,v=u,L=-1;for(let P=0;P<T.length;P++){const I=T.codePointAt(P);let N=d(I)|0,W=u;N&a||(y&(i|o|l)?N&(r|o|l)?(W=g,(v===u||v===g)&&U[L]++):N&(i|c)&&(v===f||v===_)&&U[L]--:y&(r|c)&&(v===f||v===_)&&U[L]--,v=U[P]=W,y=N,L=P,I>65535&&P++)}return U}function M(T,U){const y=[];for(let L=0;L<U.length;L++){const P=U.codePointAt(L);P>65535&&L++,y.push(s.U.codeToGlyph(T,P))}const v=T.GSUB;if(v){const{lookupList:L,featureList:P}=v;let I;const N=/^(rlig|liga|mset|isol|init|fina|medi|half|pres|blws|ccmp)$/,W=[];P.forEach(k=>{if(N.test(k.tag))for(let se=0;se<k.tab.length;se++){if(W[k.tab[se]])continue;W[k.tab[se]]=!0;const j=L[k.tab[se]],K=/^(isol|init|fina|medi)$/.test(k.tag);K&&!I&&(I=m(U));for(let q=0;q<y.length;q++)(!I||!K||p[I[q]]===k.tag)&&s.U._applySubs(y,q,j,L)}})}return y}function x(T,U){const y=new Int16Array(U.length*3);let v=0;for(;v<U.length;v++){const N=U[v];if(N===-1)continue;y[v*3+2]=T.hmtx.aWidth[N];const W=T.GPOS;if(W){const k=W.lookupList;for(let se=0;se<k.length;se++){const j=k[se];for(let K=0;K<j.tabs.length;K++){const q=j.tabs[K];if(j.ltype===1){if(s._lctf.coverageIndex(q.coverage,N)!==-1&&q.pos){I(q.pos,v);break}}else if(j.ltype===2){let F=null,H=L();if(H!==-1){const ne=s._lctf.coverageIndex(q.coverage,U[H]);if(ne!==-1){if(q.fmt===1){const O=q.pairsets[ne];for(let B=0;B<O.length;B++)O[B].gid2===N&&(F=O[B])}else if(q.fmt===2){const O=s.U._getGlyphClass(U[H],q.classDef1),B=s.U._getGlyphClass(N,q.classDef2);F=q.matrix[O][B]}if(F){F.val1&&I(F.val1,H),F.val2&&I(F.val2,v);break}}}}else if(j.ltype===4){const F=s._lctf.coverageIndex(q.markCoverage,N);if(F!==-1){const H=L(P),ne=H===-1?-1:s._lctf.coverageIndex(q.baseCoverage,U[H]);if(ne!==-1){const O=q.markArray[F],B=q.baseArray[ne][O.markClass];y[v*3]=B.x-O.x+y[H*3]-y[H*3+2],y[v*3+1]=B.y-O.y+y[H*3+1];break}}}else if(j.ltype===6){const F=s._lctf.coverageIndex(q.mark1Coverage,N);if(F!==-1){const H=L();if(H!==-1){const ne=U[H];if(E(T,ne)===3){const O=s._lctf.coverageIndex(q.mark2Coverage,ne);if(O!==-1){const B=q.mark1Array[F],te=q.mark2Array[O][B.markClass];y[v*3]=te.x-B.x+y[H*3]-y[H*3+2],y[v*3+1]=te.y-B.y+y[H*3+1];break}}}}}}}}else if(T.kern&&!T.cff){const k=L();if(k!==-1){const se=T.kern.glyph1.indexOf(U[k]);if(se!==-1){const j=T.kern.rval[se].glyph2.indexOf(N);j!==-1&&(y[k*3+2]+=T.kern.rval[se].vals[j])}}}}return y;function L(N){for(let W=v-1;W>=0;W--)if(U[W]!==-1&&(!N||N(U[W])))return W;return-1}function P(N){return E(T,N)===1}function I(N,W){for(let k=0;k<3;k++)y[W*3+k]+=N[k]||0}}function E(T,U){const y=T.GDEF&&T.GDEF.glyphClassDef;return y?s.U._getGlyphClass(U,y):0}function R(...T){for(let U=0;U<T.length;U++)if(typeof T[U]=="number")return T[U]}function w(T){const U=Object.create(null),y=T["OS/2"],v=T.hhea,L=T.head.unitsPerEm,P=R(y&&y.sTypoAscender,v&&v.ascender,L),I={unitsPerEm:L,ascender:P,descender:R(y&&y.sTypoDescender,v&&v.descender,0),capHeight:R(y&&y.sCapHeight,P),xHeight:R(y&&y.sxHeight,P),lineGap:R(y&&y.sTypoLineGap,v&&v.lineGap),supportsCodePoint(N){return s.U.codeToGlyph(T,N)>0},forEachGlyph(N,W,k,se){let j=0;const K=1/I.unitsPerEm*W,q=M(T,N);let F=0;const H=x(T,q);return q.forEach((ne,O)=>{if(ne!==-1){let B=U[ne];if(!B){const{cmds:te,crds:G}=s.U.glyphToPath(T,ne);let ae="",pe=0;for(let Ue=0,fe=te.length;Ue<fe;Ue++){const ye=t[te[Ue]];ae+=te[Ue];for(let Me=1;Me<=ye;Me++)ae+=(Me>1?",":"")+G[pe++]}let ve,D,he,Pe;if(G.length){ve=D=1/0,he=Pe=-1/0;for(let Ue=0,fe=G.length;Ue<fe;Ue+=2){let ye=G[Ue],Me=G[Ue+1];ye<ve&&(ve=ye),Me<D&&(D=Me),ye>he&&(he=ye),Me>Pe&&(Pe=Me)}}else ve=he=D=Pe=0;B=U[ne]={index:ne,advanceWidth:T.hmtx.aWidth[ne],xMin:ve,yMin:D,xMax:he,yMax:Pe,path:ae}}se.call(null,B,j+H[O*3]*K,H[O*3+1]*K,F),j+=H[O*3+2]*K,k&&(j+=k*W)}F+=N.codePointAt(F)>65535?2:1}),j}};return I}return function(U){const y=new Uint8Array(U,0,4),v=s._bin.readASCII(y,0,4);if(v==="wOFF")U=e(U);else if(v==="wOF2")throw new Error("woff2 fonts not supported");return w(s.parse(U)[0])}}const Ev=Gi({name:"Typr Font Parser",dependencies:[Sv,Mv,bv],init(s,e,t){const n=s(),i=e();return t(n,i)}});/*!
Custom bundle of @unicode-font-resolver/client v1.0.2 (https://github.com/lojjic/unicode-font-resolver)
for use in Troika text rendering. 
Original MIT license applies
*/function Tv(){return function(s){var e=function(){this.buckets=new Map};e.prototype.add=function(x){var E=x>>5;this.buckets.set(E,(this.buckets.get(E)||0)|1<<(31&x))},e.prototype.has=function(x){var E=this.buckets.get(x>>5);return E!==void 0&&(E&1<<(31&x))!=0},e.prototype.serialize=function(){var x=[];return this.buckets.forEach(function(E,R){x.push((+R).toString(36)+":"+E.toString(36))}),x.join(",")},e.prototype.deserialize=function(x){var E=this;this.buckets.clear(),x.split(",").forEach(function(R){var w=R.split(":");E.buckets.set(parseInt(w[0],36),parseInt(w[1],36))})};var t=Math.pow(2,8),n=t-1,i=~n;function r(x){var E=function(w){return w&i}(x).toString(16),R=function(w){return(w&i)+t-1}(x).toString(16);return"codepoint-index/plane"+(x>>16)+"/"+E+"-"+R+".json"}function o(x,E){var R=x&n,w=E.codePointAt(R/6|0);return((w=(w||48)-48)&1<<R%6)!=0}function a(x,E){var R;(R=x,R.replace(/U\+/gi,"").replace(/^,+|,+$/g,"").split(/,+/).map(function(w){return w.split("-").map(function(T){return parseInt(T.trim(),16)})})).forEach(function(w){var T=w[0],U=w[1];U===void 0&&(U=T),E(T,U)})}function l(x,E){a(x,function(R,w){for(var T=R;T<=w;T++)E(T)})}var c={},h={},d=new WeakMap,u="https://cdn.jsdelivr.net/gh/lojjic/unicode-font-resolver@v1.0.1/packages/data";function f(x){var E=d.get(x);return E||(E=new e,l(x.ranges,function(R){return E.add(R)}),d.set(x,E)),E}var g,_=new Map;function p(x,E,R){return x[E]?E:x[R]?R:function(w){for(var T in w)return T}(x)}function m(x,E){var R=E;if(!x.includes(R)){R=1/0;for(var w=0;w<x.length;w++)Math.abs(x[w]-E)<Math.abs(R-E)&&(R=x[w])}return R}function M(x){return g||(g=new Set,l("9-D,20,85,A0,1680,2000-200A,2028-202F,205F,3000",function(E){g.add(E)})),g.has(x)}return s.CodePointSet=e,s.clearCache=function(){c={},h={}},s.getFontsForString=function(x,E){E===void 0&&(E={});var R,w=E.lang;w===void 0&&(w=new RegExp("\\p{Script=Hangul}","u").test(R=x)?"ko":new RegExp("\\p{Script=Hiragana}|\\p{Script=Katakana}","u").test(R)?"ja":"en");var T=E.category;T===void 0&&(T="sans-serif");var U=E.style;U===void 0&&(U="normal");var y=E.weight;y===void 0&&(y=400);var v=(E.dataUrl||u).replace(/\/$/g,""),L=new Map,P=new Uint8Array(x.length),I={},N={},W=new Array(x.length),k=new Map,se=!1;function j(F){var H=_.get(F);return H||(H=fetch(v+"/"+F).then(function(ne){if(!ne.ok)throw new Error(ne.statusText);return ne.json().then(function(O){if(!Array.isArray(O)||O[0]!==1)throw new Error("Incorrect schema version; need 1, got "+O[0]);return O[1]})}).catch(function(ne){if(v!==u)return se||(console.error('unicode-font-resolver: Failed loading from dataUrl "'+v+'", trying default CDN. '+ne.message),se=!0),v=u,_.delete(F),j(F);throw ne}),_.set(F,H)),H}for(var K=function(F){var H=x.codePointAt(F),ne=r(H);W[F]=ne,c[ne]||k.has(ne)||k.set(ne,j(ne).then(function(O){c[ne]=O})),H>65535&&(F++,q=F)},q=0;q<x.length;q++)K(q);return Promise.all(k.values()).then(function(){k.clear();for(var F=function(ne){var O=x.codePointAt(ne),B=null,te=c[W[ne]],G=void 0;for(var ae in te){var pe=N[ae];if(pe===void 0&&(pe=N[ae]=new RegExp(ae).test(w||"en")),pe){for(var ve in G=ae,te[ae])if(o(O,te[ae][ve])){B=ve;break}break}}if(!B){e:for(var D in te)if(D!==G){for(var he in te[D])if(o(O,te[D][he])){B=he;break e}}}B||(console.debug("No font coverage for U+"+O.toString(16)),B="latin"),W[ne]=B,h[B]||k.has(B)||k.set(B,j("font-meta/"+B+".json").then(function(Pe){h[B]=Pe})),O>65535&&(ne++,H=ne)},H=0;H<x.length;H++)F(H);return Promise.all(k.values())}).then(function(){for(var F,H=null,ne=0;ne<x.length;ne++){var O=x.codePointAt(ne);if(H&&(M(O)||f(H).has(O)))P[ne]=P[ne-1];else{H=h[W[ne]];var B=I[H.id];if(!B){var te=H.typeforms,G=p(te,T,"sans-serif"),ae=p(te[G],U,"normal"),pe=m((F=te[G])===null||F===void 0?void 0:F[ae],y);B=I[H.id]=v+"/font-files/"+H.id+"/"+G+"."+ae+"."+pe+".woff"}var ve=L.get(B);ve==null&&(ve=L.size,L.set(B,ve)),P[ne]=ve}O>65535&&(ne++,P[ne]=P[ne-1])}return{fontUrls:Array.from(L.keys()),chars:P}})},Object.defineProperty(s,"__esModule",{value:!0}),s}({})}function wv(s,e){const t=Object.create(null),n=Object.create(null);function i(o,a){const l=c=>{console.error(`Failure loading font ${o}`,c)};try{const c=new XMLHttpRequest;c.open("get",o,!0),c.responseType="arraybuffer",c.onload=function(){if(c.status>=400)l(new Error(c.statusText));else if(c.status>0)try{const h=s(c.response);h.src=o,a(h)}catch(h){l(h)}},c.onerror=l,c.send()}catch(c){l(c)}}function r(o,a){let l=t[o];l?a(l):n[o]?n[o].push(a):(n[o]=[a],i(o,c=>{c.src=o,t[o]=c,n[o].forEach(h=>h(c)),delete n[o]}))}return function(o,a,{lang:l,fonts:c=[],style:h="normal",weight:d="normal",unicodeFontsURL:u}={}){const f=new Uint8Array(o.length),g=[];o.length||M();const _=new Map,p=[];if(h!=="italic"&&(h="normal"),typeof d!="number"&&(d=d==="bold"?700:400),c&&!Array.isArray(c)&&(c=[c]),c=c.slice().filter(E=>!E.lang||E.lang.test(l)).reverse(),c.length){let T=0;(function U(y=0){for(let v=y,L=o.length;v<L;v++){const P=o.codePointAt(v);if(T===1&&g[f[v-1]].supportsCodePoint(P)||v>0&&/\s/.test(o[v]))f[v]=f[v-1],T===2&&(p[p.length-1][1]=v);else for(let I=f[v],N=c.length;I<=N;I++)if(I===N){const W=T===2?p[p.length-1]:p[p.length]=[v,v];W[1]=v,T=2}else{f[v]=I;const{src:W,unicodeRange:k}=c[I];if(!k||x(P,k)){const se=t[W];if(!se){r(W,()=>{U(v)});return}if(se.supportsCodePoint(P)){let j=_.get(se);typeof j!="number"&&(j=g.length,g.push(se),_.set(se,j)),f[v]=j,T=1;break}}}P>65535&&v+1<L&&(f[v+1]=f[v],v++,T===2&&(p[p.length-1][1]=v))}m()})()}else p.push([0,o.length-1]),m();function m(){if(p.length){const E=p.map(R=>o.substring(R[0],R[1]+1)).join(`
`);e.getFontsForString(E,{lang:l||void 0,style:h,weight:d,dataUrl:u}).then(({fontUrls:R,chars:w})=>{const T=g.length;let U=0;p.forEach(v=>{for(let L=0,P=v[1]-v[0];L<=P;L++)f[v[0]+L]=w[U++]+T;U++});let y=0;R.forEach((v,L)=>{r(v,P=>{g[L+T]=P,++y===R.length&&M()})})})}else M()}function M(){a({chars:f,fonts:g})}function x(E,R){for(let w=0;w<R.length;w++){const[T,U=T]=R[w];if(T<=E&&E<=U)return!0}return!1}}}const Av=Gi({name:"FontResolver",dependencies:[wv,Ev,Tv],init(s,e,t){return s(e,t())}});function Cv(s,e){const n=/[\u00AD\u034F\u061C\u115F-\u1160\u17B4-\u17B5\u180B-\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFF8]/,i="[^\\S\\u00A0]",r=new RegExp(`${i}|[\\-\\u007C\\u00AD\\u2010\\u2012-\\u2014\\u2027\\u2056\\u2E17\\u2E40]`);function o({text:g,lang:_,fonts:p,style:m,weight:M,preResolvedFonts:x,unicodeFontsURL:E},R){const w=({chars:T,fonts:U})=>{let y,v;const L=[];for(let P=0;P<T.length;P++)T[P]!==v?(v=T[P],L.push(y={start:P,end:P,fontObj:U[T[P]]})):y.end=P;R(L)};x?w(x):s(g,w,{lang:_,fonts:p,style:m,weight:M,unicodeFontsURL:E})}function a({text:g="",font:_,lang:p,sdfGlyphSize:m=64,fontSize:M=400,fontWeight:x=1,fontStyle:E="normal",letterSpacing:R=0,lineHeight:w="normal",maxWidth:T=1/0,direction:U,textAlign:y="left",textIndent:v=0,whiteSpace:L="normal",overflowWrap:P="normal",anchorX:I=0,anchorY:N=0,metricsOnly:W=!1,unicodeFontsURL:k,preResolvedFonts:se=null,includeCaretPositions:j=!1,chunkedBoundsSize:K=8192,colorRanges:q=null},F){const H=d(),ne={fontLoad:0,typesetting:0};g.indexOf("\r")>-1&&(console.info("Typesetter: got text with \\r chars; normalizing to \\n"),g=g.replace(/\r\n/g,`
`).replace(/\r/g,`
`)),M=+M,R=+R,T=+T,w=w||"normal",v=+v,o({text:g,lang:p,style:E,weight:x,fonts:typeof _=="string"?[{src:_}]:_,unicodeFontsURL:k,preResolvedFonts:se},O=>{ne.fontLoad=d()-H;const B=isFinite(T);let te=null,G=null,ae=null,pe=null,ve=null,D=null,he=null,Pe=null,Ue=0,fe=0,ye=L!=="nowrap";const Me=new Map,de=d();let Ce=v,C=0,S=new u;const X=[S];O.forEach(le=>{const{fontObj:ce}=le,{ascender:Se,descender:ue,unitsPerEm:be,lineGap:Be,capHeight:we,xHeight:me}=ce;let xe=Me.get(ce);if(!xe){const z=M/be,ee=w==="normal"?(Se-ue+Be)*z:w*M,ge=(ee-(Se-ue)*z)/2,Ae=Math.min(ee,(Se-ue)*z),Re=(Se+ue)/2*z+Ae/2;xe={index:Me.size,src:ce.src,fontObj:ce,fontSizeMult:z,unitsPerEm:be,ascender:Se*z,descender:ue*z,capHeight:we*z,xHeight:me*z,lineHeight:ee,baseline:-ge-Se*z,caretTop:Re,caretBottom:Re-Ae},Me.set(ce,xe)}const{fontSizeMult:Ne}=xe,We=g.slice(le.start,le.end+1);let b,$;ce.forEachGlyph(We,M,R,(z,ee,ge,Ae)=>{ee+=C,Ae+=le.start,b=ee,$=z;const Re=g.charAt(Ae),je=z.advanceWidth*Ne,Xe=S.count;let De;if("isEmpty"in z||(z.isWhitespace=!!Re&&new RegExp(i).test(Re),z.canBreakAfter=!!Re&&r.test(Re),z.isEmpty=z.xMin===z.xMax||z.yMin===z.yMax||n.test(Re)),!z.isWhitespace&&!z.isEmpty&&fe++,ye&&B&&!z.isWhitespace&&ee+je+Ce>T&&Xe){if(S.glyphAt(Xe-1).glyphObj.canBreakAfter)De=new u,Ce=-ee;else for(let Je=Xe;Je--;)if(Je===0&&P==="break-word"){De=new u,Ce=-ee;break}else if(S.glyphAt(Je).glyphObj.canBreakAfter){De=S.splitAt(Je+1);const tt=De.glyphAt(0).x;Ce-=tt;for(let $e=De.count;$e--;)De.glyphAt($e).x-=tt;break}De&&(S.isSoftWrapped=!0,S=De,X.push(S),Ue=T)}let Ye=S.glyphAt(S.count);Ye.glyphObj=z,Ye.x=ee+Ce,Ye.y=ge,Ye.width=je,Ye.charIndex=Ae,Ye.fontData=xe,Re===`
`&&(S=new u,X.push(S),Ce=-(ee+je+R*M)+v)}),C=b+$.advanceWidth*Ne+R*M});let Z=0;X.forEach(le=>{let ce=!0;for(let Se=le.count;Se--;){const ue=le.glyphAt(Se);ce&&!ue.glyphObj.isWhitespace&&(le.width=ue.x+ue.width,le.width>Ue&&(Ue=le.width),ce=!1);let{lineHeight:be,capHeight:Be,xHeight:we,baseline:me}=ue.fontData;be>le.lineHeight&&(le.lineHeight=be);const xe=me-le.baseline;xe<0&&(le.baseline+=xe,le.cap+=xe,le.ex+=xe),le.cap=Math.max(le.cap,le.baseline+Be),le.ex=Math.max(le.ex,le.baseline+we)}le.baseline-=Z,le.cap-=Z,le.ex-=Z,Z+=le.lineHeight});let ie=0,Q=0;if(I&&(typeof I=="number"?ie=-I:typeof I=="string"&&(ie=-Ue*(I==="left"?0:I==="center"?.5:I==="right"?1:c(I)))),N&&(typeof N=="number"?Q=-N:typeof N=="string"&&(Q=N==="top"?0:N==="top-baseline"?-X[0].baseline:N==="top-cap"?-X[0].cap:N==="top-ex"?-X[0].ex:N==="middle"?Z/2:N==="bottom"?Z:N==="bottom-baseline"?-X[X.length-1].baseline:c(N)*Z)),!W){const le=e.getEmbeddingLevels(g,U);te=new Uint16Array(fe),G=new Uint8Array(fe),ae=new Float32Array(fe*2),pe={},he=[1/0,1/0,-1/0,-1/0],Pe=[],j&&(D=new Float32Array(g.length*4)),q&&(ve=new Uint8Array(fe*3));let ce=0,Se=-1,ue=-1,be,Be;if(X.forEach((we,me)=>{let{count:xe,width:Ne}=we;if(xe>0){let We=0;for(let Ae=xe;Ae--&&we.glyphAt(Ae).glyphObj.isWhitespace;)We++;let b=0,$=0;if(y==="center")b=(Ue-Ne)/2;else if(y==="right")b=Ue-Ne;else if(y==="justify"&&we.isSoftWrapped){let Ae=0;for(let Re=xe-We;Re--;)we.glyphAt(Re).glyphObj.isWhitespace&&Ae++;$=(Ue-Ne)/Ae}if($||b){let Ae=0;for(let Re=0;Re<xe;Re++){let je=we.glyphAt(Re);const Xe=je.glyphObj;je.x+=b+Ae,$!==0&&Xe.isWhitespace&&Re<xe-We&&(Ae+=$,je.width+=$)}}const z=e.getReorderSegments(g,le,we.glyphAt(0).charIndex,we.glyphAt(we.count-1).charIndex);for(let Ae=0;Ae<z.length;Ae++){const[Re,je]=z[Ae];let Xe=1/0,De=-1/0;for(let Ye=0;Ye<xe;Ye++)if(we.glyphAt(Ye).charIndex>=Re){let Je=Ye,tt=Ye;for(;tt<xe;tt++){let $e=we.glyphAt(tt);if($e.charIndex>je)break;tt<xe-We&&(Xe=Math.min(Xe,$e.x),De=Math.max(De,$e.x+$e.width))}for(let $e=Je;$e<tt;$e++){const lt=we.glyphAt($e);lt.x=De-(lt.x+lt.width-Xe)}break}}let ee;const ge=Ae=>ee=Ae;for(let Ae=0;Ae<xe;Ae++){const Re=we.glyphAt(Ae);ee=Re.glyphObj;const je=ee.index,Xe=le.levels[Re.charIndex]&1;if(Xe){const De=e.getMirroredCharacter(g[Re.charIndex]);De&&Re.fontData.fontObj.forEachGlyph(De,0,0,ge)}if(j){const{charIndex:De,fontData:Ye}=Re,Je=Re.x+ie,tt=Re.x+Re.width+ie;D[De*4]=Xe?tt:Je,D[De*4+1]=Xe?Je:tt,D[De*4+2]=we.baseline+Ye.caretBottom+Q,D[De*4+3]=we.baseline+Ye.caretTop+Q;const $e=De-Se;$e>1&&h(D,Se,$e),Se=De}if(q){const{charIndex:De}=Re;for(;De>ue;)ue++,q.hasOwnProperty(ue)&&(Be=q[ue])}if(!ee.isWhitespace&&!ee.isEmpty){const De=ce++,{fontSizeMult:Ye,src:Je,index:tt}=Re.fontData,$e=pe[Je]||(pe[Je]={});$e[je]||($e[je]={path:ee.path,pathBounds:[ee.xMin,ee.yMin,ee.xMax,ee.yMax]});const lt=Re.x+ie,St=Re.y+we.baseline+Q;ae[De*2]=lt,ae[De*2+1]=St;const gt=lt+ee.xMin*Ye,qt=St+ee.yMin*Ye,Ht=lt+ee.xMax*Ye,Vt=St+ee.yMax*Ye;gt<he[0]&&(he[0]=gt),qt<he[1]&&(he[1]=qt),Ht>he[2]&&(he[2]=Ht),Vt>he[3]&&(he[3]=Vt),De%K===0&&(be={start:De,end:De,rect:[1/0,1/0,-1/0,-1/0]},Pe.push(be)),be.end++;const ft=be.rect;if(gt<ft[0]&&(ft[0]=gt),qt<ft[1]&&(ft[1]=qt),Ht>ft[2]&&(ft[2]=Ht),Vt>ft[3]&&(ft[3]=Vt),te[De]=je,G[De]=tt,q){const cn=De*3;ve[cn]=Be>>16&255,ve[cn+1]=Be>>8&255,ve[cn+2]=Be&255}}}}}),D){const we=g.length-Se;we>1&&h(D,Se,we)}}const Te=[];Me.forEach(({index:le,src:ce,unitsPerEm:Se,ascender:ue,descender:be,lineHeight:Be,capHeight:we,xHeight:me})=>{Te[le]={src:ce,unitsPerEm:Se,ascender:ue,descender:be,lineHeight:Be,capHeight:we,xHeight:me}}),ne.typesetting=d()-de,F({glyphIds:te,glyphFontIndices:G,glyphPositions:ae,glyphData:pe,fontData:Te,caretPositions:D,glyphColors:ve,chunkedBounds:Pe,fontSize:M,topBaseline:Q+X[0].baseline,blockBounds:[ie,Q-Z,ie+Ue,Q],visibleBounds:he,timings:ne})})}function l(g,_){a({...g,metricsOnly:!0},p=>{const[m,M,x,E]=p.blockBounds;_({width:x-m,height:E-M})})}function c(g){let _=g.match(/^([\d.]+)%$/),p=_?parseFloat(_[1]):NaN;return isNaN(p)?0:p/100}function h(g,_,p){const m=g[_*4],M=g[_*4+1],x=g[_*4+2],E=g[_*4+3],R=(M-m)/p;for(let w=0;w<p;w++){const T=(_+w)*4;g[T]=m+R*w,g[T+1]=m+R*(w+1),g[T+2]=x,g[T+3]=E}}function d(){return(self.performance||Date).now()}function u(){this.data=[]}const f=["glyphObj","x","y","width","charIndex","fontData"];return u.prototype={width:0,lineHeight:0,baseline:0,cap:0,ex:0,isSoftWrapped:!1,get count(){return Math.ceil(this.data.length/f.length)},glyphAt(g){let _=u.flyweight;return _.data=this.data,_.index=g,_},splitAt(g){let _=new u;return _.data=this.data.splice(g*f.length),_}},u.flyweight=f.reduce((g,_,p,m)=>(Object.defineProperty(g,_,{get(){return this.data[this.index*f.length+p]},set(M){this.data[this.index*f.length+p]=M}}),g),{data:null,index:0}),{typeset:a,measure:l}}const ei=()=>(self.performance||Date).now(),ws=xh();let cc;function Rv(s,e,t,n,i,r,o,a,l,c,h=!0){return h?Uv(s,e,t,n,i,r,o,a,l,c).then(null,d=>(cc||(console.warn("WebGL SDF generation failed, falling back to JS",d),cc=!0),uc(s,e,t,n,i,r,o,a,l,c))):uc(s,e,t,n,i,r,o,a,l,c)}const ls=[],Pv=5;let Go=0;function Sh(){const s=ei();for(;ls.length&&ei()-s<Pv;)ls.shift()();Go=ls.length?setTimeout(Sh,0):0}const Uv=(...s)=>new Promise((e,t)=>{ls.push(()=>{const n=ei();try{ws.webgl.generateIntoCanvas(...s),e({timing:ei()-n})}catch(i){t(i)}}),Go||(Go=setTimeout(Sh,0))}),Lv=4,Dv=2e3,hc={};let Iv=0;function uc(s,e,t,n,i,r,o,a,l,c){const h="TroikaTextSDFGenerator_JS_"+Iv++%Lv;let d=hc[h];return d||(d=hc[h]={workerModule:Gi({name:h,workerId:h,dependencies:[xh,ei],init(u,f){const g=u().javascript.generate;return function(..._){const p=f();return{textureData:g(..._),timing:f()-p}}},getTransferables(u){return[u.textureData.buffer]}}),requests:0,idleTimer:null}),d.requests++,clearTimeout(d.idleTimer),d.workerModule(s,e,t,n,i,r).then(({textureData:u,timing:f})=>{const g=ei(),_=new Uint8Array(u.length*4);for(let p=0;p<u.length;p++)_[p*4+c]=u[p];return ws.webglUtils.renderImageData(o,_,a,l,s,e,1<<3-c),f+=ei()-g,--d.requests===0&&(d.idleTimer=setTimeout(()=>{uv(h)},Dv)),{timing:f}})}function Fv(s){s._warm||(ws.webgl.isSupported(s),s._warm=!0)}const Nv=ws.webglUtils.resizeWebGLCanvasWithoutClearing,lr={unicodeFontsURL:null,sdfGlyphSize:64,sdfMargin:1/16,sdfExponent:9,textureWidth:2048},Ov=new Ve;function Ti(){return(self.performance||Date).now()}const dc=Object.create(null);function Bv(s,e){s=zv({},s);const t=Ti(),n=[];if(s.font&&n.push({label:"user",src:Gv(s.font)}),s.font=n,s.text=""+s.text,s.sdfGlyphSize=s.sdfGlyphSize||lr.sdfGlyphSize,s.unicodeFontsURL=s.unicodeFontsURL||lr.unicodeFontsURL,s.colorRanges!=null){let u={};for(let f in s.colorRanges)if(s.colorRanges.hasOwnProperty(f)){let g=s.colorRanges[f];typeof g!="number"&&(g=Ov.set(g).getHex()),u[f]=g}s.colorRanges=u}Object.freeze(s);const{textureWidth:i,sdfExponent:r}=lr,{sdfGlyphSize:o}=s,a=i/o*4;let l=dc[o];if(!l){const u=document.createElement("canvas");u.width=i,u.height=o*256/a,l=dc[o]={glyphCount:0,sdfGlyphSize:o,sdfCanvas:u,sdfTexture:new Tt(u,void 0,void 0,void 0,kt,kt),contextLost:!1,glyphsByFont:new Map},l.sdfTexture.generateMipmaps=!1,kv(l)}const{sdfTexture:c,sdfCanvas:h}=l;Eh(s).then(u=>{const{glyphIds:f,glyphFontIndices:g,fontData:_,glyphPositions:p,fontSize:m,timings:M}=u,x=[],E=new Float32Array(f.length*4);let R=0,w=0;const T=Ti(),U=_.map(I=>{let N=l.glyphsByFont.get(I.src);return N||l.glyphsByFont.set(I.src,N=new Map),N});f.forEach((I,N)=>{const W=g[N],{src:k,unitsPerEm:se}=_[W];let j=U[W].get(I);if(!j){const{path:ne,pathBounds:O}=u.glyphData[k][I],B=Math.max(O[2]-O[0],O[3]-O[1])/o*(lr.sdfMargin*o+.5),te=l.glyphCount++,G=[O[0]-B,O[1]-B,O[2]+B,O[3]+B];U[W].set(I,j={path:ne,atlasIndex:te,sdfViewBox:G}),x.push(j)}const{sdfViewBox:K}=j,q=p[w++],F=p[w++],H=m/se;E[R++]=q+K[0]*H,E[R++]=F+K[1]*H,E[R++]=q+K[2]*H,E[R++]=F+K[3]*H,f[N]=j.atlasIndex}),M.quads=(M.quads||0)+(Ti()-T);const y=Ti();M.sdf={};const v=h.height,L=Math.ceil(l.glyphCount/a),P=Math.pow(2,Math.ceil(Math.log2(L*o)));P>v&&(console.info(`Increasing SDF texture size ${v}->${P}`),Nv(h,i,P),c.dispose()),Promise.all(x.map(I=>Mh(I,l,s.gpuAccelerateSDF).then(({timing:N})=>{M.sdf[I.atlasIndex]=N}))).then(()=>{x.length&&!l.contextLost&&(bh(l),c.needsUpdate=!0),M.sdfTotal=Ti()-y,M.total=Ti()-t,e(Object.freeze({parameters:s,sdfTexture:c,sdfGlyphSize:o,sdfExponent:r,glyphBounds:E,glyphAtlasIndices:f,glyphColors:u.glyphColors,caretPositions:u.caretPositions,chunkedBounds:u.chunkedBounds,ascender:u.ascender,descender:u.descender,lineHeight:u.lineHeight,capHeight:u.capHeight,xHeight:u.xHeight,topBaseline:u.topBaseline,blockBounds:u.blockBounds,visibleBounds:u.visibleBounds,timings:u.timings}))})}),Promise.resolve().then(()=>{l.contextLost||Fv(h)})}function Mh({path:s,atlasIndex:e,sdfViewBox:t},{sdfGlyphSize:n,sdfCanvas:i,contextLost:r},o){if(r)return Promise.resolve({timing:-1});const{textureWidth:a,sdfExponent:l}=lr,c=Math.max(t[2]-t[0],t[3]-t[1]),h=Math.floor(e/4),d=h%(a/n)*n,u=Math.floor(h/(a/n))*n,f=e%4;return Rv(n,n,s,t,c,l,i,d,u,f,o)}function kv(s){const e=s.sdfCanvas;e.addEventListener("webglcontextlost",t=>{console.log("Context Lost",t),t.preventDefault(),s.contextLost=!0}),e.addEventListener("webglcontextrestored",t=>{console.log("Context Restored",t),s.contextLost=!1;const n=[];s.glyphsByFont.forEach(i=>{i.forEach(r=>{n.push(Mh(r,s,!0))})}),Promise.all(n).then(()=>{bh(s),s.sdfTexture.needsUpdate=!0})})}function zv(s,e){for(let t in e)e.hasOwnProperty(t)&&(s[t]=e[t]);return s}let ns;function Gv(s){return ns||(ns=typeof document>"u"?{}:document.createElement("a")),ns.href=s,ns.href}function bh(s){if(typeof createImageBitmap!="function"){console.info("Safari<15: applying SDF canvas workaround");const{sdfCanvas:e,sdfTexture:t}=s,{width:n,height:i}=e,r=s.sdfCanvas.getContext("webgl");let o=t.image.data;(!o||o.length!==n*i*4)&&(o=new Uint8Array(n*i*4),t.image={width:n,height:i,data:o},t.flipY=!1,t.isDataTexture=!0),r.readPixels(0,0,n,i,r.RGBA,r.UNSIGNED_BYTE,o)}}const Hv=Gi({name:"Typesetter",dependencies:[Cv,Av,fv],init(s,e,t){return s(e,t())}}),Eh=Gi({name:"Typesetter",dependencies:[Hv],init(s){return function(e){return new Promise(t=>{s.typeset(e,t)})}},getTransferables(s){const e=[];for(let t in s)s[t]&&s[t].buffer&&e.push(s[t].buffer);return e}});Eh.onMainThread;const fc={};function Vv(s){let e=fc[s];return e||(e=fc[s]=new ri(1,1,s,s).translate(.5,.5,0)),e}const Wv="aTroikaGlyphBounds",pc="aTroikaGlyphIndex",Xv="aTroikaGlyphColor";class Yv extends F_{constructor(){super(),this.detail=1,this.curveRadius=0,this.groups=[{start:0,count:1/0,materialIndex:0},{start:0,count:1/0,materialIndex:1}],this.boundingSphere=new ii,this.boundingBox=new Sn}computeBoundingSphere(){}computeBoundingBox(){}set detail(e){if(e!==this._detail){this._detail=e,(typeof e!="number"||e<1)&&(e=1);let t=Vv(e);["position","normal","uv"].forEach(n=>{this.attributes[n]=t.attributes[n].clone()}),this.setIndex(t.getIndex().clone())}}get detail(){return this._detail}set curveRadius(e){e!==this._curveRadius&&(this._curveRadius=e,this._updateBounds())}get curveRadius(){return this._curveRadius}updateGlyphs(e,t,n,i,r){this.updateAttributeData(Wv,e,4),this.updateAttributeData(pc,t,1),this.updateAttributeData(Xv,r,3),this._blockBounds=n,this._chunkedBounds=i,this.instanceCount=t.length,this._updateBounds()}_updateBounds(){const e=this._blockBounds;if(e){const{curveRadius:t,boundingBox:n}=this;if(t){const{PI:i,floor:r,min:o,max:a,sin:l,cos:c}=Math,h=i/2,d=i*2,u=Math.abs(t),f=e[0]/u,g=e[2]/u,_=r((f+h)/d)!==r((g+h)/d)?-u:o(l(f)*u,l(g)*u),p=r((f-h)/d)!==r((g-h)/d)?u:a(l(f)*u,l(g)*u),m=r((f+i)/d)!==r((g+i)/d)?u*2:a(u-c(f)*u,u-c(g)*u);n.min.set(_,e[1],t<0?-m:0),n.max.set(p,e[3],t<0?0:m)}else n.min.set(e[0],e[1],0),n.max.set(e[2],e[3],0);n.getBoundingSphere(this.boundingSphere)}}applyClipRect(e){let t=this.getAttribute(pc).count,n=this._chunkedBounds;if(n)for(let i=n.length;i--;){t=n[i].end;let r=n[i].rect;if(r[1]<e.w&&r[3]>e.y&&r[0]<e.z&&r[2]>e.x)break}this.instanceCount=t}updateAttributeData(e,t,n){const i=this.getAttribute(e);t?i&&i.array.length===t.length?(i.array.set(t),i.needsUpdate=!0):(this.setAttribute(e,new Io(t,n)),delete this._maxInstanceCount,this.dispose()):i&&this.deleteAttribute(e)}}const jv=`
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
`,qv=`
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
`,Kv=`
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
`,Zv=`
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
`;function Jv(s){const e=zo(s,{chained:!0,extensions:{derivatives:!0},uniforms:{uTroikaSDFTexture:{value:null},uTroikaSDFTextureSize:{value:new Oe},uTroikaSDFGlyphSize:{value:0},uTroikaSDFExponent:{value:0},uTroikaTotalBounds:{value:new ht(0,0,0,0)},uTroikaClipRect:{value:new ht(0,0,0,0)},uTroikaEdgeOffset:{value:0},uTroikaFillOpacity:{value:1},uTroikaPositionOffset:{value:new Oe},uTroikaCurveRadius:{value:0},uTroikaBlurRadius:{value:0},uTroikaStrokeWidth:{value:0},uTroikaStrokeColor:{value:new Ve},uTroikaStrokeOpacity:{value:1},uTroikaOrient:{value:new Ke},uTroikaUseGlyphColors:{value:!0},uTroikaSDFDebug:{value:!1}},vertexDefs:jv,vertexTransform:qv,fragmentDefs:Kv,fragmentColorTransform:Zv,customRewriter({vertexShader:t,fragmentShader:n}){let i=/\buniform\s+vec3\s+diffuse\b/;return i.test(n)&&(n=n.replace(i,"varying vec3 vTroikaGlyphColor").replace(/\bdiffuse\b/g,"vTroikaGlyphColor"),i.test(t)||(t=t.replace(yh,`uniform vec3 diffuse;
$&
vTroikaGlyphColor = uTroikaUseGlyphColors ? aTroikaGlyphColor / 255.0 : diffuse;
`))),{vertexShader:t,fragmentShader:n}}});return e.transparent=!0,e.forceSinglePass=!0,Object.defineProperties(e,{isTroikaTextMaterial:{value:!0},shadowSide:{get(){return this.side},set(){}}}),e}const Qo=new mr({color:16777215,side:sn,transparent:!0}),mc=8421504,gc=new it,is=new V,So=new V,or=[],Qv=new V,Mo="+x+y";function _c(s){return Array.isArray(s)?s[0]:s}let Th=()=>{const s=new Rt(new ri(1,1),Qo);return Th=()=>s,s},wh=()=>{const s=new Rt(new ri(1,1,32,1),Qo);return wh=()=>s,s};const $v={type:"syncstart"},e0={type:"synccomplete"},Ah=["font","fontSize","fontStyle","fontWeight","lang","letterSpacing","lineHeight","maxWidth","overflowWrap","text","direction","textAlign","textIndent","whiteSpace","anchorX","anchorY","colorRanges","sdfGlyphSize"],t0=Ah.concat("material","color","depthOffset","clipRect","curveRadius","orientation","glyphGeometryDetail");class Ch extends Rt{constructor(){const e=new Yv;super(e,null),this.text="",this.anchorX=0,this.anchorY=0,this.curveRadius=0,this.direction="auto",this.font=null,this.unicodeFontsURL=null,this.fontSize=.1,this.fontWeight="normal",this.fontStyle="normal",this.lang=null,this.letterSpacing=0,this.lineHeight="normal",this.maxWidth=1/0,this.overflowWrap="normal",this.textAlign="left",this.textIndent=0,this.whiteSpace="normal",this.material=null,this.color=null,this.colorRanges=null,this.outlineWidth=0,this.outlineColor=0,this.outlineOpacity=1,this.outlineBlur=0,this.outlineOffsetX=0,this.outlineOffsetY=0,this.strokeWidth=0,this.strokeColor=mc,this.strokeOpacity=1,this.fillOpacity=1,this.depthOffset=0,this.clipRect=null,this.orientation=Mo,this.glyphGeometryDetail=1,this.sdfGlyphSize=null,this.gpuAccelerateSDF=!0,this.debugSDF=!1}sync(e){this._needsSync&&(this._needsSync=!1,this._isSyncing?(this._queuedSyncs||(this._queuedSyncs=[])).push(e):(this._isSyncing=!0,this.dispatchEvent($v),Bv({text:this.text,font:this.font,lang:this.lang,fontSize:this.fontSize||.1,fontWeight:this.fontWeight||"normal",fontStyle:this.fontStyle||"normal",letterSpacing:this.letterSpacing||0,lineHeight:this.lineHeight||"normal",maxWidth:this.maxWidth,direction:this.direction||"auto",textAlign:this.textAlign,textIndent:this.textIndent,whiteSpace:this.whiteSpace,overflowWrap:this.overflowWrap,anchorX:this.anchorX,anchorY:this.anchorY,colorRanges:this.colorRanges,includeCaretPositions:!0,sdfGlyphSize:this.sdfGlyphSize,gpuAccelerateSDF:this.gpuAccelerateSDF,unicodeFontsURL:this.unicodeFontsURL},t=>{this._isSyncing=!1,this._textRenderInfo=t,this.geometry.updateGlyphs(t.glyphBounds,t.glyphAtlasIndices,t.blockBounds,t.chunkedBounds,t.glyphColors);const n=this._queuedSyncs;n&&(this._queuedSyncs=null,this._needsSync=!0,this.sync(()=>{n.forEach(i=>i&&i())})),this.dispatchEvent(e0),e&&e()})))}onBeforeRender(e,t,n,i,r,o){this.sync(),r.isTroikaTextMaterial&&this._prepareForRender(r)}dispose(){this.geometry.dispose()}get textRenderInfo(){return this._textRenderInfo||null}createDerivedMaterial(e){return Jv(e)}get material(){let e=this._derivedMaterial;const t=this._baseMaterial||this._defaultMaterial||(this._defaultMaterial=Qo.clone());if((!e||!e.isDerivedFrom(t))&&(e=this._derivedMaterial=this.createDerivedMaterial(t),t.addEventListener("dispose",function n(){t.removeEventListener("dispose",n),e.dispose()})),this.hasOutline()){let n=e._outlineMtl;return n||(n=e._outlineMtl=Object.create(e,{id:{value:e.id+.1}}),n.isTextOutlineMaterial=!0,n.depthWrite=!1,n.map=null,e.addEventListener("dispose",function i(){e.removeEventListener("dispose",i),n.dispose()})),[n,e]}else return e}set material(e){e&&e.isTroikaTextMaterial?(this._derivedMaterial=e,this._baseMaterial=e.baseMaterial):this._baseMaterial=e}hasOutline(){return!!(this.outlineWidth||this.outlineBlur||this.outlineOffsetX||this.outlineOffsetY)}get glyphGeometryDetail(){return this.geometry.detail}set glyphGeometryDetail(e){this.geometry.detail=e}get curveRadius(){return this.geometry.curveRadius}set curveRadius(e){this.geometry.curveRadius=e}get customDepthMaterial(){return _c(this.material).getDepthMaterial()}set customDepthMaterial(e){}get customDistanceMaterial(){return _c(this.material).getDistanceMaterial()}set customDistanceMaterial(e){}_prepareForRender(e){const t=e.isTextOutlineMaterial,n=e.uniforms,i=this.textRenderInfo;if(i){const{sdfTexture:a,blockBounds:l}=i;n.uTroikaSDFTexture.value=a,n.uTroikaSDFTextureSize.value.set(a.image.width,a.image.height),n.uTroikaSDFGlyphSize.value=i.sdfGlyphSize,n.uTroikaSDFExponent.value=i.sdfExponent,n.uTroikaTotalBounds.value.fromArray(l),n.uTroikaUseGlyphColors.value=!t&&!!i.glyphColors;let c=0,h=0,d=0,u,f,g,_=0,p=0;if(t){let{outlineWidth:M,outlineOffsetX:x,outlineOffsetY:E,outlineBlur:R,outlineOpacity:w}=this;c=this._parsePercent(M)||0,h=Math.max(0,this._parsePercent(R)||0),u=w,_=this._parsePercent(x)||0,p=this._parsePercent(E)||0}else d=Math.max(0,this._parsePercent(this.strokeWidth)||0),d&&(g=this.strokeColor,n.uTroikaStrokeColor.value.set(g??mc),f=this.strokeOpacity,f==null&&(f=1)),u=this.fillOpacity;n.uTroikaEdgeOffset.value=c,n.uTroikaPositionOffset.value.set(_,p),n.uTroikaBlurRadius.value=h,n.uTroikaStrokeWidth.value=d,n.uTroikaStrokeOpacity.value=f,n.uTroikaFillOpacity.value=u??1,n.uTroikaCurveRadius.value=this.curveRadius||0;let m=this.clipRect;if(m&&Array.isArray(m)&&m.length===4)n.uTroikaClipRect.value.fromArray(m);else{const M=(this.fontSize||.1)*100;n.uTroikaClipRect.value.set(l[0]-M,l[1]-M,l[2]+M,l[3]+M)}this.geometry.applyClipRect(n.uTroikaClipRect.value)}n.uTroikaSDFDebug.value=!!this.debugSDF,e.polygonOffset=!!this.depthOffset,e.polygonOffsetFactor=e.polygonOffsetUnits=this.depthOffset||0;const r=t?this.outlineColor||0:this.color;if(r==null)delete e.color;else{const a=e.hasOwnProperty("color")?e.color:e.color=new Ve;(r!==a._input||typeof r=="object")&&a.set(a._input=r)}let o=this.orientation||Mo;if(o!==e._orientation){let a=n.uTroikaOrient.value;o=o.replace(/[^-+xyz]/g,"");let l=o!==Mo&&o.match(/^([-+])([xyz])([-+])([xyz])$/);if(l){let[,c,h,d,u]=l;is.set(0,0,0)[h]=c==="-"?1:-1,So.set(0,0,0)[u]=d==="-"?-1:1,gc.lookAt(Qv,is.cross(So),So),a.setFromMatrix4(gc)}else a.identity();e._orientation=o}}_parsePercent(e){if(typeof e=="string"){let t=e.match(/^(-?[\d.]+)%$/),n=t?parseFloat(t[1]):NaN;e=(isNaN(n)?0:n/100)*this.fontSize}return e}localPositionToTextCoords(e,t=new Oe){t.copy(e);const n=this.curveRadius;return n&&(t.x=Math.atan2(e.x,Math.abs(n)-Math.abs(e.z))*Math.abs(n)),t}worldPositionToTextCoords(e,t=new Oe){return is.copy(e),this.localPositionToTextCoords(this.worldToLocal(is),t)}raycast(e,t){const{textRenderInfo:n,curveRadius:i}=this;if(n){const r=n.blockBounds,o=i?wh():Th(),a=o.geometry,{position:l,uv:c}=a.attributes;for(let h=0;h<c.count;h++){let d=r[0]+c.getX(h)*(r[2]-r[0]);const u=r[1]+c.getY(h)*(r[3]-r[1]);let f=0;i&&(f=i-Math.cos(d/i)*i,d=Math.sin(d/i)*i),l.setXYZ(h,d,u,f)}a.boundingSphere=this.geometry.boundingSphere,a.boundingBox=this.geometry.boundingBox,o.matrixWorld=this.matrixWorld,o.material.side=this.material.side,or.length=0,o.raycast(e,or);for(let h=0;h<or.length;h++)or[h].object=this,t.push(or[h])}}copy(e){const t=this.geometry;return super.copy(e),this.geometry=t,t0.forEach(n=>{this[n]=e[n]}),this}clone(){return new this.constructor().copy(this)}}Ah.forEach(s=>{const e="_private_"+s;Object.defineProperty(Ch.prototype,s,{get(){return this[e]},set(t){t!==this[e]&&(this[e]=t,this._needsSync=!0)}})});new Sn;new Ve;const n0=6,i0=5;function r0(s,e,t,n,i){const r=new Set,o=[],a=Math.min(s.length,e.length/3);for(let l=0;l<a;l+=1){const c=s[l];if(n!==null&&n.has(c)){r.size<i&&r.add(c);continue}const h=e[l*3]-t.x,d=e[l*3+1]-t.y,u=e[l*3+2]-t.z;o.push({id:c,d2:h*h+d*d+u*u})}o.sort((l,c)=>l.d2-c.d2);for(const l of o){if(r.size>=i)break;r.add(l.id)}return r}class s0{constructor(e,t,n){this.scene=e,this.store=t,this.engine=n,this.active=new Map,this.pool=[],this.theme=null,this.styleStamp=0}applyTheme(e){this.theme=e,this.styleStamp+=1}_styleText(e){const{label:t}=this.theme;e.fontSize=t.size,e.color=t.color,e.outlineColor=t.halo,e.outlineWidth=t.size*.12,e.anchorX="center",e.anchorY="bottom",e.userData.styleStamp=this.styleStamp}_acquire(e){const t=this.pool.pop()??new Ch;return t.parent||this.scene.add(t),t.visible=!0,t.userData.opacity=0,t.userData.text=null,this.active.set(e,t),t}_release(e,t){t.visible=!1,this.active.delete(e),this.pool.push(t)}update(e,t,n,i){if(!this.theme)return;const r=this.theme.label.budget??200,o=r0(this.engine.ids,this.engine.positions,t.position,n,r);for(const l of o)!this.active.has(l)&&this.store.nodes.has(l)&&this._acquire(l);const a=Math.min(1,e*n0);for(const[l,c]of this.active){const h=this.store.nodes.get(l),d=i.get(l);if(!h||!d){this._release(l,c);continue}const u=o.has(l)?1:0;if(c.userData.opacity+=(u-c.userData.opacity)*a,u===0&&c.userData.opacity<.02){this._release(l,c);continue}c.fillOpacity=c.userData.opacity,c.outlineOpacity=c.userData.opacity;const f=_h(h,this.store.nodeTypes,this.theme);c.position.set(d.x,d.y+i0*f.size,d.z),c.quaternion.copy(t.quaternion);const g=c.userData.styleStamp!==this.styleStamp;(c.userData.text!==h.label||g)&&(g&&this._styleText(c),c.text=h.label,c.userData.text=h.label,c.sync())}}}const vc=8,o0=1;function a0(s,e,t){const n=[];for(const c of s){const h=t.get(c);if(!h)return null;n.push(h)}const i=[];let r=0;for(let c=0;c<n.length-1;c+=1){const h=n[c+1].x-n[c].x,d=n[c+1].y-n[c].y,u=n[c+1].z-n[c].z,f=Math.hypot(h,d,u);i.push(f),r+=f}if(r===0)return{x:n[0].x,y:n[0].y,z:n[0].z};let a=Math.max(0,Math.min(1,e))*r;for(let c=0;c<i.length;c+=1){if(a<=i[c]||c===i.length-1){const h=i[c]===0?0:a/i[c],d=n[c],u=n[c+1];return{x:d.x+(u.x-d.x)*h,y:d.y+(u.y-d.y)*h,z:d.z+(u.z-d.z)*h}}a-=i[c]}const l=n[n.length-1];return{x:l.x,y:l.y,z:l.z}}function xc(s,e){let t=0;for(let n=0;n<s.length-1;n+=1){const i=e.get(s[n]),r=e.get(s[n+1]);if(!i||!r)return 0;t+=Math.hypot(r.x-i.x,r.y-i.y,r.z-i.z)}return t}function l0(s,e,t){if(s.color)return s.color;if(e&&e.color)return e.color;const n=t.palette??[];return s.type_index!=null&&n.length>0?n[s.type_index%n.length]:t.flow.color}class c0{constructor(e,t){this.path=e.path,this.flowType=e.flow_type??null,this.typeIndex=e.type_index??null,this.color=e.color??null,this.size=e.size??null,this.count=e.count,this.interval=Math.max(.001,e.interval??.2),this.speed=e.speed??1,this.flowId=e.flow_id??null,this.emitted=0,this.nextEmit=t,this.particles=[],this.done=!1}step(e,t){for(;this.nextEmit<=e&&(this.count===null||this.emitted<this.count);)this.particles.push({born:this.nextEmit}),this.emitted+=1,this.nextEmit+=this.interval;t>0&&(this.particles=this.particles.filter(n=>e-n.born<t)),this.count!==null&&this.emitted>=this.count&&this.particles.length===0&&(this.done=!0)}}class h0{constructor(e,{now:t=()=>performance.now()/1e3}={}){this.store=e,this.now=t,this.flows=[],this.persistent=new Map}applyFlow(e){const t=new c0(e,this.now());if(t.flowId!==null){const n=this.persistent.get(t.flowId);n&&(this.flows=this.flows.filter(i=>i!==n)),this.persistent.set(t.flowId,t)}this.flows.push(t)}stopFlow(e){const t=this.persistent.get(e);t&&(this.persistent.delete(e),this.flows=this.flows.filter(n=>n!==t))}replayInit(e){this.flows=this.flows.filter(t=>t.flowId===null),this.persistent.clear();for(const t of e)this.applyFlow(t)}activeCount(){return this.flows.length}_speedOf(e){var n;const t=((n=this.store.flowTypes)==null?void 0:n[e.flowType])??null;return e.speed*((t==null?void 0:t.speed)??1)}update(e,t){var a;const n=this.now(),i=((a=t==null?void 0:t.flow)==null?void 0:a.baseSpeed)??0,r=this._display;for(const l of this.flows){let c=0;if(i>0&&r){const h=xc(l.path,r),d=i*this._speedOf(l);c=h>0&&d>0?h/d:0}l.step(n,c)}const o=this.store.nodes;this.flows=this.flows.filter(l=>l.flowId===null&&l.done?!1:o&&l.path.some(c=>!o.has(c))?(l.flowId!==null&&this.persistent.delete(l.flowId),!1):!0)}setDisplay(e){this._display=e}particles(){var r;const e=this._display,t=this._theme,n=[];if(!e||!t){for(const o of this.flows)for(const a of o.particles)n.push({x:0,y:0,z:0,color:"#ffffff"});return n}const i=this.now();for(const o of this.flows){const a=xc(o.path,e),l=(t.flow.baseSpeed??0)*this._speedOf(o),c=a>0&&l>0?a/l:0,h=((r=this.store.flowTypes)==null?void 0:r[o.flowType])??null,d=l0(o,h,t),u=o.size??(h==null?void 0:h.size)??t.flow.size;for(const f of o.particles){const g=c>0?(i-f.born)/c:0,_=a0(o.path,g,e);_&&n.push({x:_.x,y:_.y,z:_.z,color:d,size:u})}}return n}prepare(e,t){this._display=e,this._theme=t}}class u0{constructor(e,t,n){this.scene=e,this.store=t,this.controller=n,this.theme=null,this.capacity=0,this.mesh=null,this._matrix=new it,this._color=new Ve,this._ensureCapacity(1024)}_ensureCapacity(e){var r;if(this.mesh&&e<=this.capacity)return;const t=Math.max(1024,2**Math.ceil(Math.log2(Math.max(1,e))));this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh.dispose());const n=new Ts(o0,vc,vc),i=new mr({color:16777215,transparent:!0,opacity:((r=this.theme)==null?void 0:r.flow.opacity)??.85,blending:cs,depthWrite:!1});this.mesh=new ch(n,i,t),this.mesh.count=0,this.mesh.frustumCulled=!1,this.scene.add(this.mesh),this.capacity=t}applyTheme(e){this.theme=e,this.mesh&&(this.mesh.material.opacity=e.flow.opacity)}update(e,t,n){this.theme=t,this.controller.prepare(n,t),this.controller.update(e,t);const i=this.controller.particles();this._ensureCapacity(i.length);const r=this.mesh;for(let o=0;o<i.length;o+=1){const a=i[o],l=a.size??t.flow.size;this._matrix.makeScale(l,l,l),this._matrix.setPosition(a.x,a.y,a.z),r.setMatrixAt(o,this._matrix),this._color.set(a.color),r.setColorAt(o,this._color)}r.count=i.length,r.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0)}particleCount(){return this.mesh?this.mesh.count:0}dispose(){this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh.dispose(),this.mesh=null)}}const Ho=12,d0=.5;function f0(s,e,t,n=Ho){const i=(s.x+e.x)/2,r=(s.y+e.y)/2,o=(s.z+e.z)/2;let a=i,l=r,c=o;const h=e.x-s.x,d=e.y-s.y,u=e.z-s.z,f=Math.hypot(h,d,u);if(t>0&&f>0){const _=h/f,p=d/f,m=u/f;let M=-m,x=0,E=_;Math.hypot(M,x,E)<1e-6&&(M=0,x=m,E=-p);const R=Math.hypot(M,x,E)||1,w=t*f*d0;a=i+M/R*w,l=r+x/R*w,c=o+E/R*w}const g=[];for(let _=0;_<=n;_+=1){const p=_/n,m=1-p,M=m*m,x=2*m*p,E=p*p;g.push({x:M*s.x+x*a+E*e.x,y:M*s.y+x*l+E*e.y,z:M*s.z+x*c+E*e.z})}return g}const p0=8,m0=.75,yc=.6,wi=600,Sc="__default",Mc={sphere:()=>new Ts(3,12,8),box:()=>new ki(4.8,4.8,4.8),octahedron:()=>new Ko(3.6),tetrahedron:()=>new Zo(4.2)};class g0{constructor(e,t,n,{onCameraReady:i=()=>{}}={}){this.container=e,this.store=t,this.engine=n,this.onCameraReady=i,this.display=new Map,this.theme=gh("modern"),this.scene=new T_,this.camera=null,this.controls=null,this.webgl=new E_({antialias:!0}),this.webgl.setSize(e.clientWidth,e.clientHeight,!1),this.webgl.setPixelRatio(window.devicePixelRatio),this.webgl.domElement.style.cssText="display:block;width:100%;height:100%",e.appendChild(this.webgl.domElement),this.ambient=new I_,this.scene.add(this.ambient),this.sun=new D_,this.sun.position.set(1,2,3),this.scene.add(this.sun),this.meshes=new Map,this._counts=new Map,this.composer=null,this.bloomPass=null,this.bloomDisabled=!1,this.onFrame=null,this.edgeCapacity=0,this.edgeLines=null,this.edgeStyle="line",this.edgeElasticity=0,this._ensureEdgeCapacity(8192),this.clock=new dh,this._matrix=new it,this.raycaster=new N_,this._pointer=new Oe,this._tmpColor=new Ve,this._bgColor=new Ve,this._edgeColor=new Ve,this._edgeBase=new Ve("#666666"),this._edgeGlow=new Ve("#eaf2ff"),this.frameIndex=0,this._boundsStamp=-1,this.highlightSet=null,this.focusId=null,this.focusElapsed=0,this._focusFrom=new V,this.labels=new s0(this.scene,t,n),this.flowController=new h0(t,{}),this.flows=new u0(this.scene,t,this.flowController),this.applyTheme(this.theme),t.subscribe(r=>{r.kind==="init"&&!this.camera&&this._initCamera(t.config.dimensions)}),this._onResizeBound=()=>this._onResize(),window.addEventListener("resize",this._onResizeBound)}dispose(){var e,t,n;this.webgl.setAnimationLoop(null),window.removeEventListener("resize",this._onResizeBound);for(const i of this.meshes.values())i.geometry.dispose(),i.material.dispose();this.edgeLines&&(this.edgeLines.geometry.dispose(),this.edgeLines.material.dispose()),(e=this.flows)!=null&&e.mesh&&(this.flows.mesh.geometry.dispose(),this.flows.mesh.material.dispose());for(const i of[...this.labels.active.values(),...this.labels.pool])i.dispose();(t=this.bloomPass)==null||t.dispose(),(n=this.composer)==null||n.dispose(),this.webgl.dispose(),this.webgl.domElement.remove()}applyTheme(e){this.theme=e,this._bgColor.set(e.background),this.scene.background=new Ve(e.background),this.ambient.color.set(e.lights.ambient.color),this.ambient.intensity=e.lights.ambient.intensity,this.sun.color.set(e.lights.directional.color),this.sun.intensity=e.lights.directional.intensity,this._edgeBase.set(e.edge.color),this._edgeGlow.set(e.edge.glow??"#6fb8e8"),this.edgeLines.material.opacity=e.edge.opacity;for(const t of this.meshes.values())t.material.emissive.set(e.node.emissive),t.material.emissiveIntensity=e.node.emissiveIntensity;this.labels.applyTheme(e),this.flows.applyTheme(e),this._syncBloom()}setEdgeStyle({style:e,elasticity:t}={}){this.edgeStyle=e==="spline"?"spline":"line",this.edgeElasticity=Math.max(0,Math.min(1,t??0))}_syncBloom(){const e=!!(this.theme.bloom.enabled&&!this.bloomDisabled&&this.camera);if(e&&!this.composer){const t=new Oe;this.webgl.getSize(t),this.composer=new J_(this.webgl),this.composer.setPixelRatio(this.webgl.getPixelRatio()),this.composer.setSize(t.x,t.y),this.composer.addPass(new Q_(this.scene,this.camera)),this.bloomPass=new Oi(t.clone(),this.theme.bloom.strength,this.theme.bloom.radius,this.theme.bloom.threshold),this.composer.addPass(this.bloomPass)}else!e&&this.composer?(this.bloomPass.dispose(),this.composer.dispose(),this.composer=null,this.bloomPass=null):this.composer&&(this.bloomPass.strength=this.theme.bloom.strength,this.bloomPass.radius=this.theme.bloom.radius,this.bloomPass.threshold=this.theme.bloom.threshold)}disableBloom(){this.bloomDisabled=!0,this._syncBloom()}setPixelRatio(e){var t;this.webgl.setPixelRatio(e),(t=this.composer)==null||t.setPixelRatio(e)}_buildCamera(e){const t=this.container.clientWidth/this.container.clientHeight;e===2?(this.camera=new Ms(-wi*t,wi*t,wi,-wi,-1e4,1e4),this.camera.position.set(0,0,1e3),this.controls=new nc(this.camera,this.webgl.domElement),this.controls.enableDamping=!0,this.controls.enableRotate=!1,this.controls.screenSpacePanning=!0,this.controls.mouseButtons={LEFT:_n.PAN,MIDDLE:_n.DOLLY,RIGHT:_n.PAN},this.controls.touches={ONE:Un.PAN,TWO:Un.DOLLY_PAN}):(this.camera=new jt(60,t,1,5e4),this.camera.position.set(0,0,900),this.controls=new nc(this.camera,this.webgl.domElement),this.controls.enableDamping=!0,this.controls.minDistance=20,this.controls.maxDistance=2e4)}_initCamera(e){this.camera||(this._buildCamera(e),this.onCameraReady())}setDimensions(e){var t,n;this.camera&&(this.camera.isOrthographicCamera?2:3)===e||((t=this.controls)==null||t.dispose(),this.composer&&((n=this.bloomPass)==null||n.dispose(),this.composer.dispose(),this.composer=null,this.bloomPass=null),this._buildCamera(e),this.onCameraReady())}resize(){this._onResize()}_onResize(){var t,n;if(this.webgl.setSize(this.container.clientWidth,this.container.clientHeight,!1),!this.camera)return;const e=this.container.clientWidth/this.container.clientHeight;this.camera.isOrthographicCamera?(this.camera.left=-wi*e,this.camera.right=wi*e):this.camera.aspect=e,this.camera.updateProjectionMatrix(),(t=this.composer)==null||t.setSize(this.container.clientWidth,this.container.clientHeight),(n=this.bloomPass)==null||n.setSize(this.container.clientWidth,this.container.clientHeight)}_ensureMesh(e,t,n){let i=this.meshes.get(e);if(i&&i.userData.shape===t&&n<=i.userData.capacity)return i;const r=Math.max(256,2**Math.ceil(Math.log2(Math.max(1,n))));i&&(this.scene.remove(i),i.geometry.dispose(),i.material.dispose(),i.dispose());const o=(Mc[t]??Mc.sphere)(),a=new P_({color:16777215,roughness:.4,emissive:new Ve(this.theme.node.emissive),emissiveIntensity:this.theme.node.emissiveIntensity});return i=new ch(o,a,r),i.count=0,i.userData={shape:t,capacity:r,ids:[],cursor:0},this.scene.add(i),this.meshes.set(e,i),i}_ensureEdgeCapacity(e){if(e<=this.edgeCapacity)return;const t=Math.max(8192,2**Math.ceil(Math.log2(e)));this.edgeLines&&(this.scene.remove(this.edgeLines),this.edgeLines.geometry.dispose(),this.edgeLines.material.dispose());const n=new Gt;n.setAttribute("position",new zt(new Float32Array(t*3),3)),n.setAttribute("color",new zt(new Float32Array(t*3),3)),n.setDrawRange(0,0),this.edgeLines=new R_(n,new hh({vertexColors:!0,transparent:!0,opacity:this.theme.edge.opacity})),this.edgeLines.frustumCulled=!1,this.scene.add(this.edgeLines),this.edgeCapacity=t}start(){this.webgl.setAnimationLoop(()=>this._frame())}_frame(){const e=this.clock.getDelta();this.camera&&(this.frameIndex+=1,this.onFrame&&this.onFrame(e),this._syncNodes(e),this._syncEdges(),this.labels.update(e,this.camera,this.highlightSet,this.display),this.flows.update(e,this.theme,this.display),this._stepFocus(e),this.controls.update(),this._syncBloom(),this.composer?this.composer.render():this.webgl.render(this.scene,this.camera))}_meshKey(e){return e&&e.type!=null&&this.store.nodeTypes[e.type]?e.type:Sc}_syncNodes(e){const{ids:t,positions:n}=this.engine,i=Math.min(t.length,n.length/3),r=Math.min(1,e*p0),o=new Set;for(let a=0;a<i;a+=1){const l=t[a];o.add(l);const c=n[a*3],h=n[a*3+1],d=n[a*3+2];let u=this.display.get(l);u||(u=new V(c,h,d),this.display.set(l,u)),u.x+=(c-u.x)*r,u.y+=(h-u.y)*r,u.z+=(d-u.z)*r}for(const a of this.display.keys())o.has(a)||this.display.delete(a);this._counts.clear();for(let a=0;a<i;a+=1){const l=this._meshKey(this.store.nodes.get(t[a]));this._counts.set(l,(this._counts.get(l)??0)+1)}for(const[a,l]of this._counts){const c=a===Sc?this.theme.node.shape:this.store.nodeTypes[a].shape??this.theme.node.shape,h=this._ensureMesh(a,c,l);h.userData.cursor=0,h.userData.ids.length=l}for(const[a,l]of this.meshes)this._counts.has(a)||(l.count=0,l.userData.ids.length=0);for(let a=0;a<i;a+=1){const l=t[a],c=this.store.nodes.get(l)??{id:l,type:null,meta:{}},h=this.meshes.get(this._meshKey(c)),d=h.userData.cursor;h.userData.cursor+=1,h.userData.ids[d]=l;const u=_h(c,this.store.nodeTypes,this.theme),f=this.display.get(l);this._matrix.makeScale(u.size,u.size,u.size),this._matrix.setPosition(f.x,f.y,f.z),h.setMatrixAt(d,this._matrix),this._tmpColor.set(u.color),this.highlightSet!==null&&!this.highlightSet.has(l)&&this._tmpColor.lerp(this._bgColor,m0),h.setColorAt(d,this._tmpColor)}for(const[a,l]of this.meshes)this._counts.has(a)&&(l.count=l.userData.cursor,l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0))}_syncEdges(){const{edges:e}=this.store,t=this.edgeStyle==="spline"&&this.edgeElasticity>0,n=t?Ho*2:2;this._ensureEdgeCapacity(e.size*n);const i=this.edgeLines.geometry.getAttribute("position"),r=this.edgeLines.geometry.getAttribute("color");let o=0;for(const a of e.values()){const l=this.display.get(a.source),c=this.display.get(a.target);if(!l||!c)continue;const h=this._edgeColor,d=a.meta?Number(a.meta.brightness):NaN;if(a.meta&&a.meta.color?h.set(a.meta.color):Number.isFinite(d)?h.copy(this._edgeBase).lerp(this._edgeGlow,Math.max(0,Math.min(1,d))):h.copy(this._edgeBase),t){const u=f0(l,c,this.edgeElasticity,Ho);for(let f=0;f<u.length-1;f+=1)i.setXYZ(o,u[f].x,u[f].y,u[f].z),r.setXYZ(o,h.r,h.g,h.b),o+=1,i.setXYZ(o,u[f+1].x,u[f+1].y,u[f+1].z),r.setXYZ(o,h.r,h.g,h.b),o+=1}else i.setXYZ(o,l.x,l.y,l.z),r.setXYZ(o,h.r,h.g,h.b),o+=1,i.setXYZ(o,c.x,c.y,c.z),r.setXYZ(o,h.r,h.g,h.b),o+=1}this.edgeLines.geometry.setDrawRange(0,o),i.needsUpdate=!0,r.needsUpdate=!0}nodeCount(){let e=0;for(const t of this.meshes.values())e+=t.count;return e}pick(e,t){if(!this.camera||this.meshes.size===0)return null;const n=this.webgl.domElement.getBoundingClientRect();if(this._pointer.x=(e-n.left)/n.width*2-1,this._pointer.y=-((t-n.top)/n.height)*2+1,this._boundsStamp!==this.frameIndex){for(const o of this.meshes.values())o.count>0&&o.computeBoundingSphere();this._boundsStamp=this.frameIndex}this.raycaster.setFromCamera(this._pointer,this.camera);const i=[...this.meshes.values()].filter(o=>o.count>0),r=this.raycaster.intersectObjects(i,!1)[0];return!r||r.instanceId===void 0?null:r.object.userData.ids[r.instanceId]??null}viewState(){if(!this.camera||!this.controls)return null;const e=this.camera.position,t=this.controls.target;return{position:{x:e.x,y:e.y,z:e.z},target:{x:t.x,y:t.y,z:t.z},zoom:this.camera.zoom}}setHighlight(e){this.highlightSet=e}focusOn(e){this.controls&&(this.focusId=e,this.focusElapsed=0,this._focusFrom.copy(this.controls.target))}_stepFocus(e){if(this.focusId===null)return;if(!this.store.nodes.has(this.focusId)){this.focusId=null;return}const t=this.display.get(this.focusId);if(!t)return;this.focusElapsed=Math.min(this.focusElapsed+e,yc);const n=this.focusElapsed/yc,i=1-(1-n)**3;this.controls.target.lerpVectors(this._focusFrom,t,i),n>=1&&(this.focusId=null)}}const _0=Object.freeze({physicsRunning:!0,edgeStyle:"line",edgeElasticity:.3,dimensions:3});function v0(s){return String(s??"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"viewbase"}function Rh(s){return`vb-options:${v0(s)}`}function x0(s,e=globalThis.localStorage,t=_0){if(!e)return{...t};try{const n=e.getItem(Rh(s));if(!n)return{...t};const i=JSON.parse(n);return{...t,...i}}catch{return{...t}}}function bo(s,e,t=globalThis.localStorage){t&&t.setItem(Rh(s),JSON.stringify(e))}const bc=24,Ec=40,y0=24;class S0 extends fr{constructor({screenId:e,container:t,manager:n,optionsProvider:i,onResize:r}){if(super({id:`__graph@${e??"default"}`,title:"Graf",widthChars:80,container:t,manager:n,kind:"graph",closable:!1,optionsProvider:i}),this.onResize=r,this._buildBody(),this._mount(),!this.size){const o=this._bounds();this._applySize(Math.max(wc,o.width-2*bc),Math.max(Ac,o.height-Ec-y0)),this._place(bc,Ec)}}_buildBody(){const e=document.createElement("div");e.dataset.role="graph-body",e.style.cssText="position:relative;overflow:hidden",this.body=e,this.el.appendChild(e)}_applySize(e,t){var n;super._applySize(e,t),this.body.style.overflow="hidden",(n=this.onResize)==null||n.call(this)}setTitle(e){this.title=e,this.titleEl.textContent=e}setMetrics(e){this.metricsEl||(this.metricsEl=document.createElement("span"),this.metricsEl.dataset.role="graph-metrics",this.metricsEl.style.cssText=["font-weight:400","font-size:11px","opacity:0.8","white-space:nowrap","flex:0 0 auto"].join(";"),this.bar.insertBefore(this.metricsEl,this.minGadget)),this.metricsEl.textContent=e}_renderBody(){}}function M0(s){const{screenId:e,store:t,sendEvent:n,windowManager:i,setOptionsFallback:r,onThemeChange:o,applyTheme:a}=s,l=new H_(t);let c=null,h=!0,d=!1;function u(){l.setPaused(d||!h)}let f=null;i.registerType("graph",()=>i.adopt(new S0({screenId:e,container:s.container,manager:i,optionsProvider:()=>c,onResize:()=>f==null?void 0:f.resize()})));const g=i.open("graph");r(()=>c);function _(y,v){const L=v??t.config.highlight_neighbors??1,P=fu(t,y,L);f.setHighlight(P.size>0?P:null)}let p=null;f=new g0(g.body,t,l,{onCameraReady:()=>{const y=f.camera.isOrthographicCamera;p?p.setCameraControls(f.camera,f.controls,y):(new G_(f.webgl.domElement,(L,P)=>f.pick(L,P),n,{onNodeClick:L=>{var I;const P=t.config.highlight_neighbors??1;P>0&&_(L,P),f.focusOn(L),(I=t.config.detail_window)!=null&&I.open_on_click&&i.open("detail",{nodeId:L})},onBackgroundClick:()=>{f.setHighlight(null)}}),p=new B_(f.camera,f.controls,{is2d:y}));const v=To(()=>{const L=f.viewState();L&&n(os("view_change",L))},100);f.controls.addEventListener("change",v)}}),o(y=>f.applyTheme(y));function m(y){f.setDimensions(y),l.setDimensions(y),t.config.dimensions=y}function M(y,v){c=[{key:"physics-running",label:"Fyzika běží",checked:v.physicsRunning,onToggle:L=>{v.physicsRunning=L,h=L,u(),bo(y,v),M(y,v)}},{key:"edge-spline",label:"Křivkové hrany (splajn)",checked:v.edgeStyle==="spline",onToggle:L=>{v.edgeStyle=L?"spline":"line",f.setEdgeStyle({style:v.edgeStyle,elasticity:v.edgeElasticity}),bo(y,v),M(y,v)}},{key:"dimensions-3d",label:"3D pohled",checked:v.dimensions===3,onToggle:L=>{v.dimensions=L?3:2,m(v.dimensions),bo(y,v),M(y,v)}}],i.refreshOptions()}function x(y){var P,I;const v={physicsRunning:!0,edgeStyle:((P=t.config.edge_style)==null?void 0:P.style)??"line",edgeElasticity:((I=t.config.edge_style)==null?void 0:I.elasticity)??.3,dimensions:t.config.dimensions??3},L=x0(y,void 0,v);h=L.physicsRunning,u(),f.setEdgeStyle({style:L.edgeStyle,elasticity:L.edgeElasticity}),m(L.dimensions),M(y,L)}const E=y=>{y===1&&f.disableBloom(),y===2&&f.setPixelRatio(1)},R=new W_(E);let w=null;function T(y){y<=0||(w=w===null?1/y:w+(1/y-w)*Math.min(1,y*2))}const U=To(()=>{const y=w===null?"–":Math.round(w),v=(t.config.dimensions??3)===3?"3D":"2D";g.setMetrics(`${v} · ${t.nodes.size} uzlů · ${y} fps`)},500);return f.start(),{name:"graph",onInit(){g.setTitle(t.config.title||"Graf"),f.flowController.replayInit(t.flows??[]),f.setEdgeStyle(t.config.edge_style??{style:"line",elasticity:0}),x(t.config.title);const y=t.config.quality??"auto";y==="low"&&(E(1),E(2)),f.onFrame=v=>{T(v),U(),y==="auto"&&R.frame(v)}},actions:{focus:y=>f.focusOn(y.node_id),highlight:y=>_(y.node_id,y.depth),flow:y=>f.flowController.applyFlow(y),stop_flow:y=>f.flowController.stopFlow(y.flow_id),set_theme:y=>{t.config.theme=y.theme,a(y.theme)},set_edge_style:y=>f.setEdgeStyle(y),define_type:y=>t.applyNodeType(y.name,y.style)},setVisible(y){y?f.start():f.webgl.setAnimationLoop(null)},setResourcesPaused(y){d=y,u()},destroy(){l.terminate(),f.dispose()}}}const b0=8,E0=220;function T0(s){const e=Number(s);return!Number.isFinite(e)||e<=0?60:Math.max(20,Math.round(e/b0))}class w0 extends fr{constructor({id:e,title:t,prompt:n,width:i,onInput:r,container:o,manager:a,closable:l,input:c}){super({id:e,title:t,widthChars:T0(i),container:o,manager:a,kind:"terminal",closable:l}),this.prompt=n??"> ",this.hasInput=c!==!1,this.onInput=r,this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="terminal-body",e.style.cssText=["padding:6px 8px",`width:${this.widthChars}ch`,"max-width:92vw","font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace","display:flex","flex-direction:column","gap:6px"].join(";");const t=document.createElement("div");if(t.dataset.role="terminal-output",t.style.cssText=[`height:${E0}px`,"flex:1 1 auto","min-height:0","overflow-y:auto","white-space:pre-wrap","word-break:break-word","background:var(--vb-window-output-bg, rgba(0,0,0,0.06))","border-radius:4px","padding:6px 8px"].join(";"),this.output=t,e.append(t),this.hasInput){const n=document.createElement("div");n.style.cssText="display:flex;align-items:center;gap:4px";const i=document.createElement("span");i.textContent=this.prompt,i.style.cssText="color:var(--vb-window-key, #667788);flex:0 0 auto";const r=document.createElement("input");r.type="text",r.dataset.role="terminal-input",r.style.cssText="flex:1 1 auto;min-width:0;font:inherit",r.addEventListener("keydown",o=>{if(o.key!=="Enter")return;o.stopPropagation();const a=r.value.trim();r.value="",a&&this._submit(a)}),this.input=r,n.append(i,r),e.append(n)}this.body=e,this.el.appendChild(e)}_submit(e){this.onInput&&this.onInput({window_id:this.id,line:e})}append(e){const t=document.createElement("div");t.textContent=String(e??""),this.output.appendChild(t),this.output.scrollTop=this.output.scrollHeight}_renderBody(){}}function A0({container:s,windowManager:e,sendEvent:t}){return e.registerType("terminal",n=>{var r;(r=e.get(n.window_id))==null||r.close();const i=e.adopt(new w0({id:n.window_id,title:n.title,prompt:n.prompt,width:n.width,closable:n.closable,input:n.input,onInput:o=>t({type:"event",event:"terminal_input",payload:o}),container:s,manager:e}));return i.bringToFront(),i}),{name:"terminal",actions:{terminal_append:n=>{const i=e.get(n.window_id);i&&i.kind==="terminal"&&i.append(n.text)}}}}class C0{constructor({container:e,sendEvent:t}){this.container=e,this.sendEvent=t,this.remoteGroups=[],this.optionsGroup=null,this.openGroup=null,this.el=document.createElement("div"),this.el.dataset.role="vb-screen-menu",this.el.style.cssText=["position:absolute","top:0","left:0","right:0","z-index:1400","font:12px system-ui,sans-serif"].join(";"),this.bar=document.createElement("div"),this.bar.dataset.role="vb-screen-menu-bar",this.bar.style.cssText=["display:grid","grid-template-columns:1fr auto 1fr","align-items:center","height:26px","padding:0 6px","background:rgba(230,230,235,0.95)","border:1px solid rgba(0,0,0,0.4)","box-sizing:border-box","cursor:ns-resize","user-select:none"].join(";"),this.el.appendChild(this.bar),this.groupsEl=document.createElement("div"),this.groupsEl.style.cssText="display:flex;justify-self:start;min-width:0",this.bar.appendChild(this.groupsEl),this.titleEl=document.createElement("span"),this.titleEl.dataset.role="vb-screen-bar-title",this.titleEl.style.cssText=["overflow:hidden","text-overflow:ellipsis","white-space:nowrap","font-weight:600","justify-self:center","min-width:0"].join(";"),this.bar.appendChild(this.titleEl),this.gadgetsEl=document.createElement("div"),this.gadgetsEl.style.cssText="display:flex;gap:3px;justify-self:end",this.bar.appendChild(this.gadgetsEl),this.dropdown=document.createElement("div"),this.dropdown.dataset.role="vb-screen-menu-dropdown",this.dropdown.style.cssText=["position:absolute","top:100%","left:0","display:none","background:#d4d4d4","border:1px solid #000","min-width:190px","box-shadow:0 4px 8px rgba(0,0,0,0.3)"].join(";"),this.el.appendChild(this.dropdown),e.appendChild(this.el),this._onOutsideClick=n=>{this.el.contains(n.target)||this._closeDropdown()},document.addEventListener("pointerdown",this._onOutsideClick)}setTitle(e){this.titleEl.textContent=e}addGadget(e,t,n,i){const r=document.createElement("button");return r.dataset.role=e,r.title=n,r.style.cssText=["width:20px","height:16px","padding:0","border:none","flex:none","cursor:pointer","background:#000",`-webkit-mask:url("${t}") center/100% 100% no-repeat`,`mask:url("${t}") center/100% 100% no-repeat`].join(";"),r.addEventListener("pointerdown",o=>o.stopPropagation()),r.addEventListener("click",o=>{o.stopPropagation(),i()}),this.gadgetsEl.appendChild(r),r}setSpec(e){this.remoteGroups=e&&Array.isArray(e.groups)?e.groups:[],this._render()}setOptionsGroup(e){this.optionsGroup=e?{name:"Options",items:e,local:!0}:null,this._render()}_allGroups(){return this.optionsGroup?[this.optionsGroup,...this.remoteGroups]:this.remoteGroups}_render(){this.groupsEl.replaceChildren();const e=this._allGroups();for(const t of e){const n=document.createElement("button");n.dataset.role="vb-menu-group",n.dataset.group=t.name,n.textContent=t.name;const i=t.name===this.openGroup;n.style.cssText=["padding:4px 12px","border:none","cursor:pointer","font:inherit",i?"background:#3b7bc4;color:#fff":"background:transparent;color:#000"].join(";"),n.addEventListener("pointerdown",r=>r.stopPropagation()),n.addEventListener("click",r=>{r.stopPropagation(),this._toggleGroup(t)}),this.groupsEl.appendChild(n)}if(this.openGroup){const t=e.find(n=>n.name===this.openGroup);t?this._renderDropdown(t):this._closeDropdown()}}_toggleGroup(e){if(this.openGroup===e.name){this._closeDropdown();return}this.openGroup=e.name,this._render(),this._renderDropdown(e)}_renderDropdown(e){this.dropdown.replaceChildren();for(const t of e.items){const n=document.createElement("div");n.dataset.role="vb-menu-item",n.style.cssText=["padding:5px 16px","cursor:pointer","white-space:nowrap","display:flex","align-items:center","justify-content:space-between","gap:16px","color:#000"].join(";");const i=document.createElement("span");if(i.textContent=t.label,n.appendChild(i),e.local){n.dataset.itemKey=t.key;const r=document.createElement("span");r.dataset.role="vb-menu-checkbox",r.textContent=t.checked?"✓":"",r.style.cssText="width:1em;display:inline-block;font-weight:700",n.appendChild(r),n.addEventListener("click",o=>{o.stopPropagation(),t.onToggle(!t.checked),this._closeDropdown()})}else n.dataset.itemId=t.id,n.addEventListener("click",r=>{r.stopPropagation(),this.sendEvent({type:"event",event:"menu_select",payload:{item_id:t.id}}),this._closeDropdown()});n.addEventListener("pointerenter",()=>{n.style.background="#3b7bc4",n.style.color="#fff"}),n.addEventListener("pointerleave",()=>{n.style.background="",n.style.color="#000"}),this.dropdown.appendChild(n)}this.dropdown.style.display="block"}_closeDropdown(){this.openGroup!==null&&(this.openGroup=null,this.dropdown.style.display="none",this._render())}destroy(){document.removeEventListener("pointerdown",this._onOutsideClick),this.el.remove()}}class R0{constructor(e,t=()=>{}){this.container=e,this.onOptionsChange=t,this.types=new Map,this.windows=new Map,this.optionsSource=null,this.z=900,this.dockSlots=[]}registerType(e,t){this.types.set(e,t)}open(e,t){const n=this.types.get(e);return n?n(t):(console.warn(`viewbase: neznámý typ okna '${e}'`),null)}adopt(e){return this.windows.set(e.id,e),e}get(e){return this.windows.get(e)??null}close(e){var t;(t=this.windows.get(e))==null||t.close()}_setActive(e){e.getOptionsItems()!=null&&(this.optionsSource=e),this.refreshOptions()}refreshOptions(){var e;this.onOptionsChange(((e=this.optionsSource)==null?void 0:e.getOptionsItems())??null)}applyTheme(){for(const e of this.windows.values())e.applyTheme()}_nextZ(){return this.z+=1,this.z}_assignDockSlot(e){let t=this.dockSlots.indexOf(null);return t===-1?(t=this.dockSlots.length,this.dockSlots.push(e)):this.dockSlots[t]=e,e._dockSlot=t,t}_releaseDockSlot(e){const t=e._dockSlot;t!=null&&this.dockSlots[t]===e&&(this.dockSlots[t]=null),e._dockSlot=null}_forget(e){const t=this.windows.get(e);if(this.windows.delete(e),t!==this.optionsSource)return;let n=null;for(const i of this.windows.values())i.getOptionsItems()!=null&&(!n||Number(i.el.style.zIndex)>Number(n.el.style.zIndex))&&(n=i);this.optionsSource=n,this.refreshOptions()}}function P0({container:s,screenId:e,connection:t}){const n=new cr,i=g=>t.send({...g,screen_id:e}),r=new C0({container:s,sendEvent:i});let o=()=>null;const a=new R0(s,g=>r.setOptionsGroup(g??o())),l=[];function c(g){const _=gh(g);ov(_,s),a.applyTheme(),s.style.background=_.background??"#000";for(const p of l)p(_)}const h={container:s,screenId:e,store:n,sendEvent:i,windowManager:a,onThemeChange:g=>l.push(g),setOptionsFallback:g=>{o=g},applyTheme:c},d=[M0(h),nu(h),du(h),cu(h),A0(h)],f=Object.assign({},{open_window:g=>a.open(g.kind==="terminal"?"terminal":"control",g),close_window:g=>a.close(g.window_id),open_menu:g=>{n.menu={groups:g.groups},r.setSpec(n.menu)}},...d.map(g=>g.actions??{}));return n.subscribe(g=>{var _;if(g.kind==="init"){c(n.config.theme),r.setSpec(n.menu);for(const p of n.windows??[])a.open(p.kind==="terminal"?"terminal":"control",p);n.config.title&&(document.title=`${n.config.title} – viewbase`);for(const p of d)(_=p.onInit)==null||_.call(p)}}),{screenId:e,container:s,store:n,bar:r,windowManager:a,handleAction(g){const _=f[g.action];_?_(g):console.warn("viewbase: neznámá akce",g.action)},openLog:()=>a.open("log"),logWindow:()=>a.get(Vo),setActive(g){var _;s.style.display=g?"block":"none";for(const p of d)(_=p.setVisible)==null||_.call(p,g)},setFullyHidden(g){var _;for(const p of d)(_=p.setResourcesPaused)==null||_.call(p,g)},destroy(){var g;for(const _ of d)(g=_.destroy)==null||g.call(_);r.destroy(),s.remove()}}}const U0=200;class L0{constructor(e,t){this.rootContainer=e,this.connection=t,this.instances=new Map,this.order=[],this.zOrder=[],this.offsets=new Map,this.dragState=null,this.pendingLogs=[],this.logAutoOpened=!1,window.addEventListener("pointerup",()=>{this.dragState=null}),window.addEventListener("pointercancel",()=>{this.dragState=null})}get activeId(){return this.zOrder[0]}_createContainer(e){const t=document.createElement("div");return t.dataset.role="vb-screen",t.dataset.screenId=String(e),t.style.cssText="position:absolute;inset:0",this.rootContainer.appendChild(t),t}_register(e,t){if(this.instances.set(e,t),this.order.push(e),this.offsets.set(e,0),this.zOrder.push(e),this._wireScreenChrome(e,t),this._layout(),this.pendingLogs.length>0){const n=this.pendingLogs;this.pendingLogs=[];for(const i of n)this.appendLog(i)}}ensure(e){let t=this.instances.get(e);return t||(t=P0({container:this._createContainer(e),screenId:e,connection:this.connection}),t.store.subscribe(n=>{n.kind==="init"&&this._renderTitle(e)}),this._register(e,t),t)}resolveStore(e){return this.ensure(e).store}appendLog(e){const t=[...this.instances.values()].map(n=>n.logWindow()).filter(Boolean);if(t.length===0){if(this.logAutoOpened)return;const n=this.instances.get(this.zOrder[0]);if(!n){this.pendingLogs.length<U0&&this.pendingLogs.push(e);return}this.logAutoOpened=!0,t.push(n.openLog())}for(const n of t)n.append(e)}routeAction(e){var t;(t=this.instances.get(e.screen_id??null))==null||t.handleAction(e)}cycleNext(){this.zOrder.length<2||(this.zOrder=Wh(this.zOrder),this.offsets.set(this.zOrder[0],0),this.offsets.set(this.zOrder[1],0),this._layout())}_layout(){this.zOrder.forEach((e,t)=>{const n=this.instances.get(e),i=this.offsets.get(e)??0;t===0?(n.setActive(!0),n.container.style.zIndex="20",n.container.style.transform=_a(i,n.container.clientHeight||0)):t===1?(n.setActive(!0),n.container.style.zIndex="10",n.container.style.transform=_a(i,n.container.clientHeight||0)):(n.setActive(!1),n.container.style.zIndex="0",n.container.style.transform=""),n.setFullyHidden(t>=2)})}remove(e){const t=this.instances.get(e);t&&(t.logWindow()&&(this.logAutoOpened=!1),t.destroy(),this.instances.delete(e),this.order=this.order.filter(n=>n!==e),this.zOrder=this.zOrder.filter(n=>n!==e),this.offsets.delete(e),this.zOrder.length>0&&this._layout())}_renderTitle(e){var n,i,r;const t=this.instances.get(e);t&&((r=t.bar)==null||r.setTitle(((i=(n=t.store)==null?void 0:n.config)==null?void 0:i.title)||`Screen ${e}`))}_wireScreenChrome(e,t){const n=t.bar;n&&(this._renderTitle(e),n.addGadget("vb-screen-switch",iu,"Přepnout na další screen",()=>this.cycleNext()),this._wireDrag(e,n.bar))}_wireDrag(e,t){Eo(t,{onStart:n=>this.zOrder[0]!==e?null:(this.dragState={screenId:e,startY:n.clientY,startOffset:this.offsets.get(e)??0},this.dragState),onMove:(n,i)=>{const r=this.instances.get(e);if(!r)return;const o=n.clientY-i.startY,a=Vh(i.startOffset,o,r.container.clientHeight||0);this.offsets.set(e,a),this._layout()},onEnd:()=>{this.dragState=null}})}}const Ph=new kh,Jn=new Bh;window.addEventListener("error",s=>{Jn.show("frontend_error",`${s.message}
${s.filename}:${s.lineno}:${s.colno}`)});window.addEventListener("unhandledrejection",s=>{var e;Jn.show("frontend_error",String(((e=s.reason)==null?void 0:e.stack)??s.reason))});function D0(){try{const s=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(s.getContext("webgl2")||s.getContext("webgl")))}catch{return!1}}function I0(){const s=document.getElementById("app");let e;const t=location.protocol==="https:"?"wss":"ws",n=new Nh(`${t}://${location.host}/ws`,null,{resolveStore:i=>e.resolveStore(i),onStatus:i=>{i==="init"?(Ph.hide(),Jn.dismissIfConnectionRecovered()):i==="close"?Jn.show("connection_lost","Connection Lost"):i==="connect_failed"?Jn.show("connection_lost","Connection Failed"):i==="protocol_mismatch"&&Jn.show("connection_lost","Protocol Mismatch — reload the page (F5)")},onAction:i=>{i.action==="screen_remove"?e.remove(i.screen_id):e.routeAction(i)},onLog:i=>{i.timestamp=new Date,e.appendLog(i),i.level==="error"&&Jn.show("backend_error",Pc(i))}});e=new L0(s,n),n.connect(),window.__viewbase={screenManager:e,connection:n}}D0()?I0():Ph.show("Tento prohlížeč nemá dostupné WebGL – vizualizaci nelze spustit. Zkus jiný prohlížeč nebo zapni hardwarovou akceleraci.");
