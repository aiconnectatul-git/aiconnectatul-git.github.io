// Add new tools here. Paths are relative to the website root; "#id" deep-links into a tool inside a suite page.
const T=(name,description,path,tags=[])=>({name,description,path,tags});
window.TOOL_CATALOG = [
  { id:"home", name:"Home", description:"Everyday helpers for the household", icon:"⌂", subcategories:[
    { name:"Household", tools:[
      T("Grocery List Wizard","Build a categorised Indian grocery list","apps/daily/grocery-list/index.html",["grocery","shopping","ration","list","kirana"]),
      T("Panchang","Live tithi, nakshatra, Rahu Kaal and 2026 festivals","apps/panchang/index.html",["panchang","tithi","nakshatra","rahu kaal","festival","hindu calendar","muhurat"])]}
  ]},
  { id:"finance", name:"Finance", description:"Loans, investments and everyday money maths", icon:"₹", subcategories:[
    { name:"Loans", tools:[
      T("Loan / EMI Calculator","Monthly EMI, total interest and amortization","apps/finance/index.html#emi",["loan","emi","home loan","car loan","prepayment","interest"]),
      T("EMI Comparison","Compare two loan offers side by side","apps/finance/index.html#compare",["loan","compare","processing fee"])]},
    { name:"Investments", tools:[
      T("Mutual Fund Returns","SIP and lumpsum return calculator","apps/finance/index.html#mf",["sip","lumpsum","mutual fund","mf","returns","investment"]),
      T("SIP Goal Planner","Monthly SIP needed to reach a target","apps/finance/index.html#goal",["sip","goal","target","planner"]),
      T("FD / RD Calculator","Fixed and recurring deposit maturity","apps/finance/index.html#fd",["fd","rd","fixed deposit","recurring","bank"]),
      T("CAGR Calculator","Compound annual growth rate","apps/finance/index.html#cagr",["cagr","growth","return"])]},
    { name:"Tax", tools:[
      T("GST Calculator","Add or remove GST from an amount","apps/finance/index.html#gst",["tax","gst","cgst","sgst","igst","money"])]}
  ]},
  { id:"developer", name:"Developer Tools", description:"Small helpers for building things", icon:"⌘", subcategories:[
    { name:"Encode & Decode", tools:[
      T("Base64 Encode / Decode","Convert text and files to and from Base64","apps/developer/dev-tools/index.html#base64",["base64","encode","decode"]),
      T("URL Encode / Decode","Percent-encode strings and inspect URLs","apps/developer/dev-tools/index.html#url",["url","percent","query","encode"]),
      T("JWT Decoder","Inspect a token's header, payload and expiry","apps/developer/dev-tools/index.html#jwt",["jwt","token","auth","bearer"]),
      T("Hash Generator","SHA-1, SHA-256, SHA-384 and SHA-512","apps/developer/dev-tools/index.html#hash",["hash","sha","checksum","digest"])]},
    { name:"Format & Generate", tools:[
      T("JSON Formatter","Format, minify and filter JSON keys","apps/developer/dev-tools/index.html#json",["json","format","minify","validate","keys"]),
      T("HTML Viewer","Paste HTML and preview it live","apps/developer/dev-tools/index.html#html",["html","viewer","preview","render","markup"]),
      T("Text Case Converter","UPPER, camelCase, snake_case and more","apps/developer/dev-tools/index.html#case",["text","case","uppercase","lowercase","camel","snake"]),
      T("UTC Time & Converter","Live UTC clock and epoch converter","apps/developer/dev-tools/index.html#time",["utc","time","epoch","unix","timestamp"]),
      T("UUID Generator","Random v4 UUIDs in bulk","apps/developer/dev-tools/index.html#uuid",["uuid","guid","random","id"]),
      T("Regex Tester","Test regular expressions live","apps/developer/dev-tools/index.html#regex",["regex","regexp","pattern","match"])]},
    { name:"Privacy", tools:[
      T("CipherPop","Encrypt and decrypt text privately in your browser","apps/developer/cipherpop/index.html",["encryption","cipher","privacy","security"])]}
  ]},
  { id:"datetime", name:"Date & Time", description:"Ages, gaps and countdowns", icon:"◷", subcategories:[
    { name:"Calendar", tools:[
      T("Age Calculator","Exact age and next birthday","apps/datetime/index.html#age",["age","birthday","dob"]),
      T("Days Between Dates","Days, weeks and months between two dates","apps/datetime/index.html#between",["days","difference","between","dates"]),
      T("Add / Subtract Days","Date N days, months or years away","apps/datetime/index.html#add",["add","subtract","date","deadline"]),
      T("Working Days Counter","Business days excluding weekends and holidays","apps/datetime/index.html#work",["working","business","days","holidays"]),
      T("Countdown","Live countdowns to your events","apps/datetime/index.html#countdown",["countdown","timer","event"])]}
  ]},
  { id:"health", name:"Health & Fitness", description:"Quick numbers for a healthier you", icon:"♥", subcategories:[
    { name:"Body & Diet", tools:[
      T("BMI Calculator","Body mass index and healthy weight range","apps/health/index.html#bmi",["bmi","weight","height"]),
      T("Calorie Needs","Daily calories to maintain, lose or gain","apps/health/index.html#calories",["calorie","bmr","tdee","diet","kcal"]),
      T("Water Intake","Daily water target","apps/health/index.html#water",["water","hydration"]),
      T("Ideal Weight","Ideal body weight formulas","apps/health/index.html#ideal",["ideal","weight","devine"])]}
  ]},
  { id:"converters", name:"Converters", description:"Units, including Indian land measures", icon:"⇄", subcategories:[
    { name:"Units", tools:[
      T("Length","mm, cm, m, km, inch, foot, mile","apps/converters/index.html#length",["length","distance","feet","inch","km"]),
      T("Weight","g, kg, quintal, lb, tola","apps/converters/index.html#weight",["weight","mass","kg","pound","tola"]),
      T("Temperature","Celsius, Fahrenheit, Kelvin","apps/converters/index.html#temp",["temperature","celsius","fahrenheit","kelvin"]),
      T("Area","m², sq ft, sq yd, acre, hectare","apps/converters/index.html#area",["area","sq ft","acre","hectare"]),
      T("Land (India)","Gaj, marla, kanal, guntha, cent","apps/converters/index.html#land",["land","gaj","marla","kanal","guntha","cent","plot"]),
      T("Speed","km/h, mph, m/s, knots","apps/converters/index.html#speed",["speed","kmh","mph"])]}
  ]},
  { id:"writing", name:"Writing & Text", description:"Count, clean and generate text", icon:"Aa", subcategories:[
    { name:"Text", tools:[
      T("Word & Character Counter","Words, characters, reading time, keywords","apps/writing/index.html#count",["word","count","character","reading time"]),
      T("Lorem Ipsum Generator","Placeholder text","apps/writing/index.html#lorem",["lorem","ipsum","dummy","placeholder"]),
      T("Remove Duplicate Lines","Keep unique lines only","apps/writing/index.html#dedupe",["duplicate","unique","lines","dedupe"]),
      T("Sort & Clean Lines","Sort, reverse, shuffle and number lines","apps/writing/index.html#sort",["sort","lines","alphabetical","shuffle"])]}
  ]}
];
