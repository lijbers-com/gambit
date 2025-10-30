import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const ColorSwatch = ({ label, color, token }: { label: string; color: string; token?: string }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px',
    padding: '8px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px'
  }}>
    <div style={{ 
      width: '32px', 
      height: '32px', 
      backgroundColor: color,
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      flexShrink: 0
    }} />
    <div>
      <div style={{ fontWeight: '600', fontSize: '14px' }}>{label}</div>
      <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>{color}</div>
      {token && <div style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' }}>{token}</div>}
    </div>
  </div>
);

const GeneralStylesPage = () => (
  <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
    <h1>Design System & Color Tokens</h1>
    
    <h2>Design Token Structure</h2>
    <p>Our design system uses industry-standard semantic tokens that map to appropriate values for each theme. This ensures consistency while allowing for brand-specific customization.</p>
    
    <h3>Typography</h3>
    <ul>
      <li><strong>Font Family:</strong> System font stack for optimal performance</li>
      <li><strong>Font Sizes:</strong> Responsive scale using Tailwind utilities</li>
      <li><strong>Font Weights:</strong> Normal (400), Medium (500), Bold (600)</li>
      <li><strong>Headings:</strong> Semantic HTML with consistent styling</li>
    </ul>
    
    <h3>Spacing & Layout</h3>
    <ul>
      <li><strong>Base Unit:</strong> 4px (Tailwind scale)</li>
      <li><strong>Border Radius:</strong> 0.5rem (8px) by default</li>
      <li><strong>Shadows:</strong> Subtle elevation for cards and dropdowns</li>
    </ul>
    
    <hr style={{ margin: '2rem 0' }} />
    
    <h2>Color Tokens</h2>
    
    <h3>Base Theme Tokens</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      <ColorSwatch label="Background" color="#ffffff" token="--background" />
      <ColorSwatch label="Foreground" color="#0f172a" token="--foreground" />
      <ColorSwatch label="Primary" color="#1e293b" token="--primary" />
      <ColorSwatch label="Secondary" color="#f1f5f9" token="--secondary" />
      <ColorSwatch label="Muted" color="#f1f5f9" token="--muted" />
      <ColorSwatch label="Border" color="#e2e8f0" token="--border" />
      <ColorSwatch label="Card" color="#ffffff" token="--card" />
      <ColorSwatch label="Destructive" color="#ef4444" token="--destructive" />
    </div>
    
    <h3>Brand-Specific Tokens</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: '600' }}>Default (Gambit)</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ColorSwatch label="Brand Primary" color="#1e293b" token="--brand-primary" />
          <ColorSwatch label="Brand App BG" color="#ffffff" token="--brand-app-bg" />
          <ColorSwatch label="Brand App Text" color="#0f172a" token="--brand-app-text" />
          <ColorSwatch label="Brand App Hover" color="#f1f5f9" token="--brand-app-hover" />
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: '600' }}>Albert Heijn</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ColorSwatch label="Brand Primary" color="#00ADE6" token="--brand-primary" />
          <ColorSwatch label="Brand App BG" color="#00ADE6" token="--brand-app-bg" />
          <ColorSwatch label="Brand App Text" color="#ffffff" token="--brand-app-text" />
          <ColorSwatch label="Brand App Hover" color="#0086B2" token="--brand-app-hover" />
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: '600' }}>ADUSA</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ColorSwatch label="Brand Primary" color="#00644C" token="--brand-primary" />
          <ColorSwatch label="Brand App BG" color="#00644C" token="--brand-app-bg" />
          <ColorSwatch label="Brand App Text" color="#ffffff" token="--brand-app-text" />
          <ColorSwatch label="Brand App Hover" color="#004A36" token="--brand-app-hover" />
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: '600' }}>Delhaize</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ColorSwatch label="Brand Primary" color="#CE1230" token="--brand-primary" />
          <ColorSwatch label="Brand App BG" color="#CE1230" token="--brand-app-bg" />
          <ColorSwatch label="Brand App Text" color="#ffffff" token="--brand-app-text" />
          <ColorSwatch label="Brand App Hover" color="#A30E26" token="--brand-app-hover" />
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: '600' }}>Alfa Beta</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ColorSwatch label="Brand Primary" color="#0066CC" token="--brand-primary" />
          <ColorSwatch label="Brand App BG" color="#ffffff" token="--brand-app-bg" />
          <ColorSwatch label="Brand App Text" color="#0f172a" token="--brand-app-text" />
          <ColorSwatch label="Brand App Hover" color="#f1f5f9" token="--brand-app-hover" />
        </div>
      </div>
    </div>
    
    <h3>Chart Color Tokens</h3>
    <p>Chart colors are designed to provide clear visual distinction in data visualizations while maintaining brand consistency across themes.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: '600' }}>Gambit Theme (Default)</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ColorSwatch label="Chart 1" color="hsl(221, 83%, 53%)" token="--chart-1" />
          <ColorSwatch label="Chart 2" color="hsl(142, 76%, 36%)" token="--chart-2" />
          <ColorSwatch label="Chart 3" color="hsl(32, 95%, 44%)" token="--chart-3" />
          <ColorSwatch label="Chart 4" color="hsl(262, 83%, 58%)" token="--chart-4" />
          <ColorSwatch label="Chart 5" color="hsl(346, 87%, 43%)" token="--chart-5" />
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: '600' }}>Albert Heijn Theme</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ColorSwatch label="Chart 1" color="hsl(192, 100%, 45%)" token="--chart-1" />
          <ColorSwatch label="Chart 2" color="hsl(192, 100%, 35%)" token="--chart-2" />
          <ColorSwatch label="Chart 3" color="hsl(192, 100%, 55%)" token="--chart-3" />
          <ColorSwatch label="Chart 4" color="hsl(39, 100%, 50%)" token="--chart-4" />
          <ColorSwatch label="Chart 5" color="hsl(150, 60%, 45%)" token="--chart-5" />
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: '600' }}>ADUSA Theme</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ColorSwatch label="Chart 1" color="#5AC542" token="--chart-1" />
          <ColorSwatch label="Chart 2" color="#235455" token="--chart-2" />
          <ColorSwatch label="Chart 3" color="#458A4C" token="--chart-3" />
          <ColorSwatch label="Chart 4" color="#C0E187" token="--chart-4" />
          <ColorSwatch label="Chart 5" color="#86B547" token="--chart-5" />
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: '600' }}>Delhaize Theme</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ColorSwatch label="Chart 1" color="hsl(350, 85%, 49%)" token="--chart-1" />
          <ColorSwatch label="Chart 2" color="hsl(350, 85%, 35%)" token="--chart-2" />
          <ColorSwatch label="Chart 3" color="hsl(350, 85%, 65%)" token="--chart-3" />
          <ColorSwatch label="Chart 4" color="hsl(350, 75%, 45%)" token="--chart-4" />
          <ColorSwatch label="Chart 5" color="hsl(350, 70%, 40%)" token="--chart-5" />
        </div>
      </div>
    </div>
    
    <hr style={{ margin: '2rem 0' }} />
    
    <h2>Usage Guidelines</h2>
    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
      <h3 style={{ marginTop: '0', fontSize: '16px' }}>✅ Best Practices</h3>
      <ul style={{ marginBottom: '0' }}>
        <li>Use semantic tokens (--background, --foreground) for UI components</li>
        <li>Use brand tokens (--brand-primary, --brand-app-bg, --brand-app-text, --brand-app-hover) for brand-specific elements</li>
        <li>Use --brand-app-bg for navigation, breadcrumbs, and app-level backgrounds</li>
        <li>Use --brand-app-text for text and icons in navigation elements</li>
        <li>Use --brand-app-hover for hover states in navigation elements</li>
        <li>Use chart tokens (--chart-1 through --chart-5) for data visualization colors</li>
        <li>Reference chart colors using hsl(var(--chart-1)) format in chart configurations</li>
        <li>Prefer CSS custom properties over hardcoded hex values</li>
        <li>Use Tailwind utility classes for consistent spacing and typography</li>
      </ul>
    </div>
    
    <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '0.5rem' }}>
      <h3 style={{ marginTop: '0', fontSize: '16px' }}>❌ Avoid</h3>
      <ul style={{ marginBottom: '0' }}>
        <li>Hardcoding colors like #00ADE6 directly in components</li>
        <li>Creating theme-specific overrides for every color</li>
        <li>Using base tokens for brand-specific elements</li>
        <li>Mixing semantic and brand tokens inconsistently</li>
      </ul>
    </div>
  </div>
);

const meta: Meta = {
  title: 'Documentation/General Styles & Color Palette',
  parameters: {
    docs: {
      page: GeneralStylesPage,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DocumentationPage: Story = {
  render: () => <GeneralStylesPage />,
};