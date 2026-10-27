(() => {
  const KEY = "rebirth-pwa-v1";
  const groups = [
    {name:"EARLY MORNING", items:[
      ["tahajjud_shower","Cool shower before Tahajjud","Brief, comfortable shower; skip icy water if dizzy, weak or unwell.","Before Tahajjud"],
      ["tahajjud","Tahajjud and dua","Pray at a comfortable pace. If sleep-deprived or unwell, prioritize rest.","Around 4:15 AM*"],
      ["fajr","Fajr prayer","Use the local prayer timetable; times change daily.","At local Fajr time"],
      ["breakfast","Breakfast","Eggs, roti or oats, milk/yogurt and fruit; adjust portions to appetite.","Around 6:00 AM"],
      ["morning_skincare","Morning skincare","Cleanser → niacinamide if tolerated → moisturizer → SPF 50.","Before leaving"],
    ]},
    {name:"WORK & DAYTIME",items:[
      ["factory_am","Factory work: morning","Work block. Keep water nearby and take a snack if needed.","8:00 AM–1:00 PM"],
      ["dhuhr","Dhuhr prayer","Pray when its time begins and during an available break.","Local prayer time"],
      ["lunch","Lunch","Roti/rice + protein (chicken, eggs, daal/beans) + vegetables/yogurt.","1:00–2:00 PM"],
      ["factory_pm","Factory work: afternoon","Work block; take breaks as available.","2:00–6:00 PM"],
      ["asr","Asr prayer","Use your local prayer timetable and available break.","Local prayer time"],
      ["snack","Afternoon snack","Banana shake, milk, yogurt, nuts or peanut-butter sandwich.","Around 4:30 PM"],
    ]},
    {name:"EVENING RESET",items:[
      ["evening_shower","Evening cool shower","After work or any convenient evening time. Comfortable cool water is enough.","After 6:00 PM / flexible"],
      ["maghrib","Maghrib prayer","Follow local prayer time.","Local prayer time"],
      ["dinner","Dinner","Balanced meal with protein, carbohydrates and vegetables.","Around 7:00 PM"],
      ["workout","Workout / recovery","Follow weekly plan only if cleared and feeling well; otherwise recovery walk or rest.","Flexible evening"],
      ["bodycare","Body care","Moisturize body as needed; SPF on exposed skin during daylight.","After shower"],
      ["haircare","Hair care (scheduled days)","Shampoo as needed; avoid harsh rubbing. Use serum on hair lengths as directed.","Scheduled days"],
      ["night_skincare","Night skincare","Cleanse → one active (salicylic OR azelaic on alternate nights) → moisturizer.","Before bed"],
      ["isha","Isha prayer","Follow local prayer time.","Local prayer time"],
      ["medication","Prescribed medicines check","Follow only your current clinician-confirmed prescription. This app does not verify dose or timing.","As prescribed"],
      ["sleep","Sleep and wind-down","Protect enough sleep. Do not force a 4 AM wake-up if it leaves you sleep-deprived.","Aim for an early bedtime"],
    ]}
  ];
  const meals = [
    ["breakfast","Breakfast","Eggs, roti/oats, milk and a banana. Include protein and carbohydrates.","~6:00 AM"],
    ["lunch","Lunch","Rice or roti, chicken/eggs/daal/beans, vegetables and yogurt.","1:00–2:00 PM"],
    ["snack","Snack","Banana shake, milk, nuts, yogurt or a peanut-butter sandwich.","~4:30 PM"],
    ["dinner","Dinner","A filling balanced meal: protein + rice/roti/potatoes + vegetables.","~7:00 PM"],
    ["bed_snack","Optional bedtime snack","Milk or yogurt with fruit/oats if hungry and it does not disrupt sleep.","Optional"],
  ];
  const workoutPlan = {
    Monday:"Chest & triceps",Tuesday:"Back & biceps",Wednesday:"Legs & calves",
    Thursday:"Shoulders & core",Friday:"Full body",Saturday:"Active recovery",Sunday:"Rest"
  };
  let data = load();
  function localDateKey(date = new Date()) {
    const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,"0"), d=String(date.getDate()).padStart(2,"0");
    return `${y}-${m}-${d}`;
  }
  function blankDay(){return {tasks:{},meals:{},water:0};}
  function load(){
    try { const parsed=JSON.parse(localStorage.getItem(KEY)||"{}"); return {days:parsed.days||{},weights:parsed.weights||[],settings:parsed.settings||{wakeTime:"04:00",workStart:"08:00",workEnd:"18:00"}}; }
    catch { return {days:{},weights:[],settings:{wakeTime:"04:00",workStart:"08:00",workEnd:"18:00"}}; }
  }
  function save(){localStorage.setItem(KEY,JSON.stringify(data));}
  function day(key=localDateKey()){if(!data.days[key])data.days[key]=blankDay();return data.days[key];}
  function allTasks(){return groups.flatMap(g=>g.items);}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function renderRoutine(){
    const today=day(); const root=document.getElementById("routineList");
    root.innerHTML=groups.map(g=>`<div class="routine-group"><div class="group-title"><span class="dot"></span>${g.name}</div>${g.items.map(t=>`<label class="task-card ${today.tasks[t[0]]?'done':''}"><input class="check task-check" type="checkbox" data-id="${t[0]}" ${today.tasks[t[0]]?'checked':''}><span class="task-content"><span class="task-head"><span class="task-name">${t[1]}</span><span class="task-time">${t[3]}</span></span><span class="task-desc">${t[2]}</span></span></label>`).join("")}</div>`).join("");
    root.querySelectorAll(".task-check").forEach(el=>el.addEventListener("change",()=>{day().tasks[el.dataset.id]=el.checked;save();renderAll();}));
  }
  function renderMeals(){
    const today=day(), root=document.getElementById("mealList");
    root.innerHTML=meals.map(m=>`<label class="meal-card"><input type="checkbox" data-id="${m[0]}" ${today.meals[m[0]]?'checked':''}><span><span class="meal-title">${m[1]}</span><span class="meal-time">${m[3]}</span><span class="meal-desc">${m[2]}</span></span></label>`).join("");
    root.querySelectorAll("input").forEach(el=>el.addEventListener("change",()=>{day().meals[el.dataset.id]=el.checked;save();renderAll();}));
    document.getElementById("mealCount").innerHTML=`${Object.values(today.meals).filter(Boolean).length}<small> / ${meals.length}</small>`;
  }
  function pctFor(key){const d=data.days[key]||blankDay();const total=allTasks().length;return total?Math.round(allTasks().filter(t=>d.tasks[t[0]]).length/total*100):0;}
  function renderProgress(){
    const key=localDateKey(), today=day(), total=allTasks().length, done=allTasks().filter(t=>today.tasks[t[0]]).length;
    const p=total?Math.round(done/total*100):0;
    document.getElementById("percent").textContent=p+"%";
    document.getElementById("progressBar").style.width=p+"%";
    document.getElementById("taskCount").textContent=`${done} of ${total} tasks done`;
    document.getElementById("statToday").textContent=p+"%";
    document.getElementById("statWater").textContent=`${today.water||0}/8`;
    document.getElementById("statWeights").textContent=data.weights.length;
    const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push({key:localDateKey(d),label:d.toLocaleDateString(undefined,{weekday:"short"}).slice(0,2)});}
    const vals=days.map(x=>pctFor(x.key));document.getElementById("statWeek").textContent=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length)+"%";
    document.getElementById("weekBars").innerHTML=days.map((x,i)=>`<div class="day-bar"><div class="bar-track"><div class="bar-fill" style="height:${vals[i]}%"></div></div><small>${x.label}</small></div>`).join("");
  }
  function renderDiet(){
    const d=day();document.getElementById("waterValue").textContent=d.water||0;
    document.getElementById("waterBar").style.width=Math.min(100,(d.water||0)/8*100)+"%";
    const latest=data.weights.slice().sort((a,b)=>b.date.localeCompare(a.date))[0];
    document.getElementById("latestWeight").textContent=latest?`Latest: ${latest.kg} kg · ${latest.date}`:"No weight logged yet.";
    document.getElementById("weightInput").value="";
  }
  function renderAll(){renderRoutine();renderMeals();renderProgress();renderDiet();}
  function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400);}
  document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b===btn));document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===btn.dataset.tab+"View"));}));
  document.getElementById("waterPlus").addEventListener("click",()=>{day().water=Math.min(40,(day().water||0)+1);save();renderAll();});
  document.getElementById("waterMinus").addEventListener("click",()=>{day().water=Math.max(0,(day().water||0)-1);save();renderAll();});
  document.getElementById("weightForm").addEventListener("submit",e=>{e.preventDefault();const kg=Number(document.getElementById("weightInput").value);if(!kg||kg<20||kg>350){toast("Enter a valid weight in kg.");return;}data.weights.push({date:localDateKey(),kg});save();renderAll();toast("Weight saved on this device.");});
  document.getElementById("resetDayBtn").addEventListener("click",()=>{if(confirm("Reset today's checklist, meals and water count? Your weight history will stay.")){data.days[localDateKey()]=blankDay();save();renderAll();toast("Today's checklist reset.");}});
  const dialog=document.getElementById("settingsDialog");
  document.getElementById("settingsBtn").addEventListener("click",()=>{document.getElementById("wakeTime").value=data.settings.wakeTime;document.getElementById("workStart").value=data.settings.workStart;document.getElementById("workEnd").value=data.settings.workEnd;dialog.showModal();});
  document.getElementById("saveSettings").addEventListener("click",()=>{data.settings={wakeTime:document.getElementById("wakeTime").value||"04:00",workStart:document.getElementById("workStart").value||"08:00",workEnd:document.getElementById("workEnd").value||"18:00"};save();dialog.close();toast("Preferences saved.");});
  document.getElementById("exportBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`rebirth-backup-${localDateKey()}.json`;a.click();URL.revokeObjectURL(a.href);toast("Backup exported.");});
  document.getElementById("importFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const obj=JSON.parse(await f.text());if(!obj.days||!obj.weights)throw Error();data={days:obj.days,weights:obj.weights,settings:obj.settings||data.settings};save();renderAll();toast("Backup imported.");}catch{toast("That backup file could not be read.");}e.target.value="";});
  document.getElementById("clearDataBtn").addEventListener("click",()=>{if(confirm("Delete ALL REBIRTH data from this browser? Export a backup first if needed.")){localStorage.removeItem(KEY);data=load();renderAll();toast("App data deleted from this browser.");}});
  const now=new Date();document.getElementById("todayLabel").textContent=now.toLocaleDateString(undefined,{weekday:"long"}).toUpperCase();document.getElementById("dateLabel").textContent=now.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});
  renderAll();
  if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
})();