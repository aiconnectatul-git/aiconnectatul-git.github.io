// Add new tools here. Paths are relative to the website root.
window.TOOL_CATALOG = [
  { id:"calculators", name:"Calculators", description:"Quick answers for everyday numbers", icon:"⌗", color:"mint", subcategories:[
    { name:"Money", tools:[
      { name:"GST Calculator", description:"Calculate GST inclusive or exclusive amounts", path:"apps/calculators/gst/index.html", tags:["tax","gst","money"] }
    ]}
  ]},
  { id:"developer", name:"Developer Tools", description:"Small helpers for building things", icon:"⌘", subcategories:[
    { name:"Text & Data", tools:[
      { name:"Dev Tools", description:"Base64, Text Case, URL, UTC time, JWT, JSON, Hash, UUID & Regex in one place", path:"apps/developer/dev-tools/index.html", tags:["base64","text","case","url","encode","decode","utc","timestamp","epoch","jwt","json","hash","sha","uuid","regex","developer"] },
      { name:"CipherPop", description:"Encrypt and decrypt text privately in your browser", path:"apps/developer/cipherpop/index.html", tags:["encryption","cipher","privacy","security"] }
    ]}
  ]}
];
