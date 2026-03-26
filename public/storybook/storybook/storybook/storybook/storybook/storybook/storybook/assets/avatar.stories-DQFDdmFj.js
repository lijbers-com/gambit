import{r as o,j as a}from"./iframe-CHTXZqHT.js";import{c as W,P as k,u as N}from"./index-Bewmt33Y.js";import{u as J}from"./index-C9_Qsora.js";import{r as T}from"./index-B4jz1kAT.js";import{c as S}from"./utils-CBfrqCZ4.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CnT3Uich.js";import"./index-Bs7E9PJc.js";import"./index-Csd0mXSg.js";var V=T();function $(){return V.useSyncExternalStore(q,()=>!0,()=>!1)}function q(){return()=>{}}var F="Avatar",[H,ra]=W(F),[O,L]=H(F),C=o.forwardRef((e,r)=>{const{__scopeAvatar:s,...c}=e,[d,t]=o.useState("idle");return a.jsx(O,{scope:s,imageLoadingStatus:d,onImageLoadingStatusChange:t,children:a.jsx(k.span,{...c,ref:r})})});C.displayName=F;var y="AvatarImage",_=o.forwardRef((e,r)=>{const{__scopeAvatar:s,src:c,onLoadingStatusChange:d=()=>{},...t}=e,p=L(y,s),i=G(c,t),u=J(v=>{d(v),p.onImageLoadingStatusChange(v)});return N(()=>{i!=="idle"&&u(i)},[i,u]),i==="loaded"?a.jsx(k.img,{...t,ref:r,src:c}):null});_.displayName=y;var E="AvatarFallback",R=o.forwardRef((e,r)=>{const{__scopeAvatar:s,delayMs:c,...d}=e,t=L(E,s),[p,i]=o.useState(c===void 0);return o.useEffect(()=>{if(c!==void 0){const u=window.setTimeout(()=>i(!0),c);return()=>window.clearTimeout(u)}},[c]),p&&t.imageLoadingStatus!=="loaded"?a.jsx(k.span,{...d,ref:r}):null});R.displayName=E;function w(e,r){return e?r?(e.src!==r&&(e.src=r),e.complete&&e.naturalWidth>0?"loaded":"loading"):"error":"idle"}function G(e,{referrerPolicy:r,crossOrigin:s}){const c=$(),d=o.useRef(null),t=c?(d.current||(d.current=new window.Image),d.current):null,[p,i]=o.useState(()=>w(t,e));return N(()=>{i(w(t,e))},[t,e]),N(()=>{const u=P=>()=>{i(P)};if(!t)return;const v=u("loaded"),I=u("error");return t.addEventListener("load",v),t.addEventListener("error",I),r&&(t.referrerPolicy=r),typeof s=="string"&&(t.crossOrigin=s),()=>{t.removeEventListener("load",v),t.removeEventListener("error",I)}},[t,s,r]),p}var M=C,D=_,B=R;const n=o.forwardRef(({className:e,...r},s)=>a.jsx(M,{ref:s,className:S("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",e),...r}));n.displayName=M.displayName;const m=o.forwardRef(({className:e,...r},s)=>a.jsx(D,{ref:s,className:S("aspect-square h-full w-full",e),...r}));m.displayName=D.displayName;const l=o.forwardRef(({className:e,...r},s)=>a.jsx(B,{ref:s,className:S("flex h-full w-full items-center justify-center rounded-full bg-muted",e),...r}));l.displayName=B.displayName;n.__docgenInfo={description:"",methods:[]};m.__docgenInfo={description:"",methods:[]};l.__docgenInfo={description:"",methods:[]};const ta={title:"UI/Avatar",component:n,parameters:{layout:"centered"},tags:["autodocs"]},h={render:()=>a.jsxs(n,{children:[a.jsx(m,{src:"https://github.com/shadcn.png",alt:"@shadcn"}),a.jsx(l,{children:"CN"})]})},g={render:()=>a.jsxs(n,{children:[a.jsx(m,{src:"/broken-image.jpg",alt:"@user"}),a.jsx(l,{children:"JD"})]})},A={render:()=>a.jsx(n,{children:a.jsx(l,{children:"AB"})})},f={render:()=>a.jsxs(n,{className:"h-16 w-16",children:[a.jsx(m,{src:"https://github.com/shadcn.png",alt:"@shadcn"}),a.jsx(l,{children:"CN"})]})},x={render:()=>a.jsxs(n,{className:"h-8 w-8",children:[a.jsx(m,{src:"https://github.com/shadcn.png",alt:"@shadcn"}),a.jsx(l,{children:"CN"})]})},b={render:()=>a.jsxs("div",{className:"flex items-center space-x-4",children:[a.jsxs(n,{children:[a.jsx(m,{src:"https://github.com/shadcn.png",alt:"@shadcn"}),a.jsx(l,{children:"CN"})]}),a.jsxs(n,{children:[a.jsx(m,{src:"https://github.com/vercel.png",alt:"@vercel"}),a.jsx(l,{children:"VR"})]}),a.jsx(n,{children:a.jsx(l,{children:"AB"})})]})},j={render:()=>a.jsxs("div",{className:"flex items-center space-x-4",children:[a.jsxs(n,{children:[a.jsx(m,{src:"https://github.com/shadcn.png",alt:"@shadcn"}),a.jsx(l,{children:"CN"})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-sm font-medium leading-none",children:"John Doe"}),a.jsx("p",{className:"text-sm text-muted-foreground",children:"john@example.com"})]})]})};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
}`,...h.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar>
      <AvatarImage src="/broken-image.jpg" alt="@user" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
}`,...g.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
}`,...A.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar className="h-16 w-16">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
}`,...f.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar className="h-8 w-8">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
}`,...x.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
        <AvatarFallback>VR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    </div>
}`,...b.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium leading-none">John Doe</p>
        <p className="text-sm text-muted-foreground">john@example.com</p>
      </div>
    </div>
}`,...j.parameters?.docs?.source}}};const sa=["Default","WithFallback","FallbackOnly","Large","Small","MultipleAvatars","WithName"];export{h as Default,A as FallbackOnly,f as Large,b as MultipleAvatars,x as Small,g as WithFallback,j as WithName,sa as __namedExportsOrder,ta as default};
