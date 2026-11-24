const {rs,rs2,compact,nf,pct,tiles,card,donut,line,table,empty,note}=U;
const MINT="#8ce4c0",BLUE="#9bb8ff",AMBER="#ffd28a",PINK="#ff8f9c";

/* ---- shared maths ---- */
function loan(P,r,n,extra=0){ // monthly reducing-balance schedule, optional extra monthly prepayment
  const i=r/1200,emi=i?P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1):P/n;
  let bal=P,m=0,int=0,yi=0,yp=0;const years=[];
  while(bal>0.5&&m<1200){const it=bal*i;let pr=emi-it+extra;if(pr>bal)pr=bal;bal-=pr;m++;int+=it;yi+=it;yp+=pr;
    if(m%12===0||bal<=0.5){years.push({y:Math.ceil(m/12),int:yi,prin:yp,bal:Math.max(bal,0)});yi=yp=0}}
  return {emi,months:m,int,years}}
function sip(M,r,years,step){ // monthly SIP, optional yearly step-up %, contribution at start of month
  const i=r/1200;let bal=0,inv=0;const ys=[{y:0,inv:0,val:0}];
  for(let m=1;m<=Math.round(years*12);m++){const c=M*Math.pow(1+step/100,Math.floor((m-1)/12));bal=(bal+c)*(1+i);inv+=c;if(m%12===0||m===Math.round(years*12))ys.push({y:+(m/12).toFixed(2),inv,val:bal})}
  return ys}
const dur=m=>{const y=Math.floor(m/12),mo=m%12;return (y?y+" yr ":"")+(mo?mo+" mo":"")||"0 mo"};

