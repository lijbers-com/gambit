import{r,j as a}from"./iframe-B2sv3z--.js";import{P as n}from"./page-header-CB4H9ypj.js";import{D as l}from"./date-picker-D5xY-lpC.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./button-CuPAXXHd.js";import"./index-ojs0XM5b.js";import"./index-CdJFUDDL.js";import"./dropdown-menu-CS3p5svP.js";import"./index-DehB9XTy.js";import"./index-CFhbmjQN.js";import"./index-DGA11cGX.js";import"./index-dFd8z_VS.js";import"./index-G_2NqKkU.js";import"./index-BHEqwGAn.js";import"./index-BOcI3EBp.js";import"./Combination-CVHJjhEU.js";import"./index-BBKt_i3X.js";import"./index-CYk8cACR.js";import"./index-Duqzc3UP.js";import"./checkbox-DgACiBX7.js";import"./index-CG_rr0_2.js";import"./check-D5-eMeep.js";import"./createLucideIcon-Bwht0sgB.js";import"./circle-CA_9n80i.js";import"./chevron-right-BMhUZwQf.js";import"./building-2-DJtB2wEP.js";import"./chevron-down-BepfQlRx.js";import"./settings-2-Dg95SXfj.js";import"./ellipsis-DwDXQygk.js";import"./square-pen-Xef5xhA3.js";import"./settings-DTWUPnnQ.js";import"./chevron-left-CE-9wMsK.js";import"./popover-BZWdwQcX.js";const X={title:"UI/PageHeader",component:n,parameters:{layout:"padded"},tags:["autodocs"]},o={args:{title:"PageHeader Title"}},i={args:{title:"PageHeader Title",subtitle:"PageHeader Subtitle"}},s={render:()=>{const[e,t]=r.useState({from:new Date,to:new Date(Date.now()+6048e5)});return a.jsx(n,{title:"PageHeader Title",subtitle:"PageHeader Subtitle",headerRight:a.jsx(l,{dateRange:e,onDateRangeChange:t,placeholder:"Select date range",showPresets:!0})})},args:{title:""}},d={render:()=>{const[e,t]=r.useState({from:new Date,to:new Date(Date.now()+6048e5)}),[p,m]=r.useState(14),[u,D]=r.useState("coca-cola");return a.jsx(n,{title:"Campaign Detail Header",subtitle:"Variant with Advertiser, Attribution Window, and Date Range dropdowns",variant:"campaign-detail",advertiserProps:{value:u,onChange:D},attributionWindowProps:{value:p,onChange:m},dateRangeProps:{dateRange:e,onDateRangeChange:t,placeholder:"Select date range",showPresets:!0},onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked")})},args:{title:""}},g={render:()=>{const[e,t]=r.useState({from:new Date,to:new Date(Date.now()+6048e5)});return a.jsx(n,{title:"PageHeader with Actions",subtitle:"Built-in dropdown menu with Edit, Export, Import, and Settings",headerRight:a.jsx(l,{dateRange:e,onDateRangeChange:t,placeholder:"Select date range",showPresets:!0}),onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked")})},args:{title:""}},c={render:()=>{const[e,t]=r.useState({from:new Date,to:new Date(Date.now()+6048e5)});return a.jsx(n,{title:"PageHeader without Options",subtitle:"Options menu can be disabled",headerRight:a.jsx(l,{dateRange:e,onDateRangeChange:t,placeholder:"Select date range",showPresets:!0}),showOptionsMenu:!1})},args:{title:""}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'PageHeader Title'
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'PageHeader Title',
    subtitle: 'PageHeader Subtitle'
  }
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    return <PageHeader title="PageHeader Title" subtitle="PageHeader Subtitle" headerRight={<DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Select date range" showPresets={true} />} />;
  },
  args: {
    title: ''
  }
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    const [advertiser, setAdvertiser] = useState<string>('coca-cola');
    return <PageHeader title="Campaign Detail Header" subtitle="Variant with Advertiser, Attribution Window, and Date Range dropdowns" variant="campaign-detail" advertiserProps={{
      value: advertiser,
      onChange: setAdvertiser
    }} attributionWindowProps={{
      value: conversionWindow,
      onChange: setConversionWindow
    }} dateRangeProps={{
      dateRange: dateRange,
      onDateRangeChange: setDateRange,
      placeholder: "Select date range",
      showPresets: true
    }} onEdit={() => alert('Edit clicked')} onExport={() => alert('Export clicked')} onImport={() => alert('Import clicked')} onSettings={() => alert('Settings clicked')} />;
  },
  args: {
    title: ''
  }
}`,...d.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    return <PageHeader title="PageHeader with Actions" subtitle="Built-in dropdown menu with Edit, Export, Import, and Settings" headerRight={<DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Select date range" showPresets={true} />} onEdit={() => alert('Edit clicked')} onExport={() => alert('Export clicked')} onImport={() => alert('Import clicked')} onSettings={() => alert('Settings clicked')} />;
  },
  args: {
    title: ''
  }
}`,...g.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    return <PageHeader title="PageHeader without Options" subtitle="Options menu can be disabled" headerRight={<DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Select date range" showPresets={true} />} showOptionsMenu={false} />;
  },
  args: {
    title: ''
  }
}`,...c.parameters?.docs?.source}}};const Y=["Default","WithSubtitle","WithHeaderRight","CampaignDetailVariant","WithDropdownActions","WithoutOptionsMenu"];export{d as CampaignDetailVariant,o as Default,g as WithDropdownActions,s as WithHeaderRight,i as WithSubtitle,c as WithoutOptionsMenu,Y as __namedExportsOrder,X as default};
