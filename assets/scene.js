/* 치영의 교회 생활 즐기기 — shared ranch background (sky, sun, clouds, hills, trees, grass).
   Drawn once as a fixed layer behind the page. Pages can tint the grass with
   document.documentElement.style.setProperty('--scene-grass', '#c8e6b8'). */
(function () {
  if (document.getElementById("scene")) return;
  var css =
    "html{background:#d6f2fc}body{background:transparent!important}" +
    "#scene{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none;" +
    "background:linear-gradient(#8fd6f5 0,#d6f2fc 40%,#d6f2fc 52%,var(--scene-grass,#a9d86e) 52.1%)}" +
    "#scene .sun{position:absolute;top:-30px;right:-24px;width:170px;height:170px;animation:sc-spin 40s linear infinite}" +
    "#scene .cl{position:absolute;left:0;background:#fff;border-radius:999px;opacity:.95;animation:sc-drift linear infinite}" +
    "#scene .cl::before,#scene .cl::after{content:'';position:absolute;background:#fff;border-radius:50%}" +
    "#scene .cl::before{width:55%;height:150%;left:15%;bottom:20%}#scene .cl::after{width:40%;height:120%;right:12%;bottom:25%}" +
    "#scene .h1,#scene .h2{position:absolute;bottom:47.9%;border-radius:50% 50% 0 0}" +
    "#scene .h1{left:-10%;width:70%;height:13vh;background:var(--scene-grass2,color-mix(in srgb,var(--scene-grass,#a9d86e) 86%,#2d5a1e))}" +
    "#scene .h2{right:-12%;width:75%;height:9vh;background:var(--scene-grass,#a9d86e)}" +
    "#scene .tr{position:absolute;bottom:48%}" +
    "#scene .tufts{position:absolute;left:0;right:0;top:52%;bottom:0;background-image:radial-gradient(rgba(255,255,255,.16) 18%,transparent 20%),radial-gradient(rgba(0,0,0,.035) 18%,transparent 20%);background-size:34px 34px;background-position:0 0,17px 17px}" +
    "#scene .fence{position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(transparent 12px,#d98680 12px 14px,transparent 14px 26px,#d98680 26px 28px,transparent 28px),repeating-linear-gradient(90deg,#d98680 0 2px,#f4bdb6 2px 15px,#d98680 15px 17px,transparent 17px 26px);opacity:.9}" +
    "@keyframes sc-spin{to{transform:rotate(360deg)}}" +
    "@keyframes sc-drift{from{transform:translateX(-320px)}to{transform:translateX(calc(100vw + 320px))}}" +
    "@media (prefers-reduced-motion:reduce){#scene *{animation:none!important}}" +
    "@media print{#scene{display:none}html{background:#fff}}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);
  var sun = '<svg class="sun" viewBox="0 0 200 200"><g stroke="#f7c531" stroke-width="7" stroke-linecap="round"><line x1="100" y1="10" x2="100" y2="34"/><line x1="100" y1="166" x2="100" y2="190"/><line x1="10" y1="100" x2="34" y2="100"/><line x1="166" y1="100" x2="190" y2="100"/><line x1="36" y1="36" x2="53" y2="53"/><line x1="147" y1="147" x2="164" y2="164"/><line x1="36" y1="164" x2="53" y2="147"/><line x1="147" y1="53" x2="164" y2="36"/></g><circle cx="100" cy="100" r="50" fill="#fbd33d"/></svg>';
  var pine = function (l, w, c, s) { return '<svg class="tr" style="left:' + l + ';width:' + w + '" viewBox="0 0 60 100"><rect x="26" y="70" width="8" height="30" fill="#8a5528"/><path d="M30 2L6 40h12L2 66h14L0 84h60L44 66h14L42 40h12Z" fill="' + c + '" stroke="' + s + '" stroke-width="2" stroke-linejoin="round"/></svg>'; };
  var round = '<svg class="tr" style="right:4%;width:clamp(60px,10vw,110px)" viewBox="0 0 100 100"><path d="M46 100V60l-12-10M50 70l14-12" stroke="#8a5528" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="40" cy="38" r="24" fill="#6fbf5a"/><circle cx="64" cy="34" r="22" fill="#86cf6a"/><circle cx="52" cy="18" r="18" fill="#7ac862"/><circle cx="72" cy="54" r="14" fill="#6fbf5a"/></svg>';
  var d = document.createElement("div");
  d.id = "scene";
  d.setAttribute("aria-hidden", "true");
  d.innerHTML = sun +
    '<div class="cl" style="width:220px;height:60px;top:14%;animation-duration:80s;animation-delay:-20s"></div>' +
    '<div class="cl" style="width:160px;height:46px;top:7%;animation-duration:110s;animation-delay:-70s"></div>' +
    '<div class="cl" style="width:250px;height:66px;top:25%;animation-duration:130s;animation-delay:-100s"></div>' +
    '<div class="h1"></div><div class="h2"></div>' +
    pine("2%", "clamp(50px,8vw,100px)", "#3f8f4a", "#2d6b36") + pine("clamp(40px,7vw,90px)", "clamp(38px,6vw,76px)", "#5aa957", "#3b7d3c") + round +
    '<div class="tufts"></div><div class="fence"></div>';
  var put = function () { document.body.insertBefore(d, document.body.firstChild); };
  if (document.body) put(); else document.addEventListener("DOMContentLoaded", put);
})();
