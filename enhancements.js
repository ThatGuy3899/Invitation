
/* Date invitation extras. Optional: base invitation still works if this file cannot load. */
(() => {
  "use strict";
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const safeText = value => String(value || "").trim();
  const planNames = ["REXKL & Central Market","The Exchange TRX","LaLaport BBCC","118 Mall & Merdeka 118"];
  const suggestedName = "Your own suggestion";
  const locationInfo = {
    "REXKL & Central Market": {
      where:"Central Market & REXKL, Kuala Lumpur",transit:"Pasar Seni MRT/LRT · easy walk to Central Market",details:"Indoor crafts and food, with optional REXKL",search:"Central Market Kuala Lumpur",
      meet:"Inside Central Market near the main entrance, or at Pasar Seni station if that's easier.",
      rain:"If it is hot or raining, we can stay inside Central Market for food and crafts and skip the walk to REXKL."
    },
    "The Exchange TRX":{
      where:"The Exchange TRX, Persiaran TRX",transit:"Tun Razak Exchange MRT · linked to the mall",details:"Coffee, food and indoor shops; optional rooftop",search:"The Exchange TRX Kuala Lumpur",
      meet:"Inside The Exchange TRX, near the Concourse Level pedestrian link from Tun Razak Exchange MRT.",
      rain:"If it is hot or raining, let's stay in the air-conditioned mall for food, coffee and shopping. The rooftop is completely optional."
    },
    "LaLaport BBCC":{
      where:"LaLaport BBCC, 2 Jalan Hang Tuah, Kuala Lumpur",transit:"Hang Tuah LRT/Monorail · sheltered walkway to mall",details:"Food, books and optional K-pop finds",search:"LaLaport BBCC Kuala Lumpur",
      meet:"Inside LaLaport near the Hang Tuah station-linked transportation hub at LG1, East Atrium. We can confirm an easy landmark in chat.",
      rain:"We can keep the whole date indoors with food, BookXcess and whichever pop-culture shops are open."
    },
    "118 Mall & Merdeka 118":{
      where:"118 Mall, Jalan Hang Jebat",transit:"Merdeka MRT · linked to the mall; Plaza Rakyat LRT also connected",details:"Explore a new mall and choose from open shops",search:"118 Mall Kuala Lumpur",
      meet:"Near the sheltered connection from Merdeka MRT or Plaza Rakyat LRT — whichever is easier for you. We'll confirm the exact meeting point in chat.",
      rain:"We can stay inside 118 Mall and choose from shops and cafés that are open, skipping outdoor photos. Some shops are still opening."
    }
  };
  const openEndedTips = {
    meet:"We can choose an easy-to-find public meeting point once we agree on a place.",
    rain:"If it’s hot or raining, we can find a comfortable indoor café nearby or choose another day."
  };
  // Photographer details and licensing are linked to the original Commons file pages.
  const commons = file => "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(file) + "?width=900";
  const credits = file => "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(file);
  // Original Wikimedia Commons file pages provide author and full licence details.
  // Each credit also names the creator and the licence in the visible gallery.
  const photoSets = {
    "REXKL & Central Market":[
      ["Central Market exterior","Central_Market_Kuala_Lumpur.jpg","Aumars","CC BY-SA 4.0"],
      ["Inside Central Market","Interior_of_Central_Market,_Kuala_Lumpur.jpg","Wee Hong","CC BY-SA 4.0"]
    ],
    "The Exchange TRX":[
      ["TRX City Park","TRX_City_Park_at_The_Exchange_TRX_(23.12.02).jpg","LegendaryLim","CC0"],
      ["The Exchange TRX","The_Exchange_TRX_20231216_(1).jpg","InterEdit88","CC0"]
    ],
    "LaLaport BBCC":[
      ["Inside LaLaport BBCC","BBCC_Lalaport,_Kuala_Lumpur.jpg","Azreey","CC BY-SA 4.0"],
      ["LaLaport BBCC shopping interior","LaLaport_BBCC_(220802-1518).jpg","Wee Hong","CC BY-SA 4.0"]
    ],
    "118 Mall & Merdeka 118":[
      ["118 Mall and Merdeka 118","118_Mall_from_Jalan_Hang_Jebat.jpg","Wlsrudals","CC0"],
      ["118 Mall MRT connection","Merdeka_MRT_Station_entrance_to_118_Mall_(261101).jpg","*angys*","CC BY-SA 4.0"]
    ]
  };
  // Load only the current gallery photo. Next photos are fetched when selected.
  // Keep the original emoji art visible if an image fails to load.
  for (const card of $$(".plan-card")) {
    const set = photoSets[card.dataset.plan];
    if (!set) continue;
    const art = $(".plan-art", card);
    const gallery = document.createElement("div");
    gallery.className = "photo-gallery";
    gallery.setAttribute("role","group");
    gallery.setAttribute("aria-label",card.dataset.plan + " photographs");
    const images = set.map(([alt,file],i) => {
      const img = document.createElement("img");
      img.alt = alt;
      img.dataset.src = commons(file);
      img.loading = "lazy";
      img.decoding = "async";
      gallery.appendChild(img);
      return img;
    });
    const failed = new Set();
    let index = 0;
    const caption = document.createElement("div");
    caption.className = "photo-caption";
    const captionText = document.createElement("span");
    captionText.setAttribute("aria-live","polite");
    const credit = document.createElement("a");
    credit.target = "_blank";
    credit.rel = "noopener noreferrer";
    const sync = () => {
      images.forEach((img,i) => img.classList.toggle("active",i===index));
      const [alt,file,author,licence] = set[index];
      captionText.textContent = alt;
      credit.href = credits(file);
      credit.textContent = author + " · " + licence + " ↗";
      credit.setAttribute("aria-label","Photo by " + author + ", " + licence + ". Open source and licence details");
      if (!images[index].getAttribute("src")) images[index].src=images[index].dataset.src;
    };
    images.forEach((img,i)=>{
      img.addEventListener("load",()=>img.classList.add("loaded"));
      img.addEventListener("error",()=>{
        failed.add(i);
        img.classList.remove("loaded");
        if (i===index) {
          const next = images.findIndex((_,other)=>!failed.has(other));
          if(next>=0){index=next;sync();}
          else {
            gallery.hidden=true;
            art.classList.remove("photo-active");
            art.querySelector(".art-emoji").setAttribute("aria-hidden","false");
            art.setAttribute("title","Photo unavailable. This location is still selectable.");
          }
        }
      });
    });
    caption.append(captionText,credit);
    for (const [className,delta,text] of [["previous",-1,"‹"],["next",1,"›"]]) {
      const btn=document.createElement("button");
      btn.type="button";btn.className="photo-nav "+className;btn.textContent=text;
      btn.setAttribute("aria-label",delta>0?"Next location photo":"Previous location photo");
      btn.addEventListener("click",event=>{
        event.stopPropagation();
        let candidate=index;
        for (let attempt=0;attempt<set.length;attempt++){
          candidate=(candidate+delta+set.length)%set.length;
          if(!failed.has(candidate))break;
        }
        if(!failed.has(candidate)){index=candidate;sync();}
      });
      gallery.appendChild(btn);
    }
    gallery.appendChild(caption);
    art.appendChild(gallery);
    art.classList.add("photo-active");
    sync();
  }
  const creditsDetail=document.createElement("details");
  creditsDetail.id="photo-credits";
  creditsDetail.innerHTML='<summary>About the location photos</summary><p>Photos are hosted by Wikimedia Commons. The author and licence are displayed on each image and link to its source file. Licences: <a target="_blank" rel="noopener noreferrer" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> and <a target="_blank" rel="noopener noreferrer" href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>. Photos may show earlier visits and shops can change.</p>';
  const footer=$(".footer");footer.parentElement.insertBefore(creditsDetail,footer);
  // 2. Respect the choice: custom suggestions are separate from the existing four.
  SCHEDULES[suggestedName] = {durationMinutes:150,location:""};
  const customCard=document.createElement("article");
  customCard.className="plan-card custom-card";
  customCard.dataset.plan=suggestedName;
  customCard.innerHTML='<div class="plan-art"><span class="art-emoji" aria-hidden="true">💡📍</span></div><div class="plan-body"><div class="smallcaps">Plan 05 · Your call</div><h3>Somewhere else?</h3><p class="plan-sub">Have a café or place you want to try? I’m open to your ideas too.</p><div class="stats"><span>🗓️ Your schedule</span><span>✨ Your choice</span></div><button class="btn secondary choose" type="button">Suggest a place</button></div>';
  const planGrid=$(".plan-grid");planGrid.appendChild(customCard);
  // Helpful details, not a fixed itinerary: each meeting place is just a suggestion.
  Array.from(planGrid.querySelectorAll(".plan-card")).forEach(card=>{
    const info=locationInfo[card.dataset.plan] || openEndedTips;
    const details=document.createElement("details");
    details.className="comfort-tips";
    const summary=document.createElement("summary");
    summary.textContent="📍 Meet-up & weather backup";
    const meeting=document.createElement("p");
    const headingMeet=document.createElement("strong");headingMeet.textContent="Easy meet-up: ";
    meeting.append(headingMeet,document.createTextNode(info.meet));
    const rain=document.createElement("p");
    const headingRain=document.createElement("strong");headingRain.textContent="If it’s hot or rainy: ";
    rain.append(headingRain,document.createTextNode(info.rain));
    const flexible=document.createElement("p");
    flexible.className="comfort-reminder";
    flexible.textContent="Nothing is set in stone — we'll choose the spot and timing together";
    details.append(summary,meeting,rain,flexible);
    const choose=$(".choose",card);
    choose.parentElement.insertBefore(details,choose);
  });
  const customWrap=document.createElement("div");
  customWrap.className="custom-location-wrap hidden";customWrap.id="custom-location-wrap";
  customWrap.innerHTML='<label for="custom-place">📍 Where would you like to go? <span class="optional">(optional)</span></label><input type="text" id="custom-place" maxlength="140" autocomplete="off" placeholder="A café, mall, or somewhere you’ve been wanting to try"><small>Even a rough idea is fine — we can settle the details together.</small>';
  const customInput=$("#custom-place",customWrap);
  const yesForm=$("#yes-form");
  yesForm.parentElement.insertBefore(customWrap,yesForm);
  const preview=document.createElement("div");
  preview.id="location-preview";preview.className="location-preview hidden";
  preview.innerHTML='<h3 id="location-heading">Meeting spot</h3><p class="transit" id="location-transit"></p><div class="selected-comfort"><p><strong>📍 Suggested meet-up</strong><span id="selected-meet"></span></p><p><strong>☔ Heat or rain backup</strong><span id="selected-rain"></span></p><small>Just ideas — we can confirm a meeting point and time together in chat.</small></div><button class="map-preview-button" type="button" id="show-location-map">🗺️ Load map preview</button><iframe id="location-map" title="Map preview of selected date location" loading="lazy" hidden referrerpolicy="no-referrer-when-downgrade"></iframe><div class="map-actions"><a id="location-directions" target="_blank" rel="noopener noreferrer">Open Google Maps ↗</a><a id="location-transit-link" target="_blank" rel="noopener noreferrer">Transit directions ↗</a></div>';
  customWrap.parentElement.insertBefore(preview,yesForm);
  const updateMap=()=>{
    const custom=selectedPlan===suggestedName;
    const supplied=safeText(customInput.value);
    const info=custom ? {...openEndedTips,where:supplied||"Your idea, to be decided",transit:supplied?"We can decide where to meet":"No location needed yet",search:supplied} : locationInfo[selectedPlan];
    if(!info){preview.classList.add("hidden");return;}
    preview.classList.remove("hidden");
    $("#location-heading",preview).textContent=info.where;
    $("#location-transit",preview).textContent=info.transit;
    $("#selected-meet",preview).textContent=info.meet;
    $("#selected-rain",preview).textContent=info.rain;
    const query=info.search ? encodeURIComponent(info.search) : "";
    const iframe=$("#location-map",preview);
    const loadMap=$("#show-location-map",preview);
    const dirs=$("#location-directions",preview);
    const transit=$("#location-transit-link",preview);
    const changed = loadMap.dataset.query !== query;
    loadMap.dataset.query=query;
    dirs.hidden=!query;transit.hidden=!query;
    if (changed) {
      iframe.hidden=true;
      iframe.removeAttribute("src");
      loadMap.hidden=!query;
    }
    if(query){
      dirs.href="https://www.google.com/maps/search/?api=1&query="+query;
      transit.href="https://www.google.com/maps/dir/?api=1&destination="+query+"&travelmode=transit";
    }else {
      loadMap.hidden=true;
      iframe.hidden=true;
      iframe.removeAttribute("src");
    }
  };
  $("#show-location-map",preview).addEventListener("click",()=>{
    const button=$("#show-location-map",preview);
    if(!button.dataset.query)return;
    const iframe=$("#location-map",preview);
    iframe.src="https://maps.google.com/maps?q="+button.dataset.query+"&output=embed";
    iframe.hidden=false;
    button.hidden=true;
  });
  const selectCustom=()=>{
    selectedPlan=suggestedName;
    cards.forEach(card=>{
      card.classList.remove("chosen");
      $(".choose",card).textContent="I like this plan";
    });
    customCard.classList.add("chosen");
    $(".choose",customCard).textContent="Selected!";
    $("#picked-name").textContent="Your own suggestion";
    timeChoice.value="flexible";
    picked.classList.remove("hidden");
    customWrap.classList.remove("hidden");
    setStatus(yesStatus,"");
    updateQuest();updateCalendarTools();updateMap();
    if(typeof celebrate==="function")celebrate(window.innerWidth/2,window.innerHeight*.4,18);
    window.setTimeout(()=>picked.scrollIntoView({behavior:reduceMotion?"auto":"smooth",block:"start"}),80);
  };
  $(".choose",customCard).addEventListener("click",selectCustom);
  cards.forEach(card=>$(".choose",card).addEventListener("click",()=>{
    customCard.classList.remove("chosen");$(".choose",customCard).textContent="Suggest a place";
    customWrap.classList.add("hidden");updateMap();
  }));
  customInput.addEventListener("input",()=>{
    SCHEDULES[suggestedName].location=safeText(customInput.value);
    updateMap();updateCalendarTools();
  });
  // 3. Mobile navigation works alongside normal swipe gestures.
  const mobileControls=document.createElement("div");mobileControls.id="mobile-plan-controls";
  mobileControls.innerHTML='<button type="button" id="plan-prev" aria-label="Previous plan">‹</button><span id="mobile-plan-number">1 of 5</span><button type="button" id="plan-next" aria-label="Next plan">›</button>';
  planGrid.parentElement.insertBefore(mobileControls,planGrid);
  let mobileIndex=0;
  const allCards=()=>$$(".plan-card",planGrid);
  const moveCard=direction=>{
    const list=allCards();mobileIndex=Math.max(0,Math.min(list.length-1,mobileIndex+direction));
    list[mobileIndex].scrollIntoView({behavior:reduceMotion?"auto":"smooth",block:"nearest",inline:"center"});
    $("#mobile-plan-number").textContent=(mobileIndex+1)+" of "+list.length;
  };
  $("#plan-prev").addEventListener("click",()=>moveCard(-1));
  $("#plan-next").addEventListener("click",()=>moveCard(1));
  planGrid.addEventListener("scroll",()=>{
    const list=allCards();const center=planGrid.scrollLeft+planGrid.clientWidth/2;
    let min=Infinity;
    list.forEach((card,i)=>{
      const d=Math.abs(card.offsetLeft+card.offsetWidth/2-center-planGrid.offsetLeft);
      if(d<min){min=d;mobileIndex=i;}
    });
    $("#mobile-plan-number").textContent=(mobileIndex+1)+" of "+list.length;
  },{passive:true});
  // 4. Always-visible skip control on the optional claw machine.
  const skip=document.createElement("button");skip.type="button";skip.id="arcade-skip";skip.textContent="Skip game ↗";skip.title="Go directly to the date plans";
  skip.addEventListener("click",()=>$("#claw-next").click());
  $(".arcade-shell").insertBefore(skip,$(".arcade-shell").firstChild);
  // 6. Confirmation only after Formspree really reports success.
  const confirmation=document.createElement("section");confirmation.id="confirmation";confirmation.className="confirmation-card hidden in";
  confirmation.setAttribute("aria-label","Answer sent successfully");
  confirmation.innerHTML='<div class="top-illustration" aria-hidden="true">📬</div><div class="eyebrow">Message submitted · quest complete!</div><h2 id="confirmation-title" tabindex="-1">Your answer was sent</h2><p id="confirmation-desc">Thanks for taking the time to reply.</p><div id="confirmation-companion" class="confirmation-companion hidden"><span id="confirmation-companion-emoji" aria-hidden="true"></span><p>Your tiny arcade friend tagged along for the adventure. Still a virtual plushie, of course</p></div><div id="confirmation-summary" class="confirmation-summary"></div><p id="confirmation-footnote">Nothing is booked until we confirm together.</p><div class="actions"><a href="#" target="_blank" rel="noopener noreferrer" id="confirmation-calendar" class="btn secondary">Add to Google Calendar ↗</a><button type="button" id="confirmation-restart" class="btn secondary">Change my answer ✎</button></div><p class="confirmation-update-note">Need to correct something? Changing your answer sends a new, clearly labelled update. It does not delete the first message.</p>';
  footer.parentElement.insertBefore(confirmation,footer);
  $("#confirmation-restart").addEventListener("click",()=>{
    if (typeof reopenResponseForEdit !== "function" || !reopenResponseForEdit()) return;
    shownConfirmation=false;
    confirmation.classList.add("hidden");
    show(invite);
  });
  let shownConfirmation=false;
  const displayConfirmation=response=>{
    if(shownConfirmation)return;
    shownConfirmation=true;
    $$("main > section").forEach(section=>section.classList.add("hidden"));
    confirmation.classList.remove("hidden");
    document.body.dataset.scene="confirmation";
    $$(".quest-step").forEach(step=>{step.classList.remove("is-active");step.classList.add("is-done");});
    questHint.textContent="Quest complete · Thanks for sending your answer.";
    const yes=response==="Yes",maybe=response==="Maybe";
    const prizeBox=$("#claw-prize");
    const earnedToy=prizeBox && !prizeBox.classList.contains("hidden") && $("#claw-prize-emoji").textContent.trim();
    const companion=$("#confirmation-companion");
    companion.classList.toggle("hidden",!yes||!earnedToy);
    $("#confirmation-companion-emoji").textContent=yes && earnedToy ? earnedToy : "";
    $("#confirmation-title").textContent=yes?"Your date idea has been sent! ✨":maybe?"Message sent, no rush 🙂":"Thank you for answering 🌷";
    $("#confirmation-desc").textContent=yes?"Your choice was submitted. We can confirm the details together in our chat.":maybe?"Your message was submitted. We can keep chatting and see what feels right.":"Your answer was submitted. Thanks for letting me know.";
    $("#confirmation-footnote").textContent=yes?"Nothing is booked until we both confirm in chat.":maybe?"No rush — we can keep things relaxed.":"No pressure to explain or change your mind.";
    const details=yes ? "Plan: "+selectedPlan+"\nPlace: "+(selectedPlan===suggestedName ? safeText(customInput.value)||"To be decided" : locationInfo[selectedPlan]?.where||selectedPlan)+"\nDate: "+(dateFlexible.checked?"To be decided":formattedDay(dateChoice.value))+"\nTime: "+formattedTime() : maybe ? "Response: Maybe\nNote: "+(safeText($("#maybe-note").value)||"None") : "Response: No, thank you";
    $("#confirmation-summary").textContent=details;
    const event=yes?calendarEvent():null;
    const link=$("#confirmation-calendar");
    if(event){link.style.display="inline-flex";link.href=event.url;}else{link.style.display="none";link.removeAttribute("href");}
    window.scrollTo({top:0,behavior:reduceMotion?"auto":"smooth"});
    $("#confirmation-title").focus({preventScroll:true});
    if(yes)celebrate(window.innerWidth/2,window.innerHeight*.5,28);
  };
  for(const [type,id] of [["Yes","yes-status"],["Maybe","maybe-status"],["No","no-status"]]){
    const status=$("#"+id);
    const handler=()=>{
      if(status.classList.contains("ok")&&status.textContent.includes("Sent successfully"))displayConfirmation(type);
    };
    new MutationObserver(handler).observe(status,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});
  }
  // 7. Cozy evening mode; default stays pastel daylight.
  const toggle=document.createElement("button");toggle.id="theme-toggle";toggle.type="button";
  const setTheme=mode=>{
    const night=mode==="night";
    document.documentElement.dataset.theme=night?"night":"day";
    toggle.textContent=night?"☀️ Day mode":"🌙 Night mode";
    toggle.setAttribute("aria-pressed",String(night));
    const themeMeta=$('meta[name="theme-color"]');
    if(themeMeta)themeMeta.content=night?"#211c2b":"#fff9f4";
    try{localStorage.setItem("dateInviteTheme",night?"night":"day");}catch(e){}
  };
  $("header").appendChild(toggle);
  let savedTheme="day";try{savedTheme=localStorage.getItem("dateInviteTheme")||"day";}catch(e){}
  setTheme(savedTheme);
  toggle.addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="night"?"day":"night"));
  // Optional meme-image easter egg: keeps the invitation uncluttered.
  // Both photos are from Wikimedia Commons; source, author and licence stay visible.
  const memeCards = [
    {
      image:commons("Cat on a laptop.jpg"),
      alt:"A cat lying on a laptop, representing the website maker going overboard.",
      top:"ME: I'LL JUST ASK NORMALLY",
      bottom:"ALSO ME: BUILDS AN ENTIRE WEBSITE",
      author:"Liew0100",licence:"CC BY 3.0",
      licenceUrl:"https://creativecommons.org/licenses/by/3.0/",
      source:"https://commons.wikimedia.org/wiki/File:Cat_on_a_laptop.jpg"
    },
    {
      image:commons("Amazing cat eating.jpg"),
      alt:"A cat eating, expressing enthusiasm for the food part of the date.",
      top:"TRYING TO PICK A DATE PLAN",
      bottom:"OKAY BUT WHERE'S THE FOOD?",
      author:"Usamanadda",licence:"CC0",
      licenceUrl:"https://creativecommons.org/publicdomain/zero/1.0/",
      source:"https://commons.wikimedia.org/wiki/File:Amazing_cat_eating.jpg"
    }
  ];
  const memeDialog=document.createElement("dialog");
  memeDialog.id="meme-dialog";
  memeDialog.className="meme-dialog";
  memeDialog.setAttribute("aria-labelledby","meme-title");
  memeDialog.innerHTML=`
    <div class="meme-inner">
      <div class="meme-bar">
        <span id="meme-title">A tiny meme break</span>
        <button type="button" id="meme-close" aria-label="Close memes">Close ×</button>
      </div>
      <figure class="meme-figure">
        <div class="meme-visual">
          <img id="meme-image" alt="" decoding="async" />
          <div id="meme-fallback" class="meme-fallback" hidden aria-hidden="true">🐈</div>
          <div class="meme-scrim" aria-hidden="true"></div>
          <span id="meme-top" class="meme-caption meme-top"></span>
          <span id="meme-bottom" class="meme-caption meme-bottom"></span>
        </div>
        <figcaption class="meme-credit">Photo: <a id="meme-source" href="" target="_blank" rel="noopener noreferrer"></a>
        · <a id="meme-licence" href="" target="_blank" rel="noopener noreferrer"></a>
        · Caption added for this invitation</figcaption>
      </figure>
      <div class="meme-controls">
        <button type="button" id="meme-previous" aria-label="Previous meme">← Previous</button>
        <span id="meme-counter" aria-live="polite">1 of 2</span>
        <button type="button" id="meme-next" aria-label="Next meme">Next →</button>
      </div>
      <p class="meme-disclaimer">Just some silly extras. Back to the actual question whenever you like :)</p>
    </div>`;
  document.body.appendChild(memeDialog);
  let memeIndex=0;
  const memeImage=$("#meme-image",memeDialog);
  const memeFallback=$("#meme-fallback",memeDialog);
  memeImage.addEventListener("error",()=>{
    memeImage.hidden=true;
    memeFallback.hidden=false;
  });
  memeImage.addEventListener("load",()=>{
    memeImage.hidden=false;
    memeFallback.hidden=true;
  });
  const selectMeme=i=>{
    memeIndex=(i+memeCards.length)%memeCards.length;
    const m=memeCards[memeIndex];
    $("#meme-top",memeDialog).textContent=m.top;
    $("#meme-bottom",memeDialog).textContent=m.bottom;
    $("#meme-counter",memeDialog).textContent=(memeIndex+1)+" of "+memeCards.length;
    const source=$("#meme-source",memeDialog);
    source.textContent=m.author;
    source.href=m.source;
    const licence=$("#meme-licence",memeDialog);
    licence.textContent=m.licence;
    licence.href=m.licenceUrl;
    memeFallback.hidden=true;
    memeImage.hidden=false;
    memeImage.alt=m.alt;
    memeImage.src=m.image;
  };
  const openMeme=i=>{
    selectMeme(i);
    if(typeof memeDialog.showModal==="function")memeDialog.showModal();
    else memeDialog.setAttribute("open","");
    $("#meme-close",memeDialog).focus();
  };
  $("#mail-sticker").addEventListener("click",()=>openMeme(0));
  $("#easter-egg").addEventListener("click",()=>openMeme(1));
  $("#meme-close",memeDialog).addEventListener("click",()=>{
    if(memeDialog.close)memeDialog.close();
    else memeDialog.removeAttribute("open");
  });
  memeDialog.addEventListener("click",e=>{
    if(e.target===memeDialog){
      if(memeDialog.close)memeDialog.close();
      else memeDialog.removeAttribute("open");
    }
  });
  $("#meme-next",memeDialog).addEventListener("click",()=>selectMeme(memeIndex+1));
  $("#meme-previous",memeDialog).addEventListener("click",()=>selectMeme(memeIndex-1));

})();