const {tiles,rowsHTML,empty,nf}=U;
const fmt=n=>!isFinite(n)?"—":Math.abs(n)>=1e9||(Math.abs(n)<1e-4&&n!==0)?n.toExponential(4):(+n.toPrecision(10)).toLocaleString("en-IN",{maximumFractionDigits:8});

/* units: [key, label, size of 1 unit in the base unit] */
function converter(id,ico,name,desc,units,from,to,note){
  const opts=units.map(u=>[u[0],u[1]]);
  return {id,ico,name,desc,
   fields:[{id:"v",type:"num",label:"Value",value:1},{id:"f",type:"sel",label:"From",value:from,options:opts},{id:"t",type:"sel",label:"To",value:to,options:opts}],
   out(v){const F=units.find(u=>u[0]===v.f),T=units.find(u=>u[0]===v.t),base=v.v*F[2];
    return tiles([{k:`${nf(v.v,6)} ${F[1].toUpperCase()} =`,v:fmt(base/T[2])+" "+T[1].split(" (")[0],c:"hero"}])
     +U.card("ALL UNITS",rowsHTML(units.filter(u=>u[0]!==v.f).map(u=>[u[1].toUpperCase(),fmt(base/u[2])])))+(note?U.note(note):"")}}}

const TEMP=["c","f","k"],tLab={c:"Celsius (°C)",f:"Fahrenheit (°F)",k:"Kelvin (K)"};
const toC=(x,u)=>u==="c"?x:u==="f"?(x-32)*5/9:x-273.15,fromC=(c,u)=>u==="c"?c:u==="f"?c*9/5+32:c+273.15;

U.Suite({slug:"converters",name:"Converters",kicker:"UNITS",ico:"⇄",tools:[
 converter("length","m","Length","Millimetres to miles and everything in between.",
  [["mm","Millimetre (mm)",.001],["cm","Centimetre (cm)",.01],["m","Metre (m)",1],["km","Kilometre (km)",1000],["in","Inch (in)",.0254],["ft","Foot (ft)",.3048],["yd","Yard (yd)",.9144],["mi","Mile (mi)",1609.344]],"ft","cm"),
 converter("weight","kg","Weight","Grams, kilos, pounds, quintals and tolas.",
  [["mg","Milligram (mg)",1e-6],["g","Gram (g)",.001],["kg","Kilogram (kg)",1],["q","Quintal (q)",100],["t","Tonne (t)",1000],["oz","Ounce (oz)",.028349523125],["lb","Pound (lb)",.45359237],["tola","Tola",.011663804]],"kg","lb"),
 {id:"temp",ico:"°C",name:"Temperature",desc:"Celsius, Fahrenheit and Kelvin.",
  fields:[{id:"v",type:"num",label:"Value",value:37},{id:"f",type:"sel",label:"From",value:"c",options:TEMP.map(k=>[k,tLab[k]])},{id:"t",type:"sel",label:"To",value:"f",options:TEMP.map(k=>[k,tLab[k]])}],
  out(v){const c=toC(v.v,v.f);return tiles([{k:`${nf(v.v,4)} ${tLab[v.f].toUpperCase()} =`,v:fmt(fromC(c,v.t))+" "+tLab[v.t].split("(")[1].replace(")",""),c:"hero"}])+U.card("ALL UNITS",rowsHTML(TEMP.filter(k=>k!==v.f).map(k=>[tLab[k].toUpperCase(),fmt(fromC(c,k))])))}},
 converter("area","m²","Area","Square metres, feet, yards, acres and hectares.",
  [["sqm","Square metre (m²)",1],["sqft","Square foot (sq ft)",.09290304],["sqyd","Square yard (sq yd)",.83612736],["ac","Acre",4046.8564224],["ha","Hectare (ha)",1e4],["sqkm","Square km (km²)",1e6]],"sqft","sqm"),
 converter("land","gaj","Land (India)","Gaj, marla, kanal, guntha, cent and more — common Indian land units.",
  [["sqft","Square foot (sq ft)",.09290304],["gaj","Gaj / sq yard",.83612736],["sqm","Square metre (m²)",1],["cent","Cent",40.468564224],["guntha","Guntha",101.17141056],["marla","Marla",25.2929538],["kanal","Kanal",505.857],["ac","Acre",4046.8564224],["ha","Hectare",1e4]],"gaj","sqft",
  "<b>Bigha</b> and <b>biswa</b> are left out on purpose: their size changes from state to state (and sometimes district to district), so a single number would mislead. Marla and kanal follow the common Punjab/Haryana values."),
 converter("speed","km/h","Speed","km/h, mph, m/s and knots.",
  [["ms","Metre / second (m/s)",1],["kmh","Kilometre / hour (km/h)",1/3.6],["mph","Mile / hour (mph)",.44704],["kn","Knot (kn)",.514444444],["fts","Foot / second (ft/s)",.3048]],"kmh","mph")
]});
