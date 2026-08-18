(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const jh=1;function qh(){return{type:"hello",protocol:jh}}function Ma(s){return JSON.stringify(s)}function Kh(s){const e=JSON.parse(s);if(!e||typeof e!="object"||!e.type)throw new Error("Neplatná zpráva protokolu");return e}class Zh{constructor(e,t,{WebSocketImpl:n=globalThis.WebSocket,schedule:i=(d,u)=>setTimeout(d,u),minBackoff:r=500,maxBackoff:o=1e4,onStatus:a=()=>{},onAction:l=()=>{},onLog:c=()=>{},resolveStore:h=null}={}){this.url=e,this.store=t,this.WebSocketImpl=n,this.schedule=i,this.minBackoff=r,this.maxBackoff=o,this.backoff=r,this.onStatus=a,this.onAction=l,this.onLog=c,this.resolveStore=h,this.stopped=!1,this.everConnected=!1,this.ws=null}_storeFor(e){if(this.resolveStore){const t=this.resolveStore(e);if(t)return t}return this.store}connect(){const e=new this.WebSocketImpl(this.url);this.ws=e,e.onopen=()=>{this.everConnected=!0,this.backoff=this.minBackoff,e.send(Ma(qh()))},e.onmessage=t=>this._onMessage(t.data),e.onclose=()=>{this.stopped||(this.onStatus(this.everConnected?"close":"connect_failed"),this.schedule(()=>this.connect(),this.backoff),this.backoff=Math.min(this.backoff*2,this.maxBackoff))}}_onMessage(e){let t;try{t=Kh(e)}catch(n){console.warn("viewbase: vadná zpráva ze serveru",n);return}t.type==="init"?(this._storeFor(t.screen_id).applyInit(t),this.onStatus("init")):t.type==="patch"?this._storeFor(t.screen_id).applyPatch(t)||this.ws.close():t.type==="action"?this.onAction(t):t.type==="log"?this.onLog(t):t.type==="error"&&(console.error("viewbase server:",t.error),t.error==="protocol_mismatch"&&(this.stopped=!0,this.onStatus("protocol_mismatch")))}send(e){this.ws&&this.ws.readyState===1&&this.ws.send(Ma(e))}}const Ea="vb-guru-style";function Jh(){if(document.getElementById(Ea))return;const s=document.createElement("style");s.id=Ea,s.textContent=`
    @keyframes vb-guru-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.15; } }
  `,document.head.appendChild(s)}class Qh{constructor(e=document.body){Jh(),this.reason=null,this.el=document.createElement("div"),this.el.dataset.role="vb-guru-meditation",this.el.style.cssText=["position:fixed","inset:0","z-index:9999","display:none","background:#000000","cursor:pointer",'font-family:"Courier New",monospace',"user-select:none"].join(";"),this.box=document.createElement("div"),this.box.dataset.role="vb-guru-box",this.box.style.cssText=["position:absolute","top:50%","left:50%","transform:translate(-50%,-50%)","border:3px solid #ff0000","padding:18px 28px","color:#ff0000","text-align:center","font-size:18px","font-weight:bold","letter-spacing:0.5px","white-space:pre-wrap","word-break:break-word","width:max-content","max-width:80%","box-sizing:border-box","animation:vb-guru-blink 1s step-start infinite"].join(";"),this.bar=document.createElement("div"),this.bar.dataset.role="vb-guru-bar",this.bar.textContent="Software Failure.  Press mouse button or Esc to continue.",this.code=document.createElement("div"),this.code.dataset.role="vb-guru-code",this.code.style.cssText="margin-top:6px",this.box.append(this.bar,this.code),this.el.append(this.box),this.el.addEventListener("mousedown",()=>this.hide()),this._onKeydown=t=>{t.code==="Escape"&&this.visible&&(t.preventDefault(),this.hide())},window.addEventListener("keydown",this._onKeydown),e.appendChild(this.el)}show(e,t){this.reason=e,this.code.textContent=t??e,this.el.style.display="block"}hide(){this.el.style.display="none",this.reason=null}get visible(){return this.el.style.display!=="none"}dismissIfConnectionRecovered(){this.reason==="connection_lost"&&this.hide()}}class $h{constructor(e=document.body){this.el=document.createElement("div"),this.el.dataset.role="status-overlay",this.el.style.cssText=["position:fixed","top:16px","left:50%","transform:translateX(-50%)","max-width:70%","padding:10px 18px","border-radius:6px","background:var(--vb-status-bg, rgba(20,23,28,0.85))","color:var(--vb-status-fg, #ffffff)","font:14px/1.4 system-ui,sans-serif","z-index:1000","display:none","pointer-events:none","text-align:center"].join(";"),e.appendChild(this.el)}show(e){this.el.textContent=e,this.el.style.display="block"}hide(){this.el.style.display="none"}}const eu="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAYAAAC9+TVUAAAALklEQVR4nGNgGAU0AYx45P6TqJ4oQ/7jUshEqsnYwKghmICFAT/4T0B+FNASAAAy+AQNJ950wAAAAABJRU5ErkJggg==",tu="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAARElEQVR4nGNgGAWUAkY0/n8K9GIFxBqIUx0TA5UBE7UNZKEgCP5jC1MWKgX+f7p6+T+1LaEoGTExDPVkQ/MwHQUMGAAAyPMKFTpfYu8AAAAASUVORK5CYII=",wa="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAPklEQVR4nGNkYGD4z4AdMDLgAUz4JInVyEjIFqrYyIjHj7gAI0U2YgP/cbjiP7I4VUJ1uGpkwSOHN37JthEAZpYHGIBpISsAAAAASUVORK5CYII=",kc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAQklEQVR4nGNgGOyAEY3/nwK9WAGxBuJUx8RAZcBEbQNZKAiC/9jClIVKgf+frl7+T21LKEpGTAxDPdmAAE3DlP4AAGatChUYxZWAAAAAAElFTkSuQmCC",nu="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAOklEQVR4nGNgGCyAEYn9n1z9LEQazIhFHdxSJgYqAKbhZQgLFrH/lBrCOLTDhIkahrCg8f9Tw9AhDgDcVQUfvazRGgAAAABJRU5ErkJggg==";function Po(s,{onStart:e,onMove:t,onEnd:n=()=>{}}){let i=null;const r=o=>{if(i===null)return;const a=i;i=null;try{s.releasePointerCapture(o.pointerId)}catch{}n(o,a)};s.addEventListener("pointerdown",o=>{const a=e(o);a!=null&&(i=a,s.setPointerCapture(o.pointerId))}),s.addEventListener("pointermove",o=>{if(i!==null){if(o.buttons===0){r(o);return}t(o,i)}}),s.addEventListener("pointerup",r),s.addEventListener("pointercancel",r),s.addEventListener("lostpointercapture",r)}const Lo=26;function Bc(s){return Math.max(0,Math.min(1,s))}function iu(s,e,t){return!t||t<=0?s:Bc(s+e/t)}function Ta(s,e){return s<=0?"":`translateY(${Math.round(Bc(s)*e)}px)`}function ru(s){if(s.length<2)return s.slice();const[e,t,...n]=s;return[t,e,...n]}const vn=20,ci=16,su=12,Dr=24;function Aa(s,e,t,n,i=su){if(!(e>t)||n<=0)return{offset:0,size:Math.max(0,n)};const r=Math.max(i,Math.min(n,n*t/e)),o=e-t;return{offset:(n-r)*Math.max(0,Math.min(1,s/o)),size:r}}function Ca(s,e,t,n,i){const r=e-t;return r<=0?0:Math.max(0,Math.min(1,s/r))*(n-i)}function ou(s){return`<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="${{up:"M8 3 L13 9 L10 9 L10 13 L6 13 L6 9 L3 9 Z",down:"M8 13 L3 7 L6 7 L6 3 L10 3 L10 7 L13 7 Z",left:"M3 8 L9 3 L9 6 L13 6 L13 10 L9 10 L9 13 Z",right:"M13 8 L7 3 L7 6 L3 6 L3 10 L7 10 L7 13 Z"}[s]}" fill="currentColor"/></svg>`}class au{constructor(e,t){this.win=e,this.getTarget=t,this.enabled=!1,this._bound=null,this._onScroll=()=>this.update(),this._observer=null,this._build()}_build(){const e="var(--vb-window-grip-border, var(--vb-window-header-fg, #000))",t="var(--vb-window-grip-bg, var(--vb-window-header-bg, #fff))";this.vbar=document.createElement("div"),this.vbar.dataset.role="vb-frame-v",this.vbar.style.cssText=["position:absolute","top:0","right:0",`width:${vn}px`,`bottom:${vn}px`,`background:${t}`,`color:${e}`,"display:none","box-sizing:border-box",`border-left:1px solid ${e}`,"user-select:none"].join(";"),this.vtrack=document.createElement("div"),this.vtrack.dataset.role="vb-frame-vtrack",this.vtrack.style.cssText=["position:absolute","left:3px","right:3px",`top:${ci+2}px`,`bottom:${ci+2}px`,`border:1px solid ${e}`,"box-sizing:border-box","cursor:pointer"].join(";"),this.vknob=document.createElement("div"),this.vknob.dataset.role="vb-frame-vknob",this.vknob.style.cssText=["position:absolute","left:1px","right:1px","top:0","height:100%",`background:${e}`,"opacity:0.85","cursor:grab","touch-action:none"].join(";"),this.vtrack.appendChild(this.vknob),this.vup=this._arrow("up","top:1px;left:1px"),this.vdown=this._arrow("down","bottom:1px;left:1px"),this.vbar.append(this.vup,this.vtrack,this.vdown),this.hbar=document.createElement("div"),this.hbar.dataset.role="vb-frame-h",this.hbar.style.cssText=["position:absolute","left:0","bottom:0",`height:${vn}px`,`right:${vn}px`,`background:${t}`,`color:${e}`,"display:none","box-sizing:border-box",`border-top:1px solid ${e}`,"user-select:none"].join(";"),this.htrack=document.createElement("div"),this.htrack.dataset.role="vb-frame-htrack",this.htrack.style.cssText=["position:absolute","top:3px","bottom:3px",`left:${ci+2}px`,`right:${ci+2}px`,`border:1px solid ${e}`,"box-sizing:border-box","cursor:pointer"].join(";"),this.hknob=document.createElement("div"),this.hknob.dataset.role="vb-frame-hknob",this.hknob.style.cssText=["position:absolute","top:1px","bottom:1px","left:0","width:100%",`background:${e}`,"opacity:0.85","cursor:grab","touch-action:none"].join(";"),this.htrack.appendChild(this.hknob),this.hleft=this._arrow("left","top:1px;left:1px"),this.hright=this._arrow("right","top:1px;right:1px"),this.hbar.append(this.hleft,this.htrack,this.hright),this.vup.addEventListener("click",()=>this.scrollBy(0,-Dr)),this.vdown.addEventListener("click",()=>this.scrollBy(0,Dr)),this.hleft.addEventListener("click",()=>this.scrollBy(-Dr,0)),this.hright.addEventListener("click",()=>this.scrollBy(Dr,0)),this.vtrack.addEventListener("pointerdown",n=>{if(n.target===this.vknob)return;const i=this.getTarget();if(!i)return;const r=n.clientY<this.vtrack.getBoundingClientRect().top+this.vknob.offsetTop;this.scrollBy(0,r?-i.clientHeight:i.clientHeight)}),this.htrack.addEventListener("pointerdown",n=>{if(n.target===this.hknob)return;const i=this.getTarget();if(!i)return;const r=n.clientX<this.htrack.getBoundingClientRect().left+this.hknob.offsetLeft;this.scrollBy(r?-i.clientWidth:i.clientWidth,0)}),this._wireKnobDrag(this.vknob,"v"),this._wireKnobDrag(this.hknob,"h"),this.win.el.append(this.vbar,this.hbar)}_arrow(e,t){const n=document.createElement("div");return n.dataset.role=`vb-frame-arrow-${e}`,n.style.cssText=`position:absolute;${t};width:${ci}px;height:${ci}px;cursor:pointer;line-height:0`,n.innerHTML=ou(e),n.addEventListener("pointerdown",i=>i.stopPropagation()),n}_wireKnobDrag(e,t){let n=null;const i=t==="v"?this.vtrack:this.htrack;e.addEventListener("pointerdown",o=>{var l;const a=this.getTarget();a&&(o.stopPropagation(),o.preventDefault(),n={pos:t==="v"?o.clientY:o.clientX,start:t==="v"?e.offsetTop:e.offsetLeft,target:a},(l=e.setPointerCapture)==null||l.call(e,o.pointerId))}),e.addEventListener("pointermove",o=>{if(!n)return;const a=n.target;if(t==="v"){const l=i.clientHeight-2,c=n.start+(o.clientY-n.pos);a.scrollTop=Ca(c,l,e.offsetHeight,a.scrollHeight,a.clientHeight)}else{const l=i.clientWidth-2,c=n.start+(o.clientX-n.pos);a.scrollLeft=Ca(c,l,e.offsetWidth,a.scrollWidth,a.clientWidth)}});const r=()=>{n=null};e.addEventListener("pointerup",r),e.addEventListener("pointercancel",r)}scrollBy(e,t){const n=this.getTarget();n&&(t&&(n.scrollTop+=t),e&&(n.scrollLeft+=e))}setEnabled(e){this.enabled=!!e,this.vbar.style.display=this.enabled?"block":"none",this.hbar.style.display=this.enabled?"block":"none",this.win.el.style.paddingRight=this.enabled?`${vn}px`:"",this.win.el.style.paddingBottom=this.enabled?`${vn}px`:"",this.win.bar&&(this.win.bar.style.marginRight=this.enabled?`-${vn}px`:"",this.vbar.style.top=this.enabled?`${this.win._headerH()}px`:"0"),this.rebind()}rebind(){var t;const e=this.enabled?this.getTarget():null;this._bound&&this._bound!==e&&this._unbind(),e&&this._bound!==e&&(typeof e.addEventListener=="function"?(e.addEventListener("scroll",this._onScroll),e.style&&(e.style.scrollbarWidth="none"),typeof MutationObserver<"u"&&(this._observer=new MutationObserver(()=>this.update()),this._observer.observe(e,{childList:!0,subtree:!0,characterData:!0}))):typeof e.subscribe=="function"&&(this._unsubscribe=e.subscribe(this._onScroll),(t=e.setFrame)==null||t.call(e,!0)),this._bound=e),this.update()}_unbind(){var t,n,i;const e=this._bound;e&&(typeof e.removeEventListener=="function"?(e.removeEventListener("scroll",this._onScroll),e.style&&(e.style.scrollbarWidth="")):((t=this._unsubscribe)==null||t.call(this),this._unsubscribe=null,(n=e.setFrame)==null||n.call(e,!1)),(i=this._observer)==null||i.disconnect(),this._observer=null,this._bound=null)}update(){if(!this.enabled)return;const e=this.getTarget(),t=Math.max(0,this.vtrack.clientHeight-2),n=e?Aa(e.scrollTop,e.scrollHeight,e.clientHeight,t):{offset:0,size:t};this.vknob.style.top=`${n.offset}px`,this.vknob.style.height=`${n.size}px`;const i=Math.max(0,this.htrack.clientWidth-2),r=e?Aa(e.scrollLeft,e.scrollWidth,e.clientWidth,i):{offset:0,size:i};this.hknob.style.left=`${r.offset}px`,this.hknob.style.width=`${r.size}px`}}function lu(s,e,t,n,i){const r=Math.max(0,i.width-t),o=Math.max(0,i.height-n);return{x:Math.min(Math.max(0,s),r),y:Math.min(Math.max(0,e),o)}}const cu=64;function Ra(s,e,t,n,i){const r=Math.min(cu,t),o=r-t,a=i.width-r,l=Lo,c=Math.max(l,i.height-n);return{x:Math.min(Math.max(o,s),a),y:Math.min(Math.max(l,e),c)}}function hu(s,e,t,n,i){return{x:s*(e+t),y:n-i}}const Pa=160,uu=8,La=28,du="vb-pos:",zc=180,Gc=90,nr=28,fu="0.35";function pu(s,e){const t=s??e;return t?du+String(t):null}function mu(s,e,t,n,i,r){const o=Math.max(1,i==null?void 0:i.w),a=Math.max(1,i==null?void 0:i.h),l=Math.max(a,Math.min(s.h+n,r.height-s.y));if(e==="sw"){const h=s.x+s.w,d=Math.max(o,Math.min(s.w-t,h));return{x:h-d,y:s.y,w:d,h:l}}const c=Math.max(o,Math.min(s.w+t,r.width-s.x));return{x:s.x,y:s.y,w:c,h:l}}class Gi{constructor({id:e,title:t,widthChars:n,container:i,manager:r,kind:o,closable:a=!0,optionsProvider:l=null}){this.id=e,this.title=t,this.widthChars=n,this.container=i,this.manager=r,this.kind=o,this.closable=a!==!1,this.optionsProvider=l,this.isMinimized=!1,this.saved=null,this.maximizedFrom=null,this.dragOffset=null,this.resizeState=null,this.size=null,this.grips=[],this.body=null,this.el=document.createElement("div"),this.el.dataset.role="vb-window",this.el.dataset.windowId=String(e),this.el.style.cssText=["position:absolute","left:0","top:0","box-sizing:border-box","background:var(--vb-window-body-bg, rgba(255,255,255,0.97))","color:var(--vb-window-body-fg, #1f2430)","box-shadow:var(--vb-window-shadow, 0 6px 20px rgba(0,0,0,0.22))","border:1px solid var(--vb-window-border, transparent)","border-radius:6px","overflow:hidden","user-select:none","font:13px/1.5 system-ui,sans-serif","z-index:900"].join(";"),this._buildHeader()}_buildBody(){}_renderBody(){}_mount(){this.container.appendChild(this.el),this._buildGrips(),this.wframe=new au(this,()=>this._scrollTarget()),this._syncFrame();const e=this._loadPos();e&&Number.isFinite(e.w)&&Number.isFinite(e.h)&&this._applySize(e.w,e.h);const t=this._bounds(),n=this.manager.windows.size%8*24,i=lu(40+n,40+n,this._boxW(),this._boxH(),t),r=e?Ra(e.x,e.y,this._boxW(),this._headerH(),t):i;this._place(r.x,r.y),this.el.addEventListener("pointerdown",()=>this.bringToFront())}_posKey(){return pu(this.id,this.title)}_loadPos(){const e=this._posKey();if(!e)return null;try{const t=localStorage.getItem(e);if(!t)return null;const n=JSON.parse(t);if(Number.isFinite(n==null?void 0:n.x)&&Number.isFinite(n==null?void 0:n.y))return n}catch{}return null}_savePos(){const e=this._posKey();if(!e)return;const t={x:this.x,y:this.y};this.size&&(t.w=this.size.w,t.h=this.size.h);try{localStorage.setItem(e,JSON.stringify(t))}catch{}}_width(){return this.widthChars*8+24}_boxW(){return this.size?this.size.w:this._width()}_boxH(){return this.size?this.size.h:200}_bounds(){return{width:this.container.clientWidth||800,height:this.container.clientHeight||600}}_buildHeader(){const e=document.createElement("div");e.dataset.role="vb-titlebar",e.style.cssText=["display:flex","align-items:center","gap:6px","padding:4px 6px","cursor:move","background:var(--vb-window-header-bg, #d8dde6)","background-image:var(--vb-window-header-pattern, none)","color:var(--vb-window-header-fg, #1f2430)"].join(";"),this.closeGadget=null,this.closable&&(this.closeGadget=this._gadget("close",eu),this.closeGadget.addEventListener("click",t=>{t.stopPropagation(),this.close()})),this.titleEl=document.createElement("div"),this.titleEl.textContent=this.title,this.titleEl.style.cssText=["flex:1","text-align:left","font-weight:600","white-space:nowrap","overflow:hidden","text-overflow:ellipsis"].join(";"),this.minGadget=this._gadget("minimize",nu),this.minGadget.addEventListener("click",t=>{t.stopPropagation(),this.minimize()}),this.depthGadget=this._gadget("depth",kc),this.depthGadget.title="Za ostatní okna",this.depthGadget.addEventListener("click",t=>{t.stopPropagation(),this.sendToBack()}),this.restoreGadget=this._gadget("restore",tu),this.restoreGadget.addEventListener("click",t=>{t.stopPropagation(),this.restore()}),this.restoreGadget.style.display="none",this.closeGadget&&e.append(this.closeGadget),e.append(this.titleEl,this.minGadget,this.depthGadget,this.restoreGadget),this._dragFromHeader(e),e.addEventListener("dblclick",t=>{t.target.dataset.gadget||this.toggleMaximize()}),this.bar=e,this.el.appendChild(e)}_gadget(e,t){const n=document.createElement("button");return n.dataset.gadget=e,n.style.cssText=["flex:0 0 auto","width:18px","height:18px","padding:0","border:none","cursor:pointer","background:var(--vb-window-gadget, #5a6573)",`-webkit-mask:url("${t}") center/100% 100% no-repeat`,`mask:url("${t}") center/100% 100% no-repeat`].join(";"),n}_dragFromHeader(e){Po(e,{onStart:t=>{if(t.target.dataset.gadget)return null;this.bringToFront();const n=this.el.getBoundingClientRect(),i=this.container.getBoundingClientRect();return this.dragOffset={x:t.clientX-n.left,y:t.clientY-n.top,contLeft:i.left,contTop:i.top},this.dragOffset},onMove:(t,n)=>{if(this.isMinimized)return;const i=t.clientX-n.contLeft-n.x,r=t.clientY-n.contTop-n.y,o=Ra(i,r,this._boxW(),this._headerH(),this._bounds());this._place(o.x,o.y)},onEnd:()=>{this.dragOffset=null,this.isMinimized||this._savePos()}})}_headerH(){return this.bar.offsetHeight||La}_frameH(){var e;return(e=this.wframe)!=null&&e.enabled?vn:0}_scrollTarget(){return this.body??null}_syncFrame(){var n;if(!this.wframe)return;const e=getComputedStyle(this.container).getPropertyValue("--vb-window-frame").trim()==="1";this.wframe.setEnabled(e&&!this.isMinimized);const t=(n=this.grips)==null?void 0:n[0];if(t){const i=e?vn:nr;t.style.width=`${i}px`,t.style.height=`${i}px`;const r=t.firstElementChild;r&&(r.style.right=e?"1px":"4px",r.style.bottom=e?"1px":"5px")}this.size&&!this.isMinimized&&this._applySize(this.size.w,this.size.h)}_buildGrips(){this.grips=["se","sw"].map(e=>{const t=document.createElement("div");if(t.dataset.role=`vb-resize-${e}`,e==="se"){t.style.cssText=["position:absolute","bottom:0","right:0",`width:${nr}px`,`height:${nr}px`,"box-sizing:border-box","touch-action:none","cursor:nwse-resize","background:var(--vb-window-grip-bg, transparent)","border-left:1px solid var(--vb-window-grip-border, transparent)","border-top:1px solid var(--vb-window-grip-border, transparent)","border-bottom-right-radius:5px"].join(";");const n=document.createElement("div");n.dataset.role="vb-resize-glyph",n.style.cssText=["position:absolute","right:4px","bottom:5px","width:16px","height:16px","background:var(--vb-window-grip-fg, var(--vb-window-body-fg, #8a93a3))",`-webkit-mask:url("${wa}") center/16px 16px no-repeat`,`mask:url("${wa}") center/16px 16px no-repeat`,"pointer-events:none"].join(";"),t.appendChild(n)}else t.style.cssText=["position:absolute","bottom:2px","left:2px",`width:${nr}px`,`height:${nr}px`,"box-sizing:border-box","border-radius:3px","background:var(--vb-window-gadget, #8a93a3)","border:1px solid var(--vb-window-gadget, #8a93a3)","opacity:0","transition:opacity 0.12s","touch-action:none","cursor:nesw-resize"].join(";"),t.addEventListener("pointerenter",()=>this._showGrip(t,!0)),t.addEventListener("pointerleave",()=>this._showGrip(t,!1));return this._resizeFromGrip(t,e),this.el.appendChild(t),t})}_showGrip(e,t){e.dataset.role!=="vb-resize-se"&&(!t&&this.resizeState||(e.style.opacity=t&&!this.isMinimized?fu:"0"))}_resizeFromGrip(e,t){Po(e,{onStart:n=>{if(this.isMinimized)return null;n.stopPropagation(),this.bringToFront();const i=this.el.getBoundingClientRect();return this.resizeState={corner:t,pointerX:n.clientX,pointerY:n.clientY,start:{x:this.x,y:this.y,w:i.width||this._boxW(),h:i.height||this._boxH()}},this._showGrip(e,!0),this.resizeState},onMove:(n,i)=>{if(this.isMinimized)return;const r=mu(i.start,i.corner,n.clientX-i.pointerX,n.clientY-i.pointerY,{w:zc,h:Gc},this._bounds());this._place(r.x,r.y),this._applySize(r.w,r.h)},onEnd:()=>{this.resizeState=null,this._showGrip(e,!1),this._savePos()}})}_applySize(e,t){var n;this.size={w:Math.round(e),h:Math.round(t)},this.el.style.width=`${this.size.w}px`,this.el.style.height=`${this.size.h}px`,this.body&&(this.body.style.boxSizing="border-box",this.body.style.width="100%",this.body.style.maxWidth="none",this.body.style.height=`${Math.max(0,this.size.h-this._headerH()-this._frameH())}px`,this.body.style.overflow="auto",(n=this.wframe)==null||n.update())}_place(e,t){this.x=e,this.y=t,this.el.style.left=`${e}px`,this.el.style.top=`${t}px`}toggleMaximize(){if(this.isMinimized)return;const e=this._bounds();if(this.maximizedFrom){const t=this.maximizedFrom;this.maximizedFrom=null,this._applySize(t.w,t.h),this._place(t.x,t.y)}else{const t=this.el.getBoundingClientRect();this.maximizedFrom={x:this.x,y:this.y,w:t.width||this._boxW(),h:t.height||this._boxH()},this._place(0,Lo),this._applySize(e.width,e.height-Lo)}this._savePos()}minimize(){var i;if(this.isMinimized)return;this.isMinimized=!0,this.saved={x:this.x,y:this.y},this.body.style.display="none",(i=this.wframe)==null||i.setEnabled(!1),this.minGadget.style.display="none",this.depthGadget.style.display="none",this.restoreGadget.style.display="",this.el.dataset.role="vb-dock-strip",this.el.style.background="var(--vb-window-dock-bg, #c2c9d4)",this.el.style.width=`${Pa}px`,this.el.style.height="";for(const r of this.grips)r.style.display="none";this.titleEl.style.fontSize="11px";const e=this.manager._assignDockSlot(this),t=this._bounds(),n=hu(e,Pa,uu,t.height,La);this._place(n.x,n.y)}restore(){if(!this.isMinimized)return;this.isMinimized=!1,this.manager._releaseDockSlot(this),this.el.dataset.role="vb-window",this.el.style.background="var(--vb-window-body-bg, rgba(255,255,255,0.97))",this.el.style.width="",this.titleEl.style.fontSize="",this.body.style.display="",this.minGadget.style.display="",this.depthGadget.style.display="",this.restoreGadget.style.display="none";for(const t of this.grips)t.style.display="";this._syncFrame(),this.size&&this._applySize(this.size.w,this.size.h),this._renderBody();const e=this.saved??{x:40,y:40};this._place(e.x,e.y),this.bringToFront()}getOptionsItems(){return this.optionsProvider?this.optionsProvider():null}bringToFront(){this.setZ(this.manager._nextZ()),this.manager._setActive(this)}setZ(e){this.el.style.zIndex=String(e)}sendToBack(){this.manager.sendToBack(this)}applyTheme(){this._syncFrame(),this.isMinimized||this._renderBody()}close(){this.isMinimized&&this.manager._releaseDockSlot(this),this.el.remove(),this.manager._forget(this.id)}}const Hc=["debug","info","warning","error"],Vc=["frontend","backend_api","backend_program","backend_user"];function gu(){return{levels:Object.fromEntries(Hc.map(s=>[s,!0])),sources:Object.fromEntries(Vc.map(s=>[s,!0]))}}function vu(s,e){return!(e.levels[s.level]===!1||e.sources[s.source]===!1)}function _u(s){const e=s instanceof Date?s:new Date(s),t=n=>String(n).padStart(2,"0");return`${t(e.getHours())}:${t(e.getMinutes())}:${t(e.getSeconds())}`}function Wc(s){const e=s.component?`${s.source}/${s.component}`:s.source;return`${s.timestamp?`${_u(s.timestamp)} `:""}[${s.level}] ${e}: ${s.message}`}const xu=1e3,Jo="__log";class yu extends Gi{constructor({container:e,manager:t}){super({id:Jo,title:"Log",widthChars:64,container:e,manager:t,kind:"log",closable:!1}),this.filters=gu(),this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="log-body",e.style.cssText=["padding:6px 8px",`width:${this.widthChars}ch`,"max-width:92vw","height:240px","overflow-y:auto","font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace","white-space:pre-wrap","word-break:break-word"].join(";"),this.body=e,this.el.appendChild(e)}append(e){if(!vu(e,this.filters))return;const t=document.createElement("div");for(t.dataset.role="log-row",t.textContent=Wc(e),this.body.appendChild(t);this.body.childElementCount>xu;)this.body.firstElementChild.remove();this.body.scrollTop=this.body.scrollHeight}getOptionsItems(){const e=(t,n)=>i=>{this.filters[t][n]=i,this.manager.refreshOptions()};return[...Hc.map(t=>({key:`level-${t}`,label:t,checked:this.filters.levels[t]!==!1,onToggle:e("levels",t)})),...Vc.map(t=>({key:`source-${t}`,label:t,checked:this.filters.sources[t]!==!1,onToggle:e("sources",t)}))]}_renderBody(){}}function bu({container:s,windowManager:e}){return e.registerType("log",()=>{const t=e.get(Jo);return t?(t.isMinimized&&t.restore(),t):e.adopt(new yu({container:s,manager:e}))}),{name:"log"}}class mr{constructor(){this.config={},this.nodeTypes={},this.flowTypes={},this.flows=[],this.windows=[],this.menu=null,this.nodes=new Map,this.edges=new Map,this.seq=-1,this.listeners=new Set}static edgeKey(e,t){return e<=t?`${e}\0${t}`:`${t}\0${e}`}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}_emit(e){for(const t of this.listeners)t(e)}applyInit(e){this.config=e.config,this.nodeTypes=e.node_types,this.flowTypes=e.flow_types??{},this.flows=e.flows??[],this.windows=e.windows??[],this.menu=e.menu??null,this.nodes.clear(),this.edges.clear();for(const t of e.nodes)this.nodes.set(t.id,t);for(const t of e.edges)this.edges.set(mr.edgeKey(t.source,t.target),t);this.seq=e.seq,this._emit({kind:"init"})}applyNodeType(e,t){this.nodeTypes[e]=t??{}}applyPatch(e){if(e.seq!==this.seq+1)return!1;for(const[t,n]of e.remove_edges)this.edges.delete(mr.edgeKey(t,n));for(const t of e.remove_nodes){this.nodes.delete(t);for(const[n,i]of this.edges)(i.source===t||i.target===t)&&this.edges.delete(n)}for(const t of e.add_nodes)this.nodes.set(t.id,t);for(const t of e.update_nodes)this.nodes.set(t.id,t);for(const t of e.add_edges){if(!this.nodes.has(t.source)||!this.nodes.has(t.target)){console.warn("viewbase: hrana s neznámým koncem přeskočena",t.source,t.target);continue}this.edges.set(mr.edgeKey(t.source,t.target),t)}return this.seq=e.seq,this._emit({kind:"patch",patch:e}),!0}}function Uo(s,e,{now:t=()=>Date.now(),schedule:n=(i,r)=>setTimeout(i,r)}={}){let i=-1/0,r=null,o=!1;function a(l){i=t(),s(...l)}return(...l)=>{const c=t()-i;if(!o&&c>=e){a(l);return}r=l,o||(o=!0,n(()=>{o=!1;const h=r;r=null,a(h)},Math.max(0,e-c)))}}const Su=150;function Mu(s,e){if(s.type==="int"){const t=Math.round(Number(e));return Number.isFinite(t)?Math.max(s.min,Math.min(s.max,t)):s.value}if(s.type==="number"){const t=Number(e);return Number.isFinite(t)?Math.max(s.min,Math.min(s.max,t)):s.value}return s.type==="bool"?typeof e=="boolean"?e:s.value:s.type==="string"?String(e??"").slice(0,s.maxlength):s.type==="enum"&&s.options.some(t=>t.value===e)?e:s.value}function Eu(s,e){const t={};for(const n of s)n.key in e&&(t[n.key]=Mu(n,e[n.key]));return t}class wu extends Gi{constructor({id:e,title:t,fields:n,widthChars:i,onSubmit:r,container:o,manager:a,live:l=!1,closable:c}){super({id:e,title:t,widthChars:i,container:o,manager:a,kind:"control",closable:c}),this.fields=n,this.onSubmit=r,this.live=!!l,this.inputs=new Map,this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="control-body",e.style.cssText=["padding:8px 10px",`width:${this.widthChars}ch`,"max-width:90vw","font:13px/1.5 system-ui,sans-serif"].join(";"),this.body=e;const t=document.createElement("table");t.style.cssText="border-collapse:collapse;width:100%";for(const n of this.fields){const i=t.insertRow(),r=i.insertCell();r.textContent=n.label,r.style.cssText=["padding:3px 10px 3px 0","white-space:nowrap","color:var(--vb-window-key, #667788)"].join(";");const o=i.insertCell();o.style.cssText="padding:3px 0",this.inputs.set(n.key,this._buildWidget(n,o))}if(e.appendChild(t),this.live){const n=Uo(()=>this._submit(),Su);e.addEventListener("input",n),e.addEventListener("change",n)}else{const n=document.createElement("button");n.dataset.role="control-apply",n.textContent="Použít",n.style.cssText=["margin-top:8px","padding:3px 12px","cursor:pointer","border:1px solid var(--vb-window-gadget, #8a93a3)","border-radius:4px","background:transparent","color:inherit"].join(";"),n.addEventListener("click",i=>{i.stopPropagation(),this._submit()}),e.appendChild(n)}this.el.appendChild(e)}_buildWidget(e,t){if(e.type==="enum"){const i=document.createElement("select");for(const r of e.options){const o=document.createElement("option");o.value=String(r.value),o.textContent=r.label,String(r.value)===String(e.value)&&(o.selected=!0),i.appendChild(o)}return t.appendChild(i),()=>{var r;return((r=e.options.find(o=>String(o.value)===i.value))==null?void 0:r.value)??e.value}}if(e.type==="int"||e.type==="number"){const i=e.step??(e.type==="int"?1:"any"),r=document.createElement("input");r.type="range",r.min=e.min,r.max=e.max,r.step=i==="any"?(e.max-e.min)/100||"any":i,r.value=e.value;const o=document.createElement("input");return o.type="number",o.min=e.min,o.max=e.max,o.step=i,o.value=e.value,o.style.cssText="width:5em;margin-left:6px",r.addEventListener("input",()=>{o.value=r.value}),o.addEventListener("input",()=>{r.value=o.value}),t.append(r,o),()=>o.value}if(e.type==="bool"){const i=document.createElement("input");return i.type="checkbox",i.checked=!!e.value,t.appendChild(i),()=>i.checked}const n=document.createElement("input");return n.type="text",n.maxLength=e.maxlength,n.value=e.value,t.appendChild(n),()=>n.value}_submit(){const e={};for(const[n,i]of this.inputs)e[n]=i();const t=Eu(this.fields,e);this.onSubmit&&this.onSubmit({window_id:this.id,values:t})}_renderBody(){}}const Tu=30;function Au({container:s,windowManager:e,sendEvent:t}){return e.registerType("control",n=>{var r;(r=e.get(n.window_id))==null||r.close();const i=e.adopt(new wu({id:n.window_id,title:n.title,fields:n.fields,live:n.live,closable:n.closable,widthChars:Tu,onSubmit:o=>t({type:"event",event:"window_submit",payload:o}),container:s,manager:e}));return i.bringToFront(),i}),{name:"control"}}function Ua(s,e){const t=(s==null?void 0:s.meta)??{};return e==null?Object.entries(t).map(([n,i])=>({label:n,value:String(i??"")})):e.map(([n,i])=>({label:n,value:String(t[i]??"")}))}function Cu(s,e){const t=e instanceof Set?e:new Set(e),n=(s.remove_nodes??[]).filter(o=>t.has(o)),i=new Set(n);return{refresh:(s.update_nodes??[]).map(o=>o.id).filter(o=>t.has(o)&&!i.has(o)),close:n}}class Ru extends Gi{constructor({nodeId:e,title:t,rows:n,widthChars:i,container:r,manager:o}){super({id:e,title:t,widthChars:i,container:r,manager:o,kind:"detail"}),this.rows=n,this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="detail-body",e.style.cssText=["padding:6px 10px",`width:${this.widthChars}ch`,"max-width:90vw","font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace","overflow:auto"].join(";"),this.body=e,this._renderBody(),this.el.appendChild(e)}_renderBody(){this.body.replaceChildren();const e=document.createElement("table");e.style.cssText="border-collapse:collapse;width:100%";for(const{label:t,value:n}of this.rows){const i=e.insertRow(),r=i.insertCell();r.textContent=t,r.style.cssText=["padding:1px 12px 1px 0","vertical-align:top","white-space:nowrap","color:var(--vb-window-key, #667788)"].join(";");const o=i.insertCell();o.dataset.role="detail-value",o.textContent=n,o.style.cssText=["padding:1px 0","word-break:break-all","cursor:copy"].join(";"),o.addEventListener("click",a=>{a.stopPropagation(),this._copy(n,o)})}this.body.appendChild(e)}_copy(e,t){const n=()=>{t.style.transition="background 0.15s";const i=t.style.background;t.style.background="var(--vb-window-gadget, #8a93a3)",setTimeout(()=>{t.style.background=i},180)};navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(e).then(n).catch(()=>{this._execCopy(e),n()}):(this._execCopy(e),n())}_execCopy(e){try{const t=document.createElement("textarea");t.value=e,t.style.cssText="position:fixed;left:-9999px;top:0",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)}catch{console.warn("viewbase: kopírování do schránky selhalo")}}update({title:e,rows:t}){e!=null&&(this.title=e,this.titleEl.textContent=e),t!=null&&(this.rows=t,this.isMinimized||this._renderBody())}}function Pu({container:s,windowManager:e,store:t}){const n=()=>{var i;return((i=t.config)==null?void 0:i.detail_window)??{rows:null,width_chars:128,open_on_click:!0}};return e.registerType("detail",({nodeId:i})=>{const r=e.get(i);if(r)return r.isMinimized?r.restore():r.bringToFront(),r;const o=t.nodes.get(i);if(!o)return null;const a=n(),l=e.adopt(new Ru({nodeId:i,title:o.label,rows:Ua(o,a.rows),widthChars:a.width_chars,container:s,manager:e}));return l.bringToFront(),l}),t.subscribe(i=>{if(i.kind!=="patch")return;const r=new Set;for(const[c,h]of e.windows)h.kind==="detail"&&r.add(c);if(r.size===0)return;const{refresh:o,close:a}=Cu(i.patch,r);for(const c of a)e.close(c);const l=n();for(const c of o){const h=e.get(c),d=t.nodes.get(c);h&&d&&h.update({title:d.label,rows:Ua(d,l.rows)})}}),{name:"detail",actions:{show_detail:i=>e.open("detail",{nodeId:i.node_id})}}}function Lu(s,e,t){const n=new Set;if(!s.nodes.has(e)||(n.add(e),t<=0))return n;const i=new Map,r=(a,l)=>{i.has(a)||i.set(a,[]),i.get(a).push(l)};for(const a of s.edges.values())r(a.source,a.target),r(a.target,a.source);let o=[e];for(let a=0;a<t&&o.length>0;a+=1){const l=[];for(const c of o)for(const h of i.get(c)??[])n.has(h)||(n.add(h),l.push(h));o=l}return n}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Qo="165",_n={ROTATE:0,DOLLY:1,PAN:2},Un={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Uu=0,Da=1,Du=2,Xc=1,Iu=2,gn=3,On=0,Ft=1,sn=2,bn=0,Li=1,vs=2,Ia=3,Fa=4,Fu=5,Jn=100,Nu=101,Ou=102,ku=103,Bu=104,zu=200,Gu=201,Hu=202,Vu=203,Do=204,Io=205,Wu=206,Xu=207,Yu=208,ju=209,qu=210,Ku=211,Zu=212,Ju=213,Qu=214,$u=0,ed=1,td=2,_s=3,nd=4,id=5,rd=6,sd=7,Yc=0,od=1,ad=2,Fn=0,ld=1,cd=2,hd=3,ud=4,dd=5,fd=6,pd=7,jc=300,Ii=301,Fi=302,Fo=303,No=304,As=306,Oo=1e3,ei=1001,ko=1002,Dt=1003,md=1004,Ir=1005,Bt=1006,Ys=1007,ti=1008,kn=1009,gd=1010,vd=1011,xs=1012,qc=1013,Ni=1014,xn=1015,Nn=1016,Kc=1017,Zc=1018,Oi=1020,_d=35902,xd=1021,yd=1022,an=1023,bd=1024,Sd=1025,Ui=1026,ki=1027,Jc=1028,Qc=1029,Md=1030,$c=1031,eh=1033,js=33776,qs=33777,Ks=33778,Zs=33779,Na=35840,Oa=35841,ka=35842,Ba=35843,za=36196,Ga=37492,Ha=37496,Va=37808,Wa=37809,Xa=37810,Ya=37811,ja=37812,qa=37813,Ka=37814,Za=37815,Ja=37816,Qa=37817,$a=37818,el=37819,tl=37820,nl=37821,Js=36492,il=36494,rl=36495,Ed=36283,sl=36284,ol=36285,al=36286,wd=3200,th=3201,nh=0,Td=1,In="",nn="srgb",Bn="srgb-linear",$o="display-p3",Cs="display-p3-linear",ys="linear",ot="srgb",bs="rec709",Ss="p3",hi=7680,ll=519,Ad=512,Cd=513,Rd=514,ih=515,Pd=516,Ld=517,Ud=518,Dd=519,cl=35044,hl="300 es",yn=2e3,Ms=2001;class ri{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const Mt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ul=1234567;const gr=Math.PI/180,yr=180/Math.PI;function Hi(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Mt[s&255]+Mt[s>>8&255]+Mt[s>>16&255]+Mt[s>>24&255]+"-"+Mt[e&255]+Mt[e>>8&255]+"-"+Mt[e>>16&15|64]+Mt[e>>24&255]+"-"+Mt[t&63|128]+Mt[t>>8&255]+"-"+Mt[t>>16&255]+Mt[t>>24&255]+Mt[n&255]+Mt[n>>8&255]+Mt[n>>16&255]+Mt[n>>24&255]).toLowerCase()}function wt(s,e,t){return Math.max(e,Math.min(t,s))}function ea(s,e){return(s%e+e)%e}function Id(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Fd(s,e,t){return s!==e?(t-s)/(e-s):0}function vr(s,e,t){return(1-t)*s+t*e}function Nd(s,e,t,n){return vr(s,e,1-Math.exp(-t*n))}function Od(s,e=1){return e-Math.abs(ea(s,e*2)-e)}function kd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Bd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function zd(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Gd(s,e){return s+Math.random()*(e-s)}function Hd(s){return s*(.5-Math.random())}function Vd(s){s!==void 0&&(ul=s);let e=ul+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Wd(s){return s*gr}function Xd(s){return s*yr}function Yd(s){return(s&s-1)===0&&s!==0}function jd(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function qd(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Kd(s,e,t,n,i){const r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),d=r((e-n)/2),u=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(i){case"XYX":s.set(a*h,l*d,l*u,a*c);break;case"YZY":s.set(l*u,a*h,l*d,a*c);break;case"ZXZ":s.set(l*d,l*u,a*h,a*c);break;case"XZX":s.set(a*h,l*g,l*f,a*c);break;case"YXY":s.set(l*f,a*h,l*g,a*c);break;case"ZYZ":s.set(l*g,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Ri(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ct(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Bo={DEG2RAD:gr,RAD2DEG:yr,generateUUID:Hi,clamp:wt,euclideanModulo:ea,mapLinear:Id,inverseLerp:Fd,lerp:vr,damp:Nd,pingpong:Od,smoothstep:kd,smootherstep:Bd,randInt:zd,randFloat:Gd,randFloatSpread:Hd,seededRandom:Vd,degToRad:Wd,radToDeg:Xd,isPowerOfTwo:Yd,ceilPowerOfTwo:jd,floorPowerOfTwo:qd,setQuaternionFromProperEuler:Kd,normalize:Ct,denormalize:Ri};class Oe{constructor(e=0,t=0){Oe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ke{constructor(e,t,n,i,r,o,a,l,c){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c)}set(e,t,n,i,r,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],v=i[0],p=i[3],m=i[6],x=i[1],_=i[4],M=i[7],C=i[2],T=i[5],w=i[8];return r[0]=o*v+a*x+l*C,r[3]=o*p+a*_+l*T,r[6]=o*m+a*M+l*w,r[1]=c*v+h*x+d*C,r[4]=c*p+h*_+d*T,r[7]=c*m+h*M+d*w,r[2]=u*v+f*x+g*C,r[5]=u*p+f*_+g*T,r[8]=u*m+f*M+g*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,g=t*d+n*u+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=d*v,e[1]=(i*c-h*n)*v,e[2]=(a*n-i*o)*v,e[3]=u*v,e[4]=(h*t-i*l)*v,e[5]=(i*r-a*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(o*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Qs.makeScale(e,t)),this}rotate(e){return this.premultiply(Qs.makeRotation(-e)),this}translate(e,t){return this.premultiply(Qs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Qs=new Ke;function rh(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Es(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Zd(){const s=Es("canvas");return s.style.display="block",s}const dl={};function sh(s){s in dl||(dl[s]=!0,console.warn(s))}function Jd(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const fl=new Ke().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),pl=new Ke().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Fr={[Bn]:{transfer:ys,primaries:bs,toReference:s=>s,fromReference:s=>s},[nn]:{transfer:ot,primaries:bs,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Cs]:{transfer:ys,primaries:Ss,toReference:s=>s.applyMatrix3(pl),fromReference:s=>s.applyMatrix3(fl)},[$o]:{transfer:ot,primaries:Ss,toReference:s=>s.convertSRGBToLinear().applyMatrix3(pl),fromReference:s=>s.applyMatrix3(fl).convertLinearToSRGB()}},Qd=new Set([Bn,Cs]),nt={enabled:!0,_workingColorSpace:Bn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Qd.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const n=Fr[e].toReference,i=Fr[t].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return Fr[s].primaries},getTransfer:function(s){return s===In?ys:Fr[s].transfer}};function Di(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function $s(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ui;class $d{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ui===void 0&&(ui=Es("canvas")),ui.width=e.width,ui.height=e.height;const n=ui.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ui}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Es("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Di(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Di(t[n]/255)*255):t[n]=Di(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ef=0;class oh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ef++}),this.uuid=Hi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(eo(i[o].image)):r.push(eo(i[o]))}else r=eo(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function eo(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?$d.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let tf=0;class Tt extends ri{constructor(e=Tt.DEFAULT_IMAGE,t=Tt.DEFAULT_MAPPING,n=ei,i=ei,r=Bt,o=ti,a=an,l=kn,c=Tt.DEFAULT_ANISOTROPY,h=In){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:tf++}),this.uuid=Hi(),this.name="",this.source=new oh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==jc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Oo:e.x=e.x-Math.floor(e.x);break;case ei:e.x=e.x<0?0:1;break;case ko:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Oo:e.y=e.y-Math.floor(e.y);break;case ei:e.y=e.y<0?0:1;break;case ko:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Tt.DEFAULT_IMAGE=null;Tt.DEFAULT_MAPPING=jc;Tt.DEFAULT_ANISOTROPY=1;class ht{constructor(e=0,t=0,n=0,i=1){ht.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],v=l[2],p=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+v)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(c+1)/2,M=(f+1)/2,C=(m+1)/2,T=(h+u)/4,w=(d+v)/4,L=(g+p)/4;return _>M&&_>C?_<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(_),i=T/n,r=w/n):M>C?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=T/i,r=L/i):C<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(C),n=w/r,i=L/r),this.set(n,i,r,t),this}let x=Math.sqrt((p-g)*(p-g)+(d-v)*(d-v)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(p-g)/x,this.y=(d-v)/x,this.z=(u-h)/x,this.w=Math.acos((c+f+m-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class nf extends ri{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Bt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Tt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new oh(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class en extends nf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class ah extends Tt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class rf extends Tt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ii{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3];const u=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(a===1){e[t+0]=u,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(d!==v||l!==u||c!==f||h!==g){let p=1-a;const m=l*u+c*f+h*g+d*v,x=m>=0?1:-1,_=1-m*m;if(_>Number.EPSILON){const C=Math.sqrt(_),T=Math.atan2(C,m*x);p=Math.sin(p*T)/C,a=Math.sin(a*T)/C}const M=a*x;if(l=l*p+u*M,c=c*p+f*M,h=h*p+g*M,d=d*p+v*M,p===1-a){const C=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=C,c*=C,h*=C,d*=C}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[o],u=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*d+l*f-c*u,e[t+1]=l*g+h*u+c*d-a*f,e[t+2]=c*g+h*f+a*u-l*d,e[t+3]=h*g-a*d-l*u-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),d=a(r/2),u=l(n/2),f=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+a+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>d){const f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>d){const f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(wt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-t)*h)/c,u=Math.sin(t*h)/c;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=i*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(e=0,t=0,n=0){H.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ml.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ml.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-r*i),d=2*(r*n-o*t);return this.x=t+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=i+l*d+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return to.copy(this).projectOnVector(e),this.sub(to)}reflect(e){return this.sub(to.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const to=new H,ml=new ii;class Sn{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Jt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Jt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Jt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Jt):Jt.fromBufferAttribute(r,o),Jt.applyMatrix4(e.matrixWorld),this.expandByPoint(Jt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Nr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Nr.copy(n.boundingBox)),Nr.applyMatrix4(e.matrixWorld),this.union(Nr)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Jt),Jt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ir),Or.subVectors(this.max,ir),di.subVectors(e.a,ir),fi.subVectors(e.b,ir),pi.subVectors(e.c,ir),Tn.subVectors(fi,di),An.subVectors(pi,fi),Hn.subVectors(di,pi);let t=[0,-Tn.z,Tn.y,0,-An.z,An.y,0,-Hn.z,Hn.y,Tn.z,0,-Tn.x,An.z,0,-An.x,Hn.z,0,-Hn.x,-Tn.y,Tn.x,0,-An.y,An.x,0,-Hn.y,Hn.x,0];return!no(t,di,fi,pi,Or)||(t=[1,0,0,0,1,0,0,0,1],!no(t,di,fi,pi,Or))?!1:(kr.crossVectors(Tn,An),t=[kr.x,kr.y,kr.z],no(t,di,fi,pi,Or))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Jt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Jt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(un),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const un=[new H,new H,new H,new H,new H,new H,new H,new H],Jt=new H,Nr=new Sn,di=new H,fi=new H,pi=new H,Tn=new H,An=new H,Hn=new H,ir=new H,Or=new H,kr=new H,Vn=new H;function no(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Vn.fromArray(s,r);const a=i.x*Math.abs(Vn.x)+i.y*Math.abs(Vn.y)+i.z*Math.abs(Vn.z),l=e.dot(Vn),c=t.dot(Vn),h=n.dot(Vn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const sf=new Sn,rr=new H,io=new H;class si{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):sf.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;rr.subVectors(e,this.center);const t=rr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(rr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(io.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(rr.copy(e.center).add(io)),this.expandByPoint(rr.copy(e.center).sub(io))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const dn=new H,ro=new H,Br=new H,Cn=new H,so=new H,zr=new H,oo=new H;class Rs{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,dn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=dn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(dn.copy(this.origin).addScaledVector(this.direction,t),dn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ro.copy(e).add(t).multiplyScalar(.5),Br.copy(t).sub(e).normalize(),Cn.copy(this.origin).sub(ro);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Br),a=Cn.dot(this.direction),l=-Cn.dot(Br),c=Cn.lengthSq(),h=Math.abs(1-o*o);let d,u,f,g;if(h>0)if(d=o*l-a,u=o*a-l,g=r*h,d>=0)if(u>=-g)if(u<=g){const v=1/h;d*=v,u*=v,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(ro).addScaledVector(Br,u),f}intersectSphere(e,t){dn.subVectors(e.center,this.origin);const n=dn.dot(this.direction),i=dn.dot(dn)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,i=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,i=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,o=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,o=(e.min.y-u.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),d>=0?(a=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(a=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,dn)!==null}intersectTriangle(e,t,n,i,r){so.subVectors(t,e),zr.subVectors(n,e),oo.crossVectors(so,zr);let o=this.direction.dot(oo),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Cn.subVectors(this.origin,e);const l=a*this.direction.dot(zr.crossVectors(Cn,zr));if(l<0)return null;const c=a*this.direction.dot(so.cross(Cn));if(c<0||l+c>o)return null;const h=-a*Cn.dot(oo);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class it{constructor(e,t,n,i,r,o,a,l,c,h,d,u,f,g,v,p){it.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c,h,d,u,f,g,v,p)}set(e,t,n,i,r,o,a,l,c,h,d,u,f,g,v,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=f,m[7]=g,m[11]=v,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new it().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/mi.setFromMatrixColumn(e,0).length(),r=1/mi.setFromMatrixColumn(e,1).length(),o=1/mi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=o*h,f=o*d,g=a*h,v=a*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=u-v*c,t[9]=-a*l,t[2]=v-u*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){const u=l*h,f=l*d,g=c*h,v=c*d;t[0]=u+v*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=v+u*a,t[10]=o*l}else if(e.order==="ZXY"){const u=l*h,f=l*d,g=c*h,v=c*d;t[0]=u-v*a,t[4]=-o*d,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=v-u*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const u=o*h,f=o*d,g=a*h,v=a*d;t[0]=l*h,t[4]=g*c-f,t[8]=u*c+v,t[1]=l*d,t[5]=v*c+u,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const u=o*l,f=o*c,g=a*l,v=a*c;t[0]=l*h,t[4]=v-u*d,t[8]=g*d+f,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*d+g,t[10]=u-v*d}else if(e.order==="XZY"){const u=o*l,f=o*c,g=a*l,v=a*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+v,t[5]=o*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=a*h,t[10]=v*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(of,e,af)}lookAt(e,t,n){const i=this.elements;return Ot.subVectors(e,t),Ot.lengthSq()===0&&(Ot.z=1),Ot.normalize(),Rn.crossVectors(n,Ot),Rn.lengthSq()===0&&(Math.abs(n.z)===1?Ot.x+=1e-4:Ot.z+=1e-4,Ot.normalize(),Rn.crossVectors(n,Ot)),Rn.normalize(),Gr.crossVectors(Ot,Rn),i[0]=Rn.x,i[4]=Gr.x,i[8]=Ot.x,i[1]=Rn.y,i[5]=Gr.y,i[9]=Ot.y,i[2]=Rn.z,i[6]=Gr.z,i[10]=Ot.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],v=n[6],p=n[10],m=n[14],x=n[3],_=n[7],M=n[11],C=n[15],T=i[0],w=i[4],L=i[8],b=i[12],y=i[1],U=i[5],P=i[9],I=i[13],N=i[2],W=i[6],B=i[10],se=i[14],j=i[3],K=i[7],q=i[11],F=i[15];return r[0]=o*T+a*y+l*N+c*j,r[4]=o*w+a*U+l*W+c*K,r[8]=o*L+a*P+l*B+c*q,r[12]=o*b+a*I+l*se+c*F,r[1]=h*T+d*y+u*N+f*j,r[5]=h*w+d*U+u*W+f*K,r[9]=h*L+d*P+u*B+f*q,r[13]=h*b+d*I+u*se+f*F,r[2]=g*T+v*y+p*N+m*j,r[6]=g*w+v*U+p*W+m*K,r[10]=g*L+v*P+p*B+m*q,r[14]=g*b+v*I+p*se+m*F,r[3]=x*T+_*y+M*N+C*j,r[7]=x*w+_*U+M*W+C*K,r[11]=x*L+_*P+M*B+C*q,r[15]=x*b+_*I+M*se+C*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],v=e[7],p=e[11],m=e[15];return g*(+r*l*d-i*c*d-r*a*u+n*c*u+i*a*f-n*l*f)+v*(+t*l*f-t*c*u+r*o*u-i*o*f+i*c*h-r*l*h)+p*(+t*c*d-t*a*f-r*o*d+n*o*f+r*a*h-n*c*h)+m*(-i*a*h-t*l*d+t*a*u+i*o*d-n*o*u+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],v=e[13],p=e[14],m=e[15],x=d*p*c-v*u*c+v*l*f-a*p*f-d*l*m+a*u*m,_=g*u*c-h*p*c-g*l*f+o*p*f+h*l*m-o*u*m,M=h*v*c-g*d*c+g*a*f-o*v*f-h*a*m+o*d*m,C=g*d*l-h*v*l-g*a*u+o*v*u+h*a*p-o*d*p,T=t*x+n*_+i*M+r*C;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/T;return e[0]=x*w,e[1]=(v*u*r-d*p*r-v*i*f+n*p*f+d*i*m-n*u*m)*w,e[2]=(a*p*r-v*l*r+v*i*c-n*p*c-a*i*m+n*l*m)*w,e[3]=(d*l*r-a*u*r-d*i*c+n*u*c+a*i*f-n*l*f)*w,e[4]=_*w,e[5]=(h*p*r-g*u*r+g*i*f-t*p*f-h*i*m+t*u*m)*w,e[6]=(g*l*r-o*p*r-g*i*c+t*p*c+o*i*m-t*l*m)*w,e[7]=(o*u*r-h*l*r+h*i*c-t*u*c-o*i*f+t*l*f)*w,e[8]=M*w,e[9]=(g*d*r-h*v*r-g*n*f+t*v*f+h*n*m-t*d*m)*w,e[10]=(o*v*r-g*a*r+g*n*c-t*v*c-o*n*m+t*a*m)*w,e[11]=(h*a*r-o*d*r-h*n*c+t*d*c+o*n*f-t*a*f)*w,e[12]=C*w,e[13]=(h*v*i-g*d*i+g*n*u-t*v*u-h*n*p+t*d*p)*w,e[14]=(g*a*i-o*v*i-g*n*l+t*v*l+o*n*p-t*a*p)*w,e[15]=(o*d*i-h*a*i+h*n*l-t*d*l-o*n*u+t*a*u)*w,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,g=r*d,v=o*h,p=o*d,m=a*d,x=l*c,_=l*h,M=l*d,C=n.x,T=n.y,w=n.z;return i[0]=(1-(v+m))*C,i[1]=(f+M)*C,i[2]=(g-_)*C,i[3]=0,i[4]=(f-M)*T,i[5]=(1-(u+m))*T,i[6]=(p+x)*T,i[7]=0,i[8]=(g+_)*w,i[9]=(p-x)*w,i[10]=(1-(u+v))*w,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=mi.set(i[0],i[1],i[2]).length();const o=mi.set(i[4],i[5],i[6]).length(),a=mi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Qt.copy(this);const c=1/r,h=1/o,d=1/a;return Qt.elements[0]*=c,Qt.elements[1]*=c,Qt.elements[2]*=c,Qt.elements[4]*=h,Qt.elements[5]*=h,Qt.elements[6]*=h,Qt.elements[8]*=d,Qt.elements[9]*=d,Qt.elements[10]*=d,t.setFromRotationMatrix(Qt),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=yn){const l=this.elements,c=2*r/(t-e),h=2*r/(n-i),d=(t+e)/(t-e),u=(n+i)/(n-i);let f,g;if(a===yn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Ms)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=yn){const l=this.elements,c=1/(t-e),h=1/(n-i),d=1/(o-r),u=(t+e)*c,f=(n+i)*h;let g,v;if(a===yn)g=(o+r)*d,v=-2*d;else if(a===Ms)g=r*d,v=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const mi=new H,Qt=new it,of=new H(0,0,0),af=new H(1,1,1),Rn=new H,Gr=new H,Ot=new H,gl=new it,vl=new ii;class ln{constructor(e=0,t=0,n=0,i=ln.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-wt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(wt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-wt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(wt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return gl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(gl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return vl.setFromEuler(this),this.setFromQuaternion(vl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ln.DEFAULT_ORDER="XYZ";class ta{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let lf=0;const _l=new H,gi=new ii,fn=new it,Hr=new H,sr=new H,cf=new H,hf=new ii,xl=new H(1,0,0),yl=new H(0,1,0),bl=new H(0,0,1),Sl={type:"added"},uf={type:"removed"},vi={type:"childadded",child:null},ao={type:"childremoved",child:null};class xt extends ri{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lf++}),this.uuid=Hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xt.DEFAULT_UP.clone();const e=new H,t=new ln,n=new ii,i=new H(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new it},normalMatrix:{value:new Ke}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ta,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return gi.setFromAxisAngle(e,t),this.quaternion.multiply(gi),this}rotateOnWorldAxis(e,t){return gi.setFromAxisAngle(e,t),this.quaternion.premultiply(gi),this}rotateX(e){return this.rotateOnAxis(xl,e)}rotateY(e){return this.rotateOnAxis(yl,e)}rotateZ(e){return this.rotateOnAxis(bl,e)}translateOnAxis(e,t){return _l.copy(e).applyQuaternion(this.quaternion),this.position.add(_l.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(xl,e)}translateY(e){return this.translateOnAxis(yl,e)}translateZ(e){return this.translateOnAxis(bl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Hr.copy(e):Hr.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),sr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fn.lookAt(sr,Hr,this.up):fn.lookAt(Hr,sr,this.up),this.quaternion.setFromRotationMatrix(fn),i&&(fn.extractRotation(i.matrixWorld),gi.setFromRotationMatrix(fn),this.quaternion.premultiply(gi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Sl),vi.child=e,this.dispatchEvent(vi),vi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(uf),ao.child=e,this.dispatchEvent(ao),ao.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(fn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Sl),vi.child=e,this.dispatchEvent(vi),vi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sr,e,cf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sr,hf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),d=o(e.shapes),u=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}xt.DEFAULT_UP=new H(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const $t=new H,pn=new H,lo=new H,mn=new H,_i=new H,xi=new H,Ml=new H,co=new H,ho=new H,uo=new H;class on{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),$t.subVectors(e,t),i.cross($t);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){$t.subVectors(i,t),pn.subVectors(n,t),lo.subVectors(e,t);const o=$t.dot($t),a=$t.dot(pn),l=$t.dot(lo),c=pn.dot(pn),h=pn.dot(lo),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,mn)===null?!1:mn.x>=0&&mn.y>=0&&mn.x+mn.y<=1}static getInterpolation(e,t,n,i,r,o,a,l){return this.getBarycoord(e,t,n,i,mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,mn.x),l.addScaledVector(o,mn.y),l.addScaledVector(a,mn.z),l)}static isFrontFacing(e,t,n,i){return $t.subVectors(n,t),pn.subVectors(e,t),$t.cross(pn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $t.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),$t.cross(pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return on.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return on.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return on.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return on.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return on.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;_i.subVectors(i,n),xi.subVectors(r,n),co.subVectors(e,n);const l=_i.dot(co),c=xi.dot(co);if(l<=0&&c<=0)return t.copy(n);ho.subVectors(e,i);const h=_i.dot(ho),d=xi.dot(ho);if(h>=0&&d<=h)return t.copy(i);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(_i,o);uo.subVectors(e,r);const f=_i.dot(uo),g=xi.dot(uo);if(g>=0&&f<=g)return t.copy(r);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(xi,a);const p=h*g-f*d;if(p<=0&&d-h>=0&&f-g>=0)return Ml.subVectors(r,i),a=(d-h)/(d-h+(f-g)),t.copy(i).addScaledVector(Ml,a);const m=1/(p+v+u);return o=v*m,a=u*m,t.copy(n).addScaledVector(_i,o).addScaledVector(xi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const lh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pn={h:0,s:0,l:0},Vr={h:0,s:0,l:0};function fo(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ve{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=nn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=nt.workingColorSpace){if(e=ea(e,1),t=wt(t,0,1),n=wt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=fo(o,r,e+1/3),this.g=fo(o,r,e),this.b=fo(o,r,e-1/3)}return nt.toWorkingColorSpace(this,i),this}setStyle(e,t=nn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=nn){const n=lh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Di(e.r),this.g=Di(e.g),this.b=Di(e.b),this}copyLinearToSRGB(e){return this.r=$s(e.r),this.g=$s(e.g),this.b=$s(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nn){return nt.fromWorkingColorSpace(Et.copy(this),e),Math.round(wt(Et.r*255,0,255))*65536+Math.round(wt(Et.g*255,0,255))*256+Math.round(wt(Et.b*255,0,255))}getHexString(e=nn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.fromWorkingColorSpace(Et.copy(this),t);const n=Et.r,i=Et.g,r=Et.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=nt.workingColorSpace){return nt.fromWorkingColorSpace(Et.copy(this),t),e.r=Et.r,e.g=Et.g,e.b=Et.b,e}getStyle(e=nn){nt.fromWorkingColorSpace(Et.copy(this),e);const t=Et.r,n=Et.g,i=Et.b;return e!==nn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Pn),this.setHSL(Pn.h+e,Pn.s+t,Pn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Pn),e.getHSL(Vr);const n=vr(Pn.h,Vr.h,t),i=vr(Pn.s,Vr.s,t),r=vr(Pn.l,Vr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Et=new Ve;Ve.NAMES=lh;let df=0;class Vi extends ri{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:df++}),this.uuid=Hi(),this.name="",this.type="Material",this.blending=Li,this.side=On,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Do,this.blendDst=Io,this.blendEquation=Jn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ve(0,0,0),this.blendAlpha=0,this.depthFunc=_s,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ll,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hi,this.stencilZFail=hi,this.stencilZPass=hi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Li&&(n.blending=this.blending),this.side!==On&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Do&&(n.blendSrc=this.blendSrc),this.blendDst!==Io&&(n.blendDst=this.blendDst),this.blendEquation!==Jn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==_s&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ll&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==hi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==hi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Sr extends Vi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=Yc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ct=new H,Wr=new Oe;class zt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=cl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=xn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return sh("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Wr.fromBufferAttribute(this,t),Wr.applyMatrix3(e),this.setXY(t,Wr.x,Wr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix3(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix4(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.applyNormalMatrix(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ct.fromBufferAttribute(this,t),ct.transformDirection(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ri(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ct(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ri(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ri(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ri(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ri(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array),i=Ct(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array),i=Ct(i,this.array),r=Ct(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==cl&&(e.usage=this.usage),e}}class ch extends zt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class hh extends zt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class yt extends zt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let ff=0;const Yt=new it,po=new xt,yi=new H,kt=new Sn,or=new Sn,mt=new H;class Gt extends ri{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ff++}),this.uuid=Hi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(rh(e)?hh:ch)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Yt.makeRotationFromQuaternion(e),this.applyMatrix4(Yt),this}rotateX(e){return Yt.makeRotationX(e),this.applyMatrix4(Yt),this}rotateY(e){return Yt.makeRotationY(e),this.applyMatrix4(Yt),this}rotateZ(e){return Yt.makeRotationZ(e),this.applyMatrix4(Yt),this}translate(e,t,n){return Yt.makeTranslation(e,t,n),this.applyMatrix4(Yt),this}scale(e,t,n){return Yt.makeScale(e,t,n),this.applyMatrix4(Yt),this}lookAt(e){return po.lookAt(e),po.updateMatrix(),this.applyMatrix4(po.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(yi).negate(),this.translate(yi.x,yi.y,yi.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new yt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];kt.setFromBufferAttribute(r),this.morphTargetsRelative?(mt.addVectors(this.boundingBox.min,kt.min),this.boundingBox.expandByPoint(mt),mt.addVectors(this.boundingBox.max,kt.max),this.boundingBox.expandByPoint(mt)):(this.boundingBox.expandByPoint(kt.min),this.boundingBox.expandByPoint(kt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new si);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const n=this.boundingSphere.center;if(kt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];or.setFromBufferAttribute(a),this.morphTargetsRelative?(mt.addVectors(kt.min,or.min),kt.expandByPoint(mt),mt.addVectors(kt.max,or.max),kt.expandByPoint(mt)):(kt.expandByPoint(or.min),kt.expandByPoint(or.max))}kt.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)mt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(mt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)mt.fromBufferAttribute(a,c),l&&(yi.fromBufferAttribute(e,c),mt.add(yi)),i=Math.max(i,n.distanceToSquared(mt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new zt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<n.count;L++)a[L]=new H,l[L]=new H;const c=new H,h=new H,d=new H,u=new Oe,f=new Oe,g=new Oe,v=new H,p=new H;function m(L,b,y){c.fromBufferAttribute(n,L),h.fromBufferAttribute(n,b),d.fromBufferAttribute(n,y),u.fromBufferAttribute(r,L),f.fromBufferAttribute(r,b),g.fromBufferAttribute(r,y),h.sub(c),d.sub(c),f.sub(u),g.sub(u);const U=1/(f.x*g.y-g.x*f.y);isFinite(U)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(U),p.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(U),a[L].add(v),a[b].add(v),a[y].add(v),l[L].add(p),l[b].add(p),l[y].add(p))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let L=0,b=x.length;L<b;++L){const y=x[L],U=y.start,P=y.count;for(let I=U,N=U+P;I<N;I+=3)m(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const _=new H,M=new H,C=new H,T=new H;function w(L){C.fromBufferAttribute(i,L),T.copy(C);const b=a[L];_.copy(b),_.sub(C.multiplyScalar(C.dot(b))).normalize(),M.crossVectors(T,b);const U=M.dot(l[L])<0?-1:1;o.setXYZW(L,_.x,_.y,_.z,U)}for(let L=0,b=x.length;L<b;++L){const y=x[L],U=y.start,P=y.count;for(let I=U,N=U+P;I<N;I+=3)w(e.getX(I+0)),w(e.getX(I+1)),w(e.getX(I+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new zt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const i=new H,r=new H,o=new H,a=new H,l=new H,c=new H,h=new H,d=new H;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),v=e.getX(u+1),p=e.getX(u+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,p),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,f=t.count;u<f;u+=3)i.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)mt.fromBufferAttribute(e,t),mt.normalize(),e.setXYZ(t,mt.x,mt.y,mt.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let f=0,g=0;for(let v=0,p=l.length;v<p;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let m=0;m<h;m++)u[g++]=c[f++]}return new zt(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Gt,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=e(u,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const El=new it,Wn=new Rs,Xr=new si,wl=new H,bi=new H,Si=new H,Mi=new H,mo=new H,Yr=new H,jr=new Oe,qr=new Oe,Kr=new Oe,Tl=new H,Al=new H,Cl=new H,Zr=new H,Jr=new H;class Pt extends xt{constructor(e=new Gt,t=new Sr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){Yr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(mo.fromBufferAttribute(d,e),o?Yr.addScaledVector(mo,h):Yr.addScaledVector(mo.sub(t),h))}t.add(Yr)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xr.copy(n.boundingSphere),Xr.applyMatrix4(r),Wn.copy(e.ray).recast(e.near),!(Xr.containsPoint(Wn.origin)===!1&&(Wn.intersectSphere(Xr,wl)===null||Wn.origin.distanceToSquared(wl)>(e.far-e.near)**2))&&(El.copy(r).invert(),Wn.copy(e.ray).applyMatrix4(El),!(n.boundingBox!==null&&Wn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Wn)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=u.length;g<v;g++){const p=u[g],m=o[p.materialIndex],x=Math.max(p.start,f.start),_=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let M=x,C=_;M<C;M+=3){const T=a.getX(M),w=a.getX(M+1),L=a.getX(M+2);i=Qr(this,m,e,n,c,h,d,T,w,L),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){const x=a.getX(p),_=a.getX(p+1),M=a.getX(p+2);i=Qr(this,o,e,n,c,h,d,x,_,M),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=u.length;g<v;g++){const p=u[g],m=o[p.materialIndex],x=Math.max(p.start,f.start),_=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let M=x,C=_;M<C;M+=3){const T=M,w=M+1,L=M+2;i=Qr(this,m,e,n,c,h,d,T,w,L),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){const x=p,_=p+1,M=p+2;i=Qr(this,o,e,n,c,h,d,x,_,M),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function pf(s,e,t,n,i,r,o,a){let l;if(e.side===Ft?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,e.side===On,a),l===null)return null;Jr.copy(a),Jr.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Jr);return c<t.near||c>t.far?null:{distance:c,point:Jr.clone(),object:s}}function Qr(s,e,t,n,i,r,o,a,l,c){s.getVertexPosition(a,bi),s.getVertexPosition(l,Si),s.getVertexPosition(c,Mi);const h=pf(s,e,t,n,bi,Si,Mi,Zr);if(h){i&&(jr.fromBufferAttribute(i,a),qr.fromBufferAttribute(i,l),Kr.fromBufferAttribute(i,c),h.uv=on.getInterpolation(Zr,bi,Si,Mi,jr,qr,Kr,new Oe)),r&&(jr.fromBufferAttribute(r,a),qr.fromBufferAttribute(r,l),Kr.fromBufferAttribute(r,c),h.uv1=on.getInterpolation(Zr,bi,Si,Mi,jr,qr,Kr,new Oe)),o&&(Tl.fromBufferAttribute(o,a),Al.fromBufferAttribute(o,l),Cl.fromBufferAttribute(o,c),h.normal=on.getInterpolation(Zr,bi,Si,Mi,Tl,Al,Cl,new H),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new H,materialIndex:0};on.getNormal(bi,Si,Mi,d.normal),h.face=d}return h}class Wi extends Gt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new yt(c,3)),this.setAttribute("normal",new yt(h,3)),this.setAttribute("uv",new yt(d,2));function g(v,p,m,x,_,M,C,T,w,L,b){const y=M/w,U=C/L,P=M/2,I=C/2,N=T/2,W=w+1,B=L+1;let se=0,j=0;const K=new H;for(let q=0;q<B;q++){const F=q*U-I;for(let V=0;V<W;V++){const ne=V*y-P;K[v]=ne*x,K[p]=F*_,K[m]=N,c.push(K.x,K.y,K.z),K[v]=0,K[p]=0,K[m]=T>0?1:-1,h.push(K.x,K.y,K.z),d.push(V/w),d.push(1-q/L),se+=1}}for(let q=0;q<L;q++)for(let F=0;F<w;F++){const V=u+F+W*q,ne=u+F+W*(q+1),O=u+(F+1)+W*(q+1),k=u+(F+1)+W*q;l.push(V,ne,k),l.push(ne,O,k),j+=6}a.addGroup(f,j,b),f+=j,u+=se}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Bi(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Rt(s){const e={};for(let t=0;t<s.length;t++){const n=Bi(s[t]);for(const i in n)e[i]=n[i]}return e}function mf(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function uh(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}const br={clone:Bi,merge:Rt};var gf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class It extends Vi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gf,this.fragmentShader=vf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Bi(e.uniforms),this.uniformsGroups=mf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class dh extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=yn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ln=new H,Rl=new Oe,Pl=new Oe;class jt extends dh{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=yr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(gr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return yr*2*Math.atan(Math.tan(gr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ln.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ln.x,Ln.y).multiplyScalar(-e/Ln.z),Ln.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ln.x,Ln.y).multiplyScalar(-e/Ln.z)}getViewSize(e,t){return this.getViewBounds(e,Rl,Pl),t.subVectors(Pl,Rl)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(gr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ei=-90,wi=1;class _f extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new jt(Ei,wi,e,t);i.layers=this.layers,this.add(i);const r=new jt(Ei,wi,e,t);r.layers=this.layers,this.add(r);const o=new jt(Ei,wi,e,t);o.layers=this.layers,this.add(o);const a=new jt(Ei,wi,e,t);a.layers=this.layers,this.add(a);const l=new jt(Ei,wi,e,t);l.layers=this.layers,this.add(l);const c=new jt(Ei,wi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===yn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ms)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class fh extends Tt{constructor(e,t,n,i,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Ii,super(e,t,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class xf extends en{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new fh(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Bt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Wi(5,5,5),r=new It({name:"CubemapFromEquirect",uniforms:Bi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ft,blending:bn});r.uniforms.tEquirect.value=t;const o=new Pt(i,r),a=t.minFilter;return t.minFilter===ti&&(t.minFilter=Bt),new _f(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}const go=new H,yf=new H,bf=new Ke;class Dn{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=go.subVectors(n,t).cross(yf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(go),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||bf.getNormalMatrix(e),i=this.coplanarPoint(go).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Xn=new si,$r=new H;class na{constructor(e=new Dn,t=new Dn,n=new Dn,i=new Dn,r=new Dn,o=new Dn){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=yn){const n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],d=i[6],u=i[7],f=i[8],g=i[9],v=i[10],p=i[11],m=i[12],x=i[13],_=i[14],M=i[15];if(n[0].setComponents(l-r,u-c,p-f,M-m).normalize(),n[1].setComponents(l+r,u+c,p+f,M+m).normalize(),n[2].setComponents(l+o,u+h,p+g,M+x).normalize(),n[3].setComponents(l-o,u-h,p-g,M-x).normalize(),n[4].setComponents(l-a,u-d,p-v,M-_).normalize(),t===yn)n[5].setComponents(l+a,u+d,p+v,M+_).normalize();else if(t===Ms)n[5].setComponents(a,d,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Xn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Xn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Xn)}intersectsSprite(e){return Xn.center.set(0,0,0),Xn.radius=.7071067811865476,Xn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Xn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if($r.x=i.normal.x>0?e.max.x:e.min.x,$r.y=i.normal.y>0?e.max.y:e.min.y,$r.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint($r)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ph(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Sf(s){const e=new WeakMap;function t(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const h=l.array,d=l._updateRange,u=l.updateRanges;if(s.bindBuffer(c,a),d.count===-1&&u.length===0&&s.bufferSubData(c,0,h),u.length!==0){for(let f=0,g=u.length;f<g;f++){const v=u[f];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}d.count!==-1&&(s.bufferSubData(c,d.offset*h.BYTES_PER_ELEMENT,h,d.offset,d.count),d.count=-1),l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(s.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}class oi extends Gt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,d=e/a,u=t/l,f=[],g=[],v=[],p=[];for(let m=0;m<h;m++){const x=m*u-o;for(let _=0;_<c;_++){const M=_*d-r;g.push(M,-x,0),v.push(0,0,1),p.push(_/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let x=0;x<a;x++){const _=x+c*m,M=x+c*(m+1),C=x+1+c*(m+1),T=x+1+c*m;f.push(_,M,T),f.push(M,C,T)}this.setIndex(f),this.setAttribute("position",new yt(g,3)),this.setAttribute("normal",new yt(v,3)),this.setAttribute("uv",new yt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new oi(e.width,e.height,e.widthSegments,e.heightSegments)}}var Mf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ef=`#ifdef USE_ALPHAHASH
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
#endif`,wf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Tf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Af=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Cf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Rf=`#ifdef USE_AOMAP
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
#endif`,Pf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Lf=`#ifdef USE_BATCHING
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
#endif`,Uf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Df=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,If=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ff=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Nf=`#ifdef USE_IRIDESCENCE
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
#endif`,Of=`#ifdef USE_BUMPMAP
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
#endif`,kf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Bf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Gf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Vf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Wf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Xf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Yf=`#define PI 3.141592653589793
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
} // validated`,jf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,qf=`vec3 transformedNormal = objectNormal;
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
#endif`,Kf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Zf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$f="gl_FragColor = linearToOutputTexel( gl_FragColor );",ep=`
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
}`,tp=`#ifdef USE_ENVMAP
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
#endif`,np=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ip=`#ifdef USE_ENVMAP
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
#endif`,rp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,sp=`#ifdef USE_ENVMAP
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
#endif`,op=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ap=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,lp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,cp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,hp=`#ifdef USE_GRADIENTMAP
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
}`,up=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,dp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,fp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,pp=`uniform bool receiveShadow;
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
#endif`,mp=`#ifdef USE_ENVMAP
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
#endif`,gp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,vp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_p=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,yp=`PhysicalMaterial material;
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
#endif`,bp=`struct PhysicalMaterial {
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
}`,Sp=`
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
#endif`,Mp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ep=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,wp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Tp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ap=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Rp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Pp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Lp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Up=`#if defined( USE_POINTS_UV )
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
#endif`,Dp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ip=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Fp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Np=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Op=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,kp=`#ifdef USE_MORPHTARGETS
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
#endif`,Bp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Gp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Hp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Xp=`#ifdef USE_NORMALMAP
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
#endif`,Yp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,jp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Kp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Zp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Jp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Qp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,$p=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,em=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,tm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,nm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,im=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,rm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,sm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,om=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,am=`float getShadowMask() {
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
}`,lm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,cm=`#ifdef USE_SKINNING
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
#endif`,hm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,um=`#ifdef USE_SKINNING
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
#endif`,dm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,fm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,pm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,mm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,gm=`#ifdef USE_TRANSMISSION
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
#endif`,vm=`#ifdef USE_TRANSMISSION
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
#endif`,_m=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ym=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Sm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mm=`uniform sampler2D t2D;
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
}`,Em=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Am=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cm=`#include <common>
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
}`,Rm=`#if DEPTH_PACKING == 3200
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
}`,Pm=`#define DISTANCE
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
}`,Lm=`#define DISTANCE
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
}`,Um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Dm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Im=`uniform float scale;
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
}`,Fm=`uniform vec3 diffuse;
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
}`,Nm=`#include <common>
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
}`,Om=`uniform vec3 diffuse;
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
}`,km=`#define LAMBERT
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
}`,Bm=`#define LAMBERT
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
}`,zm=`#define MATCAP
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
}`,Gm=`#define MATCAP
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
}`,Hm=`#define NORMAL
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
}`,Vm=`#define NORMAL
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
}`,Wm=`#define PHONG
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
}`,Xm=`#define PHONG
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
}`,Ym=`#define STANDARD
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
}`,jm=`#define STANDARD
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
}`,qm=`#define TOON
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
}`,Km=`#define TOON
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
}`,Zm=`uniform float size;
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
}`,Jm=`uniform vec3 diffuse;
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
}`,Qm=`#include <common>
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
}`,$m=`uniform vec3 color;
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
}`,eg=`uniform float rotation;
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
}`,tg=`uniform vec3 diffuse;
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
}`,qe={alphahash_fragment:Mf,alphahash_pars_fragment:Ef,alphamap_fragment:wf,alphamap_pars_fragment:Tf,alphatest_fragment:Af,alphatest_pars_fragment:Cf,aomap_fragment:Rf,aomap_pars_fragment:Pf,batching_pars_vertex:Lf,batching_vertex:Uf,begin_vertex:Df,beginnormal_vertex:If,bsdfs:Ff,iridescence_fragment:Nf,bumpmap_pars_fragment:Of,clipping_planes_fragment:kf,clipping_planes_pars_fragment:Bf,clipping_planes_pars_vertex:zf,clipping_planes_vertex:Gf,color_fragment:Hf,color_pars_fragment:Vf,color_pars_vertex:Wf,color_vertex:Xf,common:Yf,cube_uv_reflection_fragment:jf,defaultnormal_vertex:qf,displacementmap_pars_vertex:Kf,displacementmap_vertex:Zf,emissivemap_fragment:Jf,emissivemap_pars_fragment:Qf,colorspace_fragment:$f,colorspace_pars_fragment:ep,envmap_fragment:tp,envmap_common_pars_fragment:np,envmap_pars_fragment:ip,envmap_pars_vertex:rp,envmap_physical_pars_fragment:mp,envmap_vertex:sp,fog_vertex:op,fog_pars_vertex:ap,fog_fragment:lp,fog_pars_fragment:cp,gradientmap_pars_fragment:hp,lightmap_pars_fragment:up,lights_lambert_fragment:dp,lights_lambert_pars_fragment:fp,lights_pars_begin:pp,lights_toon_fragment:gp,lights_toon_pars_fragment:vp,lights_phong_fragment:_p,lights_phong_pars_fragment:xp,lights_physical_fragment:yp,lights_physical_pars_fragment:bp,lights_fragment_begin:Sp,lights_fragment_maps:Mp,lights_fragment_end:Ep,logdepthbuf_fragment:wp,logdepthbuf_pars_fragment:Tp,logdepthbuf_pars_vertex:Ap,logdepthbuf_vertex:Cp,map_fragment:Rp,map_pars_fragment:Pp,map_particle_fragment:Lp,map_particle_pars_fragment:Up,metalnessmap_fragment:Dp,metalnessmap_pars_fragment:Ip,morphinstance_vertex:Fp,morphcolor_vertex:Np,morphnormal_vertex:Op,morphtarget_pars_vertex:kp,morphtarget_vertex:Bp,normal_fragment_begin:zp,normal_fragment_maps:Gp,normal_pars_fragment:Hp,normal_pars_vertex:Vp,normal_vertex:Wp,normalmap_pars_fragment:Xp,clearcoat_normal_fragment_begin:Yp,clearcoat_normal_fragment_maps:jp,clearcoat_pars_fragment:qp,iridescence_pars_fragment:Kp,opaque_fragment:Zp,packing:Jp,premultiplied_alpha_fragment:Qp,project_vertex:$p,dithering_fragment:em,dithering_pars_fragment:tm,roughnessmap_fragment:nm,roughnessmap_pars_fragment:im,shadowmap_pars_fragment:rm,shadowmap_pars_vertex:sm,shadowmap_vertex:om,shadowmask_pars_fragment:am,skinbase_vertex:lm,skinning_pars_vertex:cm,skinning_vertex:hm,skinnormal_vertex:um,specularmap_fragment:dm,specularmap_pars_fragment:fm,tonemapping_fragment:pm,tonemapping_pars_fragment:mm,transmission_fragment:gm,transmission_pars_fragment:vm,uv_pars_fragment:_m,uv_pars_vertex:xm,uv_vertex:ym,worldpos_vertex:bm,background_vert:Sm,background_frag:Mm,backgroundCube_vert:Em,backgroundCube_frag:wm,cube_vert:Tm,cube_frag:Am,depth_vert:Cm,depth_frag:Rm,distanceRGBA_vert:Pm,distanceRGBA_frag:Lm,equirect_vert:Um,equirect_frag:Dm,linedashed_vert:Im,linedashed_frag:Fm,meshbasic_vert:Nm,meshbasic_frag:Om,meshlambert_vert:km,meshlambert_frag:Bm,meshmatcap_vert:zm,meshmatcap_frag:Gm,meshnormal_vert:Hm,meshnormal_frag:Vm,meshphong_vert:Wm,meshphong_frag:Xm,meshphysical_vert:Ym,meshphysical_frag:jm,meshtoon_vert:qm,meshtoon_frag:Km,points_vert:Zm,points_frag:Jm,shadow_vert:Qm,shadow_frag:$m,sprite_vert:eg,sprite_frag:tg},Ue={common:{diffuse:{value:new Ve(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new Ve(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},rn={basic:{uniforms:Rt([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:Rt([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new Ve(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:Rt([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new Ve(0)},specular:{value:new Ve(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:Rt([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new Ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:Rt([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new Ve(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:Rt([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:Rt([Ue.points,Ue.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:Rt([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:Rt([Ue.common,Ue.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:Rt([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:Rt([Ue.sprite,Ue.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:Rt([Ue.common,Ue.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:Rt([Ue.lights,Ue.fog,{color:{value:new Ve(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};rn.physical={uniforms:Rt([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new Ve(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new Ve(0)},specularColor:{value:new Ve(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const es={r:0,b:0,g:0},Yn=new ln,ng=new it;function ig(s,e,t,n,i,r,o){const a=new Ve(0);let l=r===!0?0:1,c,h,d=null,u=0,f=null;function g(x){let _=x.isScene===!0?x.background:null;return _&&_.isTexture&&(_=(x.backgroundBlurriness>0?t:e).get(_)),_}function v(x){let _=!1;const M=g(x);M===null?m(a,l):M&&M.isColor&&(m(M,1),_=!0);const C=s.xr.getEnvironmentBlendMode();C==="additive"?n.buffers.color.setClear(0,0,0,1,o):C==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function p(x,_){const M=g(_);M&&(M.isCubeTexture||M.mapping===As)?(h===void 0&&(h=new Pt(new Wi(1,1,1),new It({name:"BackgroundCubeMaterial",uniforms:Bi(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:Ft,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,T,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Yn.copy(_.backgroundRotation),Yn.x*=-1,Yn.y*=-1,Yn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Yn.y*=-1,Yn.z*=-1),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(ng.makeRotationFromEuler(Yn)),h.material.toneMapped=nt.getTransfer(M.colorSpace)!==ot,(d!==M||u!==M.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,d=M,u=M.version,f=s.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Pt(new oi(2,2),new It({name:"BackgroundMaterial",uniforms:Bi(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:On,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=nt.getTransfer(M.colorSpace)!==ot,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(d!==M||u!==M.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,d=M,u=M.version,f=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function m(x,_){x.getRGB(es,uh(s)),n.buffers.color.setClear(es.r,es.g,es.b,_,o)}return{getClearColor:function(){return a},setClearColor:function(x,_=1){a.set(x),l=_,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,m(a,l)},render:v,addToRenderList:p}}function rg(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null);let r=i,o=!1;function a(y,U,P,I,N){let W=!1;const B=d(I,P,U);r!==B&&(r=B,c(r.object)),W=f(y,I,P,N),W&&g(y,I,P,N),N!==null&&e.update(N,s.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,M(y,U,P,I),N!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return s.createVertexArray()}function c(y){return s.bindVertexArray(y)}function h(y){return s.deleteVertexArray(y)}function d(y,U,P){const I=P.wireframe===!0;let N=n[y.id];N===void 0&&(N={},n[y.id]=N);let W=N[U.id];W===void 0&&(W={},N[U.id]=W);let B=W[I];return B===void 0&&(B=u(l()),W[I]=B),B}function u(y){const U=[],P=[],I=[];for(let N=0;N<t;N++)U[N]=0,P[N]=0,I[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:P,attributeDivisors:I,object:y,attributes:{},index:null}}function f(y,U,P,I){const N=r.attributes,W=U.attributes;let B=0;const se=P.getAttributes();for(const j in se)if(se[j].location>=0){const q=N[j];let F=W[j];if(F===void 0&&(j==="instanceMatrix"&&y.instanceMatrix&&(F=y.instanceMatrix),j==="instanceColor"&&y.instanceColor&&(F=y.instanceColor)),q===void 0||q.attribute!==F||F&&q.data!==F.data)return!0;B++}return r.attributesNum!==B||r.index!==I}function g(y,U,P,I){const N={},W=U.attributes;let B=0;const se=P.getAttributes();for(const j in se)if(se[j].location>=0){let q=W[j];q===void 0&&(j==="instanceMatrix"&&y.instanceMatrix&&(q=y.instanceMatrix),j==="instanceColor"&&y.instanceColor&&(q=y.instanceColor));const F={};F.attribute=q,q&&q.data&&(F.data=q.data),N[j]=F,B++}r.attributes=N,r.attributesNum=B,r.index=I}function v(){const y=r.newAttributes;for(let U=0,P=y.length;U<P;U++)y[U]=0}function p(y){m(y,0)}function m(y,U){const P=r.newAttributes,I=r.enabledAttributes,N=r.attributeDivisors;P[y]=1,I[y]===0&&(s.enableVertexAttribArray(y),I[y]=1),N[y]!==U&&(s.vertexAttribDivisor(y,U),N[y]=U)}function x(){const y=r.newAttributes,U=r.enabledAttributes;for(let P=0,I=U.length;P<I;P++)U[P]!==y[P]&&(s.disableVertexAttribArray(P),U[P]=0)}function _(y,U,P,I,N,W,B){B===!0?s.vertexAttribIPointer(y,U,P,N,W):s.vertexAttribPointer(y,U,P,I,N,W)}function M(y,U,P,I){v();const N=I.attributes,W=P.getAttributes(),B=U.defaultAttributeValues;for(const se in W){const j=W[se];if(j.location>=0){let K=N[se];if(K===void 0&&(se==="instanceMatrix"&&y.instanceMatrix&&(K=y.instanceMatrix),se==="instanceColor"&&y.instanceColor&&(K=y.instanceColor)),K!==void 0){const q=K.normalized,F=K.itemSize,V=e.get(K);if(V===void 0)continue;const ne=V.buffer,O=V.type,k=V.bytesPerElement,te=O===s.INT||O===s.UNSIGNED_INT||K.gpuType===qc;if(K.isInterleavedBufferAttribute){const G=K.data,ae=G.stride,pe=K.offset;if(G.isInstancedInterleavedBuffer){for(let _e=0;_e<j.locationSize;_e++)m(j.location+_e,G.meshPerAttribute);y.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let _e=0;_e<j.locationSize;_e++)p(j.location+_e);s.bindBuffer(s.ARRAY_BUFFER,ne);for(let _e=0;_e<j.locationSize;_e++)_(j.location+_e,F/j.locationSize,O,q,ae*k,(pe+F/j.locationSize*_e)*k,te)}else{if(K.isInstancedBufferAttribute){for(let G=0;G<j.locationSize;G++)m(j.location+G,K.meshPerAttribute);y.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let G=0;G<j.locationSize;G++)p(j.location+G);s.bindBuffer(s.ARRAY_BUFFER,ne);for(let G=0;G<j.locationSize;G++)_(j.location+G,F/j.locationSize,O,q,F*k,F/j.locationSize*G*k,te)}}else if(B!==void 0){const q=B[se];if(q!==void 0)switch(q.length){case 2:s.vertexAttrib2fv(j.location,q);break;case 3:s.vertexAttrib3fv(j.location,q);break;case 4:s.vertexAttrib4fv(j.location,q);break;default:s.vertexAttrib1fv(j.location,q)}}}}x()}function C(){L();for(const y in n){const U=n[y];for(const P in U){const I=U[P];for(const N in I)h(I[N].object),delete I[N];delete U[P]}delete n[y]}}function T(y){if(n[y.id]===void 0)return;const U=n[y.id];for(const P in U){const I=U[P];for(const N in I)h(I[N].object),delete I[N];delete U[P]}delete n[y.id]}function w(y){for(const U in n){const P=n[U];if(P[y.id]===void 0)continue;const I=P[y.id];for(const N in I)h(I[N].object),delete I[N];delete P[y.id]}}function L(){b(),o=!0,r!==i&&(r=i,c(r.object))}function b(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:L,resetDefaultState:b,dispose:C,releaseStatesOfGeometry:T,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:p,disableUnusedAttributes:x}}function sg(s,e,t){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,d){d!==0&&(s.drawArraysInstanced(n,c,h,d),t.update(h,n,d))}function a(c,h,d){if(d===0)return;const u=e.get("WEBGL_multi_draw");if(u===null)for(let f=0;f<d;f++)this.render(c[f],h[f]);else{u.multiDrawArraysWEBGL(n,c,0,h,0,d);let f=0;for(let g=0;g<d;g++)f+=h[g];t.update(f,n,1)}}function l(c,h,d,u){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let g=0;for(let v=0;v<d;v++)g+=h[v];for(let v=0;v<u.length;v++)t.update(g,n,u[v])}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function og(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(T){return!(T!==an&&n.convert(T)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){const w=T===Nn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==kn&&n.convert(T)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==xn&&!w)}function l(T){if(T==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),v=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),x=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),M=f>0,C=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,maxTextures:u,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:v,maxAttributes:p,maxVertexUniforms:m,maxVaryings:x,maxFragmentUniforms:_,vertexTextures:M,maxSamples:C}}function ag(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new Dn,a=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,v=d.clipIntersection,p=d.clipShadows,m=s.get(d);if(!i||g===null||g.length===0||r&&!p)r?h(null):c();else{const x=r?0:n,_=x*4;let M=m.clippingState||null;l.value=M,M=h(g,u,_,f);for(let C=0;C!==_;++C)M[C]=t[C];m.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,g){const v=d!==null?d.length:0;let p=null;if(v!==0){if(p=l.value,g!==!0||p===null){const m=f+v*4,x=u.matrixWorldInverse;a.getNormalMatrix(x),(p===null||p.length<m)&&(p=new Float32Array(m));for(let _=0,M=f;_!==v;++_,M+=4)o.copy(d[_]).applyMatrix4(x,a),o.normal.toArray(p,M),p[M+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function lg(s){let e=new WeakMap;function t(o,a){return a===Fo?o.mapping=Ii:a===No&&(o.mapping=Fi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Fo||a===No)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new xf(l.height);return c.fromEquirectangularTexture(s,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Ps extends dh{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Pi=4,Ll=[.125,.215,.35,.446,.526,.582],Qn=20,vo=new Ps,Ul=new Ve;let _o=null,xo=0,yo=0,bo=!1;const Zn=(1+Math.sqrt(5))/2,Ti=1/Zn,Dl=[new H(-Zn,Ti,0),new H(Zn,Ti,0),new H(-Ti,0,Zn),new H(Ti,0,Zn),new H(0,Zn,-Ti),new H(0,Zn,Ti),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)];class Il{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){_o=this._renderer.getRenderTarget(),xo=this._renderer.getActiveCubeFace(),yo=this._renderer.getActiveMipmapLevel(),bo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ol(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(_o,xo,yo),this._renderer.xr.enabled=bo,e.scissorTest=!1,ts(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ii||e.mapping===Fi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_o=this._renderer.getRenderTarget(),xo=this._renderer.getActiveCubeFace(),yo=this._renderer.getActiveMipmapLevel(),bo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Bt,minFilter:Bt,generateMipmaps:!1,type:Nn,format:an,colorSpace:Bn,depthBuffer:!1},i=Fl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=cg(r)),this._blurMaterial=hg(r,e,t)}return i}_compileMaterial(e){const t=new Pt(this._lodPlanes[0],e);this._renderer.compile(t,vo)}_sceneToCubeUV(e,t,n,i){const a=new jt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(Ul),h.toneMapping=Fn,h.autoClear=!1;const f=new Sr({name:"PMREM.Background",side:Ft,depthWrite:!1,depthTest:!1}),g=new Pt(new Wi,f);let v=!1;const p=e.background;p?p.isColor&&(f.color.copy(p),e.background=null,v=!0):(f.color.copy(Ul),v=!0);for(let m=0;m<6;m++){const x=m%3;x===0?(a.up.set(0,l[m],0),a.lookAt(c[m],0,0)):x===1?(a.up.set(0,0,l[m]),a.lookAt(0,c[m],0)):(a.up.set(0,l[m],0),a.lookAt(0,0,c[m]));const _=this._cubeSize;ts(i,x*_,m>2?_:0,_,_),h.setRenderTarget(i),v&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Ii||e.mapping===Fi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ol()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nl());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new Pt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;ts(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,vo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Dl[(i-r-1)%Dl.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Pt(this._lodPlanes[i],c),u=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Qn-1),v=r/g,p=isFinite(r)?1+Math.floor(h*v):Qn;p>Qn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Qn}`);const m=[];let x=0;for(let w=0;w<Qn;++w){const L=w/v,b=Math.exp(-L*L/2);m.push(b),w===0?x+=b:w<p&&(x+=2*b)}for(let w=0;w<m.length;w++)m[w]=m[w]/x;u.envMap.value=e.texture,u.samples.value=p,u.weights.value=m,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:_}=this;u.dTheta.value=g,u.mipInt.value=_-n;const M=this._sizeLods[i],C=3*M*(i>_-Pi?i-_+Pi:0),T=4*(this._cubeSize-M);ts(t,C,T,3*M,2*M),l.setRenderTarget(t),l.render(d,vo)}}function cg(s){const e=[],t=[],n=[];let i=s;const r=s-Pi+1+Ll.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>s-Pi?l=Ll[o-s+Pi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,v=3,p=2,m=1,x=new Float32Array(v*g*f),_=new Float32Array(p*g*f),M=new Float32Array(m*g*f);for(let T=0;T<f;T++){const w=T%3*2/3-1,L=T>2?0:-1,b=[w,L,0,w+2/3,L,0,w+2/3,L+1,0,w,L,0,w+2/3,L+1,0,w,L+1,0];x.set(b,v*g*T),_.set(u,p*g*T);const y=[T,T,T,T,T,T];M.set(y,m*g*T)}const C=new Gt;C.setAttribute("position",new zt(x,v)),C.setAttribute("uv",new zt(_,p)),C.setAttribute("faceIndex",new zt(M,m)),e.push(C),i>Pi&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Fl(s,e,t){const n=new en(s,e,t);return n.texture.mapping=As,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ts(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function hg(s,e,t){const n=new Float32Array(Qn),i=new H(0,1,0);return new It({name:"SphericalGaussianBlur",defines:{n:Qn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:ia(),fragmentShader:`

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
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Nl(){return new It({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ia(),fragmentShader:`

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
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Ol(){return new It({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ia(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function ia(){return`

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
	`}function ug(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Fo||l===No,h=l===Ii||l===Fi;if(c||h){let d=e.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return t===null&&(t=new Il(s)),d=c?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&i(f)?(t===null&&(t=new Il(s)),d=c?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function dg(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&sh("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function fg(s,e,t,n){const i={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);for(const g in u.morphAttributes){const v=u.morphAttributes[g];for(let p=0,m=v.length;p<m;p++)e.remove(v[p])}u.removeEventListener("dispose",o),delete i[u.id];const f=r.get(u);f&&(e.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function a(d,u){return i[u.id]===!0||(u.addEventListener("dispose",o),i[u.id]=!0,t.memory.geometries++),u}function l(d){const u=d.attributes;for(const g in u)e.update(u[g],s.ARRAY_BUFFER);const f=d.morphAttributes;for(const g in f){const v=f[g];for(let p=0,m=v.length;p<m;p++)e.update(v[p],s.ARRAY_BUFFER)}}function c(d){const u=[],f=d.index,g=d.attributes.position;let v=0;if(f!==null){const x=f.array;v=f.version;for(let _=0,M=x.length;_<M;_+=3){const C=x[_+0],T=x[_+1],w=x[_+2];u.push(C,T,T,w,w,C)}}else if(g!==void 0){const x=g.array;v=g.version;for(let _=0,M=x.length/3-1;_<M;_+=3){const C=_+0,T=_+1,w=_+2;u.push(C,T,T,w,w,C)}}else return;const p=new(rh(u)?hh:ch)(u,1);p.version=v;const m=r.get(d);m&&e.remove(m),r.set(d,p)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function pg(s,e,t){let n;function i(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,f){s.drawElements(n,f,r,u*o),t.update(f,n,1)}function c(u,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,u*o,g),t.update(f,n,g))}function h(u,f,g){if(g===0)return;const v=e.get("WEBGL_multi_draw");if(v===null)for(let p=0;p<g;p++)this.render(u[p]/o,f[p]);else{v.multiDrawElementsWEBGL(n,f,0,r,u,0,g);let p=0;for(let m=0;m<g;m++)p+=f[m];t.update(p,n,1)}}function d(u,f,g,v){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<u.length;m++)c(u[m]/o,f[m],v[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,r,u,0,v,0,g);let m=0;for(let x=0;x<g;x++)m+=f[x];for(let x=0;x<v.length;x++)t.update(m,n,v[x])}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function mg(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function gg(s,e,t){const n=new WeakMap,i=new ht;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let b=function(){w.dispose(),n.delete(a),a.removeEventListener("dispose",b)};u!==void 0&&u.texture.dispose();const f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let _=0;f===!0&&(_=1),g===!0&&(_=2),v===!0&&(_=3);let M=a.attributes.position.count*_,C=1;M>e.maxTextureSize&&(C=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const T=new Float32Array(M*C*4*d),w=new ah(T,M,C,d);w.type=xn,w.needsUpdate=!0;const L=_*4;for(let y=0;y<d;y++){const U=p[y],P=m[y],I=x[y],N=M*C*4*y;for(let W=0;W<U.count;W++){const B=W*L;f===!0&&(i.fromBufferAttribute(U,W),T[N+B+0]=i.x,T[N+B+1]=i.y,T[N+B+2]=i.z,T[N+B+3]=0),g===!0&&(i.fromBufferAttribute(P,W),T[N+B+4]=i.x,T[N+B+5]=i.y,T[N+B+6]=i.z,T[N+B+7]=0),v===!0&&(i.fromBufferAttribute(I,W),T[N+B+8]=i.x,T[N+B+9]=i.y,T[N+B+10]=i.z,T[N+B+11]=I.itemSize===4?i.w:1)}}u={count:d,texture:w,size:new Oe(M,C)},n.set(a,u),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function vg(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=e.get(l,h);if(i.get(d)!==c&&(e.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;i.get(u)!==c&&(u.update(),i.set(u,c))}return d}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}class mh extends Tt{constructor(e,t,n,i,r,o,a,l,c,h=Ui){if(h!==Ui&&h!==ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ui&&(n=Ni),n===void 0&&h===ki&&(n=Oi),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Dt,this.minFilter=l!==void 0?l:Dt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const gh=new Tt,vh=new mh(1,1);vh.compareFunction=ih;const _h=new ah,xh=new rf,yh=new fh,kl=[],Bl=[],zl=new Float32Array(16),Gl=new Float32Array(9),Hl=new Float32Array(4);function Xi(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=kl[i];if(r===void 0&&(r=new Float32Array(i),kl[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function ut(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function dt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Ls(s,e){let t=Bl[e];t===void 0&&(t=new Int32Array(e),Bl[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function _g(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function xg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;s.uniform2fv(this.addr,e),dt(t,e)}}function yg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ut(t,e))return;s.uniform3fv(this.addr,e),dt(t,e)}}function bg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;s.uniform4fv(this.addr,e),dt(t,e)}}function Sg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),dt(t,e)}else{if(ut(t,n))return;Hl.set(n),s.uniformMatrix2fv(this.addr,!1,Hl),dt(t,n)}}function Mg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),dt(t,e)}else{if(ut(t,n))return;Gl.set(n),s.uniformMatrix3fv(this.addr,!1,Gl),dt(t,n)}}function Eg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),dt(t,e)}else{if(ut(t,n))return;zl.set(n),s.uniformMatrix4fv(this.addr,!1,zl),dt(t,n)}}function wg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Tg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;s.uniform2iv(this.addr,e),dt(t,e)}}function Ag(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ut(t,e))return;s.uniform3iv(this.addr,e),dt(t,e)}}function Cg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;s.uniform4iv(this.addr,e),dt(t,e)}}function Rg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Pg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;s.uniform2uiv(this.addr,e),dt(t,e)}}function Lg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ut(t,e))return;s.uniform3uiv(this.addr,e),dt(t,e)}}function Ug(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;s.uniform4uiv(this.addr,e),dt(t,e)}}function Dg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?vh:gh;t.setTexture2D(e||r,i)}function Ig(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||xh,i)}function Fg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||yh,i)}function Ng(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||_h,i)}function Og(s){switch(s){case 5126:return _g;case 35664:return xg;case 35665:return yg;case 35666:return bg;case 35674:return Sg;case 35675:return Mg;case 35676:return Eg;case 5124:case 35670:return wg;case 35667:case 35671:return Tg;case 35668:case 35672:return Ag;case 35669:case 35673:return Cg;case 5125:return Rg;case 36294:return Pg;case 36295:return Lg;case 36296:return Ug;case 35678:case 36198:case 36298:case 36306:case 35682:return Dg;case 35679:case 36299:case 36307:return Ig;case 35680:case 36300:case 36308:case 36293:return Fg;case 36289:case 36303:case 36311:case 36292:return Ng}}function kg(s,e){s.uniform1fv(this.addr,e)}function Bg(s,e){const t=Xi(e,this.size,2);s.uniform2fv(this.addr,t)}function zg(s,e){const t=Xi(e,this.size,3);s.uniform3fv(this.addr,t)}function Gg(s,e){const t=Xi(e,this.size,4);s.uniform4fv(this.addr,t)}function Hg(s,e){const t=Xi(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Vg(s,e){const t=Xi(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Wg(s,e){const t=Xi(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Xg(s,e){s.uniform1iv(this.addr,e)}function Yg(s,e){s.uniform2iv(this.addr,e)}function jg(s,e){s.uniform3iv(this.addr,e)}function qg(s,e){s.uniform4iv(this.addr,e)}function Kg(s,e){s.uniform1uiv(this.addr,e)}function Zg(s,e){s.uniform2uiv(this.addr,e)}function Jg(s,e){s.uniform3uiv(this.addr,e)}function Qg(s,e){s.uniform4uiv(this.addr,e)}function $g(s,e,t){const n=this.cache,i=e.length,r=Ls(t,i);ut(n,r)||(s.uniform1iv(this.addr,r),dt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||gh,r[o])}function ev(s,e,t){const n=this.cache,i=e.length,r=Ls(t,i);ut(n,r)||(s.uniform1iv(this.addr,r),dt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||xh,r[o])}function tv(s,e,t){const n=this.cache,i=e.length,r=Ls(t,i);ut(n,r)||(s.uniform1iv(this.addr,r),dt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||yh,r[o])}function nv(s,e,t){const n=this.cache,i=e.length,r=Ls(t,i);ut(n,r)||(s.uniform1iv(this.addr,r),dt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||_h,r[o])}function iv(s){switch(s){case 5126:return kg;case 35664:return Bg;case 35665:return zg;case 35666:return Gg;case 35674:return Hg;case 35675:return Vg;case 35676:return Wg;case 5124:case 35670:return Xg;case 35667:case 35671:return Yg;case 35668:case 35672:return jg;case 35669:case 35673:return qg;case 5125:return Kg;case 36294:return Zg;case 36295:return Jg;case 36296:return Qg;case 35678:case 36198:case 36298:case 36306:case 35682:return $g;case 35679:case 36299:case 36307:return ev;case 35680:case 36300:case 36308:case 36293:return tv;case 36289:case 36303:case 36311:case 36292:return nv}}class rv{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Og(t.type)}}class sv{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=iv(t.type)}}class ov{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const So=/(\w+)(\])?(\[|\.)?/g;function Vl(s,e){s.seq.push(e),s.map[e.id]=e}function av(s,e,t){const n=s.name,i=n.length;for(So.lastIndex=0;;){const r=So.exec(n),o=So.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Vl(t,c===void 0?new rv(a,s,e):new sv(a,s,e));break}else{let d=t.map[a];d===void 0&&(d=new ov(a),Vl(t,d)),t=d}}}class fs{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);av(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function Wl(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const lv=37297;let cv=0;function hv(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function uv(s){const e=nt.getPrimaries(nt.workingColorSpace),t=nt.getPrimaries(s);let n;switch(e===t?n="":e===Ss&&t===bs?n="LinearDisplayP3ToLinearSRGB":e===bs&&t===Ss&&(n="LinearSRGBToLinearDisplayP3"),s){case Bn:case Cs:return[n,"LinearTransferOETF"];case nn:case $o:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Xl(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+hv(s.getShaderSource(e),o)}else return i}function dv(s,e){const t=uv(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function fv(s,e){let t;switch(e){case ld:t="Linear";break;case cd:t="Reinhard";break;case hd:t="OptimizedCineon";break;case ud:t="ACESFilmic";break;case fd:t="AgX";break;case pd:t="Neutral";break;case dd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function pv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fr).join(`
`)}function mv(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function gv(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function fr(s){return s!==""}function Yl(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function jl(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const vv=/^[ \t]*#include +<([\w\d./]+)>/gm;function zo(s){return s.replace(vv,xv)}const _v=new Map;function xv(s,e){let t=qe[e];if(t===void 0){const n=_v.get(e);if(n!==void 0)t=qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return zo(t)}const yv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ql(s){return s.replace(yv,bv)}function bv(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Kl(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function Sv(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Xc?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Iu?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===gn&&(e="SHADOWMAP_TYPE_VSM"),e}function Mv(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ii:case Fi:e="ENVMAP_TYPE_CUBE";break;case As:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Ev(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Fi:e="ENVMAP_MODE_REFRACTION";break}return e}function wv(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Yc:e="ENVMAP_BLENDING_MULTIPLY";break;case od:e="ENVMAP_BLENDING_MIX";break;case ad:e="ENVMAP_BLENDING_ADD";break}return e}function Tv(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Av(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Sv(t),c=Mv(t),h=Ev(t),d=wv(t),u=Tv(t),f=pv(t),g=mv(r),v=i.createProgram();let p,m,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(fr).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(fr).join(`
`),m.length>0&&(m+=`
`)):(p=[Kl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fr).join(`
`),m=[Kl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Fn?"#define TONE_MAPPING":"",t.toneMapping!==Fn?qe.tonemapping_pars_fragment:"",t.toneMapping!==Fn?fv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,dv("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(fr).join(`
`)),o=zo(o),o=Yl(o,t),o=jl(o,t),a=zo(a),a=Yl(a,t),a=jl(a,t),o=ql(o),a=ql(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===hl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===hl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const _=x+p+o,M=x+m+a,C=Wl(i,i.VERTEX_SHADER,_),T=Wl(i,i.FRAGMENT_SHADER,M);i.attachShader(v,C),i.attachShader(v,T),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function w(U){if(s.debug.checkShaderErrors){const P=i.getProgramInfoLog(v).trim(),I=i.getShaderInfoLog(C).trim(),N=i.getShaderInfoLog(T).trim();let W=!0,B=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(W=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,C,T);else{const se=Xl(i,C,"vertex"),j=Xl(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+P+`
`+se+`
`+j)}else P!==""?console.warn("THREE.WebGLProgram: Program Info Log:",P):(I===""||N==="")&&(B=!1);B&&(U.diagnostics={runnable:W,programLog:P,vertexShader:{log:I,prefix:p},fragmentShader:{log:N,prefix:m}})}i.deleteShader(C),i.deleteShader(T),L=new fs(i,v),b=gv(i,v)}let L;this.getUniforms=function(){return L===void 0&&w(this),L};let b;this.getAttributes=function(){return b===void 0&&w(this),b};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=i.getProgramParameter(v,lv)),y},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=cv++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=C,this.fragmentShader=T,this}let Cv=0;class Rv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Pv(e),t.set(e,n)),n}}class Pv{constructor(e){this.id=Cv++,this.code=e,this.usedTimes=0}}function Lv(s,e,t,n,i,r,o){const a=new ta,l=new Rv,c=new Set,h=[],d=i.logarithmicDepthBuffer,u=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return c.add(b),b===0?"uv":`uv${b}`}function p(b,y,U,P,I){const N=P.fog,W=I.geometry,B=b.isMeshStandardMaterial?P.environment:null,se=(b.isMeshStandardMaterial?t:e).get(b.envMap||B),j=se&&se.mapping===As?se.image.height:null,K=g[b.type];b.precision!==null&&(f=i.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const q=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,F=q!==void 0?q.length:0;let V=0;W.morphAttributes.position!==void 0&&(V=1),W.morphAttributes.normal!==void 0&&(V=2),W.morphAttributes.color!==void 0&&(V=3);let ne,O,k,te;if(K){const De=rn[K];ne=De.vertexShader,O=De.fragmentShader}else ne=b.vertexShader,O=b.fragmentShader,l.update(b),k=l.getVertexShaderID(b),te=l.getFragmentShaderID(b);const G=s.getRenderTarget(),ae=I.isInstancedMesh===!0,pe=I.isBatchedMesh===!0,_e=!!b.map,D=!!b.matcap,he=!!se,Pe=!!b.aoMap,Le=!!b.lightMap,fe=!!b.bumpMap,ye=!!b.normalMap,Se=!!b.displacementMap,de=!!b.emissiveMap,Ce=!!b.metalnessMap,R=!!b.roughnessMap,S=b.anisotropy>0,X=b.clearcoat>0,Z=b.dispersion>0,ie=b.iridescence>0,Q=b.sheen>0,we=b.transmission>0,le=S&&!!b.anisotropyMap,ce=X&&!!b.clearcoatMap,be=X&&!!b.clearcoatNormalMap,ue=X&&!!b.clearcoatRoughnessMap,Me=ie&&!!b.iridescenceMap,ke=ie&&!!b.iridescenceThicknessMap,Te=Q&&!!b.sheenColorMap,me=Q&&!!b.sheenRoughnessMap,xe=!!b.specularMap,Ne=!!b.specularColorMap,We=!!b.specularIntensityMap,E=we&&!!b.transmissionMap,$=we&&!!b.thicknessMap,z=!!b.gradientMap,ee=!!b.alphaMap,ge=b.alphaTest>0,Ae=!!b.alphaHash,Re=!!b.extensions;let je=Fn;b.toneMapped&&(G===null||G.isXRRenderTarget===!0)&&(je=s.toneMapping);const Xe={shaderID:K,shaderType:b.type,shaderName:b.name,vertexShader:ne,fragmentShader:O,defines:b.defines,customVertexShaderID:k,customFragmentShaderID:te,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:pe,batchingColor:pe&&I._colorsTexture!==null,instancing:ae,instancingColor:ae&&I.instanceColor!==null,instancingMorph:ae&&I.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:G===null?s.outputColorSpace:G.isXRRenderTarget===!0?G.texture.colorSpace:Bn,alphaToCoverage:!!b.alphaToCoverage,map:_e,matcap:D,envMap:he,envMapMode:he&&se.mapping,envMapCubeUVHeight:j,aoMap:Pe,lightMap:Le,bumpMap:fe,normalMap:ye,displacementMap:u&&Se,emissiveMap:de,normalMapObjectSpace:ye&&b.normalMapType===Td,normalMapTangentSpace:ye&&b.normalMapType===nh,metalnessMap:Ce,roughnessMap:R,anisotropy:S,anisotropyMap:le,clearcoat:X,clearcoatMap:ce,clearcoatNormalMap:be,clearcoatRoughnessMap:ue,dispersion:Z,iridescence:ie,iridescenceMap:Me,iridescenceThicknessMap:ke,sheen:Q,sheenColorMap:Te,sheenRoughnessMap:me,specularMap:xe,specularColorMap:Ne,specularIntensityMap:We,transmission:we,transmissionMap:E,thicknessMap:$,gradientMap:z,opaque:b.transparent===!1&&b.blending===Li&&b.alphaToCoverage===!1,alphaMap:ee,alphaTest:ge,alphaHash:Ae,combine:b.combine,mapUv:_e&&v(b.map.channel),aoMapUv:Pe&&v(b.aoMap.channel),lightMapUv:Le&&v(b.lightMap.channel),bumpMapUv:fe&&v(b.bumpMap.channel),normalMapUv:ye&&v(b.normalMap.channel),displacementMapUv:Se&&v(b.displacementMap.channel),emissiveMapUv:de&&v(b.emissiveMap.channel),metalnessMapUv:Ce&&v(b.metalnessMap.channel),roughnessMapUv:R&&v(b.roughnessMap.channel),anisotropyMapUv:le&&v(b.anisotropyMap.channel),clearcoatMapUv:ce&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:be&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Me&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:ke&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:me&&v(b.sheenRoughnessMap.channel),specularMapUv:xe&&v(b.specularMap.channel),specularColorMapUv:Ne&&v(b.specularColorMap.channel),specularIntensityMapUv:We&&v(b.specularIntensityMap.channel),transmissionMapUv:E&&v(b.transmissionMap.channel),thicknessMapUv:$&&v(b.thicknessMap.channel),alphaMapUv:ee&&v(b.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(ye||S),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!W.attributes.uv&&(_e||ee),fog:!!N,useFog:b.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:I.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:F,morphTextureStride:V,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:s.shadowMap.enabled&&U.length>0,shadowMapType:s.shadowMap.type,toneMapping:je,decodeVideoTexture:_e&&b.map.isVideoTexture===!0&&nt.getTransfer(b.map.colorSpace)===ot,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===sn,flipSided:b.side===Ft,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Re&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:Re&&b.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Xe.vertexUv1s=c.has(1),Xe.vertexUv2s=c.has(2),Xe.vertexUv3s=c.has(3),c.clear(),Xe}function m(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const U in b.defines)y.push(U),y.push(b.defines[U]);return b.isRawShaderMaterial===!1&&(x(y,b),_(y,b),y.push(s.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function x(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function _(b,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.skinning&&a.enable(4),y.morphTargets&&a.enable(5),y.morphNormals&&a.enable(6),y.morphColors&&a.enable(7),y.premultipliedAlpha&&a.enable(8),y.shadowMapEnabled&&a.enable(9),y.doubleSided&&a.enable(10),y.flipSided&&a.enable(11),y.useDepthPacking&&a.enable(12),y.dithering&&a.enable(13),y.transmission&&a.enable(14),y.sheen&&a.enable(15),y.opaque&&a.enable(16),y.pointsUvs&&a.enable(17),y.decodeVideoTexture&&a.enable(18),y.alphaToCoverage&&a.enable(19),b.push(a.mask)}function M(b){const y=g[b.type];let U;if(y){const P=rn[y];U=br.clone(P.uniforms)}else U=b.uniforms;return U}function C(b,y){let U;for(let P=0,I=h.length;P<I;P++){const N=h[P];if(N.cacheKey===y){U=N,++U.usedTimes;break}}return U===void 0&&(U=new Av(s,y,b,r),h.push(U)),U}function T(b){if(--b.usedTimes===0){const y=h.indexOf(b);h[y]=h[h.length-1],h.pop(),b.destroy()}}function w(b){l.remove(b)}function L(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:M,acquireProgram:C,releaseProgram:T,releaseShaderCache:w,programs:h,dispose:L}}function Uv(){let s=new WeakMap;function e(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function t(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function Dv(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Zl(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Jl(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(d,u,f,g,v,p){let m=s[e];return m===void 0?(m={id:d.id,object:d,geometry:u,material:f,groupOrder:g,renderOrder:d.renderOrder,z:v,group:p},s[e]=m):(m.id=d.id,m.object=d,m.geometry=u,m.material=f,m.groupOrder=g,m.renderOrder=d.renderOrder,m.z=v,m.group=p),e++,m}function a(d,u,f,g,v,p){const m=o(d,u,f,g,v,p);f.transmission>0?n.push(m):f.transparent===!0?i.push(m):t.push(m)}function l(d,u,f,g,v,p){const m=o(d,u,f,g,v,p);f.transmission>0?n.unshift(m):f.transparent===!0?i.unshift(m):t.unshift(m)}function c(d,u){t.length>1&&t.sort(d||Dv),n.length>1&&n.sort(u||Zl),i.length>1&&i.sort(u||Zl)}function h(){for(let d=e,u=s.length;d<u;d++){const f=s[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function Iv(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new Jl,s.set(n,[o])):i>=r.length?(o=new Jl,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function Fv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new H,color:new Ve};break;case"SpotLight":t={position:new H,direction:new H,color:new Ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new Ve,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new Ve,groundColor:new Ve};break;case"RectAreaLight":t={color:new Ve,position:new H,halfWidth:new H,halfHeight:new H};break}return s[e.id]=t,t}}}function Nv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Ov=0;function kv(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Bv(s){const e=new Fv,t=Nv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new H);const i=new H,r=new it,o=new it;function a(c){let h=0,d=0,u=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let f=0,g=0,v=0,p=0,m=0,x=0,_=0,M=0,C=0,T=0,w=0;c.sort(kv);for(let b=0,y=c.length;b<y;b++){const U=c[b],P=U.color,I=U.intensity,N=U.distance,W=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)h+=P.r*I,d+=P.g*I,u+=P.b*I;else if(U.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(U.sh.coefficients[B],I);w++}else if(U.isDirectionalLight){const B=e.get(U);if(B.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const se=U.shadow,j=t.get(U);j.shadowBias=se.bias,j.shadowNormalBias=se.normalBias,j.shadowRadius=se.radius,j.shadowMapSize=se.mapSize,n.directionalShadow[f]=j,n.directionalShadowMap[f]=W,n.directionalShadowMatrix[f]=U.shadow.matrix,x++}n.directional[f]=B,f++}else if(U.isSpotLight){const B=e.get(U);B.position.setFromMatrixPosition(U.matrixWorld),B.color.copy(P).multiplyScalar(I),B.distance=N,B.coneCos=Math.cos(U.angle),B.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),B.decay=U.decay,n.spot[v]=B;const se=U.shadow;if(U.map&&(n.spotLightMap[C]=U.map,C++,se.updateMatrices(U),U.castShadow&&T++),n.spotLightMatrix[v]=se.matrix,U.castShadow){const j=t.get(U);j.shadowBias=se.bias,j.shadowNormalBias=se.normalBias,j.shadowRadius=se.radius,j.shadowMapSize=se.mapSize,n.spotShadow[v]=j,n.spotShadowMap[v]=W,M++}v++}else if(U.isRectAreaLight){const B=e.get(U);B.color.copy(P).multiplyScalar(I),B.halfWidth.set(U.width*.5,0,0),B.halfHeight.set(0,U.height*.5,0),n.rectArea[p]=B,p++}else if(U.isPointLight){const B=e.get(U);if(B.color.copy(U.color).multiplyScalar(U.intensity),B.distance=U.distance,B.decay=U.decay,U.castShadow){const se=U.shadow,j=t.get(U);j.shadowBias=se.bias,j.shadowNormalBias=se.normalBias,j.shadowRadius=se.radius,j.shadowMapSize=se.mapSize,j.shadowCameraNear=se.camera.near,j.shadowCameraFar=se.camera.far,n.pointShadow[g]=j,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=U.shadow.matrix,_++}n.point[g]=B,g++}else if(U.isHemisphereLight){const B=e.get(U);B.skyColor.copy(U.color).multiplyScalar(I),B.groundColor.copy(U.groundColor).multiplyScalar(I),n.hemi[m]=B,m++}}p>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ue.LTC_FLOAT_1,n.rectAreaLTC2=Ue.LTC_FLOAT_2):(n.rectAreaLTC1=Ue.LTC_HALF_1,n.rectAreaLTC2=Ue.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const L=n.hash;(L.directionalLength!==f||L.pointLength!==g||L.spotLength!==v||L.rectAreaLength!==p||L.hemiLength!==m||L.numDirectionalShadows!==x||L.numPointShadows!==_||L.numSpotShadows!==M||L.numSpotMaps!==C||L.numLightProbes!==w)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=M+C-T,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=w,L.directionalLength=f,L.pointLength=g,L.spotLength=v,L.rectAreaLength=p,L.hemiLength=m,L.numDirectionalShadows=x,L.numPointShadows=_,L.numSpotShadows=M,L.numSpotMaps=C,L.numLightProbes=w,n.version=Ov++)}function l(c,h){let d=0,u=0,f=0,g=0,v=0;const p=h.matrixWorldInverse;for(let m=0,x=c.length;m<x;m++){const _=c[m];if(_.isDirectionalLight){const M=n.directional[d];M.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(p),d++}else if(_.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(_.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(p),f++}else if(_.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(_.matrixWorld),M.position.applyMatrix4(p),o.identity(),r.copy(_.matrixWorld),r.premultiply(p),o.extractRotation(r),M.halfWidth.set(_.width*.5,0,0),M.halfHeight.set(0,_.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),g++}else if(_.isPointLight){const M=n.point[u];M.position.setFromMatrixPosition(_.matrixWorld),M.position.applyMatrix4(p),u++}else if(_.isHemisphereLight){const M=n.hemi[v];M.direction.setFromMatrixPosition(_.matrixWorld),M.direction.transformDirection(p),v++}}}return{setup:a,setupView:l,state:n}}function Ql(s){const e=new Bv(s),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function zv(s){let e=new WeakMap;function t(i,r=0){const o=e.get(i);let a;return o===void 0?(a=new Ql(s),e.set(i,[a])):r>=o.length?(a=new Ql(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class bh extends Vi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=wd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Sh extends Vi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Gv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Hv=`uniform sampler2D shadow_pass;
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
}`;function Vv(s,e,t){let n=new na;const i=new Oe,r=new Oe,o=new ht,a=new bh({depthPacking:th}),l=new Sh,c={},h=t.maxTextureSize,d={[On]:Ft,[Ft]:On,[sn]:sn},u=new It({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:Gv,fragmentShader:Hv}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Gt;g.setAttribute("position",new zt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Pt(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xc;let m=this.type;this.render=function(T,w,L){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;const b=s.getRenderTarget(),y=s.getActiveCubeFace(),U=s.getActiveMipmapLevel(),P=s.state;P.setBlending(bn),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const I=m!==gn&&this.type===gn,N=m===gn&&this.type!==gn;for(let W=0,B=T.length;W<B;W++){const se=T[W],j=se.shadow;if(j===void 0){console.warn("THREE.WebGLShadowMap:",se,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;i.copy(j.mapSize);const K=j.getFrameExtents();if(i.multiply(K),r.copy(j.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/K.x),i.x=r.x*K.x,j.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/K.y),i.y=r.y*K.y,j.mapSize.y=r.y)),j.map===null||I===!0||N===!0){const F=this.type!==gn?{minFilter:Dt,magFilter:Dt}:{};j.map!==null&&j.map.dispose(),j.map=new en(i.x,i.y,F),j.map.texture.name=se.name+".shadowMap",j.camera.updateProjectionMatrix()}s.setRenderTarget(j.map),s.clear();const q=j.getViewportCount();for(let F=0;F<q;F++){const V=j.getViewport(F);o.set(r.x*V.x,r.y*V.y,r.x*V.z,r.y*V.w),P.viewport(o),j.updateMatrices(se,F),n=j.getFrustum(),M(w,L,j.camera,se,this.type)}j.isPointLightShadow!==!0&&this.type===gn&&x(j,L),j.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(b,y,U)};function x(T,w){const L=e.update(v);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new en(i.x,i.y)),u.uniforms.shadow_pass.value=T.map.texture,u.uniforms.resolution.value=T.mapSize,u.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(w,null,L,u,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(w,null,L,f,v,null)}function _(T,w,L,b){let y=null;const U=L.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(U!==void 0)y=U;else if(y=L.isPointLight===!0?l:a,s.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const P=y.uuid,I=w.uuid;let N=c[P];N===void 0&&(N={},c[P]=N);let W=N[I];W===void 0&&(W=y.clone(),N[I]=W,w.addEventListener("dispose",C)),y=W}if(y.visible=w.visible,y.wireframe=w.wireframe,b===gn?y.side=w.shadowSide!==null?w.shadowSide:w.side:y.side=w.shadowSide!==null?w.shadowSide:d[w.side],y.alphaMap=w.alphaMap,y.alphaTest=w.alphaTest,y.map=w.map,y.clipShadows=w.clipShadows,y.clippingPlanes=w.clippingPlanes,y.clipIntersection=w.clipIntersection,y.displacementMap=w.displacementMap,y.displacementScale=w.displacementScale,y.displacementBias=w.displacementBias,y.wireframeLinewidth=w.wireframeLinewidth,y.linewidth=w.linewidth,L.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const P=s.properties.get(y);P.light=L}return y}function M(T,w,L,b,y){if(T.visible===!1)return;if(T.layers.test(w.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&y===gn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,T.matrixWorld);const I=e.update(T),N=T.material;if(Array.isArray(N)){const W=I.groups;for(let B=0,se=W.length;B<se;B++){const j=W[B],K=N[j.materialIndex];if(K&&K.visible){const q=_(T,K,b,y);T.onBeforeShadow(s,T,w,L,I,q,j),s.renderBufferDirect(L,null,I,q,T,j),T.onAfterShadow(s,T,w,L,I,q,j)}}}else if(N.visible){const W=_(T,N,b,y);T.onBeforeShadow(s,T,w,L,I,W,null),s.renderBufferDirect(L,null,I,W,T,null),T.onAfterShadow(s,T,w,L,I,W,null)}}const P=T.children;for(let I=0,N=P.length;I<N;I++)M(P[I],w,L,b,y)}function C(T){T.target.removeEventListener("dispose",C);for(const L in c){const b=c[L],y=T.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}function Wv(s){function e(){let E=!1;const $=new ht;let z=null;const ee=new ht(0,0,0,0);return{setMask:function(ge){z!==ge&&!E&&(s.colorMask(ge,ge,ge,ge),z=ge)},setLocked:function(ge){E=ge},setClear:function(ge,Ae,Re,je,Xe){Xe===!0&&(ge*=je,Ae*=je,Re*=je),$.set(ge,Ae,Re,je),ee.equals($)===!1&&(s.clearColor(ge,Ae,Re,je),ee.copy($))},reset:function(){E=!1,z=null,ee.set(-1,0,0,0)}}}function t(){let E=!1,$=null,z=null,ee=null;return{setTest:function(ge){ge?te(s.DEPTH_TEST):G(s.DEPTH_TEST)},setMask:function(ge){$!==ge&&!E&&(s.depthMask(ge),$=ge)},setFunc:function(ge){if(z!==ge){switch(ge){case $u:s.depthFunc(s.NEVER);break;case ed:s.depthFunc(s.ALWAYS);break;case td:s.depthFunc(s.LESS);break;case _s:s.depthFunc(s.LEQUAL);break;case nd:s.depthFunc(s.EQUAL);break;case id:s.depthFunc(s.GEQUAL);break;case rd:s.depthFunc(s.GREATER);break;case sd:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}z=ge}},setLocked:function(ge){E=ge},setClear:function(ge){ee!==ge&&(s.clearDepth(ge),ee=ge)},reset:function(){E=!1,$=null,z=null,ee=null}}}function n(){let E=!1,$=null,z=null,ee=null,ge=null,Ae=null,Re=null,je=null,Xe=null;return{setTest:function(De){E||(De?te(s.STENCIL_TEST):G(s.STENCIL_TEST))},setMask:function(De){$!==De&&!E&&(s.stencilMask(De),$=De)},setFunc:function(De,Ye,Je){(z!==De||ee!==Ye||ge!==Je)&&(s.stencilFunc(De,Ye,Je),z=De,ee=Ye,ge=Je)},setOp:function(De,Ye,Je){(Ae!==De||Re!==Ye||je!==Je)&&(s.stencilOp(De,Ye,Je),Ae=De,Re=Ye,je=Je)},setLocked:function(De){E=De},setClear:function(De){Xe!==De&&(s.clearStencil(De),Xe=De)},reset:function(){E=!1,$=null,z=null,ee=null,ge=null,Ae=null,Re=null,je=null,Xe=null}}}const i=new e,r=new t,o=new n,a=new WeakMap,l=new WeakMap;let c={},h={},d=new WeakMap,u=[],f=null,g=!1,v=null,p=null,m=null,x=null,_=null,M=null,C=null,T=new Ve(0,0,0),w=0,L=!1,b=null,y=null,U=null,P=null,I=null;const N=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,B=0;const se=s.getParameter(s.VERSION);se.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(se)[1]),W=B>=1):se.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(se)[1]),W=B>=2);let j=null,K={};const q=s.getParameter(s.SCISSOR_BOX),F=s.getParameter(s.VIEWPORT),V=new ht().fromArray(q),ne=new ht().fromArray(F);function O(E,$,z,ee){const ge=new Uint8Array(4),Ae=s.createTexture();s.bindTexture(E,Ae),s.texParameteri(E,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(E,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Re=0;Re<z;Re++)E===s.TEXTURE_3D||E===s.TEXTURE_2D_ARRAY?s.texImage3D($,0,s.RGBA,1,1,ee,0,s.RGBA,s.UNSIGNED_BYTE,ge):s.texImage2D($+Re,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ge);return Ae}const k={};k[s.TEXTURE_2D]=O(s.TEXTURE_2D,s.TEXTURE_2D,1),k[s.TEXTURE_CUBE_MAP]=O(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),k[s.TEXTURE_2D_ARRAY]=O(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),k[s.TEXTURE_3D]=O(s.TEXTURE_3D,s.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),o.setClear(0),te(s.DEPTH_TEST),r.setFunc(_s),fe(!1),ye(Da),te(s.CULL_FACE),Pe(bn);function te(E){c[E]!==!0&&(s.enable(E),c[E]=!0)}function G(E){c[E]!==!1&&(s.disable(E),c[E]=!1)}function ae(E,$){return h[E]!==$?(s.bindFramebuffer(E,$),h[E]=$,E===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=$),E===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=$),!0):!1}function pe(E,$){let z=u,ee=!1;if(E){z=d.get($),z===void 0&&(z=[],d.set($,z));const ge=E.textures;if(z.length!==ge.length||z[0]!==s.COLOR_ATTACHMENT0){for(let Ae=0,Re=ge.length;Ae<Re;Ae++)z[Ae]=s.COLOR_ATTACHMENT0+Ae;z.length=ge.length,ee=!0}}else z[0]!==s.BACK&&(z[0]=s.BACK,ee=!0);ee&&s.drawBuffers(z)}function _e(E){return f!==E?(s.useProgram(E),f=E,!0):!1}const D={[Jn]:s.FUNC_ADD,[Nu]:s.FUNC_SUBTRACT,[Ou]:s.FUNC_REVERSE_SUBTRACT};D[ku]=s.MIN,D[Bu]=s.MAX;const he={[zu]:s.ZERO,[Gu]:s.ONE,[Hu]:s.SRC_COLOR,[Do]:s.SRC_ALPHA,[qu]:s.SRC_ALPHA_SATURATE,[Yu]:s.DST_COLOR,[Wu]:s.DST_ALPHA,[Vu]:s.ONE_MINUS_SRC_COLOR,[Io]:s.ONE_MINUS_SRC_ALPHA,[ju]:s.ONE_MINUS_DST_COLOR,[Xu]:s.ONE_MINUS_DST_ALPHA,[Ku]:s.CONSTANT_COLOR,[Zu]:s.ONE_MINUS_CONSTANT_COLOR,[Ju]:s.CONSTANT_ALPHA,[Qu]:s.ONE_MINUS_CONSTANT_ALPHA};function Pe(E,$,z,ee,ge,Ae,Re,je,Xe,De){if(E===bn){g===!0&&(G(s.BLEND),g=!1);return}if(g===!1&&(te(s.BLEND),g=!0),E!==Fu){if(E!==v||De!==L){if((p!==Jn||_!==Jn)&&(s.blendEquation(s.FUNC_ADD),p=Jn,_=Jn),De)switch(E){case Li:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case vs:s.blendFunc(s.ONE,s.ONE);break;case Ia:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Fa:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",E);break}else switch(E){case Li:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case vs:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Ia:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Fa:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",E);break}m=null,x=null,M=null,C=null,T.set(0,0,0),w=0,v=E,L=De}return}ge=ge||$,Ae=Ae||z,Re=Re||ee,($!==p||ge!==_)&&(s.blendEquationSeparate(D[$],D[ge]),p=$,_=ge),(z!==m||ee!==x||Ae!==M||Re!==C)&&(s.blendFuncSeparate(he[z],he[ee],he[Ae],he[Re]),m=z,x=ee,M=Ae,C=Re),(je.equals(T)===!1||Xe!==w)&&(s.blendColor(je.r,je.g,je.b,Xe),T.copy(je),w=Xe),v=E,L=!1}function Le(E,$){E.side===sn?G(s.CULL_FACE):te(s.CULL_FACE);let z=E.side===Ft;$&&(z=!z),fe(z),E.blending===Li&&E.transparent===!1?Pe(bn):Pe(E.blending,E.blendEquation,E.blendSrc,E.blendDst,E.blendEquationAlpha,E.blendSrcAlpha,E.blendDstAlpha,E.blendColor,E.blendAlpha,E.premultipliedAlpha),r.setFunc(E.depthFunc),r.setTest(E.depthTest),r.setMask(E.depthWrite),i.setMask(E.colorWrite);const ee=E.stencilWrite;o.setTest(ee),ee&&(o.setMask(E.stencilWriteMask),o.setFunc(E.stencilFunc,E.stencilRef,E.stencilFuncMask),o.setOp(E.stencilFail,E.stencilZFail,E.stencilZPass)),de(E.polygonOffset,E.polygonOffsetFactor,E.polygonOffsetUnits),E.alphaToCoverage===!0?te(s.SAMPLE_ALPHA_TO_COVERAGE):G(s.SAMPLE_ALPHA_TO_COVERAGE)}function fe(E){b!==E&&(E?s.frontFace(s.CW):s.frontFace(s.CCW),b=E)}function ye(E){E!==Uu?(te(s.CULL_FACE),E!==y&&(E===Da?s.cullFace(s.BACK):E===Du?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):G(s.CULL_FACE),y=E}function Se(E){E!==U&&(W&&s.lineWidth(E),U=E)}function de(E,$,z){E?(te(s.POLYGON_OFFSET_FILL),(P!==$||I!==z)&&(s.polygonOffset($,z),P=$,I=z)):G(s.POLYGON_OFFSET_FILL)}function Ce(E){E?te(s.SCISSOR_TEST):G(s.SCISSOR_TEST)}function R(E){E===void 0&&(E=s.TEXTURE0+N-1),j!==E&&(s.activeTexture(E),j=E)}function S(E,$,z){z===void 0&&(j===null?z=s.TEXTURE0+N-1:z=j);let ee=K[z];ee===void 0&&(ee={type:void 0,texture:void 0},K[z]=ee),(ee.type!==E||ee.texture!==$)&&(j!==z&&(s.activeTexture(z),j=z),s.bindTexture(E,$||k[E]),ee.type=E,ee.texture=$)}function X(){const E=K[j];E!==void 0&&E.type!==void 0&&(s.bindTexture(E.type,null),E.type=void 0,E.texture=void 0)}function Z(){try{s.compressedTexImage2D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function ie(){try{s.compressedTexImage3D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function Q(){try{s.texSubImage2D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function we(){try{s.texSubImage3D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function le(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function ce(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function be(){try{s.texStorage2D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function ue(){try{s.texStorage3D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function Me(){try{s.texImage2D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function ke(){try{s.texImage3D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function Te(E){V.equals(E)===!1&&(s.scissor(E.x,E.y,E.z,E.w),V.copy(E))}function me(E){ne.equals(E)===!1&&(s.viewport(E.x,E.y,E.z,E.w),ne.copy(E))}function xe(E,$){let z=l.get($);z===void 0&&(z=new WeakMap,l.set($,z));let ee=z.get(E);ee===void 0&&(ee=s.getUniformBlockIndex($,E.name),z.set(E,ee))}function Ne(E,$){const ee=l.get($).get(E);a.get($)!==ee&&(s.uniformBlockBinding($,ee,E.__bindingPointIndex),a.set($,ee))}function We(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),c={},j=null,K={},h={},d=new WeakMap,u=[],f=null,g=!1,v=null,p=null,m=null,x=null,_=null,M=null,C=null,T=new Ve(0,0,0),w=0,L=!1,b=null,y=null,U=null,P=null,I=null,V.set(0,0,s.canvas.width,s.canvas.height),ne.set(0,0,s.canvas.width,s.canvas.height),i.reset(),r.reset(),o.reset()}return{buffers:{color:i,depth:r,stencil:o},enable:te,disable:G,bindFramebuffer:ae,drawBuffers:pe,useProgram:_e,setBlending:Pe,setMaterial:Le,setFlipSided:fe,setCullFace:ye,setLineWidth:Se,setPolygonOffset:de,setScissorTest:Ce,activeTexture:R,bindTexture:S,unbindTexture:X,compressedTexImage2D:Z,compressedTexImage3D:ie,texImage2D:Me,texImage3D:ke,updateUBOMapping:xe,uniformBlockBinding:Ne,texStorage2D:be,texStorage3D:ue,texSubImage2D:Q,texSubImage3D:we,compressedTexSubImage2D:le,compressedTexSubImage3D:ce,scissor:Te,viewport:me,reset:We}}function Xv(s,e,t,n,i,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Oe,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,S){return f?new OffscreenCanvas(R,S):Es("canvas")}function v(R,S,X){let Z=1;const ie=Ce(R);if((ie.width>X||ie.height>X)&&(Z=X/Math.max(ie.width,ie.height)),Z<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const Q=Math.floor(Z*ie.width),we=Math.floor(Z*ie.height);d===void 0&&(d=g(Q,we));const le=S?g(Q,we):d;return le.width=Q,le.height=we,le.getContext("2d").drawImage(R,0,0,Q,we),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+Q+"x"+we+")."),le}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),R;return R}function p(R){return R.generateMipmaps&&R.minFilter!==Dt&&R.minFilter!==Bt}function m(R){s.generateMipmap(R)}function x(R,S,X,Z,ie=!1){if(R!==null){if(s[R]!==void 0)return s[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Q=S;if(S===s.RED&&(X===s.FLOAT&&(Q=s.R32F),X===s.HALF_FLOAT&&(Q=s.R16F),X===s.UNSIGNED_BYTE&&(Q=s.R8)),S===s.RED_INTEGER&&(X===s.UNSIGNED_BYTE&&(Q=s.R8UI),X===s.UNSIGNED_SHORT&&(Q=s.R16UI),X===s.UNSIGNED_INT&&(Q=s.R32UI),X===s.BYTE&&(Q=s.R8I),X===s.SHORT&&(Q=s.R16I),X===s.INT&&(Q=s.R32I)),S===s.RG&&(X===s.FLOAT&&(Q=s.RG32F),X===s.HALF_FLOAT&&(Q=s.RG16F),X===s.UNSIGNED_BYTE&&(Q=s.RG8)),S===s.RG_INTEGER&&(X===s.UNSIGNED_BYTE&&(Q=s.RG8UI),X===s.UNSIGNED_SHORT&&(Q=s.RG16UI),X===s.UNSIGNED_INT&&(Q=s.RG32UI),X===s.BYTE&&(Q=s.RG8I),X===s.SHORT&&(Q=s.RG16I),X===s.INT&&(Q=s.RG32I)),S===s.RGB&&X===s.UNSIGNED_INT_5_9_9_9_REV&&(Q=s.RGB9_E5),S===s.RGBA){const we=ie?ys:nt.getTransfer(Z);X===s.FLOAT&&(Q=s.RGBA32F),X===s.HALF_FLOAT&&(Q=s.RGBA16F),X===s.UNSIGNED_BYTE&&(Q=we===ot?s.SRGB8_ALPHA8:s.RGBA8),X===s.UNSIGNED_SHORT_4_4_4_4&&(Q=s.RGBA4),X===s.UNSIGNED_SHORT_5_5_5_1&&(Q=s.RGB5_A1)}return(Q===s.R16F||Q===s.R32F||Q===s.RG16F||Q===s.RG32F||Q===s.RGBA16F||Q===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function _(R,S){let X;return R?S===null||S===Ni||S===Oi?X=s.DEPTH24_STENCIL8:S===xn?X=s.DEPTH32F_STENCIL8:S===xs&&(X=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Ni||S===Oi?X=s.DEPTH_COMPONENT24:S===xn?X=s.DEPTH_COMPONENT32F:S===xs&&(X=s.DEPTH_COMPONENT16),X}function M(R,S){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==Dt&&R.minFilter!==Bt?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function C(R){const S=R.target;S.removeEventListener("dispose",C),w(S),S.isVideoTexture&&h.delete(S)}function T(R){const S=R.target;S.removeEventListener("dispose",T),b(S)}function w(R){const S=n.get(R);if(S.__webglInit===void 0)return;const X=R.source,Z=u.get(X);if(Z){const ie=Z[S.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&L(R),Object.keys(Z).length===0&&u.delete(X)}n.remove(R)}function L(R){const S=n.get(R);s.deleteTexture(S.__webglTexture);const X=R.source,Z=u.get(X);delete Z[S.__cacheKey],o.memory.textures--}function b(R){const S=n.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(S.__webglFramebuffer[Z]))for(let ie=0;ie<S.__webglFramebuffer[Z].length;ie++)s.deleteFramebuffer(S.__webglFramebuffer[Z][ie]);else s.deleteFramebuffer(S.__webglFramebuffer[Z]);S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer[Z])}else{if(Array.isArray(S.__webglFramebuffer))for(let Z=0;Z<S.__webglFramebuffer.length;Z++)s.deleteFramebuffer(S.__webglFramebuffer[Z]);else s.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&s.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Z=0;Z<S.__webglColorRenderbuffer.length;Z++)S.__webglColorRenderbuffer[Z]&&s.deleteRenderbuffer(S.__webglColorRenderbuffer[Z]);S.__webglDepthRenderbuffer&&s.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const X=R.textures;for(let Z=0,ie=X.length;Z<ie;Z++){const Q=n.get(X[Z]);Q.__webglTexture&&(s.deleteTexture(Q.__webglTexture),o.memory.textures--),n.remove(X[Z])}n.remove(R)}let y=0;function U(){y=0}function P(){const R=y;return R>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),y+=1,R}function I(R){const S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function N(R,S){const X=n.get(R);if(R.isVideoTexture&&Se(R),R.isRenderTargetTexture===!1&&R.version>0&&X.__version!==R.version){const Z=R.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ne(X,R,S);return}}t.bindTexture(s.TEXTURE_2D,X.__webglTexture,s.TEXTURE0+S)}function W(R,S){const X=n.get(R);if(R.version>0&&X.__version!==R.version){ne(X,R,S);return}t.bindTexture(s.TEXTURE_2D_ARRAY,X.__webglTexture,s.TEXTURE0+S)}function B(R,S){const X=n.get(R);if(R.version>0&&X.__version!==R.version){ne(X,R,S);return}t.bindTexture(s.TEXTURE_3D,X.__webglTexture,s.TEXTURE0+S)}function se(R,S){const X=n.get(R);if(R.version>0&&X.__version!==R.version){O(X,R,S);return}t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture,s.TEXTURE0+S)}const j={[Oo]:s.REPEAT,[ei]:s.CLAMP_TO_EDGE,[ko]:s.MIRRORED_REPEAT},K={[Dt]:s.NEAREST,[md]:s.NEAREST_MIPMAP_NEAREST,[Ir]:s.NEAREST_MIPMAP_LINEAR,[Bt]:s.LINEAR,[Ys]:s.LINEAR_MIPMAP_NEAREST,[ti]:s.LINEAR_MIPMAP_LINEAR},q={[Ad]:s.NEVER,[Dd]:s.ALWAYS,[Cd]:s.LESS,[ih]:s.LEQUAL,[Rd]:s.EQUAL,[Ud]:s.GEQUAL,[Pd]:s.GREATER,[Ld]:s.NOTEQUAL};function F(R,S){if(S.type===xn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Bt||S.magFilter===Ys||S.magFilter===Ir||S.magFilter===ti||S.minFilter===Bt||S.minFilter===Ys||S.minFilter===Ir||S.minFilter===ti)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,j[S.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,j[S.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,j[S.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,K[S.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,K[S.minFilter]),S.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,q[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Dt||S.minFilter!==Ir&&S.minFilter!==ti||S.type===xn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const X=e.get("EXT_texture_filter_anisotropic");s.texParameterf(R,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function V(R,S){let X=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",C));const Z=S.source;let ie=u.get(Z);ie===void 0&&(ie={},u.set(Z,ie));const Q=I(S);if(Q!==R.__cacheKey){ie[Q]===void 0&&(ie[Q]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,X=!0),ie[Q].usedTimes++;const we=ie[R.__cacheKey];we!==void 0&&(ie[R.__cacheKey].usedTimes--,we.usedTimes===0&&L(S)),R.__cacheKey=Q,R.__webglTexture=ie[Q].texture}return X}function ne(R,S,X){let Z=s.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Z=s.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Z=s.TEXTURE_3D);const ie=V(R,S),Q=S.source;t.bindTexture(Z,R.__webglTexture,s.TEXTURE0+X);const we=n.get(Q);if(Q.version!==we.__version||ie===!0){t.activeTexture(s.TEXTURE0+X);const le=nt.getPrimaries(nt.workingColorSpace),ce=S.colorSpace===In?null:nt.getPrimaries(S.colorSpace),be=S.colorSpace===In||le===ce?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);let ue=v(S.image,!1,i.maxTextureSize);ue=de(S,ue);const Me=r.convert(S.format,S.colorSpace),ke=r.convert(S.type);let Te=x(S.internalFormat,Me,ke,S.colorSpace,S.isVideoTexture);F(Z,S);let me;const xe=S.mipmaps,Ne=S.isVideoTexture!==!0,We=we.__version===void 0||ie===!0,E=Q.dataReady,$=M(S,ue);if(S.isDepthTexture)Te=_(S.format===ki,S.type),We&&(Ne?t.texStorage2D(s.TEXTURE_2D,1,Te,ue.width,ue.height):t.texImage2D(s.TEXTURE_2D,0,Te,ue.width,ue.height,0,Me,ke,null));else if(S.isDataTexture)if(xe.length>0){Ne&&We&&t.texStorage2D(s.TEXTURE_2D,$,Te,xe[0].width,xe[0].height);for(let z=0,ee=xe.length;z<ee;z++)me=xe[z],Ne?E&&t.texSubImage2D(s.TEXTURE_2D,z,0,0,me.width,me.height,Me,ke,me.data):t.texImage2D(s.TEXTURE_2D,z,Te,me.width,me.height,0,Me,ke,me.data);S.generateMipmaps=!1}else Ne?(We&&t.texStorage2D(s.TEXTURE_2D,$,Te,ue.width,ue.height),E&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ue.width,ue.height,Me,ke,ue.data)):t.texImage2D(s.TEXTURE_2D,0,Te,ue.width,ue.height,0,Me,ke,ue.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ne&&We&&t.texStorage3D(s.TEXTURE_2D_ARRAY,$,Te,xe[0].width,xe[0].height,ue.depth);for(let z=0,ee=xe.length;z<ee;z++)if(me=xe[z],S.format!==an)if(Me!==null)if(Ne){if(E)if(S.layerUpdates.size>0){for(const ge of S.layerUpdates){const Ae=me.width*me.height;t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,z,0,0,ge,me.width,me.height,1,Me,me.data.slice(Ae*ge,Ae*(ge+1)),0,0)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,z,0,0,0,me.width,me.height,ue.depth,Me,me.data,0,0)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,z,Te,me.width,me.height,ue.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ne?E&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,z,0,0,0,me.width,me.height,ue.depth,Me,ke,me.data):t.texImage3D(s.TEXTURE_2D_ARRAY,z,Te,me.width,me.height,ue.depth,0,Me,ke,me.data)}else{Ne&&We&&t.texStorage2D(s.TEXTURE_2D,$,Te,xe[0].width,xe[0].height);for(let z=0,ee=xe.length;z<ee;z++)me=xe[z],S.format!==an?Me!==null?Ne?E&&t.compressedTexSubImage2D(s.TEXTURE_2D,z,0,0,me.width,me.height,Me,me.data):t.compressedTexImage2D(s.TEXTURE_2D,z,Te,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ne?E&&t.texSubImage2D(s.TEXTURE_2D,z,0,0,me.width,me.height,Me,ke,me.data):t.texImage2D(s.TEXTURE_2D,z,Te,me.width,me.height,0,Me,ke,me.data)}else if(S.isDataArrayTexture)if(Ne){if(We&&t.texStorage3D(s.TEXTURE_2D_ARRAY,$,Te,ue.width,ue.height,ue.depth),E)if(S.layerUpdates.size>0){let z;switch(ke){case s.UNSIGNED_BYTE:switch(Me){case s.ALPHA:z=1;break;case s.LUMINANCE:z=1;break;case s.LUMINANCE_ALPHA:z=2;break;case s.RGB:z=3;break;case s.RGBA:z=4;break;default:throw new Error(`Unknown texel size for format ${Me}.`)}break;case s.UNSIGNED_SHORT_4_4_4_4:case s.UNSIGNED_SHORT_5_5_5_1:case s.UNSIGNED_SHORT_5_6_5:z=1;break;default:throw new Error(`Unknown texel size for type ${ke}.`)}const ee=ue.width*ue.height*z;for(const ge of S.layerUpdates)t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ge,ue.width,ue.height,1,Me,ke,ue.data.slice(ee*ge,ee*(ge+1)));S.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,Me,ke,ue.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Te,ue.width,ue.height,ue.depth,0,Me,ke,ue.data);else if(S.isData3DTexture)Ne?(We&&t.texStorage3D(s.TEXTURE_3D,$,Te,ue.width,ue.height,ue.depth),E&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,Me,ke,ue.data)):t.texImage3D(s.TEXTURE_3D,0,Te,ue.width,ue.height,ue.depth,0,Me,ke,ue.data);else if(S.isFramebufferTexture){if(We)if(Ne)t.texStorage2D(s.TEXTURE_2D,$,Te,ue.width,ue.height);else{let z=ue.width,ee=ue.height;for(let ge=0;ge<$;ge++)t.texImage2D(s.TEXTURE_2D,ge,Te,z,ee,0,Me,ke,null),z>>=1,ee>>=1}}else if(xe.length>0){if(Ne&&We){const z=Ce(xe[0]);t.texStorage2D(s.TEXTURE_2D,$,Te,z.width,z.height)}for(let z=0,ee=xe.length;z<ee;z++)me=xe[z],Ne?E&&t.texSubImage2D(s.TEXTURE_2D,z,0,0,Me,ke,me):t.texImage2D(s.TEXTURE_2D,z,Te,Me,ke,me);S.generateMipmaps=!1}else if(Ne){if(We){const z=Ce(ue);t.texStorage2D(s.TEXTURE_2D,$,Te,z.width,z.height)}E&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Me,ke,ue)}else t.texImage2D(s.TEXTURE_2D,0,Te,Me,ke,ue);p(S)&&m(Z),we.__version=Q.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function O(R,S,X){if(S.image.length!==6)return;const Z=V(R,S),ie=S.source;t.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+X);const Q=n.get(ie);if(ie.version!==Q.__version||Z===!0){t.activeTexture(s.TEXTURE0+X);const we=nt.getPrimaries(nt.workingColorSpace),le=S.colorSpace===In?null:nt.getPrimaries(S.colorSpace),ce=S.colorSpace===In||we===le?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);const be=S.isCompressedTexture||S.image[0].isCompressedTexture,ue=S.image[0]&&S.image[0].isDataTexture,Me=[];for(let ee=0;ee<6;ee++)!be&&!ue?Me[ee]=v(S.image[ee],!0,i.maxCubemapSize):Me[ee]=ue?S.image[ee].image:S.image[ee],Me[ee]=de(S,Me[ee]);const ke=Me[0],Te=r.convert(S.format,S.colorSpace),me=r.convert(S.type),xe=x(S.internalFormat,Te,me,S.colorSpace),Ne=S.isVideoTexture!==!0,We=Q.__version===void 0||Z===!0,E=ie.dataReady;let $=M(S,ke);F(s.TEXTURE_CUBE_MAP,S);let z;if(be){Ne&&We&&t.texStorage2D(s.TEXTURE_CUBE_MAP,$,xe,ke.width,ke.height);for(let ee=0;ee<6;ee++){z=Me[ee].mipmaps;for(let ge=0;ge<z.length;ge++){const Ae=z[ge];S.format!==an?Te!==null?Ne?E&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,0,0,Ae.width,Ae.height,Te,Ae.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,xe,Ae.width,Ae.height,0,Ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ne?E&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,0,0,Ae.width,Ae.height,Te,me,Ae.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,xe,Ae.width,Ae.height,0,Te,me,Ae.data)}}}else{if(z=S.mipmaps,Ne&&We){z.length>0&&$++;const ee=Ce(Me[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,$,xe,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(ue){Ne?E&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Me[ee].width,Me[ee].height,Te,me,Me[ee].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,xe,Me[ee].width,Me[ee].height,0,Te,me,Me[ee].data);for(let ge=0;ge<z.length;ge++){const Re=z[ge].image[ee].image;Ne?E&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,0,0,Re.width,Re.height,Te,me,Re.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,xe,Re.width,Re.height,0,Te,me,Re.data)}}else{Ne?E&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Te,me,Me[ee]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,xe,Te,me,Me[ee]);for(let ge=0;ge<z.length;ge++){const Ae=z[ge];Ne?E&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,0,0,Te,me,Ae.image[ee]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,xe,Te,me,Ae.image[ee])}}}p(S)&&m(s.TEXTURE_CUBE_MAP),Q.__version=ie.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function k(R,S,X,Z,ie,Q){const we=r.convert(X.format,X.colorSpace),le=r.convert(X.type),ce=x(X.internalFormat,we,le,X.colorSpace);if(!n.get(S).__hasExternalTextures){const ue=Math.max(1,S.width>>Q),Me=Math.max(1,S.height>>Q);ie===s.TEXTURE_3D||ie===s.TEXTURE_2D_ARRAY?t.texImage3D(ie,Q,ce,ue,Me,S.depth,0,we,le,null):t.texImage2D(ie,Q,ce,ue,Me,0,we,le,null)}t.bindFramebuffer(s.FRAMEBUFFER,R),ye(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Z,ie,n.get(X).__webglTexture,0,fe(S)):(ie===s.TEXTURE_2D||ie>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Z,ie,n.get(X).__webglTexture,Q),t.bindFramebuffer(s.FRAMEBUFFER,null)}function te(R,S,X){if(s.bindRenderbuffer(s.RENDERBUFFER,R),S.depthBuffer){const Z=S.depthTexture,ie=Z&&Z.isDepthTexture?Z.type:null,Q=_(S.stencilBuffer,ie),we=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,le=fe(S);ye(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,le,Q,S.width,S.height):X?s.renderbufferStorageMultisample(s.RENDERBUFFER,le,Q,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,Q,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,we,s.RENDERBUFFER,R)}else{const Z=S.textures;for(let ie=0;ie<Z.length;ie++){const Q=Z[ie],we=r.convert(Q.format,Q.colorSpace),le=r.convert(Q.type),ce=x(Q.internalFormat,we,le,Q.colorSpace),be=fe(S);X&&ye(S)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,be,ce,S.width,S.height):ye(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,be,ce,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,ce,S.width,S.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function G(R,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),N(S.depthTexture,0);const Z=n.get(S.depthTexture).__webglTexture,ie=fe(S);if(S.depthTexture.format===Ui)ye(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Z,0,ie):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Z,0);else if(S.depthTexture.format===ki)ye(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Z,0,ie):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function ae(R){const S=n.get(R),X=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!S.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");G(S.__webglFramebuffer,R)}else if(X){S.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[Z]),S.__webglDepthbuffer[Z]=s.createRenderbuffer(),te(S.__webglDepthbuffer[Z],R,!1)}else t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=s.createRenderbuffer(),te(S.__webglDepthbuffer,R,!1);t.bindFramebuffer(s.FRAMEBUFFER,null)}function pe(R,S,X){const Z=n.get(R);S!==void 0&&k(Z.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),X!==void 0&&ae(R)}function _e(R){const S=R.texture,X=n.get(R),Z=n.get(S);R.addEventListener("dispose",T);const ie=R.textures,Q=R.isWebGLCubeRenderTarget===!0,we=ie.length>1;if(we||(Z.__webglTexture===void 0&&(Z.__webglTexture=s.createTexture()),Z.__version=S.version,o.memory.textures++),Q){X.__webglFramebuffer=[];for(let le=0;le<6;le++)if(S.mipmaps&&S.mipmaps.length>0){X.__webglFramebuffer[le]=[];for(let ce=0;ce<S.mipmaps.length;ce++)X.__webglFramebuffer[le][ce]=s.createFramebuffer()}else X.__webglFramebuffer[le]=s.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){X.__webglFramebuffer=[];for(let le=0;le<S.mipmaps.length;le++)X.__webglFramebuffer[le]=s.createFramebuffer()}else X.__webglFramebuffer=s.createFramebuffer();if(we)for(let le=0,ce=ie.length;le<ce;le++){const be=n.get(ie[le]);be.__webglTexture===void 0&&(be.__webglTexture=s.createTexture(),o.memory.textures++)}if(R.samples>0&&ye(R)===!1){X.__webglMultisampledFramebuffer=s.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let le=0;le<ie.length;le++){const ce=ie[le];X.__webglColorRenderbuffer[le]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,X.__webglColorRenderbuffer[le]);const be=r.convert(ce.format,ce.colorSpace),ue=r.convert(ce.type),Me=x(ce.internalFormat,be,ue,ce.colorSpace,R.isXRRenderTarget===!0),ke=fe(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,ke,Me,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+le,s.RENDERBUFFER,X.__webglColorRenderbuffer[le])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(X.__webglDepthRenderbuffer=s.createRenderbuffer(),te(X.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Q){t.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture),F(s.TEXTURE_CUBE_MAP,S);for(let le=0;le<6;le++)if(S.mipmaps&&S.mipmaps.length>0)for(let ce=0;ce<S.mipmaps.length;ce++)k(X.__webglFramebuffer[le][ce],R,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+le,ce);else k(X.__webglFramebuffer[le],R,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);p(S)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let le=0,ce=ie.length;le<ce;le++){const be=ie[le],ue=n.get(be);t.bindTexture(s.TEXTURE_2D,ue.__webglTexture),F(s.TEXTURE_2D,be),k(X.__webglFramebuffer,R,be,s.COLOR_ATTACHMENT0+le,s.TEXTURE_2D,0),p(be)&&m(s.TEXTURE_2D)}t.unbindTexture()}else{let le=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(le=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(le,Z.__webglTexture),F(le,S),S.mipmaps&&S.mipmaps.length>0)for(let ce=0;ce<S.mipmaps.length;ce++)k(X.__webglFramebuffer[ce],R,S,s.COLOR_ATTACHMENT0,le,ce);else k(X.__webglFramebuffer,R,S,s.COLOR_ATTACHMENT0,le,0);p(S)&&m(le),t.unbindTexture()}R.depthBuffer&&ae(R)}function D(R){const S=R.textures;for(let X=0,Z=S.length;X<Z;X++){const ie=S[X];if(p(ie)){const Q=R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,we=n.get(ie).__webglTexture;t.bindTexture(Q,we),m(Q),t.unbindTexture()}}}const he=[],Pe=[];function Le(R){if(R.samples>0){if(ye(R)===!1){const S=R.textures,X=R.width,Z=R.height;let ie=s.COLOR_BUFFER_BIT;const Q=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,we=n.get(R),le=S.length>1;if(le)for(let ce=0;ce<S.length;ce++)t.bindFramebuffer(s.FRAMEBUFFER,we.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,we.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let ce=0;ce<S.length;ce++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ie|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ie|=s.STENCIL_BUFFER_BIT)),le){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,we.__webglColorRenderbuffer[ce]);const be=n.get(S[ce]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,be,0)}s.blitFramebuffer(0,0,X,Z,0,0,X,Z,ie,s.NEAREST),l===!0&&(he.length=0,Pe.length=0,he.push(s.COLOR_ATTACHMENT0+ce),R.depthBuffer&&R.resolveDepthBuffer===!1&&(he.push(Q),Pe.push(Q),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Pe)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,he))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),le)for(let ce=0;ce<S.length;ce++){t.bindFramebuffer(s.FRAMEBUFFER,we.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.RENDERBUFFER,we.__webglColorRenderbuffer[ce]);const be=n.get(S[ce]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,we.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.TEXTURE_2D,be,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const S=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[S])}}}function fe(R){return Math.min(i.maxSamples,R.samples)}function ye(R){const S=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Se(R){const S=o.render.frame;h.get(R)!==S&&(h.set(R,S),R.update())}function de(R,S){const X=R.colorSpace,Z=R.format,ie=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||X!==Bn&&X!==In&&(nt.getTransfer(X)===ot?(Z!==an||ie!==kn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),S}function Ce(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=P,this.resetTextureUnits=U,this.setTexture2D=N,this.setTexture2DArray=W,this.setTexture3D=B,this.setTextureCube=se,this.rebindTextures=pe,this.setupRenderTarget=_e,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=Le,this.setupDepthRenderbuffer=ae,this.setupFrameBufferTexture=k,this.useMultisampledRTT=ye}function Yv(s,e){function t(n,i=In){let r;const o=nt.getTransfer(i);if(n===kn)return s.UNSIGNED_BYTE;if(n===Kc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Zc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===_d)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===gd)return s.BYTE;if(n===vd)return s.SHORT;if(n===xs)return s.UNSIGNED_SHORT;if(n===qc)return s.INT;if(n===Ni)return s.UNSIGNED_INT;if(n===xn)return s.FLOAT;if(n===Nn)return s.HALF_FLOAT;if(n===xd)return s.ALPHA;if(n===yd)return s.RGB;if(n===an)return s.RGBA;if(n===bd)return s.LUMINANCE;if(n===Sd)return s.LUMINANCE_ALPHA;if(n===Ui)return s.DEPTH_COMPONENT;if(n===ki)return s.DEPTH_STENCIL;if(n===Jc)return s.RED;if(n===Qc)return s.RED_INTEGER;if(n===Md)return s.RG;if(n===$c)return s.RG_INTEGER;if(n===eh)return s.RGBA_INTEGER;if(n===js||n===qs||n===Ks||n===Zs)if(o===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===js)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===qs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ks)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Zs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===js)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===qs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ks)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Zs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Na||n===Oa||n===ka||n===Ba)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Na)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Oa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ka)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ba)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===za||n===Ga||n===Ha)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===za||n===Ga)return o===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ha)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Va||n===Wa||n===Xa||n===Ya||n===ja||n===qa||n===Ka||n===Za||n===Ja||n===Qa||n===$a||n===el||n===tl||n===nl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Va)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Wa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Xa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ya)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ja)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===qa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ka)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Za)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ja)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Qa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===$a)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===el)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===tl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===nl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Js||n===il||n===rl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Js)return o===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===il)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===rl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ed||n===sl||n===ol||n===al)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Js)return r.COMPRESSED_RED_RGTC1_EXT;if(n===sl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ol)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===al)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Oi?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}class jv extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ns extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const qv={type:"move"};class Mo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ns,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ns,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ns,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,n),m=this._getHandJoint(c,v);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(qv)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new ns;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Kv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Zv=`
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

}`;class Jv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Tt,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new It({vertexShader:Kv,fragmentShader:Zv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Pt(new oi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class Qv extends ri{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null;const v=new Jv,p=t.getContextAttributes();let m=null,x=null;const _=[],M=[],C=new Oe;let T=null;const w=new jt;w.layers.enable(1),w.viewport=new ht;const L=new jt;L.layers.enable(2),L.viewport=new ht;const b=[w,L],y=new jv;y.layers.enable(1),y.layers.enable(2);let U=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let k=_[O];return k===void 0&&(k=new Mo,_[O]=k),k.getTargetRaySpace()},this.getControllerGrip=function(O){let k=_[O];return k===void 0&&(k=new Mo,_[O]=k),k.getGripSpace()},this.getHand=function(O){let k=_[O];return k===void 0&&(k=new Mo,_[O]=k),k.getHandSpace()};function I(O){const k=M.indexOf(O.inputSource);if(k===-1)return;const te=_[k];te!==void 0&&(te.update(O.inputSource,O.frame,c||o),te.dispatchEvent({type:O.type,data:O.inputSource}))}function N(){i.removeEventListener("select",I),i.removeEventListener("selectstart",I),i.removeEventListener("selectend",I),i.removeEventListener("squeeze",I),i.removeEventListener("squeezestart",I),i.removeEventListener("squeezeend",I),i.removeEventListener("end",N),i.removeEventListener("inputsourceschange",W);for(let O=0;O<_.length;O++){const k=M[O];k!==null&&(M[O]=null,_[O].disconnect(k))}U=null,P=null,v.reset(),e.setRenderTarget(m),f=null,u=null,d=null,i=null,x=null,ne.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){r=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){a=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(O){c=O},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(O){if(i=O,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",I),i.addEventListener("selectstart",I),i.addEventListener("selectend",I),i.addEventListener("squeeze",I),i.addEventListener("squeezestart",I),i.addEventListener("squeezeend",I),i.addEventListener("end",N),i.addEventListener("inputsourceschange",W),p.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(C),i.renderState.layers===void 0){const k={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,k),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new en(f.framebufferWidth,f.framebufferHeight,{format:an,type:kn,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let k=null,te=null,G=null;p.depth&&(G=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,k=p.stencil?ki:Ui,te=p.stencil?Oi:Ni);const ae={colorFormat:t.RGBA8,depthFormat:G,scaleFactor:r};d=new XRWebGLBinding(i,t),u=d.createProjectionLayer(ae),i.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),x=new en(u.textureWidth,u.textureHeight,{format:an,type:kn,depthTexture:new mh(u.textureWidth,u.textureHeight,te,void 0,void 0,void 0,void 0,void 0,void 0,k),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),ne.setContext(i),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function W(O){for(let k=0;k<O.removed.length;k++){const te=O.removed[k],G=M.indexOf(te);G>=0&&(M[G]=null,_[G].disconnect(te))}for(let k=0;k<O.added.length;k++){const te=O.added[k];let G=M.indexOf(te);if(G===-1){for(let pe=0;pe<_.length;pe++)if(pe>=M.length){M.push(te),G=pe;break}else if(M[pe]===null){M[pe]=te,G=pe;break}if(G===-1)break}const ae=_[G];ae&&ae.connect(te)}}const B=new H,se=new H;function j(O,k,te){B.setFromMatrixPosition(k.matrixWorld),se.setFromMatrixPosition(te.matrixWorld);const G=B.distanceTo(se),ae=k.projectionMatrix.elements,pe=te.projectionMatrix.elements,_e=ae[14]/(ae[10]-1),D=ae[14]/(ae[10]+1),he=(ae[9]+1)/ae[5],Pe=(ae[9]-1)/ae[5],Le=(ae[8]-1)/ae[0],fe=(pe[8]+1)/pe[0],ye=_e*Le,Se=_e*fe,de=G/(-Le+fe),Ce=de*-Le;k.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(Ce),O.translateZ(de),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert();const R=_e+de,S=D+de,X=ye-Ce,Z=Se+(G-Ce),ie=he*D/S*R,Q=Pe*D/S*R;O.projectionMatrix.makePerspective(X,Z,ie,Q,R,S),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}function K(O,k){k===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(k.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(i===null)return;v.texture!==null&&(O.near=v.depthNear,O.far=v.depthFar),y.near=L.near=w.near=O.near,y.far=L.far=w.far=O.far,(U!==y.near||P!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),U=y.near,P=y.far,w.near=U,w.far=P,L.near=U,L.far=P,w.updateProjectionMatrix(),L.updateProjectionMatrix(),O.updateProjectionMatrix());const k=O.parent,te=y.cameras;K(y,k);for(let G=0;G<te.length;G++)K(te[G],k);te.length===2?j(y,w,L):y.projectionMatrix.copy(w.projectionMatrix),q(O,y,k)};function q(O,k,te){te===null?O.matrix.copy(k.matrixWorld):(O.matrix.copy(te.matrixWorld),O.matrix.invert(),O.matrix.multiply(k.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy(k.projectionMatrix),O.projectionMatrixInverse.copy(k.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=yr*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(O){l=O,u!==null&&(u.fixedFoveation=O),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=O)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(y)};let F=null;function V(O,k){if(h=k.getViewerPose(c||o),g=k,h!==null){const te=h.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let G=!1;te.length!==y.cameras.length&&(y.cameras.length=0,G=!0);for(let pe=0;pe<te.length;pe++){const _e=te[pe];let D=null;if(f!==null)D=f.getViewport(_e);else{const Pe=d.getViewSubImage(u,_e);D=Pe.viewport,pe===0&&(e.setRenderTargetTextures(x,Pe.colorTexture,u.ignoreDepthValues?void 0:Pe.depthStencilTexture),e.setRenderTarget(x))}let he=b[pe];he===void 0&&(he=new jt,he.layers.enable(pe),he.viewport=new ht,b[pe]=he),he.matrix.fromArray(_e.transform.matrix),he.matrix.decompose(he.position,he.quaternion,he.scale),he.projectionMatrix.fromArray(_e.projectionMatrix),he.projectionMatrixInverse.copy(he.projectionMatrix).invert(),he.viewport.set(D.x,D.y,D.width,D.height),pe===0&&(y.matrix.copy(he.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),G===!0&&y.cameras.push(he)}const ae=i.enabledFeatures;if(ae&&ae.includes("depth-sensing")){const pe=d.getDepthInformation(te[0]);pe&&pe.isValid&&pe.texture&&v.init(e,pe,i.renderState)}}for(let te=0;te<_.length;te++){const G=M[te],ae=_[te];G!==null&&ae!==void 0&&ae.update(G,k,c||o)}F&&F(O,k),k.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:k}),g=null}const ne=new ph;ne.setAnimationLoop(V),this.setAnimationLoop=function(O){F=O},this.dispose=function(){}}}const jn=new ln,$v=new it;function e_(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,uh(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,x,_,M){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(p,m):m.isMeshToonMaterial?(r(p,m),d(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m)):m.isMeshStandardMaterial?(r(p,m),u(p,m),m.isMeshPhysicalMaterial&&f(p,m,M)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),v(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,x,_):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Ft&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Ft&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const x=e.get(m),_=x.envMap,M=x.envMapRotation;_&&(p.envMap.value=_,jn.copy(M),jn.x*=-1,jn.y*=-1,jn.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(jn.y*=-1,jn.z*=-1),p.envMapRotation.value.setFromMatrix4($v.makeRotationFromEuler(jn)),p.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,x,_){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*x,p.scale.value=_*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,x){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Ft&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function v(p,m){const x=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function t_(s,e,t,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,_){const M=_.program;n.uniformBlockBinding(x,M)}function c(x,_){let M=i[x.id];M===void 0&&(g(x),M=h(x),i[x.id]=M,x.addEventListener("dispose",p));const C=_.program;n.updateUBOMapping(x,C);const T=e.render.frame;r[x.id]!==T&&(u(x),r[x.id]=T)}function h(x){const _=d();x.__bindingPointIndex=_;const M=s.createBuffer(),C=x.__size,T=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,C,T),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,_,M),M}function d(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){const _=i[x.id],M=x.uniforms,C=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,_);for(let T=0,w=M.length;T<w;T++){const L=Array.isArray(M[T])?M[T]:[M[T]];for(let b=0,y=L.length;b<y;b++){const U=L[b];if(f(U,T,b,C)===!0){const P=U.__offset,I=Array.isArray(U.value)?U.value:[U.value];let N=0;for(let W=0;W<I.length;W++){const B=I[W],se=v(B);typeof B=="number"||typeof B=="boolean"?(U.__data[0]=B,s.bufferSubData(s.UNIFORM_BUFFER,P+N,U.__data)):B.isMatrix3?(U.__data[0]=B.elements[0],U.__data[1]=B.elements[1],U.__data[2]=B.elements[2],U.__data[3]=0,U.__data[4]=B.elements[3],U.__data[5]=B.elements[4],U.__data[6]=B.elements[5],U.__data[7]=0,U.__data[8]=B.elements[6],U.__data[9]=B.elements[7],U.__data[10]=B.elements[8],U.__data[11]=0):(B.toArray(U.__data,N),N+=se.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,P,U.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(x,_,M,C){const T=x.value,w=_+"_"+M;if(C[w]===void 0)return typeof T=="number"||typeof T=="boolean"?C[w]=T:C[w]=T.clone(),!0;{const L=C[w];if(typeof T=="number"||typeof T=="boolean"){if(L!==T)return C[w]=T,!0}else if(L.equals(T)===!1)return L.copy(T),!0}return!1}function g(x){const _=x.uniforms;let M=0;const C=16;for(let w=0,L=_.length;w<L;w++){const b=Array.isArray(_[w])?_[w]:[_[w]];for(let y=0,U=b.length;y<U;y++){const P=b[y],I=Array.isArray(P.value)?P.value:[P.value];for(let N=0,W=I.length;N<W;N++){const B=I[N],se=v(B),j=M%C;j!==0&&C-j<se.boundary&&(M+=C-j),P.__data=new Float32Array(se.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=M,M+=se.storage}}}const T=M%C;return T>0&&(M+=C-T),x.__size=M,x.__cache={},this}function v(x){const _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function p(x){const _=x.target;_.removeEventListener("dispose",p);const M=o.indexOf(_.__bindingPointIndex);o.splice(M,1),s.deleteBuffer(i[_.id]),delete i[_.id],delete r[_.id]}function m(){for(const x in i)s.deleteBuffer(i[x]);o=[],i={},r={}}return{bind:l,update:c,dispose:m}}class n_{constructor(e={}){const{canvas:t=Zd(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=o;const f=new Uint32Array(4),g=new Int32Array(4);let v=null,p=null;const m=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=nn,this.toneMapping=Fn,this.toneMappingExposure=1;const _=this;let M=!1,C=0,T=0,w=null,L=-1,b=null;const y=new ht,U=new ht;let P=null;const I=new Ve(0);let N=0,W=t.width,B=t.height,se=1,j=null,K=null;const q=new ht(0,0,W,B),F=new ht(0,0,W,B);let V=!1;const ne=new na;let O=!1,k=!1;const te=new it,G=new H,ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pe=!1;function _e(){return w===null?se:1}let D=n;function he(A,Y){return t.getContext(A,Y)}try{const A={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Qo}`),t.addEventListener("webglcontextlost",$,!1),t.addEventListener("webglcontextrestored",z,!1),t.addEventListener("webglcontextcreationerror",ee,!1),D===null){const Y="webgl2";if(D=he(Y,A),D===null)throw he(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Pe,Le,fe,ye,Se,de,Ce,R,S,X,Z,ie,Q,we,le,ce,be,ue,Me,ke,Te,me,xe,Ne;function We(){Pe=new dg(D),Pe.init(),me=new Yv(D,Pe),Le=new og(D,Pe,e,me),fe=new Wv(D),ye=new mg(D),Se=new Uv,de=new Xv(D,Pe,fe,Se,Le,me,ye),Ce=new lg(_),R=new ug(_),S=new Sf(D),xe=new rg(D,S),X=new fg(D,S,ye,xe),Z=new vg(D,X,S,ye),Me=new gg(D,Le,de),ce=new ag(Se),ie=new Lv(_,Ce,R,Pe,Le,xe,ce),Q=new e_(_,Se),we=new Iv,le=new zv(Pe),ue=new ig(_,Ce,R,fe,Z,u,l),be=new Vv(_,Z,Le),Ne=new t_(D,ye,Le,fe),ke=new sg(D,Pe,ye),Te=new pg(D,Pe,ye),ye.programs=ie.programs,_.capabilities=Le,_.extensions=Pe,_.properties=Se,_.renderLists=we,_.shadowMap=be,_.state=fe,_.info=ye}We();const E=new Qv(_,D);this.xr=E,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const A=Pe.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Pe.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(A){A!==void 0&&(se=A,this.setSize(W,B,!1))},this.getSize=function(A){return A.set(W,B)},this.setSize=function(A,Y,re=!0){if(E.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=A,B=Y,t.width=Math.floor(A*se),t.height=Math.floor(Y*se),re===!0&&(t.style.width=A+"px",t.style.height=Y+"px"),this.setViewport(0,0,A,Y)},this.getDrawingBufferSize=function(A){return A.set(W*se,B*se).floor()},this.setDrawingBufferSize=function(A,Y,re){W=A,B=Y,se=re,t.width=Math.floor(A*re),t.height=Math.floor(Y*re),this.setViewport(0,0,A,Y)},this.getCurrentViewport=function(A){return A.copy(y)},this.getViewport=function(A){return A.copy(q)},this.setViewport=function(A,Y,re,oe){A.isVector4?q.set(A.x,A.y,A.z,A.w):q.set(A,Y,re,oe),fe.viewport(y.copy(q).multiplyScalar(se).round())},this.getScissor=function(A){return A.copy(F)},this.setScissor=function(A,Y,re,oe){A.isVector4?F.set(A.x,A.y,A.z,A.w):F.set(A,Y,re,oe),fe.scissor(U.copy(F).multiplyScalar(se).round())},this.getScissorTest=function(){return V},this.setScissorTest=function(A){fe.setScissorTest(V=A)},this.setOpaqueSort=function(A){j=A},this.setTransparentSort=function(A){K=A},this.getClearColor=function(A){return A.copy(ue.getClearColor())},this.setClearColor=function(){ue.setClearColor.apply(ue,arguments)},this.getClearAlpha=function(){return ue.getClearAlpha()},this.setClearAlpha=function(){ue.setClearAlpha.apply(ue,arguments)},this.clear=function(A=!0,Y=!0,re=!0){let oe=0;if(A){let J=!1;if(w!==null){const Ee=w.texture.format;J=Ee===eh||Ee===$c||Ee===Qc}if(J){const Ee=w.texture.type,Ie=Ee===kn||Ee===Ni||Ee===xs||Ee===Oi||Ee===Kc||Ee===Zc,Fe=ue.getClearColor(),Be=ue.getClearAlpha(),ve=Fe.r,Ge=Fe.g,He=Fe.b;Ie?(f[0]=ve,f[1]=Ge,f[2]=He,f[3]=Be,D.clearBufferuiv(D.COLOR,0,f)):(g[0]=ve,g[1]=Ge,g[2]=He,g[3]=Be,D.clearBufferiv(D.COLOR,0,g))}else oe|=D.COLOR_BUFFER_BIT}Y&&(oe|=D.DEPTH_BUFFER_BIT),re&&(oe|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(oe)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",$,!1),t.removeEventListener("webglcontextrestored",z,!1),t.removeEventListener("webglcontextcreationerror",ee,!1),we.dispose(),le.dispose(),Se.dispose(),Ce.dispose(),R.dispose(),Z.dispose(),xe.dispose(),Ne.dispose(),ie.dispose(),E.dispose(),E.removeEventListener("sessionstart",Ye),E.removeEventListener("sessionend",Je),tt.stop()};function $(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function z(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const A=ye.autoReset,Y=be.enabled,re=be.autoUpdate,oe=be.needsUpdate,J=be.type;We(),ye.autoReset=A,be.enabled=Y,be.autoUpdate=re,be.needsUpdate=oe,be.type=J}function ee(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ge(A){const Y=A.target;Y.removeEventListener("dispose",ge),Ae(Y)}function Ae(A){Re(A),Se.remove(A)}function Re(A){const Y=Se.get(A).programs;Y!==void 0&&(Y.forEach(function(re){ie.releaseProgram(re)}),A.isShaderMaterial&&ie.releaseShaderCache(A))}this.renderBufferDirect=function(A,Y,re,oe,J,Ee){Y===null&&(Y=ae);const Ie=J.isMesh&&J.matrixWorld.determinant()<0,Fe=cn(A,Y,re,oe,J);fe.setMaterial(oe,Ie);let Be=re.index,ve=1;if(oe.wireframe===!0){if(Be=X.getWireframeAttribute(re),Be===void 0)return;ve=2}const Ge=re.drawRange,He=re.attributes.position;let Ze=Ge.start*ve,rt=(Ge.start+Ge.count)*ve;Ee!==null&&(Ze=Math.max(Ze,Ee.start*ve),rt=Math.min(rt,(Ee.start+Ee.count)*ve)),Be!==null?(Ze=Math.max(Ze,0),rt=Math.min(rt,Be.count)):He!=null&&(Ze=Math.max(Ze,0),rt=Math.min(rt,He.count));const st=rt-Ze;if(st<0||st===1/0)return;xe.setup(J,oe,Fe,re,Be);let vt,Qe=ke;if(Be!==null&&(vt=S.get(Be),Qe=Te,Qe.setIndex(vt)),J.isMesh)oe.wireframe===!0?(fe.setLineWidth(oe.wireframeLinewidth*_e()),Qe.setMode(D.LINES)):Qe.setMode(D.TRIANGLES);else if(J.isLine){let ze=oe.linewidth;ze===void 0&&(ze=1),fe.setLineWidth(ze*_e()),J.isLineSegments?Qe.setMode(D.LINES):J.isLineLoop?Qe.setMode(D.LINE_LOOP):Qe.setMode(D.LINE_STRIP)}else J.isPoints?Qe.setMode(D.POINTS):J.isSprite&&Qe.setMode(D.TRIANGLES);if(J.isBatchedMesh)J._multiDrawInstances!==null?Qe.renderMultiDrawInstances(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount,J._multiDrawInstances):Qe.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else if(J.isInstancedMesh)Qe.renderInstances(Ze,st,J.count);else if(re.isInstancedBufferGeometry){const ze=re._maxInstanceCount!==void 0?re._maxInstanceCount:1/0,pt=Math.min(re.instanceCount,ze);Qe.renderInstances(Ze,st,pt)}else Qe.render(Ze,st)};function je(A,Y,re){A.transparent===!0&&A.side===sn&&A.forceSinglePass===!1?(A.side=Ft,A.needsUpdate=!0,Ht(A,Y,re),A.side=On,A.needsUpdate=!0,Ht(A,Y,re),A.side=sn):Ht(A,Y,re)}this.compile=function(A,Y,re=null){re===null&&(re=A),p=le.get(re),p.init(Y),x.push(p),re.traverseVisible(function(J){J.isLight&&J.layers.test(Y.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),A!==re&&A.traverseVisible(function(J){J.isLight&&J.layers.test(Y.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),p.setupLights();const oe=new Set;return A.traverse(function(J){const Ee=J.material;if(Ee)if(Array.isArray(Ee))for(let Ie=0;Ie<Ee.length;Ie++){const Fe=Ee[Ie];je(Fe,re,J),oe.add(Fe)}else je(Ee,re,J),oe.add(Ee)}),x.pop(),p=null,oe},this.compileAsync=function(A,Y,re=null){const oe=this.compile(A,Y,re);return new Promise(J=>{function Ee(){if(oe.forEach(function(Ie){Se.get(Ie).currentProgram.isReady()&&oe.delete(Ie)}),oe.size===0){J(A);return}setTimeout(Ee,10)}Pe.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let Xe=null;function De(A){Xe&&Xe(A)}function Ye(){tt.stop()}function Je(){tt.start()}const tt=new ph;tt.setAnimationLoop(De),typeof self<"u"&&tt.setContext(self),this.setAnimationLoop=function(A){Xe=A,E.setAnimationLoop(A),A===null?tt.stop():tt.start()},E.addEventListener("sessionstart",Ye),E.addEventListener("sessionend",Je),this.render=function(A,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),E.enabled===!0&&E.isPresenting===!0&&(E.cameraAutoUpdate===!0&&E.updateCamera(Y),Y=E.getCamera()),A.isScene===!0&&A.onBeforeRender(_,A,Y,w),p=le.get(A,x.length),p.init(Y),x.push(p),te.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),ne.setFromProjectionMatrix(te),k=this.localClippingEnabled,O=ce.init(this.clippingPlanes,k),v=we.get(A,m.length),v.init(),m.push(v),E.enabled===!0&&E.isPresenting===!0){const Ee=_.xr.getDepthSensingMesh();Ee!==null&&$e(Ee,Y,-1/0,_.sortObjects)}$e(A,Y,0,_.sortObjects),v.finish(),_.sortObjects===!0&&v.sort(j,K),pe=E.enabled===!1||E.isPresenting===!1||E.hasDepthSensing()===!1,pe&&ue.addToRenderList(v,A),this.info.render.frame++,O===!0&&ce.beginShadows();const re=p.state.shadowsArray;be.render(re,A,Y),O===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const oe=v.opaque,J=v.transmissive;if(p.setupLights(),Y.isArrayCamera){const Ee=Y.cameras;if(J.length>0)for(let Ie=0,Fe=Ee.length;Ie<Fe;Ie++){const Be=Ee[Ie];bt(oe,J,A,Be)}pe&&ue.render(A);for(let Ie=0,Fe=Ee.length;Ie<Fe;Ie++){const Be=Ee[Ie];lt(v,A,Be,Be.viewport)}}else J.length>0&&bt(oe,J,A,Y),pe&&ue.render(A),lt(v,A,Y);w!==null&&(de.updateMultisampleRenderTarget(w),de.updateRenderTargetMipmap(w)),A.isScene===!0&&A.onAfterRender(_,A,Y),xe.resetDefaultState(),L=-1,b=null,x.pop(),x.length>0?(p=x[x.length-1],O===!0&&ce.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,m.pop(),m.length>0?v=m[m.length-1]:v=null};function $e(A,Y,re,oe){if(A.visible===!1)return;if(A.layers.test(Y.layers)){if(A.isGroup)re=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(Y);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||ne.intersectsSprite(A)){oe&&G.setFromMatrixPosition(A.matrixWorld).applyMatrix4(te);const Ie=Z.update(A),Fe=A.material;Fe.visible&&v.push(A,Ie,Fe,re,G.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||ne.intersectsObject(A))){const Ie=Z.update(A),Fe=A.material;if(oe&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),G.copy(A.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),G.copy(Ie.boundingSphere.center)),G.applyMatrix4(A.matrixWorld).applyMatrix4(te)),Array.isArray(Fe)){const Be=Ie.groups;for(let ve=0,Ge=Be.length;ve<Ge;ve++){const He=Be[ve],Ze=Fe[He.materialIndex];Ze&&Ze.visible&&v.push(A,Ie,Ze,re,G.z,He)}}else Fe.visible&&v.push(A,Ie,Fe,re,G.z,null)}}const Ee=A.children;for(let Ie=0,Fe=Ee.length;Ie<Fe;Ie++)$e(Ee[Ie],Y,re,oe)}function lt(A,Y,re,oe){const J=A.opaque,Ee=A.transmissive,Ie=A.transparent;p.setupLightsView(re),O===!0&&ce.setGlobalState(_.clippingPlanes,re),oe&&fe.viewport(y.copy(oe)),J.length>0&&gt(J,Y,re),Ee.length>0&&gt(Ee,Y,re),Ie.length>0&&gt(Ie,Y,re),fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1)}function bt(A,Y,re,oe){if((re.isScene===!0?re.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[oe.id]===void 0&&(p.state.transmissionRenderTarget[oe.id]=new en(1,1,{generateMipmaps:!0,type:Pe.has("EXT_color_buffer_half_float")||Pe.has("EXT_color_buffer_float")?Nn:kn,minFilter:ti,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace}));const Ee=p.state.transmissionRenderTarget[oe.id],Ie=oe.viewport||y;Ee.setSize(Ie.z,Ie.w);const Fe=_.getRenderTarget();_.setRenderTarget(Ee),_.getClearColor(I),N=_.getClearAlpha(),N<1&&_.setClearColor(16777215,.5),pe?ue.render(re):_.clear();const Be=_.toneMapping;_.toneMapping=Fn;const ve=oe.viewport;if(oe.viewport!==void 0&&(oe.viewport=void 0),p.setupLightsView(oe),O===!0&&ce.setGlobalState(_.clippingPlanes,oe),gt(A,re,oe),de.updateMultisampleRenderTarget(Ee),de.updateRenderTargetMipmap(Ee),Pe.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let He=0,Ze=Y.length;He<Ze;He++){const rt=Y[He],st=rt.object,vt=rt.geometry,Qe=rt.material,ze=rt.group;if(Qe.side===sn&&st.layers.test(oe.layers)){const pt=Qe.side;Qe.side=Ft,Qe.needsUpdate=!0,qt(st,re,oe,vt,Qe,ze),Qe.side=pt,Qe.needsUpdate=!0,Ge=!0}}Ge===!0&&(de.updateMultisampleRenderTarget(Ee),de.updateRenderTargetMipmap(Ee))}_.setRenderTarget(Fe),_.setClearColor(I,N),ve!==void 0&&(oe.viewport=ve),_.toneMapping=Be}function gt(A,Y,re){const oe=Y.isScene===!0?Y.overrideMaterial:null;for(let J=0,Ee=A.length;J<Ee;J++){const Ie=A[J],Fe=Ie.object,Be=Ie.geometry,ve=oe===null?Ie.material:oe,Ge=Ie.group;Fe.layers.test(re.layers)&&qt(Fe,Y,re,Be,ve,Ge)}}function qt(A,Y,re,oe,J,Ee){A.onBeforeRender(_,Y,re,oe,J,Ee),A.modelViewMatrix.multiplyMatrices(re.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),J.onBeforeRender(_,Y,re,oe,A,Ee),J.transparent===!0&&J.side===sn&&J.forceSinglePass===!1?(J.side=Ft,J.needsUpdate=!0,_.renderBufferDirect(re,Y,oe,J,A,Ee),J.side=On,J.needsUpdate=!0,_.renderBufferDirect(re,Y,oe,J,A,Ee),J.side=sn):_.renderBufferDirect(re,Y,oe,J,A,Ee),A.onAfterRender(_,Y,re,oe,J,Ee)}function Ht(A,Y,re){Y.isScene!==!0&&(Y=ae);const oe=Se.get(A),J=p.state.lights,Ee=p.state.shadowsArray,Ie=J.state.version,Fe=ie.getParameters(A,J.state,Ee,Y,re),Be=ie.getProgramCacheKey(Fe);let ve=oe.programs;oe.environment=A.isMeshStandardMaterial?Y.environment:null,oe.fog=Y.fog,oe.envMap=(A.isMeshStandardMaterial?R:Ce).get(A.envMap||oe.environment),oe.envMapRotation=oe.environment!==null&&A.envMap===null?Y.environmentRotation:A.envMapRotation,ve===void 0&&(A.addEventListener("dispose",ge),ve=new Map,oe.programs=ve);let Ge=ve.get(Be);if(Ge!==void 0){if(oe.currentProgram===Ge&&oe.lightsStateVersion===Ie)return ft(A,Fe),Ge}else Fe.uniforms=ie.getUniforms(A),A.onBuild(re,Fe,_),A.onBeforeCompile(Fe,_),Ge=ie.acquireProgram(Fe,Be),ve.set(Be,Ge),oe.uniforms=Fe.uniforms;const He=oe.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(He.clippingPlanes=ce.uniform),ft(A,Fe),oe.needsLights=ji(A),oe.lightsStateVersion=Ie,oe.needsLights&&(He.ambientLightColor.value=J.state.ambient,He.lightProbe.value=J.state.probe,He.directionalLights.value=J.state.directional,He.directionalLightShadows.value=J.state.directionalShadow,He.spotLights.value=J.state.spot,He.spotLightShadows.value=J.state.spotShadow,He.rectAreaLights.value=J.state.rectArea,He.ltc_1.value=J.state.rectAreaLTC1,He.ltc_2.value=J.state.rectAreaLTC2,He.pointLights.value=J.state.point,He.pointLightShadows.value=J.state.pointShadow,He.hemisphereLights.value=J.state.hemi,He.directionalShadowMap.value=J.state.directionalShadowMap,He.directionalShadowMatrix.value=J.state.directionalShadowMatrix,He.spotShadowMap.value=J.state.spotShadowMap,He.spotLightMatrix.value=J.state.spotLightMatrix,He.spotLightMap.value=J.state.spotLightMap,He.pointShadowMap.value=J.state.pointShadowMap,He.pointShadowMatrix.value=J.state.pointShadowMatrix),oe.currentProgram=Ge,oe.uniformsList=null,Ge}function Vt(A){if(A.uniformsList===null){const Y=A.currentProgram.getUniforms();A.uniformsList=fs.seqWithValue(Y.seq,A.uniforms)}return A.uniformsList}function ft(A,Y){const re=Se.get(A);re.outputColorSpace=Y.outputColorSpace,re.batching=Y.batching,re.batchingColor=Y.batchingColor,re.instancing=Y.instancing,re.instancingColor=Y.instancingColor,re.instancingMorph=Y.instancingMorph,re.skinning=Y.skinning,re.morphTargets=Y.morphTargets,re.morphNormals=Y.morphNormals,re.morphColors=Y.morphColors,re.morphTargetsCount=Y.morphTargetsCount,re.numClippingPlanes=Y.numClippingPlanes,re.numIntersection=Y.numClipIntersection,re.vertexAlphas=Y.vertexAlphas,re.vertexTangents=Y.vertexTangents,re.toneMapping=Y.toneMapping}function cn(A,Y,re,oe,J){Y.isScene!==!0&&(Y=ae),de.resetTextureUnits();const Ee=Y.fog,Ie=oe.isMeshStandardMaterial?Y.environment:null,Fe=w===null?_.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:Bn,Be=(oe.isMeshStandardMaterial?R:Ce).get(oe.envMap||Ie),ve=oe.vertexColors===!0&&!!re.attributes.color&&re.attributes.color.itemSize===4,Ge=!!re.attributes.tangent&&(!!oe.normalMap||oe.anisotropy>0),He=!!re.morphAttributes.position,Ze=!!re.morphAttributes.normal,rt=!!re.morphAttributes.color;let st=Fn;oe.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(st=_.toneMapping);const vt=re.morphAttributes.position||re.morphAttributes.normal||re.morphAttributes.color,Qe=vt!==void 0?vt.length:0,ze=Se.get(oe),pt=p.state.lights;if(O===!0&&(k===!0||A!==b)){const St=A===b&&oe.id===L;ce.setState(oe,A,St)}let et=!1;oe.version===ze.__version?(ze.needsLights&&ze.lightsStateVersion!==pt.state.version||ze.outputColorSpace!==Fe||J.isBatchedMesh&&ze.batching===!1||!J.isBatchedMesh&&ze.batching===!0||J.isBatchedMesh&&ze.batchingColor===!0&&J.colorTexture===null||J.isBatchedMesh&&ze.batchingColor===!1&&J.colorTexture!==null||J.isInstancedMesh&&ze.instancing===!1||!J.isInstancedMesh&&ze.instancing===!0||J.isSkinnedMesh&&ze.skinning===!1||!J.isSkinnedMesh&&ze.skinning===!0||J.isInstancedMesh&&ze.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&ze.instancingColor===!1&&J.instanceColor!==null||J.isInstancedMesh&&ze.instancingMorph===!0&&J.morphTexture===null||J.isInstancedMesh&&ze.instancingMorph===!1&&J.morphTexture!==null||ze.envMap!==Be||oe.fog===!0&&ze.fog!==Ee||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==ce.numPlanes||ze.numIntersection!==ce.numIntersection)||ze.vertexAlphas!==ve||ze.vertexTangents!==Ge||ze.morphTargets!==He||ze.morphNormals!==Ze||ze.morphColors!==rt||ze.toneMapping!==st||ze.morphTargetsCount!==Qe)&&(et=!0):(et=!0,ze.__version=oe.version);let Wt=ze.currentProgram;et===!0&&(Wt=Ht(oe,Y,J));let Mn=!1,tn=!1,hn=!1;const at=Wt.getUniforms(),At=ze.uniforms;if(fe.useProgram(Wt.program)&&(Mn=!0,tn=!0,hn=!0),oe.id!==L&&(L=oe.id,tn=!0),Mn||b!==A){at.setValue(D,"projectionMatrix",A.projectionMatrix),at.setValue(D,"viewMatrix",A.matrixWorldInverse);const St=at.map.cameraPosition;St!==void 0&&St.setValue(D,G.setFromMatrixPosition(A.matrixWorld)),Le.logarithmicDepthBuffer&&at.setValue(D,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(oe.isMeshPhongMaterial||oe.isMeshToonMaterial||oe.isMeshLambertMaterial||oe.isMeshBasicMaterial||oe.isMeshStandardMaterial||oe.isShaderMaterial)&&at.setValue(D,"isOrthographic",A.isOrthographicCamera===!0),b!==A&&(b=A,tn=!0,hn=!0)}if(J.isSkinnedMesh){at.setOptional(D,J,"bindMatrix"),at.setOptional(D,J,"bindMatrixInverse");const St=J.skeleton;St&&(St.boneTexture===null&&St.computeBoneTexture(),at.setValue(D,"boneTexture",St.boneTexture,de))}J.isBatchedMesh&&(at.setOptional(D,J,"batchingTexture"),at.setValue(D,"batchingTexture",J._matricesTexture,de),at.setOptional(D,J,"batchingColorTexture"),J._colorsTexture!==null&&at.setValue(D,"batchingColorTexture",J._colorsTexture,de));const zn=re.morphAttributes;if((zn.position!==void 0||zn.normal!==void 0||zn.color!==void 0)&&Me.update(J,re,Wt),(tn||ze.receiveShadow!==J.receiveShadow)&&(ze.receiveShadow=J.receiveShadow,at.setValue(D,"receiveShadow",J.receiveShadow)),oe.isMeshGouraudMaterial&&oe.envMap!==null&&(At.envMap.value=Be,At.flipEnvMap.value=Be.isCubeTexture&&Be.isRenderTargetTexture===!1?-1:1),oe.isMeshStandardMaterial&&oe.envMap===null&&Y.environment!==null&&(At.envMapIntensity.value=Y.environmentIntensity),tn&&(at.setValue(D,"toneMappingExposure",_.toneMappingExposure),ze.needsLights&&Er(At,hn),Ee&&oe.fog===!0&&Q.refreshFogUniforms(At,Ee),Q.refreshMaterialUniforms(At,oe,se,B,p.state.transmissionRenderTarget[A.id]),fs.upload(D,Vt(ze),At,de)),oe.isShaderMaterial&&oe.uniformsNeedUpdate===!0&&(fs.upload(D,Vt(ze),At,de),oe.uniformsNeedUpdate=!1),oe.isSpriteMaterial&&at.setValue(D,"center",J.center),at.setValue(D,"modelViewMatrix",J.modelViewMatrix),at.setValue(D,"normalMatrix",J.normalMatrix),at.setValue(D,"modelMatrix",J.matrixWorld),oe.isShaderMaterial||oe.isRawShaderMaterial){const St=oe.uniformsGroups;for(let Gn=0,Xt=St.length;Gn<Xt;Gn++){const wr=St[Gn];Ne.update(wr,Wt),Ne.bind(wr,Wt)}}return Wt}function Er(A,Y){A.ambientLightColor.needsUpdate=Y,A.lightProbe.needsUpdate=Y,A.directionalLights.needsUpdate=Y,A.directionalLightShadows.needsUpdate=Y,A.pointLights.needsUpdate=Y,A.pointLightShadows.needsUpdate=Y,A.spotLights.needsUpdate=Y,A.spotLightShadows.needsUpdate=Y,A.rectAreaLights.needsUpdate=Y,A.hemisphereLights.needsUpdate=Y}function ji(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(A,Y,re){Se.get(A.texture).__webglTexture=Y,Se.get(A.depthTexture).__webglTexture=re;const oe=Se.get(A);oe.__hasExternalTextures=!0,oe.__autoAllocateDepthBuffer=re===void 0,oe.__autoAllocateDepthBuffer||Pe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),oe.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,Y){const re=Se.get(A);re.__webglFramebuffer=Y,re.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(A,Y=0,re=0){w=A,C=Y,T=re;let oe=!0,J=null,Ee=!1,Ie=!1;if(A){const Be=Se.get(A);Be.__useDefaultFramebuffer!==void 0?(fe.bindFramebuffer(D.FRAMEBUFFER,null),oe=!1):Be.__webglFramebuffer===void 0?de.setupRenderTarget(A):Be.__hasExternalTextures&&de.rebindTextures(A,Se.get(A.texture).__webglTexture,Se.get(A.depthTexture).__webglTexture);const ve=A.texture;(ve.isData3DTexture||ve.isDataArrayTexture||ve.isCompressedArrayTexture)&&(Ie=!0);const Ge=Se.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Ge[Y])?J=Ge[Y][re]:J=Ge[Y],Ee=!0):A.samples>0&&de.useMultisampledRTT(A)===!1?J=Se.get(A).__webglMultisampledFramebuffer:Array.isArray(Ge)?J=Ge[re]:J=Ge,y.copy(A.viewport),U.copy(A.scissor),P=A.scissorTest}else y.copy(q).multiplyScalar(se).floor(),U.copy(F).multiplyScalar(se).floor(),P=V;if(fe.bindFramebuffer(D.FRAMEBUFFER,J)&&oe&&fe.drawBuffers(A,J),fe.viewport(y),fe.scissor(U),fe.setScissorTest(P),Ee){const Be=Se.get(A.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Be.__webglTexture,re)}else if(Ie){const Be=Se.get(A.texture),ve=Y||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Be.__webglTexture,re||0,ve)}L=-1},this.readRenderTargetPixels=function(A,Y,re,oe,J,Ee,Ie){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Fe=Se.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ie!==void 0&&(Fe=Fe[Ie]),Fe){fe.bindFramebuffer(D.FRAMEBUFFER,Fe);try{const Be=A.texture,ve=Be.format,Ge=Be.type;if(!Le.textureFormatReadable(ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Le.textureTypeReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=A.width-oe&&re>=0&&re<=A.height-J&&D.readPixels(Y,re,oe,J,me.convert(ve),me.convert(Ge),Ee)}finally{const Be=w!==null?Se.get(w).__webglFramebuffer:null;fe.bindFramebuffer(D.FRAMEBUFFER,Be)}}},this.readRenderTargetPixelsAsync=async function(A,Y,re,oe,J,Ee,Ie){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Fe=Se.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ie!==void 0&&(Fe=Fe[Ie]),Fe){fe.bindFramebuffer(D.FRAMEBUFFER,Fe);try{const Be=A.texture,ve=Be.format,Ge=Be.type;if(!Le.textureFormatReadable(ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Le.textureTypeReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Y>=0&&Y<=A.width-oe&&re>=0&&re<=A.height-J){const He=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,He),D.bufferData(D.PIXEL_PACK_BUFFER,Ee.byteLength,D.STREAM_READ),D.readPixels(Y,re,oe,J,me.convert(ve),me.convert(Ge),0),D.flush();const Ze=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);await Jd(D,Ze,4);try{D.bindBuffer(D.PIXEL_PACK_BUFFER,He),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,Ee)}finally{D.deleteBuffer(He),D.deleteSync(Ze)}return Ee}}finally{const Be=w!==null?Se.get(w).__webglFramebuffer:null;fe.bindFramebuffer(D.FRAMEBUFFER,Be)}}},this.copyFramebufferToTexture=function(A,Y=null,re=0){A.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Y=arguments[0]||null,A=arguments[1]);const oe=Math.pow(2,-re),J=Math.floor(A.image.width*oe),Ee=Math.floor(A.image.height*oe),Ie=Y!==null?Y.x:0,Fe=Y!==null?Y.y:0;de.setTexture2D(A,0),D.copyTexSubImage2D(D.TEXTURE_2D,re,0,0,Ie,Fe,J,Ee),fe.unbindTexture()},this.copyTextureToTexture=function(A,Y,re=null,oe=null,J=0){A.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),oe=arguments[0]||null,A=arguments[1],Y=arguments[2],J=arguments[3]||0,re=null);let Ee,Ie,Fe,Be,ve,Ge;re!==null?(Ee=re.max.x-re.min.x,Ie=re.max.y-re.min.y,Fe=re.min.x,Be=re.min.y):(Ee=A.image.width,Ie=A.image.height,Fe=0,Be=0),oe!==null?(ve=oe.x,Ge=oe.y):(ve=0,Ge=0);const He=me.convert(Y.format),Ze=me.convert(Y.type);de.setTexture2D(Y,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,Y.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,Y.unpackAlignment);const rt=D.getParameter(D.UNPACK_ROW_LENGTH),st=D.getParameter(D.UNPACK_IMAGE_HEIGHT),vt=D.getParameter(D.UNPACK_SKIP_PIXELS),Qe=D.getParameter(D.UNPACK_SKIP_ROWS),ze=D.getParameter(D.UNPACK_SKIP_IMAGES),pt=A.isCompressedTexture?A.mipmaps[J]:A.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,pt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,pt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Fe),D.pixelStorei(D.UNPACK_SKIP_ROWS,Be),A.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,J,ve,Ge,Ee,Ie,He,Ze,pt.data):A.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,J,ve,Ge,pt.width,pt.height,He,pt.data):D.texSubImage2D(D.TEXTURE_2D,J,ve,Ge,He,Ze,pt),D.pixelStorei(D.UNPACK_ROW_LENGTH,rt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,st),D.pixelStorei(D.UNPACK_SKIP_PIXELS,vt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Qe),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ze),J===0&&Y.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),fe.unbindTexture()},this.copyTextureToTexture3D=function(A,Y,re=null,oe=null,J=0){A.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),re=arguments[0]||null,oe=arguments[1]||null,A=arguments[2],Y=arguments[3],J=arguments[4]||0);let Ee,Ie,Fe,Be,ve,Ge,He,Ze,rt;const st=A.isCompressedTexture?A.mipmaps[J]:A.image;re!==null?(Ee=re.max.x-re.min.x,Ie=re.max.y-re.min.y,Fe=re.max.z-re.min.z,Be=re.min.x,ve=re.min.y,Ge=re.min.z):(Ee=st.width,Ie=st.height,Fe=st.depth,Be=0,ve=0,Ge=0),oe!==null?(He=oe.x,Ze=oe.y,rt=oe.z):(He=0,Ze=0,rt=0);const vt=me.convert(Y.format),Qe=me.convert(Y.type);let ze;if(Y.isData3DTexture)de.setTexture3D(Y,0),ze=D.TEXTURE_3D;else if(Y.isDataArrayTexture||Y.isCompressedArrayTexture)de.setTexture2DArray(Y,0),ze=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,Y.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,Y.unpackAlignment);const pt=D.getParameter(D.UNPACK_ROW_LENGTH),et=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Wt=D.getParameter(D.UNPACK_SKIP_PIXELS),Mn=D.getParameter(D.UNPACK_SKIP_ROWS),tn=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,st.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,st.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Be),D.pixelStorei(D.UNPACK_SKIP_ROWS,ve),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ge),A.isDataTexture||A.isData3DTexture?D.texSubImage3D(ze,J,He,Ze,rt,Ee,Ie,Fe,vt,Qe,st.data):Y.isCompressedArrayTexture?D.compressedTexSubImage3D(ze,J,He,Ze,rt,Ee,Ie,Fe,vt,st.data):D.texSubImage3D(ze,J,He,Ze,rt,Ee,Ie,Fe,vt,Qe,st),D.pixelStorei(D.UNPACK_ROW_LENGTH,pt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,et),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Wt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Mn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,tn),J===0&&Y.generateMipmaps&&D.generateMipmap(ze),fe.unbindTexture()},this.initRenderTarget=function(A){Se.get(A).__webglFramebuffer===void 0&&de.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?de.setTextureCube(A,0):A.isData3DTexture?de.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?de.setTexture2DArray(A,0):de.setTexture2D(A,0),fe.unbindTexture()},this.resetState=function(){C=0,T=0,w=null,fe.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===$o?"display-p3":"srgb",t.unpackColorSpace=nt.workingColorSpace===Cs?"display-p3":"srgb"}}class i_ extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class r_ extends Tt{constructor(e=null,t=1,n=1,i,r,o,a,l,c=Dt,h=Dt,d,u){super(null,o,a,l,c,h,i,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Go extends zt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ai=new it,$l=new it,is=[],ec=new Sn,s_=new it,ar=new Pt,lr=new si;class Mh extends Pt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Go(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,s_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Sn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ai),ec.copy(e.boundingBox).applyMatrix4(Ai),this.boundingBox.union(ec)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new si),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ai),lr.copy(e.boundingSphere).applyMatrix4(Ai),this.boundingSphere.union(lr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(ar.geometry=this.geometry,ar.material=this.material,ar.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),lr.copy(this.boundingSphere),lr.applyMatrix4(n),e.ray.intersectsSphere(lr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ai),$l.multiplyMatrices(n,Ai),ar.matrixWorld=$l,ar.raycast(e,is);for(let o=0,a=is.length;o<a;o++){const l=is[o];l.instanceId=r,l.object=this,t.push(l)}is.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Go(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new r_(new Float32Array(i*this.count),i,this.count,Jc,xn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Eh extends Vi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ve(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ws=new H,Ts=new H,tc=new it,cr=new Rs,rs=new si,Eo=new H,nc=new H;class o_ extends xt{constructor(e=new Gt,t=new Eh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)ws.fromBufferAttribute(t,i-1),Ts.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=ws.distanceTo(Ts);e.setAttribute("lineDistance",new yt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),rs.copy(n.boundingSphere),rs.applyMatrix4(i),rs.radius+=r,e.ray.intersectsSphere(rs)===!1)return;tc.copy(i).invert(),cr.copy(e.ray).applyMatrix4(tc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let v=f,p=g-1;v<p;v+=c){const m=h.getX(v),x=h.getX(v+1),_=ss(this,e,cr,l,m,x);_&&t.push(_)}if(this.isLineLoop){const v=h.getX(g-1),p=h.getX(f),m=ss(this,e,cr,l,v,p);m&&t.push(m)}}else{const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let v=f,p=g-1;v<p;v+=c){const m=ss(this,e,cr,l,v,v+1);m&&t.push(m)}if(this.isLineLoop){const v=ss(this,e,cr,l,g-1,f);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function ss(s,e,t,n,i,r){const o=s.geometry.attributes.position;if(ws.fromBufferAttribute(o,i),Ts.fromBufferAttribute(o,r),t.distanceSqToSegment(ws,Ts,Eo,nc)>n)return;Eo.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(Eo);if(!(l<e.near||l>e.far))return{distance:l,point:nc.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,object:s}}const ic=new H,rc=new H;class a_ extends o_{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)ic.fromBufferAttribute(t,i),rc.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+ic.distanceTo(rc);e.setAttribute("lineDistance",new yt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Us extends Gt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new yt(r,3)),this.setAttribute("normal",new yt(r.slice(),3)),this.setAttribute("uv",new yt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(x){const _=new H,M=new H,C=new H;for(let T=0;T<t.length;T+=3)f(t[T+0],_),f(t[T+1],M),f(t[T+2],C),l(_,M,C,x)}function l(x,_,M,C){const T=C+1,w=[];for(let L=0;L<=T;L++){w[L]=[];const b=x.clone().lerp(M,L/T),y=_.clone().lerp(M,L/T),U=T-L;for(let P=0;P<=U;P++)P===0&&L===T?w[L][P]=b:w[L][P]=b.clone().lerp(y,P/U)}for(let L=0;L<T;L++)for(let b=0;b<2*(T-L)-1;b++){const y=Math.floor(b/2);b%2===0?(u(w[L][y+1]),u(w[L+1][y]),u(w[L][y])):(u(w[L][y+1]),u(w[L+1][y+1]),u(w[L+1][y]))}}function c(x){const _=new H;for(let M=0;M<r.length;M+=3)_.x=r[M+0],_.y=r[M+1],_.z=r[M+2],_.normalize().multiplyScalar(x),r[M+0]=_.x,r[M+1]=_.y,r[M+2]=_.z}function h(){const x=new H;for(let _=0;_<r.length;_+=3){x.x=r[_+0],x.y=r[_+1],x.z=r[_+2];const M=p(x)/2/Math.PI+.5,C=m(x)/Math.PI+.5;o.push(M,1-C)}g(),d()}function d(){for(let x=0;x<o.length;x+=6){const _=o[x+0],M=o[x+2],C=o[x+4],T=Math.max(_,M,C),w=Math.min(_,M,C);T>.9&&w<.1&&(_<.2&&(o[x+0]+=1),M<.2&&(o[x+2]+=1),C<.2&&(o[x+4]+=1))}}function u(x){r.push(x.x,x.y,x.z)}function f(x,_){const M=x*3;_.x=e[M+0],_.y=e[M+1],_.z=e[M+2]}function g(){const x=new H,_=new H,M=new H,C=new H,T=new Oe,w=new Oe,L=new Oe;for(let b=0,y=0;b<r.length;b+=9,y+=6){x.set(r[b+0],r[b+1],r[b+2]),_.set(r[b+3],r[b+4],r[b+5]),M.set(r[b+6],r[b+7],r[b+8]),T.set(o[y+0],o[y+1]),w.set(o[y+2],o[y+3]),L.set(o[y+4],o[y+5]),C.copy(x).add(_).add(M).divideScalar(3);const U=p(C);v(T,y+0,x,U),v(w,y+2,_,U),v(L,y+4,M,U)}}function v(x,_,M,C){C<0&&x.x===1&&(o[_]=x.x-1),M.x===0&&M.z===0&&(o[_]=C/2/Math.PI+.5)}function p(x){return Math.atan2(x.z,-x.x)}function m(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Us(e.vertices,e.indices,e.radius,e.details)}}class ra extends Us{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ra(e.radius,e.detail)}}class Ds extends Gt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new H,u=new H,f=[],g=[],v=[],p=[];for(let m=0;m<=n;m++){const x=[],_=m/n;let M=0;m===0&&o===0?M=.5/t:m===n&&l===Math.PI&&(M=-.5/t);for(let C=0;C<=t;C++){const T=C/t;d.x=-e*Math.cos(i+T*r)*Math.sin(o+_*a),d.y=e*Math.cos(o+_*a),d.z=e*Math.sin(i+T*r)*Math.sin(o+_*a),g.push(d.x,d.y,d.z),u.copy(d).normalize(),v.push(u.x,u.y,u.z),p.push(T+M,1-_),x.push(c++)}h.push(x)}for(let m=0;m<n;m++)for(let x=0;x<t;x++){const _=h[m][x+1],M=h[m][x],C=h[m+1][x],T=h[m+1][x+1];(m!==0||o>0)&&f.push(_,M,T),(m!==n-1||l<Math.PI)&&f.push(M,C,T)}this.setIndex(f),this.setAttribute("position",new yt(g,3)),this.setAttribute("normal",new yt(v,3)),this.setAttribute("uv",new yt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ds(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class sa extends Us{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new sa(e.radius,e.detail)}}class l_ extends Vi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ve(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nh,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class wh extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ve(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const wo=new it,sc=new H,oc=new H;class c_{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Oe(512,512),this.map=null,this.mapPass=null,this.matrix=new it,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new na,this._frameExtents=new Oe(1,1),this._viewportCount=1,this._viewports=[new ht(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;sc.setFromMatrixPosition(e.matrixWorld),t.position.copy(sc),oc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(oc),t.updateMatrixWorld(),wo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(wo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class h_ extends c_{constructor(){super(new Ps(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class u_ extends wh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new h_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class d_ extends wh{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class f_ extends Gt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class Th{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=ac(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=ac();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function ac(){return(typeof performance>"u"?Date:performance).now()}const lc=new it;class p_{constructor(e,t,n=0,i=1/0){this.ray=new Rs(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new ta,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return lc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(lc),this}intersectObject(e,t=!0,n=[]){return Ho(e,this,n,t),n.sort(cc),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Ho(e[i],this,n,t);return n.sort(cc),n}}function cc(s,e){return s.distance-e.distance}function Ho(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let o=0,a=r.length;o<a;o++)Ho(r[o],e,t,!0)}}class Vo{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(wt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Qo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Qo);function m_(){const s=document.activeElement;if(!s)return!1;const e=s.tagName;return e==="INPUT"||e==="TEXTAREA"||e==="SELECT"||s.isContentEditable}const os=.06,as=.92,hr=40,hc=.05,g_=.08;class v_{constructor(e,t,{is2d:n=!1,target:i=window,hasFocus:r=()=>!0,onCenter:o=null}={}){this._spherical=new Vo,this._offset=new H,this._right=new H,this._up=new H,this._delta=new H,this.hasFocus=r,this.onCenter=o,this.setCameraControls(e,t,n),i.addEventListener("keydown",a=>{m_()||this.hasFocus()&&this.handleKey(a.code,a.shiftKey)&&a.preventDefault()})}setCameraControls(e,t,n=!1){this.camera=e,this.controls=t,this.is2d=n,this.home={position:e.position.clone(),target:t.target.clone(),zoom:e.zoom}}handleKey(e,t=!1){if(t)switch(e){case"KeyW":return this._panView(0,1),!0;case"KeyS":return this._panView(0,-1),!0;case"KeyA":return this._panView(-1,0),!0;case"KeyD":return this._panView(1,0),!0}if(this.is2d)switch(e){case"KeyW":return this._pan(0,hr),!0;case"KeyS":return this._pan(0,-hr),!0;case"KeyA":return this._pan(-hr,0),!0;case"KeyD":return this._pan(hr,0),!0;case"KeyQ":return this._zoom(as),!0;case"KeyE":return this._zoom(1/as),!0;case"Space":return this.center(),!0;case"KeyR":return this.reset(),!0;default:return!1}switch(e){case"KeyW":return this._orbit(0,-os),!0;case"KeyS":return this._orbit(0,os),!0;case"KeyA":return this._orbit(os,0),!0;case"KeyD":return this._orbit(-os,0),!0;case"KeyQ":return this._zoom(as),!0;case"KeyE":return this._zoom(1/as),!0;case"Space":return this.center(),!0;case"KeyR":return this.reset(),!0;default:return!1}}center(){this.onCenter&&this.onCenter()||this.reset()}_orbit(e,t){this._offset.copy(this.camera.position).sub(this.controls.target),this._spherical.setFromVector3(this._offset),this._spherical.theta+=e,this._spherical.phi=Math.min(Math.PI-hc,Math.max(hc,this._spherical.phi+t)),this._offset.setFromSpherical(this._spherical),this.camera.position.copy(this.controls.target).add(this._offset),this.camera.lookAt(this.controls.target),this._changed()}_zoom(e){this.is2d?(this.camera.zoom=Math.min(20,Math.max(.05,this.camera.zoom/e)),this.camera.updateProjectionMatrix()):(this._offset.copy(this.camera.position).sub(this.controls.target),this._offset.multiplyScalar(e),this.camera.position.copy(this.controls.target).add(this._offset)),this._changed()}_panView(e,t){const n=this.is2d?hr/(this.camera.zoom||1):this.camera.position.distanceTo(this.controls.target)*g_;this._right.setFromMatrixColumn(this.camera.matrix,0).multiplyScalar(e*n),this._up.setFromMatrixColumn(this.camera.matrix,1).multiplyScalar(t*n),this._delta.copy(this._right).add(this._up),this.camera.position.add(this._delta),this.controls.target.add(this._delta),this._changed()}_pan(e,t){this.camera.position.x+=e,this.camera.position.y+=t,this.controls.target.x+=e,this.controls.target.y+=t,this._changed()}reset(){this.camera.position.copy(this.home.position),this.controls.target.copy(this.home.target),this.camera.zoom=this.home.zoom,this.camera.updateProjectionMatrix(),this.camera.lookAt(this.controls.target),this._changed()}_changed(){this.controls.update(),this.controls.dispatchEvent({type:"change"})}}const __=5;function ps(s,e={}){return{type:"event",event:s,payload:e}}function x_(s,e,t,n,i=__){return Math.hypot(t-s,n-e)<i}class y_{constructor(e,t,n,{requestFrame:i=a=>requestAnimationFrame(a),onNodeClick:r=()=>{},onBackgroundClick:o=()=>{}}={}){this.pickFn=t,this.sendFn=n,this.requestFrame=i,this.onNodeClick=r,this.onBackgroundClick=o,this.hoverId=null,this.pointerDown=null,this.pendingMove=null,e.addEventListener("pointermove",a=>this._onMove(a)),e.addEventListener("pointerdown",a=>{this.pointerDown={x:a.clientX,y:a.clientY}}),e.addEventListener("pointerup",a=>this._onUp(a))}_onMove(e){const t=this.pendingMove===null;this.pendingMove={x:e.clientX,y:e.clientY},t&&this.requestFrame(()=>{const n=this.pendingMove;this.pendingMove=null,this._hover(n.x,n.y)})}_hover(e,t){const n=this.pickFn(e,t);n!==this.hoverId&&(this.hoverId=n,this.sendFn(ps("node_hover",{node_id:n})))}_onUp(e){if(!this.pointerDown)return;const{x:t,y:n}=this.pointerDown;if(this.pointerDown=null,!x_(t,n,e.clientX,e.clientY))return;const i=this.pickFn(e.clientX,e.clientY);i!==null?(this.sendFn(ps("node_click",{node_id:i})),this.onNodeClick(i)):(this.sendFn(ps("background_click")),this.onBackgroundClick())}}function uc(s){const e=s.meta&&s.meta.skupina;return e==null?void 0:String(e)}class b_{constructor(e){this.ids=[],this.positions=new Float32Array(0),this.worker=new Worker(new URL("/assets/worker-DFcoz-zp.js",import.meta.url),{type:"module"}),this.worker.onmessage=({data:t})=>{t.type==="index"?this.ids=t.ids:t.type==="tick"&&(this.positions=t.positions)},this._unsubscribe=e.subscribe(t=>this._onStoreEvent(e,t))}setPaused(e){this.worker.postMessage({type:e?"pause":"resume"})}setDimensions(e){this.worker.postMessage({type:"set_dimensions",dimensions:e})}setClusters(e){this.worker.postMessage({type:"set_clusters",clusters:!!e})}terminate(){this._unsubscribe(),this.worker.terminate()}_onStoreEvent(e,t){if(t.kind==="init")this.worker.postMessage({type:"init",dimensions:e.config.dimensions,nodes:[...e.nodes.values()].map(n=>({id:n.id,mass:Number(n.meta&&n.meta.mass),group:uc(n)})),links:[...e.edges.values()].map(n=>({source:n.source,target:n.target,weight:Number(n.meta&&n.meta.weight)}))});else if(t.kind==="patch"){const n=t.patch;this.worker.postMessage({type:"patch",addNodes:n.add_nodes.map(i=>({id:i.id,mass:Number(i.meta&&i.meta.mass),group:uc(i)})),removeNodes:n.remove_nodes,addLinks:n.add_edges.map(i=>({source:i.source,target:i.target,weight:Number(i.meta&&i.meta.weight)})),removeLinks:n.remove_edges})}}}const S_=2;class M_{constructor(e,{threshold:t=30,holdSeconds:n=3,smoothing:i=2}={}){this.onDegrade=e,this.threshold=t,this.holdSeconds=n,this.smoothing=i,this.avgFps=null,this.below=0,this.steps=0}frame(e){if(e<=0||this.steps>=S_)return;const t=1/e;this.avgFps=this.avgFps===null?t:this.avgFps+(t-this.avgFps)*Math.min(1,e*this.smoothing),this.avgFps<this.threshold?(this.below+=e,this.below>=this.holdSeconds&&(this.below=0,this.steps+=1,this.onDegrade(this.steps))):this.below=0}}const dc={type:"change"},To={type:"start"},fc={type:"end"},ls=new Rs,pc=new Dn,E_=Math.cos(70*Bo.DEG2RAD);class mc extends ri{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new H,this.cursor=new H,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:_n.ROTATE,MIDDLE:_n.DOLLY,RIGHT:_n.PAN},this.touches={ONE:Un.ROTATE,TWO:Un.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(E){E.addEventListener("keydown",ce),this._domElementKeyEvents=E},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ce),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(dc),n.update(),r=i.NONE},this.update=function(){const E=new H,$=new ii().setFromUnitVectors(e.up,new H(0,1,0)),z=$.clone().invert(),ee=new H,ge=new ii,Ae=new H,Re=2*Math.PI;return function(Xe=null){const De=n.object.position;E.copy(De).sub(n.target),E.applyQuaternion($),a.setFromVector3(E),n.autoRotate&&r===i.NONE&&P(y(Xe)),n.enableDamping?(a.theta+=l.theta*n.dampingFactor,a.phi+=l.phi*n.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let Ye=n.minAzimuthAngle,Je=n.maxAzimuthAngle;isFinite(Ye)&&isFinite(Je)&&(Ye<-Math.PI?Ye+=Re:Ye>Math.PI&&(Ye-=Re),Je<-Math.PI?Je+=Re:Je>Math.PI&&(Je-=Re),Ye<=Je?a.theta=Math.max(Ye,Math.min(Je,a.theta)):a.theta=a.theta>(Ye+Je)/2?Math.max(Ye,a.theta):Math.min(Je,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor);let tt=!1;if(n.zoomToCursor&&T||n.object.isOrthographicCamera)a.radius=q(a.radius);else{const $e=a.radius;a.radius=q(a.radius*c),tt=$e!=a.radius}if(E.setFromSpherical(a),E.applyQuaternion(z),De.copy(n.target).add(E),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),h.set(0,0,0)),n.zoomToCursor&&T){let $e=null;if(n.object.isPerspectiveCamera){const lt=E.length();$e=q(lt*c);const bt=lt-$e;n.object.position.addScaledVector(M,bt),n.object.updateMatrixWorld(),tt=!!bt}else if(n.object.isOrthographicCamera){const lt=new H(C.x,C.y,0);lt.unproject(n.object);const bt=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),tt=bt!==n.object.zoom;const gt=new H(C.x,C.y,0);gt.unproject(n.object),n.object.position.sub(gt).add(lt),n.object.updateMatrixWorld(),$e=E.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;$e!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar($e).add(n.object.position):(ls.origin.copy(n.object.position),ls.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(ls.direction))<E_?e.lookAt(n.target):(pc.setFromNormalAndCoplanarPoint(n.object.up,n.target),ls.intersectPlane(pc,n.target))))}else if(n.object.isOrthographicCamera){const $e=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),$e!==n.object.zoom&&(n.object.updateProjectionMatrix(),tt=!0)}return c=1,T=!1,tt||ee.distanceToSquared(n.object.position)>o||8*(1-ge.dot(n.object.quaternion))>o||Ae.distanceToSquared(n.target)>o?(n.dispatchEvent(dc),ee.copy(n.object.position),ge.copy(n.object.quaternion),Ae.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Me),n.domElement.removeEventListener("pointerdown",Ce),n.domElement.removeEventListener("pointercancel",S),n.domElement.removeEventListener("wheel",ie),n.domElement.removeEventListener("pointermove",R),n.domElement.removeEventListener("pointerup",S),n.domElement.getRootNode().removeEventListener("keydown",we,{capture:!0}),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ce),n._domElementKeyEvents=null)};const n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const o=1e-6,a=new Vo,l=new Vo;let c=1;const h=new H,d=new Oe,u=new Oe,f=new Oe,g=new Oe,v=new Oe,p=new Oe,m=new Oe,x=new Oe,_=new Oe,M=new H,C=new Oe;let T=!1;const w=[],L={};let b=!1;function y(E){return E!==null?2*Math.PI/60*n.autoRotateSpeed*E:2*Math.PI/60/60*n.autoRotateSpeed}function U(E){const $=Math.abs(E*.01);return Math.pow(.95,n.zoomSpeed*$)}function P(E){l.theta-=E}function I(E){l.phi-=E}const N=function(){const E=new H;return function(z,ee){E.setFromMatrixColumn(ee,0),E.multiplyScalar(-z),h.add(E)}}(),W=function(){const E=new H;return function(z,ee){n.screenSpacePanning===!0?E.setFromMatrixColumn(ee,1):(E.setFromMatrixColumn(ee,0),E.crossVectors(n.object.up,E)),E.multiplyScalar(z),h.add(E)}}(),B=function(){const E=new H;return function(z,ee){const ge=n.domElement;if(n.object.isPerspectiveCamera){const Ae=n.object.position;E.copy(Ae).sub(n.target);let Re=E.length();Re*=Math.tan(n.object.fov/2*Math.PI/180),N(2*z*Re/ge.clientHeight,n.object.matrix),W(2*ee*Re/ge.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(N(z*(n.object.right-n.object.left)/n.object.zoom/ge.clientWidth,n.object.matrix),W(ee*(n.object.top-n.object.bottom)/n.object.zoom/ge.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function se(E){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=E:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function j(E){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=E:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function K(E,$){if(!n.zoomToCursor)return;T=!0;const z=n.domElement.getBoundingClientRect(),ee=E-z.left,ge=$-z.top,Ae=z.width,Re=z.height;C.x=ee/Ae*2-1,C.y=-(ge/Re)*2+1,M.set(C.x,C.y,1).unproject(n.object).sub(n.object.position).normalize()}function q(E){return Math.max(n.minDistance,Math.min(n.maxDistance,E))}function F(E){d.set(E.clientX,E.clientY)}function V(E){K(E.clientX,E.clientX),m.set(E.clientX,E.clientY)}function ne(E){g.set(E.clientX,E.clientY)}function O(E){u.set(E.clientX,E.clientY),f.subVectors(u,d).multiplyScalar(n.rotateSpeed);const $=n.domElement;P(2*Math.PI*f.x/$.clientHeight),I(2*Math.PI*f.y/$.clientHeight),d.copy(u),n.update()}function k(E){x.set(E.clientX,E.clientY),_.subVectors(x,m),_.y>0?se(U(_.y)):_.y<0&&j(U(_.y)),m.copy(x),n.update()}function te(E){v.set(E.clientX,E.clientY),p.subVectors(v,g).multiplyScalar(n.panSpeed),B(p.x,p.y),g.copy(v),n.update()}function G(E){K(E.clientX,E.clientY),E.deltaY<0?j(U(E.deltaY)):E.deltaY>0&&se(U(E.deltaY)),n.update()}function ae(E){let $=!1;switch(E.code){case n.keys.UP:E.ctrlKey||E.metaKey||E.shiftKey?I(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(0,n.keyPanSpeed),$=!0;break;case n.keys.BOTTOM:E.ctrlKey||E.metaKey||E.shiftKey?I(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(0,-n.keyPanSpeed),$=!0;break;case n.keys.LEFT:E.ctrlKey||E.metaKey||E.shiftKey?P(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(n.keyPanSpeed,0),$=!0;break;case n.keys.RIGHT:E.ctrlKey||E.metaKey||E.shiftKey?P(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(-n.keyPanSpeed,0),$=!0;break}$&&(E.preventDefault(),n.update())}function pe(E){if(w.length===1)d.set(E.pageX,E.pageY);else{const $=Ne(E),z=.5*(E.pageX+$.x),ee=.5*(E.pageY+$.y);d.set(z,ee)}}function _e(E){if(w.length===1)g.set(E.pageX,E.pageY);else{const $=Ne(E),z=.5*(E.pageX+$.x),ee=.5*(E.pageY+$.y);g.set(z,ee)}}function D(E){const $=Ne(E),z=E.pageX-$.x,ee=E.pageY-$.y,ge=Math.sqrt(z*z+ee*ee);m.set(0,ge)}function he(E){n.enableZoom&&D(E),n.enablePan&&_e(E)}function Pe(E){n.enableZoom&&D(E),n.enableRotate&&pe(E)}function Le(E){if(w.length==1)u.set(E.pageX,E.pageY);else{const z=Ne(E),ee=.5*(E.pageX+z.x),ge=.5*(E.pageY+z.y);u.set(ee,ge)}f.subVectors(u,d).multiplyScalar(n.rotateSpeed);const $=n.domElement;P(2*Math.PI*f.x/$.clientHeight),I(2*Math.PI*f.y/$.clientHeight),d.copy(u)}function fe(E){if(w.length===1)v.set(E.pageX,E.pageY);else{const $=Ne(E),z=.5*(E.pageX+$.x),ee=.5*(E.pageY+$.y);v.set(z,ee)}p.subVectors(v,g).multiplyScalar(n.panSpeed),B(p.x,p.y),g.copy(v)}function ye(E){const $=Ne(E),z=E.pageX-$.x,ee=E.pageY-$.y,ge=Math.sqrt(z*z+ee*ee);x.set(0,ge),_.set(0,Math.pow(x.y/m.y,n.zoomSpeed)),se(_.y),m.copy(x);const Ae=(E.pageX+$.x)*.5,Re=(E.pageY+$.y)*.5;K(Ae,Re)}function Se(E){n.enableZoom&&ye(E),n.enablePan&&fe(E)}function de(E){n.enableZoom&&ye(E),n.enableRotate&&Le(E)}function Ce(E){n.enabled!==!1&&(w.length===0&&(n.domElement.setPointerCapture(E.pointerId),n.domElement.addEventListener("pointermove",R),n.domElement.addEventListener("pointerup",S)),!me(E)&&(ke(E),E.pointerType==="touch"?be(E):X(E)))}function R(E){n.enabled!==!1&&(E.pointerType==="touch"?ue(E):Z(E))}function S(E){switch(Te(E),w.length){case 0:n.domElement.releasePointerCapture(E.pointerId),n.domElement.removeEventListener("pointermove",R),n.domElement.removeEventListener("pointerup",S),n.dispatchEvent(fc),r=i.NONE;break;case 1:const $=w[0],z=L[$];be({pointerId:$,pageX:z.x,pageY:z.y});break}}function X(E){let $;switch(E.button){case 0:$=n.mouseButtons.LEFT;break;case 1:$=n.mouseButtons.MIDDLE;break;case 2:$=n.mouseButtons.RIGHT;break;default:$=-1}switch($){case _n.DOLLY:if(n.enableZoom===!1)return;V(E),r=i.DOLLY;break;case _n.ROTATE:if(E.ctrlKey||E.metaKey||E.shiftKey){if(n.enablePan===!1)return;ne(E),r=i.PAN}else{if(n.enableRotate===!1)return;F(E),r=i.ROTATE}break;case _n.PAN:if(E.ctrlKey||E.metaKey||E.shiftKey){if(n.enableRotate===!1)return;F(E),r=i.ROTATE}else{if(n.enablePan===!1)return;ne(E),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(To)}function Z(E){switch(r){case i.ROTATE:if(n.enableRotate===!1)return;O(E);break;case i.DOLLY:if(n.enableZoom===!1)return;k(E);break;case i.PAN:if(n.enablePan===!1)return;te(E);break}}function ie(E){n.enabled===!1||n.enableZoom===!1||r!==i.NONE||(E.preventDefault(),n.dispatchEvent(To),G(Q(E)),n.dispatchEvent(fc))}function Q(E){const $=E.deltaMode,z={clientX:E.clientX,clientY:E.clientY,deltaY:E.deltaY};switch($){case 1:z.deltaY*=16;break;case 2:z.deltaY*=100;break}return E.ctrlKey&&!b&&(z.deltaY*=10),z}function we(E){E.key==="Control"&&(b=!0,n.domElement.getRootNode().addEventListener("keyup",le,{passive:!0,capture:!0}))}function le(E){E.key==="Control"&&(b=!1,n.domElement.getRootNode().removeEventListener("keyup",le,{passive:!0,capture:!0}))}function ce(E){n.enabled===!1||n.enablePan===!1||ae(E)}function be(E){switch(xe(E),w.length){case 1:switch(n.touches.ONE){case Un.ROTATE:if(n.enableRotate===!1)return;pe(E),r=i.TOUCH_ROTATE;break;case Un.PAN:if(n.enablePan===!1)return;_e(E),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(n.touches.TWO){case Un.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;he(E),r=i.TOUCH_DOLLY_PAN;break;case Un.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Pe(E),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(To)}function ue(E){switch(xe(E),r){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;Le(E),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;fe(E),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Se(E),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;de(E),n.update();break;default:r=i.NONE}}function Me(E){n.enabled!==!1&&E.preventDefault()}function ke(E){w.push(E.pointerId)}function Te(E){delete L[E.pointerId];for(let $=0;$<w.length;$++)if(w[$]==E.pointerId){w.splice($,1);return}}function me(E){for(let $=0;$<w.length;$++)if(w[$]==E.pointerId)return!0;return!1}function xe(E){let $=L[E.pointerId];$===void 0&&($=new Oe,L[E.pointerId]=$),$.set(E.pageX,E.pageY)}function Ne(E){const $=E.pointerId===w[0]?w[1]:w[0];return L[$]}n.domElement.addEventListener("contextmenu",Me),n.domElement.addEventListener("pointerdown",Ce),n.domElement.addEventListener("pointercancel",S),n.domElement.addEventListener("wheel",ie,{passive:!1}),n.domElement.getRootNode().addEventListener("keydown",we,{passive:!0,capture:!0}),this.update()}}const Ah={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Mr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const w_=new Ps(-1,1,1,-1,0,1);class T_ extends Gt{constructor(){super(),this.setAttribute("position",new yt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new yt([0,2,0,0,2,0],2))}}const A_=new T_;class Ch{constructor(e){this._mesh=new Pt(A_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,w_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class C_ extends Mr{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof It?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=br.clone(e.uniforms),this.material=new It({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Ch(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class gc extends Mr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class R_ extends Mr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class P_{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Oe);this._width=n.width,this._height=n.height,t=new en(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Nn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new C_(Ah),this.copyPass.material.blending=bn,this.clock=new Th}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}gc!==void 0&&(o instanceof gc?n=!0:o instanceof R_&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Oe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class L_ extends Mr{constructor(e,t,n=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ve}render(e,t,n){const i=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=i}}const U_={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ve(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class zi extends Mr{constructor(e,t,n,i){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new Oe(e.x,e.y):new Oe(256,256),this.clearColor=new Ve(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new en(r,o,{type:Nn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new en(r,o,{type:Nn});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new en(r,o,{type:Nn});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),o=Math.round(o/2)}const a=U_;this.highPassUniforms=br.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new It({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Oe(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new H(1,1,1),new H(1,1,1),new H(1,1,1),new H(1,1,1),new H(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Ah;this.copyUniforms=br.clone(h.uniforms),this.blendMaterial=new It({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:vs,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Ve,this.oldClearAlpha=1,this.basic=new Sr,this.fsQuad=new Ch(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new Oe(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=zi.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=zi.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new It({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Oe(.5,.5)},direction:{value:new Oe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}}zi.BlurDirectionX=new Oe(1,0);zi.BlurDirectionY=new Oe(0,1);function Wo(s){return s!==null&&typeof s=="object"&&!Array.isArray(s)}function Is(s,e){const t={...s};for(const[n,i]of Object.entries(e))t[n]=Wo(t[n])&&Wo(i)?Is(t[n],i):i;return t}const D_="#0057af",I_={bg:"#ffffff",fg:"#0057af",menuAttach:!0},F_={headerBg:"#ffffff",headerBgActive:"#ffffff",headerFg:"#0057af",headerFgActive:"#0057af",headerStripe:!0,gadget:"#0057af",bevel:"hard",bodyBg:"#0057af",bodyFg:"#ffffff",key:"#ff8800",border:"#ffffff",dockBg:"#dfe8f5",shadow:"0 2px 0 rgba(0,0,0,0.35)",backdropPattern:"flat",htmlAccent:"#ffffff",outputBg:"rgba(0,0,0,0.18)",terminalBg:"transparent",iconSet:"workbench-classic",font:"topaz-8"},N_={background:D_,screenBar:I_,window:F_},O_="#dadada",k_={bg:"#cfe1fb",fg:"#000000",menuAttach:!0},B_={headerBg:"#ffffff",headerBgActive:"#ffffff",headerFg:"#000000",headerFgActive:"#000000",headerStripe:!0,gadget:"#000000",border:"#000000",bevel:"hard",bodyBg:"#0055aa",bodyFg:"#ffffff",key:"#ff8800",dockBg:"#b8c6e8",shadow:"0 2px 0 rgba(0,0,0,0.35)",backdropPattern:"flat",outputBg:"rgba(0,0,0,0.10)",terminalBg:"transparent",iconSet:"workbench-classic",font:"topaz-8"},z_={background:O_,screenBar:k_,window:B_},oa={background:"#f4f5f7",palette:["#2f7fe8","#e8553a","#2fa84f","#8a4fe8","#e8a02f","#1fb3c4","#d44f9e","#5b6472"],node:{color:"#2f7fe8",size:1,shape:"sphere",emissive:"#000000",emissiveIntensity:0},edge:{color:"#9aa3af",opacity:.5},lights:{ambient:{color:"#ffffff",intensity:.7},directional:{color:"#ffffff",intensity:1.2}},label:{color:"#1f2430",size:6,halo:"#f4f5f7",budget:200},detailBox:{"--vb-detail-bg":"rgba(255,255,255,0.95)","--vb-detail-fg":"#1f2430","--vb-detail-key":"#667788","--vb-detail-shadow":"0 4px 16px rgba(0,0,0,0.18)","--vb-status-bg":"rgba(20,23,28,0.85)","--vb-status-fg":"#ffffff"},bloom:{enabled:!1,strength:.8,radius:.6,threshold:.15},window:{headerBg:"#d8dde6",headerFg:"#1f2430",gadget:"#5a6573",bodyBg:"rgba(255,255,255,0.97)",bodyFg:"#1f2430",key:"#667788",dockBg:"#c2c9d4",shadow:"0 6px 20px rgba(0,0,0,0.22)"},flow:{size:2.4,baseSpeed:220,color:"#2f7fe8",opacity:.85}},G_={background:"#0a0e1a",palette:["#28d7fe","#ff2a6d","#05ffa1","#b967ff","#ffd166","#01c8ee","#ff6e27","#e8f8ff"],node:{color:"#28d7fe",size:1,shape:"sphere",emissive:"#1b3a5c",emissiveIntensity:1.2},edge:{color:"#1f4f6e",opacity:.65},lights:{ambient:{color:"#314466",intensity:.9},directional:{color:"#9fd8ff",intensity:1.4}},label:{color:"#d7f4ff",size:6,halo:"#0a0e1a",budget:200},detailBox:{"--vb-detail-bg":"rgba(10,16,28,0.92)","--vb-detail-fg":"#d7f4ff","--vb-detail-key":"#5a7d9e","--vb-detail-shadow":"0 0 18px rgba(40,215,254,0.35)","--vb-status-bg":"rgba(40,215,254,0.15)","--vb-status-fg":"#d7f4ff"},bloom:{enabled:!0,strength:.9,radius:.7,threshold:.15},window:{headerBg:"rgba(40,215,254,0.18)",headerFg:"#d7f4ff",gadget:"#28d7fe",bodyBg:"rgba(10,16,28,0.94)",bodyFg:"#d7f4ff",key:"#5a7d9e",dockBg:"rgba(40,215,254,0.12)",shadow:"0 0 22px rgba(40,215,254,0.45)",outputBg:"rgba(255,255,255,0.05)"},flow:{size:3,baseSpeed:260,color:"#28d7fe",opacity:1}},H_=Is(oa,z_),V_=Is(oa,N_),ur={modern:oa,cyber:G_,"workbench-gray":H_,"workbench-amiga":V_};function Rh(s){return typeof s=="string"?ur[s]?ur[s]:(console.error(`viewbase: neznámé téma '${s}' – používám 'modern'`),ur.modern):Wo(s)?Is(ur.modern,s):(s!=null&&console.error("viewbase: theme musí být string nebo objekt – používám modern"),ur.modern)}function W_(s,e=document.documentElement){for(const[i,r]of Object.entries(s.detailBox))e.style.setProperty(i,r);const t=s.window;if(t){const i={"--vb-window-header-bg":t.headerBg,"--vb-window-header-fg":t.headerFg,"--vb-window-gadget":t.gadget,"--vb-window-body-bg":t.bodyBg,"--vb-window-body-fg":t.bodyFg,"--vb-window-key":t.key,"--vb-window-dock-bg":t.dockBg,"--vb-window-shadow":t.shadow,"--vb-window-border":t.border,"--vb-html-accent":t.htmlAccent??t.gadget,"--vb-window-output-bg":t.outputBg??"rgba(0,0,0,0.06)","--vb-terminal-bg":t.terminalBg??t.outputBg??"rgba(0,0,0,0.06)","--vb-terminal-caret":t.key??t.gadget??"auto","--vb-window-grip-bg":t.bevel==="hard"?t.headerBg??"#ffffff":"transparent","--vb-window-grip-fg":t.bevel==="hard"?t.headerFg??t.gadget:t.bodyFg??"#8a93a3","--vb-window-grip-border":t.bevel==="hard"?t.headerFg??t.gadget:"transparent","--vb-window-frame":t.bevel==="hard"?"1":"0"};for(const[r,o]of Object.entries(i))o!=null&&e.style.setProperty(r,o);e.style.setProperty("--vb-window-header-pattern",t.headerStripe?`repeating-linear-gradient(0deg, ${t.headerFg}22 0px, ${t.headerFg}22 1px, transparent 1px, transparent 4px)`:"none")}const n=s.screenBar;n&&(n.bg!=null&&e.style.setProperty("--vb-screenbar-bg",n.bg),n.fg!=null&&e.style.setProperty("--vb-screenbar-fg",n.fg))}function Ph(s,e,t){const n=s.type!=null&&e[s.type]||{};return{shape:n.shape??t.node.shape,color:s.meta.color??n.color??t.node.color,size:s.meta.size??n.size??t.node.size}}function X_(){var s=Object.create(null);function e(i,r){var o=i.id,a=i.name,l=i.dependencies;l===void 0&&(l=[]);var c=i.init;c===void 0&&(c=function(){});var h=i.getTransferables;if(h===void 0&&(h=null),!s[o])try{l=l.map(function(u){return u&&u.isWorkerModule&&(e(u,function(f){if(f instanceof Error)throw f}),u=s[u.id].value),u}),c=n("<"+a+">.init",c),h&&(h=n("<"+a+">.getTransferables",h));var d=null;typeof c=="function"?d=c.apply(void 0,l):console.error("worker module init function failed to rehydrate"),s[o]={id:o,value:d,getTransferables:h},r(d)}catch(u){u&&u.noLog||console.error(u),r(u)}}function t(i,r){var o,a=i.id,l=i.args;(!s[a]||typeof s[a].value!="function")&&r(new Error("Worker module "+a+": not found or its 'init' did not return a function"));try{var c=(o=s[a]).value.apply(o,l);c&&typeof c.then=="function"?c.then(h,function(d){return r(d instanceof Error?d:new Error(""+d))}):h(c)}catch(d){r(d)}function h(d){try{var u=s[a].getTransferables&&s[a].getTransferables(d);(!u||!Array.isArray(u)||!u.length)&&(u=void 0),r(d,u)}catch(f){console.error(f),r(f)}}}function n(i,r){var o=void 0;self.troikaDefine=function(l){return o=l};var a=URL.createObjectURL(new Blob(["/** "+i.replace(/\*/g,"")+` **/

troikaDefine(
`+r+`
)`],{type:"application/javascript"}));try{importScripts(a)}catch(l){console.error(l)}return URL.revokeObjectURL(a),delete self.troikaDefine,o}self.addEventListener("message",function(i){var r=i.data,o=r.messageId,a=r.action,l=r.data;try{a==="registerModule"&&e(l,function(c){c instanceof Error?postMessage({messageId:o,success:!1,error:c.message}):postMessage({messageId:o,success:!0,result:{isCallable:typeof c=="function"}})}),a==="callModule"&&t(l,function(c,h){c instanceof Error?postMessage({messageId:o,success:!1,error:c.message}):postMessage({messageId:o,success:!0,result:c},h||void 0)})}catch(c){postMessage({messageId:o,success:!1,error:c.stack})}})}function Y_(s){var e=function(){for(var t=[],n=arguments.length;n--;)t[n]=arguments[n];return e._getInitResult().then(function(i){if(typeof i=="function")return i.apply(void 0,t);throw new Error("Worker module function was called but `init` did not return a callable function")})};return e._getInitResult=function(){var t=s.dependencies,n=s.init;t=Array.isArray(t)?t.map(function(r){return r&&(r=r.onMainThread||r,r._getInitResult&&(r=r._getInitResult())),r}):[];var i=Promise.all(t).then(function(r){return n.apply(null,r)});return e._getInitResult=function(){return i},i},e}var Lh=function(){var s=!1;if(typeof window<"u"&&typeof window.document<"u")try{var e=new Worker(URL.createObjectURL(new Blob([""],{type:"application/javascript"})));e.terminate(),s=!0}catch(t){console.log("Troika createWorkerModule: web workers not allowed; falling back to main thread execution. Cause: ["+t.message+"]")}return Lh=function(){return s},s},j_=0,q_=0,Ao=!1,_r=Object.create(null),xr=Object.create(null),Xo=Object.create(null);function Yi(s){if((!s||typeof s.init!="function")&&!Ao)throw new Error("requires `options.init` function");var e=s.dependencies,t=s.init,n=s.getTransferables,i=s.workerId,r=Y_(s);i==null&&(i="#default");var o="workerModule"+ ++j_,a=s.name||o,l=null;e=e&&e.map(function(h){return typeof h=="function"&&!h.workerModuleData&&(Ao=!0,h=Yi({workerId:i,name:"<"+a+"> function dependency: "+h.name,init:`function(){return (
`+ms(h)+`
)}`}),Ao=!1),h&&h.workerModuleData&&(h=h.workerModuleData),h});function c(){for(var h=[],d=arguments.length;d--;)h[d]=arguments[d];if(!Lh())return r.apply(void 0,h);if(!l){l=vc(i,"registerModule",c.workerModuleData);var u=function(){l=null,xr[i].delete(u)};(xr[i]||(xr[i]=new Set)).add(u)}return l.then(function(f){var g=f.isCallable;if(g)return vc(i,"callModule",{id:o,args:h});throw new Error("Worker module function was called but `init` did not return a callable function")})}return c.workerModuleData={isWorkerModule:!0,id:o,name:a,dependencies:e,init:ms(t),getTransferables:n&&ms(n)},c.onMainThread=r,c}function K_(s){xr[s]&&xr[s].forEach(function(e){e()}),_r[s]&&(_r[s].terminate(),delete _r[s])}function ms(s){var e=s.toString();return!/^function/.test(e)&&/^\w+\s*\(/.test(e)&&(e="function "+e),e}function Z_(s){var e=_r[s];if(!e){var t=ms(X_);e=_r[s]=new Worker(URL.createObjectURL(new Blob(["/** Worker Module Bootstrap: "+s.replace(/\*/g,"")+` **/

;(`+t+")()"],{type:"application/javascript"}))),e.onmessage=function(n){var i=n.data,r=i.messageId,o=Xo[r];if(!o)throw new Error("WorkerModule response with empty or unknown messageId");delete Xo[r],o(i)}}return e}function vc(s,e,t){return new Promise(function(n,i){var r=++q_;Xo[r]=function(o){o.success?n(o.result):i(new Error("Error in worker "+e+" call: "+o.error))},Z_(s).postMessage({messageId:r,action:e,data:t})})}function Uh(){var s=function(e){function t(K,q,F,V,ne,O,k,te){var G=1-k;te.x=G*G*K+2*G*k*F+k*k*ne,te.y=G*G*q+2*G*k*V+k*k*O}function n(K,q,F,V,ne,O,k,te,G,ae){var pe=1-G;ae.x=pe*pe*pe*K+3*pe*pe*G*F+3*pe*G*G*ne+G*G*G*k,ae.y=pe*pe*pe*q+3*pe*pe*G*V+3*pe*G*G*O+G*G*G*te}function i(K,q){for(var F=/([MLQCZ])([^MLQCZ]*)/g,V,ne,O,k,te;V=F.exec(K);){var G=V[2].replace(/^\s*|\s*$/g,"").split(/[,\s]+/).map(function(ae){return parseFloat(ae)});switch(V[1]){case"M":k=ne=G[0],te=O=G[1];break;case"L":(G[0]!==k||G[1]!==te)&&q("L",k,te,k=G[0],te=G[1]);break;case"Q":{q("Q",k,te,k=G[2],te=G[3],G[0],G[1]);break}case"C":{q("C",k,te,k=G[4],te=G[5],G[0],G[1],G[2],G[3]);break}case"Z":(k!==ne||te!==O)&&q("L",k,te,ne,O);break}}}function r(K,q,F){F===void 0&&(F=16);var V={x:0,y:0};i(K,function(ne,O,k,te,G,ae,pe,_e,D){switch(ne){case"L":q(O,k,te,G);break;case"Q":{for(var he=O,Pe=k,Le=1;Le<F;Le++)t(O,k,ae,pe,te,G,Le/(F-1),V),q(he,Pe,V.x,V.y),he=V.x,Pe=V.y;break}case"C":{for(var fe=O,ye=k,Se=1;Se<F;Se++)n(O,k,ae,pe,_e,D,te,G,Se/(F-1),V),q(fe,ye,V.x,V.y),fe=V.x,ye=V.y;break}}})}var o="precision highp float;attribute vec2 aUV;varying vec2 vUV;void main(){vUV=aUV;gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}",a="precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){gl_FragColor=texture2D(tex,vUV);}",l=new WeakMap,c={premultipliedAlpha:!1,preserveDrawingBuffer:!0,antialias:!1,depth:!1};function h(K,q){var F=K.getContext?K.getContext("webgl",c):K,V=l.get(F);if(!V){let pe=function(fe){var ye=O[fe];if(!ye&&(ye=O[fe]=F.getExtension(fe),!ye))throw new Error(fe+" not supported");return ye},_e=function(fe,ye){var Se=F.createShader(ye);return F.shaderSource(Se,fe),F.compileShader(Se),Se},D=function(fe,ye,Se,de){if(!k[fe]){var Ce={},R={},S=F.createProgram();F.attachShader(S,_e(ye,F.VERTEX_SHADER)),F.attachShader(S,_e(Se,F.FRAGMENT_SHADER)),F.linkProgram(S),k[fe]={program:S,transaction:function(Z){F.useProgram(S),Z({setUniform:function(Q,we){for(var le=[],ce=arguments.length-2;ce-- >0;)le[ce]=arguments[ce+2];var be=R[we]||(R[we]=F.getUniformLocation(S,we));F["uniform"+Q].apply(F,[be].concat(le))},setAttribute:function(Q,we,le,ce,be){var ue=Ce[Q];ue||(ue=Ce[Q]={buf:F.createBuffer(),loc:F.getAttribLocation(S,Q),data:null}),F.bindBuffer(F.ARRAY_BUFFER,ue.buf),F.vertexAttribPointer(ue.loc,we,F.FLOAT,!1,0,0),F.enableVertexAttribArray(ue.loc),ne?F.vertexAttribDivisor(ue.loc,ce):pe("ANGLE_instanced_arrays").vertexAttribDivisorANGLE(ue.loc,ce),be!==ue.data&&(F.bufferData(F.ARRAY_BUFFER,be,le),ue.data=be)}})}}}k[fe].transaction(de)},he=function(fe,ye){G++;try{F.activeTexture(F.TEXTURE0+G);var Se=te[fe];Se||(Se=te[fe]=F.createTexture(),F.bindTexture(F.TEXTURE_2D,Se),F.texParameteri(F.TEXTURE_2D,F.TEXTURE_MIN_FILTER,F.NEAREST),F.texParameteri(F.TEXTURE_2D,F.TEXTURE_MAG_FILTER,F.NEAREST)),F.bindTexture(F.TEXTURE_2D,Se),ye(Se,G)}finally{G--}},Pe=function(fe,ye,Se){var de=F.createFramebuffer();ae.push(de),F.bindFramebuffer(F.FRAMEBUFFER,de),F.activeTexture(F.TEXTURE0+ye),F.bindTexture(F.TEXTURE_2D,fe),F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,fe,0);try{Se(de)}finally{F.deleteFramebuffer(de),F.bindFramebuffer(F.FRAMEBUFFER,ae[--ae.length-1]||null)}},Le=function(){O={},k={},te={},G=-1,ae.length=0};var ne=typeof WebGL2RenderingContext<"u"&&F instanceof WebGL2RenderingContext,O={},k={},te={},G=-1,ae=[];F.canvas.addEventListener("webglcontextlost",function(fe){Le(),fe.preventDefault()},!1),l.set(F,V={gl:F,isWebGL2:ne,getExtension:pe,withProgram:D,withTexture:he,withTextureFramebuffer:Pe,handleContextLoss:Le})}q(V)}function d(K,q,F,V,ne,O,k,te){k===void 0&&(k=15),te===void 0&&(te=null),h(K,function(G){var ae=G.gl,pe=G.withProgram,_e=G.withTexture;_e("copy",function(D,he){ae.texImage2D(ae.TEXTURE_2D,0,ae.RGBA,ne,O,0,ae.RGBA,ae.UNSIGNED_BYTE,q),pe("copy",o,a,function(Pe){var Le=Pe.setUniform,fe=Pe.setAttribute;fe("aUV",2,ae.STATIC_DRAW,0,new Float32Array([0,0,2,0,0,2])),Le("1i","image",he),ae.bindFramebuffer(ae.FRAMEBUFFER,te||null),ae.disable(ae.BLEND),ae.colorMask(k&8,k&4,k&2,k&1),ae.viewport(F,V,ne,O),ae.scissor(F,V,ne,O),ae.drawArrays(ae.TRIANGLES,0,3)})})})}function u(K,q,F){var V=K.width,ne=K.height;h(K,function(O){var k=O.gl,te=new Uint8Array(V*ne*4);k.readPixels(0,0,V,ne,k.RGBA,k.UNSIGNED_BYTE,te),K.width=q,K.height=F,d(k,te,0,0,V,ne)})}var f=Object.freeze({__proto__:null,withWebGLContext:h,renderImageData:d,resizeWebGLCanvasWithoutClearing:u});function g(K,q,F,V,ne,O){O===void 0&&(O=1);var k=new Uint8Array(K*q),te=V[2]-V[0],G=V[3]-V[1],ae=[];r(F,function(fe,ye,Se,de){ae.push({x1:fe,y1:ye,x2:Se,y2:de,minX:Math.min(fe,Se),minY:Math.min(ye,de),maxX:Math.max(fe,Se),maxY:Math.max(ye,de)})}),ae.sort(function(fe,ye){return fe.maxX-ye.maxX});for(var pe=0;pe<K;pe++)for(var _e=0;_e<q;_e++){var D=Pe(V[0]+te*(pe+.5)/K,V[1]+G*(_e+.5)/q),he=Math.pow(1-Math.abs(D)/ne,O)/2;D<0&&(he=1-he),he=Math.max(0,Math.min(255,Math.round(he*255))),k[_e*K+pe]=he}return k;function Pe(fe,ye){for(var Se=1/0,de=1/0,Ce=ae.length;Ce--;){var R=ae[Ce];if(R.maxX+de<=fe)break;if(fe+de>R.minX&&ye-de<R.maxY&&ye+de>R.minY){var S=m(fe,ye,R.x1,R.y1,R.x2,R.y2);S<Se&&(Se=S,de=Math.sqrt(Se))}}return Le(fe,ye)&&(de=-de),de}function Le(fe,ye){for(var Se=0,de=ae.length;de--;){var Ce=ae[de];if(Ce.maxX<=fe)break;var R=Ce.y1>ye!=Ce.y2>ye&&fe<(Ce.x2-Ce.x1)*(ye-Ce.y1)/(Ce.y2-Ce.y1)+Ce.x1;R&&(Se+=Ce.y1<Ce.y2?1:-1)}return Se!==0}}function v(K,q,F,V,ne,O,k,te,G,ae){O===void 0&&(O=1),te===void 0&&(te=0),G===void 0&&(G=0),ae===void 0&&(ae=0),p(K,q,F,V,ne,O,k,null,te,G,ae)}function p(K,q,F,V,ne,O,k,te,G,ae,pe){O===void 0&&(O=1),G===void 0&&(G=0),ae===void 0&&(ae=0),pe===void 0&&(pe=0);for(var _e=g(K,q,F,V,ne,O),D=new Uint8Array(_e.length*4),he=0;he<_e.length;he++)D[he*4+pe]=_e[he];d(k,D,G,ae,K,q,1<<3-pe,te)}function m(K,q,F,V,ne,O){var k=ne-F,te=O-V,G=k*k+te*te,ae=G?Math.max(0,Math.min(1,((K-F)*k+(q-V)*te)/G)):0,pe=K-(F+ae*k),_e=q-(V+ae*te);return pe*pe+_e*_e}var x=Object.freeze({__proto__:null,generate:g,generateIntoCanvas:v,generateIntoFramebuffer:p}),_="precision highp float;uniform vec4 uGlyphBounds;attribute vec2 aUV;attribute vec4 aLineSegment;varying vec4 vLineSegment;varying vec2 vGlyphXY;void main(){vLineSegment=aLineSegment;vGlyphXY=mix(uGlyphBounds.xy,uGlyphBounds.zw,aUV);gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}",M="precision highp float;uniform vec4 uGlyphBounds;uniform float uMaxDistance;uniform float uExponent;varying vec4 vLineSegment;varying vec2 vGlyphXY;float absDistToSegment(vec2 point,vec2 lineA,vec2 lineB){vec2 lineDir=lineB-lineA;float lenSq=dot(lineDir,lineDir);float t=lenSq==0.0 ? 0.0 : clamp(dot(point-lineA,lineDir)/lenSq,0.0,1.0);vec2 linePt=lineA+t*lineDir;return distance(point,linePt);}void main(){vec4 seg=vLineSegment;vec2 p=vGlyphXY;float dist=absDistToSegment(p,seg.xy,seg.zw);float val=pow(1.0-clamp(dist/uMaxDistance,0.0,1.0),uExponent)*0.5;bool crossing=(seg.y>p.y!=seg.w>p.y)&&(p.x<(seg.z-seg.x)*(p.y-seg.y)/(seg.w-seg.y)+seg.x);bool crossingUp=crossing&&vLineSegment.y<vLineSegment.w;gl_FragColor=vec4(crossingUp ? 1.0/255.0 : 0.0,crossing&&!crossingUp ? 1.0/255.0 : 0.0,0.0,val);}",C="precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){vec4 color=texture2D(tex,vUV);bool inside=color.r!=color.g;float val=inside ? 1.0-color.a : color.a;gl_FragColor=vec4(val);}",T=new Float32Array([0,0,2,0,0,2]),w=null,L=!1,b={},y=new WeakMap;function U(K){if(!L&&!W(K))throw new Error("WebGL generation not supported")}function P(K,q,F,V,ne,O,k){if(O===void 0&&(O=1),k===void 0&&(k=null),!k&&(k=w,!k)){var te=typeof OffscreenCanvas=="function"?new OffscreenCanvas(1,1):typeof document<"u"?document.createElement("canvas"):null;if(!te)throw new Error("OffscreenCanvas or DOM canvas not supported");k=w=te.getContext("webgl",{depth:!1})}U(k);var G=new Uint8Array(K*q*4);h(k,function(D){var he=D.gl,Pe=D.withTexture,Le=D.withTextureFramebuffer;Pe("readable",function(fe,ye){he.texImage2D(he.TEXTURE_2D,0,he.RGBA,K,q,0,he.RGBA,he.UNSIGNED_BYTE,null),Le(fe,ye,function(Se){N(K,q,F,V,ne,O,he,Se,0,0,0),he.readPixels(0,0,K,q,he.RGBA,he.UNSIGNED_BYTE,G)})})});for(var ae=new Uint8Array(K*q),pe=0,_e=0;pe<G.length;pe+=4)ae[_e++]=G[pe];return ae}function I(K,q,F,V,ne,O,k,te,G,ae){O===void 0&&(O=1),te===void 0&&(te=0),G===void 0&&(G=0),ae===void 0&&(ae=0),N(K,q,F,V,ne,O,k,null,te,G,ae)}function N(K,q,F,V,ne,O,k,te,G,ae,pe){O===void 0&&(O=1),G===void 0&&(G=0),ae===void 0&&(ae=0),pe===void 0&&(pe=0),U(k);var _e=[];r(F,function(D,he,Pe,Le){_e.push(D,he,Pe,Le)}),_e=new Float32Array(_e),h(k,function(D){var he=D.gl,Pe=D.isWebGL2,Le=D.getExtension,fe=D.withProgram,ye=D.withTexture,Se=D.withTextureFramebuffer,de=D.handleContextLoss;if(ye("rawDistances",function(Ce,R){(K!==Ce._lastWidth||q!==Ce._lastHeight)&&he.texImage2D(he.TEXTURE_2D,0,he.RGBA,Ce._lastWidth=K,Ce._lastHeight=q,0,he.RGBA,he.UNSIGNED_BYTE,null),fe("main",_,M,function(S){var X=S.setAttribute,Z=S.setUniform,ie=!Pe&&Le("ANGLE_instanced_arrays"),Q=!Pe&&Le("EXT_blend_minmax");X("aUV",2,he.STATIC_DRAW,0,T),X("aLineSegment",4,he.DYNAMIC_DRAW,1,_e),Z.apply(void 0,["4f","uGlyphBounds"].concat(V)),Z("1f","uMaxDistance",ne),Z("1f","uExponent",O),Se(Ce,R,function(we){he.enable(he.BLEND),he.colorMask(!0,!0,!0,!0),he.viewport(0,0,K,q),he.scissor(0,0,K,q),he.blendFunc(he.ONE,he.ONE),he.blendEquationSeparate(he.FUNC_ADD,Pe?he.MAX:Q.MAX_EXT),he.clear(he.COLOR_BUFFER_BIT),Pe?he.drawArraysInstanced(he.TRIANGLES,0,3,_e.length/4):ie.drawArraysInstancedANGLE(he.TRIANGLES,0,3,_e.length/4)})}),fe("post",o,C,function(S){S.setAttribute("aUV",2,he.STATIC_DRAW,0,T),S.setUniform("1i","tex",R),he.bindFramebuffer(he.FRAMEBUFFER,te),he.disable(he.BLEND),he.colorMask(pe===0,pe===1,pe===2,pe===3),he.viewport(G,ae,K,q),he.scissor(G,ae,K,q),he.drawArrays(he.TRIANGLES,0,3)})}),he.isContextLost())throw de(),new Error("webgl context lost")})}function W(K){var q=!K||K===w?b:K.canvas||K,F=y.get(q);if(F===void 0){L=!0;var V=null;try{var ne=[97,106,97,61,99,137,118,80,80,118,137,99,61,97,106,97],O=P(4,4,"M8,8L16,8L24,24L16,24Z",[0,0,32,32],24,1,K);F=O&&ne.length===O.length&&O.every(function(k,te){return k===ne[te]}),F||(V="bad trial run results",console.info(ne,O))}catch(k){F=!1,V=k.message}V&&console.warn("WebGL SDF generation not supported:",V),L=!1,y.set(q,F)}return F}var B=Object.freeze({__proto__:null,generate:P,generateIntoCanvas:I,generateIntoFramebuffer:N,isSupported:W});function se(K,q,F,V,ne,O){ne===void 0&&(ne=Math.max(V[2]-V[0],V[3]-V[1])/2),O===void 0&&(O=1);try{return P.apply(B,arguments)}catch(k){return console.info("WebGL SDF generation failed, falling back to JS",k),g.apply(x,arguments)}}function j(K,q,F,V,ne,O,k,te,G,ae){ne===void 0&&(ne=Math.max(V[2]-V[0],V[3]-V[1])/2),O===void 0&&(O=1),te===void 0&&(te=0),G===void 0&&(G=0),ae===void 0&&(ae=0);try{return I.apply(B,arguments)}catch(pe){return console.info("WebGL SDF generation failed, falling back to JS",pe),v.apply(x,arguments)}}return e.forEachPathCommand=i,e.generate=se,e.generateIntoCanvas=j,e.javascript=x,e.pathToLineSegments=r,e.webgl=B,e.webglUtils=f,Object.defineProperty(e,"__esModule",{value:!0}),e}({});return s}function J_(){var s=function(e){var t={R:"13k,1a,2,3,3,2+1j,ch+16,a+1,5+2,2+n,5,a,4,6+16,4+3,h+1b,4mo,179q,2+9,2+11,2i9+7y,2+68,4,3+4,5+13,4+3,2+4k,3+29,8+cf,1t+7z,w+17,3+3m,1t+3z,16o1+5r,8+30,8+mc,29+1r,29+4v,75+73",EN:"1c+9,3d+1,6,187+9,513,4+5,7+9,sf+j,175h+9,qw+q,161f+1d,4xt+a,25i+9",ES:"17,2,6dp+1,f+1,av,16vr,mx+1,4o,2",ET:"z+2,3h+3,b+1,ym,3e+1,2o,p4+1,8,6u,7c,g6,1wc,1n9+4,30+1b,2n,6d,qhx+1,h0m,a+1,49+2,63+1,4+1,6bb+3,12jj",AN:"16o+5,2j+9,2+1,35,ed,1ff2+9,87+u",CS:"18,2+1,b,2u,12k,55v,l,17v0,2,3,53,2+1,b",B:"a,3,f+2,2v,690",S:"9,2,k",WS:"c,k,4f4,1vk+a,u,1j,335",ON:"x+1,4+4,h+5,r+5,r+3,z,5+3,2+1,2+1,5,2+2,3+4,o,w,ci+1,8+d,3+d,6+8,2+g,39+1,9,6+1,2,33,b8,3+1,3c+1,7+1,5r,b,7h+3,sa+5,2,3i+6,jg+3,ur+9,2v,ij+1,9g+9,7+a,8m,4+1,49+x,14u,2+2,c+2,e+2,e+2,e+1,i+n,e+e,2+p,u+2,e+2,36+1,2+3,2+1,b,2+2,6+5,2,2,2,h+1,5+4,6+3,3+f,16+2,5+3l,3+81,1y+p,2+40,q+a,m+13,2r+ch,2+9e,75+hf,3+v,2+2w,6e+5,f+6,75+2a,1a+p,2+2g,d+5x,r+b,6+3,4+o,g,6+1,6+2,2k+1,4,2j,5h+z,1m+1,1e+f,t+2,1f+e,d+3,4o+3,2s+1,w,535+1r,h3l+1i,93+2,2s,b+1,3l+x,2v,4g+3,21+3,kz+1,g5v+1,5a,j+9,n+v,2,3,2+8,2+1,3+2,2,3,46+1,4+4,h+5,r+5,r+a,3h+2,4+6,b+4,78,1r+24,4+c,4,1hb,ey+6,103+j,16j+c,1ux+7,5+g,fsh,jdq+1t,4,57+2e,p1,1m,1m,1m,1m,4kt+1,7j+17,5+2r,d+e,3+e,2+e,2+10,m+4,w,1n+5,1q,4z+5,4b+rb,9+c,4+c,4+37,d+2g,8+b,l+b,5+1j,9+9,7+13,9+t,3+1,27+3c,2+29,2+3q,d+d,3+4,4+2,6+6,a+o,8+6,a+2,e+6,16+42,2+1i",BN:"0+8,6+d,2s+5,2+p,e,4m9,1kt+2,2b+5,5+5,17q9+v,7k,6p+8,6+1,119d+3,440+7,96s+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+75,6p+2rz,1ben+1,1ekf+1,1ekf+1",NSM:"lc+33,7o+6,7c+18,2,2+1,2+1,2,21+a,1d+k,h,2u+6,3+5,3+1,2+3,10,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,g+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+g,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,k1+w,2db+2,3y,2p+v,ff+3,30+1,n9x+3,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,r2,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+5,3+1,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2d+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,f0c+4,1o+6,t5,1s+3,2a,f5l+1,43t+2,i+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,gzhy+6n",AL:"16w,3,2,e+1b,z+2,2+2s,g+1,8+1,b+m,2+t,s+2i,c+e,4h+f,1d+1e,1bwe+dp,3+3z,x+c,2+1,35+3y,2rm+z,5+7,b+5,dt+l,c+u,17nl+27,1t+27,4x+6n,3+d",LRO:"6ct",RLO:"6cu",LRE:"6cq",RLE:"6cr",PDF:"6cs",LRI:"6ee",RLI:"6ef",FSI:"6eg",PDI:"6eh"},n={},i={};n.L=1,i[1]="L",Object.keys(t).forEach(function(de,Ce){n[de]=1<<Ce+1,i[n[de]]=de}),Object.freeze(n);var r=n.LRI|n.RLI|n.FSI,o=n.L|n.R|n.AL,a=n.B|n.S|n.WS|n.ON|n.FSI|n.LRI|n.RLI|n.PDI,l=n.BN|n.RLE|n.LRE|n.RLO|n.LRO|n.PDF,c=n.S|n.WS|n.B|r|n.PDI|l,h=null;function d(){if(!h){h=new Map;var de=function(R){if(t.hasOwnProperty(R)){var S=0;t[R].split(",").forEach(function(X){var Z=X.split("+"),ie=Z[0],Q=Z[1];ie=parseInt(ie,36),Q=Q?parseInt(Q,36):0,h.set(S+=ie,n[R]);for(var we=0;we<Q;we++)h.set(++S,n[R])})}};for(var Ce in t)de(Ce)}}function u(de){return d(),h.get(de.codePointAt(0))||n.L}function f(de){return i[u(de)]}var g={pairs:"14>1,1e>2,u>2,2wt>1,1>1,1ge>1,1wp>1,1j>1,f>1,hm>1,1>1,u>1,u6>1,1>1,+5,28>1,w>1,1>1,+3,b8>1,1>1,+3,1>3,-1>-1,3>1,1>1,+2,1s>1,1>1,x>1,th>1,1>1,+2,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,4q>1,1e>2,u>2,2>1,+1",canonical:"6f1>-6dx,6dy>-6dx,6ec>-6ed,6ee>-6ed,6ww>2jj,-2ji>2jj,14r4>-1e7l,1e7m>-1e7l,1e7m>-1e5c,1e5d>-1e5b,1e5c>-14qx,14qy>-14qx,14vn>-1ecg,1ech>-1ecg,1edu>-1ecg,1eci>-1ecg,1eda>-1ecg,1eci>-1ecg,1eci>-168q,168r>-168q,168s>-14ye,14yf>-14ye"};function v(de,Ce){var R=36,S=0,X=new Map,Z=Ce&&new Map,ie;return de.split(",").forEach(function Q(we){if(we.indexOf("+")!==-1)for(var le=+we;le--;)Q(ie);else{ie=we;var ce=we.split(">"),be=ce[0],ue=ce[1];be=String.fromCodePoint(S+=parseInt(be,R)),ue=String.fromCodePoint(S+=parseInt(ue,R)),X.set(be,ue),Ce&&Z.set(ue,be)}}),{map:X,reverseMap:Z}}var p,m,x;function _(){if(!p){var de=v(g.pairs,!0),Ce=de.map,R=de.reverseMap;p=Ce,m=R,x=v(g.canonical,!1).map}}function M(de){return _(),p.get(de)||null}function C(de){return _(),m.get(de)||null}function T(de){return _(),x.get(de)||null}var w=n.L,L=n.R,b=n.EN,y=n.ES,U=n.ET,P=n.AN,I=n.CS,N=n.B,W=n.S,B=n.ON,se=n.BN,j=n.NSM,K=n.AL,q=n.LRO,F=n.RLO,V=n.LRE,ne=n.RLE,O=n.PDF,k=n.LRI,te=n.RLI,G=n.FSI,ae=n.PDI;function pe(de,Ce){for(var R=125,S=new Uint32Array(de.length),X=0;X<de.length;X++)S[X]=u(de[X]);var Z=new Map;function ie(Lt,Zt){var Ut=S[Lt];S[Lt]=Zt,Z.set(Ut,Z.get(Ut)-1),Ut&a&&Z.set(a,Z.get(a)-1),Z.set(Zt,(Z.get(Zt)||0)+1),Zt&a&&Z.set(a,(Z.get(a)||0)+1)}for(var Q=new Uint8Array(de.length),we=new Map,le=[],ce=null,be=0;be<de.length;be++)ce||le.push(ce={start:be,end:de.length-1,level:Ce==="rtl"?1:Ce==="ltr"?0:ba(be,!1)}),S[be]&N&&(ce.end=be,ce=null);for(var ue=ne|V|F|q|r|ae|O|N,Me=function(Lt){return Lt+(Lt&1?1:2)},ke=function(Lt){return Lt+(Lt&1?2:1)},Te=0;Te<le.length;Te++){ce=le[Te];var me=[{_level:ce.level,_override:0,_isolate:0}],xe=void 0,Ne=0,We=0,E=0;Z.clear();for(var $=ce.start;$<=ce.end;$++){var z=S[$];if(xe=me[me.length-1],Z.set(z,(Z.get(z)||0)+1),z&a&&Z.set(a,(Z.get(a)||0)+1),z&ue)if(z&(ne|V)){Q[$]=xe._level;var ee=(z===ne?ke:Me)(xe._level);ee<=R&&!Ne&&!We?me.push({_level:ee,_override:0,_isolate:0}):Ne||We++}else if(z&(F|q)){Q[$]=xe._level;var ge=(z===F?ke:Me)(xe._level);ge<=R&&!Ne&&!We?me.push({_level:ge,_override:z&F?L:w,_isolate:0}):Ne||We++}else if(z&r){z&G&&(z=ba($+1,!0)===1?te:k),Q[$]=xe._level,xe._override&&ie($,xe._override);var Ae=(z===te?ke:Me)(xe._level);Ae<=R&&Ne===0&&We===0?(E++,me.push({_level:Ae,_override:0,_isolate:1,_isolInitIndex:$})):Ne++}else if(z&ae){if(Ne>0)Ne--;else if(E>0){for(We=0;!me[me.length-1]._isolate;)me.pop();var Re=me[me.length-1]._isolInitIndex;Re!=null&&(we.set(Re,$),we.set($,Re)),me.pop(),E--}xe=me[me.length-1],Q[$]=xe._level,xe._override&&ie($,xe._override)}else z&O?(Ne===0&&(We>0?We--:!xe._isolate&&me.length>1&&(me.pop(),xe=me[me.length-1])),Q[$]=xe._level):z&N&&(Q[$]=ce.level);else Q[$]=xe._level,xe._override&&z!==se&&ie($,xe._override)}for(var je=[],Xe=null,De=ce.start;De<=ce.end;De++){var Ye=S[De];if(!(Ye&l)){var Je=Q[De],tt=Ye&r,$e=Ye===ae;Xe&&Je===Xe._level?(Xe._end=De,Xe._endsWithIsolInit=tt):je.push(Xe={_start:De,_end:De,_level:Je,_startsWithPDI:$e,_endsWithIsolInit:tt})}}for(var lt=[],bt=0;bt<je.length;bt++){var gt=je[bt];if(!gt._startsWithPDI||gt._startsWithPDI&&!we.has(gt._start)){for(var qt=[Xe=gt],Ht=void 0;Xe&&Xe._endsWithIsolInit&&(Ht=we.get(Xe._end))!=null;)for(var Vt=bt+1;Vt<je.length;Vt++)if(je[Vt]._start===Ht){qt.push(Xe=je[Vt]);break}for(var ft=[],cn=0;cn<qt.length;cn++)for(var Er=qt[cn],ji=Er._start;ji<=Er._end;ji++)ft.push(ji);for(var A=Q[ft[0]],Y=ce.level,re=ft[0]-1;re>=0;re--)if(!(S[re]&l)){Y=Q[re];break}var oe=ft[ft.length-1],J=Q[oe],Ee=ce.level;if(!(S[oe]&r)){for(var Ie=oe+1;Ie<=ce.end;Ie++)if(!(S[Ie]&l)){Ee=Q[Ie];break}}lt.push({_seqIndices:ft,_sosType:Math.max(Y,A)%2?L:w,_eosType:Math.max(Ee,J)%2?L:w})}}for(var Fe=0;Fe<lt.length;Fe++){var Be=lt[Fe],ve=Be._seqIndices,Ge=Be._sosType,He=Be._eosType,Ze=Q[ve[0]]&1?L:w;if(Z.get(j))for(var rt=0;rt<ve.length;rt++){var st=ve[rt];if(S[st]&j){for(var vt=Ge,Qe=rt-1;Qe>=0;Qe--)if(!(S[ve[Qe]]&l)){vt=S[ve[Qe]];break}ie(st,vt&(r|ae)?B:vt)}}if(Z.get(b))for(var ze=0;ze<ve.length;ze++){var pt=ve[ze];if(S[pt]&b)for(var et=ze-1;et>=-1;et--){var Wt=et===-1?Ge:S[ve[et]];if(Wt&o){Wt===K&&ie(pt,P);break}}}if(Z.get(K))for(var Mn=0;Mn<ve.length;Mn++){var tn=ve[Mn];S[tn]&K&&ie(tn,L)}if(Z.get(y)||Z.get(I))for(var hn=1;hn<ve.length-1;hn++){var at=ve[hn];if(S[at]&(y|I)){for(var At=0,zn=0,St=hn-1;St>=0&&(At=S[ve[St]],!!(At&l));St--);for(var Gn=hn+1;Gn<ve.length&&(zn=S[ve[Gn]],!!(zn&l));Gn++);At===zn&&(S[at]===y?At===b:At&(b|P))&&ie(at,At)}}if(Z.get(b))for(var Xt=0;Xt<ve.length;Xt++){var wr=ve[Xt];if(S[wr]&b){for(var Tr=Xt-1;Tr>=0&&S[ve[Tr]]&(U|l);Tr--)ie(ve[Tr],b);for(Xt++;Xt<ve.length&&S[ve[Xt]]&(U|l|b);Xt++)S[ve[Xt]]!==b&&ie(ve[Xt],b)}}if(Z.get(U)||Z.get(y)||Z.get(I))for(var qi=0;qi<ve.length;qi++){var la=ve[qi];if(S[la]&(U|y|I)){ie(la,B);for(var Ar=qi-1;Ar>=0&&S[ve[Ar]]&l;Ar--)ie(ve[Ar],B);for(var Cr=qi+1;Cr<ve.length&&S[ve[Cr]]&l;Cr++)ie(ve[Cr],B)}}if(Z.get(b))for(var Ns=0,ca=Ge;Ns<ve.length;Ns++){var ha=ve[Ns],Os=S[ha];Os&b?ca===w&&ie(ha,w):Os&o&&(ca=Os)}if(Z.get(a)){var Ki=L|b|P,ua=Ki|w,Rr=[];{for(var ai=[],li=0;li<ve.length;li++)if(S[ve[li]]&a){var Zi=de[ve[li]],da=void 0;if(M(Zi)!==null)if(ai.length<63)ai.push({char:Zi,seqIndex:li});else break;else if((da=C(Zi))!==null)for(var Ji=ai.length-1;Ji>=0;Ji--){var ks=ai[Ji].char;if(ks===da||ks===C(T(Zi))||M(T(ks))===Zi){Rr.push([ai[Ji].seqIndex,li]),ai.length=Ji;break}}}Rr.sort(function(Lt,Zt){return Lt[0]-Zt[0]})}for(var Bs=0;Bs<Rr.length;Bs++){for(var fa=Rr[Bs],Pr=fa[0],zs=fa[1],pa=!1,Kt=0,Gs=Pr+1;Gs<zs;Gs++){var ma=ve[Gs];if(S[ma]&ua){pa=!0;var ga=S[ma]&Ki?L:w;if(ga===Ze){Kt=ga;break}}}if(pa&&!Kt){Kt=Ge;for(var Hs=Pr-1;Hs>=0;Hs--){var va=ve[Hs];if(S[va]&ua){var _a=S[va]&Ki?L:w;_a!==Ze?Kt=_a:Kt=Ze;break}}}if(Kt){if(S[ve[Pr]]=S[ve[zs]]=Kt,Kt!==Ze){for(var Qi=Pr+1;Qi<ve.length;Qi++)if(!(S[ve[Qi]]&l)){u(de[ve[Qi]])&j&&(S[ve[Qi]]=Kt);break}}if(Kt!==Ze){for(var $i=zs+1;$i<ve.length;$i++)if(!(S[ve[$i]]&l)){u(de[ve[$i]])&j&&(S[ve[$i]]=Kt);break}}}}for(var En=0;En<ve.length;En++)if(S[ve[En]]&a){for(var xa=En,Vs=En,Ws=Ge,er=En-1;er>=0;er--)if(S[ve[er]]&l)xa=er;else{Ws=S[ve[er]]&Ki?L:w;break}for(var ya=He,tr=En+1;tr<ve.length;tr++)if(S[ve[tr]]&(a|l))Vs=tr;else{ya=S[ve[tr]]&Ki?L:w;break}for(var Xs=xa;Xs<=Vs;Xs++)S[ve[Xs]]=Ws===ya?Ws:Ze;En=Vs}}}for(var Nt=ce.start;Nt<=ce.end;Nt++){var Xh=Q[Nt],Lr=S[Nt];if(Xh&1?Lr&(w|b|P)&&Q[Nt]++:Lr&L?Q[Nt]++:Lr&(P|b)&&(Q[Nt]+=2),Lr&l&&(Q[Nt]=Nt===0?ce.level:Q[Nt-1]),Nt===ce.end||u(de[Nt])&(W|N))for(var Ur=Nt;Ur>=0&&u(de[Ur])&c;Ur--)Q[Ur]=ce.level}}return{levels:Q,paragraphs:le};function ba(Lt,Zt){for(var Ut=Lt;Ut<de.length;Ut++){var wn=S[Ut];if(wn&(L|K))return 1;if(wn&(N|w)||Zt&&wn===ae)return 0;if(wn&r){var Sa=Yh(Ut);Ut=Sa===-1?de.length:Sa}}return 0}function Yh(Lt){for(var Zt=1,Ut=Lt+1;Ut<de.length;Ut++){var wn=S[Ut];if(wn&N)break;if(wn&ae){if(--Zt===0)return Ut}else wn&r&&Zt++}return-1}}var _e="14>1,j>2,t>2,u>2,1a>g,2v3>1,1>1,1ge>1,1wd>1,b>1,1j>1,f>1,ai>3,-2>3,+1,8>1k0,-1jq>1y7,-1y6>1hf,-1he>1h6,-1h5>1ha,-1h8>1qi,-1pu>1,6>3u,-3s>7,6>1,1>1,f>1,1>1,+2,3>1,1>1,+13,4>1,1>1,6>1eo,-1ee>1,3>1mg,-1me>1mk,-1mj>1mi,-1mg>1mi,-1md>1,1>1,+2,1>10k,-103>1,1>1,4>1,5>1,1>1,+10,3>1,1>8,-7>8,+1,-6>7,+1,a>1,1>1,u>1,u6>1,1>1,+5,26>1,1>1,2>1,2>2,8>1,7>1,4>1,1>1,+5,b8>1,1>1,+3,1>3,-2>1,2>1,1>1,+2,c>1,3>1,1>1,+2,h>1,3>1,a>1,1>1,2>1,3>1,1>1,d>1,f>1,3>1,1a>1,1>1,6>1,7>1,13>1,k>1,1>1,+19,4>1,1>1,+2,2>1,1>1,+18,m>1,a>1,1>1,lk>1,1>1,4>1,2>1,f>1,3>1,1>1,+3,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,6>1,4j>1,j>2,t>2,u>2,2>1,+1",D;function he(){if(!D){var de=v(_e,!0),Ce=de.map,R=de.reverseMap;R.forEach(function(S,X){Ce.set(X,S)}),D=Ce}}function Pe(de){return he(),D.get(de)||null}function Le(de,Ce,R,S){var X=de.length;R=Math.max(0,R==null?0:+R),S=Math.min(X-1,S==null?X-1:+S);for(var Z=new Map,ie=R;ie<=S;ie++)if(Ce[ie]&1){var Q=Pe(de[ie]);Q!==null&&Z.set(ie,Q)}return Z}function fe(de,Ce,R,S){var X=de.length;R=Math.max(0,R==null?0:+R),S=Math.min(X-1,S==null?X-1:+S);var Z=[];return Ce.paragraphs.forEach(function(ie){var Q=Math.max(R,ie.start),we=Math.min(S,ie.end);if(Q<we){for(var le=Ce.levels.slice(Q,we+1),ce=we;ce>=Q&&u(de[ce])&c;ce--)le[ce]=ie.level;for(var be=ie.level,ue=1/0,Me=0;Me<le.length;Me++){var ke=le[Me];ke>be&&(be=ke),ke<ue&&(ue=ke|1)}for(var Te=be;Te>=ue;Te--)for(var me=0;me<le.length;me++)if(le[me]>=Te){for(var xe=me;me+1<le.length&&le[me+1]>=Te;)me++;me>xe&&Z.push([xe+Q,me+Q])}}}),Z}function ye(de,Ce,R,S){var X=Se(de,Ce,R,S),Z=[].concat(de);return X.forEach(function(ie,Q){Z[Q]=(Ce.levels[ie]&1?Pe(de[ie]):null)||de[ie]}),Z.join("")}function Se(de,Ce,R,S){for(var X=fe(de,Ce,R,S),Z=[],ie=0;ie<de.length;ie++)Z[ie]=ie;return X.forEach(function(Q){for(var we=Q[0],le=Q[1],ce=Z.slice(we,le+1),be=ce.length;be--;)Z[le-be]=ce[be]}),Z}return e.closingToOpeningBracket=C,e.getBidiCharType=u,e.getBidiCharTypeName=f,e.getCanonicalBracket=T,e.getEmbeddingLevels=pe,e.getMirroredCharacter=Pe,e.getMirroredCharactersMap=Le,e.getReorderSegments=fe,e.getReorderedIndices=Se,e.getReorderedString=ye,e.openingToClosingBracket=M,Object.defineProperty(e,"__esModule",{value:!0}),e}({});return s}const Dh=/\bvoid\s+main\s*\(\s*\)\s*{/g;function Yo(s){const e=/^[ \t]*#include +<([\w\d./]+)>/gm;function t(n,i){let r=qe[i];return r?Yo(r):n}return s.replace(e,t)}const _t=[];for(let s=0;s<256;s++)_t[s]=(s<16?"0":"")+s.toString(16);function Q_(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(_t[s&255]+_t[s>>8&255]+_t[s>>16&255]+_t[s>>24&255]+"-"+_t[e&255]+_t[e>>8&255]+"-"+_t[e>>16&15|64]+_t[e>>24&255]+"-"+_t[t&63|128]+_t[t>>8&255]+"-"+_t[t>>16&255]+_t[t>>24&255]+_t[n&255]+_t[n>>8&255]+_t[n>>16&255]+_t[n>>24&255]).toUpperCase()}const qn=Object.assign||function(){let s=arguments[0];for(let e=1,t=arguments.length;e<t;e++){let n=arguments[e];if(n)for(let i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=n[i])}return s},$_=Date.now(),_c=new WeakMap,xc=new Map;let e0=1e10;function jo(s,e){const t=r0(e);let n=_c.get(s);if(n||_c.set(s,n=Object.create(null)),n[t])return new n[t];const i=`_onBeforeCompile${t}`,r=function(c,h){s.onBeforeCompile.call(this,c,h);const d=this.customProgramCacheKey()+"|"+c.vertexShader+"|"+c.fragmentShader;let u=xc[d];if(!u){const f=t0(this,c,e,t);u=xc[d]=f}c.vertexShader=u.vertexShader,c.fragmentShader=u.fragmentShader,qn(c.uniforms,this.uniforms),e.timeUniform&&(c.uniforms[e.timeUniform]={get value(){return Date.now()-$_}}),this[i]&&this[i](c)},o=function(){return a(e.chained?s:s.clone())},a=function(c){const h=Object.create(c,l);return Object.defineProperty(h,"baseMaterial",{value:s}),Object.defineProperty(h,"id",{value:e0++}),h.uuid=Q_(),h.uniforms=qn({},c.uniforms,e.uniforms),h.defines=qn({},c.defines,e.defines),h.defines[`TROIKA_DERIVED_MATERIAL_${t}`]="",h.extensions=qn({},c.extensions,e.extensions),h._listeners=void 0,h},l={constructor:{value:o},isDerivedMaterial:{value:!0},type:{get:()=>s.type,set:c=>{s.type=c}},isDerivedFrom:{writable:!0,configurable:!0,value:function(c){const h=this.baseMaterial;return c===h||h.isDerivedMaterial&&h.isDerivedFrom(c)||!1}},customProgramCacheKey:{writable:!0,configurable:!0,value:function(){return s.customProgramCacheKey()+"|"+t}},onBeforeCompile:{get(){return r},set(c){this[i]=c}},copy:{writable:!0,configurable:!0,value:function(c){return s.copy.call(this,c),!s.isShaderMaterial&&!s.isDerivedMaterial&&(qn(this.extensions,c.extensions),qn(this.defines,c.defines),qn(this.uniforms,br.clone(c.uniforms))),this}},clone:{writable:!0,configurable:!0,value:function(){const c=new s.constructor;return a(c).copy(this)}},getDepthMaterial:{writable:!0,configurable:!0,value:function(){let c=this._depthMaterial;return c||(c=this._depthMaterial=jo(s.isDerivedMaterial?s.getDepthMaterial():new bh({depthPacking:th}),e),c.defines.IS_DEPTH_MATERIAL="",c.uniforms=this.uniforms),c}},getDistanceMaterial:{writable:!0,configurable:!0,value:function(){let c=this._distanceMaterial;return c||(c=this._distanceMaterial=jo(s.isDerivedMaterial?s.getDistanceMaterial():new Sh,e),c.defines.IS_DISTANCE_MATERIAL="",c.uniforms=this.uniforms),c}},dispose:{writable:!0,configurable:!0,value(){const{_depthMaterial:c,_distanceMaterial:h}=this;c&&c.dispose(),h&&h.dispose(),s.dispose.call(this)}}};return n[t]=o,new o}function t0(s,{vertexShader:e,fragmentShader:t},n,i){let{vertexDefs:r,vertexMainIntro:o,vertexMainOutro:a,vertexTransform:l,fragmentDefs:c,fragmentMainIntro:h,fragmentMainOutro:d,fragmentColorTransform:u,customRewriter:f,timeUniform:g}=n;if(r=r||"",o=o||"",a=a||"",c=c||"",h=h||"",d=d||"",(l||f)&&(e=Yo(e)),(u||f)&&(t=t.replace(/^[ \t]*#include <((?:tonemapping|encodings|colorspace|fog|premultiplied_alpha|dithering)_fragment)>/gm,`
//!BEGIN_POST_CHUNK $1
$&
//!END_POST_CHUNK
`),t=Yo(t)),f){let v=f({vertexShader:e,fragmentShader:t});e=v.vertexShader,t=v.fragmentShader}if(u){let v=[];t=t.replace(/^\/\/!BEGIN_POST_CHUNK[^]+?^\/\/!END_POST_CHUNK/gm,p=>(v.push(p),"")),d=`${u}
${v.join(`
`)}
${d}`}if(g){const v=`
uniform float ${g};
`;r=v+r,c=v+c}return l&&(e=`vec3 troika_position_${i};
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
`,e=e.replace(/\b(position|normal|uv)\b/g,(v,p,m,x)=>/\battribute\s+vec[23]\s+$/.test(x.substr(0,m))?p:`troika_${p}_${i}`),s.map&&s.map.channel>0||(e=e.replace(/\bMAP_UV\b/g,`troika_uv_${i}`))),e=yc(e,i,r,o,a),t=yc(t,i,c,h,d),{vertexShader:e,fragmentShader:t}}function yc(s,e,t,n,i){return(n||i||t)&&(s=s.replace(Dh,`
${t}
void troikaOrigMain${e}() {`),s+=`
void main() {
  ${n}
  troikaOrigMain${e}();
  ${i}
}`),s}function n0(s,e){return s==="uniforms"?void 0:typeof e=="function"?e.toString():e}let i0=0;const bc=new Map;function r0(s){const e=JSON.stringify(s,n0);let t=bc.get(e);return t==null&&bc.set(e,t=++i0),t}/*!
Custom build of Typr.ts (https://github.com/fredli74/Typr.ts) for use in Troika text rendering.
Original MIT license applies: https://github.com/fredli74/Typr.ts/blob/master/LICENSE
*/function s0(){return typeof window>"u"&&(self.window=self),function(s){var e={parse:function(i){var r=e._bin,o=new Uint8Array(i);if(r.readASCII(o,0,4)=="ttcf"){var a=4;r.readUshort(o,a),a+=2,r.readUshort(o,a),a+=2;var l=r.readUint(o,a);a+=4;for(var c=[],h=0;h<l;h++){var d=r.readUint(o,a);a+=4,c.push(e._readFont(o,d))}return c}return[e._readFont(o,0)]},_readFont:function(i,r){var o=e._bin,a=r;o.readFixed(i,r),r+=4;var l=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2;for(var c=["cmap","head","hhea","maxp","hmtx","name","OS/2","post","loca","glyf","kern","CFF ","GDEF","GPOS","GSUB","SVG "],h={_data:i,_offset:a},d={},u=0;u<l;u++){var f=o.readASCII(i,r,4);r+=4,o.readUint(i,r),r+=4;var g=o.readUint(i,r);r+=4;var v=o.readUint(i,r);r+=4,d[f]={offset:g,length:v}}for(u=0;u<c.length;u++){var p=c[u];d[p]&&(h[p.trim()]=e[p.trim()].parse(i,d[p].offset,d[p].length,h))}return h},_tabOffset:function(i,r,o){for(var a=e._bin,l=a.readUshort(i,o+4),c=o+12,h=0;h<l;h++){var d=a.readASCII(i,c,4);c+=4,a.readUint(i,c),c+=4;var u=a.readUint(i,c);if(c+=4,a.readUint(i,c),c+=4,d==r)return u}return 0}};e._bin={readFixed:function(i,r){return(i[r]<<8|i[r+1])+(i[r+2]<<8|i[r+3])/65540},readF2dot14:function(i,r){return e._bin.readShort(i,r)/16384},readInt:function(i,r){return e._bin._view(i).getInt32(r)},readInt8:function(i,r){return e._bin._view(i).getInt8(r)},readShort:function(i,r){return e._bin._view(i).getInt16(r)},readUshort:function(i,r){return e._bin._view(i).getUint16(r)},readUshorts:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(e._bin.readUshort(i,r+2*l));return a},readUint:function(i,r){return e._bin._view(i).getUint32(r)},readUint64:function(i,r){return 4294967296*e._bin.readUint(i,r)+e._bin.readUint(i,r+4)},readASCII:function(i,r,o){for(var a="",l=0;l<o;l++)a+=String.fromCharCode(i[r+l]);return a},readUnicode:function(i,r,o){for(var a="",l=0;l<o;l++){var c=i[r++]<<8|i[r++];a+=String.fromCharCode(c)}return a},_tdec:typeof window<"u"&&window.TextDecoder?new window.TextDecoder:null,readUTF8:function(i,r,o){var a=e._bin._tdec;return a&&r==0&&o==i.length?a.decode(i):e._bin.readASCII(i,r,o)},readBytes:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(i[r+l]);return a},readASCIIArray:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(String.fromCharCode(i[r+l]));return a},_view:function(i){return i._dataView||(i._dataView=i.buffer?new DataView(i.buffer,i.byteOffset,i.byteLength):new DataView(new Uint8Array(i).buffer))}},e._lctf={},e._lctf.parse=function(i,r,o,a,l){var c=e._bin,h={},d=r;c.readFixed(i,r),r+=4;var u=c.readUshort(i,r);r+=2;var f=c.readUshort(i,r);r+=2;var g=c.readUshort(i,r);return r+=2,h.scriptList=e._lctf.readScriptList(i,d+u),h.featureList=e._lctf.readFeatureList(i,d+f),h.lookupList=e._lctf.readLookupList(i,d+g,l),h},e._lctf.readLookupList=function(i,r,o){var a=e._bin,l=r,c=[],h=a.readUshort(i,r);r+=2;for(var d=0;d<h;d++){var u=a.readUshort(i,r);r+=2;var f=e._lctf.readLookupTable(i,l+u,o);c.push(f)}return c},e._lctf.readLookupTable=function(i,r,o){var a=e._bin,l=r,c={tabs:[]};c.ltype=a.readUshort(i,r),r+=2,c.flag=a.readUshort(i,r),r+=2;var h=a.readUshort(i,r);r+=2;for(var d=c.ltype,u=0;u<h;u++){var f=a.readUshort(i,r);r+=2;var g=o(i,d,l+f,c);c.tabs.push(g)}return c},e._lctf.numOfOnes=function(i){for(var r=0,o=0;o<32;o++)i>>>o&1&&r++;return r},e._lctf.readClassDef=function(i,r){var o=e._bin,a=[],l=o.readUshort(i,r);if(r+=2,l==1){var c=o.readUshort(i,r);r+=2;var h=o.readUshort(i,r);r+=2;for(var d=0;d<h;d++)a.push(c+d),a.push(c+d),a.push(o.readUshort(i,r)),r+=2}if(l==2){var u=o.readUshort(i,r);for(r+=2,d=0;d<u;d++)a.push(o.readUshort(i,r)),r+=2,a.push(o.readUshort(i,r)),r+=2,a.push(o.readUshort(i,r)),r+=2}return a},e._lctf.getInterval=function(i,r){for(var o=0;o<i.length;o+=3){var a=i[o],l=i[o+1];if(i[o+2],a<=r&&r<=l)return o}return-1},e._lctf.readCoverage=function(i,r){var o=e._bin,a={};a.fmt=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);return r+=2,a.fmt==1&&(a.tab=o.readUshorts(i,r,l)),a.fmt==2&&(a.tab=o.readUshorts(i,r,3*l)),a},e._lctf.coverageIndex=function(i,r){var o=i.tab;if(i.fmt==1)return o.indexOf(r);if(i.fmt==2){var a=e._lctf.getInterval(o,r);if(a!=-1)return o[a+2]+(r-o[a])}return-1},e._lctf.readFeatureList=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=o.readASCII(i,r,4);r+=4;var u=o.readUshort(i,r);r+=2;var f=e._lctf.readFeatureTable(i,a+u);f.tag=d.trim(),l.push(f)}return l},e._lctf.readFeatureTable=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2,c>0&&(l.featureParams=a+c);var h=o.readUshort(i,r);r+=2,l.tab=[];for(var d=0;d<h;d++)l.tab.push(o.readUshort(i,r+2*d));return l},e._lctf.readScriptList=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=o.readASCII(i,r,4);r+=4;var u=o.readUshort(i,r);r+=2,l[d.trim()]=e._lctf.readScriptTable(i,a+u)}return l},e._lctf.readScriptTable=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2,c>0&&(l.default=e._lctf.readLangSysTable(i,a+c));var h=o.readUshort(i,r);r+=2;for(var d=0;d<h;d++){var u=o.readASCII(i,r,4);r+=4;var f=o.readUshort(i,r);r+=2,l[u.trim()]=e._lctf.readLangSysTable(i,a+f)}return l},e._lctf.readLangSysTable=function(i,r){var o=e._bin,a={};o.readUshort(i,r),r+=2,a.reqFeature=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);return r+=2,a.features=o.readUshorts(i,r,l),a},e.CFF={},e.CFF.parse=function(i,r,o){var a=e._bin;(i=new Uint8Array(i.buffer,r,o))[r=0],i[++r],i[++r],i[++r],r++;var l=[];r=e.CFF.readIndex(i,r,l);for(var c=[],h=0;h<l.length-1;h++)c.push(a.readASCII(i,r+l[h],l[h+1]-l[h]));r+=l[l.length-1];var d=[];r=e.CFF.readIndex(i,r,d);var u=[];for(h=0;h<d.length-1;h++)u.push(e.CFF.readDict(i,r+d[h],r+d[h+1]));r+=d[d.length-1];var f=u[0],g=[];r=e.CFF.readIndex(i,r,g);var v=[];for(h=0;h<g.length-1;h++)v.push(a.readASCII(i,r+g[h],g[h+1]-g[h]));if(r+=g[g.length-1],e.CFF.readSubrs(i,r,f),f.CharStrings){r=f.CharStrings,g=[],r=e.CFF.readIndex(i,r,g);var p=[];for(h=0;h<g.length-1;h++)p.push(a.readBytes(i,r+g[h],g[h+1]-g[h]));f.CharStrings=p}if(f.ROS){r=f.FDArray;var m=[];for(r=e.CFF.readIndex(i,r,m),f.FDArray=[],h=0;h<m.length-1;h++){var x=e.CFF.readDict(i,r+m[h],r+m[h+1]);e.CFF._readFDict(i,x,v),f.FDArray.push(x)}r+=m[m.length-1],r=f.FDSelect,f.FDSelect=[];var _=i[r];if(r++,_!=3)throw _;var M=a.readUshort(i,r);for(r+=2,h=0;h<M+1;h++)f.FDSelect.push(a.readUshort(i,r),i[r+2]),r+=3}return f.Encoding&&(f.Encoding=e.CFF.readEncoding(i,f.Encoding,f.CharStrings.length)),f.charset&&(f.charset=e.CFF.readCharset(i,f.charset,f.CharStrings.length)),e.CFF._readFDict(i,f,v),f},e.CFF._readFDict=function(i,r,o){var a;for(var l in r.Private&&(a=r.Private[1],r.Private=e.CFF.readDict(i,a,a+r.Private[0]),r.Private.Subrs&&e.CFF.readSubrs(i,a+r.Private.Subrs,r.Private)),r)["FamilyName","FontName","FullName","Notice","version","Copyright"].indexOf(l)!=-1&&(r[l]=o[r[l]-426+35])},e.CFF.readSubrs=function(i,r,o){var a=e._bin,l=[];r=e.CFF.readIndex(i,r,l);var c,h=l.length;c=h<1240?107:h<33900?1131:32768,o.Bias=c,o.Subrs=[];for(var d=0;d<l.length-1;d++)o.Subrs.push(a.readBytes(i,r+l[d],l[d+1]-l[d]))},e.CFF.tableSE=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,0,111,112,113,114,0,115,116,117,118,119,120,121,122,0,123,0,124,125,126,127,128,129,130,131,0,132,133,0,134,135,136,137,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,138,0,139,0,0,0,0,140,141,142,143,0,0,0,0,0,144,0,0,0,145,0,0,146,147,148,149,0,0,0,0],e.CFF.glyphByUnicode=function(i,r){for(var o=0;o<i.charset.length;o++)if(i.charset[o]==r)return o;return-1},e.CFF.glyphBySE=function(i,r){return r<0||r>255?-1:e.CFF.glyphByUnicode(i,e.CFF.tableSE[r])},e.CFF.readEncoding=function(i,r,o){e._bin;var a=[".notdef"],l=i[r];if(r++,l!=0)throw"error: unknown encoding format: "+l;var c=i[r];r++;for(var h=0;h<c;h++)a.push(i[r+h]);return a},e.CFF.readCharset=function(i,r,o){var a=e._bin,l=[".notdef"],c=i[r];if(r++,c==0)for(var h=0;h<o;h++){var d=a.readUshort(i,r);r+=2,l.push(d)}else{if(c!=1&&c!=2)throw"error: format: "+c;for(;l.length<o;){d=a.readUshort(i,r),r+=2;var u=0;for(c==1?(u=i[r],r++):(u=a.readUshort(i,r),r+=2),h=0;h<=u;h++)l.push(d),d++}}return l},e.CFF.readIndex=function(i,r,o){var a=e._bin,l=a.readUshort(i,r)+1,c=i[r+=2];if(r++,c==1)for(var h=0;h<l;h++)o.push(i[r+h]);else if(c==2)for(h=0;h<l;h++)o.push(a.readUshort(i,r+2*h));else if(c==3)for(h=0;h<l;h++)o.push(16777215&a.readUint(i,r+3*h-1));else if(l!=1)throw"unsupported offset size: "+c+", count: "+l;return(r+=l*c)-1},e.CFF.getCharString=function(i,r,o){var a=e._bin,l=i[r],c=i[r+1];i[r+2],i[r+3],i[r+4];var h=1,d=null,u=null;l<=20&&(d=l,h=1),l==12&&(d=100*l+c,h=2),21<=l&&l<=27&&(d=l,h=1),l==28&&(u=a.readShort(i,r+1),h=3),29<=l&&l<=31&&(d=l,h=1),32<=l&&l<=246&&(u=l-139,h=1),247<=l&&l<=250&&(u=256*(l-247)+c+108,h=2),251<=l&&l<=254&&(u=256*-(l-251)-c-108,h=2),l==255&&(u=a.readInt(i,r+1)/65535,h=5),o.val=u??"o"+d,o.size=h},e.CFF.readCharString=function(i,r,o){for(var a=r+o,l=e._bin,c=[];r<a;){var h=i[r],d=i[r+1];i[r+2],i[r+3],i[r+4];var u=1,f=null,g=null;h<=20&&(f=h,u=1),h==12&&(f=100*h+d,u=2),h!=19&&h!=20||(f=h,u=2),21<=h&&h<=27&&(f=h,u=1),h==28&&(g=l.readShort(i,r+1),u=3),29<=h&&h<=31&&(f=h,u=1),32<=h&&h<=246&&(g=h-139,u=1),247<=h&&h<=250&&(g=256*(h-247)+d+108,u=2),251<=h&&h<=254&&(g=256*-(h-251)-d-108,u=2),h==255&&(g=l.readInt(i,r+1)/65535,u=5),c.push(g??"o"+f),r+=u}return c},e.CFF.readDict=function(i,r,o){for(var a=e._bin,l={},c=[];r<o;){var h=i[r],d=i[r+1];i[r+2],i[r+3],i[r+4];var u=1,f=null,g=null;if(h==28&&(g=a.readShort(i,r+1),u=3),h==29&&(g=a.readInt(i,r+1),u=5),32<=h&&h<=246&&(g=h-139,u=1),247<=h&&h<=250&&(g=256*(h-247)+d+108,u=2),251<=h&&h<=254&&(g=256*-(h-251)-d-108,u=2),h==255)throw g=a.readInt(i,r+1)/65535,u=5,"unknown number";if(h==30){var v=[];for(u=1;;){var p=i[r+u];u++;var m=p>>4,x=15&p;if(m!=15&&v.push(m),x!=15&&v.push(x),x==15)break}for(var _="",M=[0,1,2,3,4,5,6,7,8,9,".","e","e-","reserved","-","endOfNumber"],C=0;C<v.length;C++)_+=M[v[C]];g=parseFloat(_)}h<=21&&(f=["version","Notice","FullName","FamilyName","Weight","FontBBox","BlueValues","OtherBlues","FamilyBlues","FamilyOtherBlues","StdHW","StdVW","escape","UniqueID","XUID","charset","Encoding","CharStrings","Private","Subrs","defaultWidthX","nominalWidthX"][h],u=1,h==12&&(f=["Copyright","isFixedPitch","ItalicAngle","UnderlinePosition","UnderlineThickness","PaintType","CharstringType","FontMatrix","StrokeWidth","BlueScale","BlueShift","BlueFuzz","StemSnapH","StemSnapV","ForceBold",0,0,"LanguageGroup","ExpansionFactor","initialRandomSeed","SyntheticBase","PostScript","BaseFontName","BaseFontBlend",0,0,0,0,0,0,"ROS","CIDFontVersion","CIDFontRevision","CIDFontType","CIDCount","UIDBase","FDArray","FDSelect","FontName"][d],u=2)),f!=null?(l[f]=c.length==1?c[0]:c,c=[]):c.push(g),r+=u}return l},e.cmap={},e.cmap.parse=function(i,r,o){i=new Uint8Array(i.buffer,r,o),r=0;var a=e._bin,l={};a.readUshort(i,r),r+=2;var c=a.readUshort(i,r);r+=2;var h=[];l.tables=[];for(var d=0;d<c;d++){var u=a.readUshort(i,r);r+=2;var f=a.readUshort(i,r);r+=2;var g=a.readUint(i,r);r+=4;var v="p"+u+"e"+f,p=h.indexOf(g);if(p==-1){var m;p=l.tables.length,h.push(g);var x=a.readUshort(i,g);x==0?m=e.cmap.parse0(i,g):x==4?m=e.cmap.parse4(i,g):x==6?m=e.cmap.parse6(i,g):x==12?m=e.cmap.parse12(i,g):console.debug("unknown format: "+x,u,f,g),l.tables.push(m)}if(l[v]!=null)throw"multiple tables for one platform+encoding";l[v]=p}return l},e.cmap.parse0=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2,a.map=[];for(var c=0;c<l-6;c++)a.map.push(i[r+c]);return a},e.cmap.parse4=function(i,r){var o=e._bin,a=r,l={};l.format=o.readUshort(i,r),r+=2;var c=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2;var h=o.readUshort(i,r);r+=2;var d=h/2;l.searchRange=o.readUshort(i,r),r+=2,l.entrySelector=o.readUshort(i,r),r+=2,l.rangeShift=o.readUshort(i,r),r+=2,l.endCount=o.readUshorts(i,r,d),r+=2*d,r+=2,l.startCount=o.readUshorts(i,r,d),r+=2*d,l.idDelta=[];for(var u=0;u<d;u++)l.idDelta.push(o.readShort(i,r)),r+=2;for(l.idRangeOffset=o.readUshorts(i,r,d),r+=2*d,l.glyphIdArray=[];r<a+c;)l.glyphIdArray.push(o.readUshort(i,r)),r+=2;return l},e.cmap.parse6=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,a.firstCode=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2,a.glyphIdArray=[];for(var c=0;c<l;c++)a.glyphIdArray.push(o.readUshort(i,r)),r+=2;return a},e.cmap.parse12=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2,r+=2,o.readUint(i,r),r+=4,o.readUint(i,r),r+=4;var l=o.readUint(i,r);r+=4,a.groups=[];for(var c=0;c<l;c++){var h=r+12*c,d=o.readUint(i,h+0),u=o.readUint(i,h+4),f=o.readUint(i,h+8);a.groups.push([d,u,f])}return a},e.glyf={},e.glyf.parse=function(i,r,o,a){for(var l=[],c=0;c<a.maxp.numGlyphs;c++)l.push(null);return l},e.glyf._parseGlyf=function(i,r){var o=e._bin,a=i._data,l=e._tabOffset(a,"glyf",i._offset)+i.loca[r];if(i.loca[r]==i.loca[r+1])return null;var c={};if(c.noc=o.readShort(a,l),l+=2,c.xMin=o.readShort(a,l),l+=2,c.yMin=o.readShort(a,l),l+=2,c.xMax=o.readShort(a,l),l+=2,c.yMax=o.readShort(a,l),l+=2,c.xMin>=c.xMax||c.yMin>=c.yMax)return null;if(c.noc>0){c.endPts=[];for(var h=0;h<c.noc;h++)c.endPts.push(o.readUshort(a,l)),l+=2;var d=o.readUshort(a,l);if(l+=2,a.length-l<d)return null;c.instructions=o.readBytes(a,l,d),l+=d;var u=c.endPts[c.noc-1]+1;for(c.flags=[],h=0;h<u;h++){var f=a[l];if(l++,c.flags.push(f),(8&f)!=0){var g=a[l];l++;for(var v=0;v<g;v++)c.flags.push(f),h++}}for(c.xs=[],h=0;h<u;h++){var p=(2&c.flags[h])!=0,m=(16&c.flags[h])!=0;p?(c.xs.push(m?a[l]:-a[l]),l++):m?c.xs.push(0):(c.xs.push(o.readShort(a,l)),l+=2)}for(c.ys=[],h=0;h<u;h++)p=(4&c.flags[h])!=0,m=(32&c.flags[h])!=0,p?(c.ys.push(m?a[l]:-a[l]),l++):m?c.ys.push(0):(c.ys.push(o.readShort(a,l)),l+=2);var x=0,_=0;for(h=0;h<u;h++)x+=c.xs[h],_+=c.ys[h],c.xs[h]=x,c.ys[h]=_}else{var M;c.parts=[];do{M=o.readUshort(a,l),l+=2;var C={m:{a:1,b:0,c:0,d:1,tx:0,ty:0},p1:-1,p2:-1};if(c.parts.push(C),C.glyphIndex=o.readUshort(a,l),l+=2,1&M){var T=o.readShort(a,l);l+=2;var w=o.readShort(a,l);l+=2}else T=o.readInt8(a,l),l++,w=o.readInt8(a,l),l++;2&M?(C.m.tx=T,C.m.ty=w):(C.p1=T,C.p2=w),8&M?(C.m.a=C.m.d=o.readF2dot14(a,l),l+=2):64&M?(C.m.a=o.readF2dot14(a,l),l+=2,C.m.d=o.readF2dot14(a,l),l+=2):128&M&&(C.m.a=o.readF2dot14(a,l),l+=2,C.m.b=o.readF2dot14(a,l),l+=2,C.m.c=o.readF2dot14(a,l),l+=2,C.m.d=o.readF2dot14(a,l),l+=2)}while(32&M);if(256&M){var L=o.readUshort(a,l);for(l+=2,c.instr=[],h=0;h<L;h++)c.instr.push(a[l]),l++}}return c},e.GDEF={},e.GDEF.parse=function(i,r,o,a){var l=r;r+=4;var c=e._bin.readUshort(i,r);return{glyphClassDef:c===0?null:e._lctf.readClassDef(i,l+c)}},e.GPOS={},e.GPOS.parse=function(i,r,o,a){return e._lctf.parse(i,r,o,a,e.GPOS.subt)},e.GPOS.subt=function(i,r,o,a){var l=e._bin,c=o,h={};if(h.fmt=l.readUshort(i,o),o+=2,r==1||r==2||r==3||r==7||r==8&&h.fmt<=2){var d=l.readUshort(i,o);o+=2,h.coverage=e._lctf.readCoverage(i,d+c)}if(r==1&&h.fmt==1){var u=l.readUshort(i,o);o+=2,u!=0&&(h.pos=e.GPOS.readValueRecord(i,o,u))}else if(r==2&&h.fmt>=1&&h.fmt<=2){u=l.readUshort(i,o),o+=2;var f=l.readUshort(i,o);o+=2;var g=e._lctf.numOfOnes(u),v=e._lctf.numOfOnes(f);if(h.fmt==1){h.pairsets=[];var p=l.readUshort(i,o);o+=2;for(var m=0;m<p;m++){var x=c+l.readUshort(i,o);o+=2;var _=l.readUshort(i,x);x+=2;for(var M=[],C=0;C<_;C++){var T=l.readUshort(i,x);x+=2,u!=0&&(P=e.GPOS.readValueRecord(i,x,u),x+=2*g),f!=0&&(I=e.GPOS.readValueRecord(i,x,f),x+=2*v),M.push({gid2:T,val1:P,val2:I})}h.pairsets.push(M)}}if(h.fmt==2){var w=l.readUshort(i,o);o+=2;var L=l.readUshort(i,o);o+=2;var b=l.readUshort(i,o);o+=2;var y=l.readUshort(i,o);for(o+=2,h.classDef1=e._lctf.readClassDef(i,c+w),h.classDef2=e._lctf.readClassDef(i,c+L),h.matrix=[],m=0;m<b;m++){var U=[];for(C=0;C<y;C++){var P=null,I=null;u!=0&&(P=e.GPOS.readValueRecord(i,o,u),o+=2*g),f!=0&&(I=e.GPOS.readValueRecord(i,o,f),o+=2*v),U.push({val1:P,val2:I})}h.matrix.push(U)}}}else if(r==4&&h.fmt==1)h.markCoverage=e._lctf.readCoverage(i,l.readUshort(i,o)+c),h.baseCoverage=e._lctf.readCoverage(i,l.readUshort(i,o+2)+c),h.markClassCount=l.readUshort(i,o+4),h.markArray=e.GPOS.readMarkArray(i,l.readUshort(i,o+6)+c),h.baseArray=e.GPOS.readBaseArray(i,l.readUshort(i,o+8)+c,h.markClassCount);else if(r==6&&h.fmt==1)h.mark1Coverage=e._lctf.readCoverage(i,l.readUshort(i,o)+c),h.mark2Coverage=e._lctf.readCoverage(i,l.readUshort(i,o+2)+c),h.markClassCount=l.readUshort(i,o+4),h.mark1Array=e.GPOS.readMarkArray(i,l.readUshort(i,o+6)+c),h.mark2Array=e.GPOS.readBaseArray(i,l.readUshort(i,o+8)+c,h.markClassCount);else{if(r==9&&h.fmt==1){var N=l.readUshort(i,o);o+=2;var W=l.readUint(i,o);if(o+=4,a.ltype==9)a.ltype=N;else if(a.ltype!=N)throw"invalid extension substitution";return e.GPOS.subt(i,a.ltype,c+W)}console.debug("unsupported GPOS table LookupType",r,"format",h.fmt)}return h},e.GPOS.readValueRecord=function(i,r,o){var a=e._bin,l=[];return l.push(1&o?a.readShort(i,r):0),r+=1&o?2:0,l.push(2&o?a.readShort(i,r):0),r+=2&o?2:0,l.push(4&o?a.readShort(i,r):0),r+=4&o?2:0,l.push(8&o?a.readShort(i,r):0),r+=8&o?2:0,l},e.GPOS.readBaseArray=function(i,r,o){var a=e._bin,l=[],c=r,h=a.readUshort(i,r);r+=2;for(var d=0;d<h;d++){for(var u=[],f=0;f<o;f++)u.push(e.GPOS.readAnchorRecord(i,c+a.readUshort(i,r))),r+=2;l.push(u)}return l},e.GPOS.readMarkArray=function(i,r){var o=e._bin,a=[],l=r,c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=e.GPOS.readAnchorRecord(i,o.readUshort(i,r+2)+l);d.markClass=o.readUshort(i,r),a.push(d),r+=4}return a},e.GPOS.readAnchorRecord=function(i,r){var o=e._bin,a={};return a.fmt=o.readUshort(i,r),a.x=o.readShort(i,r+2),a.y=o.readShort(i,r+4),a},e.GSUB={},e.GSUB.parse=function(i,r,o,a){return e._lctf.parse(i,r,o,a,e.GSUB.subt)},e.GSUB.subt=function(i,r,o,a){var l=e._bin,c=o,h={};if(h.fmt=l.readUshort(i,o),o+=2,r!=1&&r!=2&&r!=4&&r!=5&&r!=6)return null;if(r==1||r==2||r==4||r==5&&h.fmt<=2||r==6&&h.fmt<=2){var d=l.readUshort(i,o);o+=2,h.coverage=e._lctf.readCoverage(i,c+d)}if(r==1&&h.fmt>=1&&h.fmt<=2){if(h.fmt==1)h.delta=l.readShort(i,o),o+=2;else if(h.fmt==2){var u=l.readUshort(i,o);o+=2,h.newg=l.readUshorts(i,o,u),o+=2*h.newg.length}}else if(r==2&&h.fmt==1){u=l.readUshort(i,o),o+=2,h.seqs=[];for(var f=0;f<u;f++){var g=l.readUshort(i,o)+c;o+=2;var v=l.readUshort(i,g);h.seqs.push(l.readUshorts(i,g+2,v))}}else if(r==4)for(h.vals=[],u=l.readUshort(i,o),o+=2,f=0;f<u;f++){var p=l.readUshort(i,o);o+=2,h.vals.push(e.GSUB.readLigatureSet(i,c+p))}else if(r==5&&h.fmt==2){if(h.fmt==2){var m=l.readUshort(i,o);o+=2,h.cDef=e._lctf.readClassDef(i,c+m),h.scset=[];var x=l.readUshort(i,o);for(o+=2,f=0;f<x;f++){var _=l.readUshort(i,o);o+=2,h.scset.push(_==0?null:e.GSUB.readSubClassSet(i,c+_))}}}else if(r==6&&h.fmt==3){if(h.fmt==3){for(f=0;f<3;f++){u=l.readUshort(i,o),o+=2;for(var M=[],C=0;C<u;C++)M.push(e._lctf.readCoverage(i,c+l.readUshort(i,o+2*C)));o+=2*u,f==0&&(h.backCvg=M),f==1&&(h.inptCvg=M),f==2&&(h.ahedCvg=M)}u=l.readUshort(i,o),o+=2,h.lookupRec=e.GSUB.readSubstLookupRecords(i,o,u)}}else{if(r==7&&h.fmt==1){var T=l.readUshort(i,o);o+=2;var w=l.readUint(i,o);if(o+=4,a.ltype==9)a.ltype=T;else if(a.ltype!=T)throw"invalid extension substitution";return e.GSUB.subt(i,a.ltype,c+w)}console.debug("unsupported GSUB table LookupType",r,"format",h.fmt)}return h},e.GSUB.readSubClassSet=function(i,r){var o=e._bin.readUshort,a=r,l=[],c=o(i,r);r+=2;for(var h=0;h<c;h++){var d=o(i,r);r+=2,l.push(e.GSUB.readSubClassRule(i,a+d))}return l},e.GSUB.readSubClassRule=function(i,r){var o=e._bin.readUshort,a={},l=o(i,r),c=o(i,r+=2);r+=2,a.input=[];for(var h=0;h<l-1;h++)a.input.push(o(i,r)),r+=2;return a.substLookupRecords=e.GSUB.readSubstLookupRecords(i,r,c),a},e.GSUB.readSubstLookupRecords=function(i,r,o){for(var a=e._bin.readUshort,l=[],c=0;c<o;c++)l.push(a(i,r),a(i,r+2)),r+=4;return l},e.GSUB.readChainSubClassSet=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=o.readUshort(i,r);r+=2,l.push(e.GSUB.readChainSubClassRule(i,a+d))}return l},e.GSUB.readChainSubClassRule=function(i,r){for(var o=e._bin,a={},l=["backtrack","input","lookahead"],c=0;c<l.length;c++){var h=o.readUshort(i,r);r+=2,c==1&&h--,a[l[c]]=o.readUshorts(i,r,h),r+=2*a[l[c]].length}return h=o.readUshort(i,r),r+=2,a.subst=o.readUshorts(i,r,2*h),r+=2*a.subst.length,a},e.GSUB.readLigatureSet=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var d=o.readUshort(i,r);r+=2,l.push(e.GSUB.readLigature(i,a+d))}return l},e.GSUB.readLigature=function(i,r){var o=e._bin,a={chain:[]};a.nglyph=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2;for(var c=0;c<l-1;c++)a.chain.push(o.readUshort(i,r)),r+=2;return a},e.head={},e.head.parse=function(i,r,o){var a=e._bin,l={};return a.readFixed(i,r),r+=4,l.fontRevision=a.readFixed(i,r),r+=4,a.readUint(i,r),r+=4,a.readUint(i,r),r+=4,l.flags=a.readUshort(i,r),r+=2,l.unitsPerEm=a.readUshort(i,r),r+=2,l.created=a.readUint64(i,r),r+=8,l.modified=a.readUint64(i,r),r+=8,l.xMin=a.readShort(i,r),r+=2,l.yMin=a.readShort(i,r),r+=2,l.xMax=a.readShort(i,r),r+=2,l.yMax=a.readShort(i,r),r+=2,l.macStyle=a.readUshort(i,r),r+=2,l.lowestRecPPEM=a.readUshort(i,r),r+=2,l.fontDirectionHint=a.readShort(i,r),r+=2,l.indexToLocFormat=a.readShort(i,r),r+=2,l.glyphDataFormat=a.readShort(i,r),r+=2,l},e.hhea={},e.hhea.parse=function(i,r,o){var a=e._bin,l={};return a.readFixed(i,r),r+=4,l.ascender=a.readShort(i,r),r+=2,l.descender=a.readShort(i,r),r+=2,l.lineGap=a.readShort(i,r),r+=2,l.advanceWidthMax=a.readUshort(i,r),r+=2,l.minLeftSideBearing=a.readShort(i,r),r+=2,l.minRightSideBearing=a.readShort(i,r),r+=2,l.xMaxExtent=a.readShort(i,r),r+=2,l.caretSlopeRise=a.readShort(i,r),r+=2,l.caretSlopeRun=a.readShort(i,r),r+=2,l.caretOffset=a.readShort(i,r),r+=2,r+=8,l.metricDataFormat=a.readShort(i,r),r+=2,l.numberOfHMetrics=a.readUshort(i,r),r+=2,l},e.hmtx={},e.hmtx.parse=function(i,r,o,a){for(var l=e._bin,c={aWidth:[],lsBearing:[]},h=0,d=0,u=0;u<a.maxp.numGlyphs;u++)u<a.hhea.numberOfHMetrics&&(h=l.readUshort(i,r),r+=2,d=l.readShort(i,r),r+=2),c.aWidth.push(h),c.lsBearing.push(d);return c},e.kern={},e.kern.parse=function(i,r,o,a){var l=e._bin,c=l.readUshort(i,r);if(r+=2,c==1)return e.kern.parseV1(i,r-2,o,a);var h=l.readUshort(i,r);r+=2;for(var d={glyph1:[],rval:[]},u=0;u<h;u++){r+=2,o=l.readUshort(i,r),r+=2;var f=l.readUshort(i,r);r+=2;var g=f>>>8;if((g&=15)!=0)throw"unknown kern table format: "+g;r=e.kern.readFormat0(i,r,d)}return d},e.kern.parseV1=function(i,r,o,a){var l=e._bin;l.readFixed(i,r),r+=4;var c=l.readUint(i,r);r+=4;for(var h={glyph1:[],rval:[]},d=0;d<c;d++){l.readUint(i,r),r+=4;var u=l.readUshort(i,r);r+=2,l.readUshort(i,r),r+=2;var f=u>>>8;if((f&=15)!=0)throw"unknown kern table format: "+f;r=e.kern.readFormat0(i,r,h)}return h},e.kern.readFormat0=function(i,r,o){var a=e._bin,l=-1,c=a.readUshort(i,r);r+=2,a.readUshort(i,r),r+=2,a.readUshort(i,r),r+=2,a.readUshort(i,r),r+=2;for(var h=0;h<c;h++){var d=a.readUshort(i,r);r+=2;var u=a.readUshort(i,r);r+=2;var f=a.readShort(i,r);r+=2,d!=l&&(o.glyph1.push(d),o.rval.push({glyph2:[],vals:[]}));var g=o.rval[o.rval.length-1];g.glyph2.push(u),g.vals.push(f),l=d}return r},e.loca={},e.loca.parse=function(i,r,o,a){var l=e._bin,c=[],h=a.head.indexToLocFormat,d=a.maxp.numGlyphs+1;if(h==0)for(var u=0;u<d;u++)c.push(l.readUshort(i,r+(u<<1))<<1);if(h==1)for(u=0;u<d;u++)c.push(l.readUint(i,r+(u<<2)));return c},e.maxp={},e.maxp.parse=function(i,r,o){var a=e._bin,l={},c=a.readUint(i,r);return r+=4,l.numGlyphs=a.readUshort(i,r),r+=2,c==65536&&(l.maxPoints=a.readUshort(i,r),r+=2,l.maxContours=a.readUshort(i,r),r+=2,l.maxCompositePoints=a.readUshort(i,r),r+=2,l.maxCompositeContours=a.readUshort(i,r),r+=2,l.maxZones=a.readUshort(i,r),r+=2,l.maxTwilightPoints=a.readUshort(i,r),r+=2,l.maxStorage=a.readUshort(i,r),r+=2,l.maxFunctionDefs=a.readUshort(i,r),r+=2,l.maxInstructionDefs=a.readUshort(i,r),r+=2,l.maxStackElements=a.readUshort(i,r),r+=2,l.maxSizeOfInstructions=a.readUshort(i,r),r+=2,l.maxComponentElements=a.readUshort(i,r),r+=2,l.maxComponentDepth=a.readUshort(i,r),r+=2),l},e.name={},e.name.parse=function(i,r,o){var a=e._bin,l={};a.readUshort(i,r),r+=2;var c=a.readUshort(i,r);r+=2,a.readUshort(i,r);for(var h,d=["copyright","fontFamily","fontSubfamily","ID","fullName","version","postScriptName","trademark","manufacturer","designer","description","urlVendor","urlDesigner","licence","licenceURL","---","typoFamilyName","typoSubfamilyName","compatibleFull","sampleText","postScriptCID","wwsFamilyName","wwsSubfamilyName","lightPalette","darkPalette"],u=r+=2,f=0;f<c;f++){var g=a.readUshort(i,r);r+=2;var v=a.readUshort(i,r);r+=2;var p=a.readUshort(i,r);r+=2;var m=a.readUshort(i,r);r+=2;var x=a.readUshort(i,r);r+=2;var _=a.readUshort(i,r);r+=2;var M,C=d[m],T=u+12*c+_;if(g==0)M=a.readUnicode(i,T,x/2);else if(g==3&&v==0)M=a.readUnicode(i,T,x/2);else if(v==0)M=a.readASCII(i,T,x);else if(v==1)M=a.readUnicode(i,T,x/2);else if(v==3)M=a.readUnicode(i,T,x/2);else{if(g!=1)throw"unknown encoding "+v+", platformID: "+g;M=a.readASCII(i,T,x),console.debug("reading unknown MAC encoding "+v+" as ASCII")}var w="p"+g+","+p.toString(16);l[w]==null&&(l[w]={}),l[w][C!==void 0?C:m]=M,l[w]._lang=p}for(var L in l)if(l[L].postScriptName!=null&&l[L]._lang==1033)return l[L];for(var L in l)if(l[L].postScriptName!=null&&l[L]._lang==0)return l[L];for(var L in l)if(l[L].postScriptName!=null&&l[L]._lang==3084)return l[L];for(var L in l)if(l[L].postScriptName!=null)return l[L];for(var L in l){h=L;break}return console.debug("returning name table with languageID "+l[h]._lang),l[h]},e["OS/2"]={},e["OS/2"].parse=function(i,r,o){var a=e._bin.readUshort(i,r);r+=2;var l={};if(a==0)e["OS/2"].version0(i,r,l);else if(a==1)e["OS/2"].version1(i,r,l);else if(a==2||a==3||a==4)e["OS/2"].version2(i,r,l);else{if(a!=5)throw"unknown OS/2 table version: "+a;e["OS/2"].version5(i,r,l)}return l},e["OS/2"].version0=function(i,r,o){var a=e._bin;return o.xAvgCharWidth=a.readShort(i,r),r+=2,o.usWeightClass=a.readUshort(i,r),r+=2,o.usWidthClass=a.readUshort(i,r),r+=2,o.fsType=a.readUshort(i,r),r+=2,o.ySubscriptXSize=a.readShort(i,r),r+=2,o.ySubscriptYSize=a.readShort(i,r),r+=2,o.ySubscriptXOffset=a.readShort(i,r),r+=2,o.ySubscriptYOffset=a.readShort(i,r),r+=2,o.ySuperscriptXSize=a.readShort(i,r),r+=2,o.ySuperscriptYSize=a.readShort(i,r),r+=2,o.ySuperscriptXOffset=a.readShort(i,r),r+=2,o.ySuperscriptYOffset=a.readShort(i,r),r+=2,o.yStrikeoutSize=a.readShort(i,r),r+=2,o.yStrikeoutPosition=a.readShort(i,r),r+=2,o.sFamilyClass=a.readShort(i,r),r+=2,o.panose=a.readBytes(i,r,10),r+=10,o.ulUnicodeRange1=a.readUint(i,r),r+=4,o.ulUnicodeRange2=a.readUint(i,r),r+=4,o.ulUnicodeRange3=a.readUint(i,r),r+=4,o.ulUnicodeRange4=a.readUint(i,r),r+=4,o.achVendID=[a.readInt8(i,r),a.readInt8(i,r+1),a.readInt8(i,r+2),a.readInt8(i,r+3)],r+=4,o.fsSelection=a.readUshort(i,r),r+=2,o.usFirstCharIndex=a.readUshort(i,r),r+=2,o.usLastCharIndex=a.readUshort(i,r),r+=2,o.sTypoAscender=a.readShort(i,r),r+=2,o.sTypoDescender=a.readShort(i,r),r+=2,o.sTypoLineGap=a.readShort(i,r),r+=2,o.usWinAscent=a.readUshort(i,r),r+=2,o.usWinDescent=a.readUshort(i,r),r+=2},e["OS/2"].version1=function(i,r,o){var a=e._bin;return r=e["OS/2"].version0(i,r,o),o.ulCodePageRange1=a.readUint(i,r),r+=4,o.ulCodePageRange2=a.readUint(i,r),r+=4},e["OS/2"].version2=function(i,r,o){var a=e._bin;return r=e["OS/2"].version1(i,r,o),o.sxHeight=a.readShort(i,r),r+=2,o.sCapHeight=a.readShort(i,r),r+=2,o.usDefault=a.readUshort(i,r),r+=2,o.usBreak=a.readUshort(i,r),r+=2,o.usMaxContext=a.readUshort(i,r),r+=2},e["OS/2"].version5=function(i,r,o){var a=e._bin;return r=e["OS/2"].version2(i,r,o),o.usLowerOpticalPointSize=a.readUshort(i,r),r+=2,o.usUpperOpticalPointSize=a.readUshort(i,r),r+=2},e.post={},e.post.parse=function(i,r,o){var a=e._bin,l={};return l.version=a.readFixed(i,r),r+=4,l.italicAngle=a.readFixed(i,r),r+=4,l.underlinePosition=a.readShort(i,r),r+=2,l.underlineThickness=a.readShort(i,r),r+=2,l},e==null&&(e={}),e.U==null&&(e.U={}),e.U.codeToGlyph=function(i,r){var o=i.cmap,a=-1;if(o.p0e4!=null?a=o.p0e4:o.p3e1!=null?a=o.p3e1:o.p1e0!=null?a=o.p1e0:o.p0e3!=null&&(a=o.p0e3),a==-1)throw"no familiar platform and encoding!";var l=o.tables[a];if(l.format==0)return r>=l.map.length?0:l.map[r];if(l.format==4){for(var c=-1,h=0;h<l.endCount.length;h++)if(r<=l.endCount[h]){c=h;break}return c==-1||l.startCount[c]>r?0:65535&(l.idRangeOffset[c]!=0?l.glyphIdArray[r-l.startCount[c]+(l.idRangeOffset[c]>>1)-(l.idRangeOffset.length-c)]:r+l.idDelta[c])}if(l.format==12){if(r>l.groups[l.groups.length-1][1])return 0;for(h=0;h<l.groups.length;h++){var d=l.groups[h];if(d[0]<=r&&r<=d[1])return d[2]+(r-d[0])}return 0}throw"unknown cmap table format "+l.format},e.U.glyphToPath=function(i,r){var o={cmds:[],crds:[]};if(i.SVG&&i.SVG.entries[r]){var a=i.SVG.entries[r];return a==null?o:(typeof a=="string"&&(a=e.SVG.toPath(a),i.SVG.entries[r]=a),a)}if(i.CFF){var l={x:0,y:0,stack:[],nStems:0,haveWidth:!1,width:i.CFF.Private?i.CFF.Private.defaultWidthX:0,open:!1},c=i.CFF,h=i.CFF.Private;if(c.ROS){for(var d=0;c.FDSelect[d+2]<=r;)d+=2;h=c.FDArray[c.FDSelect[d+1]].Private}e.U._drawCFF(i.CFF.CharStrings[r],l,c,h,o)}else i.glyf&&e.U._drawGlyf(r,i,o);return o},e.U._drawGlyf=function(i,r,o){var a=r.glyf[i];a==null&&(a=r.glyf[i]=e.glyf._parseGlyf(r,i)),a!=null&&(a.noc>-1?e.U._simpleGlyph(a,o):e.U._compoGlyph(a,r,o))},e.U._simpleGlyph=function(i,r){for(var o=0;o<i.noc;o++){for(var a=o==0?0:i.endPts[o-1]+1,l=i.endPts[o],c=a;c<=l;c++){var h=c==a?l:c-1,d=c==l?a:c+1,u=1&i.flags[c],f=1&i.flags[h],g=1&i.flags[d],v=i.xs[c],p=i.ys[c];if(c==a)if(u){if(!f){e.U.P.moveTo(r,v,p);continue}e.U.P.moveTo(r,i.xs[h],i.ys[h])}else f?e.U.P.moveTo(r,i.xs[h],i.ys[h]):e.U.P.moveTo(r,(i.xs[h]+v)/2,(i.ys[h]+p)/2);u?f&&e.U.P.lineTo(r,v,p):g?e.U.P.qcurveTo(r,v,p,i.xs[d],i.ys[d]):e.U.P.qcurveTo(r,v,p,(v+i.xs[d])/2,(p+i.ys[d])/2)}e.U.P.closePath(r)}},e.U._compoGlyph=function(i,r,o){for(var a=0;a<i.parts.length;a++){var l={cmds:[],crds:[]},c=i.parts[a];e.U._drawGlyf(c.glyphIndex,r,l);for(var h=c.m,d=0;d<l.crds.length;d+=2){var u=l.crds[d],f=l.crds[d+1];o.crds.push(u*h.a+f*h.b+h.tx),o.crds.push(u*h.c+f*h.d+h.ty)}for(d=0;d<l.cmds.length;d++)o.cmds.push(l.cmds[d])}},e.U._getGlyphClass=function(i,r){var o=e._lctf.getInterval(r,i);return o==-1?0:r[o+2]},e.U._applySubs=function(i,r,o,a){for(var l=i.length-r-1,c=0;c<o.tabs.length;c++)if(o.tabs[c]!=null){var h,d=o.tabs[c];if(!d.coverage||(h=e._lctf.coverageIndex(d.coverage,i[r]))!=-1){if(o.ltype==1)i[r],d.fmt==1?i[r]=i[r]+d.delta:i[r]=d.newg[h];else if(o.ltype==4)for(var u=d.vals[h],f=0;f<u.length;f++){var g=u[f],v=g.chain.length;if(!(v>l)){for(var p=!0,m=0,x=0;x<v;x++){for(;i[r+m+(1+x)]==-1;)m++;g.chain[x]!=i[r+m+(1+x)]&&(p=!1)}if(p){for(i[r]=g.nglyph,x=0;x<v+m;x++)i[r+x+1]=-1;break}}}else if(o.ltype==5&&d.fmt==2)for(var _=e._lctf.getInterval(d.cDef,i[r]),M=d.cDef[_+2],C=d.scset[M],T=0;T<C.length;T++){var w=C[T],L=w.input;if(!(L.length>l)){for(p=!0,x=0;x<L.length;x++){var b=e._lctf.getInterval(d.cDef,i[r+1+x]);if(_==-1&&d.cDef[b+2]!=L[x]){p=!1;break}}if(p){var y=w.substLookupRecords;for(f=0;f<y.length;f+=2)y[f],y[f+1]}}}else if(o.ltype==6&&d.fmt==3){if(!e.U._glsCovered(i,d.backCvg,r-d.backCvg.length)||!e.U._glsCovered(i,d.inptCvg,r)||!e.U._glsCovered(i,d.ahedCvg,r+d.inptCvg.length))continue;var U=d.lookupRec;for(T=0;T<U.length;T+=2){_=U[T];var P=a[U[T+1]];e.U._applySubs(i,r+_,P,a)}}}}},e.U._glsCovered=function(i,r,o){for(var a=0;a<r.length;a++)if(e._lctf.coverageIndex(r[a],i[o+a])==-1)return!1;return!0},e.U.glyphsToPath=function(i,r,o){for(var a={cmds:[],crds:[]},l=0,c=0;c<r.length;c++){var h=r[c];if(h!=-1){for(var d=c<r.length-1&&r[c+1]!=-1?r[c+1]:0,u=e.U.glyphToPath(i,h),f=0;f<u.crds.length;f+=2)a.crds.push(u.crds[f]+l),a.crds.push(u.crds[f+1]);for(o&&a.cmds.push(o),f=0;f<u.cmds.length;f++)a.cmds.push(u.cmds[f]);o&&a.cmds.push("X"),l+=i.hmtx.aWidth[h],c<r.length-1&&(l+=e.U.getPairAdjustment(i,h,d))}}return a},e.U.P={},e.U.P.moveTo=function(i,r,o){i.cmds.push("M"),i.crds.push(r,o)},e.U.P.lineTo=function(i,r,o){i.cmds.push("L"),i.crds.push(r,o)},e.U.P.curveTo=function(i,r,o,a,l,c,h){i.cmds.push("C"),i.crds.push(r,o,a,l,c,h)},e.U.P.qcurveTo=function(i,r,o,a,l){i.cmds.push("Q"),i.crds.push(r,o,a,l)},e.U.P.closePath=function(i){i.cmds.push("Z")},e.U._drawCFF=function(i,r,o,a,l){for(var c=r.stack,h=r.nStems,d=r.haveWidth,u=r.width,f=r.open,g=0,v=r.x,p=r.y,m=0,x=0,_=0,M=0,C=0,T=0,w=0,L=0,b=0,y=0,U={val:0,size:0};g<i.length;){e.CFF.getCharString(i,g,U);var P=U.val;if(g+=U.size,P=="o1"||P=="o18")c.length%2!=0&&!d&&(u=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,d=!0;else if(P=="o3"||P=="o23")c.length%2!=0&&!d&&(u=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,d=!0;else if(P=="o4")c.length>1&&!d&&(u=c.shift()+a.nominalWidthX,d=!0),f&&e.U.P.closePath(l),p+=c.pop(),e.U.P.moveTo(l,v,p),f=!0;else if(P=="o5")for(;c.length>0;)v+=c.shift(),p+=c.shift(),e.U.P.lineTo(l,v,p);else if(P=="o6"||P=="o7")for(var I=c.length,N=P=="o6",W=0;W<I;W++){var B=c.shift();N?v+=B:p+=B,N=!N,e.U.P.lineTo(l,v,p)}else if(P=="o8"||P=="o24"){I=c.length;for(var se=0;se+6<=I;)m=v+c.shift(),x=p+c.shift(),_=m+c.shift(),M=x+c.shift(),v=_+c.shift(),p=M+c.shift(),e.U.P.curveTo(l,m,x,_,M,v,p),se+=6;P=="o24"&&(v+=c.shift(),p+=c.shift(),e.U.P.lineTo(l,v,p))}else{if(P=="o11")break;if(P=="o1234"||P=="o1235"||P=="o1236"||P=="o1237")P=="o1234"&&(x=p,_=(m=v+c.shift())+c.shift(),y=M=x+c.shift(),T=M,L=p,v=(w=(C=(b=_+c.shift())+c.shift())+c.shift())+c.shift(),e.U.P.curveTo(l,m,x,_,M,b,y),e.U.P.curveTo(l,C,T,w,L,v,p)),P=="o1235"&&(m=v+c.shift(),x=p+c.shift(),_=m+c.shift(),M=x+c.shift(),b=_+c.shift(),y=M+c.shift(),C=b+c.shift(),T=y+c.shift(),w=C+c.shift(),L=T+c.shift(),v=w+c.shift(),p=L+c.shift(),c.shift(),e.U.P.curveTo(l,m,x,_,M,b,y),e.U.P.curveTo(l,C,T,w,L,v,p)),P=="o1236"&&(m=v+c.shift(),x=p+c.shift(),_=m+c.shift(),y=M=x+c.shift(),T=M,w=(C=(b=_+c.shift())+c.shift())+c.shift(),L=T+c.shift(),v=w+c.shift(),e.U.P.curveTo(l,m,x,_,M,b,y),e.U.P.curveTo(l,C,T,w,L,v,p)),P=="o1237"&&(m=v+c.shift(),x=p+c.shift(),_=m+c.shift(),M=x+c.shift(),b=_+c.shift(),y=M+c.shift(),C=b+c.shift(),T=y+c.shift(),w=C+c.shift(),L=T+c.shift(),Math.abs(w-v)>Math.abs(L-p)?v=w+c.shift():p=L+c.shift(),e.U.P.curveTo(l,m,x,_,M,b,y),e.U.P.curveTo(l,C,T,w,L,v,p));else if(P=="o14"){if(c.length>0&&!d&&(u=c.shift()+o.nominalWidthX,d=!0),c.length==4){var j=c.shift(),K=c.shift(),q=c.shift(),F=c.shift(),V=e.CFF.glyphBySE(o,q),ne=e.CFF.glyphBySE(o,F);e.U._drawCFF(o.CharStrings[V],r,o,a,l),r.x=j,r.y=K,e.U._drawCFF(o.CharStrings[ne],r,o,a,l)}f&&(e.U.P.closePath(l),f=!1)}else if(P=="o19"||P=="o20")c.length%2!=0&&!d&&(u=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,d=!0,g+=h+7>>3;else if(P=="o21")c.length>2&&!d&&(u=c.shift()+a.nominalWidthX,d=!0),p+=c.pop(),v+=c.pop(),f&&e.U.P.closePath(l),e.U.P.moveTo(l,v,p),f=!0;else if(P=="o22")c.length>1&&!d&&(u=c.shift()+a.nominalWidthX,d=!0),v+=c.pop(),f&&e.U.P.closePath(l),e.U.P.moveTo(l,v,p),f=!0;else if(P=="o25"){for(;c.length>6;)v+=c.shift(),p+=c.shift(),e.U.P.lineTo(l,v,p);m=v+c.shift(),x=p+c.shift(),_=m+c.shift(),M=x+c.shift(),v=_+c.shift(),p=M+c.shift(),e.U.P.curveTo(l,m,x,_,M,v,p)}else if(P=="o26")for(c.length%2&&(v+=c.shift());c.length>0;)m=v,x=p+c.shift(),v=_=m+c.shift(),p=(M=x+c.shift())+c.shift(),e.U.P.curveTo(l,m,x,_,M,v,p);else if(P=="o27")for(c.length%2&&(p+=c.shift());c.length>0;)x=p,_=(m=v+c.shift())+c.shift(),M=x+c.shift(),v=_+c.shift(),p=M,e.U.P.curveTo(l,m,x,_,M,v,p);else if(P=="o10"||P=="o29"){var O=P=="o10"?a:o;if(c.length==0)console.debug("error: empty stack");else{var k=c.pop(),te=O.Subrs[k+O.Bias];r.x=v,r.y=p,r.nStems=h,r.haveWidth=d,r.width=u,r.open=f,e.U._drawCFF(te,r,o,a,l),v=r.x,p=r.y,h=r.nStems,d=r.haveWidth,u=r.width,f=r.open}}else if(P=="o30"||P=="o31"){var G=c.length,ae=(se=0,P=="o31");for(se+=G-(I=-3&G);se<I;)ae?(x=p,_=(m=v+c.shift())+c.shift(),p=(M=x+c.shift())+c.shift(),I-se==5?(v=_+c.shift(),se++):v=_,ae=!1):(m=v,x=p+c.shift(),_=m+c.shift(),M=x+c.shift(),v=_+c.shift(),I-se==5?(p=M+c.shift(),se++):p=M,ae=!0),e.U.P.curveTo(l,m,x,_,M,v,p),se+=4}else{if((P+"").charAt(0)=="o")throw console.debug("Unknown operation: "+P,i),P;c.push(P)}}}r.x=v,r.y=p,r.nStems=h,r.haveWidth=d,r.width=u,r.open=f};var t=e,n={Typr:t};return s.Typr=t,s.default=n,Object.defineProperty(s,"__esModule",{value:!0}),s}({}).Typr}/*!
Custom bundle of woff2otf (https://github.com/arty-name/woff2otf) with fflate
(https://github.com/101arrowz/fflate) for use in Troika text rendering. 
Original licenses apply: 
- fflate: https://github.com/101arrowz/fflate/blob/master/LICENSE (MIT)
- woff2otf.js: https://github.com/arty-name/woff2otf/blob/master/woff2otf.js (Apache2)
*/function o0(){return function(s){var e=Uint8Array,t=Uint16Array,n=Uint32Array,i=new e([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),r=new e([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),o=new e([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(P,I){for(var N=new t(31),W=0;W<31;++W)N[W]=I+=1<<P[W-1];var B=new n(N[30]);for(W=1;W<30;++W)for(var se=N[W];se<N[W+1];++se)B[se]=se-N[W]<<5|W;return[N,B]},l=a(i,2),c=l[0],h=l[1];c[28]=258,h[258]=28;for(var d=a(r,0)[0],u=new t(32768),f=0;f<32768;++f){var g=(43690&f)>>>1|(21845&f)<<1;g=(61680&(g=(52428&g)>>>2|(13107&g)<<2))>>>4|(3855&g)<<4,u[f]=((65280&g)>>>8|(255&g)<<8)>>>1}var v=function(P,I,N){for(var W=P.length,B=0,se=new t(I);B<W;++B)++se[P[B]-1];var j,K=new t(I);for(B=0;B<I;++B)K[B]=K[B-1]+se[B-1]<<1;{j=new t(1<<I);var q=15-I;for(B=0;B<W;++B)if(P[B])for(var F=B<<4|P[B],V=I-P[B],ne=K[P[B]-1]++<<V,O=ne|(1<<V)-1;ne<=O;++ne)j[u[ne]>>>q]=F}return j},p=new e(288);for(f=0;f<144;++f)p[f]=8;for(f=144;f<256;++f)p[f]=9;for(f=256;f<280;++f)p[f]=7;for(f=280;f<288;++f)p[f]=8;var m=new e(32);for(f=0;f<32;++f)m[f]=5;var x=v(p,9),_=v(m,5),M=function(P){for(var I=P[0],N=1;N<P.length;++N)P[N]>I&&(I=P[N]);return I},C=function(P,I,N){var W=I/8|0;return(P[W]|P[W+1]<<8)>>(7&I)&N},T=function(P,I){var N=I/8|0;return(P[N]|P[N+1]<<8|P[N+2]<<16)>>(7&I)},w=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],L=function(P,I,N){var W=new Error(I||w[P]);if(W.code=P,Error.captureStackTrace&&Error.captureStackTrace(W,L),!N)throw W;return W},b=function(P,I,N){var W=P.length;if(!W||N&&!N.l&&W<5)return I||new e(0);var B=!I||N,se=!N||N.i;N||(N={}),I||(I=new e(3*W));var j,K=function(xe){var Ne=I.length;if(xe>Ne){var We=new e(Math.max(2*Ne,xe));We.set(I),I=We}},q=N.f||0,F=N.p||0,V=N.b||0,ne=N.l,O=N.d,k=N.m,te=N.n,G=8*W;do{if(!ne){N.f=q=C(P,F,1);var ae=C(P,F+1,3);if(F+=3,!ae){var pe=P[(R=((j=F)/8|0)+(7&j&&1)+4)-4]|P[R-3]<<8,_e=R+pe;if(_e>W){se&&L(0);break}B&&K(V+pe),I.set(P.subarray(R,_e),V),N.b=V+=pe,N.p=F=8*_e;continue}if(ae==1)ne=x,O=_,k=9,te=5;else if(ae==2){var D=C(P,F,31)+257,he=C(P,F+10,15)+4,Pe=D+C(P,F+5,31)+1;F+=14;for(var Le=new e(Pe),fe=new e(19),ye=0;ye<he;++ye)fe[o[ye]]=C(P,F+3*ye,7);F+=3*he;var Se=M(fe),de=(1<<Se)-1,Ce=v(fe,Se);for(ye=0;ye<Pe;){var R,S=Ce[C(P,F,de)];if(F+=15&S,(R=S>>>4)<16)Le[ye++]=R;else{var X=0,Z=0;for(R==16?(Z=3+C(P,F,3),F+=2,X=Le[ye-1]):R==17?(Z=3+C(P,F,7),F+=3):R==18&&(Z=11+C(P,F,127),F+=7);Z--;)Le[ye++]=X}}var ie=Le.subarray(0,D),Q=Le.subarray(D);k=M(ie),te=M(Q),ne=v(ie,k),O=v(Q,te)}else L(1);if(F>G){se&&L(0);break}}B&&K(V+131072);for(var we=(1<<k)-1,le=(1<<te)-1,ce=F;;ce=F){var be=(X=ne[T(P,F)&we])>>>4;if((F+=15&X)>G){se&&L(0);break}if(X||L(2),be<256)I[V++]=be;else{if(be==256){ce=F,ne=null;break}var ue=be-254;if(be>264){var Me=i[ye=be-257];ue=C(P,F,(1<<Me)-1)+c[ye],F+=Me}var ke=O[T(P,F)&le],Te=ke>>>4;if(ke||L(3),F+=15&ke,Q=d[Te],Te>3&&(Me=r[Te],Q+=T(P,F)&(1<<Me)-1,F+=Me),F>G){se&&L(0);break}B&&K(V+131072);for(var me=V+ue;V<me;V+=4)I[V]=I[V-Q],I[V+1]=I[V+1-Q],I[V+2]=I[V+2-Q],I[V+3]=I[V+3-Q];V=me}}N.l=ne,N.p=ce,N.b=V,ne&&(q=1,N.m=k,N.d=O,N.n=te)}while(!q);return V==I.length?I:function(xe,Ne,We){(We==null||We>xe.length)&&(We=xe.length);var E=new(xe instanceof t?t:xe instanceof n?n:e)(We-Ne);return E.set(xe.subarray(Ne,We)),E}(I,0,V)},y=new e(0),U=typeof TextDecoder<"u"&&new TextDecoder;try{U.decode(y,{stream:!0})}catch{}return s.convert_streams=function(P){var I=new DataView(P),N=0;function W(){var D=I.getUint16(N);return N+=2,D}function B(){var D=I.getUint32(N);return N+=4,D}function se(D){pe.setUint16(_e,D),_e+=2}function j(D){pe.setUint32(_e,D),_e+=4}for(var K={signature:B(),flavor:B(),length:B(),numTables:W(),reserved:W(),totalSfntSize:B(),majorVersion:W(),minorVersion:W(),metaOffset:B(),metaLength:B(),metaOrigLength:B(),privOffset:B(),privLength:B()},q=0;Math.pow(2,q)<=K.numTables;)q++;q--;for(var F=16*Math.pow(2,q),V=16*K.numTables-F,ne=12,O=[],k=0;k<K.numTables;k++)O.push({tag:B(),offset:B(),compLength:B(),origLength:B(),origChecksum:B()}),ne+=16;var te,G=new Uint8Array(12+16*O.length+O.reduce(function(D,he){return D+he.origLength+4},0)),ae=G.buffer,pe=new DataView(ae),_e=0;return j(K.flavor),se(K.numTables),se(F),se(q),se(V),O.forEach(function(D){j(D.tag),j(D.origChecksum),j(ne),j(D.origLength),D.outOffset=ne,(ne+=D.origLength)%4!=0&&(ne+=4-ne%4)}),O.forEach(function(D){var he,Pe=P.slice(D.offset,D.offset+D.compLength);if(D.compLength!=D.origLength){var Le=new Uint8Array(D.origLength);he=new Uint8Array(Pe,2),b(he,Le)}else Le=new Uint8Array(Pe);G.set(Le,D.outOffset);var fe=0;(ne=D.outOffset+D.origLength)%4!=0&&(fe=4-ne%4),G.set(new Uint8Array(fe).buffer,D.outOffset+D.origLength),te=ne+fe}),ae.slice(0,te)},Object.defineProperty(s,"__esModule",{value:!0}),s}({}).convert_streams}function a0(s,e){const t={M:2,L:2,Q:4,C:6,Z:0},n={C:"18g,ca,368,1kz",D:"17k,6,2,2+4,5+c,2+6,2+1,10+1,9+f,j+11,2+1,a,2,2+1,15+2,3,j+2,6+3,2+8,2,2,2+1,w+a,4+e,3+3,2,3+2,3+5,23+w,2f+4,3,2+9,2,b,2+3,3,1k+9,6+1,3+1,2+2,2+d,30g,p+y,1,1+1g,f+x,2,sd2+1d,jf3+4,f+3,2+4,2+2,b+3,42,2,4+2,2+1,2,3,t+1,9f+w,2,el+2,2+g,d+2,2l,2+1,5,3+1,2+1,2,3,6,16wm+1v",R:"17m+3,2,2,6+3,m,15+2,2+2,h+h,13,3+8,2,2,3+1,2,p+1,x,5+4,5,a,2,2,3,u,c+2,g+1,5,2+1,4+1,5j,6+1,2,b,2+2,f,2+1,1s+2,2,3+1,7,1ez0,2,2+1,4+4,b,4,3,b,42,2+2,4,3,2+1,2,o+3,ae,ep,x,2o+2,3+1,3,5+1,6",L:"x9u,jff,a,fd,jv",T:"4t,gj+33,7o+4,1+1,7c+18,2,2+1,2+1,2,21+a,2,1b+k,h,2u+6,3+5,3+1,2+3,y,2,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,3,7,6+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+d,1,1+1,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,ek,3+1,r+4,1e+4,6+5,2p+c,1+3,1,1+2,1+b,2db+2,3y,2p+v,ff+3,30+1,n9x,1+2,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,5s,6y+2,ea,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+9,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2,2b+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,470+8,at4+4,1o+6,t5,1s+3,2a,f5l+1,2+3,43o+2,a+7,1+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,1,gzau,v+2n,3l+6n"},i=1,r=2,o=4,a=8,l=16,c=32;let h;function d(w){if(!h){const L={R:r,L:i,D:o,C:l,U:c,T:a};h=new Map;for(let b in n){let y=0;n[b].split(",").forEach(U=>{let[P,I]=U.split("+");P=parseInt(P,36),I=I?parseInt(I,36):0,h.set(y+=P,L[b]);for(let N=I;N--;)h.set(++y,L[b])})}}return h.get(w)||c}const u=1,f=2,g=3,v=4,p=[null,"isol","init","fina","medi"];function m(w){const L=new Uint8Array(w.length);let b=c,y=u,U=-1;for(let P=0;P<w.length;P++){const I=w.codePointAt(P);let N=d(I)|0,W=u;N&a||(b&(i|o|l)?N&(r|o|l)?(W=g,(y===u||y===g)&&L[U]++):N&(i|c)&&(y===f||y===v)&&L[U]--:b&(r|c)&&(y===f||y===v)&&L[U]--,y=L[P]=W,b=N,U=P,I>65535&&P++)}return L}function x(w,L){const b=[];for(let U=0;U<L.length;U++){const P=L.codePointAt(U);P>65535&&U++,b.push(s.U.codeToGlyph(w,P))}const y=w.GSUB;if(y){const{lookupList:U,featureList:P}=y;let I;const N=/^(rlig|liga|mset|isol|init|fina|medi|half|pres|blws|ccmp)$/,W=[];P.forEach(B=>{if(N.test(B.tag))for(let se=0;se<B.tab.length;se++){if(W[B.tab[se]])continue;W[B.tab[se]]=!0;const j=U[B.tab[se]],K=/^(isol|init|fina|medi)$/.test(B.tag);K&&!I&&(I=m(L));for(let q=0;q<b.length;q++)(!I||!K||p[I[q]]===B.tag)&&s.U._applySubs(b,q,j,U)}})}return b}function _(w,L){const b=new Int16Array(L.length*3);let y=0;for(;y<L.length;y++){const N=L[y];if(N===-1)continue;b[y*3+2]=w.hmtx.aWidth[N];const W=w.GPOS;if(W){const B=W.lookupList;for(let se=0;se<B.length;se++){const j=B[se];for(let K=0;K<j.tabs.length;K++){const q=j.tabs[K];if(j.ltype===1){if(s._lctf.coverageIndex(q.coverage,N)!==-1&&q.pos){I(q.pos,y);break}}else if(j.ltype===2){let F=null,V=U();if(V!==-1){const ne=s._lctf.coverageIndex(q.coverage,L[V]);if(ne!==-1){if(q.fmt===1){const O=q.pairsets[ne];for(let k=0;k<O.length;k++)O[k].gid2===N&&(F=O[k])}else if(q.fmt===2){const O=s.U._getGlyphClass(L[V],q.classDef1),k=s.U._getGlyphClass(N,q.classDef2);F=q.matrix[O][k]}if(F){F.val1&&I(F.val1,V),F.val2&&I(F.val2,y);break}}}}else if(j.ltype===4){const F=s._lctf.coverageIndex(q.markCoverage,N);if(F!==-1){const V=U(P),ne=V===-1?-1:s._lctf.coverageIndex(q.baseCoverage,L[V]);if(ne!==-1){const O=q.markArray[F],k=q.baseArray[ne][O.markClass];b[y*3]=k.x-O.x+b[V*3]-b[V*3+2],b[y*3+1]=k.y-O.y+b[V*3+1];break}}}else if(j.ltype===6){const F=s._lctf.coverageIndex(q.mark1Coverage,N);if(F!==-1){const V=U();if(V!==-1){const ne=L[V];if(M(w,ne)===3){const O=s._lctf.coverageIndex(q.mark2Coverage,ne);if(O!==-1){const k=q.mark1Array[F],te=q.mark2Array[O][k.markClass];b[y*3]=te.x-k.x+b[V*3]-b[V*3+2],b[y*3+1]=te.y-k.y+b[V*3+1];break}}}}}}}}else if(w.kern&&!w.cff){const B=U();if(B!==-1){const se=w.kern.glyph1.indexOf(L[B]);if(se!==-1){const j=w.kern.rval[se].glyph2.indexOf(N);j!==-1&&(b[B*3+2]+=w.kern.rval[se].vals[j])}}}}return b;function U(N){for(let W=y-1;W>=0;W--)if(L[W]!==-1&&(!N||N(L[W])))return W;return-1}function P(N){return M(w,N)===1}function I(N,W){for(let B=0;B<3;B++)b[W*3+B]+=N[B]||0}}function M(w,L){const b=w.GDEF&&w.GDEF.glyphClassDef;return b?s.U._getGlyphClass(L,b):0}function C(...w){for(let L=0;L<w.length;L++)if(typeof w[L]=="number")return w[L]}function T(w){const L=Object.create(null),b=w["OS/2"],y=w.hhea,U=w.head.unitsPerEm,P=C(b&&b.sTypoAscender,y&&y.ascender,U),I={unitsPerEm:U,ascender:P,descender:C(b&&b.sTypoDescender,y&&y.descender,0),capHeight:C(b&&b.sCapHeight,P),xHeight:C(b&&b.sxHeight,P),lineGap:C(b&&b.sTypoLineGap,y&&y.lineGap),supportsCodePoint(N){return s.U.codeToGlyph(w,N)>0},forEachGlyph(N,W,B,se){let j=0;const K=1/I.unitsPerEm*W,q=x(w,N);let F=0;const V=_(w,q);return q.forEach((ne,O)=>{if(ne!==-1){let k=L[ne];if(!k){const{cmds:te,crds:G}=s.U.glyphToPath(w,ne);let ae="",pe=0;for(let Le=0,fe=te.length;Le<fe;Le++){const ye=t[te[Le]];ae+=te[Le];for(let Se=1;Se<=ye;Se++)ae+=(Se>1?",":"")+G[pe++]}let _e,D,he,Pe;if(G.length){_e=D=1/0,he=Pe=-1/0;for(let Le=0,fe=G.length;Le<fe;Le+=2){let ye=G[Le],Se=G[Le+1];ye<_e&&(_e=ye),Se<D&&(D=Se),ye>he&&(he=ye),Se>Pe&&(Pe=Se)}}else _e=he=D=Pe=0;k=L[ne]={index:ne,advanceWidth:w.hmtx.aWidth[ne],xMin:_e,yMin:D,xMax:he,yMax:Pe,path:ae}}se.call(null,k,j+V[O*3]*K,V[O*3+1]*K,F),j+=V[O*3+2]*K,B&&(j+=B*W)}F+=N.codePointAt(F)>65535?2:1}),j}};return I}return function(L){const b=new Uint8Array(L,0,4),y=s._bin.readASCII(b,0,4);if(y==="wOFF")L=e(L);else if(y==="wOF2")throw new Error("woff2 fonts not supported");return T(s.parse(L)[0])}}const l0=Yi({name:"Typr Font Parser",dependencies:[s0,o0,a0],init(s,e,t){const n=s(),i=e();return t(n,i)}});/*!
Custom bundle of @unicode-font-resolver/client v1.0.2 (https://github.com/lojjic/unicode-font-resolver)
for use in Troika text rendering. 
Original MIT license applies
*/function c0(){return function(s){var e=function(){this.buckets=new Map};e.prototype.add=function(_){var M=_>>5;this.buckets.set(M,(this.buckets.get(M)||0)|1<<(31&_))},e.prototype.has=function(_){var M=this.buckets.get(_>>5);return M!==void 0&&(M&1<<(31&_))!=0},e.prototype.serialize=function(){var _=[];return this.buckets.forEach(function(M,C){_.push((+C).toString(36)+":"+M.toString(36))}),_.join(",")},e.prototype.deserialize=function(_){var M=this;this.buckets.clear(),_.split(",").forEach(function(C){var T=C.split(":");M.buckets.set(parseInt(T[0],36),parseInt(T[1],36))})};var t=Math.pow(2,8),n=t-1,i=~n;function r(_){var M=function(T){return T&i}(_).toString(16),C=function(T){return(T&i)+t-1}(_).toString(16);return"codepoint-index/plane"+(_>>16)+"/"+M+"-"+C+".json"}function o(_,M){var C=_&n,T=M.codePointAt(C/6|0);return((T=(T||48)-48)&1<<C%6)!=0}function a(_,M){var C;(C=_,C.replace(/U\+/gi,"").replace(/^,+|,+$/g,"").split(/,+/).map(function(T){return T.split("-").map(function(w){return parseInt(w.trim(),16)})})).forEach(function(T){var w=T[0],L=T[1];L===void 0&&(L=w),M(w,L)})}function l(_,M){a(_,function(C,T){for(var w=C;w<=T;w++)M(w)})}var c={},h={},d=new WeakMap,u="https://cdn.jsdelivr.net/gh/lojjic/unicode-font-resolver@v1.0.1/packages/data";function f(_){var M=d.get(_);return M||(M=new e,l(_.ranges,function(C){return M.add(C)}),d.set(_,M)),M}var g,v=new Map;function p(_,M,C){return _[M]?M:_[C]?C:function(T){for(var w in T)return w}(_)}function m(_,M){var C=M;if(!_.includes(C)){C=1/0;for(var T=0;T<_.length;T++)Math.abs(_[T]-M)<Math.abs(C-M)&&(C=_[T])}return C}function x(_){return g||(g=new Set,l("9-D,20,85,A0,1680,2000-200A,2028-202F,205F,3000",function(M){g.add(M)})),g.has(_)}return s.CodePointSet=e,s.clearCache=function(){c={},h={}},s.getFontsForString=function(_,M){M===void 0&&(M={});var C,T=M.lang;T===void 0&&(T=new RegExp("\\p{Script=Hangul}","u").test(C=_)?"ko":new RegExp("\\p{Script=Hiragana}|\\p{Script=Katakana}","u").test(C)?"ja":"en");var w=M.category;w===void 0&&(w="sans-serif");var L=M.style;L===void 0&&(L="normal");var b=M.weight;b===void 0&&(b=400);var y=(M.dataUrl||u).replace(/\/$/g,""),U=new Map,P=new Uint8Array(_.length),I={},N={},W=new Array(_.length),B=new Map,se=!1;function j(F){var V=v.get(F);return V||(V=fetch(y+"/"+F).then(function(ne){if(!ne.ok)throw new Error(ne.statusText);return ne.json().then(function(O){if(!Array.isArray(O)||O[0]!==1)throw new Error("Incorrect schema version; need 1, got "+O[0]);return O[1]})}).catch(function(ne){if(y!==u)return se||(console.error('unicode-font-resolver: Failed loading from dataUrl "'+y+'", trying default CDN. '+ne.message),se=!0),y=u,v.delete(F),j(F);throw ne}),v.set(F,V)),V}for(var K=function(F){var V=_.codePointAt(F),ne=r(V);W[F]=ne,c[ne]||B.has(ne)||B.set(ne,j(ne).then(function(O){c[ne]=O})),V>65535&&(F++,q=F)},q=0;q<_.length;q++)K(q);return Promise.all(B.values()).then(function(){B.clear();for(var F=function(ne){var O=_.codePointAt(ne),k=null,te=c[W[ne]],G=void 0;for(var ae in te){var pe=N[ae];if(pe===void 0&&(pe=N[ae]=new RegExp(ae).test(T||"en")),pe){for(var _e in G=ae,te[ae])if(o(O,te[ae][_e])){k=_e;break}break}}if(!k){e:for(var D in te)if(D!==G){for(var he in te[D])if(o(O,te[D][he])){k=he;break e}}}k||(console.debug("No font coverage for U+"+O.toString(16)),k="latin"),W[ne]=k,h[k]||B.has(k)||B.set(k,j("font-meta/"+k+".json").then(function(Pe){h[k]=Pe})),O>65535&&(ne++,V=ne)},V=0;V<_.length;V++)F(V);return Promise.all(B.values())}).then(function(){for(var F,V=null,ne=0;ne<_.length;ne++){var O=_.codePointAt(ne);if(V&&(x(O)||f(V).has(O)))P[ne]=P[ne-1];else{V=h[W[ne]];var k=I[V.id];if(!k){var te=V.typeforms,G=p(te,w,"sans-serif"),ae=p(te[G],L,"normal"),pe=m((F=te[G])===null||F===void 0?void 0:F[ae],b);k=I[V.id]=y+"/font-files/"+V.id+"/"+G+"."+ae+"."+pe+".woff"}var _e=U.get(k);_e==null&&(_e=U.size,U.set(k,_e)),P[ne]=_e}O>65535&&(ne++,P[ne]=P[ne-1])}return{fontUrls:Array.from(U.keys()),chars:P}})},Object.defineProperty(s,"__esModule",{value:!0}),s}({})}function h0(s,e){const t=Object.create(null),n=Object.create(null);function i(o,a){const l=c=>{console.error(`Failure loading font ${o}`,c)};try{const c=new XMLHttpRequest;c.open("get",o,!0),c.responseType="arraybuffer",c.onload=function(){if(c.status>=400)l(new Error(c.statusText));else if(c.status>0)try{const h=s(c.response);h.src=o,a(h)}catch(h){l(h)}},c.onerror=l,c.send()}catch(c){l(c)}}function r(o,a){let l=t[o];l?a(l):n[o]?n[o].push(a):(n[o]=[a],i(o,c=>{c.src=o,t[o]=c,n[o].forEach(h=>h(c)),delete n[o]}))}return function(o,a,{lang:l,fonts:c=[],style:h="normal",weight:d="normal",unicodeFontsURL:u}={}){const f=new Uint8Array(o.length),g=[];o.length||x();const v=new Map,p=[];if(h!=="italic"&&(h="normal"),typeof d!="number"&&(d=d==="bold"?700:400),c&&!Array.isArray(c)&&(c=[c]),c=c.slice().filter(M=>!M.lang||M.lang.test(l)).reverse(),c.length){let w=0;(function L(b=0){for(let y=b,U=o.length;y<U;y++){const P=o.codePointAt(y);if(w===1&&g[f[y-1]].supportsCodePoint(P)||y>0&&/\s/.test(o[y]))f[y]=f[y-1],w===2&&(p[p.length-1][1]=y);else for(let I=f[y],N=c.length;I<=N;I++)if(I===N){const W=w===2?p[p.length-1]:p[p.length]=[y,y];W[1]=y,w=2}else{f[y]=I;const{src:W,unicodeRange:B}=c[I];if(!B||_(P,B)){const se=t[W];if(!se){r(W,()=>{L(y)});return}if(se.supportsCodePoint(P)){let j=v.get(se);typeof j!="number"&&(j=g.length,g.push(se),v.set(se,j)),f[y]=j,w=1;break}}}P>65535&&y+1<U&&(f[y+1]=f[y],y++,w===2&&(p[p.length-1][1]=y))}m()})()}else p.push([0,o.length-1]),m();function m(){if(p.length){const M=p.map(C=>o.substring(C[0],C[1]+1)).join(`
`);e.getFontsForString(M,{lang:l||void 0,style:h,weight:d,dataUrl:u}).then(({fontUrls:C,chars:T})=>{const w=g.length;let L=0;p.forEach(y=>{for(let U=0,P=y[1]-y[0];U<=P;U++)f[y[0]+U]=T[L++]+w;L++});let b=0;C.forEach((y,U)=>{r(y,P=>{g[U+w]=P,++b===C.length&&x()})})})}else x()}function x(){a({chars:f,fonts:g})}function _(M,C){for(let T=0;T<C.length;T++){const[w,L=w]=C[T];if(w<=M&&M<=L)return!0}return!1}}}const u0=Yi({name:"FontResolver",dependencies:[h0,l0,c0],init(s,e,t){return s(e,t())}});function d0(s,e){const n=/[\u00AD\u034F\u061C\u115F-\u1160\u17B4-\u17B5\u180B-\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFF8]/,i="[^\\S\\u00A0]",r=new RegExp(`${i}|[\\-\\u007C\\u00AD\\u2010\\u2012-\\u2014\\u2027\\u2056\\u2E17\\u2E40]`);function o({text:g,lang:v,fonts:p,style:m,weight:x,preResolvedFonts:_,unicodeFontsURL:M},C){const T=({chars:w,fonts:L})=>{let b,y;const U=[];for(let P=0;P<w.length;P++)w[P]!==y?(y=w[P],U.push(b={start:P,end:P,fontObj:L[w[P]]})):b.end=P;C(U)};_?T(_):s(g,T,{lang:v,fonts:p,style:m,weight:x,unicodeFontsURL:M})}function a({text:g="",font:v,lang:p,sdfGlyphSize:m=64,fontSize:x=400,fontWeight:_=1,fontStyle:M="normal",letterSpacing:C=0,lineHeight:T="normal",maxWidth:w=1/0,direction:L,textAlign:b="left",textIndent:y=0,whiteSpace:U="normal",overflowWrap:P="normal",anchorX:I=0,anchorY:N=0,metricsOnly:W=!1,unicodeFontsURL:B,preResolvedFonts:se=null,includeCaretPositions:j=!1,chunkedBoundsSize:K=8192,colorRanges:q=null},F){const V=d(),ne={fontLoad:0,typesetting:0};g.indexOf("\r")>-1&&(console.info("Typesetter: got text with \\r chars; normalizing to \\n"),g=g.replace(/\r\n/g,`
`).replace(/\r/g,`
`)),x=+x,C=+C,w=+w,T=T||"normal",y=+y,o({text:g,lang:p,style:M,weight:_,fonts:typeof v=="string"?[{src:v}]:v,unicodeFontsURL:B,preResolvedFonts:se},O=>{ne.fontLoad=d()-V;const k=isFinite(w);let te=null,G=null,ae=null,pe=null,_e=null,D=null,he=null,Pe=null,Le=0,fe=0,ye=U!=="nowrap";const Se=new Map,de=d();let Ce=y,R=0,S=new u;const X=[S];O.forEach(le=>{const{fontObj:ce}=le,{ascender:be,descender:ue,unitsPerEm:Me,lineGap:ke,capHeight:Te,xHeight:me}=ce;let xe=Se.get(ce);if(!xe){const z=x/Me,ee=T==="normal"?(be-ue+ke)*z:T*x,ge=(ee-(be-ue)*z)/2,Ae=Math.min(ee,(be-ue)*z),Re=(be+ue)/2*z+Ae/2;xe={index:Se.size,src:ce.src,fontObj:ce,fontSizeMult:z,unitsPerEm:Me,ascender:be*z,descender:ue*z,capHeight:Te*z,xHeight:me*z,lineHeight:ee,baseline:-ge-be*z,caretTop:Re,caretBottom:Re-Ae},Se.set(ce,xe)}const{fontSizeMult:Ne}=xe,We=g.slice(le.start,le.end+1);let E,$;ce.forEachGlyph(We,x,C,(z,ee,ge,Ae)=>{ee+=R,Ae+=le.start,E=ee,$=z;const Re=g.charAt(Ae),je=z.advanceWidth*Ne,Xe=S.count;let De;if("isEmpty"in z||(z.isWhitespace=!!Re&&new RegExp(i).test(Re),z.canBreakAfter=!!Re&&r.test(Re),z.isEmpty=z.xMin===z.xMax||z.yMin===z.yMax||n.test(Re)),!z.isWhitespace&&!z.isEmpty&&fe++,ye&&k&&!z.isWhitespace&&ee+je+Ce>w&&Xe){if(S.glyphAt(Xe-1).glyphObj.canBreakAfter)De=new u,Ce=-ee;else for(let Je=Xe;Je--;)if(Je===0&&P==="break-word"){De=new u,Ce=-ee;break}else if(S.glyphAt(Je).glyphObj.canBreakAfter){De=S.splitAt(Je+1);const tt=De.glyphAt(0).x;Ce-=tt;for(let $e=De.count;$e--;)De.glyphAt($e).x-=tt;break}De&&(S.isSoftWrapped=!0,S=De,X.push(S),Le=w)}let Ye=S.glyphAt(S.count);Ye.glyphObj=z,Ye.x=ee+Ce,Ye.y=ge,Ye.width=je,Ye.charIndex=Ae,Ye.fontData=xe,Re===`
`&&(S=new u,X.push(S),Ce=-(ee+je+C*x)+y)}),R=E+$.advanceWidth*Ne+C*x});let Z=0;X.forEach(le=>{let ce=!0;for(let be=le.count;be--;){const ue=le.glyphAt(be);ce&&!ue.glyphObj.isWhitespace&&(le.width=ue.x+ue.width,le.width>Le&&(Le=le.width),ce=!1);let{lineHeight:Me,capHeight:ke,xHeight:Te,baseline:me}=ue.fontData;Me>le.lineHeight&&(le.lineHeight=Me);const xe=me-le.baseline;xe<0&&(le.baseline+=xe,le.cap+=xe,le.ex+=xe),le.cap=Math.max(le.cap,le.baseline+ke),le.ex=Math.max(le.ex,le.baseline+Te)}le.baseline-=Z,le.cap-=Z,le.ex-=Z,Z+=le.lineHeight});let ie=0,Q=0;if(I&&(typeof I=="number"?ie=-I:typeof I=="string"&&(ie=-Le*(I==="left"?0:I==="center"?.5:I==="right"?1:c(I)))),N&&(typeof N=="number"?Q=-N:typeof N=="string"&&(Q=N==="top"?0:N==="top-baseline"?-X[0].baseline:N==="top-cap"?-X[0].cap:N==="top-ex"?-X[0].ex:N==="middle"?Z/2:N==="bottom"?Z:N==="bottom-baseline"?-X[X.length-1].baseline:c(N)*Z)),!W){const le=e.getEmbeddingLevels(g,L);te=new Uint16Array(fe),G=new Uint8Array(fe),ae=new Float32Array(fe*2),pe={},he=[1/0,1/0,-1/0,-1/0],Pe=[],j&&(D=new Float32Array(g.length*4)),q&&(_e=new Uint8Array(fe*3));let ce=0,be=-1,ue=-1,Me,ke;if(X.forEach((Te,me)=>{let{count:xe,width:Ne}=Te;if(xe>0){let We=0;for(let Ae=xe;Ae--&&Te.glyphAt(Ae).glyphObj.isWhitespace;)We++;let E=0,$=0;if(b==="center")E=(Le-Ne)/2;else if(b==="right")E=Le-Ne;else if(b==="justify"&&Te.isSoftWrapped){let Ae=0;for(let Re=xe-We;Re--;)Te.glyphAt(Re).glyphObj.isWhitespace&&Ae++;$=(Le-Ne)/Ae}if($||E){let Ae=0;for(let Re=0;Re<xe;Re++){let je=Te.glyphAt(Re);const Xe=je.glyphObj;je.x+=E+Ae,$!==0&&Xe.isWhitespace&&Re<xe-We&&(Ae+=$,je.width+=$)}}const z=e.getReorderSegments(g,le,Te.glyphAt(0).charIndex,Te.glyphAt(Te.count-1).charIndex);for(let Ae=0;Ae<z.length;Ae++){const[Re,je]=z[Ae];let Xe=1/0,De=-1/0;for(let Ye=0;Ye<xe;Ye++)if(Te.glyphAt(Ye).charIndex>=Re){let Je=Ye,tt=Ye;for(;tt<xe;tt++){let $e=Te.glyphAt(tt);if($e.charIndex>je)break;tt<xe-We&&(Xe=Math.min(Xe,$e.x),De=Math.max(De,$e.x+$e.width))}for(let $e=Je;$e<tt;$e++){const lt=Te.glyphAt($e);lt.x=De-(lt.x+lt.width-Xe)}break}}let ee;const ge=Ae=>ee=Ae;for(let Ae=0;Ae<xe;Ae++){const Re=Te.glyphAt(Ae);ee=Re.glyphObj;const je=ee.index,Xe=le.levels[Re.charIndex]&1;if(Xe){const De=e.getMirroredCharacter(g[Re.charIndex]);De&&Re.fontData.fontObj.forEachGlyph(De,0,0,ge)}if(j){const{charIndex:De,fontData:Ye}=Re,Je=Re.x+ie,tt=Re.x+Re.width+ie;D[De*4]=Xe?tt:Je,D[De*4+1]=Xe?Je:tt,D[De*4+2]=Te.baseline+Ye.caretBottom+Q,D[De*4+3]=Te.baseline+Ye.caretTop+Q;const $e=De-be;$e>1&&h(D,be,$e),be=De}if(q){const{charIndex:De}=Re;for(;De>ue;)ue++,q.hasOwnProperty(ue)&&(ke=q[ue])}if(!ee.isWhitespace&&!ee.isEmpty){const De=ce++,{fontSizeMult:Ye,src:Je,index:tt}=Re.fontData,$e=pe[Je]||(pe[Je]={});$e[je]||($e[je]={path:ee.path,pathBounds:[ee.xMin,ee.yMin,ee.xMax,ee.yMax]});const lt=Re.x+ie,bt=Re.y+Te.baseline+Q;ae[De*2]=lt,ae[De*2+1]=bt;const gt=lt+ee.xMin*Ye,qt=bt+ee.yMin*Ye,Ht=lt+ee.xMax*Ye,Vt=bt+ee.yMax*Ye;gt<he[0]&&(he[0]=gt),qt<he[1]&&(he[1]=qt),Ht>he[2]&&(he[2]=Ht),Vt>he[3]&&(he[3]=Vt),De%K===0&&(Me={start:De,end:De,rect:[1/0,1/0,-1/0,-1/0]},Pe.push(Me)),Me.end++;const ft=Me.rect;if(gt<ft[0]&&(ft[0]=gt),qt<ft[1]&&(ft[1]=qt),Ht>ft[2]&&(ft[2]=Ht),Vt>ft[3]&&(ft[3]=Vt),te[De]=je,G[De]=tt,q){const cn=De*3;_e[cn]=ke>>16&255,_e[cn+1]=ke>>8&255,_e[cn+2]=ke&255}}}}}),D){const Te=g.length-be;Te>1&&h(D,be,Te)}}const we=[];Se.forEach(({index:le,src:ce,unitsPerEm:be,ascender:ue,descender:Me,lineHeight:ke,capHeight:Te,xHeight:me})=>{we[le]={src:ce,unitsPerEm:be,ascender:ue,descender:Me,lineHeight:ke,capHeight:Te,xHeight:me}}),ne.typesetting=d()-de,F({glyphIds:te,glyphFontIndices:G,glyphPositions:ae,glyphData:pe,fontData:we,caretPositions:D,glyphColors:_e,chunkedBounds:Pe,fontSize:x,topBaseline:Q+X[0].baseline,blockBounds:[ie,Q-Z,ie+Le,Q],visibleBounds:he,timings:ne})})}function l(g,v){a({...g,metricsOnly:!0},p=>{const[m,x,_,M]=p.blockBounds;v({width:_-m,height:M-x})})}function c(g){let v=g.match(/^([\d.]+)%$/),p=v?parseFloat(v[1]):NaN;return isNaN(p)?0:p/100}function h(g,v,p){const m=g[v*4],x=g[v*4+1],_=g[v*4+2],M=g[v*4+3],C=(x-m)/p;for(let T=0;T<p;T++){const w=(v+T)*4;g[w]=m+C*T,g[w+1]=m+C*(T+1),g[w+2]=_,g[w+3]=M}}function d(){return(self.performance||Date).now()}function u(){this.data=[]}const f=["glyphObj","x","y","width","charIndex","fontData"];return u.prototype={width:0,lineHeight:0,baseline:0,cap:0,ex:0,isSoftWrapped:!1,get count(){return Math.ceil(this.data.length/f.length)},glyphAt(g){let v=u.flyweight;return v.data=this.data,v.index=g,v},splitAt(g){let v=new u;return v.data=this.data.splice(g*f.length),v}},u.flyweight=f.reduce((g,v,p,m)=>(Object.defineProperty(g,v,{get(){return this.data[this.index*f.length+p]},set(x){this.data[this.index*f.length+p]=x}}),g),{data:null,index:0}),{typeset:a,measure:l}}const ni=()=>(self.performance||Date).now(),Fs=Uh();let Sc;function f0(s,e,t,n,i,r,o,a,l,c,h=!0){return h?m0(s,e,t,n,i,r,o,a,l,c).then(null,d=>(Sc||(console.warn("WebGL SDF generation failed, falling back to JS",d),Sc=!0),Ec(s,e,t,n,i,r,o,a,l,c))):Ec(s,e,t,n,i,r,o,a,l,c)}const gs=[],p0=5;let qo=0;function Ih(){const s=ni();for(;gs.length&&ni()-s<p0;)gs.shift()();qo=gs.length?setTimeout(Ih,0):0}const m0=(...s)=>new Promise((e,t)=>{gs.push(()=>{const n=ni();try{Fs.webgl.generateIntoCanvas(...s),e({timing:ni()-n})}catch(i){t(i)}}),qo||(qo=setTimeout(Ih,0))}),g0=4,v0=2e3,Mc={};let _0=0;function Ec(s,e,t,n,i,r,o,a,l,c){const h="TroikaTextSDFGenerator_JS_"+_0++%g0;let d=Mc[h];return d||(d=Mc[h]={workerModule:Yi({name:h,workerId:h,dependencies:[Uh,ni],init(u,f){const g=u().javascript.generate;return function(...v){const p=f();return{textureData:g(...v),timing:f()-p}}},getTransferables(u){return[u.textureData.buffer]}}),requests:0,idleTimer:null}),d.requests++,clearTimeout(d.idleTimer),d.workerModule(s,e,t,n,i,r).then(({textureData:u,timing:f})=>{const g=ni(),v=new Uint8Array(u.length*4);for(let p=0;p<u.length;p++)v[p*4+c]=u[p];return Fs.webglUtils.renderImageData(o,v,a,l,s,e,1<<3-c),f+=ni()-g,--d.requests===0&&(d.idleTimer=setTimeout(()=>{K_(h)},v0)),{timing:f}})}function x0(s){s._warm||(Fs.webgl.isSupported(s),s._warm=!0)}const y0=Fs.webglUtils.resizeWebGLCanvasWithoutClearing,pr={unicodeFontsURL:null,sdfGlyphSize:64,sdfMargin:1/16,sdfExponent:9,textureWidth:2048},b0=new Ve;function Ci(){return(self.performance||Date).now()}const wc=Object.create(null);function S0(s,e){s=E0({},s);const t=Ci(),n=[];if(s.font&&n.push({label:"user",src:w0(s.font)}),s.font=n,s.text=""+s.text,s.sdfGlyphSize=s.sdfGlyphSize||pr.sdfGlyphSize,s.unicodeFontsURL=s.unicodeFontsURL||pr.unicodeFontsURL,s.colorRanges!=null){let u={};for(let f in s.colorRanges)if(s.colorRanges.hasOwnProperty(f)){let g=s.colorRanges[f];typeof g!="number"&&(g=b0.set(g).getHex()),u[f]=g}s.colorRanges=u}Object.freeze(s);const{textureWidth:i,sdfExponent:r}=pr,{sdfGlyphSize:o}=s,a=i/o*4;let l=wc[o];if(!l){const u=document.createElement("canvas");u.width=i,u.height=o*256/a,l=wc[o]={glyphCount:0,sdfGlyphSize:o,sdfCanvas:u,sdfTexture:new Tt(u,void 0,void 0,void 0,Bt,Bt),contextLost:!1,glyphsByFont:new Map},l.sdfTexture.generateMipmaps=!1,M0(l)}const{sdfTexture:c,sdfCanvas:h}=l;Oh(s).then(u=>{const{glyphIds:f,glyphFontIndices:g,fontData:v,glyphPositions:p,fontSize:m,timings:x}=u,_=[],M=new Float32Array(f.length*4);let C=0,T=0;const w=Ci(),L=v.map(I=>{let N=l.glyphsByFont.get(I.src);return N||l.glyphsByFont.set(I.src,N=new Map),N});f.forEach((I,N)=>{const W=g[N],{src:B,unitsPerEm:se}=v[W];let j=L[W].get(I);if(!j){const{path:ne,pathBounds:O}=u.glyphData[B][I],k=Math.max(O[2]-O[0],O[3]-O[1])/o*(pr.sdfMargin*o+.5),te=l.glyphCount++,G=[O[0]-k,O[1]-k,O[2]+k,O[3]+k];L[W].set(I,j={path:ne,atlasIndex:te,sdfViewBox:G}),_.push(j)}const{sdfViewBox:K}=j,q=p[T++],F=p[T++],V=m/se;M[C++]=q+K[0]*V,M[C++]=F+K[1]*V,M[C++]=q+K[2]*V,M[C++]=F+K[3]*V,f[N]=j.atlasIndex}),x.quads=(x.quads||0)+(Ci()-w);const b=Ci();x.sdf={};const y=h.height,U=Math.ceil(l.glyphCount/a),P=Math.pow(2,Math.ceil(Math.log2(U*o)));P>y&&(console.info(`Increasing SDF texture size ${y}->${P}`),y0(h,i,P),c.dispose()),Promise.all(_.map(I=>Fh(I,l,s.gpuAccelerateSDF).then(({timing:N})=>{x.sdf[I.atlasIndex]=N}))).then(()=>{_.length&&!l.contextLost&&(Nh(l),c.needsUpdate=!0),x.sdfTotal=Ci()-b,x.total=Ci()-t,e(Object.freeze({parameters:s,sdfTexture:c,sdfGlyphSize:o,sdfExponent:r,glyphBounds:M,glyphAtlasIndices:f,glyphColors:u.glyphColors,caretPositions:u.caretPositions,chunkedBounds:u.chunkedBounds,ascender:u.ascender,descender:u.descender,lineHeight:u.lineHeight,capHeight:u.capHeight,xHeight:u.xHeight,topBaseline:u.topBaseline,blockBounds:u.blockBounds,visibleBounds:u.visibleBounds,timings:u.timings}))})}),Promise.resolve().then(()=>{l.contextLost||x0(h)})}function Fh({path:s,atlasIndex:e,sdfViewBox:t},{sdfGlyphSize:n,sdfCanvas:i,contextLost:r},o){if(r)return Promise.resolve({timing:-1});const{textureWidth:a,sdfExponent:l}=pr,c=Math.max(t[2]-t[0],t[3]-t[1]),h=Math.floor(e/4),d=h%(a/n)*n,u=Math.floor(h/(a/n))*n,f=e%4;return f0(n,n,s,t,c,l,i,d,u,f,o)}function M0(s){const e=s.sdfCanvas;e.addEventListener("webglcontextlost",t=>{console.log("Context Lost",t),t.preventDefault(),s.contextLost=!0}),e.addEventListener("webglcontextrestored",t=>{console.log("Context Restored",t),s.contextLost=!1;const n=[];s.glyphsByFont.forEach(i=>{i.forEach(r=>{n.push(Fh(r,s,!0))})}),Promise.all(n).then(()=>{Nh(s),s.sdfTexture.needsUpdate=!0})})}function E0(s,e){for(let t in e)e.hasOwnProperty(t)&&(s[t]=e[t]);return s}let cs;function w0(s){return cs||(cs=typeof document>"u"?{}:document.createElement("a")),cs.href=s,cs.href}function Nh(s){if(typeof createImageBitmap!="function"){console.info("Safari<15: applying SDF canvas workaround");const{sdfCanvas:e,sdfTexture:t}=s,{width:n,height:i}=e,r=s.sdfCanvas.getContext("webgl");let o=t.image.data;(!o||o.length!==n*i*4)&&(o=new Uint8Array(n*i*4),t.image={width:n,height:i,data:o},t.flipY=!1,t.isDataTexture=!0),r.readPixels(0,0,n,i,r.RGBA,r.UNSIGNED_BYTE,o)}}const T0=Yi({name:"Typesetter",dependencies:[d0,u0,J_],init(s,e,t){return s(e,t())}}),Oh=Yi({name:"Typesetter",dependencies:[T0],init(s){return function(e){return new Promise(t=>{s.typeset(e,t)})}},getTransferables(s){const e=[];for(let t in s)s[t]&&s[t].buffer&&e.push(s[t].buffer);return e}});Oh.onMainThread;const Tc={};function A0(s){let e=Tc[s];return e||(e=Tc[s]=new oi(1,1,s,s).translate(.5,.5,0)),e}const C0="aTroikaGlyphBounds",Ac="aTroikaGlyphIndex",R0="aTroikaGlyphColor";class P0 extends f_{constructor(){super(),this.detail=1,this.curveRadius=0,this.groups=[{start:0,count:1/0,materialIndex:0},{start:0,count:1/0,materialIndex:1}],this.boundingSphere=new si,this.boundingBox=new Sn}computeBoundingSphere(){}computeBoundingBox(){}set detail(e){if(e!==this._detail){this._detail=e,(typeof e!="number"||e<1)&&(e=1);let t=A0(e);["position","normal","uv"].forEach(n=>{this.attributes[n]=t.attributes[n].clone()}),this.setIndex(t.getIndex().clone())}}get detail(){return this._detail}set curveRadius(e){e!==this._curveRadius&&(this._curveRadius=e,this._updateBounds())}get curveRadius(){return this._curveRadius}updateGlyphs(e,t,n,i,r){this.updateAttributeData(C0,e,4),this.updateAttributeData(Ac,t,1),this.updateAttributeData(R0,r,3),this._blockBounds=n,this._chunkedBounds=i,this.instanceCount=t.length,this._updateBounds()}_updateBounds(){const e=this._blockBounds;if(e){const{curveRadius:t,boundingBox:n}=this;if(t){const{PI:i,floor:r,min:o,max:a,sin:l,cos:c}=Math,h=i/2,d=i*2,u=Math.abs(t),f=e[0]/u,g=e[2]/u,v=r((f+h)/d)!==r((g+h)/d)?-u:o(l(f)*u,l(g)*u),p=r((f-h)/d)!==r((g-h)/d)?u:a(l(f)*u,l(g)*u),m=r((f+i)/d)!==r((g+i)/d)?u*2:a(u-c(f)*u,u-c(g)*u);n.min.set(v,e[1],t<0?-m:0),n.max.set(p,e[3],t<0?0:m)}else n.min.set(e[0],e[1],0),n.max.set(e[2],e[3],0);n.getBoundingSphere(this.boundingSphere)}}applyClipRect(e){let t=this.getAttribute(Ac).count,n=this._chunkedBounds;if(n)for(let i=n.length;i--;){t=n[i].end;let r=n[i].rect;if(r[1]<e.w&&r[3]>e.y&&r[0]<e.z&&r[2]>e.x)break}this.instanceCount=t}updateAttributeData(e,t,n){const i=this.getAttribute(e);t?i&&i.array.length===t.length?(i.array.set(t),i.needsUpdate=!0):(this.setAttribute(e,new Go(t,n)),delete this._maxInstanceCount,this.dispose()):i&&this.deleteAttribute(e)}}const L0=`
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
`,U0=`
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
`,D0=`
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
`,I0=`
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
`;function F0(s){const e=jo(s,{chained:!0,extensions:{derivatives:!0},uniforms:{uTroikaSDFTexture:{value:null},uTroikaSDFTextureSize:{value:new Oe},uTroikaSDFGlyphSize:{value:0},uTroikaSDFExponent:{value:0},uTroikaTotalBounds:{value:new ht(0,0,0,0)},uTroikaClipRect:{value:new ht(0,0,0,0)},uTroikaEdgeOffset:{value:0},uTroikaFillOpacity:{value:1},uTroikaPositionOffset:{value:new Oe},uTroikaCurveRadius:{value:0},uTroikaBlurRadius:{value:0},uTroikaStrokeWidth:{value:0},uTroikaStrokeColor:{value:new Ve},uTroikaStrokeOpacity:{value:1},uTroikaOrient:{value:new Ke},uTroikaUseGlyphColors:{value:!0},uTroikaSDFDebug:{value:!1}},vertexDefs:L0,vertexTransform:U0,fragmentDefs:D0,fragmentColorTransform:I0,customRewriter({vertexShader:t,fragmentShader:n}){let i=/\buniform\s+vec3\s+diffuse\b/;return i.test(n)&&(n=n.replace(i,"varying vec3 vTroikaGlyphColor").replace(/\bdiffuse\b/g,"vTroikaGlyphColor"),i.test(t)||(t=t.replace(Dh,`uniform vec3 diffuse;
$&
vTroikaGlyphColor = uTroikaUseGlyphColors ? aTroikaGlyphColor / 255.0 : diffuse;
`))),{vertexShader:t,fragmentShader:n}}});return e.transparent=!0,e.forceSinglePass=!0,Object.defineProperties(e,{isTroikaTextMaterial:{value:!0},shadowSide:{get(){return this.side},set(){}}}),e}const aa=new Sr({color:16777215,side:sn,transparent:!0}),Cc=8421504,Rc=new it,hs=new H,Co=new H,dr=[],N0=new H,Ro="+x+y";function Pc(s){return Array.isArray(s)?s[0]:s}let kh=()=>{const s=new Pt(new oi(1,1),aa);return kh=()=>s,s},Bh=()=>{const s=new Pt(new oi(1,1,32,1),aa);return Bh=()=>s,s};const O0={type:"syncstart"},k0={type:"synccomplete"},zh=["font","fontSize","fontStyle","fontWeight","lang","letterSpacing","lineHeight","maxWidth","overflowWrap","text","direction","textAlign","textIndent","whiteSpace","anchorX","anchorY","colorRanges","sdfGlyphSize"],B0=zh.concat("material","color","depthOffset","clipRect","curveRadius","orientation","glyphGeometryDetail");class Gh extends Pt{constructor(){const e=new P0;super(e,null),this.text="",this.anchorX=0,this.anchorY=0,this.curveRadius=0,this.direction="auto",this.font=null,this.unicodeFontsURL=null,this.fontSize=.1,this.fontWeight="normal",this.fontStyle="normal",this.lang=null,this.letterSpacing=0,this.lineHeight="normal",this.maxWidth=1/0,this.overflowWrap="normal",this.textAlign="left",this.textIndent=0,this.whiteSpace="normal",this.material=null,this.color=null,this.colorRanges=null,this.outlineWidth=0,this.outlineColor=0,this.outlineOpacity=1,this.outlineBlur=0,this.outlineOffsetX=0,this.outlineOffsetY=0,this.strokeWidth=0,this.strokeColor=Cc,this.strokeOpacity=1,this.fillOpacity=1,this.depthOffset=0,this.clipRect=null,this.orientation=Ro,this.glyphGeometryDetail=1,this.sdfGlyphSize=null,this.gpuAccelerateSDF=!0,this.debugSDF=!1}sync(e){this._needsSync&&(this._needsSync=!1,this._isSyncing?(this._queuedSyncs||(this._queuedSyncs=[])).push(e):(this._isSyncing=!0,this.dispatchEvent(O0),S0({text:this.text,font:this.font,lang:this.lang,fontSize:this.fontSize||.1,fontWeight:this.fontWeight||"normal",fontStyle:this.fontStyle||"normal",letterSpacing:this.letterSpacing||0,lineHeight:this.lineHeight||"normal",maxWidth:this.maxWidth,direction:this.direction||"auto",textAlign:this.textAlign,textIndent:this.textIndent,whiteSpace:this.whiteSpace,overflowWrap:this.overflowWrap,anchorX:this.anchorX,anchorY:this.anchorY,colorRanges:this.colorRanges,includeCaretPositions:!0,sdfGlyphSize:this.sdfGlyphSize,gpuAccelerateSDF:this.gpuAccelerateSDF,unicodeFontsURL:this.unicodeFontsURL},t=>{this._isSyncing=!1,this._textRenderInfo=t,this.geometry.updateGlyphs(t.glyphBounds,t.glyphAtlasIndices,t.blockBounds,t.chunkedBounds,t.glyphColors);const n=this._queuedSyncs;n&&(this._queuedSyncs=null,this._needsSync=!0,this.sync(()=>{n.forEach(i=>i&&i())})),this.dispatchEvent(k0),e&&e()})))}onBeforeRender(e,t,n,i,r,o){this.sync(),r.isTroikaTextMaterial&&this._prepareForRender(r)}dispose(){this.geometry.dispose()}get textRenderInfo(){return this._textRenderInfo||null}createDerivedMaterial(e){return F0(e)}get material(){let e=this._derivedMaterial;const t=this._baseMaterial||this._defaultMaterial||(this._defaultMaterial=aa.clone());if((!e||!e.isDerivedFrom(t))&&(e=this._derivedMaterial=this.createDerivedMaterial(t),t.addEventListener("dispose",function n(){t.removeEventListener("dispose",n),e.dispose()})),this.hasOutline()){let n=e._outlineMtl;return n||(n=e._outlineMtl=Object.create(e,{id:{value:e.id+.1}}),n.isTextOutlineMaterial=!0,n.depthWrite=!1,n.map=null,e.addEventListener("dispose",function i(){e.removeEventListener("dispose",i),n.dispose()})),[n,e]}else return e}set material(e){e&&e.isTroikaTextMaterial?(this._derivedMaterial=e,this._baseMaterial=e.baseMaterial):this._baseMaterial=e}hasOutline(){return!!(this.outlineWidth||this.outlineBlur||this.outlineOffsetX||this.outlineOffsetY)}get glyphGeometryDetail(){return this.geometry.detail}set glyphGeometryDetail(e){this.geometry.detail=e}get curveRadius(){return this.geometry.curveRadius}set curveRadius(e){this.geometry.curveRadius=e}get customDepthMaterial(){return Pc(this.material).getDepthMaterial()}set customDepthMaterial(e){}get customDistanceMaterial(){return Pc(this.material).getDistanceMaterial()}set customDistanceMaterial(e){}_prepareForRender(e){const t=e.isTextOutlineMaterial,n=e.uniforms,i=this.textRenderInfo;if(i){const{sdfTexture:a,blockBounds:l}=i;n.uTroikaSDFTexture.value=a,n.uTroikaSDFTextureSize.value.set(a.image.width,a.image.height),n.uTroikaSDFGlyphSize.value=i.sdfGlyphSize,n.uTroikaSDFExponent.value=i.sdfExponent,n.uTroikaTotalBounds.value.fromArray(l),n.uTroikaUseGlyphColors.value=!t&&!!i.glyphColors;let c=0,h=0,d=0,u,f,g,v=0,p=0;if(t){let{outlineWidth:x,outlineOffsetX:_,outlineOffsetY:M,outlineBlur:C,outlineOpacity:T}=this;c=this._parsePercent(x)||0,h=Math.max(0,this._parsePercent(C)||0),u=T,v=this._parsePercent(_)||0,p=this._parsePercent(M)||0}else d=Math.max(0,this._parsePercent(this.strokeWidth)||0),d&&(g=this.strokeColor,n.uTroikaStrokeColor.value.set(g??Cc),f=this.strokeOpacity,f==null&&(f=1)),u=this.fillOpacity;n.uTroikaEdgeOffset.value=c,n.uTroikaPositionOffset.value.set(v,p),n.uTroikaBlurRadius.value=h,n.uTroikaStrokeWidth.value=d,n.uTroikaStrokeOpacity.value=f,n.uTroikaFillOpacity.value=u??1,n.uTroikaCurveRadius.value=this.curveRadius||0;let m=this.clipRect;if(m&&Array.isArray(m)&&m.length===4)n.uTroikaClipRect.value.fromArray(m);else{const x=(this.fontSize||.1)*100;n.uTroikaClipRect.value.set(l[0]-x,l[1]-x,l[2]+x,l[3]+x)}this.geometry.applyClipRect(n.uTroikaClipRect.value)}n.uTroikaSDFDebug.value=!!this.debugSDF,e.polygonOffset=!!this.depthOffset,e.polygonOffsetFactor=e.polygonOffsetUnits=this.depthOffset||0;const r=t?this.outlineColor||0:this.color;if(r==null)delete e.color;else{const a=e.hasOwnProperty("color")?e.color:e.color=new Ve;(r!==a._input||typeof r=="object")&&a.set(a._input=r)}let o=this.orientation||Ro;if(o!==e._orientation){let a=n.uTroikaOrient.value;o=o.replace(/[^-+xyz]/g,"");let l=o!==Ro&&o.match(/^([-+])([xyz])([-+])([xyz])$/);if(l){let[,c,h,d,u]=l;hs.set(0,0,0)[h]=c==="-"?1:-1,Co.set(0,0,0)[u]=d==="-"?-1:1,Rc.lookAt(N0,hs.cross(Co),Co),a.setFromMatrix4(Rc)}else a.identity();e._orientation=o}}_parsePercent(e){if(typeof e=="string"){let t=e.match(/^(-?[\d.]+)%$/),n=t?parseFloat(t[1]):NaN;e=(isNaN(n)?0:n/100)*this.fontSize}return e}localPositionToTextCoords(e,t=new Oe){t.copy(e);const n=this.curveRadius;return n&&(t.x=Math.atan2(e.x,Math.abs(n)-Math.abs(e.z))*Math.abs(n)),t}worldPositionToTextCoords(e,t=new Oe){return hs.copy(e),this.localPositionToTextCoords(this.worldToLocal(hs),t)}raycast(e,t){const{textRenderInfo:n,curveRadius:i}=this;if(n){const r=n.blockBounds,o=i?Bh():kh(),a=o.geometry,{position:l,uv:c}=a.attributes;for(let h=0;h<c.count;h++){let d=r[0]+c.getX(h)*(r[2]-r[0]);const u=r[1]+c.getY(h)*(r[3]-r[1]);let f=0;i&&(f=i-Math.cos(d/i)*i,d=Math.sin(d/i)*i),l.setXYZ(h,d,u,f)}a.boundingSphere=this.geometry.boundingSphere,a.boundingBox=this.geometry.boundingBox,o.matrixWorld=this.matrixWorld,o.material.side=this.material.side,dr.length=0,o.raycast(e,dr);for(let h=0;h<dr.length;h++)dr[h].object=this,t.push(dr[h])}}copy(e){const t=this.geometry;return super.copy(e),this.geometry=t,B0.forEach(n=>{this[n]=e[n]}),this}clone(){return new this.constructor().copy(this)}}zh.forEach(s=>{const e="_private_"+s;Object.defineProperty(Gh.prototype,s,{get(){return this[e]},set(t){t!==this[e]&&(this[e]=t,this._needsSync=!0)}})});new Sn;new Ve;const z0="/assets/DejaVuSans-CHjR2eXl.ttf",G0=6,H0=5;function V0(s,e,t,n,i){const r=new Set,o=[],a=Math.min(s.length,e.length/3);for(let l=0;l<a;l+=1){const c=s[l];if(n!==null&&n.has(c)){r.size<i&&r.add(c);continue}const h=e[l*3]-t.x,d=e[l*3+1]-t.y,u=e[l*3+2]-t.z;o.push({id:c,d2:h*h+d*d+u*u})}o.sort((l,c)=>l.d2-c.d2);for(const l of o){if(r.size>=i)break;r.add(l.id)}return r}class W0{constructor(e,t,n){this.scene=e,this.store=t,this.engine=n,this.active=new Map,this.pool=[],this.theme=null,this.styleStamp=0}applyTheme(e){this.theme=e,this.styleStamp+=1}_styleText(e){const{label:t}=this.theme;e.font=z0,e.fontSize=t.size,e.color=t.color,e.outlineColor=t.halo,e.outlineWidth=t.size*.12,e.anchorX="center",e.anchorY="bottom",e.userData.styleStamp=this.styleStamp}_acquire(e){const t=this.pool.pop()??new Gh;return t.parent||this.scene.add(t),t.visible=!0,t.userData.opacity=0,t.userData.text=null,this.active.set(e,t),t}_release(e,t){t.visible=!1,this.active.delete(e),this.pool.push(t)}update(e,t,n,i){if(!this.theme)return;const r=this.theme.label.budget??200,o=V0(this.engine.ids,this.engine.positions,t.position,n,r);for(const l of o)!this.active.has(l)&&this.store.nodes.has(l)&&this._acquire(l);const a=Math.min(1,e*G0);for(const[l,c]of this.active){const h=this.store.nodes.get(l),d=i.get(l);if(!h||!d){this._release(l,c);continue}const u=o.has(l)?1:0;if(c.userData.opacity+=(u-c.userData.opacity)*a,u===0&&c.userData.opacity<.02){this._release(l,c);continue}c.fillOpacity=c.userData.opacity,c.outlineOpacity=c.userData.opacity;const f=Ph(h,this.store.nodeTypes,this.theme);c.position.set(d.x,d.y+H0*f.size,d.z),c.quaternion.copy(t.quaternion);const g=c.userData.styleStamp!==this.styleStamp;(c.userData.text!==h.label||g)&&(g&&this._styleText(c),c.text=h.label,c.userData.text=h.label,c.sync())}}}const Lc=8,X0=1;function Y0(s,e,t){const n=[];for(const c of s){const h=t.get(c);if(!h)return null;n.push(h)}const i=[];let r=0;for(let c=0;c<n.length-1;c+=1){const h=n[c+1].x-n[c].x,d=n[c+1].y-n[c].y,u=n[c+1].z-n[c].z,f=Math.hypot(h,d,u);i.push(f),r+=f}if(r===0)return{x:n[0].x,y:n[0].y,z:n[0].z};let a=Math.max(0,Math.min(1,e))*r;for(let c=0;c<i.length;c+=1){if(a<=i[c]||c===i.length-1){const h=i[c]===0?0:a/i[c],d=n[c],u=n[c+1];return{x:d.x+(u.x-d.x)*h,y:d.y+(u.y-d.y)*h,z:d.z+(u.z-d.z)*h}}a-=i[c]}const l=n[n.length-1];return{x:l.x,y:l.y,z:l.z}}function Uc(s,e){let t=0;for(let n=0;n<s.length-1;n+=1){const i=e.get(s[n]),r=e.get(s[n+1]);if(!i||!r)return 0;t+=Math.hypot(r.x-i.x,r.y-i.y,r.z-i.z)}return t}function j0(s,e,t){if(s.color)return s.color;if(e&&e.color)return e.color;const n=t.palette??[];return s.type_index!=null&&n.length>0?n[s.type_index%n.length]:t.flow.color}class q0{constructor(e,t){this.path=e.path,this.flowType=e.flow_type??null,this.typeIndex=e.type_index??null,this.color=e.color??null,this.size=e.size??null,this.count=e.count,this.interval=Math.max(.001,e.interval??.2),this.speed=e.speed??1,this.flowId=e.flow_id??null,this.emitted=0,this.nextEmit=t,this.particles=[],this.done=!1}step(e,t){for(;this.nextEmit<=e&&(this.count===null||this.emitted<this.count);)this.particles.push({born:this.nextEmit}),this.emitted+=1,this.nextEmit+=this.interval;t>0&&(this.particles=this.particles.filter(n=>e-n.born<t)),this.count!==null&&this.emitted>=this.count&&this.particles.length===0&&(this.done=!0)}}class K0{constructor(e,{now:t=()=>performance.now()/1e3}={}){this.store=e,this.now=t,this.flows=[],this.persistent=new Map}applyFlow(e){const t=new q0(e,this.now());if(t.flowId!==null){const n=this.persistent.get(t.flowId);n&&(this.flows=this.flows.filter(i=>i!==n)),this.persistent.set(t.flowId,t)}this.flows.push(t)}stopFlow(e){const t=this.persistent.get(e);t&&(this.persistent.delete(e),this.flows=this.flows.filter(n=>n!==t))}replayInit(e){this.flows=this.flows.filter(t=>t.flowId===null),this.persistent.clear();for(const t of e)this.applyFlow(t)}activeCount(){return this.flows.length}_speedOf(e){var n;const t=((n=this.store.flowTypes)==null?void 0:n[e.flowType])??null;return e.speed*((t==null?void 0:t.speed)??1)}update(e,t){var a;const n=this.now(),i=((a=t==null?void 0:t.flow)==null?void 0:a.baseSpeed)??0,r=this._display;for(const l of this.flows){let c=0;if(i>0&&r){const h=Uc(l.path,r),d=i*this._speedOf(l);c=h>0&&d>0?h/d:0}l.step(n,c)}const o=this.store.nodes;this.flows=this.flows.filter(l=>l.flowId===null&&l.done?!1:o&&l.path.some(c=>!o.has(c))?(l.flowId!==null&&this.persistent.delete(l.flowId),!1):!0)}setDisplay(e){this._display=e}particles(){var r;const e=this._display,t=this._theme,n=[];if(!e||!t){for(const o of this.flows)for(const a of o.particles)n.push({x:0,y:0,z:0,color:"#ffffff"});return n}const i=this.now();for(const o of this.flows){const a=Uc(o.path,e),l=(t.flow.baseSpeed??0)*this._speedOf(o),c=a>0&&l>0?a/l:0,h=((r=this.store.flowTypes)==null?void 0:r[o.flowType])??null,d=j0(o,h,t),u=o.size??(h==null?void 0:h.size)??t.flow.size;for(const f of o.particles){const g=c>0?(i-f.born)/c:0,v=Y0(o.path,g,e);v&&n.push({x:v.x,y:v.y,z:v.z,color:d,size:u})}}return n}prepare(e,t){this._display=e,this._theme=t}}class Z0{constructor(e,t,n){this.scene=e,this.store=t,this.controller=n,this.theme=null,this.capacity=0,this.mesh=null,this._matrix=new it,this._color=new Ve,this._ensureCapacity(1024)}_ensureCapacity(e){var r;if(this.mesh&&e<=this.capacity)return;const t=Math.max(1024,2**Math.ceil(Math.log2(Math.max(1,e))));this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh.dispose());const n=new Ds(X0,Lc,Lc),i=new Sr({color:16777215,transparent:!0,opacity:((r=this.theme)==null?void 0:r.flow.opacity)??.85,blending:vs,depthWrite:!1});this.mesh=new Mh(n,i,t),this.mesh.count=0,this.mesh.frustumCulled=!1,this.scene.add(this.mesh),this.capacity=t}applyTheme(e){this.theme=e,this.mesh&&(this.mesh.material.opacity=e.flow.opacity)}update(e,t,n){this.theme=t,this.controller.prepare(n,t),this.controller.update(e,t);const i=this.controller.particles();this._ensureCapacity(i.length);const r=this.mesh;for(let o=0;o<i.length;o+=1){const a=i[o],l=a.size??t.flow.size;this._matrix.makeScale(l,l,l),this._matrix.setPosition(a.x,a.y,a.z),r.setMatrixAt(o,this._matrix),this._color.set(a.color),r.setColorAt(o,this._color)}r.count=i.length,r.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0)}particleCount(){return this.mesh?this.mesh.count:0}dispose(){this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh.dispose(),this.mesh=null)}}const Ko=12,J0=.5;function Q0(s,e,t,n=Ko){const i=(s.x+e.x)/2,r=(s.y+e.y)/2,o=(s.z+e.z)/2;let a=i,l=r,c=o;const h=e.x-s.x,d=e.y-s.y,u=e.z-s.z,f=Math.hypot(h,d,u);if(t>0&&f>0){const v=h/f,p=d/f,m=u/f;let x=-m,_=0,M=v;Math.hypot(x,_,M)<1e-6&&(x=0,_=m,M=-p);const C=Math.hypot(x,_,M)||1,T=t*f*J0;a=i+x/C*T,l=r+_/C*T,c=o+M/C*T}const g=[];for(let v=0;v<=n;v+=1){const p=v/n,m=1-p,x=m*m,_=2*m*p,M=p*p;g.push({x:x*s.x+_*a+M*e.x,y:x*s.y+_*l+M*e.y,z:x*s.z+_*c+M*e.z})}return g}const $0=8,ex=.75,Dc=.6,Kn=600,tx=1.1,Ic="__default",Fc={sphere:()=>new Ds(3,12,8),box:()=>new Wi(4.8,4.8,4.8),octahedron:()=>new ra(3.6),tetrahedron:()=>new sa(4.2)};class nx{constructor(e,t,n,{onCameraReady:i=()=>{}}={}){this.container=e,this.store=t,this.engine=n,this.onCameraReady=i,this.display=new Map,this.theme=Rh("modern"),this.scene=new i_,this.camera=null,this.controls=null,this.webgl=new n_({antialias:!0}),this.webgl.setSize(e.clientWidth,e.clientHeight,!1),this.webgl.setPixelRatio(window.devicePixelRatio),this.webgl.domElement.style.cssText="display:block;width:100%;height:100%",e.appendChild(this.webgl.domElement),this.ambient=new d_,this.scene.add(this.ambient),this.sun=new u_,this.sun.position.set(1,2,3),this.scene.add(this.sun),this.meshes=new Map,this._counts=new Map,this.composer=null,this.bloomPass=null,this.bloomDisabled=!1,this.onFrame=null,this.edgeCapacity=0,this.edgeLines=null,this.edgeStyle="line",this.edgeElasticity=0,this._ensureEdgeCapacity(8192),this.clock=new Th,this._matrix=new it,this.raycaster=new p_,this._pointer=new Oe,this._tmpColor=new Ve,this._bgColor=new Ve,this._edgeColor=new Ve,this._edgeBase=new Ve("#666666"),this._edgeGlow=new Ve("#eaf2ff"),this.frameIndex=0,this._boundsStamp=-1,this.highlightSet=null,this.focusId=null,this.focusElapsed=0,this._focusFrom=new H,this.labels=new W0(this.scene,t,n),this.flowController=new K0(t,{}),this.flows=new Z0(this.scene,t,this.flowController),this.applyTheme(this.theme),t.subscribe(r=>{r.kind==="init"&&!this.camera&&this._initCamera(t.config.dimensions)}),this._onResizeBound=()=>this._onResize(),window.addEventListener("resize",this._onResizeBound)}dispose(){var e,t,n;this.webgl.setAnimationLoop(null),window.removeEventListener("resize",this._onResizeBound);for(const i of this.meshes.values())i.geometry.dispose(),i.material.dispose();this.edgeLines&&(this.edgeLines.geometry.dispose(),this.edgeLines.material.dispose()),(e=this.flows)!=null&&e.mesh&&(this.flows.mesh.geometry.dispose(),this.flows.mesh.material.dispose());for(const i of[...this.labels.active.values(),...this.labels.pool])i.dispose();(t=this.bloomPass)==null||t.dispose(),(n=this.composer)==null||n.dispose(),this.webgl.dispose(),this.webgl.domElement.remove()}applyTheme(e){this.theme=e,this._bgColor.set(e.background),this.scene.background=new Ve(e.background),this.ambient.color.set(e.lights.ambient.color),this.ambient.intensity=e.lights.ambient.intensity,this.sun.color.set(e.lights.directional.color),this.sun.intensity=e.lights.directional.intensity,this._edgeBase.set(e.edge.color),this._edgeGlow.set(e.edge.glow??"#6fb8e8"),this.edgeLines.material.opacity=e.edge.opacity;for(const t of this.meshes.values())t.material.emissive.set(e.node.emissive),t.material.emissiveIntensity=e.node.emissiveIntensity;this.labels.applyTheme(e),this.flows.applyTheme(e),this._syncBloom()}setEdgeStyle({style:e,elasticity:t}={}){this.edgeStyle=e==="spline"?"spline":"line",this.edgeElasticity=Math.max(0,Math.min(1,t??0))}_syncBloom(){const e=!!(this.theme.bloom.enabled&&!this.bloomDisabled&&this.camera);if(e&&!this.composer){const t=new Oe;this.webgl.getSize(t),this.composer=new P_(this.webgl),this.composer.setPixelRatio(this.webgl.getPixelRatio()),this.composer.setSize(t.x,t.y),this.composer.addPass(new L_(this.scene,this.camera)),this.bloomPass=new zi(t.clone(),this.theme.bloom.strength,this.theme.bloom.radius,this.theme.bloom.threshold),this.composer.addPass(this.bloomPass)}else!e&&this.composer?(this.bloomPass.dispose(),this.composer.dispose(),this.composer=null,this.bloomPass=null):this.composer&&(this.bloomPass.strength=this.theme.bloom.strength,this.bloomPass.radius=this.theme.bloom.radius,this.bloomPass.threshold=this.theme.bloom.threshold)}disableBloom(){this.bloomDisabled=!0,this._syncBloom()}setPixelRatio(e){var t;this.webgl.setPixelRatio(e),(t=this.composer)==null||t.setPixelRatio(e)}_buildCamera(e){const t=this.container.clientWidth/this.container.clientHeight;e===2?(this.camera=new Ps(-Kn*t,Kn*t,Kn,-Kn,-1e4,1e4),this.camera.position.set(0,0,1e3),this.controls=new mc(this.camera,this.webgl.domElement),this.controls.enableDamping=!0,this.controls.enableRotate=!1,this.controls.screenSpacePanning=!0,this.controls.mouseButtons={LEFT:_n.PAN,MIDDLE:_n.DOLLY,RIGHT:_n.PAN},this.controls.touches={ONE:Un.PAN,TWO:Un.DOLLY_PAN}):(this.camera=new jt(60,t,1,5e4),this.camera.position.set(0,0,900),this.controls=new mc(this.camera,this.webgl.domElement),this.controls.enableDamping=!0,this.controls.minDistance=20,this.controls.maxDistance=2e4)}_initCamera(e){this.camera||(this._buildCamera(e),this.onCameraReady())}setDimensions(e){var t,n;this.camera&&(this.camera.isOrthographicCamera?2:3)===e||((t=this.controls)==null||t.dispose(),this.composer&&((n=this.bloomPass)==null||n.dispose(),this.composer.dispose(),this.composer=null,this.bloomPass=null),this._buildCamera(e),this.onCameraReady())}resize(){this._onResize()}ensureCamera(){this.camera||this._initCamera(this.store.config.dimensions??3)}_onResize(){var t,n;if(this.webgl.setSize(this.container.clientWidth,this.container.clientHeight,!1),!this.camera)return;const e=this.container.clientWidth/this.container.clientHeight;this.camera.isOrthographicCamera?(this.camera.left=-Kn*e,this.camera.right=Kn*e):this.camera.aspect=e,this.camera.updateProjectionMatrix(),(t=this.composer)==null||t.setSize(this.container.clientWidth,this.container.clientHeight),(n=this.bloomPass)==null||n.setSize(this.container.clientWidth,this.container.clientHeight)}_ensureMesh(e,t,n){let i=this.meshes.get(e);if(i&&i.userData.shape===t&&n<=i.userData.capacity)return i;const r=Math.max(256,2**Math.ceil(Math.log2(Math.max(1,n))));i&&(this.scene.remove(i),i.geometry.dispose(),i.material.dispose(),i.dispose());const o=(Fc[t]??Fc.sphere)(),a=new l_({color:16777215,roughness:.4,emissive:new Ve(this.theme.node.emissive),emissiveIntensity:this.theme.node.emissiveIntensity});return i=new Mh(o,a,r),i.count=0,i.userData={shape:t,capacity:r,ids:[],cursor:0},this.scene.add(i),this.meshes.set(e,i),i}_ensureEdgeCapacity(e){if(e<=this.edgeCapacity)return;const t=Math.max(8192,2**Math.ceil(Math.log2(e)));this.edgeLines&&(this.scene.remove(this.edgeLines),this.edgeLines.geometry.dispose(),this.edgeLines.material.dispose());const n=new Gt;n.setAttribute("position",new zt(new Float32Array(t*3),3)),n.setAttribute("color",new zt(new Float32Array(t*3),3)),n.setDrawRange(0,0),this.edgeLines=new a_(n,new Eh({vertexColors:!0,transparent:!0,opacity:this.theme.edge.opacity})),this.edgeLines.frustumCulled=!1,this.scene.add(this.edgeLines),this.edgeCapacity=t}start(){this.webgl.setAnimationLoop(()=>this._frame())}_frame(){const e=this.clock.getDelta();this.camera&&(this.frameIndex+=1,this.onFrame&&this.onFrame(e),this._syncNodes(e),this._syncEdges(),this.labels.update(e,this.camera,this.highlightSet,this.display),this.flows.update(e,this.theme,this.display),this._stepFocus(e),this.controls.update(),this._syncBloom(),this.composer?this.composer.render():this.webgl.render(this.scene,this.camera))}_meshKey(e){return e&&e.type!=null&&this.store.nodeTypes[e.type]?e.type:Ic}_syncNodes(e){const{ids:t,positions:n}=this.engine,i=Math.min(t.length,n.length/3),r=Math.min(1,e*$0),o=new Set;for(let a=0;a<i;a+=1){const l=t[a];o.add(l);const c=n[a*3],h=n[a*3+1],d=n[a*3+2];let u=this.display.get(l);u||(u=new H(c,h,d),this.display.set(l,u)),u.x+=(c-u.x)*r,u.y+=(h-u.y)*r,u.z+=(d-u.z)*r}for(const a of this.display.keys())o.has(a)||this.display.delete(a);this._counts.clear();for(let a=0;a<i;a+=1){const l=this._meshKey(this.store.nodes.get(t[a]));this._counts.set(l,(this._counts.get(l)??0)+1)}for(const[a,l]of this._counts){const c=a===Ic?this.theme.node.shape:this.store.nodeTypes[a].shape??this.theme.node.shape,h=this._ensureMesh(a,c,l);h.userData.cursor=0,h.userData.ids.length=l}for(const[a,l]of this.meshes)this._counts.has(a)||(l.count=0,l.userData.ids.length=0);for(let a=0;a<i;a+=1){const l=t[a],c=this.store.nodes.get(l)??{id:l,type:null,meta:{}},h=this.meshes.get(this._meshKey(c)),d=h.userData.cursor;h.userData.cursor+=1,h.userData.ids[d]=l;const u=Ph(c,this.store.nodeTypes,this.theme),f=this.display.get(l);this._matrix.makeScale(u.size,u.size,u.size),this._matrix.setPosition(f.x,f.y,f.z),h.setMatrixAt(d,this._matrix),this._tmpColor.set(u.color),this.highlightSet!==null&&!this.highlightSet.has(l)&&this._tmpColor.lerp(this._bgColor,ex),h.setColorAt(d,this._tmpColor)}for(const[a,l]of this.meshes)this._counts.has(a)&&(l.count=l.userData.cursor,l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0))}_syncEdges(){const{edges:e}=this.store,t=this.edgeStyle==="spline"&&this.edgeElasticity>0,n=t?Ko*2:2;this._ensureEdgeCapacity(e.size*n);const i=this.edgeLines.geometry.getAttribute("position"),r=this.edgeLines.geometry.getAttribute("color");let o=0;for(const a of e.values()){const l=this.display.get(a.source),c=this.display.get(a.target);if(!l||!c)continue;const h=this._edgeColor,d=a.meta?Number(a.meta.brightness):NaN;if(a.meta&&a.meta.color?h.set(a.meta.color):Number.isFinite(d)?h.copy(this._edgeBase).lerp(this._edgeGlow,Math.max(0,Math.min(1,d))):h.copy(this._edgeBase),t){const u=Q0(l,c,this.edgeElasticity,Ko);for(let f=0;f<u.length-1;f+=1)i.setXYZ(o,u[f].x,u[f].y,u[f].z),r.setXYZ(o,h.r,h.g,h.b),o+=1,i.setXYZ(o,u[f+1].x,u[f+1].y,u[f+1].z),r.setXYZ(o,h.r,h.g,h.b),o+=1}else i.setXYZ(o,l.x,l.y,l.z),r.setXYZ(o,h.r,h.g,h.b),o+=1,i.setXYZ(o,c.x,c.y,c.z),r.setXYZ(o,h.r,h.g,h.b),o+=1}this.edgeLines.geometry.setDrawRange(0,o),i.needsUpdate=!0,r.needsUpdate=!0}nodeCount(){let e=0;for(const t of this.meshes.values())e+=t.count;return e}pick(e,t){if(!this.camera||this.meshes.size===0)return null;const n=this.webgl.domElement.getBoundingClientRect();if(this._pointer.x=(e-n.left)/n.width*2-1,this._pointer.y=-((t-n.top)/n.height)*2+1,this._boundsStamp!==this.frameIndex){for(const o of this.meshes.values())o.count>0&&o.computeBoundingSphere();this._boundsStamp=this.frameIndex}this.raycaster.setFromCamera(this._pointer,this.camera);const i=[...this.meshes.values()].filter(o=>o.count>0),r=this.raycaster.intersectObjects(i,!1)[0];return!r||r.instanceId===void 0?null:r.object.userData.ids[r.instanceId]??null}viewState(){if(!this.camera||!this.controls)return null;const e=this.camera.position,t=this.controls.target;return{position:{x:e.x,y:e.y,z:e.z},target:{x:t.x,y:t.y,z:t.z},zoom:this.camera.zoom}}setHighlight(e){this.highlightSet=e}focusOn(e){this.controls&&(this.focusId=e,this.focusElapsed=0,this._focusFrom.copy(this.controls.target))}graphBounds(){const{ids:e,positions:t}=this.engine,n=Math.min(e.length,Math.floor(t.length/3));if(n===0)return null;const i=new H;for(let o=0;o<n;o+=1)i.x+=t[o*3],i.y+=t[o*3+1],i.z+=t[o*3+2];i.divideScalar(n);let r=0;for(let o=0;o<n;o+=1){const a=t[o*3]-i.x,l=t[o*3+1]-i.y,c=t[o*3+2]-i.z,h=a*a+l*l+c*c;h>r&&(r=h)}return{center:i,radius:Math.sqrt(r)}}centerOnGraph(){if(!this.camera||!this.controls)return!1;const e=this.graphBounds();if(!e)return!1;const t=Math.max(e.radius,1)*tx;if(this.focusId=null,this.camera.isOrthographicCamera){const n=Kn,i=n*(this.container.clientWidth/Math.max(1,this.container.clientHeight));this.camera.zoom=Math.min(n,i)/t,this.camera.updateProjectionMatrix(),this.camera.position.set(e.center.x,e.center.y,this.camera.position.z)}else{const n=Bo.degToRad(this.camera.fov),i=2*Math.atan(Math.tan(n/2)*this.camera.aspect),r=Math.min(n,i),o=t/Math.sin(r/2),a=new H().subVectors(this.camera.position,this.controls.target);a.lengthSq()<1e-6&&a.set(0,0,1),a.normalize().multiplyScalar(Bo.clamp(o,this.controls.minDistance,this.controls.maxDistance)),this.camera.position.copy(e.center).add(a)}return this.controls.target.copy(e.center),this.camera.lookAt(this.controls.target),this.controls.update(),this.controls.dispatchEvent({type:"change"}),!0}_stepFocus(e){if(this.focusId===null)return;if(!this.store.nodes.has(this.focusId)){this.focusId=null;return}const t=this.display.get(this.focusId);if(!t)return;this.focusElapsed=Math.min(this.focusElapsed+e,Dc);const n=this.focusElapsed/Dc,i=1-(1-n)**3;this.controls.target.lerpVectors(this._focusFrom,t,i),n>=1&&(this.focusId=null)}}const Hh=Object.freeze({physicsRunning:!0,edgeStyle:"line",edgeElasticity:.3,dimensions:3,clusters:!0});function ix(s){return String(s??"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"viewbase"}function Vh(s){return`vb-options:${ix(s)}`}function rx(s,e=globalThis.localStorage,t=Hh){if(!e)return us({...t});try{const n=e.getItem(Vh(s));if(!n)return us({...t});const i=JSON.parse(n);return us({...t,...i})}catch{return us({...t})}}function us(s){return Number(s.edgeElasticity)>0||(s.edgeElasticity=Hh.edgeElasticity),s}function ds(s,e,t=globalThis.localStorage){t&&t.setItem(Vh(s),JSON.stringify(e))}const Nc=24,Oc=40,sx=24;class ox extends Gi{constructor({screenId:e,container:t,manager:n,optionsProvider:i,onResize:r}){if(super({id:`__graph@${e??"default"}`,title:"Graf",widthChars:80,container:t,manager:n,kind:"graph",closable:!1,optionsProvider:i}),this.onResize=r,this._buildBody(),this._mount(),!this.size){const o=this._bounds();this._applySize(Math.max(zc,o.width-2*Nc),Math.max(Gc,o.height-Oc-sx)),this._place(Nc,Oc)}}_buildBody(){const e=document.createElement("div");e.dataset.role="graph-body",e.style.cssText="position:relative;overflow:hidden",this.body=e,this.el.appendChild(e)}_applySize(e,t){var n;super._applySize(e,t),this.body.style.overflow="hidden",(n=this.onResize)==null||n.call(this)}setTitle(e){this.title=e,this.titleEl.textContent=e}setMetrics(e){this.metricsEl||(this.metricsEl=document.createElement("span"),this.metricsEl.dataset.role="graph-metrics",this.metricsEl.style.cssText=["font-weight:400","font-size:11px","opacity:0.8","white-space:nowrap","flex:0 0 auto"].join(";"),this.bar.insertBefore(this.metricsEl,this.minGadget)),this.metricsEl.textContent=e}_renderBody(){}}function ax(s){const{screenId:e,store:t,sendEvent:n,windowManager:i,setOptionsFallback:r,onThemeChange:o,applyTheme:a}=s,l=new b_(t);let c=null,h=!0,d=!1;function u(){l.setPaused(d||!h)}let f=null;i.registerType("graph",()=>i.adopt(new ox({screenId:e,container:s.container,manager:i,optionsProvider:()=>c,onResize:()=>f==null?void 0:f.resize()})));const g=i.open("graph");r(()=>c);function v(b,y){const U=y??t.config.highlight_neighbors??1,P=Lu(t,b,U);f.setHighlight(P.size>0?P:null)}let p=null;f=new nx(g.body,t,l,{onCameraReady:()=>{const b=f.camera.isOrthographicCamera;p?p.setCameraControls(f.camera,f.controls,b):(new y_(f.webgl.domElement,(U,P)=>f.pick(U,P),n,{onNodeClick:U=>{var I;const P=t.config.highlight_neighbors??1;P>0&&v(U,P),f.focusOn(U),(I=t.config.detail_window)!=null&&I.open_on_click&&i.open("detail",{nodeId:U})},onBackgroundClick:()=>{f.setHighlight(null)}}),p=new v_(f.camera,f.controls,{is2d:b,hasFocus:()=>i.hasKeyboard(g)&&g.body.offsetParent!==null,onCenter:()=>f.centerOnGraph()}));const y=Uo(()=>{const U=f.viewState();U&&n(ps("view_change",U))},100);f.controls.addEventListener("change",y)}}),o(b=>f.applyTheme(b));function m(b){f.setDimensions(b),l.setDimensions(b),t.config.dimensions=b}function x(b,y){c=[{key:"physics-running",label:"Fyzika běží",checked:y.physicsRunning,onToggle:U=>{y.physicsRunning=U,h=U,u(),ds(b,y),x(b,y)}},{key:"edge-spline",label:"Křivkové hrany (splajn)",checked:y.edgeStyle==="spline",onToggle:U=>{y.edgeStyle=U?"spline":"line",f.setEdgeStyle({style:y.edgeStyle,elasticity:y.edgeElasticity}),ds(b,y),x(b,y)}},{key:"dimensions-3d",label:"3D pohled",checked:y.dimensions===3,onToggle:U=>{y.dimensions=U?3:2,m(y.dimensions),ds(b,y),x(b,y)}},{key:"clusters",label:"Shluky (oblasti)",checked:y.clusters!==!1,onToggle:U=>{y.clusters=U,l.setClusters(U),ds(b,y),x(b,y)}}],i.refreshOptions()}function _(b){var P,I;const y={physicsRunning:!0,edgeStyle:((P=t.config.edge_style)==null?void 0:P.style)??"line",edgeElasticity:((I=t.config.edge_style)==null?void 0:I.elasticity)??.3,dimensions:t.config.dimensions??3,clusters:!0},U=rx(b,void 0,y);h=U.physicsRunning,u(),f.setEdgeStyle({style:U.edgeStyle,elasticity:U.edgeElasticity}),m(U.dimensions),l.setClusters(U.clusters!==!1),x(b,U)}const M=b=>{b===1&&f.disableBloom(),b===2&&f.setPixelRatio(1)},C=new M_(M);let T=null;function w(b){b<=0||(T=T===null?1/b:T+(1/b-T)*Math.min(1,b*2))}const L=Uo(()=>{const b=T===null?"–":Math.round(T),y=(t.config.dimensions??3)===3?"3D":"2D";g.setMetrics(`${y} · ${t.nodes.size} uzlů · ${b} fps`)},500);return f.start(),{name:"graph",onInit(){f.ensureCamera(),g.setTitle(t.config.title||"Graf"),f.flowController.replayInit(t.flows??[]),f.setEdgeStyle(t.config.edge_style??{style:"line",elasticity:0}),_(t.config.title);const b=t.config.quality??"auto";b==="low"&&(M(1),M(2)),f.onFrame=y=>{w(y),L(),b==="auto"&&C.frame(y)}},actions:{focus:b=>f.focusOn(b.node_id),highlight:b=>v(b.node_id,b.depth),flow:b=>f.flowController.applyFlow(b),stop_flow:b=>f.flowController.stopFlow(b.flow_id),set_theme:b=>{t.config.theme=b.theme,a(b.theme)},set_edge_style:b=>f.setEdgeStyle(b),define_type:b=>t.applyNodeType(b.name,b.style)},setVisible(b){b?f.start():f.webgl.setAnimationLoop(null)},setResourcesPaused(b){d=b,u()},destroy(){l.terminate(),f.dispose()}}}const lx=8,cx=220;function hx(s){const e=Number(s);return!Number.isFinite(e)||e<=0?60:Math.max(20,Math.round(e/lx))}class ux extends Gi{constructor({id:e,title:t,prompt:n,width:i,onInput:r,container:o,manager:a,closable:l,input:c}){super({id:e,title:t,widthChars:hx(i),container:o,manager:a,kind:"terminal",closable:l}),this.prompt=n??"> ",this.hasInput=c!==!1,this.onInput=r,this.wordWrap=!0,this._buildBody(),this._mount()}getOptionsItems(){return[{key:"word-wrap",label:"Word Wrap",checked:this.wordWrap,onToggle:e=>{this.setWordWrap(e),this.manager.refreshOptions()}}]}setWordWrap(e){this.wordWrap=!!e;const t=this._isTailPinned();this.output.style.whiteSpace=this.wordWrap?"pre-wrap":"pre",this.output.style.wordBreak=this.wordWrap?"break-word":"normal",this.output.style.overflowX=this.wordWrap?"hidden":"auto",t&&this._scrollToEnd()}_isTailPinned(){const e=this.output;return e.scrollTop+e.clientHeight>=e.scrollHeight-4}_scrollToEnd(){this.output.scrollTop=this.output.scrollHeight}_applySize(e,t){const n=this._isTailPinned();super._applySize(e,t),n&&this._scrollToEnd()}_buildBody(){const e=document.createElement("div");e.dataset.role="terminal-body",e.style.cssText=["padding:6px 8px",`width:${this.widthChars}ch`,"max-width:92vw","font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace","display:flex","flex-direction:column"].join(";");const t=document.createElement("div");if(t.dataset.role="terminal-output",t.style.cssText=[`height:${cx}px`,"flex:1 1 auto","min-height:0","overflow-y:auto","overflow-x:hidden","white-space:pre-wrap","word-break:break-word","background:var(--vb-terminal-bg, var(--vb-window-output-bg, rgba(0,0,0,0.06)))","border-radius:4px","padding:6px 8px"].join(";"),this.output=t,e.append(t),this.hasInput){const n=document.createElement("div");n.dataset.role="terminal-input-row",n.style.cssText="display:flex;align-items:baseline;gap:0";const i=document.createElement("span");i.textContent=this.prompt,i.style.cssText="color:var(--vb-window-key, #667788);flex:0 0 auto;white-space:pre";const r=document.createElement("input");r.type="text",r.dataset.role="terminal-input",r.style.cssText=["flex:1 1 auto","min-width:0","font:inherit","color:inherit","background:transparent","border:0","outline:none","padding:0","margin:0","caret-color:var(--vb-terminal-caret, auto)"].join(";"),r.addEventListener("keydown",o=>{if(o.key!=="Enter")return;o.stopPropagation();const a=r.value.trim();r.value="",a&&this._submit(a)}),this.input=r,n.append(i,r),t.append(n),this.inputRow=n,t.addEventListener("click",o=>{o.target===t&&r.focus()})}this.body=e,this.el.appendChild(e)}_submit(e){this.onInput&&this.onInput({window_id:this.id,line:e})}append(e){const t=document.createElement("div");t.textContent=String(e??""),this.inputRow?this.output.insertBefore(t,this.inputRow):this.output.appendChild(t),this.output.scrollTop=this.output.scrollHeight}_scrollTarget(){return this.output??null}_renderBody(){}}function dx({container:s,windowManager:e,sendEvent:t}){return e.registerType("terminal",n=>{var r;(r=e.get(n.window_id))==null||r.close();const i=e.adopt(new ux({id:n.window_id,title:n.title,prompt:n.prompt,width:n.width,closable:n.closable,input:n.input,onInput:o=>t({type:"event",event:"terminal_input",payload:o}),container:s,manager:e}));return i.bringToFront(),i}),{name:"terminal",actions:{terminal_append:n=>{const i=e.get(n.window_id);i&&i.kind==="terminal"&&i.append(n.text)}}}}const fx=["--vb-window-body-fg","--vb-window-key","--vb-html-accent","--vb-window-output-bg"],px=["html,body{margin:0;background:transparent;color:var(--vb-window-body-fg);font:13px/1.5 system-ui,-apple-system,sans-serif}","body{padding:8px 10px}","h1,h2,h3{margin:0 0 6px;font-weight:600;line-height:1.25;text-wrap:balance}","h1{font-size:17px}h2{font-size:15px}","h3{font-size:11px;color:var(--vb-window-key);text-transform:uppercase;letter-spacing:.05em;margin-top:10px}","p,ul,ol,pre,blockquote{margin:0 0 8px}ul,ol{padding-left:20px}","a{color:var(--vb-html-accent)}","hr{border:0;border-top:1px solid color-mix(in srgb,var(--vb-window-key) 45%,transparent);margin:8px 0}","table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}","th{text-align:left;font-weight:500;color:var(--vb-window-key);padding:3px 10px 3px 0;border-bottom:1px solid color-mix(in srgb,var(--vb-window-key) 45%,transparent);white-space:nowrap}","td{padding:2px 10px 2px 0;vertical-align:top}.num{text-align:right}","table.kv td:first-child{color:var(--vb-window-key);white-space:nowrap;padding-right:12px}","code,pre,kbd{font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}","code{background:var(--vb-window-output-bg);padding:0 4px;border-radius:3px}","pre{background:var(--vb-window-output-bg);border-radius:4px;padding:6px 8px;overflow:auto;white-space:pre-wrap;word-break:break-word}","pre code{background:none;padding:0}","blockquote{padding:2px 10px;border-left:3px solid var(--vb-html-accent);color:var(--vb-window-key)}","button,.vb-btn{cursor:pointer;padding:3px 12px;border:1px solid var(--vb-html-accent);border-radius:4px;background:transparent;color:inherit;font:inherit}","[data-vb-event]{cursor:pointer}form[data-vb-event]{cursor:auto}","input,select,textarea{font:inherit;color:inherit;background:var(--vb-window-output-bg);border:1px solid color-mix(in srgb,var(--vb-window-key) 45%,transparent);border-radius:4px;padding:2px 6px;box-sizing:border-box}","input[type=checkbox],input[type=radio]{width:auto;padding:0}","label{color:var(--vb-window-key)}",".vb-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}",".vb-el{margin:0 0 8px}.vb-el>h1,.vb-el>h2,.vb-el>h3,.vb-el>p{margin:0}",".vb-field>label{display:block;font-size:11.5px;color:var(--vb-window-key);margin-bottom:2px}",".vb-field>input[type=text],.vb-field>input[type=number],.vb-field>select,.vb-field>textarea{width:100%}",".vb-field>input[type=range]{width:calc(100% - 3.5em);vertical-align:middle}.vb-field>output{color:var(--vb-window-key);font-variant-numeric:tabular-nums}",".vb-check>label{display:inline;font-size:inherit;color:inherit}",".vb-radios>label.vb-radio{display:inline-flex;align-items:center;gap:4px;margin:0 12px 0 0;font-size:inherit;color:inherit}","[hidden]{display:none!important}","button:disabled,input:disabled,select:disabled,textarea:disabled{opacity:.5;cursor:default}","img{max-width:100%;height:auto;display:block}",".vb-grid{display:grid;gap:4px 14px;align-items:start}",".vb-key,.small{color:var(--vb-window-key)}.small{font-size:11.5px}",".vb-tag{display:inline-block;padding:0 7px;border:1px solid var(--vb-window-key);border-radius:9px;font-size:11px;line-height:16px;margin-right:4px}",".vb-ok{color:#2fa84f}.vb-warn{color:#e8a02f}.vb-err{color:#e8553a}",".vb-bar{display:inline-block;vertical-align:middle;height:6px;background:var(--vb-window-output-bg);border-radius:3px;overflow:hidden}",".vb-bar>i{display:block;height:100%;background:var(--vb-html-accent)}"].join(`
`),mx=["(function(){","function attr(el,n){return el.hasAttribute(n)?el.getAttribute(n):null;}","function typed(el){",' var t=(el.type||"").toLowerCase();',' if(t==="checkbox")return el.checked;',' if(t==="radio")return el.checked?el.value:undefined;',' if(t==="number"||t==="range"){var n=parseFloat(el.value);return isNaN(n)?null:n;}',' if(t==="file")return undefined;',' if(el.tagName==="SELECT"&&el.multiple){var a=[];for(var i=0;i<el.options.length;i++)if(el.options[i].selected)a.push(el.options[i].value);return a;}'," return el.value;","}","function collect(root){",' var out={},els=root.querySelectorAll("input[name],select[name],textarea[name]");'," for(var i=0;i<els.length;i++){var v=typed(els[i]);if(v===undefined)continue;var k=els[i].name;",'  if(els[i].type==="radio"){out[k]=v;continue;}',"  if(k in out){if(!Array.isArray(out[k]))out[k]=[out[k]];out[k].push(v);}else out[k]=v;}"," return out;","}",'function send(kind,ev,id,val,values){parent.postMessage({type:"vb-html-event",kind:kind,event:ev,id:id,value:val,values:values||collect(document)},"*");}','document.addEventListener("click",function(e){',' var el=e.target&&e.target.closest?e.target.closest("[data-vb-event]"):null;',' if(el&&el.tagName!=="FORM"){e.preventDefault();send("click",el.getAttribute("data-vb-event"),attr(el,"data-vb-id"),attr(el,"data-vb-value"));return;}',' if(e.target&&e.target.closest&&e.target.closest("a"))e.preventDefault();',"});",'function fieldEvent(kind,el){send(kind,el.name||attr(el,"data-vb-id"),attr(el,"data-vb-id"),typed(el));}','document.addEventListener("change",function(e){',' var el=e.target;if(!el||!el.hasAttribute||!el.hasAttribute("data-vb-id"))return;',' fieldEvent("change",el);',"});","var liveTimer=null,livePending=null;",'document.addEventListener("input",function(e){',' var el=e.target;if(!el||!el.type||el.type!=="range")return;',` var o=el.parentNode&&el.parentNode.querySelector?el.parentNode.querySelector("output[for='"+el.name+"']"):null;`," if(o)o.textContent=el.value;",' if(!el.hasAttribute("data-vb-live"))return;'," livePending=el;if(liveTimer)return;",' liveTimer=setTimeout(function(){liveTimer=null;if(livePending){fieldEvent("change",livePending);livePending=null;}},100);',"});",'document.addEventListener("keydown",function(e){',' var el=e.target;if(e.key!=="Enter"||!el||el.tagName!=="INPUT"||!el.hasAttribute("data-vb-id"))return;',' if(el.type==="checkbox"||el.type==="range")return;',' e.preventDefault();fieldEvent("submit",el);',"});",'document.addEventListener("submit",function(e){',' var f=e.target;e.preventDefault();if(!f||f.tagName!=="FORM")return;',' send("submit",attr(f,"data-vb-event")||attr(f,"name")||"submit",attr(f,"data-vb-id"),attr(f,"data-vb-value"),collect(f));',"});","var se=function(){return document.scrollingElement||document.documentElement;};","var rep=null;function report(){if(rep)return;rep=requestAnimationFrame(function(){rep=null;var s=se();",' parent.postMessage({type:"vb-html-scroll",top:s.scrollTop,left:s.scrollLeft,height:s.scrollHeight,width:s.scrollWidth,cH:s.clientHeight,cW:s.clientWidth},"*");});}','window.addEventListener("scroll",report,{passive:true});','window.addEventListener("resize",report);','window.addEventListener("load",report);','window.addEventListener("message",function(e){'," var d=e.data;if(!d)return;",' if(d.type==="vb-html-append"){',"  var s=se();","  var pinned=s.scrollTop+s.clientHeight>=s.scrollHeight-4;",'  document.body.insertAdjacentHTML("beforeend",d.html);',"  if(pinned)s.scrollTop=s.scrollHeight;report();",' }else if(d.type==="vb-html-patch"){',"  var el=document.getElementById(d.id);if(el)el.outerHTML=d.html;report();",' }else if(d.type==="vb-html-scrollto"){','  var t=se();if(typeof d.top==="number")t.scrollTop=d.top;if(typeof d.left==="number")t.scrollLeft=d.left;report();',' }else if(d.type==="vb-html-frame"){','  document.documentElement.style.scrollbarWidth=d.on?"none":"";report();'," }","});","})();"].join(`
`);function Zo(s){return String(s??"").replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,"").replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,"").replace(/(\s(?:href|src)\s*=\s*)(["']?)\s*javascript:[^"'\s>]*\2/gi,'$1"#"')}function gx(s){const e=getComputedStyle(s),t={};for(const n of fx){const i=e.getPropertyValue(n).trim();i&&(t[n]=i)}return t}function vx({themeVars:s={},html:e=""}={}){return`<!doctype html><html><head><meta charset="utf-8"><style>:root{${Object.entries(s).map(([n,i])=>`${n}:${i}`).join(";")}}
${px}</style></head><body>${Zo(e)}</body><script>${mx}<\/script></html>`}const _x=8;class xx{constructor(e){this.win=e,this.top=0,this.left=0,this.height=0,this.width=0,this.cH=0,this.cW=0,this._subs=new Set}update(e){this.top=Number(e.top)||0,this.left=Number(e.left)||0,this.height=Number(e.height)||0,this.width=Number(e.width)||0,this.cH=Number(e.cH)||0,this.cW=Number(e.cW)||0;for(const t of this._subs)t()}subscribe(e){return this._subs.add(e),()=>this._subs.delete(e)}setFrame(e){this.win._send({type:"vb-html-frame",on:!!e})}get scrollTop(){return this.top}set scrollTop(e){this.win._send({type:"vb-html-scrollto",top:Math.max(0,Number(e)||0)})}get scrollLeft(){return this.left}set scrollLeft(e){this.win._send({type:"vb-html-scrollto",left:Math.max(0,Number(e)||0)})}get scrollHeight(){return this.height}get scrollWidth(){return this.width}get clientHeight(){return this.cH}get clientWidth(){return this.cW}}class yx extends Gi{constructor({id:e,title:t,width:n,height:i,html:r,closable:o,container:a,manager:l,onEvent:c}){super({id:e,title:t,widthChars:Math.max(20,Math.round((Number(n)||560)/_x)),container:a,manager:l,kind:"html",closable:o}),this.height=Number(i)>0?Number(i):320,this.html=String(r??""),this.onEvent=c,this._loaded=!1,this._queue=[],this.scroll=new xx(this),this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="html-body",e.style.cssText=[`width:${this.widthChars}ch`,`height:${this.height}px`,"max-width:92vw","display:flex","padding:0"].join(";");const t=document.createElement("iframe");t.dataset.role="html-frame",t.setAttribute("sandbox","allow-scripts allow-forms"),t.style.cssText="flex:1 1 auto;border:0;width:100%;height:100%;background:transparent",t.addEventListener("load",()=>{var n;this._loaded=!0;for(const i of this._queue)this._post(i);this._queue.length=0,(n=this.wframe)!=null&&n.enabled&&this._post({type:"vb-html-frame",on:!0})}),this.frame=t,e.appendChild(t),this.body=e,this.el.appendChild(e),this._render()}_render(){this._loaded=!1,this._queue.length=0,this.frame.setAttribute("srcdoc",vx({themeVars:gx(this.container),html:this.html}))}setHtml(e){this.html=String(e??""),this._render()}appendHtml(e){const t=Zo(e);this.html+=t,this._send({type:"vb-html-append",html:t})}patchHtml(e,t){this._send({type:"vb-html-patch",id:String(e),html:Zo(t)})}_send(e){this._loaded?this._post(e):this._queue.push(e)}_post(e){var t;(t=this.frame.contentWindow)==null||t.postMessage(e,"*")}handleBridgeEvent(e){if(!this.onEvent)return;const t=e.values&&typeof e.values=="object"?e.values:{},n=["click","change","submit"].includes(e.kind)?e.kind:"click";this.onEvent({window_id:this.id,event:String(e.event??""),kind:n,id:e.id==null?null:String(e.id),value:e.value===void 0?null:e.value,values:t})}_scrollTarget(){return this.scroll}applyTheme(){super.applyTheme(),this.isMinimized||this._render()}_renderBody(){}}function bx({container:s,windowManager:e,sendEvent:t,onThemeChange:n}){const i=new Set;e.registerType("html",o=>{var l;(l=e.get(o.window_id))==null||l.close();const a=e.adopt(new yx({id:o.window_id,title:o.title,width:o.width,height:o.height,html:o.html,closable:o.closable,container:s,manager:e,onEvent:c=>t({type:"event",event:"html_event",payload:c})}));return i.add(a),a.bringToFront(),a}),window.addEventListener("message",o=>{var l;const a=(l=o.data)==null?void 0:l.type;if(!(a!=="vb-html-event"&&a!=="vb-html-scroll")){for(const c of i)if(c.frame.contentWindow===o.source){a==="vb-html-event"?c.handleBridgeEvent(o.data):c.scroll.update(o.data);return}}}),n==null||n(()=>{for(const o of i)e.get(o.id)===o?o.applyTheme():i.delete(o)});const r=o=>{const a=e.get(o.window_id);return a&&a.kind==="html"?a:null};return{name:"html",actions:{html_set:o=>{var a;return(a=r(o))==null?void 0:a.setHtml(o.html)},html_append:o=>{var a;return(a=r(o))==null?void 0:a.appendHtml(o.html)},html_patch:o=>{var a;return(a=r(o))==null?void 0:a.patchHtml(o.id,o.html)}}}}class Sx{constructor({container:e,sendEvent:t}){this.container=e,this.sendEvent=t,this.remoteGroups=[],this.optionsGroup=null,this.openGroup=null,this.el=document.createElement("div"),this.el.dataset.role="vb-screen-menu",this.el.style.cssText=["position:absolute","top:0","left:0","right:0","z-index:1400","font:12px system-ui,sans-serif"].join(";"),this.bar=document.createElement("div"),this.bar.dataset.role="vb-screen-menu-bar",this.bar.style.cssText=["display:grid","grid-template-columns:1fr auto 1fr","align-items:center","height:26px","padding:0 6px","background:var(--vb-screenbar-bg, rgba(230,230,235,0.95))","color:var(--vb-screenbar-fg, #000)","border:1px solid rgba(0,0,0,0.4)","box-sizing:border-box","cursor:ns-resize","user-select:none"].join(";"),this.el.appendChild(this.bar),this.groupsEl=document.createElement("div"),this.groupsEl.style.cssText="display:flex;justify-self:start;min-width:0",this.bar.appendChild(this.groupsEl),this.titleEl=document.createElement("span"),this.titleEl.dataset.role="vb-screen-bar-title",this.titleEl.style.cssText=["overflow:hidden","text-overflow:ellipsis","white-space:nowrap","font-weight:600","justify-self:center","min-width:0"].join(";"),this.bar.appendChild(this.titleEl),this.gadgetsEl=document.createElement("div"),this.gadgetsEl.style.cssText="display:flex;gap:3px;justify-self:end",this.bar.appendChild(this.gadgetsEl),this.dropdown=document.createElement("div"),this.dropdown.dataset.role="vb-screen-menu-dropdown",this.dropdown.style.cssText=["position:absolute","top:100%","left:0","display:none","background:#d4d4d4","border:1px solid #000","min-width:190px","box-shadow:0 4px 8px rgba(0,0,0,0.3)"].join(";"),this.el.appendChild(this.dropdown),e.appendChild(this.el),this._onOutsideClick=n=>{this.el.contains(n.target)||this._closeDropdown()},document.addEventListener("pointerdown",this._onOutsideClick)}setTitle(e){this.titleEl.textContent=e}addGadget(e,t,n,i){const r=document.createElement("button");return r.dataset.role=e,r.title=n,r.style.cssText=["width:20px","height:16px","padding:0","border:none","flex:none","cursor:pointer","background:var(--vb-screenbar-fg, #000)",`-webkit-mask:url("${t}") center/100% 100% no-repeat`,`mask:url("${t}") center/100% 100% no-repeat`].join(";"),r.addEventListener("pointerdown",o=>o.stopPropagation()),r.addEventListener("click",o=>{o.stopPropagation(),i()}),this.gadgetsEl.appendChild(r),r}setSpec(e){this.remoteGroups=e&&Array.isArray(e.groups)?e.groups:[],this._render()}setOptionsGroup(e){this.optionsGroup=e?{name:"Options",items:e,local:!0}:null,this._render()}_allGroups(){return this.optionsGroup?[this.optionsGroup,...this.remoteGroups]:this.remoteGroups}_render(){this.groupsEl.replaceChildren();const e=this._allGroups();for(const t of e){const n=document.createElement("button");n.dataset.role="vb-menu-group",n.dataset.group=t.name,n.textContent=t.name;const i=t.name===this.openGroup;n.style.cssText=["padding:4px 12px","border:none","cursor:pointer","font:inherit",i?"background:#3b7bc4;color:#fff":"background:transparent;color:inherit"].join(";"),n.addEventListener("pointerdown",r=>r.stopPropagation()),n.addEventListener("click",r=>{r.stopPropagation(),this._toggleGroup(t)}),this.groupsEl.appendChild(n)}if(this.openGroup){const t=e.find(n=>n.name===this.openGroup);t?this._renderDropdown(t):this._closeDropdown()}}_toggleGroup(e){if(this.openGroup===e.name){this._closeDropdown();return}this.openGroup=e.name,this._render(),this._renderDropdown(e)}_renderDropdown(e){this.dropdown.replaceChildren();for(const t of e.items){const n=document.createElement("div");n.dataset.role="vb-menu-item",n.style.cssText=["padding:5px 16px","cursor:pointer","white-space:nowrap","display:flex","align-items:center","justify-content:space-between","gap:16px","color:#000"].join(";");const i=document.createElement("span");if(i.textContent=t.label,n.appendChild(i),e.local){n.dataset.itemKey=t.key;const r=document.createElement("span");r.dataset.role="vb-menu-checkbox",r.textContent=t.checked?"✓":"",r.style.cssText="width:1em;display:inline-block;font-weight:700",n.appendChild(r),n.addEventListener("click",o=>{o.stopPropagation(),t.onToggle(!t.checked),this._closeDropdown()})}else n.dataset.itemId=t.id,n.addEventListener("click",r=>{r.stopPropagation(),this.sendEvent({type:"event",event:"menu_select",payload:{item_id:t.id}}),this._closeDropdown()});n.addEventListener("pointerenter",()=>{n.style.background="#3b7bc4",n.style.color="#fff"}),n.addEventListener("pointerleave",()=>{n.style.background="",n.style.color="#000"}),this.dropdown.appendChild(n)}this.dropdown.style.display="block"}_closeDropdown(){this.openGroup!==null&&(this.openGroup=null,this.dropdown.style.display="none",this._render())}destroy(){document.removeEventListener("pointerdown",this._onOutsideClick),this.el.remove()}}class Mx{constructor(e,t=()=>{}){this.container=e,this.onOptionsChange=t,this.types=new Map,this.windows=new Map,this.optionsSource=null,this.activeWindow=null,this.z=900,this.dockSlots=[]}registerType(e,t){this.types.set(e,t)}open(e,t){const n=this.types.get(e);return n?n(t):(console.warn(`viewbase: neznámý typ okna '${e}'`),null)}adopt(e){return this.windows.set(e.id,e),e}get(e){return this.windows.get(e)??null}close(e){var t;(t=this.windows.get(e))==null||t.close()}_setActive(e){this.activeWindow=e,e.getOptionsItems()!=null&&(this.optionsSource=e),this.refreshOptions()}hasKeyboard(e){return this.activeWindow===null||this.activeWindow===e}refreshOptions(){var e;this.onOptionsChange(((e=this.optionsSource)==null?void 0:e.getOptionsItems())??null)}applyTheme(){for(const e of this.windows.values())e.applyTheme()}_nextZ(){return this.z+=1,this.z}sendToBack(e){const t=[...this.windows.values()].filter(i=>i!==e).sort((i,r)=>Number(i.el.style.zIndex)-Number(r.el.style.zIndex));let n=900;e.setZ(n);for(const i of t)n+=1,i.setZ(n);this.z=n}_assignDockSlot(e){let t=this.dockSlots.indexOf(null);return t===-1?(t=this.dockSlots.length,this.dockSlots.push(e)):this.dockSlots[t]=e,e._dockSlot=t,t}_releaseDockSlot(e){const t=e._dockSlot;t!=null&&this.dockSlots[t]===e&&(this.dockSlots[t]=null),e._dockSlot=null}_forget(e){const t=this.windows.get(e);if(this.windows.delete(e),this.activeWindow===t&&(this.activeWindow=null),t!==this.optionsSource)return;let n=null;for(const i of this.windows.values())i.getOptionsItems()!=null&&(!n||Number(i.el.style.zIndex)>Number(n.el.style.zIndex))&&(n=i);this.optionsSource=n,this.refreshOptions()}}function Ex({container:s,screenId:e,connection:t}){const n=new mr,i=x=>t.send({...x,screen_id:e}),r=new Sx({container:s,sendEvent:i});let o=()=>null;const a=new Mx(s,x=>r.setOptionsGroup(x??o())),l=[];function c(x){const _=Rh(x);W_(_,s),a.applyTheme(),s.style.background=_.background??"#000";for(const M of l)M(_)}const h={container:s,screenId:e,store:n,sendEvent:i,windowManager:a,onThemeChange:x=>l.push(x),setOptionsFallback:x=>{o=x},applyTheme:c},d=[bu(h),Pu(h),Au(h),dx(h),bx(h)];let u=null,f=!0,g=!1;function v(){var _,M;if(u||n.config.graph_window===!1)return;const x=s.style.display==="none";x&&(s.style.display="block"),u=ax(h),x&&(s.style.display="none"),d.push(u),(_=u.setVisible)==null||_.call(u,f),(M=u.setResourcesPaused)==null||M.call(u,g)}const p={open_window:x=>a.open(x.kind??"control",x),close_window:x=>a.close(x.window_id),open_menu:x=>{n.menu={groups:x.groups},r.setSpec(n.menu)}};function m(x){var _;if(p[x])return p[x];for(const M of d){const C=(_=M.actions)==null?void 0:_[x];if(C)return C}return null}return n.subscribe(x=>{var _;if(x.kind==="init"){v(),c(n.config.theme),r.setSpec(n.menu);for(const M of n.windows??[])a.open(M.kind??"control",M);n.config.log_window&&a.open("log"),n.config.title&&(document.title=`${n.config.title} – viewbase`);for(const M of d)(_=M.onInit)==null||_.call(M)}}),{screenId:e,container:s,store:n,bar:r,windowManager:a,handleAction(x){const _=m(x.action);_?_(x):console.warn("viewbase: neznámá akce",x.action)},openLog:()=>a.open("log"),logWindow:()=>a.get(Jo),setActive(x){var _;f=x,s.style.display=x?"block":"none";for(const M of d)(_=M.setVisible)==null||_.call(M,x)},setFullyHidden(x){var _;g=x;for(const M of d)(_=M.setResourcesPaused)==null||_.call(M,x)},destroy(){var x;for(const _ of d)(x=_.destroy)==null||x.call(_);r.destroy(),s.remove()}}}const wx=200;class Tx{constructor(e,t){this.rootContainer=e,this.connection=t,this.instances=new Map,this.order=[],this.zOrder=[],this.offsets=new Map,this.dragState=null,this.pendingLogs=[],this.logAutoOpened=!1,window.addEventListener("pointerup",()=>{this.dragState=null}),window.addEventListener("pointercancel",()=>{this.dragState=null})}get activeId(){return this.zOrder[0]}_createContainer(e){const t=document.createElement("div");return t.dataset.role="vb-screen",t.dataset.screenId=String(e),t.style.cssText="position:absolute;inset:0;overflow:hidden",this.rootContainer.appendChild(t),t}_register(e,t){if(this.instances.set(e,t),this.order.push(e),this.offsets.set(e,0),this.zOrder.push(e),this._wireScreenChrome(e,t),this._layout(),this.pendingLogs.length>0){const n=this.pendingLogs;this.pendingLogs=[];for(const i of n)this.appendLog(i)}}ensure(e){let t=this.instances.get(e);return t||(t=Ex({container:this._createContainer(e),screenId:e,connection:this.connection}),t.store.subscribe(n=>{n.kind==="init"&&this._renderTitle(e)}),this._register(e,t),t)}resolveStore(e){return this.ensure(e).store}appendLog(e){const t=[...this.instances.values()].map(n=>n.logWindow()).filter(Boolean);if(t.length===0){if(this.logAutoOpened)return;const n=this.instances.get(this.zOrder[0]);if(!n){this.pendingLogs.length<wx&&this.pendingLogs.push(e);return}this.logAutoOpened=!0,t.push(n.openLog())}for(const n of t)n.append(e)}routeAction(e){var t;(t=this.instances.get(e.screen_id??null))==null||t.handleAction(e)}cycleNext(){this.zOrder.length<2||(this.zOrder=ru(this.zOrder),this.offsets.set(this.zOrder[0],0),this.offsets.set(this.zOrder[1],0),this._layout())}_layout(){this.zOrder.forEach((e,t)=>{const n=this.instances.get(e),i=this.offsets.get(e)??0;t===0?(n.setActive(!0),n.container.style.zIndex="20",n.container.style.transform=Ta(i,n.container.clientHeight||0)):t===1?(n.setActive(!0),n.container.style.zIndex="10",n.container.style.transform=Ta(i,n.container.clientHeight||0)):(n.setActive(!1),n.container.style.zIndex="0",n.container.style.transform=""),n.setFullyHidden(t>=2)})}remove(e){const t=this.instances.get(e);t&&(t.logWindow()&&(this.logAutoOpened=!1),t.destroy(),this.instances.delete(e),this.order=this.order.filter(n=>n!==e),this.zOrder=this.zOrder.filter(n=>n!==e),this.offsets.delete(e),this.zOrder.length>0&&this._layout())}_renderTitle(e){var n,i,r;const t=this.instances.get(e);t&&((r=t.bar)==null||r.setTitle(((i=(n=t.store)==null?void 0:n.config)==null?void 0:i.title)||`Screen ${e}`))}_wireScreenChrome(e,t){const n=t.bar;n&&(this._renderTitle(e),n.addGadget("vb-screen-switch",kc,"Přepnout na další screen",()=>this.cycleNext()),this._wireDrag(e,n.bar))}_wireDrag(e,t){Po(t,{onStart:n=>this.zOrder[0]!==e?null:(this.dragState={screenId:e,startY:n.clientY,startOffset:this.offsets.get(e)??0},this.dragState),onMove:(n,i)=>{const r=this.instances.get(e);if(!r)return;const o=n.clientY-i.startY,a=iu(i.startOffset,o,r.container.clientHeight||0);this.offsets.set(e,a),this._layout()},onEnd:()=>{this.dragState=null}})}}const Wh=new $h,$n=new Qh;window.addEventListener("error",s=>{$n.show("frontend_error",`${s.message}
${s.filename}:${s.lineno}:${s.colno}`)});window.addEventListener("unhandledrejection",s=>{var e;$n.show("frontend_error",String(((e=s.reason)==null?void 0:e.stack)??s.reason))});function Ax(){try{const s=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(s.getContext("webgl2")||s.getContext("webgl")))}catch{return!1}}function Cx(){const s=document.getElementById("app");let e;const t=location.protocol==="https:"?"wss":"ws",n=new Zh(`${t}://${location.host}/ws`,null,{resolveStore:i=>e.resolveStore(i),onStatus:i=>{i==="init"?(Wh.hide(),$n.dismissIfConnectionRecovered()):i==="close"?$n.show("connection_lost","Connection Lost"):i==="connect_failed"?$n.show("connection_lost","Connection Failed"):i==="protocol_mismatch"&&$n.show("connection_lost","Protocol Mismatch — reload the page (F5)")},onAction:i=>{i.action==="screen_remove"?e.remove(i.screen_id):e.routeAction(i)},onLog:i=>{i.timestamp=new Date,e.appendLog(i),i.level==="error"&&$n.show("backend_error",Wc(i))}});e=new Tx(s,n),n.connect(),window.__viewbase={screenManager:e,connection:n}}Ax()?Cx():Wh.show("Tento prohlížeč nemá dostupné WebGL – vizualizaci nelze spustit. Zkus jiný prohlížeč nebo zapni hardwarovou akceleraci.");
