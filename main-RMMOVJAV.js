import{$ as j,$a as $s,$b as di,A as xn,Aa as Ls,Ab as fe,B as jr,Ba as Ns,Bb as R,C as ys,Ca as Ne,Cb as P,D as zr,Da as Bs,Db as Ws,E as oo,Ea as m,Eb as Ys,F as ze,Fa as In,Fb as $r,G as Qe,Ga as Vs,Gb as nt,H as le,Ha as so,Hb as Vt,I as Cs,Ia as js,Ib as M,J as Nt,Ja as Me,Jb as Fe,K,Ka as ct,Kb as h,L as Je,La as Te,Lb as ae,M as _,Ma as re,Mb as We,N as x,Na as X,Nb as Gr,O as g,Oa as zs,Ob as Xs,P as N,Pa as dt,Pb as qs,Q as s,Qa as lo,Qb as mo,R as li,Ra as k,Rb as ge,S as xs,Sa as w,Sb as Ks,T as lt,Ta as D,Tb as kn,U as ws,Ua as Ur,Ub as Zs,V as ie,Va as Us,Vb as ho,W as oe,Wa as ce,Wb as jt,X as wn,Xa as Re,Xb as Qs,Y as Ds,Ya as Hs,Yb as Ye,Z as O,Za as Bt,Zb as ye,_ as S,_a as co,_b as po,a as C,aa as I,ab as on,ac as Js,b as we,ba as en,bb as W,bc as ue,ca as Es,cb as B,cc as el,d as Ae,da as Ss,db as V,dc as U,e as st,ea as Q,eb as Hr,ec as Xe,f as y,fa as As,fb as ci,fc as tl,g as hs,ga as Ms,gb as ut,gc as fo,h as Br,ha as tn,hb as mt,i as ps,ia as ve,ib as L,j as fs,ja as et,jb as d,k as Z,ka as A,kb as u,l as gs,la as ro,lb as de,m as ee,ma as Is,mb as Ie,n as _s,na as nn,nb as Oe,o as no,oa as ks,ob as Be,p as Pt,pa as Dn,pb as uo,q as io,qa as En,qb as Ue,r as Ze,ra as Sn,rb as Ge,s as pe,sa as ao,sb as tt,t as Vr,ta as An,tb as De,u as Lt,ua as Mn,ub as T,v as vs,va as Ts,vb as Gs,w as Cn,wa as Os,wb as b,x as je,xa as Fs,xb as _e,y as bs,ya as Rs,yb as $,z as si,za as Ps,zb as wt}from"./chunk-XS6W35LE.js";var nl=null;function it(){return nl}function Wr(i){nl??=i}var ui=class{},Tn=(()=>{class i{historyGo(e){throw new Error("")}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:()=>s(il),providedIn:"platform"})}return i})();var il=(()=>{class i extends Tn{_location;_history;_doc=s(S);constructor(){super(),this._location=window.location,this._history=window.history}getBaseHrefFromDOM(){return it().getBaseHref(this._doc)}onPopState(e){let t=it().getGlobalEventTarget(this._doc,"window");return t.addEventListener("popstate",e,!1),()=>t.removeEventListener("popstate",e)}onHashChange(e){let t=it().getGlobalEventTarget(this._doc,"window");return t.addEventListener("hashchange",e,!1),()=>t.removeEventListener("hashchange",e)}get href(){return this._location.href}get protocol(){return this._location.protocol}get hostname(){return this._location.hostname}get port(){return this._location.port}get pathname(){return this._location.pathname}get search(){return this._location.search}get hash(){return this._location.hash}set pathname(e){this._location.pathname=e}pushState(e,t,o){this._history.pushState(e,t,o)}replaceState(e,t,o){this._history.replaceState(e,t,o)}forward(){this._history.forward()}back(){this._history.back()}historyGo(e=0){this._history.go(e)}getState(){return this._history.state}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:()=>new i,providedIn:"platform"})}return i})();function al(i,n){return i?n?i.endsWith("/")?n.startsWith("/")?i+n.slice(1):i+n:n.startsWith("/")?i+n:`${i}/${n}`:i:n}function ol(i){let n=i.search(/#|\?|$/);return i[n-1]==="/"?i.slice(0,n-1)+i.slice(n):i}function zt(i){return i&&i[0]!=="?"?`?${i}`:i}var go=(()=>{class i{historyGo(e){throw new Error("")}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:()=>s(Ku),providedIn:"root"})}return i})(),qu=new g(""),Ku=(()=>{class i extends go{_platformLocation;_baseHref;_removeListenerFns=[];constructor(e,t){super(),this._platformLocation=e,this._baseHref=t??this._platformLocation.getBaseHrefFromDOM()??s(S).location?.origin??""}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}prepareExternalUrl(e){return al(this._baseHref,e)}path(e=!1){let t=this._platformLocation.pathname+zt(this._platformLocation.search),o=this._platformLocation.hash;return o&&e?`${t}${o}`:t}pushState(e,t,o,r){let a=this.prepareExternalUrl(o+zt(r));this._platformLocation.pushState(e,t,a)}replaceState(e,t,o,r){let a=this.prepareExternalUrl(o+zt(r));this._platformLocation.replaceState(e,t,a)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static \u0275fac=function(t){return new(t||i)(N(Tn),N(qu,8))};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var _o=(()=>{class i{_subject=new y;_basePath;_locationStrategy;_urlChangeListeners=[];_urlChangeSubscription=null;constructor(e){this._locationStrategy=e;let t=this._locationStrategy.getBaseHref();this._basePath=Ju(ol(rl(t))),this._locationStrategy.onPopState(o=>{this._subject.next({url:this.path(!0),pop:!0,state:o.state,type:o.type})})}ngOnDestroy(){this._urlChangeSubscription?.unsubscribe(),this._urlChangeListeners=[]}path(e=!1){return this.normalize(this._locationStrategy.path(e))}getState(){return this._locationStrategy.getState()}isCurrentPathEqualTo(e,t=""){return this.path()==this.normalize(e+zt(t))}normalize(e){return i.stripTrailingSlash(Qu(this._basePath,rl(e)))}prepareExternalUrl(e){return e&&e[0]!=="/"&&(e="/"+e),this._locationStrategy.prepareExternalUrl(e)}go(e,t="",o=null){this._locationStrategy.pushState(o,"",e,t),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+zt(t)),o)}replaceState(e,t="",o=null){this._locationStrategy.replaceState(o,"",e,t),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+zt(t)),o)}forward(){this._locationStrategy.forward()}back(){this._locationStrategy.back()}historyGo(e=0){this._locationStrategy.historyGo?.(e)}onUrlChange(e){return this._urlChangeListeners.push(e),this._urlChangeSubscription??=this.subscribe(t=>{this._notifyUrlChangeListeners(t.url,t.state)}),()=>{let t=this._urlChangeListeners.indexOf(e);this._urlChangeListeners.splice(t,1),this._urlChangeListeners.length===0&&(this._urlChangeSubscription?.unsubscribe(),this._urlChangeSubscription=null)}}_notifyUrlChangeListeners(e="",t){this._urlChangeListeners.forEach(o=>o(e,t))}subscribe(e,t,o){return this._subject.subscribe({next:e,error:t??void 0,complete:o??void 0})}static normalizeQueryParams=zt;static joinWithSlash=al;static stripTrailingSlash=ol;static \u0275fac=function(t){return new(t||i)(N(go))};static \u0275prov=_({token:i,factory:()=>Zu(),providedIn:"root"})}return i})();function Zu(){return new _o(N(go))}function Qu(i,n){if(!i||!n.startsWith(i))return n;let e=n.substring(i.length);return e===""||["/",";","?","#"].includes(e[0])?e:n}function rl(i){return i.replace(/\/index\.html$/,"")}function Ju(i){if(new RegExp("^(https?:)?//").test(i)){let[,e]=i.split(/\/\/[^\/]+/);return e}return i}var Pe=(function(i){return i[i.Format=0]="Format",i[i.Standalone=1]="Standalone",i})(Pe||{}),te=(function(i){return i[i.Narrow=0]="Narrow",i[i.Abbreviated=1]="Abbreviated",i[i.Wide=2]="Wide",i[i.Short=3]="Short",i})(te||{}),He=(function(i){return i[i.Short=0]="Short",i[i.Medium=1]="Medium",i[i.Long=2]="Long",i[i.Full=3]="Full",i})(He||{}),Et={Decimal:0,Group:1,List:2,PercentSign:3,PlusSign:4,MinusSign:5,Exponential:6,SuperscriptingExponent:7,PerMille:8,Infinity:9,NaN:10,TimeSeparator:11,CurrencyDecimal:12,CurrencyGroup:13};function cl(i){return tt(i)[De.LocaleId]}function dl(i,n,e){let t=tt(i),o=[t[De.DayPeriodsFormat],t[De.DayPeriodsStandalone]],r=ot(o,n);return ot(r,e)}function ul(i,n,e){let t=tt(i),o=[t[De.DaysFormat],t[De.DaysStandalone]],r=ot(o,n);return ot(r,e)}function ml(i,n,e){let t=tt(i),o=[t[De.MonthsFormat],t[De.MonthsStandalone]],r=ot(o,n);return ot(r,e)}function hl(i,n){let t=tt(i)[De.Eras];return ot(t,n)}function mi(i,n){let e=tt(i);return ot(e[De.DateFormat],n)}function hi(i,n){let e=tt(i);return ot(e[De.TimeFormat],n)}function pi(i,n){let t=tt(i)[De.DateTimeFormat];return ot(t,n)}function fi(i,n){let e=tt(i),t=e[De.NumberSymbols][n];if(typeof t>"u"){if(n===Et.CurrencyDecimal)return e[De.NumberSymbols][Et.Decimal];if(n===Et.CurrencyGroup)return e[De.NumberSymbols][Et.Group]}return t}function pl(i){if(!i[De.ExtraData])throw new K(2303,!1)}function fl(i){let n=tt(i);return pl(n),(n[De.ExtraData][2]||[]).map(t=>typeof t=="string"?Yr(t):[Yr(t[0]),Yr(t[1])])}function gl(i,n,e){let t=tt(i);pl(t);let o=[t[De.ExtraData][0],t[De.ExtraData][1]],r=ot(o,n)||[];return ot(r,e)||[]}function ot(i,n){for(let e=n;e>-1;e--)if(typeof i[e]<"u")return i[e];throw new K(2304,!1)}function Yr(i){let[n,e]=i.split(":");return{hours:+n,minutes:+e}}var tm=/^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,vo={},nm=/((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/,im=256;function _l(i,n,e,t){let o=hm(i);om(n),n=Dt(e,n)||n;let a=[],l;for(;n;)if(l=nm.exec(n),l){a=a.concat(l.slice(1));let f=a.pop();if(!f)break;n=f}else{a.push(n);break}let c=o.getTimezoneOffset();t&&(c=bl(t,c),o=mm(o,t));let p="";return a.forEach(f=>{let v=dm(f);p+=v?v(o,e,c):f==="''"?"'":f.replace(/(^'|'$)/g,"").replace(/''/g,"'")}),p}function om(i){if(i.length>im)throw new K(2300,!1)}function wo(i,n,e){let t=new Date(0);return t.setFullYear(i,n,e),t.setHours(0,0,0),t}function Dt(i,n){let e=cl(i);if(vo[e]??={},vo[e][n])return vo[e][n];let t="";switch(n){case"shortDate":t=mi(i,He.Short);break;case"mediumDate":t=mi(i,He.Medium);break;case"longDate":t=mi(i,He.Long);break;case"fullDate":t=mi(i,He.Full);break;case"shortTime":t=hi(i,He.Short);break;case"mediumTime":t=hi(i,He.Medium);break;case"longTime":t=hi(i,He.Long);break;case"fullTime":t=hi(i,He.Full);break;case"short":let o=Dt(i,"shortTime"),r=Dt(i,"shortDate");t=bo(pi(i,He.Short),[o,r]);break;case"medium":let a=Dt(i,"mediumTime"),l=Dt(i,"mediumDate");t=bo(pi(i,He.Medium),[a,l]);break;case"long":let c=Dt(i,"longTime"),p=Dt(i,"longDate");t=bo(pi(i,He.Long),[c,p]);break;case"full":let f=Dt(i,"fullTime"),v=Dt(i,"fullDate");t=bo(pi(i,He.Full),[f,v]);break}return t&&(vo[e][n]=t),t}function bo(i,n){return n&&(i=i.replace(/\{([^}]+)}/g,function(e,t){return n!=null&&t in n?n[t]:e})),i}function ht(i,n,e="-",t,o){let r="";(i<0||o&&i<=0)&&(o?i=-i+1:(i=-i,r=e));let a=String(i);for(;a.length<n;)a="0"+a;return t&&(a=a.slice(a.length-n)),r+a}function rm(i,n){return ht(i,3).substring(0,n)}function Ce(i,n,e=0,t=!1,o=!1){return function(r,a){let l=am(i,r);if((e>0||l>-e)&&(l+=e),i===3)l===0&&e===-12&&(l=12);else if(i===6)return rm(l,n);let c=fi(a,Et.MinusSign);return ht(l,n,c,t,o)}}function am(i,n){switch(i){case 0:return n.getFullYear();case 1:return n.getMonth();case 2:return n.getDate();case 3:return n.getHours();case 4:return n.getMinutes();case 5:return n.getSeconds();case 6:return n.getMilliseconds();case 7:return n.getDay();default:throw new K(2301,!1)}}function se(i,n,e=Pe.Format,t=!1){return function(o,r){return sm(o,r,i,n,e,t)}}function sm(i,n,e,t,o,r){switch(e){case 2:return ml(n,o,t)[i.getMonth()];case 1:return ul(n,o,t)[i.getDay()];case 0:let a=i.getHours(),l=i.getMinutes();if(r){let p=fl(n),f=gl(n,o,t),v=p.findIndex(F=>{if(Array.isArray(F)){let[q,Y]=F,J=a>=q.hours&&l>=q.minutes,G=a<Y.hours||a===Y.hours&&l<Y.minutes;if(q.hours<Y.hours){if(J&&G)return!0}else if(J||G)return!0}else if(F.hours===a&&F.minutes===l)return!0;return!1});if(v!==-1)return f[v]}return dl(n,o,t)[a<12?0:1];case 3:return hl(n,t)[i.getFullYear()<=0?0:1];default:let c=e;throw new K(2302,!1)}}function yo(i){return function(n,e,t){let o=-1*t,r=fi(e,Et.MinusSign),a=o>0?Math.floor(o/60):Math.ceil(o/60);switch(i){case 0:return(o>=0?"+":"")+ht(a,2,r)+ht(Math.abs(o%60),2,r);case 1:return"GMT"+(o>=0?"+":"")+ht(a,1,r);case 2:return"GMT"+(o>=0?"+":"")+ht(a,2,r)+":"+ht(Math.abs(o%60),2,r);case 3:return t===0?"Z":(o>=0?"+":"")+ht(a,2,r)+":"+ht(Math.abs(o%60),2,r);default:throw new K(2310,!1)}}}var lm=0,xo=4;function cm(i){let n=wo(i,lm,1).getDay();return wo(i,0,1+(n<=xo?xo:xo+7)-n)}function vl(i){let n=i.getDay(),e=n===0?-3:xo-n;return wo(i.getFullYear(),i.getMonth(),i.getDate()+e)}function Xr(i,n=!1){return function(e,t){let o;if(n){let r=new Date(e.getFullYear(),e.getMonth(),1).getDay()-1,a=e.getDate();o=1+Math.floor((a+r)/7)}else{let r=vl(e),a=cm(r.getFullYear()),l=r.getTime()-a.getTime();o=1+Math.round(l/6048e5)}return ht(o,i,fi(t,Et.MinusSign))}}function Co(i,n=!1){return function(e,t){let r=vl(e).getFullYear();return ht(r,i,fi(t,Et.MinusSign),n)}}var qr={};function dm(i){if(qr[i])return qr[i];let n;switch(i){case"G":case"GG":case"GGG":n=se(3,te.Abbreviated);break;case"GGGG":n=se(3,te.Wide);break;case"GGGGG":n=se(3,te.Narrow);break;case"y":n=Ce(0,1,0,!1,!0);break;case"yy":n=Ce(0,2,0,!0,!0);break;case"yyy":n=Ce(0,3,0,!1,!0);break;case"yyyy":n=Ce(0,4,0,!1,!0);break;case"Y":n=Co(1);break;case"YY":n=Co(2,!0);break;case"YYY":n=Co(3);break;case"YYYY":n=Co(4);break;case"M":case"L":n=Ce(1,1,1);break;case"MM":case"LL":n=Ce(1,2,1);break;case"MMM":n=se(2,te.Abbreviated);break;case"MMMM":n=se(2,te.Wide);break;case"MMMMM":n=se(2,te.Narrow);break;case"LLL":n=se(2,te.Abbreviated,Pe.Standalone);break;case"LLLL":n=se(2,te.Wide,Pe.Standalone);break;case"LLLLL":n=se(2,te.Narrow,Pe.Standalone);break;case"w":n=Xr(1);break;case"ww":n=Xr(2);break;case"W":n=Xr(1,!0);break;case"d":n=Ce(2,1);break;case"dd":n=Ce(2,2);break;case"c":case"cc":n=Ce(7,1);break;case"ccc":n=se(1,te.Abbreviated,Pe.Standalone);break;case"cccc":n=se(1,te.Wide,Pe.Standalone);break;case"ccccc":n=se(1,te.Narrow,Pe.Standalone);break;case"cccccc":n=se(1,te.Short,Pe.Standalone);break;case"E":case"EE":case"EEE":n=se(1,te.Abbreviated);break;case"EEEE":n=se(1,te.Wide);break;case"EEEEE":n=se(1,te.Narrow);break;case"EEEEEE":n=se(1,te.Short);break;case"a":case"aa":case"aaa":n=se(0,te.Abbreviated);break;case"aaaa":n=se(0,te.Wide);break;case"aaaaa":n=se(0,te.Narrow);break;case"b":case"bb":case"bbb":n=se(0,te.Abbreviated,Pe.Standalone,!0);break;case"bbbb":n=se(0,te.Wide,Pe.Standalone,!0);break;case"bbbbb":n=se(0,te.Narrow,Pe.Standalone,!0);break;case"B":case"BB":case"BBB":n=se(0,te.Abbreviated,Pe.Format,!0);break;case"BBBB":n=se(0,te.Wide,Pe.Format,!0);break;case"BBBBB":n=se(0,te.Narrow,Pe.Format,!0);break;case"h":n=Ce(3,1,-12);break;case"hh":n=Ce(3,2,-12);break;case"H":n=Ce(3,1);break;case"HH":n=Ce(3,2);break;case"m":n=Ce(4,1);break;case"mm":n=Ce(4,2);break;case"s":n=Ce(5,1);break;case"ss":n=Ce(5,2);break;case"S":n=Ce(6,1);break;case"SS":n=Ce(6,2);break;case"SSS":n=Ce(6,3);break;case"Z":case"ZZ":case"ZZZ":n=yo(0);break;case"ZZZZZ":n=yo(3);break;case"O":case"OO":case"OOO":case"z":case"zz":case"zzz":n=yo(1);break;case"OOOO":case"ZZZZ":case"zzzz":n=yo(2);break;default:return null}return qr[i]=n,n}function bl(i,n){i=i.replace(/:/g,"");let e=Date.parse("Jan 01, 1970 00:00:00 "+i)/6e4;return isNaN(e)?n:e}function um(i,n){return i=new Date(i.getTime()),i.setMinutes(i.getMinutes()+n),i}function mm(i,n,e){let o=i.getTimezoneOffset(),r=bl(n,o);return um(i,-1*(r-o))}function hm(i){if(sl(i))return i;if(typeof i=="number"&&!isNaN(i))return new Date(i);if(typeof i=="string"){if(i=i.trim(),/^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(i)){let[o,r=1,a=1]=i.split("-").map(l=>+l);return wo(o,r-1,a)}let e=parseFloat(i);if(!isNaN(i-e))return new Date(e);let t;if(t=i.match(tm))return pm(t)}let n=new Date(i);if(!sl(n))throw new K(2311,!1);return n}function pm(i){let n=new Date(0),e=0,t=0,o=i[8]?n.setUTCFullYear:n.setFullYear,r=i[8]?n.setUTCHours:n.setHours;i[9]&&(e=Number(i[9]+i[10]),t=Number(i[9]+i[11])),o.call(n,Number(i[1]),Number(i[2])-1,Number(i[3]));let a=Number(i[4]||0)-e,l=Number(i[5]||0)-t,c=Number(i[6]||0),p=Math.floor(parseFloat("0."+(i[7]||0))*1e3);return r.call(n,a,l,c,p),n}function sl(i){return i instanceof Date&&!isNaN(i.valueOf())}var gi=(()=>{class i{_viewContainerRef;_viewRef=null;ngTemplateOutletContext=null;ngTemplateOutlet=null;ngTemplateOutletInjector=null;injector=s(O);constructor(e){this._viewContainerRef=e}ngOnChanges(e){if(this._shouldRecreateView(e)){let t=this._viewContainerRef;if(this._viewRef&&t.remove(t.indexOf(this._viewRef)),!this.ngTemplateOutlet){this._viewRef=null;return}let o=this._createContextForwardProxy();this._viewRef=t.createEmbeddedView(this.ngTemplateOutlet,o,{injector:this._getInjector()})}}_getInjector(){return this.ngTemplateOutletInjector==="outlet"?this.injector:this.ngTemplateOutletInjector??void 0}_shouldRecreateView(e){return!!e.ngTemplateOutlet||!!e.ngTemplateOutletInjector}_createContextForwardProxy(){return new Proxy({},{set:(e,t,o)=>this.ngTemplateOutletContext?Reflect.set(this.ngTemplateOutletContext,t,o):!1,get:(e,t,o)=>{if(this.ngTemplateOutletContext)return Reflect.get(this.ngTemplateOutletContext,t,o)}})}static \u0275fac=function(t){return new(t||i)(X(dt))};static \u0275dir=D({type:i,selectors:[["","ngTemplateOutlet",""]],inputs:{ngTemplateOutletContext:"ngTemplateOutletContext",ngTemplateOutlet:"ngTemplateOutlet",ngTemplateOutletInjector:"ngTemplateOutletInjector"},features:[ve]})}return i})();function yl(i,n){return new K(2100,!1)}var Kr=class{createSubscription(n,e,t){return Ye(()=>n.subscribe({next:e,error:t}))}dispose(n){Ye(()=>n.unsubscribe())}},Zr=class{createSubscription(n,e,t){return n.then(o=>e?.(o),o=>t?.(o)),{unsubscribe:()=>{e=null,t=null}}}dispose(n){n.unsubscribe()}},fm=new Zr,gm=new Kr,Qr=(()=>{class i{_ref;_latestValue=null;markForCheckOnValueUpdate=!0;_subscription=null;_obj=null;_strategy=null;applicationErrorHandler=s(Es);constructor(e){this._ref=e}ngOnDestroy(){this._subscription&&this._dispose(),this._ref=null}transform(e){if(!this._obj){if(e)try{this.markForCheckOnValueUpdate=!1,this._subscribe(e)}finally{this.markForCheckOnValueUpdate=!0}return this._latestValue}return e!==this._obj?(this._dispose(),this.transform(e)):this._latestValue}_subscribe(e){this._obj=e,this._strategy=this._selectStrategy(e),this._subscription=this._strategy.createSubscription(e,t=>this._updateLatestValue(e,t),t=>this.applicationErrorHandler(t))}_selectStrategy(e){if(co(e))return fm;if($s(e))return gm;throw yl(i,e)}_dispose(){this._strategy.dispose(this._subscription),this._latestValue=null,this._subscription=null,this._obj=null}_updateLatestValue(e,t){e===this._obj&&(this._latestValue=t,this.markForCheckOnValueUpdate&&this._ref?.markForCheck())}static \u0275fac=function(t){return new(t||i)(X(ue,16))};static \u0275pipe=Ur({name:"async",type:i,pure:!1})}return i})();var _m="mediumDate",Cl=new g(""),xl=new g(""),Jr=(()=>{class i{locale;defaultTimezone;defaultOptions;constructor(e,t,o){this.locale=e,this.defaultTimezone=t,this.defaultOptions=o}transform(e,t,o,r){if(e==null||e===""||e!==e)return null;try{let a=t??this.defaultOptions?.dateFormat??_m,l=o??this.defaultOptions?.timezone??this.defaultTimezone??void 0;return _l(e,a,r||this.locale,l)}catch(a){throw yl(i,a.message)}}static \u0275fac=function(t){return new(t||i)(X(Qs,16),X(Cl,24),X(xl,24))};static \u0275pipe=Ur({name:"date",type:i,pure:!0})}return i})();var On=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({})}return i})();function _i(i,n){n=encodeURIComponent(n);for(let e of i.split(";")){let t=e.indexOf("="),[o,r]=t==-1?[e,""]:[e.slice(0,t),e.slice(t+1)];if(o.trim()===n)return decodeURIComponent(r)}return null}var rn=class{};var ea="browser";function wl(i){return i===ea}var vi=class{_doc;constructor(n){this._doc=n}manager},Do=(()=>{class i extends vi{constructor(e){super(e)}supports(e){return!0}addEventListener(e,t,o,r){return e.addEventListener(t,o,r),()=>this.removeEventListener(e,t,o,r)}removeEventListener(e,t,o,r){return e.removeEventListener(t,o,r)}static \u0275fac=function(t){return new(t||i)(N(S))};static \u0275prov=_({token:i,factory:i.\u0275fac})}return i})(),Ao=new g(""),oa=(()=>{class i{_zone;_plugins;_eventNameToPlugin=new Map;constructor(e,t){this._zone=t,e.forEach(a=>{a.manager=this});let o=e.filter(a=>!(a instanceof Do));this._plugins=o.slice().reverse();let r=e.find(a=>a instanceof Do);r&&this._plugins.push(r)}addEventListener(e,t,o,r){return this._findPluginFor(t).addEventListener(e,t,o,r)}getZone(){return this._zone}_findPluginFor(e){let t=this._eventNameToPlugin.get(e);if(t)return t;if(t=this._plugins.find(r=>r.supports(e)),!t)throw new K(5101,!1);return this._eventNameToPlugin.set(e,t),t}static \u0275fac=function(t){return new(t||i)(N(Ao),N(I))};static \u0275prov=_({token:i,factory:i.\u0275fac})}return i})(),ta="ng-app-id";function El(i){for(let n of i)n.remove()}function Sl(i,n){let e=n.createElement("style");return e.textContent=i,e}function bm(i,n,e,t){let o=i.head?.querySelectorAll(`style[${ta}="${n}"],link[${ta}="${n}"]`);if(o)for(let r of o)r.removeAttribute(ta),r instanceof HTMLLinkElement?t.set(r.href.slice(r.href.lastIndexOf("/")+1),{usage:0,elements:[r]}):r.textContent&&e.set(r.textContent,{usage:0,elements:[r]})}function ia(i,n){let e=n.createElement("link");return e.setAttribute("rel","stylesheet"),e.setAttribute("href",i),e}var ra=(()=>{class i{doc;appId;nonce;inline=new Map;external=new Map;hosts=new Set;constructor(e,t,o,r={}){this.doc=e,this.appId=t,this.nonce=o,bm(e,t,this.inline,this.external),this.hosts.add(e.head)}addStyles(e,t){for(let o of e)this.addUsage(o,this.inline,Sl);t?.forEach(o=>this.addUsage(o,this.external,ia))}removeStyles(e,t){for(let o of e)this.removeUsage(o,this.inline);t?.forEach(o=>this.removeUsage(o,this.external))}addUsage(e,t,o){let r=t.get(e);r?r.usage++:t.set(e,{usage:1,elements:[...this.hosts].map(a=>this.addElement(a,o(e,this.doc)))})}removeUsage(e,t){let o=t.get(e);o&&(o.usage--,o.usage<=0&&(El(o.elements),t.delete(e)))}ngOnDestroy(){for(let[,{elements:e}]of[...this.inline,...this.external])El(e);this.hosts.clear()}addHost(e){this.hosts.add(e);for(let[t,{elements:o}]of this.inline)o.push(this.addElement(e,Sl(t,this.doc)));for(let[t,{elements:o}]of this.external)o.push(this.addElement(e,ia(t,this.doc)))}removeHost(e){this.hosts.delete(e)}addElement(e,t){return this.nonce&&t.setAttribute("nonce",this.nonce),e.appendChild(t)}static \u0275fac=function(t){return new(t||i)(N(S),N(nn),N(Sn,8),N(Dn))};static \u0275prov=_({token:i,factory:i.\u0275fac})}return i})(),na={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/",math:"http://www.w3.org/1998/Math/MathML"},aa=/%COMP%/g;var Ml="%COMP%",ym=`_nghost-${Ml}`,Cm=`_ngcontent-${Ml}`,xm=!0,wm=new g("",{factory:()=>xm});function Dm(i){return Cm.replace(aa,i)}function Em(i){return ym.replace(aa,i)}function Il(i,n){return n.map(e=>e.replace(aa,i))}var Ci=(()=>{class i{eventManager;sharedStylesHost;appId;removeStylesOnCompDestroy;doc;ngZone;nonce;tracingService;rendererByCompId=new Map;defaultRenderer;constructor(e,t,o,r,a,l,c=null,p=null){this.eventManager=e,this.sharedStylesHost=t,this.appId=o,this.removeStylesOnCompDestroy=r,this.doc=a,this.ngZone=l,this.nonce=c,this.tracingService=p,this.defaultRenderer=new bi(e,a,l,this.tracingService)}createRenderer(e,t){if(!e||!t)return this.defaultRenderer;let o=this.getOrCreateRenderer(e,t);return o instanceof So?o.applyToHost(e):o instanceof yi&&o.applyStyles(),o}getOrCreateRenderer(e,t){let o=this.rendererByCompId,r=o.get(t.id);if(!r){let a=this.doc,l=this.ngZone,c=this.eventManager,p=this.sharedStylesHost,f=this.removeStylesOnCompDestroy,v=this.tracingService;switch(t.encapsulation){case ao.Emulated:r=new So(c,p,t,this.appId,f,a,l,v);break;case ao.ShadowDom:return new Eo(c,e,t,a,l,this.nonce,v,p);case ao.ExperimentalIsolatedShadowDom:return new Eo(c,e,t,a,l,this.nonce,v);default:r=new yi(c,p,t,f,a,l,v);break}o.set(t.id,r)}return r}ngOnDestroy(){this.rendererByCompId.clear()}componentReplaced(e){this.rendererByCompId.delete(e)}static \u0275fac=function(t){return new(t||i)(N(oa),N(ra),N(nn),N(wm),N(S),N(I),N(Sn),N(so,8))};static \u0275prov=_({token:i,factory:i.\u0275fac})}return i})(),bi=class{eventManager;doc;ngZone;tracingService;data=Object.create(null);throwOnSyntheticProps=!0;constructor(n,e,t,o){this.eventManager=n,this.doc=e,this.ngZone=t,this.tracingService=o}destroy(){}destroyNode=null;createElement(n,e){return e?this.doc.createElementNS(na[e]||e,n):this.doc.createElement(n)}createComment(n){return this.doc.createComment(n)}createText(n){return this.doc.createTextNode(n)}appendChild(n,e){(Al(n)?n.content:n).appendChild(e)}insertBefore(n,e,t){n&&(Al(n)?n.content:n).insertBefore(e,t)}removeChild(n,e){e.remove()}selectRootElement(n,e){let t=typeof n=="string"?this.doc.querySelector(n):n;if(!t)throw new K(-5104,!1);return e||(t.textContent=""),t}parentNode(n){return n.parentNode}nextSibling(n){return n.nextSibling}setAttribute(n,e,t,o){if(o){e=o+":"+e;let r=na[o];r?n.setAttributeNS(r,e,t):n.setAttribute(e,t)}else n.setAttribute(e,t)}removeAttribute(n,e,t){if(t){let o=na[t];o?n.removeAttributeNS(o,e):n.removeAttribute(`${t}:${e}`)}else n.removeAttribute(e)}addClass(n,e){n.classList.add(e)}removeClass(n,e){n.classList.remove(e)}setStyle(n,e,t,o){o&(In.DashCase|In.Important)?n.style.setProperty(e,t,o&In.Important?"important":""):n.style[e]=t}removeStyle(n,e,t){t&In.DashCase?n.style.removeProperty(e):n.style[e]=""}setProperty(n,e,t){n!=null&&(n[e]=t)}setValue(n,e){n.nodeValue=e}listen(n,e,t,o){if(typeof n=="string"&&(n=it().getGlobalEventTarget(this.doc,n),!n))throw new K(5102,!1);let r=this.decoratePreventDefault(t);return this.tracingService?.wrapEventListener&&(r=this.tracingService.wrapEventListener(n,e,r)),this.eventManager.addEventListener(n,e,r,o)}decoratePreventDefault(n){return e=>{if(e==="__ngUnwrap__")return n;n(e)===!1&&e.preventDefault()}}};function Al(i){return i.tagName==="TEMPLATE"&&i.content!==void 0}var Eo=class extends bi{hostEl;sharedStylesHost;shadowRoot;constructor(n,e,t,o,r,a,l,c){super(n,o,r,l),this.hostEl=e,this.sharedStylesHost=c,this.shadowRoot=e.attachShadow({mode:"open"}),this.sharedStylesHost&&this.sharedStylesHost.addHost(this.shadowRoot);let p=t.styles;p=Il(t.id,p);for(let v of p){let F=document.createElement("style");a&&F.setAttribute("nonce",a),F.textContent=v,this.shadowRoot.appendChild(F)}let f=t.getExternalStyles?.();if(f)for(let v of f){let F=ia(v,o);a&&F.setAttribute("nonce",a),this.shadowRoot.appendChild(F)}}nodeOrShadowRoot(n){return n===this.hostEl?this.shadowRoot:n}appendChild(n,e){return super.appendChild(this.nodeOrShadowRoot(n),e)}insertBefore(n,e,t){return super.insertBefore(this.nodeOrShadowRoot(n),e,t)}removeChild(n,e){return super.removeChild(null,e)}parentNode(n){return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)))}destroy(){this.sharedStylesHost&&this.sharedStylesHost.removeHost(this.shadowRoot)}},yi=class extends bi{sharedStylesHost;removeStylesOnCompDestroy;styles;styleUrls;constructor(n,e,t,o,r,a,l,c){super(n,r,a,l),this.sharedStylesHost=e,this.removeStylesOnCompDestroy=o;let p=t.styles;this.styles=c?Il(c,p):p,this.styleUrls=t.getExternalStyles?.(c)}applyStyles(){this.sharedStylesHost.addStyles(this.styles,this.styleUrls)}destroy(){this.removeStylesOnCompDestroy&&Vs.size===0&&this.sharedStylesHost.removeStyles(this.styles,this.styleUrls)}},So=class extends yi{contentAttr;hostAttr;constructor(n,e,t,o,r,a,l,c){let p=o+"-"+t.id;super(n,e,t,r,a,l,c,p),this.contentAttr=Dm(p),this.hostAttr=Em(p)}applyToHost(n){this.applyStyles(),this.setAttribute(n,this.hostAttr,"")}createElement(n,e){let t=super.createElement(n,e);return super.setAttribute(t,this.contentAttr,""),t}};var Mo=class i extends ui{supportsDOMEvents=!0;static makeCurrent(){Wr(new i)}onAndCancel(n,e,t,o){return n.addEventListener(e,t,o),()=>{n.removeEventListener(e,t,o)}}dispatchEvent(n,e){n.dispatchEvent(e)}remove(n){n.remove()}createElement(n,e){return e=e||this.getDefaultDocument(),e.createElement(n)}createHtmlDocument(){return document.implementation.createHTMLDocument("fakeTitle")}getDefaultDocument(){return document}isElementNode(n){return n.nodeType===Node.ELEMENT_NODE}isShadowRoot(n){return n instanceof DocumentFragment}getGlobalEventTarget(n,e){return e==="window"?window:e==="document"?n:e==="body"?n.body:null}getBaseHref(n){let e=Am();return e==null?null:Mm(e)}resetBaseElement(){xi=null}getUserAgent(){return window.navigator.userAgent}getCookie(n){return _i(document.cookie,n)}},xi=null;function Am(){return xi=xi||document.head.querySelector("base"),xi?xi.getAttribute("href"):null}function Mm(i){return new URL(i,document.baseURI).pathname}var Im=(()=>{class i{build(){return new XMLHttpRequest}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac})}return i})(),kl=["alt","control","meta","shift"],km={"\b":"Backspace","	":"Tab","\x7F":"Delete","\x1B":"Escape",Del:"Delete",Esc:"Escape",Left:"ArrowLeft",Right:"ArrowRight",Up:"ArrowUp",Down:"ArrowDown",Menu:"ContextMenu",Scroll:"ScrollLock",Win:"OS"},Tm={alt:i=>i.altKey,control:i=>i.ctrlKey,meta:i=>i.metaKey,shift:i=>i.shiftKey},Tl=(()=>{class i extends vi{constructor(e){super(e)}supports(e){return i.parseEventName(e)!=null}addEventListener(e,t,o,r){let a=i.parseEventName(t),l=i.eventCallback(a.fullKey,o,this.manager.getZone());return this.manager.getZone().runOutsideAngular(()=>it().onAndCancel(e,a.domEventName,l,r))}static parseEventName(e){let t=e.toLowerCase().split("."),o=t.shift();if(t.length===0||!(o==="keydown"||o==="keyup"))return null;let r=i._normalizeKey(t.pop()),a="",l=t.indexOf("code");if(l>-1&&(t.splice(l,1),a="code."),kl.forEach(p=>{let f=t.indexOf(p);f>-1&&(t.splice(f,1),a+=p+".")}),a+=r,t.length!=0||r.length===0)return null;let c={};return c.domEventName=o,c.fullKey=a,c}static matchEventFullKeyCode(e,t){let o=km[e.key]||e.key,r="";return t.indexOf("code.")>-1&&(o=e.code,r="code."),o==null||!o?!1:(o=o.toLowerCase(),o===" "?o="space":o==="."&&(o="dot"),kl.forEach(a=>{if(a!==o){let l=Tm[a];l(e)&&(r+=a+".")}}),r+=o,r===t)}static eventCallback(e,t,o){return r=>{i.matchEventFullKeyCode(r,e)&&o.runGuarded(()=>t(r))}}static _normalizeKey(e){return e==="esc"?"escape":e}static \u0275fac=function(t){return new(t||i)(N(S))};static \u0275prov=_({token:i,factory:i.\u0275fac})}return i})();async function sa(i,n,e){let t=C({rootComponent:i},Om(n,e));return el(t)}function Om(i,n){return{platformRef:n?.platformRef,appProviders:[...Nm,...i?.providers??[]],platformProviders:Lm}}function Fm(){Mo.makeCurrent()}function Rm(){return new en}function Pm(){return Is(document),document}var Lm=[{provide:Dn,useValue:ea},{provide:ks,useValue:Fm,multi:!0},{provide:S,useFactory:Pm}];var Nm=[{provide:xs,useValue:"root"},{provide:en,useFactory:Rm},{provide:Ao,useClass:Do,multi:!0},{provide:Ao,useClass:Tl,multi:!0},Ci,ra,oa,{provide:Te,useExisting:Ci},{provide:rn,useClass:Im},[]];var rt=class i{headers;normalizedNames=new Map;lazyInit;lazyUpdate=null;constructor(n){n?typeof n=="string"?this.lazyInit=()=>{this.headers=new Map,n.split(`
`).forEach(e=>{let t=e.indexOf(":");if(t>0){let o=e.slice(0,t),r=e.slice(t+1).trim();this.addHeaderEntry(o,r)}})}:typeof Headers<"u"&&n instanceof Headers?(this.headers=new Map,n.forEach((e,t)=>{this.addHeaderEntry(t,e)})):this.lazyInit=()=>{this.headers=new Map,Object.entries(n).forEach(([e,t])=>{this.setHeaderEntries(e,t)})}:this.headers=new Map}has(n){return this.init(),this.headers.has(n.toLowerCase())}get(n){this.init();let e=this.headers.get(n.toLowerCase());return e&&e.length>0?e[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(n){return this.init(),this.headers.get(n.toLowerCase())||null}append(n,e){return this.clone({name:n,value:e,op:"a"})}set(n,e){return this.clone({name:n,value:e,op:"s"})}delete(n,e){return this.clone({name:n,value:e,op:"d"})}maybeSetNormalizedName(n,e){this.normalizedNames.has(e)||this.normalizedNames.set(e,n)}init(){this.lazyInit&&(this.lazyInit instanceof i?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(n=>this.applyUpdate(n)),this.lazyUpdate=null))}copyFrom(n){n.init(),Array.from(n.headers.keys()).forEach(e=>{this.headers.set(e,n.headers.get(e)),this.normalizedNames.set(e,n.normalizedNames.get(e))})}clone(n){let e=new i;return e.lazyInit=this.lazyInit&&this.lazyInit instanceof i?this.lazyInit:this,e.lazyUpdate=(this.lazyUpdate||[]).concat([n]),e}applyUpdate(n){let e=n.name.toLowerCase();switch(n.op){case"a":case"s":let t=n.value;if(typeof t=="string"&&(t=[t]),t.length===0)return;this.maybeSetNormalizedName(n.name,e);let o=(n.op==="a"?this.headers.get(e):void 0)||[];o.push(...t),this.headers.set(e,o);break;case"d":let r=n.value;if(!r)this.headers.delete(e),this.normalizedNames.delete(e);else{let a=this.headers.get(e);if(!a)return;a=a.filter(l=>r.indexOf(l)===-1),a.length===0?(this.headers.delete(e),this.normalizedNames.delete(e)):this.headers.set(e,a)}break}}addHeaderEntry(n,e){let t=n.toLowerCase();this.maybeSetNormalizedName(n,t),this.headers.has(t)?this.headers.get(t).push(e):this.headers.set(t,[e])}setHeaderEntries(n,e){let t=(Array.isArray(e)?e:[e]).map(r=>r.toString()),o=n.toLowerCase();this.headers.set(o,t),this.maybeSetNormalizedName(n,o)}forEach(n){this.init(),Array.from(this.normalizedNames.keys()).forEach(e=>n(this.normalizedNames.get(e),this.headers.get(e)))}};var ko=class{map=new Map;set(n,e){return this.map.set(n,e),this}get(n){return this.map.has(n)||this.map.set(n,n.defaultValue()),this.map.get(n)}delete(n){return this.map.delete(n),this}has(n){return this.map.has(n)}keys(){return this.map.keys()}},To=class{encodeKey(n){return Ol(n)}encodeValue(n){return Ol(n)}decodeKey(n){return decodeURIComponent(n)}decodeValue(n){return decodeURIComponent(n)}};function Bm(i,n){let e=new Map;return i.length>0&&i.replace(/^\?/,"").split("&").forEach(o=>{let r=o.indexOf("="),[a,l]=r==-1?[n.decodeKey(o),""]:[n.decodeKey(o.slice(0,r)),n.decodeValue(o.slice(r+1))],c=e.get(a)||[];c.push(l),e.set(a,c)}),e}var Vm=/%(\d[a-f0-9])/gi,jm={40:"@","3A":":",24:"$","2C":",","3B":";","3D":"=","3F":"?","2F":"/"};function Ol(i){return encodeURIComponent(i).replace(Vm,(n,e)=>jm[e]??n)}function Io(i){return`${i}`}var St=class i{map;encoder;updates=null;cloneFrom=null;constructor(n={}){if(this.encoder=n.encoder||new To,n.fromString){if(n.fromObject)throw new K(2805,!1);this.map=Bm(n.fromString,this.encoder)}else n.fromObject?(this.map=new Map,Object.keys(n.fromObject).forEach(e=>{let t=n.fromObject[e],o=Array.isArray(t)?t.map(Io):[Io(t)];this.map.set(e,o)})):this.map=null}has(n){return this.init(),this.map.has(n)}get(n){this.init();let e=this.map.get(n);return e?e[0]:null}getAll(n){return this.init(),this.map.get(n)||null}keys(){return this.init(),Array.from(this.map.keys())}append(n,e){return this.clone({param:n,value:e,op:"a"})}appendAll(n){let e=[];return Object.keys(n).forEach(t=>{let o=n[t];Array.isArray(o)?o.forEach(r=>{e.push({param:t,value:r,op:"a"})}):e.push({param:t,value:o,op:"a"})}),this.clone(e)}set(n,e){return this.clone({param:n,value:e,op:"s"})}delete(n,e){return this.clone({param:n,value:e,op:"d"})}toString(){return this.init(),this.keys().map(n=>{let e=this.encoder.encodeKey(n);return this.map.get(n).map(t=>e+"="+this.encoder.encodeValue(t)).join("&")}).filter(n=>n!=="").join("&")}clone(n){let e=new i({encoder:this.encoder});return e.cloneFrom=this.cloneFrom||this,e.updates=(this.updates||[]).concat(n),e}init(){this.map===null&&(this.map=new Map),this.cloneFrom!==null&&(this.cloneFrom.init(),this.cloneFrom.keys().forEach(n=>this.map.set(n,this.cloneFrom.map.get(n))),this.updates.forEach(n=>{switch(n.op){case"a":case"s":let e=(n.op==="a"?this.map.get(n.param):void 0)||[];e.push(Io(n.value)),this.map.set(n.param,e);break;case"d":if(n.value!==void 0){let t=this.map.get(n.param)||[],o=t.indexOf(Io(n.value));o!==-1&&t.splice(o,1),t.length>0?this.map.set(n.param,t):this.map.delete(n.param)}else{this.map.delete(n.param);break}}}),this.cloneFrom=this.updates=null)}};function zm(i){switch(i){case"DELETE":case"GET":case"HEAD":case"OPTIONS":case"JSONP":return!1;default:return!0}}function Fl(i){return typeof ArrayBuffer<"u"&&i instanceof ArrayBuffer}function Rl(i){return typeof Blob<"u"&&i instanceof Blob}function Pl(i){return typeof FormData<"u"&&i instanceof FormData}function Um(i){return typeof URLSearchParams<"u"&&i instanceof URLSearchParams}var Ll="Content-Type",Nl="Accept",Vl="text/plain",jl="application/json",Hm=`${jl}, ${Vl}, */*`,Fn=class i{url;body=null;headers;context;reportProgress=!1;withCredentials=!1;credentials;keepalive=!1;cache;priority;mode;redirect;referrer;integrity;referrerPolicy;responseType="json";method;params;urlWithParams;transferCache;timeout;constructor(n,e,t,o){this.url=e,this.method=n.toUpperCase();let r;if(zm(this.method)||o?(this.body=t!==void 0?t:null,r=o):r=t,r){if(this.reportProgress=!!r.reportProgress,this.withCredentials=!!r.withCredentials,this.keepalive=!!r.keepalive,r.responseType&&(this.responseType=r.responseType),r.headers&&(this.headers=r.headers),r.context&&(this.context=r.context),r.params&&(this.params=r.params),r.priority&&(this.priority=r.priority),r.cache&&(this.cache=r.cache),r.credentials&&(this.credentials=r.credentials),typeof r.timeout=="number"){if(r.timeout<1||!Number.isInteger(r.timeout))throw new K(2822,"");this.timeout=r.timeout}r.mode&&(this.mode=r.mode),r.redirect&&(this.redirect=r.redirect),r.integrity&&(this.integrity=r.integrity),r.referrer!==void 0&&(this.referrer=r.referrer),r.referrerPolicy&&(this.referrerPolicy=r.referrerPolicy),this.transferCache=r.transferCache}if(this.headers??=new rt,this.context??=new ko,!this.params)this.params=new St,this.urlWithParams=e;else{let a=this.params.toString();if(a.length===0)this.urlWithParams=e;else{let l=e.indexOf("?"),c=l===-1?"?":l<e.length-1?"&":"";this.urlWithParams=e+c+a}}}serializeBody(){return this.body===null?null:typeof this.body=="string"||Fl(this.body)||Rl(this.body)||Pl(this.body)||Um(this.body)?this.body:this.body instanceof St?this.body.toString():typeof this.body=="object"||typeof this.body=="boolean"||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return this.body===null||Pl(this.body)?null:Rl(this.body)?this.body.type||null:Fl(this.body)?null:typeof this.body=="string"?Vl:this.body instanceof St?"application/x-www-form-urlencoded;charset=UTF-8":typeof this.body=="object"||typeof this.body=="number"||typeof this.body=="boolean"?jl:null}clone(n={}){let e=n.method||this.method,t=n.url||this.url,o=n.responseType||this.responseType,r=n.keepalive??this.keepalive,a=n.priority||this.priority,l=n.cache||this.cache,c=n.mode||this.mode,p=n.redirect||this.redirect,f=n.credentials||this.credentials,v=n.referrer??this.referrer,F=n.integrity||this.integrity,q=n.referrerPolicy||this.referrerPolicy,Y=n.transferCache??this.transferCache,J=n.timeout??this.timeout,G=n.body!==void 0?n.body:this.body,ne=n.withCredentials??this.withCredentials,Ve=n.reportProgress??this.reportProgress,xt=n.headers||this.headers,Se=n.params||this.params,ri=n.context??this.context;return n.setHeaders!==void 0&&(xt=Object.keys(n.setHeaders).reduce((ai,Jt)=>ai.set(Jt,n.setHeaders[Jt]),xt)),n.setParams&&(Se=Object.keys(n.setParams).reduce((ai,Jt)=>ai.set(Jt,n.setParams[Jt]),Se)),new i(e,t,G,{params:Se,headers:xt,context:ri,reportProgress:Ve,responseType:o,withCredentials:ne,transferCache:Y,keepalive:r,cache:l,priority:a,timeout:J,mode:c,redirect:p,credentials:f,referrer:v,integrity:F,referrerPolicy:q})}},an=(function(i){return i[i.Sent=0]="Sent",i[i.UploadProgress=1]="UploadProgress",i[i.ResponseHeader=2]="ResponseHeader",i[i.DownloadProgress=3]="DownloadProgress",i[i.Response=4]="Response",i[i.User=5]="User",i})(an||{}),Pn=class{headers;status;statusText;url;ok;type;redirected;responseType;constructor(n,e=200,t="OK"){this.headers=n.headers||new rt,this.status=n.status!==void 0?n.status:e,this.statusText=n.statusText||t,this.url=n.url||null,this.redirected=n.redirected,this.responseType=n.responseType,this.ok=this.status>=200&&this.status<300}},Oo=class i extends Pn{constructor(n={}){super(n)}type=an.ResponseHeader;clone(n={}){return new i({headers:n.headers||this.headers,status:n.status!==void 0?n.status:this.status,statusText:n.statusText||this.statusText,url:n.url||this.url||void 0})}},wi=class i extends Pn{body;constructor(n={}){super(n),this.body=n.body!==void 0?n.body:null}type=an.Response;clone(n={}){return new i({body:n.body!==void 0?n.body:this.body,headers:n.headers||this.headers,status:n.status!==void 0?n.status:this.status,statusText:n.statusText||this.statusText,url:n.url||this.url||void 0,redirected:n.redirected??this.redirected,responseType:n.responseType??this.responseType})}},Rn=class extends Pn{name="HttpErrorResponse";message;error;ok=!1;constructor(n){super(n,0,"Unknown Error"),this.status>=200&&this.status<300?this.message=`Http failure during parsing for ${n.url||"(unknown url)"}`:this.message=`Http failure response for ${n.url||"(unknown url)"}: ${n.status} ${n.statusText}`,this.error=n.error||null}},$m=200,Gm=204;var Wm=new g("");var Ym=/^\)\]\}',?\n/;var ca=(()=>{class i{xhrFactory;tracingService=s(so,{optional:!0});constructor(e){this.xhrFactory=e}maybePropagateTrace(e){return this.tracingService?.propagate?this.tracingService.propagate(e):e}handle(e){if(e.method==="JSONP")throw new K(-2800,!1);let t=this.xhrFactory;return Z(null).pipe(Qe(()=>new st(r=>{let a=t.build();if(a.open(e.method,e.urlWithParams),e.withCredentials&&(a.withCredentials=!0),e.headers.forEach((G,ne)=>a.setRequestHeader(G,ne.join(","))),e.headers.has(Nl)||a.setRequestHeader(Nl,Hm),!e.headers.has(Ll)){let G=e.detectContentTypeHeader();G!==null&&a.setRequestHeader(Ll,G)}if(e.timeout&&(a.timeout=e.timeout),e.responseType){let G=e.responseType.toLowerCase();a.responseType=G!=="json"?G:"text"}let l=e.serializeBody(),c=null,p=()=>{if(c!==null)return c;let G=a.statusText||"OK",ne=new rt(a.getAllResponseHeaders()),Ve=a.responseURL||e.url;return c=new Oo({headers:ne,status:a.status,statusText:G,url:Ve}),c},f=this.maybePropagateTrace(()=>{let{headers:G,status:ne,statusText:Ve,url:xt}=p(),Se=null;ne!==Gm&&(Se=typeof a.response>"u"?a.responseText:a.response),ne===0&&(ne=Se?$m:0);let ri=ne>=200&&ne<300;if(e.responseType==="json"&&typeof Se=="string"){let ai=Se;Se=Se.replace(Ym,"");try{Se=Se!==""?JSON.parse(Se):null}catch(Jt){Se=ai,ri&&(ri=!1,Se={error:Jt,text:Se})}}ri?(r.next(new wi({body:Se,headers:G,status:ne,statusText:Ve,url:xt||void 0})),r.complete()):r.error(new Rn({error:Se,headers:G,status:ne,statusText:Ve,url:xt||void 0}))}),v=this.maybePropagateTrace(G=>{let{url:ne}=p(),Ve=new Rn({error:G,status:a.status||0,statusText:a.statusText||"Unknown Error",url:ne||void 0});r.error(Ve)}),F=v;e.timeout&&(F=this.maybePropagateTrace(G=>{let{url:ne}=p(),Ve=new Rn({error:new DOMException("Request timed out","TimeoutError"),status:a.status||0,statusText:a.statusText||"Request timeout",url:ne||void 0});r.error(Ve)}));let q=!1,Y=this.maybePropagateTrace(G=>{q||(r.next(p()),q=!0);let ne={type:an.DownloadProgress,loaded:G.loaded};G.lengthComputable&&(ne.total=G.total),e.responseType==="text"&&a.responseText&&(ne.partialText=a.responseText),r.next(ne)}),J=this.maybePropagateTrace(G=>{let ne={type:an.UploadProgress,loaded:G.loaded};G.lengthComputable&&(ne.total=G.total),r.next(ne)});return a.addEventListener("load",f),a.addEventListener("error",v),a.addEventListener("timeout",F),a.addEventListener("abort",v),e.reportProgress&&(a.addEventListener("progress",Y),l!==null&&a.upload&&a.upload.addEventListener("progress",J)),a.send(l),r.next({type:an.Sent}),()=>{a.removeEventListener("error",v),a.removeEventListener("abort",v),a.removeEventListener("load",f),a.removeEventListener("timeout",F),e.reportProgress&&(a.removeEventListener("progress",Y),l!==null&&a.upload&&a.upload.removeEventListener("progress",J)),a.readyState!==a.DONE&&a.abort()}})))}static \u0275fac=function(t){return new(t||i)(N(rn))};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Xm(i,n){return n(i)}function qm(i,n,e){return(t,o)=>ws(e,()=>n(t,r=>i(r,o)))}var zl=new g("",{factory:()=>[]}),Ul=new g(""),Hl=new g("",{factory:()=>!0});var da=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:function(t){let o=null;return t?o=new(t||i):o=N(ca),o},providedIn:"root"})}return i})();var Fo=(()=>{class i{backend;injector;chain=null;pendingTasks=s(Ms);contributeToStability=s(Hl);constructor(e,t){this.backend=e,this.injector=t}handle(e){if(this.chain===null){let t=Array.from(new Set([...this.injector.get(zl),...this.injector.get(Ul,[])]));this.chain=t.reduceRight((o,r)=>qm(o,r,this.injector),Xm)}if(this.contributeToStability){let t=this.pendingTasks.add();return this.chain(e,o=>this.backend.handle(o)).pipe(xn(t))}else return this.chain(e,t=>this.backend.handle(t))}static \u0275fac=function(t){return new(t||i)(N(da),N(lt))};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),ua=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:function(t){let o=null;return t?o=new(t||i):o=N(Fo),o},providedIn:"root"})}return i})();function la(i,n){return{body:n,headers:i.headers,context:i.context,observe:i.observe,params:i.params,reportProgress:i.reportProgress,responseType:i.responseType,withCredentials:i.withCredentials,credentials:i.credentials,transferCache:i.transferCache,timeout:i.timeout,keepalive:i.keepalive,priority:i.priority,cache:i.cache,mode:i.mode,redirect:i.redirect,integrity:i.integrity,referrer:i.referrer,referrerPolicy:i.referrerPolicy}}var Ut=(()=>{class i{handler;constructor(e){this.handler=e}request(e,t,o={}){let r;if(e instanceof Fn)r=e;else{let c;o.headers instanceof rt?c=o.headers:c=new rt(o.headers);let p;o.params&&(o.params instanceof St?p=o.params:p=new St({fromObject:o.params})),r=new Fn(e,t,o.body!==void 0?o.body:null,{headers:c,context:o.context,params:p,reportProgress:o.reportProgress,responseType:o.responseType||"json",withCredentials:o.withCredentials,transferCache:o.transferCache,keepalive:o.keepalive,priority:o.priority,cache:o.cache,mode:o.mode,redirect:o.redirect,credentials:o.credentials,referrer:o.referrer,referrerPolicy:o.referrerPolicy,integrity:o.integrity,timeout:o.timeout})}let a=Z(r).pipe(vs(c=>this.handler.handle(c)));if(e instanceof Fn||o.observe==="events")return a;let l=a.pipe(pe(c=>c instanceof wi));switch(o.observe||"body"){case"body":switch(r.responseType){case"arraybuffer":return l.pipe(ee(c=>{if(c.body!==null&&!(c.body instanceof ArrayBuffer))throw new K(2806,!1);return c.body}));case"blob":return l.pipe(ee(c=>{if(c.body!==null&&!(c.body instanceof Blob))throw new K(2807,!1);return c.body}));case"text":return l.pipe(ee(c=>{if(c.body!==null&&typeof c.body!="string")throw new K(2808,!1);return c.body}));default:return l.pipe(ee(c=>c.body))}case"response":return l;default:throw new K(2809,!1)}}delete(e,t={}){return this.request("DELETE",e,t)}get(e,t={}){return this.request("GET",e,t)}head(e,t={}){return this.request("HEAD",e,t)}jsonp(e,t){return this.request("JSONP",e,{params:new St().append(t,"JSONP_CALLBACK"),observe:"body",responseType:"json"})}options(e,t={}){return this.request("OPTIONS",e,t)}patch(e,t,o={}){return this.request("PATCH",e,la(o,t))}post(e,t,o={}){return this.request("POST",e,la(o,t))}put(e,t,o={}){return this.request("PUT",e,la(o,t))}static \u0275fac=function(t){return new(t||i)(N(ua))};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var Km=new g("",{factory:()=>!0}),Zm="XSRF-TOKEN",Qm=new g("",{factory:()=>Zm}),Jm="X-XSRF-TOKEN",eh=new g("",{factory:()=>Jm}),th=(()=>{class i{cookieName=s(Qm);doc=s(S);lastCookieString="";lastToken=null;parseCount=0;getToken(){let e=this.doc.cookie||"";return e!==this.lastCookieString&&(this.parseCount++,this.lastToken=_i(e,this.cookieName),this.lastCookieString=e),this.lastToken}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),$l=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:function(t){let o=null;return t?o=new(t||i):o=N(th),o},providedIn:"root"})}return i})();function nh(i,n){if(!s(Km)||i.method==="GET"||i.method==="HEAD")return n(i);try{let o=s(Tn).href,{origin:r}=new URL(o),{origin:a}=new URL(i.url,r);if(r!==a)return n(i)}catch{return n(i)}let e=s($l).getToken(),t=s(eh);return e!=null&&!i.headers.has(t)&&(i=i.clone({headers:i.headers.set(t,e)})),n(i)}function ma(...i){let n=[Ut,Fo,{provide:ua,useExisting:Fo},{provide:da,useFactory:()=>s(Wm,{optional:!0})??s(ca)},{provide:zl,useValue:nh,multi:!0}];for(let e of i)n.push(...e.\u0275providers);return li(n)}var Di=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:function(t){let o=null;return t?o=new(t||i):o=N(oh),o},providedIn:"root"})}return i})(),oh=(()=>{class i extends Di{_doc;constructor(e){super(),this._doc=e}sanitize(e,t){if(t==null)return null;switch(e){case Ne.NONE:return t;case Ne.HTML:return Mn(t,"HTML")?An(t):Ns(this._doc,String(t)).toString();case Ne.STYLE:return Mn(t,"Style")?An(t):t;case Ne.SCRIPT:if(Mn(t,"Script"))return An(t);throw new K(5200,!1);case Ne.URL:return Mn(t,"URL")?An(t):Ls(String(t));case Ne.RESOURCE_URL:if(Mn(t,"ResourceURL"))return An(t);throw new K(5201,!1);default:throw new K(5202,!1)}}bypassSecurityTrustHtml(e){return Ts(e)}bypassSecurityTrustStyle(e){return Os(e)}bypassSecurityTrustScript(e){return Fs(e)}bypassSecurityTrustUrl(e){return Rs(e)}bypassSecurityTrustResourceUrl(e){return Ps(e)}static \u0275fac=function(t){return new(t||i)(N(S))};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var ah="@",sh=(()=>{class i{doc;delegate;zone;animationType;moduleImpl;_rendererFactoryPromise=null;scheduler=null;injector=s(O);loadingSchedulerFn=s(lh,{optional:!0});_engine;constructor(e,t,o,r,a){this.doc=e,this.delegate=t,this.zone=o,this.animationType=r,this.moduleImpl=a}ngOnDestroy(){this._engine?.flush()}loadImpl(){let e=()=>this.moduleImpl??import("./chunk-D7H3DLV6.js").then(o=>o),t;return this.loadingSchedulerFn?t=this.loadingSchedulerFn(e):t=e(),t.catch(o=>{throw new K(5300,!1)}).then(({\u0275createEngine:o,\u0275AnimationRendererFactory:r})=>{this._engine=o(this.animationType,this.doc);let a=new r(this.delegate,this._engine,this.zone);return this.delegate=a,a})}createRenderer(e,t){let o=this.delegate.createRenderer(e,t);if(o.\u0275type===0)return o;typeof o.throwOnSyntheticProps=="boolean"&&(o.throwOnSyntheticProps=!1);let r=new ha(o);return t?.data?.animation&&!this._rendererFactoryPromise&&(this._rendererFactoryPromise=this.loadImpl()),this._rendererFactoryPromise?.then(a=>{let l=a.createRenderer(e,t);r.use(l),this.scheduler??=this.injector.get(As,null,{optional:!0}),this.scheduler?.notify(10)}).catch(a=>{r.use(o)}),r}begin(){this.delegate.begin?.()}end(){this.delegate.end?.()}whenRenderingDone(){return this.delegate.whenRenderingDone?.()??Promise.resolve()}componentReplaced(e){this._engine?.flush(),this.delegate.componentReplaced?.(e)}static \u0275fac=function(t){zs()};static \u0275prov=_({token:i,factory:i.\u0275fac})}return i})(),ha=class{delegate;replay=[];\u0275type=1;constructor(n){this.delegate=n}use(n){if(this.delegate=n,this.replay!==null){for(let e of this.replay)e(n);this.replay=null}}get data(){return this.delegate.data}destroy(){this.replay=null,this.delegate.destroy()}createElement(n,e){return this.delegate.createElement(n,e)}createComment(n){return this.delegate.createComment(n)}createText(n){return this.delegate.createText(n)}get destroyNode(){return this.delegate.destroyNode}appendChild(n,e){this.delegate.appendChild(n,e)}insertBefore(n,e,t,o){this.delegate.insertBefore(n,e,t,o)}removeChild(n,e,t,o){this.delegate.removeChild(n,e,t,o)}selectRootElement(n,e){return this.delegate.selectRootElement(n,e)}parentNode(n){return this.delegate.parentNode(n)}nextSibling(n){return this.delegate.nextSibling(n)}setAttribute(n,e,t,o){this.delegate.setAttribute(n,e,t,o)}removeAttribute(n,e,t){this.delegate.removeAttribute(n,e,t)}addClass(n,e){this.delegate.addClass(n,e)}removeClass(n,e){this.delegate.removeClass(n,e)}setStyle(n,e,t,o){this.delegate.setStyle(n,e,t,o)}removeStyle(n,e,t){this.delegate.removeStyle(n,e,t)}setProperty(n,e,t){this.shouldReplay(e)&&this.replay.push(o=>o.setProperty(n,e,t)),this.delegate.setProperty(n,e,t)}setValue(n,e){this.delegate.setValue(n,e)}listen(n,e,t,o){return this.shouldReplay(e)&&this.replay.push(r=>r.listen(n,e,t,o)),this.delegate.listen(n,e,t,o)}shouldReplay(n){return this.replay!==null&&n.startsWith(ah)}},lh=new g("");function Wl(i="animations"){return js("NgAsyncAnimations"),li([{provide:Te,useFactory:()=>new sh(s(S),s(Ci),s(I),i)},{provide:En,useValue:i==="noop"?"NoopAnimations":"BrowserAnimations"}])}var Yl={providers:[Ss(),ma(),Wl()]};var ec=(()=>{class i{_renderer;_elementRef;onChange=e=>{};onTouched=()=>{};constructor(e,t){this._renderer=e,this._elementRef=t}setProperty(e,t){this._renderer.setProperty(this._elementRef.nativeElement,e,t)}registerOnTouched(e){this.onTouched=e}registerOnChange(e){this.onChange=e}setDisabledState(e){this.setProperty("disabled",e)}static \u0275fac=function(t){return new(t||i)(X(re),X(A))};static \u0275dir=D({type:i})}return i})(),ch=(()=>{class i extends ec{static \u0275fac=(()=>{let e;return function(o){return(e||(e=et(i)))(o||i)}})();static \u0275dir=D({type:i,features:[ce]})}return i})(),ln=new g("");var dh={provide:ln,useExisting:Je(()=>Vn),multi:!0};function uh(){let i=it()?it().getUserAgent():"";return/android (\d+)/.test(i.toLowerCase())}var mh=new g(""),Vn=(()=>{class i extends ec{_compositionMode;_composing=!1;constructor(e,t,o){super(e,t),this._compositionMode=o,this._compositionMode==null&&(this._compositionMode=!uh())}writeValue(e){let t=e??"";this.setProperty("value",t)}_handleInput(e){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(e)}_compositionStart(){this._composing=!0}_compositionEnd(e){this._composing=!1,this._compositionMode&&this.onChange(e)}static \u0275fac=function(t){return new(t||i)(X(re),X(A),X(mh,8))};static \u0275dir=D({type:i,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(t,o){t&1&&T("input",function(a){return o._handleInput(a.target.value)})("blur",function(){return o.onTouched()})("compositionstart",function(){return o._compositionStart()})("compositionend",function(a){return o._compositionEnd(a.target.value)})},standalone:!1,features:[ge([dh]),ce]})}return i})();function ga(i){return i==null||_a(i)===0}function _a(i){return i==null?null:Array.isArray(i)||typeof i=="string"?i.length:i instanceof Set?i.size:null}var Go=new g(""),Wo=new g(""),hh=/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,Bn=class{static min(n){return ph(n)}static max(n){return fh(n)}static required(n){return gh(n)}static requiredTrue(n){return _h(n)}static email(n){return vh(n)}static minLength(n){return bh(n)}static maxLength(n){return yh(n)}static pattern(n){return Ch(n)}static nullValidator(n){return tc()}static compose(n){return sc(n)}static composeAsync(n){return lc(n)}};function ph(i){return n=>{if(n.value==null||i==null)return null;let e=parseFloat(n.value);return!isNaN(e)&&e<i?{min:{min:i,actual:n.value}}:null}}function fh(i){return n=>{if(n.value==null||i==null)return null;let e=parseFloat(n.value);return!isNaN(e)&&e>i?{max:{max:i,actual:n.value}}:null}}function gh(i){return ga(i.value)?{required:!0}:null}function _h(i){return i.value===!0?null:{required:!0}}function vh(i){return ga(i.value)||hh.test(i.value)?null:{email:!0}}function bh(i){return n=>{let e=n.value?.length??_a(n.value);return e===null||e===0?null:e<i?{minlength:{requiredLength:i,actualLength:e}}:null}}function yh(i){return n=>{let e=n.value?.length??_a(n.value);return e!==null&&e>i?{maxlength:{requiredLength:i,actualLength:e}}:null}}function Ch(i){if(!i)return tc;let n,e;return typeof i=="string"?(e="",i.charAt(0)!=="^"&&(e+="^"),e+=i,i.charAt(i.length-1)!=="$"&&(e+="$"),n=new RegExp(e)):(e=i.toString(),n=i),t=>{if(ga(t.value))return null;let o=t.value;return n.test(o)?null:{pattern:{requiredPattern:e,actualValue:o}}}}function tc(i){return null}function nc(i){return i!=null}function ic(i){return co(i)?fs(i):i}function oc(i){let n={};return i.forEach(e=>{n=e!=null?C(C({},n),e):n}),Object.keys(n).length===0?null:n}function rc(i,n){return n.map(e=>e(i))}function xh(i){return!i.validate}function ac(i){return i.map(n=>xh(n)?n:e=>n.validate(e))}function sc(i){if(!i)return null;let n=i.filter(nc);return n.length==0?null:function(e){return oc(rc(e,n))}}function va(i){return i!=null?sc(ac(i)):null}function lc(i){if(!i)return null;let n=i.filter(nc);return n.length==0?null:function(e){let t=rc(e,n).map(ic);return io(t).pipe(ee(oc))}}function ba(i){return i!=null?lc(ac(i)):null}function Xl(i,n){return i===null?[n]:Array.isArray(i)?[...i,n]:[i,n]}function cc(i){return i._rawValidators}function dc(i){return i._rawAsyncValidators}function pa(i){return i?Array.isArray(i)?i:[i]:[]}function Po(i,n){return Array.isArray(i)?i.includes(n):i===n}function ql(i,n){let e=pa(n);return pa(i).forEach(o=>{Po(e,o)||e.push(o)}),e}function Kl(i,n){return pa(n).filter(e=>!Po(i,e))}var Lo=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(n){this._rawValidators=n||[],this._composedValidatorFn=va(this._rawValidators)}_setAsyncValidators(n){this._rawAsyncValidators=n||[],this._composedAsyncValidatorFn=ba(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(n){this._onDestroyCallbacks.push(n)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(n=>n()),this._onDestroyCallbacks=[]}reset(n=void 0){this.control?.reset(n)}hasError(n,e){return this.control?this.control.hasError(n,e):!1}getError(n,e){return this.control?this.control.getError(n,e):null}},sn=class extends Lo{name;get formDirective(){return null}get path(){return null}},$e=class extends Lo{_parent=null;name=null;valueAccessor=null},fa=class{_cd;constructor(n){this._cd=n}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}};var Yo=(()=>{class i extends fa{constructor(e){super(e)}static \u0275fac=function(t){return new(t||i)(X($e,2))};static \u0275dir=D({type:i,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(t,o){t&2&&M("ng-untouched",o.isUntouched)("ng-touched",o.isTouched)("ng-pristine",o.isPristine)("ng-dirty",o.isDirty)("ng-valid",o.isValid)("ng-invalid",o.isInvalid)("ng-pending",o.isPending)},standalone:!1,features:[ce]})}return i})();var Ei="VALID",Ro="INVALID",Ln="PENDING",Si="DISABLED",Ht=class{},No=class extends Ht{value;source;constructor(n,e){super(),this.value=n,this.source=e}},Mi=class extends Ht{pristine;source;constructor(n,e){super(),this.pristine=n,this.source=e}},Ii=class extends Ht{touched;source;constructor(n,e){super(),this.touched=n,this.source=e}},Nn=class extends Ht{status;source;constructor(n,e){super(),this.status=n,this.source=e}},Bo=class extends Ht{source;constructor(n){super(),this.source=n}},Vo=class extends Ht{source;constructor(n){super(),this.source=n}};function uc(i){return(Xo(i)?i.validators:i)||null}function wh(i){return Array.isArray(i)?va(i):i||null}function mc(i,n){return(Xo(n)?n.asyncValidators:i)||null}function Dh(i){return Array.isArray(i)?ba(i):i||null}function Xo(i){return i!=null&&!Array.isArray(i)&&typeof i=="object"}function Eh(i,n,e){let t=i.controls;if(!(n?Object.keys(t):t).length)throw new K(1e3,"");if(!t[e])throw new K(1001,"")}function Sh(i,n,e){i._forEachChild((t,o)=>{if(e[o]===void 0)throw new K(-1002,"")})}var jo=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(n,e){this._assignValidators(n),this._assignAsyncValidators(e)}get validator(){return this._composedValidatorFn}set validator(n){this._rawValidators=this._composedValidatorFn=n}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(n){this._rawAsyncValidators=this._composedAsyncValidatorFn=n}get parent(){return this._parent}get status(){return Ye(this.statusReactive)}set status(n){Ye(()=>this.statusReactive.set(n))}_status=ye(()=>this.statusReactive());statusReactive=Q(void 0);get valid(){return this.status===Ei}get invalid(){return this.status===Ro}get pending(){return this.status===Ln}get disabled(){return this.status===Si}get enabled(){return this.status!==Si}errors;get pristine(){return Ye(this.pristineReactive)}set pristine(n){Ye(()=>this.pristineReactive.set(n))}_pristine=ye(()=>this.pristineReactive());pristineReactive=Q(!0);get dirty(){return!this.pristine}get touched(){return Ye(this.touchedReactive)}set touched(n){Ye(()=>this.touchedReactive.set(n))}_touched=ye(()=>this.touchedReactive());touchedReactive=Q(!1);get untouched(){return!this.touched}_events=new y;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(n){this._assignValidators(n)}setAsyncValidators(n){this._assignAsyncValidators(n)}addValidators(n){this.setValidators(ql(n,this._rawValidators))}addAsyncValidators(n){this.setAsyncValidators(ql(n,this._rawAsyncValidators))}removeValidators(n){this.setValidators(Kl(n,this._rawValidators))}removeAsyncValidators(n){this.setAsyncValidators(Kl(n,this._rawAsyncValidators))}hasValidator(n){return Po(this._rawValidators,n)}hasAsyncValidator(n){return Po(this._rawAsyncValidators,n)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(n={}){let e=this.touched===!1;this.touched=!0;let t=n.sourceControl??this;n.onlySelf||this._parent?.markAsTouched(we(C({},n),{sourceControl:t})),e&&n.emitEvent!==!1&&this._events.next(new Ii(!0,t))}markAllAsDirty(n={}){this.markAsDirty({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsDirty(n))}markAllAsTouched(n={}){this.markAsTouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsTouched(n))}markAsUntouched(n={}){let e=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let t=n.sourceControl??this;this._forEachChild(o=>{o.markAsUntouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:t})}),n.onlySelf||this._parent?._updateTouched(n,t),e&&n.emitEvent!==!1&&this._events.next(new Ii(!1,t))}markAsDirty(n={}){let e=this.pristine===!0;this.pristine=!1;let t=n.sourceControl??this;n.onlySelf||this._parent?.markAsDirty(we(C({},n),{sourceControl:t})),e&&n.emitEvent!==!1&&this._events.next(new Mi(!1,t))}markAsPristine(n={}){let e=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let t=n.sourceControl??this;this._forEachChild(o=>{o.markAsPristine({onlySelf:!0,emitEvent:n.emitEvent})}),n.onlySelf||this._parent?._updatePristine(n,t),e&&n.emitEvent!==!1&&this._events.next(new Mi(!0,t))}markAsPending(n={}){this.status=Ln;let e=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new Nn(this.status,e)),this.statusChanges.emit(this.status)),n.onlySelf||this._parent?.markAsPending(we(C({},n),{sourceControl:e}))}disable(n={}){let e=this._parentMarkedDirty(n.onlySelf);this.status=Si,this.errors=null,this._forEachChild(o=>{o.disable(we(C({},n),{onlySelf:!0}))}),this._updateValue();let t=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new No(this.value,t)),this._events.next(new Nn(this.status,t)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(we(C({},n),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(o=>o(!0))}enable(n={}){let e=this._parentMarkedDirty(n.onlySelf);this.status=Ei,this._forEachChild(t=>{t.enable(we(C({},n),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent}),this._updateAncestors(we(C({},n),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(t=>t(!1))}_updateAncestors(n,e){n.onlySelf||(this._parent?.updateValueAndValidity(n),n.skipPristineCheck||this._parent?._updatePristine({},e),this._parent?._updateTouched({},e))}setParent(n){this._parent=n}getRawValue(){return this.value}updateValueAndValidity(n={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let t=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===Ei||this.status===Ln)&&this._runAsyncValidator(t,n.emitEvent)}let e=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new No(this.value,e)),this._events.next(new Nn(this.status,e)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),n.onlySelf||this._parent?.updateValueAndValidity(we(C({},n),{sourceControl:e}))}_updateTreeValidity(n={emitEvent:!0}){this._forEachChild(e=>e._updateTreeValidity(n)),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?Si:Ei}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(n,e){if(this.asyncValidator){this.status=Ln,this._hasOwnPendingAsyncValidator={emitEvent:e!==!1,shouldHaveEmitted:n!==!1};let t=ic(this.asyncValidator(this));this._asyncValidationSubscription=t.subscribe(o=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(o,{emitEvent:e,shouldHaveEmitted:n})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let n=(this._hasOwnPendingAsyncValidator?.emitEvent||this._hasOwnPendingAsyncValidator?.shouldHaveEmitted)??!1;return this._hasOwnPendingAsyncValidator=null,n}return!1}setErrors(n,e={}){this.errors=n,this._updateControlsErrors(e.emitEvent!==!1,this,e.shouldHaveEmitted)}get(n){let e=n;return e==null||(Array.isArray(e)||(e=e.split(".")),e.length===0)?null:e.reduce((t,o)=>t&&t._find(o),this)}getError(n,e){let t=e?this.get(e):this;return t?.errors?t.errors[n]:null}hasError(n,e){return!!this.getError(n,e)}get root(){let n=this;for(;n._parent;)n=n._parent;return n}_updateControlsErrors(n,e,t){this.status=this._calculateStatus(),n&&this.statusChanges.emit(this.status),(n||t)&&this._events.next(new Nn(this.status,e)),this._parent&&this._parent._updateControlsErrors(n,e,t)}_initObservables(){this.valueChanges=new j,this.statusChanges=new j}_calculateStatus(){return this._allControlsDisabled()?Si:this.errors?Ro:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(Ln)?Ln:this._anyControlsHaveStatus(Ro)?Ro:Ei}_anyControlsHaveStatus(n){return this._anyControls(e=>e.status===n)}_anyControlsDirty(){return this._anyControls(n=>n.dirty)}_anyControlsTouched(){return this._anyControls(n=>n.touched)}_updatePristine(n,e){let t=!this._anyControlsDirty(),o=this.pristine!==t;this.pristine=t,n.onlySelf||this._parent?._updatePristine(n,e),o&&this._events.next(new Mi(this.pristine,e))}_updateTouched(n={},e){this.touched=this._anyControlsTouched(),this._events.next(new Ii(this.touched,e)),n.onlySelf||this._parent?._updateTouched(n,e)}_onDisabledChange=[];_registerOnCollectionChange(n){this._onCollectionChange=n}_setUpdateStrategy(n){Xo(n)&&n.updateOn!=null&&(this._updateOn=n.updateOn)}_parentMarkedDirty(n){return!n&&!!this._parent?.dirty&&!this._parent._anyControlsDirty()}_find(n){return null}_assignValidators(n){this._rawValidators=Array.isArray(n)?n.slice():n,this._composedValidatorFn=wh(this._rawValidators)}_assignAsyncValidators(n){this._rawAsyncValidators=Array.isArray(n)?n.slice():n,this._composedAsyncValidatorFn=Dh(this._rawAsyncValidators)}},zo=class extends jo{constructor(n,e,t){super(uc(e),mc(t,e)),this.controls=n,this._initObservables(),this._setUpdateStrategy(e),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;registerControl(n,e){return this.controls[n]?this.controls[n]:(this.controls[n]=e,e.setParent(this),e._registerOnCollectionChange(this._onCollectionChange),e)}addControl(n,e,t={}){this.registerControl(n,e),this.updateValueAndValidity({emitEvent:t.emitEvent}),this._onCollectionChange()}removeControl(n,e={}){this.controls[n]&&this.controls[n]._registerOnCollectionChange(()=>{}),delete this.controls[n],this.updateValueAndValidity({emitEvent:e.emitEvent}),this._onCollectionChange()}setControl(n,e,t={}){this.controls[n]&&this.controls[n]._registerOnCollectionChange(()=>{}),delete this.controls[n],e&&this.registerControl(n,e),this.updateValueAndValidity({emitEvent:t.emitEvent}),this._onCollectionChange()}contains(n){return this.controls.hasOwnProperty(n)&&this.controls[n].enabled}setValue(n,e={}){Sh(this,!0,n),Object.keys(n).forEach(t=>{Eh(this,!0,t),this.controls[t].setValue(n[t],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e)}patchValue(n,e={}){n!=null&&(Object.keys(n).forEach(t=>{let o=this.controls[t];o&&o.patchValue(n[t],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e))}reset(n={},e={}){this._forEachChild((t,o)=>{t.reset(n?n[o]:null,we(C({},e),{onlySelf:!0}))}),this._updatePristine(e,this),this._updateTouched(e,this),this.updateValueAndValidity(e),e?.emitEvent!==!1&&this._events.next(new Vo(this))}getRawValue(){return this._reduceChildren({},(n,e,t)=>(n[t]=e.getRawValue(),n))}_syncPendingControls(){let n=this._reduceChildren(!1,(e,t)=>t._syncPendingControls()?!0:e);return n&&this.updateValueAndValidity({onlySelf:!0}),n}_forEachChild(n){Object.keys(this.controls).forEach(e=>{let t=this.controls[e];t&&n(t,e)})}_setUpControls(){this._forEachChild(n=>{n.setParent(this),n._registerOnCollectionChange(this._onCollectionChange)})}_updateValue(){this.value=this._reduceValue()}_anyControls(n){for(let[e,t]of Object.entries(this.controls))if(this.contains(e)&&n(t))return!0;return!1}_reduceValue(){let n={};return this._reduceChildren(n,(e,t,o)=>((t.enabled||this.disabled)&&(e[o]=t.value),e))}_reduceChildren(n,e){let t=n;return this._forEachChild((o,r)=>{t=e(t,o,r)}),t}_allControlsDisabled(){for(let n of Object.keys(this.controls))if(this.controls[n].enabled)return!1;return Object.keys(this.controls).length>0||this.disabled}_find(n){return this.controls.hasOwnProperty(n)?this.controls[n]:null}};var jn=new g("",{factory:()=>qo}),qo="always";function Ah(i,n){return[...n.path,i]}function ki(i,n,e=qo){ya(i,n),n.valueAccessor.writeValue(i.value),(i.disabled||e==="always")&&n.valueAccessor.setDisabledState?.(i.disabled),Ih(i,n),Th(i,n),kh(i,n),Mh(i,n)}function Uo(i,n,e=!0){let t=()=>{};n?.valueAccessor?.registerOnChange(t),n?.valueAccessor?.registerOnTouched(t),$o(i,n),i&&(n._invokeOnDestroyCallbacks(),i._registerOnCollectionChange(()=>{}))}function Ho(i,n){i.forEach(e=>{e.registerOnValidatorChange&&e.registerOnValidatorChange(n)})}function Mh(i,n){if(n.valueAccessor.setDisabledState){let e=t=>{n.valueAccessor.setDisabledState(t)};i.registerOnDisabledChange(e),n._registerOnDestroy(()=>{i._unregisterOnDisabledChange(e)})}}function ya(i,n){let e=cc(i);n.validator!==null?i.setValidators(Xl(e,n.validator)):typeof e=="function"&&i.setValidators([e]);let t=dc(i);n.asyncValidator!==null?i.setAsyncValidators(Xl(t,n.asyncValidator)):typeof t=="function"&&i.setAsyncValidators([t]);let o=()=>i.updateValueAndValidity();Ho(n._rawValidators,o),Ho(n._rawAsyncValidators,o)}function $o(i,n){let e=!1;if(i!==null){if(n.validator!==null){let o=cc(i);if(Array.isArray(o)&&o.length>0){let r=o.filter(a=>a!==n.validator);r.length!==o.length&&(e=!0,i.setValidators(r))}}if(n.asyncValidator!==null){let o=dc(i);if(Array.isArray(o)&&o.length>0){let r=o.filter(a=>a!==n.asyncValidator);r.length!==o.length&&(e=!0,i.setAsyncValidators(r))}}}let t=()=>{};return Ho(n._rawValidators,t),Ho(n._rawAsyncValidators,t),e}function Ih(i,n){n.valueAccessor.registerOnChange(e=>{i._pendingValue=e,i._pendingChange=!0,i._pendingDirty=!0,i.updateOn==="change"&&hc(i,n)})}function kh(i,n){n.valueAccessor.registerOnTouched(()=>{i._pendingTouched=!0,i.updateOn==="blur"&&i._pendingChange&&hc(i,n),i.updateOn!=="submit"&&i.markAsTouched()})}function hc(i,n){i._pendingDirty&&i.markAsDirty(),i.setValue(i._pendingValue,{emitModelToViewChange:!1}),n.viewToModelUpdate(i._pendingValue),i._pendingChange=!1}function Th(i,n){let e=(t,o)=>{n.valueAccessor.writeValue(t),o&&n.viewToModelUpdate(t)};i.registerOnChange(e),n._registerOnDestroy(()=>{i._unregisterOnChange(e)})}function pc(i,n){i==null,ya(i,n)}function Oh(i,n){return $o(i,n)}function fc(i,n){if(!i.hasOwnProperty("model"))return!1;let e=i.model;return e.isFirstChange()?!0:!Object.is(n,e.currentValue)}function Fh(i){return Object.getPrototypeOf(i.constructor)===ch}function gc(i,n){i._syncPendingControls(),n.forEach(e=>{let t=e.control;t.updateOn==="submit"&&t._pendingChange&&(e.viewToModelUpdate(t._pendingValue),t._pendingChange=!1)})}function _c(i,n){if(!n)return null;Array.isArray(n);let e,t,o;return n.forEach(r=>{r.constructor===Vn?e=r:Fh(r)?t=r:o=r}),o||t||e||null}function Rh(i,n){let e=i.indexOf(n);e>-1&&i.splice(e,1)}var Ph={provide:sn,useExisting:Je(()=>Ti)},Ai=Promise.resolve(),Ti=(()=>{class i extends sn{callSetDisabledState;get submitted(){return Ye(this.submittedReactive)}_submitted=ye(()=>this.submittedReactive());submittedReactive=Q(!1);_directives=new Set;form;ngSubmit=new j;options;constructor(e,t,o){super(),this.callSetDisabledState=o,this.form=new zo({},va(e),ba(t))}ngAfterViewInit(){this._setUpdateStrategy()}get formDirective(){return this}get control(){return this.form}get path(){return[]}get controls(){return this.form.controls}addControl(e){Ai.then(()=>{let t=this._findContainer(e.path);e.control=t.registerControl(e.name,e.control),ki(e.control,e,this.callSetDisabledState),e.control.updateValueAndValidity({emitEvent:!1}),this._directives.add(e)})}getControl(e){return this.form.get(e.path)}removeControl(e){Ai.then(()=>{this._findContainer(e.path)?.removeControl(e.name),this._directives.delete(e)})}addFormGroup(e){Ai.then(()=>{let t=this._findContainer(e.path),o=new zo({});pc(o,e),t.registerControl(e.name,o),o.updateValueAndValidity({emitEvent:!1})})}removeFormGroup(e){Ai.then(()=>{this._findContainer(e.path)?.removeControl?.(e.name)})}getFormGroup(e){return this.form.get(e.path)}updateModel(e,t){Ai.then(()=>{this.form.get(e.path).setValue(t)})}setValue(e){this.control.setValue(e)}onSubmit(e){return this.submittedReactive.set(!0),gc(this.form,this._directives),this.ngSubmit.emit(e),this.form._events.next(new Bo(this.control)),e?.target?.method==="dialog"}onReset(){this.resetForm()}resetForm(e=void 0){this.form.reset(e),this.submittedReactive.set(!1)}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.form._updateOn=this.options.updateOn)}_findContainer(e){return e.pop(),e.length?this.form.get(e):this.form}static \u0275fac=function(t){return new(t||i)(X(Go,10),X(Wo,10),X(jn,8))};static \u0275dir=D({type:i,selectors:[["form",3,"ngNoForm","",3,"formGroup","",3,"formArray",""],["ng-form"],["","ngForm",""]],hostBindings:function(t,o){t&1&&T("submit",function(a){return o.onSubmit(a)})("reset",function(){return o.onReset()})},inputs:{options:[0,"ngFormOptions","options"]},outputs:{ngSubmit:"ngSubmit"},exportAs:["ngForm"],standalone:!1,features:[ge([Ph]),ce]})}return i})();function Zl(i,n){let e=i.indexOf(n);e>-1&&i.splice(e,1)}function Ql(i){return typeof i=="object"&&i!==null&&Object.keys(i).length===2&&"value"in i&&"disabled"in i}var Ca=class extends jo{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(n=null,e,t){super(uc(e),mc(t,e)),this._applyFormState(n),this._setUpdateStrategy(e),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),Xo(e)&&(e.nonNullable||e.initialValueIsDefault)&&(Ql(n)?this.defaultValue=n.value:this.defaultValue=n)}setValue(n,e={}){this.value=this._pendingValue=n,this._onChange.length&&e.emitModelToViewChange!==!1&&this._onChange.forEach(t=>t(this.value,e.emitViewToModelChange!==!1)),this.updateValueAndValidity(e)}patchValue(n,e={}){this.setValue(n,e)}reset(n=this.defaultValue,e={}){this._applyFormState(n),this.markAsPristine(e),this.markAsUntouched(e),this.setValue(this.value,e),e.overwriteDefaultValue&&(this.defaultValue=this.value),this._pendingChange=!1,e?.emitEvent!==!1&&this._events.next(new Vo(this))}_updateValue(){}_anyControls(n){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(n){this._onChange.push(n)}_unregisterOnChange(n){Zl(this._onChange,n)}registerOnDisabledChange(n){this._onDisabledChange.push(n)}_unregisterOnDisabledChange(n){Zl(this._onDisabledChange,n)}_forEachChild(n){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(n){Ql(n)?(this.value=this._pendingValue=n.value,n.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=n}},vc=Ca,Lh=i=>i instanceof Ca;var Nh={provide:$e,useExisting:Je(()=>xa)},Jl=Promise.resolve(),xa=(()=>{class i extends $e{_changeDetectorRef;callSetDisabledState;control=new Ca;static ngAcceptInputType_isDisabled;_registered=!1;viewModel;name="";isDisabled;model;options;update=new j;constructor(e,t,o,r,a,l){super(),this._changeDetectorRef=a,this.callSetDisabledState=l,this._parent=e,this._setValidators(t),this._setAsyncValidators(o),this.valueAccessor=_c(this,r)}ngOnChanges(e){if(this._checkForErrors(),!this._registered||"name"in e){if(this._registered&&(this._checkName(),this.formDirective)){let t=e.name.previousValue;this.formDirective.removeControl({name:t,path:this._getPath(t)})}this._setUpControl()}"isDisabled"in e&&this._updateDisabled(e),fc(e,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective?.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){ki(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(e){Jl.then(()=>{this.control.setValue(e,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(e){let t=e.isDisabled.currentValue,o=t!==0&&U(t);Jl.then(()=>{o&&!this.control.disabled?this.control.disable():!o&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(e){return this._parent?Ah(e,this._parent):[e]}static \u0275fac=function(t){return new(t||i)(X(sn,9),X(Go,10),X(Wo,10),X(ln,10),X(ue,8),X(jn,8))};static \u0275dir=D({type:i,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],standalone:!1,features:[ge([Nh]),ce,ve]})}return i})();var Bh=(()=>{class i extends sn{callSetDisabledState;get submitted(){return Ye(this._submittedReactive)}set submitted(e){this._submittedReactive.set(e)}_submitted=ye(()=>this._submittedReactive());_submittedReactive=Q(!1);_oldForm;_onCollectionChange=()=>this._updateDomValue();directives=[];constructor(e,t,o){super(),this.callSetDisabledState=o,this._setValidators(e),this._setAsyncValidators(t)}ngOnChanges(e){this.onChanges(e)}ngOnDestroy(){this.onDestroy()}onChanges(e){this._checkFormPresent(),e.hasOwnProperty("form")&&(this._updateValidators(),this._updateDomValue(),this._updateRegistrations(),this._oldForm=this.form)}onDestroy(){this.form&&($o(this.form,this),this.form._onCollectionChange===this._onCollectionChange&&this.form._registerOnCollectionChange(()=>{}))}get formDirective(){return this}get path(){return[]}addControl(e){let t=this.form.get(e.path);return ki(t,e,this.callSetDisabledState),t.updateValueAndValidity({emitEvent:!1}),this.directives.push(e),t}getControl(e){return this.form.get(e.path)}removeControl(e){Uo(e.control||null,e,!1),Rh(this.directives,e)}addFormGroup(e){this._setUpFormContainer(e)}removeFormGroup(e){this._cleanUpFormContainer(e)}getFormGroup(e){return this.form.get(e.path)}getFormArray(e){return this.form.get(e.path)}addFormArray(e){this._setUpFormContainer(e)}removeFormArray(e){this._cleanUpFormContainer(e)}updateModel(e,t){this.form.get(e.path).setValue(t)}onReset(){this.resetForm()}resetForm(e=void 0,t={}){this.form.reset(e,t),this._submittedReactive.set(!1)}onSubmit(e){return this.submitted=!0,gc(this.form,this.directives),this.ngSubmit.emit(e),this.form._events.next(new Bo(this.control)),e?.target?.method==="dialog"}_updateDomValue(){this.directives.forEach(e=>{let t=e.control,o=this.form.get(e.path);t!==o&&(Uo(t||null,e),Lh(o)&&(ki(o,e,this.callSetDisabledState),e.control=o))}),this.form._updateTreeValidity({emitEvent:!1})}_setUpFormContainer(e){let t=this.form.get(e.path);pc(t,e),t.updateValueAndValidity({emitEvent:!1})}_cleanUpFormContainer(e){let t=this.form?.get(e.path);t&&Oh(t,e)&&t.updateValueAndValidity({emitEvent:!1})}_updateRegistrations(){this.form._registerOnCollectionChange(this._onCollectionChange),this._oldForm?._registerOnCollectionChange(()=>{})}_updateValidators(){ya(this.form,this),this._oldForm&&$o(this._oldForm,this)}_checkFormPresent(){this.form}static \u0275fac=function(t){return new(t||i)(X(Go,10),X(Wo,10),X(jn,8))};static \u0275dir=D({type:i,features:[ce,ve]})}return i})();var bc=new g(""),Vh={provide:$e,useExisting:Je(()=>wa)},wa=(()=>{class i extends $e{_ngModelWarningConfig;callSetDisabledState;viewModel;form;set isDisabled(e){}model;update=new j;static _ngModelWarningSentOnce=!1;_ngModelWarningSent=!1;constructor(e,t,o,r,a){super(),this._ngModelWarningConfig=r,this.callSetDisabledState=a,this._setValidators(e),this._setAsyncValidators(t),this.valueAccessor=_c(this,o)}ngOnChanges(e){if(this._isControlChanged(e)){let t=e.form.previousValue;t&&Uo(t,this,!1),ki(this.form,this,this.callSetDisabledState),this.form.updateValueAndValidity({emitEvent:!1})}fc(e,this.viewModel)&&(this.form.setValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.form&&Uo(this.form,this,!1)}get path(){return[]}get control(){return this.form}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_isControlChanged(e){return e.hasOwnProperty("form")}static \u0275fac=function(t){return new(t||i)(X(Go,10),X(Wo,10),X(ln,10),X(bc,8),X(jn,8))};static \u0275dir=D({type:i,selectors:[["","formControl",""]],inputs:{form:[0,"formControl","form"],isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"]},outputs:{update:"ngModelChange"},exportAs:["ngForm"],standalone:!1,features:[ge([Vh]),ce,ve]})}return i})();var jh={provide:sn,useExisting:Je(()=>Oi)},Oi=(()=>{class i extends Bh{form=null;ngSubmit=new j;get control(){return this.form}static \u0275fac=(()=>{let e;return function(o){return(e||(e=et(i)))(o||i)}})();static \u0275dir=D({type:i,selectors:[["","formGroup",""]],hostBindings:function(t,o){t&1&&T("submit",function(a){return o.onSubmit(a)})("reset",function(){return o.onReset()})},inputs:{form:[0,"formGroup","form"]},outputs:{ngSubmit:"ngSubmit"},exportAs:["ngForm"],standalone:!1,features:[ge([jh]),ce]})}return i})();var yc=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({})}return i})();var Cc=(()=>{class i{static withConfig(e){return{ngModule:i,providers:[{provide:jn,useValue:e.callSetDisabledState??qo}]}}static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[yc]})}return i})(),xc=(()=>{class i{static withConfig(e){return{ngModule:i,providers:[{provide:bc,useValue:e.warnOnNgModelWithFormControl??"always"},{provide:jn,useValue:e.callSetDisabledState??qo}]}}static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[yc]})}return i})();var Da;try{Da=typeof Intl<"u"&&Intl.v8BreakIterator}catch{Da=!1}var H=(()=>{class i{_platformId=s(Dn);isBrowser=this._platformId?wl(this._platformId):typeof document=="object"&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||Da)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;constructor(){}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var pt=(function(i){return i[i.NORMAL=0]="NORMAL",i[i.NEGATED=1]="NEGATED",i[i.INVERTED=2]="INVERTED",i})(pt||{}),Ko,cn;function Zo(){if(cn==null){if(typeof document!="object"||!document||typeof Element!="function"||!Element)return cn=!1,cn;if(document.documentElement?.style&&"scrollBehavior"in document.documentElement.style)cn=!0;else{let i=Element.prototype.scrollTo;i?cn=!/\{\s*\[native code\]\s*\}/.test(i.toString()):cn=!1}}return cn}function zn(){if(typeof document!="object"||!document)return pt.NORMAL;if(Ko==null){let i=document.createElement("div"),n=i.style;i.dir="rtl",n.width="1px",n.overflow="auto",n.visibility="hidden",n.pointerEvents="none",n.position="absolute";let e=document.createElement("div"),t=e.style;t.width="2px",t.height="1px",i.appendChild(e),document.body.appendChild(i),Ko=pt.NORMAL,i.scrollLeft===0&&(i.scrollLeft=1,Ko=i.scrollLeft===0?pt.NEGATED:pt.INVERTED),i.remove()}return Ko}var Ea;function Dc(){if(Ea==null){let i=typeof document<"u"?document.head:null;Ea=!!(i&&(i.createShadowRoot||i.attachShadow))}return Ea}function Sa(i){if(Dc()){let n=i.getRootNode?i.getRootNode():null;if(typeof ShadowRoot<"u"&&ShadowRoot&&n instanceof ShadowRoot)return n}return null}function dn(){let i=typeof document<"u"&&document?document.activeElement:null;for(;i&&i.shadowRoot;){let n=i.shadowRoot.activeElement;if(n===i)break;i=n}return i}function Ee(i){return i.composedPath?i.composedPath()[0]:i.target}function Aa(){return typeof __karma__<"u"&&!!__karma__||typeof jasmine<"u"&&!!jasmine||typeof jest<"u"&&!!jest||typeof Mocha<"u"&&!!Mocha}var Fi;function Ec(){if(Fi==null&&typeof window<"u")try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:()=>Fi=!0}))}finally{Fi=Fi||!1}return Fi}function Un(i){return Ec()?i:!!i.capture}var Hn,Sc=["color","button","checkbox","date","datetime-local","email","file","hidden","image","month","number","password","radio","range","reset","search","submit","tel","text","time","url","week"];function Ma(){if(Hn)return Hn;if(typeof document!="object"||!document)return Hn=new Set(Sc),Hn;let i=document.createElement("input");return Hn=new Set(Sc.filter(n=>(i.setAttribute("type",n),i.type===n))),Hn}var zh=new g("cdk-dir-doc",{providedIn:"root",factory:()=>s(S)}),Uh=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;function Ac(i){let n=i?.toLowerCase()||"";return n==="auto"&&typeof navigator<"u"&&navigator?.language?Uh.test(navigator.language)?"rtl":"ltr":n==="rtl"?"rtl":"ltr"}var ke=(()=>{class i{get value(){return this.valueSignal()}valueSignal=Q("ltr");change=new j;constructor(){let e=s(zh,{optional:!0});if(e){let t=e.body?e.body.dir:null,o=e.documentElement?e.documentElement.dir:null;this.valueSignal.set(Ac(t||o||"ltr"))}}ngOnDestroy(){this.change.complete()}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var z=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({})}return i})();var Hh=["*",[["mat-toolbar-row"]]],$h=["*","mat-toolbar-row"],Gh=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["mat-toolbar-row"]],hostAttrs:[1,"mat-toolbar-row"],exportAs:["matToolbarRow"]})}return i})(),Mc=(()=>{class i{_elementRef=s(A);_platform=s(H);_document=s(S);color;_toolbarRows;constructor(){}ngAfterViewInit(){this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe(()=>this._checkToolbarMixedModes()))}_checkToolbarMixedModes(){this._toolbarRows.length}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-toolbar"]],contentQueries:function(t,o,r){if(t&1&&wt(r,Gh,5),t&2){let a;R(a=P())&&(o._toolbarRows=a)}},hostAttrs:[1,"mat-toolbar"],hostVars:6,hostBindings:function(t,o){t&2&&(Fe(o.color?"mat-"+o.color:""),M("mat-toolbar-multiple-rows",o._toolbarRows.length>0)("mat-toolbar-single-row",o._toolbarRows.length===0))},inputs:{color:"color"},exportAs:["matToolbar"],ngContentSelectors:$h,decls:2,vars:0,template:function(t,o){t&1&&(_e(Hh),$(0),$(1,1))},styles:[`.mat-toolbar {
  background: var(--mat-toolbar-container-background-color, var(--mat-sys-surface));
  color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
}
.mat-toolbar, .mat-toolbar h1, .mat-toolbar h2, .mat-toolbar h3, .mat-toolbar h4, .mat-toolbar h5, .mat-toolbar h6 {
  font-family: var(--mat-toolbar-title-text-font, var(--mat-sys-title-large-font));
  font-size: var(--mat-toolbar-title-text-size, var(--mat-sys-title-large-size));
  line-height: var(--mat-toolbar-title-text-line-height, var(--mat-sys-title-large-line-height));
  font-weight: var(--mat-toolbar-title-text-weight, var(--mat-sys-title-large-weight));
  letter-spacing: var(--mat-toolbar-title-text-tracking, var(--mat-sys-title-large-tracking));
  margin: 0;
}
@media (forced-colors: active) {
  .mat-toolbar {
    outline: solid 1px;
  }
}
.mat-toolbar .mat-form-field-underline,
.mat-toolbar .mat-form-field-ripple,
.mat-toolbar .mat-focused .mat-form-field-ripple {
  background-color: currentColor;
}
.mat-toolbar .mat-form-field-label,
.mat-toolbar .mat-focused .mat-form-field-label,
.mat-toolbar .mat-select-value,
.mat-toolbar .mat-select-arrow,
.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow {
  color: inherit;
}
.mat-toolbar .mat-input-element {
  caret-color: currentColor;
}
.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed {
  --mat-button-text-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
  --mat-button-outlined-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
}

.mat-toolbar-row, .mat-toolbar-single-row {
  display: flex;
  box-sizing: border-box;
  padding: 0 16px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  height: var(--mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-row, .mat-toolbar-single-row {
    height: var(--mat-toolbar-mobile-height, 56px);
  }
}

.mat-toolbar-multiple-rows {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  min-height: var(--mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-multiple-rows {
    min-height: var(--mat-toolbar-mobile-height, 56px);
  }
}
`],encapsulation:2,changeDetection:0})}return i})();var Ic=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[z]})}return i})();function Ri(i){return i.buttons===0||i.detail===0}function Pi(i){let n=i.touches&&i.touches[0]||i.changedTouches&&i.changedTouches[0];return!!n&&n.identifier===-1&&(n.radiusX==null||n.radiusX===1)&&(n.radiusY==null||n.radiusY===1)}function At(i,n=0){return kc(i)?Number(i):arguments.length===2?n:0}function kc(i){return!isNaN(parseFloat(i))&&!isNaN(Number(i))}function qe(i){return i instanceof A?i.nativeElement:i}var Tc=new g("cdk-input-modality-detector-options"),Oc={ignoreKeys:[18,17,224,91,16]},Fc=650,Ia={passive:!0,capture:!0},Rc=(()=>{class i{_platform=s(H);_listenerCleanups;modalityDetected;modalityChanged;get mostRecentModality(){return this._modality.value}_mostRecentTarget=null;_modality=new hs(null);_options;_lastTouchMs=0;_onKeydown=e=>{this._options?.ignoreKeys?.some(t=>t===e.keyCode)||(this._modality.next("keyboard"),this._mostRecentTarget=Ee(e))};_onMousedown=e=>{Date.now()-this._lastTouchMs<Fc||(this._modality.next(Ri(e)?"keyboard":"mouse"),this._mostRecentTarget=Ee(e))};_onTouchstart=e=>{if(Pi(e)){this._modality.next("keyboard");return}this._lastTouchMs=Date.now(),this._modality.next("touch"),this._mostRecentTarget=Ee(e)};constructor(){let e=s(I),t=s(S),o=s(Tc,{optional:!0});if(this._options=C(C({},Oc),o),this.modalityDetected=this._modality.pipe(oo(1)),this.modalityChanged=this.modalityDetected.pipe(si()),this._platform.isBrowser){let r=s(Te).createRenderer(null,null);this._listenerCleanups=e.runOutsideAngular(()=>[r.listen(t,"keydown",this._onKeydown,Ia),r.listen(t,"mousedown",this._onMousedown,Ia),r.listen(t,"touchstart",this._onTouchstart,Ia)])}}ngOnDestroy(){this._modality.complete(),this._listenerCleanups?.forEach(e=>e())}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Li=(function(i){return i[i.IMMEDIATE=0]="IMMEDIATE",i[i.EVENTUAL=1]="EVENTUAL",i})(Li||{}),Pc=new g("cdk-focus-monitor-default-options"),Qo=Un({passive:!0,capture:!0}),un=(()=>{class i{_ngZone=s(I);_platform=s(H);_inputModalityDetector=s(Rc);_origin=null;_lastFocusOrigin=null;_windowFocused=!1;_windowFocusTimeoutId;_originTimeoutId;_originFromTouchInteraction=!1;_elementInfo=new Map;_monitoredElementCount=0;_rootNodeFocusListenerCount=new Map;_detectionMode;_windowFocusListener=()=>{this._windowFocused=!0,this._windowFocusTimeoutId=setTimeout(()=>this._windowFocused=!1)};_document=s(S);_stopInputModalityDetector=new y;constructor(){let e=s(Pc,{optional:!0});this._detectionMode=e?.detectionMode||Li.IMMEDIATE}_rootNodeFocusAndBlurListener=e=>{let t=Ee(e);for(let o=t;o;o=o.parentElement)e.type==="focus"?this._onFocus(e,o):this._onBlur(e,o)};monitor(e,t=!1){let o=qe(e);if(!this._platform.isBrowser||o.nodeType!==1)return Z();let r=Sa(o)||this._document,a=this._elementInfo.get(o);if(a)return t&&(a.checkChildren=!0),a.subject;let l={checkChildren:t,subject:new y,rootNode:r};return this._elementInfo.set(o,l),this._registerGlobalListeners(l),l.subject}stopMonitoring(e){let t=qe(e),o=this._elementInfo.get(t);o&&(o.subject.complete(),this._setClasses(t),this._elementInfo.delete(t),this._removeGlobalListeners(o))}focusVia(e,t,o){let r=qe(e),a=this._document.activeElement;r===a?this._getClosestElementsInfo(r).forEach(([l,c])=>this._originChanged(l,t,c)):(this._setOrigin(t),typeof r.focus=="function"&&r.focus(o))}ngOnDestroy(){this._elementInfo.forEach((e,t)=>this.stopMonitoring(t))}_getWindow(){return this._document.defaultView||window}_getFocusOrigin(e){return this._origin?this._originFromTouchInteraction?this._shouldBeAttributedToTouch(e)?"touch":"program":this._origin:this._windowFocused&&this._lastFocusOrigin?this._lastFocusOrigin:e&&this._isLastInteractionFromInputLabel(e)?"mouse":"program"}_shouldBeAttributedToTouch(e){return this._detectionMode===Li.EVENTUAL||!!e?.contains(this._inputModalityDetector._mostRecentTarget)}_setClasses(e,t){e.classList.toggle("cdk-focused",!!t),e.classList.toggle("cdk-touch-focused",t==="touch"),e.classList.toggle("cdk-keyboard-focused",t==="keyboard"),e.classList.toggle("cdk-mouse-focused",t==="mouse"),e.classList.toggle("cdk-program-focused",t==="program")}_setOrigin(e,t=!1){this._ngZone.runOutsideAngular(()=>{if(this._origin=e,this._originFromTouchInteraction=e==="touch"&&t,this._detectionMode===Li.IMMEDIATE){clearTimeout(this._originTimeoutId);let o=this._originFromTouchInteraction?Fc:1;this._originTimeoutId=setTimeout(()=>this._origin=null,o)}})}_onFocus(e,t){let o=this._elementInfo.get(t),r=Ee(e);!o||!o.checkChildren&&t!==r||this._originChanged(t,this._getFocusOrigin(r),o)}_onBlur(e,t){let o=this._elementInfo.get(t);!o||o.checkChildren&&e.relatedTarget instanceof Node&&t.contains(e.relatedTarget)||(this._setClasses(t),this._emitOrigin(o,null))}_emitOrigin(e,t){e.subject.observers.length&&this._ngZone.run(()=>e.subject.next(t))}_registerGlobalListeners(e){if(!this._platform.isBrowser)return;let t=e.rootNode,o=this._rootNodeFocusListenerCount.get(t)||0;o||this._ngZone.runOutsideAngular(()=>{t.addEventListener("focus",this._rootNodeFocusAndBlurListener,Qo),t.addEventListener("blur",this._rootNodeFocusAndBlurListener,Qo)}),this._rootNodeFocusListenerCount.set(t,o+1),++this._monitoredElementCount===1&&(this._ngZone.runOutsideAngular(()=>{this._getWindow().addEventListener("focus",this._windowFocusListener)}),this._inputModalityDetector.modalityDetected.pipe(le(this._stopInputModalityDetector)).subscribe(r=>{this._setOrigin(r,!0)}))}_removeGlobalListeners(e){let t=e.rootNode;if(this._rootNodeFocusListenerCount.has(t)){let o=this._rootNodeFocusListenerCount.get(t);o>1?this._rootNodeFocusListenerCount.set(t,o-1):(t.removeEventListener("focus",this._rootNodeFocusAndBlurListener,Qo),t.removeEventListener("blur",this._rootNodeFocusAndBlurListener,Qo),this._rootNodeFocusListenerCount.delete(t))}--this._monitoredElementCount||(this._getWindow().removeEventListener("focus",this._windowFocusListener),this._stopInputModalityDetector.next(),clearTimeout(this._windowFocusTimeoutId),clearTimeout(this._originTimeoutId))}_originChanged(e,t,o){this._setClasses(e,t),this._emitOrigin(o,t),this._lastFocusOrigin=t}_getClosestElementsInfo(e){let t=[];return this._elementInfo.forEach((o,r)=>{(r===e||o.checkChildren&&r.contains(e))&&t.push([r,o])}),t}_isLastInteractionFromInputLabel(e){let{_mostRecentTarget:t,mostRecentModality:o}=this._inputModalityDetector;if(o!=="mouse"||!t||t===e||e.nodeName!=="INPUT"&&e.nodeName!=="TEXTAREA"||e.disabled)return!1;let r=e.labels;if(r){for(let a=0;a<r.length;a++)if(r[a].contains(t))return!0}return!1}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var Jo=new WeakMap,Le=(()=>{class i{_appRef;_injector=s(O);_environmentInjector=s(lt);load(e){let t=this._appRef=this._appRef||this._injector.get(on),o=Jo.get(t);o||(o={loaders:new Set,refs:[]},Jo.set(t,o),t.onDestroy(()=>{Jo.get(t)?.refs.forEach(r=>r.destroy()),Jo.delete(t)})),o.loaders.has(e)||(o.loaders.add(e),o.refs.push(fo(e,{environmentInjector:this._environmentInjector})))}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var $n=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["ng-component"]],exportAs:["cdkVisuallyHidden"],decls:0,vars:0,template:function(t,o){},styles:[`.cdk-visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
  outline: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  left: 0;
}
[dir=rtl] .cdk-visually-hidden {
  left: auto;
  right: 0;
}
`],encapsulation:2,changeDetection:0})}return i})(),er;function Yh(){if(er===void 0&&(er=null,typeof window<"u")){let i=window;i.trustedTypes!==void 0&&(er=i.trustedTypes.createPolicy("angular#components",{createHTML:n=>n}))}return er}function mn(i){return Yh()?.createHTML(i)||i}function Lc(i,n,e){let t=e.sanitize(Ne.HTML,n);i.innerHTML=mn(t||"")}function Mt(i){return Array.isArray(i)?i:[i]}var Nc=new Set,hn,Gn=(()=>{class i{_platform=s(H);_nonce=s(Sn,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):qh}matchMedia(e){return(this._platform.WEBKIT||this._platform.BLINK)&&Xh(e,this._nonce),this._matchMedia(e)}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Xh(i,n){if(!Nc.has(i))try{hn||(hn=document.createElement("style"),n&&hn.setAttribute("nonce",n),hn.setAttribute("type","text/css"),document.head.appendChild(hn)),hn.sheet&&(hn.sheet.insertRule(`@media ${i} {body{ }}`,0),Nc.add(i))}catch(e){console.error(e)}}function qh(i){return{matches:i==="all"||i==="",media:i,addListener:()=>{},removeListener:()=>{}}}var pn=(()=>{class i{_mediaMatcher=s(Gn);_zone=s(I);_queries=new Map;_destroySubject=new y;constructor(){}ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(e){return Bc(Mt(e)).some(o=>this._registerQuery(o).mql.matches)}observe(e){let o=Bc(Mt(e)).map(a=>this._registerQuery(a).observable),r=_s(o);return r=no(r.pipe(je(1)),r.pipe(oo(1),Cn(0))),r.pipe(ee(a=>{let l={matches:!1,breakpoints:{}};return a.forEach(({matches:c,query:p})=>{l.matches=l.matches||c,l.breakpoints[p]=c}),l}))}_registerQuery(e){if(this._queries.has(e))return this._queries.get(e);let t=this._mediaMatcher.matchMedia(e),r={observable:new st(a=>{let l=c=>this._zone.run(()=>a.next(c));return t.addListener(l),()=>{t.removeListener(l)}}).pipe(ze(t),ee(({matches:a})=>({query:e,matches:a})),le(this._destroySubject)),mql:t};return this._queries.set(e,r),r}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Bc(i){return i.map(n=>n.split(",")).reduce((n,e)=>n.concat(e)).map(n=>n.trim())}var Kh=(()=>{class i{create(e){return typeof MutationObserver>"u"?null:new MutationObserver(e)}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var tr=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({providers:[Kh]})}return i})();var nr=(()=>{class i{_platform=s(H);constructor(){}isDisabled(e){return e.hasAttribute("disabled")}isVisible(e){return Qh(e)&&getComputedStyle(e).visibility==="visible"}isTabbable(e){if(!this._platform.isBrowser)return!1;let t=Zh(ap(e));if(t&&(Vc(t)===-1||!this.isVisible(t)))return!1;let o=e.nodeName.toLowerCase(),r=Vc(e);return e.hasAttribute("contenteditable")?r!==-1:o==="iframe"||o==="object"||this._platform.WEBKIT&&this._platform.IOS&&!op(e)?!1:o==="audio"?e.hasAttribute("controls")?r!==-1:!1:o==="video"?r===-1?!1:r!==null?!0:this._platform.FIREFOX||e.hasAttribute("controls"):e.tabIndex>=0}isFocusable(e,t){return rp(e)&&!this.isDisabled(e)&&(t?.ignoreVisibility||this.isVisible(e))}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Zh(i){try{return i.frameElement}catch{return null}}function Qh(i){return!!(i.offsetWidth||i.offsetHeight||typeof i.getClientRects=="function"&&i.getClientRects().length)}function Jh(i){let n=i.nodeName.toLowerCase();return n==="input"||n==="select"||n==="button"||n==="textarea"}function ep(i){return np(i)&&i.type=="hidden"}function tp(i){return ip(i)&&i.hasAttribute("href")}function np(i){return i.nodeName.toLowerCase()=="input"}function ip(i){return i.nodeName.toLowerCase()=="a"}function Uc(i){if(!i.hasAttribute("tabindex")||i.tabIndex===void 0)return!1;let n=i.getAttribute("tabindex");return!!(n&&!isNaN(parseInt(n,10)))}function Vc(i){if(!Uc(i))return null;let n=parseInt(i.getAttribute("tabindex")||"",10);return isNaN(n)?-1:n}function op(i){let n=i.nodeName.toLowerCase(),e=n==="input"&&i.type;return e==="text"||e==="password"||n==="select"||n==="textarea"}function rp(i){return ep(i)?!1:Jh(i)||tp(i)||i.hasAttribute("contenteditable")||Uc(i)}function ap(i){return i.ownerDocument&&i.ownerDocument.defaultView||window}var Ta=class{_element;_checker;_ngZone;_document;_injector;_startAnchor=null;_endAnchor=null;_hasAttached=!1;startAnchorListener=()=>this.focusLastTabbableElement();endAnchorListener=()=>this.focusFirstTabbableElement();get enabled(){return this._enabled}set enabled(n){this._enabled=n,this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(n,this._startAnchor),this._toggleAnchorTabIndex(n,this._endAnchor))}_enabled=!0;constructor(n,e,t,o,r=!1,a){this._element=n,this._checker=e,this._ngZone=t,this._document=o,this._injector=a,r||this.attachAnchors()}destroy(){let n=this._startAnchor,e=this._endAnchor;n&&(n.removeEventListener("focus",this.startAnchorListener),n.remove()),e&&(e.removeEventListener("focus",this.endAnchorListener),e.remove()),this._startAnchor=this._endAnchor=null,this._hasAttached=!1}attachAnchors(){return this._hasAttached?!0:(this._ngZone.runOutsideAngular(()=>{this._startAnchor||(this._startAnchor=this._createAnchor(),this._startAnchor.addEventListener("focus",this.startAnchorListener)),this._endAnchor||(this._endAnchor=this._createAnchor(),this._endAnchor.addEventListener("focus",this.endAnchorListener))}),this._element.parentNode&&(this._element.parentNode.insertBefore(this._startAnchor,this._element),this._element.parentNode.insertBefore(this._endAnchor,this._element.nextSibling),this._hasAttached=!0),this._hasAttached)}focusInitialElementWhenReady(n){return new Promise(e=>{this._executeOnStable(()=>e(this.focusInitialElement(n)))})}focusFirstTabbableElementWhenReady(n){return new Promise(e=>{this._executeOnStable(()=>e(this.focusFirstTabbableElement(n)))})}focusLastTabbableElementWhenReady(n){return new Promise(e=>{this._executeOnStable(()=>e(this.focusLastTabbableElement(n)))})}_getRegionBoundary(n){let e=this._element.querySelectorAll(`[cdk-focus-region-${n}], [cdkFocusRegion${n}], [cdk-focus-${n}]`);return n=="start"?e.length?e[0]:this._getFirstTabbableElement(this._element):e.length?e[e.length-1]:this._getLastTabbableElement(this._element)}focusInitialElement(n){let e=this._element.querySelector("[cdk-focus-initial], [cdkFocusInitial]");if(e){if(!this._checker.isFocusable(e)){let t=this._getFirstTabbableElement(e);return t?.focus(n),!!t}return e.focus(n),!0}return this.focusFirstTabbableElement(n)}focusFirstTabbableElement(n){let e=this._getRegionBoundary("start");return e&&e.focus(n),!!e}focusLastTabbableElement(n){let e=this._getRegionBoundary("end");return e&&e.focus(n),!!e}hasAttached(){return this._hasAttached}_getFirstTabbableElement(n){if(this._checker.isFocusable(n)&&this._checker.isTabbable(n))return n;let e=n.children;for(let t=0;t<e.length;t++){let o=e[t].nodeType===this._document.ELEMENT_NODE?this._getFirstTabbableElement(e[t]):null;if(o)return o}return null}_getLastTabbableElement(n){if(this._checker.isFocusable(n)&&this._checker.isTabbable(n))return n;let e=n.children;for(let t=e.length-1;t>=0;t--){let o=e[t].nodeType===this._document.ELEMENT_NODE?this._getLastTabbableElement(e[t]):null;if(o)return o}return null}_createAnchor(){let n=this._document.createElement("div");return this._toggleAnchorTabIndex(this._enabled,n),n.classList.add("cdk-visually-hidden"),n.classList.add("cdk-focus-trap-anchor"),n.setAttribute("aria-hidden","true"),n}_toggleAnchorTabIndex(n,e){n?e.setAttribute("tabindex","0"):e.removeAttribute("tabindex")}toggleAnchors(n){this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(n,this._startAnchor),this._toggleAnchorTabIndex(n,this._endAnchor))}_executeOnStable(n){this._injector?Me(n,{injector:this._injector}):setTimeout(n)}},Oa=(()=>{class i{_checker=s(nr);_ngZone=s(I);_document=s(S);_injector=s(O);constructor(){s(Le).load($n)}create(e,t=!1){return new Ta(e,this._checker,this._ngZone,this._document,t,this._injector)}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var Hc=new g("liveAnnouncerElement",{providedIn:"root",factory:()=>null}),$c=new g("LIVE_ANNOUNCER_DEFAULT_OPTIONS"),sp=0,Ni=(()=>{class i{_ngZone=s(I);_defaultOptions=s($c,{optional:!0});_liveElement;_document=s(S);_sanitizer=s(Di);_previousTimeout;_currentPromise;_currentResolve;constructor(){let e=s(Hc,{optional:!0});this._liveElement=e||this._createLiveElement()}announce(e,...t){let o=this._defaultOptions,r,a;return t.length===1&&typeof t[0]=="number"?a=t[0]:[r,a]=t,this.clear(),clearTimeout(this._previousTimeout),r||(r=o&&o.politeness?o.politeness:"polite"),a==null&&o&&(a=o.duration),this._liveElement.setAttribute("aria-live",r),this._liveElement.id&&this._exposeAnnouncerToModals(this._liveElement.id),this._ngZone.runOutsideAngular(()=>(this._currentPromise||(this._currentPromise=new Promise(l=>this._currentResolve=l)),clearTimeout(this._previousTimeout),this._previousTimeout=setTimeout(()=>{!e||typeof e=="string"?this._liveElement.textContent=e:Lc(this._liveElement,e,this._sanitizer),typeof a=="number"&&(this._previousTimeout=setTimeout(()=>this.clear(),a)),this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0},100),this._currentPromise))}clear(){this._liveElement&&(this._liveElement.textContent="")}ngOnDestroy(){clearTimeout(this._previousTimeout),this._liveElement?.remove(),this._liveElement=null,this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0}_createLiveElement(){let e="cdk-live-announcer-element",t=this._document.getElementsByClassName(e),o=this._document.createElement("div");for(let r=0;r<t.length;r++)t[r].remove();return o.classList.add(e),o.classList.add("cdk-visually-hidden"),o.setAttribute("aria-atomic","true"),o.setAttribute("aria-live","polite"),o.id=`cdk-live-announcer-${sp++}`,this._document.body.appendChild(o),o}_exposeAnnouncerToModals(e){let t=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let o=0;o<t.length;o++){let r=t[o],a=r.getAttribute("aria-owns");a?a.indexOf(e)===-1&&r.setAttribute("aria-owns",a+" "+e):r.setAttribute("aria-owns",e)}}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var $t=(function(i){return i[i.NONE=0]="NONE",i[i.BLACK_ON_WHITE=1]="BLACK_ON_WHITE",i[i.WHITE_ON_BLACK=2]="WHITE_ON_BLACK",i})($t||{}),jc="cdk-high-contrast-black-on-white",zc="cdk-high-contrast-white-on-black",ka="cdk-high-contrast-active",Gc=(()=>{class i{_platform=s(H);_hasCheckedHighContrastMode=!1;_document=s(S);_breakpointSubscription;constructor(){this._breakpointSubscription=s(pn).observe("(forced-colors: active)").subscribe(()=>{this._hasCheckedHighContrastMode&&(this._hasCheckedHighContrastMode=!1,this._applyBodyHighContrastModeCssClasses())})}getHighContrastMode(){if(!this._platform.isBrowser)return $t.NONE;let e=this._document.createElement("div");e.style.backgroundColor="rgb(1,2,3)",e.style.position="absolute",this._document.body.appendChild(e);let t=this._document.defaultView||window,o=t&&t.getComputedStyle?t.getComputedStyle(e):null,r=(o&&o.backgroundColor||"").replace(/ /g,"");switch(e.remove(),r){case"rgb(0,0,0)":case"rgb(45,50,54)":case"rgb(32,32,32)":return $t.WHITE_ON_BLACK;case"rgb(255,255,255)":case"rgb(255,250,239)":return $t.BLACK_ON_WHITE}return $t.NONE}ngOnDestroy(){this._breakpointSubscription.unsubscribe()}_applyBodyHighContrastModeCssClasses(){if(!this._hasCheckedHighContrastMode&&this._platform.isBrowser&&this._document.body){let e=this._document.body.classList;e.remove(ka,jc,zc),this._hasCheckedHighContrastMode=!0;let t=this.getHighContrastMode();t===$t.BLACK_ON_WHITE?e.add(ka,jc):t===$t.WHITE_ON_BLACK&&e.add(ka,zc)}}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),fn=(()=>{class i{constructor(){s(Gc)._applyBodyHighContrastModeCssClasses()}static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[tr]})}return i})();var lp=200,ir=class{_letterKeyStream=new y;_items=[];_selectedItemIndex=-1;_pressedLetters=[];_skipPredicateFn;_selectedItem=new y;selectedItem=this._selectedItem;constructor(n,e){let t=typeof e?.debounceInterval=="number"?e.debounceInterval:lp;e?.skipPredicate&&(this._skipPredicateFn=e.skipPredicate),this.setItems(n),this._setupKeyHandler(t)}destroy(){this._pressedLetters=[],this._letterKeyStream.complete(),this._selectedItem.complete()}setCurrentSelectedItemIndex(n){this._selectedItemIndex=n}setItems(n){this._items=n}handleKey(n){let e=n.keyCode;n.key&&n.key.length===1?this._letterKeyStream.next(n.key.toLocaleUpperCase()):(e>=65&&e<=90||e>=48&&e<=57)&&this._letterKeyStream.next(String.fromCharCode(e))}isTyping(){return this._pressedLetters.length>0}reset(){this._pressedLetters=[]}_setupKeyHandler(n){this._letterKeyStream.pipe(Nt(e=>this._pressedLetters.push(e)),Cn(n),pe(()=>this._pressedLetters.length>0),ee(()=>this._pressedLetters.join("").toLocaleUpperCase())).subscribe(e=>{for(let t=1;t<this._items.length+1;t++){let o=(this._selectedItemIndex+t)%this._items.length,r=this._items[o];if(!this._skipPredicateFn?.(r)&&r.getLabel?.().toLocaleUpperCase().trim().indexOf(e)===0){this._selectedItem.next(r);break}}this._pressedLetters=[]})}};function xe(i,...n){return n.length?n.some(e=>i[e]):i.altKey||i.shiftKey||i.ctrlKey||i.metaKey}var or=class{_items;_activeItemIndex=Q(-1);_activeItem=Q(null);_wrap=!1;_typeaheadSubscription=Ae.EMPTY;_itemChangesSubscription;_vertical=!0;_horizontal=null;_allowedModifierKeys=[];_homeAndEnd=!1;_pageUpAndDown={enabled:!1,delta:10};_effectRef;_typeahead;_skipPredicateFn=n=>n.disabled;constructor(n,e){this._items=n,n instanceof ro?this._itemChangesSubscription=n.changes.subscribe(t=>this._itemsChanged(t.toArray())):Bt(n)&&(this._effectRef=tn(()=>this._itemsChanged(n()),{injector:e}))}tabOut=new y;change=new y;skipPredicate(n){return this._skipPredicateFn=n,this}withWrap(n=!0){return this._wrap=n,this}withVerticalOrientation(n=!0){return this._vertical=n,this}withHorizontalOrientation(n){return this._horizontal=n,this}withAllowedModifierKeys(n){return this._allowedModifierKeys=n,this}withTypeAhead(n=200){this._typeaheadSubscription.unsubscribe();let e=this._getItemsArray();return this._typeahead=new ir(e,{debounceInterval:typeof n=="number"?n:void 0,skipPredicate:t=>this._skipPredicateFn(t)}),this._typeaheadSubscription=this._typeahead.selectedItem.subscribe(t=>{this.setActiveItem(t)}),this}cancelTypeahead(){return this._typeahead?.reset(),this}withHomeAndEnd(n=!0){return this._homeAndEnd=n,this}withPageUpDown(n=!0,e=10){return this._pageUpAndDown={enabled:n,delta:e},this}setActiveItem(n){let e=this._activeItem();this.updateActiveItem(n),this._activeItem()!==e&&this.change.next(this._activeItemIndex())}onKeydown(n){let e=n.keyCode,o=["altKey","ctrlKey","metaKey","shiftKey"].every(r=>!n[r]||this._allowedModifierKeys.indexOf(r)>-1);switch(e){case 9:this.tabOut.next();return;case 40:if(this._vertical&&o){this.setNextItemActive();break}else return;case 38:if(this._vertical&&o){this.setPreviousItemActive();break}else return;case 39:if(this._horizontal&&o){this._horizontal==="rtl"?this.setPreviousItemActive():this.setNextItemActive();break}else return;case 37:if(this._horizontal&&o){this._horizontal==="rtl"?this.setNextItemActive():this.setPreviousItemActive();break}else return;case 36:if(this._homeAndEnd&&o){this.setFirstItemActive();break}else return;case 35:if(this._homeAndEnd&&o){this.setLastItemActive();break}else return;case 33:if(this._pageUpAndDown.enabled&&o){let r=this._activeItemIndex()-this._pageUpAndDown.delta;this._setActiveItemByIndex(r>0?r:0,1);break}else return;case 34:if(this._pageUpAndDown.enabled&&o){let r=this._activeItemIndex()+this._pageUpAndDown.delta,a=this._getItemsArray().length;this._setActiveItemByIndex(r<a?r:a-1,-1);break}else return;default:(o||xe(n,"shiftKey"))&&this._typeahead?.handleKey(n);return}this._typeahead?.reset(),n.preventDefault()}get activeItemIndex(){return this._activeItemIndex()}get activeItem(){return this._activeItem()}isTyping(){return!!this._typeahead&&this._typeahead.isTyping()}setFirstItemActive(){this._setActiveItemByIndex(0,1)}setLastItemActive(){this._setActiveItemByIndex(this._getItemsArray().length-1,-1)}setNextItemActive(){this._activeItemIndex()<0?this.setFirstItemActive():this._setActiveItemByDelta(1)}setPreviousItemActive(){this._activeItemIndex()<0&&this._wrap?this.setLastItemActive():this._setActiveItemByDelta(-1)}updateActiveItem(n){let e=this._getItemsArray(),t=typeof n=="number"?n:e.indexOf(n),o=e[t];this._activeItem.set(o??null),this._activeItemIndex.set(t),this._typeahead?.setCurrentSelectedItemIndex(t)}destroy(){this._typeaheadSubscription.unsubscribe(),this._itemChangesSubscription?.unsubscribe(),this._effectRef?.destroy(),this._typeahead?.destroy(),this.tabOut.complete(),this.change.complete()}_setActiveItemByDelta(n){this._wrap?this._setActiveInWrapMode(n):this._setActiveInDefaultMode(n)}_setActiveInWrapMode(n){let e=this._getItemsArray();for(let t=1;t<=e.length;t++){let o=(this._activeItemIndex()+n*t+e.length)%e.length,r=e[o];if(!this._skipPredicateFn(r)){this.setActiveItem(o);return}}}_setActiveInDefaultMode(n){this._setActiveItemByIndex(this._activeItemIndex()+n,n)}_setActiveItemByIndex(n,e){let t=this._getItemsArray();if(t[n]){for(;this._skipPredicateFn(t[n]);)if(n+=e,!t[n])return;this.setActiveItem(n)}}_getItemsArray(){return Bt(this._items)?this._items():this._items instanceof ro?this._items.toArray():this._items}_itemsChanged(n){this._typeahead?.setItems(n);let e=this._activeItem();if(e){let t=n.indexOf(e);t>-1&&t!==this._activeItemIndex()&&(this._activeItemIndex.set(t),this._typeahead?.setCurrentSelectedItemIndex(t))}}};var gn=class extends or{setActiveItem(n){this.activeItem&&this.activeItem.setInactiveStyles(),super.setActiveItem(n),this.activeItem&&this.activeItem.setActiveStyles()}};var Fa={},me=class i{_appId=s(nn);static _infix=`a${Math.floor(Math.random()*1e5).toString()}`;getId(n,e=!1){return this._appId!=="ng"&&(n+=this._appId),Fa.hasOwnProperty(n)||(Fa[n]=0),`${n}${e?i._infix+"-":""}${Fa[n]++}`}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})};var Zc=" ";function Yn(i,n,e){let t=ar(i,n);e=e.trim(),!t.some(o=>o.trim()===e)&&(t.push(e),i.setAttribute(n,t.join(Zc)))}function Gt(i,n,e){let t=ar(i,n);e=e.trim();let o=t.filter(r=>r!==e);o.length?i.setAttribute(n,o.join(Zc)):i.removeAttribute(n)}function ar(i,n){return i.getAttribute(n)?.match(/\S+/g)??[]}var Qc="cdk-describedby-message",rr="cdk-describedby-host",Pa=0,La=(()=>{class i{_platform=s(H);_document=s(S);_messageRegistry=new Map;_messagesContainer=null;_id=`${Pa++}`;constructor(){s(Le).load($n),this._id=s(nn)+"-"+Pa++}describe(e,t,o){if(!this._canBeDescribed(e,t))return;let r=Ra(t,o);typeof t!="string"?(Kc(t,this._id),this._messageRegistry.set(r,{messageElement:t,referenceCount:0})):this._messageRegistry.has(r)||this._createMessageElement(t,o),this._isElementDescribedByMessage(e,r)||this._addMessageReference(e,r)}removeDescription(e,t,o){if(!t||!this._isElementNode(e))return;let r=Ra(t,o);if(this._isElementDescribedByMessage(e,r)&&this._removeMessageReference(e,r),typeof t=="string"){let a=this._messageRegistry.get(r);a&&a.referenceCount===0&&this._deleteMessageElement(r)}this._messagesContainer?.childNodes.length===0&&(this._messagesContainer.remove(),this._messagesContainer=null)}ngOnDestroy(){let e=this._document.querySelectorAll(`[${rr}="${this._id}"]`);for(let t=0;t<e.length;t++)this._removeCdkDescribedByReferenceIds(e[t]),e[t].removeAttribute(rr);this._messagesContainer?.remove(),this._messagesContainer=null,this._messageRegistry.clear()}_createMessageElement(e,t){let o=this._document.createElement("div");Kc(o,this._id),o.textContent=e,t&&o.setAttribute("role",t),this._createMessagesContainer(),this._messagesContainer.appendChild(o),this._messageRegistry.set(Ra(e,t),{messageElement:o,referenceCount:0})}_deleteMessageElement(e){this._messageRegistry.get(e)?.messageElement?.remove(),this._messageRegistry.delete(e)}_createMessagesContainer(){if(this._messagesContainer)return;let e="cdk-describedby-message-container",t=this._document.querySelectorAll(`.${e}[platform="server"]`);for(let r=0;r<t.length;r++)t[r].remove();let o=this._document.createElement("div");o.style.visibility="hidden",o.classList.add(e),o.classList.add("cdk-visually-hidden"),this._platform.isBrowser||o.setAttribute("platform","server"),this._document.body.appendChild(o),this._messagesContainer=o}_removeCdkDescribedByReferenceIds(e){let t=ar(e,"aria-describedby").filter(o=>o.indexOf(Qc)!=0);e.setAttribute("aria-describedby",t.join(" "))}_addMessageReference(e,t){let o=this._messageRegistry.get(t);Yn(e,"aria-describedby",o.messageElement.id),e.setAttribute(rr,this._id),o.referenceCount++}_removeMessageReference(e,t){let o=this._messageRegistry.get(t);o.referenceCount--,Gt(e,"aria-describedby",o.messageElement.id),e.removeAttribute(rr)}_isElementDescribedByMessage(e,t){let o=ar(e,"aria-describedby"),r=this._messageRegistry.get(t),a=r&&r.messageElement.id;return!!a&&o.indexOf(a)!=-1}_canBeDescribed(e,t){if(!this._isElementNode(e))return!1;if(t&&typeof t=="object")return!0;let o=t==null?"":`${t}`.trim(),r=e.getAttribute("aria-label");return o?!r||r.trim()!==o:!1}_isElementNode(e){return e.nodeType===this._document.ELEMENT_NODE}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Ra(i,n){return typeof i=="string"?`${n||""}/${i}`:i}function Kc(i,n){i.id||(i.id=`${Qc}-${n}-${Pa++}`)}var sr={XSmall:"(max-width: 599.98px)",Small:"(min-width: 600px) and (max-width: 959.98px)",Medium:"(min-width: 960px) and (max-width: 1279.98px)",Large:"(min-width: 1280px) and (max-width: 1919.98px)",XLarge:"(min-width: 1920px)",Handset:"(max-width: 599.98px) and (orientation: portrait), (max-width: 959.98px) and (orientation: landscape)",Tablet:"(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait), (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",Web:"(min-width: 840px) and (orientation: portrait), (min-width: 1280px) and (orientation: landscape)",HandsetPortrait:"(max-width: 599.98px) and (orientation: portrait)",TabletPortrait:"(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)",WebPortrait:"(min-width: 840px) and (orientation: portrait)",HandsetLandscape:"(max-width: 959.98px) and (orientation: landscape)",TabletLandscape:"(min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",WebLandscape:"(min-width: 1280px) and (orientation: landscape)"};var cp=new g("MATERIAL_ANIMATIONS"),Jc=null;function Vi(){return s(cp,{optional:!0})?.animationsDisabled||s(En,{optional:!0})==="NoopAnimations"?"di-disabled":(Jc??=s(Gn).matchMedia("(prefers-reduced-motion)").matches,Jc?"reduced-motion":"enabled")}function he(){return Vi()!=="enabled"}function be(i){return i==null?"":typeof i=="string"?i:`${i}px`}function It(i){return i!=null&&`${i}`!="false"}var at=(function(i){return i[i.FADING_IN=0]="FADING_IN",i[i.VISIBLE=1]="VISIBLE",i[i.FADING_OUT=2]="FADING_OUT",i[i.HIDDEN=3]="HIDDEN",i})(at||{}),Na=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=at.HIDDEN;constructor(n,e,t,o=!1){this._renderer=n,this.element=e,this.config=t,this._animationForciblyDisabledThroughCss=o}fadeOut(){this._renderer.fadeOutRipple(this)}},ed=Un({passive:!0,capture:!0}),Ba=class{_events=new Map;addHandler(n,e,t,o){let r=this._events.get(e);if(r){let a=r.get(t);a?a.add(o):r.set(t,new Set([o]))}else this._events.set(e,new Map([[t,new Set([o])]])),n.runOutsideAngular(()=>{document.addEventListener(e,this._delegateEventHandler,ed)})}removeHandler(n,e,t){let o=this._events.get(n);if(!o)return;let r=o.get(e);r&&(r.delete(t),r.size===0&&o.delete(e),o.size===0&&(this._events.delete(n),document.removeEventListener(n,this._delegateEventHandler,ed)))}_delegateEventHandler=n=>{let e=Ee(n);e&&this._events.get(n.type)?.forEach((t,o)=>{(o===e||o.contains(e))&&t.forEach(r=>r.handleEvent(n))})}},ji={enterDuration:225,exitDuration:150},dp=800,td=Un({passive:!0,capture:!0}),nd=["mousedown","touchstart"],id=["mouseup","mouseleave","touchend","touchcancel"],up=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["ng-component"]],hostAttrs:["mat-ripple-style-loader",""],decls:0,vars:0,template:function(t,o){},styles:[`.mat-ripple {
  overflow: hidden;
  position: relative;
}
.mat-ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-ripple.mat-ripple-unbounded {
  overflow: visible;
}

.mat-ripple-element {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: scale3d(0, 0, 0);
  background-color: var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent));
}
@media (forced-colors: active) {
  .mat-ripple-element {
    display: none;
  }
}
.cdk-drag-preview .mat-ripple-element, .cdk-drag-placeholder .mat-ripple-element {
  display: none;
}
`],encapsulation:2,changeDetection:0})}return i})(),zi=class i{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=!1;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=!1;_containerRect=null;static _eventManager=new Ba;constructor(n,e,t,o,r){this._target=n,this._ngZone=e,this._platform=o,o.isBrowser&&(this._containerElement=qe(t)),r&&r.get(Le).load(up)}fadeInRipple(n,e,t={}){let o=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),r=C(C({},ji),t.animation);t.centered&&(n=o.left+o.width/2,e=o.top+o.height/2);let a=t.radius||mp(n,e,o),l=n-o.left,c=e-o.top,p=r.enterDuration,f=document.createElement("div");f.classList.add("mat-ripple-element"),f.style.left=`${l-a}px`,f.style.top=`${c-a}px`,f.style.height=`${a*2}px`,f.style.width=`${a*2}px`,t.color!=null&&(f.style.backgroundColor=t.color),f.style.transitionDuration=`${p}ms`,this._containerElement.appendChild(f);let v=window.getComputedStyle(f),F=v.transitionProperty,q=v.transitionDuration,Y=F==="none"||q==="0s"||q==="0s, 0s"||o.width===0&&o.height===0,J=new Na(this,f,t,Y);f.style.transform="scale3d(1, 1, 1)",J.state=at.FADING_IN,t.persistent||(this._mostRecentTransientRipple=J);let G=null;return!Y&&(p||r.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let ne=()=>{G&&(G.fallbackTimer=null),clearTimeout(xt),this._finishRippleTransition(J)},Ve=()=>this._destroyRipple(J),xt=setTimeout(Ve,p+100);f.addEventListener("transitionend",ne),f.addEventListener("transitioncancel",Ve),G={onTransitionEnd:ne,onTransitionCancel:Ve,fallbackTimer:xt}}),this._activeRipples.set(J,G),(Y||!p)&&this._finishRippleTransition(J),J}fadeOutRipple(n){if(n.state===at.FADING_OUT||n.state===at.HIDDEN)return;let e=n.element,t=C(C({},ji),n.config.animation);e.style.transitionDuration=`${t.exitDuration}ms`,e.style.opacity="0",n.state=at.FADING_OUT,(n._animationForciblyDisabledThroughCss||!t.exitDuration)&&this._finishRippleTransition(n)}fadeOutAll(){this._getActiveRipples().forEach(n=>n.fadeOut())}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(n=>{n.config.persistent||n.fadeOut()})}setupTriggerEvents(n){let e=qe(n);!this._platform.isBrowser||!e||e===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=e,nd.forEach(t=>{i._eventManager.addHandler(this._ngZone,t,e,this)}))}handleEvent(n){n.type==="mousedown"?this._onMousedown(n):n.type==="touchstart"?this._onTouchStart(n):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{id.forEach(e=>{this._triggerElement.addEventListener(e,this,td)})}),this._pointerUpEventsRegistered=!0)}_finishRippleTransition(n){n.state===at.FADING_IN?this._startFadeOutTransition(n):n.state===at.FADING_OUT&&this._destroyRipple(n)}_startFadeOutTransition(n){let e=n===this._mostRecentTransientRipple,{persistent:t}=n.config;n.state=at.VISIBLE,!t&&(!e||!this._isPointerDown)&&n.fadeOut()}_destroyRipple(n){let e=this._activeRipples.get(n)??null;this._activeRipples.delete(n),this._activeRipples.size||(this._containerRect=null),n===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),n.state=at.HIDDEN,e!==null&&(n.element.removeEventListener("transitionend",e.onTransitionEnd),n.element.removeEventListener("transitioncancel",e.onTransitionCancel),e.fallbackTimer!==null&&clearTimeout(e.fallbackTimer)),n.element.remove()}_onMousedown(n){let e=Ri(n),t=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+dp;!this._target.rippleDisabled&&!e&&!t&&(this._isPointerDown=!0,this.fadeInRipple(n.clientX,n.clientY,this._target.rippleConfig))}_onTouchStart(n){if(!this._target.rippleDisabled&&!Pi(n)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=!0;let e=n.changedTouches;if(e)for(let t=0;t<e.length;t++)this.fadeInRipple(e[t].clientX,e[t].clientY,this._target.rippleConfig)}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=!1,this._getActiveRipples().forEach(n=>{let e=n.state===at.VISIBLE||n.config.terminateOnPointerUp&&n.state===at.FADING_IN;!n.config.persistent&&e&&n.fadeOut()}))}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let n=this._triggerElement;n&&(nd.forEach(e=>i._eventManager.removeHandler(e,n,this)),this._pointerUpEventsRegistered&&(id.forEach(e=>n.removeEventListener(e,this,td)),this._pointerUpEventsRegistered=!1))}};function mp(i,n,e){let t=Math.max(Math.abs(i-e.left),Math.abs(i-e.right)),o=Math.max(Math.abs(n-e.top),Math.abs(n-e.bottom));return Math.sqrt(t*t+o*o)}var Va=new g("mat-ripple-global-options"),od=(()=>{class i{_elementRef=s(A);_animationsDisabled=he();color;unbounded=!1;centered=!1;radius=0;animation;get disabled(){return this._disabled}set disabled(e){e&&this.fadeOutAllNonPersistent(),this._disabled=e,this._setupTriggerEventsIfEnabled()}_disabled=!1;get trigger(){return this._trigger||this._elementRef.nativeElement}set trigger(e){this._trigger=e,this._setupTriggerEventsIfEnabled()}_trigger;_rippleRenderer;_globalOptions;_isInitialized=!1;constructor(){let e=s(I),t=s(H),o=s(Va,{optional:!0}),r=s(O);this._globalOptions=o||{},this._rippleRenderer=new zi(this,e,this._elementRef,t,r)}ngOnInit(){this._isInitialized=!0,this._setupTriggerEventsIfEnabled()}ngOnDestroy(){this._rippleRenderer._removeTriggerEvents()}fadeOutAll(){this._rippleRenderer.fadeOutAll()}fadeOutAllNonPersistent(){this._rippleRenderer.fadeOutAllNonPersistent()}get rippleConfig(){return{centered:this.centered,radius:this.radius,color:this.color,animation:C(C(C({},this._globalOptions.animation),this._animationsDisabled?{enterDuration:0,exitDuration:0}:{}),this.animation),terminateOnPointerUp:this._globalOptions.terminateOnPointerUp}}get rippleDisabled(){return this.disabled||!!this._globalOptions.disabled}_setupTriggerEventsIfEnabled(){!this.disabled&&this._isInitialized&&this._rippleRenderer.setupTriggerEvents(this.trigger)}launch(e,t=0,o){return typeof e=="number"?this._rippleRenderer.fadeInRipple(e,t,C(C({},this.rippleConfig),o)):this._rippleRenderer.fadeInRipple(0,0,C(C({},this.rippleConfig),e))}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["","mat-ripple",""],["","matRipple",""]],hostAttrs:[1,"mat-ripple"],hostVars:2,hostBindings:function(t,o){t&2&&M("mat-ripple-unbounded",o.unbounded)},inputs:{color:[0,"matRippleColor","color"],unbounded:[0,"matRippleUnbounded","unbounded"],centered:[0,"matRippleCentered","centered"],radius:[0,"matRippleRadius","radius"],animation:[0,"matRippleAnimation","animation"],disabled:[0,"matRippleDisabled","disabled"],trigger:[0,"matRippleTrigger","trigger"]},exportAs:["matRipple"]})}return i})();var hp={capture:!0},pp=["focus","mousedown","mouseenter","touchstart"],ja="mat-ripple-loader-uninitialized",za="mat-ripple-loader-class-name",rd="mat-ripple-loader-centered",lr="mat-ripple-loader-disabled",ad=(()=>{class i{_document=s(S);_animationsDisabled=he();_globalRippleOptions=s(Va,{optional:!0});_platform=s(H);_ngZone=s(I);_injector=s(O);_eventCleanups;_hosts=new Map;constructor(){let e=s(Te).createRenderer(null,null);this._eventCleanups=this._ngZone.runOutsideAngular(()=>pp.map(t=>e.listen(this._document,t,this._onInteraction,hp)))}ngOnDestroy(){let e=this._hosts.keys();for(let t of e)this.destroyRipple(t);this._eventCleanups.forEach(t=>t())}configureRipple(e,t){e.setAttribute(ja,this._globalRippleOptions?.namespace??""),(t.className||!e.hasAttribute(za))&&e.setAttribute(za,t.className||""),t.centered&&e.setAttribute(rd,""),t.disabled&&e.setAttribute(lr,"")}setDisabled(e,t){let o=this._hosts.get(e);o?(o.target.rippleDisabled=t,!t&&!o.hasSetUpEvents&&(o.hasSetUpEvents=!0,o.renderer.setupTriggerEvents(e))):t?e.setAttribute(lr,""):e.removeAttribute(lr)}_onInteraction=e=>{let t=Ee(e);if(t instanceof HTMLElement){let o=t.closest(`[${ja}="${this._globalRippleOptions?.namespace??""}"]`);o&&this._createRipple(o)}};_createRipple(e){if(!this._document||this._hosts.has(e))return;e.querySelector(".mat-ripple")?.remove();let t=this._document.createElement("span");t.classList.add("mat-ripple",e.getAttribute(za)),e.append(t);let o=this._globalRippleOptions,r=this._animationsDisabled?0:o?.animation?.enterDuration??ji.enterDuration,a=this._animationsDisabled?0:o?.animation?.exitDuration??ji.exitDuration,l={rippleDisabled:this._animationsDisabled||o?.disabled||e.hasAttribute(lr),rippleConfig:{centered:e.hasAttribute(rd),terminateOnPointerUp:o?.terminateOnPointerUp,animation:{enterDuration:r,exitDuration:a}}},c=new zi(l,this._ngZone,t,this._platform,this._injector),p=!l.rippleDisabled;p&&c.setupTriggerEvents(e),this._hosts.set(e,{target:l,renderer:c,hasSetUpEvents:p}),e.removeAttribute(ja)}destroyRipple(e){let t=this._hosts.get(e);t&&(t.renderer._removeTriggerEvents(),this._hosts.delete(e))}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var cr=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["structural-styles"]],decls:0,vars:0,template:function(t,o){},styles:[`.mat-focus-indicator {
  position: relative;
}
.mat-focus-indicator::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  box-sizing: border-box;
  pointer-events: none;
  display: var(--mat-focus-indicator-display, none);
  border-width: var(--mat-focus-indicator-border-width, 3px);
  border-style: var(--mat-focus-indicator-border-style, solid);
  border-color: var(--mat-focus-indicator-border-color, transparent);
  border-radius: var(--mat-focus-indicator-border-radius, 4px);
}
.mat-focus-indicator:focus-visible::before {
  content: "";
}

@media (forced-colors: active) {
  html {
    --mat-focus-indicator-display: block;
  }
}
`],encapsulation:2,changeDetection:0})}return i})();var fp=["mat-icon-button",""],gp=["*"],_p=new g("MAT_BUTTON_CONFIG");function sd(i){return i==null?void 0:Xe(i)}var Ua=(()=>{class i{_elementRef=s(A);_ngZone=s(I);_animationsDisabled=he();_config=s(_p,{optional:!0});_focusMonitor=s(un);_cleanupClick;_renderer=s(re);_rippleLoader=s(ad);_isAnchor;_isFab=!1;color;get disableRipple(){return this._disableRipple}set disableRipple(e){this._disableRipple=e,this._updateRippleDisabled()}_disableRipple=!1;get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._updateRippleDisabled()}_disabled=!1;ariaDisabled;disabledInteractive;tabIndex;set _tabindex(e){this.tabIndex=e}constructor(){s(Le).load(cr);let e=this._elementRef.nativeElement;this._isAnchor=e.tagName==="A",this.disabledInteractive=this._config?.disabledInteractive??!1,this.color=this._config?.color??null,this._rippleLoader?.configureRipple(e,{className:"mat-mdc-button-ripple"})}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0),this._isAnchor&&this._setupAsAnchor()}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement)}focus(e="program",t){e?this._focusMonitor.focusVia(this._elementRef.nativeElement,e,t):this._elementRef.nativeElement.focus(t)}_getAriaDisabled(){return this.ariaDisabled!=null?this.ariaDisabled:this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?!0:null}_getDisabledAttribute(){return this.disabledInteractive||!this.disabled?null:!0}_updateRippleDisabled(){this._rippleLoader?.setDisabled(this._elementRef.nativeElement,this.disableRipple||this.disabled)}_getTabIndex(){return this._isAnchor?this.disabled&&!this.disabledInteractive?-1:this.tabIndex:this.tabIndex}_setupAsAnchor(){this._cleanupClick=this._ngZone.runOutsideAngular(()=>this._renderer.listen(this._elementRef.nativeElement,"click",e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}))}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,hostAttrs:[1,"mat-mdc-button-base"],hostVars:13,hostBindings:function(t,o){t&2&&(W("disabled",o._getDisabledAttribute())("aria-disabled",o._getAriaDisabled())("tabindex",o._getTabIndex()),Fe(o.color?"mat-"+o.color:""),M("mat-mdc-button-disabled",o.disabled)("mat-mdc-button-disabled-interactive",o.disabledInteractive)("mat-unthemed",!o.color)("_mat-animation-noopable",o._animationsDisabled))},inputs:{color:"color",disableRipple:[2,"disableRipple","disableRipple",U],disabled:[2,"disabled","disabled",U],ariaDisabled:[2,"aria-disabled","ariaDisabled",U],disabledInteractive:[2,"disabledInteractive","disabledInteractive",U],tabIndex:[2,"tabIndex","tabIndex",sd],_tabindex:[2,"tabindex","_tabindex",sd]}})}return i})(),Ui=(()=>{class i extends Ua{constructor(){super(),this._rippleLoader.configureRipple(this._elementRef.nativeElement,{centered:!0})}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["button","mat-icon-button",""],["a","mat-icon-button",""],["button","matIconButton",""],["a","matIconButton",""]],hostAttrs:[1,"mdc-icon-button","mat-mdc-icon-button"],exportAs:["matButton","matAnchor"],features:[ce],attrs:fp,ngContentSelectors:gp,decls:4,vars:0,consts:[[1,"mat-mdc-button-persistent-ripple","mdc-icon-button__ripple"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(t,o){t&1&&(_e(),Be(0,"span",0),$(1),Be(2,"span",1)(3,"span",2))},styles:[`.mat-mdc-icon-button {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: transparent;
  fill: currentColor;
  text-decoration: none;
  cursor: pointer;
  z-index: 0;
  overflow: visible;
  border-radius: var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));
  flex-shrink: 0;
  text-align: center;
  width: var(--mat-icon-button-state-layer-size, 40px);
  height: var(--mat-icon-button-state-layer-size, 40px);
  padding: calc(calc(var(--mat-icon-button-state-layer-size, 40px) - var(--mat-icon-button-icon-size, 24px)) / 2);
  font-size: var(--mat-icon-button-icon-size, 24px);
  color: var(--mat-icon-button-icon-color, var(--mat-sys-on-surface-variant));
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-icon-button .mat-mdc-button-ripple,
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-icon-button .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-icon-button .mdc-button__label,
.mat-mdc-icon-button .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-icon-button .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
}
.mat-mdc-icon-button:focus-visible > .mat-focus-indicator::before {
  content: "";
  border-radius: inherit;
}
.mat-mdc-icon-button .mat-ripple-element {
  background-color: var(--mat-icon-button-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface-variant) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-icon-button-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-icon-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-icon-button-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-icon-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-icon-button-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-icon-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-icon-button-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-icon-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-icon-button-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-icon-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-icon-button-touch-target-size, 48px);
  display: var(--mat-icon-button-touch-target-display, block);
  left: 50%;
  width: var(--mat-icon-button-touch-target-size, 48px);
  transform: translate(-50%, -50%);
}
.mat-mdc-icon-button._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-icon-button[disabled], .mat-mdc-icon-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-icon-button-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-icon-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-icon-button img,
.mat-mdc-icon-button svg {
  width: var(--mat-icon-button-icon-size, 24px);
  height: var(--mat-icon-button-icon-size, 24px);
  vertical-align: baseline;
}
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple {
  border-radius: var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));
}
.mat-mdc-icon-button[hidden] {
  display: none;
}
.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before {
  background: transparent;
  opacity: 1;
}
`,`@media (forced-colors: active) {
  .mat-mdc-button:not(.mdc-button--outlined),
  .mat-mdc-unelevated-button:not(.mdc-button--outlined),
  .mat-mdc-raised-button:not(.mdc-button--outlined),
  .mat-mdc-outlined-button:not(.mdc-button--outlined),
  .mat-mdc-button-base.mat-tonal-button,
  .mat-mdc-icon-button.mat-mdc-icon-button,
  .mat-mdc-outlined-button .mdc-button__ripple {
    outline: solid 1px;
  }
}
`],encapsulation:2,changeDetection:0})}return i})();var Xn=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[z]})}return i})();var vp=["matButton",""],bp=[[["",8,"material-icons",3,"iconPositionEnd",""],["mat-icon",3,"iconPositionEnd",""],["","matButtonIcon","",3,"iconPositionEnd",""]],"*",[["","iconPositionEnd","",8,"material-icons"],["mat-icon","iconPositionEnd",""],["","matButtonIcon","","iconPositionEnd",""]]],yp=[".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])","*",".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"];var ld=new Map([["text",["mat-mdc-button"]],["filled",["mdc-button--unelevated","mat-mdc-unelevated-button"]],["elevated",["mdc-button--raised","mat-mdc-raised-button"]],["outlined",["mdc-button--outlined","mat-mdc-outlined-button"]],["tonal",["mat-tonal-button"]]]),dr=(()=>{class i extends Ua{get appearance(){return this._appearance}set appearance(e){this.setAppearance(e||this._config?.defaultAppearance||"text")}_appearance=null;constructor(){super();let e=Cp(this._elementRef.nativeElement);e&&this.setAppearance(e)}setAppearance(e){if(e===this._appearance)return;let t=this._elementRef.nativeElement.classList,o=this._appearance?ld.get(this._appearance):null,r=ld.get(e);o&&t.remove(...o),t.add(...r),this._appearance=e}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["button","matButton",""],["a","matButton",""],["button","mat-button",""],["button","mat-raised-button",""],["button","mat-flat-button",""],["button","mat-stroked-button",""],["a","mat-button",""],["a","mat-raised-button",""],["a","mat-flat-button",""],["a","mat-stroked-button",""]],hostAttrs:[1,"mdc-button"],inputs:{appearance:[0,"matButton","appearance"]},exportAs:["matButton","matAnchor"],features:[ce],attrs:vp,ngContentSelectors:yp,decls:7,vars:4,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(t,o){t&1&&(_e(bp),Be(0,"span",0),$(1),Ie(2,"span",1),$(3,1),Oe(),$(4,2),Be(5,"span",2)(6,"span",3)),t&2&&M("mdc-button__ripple",!o._isFab)("mdc-fab__ripple",o._isFab)},styles:[`.mat-mdc-button-base {
  text-decoration: none;
}
.mat-mdc-button-base .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
@media (hover: none) {
  .mat-mdc-button-base:hover > span.mat-mdc-button-persistent-ripple::before {
    opacity: 0;
  }
}

.mdc-button {
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;
  border: none;
  outline: none;
  line-height: inherit;
  -webkit-appearance: none;
  overflow: visible;
  vertical-align: middle;
  background: transparent;
  padding: 0 8px;
}
.mdc-button::-moz-focus-inner {
  padding: 0;
  border: 0;
}
.mdc-button:active {
  outline: none;
}
.mdc-button:hover {
  cursor: pointer;
}
.mdc-button:disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-button[hidden] {
  display: none;
}
.mdc-button .mdc-button__label {
  position: relative;
}

.mat-mdc-button {
  padding: 0 var(--mat-button-text-horizontal-padding, 12px);
  height: var(--mat-button-text-container-height, 40px);
  font-family: var(--mat-button-text-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-text-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-text-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-text-label-text-transform);
  font-weight: var(--mat-button-text-label-text-weight, var(--mat-sys-label-large-weight));
}
.mat-mdc-button, .mat-mdc-button .mdc-button__ripple {
  border-radius: var(--mat-button-text-container-shape, var(--mat-sys-corner-full));
}
.mat-mdc-button:not(:disabled) {
  color: var(--mat-button-text-label-text-color, var(--mat-sys-primary));
}
.mat-mdc-button[disabled], .mat-mdc-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-button:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding: 0 var(--mat-button-text-with-icon-horizontal-padding, 16px);
}
.mat-mdc-button > .mat-icon {
  margin-right: var(--mat-button-text-icon-spacing, 8px);
  margin-left: var(--mat-button-text-icon-offset, -4px);
}
[dir=rtl] .mat-mdc-button > .mat-icon {
  margin-right: var(--mat-button-text-icon-offset, -4px);
  margin-left: var(--mat-button-text-icon-spacing, 8px);
}
.mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-text-icon-offset, -4px);
  margin-left: var(--mat-button-text-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-text-icon-spacing, 8px);
  margin-left: var(--mat-button-text-icon-offset, -4px);
}
.mat-mdc-button .mat-ripple-element {
  background-color: var(--mat-button-text-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-text-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-text-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-text-touch-target-size, 48px);
  display: var(--mat-button-text-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-unelevated-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-filled-container-height, 40px);
  font-family: var(--mat-button-filled-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-filled-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-filled-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-filled-label-text-transform);
  font-weight: var(--mat-button-filled-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-filled-horizontal-padding, 24px);
}
.mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--mat-button-filled-icon-spacing, 8px);
  margin-left: var(--mat-button-filled-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--mat-button-filled-icon-offset, -8px);
  margin-left: var(--mat-button-filled-icon-spacing, 8px);
}
.mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-filled-icon-offset, -8px);
  margin-left: var(--mat-button-filled-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-filled-icon-spacing, 8px);
  margin-left: var(--mat-button-filled-icon-offset, -8px);
}
.mat-mdc-unelevated-button .mat-ripple-element {
  background-color: var(--mat-button-filled-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-filled-state-layer-color, var(--mat-sys-on-primary));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-filled-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-unelevated-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-unelevated-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-unelevated-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-unelevated-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-filled-touch-target-size, 48px);
  display: var(--mat-button-filled-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-unelevated-button:not(:disabled) {
  color: var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary));
  background-color: var(--mat-button-filled-container-color, var(--mat-sys-primary));
}
.mat-mdc-unelevated-button, .mat-mdc-unelevated-button .mdc-button__ripple {
  border-radius: var(--mat-button-filled-container-shape, var(--mat-sys-corner-full));
}
.mat-mdc-unelevated-button[disabled], .mat-mdc-unelevated-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-raised-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--mat-button-protected-container-elevation-shadow, var(--mat-sys-level1));
  height: var(--mat-button-protected-container-height, 40px);
  font-family: var(--mat-button-protected-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-protected-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-protected-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-protected-label-text-transform);
  font-weight: var(--mat-button-protected-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-protected-horizontal-padding, 24px);
}
.mat-mdc-raised-button > .mat-icon {
  margin-right: var(--mat-button-protected-icon-spacing, 8px);
  margin-left: var(--mat-button-protected-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-raised-button > .mat-icon {
  margin-right: var(--mat-button-protected-icon-offset, -8px);
  margin-left: var(--mat-button-protected-icon-spacing, 8px);
}
.mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-protected-icon-offset, -8px);
  margin-left: var(--mat-button-protected-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-protected-icon-spacing, 8px);
  margin-left: var(--mat-button-protected-icon-offset, -8px);
}
.mat-mdc-raised-button .mat-ripple-element {
  background-color: var(--mat-button-protected-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-protected-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-protected-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-raised-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-raised-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-raised-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-raised-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-protected-touch-target-size, 48px);
  display: var(--mat-button-protected-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-raised-button:not(:disabled) {
  color: var(--mat-button-protected-label-text-color, var(--mat-sys-primary));
  background-color: var(--mat-button-protected-container-color, var(--mat-sys-surface));
}
.mat-mdc-raised-button, .mat-mdc-raised-button .mdc-button__ripple {
  border-radius: var(--mat-button-protected-container-shape, var(--mat-sys-corner-full));
}
@media (hover: hover) {
  .mat-mdc-raised-button:hover {
    box-shadow: var(--mat-button-protected-hover-container-elevation-shadow, var(--mat-sys-level2));
  }
}
.mat-mdc-raised-button:focus {
  box-shadow: var(--mat-button-protected-focus-container-elevation-shadow, var(--mat-sys-level1));
}
.mat-mdc-raised-button:active, .mat-mdc-raised-button:focus:active {
  box-shadow: var(--mat-button-protected-pressed-container-elevation-shadow, var(--mat-sys-level1));
}
.mat-mdc-raised-button[disabled], .mat-mdc-raised-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-protected-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-raised-button[disabled].mat-mdc-button-disabled, .mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled {
  box-shadow: var(--mat-button-protected-disabled-container-elevation-shadow, var(--mat-sys-level0));
}
.mat-mdc-raised-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-outlined-button {
  border-style: solid;
  transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-outlined-container-height, 40px);
  font-family: var(--mat-button-outlined-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-outlined-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-outlined-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-outlined-label-text-transform);
  font-weight: var(--mat-button-outlined-label-text-weight, var(--mat-sys-label-large-weight));
  border-radius: var(--mat-button-outlined-container-shape, var(--mat-sys-corner-full));
  border-width: var(--mat-button-outlined-outline-width, 1px);
  padding: 0 var(--mat-button-outlined-horizontal-padding, 24px);
}
.mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--mat-button-outlined-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--mat-button-outlined-icon-offset, -8px);
  margin-left: var(--mat-button-outlined-icon-spacing, 8px);
}
.mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-outlined-icon-offset, -8px);
  margin-left: var(--mat-button-outlined-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--mat-button-outlined-icon-offset, -8px);
}
.mat-mdc-outlined-button .mat-ripple-element {
  background-color: var(--mat-button-outlined-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-outlined-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-outlined-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-outlined-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-outlined-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-outlined-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-outlined-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-outlined-touch-target-size, 48px);
  display: var(--mat-button-outlined-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-outlined-button:not(:disabled) {
  color: var(--mat-button-outlined-label-text-color, var(--mat-sys-primary));
  border-color: var(--mat-button-outlined-outline-color, var(--mat-sys-outline));
}
.mat-mdc-outlined-button[disabled], .mat-mdc-outlined-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  border-color: var(--mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-tonal-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-tonal-container-height, 40px);
  font-family: var(--mat-button-tonal-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-tonal-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-tonal-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-tonal-label-text-transform);
  font-weight: var(--mat-button-tonal-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-tonal-horizontal-padding, 24px);
}
.mat-tonal-button:not(:disabled) {
  color: var(--mat-button-tonal-label-text-color, var(--mat-sys-on-secondary-container));
  background-color: var(--mat-button-tonal-container-color, var(--mat-sys-secondary-container));
}
.mat-tonal-button, .mat-tonal-button .mdc-button__ripple {
  border-radius: var(--mat-button-tonal-container-shape, var(--mat-sys-corner-full));
}
.mat-tonal-button[disabled], .mat-tonal-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-tonal-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-tonal-button > .mat-icon {
  margin-right: var(--mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--mat-button-tonal-icon-offset, -8px);
}
[dir=rtl] .mat-tonal-button > .mat-icon {
  margin-right: var(--mat-button-tonal-icon-offset, -8px);
  margin-left: var(--mat-button-tonal-icon-spacing, 8px);
}
.mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-tonal-icon-offset, -8px);
  margin-left: var(--mat-button-tonal-icon-spacing, 8px);
}
[dir=rtl] .mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--mat-button-tonal-icon-offset, -8px);
}
.mat-tonal-button .mat-ripple-element {
  background-color: var(--mat-button-tonal-ripple-color, color-mix(in srgb, var(--mat-sys-on-secondary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-tonal-state-layer-color, var(--mat-sys-on-secondary-container));
}
.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-tonal-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-tonal-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-tonal-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-tonal-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-tonal-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-tonal-touch-target-size, 48px);
  display: var(--mat-button-tonal-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-button,
.mat-mdc-unelevated-button,
.mat-mdc-raised-button,
.mat-mdc-outlined-button,
.mat-tonal-button {
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-button .mdc-button__label,
.mat-mdc-button .mat-icon,
.mat-mdc-unelevated-button .mdc-button__label,
.mat-mdc-unelevated-button .mat-icon,
.mat-mdc-raised-button .mdc-button__label,
.mat-mdc-raised-button .mat-icon,
.mat-mdc-outlined-button .mdc-button__label,
.mat-mdc-outlined-button .mat-icon,
.mat-tonal-button .mdc-button__label,
.mat-tonal-button .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-button .mat-focus-indicator,
.mat-mdc-unelevated-button .mat-focus-indicator,
.mat-mdc-raised-button .mat-focus-indicator,
.mat-mdc-outlined-button .mat-focus-indicator,
.mat-tonal-button .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
}
.mat-mdc-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-unelevated-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-raised-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-outlined-button:focus-visible > .mat-focus-indicator::before,
.mat-tonal-button:focus-visible > .mat-focus-indicator::before {
  content: "";
  border-radius: inherit;
}
.mat-mdc-button._mat-animation-noopable,
.mat-mdc-unelevated-button._mat-animation-noopable,
.mat-mdc-raised-button._mat-animation-noopable,
.mat-mdc-outlined-button._mat-animation-noopable,
.mat-tonal-button._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-button > .mat-icon,
.mat-mdc-unelevated-button > .mat-icon,
.mat-mdc-raised-button > .mat-icon,
.mat-mdc-outlined-button > .mat-icon,
.mat-tonal-button > .mat-icon {
  display: inline-block;
  position: relative;
  vertical-align: top;
  font-size: 1.125rem;
  height: 1.125rem;
  width: 1.125rem;
}

.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mdc-button__ripple {
  top: -1px;
  left: -1px;
  bottom: -1px;
  right: -1px;
}

.mat-mdc-unelevated-button .mat-focus-indicator::before,
.mat-tonal-button .mat-focus-indicator::before,
.mat-mdc-raised-button .mat-focus-indicator::before {
  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);
}

.mat-mdc-outlined-button .mat-focus-indicator::before {
  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px) * -1);
}
`,`@media (forced-colors: active) {
  .mat-mdc-button:not(.mdc-button--outlined),
  .mat-mdc-unelevated-button:not(.mdc-button--outlined),
  .mat-mdc-raised-button:not(.mdc-button--outlined),
  .mat-mdc-outlined-button:not(.mdc-button--outlined),
  .mat-mdc-button-base.mat-tonal-button,
  .mat-mdc-icon-button.mat-mdc-icon-button,
  .mat-mdc-outlined-button .mdc-button__ripple {
    outline: solid 1px;
  }
}
`],encapsulation:2,changeDetection:0})}return i})();function Cp(i){return i.hasAttribute("mat-raised-button")?"elevated":i.hasAttribute("mat-stroked-button")?"outlined":i.hasAttribute("mat-flat-button")?"filled":i.hasAttribute("mat-button")?"text":null}var qn=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[Xn,z]})}return i})();function dd(i){return Error(`Unable to find icon with the name "${i}"`)}function xp(){return Error("Could not find HttpClient for use with Angular Material icons. Please add provideHttpClient() to your providers.")}function ud(i){return Error(`The URL provided to MatIconRegistry was not trusted as a resource URL via Angular's DomSanitizer. Attempted URL was "${i}".`)}function md(i){return Error(`The literal provided to MatIconRegistry was not trusted as safe HTML by Angular's DomSanitizer. Attempted literal was "${i}".`)}var kt=class{url;svgText;options;svgElement=null;constructor(n,e,t){this.url=n,this.svgText=e,this.options=t}},pd=(()=>{class i{_httpClient;_sanitizer;_errorHandler;_document;_svgIconConfigs=new Map;_iconSetConfigs=new Map;_cachedIconsByUrl=new Map;_inProgressUrlFetches=new Map;_fontCssClassesByAlias=new Map;_resolvers=[];_defaultFontSetClass=["material-icons","mat-ligature-font"];constructor(e,t,o,r){this._httpClient=e,this._sanitizer=t,this._errorHandler=r,this._document=o}addSvgIcon(e,t,o){return this.addSvgIconInNamespace("",e,t,o)}addSvgIconLiteral(e,t,o){return this.addSvgIconLiteralInNamespace("",e,t,o)}addSvgIconInNamespace(e,t,o,r){return this._addSvgIconConfig(e,t,new kt(o,null,r))}addSvgIconResolver(e){return this._resolvers.push(e),this}addSvgIconLiteralInNamespace(e,t,o,r){let a=this._sanitizer.sanitize(Ne.HTML,o);if(!a)throw md(o);let l=mn(a);return this._addSvgIconConfig(e,t,new kt("",l,r))}addSvgIconSet(e,t){return this.addSvgIconSetInNamespace("",e,t)}addSvgIconSetLiteral(e,t){return this.addSvgIconSetLiteralInNamespace("",e,t)}addSvgIconSetInNamespace(e,t,o){return this._addSvgIconSetConfig(e,new kt(t,null,o))}addSvgIconSetLiteralInNamespace(e,t,o){let r=this._sanitizer.sanitize(Ne.HTML,t);if(!r)throw md(t);let a=mn(r);return this._addSvgIconSetConfig(e,new kt("",a,o))}registerFontClassAlias(e,t=e){return this._fontCssClassesByAlias.set(e,t),this}classNameForFontAlias(e){return this._fontCssClassesByAlias.get(e)||e}setDefaultFontSetClass(...e){return this._defaultFontSetClass=e,this}getDefaultFontSetClass(){return this._defaultFontSetClass}getSvgIconFromUrl(e){let t=this._sanitizer.sanitize(Ne.RESOURCE_URL,e);if(!t)throw ud(e);let o=this._cachedIconsByUrl.get(t);return o?Z(ur(o)):this._loadSvgIconFromConfig(new kt(e,null)).pipe(Nt(r=>this._cachedIconsByUrl.set(t,r)),ee(r=>ur(r)))}getNamedSvgIcon(e,t=""){let o=hd(t,e),r=this._svgIconConfigs.get(o);if(r)return this._getSvgFromConfig(r);if(r=this._getIconConfigFromResolvers(t,e),r)return this._svgIconConfigs.set(o,r),this._getSvgFromConfig(r);let a=this._iconSetConfigs.get(t);return a?this._getSvgFromIconSetConfigs(e,a):gs(dd(o))}ngOnDestroy(){this._resolvers=[],this._svgIconConfigs.clear(),this._iconSetConfigs.clear(),this._cachedIconsByUrl.clear()}_getSvgFromConfig(e){return e.svgText?Z(ur(this._svgElementFromConfig(e))):this._loadSvgIconFromConfig(e).pipe(ee(t=>ur(t)))}_getSvgFromIconSetConfigs(e,t){let o=this._extractIconWithNameFromAnySet(e,t);if(o)return Z(o);let r=t.filter(a=>!a.svgText).map(a=>this._loadSvgIconSetFromConfig(a).pipe(Lt(l=>{let p=`Loading icon set URL: ${this._sanitizer.sanitize(Ne.RESOURCE_URL,a.url)} failed: ${l.message}`;return this._errorHandler.handleError(new Error(p)),Z(null)})));return io(r).pipe(ee(()=>{let a=this._extractIconWithNameFromAnySet(e,t);if(!a)throw dd(e);return a}))}_extractIconWithNameFromAnySet(e,t){for(let o=t.length-1;o>=0;o--){let r=t[o];if(r.svgText&&r.svgText.toString().indexOf(e)>-1){let a=this._svgElementFromConfig(r),l=this._extractSvgIconFromSet(a,e,r.options);if(l)return l}}return null}_loadSvgIconFromConfig(e){return this._fetchIcon(e).pipe(Nt(t=>e.svgText=t),ee(()=>this._svgElementFromConfig(e)))}_loadSvgIconSetFromConfig(e){return e.svgText?Z(null):this._fetchIcon(e).pipe(Nt(t=>e.svgText=t))}_extractSvgIconFromSet(e,t,o){let r=e.querySelector(`[id="${t}"]`);if(!r)return null;let a=r.cloneNode(!0);if(a.removeAttribute("id"),a.nodeName.toLowerCase()==="svg")return this._setSvgAttributes(a,o);if(a.nodeName.toLowerCase()==="symbol")return this._setSvgAttributes(this._toSvgElement(a),o);let l=this._svgElementFromString(mn("<svg></svg>"));return l.appendChild(a),this._setSvgAttributes(l,o)}_svgElementFromString(e){let t=this._document.createElement("DIV");t.innerHTML=e;let o=t.querySelector("svg");if(!o)throw Error("<svg> tag not found");return o}_toSvgElement(e){let t=this._svgElementFromString(mn("<svg></svg>")),o=e.attributes;for(let r=0;r<o.length;r++){let{name:a,value:l}=o[r];a!=="id"&&t.setAttribute(a,l)}for(let r=0;r<e.childNodes.length;r++)e.childNodes[r].nodeType===this._document.ELEMENT_NODE&&t.appendChild(e.childNodes[r].cloneNode(!0));return t}_setSvgAttributes(e,t){return e.setAttribute("fit",""),e.setAttribute("height","100%"),e.setAttribute("width","100%"),e.setAttribute("preserveAspectRatio","xMidYMid meet"),e.setAttribute("focusable","false"),t&&t.viewBox&&e.setAttribute("viewBox",t.viewBox),e}_fetchIcon(e){let{url:t,options:o}=e,r=o?.withCredentials??!1;if(!this._httpClient)throw xp();if(t==null)throw Error(`Cannot fetch icon from URL "${t}".`);let a=this._sanitizer.sanitize(Ne.RESOURCE_URL,t);if(!a)throw ud(t);let l=this._inProgressUrlFetches.get(a);if(l)return l;let c=this._httpClient.get(a,{responseType:"text",withCredentials:r}).pipe(ee(p=>mn(p)),xn(()=>this._inProgressUrlFetches.delete(a)),ys());return this._inProgressUrlFetches.set(a,c),c}_addSvgIconConfig(e,t,o){return this._svgIconConfigs.set(hd(e,t),o),this}_addSvgIconSetConfig(e,t){let o=this._iconSetConfigs.get(e);return o?o.push(t):this._iconSetConfigs.set(e,[t]),this}_svgElementFromConfig(e){if(!e.svgElement){let t=this._svgElementFromString(e.svgText);this._setSvgAttributes(t,e.options),e.svgElement=t}return e.svgElement}_getIconConfigFromResolvers(e,t){for(let o=0;o<this._resolvers.length;o++){let r=this._resolvers[o](t,e);if(r)return wp(r)?new kt(r.url,null,r.options):new kt(r,null)}}static \u0275fac=function(t){return new(t||i)(N(Ut,8),N(Di),N(S,8),N(en))};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function ur(i){return i.cloneNode(!0)}function hd(i,n){return i+":"+n}function wp(i){return!!(i.url&&i.options)}var Dp=["*"],Ep=new g("MAT_ICON_DEFAULT_OPTIONS"),Sp=new g("mat-icon-location",{providedIn:"root",factory:()=>{let i=s(S),n=i?i.location:null;return{getPathname:()=>n?n.pathname+n.search:""}}}),fd=["clip-path","color-profile","src","cursor","fill","filter","marker","marker-start","marker-mid","marker-end","mask","stroke"],Ap=fd.map(i=>`[${i}]`).join(", "),Mp=/^url\(['"]?#(.*?)['"]?\)$/,mr=(()=>{class i{_elementRef=s(A);_iconRegistry=s(pd);_location=s(Sp);_errorHandler=s(en);_defaultColor;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;inline=!1;get svgIcon(){return this._svgIcon}set svgIcon(e){e!==this._svgIcon&&(e?this._updateSvgIcon(e):this._svgIcon&&this._clearSvgElement(),this._svgIcon=e)}_svgIcon;get fontSet(){return this._fontSet}set fontSet(e){let t=this._cleanupFontValue(e);t!==this._fontSet&&(this._fontSet=t,this._updateFontIconClasses())}_fontSet;get fontIcon(){return this._fontIcon}set fontIcon(e){let t=this._cleanupFontValue(e);t!==this._fontIcon&&(this._fontIcon=t,this._updateFontIconClasses())}_fontIcon;_previousFontSetClass=[];_previousFontIconClass;_svgName=null;_svgNamespace=null;_previousPath;_elementsWithExternalReferences;_currentIconFetch=Ae.EMPTY;constructor(){let e=s(new po("aria-hidden"),{optional:!0}),t=s(Ep,{optional:!0});t&&(t.color&&(this.color=this._defaultColor=t.color),t.fontSet&&(this.fontSet=t.fontSet)),e||this._elementRef.nativeElement.setAttribute("aria-hidden","true")}_splitIconName(e){if(!e)return["",""];let t=e.split(":");switch(t.length){case 1:return["",t[0]];case 2:return t;default:throw Error(`Invalid icon name: "${e}"`)}}ngOnInit(){this._updateFontIconClasses()}ngAfterViewChecked(){let e=this._elementsWithExternalReferences;if(e&&e.size){let t=this._location.getPathname();t!==this._previousPath&&(this._previousPath=t,this._prependPathToReferences(t))}}ngOnDestroy(){this._currentIconFetch.unsubscribe(),this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear()}_usingFontIcon(){return!this.svgIcon}_setSvgElement(e){this._clearSvgElement();let t=this._location.getPathname();this._previousPath=t,this._cacheChildrenWithExternalReferences(e),this._prependPathToReferences(t),this._elementRef.nativeElement.appendChild(e)}_clearSvgElement(){let e=this._elementRef.nativeElement,t=e.childNodes.length;for(this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear();t--;){let o=e.childNodes[t];(o.nodeType!==1||o.nodeName.toLowerCase()==="svg")&&o.remove()}}_updateFontIconClasses(){if(!this._usingFontIcon())return;let e=this._elementRef.nativeElement,t=(this.fontSet?this._iconRegistry.classNameForFontAlias(this.fontSet).split(/ +/):this._iconRegistry.getDefaultFontSetClass()).filter(o=>o.length>0);this._previousFontSetClass.forEach(o=>e.classList.remove(o)),t.forEach(o=>e.classList.add(o)),this._previousFontSetClass=t,this.fontIcon!==this._previousFontIconClass&&!t.includes("mat-ligature-font")&&(this._previousFontIconClass&&e.classList.remove(this._previousFontIconClass),this.fontIcon&&e.classList.add(this.fontIcon),this._previousFontIconClass=this.fontIcon)}_cleanupFontValue(e){return typeof e=="string"?e.trim().split(" ")[0]:e}_prependPathToReferences(e){let t=this._elementsWithExternalReferences;t&&t.forEach((o,r)=>{o.forEach(a=>{r.setAttribute(a.name,`url('${e}#${a.value}')`)})})}_cacheChildrenWithExternalReferences(e){let t=e.querySelectorAll(Ap),o=this._elementsWithExternalReferences=this._elementsWithExternalReferences||new Map;for(let r=0;r<t.length;r++)fd.forEach(a=>{let l=t[r],c=l.getAttribute(a),p=c?c.match(Mp):null;if(p){let f=o.get(l);f||(f=[],o.set(l,f)),f.push({name:a,value:p[1]})}})}_updateSvgIcon(e){if(this._svgNamespace=null,this._svgName=null,this._currentIconFetch.unsubscribe(),e){let[t,o]=this._splitIconName(e);t&&(this._svgNamespace=t),o&&(this._svgName=o),this._currentIconFetch=this._iconRegistry.getNamedSvgIcon(o,t).pipe(je(1)).subscribe(r=>this._setSvgElement(r),r=>{let a=`Error retrieving icon ${t}:${o}! ${r.message}`;this._errorHandler.handleError(new Error(a))})}}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-icon"]],hostAttrs:["role","img",1,"mat-icon","notranslate"],hostVars:10,hostBindings:function(t,o){t&2&&(W("data-mat-icon-type",o._usingFontIcon()?"font":"svg")("data-mat-icon-name",o._svgName||o.fontIcon)("data-mat-icon-namespace",o._svgNamespace||o.fontSet)("fontIcon",o._usingFontIcon()?o.fontIcon:null),Fe(o.color?"mat-"+o.color:""),M("mat-icon-inline",o.inline)("mat-icon-no-color",o.color!=="primary"&&o.color!=="accent"&&o.color!=="warn"))},inputs:{color:"color",inline:[2,"inline","inline",U],svgIcon:"svgIcon",fontSet:"fontSet",fontIcon:"fontIcon"},exportAs:["matIcon"],ngContentSelectors:Dp,decls:1,vars:0,template:function(t,o){t&1&&(_e(),$(0))},styles:[`mat-icon, mat-icon.mat-primary, mat-icon.mat-accent, mat-icon.mat-warn {
  color: var(--mat-icon-color, inherit);
}

.mat-icon {
  -webkit-user-select: none;
  user-select: none;
  background-repeat: no-repeat;
  display: inline-block;
  fill: currentColor;
  height: 24px;
  width: 24px;
  overflow: hidden;
}
.mat-icon.mat-icon-inline {
  font-size: inherit;
  height: inherit;
  line-height: inherit;
  width: inherit;
}
.mat-icon.mat-ligature-font[fontIcon]::before {
  content: attr(fontIcon);
}

[dir=rtl] .mat-icon-rtl-mirror {
  transform: scale(-1, 1);
}

.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,
.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon {
  display: block;
}
.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,
.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon {
  margin: auto;
}
`],encapsulation:2,changeDetection:0})}return i})(),hr=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[z]})}return i})();var Ip=["*"];var kp=[[["","mat-card-avatar",""],["","matCardAvatar",""]],[["mat-card-title"],["mat-card-subtitle"],["","mat-card-title",""],["","mat-card-subtitle",""],["","matCardTitle",""],["","matCardSubtitle",""]],"*"],Tp=["[mat-card-avatar], [matCardAvatar]",`mat-card-title, mat-card-subtitle,
      [mat-card-title], [mat-card-subtitle],
      [matCardTitle], [matCardSubtitle]`,"*"],Op=new g("MAT_CARD_CONFIG"),_d=(()=>{class i{appearance;constructor(){let e=s(Op,{optional:!0});this.appearance=e?.appearance||"raised"}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-card"]],hostAttrs:[1,"mat-mdc-card","mdc-card"],hostVars:8,hostBindings:function(t,o){t&2&&M("mat-mdc-card-outlined",o.appearance==="outlined")("mdc-card--outlined",o.appearance==="outlined")("mat-mdc-card-filled",o.appearance==="filled")("mdc-card--filled",o.appearance==="filled")},inputs:{appearance:"appearance"},exportAs:["matCard"],ngContentSelectors:Ip,decls:1,vars:0,template:function(t,o){t&1&&(_e(),$(0))},styles:[`.mat-mdc-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  border-style: solid;
  border-width: 0;
  background-color: var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));
  border-color: var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));
  border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));
  box-shadow: var(--mat-card-elevated-container-elevation, var(--mat-sys-level1));
}
.mat-mdc-card::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: solid 1px transparent;
  content: "";
  display: block;
  pointer-events: none;
  box-sizing: border-box;
  border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));
}

.mat-mdc-card-outlined {
  background-color: var(--mat-card-outlined-container-color, var(--mat-sys-surface));
  border-radius: var(--mat-card-outlined-container-shape, var(--mat-sys-corner-medium));
  border-width: var(--mat-card-outlined-outline-width, 1px);
  border-color: var(--mat-card-outlined-outline-color, var(--mat-sys-outline-variant));
  box-shadow: var(--mat-card-outlined-container-elevation, var(--mat-sys-level0));
}
.mat-mdc-card-outlined::after {
  border: none;
}

.mat-mdc-card-filled {
  background-color: var(--mat-card-filled-container-color, var(--mat-sys-surface-container-highest));
  border-radius: var(--mat-card-filled-container-shape, var(--mat-sys-corner-medium));
  box-shadow: var(--mat-card-filled-container-elevation, var(--mat-sys-level0));
}

.mdc-card__media {
  position: relative;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.mdc-card__media::before {
  display: block;
  content: "";
}
.mdc-card__media:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
.mdc-card__media:last-child {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.mat-mdc-card-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  min-height: 52px;
  padding: 8px;
}

.mat-mdc-card-title {
  font-family: var(--mat-card-title-text-font, var(--mat-sys-title-large-font));
  line-height: var(--mat-card-title-text-line-height, var(--mat-sys-title-large-line-height));
  font-size: var(--mat-card-title-text-size, var(--mat-sys-title-large-size));
  letter-spacing: var(--mat-card-title-text-tracking, var(--mat-sys-title-large-tracking));
  font-weight: var(--mat-card-title-text-weight, var(--mat-sys-title-large-weight));
}

.mat-mdc-card-subtitle {
  color: var(--mat-card-subtitle-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-card-subtitle-text-font, var(--mat-sys-title-medium-font));
  line-height: var(--mat-card-subtitle-text-line-height, var(--mat-sys-title-medium-line-height));
  font-size: var(--mat-card-subtitle-text-size, var(--mat-sys-title-medium-size));
  letter-spacing: var(--mat-card-subtitle-text-tracking, var(--mat-sys-title-medium-tracking));
  font-weight: var(--mat-card-subtitle-text-weight, var(--mat-sys-title-medium-weight));
}

.mat-mdc-card-title,
.mat-mdc-card-subtitle {
  display: block;
  margin: 0;
}
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title,
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle {
  padding: 16px 16px 0;
}

.mat-mdc-card-header {
  display: flex;
  padding: 16px 16px 0;
}

.mat-mdc-card-content {
  display: block;
  padding: 0 16px;
}
.mat-mdc-card-content:first-child {
  padding-top: 16px;
}
.mat-mdc-card-content:last-child {
  padding-bottom: 16px;
}

.mat-mdc-card-title-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.mat-mdc-card-avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-bottom: 16px;
  object-fit: cover;
}
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle,
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title {
  line-height: normal;
}

.mat-mdc-card-sm-image {
  width: 80px;
  height: 80px;
}

.mat-mdc-card-md-image {
  width: 112px;
  height: 112px;
}

.mat-mdc-card-lg-image {
  width: 152px;
  height: 152px;
}

.mat-mdc-card-xl-image {
  width: 240px;
  height: 240px;
}

.mat-mdc-card-subtitle ~ .mat-mdc-card-title,
.mat-mdc-card-title ~ .mat-mdc-card-subtitle,
.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-title,
.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-subtitle,
.mat-mdc-card-title-group .mat-mdc-card-title,
.mat-mdc-card-title-group .mat-mdc-card-subtitle {
  padding-top: 0;
}

.mat-mdc-card-content > :last-child:not(.mat-mdc-card-footer) {
  margin-bottom: 0;
}

.mat-mdc-card-actions-align-end {
  justify-content: flex-end;
}
`],encapsulation:2,changeDetection:0})}return i})(),vd=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["mat-card-title"],["","mat-card-title",""],["","matCardTitle",""]],hostAttrs:[1,"mat-mdc-card-title"]})}return i})();var bd=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["mat-card-content"]],hostAttrs:[1,"mat-mdc-card-content"]})}return i})();var yd=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-card-header"]],hostAttrs:[1,"mat-mdc-card-header"],ngContentSelectors:Tp,decls:4,vars:0,consts:[[1,"mat-mdc-card-header-text"]],template:function(t,o){t&1&&(_e(kp),$(0),Ie(1,"div",0),$(2,1),Oe(),$(3,2))},encapsulation:2,changeDetection:0})}return i})();var Cd=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[z]})}return i})();var Hi=class{_multiple;_emitChanges;compareWith;_selection=new Set;_deselectedToEmit=[];_selectedToEmit=[];_selected=null;get selected(){return this._selected||(this._selected=Array.from(this._selection.values())),this._selected}changed=new y;constructor(n=!1,e,t=!0,o){this._multiple=n,this._emitChanges=t,this.compareWith=o,e&&e.length&&(n?e.forEach(r=>this._markSelected(r)):this._markSelected(e[0]),this._selectedToEmit.length=0)}select(...n){this._verifyValueAssignment(n),n.forEach(t=>this._markSelected(t));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}deselect(...n){this._verifyValueAssignment(n),n.forEach(t=>this._unmarkSelected(t));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}setSelection(...n){this._verifyValueAssignment(n);let e=this.selected,t=new Set(n.map(r=>this._getConcreteValue(r)));n.forEach(r=>this._markSelected(r)),e.filter(r=>!t.has(this._getConcreteValue(r,t))).forEach(r=>this._unmarkSelected(r));let o=this._hasQueuedChanges();return this._emitChangeEvent(),o}toggle(n){return this.isSelected(n)?this.deselect(n):this.select(n)}clear(n=!0){this._unmarkAll();let e=this._hasQueuedChanges();return n&&this._emitChangeEvent(),e}isSelected(n){return this._selection.has(this._getConcreteValue(n))}isEmpty(){return this._selection.size===0}hasValue(){return!this.isEmpty()}sort(n){this._multiple&&this.selected&&this._selected.sort(n)}isMultipleSelection(){return this._multiple}_emitChangeEvent(){this._selected=null,(this._selectedToEmit.length||this._deselectedToEmit.length)&&(this.changed.next({source:this,added:this._selectedToEmit,removed:this._deselectedToEmit}),this._deselectedToEmit=[],this._selectedToEmit=[])}_markSelected(n){n=this._getConcreteValue(n),this.isSelected(n)||(this._multiple||this._unmarkAll(),this.isSelected(n)||this._selection.add(n),this._emitChanges&&this._selectedToEmit.push(n))}_unmarkSelected(n){n=this._getConcreteValue(n),this.isSelected(n)&&(this._selection.delete(n),this._emitChanges&&this._deselectedToEmit.push(n))}_unmarkAll(){this.isEmpty()||this._selection.forEach(n=>this._unmarkSelected(n))}_verifyValueAssignment(n){n.length>1&&this._multiple}_hasQueuedChanges(){return!!(this._deselectedToEmit.length||this._selectedToEmit.length)}_getConcreteValue(n,e){if(this.compareWith){e=e??this._selection;for(let t of e)if(this.compareWith(n,t))return t;return n}else return n}};var Rp=20,_n=(()=>{class i{_ngZone=s(I);_platform=s(H);_renderer=s(Te).createRenderer(null,null);_cleanupGlobalListener;constructor(){}_scrolled=new y;_scrolledCount=0;scrollContainers=new Map;register(e){this.scrollContainers.has(e)||this.scrollContainers.set(e,e.elementScrolled().subscribe(()=>this._scrolled.next(e)))}deregister(e){let t=this.scrollContainers.get(e);t&&(t.unsubscribe(),this.scrollContainers.delete(e))}scrolled(e=Rp){return this._platform.isBrowser?new st(t=>{this._cleanupGlobalListener||(this._cleanupGlobalListener=this._ngZone.runOutsideAngular(()=>this._renderer.listen("document","scroll",()=>this._scrolled.next())));let o=e>0?this._scrolled.pipe(Vr(e)).subscribe(t):this._scrolled.subscribe(t);return this._scrolledCount++,()=>{o.unsubscribe(),this._scrolledCount--,this._scrolledCount||(this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0)}}):Z()}ngOnDestroy(){this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0,this.scrollContainers.forEach((e,t)=>this.deregister(t)),this._scrolled.complete()}ancestorScrolled(e,t){let o=this.getAncestorScrollContainers(e);return this.scrolled(t).pipe(pe(r=>!r||o.indexOf(r)>-1))}getAncestorScrollContainers(e){let t=[];return this.scrollContainers.forEach((o,r)=>{this._scrollableContainsElement(r,e)&&t.push(r)}),t}_scrollableContainsElement(e,t){let o=qe(t),r=e.getElementRef().nativeElement;do if(o==r)return!0;while(o=o.parentElement);return!1}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Ha=(()=>{class i{elementRef=s(A);scrollDispatcher=s(_n);ngZone=s(I);dir=s(ke,{optional:!0});_scrollElement=this.elementRef.nativeElement;_destroyed=new y;_renderer=s(re);_cleanupScroll;_elementScrolled=new y;constructor(){}ngOnInit(){this._cleanupScroll=this.ngZone.runOutsideAngular(()=>this._renderer.listen(this._scrollElement,"scroll",e=>this._elementScrolled.next(e))),this.scrollDispatcher.register(this)}ngOnDestroy(){this._cleanupScroll?.(),this._elementScrolled.complete(),this.scrollDispatcher.deregister(this),this._destroyed.next(),this._destroyed.complete()}elementScrolled(){return this._elementScrolled}getElementRef(){return this.elementRef}scrollTo(e){let t=this.elementRef.nativeElement,o=this.dir&&this.dir.value=="rtl";e.left==null&&(e.left=o?e.end:e.start),e.right==null&&(e.right=o?e.start:e.end),e.bottom!=null&&(e.top=t.scrollHeight-t.clientHeight-e.bottom),o&&zn()!=pt.NORMAL?(e.left!=null&&(e.right=t.scrollWidth-t.clientWidth-e.left),zn()==pt.INVERTED?e.left=e.right:zn()==pt.NEGATED&&(e.left=e.right?-e.right:e.right)):e.right!=null&&(e.left=t.scrollWidth-t.clientWidth-e.right),this._applyScrollToOptions(e)}_applyScrollToOptions(e){let t=this.elementRef.nativeElement;Zo()?t.scrollTo(e):(e.top!=null&&(t.scrollTop=e.top),e.left!=null&&(t.scrollLeft=e.left))}measureScrollOffset(e){let t="left",o="right",r=this.elementRef.nativeElement;if(e=="top")return r.scrollTop;if(e=="bottom")return r.scrollHeight-r.clientHeight-r.scrollTop;let a=this.dir&&this.dir.value=="rtl";return e=="start"?e=a?o:t:e=="end"&&(e=a?t:o),a&&zn()==pt.INVERTED?e==t?r.scrollWidth-r.clientWidth-r.scrollLeft:r.scrollLeft:a&&zn()==pt.NEGATED?e==t?r.scrollLeft+r.scrollWidth-r.clientWidth:-r.scrollLeft:e==t?r.scrollLeft:r.scrollWidth-r.clientWidth-r.scrollLeft}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["","cdk-scrollable",""],["","cdkScrollable",""]]})}return i})(),Pp=20,bt=(()=>{class i{_platform=s(H);_listeners;_viewportSize=null;_change=new y;_document=s(S);constructor(){let e=s(I),t=s(Te).createRenderer(null,null);e.runOutsideAngular(()=>{if(this._platform.isBrowser){let o=r=>this._change.next(r);this._listeners=[t.listen("window","resize",o),t.listen("window","orientationchange",o)]}this.change().subscribe(()=>this._viewportSize=null)})}ngOnDestroy(){this._listeners?.forEach(e=>e()),this._change.complete()}getViewportSize(){this._viewportSize||this._updateViewportSize();let e={width:this._viewportSize.width,height:this._viewportSize.height};return this._platform.isBrowser||(this._viewportSize=null),e}getViewportRect(){let e=this.getViewportScrollPosition(),{width:t,height:o}=this.getViewportSize();return{top:e.top,left:e.left,bottom:e.top+o,right:e.left+t,height:o,width:t}}getViewportScrollPosition(){if(!this._platform.isBrowser)return{top:0,left:0};let e=this._document,t=this._getWindow(),o=e.documentElement,r=o.getBoundingClientRect(),a=-r.top||e.body?.scrollTop||t.scrollY||o.scrollTop||0,l=-r.left||e.body?.scrollLeft||t.scrollX||o.scrollLeft||0;return{top:a,left:l}}change(e=Pp){return e>0?this._change.pipe(Vr(e)):this._change}_getWindow(){return this._document.defaultView||window}_updateViewportSize(){let e=this._getWindow();this._viewportSize=this._platform.isBrowser?{width:e.innerWidth,height:e.innerHeight}:{width:0,height:0}}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var Tt=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({})}return i})(),$a=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[z,Tt,z,Tt]})}return i})();var $i=class{_attachedHost=null;attach(n){return this._attachedHost=n,n.attach(this)}detach(){let n=this._attachedHost;n!=null&&(this._attachedHost=null,n.detach())}get isAttached(){return this._attachedHost!=null}setAttachedHost(n){this._attachedHost=n}},ft=class extends $i{component;viewContainerRef;injector;projectableNodes;bindings;constructor(n,e,t,o,r){super(),this.component=n,this.viewContainerRef=e,this.injector=t,this.projectableNodes=o,this.bindings=r||null}},gt=class extends $i{templateRef;viewContainerRef;context;injector;constructor(n,e,t,o){super(),this.templateRef=n,this.viewContainerRef=e,this.context=t,this.injector=o}get origin(){return this.templateRef.elementRef}attach(n,e=this.context){return this.context=e,super.attach(n)}detach(){return this.context=void 0,super.detach()}},Ga=class extends $i{element;constructor(n){super(),this.element=n instanceof A?n.nativeElement:n}},Wt=class{_attachedPortal=null;_disposeFn=null;_isDisposed=!1;hasAttached(){return!!this._attachedPortal}attach(n){if(n instanceof ft)return this._attachedPortal=n,this.attachComponentPortal(n);if(n instanceof gt)return this._attachedPortal=n,this.attachTemplatePortal(n);if(this.attachDomPortal&&n instanceof Ga)return this._attachedPortal=n,this.attachDomPortal(n)}attachDomPortal=null;detach(){this._attachedPortal&&(this._attachedPortal.setAttachedHost(null),this._attachedPortal=null),this._invokeDisposeFn()}dispose(){this.hasAttached()&&this.detach(),this._invokeDisposeFn(),this._isDisposed=!0}setDisposeFn(n){this._disposeFn=n}_invokeDisposeFn(){this._disposeFn&&(this._disposeFn(),this._disposeFn=null)}},pr=class extends Wt{outletElement;_appRef;_defaultInjector;constructor(n,e,t){super(),this.outletElement=n,this._appRef=e,this._defaultInjector=t}attachComponentPortal(n){let e;if(n.viewContainerRef){let t=n.injector||n.viewContainerRef.injector,o=t.get(lo,null,{optional:!0})||void 0;e=n.viewContainerRef.createComponent(n.component,{index:n.viewContainerRef.length,injector:t,ngModuleRef:o,projectableNodes:n.projectableNodes||void 0,bindings:n.bindings||void 0}),this.setDisposeFn(()=>e.destroy())}else{let t=this._appRef,o=n.injector||this._defaultInjector||O.NULL,r=o.get(lt,t.injector);e=fo(n.component,{elementInjector:o,environmentInjector:r,projectableNodes:n.projectableNodes||void 0,bindings:n.bindings||void 0}),t.attachView(e.hostView),this.setDisposeFn(()=>{t.viewCount>0&&t.detachView(e.hostView),e.destroy()})}return this.outletElement.appendChild(this._getComponentRootNode(e)),this._attachedPortal=n,e}attachTemplatePortal(n){let e=n.viewContainerRef,t=e.createEmbeddedView(n.templateRef,n.context,{injector:n.injector});return t.rootNodes.forEach(o=>this.outletElement.appendChild(o)),t.detectChanges(),this.setDisposeFn(()=>{let o=e.indexOf(t);o!==-1&&e.remove(o)}),this._attachedPortal=n,t}attachDomPortal=n=>{let e=n.element;e.parentNode;let t=this.outletElement.ownerDocument.createComment("dom-portal");e.parentNode.insertBefore(t,e),this.outletElement.appendChild(e),this._attachedPortal=n,super.setDisposeFn(()=>{t.parentNode&&t.parentNode.replaceChild(e,t)})};dispose(){super.dispose(),this.outletElement.remove()}_getComponentRootNode(n){return n.hostView.rootNodes[0]}};var Yt=(()=>{class i extends Wt{_moduleRef=s(lo,{optional:!0});_document=s(S);_viewContainerRef=s(dt);_isInitialized=!1;_attachedRef=null;constructor(){super()}get portal(){return this._attachedPortal}set portal(e){this.hasAttached()&&!e&&!this._isInitialized||(this.hasAttached()&&super.detach(),e&&super.attach(e),this._attachedPortal=e||null)}attached=new j;get attachedRef(){return this._attachedRef}ngOnInit(){this._isInitialized=!0}ngOnDestroy(){super.dispose(),this._attachedRef=this._attachedPortal=null}attachComponentPortal(e){e.setAttachedHost(this);let t=e.viewContainerRef!=null?e.viewContainerRef:this._viewContainerRef,o=t.createComponent(e.component,{index:t.length,injector:e.injector||t.injector,projectableNodes:e.projectableNodes||void 0,ngModuleRef:this._moduleRef||void 0,bindings:e.bindings||void 0});return t!==this._viewContainerRef&&this._getRootNode().appendChild(o.hostView.rootNodes[0]),super.setDisposeFn(()=>o.destroy()),this._attachedPortal=e,this._attachedRef=o,this.attached.emit(o),o}attachTemplatePortal(e){e.setAttachedHost(this);let t=this._viewContainerRef.createEmbeddedView(e.templateRef,e.context,{injector:e.injector});return super.setDisposeFn(()=>this._viewContainerRef.clear()),this._attachedPortal=e,this._attachedRef=t,this.attached.emit(t),t}attachDomPortal=e=>{let t=e.element;t.parentNode;let o=this._document.createComment("dom-portal");e.setAttachedHost(this),t.parentNode.insertBefore(o,t),this._getRootNode().appendChild(t),this._attachedPortal=e,super.setDisposeFn(()=>{o.parentNode&&o.parentNode.replaceChild(t,o)})};_getRootNode(){let e=this._viewContainerRef.element.nativeElement;return e.nodeType===e.ELEMENT_NODE?e:e.parentNode}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["","cdkPortalOutlet",""]],inputs:{portal:[0,"cdkPortalOutlet","portal"]},outputs:{attached:"attached"},exportAs:["cdkPortalOutlet"],features:[ce]})}return i})(),Ot=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({})}return i})();var xd=Zo();function Qn(i){return new fr(i.get(bt),i.get(S))}var fr=class{_viewportRuler;_previousHTMLStyles={top:"",left:""};_previousScrollPosition;_isEnabled=!1;_document;constructor(n,e){this._viewportRuler=n,this._document=e}attach(){}enable(){if(this._canBeEnabled()){let n=this._document.documentElement;this._previousScrollPosition=this._viewportRuler.getViewportScrollPosition(),this._previousHTMLStyles.left=n.style.left||"",this._previousHTMLStyles.top=n.style.top||"",n.style.left=be(-this._previousScrollPosition.left),n.style.top=be(-this._previousScrollPosition.top),n.classList.add("cdk-global-scrollblock"),this._isEnabled=!0}}disable(){if(this._isEnabled){let n=this._document.documentElement,e=this._document.body,t=n.style,o=e.style,r=t.scrollBehavior||"",a=o.scrollBehavior||"";this._isEnabled=!1,t.left=this._previousHTMLStyles.left,t.top=this._previousHTMLStyles.top,n.classList.remove("cdk-global-scrollblock"),xd&&(t.scrollBehavior=o.scrollBehavior="auto"),window.scroll(this._previousScrollPosition.left,this._previousScrollPosition.top),xd&&(t.scrollBehavior=r,o.scrollBehavior=a)}}_canBeEnabled(){if(this._document.documentElement.classList.contains("cdk-global-scrollblock")||this._isEnabled)return!1;let e=this._document.documentElement,t=this._viewportRuler.getViewportSize();return e.scrollHeight>t.height||e.scrollWidth>t.width}};function Id(i,n){return new gr(i.get(_n),i.get(I),i.get(bt),n)}var gr=class{_scrollDispatcher;_ngZone;_viewportRuler;_config;_scrollSubscription=null;_overlayRef;_initialScrollPosition;constructor(n,e,t,o){this._scrollDispatcher=n,this._ngZone=e,this._viewportRuler=t,this._config=o}attach(n){this._overlayRef,this._overlayRef=n}enable(){if(this._scrollSubscription)return;let n=this._scrollDispatcher.scrolled(0).pipe(pe(e=>!e||!this._overlayRef.overlayElement.contains(e.getElementRef().nativeElement)));this._config&&this._config.threshold&&this._config.threshold>1?(this._initialScrollPosition=this._viewportRuler.getViewportScrollPosition().top,this._scrollSubscription=n.subscribe(()=>{let e=this._viewportRuler.getViewportScrollPosition().top;Math.abs(e-this._initialScrollPosition)>this._config.threshold?this._detach():this._overlayRef.updatePosition()})):this._scrollSubscription=n.subscribe(this._detach)}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}_detach=()=>{this.disable(),this._overlayRef.hasAttached()&&this._ngZone.run(()=>this._overlayRef.detach())}};var Gi=class{enable(){}disable(){}attach(){}};function Wa(i,n){return n.some(e=>{let t=i.bottom<e.top,o=i.top>e.bottom,r=i.right<e.left,a=i.left>e.right;return t||o||r||a})}function wd(i,n){return n.some(e=>{let t=i.top<e.top,o=i.bottom>e.bottom,r=i.left<e.left,a=i.right>e.right;return t||o||r||a})}function Ft(i,n){return new _r(i.get(_n),i.get(bt),i.get(I),n)}var _r=class{_scrollDispatcher;_viewportRuler;_ngZone;_config;_scrollSubscription=null;_overlayRef;constructor(n,e,t,o){this._scrollDispatcher=n,this._viewportRuler=e,this._ngZone=t,this._config=o}attach(n){this._overlayRef,this._overlayRef=n}enable(){if(!this._scrollSubscription){let n=this._config?this._config.scrollThrottle:0;this._scrollSubscription=this._scrollDispatcher.scrolled(n).subscribe(()=>{if(this._overlayRef.updatePosition(),this._config&&this._config.autoClose){let e=this._overlayRef.overlayElement.getBoundingClientRect(),{width:t,height:o}=this._viewportRuler.getViewportSize();Wa(e,[{width:t,height:o,bottom:o,right:t,top:0,left:0}])&&(this.disable(),this._ngZone.run(()=>this._overlayRef.detach()))}})}}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}},kd=(()=>{class i{_injector=s(O);constructor(){}noop=()=>new Gi;close=e=>Id(this._injector,e);block=()=>Qn(this._injector);reposition=e=>Ft(this._injector,e);static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),_t=class{positionStrategy;scrollStrategy=new Gi;panelClass="";hasBackdrop=!1;backdropClass="cdk-overlay-dark-backdrop";disableAnimations;width;height;minWidth;minHeight;maxWidth;maxHeight;direction;disposeOnNavigation=!1;usePopover;eventPredicate;constructor(n){if(n){let e=Object.keys(n);for(let t of e)n[t]!==void 0&&(this[t]=n[t])}}};var vr=class{connectionPair;scrollableViewProperties;constructor(n,e){this.connectionPair=n,this.scrollableViewProperties=e}};var Td=(()=>{class i{_attachedOverlays=[];_document=s(S);_isAttached=!1;constructor(){}ngOnDestroy(){this.detach()}add(e){this.remove(e),this._attachedOverlays.push(e)}remove(e){let t=this._attachedOverlays.indexOf(e);t>-1&&this._attachedOverlays.splice(t,1),this._attachedOverlays.length===0&&this.detach()}canReceiveEvent(e,t,o){return o.observers.length<1?!1:e.eventPredicate?e.eventPredicate(t):!0}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Od=(()=>{class i extends Td{_ngZone=s(I);_renderer=s(Te).createRenderer(null,null);_cleanupKeydown;add(e){super.add(e),this._isAttached||(this._ngZone.runOutsideAngular(()=>{this._cleanupKeydown=this._renderer.listen("body","keydown",this._keydownListener)}),this._isAttached=!0)}detach(){this._isAttached&&(this._cleanupKeydown?.(),this._isAttached=!1)}_keydownListener=e=>{let t=this._attachedOverlays;for(let o=t.length-1;o>-1;o--){let r=t[o];if(this.canReceiveEvent(r,e,r._keydownEvents)){this._ngZone.run(()=>r._keydownEvents.next(e));break}}};static \u0275fac=(()=>{let e;return function(o){return(e||(e=et(i)))(o||i)}})();static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Fd=(()=>{class i extends Td{_platform=s(H);_ngZone=s(I);_renderer=s(Te).createRenderer(null,null);_cursorOriginalValue;_cursorStyleIsSet=!1;_pointerDownEventTarget=null;_cleanups;add(e){if(super.add(e),!this._isAttached){let t=this._document.body,o={capture:!0},r=this._renderer;this._cleanups=this._ngZone.runOutsideAngular(()=>[r.listen(t,"pointerdown",this._pointerDownListener,o),r.listen(t,"click",this._clickListener,o),r.listen(t,"auxclick",this._clickListener,o),r.listen(t,"contextmenu",this._clickListener,o)]),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=t.style.cursor,t.style.cursor="pointer",this._cursorStyleIsSet=!0),this._isAttached=!0}}detach(){this._isAttached&&(this._cleanups?.forEach(e=>e()),this._cleanups=void 0,this._platform.IOS&&this._cursorStyleIsSet&&(this._document.body.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=!1),this._isAttached=!1)}_pointerDownListener=e=>{this._pointerDownEventTarget=Ee(e)};_clickListener=e=>{let t=Ee(e),o=e.type==="click"&&this._pointerDownEventTarget?this._pointerDownEventTarget:t;this._pointerDownEventTarget=null;let r=this._attachedOverlays.slice();for(let a=r.length-1;a>-1;a--){let l=r[a],c=l._outsidePointerEvents;if(!(!l.hasAttached()||!this.canReceiveEvent(l,e,c))){if(Dd(l.overlayElement,t)||Dd(l.overlayElement,o))break;this._ngZone?this._ngZone.run(()=>c.next(e)):c.next(e)}}};static \u0275fac=(()=>{let e;return function(o){return(e||(e=et(i)))(o||i)}})();static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Dd(i,n){let e=typeof ShadowRoot<"u"&&ShadowRoot,t=n;for(;t;){if(t===i)return!0;t=e&&t instanceof ShadowRoot?t.host:t.parentNode}return!1}var Rd=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["ng-component"]],hostAttrs:["cdk-overlay-style-loader",""],decls:0,vars:0,template:function(t,o){},styles:[`.cdk-overlay-container, .cdk-global-overlay-wrapper {
  pointer-events: none;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.cdk-overlay-container {
  position: fixed;
}
@layer cdk-overlay {
  .cdk-overlay-container {
    z-index: 1000;
  }
}
.cdk-overlay-container:empty {
  display: none;
}

.cdk-global-overlay-wrapper {
  display: flex;
  position: absolute;
}
@layer cdk-overlay {
  .cdk-global-overlay-wrapper {
    z-index: 1000;
  }
}

.cdk-overlay-pane {
  position: absolute;
  pointer-events: auto;
  box-sizing: border-box;
  display: flex;
  max-width: 100%;
  max-height: 100%;
}
@layer cdk-overlay {
  .cdk-overlay-pane {
    z-index: 1000;
  }
}

.cdk-overlay-backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  opacity: 0;
  touch-action: manipulation;
}
@layer cdk-overlay {
  .cdk-overlay-backdrop {
    z-index: 1000;
    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}
@media (prefers-reduced-motion) {
  .cdk-overlay-backdrop {
    transition-duration: 1ms;
  }
}

.cdk-overlay-backdrop-showing {
  opacity: 1;
}
@media (forced-colors: active) {
  .cdk-overlay-backdrop-showing {
    opacity: 0.6;
  }
}

@layer cdk-overlay {
  .cdk-overlay-dark-backdrop {
    background: rgba(0, 0, 0, 0.32);
  }
}

.cdk-overlay-transparent-backdrop {
  transition: visibility 1ms linear, opacity 1ms linear;
  visibility: hidden;
  opacity: 1;
}
.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {
  opacity: 0;
  visibility: visible;
}

.cdk-overlay-backdrop-noop-animation {
  transition: none;
}

.cdk-overlay-connected-position-bounding-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width: 1px;
  min-height: 1px;
}
@layer cdk-overlay {
  .cdk-overlay-connected-position-bounding-box {
    z-index: 1000;
  }
}

.cdk-global-scrollblock {
  position: fixed;
  width: 100%;
  overflow-y: scroll;
}

.cdk-overlay-popover {
  background: none;
  border: none;
  padding: 0;
  outline: 0;
  overflow: visible;
  position: fixed;
  pointer-events: none;
  white-space: normal;
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
  inset: auto;
  top: 0;
  left: 0;
}
.cdk-overlay-popover::backdrop {
  display: none;
}
.cdk-overlay-popover .cdk-overlay-backdrop {
  position: fixed;
  z-index: auto;
}
`],encapsulation:2,changeDetection:0})}return i})(),Cr=(()=>{class i{_platform=s(H);_containerElement;_document=s(S);_styleLoader=s(Le);constructor(){}ngOnDestroy(){this._containerElement?.remove()}getContainerElement(){return this._loadStyles(),this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let e="cdk-overlay-container";if(this._platform.isBrowser||Aa()){let o=this._document.querySelectorAll(`.${e}[platform="server"], .${e}[platform="test"]`);for(let r=0;r<o.length;r++)o[r].remove()}let t=this._document.createElement("div");t.classList.add(e),Aa()?t.setAttribute("platform","test"):this._platform.isBrowser||t.setAttribute("platform","server"),this._document.body.appendChild(t),this._containerElement=t}_loadStyles(){this._styleLoader.load(Rd)}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Ya=class{_renderer;_ngZone;element;_cleanupClick;_cleanupTransitionEnd;_fallbackTimeout;constructor(n,e,t,o){this._renderer=e,this._ngZone=t,this.element=n.createElement("div"),this.element.classList.add("cdk-overlay-backdrop"),this._cleanupClick=e.listen(this.element,"click",o)}detach(){this._ngZone.runOutsideAngular(()=>{let n=this.element;clearTimeout(this._fallbackTimeout),this._cleanupTransitionEnd?.(),this._cleanupTransitionEnd=this._renderer.listen(n,"transitionend",this.dispose),this._fallbackTimeout=setTimeout(this.dispose,500),n.style.pointerEvents="none",n.classList.remove("cdk-overlay-backdrop-showing")})}dispose=()=>{clearTimeout(this._fallbackTimeout),this._cleanupClick?.(),this._cleanupTransitionEnd?.(),this._cleanupClick=this._cleanupTransitionEnd=this._fallbackTimeout=void 0,this.element.remove()}};function Xa(i){return i&&i.nodeType===1}var Kn=class{_portalOutlet;_host;_pane;_config;_ngZone;_keyboardDispatcher;_document;_location;_outsideClickDispatcher;_animationsDisabled;_injector;_renderer;_backdropClick=new y;_attachments=new y;_detachments=new y;_positionStrategy;_scrollStrategy;_locationChanges=Ae.EMPTY;_backdropRef=null;_detachContentMutationObserver;_detachContentAfterRenderRef;_disposed=!1;_previousHostParent;_keydownEvents=new y;_outsidePointerEvents=new y;_afterNextRenderRef;constructor(n,e,t,o,r,a,l,c,p,f=!1,v,F){this._portalOutlet=n,this._host=e,this._pane=t,this._config=o,this._ngZone=r,this._keyboardDispatcher=a,this._document=l,this._location=c,this._outsideClickDispatcher=p,this._animationsDisabled=f,this._injector=v,this._renderer=F,o.scrollStrategy&&(this._scrollStrategy=o.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=o.positionStrategy}get overlayElement(){return this._pane}get backdropElement(){return this._backdropRef?.element||null}get hostElement(){return this._host}get eventPredicate(){return this._config?.eventPredicate||null}attach(n){if(this._disposed)return null;this._attachHost();let e=this._portalOutlet.attach(n);return this._positionStrategy?.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=Me(()=>{this.hasAttached()&&this.updatePosition()},{injector:this._injector}),this._togglePointerEvents(!0),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!0),this._attachments.next(),this._completeDetachContent(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation&&(this._locationChanges=this._location.subscribe(()=>this.dispose())),this._outsideClickDispatcher.add(this),typeof e?.onDestroy=="function"&&e.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()))}),e}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(!1),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let n=this._portalOutlet.detach();return this._detachments.next(),this._completeDetachContent(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges.unsubscribe(),this._outsideClickDispatcher.remove(this),n}dispose(){if(this._disposed)return;let n=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._backdropRef?.dispose(),this._locationChanges.unsubscribe(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=this._backdropRef=null,n&&this._detachments.next(),this._detachments.complete(),this._completeDetachContent(),this._disposed=!0}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply()}updatePositionStrategy(n){n!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=n,this.hasAttached()&&(n.attach(this),this.updatePosition()))}updateSize(n){this._config=C(C({},this._config),n),this._updateElementSize()}setDirection(n){this._config=we(C({},this._config),{direction:n}),this._updateElementDirection()}addPanelClass(n){this._pane&&this._toggleClasses(this._pane,n,!0)}removePanelClass(n){this._pane&&this._toggleClasses(this._pane,n,!1)}getDirection(){let n=this._config.direction;return n?typeof n=="string"?n:n.value:"ltr"}updateScrollStrategy(n){n!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=n,this.hasAttached()&&(n.attach(this),n.enable()))}_updateElementDirection(){this._host.setAttribute("dir",this.getDirection())}_updateElementSize(){if(!this._pane)return;let n=this._pane.style;n.width=be(this._config.width),n.height=be(this._config.height),n.minWidth=be(this._config.minWidth),n.minHeight=be(this._config.minHeight),n.maxWidth=be(this._config.maxWidth),n.maxHeight=be(this._config.maxHeight)}_togglePointerEvents(n){this._pane.style.pointerEvents=n?"":"none"}_attachHost(){if(!this._host.parentElement){let n=this._config.usePopover?this._positionStrategy?.getPopoverInsertionPoint?.():null;Xa(n)?n.after(this._host):n?.type==="parent"?n.element.appendChild(this._host):this._previousHostParent?.appendChild(this._host)}if(this._config.usePopover)try{this._host.showPopover()}catch{}}_attachBackdrop(){let n="cdk-overlay-backdrop-showing";this._backdropRef?.dispose(),this._backdropRef=new Ya(this._document,this._renderer,this._ngZone,e=>{this._backdropClick.next(e)}),this._animationsDisabled&&this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation"),this._config.backdropClass&&this._toggleClasses(this._backdropRef.element,this._config.backdropClass,!0),this._config.usePopover?this._host.prepend(this._backdropRef.element):this._host.parentElement.insertBefore(this._backdropRef.element,this._host),!this._animationsDisabled&&typeof requestAnimationFrame<"u"?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>this._backdropRef?.element.classList.add(n))}):this._backdropRef.element.classList.add(n)}_updateStackingOrder(){!this._config.usePopover&&this._host.nextSibling&&this._host.parentNode.appendChild(this._host)}detachBackdrop(){this._animationsDisabled?(this._backdropRef?.dispose(),this._backdropRef=null):this._backdropRef?.detach()}_toggleClasses(n,e,t){let o=Mt(e||[]).filter(r=>!!r);o.length&&(t?n.classList.add(...o):n.classList.remove(...o))}_detachContentWhenEmpty(){let n=!1;try{this._detachContentAfterRenderRef=Me(()=>{n=!0,this._detachContent()},{injector:this._injector})}catch(e){if(n)throw e;this._detachContent()}globalThis.MutationObserver&&this._pane&&(this._detachContentMutationObserver||=new globalThis.MutationObserver(()=>{this._detachContent()}),this._detachContentMutationObserver.observe(this._pane,{childList:!0}))}_detachContent(){(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!1),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),this._completeDetachContent())}_completeDetachContent(){this._detachContentAfterRenderRef?.destroy(),this._detachContentAfterRenderRef=void 0,this._detachContentMutationObserver?.disconnect()}_disposeScrollStrategy(){let n=this._scrollStrategy;n?.disable(),n?.detach?.()}},Ed="cdk-overlay-connected-position-bounding-box",Np=/([A-Za-z%]+)$/;function bn(i,n){return new br(n,i.get(bt),i.get(S),i.get(H),i.get(Cr))}var br=class{_viewportRuler;_document;_platform;_overlayContainer;_overlayRef;_isInitialRender=!1;_lastBoundingBoxSize={width:0,height:0};_isPushed=!1;_canPush=!0;_growAfterOpen=!1;_hasFlexibleDimensions=!0;_positionLocked=!1;_originRect;_overlayRect;_viewportRect;_containerRect;_viewportMargin=0;_scrollables=[];_preferredPositions=[];_origin;_pane;_isDisposed=!1;_boundingBox=null;_lastPosition=null;_lastScrollVisibility=null;_positionChanges=new y;_resizeSubscription=Ae.EMPTY;_offsetX=0;_offsetY=0;_transformOriginSelector;_appliedPanelClasses=[];_previousPushAmount=null;_popoverLocation="global";positionChanges=this._positionChanges;get positions(){return this._preferredPositions}constructor(n,e,t,o,r){this._viewportRuler=e,this._document=t,this._platform=o,this._overlayContainer=r,this.setOrigin(n)}attach(n){this._overlayRef&&this._overlayRef,this._validatePositions(),n.hostElement.classList.add(Ed),this._overlayRef=n,this._boundingBox=n.hostElement,this._pane=n.overlayElement,this._isDisposed=!1,this._isInitialRender=!0,this._lastPosition=null,this._resizeSubscription.unsubscribe(),this._resizeSubscription=this._viewportRuler.change().subscribe(()=>{this._isInitialRender=!0,this.apply()})}apply(){if(this._isDisposed||!this._platform.isBrowser)return;if(!this._isInitialRender&&this._positionLocked&&this._lastPosition){this.reapplyLastPosition();return}this._clearPanelClasses(),this._resetOverlayElementStyles(),this._resetBoundingBoxStyles(),this._viewportRect=this._getNarrowedViewportRect(),this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._containerRect=this._getContainerRect();let n=this._originRect,e=this._overlayRect,t=this._viewportRect,o=this._containerRect,r=[],a;for(let l of this._preferredPositions){let c=this._getOriginPoint(n,o,l),p=this._getOverlayPoint(c,e,l),f=this._getOverlayFit(p,e,t,l);if(f.isCompletelyWithinViewport){this._isPushed=!1,this._applyPosition(l,c);return}if(this._canFitWithFlexibleDimensions(f,p,t)){r.push({position:l,origin:c,overlayRect:e,boundingBoxRect:this._calculateBoundingBoxRect(c,l)});continue}(!a||a.overlayFit.visibleArea<f.visibleArea)&&(a={overlayFit:f,overlayPoint:p,originPoint:c,position:l,overlayRect:e})}if(r.length){let l=null,c=-1;for(let p of r){let f=p.boundingBoxRect.width*p.boundingBoxRect.height*(p.position.weight||1);f>c&&(c=f,l=p)}this._isPushed=!1,this._applyPosition(l.position,l.origin);return}if(this._canPush){this._isPushed=!0,this._applyPosition(a.position,a.originPoint);return}this._applyPosition(a.position,a.originPoint)}detach(){this._clearPanelClasses(),this._lastPosition=null,this._previousPushAmount=null,this._resizeSubscription.unsubscribe()}dispose(){this._isDisposed||(this._boundingBox&&vn(this._boundingBox.style,{top:"",left:"",right:"",bottom:"",height:"",width:"",alignItems:"",justifyContent:""}),this._pane&&this._resetOverlayElementStyles(),this._overlayRef&&this._overlayRef.hostElement.classList.remove(Ed),this.detach(),this._positionChanges.complete(),this._overlayRef=this._boundingBox=null,this._isDisposed=!0)}reapplyLastPosition(){if(this._isDisposed||!this._platform.isBrowser)return;let n=this._lastPosition;n?(this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._viewportRect=this._getNarrowedViewportRect(),this._containerRect=this._getContainerRect(),this._applyPosition(n,this._getOriginPoint(this._originRect,this._containerRect,n))):this.apply()}withScrollableContainers(n){return this._scrollables=n,this}withPositions(n){return this._preferredPositions=n,n.indexOf(this._lastPosition)===-1&&(this._lastPosition=null),this._validatePositions(),this}withViewportMargin(n){return this._viewportMargin=n,this}withFlexibleDimensions(n=!0){return this._hasFlexibleDimensions=n,this}withGrowAfterOpen(n=!0){return this._growAfterOpen=n,this}withPush(n=!0){return this._canPush=n,this}withLockedPosition(n=!0){return this._positionLocked=n,this}setOrigin(n){return this._origin=n,this}withDefaultOffsetX(n){return this._offsetX=n,this}withDefaultOffsetY(n){return this._offsetY=n,this}withTransformOriginOn(n){return this._transformOriginSelector=n,this}withPopoverLocation(n){return this._popoverLocation=n,this}getPopoverInsertionPoint(){return this._popoverLocation==="global"?null:this._popoverLocation!=="inline"?this._popoverLocation:this._origin instanceof A?this._origin.nativeElement:Xa(this._origin)?this._origin:null}_getOriginPoint(n,e,t){let o;if(t.originX=="center")o=n.left+n.width/2;else{let a=this._isRtl()?n.right:n.left,l=this._isRtl()?n.left:n.right;o=t.originX=="start"?a:l}e.left<0&&(o-=e.left);let r;return t.originY=="center"?r=n.top+n.height/2:r=t.originY=="top"?n.top:n.bottom,e.top<0&&(r-=e.top),{x:o,y:r}}_getOverlayPoint(n,e,t){let o;t.overlayX=="center"?o=-e.width/2:t.overlayX==="start"?o=this._isRtl()?-e.width:0:o=this._isRtl()?0:-e.width;let r;return t.overlayY=="center"?r=-e.height/2:r=t.overlayY=="top"?0:-e.height,{x:n.x+o,y:n.y+r}}_getOverlayFit(n,e,t,o){let r=Ad(e),{x:a,y:l}=n,c=this._getOffset(o,"x"),p=this._getOffset(o,"y");c&&(a+=c),p&&(l+=p);let f=0-a,v=a+r.width-t.width,F=0-l,q=l+r.height-t.height,Y=this._subtractOverflows(r.width,f,v),J=this._subtractOverflows(r.height,F,q),G=Y*J;return{visibleArea:G,isCompletelyWithinViewport:r.width*r.height===G,fitsInViewportVertically:J===r.height,fitsInViewportHorizontally:Y==r.width}}_canFitWithFlexibleDimensions(n,e,t){if(this._hasFlexibleDimensions){let o=t.bottom-e.y,r=t.right-e.x,a=Sd(this._overlayRef.getConfig().minHeight),l=Sd(this._overlayRef.getConfig().minWidth),c=n.fitsInViewportVertically||a!=null&&a<=o,p=n.fitsInViewportHorizontally||l!=null&&l<=r;return c&&p}return!1}_pushOverlayOnScreen(n,e,t){if(this._previousPushAmount&&this._positionLocked)return{x:n.x+this._previousPushAmount.x,y:n.y+this._previousPushAmount.y};let o=Ad(e),r=this._viewportRect,a=Math.max(n.x+o.width-r.width,0),l=Math.max(n.y+o.height-r.height,0),c=Math.max(r.top-t.top-n.y,0),p=Math.max(r.left-t.left-n.x,0),f=0,v=0;return o.width<=r.width?f=p||-a:f=n.x<this._getViewportMarginStart()?r.left-t.left-n.x:0,o.height<=r.height?v=c||-l:v=n.y<this._getViewportMarginTop()?r.top-t.top-n.y:0,this._previousPushAmount={x:f,y:v},{x:n.x+f,y:n.y+v}}_applyPosition(n,e){if(this._setTransformOrigin(n),this._setOverlayElementStyles(e,n),this._setBoundingBoxStyles(e,n),n.panelClass&&this._addPanelClasses(n.panelClass),this._positionChanges.observers.length){let t=this._getScrollVisibility();if(n!==this._lastPosition||!this._lastScrollVisibility||!Bp(this._lastScrollVisibility,t)){let o=new vr(n,t);this._positionChanges.next(o)}this._lastScrollVisibility=t}this._lastPosition=n,this._isInitialRender=!1}_setTransformOrigin(n){if(!this._transformOriginSelector)return;let e=this._boundingBox.querySelectorAll(this._transformOriginSelector),t,o=n.overlayY;n.overlayX==="center"?t="center":this._isRtl()?t=n.overlayX==="start"?"right":"left":t=n.overlayX==="start"?"left":"right";for(let r=0;r<e.length;r++)e[r].style.transformOrigin=`${t} ${o}`}_calculateBoundingBoxRect(n,e){let t=this._viewportRect,o=this._isRtl(),r,a,l;if(e.overlayY==="top")a=n.y,r=t.height-a+this._getViewportMarginBottom();else if(e.overlayY==="bottom")l=t.height-n.y+this._getViewportMarginTop()+this._getViewportMarginBottom(),r=t.height-l+this._getViewportMarginTop();else{let q=Math.min(t.bottom-n.y+t.top,n.y),Y=this._lastBoundingBoxSize.height;r=q*2,a=n.y-q,r>Y&&!this._isInitialRender&&!this._growAfterOpen&&(a=n.y-Y/2)}let c=e.overlayX==="start"&&!o||e.overlayX==="end"&&o,p=e.overlayX==="end"&&!o||e.overlayX==="start"&&o,f,v,F;if(p)F=t.width-n.x+this._getViewportMarginStart()+this._getViewportMarginEnd(),f=n.x-this._getViewportMarginStart();else if(c)v=n.x,f=t.right-n.x-this._getViewportMarginEnd();else{let q=Math.min(t.right-n.x+t.left,n.x),Y=this._lastBoundingBoxSize.width;f=q*2,v=n.x-q,f>Y&&!this._isInitialRender&&!this._growAfterOpen&&(v=n.x-Y/2)}return{top:a,left:v,bottom:l,right:F,width:f,height:r}}_setBoundingBoxStyles(n,e){let t=this._calculateBoundingBoxRect(n,e);!this._isInitialRender&&!this._growAfterOpen&&(t.height=Math.min(t.height,this._lastBoundingBoxSize.height),t.width=Math.min(t.width,this._lastBoundingBoxSize.width));let o={};if(this._hasExactPosition())o.top=o.left="0",o.bottom=o.right="auto",o.maxHeight=o.maxWidth="",o.width=o.height="100%";else{let r=this._overlayRef.getConfig().maxHeight,a=this._overlayRef.getConfig().maxWidth;o.width=be(t.width),o.height=be(t.height),o.top=be(t.top)||"auto",o.bottom=be(t.bottom)||"auto",o.left=be(t.left)||"auto",o.right=be(t.right)||"auto",e.overlayX==="center"?o.alignItems="center":o.alignItems=e.overlayX==="end"?"flex-end":"flex-start",e.overlayY==="center"?o.justifyContent="center":o.justifyContent=e.overlayY==="bottom"?"flex-end":"flex-start",r&&(o.maxHeight=be(r)),a&&(o.maxWidth=be(a))}this._lastBoundingBoxSize=t,vn(this._boundingBox.style,o)}_resetBoundingBoxStyles(){vn(this._boundingBox.style,{top:"0",left:"0",right:"0",bottom:"0",height:"",width:"",alignItems:"",justifyContent:""})}_resetOverlayElementStyles(){vn(this._pane.style,{top:"",left:"",bottom:"",right:"",position:"",transform:""})}_setOverlayElementStyles(n,e){let t={},o=this._hasExactPosition(),r=this._hasFlexibleDimensions,a=this._overlayRef.getConfig();if(o){let f=this._viewportRuler.getViewportScrollPosition();vn(t,this._getExactOverlayY(e,n,f)),vn(t,this._getExactOverlayX(e,n,f))}else t.position="static";let l="",c=this._getOffset(e,"x"),p=this._getOffset(e,"y");c&&(l+=`translateX(${c}px) `),p&&(l+=`translateY(${p}px)`),t.transform=l.trim(),a.maxHeight&&(o?t.maxHeight=be(a.maxHeight):r&&(t.maxHeight="")),a.maxWidth&&(o?t.maxWidth=be(a.maxWidth):r&&(t.maxWidth="")),vn(this._pane.style,t)}_getExactOverlayY(n,e,t){let o={top:"",bottom:""},r=this._getOverlayPoint(e,this._overlayRect,n);if(this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,t)),n.overlayY==="bottom"){let a=this._document.documentElement.clientHeight;o.bottom=`${a-(r.y+this._overlayRect.height)}px`}else o.top=be(r.y);return o}_getExactOverlayX(n,e,t){let o={left:"",right:""},r=this._getOverlayPoint(e,this._overlayRect,n);this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,t));let a;if(this._isRtl()?a=n.overlayX==="end"?"left":"right":a=n.overlayX==="end"?"right":"left",a==="right"){let l=this._document.documentElement.clientWidth;o.right=`${l-(r.x+this._overlayRect.width)}px`}else o.left=be(r.x);return o}_getScrollVisibility(){let n=this._getOriginRect(),e=this._pane.getBoundingClientRect(),t=this._scrollables.map(o=>o.getElementRef().nativeElement.getBoundingClientRect());return{isOriginClipped:wd(n,t),isOriginOutsideView:Wa(n,t),isOverlayClipped:wd(e,t),isOverlayOutsideView:Wa(e,t)}}_subtractOverflows(n,...e){return e.reduce((t,o)=>t-Math.max(o,0),n)}_getNarrowedViewportRect(){let n=this._document.documentElement.clientWidth,e=this._document.documentElement.clientHeight,t=this._viewportRuler.getViewportScrollPosition();return{top:t.top+this._getViewportMarginTop(),left:t.left+this._getViewportMarginStart(),right:t.left+n-this._getViewportMarginEnd(),bottom:t.top+e-this._getViewportMarginBottom(),width:n-this._getViewportMarginStart()-this._getViewportMarginEnd(),height:e-this._getViewportMarginTop()-this._getViewportMarginBottom()}}_isRtl(){return this._overlayRef.getDirection()==="rtl"}_hasExactPosition(){return!this._hasFlexibleDimensions||this._isPushed}_getOffset(n,e){return e==="x"?n.offsetX==null?this._offsetX:n.offsetX:n.offsetY==null?this._offsetY:n.offsetY}_validatePositions(){}_addPanelClasses(n){this._pane&&Mt(n).forEach(e=>{e!==""&&this._appliedPanelClasses.indexOf(e)===-1&&(this._appliedPanelClasses.push(e),this._pane.classList.add(e))})}_clearPanelClasses(){this._pane&&(this._appliedPanelClasses.forEach(n=>{this._pane.classList.remove(n)}),this._appliedPanelClasses=[])}_getViewportMarginStart(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.start??0}_getViewportMarginEnd(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.end??0}_getViewportMarginTop(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.top??0}_getViewportMarginBottom(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.bottom??0}_getOriginRect(){let n=this._origin;if(n instanceof A)return n.nativeElement.getBoundingClientRect();if(n instanceof Element)return n.getBoundingClientRect();let e=n.width||0,t=n.height||0;return{top:n.y,bottom:n.y+t,left:n.x,right:n.x+e,height:t,width:e}}_getContainerRect(){let n=this._overlayRef.getConfig().usePopover&&this._popoverLocation!=="global",e=this._overlayContainer.getContainerElement();n&&(e.style.display="block");let t=e.getBoundingClientRect();return n&&(e.style.display=""),t}};function vn(i,n){for(let e in n)n.hasOwnProperty(e)&&(i[e]=n[e]);return i}function Sd(i){if(typeof i!="number"&&i!=null){let[n,e]=i.split(Np);return!e||e==="px"?parseFloat(n):null}return i||null}function Ad(i){return{top:Math.floor(i.top),right:Math.floor(i.right),bottom:Math.floor(i.bottom),left:Math.floor(i.left),width:Math.floor(i.width),height:Math.floor(i.height)}}function Bp(i,n){return i===n?!0:i.isOriginClipped===n.isOriginClipped&&i.isOriginOutsideView===n.isOriginOutsideView&&i.isOverlayClipped===n.isOverlayClipped&&i.isOverlayOutsideView===n.isOverlayOutsideView}var Md="cdk-global-overlay-wrapper";function Xt(i){return new yr}var yr=class{_overlayRef;_cssPosition="static";_topOffset="";_bottomOffset="";_alignItems="";_xPosition="";_xOffset="";_width="";_height="";_isDisposed=!1;attach(n){let e=n.getConfig();this._overlayRef=n,this._width&&!e.width&&n.updateSize({width:this._width}),this._height&&!e.height&&n.updateSize({height:this._height}),n.hostElement.classList.add(Md),this._isDisposed=!1}top(n=""){return this._bottomOffset="",this._topOffset=n,this._alignItems="flex-start",this}left(n=""){return this._xOffset=n,this._xPosition="left",this}bottom(n=""){return this._topOffset="",this._bottomOffset=n,this._alignItems="flex-end",this}right(n=""){return this._xOffset=n,this._xPosition="right",this}start(n=""){return this._xOffset=n,this._xPosition="start",this}end(n=""){return this._xOffset=n,this._xPosition="end",this}width(n=""){return this._overlayRef?this._overlayRef.updateSize({width:n}):this._width=n,this}height(n=""){return this._overlayRef?this._overlayRef.updateSize({height:n}):this._height=n,this}centerHorizontally(n=""){return this.left(n),this._xPosition="center",this}centerVertically(n=""){return this.top(n),this._alignItems="center",this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let n=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement.style,t=this._overlayRef.getConfig(),{width:o,height:r,maxWidth:a,maxHeight:l}=t,c=(o==="100%"||o==="100vw")&&(!a||a==="100%"||a==="100vw"),p=(r==="100%"||r==="100vh")&&(!l||l==="100%"||l==="100vh"),f=this._xPosition,v=this._xOffset,F=this._overlayRef.getConfig().direction==="rtl",q="",Y="",J="";c?J="flex-start":f==="center"?(J="center",F?Y=v:q=v):F?f==="left"||f==="end"?(J="flex-end",q=v):(f==="right"||f==="start")&&(J="flex-start",Y=v):f==="left"||f==="start"?(J="flex-start",q=v):(f==="right"||f==="end")&&(J="flex-end",Y=v),n.position=this._cssPosition,n.marginLeft=c?"0":q,n.marginTop=p?"0":this._topOffset,n.marginBottom=this._bottomOffset,n.marginRight=c?"0":Y,e.justifyContent=J,e.alignItems=p?"flex-start":this._alignItems}dispose(){if(this._isDisposed||!this._overlayRef)return;let n=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement,t=e.style;e.classList.remove(Md),t.justifyContent=t.alignItems=n.marginTop=n.marginBottom=n.marginLeft=n.marginRight=n.position="",this._overlayRef=null,this._isDisposed=!0}},Pd=(()=>{class i{_injector=s(O);constructor(){}global(){return Xt()}flexibleConnectedTo(e){return bn(this._injector,e)}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Wi=new g("OVERLAY_DEFAULT_CONFIG");function vt(i,n){i.get(Le).load(Rd);let e=i.get(Cr),t=i.get(S),o=i.get(me),r=i.get(on),a=i.get(ke),l=i.get(re,null,{optional:!0})||i.get(Te).createRenderer(null,null),c=new _t(n),p=i.get(Wi,null,{optional:!0})?.usePopover??!0;c.direction=c.direction||a.value,"showPopover"in t.body?c.usePopover=n?.usePopover??p:c.usePopover=!1;let f=t.createElement("div"),v=t.createElement("div");f.id=o.getId("cdk-overlay-"),f.classList.add("cdk-overlay-pane"),v.appendChild(f),c.usePopover&&(v.setAttribute("popover","manual"),v.classList.add("cdk-overlay-popover"));let F=c.usePopover?c.positionStrategy?.getPopoverInsertionPoint?.():null;return Xa(F)?F.after(v):F?.type==="parent"?F.element.appendChild(v):e.getContainerElement().appendChild(v),new Kn(new pr(f,r,i),v,f,c,i.get(I),i.get(Od),t,i.get(_o),i.get(Fd),n?.disableAnimations??i.get(En,null,{optional:!0})==="NoopAnimations",i.get(lt),l)}var Ld=(()=>{class i{scrollStrategies=s(kd);_positionBuilder=s(Pd);_injector=s(O);constructor(){}create(e){return vt(this._injector,e)}position(){return this._positionBuilder}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Vp=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"}],jp=new g("cdk-connected-overlay-scroll-strategy",{providedIn:"root",factory:()=>{let i=s(O);return()=>Ft(i)}}),Zn=(()=>{class i{elementRef=s(A);constructor(){}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["","cdk-overlay-origin",""],["","overlay-origin",""],["","cdkOverlayOrigin",""]],exportAs:["cdkOverlayOrigin"]})}return i})(),Nd=new g("cdk-connected-overlay-default-config"),xr=(()=>{class i{_dir=s(ke,{optional:!0});_injector=s(O);_overlayRef;_templatePortal;_backdropSubscription=Ae.EMPTY;_attachSubscription=Ae.EMPTY;_detachSubscription=Ae.EMPTY;_positionSubscription=Ae.EMPTY;_offsetX;_offsetY;_position;_scrollStrategyFactory=s(jp);_ngZone=s(I);origin;positions;positionStrategy;get offsetX(){return this._offsetX}set offsetX(e){this._offsetX=e,this._position&&this._updatePositionStrategy(this._position)}get offsetY(){return this._offsetY}set offsetY(e){this._offsetY=e,this._position&&this._updatePositionStrategy(this._position)}width;height;minWidth;minHeight;backdropClass;panelClass;viewportMargin=0;scrollStrategy;open=!1;disableClose=!1;transformOriginSelector;hasBackdrop=!1;lockPosition=!1;flexibleDimensions=!1;growAfterOpen=!1;push=!1;disposeOnNavigation=!1;usePopover;matchWidth=!1;set _config(e){typeof e!="string"&&this._assignConfig(e)}backdropClick=new j;positionChange=new j;attach=new j;detach=new j;overlayKeydown=new j;overlayOutsideClick=new j;constructor(){let e=s(ct),t=s(dt),o=s(Nd,{optional:!0}),r=s(Wi,{optional:!0});this.usePopover=r?.usePopover===!1?null:"global",this._templatePortal=new gt(e,t),this.scrollStrategy=this._scrollStrategyFactory(),o&&this._assignConfig(o)}get overlayRef(){return this._overlayRef}get dir(){return this._dir?this._dir.value:"ltr"}ngOnDestroy(){this._attachSubscription.unsubscribe(),this._detachSubscription.unsubscribe(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this._overlayRef?.dispose()}ngOnChanges(e){this._position&&(this._updatePositionStrategy(this._position),this._overlayRef?.updateSize({width:this._getWidth(),minWidth:this.minWidth,height:this.height,minHeight:this.minHeight}),e.origin&&this.open&&this._position.apply()),e.open&&(this.open?this.attachOverlay():this.detachOverlay())}_createOverlay(){(!this.positions||!this.positions.length)&&(this.positions=Vp);let e=this._overlayRef=vt(this._injector,this._buildConfig());this._attachSubscription=e.attachments().subscribe(()=>this.attach.emit()),this._detachSubscription=e.detachments().subscribe(()=>this.detach.emit()),e.keydownEvents().subscribe(t=>{this.overlayKeydown.next(t),t.keyCode===27&&!this.disableClose&&!xe(t)&&(t.preventDefault(),this.detachOverlay())}),this._overlayRef.outsidePointerEvents().subscribe(t=>{let o=this._getOriginElement(),r=Ee(t);(!o||o!==r&&!o.contains(r))&&this.overlayOutsideClick.next(t)})}_buildConfig(){let e=this._position=this.positionStrategy||this._createPositionStrategy(),t=new _t({direction:this._dir||"ltr",positionStrategy:e,scrollStrategy:this.scrollStrategy,hasBackdrop:this.hasBackdrop,disposeOnNavigation:this.disposeOnNavigation,usePopover:!!this.usePopover});return(this.height||this.height===0)&&(t.height=this.height),(this.minWidth||this.minWidth===0)&&(t.minWidth=this.minWidth),(this.minHeight||this.minHeight===0)&&(t.minHeight=this.minHeight),this.backdropClass&&(t.backdropClass=this.backdropClass),this.panelClass&&(t.panelClass=this.panelClass),t}_updatePositionStrategy(e){let t=this.positions.map(o=>({originX:o.originX,originY:o.originY,overlayX:o.overlayX,overlayY:o.overlayY,offsetX:o.offsetX||this.offsetX,offsetY:o.offsetY||this.offsetY,panelClass:o.panelClass||void 0}));return e.setOrigin(this._getOrigin()).withPositions(t).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector).withPopoverLocation(this.usePopover===null?"global":this.usePopover)}_createPositionStrategy(){let e=bn(this._injector,this._getOrigin());return this._updatePositionStrategy(e),e}_getOrigin(){return this.origin instanceof Zn?this.origin.elementRef:this.origin}_getOriginElement(){return this.origin instanceof Zn?this.origin.elementRef.nativeElement:this.origin instanceof A?this.origin.nativeElement:typeof Element<"u"&&this.origin instanceof Element?this.origin:null}_getWidth(){return this.width?this.width:this.matchWidth?this._getOriginElement()?.getBoundingClientRect?.().width:void 0}attachOverlay(){this._overlayRef||this._createOverlay();let e=this._overlayRef;e.getConfig().hasBackdrop=this.hasBackdrop,e.updateSize({width:this._getWidth()}),e.hasAttached()||e.attach(this._templatePortal),this.hasBackdrop?this._backdropSubscription=e.backdropClick().subscribe(t=>this.backdropClick.emit(t)):this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.positionChange.observers.length>0&&(this._positionSubscription=this._position.positionChanges.pipe(Cs(()=>this.positionChange.observers.length>0)).subscribe(t=>{this._ngZone.run(()=>this.positionChange.emit(t)),this.positionChange.observers.length===0&&this._positionSubscription.unsubscribe()})),this.open=!0}detachOverlay(){this._overlayRef?.detach(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.open=!1}_assignConfig(e){this.origin=e.origin??this.origin,this.positions=e.positions??this.positions,this.positionStrategy=e.positionStrategy??this.positionStrategy,this.offsetX=e.offsetX??this.offsetX,this.offsetY=e.offsetY??this.offsetY,this.width=e.width??this.width,this.height=e.height??this.height,this.minWidth=e.minWidth??this.minWidth,this.minHeight=e.minHeight??this.minHeight,this.backdropClass=e.backdropClass??this.backdropClass,this.panelClass=e.panelClass??this.panelClass,this.viewportMargin=e.viewportMargin??this.viewportMargin,this.scrollStrategy=e.scrollStrategy??this.scrollStrategy,this.disableClose=e.disableClose??this.disableClose,this.transformOriginSelector=e.transformOriginSelector??this.transformOriginSelector,this.hasBackdrop=e.hasBackdrop??this.hasBackdrop,this.lockPosition=e.lockPosition??this.lockPosition,this.flexibleDimensions=e.flexibleDimensions??this.flexibleDimensions,this.growAfterOpen=e.growAfterOpen??this.growAfterOpen,this.push=e.push??this.push,this.disposeOnNavigation=e.disposeOnNavigation??this.disposeOnNavigation,this.usePopover=e.usePopover??this.usePopover,this.matchWidth=e.matchWidth??this.matchWidth}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["","cdk-connected-overlay",""],["","connected-overlay",""],["","cdkConnectedOverlay",""]],inputs:{origin:[0,"cdkConnectedOverlayOrigin","origin"],positions:[0,"cdkConnectedOverlayPositions","positions"],positionStrategy:[0,"cdkConnectedOverlayPositionStrategy","positionStrategy"],offsetX:[0,"cdkConnectedOverlayOffsetX","offsetX"],offsetY:[0,"cdkConnectedOverlayOffsetY","offsetY"],width:[0,"cdkConnectedOverlayWidth","width"],height:[0,"cdkConnectedOverlayHeight","height"],minWidth:[0,"cdkConnectedOverlayMinWidth","minWidth"],minHeight:[0,"cdkConnectedOverlayMinHeight","minHeight"],backdropClass:[0,"cdkConnectedOverlayBackdropClass","backdropClass"],panelClass:[0,"cdkConnectedOverlayPanelClass","panelClass"],viewportMargin:[0,"cdkConnectedOverlayViewportMargin","viewportMargin"],scrollStrategy:[0,"cdkConnectedOverlayScrollStrategy","scrollStrategy"],open:[0,"cdkConnectedOverlayOpen","open"],disableClose:[0,"cdkConnectedOverlayDisableClose","disableClose"],transformOriginSelector:[0,"cdkConnectedOverlayTransformOriginOn","transformOriginSelector"],hasBackdrop:[2,"cdkConnectedOverlayHasBackdrop","hasBackdrop",U],lockPosition:[2,"cdkConnectedOverlayLockPosition","lockPosition",U],flexibleDimensions:[2,"cdkConnectedOverlayFlexibleDimensions","flexibleDimensions",U],growAfterOpen:[2,"cdkConnectedOverlayGrowAfterOpen","growAfterOpen",U],push:[2,"cdkConnectedOverlayPush","push",U],disposeOnNavigation:[2,"cdkConnectedOverlayDisposeOnNavigation","disposeOnNavigation",U],usePopover:[0,"cdkConnectedOverlayUsePopover","usePopover"],matchWidth:[2,"cdkConnectedOverlayMatchWidth","matchWidth",U],_config:[0,"cdkConnectedOverlay","_config"]},outputs:{backdropClick:"backdropClick",positionChange:"positionChange",attach:"attach",detach:"detach",overlayKeydown:"overlayKeydown",overlayOutsideClick:"overlayOutsideClick"},exportAs:["cdkConnectedOverlay"],features:[ve]})}return i})(),Ke=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({providers:[Ld],imports:[z,Ot,$a,$a]})}return i})();var qa=class{_box;_destroyed=new y;_resizeSubject=new y;_resizeObserver;_elementObservables=new Map;constructor(n){this._box=n,typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(e=>this._resizeSubject.next(e)))}observe(n){return this._elementObservables.has(n)||this._elementObservables.set(n,new st(e=>{let t=this._resizeSubject.subscribe(e);return this._resizeObserver?.observe(n,{box:this._box}),()=>{this._resizeObserver?.unobserve(n),t.unsubscribe(),this._elementObservables.delete(n)}}).pipe(pe(e=>e.some(t=>t.target===n)),zr({bufferSize:1,refCount:!0}),le(this._destroyed))),this._elementObservables.get(n)}destroy(){this._destroyed.next(),this._destroyed.complete(),this._resizeSubject.complete(),this._elementObservables.clear()}},Bd=(()=>{class i{_cleanupErrorListener;_observers=new Map;_ngZone=s(I);constructor(){typeof ResizeObserver<"u"}ngOnDestroy(){for(let[,e]of this._observers)e.destroy();this._observers.clear(),this._cleanupErrorListener?.()}observe(e,t){let o=t?.box||"content-box";return this._observers.has(o)||this._observers.set(o,new qa(o)),this._observers.get(o).observe(e)}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var zp=["notch"],Up=["matFormFieldNotchedOutline",""],Hp=["*"],Vd=["iconPrefixContainer"],jd=["textPrefixContainer"],zd=["iconSuffixContainer"],Ud=["textSuffixContainer"],$p=["textField"],Gp=["*",[["mat-label"]],[["","matPrefix",""],["","matIconPrefix",""]],[["","matTextPrefix",""]],[["","matTextSuffix",""]],[["","matSuffix",""],["","matIconSuffix",""]],[["mat-error"],["","matError",""]],[["mat-hint",3,"align","end"]],[["mat-hint","align","end"]]],Wp=["*","mat-label","[matPrefix], [matIconPrefix]","[matTextPrefix]","[matTextSuffix]","[matSuffix], [matIconSuffix]","mat-error, [matError]","mat-hint:not([align='end'])","mat-hint[align='end']"];function Yp(i,n){i&1&&de(0,"span",21)}function Xp(i,n){if(i&1&&(d(0,"label",20),$(1,1),B(2,Yp,1,0,"span",21),u()),i&2){let e=b(2);L("floating",e._shouldLabelFloat())("monitorResize",e._hasOutline())("id",e._labelId),W("for",e._control.disableAutomaticLabeling?null:e._control.id),m(2),V(!e.hideRequiredMarker&&e._control.required?2:-1)}}function qp(i,n){if(i&1&&B(0,Xp,3,5,"label",20),i&2){let e=b();V(e._hasFloatingLabel()?0:-1)}}function Kp(i,n){i&1&&de(0,"div",7)}function Zp(i,n){}function Qp(i,n){if(i&1&&Re(0,Zp,0,0,"ng-template",13),i&2){b(2);let e=nt(1);L("ngTemplateOutlet",e)}}function Jp(i,n){if(i&1&&(d(0,"div",9),B(1,Qp,1,1,null,13),u()),i&2){let e=b();L("matFormFieldNotchedOutlineOpen",e._shouldLabelFloat()),m(),V(e._forceDisplayInfixLabel()?-1:1)}}function ef(i,n){i&1&&(d(0,"div",10,2),$(2,2),u())}function tf(i,n){i&1&&(d(0,"div",11,3),$(2,3),u())}function nf(i,n){}function of(i,n){if(i&1&&Re(0,nf,0,0,"ng-template",13),i&2){b();let e=nt(1);L("ngTemplateOutlet",e)}}function rf(i,n){i&1&&(d(0,"div",14,4),$(2,4),u())}function af(i,n){i&1&&(d(0,"div",15,5),$(2,5),u())}function sf(i,n){i&1&&de(0,"div",16)}function lf(i,n){i&1&&(d(0,"div",18),$(1,6),u())}function cf(i,n){if(i&1&&(d(0,"mat-hint",22),h(1),u()),i&2){let e=b(2);L("id",e._hintLabelId),m(),ae(e.hintLabel)}}function df(i,n){if(i&1&&(d(0,"div",19),B(1,cf,2,2,"mat-hint",22),$(2,7),de(3,"div",23),$(4,8),u()),i&2){let e=b();m(),V(e.hintLabel?1:-1)}}var yn=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["mat-label"]]})}return i})(),Ka=new g("MatError"),Za=(()=>{class i{id=s(me).getId("mat-mdc-error-");constructor(){}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["mat-error"],["","matError",""]],hostAttrs:[1,"mat-mdc-form-field-error","mat-mdc-form-field-bottom-align"],hostVars:1,hostBindings:function(t,o){t&2&&Ge("id",o.id)},inputs:{id:"id"},features:[ge([{provide:Ka,useExisting:i}])]})}return i})(),Yi=(()=>{class i{align="start";id=s(me).getId("mat-mdc-hint-");static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["mat-hint"]],hostAttrs:[1,"mat-mdc-form-field-hint","mat-mdc-form-field-bottom-align"],hostVars:4,hostBindings:function(t,o){t&2&&(Ge("id",o.id),W("align",null),M("mat-mdc-form-field-hint-end",o.align==="end"))},inputs:{align:"align",id:"id"}})}return i})(),qd=new g("MatPrefix");var Qa=new g("MatSuffix"),Ja=(()=>{class i{set _isTextSelector(e){this._isText=!0}_isText=!1;static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["","matSuffix",""],["","matIconSuffix",""],["","matTextSuffix",""]],inputs:{_isTextSelector:[0,"matTextSuffix","_isTextSelector"]},features:[ge([{provide:Qa,useExisting:i}])]})}return i})(),Kd=new g("FloatingLabelParent"),Hd=(()=>{class i{_elementRef=s(A);get floating(){return this._floating}set floating(e){this._floating=e,this.monitorResize&&this._handleResize()}_floating=!1;get monitorResize(){return this._monitorResize}set monitorResize(e){this._monitorResize=e,this._monitorResize?this._subscribeToResize():this._resizeSubscription.unsubscribe()}_monitorResize=!1;_resizeObserver=s(Bd);_ngZone=s(I);_parent=s(Kd);_resizeSubscription=new Ae;constructor(){}ngOnDestroy(){this._resizeSubscription.unsubscribe()}getWidth(){return uf(this._elementRef.nativeElement)}get element(){return this._elementRef.nativeElement}_handleResize(){setTimeout(()=>this._parent._handleLabelResized())}_subscribeToResize(){this._resizeSubscription.unsubscribe(),this._ngZone.runOutsideAngular(()=>{this._resizeSubscription=this._resizeObserver.observe(this._elementRef.nativeElement,{box:"border-box"}).subscribe(()=>this._handleResize())})}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["label","matFormFieldFloatingLabel",""]],hostAttrs:[1,"mdc-floating-label","mat-mdc-floating-label"],hostVars:2,hostBindings:function(t,o){t&2&&M("mdc-floating-label--float-above",o.floating)},inputs:{floating:"floating",monitorResize:"monitorResize"}})}return i})();function uf(i){let n=i;if(n.offsetParent!==null)return n.scrollWidth;let e=n.cloneNode(!0);e.style.setProperty("position","absolute"),e.style.setProperty("transform","translate(-9999px, -9999px)"),document.documentElement.appendChild(e);let t=e.scrollWidth;return e.remove(),t}var $d="mdc-line-ripple--active",wr="mdc-line-ripple--deactivating",Gd=(()=>{class i{_elementRef=s(A);_cleanupTransitionEnd;constructor(){let e=s(I),t=s(re);e.runOutsideAngular(()=>{this._cleanupTransitionEnd=t.listen(this._elementRef.nativeElement,"transitionend",this._handleTransitionEnd)})}activate(){let e=this._elementRef.nativeElement.classList;e.remove(wr),e.add($d)}deactivate(){this._elementRef.nativeElement.classList.add(wr)}_handleTransitionEnd=e=>{let t=this._elementRef.nativeElement.classList,o=t.contains(wr);e.propertyName==="opacity"&&o&&t.remove($d,wr)};ngOnDestroy(){this._cleanupTransitionEnd()}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["div","matFormFieldLineRipple",""]],hostAttrs:[1,"mdc-line-ripple"]})}return i})(),Wd=(()=>{class i{_elementRef=s(A);_ngZone=s(I);open=!1;_notch;ngAfterViewInit(){let e=this._elementRef.nativeElement,t=e.querySelector(".mdc-floating-label");t?(e.classList.add("mdc-notched-outline--upgraded"),typeof requestAnimationFrame=="function"&&(t.style.transitionDuration="0s",this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>t.style.transitionDuration="")}))):e.classList.add("mdc-notched-outline--no-label")}_setNotchWidth(e){let t=this._notch.nativeElement;!this.open||!e?t.style.width="":t.style.width=`calc(${e}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`}_setMaxWidth(e){this._notch.nativeElement.style.setProperty("--mat-form-field-notch-max-width",`calc(100% - ${e}px)`)}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["div","matFormFieldNotchedOutline",""]],viewQuery:function(t,o){if(t&1&&fe(zp,5),t&2){let r;R(r=P())&&(o._notch=r.first)}},hostAttrs:[1,"mdc-notched-outline"],hostVars:2,hostBindings:function(t,o){t&2&&M("mdc-notched-outline--notched",o.open)},inputs:{open:[0,"matFormFieldNotchedOutlineOpen","open"]},attrs:Up,ngContentSelectors:Hp,decls:5,vars:0,consts:[["notch",""],[1,"mat-mdc-notch-piece","mdc-notched-outline__leading"],[1,"mat-mdc-notch-piece","mdc-notched-outline__notch"],[1,"mat-mdc-notch-piece","mdc-notched-outline__trailing"]],template:function(t,o){t&1&&(_e(),Be(0,"div",1),Ie(1,"div",2,0),$(3),Oe(),Be(4,"div",3))},encapsulation:2,changeDetection:0})}return i})(),qt=(()=>{class i{value=null;stateChanges;id;placeholder;ngControl=null;focused=!1;empty=!1;shouldLabelFloat=!1;required=!1;disabled=!1;errorState=!1;controlType;autofilled;userAriaDescribedBy;disableAutomaticLabeling;describedByIds;static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i})}return i})();var Kt=new g("MatFormField"),Zd=new g("MAT_FORM_FIELD_DEFAULT_OPTIONS"),Yd="fill",mf="auto",Xd="fixed",hf="translateY(-50%)",Jn=(()=>{class i{_elementRef=s(A);_changeDetectorRef=s(ue);_platform=s(H);_idGenerator=s(me);_ngZone=s(I);_defaults=s(Zd,{optional:!0});_currentDirection;_textField;_iconPrefixContainer;_textPrefixContainer;_iconSuffixContainer;_textSuffixContainer;_floatingLabel;_notchedOutline;_lineRipple;_iconPrefixContainerSignal=di("iconPrefixContainer");_textPrefixContainerSignal=di("textPrefixContainer");_iconSuffixContainerSignal=di("iconSuffixContainer");_textSuffixContainerSignal=di("textSuffixContainer");_prefixSuffixContainers=ye(()=>[this._iconPrefixContainerSignal(),this._textPrefixContainerSignal(),this._iconSuffixContainerSignal(),this._textSuffixContainerSignal()].map(e=>e?.nativeElement).filter(e=>e!==void 0));_formFieldControl;_prefixChildren;_suffixChildren;_errorChildren;_hintChildren;_labelChild=Js(yn);get hideRequiredMarker(){return this._hideRequiredMarker}set hideRequiredMarker(e){this._hideRequiredMarker=It(e)}_hideRequiredMarker=!1;color="primary";get floatLabel(){return this._floatLabel||this._defaults?.floatLabel||mf}set floatLabel(e){e!==this._floatLabel&&(this._floatLabel=e,this._changeDetectorRef.markForCheck())}_floatLabel;get appearance(){return this._appearanceSignal()}set appearance(e){let t=e||this._defaults?.appearance||Yd;this._appearanceSignal.set(t)}_appearanceSignal=Q(Yd);get subscriptSizing(){return this._subscriptSizing||this._defaults?.subscriptSizing||Xd}set subscriptSizing(e){this._subscriptSizing=e||this._defaults?.subscriptSizing||Xd}_subscriptSizing=null;get hintLabel(){return this._hintLabel}set hintLabel(e){this._hintLabel=e,this._processHints()}_hintLabel="";_hasIconPrefix=!1;_hasTextPrefix=!1;_hasIconSuffix=!1;_hasTextSuffix=!1;_labelId=this._idGenerator.getId("mat-mdc-form-field-label-");_hintLabelId=this._idGenerator.getId("mat-mdc-hint-");_describedByIds;get _control(){return this._explicitFormFieldControl||this._formFieldControl}set _control(e){this._explicitFormFieldControl=e}_destroyed=new y;_isFocused=null;_explicitFormFieldControl;_previousControl=null;_previousControlValidatorFn=null;_stateChanges;_valueChanges;_describedByChanges;_outlineLabelOffsetResizeObserver=null;_animationsDisabled=he();constructor(){let e=this._defaults,t=s(ke);e&&(e.appearance&&(this.appearance=e.appearance),this._hideRequiredMarker=!!e?.hideRequiredMarker,e.color&&(this.color=e.color)),tn(()=>this._currentDirection=t.valueSignal()),this._syncOutlineLabelOffset()}ngAfterViewInit(){this._updateFocusState(),this._animationsDisabled||this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._elementRef.nativeElement.classList.add("mat-form-field-animations-enabled")},300)}),this._changeDetectorRef.detectChanges()}ngAfterContentInit(){this._assertFormFieldControl(),this._initializeSubscript(),this._initializePrefixAndSuffix()}ngAfterContentChecked(){this._assertFormFieldControl(),this._control!==this._previousControl&&(this._initializeControl(this._previousControl),this._control.ngControl&&this._control.ngControl.control&&(this._previousControlValidatorFn=this._control.ngControl.control.validator),this._previousControl=this._control),this._control.ngControl&&this._control.ngControl.control&&this._control.ngControl.control.validator!==this._previousControlValidatorFn&&this._changeDetectorRef.markForCheck()}ngOnDestroy(){this._outlineLabelOffsetResizeObserver?.disconnect(),this._stateChanges?.unsubscribe(),this._valueChanges?.unsubscribe(),this._describedByChanges?.unsubscribe(),this._destroyed.next(),this._destroyed.complete()}getLabelId=ye(()=>this._hasFloatingLabel()?this._labelId:null);getConnectedOverlayOrigin(){return this._textField||this._elementRef}_animateAndLockLabel(){this._hasFloatingLabel()&&(this.floatLabel="always")}_initializeControl(e){let t=this._control,o="mat-mdc-form-field-type-";e&&this._elementRef.nativeElement.classList.remove(o+e.controlType),t.controlType&&this._elementRef.nativeElement.classList.add(o+t.controlType),this._stateChanges?.unsubscribe(),this._stateChanges=t.stateChanges.subscribe(()=>{this._updateFocusState(),this._changeDetectorRef.markForCheck()}),this._describedByChanges?.unsubscribe(),this._describedByChanges=t.stateChanges.pipe(ze([void 0,void 0]),ee(()=>[t.errorState,t.userAriaDescribedBy]),jr(),pe(([[r,a],[l,c]])=>r!==l||a!==c)).subscribe(()=>this._syncDescribedByIds()),this._valueChanges?.unsubscribe(),t.ngControl&&t.ngControl.valueChanges&&(this._valueChanges=t.ngControl.valueChanges.pipe(le(this._destroyed)).subscribe(()=>this._changeDetectorRef.markForCheck()))}_checkPrefixAndSuffixTypes(){this._hasIconPrefix=!!this._prefixChildren.find(e=>!e._isText),this._hasTextPrefix=!!this._prefixChildren.find(e=>e._isText),this._hasIconSuffix=!!this._suffixChildren.find(e=>!e._isText),this._hasTextSuffix=!!this._suffixChildren.find(e=>e._isText)}_initializePrefixAndSuffix(){this._checkPrefixAndSuffixTypes(),Ze(this._prefixChildren.changes,this._suffixChildren.changes).subscribe(()=>{this._checkPrefixAndSuffixTypes(),this._changeDetectorRef.markForCheck()})}_initializeSubscript(){this._hintChildren.changes.subscribe(()=>{this._processHints(),this._changeDetectorRef.markForCheck()}),this._errorChildren.changes.subscribe(()=>{this._syncDescribedByIds(),this._changeDetectorRef.markForCheck()}),this._validateHints(),this._syncDescribedByIds()}_assertFormFieldControl(){this._control}_updateFocusState(){let e=this._control.focused;e&&!this._isFocused?(this._isFocused=!0,this._lineRipple?.activate()):!e&&(this._isFocused||this._isFocused===null)&&(this._isFocused=!1,this._lineRipple?.deactivate()),this._elementRef.nativeElement.classList.toggle("mat-focused",e),this._textField?.nativeElement.classList.toggle("mdc-text-field--focused",e)}_syncOutlineLabelOffset(){tl({earlyRead:()=>{if(this._appearanceSignal()!=="outline")return this._outlineLabelOffsetResizeObserver?.disconnect(),null;if(globalThis.ResizeObserver){this._outlineLabelOffsetResizeObserver||=new globalThis.ResizeObserver(()=>{this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset())});for(let e of this._prefixSuffixContainers())this._outlineLabelOffsetResizeObserver.observe(e,{box:"border-box"})}return this._getOutlinedLabelOffset()},write:e=>this._writeOutlinedLabelStyles(e())})}_shouldAlwaysFloat(){return this.floatLabel==="always"}_hasOutline(){return this.appearance==="outline"}_forceDisplayInfixLabel(){return!this._platform.isBrowser&&this._prefixChildren.length&&!this._shouldLabelFloat()}_hasFloatingLabel=ye(()=>!!this._labelChild());_shouldLabelFloat(){return this._hasFloatingLabel()?this._control.shouldLabelFloat||this._shouldAlwaysFloat():!1}_shouldForward(e){let t=this._control?this._control.ngControl:null;return t&&t[e]}_getSubscriptMessageType(){return this._errorChildren&&this._errorChildren.length>0&&this._control.errorState?"error":"hint"}_handleLabelResized(){this._refreshOutlineNotchWidth()}_refreshOutlineNotchWidth(){!this._hasOutline()||!this._floatingLabel||!this._shouldLabelFloat()?this._notchedOutline?._setNotchWidth(0):this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth())}_processHints(){this._validateHints(),this._syncDescribedByIds()}_validateHints(){this._hintChildren}_syncDescribedByIds(){if(this._control){let e=[];if(this._control.userAriaDescribedBy&&typeof this._control.userAriaDescribedBy=="string"&&e.push(...this._control.userAriaDescribedBy.split(" ")),this._getSubscriptMessageType()==="hint"){let r=this._hintChildren?this._hintChildren.find(l=>l.align==="start"):null,a=this._hintChildren?this._hintChildren.find(l=>l.align==="end"):null;r?e.push(r.id):this._hintLabel&&e.push(this._hintLabelId),a&&e.push(a.id)}else this._errorChildren&&e.push(...this._errorChildren.map(r=>r.id));let t=this._control.describedByIds,o;if(t){let r=this._describedByIds||e;o=e.concat(t.filter(a=>a&&!r.includes(a)))}else o=e;this._control.setDescribedByIds(o),this._describedByIds=e}}_getOutlinedLabelOffset(){if(!this._hasOutline()||!this._floatingLabel)return null;if(!this._iconPrefixContainer&&!this._textPrefixContainer)return["",null];if(!this._isAttachedToDom())return null;let e=this._iconPrefixContainer?.nativeElement,t=this._textPrefixContainer?.nativeElement,o=this._iconSuffixContainer?.nativeElement,r=this._textSuffixContainer?.nativeElement,a=e?.getBoundingClientRect().width??0,l=t?.getBoundingClientRect().width??0,c=o?.getBoundingClientRect().width??0,p=r?.getBoundingClientRect().width??0,f=this._currentDirection==="rtl"?"-1":"1",v=`${a+l}px`,q=`calc(${f} * (${v} + var(--mat-mdc-form-field-label-offset-x, 0px)))`,Y=`var(--mat-mdc-form-field-label-transform, ${hf} translateX(${q}))`,J=a+l+c+p;return[Y,J]}_writeOutlinedLabelStyles(e){if(e!==null){let[t,o]=e;this._floatingLabel&&(this._floatingLabel.element.style.transform=t),o!==null&&this._notchedOutline?._setMaxWidth(o)}}_isAttachedToDom(){let e=this._elementRef.nativeElement;if(e.getRootNode){let t=e.getRootNode();return t&&t!==e}return document.documentElement.contains(e)}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-form-field"]],contentQueries:function(t,o,r){if(t&1&&(Ws(r,o._labelChild,yn,5),wt(r,qt,5)(r,qd,5)(r,Qa,5)(r,Ka,5)(r,Yi,5)),t&2){$r();let a;R(a=P())&&(o._formFieldControl=a.first),R(a=P())&&(o._prefixChildren=a),R(a=P())&&(o._suffixChildren=a),R(a=P())&&(o._errorChildren=a),R(a=P())&&(o._hintChildren=a)}},viewQuery:function(t,o){if(t&1&&(Ys(o._iconPrefixContainerSignal,Vd,5)(o._textPrefixContainerSignal,jd,5)(o._iconSuffixContainerSignal,zd,5)(o._textSuffixContainerSignal,Ud,5),fe($p,5)(Vd,5)(jd,5)(zd,5)(Ud,5)(Hd,5)(Wd,5)(Gd,5)),t&2){$r(4);let r;R(r=P())&&(o._textField=r.first),R(r=P())&&(o._iconPrefixContainer=r.first),R(r=P())&&(o._textPrefixContainer=r.first),R(r=P())&&(o._iconSuffixContainer=r.first),R(r=P())&&(o._textSuffixContainer=r.first),R(r=P())&&(o._floatingLabel=r.first),R(r=P())&&(o._notchedOutline=r.first),R(r=P())&&(o._lineRipple=r.first)}},hostAttrs:[1,"mat-mdc-form-field"],hostVars:38,hostBindings:function(t,o){t&2&&M("mat-mdc-form-field-label-always-float",o._shouldAlwaysFloat())("mat-mdc-form-field-has-icon-prefix",o._hasIconPrefix)("mat-mdc-form-field-has-icon-suffix",o._hasIconSuffix)("mat-form-field-invalid",o._control.errorState)("mat-form-field-disabled",o._control.disabled)("mat-form-field-autofilled",o._control.autofilled)("mat-form-field-appearance-fill",o.appearance=="fill")("mat-form-field-appearance-outline",o.appearance=="outline")("mat-form-field-hide-placeholder",o._hasFloatingLabel()&&!o._shouldLabelFloat())("mat-primary",o.color!=="accent"&&o.color!=="warn")("mat-accent",o.color==="accent")("mat-warn",o.color==="warn")("ng-untouched",o._shouldForward("untouched"))("ng-touched",o._shouldForward("touched"))("ng-pristine",o._shouldForward("pristine"))("ng-dirty",o._shouldForward("dirty"))("ng-valid",o._shouldForward("valid"))("ng-invalid",o._shouldForward("invalid"))("ng-pending",o._shouldForward("pending"))},inputs:{hideRequiredMarker:"hideRequiredMarker",color:"color",floatLabel:"floatLabel",appearance:"appearance",subscriptSizing:"subscriptSizing",hintLabel:"hintLabel"},exportAs:["matFormField"],features:[ge([{provide:Kt,useExisting:i},{provide:Kd,useExisting:i}])],ngContentSelectors:Wp,decls:18,vars:21,consts:[["labelTemplate",""],["textField",""],["iconPrefixContainer",""],["textPrefixContainer",""],["textSuffixContainer",""],["iconSuffixContainer",""],[1,"mat-mdc-text-field-wrapper","mdc-text-field",3,"click"],[1,"mat-mdc-form-field-focus-overlay"],[1,"mat-mdc-form-field-flex"],["matFormFieldNotchedOutline","",3,"matFormFieldNotchedOutlineOpen"],[1,"mat-mdc-form-field-icon-prefix"],[1,"mat-mdc-form-field-text-prefix"],[1,"mat-mdc-form-field-infix"],[3,"ngTemplateOutlet"],[1,"mat-mdc-form-field-text-suffix"],[1,"mat-mdc-form-field-icon-suffix"],["matFormFieldLineRipple",""],["aria-atomic","true","aria-live","polite",1,"mat-mdc-form-field-subscript-wrapper","mat-mdc-form-field-bottom-align"],[1,"mat-mdc-form-field-error-wrapper"],[1,"mat-mdc-form-field-hint-wrapper"],["matFormFieldFloatingLabel","",3,"floating","monitorResize","id"],["aria-hidden","true",1,"mat-mdc-form-field-required-marker","mdc-floating-label--required"],[3,"id"],[1,"mat-mdc-form-field-hint-spacer"]],template:function(t,o){if(t&1&&(_e(Gp),Re(0,qp,1,1,"ng-template",null,0,jt),d(2,"div",6,1),T("click",function(a){return o._control.onContainerClick(a)}),B(4,Kp,1,0,"div",7),d(5,"div",8),B(6,Jp,2,2,"div",9),B(7,ef,3,0,"div",10),B(8,tf,3,0,"div",11),d(9,"div",12),B(10,of,1,1,null,13),$(11),u(),B(12,rf,3,0,"div",14),B(13,af,3,0,"div",15),u(),B(14,sf,1,0,"div",16),u(),d(15,"div",17),B(16,lf,2,0,"div",18)(17,df,5,1,"div",19),u()),t&2){let r;m(2),M("mdc-text-field--filled",!o._hasOutline())("mdc-text-field--outlined",o._hasOutline())("mdc-text-field--no-label",!o._hasFloatingLabel())("mdc-text-field--disabled",o._control.disabled)("mdc-text-field--invalid",o._control.errorState),m(2),V(!o._hasOutline()&&!o._control.disabled?4:-1),m(2),V(o._hasOutline()?6:-1),m(),V(o._hasIconPrefix?7:-1),m(),V(o._hasTextPrefix?8:-1),m(2),V(!o._hasOutline()||o._forceDisplayInfixLabel()?10:-1),m(2),V(o._hasTextSuffix?12:-1),m(),V(o._hasIconSuffix?13:-1),m(),V(o._hasOutline()?-1:14),m(),M("mat-mdc-form-field-subscript-dynamic-size",o.subscriptSizing==="dynamic");let a=o._getSubscriptMessageType();m(),V((r=a)==="error"?16:r==="hint"?17:-1)}},dependencies:[Hd,Wd,gi,Gd,Yi],styles:[`.mdc-text-field {
  display: inline-flex;
  align-items: baseline;
  padding: 0 16px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  will-change: opacity, transform, color;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.mdc-text-field__input {
  width: 100%;
  min-width: 0;
  border: none;
  border-radius: 0;
  background: none;
  padding: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  height: 28px;
}
.mdc-text-field__input::-webkit-calendar-picker-indicator, .mdc-text-field__input::-webkit-search-cancel-button {
  display: none;
}
.mdc-text-field__input::-ms-clear {
  display: none;
}
.mdc-text-field__input:focus {
  outline: none;
}
.mdc-text-field__input:invalid {
  box-shadow: none;
}
.mdc-text-field__input::placeholder {
  opacity: 0;
}
.mdc-text-field__input::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field__input::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field__input:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mdc-text-field--focused .mdc-text-field__input::placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  opacity: 1;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder {
  opacity: 0;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input {
  height: 100%;
}
.mdc-text-field--outlined .mdc-text-field__input {
  display: flex;
  border: none !important;
  background-color: transparent;
}
.mdc-text-field--disabled .mdc-text-field__input {
  pointer-events: auto;
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--mat-form-field-filled-input-text-color, var(--mat-sys-on-surface));
  caret-color: var(--mat-form-field-filled-caret-color, var(--mat-sys-primary));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--mat-form-field-outlined-input-text-color, var(--mat-sys-on-surface));
  caret-color: var(--mat-form-field-outlined-caret-color, var(--mat-sys-primary));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--mat-form-field-filled-error-caret-color, var(--mat-sys-error));
}
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--mat-form-field-outlined-error-caret-color, var(--mat-sys-error));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-text-field__input {
    background-color: Window;
  }
}

.mdc-text-field--filled {
  height: 56px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));
  border-top-right-radius: var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) {
  background-color: var(--mat-form-field-filled-container-color, var(--mat-sys-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled {
  background-color: var(--mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent));
}

.mdc-text-field--outlined {
  height: 56px;
  overflow: visible;
  padding-right: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));
  padding-left: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);
}
[dir=rtl] .mdc-text-field--outlined {
  padding-right: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);
  padding-left: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));
}

.mdc-floating-label {
  position: absolute;
  left: 0;
  transform-origin: left top;
  line-height: 1.15rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
  overflow: hidden;
  will-change: transform;
}
[dir=rtl] .mdc-floating-label {
  right: 0;
  left: auto;
  transform-origin: right top;
  text-align: right;
}
.mdc-text-field .mdc-floating-label {
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.mdc-notched-outline .mdc-floating-label {
  display: inline-block;
  position: relative;
  max-width: 100%;
}
.mdc-text-field--outlined .mdc-floating-label {
  left: 4px;
  right: auto;
}
[dir=rtl] .mdc-text-field--outlined .mdc-floating-label {
  left: auto;
  right: 4px;
}
.mdc-text-field--filled .mdc-floating-label {
  left: 16px;
  right: auto;
}
[dir=rtl] .mdc-text-field--filled .mdc-floating-label {
  left: auto;
  right: 16px;
}
.mdc-text-field--disabled .mdc-floating-label {
  cursor: default;
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-floating-label {
    z-index: 1;
  }
}
.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label {
  display: none;
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--mat-form-field-filled-label-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-filled-focus-label-text-color, var(--mat-sys-primary));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--mat-form-field-filled-hover-label-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label {
  color: var(--mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--mat-form-field-filled-error-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-filled-error-focus-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--mat-form-field-filled-error-hover-label-text-color, var(--mat-sys-on-error-container));
}
.mdc-text-field--filled .mdc-floating-label {
  font-family: var(--mat-form-field-filled-label-text-font, var(--mat-sys-body-large-font));
  font-size: var(--mat-form-field-filled-label-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-form-field-filled-label-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-form-field-filled-label-text-tracking, var(--mat-sys-body-large-tracking));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--mat-form-field-outlined-label-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-outlined-focus-label-text-color, var(--mat-sys-primary));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--mat-form-field-outlined-hover-label-text-color, var(--mat-sys-on-surface));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label {
  color: var(--mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--mat-form-field-outlined-error-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-outlined-error-focus-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--mat-form-field-outlined-error-hover-label-text-color, var(--mat-sys-on-error-container));
}
.mdc-text-field--outlined .mdc-floating-label {
  font-family: var(--mat-form-field-outlined-label-text-font, var(--mat-sys-body-large-font));
  font-size: var(--mat-form-field-outlined-label-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-form-field-outlined-label-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-form-field-outlined-label-text-tracking, var(--mat-sys-body-large-tracking));
}

.mdc-floating-label--float-above {
  cursor: auto;
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--filled .mdc-floating-label--float-above {
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--outlined .mdc-floating-label--float-above {
  transform: translateY(-37.25px) scale(1);
  font-size: 0.75rem;
}
.mdc-notched-outline .mdc-floating-label--float-above {
  text-overflow: clip;
}
.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: 133.3333333333%;
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  transform: translateY(-34.75px) scale(0.75);
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: 1rem;
}

.mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 1px;
  margin-right: 0;
  content: "*";
}
[dir=rtl] .mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 0;
  margin-right: 1px;
}

.mdc-notched-outline {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: 100%;
  text-align: left;
  pointer-events: none;
}
[dir=rtl] .mdc-notched-outline {
  text-align: right;
}
.mdc-text-field--outlined .mdc-notched-outline {
  z-index: 1;
}

.mat-mdc-notch-piece {
  box-sizing: border-box;
  height: 100%;
  pointer-events: none;
  border: none;
  border-top: 1px solid;
  border-bottom: 1px solid;
}
.mdc-text-field--focused .mat-mdc-notch-piece {
  border-width: 2px;
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-outline-color, var(--mat-sys-outline));
  border-width: var(--mat-form-field-outlined-outline-width, 1px);
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-hover-outline-color, var(--mat-sys-on-surface));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-focus-outline-color, var(--mat-sys-primary));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-error-outline-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-error-hover-outline-color, var(--mat-sys-on-error-container));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-error-focus-outline-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece {
  border-width: var(--mat-form-field-outlined-focus-outline-width, 2px);
}

.mdc-notched-outline__leading {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
  width: max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));
}
[dir=rtl] .mdc-notched-outline__leading {
  border-left: none;
  border-right: 1px solid;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-top-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}

.mdc-notched-outline__trailing {
  flex-grow: 1;
  border-left: none;
  border-right: 1px solid;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}
[dir=rtl] .mdc-notched-outline__trailing {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}

.mdc-notched-outline__notch {
  flex: 0 0 auto;
  width: auto;
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch {
  max-width: min(var(--mat-form-field-notch-max-width, 100%), calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  max-width: min(100%, calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 1px;
}
.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 2px;
}
.mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 0;
  padding-right: 8px;
  border-top: none;
}
[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 8px;
  padding-right: 0;
}
.mdc-notched-outline--no-label .mdc-notched-outline__notch {
  display: none;
}

.mdc-line-ripple::before, .mdc-line-ripple::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom-style: solid;
  content: "";
}
.mdc-line-ripple::before {
  z-index: 1;
  border-bottom-width: var(--mat-form-field-filled-active-indicator-height, 1px);
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-active-indicator-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-hover-active-indicator-color, var(--mat-sys-on-surface));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-error-active-indicator-color, var(--mat-sys-error));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-error-hover-active-indicator-color, var(--mat-sys-on-error-container));
}
.mdc-line-ripple::after {
  transform: scaleX(0);
  opacity: 0;
  z-index: 2;
}
.mdc-text-field--filled .mdc-line-ripple::after {
  border-bottom-width: var(--mat-form-field-filled-focus-active-indicator-height, 2px);
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--mat-form-field-filled-focus-active-indicator-color, var(--mat-sys-primary));
}
.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--mat-form-field-filled-error-focus-active-indicator-color, var(--mat-sys-error));
}

.mdc-line-ripple--active::after {
  transform: scaleX(1);
  opacity: 1;
}

.mdc-line-ripple--deactivating::after {
  opacity: 0;
}

.mdc-text-field--disabled {
  pointer-events: none;
}

.mat-mdc-form-field-textarea-control {
  vertical-align: middle;
  resize: vertical;
  box-sizing: border-box;
  height: auto;
  margin: 0;
  padding: 0;
  border: none;
  overflow: auto;
}

.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font: inherit;
  letter-spacing: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  border: none;
}

.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  line-height: normal;
  pointer-events: all;
  will-change: auto;
}

.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label {
  cursor: inherit;
}

.mdc-text-field--no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,
.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control {
  height: auto;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color] {
  height: 23px;
}

.mat-mdc-text-field-wrapper {
  height: auto;
  flex: auto;
  will-change: auto;
}

.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-left: 0;
  --mat-mdc-form-field-label-offset-x: -16px;
}

.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

[dir=rtl] .mat-mdc-text-field-wrapper {
  padding-left: 16px;
  padding-right: 16px;
}
[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-left: 0;
}
[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

.mat-form-field-disabled .mdc-text-field__input::placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
  opacity: 1;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label {
  left: auto;
  right: auto;
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input {
  display: inline-block;
}

.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch {
  padding-top: 0;
}

.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: 1px solid transparent;
}

[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: none;
  border-right: 1px solid transparent;
}

.mat-mdc-form-field-infix {
  min-height: var(--mat-form-field-container-height, 56px);
  padding-top: var(--mat-form-field-filled-with-label-container-padding-top, 24px);
  padding-bottom: var(--mat-form-field-filled-with-label-container-padding-bottom, 8px);
}
.mdc-text-field--outlined .mat-mdc-form-field-infix, .mdc-text-field--no-label .mat-mdc-form-field-infix {
  padding-top: var(--mat-form-field-container-vertical-padding, 16px);
  padding-bottom: var(--mat-form-field-container-vertical-padding, 16px);
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {
  top: calc(var(--mat-form-field-container-height, 56px) / 2);
}

.mdc-text-field--filled .mat-mdc-floating-label {
  display: var(--mat-form-field-filled-label-display, block);
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  --mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--mat-form-field-container-height, 56px) / 2) * -1))
    scale(var(--mat-mdc-form-field-floating-label-scale, 0.75));
  transform: var(--mat-mdc-form-field-label-transform);
}

@keyframes _mat-form-field-subscript-animation {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.mat-mdc-form-field-subscript-wrapper {
  box-sizing: border-box;
  width: 100%;
  position: relative;
}

.mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-error-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 16px;
  opacity: 1;
  transform: translateY(0);
  animation: _mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2);
}

.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper {
  position: static;
}

.mat-mdc-form-field-bottom-align::before {
  content: "";
  display: inline-block;
  height: 16px;
}

.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before {
  content: unset;
}

.mat-mdc-form-field-hint-end {
  order: 1;
}

.mat-mdc-form-field-hint-wrapper {
  display: flex;
}

.mat-mdc-form-field-hint-spacer {
  flex: 1 0 1em;
}

.mat-mdc-form-field-error {
  display: block;
  color: var(--mat-form-field-error-text-color, var(--mat-sys-error));
}

.mat-mdc-form-field-subscript-wrapper,
.mat-mdc-form-field-bottom-align::before {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--mat-form-field-subscript-text-font, var(--mat-sys-body-small-font));
  line-height: var(--mat-form-field-subscript-text-line-height, var(--mat-sys-body-small-line-height));
  font-size: var(--mat-form-field-subscript-text-size, var(--mat-sys-body-small-size));
  letter-spacing: var(--mat-form-field-subscript-text-tracking, var(--mat-sys-body-small-tracking));
  font-weight: var(--mat-form-field-subscript-text-weight, var(--mat-sys-body-small-weight));
}

.mat-mdc-form-field-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  background-color: var(--mat-form-field-state-layer-color, var(--mat-sys-on-surface));
}
.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay {
  opacity: var(--mat-form-field-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay {
  opacity: var(--mat-form-field-focus-state-layer-opacity, 0);
}

select.mat-mdc-form-field-input-control {
  -moz-appearance: none;
  -webkit-appearance: none;
  background-color: transparent;
  display: inline-flex;
  box-sizing: border-box;
}
select.mat-mdc-form-field-input-control:not(:disabled) {
  cursor: pointer;
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option {
  color: var(--mat-form-field-select-option-text-color, var(--mat-sys-neutral10));
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled {
  color: var(--mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--mat-sys-neutral10) 38%, transparent));
}

.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -2.5px;
  pointer-events: none;
  color: var(--mat-form-field-enabled-select-arrow-color, var(--mat-sys-on-surface-variant));
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  right: auto;
  left: 0;
}
.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after {
  color: var(--mat-form-field-focus-select-arrow-color, var(--mat-sys-primary));
}
.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after {
  color: var(--mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 15px;
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 0;
  padding-left: 15px;
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill .mat-mdc-text-field-wrapper {
    outline: solid 1px;
  }
}
@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper {
    outline-color: GrayText;
  }
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper {
    outline: dashed 3px;
  }
}

@media (forced-colors: active) {
  .mat-mdc-form-field.mat-focused .mdc-notched-outline {
    border: dashed 3px;
  }
}

.mat-mdc-form-field-input-control[type=date], .mat-mdc-form-field-input-control[type=datetime], .mat-mdc-form-field-input-control[type=datetime-local], .mat-mdc-form-field-input-control[type=month], .mat-mdc-form-field-input-control[type=week], .mat-mdc-form-field-input-control[type=time] {
  line-height: 1;
}
.mat-mdc-form-field-input-control::-webkit-datetime-edit {
  line-height: 1;
  padding: 0;
  margin-bottom: -2px;
}

.mat-mdc-form-field {
  --mat-mdc-form-field-floating-label-scale: 0.75;
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--mat-form-field-container-text-font, var(--mat-sys-body-large-font));
  line-height: var(--mat-form-field-container-text-line-height, var(--mat-sys-body-large-line-height));
  font-size: var(--mat-form-field-container-text-size, var(--mat-sys-body-large-size));
  letter-spacing: var(--mat-form-field-container-text-tracking, var(--mat-sys-body-large-tracking));
  font-weight: var(--mat-form-field-container-text-weight, var(--mat-sys-body-large-weight));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above {
  font-size: calc(var(--mat-form-field-outlined-label-text-populated-size) * var(--mat-mdc-form-field-floating-label-scale));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: var(--mat-form-field-outlined-label-text-populated-size);
}
[dir=rtl] .mat-mdc-form-field {
  text-align: right;
}

.mat-mdc-form-field-flex {
  display: inline-flex;
  align-items: baseline;
  box-sizing: border-box;
  width: 100%;
}

.mat-mdc-text-field-wrapper {
  width: 100%;
  z-index: 0;
}

.mat-mdc-form-field-icon-prefix,
.mat-mdc-form-field-icon-suffix {
  align-self: center;
  line-height: 0;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}
.mat-mdc-form-field-icon-prefix > .mat-icon,
.mat-mdc-form-field-icon-suffix > .mat-icon {
  padding: 0 12px;
  box-sizing: content-box;
}

.mat-mdc-form-field-icon-prefix {
  color: var(--mat-form-field-leading-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-prefix {
  color: var(--mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-trailing-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-invalid .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-error-trailing-icon-color, var(--mat-sys-error));
}
.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-error-hover-trailing-icon-color, var(--mat-sys-on-error-container));
}
.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-error-focus-trailing-icon-color, var(--mat-sys-error));
}

.mat-mdc-form-field-icon-prefix,
[dir=rtl] .mat-mdc-form-field-icon-suffix {
  padding: 0 4px 0 0;
}

.mat-mdc-form-field-icon-suffix,
[dir=rtl] .mat-mdc-form-field-icon-prefix {
  padding: 0 0 0 4px;
}

.mat-mdc-form-field-subscript-wrapper .mat-icon,
.mat-mdc-form-field label .mat-icon {
  width: 1em;
  height: 1em;
  font-size: inherit;
}

.mat-mdc-form-field-infix {
  flex: auto;
  min-width: 0;
  width: 180px;
  position: relative;
  box-sizing: border-box;
}
.mat-mdc-form-field-infix:has(textarea[cols]) {
  width: auto;
}

.mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: -1px;
  -webkit-clip-path: inset(-9em -999em -9em 1px);
  clip-path: inset(-9em -999em -9em 1px);
}
[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: 0;
  margin-right: -1px;
  -webkit-clip-path: inset(-9em 1px -9em -999em);
  clip-path: inset(-9em 1px -9em -999em);
}

.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input {
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before {
  transition-duration: 75ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after {
  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper {
  animation-duration: 300ms;
}

.mdc-notched-outline .mdc-floating-label {
  max-width: calc(100% + 1px);
}

.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: calc(133.3333333333% + 1px);
}
`],encapsulation:2,changeDetection:0})}return i})();var Qd=(()=>{class i{_animationsDisabled=he();state="unchecked";disabled=!1;appearance="full";constructor(){}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-pseudo-checkbox"]],hostAttrs:[1,"mat-pseudo-checkbox"],hostVars:12,hostBindings:function(t,o){t&2&&M("mat-pseudo-checkbox-indeterminate",o.state==="indeterminate")("mat-pseudo-checkbox-checked",o.state==="checked")("mat-pseudo-checkbox-disabled",o.disabled)("mat-pseudo-checkbox-minimal",o.appearance==="minimal")("mat-pseudo-checkbox-full",o.appearance==="full")("_mat-animation-noopable",o._animationsDisabled)},inputs:{state:"state",disabled:"disabled",appearance:"appearance"},decls:0,vars:0,template:function(t,o){},styles:[`.mat-pseudo-checkbox {
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1), background-color 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox::after {
  position: absolute;
  opacity: 0;
  content: "";
  border-bottom: 2px solid currentColor;
  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-pseudo-checkbox._mat-animation-noopable::after {
  transition: none;
}

.mat-pseudo-checkbox-disabled {
  cursor: default;
}

.mat-pseudo-checkbox-indeterminate::after {
  left: 1px;
  opacity: 1;
  border-radius: 2px;
}

.mat-pseudo-checkbox-checked::after {
  left: 1px;
  border-left: 2px solid currentColor;
  transform: rotate(-45deg);
  opacity: 1;
  box-sizing: content-box;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  color: var(--mat-pseudo-checkbox-minimal-selected-checkmark-color, var(--mat-sys-primary));
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-pseudo-checkbox-full {
  border-color: var(--mat-pseudo-checkbox-full-unselected-icon-color, var(--mat-sys-on-surface-variant));
  border-width: 2px;
  border-style: solid;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-disabled {
  border-color: var(--mat-pseudo-checkbox-full-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {
  background-color: var(--mat-pseudo-checkbox-full-selected-icon-color, var(--mat-sys-primary));
  border-color: transparent;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  color: var(--mat-pseudo-checkbox-full-selected-checkmark-color, var(--mat-sys-on-primary));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {
  background-color: var(--mat-pseudo-checkbox-full-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--mat-pseudo-checkbox-full-disabled-selected-checkmark-color, var(--mat-sys-surface));
}

.mat-pseudo-checkbox {
  width: 18px;
  height: 18px;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after {
  width: 14px;
  height: 6px;
  transform-origin: center;
  top: -4.2426406871px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  top: 8px;
  width: 16px;
}

.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after {
  width: 10px;
  height: 4px;
  transform-origin: center;
  top: -2.8284271247px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  top: 6px;
  width: 12px;
}
`],encapsulation:2,changeDetection:0})}return i})();var pf=["text"],ff=[[["mat-icon"]],"*"],gf=["mat-icon","*"];function _f(i,n){if(i&1&&de(0,"mat-pseudo-checkbox",1),i&2){let e=b();L("disabled",e.disabled)("state",e.selected?"checked":"unchecked")}}function vf(i,n){if(i&1&&de(0,"mat-pseudo-checkbox",3),i&2){let e=b();L("disabled",e.disabled)}}function bf(i,n){if(i&1&&(d(0,"span",4),h(1),u()),i&2){let e=b();m(),We("(",e.group.label,")")}}var qi=new g("MAT_OPTION_PARENT_COMPONENT"),Ki=new g("MatOptgroup");var Xi=class{source;isUserInput;constructor(n,e=!1){this.source=n,this.isUserInput=e}},Ct=(()=>{class i{_element=s(A);_changeDetectorRef=s(ue);_parent=s(qi,{optional:!0});group=s(Ki,{optional:!0});_signalDisableRipple=!1;_selected=!1;_active=!1;_mostRecentViewValue="";get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=s(me).getId("mat-option-");get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=Q(!1);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return!!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new j;_text;_stateChanges=new y;constructor(){let e=s(Le);e.load(cr),e.load($n),this._signalDisableRipple=!!this._parent&&Bt(this._parent.disableRipple)}get active(){return this._active}get viewValue(){return(this._text?.nativeElement.textContent||"").trim()}select(e=!0){this._selected||(this._selected=!0,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}deselect(e=!0){this._selected&&(this._selected=!1,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}focus(e,t){let o=this._getHostElement();typeof o.focus=="function"&&o.focus(t)}setActiveStyles(){this._active||(this._active=!0,this._changeDetectorRef.markForCheck())}setInactiveStyles(){this._active&&(this._active=!1,this._changeDetectorRef.markForCheck())}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!xe(e)&&(this._selectViaInteraction(),e.preventDefault())}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:!0,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(!0))}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e)}}ngOnDestroy(){this._stateChanges.complete()}_emitSelectionChangeEvent(e=!1){this.onSelectionChange.emit(new Xi(this,e))}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-option"]],viewQuery:function(t,o){if(t&1&&fe(pf,7),t&2){let r;R(r=P())&&(o._text=r.first)}},hostAttrs:["role","option",1,"mat-mdc-option","mdc-list-item"],hostVars:11,hostBindings:function(t,o){t&1&&T("click",function(){return o._selectViaInteraction()})("keydown",function(a){return o._handleKeydown(a)}),t&2&&(Ge("id",o.id),W("aria-selected",o.selected)("aria-disabled",o.disabled.toString()),M("mdc-list-item--selected",o.selected)("mat-mdc-option-multiple",o.multiple)("mat-mdc-option-active",o.active)("mdc-list-item--disabled",o.disabled))},inputs:{value:"value",id:"id",disabled:[2,"disabled","disabled",U]},outputs:{onSelectionChange:"onSelectionChange"},exportAs:["matOption"],ngContentSelectors:gf,decls:8,vars:5,consts:[["text",""],["aria-hidden","true",1,"mat-mdc-option-pseudo-checkbox",3,"disabled","state"],[1,"mdc-list-item__primary-text"],["state","checked","aria-hidden","true","appearance","minimal",1,"mat-mdc-option-pseudo-checkbox",3,"disabled"],[1,"cdk-visually-hidden"],["aria-hidden","true","mat-ripple","",1,"mat-mdc-option-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled"]],template:function(t,o){t&1&&(_e(ff),B(0,_f,1,2,"mat-pseudo-checkbox",1),$(1),d(2,"span",2,0),$(4,1),u(),B(5,vf,1,1,"mat-pseudo-checkbox",3),B(6,bf,2,1,"span",4),de(7,"div",5)),t&2&&(V(o.multiple?0:-1),m(5),V(!o.multiple&&o.selected&&!o.hideSingleSelectionIndicator?5:-1),m(),V(o.group&&o.group._inert?6:-1),m(),L("matRippleTrigger",o._getHostElement())("matRippleDisabled",o.disabled||o.disableRipple))},dependencies:[Qd,od],styles:[`.mat-mdc-option {
  -webkit-user-select: none;
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  min-height: 48px;
  padding: 0 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: var(--mat-option-label-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-option-label-text-font, var(--mat-sys-label-large-font));
  line-height: var(--mat-option-label-text-line-height, var(--mat-sys-label-large-line-height));
  font-size: var(--mat-option-label-text-size, var(--mat-sys-body-large-size));
  letter-spacing: var(--mat-option-label-text-tracking, var(--mat-sys-label-large-tracking));
  font-weight: var(--mat-option-label-text-weight, var(--mat-sys-body-large-weight));
}
.mat-mdc-option:hover:not(.mdc-list-item--disabled) {
  background-color: var(--mat-option-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {
  background-color: var(--mat-option-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));
  outline: 0;
}
.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {
  background-color: var(--mat-option-selected-state-layer-color, var(--mat-sys-secondary-container));
}
.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {
  color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-option .mat-pseudo-checkbox {
  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-option.mdc-list-item {
  align-items: center;
  background: transparent;
}
.mat-mdc-option.mdc-list-item--disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {
  opacity: 0.38;
}
.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 32px;
}
[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 16px;
  padding-right: 32px;
}
.mat-mdc-option .mat-icon,
.mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-icon,
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 0;
  margin-left: 16px;
}
.mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-left: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-right: 16px;
  margin-left: 0;
}
.mat-mdc-option .mat-mdc-option-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-option .mdc-list-item__primary-text {
  white-space: normal;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  margin-right: auto;
}
[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {
  margin-right: 0;
  margin-left: auto;
}
@media (forced-colors: active) {
  .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 10px;
    height: 0;
    border-bottom: solid 10px;
    border-radius: 10px;
  }
  [dir=rtl] .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-option-multiple {
  --mat-list-list-item-selected-container-color: var(--mat-list-list-item-container-color, transparent);
}

.mat-mdc-option-active .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2,changeDetection:0})}return i})();function Er(i,n,e){if(e.length){let t=n.toArray(),o=e.toArray(),r=0;for(let a=0;a<i+1;a++)t[a].group&&t[a].group===o[r]&&r++;return r}return 0}function Sr(i,n,e,t){return i<e?i:i+n>e+t?Math.max(0,i-t+n):e}var ei=(()=>{class i{isErrorState(e,t){return!!(e&&e.invalid&&(e.touched||t&&t.submitted))}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var ti=class{_defaultMatcher;ngControl;_parentFormGroup;_parentForm;_stateChanges;errorState=!1;matcher;constructor(n,e,t,o,r){this._defaultMatcher=n,this.ngControl=e,this._parentFormGroup=t,this._parentForm=o,this._stateChanges=r}updateErrorState(){let n=this.errorState,e=this._parentFormGroup||this._parentForm,t=this.matcher||this._defaultMatcher,o=this.ngControl?this.ngControl.control:null,r=t?.isErrorState(o,e)??!1;r!==n&&(this.errorState=r,this._stateChanges.next())}};var Rt=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[tr,Jn,z]})}return i})();var eu=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[z]})}return i})();var ni=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[Xn,eu,Ct,z]})}return i})();var yf=["trigger"],Cf=["panel"],xf=[[["mat-select-trigger"]],"*"],wf=["mat-select-trigger","*"];function Df(i,n){if(i&1&&(d(0,"span",4),h(1),u()),i&2){let e=b();m(),ae(e.placeholder)}}function Ef(i,n){i&1&&$(0)}function Sf(i,n){if(i&1&&(d(0,"span",11),h(1),u()),i&2){let e=b(2);m(),ae(e.triggerValue)}}function Af(i,n){if(i&1&&(d(0,"span",5),B(1,Ef,1,0)(2,Sf,2,1,"span",11),u()),i&2){let e=b();m(),V(e.customTrigger?1:2)}}function Mf(i,n){if(i&1){let e=Ue();d(0,"div",12,1),T("keydown",function(o){ie(e);let r=b();return oe(r._handleKeydown(o))}),$(2,1),u()}if(i&2){let e=b();Fe(e.panelClass),M("mat-select-panel-animations-enabled",!e._animationsDisabled)("mat-primary",(e._parentFormField==null?null:e._parentFormField.color)==="primary")("mat-accent",(e._parentFormField==null?null:e._parentFormField.color)==="accent")("mat-warn",(e._parentFormField==null?null:e._parentFormField.color)==="warn")("mat-undefined",!(e._parentFormField!=null&&e._parentFormField.color)),W("id",e.id+"-panel")("aria-multiselectable",e.multiple)("aria-label",e.ariaLabel||null)("aria-labelledby",e._getPanelAriaLabelledby())}}var If=new g("mat-select-scroll-strategy",{providedIn:"root",factory:()=>{let i=s(O);return()=>Ft(i)}}),kf=new g("MAT_SELECT_CONFIG"),Tf=new g("MatSelectTrigger"),es=class{source;value;constructor(n,e){this.source=n,this.value=e}},tu=(()=>{class i{_viewportRuler=s(bt);_changeDetectorRef=s(ue);_elementRef=s(A);_dir=s(ke,{optional:!0});_idGenerator=s(me);_renderer=s(re);_parentFormField=s(Kt,{optional:!0});ngControl=s($e,{self:!0,optional:!0});_liveAnnouncer=s(Ni);_defaultOptions=s(kf,{optional:!0});_animationsDisabled=he();_popoverLocation;_initialized=new y;_cleanupDetach;options;optionGroups;customTrigger;_positions=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"}];_scrollOptionIntoView(e){let t=this.options.toArray()[e];if(t){let o=this.panel.nativeElement,r=Er(e,this.options,this.optionGroups),a=t._getHostElement();e===0&&r===1?o.scrollTop=0:o.scrollTop=Sr(a.offsetTop,a.offsetHeight,o.scrollTop,o.offsetHeight)}}_positioningSettled(){this._scrollOptionIntoView(this._keyManager.activeItemIndex||0)}_getChangeEvent(e){return new es(this,e)}_scrollStrategyFactory=s(If);_panelOpen=!1;_compareWith=(e,t)=>e===t;_uid=this._idGenerator.getId("mat-select-");_triggerAriaLabelledBy=null;_previousControl;_destroy=new y;_errorStateTracker;stateChanges=new y;disableAutomaticLabeling=!0;userAriaDescribedBy;_selectionModel;_keyManager;_preferredOverlayOrigin;_overlayWidth;_onChange=()=>{};_onTouched=()=>{};_valueId=this._idGenerator.getId("mat-select-value-");_scrollStrategy;_overlayPanelClass=this._defaultOptions?.overlayPanelClass||"";get focused(){return this._focused||this._panelOpen}_focused=!1;controlType="mat-select";trigger;panel;_overlayDir;panelClass;disabled=!1;get disableRipple(){return this._disableRipple()}set disableRipple(e){this._disableRipple.set(e)}_disableRipple=Q(!1);tabIndex=0;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties()}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??!1;get placeholder(){return this._placeholder}set placeholder(e){this._placeholder=e,this.stateChanges.next()}_placeholder;get required(){return this._required??this.ngControl?.control?.hasValidator(Bn.required)??!1}set required(e){this._required=e,this.stateChanges.next()}_required;get multiple(){return this._multiple}set multiple(e){this._selectionModel,this._multiple=e}_multiple=!1;disableOptionCentering=this._defaultOptions?.disableOptionCentering??!1;get compareWith(){return this._compareWith}set compareWith(e){this._compareWith=e,this._selectionModel&&this._initializeSelection()}get value(){return this._value}set value(e){this._assignValue(e)&&this._onChange(e)}_value;ariaLabel="";ariaLabelledby;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}typeaheadDebounceInterval;sortComparator;get id(){return this._id}set id(e){this._id=e||this._uid,this.stateChanges.next()}_id;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}panelWidth=this._defaultOptions&&typeof this._defaultOptions.panelWidth<"u"?this._defaultOptions.panelWidth:"auto";canSelectNullableOptions=this._defaultOptions?.canSelectNullableOptions??!1;optionSelectionChanges=Pt(()=>{let e=this.options;return e?e.changes.pipe(ze(e),Qe(()=>Ze(...e.map(t=>t.onSelectionChange)))):this._initialized.pipe(Qe(()=>this.optionSelectionChanges))});openedChange=new j;_openedStream=this.openedChange.pipe(pe(e=>e),ee(()=>{}));_closedStream=this.openedChange.pipe(pe(e=>!e),ee(()=>{}));selectionChange=new j;valueChange=new j;constructor(){let e=s(ei),t=s(Ti,{optional:!0}),o=s(Oi,{optional:!0}),r=s(new po("tabindex"),{optional:!0}),a=s(Wi,{optional:!0});this.ngControl&&(this.ngControl.valueAccessor=this),this._defaultOptions?.typeaheadDebounceInterval!=null&&(this.typeaheadDebounceInterval=this._defaultOptions.typeaheadDebounceInterval),this._errorStateTracker=new ti(e,this.ngControl,o,t,this.stateChanges),this._scrollStrategy=this._scrollStrategyFactory(),this.tabIndex=r==null?0:parseInt(r)||0,this._popoverLocation=a?.usePopover===!1?null:"inline",this.id=this.id}ngOnInit(){this._selectionModel=new Hi(this.multiple),this.stateChanges.next(),this._viewportRuler.change().pipe(le(this._destroy)).subscribe(()=>{this.panelOpen&&(this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._changeDetectorRef.detectChanges())})}ngAfterContentInit(){this._initialized.next(),this._initialized.complete(),this._initKeyManager(),this._selectionModel.changed.pipe(le(this._destroy)).subscribe(e=>{e.added.forEach(t=>t.select()),e.removed.forEach(t=>t.deselect())}),this.options.changes.pipe(ze(null),le(this._destroy)).subscribe(()=>{this._resetOptions(),this._initializeSelection()})}ngDoCheck(){let e=this._getTriggerAriaLabelledby(),t=this.ngControl;if(e!==this._triggerAriaLabelledBy){let o=this._elementRef.nativeElement;this._triggerAriaLabelledBy=e,e?o.setAttribute("aria-labelledby",e):o.removeAttribute("aria-labelledby")}t&&(this._previousControl!==t.control&&(this._previousControl!==void 0&&t.disabled!==null&&t.disabled!==this.disabled&&(this.disabled=t.disabled),this._previousControl=t.control),this.updateErrorState())}ngOnChanges(e){(e.disabled||e.userAriaDescribedBy)&&this.stateChanges.next(),e.typeaheadDebounceInterval&&this._keyManager&&this._keyManager.withTypeAhead(this.typeaheadDebounceInterval),e.panelClass&&this.panelClass instanceof Set&&(this.panelClass=Array.from(this.panelClass))}ngOnDestroy(){this._cleanupDetach?.(),this._keyManager?.destroy(),this._destroy.next(),this._destroy.complete(),this.stateChanges.complete(),this._clearFromModal()}toggle(){this.panelOpen?this.close():this.open()}open(){this._canOpen()&&(this._parentFormField&&(this._preferredOverlayOrigin=this._parentFormField.getConnectedOverlayOrigin()),this._cleanupDetach?.(),this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._applyModalPanelOwnership(),this._panelOpen=!0,this._overlayDir.positionChange.pipe(je(1)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this._positioningSettled()}),this._overlayDir.attachOverlay(),this._keyManager.withHorizontalOrientation(null),this._highlightCorrectOption(),this._changeDetectorRef.markForCheck(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!0)))}_trackedModal=null;_applyModalPanelOwnership(){let e=this._elementRef.nativeElement.closest('body > .cdk-overlay-container [aria-modal="true"]');if(!e)return;let t=`${this.id}-panel`;this._trackedModal&&Gt(this._trackedModal,"aria-owns",t),Yn(e,"aria-owns",t),this._trackedModal=e}_clearFromModal(){if(!this._trackedModal)return;let e=`${this.id}-panel`;Gt(this._trackedModal,"aria-owns",e),this._trackedModal=null}close(){this._panelOpen&&(this._panelOpen=!1,this._exitAndDetach(),this._keyManager.withHorizontalOrientation(this._isRtl()?"rtl":"ltr"),this._changeDetectorRef.markForCheck(),this._onTouched(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!1)))}_exitAndDetach(){if(this._animationsDisabled||!this.panel){this._detachOverlay();return}this._cleanupDetach?.(),this._cleanupDetach=()=>{t(),clearTimeout(o),this._cleanupDetach=void 0};let e=this.panel.nativeElement,t=this._renderer.listen(e,"animationend",r=>{r.animationName==="_mat-select-exit"&&(this._cleanupDetach?.(),this._detachOverlay())}),o=setTimeout(()=>{this._cleanupDetach?.(),this._detachOverlay()},200);e.classList.add("mat-select-panel-exit")}_detachOverlay(){this._overlayDir.detachOverlay(),this._changeDetectorRef.markForCheck()}writeValue(e){this._assignValue(e)}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck(),this.stateChanges.next()}get panelOpen(){return this._panelOpen}get selected(){return this.multiple?this._selectionModel?.selected||[]:this._selectionModel?.selected[0]}get triggerValue(){if(this.empty)return"";if(this._multiple){let e=this._selectionModel.selected.map(t=>t.viewValue);return this._isRtl()&&e.reverse(),e.join(", ")}return this._selectionModel.selected[0].viewValue}updateErrorState(){this._errorStateTracker.updateErrorState()}_isRtl(){return this._dir?this._dir.value==="rtl":!1}_handleKeydown(e){this.disabled||(this.panelOpen?this._handleOpenKeydown(e):this._handleClosedKeydown(e))}_handleClosedKeydown(e){let t=e.keyCode,o=t===40||t===38||t===37||t===39,r=t===13||t===32,a=this._keyManager;if(!a.isTyping()&&r&&!xe(e)||(this.multiple||e.altKey)&&o)e.preventDefault(),this.open();else if(!this.multiple){let l=this.selected;a.onKeydown(e);let c=this.selected;c&&l!==c&&this._liveAnnouncer.announce(c.viewValue,1e4)}}_handleOpenKeydown(e){let t=this._keyManager,o=e.keyCode,r=o===40||o===38,a=t.isTyping();if(r&&e.altKey)e.preventDefault(),this.close();else if(!a&&(o===13||o===32)&&t.activeItem&&!xe(e))e.preventDefault(),t.activeItem._selectViaInteraction();else if(!a&&this._multiple&&o===65&&e.ctrlKey){e.preventDefault();let l=this.options.some(c=>!c.disabled&&!c.selected);this.options.forEach(c=>{c.disabled||(l?c.select():c.deselect())})}else{let l=t.activeItemIndex;t.onKeydown(e),this._multiple&&r&&e.shiftKey&&t.activeItem&&t.activeItemIndex!==l&&t.activeItem._selectViaInteraction()}}_handleOverlayKeydown(e){e.keyCode===27&&!xe(e)&&(e.preventDefault(),this.close())}_onFocus(){this.disabled||(this._focused=!0,this.stateChanges.next())}_onBlur(){this._focused=!1,this._keyManager?.cancelTypeahead(),!this.disabled&&!this.panelOpen&&(this._onTouched(),this._changeDetectorRef.markForCheck(),this.stateChanges.next())}get empty(){return!this._selectionModel||this._selectionModel.isEmpty()}_initializeSelection(){Promise.resolve().then(()=>{this.ngControl&&(this._value=this.ngControl.value),this._setSelectionByValue(this._value),this.stateChanges.next()})}_setSelectionByValue(e){if(this.options.forEach(t=>t.setInactiveStyles()),this._selectionModel.clear(),this.multiple&&e)Array.isArray(e),e.forEach(t=>this._selectOptionByValue(t)),this._sortValues();else{let t=this._selectOptionByValue(e);t?this._keyManager.updateActiveItem(t):this.panelOpen||this._keyManager.updateActiveItem(-1)}this._changeDetectorRef.markForCheck()}_selectOptionByValue(e){let t=this.options.find(o=>{if(this._selectionModel.isSelected(o))return!1;try{return(o.value!=null||this.canSelectNullableOptions)&&this._compareWith(o.value,e)}catch{return!1}});return t&&this._selectionModel.select(t),t}_assignValue(e){return e!==this._value||this._multiple&&Array.isArray(e)?(this.options&&this._setSelectionByValue(e),this._value=e,!0):!1}_skipPredicate=e=>this.panelOpen?!1:e.disabled;_getOverlayWidth(e){return this.panelWidth==="auto"?(e instanceof Zn?e.elementRef:e||this._elementRef).nativeElement.getBoundingClientRect().width:this.panelWidth===null?"":this.panelWidth}_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck()}_initKeyManager(){this._keyManager=new gn(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl()?"rtl":"ltr").withHomeAndEnd().withPageUpDown().withAllowedModifierKeys(["shiftKey"]).skipPredicate(this._skipPredicate),this._keyManager.tabOut.subscribe(()=>{this.panelOpen&&(!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction(),this.focus(),this.close())}),this._keyManager.change.subscribe(()=>{this._panelOpen&&this.panel?this._scrollOptionIntoView(this._keyManager.activeItemIndex||0):!this._panelOpen&&!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction()})}_resetOptions(){let e=Ze(this.options.changes,this._destroy);this.optionSelectionChanges.pipe(le(e)).subscribe(t=>{this._onSelect(t.source,t.isUserInput),t.isUserInput&&!this.multiple&&this._panelOpen&&(this.close(),this.focus())}),Ze(...this.options.map(t=>t._stateChanges)).pipe(le(e)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this.stateChanges.next()})}_onSelect(e,t){let o=this._selectionModel.isSelected(e);!this.canSelectNullableOptions&&e.value==null&&!this._multiple?(e.deselect(),this._selectionModel.clear(),this.value!=null&&this._propagateChanges(e.value)):(o!==e.selected&&(e.selected?this._selectionModel.select(e):this._selectionModel.deselect(e)),t&&this._keyManager.setActiveItem(e),this.multiple&&(this._sortValues(),t&&this.focus())),o!==this._selectionModel.isSelected(e)&&this._propagateChanges(),this.stateChanges.next()}_sortValues(){if(this.multiple){let e=this.options.toArray();this._selectionModel.sort((t,o)=>this.sortComparator?this.sortComparator(t,o,e):e.indexOf(t)-e.indexOf(o)),this.stateChanges.next()}}_propagateChanges(e){let t;this.multiple?t=this.selected.map(o=>o.value):t=this.selected?this.selected.value:e,this._value=t,this.valueChange.emit(t),this._onChange(t),this.selectionChange.emit(this._getChangeEvent(t)),this._changeDetectorRef.markForCheck()}_highlightCorrectOption(){if(this._keyManager)if(this.empty){let e=-1;for(let t=0;t<this.options.length;t++)if(!this.options.get(t).disabled){e=t;break}this._keyManager.setActiveItem(e)}else this._keyManager.setActiveItem(this._selectionModel.selected[0])}_canOpen(){return!this._panelOpen&&!this.disabled&&this.options?.length>0&&!!this._overlayDir}focus(e){this._elementRef.nativeElement.focus(e)}_getPanelAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||null,t=e?e+" ":"";return this.ariaLabelledby?t+this.ariaLabelledby:e}_getAriaActiveDescendant(){return this.panelOpen&&this._keyManager&&this._keyManager.activeItem?this._keyManager.activeItem.id:null}_getTriggerAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||"";return this.ariaLabelledby&&(e+=" "+this.ariaLabelledby),e||(e=this._valueId),e}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let t=this._elementRef.nativeElement;e.length?t.setAttribute("aria-describedby",e.join(" ")):t.removeAttribute("aria-describedby")}onContainerClick(e){let t=Ee(e);t&&(t.tagName==="MAT-OPTION"||t.classList.contains("cdk-overlay-backdrop")||t.closest(".mat-mdc-select-panel"))||(this.focus(),this.open())}get shouldLabelFloat(){return this.panelOpen||!this.empty||this.focused&&!!this.placeholder}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-select"]],contentQueries:function(t,o,r){if(t&1&&wt(r,Tf,5)(r,Ct,5)(r,Ki,5),t&2){let a;R(a=P())&&(o.customTrigger=a.first),R(a=P())&&(o.options=a),R(a=P())&&(o.optionGroups=a)}},viewQuery:function(t,o){if(t&1&&fe(yf,5)(Cf,5)(xr,5),t&2){let r;R(r=P())&&(o.trigger=r.first),R(r=P())&&(o.panel=r.first),R(r=P())&&(o._overlayDir=r.first)}},hostAttrs:["role","combobox","aria-haspopup","listbox",1,"mat-mdc-select"],hostVars:21,hostBindings:function(t,o){t&1&&T("keydown",function(a){return o._handleKeydown(a)})("focus",function(){return o._onFocus()})("blur",function(){return o._onBlur()}),t&2&&(W("id",o.id)("tabindex",o.disabled?-1:o.tabIndex)("aria-controls",o.panelOpen?o.id+"-panel":null)("aria-expanded",o.panelOpen)("aria-label",o.ariaLabel||null)("aria-required",o.required.toString())("aria-disabled",o.disabled.toString())("aria-invalid",o.errorState)("aria-activedescendant",o._getAriaActiveDescendant()),M("mat-mdc-select-disabled",o.disabled)("mat-mdc-select-invalid",o.errorState)("mat-mdc-select-required",o.required)("mat-mdc-select-empty",o.empty)("mat-mdc-select-multiple",o.multiple)("mat-select-open",o.panelOpen))},inputs:{userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],panelClass:"panelClass",disabled:[2,"disabled","disabled",U],disableRipple:[2,"disableRipple","disableRipple",U],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:Xe(e)],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",U],placeholder:"placeholder",required:[2,"required","required",U],multiple:[2,"multiple","multiple",U],disableOptionCentering:[2,"disableOptionCentering","disableOptionCentering",U],compareWith:"compareWith",value:"value",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],errorStateMatcher:"errorStateMatcher",typeaheadDebounceInterval:[2,"typeaheadDebounceInterval","typeaheadDebounceInterval",Xe],sortComparator:"sortComparator",id:"id",panelWidth:"panelWidth",canSelectNullableOptions:[2,"canSelectNullableOptions","canSelectNullableOptions",U]},outputs:{openedChange:"openedChange",_openedStream:"opened",_closedStream:"closed",selectionChange:"selectionChange",valueChange:"valueChange"},exportAs:["matSelect"],features:[ge([{provide:qt,useExisting:i},{provide:qi,useExisting:i}]),ve],ngContentSelectors:wf,decls:11,vars:10,consts:[["fallbackOverlayOrigin","cdkOverlayOrigin","trigger",""],["panel",""],["cdk-overlay-origin","",1,"mat-mdc-select-trigger",3,"click"],[1,"mat-mdc-select-value"],[1,"mat-mdc-select-placeholder","mat-mdc-select-min-line"],[1,"mat-mdc-select-value-text"],[1,"mat-mdc-select-arrow-wrapper"],[1,"mat-mdc-select-arrow"],["viewBox","0 0 24 24","width","24px","height","24px","focusable","false","aria-hidden","true"],["d","M7 10l5 5 5-5z"],["cdk-connected-overlay","","cdkConnectedOverlayHasBackdrop","","cdkConnectedOverlayBackdropClass","cdk-overlay-transparent-backdrop",3,"detach","backdropClick","overlayKeydown","cdkConnectedOverlayDisableClose","cdkConnectedOverlayPanelClass","cdkConnectedOverlayScrollStrategy","cdkConnectedOverlayOrigin","cdkConnectedOverlayPositions","cdkConnectedOverlayWidth","cdkConnectedOverlayFlexibleDimensions","cdkConnectedOverlayUsePopover"],[1,"mat-mdc-select-min-line"],["role","listbox","tabindex","-1",1,"mat-mdc-select-panel","mdc-menu-surface","mdc-menu-surface--open",3,"keydown"]],template:function(t,o){if(t&1&&(_e(xf),d(0,"div",2,0),T("click",function(){return o.open()}),d(3,"div",3),B(4,Df,2,1,"span",4)(5,Af,3,1,"span",5),u(),d(6,"div",6)(7,"div",7),wn(),d(8,"svg",8),de(9,"path",9),u()()()(),Re(10,Mf,3,16,"ng-template",10),T("detach",function(){return o.close()})("backdropClick",function(){return o.close()})("overlayKeydown",function(a){return o._handleOverlayKeydown(a)})),t&2){let r=nt(1);m(3),W("id",o._valueId),m(),V(o.empty?4:5),m(6),L("cdkConnectedOverlayDisableClose",!0)("cdkConnectedOverlayPanelClass",o._overlayPanelClass)("cdkConnectedOverlayScrollStrategy",o._scrollStrategy)("cdkConnectedOverlayOrigin",o._preferredOverlayOrigin||r)("cdkConnectedOverlayPositions",o._positions)("cdkConnectedOverlayWidth",o._overlayWidth)("cdkConnectedOverlayFlexibleDimensions",!0)("cdkConnectedOverlayUsePopover",o._popoverLocation)}},dependencies:[Zn,xr],styles:[`@keyframes _mat-select-enter {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-select-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-select {
  display: inline-block;
  width: 100%;
  outline: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: var(--mat-select-enabled-trigger-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-select-trigger-text-font, var(--mat-sys-body-large-font));
  line-height: var(--mat-select-trigger-text-line-height, var(--mat-sys-body-large-line-height));
  font-size: var(--mat-select-trigger-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-select-trigger-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-select-trigger-text-tracking, var(--mat-sys-body-large-tracking));
}

div.mat-mdc-select-panel {
  box-shadow: var(--mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}

.mat-mdc-select-disabled {
  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-select-disabled .mat-mdc-select-placeholder {
  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-select-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}
.mat-mdc-select-disabled .mat-mdc-select-trigger {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

.mat-mdc-select-value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mat-mdc-select-value-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mat-mdc-select-arrow-wrapper {
  height: 24px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}
.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {
  transform: none;
}

.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,
.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {
  color: var(--mat-select-invalid-arrow-color, var(--mat-sys-error));
}

.mat-mdc-select-arrow {
  width: 10px;
  height: 5px;
  position: relative;
  color: var(--mat-select-enabled-arrow-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {
  color: var(--mat-select-focused-arrow-color, var(--mat-sys-primary));
}
.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {
  color: var(--mat-select-disabled-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-select-open .mat-mdc-select-arrow {
  transform: rotate(180deg);
}
.mat-form-field-animations-enabled .mat-mdc-select-arrow {
  transition: transform 80ms linear;
}
.mat-mdc-select-arrow svg {
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media (forced-colors: active) {
  .mat-mdc-select-arrow svg {
    fill: CanvasText;
  }
  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {
    fill: GrayText;
  }
}

div.mat-mdc-select-panel {
  width: 100%;
  max-height: 275px;
  outline: 0;
  overflow: auto;
  padding: 8px 0;
  box-sizing: border-box;
  transform-origin: top center;
  border-radius: 0 0 4px 4px;
  position: relative;
  background-color: var(--mat-select-panel-background-color, var(--mat-sys-surface-container));
}
.mat-mdc-select-panel-above div.mat-mdc-select-panel {
  border-radius: 4px 4px 0 0;
  transform-origin: bottom center;
}
@media (forced-colors: active) {
  div.mat-mdc-select-panel {
    outline: solid 1px;
  }
}

.mat-select-panel-animations-enabled {
  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1);
}
.mat-select-panel-animations-enabled.mat-select-panel-exit {
  animation: _mat-select-exit 100ms linear;
}

.mat-mdc-select-placeholder {
  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);
  color: var(--mat-select-placeholder-text-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {
  transition: none;
}
.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {
  color: transparent;
  -webkit-text-fill-color: transparent;
  transition: none;
  display: block;
}

.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {
  cursor: pointer;
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {
  max-width: calc(100% - 18px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {
  max-width: calc(100% / 0.75 - 24px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {
  max-width: calc(100% - 60px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {
  max-width: calc(100% - 24px);
}

.mat-mdc-select-min-line:empty::before {
  content: " ";
  white-space: pre;
  width: 1px;
  display: inline-block;
  visibility: hidden;
}

.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {
  transform: var(--mat-select-arrow-transform, translateY(-8px));
}
`],encapsulation:2,changeDetection:0})}return i})();var nu=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[Ke,ni,z,Tt,Rt,ni]})}return i})();var Ff=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["ng-component"]],hostAttrs:["cdk-text-field-style-loader",""],decls:0,vars:0,template:function(t,o){},styles:[`textarea.cdk-textarea-autosize {
  resize: none;
}

textarea.cdk-textarea-autosize-measuring {
  padding: 2px 0 !important;
  box-sizing: content-box !important;
  height: auto !important;
  overflow: hidden !important;
}

textarea.cdk-textarea-autosize-measuring-firefox {
  padding: 2px 0 !important;
  box-sizing: content-box !important;
  height: 0 !important;
}

@keyframes cdk-text-field-autofill-start { /*!*/ }
@keyframes cdk-text-field-autofill-end { /*!*/ }
.cdk-text-field-autofill-monitored:-webkit-autofill {
  animation: cdk-text-field-autofill-start 0s 1ms;
}

.cdk-text-field-autofill-monitored:not(:-webkit-autofill) {
  animation: cdk-text-field-autofill-end 0s 1ms;
}
`],encapsulation:2,changeDetection:0})}return i})(),Rf={passive:!0},iu=(()=>{class i{_platform=s(H);_ngZone=s(I);_renderer=s(Te).createRenderer(null,null);_styleLoader=s(Le);_monitoredElements=new Map;constructor(){}monitor(e){if(!this._platform.isBrowser)return ps;this._styleLoader.load(Ff);let t=qe(e),o=this._monitoredElements.get(t);if(o)return o.subject;let r=new y,a="cdk-text-field-autofilled",l=p=>{p.animationName==="cdk-text-field-autofill-start"&&!t.classList.contains(a)?(t.classList.add(a),this._ngZone.run(()=>r.next({target:p.target,isAutofilled:!0}))):p.animationName==="cdk-text-field-autofill-end"&&t.classList.contains(a)&&(t.classList.remove(a),this._ngZone.run(()=>r.next({target:p.target,isAutofilled:!1})))},c=this._ngZone.runOutsideAngular(()=>(t.classList.add("cdk-text-field-autofill-monitored"),this._renderer.listen(t,"animationstart",l,Rf)));return this._monitoredElements.set(t,{subject:r,unlisten:c}),r}stopMonitoring(e){let t=qe(e),o=this._monitoredElements.get(t);o&&(o.unlisten(),o.subject.complete(),t.classList.remove("cdk-text-field-autofill-monitored"),t.classList.remove("cdk-text-field-autofilled"),this._monitoredElements.delete(t))}ngOnDestroy(){this._monitoredElements.forEach((e,t)=>this.stopMonitoring(t))}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var ou=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({})}return i})();var ru=new g("MAT_INPUT_VALUE_ACCESSOR");var Pf=["button","checkbox","file","hidden","image","radio","range","reset","submit"],Lf=new g("MAT_INPUT_CONFIG"),Ar=(()=>{class i{_elementRef=s(A);_platform=s(H);ngControl=s($e,{optional:!0,self:!0});_autofillMonitor=s(iu);_ngZone=s(I);_formField=s(Kt,{optional:!0});_renderer=s(re);_uid=s(me).getId("mat-input-");_previousNativeValue;_inputValueAccessor;_signalBasedValueAccessor;_previousPlaceholder=null;_errorStateTracker;_config=s(Lf,{optional:!0});_cleanupIosKeyup;_cleanupWebkitWheel;_isServer=!1;_isNativeSelect=!1;_isTextarea=!1;_isInFormField=!1;focused=!1;stateChanges=new y;controlType="mat-input";autofilled=!1;get disabled(){return this._disabled}set disabled(e){this._disabled=It(e),this.focused&&(this.focused=!1,this.stateChanges.next())}_disabled=!1;get id(){return this._id}set id(e){this._id=e||this._uid}_id;placeholder;name;get required(){return this._required??this.ngControl?.control?.hasValidator(Bn.required)??!1}set required(e){this._required=It(e)}_required;get type(){return this._type}set type(e){this._type=e||"text",this._validateType(),!this._isTextarea&&Ma().has(this._type)&&(this._elementRef.nativeElement.type=this._type)}_type="text";get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}userAriaDescribedBy;get value(){return this._signalBasedValueAccessor?this._signalBasedValueAccessor.value():this._inputValueAccessor.value}set value(e){e!==this.value&&(this._signalBasedValueAccessor?this._signalBasedValueAccessor.value.set(e):this._inputValueAccessor.value=e,this.stateChanges.next())}get readonly(){return this._readonly}set readonly(e){this._readonly=It(e)}_readonly=!1;disabledInteractive;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}_neverEmptyInputTypes=["date","datetime","datetime-local","month","time","week"].filter(e=>Ma().has(e));constructor(){let e=s(Ti,{optional:!0}),t=s(Oi,{optional:!0}),o=s(ei),r=s(ru,{optional:!0,self:!0}),a=this._elementRef.nativeElement,l=a.nodeName.toLowerCase();r?Bt(r.value)?this._signalBasedValueAccessor=r:this._inputValueAccessor=r:this._inputValueAccessor=a,this._previousNativeValue=this.value,this.id=this.id,this._platform.IOS&&this._ngZone.runOutsideAngular(()=>{this._cleanupIosKeyup=this._renderer.listen(a,"keyup",this._iOSKeyupListener)}),this._errorStateTracker=new ti(o,this.ngControl,t,e,this.stateChanges),this._isServer=!this._platform.isBrowser,this._isNativeSelect=l==="select",this._isTextarea=l==="textarea",this._isInFormField=!!this._formField,this.disabledInteractive=this._config?.disabledInteractive||!1,this._isNativeSelect&&(this.controlType=a.multiple?"mat-native-select-multiple":"mat-native-select"),this._signalBasedValueAccessor&&tn(()=>{this._signalBasedValueAccessor.value(),this.stateChanges.next()})}ngAfterViewInit(){this._platform.isBrowser&&this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(e=>{this.autofilled=e.isAutofilled,this.stateChanges.next()})}ngOnChanges(){this.stateChanges.next()}ngOnDestroy(){this.stateChanges.complete(),this._platform.isBrowser&&this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement),this._cleanupIosKeyup?.(),this._cleanupWebkitWheel?.()}ngDoCheck(){this.ngControl&&(this.updateErrorState(),this.ngControl.disabled!==null&&this.ngControl.disabled!==this.disabled&&(this.disabled=this.ngControl.disabled,this.stateChanges.next())),this._dirtyCheckNativeValue(),this._dirtyCheckPlaceholder()}focus(e){this._elementRef.nativeElement.focus(e)}updateErrorState(){this._errorStateTracker.updateErrorState()}_focusChanged(e){if(e!==this.focused){if(!this._isNativeSelect&&e&&this.disabled&&this.disabledInteractive){let t=this._elementRef.nativeElement;t.type==="number"?(t.type="text",t.setSelectionRange(0,0),t.type="number"):t.setSelectionRange(0,0)}this.focused=e,this.stateChanges.next()}}_onInput(){}_dirtyCheckNativeValue(){let e=this._elementRef.nativeElement.value;this._previousNativeValue!==e&&(this._previousNativeValue=e,this.stateChanges.next())}_dirtyCheckPlaceholder(){let e=this._getPlaceholder();if(e!==this._previousPlaceholder){let t=this._elementRef.nativeElement;this._previousPlaceholder=e,e?t.setAttribute("placeholder",e):t.removeAttribute("placeholder")}}_getPlaceholder(){return this.placeholder||null}_validateType(){Pf.indexOf(this._type)>-1}_isNeverEmpty(){return this._neverEmptyInputTypes.indexOf(this._type)>-1}_isBadInput(){let e=this._elementRef.nativeElement.validity;return e&&e.badInput}get empty(){return!this._isNeverEmpty()&&!this._elementRef.nativeElement.value&&!this._isBadInput()&&!this.autofilled}get shouldLabelFloat(){if(this._isNativeSelect){let e=this._elementRef.nativeElement,t=e.options[0];return this.focused||e.multiple||!this.empty||!!(e.selectedIndex>-1&&t&&t.label)}else return this.focused&&!this.disabled||!this.empty}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let t=this._elementRef.nativeElement;e.length?t.setAttribute("aria-describedby",e.join(" ")):t.removeAttribute("aria-describedby")}onContainerClick(){this.focused||this.focus()}_isInlineSelect(){let e=this._elementRef.nativeElement;return this._isNativeSelect&&(e.multiple||e.size>1)}_iOSKeyupListener=e=>{let t=e.target;!t.value&&t.selectionStart===0&&t.selectionEnd===0&&(t.setSelectionRange(1,1),t.setSelectionRange(0,0))};_getReadonlyAttribute(){return this._isNativeSelect?null:this.readonly||this.disabled&&this.disabledInteractive?"true":null}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["input","matInput",""],["textarea","matInput",""],["select","matNativeControl",""],["input","matNativeControl",""],["textarea","matNativeControl",""]],hostAttrs:[1,"mat-mdc-input-element"],hostVars:21,hostBindings:function(t,o){t&1&&T("focus",function(){return o._focusChanged(!0)})("blur",function(){return o._focusChanged(!1)})("input",function(){return o._onInput()}),t&2&&(Ge("id",o.id)("disabled",o.disabled&&!o.disabledInteractive)("required",o.required),W("name",o.name||null)("readonly",o._getReadonlyAttribute())("aria-disabled",o.disabled&&o.disabledInteractive?"true":null)("aria-invalid",o.empty&&o.required?null:o.errorState)("aria-required",o.required)("id",o.id),M("mat-input-server",o._isServer)("mat-mdc-form-field-textarea-control",o._isInFormField&&o._isTextarea)("mat-mdc-form-field-input-control",o._isInFormField)("mat-mdc-input-disabled-interactive",o.disabledInteractive)("mdc-text-field__input",o._isInFormField)("mat-mdc-native-select-inline",o._isInlineSelect()))},inputs:{disabled:"disabled",id:"id",placeholder:"placeholder",name:"name",required:"required",type:"type",errorStateMatcher:"errorStateMatcher",userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],value:"value",readonly:"readonly",disabledInteractive:[2,"disabledInteractive","disabledInteractive",U]},exportAs:["matInput"],features:[ge([{provide:qt,useExisting:i}]),ve]})}return i})(),Mr=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[Rt,Rt,ou,z]})}return i})();var Nf=["tooltip"],Bf=20;var Vf=new g("mat-tooltip-scroll-strategy",{providedIn:"root",factory:()=>{let i=s(O);return()=>Ft(i,{scrollThrottle:Bf})}}),jf=new g("mat-tooltip-default-options",{providedIn:"root",factory:()=>({showDelay:0,hideDelay:0,touchendHideDelay:1500})});var su="tooltip-panel",zf={passive:!0},Uf=8,Hf=8,$f=24,Gf=200,ts=(()=>{class i{_elementRef=s(A);_ngZone=s(I);_platform=s(H);_ariaDescriber=s(La);_focusMonitor=s(un);_dir=s(ke);_injector=s(O);_viewContainerRef=s(dt);_mediaMatcher=s(Gn);_document=s(S);_renderer=s(re);_animationsDisabled=he();_defaultOptions=s(jf,{optional:!0});_overlayRef=null;_tooltipInstance=null;_overlayPanelClass;_portal;_position="below";_positionAtOrigin=!1;_disabled=!1;_tooltipClass;_viewInitialized=!1;_pointerExitEventsInitialized=!1;_tooltipComponent=lu;_viewportMargin=8;_currentPosition;_cssClassPrefix="mat-mdc";_ariaDescriptionPending=!1;_dirSubscribed=!1;get position(){return this._position}set position(e){e!==this._position&&(this._position=e,this._overlayRef&&(this._updatePosition(this._overlayRef),this._tooltipInstance?.show(0),this._overlayRef.updatePosition()))}get positionAtOrigin(){return this._positionAtOrigin}set positionAtOrigin(e){this._positionAtOrigin=It(e),this._detach(),this._overlayRef=null}get disabled(){return this._disabled}set disabled(e){let t=It(e);this._disabled!==t&&(this._disabled=t,t?this.hide(0):this._setupPointerEnterEventsIfNeeded(),this._syncAriaDescription(this.message))}get showDelay(){return this._showDelay}set showDelay(e){this._showDelay=At(e)}_showDelay;get hideDelay(){return this._hideDelay}set hideDelay(e){this._hideDelay=At(e),this._tooltipInstance&&(this._tooltipInstance._mouseLeaveHideDelay=this._hideDelay)}_hideDelay;touchGestures="auto";get message(){return this._message}set message(e){let t=this._message;this._message=e!=null?String(e).trim():"",!this._message&&this._isTooltipVisible()?this.hide(0):(this._setupPointerEnterEventsIfNeeded(),this._updateTooltipMessage()),this._syncAriaDescription(t)}_message="";get tooltipClass(){return this._tooltipClass}set tooltipClass(e){this._tooltipClass=e,this._tooltipInstance&&this._setTooltipClass(this._tooltipClass)}_eventCleanups=[];_touchstartTimeout=null;_destroyed=new y;_isDestroyed=!1;constructor(){let e=this._defaultOptions;e&&(this._showDelay=e.showDelay,this._hideDelay=e.hideDelay,e.position&&(this.position=e.position),e.positionAtOrigin&&(this.positionAtOrigin=e.positionAtOrigin),e.touchGestures&&(this.touchGestures=e.touchGestures),e.tooltipClass&&(this.tooltipClass=e.tooltipClass)),this._viewportMargin=Uf}ngAfterViewInit(){this._viewInitialized=!0,this._setupPointerEnterEventsIfNeeded(),this._focusMonitor.monitor(this._elementRef).pipe(le(this._destroyed)).subscribe(e=>{e?e==="keyboard"&&this._ngZone.run(()=>this.show()):this._ngZone.run(()=>this.hide(0))})}ngOnDestroy(){let e=this._elementRef.nativeElement;this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this._overlayRef&&(this._overlayRef.dispose(),this._tooltipInstance=null),this._eventCleanups.forEach(t=>t()),this._eventCleanups.length=0,this._destroyed.next(),this._destroyed.complete(),this._isDestroyed=!0,this._ariaDescriber.removeDescription(e,this.message,"tooltip"),this._focusMonitor.stopMonitoring(e)}show(e=this.showDelay,t){if(this.disabled||!this.message||this._isTooltipVisible()){this._tooltipInstance?._cancelPendingAnimations();return}let o=this._createOverlay(t);this._detach(),this._portal=this._portal||new ft(this._tooltipComponent,this._viewContainerRef);let r=this._tooltipInstance=o.attach(this._portal).instance;r._triggerElement=this._elementRef.nativeElement,r._mouseLeaveHideDelay=this._hideDelay,r.afterHidden().pipe(le(this._destroyed)).subscribe(()=>this._detach()),this._setTooltipClass(this._tooltipClass),this._updateTooltipMessage(),r.show(e)}hide(e=this.hideDelay){let t=this._tooltipInstance;t&&(t.isVisible()?t.hide(e):(t._cancelPendingAnimations(),this._detach()))}toggle(e){this._isTooltipVisible()?this.hide():this.show(void 0,e)}_isTooltipVisible(){return!!this._tooltipInstance&&this._tooltipInstance.isVisible()}_createOverlay(e){if(this._overlayRef){let a=this._overlayRef.getConfig().positionStrategy;if((!this.positionAtOrigin||!e)&&a._origin instanceof A)return this._overlayRef;this._detach()}let t=this._injector.get(_n).getAncestorScrollContainers(this._elementRef),o=`${this._cssClassPrefix}-${su}`,r=bn(this._injector,this.positionAtOrigin?e||this._elementRef:this._elementRef).withTransformOriginOn(`.${this._cssClassPrefix}-tooltip`).withFlexibleDimensions(!1).withViewportMargin(this._viewportMargin).withScrollableContainers(t).withPopoverLocation("global");return r.positionChanges.pipe(le(this._destroyed)).subscribe(a=>{this._updateCurrentPositionClass(a.connectionPair),this._tooltipInstance&&a.scrollableViewProperties.isOverlayClipped&&this._tooltipInstance.isVisible()&&this._ngZone.run(()=>this.hide(0))}),this._overlayRef=vt(this._injector,{direction:this._dir,positionStrategy:r,panelClass:this._overlayPanelClass?[...this._overlayPanelClass,o]:o,scrollStrategy:this._injector.get(Vf)(),disableAnimations:this._animationsDisabled,eventPredicate:this._overlayEventPredicate}),this._updatePosition(this._overlayRef),this._overlayRef.detachments().pipe(le(this._destroyed)).subscribe(()=>this._detach()),this._overlayRef.outsidePointerEvents().pipe(le(this._destroyed)).subscribe(()=>this._tooltipInstance?._handleBodyInteraction()),this._overlayRef.keydownEvents().pipe(le(this._destroyed)).subscribe(a=>{a.preventDefault(),a.stopPropagation(),this._ngZone.run(()=>this.hide(0))}),this._defaultOptions?.disableTooltipInteractivity&&this._overlayRef.addPanelClass(`${this._cssClassPrefix}-tooltip-panel-non-interactive`),this._dirSubscribed||(this._dirSubscribed=!0,this._dir.change.pipe(le(this._destroyed)).subscribe(()=>{this._overlayRef&&this._updatePosition(this._overlayRef)})),this._overlayRef}_detach(){this._overlayRef&&this._overlayRef.hasAttached()&&this._overlayRef.detach(),this._tooltipInstance=null}_updatePosition(e){let t=e.getConfig().positionStrategy,o=this._getOrigin(),r=this._getOverlayPosition();t.withPositions([this._addOffset(C(C({},o.main),r.main)),this._addOffset(C(C({},o.fallback),r.fallback))])}_addOffset(e){let t=Hf,o=!this._dir||this._dir.value=="ltr";return e.originY==="top"?e.offsetY=-t:e.originY==="bottom"?e.offsetY=t:e.originX==="start"?e.offsetX=o?-t:t:e.originX==="end"&&(e.offsetX=o?t:-t),e}_getOrigin(){let e=!this._dir||this._dir.value=="ltr",t=this.position,o;t=="above"||t=="below"?o={originX:"center",originY:t=="above"?"top":"bottom"}:t=="before"||t=="left"&&e||t=="right"&&!e?o={originX:"start",originY:"center"}:(t=="after"||t=="right"&&e||t=="left"&&!e)&&(o={originX:"end",originY:"center"});let{x:r,y:a}=this._invertPosition(o.originX,o.originY);return{main:o,fallback:{originX:r,originY:a}}}_getOverlayPosition(){let e=!this._dir||this._dir.value=="ltr",t=this.position,o;t=="above"?o={overlayX:"center",overlayY:"bottom"}:t=="below"?o={overlayX:"center",overlayY:"top"}:t=="before"||t=="left"&&e||t=="right"&&!e?o={overlayX:"end",overlayY:"center"}:(t=="after"||t=="right"&&e||t=="left"&&!e)&&(o={overlayX:"start",overlayY:"center"});let{x:r,y:a}=this._invertPosition(o.overlayX,o.overlayY);return{main:o,fallback:{overlayX:r,overlayY:a}}}_updateTooltipMessage(){this._tooltipInstance&&(this._tooltipInstance.message=this.message,this._tooltipInstance._markForCheck(),Me(()=>{this._tooltipInstance&&this._overlayRef.updatePosition()},{injector:this._injector}))}_setTooltipClass(e){this._tooltipInstance&&(this._tooltipInstance.tooltipClass=e instanceof Set?Array.from(e):e,this._tooltipInstance._markForCheck())}_invertPosition(e,t){return this.position==="above"||this.position==="below"?t==="top"?t="bottom":t==="bottom"&&(t="top"):e==="end"?e="start":e==="start"&&(e="end"),{x:e,y:t}}_updateCurrentPositionClass(e){let{overlayY:t,originX:o,originY:r}=e,a;if(t==="center"?this._dir&&this._dir.value==="rtl"?a=o==="end"?"left":"right":a=o==="start"?"left":"right":a=t==="bottom"&&r==="top"?"above":"below",a!==this._currentPosition){let l=this._overlayRef;if(l){let c=`${this._cssClassPrefix}-${su}-`;l.removePanelClass(c+this._currentPosition),l.addPanelClass(c+a)}this._currentPosition=a}}_setupPointerEnterEventsIfNeeded(){this._disabled||!this.message||!this._viewInitialized||this._eventCleanups.length||(this._isTouchPlatform()?this.touchGestures!=="off"&&(this._disableNativeGesturesIfNecessary(),this._addListener("touchstart",e=>{let t=e.targetTouches?.[0],o=t?{x:t.clientX,y:t.clientY}:void 0;this._setupPointerExitEventsIfNeeded(),this._touchstartTimeout&&clearTimeout(this._touchstartTimeout);let r=500;this._touchstartTimeout=setTimeout(()=>{this._touchstartTimeout=null,this.show(void 0,o)},this._defaultOptions?.touchLongPressShowDelay??r)})):this._addListener("mouseenter",e=>{this._setupPointerExitEventsIfNeeded();let t;e.x!==void 0&&e.y!==void 0&&(t=e),this.show(void 0,t)}))}_setupPointerExitEventsIfNeeded(){if(!this._pointerExitEventsInitialized){if(this._pointerExitEventsInitialized=!0,!this._isTouchPlatform())this._addListener("mouseleave",e=>{let t=e.relatedTarget;(!t||!this._overlayRef?.overlayElement.contains(t))&&this.hide()}),this._addListener("wheel",e=>{if(this._isTooltipVisible()){let t=this._document.elementFromPoint(e.clientX,e.clientY),o=this._elementRef.nativeElement;t!==o&&!o.contains(t)&&this.hide()}});else if(this.touchGestures!=="off"){this._disableNativeGesturesIfNecessary();let e=()=>{this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this.hide(this._defaultOptions?.touchendHideDelay)};this._addListener("touchend",e),this._addListener("touchcancel",e)}}}_addListener(e,t){this._eventCleanups.push(this._renderer.listen(this._elementRef.nativeElement,e,t,zf))}_isTouchPlatform(){let e=this._defaultOptions?.detectHoverCapability;return typeof e=="function"?!e():this._platform.IOS||this._platform.ANDROID?!0:this._platform.isBrowser?!!e&&this._mediaMatcher.matchMedia("(any-hover: none)").matches:!1}_disableNativeGesturesIfNecessary(){let e=this.touchGestures;if(e!=="off"){let t=this._elementRef.nativeElement,o=t.style;(e==="on"||t.nodeName!=="INPUT"&&t.nodeName!=="TEXTAREA")&&(o.userSelect=o.msUserSelect=o.webkitUserSelect=o.MozUserSelect="none"),(e==="on"||!t.draggable)&&(o.webkitUserDrag="none"),o.touchAction="none",o.webkitTapHighlightColor="transparent"}}_syncAriaDescription(e){this._ariaDescriptionPending||(this._ariaDescriptionPending=!0,this._ariaDescriber.removeDescription(this._elementRef.nativeElement,e,"tooltip"),this._isDestroyed||Me({write:()=>{this._ariaDescriptionPending=!1,this.message&&!this.disabled&&this._ariaDescriber.describe(this._elementRef.nativeElement,this.message,"tooltip")}},{injector:this._injector}))}_overlayEventPredicate=e=>e.type==="keydown"?this._isTooltipVisible()&&e.keyCode===27&&!xe(e):!0;static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["","matTooltip",""]],hostAttrs:[1,"mat-mdc-tooltip-trigger"],hostVars:2,hostBindings:function(t,o){t&2&&M("mat-mdc-tooltip-disabled",o.disabled)},inputs:{position:[0,"matTooltipPosition","position"],positionAtOrigin:[0,"matTooltipPositionAtOrigin","positionAtOrigin"],disabled:[0,"matTooltipDisabled","disabled"],showDelay:[0,"matTooltipShowDelay","showDelay"],hideDelay:[0,"matTooltipHideDelay","hideDelay"],touchGestures:[0,"matTooltipTouchGestures","touchGestures"],message:[0,"matTooltip","message"],tooltipClass:[0,"matTooltipClass","tooltipClass"]},exportAs:["matTooltip"]})}return i})(),lu=(()=>{class i{_changeDetectorRef=s(ue);_elementRef=s(A);_isMultiline=!1;message;tooltipClass;_showTimeoutId;_hideTimeoutId;_triggerElement;_mouseLeaveHideDelay;_animationsDisabled=he();_tooltip;_closeOnInteraction=!1;_isVisible=!1;_onHide=new y;_showAnimation="mat-mdc-tooltip-show";_hideAnimation="mat-mdc-tooltip-hide";constructor(){}show(e){this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=setTimeout(()=>{this._toggleVisibility(!0),this._showTimeoutId=void 0},e)}hide(e){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId=setTimeout(()=>{this._toggleVisibility(!1),this._hideTimeoutId=void 0},e)}afterHidden(){return this._onHide}isVisible(){return this._isVisible}ngOnDestroy(){this._cancelPendingAnimations(),this._onHide.complete(),this._triggerElement=null}_handleBodyInteraction(){this._closeOnInteraction&&this.hide(0)}_markForCheck(){this._changeDetectorRef.markForCheck()}_handleMouseLeave({relatedTarget:e}){(!e||!this._triggerElement.contains(e))&&(this.isVisible()?this.hide(this._mouseLeaveHideDelay):this._finalizeAnimation(!1))}_onShow(){this._isMultiline=this._isTooltipMultiline(),this._markForCheck()}_isTooltipMultiline(){let e=this._elementRef.nativeElement.getBoundingClientRect();return e.height>$f&&e.width>=Gf}_handleAnimationEnd({animationName:e}){(e===this._showAnimation||e===this._hideAnimation)&&this._finalizeAnimation(e===this._showAnimation)}_cancelPendingAnimations(){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=this._hideTimeoutId=void 0}_finalizeAnimation(e){e?this._closeOnInteraction=!0:this.isVisible()||this._onHide.next()}_toggleVisibility(e){let t=this._tooltip.nativeElement,o=this._showAnimation,r=this._hideAnimation;if(t.classList.remove(e?r:o),t.classList.add(e?o:r),this._isVisible!==e&&(this._isVisible=e,this._changeDetectorRef.markForCheck()),e&&!this._animationsDisabled&&typeof getComputedStyle=="function"){let a=getComputedStyle(t);(a.getPropertyValue("animation-duration")==="0s"||a.getPropertyValue("animation-name")==="none")&&(this._animationsDisabled=!0)}e&&this._onShow(),this._animationsDisabled&&(t.classList.add("_mat-animation-noopable"),this._finalizeAnimation(e))}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-tooltip-component"]],viewQuery:function(t,o){if(t&1&&fe(Nf,7),t&2){let r;R(r=P())&&(o._tooltip=r.first)}},hostAttrs:["aria-hidden","true"],hostBindings:function(t,o){t&1&&T("mouseleave",function(a){return o._handleMouseLeave(a)})},decls:4,vars:5,consts:[["tooltip",""],[1,"mdc-tooltip","mat-mdc-tooltip",3,"animationend"],[1,"mat-mdc-tooltip-surface","mdc-tooltip__surface"]],template:function(t,o){t&1&&(Ie(0,"div",1,0),Gs("animationend",function(a){return o._handleAnimationEnd(a)}),Ie(2,"div",2),h(3),Oe()()),t&2&&(Fe(o.tooltipClass),M("mdc-tooltip--multiline",o._isMultiline),m(3),ae(o.message))},styles:[`.mat-mdc-tooltip {
  position: relative;
  transform: scale(0);
  display: inline-flex;
}
.mat-mdc-tooltip::before {
  content: "";
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  position: absolute;
}
.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before {
  top: -8px;
}
.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before {
  bottom: -8px;
}
.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before {
  left: -8px;
}
.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before {
  right: -8px;
}
.mat-mdc-tooltip._mat-animation-noopable {
  animation: none;
  transform: scale(1);
}

.mat-mdc-tooltip-surface {
  word-break: normal;
  overflow-wrap: anywhere;
  padding: 4px 8px;
  min-width: 40px;
  max-width: 200px;
  min-height: 24px;
  max-height: 40vh;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  will-change: transform, opacity;
  background-color: var(--mat-tooltip-container-color, var(--mat-sys-inverse-surface));
  color: var(--mat-tooltip-supporting-text-color, var(--mat-sys-inverse-on-surface));
  border-radius: var(--mat-tooltip-container-shape, var(--mat-sys-corner-extra-small));
  font-family: var(--mat-tooltip-supporting-text-font, var(--mat-sys-body-small-font));
  font-size: var(--mat-tooltip-supporting-text-size, var(--mat-sys-body-small-size));
  font-weight: var(--mat-tooltip-supporting-text-weight, var(--mat-sys-body-small-weight));
  line-height: var(--mat-tooltip-supporting-text-line-height, var(--mat-sys-body-small-line-height));
  letter-spacing: var(--mat-tooltip-supporting-text-tracking, var(--mat-sys-body-small-tracking));
}
.mat-mdc-tooltip-surface::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}
.mdc-tooltip--multiline .mat-mdc-tooltip-surface {
  text-align: left;
}
[dir=rtl] .mdc-tooltip--multiline .mat-mdc-tooltip-surface {
  text-align: right;
}

.mat-mdc-tooltip-panel {
  line-height: normal;
}
.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive {
  pointer-events: none;
}

@keyframes mat-mdc-tooltip-show {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes mat-mdc-tooltip-hide {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
.mat-mdc-tooltip-show {
  animation: mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards;
}

.mat-mdc-tooltip-hide {
  animation: mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards;
}
`],encapsulation:2,changeDetection:0})}return i})();var cu=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[fn,Ke,z,Tt]})}return i})();function Yf(i,n){i&1&&Be(0,"div",2)}var Xf=new g("MAT_PROGRESS_BAR_DEFAULT_OPTIONS");var uu=(()=>{class i{_elementRef=s(A);_ngZone=s(I);_changeDetectorRef=s(ue);_renderer=s(re);_cleanupTransitionEnd;constructor(){let e=Vi(),t=s(Xf,{optional:!0});this._isNoopAnimation=e==="di-disabled",e==="reduced-motion"&&this._elementRef.nativeElement.classList.add("mat-progress-bar-reduced-motion"),t&&(t.color&&(this.color=this._defaultColor=t.color),this.mode=t.mode||this.mode)}_isNoopAnimation;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor="primary";get value(){return this._value}set value(e){this._value=du(e||0),this._changeDetectorRef.markForCheck()}_value=0;get bufferValue(){return this._bufferValue||0}set bufferValue(e){this._bufferValue=du(e||0),this._changeDetectorRef.markForCheck()}_bufferValue=0;animationEnd=new j;get mode(){return this._mode}set mode(e){this._mode=e,this._changeDetectorRef.markForCheck()}_mode="determinate";ngAfterViewInit(){this._ngZone.runOutsideAngular(()=>{this._cleanupTransitionEnd=this._renderer.listen(this._elementRef.nativeElement,"transitionend",this._transitionendHandler)})}ngOnDestroy(){this._cleanupTransitionEnd?.()}_getPrimaryBarTransform(){return`scaleX(${this._isIndeterminate()?1:this.value/100})`}_getBufferBarFlexBasis(){return`${this.mode==="buffer"?this.bufferValue:100}%`}_isIndeterminate(){return this.mode==="indeterminate"||this.mode==="query"}_transitionendHandler=e=>{this.animationEnd.observers.length===0||!e.target||!e.target.classList.contains("mdc-linear-progress__primary-bar")||(this.mode==="determinate"||this.mode==="buffer")&&this._ngZone.run(()=>this.animationEnd.next({value:this.value}))};static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-progress-bar"]],hostAttrs:["role","progressbar","aria-valuemin","0","aria-valuemax","100","tabindex","-1",1,"mat-mdc-progress-bar","mdc-linear-progress"],hostVars:10,hostBindings:function(t,o){t&2&&(W("aria-valuenow",o._isIndeterminate()?null:o.value)("mode",o.mode),Fe("mat-"+o.color),M("_mat-animation-noopable",o._isNoopAnimation)("mdc-linear-progress--animation-ready",!o._isNoopAnimation)("mdc-linear-progress--indeterminate",o._isIndeterminate()))},inputs:{color:"color",value:[2,"value","value",Xe],bufferValue:[2,"bufferValue","bufferValue",Xe],mode:"mode"},outputs:{animationEnd:"animationEnd"},exportAs:["matProgressBar"],decls:7,vars:5,consts:[["aria-hidden","true",1,"mdc-linear-progress__buffer"],[1,"mdc-linear-progress__buffer-bar"],[1,"mdc-linear-progress__buffer-dots"],["aria-hidden","true",1,"mdc-linear-progress__bar","mdc-linear-progress__primary-bar"],[1,"mdc-linear-progress__bar-inner"],["aria-hidden","true",1,"mdc-linear-progress__bar","mdc-linear-progress__secondary-bar"]],template:function(t,o){t&1&&(Ie(0,"div",0),Be(1,"div",1),B(2,Yf,1,0,"div",2),Oe(),Ie(3,"div",3),Be(4,"span",4),Oe(),Ie(5,"div",5),Be(6,"span",4),Oe()),t&2&&(m(),Vt("flex-basis",o._getBufferBarFlexBasis()),m(),V(o.mode==="buffer"?2:-1),m(),Vt("transform",o._getPrimaryBarTransform()))},styles:[`.mat-mdc-progress-bar {
  --mat-progress-bar-animation-multiplier: 1;
  display: block;
  text-align: start;
}
.mat-mdc-progress-bar[mode=query] {
  transform: scaleX(-1);
}
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-dots,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__secondary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__bar-inner.mdc-linear-progress__bar-inner {
  animation: none;
}
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-bar {
  transition: transform 1ms;
}

.mat-progress-bar-reduced-motion {
  --mat-progress-bar-animation-multiplier: 2;
}

.mdc-linear-progress {
  position: relative;
  width: 100%;
  transform: translateZ(0);
  outline: 1px solid transparent;
  overflow-x: hidden;
  transition: opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  height: max(var(--mat-progress-bar-track-height, 4px), var(--mat-progress-bar-active-indicator-height, 4px));
}
@media (forced-colors: active) {
  .mdc-linear-progress {
    outline-color: CanvasText;
  }
}

.mdc-linear-progress__bar {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  animation: none;
  transform-origin: top left;
  transition: transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  height: var(--mat-progress-bar-active-indicator-height, 4px);
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__bar {
  transition: none;
}
[dir=rtl] .mdc-linear-progress__bar {
  right: 0;
  transform-origin: center right;
}

.mdc-linear-progress__bar-inner {
  display: inline-block;
  position: absolute;
  width: 100%;
  animation: none;
  border-top-style: solid;
  border-color: var(--mat-progress-bar-active-indicator-color, var(--mat-sys-primary));
  border-top-width: var(--mat-progress-bar-active-indicator-height, 4px);
}

.mdc-linear-progress__buffer {
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  overflow: hidden;
  height: var(--mat-progress-bar-track-height, 4px);
  border-radius: var(--mat-progress-bar-track-shape, var(--mat-sys-corner-none));
}

.mdc-linear-progress__buffer-dots {
  background-image: radial-gradient(circle, var(--mat-progress-bar-track-color, var(--mat-sys-surface-variant)) calc(var(--mat-progress-bar-track-height, 4px) / 2), transparent 0);
  background-repeat: repeat-x;
  background-size: calc(calc(var(--mat-progress-bar-track-height, 4px) / 2) * 5);
  background-position: left;
  flex: auto;
  transform: rotate(180deg);
  animation: mdc-linear-progress-buffering calc(250ms * var(--mat-progress-bar-animation-multiplier)) infinite linear;
}
@media (forced-colors: active) {
  .mdc-linear-progress__buffer-dots {
    background-color: ButtonBorder;
  }
}
[dir=rtl] .mdc-linear-progress__buffer-dots {
  animation: mdc-linear-progress-buffering-reverse calc(250ms * var(--mat-progress-bar-animation-multiplier)) infinite linear;
  transform: rotate(0);
}

.mdc-linear-progress__buffer-bar {
  flex: 0 1 100%;
  transition: flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  background-color: var(--mat-progress-bar-track-color, var(--mat-sys-surface-variant));
}

.mdc-linear-progress__primary-bar {
  transform: scaleX(0);
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  left: -145.166611%;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar {
  animation: mdc-linear-progress-primary-indeterminate-translate calc(2s * var(--mat-progress-bar-animation-multiplier)) infinite linear;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar > .mdc-linear-progress__bar-inner {
  animation: mdc-linear-progress-primary-indeterminate-scale calc(2s * var(--mat-progress-bar-animation-multiplier)) infinite linear;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar {
  animation-name: mdc-linear-progress-primary-indeterminate-translate-reverse;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  right: -145.166611%;
  left: auto;
}

.mdc-linear-progress__secondary-bar {
  display: none;
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  left: -54.888891%;
  display: block;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar {
  animation: mdc-linear-progress-secondary-indeterminate-translate calc(2s * var(--mat-progress-bar-animation-multiplier)) infinite linear;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar > .mdc-linear-progress__bar-inner {
  animation: mdc-linear-progress-secondary-indeterminate-scale calc(2s * var(--mat-progress-bar-animation-multiplier)) infinite linear;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar {
  animation-name: mdc-linear-progress-secondary-indeterminate-translate-reverse;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  right: -54.888891%;
  left: auto;
}

@keyframes mdc-linear-progress-buffering {
  from {
    transform: rotate(180deg) translateX(calc(var(--mat-progress-bar-track-height, 4px) * -2.5));
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-translate {
  0% {
    transform: translateX(0);
  }
  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
  }
  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(83.67142%);
  }
  100% {
    transform: translateX(200.611057%);
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-scale {
  0% {
    transform: scaleX(0.08);
  }
  36.65% {
    animation-timing-function: cubic-bezier(0.334731, 0.12482, 0.785844, 1);
    transform: scaleX(0.08);
  }
  69.15% {
    animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);
    transform: scaleX(0.661479);
  }
  100% {
    transform: scaleX(0.08);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-translate {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
    transform: translateX(0);
  }
  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
    transform: translateX(37.651913%);
  }
  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
    transform: translateX(84.386165%);
  }
  100% {
    transform: translateX(160.277782%);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-scale {
  0% {
    animation-timing-function: cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);
    transform: scaleX(0.08);
  }
  19.15% {
    animation-timing-function: cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);
    transform: scaleX(0.457104);
  }
  44.15% {
    animation-timing-function: cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);
    transform: scaleX(0.72796);
  }
  100% {
    transform: scaleX(0.08);
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse {
  0% {
    transform: translateX(0);
  }
  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
  }
  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(-83.67142%);
  }
  100% {
    transform: translateX(-200.611057%);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
    transform: translateX(0);
  }
  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
    transform: translateX(-37.651913%);
  }
  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
    transform: translateX(-84.386165%);
  }
  100% {
    transform: translateX(-160.277782%);
  }
}
@keyframes mdc-linear-progress-buffering-reverse {
  from {
    transform: translateX(-10px);
  }
}
`],encapsulation:2,changeDetection:0})}return i})();function du(i,n=0,e=100){return Math.max(n,Math.min(e,i))}var mu=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[z]})}return i})();function Kf(i,n){}var Qt=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;positionStrategy;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;scrollStrategy;closeOnNavigation=!0;closeOnDestroy=!0;closeOnOverlayDetachments=!0;disableAnimations=!1;providers;container;templateContext};var is=(()=>{class i extends Wt{_elementRef=s(A);_focusTrapFactory=s(Oa);_config;_interactivityChecker=s(nr);_ngZone=s(I);_focusMonitor=s(un);_renderer=s(re);_changeDetectorRef=s(ue);_injector=s(O);_platform=s(H);_document=s(S);_portalOutlet;_focusTrapped=new y;_focusTrap=null;_elementFocusedBeforeDialogWasOpened=null;_closeInteractionType=null;_ariaLabelledByQueue=[];_isDestroyed=!1;constructor(){super(),this._config=s(Qt,{optional:!0})||new Qt,this._config.ariaLabelledBy&&this._ariaLabelledByQueue.push(this._config.ariaLabelledBy)}_addAriaLabelledBy(e){this._ariaLabelledByQueue.push(e),this._changeDetectorRef.markForCheck()}_removeAriaLabelledBy(e){let t=this._ariaLabelledByQueue.indexOf(e);t>-1&&(this._ariaLabelledByQueue.splice(t,1),this._changeDetectorRef.markForCheck())}_contentAttached(){this._initializeFocusTrap(),this._captureInitialFocus()}_captureInitialFocus(){this._trapFocus()}ngOnDestroy(){this._focusTrapped.complete(),this._isDestroyed=!0,this._restoreFocus()}attachComponentPortal(e){this._portalOutlet.hasAttached();let t=this._portalOutlet.attachComponentPortal(e);return this._contentAttached(),t}attachTemplatePortal(e){this._portalOutlet.hasAttached();let t=this._portalOutlet.attachTemplatePortal(e);return this._contentAttached(),t}attachDomPortal=e=>{this._portalOutlet.hasAttached();let t=this._portalOutlet.attachDomPortal(e);return this._contentAttached(),t};_recaptureFocus(){this._containsFocus()||this._trapFocus()}_forceFocus(e,t){this._interactivityChecker.isFocusable(e)||(e.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let o=()=>{r(),a(),e.removeAttribute("tabindex")},r=this._renderer.listen(e,"blur",o),a=this._renderer.listen(e,"mousedown",o)})),e.focus(t)}_focusByCssSelector(e,t){let o=this._elementRef.nativeElement.querySelector(e);o&&this._forceFocus(o,t)}_trapFocus(e){this._isDestroyed||Me(()=>{let t=this._elementRef.nativeElement;switch(this._config.autoFocus){case!1:case"dialog":this._containsFocus()||t.focus(e);break;case!0:case"first-tabbable":this._focusTrap?.focusInitialElement(e)||this._focusDialogContainer(e);break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]',e);break;default:this._focusByCssSelector(this._config.autoFocus,e);break}this._focusTrapped.next()},{injector:this._injector})}_restoreFocus(){let e=this._config.restoreFocus,t=null;if(typeof e=="string"?t=this._document.querySelector(e):typeof e=="boolean"?t=e?this._elementFocusedBeforeDialogWasOpened:null:e&&(t=e),this._config.restoreFocus&&t&&typeof t.focus=="function"){let o=dn(),r=this._elementRef.nativeElement;(!o||o===this._document.body||o===r||r.contains(o))&&(this._focusMonitor?(this._focusMonitor.focusVia(t,this._closeInteractionType),this._closeInteractionType=null):t.focus())}this._focusTrap&&this._focusTrap.destroy()}_focusDialogContainer(e){this._elementRef.nativeElement.focus?.(e)}_containsFocus(){let e=this._elementRef.nativeElement,t=dn();return e===t||e.contains(t)}_initializeFocusTrap(){this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._document&&(this._elementFocusedBeforeDialogWasOpened=dn()))}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["cdk-dialog-container"]],viewQuery:function(t,o){if(t&1&&fe(Yt,7),t&2){let r;R(r=P())&&(o._portalOutlet=r.first)}},hostAttrs:["tabindex","-1",1,"cdk-dialog-container"],hostVars:6,hostBindings:function(t,o){t&2&&W("id",o._config.id||null)("role",o._config.role)("aria-modal",o._config.ariaModal)("aria-labelledby",o._config.ariaLabel?null:o._ariaLabelledByQueue[0])("aria-label",o._config.ariaLabel)("aria-describedby",o._config.ariaDescribedBy||null)},features:[ce],decls:1,vars:0,consts:[["cdkPortalOutlet",""]],template:function(t,o){t&1&&Re(0,Kf,0,0,"ng-template",0)},dependencies:[Yt],styles:[`.cdk-dialog-container {
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}
`],encapsulation:2})}return i})(),Zi=class{overlayRef;config;componentInstance=null;componentRef=null;containerInstance;disableClose;closed=new y;backdropClick;keydownEvents;outsidePointerEvents;id;_detachSubscription;constructor(n,e){this.overlayRef=n,this.config=e,this.disableClose=e.disableClose,this.backdropClick=n.backdropClick(),this.keydownEvents=n.keydownEvents(),this.outsidePointerEvents=n.outsidePointerEvents(),this.id=e.id,this.keydownEvents.subscribe(t=>{t.keyCode===27&&!this.disableClose&&!xe(t)&&(t.preventDefault(),this.close(void 0,{focusOrigin:"keyboard"}))}),this.backdropClick.subscribe(()=>{!this.disableClose&&this._canClose()?this.close(void 0,{focusOrigin:"mouse"}):this.containerInstance._recaptureFocus?.()}),this._detachSubscription=n.detachments().subscribe(()=>{e.closeOnOverlayDetachments!==!1&&this.close()})}close(n,e){if(this._canClose(n)){let t=this.closed;this.containerInstance._closeInteractionType=e?.focusOrigin||"program",this._detachSubscription.unsubscribe(),this.overlayRef.dispose(),t.next(n),t.complete(),this.componentInstance=this.containerInstance=null}}updatePosition(){return this.overlayRef.updatePosition(),this}updateSize(n="",e=""){return this.overlayRef.updateSize({width:n,height:e}),this}addPanelClass(n){return this.overlayRef.addPanelClass(n),this}removePanelClass(n){return this.overlayRef.removePanelClass(n),this}_canClose(n){let e=this.config;return!!this.containerInstance&&(!e.closePredicate||e.closePredicate(n,e,this.componentInstance))}},Zf=new g("DialogScrollStrategy",{providedIn:"root",factory:()=>{let i=s(O);return()=>Qn(i)}}),Qf=new g("DialogData"),Jf=new g("DefaultDialogConfig");function eg(i){let n=Q(i),e=new j;return{valueSignal:n,get value(){return n()},change:e,ngOnDestroy(){e.complete()}}}var os=(()=>{class i{_injector=s(O);_defaultOptions=s(Jf,{optional:!0});_parentDialog=s(i,{optional:!0,skipSelf:!0});_overlayContainer=s(Cr);_idGenerator=s(me);_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new y;_afterOpenedAtThisLevel=new y;_ariaHiddenElements=new Map;_scrollStrategy=s(Zf);get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}afterAllClosed=Pt(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(ze(void 0)));constructor(){}open(e,t){let o=this._defaultOptions||new Qt;t=C(C({},o),t),t.id=t.id||this._idGenerator.getId("cdk-dialog-"),t.id&&this.getDialogById(t.id);let r=this._getOverlayConfig(t),a=vt(this._injector,r),l=new Zi(a,t),c=this._attachContainer(a,l,t);if(l.containerInstance=c,!this.openDialogs.length){let p=this._overlayContainer.getContainerElement();c._focusTrapped?c._focusTrapped.pipe(je(1)).subscribe(()=>{this._hideNonDialogContentFromAssistiveTechnology(p)}):this._hideNonDialogContentFromAssistiveTechnology(p)}return this._attachDialogContent(e,l,c,t),this.openDialogs.push(l),l.closed.subscribe(()=>this._removeOpenDialog(l,!0)),this.afterOpened.next(l),l}closeAll(){ns(this.openDialogs,e=>e.close())}getDialogById(e){return this.openDialogs.find(t=>t.id===e)}ngOnDestroy(){ns(this._openDialogsAtThisLevel,e=>{e.config.closeOnDestroy===!1&&this._removeOpenDialog(e,!1)}),ns(this._openDialogsAtThisLevel,e=>e.close()),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete(),this._openDialogsAtThisLevel=[]}_getOverlayConfig(e){let t=new _t({positionStrategy:e.positionStrategy||Xt().centerHorizontally().centerVertically(),scrollStrategy:e.scrollStrategy||this._scrollStrategy(),panelClass:e.panelClass,hasBackdrop:e.hasBackdrop,direction:e.direction,minWidth:e.minWidth,minHeight:e.minHeight,maxWidth:e.maxWidth,maxHeight:e.maxHeight,width:e.width,height:e.height,disposeOnNavigation:e.closeOnNavigation,disableAnimations:e.disableAnimations});return e.backdropClass&&(t.backdropClass=e.backdropClass),t}_attachContainer(e,t,o){let r=o.injector||o.viewContainerRef?.injector,a=[{provide:Qt,useValue:o},{provide:Zi,useValue:t},{provide:Kn,useValue:e}],l;o.container?typeof o.container=="function"?l=o.container:(l=o.container.type,a.push(...o.container.providers(o))):l=is;let c=new ft(l,o.viewContainerRef,O.create({parent:r||this._injector,providers:a}));return e.attach(c).instance}_attachDialogContent(e,t,o,r){if(e instanceof ct){let a=this._createInjector(r,t,o,void 0),l={$implicit:r.data,dialogRef:t};r.templateContext&&(l=C(C({},l),typeof r.templateContext=="function"?r.templateContext():r.templateContext)),o.attachTemplatePortal(new gt(e,null,l,a))}else{let a=this._createInjector(r,t,o,this._injector),l=o.attachComponentPortal(new ft(e,r.viewContainerRef,a));t.componentRef=l,t.componentInstance=l.instance}}_createInjector(e,t,o,r){let a=e.injector||e.viewContainerRef?.injector,l=[{provide:Qf,useValue:e.data},{provide:Zi,useValue:t}];return e.providers&&(typeof e.providers=="function"?l.push(...e.providers(t,e,o)):l.push(...e.providers)),e.direction&&(!a||!a.get(ke,null,{optional:!0}))&&l.push({provide:ke,useValue:eg(e.direction)}),O.create({parent:a||r,providers:l})}_removeOpenDialog(e,t){let o=this.openDialogs.indexOf(e);o>-1&&(this.openDialogs.splice(o,1),this.openDialogs.length||(this._ariaHiddenElements.forEach((r,a)=>{r?a.setAttribute("aria-hidden",r):a.removeAttribute("aria-hidden")}),this._ariaHiddenElements.clear(),t&&this._getAfterAllClosed().next()))}_hideNonDialogContentFromAssistiveTechnology(e){if(e.parentElement){let t=e.parentElement.children;for(let o=t.length-1;o>-1;o--){let r=t[o];r!==e&&r.nodeName!=="SCRIPT"&&r.nodeName!=="STYLE"&&!r.hasAttribute("aria-live")&&!r.hasAttribute("popover")&&(this._ariaHiddenElements.set(r,r.getAttribute("aria-hidden")),r.setAttribute("aria-hidden","true"))}}}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function ns(i,n){let e=i.length;for(;e--;)n(i[e])}var hu=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({providers:[os],imports:[Ke,Ot,fn,Ot]})}return i})();function tg(i,n){}var kr=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;position;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;delayFocusTrap=!0;scrollStrategy;closeOnNavigation=!0;enterAnimationDuration;exitAnimationDuration},rs="mdc-dialog--open",pu="mdc-dialog--opening",fu="mdc-dialog--closing",ng=150,ig=75,og=(()=>{class i extends is{_animationStateChanged=new j;_animationsEnabled=!he();_actionSectionCount=0;_hostElement=this._elementRef.nativeElement;_enterAnimationDuration=this._animationsEnabled?_u(this._config.enterAnimationDuration)??ng:0;_exitAnimationDuration=this._animationsEnabled?_u(this._config.exitAnimationDuration)??ig:0;_animationTimer=null;_contentAttached(){super._contentAttached(),this._startOpenAnimation()}_startOpenAnimation(){this._animationStateChanged.emit({state:"opening",totalTime:this._enterAnimationDuration}),this._animationsEnabled?(this._hostElement.style.setProperty(gu,`${this._enterAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(pu,rs)),this._waitForAnimationToComplete(this._enterAnimationDuration,this._finishDialogOpen)):(this._hostElement.classList.add(rs),Promise.resolve().then(()=>this._finishDialogOpen()))}_startExitAnimation(){this._animationStateChanged.emit({state:"closing",totalTime:this._exitAnimationDuration}),this._hostElement.classList.remove(rs),this._animationsEnabled?(this._hostElement.style.setProperty(gu,`${this._exitAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(fu)),this._waitForAnimationToComplete(this._exitAnimationDuration,this._finishDialogClose)):Promise.resolve().then(()=>this._finishDialogClose())}_updateActionSectionCount(e){this._actionSectionCount+=e,this._changeDetectorRef.markForCheck()}_finishDialogOpen=()=>{this._clearAnimationClasses(),this._openAnimationDone(this._enterAnimationDuration)};_finishDialogClose=()=>{this._clearAnimationClasses(),this._animationStateChanged.emit({state:"closed",totalTime:this._exitAnimationDuration})};_clearAnimationClasses(){this._hostElement.classList.remove(pu,fu)}_waitForAnimationToComplete(e,t){this._animationTimer!==null&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(t,e)}_requestAnimationFrame(e){this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(e):e()})}_captureInitialFocus(){this._config.delayFocusTrap||this._trapFocus()}_openAnimationDone(e){this._config.delayFocusTrap&&this._trapFocus(),this._animationStateChanged.next({state:"opened",totalTime:e})}ngOnDestroy(){super.ngOnDestroy(),this._animationTimer!==null&&clearTimeout(this._animationTimer)}attachComponentPortal(e){let t=super.attachComponentPortal(e);return t.location.nativeElement.classList.add("mat-mdc-dialog-component-host"),t}static \u0275fac=(()=>{let e;return function(o){return(e||(e=et(i)))(o||i)}})();static \u0275cmp=k({type:i,selectors:[["mat-dialog-container"]],hostAttrs:["tabindex","-1",1,"mat-mdc-dialog-container","mdc-dialog"],hostVars:10,hostBindings:function(t,o){t&2&&(Ge("id",o._config.id),W("aria-modal",o._config.ariaModal)("role",o._config.role)("aria-labelledby",o._config.ariaLabel?null:o._ariaLabelledByQueue[0])("aria-label",o._config.ariaLabel)("aria-describedby",o._config.ariaDescribedBy||null),M("_mat-animation-noopable",!o._animationsEnabled)("mat-mdc-dialog-container-with-actions",o._actionSectionCount>0))},features:[ce],decls:3,vars:0,consts:[[1,"mat-mdc-dialog-inner-container","mdc-dialog__container"],[1,"mat-mdc-dialog-surface","mdc-dialog__surface"],["cdkPortalOutlet",""]],template:function(t,o){t&1&&(d(0,"div",0)(1,"div",1),Re(2,tg,0,0,"ng-template",2),u()())},dependencies:[Yt],styles:[`.mat-mdc-dialog-container {
  width: 100%;
  height: 100%;
  display: block;
  box-sizing: border-box;
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
  outline: 0;
}

.cdk-overlay-pane.mat-mdc-dialog-panel {
  max-width: var(--mat-dialog-container-max-width, 560px);
  min-width: var(--mat-dialog-container-min-width, 280px);
}
@media (max-width: 599px) {
  .cdk-overlay-pane.mat-mdc-dialog-panel {
    max-width: var(--mat-dialog-container-small-max-width, calc(100vw - 32px));
  }
}

.mat-mdc-dialog-inner-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  height: 100%;
  opacity: 0;
  transition: opacity linear var(--mat-dialog-transition-duration, 0ms);
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
}
.mdc-dialog--closing .mat-mdc-dialog-inner-container {
  transition: opacity 75ms linear;
  transform: none;
}
.mdc-dialog--open .mat-mdc-dialog-inner-container {
  opacity: 1;
}
._mat-animation-noopable .mat-mdc-dialog-inner-container {
  transition: none;
}

.mat-mdc-dialog-surface {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  outline: 0;
  transform: scale(0.8);
  transition: transform var(--mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
  box-shadow: var(--mat-dialog-container-elevation-shadow, none);
  border-radius: var(--mat-dialog-container-shape, var(--mat-sys-corner-extra-large, 4px));
  background-color: var(--mat-dialog-container-color, var(--mat-sys-surface, white));
}
[dir=rtl] .mat-mdc-dialog-surface {
  text-align: right;
}
.mdc-dialog--open .mat-mdc-dialog-surface, .mdc-dialog--closing .mat-mdc-dialog-surface {
  transform: none;
}
._mat-animation-noopable .mat-mdc-dialog-surface {
  transition: none;
}
.mat-mdc-dialog-surface::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}

.mat-mdc-dialog-title {
  display: block;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  margin: 0 0 1px;
  padding: var(--mat-dialog-headline-padding, 6px 24px 13px);
}
.mat-mdc-dialog-title::before {
  display: inline-block;
  width: 0;
  height: 40px;
  content: "";
  vertical-align: 0;
}
[dir=rtl] .mat-mdc-dialog-title {
  text-align: right;
}
.mat-mdc-dialog-container .mat-mdc-dialog-title {
  color: var(--mat-dialog-subhead-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));
  font-family: var(--mat-dialog-subhead-font, var(--mat-sys-headline-small-font, inherit));
  line-height: var(--mat-dialog-subhead-line-height, var(--mat-sys-headline-small-line-height, 1.5rem));
  font-size: var(--mat-dialog-subhead-size, var(--mat-sys-headline-small-size, 1rem));
  font-weight: var(--mat-dialog-subhead-weight, var(--mat-sys-headline-small-weight, 400));
  letter-spacing: var(--mat-dialog-subhead-tracking, var(--mat-sys-headline-small-tracking, 0.03125em));
}

.mat-mdc-dialog-content {
  display: block;
  flex-grow: 1;
  box-sizing: border-box;
  margin: 0;
  overflow: auto;
  max-height: 65vh;
}
.mat-mdc-dialog-content > :first-child {
  margin-top: 0;
}
.mat-mdc-dialog-content > :last-child {
  margin-bottom: 0;
}
.mat-mdc-dialog-container .mat-mdc-dialog-content {
  color: var(--mat-dialog-supporting-text-color, var(--mat-sys-on-surface-variant, rgba(0, 0, 0, 0.6)));
  font-family: var(--mat-dialog-supporting-text-font, var(--mat-sys-body-medium-font, inherit));
  line-height: var(--mat-dialog-supporting-text-line-height, var(--mat-sys-body-medium-line-height, 1.5rem));
  font-size: var(--mat-dialog-supporting-text-size, var(--mat-sys-body-medium-size, 1rem));
  font-weight: var(--mat-dialog-supporting-text-weight, var(--mat-sys-body-medium-weight, 400));
  letter-spacing: var(--mat-dialog-supporting-text-tracking, var(--mat-sys-body-medium-tracking, 0.03125em));
}
.mat-mdc-dialog-container .mat-mdc-dialog-content {
  padding: var(--mat-dialog-content-padding, 20px 24px);
}
.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content {
  padding: var(--mat-dialog-with-actions-content-padding, 20px 24px 0);
}
.mat-mdc-dialog-container .mat-mdc-dialog-title + .mat-mdc-dialog-content {
  padding-top: 0;
}

.mat-mdc-dialog-actions {
  display: flex;
  position: relative;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  min-height: 52px;
  margin: 0;
  border-top: 1px solid transparent;
  padding: var(--mat-dialog-actions-padding, 16px 24px);
  justify-content: var(--mat-dialog-actions-alignment, flex-end);
}
@media (forced-colors: active) {
  .mat-mdc-dialog-actions {
    border-top-color: CanvasText;
  }
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start, .mat-mdc-dialog-actions[align=start] {
  justify-content: start;
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center, .mat-mdc-dialog-actions[align=center] {
  justify-content: center;
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end, .mat-mdc-dialog-actions[align=end] {
  justify-content: flex-end;
}
.mat-mdc-dialog-actions .mat-button-base + .mat-button-base,
.mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {
  margin-left: 8px;
}
[dir=rtl] .mat-mdc-dialog-actions .mat-button-base + .mat-button-base,
[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {
  margin-left: 0;
  margin-right: 8px;
}

.mat-mdc-dialog-component-host {
  display: contents;
}
`],encapsulation:2})}return i})(),gu="--mat-dialog-transition-duration";function _u(i){return i==null?null:typeof i=="number"?i:i.endsWith("ms")?At(i.substring(0,i.length-2)):i.endsWith("s")?At(i.substring(0,i.length-1))*1e3:i==="0"?0:null}var Ir=(function(i){return i[i.OPEN=0]="OPEN",i[i.CLOSING=1]="CLOSING",i[i.CLOSED=2]="CLOSED",i})(Ir||{}),Qi=class{_ref;_config;_containerInstance;componentInstance;componentRef=null;disableClose;id;_afterOpened=new Br(1);_beforeClosed=new Br(1);_result;_closeFallbackTimeout;_state=Ir.OPEN;_closeInteractionType;constructor(n,e,t){this._ref=n,this._config=e,this._containerInstance=t,this.disableClose=e.disableClose,this.id=n.id,n.addPanelClass("mat-mdc-dialog-panel"),t._animationStateChanged.pipe(pe(o=>o.state==="opened"),je(1)).subscribe(()=>{this._afterOpened.next(),this._afterOpened.complete()}),t._animationStateChanged.pipe(pe(o=>o.state==="closed"),je(1)).subscribe(()=>{clearTimeout(this._closeFallbackTimeout),this._finishDialogClose()}),n.overlayRef.detachments().subscribe(()=>{this._beforeClosed.next(this._result),this._beforeClosed.complete(),this._finishDialogClose()}),Ze(this.backdropClick(),this.keydownEvents().pipe(pe(o=>o.keyCode===27&&!this.disableClose&&!xe(o)))).subscribe(o=>{this.disableClose||(o.preventDefault(),vu(this,o.type==="keydown"?"keyboard":"mouse"))})}close(n){let e=this._config.closePredicate;e&&!e(n,this._config,this.componentInstance)||(this._result=n,this._containerInstance._animationStateChanged.pipe(pe(t=>t.state==="closing"),je(1)).subscribe(t=>{this._beforeClosed.next(n),this._beforeClosed.complete(),this._ref.overlayRef.detachBackdrop(),this._closeFallbackTimeout=setTimeout(()=>this._finishDialogClose(),t.totalTime+100)}),this._state=Ir.CLOSING,this._containerInstance._startExitAnimation())}afterOpened(){return this._afterOpened}afterClosed(){return this._ref.closed}beforeClosed(){return this._beforeClosed}backdropClick(){return this._ref.backdropClick}keydownEvents(){return this._ref.keydownEvents}updatePosition(n){let e=this._ref.config.positionStrategy;return n&&(n.left||n.right)?n.left?e.left(n.left):e.right(n.right):e.centerHorizontally(),n&&(n.top||n.bottom)?n.top?e.top(n.top):e.bottom(n.bottom):e.centerVertically(),this._ref.updatePosition(),this}updateSize(n="",e=""){return this._ref.updateSize(n,e),this}addPanelClass(n){return this._ref.addPanelClass(n),this}removePanelClass(n){return this._ref.removePanelClass(n),this}getState(){return this._state}_finishDialogClose(){this._state=Ir.CLOSED,this._ref.close(this._result,{focusOrigin:this._closeInteractionType}),this.componentInstance=null}};function vu(i,n,e){return i._closeInteractionType=n,i.close(e)}var rg=new g("MatMdcDialogData"),ag=new g("mat-mdc-dialog-default-options"),sg=new g("mat-mdc-dialog-scroll-strategy",{providedIn:"root",factory:()=>{let i=s(O);return()=>Qn(i)}}),Ji=(()=>{class i{_defaultOptions=s(ag,{optional:!0});_scrollStrategy=s(sg);_parentDialog=s(i,{optional:!0,skipSelf:!0});_idGenerator=s(me);_injector=s(O);_dialog=s(os);_animationsDisabled=he();_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new y;_afterOpenedAtThisLevel=new y;dialogConfigClass=kr;_dialogRefConstructor;_dialogContainerType;_dialogDataToken;get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}afterAllClosed=Pt(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(ze(void 0)));constructor(){this._dialogRefConstructor=Qi,this._dialogContainerType=og,this._dialogDataToken=rg}open(e,t){let o;t=C(C({},this._defaultOptions||new kr),t),t.id=t.id||this._idGenerator.getId("mat-mdc-dialog-"),t.scrollStrategy=t.scrollStrategy||this._scrollStrategy();let r=this._dialog.open(e,we(C({},t),{positionStrategy:Xt(this._injector).centerHorizontally().centerVertically(),disableClose:!0,closePredicate:void 0,closeOnDestroy:!1,closeOnOverlayDetachments:!1,disableAnimations:this._animationsDisabled||t.enterAnimationDuration?.toLocaleString()==="0"||t.exitAnimationDuration?.toString()==="0",container:{type:this._dialogContainerType,providers:()=>[{provide:this.dialogConfigClass,useValue:t},{provide:Qt,useValue:t}]},templateContext:()=>({dialogRef:o}),providers:(a,l,c)=>(o=new this._dialogRefConstructor(a,t,c),o.updatePosition(t?.position),[{provide:this._dialogContainerType,useValue:c},{provide:this._dialogDataToken,useValue:l.data},{provide:this._dialogRefConstructor,useValue:o}])}));return o.componentRef=r.componentRef,o.componentInstance=r.componentInstance,this.openDialogs.push(o),this.afterOpened.next(o),o.afterClosed().subscribe(()=>{let a=this.openDialogs.indexOf(o);a>-1&&(this.openDialogs.splice(a,1),this.openDialogs.length||this._getAfterAllClosed().next())}),o}closeAll(){this._closeDialogs(this.openDialogs)}getDialogById(e){return this.openDialogs.find(t=>t.id===e)}ngOnDestroy(){this._closeDialogs(this._openDialogsAtThisLevel),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete()}_closeDialogs(e){let t=e.length;for(;t--;)e[t].close()}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),bu=(()=>{class i{dialogRef=s(Qi,{optional:!0});_elementRef=s(A);_dialog=s(Ji);ariaLabel;type="button";dialogResult;_matDialogClose;constructor(){}ngOnInit(){this.dialogRef||(this.dialogRef=Du(this._elementRef,this._dialog.openDialogs))}ngOnChanges(e){let t=e._matDialogClose||e._matDialogCloseResult;t&&(this.dialogResult=t.currentValue)}_onButtonClick(e){vu(this.dialogRef,e.screenX===0&&e.screenY===0?"keyboard":"mouse",this.dialogResult)}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["","mat-dialog-close",""],["","matDialogClose",""]],hostVars:2,hostBindings:function(t,o){t&1&&T("click",function(a){return o._onButtonClick(a)}),t&2&&W("aria-label",o.ariaLabel||null)("type",o.type)},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],type:"type",dialogResult:[0,"mat-dialog-close","dialogResult"],_matDialogClose:[0,"matDialogClose","_matDialogClose"]},exportAs:["matDialogClose"],features:[ve]})}return i})(),yu=(()=>{class i{_dialogRef=s(Qi,{optional:!0});_elementRef=s(A);_dialog=s(Ji);constructor(){}ngOnInit(){this._dialogRef||(this._dialogRef=Du(this._elementRef,this._dialog.openDialogs)),this._dialogRef&&Promise.resolve().then(()=>{this._onAdd()})}ngOnDestroy(){this._dialogRef?._containerInstance&&Promise.resolve().then(()=>{this._onRemove()})}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i})}return i})(),Cu=(()=>{class i extends yu{id=s(me).getId("mat-mdc-dialog-title-");_onAdd(){this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id)}_onRemove(){this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id)}static \u0275fac=(()=>{let e;return function(o){return(e||(e=et(i)))(o||i)}})();static \u0275dir=D({type:i,selectors:[["","mat-dialog-title",""],["","matDialogTitle",""]],hostAttrs:[1,"mat-mdc-dialog-title","mdc-dialog__title"],hostVars:1,hostBindings:function(t,o){t&2&&Ge("id",o.id)},inputs:{id:"id"},exportAs:["matDialogTitle"],features:[ce]})}return i})(),xu=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["","mat-dialog-content",""],["mat-dialog-content"],["","matDialogContent",""]],hostAttrs:[1,"mat-mdc-dialog-content","mdc-dialog__content"],features:[Us([Ha])]})}return i})(),wu=(()=>{class i extends yu{align;_onAdd(){this._dialogRef._containerInstance?._updateActionSectionCount?.(1)}_onRemove(){this._dialogRef._containerInstance?._updateActionSectionCount?.(-1)}static \u0275fac=(()=>{let e;return function(o){return(e||(e=et(i)))(o||i)}})();static \u0275dir=D({type:i,selectors:[["","mat-dialog-actions",""],["mat-dialog-actions"],["","matDialogActions",""]],hostAttrs:[1,"mat-mdc-dialog-actions","mdc-dialog__actions"],hostVars:6,hostBindings:function(t,o){t&2&&M("mat-mdc-dialog-actions-align-start",o.align==="start")("mat-mdc-dialog-actions-align-center",o.align==="center")("mat-mdc-dialog-actions-align-end",o.align==="end")},inputs:{align:"align"},features:[ce]})}return i})();function Du(i,n){let e=i.nativeElement.parentElement;for(;e&&!e.classList.contains("mat-mdc-dialog-container");)e=e.parentElement;return e?n.find(t=>t.id===e.id):null}var Eu=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({providers:[Ji],imports:[hu,Ke,Ot,z]})}return i})();function cg(i,n){if(i&1){let e=Ue();d(0,"div",1)(1,"button",2),T("click",function(){ie(e);let o=b();return oe(o.action())}),h(2),u()()}if(i&2){let e=b();m(2),We(" ",e.data.action," ")}}var dg=["label"];function ug(i,n){}var mg=Math.pow(2,31)-1,eo=class{_overlayRef;instance;containerInstance;_afterDismissed=new y;_afterOpened=new y;_onAction=new y;_durationTimeoutId;_dismissedByAction=!1;constructor(n,e){this._overlayRef=e,this.containerInstance=n,n._onExit.subscribe(()=>this._finishDismiss())}dismiss(){this._afterDismissed.closed||this.containerInstance.exit(),clearTimeout(this._durationTimeoutId)}dismissWithAction(){this._onAction.closed||(this._dismissedByAction=!0,this._onAction.next(),this._onAction.complete(),this.dismiss()),clearTimeout(this._durationTimeoutId)}closeWithAction(){this.dismissWithAction()}_dismissAfter(n){this._durationTimeoutId=setTimeout(()=>this.dismiss(),Math.min(n,mg))}_open(){this._afterOpened.closed||(this._afterOpened.next(),this._afterOpened.complete())}_finishDismiss(){this._overlayRef.dispose(),this._onAction.closed||this._onAction.complete(),this._afterDismissed.next({dismissedByAction:this._dismissedByAction}),this._afterDismissed.complete(),this._dismissedByAction=!1}afterDismissed(){return this._afterDismissed}afterOpened(){return this.containerInstance._onEnter}onAction(){return this._onAction}},Su=new g("MatSnackBarData"),ii=class{politeness="polite";announcementMessage="";viewContainerRef;duration=0;panelClass;direction;data=null;horizontalPosition="center";verticalPosition="bottom"},hg=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["","matSnackBarLabel",""]],hostAttrs:[1,"mat-mdc-snack-bar-label","mdc-snackbar__label"]})}return i})(),pg=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["","matSnackBarActions",""]],hostAttrs:[1,"mat-mdc-snack-bar-actions","mdc-snackbar__actions"]})}return i})(),fg=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["","matSnackBarAction",""]],hostAttrs:[1,"mat-mdc-snack-bar-action","mdc-snackbar__action"]})}return i})(),Au=(()=>{class i{snackBarRef=s(eo);data=s(Su);constructor(){}action(){this.snackBarRef.dismissWithAction()}get hasAction(){return!!this.data.action}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["simple-snack-bar"]],hostAttrs:[1,"mat-mdc-simple-snack-bar"],exportAs:["matSnackBar"],decls:3,vars:2,consts:[["matSnackBarLabel",""],["matSnackBarActions",""],["matButton","","matSnackBarAction","",3,"click"]],template:function(t,o){t&1&&(d(0,"div",0),h(1),u(),B(2,cg,3,1,"div",1)),t&2&&(m(),We(" ",o.data.message,`
`),m(),V(o.hasAction?2:-1))},dependencies:[dr,hg,pg,fg],styles:[`.mat-mdc-simple-snack-bar {
  display: flex;
}
.mat-mdc-simple-snack-bar .mat-mdc-snack-bar-label {
  max-height: 50vh;
  overflow: auto;
}
`],encapsulation:2,changeDetection:0})}return i})(),as="_mat-snack-bar-enter",ss="_mat-snack-bar-exit",gg=(()=>{class i extends Wt{_ngZone=s(I);_elementRef=s(A);_changeDetectorRef=s(ue);_platform=s(H);_animationsDisabled=he();snackBarConfig=s(ii);_document=s(S);_trackedModals=new Set;_enterFallback;_exitFallback;_injector=s(O);_announceDelay=150;_announceTimeoutId;_destroyed=!1;_portalOutlet;_onAnnounce=new y;_onExit=new y;_onEnter=new y;_animationState="void";_live;_label;_role;_liveElementId=s(me).getId("mat-snack-bar-container-live-");constructor(){super();let e=this.snackBarConfig;e.politeness==="assertive"&&!e.announcementMessage?this._live="assertive":e.politeness==="off"?this._live="off":this._live="polite",this._platform.FIREFOX&&(this._live==="polite"&&(this._role="status"),this._live==="assertive"&&(this._role="alert"))}attachComponentPortal(e){this._assertNotAttached();let t=this._portalOutlet.attachComponentPortal(e);return this._afterPortalAttached(),t}attachTemplatePortal(e){this._assertNotAttached();let t=this._portalOutlet.attachTemplatePortal(e);return this._afterPortalAttached(),t}attachDomPortal=e=>{this._assertNotAttached();let t=this._portalOutlet.attachDomPortal(e);return this._afterPortalAttached(),t};onAnimationEnd(e){e===ss?this._completeExit():e===as&&(clearTimeout(this._enterFallback),this._ngZone.run(()=>{this._onEnter.next(),this._onEnter.complete()}))}enter(){this._destroyed||(this._animationState="visible",this._changeDetectorRef.markForCheck(),this._changeDetectorRef.detectChanges(),this._screenReaderAnnounce(),this._animationsDisabled?Me(()=>{this._ngZone.run(()=>queueMicrotask(()=>this.onAnimationEnd(as)))},{injector:this._injector}):(clearTimeout(this._enterFallback),this._enterFallback=setTimeout(()=>{this._elementRef.nativeElement.classList.add("mat-snack-bar-fallback-visible"),this.onAnimationEnd(as)},200)))}exit(){return this._destroyed?Z(void 0):(this._ngZone.run(()=>{this._animationState="hidden",this._changeDetectorRef.markForCheck(),this._elementRef.nativeElement.setAttribute("mat-exit",""),clearTimeout(this._announceTimeoutId),this._animationsDisabled?Me(()=>{this._ngZone.run(()=>queueMicrotask(()=>this.onAnimationEnd(ss)))},{injector:this._injector}):(clearTimeout(this._exitFallback),this._exitFallback=setTimeout(()=>this.onAnimationEnd(ss),200))}),this._onExit)}ngOnDestroy(){this._destroyed=!0,this._clearFromModals(),this._completeExit()}_completeExit(){clearTimeout(this._exitFallback),queueMicrotask(()=>{this._onExit.next(),this._onExit.complete()})}_afterPortalAttached(){let e=this._elementRef.nativeElement,t=this.snackBarConfig.panelClass;t&&(Array.isArray(t)?t.forEach(a=>e.classList.add(a)):e.classList.add(t)),this._exposeToModals();let o=this._label.nativeElement,r="mdc-snackbar__label";o.classList.toggle(r,!o.querySelector(`.${r}`))}_exposeToModals(){let e=this._liveElementId,t=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let o=0;o<t.length;o++){let r=t[o],a=r.getAttribute("aria-owns");this._trackedModals.add(r),a?a.indexOf(e)===-1&&r.setAttribute("aria-owns",a+" "+e):r.setAttribute("aria-owns",e)}}_clearFromModals(){this._trackedModals.forEach(e=>{let t=e.getAttribute("aria-owns");if(t){let o=t.replace(this._liveElementId,"").trim();o.length>0?e.setAttribute("aria-owns",o):e.removeAttribute("aria-owns")}}),this._trackedModals.clear()}_assertNotAttached(){this._portalOutlet.hasAttached()}_screenReaderAnnounce(){this._announceTimeoutId||this._ngZone.runOutsideAngular(()=>{this._announceTimeoutId=setTimeout(()=>{if(this._destroyed)return;let e=this._elementRef.nativeElement,t=e.querySelector("[aria-hidden]"),o=e.querySelector("[aria-live]");if(t&&o){let r=null;this._platform.isBrowser&&document.activeElement instanceof HTMLElement&&t.contains(document.activeElement)&&(r=document.activeElement),t.removeAttribute("aria-hidden"),o.appendChild(t),r?.focus(),this._onAnnounce.next(),this._onAnnounce.complete()}},this._announceDelay)})}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-snack-bar-container"]],viewQuery:function(t,o){if(t&1&&fe(Yt,7)(dg,7),t&2){let r;R(r=P())&&(o._portalOutlet=r.first),R(r=P())&&(o._label=r.first)}},hostAttrs:[1,"mdc-snackbar","mat-mdc-snack-bar-container"],hostVars:6,hostBindings:function(t,o){t&1&&T("animationend",function(a){return o.onAnimationEnd(a.animationName)})("animationcancel",function(a){return o.onAnimationEnd(a.animationName)}),t&2&&M("mat-snack-bar-container-enter",o._animationState==="visible")("mat-snack-bar-container-exit",o._animationState==="hidden")("mat-snack-bar-container-animations-enabled",!o._animationsDisabled)},features:[ce],decls:6,vars:3,consts:[["label",""],[1,"mdc-snackbar__surface","mat-mdc-snackbar-surface"],[1,"mat-mdc-snack-bar-label"],["aria-hidden","true"],["cdkPortalOutlet",""]],template:function(t,o){t&1&&(d(0,"div",1)(1,"div",2,0)(3,"div",3),Re(4,ug,0,0,"ng-template",4),u(),de(5,"div"),u()()),t&2&&(m(5),W("aria-live",o._live)("role",o._role)("id",o._liveElementId))},dependencies:[Yt],styles:[`@keyframes _mat-snack-bar-enter {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes _mat-snack-bar-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-snack-bar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  margin: 8px;
}
.mat-mdc-snack-bar-handset .mat-mdc-snack-bar-container {
  width: 100vw;
}

.mat-snack-bar-container-animations-enabled {
  opacity: 0;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-fallback-visible {
  opacity: 1;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-enter {
  animation: _mat-snack-bar-enter 150ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-exit {
  animation: _mat-snack-bar-exit 75ms cubic-bezier(0.4, 0, 1, 1) forwards;
}

.mat-mdc-snackbar-surface {
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 8px;
}
[dir=rtl] .mat-mdc-snackbar-surface {
  padding-right: 0;
  padding-left: 8px;
}
.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface {
  min-width: 344px;
  max-width: 672px;
}
.mat-mdc-snack-bar-handset .mat-mdc-snackbar-surface {
  width: 100%;
  min-width: 0;
}
@media (forced-colors: active) {
  .mat-mdc-snackbar-surface {
    outline: solid 1px;
  }
}
.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface {
  color: var(--mat-snack-bar-supporting-text-color, var(--mat-sys-inverse-on-surface));
  border-radius: var(--mat-snack-bar-container-shape, var(--mat-sys-corner-extra-small));
  background-color: var(--mat-snack-bar-container-color, var(--mat-sys-inverse-surface));
}

.mdc-snackbar__label {
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  margin: 0;
  padding: 14px 8px 14px 16px;
}
[dir=rtl] .mdc-snackbar__label {
  padding-left: 8px;
  padding-right: 16px;
}
.mat-mdc-snack-bar-container .mdc-snackbar__label {
  font-family: var(--mat-snack-bar-supporting-text-font, var(--mat-sys-body-medium-font));
  font-size: var(--mat-snack-bar-supporting-text-size, var(--mat-sys-body-medium-size));
  font-weight: var(--mat-snack-bar-supporting-text-weight, var(--mat-sys-body-medium-weight));
  line-height: var(--mat-snack-bar-supporting-text-line-height, var(--mat-sys-body-medium-line-height));
}

.mat-mdc-snack-bar-actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  box-sizing: border-box;
}

.mat-mdc-snack-bar-handset,
.mat-mdc-snack-bar-container,
.mat-mdc-snack-bar-label {
  flex: 1 1 auto;
}

.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled).mat-unthemed {
  color: var(--mat-snack-bar-button-color, var(--mat-sys-inverse-primary));
}
.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) {
  --mat-button-text-state-layer-color: currentColor;
  --mat-button-text-ripple-color: currentColor;
}
.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element {
  opacity: 0.1;
}
`],encapsulation:2})}return i})(),_g=new g("mat-snack-bar-default-options",{providedIn:"root",factory:()=>new ii}),ls=(()=>{class i{_live=s(Ni);_injector=s(O);_breakpointObserver=s(pn);_parentSnackBar=s(i,{optional:!0,skipSelf:!0});_defaultConfig=s(_g);_animationsDisabled=he();_snackBarRefAtThisLevel=null;simpleSnackBarComponent=Au;snackBarContainerComponent=gg;handsetCssClass="mat-mdc-snack-bar-handset";get _openedSnackBarRef(){let e=this._parentSnackBar;return e?e._openedSnackBarRef:this._snackBarRefAtThisLevel}set _openedSnackBarRef(e){this._parentSnackBar?this._parentSnackBar._openedSnackBarRef=e:this._snackBarRefAtThisLevel=e}constructor(){}openFromComponent(e,t){return this._attach(e,t)}openFromTemplate(e,t){return this._attach(e,t)}open(e,t="",o){let r=C(C({},this._defaultConfig),o);return r.data={message:e,action:t},r.announcementMessage===e&&(r.announcementMessage=void 0),this.openFromComponent(this.simpleSnackBarComponent,r)}dismiss(){this._openedSnackBarRef&&this._openedSnackBarRef.dismiss()}ngOnDestroy(){this._snackBarRefAtThisLevel&&this._snackBarRefAtThisLevel.dismiss()}_attachSnackBarContainer(e,t){let o=t&&t.viewContainerRef&&t.viewContainerRef.injector,r=O.create({parent:o||this._injector,providers:[{provide:ii,useValue:t}]}),a=new ft(this.snackBarContainerComponent,t.viewContainerRef,r),l=e.attach(a);return l.instance.snackBarConfig=t,l.instance}_attach(e,t){let o=C(C(C({},new ii),this._defaultConfig),t),r=this._createOverlay(o),a=this._attachSnackBarContainer(r,o),l=new eo(a,r);if(e instanceof ct){let c=new gt(e,null,{$implicit:o.data,snackBarRef:l});l.instance=a.attachTemplatePortal(c)}else{let c=this._createInjector(o,l),p=new ft(e,void 0,c),f=a.attachComponentPortal(p);l.instance=f.instance}return this._breakpointObserver.observe(sr.HandsetPortrait).pipe(le(r.detachments())).subscribe(c=>{r.overlayElement.classList.toggle(this.handsetCssClass,c.matches)}),o.announcementMessage&&a._onAnnounce.subscribe(()=>{this._live.announce(o.announcementMessage,o.politeness)}),this._animateSnackBar(l,o),this._openedSnackBarRef=l,this._openedSnackBarRef}_animateSnackBar(e,t){e.afterDismissed().subscribe(()=>{this._openedSnackBarRef==e&&(this._openedSnackBarRef=null),t.announcementMessage&&this._live.clear()}),t.duration&&t.duration>0&&e.afterOpened().subscribe(()=>e._dismissAfter(t.duration)),this._openedSnackBarRef?(this._openedSnackBarRef.afterDismissed().subscribe(()=>{e.containerInstance.enter()}),this._openedSnackBarRef.dismiss()):e.containerInstance.enter()}_createOverlay(e){let t=new _t;t.direction=e.direction;let o=Xt(this._injector),r=e.direction==="rtl",a=e.horizontalPosition==="left"||e.horizontalPosition==="start"&&!r||e.horizontalPosition==="end"&&r,l=!a&&e.horizontalPosition!=="center";return a?o.left("0"):l?o.right("0"):o.centerHorizontally(),e.verticalPosition==="top"?o.top("0"):o.bottom("0"),t.positionStrategy=o,t.disableAnimations=this._animationsDisabled,vt(this._injector,t)}_createInjector(e,t){let o=e&&e.viewContainerRef&&e.viewContainerRef.injector;return O.create({parent:o||this._injector,providers:[{provide:eo,useValue:t},{provide:Su,useValue:e.data}]})}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var Mu=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({providers:[ls],imports:[Ke,Ot,qn,Au,z]})}return i})();var vg=new g("mat-chips-default-options",{providedIn:"root",factory:()=>({separatorKeyCodes:[13]})});var Iu=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({providers:[ei,{provide:vg,useValue:{separatorKeyCodes:[13]}}],imports:[Xn,z]})}return i})();var ku=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[fn,z]})}return i})();var bg=["panel"],yg=["*"];function Cg(i,n){if(i&1&&(Ie(0,"div",1,0),$(2),Oe()),i&2){let e=n.id,t=b();Fe(t._classList),M("mat-mdc-autocomplete-visible",t.showPanel)("mat-mdc-autocomplete-hidden",!t.showPanel)("mat-autocomplete-panel-animations-enabled",!t._animationsDisabled)("mat-primary",t._color==="primary")("mat-accent",t._color==="accent")("mat-warn",t._color==="warn"),Ge("id",t.id),W("aria-label",t.ariaLabel||null)("aria-labelledby",t._getPanelAriaLabelledby(e))}}var cs=class{source;option;constructor(n,e){this.source=n,this.option=e}},Tu=new g("mat-autocomplete-default-options",{providedIn:"root",factory:()=>({autoActiveFirstOption:!1,autoSelectActiveOption:!1,hideSingleSelectionIndicator:!1,requireSelection:!1,hasBackdrop:!1})}),Ou=(()=>{class i{_changeDetectorRef=s(ue);_elementRef=s(A);_defaults=s(Tu);_animationsDisabled=he();_activeOptionChanges=Ae.EMPTY;_keyManager;showPanel=!1;get isOpen(){return this._isOpen&&this.showPanel}_isOpen=!1;_latestOpeningTrigger;_setColor(e){this._color=e,this._changeDetectorRef.markForCheck()}_color;template;panel;options;optionGroups;ariaLabel;ariaLabelledby;displayWith=null;autoActiveFirstOption;autoSelectActiveOption;requireSelection;panelWidth;disableRipple=!1;optionSelected=new j;opened=new j;closed=new j;optionActivated=new j;set classList(e){this._classList=e,this._elementRef.nativeElement.className=""}_classList;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties()}_hideSingleSelectionIndicator;_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck()}id=s(me).getId("mat-autocomplete-");inertGroups;constructor(){let e=s(H);this.inertGroups=e?.SAFARI||!1,this.autoActiveFirstOption=!!this._defaults.autoActiveFirstOption,this.autoSelectActiveOption=!!this._defaults.autoSelectActiveOption,this.requireSelection=!!this._defaults.requireSelection,this._hideSingleSelectionIndicator=this._defaults.hideSingleSelectionIndicator??!1}ngAfterContentInit(){this._keyManager=new gn(this.options).withWrap().skipPredicate(this._skipPredicate),this._activeOptionChanges=this._keyManager.change.subscribe(e=>{this.isOpen&&this.optionActivated.emit({source:this,option:this.options.toArray()[e]||null})}),this._setVisibility()}ngOnDestroy(){this._keyManager?.destroy(),this._activeOptionChanges.unsubscribe()}_setScrollTop(e){this.panel&&(this.panel.nativeElement.scrollTop=e)}_getScrollTop(){return this.panel?this.panel.nativeElement.scrollTop:0}_setVisibility(){this.showPanel=!!this.options?.length,this._changeDetectorRef.markForCheck()}_emitSelectEvent(e){let t=new cs(this,e);this.optionSelected.emit(t)}_getPanelAriaLabelledby(e){if(this.ariaLabel)return null;let t=e?e+" ":"";return this.ariaLabelledby?t+this.ariaLabelledby:e}_skipPredicate(){return!1}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-autocomplete"]],contentQueries:function(t,o,r){if(t&1&&wt(r,Ct,5)(r,Ki,5),t&2){let a;R(a=P())&&(o.options=a),R(a=P())&&(o.optionGroups=a)}},viewQuery:function(t,o){if(t&1&&fe(ct,7)(bg,5),t&2){let r;R(r=P())&&(o.template=r.first),R(r=P())&&(o.panel=r.first)}},hostAttrs:[1,"mat-mdc-autocomplete"],inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],displayWith:"displayWith",autoActiveFirstOption:[2,"autoActiveFirstOption","autoActiveFirstOption",U],autoSelectActiveOption:[2,"autoSelectActiveOption","autoSelectActiveOption",U],requireSelection:[2,"requireSelection","requireSelection",U],panelWidth:"panelWidth",disableRipple:[2,"disableRipple","disableRipple",U],classList:[0,"class","classList"],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",U]},outputs:{optionSelected:"optionSelected",opened:"opened",closed:"closed",optionActivated:"optionActivated"},exportAs:["matAutocomplete"],features:[ge([{provide:qi,useExisting:i}])],ngContentSelectors:yg,decls:1,vars:0,consts:[["panel",""],["role","listbox",1,"mat-mdc-autocomplete-panel","mdc-menu-surface","mdc-menu-surface--open",3,"id"]],template:function(t,o){t&1&&(_e(),Hs(0,Cg,3,17,"ng-template"))},styles:[`div.mat-mdc-autocomplete-panel {
  width: 100%;
  max-height: 256px;
  visibility: hidden;
  transform-origin: center top;
  overflow: auto;
  padding: 8px 0;
  box-sizing: border-box;
  position: relative;
  border-radius: var(--mat-autocomplete-container-shape, var(--mat-sys-corner-extra-small));
  box-shadow: var(--mat-autocomplete-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  background-color: var(--mat-autocomplete-background-color, var(--mat-sys-surface-container));
}
@media (forced-colors: active) {
  div.mat-mdc-autocomplete-panel {
    outline: solid 1px;
  }
}
.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  transform-origin: center bottom;
}
div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible {
  visibility: visible;
}

div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden,
.cdk-overlay-pane:has(> .mat-mdc-autocomplete-hidden) {
  visibility: hidden;
  pointer-events: none;
}

@keyframes _mat-autocomplete-enter {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.mat-autocomplete-panel-animations-enabled {
  animation: _mat-autocomplete-enter 120ms cubic-bezier(0, 0, 0.2, 1);
}

mat-autocomplete {
  display: none;
}
`],encapsulation:2,changeDetection:0})}return i})();var xg={provide:ln,useExisting:Je(()=>ds),multi:!0};var wg=new g("mat-autocomplete-scroll-strategy",{providedIn:"root",factory:()=>{let i=s(O);return()=>Ft(i)}}),ds=(()=>{class i{_environmentInjector=s(lt);_element=s(A);_injector=s(O);_viewContainerRef=s(dt);_zone=s(I);_changeDetectorRef=s(ue);_dir=s(ke,{optional:!0});_formField=s(Kt,{optional:!0,host:!0});_viewportRuler=s(bt);_scrollStrategy=s(wg);_renderer=s(re);_animationsDisabled=he();_defaults=s(Tu,{optional:!0});_overlayRef=null;_portal;_componentDestroyed=!1;_initialized=new y;_keydownSubscription;_outsideClickSubscription;_cleanupWindowBlur;_previousValue=null;_valueOnAttach=null;_valueOnLastKeydown=null;_positionStrategy;_manuallyFloatingLabel=!1;_closingActionsSubscription;_viewportSubscription=Ae.EMPTY;_breakpointObserver=s(pn);_handsetLandscapeSubscription=Ae.EMPTY;_canOpenOnNextFocus=!0;_valueBeforeAutoSelection;_pendingAutoselectedOption=null;_closeKeyEventStream=new y;_overlayPanelClass=Mt(this._defaults?.overlayPanelClass||[]);_windowBlurHandler=()=>{this._canOpenOnNextFocus=this.panelOpen||!this._hasFocus()};_onChange=()=>{};_onTouched=()=>{};autocomplete;position="auto";connectedTo;autocompleteAttribute="off";autocompleteDisabled=!1;constructor(){}_aboveClass="mat-mdc-autocomplete-panel-above";ngAfterViewInit(){this._initialized.next(),this._initialized.complete(),this._cleanupWindowBlur=this._renderer.listen("window","blur",this._windowBlurHandler)}ngOnChanges(e){e.position&&this._positionStrategy&&(this._setStrategyPositions(this._positionStrategy),this.panelOpen&&this._overlayRef.updatePosition())}ngOnDestroy(){this._cleanupWindowBlur?.(),this._handsetLandscapeSubscription.unsubscribe(),this._viewportSubscription.unsubscribe(),this._componentDestroyed=!0,this._destroyPanel(),this._closeKeyEventStream.complete(),this._clearFromModal()}get panelOpen(){return this._overlayAttached&&this.autocomplete.showPanel}_overlayAttached=!1;openPanel(){this._openPanelInternal()}closePanel(){this._resetLabel(),this._overlayAttached&&(this.panelOpen&&this._zone.run(()=>{this.autocomplete.closed.emit()}),this.autocomplete._latestOpeningTrigger===this&&(this.autocomplete._isOpen=!1,this.autocomplete._latestOpeningTrigger=null),this._overlayAttached=!1,this._pendingAutoselectedOption=null,this._overlayRef&&this._overlayRef.hasAttached()&&(this._overlayRef.detach(),this._closingActionsSubscription.unsubscribe()),this._updatePanelState(),this._componentDestroyed||this._changeDetectorRef.detectChanges(),this._trackedModal&&Gt(this._trackedModal,"aria-owns",this.autocomplete.id))}updatePosition(){this._overlayAttached&&this._overlayRef.updatePosition()}get panelClosingActions(){return Ze(this.optionSelections,this.autocomplete._keyManager.tabOut.pipe(pe(()=>this._overlayAttached)),this._closeKeyEventStream,this._getOutsideClickStream(),this._overlayRef?this._overlayRef.detachments().pipe(pe(()=>this._overlayAttached)):Z()).pipe(ee(e=>e instanceof Xi?e:null))}optionSelections=Pt(()=>{let e=this.autocomplete?this.autocomplete.options:null;return e?e.changes.pipe(ze(e),Qe(()=>Ze(...e.map(t=>t.onSelectionChange)))):this._initialized.pipe(Qe(()=>this.optionSelections))});get activeOption(){return this.autocomplete&&this.autocomplete._keyManager?this.autocomplete._keyManager.activeItem:null}_getOutsideClickStream(){return new st(e=>{let t=r=>{let a=Ee(r),l=this._formField?this._formField.getConnectedOverlayOrigin().nativeElement:null,c=this.connectedTo?this.connectedTo.elementRef.nativeElement:null;this._overlayAttached&&a!==this._element.nativeElement&&!this._hasFocus()&&(!l||!l.contains(a))&&(!c||!c.contains(a))&&this._overlayRef&&!this._overlayRef.overlayElement.contains(a)&&e.next(r)},o=[this._renderer.listen("document","click",t),this._renderer.listen("document","auxclick",t),this._renderer.listen("document","touchend",t)];return()=>{o.forEach(r=>r())}})}writeValue(e){Promise.resolve(null).then(()=>this._assignOptionValue(e))}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this._element.nativeElement.disabled=e}_handleKeydown(e){let t=e,o=t.keyCode,r=xe(t);if(o===27&&!r&&t.preventDefault(),this._valueOnLastKeydown=this._element.nativeElement.value,this.activeOption&&o===13&&this.panelOpen&&!r)this.activeOption._selectViaInteraction(),this._resetActiveItem(),t.preventDefault();else if(this.autocomplete){let a=this.autocomplete._keyManager.activeItem,l=o===38||o===40;o===9||l&&!r&&this.panelOpen?this.autocomplete._keyManager.onKeydown(t):l&&this._canOpen()&&this._openPanelInternal(this._valueOnLastKeydown),(l||this.autocomplete._keyManager.activeItem!==a)&&(this._scrollToOption(this.autocomplete._keyManager.activeItemIndex||0),this.autocomplete.autoSelectActiveOption&&this.activeOption&&(this._pendingAutoselectedOption||(this._valueBeforeAutoSelection=this._valueOnLastKeydown),this._pendingAutoselectedOption=this.activeOption,this._assignOptionValue(this.activeOption.value)))}}_handleInput(e){let t=e.target,o=t.value;if(t.type==="number"&&(o=o==""?null:parseFloat(o)),this._previousValue!==o){if(this._previousValue=o,this._pendingAutoselectedOption=null,(!this.autocomplete||!this.autocomplete.requireSelection)&&this._onChange(o),!o)this._clearPreviousSelectedOption(null,!1);else if(this.panelOpen&&!this.autocomplete.requireSelection){let r=this.autocomplete.options?.find(a=>a.selected);if(r){let a=this._getDisplayValue(r.value);o!==a&&r.deselect(!1)}}if(this._canOpen()&&this._hasFocus()){let r=this._valueOnLastKeydown??this._element.nativeElement.value;this._valueOnLastKeydown=null,this._openPanelInternal(r)}}}_handleFocus(){this._canOpenOnNextFocus?this._canOpen()&&(this._previousValue=this._element.nativeElement.value,this._attachOverlay(this._previousValue),this._floatLabel(!0)):this._canOpenOnNextFocus=!0}_handleClick(){this._canOpen()&&!this.panelOpen&&this._openPanelInternal()}_hasFocus(){return dn()===this._element.nativeElement}_floatLabel(e=!1){this._formField&&this._formField.floatLabel==="auto"&&(e?this._formField._animateAndLockLabel():this._formField.floatLabel="always",this._manuallyFloatingLabel=!0)}_resetLabel(){this._manuallyFloatingLabel&&(this._formField&&(this._formField.floatLabel="auto"),this._manuallyFloatingLabel=!1)}_subscribeToClosingActions(){let e=new st(o=>{Me(()=>{o.next()},{injector:this._environmentInjector})}),t=this.autocomplete.options?.changes.pipe(Nt(()=>this._positionStrategy.reapplyLastPosition()),bs(0))??Z();return Ze(e,t).pipe(Qe(()=>this._zone.run(()=>{let o=this.panelOpen;return this._resetActiveItem(),this._updatePanelState(),this._changeDetectorRef.detectChanges(),this.panelOpen&&this._overlayRef.updatePosition(),o!==this.panelOpen&&(this.panelOpen?this._emitOpened():this.autocomplete.closed.emit()),this.panelClosingActions})),je(1)).subscribe(o=>this._setValueAndClose(o))}_emitOpened(){this.autocomplete.opened.emit()}_destroyPanel(){this._overlayRef&&(this.closePanel(),this._overlayRef.dispose(),this._overlayRef=null)}_getDisplayValue(e){let t=this.autocomplete;return t&&t.displayWith?t.displayWith(e):e}_assignOptionValue(e){let t=this._getDisplayValue(e);e==null&&this._clearPreviousSelectedOption(null,!1),this._updateNativeInputValue(t??"")}_updateNativeInputValue(e){this._formField?this._formField._control.value=e:this._element.nativeElement.value=e,this._previousValue=e}_setValueAndClose(e){let t=this.autocomplete,o=e?e.source:this._pendingAutoselectedOption;o?(this._clearPreviousSelectedOption(o),this._assignOptionValue(o.value),this._onChange(o.value),t._emitSelectEvent(o),this._element.nativeElement.focus()):t.requireSelection&&this._element.nativeElement.value!==this._valueOnAttach&&(this._clearPreviousSelectedOption(null),this._assignOptionValue(null),this._onChange(null)),this.closePanel()}_clearPreviousSelectedOption(e,t){this.autocomplete?.options?.forEach(o=>{o!==e&&o.selected&&o.deselect(t)})}_openPanelInternal(e=this._element.nativeElement.value){if(this._attachOverlay(e),this._floatLabel(),this._trackedModal){let t=this.autocomplete.id;Yn(this._trackedModal,"aria-owns",t)}}_attachOverlay(e){if(!this.autocomplete)return;let t=this._overlayRef;t?(this._positionStrategy.setOrigin(this._getConnectedElement()),t.updateSize({width:this._getPanelWidth()})):(this._portal=new gt(this.autocomplete.template,this._viewContainerRef,{id:this._formField?.getLabelId()}),t=vt(this._injector,this._getOverlayConfig()),this._overlayRef=t,this._viewportSubscription=this._viewportRuler.change().subscribe(()=>{this.panelOpen&&t&&t.updateSize({width:this._getPanelWidth()})}),this._handsetLandscapeSubscription=this._breakpointObserver.observe(sr.HandsetLandscape).subscribe(r=>{r.matches?this._positionStrategy.withFlexibleDimensions(!0).withGrowAfterOpen(!0).withViewportMargin(8):this._positionStrategy.withFlexibleDimensions(!1).withGrowAfterOpen(!1).withViewportMargin(0)})),t&&!t.hasAttached()&&(t.attach(this._portal),this._valueOnAttach=e,this._valueOnLastKeydown=null,this._closingActionsSubscription=this._subscribeToClosingActions());let o=this.panelOpen;this.autocomplete._isOpen=this._overlayAttached=!0,this.autocomplete._latestOpeningTrigger=this,this.autocomplete._setColor(this._formField?.color),this._updatePanelState(),this._applyModalPanelOwnership(),this.panelOpen&&o!==this.panelOpen&&this._emitOpened()}_handlePanelKeydown=e=>{(e.keyCode===27&&!xe(e)||e.keyCode===38&&xe(e,"altKey"))&&(this._pendingAutoselectedOption&&(this._updateNativeInputValue(this._valueBeforeAutoSelection??""),this._pendingAutoselectedOption=null),this._closeKeyEventStream.next(),this._resetActiveItem(),e.stopPropagation(),e.preventDefault())};_updatePanelState(){if(this.autocomplete._setVisibility(),this.panelOpen){let e=this._overlayRef;this._keydownSubscription||(this._keydownSubscription=e.keydownEvents().subscribe(this._handlePanelKeydown)),this._outsideClickSubscription||(this._outsideClickSubscription=e.outsidePointerEvents().subscribe())}else this._keydownSubscription?.unsubscribe(),this._outsideClickSubscription?.unsubscribe(),this._keydownSubscription=this._outsideClickSubscription=void 0}_getOverlayConfig(){return new _t({positionStrategy:this._getOverlayPosition(),scrollStrategy:this._scrollStrategy(),width:this._getPanelWidth(),direction:this._dir??void 0,hasBackdrop:this._defaults?.hasBackdrop,backdropClass:this._defaults?.backdropClass||"cdk-overlay-transparent-backdrop",panelClass:this._overlayPanelClass,disableAnimations:this._animationsDisabled})}_getOverlayPosition(){let e=bn(this._injector,this._getConnectedElement()).withFlexibleDimensions(!1).withPush(!1).withPopoverLocation("inline");return this._setStrategyPositions(e),this._positionStrategy=e,e}_setStrategyPositions(e){let t=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"}],o=this._aboveClass,r=[{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom",panelClass:o},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom",panelClass:o}],a;this.position==="above"?a=r:this.position==="below"?a=t:a=[...t,...r],e.withPositions(a)}_getConnectedElement(){return this.connectedTo?this.connectedTo.elementRef:this._formField?this._formField.getConnectedOverlayOrigin():this._element}_getPanelWidth(){return this.autocomplete.panelWidth||this._getHostWidth()}_getHostWidth(){return this._getConnectedElement().nativeElement.getBoundingClientRect().width}_resetActiveItem(){let e=this.autocomplete;if(e.autoActiveFirstOption){let t=-1;for(let o=0;o<e.options.length;o++)if(!e.options.get(o).disabled){t=o;break}e._keyManager.setActiveItem(t)}else e._keyManager.setActiveItem(-1)}_canOpen(){let e=this._element.nativeElement;return!e.readOnly&&!e.disabled&&!this.autocompleteDisabled}_scrollToOption(e){let t=this.autocomplete,o=Er(e,t.options,t.optionGroups);if(e===0&&o===1)t._setScrollTop(0);else if(t.panel){let r=t.options.toArray()[e];if(r){let a=r._getHostElement(),l=Sr(a.offsetTop,a.offsetHeight,t._getScrollTop(),t.panel.nativeElement.offsetHeight);t._setScrollTop(l)}}}_trackedModal=null;_applyModalPanelOwnership(){let e=this._element.nativeElement.closest('body > .cdk-overlay-container [aria-modal="true"]');if(!e)return;let t=this.autocomplete.id;this._trackedModal&&Gt(this._trackedModal,"aria-owns",t),Yn(e,"aria-owns",t),this._trackedModal=e}_clearFromModal(){if(this._trackedModal){let e=this.autocomplete.id;Gt(this._trackedModal,"aria-owns",e),this._trackedModal=null}}static \u0275fac=function(t){return new(t||i)};static \u0275dir=D({type:i,selectors:[["input","matAutocomplete",""],["textarea","matAutocomplete",""]],hostAttrs:[1,"mat-mdc-autocomplete-trigger"],hostVars:7,hostBindings:function(t,o){t&1&&T("focusin",function(){return o._handleFocus()})("blur",function(){return o._onTouched()})("input",function(a){return o._handleInput(a)})("keydown",function(a){return o._handleKeydown(a)})("click",function(){return o._handleClick()}),t&2&&W("autocomplete",o.autocompleteAttribute)("role",o.autocompleteDisabled?null:"combobox")("aria-autocomplete",o.autocompleteDisabled?null:"list")("aria-activedescendant",o.panelOpen&&o.activeOption?o.activeOption.id:null)("aria-expanded",o.autocompleteDisabled?null:o.panelOpen.toString())("aria-controls",o.autocompleteDisabled||!o.panelOpen||o.autocomplete==null?null:o.autocomplete.id)("aria-haspopup",o.autocompleteDisabled?null:"listbox")},inputs:{autocomplete:[0,"matAutocomplete","autocomplete"],position:[0,"matAutocompletePosition","position"],connectedTo:[0,"matAutocompleteConnectedTo","connectedTo"],autocompleteAttribute:[0,"autocomplete","autocompleteAttribute"],autocompleteDisabled:[2,"matAutocompleteDisabled","autocompleteDisabled",U]},exportAs:["matAutocompleteTrigger"],features:[ge([xg]),ve]})}return i})(),Fu=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[Ke,ni,Tt,ni,z]})}return i})();var Dg=["determinateSpinner"];function Eg(i,n){if(i&1&&(wn(),d(0,"svg",11),de(1,"circle",12),u()),i&2){let e=b();W("viewBox",e._viewBox()),m(),Vt("stroke-dasharray",e._strokeCircumference(),"px")("stroke-dashoffset",e._strokeCircumference()/2,"px")("stroke-width",e._circleStrokeWidth(),"%"),W("r",e._circleRadius())}}var Sg=new g("mat-progress-spinner-default-options",{providedIn:"root",factory:()=>({diameter:Pu})}),Pu=100,Ag=10,Lu=(()=>{class i{_elementRef=s(A);_noopAnimations;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor="primary";_determinateCircle;constructor(){let e=s(Sg),t=Vi(),o=this._elementRef.nativeElement;this._noopAnimations=t==="di-disabled"&&!!e&&!e._forceAnimations,this.mode=o.nodeName.toLowerCase()==="mat-spinner"?"indeterminate":"determinate",!this._noopAnimations&&t==="reduced-motion"&&o.classList.add("mat-progress-spinner-reduced-motion"),e&&(e.color&&(this.color=this._defaultColor=e.color),e.diameter&&(this.diameter=e.diameter),e.strokeWidth&&(this.strokeWidth=e.strokeWidth))}mode;get value(){return this.mode==="determinate"?this._value:0}set value(e){this._value=Math.max(0,Math.min(100,e||0))}_value=0;get diameter(){return this._diameter}set diameter(e){this._diameter=e||0}_diameter=Pu;get strokeWidth(){return this._strokeWidth??this.diameter/10}set strokeWidth(e){this._strokeWidth=e||0}_strokeWidth;_circleRadius(){return(this.diameter-Ag)/2}_viewBox(){let e=this._circleRadius()*2+this.strokeWidth;return`0 0 ${e} ${e}`}_strokeCircumference(){return 2*Math.PI*this._circleRadius()}_strokeDashOffset(){return this.mode==="determinate"?this._strokeCircumference()*(100-this._value)/100:null}_circleStrokeWidth(){return this.strokeWidth/this.diameter*100}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=k({type:i,selectors:[["mat-progress-spinner"],["mat-spinner"]],viewQuery:function(t,o){if(t&1&&fe(Dg,5),t&2){let r;R(r=P())&&(o._determinateCircle=r.first)}},hostAttrs:["role","progressbar","tabindex","-1",1,"mat-mdc-progress-spinner","mdc-circular-progress"],hostVars:18,hostBindings:function(t,o){t&2&&(W("aria-valuemin",0)("aria-valuemax",100)("aria-valuenow",o.mode==="determinate"?o.value:null)("mode",o.mode),Fe("mat-"+o.color),Vt("width",o.diameter,"px")("height",o.diameter,"px")("--mat-progress-spinner-size",o.diameter+"px")("--mat-progress-spinner-active-indicator-width",o.diameter+"px"),M("_mat-animation-noopable",o._noopAnimations)("mdc-circular-progress--indeterminate",o.mode==="indeterminate"))},inputs:{color:"color",mode:"mode",value:[2,"value","value",Xe],diameter:[2,"diameter","diameter",Xe],strokeWidth:[2,"strokeWidth","strokeWidth",Xe]},exportAs:["matProgressSpinner"],decls:14,vars:11,consts:[["circle",""],["determinateSpinner",""],["aria-hidden","true",1,"mdc-circular-progress__determinate-container"],["xmlns","http://www.w3.org/2000/svg","focusable","false",1,"mdc-circular-progress__determinate-circle-graphic"],["cx","50%","cy","50%",1,"mdc-circular-progress__determinate-circle"],["aria-hidden","true",1,"mdc-circular-progress__indeterminate-container"],[1,"mdc-circular-progress__spinner-layer"],[1,"mdc-circular-progress__circle-clipper","mdc-circular-progress__circle-left"],[3,"ngTemplateOutlet"],[1,"mdc-circular-progress__gap-patch"],[1,"mdc-circular-progress__circle-clipper","mdc-circular-progress__circle-right"],["xmlns","http://www.w3.org/2000/svg","focusable","false",1,"mdc-circular-progress__indeterminate-circle-graphic"],["cx","50%","cy","50%"]],template:function(t,o){if(t&1&&(Re(0,Eg,2,8,"ng-template",null,0,jt),d(2,"div",2,1),wn(),d(4,"svg",3),de(5,"circle",4),u()(),Ds(),d(6,"div",5)(7,"div",6)(8,"div",7),uo(9,8),u(),d(10,"div",9),uo(11,8),u(),d(12,"div",10),uo(13,8),u()()()),t&2){let r=nt(1);m(4),W("viewBox",o._viewBox()),m(),Vt("stroke-dasharray",o._strokeCircumference(),"px")("stroke-dashoffset",o._strokeDashOffset(),"px")("stroke-width",o._circleStrokeWidth(),"%"),W("r",o._circleRadius()),m(4),L("ngTemplateOutlet",r),m(2),L("ngTemplateOutlet",r),m(2),L("ngTemplateOutlet",r)}},dependencies:[gi],styles:[`.mat-mdc-progress-spinner {
  --mat-progress-spinner-animation-multiplier: 1;
  display: block;
  overflow: hidden;
  line-height: 0;
  position: relative;
  direction: ltr;
  transition: opacity 250ms cubic-bezier(0.4, 0, 0.6, 1);
}
.mat-mdc-progress-spinner circle {
  stroke-width: var(--mat-progress-spinner-active-indicator-width, 4px);
}
.mat-mdc-progress-spinner._mat-animation-noopable, .mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__determinate-circle {
  transition: none !important;
}
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-circle-graphic,
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__spinner-layer,
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-container {
  animation: none !important;
}
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-container circle {
  stroke-dasharray: 0 !important;
}
@media (forced-colors: active) {
  .mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic,
  .mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle {
    stroke: currentColor;
    stroke: CanvasText;
  }
}

.mat-progress-spinner-reduced-motion {
  --mat-progress-spinner-animation-multiplier: 1.25;
}

.mdc-circular-progress__determinate-container,
.mdc-circular-progress__indeterminate-circle-graphic,
.mdc-circular-progress__indeterminate-container,
.mdc-circular-progress__spinner-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.mdc-circular-progress__determinate-container {
  transform: rotate(-90deg);
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__determinate-container {
  opacity: 0;
}

.mdc-circular-progress__indeterminate-container {
  font-size: 0;
  letter-spacing: 0;
  white-space: nowrap;
  opacity: 0;
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__indeterminate-container {
  opacity: 1;
  animation: mdc-circular-progress-container-rotate calc(1568.2352941176ms * var(--mat-progress-spinner-animation-multiplier)) linear infinite;
}

.mdc-circular-progress__determinate-circle-graphic,
.mdc-circular-progress__indeterminate-circle-graphic {
  fill: transparent;
}

.mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle,
.mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic {
  stroke: var(--mat-progress-spinner-active-indicator-color, var(--mat-sys-primary));
}
@media (forced-colors: active) {
  .mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle,
  .mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic {
    stroke: CanvasText;
  }
}

.mdc-circular-progress__determinate-circle {
  transition: stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);
}

.mdc-circular-progress__gap-patch {
  position: absolute;
  top: 0;
  left: 47.5%;
  box-sizing: border-box;
  width: 5%;
  height: 100%;
  overflow: hidden;
}

.mdc-circular-progress__gap-patch .mdc-circular-progress__indeterminate-circle-graphic {
  left: -900%;
  width: 2000%;
  transform: rotate(180deg);
}
.mdc-circular-progress__circle-clipper .mdc-circular-progress__indeterminate-circle-graphic {
  width: 200%;
}
.mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic {
  left: -100%;
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-left .mdc-circular-progress__indeterminate-circle-graphic {
  animation: mdc-circular-progress-left-spin calc(1333ms * var(--mat-progress-spinner-animation-multiplier)) cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic {
  animation: mdc-circular-progress-right-spin calc(1333ms * var(--mat-progress-spinner-animation-multiplier)) cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.mdc-circular-progress__circle-clipper {
  display: inline-flex;
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
}

.mdc-circular-progress--indeterminate .mdc-circular-progress__spinner-layer {
  animation: mdc-circular-progress-spinner-layer-rotate calc(5332ms * var(--mat-progress-spinner-animation-multiplier)) cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

@keyframes mdc-circular-progress-container-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes mdc-circular-progress-spinner-layer-rotate {
  12.5% {
    transform: rotate(135deg);
  }
  25% {
    transform: rotate(270deg);
  }
  37.5% {
    transform: rotate(405deg);
  }
  50% {
    transform: rotate(540deg);
  }
  62.5% {
    transform: rotate(675deg);
  }
  75% {
    transform: rotate(810deg);
  }
  87.5% {
    transform: rotate(945deg);
  }
  100% {
    transform: rotate(1080deg);
  }
}
@keyframes mdc-circular-progress-left-spin {
  from {
    transform: rotate(265deg);
  }
  50% {
    transform: rotate(130deg);
  }
  to {
    transform: rotate(265deg);
  }
}
@keyframes mdc-circular-progress-right-spin {
  from {
    transform: rotate(-265deg);
  }
  50% {
    transform: rotate(-130deg);
  }
  to {
    transform: rotate(-265deg);
  }
}
`],encapsulation:2,changeDetection:0})}return i})();var Nu=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=w({type:i});static \u0275inj=x({imports:[z]})}return i})();var Tr={production:!0,terminologyServer:"https://implementation-demo.snomedtools.org/fhir",editionUri:"http://snomed.info/sct",displayLanguage:"en"};var Or=[{label:"Hallazgo cl\xEDnico",ecl:"<<404684003",search:"Buscar hallazgo cl\xEDnico\u2026"},{label:"Procedimiento",ecl:"<<71388002",search:"Buscar procedimiento\u2026"},{label:"F\xE1rmaco",ecl:"<<373873005",search:"Buscar f\xE1rmaco\u2026"}],Bu=["Activo","Negado"],Vu=["Confirmado","Sospecha","Diferencial"],ju=["Actual","Hist\xF3rico"],zu=["Paciente","Familiar"],Uu=10,Fr=Tr.terminologyServer,Rr=Tr.editionUri,Hu=Tr.displayLanguage,us="http://snomed.info/sct/11000221109",$u="es",Gu="http://snomed.info/sct",Wu="en";function to(){return{cat:"",sctid:"",term:"",textoLiteral:"",pol:"Activo",cert:"Confirmado",temp:"Actual",suj:"Paciente"}}function Yu(i){let n=Or.find(e=>e.label===i);return n?n.ecl:""}var oi=class i{constructor(n){this.http=n}http;terminologyServer=Fr;editionUri=Rr;displayLanguage=Hu;setTerminologyServer(n){this.terminologyServer=(n||"").replace(/\/$/,"")}setEditionUri(n){this.editionUri=n||""}detectEdition(n){let e=(n||this.terminologyServer||"").replace(/\/$/,""),t={editionUri:Gu,displayLanguage:Wu,label:"Internacional (en)",isArgentina:!1};if(!e)return this.applyEdition(t),Z(t);let o=new rt({Accept:"application/fhir+json"});return this.http.get(`${e}/CodeSystem?_elements=version,url`,{headers:o}).pipe(ee(r=>{let l=(r?.entry??[]).some(c=>String(c?.resource?.version??"").startsWith(us))?{editionUri:us,displayLanguage:$u,label:"Argentina (es)",isArgentina:!0}:t;return this.applyEdition(l),l}),Lt(()=>(this.applyEdition(t),Z(t))))}applyEdition(n){this.editionUri=n.editionUri,this.displayLanguage=n.displayLanguage}expandBindingAnswerValueSet(n,e,t=0,o=50,r,a,l=!1){let c=(n?.ecl??"").trim();if(!c)return Z({expansion:{contains:[]}});let p=(r||this.terminologyServer||"").replace(/\/$/,""),f=a||this.editionUri;if(!p)return Z({expansion:{contains:[]}});let v=typeof e=="string"?e:"",F=this.displayLanguage,q=`${p}/ValueSet/$expand?url=${encodeURIComponent(f)}?fhir_vs=ecl/${encodeURIComponent(c)}&count=${o}&offset=${t}&filter=${encodeURIComponent(v)}&language=${F}&displayLanguage=${F}`,Y=new rt({Accept:"application/fhir+json","Accept-Language":F});return this.http.get(q,{headers:Y}).pipe(Lt(J=>(console.error("ValueSet $expand failed:",J),Z({expansion:{contains:[]}}))))}lookupConcept(n,e,t){let o=(e||this.terminologyServer||"").replace(/\/$/,""),r=t||this.editionUri;if(!o||!n)return Z(null);let a=`${o}/CodeSystem/$lookup?system=http://snomed.info/sct&code=${encodeURIComponent(n)}`;r&&r!=="http://snomed.info/sct"&&(a+=`&version=${encodeURIComponent(r)}`);let l=new rt({Accept:"application/fhir+json","Accept-Language":this.displayLanguage});return this.http.get(a,{headers:l}).pipe(ee(c=>{let p=c?.parameter??[],f=p.find(F=>F.name==="display")?.valueString??"",v=p.find(F=>F.name==="inactive")?.valueBoolean??!1;return f?{code:n,display:f,inactive:v}:null}),Lt(()=>Z(null)))}static \u0275fac=function(e){return new(e||i)(N(Ut))};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})};var kg=["inputElement"],Tg=(i,n)=>n.code;function Og(i,n){if(i&1&&(d(0,"mat-label"),h(1),u()),i&2){let e=b();m(),ae(e.binding.title)}}function Fg(i,n){if(i&1&&(d(0,"mat-hint"),de(1,"span",8),u()),i&2){let e=b();m(),L("innerHTML",e.binding.note,Bs)}}function Rg(i,n){if(i&1){let e=Ue();d(0,"button",9),T("click",function(){ie(e);let o=b();return oe(o.clearInput())}),d(1,"mat-icon"),h(2,"close"),u()()}}function Pg(i,n){if(i&1&&h(0),i&2){let e=b(2);We(" ",e.binding.title||"This field"," is required ")}}function Lg(i,n){i&1&&h(0," Please select a valid value ")}function Ng(i,n){if(i&1&&(d(0,"mat-error"),B(1,Pg,1,1)(2,Lg,1,0),u()),i&2){let e=b();m(),V(e.hasRequiredError()?1:2)}}function Bg(i,n){if(i&1&&(d(0,"mat-option",6),de(1,"mat-spinner",10),u()),i&2){let e=b();m(),L("diameter",e.compact?24:35)}}function Vg(i,n){if(i&1&&(d(0,"mat-option",7),h(1),u()),i&2){let e=n.$implicit;L("value",e),m(),We(" ",e.display," ")}}var Pr=class i{constructor(n,e,t){this.terminologyService=n;this.injector=e;this.cdr=t}terminologyService;injector;cdr;binding;term="";readonly=!1;terminologyServer;editionUri;appearance="fill";compact=!1;allowWildcard=!1;selectionChange=new j;cleared=new j;inputElement;formControl=new vc;autoFilter;loading=!1;selectedConcept={};static nextId=0;stateChanges=new y;focused=!1;errorState=!1;controlType="app-autocomplete-binding";id=`app-autocomplete-binding-${i.nextId++}`;describedBy="";ngControl=null;hasAttemptedNgControlInjection=!1;onChange=()=>{};onTouched=()=>{};get empty(){return!this.formControl.value}setDescribedByIds(n){this.describedBy=n.join(" ")}onContainerClick(n){}writeValue(n){n&&typeof n=="object"&&n.display?(this.formControl.setValue(n.display,{emitEvent:!1}),this.selectedConcept=n):(this.formControl.setValue(n,{emitEvent:!1}),this.selectedConcept=n&&typeof n=="object"?n:{})}registerOnChange(n){this.onChange=n}registerOnTouched(n){this.onTouched=n}ngOnInit(){this.readonly&&this.formControl.disable(),this.setupAutoFilter()}ngAfterViewInit(){this.hasAttemptedNgControlInjection||(this.hasAttemptedNgControlInjection=!0,setTimeout(()=>{try{let n=this.injector.get($e,null);if(n&&n.control){this.ngControl=n;let e=n.control;e.validator&&(this.formControl.setValidators(e.validator),this.formControl.updateValueAndValidity({emitEvent:!1})),e.asyncValidator&&this.formControl.setAsyncValidators(e.asyncValidator),e.statusChanges.subscribe(()=>{this.syncValidationState()}),this.updateErrorState()}}catch{this.ngControl=null}},100))}syncValidationState(){if(this.ngControl&&this.ngControl.control){let n=this.ngControl.control;n.invalid&&(n.dirty||n.touched)?(this.formControl.setErrors(n.errors,{emitEvent:!1}),n.touched&&this.formControl.markAsTouched({onlySelf:!0}),n.dirty&&this.formControl.markAsDirty({onlySelf:!0})):n.valid&&this.formControl.setErrors(null,{emitEvent:!1}),this.updateErrorState()}}ngDoCheck(){if(!this.ngControl&&!this.hasAttemptedNgControlInjection)try{if(this.ngControl=this.injector.get($e,null),this.ngControl&&this.ngControl.control){let e=this.ngControl.control;e.validator&&(this.formControl.setValidators(e.validator),this.formControl.updateValueAndValidity({emitEvent:!1}))}}catch{}this.ngControl&&this.ngControl.control&&this.syncValidationState();let n=this.errorState;this.updateErrorState(),n!==this.errorState&&this.stateChanges.next()}updateErrorState(){if(this.ngControl&&this.ngControl.control){let n=this.ngControl.control;this.errorState=!!(n.invalid&&(n.dirty||n.touched))}else this.errorState=!1}hasRequiredError(){return!!this.ngControl?.control?.hasError("required")}setupAutoFilter(){this.autoFilter=this.formControl.valueChanges.pipe(Cn(300),si(),Qe(n=>this.readonly?Z([]):n?.length>=3?(this.loading=!0,no(Z([]),this.getExpansionObservable(n).pipe(ee(e=>e?.expansion?.contains??[]),Lt(e=>(console.error("Error expanding value set:",e),Z([]))),xn(()=>this.loading=!1)))):Z([])))}getExpansionObservable(n){return this.terminologyServer||this.editionUri?this.terminologyService.expandBindingAnswerValueSet(this.binding,n,0,50,this.terminologyServer||"",this.editionUri||"",!1):this.terminologyService.expandBindingAnswerValueSet(this.binding,n,0,50,void 0,void 0,!1)}ngOnChanges(n){n.readonly&&(this.readonly?this.formControl.disable():this.formControl.enable()),n.term&&(this.term=n.term.currentValue,this.term&&typeof this.term=="object"&&this.term.display?(this.formControl.setValue(this.term.display),this.selectedConcept=this.term):(this.formControl.setValue(this.term),this.selectedConcept={})),(n.terminologyServer||n.editionUri)&&this.setupAutoFilter()}onTermChange(){this.formControl.setValue(this.term)}optionSelected(n){this.selectedConcept=n,this.selectionChange.emit(n),this.onChange(n)}clearInput(){this.formControl.reset(),this.selectedConcept={code:"",display:""},this.selectionChange.emit(this.selectedConcept),this.cleared.emit(null)}change(n){let e=n?.option?.value;if(e){let t={code:e.code,display:e.display};this.selectedConcept=t,this.optionSelected(t),this.formControl.setValue(e.display),this.updateErrorState()}}onBlur(){this.focused=!1,this.onTouched();let n=(this.formControl.value??"").toString().trim();if(this.allowWildcard&&n==="*"&&(this.selectedConcept={code:"*",display:"*"},this.selectionChange.emit(this.selectedConcept),this.onChange(this.selectedConcept)),this.ngControl&&this.ngControl.control){let e=this.ngControl.control;e.invalid&&(this.formControl.setErrors(e.errors),this.formControl.markAsTouched())}setTimeout(()=>{this.updateErrorState(),this.stateChanges.next()},0)}onFocus(){this.focused=!0,this.stateChanges.next()}focus(){this.inputElement?.nativeElement&&this.inputElement.nativeElement.focus()}static \u0275fac=function(e){return new(e||i)(X(oi),X(O),X(ue))};static \u0275cmp=k({type:i,selectors:[["app-autocomplete-binding"]],viewQuery:function(e,t){if(e&1&&fe(kg,5),e&2){let o;R(o=P())&&(t.inputElement=o.first)}},inputs:{binding:"binding",term:"term",readonly:"readonly",terminologyServer:"terminologyServer",editionUri:"editionUri",appearance:"appearance",compact:"compact",allowWildcard:"allowWildcard"},outputs:{selectionChange:"selectionChange",cleared:"cleared"},features:[ge([{provide:ln,useExisting:Je(()=>i),multi:!0},{provide:qt,useExisting:i}]),ve],decls:13,vars:15,consts:[["inputElement",""],["auto","matAutocomplete"],["subscriptSizing","dynamic",3,"appearance"],["type","text","matInput","",3,"blur","focus","placeholder","formControl","matAutocomplete","readonly"],["matSuffix","","mat-icon-button","","aria-label","Clear"],["autoActiveFirstOption","",3,"optionSelected"],["disabled","",1,"loading"],[3,"value"],[3,"innerHTML"],["matSuffix","","mat-icon-button","","aria-label","Clear",3,"click"],[3,"diameter"]],template:function(e,t){if(e&1&&(d(0,"mat-form-field",2),B(1,Og,2,1,"mat-label"),d(2,"input",3,0),T("blur",function(){return t.onBlur()})("focus",function(){return t.onFocus()}),u(),B(4,Fg,2,1,"mat-hint"),B(5,Rg,3,0,"button",4),B(6,Ng,3,1,"mat-error"),d(7,"mat-autocomplete",5,1),T("optionSelected",function(r){return t.change(r)}),B(9,Bg,2,1,"mat-option",6),ut(10,Vg,2,2,"mat-option",7,Tg),kn(12,"async"),u()()),e&2){let o=nt(8);M("compact-field",t.compact),L("appearance",t.appearance),m(),V(t.binding.title?1:-1),m(),L("placeholder",qs((t.formControl.value==null?null:t.formControl.value.display)||t.binding.title||"Search..."))("formControl",t.formControl)("matAutocomplete",o)("readonly",t.readonly),m(2),V(!(t.selectedConcept!=null&&t.selectedConcept.code)&&!t.errorState&&t.binding.note?4:-1),m(),V(t.formControl.value&&!t.readonly?5:-1),m(),V(t.errorState?6:-1),m(3),V(t.loading?9:-1),m(),mt(Zs(12,13,t.autoFilter))}},dependencies:[On,xc,Vn,Yo,wa,Rt,Jn,yn,Yi,Za,Ja,Mr,Ar,Fu,Ou,Ct,ds,Nu,Lu,hr,mr,qn,Ui,Qr],styles:[".chip[_ngcontent-%COMP%]{display:inline-flex;flex-direction:row;background-color:#f4a460;border:none;cursor:default;height:36px;outline:none;padding:0;font-size:14px;color:#fff;font-family:Open Sans,sans-serif;white-space:nowrap;align-items:center;border-radius:16px;vertical-align:middle;text-decoration:none;justify-content:center;margin-right:20px}.chip-content[_ngcontent-%COMP%]{cursor:inherit;display:flex;align-items:center;-webkit-user-select:none;user-select:none;white-space:nowrap;padding-left:12px;padding-right:12px}mat-form-field[_ngcontent-%COMP%]{width:100%}.compact-field[_ngcontent-%COMP%]{--mat-form-field-container-height: 44px;--mat-form-field-container-vertical-padding: 10px;font-size:13px}.code[_ngcontent-%COMP%]{font-size:small;font-weight:lighter;margin-right:15px}.id-icon[_ngcontent-%COMP%]{margin-left:10px;color:#2e8b57}mat-hint[_ngcontent-%COMP%]{font-size:12px}.compact-field[_ngcontent-%COMP%]   mat-hint[_ngcontent-%COMP%]{font-size:11px}"]})};var jg=["confirmClear"],zg=["settingsDialog"],Ug=["statsDialog"],Hg=()=>[],$g=(i,n)=>n.id,ms=(i,n)=>e=>!!e.sctid,Gg=(i,n)=>n.label;function Wg(i,n){i&1&&(d(0,"mat-icon"),h(1,"check_circle"),u(),h(2," Completo "))}function Yg(i,n){if(i&1&&(h(0),d(1,"span",20),h(2),u()),i&2){let e=b(2);We(" ",e.progressPct(),"% \xB7 "),m(2),We("",e.pendingCount()," pendientes")}}function Xg(i,n){if(i&1&&(d(0,"div",7)(1,"div",16)(2,"span",17),h(3),u(),d(4,"span",18),B(5,Wg,3,0)(6,Yg,3,2),u()(),de(7,"mat-progress-bar",19),u()),i&2){let e=b();m(3),Gr("",e.annotatedCount()," / ",e.cases().length," casos"),m(),M("done",e.complete()),m(),V(e.complete()?5:6),m(2),M("done",e.complete()),L("value",e.progressPct())}}function qg(i,n){if(i&1){let e=Ue();d(0,"button",21),T("click",function(){ie(e);let o=b();return oe(o.scrollToFirstPending())}),d(1,"mat-icon"),h(2,"arrow_downward"),u(),h(3," Ir al pendiente "),u()}}function Kg(i,n){if(i&1){let e=Ue();d(0,"button",22),T("click",function(){ie(e);let o=b();return oe(o.openStats())}),d(1,"mat-icon"),h(2,"bar_chart"),u()(),d(3,"button",23),T("click",function(){ie(e);let o=b();return oe(o.clearAll())}),d(4,"mat-icon"),h(5,"restart_alt"),u(),h(6," Limpiar "),u()}}function Zg(i,n){if(i&1){let e=Ue();d(0,"div",14)(1,"div",24)(2,"div",25)(3,"mat-icon",26),h(4,"local_hospital"),u(),d(5,"h1"),h(6,"Anotador SNOMED CT"),u(),d(7,"p",27),h(8,"Herramienta de anotaci\xF3n cl\xEDnica del proyecto SEMANTIAR"),u()(),d(9,"ol",28)(10,"li")(11,"span",29),h(12,"1"),u(),d(13,"mat-icon",30),h(14,"upload_file"),u(),d(15,"div",31)(16,"strong"),h(17,"Carg\xE1 el archivo JSON"),u(),d(18,"span"),h(19,"Sub\xED el archivo que te asign\xF3 el administrador."),u()()(),d(20,"li")(21,"span",29),h(22,"2"),u(),d(23,"mat-icon",30),h(24,"edit_note"),u(),d(25,"div",31)(26,"strong"),h(27,"Complet\xE1 las anotaciones"),u(),d(28,"span"),h(29,"Codific\xE1 cada concepto cl\xEDnico con SNOMED CT y su contexto."),u()()(),d(30,"li")(31,"span",29),h(32,"3"),u(),d(33,"mat-icon",30),h(34,"download"),u(),d(35,"div",31)(36,"strong"),h(37,"Descarg\xE1 el resultado"),u(),d(38,"span"),h(39,"Baj\xE1 el JSON anotado. Si no terminaste, pod\xE9s volver a cargarlo despu\xE9s para continuar."),u()()(),d(40,"li")(41,"span",29),h(42,"4"),u(),d(43,"mat-icon",30),h(44,"mail"),u(),d(45,"div",31)(46,"strong"),h(47,"Envi\xE1lo al administrador"),u(),d(48,"span"),h(49,"Mand\xE1 el archivo descargado por correo cuando hayas completado todos los casos."),u()()()(),d(50,"button",32),T("click",function(){ie(e),b();let o=nt(6);return oe(o.click())}),d(51,"mat-icon"),h(52,"upload_file"),u(),h(53," Cargar archivo JSON "),u(),d(54,"p",33),h(55,"Formato aceptado: "),d(56,"code"),h(57,".json"),u()()()()}}function Qg(i,n){i&1&&(d(0,"span",36)(1,"mat-icon"),h(2,"check_circle"),u(),h(3," Anotado "),u())}function Jg(i,n){i&1&&(d(0,"span",37)(1,"mat-icon"),h(2,"radio_button_unchecked"),u(),h(3," Pendiente "),u())}function e_(i,n){if(i&1&&(d(0,"mat-option",51),h(1),u()),i&2){let e=n.$implicit;L("value",e.label),m(),ae(e.label)}}function t_(i,n){if(i&1&&(d(0,"div",55)(1,"mat-icon"),h(2,"check_circle"),u(),d(3,"span",60),h(4),u(),d(5,"span",61),h(6),u()()),i&2){let e=b().$implicit;m(4),ae(e.term),m(2),ae(e.sctid)}}function n_(i,n){if(i&1&&(d(0,"mat-option",51),h(1),u()),i&2){let e=n.$implicit;L("value",e),m(),ae(e)}}function i_(i,n){if(i&1&&(d(0,"mat-option",51),h(1),u()),i&2){let e=n.$implicit;L("value",e),m(),ae(e)}}function o_(i,n){if(i&1&&(d(0,"mat-option",51),h(1),u()),i&2){let e=n.$implicit;L("value",e),m(),ae(e)}}function r_(i,n){if(i&1&&(d(0,"mat-option",51),h(1),u()),i&2){let e=n.$implicit;L("value",e),m(),ae(e)}}function a_(i,n){if(i&1){let e=Ue();d(0,"div",40)(1,"div",45)(2,"span",46),h(3),u(),d(4,"button",47),T("click",function(){let o=ie(e).$index,r=b().$index,a=b();return oe(a.removeConcept(r,o))}),d(5,"mat-icon"),h(6,"close"),u()()(),d(7,"div",48)(8,"mat-form-field",49)(9,"mat-label"),h(10,"Categor\xEDa (jerarqu\xEDa)"),u(),d(11,"mat-select",50),T("ngModelChange",function(o){let r=ie(e).$index,a=b().$index,l=b();return oe(l.onCategoryChange(a,r,o))}),ut(12,e_,2,2,"mat-option",51,Gg),u()(),d(14,"div",52)(15,"app-autocomplete-binding",53),T("selectionChange",function(o){let r=ie(e).$index,a=b().$index,l=b();return oe(l.onConceptSelected(a,r,o))}),u(),d(16,"div",54),B(17,t_,7,2,"div",55),u()(),d(18,"mat-form-field",56)(19,"mat-label"),h(20,"Texto literal"),u(),d(21,"input",57),T("ngModelChange",function(o){let r=ie(e).$index,a=b().$index,l=b();return oe(l.updateConceptField(a,r,"textoLiteral",o))}),u()()(),d(22,"div",58)(23,"mat-form-field",59)(24,"mat-label"),h(25,"Polaridad"),u(),d(26,"mat-select",50),T("ngModelChange",function(o){let r=ie(e).$index,a=b().$index,l=b();return oe(l.updateConceptField(a,r,"pol",o))}),ut(27,n_,2,2,"mat-option",51,ci),u()(),d(29,"mat-form-field",59)(30,"mat-label"),h(31,"Certeza"),u(),d(32,"mat-select",50),T("ngModelChange",function(o){let r=ie(e).$index,a=b().$index,l=b();return oe(l.updateConceptField(a,r,"cert",o))}),ut(33,i_,2,2,"mat-option",51,ci),u()(),d(35,"mat-form-field",59)(36,"mat-label"),h(37,"Temporalidad"),u(),d(38,"mat-select",50),T("ngModelChange",function(o){let r=ie(e).$index,a=b().$index,l=b();return oe(l.updateConceptField(a,r,"temp",o))}),ut(39,o_,2,2,"mat-option",51,ci),u()(),d(41,"mat-form-field",59)(42,"mat-label"),h(43,"Sujeto"),u(),d(44,"mat-select",50),T("ngModelChange",function(o){let r=ie(e).$index,a=b().$index,l=b();return oe(l.updateConceptField(a,r,"suj",o))}),ut(45,r_,2,2,"mat-option",51,ci),u()()()()}if(i&2){let e=n.$implicit,t=n.$index,o=b(2);m(3),We("C",t+1),m(8),L("ngModel",e.cat),m(),mt(o.categories),m(3),L("binding",o.bindingFor(e.cat))("terminologyServer",o.terminologyServer())("editionUri",o.editionUri())("readonly",!e.cat)("compact",!0),m(2),V(e.sctid?17:-1),m(4),L("ngModel",e.textoLiteral),m(5),L("ngModel",e.pol),m(),mt(o.polarities),m(5),L("ngModel",e.cert),m(),mt(o.certainties),m(5),L("ngModel",e.temp),m(),mt(o.temporalities),m(5),L("ngModel",e.suj),m(),mt(o.subjects)}}function s_(i,n){if(i&1){let e=Ue();d(0,"mat-card",34)(1,"mat-card-header")(2,"mat-card-title",35),h(3),B(4,Qg,4,0,"span",36)(5,Jg,4,0,"span",37),u()(),d(6,"mat-card-content")(7,"p",38),h(8),u(),d(9,"div",39),ut(10,a_,47,13,"div",40,Hr),u(),d(12,"div",41)(13,"button",42),T("click",function(){let o=ie(e).$index,r=b();return oe(r.addConcept(o))}),d(14,"mat-icon"),h(15,"add"),u(),h(16," Agregar concepto "),u()(),d(17,"mat-form-field",43)(18,"mat-label"),h(19,"Comentarios"),u(),d(20,"textarea",44),T("ngModelChange",function(o){let r=ie(e).$index,a=b();return oe(a.updateComentarios(r,o))}),u()()()()}if(i&2){let e=n.$implicit,t=b();M("case-annotated",e.concepts.some(mo(9,ms,n)))("case-pending",!e.concepts.some(mo(10,ms,n))),m(3),We(" ",e.id," "),m(),V(e.concepts.some(mo(11,ms,n))?4:5),m(4),ae(e.text),m(2),mt(e.concepts),m(3),L("disabled",e.concepts.length>=t.maxConcepts),m(7),L("ngModel",e.comentarios)}}function l_(i,n){if(i&1){let e=Ue();d(0,"h2",62),h(1,"Configuraci\xF3n de terminolog\xEDa"),u(),d(2,"mat-dialog-content")(3,"p",63),h(4," Edici\xF3n activa: "),d(5,"span",64),h(6),u()(),d(7,"mat-form-field",65)(8,"mat-label"),h(9,"Servidor FHIR"),u(),d(10,"input",66),T("ngModelChange",function(o){ie(e);let r=b();return oe(r.onServerChange(o))}),u()(),d(11,"mat-form-field",65)(12,"mat-label"),h(13,"Edici\xF3n (URI)"),u(),d(14,"input",66),T("ngModelChange",function(o){ie(e);let r=b();return oe(r.onEditionChange(o))}),u()(),d(15,"mat-form-field",65)(16,"mat-label"),h(17,"ID anotador"),u(),d(18,"input",66),T("ngModelChange",function(o){ie(e);let r=b();return oe(r.annotatorId.set(o))}),u()(),d(19,"button",67),T("click",function(){ie(e);let o=b();return oe(o.detectEdition())}),d(20,"mat-icon"),h(21,"refresh"),u(),h(22," Re-detectar edici\xF3n "),u()(),d(23,"mat-dialog-actions",68)(24,"button",69),h(25,"Cerrar"),u()()}if(i&2){let e=b();m(6),ae(e.editionLabel()),m(4),L("ngModel",e.terminologyServer()),m(4),L("ngModel",e.editionUri()),m(4),L("ngModel",e.annotatorId())}}function c_(i,n){i&1&&(d(0,"h2",62),h(1,"Limpiar y empezar de nuevo"),u(),d(2,"mat-dialog-content"),h(3," Hay anotaciones que "),d(4,"strong"),h(5,"no descargaste"),u(),h(6,". Si limpi\xE1s el espacio de trabajo se van a perder. \xBFQuer\xE9s continuar? "),u(),d(7,"mat-dialog-actions",68)(8,"button",70),h(9,"Cancelar"),u(),d(10,"button",71)(11,"mat-icon"),h(12,"restart_alt"),u(),h(13," Limpiar todo "),u()()),i&2&&(m(10),L("mat-dialog-close",!0))}function d_(i,n){if(i&1&&(d(0,"div",78)(1,"span",76),h(2,"Completado en"),u(),d(3,"span",77),h(4),kn(5,"date"),u()()),i&2){let e=b(2);m(4),ae(ho(5,1,e.completedAt(),"dd/MM/yyyy HH:mm"))}}function u_(i,n){if(i&1&&(d(0,"div",82)(1,"mat-icon",83),h(2),u(),d(3,"div",84)(4,"span",85),h(5),u(),d(6,"span",86),h(7),kn(8,"date"),u(),d(9,"span",87),h(10),u()()()),i&2){let e=n.$implicit;M("log-upload",e.action==="upload")("log-download",e.action==="download"),m(2),ae(e.action==="upload"?"upload_file":"download"),m(3),ae(e.action==="upload"?"Carga":"Descarga"),m(2),ae(ho(8,9,e.timestamp,"dd/MM/yyyy HH:mm:ss")),m(3),Gr("",e.annotatedCount,"/",e.totalCases," casos")}}function m_(i,n){if(i&1&&(d(0,"h2",62)(1,"mat-icon",72),h(2,"bar_chart"),u(),h(3," Estad\xEDsticas de sesi\xF3n "),u(),d(4,"mat-dialog-content",73)(5,"div",74)(6,"div",75)(7,"span",76),h(8,"Primera carga"),u(),d(9,"span",77),h(10),kn(11,"date"),u()(),d(12,"div",75)(13,"span",76),h(14,"Descargas realizadas"),u(),d(15,"span",77),h(16),u()(),d(17,"div",75)(18,"span",76),h(19,"Progreso actual"),u(),d(20,"span",77),h(21),u()(),B(22,d_,6,4,"div",78),u(),d(23,"h3",79),h(24,"Historial de acciones"),u(),d(25,"div",80),ut(26,u_,11,12,"div",81,Hr),u()(),d(28,"mat-dialog-actions",68)(29,"button",69),h(30,"Cerrar"),u()()),i&2){let e,t=b();m(10),ae(ho(11,6,t.firstLoadedAt(),"dd/MM/yyyy HH:mm")),m(6),ae(t.totalDownloads()),m(5),Xs("",t.annotatedCount()," / ",t.cases().length," casos (",t.progressPct(),"%)"),m(),V(t.completedAt()?22:-1),m(4),mt(((e=t.sessionMeta())==null?null:e.sessions)??Ks(9,Hg))}}var Lr=class i{http=s(Ut);terminologyService=s(oi);snackBar=s(ls);dialog=s(Ji);confirmClearTpl;settingsTpl;statsTpl;categories=Or;polarities=Bu;certainties=Vu;temporalities=ju;subjects=zu;maxConcepts=Uu;project=Q("");batch=Q("");annotatorId=Q("");sourceFile=Q("");terminologyServer=Q(Fr);editionUri=Q(Rr);editionLabel=Q("Detectando edici\xF3n\u2026");cases=Q([]);sessionMeta=Q(null);dirty=Q(!1);loaded=ye(()=>this.cases().length>0);annotatedCount=ye(()=>this.cases().filter(n=>n.concepts.some(e=>!!e.sctid)).length);pendingCount=ye(()=>this.cases().length-this.annotatedCount());progressPct=ye(()=>{let n=this.cases().length;return n?Math.round(this.annotatedCount()/n*100):0});complete=ye(()=>this.loaded()&&this.annotatedCount()===this.cases().length);firstPendingIdx=ye(()=>this.cases().findIndex(n=>!n.concepts.some(e=>!!e.sctid)));totalDownloads=ye(()=>this.sessionMeta()?.totalDownloads??0);firstLoadedAt=ye(()=>this.sessionMeta()?.firstLoadedAt??"\u2014");completedAt=ye(()=>this.sessionMeta()?.completedAt??null);ngOnInit(){this.detectEdition()}detectEdition(){this.editionLabel.set("Detectando edici\xF3n\u2026"),this.terminologyService.detectEdition(this.terminologyServer()).subscribe(n=>{this.editionUri.set(n.editionUri),this.editionLabel.set(n.label),n.isArgentina||this.snackBar.open("Edici\xF3n Argentina no disponible \u2014 usando Internacional (ingl\xE9s).","OK",{duration:4e3})})}openSettings(){this.dialog.open(this.settingsTpl,{width:"540px"})}openStats(){this.dialog.open(this.statsTpl,{width:"560px"})}scrollToFirstPending(){let n=this.firstPendingIdx();if(n<0)return;document.querySelectorAll(".case-card")[n]?.scrollIntoView({behavior:"smooth",block:"start"})}loadExample(){this.http.get("example-input.json").subscribe({next:n=>this.ingestDocument(n,"example-input.json"),error:()=>this.snackBar.open("No se pudo cargar el ejemplo.","OK",{duration:4e3})})}onFileSelected(n){let e=n.target,t=e.files?.[0];if(!t)return;let o=new FileReader;o.onload=()=>{try{let r=JSON.parse(o.result);this.ingestDocument(r,t.name)}catch{this.snackBar.open("El archivo no es un JSON v\xE1lido.","OK",{duration:4e3})}},o.readAsText(t),e.value=""}ingestDocument(n,e){if(!n||!Array.isArray(n.cases)||n.cases.length===0){this.snackBar.open('El JSON no contiene "cases".',"OK",{duration:4e3});return}this.project.set(n.project??""),this.batch.set(n.batch??""),this.annotatorId.set(n.annotatorId??""),this.sourceFile.set(n.sourceFile??e);let t=n.cases.map(v=>({id:String(v.id??""),text:String(v.text??""),concepts:Array.isArray(v.concepts)&&v.concepts.length?v.concepts.map(F=>C(C({},to()),F)):[to()],comentarios:String(v.comentarios??"")}));this.cases.set(t);let o=new Date().toISOString(),r=n._meta??{sessions:[],totalDownloads:0,firstLoadedAt:o},a=t.filter(v=>v.concepts.some(F=>!!F.sctid)).length,l={action:"upload",timestamp:o,annotatedCount:a,totalCases:t.length};r.sessions=[...r.sessions,l],this.sessionMeta.set(r),this.dirty.set(!1);let c=a>0,p=c?`Retomando: ${a} de ${t.length} casos ya anotados. Pendientes: ${t.length-a}.`:`Cargados ${t.length} casos. Comenz\xE1 por el primero.`,f=c&&this.firstPendingIdx()>=0?"Ir al pendiente":"OK";this.snackBar.open(p,f,{duration:6e3}).onAction().subscribe(()=>this.scrollToFirstPending())}clearAll(){this.dirty()?this.dialog.open(this.confirmClearTpl,{width:"420px"}).afterClosed().subscribe(n=>{n&&this.doClear()}):this.doClear()}doClear(){this.cases.set([]),this.project.set(""),this.batch.set(""),this.sourceFile.set(""),this.sessionMeta.set(null),this.dirty.set(!1),this.snackBar.open("Espacio de trabajo limpio.","OK",{duration:2e3})}mutateCase(n,e){this.cases.update(t=>{let o=t.map(r=>we(C({},r),{concepts:r.concepts.map(a=>C({},a))}));return e(o[n]),o}),this.dirty.set(!0)}addConcept(n){this.mutateCase(n,e=>{e.concepts.length<this.maxConcepts&&e.concepts.push(to())})}removeConcept(n,e){this.mutateCase(n,t=>{t.concepts.splice(e,1),t.concepts.length===0&&t.concepts.push(to())})}onCategoryChange(n,e,t){this.mutateCase(n,o=>{let r=o.concepts[e];r.cat=t,r.sctid="",r.term=""})}onConceptSelected(n,e,t){this.mutateCase(n,o=>{let r=o.concepts[e];r.sctid=t?.code??"",r.term=t?.display??""})}updateConceptField(n,e,t,o){this.mutateCase(n,r=>{r.concepts[e][t]=o})}updateComentarios(n,e){this.mutateCase(n,t=>{t.comentarios=e})}bindingFor(n){let e=Or.find(t=>t.label===n);return{ecl:Yu(n),title:e?e.search:"Eleg\xED una categor\xEDa primero"}}onServerChange(n){this.terminologyServer.set(n),this.terminologyService.setTerminologyServer(n),this.detectEdition()}onEditionChange(n){this.editionUri.set(n),this.terminologyService.setEditionUri(n),this.editionLabel.set("Edici\xF3n manual")}download(){let n=new Date().toISOString(),e=this.annotatedCount(),t=this.cases().length,o=this.sessionMeta()??{sessions:[],totalDownloads:0,firstLoadedAt:n},r={action:"download",timestamp:n,annotatedCount:e,totalCases:t},a=we(C({},o),{sessions:[...o.sessions,r],totalDownloads:o.totalDownloads+1,completedAt:this.complete()?o.completedAt??n:o.completedAt});this.sessionMeta.set(a);let l={project:this.project()||void 0,batch:this.batch()||void 0,annotatorId:this.annotatorId()||void 0,sourceFile:this.sourceFile()||void 0,exportedAt:n,terminologyServer:this.terminologyServer(),editionUri:this.editionUri(),cases:this.cases().map(q=>({id:q.id,text:q.text,concepts:q.concepts.filter(Y=>Y.sctid||Y.textoLiteral||Y.cat),comentarios:q.comentarios})),_meta:a},c=new Blob([JSON.stringify(l,null,2)],{type:"application/json"}),p=URL.createObjectURL(c),f=document.createElement("a"),v=n.slice(0,10),F=this.annotatorId()?`_${this.annotatorId()}`:"";f.href=p,f.download=`SEMANTIAR_anotado${F}_${v}.json`,f.click(),URL.revokeObjectURL(p),this.dirty.set(!1)}static \u0275fac=function(e){return new(e||i)};static \u0275cmp=k({type:i,selectors:[["app-annotator"]],viewQuery:function(e,t){if(e&1&&fe(jg,5)(zg,5)(Ug,5),e&2){let o;R(o=P())&&(t.confirmClearTpl=o.first),R(o=P())&&(t.settingsTpl=o.first),R(o=P())&&(t.statsTpl=o.first)}},decls:30,vars:8,consts:[["fileInput",""],["settingsDialog",""],["confirmClear",""],["statsDialog",""],["color","primary",1,"app-toolbar"],[1,"app-title"],[1,"spacer"],["matTooltip","Casos con al menos un concepto codificado",1,"progress-area"],["type","file","accept","application/json,.json","hidden","",3,"change"],["mat-stroked-button","",3,"click"],["mat-stroked-button","","color","accent","matTooltip","Ir al primer caso sin anotar"],["mat-flat-button","","color","accent",1,"download-btn",3,"click","disabled"],["mat-icon-button","","matTooltip","Configuraci\xF3n de terminolog\xEDa",1,"settings-btn",3,"click"],[1,"content"],[1,"home"],[1,"case-card",3,"case-annotated","case-pending"],[1,"progress-top"],[1,"progress-count"],[1,"progress-pct"],["mode","determinate",1,"progress-bar",3,"value"],[1,"pending-label"],["mat-stroked-button","","color","accent","matTooltip","Ir al primer caso sin anotar",3,"click"],["mat-icon-button","","matTooltip","Ver estad\xEDsticas de sesiones",3,"click"],["mat-stroked-button","","color","warn","matTooltip","Limpiar todo y empezar de nuevo",3,"click"],[1,"home-card"],[1,"home-hero"],[1,"home-logo"],[1,"home-sub"],[1,"home-steps"],[1,"step-num"],[1,"step-ic"],[1,"step-txt"],["mat-flat-button","","color","primary",1,"home-cta",3,"click"],[1,"home-hint"],[1,"case-card"],[1,"case-id"],[1,"case-status-badge","done-badge"],[1,"case-status-badge","pending-badge"],[1,"case-text"],[1,"concepts"],[1,"concept-block"],[1,"case-actions"],["mat-stroked-button","","color","primary",3,"click","disabled"],["appearance","outline","subscriptSizing","dynamic",1,"comentarios"],["matInput","","rows","2","placeholder","Dudas o notas sobre este caso",3,"ngModelChange","ngModel"],[1,"concept-head"],[1,"concept-num"],["mat-icon-button","","color","warn","matTooltip","Quitar concepto",1,"remove-btn",3,"click"],[1,"concept-fields"],["appearance","outline","subscriptSizing","dynamic",1,"f-cat"],[3,"ngModelChange","ngModel"],[3,"value"],[1,"f-search"],["appearance","outline",3,"selectionChange","binding","terminologyServer","editionUri","readonly","compact"],[1,"chip-slot"],[1,"selected-chip"],["appearance","outline","subscriptSizing","dynamic",1,"f-literal"],["matInput","","placeholder","expresi\xF3n exacta del texto",3,"ngModelChange","ngModel"],[1,"context-row"],["appearance","outline","subscriptSizing","dynamic",1,"f-ctx"],[1,"chip-term"],[1,"chip-code"],["mat-dialog-title",""],[1,"settings-edition"],[1,"edition-badge"],["appearance","outline",1,"settings-field"],["matInput","",3,"ngModelChange","ngModel"],["mat-stroked-button","",1,"settings-redetect",3,"click"],["align","end"],["mat-flat-button","","color","primary","mat-dialog-close",""],["mat-button","","mat-dialog-close",""],["mat-flat-button","","color","warn",3,"mat-dialog-close"],[2,"vertical-align","middle","margin-right","6px"],[1,"stats-content"],[1,"stats-summary"],[1,"stat-item"],[1,"stat-label"],[1,"stat-value"],[1,"stat-item","stat-done"],[1,"stats-log-title"],[1,"stats-log"],[1,"log-entry",3,"log-upload","log-download"],[1,"log-entry"],[1,"log-icon"],[1,"log-details"],[1,"log-action"],[1,"log-time"],[1,"log-progress"]],template:function(e,t){if(e&1){let o=Ue();d(0,"mat-toolbar",4)(1,"span",5),h(2,"SEMANTIAR \xB7 Anotador SNOMED CT"),u(),de(3,"span",6),B(4,Xg,8,8,"div",7),d(5,"input",8,0),T("change",function(a){return t.onFileSelected(a)}),u(),d(7,"button",9),T("click",function(){ie(o);let a=nt(6);return oe(a.click())}),d(8,"mat-icon"),h(9,"upload_file"),u(),h(10," Cargar JSON "),u(),B(11,qg,4,0,"button",10),B(12,Kg,7,0),d(13,"button",11),T("click",function(){return t.download()}),d(14,"mat-icon"),h(15),u(),h(16," Descargar "),u(),d(17,"button",12),T("click",function(){return t.openSettings()}),d(18,"mat-icon"),h(19,"settings"),u()()(),d(20,"div",13),B(21,Zg,58,0,"div",14),ut(22,s_,21,12,"mat-card",15,$g),u(),Re(24,l_,26,4,"ng-template",null,1,jt)(26,c_,14,1,"ng-template",null,2,jt)(28,m_,31,10,"ng-template",null,3,jt)}e&2&&(m(4),V(t.loaded()?4:-1),m(7),V(t.loaded()&&!t.complete()?11:-1),m(),V(t.loaded()?12:-1),m(),M("complete",t.complete()),L("disabled",!t.loaded()),m(2),ae(t.complete()?"task_alt":"download"),m(6),V(t.loaded()?-1:21),m(),mt(t.cases()))},dependencies:[On,Cc,Vn,Yo,xa,Ic,Mc,qn,dr,Ui,hr,mr,Cd,_d,bd,yd,vd,nu,Jn,yn,tu,Ct,Rt,Mr,Ar,cu,ts,mu,uu,Eu,bu,Cu,wu,xu,Mu,Iu,ku,Pr,Jr],styles:["[_nghost-%COMP%]{display:block;--brand: #2d3e5f;--done-color: #1e7d34;--pending-color: #8a94a6}.app-toolbar[_ngcontent-%COMP%]{position:sticky;top:0;z-index:10;gap:8px}.app-title[_ngcontent-%COMP%]{font-size:18px;font-weight:500}.spacer[_ngcontent-%COMP%]{flex:1 1 auto}.progress-area[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:3px;width:220px;margin-right:12px}.progress-top[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;font-size:12px;line-height:1}.progress-count[_ngcontent-%COMP%]{white-space:nowrap;color:#4a5468}.progress-pct[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:3px;font-weight:700;white-space:nowrap;color:var(--brand)}.progress-pct.done[_ngcontent-%COMP%]{color:var(--done-color)}.pending-label[_ngcontent-%COMP%]{font-weight:400;opacity:.8}.progress-pct[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:15px;height:15px;width:15px}.progress-bar[_ngcontent-%COMP%]{border-radius:4px;--mat-progress-bar-active-indicator-color: var(--brand);--mat-progress-bar-track-color: #dfe3ea}.progress-bar.done[_ngcontent-%COMP%]{--mat-progress-bar-active-indicator-color: #1e7d34}.download-btn.complete[_ngcontent-%COMP%]{background-color:#1e7d34!important;color:#fff!important}.app-toolbar[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{margin-left:4px}.content[_ngcontent-%COMP%]{max-width:1080px;margin:0 auto;padding:16px 16px 72px;--mat-form-field-container-height: 42px;--mat-form-field-container-vertical-padding: 8px;font-size:13px}.content[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%]{font-size:13px}.settings-btn[_ngcontent-%COMP%]{margin-left:4px;opacity:.7}.settings-btn[_ngcontent-%COMP%]:hover{opacity:1}.edition-badge[_ngcontent-%COMP%]{background:var(--brand);color:#fff;border-radius:12px;padding:2px 10px;font-size:12px;font-weight:600}.settings-edition[_ngcontent-%COMP%]{font-size:13px;color:#4a5468;margin:0 0 14px}.settings-field[_ngcontent-%COMP%]{width:100%}.settings-redetect[_ngcontent-%COMP%]{margin-top:4px}.home[_ngcontent-%COMP%]{display:flex;justify-content:center;padding:40px 16px 64px}.home-card[_ngcontent-%COMP%]{width:100%;max-width:560px;background:#fff;border:1px solid #e2e6ec;border-radius:16px;box-shadow:0 8px 30px #2d3e5f14;padding:36px 36px 28px;text-align:center}.home-hero[_ngcontent-%COMP%]{margin-bottom:24px}.home-logo[_ngcontent-%COMP%]{font-size:48px;height:48px;width:48px;color:var(--brand);background:#eef2fb;border-radius:50%;padding:14px;box-sizing:content-box}.home-hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:22px;font-weight:600;color:#1b2436;margin:16px 0 4px}.home-sub[_ngcontent-%COMP%]{color:#6a7488;font-size:14px;margin:0}.home-steps[_ngcontent-%COMP%]{list-style:none;margin:0 0 26px;padding:0;text-align:left}.home-steps[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-top:1px solid #f0f2f6}.home-steps[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:first-child{border-top:none}.step-num[_ngcontent-%COMP%]{flex:0 0 24px;height:24px;border-radius:50%;background:var(--brand);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:2px}.step-ic[_ngcontent-%COMP%]{color:var(--brand);flex:0 0 auto;margin-top:1px}.step-txt[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1px}.step-txt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:14px;color:#1b2436}.step-txt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:13px;color:#6a7488}.home-cta[_ngcontent-%COMP%]{width:100%;height:46px;font-size:15px}.home-hint[_ngcontent-%COMP%]{font-size:12px;color:#8a94a6;margin:12px 0 0}.home-hint[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{background:#f0f2f6;padding:1px 6px;border-radius:4px}.case-card[_ngcontent-%COMP%]{margin-bottom:12px;border-left:4px solid var(--pending-color);padding:12px 14px;transition:border-color .3s ease}.case-card.case-annotated[_ngcontent-%COMP%]{border-left-color:var(--done-color)}.case-card.case-pending[_ngcontent-%COMP%]{border-left-color:var(--pending-color)}.case-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]{padding:0;margin-bottom:6px}.case-id[_ngcontent-%COMP%]{font-size:14px;font-weight:600;color:var(--brand);display:flex;align-items:center;gap:10px}.case-status-badge[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:3px;border-radius:12px;padding:1px 8px;font-size:11px;font-weight:600}.case-status-badge[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:13px;height:13px;width:13px}.done-badge[_ngcontent-%COMP%]{background:#e6f4ea;color:var(--done-color)}.pending-badge[_ngcontent-%COMP%]{background:#f0f2f6;color:var(--pending-color)}.case-text[_ngcontent-%COMP%]{font-size:17px;font-weight:500;line-height:1.55;color:#1b2436;background:#fff6e5;border:1px solid #f2d79b;border-left:5px solid #e8a33d;border-radius:8px;padding:12px 16px;margin:2px 0 14px}.concept-block[_ngcontent-%COMP%]{border:1px solid #e2e6ec;border-radius:10px;padding:8px 12px;margin-bottom:8px;background:#fcfdff}.concept-head[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;margin-bottom:2px}.concept-num[_ngcontent-%COMP%]{font-size:11px;font-weight:700;color:#fff;background:var(--brand);border-radius:6px;padding:1px 7px}.remove-btn[_ngcontent-%COMP%]{transform:scale(.75)}.concept-fields[_ngcontent-%COMP%]{display:grid;grid-template-columns:190px 1fr 210px;gap:10px;align-items:start;margin-bottom:8px}.f-search[_ngcontent-%COMP%]{min-width:0}.f-search[_ngcontent-%COMP%]     .mat-form-field-disabled .mat-mdc-text-field-wrapper{background:#eef0f4;border-radius:6px}.f-search[_ngcontent-%COMP%]     .mat-form-field-disabled .mdc-text-field__input::placeholder{color:#9aa3b2;-webkit-text-fill-color:#9aa3b2}.chip-slot[_ngcontent-%COMP%]{min-height:24px;margin-top:2px}.selected-chip[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:5px;background:#e6f4ea;color:#1e7d34;border-radius:14px;padding:2px 9px;font-size:12px}.selected-chip[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:15px;height:15px;width:15px}.chip-code[_ngcontent-%COMP%]{font-family:monospace;opacity:.75}.context-row[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:8px}.f-ctx[_ngcontent-%COMP%]{flex:1 1 130px}.case-actions[_ngcontent-%COMP%]{margin:2px 0 8px}.case-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font-size:12px}.comentarios[_ngcontent-%COMP%]{width:100%}@media(max-width:760px){.concept-fields[_ngcontent-%COMP%]{grid-template-columns:1fr}}.stats-content[_ngcontent-%COMP%]{min-width:440px;max-height:70vh;overflow-y:auto}.stats-summary[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:10px;background:#f8f9fc;border-radius:10px;padding:14px 16px;margin-bottom:18px}.stat-item[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;font-size:13px}.stat-item.stat-done[_ngcontent-%COMP%]{color:var(--done-color);font-weight:600}.stat-label[_ngcontent-%COMP%]{color:#6a7488}.stat-value[_ngcontent-%COMP%]{font-weight:600;color:#1b2436}.stats-log-title[_ngcontent-%COMP%]{font-size:13px;font-weight:600;color:#4a5468;margin:0 0 10px;text-transform:uppercase;letter-spacing:.05em}.stats-log[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:6px}.log-entry[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;font-size:12px}.log-entry.log-upload[_ngcontent-%COMP%]{background:#eef2fb}.log-entry.log-download[_ngcontent-%COMP%]{background:#e6f4ea}.log-icon[_ngcontent-%COMP%]{font-size:18px;height:18px;width:18px;color:var(--brand)}.log-download[_ngcontent-%COMP%]   .log-icon[_ngcontent-%COMP%]{color:var(--done-color)}.log-details[_ngcontent-%COMP%]{display:flex;gap:14px;flex-wrap:wrap}.log-action[_ngcontent-%COMP%]{font-weight:700;min-width:64px}.log-time[_ngcontent-%COMP%]{color:#4a5468}.log-progress[_ngcontent-%COMP%]{color:#6a7488}"]})};var Nr=class i{static \u0275fac=function(e){return new(e||i)};static \u0275cmp=k({type:i,selectors:[["app-root"]],decls:1,vars:0,template:function(e,t){e&1&&de(0,"app-annotator")},dependencies:[Lr],encapsulation:2})};sa(Nr,Yl).catch(i=>console.error(i));
