import{j as o}from"./iframe-DIN2IKqe.js";import{H as r}from"./header-actions-B_GGG-l_.js";import{d as s}from"./default-routes-CqolUEBP.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./button-B9Y0ZSwa.js";import"./index-BrN91Rgp.js";import"./index-CdJFUDDL.js";import"./popover-2KUBjTNn.js";import"./index-DywWKZUd.js";import"./index-DjuRppva.js";import"./index-C8pd1VWv.js";import"./index-D93m9KRt.js";import"./Combination-B4vWFPwN.js";import"./index-Br6PxJxS.js";import"./index-X7hHvCXq.js";import"./index-BEqAkVqP.js";import"./index-DNa-te7d.js";import"./index-vD8Qkz52.js";import"./render-icon-C2P_QOoX.js";import"./createLucideIcon-Buzyb9Q7.js";import"./store-Dc94NX38.js";import"./monitor-speaker-CriOLiTU.js";import"./users-CIBcujM6.js";import"./trending-up-_LOCk0vT.js";import"./settings-2-Bff-SFll.js";import"./settings-BpjTVvqj.js";import"./user-B5gLj5yM.js";import"./search-BKytZcvT.js";import"./building-2-2lMmRjT8.js";const W={title:"UI/Header Actions",component:r,parameters:{layout:"centered",docs:{description:{component:`
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
