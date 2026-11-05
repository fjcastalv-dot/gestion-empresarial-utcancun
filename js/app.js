/* Lógica del sitio. Normalmente no necesitas editar este archivo. */
/* ================= UTILIDADES ================= */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const day = iso => { const [y,m,d] = iso.split("-").map(Number); return new Date(y, m-1, d); };
const today = (() => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); })();
const store = {get(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch(e){return f}}, set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let toastT;
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),2200)}
const ICON_MAIL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
const ICON_TEL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>';
const ICON_COPY='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>';
document.addEventListener("click", e => {
  const b = e.target.closest("[data-copy]"); if(!b) return;
  const v = b.dataset.copy;
  const done = () => toast("Copiado: " + v);
  try { navigator.clipboard.writeText(v).then(done, () => toast(v)); } catch(err){ toast(v); }
});

/* ================= RUTA (Inicio) ================= */
$("#agendaBtn").href = AGENDA_URL;
document.querySelectorAll("[data-fecha-lista]").forEach(el => el.textContent = FECHA_LISTA);

(function buildRoute(){
  const labels=["Inducción","Elige tu empresa","Carta de presentación","Registro de estadía","Entrega de carta","Encuestas de egresados","Documentos en tu división","Evaluación académica","Carta de liberación","Entrega final"];
  const short=["Inducción","Empresa","Carta","Registro","Entrega","Encuestas","Documentos","Evaluación","Liberación","Entrega final"];
  const svg=document.querySelector(".route-svg"), track=svg.querySelector(".track"), draw=svg.querySelector(".draw"), g=$("#stops");
  const mq=matchMedia("(max-width:560px)");
  function layout(){
    let d, pts, lab, h="";
    if(mq.matches){
      // Celular: ruta vertical, una parada por renglón y etiquetas completas
      const top=22, gap=40, x=26;
      pts=labels.map((_,i)=>[x, top+i*gap]);
      d=`M${x} ${top} V${top+9*gap}`;
      svg.setAttribute("viewBox",`0 0 300 ${top*2+9*gap}`);
      svg.classList.add("vertical");
      pts.forEach(([px,py],i)=>{
        h+=`<g class="stop${i===9?" final":""}" style="--k:${i}"><circle cx="${px}" cy="${py}" r="13"/><text class="n" x="${px}" y="${py+4.5}" text-anchor="middle">${i+1}</text><text x="${px+26}" y="${py+5}" text-anchor="start">${labels[i]}</text></g>`;
      });
    } else {
      // Escritorio: fila superior →, curva derecha, fila media ←, fila inferior → (final)
      pts=[[56,40],[141,40],[226,40],[311,40],[385,82],[311,125],[226,125],[141,125],[56,125],[360,210]];
      d="M56 40 H360 Q385 40 385 65 V100 Q385 125 360 125 H40 Q14 125 14 151 V184 Q14 210 40 210 H360";
      svg.setAttribute("viewBox","0 0 400 236");
      svg.classList.remove("vertical");
      pts.forEach(([x,y],i)=>{
        const fin=i===9, side=(i===4);
        const tx = side ? x-22 : (fin ? x+13 : x), ty = side ? y+4 : (fin ? y-22 : y+28), anchor = side||fin ? "end" : "middle";
        h+=`<g class="stop${fin?" final":""}" style="--k:${i}"><circle cx="${x}" cy="${y}" r="13"/><text class="n" x="${x}" y="${y+4.5}" text-anchor="middle">${i+1}</text><text x="${tx}" y="${ty}" text-anchor="${anchor}">${short[i]}</text></g>`;
      });
    }
    track.setAttribute("d",d); draw.setAttribute("d",d);
    g.innerHTML=h;
    draw.style.setProperty("--len", Math.ceil(draw.getTotalLength()));
  }
  layout();
  (mq.addEventListener ? mq.addEventListener("change",layout) : mq.addListener(layout));
  // Al pasar el mouse (o tocar en celular) se vuelve a dibujar la ruta
  const card=document.querySelector(".route-card"); let busyUntil=0;
  const replay=()=>{
    if(matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const now=performance.now(); if(now<busyUntil) return; busyUntil=now+2900;
    card.querySelectorAll(".draw,.stop").forEach(el=>{ el.style.animation="none"; void el.getBoundingClientRect(); el.style.animation=""; });
    card.classList.add("replay");
  };
  card.addEventListener("mouseenter",replay);
  card.addEventListener("click",replay);
})();

/* ================= PRÓXIMA FECHA ================= */
(function nextDate(){
  const dated = STEPS.filter(s=>s.s);
  const cur = dated.find(s => day(s.s) <= today && today <= day(s.e));
  const nxt = dated.find(s => day(s.s) > today);
  const box = $("#nextBox");
  const f = s => s.m ? s.t : `Paso ${s.n}: ${s.t}`;
  if (cur) {
    const left = Math.round((day(cur.e)-today)/864e5);
    box.innerHTML = `<div class="next"><div class="days num">${left}<small>${left===1?"día restante":"días restantes"}</small></div><div><span class="eyebrow">En curso</span><h3>${esc(f(cur))}</h3><p class="meta num">${esc(cur.w)}</p></div><a class="btn btn-primary" href="#estadias">Ver detalles</a></div>`;
  } else if (nxt) {
    const n = Math.round((day(nxt.s)-today)/864e5);
    box.innerHTML = `<div class="next"><div class="days num">${n}<small>${n===1?"día":"días"}</small></div><div><span class="eyebrow">Próxima fecha</span><h3>${esc(f(nxt))}</h3><p class="meta num">${esc(nxt.w)}</p></div><a class="btn btn-primary" href="#estadias">Ver calendario</a></div>`;
  } else {
    box.innerHTML = `<div class="next"><div class="days">✓</div><div><span class="eyebrow">Periodo concluido</span><h3>El periodo enero–abril 2027 terminó</h3><p class="meta">Pronto publicaremos la agenda del siguiente periodo.</p></div></div>`;
  }
  const a=day("2027-01-07"), b=day("2027-04-16");
  const p=Math.max(0,Math.min(1,(today-a)/(b-a)));
  $("#periodTxt").textContent = today<a ? `Faltan ${Math.round((a-today)/864e5)} días para iniciar` : (today>b ? "Periodo concluido" : `${Math.round(p*100)}% del periodo`);
  requestAnimationFrame(()=>setTimeout(()=>$("#periodFill").style.setProperty("--p",(p*100)+"%"),300));
})();

/* ================= TIMELINE ================= */
(function timeline(){
  const firstFuture = STEPS.findIndex(s => s.s && day(s.e) >= today);
  $("#timeline").innerHTML = STEPS.map((s,i)=>{
    const past = s.e && day(s.e) < today;
    const now = i===firstFuture;
    const cls = ["step", s.m?"milestone":"", past?"past":"", now?"now":""].join(" ");
    const link = s.link ? ` <a href="${s.link[0]}">${s.link[1]}</a>` : "";
    return `<div class="${cls}" data-n="${s.n||""}"><h4>${esc(s.t)}${now?'<span class="tag">Sigue</span>':""}</h4><span class="when num">${esc(s.w)}</span>${s.d?`<p>${esc(s.d)}${link}</p>`:""}</div>`;
  }).join("");
})();

/* ================= CHECKLIST ================= */
(function checklist(){
  let st = store.get("ge-check", []);
  const box = $("#checklist");
  const render = () => {
    box.innerHTML = CHECK.map((c,i)=>`<label for="ck${i}"><input type="checkbox" id="ck${i}" data-i="${i}" ${st.includes(i)?"checked":""}><span>${esc(c)}</span></label>`).join("");
    upd();
  };
  const upd = () => { const n=st.length; $("#checkTxt").textContent=`${n} de ${CHECK.length}`; $("#checkFill").style.setProperty("--p",(n/CHECK.length*100)+"%"); };
  box.addEventListener("change", e => { const i=+e.target.dataset.i; st = e.target.checked ? [...new Set([...st,i])] : st.filter(x=>x!==i); store.set("ge-check",st); upd(); if(st.length===CHECK.length) toast("¡Completaste todas las actividades!"); });
  $("#checkReset").addEventListener("click",()=>{st=[];store.set("ge-check",st);render();});
  render();
})();

/* ================= VACANTES ================= */
(function vacantes(){
  let f="";
  const chips=$("#vacChips");
  chips.innerHTML = `<button class="chip-btn" type="button" data-d="" aria-pressed="true">Todas</button>` + Object.entries(DIVS).map(([k,v])=>`<button class="chip-btn" type="button" data-d="${k}" aria-pressed="false" style="--c:${v.c}"><span class="dot"></span>${v.n}</button>`).join("");
  const divsOf = v => [].concat(v.div||[]).filter(k=>DIVS[k]);
  const MESES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const fFecha = iso => { const d=day(iso); return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`; };
  const lista = (t,arr) => arr&&arr.length ? `<div class="vac-block"><h4>${t}</h4><ul>${arr.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>` : "";
  const render=()=>{
    const list = VACANTES.filter(v=>!f||divsOf(v).includes(f));
    $("#vacCount").textContent = `${list.length} ${list.length===1?"vacante":"vacantes"}`;
    $("#vacList").innerHTML = list.length ? list.map((v,i)=>{
      const ds=divsOf(v); const c=ds.length?DIVS[ds[0]].c:"var(--green)";
      const subj=encodeURIComponent(`Postulación para vacante ${v.puesto}`);
      const body=encodeURIComponent(`Hola, equipo de Bolsa de Trabajo UT Cancún:\r\n\r\nMe interesa postularme a la vacante "${v.puesto}" de ${v.empresa}.\r\n\r\nAutorizo que se comparta mi CV para la vacante.\r\n\r\n>> IMPORTANTE: antes de enviar este correo, anexa tu CV en formato PDF.\r\n`);
      const pills=[v.ubicacion,v.modalidad,v.dirigida].filter(Boolean).map(x=>`<span class="pill">${esc(x)}</span>`).join("");
      // Si la vacante tiene cartel, la información ya está en él y no se muestra "Ver detalles"
      const det = lista("Funciones",v.funciones)+lista("Requisitos",v.requisitos)+lista("Ofrecemos",v.ofrecemos);
      const flyer = v.flyer ? `<button class="flyer" type="button" data-flyer="${esc(v.flyer)}" data-cap="${esc(v.puesto)} · ${esc(v.empresa)}" aria-label="Ampliar cartel: ${esc(v.puesto)}"><img src="${esc(v.flyer)}" alt="Cartel de la vacante ${esc(v.puesto)} de ${esc(v.empresa)}" loading="lazy"><span class="zoom"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/></svg>Ampliar</span></button>` : "";
      return `<article class="vac${v.flyer?" has-flyer":""}" style="--c:${c};animation:fadeIn .5s ${i*80}ms both var(--ease)">${flyer}<div class="vac-info">
        <div class="facts">${v.ejemplo?'<span class="pill ex">Ejemplo</span>':""}${ds.map(k=>`<span class="pill div" style="--c:${DIVS[k].c}">${esc(DIVS[k].n)}</span>`).join("")}</div>
        <h3>${esc(v.puesto)}</h3><p class="co">${esc(v.empresa)}${v.fecha?`<span class="pub num">Publicada el ${fFecha(v.fecha)}</span>`:""}</p>
        ${v.sueldo?`<p class="pay num">${esc(v.sueldo)}</p>`:""}
        ${pills?`<div class="facts">${pills}</div>`:""}
        ${det && !v.flyer?`<details class="vac-more"><summary>Ver detalles</summary><div class="vac-body">${det}</div></details>`:""}
        <div class="vac-foot"><a class="btn btn-primary" href="mailto:bolsadetrabajo@utcancun.edu.mx?subject=${subj}&body=${body}" aria-label="Postularme a ${esc(v.puesto)}">Postularme</a><p class="note">Se abre tu correo con el asunto listo. Recuerda anexar tu CV. <a href="#privacidad">Aviso de privacidad</a></p></div></div></article>`;
    }).join("") : `<div class="empty" style="grid-column:1/-1">No hay vacantes publicadas para esta división por ahora. Únete al canal de WhatsApp de Bolsa de Trabajo para enterarte primero.</div>`;
  };
  // Visor del cartel a pantalla completa
  const lb=$("#lightbox"), lbImg=$("#lbImg"), lbCap=$("#lbCap");
  $("#vacList").addEventListener("click",e=>{
    const b=e.target.closest("[data-flyer]"); if(!b) return;
    lbImg.src=b.dataset.flyer; lbImg.alt="Cartel: "+b.dataset.cap; lbCap.textContent=b.dataset.cap;
    if(lb.showModal){ lb.showModal(); } else { window.open(b.dataset.flyer,"_blank","noopener"); }
  });
  const closeLb=()=>{ if(!lb.open) return; lb.classList.add("closing"); setTimeout(()=>{lb.classList.remove("closing"); lb.close();},220); };
  $("#lbClose").addEventListener("click",closeLb);
  lb.addEventListener("click",e=>{ if(e.target===lb) closeLb(); });
  lb.addEventListener("cancel",e=>{ e.preventDefault(); closeLb(); });
  chips.addEventListener("click",e=>{const b=e.target.closest("[data-d]");if(!b)return;f=b.dataset.d;chips.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));render();});
  render();
})();

/* ================= EMPRESAS ================= */
(function empresas(){
  const PAGE=60; let shown=PAGE; let selDiv="";
  const idx = EMPRESAS.map(e=>({...e, k:norm(e.n+" "+e.g+" "+e.s)}));
  $("#countDoor").textContent = EMPRESAS.length.toLocaleString("es-MX");
  (function intro(){
    const nGiros = new Set(EMPRESAS.map(e=>e.s)).size;
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const countUp = (el,to) => { if(reduce){el.textContent=to.toLocaleString("es-MX");return}
      const t0=performance.now(), d=1400; const f=t=>{const k=Math.min(1,(t-t0)/d), e=1-Math.pow(1-k,3); el.textContent=Math.round(to*e).toLocaleString("es-MX"); if(k<1) requestAnimationFrame(f)}; requestAnimationFrame(f); };
    window.__introCount = () => { countUp($("#stEmp"),EMPRESAS.length); countUp($("#stGiro"),nGiros); };
    const pick = (start) => EMPRESAS.filter((_,i)=>i%23===start).slice(0,26).map(e=>`<span>${esc(e.n)}</span>`).join("");
    const a=pick(3), b=pick(14);
    $("#tick1").innerHTML = a+a; $("#tick2").innerHTML = b+b;
  })();
  const count = (key) => idx.reduce((m,e)=>(m[e[key]]=(m[e[key]]||0)+1,m),{});
  const giros = count("s"); const ubis = count("u");
  $("#fGiro").innerHTML += Object.keys(giros).sort((a,b)=>a==="Otros servicios"?1:b==="Otros servicios"?-1:a.localeCompare(b,"es")).map(g=>`<option value="${esc(g)}">${esc(g)} (${giros[g]})</option>`).join("");
  $("#fUbi").innerHTML += Object.keys(ubis).sort((a,b)=>a==="Por confirmar"?1:b==="Por confirmar"?-1:ubis[b]-ubis[a]).map(u=>`<option value="${esc(u)}">${esc(u)} (${ubis[u]})</option>`).join("");
  const chips=$("#divChips");
  chips.innerHTML = `<button class="chip-btn" type="button" data-d="" aria-pressed="true">Todas las divisiones</button>` + Object.entries(DIVS).map(([k,v])=>`<button class="chip-btn" type="button" data-d="${k}" aria-pressed="false" style="--c:${v.c}"><span class="dot"></span>${v.n}</button>`).join("");
  const saved = store.get("ge-filters", {});
  if (saved.q) $("#q").value=saved.q; if (saved.g && giros[saved.g]) $("#fGiro").value=saved.g; if (saved.u && ubis[saved.u]) $("#fUbi").value=saved.u;
  if (saved.d && DIVS[saved.d]) { selDiv=saved.d; chips.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.d===selDiv)); }
  let list=[];
  function filter(){
    const q=norm($("#q").value.trim()), g=$("#fGiro").value, u=$("#fUbi").value;
    const terms=q.split(/\s+/).filter(Boolean);
    list = idx.filter(e=>(!g||e.s===g)&&(!u||e.u===u)&&(!selDiv||e.d.includes(selDiv))&&terms.every(t=>e.k.includes(t)));
    store.set("ge-filters",{q:$("#q").value,g,u,d:selDiv});
    shown=PAGE; render(true);
  }
  function card(e,i){
    const dots=e.d.map(k=>`<i style="--c:${DIVS[k].c}" title="${DIVS[k].n}"></i>`).join("");
    return `<article class="co-card" style="--i:${i%PAGE}"><h3>${esc(e.n)}</h3><p class="giro">${esc(e.g)}</p><div class="row"><span class="pill">${esc(e.s)}</span>${e.u!=="Por confirmar"?`<span class="pill">${esc(e.u)}</span>`:""}<span class="divdots" aria-label="Divisiones afines: ${e.d.map(k=>DIVS[k].n).join(", ")}">${dots}</span></div></article>`;
  }
  function render(reset){
    const box=$("#coList");
    const slice=list.slice(0,shown);
    if(reset) box.innerHTML = slice.map(card).join("");
    else box.insertAdjacentHTML("beforeend", list.slice(shown-PAGE,shown).map(card).join(""));
    $("#resCount").innerHTML = list.length ? `Mostrando <b class="num">${Math.min(shown,list.length).toLocaleString("es-MX")}</b> de <b class="num">${list.length.toLocaleString("es-MX")}</b> empresas` : "";
    if(!list.length) box.innerHTML = `<div class="empty" style="grid-column:1/-1">No encontramos empresas con esos filtros. Prueba con otra palabra o <a href="#vincular">solicita la vinculación</a> de la empresa que buscas.</div>`;
    $("#moreBtn").hidden = shown>=list.length;
  }
  let t; $("#q").addEventListener("input",()=>{clearTimeout(t);t=setTimeout(filter,160)});
  $("#fGiro").addEventListener("change",filter); $("#fUbi").addEventListener("change",filter);
  chips.addEventListener("click",e=>{const b=e.target.closest("[data-d]");if(!b)return;selDiv=b.dataset.d;chips.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));filter();});
  $("#moreBtn").addEventListener("click",()=>{shown+=PAGE;render(false)});
  $("#clearF").addEventListener("click",()=>{$("#q").value="";$("#fGiro").value="";$("#fUbi").value="";selDiv="";chips.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.d===""));filter();});
  filter();
})();

/* ================= CONTACTOS ================= */
(function people(){
  const line = p => {
    const telHref = `tel:${TEL},${p.ext.split(" ")[0]}`;
    return `<div class="line"><a href="mailto:${p.mail}">${ICON_MAIL}<span>${p.mail}</span></a><button class="copy" type="button" data-copy="${p.mail}" aria-label="Copiar correo ${p.mail}">${ICON_COPY}</button></div>` +
      (p.ext ? `<div class="line"><a href="${telHref}">${ICON_TEL}<span class="num">(998) 881-1900 ext. ${p.ext}</span></a><button class="copy" type="button" data-copy="(998) 881-1900 ext. ${p.ext}" aria-label="Copiar teléfono">${ICON_COPY}</button></div>` : "");
  };
  $("#peopleGE").innerHTML = PEOPLE_GE.map(p=>`<div class="person${p.feature?" feature":""}"><span class="role">${esc(p.role)}</span><h3>${esc(p.name)}</h3>${line(p)}</div>`).join("");
  $("#peopleDiv").innerHTML = PEOPLE_DIV.map(p=>`<div class="person" style="--c:${p.c}"><span class="role">${esc(p.role)}</span><h3>${esc(p.name)}</h3>${line({...p,ext:""})}</div>`).join("");
})();

/* ================= NAVEGACIÓN ================= */
const VIEWS=["inicio","estadias","bolsa","empresas","vincular","contacto","privacidad"];
function show(name, scroll){
  if(!VIEWS.includes(name)) name="inicio";
  document.querySelectorAll(".view").forEach(v=>{const on=v.dataset.view===name; v.hidden=!on; v.classList.remove("enter"); if(on){void v.offsetWidth; v.classList.add("enter");}});
  const navName = name==="vincular" ? "empresas" : name;
  document.querySelectorAll("[data-nav]").forEach(a=>{ if(a.dataset.nav===navName) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
  $("#nav").classList.remove("open"); $("#burger").setAttribute("aria-expanded","false");
  if(name==="inicio" && window.__introCount) window.__introCount();
  if(scroll) window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});
  document.title = ({inicio:"Gestión Empresarial UT Cancún",estadias:"Estadías · Gestión Empresarial",bolsa:"Bolsa de trabajo · Gestión Empresarial",empresas:"Empresas vinculadas · Gestión Empresarial",vincular:"Vincular empresa · Gestión Empresarial",contacto:"Contáctanos · Gestión Empresarial",privacidad:"Avisos de privacidad · Gestión Empresarial"})[name];
}
document.addEventListener("click", e=>{
  const a=e.target.closest('a[href^="#"]'); if(!a) return;
  const name=a.getAttribute("href").slice(1); if(!VIEWS.includes(name)) return;
  e.preventDefault(); try{history.pushState(null,"","#"+name)}catch(err){} show(name,true);
});
window.addEventListener("popstate",()=>show(location.hash.slice(1),false));
window.addEventListener("hashchange",()=>show(location.hash.slice(1),true));
$("#burger").addEventListener("click",()=>{const o=$("#nav").classList.toggle("open");$("#burger").setAttribute("aria-expanded",o)});
show(location.hash.slice(1)||"inicio",false);

/* ================= CABECERA: se oculta al bajar, reaparece al subir ================= */
(function autoHideHeader(){
  const top=document.querySelector(".top"); let lastY=window.scrollY, ticking=false;
  function update(){
    const y=window.scrollY, dy=y-lastY;
    const menuOpen=$("#nav").classList.contains("open");
    if(y<140||menuOpen){ setHidden(false); }
    else if(dy>6){ setHidden(true); }
    else if(dy<-6){ setHidden(false); }
    if(Math.abs(dy)>6) lastY=y;
    ticking=false;
  }
  function setHidden(h){ top.classList.toggle("is-hidden",h); document.body.classList.toggle("header-hidden",h); }
  window.addEventListener("scroll",()=>{ if(!ticking){ ticking=true; requestAnimationFrame(update); } },{passive:true});
  top.addEventListener("focusin",()=>setHidden(false));
})();

/* ================= AVISOS DE PRIVACIDAD: abrir / cerrar todos ================= */
(function privacidad(){
  const btn=$("#privToggle"); if(!btn) return;
  const all=()=>[...document.querySelectorAll("details.priv")];
  const sync=()=>{ btn.textContent = all().every(d=>d.open) ? "Cerrar todos" : "Abrir todos"; };
  btn.addEventListener("click",()=>{ const open=!all().every(d=>d.open); all().forEach(d=>d.open=open); sync(); });
  all().forEach(d=>d.addEventListener("toggle",sync));
})();
