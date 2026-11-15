/* clickjacking guard: if another site puts this page inside a frame, break out (or hide the page) */
(function () { try { if (window.top !== window.self) { var same = false; try { same = !!window.top.location.href; } catch (e) {} if (!same) { try { window.top.location = window.location.href; } catch (e) { document.documentElement.style.display = "none"; } } } } catch (e) {} })();
/* 치영의 교회 생활 즐기기 — 낮/밤 전환 (사이트 공용)
   html 에 sc-day / sc-dusk / sc-night 클래스를 붙인다. 그림은 각 페이지(scene.js, 홈)의 CSS가 맡음.
   주소 끝에 ?night ?dusk ?day 를 붙이면 강제로 볼 수 있음. */
(function () {
  if (window.siteScene) return;
  /* ---- 낮/밤: 해의 고도로 판단 ----
     밤  = 해가 지평선 아래 12° 보다 낮을 때 (EENT 이후 ~ BMNT 이전, 항해박명 기준)
     여명/노을 = -12° ~ 0° (BMNT~일출, 일몰~EENT)
     낮  = 해가 떠 있을 때
     위치는 기본 서울, 브라우저 위치 권한이 이미 허용된 경우에만 실제 위치를 씀 (묻지 않음) */
  var LOC = { lat: 37.5665, lon: 126.978 };
  function sunAlt(date, lat, lon) {
    var rad = Math.PI / 180, n = (date.getTime() - 946728000000) / 86400000;
    var g = (357.529 + 0.98560028 * n) * rad, q = 280.459 + 0.98564736 * n;
    var L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rad, e = (23.439 - 0.00000036 * n) * rad;
    var ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)), dec = Math.asin(Math.sin(e) * Math.sin(L));
    var gmst = ((18.697374558 + 24.06570982441908 * n) % 24 + 24) % 24;
    var ha = (gmst * 15 + lon) * rad - ra;
    return Math.asin(Math.sin(lat * rad) * Math.sin(dec) + Math.cos(lat * rad) * Math.cos(dec) * Math.cos(ha)) / rad;
  }
  /* 오늘의 BMNT / EENT 시각 (분 단위로 훑어서 찾음) */
  function twilight(date) {
    var day = new Date(date); day.setHours(0, 0, 0, 0); var prev = null, out = {};
    for (var m = 0; m <= 1440; m += 2) {
      var t = new Date(day.getTime() + m * 60000), a = sunAlt(t, LOC.lat, LOC.lon);
      if (prev !== null) { if (prev < -12 && a >= -12) out.bmnt = t; if (prev >= -12 && a < -12) out.eent = t; }
      prev = a;
    }
    return out;
  }
  var forced = /[?&](night|day|dusk)\b/.exec(location.search);
  function phase() {
    if (forced) return forced[1];
    var a = sunAlt(new Date(), LOC.lat, LOC.lon);
    return a < -12 ? "night" : a < 0 ? "dusk" : "day";
  }
  var root = document.documentElement;
  var st = document.createElement("style"); st.textContent = "html.sc-night .sc-sky{color:#fff6e2!important;text-shadow:0 2px 0 rgba(0,0,0,.35)}"; document.head.appendChild(st);
  function apply() {
    var p = phase();
    root.classList.toggle("sc-night", p === "night"); root.classList.toggle("sc-dusk", p === "dusk"); root.classList.toggle("sc-day", p === "day");
    root.setAttribute("data-scene", p);
    if (p === "night") markSky();
  }
  /* 밤에는 어두운 하늘·풀밭 위에 바로 놓인 어두운 글자를 밝게 바꿈.
     글자마다 위로 올라가며 "제 배경을 가진 상자(카드·버튼·말풍선 등)" 안에 있는지 보고, 아니면 밝은 색으로. */
  var memo = null;
  function solid(el) {
    if (memo.has(el)) return memo.get(el);
    var c = getComputedStyle(el), v = false;
    if (c.backgroundImage && c.backgroundImage !== "none") v = true;
    else { var m = c.backgroundColor.match(/[\d.]+/g); if (m && (m.length < 4 ? true : +m[3] >= 0.35) && !/^rgba\(0, 0, 0, 0\)$/.test(c.backgroundColor) && c.backgroundColor !== "transparent") v = true; }
    memo.set(el, v); return v;
  }
  function onSky(el) {
    for (var a = el; a && a !== document.body && a !== root; a = a.parentElement) {
      if (a.id === "scene") return false;
      if (solid(a)) return false;
    }
    return true;
  }
  function dark(col) { var m = col.match(/[\d.]+/g); if (!m) return false; if (m.length > 3 && +m[3] < 0.2) return false; return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 < 0.45; }
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1, svg: 1, SVG: 1, CANVAS: 1 };
  function markSky() {
    if (!document.body) return;
    memo = new Map();
    var seen = new Set(), tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n;
    while ((n = tw.nextNode())) {
      if (!n.nodeValue || !/\S/.test(n.nodeValue)) continue;
      var el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
      if (SKIP[el.tagName] || el.closest("svg,#scene")) continue;
      if (el.classList.contains("sc-sky")) continue;
      var cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (dark(cs.color) && onSky(el)) el.classList.add("sc-sky");
    }
    memo = null;
  }
  /* 나중에 그려지는 글자(검색 결과, 목록 등)도 밤이면 다시 살핌 */
  var mt = null;
  try {
    new MutationObserver(function () { if (!root.classList.contains("sc-night")) return; clearTimeout(mt); mt = setTimeout(markSky, 300); })
      .observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}
  apply();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply); else setTimeout(apply, 0);
  setTimeout(apply, 1500);
  setInterval(apply, 60000);
  try {
    if (!forced && navigator.permissions && navigator.geolocation) navigator.permissions.query({ name: "geolocation" }).then(function (r) {
      if (r.state === "granted") navigator.geolocation.getCurrentPosition(function (pos) { LOC = { lat: pos.coords.latitude, lon: pos.coords.longitude, mine: true }; apply(); weather(true); }, function () {}, { maximumAge: 3600000 });
    }).catch(function () {});
  } catch (e) {}

  /* ================= 실제 날씨 =================
     맑음·구름·흐림·안개·비·많은 비·눈·뇌우 를 html 클래스(wx-…)로 붙이고, 비·눈은 하늘 위에 그린다.
     날씨 정보: Open-Meteo → (안 되면) met.no → (안 되면) wttr.in. 30분마다 새로. 주소에 ?rain ?snow ?storm ?fog ?cloudy ?overcast ?clear 로 미리 보기 */
  var WX_LABEL = { clear: "맑음", cloudy: "구름 조금", overcast: "흐림", fog: "안개", rain: "비", heavy: "많은 비", snow: "눈", storm: "뇌우" };
  var WX_ICON = { clear: "☀️", cloudy: "⛅", overcast: "☁️", fog: "🌫️", rain: "🌧️", heavy: "🌧️", snow: "❄️", storm: "⛈️" };
  var wxForced = /[?&](clear|cloudy|overcast|fog|rain|heavy|snow|storm)\b/.exec(location.search);
  function wmo(c) { c = +c; if (c >= 95) return "storm"; if ((c >= 71 && c <= 77) || c === 85 || c === 86) return "snow"; if (c === 65 || c === 67 || c === 82) return "heavy"; if ((c >= 51 && c <= 67) || (c >= 80 && c <= 82)) return "rain"; if (c === 45 || c === 48) return "fog"; if (c === 3) return "overcast"; if (c === 1 || c === 2) return "cloudy"; return "clear"; }
  function byWords(s) { s = String(s || "").toLowerCase(); if (/thunder/.test(s)) return "storm"; if (/snow|sleet|blizzard|ice pellet/.test(s)) return "snow"; if (/heavy ?rain|torrential/.test(s)) return "heavy"; if (/rain|drizzle|shower/.test(s)) return "rain"; if (/fog|mist|haze/.test(s)) return "fog"; if (/partly|fair|few/.test(s)) return "cloudy"; if (/overcast|cloudy/.test(s)) return "overcast"; return "clear"; }
  function tfetch(u, ms) { var c = new AbortController(); var t = setTimeout(function () { c.abort(); }, ms || 7000); return fetch(u, { signal: c.signal }).then(function (r) { clearTimeout(t); if (!r.ok) throw new Error(r.status); return r.json(); }); }
  function getWeather() {
    var la = LOC.lat.toFixed(2), lo = LOC.lon.toFixed(2);   /* 위치는 약 1km 정도로만 */
    return tfetch("https://api.open-meteo.com/v1/forecast?latitude=" + la + "&longitude=" + lo + "&current=weather_code,temperature_2m&timezone=auto")
      .then(function (d) { return { kind: wmo(d.current.weather_code), temp: d.current.temperature_2m }; })
      .catch(function () { return tfetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=" + la + "&lon=" + lo).then(function (d) { var t = d.properties.timeseries[0].data; var sym = (t.next_1_hours || t.next_6_hours || { summary: {} }).summary.symbol_code || ""; return { kind: byWords(sym.replace(/_/g, " ").replace(/clearsky/, "clear").replace(/heavyrain/, "heavy rain")), temp: t.instant.details.air_temperature }; }); })
      .catch(function () { return tfetch("https://wttr.in/" + la + "," + lo + "?format=j1").then(function (d) { var c = d.current_condition[0]; return { kind: byWords(c.weatherDesc && c.weatherDesc[0] && c.weatherDesc[0].value), temp: +c.temp_C }; }); });
  }
  var WX = null, wxHost = null, wxCv = null, wxRaf = 0, drops = [];
  function setWx(w) {
    WX = w; ["clear", "cloudy", "overcast", "fog", "rain", "heavy", "snow", "storm"].forEach(function (k) { root.classList.toggle("wx-" + k, w && w.kind === k); });
    root.classList.toggle("wx-wet", !!w && /rain|heavy|storm/.test(w.kind));
    mountWx(); startParticles();
    var b = document.getElementById("wxBadge"); if (b && w) { b.textContent = WX_ICON[w.kind] + " " + (LOC.mine ? "우리 동네" : "서울") + " · " + WX_LABEL[w.kind] + (w.temp != null && !isNaN(w.temp) ? " " + Math.round(w.temp) + "℃" : ""); b.hidden = false; }
  }
  function weather(force) {
    if (wxForced) { setWx({ kind: wxForced[1], temp: null }); return; }
    var key = "wx:" + LOC.lat.toFixed(1) + "," + LOC.lon.toFixed(1);
    try { var c = JSON.parse(sessionStorage.getItem(key) || "null"); if (!force && c && Date.now() - c.at < 30 * 60000) { setWx(c.w); return; } } catch (e) {}
    getWeather().then(function (w) { try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), w: w })); } catch (e) {} setWx(w); }).catch(function () { setWx(null); });
  }
  /* 비·눈을 그릴 자리: 다른 페이지는 고정 배경(#scene), 홈은 하늘(.sky) */
  var wst = document.createElement("style");
  wst.textContent =
    ".wx{position:absolute;inset:0;pointer-events:none;overflow:hidden}" +
    ".wx canvas{position:absolute;inset:0;width:100%;height:100%}" +
    ".wx .tint{position:absolute;inset:0;background:#7f8ea3;opacity:0;transition:opacity 2s}" +
    ".wx .fog{position:absolute;inset:0;background:linear-gradient(rgba(235,238,242,.15),rgba(235,238,242,.85) 70%);opacity:0;transition:opacity 2s}" +
    ".wx .flash{position:absolute;inset:0;background:#fff;opacity:0}" +
    "html.wx-cloudy .wx .tint{opacity:.12}html.wx-overcast .wx .tint{opacity:.35}html.wx-fog .wx .tint{opacity:.2}" +
    "html.wx-rain .wx .tint{opacity:.38}html.wx-heavy .wx .tint,html.wx-storm .wx .tint{opacity:.5}html.wx-snow .wx .tint{opacity:.22;background:#b9c3d0}" +
    "html.wx-fog .wx .fog{opacity:1}" +
    "html.wx-storm .wx .flash{animation:wxflash 9s infinite}" +
    "@keyframes wxflash{0%,93%,100%{opacity:0}94%{opacity:.55}95%{opacity:.1}96%{opacity:.45}97%{opacity:0}}" +
    "html.wx-overcast .sun,html.wx-overcast #scene .sun,html.wx-wet .sun,html.wx-wet #scene .sun,html.wx-snow .sun,html.wx-fog .sun{opacity:.08!important}" +
    "html.wx-cloudy .sun{opacity:.75}" +
    "html.sc-night .sun,html.sc-night #scene .sun{opacity:0!important}" +
    "html.wx-overcast .cloud,html.wx-wet .cloud,html.wx-overcast #scene .cl,html.wx-wet #scene .cl{opacity:1;filter:grayscale(.3) brightness(.85)}" +
    "html.sc-night.wx-wet .cloud,html.sc-night.wx-overcast .cloud{opacity:.35}" +
    "#wxBadge{position:absolute;left:12px;top:calc(52px + env(safe-area-inset-top,0px));z-index:6;background:rgba(255,255,255,.85);border:2px solid #3b2a20;border-radius:999px;padding:2px 10px;font-size:13px;color:#3b2a20;white-space:nowrap}" +
    "@media (max-width:560px){#wxBadge{top:auto;bottom:100px;left:10px;font-size:12px}}" +
    "@media (prefers-reduced-motion:reduce){html.wx-storm .wx .flash{animation:none}}";
  document.head.appendChild(wst);
  function mountWx() {
    if (wxHost && wxHost.isConnected) return;
    var host = document.getElementById("scene") || document.querySelector(".sky"); if (!host) return;
    wxHost = document.createElement("div"); wxHost.className = "wx"; wxHost.setAttribute("aria-hidden", "true");
    wxHost.innerHTML = '<div class="tint"></div><div class="fog"></div><canvas></canvas><div class="flash"></div>';
    var title = host.querySelector(".title");
    if (title) host.insertBefore(wxHost, title); else host.appendChild(wxHost);
    if (host.classList.contains("sky") && !document.getElementById("wxBadge")) { var b = document.createElement("div"); b.id = "wxBadge"; b.hidden = true; host.appendChild(b); }
    wxCv = wxHost.querySelector("canvas");
  }
  function startParticles() {
    cancelAnimationFrame(wxRaf); if (!wxCv) return;
    var k = WX && WX.kind, ctx = wxCv.getContext("2d");
    var snow = k === "snow", n = k === "heavy" || k === "storm" ? 220 : k === "rain" ? 120 : snow ? 110 : 0;
    function size() { var r = wxCv.getBoundingClientRect(); wxCv.width = Math.max(1, Math.round(r.width)); wxCv.height = Math.max(1, Math.round(r.height)); }
    size(); ctx.clearRect(0, 0, wxCv.width, wxCv.height); if (!n) return;
    drops = []; for (var i = 0; i < n; i++) drops.push({ x: Math.random() * wxCv.width, y: Math.random() * wxCv.height, s: snow ? 0.4 + Math.random() * 0.9 : 3 + Math.random() * 2.5, l: 10 + Math.random() * 8, r: snow ? 1.5 + Math.random() * 2.5 : 0, w: Math.random() * Math.PI * 2 });
    var still = matchMedia("(prefers-reduced-motion: reduce)").matches, last = performance.now();
    function draw(t) {
      var dt = Math.min(50, t - last) / 16; last = t; var W = wxCv.width, H = wxCv.height;
      if (W !== Math.round(wxCv.getBoundingClientRect().width)) { size(); W = wxCv.width; H = wxCv.height; }
      ctx.clearRect(0, 0, W, H);
      if (snow) { ctx.fillStyle = "rgba(255,255,255,.9)"; drops.forEach(function (d) { if (!still) { d.y += d.s * dt; d.w += 0.02 * dt; d.x += Math.sin(d.w) * 0.4 * dt; if (d.y > H + 4) { d.y = -4; d.x = Math.random() * W; } } ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.3); ctx.fill(); }); }
      else { ctx.strokeStyle = root.classList.contains("sc-night") ? "rgba(190,205,235,.55)" : "rgba(90,120,170,.45)"; ctx.lineWidth = k === "rain" ? 1.2 : 1.5; ctx.beginPath();
        drops.forEach(function (d) { if (!still) { d.y += d.s * dt; d.x -= d.s * 0.18 * dt; if (d.y > H + 10) { d.y = -12; d.x = Math.random() * (W + 60); } } ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.l * 0.18, d.y - d.l); }); ctx.stroke(); }
      if (!still) wxRaf = requestAnimationFrame(draw);
    }
    wxRaf = requestAnimationFrame(draw);
  }
  addEventListener("resize", function () { if (WX) startParticles(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { weather(); }); else setTimeout(weather, 0);
  setInterval(function () { weather(); }, 30 * 60000);

  /* ---------- 계절: 3~5월 봄, 6~8월 여름, 9~11월 가을, 12~2월 겨울 (미리보기: ?spring ?summer ?autumn ?winter) ---------- */
  var ssForced = /[?&](spring|summer|autumn|winter)\b/.exec(location.search);
  function season() { if (ssForced) return ssForced[1]; var m = new Date().getMonth() + 1; return m >= 3 && m <= 5 ? "spring" : m >= 6 && m <= 8 ? "summer" : m >= 9 && m <= 11 ? "autumn" : "winter"; }
  var SEASON = season();
  ["spring", "summer", "autumn", "winter"].forEach(function (k) { root.classList.toggle("ss-" + k, k === SEASON); });
  var sst = document.createElement("style");
var P2 = function (ss, a, b) { return "html.ss-" + ss + " .tree.t1 path:not([fill=none]){fill:" + a + "}html.ss-" + ss + " .tree.t2 path:not([fill=none]),html.ss-" + ss + " #scene .tr path:not([fill=none]){fill:" + b + "}"; };
  var R3 = function (sel, a, b, c) { return sel + " circle:nth-of-type(3n+1){fill:" + a + "}" + sel + " circle:nth-of-type(3n+2){fill:" + b + "}" + sel + " circle:nth-of-type(3n){fill:" + c + "}"; };
  sst.textContent =
    /* 봄: 연두 풀밭, 동그란 나무에 벚꽃 */
    P2("spring", "#5fb84e", "#86cf68") + P2("summer", "#2c7a37", "#3d9443") + P2("autumn", "#b98a32", "#d4a246") +
    "html.ss-spring:not(.sc-night){--sky1:#8ad6f6;--grass:#b4e07a;--grass2:#9ccf63;--pen:#cdeb9b;--scene-grass:#b4e07a}" +
    R3("html.ss-spring .tree.t3", "#f7b6cb", "#f9cadb", "#f29dba") + R3("html.ss-spring #scene .tr", "#f7b6cb", "#f9cadb", "#f29dba") +
    /* 여름: 진한 초록, 쨍한 하늘 */
    "html.ss-summer:not(.sc-night){--sky1:#45bdf2;--sky2:#c9eefc;--grass:#79c64c;--grass2:#62b33d;--pen:#a4da72;--scene-grass:#79c64c}" +
    R3("html.ss-summer .tree.t3", "#4fae45", "#62c254", "#45a03c") + R3("html.ss-summer #scene .tr", "#4fae45", "#62c254", "#45a03c") +
    "html.ss-summer:not(.sc-night) .sun,html.ss-summer:not(.sc-night) #scene .sun{filter:saturate(1.3)}" +
    /* 가을: 누런 풀밭, 단풍 */
    "html.ss-autumn:not(.sc-night){--sky1:#86c6e8;--sky2:#e6f1f2;--grass:#cfcf6c;--grass2:#b9b553;--pen:#e2dfa0;--scene-grass:#cfcf6c}" +
    "html.ss-autumn.sc-night{--grass:#6d6a3a;--grass2:#5c5830;--pen:#a8a46c;--scene-grass:#6d6a3a}" +
    R3("html.ss-autumn .tree.t3", "#f0a03a", "#e8703a", "#f4c24a") + R3("html.ss-autumn #scene .tr", "#f0a03a", "#e8703a", "#f4c24a") +
    "html.ss-autumn .ranch .pen{background-image:radial-gradient(#cfc77a 18%,transparent 20%),radial-gradient(#cfc77a 18%,transparent 20%)!important}" +
    /* 겨울: 눈 덮인 들판, 하얀 나무 */
    "html.ss-winter:not(.sc-night){--sky1:#a3cfe8;--sky2:#eaf3f8;--grass:#cdc69a;--grass2:#b8b081;--pen:#e0dbb7;--scene-grass:#cdc69a}" +
    "html.ss-winter.sc-night{--grass:#66644c;--grass2:#57553f;--pen:#a09c80;--scene-grass:#66644c}" +
    "html.ss-winter .ranch .pen{background-image:radial-gradient(#cbc493 18%,transparent 20%),radial-gradient(#cbc493 18%,transparent 20%)!important}" +
    /* 잎이 다 떨어진 나무: 잎(동그라미·뾰족한 잎)을 숨기고 가지를 보여 줌 */
    ".tree .bare,#scene .tr .bare{display:none}" +
    "html.ss-winter:not(.wx-snow) .tree .bare,html.ss-winter:not(.wx-snow) #scene .tr .bare{display:inline}" +
    "html.ss-winter:not(.wx-snow) .tree circle,html.ss-winter:not(.wx-snow) #scene .tr circle,html.ss-winter:not(.wx-snow) .tree path:not([fill=none]),html.ss-winter:not(.wx-snow) #scene .tr path:not([fill=none]){opacity:0}" +
    /* 눈 오는 날에만: 하얀 들판 + 눈 덮인 나무 (계절과 상관없이) */
    "html.wx-snow:not(.sc-night){--grass:#eef3f6;--grass2:#dbe5eb;--pen:#f4f7f9;--scene-grass:#eef3f6}" +
    "html.wx-snow.sc-night{--grass:#8593a0;--grass2:#73818e;--pen:#a7b4bf;--scene-grass:#8593a0}" +
    "html.wx-snow .ranch .pen{background-image:radial-gradient(#dde6ec 18%,transparent 20%),radial-gradient(#dde6ec 18%,transparent 20%)!important}" +
    "html.wx-snow .tree circle,html.wx-snow #scene .tr circle,html.wx-snow .tree path:not([fill=none]),html.wx-snow #scene .tr path:not([fill=none]){fill:#f3f7fa!important;stroke:#9cb0bf;stroke-width:1.6}" +
    /* 떨어지는 꽃잎·낙엽·눈송이, 여름밤 반딧불 */
    ".ssfx{position:absolute;inset:0;pointer-events:none;overflow:hidden}" +
    ".ssfx i{position:absolute;top:-24px;display:block;font-style:normal;animation:ssfall linear infinite;will-change:transform}" +
    ".ssfx i.pt{width:10px;height:7px;border-radius:70% 0 70% 0;background:#f8bfd2;box-shadow:inset -1px -1px 0 #f09ab8}" +
    ".ssfx i.sn{width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 3px rgba(255,255,255,.9)}" +
    ".ssfx i.lf{font-size:16px;line-height:1}" +
    ".ssfx i.ff{top:auto;width:5px;height:5px;border-radius:50%;background:#fff6a0;box-shadow:0 0 8px 3px rgba(255,240,120,.7);animation:ssfly ease-in-out infinite}" +
    "@keyframes ssfall{0%{transform:translate(0,0) rotate(0)}25%{transform:translate(18px,25vh) rotate(90deg)}50%{transform:translate(-10px,50vh) rotate(180deg)}75%{transform:translate(14px,75vh) rotate(270deg)}100%{transform:translate(0,105vh) rotate(360deg)}}" +
    "@keyframes ssfly{0%,100%{transform:translate(0,0);opacity:0}20%{opacity:1}50%{transform:translate(30px,-26px);opacity:.3}70%{opacity:1}}" +
    "html.wx-wet .ssfx,html.wx-snow .ssfx i.sn{display:none}" +
    "@media (prefers-reduced-motion:reduce){.ssfx{display:none}}";
  document.head.appendChild(sst);
  var BARE_PINE = '<g class="bare" fill="none" stroke="#7a4a22" stroke-linecap="round"><path fill="none" d="M30 74V12" stroke-width="5"/><path fill="none" d="M30 22l-8 6M30 22l8 6M30 34l-13 8M30 34l13 8M30 47l-17 10M30 47l17 10M30 60l-20 11M30 60l20 11" stroke-width="2.6"/></g>';
  var BARE_ROUND = '<g class="bare" fill="none" stroke="#8a5528" stroke-linecap="round"><path fill="none" d="M47 64L41 30M48 62l13-30M41 30l-14-11M41 30l3-18M61 32l14-10M61 32l-2-18M37 48l-17-6M58 48l18-7M27 19l-6-6M75 22l6-7" stroke-width="3.6"/></g>';
  function bareTrees() { var L = document.querySelectorAll(".tree, #scene .tr"); for (var i = 0; i < L.length; i++) { var t = L[i]; if (t.querySelector(".bare")) continue; var vb = t.getAttribute("viewBox") || ""; t.insertAdjacentHTML("beforeend", /^0 0 60 /.test(vb) ? BARE_PINE : BARE_ROUND); } }
  function mountSeason() {
    bareTrees();
    var host = document.getElementById("scene") || document.querySelector(".sky"); if (!host || host.querySelector(".ssfx")) return;
    var fx = document.createElement("div"); fx.className = "ssfx"; fx.setAttribute("aria-hidden", "true");
    var night = root.classList.contains("sc-night"), n = 0, h = "", r = function (a, b) { return a + Math.random() * (b - a); };
    if (SEASON === "spring") { n = 16; for (var i = 0; i < n; i++) h += '<i class="pt" style="left:' + r(0, 100).toFixed(1) + '%;animation-duration:' + r(11, 19).toFixed(1) + 's;animation-delay:-' + r(0, 19).toFixed(1) + 's;opacity:' + r(.6, .95).toFixed(2) + '"></i>'; }
    else if (SEASON === "autumn") { var L = ["🍂", "🍁", "🍂"]; n = 12; for (var j = 0; j < n; j++) h += '<i class="lf" style="left:' + r(0, 100).toFixed(1) + '%;font-size:' + r(12, 20).toFixed(0) + 'px;animation-duration:' + r(12, 20).toFixed(1) + 's;animation-delay:-' + r(0, 20).toFixed(1) + 's">' + L[j % 3] + '</i>'; }
    else if (SEASON === "summer" && night) { n = 10; for (var q = 0; q < n; q++) h += '<i class="ff" style="left:' + r(5, 95).toFixed(1) + '%;bottom:' + r(4, 40).toFixed(1) + '%;animation-duration:' + r(4, 8).toFixed(1) + 's;animation-delay:-' + r(0, 8).toFixed(1) + 's"></i>'; }
    if (!h) return; fx.innerHTML = h;
    var wx = host.querySelector(".wx"); if (wx) host.insertBefore(fx, wx); else host.appendChild(fx);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountSeason); else setTimeout(mountSeason, 0);

  window.siteScene = { sunAltitude: function () { return sunAlt(new Date(), LOC.lat, LOC.lon); }, twilight: function () { return twilight(new Date()); }, phase: phase, weather: function () { return WX; }, season: function () { return SEASON; } };
})();
