import{j as e,R as n}from"./iframe-DIN2IKqe.js";import{A as t,a as s,b as r}from"./alert-BjetA6OT.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CdJFUDDL.js";import"./utils-CBfrqCZ4.js";import"./circle-alert-DIbiEBhz.js";import"./createLucideIcon-Buzyb9Q7.js";import"./triangle-alert-BOHPS9Xc.js";import"./x-B-NQcBKM.js";const Y={title:"UI/Alert",component:t,parameters:{layout:"padded",docs:{description:{component:`
# Alert Component

A versatile alert component for displaying important messages to users with different severity levels.

## Features
- **Multiple variants**: info, warning, error, success, and default
- **Icons**: Automatic icon selection based on variant
- **Dismissible**: Optional close button
- **Accessible**: Proper ARIA attributes
- **Responsive**: Works on all screen sizes

## Usage

\`\`\`tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Basic alert
<Alert>
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>Alert description text.</AlertDescription>
</Alert>

// Success alert with close button
<Alert variant="success" onClose={() => console.log('Closed')}>
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Your action was completed successfully.</AlertDescription>
</Alert>
\`\`\`

## Variants

- **default**: Neutral alert for general information
- **info**: Blue alert for informational messages
- **warning**: Yellow alert for warnings
- **error**: Red alert for errors or critical issues
- **success**: Green alert for success messages
        `}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","info","warning","error","success"],description:"The visual style variant of the alert",table:{defaultValue:{summary:"default"}}},onClose:{description:"Callback function when the close button is clicked",action:"closed"}}},i={args:{children:e.jsxs(e.Fragment,{children:[e.jsx(s,{children:"Default Alert"}),e.jsx(r,{children:"This is a default alert with neutral styling. Use it for general information that doesn't fit other categories."})]})}},a={args:{variant:"info",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{children:"Information"}),e.jsx(r,{children:"This is an informational alert. Use it to provide helpful information or tips to users."})]})}},o={args:{variant:"warning",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{children:"Warning"}),e.jsx(r,{children:"This is a warning alert. Use it to warn users about potential issues or important considerations."})]})}},l={args:{variant:"error",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{children:"Error"}),e.jsx(r,{children:"This is an error alert. Use it to inform users about errors, failures, or critical issues."})]})}},c={args:{variant:"success",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{children:"Success!"}),e.jsx(r,{children:"Your operation completed successfully. All changes have been saved."})]})}},d={render:()=>{const[A,x]=n.useState(!0),[g,w]=n.useState(!0),[f,y]=n.useState(!0),[v,j]=n.useState(!0);return e.jsxs("div",{className:"space-y-4",children:[A&&e.jsxs(t,{variant:"info",onClose:()=>x(!1),children:[e.jsx(s,{children:"Dismissible Info Alert"}),e.jsx(r,{children:"This alert can be dismissed by clicking the close button."})]}),g&&e.jsxs(t,{variant:"warning",onClose:()=>w(!1),children:[e.jsx(s,{children:"Dismissible Warning Alert"}),e.jsx(r,{children:"Your session will expire in 5 minutes. Please save your work."})]}),f&&e.jsxs(t,{variant:"error",onClose:()=>y(!1),children:[e.jsx(s,{children:"Dismissible Error Alert"}),e.jsx(r,{children:"Failed to save changes. Please check your connection and try again."})]}),v&&e.jsxs(t,{variant:"success",onClose:()=>j(!1),children:[e.jsx(s,{children:"Dismissible Success Alert"}),e.jsx(r,{children:"Your profile has been updated successfully!"})]}),!A&&!g&&!f&&!v&&e.jsx("div",{className:"text-center py-8 text-muted-foreground",children:"All alerts have been dismissed. Refresh the story to see them again."})]})}},u={args:{variant:"info",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{children:"System Maintenance Notice"}),e.jsxs(r,{children:[e.jsx("p",{className:"mb-2",children:"We will be performing scheduled maintenance on our systems this weekend. The maintenance window is scheduled for Saturday, January 20th from 2:00 AM to 6:00 AM EST."}),e.jsx("p",{className:"mb-2",children:"During this time, you may experience intermittent service disruptions. We recommend:"}),e.jsxs("ul",{className:"list-disc pl-4",children:[e.jsx("li",{children:"Saving your work frequently"}),e.jsx("li",{children:"Avoiding critical operations during the maintenance window"}),e.jsx("li",{children:"Planning ahead for any time-sensitive tasks"})]}),e.jsx("p",{className:"mt-2",children:"We apologize for any inconvenience this may cause and appreciate your understanding."})]})]})}},m={args:{variant:"warning",children:e.jsx(r,{children:"This is an alert without a title. Use this pattern for simple, brief messages."})}},p={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs(t,{variant:"error",children:[e.jsx(s,{children:"Payment Failed"}),e.jsx(r,{children:"Your payment could not be processed. Please check your payment details and try again."})]}),e.jsxs(t,{variant:"warning",children:[e.jsx(s,{children:"Limited Stock"}),e.jsx(r,{children:"Only 3 items left in stock. Order soon to avoid disappointment."})]}),e.jsxs(t,{variant:"info",children:[e.jsx(s,{children:"New Features Available"}),e.jsx(r,{children:"Check out our latest features in the settings menu."})]}),e.jsxs(t,{variant:"success",children:[e.jsx(s,{children:"Order Confirmed"}),e.jsx(r,{children:"Your order #12345 has been confirmed and will be delivered within 2-3 business days."})]})]})},h={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs(t,{variant:"success",onClose:()=>console.log("Closed success"),children:[e.jsx(s,{children:"Campaign Created Successfully"}),e.jsx(r,{children:'Your campaign "Summer Sale 2024" has been created and is now in draft status. You can edit the campaign details or submit it for approval.'})]}),e.jsxs(t,{variant:"error",onClose:()=>console.log("Closed error"),children:[e.jsx(s,{children:"Upload Failed"}),e.jsx(r,{children:'The file "banner-image.jpg" exceeds the maximum size of 5MB. Please compress the image or choose a smaller file.'})]}),e.jsxs(t,{variant:"warning",children:[e.jsx(s,{children:"Budget Alert"}),e.jsx(r,{children:"You've used 85% of your monthly budget. Consider adjusting your campaign spending to stay within limits."})]}),e.jsxs(t,{variant:"info",children:[e.jsx(s,{children:"Pro Tip"}),e.jsxs(r,{children:["Did you know you can use keyboard shortcuts? Press ",e.jsx("kbd",{children:"Cmd+K"})," to open the command palette."]})]})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default alert with neutral styling. Use it for general information that doesn't fit other categories.
        </AlertDescription>
      </>
  }
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: <>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This is an informational alert. Use it to provide helpful information or tips to users.
        </AlertDescription>
      </>
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: <>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          This is a warning alert. Use it to warn users about potential issues or important considerations.
        </AlertDescription>
      </>
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'error',
    children: <>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          This is an error alert. Use it to inform users about errors, failures, or critical issues.
        </AlertDescription>
      </>
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: <>
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Your operation completed successfully. All changes have been saved.
        </AlertDescription>
      </>
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [showInfo, setShowInfo] = React.useState(true);
    const [showWarning, setShowWarning] = React.useState(true);
    const [showError, setShowError] = React.useState(true);
    const [showSuccess, setShowSuccess] = React.useState(true);
    return <div className="space-y-4">
        {showInfo && <Alert variant="info" onClose={() => setShowInfo(false)}>
            <AlertTitle>Dismissible Info Alert</AlertTitle>
            <AlertDescription>
              This alert can be dismissed by clicking the close button.
            </AlertDescription>
          </Alert>}
        
        {showWarning && <Alert variant="warning" onClose={() => setShowWarning(false)}>
            <AlertTitle>Dismissible Warning Alert</AlertTitle>
            <AlertDescription>
              Your session will expire in 5 minutes. Please save your work.
            </AlertDescription>
          </Alert>}
        
        {showError && <Alert variant="error" onClose={() => setShowError(false)}>
            <AlertTitle>Dismissible Error Alert</AlertTitle>
            <AlertDescription>
              Failed to save changes. Please check your connection and try again.
            </AlertDescription>
          </Alert>}
        
        {showSuccess && <Alert variant="success" onClose={() => setShowSuccess(false)}>
            <AlertTitle>Dismissible Success Alert</AlertTitle>
            <AlertDescription>
              Your profile has been updated successfully!
            </AlertDescription>
          </Alert>}

        {!showInfo && !showWarning && !showError && !showSuccess && <div className="text-center py-8 text-muted-foreground">
            All alerts have been dismissed. Refresh the story to see them again.
          </div>}
      </div>;
  }
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: <>
        <AlertTitle>System Maintenance Notice</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            We will be performing scheduled maintenance on our systems this weekend. 
            The maintenance window is scheduled for Saturday, January 20th from 2:00 AM to 6:00 AM EST.
          </p>
          <p className="mb-2">
            During this time, you may experience intermittent service disruptions. We recommend:
          </p>
          <ul className="list-disc pl-4">
            <li>Saving your work frequently</li>
            <li>Avoiding critical operations during the maintenance window</li>
            <li>Planning ahead for any time-sensitive tasks</li>
          </ul>
          <p className="mt-2">
            We apologize for any inconvenience this may cause and appreciate your understanding.
          </p>
        </AlertDescription>
      </>
  }
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: <AlertDescription>
        This is an alert without a title. Use this pattern for simple, brief messages.
      </AlertDescription>
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <Alert variant="error">
        <AlertTitle>Payment Failed</AlertTitle>
        <AlertDescription>
          Your payment could not be processed. Please check your payment details and try again.
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertTitle>Limited Stock</AlertTitle>
        <AlertDescription>
          Only 3 items left in stock. Order soon to avoid disappointment.
        </AlertDescription>
      </Alert>
      
      <Alert variant="info">
        <AlertTitle>New Features Available</AlertTitle>
        <AlertDescription>
          Check out our latest features in the settings menu.
        </AlertDescription>
      </Alert>
      
      <Alert variant="success">
        <AlertTitle>Order Confirmed</AlertTitle>
        <AlertDescription>
          Your order #12345 has been confirmed and will be delivered within 2-3 business days.
        </AlertDescription>
      </Alert>
    </div>
}`,...p.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <Alert variant="success" onClose={() => console.log('Closed success')}>
        <AlertTitle>Campaign Created Successfully</AlertTitle>
        <AlertDescription>
          Your campaign "Summer Sale 2024" has been created and is now in draft status. 
          You can edit the campaign details or submit it for approval.
        </AlertDescription>
      </Alert>
      
      <Alert variant="error" onClose={() => console.log('Closed error')}>
        <AlertTitle>Upload Failed</AlertTitle>
        <AlertDescription>
          The file "banner-image.jpg" exceeds the maximum size of 5MB. 
          Please compress the image or choose a smaller file.
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertTitle>Budget Alert</AlertTitle>
        <AlertDescription>
          You've used 85% of your monthly budget. Consider adjusting your campaign spending to stay within limits.
        </AlertDescription>
      </Alert>
      
      <Alert variant="info">
        <AlertTitle>Pro Tip</AlertTitle>
        <AlertDescription>
          Did you know you can use keyboard shortcuts? Press <kbd>Cmd+K</kbd> to open the command palette.
        </AlertDescription>
      </Alert>
    </div>
}`,...h.parameters?.docs?.source}}};const P=["Default","Info","Warning","Error","Success","Dismissible","LongContent","WithoutTitle","MultipleAlerts","RealWorldExamples"];export{i as Default,d as Dismissible,l as Error,a as Info,u as LongContent,p as MultipleAlerts,h as RealWorldExamples,c as Success,o as Warning,m as WithoutTitle,P as __namedExportsOrder,Y as default};
