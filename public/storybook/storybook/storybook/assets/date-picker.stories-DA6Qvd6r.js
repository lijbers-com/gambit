import{r as n,j as e}from"./iframe-DIN2IKqe.js";import{b as s,D as o}from"./date-picker-BvfUIYG1.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./button-B9Y0ZSwa.js";import"./index-BrN91Rgp.js";import"./index-CdJFUDDL.js";import"./chevron-left-BDXySpha.js";import"./createLucideIcon-Buzyb9Q7.js";import"./chevron-right-CUD2C_lr.js";import"./chevron-down-Rsxw0oJ3.js";import"./popover-2KUBjTNn.js";import"./index-DywWKZUd.js";import"./index-DjuRppva.js";import"./index-C8pd1VWv.js";import"./index-D93m9KRt.js";import"./Combination-B4vWFPwN.js";import"./index-Br6PxJxS.js";import"./index-X7hHvCXq.js";import"./index-BEqAkVqP.js";import"./index-DNa-te7d.js";import"./index-vD8Qkz52.js";import"./dropdown-menu-dbnqWaiD.js";import"./index-Du2gMQwv.js";import"./checkbox-C34OBCE9.js";import"./index-BCdNlN2L.js";import"./check-DcQhNYtI.js";import"./circle-DmMWJKS7.js";const Y={title:"UI/DatePicker",component:s,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{placeholder:{control:{type:"text"}},disabled:{control:{type:"boolean"}}}},c={render:()=>{const[a,t]=n.useState();return e.jsx(s,{date:a,onDateChange:t,placeholder:"Pick a date"})}},i={render:()=>{const[a,t]=n.useState(new Date);return e.jsx(s,{date:a,onDateChange:r=>t(r||new Date),placeholder:"Pick a date"})}},l={render:()=>{const[a,t]=n.useState();return e.jsx(s,{date:a,onDateChange:t,placeholder:"Select your birthday"})}},g={render:()=>{const[a,t]=n.useState();return e.jsx(s,{date:a,onDateChange:t,placeholder:"Pick a date",disabled:!0})}},u={render:()=>{const[a,t]=n.useState();return e.jsx(s,{date:a,onDateChange:t,placeholder:"Pick a date",className:"w-[300px]"})}},m={render:()=>{const[a,t]=n.useState();return e.jsxs("div",{className:"space-y-4",children:[e.jsx(s,{date:a,onDateChange:t,placeholder:"Pick a date"}),e.jsxs("div",{className:"text-sm text-muted-foreground",children:["Selected date: ",a?a.toLocaleDateString():"None"]})]})}},p={render:()=>{const[a,t]=n.useState(),[r,d]=n.useState();return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx(s,{date:a,onDateChange:t,placeholder:"Start date"}),e.jsx(s,{date:r,onDateChange:d,placeholder:"End date"})]}),e.jsxs("div",{className:"text-sm text-muted-foreground",children:["Date range: ",a?.toLocaleDateString()," - ",r?.toLocaleDateString()]})]})}},D={render:()=>{const[a,t]=n.useState();return e.jsx(o,{dateRange:a,onDateRangeChange:t,placeholder:"Pick a date range"})}},h={render:()=>{const[a,t]=n.useState();return e.jsxs("div",{className:"space-y-4",children:[e.jsx(o,{dateRange:a,onDateRangeChange:t,placeholder:"Pick a date range",showPresets:!0}),e.jsxs("div",{className:"text-sm text-muted-foreground",children:["Selected range: ",a?.from?.toLocaleDateString()," - ",a?.to?.toLocaleDateString()]})]})}},R={render:()=>{const[a,t]=n.useState({from:new Date,to:new Date(Date.now()+6048e5)});return e.jsx(o,{dateRange:a,onDateRangeChange:t,placeholder:"Pick a date range",showPresets:!0})}},w={render:()=>{const[a,t]=n.useState();return e.jsx(o,{dateRange:a,onDateRangeChange:t,placeholder:"Pick a date range",showPresets:!0,className:"w-[400px]"})}},S={render:()=>{const[a,t]=n.useState();return e.jsx(o,{dateRange:a,onDateRangeChange:t,placeholder:"Pick a date range",disabled:!0,showPresets:!0})}},P={render:()=>{const[a,t]=n.useState(),[r,d]=n.useState(14);return e.jsxs("div",{className:"space-y-4",children:[e.jsx(o,{dateRange:a,onDateRangeChange:t,placeholder:"Pick a date range with conversion window",showPresets:!0,showConversionWindow:!0,conversionWindow:r,onConversionWindowChange:d}),e.jsxs("div",{className:"text-sm text-muted-foreground space-y-1",children:[e.jsxs("div",{children:["Selected range: ",a?.from?.toLocaleDateString()," - ",a?.to?.toLocaleDateString()]}),e.jsxs("div",{children:["Conversion window: ",r," days"]})]})]})},parameters:{docs:{description:{story:`
# Date Range Picker with Conversion Window

This variant combines presets with conversion window options. The conversion window appears below the calendar months and allows users to select 7, 14, 21, or 28 days for attribution window settings.

## Features

- **Preset Selection**: Quick date range selections
- **Two Month Calendar**: Side-by-side month view
- **Conversion Window**: 4 button options (7, 14, 21, 28 days)
- **Visual Feedback**: Selected conversion window is highlighted
- **Responsive Layout**: Conversion window buttons adapt to container width

## Use Cases

- Campaign attribution settings
- Analytics reporting windows
- Performance measurement periods
- ROI calculation timeframes
        `}}}},v={render:()=>{const[a,t]=n.useState(),[r,d]=n.useState();return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Single Date Picker"}),e.jsx(s,{date:a,onDateChange:t,placeholder:"Select a single date"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Range Date Picker"}),e.jsx(o,{dateRange:r,onDateRangeChange:C=>d(C),placeholder:"Select a date range"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Range Date Picker with Presets"}),e.jsx(o,{dateRange:r,onDateRangeChange:C=>d(C),placeholder:"Select a date range",showPresets:!0})]})]})}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [date, setDate] = useState<Date>();
    return <DatePicker date={date} onDateChange={setDate} placeholder="Pick a date" />;
  }
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [date, setDate] = useState<Date>(new Date());
    return <DatePicker date={date} onDateChange={newDate => setDate(newDate || new Date())} placeholder="Pick a date" />;
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [date, setDate] = useState<Date>();
    return <DatePicker date={date} onDateChange={setDate} placeholder="Select your birthday" />;
  }
}`,...l.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [date, setDate] = useState<Date>();
    return <DatePicker date={date} onDateChange={setDate} placeholder="Pick a date" disabled={true} />;
  }
}`,...g.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [date, setDate] = useState<Date>();
    return <DatePicker date={date} onDateChange={setDate} placeholder="Pick a date" className="w-[300px]" />;
  }
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [date, setDate] = useState<Date>();
    return <div className="space-y-4">
        <DatePicker date={date} onDateChange={setDate} placeholder="Pick a date" />
        <div className="text-sm text-muted-foreground">
          Selected date: {date ? date.toLocaleDateString() : 'None'}
        </div>
      </div>;
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    return <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DatePicker date={startDate} onDateChange={setStartDate} placeholder="Start date" />
          <DatePicker date={endDate} onDateChange={setEndDate} placeholder="End date" />
        </div>
        <div className="text-sm text-muted-foreground">
          Date range: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
        </div>
      </div>;
  }
}`,...p.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Pick a date range" />;
  }
}`,...D.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return <div className="space-y-4">
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Pick a date range" showPresets={true} />
        <div className="text-sm text-muted-foreground">
          Selected range: {dateRange?.from?.toLocaleDateString()} - {dateRange?.to?.toLocaleDateString()}
        </div>
      </div>;
  }
}`,...h.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
    return <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Pick a date range" showPresets={true} />;
  }
}`,...R.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Pick a date range" showPresets={true} className="w-[400px]" />;
  }
}`,...w.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Pick a date range" disabled={true} showPresets={true} />;
  }
}`,...S.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    return <div className="space-y-4">
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Pick a date range with conversion window" showPresets={true} showConversionWindow={true} conversionWindow={conversionWindow} onConversionWindowChange={setConversionWindow} />
        <div className="text-sm text-muted-foreground space-y-1">
          <div>Selected range: {dateRange?.from?.toLocaleDateString()} - {dateRange?.to?.toLocaleDateString()}</div>
          <div>Conversion window: {conversionWindow} days</div>
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
# Date Range Picker with Conversion Window

