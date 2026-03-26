import{j as e,u as B,r as l,I as z,R as D}from"./iframe-B2sv3z--.js";import{C as F,b as H}from"./card-CV9YZc92.js";import{I as j}from"./input-ncBsZbtw.js";import{L as v}from"./label-D7LmVzfW.js";import{B as I}from"./button-CuPAXXHd.js";import{D as P,a as R,b as E,e as $,d as U,c as W}from"./dropdown-menu-CS3p5svP.js";import{L as p}from"./logo-Cgnv_6es.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./badge-BuMlIxhD.js";import"./index-CdJFUDDL.js";import"./CategoricalChart-DMmfmZNY.js";import"./index-CL2-xB0p.js";import"./LineChart-DUPfY8Ep.js";import"./ActivePoints-DCUubk-2.js";import"./LabelList-DJ4XRvfB.js";import"./ErrorBar-DbhfJglL.js";import"./CartesianChart-CBLZ8Imy.js";import"./chevron-down-BepfQlRx.js";import"./createLucideIcon-Bwht0sgB.js";import"./x-CbZ9gBzK.js";import"./index-CFhbmjQN.js";import"./index-DGA11cGX.js";import"./index-dFd8z_VS.js";import"./index-ojs0XM5b.js";import"./index-DehB9XTy.js";import"./index-G_2NqKkU.js";import"./index-BHEqwGAn.js";import"./index-BOcI3EBp.js";import"./Combination-CVHJjhEU.js";import"./index-BBKt_i3X.js";import"./index-CYk8cACR.js";import"./index-Duqzc3UP.js";import"./checkbox-DgACiBX7.js";import"./index-CG_rr0_2.js";import"./check-D5-eMeep.js";import"./circle-CA_9n80i.js";import"./chevron-right-BMhUZwQf.js";const ke={title:"Page templates/Login",parameters:{layout:"fullscreen",docs:{description:{component:`
# Login Page Template

The Login page template provides a modern, theme-aware authentication interface with customizable branding for different retail partners.

## Features

- **Split Screen Layout**: Theme-specific branding on the left, login form on the right
- **Theme Variations**: Different visual themes for various retail partners
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Fully accessible form inputs and keyboard navigation
- **Security Features**: Password input with show/hide toggle
- **Additional Actions**: Forgot password and create account links

## Theme Support

Each theme includes:
- Custom background image
- Brand logo
- Theme-specific colors
- Custom welcome text

## Available Themes

1. **Albert Heijn** - Dutch supermarket chain theme
2. **Retail Media Platform** - Generic retail media theme

## Components Used

- Card (form container)
- Input (form fields)
- Label (form labels)
- Button (submit action)
- Custom theme styling
        `}}},tags:["autodocs"]},o=({themes:u,initialTheme:w="albertHeijn"})=>{const{theme:y,setTheme:N}=B(),[b,C]=l.useState(""),[M,A]=l.useState(""),[g,k]=l.useState(!1),[f,x]=l.useState(!1),t=y||w,r=u[t],L=a=>{N(a)},S=async a=>{a.preventDefault(),x(!0),await new Promise(s=>setTimeout(s,2e3)),x(!1),alert(`Login attempted with username: ${b}`)};return e.jsxs("div",{className:"flex h-screen",children:[e.jsx("div",{className:"hidden lg:flex lg:w-1/2 relative overflow-hidden",style:{backgroundImage:`url(${r.backgroundImage})`,backgroundSize:"cover",backgroundPosition:"center"},children:e.jsx("div",{className:"relative z-10 p-12 text-white",children:e.jsxs("div",{className:"absolute top-80 left-12",children:[e.jsx("div",{className:"mb-8",children:r.loginLogo?e.jsx("div",{className:`flex items-start justify-start w-auto ${t==="retailMedia"?"max-h-[180px]":"h-20"}`,children:e.jsx(z,{src:r.loginLogo,alt:`${r.name} logo`,width:t==="retailMedia"?450:200,height:t==="retailMedia"?180:80,className:"object-contain object-left",style:{maxHeight:t==="retailMedia"?"180px":"80px",width:"auto"},priority:!0})}):e.jsx(p,{theme:t==="albertHeijn"?"albert-heijn":t==="delhaize"?"delhaize":t==="adusa"?"adusa":"auto",variant:"auto",alt:`${r.name} logo`,className:`w-auto !justify-start ${t==="retailMedia"?"max-h-[180px]":"h-20"}`})}),e.jsx("h1",{className:"text-4xl font-bold mb-4 w-[400px]",style:{color:t==="albertHeijn"?"#253964":t==="alfaBeta"?"#FFFFFF":t==="delhaize"?"#002948":t==="adusa"?"#00644C":t==="retailMedia"?"#10351F":void 0},children:r.title.split(`
`).map((a,s,T)=>e.jsxs(D.Fragment,{children:[a,s<T.length-1&&e.jsx("br",{})]},s))})]})})}),e.jsx("div",{className:"w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50",children:e.jsx(F,{className:"w-full max-w-md border-0 shadow-none bg-transparent",children:e.jsx(H,{className:"p-0",children:e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"flex justify-start mb-6",children:e.jsxs(P,{children:[e.jsx(R,{asChild:!0,children:e.jsx("button",{className:"hover:opacity-75 transition-opacity",children:e.jsx("div",{className:"flex items-center justify-center rounded-lg w-10 h-10 p-2",style:{backgroundColor:r.brandAppBg},children:e.jsx(p,{theme:t==="albertHeijn"?"albert-heijn":t==="delhaize"?"delhaize":t==="adusa"?"adusa":t==="alfaBeta"?"alfa-beta":"auto",variant:r.brandAppBg==="#ffffff"||t==="retailMedia"?"auto":"white",alt:`${r.name} logo`,className:"h-6 w-6"})})})}),e.jsxs(E,{align:"center",className:"w-56",children:[e.jsx($,{children:"Select Theme"}),e.jsx(U,{}),Object.entries(u).map(([a,s])=>e.jsxs(W,{onClick:()=>L(a),className:"flex items-center gap-3",children:[e.jsx("div",{className:"flex items-center justify-center rounded-lg w-10 h-10 p-2",style:{backgroundColor:s.brandAppBg},children:e.jsx(p,{theme:a==="albertHeijn"?"albert-heijn":a==="delhaize"?"delhaize":a==="adusa"?"adusa":a==="alfaBeta"?"alfa-beta":a==="retailMedia"?"gambit":"auto",variant:s.brandAppBg==="#ffffff"||a==="retailMedia"?"auto":"white",alt:`${s.name} logo`,className:"h-6 w-6"})}),e.jsx("span",{children:s.name}),t===a&&e.jsx("div",{className:"ml-auto w-2 h-2 bg-current rounded-full"})]},a))]})]})}),e.jsx("div",{children:e.jsx("h2",{className:"text-2xl font-semibold text-gray-900",children:"Sign in"})}),e.jsxs("form",{onSubmit:S,className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(v,{htmlFor:"username",className:"text-sm font-normal text-gray-700",children:"Username"}),e.jsx(j,{id:"username",type:"text",value:b,onChange:a=>C(a.target.value),className:"w-full h-11 bg-white border-gray-300",required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(v,{htmlFor:"password",className:"text-sm font-normal text-gray-700",children:"Password"}),e.jsxs("div",{className:"relative",children:[e.jsx(j,{id:"password",type:g?"text":"password",value:M,onChange:a=>A(a.target.value),className:"w-full h-11 bg-white border-gray-300 pr-10",required:!0}),e.jsx("button",{type:"button",onClick:()=>k(!g),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",tabIndex:-1,children:g?e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"})}):e.jsxs("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})})]})]}),e.jsx(I,{type:"submit",className:"w-full h-11 text-base font-medium",disabled:f,children:f?"Signing in...":"Sign in"})]}),e.jsxs("div",{className:"space-y-3 text-left",children:[e.jsx("a",{href:"#",className:"block text-sm text-gray-600 hover:text-gray-900 underline",onClick:a=>{a.preventDefault(),alert("Forgot password clicked")},children:"Forgot your password?"}),e.jsxs("div",{className:"text-sm text-gray-600",children:["No account?"," ",e.jsx("a",{href:"#",className:"text-gray-600 hover:text-gray-900 underline",onClick:a=>{a.preventDefault(),alert("Create account clicked")},children:"Create one"})]})]})]})})})})]})},i={albertHeijn:{name:"Albert Heijn",logo:"/ah-logo.svg",loginLogo:"/ah-login-logo.svg",backgroundImage:"/ah-background.png",primaryColor:"#00A0E2",brandAppBg:"#00ADE6",title:"Jouw Zelf Service Platform bij Albert Heijn",subtitle:"Retail Media Services"},retailMedia:{name:"Retail Media Platform",logo:"/gambit-logo.svg",loginLogo:"/gambit-login-logo.svg",backgroundImage:"/gambit-background.svg",primaryColor:"#10B981",brandAppBg:"#1E5032",title:"Your retail media toolbox",subtitle:"Maximize your retail advertising impact"},delhaize:{name:"Delhaize",logo:"/delhaize-logo.svg",loginLogo:"/delhaize-login-logo.svg",backgroundImage:"/delhaize-background.svg",primaryColor:"#CE1230",brandAppBg:"#CE1230",title:"Reach your customers where they are!",subtitle:"Retail Media Services"},adusa:{name:"AD USA",logo:"/adusa-logo.svg",loginLogo:"/adusa-login-logo.svg",backgroundImage:"/adusa-background.png",primaryColor:"#00644C",brandAppBg:"#00644C",title:`Easy.
Activation.
Wherever.`,subtitle:"Retail Media Services"},alfaBeta:{name:"Alfa Beta",logo:"/alfabeta-logo.svg",loginLogo:"/alfabeta-login-logo.svg",backgroundImage:"/alfabeta-background.png",primaryColor:"#0066CC",brandAppBg:"#ffffff",title:"Καλώς ήρθατε στο Alfa Beta Retail Media",subtitle:"Retail Media Services"}},n={parameters:{globals:{theme:"albertHeijn"}},render:()=>e.jsx(o,{themes:i,initialTheme:"albertHeijn"})},m={parameters:{globals:{theme:"retailMedia"}},render:()=>e.jsx(o,{themes:i,initialTheme:"retailMedia"})},d={parameters:{globals:{theme:"delhaize"}},render:()=>e.jsx(o,{themes:i,initialTheme:"delhaize"})},c={parameters:{globals:{theme:"adusa"}},render:()=>e.jsx(o,{themes:i,initialTheme:"adusa"})},h={parameters:{globals:{theme:"alfaBeta"}},render:()=>e.jsx(o,{themes:i,initialTheme:"alfaBeta"})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  parameters: {
    globals: {
      theme: 'albertHeijn'
    }
  },
  render: () => <LoginTemplate themes={themes} initialTheme="albertHeijn" />
}`,...n.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    globals: {
      theme: 'retailMedia'
    }
  },
  render: () => <LoginTemplate themes={themes} initialTheme="retailMedia" />
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    globals: {
      theme: 'delhaize'
    }
  },
  render: () => <LoginTemplate themes={themes} initialTheme="delhaize" />
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  parameters: {
    globals: {
      theme: 'adusa'
    }
  },
  render: () => <LoginTemplate themes={themes} initialTheme="adusa" />
}`,...c.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  parameters: {
    globals: {
      theme: 'alfaBeta'
    }
  },
  render: () => <LoginTemplate themes={themes} initialTheme="alfaBeta" />
}`,...h.parameters?.docs?.source}}};const Le=["AlbertHeijn","RetailMediaPlatform","Delhaize","ADUSA","AlfaBeta"];export{c as ADUSA,n as AlbertHeijn,h as AlfaBeta,d as Delhaize,m as RetailMediaPlatform,Le as __namedExportsOrder,ke as default};
