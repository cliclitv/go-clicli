var jt=Object.defineProperty,Rt=Object.defineProperties;var qt=Object.getOwnPropertyDescriptors;var nt=Object.getOwnPropertySymbols;var Kt=Object.prototype.hasOwnProperty,Vt=Object.prototype.propertyIsEnumerable;var rt=(t,e,n)=>e in t?jt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,ot=(t,e)=>{for(var n in e||(e={}))Kt.call(e,n)&&rt(t,n,e[n]);if(nt)for(var n of nt(e))Vt.call(e,n)&&rt(t,n,e[n]);return t},lt=(t,e)=>Rt(t,qt(e));const Ut=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const f of a)if(f.type==="childList")for(const p of f.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&i(p)}).observe(document,{childList:!0,subtree:!0});function n(a){const f={};return a.integrity&&(f.integrity=a.integrity),a.referrerpolicy&&(f.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?f.credentials="include":a.crossorigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function i(a){if(a.ep)return;a.ep=!0;const f=n(a);fetch(a.href,f)}};Ut();const Bt="modulepreload",it={},Ft="/assets/",M=function(e,n){return!n||n.length===0?e():Promise.all(n.map(i=>{if(i=`${Ft}${i}`,i in it)return;it[i]=!0;const a=i.endsWith(".css"),f=a?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${f}`))return;const p=document.createElement("link");if(p.rel=a?"stylesheet":Bt,a||(p.as="script",p.crossOrigin=""),p.href=i,document.head.appendChild(p),a)return new Promise((h,m)=>{p.addEventListener("load",h),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${i}`)))})})).then(()=>e())},st={},ct=(t,e,n)=>{t=t||st,e=e||st,Object.keys(t).forEach(i=>n(i,t[i],e[i])),Object.keys(e).forEach(i=>!t.hasOwnProperty(i)&&n(i,void 0,e[i]))},ft=(t,e,n)=>{ct(e,n,(i,a,f)=>{a===f||i==="children"||(i!=="style"||Y(f)?i[0]==="o"&&i[1]==="n"?(i=i.slice(2).toLowerCase(),a&&t.removeEventListener(i,a),t.addEventListener(i,f)):!(i in t)||t instanceof SVGElement?f==null||f===!1?t.removeAttribute(i):t.setAttribute(i,f):t[i]=f||"":ct(a,f,(p,h,m)=>{h!==m&&(t[i][p]=m||"")}))})};let H=0;const dt=t=>zt(null,t),zt=(t,e)=>{const[n,i]=W(H++);return n.length===0&&(n[0]=e,n[1]=a=>{n[0]=t?t(n[0],a):X(a)?a(n[0]):a,$t(i)}),n},ge=(t,e)=>Ht(t,e,"effect"),Ht=(t,e,n)=>{const[i,a]=W(H++);pt(i[1],e)&&(i[0]=t,i[1]=e,a.hooks[n].push(i))},Gt=(t,e)=>{const n=W(H++)[0];return pt(n[1],e)?(n[1]=e,n[0]=t()):n[0]},me=t=>Gt(()=>({current:t}),[]),W=t=>{const e=ne(),n=e.hooks||(e.hooks={list:[],effect:[],layout:[]});return t>=n.list.length&&n.list.push([]),[n.list[t],e]},pt=(t,e)=>!t||t.length!==e.length||e.some((n,i)=>!Object.is(n,t[i])),F=[],ht=[];let gt=0;const mt=t=>{ht.push(t)&&kt()},yt=t=>{F.push({callback:t}),mt(bt)},vt=t=>{const e=()=>ht.splice(0,1).forEach(n=>n());if(!t&&typeof Promise!="undefined")return()=>queueMicrotask(e);if(typeof MessageChannel!="undefined"){const{port1:n,port2:i}=new MessageChannel;return n.onmessage=e,()=>i.postMessage(null)}return()=>setTimeout(e)};let kt=vt(!1);const bt=()=>{gt=Et()+5;let t=ut(F);for(;t&&!wt();){const{callback:e}=t;t.callback=null;const n=e();n?t.callback=n:F.shift(),t=ut(F)}t&&mt(bt)},wt=()=>{const t=Et()>=gt;return kt=vt(t),t},Et=()=>performance.now(),ut=t=>t[0],Jt=t=>{t.lane!==8?(2&t.lane&&ft(t.node,t.oldProps||{},t.props),4&t.lane&&t.parentNode.insertBefore(t.node,t.after),Q(t.ref,t.node)):At(t)},Q=(t,e)=>{t&&(X(t)?t(e):t.current=e)},_t=t=>{t.forEach(e=>{e.kids&&_t(e.kids),Q(e.ref,null)})},At=t=>{t.isComp?(t.hooks&&t.hooks.list.forEach(e=>e[2]&&e[2]()),t.kids.forEach(At)):(_t(t.kids),t.parentNode.removeChild(t.node),Q(t.ref,null))};let Ct,V=null,D=null;const Zt=(t,e)=>{$t({node:e,props:{children:t}})},$t=t=>{!t||32&t.lane||(t.lane=34,yt(()=>(D=t,Pt(t))))},Pt=t=>{for(;t&&!wt();)t=Wt(t);return t?Pt.bind(null,t):(V&&((e=>{let n=e.e;e.e=null;do Jt(n);while(n=n.e)})(V),V=null),null)},Wt=t=>{if(t.isComp=X(t.type),t.isComp?Xt(t):Yt(t),t.child)return t.child;for(;t;){if(Qt(t),!V&&32&t.lane)return V=t,t.lane&=-33,null;if(t.sibling)return t.sibling;t=t.parent}},Qt=t=>{t.isComp?t.hooks&&(at(t.hooks.layout),yt(()=>at(t.hooks.effect))):(D.e=t,D=t)},Xt=t=>{H=0,Ct=t;let e=t.type(t.props);Nt(t,xt(e))},Yt=t=>{t.parentNode=te(t)||{},t.node||(t.type==="svg"&&(t.lane|=16),t.node=(e=>{const n=e.type==="#text"?document.createTextNode(""):16&e.lane?document.createElementNS("http://www.w3.org/2000/svg",e.type):document.createElement(e.type);return ft(n,{},e.props),n})(t)),t.childNodes=Array.from(t.node.childNodes||[]),Nt(t,t.props.children)},xt=t=>Y(t)?Lt(t):t,te=t=>{for(;t=t.parent;)if(!t.isComp)return t.node},Nt=(t,e)=>{let n=t.kids||[],i=t.kids=St(e),a=0,f=0,p=n.length-1,h=i.length-1;for(;a<=p&&f<=h&&G(n[a],i[f]);)B(n[a++],i[f++],2);for(;a<=p&&f<=h&&G(n[p],i[h]);)B(n[p--],i[h--],2);const{diff:m,keymap:N}=function(y,E,b=0,k=y.length-1,P=0,C=E.length-1){let I,j,$,O,r,d={},o=[],g=0,v=y.length,w=E.length,A=Math.min(v,w),s=Array(A+1);s[0]=-1;for(var l=1;l<s.length;l++)s[l]=C+1;let u=Array(A);for(l=P;l<=C;l++)j=E[l],r=j.key,r!=null?d[r]=l:o.push(l);for(l=b;l<=k;l++)I=y[l],O=I.key==null?o[g++]:d[I.key],O!=null&&($=ee(s,O),$>=0&&(s[$]=O,u[$]={newi:l,oldi:O,prev:u[$-1]}));for($=s.length-1;s[$]>C;)$--;let c=u[$],L=Array(w+v-$),R=k,q=C,K=L.length-1;for(;c;){const{newi:Tt,oldi:It}=c;for(;R>Tt;)L[K--]=4,R--;for(;q>It;)L[K--]=8,q--;L[K--]=2,R--,q--,c=c.prev}for(;R>=b;)L[K--]=4,R--;for(;q>=P;)L[K--]=8,q--;return{diff:L,keymap:d}}(i,n,f,h,a,p);let S=m.length;for(let y,E=0,b=a,k=f;E<S;E++){const P=m[E];if(P===2)G(n[b],i[k])?B(n[b],i[k],2):(i[k].lane=4,n[b].lane=8,D.e=n[b],D=n[b]),b++,k++;else if(P===4){let C=i[k];y=C.key!=null?N[C.key]:null,y!=null?(B(n[y],C,4),C.after=t.childNodes[b],n[y]=void 0):(C.after=t.childNodes?t.childNodes[b]:null,C.lane=4),k++}else P===8&&b++}for(let y=0,E=a;y<S;y++){let b=m[y];if(b===2)E++;else if(b===8){let k=n[E];k!==void 0&&(k.lane=8,D.e=k,D=k),E++}}for(let y=0,E=null,b=i.length;y<b;y++){const k=i[y];16&t.lane&&(k.lane|=16),k.parent=t,y>0?E.sibling=k:t.child=k,E=k}};function B(t,e,n){e.hooks=t.hooks,e.ref=t.ref,e.node=t.node,e.oldProps=t.props,e.lane=n,e.kids=t.kids}const G=(t,e)=>t&&e&&t.key===e.key&&t.type===e.type,St=t=>t?Dt(t)?t:[t]:[],at=t=>{t.forEach(e=>e[2]&&e[2]()),t.forEach(e=>e[2]=e[0]()),t.length=0};function ee(t,e){let n=1,i=t.length-1;for(;n<=i;){let a=n+i>>>1;e<t[a]?i=a-1:n=a+1}return n}const ne=()=>Ct||null,X=t=>typeof t=="function",Y=t=>typeof t=="number"||typeof t=="string",_=(t,e,...n)=>{(n=Ot(St((e=e||{}).children||n))).length&&(e.children=n.length===1?n[0]:n);const i=e.key||null,a=e.ref||null;return i&&(e.key=void 0),a&&(e.ref=void 0),re(t,e,i,a)},Ot=(t,e=[])=>(t.forEach(n=>{var i;Dt(n)?Ot(n,e):(i=n)!=null&&i!==!0&&i!==!1&&e.push(Y(n)?Lt(n):n)}),e),re=(t,e,n,i)=>({type:t,props:e,key:n,ref:i}),Lt=t=>({type:"#text",props:{nodeValue:t+""}});function oe(t){return t.children}const Dt=Array.isArray;function x(t,e){return new Promise(n=>{fetch(t,{method:"post",body:JSON.stringify(e),headers:{"Content-Type":"application/json",token:localStorage.getItem("token")}}).then(function(i){return i.json()}).then(i=>{n(i)})})}function T(t){return new Promise(e=>{fetch(t).then(function(n){return n.json()}).then(n=>{e(n)})})}function ye(t,e,n,i,a,f){return T(`https://api.clicli.cc/posts?status=${a||"public"}&sort=${t}&tag=${e}&uid=${f||""}&page=${n}&pageSize=${i}`)}function ve(){return T("https://api.clicli.cc/rank")}function ke(t){return T(`https://api.clicli.cc/post/${t}`)}function be(t){return T(`https://api.clicli.cc/pv/${t}`)}function we(t){return T(`https://api.clicli.cc/search/posts?key=${t}`)}function Ee({title:t,content:e,status:n,sort:i,tag:a,uid:f,videos:p}){return x("https://api.clicli.cc/post/add",{title:t,content:e,status:n,sort:i,tag:a,uid:tt().id,videos:p})}function tt(){return JSON.parse(window.localStorage.getItem("user"))}function _e({id:t,title:e,content:n,status:i,sort:a,tag:f,uid:p,time:h,videos:m}){return x(`https://api.clicli.cc/post/update/${t}`,{id:t,title:e,content:n,status:i,sort:a,tag:f,uid:p,time:h,videos:m})}function Ae({id:t,name:e,pwd:n,desc:i,qq:a,level:f}){return x(`https://api.clicli.cc/user/update/${t}`,{name:e,pwd:n,qq:a,desc:i,level:parseInt(f)})}function Ce({id:t,qq:e,name:n}){return T(`https://api.clicli.cc/user?uid=${t||""}&uname=${n||""}&uqq=${e||""}`)}let J={},Z=null,z=null;function le(t){const e=dt(0)[1];let n={routes:Object.entries(Z||t),setter:e,component:null,props:{}};return Z=t,z=n,et(z),typeof n.component.then=="function"?_("div",null):_(n.component,n.props,null)}function et(t){const{routes:e,setter:n}=t,i=location.pathname||"/";let a,f,p;for(let h=0;h<e.length;h++){const m=e[h];a=m[0],f=m[1];const[N,S]=ie(a),y=i.match(N);if(!y){f=()=>{};continue}S.length&&(p={},S.forEach((E,b)=>p[E]=y[b+1]));break}Object.assign(t,{path:a,component:f,props:p}),typeof f.then=="function"?tt()||a==="/login"||a==="/register"?f.then(h=>{Z[a]=h.default,n(Symbol())}):i!=="/register"&&setTimeout(()=>{U("/login")}):n(Symbol())}function ie(t){if(J[t])return J[t];const e=[new RegExp(`${t.substr(0,1)==="*"?"":"^"}${t.replace(/:[a-zA-Z]+/g,"([^/]+)").replace(/\*/g,"")}${t.substr(-1)==="*"?"":"$"}`)],n=t.match(/:[a-zA-Z]+/g);return e.push(n?n.map(i=>i.substr(1)):[]),J[t]=e,e}function U(t){window.history.pushState(null,null,t),et(z)}window.addEventListener("popstate",()=>et(z));function se(t){return!!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)}function $e(t){const{onClick:e,children:n}=t,i=a=>{e&&e(a),!event.defaultPrevented&&(!t.target||t.target==="_self")&&!se(event)&&(a.preventDefault(),U(a.target.href))};return _("a",lt(ot({},t),{onClick:i}),n)}var ce=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},Mt={exports:{}};(function(t){(function(e){function n(r,d){var o=(r&65535)+(d&65535),g=(r>>16)+(d>>16)+(o>>16);return g<<16|o&65535}function i(r,d){return r<<d|r>>>32-d}function a(r,d,o,g,v,w){return n(i(n(n(d,r),n(g,w)),v),o)}function f(r,d,o,g,v,w,A){return a(d&o|~d&g,r,d,v,w,A)}function p(r,d,o,g,v,w,A){return a(d&g|o&~g,r,d,v,w,A)}function h(r,d,o,g,v,w,A){return a(d^o^g,r,d,v,w,A)}function m(r,d,o,g,v,w,A){return a(o^(d|~g),r,d,v,w,A)}function N(r,d){r[d>>5]|=128<<d%32,r[(d+64>>>9<<4)+14]=d;var o,g,v,w,A,s=1732584193,l=-271733879,u=-1732584194,c=271733878;for(o=0;o<r.length;o+=16)g=s,v=l,w=u,A=c,s=f(s,l,u,c,r[o],7,-680876936),c=f(c,s,l,u,r[o+1],12,-389564586),u=f(u,c,s,l,r[o+2],17,606105819),l=f(l,u,c,s,r[o+3],22,-1044525330),s=f(s,l,u,c,r[o+4],7,-176418897),c=f(c,s,l,u,r[o+5],12,1200080426),u=f(u,c,s,l,r[o+6],17,-1473231341),l=f(l,u,c,s,r[o+7],22,-45705983),s=f(s,l,u,c,r[o+8],7,1770035416),c=f(c,s,l,u,r[o+9],12,-1958414417),u=f(u,c,s,l,r[o+10],17,-42063),l=f(l,u,c,s,r[o+11],22,-1990404162),s=f(s,l,u,c,r[o+12],7,1804603682),c=f(c,s,l,u,r[o+13],12,-40341101),u=f(u,c,s,l,r[o+14],17,-1502002290),l=f(l,u,c,s,r[o+15],22,1236535329),s=p(s,l,u,c,r[o+1],5,-165796510),c=p(c,s,l,u,r[o+6],9,-1069501632),u=p(u,c,s,l,r[o+11],14,643717713),l=p(l,u,c,s,r[o],20,-373897302),s=p(s,l,u,c,r[o+5],5,-701558691),c=p(c,s,l,u,r[o+10],9,38016083),u=p(u,c,s,l,r[o+15],14,-660478335),l=p(l,u,c,s,r[o+4],20,-405537848),s=p(s,l,u,c,r[o+9],5,568446438),c=p(c,s,l,u,r[o+14],9,-1019803690),u=p(u,c,s,l,r[o+3],14,-187363961),l=p(l,u,c,s,r[o+8],20,1163531501),s=p(s,l,u,c,r[o+13],5,-1444681467),c=p(c,s,l,u,r[o+2],9,-51403784),u=p(u,c,s,l,r[o+7],14,1735328473),l=p(l,u,c,s,r[o+12],20,-1926607734),s=h(s,l,u,c,r[o+5],4,-378558),c=h(c,s,l,u,r[o+8],11,-2022574463),u=h(u,c,s,l,r[o+11],16,1839030562),l=h(l,u,c,s,r[o+14],23,-35309556),s=h(s,l,u,c,r[o+1],4,-1530992060),c=h(c,s,l,u,r[o+4],11,1272893353),u=h(u,c,s,l,r[o+7],16,-155497632),l=h(l,u,c,s,r[o+10],23,-1094730640),s=h(s,l,u,c,r[o+13],4,681279174),c=h(c,s,l,u,r[o],11,-358537222),u=h(u,c,s,l,r[o+3],16,-722521979),l=h(l,u,c,s,r[o+6],23,76029189),s=h(s,l,u,c,r[o+9],4,-640364487),c=h(c,s,l,u,r[o+12],11,-421815835),u=h(u,c,s,l,r[o+15],16,530742520),l=h(l,u,c,s,r[o+2],23,-995338651),s=m(s,l,u,c,r[o],6,-198630844),c=m(c,s,l,u,r[o+7],10,1126891415),u=m(u,c,s,l,r[o+14],15,-1416354905),l=m(l,u,c,s,r[o+5],21,-57434055),s=m(s,l,u,c,r[o+12],6,1700485571),c=m(c,s,l,u,r[o+3],10,-1894986606),u=m(u,c,s,l,r[o+10],15,-1051523),l=m(l,u,c,s,r[o+1],21,-2054922799),s=m(s,l,u,c,r[o+8],6,1873313359),c=m(c,s,l,u,r[o+15],10,-30611744),u=m(u,c,s,l,r[o+6],15,-1560198380),l=m(l,u,c,s,r[o+13],21,1309151649),s=m(s,l,u,c,r[o+4],6,-145523070),c=m(c,s,l,u,r[o+11],10,-1120210379),u=m(u,c,s,l,r[o+2],15,718787259),l=m(l,u,c,s,r[o+9],21,-343485551),s=n(s,g),l=n(l,v),u=n(u,w),c=n(c,A);return[s,l,u,c]}function S(r){var d,o="",g=r.length*32;for(d=0;d<g;d+=8)o+=String.fromCharCode(r[d>>5]>>>d%32&255);return o}function y(r){var d,o=[];for(o[(r.length>>2)-1]=void 0,d=0;d<o.length;d+=1)o[d]=0;var g=r.length*8;for(d=0;d<g;d+=8)o[d>>5]|=(r.charCodeAt(d/8)&255)<<d%32;return o}function E(r){return S(N(y(r),r.length*8))}function b(r,d){var o,g=y(r),v=[],w=[],A;for(v[15]=w[15]=void 0,g.length>16&&(g=N(g,r.length*8)),o=0;o<16;o+=1)v[o]=g[o]^909522486,w[o]=g[o]^1549556828;return A=N(v.concat(y(d)),512+d.length*8),S(N(w.concat(A),512+128))}function k(r){var d="0123456789abcdef",o="",g,v;for(v=0;v<r.length;v+=1)g=r.charCodeAt(v),o+=d.charAt(g>>>4&15)+d.charAt(g&15);return o}function P(r){return unescape(encodeURIComponent(r))}function C(r){return E(P(r))}function I(r){return k(C(r))}function j(r,d){return b(P(r),P(d))}function $(r,d){return k(j(r,d))}function O(r,d,o){return d?o?j(d,r):$(d,r):o?C(r):I(r)}t.exports?t.exports=O:e.md5=O})(ce)})(Mt);var ue=Mt.exports;function ae(t){return/^[0-9]+$/.test(t)?`http://q1.qlogo.cn/g?b=qq&nk=${t}&s=640`:`https://sdn.geekzu.org/avatar/${ue(t)}?s=100&d=retro`}function Pe(t){let e=t.match(/suo(.+?)\)/i);return e?e[1].slice(2):"https://wx4.sinaimg.cn/mw690/0060lm7Tly1fvmtrka9p5j30b40b43yo.jpg"}function Ne(t){return t.substring(2,t.length)}function fe(){const[t,e]=dt("");let n=tt();const i=f=>{f.keyCode==13&&(console.log(t),U(`/search/${t}`))},a=f=>{e(f)};return _("header",null,_("div",{className:"wrap flex"},_("h1",{onclick:()=>U("/")},"clicli!"),_("div",{className:"search"},_("input",{type:"text",placeholder:"\u641C\u4E00\u4E0B\u4E0B\u83CA\u82B1\u53C8\u4E0D\u4F1A\u574F\u{1F60F}",onKeyDown:i,onInput:f=>a(f.target.value)})),_("div",{className:"biu"},_("li",null,_("i",{className:"icon-font icon-download"}),"Get APP"),_("li",{onClick:()=>U("/upload/0")},_("i",{className:"icon-font icon-upload"}),"Upload"),_("li",{className:"avatar"},_("img",{src:ae((n||{}).qq),alt:""})))))}const de={"/":M(()=>import("./home.b64fe456.js"),["home.b64fe456.js","home.1f6cb467.css","list.4903fa35.js","list.312dd69a.css"]),"/login":M(()=>import("./login.c196cab1.js"),["login.c196cab1.js","login.7970cd71.css"]),"/register/:id":M(()=>import("./register.51a821e8.js"),["register.51a821e8.js","login.7970cd71.css"]),"/upload/:id":M(()=>import("./upload.cfda4024.js"),["upload.cfda4024.js","upload.cb88d12a.css"]),"/play/:gv":M(()=>import("./play.66964372.js"),["play.66964372.js","play.b0dc4fdc.css"]),"/search/:k":M(()=>import("./search.2f96fad4.js"),["search.2f96fad4.js","list.4903fa35.js","list.312dd69a.css"])},pe=()=>{let t=le(de);return _(oe,null,window.location.pathname!=="/login"&&window.location.pathname!=="/register"&&_(fe,null),t)};Zt(_(pe,null),document.getElementById("app"));export{$e as A,_ as Y,ve as a,Pe as b,x as c,Ce as d,ke as e,_e as f,ye as g,Ee as h,Ne as i,me as j,ae as k,dt as l,T as m,be as n,we as o,U as p,ge as s,Ae as u};
