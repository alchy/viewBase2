const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/xterm-6GBZ9nXN.css"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Aa=1;function eu(s=null){return s?{type:"hello",protocol:Aa,sid:s}:{type:"hello",protocol:Aa}}function Ca(s){return JSON.stringify(s)}function tu(s){const e=JSON.parse(s);if(!e||typeof e!="object"||!e.type)throw new Error("Neplatná zpráva protokolu");return e}const Yc="vb_sid";function nu(){try{return localStorage.getItem(Yc)||null}catch{return null}}function iu(s){if(s)try{localStorage.setItem(Yc,s)}catch{}}class ru{constructor(e,t,{WebSocketImpl:n=globalThis.WebSocket,schedule:i=(f,g)=>setTimeout(f,g),minBackoff:r=500,maxBackoff:o=1e4,onStatus:a=()=>{},onAction:l=()=>{},onLog:c=()=>{},onSession:h=()=>{},onLoginFailed:u=()=>{},resolveStore:d=null}={}){this.url=e,this.store=t,this.WebSocketImpl=n,this.schedule=i,this.minBackoff=r,this.maxBackoff=o,this.backoff=r,this.onStatus=a,this.onAction=l,this.onLog=c,this.onSession=h,this.onLoginFailed=u,this.resolveStore=d,this.stopped=!1,this.everConnected=!1,this.ws=null}_storeFor(e){if(this.resolveStore){const t=this.resolveStore(e);if(t)return t}return this.store}connect(){const e=new this.WebSocketImpl(this.url);this.ws=e,e.onopen=()=>{this.everConnected=!0,this.backoff=this.minBackoff,e.send(Ca(eu(nu())))},e.onmessage=t=>this._onMessage(t.data),e.onclose=()=>{this.stopped||(this.onStatus(this.everConnected?"close":"connect_failed"),this.schedule(()=>this.connect(),this.backoff),this.backoff=Math.min(this.backoff*2,this.maxBackoff))}}_onMessage(e){let t;try{t=tu(e)}catch(n){console.warn("viewbase: malformed message from server",n);return}t.type==="init"?(iu(t.sid),this._storeFor(t.screen_id).applyInit(t),this.onStatus("init")):t.type==="patch"?this._storeFor(t.screen_id).applyPatch(t)||this.ws.close():t.type==="action"?this.onAction(t):t.type==="log"?this.onLog(t):t.type==="session"?this.onSession(t):t.type==="login_failed"?this.onLoginFailed():t.type==="error"&&(console.error("viewbase server:",t.error),t.error==="protocol_mismatch"&&(this.stopped=!0,this.onStatus("protocol_mismatch")))}send(e){this.ws&&this.ws.readyState===1&&this.ws.send(Ca(e))}}const Ra="vb-overlay-style",su=4,ou="600 16px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace";function au(){if(document.getElementById(Ra))return;const s=document.createElement("style");s.id=Ra,s.textContent="@keyframes vb-guru-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.15; } }",document.head.appendChild(s)}function $o({color:s,flash:e=!1,role:t="vb-overlay",input:n=!1}={}){au();const i=document.createElement("div");i.dataset.role=t,i.style.cssText=["position:fixed","inset:0","z-index:9999","display:none","background:#000000","user-select:none"].join(";");const r=document.createElement("div");r.dataset.role=`${t}-box`,r.style.cssText=["position:absolute","top:0","left:0","right:0",`border:${su}px solid ${s}`,"padding:10px 16px",`color:${s}`,"text-align:center",`font:${ou}`,"letter-spacing:0.5px","white-space:pre-wrap","word-break:break-word","box-sizing:border-box",e?"animation:vb-guru-blink 1s step-start infinite":""].filter(Boolean).join(";"),i.append(r);const o=(l="",c=null)=>{const h=document.createElement("div");return c&&(h.dataset.role=c),h.textContent=l,r.appendChild(h),h},a=({name:l="input",width:c="10ch",spacing:h="3px"}={})=>{const u=document.createElement("input");return u.type="text",u.dataset.role=`${t}-${l}`,u.style.cssText=["font:inherit",`color:${s}`,"background:transparent",`border:2px solid ${s}`,"padding:2px 10px",`width:${c}`,"text-align:center",`letter-spacing:${h}`,"outline:none","margin:8px 0"].join(";"),u};return{el:i,box:r,line:o,field:a,input:n?a():null}}class lu{constructor(e=document.body){this.reason=null;const{el:t,box:n,line:i}=$o({color:"#ff0000",flash:!0,role:"vb-guru-meditation"});this.el=t,this.el.style.cursor="pointer",this.box=n,this.box.dataset.role="vb-guru-box",this.bar=i("Software Failure.  Press mouse button or Esc to continue.","vb-guru-bar"),this.code=i("","vb-guru-code"),this.el.addEventListener("mousedown",()=>this.hide()),this._onKeydown=r=>{r.code==="Escape"&&this.visible&&(r.preventDefault(),this.hide())},window.addEventListener("keydown",this._onKeydown),e.appendChild(this.el)}show(e,t){this.reason=e,this.code.textContent=t??e,this.el.style.display="block"}hide(){this.el.style.display="none",this.reason=null}get visible(){return this.el.style.display!=="none"}dismissIfConnectionRecovered(){this.reason==="connection_lost"&&this.hide()}}const cu="#3bf28a",Pa="vb_user";class hu{constructor(e=document.body,t=()=>{}){this.send=t;const{el:n,box:i,line:r,field:o}=$o({color:cu,flash:!1,role:"vb-login"});this.el=n,this.box=i,this.bar=r("viewBase.  Sign in to continue.","vb-login-bar"),this.user=o({name:"user",width:"16ch",spacing:"1px"}),this.code=o({name:"code",width:"10ch"}),this.user.placeholder="user",this.code.placeholder="------",this.code.inputMode="numeric",this.code.autocomplete="one-time-code",i.append(this.user,this.code),this.err=r("","vb-login-error"),this.hint=r("Authenticator code for your user.  Ask the administrator if you do not have one.");try{this.user.value=window.localStorage.getItem(Pa)??""}catch{}e.appendChild(this.el);for(const a of[this.user,this.code])a.addEventListener("keydown",l=>{if(l.stopPropagation(),l.key==="Enter"){if(a===this.user&&!this.code.value){this.code.focus();return}this._submit()}})}_submit(){const e=this.user.value.trim(),t=this.code.value.replace(/\s+/g,"");if(!(!e||!t)){try{window.localStorage.setItem(Pa,e)}catch{}this.send({type:"login",user:e,code:t})}}ask(){this.visible||(this.err.textContent="",this.code.value="",this.el.style.display="block",(this.user.value?this.code:this.user).focus())}reject(e="Sign-in failed"){this.visible&&(this.err.textContent=e,this.code.value="",this.code.focus())}hide(){this.el.style.display="none"}get visible(){return this.el.style.display!=="none"}}class uu{constructor(e=document.body){this.el=document.createElement("div"),this.el.dataset.role="status-overlay",this.el.style.cssText=["position:fixed","top:16px","left:50%","transform:translateX(-50%)","max-width:70%","padding:10px 18px","border-radius:6px","background:var(--vb-status-bg, rgba(20,23,28,0.85))","color:var(--vb-status-fg, #ffffff)","font:14px/1.4 system-ui,sans-serif","z-index:1000","display:none","pointer-events:none","text-align:center"].join(";"),e.appendChild(this.el)}show(e){this.el.textContent=e,this.el.style.display="block"}hide(){this.el.style.display="none"}}function du(s,e){var t;try{(t=s.setPointerCapture)==null||t.call(s,e)}catch{}}function Lo(s,{onStart:e,onMove:t,onEnd:n=()=>{}}){let i=null;const r=o=>{var l;if(i===null)return;const a=i;i=null;try{(l=s.releasePointerCapture)==null||l.call(s,o.pointerId)}catch{}n(o,a)};s.addEventListener("pointerdown",o=>{const a=e(o);a!=null&&(i=a,du(s,o.pointerId))}),s.addEventListener("pointermove",o=>{if(i!==null){if(o.buttons===0){r(o);return}t(o,i)}}),s.addEventListener("pointerup",r),s.addEventListener("pointercancel",r),s.addEventListener("lostpointercapture",r)}const jt=16;function As(s){const e=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><g fill="none" stroke="#000" stroke-width="1" shape-rendering="crispEdges">${s}</g></svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(e)}`}const fu=As('<rect x="5.5" y="3.5" width="5" height="9"/>'),La=As('<rect x="2.5" y="2.5" width="11" height="11"/><rect x="2.5" y="2.5" width="5" height="5"/>'),jc=As('<path d="M1.5 9.5 V2.5 H10.5 V6.5 M1.5 9.5 H5.5"/><rect x="5.5" y="6.5" width="9" height="7"/>'),Ua=As('<rect x="2.5" y="2.5" width="4" height="4"/><rect x="6.5" y="6.5" width="7" height="7"/>'),ds=26;function qc(s){return Math.max(0,Math.min(1,s))}function pu(s,e,t){return!t||t<=0?s:qc(s+e/t)}function Da(s,e){return s<=0?"":`translateY(${Math.round(qc(s)*e)}px)`}function mu(s){if(s.length<2)return s.slice();const[e,t,...n]=s;return[t,e,...n]}const Jo=4;function Qo(s,e,t=Jo){return s.x<e.x+e.w+t&&s.x+s.w+t>e.x&&s.y<e.y+e.h+t&&s.y+s.h+t>e.y}function gu(s,e){const t=e.top??0;return{x:Math.max(0,Math.min(s.x,e.width-s.w)),y:Math.max(t,Math.min(s.y,e.height-s.h))}}function vu(s,e,t,n,i=Jo){const r=t+i,o=n.top??0;for(let a=n.height-t-i;a>=o;a-=r){const l=s.filter(h=>h.y<a+t+i&&h.y+h.h+i>a),c=[i,...l.map(h=>h.x+h.w+i)].sort((h,u)=>h-u);for(const h of c){if(h+e>n.width)continue;const u={x:h,y:a,w:e,h:t};if(!l.some(d=>Qo(u,d,i)))return{x:h,y:a}}}return{x:i,y:o}}function _u(s,e,t,n,i=Jo){const r=gu({x:e.x,y:e.y,w:s.w,h:s.h},n),o=(a,l)=>!t.some(c=>Qo({x:a,y:l,w:s.w,h:s.h},c,i));return o(r.x,r.y)?{x:r.x,y:r.y}:o(r.x,s.y)?{x:r.x,y:s.y}:o(s.x,r.y)?{x:s.x,y:r.y}:{x:s.x,y:s.y}}const rn=20,xu=12;function Ia(s,e,t,n,i=xu){if(!(e>t)||n<=0)return{offset:0,size:0};const r=Math.max(i,Math.min(n,n*t/e)),o=e-t;return{offset:(n-r)*Math.max(0,Math.min(1,s/o)),size:r}}function Fa(s,e,t,n,i){const r=e-t;return r<=0?0:Math.max(0,Math.min(1,s/r))*(n-i)}class yu{constructor(e,t){this.win=e,this.getTarget=t,this.enabled=!1,this._bound=null,this._onScroll=()=>this.update(),this._observer=null,this._build()}_build(){const e="var(--vb-frame-knob, var(--vb-frame-line, #8a93a3))",t="transparent";this.vbar=document.createElement("div"),this.vbar.dataset.role="vb-frame-v",this.vbar.style.cssText=["position:absolute","top:0","right:0",`width:${rn}px`,`bottom:${rn}px`,`background:${t}`,"display:none","box-sizing:border-box","user-select:none"].join(";"),this.vtrack=document.createElement("div"),this.vtrack.dataset.role="vb-frame-vtrack",this.vtrack.style.cssText=["position:absolute","left:4px","right:4px","top:4px","bottom:4px","box-sizing:border-box","cursor:pointer"].join(";"),this.vknob=document.createElement("div"),this.vknob.dataset.role="vb-frame-vknob",this.vknob.style.cssText=["position:absolute","left:0","right:0","top:0","height:100%",`background:${e}`,"box-shadow:var(--vb-frame-glow, none)","cursor:grab","touch-action:none"].join(";"),this.vtrack.appendChild(this.vknob),this.vbar.append(this.vtrack),this.hbar=document.createElement("div"),this.hbar.dataset.role="vb-frame-h",this.hbar.style.cssText=["position:absolute","left:0","bottom:0",`height:${rn}px`,`right:${rn}px`,`background:${t}`,"display:none","box-sizing:border-box","user-select:none"].join(";"),this.htrack=document.createElement("div"),this.htrack.dataset.role="vb-frame-htrack",this.htrack.style.cssText=["position:absolute","top:4px","bottom:4px","left:4px","right:4px","box-sizing:border-box","cursor:pointer"].join(";"),this.hknob=document.createElement("div"),this.hknob.dataset.role="vb-frame-hknob",this.hknob.style.cssText=["position:absolute","top:0","bottom:0","left:0","width:100%",`background:${e}`,"box-shadow:var(--vb-frame-glow, none)","cursor:grab","touch-action:none"].join(";"),this.htrack.appendChild(this.hknob),this.hbar.append(this.htrack),this.vtrack.addEventListener("pointerdown",n=>{if(n.target===this.vknob)return;const i=this.getTarget();if(!i)return;const r=n.clientY<this.vtrack.getBoundingClientRect().top+this.vknob.offsetTop;this.scrollBy(0,r?-i.clientHeight:i.clientHeight)}),this.htrack.addEventListener("pointerdown",n=>{if(n.target===this.hknob)return;const i=this.getTarget();if(!i)return;const r=n.clientX<this.htrack.getBoundingClientRect().left+this.hknob.offsetLeft;this.scrollBy(r?-i.clientWidth:i.clientWidth,0)}),this._wireKnobDrag(this.vknob,"v"),this._wireKnobDrag(this.hknob,"h"),this.win.el.append(this.vbar,this.hbar)}_wireKnobDrag(e,t){let n=null;const i=t==="v"?this.vtrack:this.htrack;e.addEventListener("pointerdown",o=>{var l;const a=this.getTarget();if(a){o.stopPropagation(),o.preventDefault(),n={pos:t==="v"?o.clientY:o.clientX,start:t==="v"?e.offsetTop:e.offsetLeft,target:a};try{(l=e.setPointerCapture)==null||l.call(e,o.pointerId)}catch{}}}),e.addEventListener("pointermove",o=>{if(!n)return;const a=n.target;if(t==="v"){const l=i.clientHeight,c=n.start+(o.clientY-n.pos);a.scrollTop=Fa(c,l,e.offsetHeight,a.scrollHeight,a.clientHeight)}else{const l=i.clientWidth,c=n.start+(o.clientX-n.pos);a.scrollLeft=Fa(c,l,e.offsetWidth,a.scrollWidth,a.clientWidth)}});const r=()=>{n=null};e.addEventListener("pointerup",r),e.addEventListener("pointercancel",r)}scrollBy(e,t){const n=this.getTarget();n&&(t&&(n.scrollTop+=t),e&&(n.scrollLeft+=e))}setEnabled(e){this.enabled=!!e,this.vbar.style.display=this.enabled?"block":"none",this.hbar.style.display=this.enabled?"block":"none",this.win.el.style.paddingRight=this.enabled?`${rn}px`:"",this.win.el.style.paddingBottom=this.enabled?`${rn}px`:"",this.win.bar&&(this.win.bar.style.marginRight=this.enabled?`-${rn}px`:"",this.win.bar.style.paddingRight=this.enabled?`${(rn-18)/2}px`:"",this.vbar.style.top=this.enabled?`${this.win._headerH()}px`:"0"),this.rebind()}rebind(){var t;const e=this.enabled?this.getTarget():null;this._bound&&this._bound!==e&&this._unbind(),e&&this._bound!==e&&(typeof e.addEventListener=="function"?(e.addEventListener("scroll",this._onScroll),e.style&&(e.style.scrollbarWidth="none"),typeof MutationObserver<"u"&&(this._observer=new MutationObserver(()=>this.update()),this._observer.observe(e,{childList:!0,subtree:!0,characterData:!0}))):typeof e.subscribe=="function"&&(this._unsubscribe=e.subscribe(this._onScroll),(t=e.setFrame)==null||t.call(e,!0)),this._bound=e),this.update()}_unbind(){var t,n,i;const e=this._bound;e&&(typeof e.removeEventListener=="function"?(e.removeEventListener("scroll",this._onScroll),e.style&&(e.style.scrollbarWidth="")):((t=this._unsubscribe)==null||t.call(this),this._unsubscribe=null,(n=e.setFrame)==null||n.call(e,!1)),(i=this._observer)==null||i.disconnect(),this._observer=null,this._bound=null)}update(){if(!this.enabled)return;const e=this.getTarget(),t=Math.max(0,this.vtrack.clientHeight),n=e?Ia(e.scrollTop,e.scrollHeight,e.clientHeight,t):{offset:0,size:0};this.vknob.style.display=n.size>0?"block":"none",this.vknob.style.top=`${n.offset}px`,this.vknob.style.height=`${n.size}px`;const i=Math.max(0,this.htrack.clientWidth),r=e?Ia(e.scrollLeft,e.scrollWidth,e.clientWidth,i):{offset:0,size:0};this.hknob.style.display=r.size>0?"block":"none",this.hknob.style.left=`${r.offset}px`,this.hknob.style.width=`${r.size}px`}}function bu(s,e,t,n,i){const r=Math.max(0,i.width-t),o=Math.max(0,i.height-n);return{x:Math.min(Math.max(0,s),r),y:Math.min(Math.max(0,e),o)}}const Su=64;function Na(s,e,t,n,i){const r=Math.min(Su,t),o=r-t,a=i.width-r,l=ds,c=Math.max(l,i.height-n);return{x:Math.min(Math.max(o,s),a),y:Math.min(Math.max(l,e),c)}}const Oa=28,Mu="10ch",Eu="vb-pos:",Kc=180,Zc=90,ir=28,wu="0.35";function Tu(s,e){const t=s??e;return t?Eu+String(t):null}function Au(s,e,t,n,i,r){const o=Math.max(1,i==null?void 0:i.w),a=Math.max(1,i==null?void 0:i.h),l=Math.max(a,Math.min(s.h+n,r.height-s.y));if(e==="sw"){const h=s.x+s.w,u=Math.max(o,Math.min(s.w-t,h));return{x:h-u,y:s.y,w:u,h:l}}const c=Math.max(o,Math.min(s.w+t,r.width-s.x));return{x:s.x,y:s.y,w:c,h:l}}class zn{constructor({id:e,title:t,widthChars:n,container:i,manager:r,kind:o,closable:a=!0,optionsProvider:l=null}){this.id=e,this.title=t,this.widthChars=n,this.container=i,this.manager=r,this.kind=o,this.closable=a!==!1,this.optionsProvider=l,this.isMinimized=!1,this.saved=null,this.maximizedFrom=null,this.dragOffset=null,this.resizeState=null,this.size=null,this.grips=[],this.body=null,this.el=document.createElement("div"),this.el.dataset.role="vb-window",this.el.dataset.windowId=String(e),this.el.style.cssText=["position:absolute","left:0","top:0","box-sizing:border-box","background:var(--vb-window-body-bg, rgba(255,255,255,0.97))","color:var(--vb-window-body-fg, #1f2430)","box-shadow:var(--vb-window-shadow, 0 6px 20px rgba(0,0,0,0.22))","border:1px solid var(--vb-window-border, transparent)","border-radius:6px","overflow:hidden","user-select:none","font:13px/1.5 system-ui,sans-serif","z-index:900"].join(";"),this._buildHeader()}_buildBody(){}_renderBody(){}_mount(){this.container.appendChild(this.el),this.body&&(this.body.style.userSelect="text"),this._buildGrips(),this.wframe=new yu(this,()=>this._scrollTarget()),this._syncFrame();const e=this._loadPos();e&&Number.isFinite(e.w)&&Number.isFinite(e.h)&&this._applySize(e.w,e.h),e&&Number.isFinite(e.dx)&&Number.isFinite(e.dy)&&(this.dockPos={x:e.dx,y:e.dy});const t=this._bounds(),n=this.manager.windows.size%8*24,i=bu(40+n,40+n,this._boxW(),this._boxH(),t),r=e?Na(e.x,e.y,this._boxW(),this._headerH(),t):i;this._place(r.x,r.y),this.el.addEventListener("pointerdown",()=>this.bringToFront())}_posKey(){return Tu(this.id,this.title)}_loadPos(){const e=this._posKey();if(!e)return null;try{const t=localStorage.getItem(e);if(!t)return null;const n=JSON.parse(t);if(Number.isFinite(n==null?void 0:n.x)&&Number.isFinite(n==null?void 0:n.y))return n}catch{}return null}_savePos(){const e=this._posKey();if(!e)return;const t=this.isMinimized?this.saved??{x:this.x,y:this.y}:{x:this.x,y:this.y},n={x:t.x,y:t.y};this.size&&(n.w=this.size.w,n.h=this.size.h),this.dockPos&&(n.dx=this.dockPos.x,n.dy=this.dockPos.y);try{localStorage.setItem(e,JSON.stringify(n))}catch{}}_width(){return this.widthChars*8+24}_boxW(){return this.size?this.size.w:this._width()}_boxH(){return this.size?this.size.h:200}_bounds(){return{width:this.container.clientWidth||800,height:this.container.clientHeight||600}}_dockBounds(){return{...this._bounds(),top:ds}}_buildHeader(){const e=document.createElement("div");e.dataset.role="vb-titlebar",e.style.cssText=["display:flex","align-items:center","gap:6px","padding:4px 6px","cursor:move","background:var(--vb-window-header-bg, #d8dde6)","background-image:var(--vb-window-header-pattern, none)","color:var(--vb-window-header-fg, #1f2430)"].join(";"),this.closeGadget=null,this.closable&&(this.closeGadget=this._gadget("close",fu),this.closeGadget.addEventListener("click",t=>{t.stopPropagation(),this.close()})),this.titleEl=document.createElement("div"),this.titleEl.style.cssText=["flex:1","min-width:0","display:flex","align-items:center","gap:6px","text-align:left","font-weight:600","overflow:hidden"].join(";"),this.titleTextEl=document.createElement("span"),this.titleTextEl.textContent=this.title,this.titleTextEl.style.cssText="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0",this.focusEl=document.createElement("span"),this.focusEl.dataset.role="vb-focus",this.focusEl.title="Active window",this.focusEl.style.cssText=["flex:0 0 auto","width:5px","height:5px","border-radius:1px","background:currentColor","box-shadow:var(--vb-frame-glow, none)","opacity:0.85","display:none"].join(";"),this.titleEl.append(this.titleTextEl,this.focusEl),this.minGadget=this._gadget("minimize",La),this.minGadget.addEventListener("click",t=>{t.stopPropagation(),this.minimize()}),this.depthGadget=this._gadget("depth",jc),this.depthGadget.title="Send behind other windows",this.depthGadget.addEventListener("click",t=>{t.stopPropagation(),this.sendToBack()}),this.restoreGadget=this._gadget("restore",La),this.restoreGadget.addEventListener("click",t=>{t.stopPropagation(),this.restore()}),this.restoreGadget.style.display="none",this.closeGadget&&e.append(this.closeGadget),e.append(this.titleEl,this.minGadget,this.depthGadget,this.restoreGadget),this._dragFromHeader(e),e.addEventListener("dblclick",t=>{t.target.dataset.gadget||this.toggleMaximize()}),this.bar=e,this.el.appendChild(e)}_gadget(e,t){const n=document.createElement("button");return n.dataset.gadget=e,n.style.cssText=["flex:0 0 auto","width:18px","height:18px","padding:0","border:none","cursor:pointer","background:var(--vb-window-gadget, #5a6573)",`-webkit-mask:url("${t}") center/${jt}px ${jt}px no-repeat`,`mask:url("${t}") center/${jt}px ${jt}px no-repeat`].join(";"),n}_dragFromHeader(e){Lo(e,{onStart:t=>{if(t.target.dataset.gadget)return null;this.bringToFront();const n=this.el.getBoundingClientRect(),i=this.container.getBoundingClientRect();return this.dragOffset={x:t.clientX-n.left,y:t.clientY-n.top,contLeft:i.left,contTop:i.top},this.dragOffset},onMove:(t,n)=>{const i=t.clientX-n.contLeft-n.x,r=t.clientY-n.contTop-n.y;if(this.isMinimized){const a={x:this.x,y:this.y,w:this.el.offsetWidth,h:this.el.offsetHeight},l=_u(a,{x:i,y:r},this.manager.dockRects(this),this._dockBounds());this._place(l.x,l.y);return}const o=Na(i,r,this._boxW(),this._headerH(),this._bounds());this._place(o.x,o.y)},onEnd:()=>{this.dragOffset=null,this.isMinimized&&(this.dockPos={x:this.x,y:this.y}),this._savePos()}})}_headerH(){return this.bar.offsetHeight||Oa}_frameH(){var e;return(e=this.wframe)!=null&&e.enabled?rn:0}_scrollTarget(){return this.body??null}_syncFrame(){var n;if(!this.wframe)return;const e=getComputedStyle(this.container).getPropertyValue("--vb-window-frame").trim()==="1";this.wframe.setEnabled(e&&!this.isMinimized);const t=(n=this.grips)==null?void 0:n[0];if(t){const i=e?rn:ir;t.style.width=`${i}px`,t.style.height=`${i}px`;const r=t.firstElementChild;r&&(r.style.right=e?"2px":"4px",r.style.bottom=e?"2px":"5px")}this.size&&!this.isMinimized&&this._applySize(this.size.w,this.size.h)}_buildGrips(){this.grips=["se","sw"].map(e=>{const t=document.createElement("div");if(t.dataset.role=`vb-resize-${e}`,e==="se"){t.style.cssText=["position:absolute","bottom:0","right:0",`width:${ir}px`,`height:${ir}px`,"box-sizing:border-box","touch-action:none","cursor:nwse-resize","background:var(--vb-window-grip-bg, transparent)","border-left:1px solid var(--vb-window-grip-border, transparent)","border-top:1px solid var(--vb-window-grip-border, transparent)","border-bottom-right-radius:5px"].join(";");const n=document.createElement("div");n.dataset.role="vb-resize-glyph",n.style.cssText=["position:absolute","right:4px","bottom:5px","width:16px","height:16px","background:var(--vb-window-grip-fg, var(--vb-window-body-fg, #8a93a3))",`-webkit-mask:url("${Ua}") center/${jt}px ${jt}px no-repeat`,`mask:url("${Ua}") center/${jt}px ${jt}px no-repeat`,"pointer-events:none"].join(";"),t.appendChild(n)}else t.style.cssText=["position:absolute","bottom:2px","left:2px",`width:${ir}px`,`height:${ir}px`,"box-sizing:border-box","border-radius:3px","background:var(--vb-window-gadget, #8a93a3)","border:1px solid var(--vb-window-gadget, #8a93a3)","opacity:0","transition:opacity 0.12s","touch-action:none","cursor:nesw-resize"].join(";"),t.addEventListener("pointerenter",()=>this._showGrip(t,!0)),t.addEventListener("pointerleave",()=>this._showGrip(t,!1));return this._resizeFromGrip(t,e),this.el.appendChild(t),t})}_showGrip(e,t){e.dataset.role!=="vb-resize-se"&&(!t&&this.resizeState||(e.style.opacity=t&&!this.isMinimized?wu:"0"))}_resizeFromGrip(e,t){Lo(e,{onStart:n=>{if(this.isMinimized)return null;n.stopPropagation(),this.bringToFront();const i=this.el.getBoundingClientRect();return this.resizeState={corner:t,pointerX:n.clientX,pointerY:n.clientY,start:{x:this.x,y:this.y,w:i.width||this._boxW(),h:i.height||this._boxH()}},this._showGrip(e,!0),this.resizeState},onMove:(n,i)=>{if(this.isMinimized)return;const r=Au(i.start,i.corner,n.clientX-i.pointerX,n.clientY-i.pointerY,{w:Kc,h:Zc},this._bounds());this._place(r.x,r.y),this._applySize(r.w,r.h)},onEnd:()=>{this.resizeState=null,this._showGrip(e,!1),this._savePos()}})}_applySize(e,t){var n;this.size={w:Math.round(e),h:Math.round(t)},this.el.style.width=`${this.size.w}px`,this.el.style.height=`${this.size.h}px`,this.body&&(this.body.style.boxSizing="border-box",this.body.style.width="100%",this.body.style.maxWidth="none",this.body.style.height=`${Math.max(0,this.size.h-this._headerH()-this._frameH())}px`,this.body.style.overflow="auto",(n=this.wframe)==null||n.update())}_place(e,t){this.x=e,this.y=t,this.el.style.left=`${e}px`,this.el.style.top=`${t}px`}toggleMaximize(){if(this.isMinimized)return;const e=this._bounds();if(this.maximizedFrom){const t=this.maximizedFrom;this.maximizedFrom=null,this._applySize(t.w,t.h),this._place(t.x,t.y)}else{const t=this.el.getBoundingClientRect();this.maximizedFrom={x:this.x,y:this.y,w:t.width||this._boxW(),h:t.height||this._boxH()},this._place(0,ds),this._applySize(e.width,e.height-ds)}this._savePos()}minimize(){var i;if(this.isMinimized)return;this.isMinimized=!0,this.saved={x:this.x,y:this.y},this.body.style.display="none",(i=this.wframe)==null||i.setEnabled(!1),this.minGadget.style.display="none",this.restoreGadget.style.display="",this.el.dataset.role="vb-dock-strip",this.el.style.background="var(--vb-window-dock-bg, #c2c9d4)",this.el.style.height="";for(const r of this.grips)r.style.display="none";this.titleEl.style.fontSize="11px",this.titleEl.style.paddingRight=Mu,this.titleEl.style.overflow="visible",this.el.style.width="max-content";const e=this.el.offsetWidth||160,t=this.el.offsetHeight||Oa;this.el.style.width=`${e}px`;const n=this.manager.dockPlace(this,e,t);this._place(n.x,n.y)}restore(){if(!this.isMinimized)return;this.isMinimized=!1,this.el.dataset.role="vb-window",this.el.style.background="var(--vb-window-body-bg, rgba(255,255,255,0.97))",this.el.style.width="",this.titleEl.style.fontSize="",this.titleEl.style.paddingRight="",this.titleEl.style.overflow="",this.body.style.display="",this.minGadget.style.display="",this.depthGadget.style.display="",this.restoreGadget.style.display="none";for(const t of this.grips)t.style.display="";this._syncFrame(),this.size&&this._applySize(this.size.w,this.size.h),this._renderBody();const e=this.saved??{x:40,y:40};this._place(e.x,e.y),this.bringToFront()}getOptionsItems(){return this.optionsProvider?this.optionsProvider():null}setTitle(e){this.title=e,this.titleTextEl.textContent=e}setFocused(e){this.focusEl.style.display=e?"":"none"}bringToFront(){this.setZ(this.manager._nextZ()),this.manager._setActive(this)}setZ(e){this.el.style.zIndex=String(e)}sendToBack(){this.manager.sendToBack(this)}applyTheme(){this._syncFrame(),this.isMinimized||this._renderBody()}close(){this.el.remove(),this.manager._forget(this.id)}}const $c=["debug","info","warning","error"],Jc=["frontend","backend_api","backend_program","backend_user"];function Cu(){return{levels:Object.fromEntries($c.map(s=>[s,!0])),sources:Object.fromEntries(Jc.map(s=>[s,!0]))}}function Ru(s,e){return!(e.levels[s.level]===!1||e.sources[s.source]===!1)}function Pu(s){const e=s instanceof Date?s:new Date(s),t=i=>String(i).padStart(2,"0");return`${`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}`} ${t(e.getHours())}:${t(e.getMinutes())}:${t(e.getSeconds())}`}function Qc(s){const e=s.component?`${s.source}/${s.component}`:s.source,t=s.timestamp?`${Pu(s.timestamp)} `:"",n=[s.session,s.ip].filter(Boolean).join(" ");return`${t}[${s.level}] ${n?`${n} `:""}${e}: ${s.message}`}const Lu=1e3,ea="__log";class Uu extends zn{constructor({container:e,manager:t}){super({id:ea,title:"Log",widthChars:64,container:e,manager:t,kind:"log",closable:!1}),this.filters=Cu(),this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="log-body",e.style.cssText=["padding:6px 8px",`width:${this.widthChars}ch`,"max-width:92vw","height:240px","overflow-y:auto","font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace","white-space:pre-wrap","word-break:break-word"].join(";"),this.body=e,this.el.appendChild(e)}append(e){if(!Ru(e,this.filters))return;const t=document.createElement("div");for(t.dataset.role="log-row",t.textContent=Qc(e),this.body.appendChild(t);this.body.childElementCount>Lu;)this.body.firstElementChild.remove();this.body.scrollTop=this.body.scrollHeight}getOptionsItems(){const e=(t,n)=>i=>{this.filters[t][n]=i,this.manager.refreshOptions()};return[...$c.map(t=>({key:`level-${t}`,label:t,checked:this.filters.levels[t]!==!1,onToggle:e("levels",t)})),...Jc.map(t=>({key:`source-${t}`,label:t,checked:this.filters.sources[t]!==!1,onToggle:e("sources",t)}))]}_renderBody(){}}function Du({container:s,windowManager:e}){return e.registerType("log",()=>{const t=e.get(ea);return t?(t.isMinimized&&t.restore(),t):e.adopt(new Uu({container:s,manager:e}))}),{name:"log"}}class gr{constructor(){this.config={},this.nodeTypes={},this.flowTypes={},this.flows=[],this.windows=[],this.menu=null,this.nodes=new Map,this.edges=new Map,this.seq=-1,this.listeners=new Set}static edgeKey(e,t){return e<=t?`${e}\0${t}`:`${t}\0${e}`}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}_emit(e){for(const t of this.listeners)t(e)}applyInit(e){this.config=e.config,this.nodeTypes=e.node_types,this.flowTypes=e.flow_types??{},this.flows=e.flows??[],this.windows=e.windows??[],this.menu=e.menu??null,this.nodes.clear(),this.edges.clear();for(const t of e.nodes)this.nodes.set(t.id,t);for(const t of e.edges)this.edges.set(gr.edgeKey(t.source,t.target),t);this.seq=e.seq,this._emit({kind:"init"})}applyNodeType(e,t){this.nodeTypes[e]=t??{}}applyPatch(e){if(e.seq!==this.seq+1)return!1;for(const[t,n]of e.remove_edges)this.edges.delete(gr.edgeKey(t,n));for(const t of e.remove_nodes){this.nodes.delete(t);for(const[n,i]of this.edges)(i.source===t||i.target===t)&&this.edges.delete(n)}for(const t of e.add_nodes)this.nodes.set(t.id,t);for(const t of e.update_nodes)this.nodes.set(t.id,t);for(const t of e.add_edges){if(!this.nodes.has(t.source)||!this.nodes.has(t.target)){console.warn("viewbase: edge with unknown endpoint skipped",t.source,t.target);continue}this.edges.set(gr.edgeKey(t.source,t.target),t)}return this.seq=e.seq,this._emit({kind:"patch",patch:e}),!0}}function Uo(s,e,{now:t=()=>Date.now(),schedule:n=(i,r)=>setTimeout(i,r)}={}){let i=-1/0,r=null,o=!1;function a(l){i=t(),s(...l)}return(...l)=>{const c=t()-i;if(!o&&c>=e){a(l);return}r=l,o||(o=!0,n(()=>{o=!1;const h=r;r=null,a(h)},Math.max(0,e-c)))}}const Iu=150;function Fu(s,e){if(s.type==="int"){const t=Math.round(Number(e));return Number.isFinite(t)?Math.max(s.min,Math.min(s.max,t)):s.value}if(s.type==="number"){const t=Number(e);return Number.isFinite(t)?Math.max(s.min,Math.min(s.max,t)):s.value}return s.type==="bool"?typeof e=="boolean"?e:s.value:s.type==="string"?String(e??"").slice(0,s.maxlength):s.type==="enum"&&s.options.some(t=>t.value===e)?e:s.value}function Nu(s,e){const t={};for(const n of s)n.key in e&&(t[n.key]=Fu(n,e[n.key]));return t}class Ou extends zn{constructor({id:e,title:t,fields:n,widthChars:i,onSubmit:r,container:o,manager:a,live:l=!1,closable:c}){super({id:e,title:t,widthChars:i,container:o,manager:a,kind:"control",closable:c}),this.fields=n,this.onSubmit=r,this.live=!!l,this.inputs=new Map,this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="control-body",e.style.cssText=["padding:8px 10px",`width:${this.widthChars}ch`,"max-width:90vw","font:13px/1.5 system-ui,sans-serif"].join(";"),this.body=e;const t=document.createElement("table");t.style.cssText="border-collapse:collapse;width:100%";for(const n of this.fields){const i=t.insertRow(),r=i.insertCell();r.textContent=n.label,r.style.cssText=["padding:3px 10px 3px 0","white-space:nowrap","color:var(--vb-window-key, #667788)"].join(";");const o=i.insertCell();o.style.cssText="padding:3px 0",this.inputs.set(n.key,this._buildWidget(n,o))}if(e.appendChild(t),this.live){const n=Uo(()=>this._submit(),Iu);e.addEventListener("input",n),e.addEventListener("change",n)}else{const n=document.createElement("button");n.dataset.role="control-apply",n.textContent="Apply",n.style.cssText=["margin-top:8px","padding:3px 12px","cursor:pointer","border:1px solid var(--vb-window-gadget, #8a93a3)","border-radius:4px","background:transparent","color:inherit"].join(";"),n.addEventListener("click",i=>{i.stopPropagation(),this._submit()}),e.appendChild(n)}this.el.appendChild(e)}_buildWidget(e,t){if(e.type==="enum"){const i=document.createElement("select");for(const r of e.options){const o=document.createElement("option");o.value=String(r.value),o.textContent=r.label,String(r.value)===String(e.value)&&(o.selected=!0),i.appendChild(o)}return t.appendChild(i),()=>{var r;return((r=e.options.find(o=>String(o.value)===i.value))==null?void 0:r.value)??e.value}}if(e.type==="int"||e.type==="number"){const i=e.step??(e.type==="int"?1:"any"),r=document.createElement("input");r.type="range",r.min=e.min,r.max=e.max,r.step=i==="any"?(e.max-e.min)/100||"any":i,r.value=e.value;const o=document.createElement("input");return o.type="number",o.min=e.min,o.max=e.max,o.step=i,o.value=e.value,o.style.cssText="width:5em;margin-left:6px",r.addEventListener("input",()=>{o.value=r.value}),o.addEventListener("input",()=>{r.value=o.value}),t.append(r,o),()=>o.value}if(e.type==="bool"){const i=document.createElement("input");return i.type="checkbox",i.checked=!!e.value,t.appendChild(i),()=>i.checked}const n=document.createElement("input");return n.type="text",n.maxLength=e.maxlength,n.value=e.value,t.appendChild(n),()=>n.value}_submit(){const e={};for(const[n,i]of this.inputs)e[n]=i();const t=Nu(this.fields,e);this.onSubmit&&this.onSubmit({window_id:this.id,values:t})}_renderBody(){}}const ku=30;function Bu({container:s,windowManager:e,sendEvent:t}){return e.registerType("control",n=>{var r;(r=e.get(n.window_id))==null||r.close();const i=e.adopt(new Ou({id:n.window_id,title:n.title,fields:n.fields,live:n.live,closable:n.closable,widthChars:ku,onSubmit:o=>t({type:"event",event:"window_submit",payload:o}),container:s,manager:e}));return i.bringToFront(),i}),{name:"control"}}function ka(s,e){const t=(s==null?void 0:s.meta)??{};return e==null?Object.entries(t).map(([n,i])=>({label:n,value:String(i??"")})):e.map(([n,i])=>({label:n,value:String(t[i]??"")}))}function zu(s,e){const t=e instanceof Set?e:new Set(e),n=(s.remove_nodes??[]).filter(o=>t.has(o)),i=new Set(n);return{refresh:(s.update_nodes??[]).map(o=>o.id).filter(o=>t.has(o)&&!i.has(o)),close:n}}class Gu extends zn{constructor({nodeId:e,title:t,rows:n,widthChars:i,container:r,manager:o}){super({id:e,title:t,widthChars:i,container:r,manager:o,kind:"detail"}),this.rows=n,this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="detail-body",e.style.cssText=["padding:6px 10px",`width:${this.widthChars}ch`,"max-width:90vw","font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace","overflow:auto"].join(";"),this.body=e,this._renderBody(),this.el.appendChild(e)}_renderBody(){this.body.replaceChildren();const e=document.createElement("table");e.style.cssText="border-collapse:collapse;width:100%";for(const{label:t,value:n}of this.rows){const i=e.insertRow(),r=i.insertCell();r.textContent=t,r.style.cssText=["padding:1px 12px 1px 0","vertical-align:top","white-space:nowrap","color:var(--vb-window-key, #667788)"].join(";");const o=i.insertCell();o.dataset.role="detail-value",o.textContent=n,o.style.cssText=["padding:1px 0","word-break:break-all","cursor:copy"].join(";"),o.addEventListener("click",a=>{a.stopPropagation(),this._copy(n,o)})}this.body.appendChild(e)}_copy(e,t){const n=()=>{t.style.transition="background 0.15s";const i=t.style.background;t.style.background="var(--vb-window-gadget, #8a93a3)",setTimeout(()=>{t.style.background=i},180)};navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(e).then(n).catch(()=>{this._execCopy(e),n()}):(this._execCopy(e),n())}_execCopy(e){try{const t=document.createElement("textarea");t.value=e,t.style.cssText="position:fixed;left:-9999px;top:0",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)}catch{console.warn("viewbase: copy to clipboard failed")}}update({title:e,rows:t}){e!=null&&this.setTitle(e),t!=null&&(this.rows=t,this.isMinimized||this._renderBody())}}function Hu({container:s,windowManager:e,store:t}){const n=()=>{var i;return((i=t.config)==null?void 0:i.detail_window)??{rows:null,width_chars:128,open_on_click:!0}};return e.registerType("detail",({nodeId:i})=>{const r=e.get(i);if(r)return r.isMinimized?r.restore():r.bringToFront(),r;const o=t.nodes.get(i);if(!o)return null;const a=n(),l=e.adopt(new Gu({nodeId:i,title:o.label,rows:ka(o,a.rows),widthChars:a.width_chars,container:s,manager:e}));return l.bringToFront(),l}),t.subscribe(i=>{if(i.kind!=="patch")return;const r=new Set;for(const[c,h]of e.windows)h.kind==="detail"&&r.add(c);if(r.size===0)return;const{refresh:o,close:a}=zu(i.patch,r);for(const c of a)e.close(c);const l=n();for(const c of o){const h=e.get(c),u=t.nodes.get(c);h&&u&&h.update({title:u.label,rows:ka(u,l.rows)})}}),{name:"detail",actions:{show_detail:i=>e.open("detail",{nodeId:i.node_id})}}}function Vu(s,e,t){const n=new Set;if(!s.nodes.has(e)||(n.add(e),t<=0))return n;const i=new Map,r=(a,l)=>{i.has(a)||i.set(a,[]),i.get(a).push(l)};for(const a of s.edges.values())r(a.source,a.target),r(a.target,a.source);let o=[e];for(let a=0;a<t&&o.length>0;a+=1){const l=[];for(const c of o)for(const h of i.get(c)??[])n.has(h)||(n.add(h),l.push(h));o=l}return n}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ta="165",xn={ROTATE:0,DOLLY:1,PAN:2},Dn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Wu=0,Ba=1,Xu=2,eh=1,Yu=2,_n=3,kn=0,Nt=1,an=2,Sn=0,Ui=1,vs=2,za=3,Ga=4,ju=5,Qn=100,qu=101,Ku=102,Zu=103,$u=104,Ju=200,Qu=201,ed=202,td=203,Do=204,Io=205,nd=206,id=207,rd=208,sd=209,od=210,ad=211,ld=212,cd=213,hd=214,ud=0,dd=1,fd=2,_s=3,pd=4,md=5,gd=6,vd=7,th=0,_d=1,xd=2,Nn=0,yd=1,bd=2,Sd=3,Md=4,Ed=5,wd=6,Td=7,nh=300,Fi=301,Ni=302,Fo=303,No=304,Cs=306,Oo=1e3,ni=1001,ko=1002,It=1003,Ad=1004,Dr=1005,zt=1006,Ys=1007,ii=1008,Bn=1009,Cd=1010,Rd=1011,xs=1012,ih=1013,Oi=1014,yn=1015,On=1016,rh=1017,sh=1018,ki=1020,Pd=35902,Ld=1021,Ud=1022,cn=1023,Dd=1024,Id=1025,Di=1026,Bi=1027,oh=1028,ah=1029,Fd=1030,lh=1031,ch=1033,js=33776,qs=33777,Ks=33778,Zs=33779,Ha=35840,Va=35841,Wa=35842,Xa=35843,Ya=36196,ja=37492,qa=37496,Ka=37808,Za=37809,$a=37810,Ja=37811,Qa=37812,el=37813,tl=37814,nl=37815,il=37816,rl=37817,sl=37818,ol=37819,al=37820,ll=37821,$s=36492,cl=36494,hl=36495,Nd=36283,ul=36284,dl=36285,fl=36286,Od=3200,hh=3201,uh=0,kd=1,Fn="",sn="srgb",Gn="srgb-linear",na="display-p3",Rs="display-p3-linear",ys="linear",ot="srgb",bs="rec709",Ss="p3",ui=7680,pl=519,Bd=512,zd=513,Gd=514,dh=515,Hd=516,Vd=517,Wd=518,Xd=519,ml=35044,gl="300 es",bn=2e3,Ms=2001;class oi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const Mt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let vl=1234567;const vr=Math.PI/180,br=180/Math.PI;function Hi(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Mt[s&255]+Mt[s>>8&255]+Mt[s>>16&255]+Mt[s>>24&255]+"-"+Mt[e&255]+Mt[e>>8&255]+"-"+Mt[e>>16&15|64]+Mt[e>>24&255]+"-"+Mt[t&63|128]+Mt[t>>8&255]+"-"+Mt[t>>16&255]+Mt[t>>24&255]+Mt[n&255]+Mt[n>>8&255]+Mt[n>>16&255]+Mt[n>>24&255]).toLowerCase()}function wt(s,e,t){return Math.max(e,Math.min(t,s))}function ia(s,e){return(s%e+e)%e}function Yd(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function jd(s,e,t){return s!==e?(t-s)/(e-s):0}function _r(s,e,t){return(1-t)*s+t*e}function qd(s,e,t,n){return _r(s,e,1-Math.exp(-t*n))}function Kd(s,e=1){return e-Math.abs(ia(s,e*2)-e)}function Zd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function $d(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Jd(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Qd(s,e){return s+Math.random()*(e-s)}function ef(s){return s*(.5-Math.random())}function tf(s){s!==void 0&&(vl=s);let e=vl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function nf(s){return s*vr}function rf(s){return s*br}function sf(s){return(s&s-1)===0&&s!==0}function of(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function af(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function lf(s,e,t,n,i){const r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(i){case"XYX":s.set(a*h,l*u,l*d,a*c);break;case"YZY":s.set(l*d,a*h,l*u,a*c);break;case"ZXZ":s.set(l*u,l*d,a*h,a*c);break;case"XZX":s.set(a*h,l*g,l*f,a*c);break;case"YXY":s.set(l*f,a*h,l*g,a*c);break;case"ZYZ":s.set(l*g,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Pi(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Rt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Bo={DEG2RAD:vr,RAD2DEG:br,generateUUID:Hi,clamp:wt,euclideanModulo:ia,mapLinear:Yd,inverseLerp:jd,lerp:_r,damp:qd,pingpong:Kd,smoothstep:Zd,smootherstep:$d,randInt:Jd,randFloat:Qd,randFloatSpread:ef,seededRandom:tf,degToRad:nf,radToDeg:rf,isPowerOfTwo:sf,ceilPowerOfTwo:of,floorPowerOfTwo:af,setQuaternionFromProperEuler:lf,normalize:Rt,denormalize:Pi};class Oe{constructor(e=0,t=0){Oe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ke{constructor(e,t,n,i,r,o,a,l,c){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c)}set(e,t,n,i,r,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=i[0],p=i[3],m=i[6],M=i[1],_=i[4],y=i[7],A=i[2],T=i[5],w=i[8];return r[0]=o*v+a*M+l*A,r[3]=o*p+a*_+l*T,r[6]=o*m+a*y+l*w,r[1]=c*v+h*M+u*A,r[4]=c*p+h*_+u*T,r[7]=c*m+h*y+u*w,r[2]=d*v+f*M+g*A,r[5]=d*p+f*_+g*T,r[8]=d*m+f*y+g*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=t*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(i*c-h*n)*v,e[2]=(a*n-i*o)*v,e[3]=d*v,e[4]=(h*t-i*l)*v,e[5]=(i*r-a*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(o*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Js.makeScale(e,t)),this}rotate(e){return this.premultiply(Js.makeRotation(-e)),this}translate(e,t){return this.premultiply(Js.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Js=new Ke;function fh(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Es(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function cf(){const s=Es("canvas");return s.style.display="block",s}const _l={};function ph(s){s in _l||(_l[s]=!0,console.warn(s))}function hf(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const xl=new Ke().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),yl=new Ke().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ir={[Gn]:{transfer:ys,primaries:bs,toReference:s=>s,fromReference:s=>s},[sn]:{transfer:ot,primaries:bs,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Rs]:{transfer:ys,primaries:Ss,toReference:s=>s.applyMatrix3(yl),fromReference:s=>s.applyMatrix3(xl)},[na]:{transfer:ot,primaries:Ss,toReference:s=>s.convertSRGBToLinear().applyMatrix3(yl),fromReference:s=>s.applyMatrix3(xl).convertLinearToSRGB()}},uf=new Set([Gn,Rs]),nt={enabled:!0,_workingColorSpace:Gn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!uf.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const n=Ir[e].toReference,i=Ir[t].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return Ir[s].primaries},getTransfer:function(s){return s===Fn?ys:Ir[s].transfer}};function Ii(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Qs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let di;class df{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{di===void 0&&(di=Es("canvas")),di.width=e.width,di.height=e.height;const n=di.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=di}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Es("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Ii(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ii(t[n]/255)*255):t[n]=Ii(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ff=0;class mh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ff++}),this.uuid=Hi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(eo(i[o].image)):r.push(eo(i[o]))}else r=eo(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function eo(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?df.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let pf=0;class At extends oi{constructor(e=At.DEFAULT_IMAGE,t=At.DEFAULT_MAPPING,n=ni,i=ni,r=zt,o=ii,a=cn,l=Bn,c=At.DEFAULT_ANISOTROPY,h=Fn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pf++}),this.uuid=Hi(),this.name="",this.source=new mh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==nh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Oo:e.x=e.x-Math.floor(e.x);break;case ni:e.x=e.x<0?0:1;break;case ko:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Oo:e.y=e.y-Math.floor(e.y);break;case ni:e.y=e.y<0?0:1;break;case ko:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}At.DEFAULT_IMAGE=null;At.DEFAULT_MAPPING=nh;At.DEFAULT_ANISOTROPY=1;class ut{constructor(e=0,t=0,n=0,i=1){ut.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],v=l[2],p=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(c+1)/2,y=(f+1)/2,A=(m+1)/2,T=(h+d)/4,w=(u+v)/4,L=(g+p)/4;return _>y&&_>A?_<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(_),i=T/n,r=w/n):y>A?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=T/i,r=L/i):A<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(A),n=w/r,i=L/r),this.set(n,i,r,t),this}let M=Math.sqrt((p-g)*(p-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(p-g)/M,this.y=(u-v)/M,this.z=(d-h)/M,this.w=Math.acos((c+f+m-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class mf extends oi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:zt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new At(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new mh(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class tn extends mf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class gh extends At{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=It,this.minFilter=It,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class gf extends At{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=It,this.minFilter=It,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class si{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const d=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(u!==v||l!==d||c!==f||h!==g){let p=1-a;const m=l*d+c*f+h*g+u*v,M=m>=0?1:-1,_=1-m*m;if(_>Number.EPSILON){const A=Math.sqrt(_),T=Math.atan2(A,m*M);p=Math.sin(p*T)/A,a=Math.sin(a*T)/A}const y=a*M;if(l=l*p+d*y,c=c*p+f*y,h=h*p+g*y,u=u*p+v*y,p===1-a){const A=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=A,c*=A,h*=A,u*=A}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-a*f,e[t+2]=c*g+h*f+a*d-l*u,e[t+3]=h*g-a*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),d=l(n/2),f=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(wt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(e=0,t=0,n=0){H.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(bl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(bl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-r*i),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return to.copy(this).projectOnVector(e),this.sub(to)}reflect(e){return this.sub(to.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const to=new H,bl=new si;class Mn{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Jt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Jt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Jt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Jt):Jt.fromBufferAttribute(r,o),Jt.applyMatrix4(e.matrixWorld),this.expandByPoint(Jt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Fr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Fr.copy(n.boundingBox)),Fr.applyMatrix4(e.matrixWorld),this.union(Fr)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Jt),Jt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(rr),Nr.subVectors(this.max,rr),fi.subVectors(e.a,rr),pi.subVectors(e.b,rr),mi.subVectors(e.c,rr),An.subVectors(pi,fi),Cn.subVectors(mi,pi),Wn.subVectors(fi,mi);let t=[0,-An.z,An.y,0,-Cn.z,Cn.y,0,-Wn.z,Wn.y,An.z,0,-An.x,Cn.z,0,-Cn.x,Wn.z,0,-Wn.x,-An.y,An.x,0,-Cn.y,Cn.x,0,-Wn.y,Wn.x,0];return!no(t,fi,pi,mi,Nr)||(t=[1,0,0,0,1,0,0,0,1],!no(t,fi,pi,mi,Nr))?!1:(Or.crossVectors(An,Cn),t=[Or.x,Or.y,Or.z],no(t,fi,pi,mi,Nr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Jt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Jt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(fn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),fn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),fn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),fn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),fn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),fn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),fn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),fn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(fn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const fn=[new H,new H,new H,new H,new H,new H,new H,new H],Jt=new H,Fr=new Mn,fi=new H,pi=new H,mi=new H,An=new H,Cn=new H,Wn=new H,rr=new H,Nr=new H,Or=new H,Xn=new H;function no(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Xn.fromArray(s,r);const a=i.x*Math.abs(Xn.x)+i.y*Math.abs(Xn.y)+i.z*Math.abs(Xn.z),l=e.dot(Xn),c=t.dot(Xn),h=n.dot(Xn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const vf=new Mn,sr=new H,io=new H;class ai{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):vf.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;sr.subVectors(e,this.center);const t=sr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(sr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(io.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(sr.copy(e.center).add(io)),this.expandByPoint(sr.copy(e.center).sub(io))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const pn=new H,ro=new H,kr=new H,Rn=new H,so=new H,Br=new H,oo=new H;class Ps{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,pn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=pn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(pn.copy(this.origin).addScaledVector(this.direction,t),pn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ro.copy(e).add(t).multiplyScalar(.5),kr.copy(t).sub(e).normalize(),Rn.copy(this.origin).sub(ro);const r=e.distanceTo(t)*.5,o=-this.direction.dot(kr),a=Rn.dot(this.direction),l=-Rn.dot(kr),c=Rn.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(ro).addScaledVector(kr,d),f}intersectSphere(e,t){pn.subVectors(e.center,this.origin);const n=pn.dot(this.direction),i=pn.dot(pn)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,pn)!==null}intersectTriangle(e,t,n,i,r){so.subVectors(t,e),Br.subVectors(n,e),oo.crossVectors(so,Br);let o=this.direction.dot(oo),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Rn.subVectors(this.origin,e);const l=a*this.direction.dot(Br.crossVectors(Rn,Br));if(l<0)return null;const c=a*this.direction.dot(so.cross(Rn));if(c<0||l+c>o)return null;const h=-a*Rn.dot(oo);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class it{constructor(e,t,n,i,r,o,a,l,c,h,u,d,f,g,v,p){it.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c,h,u,d,f,g,v,p)}set(e,t,n,i,r,o,a,l,c,h,u,d,f,g,v,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=g,m[11]=v,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new it().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/gi.setFromMatrixColumn(e,0).length(),r=1/gi.setFromMatrixColumn(e,1).length(),o=1/gi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=o*h,f=o*u,g=a*h,v=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-v*c,t[9]=-a*l,t[2]=v-d*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,g=c*h,v=c*u;t[0]=d+v*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=v+d*a,t[10]=o*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,g=c*h,v=c*u;t[0]=d-v*a,t[4]=-o*u,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=v-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const d=o*h,f=o*u,g=a*h,v=a*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const d=o*l,f=o*c,g=a*l,v=a*c;t[0]=l*h,t[4]=v-d*u,t[8]=g*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-v*u}else if(e.order==="XZY"){const d=o*l,f=o*c,g=a*l,v=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=o*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=a*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(_f,e,xf)}lookAt(e,t,n){const i=this.elements;return kt.subVectors(e,t),kt.lengthSq()===0&&(kt.z=1),kt.normalize(),Pn.crossVectors(n,kt),Pn.lengthSq()===0&&(Math.abs(n.z)===1?kt.x+=1e-4:kt.z+=1e-4,kt.normalize(),Pn.crossVectors(n,kt)),Pn.normalize(),zr.crossVectors(kt,Pn),i[0]=Pn.x,i[4]=zr.x,i[8]=kt.x,i[1]=Pn.y,i[5]=zr.y,i[9]=kt.y,i[2]=Pn.z,i[6]=zr.z,i[10]=kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],p=n[10],m=n[14],M=n[3],_=n[7],y=n[11],A=n[15],T=i[0],w=i[4],L=i[8],b=i[12],x=i[1],U=i[5],P=i[9],I=i[13],N=i[2],W=i[6],B=i[10],se=i[14],j=i[3],K=i[7],q=i[11],F=i[15];return r[0]=o*T+a*x+l*N+c*j,r[4]=o*w+a*U+l*W+c*K,r[8]=o*L+a*P+l*B+c*q,r[12]=o*b+a*I+l*se+c*F,r[1]=h*T+u*x+d*N+f*j,r[5]=h*w+u*U+d*W+f*K,r[9]=h*L+u*P+d*B+f*q,r[13]=h*b+u*I+d*se+f*F,r[2]=g*T+v*x+p*N+m*j,r[6]=g*w+v*U+p*W+m*K,r[10]=g*L+v*P+p*B+m*q,r[14]=g*b+v*I+p*se+m*F,r[3]=M*T+_*x+y*N+A*j,r[7]=M*w+_*U+y*W+A*K,r[11]=M*L+_*P+y*B+A*q,r[15]=M*b+_*I+y*se+A*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],v=e[7],p=e[11],m=e[15];return g*(+r*l*u-i*c*u-r*a*d+n*c*d+i*a*f-n*l*f)+v*(+t*l*f-t*c*d+r*o*d-i*o*f+i*c*h-r*l*h)+p*(+t*c*u-t*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+m*(-i*a*h-t*l*u+t*a*d+i*o*u-n*o*d+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],v=e[13],p=e[14],m=e[15],M=u*p*c-v*d*c+v*l*f-a*p*f-u*l*m+a*d*m,_=g*d*c-h*p*c-g*l*f+o*p*f+h*l*m-o*d*m,y=h*v*c-g*u*c+g*a*f-o*v*f-h*a*m+o*u*m,A=g*u*l-h*v*l-g*a*d+o*v*d+h*a*p-o*u*p,T=t*M+n*_+i*y+r*A;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/T;return e[0]=M*w,e[1]=(v*d*r-u*p*r-v*i*f+n*p*f+u*i*m-n*d*m)*w,e[2]=(a*p*r-v*l*r+v*i*c-n*p*c-a*i*m+n*l*m)*w,e[3]=(u*l*r-a*d*r-u*i*c+n*d*c+a*i*f-n*l*f)*w,e[4]=_*w,e[5]=(h*p*r-g*d*r+g*i*f-t*p*f-h*i*m+t*d*m)*w,e[6]=(g*l*r-o*p*r-g*i*c+t*p*c+o*i*m-t*l*m)*w,e[7]=(o*d*r-h*l*r+h*i*c-t*d*c-o*i*f+t*l*f)*w,e[8]=y*w,e[9]=(g*u*r-h*v*r-g*n*f+t*v*f+h*n*m-t*u*m)*w,e[10]=(o*v*r-g*a*r+g*n*c-t*v*c-o*n*m+t*a*m)*w,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*f-t*a*f)*w,e[12]=A*w,e[13]=(h*v*i-g*u*i+g*n*d-t*v*d-h*n*p+t*u*p)*w,e[14]=(g*a*i-o*v*i-g*n*l+t*v*l+o*n*p-t*a*p)*w,e[15]=(o*u*i-h*a*i+h*n*l-t*u*l-o*n*d+t*a*d)*w,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,v=o*h,p=o*u,m=a*u,M=l*c,_=l*h,y=l*u,A=n.x,T=n.y,w=n.z;return i[0]=(1-(v+m))*A,i[1]=(f+y)*A,i[2]=(g-_)*A,i[3]=0,i[4]=(f-y)*T,i[5]=(1-(d+m))*T,i[6]=(p+M)*T,i[7]=0,i[8]=(g+_)*w,i[9]=(p-M)*w,i[10]=(1-(d+v))*w,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=gi.set(i[0],i[1],i[2]).length();const o=gi.set(i[4],i[5],i[6]).length(),a=gi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Qt.copy(this);const c=1/r,h=1/o,u=1/a;return Qt.elements[0]*=c,Qt.elements[1]*=c,Qt.elements[2]*=c,Qt.elements[4]*=h,Qt.elements[5]*=h,Qt.elements[6]*=h,Qt.elements[8]*=u,Qt.elements[9]*=u,Qt.elements[10]*=u,t.setFromRotationMatrix(Qt),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=bn){const l=this.elements,c=2*r/(t-e),h=2*r/(n-i),u=(t+e)/(t-e),d=(n+i)/(n-i);let f,g;if(a===bn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Ms)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=bn){const l=this.elements,c=1/(t-e),h=1/(n-i),u=1/(o-r),d=(t+e)*c,f=(n+i)*h;let g,v;if(a===bn)g=(o+r)*u,v=-2*u;else if(a===Ms)g=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const gi=new H,Qt=new it,_f=new H(0,0,0),xf=new H(1,1,1),Pn=new H,zr=new H,kt=new H,Sl=new it,Ml=new si;class hn{constructor(e=0,t=0,n=0,i=hn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-wt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(wt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-wt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(wt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Sl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Sl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ml.setFromEuler(this),this.setFromQuaternion(Ml,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}hn.DEFAULT_ORDER="XYZ";class ra{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let yf=0;const El=new H,vi=new si,mn=new it,Gr=new H,or=new H,bf=new H,Sf=new si,wl=new H(1,0,0),Tl=new H(0,1,0),Al=new H(0,0,1),Cl={type:"added"},Mf={type:"removed"},_i={type:"childadded",child:null},ao={type:"childremoved",child:null};class yt extends oi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:yf++}),this.uuid=Hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=yt.DEFAULT_UP.clone();const e=new H,t=new hn,n=new si,i=new H(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new it},normalMatrix:{value:new Ke}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=yt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ra,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return vi.setFromAxisAngle(e,t),this.quaternion.multiply(vi),this}rotateOnWorldAxis(e,t){return vi.setFromAxisAngle(e,t),this.quaternion.premultiply(vi),this}rotateX(e){return this.rotateOnAxis(wl,e)}rotateY(e){return this.rotateOnAxis(Tl,e)}rotateZ(e){return this.rotateOnAxis(Al,e)}translateOnAxis(e,t){return El.copy(e).applyQuaternion(this.quaternion),this.position.add(El.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wl,e)}translateY(e){return this.translateOnAxis(Tl,e)}translateZ(e){return this.translateOnAxis(Al,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(mn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Gr.copy(e):Gr.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),or.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mn.lookAt(or,Gr,this.up):mn.lookAt(Gr,or,this.up),this.quaternion.setFromRotationMatrix(mn),i&&(mn.extractRotation(i.matrixWorld),vi.setFromRotationMatrix(mn),this.quaternion.premultiply(vi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Cl),_i.child=e,this.dispatchEvent(_i),_i.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Mf),ao.child=e,this.dispatchEvent(ao),ao.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),mn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),mn.multiply(e.parent.matrixWorld)),e.applyMatrix4(mn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Cl),_i.child=e,this.dispatchEvent(_i),_i.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,e,bf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,Sf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}yt.DEFAULT_UP=new H(0,1,0);yt.DEFAULT_MATRIX_AUTO_UPDATE=!0;yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const en=new H,gn=new H,lo=new H,vn=new H,xi=new H,yi=new H,Rl=new H,co=new H,ho=new H,uo=new H;class ln{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),en.subVectors(e,t),i.cross(en);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){en.subVectors(i,t),gn.subVectors(n,t),lo.subVectors(e,t);const o=en.dot(en),a=en.dot(gn),l=en.dot(lo),c=gn.dot(gn),h=gn.dot(lo),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,vn)===null?!1:vn.x>=0&&vn.y>=0&&vn.x+vn.y<=1}static getInterpolation(e,t,n,i,r,o,a,l){return this.getBarycoord(e,t,n,i,vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,vn.x),l.addScaledVector(o,vn.y),l.addScaledVector(a,vn.z),l)}static isFrontFacing(e,t,n,i){return en.subVectors(n,t),gn.subVectors(e,t),en.cross(gn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return en.subVectors(this.c,this.b),gn.subVectors(this.a,this.b),en.cross(gn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ln.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ln.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return ln.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return ln.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ln.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;xi.subVectors(i,n),yi.subVectors(r,n),co.subVectors(e,n);const l=xi.dot(co),c=yi.dot(co);if(l<=0&&c<=0)return t.copy(n);ho.subVectors(e,i);const h=xi.dot(ho),u=yi.dot(ho);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(xi,o);uo.subVectors(e,r);const f=xi.dot(uo),g=yi.dot(uo);if(g>=0&&f<=g)return t.copy(r);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(yi,a);const p=h*g-f*u;if(p<=0&&u-h>=0&&f-g>=0)return Rl.subVectors(r,i),a=(u-h)/(u-h+(f-g)),t.copy(i).addScaledVector(Rl,a);const m=1/(p+v+d);return o=v*m,a=d*m,t.copy(n).addScaledVector(xi,o).addScaledVector(yi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const vh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ln={h:0,s:0,l:0},Hr={h:0,s:0,l:0};function fo(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ve{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=sn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=nt.workingColorSpace){if(e=ia(e,1),t=wt(t,0,1),n=wt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=fo(o,r,e+1/3),this.g=fo(o,r,e),this.b=fo(o,r,e-1/3)}return nt.toWorkingColorSpace(this,i),this}setStyle(e,t=sn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=sn){const n=vh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ii(e.r),this.g=Ii(e.g),this.b=Ii(e.b),this}copyLinearToSRGB(e){return this.r=Qs(e.r),this.g=Qs(e.g),this.b=Qs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=sn){return nt.fromWorkingColorSpace(Et.copy(this),e),Math.round(wt(Et.r*255,0,255))*65536+Math.round(wt(Et.g*255,0,255))*256+Math.round(wt(Et.b*255,0,255))}getHexString(e=sn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.fromWorkingColorSpace(Et.copy(this),t);const n=Et.r,i=Et.g,r=Et.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=nt.workingColorSpace){return nt.fromWorkingColorSpace(Et.copy(this),t),e.r=Et.r,e.g=Et.g,e.b=Et.b,e}getStyle(e=sn){nt.fromWorkingColorSpace(Et.copy(this),e);const t=Et.r,n=Et.g,i=Et.b;return e!==sn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Ln),this.setHSL(Ln.h+e,Ln.s+t,Ln.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ln),e.getHSL(Hr);const n=_r(Ln.h,Hr.h,t),i=_r(Ln.s,Hr.s,t),r=_r(Ln.l,Hr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Et=new Ve;Ve.NAMES=vh;let Ef=0;class Vi extends oi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=Hi(),this.name="",this.type="Material",this.blending=Ui,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Do,this.blendDst=Io,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ve(0,0,0),this.blendAlpha=0,this.depthFunc=_s,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ui,this.stencilZFail=ui,this.stencilZPass=ui,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ui&&(n.blending=this.blending),this.side!==kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Do&&(n.blendSrc=this.blendSrc),this.blendDst!==Io&&(n.blendDst=this.blendDst),this.blendEquation!==Qn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==_s&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==pl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ui&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ui&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ui&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Mr extends Vi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=th,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ht=new H,Vr=new Oe;class Gt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ml,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=yn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return ph("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Vr.fromBufferAttribute(this,t),Vr.applyMatrix3(e),this.setXY(t,Vr.x,Vr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyMatrix3(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyMatrix4(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyNormalMatrix(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.transformDirection(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Pi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Rt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Pi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Rt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Pi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Rt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Pi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Rt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Pi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Rt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Rt(t,this.array),n=Rt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Rt(t,this.array),n=Rt(n,this.array),i=Rt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Rt(t,this.array),n=Rt(n,this.array),i=Rt(i,this.array),r=Rt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ml&&(e.usage=this.usage),e}}class _h extends Gt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class xh extends Gt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class lt extends Gt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let wf=0;const Yt=new it,po=new yt,bi=new H,Bt=new Mn,ar=new Mn,gt=new H;class Lt extends oi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wf++}),this.uuid=Hi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(fh(e)?xh:_h)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Yt.makeRotationFromQuaternion(e),this.applyMatrix4(Yt),this}rotateX(e){return Yt.makeRotationX(e),this.applyMatrix4(Yt),this}rotateY(e){return Yt.makeRotationY(e),this.applyMatrix4(Yt),this}rotateZ(e){return Yt.makeRotationZ(e),this.applyMatrix4(Yt),this}translate(e,t,n){return Yt.makeTranslation(e,t,n),this.applyMatrix4(Yt),this}scale(e,t,n){return Yt.makeScale(e,t,n),this.applyMatrix4(Yt),this}lookAt(e){return po.lookAt(e),po.updateMatrix(),this.applyMatrix4(po.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bi).negate(),this.translate(bi.x,bi.y,bi.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new lt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Bt.setFromBufferAttribute(r),this.morphTargetsRelative?(gt.addVectors(this.boundingBox.min,Bt.min),this.boundingBox.expandByPoint(gt),gt.addVectors(this.boundingBox.max,Bt.max),this.boundingBox.expandByPoint(gt)):(this.boundingBox.expandByPoint(Bt.min),this.boundingBox.expandByPoint(Bt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ai);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const n=this.boundingSphere.center;if(Bt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];ar.setFromBufferAttribute(a),this.morphTargetsRelative?(gt.addVectors(Bt.min,ar.min),Bt.expandByPoint(gt),gt.addVectors(Bt.max,ar.max),Bt.expandByPoint(gt)):(Bt.expandByPoint(ar.min),Bt.expandByPoint(ar.max))}Bt.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)gt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(gt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)gt.fromBufferAttribute(a,c),l&&(bi.fromBufferAttribute(e,c),gt.add(bi)),i=Math.max(i,n.distanceToSquared(gt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Gt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<n.count;L++)a[L]=new H,l[L]=new H;const c=new H,h=new H,u=new H,d=new Oe,f=new Oe,g=new Oe,v=new H,p=new H;function m(L,b,x){c.fromBufferAttribute(n,L),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,x),d.fromBufferAttribute(r,L),f.fromBufferAttribute(r,b),g.fromBufferAttribute(r,x),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const U=1/(f.x*g.y-g.x*f.y);isFinite(U)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(U),p.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(U),a[L].add(v),a[b].add(v),a[x].add(v),l[L].add(p),l[b].add(p),l[x].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let L=0,b=M.length;L<b;++L){const x=M[L],U=x.start,P=x.count;for(let I=U,N=U+P;I<N;I+=3)m(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const _=new H,y=new H,A=new H,T=new H;function w(L){A.fromBufferAttribute(i,L),T.copy(A);const b=a[L];_.copy(b),_.sub(A.multiplyScalar(A.dot(b))).normalize(),y.crossVectors(T,b);const U=y.dot(l[L])<0?-1:1;o.setXYZW(L,_.x,_.y,_.z,U)}for(let L=0,b=M.length;L<b;++L){const x=M[L],U=x.start,P=x.count;for(let I=U,N=U+P;I<N;I+=3)w(e.getX(I+0)),w(e.getX(I+1)),w(e.getX(I+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Gt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new H,r=new H,o=new H,a=new H,l=new H,c=new H,h=new H,u=new H;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),v=e.getX(d+1),p=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,p),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)gt.fromBufferAttribute(e,t),gt.normalize(),e.setXYZ(t,gt.x,gt.y,gt.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let v=0,p=l.length;v<p;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let m=0;m<h;m++)d[g++]=c[f++]}return new Gt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Lt,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Pl=new it,Yn=new Ps,Wr=new ai,Ll=new H,Si=new H,Mi=new H,Ei=new H,mo=new H,Xr=new H,Yr=new Oe,jr=new Oe,qr=new Oe,Ul=new H,Dl=new H,Il=new H,Kr=new H,Zr=new H;class Tt extends yt{constructor(e=new Lt,t=new Mr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){Xr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(mo.fromBufferAttribute(u,e),o?Xr.addScaledVector(mo,h):Xr.addScaledVector(mo.sub(t),h))}t.add(Xr)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Wr.copy(n.boundingSphere),Wr.applyMatrix4(r),Yn.copy(e.ray).recast(e.near),!(Wr.containsPoint(Yn.origin)===!1&&(Yn.intersectSphere(Wr,Ll)===null||Yn.origin.distanceToSquared(Ll)>(e.far-e.near)**2))&&(Pl.copy(r).invert(),Yn.copy(e.ray).applyMatrix4(Pl),!(n.boundingBox!==null&&Yn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Yn)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const p=d[g],m=o[p.materialIndex],M=Math.max(p.start,f.start),_=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let y=M,A=_;y<A;y+=3){const T=a.getX(y),w=a.getX(y+1),L=a.getX(y+2);i=$r(this,m,e,n,c,h,u,T,w,L),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){const M=a.getX(p),_=a.getX(p+1),y=a.getX(p+2);i=$r(this,o,e,n,c,h,u,M,_,y),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const p=d[g],m=o[p.materialIndex],M=Math.max(p.start,f.start),_=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let y=M,A=_;y<A;y+=3){const T=y,w=y+1,L=y+2;i=$r(this,m,e,n,c,h,u,T,w,L),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){const M=p,_=p+1,y=p+2;i=$r(this,o,e,n,c,h,u,M,_,y),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function Tf(s,e,t,n,i,r,o,a){let l;if(e.side===Nt?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,e.side===kn,a),l===null)return null;Zr.copy(a),Zr.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Zr);return c<t.near||c>t.far?null:{distance:c,point:Zr.clone(),object:s}}function $r(s,e,t,n,i,r,o,a,l,c){s.getVertexPosition(a,Si),s.getVertexPosition(l,Mi),s.getVertexPosition(c,Ei);const h=Tf(s,e,t,n,Si,Mi,Ei,Kr);if(h){i&&(Yr.fromBufferAttribute(i,a),jr.fromBufferAttribute(i,l),qr.fromBufferAttribute(i,c),h.uv=ln.getInterpolation(Kr,Si,Mi,Ei,Yr,jr,qr,new Oe)),r&&(Yr.fromBufferAttribute(r,a),jr.fromBufferAttribute(r,l),qr.fromBufferAttribute(r,c),h.uv1=ln.getInterpolation(Kr,Si,Mi,Ei,Yr,jr,qr,new Oe)),o&&(Ul.fromBufferAttribute(o,a),Dl.fromBufferAttribute(o,l),Il.fromBufferAttribute(o,c),h.normal=ln.getInterpolation(Kr,Si,Mi,Ei,Ul,Dl,Il,new H),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new H,materialIndex:0};ln.getNormal(Si,Mi,Ei,u.normal),h.face=u}return h}class Wi extends Lt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new lt(c,3)),this.setAttribute("normal",new lt(h,3)),this.setAttribute("uv",new lt(u,2));function g(v,p,m,M,_,y,A,T,w,L,b){const x=y/w,U=A/L,P=y/2,I=A/2,N=T/2,W=w+1,B=L+1;let se=0,j=0;const K=new H;for(let q=0;q<B;q++){const F=q*U-I;for(let V=0;V<W;V++){const ne=V*x-P;K[v]=ne*M,K[p]=F*_,K[m]=N,c.push(K.x,K.y,K.z),K[v]=0,K[p]=0,K[m]=T>0?1:-1,h.push(K.x,K.y,K.z),u.push(V/w),u.push(1-q/L),se+=1}}for(let q=0;q<L;q++)for(let F=0;F<w;F++){const V=d+F+W*q,ne=d+F+W*(q+1),O=d+(F+1)+W*(q+1),k=d+(F+1)+W*q;l.push(V,ne,k),l.push(ne,O,k),j+=6}a.addGroup(f,j,b),f+=j,d+=se}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function zi(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Pt(s){const e={};for(let t=0;t<s.length;t++){const n=zi(s[t]);for(const i in n)e[i]=n[i]}return e}function Af(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function yh(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}const Sr={clone:zi,merge:Pt};var Cf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Rf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ft extends Vi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Cf,this.fragmentShader=Rf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zi(e.uniforms),this.uniformsGroups=Af(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class bh extends yt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=bn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Un=new H,Fl=new Oe,Nl=new Oe;class qt extends bh{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=br*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(vr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return br*2*Math.atan(Math.tan(vr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Un.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Un.x,Un.y).multiplyScalar(-e/Un.z),Un.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Un.x,Un.y).multiplyScalar(-e/Un.z)}getViewSize(e,t){return this.getViewBounds(e,Fl,Nl),t.subVectors(Nl,Fl)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(vr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const wi=-90,Ti=1;class Pf extends yt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new qt(wi,Ti,e,t);i.layers=this.layers,this.add(i);const r=new qt(wi,Ti,e,t);r.layers=this.layers,this.add(r);const o=new qt(wi,Ti,e,t);o.layers=this.layers,this.add(o);const a=new qt(wi,Ti,e,t);a.layers=this.layers,this.add(a);const l=new qt(wi,Ti,e,t);l.layers=this.layers,this.add(l);const c=new qt(wi,Ti,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===bn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ms)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Sh extends At{constructor(e,t,n,i,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Fi,super(e,t,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Lf extends tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Sh(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:zt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Wi(5,5,5),r=new Ft({name:"CubemapFromEquirect",uniforms:zi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Nt,blending:Sn});r.uniforms.tEquirect.value=t;const o=new Tt(i,r),a=t.minFilter;return t.minFilter===ii&&(t.minFilter=zt),new Pf(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}const go=new H,Uf=new H,Df=new Ke;class In{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=go.subVectors(n,t).cross(Uf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(go),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Df.getNormalMatrix(e),i=this.coplanarPoint(go).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const jn=new ai,Jr=new H;class sa{constructor(e=new In,t=new In,n=new In,i=new In,r=new In,o=new In){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=bn){const n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],u=i[6],d=i[7],f=i[8],g=i[9],v=i[10],p=i[11],m=i[12],M=i[13],_=i[14],y=i[15];if(n[0].setComponents(l-r,d-c,p-f,y-m).normalize(),n[1].setComponents(l+r,d+c,p+f,y+m).normalize(),n[2].setComponents(l+o,d+h,p+g,y+M).normalize(),n[3].setComponents(l-o,d-h,p-g,y-M).normalize(),n[4].setComponents(l-a,d-u,p-v,y-_).normalize(),t===bn)n[5].setComponents(l+a,d+u,p+v,y+_).normalize();else if(t===Ms)n[5].setComponents(a,u,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),jn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),jn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(jn)}intersectsSprite(e){return jn.center.set(0,0,0),jn.radius=.7071067811865476,jn.applyMatrix4(e.matrixWorld),this.intersectsSphere(jn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Jr.x=i.normal.x>0?e.max.x:e.min.x,Jr.y=i.normal.y>0?e.max.y:e.min.y,Jr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Jr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Mh(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function If(s){const e=new WeakMap;function t(a,l){const c=a.array,h=a.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l._updateRange,d=l.updateRanges;if(s.bindBuffer(c,a),u.count===-1&&d.length===0&&s.bufferSubData(c,0,h),d.length!==0){for(let f=0,g=d.length;f<g;f++){const v=d[f];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}u.count!==-1&&(s.bufferSubData(c,u.offset*h.BYTES_PER_ELEMENT,h,u.offset,u.count),u.count=-1),l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(s.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}class li extends Lt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=e/a,d=t/l,f=[],g=[],v=[],p=[];for(let m=0;m<h;m++){const M=m*d-o;for(let _=0;_<c;_++){const y=_*u-r;g.push(y,-M,0),v.push(0,0,1),p.push(_/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let M=0;M<a;M++){const _=M+c*m,y=M+c*(m+1),A=M+1+c*(m+1),T=M+1+c*m;f.push(_,y,T),f.push(y,A,T)}this.setIndex(f),this.setAttribute("position",new lt(g,3)),this.setAttribute("normal",new lt(v,3)),this.setAttribute("uv",new lt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new li(e.width,e.height,e.widthSegments,e.heightSegments)}}var Ff=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Nf=`#ifdef USE_ALPHAHASH
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
#endif`,Of=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,kf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Bf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,zf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Gf=`#ifdef USE_AOMAP
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
#endif`,Hf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vf=`#ifdef USE_BATCHING
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
#endif`,Wf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Xf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Yf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,jf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,qf=`#ifdef USE_IRIDESCENCE
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
#endif`,Kf=`#ifdef USE_BUMPMAP
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
#endif`,Zf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$f=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Jf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Qf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ep=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,tp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,np=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ip=`#if defined( USE_COLOR_ALPHA )
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
#endif`,rp=`#define PI 3.141592653589793
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
} // validated`,sp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,op=`vec3 transformedNormal = objectNormal;
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
#endif`,ap=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,lp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,cp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,up="gl_FragColor = linearToOutputTexel( gl_FragColor );",dp=`
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
}`,fp=`#ifdef USE_ENVMAP
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
#endif`,pp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,mp=`#ifdef USE_ENVMAP
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
#endif`,gp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,vp=`#ifdef USE_ENVMAP
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
#endif`,_p=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,xp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,yp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sp=`#ifdef USE_GRADIENTMAP
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
}`,Mp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ep=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Tp=`uniform bool receiveShadow;
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
#endif`,Ap=`#ifdef USE_ENVMAP
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
#endif`,Cp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Rp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Pp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Lp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Up=`PhysicalMaterial material;
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
#endif`,Dp=`struct PhysicalMaterial {
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
}`,Ip=`
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
#endif`,Fp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Np=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Op=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,kp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Gp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Hp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Wp=`#if defined( USE_POINTS_UV )
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
#endif`,Xp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Yp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,qp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Kp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zp=`#ifdef USE_MORPHTARGETS
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
#endif`,$p=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Qp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,em=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,nm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,im=`#ifdef USE_NORMALMAP
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
#endif`,rm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,sm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,om=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,am=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,lm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,cm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,hm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,um=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,fm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,pm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,mm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,gm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,vm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,_m=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,xm=`float getShadowMask() {
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
}`,ym=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,bm=`#ifdef USE_SKINNING
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
#endif`,Sm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Mm=`#ifdef USE_SKINNING
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
#endif`,Em=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Tm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Am=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Cm=`#ifdef USE_TRANSMISSION
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
#endif`,Rm=`#ifdef USE_TRANSMISSION
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
#endif`,Pm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Um=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Dm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Im=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Fm=`uniform sampler2D t2D;
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
}`,Nm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Om=`#ifdef ENVMAP_TYPE_CUBE
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
}`,km=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zm=`#include <common>
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
}`,Gm=`#if DEPTH_PACKING == 3200
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
}`,Hm=`#define DISTANCE
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
}`,Vm=`#define DISTANCE
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
}`,Wm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Xm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ym=`uniform float scale;
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
}`,jm=`uniform vec3 diffuse;
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
}`,qm=`#include <common>
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
}`,Km=`uniform vec3 diffuse;
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
}`,Zm=`#define LAMBERT
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
}`,$m=`#define LAMBERT
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
}`,Jm=`#define MATCAP
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
}`,Qm=`#define MATCAP
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
}`,eg=`#define NORMAL
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
}`,tg=`#define NORMAL
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
}`,ng=`#define PHONG
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
}`,ig=`#define PHONG
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
}`,rg=`#define STANDARD
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
}`,sg=`#define STANDARD
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
}`,og=`#define TOON
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
}`,ag=`#define TOON
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
}`,lg=`uniform float size;
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
}`,cg=`uniform vec3 diffuse;
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
}`,hg=`#include <common>
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
}`,ug=`uniform vec3 color;
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
}`,dg=`uniform float rotation;
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
}`,fg=`uniform vec3 diffuse;
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
}`,qe={alphahash_fragment:Ff,alphahash_pars_fragment:Nf,alphamap_fragment:Of,alphamap_pars_fragment:kf,alphatest_fragment:Bf,alphatest_pars_fragment:zf,aomap_fragment:Gf,aomap_pars_fragment:Hf,batching_pars_vertex:Vf,batching_vertex:Wf,begin_vertex:Xf,beginnormal_vertex:Yf,bsdfs:jf,iridescence_fragment:qf,bumpmap_pars_fragment:Kf,clipping_planes_fragment:Zf,clipping_planes_pars_fragment:$f,clipping_planes_pars_vertex:Jf,clipping_planes_vertex:Qf,color_fragment:ep,color_pars_fragment:tp,color_pars_vertex:np,color_vertex:ip,common:rp,cube_uv_reflection_fragment:sp,defaultnormal_vertex:op,displacementmap_pars_vertex:ap,displacementmap_vertex:lp,emissivemap_fragment:cp,emissivemap_pars_fragment:hp,colorspace_fragment:up,colorspace_pars_fragment:dp,envmap_fragment:fp,envmap_common_pars_fragment:pp,envmap_pars_fragment:mp,envmap_pars_vertex:gp,envmap_physical_pars_fragment:Ap,envmap_vertex:vp,fog_vertex:_p,fog_pars_vertex:xp,fog_fragment:yp,fog_pars_fragment:bp,gradientmap_pars_fragment:Sp,lightmap_pars_fragment:Mp,lights_lambert_fragment:Ep,lights_lambert_pars_fragment:wp,lights_pars_begin:Tp,lights_toon_fragment:Cp,lights_toon_pars_fragment:Rp,lights_phong_fragment:Pp,lights_phong_pars_fragment:Lp,lights_physical_fragment:Up,lights_physical_pars_fragment:Dp,lights_fragment_begin:Ip,lights_fragment_maps:Fp,lights_fragment_end:Np,logdepthbuf_fragment:Op,logdepthbuf_pars_fragment:kp,logdepthbuf_pars_vertex:Bp,logdepthbuf_vertex:zp,map_fragment:Gp,map_pars_fragment:Hp,map_particle_fragment:Vp,map_particle_pars_fragment:Wp,metalnessmap_fragment:Xp,metalnessmap_pars_fragment:Yp,morphinstance_vertex:jp,morphcolor_vertex:qp,morphnormal_vertex:Kp,morphtarget_pars_vertex:Zp,morphtarget_vertex:$p,normal_fragment_begin:Jp,normal_fragment_maps:Qp,normal_pars_fragment:em,normal_pars_vertex:tm,normal_vertex:nm,normalmap_pars_fragment:im,clearcoat_normal_fragment_begin:rm,clearcoat_normal_fragment_maps:sm,clearcoat_pars_fragment:om,iridescence_pars_fragment:am,opaque_fragment:lm,packing:cm,premultiplied_alpha_fragment:hm,project_vertex:um,dithering_fragment:dm,dithering_pars_fragment:fm,roughnessmap_fragment:pm,roughnessmap_pars_fragment:mm,shadowmap_pars_fragment:gm,shadowmap_pars_vertex:vm,shadowmap_vertex:_m,shadowmask_pars_fragment:xm,skinbase_vertex:ym,skinning_pars_vertex:bm,skinning_vertex:Sm,skinnormal_vertex:Mm,specularmap_fragment:Em,specularmap_pars_fragment:wm,tonemapping_fragment:Tm,tonemapping_pars_fragment:Am,transmission_fragment:Cm,transmission_pars_fragment:Rm,uv_pars_fragment:Pm,uv_pars_vertex:Lm,uv_vertex:Um,worldpos_vertex:Dm,background_vert:Im,background_frag:Fm,backgroundCube_vert:Nm,backgroundCube_frag:Om,cube_vert:km,cube_frag:Bm,depth_vert:zm,depth_frag:Gm,distanceRGBA_vert:Hm,distanceRGBA_frag:Vm,equirect_vert:Wm,equirect_frag:Xm,linedashed_vert:Ym,linedashed_frag:jm,meshbasic_vert:qm,meshbasic_frag:Km,meshlambert_vert:Zm,meshlambert_frag:$m,meshmatcap_vert:Jm,meshmatcap_frag:Qm,meshnormal_vert:eg,meshnormal_frag:tg,meshphong_vert:ng,meshphong_frag:ig,meshphysical_vert:rg,meshphysical_frag:sg,meshtoon_vert:og,meshtoon_frag:ag,points_vert:lg,points_frag:cg,shadow_vert:hg,shadow_frag:ug,sprite_vert:dg,sprite_frag:fg},Ue={common:{diffuse:{value:new Ve(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new Ve(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},on={basic:{uniforms:Pt([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:Pt([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new Ve(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:Pt([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new Ve(0)},specular:{value:new Ve(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:Pt([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new Ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:Pt([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new Ve(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:Pt([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:Pt([Ue.points,Ue.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:Pt([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:Pt([Ue.common,Ue.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:Pt([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:Pt([Ue.sprite,Ue.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:Pt([Ue.common,Ue.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:Pt([Ue.lights,Ue.fog,{color:{value:new Ve(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};on.physical={uniforms:Pt([on.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new Ve(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new Ve(0)},specularColor:{value:new Ve(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const Qr={r:0,b:0,g:0},qn=new hn,pg=new it;function mg(s,e,t,n,i,r,o){const a=new Ve(0);let l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?t:e).get(_)),_}function v(M){let _=!1;const y=g(M);y===null?m(a,l):y&&y.isColor&&(m(y,1),_=!0);const A=s.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function p(M,_){const y=g(_);y&&(y.isCubeTexture||y.mapping===Cs)?(h===void 0&&(h=new Tt(new Wi(1,1,1),new Ft({name:"BackgroundCubeMaterial",uniforms:zi(on.backgroundCube.uniforms),vertexShader:on.backgroundCube.vertexShader,fragmentShader:on.backgroundCube.fragmentShader,side:Nt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,T,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),qn.copy(_.backgroundRotation),qn.x*=-1,qn.y*=-1,qn.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(qn.y*=-1,qn.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(pg.makeRotationFromEuler(qn)),h.material.toneMapped=nt.getTransfer(y.colorSpace)!==ot,(u!==y||d!==y.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,f=s.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Tt(new li(2,2),new Ft({name:"BackgroundMaterial",uniforms:zi(on.background.uniforms),vertexShader:on.background.vertexShader,fragmentShader:on.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=nt.getTransfer(y.colorSpace)!==ot,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,f=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function m(M,_){M.getRGB(Qr,yh(s)),n.buffers.color.setClear(Qr.r,Qr.g,Qr.b,_,o)}return{getClearColor:function(){return a},setClearColor:function(M,_=1){a.set(M),l=_,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,m(a,l)},render:v,addToRenderList:p}}function gg(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,o=!1;function a(x,U,P,I,N){let W=!1;const B=u(I,P,U);r!==B&&(r=B,c(r.object)),W=f(x,I,P,N),W&&g(x,I,P,N),N!==null&&e.update(N,s.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,y(x,U,P,I),N!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return s.createVertexArray()}function c(x){return s.bindVertexArray(x)}function h(x){return s.deleteVertexArray(x)}function u(x,U,P){const I=P.wireframe===!0;let N=n[x.id];N===void 0&&(N={},n[x.id]=N);let W=N[U.id];W===void 0&&(W={},N[U.id]=W);let B=W[I];return B===void 0&&(B=d(l()),W[I]=B),B}function d(x){const U=[],P=[],I=[];for(let N=0;N<t;N++)U[N]=0,P[N]=0,I[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:P,attributeDivisors:I,object:x,attributes:{},index:null}}function f(x,U,P,I){const N=r.attributes,W=U.attributes;let B=0;const se=P.getAttributes();for(const j in se)if(se[j].location>=0){const q=N[j];let F=W[j];if(F===void 0&&(j==="instanceMatrix"&&x.instanceMatrix&&(F=x.instanceMatrix),j==="instanceColor"&&x.instanceColor&&(F=x.instanceColor)),q===void 0||q.attribute!==F||F&&q.data!==F.data)return!0;B++}return r.attributesNum!==B||r.index!==I}function g(x,U,P,I){const N={},W=U.attributes;let B=0;const se=P.getAttributes();for(const j in se)if(se[j].location>=0){let q=W[j];q===void 0&&(j==="instanceMatrix"&&x.instanceMatrix&&(q=x.instanceMatrix),j==="instanceColor"&&x.instanceColor&&(q=x.instanceColor));const F={};F.attribute=q,q&&q.data&&(F.data=q.data),N[j]=F,B++}r.attributes=N,r.attributesNum=B,r.index=I}function v(){const x=r.newAttributes;for(let U=0,P=x.length;U<P;U++)x[U]=0}function p(x){m(x,0)}function m(x,U){const P=r.newAttributes,I=r.enabledAttributes,N=r.attributeDivisors;P[x]=1,I[x]===0&&(s.enableVertexAttribArray(x),I[x]=1),N[x]!==U&&(s.vertexAttribDivisor(x,U),N[x]=U)}function M(){const x=r.newAttributes,U=r.enabledAttributes;for(let P=0,I=U.length;P<I;P++)U[P]!==x[P]&&(s.disableVertexAttribArray(P),U[P]=0)}function _(x,U,P,I,N,W,B){B===!0?s.vertexAttribIPointer(x,U,P,N,W):s.vertexAttribPointer(x,U,P,I,N,W)}function y(x,U,P,I){v();const N=I.attributes,W=P.getAttributes(),B=U.defaultAttributeValues;for(const se in W){const j=W[se];if(j.location>=0){let K=N[se];if(K===void 0&&(se==="instanceMatrix"&&x.instanceMatrix&&(K=x.instanceMatrix),se==="instanceColor"&&x.instanceColor&&(K=x.instanceColor)),K!==void 0){const q=K.normalized,F=K.itemSize,V=e.get(K);if(V===void 0)continue;const ne=V.buffer,O=V.type,k=V.bytesPerElement,te=O===s.INT||O===s.UNSIGNED_INT||K.gpuType===ih;if(K.isInterleavedBufferAttribute){const G=K.data,ae=G.stride,pe=K.offset;if(G.isInstancedInterleavedBuffer){for(let _e=0;_e<j.locationSize;_e++)m(j.location+_e,G.meshPerAttribute);x.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let _e=0;_e<j.locationSize;_e++)p(j.location+_e);s.bindBuffer(s.ARRAY_BUFFER,ne);for(let _e=0;_e<j.locationSize;_e++)_(j.location+_e,F/j.locationSize,O,q,ae*k,(pe+F/j.locationSize*_e)*k,te)}else{if(K.isInstancedBufferAttribute){for(let G=0;G<j.locationSize;G++)m(j.location+G,K.meshPerAttribute);x.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let G=0;G<j.locationSize;G++)p(j.location+G);s.bindBuffer(s.ARRAY_BUFFER,ne);for(let G=0;G<j.locationSize;G++)_(j.location+G,F/j.locationSize,O,q,F*k,F/j.locationSize*G*k,te)}}else if(B!==void 0){const q=B[se];if(q!==void 0)switch(q.length){case 2:s.vertexAttrib2fv(j.location,q);break;case 3:s.vertexAttrib3fv(j.location,q);break;case 4:s.vertexAttrib4fv(j.location,q);break;default:s.vertexAttrib1fv(j.location,q)}}}}M()}function A(){L();for(const x in n){const U=n[x];for(const P in U){const I=U[P];for(const N in I)h(I[N].object),delete I[N];delete U[P]}delete n[x]}}function T(x){if(n[x.id]===void 0)return;const U=n[x.id];for(const P in U){const I=U[P];for(const N in I)h(I[N].object),delete I[N];delete U[P]}delete n[x.id]}function w(x){for(const U in n){const P=n[U];if(P[x.id]===void 0)continue;const I=P[x.id];for(const N in I)h(I[N].object),delete I[N];delete P[x.id]}}function L(){b(),o=!0,r!==i&&(r=i,c(r.object))}function b(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:L,resetDefaultState:b,dispose:A,releaseStatesOfGeometry:T,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:p,disableUnusedAttributes:M}}function vg(s,e,t){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let f=0;f<u;f++)this.render(c[f],h[f]);else{d.multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];t.update(f,n,1)}}function l(c,h,u,d){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v];for(let v=0;v<d.length;v++)t.update(g,n,d[v])}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function _g(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(T){return!(T!==cn&&n.convert(T)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){const w=T===On&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==Bn&&n.convert(T)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==yn&&!w)}function l(T){if(T==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),v=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),M=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),y=f>0,A=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,maxTextures:d,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:v,maxAttributes:p,maxVertexUniforms:m,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:y,maxSamples:A}}function xg(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new In,a=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,p=u.clipShadows,m=s.get(u);if(!i||g===null||g.length===0||r&&!p)r?h(null):c();else{const M=r?0:n,_=M*4;let y=m.clippingState||null;l.value=y,y=h(g,d,_,f);for(let A=0;A!==_;++A)y[A]=t[A];m.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let p=null;if(v!==0){if(p=l.value,g!==!0||p===null){const m=f+v*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(p===null||p.length<m)&&(p=new Float32Array(m));for(let _=0,y=f;_!==v;++_,y+=4)o.copy(u[_]).applyMatrix4(M,a),o.normal.toArray(p,y),p[y+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function yg(s){let e=new WeakMap;function t(o,a){return a===Fo?o.mapping=Fi:a===No&&(o.mapping=Ni),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Fo||a===No)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Lf(l.height);return c.fromEquirectangularTexture(s,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Xi extends bh{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Li=4,Ol=[.125,.215,.35,.446,.526,.582],ei=20,vo=new Xi,kl=new Ve;let _o=null,xo=0,yo=0,bo=!1;const Jn=(1+Math.sqrt(5))/2,Ai=1/Jn,Bl=[new H(-Jn,Ai,0),new H(Jn,Ai,0),new H(-Ai,0,Jn),new H(Ai,0,Jn),new H(0,Jn,-Ai),new H(0,Jn,Ai),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)];class zl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){_o=this._renderer.getRenderTarget(),xo=this._renderer.getActiveCubeFace(),yo=this._renderer.getActiveMipmapLevel(),bo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(_o,xo,yo),this._renderer.xr.enabled=bo,e.scissorTest=!1,es(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Fi||e.mapping===Ni?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_o=this._renderer.getRenderTarget(),xo=this._renderer.getActiveCubeFace(),yo=this._renderer.getActiveMipmapLevel(),bo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:zt,minFilter:zt,generateMipmaps:!1,type:On,format:cn,colorSpace:Gn,depthBuffer:!1},i=Gl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=bg(r)),this._blurMaterial=Sg(r,e,t)}return i}_compileMaterial(e){const t=new Tt(this._lodPlanes[0],e);this._renderer.compile(t,vo)}_sceneToCubeUV(e,t,n,i){const a=new qt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(kl),h.toneMapping=Nn,h.autoClear=!1;const f=new Mr({name:"PMREM.Background",side:Nt,depthWrite:!1,depthTest:!1}),g=new Tt(new Wi,f);let v=!1;const p=e.background;p?p.isColor&&(f.color.copy(p),e.background=null,v=!0):(f.color.copy(kl),v=!0);for(let m=0;m<6;m++){const M=m%3;M===0?(a.up.set(0,l[m],0),a.lookAt(c[m],0,0)):M===1?(a.up.set(0,0,l[m]),a.lookAt(0,c[m],0)):(a.up.set(0,l[m],0),a.lookAt(0,0,c[m]));const _=this._cubeSize;es(i,M*_,m>2?_:0,_,_),h.setRenderTarget(i),v&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Fi||e.mapping===Ni;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hl());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new Tt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;es(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,vo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Bl[(i-r-1)%Bl.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Tt(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ei-1),v=r/g,p=isFinite(r)?1+Math.floor(h*v):ei;p>ei&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ei}`);const m=[];let M=0;for(let w=0;w<ei;++w){const L=w/v,b=Math.exp(-L*L/2);m.push(b),w===0?M+=b:w<p&&(M+=2*b)}for(let w=0;w<m.length;w++)m[w]=m[w]/M;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=m,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:_}=this;d.dTheta.value=g,d.mipInt.value=_-n;const y=this._sizeLods[i],A=3*y*(i>_-Li?i-_+Li:0),T=4*(this._cubeSize-y);es(t,A,T,3*y,2*y),l.setRenderTarget(t),l.render(u,vo)}}function bg(s){const e=[],t=[],n=[];let i=s;const r=s-Li+1+Ol.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>s-Li?l=Ol[o-s+Li-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,p=2,m=1,M=new Float32Array(v*g*f),_=new Float32Array(p*g*f),y=new Float32Array(m*g*f);for(let T=0;T<f;T++){const w=T%3*2/3-1,L=T>2?0:-1,b=[w,L,0,w+2/3,L,0,w+2/3,L+1,0,w,L,0,w+2/3,L+1,0,w,L+1,0];M.set(b,v*g*T),_.set(d,p*g*T);const x=[T,T,T,T,T,T];y.set(x,m*g*T)}const A=new Lt;A.setAttribute("position",new Gt(M,v)),A.setAttribute("uv",new Gt(_,p)),A.setAttribute("faceIndex",new Gt(y,m)),e.push(A),i>Li&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Gl(s,e,t){const n=new tn(s,e,t);return n.texture.mapping=Cs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function es(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Sg(s,e,t){const n=new Float32Array(ei),i=new H(0,1,0);return new Ft({name:"SphericalGaussianBlur",defines:{n:ei,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:oa(),fragmentShader:`

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
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function Hl(){return new Ft({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:oa(),fragmentShader:`

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
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function Vl(){return new Ft({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:oa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function oa(){return`

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
	`}function Mg(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Fo||l===No,h=l===Fi||l===Ni;if(c||h){let u=e.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new zl(s)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&i(f)?(t===null&&(t=new zl(s)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Eg(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&ph("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function wg(s,e,t,n){const i={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let p=0,m=v.length;p<m;p++)e.remove(v[p])}d.removeEventListener("dispose",o),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)e.update(d[g],s.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const v=f[g];for(let p=0,m=v.length;p<m;p++)e.update(v[p],s.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const M=f.array;v=f.version;for(let _=0,y=M.length;_<y;_+=3){const A=M[_+0],T=M[_+1],w=M[_+2];d.push(A,T,T,w,w,A)}}else if(g!==void 0){const M=g.array;v=g.version;for(let _=0,y=M.length/3-1;_<y;_+=3){const A=_+0,T=_+1,w=_+2;d.push(A,T,T,w,w,A)}}else return;const p=new(fh(d)?xh:_h)(d,1);p.version=v;const m=r.get(u);m&&e.remove(m),r.set(u,p)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Tg(s,e,t){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){s.drawElements(n,f,r,d*o),t.update(f,n,1)}function c(d,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,d*o,g),t.update(f,n,g))}function h(d,f,g){if(g===0)return;const v=e.get("WEBGL_multi_draw");if(v===null)for(let p=0;p<g;p++)this.render(d[p]/o,f[p]);else{v.multiDrawElementsWEBGL(n,f,0,r,d,0,g);let p=0;for(let m=0;m<g;m++)p+=f[m];t.update(p,n,1)}}function u(d,f,g,v){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<d.length;m++)c(d[m]/o,f[m],v[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,v,0,g);let m=0;for(let M=0;M<g;M++)m+=f[M];for(let M=0;M<v.length;M++)t.update(m,n,v[M])}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Ag(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Cg(s,e,t){const n=new WeakMap,i=new ut;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let b=function(){w.dispose(),n.delete(a),a.removeEventListener("dispose",b)};d!==void 0&&d.texture.dispose();const f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],M=a.morphAttributes.color||[];let _=0;f===!0&&(_=1),g===!0&&(_=2),v===!0&&(_=3);let y=a.attributes.position.count*_,A=1;y>e.maxTextureSize&&(A=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const T=new Float32Array(y*A*4*u),w=new gh(T,y,A,u);w.type=yn,w.needsUpdate=!0;const L=_*4;for(let x=0;x<u;x++){const U=p[x],P=m[x],I=M[x],N=y*A*4*x;for(let W=0;W<U.count;W++){const B=W*L;f===!0&&(i.fromBufferAttribute(U,W),T[N+B+0]=i.x,T[N+B+1]=i.y,T[N+B+2]=i.z,T[N+B+3]=0),g===!0&&(i.fromBufferAttribute(P,W),T[N+B+4]=i.x,T[N+B+5]=i.y,T[N+B+6]=i.z,T[N+B+7]=0),v===!0&&(i.fromBufferAttribute(I,W),T[N+B+8]=i.x,T[N+B+9]=i.y,T[N+B+10]=i.z,T[N+B+11]=I.itemSize===4?i.w:1)}}d={count:u,texture:w,size:new Oe(y,A)},n.set(a,d),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Rg(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}class Eh extends At{constructor(e,t,n,i,r,o,a,l,c,h=Di){if(h!==Di&&h!==Bi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Di&&(n=Oi),n===void 0&&h===Bi&&(n=ki),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:It,this.minFilter=l!==void 0?l:It,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const wh=new At,Th=new Eh(1,1);Th.compareFunction=dh;const Ah=new gh,Ch=new gf,Rh=new Sh,Wl=[],Xl=[],Yl=new Float32Array(16),jl=new Float32Array(9),ql=new Float32Array(4);function Yi(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Wl[i];if(r===void 0&&(r=new Float32Array(i),Wl[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function dt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function ft(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Ls(s,e){let t=Xl[e];t===void 0&&(t=new Int32Array(e),Xl[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Pg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Lg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;s.uniform2fv(this.addr,e),ft(t,e)}}function Ug(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(dt(t,e))return;s.uniform3fv(this.addr,e),ft(t,e)}}function Dg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;s.uniform4fv(this.addr,e),ft(t,e)}}function Ig(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(dt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),ft(t,e)}else{if(dt(t,n))return;ql.set(n),s.uniformMatrix2fv(this.addr,!1,ql),ft(t,n)}}function Fg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(dt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),ft(t,e)}else{if(dt(t,n))return;jl.set(n),s.uniformMatrix3fv(this.addr,!1,jl),ft(t,n)}}function Ng(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(dt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),ft(t,e)}else{if(dt(t,n))return;Yl.set(n),s.uniformMatrix4fv(this.addr,!1,Yl),ft(t,n)}}function Og(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function kg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;s.uniform2iv(this.addr,e),ft(t,e)}}function Bg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dt(t,e))return;s.uniform3iv(this.addr,e),ft(t,e)}}function zg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;s.uniform4iv(this.addr,e),ft(t,e)}}function Gg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Hg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;s.uniform2uiv(this.addr,e),ft(t,e)}}function Vg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dt(t,e))return;s.uniform3uiv(this.addr,e),ft(t,e)}}function Wg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;s.uniform4uiv(this.addr,e),ft(t,e)}}function Xg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?Th:wh;t.setTexture2D(e||r,i)}function Yg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Ch,i)}function jg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Rh,i)}function qg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Ah,i)}function Kg(s){switch(s){case 5126:return Pg;case 35664:return Lg;case 35665:return Ug;case 35666:return Dg;case 35674:return Ig;case 35675:return Fg;case 35676:return Ng;case 5124:case 35670:return Og;case 35667:case 35671:return kg;case 35668:case 35672:return Bg;case 35669:case 35673:return zg;case 5125:return Gg;case 36294:return Hg;case 36295:return Vg;case 36296:return Wg;case 35678:case 36198:case 36298:case 36306:case 35682:return Xg;case 35679:case 36299:case 36307:return Yg;case 35680:case 36300:case 36308:case 36293:return jg;case 36289:case 36303:case 36311:case 36292:return qg}}function Zg(s,e){s.uniform1fv(this.addr,e)}function $g(s,e){const t=Yi(e,this.size,2);s.uniform2fv(this.addr,t)}function Jg(s,e){const t=Yi(e,this.size,3);s.uniform3fv(this.addr,t)}function Qg(s,e){const t=Yi(e,this.size,4);s.uniform4fv(this.addr,t)}function ev(s,e){const t=Yi(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function tv(s,e){const t=Yi(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function nv(s,e){const t=Yi(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function iv(s,e){s.uniform1iv(this.addr,e)}function rv(s,e){s.uniform2iv(this.addr,e)}function sv(s,e){s.uniform3iv(this.addr,e)}function ov(s,e){s.uniform4iv(this.addr,e)}function av(s,e){s.uniform1uiv(this.addr,e)}function lv(s,e){s.uniform2uiv(this.addr,e)}function cv(s,e){s.uniform3uiv(this.addr,e)}function hv(s,e){s.uniform4uiv(this.addr,e)}function uv(s,e,t){const n=this.cache,i=e.length,r=Ls(t,i);dt(n,r)||(s.uniform1iv(this.addr,r),ft(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||wh,r[o])}function dv(s,e,t){const n=this.cache,i=e.length,r=Ls(t,i);dt(n,r)||(s.uniform1iv(this.addr,r),ft(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||Ch,r[o])}function fv(s,e,t){const n=this.cache,i=e.length,r=Ls(t,i);dt(n,r)||(s.uniform1iv(this.addr,r),ft(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||Rh,r[o])}function pv(s,e,t){const n=this.cache,i=e.length,r=Ls(t,i);dt(n,r)||(s.uniform1iv(this.addr,r),ft(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Ah,r[o])}function mv(s){switch(s){case 5126:return Zg;case 35664:return $g;case 35665:return Jg;case 35666:return Qg;case 35674:return ev;case 35675:return tv;case 35676:return nv;case 5124:case 35670:return iv;case 35667:case 35671:return rv;case 35668:case 35672:return sv;case 35669:case 35673:return ov;case 5125:return av;case 36294:return lv;case 36295:return cv;case 36296:return hv;case 35678:case 36198:case 36298:case 36306:case 35682:return uv;case 35679:case 36299:case 36307:return dv;case 35680:case 36300:case 36308:case 36293:return fv;case 36289:case 36303:case 36311:case 36292:return pv}}class gv{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Kg(t.type)}}class vv{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=mv(t.type)}}class _v{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const So=/(\w+)(\])?(\[|\.)?/g;function Kl(s,e){s.seq.push(e),s.map[e.id]=e}function xv(s,e,t){const n=s.name,i=n.length;for(So.lastIndex=0;;){const r=So.exec(n),o=So.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Kl(t,c===void 0?new gv(a,s,e):new vv(a,s,e));break}else{let u=t.map[a];u===void 0&&(u=new _v(a),Kl(t,u)),t=u}}}class fs{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);xv(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function Zl(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const yv=37297;let bv=0;function Sv(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function Mv(s){const e=nt.getPrimaries(nt.workingColorSpace),t=nt.getPrimaries(s);let n;switch(e===t?n="":e===Ss&&t===bs?n="LinearDisplayP3ToLinearSRGB":e===bs&&t===Ss&&(n="LinearSRGBToLinearDisplayP3"),s){case Gn:case Rs:return[n,"LinearTransferOETF"];case sn:case na:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function $l(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+Sv(s.getShaderSource(e),o)}else return i}function Ev(s,e){const t=Mv(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function wv(s,e){let t;switch(e){case yd:t="Linear";break;case bd:t="Reinhard";break;case Sd:t="OptimizedCineon";break;case Md:t="ACESFilmic";break;case wd:t="AgX";break;case Td:t="Neutral";break;case Ed:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Tv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(pr).join(`
`)}function Av(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Cv(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function pr(s){return s!==""}function Jl(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ql(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Rv=/^[ \t]*#include +<([\w\d./]+)>/gm;function zo(s){return s.replace(Rv,Lv)}const Pv=new Map;function Lv(s,e){let t=qe[e];if(t===void 0){const n=Pv.get(e);if(n!==void 0)t=qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return zo(t)}const Uv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ec(s){return s.replace(Uv,Dv)}function Dv(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function tc(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function Iv(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===eh?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Yu?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===_n&&(e="SHADOWMAP_TYPE_VSM"),e}function Fv(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Fi:case Ni:e="ENVMAP_TYPE_CUBE";break;case Cs:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Nv(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ni:e="ENVMAP_MODE_REFRACTION";break}return e}function Ov(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case th:e="ENVMAP_BLENDING_MULTIPLY";break;case _d:e="ENVMAP_BLENDING_MIX";break;case xd:e="ENVMAP_BLENDING_ADD";break}return e}function kv(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Bv(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Iv(t),c=Fv(t),h=Nv(t),u=Ov(t),d=kv(t),f=Tv(t),g=Av(r),v=i.createProgram();let p,m,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(pr).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(pr).join(`
`),m.length>0&&(m+=`
`)):(p=[tc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(pr).join(`
`),m=[tc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Nn?"#define TONE_MAPPING":"",t.toneMapping!==Nn?qe.tonemapping_pars_fragment:"",t.toneMapping!==Nn?wv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,Ev("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(pr).join(`
`)),o=zo(o),o=Jl(o,t),o=Ql(o,t),a=zo(a),a=Jl(a,t),a=Ql(a,t),o=ec(o),a=ec(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===gl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===gl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const _=M+p+o,y=M+m+a,A=Zl(i,i.VERTEX_SHADER,_),T=Zl(i,i.FRAGMENT_SHADER,y);i.attachShader(v,A),i.attachShader(v,T),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function w(U){if(s.debug.checkShaderErrors){const P=i.getProgramInfoLog(v).trim(),I=i.getShaderInfoLog(A).trim(),N=i.getShaderInfoLog(T).trim();let W=!0,B=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(W=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,A,T);else{const se=$l(i,A,"vertex"),j=$l(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+P+`
`+se+`
`+j)}else P!==""?console.warn("THREE.WebGLProgram: Program Info Log:",P):(I===""||N==="")&&(B=!1);B&&(U.diagnostics={runnable:W,programLog:P,vertexShader:{log:I,prefix:p},fragmentShader:{log:N,prefix:m}})}i.deleteShader(A),i.deleteShader(T),L=new fs(i,v),b=Cv(i,v)}let L;this.getUniforms=function(){return L===void 0&&w(this),L};let b;this.getAttributes=function(){return b===void 0&&w(this),b};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=i.getProgramParameter(v,yv)),x},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=bv++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=A,this.fragmentShader=T,this}let zv=0;class Gv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Hv(e),t.set(e,n)),n}}class Hv{constructor(e){this.id=zv++,this.code=e,this.usedTimes=0}}function Vv(s,e,t,n,i,r,o){const a=new ra,l=new Gv,c=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return c.add(b),b===0?"uv":`uv${b}`}function p(b,x,U,P,I){const N=P.fog,W=I.geometry,B=b.isMeshStandardMaterial?P.environment:null,se=(b.isMeshStandardMaterial?t:e).get(b.envMap||B),j=se&&se.mapping===Cs?se.image.height:null,K=g[b.type];b.precision!==null&&(f=i.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const q=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,F=q!==void 0?q.length:0;let V=0;W.morphAttributes.position!==void 0&&(V=1),W.morphAttributes.normal!==void 0&&(V=2),W.morphAttributes.color!==void 0&&(V=3);let ne,O,k,te;if(K){const De=on[K];ne=De.vertexShader,O=De.fragmentShader}else ne=b.vertexShader,O=b.fragmentShader,l.update(b),k=l.getVertexShaderID(b),te=l.getFragmentShaderID(b);const G=s.getRenderTarget(),ae=I.isInstancedMesh===!0,pe=I.isBatchedMesh===!0,_e=!!b.map,D=!!b.matcap,he=!!se,Pe=!!b.aoMap,Le=!!b.lightMap,fe=!!b.bumpMap,ye=!!b.normalMap,Se=!!b.displacementMap,de=!!b.emissiveMap,Ce=!!b.metalnessMap,R=!!b.roughnessMap,S=b.anisotropy>0,X=b.clearcoat>0,Z=b.dispersion>0,ie=b.iridescence>0,J=b.sheen>0,we=b.transmission>0,le=S&&!!b.anisotropyMap,ce=X&&!!b.clearcoatMap,be=X&&!!b.clearcoatNormalMap,ue=X&&!!b.clearcoatRoughnessMap,Me=ie&&!!b.iridescenceMap,ke=ie&&!!b.iridescenceThicknessMap,Te=J&&!!b.sheenColorMap,me=J&&!!b.sheenRoughnessMap,xe=!!b.specularMap,Ne=!!b.specularColorMap,We=!!b.specularIntensityMap,E=we&&!!b.transmissionMap,Q=we&&!!b.thicknessMap,z=!!b.gradientMap,ee=!!b.alphaMap,ge=b.alphaTest>0,Ae=!!b.alphaHash,Re=!!b.extensions;let je=Nn;b.toneMapped&&(G===null||G.isXRRenderTarget===!0)&&(je=s.toneMapping);const Xe={shaderID:K,shaderType:b.type,shaderName:b.name,vertexShader:ne,fragmentShader:O,defines:b.defines,customVertexShaderID:k,customFragmentShaderID:te,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:pe,batchingColor:pe&&I._colorsTexture!==null,instancing:ae,instancingColor:ae&&I.instanceColor!==null,instancingMorph:ae&&I.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:G===null?s.outputColorSpace:G.isXRRenderTarget===!0?G.texture.colorSpace:Gn,alphaToCoverage:!!b.alphaToCoverage,map:_e,matcap:D,envMap:he,envMapMode:he&&se.mapping,envMapCubeUVHeight:j,aoMap:Pe,lightMap:Le,bumpMap:fe,normalMap:ye,displacementMap:d&&Se,emissiveMap:de,normalMapObjectSpace:ye&&b.normalMapType===kd,normalMapTangentSpace:ye&&b.normalMapType===uh,metalnessMap:Ce,roughnessMap:R,anisotropy:S,anisotropyMap:le,clearcoat:X,clearcoatMap:ce,clearcoatNormalMap:be,clearcoatRoughnessMap:ue,dispersion:Z,iridescence:ie,iridescenceMap:Me,iridescenceThicknessMap:ke,sheen:J,sheenColorMap:Te,sheenRoughnessMap:me,specularMap:xe,specularColorMap:Ne,specularIntensityMap:We,transmission:we,transmissionMap:E,thicknessMap:Q,gradientMap:z,opaque:b.transparent===!1&&b.blending===Ui&&b.alphaToCoverage===!1,alphaMap:ee,alphaTest:ge,alphaHash:Ae,combine:b.combine,mapUv:_e&&v(b.map.channel),aoMapUv:Pe&&v(b.aoMap.channel),lightMapUv:Le&&v(b.lightMap.channel),bumpMapUv:fe&&v(b.bumpMap.channel),normalMapUv:ye&&v(b.normalMap.channel),displacementMapUv:Se&&v(b.displacementMap.channel),emissiveMapUv:de&&v(b.emissiveMap.channel),metalnessMapUv:Ce&&v(b.metalnessMap.channel),roughnessMapUv:R&&v(b.roughnessMap.channel),anisotropyMapUv:le&&v(b.anisotropyMap.channel),clearcoatMapUv:ce&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:be&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Me&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:ke&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:me&&v(b.sheenRoughnessMap.channel),specularMapUv:xe&&v(b.specularMap.channel),specularColorMapUv:Ne&&v(b.specularColorMap.channel),specularIntensityMapUv:We&&v(b.specularIntensityMap.channel),transmissionMapUv:E&&v(b.transmissionMap.channel),thicknessMapUv:Q&&v(b.thicknessMap.channel),alphaMapUv:ee&&v(b.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(ye||S),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!W.attributes.uv&&(_e||ee),fog:!!N,useFog:b.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:I.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:F,morphTextureStride:V,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:s.shadowMap.enabled&&U.length>0,shadowMapType:s.shadowMap.type,toneMapping:je,decodeVideoTexture:_e&&b.map.isVideoTexture===!0&&nt.getTransfer(b.map.colorSpace)===ot,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===an,flipSided:b.side===Nt,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Re&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:Re&&b.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Xe.vertexUv1s=c.has(1),Xe.vertexUv2s=c.has(2),Xe.vertexUv3s=c.has(3),c.clear(),Xe}function m(b){const x=[];if(b.shaderID?x.push(b.shaderID):(x.push(b.customVertexShaderID),x.push(b.customFragmentShaderID)),b.defines!==void 0)for(const U in b.defines)x.push(U),x.push(b.defines[U]);return b.isRawShaderMaterial===!1&&(M(x,b),_(x,b),x.push(s.outputColorSpace)),x.push(b.customProgramCacheKey),x.join()}function M(b,x){b.push(x.precision),b.push(x.outputColorSpace),b.push(x.envMapMode),b.push(x.envMapCubeUVHeight),b.push(x.mapUv),b.push(x.alphaMapUv),b.push(x.lightMapUv),b.push(x.aoMapUv),b.push(x.bumpMapUv),b.push(x.normalMapUv),b.push(x.displacementMapUv),b.push(x.emissiveMapUv),b.push(x.metalnessMapUv),b.push(x.roughnessMapUv),b.push(x.anisotropyMapUv),b.push(x.clearcoatMapUv),b.push(x.clearcoatNormalMapUv),b.push(x.clearcoatRoughnessMapUv),b.push(x.iridescenceMapUv),b.push(x.iridescenceThicknessMapUv),b.push(x.sheenColorMapUv),b.push(x.sheenRoughnessMapUv),b.push(x.specularMapUv),b.push(x.specularColorMapUv),b.push(x.specularIntensityMapUv),b.push(x.transmissionMapUv),b.push(x.thicknessMapUv),b.push(x.combine),b.push(x.fogExp2),b.push(x.sizeAttenuation),b.push(x.morphTargetsCount),b.push(x.morphAttributeCount),b.push(x.numDirLights),b.push(x.numPointLights),b.push(x.numSpotLights),b.push(x.numSpotLightMaps),b.push(x.numHemiLights),b.push(x.numRectAreaLights),b.push(x.numDirLightShadows),b.push(x.numPointLightShadows),b.push(x.numSpotLightShadows),b.push(x.numSpotLightShadowsWithMaps),b.push(x.numLightProbes),b.push(x.shadowMapType),b.push(x.toneMapping),b.push(x.numClippingPlanes),b.push(x.numClipIntersection),b.push(x.depthPacking)}function _(b,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.skinning&&a.enable(4),x.morphTargets&&a.enable(5),x.morphNormals&&a.enable(6),x.morphColors&&a.enable(7),x.premultipliedAlpha&&a.enable(8),x.shadowMapEnabled&&a.enable(9),x.doubleSided&&a.enable(10),x.flipSided&&a.enable(11),x.useDepthPacking&&a.enable(12),x.dithering&&a.enable(13),x.transmission&&a.enable(14),x.sheen&&a.enable(15),x.opaque&&a.enable(16),x.pointsUvs&&a.enable(17),x.decodeVideoTexture&&a.enable(18),x.alphaToCoverage&&a.enable(19),b.push(a.mask)}function y(b){const x=g[b.type];let U;if(x){const P=on[x];U=Sr.clone(P.uniforms)}else U=b.uniforms;return U}function A(b,x){let U;for(let P=0,I=h.length;P<I;P++){const N=h[P];if(N.cacheKey===x){U=N,++U.usedTimes;break}}return U===void 0&&(U=new Bv(s,x,b,r),h.push(U)),U}function T(b){if(--b.usedTimes===0){const x=h.indexOf(b);h[x]=h[h.length-1],h.pop(),b.destroy()}}function w(b){l.remove(b)}function L(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:y,acquireProgram:A,releaseProgram:T,releaseShaderCache:w,programs:h,dispose:L}}function Wv(){let s=new WeakMap;function e(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function t(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function Xv(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function nc(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function ic(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(u,d,f,g,v,p){let m=s[e];return m===void 0?(m={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:p},s[e]=m):(m.id=u.id,m.object=u,m.geometry=d,m.material=f,m.groupOrder=g,m.renderOrder=u.renderOrder,m.z=v,m.group=p),e++,m}function a(u,d,f,g,v,p){const m=o(u,d,f,g,v,p);f.transmission>0?n.push(m):f.transparent===!0?i.push(m):t.push(m)}function l(u,d,f,g,v,p){const m=o(u,d,f,g,v,p);f.transmission>0?n.unshift(m):f.transparent===!0?i.unshift(m):t.unshift(m)}function c(u,d){t.length>1&&t.sort(u||Xv),n.length>1&&n.sort(d||nc),i.length>1&&i.sort(d||nc)}function h(){for(let u=e,d=s.length;u<d;u++){const f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function Yv(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new ic,s.set(n,[o])):i>=r.length?(o=new ic,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function jv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new H,color:new Ve};break;case"SpotLight":t={position:new H,direction:new H,color:new Ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new Ve,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new Ve,groundColor:new Ve};break;case"RectAreaLight":t={color:new Ve,position:new H,halfWidth:new H,halfHeight:new H};break}return s[e.id]=t,t}}}function qv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Kv=0;function Zv(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function $v(s){const e=new jv,t=qv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new H);const i=new H,r=new it,o=new it;function a(c){let h=0,u=0,d=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let f=0,g=0,v=0,p=0,m=0,M=0,_=0,y=0,A=0,T=0,w=0;c.sort(Zv);for(let b=0,x=c.length;b<x;b++){const U=c[b],P=U.color,I=U.intensity,N=U.distance,W=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)h+=P.r*I,u+=P.g*I,d+=P.b*I;else if(U.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(U.sh.coefficients[B],I);w++}else if(U.isDirectionalLight){const B=e.get(U);if(B.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const se=U.shadow,j=t.get(U);j.shadowBias=se.bias,j.shadowNormalBias=se.normalBias,j.shadowRadius=se.radius,j.shadowMapSize=se.mapSize,n.directionalShadow[f]=j,n.directionalShadowMap[f]=W,n.directionalShadowMatrix[f]=U.shadow.matrix,M++}n.directional[f]=B,f++}else if(U.isSpotLight){const B=e.get(U);B.position.setFromMatrixPosition(U.matrixWorld),B.color.copy(P).multiplyScalar(I),B.distance=N,B.coneCos=Math.cos(U.angle),B.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),B.decay=U.decay,n.spot[v]=B;const se=U.shadow;if(U.map&&(n.spotLightMap[A]=U.map,A++,se.updateMatrices(U),U.castShadow&&T++),n.spotLightMatrix[v]=se.matrix,U.castShadow){const j=t.get(U);j.shadowBias=se.bias,j.shadowNormalBias=se.normalBias,j.shadowRadius=se.radius,j.shadowMapSize=se.mapSize,n.spotShadow[v]=j,n.spotShadowMap[v]=W,y++}v++}else if(U.isRectAreaLight){const B=e.get(U);B.color.copy(P).multiplyScalar(I),B.halfWidth.set(U.width*.5,0,0),B.halfHeight.set(0,U.height*.5,0),n.rectArea[p]=B,p++}else if(U.isPointLight){const B=e.get(U);if(B.color.copy(U.color).multiplyScalar(U.intensity),B.distance=U.distance,B.decay=U.decay,U.castShadow){const se=U.shadow,j=t.get(U);j.shadowBias=se.bias,j.shadowNormalBias=se.normalBias,j.shadowRadius=se.radius,j.shadowMapSize=se.mapSize,j.shadowCameraNear=se.camera.near,j.shadowCameraFar=se.camera.far,n.pointShadow[g]=j,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=U.shadow.matrix,_++}n.point[g]=B,g++}else if(U.isHemisphereLight){const B=e.get(U);B.skyColor.copy(U.color).multiplyScalar(I),B.groundColor.copy(U.groundColor).multiplyScalar(I),n.hemi[m]=B,m++}}p>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ue.LTC_FLOAT_1,n.rectAreaLTC2=Ue.LTC_FLOAT_2):(n.rectAreaLTC1=Ue.LTC_HALF_1,n.rectAreaLTC2=Ue.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const L=n.hash;(L.directionalLength!==f||L.pointLength!==g||L.spotLength!==v||L.rectAreaLength!==p||L.hemiLength!==m||L.numDirectionalShadows!==M||L.numPointShadows!==_||L.numSpotShadows!==y||L.numSpotMaps!==A||L.numLightProbes!==w)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=y+A-T,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=w,L.directionalLength=f,L.pointLength=g,L.spotLength=v,L.rectAreaLength=p,L.hemiLength=m,L.numDirectionalShadows=M,L.numPointShadows=_,L.numSpotShadows=y,L.numSpotMaps=A,L.numLightProbes=w,n.version=Kv++)}function l(c,h){let u=0,d=0,f=0,g=0,v=0;const p=h.matrixWorldInverse;for(let m=0,M=c.length;m<M;m++){const _=c[m];if(_.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(p),u++}else if(_.isSpotLight){const y=n.spot[f];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(p),f++}else if(_.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(p),o.identity(),r.copy(_.matrixWorld),r.premultiply(p),o.extractRotation(r),y.halfWidth.set(_.width*.5,0,0),y.halfHeight.set(0,_.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(_.isPointLight){const y=n.point[d];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(p),d++}else if(_.isHemisphereLight){const y=n.hemi[v];y.direction.setFromMatrixPosition(_.matrixWorld),y.direction.transformDirection(p),v++}}}return{setup:a,setupView:l,state:n}}function rc(s){const e=new $v(s),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Jv(s){let e=new WeakMap;function t(i,r=0){const o=e.get(i);let a;return o===void 0?(a=new rc(s),e.set(i,[a])):r>=o.length?(a=new rc(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class Ph extends Vi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Od,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Lh extends Vi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Qv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,e_=`uniform sampler2D shadow_pass;
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
}`;function t_(s,e,t){let n=new sa;const i=new Oe,r=new Oe,o=new ut,a=new Ph({depthPacking:hh}),l=new Lh,c={},h=t.maxTextureSize,u={[kn]:Nt,[Nt]:kn,[an]:an},d=new Ft({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:Qv,fragmentShader:e_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Lt;g.setAttribute("position",new Gt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Tt(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=eh;let m=this.type;this.render=function(T,w,L){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;const b=s.getRenderTarget(),x=s.getActiveCubeFace(),U=s.getActiveMipmapLevel(),P=s.state;P.setBlending(Sn),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const I=m!==_n&&this.type===_n,N=m===_n&&this.type!==_n;for(let W=0,B=T.length;W<B;W++){const se=T[W],j=se.shadow;if(j===void 0){console.warn("THREE.WebGLShadowMap:",se,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;i.copy(j.mapSize);const K=j.getFrameExtents();if(i.multiply(K),r.copy(j.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/K.x),i.x=r.x*K.x,j.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/K.y),i.y=r.y*K.y,j.mapSize.y=r.y)),j.map===null||I===!0||N===!0){const F=this.type!==_n?{minFilter:It,magFilter:It}:{};j.map!==null&&j.map.dispose(),j.map=new tn(i.x,i.y,F),j.map.texture.name=se.name+".shadowMap",j.camera.updateProjectionMatrix()}s.setRenderTarget(j.map),s.clear();const q=j.getViewportCount();for(let F=0;F<q;F++){const V=j.getViewport(F);o.set(r.x*V.x,r.y*V.y,r.x*V.z,r.y*V.w),P.viewport(o),j.updateMatrices(se,F),n=j.getFrustum(),y(w,L,j.camera,se,this.type)}j.isPointLightShadow!==!0&&this.type===_n&&M(j,L),j.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(b,x,U)};function M(T,w){const L=e.update(v);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new tn(i.x,i.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(w,null,L,d,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(w,null,L,f,v,null)}function _(T,w,L,b){let x=null;const U=L.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(U!==void 0)x=U;else if(x=L.isPointLight===!0?l:a,s.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const P=x.uuid,I=w.uuid;let N=c[P];N===void 0&&(N={},c[P]=N);let W=N[I];W===void 0&&(W=x.clone(),N[I]=W,w.addEventListener("dispose",A)),x=W}if(x.visible=w.visible,x.wireframe=w.wireframe,b===_n?x.side=w.shadowSide!==null?w.shadowSide:w.side:x.side=w.shadowSide!==null?w.shadowSide:u[w.side],x.alphaMap=w.alphaMap,x.alphaTest=w.alphaTest,x.map=w.map,x.clipShadows=w.clipShadows,x.clippingPlanes=w.clippingPlanes,x.clipIntersection=w.clipIntersection,x.displacementMap=w.displacementMap,x.displacementScale=w.displacementScale,x.displacementBias=w.displacementBias,x.wireframeLinewidth=w.wireframeLinewidth,x.linewidth=w.linewidth,L.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const P=s.properties.get(x);P.light=L}return x}function y(T,w,L,b,x){if(T.visible===!1)return;if(T.layers.test(w.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&x===_n)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,T.matrixWorld);const I=e.update(T),N=T.material;if(Array.isArray(N)){const W=I.groups;for(let B=0,se=W.length;B<se;B++){const j=W[B],K=N[j.materialIndex];if(K&&K.visible){const q=_(T,K,b,x);T.onBeforeShadow(s,T,w,L,I,q,j),s.renderBufferDirect(L,null,I,q,T,j),T.onAfterShadow(s,T,w,L,I,q,j)}}}else if(N.visible){const W=_(T,N,b,x);T.onBeforeShadow(s,T,w,L,I,W,null),s.renderBufferDirect(L,null,I,W,T,null),T.onAfterShadow(s,T,w,L,I,W,null)}}const P=T.children;for(let I=0,N=P.length;I<N;I++)y(P[I],w,L,b,x)}function A(T){T.target.removeEventListener("dispose",A);for(const L in c){const b=c[L],x=T.target.uuid;x in b&&(b[x].dispose(),delete b[x])}}}function n_(s){function e(){let E=!1;const Q=new ut;let z=null;const ee=new ut(0,0,0,0);return{setMask:function(ge){z!==ge&&!E&&(s.colorMask(ge,ge,ge,ge),z=ge)},setLocked:function(ge){E=ge},setClear:function(ge,Ae,Re,je,Xe){Xe===!0&&(ge*=je,Ae*=je,Re*=je),Q.set(ge,Ae,Re,je),ee.equals(Q)===!1&&(s.clearColor(ge,Ae,Re,je),ee.copy(Q))},reset:function(){E=!1,z=null,ee.set(-1,0,0,0)}}}function t(){let E=!1,Q=null,z=null,ee=null;return{setTest:function(ge){ge?te(s.DEPTH_TEST):G(s.DEPTH_TEST)},setMask:function(ge){Q!==ge&&!E&&(s.depthMask(ge),Q=ge)},setFunc:function(ge){if(z!==ge){switch(ge){case ud:s.depthFunc(s.NEVER);break;case dd:s.depthFunc(s.ALWAYS);break;case fd:s.depthFunc(s.LESS);break;case _s:s.depthFunc(s.LEQUAL);break;case pd:s.depthFunc(s.EQUAL);break;case md:s.depthFunc(s.GEQUAL);break;case gd:s.depthFunc(s.GREATER);break;case vd:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}z=ge}},setLocked:function(ge){E=ge},setClear:function(ge){ee!==ge&&(s.clearDepth(ge),ee=ge)},reset:function(){E=!1,Q=null,z=null,ee=null}}}function n(){let E=!1,Q=null,z=null,ee=null,ge=null,Ae=null,Re=null,je=null,Xe=null;return{setTest:function(De){E||(De?te(s.STENCIL_TEST):G(s.STENCIL_TEST))},setMask:function(De){Q!==De&&!E&&(s.stencilMask(De),Q=De)},setFunc:function(De,Ye,$e){(z!==De||ee!==Ye||ge!==$e)&&(s.stencilFunc(De,Ye,$e),z=De,ee=Ye,ge=$e)},setOp:function(De,Ye,$e){(Ae!==De||Re!==Ye||je!==$e)&&(s.stencilOp(De,Ye,$e),Ae=De,Re=Ye,je=$e)},setLocked:function(De){E=De},setClear:function(De){Xe!==De&&(s.clearStencil(De),Xe=De)},reset:function(){E=!1,Q=null,z=null,ee=null,ge=null,Ae=null,Re=null,je=null,Xe=null}}}const i=new e,r=new t,o=new n,a=new WeakMap,l=new WeakMap;let c={},h={},u=new WeakMap,d=[],f=null,g=!1,v=null,p=null,m=null,M=null,_=null,y=null,A=null,T=new Ve(0,0,0),w=0,L=!1,b=null,x=null,U=null,P=null,I=null;const N=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,B=0;const se=s.getParameter(s.VERSION);se.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(se)[1]),W=B>=1):se.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(se)[1]),W=B>=2);let j=null,K={};const q=s.getParameter(s.SCISSOR_BOX),F=s.getParameter(s.VIEWPORT),V=new ut().fromArray(q),ne=new ut().fromArray(F);function O(E,Q,z,ee){const ge=new Uint8Array(4),Ae=s.createTexture();s.bindTexture(E,Ae),s.texParameteri(E,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(E,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Re=0;Re<z;Re++)E===s.TEXTURE_3D||E===s.TEXTURE_2D_ARRAY?s.texImage3D(Q,0,s.RGBA,1,1,ee,0,s.RGBA,s.UNSIGNED_BYTE,ge):s.texImage2D(Q+Re,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ge);return Ae}const k={};k[s.TEXTURE_2D]=O(s.TEXTURE_2D,s.TEXTURE_2D,1),k[s.TEXTURE_CUBE_MAP]=O(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),k[s.TEXTURE_2D_ARRAY]=O(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),k[s.TEXTURE_3D]=O(s.TEXTURE_3D,s.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),o.setClear(0),te(s.DEPTH_TEST),r.setFunc(_s),fe(!1),ye(Ba),te(s.CULL_FACE),Pe(Sn);function te(E){c[E]!==!0&&(s.enable(E),c[E]=!0)}function G(E){c[E]!==!1&&(s.disable(E),c[E]=!1)}function ae(E,Q){return h[E]!==Q?(s.bindFramebuffer(E,Q),h[E]=Q,E===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=Q),E===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=Q),!0):!1}function pe(E,Q){let z=d,ee=!1;if(E){z=u.get(Q),z===void 0&&(z=[],u.set(Q,z));const ge=E.textures;if(z.length!==ge.length||z[0]!==s.COLOR_ATTACHMENT0){for(let Ae=0,Re=ge.length;Ae<Re;Ae++)z[Ae]=s.COLOR_ATTACHMENT0+Ae;z.length=ge.length,ee=!0}}else z[0]!==s.BACK&&(z[0]=s.BACK,ee=!0);ee&&s.drawBuffers(z)}function _e(E){return f!==E?(s.useProgram(E),f=E,!0):!1}const D={[Qn]:s.FUNC_ADD,[qu]:s.FUNC_SUBTRACT,[Ku]:s.FUNC_REVERSE_SUBTRACT};D[Zu]=s.MIN,D[$u]=s.MAX;const he={[Ju]:s.ZERO,[Qu]:s.ONE,[ed]:s.SRC_COLOR,[Do]:s.SRC_ALPHA,[od]:s.SRC_ALPHA_SATURATE,[rd]:s.DST_COLOR,[nd]:s.DST_ALPHA,[td]:s.ONE_MINUS_SRC_COLOR,[Io]:s.ONE_MINUS_SRC_ALPHA,[sd]:s.ONE_MINUS_DST_COLOR,[id]:s.ONE_MINUS_DST_ALPHA,[ad]:s.CONSTANT_COLOR,[ld]:s.ONE_MINUS_CONSTANT_COLOR,[cd]:s.CONSTANT_ALPHA,[hd]:s.ONE_MINUS_CONSTANT_ALPHA};function Pe(E,Q,z,ee,ge,Ae,Re,je,Xe,De){if(E===Sn){g===!0&&(G(s.BLEND),g=!1);return}if(g===!1&&(te(s.BLEND),g=!0),E!==ju){if(E!==v||De!==L){if((p!==Qn||_!==Qn)&&(s.blendEquation(s.FUNC_ADD),p=Qn,_=Qn),De)switch(E){case Ui:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case vs:s.blendFunc(s.ONE,s.ONE);break;case za:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ga:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",E);break}else switch(E){case Ui:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case vs:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case za:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ga:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",E);break}m=null,M=null,y=null,A=null,T.set(0,0,0),w=0,v=E,L=De}return}ge=ge||Q,Ae=Ae||z,Re=Re||ee,(Q!==p||ge!==_)&&(s.blendEquationSeparate(D[Q],D[ge]),p=Q,_=ge),(z!==m||ee!==M||Ae!==y||Re!==A)&&(s.blendFuncSeparate(he[z],he[ee],he[Ae],he[Re]),m=z,M=ee,y=Ae,A=Re),(je.equals(T)===!1||Xe!==w)&&(s.blendColor(je.r,je.g,je.b,Xe),T.copy(je),w=Xe),v=E,L=!1}function Le(E,Q){E.side===an?G(s.CULL_FACE):te(s.CULL_FACE);let z=E.side===Nt;Q&&(z=!z),fe(z),E.blending===Ui&&E.transparent===!1?Pe(Sn):Pe(E.blending,E.blendEquation,E.blendSrc,E.blendDst,E.blendEquationAlpha,E.blendSrcAlpha,E.blendDstAlpha,E.blendColor,E.blendAlpha,E.premultipliedAlpha),r.setFunc(E.depthFunc),r.setTest(E.depthTest),r.setMask(E.depthWrite),i.setMask(E.colorWrite);const ee=E.stencilWrite;o.setTest(ee),ee&&(o.setMask(E.stencilWriteMask),o.setFunc(E.stencilFunc,E.stencilRef,E.stencilFuncMask),o.setOp(E.stencilFail,E.stencilZFail,E.stencilZPass)),de(E.polygonOffset,E.polygonOffsetFactor,E.polygonOffsetUnits),E.alphaToCoverage===!0?te(s.SAMPLE_ALPHA_TO_COVERAGE):G(s.SAMPLE_ALPHA_TO_COVERAGE)}function fe(E){b!==E&&(E?s.frontFace(s.CW):s.frontFace(s.CCW),b=E)}function ye(E){E!==Wu?(te(s.CULL_FACE),E!==x&&(E===Ba?s.cullFace(s.BACK):E===Xu?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):G(s.CULL_FACE),x=E}function Se(E){E!==U&&(W&&s.lineWidth(E),U=E)}function de(E,Q,z){E?(te(s.POLYGON_OFFSET_FILL),(P!==Q||I!==z)&&(s.polygonOffset(Q,z),P=Q,I=z)):G(s.POLYGON_OFFSET_FILL)}function Ce(E){E?te(s.SCISSOR_TEST):G(s.SCISSOR_TEST)}function R(E){E===void 0&&(E=s.TEXTURE0+N-1),j!==E&&(s.activeTexture(E),j=E)}function S(E,Q,z){z===void 0&&(j===null?z=s.TEXTURE0+N-1:z=j);let ee=K[z];ee===void 0&&(ee={type:void 0,texture:void 0},K[z]=ee),(ee.type!==E||ee.texture!==Q)&&(j!==z&&(s.activeTexture(z),j=z),s.bindTexture(E,Q||k[E]),ee.type=E,ee.texture=Q)}function X(){const E=K[j];E!==void 0&&E.type!==void 0&&(s.bindTexture(E.type,null),E.type=void 0,E.texture=void 0)}function Z(){try{s.compressedTexImage2D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function ie(){try{s.compressedTexImage3D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function J(){try{s.texSubImage2D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function we(){try{s.texSubImage3D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function le(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function ce(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function be(){try{s.texStorage2D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function ue(){try{s.texStorage3D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function Me(){try{s.texImage2D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function ke(){try{s.texImage3D.apply(s,arguments)}catch(E){console.error("THREE.WebGLState:",E)}}function Te(E){V.equals(E)===!1&&(s.scissor(E.x,E.y,E.z,E.w),V.copy(E))}function me(E){ne.equals(E)===!1&&(s.viewport(E.x,E.y,E.z,E.w),ne.copy(E))}function xe(E,Q){let z=l.get(Q);z===void 0&&(z=new WeakMap,l.set(Q,z));let ee=z.get(E);ee===void 0&&(ee=s.getUniformBlockIndex(Q,E.name),z.set(E,ee))}function Ne(E,Q){const ee=l.get(Q).get(E);a.get(Q)!==ee&&(s.uniformBlockBinding(Q,ee,E.__bindingPointIndex),a.set(Q,ee))}function We(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),c={},j=null,K={},h={},u=new WeakMap,d=[],f=null,g=!1,v=null,p=null,m=null,M=null,_=null,y=null,A=null,T=new Ve(0,0,0),w=0,L=!1,b=null,x=null,U=null,P=null,I=null,V.set(0,0,s.canvas.width,s.canvas.height),ne.set(0,0,s.canvas.width,s.canvas.height),i.reset(),r.reset(),o.reset()}return{buffers:{color:i,depth:r,stencil:o},enable:te,disable:G,bindFramebuffer:ae,drawBuffers:pe,useProgram:_e,setBlending:Pe,setMaterial:Le,setFlipSided:fe,setCullFace:ye,setLineWidth:Se,setPolygonOffset:de,setScissorTest:Ce,activeTexture:R,bindTexture:S,unbindTexture:X,compressedTexImage2D:Z,compressedTexImage3D:ie,texImage2D:Me,texImage3D:ke,updateUBOMapping:xe,uniformBlockBinding:Ne,texStorage2D:be,texStorage3D:ue,texSubImage2D:J,texSubImage3D:we,compressedTexSubImage2D:le,compressedTexSubImage3D:ce,scissor:Te,viewport:me,reset:We}}function i_(s,e,t,n,i,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Oe,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,S){return f?new OffscreenCanvas(R,S):Es("canvas")}function v(R,S,X){let Z=1;const ie=Ce(R);if((ie.width>X||ie.height>X)&&(Z=X/Math.max(ie.width,ie.height)),Z<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const J=Math.floor(Z*ie.width),we=Math.floor(Z*ie.height);u===void 0&&(u=g(J,we));const le=S?g(J,we):u;return le.width=J,le.height=we,le.getContext("2d").drawImage(R,0,0,J,we),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+J+"x"+we+")."),le}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),R;return R}function p(R){return R.generateMipmaps&&R.minFilter!==It&&R.minFilter!==zt}function m(R){s.generateMipmap(R)}function M(R,S,X,Z,ie=!1){if(R!==null){if(s[R]!==void 0)return s[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let J=S;if(S===s.RED&&(X===s.FLOAT&&(J=s.R32F),X===s.HALF_FLOAT&&(J=s.R16F),X===s.UNSIGNED_BYTE&&(J=s.R8)),S===s.RED_INTEGER&&(X===s.UNSIGNED_BYTE&&(J=s.R8UI),X===s.UNSIGNED_SHORT&&(J=s.R16UI),X===s.UNSIGNED_INT&&(J=s.R32UI),X===s.BYTE&&(J=s.R8I),X===s.SHORT&&(J=s.R16I),X===s.INT&&(J=s.R32I)),S===s.RG&&(X===s.FLOAT&&(J=s.RG32F),X===s.HALF_FLOAT&&(J=s.RG16F),X===s.UNSIGNED_BYTE&&(J=s.RG8)),S===s.RG_INTEGER&&(X===s.UNSIGNED_BYTE&&(J=s.RG8UI),X===s.UNSIGNED_SHORT&&(J=s.RG16UI),X===s.UNSIGNED_INT&&(J=s.RG32UI),X===s.BYTE&&(J=s.RG8I),X===s.SHORT&&(J=s.RG16I),X===s.INT&&(J=s.RG32I)),S===s.RGB&&X===s.UNSIGNED_INT_5_9_9_9_REV&&(J=s.RGB9_E5),S===s.RGBA){const we=ie?ys:nt.getTransfer(Z);X===s.FLOAT&&(J=s.RGBA32F),X===s.HALF_FLOAT&&(J=s.RGBA16F),X===s.UNSIGNED_BYTE&&(J=we===ot?s.SRGB8_ALPHA8:s.RGBA8),X===s.UNSIGNED_SHORT_4_4_4_4&&(J=s.RGBA4),X===s.UNSIGNED_SHORT_5_5_5_1&&(J=s.RGB5_A1)}return(J===s.R16F||J===s.R32F||J===s.RG16F||J===s.RG32F||J===s.RGBA16F||J===s.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function _(R,S){let X;return R?S===null||S===Oi||S===ki?X=s.DEPTH24_STENCIL8:S===yn?X=s.DEPTH32F_STENCIL8:S===xs&&(X=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Oi||S===ki?X=s.DEPTH_COMPONENT24:S===yn?X=s.DEPTH_COMPONENT32F:S===xs&&(X=s.DEPTH_COMPONENT16),X}function y(R,S){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==It&&R.minFilter!==zt?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function A(R){const S=R.target;S.removeEventListener("dispose",A),w(S),S.isVideoTexture&&h.delete(S)}function T(R){const S=R.target;S.removeEventListener("dispose",T),b(S)}function w(R){const S=n.get(R);if(S.__webglInit===void 0)return;const X=R.source,Z=d.get(X);if(Z){const ie=Z[S.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&L(R),Object.keys(Z).length===0&&d.delete(X)}n.remove(R)}function L(R){const S=n.get(R);s.deleteTexture(S.__webglTexture);const X=R.source,Z=d.get(X);delete Z[S.__cacheKey],o.memory.textures--}function b(R){const S=n.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(S.__webglFramebuffer[Z]))for(let ie=0;ie<S.__webglFramebuffer[Z].length;ie++)s.deleteFramebuffer(S.__webglFramebuffer[Z][ie]);else s.deleteFramebuffer(S.__webglFramebuffer[Z]);S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer[Z])}else{if(Array.isArray(S.__webglFramebuffer))for(let Z=0;Z<S.__webglFramebuffer.length;Z++)s.deleteFramebuffer(S.__webglFramebuffer[Z]);else s.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&s.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Z=0;Z<S.__webglColorRenderbuffer.length;Z++)S.__webglColorRenderbuffer[Z]&&s.deleteRenderbuffer(S.__webglColorRenderbuffer[Z]);S.__webglDepthRenderbuffer&&s.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const X=R.textures;for(let Z=0,ie=X.length;Z<ie;Z++){const J=n.get(X[Z]);J.__webglTexture&&(s.deleteTexture(J.__webglTexture),o.memory.textures--),n.remove(X[Z])}n.remove(R)}let x=0;function U(){x=0}function P(){const R=x;return R>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),x+=1,R}function I(R){const S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function N(R,S){const X=n.get(R);if(R.isVideoTexture&&Se(R),R.isRenderTargetTexture===!1&&R.version>0&&X.__version!==R.version){const Z=R.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ne(X,R,S);return}}t.bindTexture(s.TEXTURE_2D,X.__webglTexture,s.TEXTURE0+S)}function W(R,S){const X=n.get(R);if(R.version>0&&X.__version!==R.version){ne(X,R,S);return}t.bindTexture(s.TEXTURE_2D_ARRAY,X.__webglTexture,s.TEXTURE0+S)}function B(R,S){const X=n.get(R);if(R.version>0&&X.__version!==R.version){ne(X,R,S);return}t.bindTexture(s.TEXTURE_3D,X.__webglTexture,s.TEXTURE0+S)}function se(R,S){const X=n.get(R);if(R.version>0&&X.__version!==R.version){O(X,R,S);return}t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture,s.TEXTURE0+S)}const j={[Oo]:s.REPEAT,[ni]:s.CLAMP_TO_EDGE,[ko]:s.MIRRORED_REPEAT},K={[It]:s.NEAREST,[Ad]:s.NEAREST_MIPMAP_NEAREST,[Dr]:s.NEAREST_MIPMAP_LINEAR,[zt]:s.LINEAR,[Ys]:s.LINEAR_MIPMAP_NEAREST,[ii]:s.LINEAR_MIPMAP_LINEAR},q={[Bd]:s.NEVER,[Xd]:s.ALWAYS,[zd]:s.LESS,[dh]:s.LEQUAL,[Gd]:s.EQUAL,[Wd]:s.GEQUAL,[Hd]:s.GREATER,[Vd]:s.NOTEQUAL};function F(R,S){if(S.type===yn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===zt||S.magFilter===Ys||S.magFilter===Dr||S.magFilter===ii||S.minFilter===zt||S.minFilter===Ys||S.minFilter===Dr||S.minFilter===ii)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,j[S.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,j[S.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,j[S.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,K[S.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,K[S.minFilter]),S.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,q[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===It||S.minFilter!==Dr&&S.minFilter!==ii||S.type===yn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const X=e.get("EXT_texture_filter_anisotropic");s.texParameterf(R,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function V(R,S){let X=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",A));const Z=S.source;let ie=d.get(Z);ie===void 0&&(ie={},d.set(Z,ie));const J=I(S);if(J!==R.__cacheKey){ie[J]===void 0&&(ie[J]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,X=!0),ie[J].usedTimes++;const we=ie[R.__cacheKey];we!==void 0&&(ie[R.__cacheKey].usedTimes--,we.usedTimes===0&&L(S)),R.__cacheKey=J,R.__webglTexture=ie[J].texture}return X}function ne(R,S,X){let Z=s.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Z=s.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Z=s.TEXTURE_3D);const ie=V(R,S),J=S.source;t.bindTexture(Z,R.__webglTexture,s.TEXTURE0+X);const we=n.get(J);if(J.version!==we.__version||ie===!0){t.activeTexture(s.TEXTURE0+X);const le=nt.getPrimaries(nt.workingColorSpace),ce=S.colorSpace===Fn?null:nt.getPrimaries(S.colorSpace),be=S.colorSpace===Fn||le===ce?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);let ue=v(S.image,!1,i.maxTextureSize);ue=de(S,ue);const Me=r.convert(S.format,S.colorSpace),ke=r.convert(S.type);let Te=M(S.internalFormat,Me,ke,S.colorSpace,S.isVideoTexture);F(Z,S);let me;const xe=S.mipmaps,Ne=S.isVideoTexture!==!0,We=we.__version===void 0||ie===!0,E=J.dataReady,Q=y(S,ue);if(S.isDepthTexture)Te=_(S.format===Bi,S.type),We&&(Ne?t.texStorage2D(s.TEXTURE_2D,1,Te,ue.width,ue.height):t.texImage2D(s.TEXTURE_2D,0,Te,ue.width,ue.height,0,Me,ke,null));else if(S.isDataTexture)if(xe.length>0){Ne&&We&&t.texStorage2D(s.TEXTURE_2D,Q,Te,xe[0].width,xe[0].height);for(let z=0,ee=xe.length;z<ee;z++)me=xe[z],Ne?E&&t.texSubImage2D(s.TEXTURE_2D,z,0,0,me.width,me.height,Me,ke,me.data):t.texImage2D(s.TEXTURE_2D,z,Te,me.width,me.height,0,Me,ke,me.data);S.generateMipmaps=!1}else Ne?(We&&t.texStorage2D(s.TEXTURE_2D,Q,Te,ue.width,ue.height),E&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ue.width,ue.height,Me,ke,ue.data)):t.texImage2D(s.TEXTURE_2D,0,Te,ue.width,ue.height,0,Me,ke,ue.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ne&&We&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Q,Te,xe[0].width,xe[0].height,ue.depth);for(let z=0,ee=xe.length;z<ee;z++)if(me=xe[z],S.format!==cn)if(Me!==null)if(Ne){if(E)if(S.layerUpdates.size>0){for(const ge of S.layerUpdates){const Ae=me.width*me.height;t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,z,0,0,ge,me.width,me.height,1,Me,me.data.slice(Ae*ge,Ae*(ge+1)),0,0)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,z,0,0,0,me.width,me.height,ue.depth,Me,me.data,0,0)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,z,Te,me.width,me.height,ue.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ne?E&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,z,0,0,0,me.width,me.height,ue.depth,Me,ke,me.data):t.texImage3D(s.TEXTURE_2D_ARRAY,z,Te,me.width,me.height,ue.depth,0,Me,ke,me.data)}else{Ne&&We&&t.texStorage2D(s.TEXTURE_2D,Q,Te,xe[0].width,xe[0].height);for(let z=0,ee=xe.length;z<ee;z++)me=xe[z],S.format!==cn?Me!==null?Ne?E&&t.compressedTexSubImage2D(s.TEXTURE_2D,z,0,0,me.width,me.height,Me,me.data):t.compressedTexImage2D(s.TEXTURE_2D,z,Te,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ne?E&&t.texSubImage2D(s.TEXTURE_2D,z,0,0,me.width,me.height,Me,ke,me.data):t.texImage2D(s.TEXTURE_2D,z,Te,me.width,me.height,0,Me,ke,me.data)}else if(S.isDataArrayTexture)if(Ne){if(We&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Q,Te,ue.width,ue.height,ue.depth),E)if(S.layerUpdates.size>0){let z;switch(ke){case s.UNSIGNED_BYTE:switch(Me){case s.ALPHA:z=1;break;case s.LUMINANCE:z=1;break;case s.LUMINANCE_ALPHA:z=2;break;case s.RGB:z=3;break;case s.RGBA:z=4;break;default:throw new Error(`Unknown texel size for format ${Me}.`)}break;case s.UNSIGNED_SHORT_4_4_4_4:case s.UNSIGNED_SHORT_5_5_5_1:case s.UNSIGNED_SHORT_5_6_5:z=1;break;default:throw new Error(`Unknown texel size for type ${ke}.`)}const ee=ue.width*ue.height*z;for(const ge of S.layerUpdates)t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ge,ue.width,ue.height,1,Me,ke,ue.data.slice(ee*ge,ee*(ge+1)));S.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,Me,ke,ue.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Te,ue.width,ue.height,ue.depth,0,Me,ke,ue.data);else if(S.isData3DTexture)Ne?(We&&t.texStorage3D(s.TEXTURE_3D,Q,Te,ue.width,ue.height,ue.depth),E&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,Me,ke,ue.data)):t.texImage3D(s.TEXTURE_3D,0,Te,ue.width,ue.height,ue.depth,0,Me,ke,ue.data);else if(S.isFramebufferTexture){if(We)if(Ne)t.texStorage2D(s.TEXTURE_2D,Q,Te,ue.width,ue.height);else{let z=ue.width,ee=ue.height;for(let ge=0;ge<Q;ge++)t.texImage2D(s.TEXTURE_2D,ge,Te,z,ee,0,Me,ke,null),z>>=1,ee>>=1}}else if(xe.length>0){if(Ne&&We){const z=Ce(xe[0]);t.texStorage2D(s.TEXTURE_2D,Q,Te,z.width,z.height)}for(let z=0,ee=xe.length;z<ee;z++)me=xe[z],Ne?E&&t.texSubImage2D(s.TEXTURE_2D,z,0,0,Me,ke,me):t.texImage2D(s.TEXTURE_2D,z,Te,Me,ke,me);S.generateMipmaps=!1}else if(Ne){if(We){const z=Ce(ue);t.texStorage2D(s.TEXTURE_2D,Q,Te,z.width,z.height)}E&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Me,ke,ue)}else t.texImage2D(s.TEXTURE_2D,0,Te,Me,ke,ue);p(S)&&m(Z),we.__version=J.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function O(R,S,X){if(S.image.length!==6)return;const Z=V(R,S),ie=S.source;t.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+X);const J=n.get(ie);if(ie.version!==J.__version||Z===!0){t.activeTexture(s.TEXTURE0+X);const we=nt.getPrimaries(nt.workingColorSpace),le=S.colorSpace===Fn?null:nt.getPrimaries(S.colorSpace),ce=S.colorSpace===Fn||we===le?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);const be=S.isCompressedTexture||S.image[0].isCompressedTexture,ue=S.image[0]&&S.image[0].isDataTexture,Me=[];for(let ee=0;ee<6;ee++)!be&&!ue?Me[ee]=v(S.image[ee],!0,i.maxCubemapSize):Me[ee]=ue?S.image[ee].image:S.image[ee],Me[ee]=de(S,Me[ee]);const ke=Me[0],Te=r.convert(S.format,S.colorSpace),me=r.convert(S.type),xe=M(S.internalFormat,Te,me,S.colorSpace),Ne=S.isVideoTexture!==!0,We=J.__version===void 0||Z===!0,E=ie.dataReady;let Q=y(S,ke);F(s.TEXTURE_CUBE_MAP,S);let z;if(be){Ne&&We&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Q,xe,ke.width,ke.height);for(let ee=0;ee<6;ee++){z=Me[ee].mipmaps;for(let ge=0;ge<z.length;ge++){const Ae=z[ge];S.format!==cn?Te!==null?Ne?E&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,0,0,Ae.width,Ae.height,Te,Ae.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,xe,Ae.width,Ae.height,0,Ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ne?E&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,0,0,Ae.width,Ae.height,Te,me,Ae.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge,xe,Ae.width,Ae.height,0,Te,me,Ae.data)}}}else{if(z=S.mipmaps,Ne&&We){z.length>0&&Q++;const ee=Ce(Me[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Q,xe,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(ue){Ne?E&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Me[ee].width,Me[ee].height,Te,me,Me[ee].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,xe,Me[ee].width,Me[ee].height,0,Te,me,Me[ee].data);for(let ge=0;ge<z.length;ge++){const Re=z[ge].image[ee].image;Ne?E&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,0,0,Re.width,Re.height,Te,me,Re.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,xe,Re.width,Re.height,0,Te,me,Re.data)}}else{Ne?E&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Te,me,Me[ee]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,xe,Te,me,Me[ee]);for(let ge=0;ge<z.length;ge++){const Ae=z[ge];Ne?E&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,0,0,Te,me,Ae.image[ee]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ge+1,xe,Te,me,Ae.image[ee])}}}p(S)&&m(s.TEXTURE_CUBE_MAP),J.__version=ie.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function k(R,S,X,Z,ie,J){const we=r.convert(X.format,X.colorSpace),le=r.convert(X.type),ce=M(X.internalFormat,we,le,X.colorSpace);if(!n.get(S).__hasExternalTextures){const ue=Math.max(1,S.width>>J),Me=Math.max(1,S.height>>J);ie===s.TEXTURE_3D||ie===s.TEXTURE_2D_ARRAY?t.texImage3D(ie,J,ce,ue,Me,S.depth,0,we,le,null):t.texImage2D(ie,J,ce,ue,Me,0,we,le,null)}t.bindFramebuffer(s.FRAMEBUFFER,R),ye(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Z,ie,n.get(X).__webglTexture,0,fe(S)):(ie===s.TEXTURE_2D||ie>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Z,ie,n.get(X).__webglTexture,J),t.bindFramebuffer(s.FRAMEBUFFER,null)}function te(R,S,X){if(s.bindRenderbuffer(s.RENDERBUFFER,R),S.depthBuffer){const Z=S.depthTexture,ie=Z&&Z.isDepthTexture?Z.type:null,J=_(S.stencilBuffer,ie),we=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,le=fe(S);ye(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,le,J,S.width,S.height):X?s.renderbufferStorageMultisample(s.RENDERBUFFER,le,J,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,J,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,we,s.RENDERBUFFER,R)}else{const Z=S.textures;for(let ie=0;ie<Z.length;ie++){const J=Z[ie],we=r.convert(J.format,J.colorSpace),le=r.convert(J.type),ce=M(J.internalFormat,we,le,J.colorSpace),be=fe(S);X&&ye(S)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,be,ce,S.width,S.height):ye(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,be,ce,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,ce,S.width,S.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function G(R,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),N(S.depthTexture,0);const Z=n.get(S.depthTexture).__webglTexture,ie=fe(S);if(S.depthTexture.format===Di)ye(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Z,0,ie):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Z,0);else if(S.depthTexture.format===Bi)ye(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Z,0,ie):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function ae(R){const S=n.get(R),X=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!S.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");G(S.__webglFramebuffer,R)}else if(X){S.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[Z]),S.__webglDepthbuffer[Z]=s.createRenderbuffer(),te(S.__webglDepthbuffer[Z],R,!1)}else t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=s.createRenderbuffer(),te(S.__webglDepthbuffer,R,!1);t.bindFramebuffer(s.FRAMEBUFFER,null)}function pe(R,S,X){const Z=n.get(R);S!==void 0&&k(Z.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),X!==void 0&&ae(R)}function _e(R){const S=R.texture,X=n.get(R),Z=n.get(S);R.addEventListener("dispose",T);const ie=R.textures,J=R.isWebGLCubeRenderTarget===!0,we=ie.length>1;if(we||(Z.__webglTexture===void 0&&(Z.__webglTexture=s.createTexture()),Z.__version=S.version,o.memory.textures++),J){X.__webglFramebuffer=[];for(let le=0;le<6;le++)if(S.mipmaps&&S.mipmaps.length>0){X.__webglFramebuffer[le]=[];for(let ce=0;ce<S.mipmaps.length;ce++)X.__webglFramebuffer[le][ce]=s.createFramebuffer()}else X.__webglFramebuffer[le]=s.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){X.__webglFramebuffer=[];for(let le=0;le<S.mipmaps.length;le++)X.__webglFramebuffer[le]=s.createFramebuffer()}else X.__webglFramebuffer=s.createFramebuffer();if(we)for(let le=0,ce=ie.length;le<ce;le++){const be=n.get(ie[le]);be.__webglTexture===void 0&&(be.__webglTexture=s.createTexture(),o.memory.textures++)}if(R.samples>0&&ye(R)===!1){X.__webglMultisampledFramebuffer=s.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let le=0;le<ie.length;le++){const ce=ie[le];X.__webglColorRenderbuffer[le]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,X.__webglColorRenderbuffer[le]);const be=r.convert(ce.format,ce.colorSpace),ue=r.convert(ce.type),Me=M(ce.internalFormat,be,ue,ce.colorSpace,R.isXRRenderTarget===!0),ke=fe(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,ke,Me,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+le,s.RENDERBUFFER,X.__webglColorRenderbuffer[le])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(X.__webglDepthRenderbuffer=s.createRenderbuffer(),te(X.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(J){t.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture),F(s.TEXTURE_CUBE_MAP,S);for(let le=0;le<6;le++)if(S.mipmaps&&S.mipmaps.length>0)for(let ce=0;ce<S.mipmaps.length;ce++)k(X.__webglFramebuffer[le][ce],R,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+le,ce);else k(X.__webglFramebuffer[le],R,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);p(S)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let le=0,ce=ie.length;le<ce;le++){const be=ie[le],ue=n.get(be);t.bindTexture(s.TEXTURE_2D,ue.__webglTexture),F(s.TEXTURE_2D,be),k(X.__webglFramebuffer,R,be,s.COLOR_ATTACHMENT0+le,s.TEXTURE_2D,0),p(be)&&m(s.TEXTURE_2D)}t.unbindTexture()}else{let le=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(le=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(le,Z.__webglTexture),F(le,S),S.mipmaps&&S.mipmaps.length>0)for(let ce=0;ce<S.mipmaps.length;ce++)k(X.__webglFramebuffer[ce],R,S,s.COLOR_ATTACHMENT0,le,ce);else k(X.__webglFramebuffer,R,S,s.COLOR_ATTACHMENT0,le,0);p(S)&&m(le),t.unbindTexture()}R.depthBuffer&&ae(R)}function D(R){const S=R.textures;for(let X=0,Z=S.length;X<Z;X++){const ie=S[X];if(p(ie)){const J=R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,we=n.get(ie).__webglTexture;t.bindTexture(J,we),m(J),t.unbindTexture()}}}const he=[],Pe=[];function Le(R){if(R.samples>0){if(ye(R)===!1){const S=R.textures,X=R.width,Z=R.height;let ie=s.COLOR_BUFFER_BIT;const J=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,we=n.get(R),le=S.length>1;if(le)for(let ce=0;ce<S.length;ce++)t.bindFramebuffer(s.FRAMEBUFFER,we.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,we.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let ce=0;ce<S.length;ce++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ie|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ie|=s.STENCIL_BUFFER_BIT)),le){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,we.__webglColorRenderbuffer[ce]);const be=n.get(S[ce]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,be,0)}s.blitFramebuffer(0,0,X,Z,0,0,X,Z,ie,s.NEAREST),l===!0&&(he.length=0,Pe.length=0,he.push(s.COLOR_ATTACHMENT0+ce),R.depthBuffer&&R.resolveDepthBuffer===!1&&(he.push(J),Pe.push(J),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Pe)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,he))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),le)for(let ce=0;ce<S.length;ce++){t.bindFramebuffer(s.FRAMEBUFFER,we.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.RENDERBUFFER,we.__webglColorRenderbuffer[ce]);const be=n.get(S[ce]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,we.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.TEXTURE_2D,be,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const S=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[S])}}}function fe(R){return Math.min(i.maxSamples,R.samples)}function ye(R){const S=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Se(R){const S=o.render.frame;h.get(R)!==S&&(h.set(R,S),R.update())}function de(R,S){const X=R.colorSpace,Z=R.format,ie=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||X!==Gn&&X!==Fn&&(nt.getTransfer(X)===ot?(Z!==cn||ie!==Bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),S}function Ce(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=P,this.resetTextureUnits=U,this.setTexture2D=N,this.setTexture2DArray=W,this.setTexture3D=B,this.setTextureCube=se,this.rebindTextures=pe,this.setupRenderTarget=_e,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=Le,this.setupDepthRenderbuffer=ae,this.setupFrameBufferTexture=k,this.useMultisampledRTT=ye}function r_(s,e){function t(n,i=Fn){let r;const o=nt.getTransfer(i);if(n===Bn)return s.UNSIGNED_BYTE;if(n===rh)return s.UNSIGNED_SHORT_4_4_4_4;if(n===sh)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Pd)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Cd)return s.BYTE;if(n===Rd)return s.SHORT;if(n===xs)return s.UNSIGNED_SHORT;if(n===ih)return s.INT;if(n===Oi)return s.UNSIGNED_INT;if(n===yn)return s.FLOAT;if(n===On)return s.HALF_FLOAT;if(n===Ld)return s.ALPHA;if(n===Ud)return s.RGB;if(n===cn)return s.RGBA;if(n===Dd)return s.LUMINANCE;if(n===Id)return s.LUMINANCE_ALPHA;if(n===Di)return s.DEPTH_COMPONENT;if(n===Bi)return s.DEPTH_STENCIL;if(n===oh)return s.RED;if(n===ah)return s.RED_INTEGER;if(n===Fd)return s.RG;if(n===lh)return s.RG_INTEGER;if(n===ch)return s.RGBA_INTEGER;if(n===js||n===qs||n===Ks||n===Zs)if(o===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===js)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===qs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ks)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Zs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===js)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===qs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ks)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Zs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ha||n===Va||n===Wa||n===Xa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ha)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Va)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Wa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Xa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ya||n===ja||n===qa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ya||n===ja)return o===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===qa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ka||n===Za||n===$a||n===Ja||n===Qa||n===el||n===tl||n===nl||n===il||n===rl||n===sl||n===ol||n===al||n===ll)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ka)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Za)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===$a)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ja)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Qa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===el)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===tl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===nl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===il)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===rl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===sl)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ol)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===al)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ll)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===$s||n===cl||n===hl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===$s)return o===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===cl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===hl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Nd||n===ul||n===dl||n===fl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===$s)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ul)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===dl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===fl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ki?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}class s_ extends qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ts extends yt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const o_={type:"move"};class Mo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ts,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ts,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ts,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,n),m=this._getHandJoint(c,v);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(o_)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new ts;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const a_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,l_=`
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

}`;class c_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new At,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Ft({vertexShader:a_,fragmentShader:l_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Tt(new li(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class h_ extends oi{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const v=new c_,p=t.getContextAttributes();let m=null,M=null;const _=[],y=[],A=new Oe;let T=null;const w=new qt;w.layers.enable(1),w.viewport=new ut;const L=new qt;L.layers.enable(2),L.viewport=new ut;const b=[w,L],x=new s_;x.layers.enable(1),x.layers.enable(2);let U=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let k=_[O];return k===void 0&&(k=new Mo,_[O]=k),k.getTargetRaySpace()},this.getControllerGrip=function(O){let k=_[O];return k===void 0&&(k=new Mo,_[O]=k),k.getGripSpace()},this.getHand=function(O){let k=_[O];return k===void 0&&(k=new Mo,_[O]=k),k.getHandSpace()};function I(O){const k=y.indexOf(O.inputSource);if(k===-1)return;const te=_[k];te!==void 0&&(te.update(O.inputSource,O.frame,c||o),te.dispatchEvent({type:O.type,data:O.inputSource}))}function N(){i.removeEventListener("select",I),i.removeEventListener("selectstart",I),i.removeEventListener("selectend",I),i.removeEventListener("squeeze",I),i.removeEventListener("squeezestart",I),i.removeEventListener("squeezeend",I),i.removeEventListener("end",N),i.removeEventListener("inputsourceschange",W);for(let O=0;O<_.length;O++){const k=y[O];k!==null&&(y[O]=null,_[O].disconnect(k))}U=null,P=null,v.reset(),e.setRenderTarget(m),f=null,d=null,u=null,i=null,M=null,ne.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){r=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){a=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(O){c=O},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(O){if(i=O,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",I),i.addEventListener("selectstart",I),i.addEventListener("selectend",I),i.addEventListener("squeeze",I),i.addEventListener("squeezestart",I),i.addEventListener("squeezeend",I),i.addEventListener("end",N),i.addEventListener("inputsourceschange",W),p.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(A),i.renderState.layers===void 0){const k={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,k),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new tn(f.framebufferWidth,f.framebufferHeight,{format:cn,type:Bn,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let k=null,te=null,G=null;p.depth&&(G=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,k=p.stencil?Bi:Di,te=p.stencil?ki:Oi);const ae={colorFormat:t.RGBA8,depthFormat:G,scaleFactor:r};u=new XRWebGLBinding(i,t),d=u.createProjectionLayer(ae),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new tn(d.textureWidth,d.textureHeight,{format:cn,type:Bn,depthTexture:new Eh(d.textureWidth,d.textureHeight,te,void 0,void 0,void 0,void 0,void 0,void 0,k),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),ne.setContext(i),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function W(O){for(let k=0;k<O.removed.length;k++){const te=O.removed[k],G=y.indexOf(te);G>=0&&(y[G]=null,_[G].disconnect(te))}for(let k=0;k<O.added.length;k++){const te=O.added[k];let G=y.indexOf(te);if(G===-1){for(let pe=0;pe<_.length;pe++)if(pe>=y.length){y.push(te),G=pe;break}else if(y[pe]===null){y[pe]=te,G=pe;break}if(G===-1)break}const ae=_[G];ae&&ae.connect(te)}}const B=new H,se=new H;function j(O,k,te){B.setFromMatrixPosition(k.matrixWorld),se.setFromMatrixPosition(te.matrixWorld);const G=B.distanceTo(se),ae=k.projectionMatrix.elements,pe=te.projectionMatrix.elements,_e=ae[14]/(ae[10]-1),D=ae[14]/(ae[10]+1),he=(ae[9]+1)/ae[5],Pe=(ae[9]-1)/ae[5],Le=(ae[8]-1)/ae[0],fe=(pe[8]+1)/pe[0],ye=_e*Le,Se=_e*fe,de=G/(-Le+fe),Ce=de*-Le;k.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(Ce),O.translateZ(de),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert();const R=_e+de,S=D+de,X=ye-Ce,Z=Se+(G-Ce),ie=he*D/S*R,J=Pe*D/S*R;O.projectionMatrix.makePerspective(X,Z,ie,J,R,S),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}function K(O,k){k===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(k.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(i===null)return;v.texture!==null&&(O.near=v.depthNear,O.far=v.depthFar),x.near=L.near=w.near=O.near,x.far=L.far=w.far=O.far,(U!==x.near||P!==x.far)&&(i.updateRenderState({depthNear:x.near,depthFar:x.far}),U=x.near,P=x.far,w.near=U,w.far=P,L.near=U,L.far=P,w.updateProjectionMatrix(),L.updateProjectionMatrix(),O.updateProjectionMatrix());const k=O.parent,te=x.cameras;K(x,k);for(let G=0;G<te.length;G++)K(te[G],k);te.length===2?j(x,w,L):x.projectionMatrix.copy(w.projectionMatrix),q(O,x,k)};function q(O,k,te){te===null?O.matrix.copy(k.matrixWorld):(O.matrix.copy(te.matrixWorld),O.matrix.invert(),O.matrix.multiply(k.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy(k.projectionMatrix),O.projectionMatrixInverse.copy(k.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=br*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(O){l=O,d!==null&&(d.fixedFoveation=O),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=O)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(x)};let F=null;function V(O,k){if(h=k.getViewerPose(c||o),g=k,h!==null){const te=h.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let G=!1;te.length!==x.cameras.length&&(x.cameras.length=0,G=!0);for(let pe=0;pe<te.length;pe++){const _e=te[pe];let D=null;if(f!==null)D=f.getViewport(_e);else{const Pe=u.getViewSubImage(d,_e);D=Pe.viewport,pe===0&&(e.setRenderTargetTextures(M,Pe.colorTexture,d.ignoreDepthValues?void 0:Pe.depthStencilTexture),e.setRenderTarget(M))}let he=b[pe];he===void 0&&(he=new qt,he.layers.enable(pe),he.viewport=new ut,b[pe]=he),he.matrix.fromArray(_e.transform.matrix),he.matrix.decompose(he.position,he.quaternion,he.scale),he.projectionMatrix.fromArray(_e.projectionMatrix),he.projectionMatrixInverse.copy(he.projectionMatrix).invert(),he.viewport.set(D.x,D.y,D.width,D.height),pe===0&&(x.matrix.copy(he.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),G===!0&&x.cameras.push(he)}const ae=i.enabledFeatures;if(ae&&ae.includes("depth-sensing")){const pe=u.getDepthInformation(te[0]);pe&&pe.isValid&&pe.texture&&v.init(e,pe,i.renderState)}}for(let te=0;te<_.length;te++){const G=y[te],ae=_[te];G!==null&&ae!==void 0&&ae.update(G,k,c||o)}F&&F(O,k),k.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:k}),g=null}const ne=new Mh;ne.setAnimationLoop(V),this.setAnimationLoop=function(O){F=O},this.dispose=function(){}}}const Kn=new hn,u_=new it;function d_(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,yh(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,M,_,y){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(p,m):m.isMeshToonMaterial?(r(p,m),u(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m)):m.isMeshStandardMaterial?(r(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,y)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),v(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,M,_):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Nt&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Nt&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const M=e.get(m),_=M.envMap,y=M.envMapRotation;_&&(p.envMap.value=_,Kn.copy(y),Kn.x*=-1,Kn.y*=-1,Kn.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Kn.y*=-1,Kn.z*=-1),p.envMapRotation.value.setFromMatrix4(u_.makeRotationFromEuler(Kn)),p.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,M,_){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*M,p.scale.value=_*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,M){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Nt&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function v(p,m){const M=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function f_(s,e,t,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,_){const y=_.program;n.uniformBlockBinding(M,y)}function c(M,_){let y=i[M.id];y===void 0&&(g(M),y=h(M),i[M.id]=y,M.addEventListener("dispose",p));const A=_.program;n.updateUBOMapping(M,A);const T=e.render.frame;r[M.id]!==T&&(d(M),r[M.id]=T)}function h(M){const _=u();M.__bindingPointIndex=_;const y=s.createBuffer(),A=M.__size,T=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,A,T),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,_,y),y}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const _=i[M.id],y=M.uniforms,A=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,_);for(let T=0,w=y.length;T<w;T++){const L=Array.isArray(y[T])?y[T]:[y[T]];for(let b=0,x=L.length;b<x;b++){const U=L[b];if(f(U,T,b,A)===!0){const P=U.__offset,I=Array.isArray(U.value)?U.value:[U.value];let N=0;for(let W=0;W<I.length;W++){const B=I[W],se=v(B);typeof B=="number"||typeof B=="boolean"?(U.__data[0]=B,s.bufferSubData(s.UNIFORM_BUFFER,P+N,U.__data)):B.isMatrix3?(U.__data[0]=B.elements[0],U.__data[1]=B.elements[1],U.__data[2]=B.elements[2],U.__data[3]=0,U.__data[4]=B.elements[3],U.__data[5]=B.elements[4],U.__data[6]=B.elements[5],U.__data[7]=0,U.__data[8]=B.elements[6],U.__data[9]=B.elements[7],U.__data[10]=B.elements[8],U.__data[11]=0):(B.toArray(U.__data,N),N+=se.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,P,U.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,_,y,A){const T=M.value,w=_+"_"+y;if(A[w]===void 0)return typeof T=="number"||typeof T=="boolean"?A[w]=T:A[w]=T.clone(),!0;{const L=A[w];if(typeof T=="number"||typeof T=="boolean"){if(L!==T)return A[w]=T,!0}else if(L.equals(T)===!1)return L.copy(T),!0}return!1}function g(M){const _=M.uniforms;let y=0;const A=16;for(let w=0,L=_.length;w<L;w++){const b=Array.isArray(_[w])?_[w]:[_[w]];for(let x=0,U=b.length;x<U;x++){const P=b[x],I=Array.isArray(P.value)?P.value:[P.value];for(let N=0,W=I.length;N<W;N++){const B=I[N],se=v(B),j=y%A;j!==0&&A-j<se.boundary&&(y+=A-j),P.__data=new Float32Array(se.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=y,y+=se.storage}}}const T=y%A;return T>0&&(y+=A-T),M.__size=y,M.__cache={},this}function v(M){const _={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(_.boundary=4,_.storage=4):M.isVector2?(_.boundary=8,_.storage=8):M.isVector3||M.isColor?(_.boundary=16,_.storage=12):M.isVector4?(_.boundary=16,_.storage=16):M.isMatrix3?(_.boundary=48,_.storage=48):M.isMatrix4?(_.boundary=64,_.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),_}function p(M){const _=M.target;_.removeEventListener("dispose",p);const y=o.indexOf(_.__bindingPointIndex);o.splice(y,1),s.deleteBuffer(i[_.id]),delete i[_.id],delete r[_.id]}function m(){for(const M in i)s.deleteBuffer(i[M]);o=[],i={},r={}}return{bind:l,update:c,dispose:m}}class p_{constructor(e={}){const{canvas:t=cf(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const f=new Uint32Array(4),g=new Int32Array(4);let v=null,p=null;const m=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=sn,this.toneMapping=Nn,this.toneMappingExposure=1;const _=this;let y=!1,A=0,T=0,w=null,L=-1,b=null;const x=new ut,U=new ut;let P=null;const I=new Ve(0);let N=0,W=t.width,B=t.height,se=1,j=null,K=null;const q=new ut(0,0,W,B),F=new ut(0,0,W,B);let V=!1;const ne=new sa;let O=!1,k=!1;const te=new it,G=new H,ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pe=!1;function _e(){return w===null?se:1}let D=n;function he(C,Y){return t.getContext(C,Y)}try{const C={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ta}`),t.addEventListener("webglcontextlost",Q,!1),t.addEventListener("webglcontextrestored",z,!1),t.addEventListener("webglcontextcreationerror",ee,!1),D===null){const Y="webgl2";if(D=he(Y,C),D===null)throw he(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let Pe,Le,fe,ye,Se,de,Ce,R,S,X,Z,ie,J,we,le,ce,be,ue,Me,ke,Te,me,xe,Ne;function We(){Pe=new Eg(D),Pe.init(),me=new r_(D,Pe),Le=new _g(D,Pe,e,me),fe=new n_(D),ye=new Ag(D),Se=new Wv,de=new i_(D,Pe,fe,Se,Le,me,ye),Ce=new yg(_),R=new Mg(_),S=new If(D),xe=new gg(D,S),X=new wg(D,S,ye,xe),Z=new Rg(D,X,S,ye),Me=new Cg(D,Le,de),ce=new xg(Se),ie=new Vv(_,Ce,R,Pe,Le,xe,ce),J=new d_(_,Se),we=new Yv,le=new Jv(Pe),ue=new mg(_,Ce,R,fe,Z,d,l),be=new t_(_,Z,Le),Ne=new f_(D,ye,Le,fe),ke=new vg(D,Pe,ye),Te=new Tg(D,Pe,ye),ye.programs=ie.programs,_.capabilities=Le,_.extensions=Pe,_.properties=Se,_.renderLists=we,_.shadowMap=be,_.state=fe,_.info=ye}We();const E=new h_(_,D);this.xr=E,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const C=Pe.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=Pe.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(C){C!==void 0&&(se=C,this.setSize(W,B,!1))},this.getSize=function(C){return C.set(W,B)},this.setSize=function(C,Y,re=!0){if(E.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=C,B=Y,t.width=Math.floor(C*se),t.height=Math.floor(Y*se),re===!0&&(t.style.width=C+"px",t.style.height=Y+"px"),this.setViewport(0,0,C,Y)},this.getDrawingBufferSize=function(C){return C.set(W*se,B*se).floor()},this.setDrawingBufferSize=function(C,Y,re){W=C,B=Y,se=re,t.width=Math.floor(C*re),t.height=Math.floor(Y*re),this.setViewport(0,0,C,Y)},this.getCurrentViewport=function(C){return C.copy(x)},this.getViewport=function(C){return C.copy(q)},this.setViewport=function(C,Y,re,oe){C.isVector4?q.set(C.x,C.y,C.z,C.w):q.set(C,Y,re,oe),fe.viewport(x.copy(q).multiplyScalar(se).round())},this.getScissor=function(C){return C.copy(F)},this.setScissor=function(C,Y,re,oe){C.isVector4?F.set(C.x,C.y,C.z,C.w):F.set(C,Y,re,oe),fe.scissor(U.copy(F).multiplyScalar(se).round())},this.getScissorTest=function(){return V},this.setScissorTest=function(C){fe.setScissorTest(V=C)},this.setOpaqueSort=function(C){j=C},this.setTransparentSort=function(C){K=C},this.getClearColor=function(C){return C.copy(ue.getClearColor())},this.setClearColor=function(){ue.setClearColor.apply(ue,arguments)},this.getClearAlpha=function(){return ue.getClearAlpha()},this.setClearAlpha=function(){ue.setClearAlpha.apply(ue,arguments)},this.clear=function(C=!0,Y=!0,re=!0){let oe=0;if(C){let $=!1;if(w!==null){const Ee=w.texture.format;$=Ee===ch||Ee===lh||Ee===ah}if($){const Ee=w.texture.type,Ie=Ee===Bn||Ee===Oi||Ee===xs||Ee===ki||Ee===rh||Ee===sh,Fe=ue.getClearColor(),Be=ue.getClearAlpha(),ve=Fe.r,Ge=Fe.g,He=Fe.b;Ie?(f[0]=ve,f[1]=Ge,f[2]=He,f[3]=Be,D.clearBufferuiv(D.COLOR,0,f)):(g[0]=ve,g[1]=Ge,g[2]=He,g[3]=Be,D.clearBufferiv(D.COLOR,0,g))}else oe|=D.COLOR_BUFFER_BIT}Y&&(oe|=D.DEPTH_BUFFER_BIT),re&&(oe|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(oe)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Q,!1),t.removeEventListener("webglcontextrestored",z,!1),t.removeEventListener("webglcontextcreationerror",ee,!1),we.dispose(),le.dispose(),Se.dispose(),Ce.dispose(),R.dispose(),Z.dispose(),xe.dispose(),Ne.dispose(),ie.dispose(),E.dispose(),E.removeEventListener("sessionstart",Ye),E.removeEventListener("sessionend",$e),tt.stop()};function Q(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function z(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const C=ye.autoReset,Y=be.enabled,re=be.autoUpdate,oe=be.needsUpdate,$=be.type;We(),ye.autoReset=C,be.enabled=Y,be.autoUpdate=re,be.needsUpdate=oe,be.type=$}function ee(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function ge(C){const Y=C.target;Y.removeEventListener("dispose",ge),Ae(Y)}function Ae(C){Re(C),Se.remove(C)}function Re(C){const Y=Se.get(C).programs;Y!==void 0&&(Y.forEach(function(re){ie.releaseProgram(re)}),C.isShaderMaterial&&ie.releaseShaderCache(C))}this.renderBufferDirect=function(C,Y,re,oe,$,Ee){Y===null&&(Y=ae);const Ie=$.isMesh&&$.matrixWorld.determinant()<0,Fe=un(C,Y,re,oe,$);fe.setMaterial(oe,Ie);let Be=re.index,ve=1;if(oe.wireframe===!0){if(Be=X.getWireframeAttribute(re),Be===void 0)return;ve=2}const Ge=re.drawRange,He=re.attributes.position;let Ze=Ge.start*ve,rt=(Ge.start+Ge.count)*ve;Ee!==null&&(Ze=Math.max(Ze,Ee.start*ve),rt=Math.min(rt,(Ee.start+Ee.count)*ve)),Be!==null?(Ze=Math.max(Ze,0),rt=Math.min(rt,Be.count)):He!=null&&(Ze=Math.max(Ze,0),rt=Math.min(rt,He.count));const st=rt-Ze;if(st<0||st===1/0)return;xe.setup($,oe,Fe,re,Be);let _t,Je=ke;if(Be!==null&&(_t=S.get(Be),Je=Te,Je.setIndex(_t)),$.isMesh)oe.wireframe===!0?(fe.setLineWidth(oe.wireframeLinewidth*_e()),Je.setMode(D.LINES)):Je.setMode(D.TRIANGLES);else if($.isLine){let ze=oe.linewidth;ze===void 0&&(ze=1),fe.setLineWidth(ze*_e()),$.isLineSegments?Je.setMode(D.LINES):$.isLineLoop?Je.setMode(D.LINE_LOOP):Je.setMode(D.LINE_STRIP)}else $.isPoints?Je.setMode(D.POINTS):$.isSprite&&Je.setMode(D.TRIANGLES);if($.isBatchedMesh)$._multiDrawInstances!==null?Je.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances):Je.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else if($.isInstancedMesh)Je.renderInstances(Ze,st,$.count);else if(re.isInstancedBufferGeometry){const ze=re._maxInstanceCount!==void 0?re._maxInstanceCount:1/0,mt=Math.min(re.instanceCount,ze);Je.renderInstances(Ze,st,mt)}else Je.render(Ze,st)};function je(C,Y,re){C.transparent===!0&&C.side===an&&C.forceSinglePass===!1?(C.side=Nt,C.needsUpdate=!0,Ht(C,Y,re),C.side=kn,C.needsUpdate=!0,Ht(C,Y,re),C.side=an):Ht(C,Y,re)}this.compile=function(C,Y,re=null){re===null&&(re=C),p=le.get(re),p.init(Y),M.push(p),re.traverseVisible(function($){$.isLight&&$.layers.test(Y.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),C!==re&&C.traverseVisible(function($){$.isLight&&$.layers.test(Y.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),p.setupLights();const oe=new Set;return C.traverse(function($){const Ee=$.material;if(Ee)if(Array.isArray(Ee))for(let Ie=0;Ie<Ee.length;Ie++){const Fe=Ee[Ie];je(Fe,re,$),oe.add(Fe)}else je(Ee,re,$),oe.add(Ee)}),M.pop(),p=null,oe},this.compileAsync=function(C,Y,re=null){const oe=this.compile(C,Y,re);return new Promise($=>{function Ee(){if(oe.forEach(function(Ie){Se.get(Ie).currentProgram.isReady()&&oe.delete(Ie)}),oe.size===0){$(C);return}setTimeout(Ee,10)}Pe.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let Xe=null;function De(C){Xe&&Xe(C)}function Ye(){tt.stop()}function $e(){tt.start()}const tt=new Mh;tt.setAnimationLoop(De),typeof self<"u"&&tt.setContext(self),this.setAnimationLoop=function(C){Xe=C,E.setAnimationLoop(C),C===null?tt.stop():tt.start()},E.addEventListener("sessionstart",Ye),E.addEventListener("sessionend",$e),this.render=function(C,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),E.enabled===!0&&E.isPresenting===!0&&(E.cameraAutoUpdate===!0&&E.updateCamera(Y),Y=E.getCamera()),C.isScene===!0&&C.onBeforeRender(_,C,Y,w),p=le.get(C,M.length),p.init(Y),M.push(p),te.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),ne.setFromProjectionMatrix(te),k=this.localClippingEnabled,O=ce.init(this.clippingPlanes,k),v=we.get(C,m.length),v.init(),m.push(v),E.enabled===!0&&E.isPresenting===!0){const Ee=_.xr.getDepthSensingMesh();Ee!==null&&Qe(Ee,Y,-1/0,_.sortObjects)}Qe(C,Y,0,_.sortObjects),v.finish(),_.sortObjects===!0&&v.sort(j,K),pe=E.enabled===!1||E.isPresenting===!1||E.hasDepthSensing()===!1,pe&&ue.addToRenderList(v,C),this.info.render.frame++,O===!0&&ce.beginShadows();const re=p.state.shadowsArray;be.render(re,C,Y),O===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const oe=v.opaque,$=v.transmissive;if(p.setupLights(),Y.isArrayCamera){const Ee=Y.cameras;if($.length>0)for(let Ie=0,Fe=Ee.length;Ie<Fe;Ie++){const Be=Ee[Ie];bt(oe,$,C,Be)}pe&&ue.render(C);for(let Ie=0,Fe=Ee.length;Ie<Fe;Ie++){const Be=Ee[Ie];ct(v,C,Be,Be.viewport)}}else $.length>0&&bt(oe,$,C,Y),pe&&ue.render(C),ct(v,C,Y);w!==null&&(de.updateMultisampleRenderTarget(w),de.updateRenderTargetMipmap(w)),C.isScene===!0&&C.onAfterRender(_,C,Y),xe.resetDefaultState(),L=-1,b=null,M.pop(),M.length>0?(p=M[M.length-1],O===!0&&ce.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,m.pop(),m.length>0?v=m[m.length-1]:v=null};function Qe(C,Y,re,oe){if(C.visible===!1)return;if(C.layers.test(Y.layers)){if(C.isGroup)re=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(Y);else if(C.isLight)p.pushLight(C),C.castShadow&&p.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||ne.intersectsSprite(C)){oe&&G.setFromMatrixPosition(C.matrixWorld).applyMatrix4(te);const Ie=Z.update(C),Fe=C.material;Fe.visible&&v.push(C,Ie,Fe,re,G.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||ne.intersectsObject(C))){const Ie=Z.update(C),Fe=C.material;if(oe&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),G.copy(C.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),G.copy(Ie.boundingSphere.center)),G.applyMatrix4(C.matrixWorld).applyMatrix4(te)),Array.isArray(Fe)){const Be=Ie.groups;for(let ve=0,Ge=Be.length;ve<Ge;ve++){const He=Be[ve],Ze=Fe[He.materialIndex];Ze&&Ze.visible&&v.push(C,Ie,Ze,re,G.z,He)}}else Fe.visible&&v.push(C,Ie,Fe,re,G.z,null)}}const Ee=C.children;for(let Ie=0,Fe=Ee.length;Ie<Fe;Ie++)Qe(Ee[Ie],Y,re,oe)}function ct(C,Y,re,oe){const $=C.opaque,Ee=C.transmissive,Ie=C.transparent;p.setupLightsView(re),O===!0&&ce.setGlobalState(_.clippingPlanes,re),oe&&fe.viewport(x.copy(oe)),$.length>0&&vt($,Y,re),Ee.length>0&&vt(Ee,Y,re),Ie.length>0&&vt(Ie,Y,re),fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1)}function bt(C,Y,re,oe){if((re.isScene===!0?re.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[oe.id]===void 0&&(p.state.transmissionRenderTarget[oe.id]=new tn(1,1,{generateMipmaps:!0,type:Pe.has("EXT_color_buffer_half_float")||Pe.has("EXT_color_buffer_float")?On:Bn,minFilter:ii,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace}));const Ee=p.state.transmissionRenderTarget[oe.id],Ie=oe.viewport||x;Ee.setSize(Ie.z,Ie.w);const Fe=_.getRenderTarget();_.setRenderTarget(Ee),_.getClearColor(I),N=_.getClearAlpha(),N<1&&_.setClearColor(16777215,.5),pe?ue.render(re):_.clear();const Be=_.toneMapping;_.toneMapping=Nn;const ve=oe.viewport;if(oe.viewport!==void 0&&(oe.viewport=void 0),p.setupLightsView(oe),O===!0&&ce.setGlobalState(_.clippingPlanes,oe),vt(C,re,oe),de.updateMultisampleRenderTarget(Ee),de.updateRenderTargetMipmap(Ee),Pe.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let He=0,Ze=Y.length;He<Ze;He++){const rt=Y[He],st=rt.object,_t=rt.geometry,Je=rt.material,ze=rt.group;if(Je.side===an&&st.layers.test(oe.layers)){const mt=Je.side;Je.side=Nt,Je.needsUpdate=!0,Kt(st,re,oe,_t,Je,ze),Je.side=mt,Je.needsUpdate=!0,Ge=!0}}Ge===!0&&(de.updateMultisampleRenderTarget(Ee),de.updateRenderTargetMipmap(Ee))}_.setRenderTarget(Fe),_.setClearColor(I,N),ve!==void 0&&(oe.viewport=ve),_.toneMapping=Be}function vt(C,Y,re){const oe=Y.isScene===!0?Y.overrideMaterial:null;for(let $=0,Ee=C.length;$<Ee;$++){const Ie=C[$],Fe=Ie.object,Be=Ie.geometry,ve=oe===null?Ie.material:oe,Ge=Ie.group;Fe.layers.test(re.layers)&&Kt(Fe,Y,re,Be,ve,Ge)}}function Kt(C,Y,re,oe,$,Ee){C.onBeforeRender(_,Y,re,oe,$,Ee),C.modelViewMatrix.multiplyMatrices(re.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),$.onBeforeRender(_,Y,re,oe,C,Ee),$.transparent===!0&&$.side===an&&$.forceSinglePass===!1?($.side=Nt,$.needsUpdate=!0,_.renderBufferDirect(re,Y,oe,$,C,Ee),$.side=kn,$.needsUpdate=!0,_.renderBufferDirect(re,Y,oe,$,C,Ee),$.side=an):_.renderBufferDirect(re,Y,oe,$,C,Ee),C.onAfterRender(_,Y,re,oe,$,Ee)}function Ht(C,Y,re){Y.isScene!==!0&&(Y=ae);const oe=Se.get(C),$=p.state.lights,Ee=p.state.shadowsArray,Ie=$.state.version,Fe=ie.getParameters(C,$.state,Ee,Y,re),Be=ie.getProgramCacheKey(Fe);let ve=oe.programs;oe.environment=C.isMeshStandardMaterial?Y.environment:null,oe.fog=Y.fog,oe.envMap=(C.isMeshStandardMaterial?R:Ce).get(C.envMap||oe.environment),oe.envMapRotation=oe.environment!==null&&C.envMap===null?Y.environmentRotation:C.envMapRotation,ve===void 0&&(C.addEventListener("dispose",ge),ve=new Map,oe.programs=ve);let Ge=ve.get(Be);if(Ge!==void 0){if(oe.currentProgram===Ge&&oe.lightsStateVersion===Ie)return pt(C,Fe),Ge}else Fe.uniforms=ie.getUniforms(C),C.onBuild(re,Fe,_),C.onBeforeCompile(Fe,_),Ge=ie.acquireProgram(Fe,Be),ve.set(Be,Ge),oe.uniforms=Fe.uniforms;const He=oe.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(He.clippingPlanes=ce.uniform),pt(C,Fe),oe.needsLights=qi(C),oe.lightsStateVersion=Ie,oe.needsLights&&(He.ambientLightColor.value=$.state.ambient,He.lightProbe.value=$.state.probe,He.directionalLights.value=$.state.directional,He.directionalLightShadows.value=$.state.directionalShadow,He.spotLights.value=$.state.spot,He.spotLightShadows.value=$.state.spotShadow,He.rectAreaLights.value=$.state.rectArea,He.ltc_1.value=$.state.rectAreaLTC1,He.ltc_2.value=$.state.rectAreaLTC2,He.pointLights.value=$.state.point,He.pointLightShadows.value=$.state.pointShadow,He.hemisphereLights.value=$.state.hemi,He.directionalShadowMap.value=$.state.directionalShadowMap,He.directionalShadowMatrix.value=$.state.directionalShadowMatrix,He.spotShadowMap.value=$.state.spotShadowMap,He.spotLightMatrix.value=$.state.spotLightMatrix,He.spotLightMap.value=$.state.spotLightMap,He.pointShadowMap.value=$.state.pointShadowMap,He.pointShadowMatrix.value=$.state.pointShadowMatrix),oe.currentProgram=Ge,oe.uniformsList=null,Ge}function Vt(C){if(C.uniformsList===null){const Y=C.currentProgram.getUniforms();C.uniformsList=fs.seqWithValue(Y.seq,C.uniforms)}return C.uniformsList}function pt(C,Y){const re=Se.get(C);re.outputColorSpace=Y.outputColorSpace,re.batching=Y.batching,re.batchingColor=Y.batchingColor,re.instancing=Y.instancing,re.instancingColor=Y.instancingColor,re.instancingMorph=Y.instancingMorph,re.skinning=Y.skinning,re.morphTargets=Y.morphTargets,re.morphNormals=Y.morphNormals,re.morphColors=Y.morphColors,re.morphTargetsCount=Y.morphTargetsCount,re.numClippingPlanes=Y.numClippingPlanes,re.numIntersection=Y.numClipIntersection,re.vertexAlphas=Y.vertexAlphas,re.vertexTangents=Y.vertexTangents,re.toneMapping=Y.toneMapping}function un(C,Y,re,oe,$){Y.isScene!==!0&&(Y=ae),de.resetTextureUnits();const Ee=Y.fog,Ie=oe.isMeshStandardMaterial?Y.environment:null,Fe=w===null?_.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:Gn,Be=(oe.isMeshStandardMaterial?R:Ce).get(oe.envMap||Ie),ve=oe.vertexColors===!0&&!!re.attributes.color&&re.attributes.color.itemSize===4,Ge=!!re.attributes.tangent&&(!!oe.normalMap||oe.anisotropy>0),He=!!re.morphAttributes.position,Ze=!!re.morphAttributes.normal,rt=!!re.morphAttributes.color;let st=Nn;oe.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(st=_.toneMapping);const _t=re.morphAttributes.position||re.morphAttributes.normal||re.morphAttributes.color,Je=_t!==void 0?_t.length:0,ze=Se.get(oe),mt=p.state.lights;if(O===!0&&(k===!0||C!==b)){const St=C===b&&oe.id===L;ce.setState(oe,C,St)}let et=!1;oe.version===ze.__version?(ze.needsLights&&ze.lightsStateVersion!==mt.state.version||ze.outputColorSpace!==Fe||$.isBatchedMesh&&ze.batching===!1||!$.isBatchedMesh&&ze.batching===!0||$.isBatchedMesh&&ze.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&ze.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&ze.instancing===!1||!$.isInstancedMesh&&ze.instancing===!0||$.isSkinnedMesh&&ze.skinning===!1||!$.isSkinnedMesh&&ze.skinning===!0||$.isInstancedMesh&&ze.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&ze.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&ze.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&ze.instancingMorph===!1&&$.morphTexture!==null||ze.envMap!==Be||oe.fog===!0&&ze.fog!==Ee||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==ce.numPlanes||ze.numIntersection!==ce.numIntersection)||ze.vertexAlphas!==ve||ze.vertexTangents!==Ge||ze.morphTargets!==He||ze.morphNormals!==Ze||ze.morphColors!==rt||ze.toneMapping!==st||ze.morphTargetsCount!==Je)&&(et=!0):(et=!0,ze.__version=oe.version);let Wt=ze.currentProgram;et===!0&&(Wt=Ht(oe,Y,$));let En=!1,nn=!1,dn=!1;const at=Wt.getUniforms(),Ct=ze.uniforms;if(fe.useProgram(Wt.program)&&(En=!0,nn=!0,dn=!0),oe.id!==L&&(L=oe.id,nn=!0),En||b!==C){at.setValue(D,"projectionMatrix",C.projectionMatrix),at.setValue(D,"viewMatrix",C.matrixWorldInverse);const St=at.map.cameraPosition;St!==void 0&&St.setValue(D,G.setFromMatrixPosition(C.matrixWorld)),Le.logarithmicDepthBuffer&&at.setValue(D,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(oe.isMeshPhongMaterial||oe.isMeshToonMaterial||oe.isMeshLambertMaterial||oe.isMeshBasicMaterial||oe.isMeshStandardMaterial||oe.isShaderMaterial)&&at.setValue(D,"isOrthographic",C.isOrthographicCamera===!0),b!==C&&(b=C,nn=!0,dn=!0)}if($.isSkinnedMesh){at.setOptional(D,$,"bindMatrix"),at.setOptional(D,$,"bindMatrixInverse");const St=$.skeleton;St&&(St.boneTexture===null&&St.computeBoneTexture(),at.setValue(D,"boneTexture",St.boneTexture,de))}$.isBatchedMesh&&(at.setOptional(D,$,"batchingTexture"),at.setValue(D,"batchingTexture",$._matricesTexture,de),at.setOptional(D,$,"batchingColorTexture"),$._colorsTexture!==null&&at.setValue(D,"batchingColorTexture",$._colorsTexture,de));const Hn=re.morphAttributes;if((Hn.position!==void 0||Hn.normal!==void 0||Hn.color!==void 0)&&Me.update($,re,Wt),(nn||ze.receiveShadow!==$.receiveShadow)&&(ze.receiveShadow=$.receiveShadow,at.setValue(D,"receiveShadow",$.receiveShadow)),oe.isMeshGouraudMaterial&&oe.envMap!==null&&(Ct.envMap.value=Be,Ct.flipEnvMap.value=Be.isCubeTexture&&Be.isRenderTargetTexture===!1?-1:1),oe.isMeshStandardMaterial&&oe.envMap===null&&Y.environment!==null&&(Ct.envMapIntensity.value=Y.environmentIntensity),nn&&(at.setValue(D,"toneMappingExposure",_.toneMappingExposure),ze.needsLights&&Er(Ct,dn),Ee&&oe.fog===!0&&J.refreshFogUniforms(Ct,Ee),J.refreshMaterialUniforms(Ct,oe,se,B,p.state.transmissionRenderTarget[C.id]),fs.upload(D,Vt(ze),Ct,de)),oe.isShaderMaterial&&oe.uniformsNeedUpdate===!0&&(fs.upload(D,Vt(ze),Ct,de),oe.uniformsNeedUpdate=!1),oe.isSpriteMaterial&&at.setValue(D,"center",$.center),at.setValue(D,"modelViewMatrix",$.modelViewMatrix),at.setValue(D,"normalMatrix",$.normalMatrix),at.setValue(D,"modelMatrix",$.matrixWorld),oe.isShaderMaterial||oe.isRawShaderMaterial){const St=oe.uniformsGroups;for(let Vn=0,Xt=St.length;Vn<Xt;Vn++){const wr=St[Vn];Ne.update(wr,Wt),Ne.bind(wr,Wt)}}return Wt}function Er(C,Y){C.ambientLightColor.needsUpdate=Y,C.lightProbe.needsUpdate=Y,C.directionalLights.needsUpdate=Y,C.directionalLightShadows.needsUpdate=Y,C.pointLights.needsUpdate=Y,C.pointLightShadows.needsUpdate=Y,C.spotLights.needsUpdate=Y,C.spotLightShadows.needsUpdate=Y,C.rectAreaLights.needsUpdate=Y,C.hemisphereLights.needsUpdate=Y}function qi(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(C,Y,re){Se.get(C.texture).__webglTexture=Y,Se.get(C.depthTexture).__webglTexture=re;const oe=Se.get(C);oe.__hasExternalTextures=!0,oe.__autoAllocateDepthBuffer=re===void 0,oe.__autoAllocateDepthBuffer||Pe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),oe.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(C,Y){const re=Se.get(C);re.__webglFramebuffer=Y,re.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(C,Y=0,re=0){w=C,A=Y,T=re;let oe=!0,$=null,Ee=!1,Ie=!1;if(C){const Be=Se.get(C);Be.__useDefaultFramebuffer!==void 0?(fe.bindFramebuffer(D.FRAMEBUFFER,null),oe=!1):Be.__webglFramebuffer===void 0?de.setupRenderTarget(C):Be.__hasExternalTextures&&de.rebindTextures(C,Se.get(C.texture).__webglTexture,Se.get(C.depthTexture).__webglTexture);const ve=C.texture;(ve.isData3DTexture||ve.isDataArrayTexture||ve.isCompressedArrayTexture)&&(Ie=!0);const Ge=Se.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Ge[Y])?$=Ge[Y][re]:$=Ge[Y],Ee=!0):C.samples>0&&de.useMultisampledRTT(C)===!1?$=Se.get(C).__webglMultisampledFramebuffer:Array.isArray(Ge)?$=Ge[re]:$=Ge,x.copy(C.viewport),U.copy(C.scissor),P=C.scissorTest}else x.copy(q).multiplyScalar(se).floor(),U.copy(F).multiplyScalar(se).floor(),P=V;if(fe.bindFramebuffer(D.FRAMEBUFFER,$)&&oe&&fe.drawBuffers(C,$),fe.viewport(x),fe.scissor(U),fe.setScissorTest(P),Ee){const Be=Se.get(C.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Be.__webglTexture,re)}else if(Ie){const Be=Se.get(C.texture),ve=Y||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Be.__webglTexture,re||0,ve)}L=-1},this.readRenderTargetPixels=function(C,Y,re,oe,$,Ee,Ie){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Fe=Se.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ie!==void 0&&(Fe=Fe[Ie]),Fe){fe.bindFramebuffer(D.FRAMEBUFFER,Fe);try{const Be=C.texture,ve=Be.format,Ge=Be.type;if(!Le.textureFormatReadable(ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Le.textureTypeReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=C.width-oe&&re>=0&&re<=C.height-$&&D.readPixels(Y,re,oe,$,me.convert(ve),me.convert(Ge),Ee)}finally{const Be=w!==null?Se.get(w).__webglFramebuffer:null;fe.bindFramebuffer(D.FRAMEBUFFER,Be)}}},this.readRenderTargetPixelsAsync=async function(C,Y,re,oe,$,Ee,Ie){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Fe=Se.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ie!==void 0&&(Fe=Fe[Ie]),Fe){fe.bindFramebuffer(D.FRAMEBUFFER,Fe);try{const Be=C.texture,ve=Be.format,Ge=Be.type;if(!Le.textureFormatReadable(ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Le.textureTypeReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Y>=0&&Y<=C.width-oe&&re>=0&&re<=C.height-$){const He=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,He),D.bufferData(D.PIXEL_PACK_BUFFER,Ee.byteLength,D.STREAM_READ),D.readPixels(Y,re,oe,$,me.convert(ve),me.convert(Ge),0),D.flush();const Ze=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);await hf(D,Ze,4);try{D.bindBuffer(D.PIXEL_PACK_BUFFER,He),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,Ee)}finally{D.deleteBuffer(He),D.deleteSync(Ze)}return Ee}}finally{const Be=w!==null?Se.get(w).__webglFramebuffer:null;fe.bindFramebuffer(D.FRAMEBUFFER,Be)}}},this.copyFramebufferToTexture=function(C,Y=null,re=0){C.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Y=arguments[0]||null,C=arguments[1]);const oe=Math.pow(2,-re),$=Math.floor(C.image.width*oe),Ee=Math.floor(C.image.height*oe),Ie=Y!==null?Y.x:0,Fe=Y!==null?Y.y:0;de.setTexture2D(C,0),D.copyTexSubImage2D(D.TEXTURE_2D,re,0,0,Ie,Fe,$,Ee),fe.unbindTexture()},this.copyTextureToTexture=function(C,Y,re=null,oe=null,$=0){C.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),oe=arguments[0]||null,C=arguments[1],Y=arguments[2],$=arguments[3]||0,re=null);let Ee,Ie,Fe,Be,ve,Ge;re!==null?(Ee=re.max.x-re.min.x,Ie=re.max.y-re.min.y,Fe=re.min.x,Be=re.min.y):(Ee=C.image.width,Ie=C.image.height,Fe=0,Be=0),oe!==null?(ve=oe.x,Ge=oe.y):(ve=0,Ge=0);const He=me.convert(Y.format),Ze=me.convert(Y.type);de.setTexture2D(Y,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,Y.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,Y.unpackAlignment);const rt=D.getParameter(D.UNPACK_ROW_LENGTH),st=D.getParameter(D.UNPACK_IMAGE_HEIGHT),_t=D.getParameter(D.UNPACK_SKIP_PIXELS),Je=D.getParameter(D.UNPACK_SKIP_ROWS),ze=D.getParameter(D.UNPACK_SKIP_IMAGES),mt=C.isCompressedTexture?C.mipmaps[$]:C.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,mt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,mt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Fe),D.pixelStorei(D.UNPACK_SKIP_ROWS,Be),C.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,$,ve,Ge,Ee,Ie,He,Ze,mt.data):C.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,$,ve,Ge,mt.width,mt.height,He,mt.data):D.texSubImage2D(D.TEXTURE_2D,$,ve,Ge,He,Ze,mt),D.pixelStorei(D.UNPACK_ROW_LENGTH,rt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,st),D.pixelStorei(D.UNPACK_SKIP_PIXELS,_t),D.pixelStorei(D.UNPACK_SKIP_ROWS,Je),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ze),$===0&&Y.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),fe.unbindTexture()},this.copyTextureToTexture3D=function(C,Y,re=null,oe=null,$=0){C.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),re=arguments[0]||null,oe=arguments[1]||null,C=arguments[2],Y=arguments[3],$=arguments[4]||0);let Ee,Ie,Fe,Be,ve,Ge,He,Ze,rt;const st=C.isCompressedTexture?C.mipmaps[$]:C.image;re!==null?(Ee=re.max.x-re.min.x,Ie=re.max.y-re.min.y,Fe=re.max.z-re.min.z,Be=re.min.x,ve=re.min.y,Ge=re.min.z):(Ee=st.width,Ie=st.height,Fe=st.depth,Be=0,ve=0,Ge=0),oe!==null?(He=oe.x,Ze=oe.y,rt=oe.z):(He=0,Ze=0,rt=0);const _t=me.convert(Y.format),Je=me.convert(Y.type);let ze;if(Y.isData3DTexture)de.setTexture3D(Y,0),ze=D.TEXTURE_3D;else if(Y.isDataArrayTexture||Y.isCompressedArrayTexture)de.setTexture2DArray(Y,0),ze=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,Y.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,Y.unpackAlignment);const mt=D.getParameter(D.UNPACK_ROW_LENGTH),et=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Wt=D.getParameter(D.UNPACK_SKIP_PIXELS),En=D.getParameter(D.UNPACK_SKIP_ROWS),nn=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,st.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,st.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Be),D.pixelStorei(D.UNPACK_SKIP_ROWS,ve),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ge),C.isDataTexture||C.isData3DTexture?D.texSubImage3D(ze,$,He,Ze,rt,Ee,Ie,Fe,_t,Je,st.data):Y.isCompressedArrayTexture?D.compressedTexSubImage3D(ze,$,He,Ze,rt,Ee,Ie,Fe,_t,st.data):D.texSubImage3D(ze,$,He,Ze,rt,Ee,Ie,Fe,_t,Je,st),D.pixelStorei(D.UNPACK_ROW_LENGTH,mt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,et),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Wt),D.pixelStorei(D.UNPACK_SKIP_ROWS,En),D.pixelStorei(D.UNPACK_SKIP_IMAGES,nn),$===0&&Y.generateMipmaps&&D.generateMipmap(ze),fe.unbindTexture()},this.initRenderTarget=function(C){Se.get(C).__webglFramebuffer===void 0&&de.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?de.setTextureCube(C,0):C.isData3DTexture?de.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?de.setTexture2DArray(C,0):de.setTexture2D(C,0),fe.unbindTexture()},this.resetState=function(){A=0,T=0,w=null,fe.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===na?"display-p3":"srgb",t.unpackColorSpace=nt.workingColorSpace===Rs?"display-p3":"srgb"}}class m_ extends yt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hn,this.environmentIntensity=1,this.environmentRotation=new hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class g_ extends At{constructor(e=null,t=1,n=1,i,r,o,a,l,c=It,h=It,u,d){super(null,o,a,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Go extends Gt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ci=new it,sc=new it,ns=[],oc=new Mn,v_=new it,lr=new Tt,cr=new ai;class Uh extends Tt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Go(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,v_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Mn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ci),oc.copy(e.boundingBox).applyMatrix4(Ci),this.boundingBox.union(oc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ai),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ci),cr.copy(e.boundingSphere).applyMatrix4(Ci),this.boundingSphere.union(cr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(lr.geometry=this.geometry,lr.material=this.material,lr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),cr.copy(this.boundingSphere),cr.applyMatrix4(n),e.ray.intersectsSphere(cr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ci),sc.multiplyMatrices(n,Ci),lr.matrixWorld=sc,lr.raycast(e,ns);for(let o=0,a=ns.length;o<a;o++){const l=ns[o];l.instanceId=r,l.object=this,t.push(l)}ns.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Go(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new g_(new Float32Array(i*this.count),i,this.count,oh,yn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Dh extends Vi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ve(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ws=new H,Ts=new H,ac=new it,hr=new Ps,is=new ai,Eo=new H,lc=new H;class __ extends yt{constructor(e=new Lt,t=new Dh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)ws.fromBufferAttribute(t,i-1),Ts.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=ws.distanceTo(Ts);e.setAttribute("lineDistance",new lt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),is.copy(n.boundingSphere),is.applyMatrix4(i),is.radius+=r,e.ray.intersectsSphere(is)===!1)return;ac.copy(i).invert(),hr.copy(e.ray).applyMatrix4(ac);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let v=f,p=g-1;v<p;v+=c){const m=h.getX(v),M=h.getX(v+1),_=rs(this,e,hr,l,m,M);_&&t.push(_)}if(this.isLineLoop){const v=h.getX(g-1),p=h.getX(f),m=rs(this,e,hr,l,v,p);m&&t.push(m)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let v=f,p=g-1;v<p;v+=c){const m=rs(this,e,hr,l,v,v+1);m&&t.push(m)}if(this.isLineLoop){const v=rs(this,e,hr,l,g-1,f);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function rs(s,e,t,n,i,r){const o=s.geometry.attributes.position;if(ws.fromBufferAttribute(o,i),Ts.fromBufferAttribute(o,r),t.distanceSqToSegment(ws,Ts,Eo,lc)>n)return;Eo.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(Eo);if(!(l<e.near||l>e.far))return{distance:l,point:lc.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,object:s}}const cc=new H,hc=new H;class x_ extends __{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)cc.fromBufferAttribute(t,i),hc.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+cc.distanceTo(hc);e.setAttribute("lineDistance",new lt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Us extends Lt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new lt(r,3)),this.setAttribute("normal",new lt(r.slice(),3)),this.setAttribute("uv",new lt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(M){const _=new H,y=new H,A=new H;for(let T=0;T<t.length;T+=3)f(t[T+0],_),f(t[T+1],y),f(t[T+2],A),l(_,y,A,M)}function l(M,_,y,A){const T=A+1,w=[];for(let L=0;L<=T;L++){w[L]=[];const b=M.clone().lerp(y,L/T),x=_.clone().lerp(y,L/T),U=T-L;for(let P=0;P<=U;P++)P===0&&L===T?w[L][P]=b:w[L][P]=b.clone().lerp(x,P/U)}for(let L=0;L<T;L++)for(let b=0;b<2*(T-L)-1;b++){const x=Math.floor(b/2);b%2===0?(d(w[L][x+1]),d(w[L+1][x]),d(w[L][x])):(d(w[L][x+1]),d(w[L+1][x+1]),d(w[L+1][x]))}}function c(M){const _=new H;for(let y=0;y<r.length;y+=3)_.x=r[y+0],_.y=r[y+1],_.z=r[y+2],_.normalize().multiplyScalar(M),r[y+0]=_.x,r[y+1]=_.y,r[y+2]=_.z}function h(){const M=new H;for(let _=0;_<r.length;_+=3){M.x=r[_+0],M.y=r[_+1],M.z=r[_+2];const y=p(M)/2/Math.PI+.5,A=m(M)/Math.PI+.5;o.push(y,1-A)}g(),u()}function u(){for(let M=0;M<o.length;M+=6){const _=o[M+0],y=o[M+2],A=o[M+4],T=Math.max(_,y,A),w=Math.min(_,y,A);T>.9&&w<.1&&(_<.2&&(o[M+0]+=1),y<.2&&(o[M+2]+=1),A<.2&&(o[M+4]+=1))}}function d(M){r.push(M.x,M.y,M.z)}function f(M,_){const y=M*3;_.x=e[y+0],_.y=e[y+1],_.z=e[y+2]}function g(){const M=new H,_=new H,y=new H,A=new H,T=new Oe,w=new Oe,L=new Oe;for(let b=0,x=0;b<r.length;b+=9,x+=6){M.set(r[b+0],r[b+1],r[b+2]),_.set(r[b+3],r[b+4],r[b+5]),y.set(r[b+6],r[b+7],r[b+8]),T.set(o[x+0],o[x+1]),w.set(o[x+2],o[x+3]),L.set(o[x+4],o[x+5]),A.copy(M).add(_).add(y).divideScalar(3);const U=p(A);v(T,x+0,M,U),v(w,x+2,_,U),v(L,x+4,y,U)}}function v(M,_,y,A){A<0&&M.x===1&&(o[_]=M.x-1),y.x===0&&y.z===0&&(o[_]=A/2/Math.PI+.5)}function p(M){return Math.atan2(M.z,-M.x)}function m(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Us(e.vertices,e.indices,e.radius,e.details)}}class aa extends Us{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new aa(e.radius,e.detail)}}class Ds extends Lt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new H,d=new H,f=[],g=[],v=[],p=[];for(let m=0;m<=n;m++){const M=[],_=m/n;let y=0;m===0&&o===0?y=.5/t:m===n&&l===Math.PI&&(y=-.5/t);for(let A=0;A<=t;A++){const T=A/t;u.x=-e*Math.cos(i+T*r)*Math.sin(o+_*a),u.y=e*Math.cos(o+_*a),u.z=e*Math.sin(i+T*r)*Math.sin(o+_*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),p.push(T+y,1-_),M.push(c++)}h.push(M)}for(let m=0;m<n;m++)for(let M=0;M<t;M++){const _=h[m][M+1],y=h[m][M],A=h[m+1][M],T=h[m+1][M+1];(m!==0||o>0)&&f.push(_,y,T),(m!==n-1||l<Math.PI)&&f.push(y,A,T)}this.setIndex(f),this.setAttribute("position",new lt(g,3)),this.setAttribute("normal",new lt(v,3)),this.setAttribute("uv",new lt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ds(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class la extends Us{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new la(e.radius,e.detail)}}class y_ extends Vi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ve(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=uh,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ih extends yt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ve(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const wo=new it,uc=new H,dc=new H;class b_{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Oe(512,512),this.map=null,this.mapPass=null,this.matrix=new it,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new sa,this._frameExtents=new Oe(1,1),this._viewportCount=1,this._viewports=[new ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;uc.setFromMatrixPosition(e.matrixWorld),t.position.copy(uc),dc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(dc),t.updateMatrixWorld(),wo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(wo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class S_ extends b_{constructor(){super(new Xi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class M_ extends Ih{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(yt.DEFAULT_UP),this.updateMatrix(),this.target=new yt,this.shadow=new S_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class E_ extends Ih{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class w_ extends Lt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class Fh{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=fc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=fc();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function fc(){return(typeof performance>"u"?Date:performance).now()}const pc=new it;class T_{constructor(e,t,n=0,i=1/0){this.ray=new Ps(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new ra,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return pc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(pc),this}intersectObject(e,t=!0,n=[]){return Ho(e,this,n,t),n.sort(mc),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Ho(e[i],this,n,t);return n.sort(mc),n}}function mc(s,e){return s.distance-e.distance}function Ho(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let o=0,a=r.length;o<a;o++)Ho(r[o],e,t,!0)}}class Vo{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(wt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ta}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ta);function A_(){const s=document.activeElement;if(!s)return!1;const e=s.tagName;return e==="INPUT"||e==="TEXTAREA"||e==="SELECT"||s.isContentEditable}const ss=.06,os=.92,ur=40,gc=.05,C_=.08;class R_{constructor(e,t,{is2d:n=!1,target:i=window,hasFocus:r=()=>!0,onCenter:o=null}={}){this._spherical=new Vo,this._offset=new H,this._right=new H,this._up=new H,this._delta=new H,this.hasFocus=r,this.onCenter=o,this.setCameraControls(e,t,n),i.addEventListener("keydown",a=>{A_()||this.hasFocus()&&this.handleKey(a.code,a.shiftKey)&&a.preventDefault()})}setCameraControls(e,t,n=!1){this.camera=e,this.controls=t,this.is2d=n,this.home={position:e.position.clone(),target:t.target.clone(),zoom:e.zoom}}handleKey(e,t=!1){if(t)switch(e){case"KeyW":return this._panView(0,1),!0;case"KeyS":return this._panView(0,-1),!0;case"KeyA":return this._panView(-1,0),!0;case"KeyD":return this._panView(1,0),!0}if(this.is2d)switch(e){case"KeyW":return this._pan(0,ur),!0;case"KeyS":return this._pan(0,-ur),!0;case"KeyA":return this._pan(-ur,0),!0;case"KeyD":return this._pan(ur,0),!0;case"KeyQ":return this._zoom(os),!0;case"KeyE":return this._zoom(1/os),!0;case"Space":return this.center(),!0;case"KeyR":return this.reset(),!0;default:return!1}switch(e){case"KeyW":return this._orbit(0,-ss),!0;case"KeyS":return this._orbit(0,ss),!0;case"KeyA":return this._orbit(ss,0),!0;case"KeyD":return this._orbit(-ss,0),!0;case"KeyQ":return this._zoom(os),!0;case"KeyE":return this._zoom(1/os),!0;case"Space":return this.center(),!0;case"KeyR":return this.reset(),!0;default:return!1}}center(){this.onCenter&&this.onCenter()||this.reset()}_orbit(e,t){this._offset.copy(this.camera.position).sub(this.controls.target),this._spherical.setFromVector3(this._offset),this._spherical.theta+=e,this._spherical.phi=Math.min(Math.PI-gc,Math.max(gc,this._spherical.phi+t)),this._offset.setFromSpherical(this._spherical),this.camera.position.copy(this.controls.target).add(this._offset),this.camera.lookAt(this.controls.target),this._changed()}_zoom(e){this.is2d?(this.camera.zoom=Math.min(20,Math.max(.05,this.camera.zoom/e)),this.camera.updateProjectionMatrix()):(this._offset.copy(this.camera.position).sub(this.controls.target),this._offset.multiplyScalar(e),this.camera.position.copy(this.controls.target).add(this._offset)),this._changed()}_panView(e,t){const n=this.is2d?ur/(this.camera.zoom||1):this.camera.position.distanceTo(this.controls.target)*C_;this._right.setFromMatrixColumn(this.camera.matrix,0).multiplyScalar(e*n),this._up.setFromMatrixColumn(this.camera.matrix,1).multiplyScalar(t*n),this._delta.copy(this._right).add(this._up),this.camera.position.add(this._delta),this.controls.target.add(this._delta),this._changed()}_pan(e,t){this.camera.position.x+=e,this.camera.position.y+=t,this.controls.target.x+=e,this.controls.target.y+=t,this._changed()}reset(){this.camera.position.copy(this.home.position),this.controls.target.copy(this.home.target),this.camera.zoom=this.home.zoom,this.camera.updateProjectionMatrix(),this.camera.lookAt(this.controls.target),this._changed()}_changed(){this.controls.update(),this.controls.dispatchEvent({type:"change"})}}const P_=5;function ps(s,e={}){return{type:"event",event:s,payload:e}}function L_(s,e,t,n,i=P_){return Math.hypot(t-s,n-e)<i}class U_{constructor(e,t,n,{requestFrame:i=a=>requestAnimationFrame(a),onNodeClick:r=()=>{},onBackgroundClick:o=()=>{}}={}){this.pickFn=t,this.sendFn=n,this.requestFrame=i,this.onNodeClick=r,this.onBackgroundClick=o,this.hoverId=null,this.pointerDown=null,this.pendingMove=null,e.addEventListener("pointermove",a=>this._onMove(a)),e.addEventListener("pointerdown",a=>{this.pointerDown={x:a.clientX,y:a.clientY}}),e.addEventListener("pointerup",a=>this._onUp(a))}_onMove(e){const t=this.pendingMove===null;this.pendingMove={x:e.clientX,y:e.clientY},t&&this.requestFrame(()=>{const n=this.pendingMove;this.pendingMove=null,this._hover(n.x,n.y)})}_hover(e,t){const n=this.pickFn(e,t);n!==this.hoverId&&(this.hoverId=n,this.sendFn(ps("node_hover",{node_id:n})))}_onUp(e){if(!this.pointerDown)return;const{x:t,y:n}=this.pointerDown;if(this.pointerDown=null,!L_(t,n,e.clientX,e.clientY))return;const i=this.pickFn(e.clientX,e.clientY);i!==null?(this.sendFn(ps("node_click",{node_id:i})),this.onNodeClick(i)):(this.sendFn(ps("background_click")),this.onBackgroundClick())}}function vc(s){const e=s.meta&&s.meta.skupina;return e==null?void 0:String(e)}class D_{constructor(e){this.ids=[],this.positions=new Float32Array(0),this.worker=new Worker(new URL("/assets/worker-BwUe04Tv.js",import.meta.url),{type:"module"}),this.worker.onmessage=({data:t})=>{t.type==="index"?this.ids=t.ids:t.type==="tick"&&(this.positions=t.positions)},this._unsubscribe=e.subscribe(t=>this._onStoreEvent(e,t))}setPaused(e){this.worker.postMessage({type:e?"pause":"resume"})}setDimensions(e){this.worker.postMessage({type:"set_dimensions",dimensions:e})}setClusters(e){this.worker.postMessage({type:"set_clusters",clusters:!!e})}terminate(){this._unsubscribe(),this.worker.terminate()}_onStoreEvent(e,t){if(t.kind==="init")this.worker.postMessage({type:"init",dimensions:e.config.dimensions,nodes:[...e.nodes.values()].map(n=>({id:n.id,mass:Number(n.meta&&n.meta.mass),group:vc(n)})),links:[...e.edges.values()].map(n=>({source:n.source,target:n.target,weight:Number(n.meta&&n.meta.weight)}))});else if(t.kind==="patch"){const n=t.patch;this.worker.postMessage({type:"patch",addNodes:n.add_nodes.map(i=>({id:i.id,mass:Number(i.meta&&i.meta.mass),group:vc(i)})),removeNodes:n.remove_nodes,addLinks:n.add_edges.map(i=>({source:i.source,target:i.target,weight:Number(i.meta&&i.meta.weight)})),removeLinks:n.remove_edges})}}}const I_=2;class F_{constructor(e,{threshold:t=30,holdSeconds:n=3,smoothing:i=2}={}){this.onDegrade=e,this.threshold=t,this.holdSeconds=n,this.smoothing=i,this.avgFps=null,this.below=0,this.steps=0}frame(e){if(e<=0||this.steps>=I_)return;const t=1/e;this.avgFps=this.avgFps===null?t:this.avgFps+(t-this.avgFps)*Math.min(1,e*this.smoothing),this.avgFps<this.threshold?(this.below+=e,this.below>=this.holdSeconds&&(this.below=0,this.steps+=1,this.onDegrade(this.steps))):this.below=0}}const _c={type:"change"},To={type:"start"},xc={type:"end"},as=new Ps,yc=new In,N_=Math.cos(70*Bo.DEG2RAD);class bc extends oi{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new H,this.cursor=new H,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:xn.ROTATE,MIDDLE:xn.DOLLY,RIGHT:xn.PAN},this.touches={ONE:Dn.ROTATE,TWO:Dn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(E){E.addEventListener("keydown",ce),this._domElementKeyEvents=E},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ce),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(_c),n.update(),r=i.NONE},this.update=function(){const E=new H,Q=new si().setFromUnitVectors(e.up,new H(0,1,0)),z=Q.clone().invert(),ee=new H,ge=new si,Ae=new H,Re=2*Math.PI;return function(Xe=null){const De=n.object.position;E.copy(De).sub(n.target),E.applyQuaternion(Q),a.setFromVector3(E),n.autoRotate&&r===i.NONE&&P(x(Xe)),n.enableDamping?(a.theta+=l.theta*n.dampingFactor,a.phi+=l.phi*n.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let Ye=n.minAzimuthAngle,$e=n.maxAzimuthAngle;isFinite(Ye)&&isFinite($e)&&(Ye<-Math.PI?Ye+=Re:Ye>Math.PI&&(Ye-=Re),$e<-Math.PI?$e+=Re:$e>Math.PI&&($e-=Re),Ye<=$e?a.theta=Math.max(Ye,Math.min($e,a.theta)):a.theta=a.theta>(Ye+$e)/2?Math.max(Ye,a.theta):Math.min($e,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor);let tt=!1;if(n.zoomToCursor&&T||n.object.isOrthographicCamera)a.radius=q(a.radius);else{const Qe=a.radius;a.radius=q(a.radius*c),tt=Qe!=a.radius}if(E.setFromSpherical(a),E.applyQuaternion(z),De.copy(n.target).add(E),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),h.set(0,0,0)),n.zoomToCursor&&T){let Qe=null;if(n.object.isPerspectiveCamera){const ct=E.length();Qe=q(ct*c);const bt=ct-Qe;n.object.position.addScaledVector(y,bt),n.object.updateMatrixWorld(),tt=!!bt}else if(n.object.isOrthographicCamera){const ct=new H(A.x,A.y,0);ct.unproject(n.object);const bt=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),tt=bt!==n.object.zoom;const vt=new H(A.x,A.y,0);vt.unproject(n.object),n.object.position.sub(vt).add(ct),n.object.updateMatrixWorld(),Qe=E.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Qe!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Qe).add(n.object.position):(as.origin.copy(n.object.position),as.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(as.direction))<N_?e.lookAt(n.target):(yc.setFromNormalAndCoplanarPoint(n.object.up,n.target),as.intersectPlane(yc,n.target))))}else if(n.object.isOrthographicCamera){const Qe=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),Qe!==n.object.zoom&&(n.object.updateProjectionMatrix(),tt=!0)}return c=1,T=!1,tt||ee.distanceToSquared(n.object.position)>o||8*(1-ge.dot(n.object.quaternion))>o||Ae.distanceToSquared(n.target)>o?(n.dispatchEvent(_c),ee.copy(n.object.position),ge.copy(n.object.quaternion),Ae.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Me),n.domElement.removeEventListener("pointerdown",Ce),n.domElement.removeEventListener("pointercancel",S),n.domElement.removeEventListener("wheel",ie),n.domElement.removeEventListener("pointermove",R),n.domElement.removeEventListener("pointerup",S),n.domElement.getRootNode().removeEventListener("keydown",we,{capture:!0}),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ce),n._domElementKeyEvents=null)};const n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const o=1e-6,a=new Vo,l=new Vo;let c=1;const h=new H,u=new Oe,d=new Oe,f=new Oe,g=new Oe,v=new Oe,p=new Oe,m=new Oe,M=new Oe,_=new Oe,y=new H,A=new Oe;let T=!1;const w=[],L={};let b=!1;function x(E){return E!==null?2*Math.PI/60*n.autoRotateSpeed*E:2*Math.PI/60/60*n.autoRotateSpeed}function U(E){const Q=Math.abs(E*.01);return Math.pow(.95,n.zoomSpeed*Q)}function P(E){l.theta-=E}function I(E){l.phi-=E}const N=function(){const E=new H;return function(z,ee){E.setFromMatrixColumn(ee,0),E.multiplyScalar(-z),h.add(E)}}(),W=function(){const E=new H;return function(z,ee){n.screenSpacePanning===!0?E.setFromMatrixColumn(ee,1):(E.setFromMatrixColumn(ee,0),E.crossVectors(n.object.up,E)),E.multiplyScalar(z),h.add(E)}}(),B=function(){const E=new H;return function(z,ee){const ge=n.domElement;if(n.object.isPerspectiveCamera){const Ae=n.object.position;E.copy(Ae).sub(n.target);let Re=E.length();Re*=Math.tan(n.object.fov/2*Math.PI/180),N(2*z*Re/ge.clientHeight,n.object.matrix),W(2*ee*Re/ge.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(N(z*(n.object.right-n.object.left)/n.object.zoom/ge.clientWidth,n.object.matrix),W(ee*(n.object.top-n.object.bottom)/n.object.zoom/ge.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function se(E){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=E:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function j(E){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=E:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function K(E,Q){if(!n.zoomToCursor)return;T=!0;const z=n.domElement.getBoundingClientRect(),ee=E-z.left,ge=Q-z.top,Ae=z.width,Re=z.height;A.x=ee/Ae*2-1,A.y=-(ge/Re)*2+1,y.set(A.x,A.y,1).unproject(n.object).sub(n.object.position).normalize()}function q(E){return Math.max(n.minDistance,Math.min(n.maxDistance,E))}function F(E){u.set(E.clientX,E.clientY)}function V(E){K(E.clientX,E.clientX),m.set(E.clientX,E.clientY)}function ne(E){g.set(E.clientX,E.clientY)}function O(E){d.set(E.clientX,E.clientY),f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const Q=n.domElement;P(2*Math.PI*f.x/Q.clientHeight),I(2*Math.PI*f.y/Q.clientHeight),u.copy(d),n.update()}function k(E){M.set(E.clientX,E.clientY),_.subVectors(M,m),_.y>0?se(U(_.y)):_.y<0&&j(U(_.y)),m.copy(M),n.update()}function te(E){v.set(E.clientX,E.clientY),p.subVectors(v,g).multiplyScalar(n.panSpeed),B(p.x,p.y),g.copy(v),n.update()}function G(E){K(E.clientX,E.clientY),E.deltaY<0?j(U(E.deltaY)):E.deltaY>0&&se(U(E.deltaY)),n.update()}function ae(E){let Q=!1;switch(E.code){case n.keys.UP:E.ctrlKey||E.metaKey||E.shiftKey?I(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(0,n.keyPanSpeed),Q=!0;break;case n.keys.BOTTOM:E.ctrlKey||E.metaKey||E.shiftKey?I(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(0,-n.keyPanSpeed),Q=!0;break;case n.keys.LEFT:E.ctrlKey||E.metaKey||E.shiftKey?P(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(n.keyPanSpeed,0),Q=!0;break;case n.keys.RIGHT:E.ctrlKey||E.metaKey||E.shiftKey?P(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(-n.keyPanSpeed,0),Q=!0;break}Q&&(E.preventDefault(),n.update())}function pe(E){if(w.length===1)u.set(E.pageX,E.pageY);else{const Q=Ne(E),z=.5*(E.pageX+Q.x),ee=.5*(E.pageY+Q.y);u.set(z,ee)}}function _e(E){if(w.length===1)g.set(E.pageX,E.pageY);else{const Q=Ne(E),z=.5*(E.pageX+Q.x),ee=.5*(E.pageY+Q.y);g.set(z,ee)}}function D(E){const Q=Ne(E),z=E.pageX-Q.x,ee=E.pageY-Q.y,ge=Math.sqrt(z*z+ee*ee);m.set(0,ge)}function he(E){n.enableZoom&&D(E),n.enablePan&&_e(E)}function Pe(E){n.enableZoom&&D(E),n.enableRotate&&pe(E)}function Le(E){if(w.length==1)d.set(E.pageX,E.pageY);else{const z=Ne(E),ee=.5*(E.pageX+z.x),ge=.5*(E.pageY+z.y);d.set(ee,ge)}f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const Q=n.domElement;P(2*Math.PI*f.x/Q.clientHeight),I(2*Math.PI*f.y/Q.clientHeight),u.copy(d)}function fe(E){if(w.length===1)v.set(E.pageX,E.pageY);else{const Q=Ne(E),z=.5*(E.pageX+Q.x),ee=.5*(E.pageY+Q.y);v.set(z,ee)}p.subVectors(v,g).multiplyScalar(n.panSpeed),B(p.x,p.y),g.copy(v)}function ye(E){const Q=Ne(E),z=E.pageX-Q.x,ee=E.pageY-Q.y,ge=Math.sqrt(z*z+ee*ee);M.set(0,ge),_.set(0,Math.pow(M.y/m.y,n.zoomSpeed)),se(_.y),m.copy(M);const Ae=(E.pageX+Q.x)*.5,Re=(E.pageY+Q.y)*.5;K(Ae,Re)}function Se(E){n.enableZoom&&ye(E),n.enablePan&&fe(E)}function de(E){n.enableZoom&&ye(E),n.enableRotate&&Le(E)}function Ce(E){n.enabled!==!1&&(w.length===0&&(n.domElement.setPointerCapture(E.pointerId),n.domElement.addEventListener("pointermove",R),n.domElement.addEventListener("pointerup",S)),!me(E)&&(ke(E),E.pointerType==="touch"?be(E):X(E)))}function R(E){n.enabled!==!1&&(E.pointerType==="touch"?ue(E):Z(E))}function S(E){switch(Te(E),w.length){case 0:n.domElement.releasePointerCapture(E.pointerId),n.domElement.removeEventListener("pointermove",R),n.domElement.removeEventListener("pointerup",S),n.dispatchEvent(xc),r=i.NONE;break;case 1:const Q=w[0],z=L[Q];be({pointerId:Q,pageX:z.x,pageY:z.y});break}}function X(E){let Q;switch(E.button){case 0:Q=n.mouseButtons.LEFT;break;case 1:Q=n.mouseButtons.MIDDLE;break;case 2:Q=n.mouseButtons.RIGHT;break;default:Q=-1}switch(Q){case xn.DOLLY:if(n.enableZoom===!1)return;V(E),r=i.DOLLY;break;case xn.ROTATE:if(E.ctrlKey||E.metaKey||E.shiftKey){if(n.enablePan===!1)return;ne(E),r=i.PAN}else{if(n.enableRotate===!1)return;F(E),r=i.ROTATE}break;case xn.PAN:if(E.ctrlKey||E.metaKey||E.shiftKey){if(n.enableRotate===!1)return;F(E),r=i.ROTATE}else{if(n.enablePan===!1)return;ne(E),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(To)}function Z(E){switch(r){case i.ROTATE:if(n.enableRotate===!1)return;O(E);break;case i.DOLLY:if(n.enableZoom===!1)return;k(E);break;case i.PAN:if(n.enablePan===!1)return;te(E);break}}function ie(E){n.enabled===!1||n.enableZoom===!1||r!==i.NONE||(E.preventDefault(),n.dispatchEvent(To),G(J(E)),n.dispatchEvent(xc))}function J(E){const Q=E.deltaMode,z={clientX:E.clientX,clientY:E.clientY,deltaY:E.deltaY};switch(Q){case 1:z.deltaY*=16;break;case 2:z.deltaY*=100;break}return E.ctrlKey&&!b&&(z.deltaY*=10),z}function we(E){E.key==="Control"&&(b=!0,n.domElement.getRootNode().addEventListener("keyup",le,{passive:!0,capture:!0}))}function le(E){E.key==="Control"&&(b=!1,n.domElement.getRootNode().removeEventListener("keyup",le,{passive:!0,capture:!0}))}function ce(E){n.enabled===!1||n.enablePan===!1||ae(E)}function be(E){switch(xe(E),w.length){case 1:switch(n.touches.ONE){case Dn.ROTATE:if(n.enableRotate===!1)return;pe(E),r=i.TOUCH_ROTATE;break;case Dn.PAN:if(n.enablePan===!1)return;_e(E),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(n.touches.TWO){case Dn.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;he(E),r=i.TOUCH_DOLLY_PAN;break;case Dn.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Pe(E),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(To)}function ue(E){switch(xe(E),r){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;Le(E),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;fe(E),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Se(E),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;de(E),n.update();break;default:r=i.NONE}}function Me(E){n.enabled!==!1&&E.preventDefault()}function ke(E){w.push(E.pointerId)}function Te(E){delete L[E.pointerId];for(let Q=0;Q<w.length;Q++)if(w[Q]==E.pointerId){w.splice(Q,1);return}}function me(E){for(let Q=0;Q<w.length;Q++)if(w[Q]==E.pointerId)return!0;return!1}function xe(E){let Q=L[E.pointerId];Q===void 0&&(Q=new Oe,L[E.pointerId]=Q),Q.set(E.pageX,E.pageY)}function Ne(E){const Q=E.pointerId===w[0]?w[1]:w[0];return L[Q]}n.domElement.addEventListener("contextmenu",Me),n.domElement.addEventListener("pointerdown",Ce),n.domElement.addEventListener("pointercancel",S),n.domElement.addEventListener("wheel",ie,{passive:!1}),n.domElement.getRootNode().addEventListener("keydown",we,{passive:!0,capture:!0}),this.update()}}const O_={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};let ca=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}};const k_=new Xi(-1,1,1,-1,0,1);let B_=class extends Lt{constructor(){super(),this.setAttribute("position",new lt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new lt([0,2,0,0,2,0],2))}};const z_=new B_;let G_=class{constructor(e){this._mesh=new Tt(z_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,k_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};class H_ extends ca{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Ft?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Sr.clone(e.uniforms),this.material=new Ft({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new G_(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Sc extends ca{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class V_ extends ca{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class W_{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Oe);this._width=n.width,this._height=n.height,t=new tn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:On}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new H_(O_),this.copyPass.material.blending=Sn,this.clock=new Fh}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Sc!==void 0&&(o instanceof Sc?n=!0:o instanceof V_&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Oe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}let X_=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}};new Xi(-1,1,1,-1,0,1);let Y_=class extends Lt{constructor(){super(),this.setAttribute("position",new lt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new lt([0,2,0,0,2,0],2))}};new Y_;class j_ extends X_{constructor(e,t,n=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ve}render(e,t,n){const i=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=i}}class q_{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const K_=new Xi(-1,1,1,-1,0,1);class Z_ extends Lt{constructor(){super(),this.setAttribute("position",new lt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new lt([0,2,0,0,2,0],2))}}const $_=new Z_;class J_{constructor(e){this._mesh=new Tt($_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,K_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}const Q_={uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`},e0={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ve(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Gi extends q_{constructor(e,t,n,i){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new Oe(e.x,e.y):new Oe(256,256),this.clearColor=new Ve(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new tn(r,o,{type:On}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const d=new tn(r,o,{type:On});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const f=new tn(r,o,{type:On});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),o=Math.round(o/2)}const a=e0;this.highPassUniforms=Sr.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ft({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new Oe(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new H(1,1,1),new H(1,1,1),new H(1,1,1),new H(1,1,1),new H(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Q_;this.copyUniforms=Sr.clone(h.uniforms),this.blendMaterial=new Ft({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:vs,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Ve,this.oldClearAlpha=1,this.basic=new Mr,this.fsQuad=new J_(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new Oe(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=Gi.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Gi.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Ft({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Oe(.5,.5)},direction:{value:new Oe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new Ft({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Gi.BlurDirectionX=new Oe(1,0);Gi.BlurDirectionY=new Oe(0,1);function Wo(s){return s!==null&&typeof s=="object"&&!Array.isArray(s)}function Is(s,e){const t={...s};for(const[n,i]of Object.entries(e))t[n]=Wo(t[n])&&Wo(i)?Is(t[n],i):i;return t}const t0="#0057af",n0={bg:"#ffffff",fg:"#0057af",menuAttach:!0},i0={headerBg:"#ffffff",headerBgActive:"#ffffff",headerFg:"#0057af",headerFgActive:"#0057af",headerStripe:!0,gadget:"#0057af",bevel:"hard",bodyBg:"#0057af",bodyFg:"#ffffff",key:"#ff8800",border:"#ffffff",dockBg:"#dfe8f5",shadow:"0 2px 0 rgba(0,0,0,0.35)",backdropPattern:"flat",htmlAccent:"#ffffff",outputBg:"rgba(0,0,0,0.18)",terminalBg:"transparent",frameLine:"#ffffff",frameKnob:"#ffffff",iconSet:"workbench-classic",font:"topaz-8"},r0={background:t0,screenBar:n0,window:i0},s0="#dadada",o0={bg:"#cfe1fb",fg:"#000000",menuAttach:!0},a0={headerBg:"#ffffff",headerBgActive:"#ffffff",headerFg:"#000000",headerFgActive:"#000000",headerStripe:!0,gadget:"#000000",border:"#000000",bevel:"hard",bodyBg:"#0055aa",bodyFg:"#ffffff",key:"#ff8800",dockBg:"#b8c6e8",shadow:"0 2px 0 rgba(0,0,0,0.35)",backdropPattern:"flat",outputBg:"rgba(0,0,0,0.10)",terminalBg:"transparent",frameLine:"#ffffff",frameKnob:"#ffffff",iconSet:"workbench-classic",font:"topaz-8"},l0={background:s0,screenBar:o0,window:a0},ha={background:"#f4f5f7",palette:["#2f7fe8","#e8553a","#2fa84f","#8a4fe8","#e8a02f","#1fb3c4","#d44f9e","#5b6472"],node:{color:"#2f7fe8",size:1,shape:"sphere",emissive:"#000000",emissiveIntensity:0},edge:{color:"#9aa3af",opacity:.5},lights:{ambient:{color:"#ffffff",intensity:.7},directional:{color:"#ffffff",intensity:1.2}},label:{color:"#1f2430",size:6,halo:"#f4f5f7",budget:200},detailBox:{"--vb-detail-bg":"rgba(255,255,255,0.95)","--vb-detail-fg":"#1f2430","--vb-detail-key":"#667788","--vb-detail-shadow":"0 4px 16px rgba(0,0,0,0.18)","--vb-status-bg":"rgba(20,23,28,0.85)","--vb-status-fg":"#ffffff"},bloom:{enabled:!1,strength:.8,radius:.6,threshold:.15},window:{headerBg:"#d8dde6",headerFg:"#1f2430",gadget:"#5a6573",bodyBg:"rgba(255,255,255,0.97)",bodyFg:"#1f2430",key:"#667788",dockBg:"#c2c9d4",shadow:"0 6px 20px rgba(0,0,0,0.22)",frameLine:"#c3c9d3",frameKnob:"#5a6573"},flow:{size:2.4,baseSpeed:220,color:"#2f7fe8",opacity:.85}},c0={background:"#0a0e1a",palette:["#28d7fe","#ff2a6d","#05ffa1","#b967ff","#ffd166","#01c8ee","#ff6e27","#e8f8ff"],node:{color:"#28d7fe",size:1,shape:"sphere",emissive:"#1b3a5c",emissiveIntensity:1.2},edge:{color:"#1f4f6e",opacity:.65},lights:{ambient:{color:"#314466",intensity:.9},directional:{color:"#9fd8ff",intensity:1.4}},label:{color:"#d7f4ff",size:6,halo:"#0a0e1a",budget:200},detailBox:{"--vb-detail-bg":"rgba(10,16,28,0.92)","--vb-detail-fg":"#d7f4ff","--vb-detail-key":"#5a7d9e","--vb-detail-shadow":"0 0 18px rgba(40,215,254,0.35)","--vb-status-bg":"rgba(40,215,254,0.15)","--vb-status-fg":"#d7f4ff"},bloom:{enabled:!0,strength:.9,radius:.7,threshold:.15},window:{headerBg:"rgba(40,215,254,0.18)",headerFg:"#d7f4ff",gadget:"#28d7fe",bodyBg:"rgba(10,16,28,0.94)",bodyFg:"#d7f4ff",key:"#5a7d9e",dockBg:"rgba(40,215,254,0.12)",shadow:"0 0 22px rgba(40,215,254,0.45)",outputBg:"rgba(255,255,255,0.05)",frameLine:"rgba(40,215,254,0.45)",frameKnob:"#28d7fe",frameGlow:"0 0 8px rgba(40,215,254,0.65)"},flow:{size:3,baseSpeed:260,color:"#28d7fe",opacity:1}},h0=Is(ha,l0),u0=Is(ha,r0),dr={modern:ha,cyber:c0,"workbench-gray":h0,"workbench-amiga":u0};function Nh(s){return typeof s=="string"?dr[s]?dr[s]:(console.error(`viewbase: unknown theme '${s}' – falling back to 'modern'`),dr.modern):Wo(s)?Is(dr.modern,s):(s!=null&&console.error("viewbase: theme must be a string or an object – falling back to modern"),dr.modern)}function d0(s,e){const t=s.palette??[],n=(a,l)=>t[a]??l,i=e.bodyBg&&!String(e.bodyBg).startsWith("rgba")?e.bodyBg:"#101418",r=e.bodyFg??"#e8eef6",o=[i,n(1,"#e8553a"),n(2,"#2fa84f"),n(4,"#e8a02f"),n(0,"#2f7fe8"),n(3,"#8a4fe8"),n(5,"#1fb3c4"),r];return[...o,...o]}function f0(s,e=document.documentElement){for(const[i,r]of Object.entries(s.detailBox))e.style.setProperty(i,r);const t=s.window;if(t){const i={"--vb-window-header-bg":t.headerBg,"--vb-window-header-fg":t.headerFg,"--vb-window-gadget":t.gadget,"--vb-window-body-bg":t.bodyBg,"--vb-window-body-fg":t.bodyFg,"--vb-window-key":t.key,"--vb-window-dock-bg":t.dockBg,"--vb-window-shadow":t.shadow,"--vb-window-border":t.border,"--vb-html-accent":t.htmlAccent??t.gadget,"--vb-window-output-bg":t.outputBg??"rgba(0,0,0,0.06)","--vb-terminal-bg":t.terminalBg??t.outputBg??"rgba(0,0,0,0.06)","--vb-terminal-caret":t.key??t.gadget??"auto","--vb-window-frame":t.frame===!1?"0":"1","--vb-term-bg":t.terminalBg&&t.terminalBg!=="transparent"?t.terminalBg:t.bodyBg??"#101418","--vb-frame-line":t.frameLine??(t.bevel==="hard"?t.headerBg??"#ffffff":t.gadget??"#8a93a3"),"--vb-frame-knob":t.frameKnob??t.frameLine??(t.bevel==="hard"?t.headerBg??"#ffffff":t.gadget??"#8a93a3"),"--vb-frame-glow":t.frameGlow??"none","--vb-window-grip-bg":t.bevel==="hard"?t.headerBg??"#ffffff":"transparent","--vb-window-grip-fg":t.bevel==="hard"?t.headerFg??t.gadget:t.frameKnob??t.gadget??"#8a93a3","--vb-window-grip-border":t.bevel==="hard"?t.headerFg??t.gadget:t.frameLine??t.gadget??"#8a93a3"};for(const[o,a]of Object.entries(i))a!=null&&e.style.setProperty(o,a);(Array.isArray(t.ansi)&&t.ansi.length>=16?t.ansi:d0(s,t)).forEach((o,a)=>e.style.setProperty(`--vb-term-ansi-${a}`,o)),e.style.setProperty("--vb-window-header-pattern",t.headerStripe?`repeating-linear-gradient(0deg, ${t.headerFg}22 0px, ${t.headerFg}22 1px, transparent 1px, transparent 4px)`:"none")}const n=s.screenBar;n&&(n.bg!=null&&e.style.setProperty("--vb-screenbar-bg",n.bg),n.fg!=null&&e.style.setProperty("--vb-screenbar-fg",n.fg))}function Oh(s,e,t){const n=s.type!=null&&e[s.type]||{};return{shape:n.shape??t.node.shape,color:s.meta.color??n.color??t.node.color,size:s.meta.size??n.size??t.node.size}}function p0(){var s=Object.create(null);function e(i,r){var o=i.id,a=i.name,l=i.dependencies;l===void 0&&(l=[]);var c=i.init;c===void 0&&(c=function(){});var h=i.getTransferables;if(h===void 0&&(h=null),!s[o])try{l=l.map(function(d){return d&&d.isWorkerModule&&(e(d,function(f){if(f instanceof Error)throw f}),d=s[d.id].value),d}),c=n("<"+a+">.init",c),h&&(h=n("<"+a+">.getTransferables",h));var u=null;typeof c=="function"?u=c.apply(void 0,l):console.error("worker module init function failed to rehydrate"),s[o]={id:o,value:u,getTransferables:h},r(u)}catch(d){d&&d.noLog||console.error(d),r(d)}}function t(i,r){var o,a=i.id,l=i.args;(!s[a]||typeof s[a].value!="function")&&r(new Error("Worker module "+a+": not found or its 'init' did not return a function"));try{var c=(o=s[a]).value.apply(o,l);c&&typeof c.then=="function"?c.then(h,function(u){return r(u instanceof Error?u:new Error(""+u))}):h(c)}catch(u){r(u)}function h(u){try{var d=s[a].getTransferables&&s[a].getTransferables(u);(!d||!Array.isArray(d)||!d.length)&&(d=void 0),r(u,d)}catch(f){console.error(f),r(f)}}}function n(i,r){var o=void 0;self.troikaDefine=function(l){return o=l};var a=URL.createObjectURL(new Blob(["/** "+i.replace(/\*/g,"")+` **/

troikaDefine(
`+r+`
)`],{type:"application/javascript"}));try{importScripts(a)}catch(l){console.error(l)}return URL.revokeObjectURL(a),delete self.troikaDefine,o}self.addEventListener("message",function(i){var r=i.data,o=r.messageId,a=r.action,l=r.data;try{a==="registerModule"&&e(l,function(c){c instanceof Error?postMessage({messageId:o,success:!1,error:c.message}):postMessage({messageId:o,success:!0,result:{isCallable:typeof c=="function"}})}),a==="callModule"&&t(l,function(c,h){c instanceof Error?postMessage({messageId:o,success:!1,error:c.message}):postMessage({messageId:o,success:!0,result:c},h||void 0)})}catch(c){postMessage({messageId:o,success:!1,error:c.stack})}})}function m0(s){var e=function(){for(var t=[],n=arguments.length;n--;)t[n]=arguments[n];return e._getInitResult().then(function(i){if(typeof i=="function")return i.apply(void 0,t);throw new Error("Worker module function was called but `init` did not return a callable function")})};return e._getInitResult=function(){var t=s.dependencies,n=s.init;t=Array.isArray(t)?t.map(function(r){return r&&(r=r.onMainThread||r,r._getInitResult&&(r=r._getInitResult())),r}):[];var i=Promise.all(t).then(function(r){return n.apply(null,r)});return e._getInitResult=function(){return i},i},e}var kh=function(){var s=!1;if(typeof window<"u"&&typeof window.document<"u")try{var e=new Worker(URL.createObjectURL(new Blob([""],{type:"application/javascript"})));e.terminate(),s=!0}catch(t){console.log("Troika createWorkerModule: web workers not allowed; falling back to main thread execution. Cause: ["+t.message+"]")}return kh=function(){return s},s},g0=0,v0=0,Ao=!1,xr=Object.create(null),yr=Object.create(null),Xo=Object.create(null);function ji(s){if((!s||typeof s.init!="function")&&!Ao)throw new Error("requires `options.init` function");var e=s.dependencies,t=s.init,n=s.getTransferables,i=s.workerId,r=m0(s);i==null&&(i="#default");var o="workerModule"+ ++g0,a=s.name||o,l=null;e=e&&e.map(function(h){return typeof h=="function"&&!h.workerModuleData&&(Ao=!0,h=ji({workerId:i,name:"<"+a+"> function dependency: "+h.name,init:`function(){return (
`+ms(h)+`
)}`}),Ao=!1),h&&h.workerModuleData&&(h=h.workerModuleData),h});function c(){for(var h=[],u=arguments.length;u--;)h[u]=arguments[u];if(!kh())return r.apply(void 0,h);if(!l){l=Mc(i,"registerModule",c.workerModuleData);var d=function(){l=null,yr[i].delete(d)};(yr[i]||(yr[i]=new Set)).add(d)}return l.then(function(f){var g=f.isCallable;if(g)return Mc(i,"callModule",{id:o,args:h});throw new Error("Worker module function was called but `init` did not return a callable function")})}return c.workerModuleData={isWorkerModule:!0,id:o,name:a,dependencies:e,init:ms(t),getTransferables:n&&ms(n)},c.onMainThread=r,c}function _0(s){yr[s]&&yr[s].forEach(function(e){e()}),xr[s]&&(xr[s].terminate(),delete xr[s])}function ms(s){var e=s.toString();return!/^function/.test(e)&&/^\w+\s*\(/.test(e)&&(e="function "+e),e}function x0(s){var e=xr[s];if(!e){var t=ms(p0);e=xr[s]=new Worker(URL.createObjectURL(new Blob(["/** Worker Module Bootstrap: "+s.replace(/\*/g,"")+` **/

;(`+t+")()"],{type:"application/javascript"}))),e.onmessage=function(n){var i=n.data,r=i.messageId,o=Xo[r];if(!o)throw new Error("WorkerModule response with empty or unknown messageId");delete Xo[r],o(i)}}return e}function Mc(s,e,t){return new Promise(function(n,i){var r=++v0;Xo[r]=function(o){o.success?n(o.result):i(new Error("Error in worker "+e+" call: "+o.error))},x0(s).postMessage({messageId:r,action:e,data:t})})}function Bh(){var s=function(e){function t(K,q,F,V,ne,O,k,te){var G=1-k;te.x=G*G*K+2*G*k*F+k*k*ne,te.y=G*G*q+2*G*k*V+k*k*O}function n(K,q,F,V,ne,O,k,te,G,ae){var pe=1-G;ae.x=pe*pe*pe*K+3*pe*pe*G*F+3*pe*G*G*ne+G*G*G*k,ae.y=pe*pe*pe*q+3*pe*pe*G*V+3*pe*G*G*O+G*G*G*te}function i(K,q){for(var F=/([MLQCZ])([^MLQCZ]*)/g,V,ne,O,k,te;V=F.exec(K);){var G=V[2].replace(/^\s*|\s*$/g,"").split(/[,\s]+/).map(function(ae){return parseFloat(ae)});switch(V[1]){case"M":k=ne=G[0],te=O=G[1];break;case"L":(G[0]!==k||G[1]!==te)&&q("L",k,te,k=G[0],te=G[1]);break;case"Q":{q("Q",k,te,k=G[2],te=G[3],G[0],G[1]);break}case"C":{q("C",k,te,k=G[4],te=G[5],G[0],G[1],G[2],G[3]);break}case"Z":(k!==ne||te!==O)&&q("L",k,te,ne,O);break}}}function r(K,q,F){F===void 0&&(F=16);var V={x:0,y:0};i(K,function(ne,O,k,te,G,ae,pe,_e,D){switch(ne){case"L":q(O,k,te,G);break;case"Q":{for(var he=O,Pe=k,Le=1;Le<F;Le++)t(O,k,ae,pe,te,G,Le/(F-1),V),q(he,Pe,V.x,V.y),he=V.x,Pe=V.y;break}case"C":{for(var fe=O,ye=k,Se=1;Se<F;Se++)n(O,k,ae,pe,_e,D,te,G,Se/(F-1),V),q(fe,ye,V.x,V.y),fe=V.x,ye=V.y;break}}})}var o="precision highp float;attribute vec2 aUV;varying vec2 vUV;void main(){vUV=aUV;gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}",a="precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){gl_FragColor=texture2D(tex,vUV);}",l=new WeakMap,c={premultipliedAlpha:!1,preserveDrawingBuffer:!0,antialias:!1,depth:!1};function h(K,q){var F=K.getContext?K.getContext("webgl",c):K,V=l.get(F);if(!V){let pe=function(fe){var ye=O[fe];if(!ye&&(ye=O[fe]=F.getExtension(fe),!ye))throw new Error(fe+" not supported");return ye},_e=function(fe,ye){var Se=F.createShader(ye);return F.shaderSource(Se,fe),F.compileShader(Se),Se},D=function(fe,ye,Se,de){if(!k[fe]){var Ce={},R={},S=F.createProgram();F.attachShader(S,_e(ye,F.VERTEX_SHADER)),F.attachShader(S,_e(Se,F.FRAGMENT_SHADER)),F.linkProgram(S),k[fe]={program:S,transaction:function(Z){F.useProgram(S),Z({setUniform:function(J,we){for(var le=[],ce=arguments.length-2;ce-- >0;)le[ce]=arguments[ce+2];var be=R[we]||(R[we]=F.getUniformLocation(S,we));F["uniform"+J].apply(F,[be].concat(le))},setAttribute:function(J,we,le,ce,be){var ue=Ce[J];ue||(ue=Ce[J]={buf:F.createBuffer(),loc:F.getAttribLocation(S,J),data:null}),F.bindBuffer(F.ARRAY_BUFFER,ue.buf),F.vertexAttribPointer(ue.loc,we,F.FLOAT,!1,0,0),F.enableVertexAttribArray(ue.loc),ne?F.vertexAttribDivisor(ue.loc,ce):pe("ANGLE_instanced_arrays").vertexAttribDivisorANGLE(ue.loc,ce),be!==ue.data&&(F.bufferData(F.ARRAY_BUFFER,be,le),ue.data=be)}})}}}k[fe].transaction(de)},he=function(fe,ye){G++;try{F.activeTexture(F.TEXTURE0+G);var Se=te[fe];Se||(Se=te[fe]=F.createTexture(),F.bindTexture(F.TEXTURE_2D,Se),F.texParameteri(F.TEXTURE_2D,F.TEXTURE_MIN_FILTER,F.NEAREST),F.texParameteri(F.TEXTURE_2D,F.TEXTURE_MAG_FILTER,F.NEAREST)),F.bindTexture(F.TEXTURE_2D,Se),ye(Se,G)}finally{G--}},Pe=function(fe,ye,Se){var de=F.createFramebuffer();ae.push(de),F.bindFramebuffer(F.FRAMEBUFFER,de),F.activeTexture(F.TEXTURE0+ye),F.bindTexture(F.TEXTURE_2D,fe),F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,fe,0);try{Se(de)}finally{F.deleteFramebuffer(de),F.bindFramebuffer(F.FRAMEBUFFER,ae[--ae.length-1]||null)}},Le=function(){O={},k={},te={},G=-1,ae.length=0};var ne=typeof WebGL2RenderingContext<"u"&&F instanceof WebGL2RenderingContext,O={},k={},te={},G=-1,ae=[];F.canvas.addEventListener("webglcontextlost",function(fe){Le(),fe.preventDefault()},!1),l.set(F,V={gl:F,isWebGL2:ne,getExtension:pe,withProgram:D,withTexture:he,withTextureFramebuffer:Pe,handleContextLoss:Le})}q(V)}function u(K,q,F,V,ne,O,k,te){k===void 0&&(k=15),te===void 0&&(te=null),h(K,function(G){var ae=G.gl,pe=G.withProgram,_e=G.withTexture;_e("copy",function(D,he){ae.texImage2D(ae.TEXTURE_2D,0,ae.RGBA,ne,O,0,ae.RGBA,ae.UNSIGNED_BYTE,q),pe("copy",o,a,function(Pe){var Le=Pe.setUniform,fe=Pe.setAttribute;fe("aUV",2,ae.STATIC_DRAW,0,new Float32Array([0,0,2,0,0,2])),Le("1i","image",he),ae.bindFramebuffer(ae.FRAMEBUFFER,te||null),ae.disable(ae.BLEND),ae.colorMask(k&8,k&4,k&2,k&1),ae.viewport(F,V,ne,O),ae.scissor(F,V,ne,O),ae.drawArrays(ae.TRIANGLES,0,3)})})})}function d(K,q,F){var V=K.width,ne=K.height;h(K,function(O){var k=O.gl,te=new Uint8Array(V*ne*4);k.readPixels(0,0,V,ne,k.RGBA,k.UNSIGNED_BYTE,te),K.width=q,K.height=F,u(k,te,0,0,V,ne)})}var f=Object.freeze({__proto__:null,withWebGLContext:h,renderImageData:u,resizeWebGLCanvasWithoutClearing:d});function g(K,q,F,V,ne,O){O===void 0&&(O=1);var k=new Uint8Array(K*q),te=V[2]-V[0],G=V[3]-V[1],ae=[];r(F,function(fe,ye,Se,de){ae.push({x1:fe,y1:ye,x2:Se,y2:de,minX:Math.min(fe,Se),minY:Math.min(ye,de),maxX:Math.max(fe,Se),maxY:Math.max(ye,de)})}),ae.sort(function(fe,ye){return fe.maxX-ye.maxX});for(var pe=0;pe<K;pe++)for(var _e=0;_e<q;_e++){var D=Pe(V[0]+te*(pe+.5)/K,V[1]+G*(_e+.5)/q),he=Math.pow(1-Math.abs(D)/ne,O)/2;D<0&&(he=1-he),he=Math.max(0,Math.min(255,Math.round(he*255))),k[_e*K+pe]=he}return k;function Pe(fe,ye){for(var Se=1/0,de=1/0,Ce=ae.length;Ce--;){var R=ae[Ce];if(R.maxX+de<=fe)break;if(fe+de>R.minX&&ye-de<R.maxY&&ye+de>R.minY){var S=m(fe,ye,R.x1,R.y1,R.x2,R.y2);S<Se&&(Se=S,de=Math.sqrt(Se))}}return Le(fe,ye)&&(de=-de),de}function Le(fe,ye){for(var Se=0,de=ae.length;de--;){var Ce=ae[de];if(Ce.maxX<=fe)break;var R=Ce.y1>ye!=Ce.y2>ye&&fe<(Ce.x2-Ce.x1)*(ye-Ce.y1)/(Ce.y2-Ce.y1)+Ce.x1;R&&(Se+=Ce.y1<Ce.y2?1:-1)}return Se!==0}}function v(K,q,F,V,ne,O,k,te,G,ae){O===void 0&&(O=1),te===void 0&&(te=0),G===void 0&&(G=0),ae===void 0&&(ae=0),p(K,q,F,V,ne,O,k,null,te,G,ae)}function p(K,q,F,V,ne,O,k,te,G,ae,pe){O===void 0&&(O=1),G===void 0&&(G=0),ae===void 0&&(ae=0),pe===void 0&&(pe=0);for(var _e=g(K,q,F,V,ne,O),D=new Uint8Array(_e.length*4),he=0;he<_e.length;he++)D[he*4+pe]=_e[he];u(k,D,G,ae,K,q,1<<3-pe,te)}function m(K,q,F,V,ne,O){var k=ne-F,te=O-V,G=k*k+te*te,ae=G?Math.max(0,Math.min(1,((K-F)*k+(q-V)*te)/G)):0,pe=K-(F+ae*k),_e=q-(V+ae*te);return pe*pe+_e*_e}var M=Object.freeze({__proto__:null,generate:g,generateIntoCanvas:v,generateIntoFramebuffer:p}),_="precision highp float;uniform vec4 uGlyphBounds;attribute vec2 aUV;attribute vec4 aLineSegment;varying vec4 vLineSegment;varying vec2 vGlyphXY;void main(){vLineSegment=aLineSegment;vGlyphXY=mix(uGlyphBounds.xy,uGlyphBounds.zw,aUV);gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}",y="precision highp float;uniform vec4 uGlyphBounds;uniform float uMaxDistance;uniform float uExponent;varying vec4 vLineSegment;varying vec2 vGlyphXY;float absDistToSegment(vec2 point,vec2 lineA,vec2 lineB){vec2 lineDir=lineB-lineA;float lenSq=dot(lineDir,lineDir);float t=lenSq==0.0 ? 0.0 : clamp(dot(point-lineA,lineDir)/lenSq,0.0,1.0);vec2 linePt=lineA+t*lineDir;return distance(point,linePt);}void main(){vec4 seg=vLineSegment;vec2 p=vGlyphXY;float dist=absDistToSegment(p,seg.xy,seg.zw);float val=pow(1.0-clamp(dist/uMaxDistance,0.0,1.0),uExponent)*0.5;bool crossing=(seg.y>p.y!=seg.w>p.y)&&(p.x<(seg.z-seg.x)*(p.y-seg.y)/(seg.w-seg.y)+seg.x);bool crossingUp=crossing&&vLineSegment.y<vLineSegment.w;gl_FragColor=vec4(crossingUp ? 1.0/255.0 : 0.0,crossing&&!crossingUp ? 1.0/255.0 : 0.0,0.0,val);}",A="precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){vec4 color=texture2D(tex,vUV);bool inside=color.r!=color.g;float val=inside ? 1.0-color.a : color.a;gl_FragColor=vec4(val);}",T=new Float32Array([0,0,2,0,0,2]),w=null,L=!1,b={},x=new WeakMap;function U(K){if(!L&&!W(K))throw new Error("WebGL generation not supported")}function P(K,q,F,V,ne,O,k){if(O===void 0&&(O=1),k===void 0&&(k=null),!k&&(k=w,!k)){var te=typeof OffscreenCanvas=="function"?new OffscreenCanvas(1,1):typeof document<"u"?document.createElement("canvas"):null;if(!te)throw new Error("OffscreenCanvas or DOM canvas not supported");k=w=te.getContext("webgl",{depth:!1})}U(k);var G=new Uint8Array(K*q*4);h(k,function(D){var he=D.gl,Pe=D.withTexture,Le=D.withTextureFramebuffer;Pe("readable",function(fe,ye){he.texImage2D(he.TEXTURE_2D,0,he.RGBA,K,q,0,he.RGBA,he.UNSIGNED_BYTE,null),Le(fe,ye,function(Se){N(K,q,F,V,ne,O,he,Se,0,0,0),he.readPixels(0,0,K,q,he.RGBA,he.UNSIGNED_BYTE,G)})})});for(var ae=new Uint8Array(K*q),pe=0,_e=0;pe<G.length;pe+=4)ae[_e++]=G[pe];return ae}function I(K,q,F,V,ne,O,k,te,G,ae){O===void 0&&(O=1),te===void 0&&(te=0),G===void 0&&(G=0),ae===void 0&&(ae=0),N(K,q,F,V,ne,O,k,null,te,G,ae)}function N(K,q,F,V,ne,O,k,te,G,ae,pe){O===void 0&&(O=1),G===void 0&&(G=0),ae===void 0&&(ae=0),pe===void 0&&(pe=0),U(k);var _e=[];r(F,function(D,he,Pe,Le){_e.push(D,he,Pe,Le)}),_e=new Float32Array(_e),h(k,function(D){var he=D.gl,Pe=D.isWebGL2,Le=D.getExtension,fe=D.withProgram,ye=D.withTexture,Se=D.withTextureFramebuffer,de=D.handleContextLoss;if(ye("rawDistances",function(Ce,R){(K!==Ce._lastWidth||q!==Ce._lastHeight)&&he.texImage2D(he.TEXTURE_2D,0,he.RGBA,Ce._lastWidth=K,Ce._lastHeight=q,0,he.RGBA,he.UNSIGNED_BYTE,null),fe("main",_,y,function(S){var X=S.setAttribute,Z=S.setUniform,ie=!Pe&&Le("ANGLE_instanced_arrays"),J=!Pe&&Le("EXT_blend_minmax");X("aUV",2,he.STATIC_DRAW,0,T),X("aLineSegment",4,he.DYNAMIC_DRAW,1,_e),Z.apply(void 0,["4f","uGlyphBounds"].concat(V)),Z("1f","uMaxDistance",ne),Z("1f","uExponent",O),Se(Ce,R,function(we){he.enable(he.BLEND),he.colorMask(!0,!0,!0,!0),he.viewport(0,0,K,q),he.scissor(0,0,K,q),he.blendFunc(he.ONE,he.ONE),he.blendEquationSeparate(he.FUNC_ADD,Pe?he.MAX:J.MAX_EXT),he.clear(he.COLOR_BUFFER_BIT),Pe?he.drawArraysInstanced(he.TRIANGLES,0,3,_e.length/4):ie.drawArraysInstancedANGLE(he.TRIANGLES,0,3,_e.length/4)})}),fe("post",o,A,function(S){S.setAttribute("aUV",2,he.STATIC_DRAW,0,T),S.setUniform("1i","tex",R),he.bindFramebuffer(he.FRAMEBUFFER,te),he.disable(he.BLEND),he.colorMask(pe===0,pe===1,pe===2,pe===3),he.viewport(G,ae,K,q),he.scissor(G,ae,K,q),he.drawArrays(he.TRIANGLES,0,3)})}),he.isContextLost())throw de(),new Error("webgl context lost")})}function W(K){var q=!K||K===w?b:K.canvas||K,F=x.get(q);if(F===void 0){L=!0;var V=null;try{var ne=[97,106,97,61,99,137,118,80,80,118,137,99,61,97,106,97],O=P(4,4,"M8,8L16,8L24,24L16,24Z",[0,0,32,32],24,1,K);F=O&&ne.length===O.length&&O.every(function(k,te){return k===ne[te]}),F||(V="bad trial run results",console.info(ne,O))}catch(k){F=!1,V=k.message}V&&console.warn("WebGL SDF generation not supported:",V),L=!1,x.set(q,F)}return F}var B=Object.freeze({__proto__:null,generate:P,generateIntoCanvas:I,generateIntoFramebuffer:N,isSupported:W});function se(K,q,F,V,ne,O){ne===void 0&&(ne=Math.max(V[2]-V[0],V[3]-V[1])/2),O===void 0&&(O=1);try{return P.apply(B,arguments)}catch(k){return console.info("WebGL SDF generation failed, falling back to JS",k),g.apply(M,arguments)}}function j(K,q,F,V,ne,O,k,te,G,ae){ne===void 0&&(ne=Math.max(V[2]-V[0],V[3]-V[1])/2),O===void 0&&(O=1),te===void 0&&(te=0),G===void 0&&(G=0),ae===void 0&&(ae=0);try{return I.apply(B,arguments)}catch(pe){return console.info("WebGL SDF generation failed, falling back to JS",pe),v.apply(M,arguments)}}return e.forEachPathCommand=i,e.generate=se,e.generateIntoCanvas=j,e.javascript=M,e.pathToLineSegments=r,e.webgl=B,e.webglUtils=f,Object.defineProperty(e,"__esModule",{value:!0}),e}({});return s}function y0(){var s=function(e){var t={R:"13k,1a,2,3,3,2+1j,ch+16,a+1,5+2,2+n,5,a,4,6+16,4+3,h+1b,4mo,179q,2+9,2+11,2i9+7y,2+68,4,3+4,5+13,4+3,2+4k,3+29,8+cf,1t+7z,w+17,3+3m,1t+3z,16o1+5r,8+30,8+mc,29+1r,29+4v,75+73",EN:"1c+9,3d+1,6,187+9,513,4+5,7+9,sf+j,175h+9,qw+q,161f+1d,4xt+a,25i+9",ES:"17,2,6dp+1,f+1,av,16vr,mx+1,4o,2",ET:"z+2,3h+3,b+1,ym,3e+1,2o,p4+1,8,6u,7c,g6,1wc,1n9+4,30+1b,2n,6d,qhx+1,h0m,a+1,49+2,63+1,4+1,6bb+3,12jj",AN:"16o+5,2j+9,2+1,35,ed,1ff2+9,87+u",CS:"18,2+1,b,2u,12k,55v,l,17v0,2,3,53,2+1,b",B:"a,3,f+2,2v,690",S:"9,2,k",WS:"c,k,4f4,1vk+a,u,1j,335",ON:"x+1,4+4,h+5,r+5,r+3,z,5+3,2+1,2+1,5,2+2,3+4,o,w,ci+1,8+d,3+d,6+8,2+g,39+1,9,6+1,2,33,b8,3+1,3c+1,7+1,5r,b,7h+3,sa+5,2,3i+6,jg+3,ur+9,2v,ij+1,9g+9,7+a,8m,4+1,49+x,14u,2+2,c+2,e+2,e+2,e+1,i+n,e+e,2+p,u+2,e+2,36+1,2+3,2+1,b,2+2,6+5,2,2,2,h+1,5+4,6+3,3+f,16+2,5+3l,3+81,1y+p,2+40,q+a,m+13,2r+ch,2+9e,75+hf,3+v,2+2w,6e+5,f+6,75+2a,1a+p,2+2g,d+5x,r+b,6+3,4+o,g,6+1,6+2,2k+1,4,2j,5h+z,1m+1,1e+f,t+2,1f+e,d+3,4o+3,2s+1,w,535+1r,h3l+1i,93+2,2s,b+1,3l+x,2v,4g+3,21+3,kz+1,g5v+1,5a,j+9,n+v,2,3,2+8,2+1,3+2,2,3,46+1,4+4,h+5,r+5,r+a,3h+2,4+6,b+4,78,1r+24,4+c,4,1hb,ey+6,103+j,16j+c,1ux+7,5+g,fsh,jdq+1t,4,57+2e,p1,1m,1m,1m,1m,4kt+1,7j+17,5+2r,d+e,3+e,2+e,2+10,m+4,w,1n+5,1q,4z+5,4b+rb,9+c,4+c,4+37,d+2g,8+b,l+b,5+1j,9+9,7+13,9+t,3+1,27+3c,2+29,2+3q,d+d,3+4,4+2,6+6,a+o,8+6,a+2,e+6,16+42,2+1i",BN:"0+8,6+d,2s+5,2+p,e,4m9,1kt+2,2b+5,5+5,17q9+v,7k,6p+8,6+1,119d+3,440+7,96s+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+75,6p+2rz,1ben+1,1ekf+1,1ekf+1",NSM:"lc+33,7o+6,7c+18,2,2+1,2+1,2,21+a,1d+k,h,2u+6,3+5,3+1,2+3,10,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,g+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+g,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,k1+w,2db+2,3y,2p+v,ff+3,30+1,n9x+3,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,r2,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+5,3+1,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2d+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,f0c+4,1o+6,t5,1s+3,2a,f5l+1,43t+2,i+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,gzhy+6n",AL:"16w,3,2,e+1b,z+2,2+2s,g+1,8+1,b+m,2+t,s+2i,c+e,4h+f,1d+1e,1bwe+dp,3+3z,x+c,2+1,35+3y,2rm+z,5+7,b+5,dt+l,c+u,17nl+27,1t+27,4x+6n,3+d",LRO:"6ct",RLO:"6cu",LRE:"6cq",RLE:"6cr",PDF:"6cs",LRI:"6ee",RLI:"6ef",FSI:"6eg",PDI:"6eh"},n={},i={};n.L=1,i[1]="L",Object.keys(t).forEach(function(de,Ce){n[de]=1<<Ce+1,i[n[de]]=de}),Object.freeze(n);var r=n.LRI|n.RLI|n.FSI,o=n.L|n.R|n.AL,a=n.B|n.S|n.WS|n.ON|n.FSI|n.LRI|n.RLI|n.PDI,l=n.BN|n.RLE|n.LRE|n.RLO|n.LRO|n.PDF,c=n.S|n.WS|n.B|r|n.PDI|l,h=null;function u(){if(!h){h=new Map;var de=function(R){if(t.hasOwnProperty(R)){var S=0;t[R].split(",").forEach(function(X){var Z=X.split("+"),ie=Z[0],J=Z[1];ie=parseInt(ie,36),J=J?parseInt(J,36):0,h.set(S+=ie,n[R]);for(var we=0;we<J;we++)h.set(++S,n[R])})}};for(var Ce in t)de(Ce)}}function d(de){return u(),h.get(de.codePointAt(0))||n.L}function f(de){return i[d(de)]}var g={pairs:"14>1,1e>2,u>2,2wt>1,1>1,1ge>1,1wp>1,1j>1,f>1,hm>1,1>1,u>1,u6>1,1>1,+5,28>1,w>1,1>1,+3,b8>1,1>1,+3,1>3,-1>-1,3>1,1>1,+2,1s>1,1>1,x>1,th>1,1>1,+2,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,4q>1,1e>2,u>2,2>1,+1",canonical:"6f1>-6dx,6dy>-6dx,6ec>-6ed,6ee>-6ed,6ww>2jj,-2ji>2jj,14r4>-1e7l,1e7m>-1e7l,1e7m>-1e5c,1e5d>-1e5b,1e5c>-14qx,14qy>-14qx,14vn>-1ecg,1ech>-1ecg,1edu>-1ecg,1eci>-1ecg,1eda>-1ecg,1eci>-1ecg,1eci>-168q,168r>-168q,168s>-14ye,14yf>-14ye"};function v(de,Ce){var R=36,S=0,X=new Map,Z=Ce&&new Map,ie;return de.split(",").forEach(function J(we){if(we.indexOf("+")!==-1)for(var le=+we;le--;)J(ie);else{ie=we;var ce=we.split(">"),be=ce[0],ue=ce[1];be=String.fromCodePoint(S+=parseInt(be,R)),ue=String.fromCodePoint(S+=parseInt(ue,R)),X.set(be,ue),Ce&&Z.set(ue,be)}}),{map:X,reverseMap:Z}}var p,m,M;function _(){if(!p){var de=v(g.pairs,!0),Ce=de.map,R=de.reverseMap;p=Ce,m=R,M=v(g.canonical,!1).map}}function y(de){return _(),p.get(de)||null}function A(de){return _(),m.get(de)||null}function T(de){return _(),M.get(de)||null}var w=n.L,L=n.R,b=n.EN,x=n.ES,U=n.ET,P=n.AN,I=n.CS,N=n.B,W=n.S,B=n.ON,se=n.BN,j=n.NSM,K=n.AL,q=n.LRO,F=n.RLO,V=n.LRE,ne=n.RLE,O=n.PDF,k=n.LRI,te=n.RLI,G=n.FSI,ae=n.PDI;function pe(de,Ce){for(var R=125,S=new Uint32Array(de.length),X=0;X<de.length;X++)S[X]=d(de[X]);var Z=new Map;function ie(Ut,$t){var Dt=S[Ut];S[Ut]=$t,Z.set(Dt,Z.get(Dt)-1),Dt&a&&Z.set(a,Z.get(a)-1),Z.set($t,(Z.get($t)||0)+1),$t&a&&Z.set(a,(Z.get(a)||0)+1)}for(var J=new Uint8Array(de.length),we=new Map,le=[],ce=null,be=0;be<de.length;be++)ce||le.push(ce={start:be,end:de.length-1,level:Ce==="rtl"?1:Ce==="ltr"?0:wa(be,!1)}),S[be]&N&&(ce.end=be,ce=null);for(var ue=ne|V|F|q|r|ae|O|N,Me=function(Ut){return Ut+(Ut&1?1:2)},ke=function(Ut){return Ut+(Ut&1?2:1)},Te=0;Te<le.length;Te++){ce=le[Te];var me=[{_level:ce.level,_override:0,_isolate:0}],xe=void 0,Ne=0,We=0,E=0;Z.clear();for(var Q=ce.start;Q<=ce.end;Q++){var z=S[Q];if(xe=me[me.length-1],Z.set(z,(Z.get(z)||0)+1),z&a&&Z.set(a,(Z.get(a)||0)+1),z&ue)if(z&(ne|V)){J[Q]=xe._level;var ee=(z===ne?ke:Me)(xe._level);ee<=R&&!Ne&&!We?me.push({_level:ee,_override:0,_isolate:0}):Ne||We++}else if(z&(F|q)){J[Q]=xe._level;var ge=(z===F?ke:Me)(xe._level);ge<=R&&!Ne&&!We?me.push({_level:ge,_override:z&F?L:w,_isolate:0}):Ne||We++}else if(z&r){z&G&&(z=wa(Q+1,!0)===1?te:k),J[Q]=xe._level,xe._override&&ie(Q,xe._override);var Ae=(z===te?ke:Me)(xe._level);Ae<=R&&Ne===0&&We===0?(E++,me.push({_level:Ae,_override:0,_isolate:1,_isolInitIndex:Q})):Ne++}else if(z&ae){if(Ne>0)Ne--;else if(E>0){for(We=0;!me[me.length-1]._isolate;)me.pop();var Re=me[me.length-1]._isolInitIndex;Re!=null&&(we.set(Re,Q),we.set(Q,Re)),me.pop(),E--}xe=me[me.length-1],J[Q]=xe._level,xe._override&&ie(Q,xe._override)}else z&O?(Ne===0&&(We>0?We--:!xe._isolate&&me.length>1&&(me.pop(),xe=me[me.length-1])),J[Q]=xe._level):z&N&&(J[Q]=ce.level);else J[Q]=xe._level,xe._override&&z!==se&&ie(Q,xe._override)}for(var je=[],Xe=null,De=ce.start;De<=ce.end;De++){var Ye=S[De];if(!(Ye&l)){var $e=J[De],tt=Ye&r,Qe=Ye===ae;Xe&&$e===Xe._level?(Xe._end=De,Xe._endsWithIsolInit=tt):je.push(Xe={_start:De,_end:De,_level:$e,_startsWithPDI:Qe,_endsWithIsolInit:tt})}}for(var ct=[],bt=0;bt<je.length;bt++){var vt=je[bt];if(!vt._startsWithPDI||vt._startsWithPDI&&!we.has(vt._start)){for(var Kt=[Xe=vt],Ht=void 0;Xe&&Xe._endsWithIsolInit&&(Ht=we.get(Xe._end))!=null;)for(var Vt=bt+1;Vt<je.length;Vt++)if(je[Vt]._start===Ht){Kt.push(Xe=je[Vt]);break}for(var pt=[],un=0;un<Kt.length;un++)for(var Er=Kt[un],qi=Er._start;qi<=Er._end;qi++)pt.push(qi);for(var C=J[pt[0]],Y=ce.level,re=pt[0]-1;re>=0;re--)if(!(S[re]&l)){Y=J[re];break}var oe=pt[pt.length-1],$=J[oe],Ee=ce.level;if(!(S[oe]&r)){for(var Ie=oe+1;Ie<=ce.end;Ie++)if(!(S[Ie]&l)){Ee=J[Ie];break}}ct.push({_seqIndices:pt,_sosType:Math.max(Y,C)%2?L:w,_eosType:Math.max(Ee,$)%2?L:w})}}for(var Fe=0;Fe<ct.length;Fe++){var Be=ct[Fe],ve=Be._seqIndices,Ge=Be._sosType,He=Be._eosType,Ze=J[ve[0]]&1?L:w;if(Z.get(j))for(var rt=0;rt<ve.length;rt++){var st=ve[rt];if(S[st]&j){for(var _t=Ge,Je=rt-1;Je>=0;Je--)if(!(S[ve[Je]]&l)){_t=S[ve[Je]];break}ie(st,_t&(r|ae)?B:_t)}}if(Z.get(b))for(var ze=0;ze<ve.length;ze++){var mt=ve[ze];if(S[mt]&b)for(var et=ze-1;et>=-1;et--){var Wt=et===-1?Ge:S[ve[et]];if(Wt&o){Wt===K&&ie(mt,P);break}}}if(Z.get(K))for(var En=0;En<ve.length;En++){var nn=ve[En];S[nn]&K&&ie(nn,L)}if(Z.get(x)||Z.get(I))for(var dn=1;dn<ve.length-1;dn++){var at=ve[dn];if(S[at]&(x|I)){for(var Ct=0,Hn=0,St=dn-1;St>=0&&(Ct=S[ve[St]],!!(Ct&l));St--);for(var Vn=dn+1;Vn<ve.length&&(Hn=S[ve[Vn]],!!(Hn&l));Vn++);Ct===Hn&&(S[at]===x?Ct===b:Ct&(b|P))&&ie(at,Ct)}}if(Z.get(b))for(var Xt=0;Xt<ve.length;Xt++){var wr=ve[Xt];if(S[wr]&b){for(var Tr=Xt-1;Tr>=0&&S[ve[Tr]]&(U|l);Tr--)ie(ve[Tr],b);for(Xt++;Xt<ve.length&&S[ve[Xt]]&(U|l|b);Xt++)S[ve[Xt]]!==b&&ie(ve[Xt],b)}}if(Z.get(U)||Z.get(x)||Z.get(I))for(var Ki=0;Ki<ve.length;Ki++){var da=ve[Ki];if(S[da]&(U|x|I)){ie(da,B);for(var Ar=Ki-1;Ar>=0&&S[ve[Ar]]&l;Ar--)ie(ve[Ar],B);for(var Cr=Ki+1;Cr<ve.length&&S[ve[Cr]]&l;Cr++)ie(ve[Cr],B)}}if(Z.get(b))for(var Ns=0,fa=Ge;Ns<ve.length;Ns++){var pa=ve[Ns],Os=S[pa];Os&b?fa===w&&ie(pa,w):Os&o&&(fa=Os)}if(Z.get(a)){var Zi=L|b|P,ma=Zi|w,Rr=[];{for(var ci=[],hi=0;hi<ve.length;hi++)if(S[ve[hi]]&a){var $i=de[ve[hi]],ga=void 0;if(y($i)!==null)if(ci.length<63)ci.push({char:$i,seqIndex:hi});else break;else if((ga=A($i))!==null)for(var Ji=ci.length-1;Ji>=0;Ji--){var ks=ci[Ji].char;if(ks===ga||ks===A(T($i))||y(T(ks))===$i){Rr.push([ci[Ji].seqIndex,hi]),ci.length=Ji;break}}}Rr.sort(function(Ut,$t){return Ut[0]-$t[0]})}for(var Bs=0;Bs<Rr.length;Bs++){for(var va=Rr[Bs],Pr=va[0],zs=va[1],_a=!1,Zt=0,Gs=Pr+1;Gs<zs;Gs++){var xa=ve[Gs];if(S[xa]&ma){_a=!0;var ya=S[xa]&Zi?L:w;if(ya===Ze){Zt=ya;break}}}if(_a&&!Zt){Zt=Ge;for(var Hs=Pr-1;Hs>=0;Hs--){var ba=ve[Hs];if(S[ba]&ma){var Sa=S[ba]&Zi?L:w;Sa!==Ze?Zt=Sa:Zt=Ze;break}}}if(Zt){if(S[ve[Pr]]=S[ve[zs]]=Zt,Zt!==Ze){for(var Qi=Pr+1;Qi<ve.length;Qi++)if(!(S[ve[Qi]]&l)){d(de[ve[Qi]])&j&&(S[ve[Qi]]=Zt);break}}if(Zt!==Ze){for(var er=zs+1;er<ve.length;er++)if(!(S[ve[er]]&l)){d(de[ve[er]])&j&&(S[ve[er]]=Zt);break}}}}for(var wn=0;wn<ve.length;wn++)if(S[ve[wn]]&a){for(var Ma=wn,Vs=wn,Ws=Ge,tr=wn-1;tr>=0;tr--)if(S[ve[tr]]&l)Ma=tr;else{Ws=S[ve[tr]]&Zi?L:w;break}for(var Ea=He,nr=wn+1;nr<ve.length;nr++)if(S[ve[nr]]&(a|l))Vs=nr;else{Ea=S[ve[nr]]&Zi?L:w;break}for(var Xs=Ma;Xs<=Vs;Xs++)S[ve[Xs]]=Ws===Ea?Ws:Ze;wn=Vs}}}for(var Ot=ce.start;Ot<=ce.end;Ot++){var Jh=J[Ot],Lr=S[Ot];if(Jh&1?Lr&(w|b|P)&&J[Ot]++:Lr&L?J[Ot]++:Lr&(P|b)&&(J[Ot]+=2),Lr&l&&(J[Ot]=Ot===0?ce.level:J[Ot-1]),Ot===ce.end||d(de[Ot])&(W|N))for(var Ur=Ot;Ur>=0&&d(de[Ur])&c;Ur--)J[Ur]=ce.level}}return{levels:J,paragraphs:le};function wa(Ut,$t){for(var Dt=Ut;Dt<de.length;Dt++){var Tn=S[Dt];if(Tn&(L|K))return 1;if(Tn&(N|w)||$t&&Tn===ae)return 0;if(Tn&r){var Ta=Qh(Dt);Dt=Ta===-1?de.length:Ta}}return 0}function Qh(Ut){for(var $t=1,Dt=Ut+1;Dt<de.length;Dt++){var Tn=S[Dt];if(Tn&N)break;if(Tn&ae){if(--$t===0)return Dt}else Tn&r&&$t++}return-1}}var _e="14>1,j>2,t>2,u>2,1a>g,2v3>1,1>1,1ge>1,1wd>1,b>1,1j>1,f>1,ai>3,-2>3,+1,8>1k0,-1jq>1y7,-1y6>1hf,-1he>1h6,-1h5>1ha,-1h8>1qi,-1pu>1,6>3u,-3s>7,6>1,1>1,f>1,1>1,+2,3>1,1>1,+13,4>1,1>1,6>1eo,-1ee>1,3>1mg,-1me>1mk,-1mj>1mi,-1mg>1mi,-1md>1,1>1,+2,1>10k,-103>1,1>1,4>1,5>1,1>1,+10,3>1,1>8,-7>8,+1,-6>7,+1,a>1,1>1,u>1,u6>1,1>1,+5,26>1,1>1,2>1,2>2,8>1,7>1,4>1,1>1,+5,b8>1,1>1,+3,1>3,-2>1,2>1,1>1,+2,c>1,3>1,1>1,+2,h>1,3>1,a>1,1>1,2>1,3>1,1>1,d>1,f>1,3>1,1a>1,1>1,6>1,7>1,13>1,k>1,1>1,+19,4>1,1>1,+2,2>1,1>1,+18,m>1,a>1,1>1,lk>1,1>1,4>1,2>1,f>1,3>1,1>1,+3,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,6>1,4j>1,j>2,t>2,u>2,2>1,+1",D;function he(){if(!D){var de=v(_e,!0),Ce=de.map,R=de.reverseMap;R.forEach(function(S,X){Ce.set(X,S)}),D=Ce}}function Pe(de){return he(),D.get(de)||null}function Le(de,Ce,R,S){var X=de.length;R=Math.max(0,R==null?0:+R),S=Math.min(X-1,S==null?X-1:+S);for(var Z=new Map,ie=R;ie<=S;ie++)if(Ce[ie]&1){var J=Pe(de[ie]);J!==null&&Z.set(ie,J)}return Z}function fe(de,Ce,R,S){var X=de.length;R=Math.max(0,R==null?0:+R),S=Math.min(X-1,S==null?X-1:+S);var Z=[];return Ce.paragraphs.forEach(function(ie){var J=Math.max(R,ie.start),we=Math.min(S,ie.end);if(J<we){for(var le=Ce.levels.slice(J,we+1),ce=we;ce>=J&&d(de[ce])&c;ce--)le[ce]=ie.level;for(var be=ie.level,ue=1/0,Me=0;Me<le.length;Me++){var ke=le[Me];ke>be&&(be=ke),ke<ue&&(ue=ke|1)}for(var Te=be;Te>=ue;Te--)for(var me=0;me<le.length;me++)if(le[me]>=Te){for(var xe=me;me+1<le.length&&le[me+1]>=Te;)me++;me>xe&&Z.push([xe+J,me+J])}}}),Z}function ye(de,Ce,R,S){var X=Se(de,Ce,R,S),Z=[].concat(de);return X.forEach(function(ie,J){Z[J]=(Ce.levels[ie]&1?Pe(de[ie]):null)||de[ie]}),Z.join("")}function Se(de,Ce,R,S){for(var X=fe(de,Ce,R,S),Z=[],ie=0;ie<de.length;ie++)Z[ie]=ie;return X.forEach(function(J){for(var we=J[0],le=J[1],ce=Z.slice(we,le+1),be=ce.length;be--;)Z[le-be]=ce[be]}),Z}return e.closingToOpeningBracket=A,e.getBidiCharType=d,e.getBidiCharTypeName=f,e.getCanonicalBracket=T,e.getEmbeddingLevels=pe,e.getMirroredCharacter=Pe,e.getMirroredCharactersMap=Le,e.getReorderSegments=fe,e.getReorderedIndices=Se,e.getReorderedString=ye,e.openingToClosingBracket=y,Object.defineProperty(e,"__esModule",{value:!0}),e}({});return s}const zh=/\bvoid\s+main\s*\(\s*\)\s*{/g;function Yo(s){const e=/^[ \t]*#include +<([\w\d./]+)>/gm;function t(n,i){let r=qe[i];return r?Yo(r):n}return s.replace(e,t)}const xt=[];for(let s=0;s<256;s++)xt[s]=(s<16?"0":"")+s.toString(16);function b0(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(xt[s&255]+xt[s>>8&255]+xt[s>>16&255]+xt[s>>24&255]+"-"+xt[e&255]+xt[e>>8&255]+"-"+xt[e>>16&15|64]+xt[e>>24&255]+"-"+xt[t&63|128]+xt[t>>8&255]+"-"+xt[t>>16&255]+xt[t>>24&255]+xt[n&255]+xt[n>>8&255]+xt[n>>16&255]+xt[n>>24&255]).toUpperCase()}const Zn=Object.assign||function(){let s=arguments[0];for(let e=1,t=arguments.length;e<t;e++){let n=arguments[e];if(n)for(let i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=n[i])}return s},S0=Date.now(),Ec=new WeakMap,wc=new Map;let M0=1e10;function jo(s,e){const t=A0(e);let n=Ec.get(s);if(n||Ec.set(s,n=Object.create(null)),n[t])return new n[t];const i=`_onBeforeCompile${t}`,r=function(c,h){s.onBeforeCompile.call(this,c,h);const u=this.customProgramCacheKey()+"|"+c.vertexShader+"|"+c.fragmentShader;let d=wc[u];if(!d){const f=E0(this,c,e,t);d=wc[u]=f}c.vertexShader=d.vertexShader,c.fragmentShader=d.fragmentShader,Zn(c.uniforms,this.uniforms),e.timeUniform&&(c.uniforms[e.timeUniform]={get value(){return Date.now()-S0}}),this[i]&&this[i](c)},o=function(){return a(e.chained?s:s.clone())},a=function(c){const h=Object.create(c,l);return Object.defineProperty(h,"baseMaterial",{value:s}),Object.defineProperty(h,"id",{value:M0++}),h.uuid=b0(),h.uniforms=Zn({},c.uniforms,e.uniforms),h.defines=Zn({},c.defines,e.defines),h.defines[`TROIKA_DERIVED_MATERIAL_${t}`]="",h.extensions=Zn({},c.extensions,e.extensions),h._listeners=void 0,h},l={constructor:{value:o},isDerivedMaterial:{value:!0},type:{get:()=>s.type,set:c=>{s.type=c}},isDerivedFrom:{writable:!0,configurable:!0,value:function(c){const h=this.baseMaterial;return c===h||h.isDerivedMaterial&&h.isDerivedFrom(c)||!1}},customProgramCacheKey:{writable:!0,configurable:!0,value:function(){return s.customProgramCacheKey()+"|"+t}},onBeforeCompile:{get(){return r},set(c){this[i]=c}},copy:{writable:!0,configurable:!0,value:function(c){return s.copy.call(this,c),!s.isShaderMaterial&&!s.isDerivedMaterial&&(Zn(this.extensions,c.extensions),Zn(this.defines,c.defines),Zn(this.uniforms,Sr.clone(c.uniforms))),this}},clone:{writable:!0,configurable:!0,value:function(){const c=new s.constructor;return a(c).copy(this)}},getDepthMaterial:{writable:!0,configurable:!0,value:function(){let c=this._depthMaterial;return c||(c=this._depthMaterial=jo(s.isDerivedMaterial?s.getDepthMaterial():new Ph({depthPacking:hh}),e),c.defines.IS_DEPTH_MATERIAL="",c.uniforms=this.uniforms),c}},getDistanceMaterial:{writable:!0,configurable:!0,value:function(){let c=this._distanceMaterial;return c||(c=this._distanceMaterial=jo(s.isDerivedMaterial?s.getDistanceMaterial():new Lh,e),c.defines.IS_DISTANCE_MATERIAL="",c.uniforms=this.uniforms),c}},dispose:{writable:!0,configurable:!0,value(){const{_depthMaterial:c,_distanceMaterial:h}=this;c&&c.dispose(),h&&h.dispose(),s.dispose.call(this)}}};return n[t]=o,new o}function E0(s,{vertexShader:e,fragmentShader:t},n,i){let{vertexDefs:r,vertexMainIntro:o,vertexMainOutro:a,vertexTransform:l,fragmentDefs:c,fragmentMainIntro:h,fragmentMainOutro:u,fragmentColorTransform:d,customRewriter:f,timeUniform:g}=n;if(r=r||"",o=o||"",a=a||"",c=c||"",h=h||"",u=u||"",(l||f)&&(e=Yo(e)),(d||f)&&(t=t.replace(/^[ \t]*#include <((?:tonemapping|encodings|colorspace|fog|premultiplied_alpha|dithering)_fragment)>/gm,`
//!BEGIN_POST_CHUNK $1
$&
//!END_POST_CHUNK
`),t=Yo(t)),f){let v=f({vertexShader:e,fragmentShader:t});e=v.vertexShader,t=v.fragmentShader}if(d){let v=[];t=t.replace(/^\/\/!BEGIN_POST_CHUNK[^]+?^\/\/!END_POST_CHUNK/gm,p=>(v.push(p),"")),u=`${d}
${v.join(`
`)}
${u}`}if(g){const v=`
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
`,e=e.replace(/\b(position|normal|uv)\b/g,(v,p,m,M)=>/\battribute\s+vec[23]\s+$/.test(M.substr(0,m))?p:`troika_${p}_${i}`),s.map&&s.map.channel>0||(e=e.replace(/\bMAP_UV\b/g,`troika_uv_${i}`))),e=Tc(e,i,r,o,a),t=Tc(t,i,c,h,u),{vertexShader:e,fragmentShader:t}}function Tc(s,e,t,n,i){return(n||i||t)&&(s=s.replace(zh,`
${t}
void troikaOrigMain${e}() {`),s+=`
void main() {
  ${n}
  troikaOrigMain${e}();
  ${i}
}`),s}function w0(s,e){return s==="uniforms"?void 0:typeof e=="function"?e.toString():e}let T0=0;const Ac=new Map;function A0(s){const e=JSON.stringify(s,w0);let t=Ac.get(e);return t==null&&Ac.set(e,t=++T0),t}/*!
Custom build of Typr.ts (https://github.com/fredli74/Typr.ts) for use in Troika text rendering.
Original MIT license applies: https://github.com/fredli74/Typr.ts/blob/master/LICENSE
*/function C0(){return typeof window>"u"&&(self.window=self),function(s){var e={parse:function(i){var r=e._bin,o=new Uint8Array(i);if(r.readASCII(o,0,4)=="ttcf"){var a=4;r.readUshort(o,a),a+=2,r.readUshort(o,a),a+=2;var l=r.readUint(o,a);a+=4;for(var c=[],h=0;h<l;h++){var u=r.readUint(o,a);a+=4,c.push(e._readFont(o,u))}return c}return[e._readFont(o,0)]},_readFont:function(i,r){var o=e._bin,a=r;o.readFixed(i,r),r+=4;var l=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2;for(var c=["cmap","head","hhea","maxp","hmtx","name","OS/2","post","loca","glyf","kern","CFF ","GDEF","GPOS","GSUB","SVG "],h={_data:i,_offset:a},u={},d=0;d<l;d++){var f=o.readASCII(i,r,4);r+=4,o.readUint(i,r),r+=4;var g=o.readUint(i,r);r+=4;var v=o.readUint(i,r);r+=4,u[f]={offset:g,length:v}}for(d=0;d<c.length;d++){var p=c[d];u[p]&&(h[p.trim()]=e[p.trim()].parse(i,u[p].offset,u[p].length,h))}return h},_tabOffset:function(i,r,o){for(var a=e._bin,l=a.readUshort(i,o+4),c=o+12,h=0;h<l;h++){var u=a.readASCII(i,c,4);c+=4,a.readUint(i,c),c+=4;var d=a.readUint(i,c);if(c+=4,a.readUint(i,c),c+=4,u==r)return d}return 0}};e._bin={readFixed:function(i,r){return(i[r]<<8|i[r+1])+(i[r+2]<<8|i[r+3])/65540},readF2dot14:function(i,r){return e._bin.readShort(i,r)/16384},readInt:function(i,r){return e._bin._view(i).getInt32(r)},readInt8:function(i,r){return e._bin._view(i).getInt8(r)},readShort:function(i,r){return e._bin._view(i).getInt16(r)},readUshort:function(i,r){return e._bin._view(i).getUint16(r)},readUshorts:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(e._bin.readUshort(i,r+2*l));return a},readUint:function(i,r){return e._bin._view(i).getUint32(r)},readUint64:function(i,r){return 4294967296*e._bin.readUint(i,r)+e._bin.readUint(i,r+4)},readASCII:function(i,r,o){for(var a="",l=0;l<o;l++)a+=String.fromCharCode(i[r+l]);return a},readUnicode:function(i,r,o){for(var a="",l=0;l<o;l++){var c=i[r++]<<8|i[r++];a+=String.fromCharCode(c)}return a},_tdec:typeof window<"u"&&window.TextDecoder?new window.TextDecoder:null,readUTF8:function(i,r,o){var a=e._bin._tdec;return a&&r==0&&o==i.length?a.decode(i):e._bin.readASCII(i,r,o)},readBytes:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(i[r+l]);return a},readASCIIArray:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(String.fromCharCode(i[r+l]));return a},_view:function(i){return i._dataView||(i._dataView=i.buffer?new DataView(i.buffer,i.byteOffset,i.byteLength):new DataView(new Uint8Array(i).buffer))}},e._lctf={},e._lctf.parse=function(i,r,o,a,l){var c=e._bin,h={},u=r;c.readFixed(i,r),r+=4;var d=c.readUshort(i,r);r+=2;var f=c.readUshort(i,r);r+=2;var g=c.readUshort(i,r);return r+=2,h.scriptList=e._lctf.readScriptList(i,u+d),h.featureList=e._lctf.readFeatureList(i,u+f),h.lookupList=e._lctf.readLookupList(i,u+g,l),h},e._lctf.readLookupList=function(i,r,o){var a=e._bin,l=r,c=[],h=a.readUshort(i,r);r+=2;for(var u=0;u<h;u++){var d=a.readUshort(i,r);r+=2;var f=e._lctf.readLookupTable(i,l+d,o);c.push(f)}return c},e._lctf.readLookupTable=function(i,r,o){var a=e._bin,l=r,c={tabs:[]};c.ltype=a.readUshort(i,r),r+=2,c.flag=a.readUshort(i,r),r+=2;var h=a.readUshort(i,r);r+=2;for(var u=c.ltype,d=0;d<h;d++){var f=a.readUshort(i,r);r+=2;var g=o(i,u,l+f,c);c.tabs.push(g)}return c},e._lctf.numOfOnes=function(i){for(var r=0,o=0;o<32;o++)i>>>o&1&&r++;return r},e._lctf.readClassDef=function(i,r){var o=e._bin,a=[],l=o.readUshort(i,r);if(r+=2,l==1){var c=o.readUshort(i,r);r+=2;var h=o.readUshort(i,r);r+=2;for(var u=0;u<h;u++)a.push(c+u),a.push(c+u),a.push(o.readUshort(i,r)),r+=2}if(l==2){var d=o.readUshort(i,r);for(r+=2,u=0;u<d;u++)a.push(o.readUshort(i,r)),r+=2,a.push(o.readUshort(i,r)),r+=2,a.push(o.readUshort(i,r)),r+=2}return a},e._lctf.getInterval=function(i,r){for(var o=0;o<i.length;o+=3){var a=i[o],l=i[o+1];if(i[o+2],a<=r&&r<=l)return o}return-1},e._lctf.readCoverage=function(i,r){var o=e._bin,a={};a.fmt=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);return r+=2,a.fmt==1&&(a.tab=o.readUshorts(i,r,l)),a.fmt==2&&(a.tab=o.readUshorts(i,r,3*l)),a},e._lctf.coverageIndex=function(i,r){var o=i.tab;if(i.fmt==1)return o.indexOf(r);if(i.fmt==2){var a=e._lctf.getInterval(o,r);if(a!=-1)return o[a+2]+(r-o[a])}return-1},e._lctf.readFeatureList=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var u=o.readASCII(i,r,4);r+=4;var d=o.readUshort(i,r);r+=2;var f=e._lctf.readFeatureTable(i,a+d);f.tag=u.trim(),l.push(f)}return l},e._lctf.readFeatureTable=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2,c>0&&(l.featureParams=a+c);var h=o.readUshort(i,r);r+=2,l.tab=[];for(var u=0;u<h;u++)l.tab.push(o.readUshort(i,r+2*u));return l},e._lctf.readScriptList=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var u=o.readASCII(i,r,4);r+=4;var d=o.readUshort(i,r);r+=2,l[u.trim()]=e._lctf.readScriptTable(i,a+d)}return l},e._lctf.readScriptTable=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2,c>0&&(l.default=e._lctf.readLangSysTable(i,a+c));var h=o.readUshort(i,r);r+=2;for(var u=0;u<h;u++){var d=o.readASCII(i,r,4);r+=4;var f=o.readUshort(i,r);r+=2,l[d.trim()]=e._lctf.readLangSysTable(i,a+f)}return l},e._lctf.readLangSysTable=function(i,r){var o=e._bin,a={};o.readUshort(i,r),r+=2,a.reqFeature=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);return r+=2,a.features=o.readUshorts(i,r,l),a},e.CFF={},e.CFF.parse=function(i,r,o){var a=e._bin;(i=new Uint8Array(i.buffer,r,o))[r=0],i[++r],i[++r],i[++r],r++;var l=[];r=e.CFF.readIndex(i,r,l);for(var c=[],h=0;h<l.length-1;h++)c.push(a.readASCII(i,r+l[h],l[h+1]-l[h]));r+=l[l.length-1];var u=[];r=e.CFF.readIndex(i,r,u);var d=[];for(h=0;h<u.length-1;h++)d.push(e.CFF.readDict(i,r+u[h],r+u[h+1]));r+=u[u.length-1];var f=d[0],g=[];r=e.CFF.readIndex(i,r,g);var v=[];for(h=0;h<g.length-1;h++)v.push(a.readASCII(i,r+g[h],g[h+1]-g[h]));if(r+=g[g.length-1],e.CFF.readSubrs(i,r,f),f.CharStrings){r=f.CharStrings,g=[],r=e.CFF.readIndex(i,r,g);var p=[];for(h=0;h<g.length-1;h++)p.push(a.readBytes(i,r+g[h],g[h+1]-g[h]));f.CharStrings=p}if(f.ROS){r=f.FDArray;var m=[];for(r=e.CFF.readIndex(i,r,m),f.FDArray=[],h=0;h<m.length-1;h++){var M=e.CFF.readDict(i,r+m[h],r+m[h+1]);e.CFF._readFDict(i,M,v),f.FDArray.push(M)}r+=m[m.length-1],r=f.FDSelect,f.FDSelect=[];var _=i[r];if(r++,_!=3)throw _;var y=a.readUshort(i,r);for(r+=2,h=0;h<y+1;h++)f.FDSelect.push(a.readUshort(i,r),i[r+2]),r+=3}return f.Encoding&&(f.Encoding=e.CFF.readEncoding(i,f.Encoding,f.CharStrings.length)),f.charset&&(f.charset=e.CFF.readCharset(i,f.charset,f.CharStrings.length)),e.CFF._readFDict(i,f,v),f},e.CFF._readFDict=function(i,r,o){var a;for(var l in r.Private&&(a=r.Private[1],r.Private=e.CFF.readDict(i,a,a+r.Private[0]),r.Private.Subrs&&e.CFF.readSubrs(i,a+r.Private.Subrs,r.Private)),r)["FamilyName","FontName","FullName","Notice","version","Copyright"].indexOf(l)!=-1&&(r[l]=o[r[l]-426+35])},e.CFF.readSubrs=function(i,r,o){var a=e._bin,l=[];r=e.CFF.readIndex(i,r,l);var c,h=l.length;c=h<1240?107:h<33900?1131:32768,o.Bias=c,o.Subrs=[];for(var u=0;u<l.length-1;u++)o.Subrs.push(a.readBytes(i,r+l[u],l[u+1]-l[u]))},e.CFF.tableSE=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,0,111,112,113,114,0,115,116,117,118,119,120,121,122,0,123,0,124,125,126,127,128,129,130,131,0,132,133,0,134,135,136,137,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,138,0,139,0,0,0,0,140,141,142,143,0,0,0,0,0,144,0,0,0,145,0,0,146,147,148,149,0,0,0,0],e.CFF.glyphByUnicode=function(i,r){for(var o=0;o<i.charset.length;o++)if(i.charset[o]==r)return o;return-1},e.CFF.glyphBySE=function(i,r){return r<0||r>255?-1:e.CFF.glyphByUnicode(i,e.CFF.tableSE[r])},e.CFF.readEncoding=function(i,r,o){e._bin;var a=[".notdef"],l=i[r];if(r++,l!=0)throw"error: unknown encoding format: "+l;var c=i[r];r++;for(var h=0;h<c;h++)a.push(i[r+h]);return a},e.CFF.readCharset=function(i,r,o){var a=e._bin,l=[".notdef"],c=i[r];if(r++,c==0)for(var h=0;h<o;h++){var u=a.readUshort(i,r);r+=2,l.push(u)}else{if(c!=1&&c!=2)throw"error: format: "+c;for(;l.length<o;){u=a.readUshort(i,r),r+=2;var d=0;for(c==1?(d=i[r],r++):(d=a.readUshort(i,r),r+=2),h=0;h<=d;h++)l.push(u),u++}}return l},e.CFF.readIndex=function(i,r,o){var a=e._bin,l=a.readUshort(i,r)+1,c=i[r+=2];if(r++,c==1)for(var h=0;h<l;h++)o.push(i[r+h]);else if(c==2)for(h=0;h<l;h++)o.push(a.readUshort(i,r+2*h));else if(c==3)for(h=0;h<l;h++)o.push(16777215&a.readUint(i,r+3*h-1));else if(l!=1)throw"unsupported offset size: "+c+", count: "+l;return(r+=l*c)-1},e.CFF.getCharString=function(i,r,o){var a=e._bin,l=i[r],c=i[r+1];i[r+2],i[r+3],i[r+4];var h=1,u=null,d=null;l<=20&&(u=l,h=1),l==12&&(u=100*l+c,h=2),21<=l&&l<=27&&(u=l,h=1),l==28&&(d=a.readShort(i,r+1),h=3),29<=l&&l<=31&&(u=l,h=1),32<=l&&l<=246&&(d=l-139,h=1),247<=l&&l<=250&&(d=256*(l-247)+c+108,h=2),251<=l&&l<=254&&(d=256*-(l-251)-c-108,h=2),l==255&&(d=a.readInt(i,r+1)/65535,h=5),o.val=d??"o"+u,o.size=h},e.CFF.readCharString=function(i,r,o){for(var a=r+o,l=e._bin,c=[];r<a;){var h=i[r],u=i[r+1];i[r+2],i[r+3],i[r+4];var d=1,f=null,g=null;h<=20&&(f=h,d=1),h==12&&(f=100*h+u,d=2),h!=19&&h!=20||(f=h,d=2),21<=h&&h<=27&&(f=h,d=1),h==28&&(g=l.readShort(i,r+1),d=3),29<=h&&h<=31&&(f=h,d=1),32<=h&&h<=246&&(g=h-139,d=1),247<=h&&h<=250&&(g=256*(h-247)+u+108,d=2),251<=h&&h<=254&&(g=256*-(h-251)-u-108,d=2),h==255&&(g=l.readInt(i,r+1)/65535,d=5),c.push(g??"o"+f),r+=d}return c},e.CFF.readDict=function(i,r,o){for(var a=e._bin,l={},c=[];r<o;){var h=i[r],u=i[r+1];i[r+2],i[r+3],i[r+4];var d=1,f=null,g=null;if(h==28&&(g=a.readShort(i,r+1),d=3),h==29&&(g=a.readInt(i,r+1),d=5),32<=h&&h<=246&&(g=h-139,d=1),247<=h&&h<=250&&(g=256*(h-247)+u+108,d=2),251<=h&&h<=254&&(g=256*-(h-251)-u-108,d=2),h==255)throw g=a.readInt(i,r+1)/65535,d=5,"unknown number";if(h==30){var v=[];for(d=1;;){var p=i[r+d];d++;var m=p>>4,M=15&p;if(m!=15&&v.push(m),M!=15&&v.push(M),M==15)break}for(var _="",y=[0,1,2,3,4,5,6,7,8,9,".","e","e-","reserved","-","endOfNumber"],A=0;A<v.length;A++)_+=y[v[A]];g=parseFloat(_)}h<=21&&(f=["version","Notice","FullName","FamilyName","Weight","FontBBox","BlueValues","OtherBlues","FamilyBlues","FamilyOtherBlues","StdHW","StdVW","escape","UniqueID","XUID","charset","Encoding","CharStrings","Private","Subrs","defaultWidthX","nominalWidthX"][h],d=1,h==12&&(f=["Copyright","isFixedPitch","ItalicAngle","UnderlinePosition","UnderlineThickness","PaintType","CharstringType","FontMatrix","StrokeWidth","BlueScale","BlueShift","BlueFuzz","StemSnapH","StemSnapV","ForceBold",0,0,"LanguageGroup","ExpansionFactor","initialRandomSeed","SyntheticBase","PostScript","BaseFontName","BaseFontBlend",0,0,0,0,0,0,"ROS","CIDFontVersion","CIDFontRevision","CIDFontType","CIDCount","UIDBase","FDArray","FDSelect","FontName"][u],d=2)),f!=null?(l[f]=c.length==1?c[0]:c,c=[]):c.push(g),r+=d}return l},e.cmap={},e.cmap.parse=function(i,r,o){i=new Uint8Array(i.buffer,r,o),r=0;var a=e._bin,l={};a.readUshort(i,r),r+=2;var c=a.readUshort(i,r);r+=2;var h=[];l.tables=[];for(var u=0;u<c;u++){var d=a.readUshort(i,r);r+=2;var f=a.readUshort(i,r);r+=2;var g=a.readUint(i,r);r+=4;var v="p"+d+"e"+f,p=h.indexOf(g);if(p==-1){var m;p=l.tables.length,h.push(g);var M=a.readUshort(i,g);M==0?m=e.cmap.parse0(i,g):M==4?m=e.cmap.parse4(i,g):M==6?m=e.cmap.parse6(i,g):M==12?m=e.cmap.parse12(i,g):console.debug("unknown format: "+M,d,f,g),l.tables.push(m)}if(l[v]!=null)throw"multiple tables for one platform+encoding";l[v]=p}return l},e.cmap.parse0=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2,a.map=[];for(var c=0;c<l-6;c++)a.map.push(i[r+c]);return a},e.cmap.parse4=function(i,r){var o=e._bin,a=r,l={};l.format=o.readUshort(i,r),r+=2;var c=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2;var h=o.readUshort(i,r);r+=2;var u=h/2;l.searchRange=o.readUshort(i,r),r+=2,l.entrySelector=o.readUshort(i,r),r+=2,l.rangeShift=o.readUshort(i,r),r+=2,l.endCount=o.readUshorts(i,r,u),r+=2*u,r+=2,l.startCount=o.readUshorts(i,r,u),r+=2*u,l.idDelta=[];for(var d=0;d<u;d++)l.idDelta.push(o.readShort(i,r)),r+=2;for(l.idRangeOffset=o.readUshorts(i,r,u),r+=2*u,l.glyphIdArray=[];r<a+c;)l.glyphIdArray.push(o.readUshort(i,r)),r+=2;return l},e.cmap.parse6=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,a.firstCode=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2,a.glyphIdArray=[];for(var c=0;c<l;c++)a.glyphIdArray.push(o.readUshort(i,r)),r+=2;return a},e.cmap.parse12=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2,r+=2,o.readUint(i,r),r+=4,o.readUint(i,r),r+=4;var l=o.readUint(i,r);r+=4,a.groups=[];for(var c=0;c<l;c++){var h=r+12*c,u=o.readUint(i,h+0),d=o.readUint(i,h+4),f=o.readUint(i,h+8);a.groups.push([u,d,f])}return a},e.glyf={},e.glyf.parse=function(i,r,o,a){for(var l=[],c=0;c<a.maxp.numGlyphs;c++)l.push(null);return l},e.glyf._parseGlyf=function(i,r){var o=e._bin,a=i._data,l=e._tabOffset(a,"glyf",i._offset)+i.loca[r];if(i.loca[r]==i.loca[r+1])return null;var c={};if(c.noc=o.readShort(a,l),l+=2,c.xMin=o.readShort(a,l),l+=2,c.yMin=o.readShort(a,l),l+=2,c.xMax=o.readShort(a,l),l+=2,c.yMax=o.readShort(a,l),l+=2,c.xMin>=c.xMax||c.yMin>=c.yMax)return null;if(c.noc>0){c.endPts=[];for(var h=0;h<c.noc;h++)c.endPts.push(o.readUshort(a,l)),l+=2;var u=o.readUshort(a,l);if(l+=2,a.length-l<u)return null;c.instructions=o.readBytes(a,l,u),l+=u;var d=c.endPts[c.noc-1]+1;for(c.flags=[],h=0;h<d;h++){var f=a[l];if(l++,c.flags.push(f),(8&f)!=0){var g=a[l];l++;for(var v=0;v<g;v++)c.flags.push(f),h++}}for(c.xs=[],h=0;h<d;h++){var p=(2&c.flags[h])!=0,m=(16&c.flags[h])!=0;p?(c.xs.push(m?a[l]:-a[l]),l++):m?c.xs.push(0):(c.xs.push(o.readShort(a,l)),l+=2)}for(c.ys=[],h=0;h<d;h++)p=(4&c.flags[h])!=0,m=(32&c.flags[h])!=0,p?(c.ys.push(m?a[l]:-a[l]),l++):m?c.ys.push(0):(c.ys.push(o.readShort(a,l)),l+=2);var M=0,_=0;for(h=0;h<d;h++)M+=c.xs[h],_+=c.ys[h],c.xs[h]=M,c.ys[h]=_}else{var y;c.parts=[];do{y=o.readUshort(a,l),l+=2;var A={m:{a:1,b:0,c:0,d:1,tx:0,ty:0},p1:-1,p2:-1};if(c.parts.push(A),A.glyphIndex=o.readUshort(a,l),l+=2,1&y){var T=o.readShort(a,l);l+=2;var w=o.readShort(a,l);l+=2}else T=o.readInt8(a,l),l++,w=o.readInt8(a,l),l++;2&y?(A.m.tx=T,A.m.ty=w):(A.p1=T,A.p2=w),8&y?(A.m.a=A.m.d=o.readF2dot14(a,l),l+=2):64&y?(A.m.a=o.readF2dot14(a,l),l+=2,A.m.d=o.readF2dot14(a,l),l+=2):128&y&&(A.m.a=o.readF2dot14(a,l),l+=2,A.m.b=o.readF2dot14(a,l),l+=2,A.m.c=o.readF2dot14(a,l),l+=2,A.m.d=o.readF2dot14(a,l),l+=2)}while(32&y);if(256&y){var L=o.readUshort(a,l);for(l+=2,c.instr=[],h=0;h<L;h++)c.instr.push(a[l]),l++}}return c},e.GDEF={},e.GDEF.parse=function(i,r,o,a){var l=r;r+=4;var c=e._bin.readUshort(i,r);return{glyphClassDef:c===0?null:e._lctf.readClassDef(i,l+c)}},e.GPOS={},e.GPOS.parse=function(i,r,o,a){return e._lctf.parse(i,r,o,a,e.GPOS.subt)},e.GPOS.subt=function(i,r,o,a){var l=e._bin,c=o,h={};if(h.fmt=l.readUshort(i,o),o+=2,r==1||r==2||r==3||r==7||r==8&&h.fmt<=2){var u=l.readUshort(i,o);o+=2,h.coverage=e._lctf.readCoverage(i,u+c)}if(r==1&&h.fmt==1){var d=l.readUshort(i,o);o+=2,d!=0&&(h.pos=e.GPOS.readValueRecord(i,o,d))}else if(r==2&&h.fmt>=1&&h.fmt<=2){d=l.readUshort(i,o),o+=2;var f=l.readUshort(i,o);o+=2;var g=e._lctf.numOfOnes(d),v=e._lctf.numOfOnes(f);if(h.fmt==1){h.pairsets=[];var p=l.readUshort(i,o);o+=2;for(var m=0;m<p;m++){var M=c+l.readUshort(i,o);o+=2;var _=l.readUshort(i,M);M+=2;for(var y=[],A=0;A<_;A++){var T=l.readUshort(i,M);M+=2,d!=0&&(P=e.GPOS.readValueRecord(i,M,d),M+=2*g),f!=0&&(I=e.GPOS.readValueRecord(i,M,f),M+=2*v),y.push({gid2:T,val1:P,val2:I})}h.pairsets.push(y)}}if(h.fmt==2){var w=l.readUshort(i,o);o+=2;var L=l.readUshort(i,o);o+=2;var b=l.readUshort(i,o);o+=2;var x=l.readUshort(i,o);for(o+=2,h.classDef1=e._lctf.readClassDef(i,c+w),h.classDef2=e._lctf.readClassDef(i,c+L),h.matrix=[],m=0;m<b;m++){var U=[];for(A=0;A<x;A++){var P=null,I=null;d!=0&&(P=e.GPOS.readValueRecord(i,o,d),o+=2*g),f!=0&&(I=e.GPOS.readValueRecord(i,o,f),o+=2*v),U.push({val1:P,val2:I})}h.matrix.push(U)}}}else if(r==4&&h.fmt==1)h.markCoverage=e._lctf.readCoverage(i,l.readUshort(i,o)+c),h.baseCoverage=e._lctf.readCoverage(i,l.readUshort(i,o+2)+c),h.markClassCount=l.readUshort(i,o+4),h.markArray=e.GPOS.readMarkArray(i,l.readUshort(i,o+6)+c),h.baseArray=e.GPOS.readBaseArray(i,l.readUshort(i,o+8)+c,h.markClassCount);else if(r==6&&h.fmt==1)h.mark1Coverage=e._lctf.readCoverage(i,l.readUshort(i,o)+c),h.mark2Coverage=e._lctf.readCoverage(i,l.readUshort(i,o+2)+c),h.markClassCount=l.readUshort(i,o+4),h.mark1Array=e.GPOS.readMarkArray(i,l.readUshort(i,o+6)+c),h.mark2Array=e.GPOS.readBaseArray(i,l.readUshort(i,o+8)+c,h.markClassCount);else{if(r==9&&h.fmt==1){var N=l.readUshort(i,o);o+=2;var W=l.readUint(i,o);if(o+=4,a.ltype==9)a.ltype=N;else if(a.ltype!=N)throw"invalid extension substitution";return e.GPOS.subt(i,a.ltype,c+W)}console.debug("unsupported GPOS table LookupType",r,"format",h.fmt)}return h},e.GPOS.readValueRecord=function(i,r,o){var a=e._bin,l=[];return l.push(1&o?a.readShort(i,r):0),r+=1&o?2:0,l.push(2&o?a.readShort(i,r):0),r+=2&o?2:0,l.push(4&o?a.readShort(i,r):0),r+=4&o?2:0,l.push(8&o?a.readShort(i,r):0),r+=8&o?2:0,l},e.GPOS.readBaseArray=function(i,r,o){var a=e._bin,l=[],c=r,h=a.readUshort(i,r);r+=2;for(var u=0;u<h;u++){for(var d=[],f=0;f<o;f++)d.push(e.GPOS.readAnchorRecord(i,c+a.readUshort(i,r))),r+=2;l.push(d)}return l},e.GPOS.readMarkArray=function(i,r){var o=e._bin,a=[],l=r,c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var u=e.GPOS.readAnchorRecord(i,o.readUshort(i,r+2)+l);u.markClass=o.readUshort(i,r),a.push(u),r+=4}return a},e.GPOS.readAnchorRecord=function(i,r){var o=e._bin,a={};return a.fmt=o.readUshort(i,r),a.x=o.readShort(i,r+2),a.y=o.readShort(i,r+4),a},e.GSUB={},e.GSUB.parse=function(i,r,o,a){return e._lctf.parse(i,r,o,a,e.GSUB.subt)},e.GSUB.subt=function(i,r,o,a){var l=e._bin,c=o,h={};if(h.fmt=l.readUshort(i,o),o+=2,r!=1&&r!=2&&r!=4&&r!=5&&r!=6)return null;if(r==1||r==2||r==4||r==5&&h.fmt<=2||r==6&&h.fmt<=2){var u=l.readUshort(i,o);o+=2,h.coverage=e._lctf.readCoverage(i,c+u)}if(r==1&&h.fmt>=1&&h.fmt<=2){if(h.fmt==1)h.delta=l.readShort(i,o),o+=2;else if(h.fmt==2){var d=l.readUshort(i,o);o+=2,h.newg=l.readUshorts(i,o,d),o+=2*h.newg.length}}else if(r==2&&h.fmt==1){d=l.readUshort(i,o),o+=2,h.seqs=[];for(var f=0;f<d;f++){var g=l.readUshort(i,o)+c;o+=2;var v=l.readUshort(i,g);h.seqs.push(l.readUshorts(i,g+2,v))}}else if(r==4)for(h.vals=[],d=l.readUshort(i,o),o+=2,f=0;f<d;f++){var p=l.readUshort(i,o);o+=2,h.vals.push(e.GSUB.readLigatureSet(i,c+p))}else if(r==5&&h.fmt==2){if(h.fmt==2){var m=l.readUshort(i,o);o+=2,h.cDef=e._lctf.readClassDef(i,c+m),h.scset=[];var M=l.readUshort(i,o);for(o+=2,f=0;f<M;f++){var _=l.readUshort(i,o);o+=2,h.scset.push(_==0?null:e.GSUB.readSubClassSet(i,c+_))}}}else if(r==6&&h.fmt==3){if(h.fmt==3){for(f=0;f<3;f++){d=l.readUshort(i,o),o+=2;for(var y=[],A=0;A<d;A++)y.push(e._lctf.readCoverage(i,c+l.readUshort(i,o+2*A)));o+=2*d,f==0&&(h.backCvg=y),f==1&&(h.inptCvg=y),f==2&&(h.ahedCvg=y)}d=l.readUshort(i,o),o+=2,h.lookupRec=e.GSUB.readSubstLookupRecords(i,o,d)}}else{if(r==7&&h.fmt==1){var T=l.readUshort(i,o);o+=2;var w=l.readUint(i,o);if(o+=4,a.ltype==9)a.ltype=T;else if(a.ltype!=T)throw"invalid extension substitution";return e.GSUB.subt(i,a.ltype,c+w)}console.debug("unsupported GSUB table LookupType",r,"format",h.fmt)}return h},e.GSUB.readSubClassSet=function(i,r){var o=e._bin.readUshort,a=r,l=[],c=o(i,r);r+=2;for(var h=0;h<c;h++){var u=o(i,r);r+=2,l.push(e.GSUB.readSubClassRule(i,a+u))}return l},e.GSUB.readSubClassRule=function(i,r){var o=e._bin.readUshort,a={},l=o(i,r),c=o(i,r+=2);r+=2,a.input=[];for(var h=0;h<l-1;h++)a.input.push(o(i,r)),r+=2;return a.substLookupRecords=e.GSUB.readSubstLookupRecords(i,r,c),a},e.GSUB.readSubstLookupRecords=function(i,r,o){for(var a=e._bin.readUshort,l=[],c=0;c<o;c++)l.push(a(i,r),a(i,r+2)),r+=4;return l},e.GSUB.readChainSubClassSet=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var u=o.readUshort(i,r);r+=2,l.push(e.GSUB.readChainSubClassRule(i,a+u))}return l},e.GSUB.readChainSubClassRule=function(i,r){for(var o=e._bin,a={},l=["backtrack","input","lookahead"],c=0;c<l.length;c++){var h=o.readUshort(i,r);r+=2,c==1&&h--,a[l[c]]=o.readUshorts(i,r,h),r+=2*a[l[c]].length}return h=o.readUshort(i,r),r+=2,a.subst=o.readUshorts(i,r,2*h),r+=2*a.subst.length,a},e.GSUB.readLigatureSet=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var u=o.readUshort(i,r);r+=2,l.push(e.GSUB.readLigature(i,a+u))}return l},e.GSUB.readLigature=function(i,r){var o=e._bin,a={chain:[]};a.nglyph=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2;for(var c=0;c<l-1;c++)a.chain.push(o.readUshort(i,r)),r+=2;return a},e.head={},e.head.parse=function(i,r,o){var a=e._bin,l={};return a.readFixed(i,r),r+=4,l.fontRevision=a.readFixed(i,r),r+=4,a.readUint(i,r),r+=4,a.readUint(i,r),r+=4,l.flags=a.readUshort(i,r),r+=2,l.unitsPerEm=a.readUshort(i,r),r+=2,l.created=a.readUint64(i,r),r+=8,l.modified=a.readUint64(i,r),r+=8,l.xMin=a.readShort(i,r),r+=2,l.yMin=a.readShort(i,r),r+=2,l.xMax=a.readShort(i,r),r+=2,l.yMax=a.readShort(i,r),r+=2,l.macStyle=a.readUshort(i,r),r+=2,l.lowestRecPPEM=a.readUshort(i,r),r+=2,l.fontDirectionHint=a.readShort(i,r),r+=2,l.indexToLocFormat=a.readShort(i,r),r+=2,l.glyphDataFormat=a.readShort(i,r),r+=2,l},e.hhea={},e.hhea.parse=function(i,r,o){var a=e._bin,l={};return a.readFixed(i,r),r+=4,l.ascender=a.readShort(i,r),r+=2,l.descender=a.readShort(i,r),r+=2,l.lineGap=a.readShort(i,r),r+=2,l.advanceWidthMax=a.readUshort(i,r),r+=2,l.minLeftSideBearing=a.readShort(i,r),r+=2,l.minRightSideBearing=a.readShort(i,r),r+=2,l.xMaxExtent=a.readShort(i,r),r+=2,l.caretSlopeRise=a.readShort(i,r),r+=2,l.caretSlopeRun=a.readShort(i,r),r+=2,l.caretOffset=a.readShort(i,r),r+=2,r+=8,l.metricDataFormat=a.readShort(i,r),r+=2,l.numberOfHMetrics=a.readUshort(i,r),r+=2,l},e.hmtx={},e.hmtx.parse=function(i,r,o,a){for(var l=e._bin,c={aWidth:[],lsBearing:[]},h=0,u=0,d=0;d<a.maxp.numGlyphs;d++)d<a.hhea.numberOfHMetrics&&(h=l.readUshort(i,r),r+=2,u=l.readShort(i,r),r+=2),c.aWidth.push(h),c.lsBearing.push(u);return c},e.kern={},e.kern.parse=function(i,r,o,a){var l=e._bin,c=l.readUshort(i,r);if(r+=2,c==1)return e.kern.parseV1(i,r-2,o,a);var h=l.readUshort(i,r);r+=2;for(var u={glyph1:[],rval:[]},d=0;d<h;d++){r+=2,o=l.readUshort(i,r),r+=2;var f=l.readUshort(i,r);r+=2;var g=f>>>8;if((g&=15)!=0)throw"unknown kern table format: "+g;r=e.kern.readFormat0(i,r,u)}return u},e.kern.parseV1=function(i,r,o,a){var l=e._bin;l.readFixed(i,r),r+=4;var c=l.readUint(i,r);r+=4;for(var h={glyph1:[],rval:[]},u=0;u<c;u++){l.readUint(i,r),r+=4;var d=l.readUshort(i,r);r+=2,l.readUshort(i,r),r+=2;var f=d>>>8;if((f&=15)!=0)throw"unknown kern table format: "+f;r=e.kern.readFormat0(i,r,h)}return h},e.kern.readFormat0=function(i,r,o){var a=e._bin,l=-1,c=a.readUshort(i,r);r+=2,a.readUshort(i,r),r+=2,a.readUshort(i,r),r+=2,a.readUshort(i,r),r+=2;for(var h=0;h<c;h++){var u=a.readUshort(i,r);r+=2;var d=a.readUshort(i,r);r+=2;var f=a.readShort(i,r);r+=2,u!=l&&(o.glyph1.push(u),o.rval.push({glyph2:[],vals:[]}));var g=o.rval[o.rval.length-1];g.glyph2.push(d),g.vals.push(f),l=u}return r},e.loca={},e.loca.parse=function(i,r,o,a){var l=e._bin,c=[],h=a.head.indexToLocFormat,u=a.maxp.numGlyphs+1;if(h==0)for(var d=0;d<u;d++)c.push(l.readUshort(i,r+(d<<1))<<1);if(h==1)for(d=0;d<u;d++)c.push(l.readUint(i,r+(d<<2)));return c},e.maxp={},e.maxp.parse=function(i,r,o){var a=e._bin,l={},c=a.readUint(i,r);return r+=4,l.numGlyphs=a.readUshort(i,r),r+=2,c==65536&&(l.maxPoints=a.readUshort(i,r),r+=2,l.maxContours=a.readUshort(i,r),r+=2,l.maxCompositePoints=a.readUshort(i,r),r+=2,l.maxCompositeContours=a.readUshort(i,r),r+=2,l.maxZones=a.readUshort(i,r),r+=2,l.maxTwilightPoints=a.readUshort(i,r),r+=2,l.maxStorage=a.readUshort(i,r),r+=2,l.maxFunctionDefs=a.readUshort(i,r),r+=2,l.maxInstructionDefs=a.readUshort(i,r),r+=2,l.maxStackElements=a.readUshort(i,r),r+=2,l.maxSizeOfInstructions=a.readUshort(i,r),r+=2,l.maxComponentElements=a.readUshort(i,r),r+=2,l.maxComponentDepth=a.readUshort(i,r),r+=2),l},e.name={},e.name.parse=function(i,r,o){var a=e._bin,l={};a.readUshort(i,r),r+=2;var c=a.readUshort(i,r);r+=2,a.readUshort(i,r);for(var h,u=["copyright","fontFamily","fontSubfamily","ID","fullName","version","postScriptName","trademark","manufacturer","designer","description","urlVendor","urlDesigner","licence","licenceURL","---","typoFamilyName","typoSubfamilyName","compatibleFull","sampleText","postScriptCID","wwsFamilyName","wwsSubfamilyName","lightPalette","darkPalette"],d=r+=2,f=0;f<c;f++){var g=a.readUshort(i,r);r+=2;var v=a.readUshort(i,r);r+=2;var p=a.readUshort(i,r);r+=2;var m=a.readUshort(i,r);r+=2;var M=a.readUshort(i,r);r+=2;var _=a.readUshort(i,r);r+=2;var y,A=u[m],T=d+12*c+_;if(g==0)y=a.readUnicode(i,T,M/2);else if(g==3&&v==0)y=a.readUnicode(i,T,M/2);else if(v==0)y=a.readASCII(i,T,M);else if(v==1)y=a.readUnicode(i,T,M/2);else if(v==3)y=a.readUnicode(i,T,M/2);else{if(g!=1)throw"unknown encoding "+v+", platformID: "+g;y=a.readASCII(i,T,M),console.debug("reading unknown MAC encoding "+v+" as ASCII")}var w="p"+g+","+p.toString(16);l[w]==null&&(l[w]={}),l[w][A!==void 0?A:m]=y,l[w]._lang=p}for(var L in l)if(l[L].postScriptName!=null&&l[L]._lang==1033)return l[L];for(var L in l)if(l[L].postScriptName!=null&&l[L]._lang==0)return l[L];for(var L in l)if(l[L].postScriptName!=null&&l[L]._lang==3084)return l[L];for(var L in l)if(l[L].postScriptName!=null)return l[L];for(var L in l){h=L;break}return console.debug("returning name table with languageID "+l[h]._lang),l[h]},e["OS/2"]={},e["OS/2"].parse=function(i,r,o){var a=e._bin.readUshort(i,r);r+=2;var l={};if(a==0)e["OS/2"].version0(i,r,l);else if(a==1)e["OS/2"].version1(i,r,l);else if(a==2||a==3||a==4)e["OS/2"].version2(i,r,l);else{if(a!=5)throw"unknown OS/2 table version: "+a;e["OS/2"].version5(i,r,l)}return l},e["OS/2"].version0=function(i,r,o){var a=e._bin;return o.xAvgCharWidth=a.readShort(i,r),r+=2,o.usWeightClass=a.readUshort(i,r),r+=2,o.usWidthClass=a.readUshort(i,r),r+=2,o.fsType=a.readUshort(i,r),r+=2,o.ySubscriptXSize=a.readShort(i,r),r+=2,o.ySubscriptYSize=a.readShort(i,r),r+=2,o.ySubscriptXOffset=a.readShort(i,r),r+=2,o.ySubscriptYOffset=a.readShort(i,r),r+=2,o.ySuperscriptXSize=a.readShort(i,r),r+=2,o.ySuperscriptYSize=a.readShort(i,r),r+=2,o.ySuperscriptXOffset=a.readShort(i,r),r+=2,o.ySuperscriptYOffset=a.readShort(i,r),r+=2,o.yStrikeoutSize=a.readShort(i,r),r+=2,o.yStrikeoutPosition=a.readShort(i,r),r+=2,o.sFamilyClass=a.readShort(i,r),r+=2,o.panose=a.readBytes(i,r,10),r+=10,o.ulUnicodeRange1=a.readUint(i,r),r+=4,o.ulUnicodeRange2=a.readUint(i,r),r+=4,o.ulUnicodeRange3=a.readUint(i,r),r+=4,o.ulUnicodeRange4=a.readUint(i,r),r+=4,o.achVendID=[a.readInt8(i,r),a.readInt8(i,r+1),a.readInt8(i,r+2),a.readInt8(i,r+3)],r+=4,o.fsSelection=a.readUshort(i,r),r+=2,o.usFirstCharIndex=a.readUshort(i,r),r+=2,o.usLastCharIndex=a.readUshort(i,r),r+=2,o.sTypoAscender=a.readShort(i,r),r+=2,o.sTypoDescender=a.readShort(i,r),r+=2,o.sTypoLineGap=a.readShort(i,r),r+=2,o.usWinAscent=a.readUshort(i,r),r+=2,o.usWinDescent=a.readUshort(i,r),r+=2},e["OS/2"].version1=function(i,r,o){var a=e._bin;return r=e["OS/2"].version0(i,r,o),o.ulCodePageRange1=a.readUint(i,r),r+=4,o.ulCodePageRange2=a.readUint(i,r),r+=4},e["OS/2"].version2=function(i,r,o){var a=e._bin;return r=e["OS/2"].version1(i,r,o),o.sxHeight=a.readShort(i,r),r+=2,o.sCapHeight=a.readShort(i,r),r+=2,o.usDefault=a.readUshort(i,r),r+=2,o.usBreak=a.readUshort(i,r),r+=2,o.usMaxContext=a.readUshort(i,r),r+=2},e["OS/2"].version5=function(i,r,o){var a=e._bin;return r=e["OS/2"].version2(i,r,o),o.usLowerOpticalPointSize=a.readUshort(i,r),r+=2,o.usUpperOpticalPointSize=a.readUshort(i,r),r+=2},e.post={},e.post.parse=function(i,r,o){var a=e._bin,l={};return l.version=a.readFixed(i,r),r+=4,l.italicAngle=a.readFixed(i,r),r+=4,l.underlinePosition=a.readShort(i,r),r+=2,l.underlineThickness=a.readShort(i,r),r+=2,l},e==null&&(e={}),e.U==null&&(e.U={}),e.U.codeToGlyph=function(i,r){var o=i.cmap,a=-1;if(o.p0e4!=null?a=o.p0e4:o.p3e1!=null?a=o.p3e1:o.p1e0!=null?a=o.p1e0:o.p0e3!=null&&(a=o.p0e3),a==-1)throw"no familiar platform and encoding!";var l=o.tables[a];if(l.format==0)return r>=l.map.length?0:l.map[r];if(l.format==4){for(var c=-1,h=0;h<l.endCount.length;h++)if(r<=l.endCount[h]){c=h;break}return c==-1||l.startCount[c]>r?0:65535&(l.idRangeOffset[c]!=0?l.glyphIdArray[r-l.startCount[c]+(l.idRangeOffset[c]>>1)-(l.idRangeOffset.length-c)]:r+l.idDelta[c])}if(l.format==12){if(r>l.groups[l.groups.length-1][1])return 0;for(h=0;h<l.groups.length;h++){var u=l.groups[h];if(u[0]<=r&&r<=u[1])return u[2]+(r-u[0])}return 0}throw"unknown cmap table format "+l.format},e.U.glyphToPath=function(i,r){var o={cmds:[],crds:[]};if(i.SVG&&i.SVG.entries[r]){var a=i.SVG.entries[r];return a==null?o:(typeof a=="string"&&(a=e.SVG.toPath(a),i.SVG.entries[r]=a),a)}if(i.CFF){var l={x:0,y:0,stack:[],nStems:0,haveWidth:!1,width:i.CFF.Private?i.CFF.Private.defaultWidthX:0,open:!1},c=i.CFF,h=i.CFF.Private;if(c.ROS){for(var u=0;c.FDSelect[u+2]<=r;)u+=2;h=c.FDArray[c.FDSelect[u+1]].Private}e.U._drawCFF(i.CFF.CharStrings[r],l,c,h,o)}else i.glyf&&e.U._drawGlyf(r,i,o);return o},e.U._drawGlyf=function(i,r,o){var a=r.glyf[i];a==null&&(a=r.glyf[i]=e.glyf._parseGlyf(r,i)),a!=null&&(a.noc>-1?e.U._simpleGlyph(a,o):e.U._compoGlyph(a,r,o))},e.U._simpleGlyph=function(i,r){for(var o=0;o<i.noc;o++){for(var a=o==0?0:i.endPts[o-1]+1,l=i.endPts[o],c=a;c<=l;c++){var h=c==a?l:c-1,u=c==l?a:c+1,d=1&i.flags[c],f=1&i.flags[h],g=1&i.flags[u],v=i.xs[c],p=i.ys[c];if(c==a)if(d){if(!f){e.U.P.moveTo(r,v,p);continue}e.U.P.moveTo(r,i.xs[h],i.ys[h])}else f?e.U.P.moveTo(r,i.xs[h],i.ys[h]):e.U.P.moveTo(r,(i.xs[h]+v)/2,(i.ys[h]+p)/2);d?f&&e.U.P.lineTo(r,v,p):g?e.U.P.qcurveTo(r,v,p,i.xs[u],i.ys[u]):e.U.P.qcurveTo(r,v,p,(v+i.xs[u])/2,(p+i.ys[u])/2)}e.U.P.closePath(r)}},e.U._compoGlyph=function(i,r,o){for(var a=0;a<i.parts.length;a++){var l={cmds:[],crds:[]},c=i.parts[a];e.U._drawGlyf(c.glyphIndex,r,l);for(var h=c.m,u=0;u<l.crds.length;u+=2){var d=l.crds[u],f=l.crds[u+1];o.crds.push(d*h.a+f*h.b+h.tx),o.crds.push(d*h.c+f*h.d+h.ty)}for(u=0;u<l.cmds.length;u++)o.cmds.push(l.cmds[u])}},e.U._getGlyphClass=function(i,r){var o=e._lctf.getInterval(r,i);return o==-1?0:r[o+2]},e.U._applySubs=function(i,r,o,a){for(var l=i.length-r-1,c=0;c<o.tabs.length;c++)if(o.tabs[c]!=null){var h,u=o.tabs[c];if(!u.coverage||(h=e._lctf.coverageIndex(u.coverage,i[r]))!=-1){if(o.ltype==1)i[r],u.fmt==1?i[r]=i[r]+u.delta:i[r]=u.newg[h];else if(o.ltype==4)for(var d=u.vals[h],f=0;f<d.length;f++){var g=d[f],v=g.chain.length;if(!(v>l)){for(var p=!0,m=0,M=0;M<v;M++){for(;i[r+m+(1+M)]==-1;)m++;g.chain[M]!=i[r+m+(1+M)]&&(p=!1)}if(p){for(i[r]=g.nglyph,M=0;M<v+m;M++)i[r+M+1]=-1;break}}}else if(o.ltype==5&&u.fmt==2)for(var _=e._lctf.getInterval(u.cDef,i[r]),y=u.cDef[_+2],A=u.scset[y],T=0;T<A.length;T++){var w=A[T],L=w.input;if(!(L.length>l)){for(p=!0,M=0;M<L.length;M++){var b=e._lctf.getInterval(u.cDef,i[r+1+M]);if(_==-1&&u.cDef[b+2]!=L[M]){p=!1;break}}if(p){var x=w.substLookupRecords;for(f=0;f<x.length;f+=2)x[f],x[f+1]}}}else if(o.ltype==6&&u.fmt==3){if(!e.U._glsCovered(i,u.backCvg,r-u.backCvg.length)||!e.U._glsCovered(i,u.inptCvg,r)||!e.U._glsCovered(i,u.ahedCvg,r+u.inptCvg.length))continue;var U=u.lookupRec;for(T=0;T<U.length;T+=2){_=U[T];var P=a[U[T+1]];e.U._applySubs(i,r+_,P,a)}}}}},e.U._glsCovered=function(i,r,o){for(var a=0;a<r.length;a++)if(e._lctf.coverageIndex(r[a],i[o+a])==-1)return!1;return!0},e.U.glyphsToPath=function(i,r,o){for(var a={cmds:[],crds:[]},l=0,c=0;c<r.length;c++){var h=r[c];if(h!=-1){for(var u=c<r.length-1&&r[c+1]!=-1?r[c+1]:0,d=e.U.glyphToPath(i,h),f=0;f<d.crds.length;f+=2)a.crds.push(d.crds[f]+l),a.crds.push(d.crds[f+1]);for(o&&a.cmds.push(o),f=0;f<d.cmds.length;f++)a.cmds.push(d.cmds[f]);o&&a.cmds.push("X"),l+=i.hmtx.aWidth[h],c<r.length-1&&(l+=e.U.getPairAdjustment(i,h,u))}}return a},e.U.P={},e.U.P.moveTo=function(i,r,o){i.cmds.push("M"),i.crds.push(r,o)},e.U.P.lineTo=function(i,r,o){i.cmds.push("L"),i.crds.push(r,o)},e.U.P.curveTo=function(i,r,o,a,l,c,h){i.cmds.push("C"),i.crds.push(r,o,a,l,c,h)},e.U.P.qcurveTo=function(i,r,o,a,l){i.cmds.push("Q"),i.crds.push(r,o,a,l)},e.U.P.closePath=function(i){i.cmds.push("Z")},e.U._drawCFF=function(i,r,o,a,l){for(var c=r.stack,h=r.nStems,u=r.haveWidth,d=r.width,f=r.open,g=0,v=r.x,p=r.y,m=0,M=0,_=0,y=0,A=0,T=0,w=0,L=0,b=0,x=0,U={val:0,size:0};g<i.length;){e.CFF.getCharString(i,g,U);var P=U.val;if(g+=U.size,P=="o1"||P=="o18")c.length%2!=0&&!u&&(d=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,u=!0;else if(P=="o3"||P=="o23")c.length%2!=0&&!u&&(d=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,u=!0;else if(P=="o4")c.length>1&&!u&&(d=c.shift()+a.nominalWidthX,u=!0),f&&e.U.P.closePath(l),p+=c.pop(),e.U.P.moveTo(l,v,p),f=!0;else if(P=="o5")for(;c.length>0;)v+=c.shift(),p+=c.shift(),e.U.P.lineTo(l,v,p);else if(P=="o6"||P=="o7")for(var I=c.length,N=P=="o6",W=0;W<I;W++){var B=c.shift();N?v+=B:p+=B,N=!N,e.U.P.lineTo(l,v,p)}else if(P=="o8"||P=="o24"){I=c.length;for(var se=0;se+6<=I;)m=v+c.shift(),M=p+c.shift(),_=m+c.shift(),y=M+c.shift(),v=_+c.shift(),p=y+c.shift(),e.U.P.curveTo(l,m,M,_,y,v,p),se+=6;P=="o24"&&(v+=c.shift(),p+=c.shift(),e.U.P.lineTo(l,v,p))}else{if(P=="o11")break;if(P=="o1234"||P=="o1235"||P=="o1236"||P=="o1237")P=="o1234"&&(M=p,_=(m=v+c.shift())+c.shift(),x=y=M+c.shift(),T=y,L=p,v=(w=(A=(b=_+c.shift())+c.shift())+c.shift())+c.shift(),e.U.P.curveTo(l,m,M,_,y,b,x),e.U.P.curveTo(l,A,T,w,L,v,p)),P=="o1235"&&(m=v+c.shift(),M=p+c.shift(),_=m+c.shift(),y=M+c.shift(),b=_+c.shift(),x=y+c.shift(),A=b+c.shift(),T=x+c.shift(),w=A+c.shift(),L=T+c.shift(),v=w+c.shift(),p=L+c.shift(),c.shift(),e.U.P.curveTo(l,m,M,_,y,b,x),e.U.P.curveTo(l,A,T,w,L,v,p)),P=="o1236"&&(m=v+c.shift(),M=p+c.shift(),_=m+c.shift(),x=y=M+c.shift(),T=y,w=(A=(b=_+c.shift())+c.shift())+c.shift(),L=T+c.shift(),v=w+c.shift(),e.U.P.curveTo(l,m,M,_,y,b,x),e.U.P.curveTo(l,A,T,w,L,v,p)),P=="o1237"&&(m=v+c.shift(),M=p+c.shift(),_=m+c.shift(),y=M+c.shift(),b=_+c.shift(),x=y+c.shift(),A=b+c.shift(),T=x+c.shift(),w=A+c.shift(),L=T+c.shift(),Math.abs(w-v)>Math.abs(L-p)?v=w+c.shift():p=L+c.shift(),e.U.P.curveTo(l,m,M,_,y,b,x),e.U.P.curveTo(l,A,T,w,L,v,p));else if(P=="o14"){if(c.length>0&&!u&&(d=c.shift()+o.nominalWidthX,u=!0),c.length==4){var j=c.shift(),K=c.shift(),q=c.shift(),F=c.shift(),V=e.CFF.glyphBySE(o,q),ne=e.CFF.glyphBySE(o,F);e.U._drawCFF(o.CharStrings[V],r,o,a,l),r.x=j,r.y=K,e.U._drawCFF(o.CharStrings[ne],r,o,a,l)}f&&(e.U.P.closePath(l),f=!1)}else if(P=="o19"||P=="o20")c.length%2!=0&&!u&&(d=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,u=!0,g+=h+7>>3;else if(P=="o21")c.length>2&&!u&&(d=c.shift()+a.nominalWidthX,u=!0),p+=c.pop(),v+=c.pop(),f&&e.U.P.closePath(l),e.U.P.moveTo(l,v,p),f=!0;else if(P=="o22")c.length>1&&!u&&(d=c.shift()+a.nominalWidthX,u=!0),v+=c.pop(),f&&e.U.P.closePath(l),e.U.P.moveTo(l,v,p),f=!0;else if(P=="o25"){for(;c.length>6;)v+=c.shift(),p+=c.shift(),e.U.P.lineTo(l,v,p);m=v+c.shift(),M=p+c.shift(),_=m+c.shift(),y=M+c.shift(),v=_+c.shift(),p=y+c.shift(),e.U.P.curveTo(l,m,M,_,y,v,p)}else if(P=="o26")for(c.length%2&&(v+=c.shift());c.length>0;)m=v,M=p+c.shift(),v=_=m+c.shift(),p=(y=M+c.shift())+c.shift(),e.U.P.curveTo(l,m,M,_,y,v,p);else if(P=="o27")for(c.length%2&&(p+=c.shift());c.length>0;)M=p,_=(m=v+c.shift())+c.shift(),y=M+c.shift(),v=_+c.shift(),p=y,e.U.P.curveTo(l,m,M,_,y,v,p);else if(P=="o10"||P=="o29"){var O=P=="o10"?a:o;if(c.length==0)console.debug("error: empty stack");else{var k=c.pop(),te=O.Subrs[k+O.Bias];r.x=v,r.y=p,r.nStems=h,r.haveWidth=u,r.width=d,r.open=f,e.U._drawCFF(te,r,o,a,l),v=r.x,p=r.y,h=r.nStems,u=r.haveWidth,d=r.width,f=r.open}}else if(P=="o30"||P=="o31"){var G=c.length,ae=(se=0,P=="o31");for(se+=G-(I=-3&G);se<I;)ae?(M=p,_=(m=v+c.shift())+c.shift(),p=(y=M+c.shift())+c.shift(),I-se==5?(v=_+c.shift(),se++):v=_,ae=!1):(m=v,M=p+c.shift(),_=m+c.shift(),y=M+c.shift(),v=_+c.shift(),I-se==5?(p=y+c.shift(),se++):p=y,ae=!0),e.U.P.curveTo(l,m,M,_,y,v,p),se+=4}else{if((P+"").charAt(0)=="o")throw console.debug("Unknown operation: "+P,i),P;c.push(P)}}}r.x=v,r.y=p,r.nStems=h,r.haveWidth=u,r.width=d,r.open=f};var t=e,n={Typr:t};return s.Typr=t,s.default=n,Object.defineProperty(s,"__esModule",{value:!0}),s}({}).Typr}/*!
Custom bundle of woff2otf (https://github.com/arty-name/woff2otf) with fflate
(https://github.com/101arrowz/fflate) for use in Troika text rendering. 
Original licenses apply: 
- fflate: https://github.com/101arrowz/fflate/blob/master/LICENSE (MIT)
- woff2otf.js: https://github.com/arty-name/woff2otf/blob/master/woff2otf.js (Apache2)
*/function R0(){return function(s){var e=Uint8Array,t=Uint16Array,n=Uint32Array,i=new e([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),r=new e([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),o=new e([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(P,I){for(var N=new t(31),W=0;W<31;++W)N[W]=I+=1<<P[W-1];var B=new n(N[30]);for(W=1;W<30;++W)for(var se=N[W];se<N[W+1];++se)B[se]=se-N[W]<<5|W;return[N,B]},l=a(i,2),c=l[0],h=l[1];c[28]=258,h[258]=28;for(var u=a(r,0)[0],d=new t(32768),f=0;f<32768;++f){var g=(43690&f)>>>1|(21845&f)<<1;g=(61680&(g=(52428&g)>>>2|(13107&g)<<2))>>>4|(3855&g)<<4,d[f]=((65280&g)>>>8|(255&g)<<8)>>>1}var v=function(P,I,N){for(var W=P.length,B=0,se=new t(I);B<W;++B)++se[P[B]-1];var j,K=new t(I);for(B=0;B<I;++B)K[B]=K[B-1]+se[B-1]<<1;{j=new t(1<<I);var q=15-I;for(B=0;B<W;++B)if(P[B])for(var F=B<<4|P[B],V=I-P[B],ne=K[P[B]-1]++<<V,O=ne|(1<<V)-1;ne<=O;++ne)j[d[ne]>>>q]=F}return j},p=new e(288);for(f=0;f<144;++f)p[f]=8;for(f=144;f<256;++f)p[f]=9;for(f=256;f<280;++f)p[f]=7;for(f=280;f<288;++f)p[f]=8;var m=new e(32);for(f=0;f<32;++f)m[f]=5;var M=v(p,9),_=v(m,5),y=function(P){for(var I=P[0],N=1;N<P.length;++N)P[N]>I&&(I=P[N]);return I},A=function(P,I,N){var W=I/8|0;return(P[W]|P[W+1]<<8)>>(7&I)&N},T=function(P,I){var N=I/8|0;return(P[N]|P[N+1]<<8|P[N+2]<<16)>>(7&I)},w=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],L=function(P,I,N){var W=new Error(I||w[P]);if(W.code=P,Error.captureStackTrace&&Error.captureStackTrace(W,L),!N)throw W;return W},b=function(P,I,N){var W=P.length;if(!W||N&&!N.l&&W<5)return I||new e(0);var B=!I||N,se=!N||N.i;N||(N={}),I||(I=new e(3*W));var j,K=function(xe){var Ne=I.length;if(xe>Ne){var We=new e(Math.max(2*Ne,xe));We.set(I),I=We}},q=N.f||0,F=N.p||0,V=N.b||0,ne=N.l,O=N.d,k=N.m,te=N.n,G=8*W;do{if(!ne){N.f=q=A(P,F,1);var ae=A(P,F+1,3);if(F+=3,!ae){var pe=P[(R=((j=F)/8|0)+(7&j&&1)+4)-4]|P[R-3]<<8,_e=R+pe;if(_e>W){se&&L(0);break}B&&K(V+pe),I.set(P.subarray(R,_e),V),N.b=V+=pe,N.p=F=8*_e;continue}if(ae==1)ne=M,O=_,k=9,te=5;else if(ae==2){var D=A(P,F,31)+257,he=A(P,F+10,15)+4,Pe=D+A(P,F+5,31)+1;F+=14;for(var Le=new e(Pe),fe=new e(19),ye=0;ye<he;++ye)fe[o[ye]]=A(P,F+3*ye,7);F+=3*he;var Se=y(fe),de=(1<<Se)-1,Ce=v(fe,Se);for(ye=0;ye<Pe;){var R,S=Ce[A(P,F,de)];if(F+=15&S,(R=S>>>4)<16)Le[ye++]=R;else{var X=0,Z=0;for(R==16?(Z=3+A(P,F,3),F+=2,X=Le[ye-1]):R==17?(Z=3+A(P,F,7),F+=3):R==18&&(Z=11+A(P,F,127),F+=7);Z--;)Le[ye++]=X}}var ie=Le.subarray(0,D),J=Le.subarray(D);k=y(ie),te=y(J),ne=v(ie,k),O=v(J,te)}else L(1);if(F>G){se&&L(0);break}}B&&K(V+131072);for(var we=(1<<k)-1,le=(1<<te)-1,ce=F;;ce=F){var be=(X=ne[T(P,F)&we])>>>4;if((F+=15&X)>G){se&&L(0);break}if(X||L(2),be<256)I[V++]=be;else{if(be==256){ce=F,ne=null;break}var ue=be-254;if(be>264){var Me=i[ye=be-257];ue=A(P,F,(1<<Me)-1)+c[ye],F+=Me}var ke=O[T(P,F)&le],Te=ke>>>4;if(ke||L(3),F+=15&ke,J=u[Te],Te>3&&(Me=r[Te],J+=T(P,F)&(1<<Me)-1,F+=Me),F>G){se&&L(0);break}B&&K(V+131072);for(var me=V+ue;V<me;V+=4)I[V]=I[V-J],I[V+1]=I[V+1-J],I[V+2]=I[V+2-J],I[V+3]=I[V+3-J];V=me}}N.l=ne,N.p=ce,N.b=V,ne&&(q=1,N.m=k,N.d=O,N.n=te)}while(!q);return V==I.length?I:function(xe,Ne,We){(We==null||We>xe.length)&&(We=xe.length);var E=new(xe instanceof t?t:xe instanceof n?n:e)(We-Ne);return E.set(xe.subarray(Ne,We)),E}(I,0,V)},x=new e(0),U=typeof TextDecoder<"u"&&new TextDecoder;try{U.decode(x,{stream:!0})}catch{}return s.convert_streams=function(P){var I=new DataView(P),N=0;function W(){var D=I.getUint16(N);return N+=2,D}function B(){var D=I.getUint32(N);return N+=4,D}function se(D){pe.setUint16(_e,D),_e+=2}function j(D){pe.setUint32(_e,D),_e+=4}for(var K={signature:B(),flavor:B(),length:B(),numTables:W(),reserved:W(),totalSfntSize:B(),majorVersion:W(),minorVersion:W(),metaOffset:B(),metaLength:B(),metaOrigLength:B(),privOffset:B(),privLength:B()},q=0;Math.pow(2,q)<=K.numTables;)q++;q--;for(var F=16*Math.pow(2,q),V=16*K.numTables-F,ne=12,O=[],k=0;k<K.numTables;k++)O.push({tag:B(),offset:B(),compLength:B(),origLength:B(),origChecksum:B()}),ne+=16;var te,G=new Uint8Array(12+16*O.length+O.reduce(function(D,he){return D+he.origLength+4},0)),ae=G.buffer,pe=new DataView(ae),_e=0;return j(K.flavor),se(K.numTables),se(F),se(q),se(V),O.forEach(function(D){j(D.tag),j(D.origChecksum),j(ne),j(D.origLength),D.outOffset=ne,(ne+=D.origLength)%4!=0&&(ne+=4-ne%4)}),O.forEach(function(D){var he,Pe=P.slice(D.offset,D.offset+D.compLength);if(D.compLength!=D.origLength){var Le=new Uint8Array(D.origLength);he=new Uint8Array(Pe,2),b(he,Le)}else Le=new Uint8Array(Pe);G.set(Le,D.outOffset);var fe=0;(ne=D.outOffset+D.origLength)%4!=0&&(fe=4-ne%4),G.set(new Uint8Array(fe).buffer,D.outOffset+D.origLength),te=ne+fe}),ae.slice(0,te)},Object.defineProperty(s,"__esModule",{value:!0}),s}({}).convert_streams}function P0(s,e){const t={M:2,L:2,Q:4,C:6,Z:0},n={C:"18g,ca,368,1kz",D:"17k,6,2,2+4,5+c,2+6,2+1,10+1,9+f,j+11,2+1,a,2,2+1,15+2,3,j+2,6+3,2+8,2,2,2+1,w+a,4+e,3+3,2,3+2,3+5,23+w,2f+4,3,2+9,2,b,2+3,3,1k+9,6+1,3+1,2+2,2+d,30g,p+y,1,1+1g,f+x,2,sd2+1d,jf3+4,f+3,2+4,2+2,b+3,42,2,4+2,2+1,2,3,t+1,9f+w,2,el+2,2+g,d+2,2l,2+1,5,3+1,2+1,2,3,6,16wm+1v",R:"17m+3,2,2,6+3,m,15+2,2+2,h+h,13,3+8,2,2,3+1,2,p+1,x,5+4,5,a,2,2,3,u,c+2,g+1,5,2+1,4+1,5j,6+1,2,b,2+2,f,2+1,1s+2,2,3+1,7,1ez0,2,2+1,4+4,b,4,3,b,42,2+2,4,3,2+1,2,o+3,ae,ep,x,2o+2,3+1,3,5+1,6",L:"x9u,jff,a,fd,jv",T:"4t,gj+33,7o+4,1+1,7c+18,2,2+1,2+1,2,21+a,2,1b+k,h,2u+6,3+5,3+1,2+3,y,2,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,3,7,6+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+d,1,1+1,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,ek,3+1,r+4,1e+4,6+5,2p+c,1+3,1,1+2,1+b,2db+2,3y,2p+v,ff+3,30+1,n9x,1+2,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,5s,6y+2,ea,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+9,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2,2b+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,470+8,at4+4,1o+6,t5,1s+3,2a,f5l+1,2+3,43o+2,a+7,1+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,1,gzau,v+2n,3l+6n"},i=1,r=2,o=4,a=8,l=16,c=32;let h;function u(w){if(!h){const L={R:r,L:i,D:o,C:l,U:c,T:a};h=new Map;for(let b in n){let x=0;n[b].split(",").forEach(U=>{let[P,I]=U.split("+");P=parseInt(P,36),I=I?parseInt(I,36):0,h.set(x+=P,L[b]);for(let N=I;N--;)h.set(++x,L[b])})}}return h.get(w)||c}const d=1,f=2,g=3,v=4,p=[null,"isol","init","fina","medi"];function m(w){const L=new Uint8Array(w.length);let b=c,x=d,U=-1;for(let P=0;P<w.length;P++){const I=w.codePointAt(P);let N=u(I)|0,W=d;N&a||(b&(i|o|l)?N&(r|o|l)?(W=g,(x===d||x===g)&&L[U]++):N&(i|c)&&(x===f||x===v)&&L[U]--:b&(r|c)&&(x===f||x===v)&&L[U]--,x=L[P]=W,b=N,U=P,I>65535&&P++)}return L}function M(w,L){const b=[];for(let U=0;U<L.length;U++){const P=L.codePointAt(U);P>65535&&U++,b.push(s.U.codeToGlyph(w,P))}const x=w.GSUB;if(x){const{lookupList:U,featureList:P}=x;let I;const N=/^(rlig|liga|mset|isol|init|fina|medi|half|pres|blws|ccmp)$/,W=[];P.forEach(B=>{if(N.test(B.tag))for(let se=0;se<B.tab.length;se++){if(W[B.tab[se]])continue;W[B.tab[se]]=!0;const j=U[B.tab[se]],K=/^(isol|init|fina|medi)$/.test(B.tag);K&&!I&&(I=m(L));for(let q=0;q<b.length;q++)(!I||!K||p[I[q]]===B.tag)&&s.U._applySubs(b,q,j,U)}})}return b}function _(w,L){const b=new Int16Array(L.length*3);let x=0;for(;x<L.length;x++){const N=L[x];if(N===-1)continue;b[x*3+2]=w.hmtx.aWidth[N];const W=w.GPOS;if(W){const B=W.lookupList;for(let se=0;se<B.length;se++){const j=B[se];for(let K=0;K<j.tabs.length;K++){const q=j.tabs[K];if(j.ltype===1){if(s._lctf.coverageIndex(q.coverage,N)!==-1&&q.pos){I(q.pos,x);break}}else if(j.ltype===2){let F=null,V=U();if(V!==-1){const ne=s._lctf.coverageIndex(q.coverage,L[V]);if(ne!==-1){if(q.fmt===1){const O=q.pairsets[ne];for(let k=0;k<O.length;k++)O[k].gid2===N&&(F=O[k])}else if(q.fmt===2){const O=s.U._getGlyphClass(L[V],q.classDef1),k=s.U._getGlyphClass(N,q.classDef2);F=q.matrix[O][k]}if(F){F.val1&&I(F.val1,V),F.val2&&I(F.val2,x);break}}}}else if(j.ltype===4){const F=s._lctf.coverageIndex(q.markCoverage,N);if(F!==-1){const V=U(P),ne=V===-1?-1:s._lctf.coverageIndex(q.baseCoverage,L[V]);if(ne!==-1){const O=q.markArray[F],k=q.baseArray[ne][O.markClass];b[x*3]=k.x-O.x+b[V*3]-b[V*3+2],b[x*3+1]=k.y-O.y+b[V*3+1];break}}}else if(j.ltype===6){const F=s._lctf.coverageIndex(q.mark1Coverage,N);if(F!==-1){const V=U();if(V!==-1){const ne=L[V];if(y(w,ne)===3){const O=s._lctf.coverageIndex(q.mark2Coverage,ne);if(O!==-1){const k=q.mark1Array[F],te=q.mark2Array[O][k.markClass];b[x*3]=te.x-k.x+b[V*3]-b[V*3+2],b[x*3+1]=te.y-k.y+b[V*3+1];break}}}}}}}}else if(w.kern&&!w.cff){const B=U();if(B!==-1){const se=w.kern.glyph1.indexOf(L[B]);if(se!==-1){const j=w.kern.rval[se].glyph2.indexOf(N);j!==-1&&(b[B*3+2]+=w.kern.rval[se].vals[j])}}}}return b;function U(N){for(let W=x-1;W>=0;W--)if(L[W]!==-1&&(!N||N(L[W])))return W;return-1}function P(N){return y(w,N)===1}function I(N,W){for(let B=0;B<3;B++)b[W*3+B]+=N[B]||0}}function y(w,L){const b=w.GDEF&&w.GDEF.glyphClassDef;return b?s.U._getGlyphClass(L,b):0}function A(...w){for(let L=0;L<w.length;L++)if(typeof w[L]=="number")return w[L]}function T(w){const L=Object.create(null),b=w["OS/2"],x=w.hhea,U=w.head.unitsPerEm,P=A(b&&b.sTypoAscender,x&&x.ascender,U),I={unitsPerEm:U,ascender:P,descender:A(b&&b.sTypoDescender,x&&x.descender,0),capHeight:A(b&&b.sCapHeight,P),xHeight:A(b&&b.sxHeight,P),lineGap:A(b&&b.sTypoLineGap,x&&x.lineGap),supportsCodePoint(N){return s.U.codeToGlyph(w,N)>0},forEachGlyph(N,W,B,se){let j=0;const K=1/I.unitsPerEm*W,q=M(w,N);let F=0;const V=_(w,q);return q.forEach((ne,O)=>{if(ne!==-1){let k=L[ne];if(!k){const{cmds:te,crds:G}=s.U.glyphToPath(w,ne);let ae="",pe=0;for(let Le=0,fe=te.length;Le<fe;Le++){const ye=t[te[Le]];ae+=te[Le];for(let Se=1;Se<=ye;Se++)ae+=(Se>1?",":"")+G[pe++]}let _e,D,he,Pe;if(G.length){_e=D=1/0,he=Pe=-1/0;for(let Le=0,fe=G.length;Le<fe;Le+=2){let ye=G[Le],Se=G[Le+1];ye<_e&&(_e=ye),Se<D&&(D=Se),ye>he&&(he=ye),Se>Pe&&(Pe=Se)}}else _e=he=D=Pe=0;k=L[ne]={index:ne,advanceWidth:w.hmtx.aWidth[ne],xMin:_e,yMin:D,xMax:he,yMax:Pe,path:ae}}se.call(null,k,j+V[O*3]*K,V[O*3+1]*K,F),j+=V[O*3+2]*K,B&&(j+=B*W)}F+=N.codePointAt(F)>65535?2:1}),j}};return I}return function(L){const b=new Uint8Array(L,0,4),x=s._bin.readASCII(b,0,4);if(x==="wOFF")L=e(L);else if(x==="wOF2")throw new Error("woff2 fonts not supported");return T(s.parse(L)[0])}}const L0=ji({name:"Typr Font Parser",dependencies:[C0,R0,P0],init(s,e,t){const n=s(),i=e();return t(n,i)}});/*!
Custom bundle of @unicode-font-resolver/client v1.0.2 (https://github.com/lojjic/unicode-font-resolver)
for use in Troika text rendering. 
Original MIT license applies
*/function U0(){return function(s){var e=function(){this.buckets=new Map};e.prototype.add=function(_){var y=_>>5;this.buckets.set(y,(this.buckets.get(y)||0)|1<<(31&_))},e.prototype.has=function(_){var y=this.buckets.get(_>>5);return y!==void 0&&(y&1<<(31&_))!=0},e.prototype.serialize=function(){var _=[];return this.buckets.forEach(function(y,A){_.push((+A).toString(36)+":"+y.toString(36))}),_.join(",")},e.prototype.deserialize=function(_){var y=this;this.buckets.clear(),_.split(",").forEach(function(A){var T=A.split(":");y.buckets.set(parseInt(T[0],36),parseInt(T[1],36))})};var t=Math.pow(2,8),n=t-1,i=~n;function r(_){var y=function(T){return T&i}(_).toString(16),A=function(T){return(T&i)+t-1}(_).toString(16);return"codepoint-index/plane"+(_>>16)+"/"+y+"-"+A+".json"}function o(_,y){var A=_&n,T=y.codePointAt(A/6|0);return((T=(T||48)-48)&1<<A%6)!=0}function a(_,y){var A;(A=_,A.replace(/U\+/gi,"").replace(/^,+|,+$/g,"").split(/,+/).map(function(T){return T.split("-").map(function(w){return parseInt(w.trim(),16)})})).forEach(function(T){var w=T[0],L=T[1];L===void 0&&(L=w),y(w,L)})}function l(_,y){a(_,function(A,T){for(var w=A;w<=T;w++)y(w)})}var c={},h={},u=new WeakMap,d="https://cdn.jsdelivr.net/gh/lojjic/unicode-font-resolver@v1.0.1/packages/data";function f(_){var y=u.get(_);return y||(y=new e,l(_.ranges,function(A){return y.add(A)}),u.set(_,y)),y}var g,v=new Map;function p(_,y,A){return _[y]?y:_[A]?A:function(T){for(var w in T)return w}(_)}function m(_,y){var A=y;if(!_.includes(A)){A=1/0;for(var T=0;T<_.length;T++)Math.abs(_[T]-y)<Math.abs(A-y)&&(A=_[T])}return A}function M(_){return g||(g=new Set,l("9-D,20,85,A0,1680,2000-200A,2028-202F,205F,3000",function(y){g.add(y)})),g.has(_)}return s.CodePointSet=e,s.clearCache=function(){c={},h={}},s.getFontsForString=function(_,y){y===void 0&&(y={});var A,T=y.lang;T===void 0&&(T=new RegExp("\\p{Script=Hangul}","u").test(A=_)?"ko":new RegExp("\\p{Script=Hiragana}|\\p{Script=Katakana}","u").test(A)?"ja":"en");var w=y.category;w===void 0&&(w="sans-serif");var L=y.style;L===void 0&&(L="normal");var b=y.weight;b===void 0&&(b=400);var x=(y.dataUrl||d).replace(/\/$/g,""),U=new Map,P=new Uint8Array(_.length),I={},N={},W=new Array(_.length),B=new Map,se=!1;function j(F){var V=v.get(F);return V||(V=fetch(x+"/"+F).then(function(ne){if(!ne.ok)throw new Error(ne.statusText);return ne.json().then(function(O){if(!Array.isArray(O)||O[0]!==1)throw new Error("Incorrect schema version; need 1, got "+O[0]);return O[1]})}).catch(function(ne){if(x!==d)return se||(console.error('unicode-font-resolver: Failed loading from dataUrl "'+x+'", trying default CDN. '+ne.message),se=!0),x=d,v.delete(F),j(F);throw ne}),v.set(F,V)),V}for(var K=function(F){var V=_.codePointAt(F),ne=r(V);W[F]=ne,c[ne]||B.has(ne)||B.set(ne,j(ne).then(function(O){c[ne]=O})),V>65535&&(F++,q=F)},q=0;q<_.length;q++)K(q);return Promise.all(B.values()).then(function(){B.clear();for(var F=function(ne){var O=_.codePointAt(ne),k=null,te=c[W[ne]],G=void 0;for(var ae in te){var pe=N[ae];if(pe===void 0&&(pe=N[ae]=new RegExp(ae).test(T||"en")),pe){for(var _e in G=ae,te[ae])if(o(O,te[ae][_e])){k=_e;break}break}}if(!k){e:for(var D in te)if(D!==G){for(var he in te[D])if(o(O,te[D][he])){k=he;break e}}}k||(console.debug("No font coverage for U+"+O.toString(16)),k="latin"),W[ne]=k,h[k]||B.has(k)||B.set(k,j("font-meta/"+k+".json").then(function(Pe){h[k]=Pe})),O>65535&&(ne++,V=ne)},V=0;V<_.length;V++)F(V);return Promise.all(B.values())}).then(function(){for(var F,V=null,ne=0;ne<_.length;ne++){var O=_.codePointAt(ne);if(V&&(M(O)||f(V).has(O)))P[ne]=P[ne-1];else{V=h[W[ne]];var k=I[V.id];if(!k){var te=V.typeforms,G=p(te,w,"sans-serif"),ae=p(te[G],L,"normal"),pe=m((F=te[G])===null||F===void 0?void 0:F[ae],b);k=I[V.id]=x+"/font-files/"+V.id+"/"+G+"."+ae+"."+pe+".woff"}var _e=U.get(k);_e==null&&(_e=U.size,U.set(k,_e)),P[ne]=_e}O>65535&&(ne++,P[ne]=P[ne-1])}return{fontUrls:Array.from(U.keys()),chars:P}})},Object.defineProperty(s,"__esModule",{value:!0}),s}({})}function D0(s,e){const t=Object.create(null),n=Object.create(null);function i(o,a){const l=c=>{console.error(`Failure loading font ${o}`,c)};try{const c=new XMLHttpRequest;c.open("get",o,!0),c.responseType="arraybuffer",c.onload=function(){if(c.status>=400)l(new Error(c.statusText));else if(c.status>0)try{const h=s(c.response);h.src=o,a(h)}catch(h){l(h)}},c.onerror=l,c.send()}catch(c){l(c)}}function r(o,a){let l=t[o];l?a(l):n[o]?n[o].push(a):(n[o]=[a],i(o,c=>{c.src=o,t[o]=c,n[o].forEach(h=>h(c)),delete n[o]}))}return function(o,a,{lang:l,fonts:c=[],style:h="normal",weight:u="normal",unicodeFontsURL:d}={}){const f=new Uint8Array(o.length),g=[];o.length||M();const v=new Map,p=[];if(h!=="italic"&&(h="normal"),typeof u!="number"&&(u=u==="bold"?700:400),c&&!Array.isArray(c)&&(c=[c]),c=c.slice().filter(y=>!y.lang||y.lang.test(l)).reverse(),c.length){let w=0;(function L(b=0){for(let x=b,U=o.length;x<U;x++){const P=o.codePointAt(x);if(w===1&&g[f[x-1]].supportsCodePoint(P)||x>0&&/\s/.test(o[x]))f[x]=f[x-1],w===2&&(p[p.length-1][1]=x);else for(let I=f[x],N=c.length;I<=N;I++)if(I===N){const W=w===2?p[p.length-1]:p[p.length]=[x,x];W[1]=x,w=2}else{f[x]=I;const{src:W,unicodeRange:B}=c[I];if(!B||_(P,B)){const se=t[W];if(!se){r(W,()=>{L(x)});return}if(se.supportsCodePoint(P)){let j=v.get(se);typeof j!="number"&&(j=g.length,g.push(se),v.set(se,j)),f[x]=j,w=1;break}}}P>65535&&x+1<U&&(f[x+1]=f[x],x++,w===2&&(p[p.length-1][1]=x))}m()})()}else p.push([0,o.length-1]),m();function m(){if(p.length){const y=p.map(A=>o.substring(A[0],A[1]+1)).join(`
`);e.getFontsForString(y,{lang:l||void 0,style:h,weight:u,dataUrl:d}).then(({fontUrls:A,chars:T})=>{const w=g.length;let L=0;p.forEach(x=>{for(let U=0,P=x[1]-x[0];U<=P;U++)f[x[0]+U]=T[L++]+w;L++});let b=0;A.forEach((x,U)=>{r(x,P=>{g[U+w]=P,++b===A.length&&M()})})})}else M()}function M(){a({chars:f,fonts:g})}function _(y,A){for(let T=0;T<A.length;T++){const[w,L=w]=A[T];if(w<=y&&y<=L)return!0}return!1}}}const I0=ji({name:"FontResolver",dependencies:[D0,L0,U0],init(s,e,t){return s(e,t())}});function F0(s,e){const n=/[\u00AD\u034F\u061C\u115F-\u1160\u17B4-\u17B5\u180B-\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFF8]/,i="[^\\S\\u00A0]",r=new RegExp(`${i}|[\\-\\u007C\\u00AD\\u2010\\u2012-\\u2014\\u2027\\u2056\\u2E17\\u2E40]`);function o({text:g,lang:v,fonts:p,style:m,weight:M,preResolvedFonts:_,unicodeFontsURL:y},A){const T=({chars:w,fonts:L})=>{let b,x;const U=[];for(let P=0;P<w.length;P++)w[P]!==x?(x=w[P],U.push(b={start:P,end:P,fontObj:L[w[P]]})):b.end=P;A(U)};_?T(_):s(g,T,{lang:v,fonts:p,style:m,weight:M,unicodeFontsURL:y})}function a({text:g="",font:v,lang:p,sdfGlyphSize:m=64,fontSize:M=400,fontWeight:_=1,fontStyle:y="normal",letterSpacing:A=0,lineHeight:T="normal",maxWidth:w=1/0,direction:L,textAlign:b="left",textIndent:x=0,whiteSpace:U="normal",overflowWrap:P="normal",anchorX:I=0,anchorY:N=0,metricsOnly:W=!1,unicodeFontsURL:B,preResolvedFonts:se=null,includeCaretPositions:j=!1,chunkedBoundsSize:K=8192,colorRanges:q=null},F){const V=u(),ne={fontLoad:0,typesetting:0};g.indexOf("\r")>-1&&(console.info("Typesetter: got text with \\r chars; normalizing to \\n"),g=g.replace(/\r\n/g,`
`).replace(/\r/g,`
`)),M=+M,A=+A,w=+w,T=T||"normal",x=+x,o({text:g,lang:p,style:y,weight:_,fonts:typeof v=="string"?[{src:v}]:v,unicodeFontsURL:B,preResolvedFonts:se},O=>{ne.fontLoad=u()-V;const k=isFinite(w);let te=null,G=null,ae=null,pe=null,_e=null,D=null,he=null,Pe=null,Le=0,fe=0,ye=U!=="nowrap";const Se=new Map,de=u();let Ce=x,R=0,S=new d;const X=[S];O.forEach(le=>{const{fontObj:ce}=le,{ascender:be,descender:ue,unitsPerEm:Me,lineGap:ke,capHeight:Te,xHeight:me}=ce;let xe=Se.get(ce);if(!xe){const z=M/Me,ee=T==="normal"?(be-ue+ke)*z:T*M,ge=(ee-(be-ue)*z)/2,Ae=Math.min(ee,(be-ue)*z),Re=(be+ue)/2*z+Ae/2;xe={index:Se.size,src:ce.src,fontObj:ce,fontSizeMult:z,unitsPerEm:Me,ascender:be*z,descender:ue*z,capHeight:Te*z,xHeight:me*z,lineHeight:ee,baseline:-ge-be*z,caretTop:Re,caretBottom:Re-Ae},Se.set(ce,xe)}const{fontSizeMult:Ne}=xe,We=g.slice(le.start,le.end+1);let E,Q;ce.forEachGlyph(We,M,A,(z,ee,ge,Ae)=>{ee+=R,Ae+=le.start,E=ee,Q=z;const Re=g.charAt(Ae),je=z.advanceWidth*Ne,Xe=S.count;let De;if("isEmpty"in z||(z.isWhitespace=!!Re&&new RegExp(i).test(Re),z.canBreakAfter=!!Re&&r.test(Re),z.isEmpty=z.xMin===z.xMax||z.yMin===z.yMax||n.test(Re)),!z.isWhitespace&&!z.isEmpty&&fe++,ye&&k&&!z.isWhitespace&&ee+je+Ce>w&&Xe){if(S.glyphAt(Xe-1).glyphObj.canBreakAfter)De=new d,Ce=-ee;else for(let $e=Xe;$e--;)if($e===0&&P==="break-word"){De=new d,Ce=-ee;break}else if(S.glyphAt($e).glyphObj.canBreakAfter){De=S.splitAt($e+1);const tt=De.glyphAt(0).x;Ce-=tt;for(let Qe=De.count;Qe--;)De.glyphAt(Qe).x-=tt;break}De&&(S.isSoftWrapped=!0,S=De,X.push(S),Le=w)}let Ye=S.glyphAt(S.count);Ye.glyphObj=z,Ye.x=ee+Ce,Ye.y=ge,Ye.width=je,Ye.charIndex=Ae,Ye.fontData=xe,Re===`
`&&(S=new d,X.push(S),Ce=-(ee+je+A*M)+x)}),R=E+Q.advanceWidth*Ne+A*M});let Z=0;X.forEach(le=>{let ce=!0;for(let be=le.count;be--;){const ue=le.glyphAt(be);ce&&!ue.glyphObj.isWhitespace&&(le.width=ue.x+ue.width,le.width>Le&&(Le=le.width),ce=!1);let{lineHeight:Me,capHeight:ke,xHeight:Te,baseline:me}=ue.fontData;Me>le.lineHeight&&(le.lineHeight=Me);const xe=me-le.baseline;xe<0&&(le.baseline+=xe,le.cap+=xe,le.ex+=xe),le.cap=Math.max(le.cap,le.baseline+ke),le.ex=Math.max(le.ex,le.baseline+Te)}le.baseline-=Z,le.cap-=Z,le.ex-=Z,Z+=le.lineHeight});let ie=0,J=0;if(I&&(typeof I=="number"?ie=-I:typeof I=="string"&&(ie=-Le*(I==="left"?0:I==="center"?.5:I==="right"?1:c(I)))),N&&(typeof N=="number"?J=-N:typeof N=="string"&&(J=N==="top"?0:N==="top-baseline"?-X[0].baseline:N==="top-cap"?-X[0].cap:N==="top-ex"?-X[0].ex:N==="middle"?Z/2:N==="bottom"?Z:N==="bottom-baseline"?-X[X.length-1].baseline:c(N)*Z)),!W){const le=e.getEmbeddingLevels(g,L);te=new Uint16Array(fe),G=new Uint8Array(fe),ae=new Float32Array(fe*2),pe={},he=[1/0,1/0,-1/0,-1/0],Pe=[],j&&(D=new Float32Array(g.length*4)),q&&(_e=new Uint8Array(fe*3));let ce=0,be=-1,ue=-1,Me,ke;if(X.forEach((Te,me)=>{let{count:xe,width:Ne}=Te;if(xe>0){let We=0;for(let Ae=xe;Ae--&&Te.glyphAt(Ae).glyphObj.isWhitespace;)We++;let E=0,Q=0;if(b==="center")E=(Le-Ne)/2;else if(b==="right")E=Le-Ne;else if(b==="justify"&&Te.isSoftWrapped){let Ae=0;for(let Re=xe-We;Re--;)Te.glyphAt(Re).glyphObj.isWhitespace&&Ae++;Q=(Le-Ne)/Ae}if(Q||E){let Ae=0;for(let Re=0;Re<xe;Re++){let je=Te.glyphAt(Re);const Xe=je.glyphObj;je.x+=E+Ae,Q!==0&&Xe.isWhitespace&&Re<xe-We&&(Ae+=Q,je.width+=Q)}}const z=e.getReorderSegments(g,le,Te.glyphAt(0).charIndex,Te.glyphAt(Te.count-1).charIndex);for(let Ae=0;Ae<z.length;Ae++){const[Re,je]=z[Ae];let Xe=1/0,De=-1/0;for(let Ye=0;Ye<xe;Ye++)if(Te.glyphAt(Ye).charIndex>=Re){let $e=Ye,tt=Ye;for(;tt<xe;tt++){let Qe=Te.glyphAt(tt);if(Qe.charIndex>je)break;tt<xe-We&&(Xe=Math.min(Xe,Qe.x),De=Math.max(De,Qe.x+Qe.width))}for(let Qe=$e;Qe<tt;Qe++){const ct=Te.glyphAt(Qe);ct.x=De-(ct.x+ct.width-Xe)}break}}let ee;const ge=Ae=>ee=Ae;for(let Ae=0;Ae<xe;Ae++){const Re=Te.glyphAt(Ae);ee=Re.glyphObj;const je=ee.index,Xe=le.levels[Re.charIndex]&1;if(Xe){const De=e.getMirroredCharacter(g[Re.charIndex]);De&&Re.fontData.fontObj.forEachGlyph(De,0,0,ge)}if(j){const{charIndex:De,fontData:Ye}=Re,$e=Re.x+ie,tt=Re.x+Re.width+ie;D[De*4]=Xe?tt:$e,D[De*4+1]=Xe?$e:tt,D[De*4+2]=Te.baseline+Ye.caretBottom+J,D[De*4+3]=Te.baseline+Ye.caretTop+J;const Qe=De-be;Qe>1&&h(D,be,Qe),be=De}if(q){const{charIndex:De}=Re;for(;De>ue;)ue++,q.hasOwnProperty(ue)&&(ke=q[ue])}if(!ee.isWhitespace&&!ee.isEmpty){const De=ce++,{fontSizeMult:Ye,src:$e,index:tt}=Re.fontData,Qe=pe[$e]||(pe[$e]={});Qe[je]||(Qe[je]={path:ee.path,pathBounds:[ee.xMin,ee.yMin,ee.xMax,ee.yMax]});const ct=Re.x+ie,bt=Re.y+Te.baseline+J;ae[De*2]=ct,ae[De*2+1]=bt;const vt=ct+ee.xMin*Ye,Kt=bt+ee.yMin*Ye,Ht=ct+ee.xMax*Ye,Vt=bt+ee.yMax*Ye;vt<he[0]&&(he[0]=vt),Kt<he[1]&&(he[1]=Kt),Ht>he[2]&&(he[2]=Ht),Vt>he[3]&&(he[3]=Vt),De%K===0&&(Me={start:De,end:De,rect:[1/0,1/0,-1/0,-1/0]},Pe.push(Me)),Me.end++;const pt=Me.rect;if(vt<pt[0]&&(pt[0]=vt),Kt<pt[1]&&(pt[1]=Kt),Ht>pt[2]&&(pt[2]=Ht),Vt>pt[3]&&(pt[3]=Vt),te[De]=je,G[De]=tt,q){const un=De*3;_e[un]=ke>>16&255,_e[un+1]=ke>>8&255,_e[un+2]=ke&255}}}}}),D){const Te=g.length-be;Te>1&&h(D,be,Te)}}const we=[];Se.forEach(({index:le,src:ce,unitsPerEm:be,ascender:ue,descender:Me,lineHeight:ke,capHeight:Te,xHeight:me})=>{we[le]={src:ce,unitsPerEm:be,ascender:ue,descender:Me,lineHeight:ke,capHeight:Te,xHeight:me}}),ne.typesetting=u()-de,F({glyphIds:te,glyphFontIndices:G,glyphPositions:ae,glyphData:pe,fontData:we,caretPositions:D,glyphColors:_e,chunkedBounds:Pe,fontSize:M,topBaseline:J+X[0].baseline,blockBounds:[ie,J-Z,ie+Le,J],visibleBounds:he,timings:ne})})}function l(g,v){a({...g,metricsOnly:!0},p=>{const[m,M,_,y]=p.blockBounds;v({width:_-m,height:y-M})})}function c(g){let v=g.match(/^([\d.]+)%$/),p=v?parseFloat(v[1]):NaN;return isNaN(p)?0:p/100}function h(g,v,p){const m=g[v*4],M=g[v*4+1],_=g[v*4+2],y=g[v*4+3],A=(M-m)/p;for(let T=0;T<p;T++){const w=(v+T)*4;g[w]=m+A*T,g[w+1]=m+A*(T+1),g[w+2]=_,g[w+3]=y}}function u(){return(self.performance||Date).now()}function d(){this.data=[]}const f=["glyphObj","x","y","width","charIndex","fontData"];return d.prototype={width:0,lineHeight:0,baseline:0,cap:0,ex:0,isSoftWrapped:!1,get count(){return Math.ceil(this.data.length/f.length)},glyphAt(g){let v=d.flyweight;return v.data=this.data,v.index=g,v},splitAt(g){let v=new d;return v.data=this.data.splice(g*f.length),v}},d.flyweight=f.reduce((g,v,p,m)=>(Object.defineProperty(g,v,{get(){return this.data[this.index*f.length+p]},set(M){this.data[this.index*f.length+p]=M}}),g),{data:null,index:0}),{typeset:a,measure:l}}const ri=()=>(self.performance||Date).now(),Fs=Bh();let Cc;function N0(s,e,t,n,i,r,o,a,l,c,h=!0){return h?k0(s,e,t,n,i,r,o,a,l,c).then(null,u=>(Cc||(console.warn("WebGL SDF generation failed, falling back to JS",u),Cc=!0),Pc(s,e,t,n,i,r,o,a,l,c))):Pc(s,e,t,n,i,r,o,a,l,c)}const gs=[],O0=5;let qo=0;function Gh(){const s=ri();for(;gs.length&&ri()-s<O0;)gs.shift()();qo=gs.length?setTimeout(Gh,0):0}const k0=(...s)=>new Promise((e,t)=>{gs.push(()=>{const n=ri();try{Fs.webgl.generateIntoCanvas(...s),e({timing:ri()-n})}catch(i){t(i)}}),qo||(qo=setTimeout(Gh,0))}),B0=4,z0=2e3,Rc={};let G0=0;function Pc(s,e,t,n,i,r,o,a,l,c){const h="TroikaTextSDFGenerator_JS_"+G0++%B0;let u=Rc[h];return u||(u=Rc[h]={workerModule:ji({name:h,workerId:h,dependencies:[Bh,ri],init(d,f){const g=d().javascript.generate;return function(...v){const p=f();return{textureData:g(...v),timing:f()-p}}},getTransferables(d){return[d.textureData.buffer]}}),requests:0,idleTimer:null}),u.requests++,clearTimeout(u.idleTimer),u.workerModule(s,e,t,n,i,r).then(({textureData:d,timing:f})=>{const g=ri(),v=new Uint8Array(d.length*4);for(let p=0;p<d.length;p++)v[p*4+c]=d[p];return Fs.webglUtils.renderImageData(o,v,a,l,s,e,1<<3-c),f+=ri()-g,--u.requests===0&&(u.idleTimer=setTimeout(()=>{_0(h)},z0)),{timing:f}})}function H0(s){s._warm||(Fs.webgl.isSupported(s),s._warm=!0)}const V0=Fs.webglUtils.resizeWebGLCanvasWithoutClearing,mr={unicodeFontsURL:null,sdfGlyphSize:64,sdfMargin:1/16,sdfExponent:9,textureWidth:2048},W0=new Ve;function Ri(){return(self.performance||Date).now()}const Lc=Object.create(null);function X0(s,e){s=j0({},s);const t=Ri(),n=[];if(s.font&&n.push({label:"user",src:q0(s.font)}),s.font=n,s.text=""+s.text,s.sdfGlyphSize=s.sdfGlyphSize||mr.sdfGlyphSize,s.unicodeFontsURL=s.unicodeFontsURL||mr.unicodeFontsURL,s.colorRanges!=null){let d={};for(let f in s.colorRanges)if(s.colorRanges.hasOwnProperty(f)){let g=s.colorRanges[f];typeof g!="number"&&(g=W0.set(g).getHex()),d[f]=g}s.colorRanges=d}Object.freeze(s);const{textureWidth:i,sdfExponent:r}=mr,{sdfGlyphSize:o}=s,a=i/o*4;let l=Lc[o];if(!l){const d=document.createElement("canvas");d.width=i,d.height=o*256/a,l=Lc[o]={glyphCount:0,sdfGlyphSize:o,sdfCanvas:d,sdfTexture:new At(d,void 0,void 0,void 0,zt,zt),contextLost:!1,glyphsByFont:new Map},l.sdfTexture.generateMipmaps=!1,Y0(l)}const{sdfTexture:c,sdfCanvas:h}=l;Wh(s).then(d=>{const{glyphIds:f,glyphFontIndices:g,fontData:v,glyphPositions:p,fontSize:m,timings:M}=d,_=[],y=new Float32Array(f.length*4);let A=0,T=0;const w=Ri(),L=v.map(I=>{let N=l.glyphsByFont.get(I.src);return N||l.glyphsByFont.set(I.src,N=new Map),N});f.forEach((I,N)=>{const W=g[N],{src:B,unitsPerEm:se}=v[W];let j=L[W].get(I);if(!j){const{path:ne,pathBounds:O}=d.glyphData[B][I],k=Math.max(O[2]-O[0],O[3]-O[1])/o*(mr.sdfMargin*o+.5),te=l.glyphCount++,G=[O[0]-k,O[1]-k,O[2]+k,O[3]+k];L[W].set(I,j={path:ne,atlasIndex:te,sdfViewBox:G}),_.push(j)}const{sdfViewBox:K}=j,q=p[T++],F=p[T++],V=m/se;y[A++]=q+K[0]*V,y[A++]=F+K[1]*V,y[A++]=q+K[2]*V,y[A++]=F+K[3]*V,f[N]=j.atlasIndex}),M.quads=(M.quads||0)+(Ri()-w);const b=Ri();M.sdf={};const x=h.height,U=Math.ceil(l.glyphCount/a),P=Math.pow(2,Math.ceil(Math.log2(U*o)));P>x&&(console.info(`Increasing SDF texture size ${x}->${P}`),V0(h,i,P),c.dispose()),Promise.all(_.map(I=>Hh(I,l,s.gpuAccelerateSDF).then(({timing:N})=>{M.sdf[I.atlasIndex]=N}))).then(()=>{_.length&&!l.contextLost&&(Vh(l),c.needsUpdate=!0),M.sdfTotal=Ri()-b,M.total=Ri()-t,e(Object.freeze({parameters:s,sdfTexture:c,sdfGlyphSize:o,sdfExponent:r,glyphBounds:y,glyphAtlasIndices:f,glyphColors:d.glyphColors,caretPositions:d.caretPositions,chunkedBounds:d.chunkedBounds,ascender:d.ascender,descender:d.descender,lineHeight:d.lineHeight,capHeight:d.capHeight,xHeight:d.xHeight,topBaseline:d.topBaseline,blockBounds:d.blockBounds,visibleBounds:d.visibleBounds,timings:d.timings}))})}),Promise.resolve().then(()=>{l.contextLost||H0(h)})}function Hh({path:s,atlasIndex:e,sdfViewBox:t},{sdfGlyphSize:n,sdfCanvas:i,contextLost:r},o){if(r)return Promise.resolve({timing:-1});const{textureWidth:a,sdfExponent:l}=mr,c=Math.max(t[2]-t[0],t[3]-t[1]),h=Math.floor(e/4),u=h%(a/n)*n,d=Math.floor(h/(a/n))*n,f=e%4;return N0(n,n,s,t,c,l,i,u,d,f,o)}function Y0(s){const e=s.sdfCanvas;e.addEventListener("webglcontextlost",t=>{console.log("Context Lost",t),t.preventDefault(),s.contextLost=!0}),e.addEventListener("webglcontextrestored",t=>{console.log("Context Restored",t),s.contextLost=!1;const n=[];s.glyphsByFont.forEach(i=>{i.forEach(r=>{n.push(Hh(r,s,!0))})}),Promise.all(n).then(()=>{Vh(s),s.sdfTexture.needsUpdate=!0})})}function j0(s,e){for(let t in e)e.hasOwnProperty(t)&&(s[t]=e[t]);return s}let ls;function q0(s){return ls||(ls=typeof document>"u"?{}:document.createElement("a")),ls.href=s,ls.href}function Vh(s){if(typeof createImageBitmap!="function"){console.info("Safari<15: applying SDF canvas workaround");const{sdfCanvas:e,sdfTexture:t}=s,{width:n,height:i}=e,r=s.sdfCanvas.getContext("webgl");let o=t.image.data;(!o||o.length!==n*i*4)&&(o=new Uint8Array(n*i*4),t.image={width:n,height:i,data:o},t.flipY=!1,t.isDataTexture=!0),r.readPixels(0,0,n,i,r.RGBA,r.UNSIGNED_BYTE,o)}}const K0=ji({name:"Typesetter",dependencies:[F0,I0,y0],init(s,e,t){return s(e,t())}}),Wh=ji({name:"Typesetter",dependencies:[K0],init(s){return function(e){return new Promise(t=>{s.typeset(e,t)})}},getTransferables(s){const e=[];for(let t in s)s[t]&&s[t].buffer&&e.push(s[t].buffer);return e}});Wh.onMainThread;const Uc={};function Z0(s){let e=Uc[s];return e||(e=Uc[s]=new li(1,1,s,s).translate(.5,.5,0)),e}const $0="aTroikaGlyphBounds",Dc="aTroikaGlyphIndex",J0="aTroikaGlyphColor";class Q0 extends w_{constructor(){super(),this.detail=1,this.curveRadius=0,this.groups=[{start:0,count:1/0,materialIndex:0},{start:0,count:1/0,materialIndex:1}],this.boundingSphere=new ai,this.boundingBox=new Mn}computeBoundingSphere(){}computeBoundingBox(){}set detail(e){if(e!==this._detail){this._detail=e,(typeof e!="number"||e<1)&&(e=1);let t=Z0(e);["position","normal","uv"].forEach(n=>{this.attributes[n]=t.attributes[n].clone()}),this.setIndex(t.getIndex().clone())}}get detail(){return this._detail}set curveRadius(e){e!==this._curveRadius&&(this._curveRadius=e,this._updateBounds())}get curveRadius(){return this._curveRadius}updateGlyphs(e,t,n,i,r){this.updateAttributeData($0,e,4),this.updateAttributeData(Dc,t,1),this.updateAttributeData(J0,r,3),this._blockBounds=n,this._chunkedBounds=i,this.instanceCount=t.length,this._updateBounds()}_updateBounds(){const e=this._blockBounds;if(e){const{curveRadius:t,boundingBox:n}=this;if(t){const{PI:i,floor:r,min:o,max:a,sin:l,cos:c}=Math,h=i/2,u=i*2,d=Math.abs(t),f=e[0]/d,g=e[2]/d,v=r((f+h)/u)!==r((g+h)/u)?-d:o(l(f)*d,l(g)*d),p=r((f-h)/u)!==r((g-h)/u)?d:a(l(f)*d,l(g)*d),m=r((f+i)/u)!==r((g+i)/u)?d*2:a(d-c(f)*d,d-c(g)*d);n.min.set(v,e[1],t<0?-m:0),n.max.set(p,e[3],t<0?0:m)}else n.min.set(e[0],e[1],0),n.max.set(e[2],e[3],0);n.getBoundingSphere(this.boundingSphere)}}applyClipRect(e){let t=this.getAttribute(Dc).count,n=this._chunkedBounds;if(n)for(let i=n.length;i--;){t=n[i].end;let r=n[i].rect;if(r[1]<e.w&&r[3]>e.y&&r[0]<e.z&&r[2]>e.x)break}this.instanceCount=t}updateAttributeData(e,t,n){const i=this.getAttribute(e);t?i&&i.array.length===t.length?(i.array.set(t),i.needsUpdate=!0):(this.setAttribute(e,new Go(t,n)),delete this._maxInstanceCount,this.dispose()):i&&this.deleteAttribute(e)}}const ex=`
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
`,tx=`
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
`,nx=`
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
`,ix=`
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
`;function rx(s){const e=jo(s,{chained:!0,extensions:{derivatives:!0},uniforms:{uTroikaSDFTexture:{value:null},uTroikaSDFTextureSize:{value:new Oe},uTroikaSDFGlyphSize:{value:0},uTroikaSDFExponent:{value:0},uTroikaTotalBounds:{value:new ut(0,0,0,0)},uTroikaClipRect:{value:new ut(0,0,0,0)},uTroikaEdgeOffset:{value:0},uTroikaFillOpacity:{value:1},uTroikaPositionOffset:{value:new Oe},uTroikaCurveRadius:{value:0},uTroikaBlurRadius:{value:0},uTroikaStrokeWidth:{value:0},uTroikaStrokeColor:{value:new Ve},uTroikaStrokeOpacity:{value:1},uTroikaOrient:{value:new Ke},uTroikaUseGlyphColors:{value:!0},uTroikaSDFDebug:{value:!1}},vertexDefs:ex,vertexTransform:tx,fragmentDefs:nx,fragmentColorTransform:ix,customRewriter({vertexShader:t,fragmentShader:n}){let i=/\buniform\s+vec3\s+diffuse\b/;return i.test(n)&&(n=n.replace(i,"varying vec3 vTroikaGlyphColor").replace(/\bdiffuse\b/g,"vTroikaGlyphColor"),i.test(t)||(t=t.replace(zh,`uniform vec3 diffuse;
$&
vTroikaGlyphColor = uTroikaUseGlyphColors ? aTroikaGlyphColor / 255.0 : diffuse;
`))),{vertexShader:t,fragmentShader:n}}});return e.transparent=!0,e.forceSinglePass=!0,Object.defineProperties(e,{isTroikaTextMaterial:{value:!0},shadowSide:{get(){return this.side},set(){}}}),e}const ua=new Mr({color:16777215,side:an,transparent:!0}),Ic=8421504,Fc=new it,cs=new H,Co=new H,fr=[],sx=new H,Ro="+x+y";function Nc(s){return Array.isArray(s)?s[0]:s}let Xh=()=>{const s=new Tt(new li(1,1),ua);return Xh=()=>s,s},Yh=()=>{const s=new Tt(new li(1,1,32,1),ua);return Yh=()=>s,s};const ox={type:"syncstart"},ax={type:"synccomplete"},jh=["font","fontSize","fontStyle","fontWeight","lang","letterSpacing","lineHeight","maxWidth","overflowWrap","text","direction","textAlign","textIndent","whiteSpace","anchorX","anchorY","colorRanges","sdfGlyphSize"],lx=jh.concat("material","color","depthOffset","clipRect","curveRadius","orientation","glyphGeometryDetail");class qh extends Tt{constructor(){const e=new Q0;super(e,null),this.text="",this.anchorX=0,this.anchorY=0,this.curveRadius=0,this.direction="auto",this.font=null,this.unicodeFontsURL=null,this.fontSize=.1,this.fontWeight="normal",this.fontStyle="normal",this.lang=null,this.letterSpacing=0,this.lineHeight="normal",this.maxWidth=1/0,this.overflowWrap="normal",this.textAlign="left",this.textIndent=0,this.whiteSpace="normal",this.material=null,this.color=null,this.colorRanges=null,this.outlineWidth=0,this.outlineColor=0,this.outlineOpacity=1,this.outlineBlur=0,this.outlineOffsetX=0,this.outlineOffsetY=0,this.strokeWidth=0,this.strokeColor=Ic,this.strokeOpacity=1,this.fillOpacity=1,this.depthOffset=0,this.clipRect=null,this.orientation=Ro,this.glyphGeometryDetail=1,this.sdfGlyphSize=null,this.gpuAccelerateSDF=!0,this.debugSDF=!1}sync(e){this._needsSync&&(this._needsSync=!1,this._isSyncing?(this._queuedSyncs||(this._queuedSyncs=[])).push(e):(this._isSyncing=!0,this.dispatchEvent(ox),X0({text:this.text,font:this.font,lang:this.lang,fontSize:this.fontSize||.1,fontWeight:this.fontWeight||"normal",fontStyle:this.fontStyle||"normal",letterSpacing:this.letterSpacing||0,lineHeight:this.lineHeight||"normal",maxWidth:this.maxWidth,direction:this.direction||"auto",textAlign:this.textAlign,textIndent:this.textIndent,whiteSpace:this.whiteSpace,overflowWrap:this.overflowWrap,anchorX:this.anchorX,anchorY:this.anchorY,colorRanges:this.colorRanges,includeCaretPositions:!0,sdfGlyphSize:this.sdfGlyphSize,gpuAccelerateSDF:this.gpuAccelerateSDF,unicodeFontsURL:this.unicodeFontsURL},t=>{this._isSyncing=!1,this._textRenderInfo=t,this.geometry.updateGlyphs(t.glyphBounds,t.glyphAtlasIndices,t.blockBounds,t.chunkedBounds,t.glyphColors);const n=this._queuedSyncs;n&&(this._queuedSyncs=null,this._needsSync=!0,this.sync(()=>{n.forEach(i=>i&&i())})),this.dispatchEvent(ax),e&&e()})))}onBeforeRender(e,t,n,i,r,o){this.sync(),r.isTroikaTextMaterial&&this._prepareForRender(r)}dispose(){this.geometry.dispose()}get textRenderInfo(){return this._textRenderInfo||null}createDerivedMaterial(e){return rx(e)}get material(){let e=this._derivedMaterial;const t=this._baseMaterial||this._defaultMaterial||(this._defaultMaterial=ua.clone());if((!e||!e.isDerivedFrom(t))&&(e=this._derivedMaterial=this.createDerivedMaterial(t),t.addEventListener("dispose",function n(){t.removeEventListener("dispose",n),e.dispose()})),this.hasOutline()){let n=e._outlineMtl;return n||(n=e._outlineMtl=Object.create(e,{id:{value:e.id+.1}}),n.isTextOutlineMaterial=!0,n.depthWrite=!1,n.map=null,e.addEventListener("dispose",function i(){e.removeEventListener("dispose",i),n.dispose()})),[n,e]}else return e}set material(e){e&&e.isTroikaTextMaterial?(this._derivedMaterial=e,this._baseMaterial=e.baseMaterial):this._baseMaterial=e}hasOutline(){return!!(this.outlineWidth||this.outlineBlur||this.outlineOffsetX||this.outlineOffsetY)}get glyphGeometryDetail(){return this.geometry.detail}set glyphGeometryDetail(e){this.geometry.detail=e}get curveRadius(){return this.geometry.curveRadius}set curveRadius(e){this.geometry.curveRadius=e}get customDepthMaterial(){return Nc(this.material).getDepthMaterial()}set customDepthMaterial(e){}get customDistanceMaterial(){return Nc(this.material).getDistanceMaterial()}set customDistanceMaterial(e){}_prepareForRender(e){const t=e.isTextOutlineMaterial,n=e.uniforms,i=this.textRenderInfo;if(i){const{sdfTexture:a,blockBounds:l}=i;n.uTroikaSDFTexture.value=a,n.uTroikaSDFTextureSize.value.set(a.image.width,a.image.height),n.uTroikaSDFGlyphSize.value=i.sdfGlyphSize,n.uTroikaSDFExponent.value=i.sdfExponent,n.uTroikaTotalBounds.value.fromArray(l),n.uTroikaUseGlyphColors.value=!t&&!!i.glyphColors;let c=0,h=0,u=0,d,f,g,v=0,p=0;if(t){let{outlineWidth:M,outlineOffsetX:_,outlineOffsetY:y,outlineBlur:A,outlineOpacity:T}=this;c=this._parsePercent(M)||0,h=Math.max(0,this._parsePercent(A)||0),d=T,v=this._parsePercent(_)||0,p=this._parsePercent(y)||0}else u=Math.max(0,this._parsePercent(this.strokeWidth)||0),u&&(g=this.strokeColor,n.uTroikaStrokeColor.value.set(g??Ic),f=this.strokeOpacity,f==null&&(f=1)),d=this.fillOpacity;n.uTroikaEdgeOffset.value=c,n.uTroikaPositionOffset.value.set(v,p),n.uTroikaBlurRadius.value=h,n.uTroikaStrokeWidth.value=u,n.uTroikaStrokeOpacity.value=f,n.uTroikaFillOpacity.value=d??1,n.uTroikaCurveRadius.value=this.curveRadius||0;let m=this.clipRect;if(m&&Array.isArray(m)&&m.length===4)n.uTroikaClipRect.value.fromArray(m);else{const M=(this.fontSize||.1)*100;n.uTroikaClipRect.value.set(l[0]-M,l[1]-M,l[2]+M,l[3]+M)}this.geometry.applyClipRect(n.uTroikaClipRect.value)}n.uTroikaSDFDebug.value=!!this.debugSDF,e.polygonOffset=!!this.depthOffset,e.polygonOffsetFactor=e.polygonOffsetUnits=this.depthOffset||0;const r=t?this.outlineColor||0:this.color;if(r==null)delete e.color;else{const a=e.hasOwnProperty("color")?e.color:e.color=new Ve;(r!==a._input||typeof r=="object")&&a.set(a._input=r)}let o=this.orientation||Ro;if(o!==e._orientation){let a=n.uTroikaOrient.value;o=o.replace(/[^-+xyz]/g,"");let l=o!==Ro&&o.match(/^([-+])([xyz])([-+])([xyz])$/);if(l){let[,c,h,u,d]=l;cs.set(0,0,0)[h]=c==="-"?1:-1,Co.set(0,0,0)[d]=u==="-"?-1:1,Fc.lookAt(sx,cs.cross(Co),Co),a.setFromMatrix4(Fc)}else a.identity();e._orientation=o}}_parsePercent(e){if(typeof e=="string"){let t=e.match(/^(-?[\d.]+)%$/),n=t?parseFloat(t[1]):NaN;e=(isNaN(n)?0:n/100)*this.fontSize}return e}localPositionToTextCoords(e,t=new Oe){t.copy(e);const n=this.curveRadius;return n&&(t.x=Math.atan2(e.x,Math.abs(n)-Math.abs(e.z))*Math.abs(n)),t}worldPositionToTextCoords(e,t=new Oe){return cs.copy(e),this.localPositionToTextCoords(this.worldToLocal(cs),t)}raycast(e,t){const{textRenderInfo:n,curveRadius:i}=this;if(n){const r=n.blockBounds,o=i?Yh():Xh(),a=o.geometry,{position:l,uv:c}=a.attributes;for(let h=0;h<c.count;h++){let u=r[0]+c.getX(h)*(r[2]-r[0]);const d=r[1]+c.getY(h)*(r[3]-r[1]);let f=0;i&&(f=i-Math.cos(u/i)*i,u=Math.sin(u/i)*i),l.setXYZ(h,u,d,f)}a.boundingSphere=this.geometry.boundingSphere,a.boundingBox=this.geometry.boundingBox,o.matrixWorld=this.matrixWorld,o.material.side=this.material.side,fr.length=0,o.raycast(e,fr);for(let h=0;h<fr.length;h++)fr[h].object=this,t.push(fr[h])}}copy(e){const t=this.geometry;return super.copy(e),this.geometry=t,lx.forEach(n=>{this[n]=e[n]}),this}clone(){return new this.constructor().copy(this)}}jh.forEach(s=>{const e="_private_"+s;Object.defineProperty(qh.prototype,s,{get(){return this[e]},set(t){t!==this[e]&&(this[e]=t,this._needsSync=!0)}})});new Mn;new Ve;const cx="/assets/DejaVuSans-CHjR2eXl.ttf",hx=6,ux=5;function dx(s,e,t,n,i){const r=new Set,o=[],a=Math.min(s.length,e.length/3);for(let l=0;l<a;l+=1){const c=s[l];if(n!==null&&n.has(c)){r.size<i&&r.add(c);continue}const h=e[l*3]-t.x,u=e[l*3+1]-t.y,d=e[l*3+2]-t.z;o.push({id:c,d2:h*h+u*u+d*d})}o.sort((l,c)=>l.d2-c.d2);for(const l of o){if(r.size>=i)break;r.add(l.id)}return r}class fx{constructor(e,t,n){this.scene=e,this.store=t,this.engine=n,this.active=new Map,this.pool=[],this.theme=null,this.styleStamp=0}applyTheme(e){this.theme=e,this.styleStamp+=1}_styleText(e){const{label:t}=this.theme;e.font=cx,e.fontSize=t.size,e.color=t.color,e.outlineColor=t.halo,e.outlineWidth=t.size*.12,e.anchorX="center",e.anchorY="bottom",e.userData.styleStamp=this.styleStamp}_acquire(e){const t=this.pool.pop()??new qh;return t.parent||this.scene.add(t),t.visible=!0,t.userData.opacity=0,t.userData.text=null,this.active.set(e,t),t}_release(e,t){t.visible=!1,this.active.delete(e),this.pool.push(t)}update(e,t,n,i){if(!this.theme)return;const r=this.theme.label.budget??200,o=dx(this.engine.ids,this.engine.positions,t.position,n,r);for(const l of o)!this.active.has(l)&&this.store.nodes.has(l)&&this._acquire(l);const a=Math.min(1,e*hx);for(const[l,c]of this.active){const h=this.store.nodes.get(l),u=i.get(l);if(!h||!u){this._release(l,c);continue}const d=o.has(l)?1:0;if(c.userData.opacity+=(d-c.userData.opacity)*a,d===0&&c.userData.opacity<.02){this._release(l,c);continue}c.fillOpacity=c.userData.opacity,c.outlineOpacity=c.userData.opacity;const f=Oh(h,this.store.nodeTypes,this.theme);c.position.set(u.x,u.y+ux*f.size,u.z),c.quaternion.copy(t.quaternion);const g=c.userData.styleStamp!==this.styleStamp;(c.userData.text!==h.label||g)&&(g&&this._styleText(c),c.text=h.label,c.userData.text=h.label,c.sync())}}}const Oc=8,px=1;function mx(s,e,t){const n=[];for(const c of s){const h=t.get(c);if(!h)return null;n.push(h)}const i=[];let r=0;for(let c=0;c<n.length-1;c+=1){const h=n[c+1].x-n[c].x,u=n[c+1].y-n[c].y,d=n[c+1].z-n[c].z,f=Math.hypot(h,u,d);i.push(f),r+=f}if(r===0)return{x:n[0].x,y:n[0].y,z:n[0].z};let a=Math.max(0,Math.min(1,e))*r;for(let c=0;c<i.length;c+=1){if(a<=i[c]||c===i.length-1){const h=i[c]===0?0:a/i[c],u=n[c],d=n[c+1];return{x:u.x+(d.x-u.x)*h,y:u.y+(d.y-u.y)*h,z:u.z+(d.z-u.z)*h}}a-=i[c]}const l=n[n.length-1];return{x:l.x,y:l.y,z:l.z}}function kc(s,e){let t=0;for(let n=0;n<s.length-1;n+=1){const i=e.get(s[n]),r=e.get(s[n+1]);if(!i||!r)return 0;t+=Math.hypot(r.x-i.x,r.y-i.y,r.z-i.z)}return t}function gx(s,e,t){if(s.color)return s.color;if(e&&e.color)return e.color;const n=t.palette??[];return s.type_index!=null&&n.length>0?n[s.type_index%n.length]:t.flow.color}class vx{constructor(e,t){this.path=e.path,this.flowType=e.flow_type??null,this.typeIndex=e.type_index??null,this.color=e.color??null,this.size=e.size??null,this.count=e.count,this.interval=Math.max(.001,e.interval??.2),this.speed=e.speed??1,this.flowId=e.flow_id??null,this.emitted=0,this.nextEmit=t,this.particles=[],this.done=!1}step(e,t){for(;this.nextEmit<=e&&(this.count===null||this.emitted<this.count);)this.particles.push({born:this.nextEmit}),this.emitted+=1,this.nextEmit+=this.interval;t>0&&(this.particles=this.particles.filter(n=>e-n.born<t)),this.count!==null&&this.emitted>=this.count&&this.particles.length===0&&(this.done=!0)}}class _x{constructor(e,{now:t=()=>performance.now()/1e3}={}){this.store=e,this.now=t,this.flows=[],this.persistent=new Map}applyFlow(e){const t=new vx(e,this.now());if(t.flowId!==null){const n=this.persistent.get(t.flowId);n&&(this.flows=this.flows.filter(i=>i!==n)),this.persistent.set(t.flowId,t)}this.flows.push(t)}stopFlow(e){const t=this.persistent.get(e);t&&(this.persistent.delete(e),this.flows=this.flows.filter(n=>n!==t))}replayInit(e){this.flows=this.flows.filter(t=>t.flowId===null),this.persistent.clear();for(const t of e)this.applyFlow(t)}activeCount(){return this.flows.length}_speedOf(e){var n;const t=((n=this.store.flowTypes)==null?void 0:n[e.flowType])??null;return e.speed*((t==null?void 0:t.speed)??1)}update(e,t){var a;const n=this.now(),i=((a=t==null?void 0:t.flow)==null?void 0:a.baseSpeed)??0,r=this._display;for(const l of this.flows){let c=0;if(i>0&&r){const h=kc(l.path,r),u=i*this._speedOf(l);c=h>0&&u>0?h/u:0}l.step(n,c)}const o=this.store.nodes;this.flows=this.flows.filter(l=>l.flowId===null&&l.done?!1:o&&l.path.some(c=>!o.has(c))?(l.flowId!==null&&this.persistent.delete(l.flowId),!1):!0)}setDisplay(e){this._display=e}particles(){var r;const e=this._display,t=this._theme,n=[];if(!e||!t){for(const o of this.flows)for(const a of o.particles)n.push({x:0,y:0,z:0,color:"#ffffff"});return n}const i=this.now();for(const o of this.flows){const a=kc(o.path,e),l=(t.flow.baseSpeed??0)*this._speedOf(o),c=a>0&&l>0?a/l:0,h=((r=this.store.flowTypes)==null?void 0:r[o.flowType])??null,u=gx(o,h,t),d=o.size??(h==null?void 0:h.size)??t.flow.size;for(const f of o.particles){const g=c>0?(i-f.born)/c:0,v=mx(o.path,g,e);v&&n.push({x:v.x,y:v.y,z:v.z,color:u,size:d})}}return n}prepare(e,t){this._display=e,this._theme=t}}class xx{constructor(e,t,n){this.scene=e,this.store=t,this.controller=n,this.theme=null,this.capacity=0,this.mesh=null,this._matrix=new it,this._color=new Ve,this._ensureCapacity(1024)}_ensureCapacity(e){var r;if(this.mesh&&e<=this.capacity)return;const t=Math.max(1024,2**Math.ceil(Math.log2(Math.max(1,e))));this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh.dispose());const n=new Ds(px,Oc,Oc),i=new Mr({color:16777215,transparent:!0,opacity:((r=this.theme)==null?void 0:r.flow.opacity)??.85,blending:vs,depthWrite:!1});this.mesh=new Uh(n,i,t),this.mesh.count=0,this.mesh.frustumCulled=!1,this.scene.add(this.mesh),this.capacity=t}applyTheme(e){this.theme=e,this.mesh&&(this.mesh.material.opacity=e.flow.opacity)}update(e,t,n){this.theme=t,this.controller.prepare(n,t),this.controller.update(e,t);const i=this.controller.particles();this._ensureCapacity(i.length);const r=this.mesh;for(let o=0;o<i.length;o+=1){const a=i[o],l=a.size??t.flow.size;this._matrix.makeScale(l,l,l),this._matrix.setPosition(a.x,a.y,a.z),r.setMatrixAt(o,this._matrix),this._color.set(a.color),r.setColorAt(o,this._color)}r.count=i.length,r.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0)}particleCount(){return this.mesh?this.mesh.count:0}dispose(){this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh.dispose(),this.mesh=null)}}const Ko=12,yx=.5;function bx(s,e,t,n=Ko){const i=(s.x+e.x)/2,r=(s.y+e.y)/2,o=(s.z+e.z)/2;let a=i,l=r,c=o;const h=e.x-s.x,u=e.y-s.y,d=e.z-s.z,f=Math.hypot(h,u,d);if(t>0&&f>0){const v=h/f,p=u/f,m=d/f;let M=-m,_=0,y=v;Math.hypot(M,_,y)<1e-6&&(M=0,_=m,y=-p);const A=Math.hypot(M,_,y)||1,T=t*f*yx;a=i+M/A*T,l=r+_/A*T,c=o+y/A*T}const g=[];for(let v=0;v<=n;v+=1){const p=v/n,m=1-p,M=m*m,_=2*m*p,y=p*p;g.push({x:M*s.x+_*a+y*e.x,y:M*s.y+_*l+y*e.y,z:M*s.z+_*c+y*e.z})}return g}const Sx=8,Mx=.75,Bc=.6,$n=600,Ex=1.1,zc="__default",Gc={sphere:()=>new Ds(3,12,8),box:()=>new Wi(4.8,4.8,4.8),octahedron:()=>new aa(3.6),tetrahedron:()=>new la(4.2)};class wx{constructor(e,t,n,{onCameraReady:i=()=>{}}={}){this.container=e,this.store=t,this.engine=n,this.onCameraReady=i,this.display=new Map,this.theme=Nh("modern"),this.scene=new m_,this.camera=null,this.controls=null,this.webgl=new p_({antialias:!0}),this.webgl.setSize(e.clientWidth,e.clientHeight,!1),this.webgl.setPixelRatio(window.devicePixelRatio),this.webgl.domElement.style.cssText="display:block;width:100%;height:100%",e.appendChild(this.webgl.domElement),this.ambient=new E_,this.scene.add(this.ambient),this.sun=new M_,this.sun.position.set(1,2,3),this.scene.add(this.sun),this.meshes=new Map,this._counts=new Map,this.composer=null,this.bloomPass=null,this.bloomDisabled=!1,this.onFrame=null,this.edgeCapacity=0,this.edgeLines=null,this.edgeStyle="line",this.edgeElasticity=0,this._ensureEdgeCapacity(8192),this.clock=new Fh,this._matrix=new it,this.raycaster=new T_,this._pointer=new Oe,this._tmpColor=new Ve,this._bgColor=new Ve,this._edgeColor=new Ve,this._edgeBase=new Ve("#666666"),this._edgeGlow=new Ve("#eaf2ff"),this.frameIndex=0,this._boundsStamp=-1,this.highlightSet=null,this.focusId=null,this.focusElapsed=0,this._focusFrom=new H,this.labels=new fx(this.scene,t,n),this.flowController=new _x(t,{}),this.flows=new xx(this.scene,t,this.flowController),this.applyTheme(this.theme),t.subscribe(r=>{r.kind==="init"&&!this.camera&&this._initCamera(t.config.dimensions)}),this._onResizeBound=()=>this._onResize(),window.addEventListener("resize",this._onResizeBound)}dispose(){var e,t,n;this.webgl.setAnimationLoop(null),window.removeEventListener("resize",this._onResizeBound);for(const i of this.meshes.values())i.geometry.dispose(),i.material.dispose();this.edgeLines&&(this.edgeLines.geometry.dispose(),this.edgeLines.material.dispose()),(e=this.flows)!=null&&e.mesh&&(this.flows.mesh.geometry.dispose(),this.flows.mesh.material.dispose());for(const i of[...this.labels.active.values(),...this.labels.pool])i.dispose();(t=this.bloomPass)==null||t.dispose(),(n=this.composer)==null||n.dispose(),this.webgl.dispose(),this.webgl.domElement.remove()}applyTheme(e){this.theme=e,this._bgColor.set(e.background),this.scene.background=new Ve(e.background),this.ambient.color.set(e.lights.ambient.color),this.ambient.intensity=e.lights.ambient.intensity,this.sun.color.set(e.lights.directional.color),this.sun.intensity=e.lights.directional.intensity,this._edgeBase.set(e.edge.color),this._edgeGlow.set(e.edge.glow??"#6fb8e8"),this.edgeLines.material.opacity=e.edge.opacity;for(const t of this.meshes.values())t.material.emissive.set(e.node.emissive),t.material.emissiveIntensity=e.node.emissiveIntensity;this.labels.applyTheme(e),this.flows.applyTheme(e),this._syncBloom()}setEdgeStyle({style:e,elasticity:t}={}){this.edgeStyle=e==="spline"?"spline":"line",this.edgeElasticity=Math.max(0,Math.min(1,t??0))}_syncBloom(){const e=!!(this.theme.bloom.enabled&&!this.bloomDisabled&&this.camera);if(e&&!this.composer){const t=new Oe;this.webgl.getSize(t),this.composer=new W_(this.webgl),this.composer.setPixelRatio(this.webgl.getPixelRatio()),this.composer.setSize(t.x,t.y),this.composer.addPass(new j_(this.scene,this.camera)),this.bloomPass=new Gi(t.clone(),this.theme.bloom.strength,this.theme.bloom.radius,this.theme.bloom.threshold),this.composer.addPass(this.bloomPass)}else!e&&this.composer?(this.bloomPass.dispose(),this.composer.dispose(),this.composer=null,this.bloomPass=null):this.composer&&(this.bloomPass.strength=this.theme.bloom.strength,this.bloomPass.radius=this.theme.bloom.radius,this.bloomPass.threshold=this.theme.bloom.threshold)}disableBloom(){this.bloomDisabled=!0,this._syncBloom()}setPixelRatio(e){var t;this.webgl.setPixelRatio(e),(t=this.composer)==null||t.setPixelRatio(e)}_buildCamera(e){const t=this.container.clientWidth/this.container.clientHeight;e===2?(this.camera=new Xi(-$n*t,$n*t,$n,-$n,-1e4,1e4),this.camera.position.set(0,0,1e3),this.controls=new bc(this.camera,this.webgl.domElement),this.controls.enableDamping=!0,this.controls.enableRotate=!1,this.controls.screenSpacePanning=!0,this.controls.mouseButtons={LEFT:xn.PAN,MIDDLE:xn.DOLLY,RIGHT:xn.PAN},this.controls.touches={ONE:Dn.PAN,TWO:Dn.DOLLY_PAN}):(this.camera=new qt(60,t,1,5e4),this.camera.position.set(0,0,900),this.controls=new bc(this.camera,this.webgl.domElement),this.controls.enableDamping=!0,this.controls.minDistance=20,this.controls.maxDistance=2e4)}_initCamera(e){this.camera||(this._buildCamera(e),this.onCameraReady())}setDimensions(e){var t,n;this.camera&&(this.camera.isOrthographicCamera?2:3)===e||((t=this.controls)==null||t.dispose(),this.composer&&((n=this.bloomPass)==null||n.dispose(),this.composer.dispose(),this.composer=null,this.bloomPass=null),this._buildCamera(e),this.onCameraReady())}resize(){this._onResize()}ensureCamera(){this.camera||this._initCamera(this.store.config.dimensions??3)}_onResize(){var t,n;if(this.webgl.setSize(this.container.clientWidth,this.container.clientHeight,!1),!this.camera)return;const e=this.container.clientWidth/this.container.clientHeight;this.camera.isOrthographicCamera?(this.camera.left=-$n*e,this.camera.right=$n*e):this.camera.aspect=e,this.camera.updateProjectionMatrix(),(t=this.composer)==null||t.setSize(this.container.clientWidth,this.container.clientHeight),(n=this.bloomPass)==null||n.setSize(this.container.clientWidth,this.container.clientHeight)}_ensureMesh(e,t,n){let i=this.meshes.get(e);if(i&&i.userData.shape===t&&n<=i.userData.capacity)return i;const r=Math.max(256,2**Math.ceil(Math.log2(Math.max(1,n))));i&&(this.scene.remove(i),i.geometry.dispose(),i.material.dispose(),i.dispose());const o=(Gc[t]??Gc.sphere)(),a=new y_({color:16777215,roughness:.4,emissive:new Ve(this.theme.node.emissive),emissiveIntensity:this.theme.node.emissiveIntensity});return i=new Uh(o,a,r),i.count=0,i.userData={shape:t,capacity:r,ids:[],cursor:0},this.scene.add(i),this.meshes.set(e,i),i}_ensureEdgeCapacity(e){if(e<=this.edgeCapacity)return;const t=Math.max(8192,2**Math.ceil(Math.log2(e)));this.edgeLines&&(this.scene.remove(this.edgeLines),this.edgeLines.geometry.dispose(),this.edgeLines.material.dispose());const n=new Lt;n.setAttribute("position",new Gt(new Float32Array(t*3),3)),n.setAttribute("color",new Gt(new Float32Array(t*3),3)),n.setDrawRange(0,0),this.edgeLines=new x_(n,new Dh({vertexColors:!0,transparent:!0,opacity:this.theme.edge.opacity})),this.edgeLines.frustumCulled=!1,this.scene.add(this.edgeLines),this.edgeCapacity=t}start(){this.webgl.setAnimationLoop(()=>this._frame())}_frame(){const e=this.clock.getDelta();this.camera&&(this.frameIndex+=1,this.onFrame&&this.onFrame(e),this._syncNodes(e),this._syncEdges(),this.labels.update(e,this.camera,this.highlightSet,this.display),this.flows.update(e,this.theme,this.display),this._stepFocus(e),this.controls.update(),this._syncBloom(),this.composer?this.composer.render():this.webgl.render(this.scene,this.camera))}_meshKey(e){return e&&e.type!=null&&this.store.nodeTypes[e.type]?e.type:zc}_syncNodes(e){const{ids:t,positions:n}=this.engine,i=Math.min(t.length,n.length/3),r=Math.min(1,e*Sx),o=new Set;for(let a=0;a<i;a+=1){const l=t[a];o.add(l);const c=n[a*3],h=n[a*3+1],u=n[a*3+2];let d=this.display.get(l);d||(d=new H(c,h,u),this.display.set(l,d)),d.x+=(c-d.x)*r,d.y+=(h-d.y)*r,d.z+=(u-d.z)*r}for(const a of this.display.keys())o.has(a)||this.display.delete(a);this._counts.clear();for(let a=0;a<i;a+=1){const l=this._meshKey(this.store.nodes.get(t[a]));this._counts.set(l,(this._counts.get(l)??0)+1)}for(const[a,l]of this._counts){const c=a===zc?this.theme.node.shape:this.store.nodeTypes[a].shape??this.theme.node.shape,h=this._ensureMesh(a,c,l);h.userData.cursor=0,h.userData.ids.length=l}for(const[a,l]of this.meshes)this._counts.has(a)||(l.count=0,l.userData.ids.length=0);for(let a=0;a<i;a+=1){const l=t[a],c=this.store.nodes.get(l)??{id:l,type:null,meta:{}},h=this.meshes.get(this._meshKey(c)),u=h.userData.cursor;h.userData.cursor+=1,h.userData.ids[u]=l;const d=Oh(c,this.store.nodeTypes,this.theme),f=this.display.get(l);this._matrix.makeScale(d.size,d.size,d.size),this._matrix.setPosition(f.x,f.y,f.z),h.setMatrixAt(u,this._matrix),this._tmpColor.set(d.color),this.highlightSet!==null&&!this.highlightSet.has(l)&&this._tmpColor.lerp(this._bgColor,Mx),h.setColorAt(u,this._tmpColor)}for(const[a,l]of this.meshes)this._counts.has(a)&&(l.count=l.userData.cursor,l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0))}_syncEdges(){const{edges:e}=this.store,t=this.edgeStyle==="spline"&&this.edgeElasticity>0,n=t?Ko*2:2;this._ensureEdgeCapacity(e.size*n);const i=this.edgeLines.geometry.getAttribute("position"),r=this.edgeLines.geometry.getAttribute("color");let o=0;for(const a of e.values()){const l=this.display.get(a.source),c=this.display.get(a.target);if(!l||!c)continue;const h=this._edgeColor,u=a.meta?Number(a.meta.brightness):NaN;if(a.meta&&a.meta.color?h.set(a.meta.color):Number.isFinite(u)?h.copy(this._edgeBase).lerp(this._edgeGlow,Math.max(0,Math.min(1,u))):h.copy(this._edgeBase),t){const d=bx(l,c,this.edgeElasticity,Ko);for(let f=0;f<d.length-1;f+=1)i.setXYZ(o,d[f].x,d[f].y,d[f].z),r.setXYZ(o,h.r,h.g,h.b),o+=1,i.setXYZ(o,d[f+1].x,d[f+1].y,d[f+1].z),r.setXYZ(o,h.r,h.g,h.b),o+=1}else i.setXYZ(o,l.x,l.y,l.z),r.setXYZ(o,h.r,h.g,h.b),o+=1,i.setXYZ(o,c.x,c.y,c.z),r.setXYZ(o,h.r,h.g,h.b),o+=1}this.edgeLines.geometry.setDrawRange(0,o),i.needsUpdate=!0,r.needsUpdate=!0}nodeCount(){let e=0;for(const t of this.meshes.values())e+=t.count;return e}pick(e,t){if(!this.camera||this.meshes.size===0)return null;const n=this.webgl.domElement.getBoundingClientRect();if(this._pointer.x=(e-n.left)/n.width*2-1,this._pointer.y=-((t-n.top)/n.height)*2+1,this._boundsStamp!==this.frameIndex){for(const o of this.meshes.values())o.count>0&&o.computeBoundingSphere();this._boundsStamp=this.frameIndex}this.raycaster.setFromCamera(this._pointer,this.camera);const i=[...this.meshes.values()].filter(o=>o.count>0),r=this.raycaster.intersectObjects(i,!1)[0];return!r||r.instanceId===void 0?null:r.object.userData.ids[r.instanceId]??null}viewState(){if(!this.camera||!this.controls)return null;const e=this.camera.position,t=this.controls.target;return{position:{x:e.x,y:e.y,z:e.z},target:{x:t.x,y:t.y,z:t.z},zoom:this.camera.zoom}}setHighlight(e){this.highlightSet=e}focusOn(e){this.controls&&(this.focusId=e,this.focusElapsed=0,this._focusFrom.copy(this.controls.target))}graphBounds(){const{ids:e,positions:t}=this.engine,n=Math.min(e.length,Math.floor(t.length/3));if(n===0)return null;const i=new H;for(let o=0;o<n;o+=1)i.x+=t[o*3],i.y+=t[o*3+1],i.z+=t[o*3+2];i.divideScalar(n);let r=0;for(let o=0;o<n;o+=1){const a=t[o*3]-i.x,l=t[o*3+1]-i.y,c=t[o*3+2]-i.z,h=a*a+l*l+c*c;h>r&&(r=h)}return{center:i,radius:Math.sqrt(r)}}centerOnGraph(){if(!this.camera||!this.controls)return!1;const e=this.graphBounds();if(!e)return!1;const t=Math.max(e.radius,1)*Ex;if(this.focusId=null,this.camera.isOrthographicCamera){const n=$n,i=n*(this.container.clientWidth/Math.max(1,this.container.clientHeight));this.camera.zoom=Math.min(n,i)/t,this.camera.updateProjectionMatrix(),this.camera.position.set(e.center.x,e.center.y,this.camera.position.z)}else{const n=Bo.degToRad(this.camera.fov),i=2*Math.atan(Math.tan(n/2)*this.camera.aspect),r=Math.min(n,i),o=t/Math.sin(r/2),a=new H().subVectors(this.camera.position,this.controls.target);a.lengthSq()<1e-6&&a.set(0,0,1),a.normalize().multiplyScalar(Bo.clamp(o,this.controls.minDistance,this.controls.maxDistance)),this.camera.position.copy(e.center).add(a)}return this.controls.target.copy(e.center),this.camera.lookAt(this.controls.target),this.controls.update(),this.controls.dispatchEvent({type:"change"}),!0}_stepFocus(e){if(this.focusId===null)return;if(!this.store.nodes.has(this.focusId)){this.focusId=null;return}const t=this.display.get(this.focusId);if(!t)return;this.focusElapsed=Math.min(this.focusElapsed+e,Bc);const n=this.focusElapsed/Bc,i=1-(1-n)**3;this.controls.target.lerpVectors(this._focusFrom,t,i),n>=1&&(this.focusId=null)}}const Kh=Object.freeze({physicsRunning:!0,edgeStyle:"line",edgeElasticity:.3,dimensions:3,clusters:!0});function Tx(s){return String(s??"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"viewbase"}function Zh(s){return`vb-options:${Tx(s)}`}function Ax(s,e=globalThis.localStorage,t=Kh){if(!e)return hs({...t});try{const n=e.getItem(Zh(s));if(!n)return hs({...t});const i=JSON.parse(n);return hs({...t,...i})}catch{return hs({...t})}}function hs(s){return Number(s.edgeElasticity)>0||(s.edgeElasticity=Kh.edgeElasticity),s}function us(s,e,t=globalThis.localStorage){t&&t.setItem(Zh(s),JSON.stringify(e))}const Hc=24,Vc=40,Cx=24;class Rx extends zn{constructor({screenId:e,container:t,manager:n,optionsProvider:i,onResize:r}){if(super({id:`__graph@${e??"default"}`,title:"Graf",widthChars:80,container:t,manager:n,kind:"graph",closable:!1,optionsProvider:i}),this.onResize=r,this._buildBody(),this._mount(),!this.size){const o=this._bounds();this._applySize(Math.max(Kc,o.width-2*Hc),Math.max(Zc,o.height-Vc-Cx)),this._place(Hc,Vc)}}_buildBody(){const e=document.createElement("div");e.dataset.role="graph-body",e.style.cssText="position:relative;overflow:hidden",this.body=e,this.el.appendChild(e)}_applySize(e,t){var n;super._applySize(e,t),this.body.style.overflow="hidden",(n=this.onResize)==null||n.call(this)}setMetrics(e){this.metricsEl||(this.metricsEl=document.createElement("span"),this.metricsEl.dataset.role="graph-metrics",this.metricsEl.style.cssText=["font-weight:400","font-size:11px","opacity:0.8","white-space:nowrap","flex:0 0 auto"].join(";"),this.bar.insertBefore(this.metricsEl,this.minGadget)),this.metricsEl.textContent=e}_renderBody(){}}function Px(s){const{screenId:e,store:t,sendEvent:n,windowManager:i,setOptionsFallback:r,onThemeChange:o,applyTheme:a}=s,l=new D_(t);let c=null,h=!0,u=!1;function d(){l.setPaused(u||!h)}let f=null;i.registerType("graph",()=>i.adopt(new Rx({screenId:e,container:s.container,manager:i,optionsProvider:()=>c,onResize:()=>f==null?void 0:f.resize()})));const g=i.open("graph");r(()=>c);function v(b,x){const U=x??t.config.highlight_neighbors??1,P=Vu(t,b,U);f.setHighlight(P.size>0?P:null)}let p=null;f=new wx(g.body,t,l,{onCameraReady:()=>{const b=f.camera.isOrthographicCamera;p?p.setCameraControls(f.camera,f.controls,b):(new U_(f.webgl.domElement,(U,P)=>f.pick(U,P),n,{onNodeClick:U=>{var I;const P=t.config.highlight_neighbors??1;P>0&&v(U,P),f.focusOn(U),(I=t.config.detail_window)!=null&&I.open_on_click&&i.open("detail",{nodeId:U})},onBackgroundClick:()=>{f.setHighlight(null)}}),p=new R_(f.camera,f.controls,{is2d:b,hasFocus:()=>i.hasKeyboard(g)&&g.body.offsetParent!==null,onCenter:()=>f.centerOnGraph()}));const x=Uo(()=>{const U=f.viewState();U&&n(ps("view_change",U))},100);f.controls.addEventListener("change",x)}}),o(b=>f.applyTheme(b));function m(b){f.setDimensions(b),l.setDimensions(b),t.config.dimensions=b}function M(b,x){c=[{key:"physics-running",label:"Physics running",checked:x.physicsRunning,onToggle:U=>{x.physicsRunning=U,h=U,d(),us(b,x),M(b,x)}},{key:"edge-spline",label:"Curved edges (spline)",checked:x.edgeStyle==="spline",onToggle:U=>{x.edgeStyle=U?"spline":"line",f.setEdgeStyle({style:x.edgeStyle,elasticity:x.edgeElasticity}),us(b,x),M(b,x)}},{key:"dimensions-3d",label:"3D view",checked:x.dimensions===3,onToggle:U=>{x.dimensions=U?3:2,m(x.dimensions),us(b,x),M(b,x)}},{key:"clusters",label:"Clusters (regions)",checked:x.clusters!==!1,onToggle:U=>{x.clusters=U,l.setClusters(U),us(b,x),M(b,x)}}],i.refreshOptions()}function _(b){var P,I;const x={physicsRunning:!0,edgeStyle:((P=t.config.edge_style)==null?void 0:P.style)??"line",edgeElasticity:((I=t.config.edge_style)==null?void 0:I.elasticity)??.3,dimensions:t.config.dimensions??3,clusters:!0},U=Ax(b,void 0,x);h=U.physicsRunning,d(),f.setEdgeStyle({style:U.edgeStyle,elasticity:U.edgeElasticity}),m(U.dimensions),l.setClusters(U.clusters!==!1),M(b,U)}const y=b=>{b===1&&f.disableBloom(),b===2&&f.setPixelRatio(1)},A=new F_(y);let T=null;function w(b){b<=0||(T=T===null?1/b:T+(1/b-T)*Math.min(1,b*2))}const L=Uo(()=>{const b=T===null?"–":Math.round(T),x=(t.config.dimensions??3)===3?"3D":"2D";g.setMetrics(`${x} · ${t.nodes.size} uzlů · ${b} fps`)},500);return f.start(),{name:"graph",onInit(){f.ensureCamera(),g.setTitle(t.config.title||"Graf"),f.flowController.replayInit(t.flows??[]),f.setEdgeStyle(t.config.edge_style??{style:"line",elasticity:0}),_(t.config.title);const b=t.config.quality??"auto";b==="low"&&(y(1),y(2)),f.onFrame=x=>{w(x),L(),b==="auto"&&A.frame(x)}},actions:{focus:b=>f.focusOn(b.node_id),highlight:b=>v(b.node_id,b.depth),flow:b=>f.flowController.applyFlow(b),stop_flow:b=>f.flowController.stopFlow(b.flow_id),set_theme:b=>{t.config.theme=b.theme,a(b.theme)},set_edge_style:b=>f.setEdgeStyle(b),define_type:b=>t.applyNodeType(b.name,b.style)},setVisible(b){b?f.start():f.webgl.setAnimationLoop(null)},setResourcesPaused(b){u=b,d()},destroy(){l.terminate(),f.dispose()}}}const Lx=8,Ux=220;function Dx(s){const e=Number(s);return!Number.isFinite(e)||e<=0?60:Math.max(20,Math.round(e/Lx))}class Ix extends zn{constructor({id:e,title:t,prompt:n,width:i,onInput:r,container:o,manager:a,closable:l,input:c}){super({id:e,title:t,widthChars:Dx(i),container:o,manager:a,kind:"terminal",closable:l}),this.prompt=n??"> ",this.hasInput=c!==!1,this.onInput=r,this.wordWrap=!0,this._buildBody(),this._mount()}getOptionsItems(){return[{key:"word-wrap",label:"Word Wrap",checked:this.wordWrap,onToggle:e=>{this.setWordWrap(e),this.manager.refreshOptions()}}]}setWordWrap(e){this.wordWrap=!!e;const t=this._isTailPinned();this.output.style.whiteSpace=this.wordWrap?"pre-wrap":"pre",this.output.style.wordBreak=this.wordWrap?"break-word":"normal",this.output.style.overflowX=this.wordWrap?"hidden":"auto",t&&this._scrollToEnd()}_isTailPinned(){const e=this.output;return e.scrollTop+e.clientHeight>=e.scrollHeight-4}_scrollToEnd(){this.output.scrollTop=this.output.scrollHeight}_applySize(e,t){const n=this._isTailPinned();super._applySize(e,t),n&&this._scrollToEnd()}_buildBody(){const e=document.createElement("div");e.dataset.role="terminal-body",e.style.cssText=["padding:6px 8px",`width:${this.widthChars}ch`,"max-width:92vw","font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace","display:flex","flex-direction:column"].join(";");const t=document.createElement("div");if(t.dataset.role="terminal-output",t.style.cssText=[`height:${Ux}px`,"flex:1 1 auto","min-height:0","overflow-y:auto","overflow-x:hidden","white-space:pre-wrap","word-break:break-word","background:var(--vb-terminal-bg, var(--vb-window-output-bg, rgba(0,0,0,0.06)))","border-radius:4px","padding:6px 8px"].join(";"),this.output=t,e.append(t),this.hasInput){const n=document.createElement("div");n.dataset.role="terminal-input-row",n.style.cssText="display:flex;align-items:baseline;gap:0";const i=document.createElement("span");i.textContent=this.prompt,i.style.cssText="color:var(--vb-window-key, #667788);flex:0 0 auto;white-space:pre";const r=document.createElement("input");r.type="text",r.dataset.role="terminal-input",r.style.cssText=["flex:1 1 auto","min-width:0","font:inherit","color:inherit","background:transparent","border:0","outline:none","padding:0","margin:0","caret-color:var(--vb-terminal-caret, auto)"].join(";"),r.addEventListener("keydown",o=>{if(o.key!=="Enter")return;o.stopPropagation();const a=r.value.trim();r.value="",a&&this._submit(a)}),this.input=r,n.append(i,r),t.append(n),this.inputRow=n,t.addEventListener("click",o=>{o.target===t&&r.focus()})}this.body=e,this.el.appendChild(e)}_submit(e){this.onInput&&this.onInput({window_id:this.id,line:e})}append(e){const t=document.createElement("div");t.textContent=String(e??""),this.inputRow?this.output.insertBefore(t,this.inputRow):this.output.appendChild(t),this.output.scrollTop=this.output.scrollHeight}_scrollTarget(){return this.output??null}_renderBody(){}}function Fx({container:s,windowManager:e,sendEvent:t}){return e.registerType("terminal",n=>{var r;(r=e.get(n.window_id))==null||r.close();const i=e.adopt(new Ix({id:n.window_id,title:n.title,prompt:n.prompt,width:n.width,closable:n.closable,input:n.input,onInput:o=>t({type:"event",event:"terminal_input",payload:o}),container:s,manager:e}));return i.bringToFront(),i}),{name:"terminal",actions:{terminal_append:n=>{const i=e.get(n.window_id);i&&i.kind==="terminal"&&i.append(n.text)}}}}const Nx=["--vb-window-body-fg","--vb-window-key","--vb-html-accent","--vb-window-output-bg"],Ox=["html,body{margin:0;background:transparent;color:var(--vb-window-body-fg);font:13px/1.5 system-ui,-apple-system,sans-serif}","body{padding:8px 10px}","h1,h2,h3{margin:0 0 6px;font-weight:600;line-height:1.25;text-wrap:balance}","h1{font-size:17px}h2{font-size:15px}","h3{font-size:11px;color:var(--vb-window-key);text-transform:uppercase;letter-spacing:.05em;margin-top:10px}","p,ul,ol,pre,blockquote{margin:0 0 8px}ul,ol{padding-left:20px}","a{color:var(--vb-html-accent)}","hr{border:0;border-top:1px solid color-mix(in srgb,var(--vb-window-key) 45%,transparent);margin:8px 0}","table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}","th{text-align:left;font-weight:500;color:var(--vb-window-key);padding:3px 10px 3px 0;border-bottom:1px solid color-mix(in srgb,var(--vb-window-key) 45%,transparent);white-space:nowrap}","td{padding:2px 10px 2px 0;vertical-align:top}.num{text-align:right}","table.kv td:first-child{color:var(--vb-window-key);white-space:nowrap;padding-right:12px}","code,pre,kbd{font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}","code{background:var(--vb-window-output-bg);padding:0 4px;border-radius:3px}","pre{background:var(--vb-window-output-bg);border-radius:4px;padding:6px 8px;overflow:auto;white-space:pre-wrap;word-break:break-word}","pre code{background:none;padding:0}","blockquote{padding:2px 10px;border-left:3px solid var(--vb-html-accent);color:var(--vb-window-key)}","button,.vb-btn{cursor:pointer;padding:3px 12px;border:1px solid var(--vb-html-accent);border-radius:4px;background:transparent;color:inherit;font:inherit}","[data-vb-event]{cursor:pointer}form[data-vb-event]{cursor:auto}","input,select,textarea{font:inherit;color:inherit;background:var(--vb-window-output-bg);border:1px solid color-mix(in srgb,var(--vb-window-key) 45%,transparent);border-radius:4px;padding:2px 6px;box-sizing:border-box}","input[type=checkbox],input[type=radio]{width:auto;padding:0}","label{color:var(--vb-window-key)}",".vb-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}",".vb-el{margin:0 0 8px}.vb-el>h1,.vb-el>h2,.vb-el>h3,.vb-el>p{margin:0}",".vb-field>label{display:block;font-size:11.5px;color:var(--vb-window-key);margin-bottom:2px}",".vb-field>input[type=text],.vb-field>input[type=number],.vb-field>select,.vb-field>textarea{width:100%}",".vb-field>input[type=range]{width:calc(100% - 3.5em);vertical-align:middle}.vb-field>output{color:var(--vb-window-key);font-variant-numeric:tabular-nums}",".vb-check>label{display:inline;font-size:inherit;color:inherit}",".vb-radios>label.vb-radio{display:inline-flex;align-items:center;gap:4px;margin:0 12px 0 0;font-size:inherit;color:inherit}","[hidden]{display:none!important}","button:disabled,input:disabled,select:disabled,textarea:disabled{opacity:.5;cursor:default}","img{max-width:100%;height:auto;display:block}",".vb-grid{display:grid;gap:4px 14px;align-items:start}",".vb-key,.small{color:var(--vb-window-key)}.small{font-size:11.5px}",".vb-tag{display:inline-block;padding:0 7px;border:1px solid var(--vb-window-key);border-radius:9px;font-size:11px;line-height:16px;margin-right:4px}",".vb-ok{color:#2fa84f}.vb-warn{color:#e8a02f}.vb-err{color:#e8553a}",".vb-bar{display:inline-block;vertical-align:middle;height:6px;background:var(--vb-window-output-bg);border-radius:3px;overflow:hidden}",".vb-bar>i{display:block;height:100%;background:var(--vb-html-accent)}"].join(`
`),kx=["(function(){","function attr(el,n){return el.hasAttribute(n)?el.getAttribute(n):null;}","function typed(el){",' var t=(el.type||"").toLowerCase();',' if(t==="checkbox")return el.checked;',' if(t==="radio")return el.checked?el.value:undefined;',' if(t==="number"||t==="range"){var n=parseFloat(el.value);return isNaN(n)?null:n;}',' if(t==="file")return undefined;',' if(el.tagName==="SELECT"&&el.multiple){var a=[];for(var i=0;i<el.options.length;i++)if(el.options[i].selected)a.push(el.options[i].value);return a;}'," return el.value;","}","function collect(root){",' var out={},els=root.querySelectorAll("input[name],select[name],textarea[name]");'," for(var i=0;i<els.length;i++){var v=typed(els[i]);if(v===undefined)continue;var k=els[i].name;",'  if(els[i].type==="radio"){out[k]=v;continue;}',"  if(k in out){if(!Array.isArray(out[k]))out[k]=[out[k]];out[k].push(v);}else out[k]=v;}"," return out;","}",'function send(kind,ev,id,val,values){parent.postMessage({type:"vb-html-event",kind:kind,event:ev,id:id,value:val,values:values||collect(document)},"*");}','document.addEventListener("click",function(e){',' var el=e.target&&e.target.closest?e.target.closest("[data-vb-event]"):null;',' if(el&&el.tagName!=="FORM"){e.preventDefault();send("click",el.getAttribute("data-vb-event"),attr(el,"data-vb-id"),attr(el,"data-vb-value"));return;}',' if(e.target&&e.target.closest&&e.target.closest("a"))e.preventDefault();',"});",'function fieldEvent(kind,el){send(kind,el.name||attr(el,"data-vb-id"),attr(el,"data-vb-id"),typed(el));}','document.addEventListener("change",function(e){',' var el=e.target;if(!el||!el.hasAttribute||!el.hasAttribute("data-vb-id"))return;',' fieldEvent("change",el);',"});","var liveTimer=null,livePending=null;",'document.addEventListener("input",function(e){',' var el=e.target;if(!el||!el.type||el.type!=="range")return;',` var o=el.parentNode&&el.parentNode.querySelector?el.parentNode.querySelector("output[for='"+el.name+"']"):null;`," if(o)o.textContent=el.value;",' if(!el.hasAttribute("data-vb-live"))return;'," livePending=el;if(liveTimer)return;",' liveTimer=setTimeout(function(){liveTimer=null;if(livePending){fieldEvent("change",livePending);livePending=null;}},100);',"});",'document.addEventListener("keydown",function(e){',' var el=e.target;if(e.key!=="Enter"||!el||el.tagName!=="INPUT"||!el.hasAttribute("data-vb-id"))return;',' if(el.type==="checkbox"||el.type==="range")return;',' e.preventDefault();fieldEvent("submit",el);',"});",'document.addEventListener("submit",function(e){',' var f=e.target;e.preventDefault();if(!f||f.tagName!=="FORM")return;',' send("submit",attr(f,"data-vb-event")||attr(f,"name")||"submit",attr(f,"data-vb-id"),attr(f,"data-vb-value"),collect(f));',"});","var se=function(){return document.scrollingElement||document.documentElement;};","var rep=null;function report(){if(rep)return;rep=requestAnimationFrame(function(){rep=null;var s=se();",' parent.postMessage({type:"vb-html-scroll",top:s.scrollTop,left:s.scrollLeft,height:s.scrollHeight,width:s.scrollWidth,cH:s.clientHeight,cW:s.clientWidth},"*");});}','window.addEventListener("scroll",report,{passive:true});','window.addEventListener("resize",report);','window.addEventListener("load",report);','window.addEventListener("message",function(e){'," var d=e.data;if(!d)return;",' if(d.type==="vb-html-append"){',"  var s=se();","  var pinned=s.scrollTop+s.clientHeight>=s.scrollHeight-4;",'  document.body.insertAdjacentHTML("beforeend",d.html);',"  if(pinned)s.scrollTop=s.scrollHeight;report();",' }else if(d.type==="vb-html-patch"){',"  var el=document.getElementById(d.id);if(el)el.outerHTML=d.html;report();",' }else if(d.type==="vb-html-scrollto"){','  var t=se();if(typeof d.top==="number")t.scrollTop=d.top;if(typeof d.left==="number")t.scrollLeft=d.left;report();',' }else if(d.type==="vb-html-frame"){','  document.documentElement.style.scrollbarWidth=d.on?"none":"";report();'," }","});","})();"].join(`
`);function Zo(s){return String(s??"").replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,"").replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,"").replace(/(\s(?:href|src)\s*=\s*)(["']?)\s*javascript:[^"'\s>]*\2/gi,'$1"#"')}function Bx(s){const e=getComputedStyle(s),t={};for(const n of Nx){const i=e.getPropertyValue(n).trim();i&&(t[n]=i)}return t}function zx({themeVars:s={},html:e=""}={}){return`<!doctype html><html><head><meta charset="utf-8"><style>:root{${Object.entries(s).map(([n,i])=>`${n}:${i}`).join(";")}}
${Ox}</style></head><body>${Zo(e)}</body><script>${kx}<\/script></html>`}const Gx=8;class Hx{constructor(e){this.win=e,this.top=0,this.left=0,this.height=0,this.width=0,this.cH=0,this.cW=0,this._subs=new Set}update(e){this.top=Number(e.top)||0,this.left=Number(e.left)||0,this.height=Number(e.height)||0,this.width=Number(e.width)||0,this.cH=Number(e.cH)||0,this.cW=Number(e.cW)||0;for(const t of this._subs)t()}subscribe(e){return this._subs.add(e),()=>this._subs.delete(e)}setFrame(e){this.win._send({type:"vb-html-frame",on:!!e})}get scrollTop(){return this.top}set scrollTop(e){this.win._send({type:"vb-html-scrollto",top:Math.max(0,Number(e)||0)})}get scrollLeft(){return this.left}set scrollLeft(e){this.win._send({type:"vb-html-scrollto",left:Math.max(0,Number(e)||0)})}get scrollHeight(){return this.height}get scrollWidth(){return this.width}get clientHeight(){return this.cH}get clientWidth(){return this.cW}}class Vx extends zn{constructor({id:e,title:t,width:n,height:i,html:r,closable:o,container:a,manager:l,onEvent:c}){super({id:e,title:t,widthChars:Math.max(20,Math.round((Number(n)||560)/Gx)),container:a,manager:l,kind:"html",closable:o}),this.height=Number(i)>0?Number(i):320,this.html=String(r??""),this.onEvent=c,this._loaded=!1,this._queue=[],this.scroll=new Hx(this),this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="html-body",e.style.cssText=[`width:${this.widthChars}ch`,`height:${this.height}px`,"max-width:92vw","display:flex","padding:0"].join(";");const t=document.createElement("iframe");t.dataset.role="html-frame",t.setAttribute("sandbox","allow-scripts allow-forms"),t.style.cssText="flex:1 1 auto;border:0;width:100%;height:100%;background:transparent",t.addEventListener("load",()=>{var n;this._loaded=!0;for(const i of this._queue)this._post(i);this._queue.length=0,(n=this.wframe)!=null&&n.enabled&&this._post({type:"vb-html-frame",on:!0})}),this.frame=t,e.appendChild(t),this.body=e,this.el.appendChild(e),this._render()}_render(){this._loaded=!1,this._queue.length=0,this.frame.setAttribute("srcdoc",zx({themeVars:Bx(this.container),html:this.html}))}setHtml(e){this.html=String(e??""),this._render()}appendHtml(e){const t=Zo(e);this.html+=t,this._send({type:"vb-html-append",html:t})}patchHtml(e,t){this._send({type:"vb-html-patch",id:String(e),html:Zo(t)})}_send(e){this._loaded?this._post(e):this._queue.push(e)}_post(e){var t;(t=this.frame.contentWindow)==null||t.postMessage(e,"*")}handleBridgeEvent(e){if(!this.onEvent)return;const t=e.values&&typeof e.values=="object"?e.values:{},n=["click","change","submit"].includes(e.kind)?e.kind:"click";this.onEvent({window_id:this.id,event:String(e.event??""),kind:n,id:e.id==null?null:String(e.id),value:e.value===void 0?null:e.value,values:t})}_scrollTarget(){return this.scroll}applyTheme(){super.applyTheme(),this.isMinimized||this._render()}_renderBody(){}}function Wx({container:s,windowManager:e,sendEvent:t,onThemeChange:n}){const i=new Set;e.registerType("html",o=>{var l;(l=e.get(o.window_id))==null||l.close();const a=e.adopt(new Vx({id:o.window_id,title:o.title,width:o.width,height:o.height,html:o.html,closable:o.closable,container:s,manager:e,onEvent:c=>t({type:"event",event:"html_event",payload:c})}));return i.add(a),a.bringToFront(),a}),window.addEventListener("message",o=>{var l;const a=(l=o.data)==null?void 0:l.type;if(!(a!=="vb-html-event"&&a!=="vb-html-scroll")){for(const c of i)if(c.frame.contentWindow===o.source){a==="vb-html-event"?c.handleBridgeEvent(o.data):c.scroll.update(o.data);return}}}),n==null||n(()=>{for(const o of i)e.get(o.id)===o?o.applyTheme():i.delete(o)});const r=o=>{const a=e.get(o.window_id);return a&&a.kind==="html"?a:null};return{name:"html",actions:{html_set:o=>{var a;return(a=r(o))==null?void 0:a.setHtml(o.html)},html_append:o=>{var a;return(a=r(o))==null?void 0:a.appendHtml(o.html)},html_patch:o=>{var a;return(a=r(o))==null?void 0:a.patchHtml(o.id,o.html)}}}}const Xx="modulepreload",Yx=function(s){return"/"+s},Wc={},Po=function(e,t,n){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),a=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=Promise.allSettled(t.map(l=>{if(l=Yx(l),l in Wc)return;Wc[l]=!0;const c=l.endsWith(".css"),h=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${h}`))return;const u=document.createElement("link");if(u.rel=c?"stylesheet":Xx,c||(u.as="script"),u.crossOrigin="",u.href=l,a&&u.setAttribute("nonce",a),document.head.appendChild(u),c)return new Promise((d,f)=>{u.addEventListener("load",d),u.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return i.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})},jx=8,qx=["black","red","green","yellow","blue","magenta","cyan","white","brightBlack","brightRed","brightGreen","brightYellow","brightBlue","brightMagenta","brightCyan","brightWhite"];function Xc(s){const e=getComputedStyle(s),t=(r,o)=>e.getPropertyValue(r).trim()||o,n=t("--vb-window-body-fg","#d7f4ff"),i={background:t("--vb-term-bg",t("--vb-window-body-bg","#101418")),foreground:n,cursor:t("--vb-window-key",n),cursorAccent:t("--vb-term-bg","#000"),selectionBackground:t("--vb-frame-knob","#8884")};return qx.forEach((r,o)=>{const a=e.getPropertyValue(`--vb-term-ansi-${o}`).trim();a&&(i[r]=a)}),i}class Kx{constructor(e){this.term=e}subscribe(e){var i,r;const t=this.term.onScroll(e),n=(r=(i=this.term).onRender)==null?void 0:r.call(i,e);return()=>{t.dispose(),n==null||n.dispose()}}setFrame(){}get scrollTop(){return this.term.buffer.active.viewportY}set scrollTop(e){this.term.scrollToLine(Math.max(0,Math.round(e)))}get scrollHeight(){return this.term.buffer.active.length}get clientHeight(){return this.term.rows}get scrollLeft(){return 0}set scrollLeft(e){}get scrollWidth(){return 1}get clientWidth(){return 1}}class Zx extends zn{constructor({id:e,title:t,cols:n,rows:i,width:r,height:o,running:a,scrollback:l,closable:c,container:h,manager:u,sendEvent:d}){super({id:e,title:t,widthChars:Math.max(20,Math.round((Number(r)||720)/jx)),container:h,manager:u,kind:"shell",closable:c}),this.height=Number(o)>0?Number(o):420,this.cols=Number(n)||80,this.rows=Number(i)||24,this.state=a===!1?"starting":"running",this.pending=String(l??""),this.sendEvent=d,this.term=null,this.fit=null,this._buildBody(),this._mount(),this.ready=this._startTerminal()}_buildBody(){const e=document.createElement("div");e.dataset.role="shell-body",e.style.cssText=[`width:${this.widthChars}ch`,`height:${this.height}px`,"max-width:92vw","display:flex","flex-direction:column","padding:6px 8px","font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace"].join(";");const t=document.createElement("div");t.dataset.role="shell-term",t.style.cssText="flex:1 1 auto;min-height:0",this.termEl=t;const n=document.createElement("style");n.textContent=['[data-role="shell-term"] .xterm-viewport{scrollbar-width:none}','[data-role="shell-term"] .xterm-viewport::-webkit-scrollbar{width:0;height:0}','[data-role="shell-term"] .xterm-scrollable-element>.scrollbar{display:none}'].join(""),t.appendChild(n),e.append(t),this.body=e,this.el.appendChild(e)}_send(e,t){var n;(n=this.sendEvent)==null||n.call(this,{type:"event",event:e,payload:{window_id:this.id,...t}})}setState(e,t={}){if(e==="running"){this.state="running";return}if(e==="exited"){this.state="exited";const n=t.code==null?"":` (exit ${t.code})`;this.write(`\r
\x1B[2m[process finished${n}]\x1B[0m\r
`);return}e==="failed"&&(this.state="failed",this.write(`\r
\x1B[31m[${t.error||"failed to start"}]\x1B[0m\r
`))}write(e){const t=String(e??"");this.term?this.term.write(t):this.pending+=t}async _startTerminal(){var r;if(this.term)return;const[{Terminal:e},{FitAddon:t}]=await Promise.all([Po(()=>import("./xterm-BT7tBf8A.js"),[]),Po(()=>import("./addon-fit-YJmn1quW.js"),[])]);await Po(()=>Promise.resolve({}),__vite__mapDeps([0]));const n=new e({cols:this.cols,rows:this.rows,convertEol:!1,cursorBlink:!0,scrollback:5e3,fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace",fontSize:13,theme:Xc(this.container),allowTransparency:!0,scrollOnUserInput:!0}),i=new t;n.loadAddon(i),n.open(this.termEl),n.onData(o=>{this.state==="running"&&this._send("shell_input",{data:o})}),n.onResize(({cols:o,rows:a})=>{this.cols=o,this.rows=a,this._send("shell_resize",{cols:o,rows:a})}),this.term=n,this.fit=i,this.scroll=new Kx(n),this.pending&&(n.write(this.pending),this.pending=""),this._fit(),(r=this.wframe)==null||r.rebind(),n.focus()}_fit(){var e;try{(e=this.fit)==null||e.fit()}catch{}}_applySize(e,t){super._applySize(e,t),this._fit()}applyTheme(){super.applyTheme(),this.term&&(this.term.options.theme=Xc(this.container))}_scrollTarget(){return this.scroll??this.body}close(){var e;(e=this.term)==null||e.dispose(),this.term=null,super.close()}_renderBody(){}}function $x({container:s,windowManager:e,sendEvent:t,onThemeChange:n}){const i=new Set;e.registerType("shell",o=>{var l;(l=e.get(o.window_id))==null||l.close();const a=e.adopt(new Zx({id:o.window_id,title:o.title,cols:o.cols,rows:o.rows,width:o.width,height:o.height,running:o.running,scrollback:o.scrollback,closable:o.closable,container:s,manager:e,sendEvent:t}));return i.add(a),a.bringToFront(),a}),n==null||n(()=>{for(const o of i)e.get(o.id)===o?o.applyTheme():i.delete(o)});const r=o=>{const a=e.get(o.window_id);return a&&a.kind==="shell"?a:null};return{name:"shell",actions:{shell_data:o=>{var a;return(a=r(o))==null?void 0:a.write(o.data)},shell_state:o=>{var a;return(a=r(o))==null?void 0:a.setState(o.state,o)}}}}const Jx="#3bf28a";class Qx{constructor(e=document.body,t=()=>{}){this.sendEvent=t,this.windowId=null,this.onCancel=null;const{el:n,box:i,line:r,input:o}=$o({color:Jx,flash:!1,role:"vb-unlock",input:!0});this.el=n,this.box=i,this.input=o,this.bar=r("Window Locked.  Enter the code to continue.","vb-unlock-bar"),this.what=r("","vb-unlock-what"),this.box.append(this.input),this.err=r("","vb-unlock-error"),this.hint=r("Authenticator code, or the one-time code from the file named in the server log.  Esc keeps the window locked."),this.input.inputMode="numeric",this.input.autocomplete="one-time-code",this.input.placeholder="------",this.input.addEventListener("keydown",a=>{if(a.stopPropagation(),a.key!=="Enter")return;const l=this.input.value.replace(/\s+/g,"");l&&this.sendEvent({type:"event",event:"window_unlock",payload:{window_id:this.windowId,code:l}})}),this._onKeydown=a=>{a.code==="Escape"&&this.visible&&(a.preventDefault(),this.cancel())},window.addEventListener("keydown",this._onKeydown,!0),e.appendChild(this.el)}ask(e,t=""){this.windowId=e,this.what.textContent=t?`“${t}”`:"",this.err.textContent="",this.input.value="",this.el.style.display="block",this.input.focus()}reject(e="Invalid code"){this.visible&&(this.err.textContent=e,this.input.value="",this.input.focus())}cancel(){var t;const e=this.windowId;this.hide(),e&&((t=this.onCancel)==null||t.call(this,e))}resolve(e){this.windowId===e&&this.hide()}hide(){this.el.style.display="none",this.windowId=null}get visible(){return this.el.style.display!=="none"}}const ey=8;class ty extends zn{constructor({id:e,title:t,realKind:n,width:i,height:r,closable:o,container:a,manager:l,onUnlockRequest:c}){super({id:e,title:t,widthChars:Math.max(20,Math.round((Number(i)||420)/ey)),container:a,manager:l,kind:"locked",closable:o}),this.realKind=n??"window",this.height=Number(r)>0?Number(r):200,this.onUnlockRequest=c,this.private=!0,this._buildBody(),this._mount()}_buildBody(){const e=document.createElement("div");e.dataset.role="locked-body",e.style.cssText=[`width:${this.widthChars}ch`,`height:${this.height}px`,"max-width:92vw","display:flex","align-items:center","justify-content:center","padding:8px 10px","text-align:center","font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace","color:var(--vb-window-key, #667788)"].join(";"),e.textContent="Private window. Unlock this window via the Options menu.",this.body=e,this.el.appendChild(e)}requestUnlock(){var e;(e=this.onUnlockRequest)==null||e.call(this,this)}getOptionsItems(){return null}_renderBody(){}}function ny({container:s,windowManager:e,sendEvent:t,unlockPrompt:n}){const i=n,r=o=>i==null?void 0:i.ask(o.id,o.title);return i&&(i.onCancel=o=>{var a;return(a=e.get(o))==null?void 0:a.bringToFront()}),e.registerType("locked",o=>{var l;(l=e.get(o.window_id))==null||l.close();const a=e.adopt(new ty({id:o.window_id,title:o.title,realKind:o.real_kind,width:o.width,height:o.height,closable:o.closable,container:s,manager:e,onUnlockRequest:r}));return a.bringToFront(),a}),{name:"locked",actions:{window_state:o=>{const a=e.get(o.window_id);o.state==="locked"?(a&&a.kind==="locked"&&(i==null||i.ask(a.id,a.title)),i==null||i.reject(o.error||"Invalid code")):i==null||i.resolve(o.window_id)}}}}class iy{constructor({container:e,sendEvent:t}){this.container=e,this.sendEvent=t,this.remoteGroups=[],this.optionsGroup=null,this.systemGroup=null,this.userGroup=null,this.openGroup=null,this.el=document.createElement("div"),this.el.dataset.role="vb-screen-menu",this.el.style.cssText=["position:absolute","top:0","left:0","right:0","z-index:1400","font:12px system-ui,sans-serif"].join(";"),this.bar=document.createElement("div"),this.bar.dataset.role="vb-screen-menu-bar",this.bar.style.cssText=["display:grid","grid-template-columns:1fr auto 1fr","align-items:center","height:26px","padding:0 6px","background:var(--vb-screenbar-bg, rgba(230,230,235,0.95))","color:var(--vb-screenbar-fg, #000)","border:1px solid rgba(0,0,0,0.4)","box-sizing:border-box","cursor:ns-resize","user-select:none"].join(";"),this.el.appendChild(this.bar),this.groupsEl=document.createElement("div"),this.groupsEl.style.cssText="display:flex;justify-self:start;min-width:0",this.bar.appendChild(this.groupsEl),this.titleEl=document.createElement("span"),this.titleEl.dataset.role="vb-screen-bar-title",this.titleEl.style.cssText=["overflow:hidden","text-overflow:ellipsis","white-space:nowrap","font-weight:600","justify-self:center","min-width:0"].join(";"),this.bar.appendChild(this.titleEl),this.gadgetsEl=document.createElement("div"),this.gadgetsEl.style.cssText="display:flex;gap:3px;justify-self:end",this.bar.appendChild(this.gadgetsEl),this.dropdown=document.createElement("div"),this.dropdown.dataset.role="vb-screen-menu-dropdown",this.dropdown.style.cssText=["position:absolute","top:100%","left:0","display:none","background:#d4d4d4","border:1px solid #000","min-width:190px","box-shadow:0 4px 8px rgba(0,0,0,0.3)"].join(";"),this.el.appendChild(this.dropdown),e.appendChild(this.el),this._onOutsideClick=n=>{this.el.contains(n.target)||this._closeDropdown()},document.addEventListener("pointerdown",this._onOutsideClick)}setTitle(e){this.titleEl.textContent=e}addGadget(e,t,n,i){const r=document.createElement("button");return r.dataset.role=e,r.title=n,r.style.cssText=["width:20px","height:16px","padding:0","border:none","flex:none","cursor:pointer","background:var(--vb-screenbar-fg, #000)",`-webkit-mask:url("${t}") center/${jt}px ${jt}px no-repeat`,`mask:url("${t}") center/${jt}px ${jt}px no-repeat`].join(";"),r.addEventListener("pointerdown",o=>o.stopPropagation()),r.addEventListener("click",o=>{o.stopPropagation(),i()}),this.gadgetsEl.appendChild(r),r}setSpec(e){this.remoteGroups=e&&Array.isArray(e.groups)?e.groups:[],this._render()}setOptionsGroup(e){this.optionsGroup=e?{name:"Options",items:e,local:!0}:null,this._render()}setSystemGroup(e=!0){this.systemGroup=e?{name:"System",local:!0,items:[{key:"shell-cli",label:"Shell CLI",command:!0,onToggle:()=>this.sendEvent({type:"event",event:"shell_new",payload:{}})}]}:null,this._render()}setUserGroup(e){this.userGroup=e?{name:`User: ${e}`,local:!0,items:[{key:"user-lock-all",label:"Lock All Windows",command:!0,onToggle:()=>this.sendEvent({type:"lock_all"})},{key:"user-logout",label:"Log Out",command:!0,onToggle:()=>this.sendEvent({type:"logout"})}]}:null,this._render()}_allGroups(){return[...this.optionsGroup?[this.optionsGroup]:[],...this.systemGroup?[this.systemGroup]:[],...this.userGroup?[this.userGroup]:[],...this.remoteGroups]}_render(){this.groupsEl.replaceChildren();const e=this._allGroups();for(const t of e){const n=document.createElement("button");n.dataset.role="vb-menu-group",n.dataset.group=t.name,n.textContent=t.name;const i=t.name===this.openGroup;n.style.cssText=["padding:4px 12px","border:none","cursor:pointer","font:inherit",i?"background:#3b7bc4;color:#fff":"background:transparent;color:inherit"].join(";"),n.addEventListener("pointerdown",r=>r.stopPropagation()),n.addEventListener("click",r=>{r.stopPropagation(),this._toggleGroup(t)}),this.groupsEl.appendChild(n)}if(this.openGroup){const t=e.find(n=>n.name===this.openGroup);t?this._renderDropdown(t):this._closeDropdown()}}_toggleGroup(e){if(this.openGroup===e.name){this._closeDropdown();return}this.openGroup=e.name,this._render(),this._renderDropdown(e)}_renderDropdown(e){this.dropdown.replaceChildren();for(const t of e.items){const n=document.createElement("div");n.dataset.role="vb-menu-item",n.style.cssText=["padding:5px 16px","cursor:pointer","white-space:nowrap","display:flex","align-items:center","justify-content:space-between","gap:16px","color:#000"].join(";");const i=document.createElement("span");if(i.textContent=t.label,n.appendChild(i),e.local){if(n.dataset.itemKey=t.key,!t.command){const r=document.createElement("span");r.dataset.role="vb-menu-checkbox",r.textContent=t.checked?"✓":"",r.style.cssText="width:1em;display:inline-block;font-weight:700",n.appendChild(r)}n.addEventListener("click",r=>{r.stopPropagation(),t.onToggle(!t.checked),this._closeDropdown()})}else n.dataset.itemId=t.id,n.addEventListener("click",r=>{r.stopPropagation(),this.sendEvent({type:"event",event:"menu_select",payload:{item_id:t.id}}),this._closeDropdown()});n.addEventListener("pointerenter",()=>{n.style.background="#3b7bc4",n.style.color="#fff"}),n.addEventListener("pointerleave",()=>{n.style.background="",n.style.color="#000"}),this.dropdown.appendChild(n)}this.dropdown.style.display="block"}_closeDropdown(){this.openGroup!==null&&(this.openGroup=null,this.dropdown.style.display="none",this._render())}destroy(){document.removeEventListener("pointerdown",this._onOutsideClick),this.el.remove()}}class ry{constructor(e,t=()=>{},n={}){this.container=e,this.onOptionsChange=t,this.onLockWindow=n.onLockWindow??null,this.types=new Map,this.windows=new Map,this.optionsSource=null,this.activeWindow=null,this.z=900}registerType(e,t){this.types.set(e,t)}open(e,t){const n=this.types.get(e);if(!n)return console.warn(`viewbase: unknown window kind '${e}'`),null;this._openingSpec=t??null;let i;try{i=n(t)}finally{this._openingSpec=null}return i&&t&&(i.private=!!t.private),i}adopt(e){return this._openingSpec&&(e.private=!!this._openingSpec.private),this.windows.set(e.id,e),e}get(e){return this.windows.get(e)??null}close(e){var t;(t=this.windows.get(e))==null||t.close()}_setActive(e){var t,n,i;this.activeWindow!==e&&((n=(t=this.activeWindow)==null?void 0:t.setFocused)==null||n.call(t,!1)),this.activeWindow=e,(i=e.setFocused)==null||i.call(e,!0),this.optionsItemsFor(e)!=null&&(this.optionsSource=e),this.refreshOptions()}hasKeyboard(e){return this.activeWindow===null||this.activeWindow===e}refreshOptions(){this.onOptionsChange(this.optionsItemsFor(this.optionsSource))}optionsItemsFor(e){if(!e)return null;const t=e.getOptionsItems(),n=this.lockItemFor(e);return n?[...t??[],n]:t}lockItemFor(e){return e!=null&&e.private?e.kind==="locked"?{key:"unlock-window",label:"Unlock Window",command:!0,onToggle:()=>{var t;return(t=e.requestUnlock)==null?void 0:t.call(e)}}:this.onLockWindow?{key:"lock-window",label:"Lock Window",command:!0,onToggle:()=>this.onLockWindow(e)}:null:null}applyTheme(){for(const e of this.windows.values())e.applyTheme()}_nextZ(){return this.z+=1,this.z}sendToBack(e){const t=[...this.windows.values()].filter(i=>i!==e).sort((i,r)=>Number(i.el.style.zIndex)-Number(r.el.style.zIndex));let n=900;e.setZ(n);for(const i of t)n+=1,i.setZ(n);this.z=n}dockRects(e){const t=[];for(const n of this.windows.values())n===e||!n.isMinimized||t.push({x:n.x,y:n.y,w:n.el.offsetWidth||160,h:n.el.offsetHeight||28});return t}dockPlace(e,t,n){const i=e._dockBounds(),r=this.dockRects(e),o=e.dockPos;return o&&o.x>=0&&o.y>=(i.top??0)&&o.x+t<=i.width&&o.y+n<=i.height&&!r.some(a=>Qo({x:o.x,y:o.y,w:t,h:n},a))?{x:o.x,y:o.y}:vu(r,t,n,i)}_forget(e){const t=this.windows.get(e);if(this.windows.delete(e),this.activeWindow===t&&(this.activeWindow=null),t!==this.optionsSource)return;let n=null;for(const i of this.windows.values())this.optionsItemsFor(i)!=null&&(!n||Number(i.el.style.zIndex)>Number(n.el.style.zIndex))&&(n=i);this.optionsSource=n,this.refreshOptions()}}function sy({container:s,screenId:e,connection:t}){const n=new gr,i=_=>t.send({..._,screen_id:e}),r=new iy({container:s,sendEvent:i});let o=()=>null;const a=new ry(s,_=>r.setOptionsGroup(_??o()),{onLockWindow:_=>i({type:"event",event:"window_lock",payload:{window_id:_.id}})}),l=[];function c(_){const y=Nh(_);f0(y,s),a.applyTheme(),s.style.background=y.background??"#000";for(const A of l)A(y)}const h=new Qx(s,i),u={container:s,screenId:e,store:n,sendEvent:i,windowManager:a,unlockPrompt:h,onThemeChange:_=>l.push(_),setOptionsFallback:_=>{o=_},applyTheme:c},d=[Du(u),Hu(u),Bu(u),Fx(u),Wx(u),$x(u),ny(u)];let f=null,g=!0,v=!1;function p(){var y,A;if(f||n.config.graph_window===!1)return;const _=s.style.display==="none";_&&(s.style.display="block"),f=Px(u),_&&(s.style.display="none"),d.push(f),(y=f.setVisible)==null||y.call(f,g),(A=f.setResourcesPaused)==null||A.call(f,v)}const m={open_window:_=>{const y=a.open(_.kind??"control",_);return _.kind!=="locked"&&h.resolve(_.window_id),y},close_window:_=>a.close(_.window_id),open_menu:_=>{n.menu={groups:_.groups},r.setSpec(n.menu)}};function M(_){var y;if(m[_])return m[_];for(const A of d){const T=(y=A.actions)==null?void 0:y[_];if(T)return T}return null}return n.subscribe(_=>{var y;if(_.kind==="init"){p(),c(n.config.theme),r.setSpec(n.menu),r.setSystemGroup(n.config.shell_cli!==!1);for(const A of n.windows??[])a.open(A.kind??"control",A);n.config.log_window&&a.open("log"),n.config.title&&(document.title=`${n.config.title} – viewbase`);for(const A of d)(y=A.onInit)==null||y.call(A)}}),{screenId:e,container:s,store:n,bar:r,windowManager:a,handleAction(_){const y=M(_.action);y?y(_):console.warn("viewbase: unknown action",_.action)},openLog:()=>a.open("log"),logWindow:()=>a.get(ea),setActive(_){var y;g=_,s.style.display=_?"block":"none";for(const A of d)(y=A.setVisible)==null||y.call(A,_)},setFullyHidden(_){var y;v=_;for(const A of d)(y=A.setResourcesPaused)==null||y.call(A,_)},destroy(){var _;for(const y of d)(_=y.destroy)==null||_.call(y);r.destroy(),s.remove()}}}const oy=200;class ay{constructor(e,t){this.rootContainer=e,this.connection=t,this.instances=new Map,this.order=[],this.zOrder=[],this.offsets=new Map,this.dragState=null,this.pendingLogs=[],this.logAutoOpened=!1,window.addEventListener("pointerup",()=>{this.dragState=null}),window.addEventListener("pointercancel",()=>{this.dragState=null})}get activeId(){return this.zOrder[0]}_createContainer(e){const t=document.createElement("div");return t.dataset.role="vb-screen",t.dataset.screenId=String(e),t.style.cssText="position:absolute;inset:0;overflow:hidden",this.rootContainer.appendChild(t),t}setUser(e){var t;this.user=e??null;for(const n of this.instances.values())(t=n.bar)==null||t.setUserGroup(this.user)}_register(e,t){var n;if(this.instances.set(e,t),(n=t.bar)==null||n.setUserGroup(this.user??null),this.order.push(e),this.offsets.set(e,0),this.zOrder.push(e),this._wireScreenChrome(e,t),this._layout(),this.pendingLogs.length>0){const i=this.pendingLogs;this.pendingLogs=[];for(const r of i)this.appendLog(r)}}ensure(e){let t=this.instances.get(e);return t||(t=sy({container:this._createContainer(e),screenId:e,connection:this.connection}),t.store.subscribe(n=>{n.kind==="init"&&this._renderTitle(e)}),this._register(e,t),t)}resolveStore(e){return this.ensure(e).store}appendLog(e){const t=[...this.instances.values()].map(n=>n.logWindow()).filter(Boolean);if(t.length===0){if(this.logAutoOpened)return;const n=this.instances.get(this.zOrder[0]);if(!n){this.pendingLogs.length<oy&&this.pendingLogs.push(e);return}this.logAutoOpened=!0,t.push(n.openLog())}for(const n of t)n.append(e)}routeAction(e){var t;(t=this.instances.get(e.screen_id??null))==null||t.handleAction(e)}cycleNext(){this.zOrder.length<2||(this.zOrder=mu(this.zOrder),this.offsets.set(this.zOrder[0],0),this.offsets.set(this.zOrder[1],0),this._layout())}_layout(){this.zOrder.forEach((e,t)=>{const n=this.instances.get(e),i=this.offsets.get(e)??0;t===0?(n.setActive(!0),n.container.style.zIndex="20",n.container.style.transform=Da(i,n.container.clientHeight||0)):t===1?(n.setActive(!0),n.container.style.zIndex="10",n.container.style.transform=Da(i,n.container.clientHeight||0)):(n.setActive(!1),n.container.style.zIndex="0",n.container.style.transform=""),n.setFullyHidden(t>=2)})}remove(e){const t=this.instances.get(e);t&&(t.logWindow()&&(this.logAutoOpened=!1),t.destroy(),this.instances.delete(e),this.order=this.order.filter(n=>n!==e),this.zOrder=this.zOrder.filter(n=>n!==e),this.offsets.delete(e),this.zOrder.length>0&&this._layout())}_renderTitle(e){var i,r;const t=this.instances.get(e);if(!t)return;const n=(i=t.store)==null?void 0:i.config;(r=t.bar)==null||r.setTitle((n==null?void 0:n.title)||`Screen ${(n==null?void 0:n.screen_index)??""}`.trim())}_wireScreenChrome(e,t){const n=t.bar;n&&(this._renderTitle(e),n.addGadget("vb-screen-switch",jc,"Přepnout na další screen",()=>this.cycleNext()),this._wireDrag(e,n.bar))}_wireDrag(e,t){Lo(t,{onStart:n=>this.zOrder[0]!==e?null:(this.dragState={screenId:e,startY:n.clientY,startOffset:this.offsets.get(e)??0},this.dragState),onMove:(n,i)=>{const r=this.instances.get(e);if(!r)return;const o=n.clientY-i.startY,a=pu(i.startOffset,o,r.container.clientHeight||0);this.offsets.set(e,a),this._layout()},onEnd:()=>{this.dragState=null}})}}const $h=new uu,ti=new lu;window.addEventListener("error",s=>{ti.show("frontend_error",`${s.message}
${s.filename}:${s.lineno}:${s.colno}`)});window.addEventListener("unhandledrejection",s=>{var e;ti.show("frontend_error",String(((e=s.reason)==null?void 0:e.stack)??s.reason))});function ly(){try{const s=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(s.getContext("webgl2")||s.getContext("webgl")))}catch{return!1}}function cy(){const s=document.getElementById("app");let e,t;const n=location.protocol==="https:"?"wss":"ws",i=new ru(`${n}://${location.host}/ws`,null,{resolveStore:r=>e.resolveStore(r),onStatus:r=>{r==="init"?($h.hide(),ti.dismissIfConnectionRecovered()):r==="close"?ti.show("connection_lost","Connection Lost"):r==="connect_failed"?ti.show("connection_lost","Connection Failed"):r==="protocol_mismatch"&&ti.show("connection_lost","Protocol Mismatch — reload the page (F5)")},onAction:r=>{r.action==="screen_remove"?e.remove(r.screen_id):e.routeAction(r)},onSession:r=>{e.setUser(r.user),!r.user&&r.hidden>0?t.ask():t.hide()},onLoginFailed:()=>t.reject(),onLog:r=>{r.timestamp=new Date,e.appendLog(r),r.level==="error"&&ti.show("backend_error",Qc(r))}});e=new ay(s,i),t=new hu(document.body,r=>i.send(r)),i.connect(),window.__viewbase={screenManager:e,connection:i}}ly()?cy():$h.show("Tento prohlížeč nemá dostupné WebGL – vizualizaci nelze spustit. Zkus jiný prohlížeč nebo zapni hardwarovou akceleraci.");