U.Suite({slug:"finance",name:"Finance Tools",kicker:"MONEY",ico:"₹",tools:[

/* 1. EMI */
{id:"emi",ico:"EMI",name:"Loan / EMI Calculator",desc:"Monthly EMI, total interest, yearly amortization — and what a prepayment saves you.",
 fields:[
  {id:"p",type:"num",label:"Loan amount",pre:"₹",value:2500000,slider:[100000,20000000,50000]},
  {id:"r",type:"num",label:"Interest rate (p.a.)",suf:"%",value:8.5,step:0.05,slider:[1,24,0.05]},
  {id:"t",type:"num",label:"Tenure",suf:"years",value:20,step:0.25,slider:[1,30,0.25]},
  {id:"x",type:"num",label:"Extra monthly prepayment",hint:"optional",pre:"₹",value:0,slider:[0,100000,500]}],
 out(v){if(v.p<=0||v.t<=0)return empty("Enter a loan amount and tenure.");const n=Math.round(v.t*12);const b=loan(v.p,v.r,n),w=v.x>0?loan(v.p,v.r,n,v.x):b;
  const T=[{k:"MONTHLY EMI",v:rs(b.emi),c:"hero"},{k:"TOTAL INTEREST",v:compact(w.int),s:v.x>0?"with prepayment":""},{k:"TOTAL PAYABLE",v:compact(v.p+w.int)}];
  if(v.x>0)T.push({k:"INTEREST SAVED",v:compact(b.int-w.int),c:"good",s:`Done ${dur(b.months-w.months)} earlier (${dur(w.months)})`});
  return tiles(T)+card("PRINCIPAL VS INTEREST",donut([{label:"Principal",value:v.p,color:MINT,text:compact(v.p)},{label:"Interest",value:w.int,color:AMBER,text:compact(w.int)}],["INTEREST",pct(w.int/(v.p+w.int)*100,1)]))
   +card("YEARLY AMORTIZATION",table(["YEAR","PRINCIPAL","INTEREST","BALANCE"],w.years.map(y=>[y.y,rs(y.prin),rs(y.int),rs(y.bal)])))}},

/* 2. MF returns */
{id:"mf",ico:"MF",name:"Mutual Fund Returns",desc:"Estimate SIP or lumpsum growth, with yearly step-up and inflation-adjusted value.",
 fields:[
  {id:"mode",type:"choice",label:"Investment type",value:"sip",options:[["sip","SIP"],["lump","Lumpsum"]]},
  {id:"m",type:"num",label:"Monthly investment",pre:"₹",value:10000,slider:[500,200000,500],show:v=>v.mode==="sip"},
  {id:"l",type:"num",label:"One-time investment",pre:"₹",value:500000,slider:[10000,10000000,10000],show:v=>v.mode==="lump"},
  {id:"r",type:"num",label:"Expected return (p.a.)",suf:"%",value:12,step:0.1,slider:[1,30,0.1]},
  {id:"y",type:"num",label:"Time period",suf:"years",value:15,slider:[1,40,1]},
  {id:"s",type:"num",label:"Yearly step-up",hint:"SIP only",suf:"%",value:0,slider:[0,25,1],show:v=>v.mode==="sip"},
  {id:"i",type:"num",label:"Inflation",hint:"optional",suf:"%",value:0,step:0.1,slider:[0,12,0.1]}],
 out(v){if(v.y<=0)return empty("Enter a time period.");let ys;
  if(v.mode==="sip"){if(v.m<=0)return empty("Enter a monthly amount.");ys=sip(v.m,v.r,v.y,v.s)}
  else{if(v.l<=0)return empty("Enter an amount.");ys=Array.from({length:Math.floor(v.y)+1},(_,k)=>({y:k,inv:v.l,val:v.l*Math.pow(1+v.r/100,k)}));const f=Math.floor(v.y);if(v.y>f)ys.push({y:v.y,inv:v.l,val:v.l*Math.pow(1+v.r/100,v.y)})}
  const e=ys[ys.length-1],gain=e.val-e.inv,real=e.val/Math.pow(1+v.i/100,v.y);
  const T=[{k:"TOTAL VALUE",v:compact(e.val),c:"hero"},{k:"INVESTED",v:compact(e.inv)},{k:"ESTIMATED RETURNS",v:compact(gain),c:"good",s:pct(gain/e.inv*100,0)+" absolute"}];
  if(v.i>0)T.push({k:"TODAY'S MONEY",v:compact(real),c:"warn",s:`After ${v.i}% inflation`});
  return tiles(T)+card("INVESTED VS RETURNS",donut([{label:"Invested",value:e.inv,color:BLUE,text:compact(e.inv)},{label:"Returns",value:gain,color:MINT,text:compact(gain)}],["RETURNS",pct(gain/e.val*100,0)]))
   +card("GROWTH",line(ys.map(y=>y.y),[{name:"Invested",color:BLUE,ys:ys.map(y=>y.inv)},{name:"Value",color:MINT,area:1,ys:ys.map(y=>y.val)}]))
   +card("YEAR BY YEAR",table(["YEAR","INVESTED","RETURNS","VALUE"],ys.slice(1).map(y=>[y.y,rs(y.inv),rs(y.val-y.inv),rs(y.val)])))
   +note("Returns are estimates assuming a constant rate; actual mutual fund returns vary and are not guaranteed.")}},

/* 3. SIP goal */
{id:"goal",ico:"🎯",name:"SIP Goal Planner",desc:"Work backwards from a target amount to the monthly SIP (or lumpsum) you need.",
 fields:[
  {id:"t",type:"num",label:"Target amount",pre:"₹",value:10000000,slider:[100000,100000000,100000]},
  {id:"y",type:"num",label:"Years to goal",suf:"years",value:15,slider:[1,40,1]},
  {id:"r",type:"num",label:"Expected return (p.a.)",suf:"%",value:12,step:0.1,slider:[1,30,0.1]},
  {id:"s",type:"num",label:"Yearly step-up",suf:"%",value:0,slider:[0,25,1]},
  {id:"c",type:"num",label:"Already saved for this goal",hint:"optional",pre:"₹",value:0,slider:[0,10000000,10000]}],
 out(v){if(v.t<=0||v.y<=0)return empty("Enter a target and years.");const g=Math.pow(1+v.r/100,v.y),have=v.c*g,need=v.t-have;
  if(need<=0)return tiles([{k:"STATUS",v:"Already on track 🎉",c:"good",s:`Your ${compact(v.c)} grows to ${compact(have)}`}]);
  const F=sip(1,v.r,v.y,v.s).pop().val,M=need/F,ys=sip(M,v.r,v.y,v.s),e=ys[ys.length-1];
  return tiles([{k:"MONTHLY SIP NEEDED",v:rs(M),c:"hero",s:v.s?`Rising ${v.s}% every year`:"Fixed every month"},{k:"OR ONE-TIME TODAY",v:compact(need/g),s:"Lumpsum alternative"},{k:"TOTAL INVESTED",v:compact(e.inv)},{k:"WEALTH GAINED",v:compact(v.t-e.inv-(v.c?v.c:0)),c:"good"}])
   +card("PATH TO YOUR GOAL",line(ys.map(y=>y.y),[{name:"Invested",color:BLUE,ys:ys.map(y=>y.inv+v.c)},{name:"Value",color:MINT,area:1,ys:ys.map((y,k)=>y.val+v.c*Math.pow(1+v.r/100,y.y))}]))}},

/* 4. EMI comparison */
{id:"compare",ico:"A/B",name:"EMI Comparison",desc:"Put two loan offers side by side — rate, tenure and processing fee — and see the real cheaper one.",
 fields:[
  {group:"LOAN A"},{id:"ap",type:"num",label:"Amount",pre:"₹",value:2500000},{id:"ar",type:"num",label:"Rate (p.a.)",suf:"%",value:8.5,step:0.05},{id:"at",type:"num",label:"Tenure",suf:"years",value:20,step:0.25},{id:"af",type:"num",label:"Processing fee",suf:"%",value:0.5,step:0.05},
  {group:"LOAN B"},{id:"bp",type:"num",label:"Amount",pre:"₹",value:2500000},{id:"br",type:"num",label:"Rate (p.a.)",suf:"%",value:8.25,step:0.05},{id:"bt",type:"num",label:"Tenure",suf:"years",value:20,step:0.25},{id:"bf",type:"num",label:"Processing fee",suf:"%",value:1,step:0.05}],
 out(v){const calc=(p,r,t,f)=>{if(p<=0||t<=0)return null;const L=loan(p,r,Math.round(t*12));const fee=p*f/100;return {emi:L.emi,int:L.int,fee,cost:L.int+fee,pay:p+L.int+fee}};
  const A=calc(v.ap,v.ar,v.at,v.af),B=calc(v.bp,v.br,v.bt,v.bf);if(!A||!B)return empty("Fill in both loans.");
  const d=A.cost-B.cost,w=d<0?"A":d>0?"B":"";
  return tiles([{k:"CHEAPER OPTION",v:w?"Loan "+w:"Same",c:"hero",s:w?`Saves ${compact(Math.abs(d))} overall`:"Identical total cost"},{k:"EMI DIFFERENCE",v:rs(Math.abs(A.emi-B.emi)),s:A.emi<B.emi?"Loan A is lower":A.emi>B.emi?"Loan B is lower":"Equal"}])
   +card("SIDE BY SIDE",table(["","LOAN A","LOAN B"],[["Monthly EMI",rs(A.emi),rs(B.emi)],["Total interest",rs(A.int),rs(B.int)],["Processing fee",rs(A.fee),rs(B.fee)],["Total cost",rs(A.cost),rs(B.cost)],["Total payable",rs(A.pay),rs(B.pay)]],[0,d<0,d>0]))
   +note("<b>Total cost</b> = interest + processing fee. A lower rate can lose to a higher rate with a lower fee, which is why this comparison counts both.")}},

/* 5. FD / RD */
{id:"fd",ico:"FD",name:"FD / RD Calculator",desc:"Maturity value of a fixed or recurring deposit with your compounding frequency.",
 fields:[
  {id:"mode",type:"choice",label:"Deposit type",value:"fd",options:[["fd","Fixed Deposit"],["rd","Recurring Deposit"]]},
  {id:"p",type:"num",label:"Deposit amount",pre:"₹",value:500000,slider:[10000,10000000,10000],show:v=>v.mode==="fd"},
  {id:"d",type:"num",label:"Monthly deposit",pre:"₹",value:10000,slider:[500,200000,500],show:v=>v.mode==="rd"},
  {id:"r",type:"num",label:"Interest rate (p.a.)",suf:"%",value:7,step:0.05,slider:[1,12,0.05]},
  {id:"t",type:"num",label:"Tenure",suf:"years",value:5,step:0.25,slider:[0.25,15,0.25]},
  {id:"q",type:"sel",label:"Compounding",value:4,options:[[4,"Quarterly (most banks)"],[12,"Monthly"],[2,"Half-yearly"],[1,"Yearly"]]}],
 out(v){if(v.t<=0)return empty("Enter a tenure.");const q=+v.q,j=v.r/(100*q);let inv,val;
  if(v.mode==="fd"){if(v.p<=0)return empty("Enter an amount.");inv=v.p;val=v.p*Math.pow(1+j,q*v.t)}
  else{if(v.d<=0)return empty("Enter a monthly deposit.");const n=Math.round(v.t*12);inv=v.d*n;val=0;for(let k=0;k<n;k++)val+=v.d*Math.pow(1+j,q*(n-k)/12)}
  const gain=val-inv;
  return tiles([{k:"MATURITY VALUE",v:rs(val),c:"hero"},{k:"TOTAL DEPOSITED",v:rs(inv)},{k:"INTEREST EARNED",v:rs(gain),c:"good"},...(v.mode==="fd"?[{k:"EFFECTIVE YIELD",v:pct((Math.pow(val/inv,1/v.t)-1)*100)+" p.a."}]:[])])
   +card("DEPOSIT VS INTEREST",donut([{label:"Deposited",value:inv,color:BLUE,text:compact(inv)},{label:"Interest",value:gain,color:MINT,text:compact(gain)}],["INTEREST",pct(gain/val*100,0)]))
   +note("Estimates only. Banks may round interest or compound on slightly different dates, and TDS may apply.")}},

/* 6. CAGR */
{id:"cagr",ico:"%",name:"CAGR Calculator",desc:"Compound annual growth rate of any investment — or work out a future or starting value.",
 fields:[
  {id:"mode",type:"choice",label:"Find",value:"cagr",options:[["cagr","CAGR"],["end","End value"],["start","Start value"]]},
  {id:"a",type:"num",label:"Start value",pre:"₹",value:100000,show:v=>v.mode!=="start"},
  {id:"b",type:"num",label:"End value",pre:"₹",value:250000,show:v=>v.mode!=="end"},
  {id:"y",type:"num",label:"Years",suf:"years",value:5,step:0.25},
  {id:"c",type:"num",label:"CAGR",suf:"%",value:12,step:0.1,show:v=>v.mode!=="cagr"}],
 out(v){if(v.y<=0)return empty("Enter the number of years.");let a=v.a,b=v.b,c=v.c;
  if(v.mode==="cagr"){if(a<=0||b<=0)return empty("Values must be above zero.");c=(Math.pow(b/a,1/v.y)-1)*100}
  else if(v.mode==="end"){b=a*Math.pow(1+c/100,v.y)}else{a=b/Math.pow(1+c/100,v.y)}
  const dbl=c>0?Math.log(2)/Math.log(1+c/100):null;
  return tiles([v.mode==="cagr"?{k:"CAGR",v:pct(c),c:"hero",s:"per year"}:v.mode==="end"?{k:"END VALUE",v:rs(b),c:"hero"}:{k:"START VALUE",v:rs(a),c:"hero"},
   {k:"ABSOLUTE RETURN",v:pct((b/a-1)*100),c:b>=a?"good":"bad",s:`${rs(a)} → ${rs(b)}`},...(dbl?[{k:"DOUBLES IN",v:nf(dbl,1)+" yrs",s:"at this rate"}]:[])])}},

/* 7. GST */
{id:"gst",ico:"GST",name:"GST Calculator",desc:"Add GST to a price or pull it out of a GST-inclusive amount.",
 fields:[
  {id:"mode",type:"choice",label:"Amount is",value:"add",options:[["add","Excluding GST"],["rem","Including GST"]]},
  {id:"a",type:"num",label:"Amount",pre:"₹",value:1000},
  {id:"r",type:"sel",label:"GST rate",value:18,options:[[0.25,"0.25%"],[3,"3%"],[5,"5%"],[12,"12%"],[18,"18%"],[28,"28%"],[40,"40%"],["c","Custom…"]]},
  {id:"cr",type:"num",label:"Custom rate",suf:"%",value:10,step:0.01,show:v=>v.r==="c"}],
 out(v){const rate=(v.r==="c"?v.cr:+v.r)/100,amt=Math.max(0,v.a);let base,tax,tot;if(v.mode==="add"){base=amt;tax=base*rate;tot=base+tax}else{tot=amt;base=tot/(1+rate);tax=tot-base}
  return tiles([{k:"TOTAL AMOUNT",v:rs2(tot),c:"hero"},{k:"BASE PRICE",v:rs2(base)},{k:"GST AMOUNT",v:rs2(tax),c:"warn",s:pct(rate*100)+" GST"}])
   +card("INTRA-STATE (CGST + SGST)",table(["COMPONENT","RATE","AMOUNT"],[["CGST",pct(rate*50),rs2(tax/2)],["SGST",pct(rate*50),rs2(tax/2)]]))
   +card("INTER-STATE (IGST)",table(["COMPONENT","RATE","AMOUNT"],[["IGST",pct(rate*100),rs2(tax)]]))}}
]});
