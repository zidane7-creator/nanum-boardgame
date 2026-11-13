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
  /* 밤에는 하늘 위에 바로 놓인 어두운 글자만 밝게 바꿈 (카드 안 글자는 그대로) */
  function opaque(el) { var c = getComputedStyle(el); return (c.backgroundImage && c.backgroundImage !== "none") || !/rgba\(0, 0, 0, 0\)|transparent/.test(c.backgroundColor); }
  function dark(col) { var m = col.match(/\d+(\.\d+)?/g); if (!m) return false; return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 < 0.4; }
  function markSky() {
    var els = document.querySelectorAll("body h1, body h2, body h3, body p, body .sub, body small, body label, body .muted, body .note, body .credit");
    for (var i = 0; i < els.length; i++) {
      var el = els[i]; if (el.closest("#scene")) continue;
      var ok = true;
      for (var a = el; a && a !== document.body; a = a.parentElement) { if (opaque(a)) { ok = false; break; } }
      if (ok && dark(getComputedStyle(el).color)) el.classList.add("sc-sky");
    }
  }
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
