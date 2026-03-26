import{j as o}from"./iframe-B2sv3z--.js";import{H as r}from"./header-actions-tRbzyRrb.js";import{d as s}from"./default-routes-CqolUEBP.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./button-CuPAXXHd.js";import"./index-ojs0XM5b.js";import"./index-CdJFUDDL.js";import"./popover-BZWdwQcX.js";import"./index-DehB9XTy.js";import"./index-CFhbmjQN.js";import"./index-DGA11cGX.js";import"./index-dFd8z_VS.js";import"./Combination-CVHJjhEU.js";import"./index-BOcI3EBp.js";import"./index-BHEqwGAn.js";import"./index-BBKt_i3X.js";import"./index-CYk8cACR.js";import"./index-Duqzc3UP.js";import"./render-icon-EYbjJv2z.js";import"./createLucideIcon-Bwht0sgB.js";import"./store-F7RDwBnd.js";import"./monitor-speaker-DOUMcHVE.js";import"./users-O13I7vWA.js";import"./trending-up-DIPn3Qxp.js";import"./settings-2-Dg95SXfj.js";import"./settings-DTWUPnnQ.js";import"./user-DWVaoi2S.js";import"./search-CnB7SJuU.js";import"./building-2-DJtB2wEP.js";const W={title:"UI/Header Actions",component:r,parameters:{layout:"centered",docs:{description:{component:`
# Header Actions

A component that displays icon buttons for quick access to key application areas: Notifications, Profile, and Organisation settings.

## Features

- **Global Search**: Inline search input with categorized autocomplete
- **Icon-based Navigation**: Clean, icon-only buttons for minimal UI footprint
- **Notification Indicator**: Red dot badge on bell icon to show unread notifications
- **Hover States**: Subtle hover effects for better user feedback
- **Accessible**: Proper ARIA labels for screen readers
- **Router Integration**: Works with both Next.js router and custom Storybook router
- **Customizable**: Support for custom click handlers via props

## Usage

This component is typically placed in the top-right corner of the application header, on the same line as the breadcrumb navigation.

## Navigation Targets

- **Search Input**: Type to search campaigns, bookings, creatives, and pages
- **Bell Icon**: Opens Notifications Center (/notifications)
- **User Icon**: Opens User Profile (/profile)
- **Building Icon**: Opens Organisation Settings (placeholder)
        `}}},tags:["autodocs"],argTypes:{routes:{control:"object",description:"Navigation routes for search functionality"},onNotificationsClick:{action:"notifications clicked"},onProfileClick:{action:"profile clicked"},onOrganisationClick:{action:"organisation clicked"},hasUnreadNotifications:{control:"boolean",description:"Shows a red dot indicator when there are unread notifications",defaultValue:!0}}},e={args:{hasUnreadNotifications:!0,routes:s}},t={args:{hasUnreadNotifications:!1,routes:s},parameters:{docs:{description:{story:"HeaderActions without the red notification indicator."}}}},a={args:{onNotificationsClick:()=>console.log("Custom notifications handler"),onProfileClick:()=>console.log("Custom profile handler"),onOrganisationClick:()=>console.log("Custom organisation handler")},parameters:{docs:{description:{story:"Example with custom click handlers instead of default routing behavior."}}}},i={render:()=>o.jsx("div",{className:"w-full bg-white p-4 rounded-lg shadow-sm",children:o.jsxs("div",{className:"flex items-center justify-between",children:[o.jsxs("div",{className:"text-sm text-slate-600",children:[o.jsx("span",{className:"text-slate-900 font-medium",children:"Dashboard"}),o.jsx("span",{className:"mx-2",children:"/"}),o.jsx("span",{children:"Campaigns"})]}),o.jsx(r,{routes:s})]})}),parameters:{docs:{description:{story:"Example showing the HeaderActions component in context with breadcrumb navigation."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    hasUnreadNotifications: true,
    routes: defaultRoutes
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    hasUnreadNotifications: false,
    routes: defaultRoutes
  },
  parameters: {
    docs: {
      description: {
        story: 'HeaderActions without the red notification indicator.'
      }
    }
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    onNotificationsClick: () => console.log('Custom notifications handler'),
    onProfileClick: () => console.log('Custom profile handler'),
    onOrganisationClick: () => console.log('Custom organisation handler')
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with custom click handlers instead of default routing behavior.'
      }
    }
  }
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          <span className="text-slate-900 font-medium">Dashboard</span>
          <span className="mx-2">/</span>
          <span>Campaigns</span>
        </div>
        <HeaderActions routes={defaultRoutes} />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example showing the HeaderActions component in context with breadcrumb navigation.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};const z=["Default","NoUnreadNotifications","WithCustomHandlers","InContext"];export{e as Default,i as InContext,t as NoUnreadNotifications,a as WithCustomHandlers,z as __namedExportsOrder,W as default};
