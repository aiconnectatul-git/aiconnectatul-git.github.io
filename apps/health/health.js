const {tiles,card,table,empty,note,nf,rowsHTML}=U;
const sexF={id:"sex",type:"choice",label:"Sex",value:"m",options:[["m","Male"],["f","Female"]]};
const hF={id:"h",type:"num",label:"Height",suf:"cm",value:170,slider:[120,220,1]};
const wF={id:"w",type:"num",label:"Weight",suf:"kg",value:70,step:0.1,slider:[30,200,0.5]};

U.Suite({slug:"health",name:"Health & Fitness",kicker:"WELLNESS",ico:"♥",tools:[

{id:"bmi",ico:"BMI",name:"BMI Calculator",desc:"Body mass index with your healthy weight range for your height.",
 fields:[{id:"u",type:"choice",label:"Units",value:"m",options:[["m","Metric"],["i","Imperial"]]},
  {...hF,show:v=>v.u==="m"},{...wF,show:v=>v.u==="m"},
  {id:"ft",type:"num",label:"Height",suf:"ft",value:5,show:v=>v.u==="i"},{id:"in",type:"num",label:"Inches",suf:"in",value:7,show:v=>v.u==="i"},
  {id:"lb",type:"num",label:"Weight",suf:"lb",value:154,show:v=>v.u==="i"}],
 out(v){const m=v.u==="m"?v.h/100:(v.ft*12+v.in)*0.0254,kg=v.u==="m"?v.w:v.lb*0.45359237;if(m<=0||kg<=0)return empty("Enter height and weight.");
  const b=kg/(m*m),cat=b<18.5?["Underweight","warn"]:b<25?["Healthy","good"]:b<30?["Overweight","warn"]:["Obese","bad"];
  const lo=18.5*m*m,hi=24.9*m*m,u=v.u==="m"?[1,"kg"]:[2.20462,"lb"],pos=Math.min(100,Math.max(0,(b-15)/25*100));
  return tiles([{k:"YOUR BMI",v:nf(b,1),c:"hero"},{k:"CATEGORY",v:cat[0],c:cat[1]},{k:"HEALTHY RANGE",v:`${nf(lo*u[0],1)}–${nf(hi*u[0],1)} ${u[1]}`,s:"BMI 18.5 – 24.9"}])
   +card("WHERE YOU SIT",`<div class="scale"><i style="left:${pos}%"></i></div><div class="scalelab"><span>Under</span><span>Healthy</span><span>Over</span><span>Obese</span></div>`)
   +note("BMI is a rough screening number. It doesn't separate muscle from fat, so athletes and older adults may read differently. Talk to a doctor for personal advice.")}},

{id:"calories",ico:"kcal",name:"Calorie Needs",desc:"Daily calories to maintain, lose or gain weight (Mifflin-St Jeor).",
 fields:[sexF,{id:"a",type:"num",label:"Age",suf:"years",value:30,slider:[15,80,1]},hF,wF,
  {id:"act",type:"sel",label:"Activity level",value:1.55,options:[[1.2,"Sedentary (desk job, little exercise)"],[1.375,"Light (1–3 workouts a week)"],[1.55,"Moderate (3–5 workouts a week)"],[1.725,"Very active (6–7 workouts a week)"],[1.9,"Athlete / physical job"]]}],
 out(v){if(v.h<=0||v.w<=0||v.a<=0)return empty("Fill in all fields.");const bmr=10*v.w+6.25*v.h-5*v.a+(v.sex==="m"?5:-161),tdee=bmr*+v.act,r=x=>nf(Math.round(x),0);
  return tiles([{k:"MAINTAIN WEIGHT",v:r(tdee)+" kcal",c:"hero",s:"per day (TDEE)"},{k:"BASAL RATE (BMR)",v:r(bmr)+" kcal",s:"at complete rest"}])
   +card("DAILY TARGETS",table(["GOAL","CALORIES / DAY","PACE"],[["Lose weight",r(Math.max(tdee-500,bmr))+" kcal","≈ 0.5 kg / week"],["Maintain",r(tdee)+" kcal","steady"],["Gain muscle",r(tdee+300)+" kcal","≈ 0.25 kg / week"]]))
   +note("These are estimates. Avoid eating below your BMR for long without medical guidance.")}},

{id:"water",ico:"H₂O",name:"Water Intake",desc:"A daily water target based on your weight, workouts and climate.",
 fields:[wF,{id:"ex",type:"num",label:"Exercise per day",suf:"min",value:30,step:5,slider:[0,180,5]},{id:"cl",type:"choice",label:"Climate",value:"n",options:[["n","Mild"],["h","Hot / humid"]]}],
 out(v){if(v.w<=0)return empty("Enter your weight.");const ml=v.w*35+v.ex/30*350+(v.cl==="h"?500:0);
  return tiles([{k:"DAILY TARGET",v:nf(ml/1000,1)+" L",c:"hero",s:`${nf(Math.round(ml),0)} ml`},{k:"GLASSES (250 ML)",v:nf(Math.ceil(ml/250),0)},{k:"BOTTLES (1 L)",v:nf(ml/1000,1)}])
   +note("About 35 ml per kg of body weight, plus 350 ml per 30 minutes of exercise and a little more in hot weather. This includes water from food and other drinks. Needs vary with health conditions.")}},

{id:"ideal",ico:"kg",name:"Ideal Weight",desc:"Ideal body weight from four classic formulas and a healthy BMI range.",
 fields:[sexF,hF],
 out(v){if(v.h<=0)return empty("Enter your height.");const inch=v.h/2.54,over=Math.max(0,inch-60),m=v.sex==="m",h=v.h/100;
  const F=[["Devine",(m?50:45.5)+2.3*over],["Robinson",(m?52:49)+(m?1.9:1.7)*over],["Miller",(m?56.2:53.1)+(m?1.41:1.36)*over],["Hamwi",(m?48:45.5)+(m?2.7:2.2)*over]];
  const avg=F.reduce((a,f)=>a+f[1],0)/F.length;
  return tiles([{k:"AVERAGE IDEAL",v:nf(avg,1)+" kg",c:"hero",s:"across 4 formulas"},{k:"HEALTHY BMI RANGE",v:`${nf(18.5*h*h,1)}–${nf(24.9*h*h,1)} kg`,s:"BMI 18.5 – 24.9"}])
   +card("BY FORMULA",table(["FORMULA","IDEAL WEIGHT"],F.map(f=>[f[0],nf(f[1],1)+" kg"])))
   +note("These formulas were designed for adults and give a ballpark figure only. The healthy BMI range is usually the more practical target.")}}
]});
