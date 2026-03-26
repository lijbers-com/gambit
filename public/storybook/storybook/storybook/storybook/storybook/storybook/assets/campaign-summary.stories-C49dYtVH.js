import{C as d}from"./campaign-summary-CSpuEsuQ.js";import{a as l}from"./date-picker-BgzZ_azE.js";import"./iframe-CHTXZqHT.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./card-CW8PFIxP.js";import"./badge-tQgOHfzk.js";import"./index-CdJFUDDL.js";import"./CategoricalChart-DMCpQKy-.js";import"./index-B4jz1kAT.js";import"./LineChart-BR6VPFG6.js";import"./ActivePoints-AM0bOTXX.js";import"./LabelList-DWPvemlA.js";import"./ErrorBar-DjEocbtv.js";import"./CartesianChart-C_l70-Uh.js";import"./input-C563dLlj.js";import"./dropdown-menu-BpjMxfKo.js";import"./index-DVh6J3qr.js";import"./index-Bewmt33Y.js";import"./index-CnT3Uich.js";import"./index-Bs7E9PJc.js";import"./index-Csd0mXSg.js";import"./index-DIhyg6RD.js";import"./index-IS2wP4Ks.js";import"./index-C9_Qsora.js";import"./Combination-Cg5hGoMc.js";import"./index-Dv4mTO0q.js";import"./index-B01eqHDT.js";import"./index-BFaNEU3W.js";import"./checkbox-Bt-gaoCs.js";import"./index-BsF0p07j.js";import"./check-B9DH0HFd.js";import"./createLucideIcon-C4RkYYok.js";import"./circle-CrkDz0bp.js";import"./chevron-right-Nj7-Lm2e.js";import"./button-6Pp8Vv4a.js";import"./chevron-down-D0T9YktY.js";import"./x-CFpX2Oyw.js";import"./label-n8K7ANyR.js";import"./switch-Dyonk8iM.js";import"./notification-item-Bsn-CfnS.js";import"./circle-alert-oUZpP6D0.js";import"./trending-up-DZqTHBJe.js";import"./sparkles-STOg-GqC.js";import"./ellipsis-DKuwGljM.js";import"./chevron-up-CbPA-AJK.js";import"./dollar-sign-DEj5N4gl.js";import"./globe-Es2vDb1s.js";import"./store-BXFWTEpu.js";import"./monitor-speaker-DnNpYfke.js";import"./square-pen-D0K0PKK1.js";import"./plus-Cz5X-c1K.js";import"./info-DmAOrI0L.js";import"./chevron-left-CTaZX9rv.js";import"./popover-BELfsOx9.js";const ue={title:"UI/CampaignSummary",component:d,parameters:{layout:"centered",docs:{description:{component:`
# Campaign Summary Component

A comprehensive campaign summary card component that displays campaign configuration details with interactive controls.

## Features

- **Campaign Overview**: Title, badge, and goal configuration
- **Audience Selection**: Input field with optional dropdown support
- **Metrics Display**: ROAS estimation and budget with clear visual hierarchy
- **Engine Management**: List of advertising engines with toggle controls
- **Time Configuration**: Campaign run time display with calendar icon
- **Feature Toggles**: Interactive switches for campaign features
- **Action Buttons**: Edit and Add to Cart functionality

## Usage

\`\`\`tsx
import { CampaignSummary } from '@/components/ui/campaign-summary';

<CampaignSummary
  title="AI performance campaign, week 1-4"
  badge={{ text: "Best ROAS", variant: "default" }}
  goal="Performance on transaction"
  audience="AH bonus shoppers"
  estimatedRoas="4.8x"
  budget="$5,000"
  engines={[
    { id: 'display', name: 'Display', enabled: true },
    { id: 'sponsored', name: 'Sponsored products', enabled: true },
    { id: 'digital', name: 'Digital in-store', enabled: true }
  ]}
  runTime={{ start: '31 Dec, 2023', end: '31 Jan, 2024' }}
  features={[
    { id: 'auto-bidding', label: 'Auto bidding', enabled: true },
    { id: 'goal-based', label: 'Goal-Based Media placement', enabled: true }
  ]}
  onEdit={() => console.log('Edit clicked')}
/>
\`\`\`

## Interactive Elements

- **Goal Input**: Editable text field for campaign goal
- **Audience Selection**: Can be configured as dropdown or text input
- **Engine Toggles**: Switch controls to enable/disable advertising engines
- **Feature Toggles**: Switch controls for campaign features
- **Action Buttons**: Edit (outline) and Add to Cart (primary) buttons
        `}}},tags:["autodocs"],argTypes:{title:{control:"text",description:"Campaign title displayed at the top"},badge:{control:"object",description:"Optional badge with text and variant"},goal:{control:"text",description:"Campaign goal description"},audience:{control:"text",description:"Target audience for the campaign"},estimatedRoas:{control:"text",description:"Estimated return on ad spend"},budget:{control:"text",description:"Campaign budget amount"},engines:{control:"object",description:"Array of advertising engines with toggle states"},dateRange:{control:"object",description:"Campaign date range"},features:{control:"object",description:"Array of campaign features with toggle states"},layout:{control:"select",options:["vertical","horizontal"],description:"Layout orientation for the campaign summary"},usedBudget:{control:"text",description:"Amount of budget already used"},totalPrice:{control:"text",description:"Total price for the campaign"},budgetUsagePercentage:{control:"number",description:"Percentage of budget used (0-100)",min:0,max:100}}},t={title:"AI performance campaign, week 1-4",badge:{text:"Best ROAS",variant:"default"},goal:"performance-transaction",goalOptions:[{label:"Performance on transaction",value:"performance-transaction"},{label:"Brand awareness",value:"brand-awareness"},{label:"Lead generation",value:"lead-generation"},{label:"Customer acquisition",value:"customer-acquisition"},{label:"Retargeting",value:"retargeting"},{label:"Full funnel",value:"full-funnel"}],audience:"ah-bonus",estimatedRoas:"4.8x",budget:"$5,000",engines:[{id:"display",name:"Display",enabled:!0},{id:"sponsored",name:"Sponsored products",enabled:!0},{id:"digital",name:"Digital in-store",enabled:!0}],dateRange:{from:new Date("2023-12-31"),to:l(new Date("2023-12-31"),31)},features:[],onGoalChange:e=>console.log("Goal changed:",e),onAudienceChange:e=>console.log("Audience changed:",e),onBudgetChange:e=>console.log("Budget changed:",e),onEngineToggle:(e,s)=>console.log("Engine toggle:",e,s),onFeatureToggle:(e,s)=>console.log("Feature toggle:",e,s),onDateRangeChange:e=>console.log("Date range changed:",e),onEdit:()=>console.log("Edit clicked")},n={args:t},a={args:{...t,layout:"horizontal",defaultExpanded:!0,usedBudget:"$3,200",totalPrice:"$3,200",budgetUsagePercentage:64,engines:[{id:"display",name:"Display",enabled:!0},{id:"sponsored",name:"Sponsored products",enabled:!0},{id:"digital",name:"Digital in-store",enabled:!0},{id:"offline",name:"Offline in-store",enabled:!0}]},parameters:{layout:"fullscreen",docs:{description:{story:`
# Horizontal Campaign Summary

The horizontal variant provides a wider layout that displays campaign information in a three-column format:

- **Left Column**: Core campaign settings (Goal, Audience, Run time)
- **Middle Column**: Engines and Features displayed in line-item style tables with headers and organized rows
- **Right Column**: Metrics and action buttons

## Key Features

- **Line-Item Style Engines**: Engines are displayed in a structured table format similar to line items, with clear headers and organized rows
- **Table Layout**: Each engine shows in a dedicated row with proper spacing and hover effects
- **Enhanced Visual Hierarchy**: Better organization of information with clear column separation
- **Responsive Design**: Adapts to wider screens while maintaining usability

## Use Cases

- Dashboard views where more horizontal space is available
- Desktop applications with wide screens
- Administrative interfaces requiring quick access to all campaign details
- Situations where the campaign summary needs to integrate with other horizontal elements

The horizontal layout maintains all the interactive functionality of the vertical version while providing a more structured, table-like presentation of engines and features.
        `}}}},i={args:{...t,layout:"horizontal",usedBudget:"$4,600",totalPrice:"$4,600",budgetUsagePercentage:92,engines:[{id:"display",name:"Display",enabled:!0},{id:"sponsored",name:"Sponsored products",enabled:!0},{id:"digital",name:"Digital in-store",enabled:!0},{id:"offline",name:"Offline in-store",enabled:!0}]},parameters:{layout:"fullscreen",docs:{description:{story:`
# High Budget Usage Example

This variant demonstrates the horizontal layout with high budget usage (92%). The progress bar changes color to red when budget usage exceeds 80%, providing a visual warning that the campaign is nearing its budget limit.

The Campaign Summary panel shows:
- Used Budget: $4,600
- Total Price: $5,800
- Budget Usage: 92% (displayed in red)

This helps campaign managers quickly identify campaigns that need immediate attention or budget adjustment.
        `}}}},o={args:{...t,layout:"horizontal",usedBudget:"$1,200",totalPrice:"$1,200",budgetUsagePercentage:24,engines:[{id:"display",name:"Display",enabled:!0},{id:"sponsored",name:"Sponsored products",enabled:!0},{id:"digital",name:"Digital in-store",enabled:!0},{id:"offline",name:"Offline in-store",enabled:!0}]},parameters:{layout:"fullscreen",docs:{description:{story:`
# Low Budget Usage Example

This variant shows the horizontal layout with low budget usage (24%). The progress bar displays in green when budget usage is below 50%, indicating healthy budget utilization with plenty of room for continued spending.

The Campaign Summary panel shows:
- Used Budget: $1,200
- Total Price: $5,800
- Budget Usage: 24% (displayed in green)

This helps campaign managers identify campaigns that may benefit from optimization to improve performance.
        `}}}},r={args:{...t,title:"",badge:{text:"New",variant:"outline"},layout:"horizontal",defaultExpanded:!0,guidedSetup:!0,budget:"",goal:"",engines:[],hideGoal:!0,hideTargeting:!0,hideAgent:!0,hideAutoBudget:!0,hideEngineToggle:!0},parameters:{layout:"fullscreen",docs:{description:{story:`
# Guided Setup Variant

This variant starts with the Settings card displayed full-width, prompting the user to set budget and runtime first. Once those are configured and the user clicks "Continue to campaigns", the Settings card animates to the right column and the campaign list becomes visible.

## Flow

1. **Step 1 - Settings**: The grey settings area fills the full card width. Budget and runtime fields are prominently displayed.
2. **Step 2 - Campaigns**: After clicking "Continue", the settings area slides to the right and the campaign list appears on the left with an "Add campaign" button.

## Use Cases

- New media experience creation where budget and runtime must be set before adding campaigns
- Guided onboarding flow for first-time campaign setup
- Ensuring users don't skip critical budget/runtime configuration
        `}}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: defaultProps
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultProps,
    layout: 'horizontal',
    defaultExpanded: true,
    usedBudget: '$3,200',
    totalPrice: '$3,200',
    budgetUsagePercentage: 64,
    engines: [{
      id: 'display',
      name: 'Display',
      enabled: true
    }, {
      id: 'sponsored',
      name: 'Sponsored products',
      enabled: true
    }, {
      id: 'digital',
      name: 'Digital in-store',
      enabled: true
    }, {
      id: 'offline',
      name: 'Offline in-store',
      enabled: true
    }]
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: \`
# Horizontal Campaign Summary

The horizontal variant provides a wider layout that displays campaign information in a three-column format:

- **Left Column**: Core campaign settings (Goal, Audience, Run time)
- **Middle Column**: Engines and Features displayed in line-item style tables with headers and organized rows
- **Right Column**: Metrics and action buttons

## Key Features

- **Line-Item Style Engines**: Engines are displayed in a structured table format similar to line items, with clear headers and organized rows
- **Table Layout**: Each engine shows in a dedicated row with proper spacing and hover effects
- **Enhanced Visual Hierarchy**: Better organization of information with clear column separation
- **Responsive Design**: Adapts to wider screens while maintaining usability

## Use Cases

- Dashboard views where more horizontal space is available
- Desktop applications with wide screens
- Administrative interfaces requiring quick access to all campaign details
- Situations where the campaign summary needs to integrate with other horizontal elements

The horizontal layout maintains all the interactive functionality of the vertical version while providing a more structured, table-like presentation of engines and features.
        \`
      }
    }
  }
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultProps,
    layout: 'horizontal',
    usedBudget: '$4,600',
    totalPrice: '$4,600',
    budgetUsagePercentage: 92,
    engines: [{
      id: 'display',
      name: 'Display',
      enabled: true
    }, {
      id: 'sponsored',
      name: 'Sponsored products',
      enabled: true
    }, {
      id: 'digital',
      name: 'Digital in-store',
      enabled: true
    }, {
      id: 'offline',
      name: 'Offline in-store',
      enabled: true
    }]
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: \`
# High Budget Usage Example

This variant demonstrates the horizontal layout with high budget usage (92%). The progress bar changes color to red when budget usage exceeds 80%, providing a visual warning that the campaign is nearing its budget limit.

The Campaign Summary panel shows:
- Used Budget: $4,600
- Total Price: $5,800
- Budget Usage: 92% (displayed in red)

This helps campaign managers quickly identify campaigns that need immediate attention or budget adjustment.
        \`
      }
    }
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultProps,
    layout: 'horizontal',
    usedBudget: '$1,200',
    totalPrice: '$1,200',
    budgetUsagePercentage: 24,
    engines: [{
      id: 'display',
      name: 'Display',
      enabled: true
    }, {
      id: 'sponsored',
      name: 'Sponsored products',
      enabled: true
    }, {
      id: 'digital',
      name: 'Digital in-store',
      enabled: true
    }, {
      id: 'offline',
      name: 'Offline in-store',
      enabled: true
    }]
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: \`
# Low Budget Usage Example

This variant shows the horizontal layout with low budget usage (24%). The progress bar displays in green when budget usage is below 50%, indicating healthy budget utilization with plenty of room for continued spending.

The Campaign Summary panel shows:
- Used Budget: $1,200
- Total Price: $5,800
- Budget Usage: 24% (displayed in green)

This helps campaign managers identify campaigns that may benefit from optimization to improve performance.
        \`
      }
    }
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultProps,
    title: '',
    badge: {
      text: 'New',
      variant: 'outline' as const
    },
    layout: 'horizontal',
    defaultExpanded: true,
    guidedSetup: true,
    budget: '',
    goal: '',
    engines: [],
    hideGoal: true,
    hideTargeting: true,
    hideAgent: true,
    hideAutoBudget: true,
    hideEngineToggle: true
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: \`
# Guided Setup Variant

This variant starts with the Settings card displayed full-width, prompting the user to set budget and runtime first. Once those are configured and the user clicks "Continue to campaigns", the Settings card animates to the right column and the campaign list becomes visible.

## Flow

1. **Step 1 - Settings**: The grey settings area fills the full card width. Budget and runtime fields are prominently displayed.
2. **Step 2 - Campaigns**: After clicking "Continue", the settings area slides to the right and the campaign list appears on the left with an "Add campaign" button.

## Use Cases

- New media experience creation where budget and runtime must be set before adding campaigns
- Guided onboarding flow for first-time campaign setup
- Ensuring users don't skip critical budget/runtime configuration
        \`
      }
    }
  }
}`,...r.parameters?.docs?.source}}};const pe=["Default","Horizontal","HorizontalHighBudgetUsage","HorizontalLowBudgetUsage","GuidedSetup"];export{n as Default,r as GuidedSetup,a as Horizontal,i as HorizontalHighBudgetUsage,o as HorizontalLowBudgetUsage,pe as __namedExportsOrder,ue as default};
