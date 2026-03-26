import{j as a}from"./iframe-BVumAmaP.js";import{S as i}from"./smart-breadcrumbs-CcXEoCxR.js";import{d as r}from"./default-routes-CqolUEBP.js";import"./preload-helper-PPVm8Dsz.js";import"./breadcrumb-CTrC8j_z.js";import"./index-CYMrhGm5.js";import"./utils-CBfrqCZ4.js";import"./use-menu-4J1XW6rd.js";import"./button-C0Q2-t8z.js";import"./index-CdJFUDDL.js";import"./createLucideIcon-olMS5pkE.js";import"./chevron-right-C7uhGK00.js";const k={title:"UI/SmartBreadcrumbs",component:i,parameters:{layout:"padded",docs:{description:{component:`
# Smart Breadcrumbs

The SmartBreadcrumbs component automatically generates breadcrumb navigation based on the current URL path and route configuration. It provides:

## Features

- **Automatic Path Detection**: Uses Next.js usePathname to detect current route
- **Route-based Labels**: Maps URLs to proper names using route configuration
- **Navigation Toggle**: Optional toggle button for side navigation
- **Theme Support**: Inherits theme colors from CSS custom properties
- **Interactive Navigation**: All breadcrumb items are clickable links
- **Query Parameter Support**: Optional support for preserving query parameters

## Route Integration

When provided with a routes array, the component will:
1. Match current URL to route configuration
2. Use proper names from route definitions (e.g. "Sponsored products" instead of "sponsored-products")
3. Handle nested routes and parent/child relationships

## Usage

Use this component in layouts or pages where you want automatic breadcrumb navigation that stays in sync with your application's routing structure.
        `}}},tags:["autodocs"],argTypes:{namespace:{control:{type:"text"},description:"Namespace for the breadcrumb component"},homeTitle:{control:{type:"text"},description:"Title for the home breadcrumb item"},showNavToggle:{control:{type:"boolean"},description:"Whether to show the navigation toggle button"},passQueryParameters:{control:{type:"boolean"},description:"Whether to preserve query parameters in breadcrumb links"}}},s=e=>(new URLSearchParams,a.jsxs("div",{className:"w-full",children:[a.jsxs("div",{className:"mb-4 p-3 bg-slate-100 rounded text-sm",children:[a.jsx("strong",{children:"Simulated Path:"})," ",e.mockPath||"/campaigns/sponsored-products"]}),a.jsx(i,{...e})]})),o={args:{namespace:"app",homeTitle:"Home",showNavToggle:!0,routes:r,passQueryParameters:!1},render:e=>a.jsx(s,{...e,mockPath:"/campaigns/sponsored-products"})},t={args:{namespace:"app",homeTitle:"Home",showNavToggle:!0,routes:r,passQueryParameters:!1},render:e=>a.jsx(s,{...e,mockPath:"/campaigns/display"})},m={args:{namespace:"app",homeTitle:"Home",showNavToggle:!1,routes:r,passQueryParameters:!1},render:e=>a.jsx(s,{...e,mockPath:"/creatives/digital-instore"})},p={args:{namespace:"app",homeTitle:"Dashboard",showNavToggle:!0,routes:r,passQueryParameters:!1},render:e=>a.jsx(s,{...e,mockPath:"/dashboard"})},c={args:{namespace:"app",homeTitle:"Home",showNavToggle:!0,routes:r,passQueryParameters:!0},render:e=>a.jsx(s,{...e,mockPath:"/insights/sponsored-products"})},n={args:{namespace:"app",homeTitle:"Home",showNavToggle:!0,routes:r,passQueryParameters:!1},render:e=>a.jsx(s,{...e,mockPath:"/yield/offline-instore"})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    namespace: 'app',
    homeTitle: 'Home',
    showNavToggle: true,
    routes: defaultRoutes,
    passQueryParameters: false
  },
  render: args => <MockedSmartBreadcrumbs {...args} mockPath="/campaigns/sponsored-products" />
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    namespace: 'app',
    homeTitle: 'Home',
    showNavToggle: true,
    routes: defaultRoutes,
    passQueryParameters: false
  },
  render: args => <MockedSmartBreadcrumbs {...args} mockPath="/campaigns/display" />
}`,...t.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    namespace: 'app',
    homeTitle: 'Home',
    showNavToggle: false,
    routes: defaultRoutes,
    passQueryParameters: false
  },
  render: args => <MockedSmartBreadcrumbs {...args} mockPath="/creatives/digital-instore" />
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    namespace: 'app',
    homeTitle: 'Dashboard',
    showNavToggle: true,
    routes: defaultRoutes,
    passQueryParameters: false
  },
  render: args => <MockedSmartBreadcrumbs {...args} mockPath="/dashboard" />
}`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    namespace: 'app',
    homeTitle: 'Home',
    showNavToggle: true,
    routes: defaultRoutes,
    passQueryParameters: true
  },
  render: args => <MockedSmartBreadcrumbs {...args} mockPath="/insights/sponsored-products" />
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    namespace: 'app',
    homeTitle: 'Home',
    showNavToggle: true,
    routes: defaultRoutes,
    passQueryParameters: false
  },
  render: args => <MockedSmartBreadcrumbs {...args} mockPath="/yield/offline-instore" />
}`,...n.parameters?.docs?.source}}};const N=["CampaignPage","WithNavToggle","WithoutNavToggle","Dashboard","DeepPath","YieldManagement"];export{o as CampaignPage,p as Dashboard,c as DeepPath,t as WithNavToggle,m as WithoutNavToggle,n as YieldManagement,N as __namedExportsOrder,k as default};