This variant combines presets with conversion window options. The conversion window appears below the calendar months and allows users to select 7, 14, 21, or 28 days for attribution window settings.

## Features

- **Preset Selection**: Quick date range selections
- **Two Month Calendar**: Side-by-side month view
- **Conversion Window**: 4 button options (7, 14, 21, 28 days)
- **Visual Feedback**: Selected conversion window is highlighted
- **Responsive Layout**: Conversion window buttons adapt to container width

## Use Cases

- Campaign attribution settings
- Analytics reporting windows
- Performance measurement periods
- ROI calculation timeframes
        \`
      }
    }
  }
}`,...P.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [singleDate, setSingleDate] = useState<Date>();
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Single Date Picker</h3>
          <DatePicker date={singleDate} onDateChange={setSingleDate} placeholder="Select a single date" />
        </div>

                 <div className="space-y-2">
           <h3 className="text-lg font-semibold">Range Date Picker</h3>
           <DateRangePicker dateRange={dateRange} onDateRangeChange={range => setDateRange(range)} placeholder="Select a date range" />
         </div>

         <div className="space-y-2">
           <h3 className="text-lg font-semibold">Range Date Picker with Presets</h3>
           <DateRangePicker dateRange={dateRange} onDateRangeChange={range => setDateRange(range)} placeholder="Select a date range" showPresets={true} />
        </div>
      </div>;
  }
}`,...v.parameters?.docs?.source}}};const Z=["Default","WithSelectedDate","CustomPlaceholder","Disabled","WithCustomStyling","Controlled","MultipleDatePickers","RangePickerDefault","RangePickerWithPresets","RangePickerWithSelectedRange","RangePickerCustomWidth","RangePickerDisabled","RangePickerWithConversionWindow","ComparisonShowcase"];export{v as ComparisonShowcase,m as Controlled,l as CustomPlaceholder,c as Default,g as Disabled,p as MultipleDatePickers,w as RangePickerCustomWidth,D as RangePickerDefault,S as RangePickerDisabled,P as RangePickerWithConversionWindow,h as RangePickerWithPresets,R as RangePickerWithSelectedRange,u as WithCustomStyling,i as WithSelectedDate,Z as __namedExportsOrder,Y as default};
