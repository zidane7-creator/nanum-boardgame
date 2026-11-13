/* 모든 메뉴 공용: 홈(목장)으로 돌아가는 버튼 */
(function () {
  if (document.getElementById("homeFab")) return;
  const href = (document.currentScript && document.currentScript.dataset.home) || "../";
  const st = document.createElement("style");
  st.textContent = `
  #homeFab{position:fixed;left:14px;bottom:14px;z-index:9000;display:inline-flex;align-items:center;gap:6px;
    padding:8px 14px 8px 10px;border-radius:999px;background:#fff8e6;color:#3b2f2a;text-decoration:none;
    border:2.5px solid #3b2f2a;box-shadow:0 3px 0 #3b2f2a;font:16px/1 "Jua","Apple SD Gothic Neo","Malgun Gothic",sans-serif;
    transition:transform .15s}
  #homeFab:hover{transform:translateY(-2px)}#homeFab:active{transform:translateY(2px);box-shadow:0 1px 0 #3b2f2a}
  #homeFab .hi{font-size:20px}
  #homeFab.inbar{position:static;box-shadow:none;border-width:1.5px;padding:3px 10px 3px 7px;font-size:14px;margin-right:8px;flex:none}
  #homeFab.inbar .hi{font-size:16px}
  @media (max-width:600px){#homeFab:not(.inbar){left:10px;bottom:10px;padding:8px}#homeFab:not(.inbar) .ht{display:none}}
  @media print{#homeFab{display:none}}`;
  document.head.appendChild(st);
  const a = document.createElement("a");
  a.id = "homeFab"; a.href = href; a.title = "치영의 교회 생활 즐기기 홈으로";
  a.setAttribute("aria-label", "홈으로");
  a.innerHTML = '<span class="hi">🏠</span><span class="ht">홈</span>';
  /* full-screen editors: sit at the start of their menu bar instead of floating over the canvas */
  const bar = document.getElementById("menubar") || document.querySelector("[data-home-bar]");
  if (bar) { a.classList.add("inbar"); bar.insertBefore(a, bar.firstChild); }
  else document.body.appendChild(a);
})();
