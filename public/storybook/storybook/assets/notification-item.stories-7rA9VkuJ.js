import{j as e}from"./iframe-DIN2IKqe.js";import{N as i}from"./notification-item-B7vMVV8v.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./badge-BDRNArob.js";import"./index-CdJFUDDL.js";import"./button-B9Y0ZSwa.js";import"./index-BrN91Rgp.js";import"./createLucideIcon-Buzyb9Q7.js";import"./circle-alert-DIbiEBhz.js";import"./trending-up-_LOCk0vT.js";import"./sparkles-Oq2-UU-P.js";const b={title:"UI/NotificationItem",component:i,parameters:{layout:"centered",docs:{description:{component:`
# Notification Item Component

A reusable notification component that displays AI insights, alerts, opportunities, and other notifications with consistent styling and interactive elements.

## Features

- **Multiple Types**: AI Insight, Budget Alert, Opportunity, Warning, Info
- **Icon Integration**: Each type has a dedicated Lucide icon
- **Badge Variants**: Color-coded badges for quick identification
- **Interactive Links**: Clickable links within notification text
- **Action Button**: Icon button for primary actions
- **Hover Effects**: Smooth transitions on hover

## Notification Types

### AI Insight
Blue badge with MessageSquare icon - Used for AI-powered recommendations and insights

### Budget Alert
Yellow/orange badge with AlertCircle icon - Used for budget-related warnings

### Opportunity
Green badge with TrendingUp icon - Used for potential revenue opportunities

### Warning
Red badge with AlertCircle icon - Used for critical alerts

### Info
Gray badge with Lightbulb icon - Used for informational messages

## Usage

\`\`\`tsx
import { NotificationItem } from '@/components/ui/notification-item';

<NotificationItem
  type="ai-insight"
  message='Campaign "Spring Sale" could improve CTR by 23% with optimized targeting parameters.'
  linkText='"Spring Sale"'
  onLinkClick={() => console.log('Navigate to campaign')}
  onActionClick={() => console.log('Open chat')}
/>
\`\`\`

## Props

- **type**: 'ai-insight' | 'budget-alert' | 'opportunity' | 'warning' | 'info'
- **message**: The notification text content
- **linkText**: Optional text to make clickable within the message
- **onLinkClick**: Callback when the link is clicked
- **onActionClick**: Callback when the icon button is clicked
- **className**: Optional additional CSS classes
        `}}},tags:["autodocs"],argTypes:{type:{control:"select",options:["ai-insight","budget-alert","opportunity","warning","info"],description:"Type of notification"},message:{control:"text",description:"The notification message text"},linkText:{control:"text",description:"Text within message to make clickable"},onLinkClick:{action:"link-clicked",description:"Callback when link is clicked"},onActionClick:{action:"action-clicked",description:"Callback when icon button is clicked"}}},o={args:{type:"ai-insight",message:'Campaign "Spring Sale" could improve CTR by 23% with optimized targeting parameters.',linkText:'"Spring Sale"',onLinkClick:()=>console.log("Navigate to Spring Sale campaign"),onActionClick:()=>console.log("Open AI chat")}},n={args:{type:"ai-insight",message:'Creative "Banner_Summer_v2" shows 34% higher engagement in evening time slots.',linkText:'"Banner_Summer_v2"',onLinkClick:()=>console.log("Navigate to creative"),onActionClick:()=>console.log("Open AI chat")}},t={args:{type:"budget-alert",message:'Campaign "Summer Sale" budget recommendation. Opportunity: $12.5K potential lost revenue.',linkText:'"Summer Sale"',onLinkClick:()=>console.log("Navigate to campaign"),onActionClick:()=>console.log("View budget details")}},a={args:{type:"opportunity",message:'Product "Premium Coffee Beans" has 45% higher conversion rate when shown in morning hours.',linkText:'"Premium Coffee Beans"',onLinkClick:()=>console.log("Navigate to product"),onActionClick:()=>console.log("View opportunity")}},s={args:{type:"warning",message:'Campaign "Black Friday" is approaching budget limit. Only 8% remaining.',linkText:'"Black Friday"',onLinkClick:()=>console.log("Navigate to campaign"),onActionClick:()=>console.log("View warning details")}},r={args:{type:"info",message:"New targeting options are now available for Display campaigns. Update your settings to take advantage.",onActionClick:()=>console.log("View info")}},c={args:{type:"ai-insight",message:"Your campaigns are performing 15% better than industry average this week.",onActionClick:()=>console.log("View details")}},l={args:{type:"opportunity",message:'Based on historical data and current market trends, campaign "Holiday Season 2024" could see a 35% increase in ROI by adjusting the bidding strategy and expanding to premium ad placements during peak shopping hours.',linkText:'"Holiday Season 2024"',onLinkClick:()=>console.log("Navigate to campaign"),onActionClick:()=>console.log("View opportunity")}},g={render:()=>e.jsxs("div",{className:"space-y-4 w-[600px]",children:[e.jsx(i,{type:"ai-insight",message:'Campaign "Spring Sale" could improve CTR by 23% with optimized targeting parameters.',linkText:'"Spring Sale"',onLinkClick:()=>console.log("Navigate to campaign"),onActionClick:()=>console.log("Open AI chat")}),e.jsx(i,{type:"budget-alert",message:'Campaign "Summer Sale" budget recommendation. Opportunity: $12.5K potential lost revenue.',linkText:'"Summer Sale"',onLinkClick:()=>console.log("Navigate to campaign"),onActionClick:()=>console.log("View budget details")}),e.jsx(i,{type:"opportunity",message:'Product "Premium Coffee Beans" has 45% higher conversion rate when shown in morning hours.',linkText:'"Premium Coffee Beans"',onLinkClick:()=>console.log("Navigate to product"),onActionClick:()=>console.log("View opportunity")}),e.jsx(i,{type:"warning",message:'Campaign "Black Friday" is approaching budget limit. Only 8% remaining.',linkText:'"Black Friday"',onLinkClick:()=>console.log("Navigate to campaign"),onActionClick:()=>console.log("View warning details")}),e.jsx(i,{type:"info",message:"New targeting options are now available for Display campaigns. Update your settings to take advantage.",onActionClick:()=>console.log("View info")})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'ai-insight',
    message: 'Campaign "Spring Sale" could improve CTR by 23% with optimized targeting parameters.',
    linkText: '"Spring Sale"',
    onLinkClick: () => console.log('Navigate to Spring Sale campaign'),
    onActionClick: () => console.log('Open AI chat')
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'ai-insight',
    message: 'Creative "Banner_Summer_v2" shows 34% higher engagement in evening time slots.',
    linkText: '"Banner_Summer_v2"',
    onLinkClick: () => console.log('Navigate to creative'),
    onActionClick: () => console.log('Open AI chat')
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'budget-alert',
    message: 'Campaign "Summer Sale" budget recommendation. Opportunity: $12.5K potential lost revenue.',
    linkText: '"Summer Sale"',
    onLinkClick: () => console.log('Navigate to campaign'),
    onActionClick: () => console.log('View budget details')
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'opportunity',
    message: 'Product "Premium Coffee Beans" has 45% higher conversion rate when shown in morning hours.',
    linkText: '"Premium Coffee Beans"',
    onLinkClick: () => console.log('Navigate to product'),
    onActionClick: () => console.log('View opportunity')
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'warning',
    message: 'Campaign "Black Friday" is approaching budget limit. Only 8% remaining.',
    linkText: '"Black Friday"',
    onLinkClick: () => console.log('Navigate to campaign'),
    onActionClick: () => console.log('View warning details')
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'info',
    message: 'New targeting options are now available for Display campaigns. Update your settings to take advantage.',
    onActionClick: () => console.log('View info')
  }
}`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'ai-insight',
    message: 'Your campaigns are performing 15% better than industry average this week.',
    onActionClick: () => console.log('View details')
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'opportunity',
    message: 'Based on historical data and current market trends, campaign "Holiday Season 2024" could see a 35% increase in ROI by adjusting the bidding strategy and expanding to premium ad placements during peak shopping hours.',
    linkText: '"Holiday Season 2024"',
    onLinkClick: () => console.log('Navigate to campaign'),
    onActionClick: () => console.log('View opportunity')
  }
}`,...l.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-[600px]">
      <NotificationItem type="ai-insight" message='Campaign "Spring Sale" could improve CTR by 23% with optimized targeting parameters.' linkText='"Spring Sale"' onLinkClick={() => console.log('Navigate to campaign')} onActionClick={() => console.log('Open AI chat')} />
      <NotificationItem type="budget-alert" message='Campaign "Summer Sale" budget recommendation. Opportunity: $12.5K potential lost revenue.' linkText='"Summer Sale"' onLinkClick={() => console.log('Navigate to campaign')} onActionClick={() => console.log('View budget details')} />
      <NotificationItem type="opportunity" message='Product "Premium Coffee Beans" has 45% higher conversion rate when shown in morning hours.' linkText='"Premium Coffee Beans"' onLinkClick={() => console.log('Navigate to product')} onActionClick={() => console.log('View opportunity')} />
      <NotificationItem type="warning" message='Campaign "Black Friday" is approaching budget limit. Only 8% remaining.' linkText='"Black Friday"' onLinkClick={() => console.log('Navigate to campaign')} onActionClick={() => console.log('View warning details')} />
      <NotificationItem type="info" message="New targeting options are now available for Display campaigns. Update your settings to take advantage." onActionClick={() => console.log('View info')} />
    </div>
}`,...g.parameters?.docs?.source}}};const A=["AIInsight","AIInsightCreative","BudgetAlert","Opportunity","Warning","Info","WithoutLink","LongMessage","AllTypes"];export{o as AIInsight,n as AIInsightCreative,g as AllTypes,t as BudgetAlert,r as Info,l as LongMessage,a as Opportunity,s as Warning,c as WithoutLink,A as __namedExportsOrder,b as default};
