import{r,j as a}from"./iframe-C5bSqRdg.js";import{P as n}from"./page-header-BE690Ecl.js";import{D as l}from"./date-picker-BSwb8brm.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./button-CMihJ9pV.js";import"./index-DJEyZNpx.js";import"./index-CdJFUDDL.js";import"./dropdown-menu-BPEWRI36.js";import"./index-DD08fZIQ.js";import"./index-DAh0e16s.js";import"./index-Z2B8irzh.js";import"./index-gOg22guj.js";import"./index-D5TxnOXk.js";import"./index-BDa5FaKX.js";import"./index-4SfGeEia.js";import"./Combination-BPLtMwXH.js";import"./index-DELDvHLi.js";import"./index-C48yRfEQ.js";import"./index-7AEp8Dl6.js";import"./checkbox-DTG8_xx0.js";import"./index-squPBcRJ.js";import"./check-BliW7QYp.js";import"./createLucideIcon-CkgRO_Hx.js";import"./circle-xaoSWTc6.js";import"./chevron-right-zSdNciVz.js";import"./building-2-R1bhGwAK.js";import"./chevron-down-BH3g__jq.js";import"./settings-2-BO2bzVa0.js";import"./ellipsis-A7mo7Ea1.js";import"./square-pen-CqwDJzpj.js";import"./settings-BhjJRHSG.js";import"./chevron-left-DOa0lkhI.js";import"./popover-CtRsAG4M.js";const X={title:"UI/PageHeader",component:n,parameters:{layout:"padded"},tags:["autodocs"]},o={args:{title:"PageHeader Title"}},i={args:{title:"PageHeader Title",subtitle:"PageHeader Subtitle"}},s={render:()=>{const[e,t]=r.useState({from:new Date,to:new Date(Date.now()+6048e5)});return a.jsx(n,{title:"PageHeader Title",subtitle:"PageHeader Subtitle",headerRight:a.jsx(l,{dateRange:e,onDateRangeChange:t,placeholder:"Select date range",showPresets:!0})})},args:{title:""}},d={render:()=>{const[e,t]=r.useState({from:new Date,to:new Date(Date.now()+6048e5)}),[p,m]=r.useState(14),[u,D]=r.useState("coca-cola");return a.jsx(n,{title:"Campaign Detail Header",subtitle:"Variant with Advertiser, Attribution Window, and Date Range dropdowns",variant:"campaign-detail",advertiserProps:{value:u,onChange:D},attributionWindowProps:{value:p,onChange:m},dateRangeProps:{dateRange:e,onDateRangeChange:t,placeholder:"Select date range",showPresets:!0},onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked")})},args:{title:""}},g={render:()=>{const[e,t]=r.useState({from:new Date,to:new Date(Date.now()+6048e5)});return a.jsx(n,{title:"PageHeader with Actions",subtitle:"Built-in dropdown menu with Edit, Export, Import, and Settings",headerRight:a.jsx(l,{dateRange:e,onDateRangeChange:t,placeholder:"Select date range",showPresets:!0}),onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked")})},args:{title:""}},c={render:()=>{const[e,t]=r.useState({from:new Date,to:new Date(Date.now()+6048e5)});return a.jsx(n,{title:"PageHeader without Options",subtitle:"Options menu can be disabled",headerRight:a.jsx(l,{dateRange:e,onDateRangeChange:t,placeholder:"Select date range",showPresets:!0}),showOptionsMenu:!1})},args:{title:""}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
