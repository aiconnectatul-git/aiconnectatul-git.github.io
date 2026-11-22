// Add new tools here. Paths are relative to the website root.
window.TOOL_CATALOG = [
  { id:"calculators", name:"Calculators", description:"Quick answers for everyday numbers", icon:"⌗", color:"mint", subcategories:[
    { name:"Money", tools:[
      { name:"GST Calculator", description:"Calculate GST inclusive or exclusive amounts", path:"apps/calculators/gst/index.html", tags:["tax","gst","money"] }
    ]}
  ]},
  { id:"developer", name:"Developer Tools", description:"Small helpers for building things", icon:"⌘", subcategories:[
    { name:"Text & Data", tools:[
      { name:"Text Case Converter", description:"Switch text between common letter cases", path:"apps/developer/text-case/index.html", tags:["text","uppercase","lowercase"] },
      { name:"CipherPop", description:"Encrypt and decrypt text privately in your browser", path:"apps/developer/cipherpop/index.html", tags:["encryption","cipher","privacy","security"] }
    ]}
  ]},
  { id:"daily", name:"Daily Utilities", description:"Handy tools for everyday tasks", icon:"◷", subcategories:[
    { name:"Shopping", tools:[
      { name:"Indian Grocery Shopping List Wizard", description:"Build and save a categorized Indian grocery shopping list", path:"apps/daily/grocery-list/index.html", tags:["shopping","grocery","ration","list"] }
    ]}
  ]}
];
