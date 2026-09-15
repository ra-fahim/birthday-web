import{a as n,j as r,A as l,m as x}from"./motion-_eOdTbt9.js";import{c as d,r as g,X as m}from"./index-DZQ6wfye.js";/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],h=d("circle-alert",k);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],p=d("circle-check-big",y);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]],u=d("music",f),T=({message:c,type:o="success",duration:t=3e3,onClose:a,isVisible:i})=>{n.useEffect(()=>{if(i&&t>0){const s=setTimeout(()=>{a()},t);return()=>clearTimeout(s)}},[i,t,a]);const e={success:{icon:r.jsx(p,{className:"w-5 h-5"}),lightBg:"bg-emerald-50",darkBg:"dark:bg-emerald-950",lightText:"text-emerald-900",darkText:"dark:text-emerald-50",lightBorder:"border-emerald-200",darkBorder:"dark:border-emerald-800",lightIcon:"text-emerald-600",darkIcon:"dark:text-emerald-400"},info:{icon:r.jsx(u,{className:"w-5 h-5"}),lightBg:"bg-indigo-50",darkBg:"dark:bg-indigo-950",lightText:"text-indigo-900",darkText:"dark:text-indigo-50",lightBorder:"border-indigo-200",darkBorder:"dark:border-indigo-800",lightIcon:"text-indigo-600",darkIcon:"dark:text-indigo-400"},error:{icon:r.jsx(h,{className:"w-5 h-5"}),lightBg:"bg-red-50",darkBg:"dark:bg-red-950",lightText:"text-red-900",darkText:"dark:text-red-50",lightBorder:"border-red-200",darkBorder:"dark:border-red-800",lightIcon:"text-red-600",darkIcon:"dark:text-red-400"}}[o];return g.createPortal(r.jsx(l,{children:i&&r.jsx(x.div,{initial:{opacity:0,y:-50,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:-20,scale:.95},transition:{type:"spring",damping:25,stiffness:300},className:"fixed top-6 left-0 w-full flex justify-center z-[99999] pointer-events-none",children:r.jsx("div",{className:"pointer-events-auto w-[90vw] sm:w-auto max-w-md",children:r.jsxs("div",{className:`
            ${e.lightBg} ${e.darkBg}
            ${e.lightText} ${e.darkText}
            px-6 py-4 rounded-xl shadow-2xl
            border-2 ${e.lightBorder} ${e.darkBorder}
            flex items-center gap-3 min-w-[320px] max-w-md
          `,children:[r.jsx("div",{className:`shrink-0 ${e.lightIcon} ${e.darkIcon}`,children:e.icon}),r.jsx("p",{className:"flex-1 font-medium text-sm leading-relaxed",children:c}),r.jsx("button",{onClick:a,className:`
                shrink-0 p-1 rounded-full transition-colors
                ${e.lightText} ${e.darkText}
                hover:bg-black/10 dark:hover:bg-white/10
              `,"aria-label":"Close notification",children:r.jsx(m,{className:"w-4 h-4"})})]})})})}),document.body)};export{h as C,u as M,T};
