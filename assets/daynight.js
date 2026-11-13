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
      if (r.state === "granted") navigator.geolocation.getCurrentPosition(function (pos) { LOC = { lat: pos.coords.latitude, lon: pos.coords.longitude }; apply(); }, function () {}, { maximumAge: 3600000 });
    }).catch(function () {});
  } catch (e) {}
  window.siteScene = { sunAltitude: function () { return sunAlt(new Date(), LOC.lat, LOC.lon); }, twilight: function () { return twilight(new Date()); }, phase: phase };
})();
