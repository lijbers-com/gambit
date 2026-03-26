import{r,j as a}from"./iframe-CXx92WiO.js";import{P as n}from"./page-header-BoqZRGoB.js";import{D as l}from"./date-picker-BmY649pO.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./button-C1eHidSJ.js";import"./index-CMP_gnTw.js";import"./index-CdJFUDDL.js";import"./dropdown-menu-CIgH4XpN.js";import"./index-DXKissID.js";import"./index-Dbh45AW3.js";import"./index-h1nIrFWq.js";import"./index-B5mXDP2d.js";import"./index-CMeRAYnL.js";import"./index-B1g_gBcA.js";import"./index-CiE_1Aax.js";import"./Combination-CdYqdelZ.js";import"./index-CfPW2CYo.js";import"./index-B3wPngdq.js";import"./index-B_MDKxx5.js";import"./checkbox-Czo-grmd.js";import"./index-IM8qODy1.js";import"./check-B7e4BBHi.js";import"./createLucideIcon-CIL_fWej.js";import"./circle-YiYbFBT2.js";import"./chevron-right-rS_I9gWT.js";import"./building-2-CK97Y_2Q.js";import"./chevron-down-Bljws-eu.js";import"./settings-2-C36p8OU1.js";import"./ellipsis-LWRizN1I.js";import"./square-pen-CahVjGvq.js";import"./settings-KiidBBQR.js";import"./chevron-left-BGObrHjx.js";import"./popover-BK8_0rjP.js";const X={title:"UI/PageHeader",component:n,parameters:{layout:"padded"},tags:["autodocs"]},o={args:{title:"PageHeader Title"}},i={args:{title:"PageHeader Title",subtitle:"PageHeader Subtitle"}},s={render:()=>{const[e,t]=r.useState({from:new Date,to:new Date(Date.now()+6048e5)});return a.jsx(n,{title:"PageHeader Title",subtitle:"PageHeader Subtitle",headerRight:a.jsx(l,{dateRange:e,onDateRangeChange:t,placeholder:"Select date range",showPresets:!0})})},args:{title:""}},d={render:()=>{const[e,t]=r.useState({from:new Date,to:new Date(Date.now()+6048e5)}),[p,m]=r.useState(14),[u,D]=r.useState("coca-cola");return a.jsx(n,{title:"Campaign Detail Header",subtitle:"Variant with Advertiser, Attribution Window, and Date Range dropdowns",variant:"campaign-detail",advertiserProps:{value:u,onChange:D},attributionWindowProps:{value:p,onChange:m},dateRangeProps:{dateRange:e,onDateRangeChange:t,placeholder:"Select date range",showPresets:!0},onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked")})},args:{title:""}},g={render:()=>{const[e,t]=r.useState({from:new Date,to:new Date(Date.now()+6048e5)});return a.jsx(n,{title:"PageHeader with Actions",subtitle:"Built-in dropdown menu with Edit, Export, Import, and Settings",headerRight:a.jsx(l,{dateRange:e,onDateRangeChange:t,placeholder:"Select date range",showPresets:!0}),onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked")})},args:{title:""}},c={render:()=>{const[e,t]=r.useState({from:new Date,to:new Date(Date.now()+6048e5)});return a.jsx(n,{title:"PageHeader without Options",subtitle:"Options menu can be disabled",headerRight:a.jsx(l,{dateRange:e,onDateRangeChange:t,placeholder:"Select date range",showPresets:!0}),showOptionsMenu:!1})},args:{title:""}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
