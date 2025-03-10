"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8322],{19170:function(e,n,t){t.d(n,{Ck:function(){return y},IR:function(){return d},Pd:function(){return m},Uc:function(){return h},W1:function(){return l},_y:function(){return v},fb:function(){return C},gq:function(){return S},k7:function(){return k},ml:function(){return g},wO:function(){return f},yU:function(){return _},yq:function(){return p}});var r=t(3053),o=t(5362),a=t(8571),c=t(29305),u=t(13262),i=t(77930),s=t(81695);function l(e,n){return(0,o.WE)("/api/auth/login_methods?email=".concat(e,"&source=").concat(n),{enabled:!!e&&(0,c.vV)(e),meta:{noToast:!0}})}let f=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{track:n}=(0,r.z$)(),t=(0,a.Z)();return(0,o.uC)("/api/auth/send_magic_link","POST",{...e,onSuccess:(t,r,o)=>{t.sso_url?n({event_key:"login.email.sso_initiated"}):n({event_key:"login.email.magic_link_sent"}),e.onSuccess&&e.onSuccess(t,r,o)},onError:(t,r,o)=>{n({event_key:"login.email.magic_link_send_error",error:t.message}),e.onError&&e.onError(t,r,o)},onMutate:e=>{n({event_key:"login.email.sending_magic_link"})},transformVariables:e=>({...e,source:t?"claude":"console"})})},_=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=(0,a.Z)();return(0,o.uC)("/api/auth/exchange_nonce_for_code","POST",{...e,transformVariables:e=>({...e,source:n?"claude":"console"})})},g=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{track:n}=(0,r.z$)(),t=(0,a.Z)();return(0,o.uC)("/api/auth/verify_magic_link","POST",{...e,onSuccess:(t,r,o)=>{"code"===r.credentials.method?n({event_key:"login.email.finished"}):n({event_key:"login.email.magic_link_success"}),e.onSuccess&&e.onSuccess(t,r,o)},onError:(t,r,o)=>{"code"===r.credentials.method?n({event_key:"login.email.code_verification_error",error:t.message}):n({event_key:"login.email.magic_link_verification_error",error:t.message}),e.onError&&e.onError(t,r,o)},onMutate:e=>{"code"===e.credentials.method?n({event_key:"login.email.verifying_code"}):n({event_key:"login.email.verifying_magic_link"})},transformVariables:e=>({...e,source:t?"claude":"console"})})},d=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{track:n}=(0,r.z$)(),t=(0,a.Z)(),c=(0,s.useRouter)();return(0,o.uC)("/api/auth/verify_google","POST",{...e,onSuccess:(t,r,o)=>{!t.success&&t.sso_url?(n({event_key:"login.email.sso_initiated"}),c.push(t.sso_url)):(n({event_key:"login.google.finished"}),e.onSuccess&&e.onSuccess(t,r,o))},onError:(t,r,o)=>{n({event_key:"login.google.verification_error",error:t.message}),e.onError&&e.onError(t,r,o)},onMutate:e=>{n({event_key:"login.google.verifying"})},transformVariables:e=>({...e,source:t?"claude":"console"})})},m=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{track:n}=(0,r.z$)(),t=(0,a.Z)(),c=(0,s.useRouter)();return(0,o.uC)("/api/auth/accept_invite","POST",{...e,onSuccess:(t,r,o)=>{!t.success&&t.sso_url?(n({event_key:"login.email.sso_initiated"}),c.push(t.sso_url)):e.onSuccess&&e.onSuccess(t,r,o)},transformVariables:e=>({...e,source:t?"claude":"console"})})},v=()=>(0,o.uC)("/api/auth/logout","POST"),h=()=>(0,o.uC)("/api/auth/logout/all-sessions","POST"),p=()=>{let e=(0,i.useQueryClient)();return(0,o.uC)("/api/account","PUT",{async onSuccess(){await e.invalidateQueries({queryKey:[u.aY]})}})},y=()=>(0,o.Ne)("/api/account","PUT",(e,n)=>(null==n?void 0:n.account)?{...n,account:{...n.account,settings:e}}:n,{queryKey:[u.aY],transformVariables:e=>({settings:e})}),k=()=>{let e=(0,i.useQueryClient)();return(0,o.uC)("/api/account/accept_legal_docs","PUT",{async onSuccess(){await e.invalidateQueries({queryKey:[u.aY]})}})};function S(e){return(0,o.WE)("/api/signups/".concat(e),{enabled:!!e,staleTime:0})}function C(e,n,t){let{track:a}=(0,r.z$)();a({event_key:"login.email.sso_verifying_callback"});let c=(0,o.WE)("/api/enterprise_auth/sso_callback?code=".concat(e,"&state=").concat(n,"&source=").concat(t),{meta:{noToast:!0}});return a(c.isError?{event_key:"login.email.sso_verification_error",error:c.error.message}:{event_key:"login.email.sso_success"}),c}},8322:function(e,n,t){t.d(n,{K5:function(){return h},Ql:function(){return w},Z1:function(){return C},_A:function(){return y},nJ:function(){return k},rN:function(){return p},wy:function(){return S},z6:function(){return m}});var r=t(8571),o=t(40287),a=t(27218),c=t(27895),u=t(18850),i=t(35228),s=t(6385),l=t(14448);t(92841);var f=t(81695),_=t(7653),g=t(19170),d=t(93513);let m=()=>{let e=(0,f.useRouter)(),n=(0,o.f)();return{refresh:()=>{e.refresh()},switchAndRefresh:(e,t)=>{n.set(s.cn.LAST_ACTIVE_ORG,e),t?location.pathname=t:location.reload()}}},v=e=>{let{account:n}=(0,a.t)();return n&&((0,i.wJ)({account:n,isClaudeDot:e})||(0,i.c6)(n,e))?"/onboarding":n&&(0,i.kK)(n,e)?"/invites":n&&(0,i.D_)(n,e)?"/create":e?"/new":"/dashboard"};function h(e){let{value:n}=(0,l.F)("show_affirmative_consent"),{value:t}=(0,l.F)("show_affirmative_consent_for_privacy_policy");return(0,_.useMemo)(()=>[...n===e?["aup","consumer-terms"]:[],...t===e?["privacy"]:[]],[t,n,e])}let p=(e,n,t)=>{let r=(0,u.q)(),{mutateAsync:o}=(0,g.k7)();return(0,_.useCallback)(async()=>{if(!e||!r||0===n.length)return;let a=n.map(e=>({document_id:"v3:".concat(e,":").concat(r[e]),accepted_via_checkbox:t}));await o({acceptances:a})},[e,r,n,o,t])},y=(e,n)=>{let{account:t,refetch:r,setActiveOrganizationUUID:o}=(0,a.t)(),[u,i]=(0,_.useState)(!1),[s,l]=(0,_.useState)(!1),f=k(),{addSuccess:d}=(0,c.e)(),{data:m}=(0,g.gq)(e);return(0,_.useEffect)(()=>{t&&u&&s&&(n?n(f):f())},[s,f,u,t,n]),(0,_.useCallback)(async()=>{i(!0),await r(),(null==m?void 0:m.organization_uuid)&&(o(m.organization_uuid),d("Successfully joined ".concat(m.organization_name))),l(!0)},[m,d,r,o])},k=function(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=(0,f.useSearchParams)().get("returnTo"),t=S(e);return(0,_.useCallback)(()=>{t(n)},[t,n])},S=function(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],{account:n}=(0,a.t)(),[t,o]=(0,_.useState)(!1),c=(0,f.useRouter)(),[u,i]=(0,_.useState)(null),s=(0,f.usePathname)(),l=(0,f.useSearchParams)(),g=(0,r.Z)(),m=v(g);return(0,_.useEffect)(()=>{(t||e)&&!n&&c.push((0,d.C2)(s,l.toString()))},[n,c,t,e,s,l]),(0,_.useEffect)(()=>{if(t&&n){let e=(0,d.eX)(n,u,m,g);e!==window.location.href.replace(window.location.origin,"")&&(c.push(e),c.refresh())}},[n,c,t,u,m,g]),(0,_.useCallback)(e=>{e&&i(e),o(!0)},[])};function C(){let[e,n]=(0,_.useState)(!1);return{getRecaptchaToken:(0,_.useCallback)(async(e,t)=>(n(!0),new Promise((r,o)=>{if("undefined"==typeof grecaptcha)return n(!1),o(Error("Recaptcha failed to load"));grecaptcha.enterprise.ready(()=>{grecaptcha.enterprise.execute(e,{action:t}).then(e=>{r(e),n(!1)},e=>{n(!1),o(e)})})})),[]),isLoading:e}}function w(e){let[n,t]=(0,_.useState)(!1);(0,_.useEffect)(()=>{if(!n){let n=setInterval(()=>{window.grecaptcha&&(t(!0),e())},10);return()=>clearInterval(n)}},[n,t,e])}},93513:function(e,n,t){t.d(n,{$6:function(){return u},C2:function(){return a},G9:function(){return c},eX:function(){return o},kY:function(){return i}});var r=t(35228);let o=(e,n,t,o)=>{if(!n||!n.startsWith("/"))return t;if((0,r.cG)(e,o)){let e=new URLSearchParams({returnTo:n});return"".concat(t,"?").concat(e.toString())}return c(n)},a=function(e,n){let t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"/login",r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},o="".concat(e,"?").concat(n),a=new URLSearchParams(r);return a.append("returnTo",o),"".concat(t,"?").concat(a.toString())};function c(e){let n=new URL(e,"http://example.com");return n.pathname.replace(/^\/+/,"/")+n.search}function u(e){return e.reduce((e,n)=>{let t=localStorage.getItem(n);return null!==t&&e.push([n,t]),e},[])}function i(e){e.forEach(e=>{let[n,t]=e;localStorage.setItem(n,t)})}},18850:function(e,n,t){t.d(n,{LegalDocsProvider:function(){return c},q:function(){return u}});var r=t(27573),o=t(7653);let a=(0,o.createContext)(void 0),c=e=>{let{value:n,children:t}=e;return(0,r.jsx)(a.Provider,{value:n,children:t})};function u(){return(0,o.useContext)(a)}},29305:function(e,n,t){t.d(n,{KS:function(){return a},vV:function(){return o}});let r=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,o=e=>r.test(e),a=(e,n)=>{if(!n)return!1;let t=e.split("@")[1];return n.includes(t)}}}]);