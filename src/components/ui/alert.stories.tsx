import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import React from 'react';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
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
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'warning', 'error', 'success'],
      description: 'The visual style variant of the alert',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    onClose: {
      description: 'Callback function when the close button is clicked',
      action: 'closed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default alert
export const Default: Story = {
  args: {
    children: (
      <>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default alert with neutral styling. Use it for general information that doesn't fit other categories.
        </AlertDescription>
      </>
    ),
  },
};

// Info alert
export const Info: Story = {
  args: {
    variant: 'info',
    children: (
      <>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This is an informational alert. Use it to provide helpful information or tips to users.
        </AlertDescription>
      </>
    ),
  },
};

// Warning alert
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: (
      <>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          This is a warning alert. Use it to warn users about potential issues or important considerations.
        </AlertDescription>
      </>
    ),
  },
};

// Error alert
export const Error: Story = {
  args: {
    variant: 'error',
    children: (
      <>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          This is an error alert. Use it to inform users about errors, failures, or critical issues.
        </AlertDescription>
      </>
    ),
  },
};

// Success alert
export const Success: Story = {
  args: {
    variant: 'success',
    children: (
      <>
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Your operation completed successfully. All changes have been saved.
        </AlertDescription>
      </>
    ),
  },
};

// Dismissible alerts
export const Dismissible: Story = {
  render: () => {
    const [showInfo, setShowInfo] = React.useState(true);
    const [showWarning, setShowWarning] = React.useState(true);
    const [showError, setShowError] = React.useState(true);
    const [showSuccess, setShowSuccess] = React.useState(true);

    return (
      <div className="space-y-4">
        {showInfo && (
          <Alert variant="info" onClose={() => setShowInfo(false)}>
            <AlertTitle>Dismissible Info Alert</AlertTitle>
            <AlertDescription>
              This alert can be dismissed by clicking the close button.
            </AlertDescription>
          </Alert>
        )}
        
        {showWarning && (
          <Alert variant="warning" onClose={() => setShowWarning(false)}>
            <AlertTitle>Dismissible Warning Alert</AlertTitle>
            <AlertDescription>
              Your session will expire in 5 minutes. Please save your work.
            </AlertDescription>
          </Alert>
        )}
        
        {showError && (
          <Alert variant="error" onClose={() => setShowError(false)}>
            <AlertTitle>Dismissible Error Alert</AlertTitle>
            <AlertDescription>
              Failed to save changes. Please check your connection and try again.
            </AlertDescription>
          </Alert>
        )}
        
        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)}>
            <AlertTitle>Dismissible Success Alert</AlertTitle>
            <AlertDescription>
              Your profile has been updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {!showInfo && !showWarning && !showError && !showSuccess && (
          <div className="text-center py-8 text-muted-foreground">
            All alerts have been dismissed. Refresh the story to see them again.
          </div>
        )}
      </div>
    );
  },
};

// Long content
export const LongContent: Story = {
  args: {
    variant: 'info',
    children: (
      <>
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
    ),
  },
};

// Without title
export const WithoutTitle: Story = {
  args: {
    variant: 'warning',
    children: (
      <AlertDescription>
        This is an alert without a title. Use this pattern for simple, brief messages.
      </AlertDescription>
    ),
  },
};

// Multiple alerts
export const MultipleAlerts: Story = {
  render: () => (
    <div className="space-y-4">
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
  ),
};

// Real-world examples
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-4">
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
  ),
};