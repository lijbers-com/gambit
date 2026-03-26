import{M as m}from"./map-chart--lNJa4JW.js";import"./iframe-DvKL0w_9.js";import"./preload-helper-PPVm8Dsz.js";const c={title:"Charts/MapChart",component:m,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{data:{description:"Array of store location data with plays, name, and coordinates"},className:{description:"Additional CSS classes"},title:{description:"Chart title"}}},o=[{name:"Amsterdam Central",plays:5847,x:48,y:35},{name:"Amsterdam Zuid",plays:4239,x:46,y:40},{name:"Amsterdam Noord",plays:3156,x:50,y:32},{name:"Rotterdam Central",plays:6241,x:40,y:55},{name:"Rotterdam Zuid",plays:2847,x:42,y:58},{name:"Den Haag HS",plays:4156,x:35,y:50},{name:"Den Haag Central",plays:3542,x:33,y:52},{name:"Utrecht CS",plays:5123,x:52,y:48},{name:"Utrecht Noord",plays:2156,x:54,y:45},{name:"Eindhoven CS",plays:3789,x:58,y:70},{name:"Eindhoven Airport",plays:1923,x:62,y:72},{name:"Groningen CS",plays:2456,x:65,y:15},{name:"Groningen Noord",plays:1567,x:67,y:12},{name:"Breda CS",plays:2789,x:45,y:68},{name:"Tilburg CS",plays:3234,x:52,y:65},{name:"Arnhem CS",plays:2945,x:68,y:52},{name:"Nijmegen CS",plays:2156,x:70,y:58},{name:"Zwolle CS",plays:1834,x:62,y:35},{name:"Haarlem CS",plays:2567,x:42,y:38},{name:"Almere CS",plays:3456,x:58,y:42}],e={args:{data:o}},r={args:{data:o,title:"Digital In-store Performance Map"}},n={args:{data:[{name:"Amsterdam Central",plays:5847,x:48,y:35},{name:"Rotterdam Central",plays:6241,x:40,y:55},{name:"Utrecht CS",plays:5123,x:52,y:48},{name:"Eindhoven CS",plays:3789,x:58,y:70},{name:"Groningen CS",plays:2456,x:65,y:15}]}},s={args:{data:o.map(a=>({...a,plays:a.plays+2e3}))}},t={args:{data:o.map(a=>({...a,plays:Math.max(500,a.plays-3e3)}))}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    data: mockStoreData
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    data: mockStoreData,
    title: "Digital In-store Performance Map"
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      name: 'Amsterdam Central',
      plays: 5847,
      x: 48,
      y: 35
    }, {
      name: 'Rotterdam Central',
      plays: 6241,
      x: 40,
      y: 55
    }, {
      name: 'Utrecht CS',
      plays: 5123,
      x: 52,
      y: 48
    }, {
      name: 'Eindhoven CS',
      plays: 3789,
      x: 58,
      y: 70
    }, {
      name: 'Groningen CS',
      plays: 2456,
      x: 65,
      y: 15
    }]
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    data: mockStoreData.map(store => ({
      ...store,
      plays: store.plays + 2000 // Boost all values to show high performance
    }))
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    data: mockStoreData.map(store => ({
      ...store,
      plays: Math.max(500, store.plays - 3000) // Reduce values to show low performance
    }))
  }
}`,...t.parameters?.docs?.source}}};const d=["Default","WithCustomTitle","LimitedData","HighPerformance","LowPerformance"];export{e as Default,s as HighPerformance,n as LimitedData,t as LowPerformance,r as WithCustomTitle,d as __namedExportsOrder,c as default};
